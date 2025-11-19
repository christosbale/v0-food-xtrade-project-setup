import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json()
    
    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/verify?token=${token}`
    
    await sendEmail({
      to: email,
      subject: 'Verify Your foodXtrade Account',
      html: await renderVerificationEmail(verificationUrl)
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Verification email error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send verification email' },
      { status: 500 }
    )
  }
}

async function renderVerificationEmail(verifyUrl: string): Promise<string> {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://foodxtrade.com'
  const LOGO_URL = `${SITE_URL}/logo-email.png`
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Account</title>
</head>
<body style="margin:0; padding:0; background-color:#F6F6F6; font-family:Helvetica, Arial, sans-serif; color:#0D1117;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F6F6F6; padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#FFFFFF; border:1px solid #E2E2E2; border-radius:8px; padding:40px;">
          <tr>
            <td style="padding-bottom:32px;">
              <img src="${LOGO_URL}" alt="foodXtrade" width="140" style="display:block; border:0;"/>
            </td>
          </tr>
          <tr>
            <td style="font-size:26px; font-weight:600; padding-bottom:16px; color:#0D1117;">
              Verify Your Email Address
            </td>
          </tr>
          <tr>
            <td style="font-size:16px; padding-bottom:24px; line-height:1.6; color:#0D1117;">
              Thank you for signing up with foodXtrade. Please click the button below to verify your email address and activate your account.
            </td>
          </tr>
          <tr>
            <td align="left" style="padding-bottom:24px;">
              <a href="${verifyUrl}" style="display:inline-block; background:#0D1117; color:#FFFFFF; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:600;">
                Verify Email Address
              </a>
            </td>
          </tr>
          <tr>
            <td style="font-size:14px; padding-bottom:16px; line-height:1.6; color:#7A7A7A;">
              If the button doesn't work, copy and paste this link into your browser:
            </td>
          </tr>
          <tr>
            <td style="font-size:13px; padding-bottom:40px; line-height:1.6; color:#3DA9FC; word-break:break-all;">
              ${verifyUrl}
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #E2E2E2; padding-top:24px;">
              <p style="font-size:12px; color:#7A7A7A; line-height:1.5; margin:0 0 8px 0;">
                You are receiving this email because you signed up for a foodXtrade account.
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
