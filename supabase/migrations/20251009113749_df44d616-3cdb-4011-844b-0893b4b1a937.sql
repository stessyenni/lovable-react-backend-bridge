-- RPC to resolve email by username for login (bypasses RLS safely)
CREATE OR REPLACE FUNCTION public.get_email_by_username(p_username text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email text;
BEGIN
  SELECT email INTO v_email
  FROM public.profiles
  WHERE lower(username) = lower(p_username)
  LIMIT 1;
  RETURN v_email;
END;
$$;

REVOKE ALL ON FUNCTION public.get_email_by_username(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_email_by_username(text) TO anon, authenticated;