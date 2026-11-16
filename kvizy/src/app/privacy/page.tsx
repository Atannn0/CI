import type { Metadata } from "next";
import { PrivacyPage } from "@/components/privacy-page";

export const metadata: Metadata = {
  title: "Privacy – WhichQuiz",
  description: "How WhichQuiz handles data: no accounts, localStorage, reports, Vercel and Neon.",
  alternates: { canonical: "/privacy", languages: { cs: "/soukromi", en: "/privacy" } },
};

export default function PrivacyRoute() {
  return <PrivacyPage />;
}
