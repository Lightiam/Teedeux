/**
 * Teedeux HTML5 SPA — hash router + view rendering.
 * Mobile-first, touch-optimized, works on desktop.
 */
(function () {
  'use strict';

  var C = null;
  var S = null;
  var main = null;
  var $header = null;
  var $nav = null;

  var CAT_ICONS = {
    Spices: '🌶️',
    Grains: '🌾',
    'Fresh Produce': '🥬',
    'Meat & Seafood': '🐟',
    Oils: '🫙',
    Frozen: '❄️',
    Snacks: '🍪',
    Pantry: '📦',
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

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

  function parseRoute() {
    var hash = (location.hash || '#/').replace(/^#/, '');
    if (!hash.startsWith('/')) hash = '/' + hash;
    var parts = hash.split('?');
    var path = parts[0];
    var segs = path.split('/').filter(Boolean);
    return { path: path, segs: segs, name: segs[0] || 'splash' };
  }

  function go(path) {
    location.hash = path.startsWith('#') ? path : '#' + path;
  }

  function qtyInCart() {
    return (S.cart.items || []).reduce(function (n, i) {
      return n + i.quantity;
    }, 0);
  }

  function setChrome(mode) {
    var authLike = mode === 'auth' || mode === 'splash';
    $header.hidden = authLike;
    $nav.hidden = authLike;
    main.classList.toggle('auth-mode', authLike);
    var addr = S.session.address;
    $('#header-address').textContent = addr
      ? addr.label || addr.city + ', ' + addr.state
      : 'Set address';
    var badge = $('#nav-cart-badge');
    var n = qtyInCart();
    if (n > 0) {
      badge.hidden = false;
      badge.textContent = String(n);
    } else {
      badge.hidden = true;
    }
    document.querySelectorAll('.nav-item').forEach(function (el) {
      el.classList.toggle('active', el.getAttribute('data-nav') === mode);
    });
  }

  function requireAuth(next) {
    if (!S.auth.user) {
      go('/login');
      return false;
    }
    return true;
  }

  /* ---------- Views ---------- */

  function viewSplash() {
    setChrome('splash');
    main.innerHTML =
      '<section class="splash" role="status" aria-live="polite">' +
      '<p class="h1">Teedeux</p>' +
      '<p>African groceries · Local + Nationwide</p>' +
      '</section>';
    setTimeout(function () {
      if (!S.auth.hasOnboarded) return go('/onboarding');
      if (!S.auth.user) return go('/login');
      if (S.auth.user.role === 'SHOPPER') return go('/shopper');
      go('/home');
    }, 900);
  }

  function viewOnboarding() {
    setChrome('auth');
    main.innerHTML =
      '<section class="auth-panel">' +
      '<p class="mono muted">Welcome</p>' +
      '<h1 class="h1" style="color:var(--primary);margin:0.5rem 0 1rem">Discover authentic African groceries</h1>' +
      '<div class="card" style="padding:0;overflow:hidden;margin-bottom:1rem">' +
      '<img src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=900&h=500&fit=crop" alt="African market ingredients" width="900" height="500" loading="eager" />' +
      '</div>' +
      '<p class="muted" style="margin-bottom:1.25rem">Same-day local delivery for fresh plantains and meats. Nationwide shipping for egusi, stockfish, and spices.</p>' +
      '<button type="button" class="btn btn--primary btn--block" id="ob-next">Continue</button>' +
      '<button type="button" class="btn btn--ghost btn--block" id="ob-skip" style="margin-top:0.5rem">Skip to login</button>' +
      '</section>';
    $('#ob-next').onclick = function () {
      main.innerHTML =
        '<section class="auth-panel">' +
        '<p class="mono muted">Fulfillment</p>' +
        '<h1 class="h1" style="color:var(--primary);margin:0.5rem 0 1rem">Local same-day + ships US-wide</h1>' +
        '<div class="card" style="margin-bottom:1rem">' +
        '<p><strong style="color:var(--secondary)">Local lane</strong> — shoppers pick perishables near you.</p>' +
        '<p style="margin-top:0.75rem"><strong style="color:var(--primary)">Nationwide lane</strong> — specialty dry goods from partner vendors.</p>' +
        '</div>' +
        '<button type="button" class="btn btn--primary btn--block" id="ob-done">Get started</button>' +
        '</section>';
      $('#ob-done').onclick = function () {
        S.completeOnboarding();
        go('/login');
      };
    };
    $('#ob-skip').onclick = function () {
      S.completeOnboarding();
      go('/login');
    };
  }

  function viewLogin() {
    setChrome('auth');
    main.innerHTML =
      '<section class="auth-panel">' +
      '<a class="brand" href="#/"><span class="brand__mark">T</span> Teedeux</a>' +
      '<h1 class="h2" style="margin-bottom:1rem">Sign in</h1>' +
      '<form id="login-form">' +
      '<div class="field"><label for="email">Email</label><input id="email" name="email" type="email" autocomplete="username" required placeholder="ada@teedeux.com" /></div>' +
      '<div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="current-password" required minlength="4" placeholder="••••" /></div>' +
      '<p class="mono muted" id="login-error" style="color:var(--error);min-height:1.2rem"></p>' +
      '<button class="btn btn--primary btn--block" type="submit">Sign in</button>' +
      '</form>' +
      '<p class="muted" style="margin-top:1rem;font-size:0.9rem">Demo: any email + password (4+). Use <strong>shopper@teedeux.com</strong> for shopper mode.</p>' +
      '<p style="margin-top:1rem"><a href="#/signup">Create account</a> · <a href="#/forgot">Forgot password</a></p>' +
      '</section>';
    $('#login-form').onsubmit = function (e) {
      e.preventDefault();
      var email = $('#email').value;
      var pass = $('#password').value;
      if (!S.login(email, pass)) {
        $('#login-error').textContent = 'Enter a valid email and password (4+ characters).';
        return;
      }
      if (S.auth.user.role === 'SHOPPER') go('/shopper');
      else go('/home');
    };
  }

  function viewSignup() {
    setChrome('auth');
    main.innerHTML =
      '<section class="auth-panel">' +
      '<a class="brand" href="#/login"><span class="brand__mark">T</span> Teedeux</a>' +
      '<h1 class="h2" style="margin-bottom:1rem">Create account</h1>' +
      '<form id="signup-form">' +
      '<div class="field"><label for="name">Full name</label><input id="name" required autocomplete="name" /></div>' +
      '<div class="field"><label for="email">Email</label><input id="email" type="email" required autocomplete="email" /></div>' +
      '<div class="field"><label for="phone">Phone</label><input id="phone" type="tel" autocomplete="tel" /></div>' +
      '<div class="field"><label for="password">Password</label><input id="password" type="password" required minlength="4" autocomplete="new-password" /></div>' +
      '<button class="btn btn--primary btn--block" type="submit">Create account</button>' +
      '</form>' +
      '<p style="margin-top:1rem"><a href="#/login">Already have an account?</a></p>' +
      '</section>';
    $('#signup-form').onsubmit = function (e) {
      e.preventDefault();
      if (
        !S.signup(
          $('#name').value,
          $('#email').value,
          $('#password').value,
          $('#phone').value
        )
      ) {
        alert('Please fill name, email, and a password with 4+ characters.');
        return;
      }
      go('/home');
    };
  }

  function viewForgot() {
    setChrome('auth');
    main.innerHTML =
      '<section class="auth-panel">' +
      '<h1 class="h2">Reset password</h1>' +
      '<p class="muted">We will email a reset link (demo — no email sent).</p>' +
      '<form id="forgot-form" style="margin-top:1rem">' +
      '<div class="field"><label for="email">Email</label><input id="email" type="email" required /></div>' +
      '<button class="btn btn--primary btn--block" type="submit">Send reset link</button>' +
      '</form>' +
      '<p id="forgot-done" class="muted" style="display:none;margin-top:1rem;color:var(--secondary)">Check your inbox — then <a href="#/login">sign in</a>.</p>' +
      '</section>';
    $('#forgot-form').onsubmit = function (e) {
      e.preventDefault();
      $('#forgot-form').hidden = true;
      $('#forgot-done').style.display = 'block';
    };
  }

  function productCard(p) {
    return (
      '<article class="product-card">' +
      '<img class="product-card__img" src="' +
      esc(p.imageUrl) +
      '" alt="' +
      esc(p.name) +
      '" loading="lazy" width="400" height="300" />' +
      '<div class="product-card__body">' +
      '<span class="badge ' +
      (p.temperatureClass === 'DRY' ? 'badge--primary' : 'badge--secondary') +
      '">' +
      esc(p.temperatureClass) +
      '</span>' +
      '<div class="product-card__name">' +
      esc(p.name) +
      '</div>' +
      '<p class="mono muted">' +
      esc(String(p.unit).toLowerCase()) +
      '</p>' +
      '<div class="product-card__footer">' +
      '<span class="price">' +
      money(p.priceCents) +
      '</span>' +
      '<button type="button" class="add-fab" data-add="' +
      esc(p.id) +
      '" aria-label="Add ' +
      esc(p.name) +
      '">+</button>' +
      '</div></div></article>'
    );
  }

  function viewHome() {
    if (!requireAuth()) return;
    setChrome('home');
    var q = '';
    var products = q ? C.searchProducts(q) : C.PRODUCTS.slice(0, 8);
    var catHtml = C.CATEGORIES.map(function (c) {
      return (
        '<button type="button" class="cat-chip" data-cat="' +
        esc(c.id) +
        '"><span class="cat-chip__icon" aria-hidden="true">' +
        (CAT_ICONS[c.id] || '🛒') +
        '</span>' +
        esc(c.label) +
        '</button>'
      );
    }).join('');

    var storesHtml = C.STORES.map(function (s) {
      return (
        '<a class="store-card" href="#/store/' +
        esc(s.id) +
        '"><img src="' +
        esc(s.coverImageUrl) +
        '" alt="" loading="lazy" width="320" height="160" /><div class="store-card__body"><strong>' +
        esc(s.name) +
        '</strong><p class="mono muted" style="margin:0.35rem 0 0">' +
        esc(s.address.city) +
        ', ' +
        esc(s.address.state) +
        ' · ' +
        esc(s.fulfillmentType.replace(/_/g, ' ')) +
        '</p></div></a>'
      );
    }).join('');

    var bundlesHtml = C.BUNDLES.map(function (b) {
      return (
        '<button type="button" class="card" data-bundle="' +
        esc(b.id) +
        '" style="width:min(14rem,75vw);text-align:left;padding:0;overflow:hidden">' +
        '<img src="' +
        esc(b.imageUrl) +
        '" alt="" style="height:6rem;width:100%;object-fit:cover" loading="lazy" />' +
        '<div style="padding:0.75rem"><strong>' +
        esc(b.name) +
        '</strong><p class="mono muted" style="margin:0.25rem 0 0">Add all ingredients</p></div></button>'
      );
    }).join('');

    main.innerHTML =
      '<div class="search" role="search">' +
      '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>' +
      '<input id="home-search" type="search" enterkeyhint="search" placeholder="Search spices, grains, Egusi Soup…" value="' +
      esc(q) +
      '" aria-label="Search products" />' +
      '</div>' +
      '<section class="section hero" aria-label="Weekly specials">' +
      '<img class="hero__bg" src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1400&h=700&fit=crop" alt="" />' +
      '<div class="hero__overlay"></div>' +
      '<div class="hero__content">' +
      '<span class="badge badge--primary">Limited offer</span>' +
      '<h1 class="h2" style="color:#fff">Weekly Specials</h1>' +
      '<p style="margin:0;opacity:0.9">Up to 30% off authentic spices and premium grains.</p>' +
      '</div></section>' +
      '<section class="section"><div class="section__head"><h2 class="h3">Browse categories</h2></div>' +
      '<div class="h-scroll">' +
      catHtml +
      '</div></section>' +
      '<section class="section"><div class="section__head"><h2 class="h3">Nearby & ship-from</h2></div>' +
      '<div class="h-scroll">' +
      storesHtml +
      '</div></section>' +
      '<section class="section"><div class="section__head"><h2 class="h3">Cook a dish</h2></div>' +
      '<div class="h-scroll">' +
      bundlesHtml +
      '</div></section>' +
      '<section class="section"><div class="section__head"><h2 class="h3">' +
      (q ? 'Results' : 'Featured products') +
      '</h2></div>' +
      '<div class="product-grid" id="home-products">' +
      products.map(productCard).join('') +
      '</div></section>';

    bindProductAdds(main);
    var searchTimer;
    $('#home-search').addEventListener('input', function (e) {
      clearTimeout(searchTimer);
      var val = e.target.value;
      searchTimer = setTimeout(function () {
        var list = val.trim() ? C.searchProducts(val) : C.PRODUCTS.slice(0, 8);
        var grid = document.getElementById('home-products');
        if (!grid) return;
        grid.innerHTML = list.map(productCard).join('');
        bindProductAdds(grid);
        var head = grid.previousElementSibling;
      }, 180);
    });
    main.querySelectorAll('[data-bundle]').forEach(function (btn) {
      btn.onclick = function () {
        C.getBundleProducts(btn.getAttribute('data-bundle')).forEach(function (p) {
          S.addItem(p, 1);
        });
        updateBadge();
        go('/cart');
      };
    });
    main.querySelectorAll('[data-cat]').forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.getAttribute('data-cat');
        var list = C.PRODUCTS.filter(function (p) {
          return p.category === id;
        });
        $('#home-products').innerHTML = list.map(productCard).join('');
        bindProductAdds($('#home-products'));
      };
    });
  }

  function bindProductAdds(root) {
    root.querySelectorAll('[data-add]').forEach(function (btn) {
      btn.onclick = function () {
        var p = C.getProductById(btn.getAttribute('data-add'));
        if (p) {
          S.addItem(p, 1);
          updateBadge();
          btn.textContent = '✓';
          setTimeout(function () {
            btn.textContent = '+';
          }, 700);
        }
      };
    });
  }

  function updateBadge() {
    var badge = $('#nav-cart-badge');
    var n = qtyInCart();
    badge.hidden = n === 0;
    badge.textContent = String(n);
  }

  function viewStore(id) {
    if (!requireAuth()) return;
    setChrome('home');
    var store = C.getStoreById(id);
    if (!store) {
      main.innerHTML = '<p>Store not found. <a href="#/home">Back home</a></p>';
      return;
    }
    S.setSelectedStore(store.id);
    var products = C.getProductsByStore(store.id);
    main.innerHTML =
      '<button type="button" class="btn btn--ghost" id="back-home">← Back</button>' +
      '<section class="hero section" style="margin-top:0.75rem">' +
      '<img class="hero__bg" src="' +
      esc(store.coverImageUrl) +
      '" alt="" />' +
      '<div class="hero__overlay"></div>' +
      '<div class="hero__content"><span class="badge badge--secondary">' +
      esc(store.fulfillmentType.replace(/_/g, ' ')) +
      '</span><h1 class="h2" style="color:#fff">' +
      esc(store.name) +
      '</h1><p style="margin:0;opacity:0.9">' +
      esc(store.description) +
      '</p></div></section>' +
      '<section class="section"><div class="product-grid">' +
      products.map(productCard).join('') +
      '</div></section>' +
      (qtyInCart()
        ? '<div class="sticky-cta"><button type="button" class="btn btn--primary btn--block" id="to-cart">View cart · ' +
          qtyInCart() +
          ' items</button></div>'
        : '');
    $('#back-home').onclick = function () {
      go('/home');
    };
    var toCart = $('#to-cart');
    if (toCart)
      toCart.onclick = function () {
        go('/cart');
      };
    bindProductAdds(main);
  }

  function lineControls(item) {
    return (
      '<div class="qty" role="group" aria-label="Quantity">' +
      '<button type="button" data-qty="' +
      esc(item.id) +
      '" data-delta="-1" aria-label="Decrease">−</button>' +
      '<span class="mono">' +
      item.quantity +
      '</span>' +
      '<button type="button" data-qty="' +
      esc(item.id) +
      '" data-delta="1" aria-label="Increase">+</button>' +
      '</div>'
    );
  }

  function renderLane(title, badgeClass, badgeText, items) {
    if (!items.length) {
      return (
        '<section class="lane"><div class="lane__head"><div class="lane__title"><strong>' +
        esc(title) +
        '</strong></div><span class="badge ' +
        badgeClass +
        '">' +
        esc(badgeText) +
        '</span></div><p class="muted" style="text-align:center;margin:0.5rem 0">No items</p></section>'
      );
    }
    return (
      '<section class="lane"><div class="lane__head"><div class="lane__title"><strong>' +
      esc(title) +
      '</strong></div><span class="badge ' +
      badgeClass +
      '">' +
      esc(badgeText) +
      '</span></div>' +
      items
        .map(function (item) {
          return (
            '<div class="line-item"><div><strong>' +
            esc(item.product.name) +
            '</strong><p class="mono muted" style="margin:0.2rem 0">' +
            esc(item.product.storeName) +
            '</p>' +
            lineControls(item) +
            '</div><div style="text-align:right"><strong>' +
            money(item.product.priceCents * item.quantity) +
            '</strong><br /><button type="button" class="btn btn--ghost btn--sm" data-remove="' +
            esc(item.id) +
            '">Remove</button></div></div>'
          );
        })
        .join('') +
      '</section>'
    );
  }

  function bindCartControls() {
    main.querySelectorAll('[data-qty]').forEach(function (btn) {
      btn.onclick = function () {
        var id = btn.getAttribute('data-qty');
        var delta = Number(btn.getAttribute('data-delta'));
        var item = S.cart.items.find(function (i) {
          return i.id === id;
        });
        if (!item) return;
        S.setQty(id, item.quantity + delta);
        render();
      };
    });
    main.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.onclick = function () {
        S.removeItem(btn.getAttribute('data-remove'));
        render();
      };
    });
  }

  function viewCart() {
    if (!requireAuth()) return;
    setChrome('cart');
    var local = S.getLocalItems();
    var ship = S.getShippedItems();
    var fees = S.getFees(S.session.address);
    if (!S.cart.items.length) {
      main.innerHTML =
        '<h1 class="h2">Cart</h1><div class="card" style="margin-top:1rem;text-align:center"><p class="muted">Your cart is empty.</p><a class="btn btn--primary" href="#/home" style="margin-top:1rem">Browse stores</a></div>';
      return;
    }
    main.innerHTML =
      '<h1 class="h2">Cart</h1><p class="muted">Split into local same-day and nationwide shipping.</p>' +
      renderLane('Local Same-Day', 'badge--secondary', 'Today', local) +
      renderLane('Nationwide Shipped', 'badge--primary', '2–4 days', ship) +
      '<div class="card"><div class="fee-row"><span>Subtotal</span><span class="mono">' +
      money(fees.subtotal) +
      '</span></div><div class="fee-row"><span>Est. fees + tax</span><span class="mono">' +
      money(
        fees.localDelivery +
          fees.shipping +
          fees.service +
          fees.tax
      ) +
      '</span></div><div class="fee-row fee-row--total"><span>Est. total</span><span>' +
      money(fees.total - fees.tip) +
      '+</span></div></div>' +
      '<div class="sticky-cta"><a class="btn btn--primary btn--block" href="#/checkout">Checkout</a></div>';
    bindCartControls();
  }

  function viewCheckout() {
    if (!requireAuth()) return;
    setChrome('cart');
    if (!S.cart.items.length) return go('/cart');
    var local = S.getLocalItems();
    var ship = S.getShippedItems();
    var addr = S.session.address || C.DEMO_ADDRESS;
    var fees = S.getFees(addr);
    var tips = [0, 300, 500, 800];
    main.innerHTML =
      '<h1 class="h2" style="color:var(--primary)">Final Review</h1>' +
      '<div class="checkout-grid" style="margin-top:1rem">' +
      '<div>' +
      renderLane('Local Same-Day Delivery', 'badge--secondary', 'Today', local) +
      renderLane('Nationwide Shipped', 'badge--primary', '2–4 days', ship) +
      '<button type="button" class="card" id="edit-addr" style="width:100%;text-align:left;margin-bottom:1rem">' +
      '<span class="mono muted">Delivery address</span><p style="margin:0.35rem 0 0"><strong>' +
      esc(addr.line1) +
      '</strong><br />' +
      esc(addr.city + ', ' + addr.state + ' ' + addr.postalCode) +
      '</p></button>' +
      '</div><aside class="checkout-grid__aside card">' +
      '<p class="mono muted">Tip for shopper</p><div class="tip-row">' +
      tips
        .map(function (t) {
          return (
            '<button type="button" class="tip-chip' +
            (S.tipCents === t ? ' active' : '') +
            '" data-tip="' +
            t +
            '">' +
            (t ? money(t) : 'None') +
            '</button>'
          );
        })
        .join('') +
      '</div><div style="margin-top:1rem">' +
      '<div class="fee-row"><span>Subtotal</span><span class="mono">' +
      money(fees.subtotal) +
      '</span></div>' +
      '<div class="fee-row"><span>Local delivery</span><span class="mono">' +
      (fees.localDelivery ? money(fees.localDelivery) : '—') +
      '</span></div>' +
      '<div class="fee-row"><span>Shipping</span><span class="mono">' +
      (fees.shipping ? money(fees.shipping) : '—') +
      '</span></div>' +
      '<div class="fee-row"><span>Service</span><span class="mono">' +
      money(fees.service) +
      '</span></div>' +
      '<div class="fee-row"><span>Tax</span><span class="mono">' +
      money(fees.tax) +
      '</span></div>' +
      '<div class="fee-row fee-row--total"><span>Total</span><span>' +
      money(fees.total) +
      '</span></div></div>' +
      '<button type="button" class="btn btn--primary btn--block" id="place-order" style="margin-top:1rem">Place hybrid order</button>' +
      '</aside></div>';

    // simplify lanes in checkout (no qty controls clutter) — re-bind tips only
    main.querySelectorAll('[data-tip]').forEach(function (btn) {
      btn.onclick = function () {
        S.setTip(Number(btn.getAttribute('data-tip')));
        render();
      };
    });
    $('#edit-addr').onclick = function () {
      go('/address');
    };
    $('#place-order').onclick = function () {
      try {
        var created = S.placeOrder(
          addr,
          S.session.paymentId || C.DEMO_PAYMENT.id
        );
        if (!created || !created.length) {
          alert('Could not place order.');
          return;
        }
        go(
          '/confirmation/' +
            created
              .map(function (o) {
                return o.id;
              })
              .join(',')
        );
      } catch (err) {
        alert(err.message || 'Could not place order.');
      }
    };
  }

  function viewAddress() {
    if (!requireAuth()) return;
    setChrome('profile');
    var a = S.session.address || C.DEMO_ADDRESS;
    main.innerHTML =
      '<h1 class="h2">Delivery address</h1>' +
      '<form id="addr-form" class="card" style="margin-top:1rem">' +
      '<div class="field"><label for="line1">Street</label><input id="line1" required value="' +
      esc(a.line1) +
      '" /></div>' +
      '<div class="field"><label for="line2">Apt</label><input id="line2" value="' +
      esc(a.line2 || '') +
      '" /></div>' +
      '<div class="field"><label for="city">City</label><input id="city" required value="' +
      esc(a.city) +
      '" /></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem">' +
      '<div class="field"><label for="state">State</label><input id="state" required maxlength="2" value="' +
      esc(a.state) +
      '" /></div>' +
      '<div class="field"><label for="zip">ZIP</label><input id="zip" required value="' +
      esc(a.postalCode) +
      '" /></div></div>' +
      '<button class="btn btn--primary btn--block" type="submit">Save address</button></form>';
    $('#addr-form').onsubmit = function (e) {
      e.preventDefault();
      S.setAddress({
        id: a.id || 'addr_custom',
        label: a.label || 'Home',
        line1: $('#line1').value.trim(),
        line2: $('#line2').value.trim(),
        city: $('#city').value.trim(),
        state: $('#state').value.trim().toUpperCase(),
        postalCode: $('#zip').value.trim(),
        country: 'US',
      });
      history.back();
    };
  }

  function viewConfirmation(idsCsv) {
    if (!requireAuth()) return;
    setChrome('orders');
    var ids = (idsCsv || '').split(',').filter(Boolean);
    var orders = ids.map(S.getOrder).filter(Boolean);
    main.innerHTML =
      '<section style="text-align:center;padding:2rem 0">' +
      '<div style="font-size:3rem;color:var(--secondary)" aria-hidden="true">✓</div>' +
      '<h1 class="h2">Order placed</h1>' +
      '<p class="muted">Your hybrid order is confirmed.</p></section>' +
      orders
        .map(function (o) {
          return (
            '<a class="card" href="#/order/' +
            esc(o.id) +
            '" style="display:block;margin-bottom:0.75rem">' +
            '<strong>' +
            esc(o.orderNumber) +
            '</strong>' +
            '<p class="mono muted" style="margin:0.35rem 0">' +
            esc(o.fulfillmentType.replace(/_/g, ' ')) +
            ' · ' +
            esc(o.status) +
            '</p>' +
            '<strong class="price">' +
            money(o.fees.total) +
            '</strong></a>'
          );
        })
        .join('') +
      '<a class="btn btn--primary btn--block" href="#/order/' +
      esc((orders[0] && orders[0].id) || '') +
      '">Track order</a>' +
      '<a class="btn btn--outline btn--block" href="#/home" style="margin-top:0.5rem">Back home</a>';
  }

  function viewOrders() {
    if (!requireAuth()) return;
    setChrome('orders');
    var orders = S.listOrders().filter(function (o) { return o.userId === S.auth.user.id; });
    main.innerHTML =
      '<h1 class="h2">Orders</h1>' +
      (orders.length
        ? '<div style="margin-top:1rem;display:grid;gap:0.75rem">' +
          orders
            .map(function (o) {
              return (
                '<a class="card" href="#/order/' +
                esc(o.id) +
                '" style="display:block">' +
                '<div style="display:flex;justify-content:space-between;gap:0.5rem"><strong>' +
                esc(o.orderNumber) +
                '</strong><span class="badge badge--muted">' +
                esc(o.status.replace(/_/g, ' ')) +
                '</span></div>' +
                '<p class="mono muted" style="margin:0.4rem 0">' +
                esc(o.fulfillmentType.replace(/_/g, ' ')) +
                '</p>' +
                '<strong class="price">' +
                money(o.fees.total) +
                '</strong></a>'
              );
            })
            .join('') +
          '</div>'
        : '<div class="card" style="margin-top:1rem;text-align:center"><p class="muted">No orders yet.</p><a class="btn btn--primary" href="#/home" style="margin-top:1rem">Start shopping</a></div>');
  }

  function viewOrder(id) {
    if (!requireAuth()) return;
    setChrome('orders');
    var order = S.getOrder(id);
    if (!order) {
      main.innerHTML = '<p>Order not found. <a href="#/orders">Back</a></p>';
      return;
    }
    var steps =
      order.fulfillmentType === 'NATIONWIDE_SHIPPING'
        ? ['CONFIRMED', 'LABEL_CREATED', 'SHIPPED', 'DELIVERED']
        : ['CONFIRMED', 'SHOPPING', 'OUT_FOR_DELIVERY', 'DELIVERED'];
    var idx = Math.max(0, steps.indexOf(order.status));
    main.innerHTML =
      '<button type="button" class="btn btn--ghost" id="back-orders">← Orders</button>' +
      '<section class="card" style="margin-top:0.75rem;text-align:center">' +
      '<p class="mono muted">' +
      esc(order.orderNumber) +
      '</p>' +
      '<h1 class="h2">' +
      (order.status === 'DELIVERED' ? 'Delivered' : 'Tracking') +
      '</h1>' +
      '<span class="badge badge--secondary">' +
      esc(order.status.replace(/_/g, ' ')) +
      '</span></section>' +
      '<ul class="timeline card" style="margin-top:1rem">' +
      steps
        .map(function (step, i) {
          var done = i <= idx;
          return (
            '<li><div class="timeline__rail"><div class="timeline__dot' +
            (done ? ' done' : '') +
            '"></div>' +
            (i < steps.length - 1
              ? '<div class="timeline__line' + (i < idx ? ' done' : '') + '"></div>'
              : '') +
            '</div><div><strong style="text-transform:capitalize">' +
            esc(step.replace(/_/g, ' ').toLowerCase()) +
            '</strong></div></li>'
          );
        })
        .join('') +
      '</ul>' +
      '<div class="card" style="margin-top:1rem"><p class="mono muted">Items · ' +
      esc(order.storeName) +
      '</p>' +
      order.items
        .map(function (it) {
          return (
            '<div class="fee-row"><span>' +
            esc(it.quantity + '× ' + it.productName) +
            '</span><span class="mono">' +
            money(it.unitPriceCents * it.quantity) +
            '</span></div>'
          );
        })
        .join('') +
      '<div class="fee-row fee-row--total"><span>Total</span><span>' +
      money(order.fees.total) +
      '</span></div></div>' +
      (order.status !== 'DELIVERED'
        ? '<button type="button" class="btn btn--outline btn--block" id="advance" style="margin-top:1rem">Advance status (demo)</button>'
        : '');
    $('#back-orders').onclick = function () {
      go('/orders');
    };
    var adv = $('#advance');
    if (adv) {
      adv.onclick = function () {
        var next = steps[idx + 1];
        if (next) S.updateStatus(order.id, next);
        render();
      };
    }
  }

  function viewProfile() {
    if (!requireAuth()) return;
    setChrome('profile');
    var u = S.auth.user;
    main.innerHTML =
      '<h1 class="h2">Profile</h1>' +
      '<div class="card" style="margin-top:1rem;display:flex;gap:1rem;align-items:center">' +
      '<div style="width:3.5rem;height:3.5rem;border-radius:999px;background:var(--primary-fixed);display:grid;place-items:center;font-weight:800;color:var(--primary)">' +
      esc(
        (u.name || 'T')
          .split(' ')
          .map(function (p) {
            return p[0];
          })
          .join('')
          .slice(0, 2)
          .toUpperCase()
      ) +
      '</div><div><strong>' +
      esc(u.name) +
      '</strong><p class="mono muted" style="margin:0.2rem 0 0">' +
      esc(u.email) +
      '</p></div></div>' +
      '<div style="margin-top:1rem;display:grid;gap:0.5rem">' +
      '<a class="card" href="#/address">Delivery address</a>' +
      '<a class="card" href="#/shopper">Shopper mode</a>' +
      '</div>' +
      '<button type="button" class="btn btn--outline btn--block" id="logout" style="margin-top:1.5rem">Log out</button>' +
      '<p class="mono muted" style="text-align:center;margin-top:1rem">Teedeux HTML5 · v1.0.0</p>';
    $('#logout').onclick = function () {
      S.logout();
      go('/login');
    };
  }

  function viewShopper() {
    if (!requireAuth()) return;
    setChrome('auth');
    var orders = S.listOrders().filter(function (o) {
      return (
        o.fulfillmentType === 'LOCAL_DELIVERY' &&
        (o.status === 'CONFIRMED' || o.status === 'SHOPPING')
      );
    });
    // seed demo batch if empty
    if (!orders.length && S.cart) {
      // place a synthetic local order from featured products if user is shopper
      var demoProducts = C.getProductsByStore('store_mama_jones').slice(0, 4);
      if (demoProducts.length) {
        demoProducts.forEach(function (p) {
          S.addItem(p, p.temperatureClass === 'FRESH' ? 2 : 1);
        });
        S.setTip(500);
        var created = S.placeOrder(C.DEMO_ADDRESS, C.DEMO_PAYMENT.id);
        created.forEach(function (o) {
          if (o.fulfillmentType === 'LOCAL_DELIVERY') S.updateStatus(o.id, 'SHOPPING');
        });
        orders = S.listOrders().filter(function (o) {
          return o.fulfillmentType === 'LOCAL_DELIVERY' && o.status !== 'DELIVERED';
        });
      }
    }
    main.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;gap:1rem">' +
      '<div><p class="mono muted">Teedeux Shopper</p><h1 class="h2">' +
      esc(S.auth.user.name) +
      '</h1></div>' +
      '<button type="button" class="btn btn--outline btn--sm" id="shopper-out">Log out</button></div>' +
      '<p class="muted" style="margin:0.75rem 0 1rem">Accept local batches · pick in-store · deliver.</p>' +
      (orders.length
        ? orders
            .map(function (o) {
              var payout = 200 + o.items.length * 75 + (o.fees.tip || 0);
              return (
                '<article class="card" style="margin-bottom:0.75rem"><div style="display:flex;justify-content:space-between"><strong>' +
                esc(o.orderNumber) +
                '</strong><span class="badge badge--secondary">' +
                esc(o.status) +
                '</span></div><p class="mono muted">' +
                esc(o.storeName) +
                ' · ' +
                o.items.length +
                ' items</p><p><strong class="price">' +
                money(payout) +
                '</strong> payout est.</p>' +
                '<a class="btn btn--primary btn--block" style="margin-top:0.75rem" href="#/shopper/order/' +
                esc(o.id) +
                '">Accept & pick</a></article>'
              );
            })
            .join('')
        : '<div class="card"><p class="muted">No local batches right now. Place a local order as a customer first.</p><a href="#/home">Go shopping</a></div>');
    $('#shopper-out').onclick = function () {
      S.logout();
      go('/login');
    };
  }

  function viewShopperPick(id) {
    if (!requireAuth()) return;
    setChrome('auth');
    var order = S.getOrder(id);
    if (!order) {
      main.innerHTML = '<p>Batch not found.</p>';
      return;
    }
    // track found items in sessionStorage for demo
    var key = 'pick_' + id;
    var found = {};
    try {
      found = JSON.parse(sessionStorage.getItem(key) || '{}');
    } catch (e) {}
    var total = order.items.length;
    var done = order.items.filter(function (it) {
      return found[it.id];
    }).length;

    main.innerHTML =
      '<h1 class="h2">' +
      esc(order.orderNumber) +
      '</h1>' +
      '<p class="mono muted">' +
      done +
      '/' +
      total +
      ' gathered</p>' +
      '<div style="height:0.5rem;background:var(--surface-high);border-radius:999px;overflow:hidden;margin:0.5rem 0 1rem"><div style="height:100%;width:' +
      Math.round((done / total) * 100) +
      '%;background:var(--secondary)"></div></div>' +
      order.items
        .map(function (it) {
          var isFound = !!found[it.id];
          return (
            '<div class="card" style="margin-bottom:0.5rem;opacity:' +
            (isFound ? '0.7' : '1') +
            '"><strong' +
            (isFound ? ' style="text-decoration:line-through"' : '') +
            '>' +
            esc(it.productName) +
            '</strong><p class="mono muted">qty ' +
            it.quantity +
            '</p>' +
            (isFound
              ? '<span class="badge badge--secondary">Found</span>'
              : '<button type="button" class="btn btn--primary btn--sm" data-found="' +
                esc(it.id) +
                '" style="margin-top:0.5rem">Found</button> <button type="button" class="btn btn--outline btn--sm" data-oos="' +
                esc(it.id) +
                '">Out of stock</button>') +
            '</div>'
          );
        })
        .join('') +
      '<button type="button" class="btn btn--secondary btn--block sticky-cta" id="complete-pick"' +
      (done < total ? ' disabled' : '') +
      '>' +
      (done < total ? 'Gather remaining items' : 'Complete · Start delivery') +
      '</button>';

    main.querySelectorAll('[data-found]').forEach(function (btn) {
      btn.onclick = function () {
        found[btn.getAttribute('data-found')] = true;
        sessionStorage.setItem(key, JSON.stringify(found));
        render();
      };
    });
    main.querySelectorAll('[data-oos]').forEach(function (btn) {
      btn.onclick = function () {
        var alt = prompt('Suggest a replacement (or leave blank to refund):');
        found[btn.getAttribute('data-oos')] = true;
        sessionStorage.setItem(key, JSON.stringify(found));
        if (alt) alert('Substitution sent to customer: ' + alt);
        else alert('Item marked for refund.');
        render();
      };
    });
    $('#complete-pick').onclick = function () {
      S.updateStatus(order.id, 'OUT_FOR_DELIVERY');
      if (confirm('Mark delivered now? (demo)')) {
        S.updateStatus(order.id, 'DELIVERED');
      }
      go('/shopper');
    };
  }

  /* ---------- Router ---------- */

  function render() {
    C = window.Teedeux.catalog;
    S = window.Teedeux.store;
    if (!C || !S) {
      main.innerHTML = '<p class="muted" style="padding:2rem">Loading Teedeux…</p>';
      return;
    }
    var route = parseRoute();
    var name = route.name;
    var segs = route.segs;

    if (!name || name === 'splash') return viewSplash();
    if (name === 'onboarding') return viewOnboarding();
    if (name === 'login') return viewLogin();
    if (name === 'signup') return viewSignup();
    if (name === 'forgot') return viewForgot();
    if (name === 'home') return viewHome();
    if (name === 'store' && segs[1]) return viewStore(segs[1]);
    if (name === 'cart') return viewCart();
    if (name === 'checkout') return viewCheckout();
    if (name === 'address') return viewAddress();
    if (name === 'confirmation' && segs[1]) return viewConfirmation(segs[1]);
    if (name === 'orders') return viewOrders();
    if (name === 'order' && segs[1]) return viewOrder(segs[1]);
    if (name === 'profile') return viewProfile();
    if (name === 'shopper' && segs[1] === 'order' && segs[2])
      return viewShopperPick(segs[2]);
    if (name === 'shopper') return viewShopper();
    viewSplash();
  }

  function boot() {
    main = document.getElementById('main');
    $header = document.getElementById('app-header');
    $nav = document.getElementById('app-nav');
    $('#btn-profile-jump').onclick = function () {
      go('/profile');
    };
    $('#header-deliver').onclick = function () {
      go('/address');
    };
    window.addEventListener('hashchange', render);
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    // deferred scripts: wait a tick for catalog/store
    setTimeout(boot, 0);
  }
})();
