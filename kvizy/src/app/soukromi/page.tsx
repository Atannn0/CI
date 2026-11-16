import type { Metadata } from "next";
import { PrivacyPage } from "@/components/privacy-page";

export const metadata: Metadata = {
  title: "Soukromí – WhichQuiz",
  description: "Jak WhichQuiz zpracovává údaje: bez účtů, localStorage, hlášení, Vercel a Neon.",
  alternates: { canonical: "/soukromi", languages: { cs: "/soukromi", en: "/privacy" } },
};

export default function SoukromiRoute() {
  return <PrivacyPage />;
}
