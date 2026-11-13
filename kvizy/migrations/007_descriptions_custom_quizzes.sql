-- Bilingual catalog blurbs + hosted (custom) quizzes.
alter table quizzes add column if not exists description_cs text;
alter table quizzes add column if not exists description_en text;
alter table quizzes add column if not exists kind text not null default 'external';
alter table quizzes add column if not exists slug text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'quizzes_kind_check'
  ) then
    alter table quizzes add constraint quizzes_kind_check check (kind in ('external', 'custom'));
  end if;
end $$;

create unique index if not exists quizzes_slug_uidx on quizzes (slug) where slug is not null;

-- One-time backfill: keep original description; fill missing locale fields.
update quizzes
set description_cs = coalesce(nullif(trim(description), ''), 'Kvíz o: ' || title)
where description_cs is null;

update quizzes
set description_en = coalesce(nullif(trim(description), ''), 'Quiz about: ' || title)
where description_en is null;

create table if not exists custom_quiz_questions (
  id bigint generated always as identity primary key,
  quiz_id bigint not null references quizzes (id) on delete cascade,
  position integer not null check (position >= 0),
  prompt text not null check (char_length(prompt) between 1 and 500),
  unique (quiz_id, position)
);

create table if not exists custom_quiz_options (
  id bigint generated always as identity primary key,
  question_id bigint not null references custom_quiz_questions (id) on delete cascade,
  position integer not null check (position >= 0),
  label text not null check (char_length(label) between 1 and 300),
  is_correct boolean not null default false,
  unique (question_id, position)
);

create index if not exists custom_quiz_questions_quiz_idx on custom_quiz_questions (quiz_id);
create index if not exists custom_quiz_options_question_idx on custom_quiz_options (question_id);
