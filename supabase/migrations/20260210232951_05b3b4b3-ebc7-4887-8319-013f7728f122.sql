
-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Admins can view all diplomas (already have public SELECT, so this is covered)
-- Admins can update any profile
CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update roles
CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
