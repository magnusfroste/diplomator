
-- Add diploma_url column to signed_diplomas table
ALTER TABLE public.signed_diplomas 
ADD COLUMN diploma_url TEXT;

-- Update existing records to have diploma_url based on their blockchain_id
UPDATE public.signed_diplomas 
SET diploma_url = 'https://your-domain.com/diploma/' || blockchain_id 
WHERE diploma_url IS NULL;
