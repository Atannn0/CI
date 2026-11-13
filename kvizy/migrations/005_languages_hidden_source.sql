-- Broader language codes (validated in app), soft-hide for replaced hub cards, optional source.
alter table quizzes drop constraint if exists quizzes_language_check;
alter table quizzes add constraint quizzes_language_format check (language ~ '^[a-z]{2}$');

alter table quizzes add column if not exists hidden boolean not null default false;
alter table quizzes add column if not exists source text;

create index if not exists quizzes_hidden_idx on quizzes (hidden) where hidden = false;
create index if not exists quizzes_language_idx on quizzes (language);
