
-- Create diploma_sessions table
CREATE TABLE public.diploma_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Diploma',
  diploma_html TEXT NOT NULL DEFAULT '',
  diploma_css TEXT NOT NULL DEFAULT '',
  diploma_format TEXT NOT NULL DEFAULT 'portrait',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.diploma_sessions ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
CREATE POLICY "Users can view their own sessions"
ON public.diploma_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
ON public.diploma_sessions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
ON public.diploma_sessions FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
ON public.diploma_sessions FOR DELETE
USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE TRIGGER update_diploma_sessions_updated_at
BEFORE UPDATE ON public.diploma_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
