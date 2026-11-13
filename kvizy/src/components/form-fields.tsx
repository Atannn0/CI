"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function ChoiceGroup({ legend, error, children }: { legend: string; error?: string; children: React.ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-1.5" aria-invalid={!!error}>
      <legend className="mb-1.5 text-sm font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </fieldset>
  );
}

export function ChoiceOption({
  type,
  name,
  label,
  checked,
  onChange,
}: {
  type: "radio" | "checkbox";
  name: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={cn(
        "inline-flex h-9 cursor-pointer items-center rounded-full border px-3.5 text-sm font-medium transition-colors has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50",
        checked ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-primary/5",
      )}
    >
      <input type={type} name={name} checked={checked} onChange={onChange} className="sr-only" />
      {label}
    </label>
  );
}
