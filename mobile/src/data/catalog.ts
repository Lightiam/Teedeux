import type {
  Address,
  CategoryMeta,
  PaymentMethod,
  Product,
  ProductCategory,
  RecipeBundle,
  Store,
  User,
} from '../types';

/**
 * Teedeux production seed catalog — African specialty groceries
 * Dual fulfillment: local same-day delivery + nationwide dry shipping.
 */

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const CATEGORIES: CategoryMeta[] = [
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

export const STORES: Store[] = [
  {
    id: 'store_mama_jones',
    name: 'Mama Jones African Market',
    slug: 'mama-jones',
    description:
      'Atlanta’s go-to West African market — fresh plantains, butcher counter, and pantry staples with same-day local delivery plus nationwide dry goods.',
    logoUrl:
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop',
    coverImageUrl:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=400&fit=crop',
    fulfillmentType: 'BOTH',
    localRadiusMiles: 12,
    regionFocus: ['WEST_AFRICAN', 'CENTRAL_AFRICAN'],
    rating: 4.8,
    reviewCount: 842,
    estimatedDeliveryMins: 45,
    address: {
      id: 'addr_store_mj',
      line1: '920 Memorial Dr SE',
      city: 'Atlanta',
      state: 'GA',
      postalCode: '30316',
      country: 'US',
      latitude: 33.746,
      longitude: -84.348,
    },
  },
  {
    id: 'store_lagos_pantry',
    name: 'Lagos Pantry Houston',
    slug: 'lagos-pantry-houston',
    description:
      'Houston hub for Nigerian and Ghanaian favorites — egusi, stockfish, palm oil, and fresh produce for local delivery or ship-ready dry goods.',
    logoUrl:
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&h=200&fit=crop',
    coverImageUrl:
      'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800&h=400&fit=crop',
    fulfillmentType: 'BOTH',
    localRadiusMiles: 15,
    regionFocus: ['WEST_AFRICAN'],
    rating: 4.7,
    reviewCount: 512,
    estimatedDeliveryMins: 55,
    address: {
      id: 'addr_store_lph',
      line1: '5820 Bellaire Blvd',
      city: 'Houston',
      state: 'TX',
      postalCode: '77081',
      country: 'US',
      latitude: 29.705,
      longitude: -95.482,
    },
  },
  {
    id: 'store_nile_spice',
    name: 'Nile Spice Depot',
    slug: 'nile-spice',
    description:
      'Dallas East African specialty depot — teff, berbere, injera flour, and spices. Ships nationwide only.',
    logoUrl:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&h=200&fit=crop',
    coverImageUrl:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop',
    fulfillmentType: 'SHIPPING_ONLY',
    localRadiusMiles: 0,
    regionFocus: ['EAST_AFRICAN'],
    rating: 4.9,
    reviewCount: 328,
    address: {
      id: 'addr_store_ns',
      line1: '4100 Belt Line Rd',
      city: 'Dallas',
      state: 'TX',
      postalCode: '75244',
      country: 'US',
      latitude: 32.924,
      longitude: -96.84,
    },
  },
  {
    id: 'store_harlem_harvest',
    name: 'Harlem Harvest African Grocer',
    slug: 'harlem-harvest',
    description:
      'NYC neighborhood market spanning West, Central, and Caribbean aisles — fresh greens, frozen cassava leaves, and shippable pantry picks.',
    logoUrl:
      'https://images.unsplash.com/photo-1534723452862-4c874018d66d?w=200&h=200&fit=crop',
    coverImageUrl:
      'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&h=400&fit=crop',
    fulfillmentType: 'BOTH',
    localRadiusMiles: 8,
    regionFocus: ['WEST_AFRICAN', 'CENTRAL_AFRICAN', 'CARIBBEAN'],
    rating: 4.6,
    reviewCount: 691,
    estimatedDeliveryMins: 40,
    address: {
      id: 'addr_store_hh',
      line1: '245 W 125th St',
      city: 'New York',
      state: 'NY',
      postalCode: '10027',
      country: 'US',
      latitude: 40.809,
      longitude: -73.95,
    },
  },
];

// ---------------------------------------------------------------------------
// Products (30+)
// ---------------------------------------------------------------------------

export const PRODUCTS: Product[] = [
  // —— Mama Jones (Atlanta) ——
  {
    id: 'prod_plantain',
    storeId: 'store_mama_jones',
    storeName: 'Mama Jones African Market',
    name: 'Ripe Plantains',
    slug: 'ripe-plantains',
    description: 'Sweet yellow plantains, perfect for frying or boiling.',
    imageUrl:
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'FRESH',
    unit: 'LB',
    priceCents: 149,
    weightOz: 16,
    stockQty: 48,
    isWeighted: true,
    shippable: false,
    localAvailable: true,
    category: 'Fresh Produce',
    tags: ['produce', 'plantain', 'fresh', 'sweet'],
  },
  {
    id: 'prod_scotch',
    storeId: 'store_mama_jones',
    storeName: 'Mama Jones African Market',
    name: 'Scotch Bonnet Peppers',
    slug: 'scotch-bonnet',
    description: 'Fiery fresh peppers for pepper soup, stews, and sauces.',
    imageUrl:
      'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'FRESH',
    unit: 'OZ',
    priceCents: 399,
    weightOz: 8,
    stockQty: 32,
    isWeighted: true,
    shippable: false,
    localAvailable: true,
    category: 'Fresh Produce',
    tags: ['pepper', 'spicy', 'fresh', 'soup'],
  },
  {
    id: 'prod_goat',
    storeId: 'store_mama_jones',
    storeName: 'Mama Jones African Market',
    name: 'Fresh Goat Meat',
    slug: 'fresh-goat',
    description: 'Halal-cut goat, sold by the pound — ideal for pepper soup.',
    imageUrl:
      'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'FRESH',
    unit: 'LB',
    priceCents: 899,
    weightOz: 16,
    stockQty: 22,
    isWeighted: true,
    shippable: false,
    localAvailable: true,
    category: 'Meat & Seafood',
    tags: ['meat', 'protein', 'halal', 'goat'],
  },
  {
    id: 'prod_palm_oil',
    storeId: 'store_mama_jones',
    storeName: 'Mama Jones African Market',
    name: 'Red Palm Oil',
    slug: 'palm-oil',
    description: 'Unrefined red palm oil, 1L bottle — rich color and aroma.',
    imageUrl:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'EACH',
    priceCents: 1099,
    weightOz: 35,
    stockQty: 64,
    shippable: true,
    localAvailable: true,
    category: 'Oils',
    tags: ['oil', 'cooking', 'palm', 'soup'],
  },
  {
    id: 'prod_bitter_leaf',
    storeId: 'store_mama_jones',
    storeName: 'Mama Jones African Market',
    name: 'Fresh Bitter Leaf',
    slug: 'bitter-leaf',
    description: 'Washed bitter leaf for egusi and ofe onugbu soups.',
    imageUrl:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'FRESH',
    unit: 'BUNCH',
    priceCents: 449,
    weightOz: 8,
    stockQty: 18,
    shippable: false,
    localAvailable: true,
    category: 'Fresh Produce',
    tags: ['greens', 'soup', 'bitter-leaf'],
  },
  {
    id: 'prod_suya_spice',
    storeId: 'store_mama_jones',
    storeName: 'Mama Jones African Market',
    name: 'Suya Spice (Yaji)',
    slug: 'suya-spice',
    description: 'Smoky peanut-chili rub for authentic Nigerian suya.',
    imageUrl:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'OZ',
    priceCents: 649,
    weightOz: 8,
    stockQty: 90,
    shippable: true,
    localAvailable: true,
    category: 'Spices',
    tags: ['spice', 'suya', 'yaji', 'grill'],
  },
  {
    id: 'prod_garri',
    storeId: 'store_mama_jones',
    storeName: 'Mama Jones African Market',
    name: 'Ijebu Garri (White)',
    slug: 'ijebu-garri',
    description: 'Fine fermented cassava granules for eba or soaking.',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 799,
    weightOz: 32,
    stockQty: 75,
    shippable: true,
    localAvailable: true,
    category: 'Grains',
    tags: ['garri', 'swallow', 'cassava', 'eba'],
  },
  {
    id: 'prod_fufu_flour',
    storeId: 'store_mama_jones',
    storeName: 'Mama Jones African Market',
    name: 'Plantain Fufu Flour',
    slug: 'plantain-fufu-flour',
    description: 'Instant plantain fufu mix — smooth swallow in minutes.',
    imageUrl:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 999,
    weightOz: 24,
    stockQty: 55,
    shippable: true,
    localAvailable: true,
    category: 'Grains',
    tags: ['fufu', 'flour', 'swallow', 'plantain'],
  },

  // —— Lagos Pantry (Houston) ——
  {
    id: 'prod_egusi',
    storeId: 'store_lagos_pantry',
    storeName: 'Lagos Pantry Houston',
    name: 'Egusi (Melon Seeds)',
    slug: 'egusi',
    description: 'Ground melon seeds for classic egusi soup.',
    imageUrl:
      'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'OZ',
    priceCents: 799,
    weightOz: 16,
    stockQty: 120,
    shippable: true,
    localAvailable: true,
    category: 'Pantry',
    tags: ['egusi', 'seeds', 'soup'],
  },
  {
    id: 'prod_stockfish',
    storeId: 'store_lagos_pantry',
    storeName: 'Lagos Pantry Houston',
    name: 'Dried Stockfish',
    slug: 'stockfish',
    description: 'Premium dried stockfish — ships dry nationwide.',
    imageUrl:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 1899,
    weightOz: 24,
    stockQty: 42,
    shippable: true,
    localAvailable: true,
    category: 'Meat & Seafood',
    tags: ['fish', 'dried', 'stockfish', 'soup'],
  },
  {
    id: 'prod_yam_flour',
    storeId: 'store_lagos_pantry',
    storeName: 'Lagos Pantry Houston',
    name: 'Yam Flour (Elubo)',
    slug: 'yam-flour',
    description: 'Fine yam flour for amala — smooth and earthy.',
    imageUrl:
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 1299,
    weightOz: 32,
    stockQty: 80,
    shippable: true,
    localAvailable: true,
    category: 'Grains',
    tags: ['flour', 'yam', 'amala', 'swallow'],
  },
  {
    id: 'prod_ogbono',
    storeId: 'store_lagos_pantry',
    storeName: 'Lagos Pantry Houston',
    name: 'Ogbono Seeds (Ground)',
    slug: 'ogbono',
    description: 'Ground wild mango seeds for draw soup.',
    imageUrl:
      'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'OZ',
    priceCents: 899,
    weightOz: 12,
    stockQty: 70,
    shippable: true,
    localAvailable: true,
    category: 'Pantry',
    tags: ['ogbono', 'soup', 'seeds'],
  },
  {
    id: 'prod_crayfish',
    storeId: 'store_lagos_pantry',
    storeName: 'Lagos Pantry Houston',
    name: 'Ground Crayfish',
    slug: 'ground-crayfish',
    description: 'Sun-dried ground crayfish — essential soup seasoning.',
    imageUrl:
      'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'OZ',
    priceCents: 749,
    weightOz: 8,
    stockQty: 95,
    shippable: true,
    localAvailable: true,
    category: 'Meat & Seafood',
    tags: ['crayfish', 'seasoning', 'soup', 'dried'],
  },
  {
    id: 'prod_jollof_mix',
    storeId: 'store_lagos_pantry',
    storeName: 'Lagos Pantry Houston',
    name: 'Jollof Rice Spice Mix',
    slug: 'jollof-rice-mix',
    description: 'Party jollof blend — tomato base spices ready to cook.',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 549,
    weightOz: 6,
    stockQty: 110,
    shippable: true,
    localAvailable: true,
    category: 'Spices',
    tags: ['jollof', 'rice', 'spice', 'party'],
  },
  {
    id: 'prod_palm_cream',
    storeId: 'store_lagos_pantry',
    storeName: 'Lagos Pantry Houston',
    name: 'Palm Cream (Concentrate)',
    slug: 'palm-cream',
    description: 'Concentrated palm fruit cream for banga and stew.',
    imageUrl:
      'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'EACH',
    priceCents: 699,
    weightOz: 14,
    stockQty: 88,
    shippable: true,
    localAvailable: true,
    category: 'Oils',
    tags: ['palm', 'cream', 'banga', 'stew'],
  },
  {
    id: 'prod_dried_fish',
    storeId: 'store_lagos_pantry',
    storeName: 'Lagos Pantry Houston',
    name: 'Dried Catfish',
    slug: 'dried-catfish',
    description: 'Smoky dried catfish pieces for soups and stews.',
    imageUrl:
      'https://images.unsplash.com/photo-1535140728325-a4d3707eee61?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 1599,
    weightOz: 16,
    stockQty: 38,
    shippable: true,
    localAvailable: true,
    category: 'Meat & Seafood',
    tags: ['fish', 'dried', 'catfish', 'soup'],
  },
  {
    id: 'prod_plantain_chips',
    storeId: 'store_lagos_pantry',
    storeName: 'Lagos Pantry Houston',
    name: 'Plantain Chips (Salted)',
    slug: 'plantain-chips',
    description: 'Crispy golden plantain chips — lightly salted.',
    imageUrl:
      'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 399,
    weightOz: 5,
    stockQty: 140,
    shippable: true,
    localAvailable: true,
    category: 'Snacks',
    tags: ['chips', 'plantain', 'snack'],
  },

  // —— Nile Spice (Dallas, shipping only / East African) ——
  {
    id: 'prod_berbere',
    storeId: 'store_nile_spice',
    storeName: 'Nile Spice Depot',
    name: 'Berbere Spice Blend',
    slug: 'berbere',
    description: 'Authentic Ethiopian berbere — chili, fenugreek, and aromatics.',
    imageUrl:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop',
    region: 'EAST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'OZ',
    priceCents: 899,
    weightOz: 8,
    stockQty: 100,
    shippable: true,
    localAvailable: false,
    category: 'Spices',
    tags: ['berbere', 'ethiopian', 'spice'],
  },
  {
    id: 'prod_teff',
    storeId: 'store_nile_spice',
    storeName: 'Nile Spice Depot',
    name: 'Ivory Teff Grain',
    slug: 'ivory-teff',
    description: 'Whole ivory teff — gluten-free ancient grain staple.',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    region: 'EAST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 1499,
    weightOz: 32,
    stockQty: 65,
    shippable: true,
    localAvailable: false,
    category: 'Grains',
    tags: ['teff', 'grain', 'gluten-free', 'ethiopian'],
  },
  {
    id: 'prod_injera_flour',
    storeId: 'store_nile_spice',
    storeName: 'Nile Spice Depot',
    name: 'Injera Flour Mix',
    slug: 'injera-flour',
    description: 'Ready teff flour blend for homemade injera.',
    imageUrl:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&h=600&fit=crop',
    region: 'EAST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 1299,
    weightOz: 28,
    stockQty: 72,
    shippable: true,
    localAvailable: false,
    category: 'Grains',
    tags: ['injera', 'teff', 'flour', 'ethiopian'],
  },
  {
    id: 'prod_mitmita',
    storeId: 'store_nile_spice',
    storeName: 'Nile Spice Depot',
    name: 'Mitmita Hot Spice',
    slug: 'mitmita',
    description: 'Fiery Ethiopian chili blend for kitfo and finishing.',
    imageUrl:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=600&fit=crop',
    region: 'EAST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'OZ',
    priceCents: 699,
    weightOz: 4,
    stockQty: 85,
    shippable: true,
    localAvailable: false,
    category: 'Spices',
    tags: ['mitmita', 'spicy', 'ethiopian'],
  },
  {
    id: 'prod_niter_kibbeh',
    storeId: 'store_nile_spice',
    storeName: 'Nile Spice Depot',
    name: 'Niter Kibbeh Spice Kit',
    slug: 'niter-kibbeh-kit',
    description: 'Cardamom, fenugreek & spice kit for clarified butter.',
    imageUrl:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=600&fit=crop',
    region: 'EAST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 849,
    weightOz: 6,
    stockQty: 50,
    shippable: true,
    localAvailable: false,
    category: 'Spices',
    tags: ['niter-kibbeh', 'butter', 'ethiopian', 'spice'],
  },
  {
    id: 'prod_shiro',
    storeId: 'store_nile_spice',
    storeName: 'Nile Spice Depot',
    name: 'Shiro Powder',
    slug: 'shiro-powder',
    description: 'Chickpea flour stew base for classic shiro wat.',
    imageUrl:
      'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=600&h=600&fit=crop',
    region: 'EAST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 999,
    weightOz: 16,
    stockQty: 60,
    shippable: true,
    localAvailable: false,
    category: 'Pantry',
    tags: ['shiro', 'chickpea', 'stew', 'ethiopian'],
  },

  // —— Harlem Harvest (NYC) ——
  {
    id: 'prod_cassava_leaves',
    storeId: 'store_harlem_harvest',
    storeName: 'Harlem Harvest African Grocer',
    name: 'Frozen Cassava Leaves',
    slug: 'cassava-leaves',
    description: 'Pound-ready cassava leaves for palaver sauce and stews.',
    imageUrl:
      'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&h=600&fit=crop',
    region: 'CENTRAL_AFRICAN',
    temperatureClass: 'FROZEN',
    unit: 'PACK',
    priceCents: 699,
    weightOz: 16,
    stockQty: 40,
    shippable: false,
    localAvailable: true,
    category: 'Frozen',
    tags: ['cassava', 'leaves', 'frozen', 'palaver'],
  },
  {
    id: 'prod_green_plantain',
    storeId: 'store_harlem_harvest',
    storeName: 'Harlem Harvest African Grocer',
    name: 'Green Plantains',
    slug: 'green-plantains',
    description: 'Firm green plantains for tostones, chips, or porridge.',
    imageUrl:
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'FRESH',
    unit: 'LB',
    priceCents: 129,
    weightOz: 16,
    stockQty: 55,
    isWeighted: true,
    shippable: false,
    localAvailable: true,
    category: 'Fresh Produce',
    tags: ['plantain', 'green', 'fresh', 'produce'],
  },
  {
    id: 'prod_palm_wine',
    storeId: 'store_harlem_harvest',
    storeName: 'Harlem Harvest African Grocer',
    name: 'Palm Wine (Non-Alcoholic)',
    slug: 'palm-wine-na',
    description: 'Naturally sweet non-alcoholic palm drink, chilled.',
    imageUrl:
      'https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'FRESH',
    unit: 'EACH',
    priceCents: 599,
    weightOz: 16,
    stockQty: 36,
    shippable: false,
    localAvailable: true,
    category: 'Pantry',
    tags: ['drink', 'palm-wine', 'non-alcoholic'],
  },
  {
    id: 'prod_smoked_turkey',
    storeId: 'store_harlem_harvest',
    storeName: 'Harlem Harvest African Grocer',
    name: 'Smoked Turkey Wings',
    slug: 'smoked-turkey-wings',
    description: 'Deeply smoked turkey wings for soups and stews.',
    imageUrl:
      'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'FROZEN',
    unit: 'LB',
    priceCents: 749,
    weightOz: 16,
    stockQty: 28,
    isWeighted: true,
    shippable: false,
    localAvailable: true,
    category: 'Frozen',
    tags: ['turkey', 'smoked', 'soup', 'protein'],
  },
  {
    id: 'prod_atta_rice',
    storeId: 'store_harlem_harvest',
    storeName: 'Harlem Harvest African Grocer',
    name: 'Long-Grain Parboiled Rice',
    slug: 'parboiled-rice',
    description: 'Premium long-grain rice — the party jollof standard.',
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 1199,
    weightOz: 80,
    stockQty: 95,
    shippable: true,
    localAvailable: true,
    category: 'Grains',
    tags: ['rice', 'jollof', 'parboiled'],
  },
  {
    id: 'prod_uziza',
    storeId: 'store_harlem_harvest',
    storeName: 'Harlem Harvest African Grocer',
    name: 'Dried Uziza Leaves',
    slug: 'uziza-leaves',
    description: 'Peppery aromatic leaves for pepper soup and nkwobi.',
    imageUrl:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'OZ',
    priceCents: 549,
    weightOz: 2,
    stockQty: 48,
    shippable: true,
    localAvailable: true,
    category: 'Spices',
    tags: ['uziza', 'leaves', 'pepper-soup', 'spice'],
  },
  {
    id: 'prod_groundnut_oil',
    storeId: 'store_harlem_harvest',
    storeName: 'Harlem Harvest African Grocer',
    name: 'Groundnut Oil',
    slug: 'groundnut-oil',
    description: 'Pure peanut oil for frying and high-heat cooking.',
    imageUrl:
      'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'EACH',
    priceCents: 899,
    weightOz: 32,
    stockQty: 58,
    shippable: true,
    localAvailable: true,
    category: 'Oils',
    tags: ['oil', 'groundnut', 'peanut', 'frying'],
  },
  {
    id: 'prod_locust_beans',
    storeId: 'store_harlem_harvest',
    storeName: 'Harlem Harvest African Grocer',
    name: 'Iru (Locust Beans)',
    slug: 'iru-locust-beans',
    description: 'Fermented locust beans — deep umami for stews.',
    imageUrl:
      'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'OZ',
    priceCents: 649,
    weightOz: 4,
    stockQty: 44,
    shippable: true,
    localAvailable: true,
    category: 'Pantry',
    tags: ['iru', 'locust-beans', 'fermented', 'umami'],
  },
  {
    id: 'prod_frozen_okro',
    storeId: 'store_harlem_harvest',
    storeName: 'Harlem Harvest African Grocer',
    name: 'Frozen Cut Okra',
    slug: 'frozen-okra',
    description: 'Pre-cut frozen okra for draw soup and stews.',
    imageUrl:
      'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'FROZEN',
    unit: 'PACK',
    priceCents: 449,
    weightOz: 16,
    stockQty: 50,
    shippable: false,
    localAvailable: true,
    category: 'Frozen',
    tags: ['okra', 'okro', 'frozen', 'soup'],
  },
  {
    id: 'prod_chin_chin',
    storeId: 'store_harlem_harvest',
    storeName: 'Harlem Harvest African Grocer',
    name: 'Chin Chin',
    slug: 'chin-chin',
    description: 'Crunchy fried dough snack — lightly sweet.',
    imageUrl:
      'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&h=600&fit=crop',
    region: 'WEST_AFRICAN',
    temperatureClass: 'DRY',
    unit: 'PACK',
    priceCents: 499,
    weightOz: 8,
    stockQty: 75,
    shippable: true,
    localAvailable: true,
    category: 'Snacks',
    tags: ['chin-chin', 'snack', 'sweet'],
  },
];

// ---------------------------------------------------------------------------
// Recipe bundles
// ---------------------------------------------------------------------------

export const RECIPE_BUNDLES: RecipeBundle[] = [
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
  {
    id: 'bundle_injera_feast',
    name: 'Injera Feast',
    slug: 'injera-feast',
    description:
      'East African platter starter kit — injera flour, berbere, teff, and shiro.',
    region: 'EAST_AFRICAN',
    imageUrl:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=500&fit=crop',
    servings: 6,
    prepMinutes: 120,
    productIds: [
      'prod_injera_flour',
      'prod_berbere',
      'prod_teff',
      'prod_shiro',
      'prod_mitmita',
      'prod_niter_kibbeh',
    ],
    tags: ['ethiopian', 'injera', 'east-african'],
  },
];

// ---------------------------------------------------------------------------
// Demo customer
// ---------------------------------------------------------------------------

export const DEMO_USER: User = {
  id: 'user_ada',
  name: 'Ada Okonkwo',
  email: 'ada@teedeux.com',
  phone: '+1 (404) 555-0182',
  role: 'CUSTOMER',
  defaultAddressId: 'addr_ada_home',
  avatarUrl:
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop',
  createdAt: '2025-11-12T14:30:00.000Z',
};

export const DEMO_ADDRESSES: Address[] = [
  {
    id: 'addr_ada_home',
    label: 'Home',
    line1: '1842 Peachtree Rd NE',
    line2: 'Apt 4B',
    city: 'Atlanta',
    state: 'GA',
    postalCode: '30309',
    country: 'US',
    latitude: 33.805,
    longitude: -84.393,
    isDefault: true,
  },
  {
    id: 'addr_ada_work',
    label: 'Work',
    line1: '3340 Peachtree Rd NE',
    line2: 'Suite 1200',
    city: 'Atlanta',
    state: 'GA',
    postalCode: '30326',
    country: 'US',
    latitude: 33.847,
    longitude: -84.367,
    isDefault: false,
  },
];

export const DEMO_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pm_visa_4242',
    type: 'CARD',
    label: 'Visa ending in 4242',
    brand: 'visa',
    last4: '4242',
    expiryMonth: 8,
    expiryYear: 2028,
    isDefault: true,
  },
  {
    id: 'pm_apple_pay',
    type: 'APPLE_PAY',
    label: 'Apple Pay',
    isDefault: false,
  },
];

