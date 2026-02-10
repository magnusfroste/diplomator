
-- App settings table for admin configuration
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed by edge functions via service role, and frontend)
CREATE POLICY "Anyone can read settings" ON public.app_settings
  FOR SELECT USING (true);

-- Only admins can modify
CREATE POLICY "Admins can insert settings" ON public.app_settings
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings" ON public.app_settings
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Seed default AI provider setting
INSERT INTO public.app_settings (key, value) VALUES 
  ('ai_provider', '{"provider": "anthropic", "model": "claude-3-sonnet-20240229"}'::jsonb);
