
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Signed diplomas table
CREATE TABLE public.signed_diplomas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blockchain_id TEXT NOT NULL UNIQUE,
  issuer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_name TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  diploma_html TEXT NOT NULL,
  diploma_css TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  signature TEXT NOT NULL,
  diplomator_seal TEXT NOT NULL,
  verification_url TEXT NOT NULL,
  diploma_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.signed_diplomas ENABLE ROW LEVEL SECURITY;

-- Issuers can view their own diplomas
CREATE POLICY "Users can view their own diplomas" ON public.signed_diplomas
  FOR SELECT USING (auth.uid() = issuer_id);

-- Issuers can create diplomas
CREATE POLICY "Users can create diplomas" ON public.signed_diplomas
  FOR INSERT WITH CHECK (auth.uid() = issuer_id);

-- Public read access by blockchain_id (for verification)
CREATE POLICY "Anyone can verify diplomas" ON public.signed_diplomas
  FOR SELECT USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_signed_diplomas_updated_at
  BEFORE UPDATE ON public.signed_diplomas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
