-- Create user_profiles table for role-based access control
-- This should be run in your Supabase SQL editor

-- Create the user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id uuid not null default gen_random_uuid (),
    user_id uuid null,
    email text not null,
    first_name text not null,
    last_name text not null,
    phone text null,
    role text null default 'customer'::text,
    created_at timestamp with time zone null default now(),
    updated_at timestamp with time zone null default now(),
    constraint user_profiles_pkey primary key (id),
    constraint user_profiles_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
    constraint user_profiles_role_check check (
        (
            role = any (array['customer'::text, 'admin'::text])
        )
    )
) TABLESPACE pg_default;

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Allow insert during registration" ON user_profiles;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Allow insert during registration" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create user profile when user signs up
-- This function will be triggered when a new user is created in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, email, role, first_name, last_name)
    VALUES (new.id, new.email, 'customer', '', '');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Optional: Create an index for better performance on role queries
CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON user_profiles(role);

-- Optional: Create first admin user (replace with your email)
-- Uncomment and modify the following lines if you want to create an admin user
-- Note: You'll need to create the auth user first through normal signup, then run this

-- INSERT INTO user_profiles (user_id, email, role, first_name, last_name) 
-- VALUES (
--     (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com' LIMIT 1),
--     'your-admin-email@example.com',
--     'admin',
--     'Admin',
--     'User'
-- )
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Grant necessary permissions (adjust as needed for your setup)
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
