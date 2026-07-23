/**
 * Teedeux catalog — African food items with local product imagery.
 * Labels match common “Africa food items” grocery search results.
 */
(function (global) {
  'use strict';

  var Teedeux = (global.Teedeux = global.Teedeux || {});

  var CATEGORIES = [
    { id: 'Staples', label: 'Staples & Swallow' },
    { id: 'Spices', label: 'Spices & Seasonings' },
    { id: 'Oils', label: 'Oils & Pastes' },
    { id: 'Produce', label: 'Fresh Produce' },
    { id: 'Protein', label: 'Meat & Seafood' },
    { id: 'Snacks', label: 'Snacks & Bakery' },
    { id: 'Drinks', label: 'Drinks & Pantry' },
  ];


  // Food aisles — labeled as African foods (not third-party market brands)
  var AISLES = [
    {
      id: 'Staples',
      name: 'Pounded Yam, Fufu & Gari',
      shortName: 'Staples',
      subtitle: 'Swallow bases & grains',
      logoUrl: '/img/products/pounded-yam-flour.jpg',
      examples: 'Pounded yam · Fufu · White gari · Attiéké',
    },
    {
      id: 'Spices',
      name: 'Egusi, Suya & Berbere',
      shortName: 'Spices',
      subtitle: 'Spices & seasonings',
      logoUrl: '/img/products/egusi-seeds.jpg',
      examples: 'Egusi · Suya spice · Jollof spice · Ogbono',
    },
    {
      id: 'Oils',
      name: 'Red Palm Oil & Pastes',
      shortName: 'Oils',
      subtitle: 'Oils, pastes & stew bases',
      logoUrl: '/img/products/red-palm-oil.jpg',
      examples: 'Red palm oil · Groundnut paste · Tomato stew base',
    },
    {
      id: 'Produce',
      name: 'Plantains, Peppers & Greens',
      shortName: 'Produce',
      subtitle: 'Fresh produce',
      logoUrl: '/img/products/ripe-plantains.jpg',
      examples: 'Ripe plantains · Scotch bonnet · Ugu · Okro',
    },
    {
      id: 'Protein',
      name: 'Stockfish, Goat & Crayfish',
      shortName: 'Protein',
      subtitle: 'Meat & seafood',
      logoUrl: '/img/products/stockfish.jpg',
      examples: 'Stockfish · Goat meat · Dried crayfish · Smoked catfish',
    },
    {
      id: 'Snacks',
      name: 'Plantain Chips & Chin Chin',
      shortName: 'Snacks',
      subtitle: 'Snacks & bakery',
      logoUrl: '/img/products/plantain-chips.jpg',
      examples: 'Plantain chips · Chin chin · Agege bread',
    },
    {
      id: 'Drinks',
      name: 'Zobo Leaves & Coffee',
      shortName: 'Drinks',
      subtitle: 'Drinks & pantry',
      logoUrl: '/img/products/zobo-leaves.jpg',
      examples: 'Zobo (hibiscus) · Ethiopian coffee',
    },
  ];

  // Single Teedeux shop (brand) — not a copied market name
  var SHOP = {
    id: 'teedeux',
    name: 'Teedeux',
    shortName: 'Teedeux',
    logoUrl: '/icons/icon.svg',
    estimatedDeliveryMins: 45,
    estimatedPickupMins: 20,
    address: { line1: '', city: 'Nationwide', state: 'US', postalCode: '' },
  };

  // Back-compat alias used by older store.js helpers
  var STORES = [SHOP];


  function n(cals, fat, carb, protein, sodium) {
    return {
      servingSize: '1 serving',
      calories: cals,
      totalFat: fat,
      totalCarbohydrate: carb,
      protein: protein,
      sodium: sodium,
    };
  }

  function item(data) {
    var ship = !!data.shipNationwide;
    var fresh = data.category === 'Produce' || data.category === 'Protein' || data.id === 'jollof-rice' || data.id === 'agege-bread';
    return Object.assign(
      {
        localAvailable: true,
        shippable: ship || !fresh,
        temperatureClass: fresh && !ship ? 'PERISHABLE' : 'DRY',
      },
      data
    );
  }

  var PRODUCT_STORE_KEY = 'teedeux-products-v1';
  var PRODUCT_REV_KEY = 'teedeux-products-rev';
  var PRODUCTS_API = '/api/products';

  var BASE_PRODUCTS = [
    item({
      id: 'jollof-rice',
      name: 'Jollof Rice',
      size: '32 oz tray',
      category: 'Staples',
      priceCents: 899,
      unitPrice: '$0.28 /oz',
      imageUrl: '/img/products/jollof-rice.jpg',
      badge: 'New',
      description:
        'Party-style West African jollof rice simmered with tomatoes, peppers, and aromatic spices. Ready to heat and serve.',
      nutrition: n(210, '6g', '34g', '5g', '420mg'),
    }),
    item({
      id: 'ripe-plantains',
      name: 'Ripe Plantains',
      size: '3 ct',
      category: 'Produce',
      priceCents: 349,
      unitPrice: '$1.16 /ea',
      imageUrl: '/img/products/ripe-plantains.jpg',
      badge: 'Fresh',
      description: 'Sweet ripe plantains — perfect for frying into dodo or baking.',
      nutrition: n(180, '0.5g', '47g', '2g', '5mg'),
    }),
    item({
      id: 'pounded-yam-flour',
      name: 'Pounded Yam Flour',
      size: '2 lb bag',
      category: 'Staples',
      priceCents: 1299,
      unitPrice: '$0.41 /oz',
      imageUrl: '/img/products/pounded-yam-flour.jpg',
      description: 'Smooth pounded yam flour for classic Nigerian swallow. Ships nationwide.',
      nutrition: n(150, '0g', '36g', '1g', '0mg'),
      shipNationwide: true,
    }),
    item({
      id: 'egusi-seeds',
      name: 'Egusi Melon Seeds',
      size: '16 oz',
      category: 'Spices',
      priceCents: 999,
      unitPrice: '$0.62 /oz',
      imageUrl: '/img/products/egusi-seeds.jpg',
      description: 'Ground-ready egusi (melon) seeds for rich Nigerian and Ghanaian soups.',
      nutrition: n(160, '13g', '4g', '8g', '5mg'),
      shipNationwide: true,
    }),
    item({
      id: 'red-palm-oil',
      name: 'Red Palm Oil',
      size: '1 L bottle',
      category: 'Oils',
      priceCents: 1499,
      unitPrice: '$0.44 /fl oz',
      imageUrl: '/img/products/red-palm-oil.jpg',
      badge: 'Pantry staple',
      description: 'Unrefined red palm oil with deep color and authentic flavor for stews and soups.',
      nutrition: n(120, '14g', '0g', '0g', '0mg'),
      shipNationwide: true,
    }),
    item({
      id: 'stockfish',
      name: 'Stockfish',
      size: '8 oz pack',
      category: 'Protein',
      priceCents: 1899,
      unitPrice: '$2.37 /oz',
      imageUrl: '/img/products/stockfish.jpg',
      description: 'Premium dried stockfish — essential for Nigerian soups and stews.',
      nutrition: n(90, '1g', '0g', '20g', '180mg'),
      shipNationwide: true,
    }),
    item({
      id: 'suya-spice',
      name: 'Suya Spice Blend',
      size: '4 oz jar',
      category: 'Spices',
      priceCents: 699,
      unitPrice: '$1.75 /oz',
      imageUrl: '/img/products/suya-spice.jpg',
      badge: 'Popular',
      description: 'Smoky peanut-chili suya spice for grilling meat and roasted snacks.',
      nutrition: n(25, '1g', '3g', '1g', '210mg'),
      shipNationwide: true,
    }),
    item({
      id: 'scotch-bonnet',
      name: 'Scotch Bonnet Peppers',
      size: '8 oz',
      category: 'Produce',
      priceCents: 449,
      unitPrice: '$0.56 /oz',
      imageUrl: '/img/products/scotch-bonnet.jpg',
      description: 'Fresh hot scotch bonnet peppers for pepper sauces, stews, and marinades.',
      nutrition: n(20, '0g', '4g', '1g', '2mg'),
    }),
    item({
      id: 'gari-white',
      name: 'White Gari (Garri)',
      size: '2 lb bag',
      category: 'Staples',
      priceCents: 799,
      unitPrice: '$0.25 /oz',
      imageUrl: '/img/products/gari-white.jpg',
      description: 'Fine white cassava gari for eba, soaking, or light snacks.',
      nutrition: n(160, '0g', '38g', '1g', '5mg'),
      shipNationwide: true,
    }),
    item({
      id: 'black-eyed-peas',
      name: 'Black-Eyed Peas',
      size: '2 lb bag',
      category: 'Staples',
      priceCents: 599,
      unitPrice: '$0.19 /oz',
      imageUrl: '/img/products/black-eyed-peas.jpg',
      description: 'Dry black-eyed peas for beans porridge, akara, and moi moi.',
      nutrition: n(140, '0.5g', '25g', '9g', '10mg'),
      shipNationwide: true,
    }),
    item({
      id: 'fufu-flour',
      name: 'Fufu Flour',
      size: '1.5 lb',
      category: 'Staples',
      priceCents: 1099,
      unitPrice: '$0.46 /oz',
      imageUrl: '/img/products/fufu-flour.jpg',
      description: 'Plantain & cassava fufu flour — quick smooth swallow.',
      nutrition: n(140, '0g', '34g', '1g', '0mg'),
      shipNationwide: true,
    }),
    item({
      id: 'dried-crayfish',
      name: 'Dried Crayfish',
      size: '8 oz',
      category: 'Protein',
      priceCents: 1299,
      unitPrice: '$1.62 /oz',
      imageUrl: '/img/products/dried-crayfish.jpg',
      description: 'Sun-dried crayfish for authentic depth in soups and sauces.',
      nutrition: n(80, '1g', '0g', '17g', '320mg'),
      shipNationwide: true,
    }),
    item({
      id: 'plantain-chips',
      name: 'Plantain Chips',
      size: '6 oz bag',
      category: 'Snacks',
      priceCents: 399,
      unitPrice: '$0.67 /oz',
      imageUrl: '/img/products/plantain-chips.jpg',
      badge: 'Snack',
      description: 'Crispy lightly salted plantain chips — a West African classic.',
      nutrition: n(150, '7g', '20g', '1g', '90mg'),
      shipNationwide: true,
    }),
    item({
      id: 'ogbono-seeds',
      name: 'Ogbono Seeds',
      size: '8 oz',
      category: 'Spices',
      priceCents: 899,
      unitPrice: '$1.12 /oz',
      imageUrl: '/img/products/ogbono-seeds.jpg',
      description: 'Ground ogbono (bush mango) seeds for draw soups.',
      nutrition: n(130, '10g', '6g', '4g', '5mg'),
      shipNationwide: true,
    }),
    item({
      id: 'injera-mix',
      name: 'Injera Flour Mix',
      size: '2 lb',
      category: 'Staples',
      priceCents: 1199,
      unitPrice: '$0.37 /oz',
      imageUrl: '/img/products/injera-mix.jpg',
      description: 'Teff blend for soft Ethiopian injera at home.',
      nutrition: n(120, '1g', '24g', '4g', '5mg'),
      shipNationwide: true,
    }),
    item({
      id: 'berbere-spice',
      name: 'Berbere Spice',
      size: '4 oz',
      category: 'Spices',
      priceCents: 749,
      unitPrice: '$1.87 /oz',
      imageUrl: '/img/products/berbere-spice.jpg',
      description: 'Warm Ethiopian berbere chili blend for stews and roasted vegetables.',
      nutrition: n(15, '0.5g', '2g', '1g', '180mg'),
      shipNationwide: true,
    }),
    item({
      id: 'nyama-goat',
      name: 'Goat Meat (Nyama)',
      size: '2 lb pack',
      category: 'Protein',
      priceCents: 2499,
      unitPrice: '$0.78 /oz',
      imageUrl: '/img/products/nyama-goat.jpg',
      description: 'Fresh-cut goat meat for pepper soup, stews, and suya-style grilling.',
      nutrition: n(140, '3g', '0g', '27g', '70mg'),
    }),
    item({
      id: 'ugu-leaves',
      name: 'Ugu Leaves',
      size: '12 oz',
      category: 'Produce',
      priceCents: 549,
      unitPrice: '$0.46 /oz',
      imageUrl: '/img/products/ugu-leaves.jpg',
      description: 'Fluted pumpkin (ugu) leaves — leafy green for soups and stews.',
      nutrition: n(25, '0g', '4g', '2g', '15mg'),
    }),
    item({
      id: 'groundnut-paste',
      name: 'Groundnut Paste',
      size: '16 oz',
      category: 'Oils',
      priceCents: 799,
      unitPrice: '$0.50 /oz',
      imageUrl: '/img/products/groundnut-paste.jpg',
      description: 'Smooth roasted groundnut paste for peanut stew (maafe) and sauces.',
      nutrition: n(190, '16g', '6g', '8g', '5mg'),
      shipNationwide: true,
    }),
    item({
      id: 'jollof-spice',
      name: 'Jollof Spice Mix',
      size: '3 oz',
      category: 'Spices',
      priceCents: 599,
      unitPrice: '$2.00 /oz',
      imageUrl: '/img/products/jollof-spice.jpg',
      badge: 'New',
      description: 'Balanced jollof seasoning — paprika, thyme, curry, and bouillon notes.',
      nutrition: n(10, '0g', '2g', '0g', '240mg'),
      shipNationwide: true,
    }),
    item({
      id: 'agege-bread',
      name: 'Agege Bread',
      size: '1 loaf',
      category: 'Snacks',
      priceCents: 499,
      unitPrice: '$4.99 /ea',
      imageUrl: '/img/products/agege-bread.jpg',
      description: 'Soft Nigerian Agege-style bread — great with stew or tea.',
      nutrition: n(140, '2g', '26g', '4g', '220mg'),
    }),
    item({
      id: 'zobo-leaves',
      name: 'Zobo (Hibiscus) Leaves',
      size: '8 oz',
      category: 'Drinks',
      priceCents: 649,
      unitPrice: '$0.81 /oz',
      imageUrl: '/img/products/zobo-leaves.jpg',
      description: 'Dried hibiscus petals for zobo / sobolo drinks.',
      nutrition: n(5, '0g', '1g', '0g', '0mg'),
      shipNationwide: true,
    }),
    item({
      id: 'cassava-flour',
      name: 'Cassava Flour',
      size: '2 lb',
      category: 'Staples',
      priceCents: 899,
      unitPrice: '$0.28 /oz',
      imageUrl: '/img/products/cassava-flour.jpg',
      description: 'Fine cassava flour for baking, pap, and gluten-free cooking.',
      nutrition: n(130, '0g', '31g', '1g', '0mg'),
      shipNationwide: true,
    }),
    item({
      id: 'tomato-stew-base',
      name: 'Tomato Stew Base',
      size: '24 oz jar',
      category: 'Oils',
      priceCents: 799,
      unitPrice: '$0.33 /oz',
      imageUrl: '/img/products/tomato-stew-base.jpg',
      description: 'Concentrated African tomato-pepper stew base — start any jollof or stew.',
      nutrition: n(45, '2g', '6g', '1g', '290mg'),
      shipNationwide: true,
    }),
    item({
      id: 'pepper-soup-spice',
      name: 'Pepper Soup Spice',
      size: '3 oz',
      category: 'Spices',
      priceCents: 649,
      unitPrice: '$2.16 /oz',
      imageUrl: '/img/products/pepper-soup-spice.jpg',
      description: 'Aromatic pepper-soup spice mix with uda, uziza, and chili.',
      nutrition: n(10, '0g', '2g', '0g', '95mg'),
      shipNationwide: true,
    }),
    item({
      id: 'chin-chin',
      name: 'Chin Chin',
      size: '10 oz',
      category: 'Snacks',
      priceCents: 549,
      unitPrice: '$0.55 /oz',
      imageUrl: '/img/products/chin-chin.jpg',
      description: 'Crunchy fried chin chin snack — lightly sweet and addictive.',
      nutrition: n(160, '8g', '20g', '2g', '85mg'),
      shipNationwide: true,
    }),
    item({
      id: 'african-coffee',
      name: 'Ethiopian Coffee Beans',
      size: '12 oz',
      category: 'Drinks',
      priceCents: 1399,
      unitPrice: '$1.17 /oz',
      imageUrl: '/img/products/african-coffee.jpg',
      description: 'Single-origin Ethiopian coffee beans with floral citrus notes.',
      nutrition: n(2, '0g', '0g', '0g', '0mg'),
      shipNationwide: true,
    }),
    item({
      id: 'okro',
      name: 'Fresh Okro (Okra)',
      size: '1 lb',
      category: 'Produce',
      priceCents: 399,
      unitPrice: '$0.25 /oz',
      imageUrl: '/img/products/okro.jpg',
      description: 'Fresh okro for draw soups and stews.',
      nutrition: n(30, '0g', '7g', '2g', '5mg'),
    }),
    item({
      id: 'smoked-catfish',
      name: 'Smoked Catfish',
      size: '10 oz',
      category: 'Protein',
      priceCents: 1699,
      unitPrice: '$1.70 /oz',
      imageUrl: '/img/products/smoked-catfish.jpg',
      description: 'Whole smoked catfish for soups and pepper sauces.',
      nutrition: n(110, '3g', '0g', '20g', '410mg'),
      shipNationwide: true,
    }),
    item({
      id: 'attieke',
      name: 'Attiéké',
      size: '14 oz',
      category: 'Staples',
      priceCents: 749,
      unitPrice: '$0.54 /oz',
      imageUrl: '/img/products/attieke.jpg',
      description: 'Ivorian fermented cassava couscous (attiéké) — steam and serve.',
      nutrition: n(150, '0g', '36g', '1g', '10mg'),
      shipNationwide: true,
    }),
  ];

  var DEMO_ADDRESS = {
    id: 'addr_home',
    label: 'Home',
    line1: '1200 Peachtree St NE',
    city: 'Atlanta',
    state: 'GA',
    postalCode: '30309',
    country: 'US',
    isDefault: true,
  };

  var DEMO_PAYMENT = { id: 'pay_visa', brand: 'Visa', last4: '4242' };

  var PROMO = {
    title: 'African pantry week',
    subtitle: 'Save on palm oil, egusi & gari',
    cta: 'Shop savings',
    imageUrl: '/img/promo-banner.jpg',
  };

  function formatCents(cents) {
    var n = Number(cents) || 0;
    return '$' + (n / 100).toFixed(2);
  }

  function cloneProduct(p) {
    return JSON.parse(JSON.stringify(p));
  }

  var PRODUCTS = [];

  function seedProducts() {
    PRODUCTS.length = 0;
    BASE_PRODUCTS.forEach(function (p) {
      PRODUCTS.push(cloneProduct(p));
    });
  }

  function notifyCatalogChanged(reason) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(PRODUCT_REV_KEY, String(Date.now()));
      }
    } catch (e) {}
    try {
      if (typeof global.dispatchEvent === 'function') {
        global.dispatchEvent(
          new CustomEvent('teedeux-catalog-changed', {
            detail: { reason: reason || 'update', count: PRODUCTS.length },
          })
        );
      }
    } catch (e) {}
  }

  function rowToProduct(row) {
    return item({
      id: String(row.id),
      name: String(row.name),
      size: String(row.size || ''),
      category: String(row.category || 'Staples'),
      priceCents: Number(row.priceCents) || 0,
      compareAtCents: row.compareAtCents ? Number(row.compareAtCents) : undefined,
      unitPrice: row.unitPrice || '',
      imageUrl: String(row.imageUrl || '/img/products/jollof-rice.jpg'),
      badge: row.badge || undefined,
      description: String(row.description || ''),
      nutrition: row.nutrition || n(0, '0g', '0g', '0g', '0mg'),
      shipNationwide: !!row.shippable || !!row.shipNationwide,
    });
  }

  function applyProductRows(parsed) {
    if (!Array.isArray(parsed) || !parsed.length) return false;
    PRODUCTS.length = 0;
    parsed.forEach(function (row) {
      if (!row || !row.id || !row.name) return;
      PRODUCTS.push(rowToProduct(row));
    });
    return PRODUCTS.length > 0;
  }

  function persistProducts(reason) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(PRODUCT_STORE_KEY, JSON.stringify(PRODUCTS));
      }
    } catch (e) {}
    notifyCatalogChanged(reason || 'persist');
  }

  function loadLiveProducts() {
    seedProducts();
    try {
      if (typeof localStorage === 'undefined') return;
      var raw = localStorage.getItem(PRODUCT_STORE_KEY);
      if (!raw) return;
      var parsed = JSON.parse(raw);
      if (!applyProductRows(parsed)) seedProducts();
    } catch (e) {
      seedProducts();
    }
  }

  loadLiveProducts();

  function hydrateFromServer() {
    if (typeof fetch !== 'function') return Promise.resolve(false);
    return fetch(PRODUCTS_API + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        if (!data || !Array.isArray(data.products) || !data.products.length) return false;
        if (!applyProductRows(data.products)) return false;
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem(PRODUCT_STORE_KEY, JSON.stringify(PRODUCTS));
          }
        } catch (e) {}
        notifyCatalogChanged('server');
        return true;
      })
      .catch(function () {
        return false;
      });
  }

  function publishToServer(credentials) {
    var creds = credentials || {};
    persistProducts('local-save');
    if (typeof fetch !== 'function') {
      return Promise.resolve({ ok: true, localOnly: true });
    }
    return fetch(PRODUCTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: creds.email || creds.username,
        username: creds.username || creds.email,
        password: creds.password,
        action: 'save',
        products: PRODUCTS,
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { httpOk: res.ok, status: res.status, data: data };
        });
      })
      .then(function (out) {
        if (!out.httpOk || !out.data || !out.data.ok) {
          return {
            ok: false,
            localOnly: true,
            error: (out.data && out.data.error) || 'Could not publish to live catalog API',
          };
        }
        notifyCatalogChanged('published');
        return { ok: true, updatedAt: out.data.updatedAt, count: PRODUCTS.length };
      })
      .catch(function () {
        return {
          ok: false,
          localOnly: true,
          error: 'Live API unavailable — saved on this device only',
        };
      });
  }

  function resetOnServer(credentials) {
    var creds = credentials || {};
    if (typeof fetch !== 'function') return Promise.resolve({ ok: true, localOnly: true });
    return fetch(PRODUCTS_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: creds.email || creds.username,
        username: creds.username || creds.email,
        password: creds.password,
        action: 'reset',
      }),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          return { httpOk: res.ok, data: data };
        });
      })
      .then(function (out) {
        if (!out.httpOk || !out.data || !out.data.ok) {
          return { ok: false, error: (out.data && out.data.error) || 'Reset failed on server' };
        }
        return { ok: true };
      })
      .catch(function () {
        return { ok: false, error: 'Live API unavailable' };
      });
  }

  function slugify(name) {
    return String(name || 'product')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'product';
  }

  function upsertProduct(input) {
    var data = input || {};
    var id = String(data.id || '').trim() || slugify(data.name) + '-' + Date.now().toString(36).slice(-4);
    var existingIdx = -1;
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === id) {
        existingIdx = i;
        break;
      }
    }
    var prev = existingIdx >= 0 ? PRODUCTS[existingIdx] : null;
    var next = item({
      id: id,
      name: String(data.name || (prev && prev.name) || 'Untitled product').trim(),
      size: String(data.size != null ? data.size : (prev && prev.size) || ''),
      category: String(data.category || (prev && prev.category) || 'Staples'),
      priceCents: Number(data.priceCents != null ? data.priceCents : (prev && prev.priceCents) || 0),
      compareAtCents:
        data.compareAtCents != null
          ? Number(data.compareAtCents) || undefined
          : prev && prev.compareAtCents,
      unitPrice: data.unitPrice != null ? data.unitPrice : (prev && prev.unitPrice) || '',
      imageUrl: String(
        data.imageUrl || (prev && prev.imageUrl) || '/img/products/jollof-rice.jpg'
      ),
      badge: data.badge != null ? data.badge || undefined : prev && prev.badge,
      description: String(
        data.description != null ? data.description : (prev && prev.description) || ''
      ),
      nutrition: (data.nutrition || (prev && prev.nutrition) || n(0, '0g', '0g', '0g', '0mg')),
      shipNationwide: data.shipNationwide != null ? !!data.shipNationwide : !!(prev && prev.shippable),
    });
    if (existingIdx >= 0) PRODUCTS[existingIdx] = next;
    else PRODUCTS.unshift(next);
    persistProducts('upsert');
    return next;
  }

  function deleteProduct(id) {
    var before = PRODUCTS.length;
    var next = PRODUCTS.filter(function (p) {
      return p.id !== id;
    });
    if (next.length === before) return false;
    PRODUCTS.length = 0;
    next.forEach(function (p) {
      PRODUCTS.push(p);
    });
    persistProducts('delete');
    return true;
  }

  function resetProducts() {
    try {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(PRODUCT_STORE_KEY);
    } catch (e) {}
    seedProducts();
    notifyCatalogChanged('reset');
    return PRODUCTS.slice();
  }

  function exportProducts() {
    return JSON.stringify(PRODUCTS, null, 2);
  }

  function importProducts(json) {
    var parsed = typeof json === 'string' ? JSON.parse(json) : json;
    if (!Array.isArray(parsed) || !parsed.length) throw new Error('Invalid product list');
    if (!applyProductRows(parsed)) throw new Error('No valid products in import');
    persistProducts('import');
    return PRODUCTS.slice();
  }

  function getStore(id) {
    return SHOP;
  }

  function getProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }

  function getProductById(id) {
    return getProduct(id);
  }

  function productsForStore(storeId) {
    return PRODUCTS.slice();
  }

  function productsForAisle(aisleId) {
    if (!aisleId) return PRODUCTS.slice();
    return PRODUCTS.filter(function (p) {
      return p.category === aisleId;
    });
  }

  function relatedProducts(product, limit) {
    limit = limit || 6;
    return PRODUCTS.filter(function (p) {
      return p.id !== product.id && p.category === product.category;
    }).slice(0, limit);
  }

  Teedeux.catalog = {
    CATEGORIES: CATEGORIES,
    AISLES: AISLES,
    SHOP: SHOP,
    STORES: STORES,
    get PRODUCTS() {
      return PRODUCTS;
    },
    BASE_PRODUCTS: BASE_PRODUCTS,
    DEMO_ADDRESS: DEMO_ADDRESS,
    DEMO_PAYMENT: DEMO_PAYMENT,
    PROMO: PROMO,
    PRODUCT_STORE_KEY: PRODUCT_STORE_KEY,
    PRODUCTS_API: PRODUCTS_API,
    formatCents: formatCents,
    getStore: getStore,
    getProduct: getProduct,
    getProductById: getProductById,
    productsForStore: productsForStore,
    productsForAisle: productsForAisle,
    relatedProducts: relatedProducts,
    upsertProduct: upsertProduct,
    deleteProduct: deleteProduct,
    resetProducts: resetProducts,
    exportProducts: exportProducts,
    importProducts: importProducts,
    reloadProducts: loadLiveProducts,
    hydrateFromServer: hydrateFromServer,
    publishToServer: publishToServer,
    resetOnServer: resetOnServer,
  };
})(typeof window !== 'undefined' ? window : globalThis);
