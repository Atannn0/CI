"use client";

import { useRef, useState } from "react";
import { ImagePlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/lib/i18n/locale";
import { MEDIA_LIMITS } from "@/lib/media";

export type ImageDraft = { mediaId: number; url: string; alt: string } | null;

type Props = {
  id: string;
  value: ImageDraft;
  onChange: (value: ImageDraft) => void;
  requireAlt?: boolean;
};

export function ImageField({ id, value, onChange, requireAlt = true }: Props) {
  const { t } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/media", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? t("errCustomImage"));
        return;
      }
      onChange({ mediaId: data.id, url: data.url, alt: value?.alt ?? "" });
    } catch {
      setError(t("saveFailedNet"));
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border p-3" data-testid="image-field">
      <p className="text-xs text-muted-foreground">{t("imageHint")}</p>
      {value ? (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.url}
            alt={value.alt || ""}
            className="max-h-32 max-w-full rounded-lg object-contain ring-1 ring-border"
          />
          <div className="flex flex-1 flex-col gap-2">
            {requireAlt && (
              <Input
                id={`${id}-alt`}
                value={value.alt}
                maxLength={MEDIA_LIMITS.altMax}
                placeholder={t("imageAlt")}
                aria-label={t("imageAlt")}
                onChange={(e) => onChange({ ...value, alt: e.target.value })}
              />
            )}
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
                {t("imageReplace")}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
                <Trash2Icon data-icon="inline-start" aria-hidden />
                {t("imageRemove")}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button type="button" variant="outline" size="sm" disabled={busy} onClick={() => inputRef.current?.click()}>
          <ImagePlusIcon data-icon="inline-start" aria-hidden />
          {busy ? t("saving") : t("imageUpload")}
        </Button>
      )}
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={MEDIA_LIMITS.allowedMime.join(",")}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
