import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { email, plan, companyName } = await request.json()

    if (!email || !plan || !companyName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const planDetails: Record<string, { price: string; features: string[] }> = {
      basic: {
        price: '€49/month',
        features: ['List up to 50 products', 'Respond to RFQs', 'Basic supplier tools'],
      },
      pro: {
        price: '€99/month',
        features: ['Unlimited products', 'Advanced analytics', 'Priority support'],
      },
      premium: {
        price: '€199/month',
        features: ['Dedicated account manager', 'API access', 'Custom integrations'],
      },
    }

    const selectedPlan = planDetails[plan as keyof typeof planDetails]

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@foodxtrade.com',
      to: email,
      subject: `Welcome to ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan - Start Selling Today!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0D1117; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <h1 style="color: #0D1117; font-size: 28px; margin-bottom: 20px;">🎉 You're Now a Supplier!</h1>
              
              <p style="font-size: 16px; margin-bottom: 20px;">Hi ${companyName},</p>
              
              <p style="font-size: 16px; margin-bottom: 20px;">
                Congratulations on upgrading to the <strong>${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan</strong>! 
                You can now start listing your products and reaching buyers worldwide.
              </p>

              <div style="background-color: #F6F6F6; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h2 style="color: #0D1117; font-size: 20px; margin-top: 0;">Your Plan Details</h2>
                <p style="margin: 10px 0;"><strong>Plan:</strong> ${plan.charAt(0).toUpperCase() + plan.slice(1)}</p>
                <p style="margin: 10px 0;"><strong>Price:</strong> ${selectedPlan.price}</p>
                <h3 style="color: #0D1117; font-size: 16px; margin-top: 20px; margin-bottom: 10px;">Included Features:</h3>
                <ul style="margin: 0; padding-left: 20px;">
                  ${selectedPlan.features.map(f => `<li style="margin: 8px 0;">${f}</li>`).join('')}
                </ul>
              </div>

              <div style="margin: 30px 0;">
                <h2 style="color: #0D1117; font-size: 20px; margin-bottom: 15px;">Next Steps</h2>
                <ol style="margin: 0; padding-left: 20px;">
                  <li style="margin: 10px 0;">Add your first product to the marketplace</li>
                  <li style="margin: 10px 0;">Complete your company profile</li>
                  <li style="margin: 10px 0;">Start responding to RFQs from buyers</li>
                </ol>
              </div>

              <div style="text-align: center; margin: 40px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/products/new" 
                   style="display: inline-block; background-color: #0D1117; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Add Your First Product
                </a>
              </div>

              <p style="font-size: 14px; color: #7A7A7A; margin-top: 40px;">
                Questions? Reply to this email or contact our support team at support@foodxtrade.com
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('[v0] Upgrade notification email failed:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[v0] Upgrade notification route error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send upgrade notification' },
      { status: 500 }
    )
  }
}
