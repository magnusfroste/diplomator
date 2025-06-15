

-- Add diploma_url column to signed_diplomas table
ALTER TABLE public.signed_diplomas 
ADD COLUMN diploma_url TEXT;

-- Update existing records to have diploma_url based on their blockchain_id with correct domain
UPDATE public.signed_diplomas 
SET diploma_url = 'https://fabf66d2-6cc8-4995-9bf4-f98c6333f3ed.lovableproject.com/diploma/' || blockchain_id 
WHERE diploma_url IS NULL;

