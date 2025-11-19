'use server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://foodxtrade.com'
const LOGO_URL = `${SITE_URL}/logo-email.png`

function baseLayout(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0; padding:0; background-color:#F6F6F6; font-family:Helvetica, Arial, sans-serif; color:#0D1117;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F6F6F6; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFFFFF; border:1px solid #E2E2E2; border-radius:8px; padding:40px;">
          <!-- Logo -->
          <tr>
            <td style="padding-bottom:32px;">
              <img src="${LOGO_URL}" alt="foodXtrade" width="140" style="display:block; border:0;"/>
            </td>
          </tr>
          
          <!-- Content -->
          ${contentHtml}
          
          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #E2E2E2; padding-top:24px; margin-top:40px;">
              <p style="font-size:12px; color:#7A7A7A; line-height:1.5; margin:0 0 8px 0;">
                You are receiving this email as part of your foodXtrade account.
              </p>
              <p style="font-size:12px; color:#7A7A7A; line-height:1.5; margin:0;">
                <strong>foodXtrade</strong> — Market-Intelligent B2B Marketplace<br/>
                <a href="${SITE_URL}" style="color:#7A7A7A; text-decoration:none;">${SITE_URL}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

export function renderWelcomeEmail(dashboardUrl: string): string {
  const content = `
    <tr>
      <td style="font-size:28px; font-weight:600; color:#0D1117; padding-bottom:16px;">
        Welcome to foodXtrade
      </td>
    </tr>
    <tr>
      <td style="font-size:16px; color:#0D1117; padding-bottom:24px; line-height:1.6;">
        You've successfully created your account.<br/>
        You're now part of a verified, market-intelligent B2B ecosystem built for global food trading.
      </td>
    </tr>
    <tr>
      <td align="left" style="padding-bottom:40px;">
        <a href="${dashboardUrl}" style="display:inline-block; background:#0D1117; color:#FFFFFF; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600;">
          Go to Dashboard
        </a>
      </td>
    </tr>
  `
  return baseLayout('Welcome to foodXtrade', content)
}

export function renderSupplierOnboardingEmail(uploadProductsUrl: string): string {
  const content = `
    <tr>
      <td style="font-size:26px; font-weight:600; padding-bottom:16px; color:#0D1117;">
        Your Supplier Account is Now Active
      </td>
    </tr>
    <tr>
      <td style="font-size:16px; color:#0D1117; padding-bottom:24px; line-height:1.6;">
        Your company has completed onboarding and is now visible to verified buyers across the foodXtrade marketplace.
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:24px;">
        <div style="background:#DDE9F8; padding:20px; border-radius:6px; color:#0D1117; font-size:15px; line-height:1.6;">
          ✓ Verified Supplier Status<br/>
          Your profile now includes verification, customs data and product visibility.
        </div>
      </td>
    </tr>
    <tr>
      <td align="left" style="padding-bottom:40px;">
        <a href="${uploadProductsUrl}" style="display:inline-block; background:#0D1117; color:#FFFFFF; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600;">
          Upload Your Products
        </a>
      </td>
    </tr>
  `
  return baseLayout('Your Supplier Account is Now Active', content)
}

export function renderRfqMatchEmail(params: {
  product: string
  qty: string
  country: string
  customs: string
  rfqUrl: string
}): string {
  const content = `
    <tr>
      <td style="font-size:26px; font-weight:600; padding-bottom:16px; color:#0D1117;">
        New RFQ Match for Your Products
      </td>
    </tr>
    <tr>
      <td style="font-size:16px; padding-bottom:20px; line-height:1.6; color:#0D1117;">
        A new buyer RFQ closely matches your product categories and origin capabilities.
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:24px;">
        <div style="background:#F6F6F6; padding:20px; border-radius:6px; border:1px solid #E2E2E2; font-size:15px; line-height:1.8;">
          <strong>Product:</strong> ${params.product}<br/>
          <strong>Quantity:</strong> ${params.qty}<br/>
          <strong>Destination:</strong> ${params.country}<br/>
          <strong>Customs:</strong>
          <span style="display:inline-block; background:#3DA9FC; color:#FFFFFF; padding:3px 8px; border-radius:4px; font-size:13px; font-weight:600; text-transform:uppercase;">
            ${params.customs}
          </span>
        </div>
      </td>
    </tr>
    <tr>
      <td align="left" style="padding-bottom:40px;">
        <a href="${params.rfqUrl}" style="display:inline-block; background:#0D1117; color:#FFFFFF; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600;">
          View RFQ
        </a>
      </td>
    </tr>
  `
  return baseLayout('New RFQ Match on foodXtrade', content)
}

export function renderPasswordResetEmail(resetUrl: string): string {
  const content = `
    <tr>
      <td style="font-size:26px; font-weight:600; padding-bottom:16px; color:#0D1117;">
        Reset Your Password
      </td>
    </tr>
    <tr>
      <td style="font-size:16px; padding-bottom:24px; line-height:1.6; color:#0D1117;">
        Click the button below to reset your password.<br/>
        If you didn't request this, you can safely ignore this message.
      </td>
    </tr>
    <tr>
      <td align="left" style="padding-bottom:40px;">
        <a href="${resetUrl}" style="display:inline-block; background:#0D1117; color:#FFFFFF; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600;">
          Reset Password
        </a>
      </td>
    </tr>
  `
  return baseLayout('Reset Your Password', content)
}

export function renderSubscriptionConfirmationEmail(params: {
  plan: string
  dashboardUrl: string
}): string {
  const content = `
    <tr>
      <td style="font-size:26px; font-weight:600; padding-bottom:16px; color:#0D1117;">
        Your Subscription Is Active
      </td>
    </tr>
    <tr>
      <td style="font-size:16px; padding-bottom:24px; line-height:1.6; color:#0D1117;">
        Thank you for subscribing to the <strong>${params.plan}</strong> plan.<br/>
        Your supplier profile now receives increased visibility signals and priority RFQ matching.
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:24px;">
        <div style="background:#DDE9F8; padding:20px; border-radius:6px; font-size:15px; line-height:1.8; color:#0D1117;">
          ✓ Priority search ranking<br/>
          ✓ Higher exposure to buyers<br/>
          ✓ Enhanced analytics<br/>
          ✓ Expanded product uploads
        </div>
      </td>
    </tr>
    <tr>
      <td align="left" style="padding-bottom:40px;">
        <a href="${params.dashboardUrl}" style="display:inline-block; background:#0D1117; color:#FFFFFF; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600;">
          Go to Dashboard
        </a>
      </td>
    </tr>
  `
  return baseLayout('Your Subscription Is Active', content)
}

export function renderRfqConfirmationEmail(params: {
  product: string
  qty: string
  buyerName: string
  dashboardUrl: string
}): string {
  const content = `
    <tr>
      <td style="font-size:26px; font-weight:600; padding-bottom:16px; color:#0D1117;">
        RFQ Submitted Successfully
      </td>
    </tr>
    <tr>
      <td style="font-size:16px; padding-bottom:20px; line-height:1.6; color:#0D1117;">
        Your request for quote has been submitted and is now being matched with verified suppliers.
      </td>
    </tr>
    <tr>
      <td style="padding-bottom:24px;">
        <div style="background:#F6F6F6; padding:20px; border-radius:6px; border:1px solid #E2E2E2; font-size:15px; line-height:1.8;">
          <strong>Product:</strong> ${params.product}<br/>
          <strong>Quantity:</strong> ${params.qty}<br/>
          <strong>Buyer:</strong> ${params.buyerName}
        </div>
      </td>
    </tr>
    <tr>
      <td style="font-size:15px; padding-bottom:24px; line-height:1.6; color:#7A7A7A;">
        We'll notify you when suppliers respond to your request.
      </td>
    </tr>
    <tr>
      <td align="left" style="padding-bottom:40px;">
        <a href="${dashboardUrl}" style="display:inline-block; background:#0D1117; color:#FFFFFF; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600;">
          View Dashboard
        </a>
      </td>
    </tr>
  `
  return baseLayout('RFQ Submitted Successfully', content)
}
