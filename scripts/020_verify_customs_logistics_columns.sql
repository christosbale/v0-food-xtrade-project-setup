-- Verify and add any missing customs & logistics columns
-- This script is idempotent and safe to run multiple times

-- Ensure customs_status column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'customs_status'
  ) THEN
    ALTER TABLE public.products ADD COLUMN customs_status TEXT;
  END IF;
END $$;

-- Ensure warehouse_country column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'warehouse_country'
  ) THEN
    ALTER TABLE public.products ADD COLUMN warehouse_country TEXT;
  END IF;
END $$;

-- Ensure warehouse_city column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'warehouse_city'
  ) THEN
    ALTER TABLE public.products ADD COLUMN warehouse_city TEXT;
  END IF;
END $$;

-- Ensure warehouse_type column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'warehouse_type'
  ) THEN
    ALTER TABLE public.products ADD COLUMN warehouse_type TEXT;
  END IF;
END $$;

-- Ensure min_order_unit column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'min_order_unit'
  ) THEN
    ALTER TABLE public.products ADD COLUMN min_order_unit TEXT;
  END IF;
END $$;

-- Ensure logistics_notes column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'products' 
    AND column_name = 'logistics_notes'
  ) THEN
    ALTER TABLE public.products ADD COLUMN logistics_notes TEXT;
  END IF;
END $$;

-- Add index on customs_status for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_customs_status 
ON public.products(customs_status);

-- Add index on warehouse_country for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_warehouse_country 
ON public.products(warehouse_country);

-- Verification query
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'products'
  AND column_name IN (
    'customs_status',
    'warehouse_country',
    'warehouse_city',
    'warehouse_type',
    'min_order_unit',
    'logistics_notes'
  )
ORDER BY column_name;
