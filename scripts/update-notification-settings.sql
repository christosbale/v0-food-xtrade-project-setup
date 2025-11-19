-- Ensure notification_settings table exists with proper defaults
-- This table has only one row (id=1) that controls global email toggles

-- Insert default row if it doesn't exist
INSERT INTO notification_settings (
  id,
  email_welcome_enabled,
  email_supplier_onboarding_enabled,
  email_rfq_match_enabled,
  email_subscription_enabled,
  email_password_reset_enabled,
  email_product_updates_enabled,
  email_platform_news_enabled
)
VALUES (
  1,
  true,
  true,
  true,
  true,
  true,
  true,
  false
)
ON CONFLICT (id) DO NOTHING;

-- Add comment to table
COMMENT ON TABLE notification_settings IS 'Global email notification settings. Single row with id=1 acts as kill-switch for all emails.';
