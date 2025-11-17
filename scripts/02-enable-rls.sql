-- Enable Row Level Security on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Companies RLS Policies
CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own company"
  ON companies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own company"
  ON companies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Products RLS Policies
CREATE POLICY "Published products are viewable by everyone"
  ON products FOR SELECT
  USING (status = 'published' OR company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  ));

CREATE POLICY "Suppliers can insert their own products"
  ON products FOR INSERT
  WITH CHECK (company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  ));

CREATE POLICY "Suppliers can update their own products"
  ON products FOR UPDATE
  USING (company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  ));

CREATE POLICY "Suppliers can delete their own products"
  ON products FOR DELETE
  USING (company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  ));

-- RFQs RLS Policies
CREATE POLICY "Suppliers can view their own RFQs"
  ON rfqs FOR SELECT
  USING (supplier_company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  ));

CREATE POLICY "Anyone can insert RFQs"
  ON rfqs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Suppliers can update their own RFQs"
  ON rfqs FOR UPDATE
  USING (supplier_company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  ));

-- Documents RLS Policies
CREATE POLICY "Users can view their own documents"
  ON documents FOR SELECT
  USING (company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own documents"
  ON documents FOR INSERT
  WITH CHECK (company_id IN (
    SELECT id FROM companies WHERE user_id = auth.uid()
  ));

-- Product Images RLS Policies
CREATE POLICY "Product images are viewable by everyone for published products"
  ON product_images FOR SELECT
  USING (product_id IN (
    SELECT id FROM products WHERE status = 'published'
  ) OR product_id IN (
    SELECT id FROM products WHERE company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Suppliers can manage their product images"
  ON product_images FOR ALL
  USING (product_id IN (
    SELECT id FROM products WHERE company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  ));
