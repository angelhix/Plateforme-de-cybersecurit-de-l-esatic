import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText, Flag, Percent, Plus, Server, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { SectionTitle, StatCard, Tag } from "@/components/ui-bits";
import {
  adminChallengeRows,
  adminStats,
  auditLog,
  categories,
  difficulties,
  leaderboard,
} from "@/lib/mock-data";

export const Route = createFileRoute("/administration")({
  head: () => ({
    meta: [
      { title: "Administration — ESATIC Cyber" },
      {
        name: "description",
        content:
          "Espace formateur et administrateur : création de cours et de défis, gestion des membres, tableau de bord et journal d'activité.",
      },
      { property: "og:title", content: "Administration — ESATIC Cyber" },
      {
        property: "og:description",
        content: "Back-office de la plateforme : contenus, membres, statistiques et modération.",
      },
    ],
  }),
  component: Administration,
});

const tabs = ["Tableau de bord", "Contenus", "Membres", "Journal"] as const;

function Administration() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Tableau de bord");

  return (
    <AppShell
      title="Administration"
      subtitle="Espace formateur et administrateur"
      actions={
        <button
          onClick={() => toast.info("Export CSV disponible à l'étape backend.")}
          className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-border-strong"
        >
          <Download className="size-3.5" /> Export CSV
        </button>
      }
    >
      <div className="flex flex-wrap gap-2 border-b border-border pb-4">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Tableau de bord" && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Users} label="Membres inscrits" value={adminStats.members} hint={`${adminStats.activeWeek} actifs cette semaine`} />
            <StatCard icon={Flag} label="Défis publiés" value={adminStats.publishedChallenges} />
            <StatCard icon={FileText} label="Leçons publiées" value={adminStats.publishedLessons} />
            <StatCard icon={Server} label="Labs en marche" value={adminStats.runningLabs} hint="conteneurs actifs" />
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="panel p-6">
              <SectionTitle label="Soumissions" title="Taux de réussite global" />
              <p className="font-display text-4xl font-semibold text-primary">{adminStats.successRate}%</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {adminStats.submissions} soumissions de flags enregistrées cette saison.
              </p>
              <div className="mt-5 space-y-3">
                {adminChallengeRows.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 flex-1 truncate">{c.title}</span>
                    <span className="font-mono text-xs text-muted-foreground">{c.solves} résolutions</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel p-6">
              <SectionTitle label="Suivi" title="Membres les plus actifs" />
              <ul className="space-y-2.5 font-mono text-sm">
                {leaderboard.slice(0, 6).map((e) => (
                  <li key={e.pseudo} className="flex items-center justify-between gap-3">
                    <span className="flex-1 truncate">{e.pseudo}</span>
                    <span className="text-xs text-muted-foreground">{e.promotion}</span>
                    <span className="text-accent">{e.solved} résolus</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {tab === "Contenus" && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <div className="panel overflow-x-auto">
            <div className="flex items-center justify-between gap-4 p-6 pb-3">
              <SectionTitle label="Catalogue" title="Défis" />
              <button
                onClick={() => toast.info("Publication simulée — l'éditeur écrira en base à l'étape backend.")}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus className="size-3.5" /> Nouveau défi
              </button>
            </div>
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-y border-border text-left">
                  <th className="mono-label px-6 py-3">Titre</th>
                  <th className="mono-label px-6 py-3">Catégorie</th>
                  <th className="mono-label px-6 py-3">Difficulté</th>
                  <th className="mono-label px-6 py-3">Auteur</th>
                  <th className="mono-label px-6 py-3 text-right">État</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {adminChallengeRows.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 last:border-0">
                    <td className="px-6 py-3">{c.title}</td>
                    <td className="px-6 py-3 text-muted-foreground">{c.category}</td>
                    <td className="px-6 py-3 text-muted-foreground">{c.difficulty}</td>
                    <td className="px-6 py-3 text-muted-foreground">{c.author}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={c.published ? "text-success" : "text-warning"}>
                        {c.published ? "publié" : "brouillon"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <form
            className="panel space-y-4 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Défi enregistré en brouillon (simulation).");
            }}
          >
            <SectionTitle label="Éditeur" title="Créer un défi" />
            <label className="block">
              <span className="mono-label">Titre</span>
              <input
                required
                placeholder="Le port oublié"
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mono-label">Catégorie</span>
                <select className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring">
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mono-label">Difficulté</span>
                <select className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-ring">
                  {difficulties.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mono-label">Énoncé (Markdown)</span>
              <textarea
                rows={5}
                placeholder="Décrivez le contexte, l'objectif et les contraintes…"
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-ring"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mono-label">Flag</span>
                <input
                  placeholder="ESATIC{...}"
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-ring"
                />
              </label>
              <label className="block">
                <span className="mono-label">Points</span>
                <input
                  type="number"
                  defaultValue={100}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-ring"
                />
              </label>
            </div>
            <p className="text-xs text-muted-foreground">
              Le flag n'est jamais envoyé au navigateur : il sera comparé côté serveur uniquement.
            </p>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Enregistrer en brouillon
            </button>
          </form>
        </div>
      )}

      {tab === "Membres" && (
        <div className="panel mt-6 overflow-x-auto">
          <div className="p-6 pb-3">
            <SectionTitle label="Gestion" title="Membres" />
          </div>
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="border-y border-border text-left">
                <th className="mono-label px-6 py-3">Pseudo</th>
                <th className="mono-label px-6 py-3">Promotion</th>
                <th className="mono-label px-6 py-3">Rôle</th>
                <th className="mono-label px-6 py-3 text-right">Points</th>
                <th className="mono-label px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {leaderboard.map((e, i) => (
                <tr key={e.pseudo} className="border-b border-border/50 last:border-0">
                  <td className="px-6 py-3">{e.pseudo}</td>
                  <td className="px-6 py-3 text-muted-foreground">{e.promotion}</td>
                  <td className="px-6 py-3">
                    <Tag tone={i < 2 ? "primary" : "muted"}>{i < 2 ? "formateur" : "apprenant"}</Tag>
                  </td>
                  <td className="px-6 py-3 text-right text-accent">{e.points}</td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => toast.info("Gestion des rôles active à l'étape backend.")}
                      className="rounded border border-border px-2 py-1 text-xs transition-colors hover:border-border-strong"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Journal" && (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div className="panel p-6">
            <SectionTitle label="Traçabilité" title="Journal d'activité" />
            <ul className="space-y-3">
              {auditLog.map((l, i) => (
                <li key={i} className="flex items-start gap-4 border-b border-border/50 pb-3 last:border-0">
                  <span className="mono-label w-20 shrink-0">{l.at}</span>
                  <span className="text-sm">
                    <span className="font-mono text-primary">{l.who}</span>{" "}
                    <span className="text-muted-foreground">{l.what}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-6">
            <div className="flex items-center gap-2">
              <Percent className="size-4 text-primary" />
              <h2 className="font-display text-sm font-semibold">Modération</h2>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Aucun signalement en attente. Les soumissions suspectes (flags partagés, essais en rafale)
              apparaîtront ici.
            </p>
            <button
              onClick={() => toast.info("Détection anti-triche active à l'étape backend.")}
              className="mt-4 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-border-strong"
            >
              Lancer une vérification
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
