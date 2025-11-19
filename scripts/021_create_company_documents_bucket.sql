-- Create storage bucket for company verification documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('company-documents', 'company-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for company documents
CREATE POLICY "Authenticated users can upload their company documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'company-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own company documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'company-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Admins can view all company documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'company-documents' AND
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);
