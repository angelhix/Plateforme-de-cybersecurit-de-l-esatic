import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag, Flame, Target, Trophy } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Meter, SectionTitle, StatCard, Tag } from "@/components/ui-bits";
import {
  badges,
  challenges,
  currentUser,
  modules,
  nextRankFor,
  rankFor,
  recentSolves,
} from "@/lib/mock-data";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: `Profil de ${currentUser.pseudo} — ESATIC Cyber` },
      {
        name: "description",
        content:
          "Profil d'apprenant : rang, points, badges, progression par partie et historique des défis résolus.",
      },
      { property: "og:title", content: `Profil de ${currentUser.pseudo} — ESATIC Cyber` },
      {
        property: "og:description",
        content: "Rang, badges, progression et défis résolus sur la plateforme ESATIC Cyber.",
      },
    ],
  }),
  component: Profil;
});

function Profil() {
  const rank = rankFor(currentUser.points);
  const next = nextRankFor(currentUser.points);
  const solvedChallenges = challenges.filter((c) => c.status === "résolu");
  const myModules = modules.filter((m) => m.level === currentUser.level);

  return (
    <AppShell title="Profil" subtitle={`${currentUser.pseudo} · ${currentUser.promotion}`}>
      <div className="panel flex flex-col gap-6 p-6 md:flex-row md:items-center">
        <span className="flex size-20 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono text-2xl font-bold text-primary">
          {currentUser.pseudo.slice(0, 2).toUpperCase()}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold">{currentUser.pseudo}</h2>
            <Tag tone="primary">{rank.name}</Tag>
            <Tag>{currentUser.role}</Tag>
            <Tag>{currentUser.promotion}</Tag>
          </div>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{currentUser.bio}</p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">
            {currentUser.email} · membre depuis {currentUser.joined}
          </p>
        </div>
        <div className="w-full md:w-56">
          {next ? (
            <>
              <div className="mb-1.5 flex justify-between font-mono text-xs text-muted-foreground">
                <span>{rank.name}</span>
                <span className="text-primary">{next.name}</span>
              </div>
              <Meter value={((currentUser.points - rank.min) / (next.min - rank.min)) * 100} />
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {next.min - currentUser.points} pts restants
              </p>
            </>
          ) : (
            <p className="font-mono text-xs text-muted-foreground">Rang maximal atteint.</p>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Target} label="Points" value={currentUser.points} />
        <StatCard icon={Flag} label="Défis résolus" value={currentUser.solved} />
        <StatCard icon={Trophy} label="Classement" value={`#${currentUser.position}`} />
        <StatCard icon={Flame} label="Série" value={`${currentUser.streak} j`} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <div className="panel p-6">
            <SectionTitle label={`Niveau ${currentUser.level}`} title="Progression par partie" />
            <ul className="space-y-4">
              {myModules.map((m) => (
                <li key={m.id}>
                  <Link
                    to="/parcours/$moduleId"
                    params={{ moduleId: m.id }}
                    className="flex items-center justify-between gap-4 text-sm hover:text-primary"
                  >
                    <span className="min-w-0 flex-1 truncate">
                      <span className="font-mono text-xs text-muted-foreground">P{m.part} · </span>
                      {m.title}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">{m.progress}%</span>
                  </Link>
                  <div className="mt-2">
                    <Meter value={m.progress} />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel overflow-x-auto">
            <div className="p-6 pb-3">
              <SectionTitle label="Historique" title="Défis résolus" />
            </div>
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-y border-border text-left">
                  <th className="mono-label px-6 py-3">Défi</th>
                  <th className="mono-label px-6 py-3">Catégorie</th>
                  <th className="mono-label px-6 py-3 text-right">Points</th>
                  <th className="mono-label px-6 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {recentSolves.map((s) => (
                  <tr key={s.challenge} className="border-b border-border/50 last:border-0">
                    <td className="px-6 py-3">{s.challenge}</td>
                    <td className="px-6 py-3 text-muted-foreground">{s.category}</td>
                    <td className="px-6 py-3 text-right text-accent">+{s.points}</td>
                    <td className="px-6 py-3 text-right text-muted-foreground">{s.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="panel p-6">
            <SectionTitle
              label={`${badges.filter((b) => b.obtained).length}/${badges.length} obtenus`}
              title="Badges"
            />
            <div className="space-y-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`rounded-md border p-4 ${
                    b.obtained ? "border-accent/40 bg-accent/5" : "border-border opacity-55"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-mono text-sm">{b.name}</p>
                    {b.date && <span className="mono-label">{b.date}</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{b.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <SectionTitle label="Catégories" title="Répartition des résolutions" />
            <ul className="space-y-2 font-mono text-sm">
              {Array.from(new Set(solvedChallenges.map((c) => c.category))).map((cat) => {
                const n = solvedChallenges.filter((c) => c.category === cat).length;
                return (
                  <li key={cat} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{cat}</span>
                    <span>{n}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
