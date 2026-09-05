-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'photographer', 'customer');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- Plates catalogue
CREATE TABLE public.plates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  catalogue TEXT NOT NULL UNIQUE,
  price_minor INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NOK',
  description TEXT,
  alt_text TEXT,
  verification_status TEXT NOT NULL DEFAULT 'Awaiting verified original',
  raw_archived BOOLEAN NOT NULL DEFAULT false,
  capture_record_present BOOLEAN NOT NULL DEFAULT false,
  price_confirmed BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.plates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.plates TO authenticated;
GRANT ALL ON public.plates TO service_role;
ALTER TABLE public.plates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "plates_public_read_published" ON public.plates FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "plates_admin_read_all" ON public.plates FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "plates_admin_insert" ON public.plates FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "plates_admin_update" ON public.plates FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "plates_admin_delete" ON public.plates FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER plates_set_updated_at BEFORE UPDATE ON public.plates FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed the existing placeholder catalogue, unpublished and unverified
INSERT INTO public.plates (slug, title, catalogue, price_minor, currency, published) VALUES
  ('first-light','First Light','BA-001',190,'NOK',false),
  ('into-the-pines','Into the Pines','BA-002',190,'NOK',false),
  ('sea-of-fog','Sea of Fog','BA-003',190,'NOK',false),
  ('still-water','Still Water','BA-004',190,'NOK',false),
  ('palm','PALM','BA-005',190,'NOK',false),
  ('blue-hour-grid','Blue Hour Grid','BA-006',190,'NOK',false),
  ('night-crossing','Night Crossing','BA-007',190,'NOK',false),
  ('golden-hour','Golden Hour','BA-008',190,'NOK',false),
  ('portrait-in-amber','Portrait in Amber','BA-009',240,'NOK',false),
  ('the-maker','The Maker','BA-010',240,'NOK',false),
  ('slow-morning','Slow Morning','BA-011',190,'NOK',false),
  ('low-tide','Low Tide','BA-012',190,'NOK',false);