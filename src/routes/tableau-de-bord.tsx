import { createFileRoute, Link } from "@tanstack/react-router";
import { Flag, Flame, Target, Trophy } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ChallengeCard, Meter, SectionTitle, StatCard, Tag } from "@/components/ui-bits";
import {
  activity,
  badges,
  challenges,
  currentUser,
  events,
  modules,
  nextRankFor,
  rankFor,
  recentSolves,
} from "@/lib/mock-data";

export const Route = createFileRoute("/tableau-de-bord")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — ESATIC Cyber" },
      {
        name: "description",
        content:
          "Progression, points, rang, défis récents et prochaine leçon : votre suivi d'entraînement cybersécurité.",
      },
      { property: "og:title", content: "Tableau de bord — ESATIC Cyber" },
      {
        property: "og:description",
        content: "Suivez votre progression, votre rang et vos défis résolus.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const rank = rankFor(currentUser.points);
  const next = nextRankFor(currentUser.points);
  const currentModule = modules.find((m) => m.progress > 0 && m.progress < 100) ?? modules[0]!;
  const currentLesson =
    currentModule.lessons.find((l) => l.status === "current") ?? currentModule.lessons[0]!;
  const suggested = challenges.filter((c) => c.status !== "résolu").slice(0, 3);
  const liveEvent = events.find((e) => e.status === "en cours");
  const maxPoints = Math.max(...activity.map((a) => a.points), 1);

  return (
    <AppShell
      title={`Bonjour ${currentUser.pseudo}`}
      subtitle={`${rank.name} · ${currentUser.points} points · ${currentUser.promotion}`}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Target} label="Points" value={currentUser.points} hint={`Rang : ${rank.name}`} />
        <StatCard icon={Flag} label="Défis résolus" value={currentUser.solved} hint="sur 14 publiés" />
        <StatCard
          icon={Trophy}
          label="Classement général"
          value={`#${currentUser.position}`}
          hint="Saison 2025–2026"
        />
        <StatCard
          icon={Flame}
          label="Série active"
          value={`${currentUser.streak} jours`}
          hint="Continuez aujourd'hui"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="panel p-6">
            <SectionTitle label="Reprendre" title="Votre prochaine leçon" />
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone="primary">Niveau {currentModule.level}</Tag>
                  <Tag>Partie {currentModule.part}</Tag>
                  <Tag>{currentModule.axis}</Tag>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{currentLesson.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{currentLesson.summary}</p>
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  {currentModule.title} · {currentLesson.minutes} min
                </p>
              </div>
              <Link
                to="/parcours/$moduleId/lecon/$lessonId"
                params={{ moduleId: currentModule.id, lessonId: currentLesson.id }}
                className="shrink-0 rounded-md bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Continuer
              </Link>
            </div>
            <div className="mt-5">
              <div className="mb-1.5 flex justify-between font-mono text-xs text-muted-foreground">
                <span>Progression du module</span>
                <span className="text-primary">{currentModule.progress}%</span>
              </div>
              <Meter value={currentModule.progress} />
            </div>
          </div>

          <div>
            <SectionTitle
              label="Catalogue"
              title="Défis suggérés"
              action={
                <Link to="/defis" className="font-mono text-xs uppercase tracking-wider text-primary hover:underline">
                  Tout voir
                </Link>
              }
            />
            <div className="grid gap-4 md:grid-cols-3">
              {suggested.map((c) => (
                <ChallengeCard key={c.id} challenge={c} />
              ))}
            </div>
          </div>

          <div className="panel p-6">
            <SectionTitle label="7 derniers jours" title="Points gagnés" />
            <div className="flex h-40 items-end gap-3">
              {activity.map((a) => (
                <div key={a.day} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-primary/70 transition-all"
                      style={{ height: `${(a.points / maxPoints) * 100}%` }}
                    />
                  </div>
                  <span className="mono-label">{a.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {liveEvent && (
            <div className="panel border-primary/40 p-6">
              <p className="mono-label text-primary">Événement en cours</p>
              <h3 className="mt-2 font-display text-base font-semibold">{liveEvent.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{liveEvent.description}</p>
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                {liveEvent.start} · {liveEvent.duration} · {liveEvent.teams} équipes
              </p>
              <Link
                to="/evenements"
                className="mt-4 inline-block rounded-md border border-border-strong px-3 py-2 text-sm transition-colors hover:bg-secondary"
              >
                Rejoindre
              </Link>
            </div>
          )}

          <div className="panel p-6">
            <SectionTitle label="Progression de rang" title={`${rank.name} → ${next?.name ?? "maximum"}`} />
            {next ? (
              <>
                <Meter value={((currentUser.points - rank.min) / (next.min - rank.min)) * 100} />
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {next.min - currentUser.points} points avant {next.name}
                </p>
              </>
            ) : (
              <p className="font-mono text-xs text-muted-foreground">Rang maximal atteint.</p>
            )}
          </div>

          <div className="panel p-6">
            <SectionTitle label="Historique" title="Défis résolus récemment" />
            <ul className="space-y-3">
              {recentSolves.map((s) => (
                <li key={s.challenge} className="flex items-center gap-3 text-sm">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate">{s.challenge}</span>
                    <span className="mono-label">
                      {s.category} · {s.when}
                    </span>
                  </span>
                  <span className="font-mono text-accent">+{s.points}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel p-6">
            <SectionTitle label="Gamification" title="Badges" />
            <div className="grid grid-cols-2 gap-3">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`rounded-md border p-3 ${
                    b.obtained ? "border-accent/40 bg-accent/5" : "border-border opacity-50"
                  }`}
                >
                  <p className="font-mono text-xs font-medium">{b.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
