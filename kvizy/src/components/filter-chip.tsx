"use client";

import { useId } from "react";
import { CheckIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  pressed: boolean;
  onToggle: () => void;
  icon?: LucideIcon;
  /** Short text shown in the icon slot when there is no icon, e.g. "CZ". */
  code?: string;
};

export function FilterChip({ label, pressed, onToggle, icon: Icon, code }: Props) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      data-testid="filter-chip"
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border pr-3.5 pl-2.5 text-sm leading-none font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        pressed
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background hover:border-primary/50 hover:bg-primary/5",
      )}
    >
      {/* Fixed slot: swapping the icon for the check mark must not change the chip's width. */}
      <span aria-hidden className="grid h-4 w-5 shrink-0 place-items-center">
        {pressed ? (
          <CheckIcon className="size-4" />
        ) : Icon ? (
          <Icon className="size-4" />
        ) : (
          <span className="text-[0.625rem] font-bold tracking-wide">{code}</span>
        )}
      </span>
      {label}
    </button>
  );
}

type GroupProps = { title: string; children: React.ReactNode };

export function FilterGroup({ title, children }: GroupProps) {
  const id = useId();
  return (
    <div role="group" aria-labelledby={id} className="flex min-w-0 flex-col gap-2.5" data-testid="filter-group">
      <p id={id} className="text-xs leading-4 font-semibold tracking-wider text-muted-foreground uppercase">
        {title}
      </p>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
