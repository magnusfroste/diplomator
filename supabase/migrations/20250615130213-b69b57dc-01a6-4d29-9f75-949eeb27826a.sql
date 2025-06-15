
-- Create a table to store signed diplomas with issuer tracking
CREATE TABLE public.signed_diplomas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  blockchain_id TEXT NOT NULL UNIQUE, -- References the blockchain diploma ID
  issuer_id UUID REFERENCES auth.users NOT NULL, -- The logged-in user who created it
  recipient_name TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  diploma_html TEXT NOT NULL,
  diploma_css TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  signature TEXT NOT NULL,
  diplomator_seal TEXT NOT NULL,
  verification_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own issued diplomas
ALTER TABLE public.signed_diplomas ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own issued diplomas
CREATE POLICY "Users can view their own issued diplomas" 
  ON public.signed_diplomas 
  FOR SELECT 
  USING (auth.uid() = issuer_id);

-- Create policy that allows users to INSERT their own issued diplomas
CREATE POLICY "Users can create their own issued diplomas" 
  ON public.signed_diplomas 
  FOR INSERT 
  WITH CHECK (auth.uid() = issuer_id);

-- Create policy that allows users to UPDATE their own issued diplomas
CREATE POLICY "Users can update their own issued diplomas" 
  ON public.signed_diplomas 
  FOR UPDATE 
  USING (auth.uid() = issuer_id);

-- Create policy that allows users to DELETE their own issued diplomas
CREATE POLICY "Users can delete their own issued diplomas" 
  ON public.signed_diplomas 
  FOR DELETE 
  USING (auth.uid() = issuer_id);

-- Create an index for better performance on issuer queries
CREATE INDEX idx_signed_diplomas_issuer_id ON public.signed_diplomas(issuer_id);

-- Create an index for blockchain_id lookups
CREATE INDEX idx_signed_diplomas_blockchain_id ON public.signed_diplomas(blockchain_id);
