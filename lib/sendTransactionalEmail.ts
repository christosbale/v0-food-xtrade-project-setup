'use server'

import { sendEmail } from './email'
import { shouldSendEmail, NotificationType } from './notifications'
import {
  renderWelcomeEmail,
  renderSupplierOnboardingEmail,
  renderRfqMatchEmail,
  renderPasswordResetEmail,
  renderSubscriptionConfirmationEmail,
  renderRfqConfirmationEmail,
} from './emailTemplates'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://foodxtrade.com'

interface SendTransactionalPayload {
  user: { id: string; email: string }
  type: NotificationType
  data?: any // type-specific payload
}

/**
 * High-level email helper that checks user notification preferences before sending
 * Use this instead of calling sendEmail directly
 */
export async function sendTransactionalEmail({
  user,
  type,
  data,
}: SendTransactionalPayload) {
  // Check if user has opted in to receive this type of email
  const ok = await shouldSendEmail(user.id, type)
  if (!ok) {
    console.log(`[v0] Email not sent to ${user.email} - user preferences disabled for type: ${type}`)
    return { success: false, reason: 'user_preferences_disabled' }
  }

  let subject = ''
  let html = ''

  switch (type) {
    case 'welcome':
      subject = 'Welcome to foodXtrade'
      html = renderWelcomeEmail(`${SITE_URL}/dashboard`)
      break

    case 'supplier_onboarding':
      subject = 'Your Supplier Account is Now Active'
      html = renderSupplierOnboardingEmail(`${SITE_URL}/dashboard/products`)
      break

    case 'rfq_match':
      subject = 'New RFQ Match on foodXtrade'
      html = renderRfqMatchEmail({
        product: data?.product || 'Commodity',
        qty: data?.qty || '',
        country: data?.country || '',
        customs: data?.customs || '',
        rfqUrl: data?.rfqUrl || `${SITE_URL}/dashboard/rfqs`,
      })
      break

    case 'subscription':
      subject = 'Your Subscription Is Active'
      html = renderSubscriptionConfirmationEmail({
        plan: data?.plan || 'Supplier plan',
        dashboardUrl: `${SITE_URL}/dashboard`,
      })
      break

    case 'password_reset':
      subject = 'Reset Your Password'
      html = renderPasswordResetEmail(data?.resetUrl || `${SITE_URL}/reset-password`)
      break

    case 'product_updates':
    case 'platform_news':
      // These can be wired up later when needed
      console.log(`[v0] Email type ${type} not yet implemented`)
      return { success: false, reason: 'not_implemented' }

    default:
      console.log(`[v0] Unknown email type: ${type}`)
      return { success: false, reason: 'unknown_type' }
  }

  // Send the email
  const result = await sendEmail(user.email, subject, html)
  return result
}

/**
 * Helper for RFQ confirmation emails (sent to buyers)
 * This doesn't require user preferences check as it's a transactional confirmation
 */
export async function sendRfqConfirmationTransactional(params: {
  userEmail: string
  product: string
  qty: string
  buyerName: string
}) {
  const subject = 'RFQ Submitted Successfully'
  const html = renderRfqConfirmationEmail({
    product: params.product,
    qty: params.qty,
    buyerName: params.buyerName,
    dashboardUrl: `${SITE_URL}/dashboard/rfqs`,
  })

  return sendEmail(params.userEmail, subject, html)
}
