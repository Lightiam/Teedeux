/**
 * Teedeux customer app — categories, listing, cart, checkout, orders, tracking,
 * coupons, favorites. Backed by Teedeux.backend.
 */
(function () {
  'use strict';

  var B = null;
  var C = null;
  var main = null;
  var orderTab = 'Delivered';
  var listingQuery = '';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function money(cents) {
    return '$' + (Number(cents || 0) / 100).toFixed(2);
  }
  function go(path) {
    location.hash = path.startsWith('#') ? path : '#' + path;
  }
  function route() {
    var hash = (location.hash || '#/home').replace(/^#/, '');
    if (!hash.startsWith('/')) hash = '/' + hash;
    var segs = hash.split('?')[0].split('/').filter(Boolean);
    var name = segs[0] || 'home';
    if (name === 'account' || name === 'shop' || name === 'splash') name = 'home';
    return { name: name, segs: segs };
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
  function setNav(active) {
    var n = B.getCart().totals.itemCount;
    var badge = document.getElementById('nav-cart-badge');
    if (badge) {
      if (n > 0) {
        badge.hidden = false;
        badge.textContent = String(n);
      } else badge.hidden = true;
    }
    document.querySelectorAll('.nav-item').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-nav') === active);
    });
  }
  function topbar(title, backTo, rightHtml) {
    return (
      '<div class="topbar">' +
      (backTo
        ? '<button type="button" class="icon-btn" data-go="' +
          esc(backTo) +
          '" aria-label="Back">←</button>'
        : '<span style="width:40px"></span>') +
      '<h1>' +
      esc(title) +
      '</h1>' +
      (rightHtml ||
        '<button type="button" class="icon-btn" data-go="#/cart" aria-label="Cart">🛍</button>') +
      '</div>'
    );
  }
  function searchRow(value, action) {
    return (
      '<form class="search-row" id="search-form" data-search-action="' +
      esc(action || 'listing') +
      '">' +
      '<div class="search-box"><span>🔍</span><input name="q" type="search" placeholder="Search your groceries" value="' +
      esc(value || '') +
      '" /></div>' +
      '<button type="submit" class="filter-btn" aria-label="Filter">☰</button>' +
      '</form>'
    );
  }
  function productCard(p) {
    var badge = p.badge
      ? '<span class="badge ' +
        (String(p.badge).indexOf('%') >= 0 ? 'pink' : 'blue') +
        '">' +
        esc(p.badge) +
        '</span>'
      : '';
    var compare = p.compareAtCents
      ? '<del>' + money(p.compareAtCents) + '</del>'
      : '';
    return (
      '<article class="p-card" data-open-product="' +
      esc(p.id) +
      '"><div class="p-card__img">' +
      badge +
      '<img src="' +
      esc(p.imageUrl) +
      '" alt="' +
      esc(p.name) +
      '" loading="lazy" />' +
      '<button type="button" class="add-round" data-add="' +
      esc(p.id) +
      '" aria-label="Add">+</button></div>' +
      '<p class="p-card__name">' +
      esc(p.name) +
      '</p><p class="p-card__size">' +
      esc(p.size) +
      '</p><p class="p-card__price">' +
      money(p.priceCents) +
      compare +
      '</p></article>'
    );
  }

  function viewHome() {
    setNav('home');
    var cats = B.categories();
    main.innerHTML =
      topbar('Categories', null) +
      searchRow('', 'home') +
      '<div class="promo-green"><div><strong>40% Fresh African groceries — big savings daily</strong></div>' +
      '<button type="button" class="go" data-go="#/coupons">→</button></div>' +
      '<div class="section-head"><h2>All Categories</h2><a href="#/explore">View all</a></div>' +
      '<div class="cat-grid">' +
      cats
        .map(function (c) {
          return (
            '<button type="button" class="cat-item" data-go="#/listing/' +
            encodeURIComponent(c.id) +
            '"><img src="' +
            esc(c.imageUrl) +
            '" alt="" /><span>' +
            esc(c.name) +
            '</span></button>'
          );
        })
        .join('') +
      '</div>';
  }

  function viewListing(catId, q) {
    setNav('home');
    var cats = B.categories();
    var cat = cats.filter(function (c) {
      return c.id === catId;
    })[0];
    var title = (cat && cat.label) || catId || 'Popular items';
    var products = B.products({ category: catId || undefined, q: q || listingQuery || undefined });
    main.innerHTML =
      topbar(cat ? cat.name : 'Popular', '#/home') +
      searchRow(q || listingQuery || '', 'listing:' + (catId || '')) +
      '<div class="section-head"><h2>' +
      esc(title) +
      '</h2></div>' +
      (products.length
        ? '<div class="product-grid">' +
          products
            .map(function (p) {
              return productCard(p);
            })
            .join('') +
          '</div>'
        : '<div class="empty"><h2>No items</h2><p>Try another category or search.</p></div>');
  }

  function viewCart() {
    setNav('cart');
    var cart = B.getCart();
    var rows = cart.items
      .map(function (l) {
        return (
          '<div class="cart-row">' +
          '<img src="' +
          esc(l.imageUrl) +
          '" alt="" />' +
          '<div><button type="button" class="remove" data-remove="' +
          esc(l.productId) +
          '">✕</button>' +
          '<h3>' +
          esc(l.name) +
          '</h3><p class="meta">' +
          esc(l.size) +
          '</p>' +
          '<div style="display:flex;align-items:center"><span class="price">' +
          money(l.lineCents) +
          '</span>' +
          '<div class="qty"><button type="button" data-qty="' +
          esc(l.productId) +
          '" data-delta="-1">−</button><span>' +
          l.quantity +
          '</span><button type="button" data-qty="' +
          esc(l.productId) +
          '" data-delta="1">+</button></div></div></div></div>'
        );
      })
      .join('');

    main.innerHTML =
      topbar('My Cart', '#/home') +
      (cart.items.length
        ? '<div class="cart-list">' +
          rows +
          '</div>' +
          '<form class="promo-box" id="promo-form"><span>◎</span><input name="code" placeholder="Apply a promo code" value="' +
          esc(cart.promoCode || '') +
          '" /><button type="submit">Apply</button></form>' +
          '<div class="summary">' +
          '<div class="summary-row"><span>Subtotal</span><span>' +
          money(cart.totals.subtotalCents) +
          '</span></div>' +
          (cart.totals.discountCents
            ? '<div class="summary-row"><span>Promo</span><span>-' +
              money(cart.totals.discountCents) +
              '</span></div>'
            : '') +
          '<div class="summary-row"><span>Delivery</span><span>' +
          money(cart.totals.deliveryCents) +
          '</span></div>' +
          '<div class="summary-row total"><span>Total Cost</span><span>' +
          money(cart.totals.totalCents) +
          '</span></div></div>' +
          '<button type="button" class="btn-primary" data-go="#/checkout">Checkout Now</button>'
        : '<div class="empty"><h2>Your cart is empty</h2><p>Add African groceries from Categories.</p>' +
          '<button type="button" class="btn-primary" data-go="#/home">Browse categories</button></div>');
  }

  function viewCheckout() {
    setNav('cart');
    var st = B.getState();
    var addrHtml = st.addresses
      .map(function (a) {
        return (
          '<div class="choice ' +
          (a.selected ? 'selected' : '') +
          '" data-select-address="' +
          esc(a.id) +
          '"><div class="radio">' +
          (a.selected ? '✓' : '') +
          '</div><div><strong>' +
          esc(a.label) +
          '</strong><span>' +
          esc(a.line1 + ', ' + a.city + ', ' + a.state + ' ' + a.postalCode) +
          '</span></div></div>'
        );
      })
      .join('');
    var payHtml = st.payments
      .map(function (p) {
        var detail = p.last4
          ? '**** **** ' + p.last4
          : p.brand === 'Cash on Delivery'
            ? 'Pay while receiving goods'
            : 'Make payment by ' + p.brand.toLowerCase();
        return (
          '<div class="choice ' +
          (p.selected ? 'selected' : '') +
          '" data-select-payment="' +
          esc(p.id) +
          '"><div class="radio">' +
          (p.selected ? '✓' : '') +
          '</div><div><strong>' +
          esc(p.brand) +
          '</strong><span>' +
          esc(detail) +
          '</span></div></div>'
        );
      })
      .join('');

    main.innerHTML =
      topbar('Checkout', '#/cart') +
      '<div class="block"><div class="block-head"><h2>Delivery Location</h2><button type="button">Add New</button></div>' +
      addrHtml +
      '</div>' +
      '<div class="block"><div class="block-head"><h2>Payment Method</h2><button type="button">Add New</button></div>' +
      payHtml +
      '</div>' +
      '<button type="button" class="btn-primary" id="confirm-pay">Confirm Payment</button>';
  }

  function viewOrders() {
    setNav('orders');
    var orders = B.listOrders(orderTab);
    var tabs = ['Processing', 'Delivered', 'Canceled']
      .map(function (t) {
        return (
          '<button type="button" class="tab ' +
          (orderTab === t ? 'active' : '') +
          '" data-order-tab="' +
          t +
          '">' +
          t +
          '</button>'
        );
      })
      .join('');

    var cards = orders
      .map(function (o) {
        var item = o.items[0];
        if (!item) return '';
        return (
          '<div class="order-card">' +
          '<div class="order-card__top"><img src="' +
          esc(item.imageUrl) +
          '" alt="" /><div><h3>' +
          esc(item.name) +
          '</h3><p class="oid">Order ID - ' +
          esc(o.orderNumber) +
          '</p></div><div class="price">' +
          money(o.totals.totalCents) +
          '</div></div>' +
          '<div class="order-card__actions"><p>' +
          (o.tab === 'Delivered'
            ? 'Provide a rating for the product that has arrived.'
            : o.tab === 'Processing'
              ? 'Your order is on the way.'
              : 'This order was canceled.') +
          '</p>' +
          (o.tab === 'Delivered'
            ? '<button type="button" data-review="' +
              esc(o.id) +
              '" data-product="' +
              esc(item.productId) +
              '">Leave Review</button>'
            : o.tab === 'Processing'
              ? '<button type="button" data-go="#/tracking/' +
                esc(o.id) +
                '">Track</button>'
              : '') +
          '</div></div>'
        );
      })
      .join('');

    main.innerHTML =
      topbar('My Orders', '#/home', '<button type="button" class="icon-btn" aria-label="Search">🔍</button>') +
      '<div class="tabs">' +
      tabs +
      '</div>' +
      (cards || '<div class="empty"><h2>No orders</h2><p>Checkout to place your first African grocery order.</p></div>');
  }

  function viewTracking(id) {
    setNav('orders');
    var order = B.getOrder(id);
    if (!order) {
      go('/orders');
      return;
    }
    var tl = (order.timeline || [])
      .slice()
      .reverse()
      .map(function (t) {
        var done = t.status === 'Completed' || t.status === 'On Transit';
        return (
          '<div class="tl-item ' +
          (done ? 'done' : '') +
          '"><div class="tl-dot">' +
          (t.key === 'complete' ? '✓' : t.key === 'courier' ? '🚚' : t.key === 'pickup' ? '⏱' : '💳') +
          '</div><div><strong>' +
          esc(t.label) +
          '</strong><span>' +
          esc(t.status) +
          (t.at ? ' — ' + new Date(t.at).toLocaleString() : '') +
          '</span></div></div>'
        );
      })
      .join('');

    main.innerHTML =
      topbar('Order Tracking', '#/orders') +
      '<div class="map-box"><div class="map-pin">🛵</div><div class="live-badge">Live Tracking</div></div>' +
      '<div class="courier"><img src="' +
      esc(order.courier.avatar) +
      '" alt="" /><div><strong>' +
      esc(order.courier.name) +
      '</strong><span>' +
      esc(order.courier.title) +
      '</span></div><div class="acts"><button type="button" aria-label="Message">💬</button><button type="button" class="call" aria-label="Call">📞</button></div></div>' +
      '<div class="timeline">' +
      tl +
      '</div>' +
      '<button type="button" class="btn-primary" data-go="#/orders">Order Collected</button>';
  }

  function viewCoupons() {
    setNav('home');
    var coupons = B.getState().coupons;
    main.innerHTML =
      topbar('Coupons', '#/home') +
      '<form class="coupon-input" id="claim-code-form"><input name="code" placeholder="Enter your coupon code" /><button type="submit">Claim</button></form>' +
      '<div class="promo-green"><div><strong>OFF — Fresh African groceries big savings daily</strong></div><button type="button" class="go" data-go="#/listing/Produce">→</button></div>' +
      coupons
        .map(function (c) {
          return (
            '<div class="coupon-row ' +
            (c.claimed ? 'claimed' : '') +
            '"><img src="' +
            esc(c.imageUrl) +
            '" alt="" /><div><strong>' +
            esc(c.title) +
            '</strong><span>' +
            esc(c.expires) +
            ' Ends</span></div><button type="button" data-claim="' +
            esc(c.id) +
            '">' +
            (c.claimed ? 'Claimed' : 'Claim') +
            '</button></div>'
          );
        })
        .join('');
  }

  function viewFavorites() {
    setNav('favorites');
    var cols = B.getCollections();
    main.innerHTML =
      topbar('Favorites', '#/home') +
      searchRow('', 'favorites') +
      '<div class="section-head"><h2>Favorite Items</h2><a href="#/listing">View All</a></div>' +
      '<div class="fav-grid">' +
      cols
        .map(function (c) {
          var imgs = (c.images || [])
            .map(function (src) {
              return '<img src="' + esc(src) + '" alt="" />';
            })
            .join('');
          while ((imgs.match(/<img/g) || []).length < 4) imgs += '<img src="/icons/icon.svg" alt="" />';
          return (
            '<button type="button" class="fav-card" data-go="#/listing/' +
            encodeURIComponent(
              c.name.indexOf('Spice') >= 0 ? 'Spices' : c.name.indexOf('Snack') >= 0 ? 'Snacks' : 'Staples'
            ) +
            '"><div class="fav-collage">' +
            imgs +
            '</div><div class="body"><strong>' +
            esc(c.name) +
            '</strong><span>' +
            c.count +
            '+ Products</span></div></button>'
          );
        })
        .join('') +
      '<button type="button" class="fav-add" data-go="#/home">+</button></div>';
  }

  function viewProfile() {
    setNav('profile');
    main.innerHTML =
      topbar('Profile', '#/home') +
      '<div class="block"><div class="choice selected"><div class="radio">✓</div><div><strong>Teedeux Shopper</strong><span>African groceries · Delivery & pickup</span></div></div>' +
      '<button type="button" class="btn-primary" data-go="#/orders">My Orders</button>' +
      '<button type="button" class="btn-primary" style="background:#1c1c1c" data-go-url="/monitor.html">Open Monitor</button>' +
      '<button type="button" class="btn-primary" style="background:#ff5a1f" data-go-url="/admin.html">Super Admin · Products</button>' +
      '<p style="margin:10px 0 0;color:var(--muted);font-size:12px">Site owner link — update catalog products (login required).</p></div>';
  }

  function viewProduct(id) {
    var p = B.getProduct(id);
    if (!p) {
      go('/home');
      return;
    }
    setNav('home');
    main.innerHTML =
      topbar(p.name, '#/listing/' + encodeURIComponent(p.category)) +
      '<div style="padding:0 16px 16px"><img src="' +
      esc(p.imageUrl) +
      '" alt="" style="width:100%;border-radius:20px;aspect-ratio:1;object-fit:cover;background:#fff" />' +
      '<h2 style="margin:14px 0 4px;font-size:24px">' +
      esc(p.name) +
      '</h2><p style="color:var(--muted);margin:0">' +
      esc(p.size) +
      '</p><p style="font-size:22px;font-weight:800;margin:10px 0">' +
      money(p.priceCents) +
      '</p><p style="color:#555">' +
      esc(p.description || '') +
      '</p>' +
      '<button type="button" class="btn-primary" style="width:100%;margin:16px 0" data-add="' +
      esc(p.id) +
      '">Add to Cart</button></div>';
  }

  function bind() {
    main.onclick = function (e) {
      var t = e.target.closest(
        '[data-go],[data-go-url],[data-add],[data-open-product],[data-remove],[data-qty],[data-select-address],[data-select-payment],[data-order-tab],[data-claim],[data-review]'
      );
      if (!t) return;

      if (t.hasAttribute('data-go-url')) {
        location.href = t.getAttribute('data-go-url');
        return;
      }
      if (t.hasAttribute('data-go')) {
        e.preventDefault();
        go(t.getAttribute('data-go'));
        return;
      }
      if (t.hasAttribute('data-add')) {
        e.preventDefault();
        e.stopPropagation();
        B.addToCart(t.getAttribute('data-add'), 1);
        toast('Added to cart');
        setNav(route().name === 'cart' ? 'cart' : 'home');
        return;
      }
      if (t.hasAttribute('data-open-product')) {
        go('/product/' + t.getAttribute('data-open-product'));
        return;
      }
      if (t.hasAttribute('data-remove')) {
        B.removeFromCart(t.getAttribute('data-remove'));
        viewCart();
        return;
      }
      if (t.hasAttribute('data-qty')) {
        var id = t.getAttribute('data-qty');
        var delta = Number(t.getAttribute('data-delta') || 0);
        var line = B.getCart().items.filter(function (i) {
          return i.productId === id;
        })[0];
        var next = (line ? line.quantity : 0) + delta;
        B.setQty(id, next);
        viewCart();
        return;
      }
      if (t.hasAttribute('data-select-address')) {
        B.selectAddress(t.getAttribute('data-select-address'));
        viewCheckout();
        return;
      }
      if (t.hasAttribute('data-select-payment')) {
        B.selectPayment(t.getAttribute('data-select-payment'));
        viewCheckout();
        return;
      }
      if (t.hasAttribute('data-order-tab')) {
        orderTab = t.getAttribute('data-order-tab');
        viewOrders();
        return;
      }
      if (t.hasAttribute('data-claim')) {
        var res = B.claimCoupon(t.getAttribute('data-claim'));
        toast(res.ok ? 'Coupon claimed' : res.error || 'Failed');
        viewCoupons();
        return;
      }
      if (t.hasAttribute('data-review')) {
        B.leaveReview(t.getAttribute('data-review'), t.getAttribute('data-product'), 5, 'Great quality');
        toast('Thanks for your review');
        return;
      }
    };

    main.onsubmit = function (e) {
      if (e.target && e.target.id === 'search-form') {
        e.preventDefault();
        var q = (e.target.q && e.target.q.value) || '';
        var action = e.target.getAttribute('data-search-action') || 'home';
        if (action.indexOf('listing:') === 0) {
          listingQuery = q;
          viewListing(action.slice(8), q);
        } else if (q) {
          listingQuery = q;
          go('/listing');
          viewListing(null, q);
        } else viewHome();
        return;
      }
      if (e.target && e.target.id === 'promo-form') {
        e.preventDefault();
        var code = (e.target.code && e.target.code.value) || '';
        var r = B.applyPromo(code);
        toast(r.ok ? 'Promo applied' : r.error || 'Invalid code');
        viewCart();
        return;
      }
      if (e.target && e.target.id === 'claim-code-form') {
        e.preventDefault();
        var c = ((e.target.code && e.target.code.value) || '').toUpperCase();
        var claimed = B.claimCoupon(c);
        if (claimed.ok) B.applyPromo(c);
        toast(claimed.ok ? 'Coupon claimed' : claimed.error || 'Invalid');
        viewCoupons();
      }
    };

    document.addEventListener('click', function (e) {
      if (e.target && e.target.id === 'confirm-pay') {
        var out = B.checkout();
        if (!out.ok) {
          toast(out.error || 'Checkout failed');
          return;
        }
        toast('Payment confirmed');
        go('/tracking/' + out.order.id);
      }
    });
  }

  function render() {
    if (!B || !main) return;
    var r = route();
    try {
      if (r.name === 'home') viewHome();
      else if (r.name === 'listing') viewListing(r.segs[1] ? decodeURIComponent(r.segs[1]) : null, listingQuery);
      else if (r.name === 'explore') viewListing(r.segs[1] ? decodeURIComponent(r.segs[1]) : null);
      else if (r.name === 'cart' || r.name === 'items') viewCart();
      else if (r.name === 'checkout') viewCheckout();
      else if (r.name === 'orders') viewOrders();
      else if (r.name === 'tracking' && r.segs[1]) viewTracking(r.segs[1]);
      else if (r.name === 'coupons') viewCoupons();
      else if (r.name === 'favorites') viewFavorites();
      else if (r.name === 'profile') viewProfile();
      else if (r.name === 'product' && r.segs[1]) viewProduct(r.segs[1]);
      else viewHome();
      main.scrollTop = 0;
    } catch (err) {
      console.error(err);
      main.innerHTML = '<div class="empty"><h2>Something went wrong</h2><p><a href="/?reset=1">Reset & reload</a></p></div>';
    }
  }

  function boot() {
    C = window.Teedeux && window.Teedeux.catalog;
    B = window.Teedeux && window.Teedeux.backend;
    main = document.getElementById('main');
    if (!C || !B || !main) {
      setTimeout(boot, 30);
      return;
    }
    bind();
    if (!location.hash || location.hash === '#' || location.hash === '#/') location.replace('#/home');
    window.addEventListener('hashchange', render);
    window.addEventListener('teedeux-catalog-changed', function () {
      render();
    });
    window.addEventListener('storage', function (e) {
      if (!e) return;
      if (e.key === C.PRODUCT_STORE_KEY || e.key === 'teedeux-products-rev') {
        C.reloadProducts();
        render();
      }
    });
    window.addEventListener('focus', function () {
      C.hydrateFromServer().then(function (updated) {
        if (updated) render();
        else {
          C.reloadProducts();
          render();
        }
      });
    });
    B.subscribe(function () {
      setNav(route().name === 'cart' ? 'cart' : route().name === 'orders' ? 'orders' : route().name === 'favorites' ? 'favorites' : route().name === 'profile' ? 'profile' : 'home');
    });
    C.hydrateFromServer().finally(function () {
      render();
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
