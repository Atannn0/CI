import type { Metadata } from "next";
import { AdminReports } from "@/components/admin-reports";

export const metadata: Metadata = {
  title: "Hlášení kvízů – správa",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-black tracking-tight text-violet-950">Hlášení kvízů</h1>
      <AdminReports />
    </main>
  );
}
