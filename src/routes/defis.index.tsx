import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { ChallengeCard, StatCard } from "@/components/ui-bits";
import { Flag, Percent, Target, Users } from "lucide-react";
import {
  categories,
  challenges,
  difficulties,
  type ChallengeStatus,
  type Difficulty,
} from "@/lib/mock-data";

export const Route = createFileRoute("/defis")({
  head: () => ({
    meta: [
      { title: "Défis CTF — ESATIC Cyber" },
      {
        name: "description",
        content:
          "Catalogue de défis filtrable par catégorie, difficulté et statut : Web, Crypto, Forensics, Réseau, OSINT, Linux, Pwn et plus.",
      },
      { property: "og:title", content: "Catalogue de défis CTF — ESATIC Cyber" },
      {
        property: "og:description",
        content: "Des défis à flags ESATIC{...}, du niveau Facile à Insane, liés aux parties du programme.",
      },
    ],
  }),
  component: Defis,
});

const statuses: ChallengeStatus[] = ["non commencé", "en cours", "résolu"];

function Defis() {
  const [cat, setCat] = useState<string>("toutes");
  const [diff, setDiff] = useState<Difficulty | "toutes">("toutes");
  const [status, setStatus] = useState<ChallengeStatus | "tous">("tous");
  const [query, setQuery] = useState("");

  const visible = useMemo(
    () =>
      challenges.filter(
        (c) =>
          (cat === "toutes" || c.category === cat) &&
          (diff === "toutes" || c.difficulty === diff) &&
          (status === "tous" || c.status === status) &&
          c.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [cat, diff, status, query],
  );

  const solved = challenges.filter((c) => c.status === "résolu").length;
  const totalPoints = challenges.filter((c) => c.status === "résolu").reduce((s, c) => s + c.points, 0);

  return (
    <AppShell title="Défis" subtitle="Catalogue CTF — flags au format ESATIC{...}">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Flag} label="Défis publiés" value={challenges.length} />
        <StatCard icon={Target} label="Résolus" value={`${solved}/${challenges.length}`} />
        <StatCard icon={Percent} label="Points acquis" value={totalPoints} hint="sur ces défis" />
        <StatCard
          icon={Users}
          label="Résolutions totales"
          value={challenges.reduce((s, c) => s + c.solves, 0)}
        />
      </div>

      <div className="panel mt-6 space-y-4 p-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un défi…"
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
        />
        <Filters label="Catégorie" value={cat} onChange={setCat} options={["toutes", ...categories]} />
        <Filters
          label="Difficulté"
          value={diff}
          onChange={(v) => setDiff(v as Difficulty | "toutes")}
          options={["toutes", ...difficulties]}
        />
        <Filters
          label="Statut"
          value={status}
          onChange={(v) => setStatus(v as ChallengeStatus | "tous")}
          options={["tous", ...statuses]}
        />
      </div>

      <p className="mt-6 font-mono text-xs text-muted-foreground">
        {visible.length} défi{visible.length > 1 ? "s" : ""} affiché{visible.length > 1 ? "s" : ""}
      </p>

      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visible.map((c) => (
          <ChallengeCard key={c.id} challenge={c} />
        ))}
      </div>

      {!visible.length && (
        <p className="panel mt-4 p-8 text-center text-sm text-muted-foreground">
          Aucun défi ne correspond à ces filtres.
        </p>
      )}
    </AppShell>
  );
}

function Filters({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mono-label w-24 shrink-0">{label}</span>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
            value === o
              ? "border-primary text-primary"
              : "border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
