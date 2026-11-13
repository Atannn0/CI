import { Suspense } from "react";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { PlayQuiz } from "@/components/play-quiz";
import { loadPlayPayload } from "@/lib/custom-quizzes-repo";

export default function PlayPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<PlaySkeleton />}>
      <PlayData params={params} />
    </Suspense>
  );
}

async function PlayData({ params }: { params: Promise<{ slug: string }> }) {
  await connection();
  const { slug } = await params;
  const payload = await loadPlayPayload(slug);
  if (!payload) notFound();
  return <PlayQuiz initial={payload} />;
}

function PlaySkeleton() {
  return (
    <div aria-busy="true" className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-4 py-8">
      <div className="h-10 w-2/3 animate-pulse rounded-lg bg-muted" />
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
    </div>
  );
}