/** Aliases for store consumers */
export const DEMO_STORES = STORES;
export const DEMO_PRODUCTS = PRODUCTS;
export const DEMO_ADDRESS = DEMO_ADDRESSES[0];

export const DEMO_SHOPPER: User = {
  id: 'user_shopper_kwame',
  name: 'Kwame Mensah',
  email: 'shopper@teedeux.com',
  phone: '+1 (404) 555-0199',
  role: 'SHOPPER',
  avatarUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  createdAt: '2025-10-01T09:00:00.000Z',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getStoreById(storeId: string): Store | undefined {
  return STORES.find((s) => s.id === storeId);
}

export function getProductsByStore(storeId: string): Product[] {
  return PRODUCTS.filter((p) => p.storeId === storeId);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return PRODUCTS.filter((p) => p.category === category);
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return PRODUCTS;
  return PRODUCTS.filter((p) => {
    const haystack = [
      p.name,
      p.description,
      p.storeName,
      p.category,
      p.region,
      ...p.tags,
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getBundleProducts(bundleId: string): Product[] {
  const bundle = RECIPE_BUNDLES.find((b) => b.id === bundleId);
  if (!bundle) return [];
  return bundle.productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => p != null);
}

export function getProductById(productId: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === productId);
}

export function getBundleById(bundleId: string): RecipeBundle | undefined {
  return RECIPE_BUNDLES.find((b) => b.id === bundleId);
}

export function formatPriceCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Suggest fulfillment channel from product availability flags */
export function defaultFulfillmentForProduct(
  product: Product
): 'LOCAL_DELIVERY' | 'NATIONWIDE_SHIPPING' {
  if (product.localAvailable && !product.shippable) return 'LOCAL_DELIVERY';
  if (product.shippable && !product.localAvailable) return 'NATIONWIDE_SHIPPING';
  return product.temperatureClass === 'DRY'
    ? 'NATIONWIDE_SHIPPING'
    : 'LOCAL_DELIVERY';
}
