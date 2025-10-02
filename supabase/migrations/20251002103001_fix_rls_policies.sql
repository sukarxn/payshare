-- Fix RLS policies for users table
-- Drop the conflicting policies
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can read others basic info" ON public.users;

-- Create a single, comprehensive read policy
CREATE POLICY "Users can read user data" ON public.users
    FOR SELECT USING (true);