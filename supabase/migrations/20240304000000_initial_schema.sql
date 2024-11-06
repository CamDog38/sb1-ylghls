-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  bio text,
  avatar_url text,
  theme jsonb default '{"backgroundColor":"#f3f4f6","buttonColor":"#4f46e5","textColor":"#111827","fontFamily":"Inter","buttonStyle":"rounded"}'::jsonb,
  constraint username_length check (char_length(name) >= 3)
);

-- Create links table
create table links (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users on delete cascade not null,
  type text not null,
  data jsonb not null,
  position integer not null,
  constraint type_check check (type in ('product', 'link', 'form', 'folder', 'image', 'video', 'podcast', 'social', 'poll'))
);

-- Create indexes
create index links_user_id_idx on links(user_id);
create index links_position_idx on links(position);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;
alter table links enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can view their own links"
  on links for select
  using (auth.uid() = user_id);

create policy "Users can insert their own links"
  on links for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own links"
  on links for update
  using (auth.uid() = user_id);

create policy "Users can delete their own links"
  on links for delete
  using (auth.uid() = user_id);

-- Create function to handle user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_profiles_updated_at
  before update on profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_links_updated_at
  before update on links
  for each row execute procedure public.handle_updated_at();