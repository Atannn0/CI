-- Draft/orphan media stay private until attached to a published custom quiz.
-- access_token_hash lets the uploader preview before publish; quiz_id marks attachment.

alter table quiz_media add column if not exists access_token_hash text;
alter table quiz_media add column if not exists quiz_id bigint references quizzes (id) on delete set null;

create index if not exists quiz_media_quiz_idx on quiz_media (quiz_id);

-- Existing images already used by custom quizzes become public via quiz_id backfill.
update quiz_media m
set quiz_id = q.quiz_id
from custom_quiz_questions q
where q.image_media_id = m.id and m.quiz_id is null;

update quiz_media m
set quiz_id = o.quiz_id
from custom_quiz_options opt
join custom_quiz_questions o on o.id = opt.question_id
where opt.image_media_id = m.id and m.quiz_id is null;

update quiz_media m
set quiz_id = oc.quiz_id
from custom_quiz_outcomes oc
where oc.image_media_id = m.id and m.quiz_id is null;
