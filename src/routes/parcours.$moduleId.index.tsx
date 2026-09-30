import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CheckCircle2, Circle, Lock, PlayCircle } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ChallengeCard, Meter, SectionTitle, Tag } from "@/components/ui-bits";
import { challengesForModule, moduleById } from "@/lib/mock-data";

export const Route = createFileRoute("/parcours/$moduleId")({
  loader: ({ params }) => {
    const mod = moduleById(params.moduleId);
    if (!mod) throw notFound();
    return { mod };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Module introuvable — ESATIC Cyber" }, { name: "robots", content: "noindex" }] };
    }
    const { mod } = loaderData;
    const title = `${mod.title} — Niveau ${mod.level} · ESATIC Cyber`;
    return {
      meta: [
        { title },
        { name: "description", content: mod.description },
        { property: "og:title", content: title },
        { property: "og:description", content: mod.description },
      ],
    };
  },
  component: ModuleDetail,
});

const statusIcon = {
  done: CheckCircle2,
  current: PlayCircle,
  todo: Circle,
  locked: Lock,
};

function ModuleDetail() {
  const { mod } = Route.useLoaderData();
  const linked = challengesForModule(mod.id);

  return (
    <AppShell
      title={mod.title}
      subtitle={`Niveau ${mod.level} · Partie ${mod.part} · ${mod.axis}`}
      actions={<span className="font-mono text-sm text-primary">{mod.progress}%</span>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="panel p-6">
            <p className="text-muted-foreground">{mod.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {mod.keywords.map((k) => (
                <Tag key={k} tone="primary">
                  {k}
                </Tag>
              ))}
            </div>
            <div className="mt-5">
              <Meter value={mod.progress} />
            </div>
            {mod.locked && (
              <p className="mt-4 rounded-md border border-warning/40 bg-warning/5 p-3 font-mono text-xs text-warning">
                Module verrouillé : terminez la partie précédente pour le débloquer.
              </p>
            )}
          </div>

          <div>
            <SectionTitle label="Contenu" title="Leçons" />
            <ol className="space-y-3">
              {mod.lessons.map((l, i) => {
                const Icon = statusIcon[l.status];
                const disabled = l.status === "locked";
                const inner = (
                  <>
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      className={`size-4 shrink-0 ${
                        l.status === "done"
                          ? "text-success"
                          : l.status === "current"
                            ? "text-primary"
                            : "text-muted-foreground"
                      }`}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{l.title}</span>
                      <span className="mt-0.5 block text-sm text-muted-foreground">{l.summary}</span>
                    </span>
                    <span className="mono-label shrink-0">{l.minutes} min</span>
                  </>
                );
                return (
                  <li key={l.id}>
                    {disabled ? (
                      <div className="panel flex items-center gap-4 p-4 opacity-55">{inner}</div>
                    ) : (
                      <Link
                        to="/parcours/$moduleId/lecon/$lessonId"
                        params={{ moduleId: mod.id, lessonId: l.id }}
                        className="panel flex items-center gap-4 p-4 transition-all hover:border-border-strong hover:shadow-glow"
                      >
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className="space-y-6">
          <div className="panel p-6">
            <SectionTitle label="Découpage" title="Thèmes de la partie" />
            <ul className="space-y-3">
              {mod.themes.map((t) => (
                <li key={t.label} className="flex items-start gap-3 text-sm">
                  <span className="font-mono text-xs text-primary">{t.weeks}</span>
                  <span className="text-muted-foreground">{t.label}</span>
                </li>
              ))}
              <li className="flex items-start gap-3 text-sm">
                <span className="font-mono text-xs text-accent">S6</span>
                <span className="text-muted-foreground">CTF final de la partie</span>
              </li>
            </ul>
          </div>

          <div>
            <SectionTitle label="Mise en pratique" title="Défis liés" />
            <div className="space-y-4">
              {linked.length ? (
                linked.map((c) => <ChallengeCard key={c.id} challenge={c} />)
              ) : (
                <p className="text-sm text-muted-foreground">Aucun défi publié pour cette partie.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
