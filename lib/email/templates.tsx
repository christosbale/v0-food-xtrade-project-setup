interface SupplierWelcomeEmailProps {
  companyName: string
  plan: string
  dashboardUrl: string
}

export function getSupplierWelcomeEmail({ companyName, plan, dashboardUrl }: SupplierWelcomeEmailProps) {
  const planBenefits = {
    basic: ['Product listings', 'RFQ management', '7-day market insights'],
    pro: ['Everything in Basic', 'AI supplier matching', '30-day market insights', 'Advanced analytics'],
    premium: ['Everything in Pro', 'Full market intelligence', 'Priority support', 'Custom integrations'],
  }

  const benefits = planBenefits[plan as keyof typeof planBenefits] || planBenefits.basic

  return {
    subject: `Welcome to foodXtrade, ${companyName}!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Universal Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #0D1117; background-color: #F6F6F6; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F6F6F6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E2E2E2; border-radius: 6px;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #0D1117; letter-spacing: -0.02em;">
                Welcome to foodXtrade
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0 0 24px; font-size: 16px; color: #0D1117;">
                Hi ${companyName},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; color: #0D1117;">
                Your <strong style="color: #3DA9FC;">${plan.charAt(0).toUpperCase() + plan.slice(1)}</strong> supplier account is now active on foodXtrade, the market-intelligent B2B food marketplace.
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; color: #0D1117;">
                You now have access to:
              </p>
              <ul style="margin: 0 0 24px; padding-left: 20px;">
                ${benefits.map(benefit => `<li style="margin-bottom: 8px; color: #0D1117;">${benefit}</li>`).join('')}
              </ul>
              
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td style="background-color: #0D1117; border-radius: 6px; padding: 14px 28px;">
                    <a href="${dashboardUrl}" style="color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; letter-spacing: -0.01em;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 14px; color: #7A7A7A;">
                Next steps: Complete your company profile, add products, and start receiving verified RFQs from global buyers.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #E2E2E2; background-color: #F6F6F6;">
              <p style="margin: 0; font-size: 12px; color: #7A7A7A; text-align: center;">
                foodXtrade • Market-Intelligent B2B Marketplace
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }
}

interface RFQConfirmationEmailProps {
  buyerCompanyName: string
  productName: string
  supplierName: string
  quantity: number
  unit: string
}

export function getRFQConfirmationEmail({ 
  buyerCompanyName, 
  productName, 
  supplierName,
  quantity,
  unit 
}: RFQConfirmationEmailProps) {
  return {
    subject: `RFQ Submitted: ${productName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Universal Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #0D1117; background-color: #F6F6F6; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F6F6F6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E2E2E2; border-radius: 6px;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px;">
              <div style="width: 48px; height: 48px; background-color: #DDE9F8; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
                <span style="font-size: 24px;">✓</span>
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #0D1117; letter-spacing: -0.02em;">
                RFQ Submitted Successfully
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0 0 24px; font-size: 16px; color: #0D1117;">
                Hi ${buyerCompanyName},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; color: #0D1117;">
                Your Request for Quote has been sent to <strong>${supplierName}</strong>.
              </p>
              
              <!-- RFQ Details -->
              <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #F6F6F6; border: 1px solid #E2E2E2; border-radius: 6px; margin: 24px 0;">
                <tr>
                  <td style="font-size: 14px; color: #7A7A7A;">Product</td>
                  <td style="font-size: 14px; color: #0D1117; font-weight: 600; text-align: right;">${productName}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #7A7A7A; border-top: 1px solid #E2E2E2; padding-top: 12px;">Quantity</td>
                  <td style="font-size: 14px; color: #0D1117; font-weight: 600; text-align: right; border-top: 1px solid #E2E2E2; padding-top: 12px;">${quantity} ${unit}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #7A7A7A; border-top: 1px solid #E2E2E2; padding-top: 12px;">Supplier</td>
                  <td style="font-size: 14px; color: #0D1117; font-weight: 600; text-align: right; border-top: 1px solid #E2E2E2; padding-top: 12px;">${supplierName}</td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 14px; color: #7A7A7A;">
                The supplier will review your request and respond directly to your email. Typical response time: 24-48 hours.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #E2E2E2; background-color: #F6F6F6;">
              <p style="margin: 0; font-size: 12px; color: #7A7A7A; text-align: center;">
                foodXtrade • Market-Intelligent B2B Marketplace
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }
}

interface RFQNotificationToSupplierProps {
  supplierName: string
  buyerCompanyName: string
  buyerCountry: string
  productName: string
  quantity: number
  unit: string
  message: string
  dashboardUrl: string
}

export function getRFQNotificationToSupplierEmail({
  supplierName,
  buyerCompanyName,
  buyerCountry,
  productName,
  quantity,
  unit,
  message,
  dashboardUrl,
}: RFQNotificationToSupplierProps) {
  return {
    subject: `New RFQ: ${buyerCompanyName} requests ${productName}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Universal Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #0D1117; background-color: #F6F6F6; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F6F6F6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; border: 1px solid #E2E2E2; border-radius: 6px;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 32px;">
              <div style="display: inline-block; background-color: #3DA9FC; color: white; padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 16px;">
                NEW RFQ
              </div>
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #0D1117; letter-spacing: -0.02em;">
                New Quote Request
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <p style="margin: 0 0 24px; font-size: 16px; color: #0D1117;">
                Hi ${supplierName},
              </p>
              <p style="margin: 0 0 24px; font-size: 16px; color: #0D1117;">
                You have a new quote request from <strong>${buyerCompanyName}</strong> (${buyerCountry}).
              </p>
              
              <!-- RFQ Details -->
              <table width="100%" cellpadding="12" cellspacing="0" style="background-color: #F6F6F6; border: 1px solid #E2E2E2; border-radius: 6px; margin: 24px 0;">
                <tr>
                  <td style="font-size: 14px; color: #7A7A7A;">Product</td>
                  <td style="font-size: 14px; color: #0D1117; font-weight: 600; text-align: right;">${productName}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #7A7A7A; border-top: 1px solid #E2E2E2; padding-top: 12px;">Quantity</td>
                  <td style="font-size: 14px; color: #0D1117; font-weight: 600; text-align: right; border-top: 1px solid #E2E2E2; padding-top: 12px;">${quantity} ${unit}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #7A7A7A; border-top: 1px solid #E2E2E2; padding-top: 12px;">Buyer</td>
                  <td style="font-size: 14px; color: #0D1117; font-weight: 600; text-align: right; border-top: 1px solid #E2E2E2; padding-top: 12px;">${buyerCompanyName}</td>
                </tr>
              </table>
              
              <div style="background-color: #DDE9F8; padding: 16px; border-radius: 6px; margin: 24px 0;">
                <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #7A7A7A; letter-spacing: 0.05em;">
                  BUYER MESSAGE
                </p>
                <p style="margin: 0; font-size: 14px; color: #0D1117; line-height: 1.6;">
                  ${message}
                </p>
              </div>
              
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td style="background-color: #0D1117; border-radius: 6px; padding: 14px 28px;">
                    <a href="${dashboardUrl}" style="color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block; letter-spacing: -0.01em;">
                      View & Respond
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 24px 0 0; font-size: 14px; color: #7A7A7A;">
                Respond quickly to increase your chances of winning this opportunity.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #E2E2E2; background-color: #F6F6F6;">
              <p style="margin: 0; font-size: 12px; color: #7A7A7A; text-align: center;">
                foodXtrade • Market-Intelligent B2B Marketplace
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }
}
