-- Insert sample companies
INSERT INTO companies (id, company_name, company_type, business_email, phone, country, address, city, verification_status, subscription_tier)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Mediterranean Exports Ltd', 'supplier', 'info@medexports.gr', '+30 210 1234567', 'Greece', '123 Olive Street', 'Athens', 'verified', 'pro'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Ethiopian Coffee Co', 'supplier', 'sales@ethcoffee.et', '+251 11 551234', 'Ethiopia', '45 Coffee Avenue', 'Addis Ababa', 'verified', 'premium'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Spanish Organic Foods', 'supplier', 'contact@spanishorganic.es', '+34 91 123 4567', 'Spain', '78 Valencia Road', 'Valencia', 'verified', 'pro');

-- Insert sample products
INSERT INTO products (company_id, product_name, category, origin_country, price_per_unit, unit, available_quantity, min_order_quantity, incoterm, customs_status, crop_year, packaging, certifications, status)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'Extra Virgin Olive Oil', 'Oils & Fats', 'Greece', 8.50, 'kg', 5000, 100, 'FOB', 'EU cleared', '2024', 'Glass bottles', ARRAY['Organic', 'PDO'], 'published'),
  ('550e8400-e29b-41d4-a716-446655440000', 'Kalamata Olives', 'Vegetables', 'Greece', 12.00, 'kg', 2000, 50, 'CIF', 'EU cleared', '2024', 'Vacuum sealed', ARRAY['Organic'], 'published'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Arabica Coffee Beans', 'Beverages', 'Ethiopia', 15.00, 'kg', 10000, 500, 'FOB', 'Not cleared', '2024', '60kg jute bags', ARRAY['Fair Trade', 'Organic'], 'published'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Organic Tomatoes', 'Vegetables', 'Spain', 2.50, 'kg', 8000, 200, 'DDP', 'EU cleared', '2024', 'Cardboard boxes', ARRAY['Organic', 'GlobalGAP'], 'published'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Spanish Almonds', 'Nuts & Seeds', 'Spain', 18.00, 'kg', 3000, 100, 'FOB', 'EU cleared', '2024', '25kg bags', ARRAY['Organic'], 'published');

-- Insert sample RFQs
INSERT INTO rfqs (product_id, supplier_company_id, buyer_company_name, buyer_email, buyer_country, desired_quantity, unit, target_price, preferred_incoterm, message, status)
VALUES 
  ((SELECT id FROM products WHERE product_name = 'Arabica Coffee Beans'), '550e8400-e29b-41d4-a716-446655440001', 'European Coffee Roasters', 'procurement@eurocoffee.com', 'Germany', 2000, 'kg', 14.00, 'CIF', 'Interested in monthly supply of 2MT. Please provide best price.', 'new'),
  ((SELECT id FROM products WHERE product_name = 'Extra Virgin Olive Oil'), '550e8400-e29b-41d4-a716-446655440000', 'UK Food Distributors', 'orders@ukfood.co.uk', 'United Kingdom', 500, 'kg', 8.00, 'DDP', 'Need samples and quotation for UK delivery.', 'replied');
