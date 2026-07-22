/**
 * Teedeux HTML5 — seed catalog (African specialty groceries).
 * Dual fulfillment: local same-day delivery + nationwide dry shipping.
 * Attach as window.Teedeux.catalog (plain script globals; no modules).
 */
(function (global) {
  'use strict';

  var Teedeux = (global.Teedeux = global.Teedeux || {});

  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------

  var CATEGORIES = [
    {
      id: 'Spices',
      label: 'Spices',
      icon: 'Flame',
      description: 'Suya, berbere, curry blends & seasonings',
    },
    {
      id: 'Grains',
      label: 'Grains',
      icon: 'Wheat',
      description: 'Rice, teff, flours & swallow bases',
    },
    {
      id: 'Fresh Produce',
      label: 'Fresh Produce',
      icon: 'Leaf',
      description: 'Plantains, peppers, greens & tubers',
    },
    {
      id: 'Meat & Seafood',
      label: 'Meat & Seafood',
      icon: 'Fish',
      description: 'Goat, stockfish, crayfish & dried fish',
    },
    {
      id: 'Oils',
      label: 'Oils',
      icon: 'Droplets',
      description: 'Palm oil, palm cream & cooking oils',
    },
    {
      id: 'Frozen',
      label: 'Frozen',
      icon: 'Snowflake',
      description: 'Frozen leaves, meats & prepared items',
    },
    {
      id: 'Snacks',
      label: 'Snacks',
      icon: 'Cookie',
      description: 'Plantain chips, nuts & light bites',
    },
    {
      id: 'Pantry',
      label: 'Pantry',
      icon: 'Package',
      description: 'Shelf-stable staples & soup bases',
    },
  ];

  // ---------------------------------------------------------------------------
  // Stores (4 US markets)
  // ---------------------------------------------------------------------------

  var STORES = [
    {
      id: 'store_mama_jones',
      name: 'Mama Jones African Market',
      slug: 'mama-jones',
      description:
        "Atlanta's go-to West African market — fresh plantains, butcher counter, and pantry staples with same-day local delivery plus nationwide dry goods.",
      coverImageUrl:
        'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
      logoUrl:
        'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop',
      fulfillmentType: 'BOTH',
      localRadiusMiles: 12,
      regionFocus: ['WEST_AFRICAN', 'CENTRAL_AFRICAN'],
      rating: 4.8,
      address: {
        line1: '920 Memorial Dr SE',
        city: 'Atlanta',
        state: 'GA',
        postalCode: '30316',
      },
      estimatedDeliveryMins: 45,
    },
    {
      id: 'store_lagos_pantry',
      name: 'Lagos Pantry Houston',
      slug: 'lagos-pantry-houston',
      description:
        'Houston hub for Nigerian and Ghanaian favorites — egusi, stockfish, palm oil, and fresh produce for local delivery or ship-ready dry goods.',
      coverImageUrl:
        'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=400&fit=crop',
      logoUrl:
        'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&h=200&fit=crop',
      fulfillmentType: 'BOTH',
      localRadiusMiles: 15,
      regionFocus: ['WEST_AFRICAN'],
      rating: 4.7,
      address: {
        line1: '5820 Bellaire Blvd',
        city: 'Houston',
        state: 'TX',
        postalCode: '77081',
      },
      estimatedDeliveryMins: 55,
    },
    {
      id: 'store_nile_spice',
      name: 'Nile Spice Depot',
      slug: 'nile-spice',
      description:
        'Dallas East African specialty depot — teff, berbere, injera flour, and spices. Ships nationwide only.',
      coverImageUrl:
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop',
      logoUrl:
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop',
      fulfillmentType: 'SHIPPING_ONLY',
      localRadiusMiles: 0,
      regionFocus: ['EAST_AFRICAN'],
      rating: 4.9,
      address: {
        line1: '4100 Belt Line Rd',
        city: 'Dallas',
        state: 'TX',
        postalCode: '75244',
      },
      estimatedDeliveryMins: null,
    },
    {
      id: 'store_harlem_baobab',
      name: 'Harlem Baobab',
      slug: 'harlem-baobab',
      description:
        'NYC neighborhood market spanning West, Central, and Caribbean aisles — fresh greens, frozen cassava leaves, and shippable pantry picks.',
      coverImageUrl:
        'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&h=400&fit=crop',
      logoUrl:
        'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=200&h=200&fit=crop',
      fulfillmentType: 'BOTH',
      localRadiusMiles: 8,
      regionFocus: ['WEST_AFRICAN', 'CENTRAL_AFRICAN', 'CARIBBEAN'],
      rating: 4.6,
      address: {
        line1: '245 W 125th St',
        city: 'New York',
        state: 'NY',
        postalCode: '10027',
      },
      estimatedDeliveryMins: 40,
    },
  ];

  // ---------------------------------------------------------------------------
  // Products (24+)
  // ---------------------------------------------------------------------------

  var PRODUCTS = [
    // —— Mama Jones (Atlanta) ——
    {
      id: 'prod_plantain',
      storeId: 'store_mama_jones',
      storeName: 'Mama Jones African Market',
      name: 'Ripe Plantains',
      description: 'Sweet yellow plantains, perfect for frying or boiling.',
      priceCents: 149,
      unit: 'LB',
      region: 'WEST_AFRICAN',
      temperatureClass: 'FRESH',
      category: 'Fresh Produce',
      weightOz: 16,
      shippable: false,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&h=600&fit=crop',
      tags: ['produce', 'plantain', 'fresh', 'sweet'],
      stockQty: 48,
    },
    {
      id: 'prod_scotch',
      storeId: 'store_mama_jones',
      storeName: 'Mama Jones African Market',
      name: 'Scotch Bonnet Peppers',
      description: 'Fiery fresh peppers for pepper soup, stews, and sauces.',
      priceCents: 399,
      unit: 'OZ',
      region: 'WEST_AFRICAN',
      temperatureClass: 'FRESH',
      category: 'Fresh Produce',
      weightOz: 8,
      shippable: false,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=600&h=600&fit=crop',
      tags: ['pepper', 'spicy', 'fresh', 'soup'],
      stockQty: 32,
    },
    {
      id: 'prod_goat',
      storeId: 'store_mama_jones',
      storeName: 'Mama Jones African Market',
      name: 'Fresh Goat Meat',
      description: 'Halal-cut goat, sold by the pound — ideal for pepper soup.',
      priceCents: 899,
      unit: 'LB',
      region: 'WEST_AFRICAN',
      temperatureClass: 'FRESH',
      category: 'Meat & Seafood',
      weightOz: 16,
      shippable: false,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&h=600&fit=crop',
      tags: ['meat', 'protein', 'halal', 'goat'],
      stockQty: 22,
    },
    {
      id: 'prod_palm_oil',
      storeId: 'store_mama_jones',
      storeName: 'Mama Jones African Market',
      name: 'Red Palm Oil',
      description: 'Unrefined red palm oil, 1L bottle — rich color and aroma.',
      priceCents: 1099,
      unit: 'EACH',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Oils',
      weightOz: 35,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop',
      tags: ['oil', 'cooking', 'palm', 'soup'],
      stockQty: 64,
    },
    {
      id: 'prod_bitter_leaf',
      storeId: 'store_mama_jones',
      storeName: 'Mama Jones African Market',
      name: 'Fresh Bitter Leaf',
      description: 'Washed bitter leaf for egusi and ofe onugbu soups.',
      priceCents: 449,
      unit: 'BUNCH',
      region: 'WEST_AFRICAN',
      temperatureClass: 'FRESH',
      category: 'Fresh Produce',
      weightOz: 8,
      shippable: false,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop',
      tags: ['greens', 'soup', 'bitter-leaf'],
      stockQty: 18,
    },
    {
      id: 'prod_suya_spice',
      storeId: 'store_mama_jones',
      storeName: 'Mama Jones African Market',
      name: 'Suya Spice (Yaji)',
      description: 'Smoky peanut-chili rub for authentic Nigerian suya.',
      priceCents: 649,
      unit: 'OZ',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Spices',
      weightOz: 8,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop',
      tags: ['spice', 'suya', 'yaji', 'grill'],
      stockQty: 90,
    },
    {
      id: 'prod_garri',
      storeId: 'store_mama_jones',
      storeName: 'Mama Jones African Market',
      name: 'Ijebu Garri (White)',
      description: 'Fine fermented cassava granules for eba or soaking.',
      priceCents: 799,
      unit: 'PACK',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Grains',
      weightOz: 32,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
      tags: ['garri', 'swallow', 'cassava', 'eba'],
      stockQty: 75,
    },

    // —— Lagos Pantry (Houston) ——
    {
      id: 'prod_egusi',
      storeId: 'store_lagos_pantry',
      storeName: 'Lagos Pantry Houston',
      name: 'Egusi (Melon Seeds)',
      description: 'Ground melon seeds for classic egusi soup.',
      priceCents: 799,
      unit: 'OZ',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Pantry',
      weightOz: 16,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=600&h=600&fit=crop',
      tags: ['egusi', 'seeds', 'soup'],
      stockQty: 120,
    },
    {
      id: 'prod_stockfish',
      storeId: 'store_lagos_pantry',
      storeName: 'Lagos Pantry Houston',
      name: 'Dried Stockfish',
      description: 'Premium dried stockfish — ships dry nationwide.',
      priceCents: 1899,
      unit: 'PACK',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Meat & Seafood',
      weightOz: 24,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=600&fit=crop',
      tags: ['fish', 'dried', 'stockfish', 'soup'],
      stockQty: 42,
    },
    {
      id: 'prod_yam_flour',
      storeId: 'store_lagos_pantry',
      storeName: 'Lagos Pantry Houston',
      name: 'Yam Flour (Elubo)',
      description: 'Fine yam flour for amala — smooth and earthy.',
      priceCents: 1299,
      unit: 'PACK',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Grains',
      weightOz: 32,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop',
      tags: ['flour', 'yam', 'amala', 'swallow'],
      stockQty: 80,
    },
    {
      id: 'prod_ogbono',
      storeId: 'store_lagos_pantry',
      storeName: 'Lagos Pantry Houston',
      name: 'Ogbono Seeds (Ground)',
      description: 'Ground wild mango seeds for draw soup.',
      priceCents: 899,
      unit: 'OZ',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Pantry',
      weightOz: 12,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=600&h=600&fit=crop',
      tags: ['ogbono', 'soup', 'seeds'],
      stockQty: 70,
    },
    {
      id: 'prod_crayfish',
      storeId: 'store_lagos_pantry',
      storeName: 'Lagos Pantry Houston',
      name: 'Ground Crayfish',
      description: 'Sun-dried ground crayfish — essential soup seasoning.',
      priceCents: 749,
      unit: 'OZ',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Meat & Seafood',
      weightOz: 8,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&h=600&fit=crop',
      tags: ['crayfish', 'seasoning', 'soup', 'dried'],
      stockQty: 95,
    },
    {
      id: 'prod_jollof_mix',
      storeId: 'store_lagos_pantry',
      storeName: 'Lagos Pantry Houston',
      name: 'Jollof Rice Spice Mix',
      description: 'Party jollof blend — tomato base spices ready to cook.',
      priceCents: 549,
      unit: 'PACK',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Spices',
      weightOz: 6,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
      tags: ['jollof', 'rice', 'spice', 'party'],
      stockQty: 110,
    },
    {
      id: 'prod_palm_cream',
      storeId: 'store_lagos_pantry',
      storeName: 'Lagos Pantry Houston',
      name: 'Palm Cream (Concentrate)',
      description: 'Concentrated palm fruit cream for banga and stew.',
      priceCents: 699,
      unit: 'EACH',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Oils',
      weightOz: 14,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&h=600&fit=crop',
      tags: ['palm', 'cream', 'banga', 'stew'],
      stockQty: 88,
    },
    {
      id: 'prod_plantain_chips',
      storeId: 'store_lagos_pantry',
      storeName: 'Lagos Pantry Houston',
      name: 'Plantain Chips (Salted)',
      description: 'Crispy golden plantain chips — lightly salted.',
      priceCents: 399,
      unit: 'PACK',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Snacks',
      weightOz: 5,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=600&fit=crop',
      tags: ['chips', 'plantain', 'snack'],
      stockQty: 140,
    },

    // —— Nile Spice (Dallas, shipping only) ——
    {
      id: 'prod_berbere',
      storeId: 'store_nile_spice',
      storeName: 'Nile Spice Depot',
      name: 'Berbere Spice Blend',
      description: 'Authentic Ethiopian berbere — chili, fenugreek, and aromatics.',
      priceCents: 899,
      unit: 'OZ',
      region: 'EAST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Spices',
      weightOz: 8,
      shippable: true,
      localAvailable: false,
      imageUrl:
        'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop',
      tags: ['berbere', 'ethiopian', 'spice'],
      stockQty: 100,
    },
    {
      id: 'prod_teff',
      storeId: 'store_nile_spice',
      storeName: 'Nile Spice Depot',
      name: 'Ivory Teff Grain',
      description: 'Whole ivory teff — gluten-free ancient grain staple.',
      priceCents: 1499,
      unit: 'PACK',
      region: 'EAST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Grains',
      weightOz: 32,
      shippable: true,
      localAvailable: false,
      imageUrl:
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
      tags: ['teff', 'grain', 'gluten-free', 'ethiopian'],
      stockQty: 65,
    },
    {
      id: 'prod_injera_flour',
      storeId: 'store_nile_spice',
      storeName: 'Nile Spice Depot',
      name: 'Injera Flour Mix',
      description: 'Ready teff flour blend for homemade injera.',
      priceCents: 1299,
      unit: 'PACK',
      region: 'EAST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Grains',
      weightOz: 28,
      shippable: true,
      localAvailable: false,
      imageUrl:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop',
      tags: ['injera', 'teff', 'flour', 'ethiopian'],
      stockQty: 72,
    },
    {
      id: 'prod_mitmita',
      storeId: 'store_nile_spice',
      storeName: 'Nile Spice Depot',
      name: 'Mitmita Hot Spice',
      description: 'Fiery Ethiopian chili blend for kitfo and finishing.',
      priceCents: 699,
      unit: 'OZ',
      region: 'EAST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Spices',
      weightOz: 4,
      shippable: true,
      localAvailable: false,
      imageUrl:
        'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=600&fit=crop',
      tags: ['mitmita', 'spicy', 'ethiopian'],
      stockQty: 85,
    },
    {
      id: 'prod_shiro',
      storeId: 'store_nile_spice',
      storeName: 'Nile Spice Depot',
      name: 'Shiro Powder',
      description: 'Chickpea flour stew base for classic shiro wat.',
      priceCents: 999,
      unit: 'PACK',
      region: 'EAST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Pantry',
      weightOz: 16,
      shippable: true,
      localAvailable: false,
      imageUrl:
        'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=600&h=600&fit=crop',
      tags: ['shiro', 'chickpea', 'stew', 'ethiopian'],
      stockQty: 60,
    },

    // —— Harlem Baobab (NYC) ——
    {
      id: 'prod_cassava_leaves',
      storeId: 'store_harlem_baobab',
      storeName: 'Harlem Baobab',
      name: 'Frozen Cassava Leaves',
      description: 'Pound-ready cassava leaves for palaver sauce and stews.',
      priceCents: 699,
      unit: 'PACK',
      region: 'CENTRAL_AFRICAN',
      temperatureClass: 'FROZEN',
      category: 'Frozen',
      weightOz: 16,
      shippable: false,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop',
      tags: ['cassava', 'leaves', 'frozen', 'palaver'],
      stockQty: 40,
    },
    {
      id: 'prod_green_plantain',
      storeId: 'store_harlem_baobab',
      storeName: 'Harlem Baobab',
      name: 'Green Plantains',
      description: 'Firm green plantains for tostones, chips, or porridge.',
      priceCents: 129,
      unit: 'LB',
      region: 'WEST_AFRICAN',
      temperatureClass: 'FRESH',
      category: 'Fresh Produce',
      weightOz: 16,
      shippable: false,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&h=600&fit=crop',
      tags: ['plantain', 'green', 'fresh', 'produce'],
      stockQty: 55,
    },
    {
      id: 'prod_smoked_turkey',
      storeId: 'store_harlem_baobab',
      storeName: 'Harlem Baobab',
      name: 'Smoked Turkey Wings',
      description: 'Deeply smoked turkey wings for soups and stews.',
      priceCents: 749,
      unit: 'LB',
      region: 'WEST_AFRICAN',
      temperatureClass: 'FROZEN',
      category: 'Frozen',
      weightOz: 16,
      shippable: false,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=600&fit=crop',
      tags: ['turkey', 'smoked', 'soup', 'protein'],
      stockQty: 28,
    },
    {
      id: 'prod_atta_rice',
      storeId: 'store_harlem_baobab',
      storeName: 'Harlem Baobab',
      name: 'Long-Grain Parboiled Rice',
      description: 'Premium long-grain rice — the party jollof standard.',
      priceCents: 1199,
      unit: 'PACK',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Grains',
      weightOz: 80,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
      tags: ['rice', 'jollof', 'parboiled'],
      stockQty: 95,
    },
    {
      id: 'prod_uziza',
      storeId: 'store_harlem_baobab',
      storeName: 'Harlem Baobab',
      name: 'Dried Uziza Leaves',
      description: 'Peppery aromatic leaves for pepper soup and nkwobi.',
      priceCents: 549,
      unit: 'OZ',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Spices',
      weightOz: 2,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop',
      tags: ['uziza', 'leaves', 'pepper-soup', 'spice'],
      stockQty: 48,
    },
    {
      id: 'prod_groundnut_oil',
      storeId: 'store_harlem_baobab',
      storeName: 'Harlem Baobab',
      name: 'Groundnut Oil',
      description: 'Pure peanut oil for frying and high-heat cooking.',
      priceCents: 899,
      unit: 'EACH',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Oils',
      weightOz: 32,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop',
      tags: ['oil', 'groundnut', 'peanut', 'frying'],
      stockQty: 58,
    },
    {
      id: 'prod_chin_chin',
      storeId: 'store_harlem_baobab',
      storeName: 'Harlem Baobab',
      name: 'Chin Chin',
      description: 'Crunchy fried dough snack — lightly sweet.',
      priceCents: 499,
      unit: 'PACK',
      region: 'WEST_AFRICAN',
      temperatureClass: 'DRY',
      category: 'Snacks',
      weightOz: 8,
      shippable: true,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop',
      tags: ['chin-chin', 'snack', 'sweet'],
      stockQty: 75,
    },
    {
      id: 'prod_frozen_okro',
      storeId: 'store_harlem_baobab',
      storeName: 'Harlem Baobab',
      name: 'Frozen Cut Okra',
      description: 'Pre-cut frozen okra for draw soup and stews.',
      priceCents: 449,
      unit: 'PACK',
      region: 'WEST_AFRICAN',
      temperatureClass: 'FROZEN',
      category: 'Frozen',
      weightOz: 16,
      shippable: false,
      localAvailable: true,
      imageUrl:
        'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=600&h=600&fit=crop',
      tags: ['okra', 'okro', 'frozen', 'soup'],
      stockQty: 50,
    },
  ];

  // ---------------------------------------------------------------------------
  // Recipe bundles
  // ---------------------------------------------------------------------------

  var BUNDLES = [
    {
      id: 'bundle_egusi_soup',
      name: 'Egusi Soup',
      slug: 'egusi-soup',
      description:
        'Classic West African melon-seed soup with palm oil, stockfish, and bitter leaf.',
      region: 'WEST_AFRICAN',
      imageUrl:
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=500&fit=crop',
      servings: 6,
      prepMinutes: 75,
      productIds: [
        'prod_egusi',
        'prod_palm_oil',
        'prod_stockfish',
        'prod_bitter_leaf',
        'prod_scotch',
        'prod_crayfish',
      ],
      tags: ['soup', 'west-african', 'egusi'],
    },
    {
      id: 'bundle_jollof',
      name: 'Jollof Rice',
      slug: 'jollof-rice',
      description:
        'Party jollof essentials — long-grain rice, spice mix, and scotch bonnets.',
      region: 'WEST_AFRICAN',
      imageUrl:
        'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&h=500&fit=crop',
      servings: 8,
      prepMinutes: 60,
      productIds: [
        'prod_atta_rice',
        'prod_jollof_mix',
        'prod_scotch',
        'prod_palm_oil',
        'prod_plantain',
      ],
      tags: ['rice', 'party', 'jollof'],
    },
    {
      id: 'bundle_pepper_soup',
      name: 'Pepper Soup',
      slug: 'pepper-soup',
      description:
        'Spicy broth with goat, uziza, scotch bonnets, and aromatic stock.',
      region: 'WEST_AFRICAN',
      imageUrl:
        'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=500&fit=crop',
      servings: 4,
      prepMinutes: 90,
      productIds: [
        'prod_goat',
        'prod_scotch',
        'prod_uziza',
        'prod_crayfish',
        'prod_smoked_turkey',
      ],
      tags: ['soup', 'spicy', 'pepper-soup'],
    },
  ];

  // ---------------------------------------------------------------------------
  // Demo address & payment
  // ---------------------------------------------------------------------------

  var DEMO_ADDRESS = {
    id: 'addr_ada_home',
    label: 'Home',
    line1: '1842 Peachtree Rd NE',
    line2: 'Apt 4B',
    city: 'Atlanta',
    state: 'GA',
    postalCode: '30309',
    country: 'US',
    isDefault: true,
  };

  var DEMO_PAYMENT = {
    id: 'pm_visa_4242',
    type: 'CARD',
    label: 'Visa ending in 4242',
    brand: 'visa',
    last4: '4242',
    expiryMonth: 8,
    expiryYear: 2028,
    isDefault: true,
  };

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function getStoreById(storeId) {
    for (var i = 0; i < STORES.length; i++) {
      if (STORES[i].id === storeId) return STORES[i];
    }
    return undefined;
  }

  function getProductsByStore(storeId) {
    return PRODUCTS.filter(function (p) {
      return p.storeId === storeId;
    });
  }

  function getProductById(productId) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].id === productId) return PRODUCTS[i];
    }
    return undefined;
  }

  function searchProducts(query) {
    var q = String(query || '')
      .trim()
      .toLowerCase();
    if (!q) return PRODUCTS.slice();
    return PRODUCTS.filter(function (p) {
      var haystack = [p.name, p.description, p.storeName, p.category, p.region]
        .concat(p.tags || [])
        .join(' ')
        .toLowerCase();
      return haystack.indexOf(q) !== -1;
    });
  }

  function getBundleProducts(bundleId) {
    var bundle = null;
    for (var i = 0; i < BUNDLES.length; i++) {
      if (BUNDLES[i].id === bundleId) {
        bundle = BUNDLES[i];
        break;
      }
    }
    if (!bundle) return [];
    return bundle.productIds
      .map(function (id) {
        return getProductById(id);
      })
      .filter(function (p) {
        return p != null;
      });
  }

  function formatCents(cents) {
    var n = Number(cents);
    if (!isFinite(n)) n = 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(n / 100);
  }

  /**
   * Suggest fulfillment channel from product availability flags.
   * @returns {'LOCAL_DELIVERY'|'NATIONWIDE_SHIPPING'}
   */
  function defaultFulfillment(product) {
    if (!product) return 'LOCAL_DELIVERY';
    if (product.localAvailable && !product.shippable) return 'LOCAL_DELIVERY';
    if (product.shippable && !product.localAvailable) return 'NATIONWIDE_SHIPPING';
    return product.temperatureClass === 'DRY'
      ? 'NATIONWIDE_SHIPPING'
      : 'LOCAL_DELIVERY';
  }

  Teedeux.catalog = {
    STORES: STORES,
    PRODUCTS: PRODUCTS,
    CATEGORIES: CATEGORIES,
    BUNDLES: BUNDLES,
    DEMO_ADDRESS: DEMO_ADDRESS,
    DEMO_PAYMENT: DEMO_PAYMENT,
    getStoreById: getStoreById,
    getProductsByStore: getProductsByStore,
    searchProducts: searchProducts,
    getProductById: getProductById,
    getBundleProducts: getBundleProducts,
    formatCents: formatCents,
    defaultFulfillment: defaultFulfillment,
  };
})(typeof window !== 'undefined' ? window : this);
