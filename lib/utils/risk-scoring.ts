export interface RiskScoreResult {
  score: number
  category: 'low' | 'medium' | 'high'
  categoryLabel: string
  factors: {
    factor: string
    impact: number
    description: string
  }[]
}

export function computeRiskScore(company: {
  website_url?: string | null
  company_address?: string | null
  vat_number?: string | null
  verification_documents?: any
  verification_status?: string | null
}): RiskScoreResult {
  let score = 50 // Base score
  const factors: RiskScoreResult['factors'] = []

  // Website URL checks
  if (!company.website_url) {
    score -= 10
    factors.push({
      factor: 'No website',
      impact: -10,
      description: 'Company website not provided'
    })
  }

  // Address check
  if (!company.company_address) {
    score -= 10
    factors.push({
      factor: 'No address',
      impact: -10,
      description: 'Company address not provided'
    })
  }

  // VAT number checks
  if (!company.vat_number) {
    score -= 15
    factors.push({
      factor: 'No VAT number',
      impact: -15,
      description: 'VAT number not provided'
    })
  } else if (!isValidVATFormat(company.vat_number)) {
    score -= 10
    factors.push({
      factor: 'Invalid VAT format',
      impact: -10,
      description: 'VAT number format appears invalid'
    })
  }

  // Verification documents check
  const docs = company.verification_documents || {}
  const docCount = Object.keys(docs).length

  if (docCount === 0) {
    score -= 20
    factors.push({
      factor: 'No documents',
      impact: -20,
      description: 'No verification documents uploaded'
    })
  } else if (docCount >= 1) {
    score += 10
    factors.push({
      factor: 'Documents uploaded',
      impact: +10,
      description: `${docCount} verification document(s) uploaded`
    })
  }

  // Verification status check
  if (company.verification_status === 'verified') {
    score += 20
    factors.push({
      factor: 'Verified status',
      impact: +20,
      description: 'Company has been verified by admin'
    })
  }

  // Clamp score between 0 and 100
  score = Math.max(0, Math.min(100, score))

  // Determine risk category
  let category: 'low' | 'medium' | 'high'
  let categoryLabel: string

  if (score >= 71) {
    category = 'low'
    categoryLabel = 'Low Risk / Trusted Supplier'
  } else if (score >= 41) {
    category = 'medium'
    categoryLabel = 'Medium Risk'
  } else {
    category = 'high'
    categoryLabel = 'High Risk'
  }

  return {
    score,
    category,
    categoryLabel,
    factors
  }
}

// Basic VAT format validation
function isValidVATFormat(vat: string): boolean {
  // Remove spaces and convert to uppercase
  const cleanVAT = vat.replace(/\s/g, '').toUpperCase()
  
  // Basic check: should start with 2 letters (country code) followed by numbers
  // This is a simplified check - real VAT validation would be more complex
  const vatPattern = /^[A-Z]{2}[0-9A-Z]{2,12}$/
  
  return vatPattern.test(cleanVAT)
}

export function getRiskCategoryColor(category: 'low' | 'medium' | 'high'): string {
  const colors = {
    low: 'bg-green-500/10 text-green-700 border-green-500/30',
    medium: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30',
    high: 'bg-red-500/10 text-red-700 border-red-500/30'
  }
  return colors[category]
}
