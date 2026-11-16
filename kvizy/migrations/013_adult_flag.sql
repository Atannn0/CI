-- Optional 18+ flag for catalog quizzes. Missing/false = not marked (safe default).
alter table quizzes add column if not exists is_adult boolean not null default false;
