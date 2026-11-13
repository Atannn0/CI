"use client";

import { CheckIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  pressed: boolean;
  onToggle: () => void;
  icon?: LucideIcon;
};

export function FilterChip({ label, pressed, onToggle, icon: Icon }: Props) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={cn(
        "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        pressed
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background hover:border-primary/50 hover:bg-primary/5",
      )}
    >
      {pressed ? <CheckIcon className="size-4" aria-hidden /> : Icon && <Icon className="size-4" aria-hidden />}
      {label}
    </button>
  );
}

type GroupProps = { title: string; children: React.ReactNode };

export function FilterGroup({ title, children }: GroupProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">{title}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}
