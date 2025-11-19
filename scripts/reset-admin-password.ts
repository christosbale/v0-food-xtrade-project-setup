// Script to reset admin password
// Run this from the scripts folder or via API

const ADMIN_EMAIL = 'balesdravos@gmail.com'
const NEW_PASSWORD = 'test123!@#'

async function resetPassword() {
  try {
    const response = await fetch('http://localhost:3000/api/admin/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: ADMIN_EMAIL,
        password: NEW_PASSWORD,
      }),
    })

    const data = await response.json()
    
    if (response.ok) {
      console.log('✓ Password reset successful!')
      console.log(`Email: ${ADMIN_EMAIL}`)
      console.log(`New password: ${NEW_PASSWORD}`)
    } else {
      console.error('✗ Password reset failed:', data.error)
      if (data.details) {
        console.error('Details:', data.details)
      }
    }
  } catch (error) {
    console.error('✗ Error:', error)
  }
}

resetPassword()
