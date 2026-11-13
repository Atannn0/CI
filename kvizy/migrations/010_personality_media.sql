-- Personality outcomes, media blobs, and image fields for custom quizzes.
alter table quizzes add column if not exists custom_mode text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'quizzes_custom_mode_check'
  ) then
    alter table quizzes add constraint quizzes_custom_mode_check
      check (custom_mode is null or custom_mode in ('knowledge', 'personality'));
  end if;
end $$;

update quizzes set custom_mode = 'knowledge' where kind = 'custom' and custom_mode is null;

create table if not exists quiz_media (
  id bigint generated always as identity primary key,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/gif')),
  byte_size integer not null check (byte_size > 0 and byte_size <= 1048576),
  sha256 text not null,
  data bytea not null,
  created_at timestamptz not null default now()
);

create index if not exists quiz_media_sha_idx on quiz_media (sha256);

create table if not exists custom_quiz_outcomes (
  id bigint generated always as identity primary key,
  quiz_id bigint not null references quizzes (id) on delete cascade,
  position integer not null check (position >= 0),
  outcome_key text not null check (char_length(outcome_key) between 1 and 40),
  title text not null check (char_length(title) between 1 and 120),
  description text not null check (char_length(description) between 1 and 500),
  image_media_id bigint references quiz_media (id) on delete set null,
  image_alt text check (image_alt is null or char_length(image_alt) between 1 and 200),
  unique (quiz_id, position),
  unique (quiz_id, outcome_key)
);

create index if not exists custom_quiz_outcomes_quiz_idx on custom_quiz_outcomes (quiz_id);

alter table custom_quiz_questions add column if not exists image_media_id bigint references quiz_media (id) on delete set null;
alter table custom_quiz_questions add column if not exists image_alt text;

alter table custom_quiz_options add column if not exists image_media_id bigint references quiz_media (id) on delete set null;
alter table custom_quiz_options add column if not exists image_alt text;
alter table custom_quiz_options add column if not exists outcome_key text;
alter table custom_quiz_options add column if not exists weight integer;

-- Allow image-only options/prompts: drop old non-empty label/prompt checks and re-add softer ones.
alter table custom_quiz_options drop constraint if exists custom_quiz_options_label_check;
alter table custom_quiz_questions drop constraint if exists custom_quiz_questions_prompt_check;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'custom_quiz_options_label_len'
  ) then
    alter table custom_quiz_options add constraint custom_quiz_options_label_len
      check (char_length(label) <= 300);
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'custom_quiz_questions_prompt_len'
  ) then
    alter table custom_quiz_questions add constraint custom_quiz_questions_prompt_len
      check (char_length(prompt) <= 500);
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'custom_quiz_options_weight_check'
  ) then
    alter table custom_quiz_options add constraint custom_quiz_options_weight_check
      check (weight is null or weight between 1 and 5);
  end if;
end $$;
