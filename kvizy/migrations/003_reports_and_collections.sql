-- Links to a hub of several tests (shown as "Výběr testů") instead of one quiz.
alter table quizzes add column if not exists is_collection boolean not null default false;

-- Visitor reports about a quiz. Readable only through the admin endpoint; a report never hides
-- or deletes the quiz.
create table if not exists quiz_reports (
  id bigint generated always as identity primary key,
  quiz_id bigint not null references quizzes (id) on delete cascade,
  reason text not null check (reason in ('broken_link', 'wrong_category', 'inappropriate', 'duplicate', 'other')),
  note text check (note is null or char_length(note) <= 500),
  created_at timestamptz not null default now(),
  check (reason <> 'other' or note is not null)
);

create index if not exists quiz_reports_created_idx on quiz_reports (created_at desc);
create index if not exists quiz_reports_quiz_idx on quiz_reports (quiz_id);
