
-- Enable Row Level Security on signed_diplomas table
ALTER TABLE public.signed_diplomas ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own signed diplomas
CREATE POLICY "Users can insert their own signed diplomas" 
  ON public.signed_diplomas 
  FOR INSERT 
  WITH CHECK (auth.uid() = issuer_id);

-- Allow users to view their own signed diplomas
CREATE POLICY "Users can view their own signed diplomas" 
  ON public.signed_diplomas 
  FOR SELECT 
  USING (auth.uid() = issuer_id);

-- Allow users to update their own signed diplomas
CREATE POLICY "Users can update their own signed diplomas" 
  ON public.signed_diplomas 
  FOR UPDATE 
  USING (auth.uid() = issuer_id);

-- Allow users to delete their own signed diplomas
CREATE POLICY "Users can delete their own signed diplomas" 
  ON public.signed_diplomas 
  FOR DELETE 
  USING (auth.uid() = issuer_id);
