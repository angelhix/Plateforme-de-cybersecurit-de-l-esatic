import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { ModuleCard } from "@/components/ui-bits";
import { levels, modules, type LevelId } from "@/lib/mock-data";

export const Route = createFileRoute("/parcours")({
  head: () => ({
    meta: [
      { title: "Parcours — ESATIC Cyber" },
      {
        name: "description",
        content:
          "Les 12 parties du programme : Systèmes & Réseaux, Reconnaissance, Web/BDD/Crypto et Exploitation, aux trois niveaux.",
      },
      { property: "og:title", content: "Parcours d'apprentissage — ESATIC Cyber" },
      {
        property: "og:description",
        content: "Trois niveaux, quatre axes, des modules qui se débloquent au fil de la progression.",
      },
    ],
  }),
  component: Parcours,
});

function Parcours() {
  const [level, setLevel] = useState<LevelId | "tous">("tous");
  const visible = modules.filter((m) => level === "tous" || m.level === level);

  return (
    <AppShell
      title="Parcours"
      subtitle="12 parties · 3 niveaux × 4 axes, dans l'ordre de la méthodologie d'un pentest"
    >
      <div className="flex flex-wrap gap-2">
        {(["tous", 1, 2, 3] as const).map((l) => (
          <button
            key={l}
            onClick={() => setLevel(l)}
            className={`rounded-md border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              level === l
                ? "border-primary text-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {l === "tous" ? "Tous les niveaux" : `Niveau ${l}`}
          </button>
        ))}
      </div>

      {(level === "tous" ? levels : levels.filter((l) => l.id === level)).map((lvl) => {
        const mods = visible.filter((m) => m.level === lvl.id);
        if (!mods.length) return null;
        return (
          <section key={lvl.id} className="mt-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
              <h2 className="font-display text-lg font-semibold">{lvl.label}</h2>
              <p className="text-sm text-muted-foreground">{lvl.tagline}</p>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {mods.map((m) => (
                <ModuleCard key={m.id} module={m} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="panel mt-10 overflow-x-auto p-6">
        <p className="mono-label">Gabarit d'une partie</p>
        <h2 className="mt-1 font-display text-lg font-semibold">8 semaines, structure identique</h2>
        <table className="mt-5 w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="mono-label pb-2">Semaines</th>
              <th className="mono-label pb-2">Contenu</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {[
              ["S1–S3", "Thème A"],
              ["S4–S5", "Thème B"],
              ["S6", "CTF final"],
              ["S7", "Révision, correction, transition"],
              ["S8", "Examens universitaires — pas de séance"],
            ].map(([w, c]) => (
              <tr key={w} className="border-b border-border/60 last:border-0">
                <td className="py-2.5 text-primary">{w}</td>
                <td className="py-2.5 text-muted-foreground">{c}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </AppShell>
  );
}
