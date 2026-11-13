"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CatalogError({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <h1 className="text-2xl font-extrabold">Katalog se teď nepodařilo načíst</h1>
      <p className="text-muted-foreground">
        Databáze kvízů neodpovídá. Zkus to za chvíli znovu. Pokud to trvá, správce aplikace musí zkontrolovat připojení
        databáze.
      </p>
      <Button size="lg" onClick={() => retry()}>
        Zkusit znovu
      </Button>
    </main>
  );
}
