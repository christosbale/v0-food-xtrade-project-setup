-- Update RLS policies to allow the trigger function to insert companies
-- The trigger runs with SECURITY DEFINER so it bypasses RLS,
-- but we also need to ensure users can update their own company data

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own company" ON public.companies;
DROP POLICY IF EXISTS "Users can view their own company" ON public.companies;
DROP POLICY IF EXISTS "Users can update their own company" ON public.companies;

-- Allow users to view their own company
CREATE POLICY "Users can view their own company"
  ON public.companies
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to update their own company (for completing profile)
CREATE POLICY "Users can update their own company"
  ON public.companies
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to insert their own company (in case trigger doesn't fire or for manual inserts)
CREATE POLICY "Users can insert their own company"
  ON public.companies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow service role to manage all companies (for admin operations)
CREATE POLICY "Service role can manage all companies"
  ON public.companies
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Similarly update policies for documents table
DROP POLICY IF EXISTS "Users can insert their own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can view their own documents" ON public.documents;

CREATE POLICY "Users can view their own documents"
  ON public.documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = documents.company_id
      AND companies.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = documents.company_id
      AND companies.user_id = auth.uid()
    )
  );
