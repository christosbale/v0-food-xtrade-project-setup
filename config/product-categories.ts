export interface ProductSubcategory {
  id: string
  label: string
}

export interface ProductCategory {
  id: string
  label: string
  subcategories: ProductSubcategory[]
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'fresh_produce',
    label: 'Fresh Produce',
    subcategories: [
      { id: 'citrus', label: 'Citrus Fruits' },
      { id: 'tropical', label: 'Tropical Fruits' },
      { id: 'berries', label: 'Berries' },
      { id: 'stone_fruits', label: 'Stone Fruits' },
      { id: 'leafy_greens', label: 'Leafy Greens' },
      { id: 'root_vegetables', label: 'Root Vegetables' },
      { id: 'nightshades', label: 'Nightshades (Tomatoes, Peppers, etc.)' },
      { id: 'cruciferous', label: 'Cruciferous Vegetables' },
    ],
  },
  {
    id: 'grains_cereals',
    label: 'Grains & Cereals',
    subcategories: [
      { id: 'wheat', label: 'Wheat' },
      { id: 'rice', label: 'Rice' },
      { id: 'corn', label: 'Corn' },
      { id: 'barley', label: 'Barley' },
      { id: 'oats', label: 'Oats' },
      { id: 'specialty_grains', label: 'Specialty Grains' },
    ],
  },
  {
    id: 'dairy',
    label: 'Dairy Products',
    subcategories: [
      { id: 'milk', label: 'Milk & Cream' },
      { id: 'cheese', label: 'Cheese' },
      { id: 'yogurt', label: 'Yogurt' },
      { id: 'butter', label: 'Butter & Ghee' },
    ],
  },
  {
    id: 'meat_poultry',
    label: 'Meat & Poultry',
    subcategories: [
      { id: 'beef', label: 'Beef' },
      { id: 'pork', label: 'Pork' },
      { id: 'chicken', label: 'Chicken' },
      { id: 'turkey', label: 'Turkey' },
      { id: 'lamb', label: 'Lamb & Goat' },
    ],
  },
  {
    id: 'seafood',
    label: 'Seafood',
    subcategories: [
      { id: 'fish', label: 'Fresh Fish' },
      { id: 'shellfish', label: 'Shellfish' },
      { id: 'frozen_seafood', label: 'Frozen Seafood' },
    ],
  },
  {
    id: 'oils_fats',
    label: 'Oils & Fats',
    subcategories: [
      { id: 'vegetable_oils', label: 'Vegetable Oils' },
      { id: 'olive_oil', label: 'Olive Oil' },
      { id: 'specialty_oils', label: 'Specialty Oils' },
    ],
  },
  {
    id: 'spices_seasonings',
    label: 'Spices & Seasonings',
    subcategories: [
      { id: 'dried_herbs', label: 'Dried Herbs' },
      { id: 'ground_spices', label: 'Ground Spices' },
      { id: 'whole_spices', label: 'Whole Spices' },
      { id: 'spice_blends', label: 'Spice Blends' },
    ],
  },
  {
    id: 'beverages',
    label: 'Beverages',
    subcategories: [
      { id: 'coffee', label: 'Coffee' },
      { id: 'tea', label: 'Tea' },
      { id: 'juices', label: 'Juices' },
      { id: 'soft_drinks', label: 'Soft Drinks' },
    ],
  },
  {
    id: 'packaged_foods',
    label: 'Packaged Foods',
    subcategories: [
      { id: 'canned_goods', label: 'Canned Goods' },
      { id: 'dried_foods', label: 'Dried Foods' },
      { id: 'frozen_foods', label: 'Frozen Foods' },
      { id: 'snacks', label: 'Snacks' },
    ],
  },
]
