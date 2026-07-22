/**
 * Teedeux SPA — Wegmans-style grocery UI.
 * No onboarding / splash. Default route: account → shop.
 */
(function () {
  'use strict';

  var C = null;
  var S = null;
  var main = null;
  var pdpQty = 1;

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function money(cents) {
    return C.formatCents(cents);
  }

  function toast(msg) {
    var el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () {
      el.classList.remove('show');
    }, 1600);
  }

  function parseRoute() {
    var hash = (location.hash || '#/account').replace(/^#/, '');
    if (!hash.startsWith('/')) hash = '/' + hash;
    var segs = hash.split('?')[0].split('/').filter(Boolean);
    var name = segs[0] || 'account';
    // No onboarding / splash / auth walls
    if (name === 'splash' || name === 'onboarding' || name === 'welcome' || name === 'home') {
      name = 'account';
    }
    return { segs: segs, name: name };
  }

  function go(path) {
    location.hash = path.startsWith('#') ? path : '#' + path;
  }

  function qtyInCart() {
    return (S.cart.items || []).reduce(function (n, i) {
      return n + i.quantity;
    }, 0);
  }

  function setNav(active) {
    var n = qtyInCart();
    var badge = document.getElementById('nav-cart-badge');
    if (n > 0) {
      badge.hidden = false;
      badge.textContent = String(n);
    } else {
      badge.hidden = true;
    }
    document.querySelectorAll('.nav-item').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-nav') === active);
    });
  }

  function currentStore() {
    return C.getStore(S.session.selectedStoreId);
  }

  function addProduct(id, qty) {
    qty = qty || 1;
    if (typeof S.addToCart === 'function') {
      S.addToCart(id, qty);
    } else if (typeof S.addItem === 'function') {
      S.addItem(id, qty);
    } else {
      // Fallback mutate via store API surface
      var items = S.cart.items || [];
      var found = null;
      for (var i = 0; i < items.length; i++) {
        if (items[i].productId === id) found = items[i];
      }
      if (found) found.quantity += qty;
      else items.push({ productId: id, quantity: qty });
      if (S.setCart) S.setCart({ items: items, tipCents: S.cart.tipCents || 0 });
    }
    toast('Added to Your Items');
    render();
  }

  function productCard(p, opts) {
    opts = opts || {};
    return (
      '<article class="product-card" data-open-product="' +
      esc(p.id) +
      '">' +
      '<div class="product-card__img-wrap">' +
      (p.badge ? '<span class="badge-pill">' + esc(p.badge) + '</span>' : '') +
      '<img src="' +
      esc(p.imageUrl) +
      '" alt="' +
      esc(p.name) +
      '" loading="lazy" />' +
      '<button type="button" class="add-btn" data-add="' +
      esc(p.id) +
      '" aria-label="Add ' +
      esc(p.name) +
      '">+</button>' +
      '</div>' +
      '<p class="product-card__price">' +
      money(p.priceCents) +
      '</p>' +
      '<p class="product-card__name">' +
      esc(p.name) +
      '</p>' +
      '<p class="product-card__size">' +
      esc(p.size) +
      (opts.showUnit && p.unitPrice ? ' · ' + esc(p.unitPrice) : '') +
      '</p>' +
      '</article>'
    );
  }

  function viewAccount() {
    setNav('account');
    var stores = C.STORES.map(function (st) {
      return (
        '<div class="store-card">' +
        '<img src="' +
        esc(st.logoUrl) +
        '" alt="' +
        esc(st.name) +
        '" />' +
        '<div>' +
        '<p class="store-card__name">' +
        esc(st.name) +
        '</p>' +
        '<p class="store-card__meta">' +
        esc(st.lastVisited) +
        '</p>' +
        '<div class="store-card__actions">' +
        '<button type="button" class="pill-btn primary" data-open-store="' +
        esc(st.id) +
        '" data-mode="Delivery">Delivery</button>' +
        '<button type="button" class="pill-btn" data-open-store="' +
        esc(st.id) +
        '" data-mode="Pickup">Pickup</button>' +
        '</div></div></div>'
      );
    }).join('');

    main.innerHTML =
      '<section class="account-screen">' +
      '<div class="account-hero">' +
      '<h1>Bola</h1>' +
      '<a href="#/account">View account</a>' +
      '</div>' +
      '<div class="account-actions">' +
      '<button type="button" class="account-action" data-go="#/items"><span class="account-action__icon blue">↻</span><strong>Re-order</strong></button>' +
      '<button type="button" class="account-action" data-go="#/coupons"><span class="account-action__icon green">$</span><strong>Sales</strong></button>' +
      '<button type="button" class="account-action" data-go="#/items"><span class="account-action__icon yellow">☰</span><strong>Shopping list</strong></button>' +
      '</div>' +
      '<p class="section-label">Your stores</p>' +
      stores +
      '</section>';
  }

  function viewShop(query) {
    setNav('shop');
    var store = currentStore();
    var products = C.productsForStore(store.id);
    if (query) {
      var q = query.toLowerCase();
      products = products.filter(function (p) {
        return (
          p.name.toLowerCase().indexOf(q) !== -1 ||
          p.category.toLowerCase().indexOf(q) !== -1
        );
      });
    }
    var arrivals = products.slice(0, 10);
    var pantry = products.filter(function (p) {
      return p.shipNationwide;
    }).slice(0, 10);
    var fresh = products.filter(function (p) {
      return p.category === 'Produce' || p.category === 'Protein';
    }).slice(0, 10);
    var count = qtyInCart();

    main.innerHTML =
      '<header class="shop-header">' +
      '<div class="shop-header__row">' +
      '<img class="shop-logo" src="' +
      esc(store.logoUrl) +
      '" alt="" />' +
      '<button type="button" class="shop-store-btn" data-go="#/account"><span>' +
      esc(store.shortName || store.name) +
      '</span> ▾</button>' +
      '<button type="button" class="cart-fab" data-go="#/items" aria-label="Your Items">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M4 7h16l-1.2 12.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 7z"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/></svg>' +
      (count ? '<span class="cart-fab__count">' + count + '</span>' : '') +
      '</button></div>' +
      '<form class="search-bar" id="search-form">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
      '<input type="search" name="q" placeholder="Search African food items" value="' +
      esc(query || '') +
      '" aria-label="Search" />' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M7 7v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7"/><path d="M9 7V5h6v2"/></svg>' +
      '</form></header>' +
      '<a class="promo-banner" href="#/coupons">' +
      '<div class="promo-banner__copy"><strong>' +
      esc(C.PROMO.title) +
      '</strong><span>' +
      esc(C.PROMO.subtitle) +
      '</span></div>' +
      '<img src="' +
      esc(C.PROMO.imageUrl) +
      '" alt="" />' +
      '</a>' +
      rail('New arrivals', arrivals) +
      rail('Pantry staples', pantry) +
      rail('Fresh & protein', fresh);
  }

  function rail(title, list) {
    if (!list.length) return '';
    return (
      '<section class="rail"><div class="rail__head"><h2>' +
      esc(title) +
      '</h2><a href="#/explore">See all</a></div>' +
      '<div class="rail__track">' +
      list.map(function (p) {
        return productCard(p);
      }).join('') +
      '</div></section>'
    );
  }

  function viewItems() {
    setNav('items');
    var store = currentStore();
    var cartIds = (S.cart.items || []).map(function (i) {
      return i.productId;
    });
    var list =
      cartIds.length > 0
        ? cartIds
            .map(function (id) {
              return C.getProduct(id);
            })
            .filter(Boolean)
        : C.productsForStore(store.id).slice(0, 8);

    var grid = list
      .map(function (p) {
        return productCard(p, { showUnit: true });
      })
      .join('');

    main.innerHTML =
      '<div class="fulfill-row">' +
      '<div class="fulfill-chip active"><strong>Est. Delivery</strong><span>' +
      store.estimatedDeliveryMins +
      ' min</span></div>' +
      '<div class="fulfill-chip"><strong>Est. Pickup</strong><span>' +
      store.estimatedPickupMins +
      ' min</span></div>' +
      '</div>' +
      '<div class="items-head"><h1>Your items</h1>' +
      (cartIds.length
        ? '<span style="color:var(--green);font-weight:700">' + cartIds.length + ' in cart</span>'
        : '<span style="color:var(--muted);font-size:13px">Suggestions</span>') +
      '</div>' +
      (grid
        ? '<div class="product-grid">' + grid + '</div>'
        : '<div class="empty-state"><h2>No items yet</h2><p>Browse the shop and tap + to add African groceries.</p></div>');
  }

  function viewExplore(cat) {
    setNav('explore');
    var store = currentStore();
    var products = C.productsForStore(store.id);
    if (cat) {
      products = products.filter(function (p) {
        return p.category === cat;
      });
      main.innerHTML =
        '<div class="page-pad"><button type="button" class="pill-btn" data-go="#/explore">← Categories</button>' +
        '<h1 style="margin-top:14px">' +
        esc(cat) +
        '</h1></div>' +
        '<div class="product-grid">' +
        products
          .map(function (p) {
            return productCard(p);
          })
          .join('') +
        '</div>';
      return;
    }
    main.innerHTML =
      '<div class="page-pad"><h1>Explore</h1><div class="cat-list">' +
      C.CATEGORIES.map(function (c) {
        var count = products.filter(function (p) {
          return p.category === c.id;
        }).length;
        return (
          '<button type="button" class="cat-row" data-go="#/explore/' +
          encodeURIComponent(c.id) +
          '"><span>' +
          esc(c.label) +
          '</span><span style="color:var(--muted);font-weight:600">' +
          count +
          ' ›</span></button>'
        );
      }).join('') +
      '</div></div>';
  }

  function viewCoupons() {
    setNav('coupons');
    main.innerHTML =
      '<div class="page-pad"><h1>Coupons</h1>' +
      '<div class="coupon-card"><strong>Save $3 on Red Palm Oil</strong><span>On 1 L bottles · Mama Jones</span></div>' +
      '<div class="coupon-card"><strong>$1 off Plantain Chips</strong><span>Any 6 oz bag</span></div>' +
      '<div class="coupon-card"><strong>Buy 2 Egusi, save $2</strong><span>16 oz packs</span></div>' +
      '<div class="coupon-card"><strong>Free delivery over $45</strong><span>Local same-day orders</span></div>' +
      '</div>';
  }

  function viewProduct(id) {
    setNav('shop');
    var p = C.getProduct(id);
    if (!p) {
      go('/shop');
      return;
    }
    pdpQty = 1;
    var related = C.relatedProducts(p, 8);
    var n = p.nutrition || {};

    main.innerHTML =
      '<article class="pdp">' +
      '<div class="pdp__top">' +
      '<button type="button" class="icon-round" data-go="#/shop" aria-label="Back">←</button>' +
      '<div style="display:flex;gap:8px">' +
      '<button type="button" class="icon-round" aria-label="Favorite">♡</button>' +
      '<button type="button" class="icon-round" aria-label="Share">↗</button>' +
      '</div></div>' +
      '<div class="pdp__hero"><img src="' +
      esc(p.imageUrl) +
      '" alt="' +
      esc(p.name) +
      '" /></div>' +
      '<div class="pdp__body">' +
      '<h1>' +
      esc(p.name) +
      '</h1>' +
      '<p class="pdp__size">' +
      esc(p.size) +
      '</p>' +
      '<p class="pdp__price">' +
      money(p.priceCents) +
      ' <span class="pdp__unit">/each' +
      (p.unitPrice ? ' · ' + esc(p.unitPrice) : '') +
      '</span></p>' +
      (related.length
        ? '<section class="rail" style="margin-left:-18px;margin-right:-18px"><div class="rail__head"><h2>Related items</h2></div><div class="rail__track">' +
          related
            .map(function (r) {
              return productCard(r);
            })
            .join('') +
          '</div></section>'
        : '') +
      '<div class="pdp__details"><h3>Details</h3><p>' +
      esc(p.description) +
      '</p>' +
      '<div class="nutrition"><h4>Nutrition Facts</h4>' +
      '<div class="nutrition-row bold"><span>Amount Per Serving</span><span>' +
      esc(n.servingSize || '1 serving') +
      '</span></div>' +
      '<div class="nutrition-row bold"><span>Calories</span><span>' +
      esc(n.calories || '—') +
      '</span></div>' +
      '<div class="nutrition-row"><span>Total Fat</span><span>' +
      esc(n.totalFat || '—') +
      '</span></div>' +
      '<div class="nutrition-row"><span>Total Carbohydrate</span><span>' +
      esc(n.totalCarbohydrate || '—') +
      '</span></div>' +
      '<div class="nutrition-row"><span>Protein</span><span>' +
      esc(n.protein || '—') +
      '</span></div>' +
      '<div class="nutrition-row"><span>Sodium</span><span>' +
      esc(n.sodium || '—') +
      '</span></div>' +
      '</div></div></div>' +
      '<div class="pdp-bar">' +
      '<div class="qty">' +
      '<button type="button" id="qty-minus" aria-label="Decrease">−</button>' +
      '<span id="qty-val">1</span>' +
      '<button type="button" id="qty-plus" aria-label="Increase">+</button>' +
      '</div>' +
      '<button type="button" class="btn-cart" id="pdp-add">Add to Cart</button>' +
      '</div></article>';

    document.getElementById('qty-minus').onclick = function () {
      pdpQty = Math.max(1, pdpQty - 1);
      document.getElementById('qty-val').textContent = String(pdpQty);
    };
    document.getElementById('qty-plus').onclick = function () {
      pdpQty += 1;
      document.getElementById('qty-val').textContent = String(pdpQty);
    };
    document.getElementById('pdp-add').onclick = function () {
      addProduct(p.id, pdpQty);
    };
  }

  function bindMain() {
    main.onclick = function (e) {
      var t = e.target.closest('[data-add],[data-open-product],[data-open-store],[data-go]');
      if (!t) return;
      if (t.hasAttribute('data-add')) {
        e.preventDefault();
        e.stopPropagation();
        addProduct(t.getAttribute('data-add'), 1);
        return;
      }
      if (t.hasAttribute('data-open-store')) {
        e.preventDefault();
        if (S.setSelectedStore) S.setSelectedStore(t.getAttribute('data-open-store'));
        else if (S.selectStore) S.selectStore(t.getAttribute('data-open-store'));
        go('/shop');
        return;
      }
      if (t.hasAttribute('data-go')) {
        e.preventDefault();
        go(t.getAttribute('data-go').replace(/^#/, ''));
        return;
      }
      if (t.hasAttribute('data-open-product')) {
        e.preventDefault();
        go('/product/' + t.getAttribute('data-open-product'));
      }
    };

    main.onsubmit = function (e) {
      if (e.target && e.target.id === 'search-form') {
        e.preventDefault();
        var q = (e.target.q && e.target.q.value) || '';
        viewShop(q.trim());
      }
    };
  }

  function render() {
    if (!C || !S) return;
    var route = parseRoute();
    var name = route.name;

    if (name === 'account') viewAccount();
    else if (name === 'shop') viewShop();
    else if (name === 'items' || name === 'cart') viewItems();
    else if (name === 'explore') viewExplore(route.segs[1] ? decodeURIComponent(route.segs[1]) : null);
    else if (name === 'coupons') viewCoupons();
    else if (name === 'product' && route.segs[1]) viewProduct(route.segs[1]);
    else viewAccount();

    main.scrollTop = 0;
  }

  function boot() {
    C = window.Teedeux && window.Teedeux.catalog;
    S = window.Teedeux && window.Teedeux.store;
    main = document.getElementById('main');
    if (!C || !S || !main) {
      setTimeout(boot, 30);
      return;
    }

    try {
      if (S.completeOnboarding) S.completeOnboarding();
    } catch (e) {}

    bindMain();
    if (!location.hash || location.hash === '#' || location.hash === '#/') {
      location.replace('#/account');
    }
    window.addEventListener('hashchange', render);
    if (S.subscribe) {
      S.subscribe(function () {
        var badge = document.getElementById('nav-cart-badge');
        var n = qtyInCart();
        if (badge) {
          if (n > 0) {
            badge.hidden = false;
            badge.textContent = String(n);
          } else badge.hidden = true;
        }
      });
    }
    try {
      render();
    } catch (err) {
      console.error(err);
      main.innerHTML =
        '<div id="boot-fallback"><h1>Teedeux</h1><p>Something went wrong loading the shop.</p><p><a href="/?reset=1">Reset cache &amp; reload</a></p></div>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
