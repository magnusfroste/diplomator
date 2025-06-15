
-- Add a policy to allow public read access to diplomas
-- This is needed so anyone with a diploma link can view it
CREATE POLICY "Allow public read access to diplomas" 
  ON public.signed_diplomas 
  FOR SELECT 
  TO public
  USING (true);
