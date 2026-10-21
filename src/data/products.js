// src/data/products.js — 60+ products with size/brand/variant, some shared across stores

export const mockProducts = [
  // ============ GROCERY (Fresh Basket s1, New Sunrise s13, Nature's Basket s9) ============
  {
    id: 'p1', storeId: 's1', name: 'Tata Salt', brand: 'Tata', category: 'grocery',
    variant: 'Iodised', size: '1 kg', price: 24, mrp: 26, stock: 50, unit: 'pack',
    description: 'Tata Salt Iodised, the trusted salt of India. Pure and hygienic.', images: [],
    isEnabled: true, tags: ['salt', 'staples'],
  },
  {
    id: 'p2', storeId: 's13', name: 'Tata Salt', brand: 'Tata', category: 'grocery',
    variant: 'Iodised', size: '1 kg', price: 22, mrp: 26, stock: 12, unit: 'pack',
    description: 'Tata Salt Iodised 1kg pack.', images: [],
    isEnabled: true, tags: ['salt', 'staples'],
  },
  {
    id: 'p3', storeId: 's9', name: 'Tata Salt', brand: 'Tata', category: 'grocery',
    variant: 'Iodised', size: '1 kg', price: 26, mrp: 26, stock: 80, unit: 'pack',
    description: 'Tata Salt 1kg – premium grocery store.', images: [],
    isEnabled: true, tags: ['salt', 'staples'],
  },
  {
    id: 'p4', storeId: 's1', name: 'Tata Salt', brand: 'Tata', category: 'grocery',
    variant: 'Rock Salt', size: '1 kg', price: 35, mrp: 38, stock: 30, unit: 'pack',
    description: 'Tata Rock Salt – different variant, NOT the same as Iodised.', images: [],
    isEnabled: true, tags: ['salt', 'staples'],
  },
  {
    id: 'p5', storeId: 's1', name: 'Aashirvaad Atta', brand: 'Aashirvaad', category: 'grocery',
    variant: 'Whole Wheat', size: '5 kg', price: 245, mrp: 265, stock: 25, unit: 'bag',
    description: 'Aashirvaad Select Sharbati Atta, 5 kg.', images: [],
    isEnabled: true, tags: ['atta', 'flour', 'staples'],
  },
  {
    id: 'p6', storeId: 's13', name: 'Aashirvaad Atta', brand: 'Aashirvaad', category: 'grocery',
    variant: 'Whole Wheat', size: '5 kg', price: 239, mrp: 265, stock: 18, unit: 'bag',
    description: 'Aashirvaad atta 5kg at discounted price.', images: [],
    isEnabled: true, tags: ['atta', 'flour', 'staples'],
  },
  {
    id: 'p7', storeId: 's9', name: 'Aashirvaad Atta', brand: 'Aashirvaad', category: 'grocery',
    variant: 'Whole Wheat', size: '10 kg', price: 490, mrp: 525, stock: 10, unit: 'bag',
    description: 'Aashirvaad atta 10 kg – larger pack, different from 5kg.', images: [],
    isEnabled: true, tags: ['atta', 'flour', 'staples'],
  },
  {
    id: 'p8', storeId: 's1', name: 'Fortune Sunflower Oil', brand: 'Fortune', category: 'grocery',
    variant: 'Sunflower', size: '1 L', price: 142, mrp: 155, stock: 0, unit: 'bottle',
    description: 'Fortune Sunflower refined oil, 1 litre.', images: [],
    isEnabled: true, tags: ['oil', 'cooking'],
  },
  {
    id: 'p9', storeId: 's13', name: 'Fortune Sunflower Oil', brand: 'Fortune', category: 'grocery',
    variant: 'Sunflower', size: '1 L', price: 138, mrp: 155, stock: 40, unit: 'bottle',
    description: 'Fortune Sunflower Oil 1L – locally stocked.', images: [],
    isEnabled: true, tags: ['oil', 'cooking'],
  },
  {
    id: 'p10', storeId: 's1', name: 'Maggi Noodles', brand: 'Maggi', category: 'grocery',
    variant: 'Masala', size: '70 g (Pack of 4)', price: 58, mrp: 60, stock: 100, unit: 'pack',
    description: 'Maggi 2 Minute Masala Noodles, pack of 4.', images: [],
    isEnabled: true, tags: ['noodles', 'instant', 'snacks'],
  },
  {
    id: 'p11', storeId: 's8', name: 'Maggi Noodles', brand: 'Maggi', category: 'grocery',
    variant: 'Masala', size: '70 g (Pack of 4)', price: 60, mrp: 60, stock: 55, unit: 'pack',
    description: 'Maggi noodles at snack store.', images: [],
    isEnabled: true, tags: ['noodles', 'instant'],
  },
  {
    id: 'p12', storeId: 's8', name: 'Lays Classic Salted', brand: 'Lays', category: 'snacks',
    variant: 'Classic Salted', size: '52 g', price: 20, mrp: 20, stock: 200, unit: 'pack',
    description: 'Lays Classic Salted flavour, 52g.', images: [],
    isEnabled: true, tags: ['chips', 'snacks'],
  },
  {
    id: 'p13', storeId: 's9', name: 'Lays Classic Salted', brand: 'Lays', category: 'snacks',
    variant: 'Classic Salted', size: '52 g', price: 20, mrp: 20, stock: 90, unit: 'pack',
    description: 'Lays Classic Salted 52g.', images: [],
    isEnabled: true, tags: ['chips', 'snacks'],
  },
  {
    id: 'p14', storeId: 's8', name: 'Red Bull Energy Drink', brand: 'Red Bull', category: 'snacks',
    variant: 'Original', size: '250 ml', price: 125, mrp: 130, stock: 60, unit: 'can',
    description: 'Red Bull Original Energy Drink, 250ml can.', images: [],
    isEnabled: true, tags: ['energy drink', 'beverage'],
  },

  // ============ DAIRY (Amul Dairy s6, Nature's Basket s9) ============
  {
    id: 'p15', storeId: 's6', name: 'Amul Taaza Milk', brand: 'Amul', category: 'dairy',
    variant: 'Toned', size: '500 ml Pouch', price: 27, mrp: 27, stock: 150, unit: 'pouch',
    description: 'Amul Taaza Toned Milk, 500 ml Pouch.', images: [],
    isEnabled: true, tags: ['milk', 'dairy'],
  },
  {
    id: 'p16', storeId: 's6', name: 'Amul Taaza Milk', brand: 'Amul', category: 'dairy',
    variant: 'Full Cream', size: '500 ml Pouch', price: 31, mrp: 31, stock: 100, unit: 'pouch',
    description: 'Amul Taaza Full Cream Milk – different variant, not same as Toned.', images: [],
    isEnabled: true, tags: ['milk', 'dairy'],
  },
  {
    id: 'p17', storeId: 's9', name: 'Amul Taaza Milk', brand: 'Amul', category: 'dairy',
    variant: 'Toned', size: '1 L Pouch', price: 52, mrp: 54, stock: 40, unit: 'pouch',
    description: 'Amul Taaza Toned Milk 1L – different size from 500ml.', images: [],
    isEnabled: true, tags: ['milk', 'dairy'],
  },
  {
    id: 'p18', storeId: 's6', name: 'Amul Paneer', brand: 'Amul', category: 'dairy',
    variant: 'Fresh', size: '200 g', price: 75, mrp: 80, stock: 30, unit: 'pack',
    description: 'Amul Fresh Paneer 200g, refrigerated.', images: [],
    isEnabled: true, tags: ['paneer', 'dairy'],
  },
  {
    id: 'p19', storeId: 's1', name: 'Amul Paneer', brand: 'Amul', category: 'dairy',
    variant: 'Fresh', size: '200 g', price: 78, mrp: 80, stock: 20, unit: 'pack',
    description: 'Amul Fresh Paneer 200g.', images: [],
    isEnabled: true, tags: ['paneer', 'dairy'],
  },
  {
    id: 'p20', storeId: 's6', name: 'Amul Butter', brand: 'Amul', category: 'dairy',
    variant: 'Salted', size: '100 g', price: 56, mrp: 58, stock: 45, unit: 'pack',
    description: 'Amul Salted Butter 100g.', images: [],
    isEnabled: true, tags: ['butter', 'dairy'],
  },
  {
    id: 'p21', storeId: 's9', name: 'Amul Butter', brand: 'Amul', category: 'dairy',
    variant: 'Salted', size: '100 g', price: 58, mrp: 58, stock: 30, unit: 'pack',
    description: 'Amul Salted Butter 100g at premium store.', images: [],
    isEnabled: true, tags: ['butter', 'dairy'],
  },

  // ============ PHARMACY (MediCare s2, QuickMed s11) ============
  {
    id: 'p22', storeId: 's2', name: 'Dettol Antiseptic Liquid', brand: 'Dettol', category: 'pharmacy',
    variant: 'Original', size: '250 ml', price: 135, mrp: 150, stock: 40, unit: 'bottle',
    description: 'Dettol Antiseptic Liquid for cuts, wounds and skin infections.', images: [],
    isEnabled: true, tags: ['antiseptic', 'first aid', 'health'],
  },
  {
    id: 'p23', storeId: 's11', name: 'Dettol Antiseptic Liquid', brand: 'Dettol', category: 'pharmacy',
    variant: 'Original', size: '250 ml', price: 140, mrp: 150, stock: 25, unit: 'bottle',
    description: 'Dettol Antiseptic Liquid 250ml at QuickMed.', images: [],
    isEnabled: true, tags: ['antiseptic', 'health'],
  },
  {
    id: 'p24', storeId: 's2', name: 'Crocin Advance', brand: 'Crocin', category: 'pharmacy',
    variant: '500mg', size: 'Strip of 15 Tablets', price: 32, mrp: 35, stock: 100, unit: 'strip',
    description: 'Crocin Advance paracetamol 500mg, for fever and pain.', images: [],
    isEnabled: true, tags: ['tablet', 'paracetamol', 'fever'],
  },
  {
    id: 'p25', storeId: 's11', name: 'Crocin Advance', brand: 'Crocin', category: 'pharmacy',
    variant: '500mg', size: 'Strip of 15 Tablets', price: 35, mrp: 35, stock: 200, unit: 'strip',
    description: 'Crocin Advance 500mg at QuickMed.', images: [],
    isEnabled: true, tags: ['tablet', 'paracetamol'],
  },
  {
    id: 'p26', storeId: 's2', name: 'Cetaphil Gentle Skin Cleanser', brand: 'Cetaphil', category: 'pharmacy',
    variant: 'Normal to Oily', size: '250 ml', price: 355, mrp: 399, stock: 15, unit: 'bottle',
    description: 'Cetaphil Gentle Skin Cleanser, 250ml.', images: [],
    isEnabled: true, tags: ['skincare', 'cleanser', 'face wash'],
  },
  {
    id: 'p27', storeId: 's11', name: 'Cetaphil Gentle Skin Cleanser', brand: 'Cetaphil', category: 'pharmacy',
    variant: 'Normal to Oily', size: '250 ml', price: 370, mrp: 399, stock: 8, unit: 'bottle',
    description: 'Cetaphil Skin Cleanser 250ml at QuickMed.', images: [],
    isEnabled: true, tags: ['skincare', 'cleanser'],
  },

  // ============ BAKERY (Sweet Crumbs s3, The Bread House s12) ============
  {
    id: 'p28', storeId: 's3', name: 'Chocolate Truffle Cake', brand: 'Sweet Crumbs', category: 'bakery',
    variant: 'Chocolate', size: '500 g', price: 450, mrp: 500, stock: 5, unit: 'piece',
    description: 'Rich chocolate truffle cake, freshly baked. Serves 4-6 people.', images: [],
    isEnabled: true, tags: ['cake', 'chocolate', 'celebration'],
  },
  {
    id: 'p29', storeId: 's3', name: 'Sourdough Bread', brand: 'Sweet Crumbs', category: 'bakery',
    variant: 'Plain', size: '400 g', price: 180, mrp: 200, stock: 8, unit: 'loaf',
    description: 'Authentic sourdough bread, tangy and chewy.', images: [],
    isEnabled: true, tags: ['bread', 'sourdough'],
  },
  {
    id: 'p30', storeId: 's12', name: 'Sourdough Bread', brand: 'The Bread House', category: 'bakery',
    variant: 'Plain', size: '400 g', price: 165, mrp: 180, stock: 12, unit: 'loaf',
    description: 'Artisan sourdough bread 400g from The Bread House.', images: [],
    isEnabled: true, tags: ['bread', 'sourdough'],
  },
  {
    id: 'p31', storeId: 's3', name: 'Croissant', brand: 'Sweet Crumbs', category: 'bakery',
    variant: 'Butter', size: 'Single', price: 55, mrp: 60, stock: 20, unit: 'piece',
    description: 'Freshly baked French butter croissant, flaky and golden.', images: [],
    isEnabled: true, tags: ['croissant', 'pastry', 'breakfast'],
  },
  {
    id: 'p32', storeId: 's12', name: 'Croissant', brand: 'The Bread House', category: 'bakery',
    variant: 'Butter', size: 'Single', price: 50, mrp: 55, stock: 15, unit: 'piece',
    description: 'Butter croissant baked fresh each morning.', images: [],
    isEnabled: true, tags: ['croissant', 'pastry'],
  },

  // ============ ELECTRONICS (TechZone s4) ============
  {
    id: 'p33', storeId: 's4', name: 'Boat Bassheads 100', brand: 'boAt', category: 'electronics',
    variant: 'Wired', size: 'One Size', price: 449, mrp: 699, stock: 20, unit: 'piece',
    description: 'boAt Bassheads 100 wired in-ear earphones with mic.', images: [],
    isEnabled: true, tags: ['earphones', 'audio', 'wired'],
  },
  {
    id: 'p34', storeId: 's4', name: 'Anker USB-C Cable', brand: 'Anker', category: 'electronics',
    variant: 'USB-C to USB-C', size: '1.8 m', price: 699, mrp: 999, stock: 30, unit: 'piece',
    description: 'Anker USB-C braided cable, 1.8m, 60W fast charging.', images: [],
    isEnabled: true, tags: ['cable', 'charger', 'usb-c'],
  },
  {
    id: 'p35', storeId: 's4', name: 'Mi Power Bank 3i', brand: 'Xiaomi', category: 'electronics',
    variant: '10000 mAh', size: 'Standard', price: 999, mrp: 1299, stock: 10, unit: 'piece',
    description: 'Mi Power Bank 3i 10000 mAh with dual output.', images: [],
    isEnabled: true, tags: ['powerbank', 'charger', 'gadget'],
  },

  // ============ STATIONERY (PaperWorld s5) ============
  {
    id: 'p36', storeId: 's5', name: 'Classmate Single Line Notebook', brand: 'Classmate', category: 'stationery',
    variant: 'Single Line', size: 'A4 / 172 pages', price: 55, mrp: 65, stock: 80, unit: 'piece',
    description: 'Classmate A4 Single Line Notebook, 172 pages, ideal for school & college.', images: [],
    isEnabled: true, tags: ['notebook', 'school', 'stationery'],
  },
  {
    id: 'p37', storeId: 's5', name: 'Parker Beta Ball Pen', brand: 'Parker', category: 'stationery',
    variant: 'Blue Ink', size: 'Single', price: 35, mrp: 40, stock: 200, unit: 'piece',
    description: 'Parker Beta Ball Point Pen with blue refill.', images: [],
    isEnabled: true, tags: ['pen', 'ballpen', 'writing'],
  },
  {
    id: 'p38', storeId: 's5', name: 'Camlin Camel Watercolours', brand: 'Camlin', category: 'stationery',
    variant: '12 Shades', size: 'Tin Box', price: 120, mrp: 140, stock: 35, unit: 'pack',
    description: 'Camlin Camel Watercolour cake set, 12 shades.', images: [],
    isEnabled: true, tags: ['colours', 'art', 'painting'],
  },

  // ============ FRUITS & VEG (Green Valley s7) ============
  {
    id: 'p39', storeId: 's7', name: 'Tomatoes', brand: 'Local Farm', category: 'fruits',
    variant: 'Desi Red', size: '500 g', price: 18, mrp: 25, stock: 200, unit: 'pack',
    description: 'Fresh red tomatoes, locally grown.', images: [],
    isEnabled: true, tags: ['vegetables', 'tomatoes', 'fresh'],
  },
  {
    id: 'p40', storeId: 's7', name: 'Banana', brand: 'Local Farm', category: 'fruits',
    variant: 'Robusta', size: 'Dozen', price: 48, mrp: 55, stock: 50, unit: 'dozen',
    description: 'Fresh Robusta bananas, ripe and sweet.', images: [],
    isEnabled: true, tags: ['fruits', 'banana'],
  },
  {
    id: 'p41', storeId: 's7', name: 'Spinach', brand: 'Organic', category: 'fruits',
    variant: 'Baby Spinach', size: '250 g Bundle', price: 30, mrp: 35, stock: 40, unit: 'bundle',
    description: 'Fresh baby spinach, organically grown.', images: [],
    isEnabled: true, tags: ['vegetables', 'leafy greens', 'organic'],
  },
  {
    id: 'p42', storeId: 's7', name: 'Alphonso Mangoes', brand: 'Ratnagiri', category: 'fruits',
    variant: 'Alphonso', size: '6 Pieces', price: 180, mrp: 200, stock: 30, unit: 'pack',
    description: 'Premium Ratnagiri Alphonso mangoes, GI tagged.', images: [],
    isEnabled: true, tags: ['fruits', 'mango', 'alphonso', 'seasonal'],
  },

  // ============ FLOWERS (Petal & Bloom s10) ============
  {
    id: 'p43', storeId: 's10', name: 'Red Rose Bouquet', brand: 'Petal & Bloom', category: 'flowers',
    variant: 'Red Roses', size: '12 Stems', price: 350, mrp: 400, stock: 10, unit: 'bouquet',
    description: 'A classic bouquet of 12 fresh red roses with baby breath.', images: [],
    isEnabled: true, tags: ['roses', 'bouquet', 'gift'],
  },
  {
    id: 'p44', storeId: 's10', name: 'Mixed Flowers Bouquet', brand: 'Petal & Bloom', category: 'flowers',
    variant: 'Mixed', size: '20 Stems', price: 450, mrp: 500, stock: 8, unit: 'bouquet',
    description: 'Seasonal mixed flower bouquet, 20 stems.', images: [],
    isEnabled: true, tags: ['flowers', 'bouquet', 'mixed'],
  },

  // ============ Additional products for s1 ============
  {
    id: 'p45', storeId: 's1', name: 'Tata Tea Gold', brand: 'Tata Tea', category: 'grocery',
    variant: 'Gold', size: '250 g', price: 105, mrp: 115, stock: 40, unit: 'pack',
    description: 'Tata Tea Gold, long leaf flavour, 250g.', images: [],
    isEnabled: true, tags: ['tea', 'beverage'],
  },
  {
    id: 'p46', storeId: 's1', name: 'Surf Excel Easy Wash', brand: 'Surf Excel', category: 'grocery',
    variant: 'Easy Wash', size: '1 kg', price: 115, mrp: 130, stock: 30, unit: 'pack',
    description: 'Surf Excel Easy Wash detergent powder 1kg.', images: [],
    isEnabled: true, tags: ['detergent', 'laundry', 'household'],
  },
  {
    id: 'p47', storeId: 's1', name: 'Dove Beauty Bar', brand: 'Dove', category: 'grocery',
    variant: 'Original', size: '100 g (Pack of 3)', price: 159, mrp: 175, stock: 25, unit: 'pack',
    description: 'Dove Beauty Bar with 1/4 moisturising cream, pack of 3.', images: [],
    isEnabled: true, tags: ['soap', 'beauty', 'hygiene'],
  },
  {
    id: 'p48', storeId: 's9', name: 'Tata Tea Gold', brand: 'Tata Tea', category: 'grocery',
    variant: 'Gold', size: '250 g', price: 110, mrp: 115, stock: 55, unit: 'pack',
    description: 'Tata Tea Gold 250g at Nature\'s Basket.', images: [],
    isEnabled: true, tags: ['tea', 'beverage'],
  },
  {
    id: 'p49', storeId: 's2', name: 'Himalaya Ashwagandha', brand: 'Himalaya', category: 'pharmacy',
    variant: 'Tablets', size: 'Bottle of 60', price: 169, mrp: 190, stock: 20, unit: 'bottle',
    description: 'Himalaya Ashwagandha General Wellness tablets.', images: [],
    isEnabled: true, tags: ['supplement', 'wellness', 'ayurvedic'],
  },
  {
    id: 'p50', storeId: 's11', name: 'Himalaya Ashwagandha', brand: 'Himalaya', category: 'pharmacy',
    variant: 'Tablets', size: 'Bottle of 60', price: 180, mrp: 190, stock: 12, unit: 'bottle',
    description: 'Himalaya Ashwagandha at QuickMed.', images: [],
    isEnabled: true, tags: ['supplement', 'wellness'],
  },
  {
    id: 'p51', storeId: 's8', name: 'Cadbury Dairy Milk', brand: 'Cadbury', category: 'snacks',
    variant: 'Original', size: '160 g', price: 85, mrp: 90, stock: 60, unit: 'bar',
    description: 'Cadbury Dairy Milk Chocolate 160g bar.', images: [],
    isEnabled: true, tags: ['chocolate', 'snacks', 'sweet'],
  },
  {
    id: 'p52', storeId: 's9', name: 'Cadbury Dairy Milk', brand: 'Cadbury', category: 'snacks',
    variant: 'Original', size: '160 g', price: 88, mrp: 90, stock: 45, unit: 'bar',
    description: 'Cadbury Dairy Milk 160g.', images: [],
    isEnabled: true, tags: ['chocolate', 'snacks'],
  },
  {
    id: 'p53', storeId: 's3', name: 'Blueberry Muffin', brand: 'Sweet Crumbs', category: 'bakery',
    variant: 'Blueberry', size: 'Single', price: 80, mrp: 90, stock: 12, unit: 'piece',
    description: 'Freshly baked blueberry muffin with a crisp top.', images: [],
    isEnabled: true, tags: ['muffin', 'bakery', 'breakfast'],
  },
  {
    id: 'p54', storeId: 's4', name: 'Portronics Charge Buddy', brand: 'Portronics', category: 'electronics',
    variant: 'Multi-port', size: '4-port', price: 799, mrp: 1099, stock: 15, unit: 'piece',
    description: 'Portronics 4-port USB charging hub with 3.4A total output.', images: [],
    isEnabled: true, tags: ['charger', 'hub', 'gadget'],
  },
  {
    id: 'p55', storeId: 's6', name: 'Amul Dahi', brand: 'Amul', category: 'dairy',
    variant: 'Plain', size: '400 g', price: 38, mrp: 42, stock: 60, unit: 'cup',
    description: 'Amul Masti Dahi, 400g cup.', images: [],
    isEnabled: true, tags: ['curd', 'yoghurt', 'dairy'],
  },
  {
    id: 'p56', storeId: 's7', name: 'Onion', brand: 'Local Farm', category: 'fruits',
    variant: 'Red', size: '1 kg', price: 35, mrp: 40, stock: 150, unit: 'pack',
    description: 'Fresh red onion 1kg.', images: [],
    isEnabled: true, tags: ['vegetables', 'onion'],
  },
  {
    id: 'p57', storeId: 's1', name: 'Haldirams Bhujia', brand: 'Haldirams', category: 'grocery',
    variant: 'Aloo Bhujia', size: '400 g', price: 99, mrp: 110, stock: 35, unit: 'pack',
    description: 'Haldirams Aloo Bhujia 400g, crispy and spicy.', images: [],
    isEnabled: true, tags: ['snacks', 'namkeen'],
  },
  {
    id: 'p58', storeId: 's8', name: 'Haldirams Bhujia', brand: 'Haldirams', category: 'snacks',
    variant: 'Aloo Bhujia', size: '400 g', price: 105, mrp: 110, stock: 50, unit: 'pack',
    description: 'Haldirams Aloo Bhujia 400g at Snack Attack.', images: [],
    isEnabled: true, tags: ['snacks', 'namkeen'],
  },
  {
    id: 'p59', storeId: 's10', name: 'Marigold Garland', brand: 'Petal & Bloom', category: 'flowers',
    variant: 'Yellow', size: '2 meters', price: 120, mrp: 150, stock: 20, unit: 'garland',
    description: 'Fresh yellow marigold garland, 2 meters length, for pooja/decoration.', images: [],
    isEnabled: true, tags: ['garland', 'marigold', 'flowers', 'pooja'],
  },
  {
    id: 'p60', storeId: 's12', name: 'Multigrain Bread', brand: 'The Bread House', category: 'bakery',
    variant: 'Multigrain', size: '400 g', price: 85, mrp: 95, stock: 18, unit: 'loaf',
    description: 'Healthy multigrain bread with 6 grains, 400g sliced loaf.', images: [],
    isEnabled: true, tags: ['bread', 'multigrain', 'healthy'],
  },
  {
    id: 'p61', storeId: 's5', name: 'Apsara Pencil', brand: 'Apsara', category: 'stationery',
    variant: 'HB', size: 'Pack of 10', price: 40, mrp: 48, stock: 100, unit: 'pack',
    description: 'Apsara HB pencil, pack of 10.', images: [],
    isEnabled: true, tags: ['pencil', 'stationery', 'school'],
  },
  {
    id: 'p62', storeId: 's2', name: 'Disprin', brand: 'Disprin', category: 'pharmacy',
    variant: 'Effervescent', size: 'Strip of 12', price: 22, mrp: 24, stock: 80, unit: 'strip',
    description: 'Disprin effervescent aspirin tablets 325mg.', images: [],
    isEnabled: true, tags: ['aspirin', 'tablet', 'headache'],
  },
];
