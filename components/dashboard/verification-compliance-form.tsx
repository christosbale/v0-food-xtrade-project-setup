'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast'
import { Upload, X, FileText, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface VerificationComplianceFormProps {
  company: any
  canEdit: boolean
}

interface DocumentUpload {
  file: File | null
  url: string | null
  name: string
}

interface VerificationData {
  companyLegalName: string
  vatNumber: string
  websiteUrl: string
  companyAddress: string
  documents: {
    registrationCertificate: DocumentUpload
    vatConfirmation: DocumentUpload
    qualityCertifications: DocumentUpload
    exportLicenses: DocumentUpload
    other: DocumentUpload
  }
}

export function VerificationComplianceForm({ company, canEdit }: VerificationComplianceFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<VerificationData>({
    companyLegalName: company.company_name || '',
    vatNumber: company.vat_number || '',
    websiteUrl: company.website_url || company.website || '',
    companyAddress: company.company_address || company.address || '',
    documents: {
      registrationCertificate: { file: null, url: null, name: 'Registration Certificate' },
      vatConfirmation: { file: null, url: null, name: 'VAT/VIES Confirmation' },
      qualityCertifications: { file: null, url: null, name: 'Quality Certifications (ISO, BRC, HACCP)' },
      exportLicenses: { file: null, url: null, name: 'Export Licenses' },
      other: { file: null, url: null, name: 'Other Documents' },
    },
  })

  // Load existing documents from company.verification_documents
  const existingDocs = company.verification_documents || {}

  const handleInputChange = (field: keyof VerificationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (docType: keyof VerificationData['documents'], file: File | null) => {
    if (file && file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file type',
        description: 'Please upload PDF files only.',
        variant: 'destructive',
      })
      return
    }

    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: 'File too large',
        description: 'Please upload files smaller than 10MB.',
        variant: 'destructive',
      })
      return
    }

    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: { ...prev.documents[docType], file },
      },
    }))
  }

  const removeFile = (docType: keyof VerificationData['documents']) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docType]: { ...prev.documents[docType], file: null },
      },
    }))
  }

  const uploadDocument = async (file: File, docType: string): Promise<string | null> => {
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${company.id}/${docType}_${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('company-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      console.error('[v0] Error uploading file:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('company-documents')
      .getPublicUrl(fileName)

    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canEdit) {
      toast({
        title: 'Cannot edit',
        description: 'Verification documents have already been submitted and are under review.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createClient()
      
      // Upload all documents
      const uploadedDocs: Record<string, any> = {}
      
      for (const [docType, docData] of Object.entries(formData.documents)) {
        if (docData.file) {
          const url = await uploadDocument(docData.file, docType)
          if (url) {
            uploadedDocs[docType] = {
              url,
              fileName: docData.file.name,
              uploadedAt: new Date().toISOString(),
            }
          }
        }
      }

      // Update company record
      const { error } = await supabase
        .from('companies')
        .update({
          company_name: formData.companyLegalName,
          vat_number: formData.vatNumber,
          website_url: formData.websiteUrl,
          company_address: formData.companyAddress,
          verification_documents: uploadedDocs,
          verification_status: 'pending', // Reset to pending when documents are submitted
          updated_at: new Date().toISOString(),
        })
        .eq('id', company.id)

      if (error) throw error

      toast({
        title: 'Verification submitted',
        description: 'Your verification documents have been submitted successfully. We will review them within 24-48 hours.',
      })

      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('[v0] Error submitting verification:', error)
      toast({
        title: 'Submission failed',
        description: 'Failed to submit verification documents. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const uploadedCount = Object.values(formData.documents).filter(doc => doc.file).length +
    Object.keys(existingDocs).length

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!canEdit && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Your verification documents are currently under review. You cannot make changes at this time.
          </AlertDescription>
        </Alert>
      )}

      {/* Company Information Fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyLegalName">Company Legal Name *</Label>
          <Input
            id="companyLegalName"
            value={formData.companyLegalName}
            onChange={(e) => handleInputChange('companyLegalName', e.target.value)}
            disabled={!canEdit}
            required
            placeholder="Enter your company's legal name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vatNumber">VAT Number *</Label>
          <Input
            id="vatNumber"
            value={formData.vatNumber}
            onChange={(e) => handleInputChange('vatNumber', e.target.value)}
            disabled={!canEdit}
            required
            placeholder="e.g., GB123456789"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="websiteUrl">Website URL *</Label>
          <Input
            id="websiteUrl"
            type="url"
            value={formData.websiteUrl}
            onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
            disabled={!canEdit}
            required
            placeholder="https://www.yourcompany.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyAddress">Company Address *</Label>
          <Input
            id="companyAddress"
            value={formData.companyAddress}
            onChange={(e) => handleInputChange('companyAddress', e.target.value)}
            disabled={!canEdit}
            required
            placeholder="Full registered address"
          />
        </div>
      </div>

      {/* Document Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Supporting Documents (PDF only)</h3>
            <p className="text-sm text-muted-foreground">
              Upload up to 5 documents (max 10MB each)
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {uploadedCount}/5 uploaded
          </div>
        </div>

        {Object.entries(formData.documents).map(([key, doc]) => {
          const existingDoc = existingDocs[key]
          const hasFile = doc.file || existingDoc

          return (
            <div key={key} className="border rounded-lg p-4 space-y-2">
              <Label className="text-sm font-medium">{doc.name}</Label>
              
              {existingDoc && !doc.file && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-2 rounded">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="flex-1">{existingDoc.fileName}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(existingDoc.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
              )}

              {doc.file && (
                <div className="flex items-center gap-2 text-sm bg-muted p-2 rounded">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 truncate">{doc.file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(doc.file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  {canEdit && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(key as keyof VerificationData['documents'])}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}

              {canEdit && !doc.file && (
                <div className="relative">
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(
                      key as keyof VerificationData['documents'],
                      e.target.files?.[0] || null
                    )}
                    disabled={!canEdit || uploadedCount >= 5}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {canEdit && (
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting || uploadedCount === 0}
            className="bg-[#FFB84D] text-black hover:bg-[#FFA83D]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Submit for Verification
              </>
            )}
          </Button>
        </div>
      )}
    </form>
  )
}
