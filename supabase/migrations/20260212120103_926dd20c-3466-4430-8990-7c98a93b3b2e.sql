-- Create branding-assets bucket (public so images are accessible)
INSERT INTO storage.buckets (id, name, public)
VALUES ('branding-assets', 'branding-assets', true);

-- Anyone can view branding assets (public)
CREATE POLICY "Public read access for branding assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'branding-assets');

-- Only admins can upload branding assets
CREATE POLICY "Admins can upload branding assets"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'branding-assets'
  AND public.has_role(auth.uid(), 'admin')
);

-- Only admins can update branding assets
CREATE POLICY "Admins can update branding assets"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'branding-assets'
  AND public.has_role(auth.uid(), 'admin')
);

-- Only admins can delete branding assets
CREATE POLICY "Admins can delete branding assets"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'branding-assets'
  AND public.has_role(auth.uid(), 'admin')
);