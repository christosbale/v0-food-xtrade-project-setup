-- Add product_type and fresh produce columns to products table

-- Add product_type column for subcategories
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_type TEXT;

-- Add fresh produce specific columns
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS harvest_date DATE;

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS shelf_life INTEGER;

-- Add comment for documentation
COMMENT ON COLUMN products.product_type IS 'Subcategory of the product (e.g., Citrus Fruits, Tropical Fruits)';
COMMENT ON COLUMN products.harvest_date IS 'Harvest date for fresh produce';
COMMENT ON COLUMN products.shelf_life IS 'Shelf life in days from harvest date';

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category_type ON products(category, product_type);
CREATE INDEX IF NOT EXISTS idx_products_harvest_date ON products(harvest_date) WHERE harvest_date IS NOT NULL;
