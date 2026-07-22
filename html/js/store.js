/**
 * Teedeux HTML5 — localStorage-backed app state.
 * Auth, cart, fees, orders, and session under window.Teedeux.store.
 * Persistence key: teedeux-html-v1
 *
 * Depends on Teedeux.catalog (load catalog.js before this file).
 */
(function (global) {
  'use strict';

  var Teedeux = (global.Teedeux = global.Teedeux || {});
  var catalog = Teedeux.catalog || {};

  var KEY = 'teedeux-html-v1';

  var LOCAL_DELIVERY_FEE_CENTS = 499;
  var SERVICE_FEE_RATE = 0.05;
  var TAX_RATE = 0.0825;
  var DEFAULT_ORIGIN_STATE = 'TX';

  var LOCAL_STATUS_FLOW = [
    'CONFIRMED',
    'SHOPPING',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
  ];
  var SHIPPED_STATUS_FLOW = [
    'CONFIRMED',
    'LABEL_CREATED',
    'SHIPPED',
    'DELIVERED',
  ];

  // ---------------------------------------------------------------------------
  // Defaults & persistence
  // ---------------------------------------------------------------------------

  function defaultState() {
    var demoAddress = catalog.DEMO_ADDRESS || null;
    var demoPayment = catalog.DEMO_PAYMENT || null;
    var firstStore =
      catalog.STORES && catalog.STORES.length ? catalog.STORES[0].id : null;

    return {
      auth: {
        user: null,
        hasOnboarded: false,
      },
      cart: {
        items: [],
        tipCents: 0,
      },
      orders: [],
      session: {
        selectedStoreId: firstStore,
        address: demoAddress
          ? {
              id: demoAddress.id,
              label: demoAddress.label,
              line1: demoAddress.line1,
              line2: demoAddress.line2,
              city: demoAddress.city,
              state: demoAddress.state,
              postalCode: demoAddress.postalCode,
              country: demoAddress.country || 'US',
              isDefault: !!demoAddress.isDefault,
            }
          : null,
        paymentId: demoPayment ? demoPayment.id : null,
      },
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadState() {
    try {
      var raw = global.localStorage && global.localStorage.getItem(KEY);
      if (!raw) return defaultState();
      var parsed = JSON.parse(raw);
      var base = defaultState();
      return {
        auth: Object.assign({}, base.auth, parsed.auth || {}),
        cart: Object.assign({}, base.cart, parsed.cart || {}),
        orders: Array.isArray(parsed.orders) ? parsed.orders : [],
        session: Object.assign({}, base.session, parsed.session || {}),
      };
    } catch (err) {
      console.warn('[Teedeux.store] failed to load state', err);
      return defaultState();
    }
  }

  function persist(state) {
    try {
      if (global.localStorage) {
        global.localStorage.setItem(KEY, JSON.stringify(state));
      }
    } catch (err) {
      console.warn('[Teedeux.store] failed to persist state', err);
    }
  }

  var _state = loadState();
  var _listeners = [];

  function notify() {
    var snapshot = getState();
    for (var i = 0; i < _listeners.length; i++) {
      try {
        _listeners[i](snapshot);
      } catch (err) {
        console.warn('[Teedeux.store] listener error', err);
      }
    }
  }

  function getState() {
    return clone(_state);
  }

  function setState(partial) {
    if (!partial || typeof partial !== 'object') return getState();
    if (partial.auth) {
      _state.auth = Object.assign({}, _state.auth, partial.auth);
    }
    if (partial.cart) {
      _state.cart = Object.assign({}, _state.cart, partial.cart);
    }
    if (partial.orders) {
      _state.orders = partial.orders.slice();
    }
    if (partial.session) {
      _state.session = Object.assign({}, _state.session, partial.session);
    }
    persist(_state);
    notify();
    return getState();
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') return function () {};
    _listeners.push(listener);
    return function unsubscribe() {
      _listeners = _listeners.filter(function (fn) {
        return fn !== listener;
      });
    };
  }

  // ---------------------------------------------------------------------------
  // Utils
  // ---------------------------------------------------------------------------

  function createId(prefix) {
    return (
      prefix +
      '_' +
      Date.now().toString(36) +
      '_' +
      Math.random().toString(36).slice(2, 8)
    );
  }

  function createOrderNumber() {
    return 'TDX-' + Math.floor(10000 + Math.random() * 90000);
  }

  function isValidCredentials(email, password) {
    return String(email || '').trim().length >= 4 && String(password || '').length >= 4;
  }

  function roleFromEmail(email) {
    return String(email || '')
      .toLowerCase()
      .indexOf('shopper') !== -1
      ? 'SHOPPER'
      : 'CUSTOMER';
  }

  function buildUser(email, overrides) {
    overrides = overrides || {};
    var isShopper = roleFromEmail(email) === 'SHOPPER';
    return {
      id: overrides.id || createId('user'),
      name:
        overrides.name ||
        (isShopper ? 'Jordan Shopper' : 'Ada Okonkwo'),
      email: String(email || '')
        .trim()
        .toLowerCase(),
      phone: overrides.phone || '+1 (404) 555-0182',
      role: overrides.role || (isShopper ? 'SHOPPER' : 'CUSTOMER'),
      createdAt: overrides.createdAt || new Date().toISOString(),
    };
  }

  function resolveProduct(productOrId) {
    if (!productOrId) return null;
    if (typeof productOrId === 'string') {
      return catalog.getProductById
        ? catalog.getProductById(productOrId)
        : null;
    }
    return productOrId;
  }

  function defaultFulfillmentFor(product) {
    if (catalog.defaultFulfillment) {
      return catalog.defaultFulfillment(product);
    }
    if (product.localAvailable && !product.shippable) return 'LOCAL_DELIVERY';
    if (product.shippable && !product.localAvailable) return 'NATIONWIDE_SHIPPING';
    return product.temperatureClass === 'DRY'
      ? 'NATIONWIDE_SHIPPING'
      : 'LOCAL_DELIVERY';
  }

  function makeCartItemId(productId, fulfillment) {
    return 'cart_' + productId + '_' + fulfillment;
  }

  function canUseFulfillment(product, fulfillment) {
    if (fulfillment === 'LOCAL_DELIVERY') return !!product.localAvailable;
    return !!product.shippable;
  }

  // ---------------------------------------------------------------------------
  // Auth
  // ---------------------------------------------------------------------------

  function login(email, password) {
    if (!isValidCredentials(email, password)) return false;
    _state.auth.user = buildUser(email);
    persist(_state);
    notify();
    return true;
  }

  function signup(name, email, password, phone) {
    if (!String(name || '').trim() || !isValidCredentials(email, password)) {
      return false;
    }
    _state.auth.user = buildUser(email, {
      name: String(name).trim(),
      phone: phone != null ? String(phone).trim() : '',
      role: roleFromEmail(email),
    });
    persist(_state);
    notify();
    return true;
  }

  function logout() {
    _state.auth.user = null;
    persist(_state);
    notify();
  }

  function completeOnboarding() {
    _state.auth.hasOnboarded = true;
    persist(_state);
    notify();
  }

  // ---------------------------------------------------------------------------
  // Cart
  // ---------------------------------------------------------------------------

  function addItem(productOrId, qty, fulfillment) {
    var product = resolveProduct(productOrId);
    if (!product) return null;

    var quantity = Math.max(1, Math.floor(Number(qty) || 1));
    var channel = fulfillment || defaultFulfillmentFor(product);
    if (!canUseFulfillment(product, channel)) {
      channel = defaultFulfillmentFor(product);
    }
    if (!canUseFulfillment(product, channel)) return null;

    var id = makeCartItemId(product.id, channel);
    var items = _state.cart.items.slice();
    var existingIndex = -1;
    for (var i = 0; i < items.length; i++) {
      if (items[i].id === id) {
        existingIndex = i;
        break;
      }
    }

    if (existingIndex >= 0) {
      items[existingIndex] = Object.assign({}, items[existingIndex], {
        quantity: items[existingIndex].quantity + quantity,
        product: product,
      });
    } else {
      items.push({
        id: id,
        productId: product.id,
        product: product,
        quantity: quantity,
        fulfillment: channel,
      });
    }

    _state.cart.items = items;
    persist(_state);
    notify();
    return items[existingIndex >= 0 ? existingIndex : items.length - 1];
  }

  function removeItem(itemId) {
    _state.cart.items = _state.cart.items.filter(function (item) {
      return item.id !== itemId;
    });
    persist(_state);
    notify();
  }

  function setQty(itemId, quantity) {
    var next = Math.floor(Number(quantity));
    if (!isFinite(next) || next <= 0) {
      removeItem(itemId);
      return;
    }
    _state.cart.items = _state.cart.items.map(function (item) {
      return item.id === itemId
        ? Object.assign({}, item, { quantity: next })
        : item;
    });
    persist(_state);
    notify();
  }

  function clearCart() {
    _state.cart.items = [];
    _state.cart.tipCents = 0;
    persist(_state);
    notify();
  }

  function setTip(tipCents) {
    _state.cart.tipCents = Math.max(0, Math.round(Number(tipCents) || 0));
    persist(_state);
    notify();
  }

  function getLocalItems(items) {
    var list = items || _state.cart.items;
    return list.filter(function (i) {
      return i.fulfillment === 'LOCAL_DELIVERY';
    });
  }

  function getShippedItems(items) {
    var list = items || _state.cart.items;
    return list.filter(function (i) {
      return i.fulfillment === 'NATIONWIDE_SHIPPING';
    });
  }

  function getSubtotal(items) {
    var list = items || _state.cart.items;
    return list.reduce(function (sum, item) {
      var price =
        (item.product && item.product.priceCents) ||
        (resolveProduct(item.productId) &&
          resolveProduct(item.productId).priceCents) ||
        0;
      return sum + price * item.quantity;
    }, 0);
  }

  function estimateShippingFeeCents(shippedItems, address) {
    if (!shippedItems || shippedItems.length === 0) return 0;

    var rawOz = shippedItems.reduce(function (sum, item) {
      var weight =
        (item.product && item.product.weightOz) ||
        (resolveProduct(item.productId) &&
          resolveProduct(item.productId).weightOz) ||
        8;
      return sum + weight * item.quantity;
    }, 0);

    var weightOz = Math.max(8, Math.ceil(rawOz * 1.1));
    var weightLb = weightOz / 16;
    var crossRegion = address
      ? String(address.state || '').toUpperCase() !== DEFAULT_ORIGIN_STATE
      : false;

    return 495 + Math.round(weightLb * 120) + (crossRegion ? 250 : 0);
  }

  /**
   * Fee breakdown in cents.
   * @returns {{subtotal, localDelivery, shipping, service, tax, tip, total}}
   */
  function getFees(address) {
    var items = _state.cart.items;
    var tip = _state.cart.tipCents || 0;
    var addr = address !== undefined ? address : _state.session.address;
    var localItems = getLocalItems(items);
    var shippedItems = getShippedItems(items);
    var subtotal = getSubtotal(items);
    var localDelivery = localItems.length > 0 ? LOCAL_DELIVERY_FEE_CENTS : 0;
    var shipping = estimateShippingFeeCents(shippedItems, addr);
    var service = Math.round(subtotal * SERVICE_FEE_RATE);
    var tax = Math.round(subtotal * TAX_RATE);
    var total = subtotal + localDelivery + shipping + service + tip + tax;

    return {
      subtotal: subtotal,
      localDelivery: localDelivery,
      shipping: shipping,
      service: service,
      tax: tax,
      tip: tip,
      total: total,
    };
  }

  // ---------------------------------------------------------------------------
  // Orders
  // ---------------------------------------------------------------------------

  function cartItemsToOrderItems(items) {
    return items.map(function (item) {
      var product = item.product || resolveProduct(item.productId) || {};
      return {
        id: createId('oi'),
        productId: product.id || item.productId,
        productName: product.name || 'Item',
        productImageUrl: product.imageUrl,
        quantity: item.quantity,
        unitPriceCents: product.priceCents || 0,
        unit: product.unit || 'EACH',
        status: 'PENDING',
        fulfillment: item.fulfillment,
      };
    });
  }

  function subtotalForItems(items) {
    return items.reduce(function (sum, item) {
      var price =
        (item.product && item.product.priceCents) ||
        (resolveProduct(item.productId) &&
          resolveProduct(item.productId).priceCents) ||
        0;
      return sum + price * item.quantity;
    }, 0);
  }

  function allocateFees(fulfillment, items, fees, tipCents, hasBoth) {
    var subtotal = subtotalForItems(items);
    var share =
      hasBoth && fees.subtotal > 0 ? subtotal / fees.subtotal : 1;
    var service = Math.round(fees.service * share);
    var tax = Math.round(fees.tax * share);
    var tipShare = Math.round(tipCents * share);
    var localDelivery =
      fulfillment === 'LOCAL_DELIVERY' ? fees.localDelivery : 0;
    var shipping =
      fulfillment === 'NATIONWIDE_SHIPPING' ? fees.shipping : 0;

    return {
      subtotal: subtotal,
      localDelivery: localDelivery,
      shipping: shipping,
      service: service,
      tax: tax,
      tip: tipShare,
      total: subtotal + localDelivery + shipping + service + tipShare + tax,
    };
  }

  function buildOrder(params) {
    var first = params.items[0];
    var product =
      (first && first.product) ||
      (first && resolveProduct(first.productId)) ||
      {};
    var now = new Date().toISOString();

    return {
      id: createId('ord'),
      orderNumber: createOrderNumber(),
      userId: params.userId,
      storeId: product.storeId || _state.session.selectedStoreId,
      storeName: product.storeName || 'Store',
      status: params.status,
      fulfillmentType: params.fulfillment,
      items: cartItemsToOrderItems(params.items),
      deliveryAddress: params.address,
      paymentMethodId: params.paymentId,
      fees: params.fees,
      trackingNumber: params.trackingNumber || null,
      shippingCarrier: params.shippingCarrier || null,
      createdAt: now,
      updatedAt: now,
    };
  }

  function mockTrackingNumber() {
    return '9400' + String(Date.now()).slice(-16);
  }

  function isAllowedTransition(fulfillment, from, to) {
    if (to === 'CANCELLED' || to === 'REFUNDED') return true;
    var flow =
      fulfillment === 'LOCAL_DELIVERY' ? LOCAL_STATUS_FLOW : SHIPPED_STATUS_FLOW;
    var fromIdx = flow.indexOf(from);
    var toIdx = flow.indexOf(to);
    if (fromIdx === -1 || toIdx === -1) return false;
    return toIdx >= fromIdx;
  }

  /**
   * Place order(s) from the current cart. Splits local vs shipped into
   * separate orders when both channels are present.
   * @param {object} address
   * @param {string} paymentId
   * @returns {object[]} created orders
   */
  function placeOrder(address, paymentId) {
    var addr = address || _state.session.address;
    var payId = paymentId || _state.session.paymentId;
    if (!addr) {
      throw new Error('Delivery address is required');
    }
    if (!payId) {
      throw new Error('Payment method is required');
    }

    var items = _state.cart.items;
    if (!items.length) {
      throw new Error('Cart is empty');
    }

    var localItems = getLocalItems(items);
    var shippedItems = getShippedItems(items);
    var fees = getFees(addr);
    var tipCents = _state.cart.tipCents || 0;
    var userId =
      (_state.auth.user && _state.auth.user.id) || 'guest';
    var hasBoth = localItems.length > 0 && shippedItems.length > 0;
    var created = [];

    if (localItems.length > 0) {
      created.push(
        buildOrder({
          items: localItems,
          fulfillment: 'LOCAL_DELIVERY',
          address: addr,
          paymentId: payId,
          fees: allocateFees(
            'LOCAL_DELIVERY',
            localItems,
            fees,
            tipCents,
            hasBoth
          ),
          userId: userId,
          status: 'SHOPPING',
        })
      );
    }

    if (shippedItems.length > 0) {
      created.push(
        buildOrder({
          items: shippedItems,
          fulfillment: 'NATIONWIDE_SHIPPING',
          address: addr,
          paymentId: payId,
          fees: allocateFees(
            'NATIONWIDE_SHIPPING',
            shippedItems,
            fees,
            tipCents,
            hasBoth
          ),
          userId: userId,
          status: 'CONFIRMED',
        })
      );
    }

    if (created.length === 0) return [];

    _state.orders = created.concat(_state.orders);
    _state.session.address = addr;
    _state.session.paymentId = payId;
    _state.cart.items = [];
    _state.cart.tipCents = 0;
    persist(_state);
    notify();
    return clone(created);
  }

  function listOrders() {
    return clone(_state.orders);
  }

  function getOrder(orderId) {
    for (var i = 0; i < _state.orders.length; i++) {
      if (_state.orders[i].id === orderId) {
        return clone(_state.orders[i]);
      }
    }
    return null;
  }

  function updateStatus(orderId, status) {
    var order = null;
    for (var i = 0; i < _state.orders.length; i++) {
      if (_state.orders[i].id === orderId) {
        order = _state.orders[i];
        break;
      }
    }
    if (!order) return null;
    if (!isAllowedTransition(order.fulfillmentType, order.status, status)) {
      return clone(order);
    }

    var now = new Date().toISOString();
    var trackingNumber = order.trackingNumber;
    var shippingCarrier = order.shippingCarrier;

    if (
      order.fulfillmentType === 'NATIONWIDE_SHIPPING' &&
      (status === 'LABEL_CREATED' || status === 'SHIPPED') &&
      !trackingNumber
    ) {
      trackingNumber = mockTrackingNumber();
      shippingCarrier = shippingCarrier || 'USPS';
    }

    order.status = status;
    order.trackingNumber = trackingNumber;
    order.shippingCarrier = shippingCarrier;
    order.updatedAt = now;

    persist(_state);
    notify();
    return clone(order);
  }

  // ---------------------------------------------------------------------------
  // Session helpers
  // ---------------------------------------------------------------------------

  function setSelectedStore(storeId) {
    _state.session.selectedStoreId = storeId;
    persist(_state);
    notify();
  }

  function setAddress(address) {
    _state.session.address = address;
    persist(_state);
    notify();
  }

  function setPaymentId(paymentId) {
    _state.session.paymentId = paymentId;
    persist(_state);
    notify();
  }

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  Teedeux.store = {
    KEY: KEY,
    getState: getState,
    setState: setState,
    subscribe: subscribe,

    // auth
    get auth() {
      return clone(_state.auth);
    },
    login: login,
    signup: signup,
    logout: logout,
    completeOnboarding: completeOnboarding,

    // cart
    get cart() {
      return clone(_state.cart);
    },
    addItem: addItem,
    removeItem: removeItem,
    setQty: setQty,
    clear: clearCart,
    get tipCents() {
      return _state.cart.tipCents;
    },
    setTip: setTip,
    getLocalItems: getLocalItems,
    getShippedItems: getShippedItems,
    getFees: getFees,

    // orders
    placeOrder: placeOrder,
    listOrders: listOrders,
    getOrder: getOrder,
    updateStatus: updateStatus,

    // session
    get session() {
      return clone(_state.session);
    },
    setSelectedStore: setSelectedStore,
    setAddress: setAddress,
    setPaymentId: setPaymentId,
  };
})(typeof window !== 'undefined' ? window : this);
