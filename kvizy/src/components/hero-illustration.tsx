import { CheckIcon, ImageIcon, SparkleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeroIllustration({ className }: { className?: string }) {
  return (
    <div aria-hidden data-testid="hero-illustration" className={cn("relative h-56 w-72 select-none", className)}>
      <div className="absolute top-2 right-6 size-3 rounded-full bg-coral-400" />
      <SparkleIcon className="absolute top-0 left-10 size-6 fill-amber-300 text-amber-300" />
      <div className="absolute bottom-6 left-0 size-4 rounded-full bg-violet-300" />

      <div className="absolute top-8 left-2 flex h-44 w-36 -rotate-12 items-center rounded-3xl bg-violet-500 pl-5 shadow-lg shadow-violet-500/25">
        <span className="text-7xl leading-none font-black text-white">?</span>
      </div>

      <div className="absolute top-3 left-28 flex h-44 w-36 rotate-3 flex-col gap-2.5 rounded-3xl bg-white p-3 shadow-xl ring-1 shadow-violet-900/10 ring-violet-100">
        <div className="relative grid h-24 place-items-center overflow-hidden rounded-2xl bg-coral-100">
          <ImageIcon className="size-10 text-coral-500" strokeWidth={1.75} />
          <div className="absolute -bottom-3 -left-2 h-8 w-20 rounded-[50%] bg-coral-300/70" />
        </div>
        <div className="h-2.5 w-24 rounded-full bg-violet-200" />
        <div className="h-2.5 w-16 rounded-full bg-violet-100" />
      </div>

      <div className="absolute right-0 bottom-1 flex h-24 w-32 rotate-6 flex-col justify-center gap-2 rounded-3xl bg-amber-100 p-3 shadow-lg ring-1 shadow-amber-900/10 ring-amber-200">
        <div className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-violet-600 text-white">
            <CheckIcon className="size-4" strokeWidth={3} />
          </span>
          <span className="h-2.5 w-14 rounded-full bg-amber-300" />
        </div>
        <div className="flex items-center gap-2">
          <span className="size-7 rounded-full border-2 border-amber-300 bg-white" />
          <span className="h-2.5 w-10 rounded-full bg-amber-200" />
        </div>
      </div>
    </div>
  );
}
