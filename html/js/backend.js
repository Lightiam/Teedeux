/**
 * Teedeux commerce backend (browser) — cart, checkout, orders, coupons, favorites.
 * Persists to localStorage; emits events for the monitoring screen.
 * Same shape as /api/commerce/* on the Next.js side.
 */
(function (global) {
  'use strict';

  var Teedeux = (global.Teedeux = global.Teedeux || {});
  var KEY = 'teedeux-commerce-v1';
  var EVENT_KEY = 'teedeux-monitor-events-v1';
  var DELIVERY_FEE_CENTS = 2000;
  var listeners = [];

  function catalog() {
    return Teedeux.catalog;
  }

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  function money(cents) {
    return (Number(cents) || 0) / 100;
  }

  function defaultState() {
    return {
      cart: { items: [], promoCode: null },
      favorites: [],
      collections: [
        { id: 'col_staples', name: 'Swallow & Staples', productIds: ['pounded-yam-flour', 'fufu-flour', 'gari-white', 'attieke'] },
        { id: 'col_spices', name: 'Spices & Soups', productIds: ['egusi-seeds', 'suya-spice', 'jollof-spice', 'ogbono-seeds'] },
        { id: 'col_snacks', name: 'Snacks', productIds: ['plantain-chips', 'chin-chin', 'agege-bread'] },
      ],
      addresses: [
        {
          id: 'addr_home',
          label: 'Home Address',
          line1: '1200 Peachtree St NE',
          city: 'Atlanta',
          state: 'GA',
          postalCode: '30309',
          selected: true,
        },
        {
          id: 'addr_office',
          label: 'Office Address',
          line1: '6100 Richmond Ave',
          city: 'Houston',
          state: 'TX',
          postalCode: '77057',
          selected: false,
        },
      ],
      payments: [
        { id: 'pay_mc', brand: 'Master Card', last4: '5588', selected: true },
        { id: 'pay_visa', brand: 'Visa Card', last4: '4242', selected: false },
        { id: 'pay_paypal', brand: 'Pay Pal', last4: '', selected: false },
        { id: 'pay_cod', brand: 'Cash on Delivery', last4: '', selected: false },
      ],
      coupons: [
        { id: 'c1', code: 'PALM10', title: '10% Red Palm Oil', expires: '2026-12-31', claimed: false, productHint: 'red-palm-oil', percent: 10, imageUrl: '/img/products/red-palm-oil.jpg' },
        { id: 'c2', code: 'PLANTAIN25', title: '25% Plantain Sale', expires: '2026-11-30', claimed: false, productHint: 'ripe-plantains', percent: 25, imageUrl: '/img/products/ripe-plantains.jpg' },
        { id: 'c3', code: 'EGUSI15', title: '15% Egusi Seeds', expires: '2026-10-31', claimed: false, productHint: 'egusi-seeds', percent: 15, imageUrl: '/img/products/egusi-seeds.jpg' },
        { id: 'c4', code: 'FISH20', title: '20% Stockfish', expires: '2026-09-30', claimed: false, productHint: 'stockfish', percent: 20, imageUrl: '/img/products/stockfish.jpg' },
        { id: 'c5', code: 'SUYA10', title: '10% Suya Spice', expires: '2026-12-15', claimed: false, productHint: 'suya-spice', percent: 10, imageUrl: '/img/products/suya-spice.jpg' },
      ],
      orders: [],
      reviews: {},
    };
  }

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      return Object.assign(defaultState(), JSON.parse(raw));
    } catch (e) {
      return defaultState();
    }
  }

  var state = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
    listeners.forEach(function (fn) {
      try {
        fn(snapshot());
      } catch (e) {}
    });
  }

  function pushEvent(type, detail) {
    var events = [];
    try {
      events = JSON.parse(localStorage.getItem(EVENT_KEY) || '[]');
    } catch (e) {
      events = [];
    }
    events.unshift({
      id: uid('evt'),
      at: new Date().toISOString(),
      type: type,
      detail: detail || {},
    });
    events = events.slice(0, 200);
    try {
      localStorage.setItem(EVENT_KEY, JSON.stringify(events));
    } catch (e) {}
    try {
      global.dispatchEvent(new CustomEvent('teedeux-monitor', { detail: { type: type, detail: detail } }));
    } catch (e) {}
  }

  function getProduct(id) {
    return catalog().getProduct(id);
  }

  function cartLines() {
    return state.cart.items
      .map(function (line) {
        var p = getProduct(line.productId);
        if (!p) return null;
        return {
          productId: p.id,
          name: p.name,
          size: p.size,
          imageUrl: p.imageUrl,
          unitCents: p.priceCents,
          quantity: line.quantity,
          lineCents: p.priceCents * line.quantity,
        };
      })
      .filter(Boolean);
  }

  function promoDiscountCents(subtotal) {
    if (!state.cart.promoCode) return 0;
    var coupon = state.coupons.filter(function (c) {
      return c.code === state.cart.promoCode && c.claimed;
    })[0];
    if (!coupon) return 0;
    return Math.round(subtotal * (coupon.percent / 100));
  }

  function totals() {
    var lines = cartLines();
    var subtotal = lines.reduce(function (n, l) {
      return n + l.lineCents;
    }, 0);
    var discount = promoDiscountCents(subtotal);
    var delivery = lines.length ? DELIVERY_FEE_CENTS : 0;
    var total = Math.max(0, subtotal - discount + delivery);
    return {
      subtotalCents: subtotal,
      discountCents: discount,
      deliveryCents: delivery,
      totalCents: total,
      promoCode: state.cart.promoCode,
      itemCount: lines.reduce(function (n, l) {
        return n + l.quantity;
      }, 0),
    };
  }

  function snapshot() {
    return {
      cart: { items: cartLines(), totals: totals(), promoCode: state.cart.promoCode },
      favorites: state.favorites.slice(),
      collections: state.collections.slice(),
      addresses: state.addresses.slice(),
      payments: state.payments.slice(),
      coupons: state.coupons.slice(),
      orders: state.orders.slice(),
      reviews: Object.assign({}, state.reviews),
    };
  }

  function categories() {
    var aisles = catalog().AISLES || [];
    return aisles.map(function (a) {
      return {
        id: a.id,
        name: a.shortName || a.name,
        label: a.name,
        imageUrl: a.logoUrl,
        examples: a.examples,
        count: (catalog().PRODUCTS || []).filter(function (p) {
          return p.category === a.id;
        }).length,
      };
    });
  }

  function products(opts) {
    opts = opts || {};
    var list = (catalog().PRODUCTS || []).slice();
    if (opts.category) {
      list = list.filter(function (p) {
        return p.category === opts.category;
      });
    }
    if (opts.q) {
      var q = String(opts.q).toLowerCase();
      list = list.filter(function (p) {
        return p.name.toLowerCase().indexOf(q) !== -1 || (p.description || '').toLowerCase().indexOf(q) !== -1;
      });
    }
    return list.map(function (p) {
      var compareAt = p.compareAtCents || null;
      var badge = p.badge || null;
      if (!badge && compareAt && compareAt > p.priceCents) {
        var pct = Math.round((1 - p.priceCents / compareAt) * 100);
        badge = pct + '% OFF';
      }
      return Object.assign({}, p, { badge: badge, compareAtCents: compareAt });
    });
  }

  var api = {
    subscribe: function (fn) {
      listeners.push(fn);
      return function () {
        listeners = listeners.filter(function (x) {
          return x !== fn;
        });
      };
    },
    getState: snapshot,
    categories: categories,
    products: products,
    getProduct: getProduct,

    // Cart
    getCart: function () {
      return snapshot().cart;
    },
    addToCart: function (productId, qty) {
      qty = Math.max(1, Math.floor(Number(qty) || 1));
      var found = state.cart.items.filter(function (i) {
        return i.productId === productId;
      })[0];
      if (found) found.quantity += qty;
      else state.cart.items.push({ productId: productId, quantity: qty });
      save();
      pushEvent('cart.add', { productId: productId, qty: qty });
      return snapshot().cart;
    },
    setQty: function (productId, qty) {
      qty = Math.floor(Number(qty) || 0);
      if (qty <= 0) {
        state.cart.items = state.cart.items.filter(function (i) {
          return i.productId !== productId;
        });
      } else {
        state.cart.items.forEach(function (i) {
          if (i.productId === productId) i.quantity = qty;
        });
      }
      save();
      pushEvent('cart.qty', { productId: productId, qty: qty });
      return snapshot().cart;
    },
    removeFromCart: function (productId) {
      state.cart.items = state.cart.items.filter(function (i) {
        return i.productId !== productId;
      });
      save();
      pushEvent('cart.remove', { productId: productId });
      return snapshot().cart;
    },
    clearCart: function () {
      state.cart.items = [];
      state.cart.promoCode = null;
      save();
      pushEvent('cart.clear', {});
    },
    applyPromo: function (code) {
      code = String(code || '')
        .trim()
        .toUpperCase();
      var coupon = state.coupons.filter(function (c) {
        return c.code === code;
      })[0];
      if (!coupon) return { ok: false, error: 'Invalid coupon code' };
      coupon.claimed = true;
      state.cart.promoCode = code;
      save();
      pushEvent('coupon.apply', { code: code });
      return { ok: true, cart: snapshot().cart };
    },

    // Favorites
    toggleFavorite: function (productId) {
      var i = state.favorites.indexOf(productId);
      if (i >= 0) state.favorites.splice(i, 1);
      else state.favorites.push(productId);
      save();
      pushEvent('favorite.toggle', { productId: productId });
      return state.favorites.slice();
    },
    isFavorite: function (productId) {
      return state.favorites.indexOf(productId) !== -1;
    },
    getCollections: function () {
      return state.collections.map(function (c) {
        var imgs = c.productIds
          .map(function (id) {
            var p = getProduct(id);
            return p && p.imageUrl;
          })
          .filter(Boolean)
          .slice(0, 4);
        return {
          id: c.id,
          name: c.name,
          count: c.productIds.length,
          images: imgs,
          productIds: c.productIds.slice(),
        };
      });
    },

    // Addresses / payments
    selectAddress: function (id) {
      state.addresses.forEach(function (a) {
        a.selected = a.id === id;
      });
      save();
      return state.addresses.slice();
    },
    selectPayment: function (id) {
      state.payments.forEach(function (p) {
        p.selected = p.id === id;
      });
      save();
      return state.payments.slice();
    },

    // Coupons
    claimCoupon: function (idOrCode) {
      var c = state.coupons.filter(function (x) {
        return x.id === idOrCode || x.code === idOrCode;
      })[0];
      if (!c) return { ok: false, error: 'Coupon not found' };
      c.claimed = true;
      save();
      pushEvent('coupon.claim', { code: c.code });
      return { ok: true, coupon: c };
    },

    // Checkout → order
    checkout: function () {
      var cart = snapshot().cart;
      if (!cart.items.length) return { ok: false, error: 'Cart is empty' };
      var addr = state.addresses.filter(function (a) {
        return a.selected;
      })[0];
      var pay = state.payments.filter(function (p) {
        return p.selected;
      })[0];
      if (!addr) return { ok: false, error: 'Select a delivery address' };
      if (!pay) return { ok: false, error: 'Select a payment method' };

      var orderId = uid('ord');
      var orderNumber = 'TDX-' + Math.floor(100000 + Math.random() * 900000);
      var now = new Date();
      var order = {
        id: orderId,
        orderNumber: orderNumber,
        status: 'PROCESSING',
        tab: 'Processing',
        createdAt: now.toISOString(),
        items: cart.items.map(function (l) {
          return {
            productId: l.productId,
            name: l.name,
            size: l.size,
            imageUrl: l.imageUrl,
            unitCents: l.unitCents,
            quantity: l.quantity,
            lineCents: l.lineCents,
          };
        }),
        totals: cart.totals,
        address: addr,
        payment: { brand: pay.brand, last4: pay.last4 },
        courier: {
          name: 'Ada Okonkwo',
          title: 'Teedeux Delivery Partner',
          phone: '+1 (404) 555-0142',
          avatar: '/img/stores/mama-jones.jpg',
        },
        timeline: [
          { key: 'paid', label: 'Payment Has Been Verified', status: 'Completed', at: now.toISOString() },
          { key: 'pickup', label: 'Waiting for Pick Up', status: 'On Transit', at: null },
          { key: 'courier', label: 'Being Sent by Courier', status: 'Pending', at: null },
          { key: 'complete', label: 'Order Complete', status: 'Pending', at: null },
        ],
      };
      state.orders.unshift(order);
      state.cart.items = [];
      state.cart.promoCode = null;
      save();
      pushEvent('order.created', { orderNumber: orderNumber, totalCents: order.totals.totalCents });

      // Simulate progression for tracking demo
      setTimeout(function () {
        api.advanceOrder(orderId, 'pickup');
      }, 4000);
      setTimeout(function () {
        api.advanceOrder(orderId, 'courier');
      }, 9000);
      setTimeout(function () {
        api.advanceOrder(orderId, 'complete');
      }, 15000);

      return { ok: true, order: order };
    },

    advanceOrder: function (orderId, step) {
      var order = state.orders.filter(function (o) {
        return o.id === orderId;
      })[0];
      if (!order) return null;
      var now = new Date().toISOString();
      order.timeline.forEach(function (t) {
        if (t.key === step) {
          t.status = step === 'complete' ? 'Completed' : 'On Transit';
          t.at = now;
        }
      });
      if (step === 'pickup' || step === 'courier') {
        order.status = 'PROCESSING';
        order.tab = 'Processing';
      }
      if (step === 'complete') {
        order.status = 'DELIVERED';
        order.tab = 'Delivered';
        order.timeline.forEach(function (t) {
          if (t.status === 'Pending') {
            t.status = 'Completed';
            t.at = t.at || now;
          }
        });
      }
      save();
      pushEvent('order.advance', { orderId: orderId, step: step, status: order.status });
      return order;
    },

    cancelOrder: function (orderId) {
      var order = state.orders.filter(function (o) {
        return o.id === orderId;
      })[0];
      if (!order) return null;
      order.status = 'CANCELLED';
      order.tab = 'Canceled';
      save();
      pushEvent('order.cancel', { orderId: orderId });
      return order;
    },

    listOrders: function (tab) {
      var list = state.orders.slice();
      if (tab && tab !== 'All') {
        list = list.filter(function (o) {
          return o.tab === tab;
        });
      }
      return list;
    },

    getOrder: function (id) {
      return (
        state.orders.filter(function (o) {
          return o.id === id || o.orderNumber === id;
        })[0] || null
      );
    },

    leaveReview: function (orderId, productId, rating, text) {
      var key = orderId + ':' + productId;
      state.reviews[key] = { rating: rating, text: text || '', at: new Date().toISOString() };
      save();
      pushEvent('review.create', { orderId: orderId, productId: productId, rating: rating });
      return state.reviews[key];
    },

    // Monitoring
    getMonitor: function () {
      var events = [];
      try {
        events = JSON.parse(localStorage.getItem(EVENT_KEY) || '[]');
      } catch (e) {
        events = [];
      }
      var orders = state.orders;
      return {
        healthy: true,
        build: 'commerce-v1',
        at: new Date().toISOString(),
        stats: {
          products: (catalog().PRODUCTS || []).length,
          categories: categories().length,
          cartItems: totals().itemCount,
          cartTotalCents: totals().totalCents,
          orders: orders.length,
          processing: orders.filter(function (o) {
            return o.tab === 'Processing';
          }).length,
          delivered: orders.filter(function (o) {
            return o.tab === 'Delivered';
          }).length,
          canceled: orders.filter(function (o) {
            return o.tab === 'Canceled';
          }).length,
          couponsClaimed: state.coupons.filter(function (c) {
            return c.claimed;
          }).length,
          favorites: state.favorites.length,
        },
        recentOrders: orders.slice(0, 10),
        events: events.slice(0, 50),
      };
    },
  };

  // Enrich a few products with sale badges for listing UI
  function enrichCatalogBadges() {
    var C = catalog();
    if (!C || !C.PRODUCTS) return;
    var sales = {
      'plantain-chips': 499,
      'chin-chin': 649,
      'agege-bread': 599,
      'jollof-spice': 749,
    };
    C.PRODUCTS.forEach(function (p) {
      if (sales[p.id] && sales[p.id] > p.priceCents) {
        p.compareAtCents = sales[p.id];
        if (!p.badge) p.badge = 'BEST SALE';
      }
    });
  }

  enrichCatalogBadges();
  Teedeux.backend = api;
})(typeof window !== 'undefined' ? window : globalThis);
