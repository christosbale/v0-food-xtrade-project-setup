import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'

export async function POST(request: NextRequest) {
  try {
    console.log('[v0] AI Match RFQ: Starting request')
    
    const body = await request.json()
    const { rfqId } = body

    if (!rfqId) {
      return NextResponse.json(
        { error: 'rfqId is required' },
        { status: 400 }
      )
    }

    console.log('[v0] AI Match RFQ: Fetching RFQ data for ID:', rfqId)
    
    const supabase = await createClient()

    const { data: rfq, error: rfqError } = await supabase
      .from('rfqs')
      .select('*')
      .eq('id', rfqId)
      .single()

    if (rfqError || !rfq) {
      console.error('[v0] AI Match RFQ: RFQ fetch error:', rfqError)
      return NextResponse.json(
        { error: 'RFQ not found' },
        { status: 404 }
      )
    }

    console.log('[v0] AI Match RFQ: RFQ data fetched successfully')
    console.log('[v0] AI Match RFQ: Fetching active suppliers and their products')

    const { data: companies, error: companiesError } = await supabase
      .from('companies')
      .select('*')
      .eq('company_type', 'supplier')
      .eq('verification_status', 'verified')

    if (companiesError) {
      console.error('[v0] AI Match RFQ: Companies fetch error:', companiesError)
      return NextResponse.json(
        { error: 'Failed to fetch suppliers' },
        { status: 500 }
      )
    }

    console.log('[v0] AI Match RFQ: Found', companies?.length || 0, 'verified suppliers')

    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('status', 'published')
      .in('company_id', companies?.map(c => c.id) || [])

    if (productsError) {
      console.error('[v0] AI Match RFQ: Products fetch error:', productsError)
    }

    console.log('[v0] AI Match RFQ: Found', products?.length || 0, 'published products')

    const suppliers = companies?.map(company => {
      const companyProducts = products?.filter(p => p.company_id === company.id) || []
      
      return {
        company_id: company.id,
        company_name: company.company_name,
        country: company.country,
        verification_status: company.verification_status,
        verification_level: company.verification_level,
        risk_score: company.risk_score,
        products: companyProducts.map(p => ({
          id: p.id,
          product_name: p.product_name,
          category: p.category,
          product_type: p.product_type,
          origin_country: p.origin_country,
          price_per_unit: p.price_per_unit,
          currency: p.currency,
          min_order_quantity: p.min_order_quantity,
          min_order_unit: p.min_order_unit,
          customs_status: p.customs_status,
          incoterm: p.incoterm,
          warehouse_country: p.warehouse_country,
          certifications: p.certifications,
          packaging: p.packaging,
          cartons_per_pallet: p.cartons_per_pallet,
          pallet_type: p.pallet_type,
        }))
      }
    }) || []

    console.log('[v0] AI Match RFQ: Prepared', suppliers.length, 'suppliers with products for AI analysis')

    const prompt = `You are an AI assistant for a B2B food trading platform. Your task is to analyze an RFQ (Request for Quote) and recommend the best matching suppliers based on their products and company profile.

RFQ Details:
- Desired Quantity: ${rfq.desired_quantity} ${rfq.unit}
- Target Price: ${rfq.target_price ? `${rfq.target_price} ${rfq.currency || 'EUR'}` : 'Not specified'}
- Category: ${rfq.target_category || 'Not specified'}
- Subcategory: ${rfq.target_subcategory || 'Not specified'}
- Origin Country: ${rfq.target_country || 'Any'}
- Customs Status: ${rfq.target_customs_status || 'Any'}
- Packaging: ${rfq.target_packaging || 'Any'}
- Preferred Incoterm: ${rfq.preferred_incoterm || 'Not specified'}
- Target MOQ: ${rfq.target_moq ? `${rfq.target_moq} ${rfq.target_moq_unit}` : 'Not specified'}
- Buyer Country: ${rfq.buyer_country || 'Not specified'}
- Message: ${rfq.message || 'None'}

Available Suppliers:
${JSON.stringify(suppliers, null, 2)}

Instructions:
1. Analyze each supplier based on:
   - Product category and subcategory match
   - Origin country preference
   - Customs status compatibility
   - MOQ requirements vs desired quantity
   - Price competitiveness (if target price specified)
   - Verification status and level (higher is better)
   - Risk score (lower is better, 0-100 scale)
   - Certifications and quality standards
   - Packaging and logistics capabilities
   - Warehouse location relative to buyer country

2. Score each supplier from 0-100 where:
   - 90-100: Excellent match (perfect fit for all major requirements)
   - 75-89: Very good match (meets most requirements well)
   - 60-74: Good match (meets basic requirements)
   - 40-59: Fair match (some requirements met)
   - 0-39: Poor match (minimal requirements met)

3. Provide a clear, concise explanation (2-3 sentences) for each score focusing on:
   - Why this supplier is a good/bad match
   - Key strengths or weaknesses
   - Any red flags or standout features

4. Return ONLY suppliers with a score of 40 or higher, ranked by score (highest first).

5. Return your response as a valid JSON object with this exact structure:
{
  "recommendations": [
    {
      "supplier_id": "uuid-here",
      "score": 85,
      "explanation": "Clear explanation here"
    }
  ]
}

Important: Return ONLY the JSON object, no additional text or markdown formatting.`

    console.log('[v0] AI Match RFQ: Sending request to OpenAI via Vercel AI Gateway')

    const { text } = await generateText({
      model: 'openai/gpt-4o-mini',
      prompt,
      temperature: 0.3,
      maxTokens: 2000,
    })

    console.log('[v0] AI Match RFQ: Received AI response')
    console.log('[v0] AI Match RFQ: Raw response:', text)

    let recommendations
    try {
      // Remove any markdown code blocks if present
      const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(cleanedText)
      recommendations = parsed.recommendations
    } catch (parseError) {
      console.error('[v0] AI Match RFQ: Failed to parse AI response:', parseError)
      console.error('[v0] AI Match RFQ: Raw text:', text)
      return NextResponse.json(
        { error: 'Failed to parse AI response', details: text },
        { status: 500 }
      )
    }

    if (!Array.isArray(recommendations)) {
      console.error('[v0] AI Match RFQ: Invalid recommendations format')
      return NextResponse.json(
        { error: 'Invalid AI response format' },
        { status: 500 }
      )
    }

    console.log('[v0] AI Match RFQ: Successfully parsed', recommendations.length, 'recommendations')

    const enrichedRecommendations = recommendations.map((rec: any) => {
      const supplier = suppliers.find(s => s.company_id === rec.supplier_id)
      return {
        ...rec,
        supplier_name: supplier?.company_name || 'Unknown',
        supplier_country: supplier?.country || 'Unknown',
        verification_level: supplier?.verification_level || 'basic',
        product_count: supplier?.products.length || 0,
      }
    })

    console.log('[v0] AI Match RFQ: Request completed successfully')

    return NextResponse.json({
      success: true,
      rfq_id: rfqId,
      recommendations: enrichedRecommendations,
    })

  } catch (error) {
    console.error('[v0] AI Match RFQ: Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
