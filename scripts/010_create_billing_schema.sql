-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  features JSONB NOT NULL,
  products_limit INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscription history table
CREATE TABLE IF NOT EXISTS subscription_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  card_last_four TEXT NOT NULL,
  card_brand TEXT NOT NULL,
  expiry_month INTEGER NOT NULL,
  expiry_year INTEGER NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  subscription_history_id UUID REFERENCES subscription_history(id),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('paid', 'pending', 'failed')),
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read)
CREATE POLICY "subscription_plans_select_all" ON subscription_plans
  FOR SELECT USING (true);

-- RLS Policies for subscription_history
CREATE POLICY "subscription_history_select_own" ON subscription_history
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "subscription_history_insert_own" ON subscription_history
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for payment_methods
CREATE POLICY "payment_methods_select_own" ON payment_methods
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "payment_methods_insert_own" ON payment_methods
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "payment_methods_update_own" ON payment_methods
  FOR UPDATE USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "payment_methods_delete_own" ON payment_methods
  FOR DELETE USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- RLS Policies for invoices
CREATE POLICY "invoices_select_own" ON invoices
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, price, features, products_limit) VALUES
  ('free', 'Free', 0, '["Up to 5 products", "Basic RFQ responses", "Email support", "Basic analytics"]', 5),
  ('basic', 'Basic', 50, '["Up to 20 products", "Basic RFQ responses", "Email support", "Basic analytics"]', 20),
  ('pro', 'Pro', 150, '["Up to 100 products", "Unlimited RFQ responses", "Priority email support", "Advanced analytics", "Custom branding", "API access"]', 100),
  ('premium', 'Premium', 300, '["Unlimited products", "Unlimited RFQ responses", "24/7 phone support", "Enterprise analytics", "Custom branding", "API access", "Dedicated account manager", "Custom integrations"]', NULL)
ON CONFLICT (id) DO NOTHING;
