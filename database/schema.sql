-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table first (since other tables reference it)
create table if not exists public.profiles (
    id uuid primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id) on delete cascade unique,
    name text,
    bio text,
    avatar text
);

-- Rest of the schema remains the same...