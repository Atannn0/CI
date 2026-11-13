create table if not exists quizzes (
  id bigint generated always as identity primary key,
  title text not null,
  url text not null,
  url_key text not null unique,
  description text,
  language text not null check (language in ('cs', 'en')),
  format text not null check (format in ('text', 'image', 'mixed')),
  types text[] not null check (cardinality(types) >= 1),
  topic text,
  verified boolean not null default false,
  clicks integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists quizzes_clicks_idx on quizzes (clicks desc);
