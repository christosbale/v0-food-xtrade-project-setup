-- Add currency support with EUR as base currency
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'EUR' CHECK (currency IN ('EUR', 'USD'));

-- Add index for currency queries
CREATE INDEX IF NOT EXISTS idx_products_currency ON products(currency);

-- Add currency preference to companies
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'EUR' CHECK (preferred_currency IN ('EUR', 'USD'));

-- Add comment for documentation
COMMENT ON COLUMN products.currency IS 'Product pricing currency - EUR (base) or USD';
COMMENT ON COLUMN companies.preferred_currency IS 'Company preferred display currency - EUR (base) or USD';
