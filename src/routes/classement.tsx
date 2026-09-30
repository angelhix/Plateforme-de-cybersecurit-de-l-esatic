import { createFileRoute } from "@tanstack/react-router";
import { Archive, Minus, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/app-shell";
import { SectionTitle, Tag } from "@/components/ui-bits";
import { currentUser, leaderboard, seasons } from "@/lib/mock-data";

export const Route = createFileRoute("/classement")({
  head: () => ({
    meta: [
      { title: "Classement — ESATIC Cyber" },
      {
        name: "description",
        content:
          "Classement général, par promotion et par saison. Les résultats de chaque année académique sont archivés dans le hall of fame.",
      },
      { property: "og:title", content: "Classement — ESATIC Cyber" },
      {
        property: "og:description",
        content: "Points, rangs et hall of fame des saisons précédentes de la Section Cybersécurité.",
      },
    ],
  }),
  component: Classement,
});

function Classement() {
  const promotions = useMemo(
    () => ["toutes", ...Array.from(new Set(leaderboard.map((e) => e.promotion)))],
    [],
  );
  const [promo, setPromo] = useState("toutes");
  const [season, setSeason] = useState(seasons[0].id);

  const rows = leaderboard.filter((e) => promo === "toutes" || e.promotion === promo);

  return (
    <AppShell title="Classement" subtitle="Saison en cours et archives par génération">
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="panel p-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mono-label w-24 shrink-0">Saison</span>
              {seasons.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSeason(s.id)}
                  className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                    season === s.id
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="mono-label w-24 shrink-0">Promotion</span>
              {promotions.map((p) => (
                <button
                  key={p}
                  onClick={() => setPromo(p)}
                  className={`rounded-md border px-2.5 py-1 font-mono text-xs transition-colors ${
                    promo === p
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="panel overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="mono-label px-5 py-3">#</th>
                  <th className="mono-label px-5 py-3">Pseudo</th>
                  <th className="mono-label px-5 py-3">Promotion</th>
                  <th className="mono-label px-5 py-3">Rang</th>
                  <th className="mono-label px-5 py-3 text-right">Résolus</th>
                  <th className="mono-label px-5 py-3 text-right">Points</th>
                  <th className="mono-label px-5 py-3 text-right">Évol.</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {rows.map((e) => {
                  const me = e.pseudo === currentUser.pseudo;
                  return (
                    <tr
                      key={e.pseudo}
                      className={`border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/50 ${
                        me ? "bg-primary/5" : ""
                      }`}
                    >
                      <td className="px-5 py-3">
                        <span
                          className={
                            e.rankPosition <= 3 ? "font-bold text-primary" : "text-muted-foreground"
                          }
                        >
                          {e.rankPosition}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {e.pseudo}
                        {me && <span className="ml-2 text-xs text-primary">vous</span>}
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{e.promotion}</td>
                      <td className="px-5 py-3 text-muted-foreground">{e.rank}</td>
                      <td className="px-5 py-3 text-right text-muted-foreground">{e.solved}</td>
                      <td className="px-5 py-3 text-right text-accent">{e.points}</td>
                      <td className="px-5 py-3">
                        <span className="flex items-center justify-end gap-1 text-xs">
                          {e.trend > 0 && (
                            <>
                              <TrendingUp className="size-3.5 text-success" />
                              <span className="text-success">{e.trend}</span>
                            </>
                          )}
                          {e.trend < 0 && (
                            <>
                              <TrendingDown className="size-3.5 text-destructive" />
                              <span className="text-destructive">{Math.abs(e.trend)}</span>
                            </>
                          )}
                          {e.trend === 0 && <Minus className="size-3.5 text-muted-foreground" />}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="panel p-6">
            <SectionTitle label="Podium" title="Top 3 de la saison" />
            <ol className="space-y-3">
              {leaderboard.slice(0, 3).map((e, i) => (
                <li
                  key={e.pseudo}
                  className="flex items-center gap-4 rounded-md border border-border p-4"
                >
                  <span className="font-display text-2xl font-bold text-primary/40">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-mono">{e.pseudo}</span>
                    <span className="mono-label">
                      {e.promotion} · {e.rank}
                    </span>
                  </span>
                  <span className="font-mono text-accent">{e.points}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="panel p-6">
            <div className="flex items-center gap-2">
              <Archive className="size-4 text-primary" />
              <h2 className="font-display text-sm font-semibold">Hall of fame</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Chaque année académique est figée à sa clôture et reste consultable.
            </p>
            <ul className="mt-4 space-y-3">
              {seasons.map((s) => (
                <li key={s.id} className="rounded-md border border-border p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-sm">{s.label}</span>
                    <Tag tone={s.status === "en cours" ? "primary" : "muted"}>{s.status}</Tag>
                  </div>
                  <p className="mt-2 font-mono text-xs text-muted-foreground">
                    Champion : <span className="text-accent">{s.champion}</span> · {s.participants}{" "}
                    participants · {s.challenges} défis
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
