'use server'

import { Resend } from 'resend'
import {
  renderWelcomeEmail,
  renderSupplierOnboardingEmail,
  renderRfqMatchEmail,
  renderPasswordResetEmail,
  renderSubscriptionConfirmationEmail,
  renderRfqConfirmationEmail,
} from './emailTemplates'

const resend = new Resend(process.env.RESEND_API_KEY)
const EMAIL_FROM = process.env.EMAIL_FROM || 'FoodXtrade <no-reply@foodxtrade.com>'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://foodxtrade.com'

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: [to],
      subject: subject,
      html: html,
    })

    if (error) {
      console.error('[v0] Email send error:', error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[v0] Email send exception:', error)
    return { error: 'Failed to send email' }
  }
}

export async function sendWelcomeEmail(email: string, userType: 'buyer' | 'supplier') {
  const dashboardUrl = userType === 'supplier' 
    ? `${SITE_URL}/dashboard`
    : `${SITE_URL}/products`
  
  const html = renderWelcomeEmail(dashboardUrl)
  return sendEmail(email, 'Welcome to foodXtrade', html)
}

export async function sendSupplierOnboardingCompleteEmail(
  email: string,
  companyName: string,
  plan: string
) {
  const uploadProductsUrl = `${SITE_URL}/dashboard/products`
  const html = renderSupplierOnboardingEmail(uploadProductsUrl)
  return sendEmail(email, 'Your Supplier Account is Now Active', html)
}

export async function sendRFQMatchNotificationEmail(
  email: string,
  params: {
    product: string
    qty: string
    country: string
    customs: string
    rfqId: string
  }
) {
  const rfqUrl = `${SITE_URL}/dashboard/rfqs?id=${params.rfqId}`
  const html = renderRfqMatchEmail({
    product: params.product,
    qty: params.qty,
    country: params.country,
    customs: params.customs,
    rfqUrl,
  })
  return sendEmail(email, 'New RFQ Match on foodXtrade', html)
}

export async function sendRFQConfirmationEmail(
  email: string,
  params: {
    product: string
    qty: string
    buyerName: string
  }
) {
  const dashboardUrl = `${SITE_URL}/dashboard/rfqs`
  const html = renderRfqConfirmationEmail({
    product: params.product,
    qty: params.qty,
    buyerName: params.buyerName,
    dashboardUrl,
  })
  return sendEmail(email, 'RFQ Submitted Successfully', html)
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
  const resetUrl = `${SITE_URL}/reset-password?token=${resetToken}`
  const html = renderPasswordResetEmail(resetUrl)
  return sendEmail(email, 'Reset Your Password', html)
}

export async function sendSubscriptionConfirmationEmail(
  email: string,
  plan: string
) {
  const dashboardUrl = `${SITE_URL}/dashboard`
  const html = renderSubscriptionConfirmationEmail({
    plan,
    dashboardUrl,
  })
  return sendEmail(email, 'Your Subscription Is Active', html)
}
