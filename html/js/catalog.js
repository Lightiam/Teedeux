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

  var STORES = [
    {
      id: 'store_mama_jones',
      name: 'Mama Jones African Market',
      shortName: 'Mama Jones',
      logoUrl: '/img/stores/mama-jones.jpg',
      lastVisited: 'Last visited today',
      estimatedDeliveryMins: 45,
      estimatedPickupMins: 20,
      address: { line1: '920 Memorial Dr SE', city: 'Atlanta', state: 'GA', postalCode: '30316' },
      fulfillment: ['Delivery', 'Pickup'],
    },
    {
      id: 'store_lagos_pantry',
      name: 'Lagos Pantry',
      shortName: 'Lagos Pantry',
      logoUrl: '/img/stores/lagos-pantry.jpg',
      lastVisited: 'Last visited yesterday',
      estimatedDeliveryMins: 55,
      estimatedPickupMins: 25,
      address: { line1: '6100 Richmond Ave', city: 'Houston', state: 'TX', postalCode: '77057' },
      fulfillment: ['Delivery', 'Pickup'],
    },
    {
      id: 'store_habesha',
      name: 'Habesha Spices & Market',
      shortName: 'Habesha',
      logoUrl: '/img/stores/habesha.jpg',
      lastVisited: 'Last visited 3 days ago',
      estimatedDeliveryMins: 60,
      estimatedPickupMins: 30,
      address: { line1: '1800 Columbia Pike', city: 'Arlington', state: 'VA', postalCode: '22204' },
      fulfillment: ['Delivery', 'Pickup'],
    },
    {
      id: 'store_accra',
      name: 'Accra Market NYC',
      shortName: 'Accra Market',
      logoUrl: '/img/stores/accra-market.jpg',
      lastVisited: 'Last visited last week',
      estimatedDeliveryMins: 50,
      estimatedPickupMins: 22,
      address: { line1: '125th St', city: 'New York', state: 'NY', postalCode: '10027' },
      fulfillment: ['Delivery', 'Pickup'],
    },
  ];

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

  var PRODUCTS = [
    item({
      id: 'jollof-rice',
      name: 'Jollof Rice',
      size: '32 oz tray',
      category: 'Staples',
      priceCents: 899,
      unitPrice: '$0.28 /oz',
      imageUrl: '/img/products/jollof-rice.jpg',
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_habesha', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_habesha', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry'],
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
      storeIds: ['store_habesha'],
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
      storeIds: ['store_habesha', 'store_mama_jones'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry'],
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
      storeIds: ['store_mama_jones', 'store_accra', 'store_habesha'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry', 'store_accra'],
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
      storeIds: ['store_habesha'],
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
      storeIds: ['store_mama_jones', 'store_accra'],
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
      storeIds: ['store_mama_jones', 'store_lagos_pantry'],
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
      storeIds: ['store_accra', 'store_mama_jones'],
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

  function getStore(id) {
    for (var i = 0; i < STORES.length; i++) if (STORES[i].id === id) return STORES[i];
    return STORES[0];
  }

  function getProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }

  function getProductById(id) {
    return getProduct(id);
  }

  function productsForStore(storeId) {
    return PRODUCTS.filter(function (p) {
      return !storeId || (p.storeIds && p.storeIds.indexOf(storeId) !== -1);
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
    STORES: STORES,
    PRODUCTS: PRODUCTS,
    DEMO_ADDRESS: DEMO_ADDRESS,
    DEMO_PAYMENT: DEMO_PAYMENT,
    PROMO: PROMO,
    formatCents: formatCents,
    getStore: getStore,
    getProduct: getProduct,
    getProductById: getProductById,
    productsForStore: productsForStore,
    relatedProducts: relatedProducts,
  };
})(typeof window !== 'undefined' ? window : globalThis);
