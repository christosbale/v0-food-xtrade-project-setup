-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table (suppliers and buyers)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_type TEXT NOT NULL CHECK (company_type IN ('supplier', 'buyer')),
  business_email TEXT NOT NULL UNIQUE,
  phone TEXT,
  country TEXT NOT NULL,
  address TEXT,
  city TEXT,
  postal_code TEXT,
  website TEXT,
  business_registration_number TEXT,
  tax_id TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_notes TEXT,
  subscription_tier TEXT DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'pro', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT NOT NULL,
  origin_country TEXT NOT NULL,
  price_per_unit DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('kg', 'MT', 'ton', 'lbs')),
  available_quantity DECIMAL(10, 2) NOT NULL,
  min_order_quantity DECIMAL(10, 2),
  incoterm TEXT CHECK (incoterm IN ('EXW', 'FOB', 'CIF', 'DDP', 'FCA', 'CPT')),
  customs_status TEXT CHECK (customs_status IN ('EU cleared', 'US cleared', 'Not cleared')),
  crop_year TEXT,
  packaging TEXT,
  certifications TEXT[], -- Array of certifications
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RFQs (Request for Quotes) table
CREATE TABLE IF NOT EXISTS rfqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  supplier_company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  buyer_company_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_country TEXT NOT NULL,
  desired_quantity DECIMAL(10, 2) NOT NULL,
  unit TEXT NOT NULL,
  target_price DECIMAL(10, 2),
  preferred_incoterm TEXT,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table (for company verification documents)
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('business_license', 'tax_certificate', 'food_safety', 'export_license', 'other')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_rfqs_supplier_company ON rfqs(supplier_company_id);
CREATE INDEX IF NOT EXISTS idx_rfqs_status ON rfqs(status);
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_verification_status ON companies(verification_status);
