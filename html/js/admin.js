/**
 * Teedeux Super Admin — owner-controlled product CRUD.
 * Saves publish to /api/products so the live shop reflects changes.
 *
 * Full login:
 *   Username: teedeux.dev@gmail.com
 *   Password: ChangeMeImmediately123!
 */
(function () {
  'use strict';

  var SESSION_KEY = 'teedeux-super-admin-session';
  var OWNER_USERNAME = 'teedeux.dev@gmail.com';
  var OWNER_PASSWORD = 'ChangeMeImmediately123!';

  var loginView = document.getElementById('login-view');
  var adminView = document.getElementById('admin-view');
  var selectedId = null;
  var saving = false;

  function catalog() {
    return window.Teedeux && window.Teedeux.catalog;
  }

  function moneyFromCents(cents) {
    return ((Number(cents) || 0) / 100).toFixed(2);
  }

  function centsFromMoney(value) {
    var n = Number(value);
    if (!isFinite(n) || n < 0) return 0;
    return Math.round(n * 100);
  }

  function getSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      var s = JSON.parse(raw);
      if (!s || s.email !== OWNER_USERNAME || s.role !== 'SUPER_ADMIN' || !s.password) return null;
      return s;
    } catch (e) {
      return null;
    }
  }

  function setSession(email, password) {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        email: email,
        username: email,
        password: password,
        role: 'SUPER_ADMIN',
        name: 'Teedeux Super Admin',
        at: new Date().toISOString(),
      })
    );
  }

  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  function creds() {
    var s = getSession();
    return s ? { email: s.email, username: s.email, password: s.password } : null;
  }

  function show(view) {
    loginView.hidden = view !== 'login';
    adminView.hidden = view !== 'admin';
  }

  function categories() {
    var C = catalog();
    return (C && C.CATEGORIES) || [];
  }

  function fillCategorySelects() {
    var opts = categories()
      .map(function (c) {
        return '<option value="' + c.id + '">' + c.label + '</option>';
      })
      .join('');
    document.getElementById('f-category').innerHTML = opts;
    document.getElementById('filter-category').innerHTML =
      '<option value="">All categories</option>' + opts;
  }

  function filteredProducts() {
    var C = catalog();
    if (!C) return [];
    var q = (document.getElementById('search').value || '').trim().toLowerCase();
    var cat = document.getElementById('filter-category').value;
    return C.PRODUCTS.filter(function (p) {
      if (cat && p.category !== cat) return false;
      if (!q) return true;
      return (
        (p.name || '').toLowerCase().indexOf(q) >= 0 ||
        (p.id || '').toLowerCase().indexOf(q) >= 0 ||
        (p.description || '').toLowerCase().indexOf(q) >= 0
      );
    });
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderList() {
    var list = filteredProducts();
    document.getElementById('count-label').textContent = list.length + ' products';
    var el = document.getElementById('product-list');
    if (!list.length) {
      el.innerHTML = '<p class="empty">No products match.</p>';
      return;
    }
    el.innerHTML = list
      .map(function (p) {
        var active = p.id === selectedId ? ' active' : '';
        return (
          '<button type="button" class="product-row' +
          active +
          '" data-id="' +
          p.id +
          '">' +
          '<img src="' +
          (p.imageUrl || '') +
          '" alt="" />' +
          '<span><strong>' +
          escapeHtml(p.name) +
          '</strong><em>' +
          escapeHtml(p.category) +
          ' · ' +
          escapeHtml(p.size || '') +
          '</em></span>' +
          '<b>$' +
          moneyFromCents(p.priceCents) +
          '</b></button>'
        );
      })
      .join('');
  }

  function loadIntoForm(p) {
    selectedId = p ? p.id : null;
    document.getElementById('editor-title').textContent = p ? 'Edit product' : 'New product';
    document.getElementById('f-id').value = p ? p.id : '';
    document.getElementById('f-name').value = p ? p.name : '';
    document.getElementById('f-size').value = p ? p.size || '' : '';
    document.getElementById('f-category').value = p ? p.category : categories()[0].id;
    document.getElementById('f-price').value = p ? moneyFromCents(p.priceCents) : '';
    document.getElementById('f-compare').value = p && p.compareAtCents ? moneyFromCents(p.compareAtCents) : '';
    document.getElementById('f-badge').value = p ? p.badge || '' : '';
    document.getElementById('f-ship').checked = !!(p && p.shippable);
    document.getElementById('f-image').value = p ? p.imageUrl || '' : '/img/products/jollof-rice.jpg';
    document.getElementById('f-desc').value = p ? p.description || '' : '';
    document.getElementById('form-msg').hidden = true;
    document.getElementById('after-save').hidden = true;
    document.getElementById('delete-btn').hidden = !p;
    renderList();
  }

  function flash(msg, isError) {
    var el = document.getElementById('form-msg');
    el.hidden = false;
    el.textContent = msg;
    el.className = 'msg' + (isError ? ' error' : '');
    document.getElementById('after-save').hidden = !!isError;
  }

  function setBusy(on) {
    saving = !!on;
    var btn = document.getElementById('save-btn');
    if (btn) {
      btn.disabled = saving;
      btn.textContent = saving ? 'Publishing…' : 'Save & publish to shop';
    }
  }

  function publishThen(doneMsg) {
    var C = catalog();
    var auth = creds();
    if (!C || !auth) return Promise.resolve();
    setBusy(true);
    return C.publishToServer(auth).then(function (result) {
      setBusy(false);
      if (result.ok && !result.localOnly) {
        flash(doneMsg + ' Live shop updated for all shoppers.');
      } else if (result.localOnly) {
        flash(
          doneMsg +
            ' Saved on this device' +
            (result.error ? ' (' + result.error + ')' : '') +
            '. Deployed Netlify sites sync via /api/products.',
          false
        );
      } else {
        flash(result.error || 'Publish failed', true);
      }
      document.getElementById('view-shop-btn').href = '/#/home?catalog=' + Date.now();
    });
  }

  function bootAdmin() {
    var session = getSession();
    document.getElementById('session-meta').textContent =
      'Signed in as ' + session.username + ' (Super Admin) · your saves control the live catalog';
    fillCategorySelects();
    var C = catalog();
    C.hydrateFromServer().finally(function () {
      loadIntoForm(C.PRODUCTS[0] || null);
      show('admin');
    });
  }

  document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var email = (document.getElementById('email').value || '').trim().toLowerCase();
    var password = document.getElementById('password').value || '';
    var err = document.getElementById('login-error');
    if (email !== OWNER_USERNAME || password !== OWNER_PASSWORD) {
      err.hidden = false;
      err.textContent =
        'Invalid login. Username: ' + OWNER_USERNAME + ' · Password: ' + OWNER_PASSWORD;
      return;
    }
    err.hidden = true;
    setSession(email, password);
    bootAdmin();
  });

  document.getElementById('logout-btn').addEventListener('click', function () {
    clearSession();
    show('login');
  });

  document.getElementById('search').addEventListener('input', renderList);
  document.getElementById('filter-category').addEventListener('change', renderList);

  document.getElementById('product-list').addEventListener('click', function (e) {
    var btn = e.target.closest('[data-id]');
    if (!btn) return;
    var p = catalog().getProduct(btn.getAttribute('data-id'));
    if (p) loadIntoForm(p);
  });

  document.getElementById('new-btn').addEventListener('click', function () {
    loadIntoForm(null);
    document.getElementById('f-name').focus();
  });

  document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault();
    if (saving) return;
    var C = catalog();
    if (!C) return;
    var compareRaw = document.getElementById('f-compare').value;
    var saved = C.upsertProduct({
      id: document.getElementById('f-id').value || undefined,
      name: document.getElementById('f-name').value,
      size: document.getElementById('f-size').value,
      category: document.getElementById('f-category').value,
      priceCents: centsFromMoney(document.getElementById('f-price').value),
      compareAtCents: compareRaw === '' ? undefined : centsFromMoney(compareRaw),
      badge: document.getElementById('f-badge').value,
      shipNationwide: document.getElementById('f-ship').checked,
      imageUrl: document.getElementById('f-image').value,
      description: document.getElementById('f-desc').value,
    });
    loadIntoForm(saved);
    publishThen('Saved "' + saved.name + '".');
  });

  document.getElementById('delete-btn').addEventListener('click', function () {
    var id = document.getElementById('f-id').value;
    if (!id || saving) return;
    if (!confirm('Delete this product from the live shop catalog?')) return;
    catalog().deleteProduct(id);
    loadIntoForm(catalog().PRODUCTS[0] || null);
    publishThen('Product deleted.');
  });

  document.getElementById('export-btn').addEventListener('click', function () {
    var blob = new Blob([catalog().exportProducts()], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'teedeux-products.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  document.getElementById('import-file').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      try {
        catalog().importProducts(String(reader.result || ''));
        loadIntoForm(catalog().PRODUCTS[0] || null);
        publishThen('Imported ' + catalog().PRODUCTS.length + ' products.');
      } catch (err) {
        flash(err.message || 'Import failed', true);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  });

  document.getElementById('reset-btn').addEventListener('click', function () {
    if (saving) return;
    if (!confirm('Reset all products to the default Teedeux African grocery catalog?')) return;
    var auth = creds();
    catalog().resetProducts();
    catalog()
      .resetOnServer(auth)
      .then(function () {
        return catalog().publishToServer(auth);
      })
      .then(function (result) {
        loadIntoForm(catalog().PRODUCTS[0] || null);
        if (result && result.ok) flash('Catalog reset and published to the live shop.');
        else flash('Catalog reset on this device.');
        document.getElementById('after-save').hidden = false;
      });
  });

  if (!catalog()) {
    document.body.innerHTML =
      '<p style="padding:24px;font-family:system-ui">Catalog failed to load. <a href="/admin.html">Retry</a></p>';
    return;
  }

  if (getSession()) bootAdmin();
  else show('login');
})();
