import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Lightbulb } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { SectionTitle, Tag } from "@/components/ui-bits";
import { moduleById } from "@/lib/mock-data";

export const Route = createFileRoute("/parcours/$moduleId/lecon/$lessonId")({
  loader: ({ params }) => {
    const mod = moduleById(params.moduleId);
    const lesson = mod?.lessons.find((l) => l.id === params.lessonId);
    if (!mod || !lesson) throw notFound();
    return { mod, lesson };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Leçon introuvable — ESATIC Cyber" }, { name: "robots", content: "noindex" }] };
    }
    const { mod, lesson } = loaderData;
    const title = `${lesson.title} — ${mod.title} · ESATIC Cyber`;
    return {
      meta: [
        { title },
        { name: "description", content: lesson.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: lesson.summary },
      ],
    };
  },
  component: LessonPage,
});

function LessonPage() {
  const { mod, lesson } = Route.useLoaderData();
  const index = mod.lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = mod.lessons[index + 1];
  const prevLesson = mod.lessons[index - 1];

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [checked, setChecked] = useState(false);

  const correct = lesson.quiz.filter((q, i) => answers[i] === q.answer).length;

  return (
    <AppShell
      title={lesson.title}
      subtitle={`${mod.title} · Niveau ${mod.level} · Partie ${mod.part}`}
      actions={
        <Link
          to="/parcours/$moduleId"
          params={{ moduleId: mod.id }}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-border-strong"
        >
          <ArrowLeft className="size-3.5" /> Module
        </Link>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <article className="space-y-6">
          <div className="panel border-accent/40 bg-accent/5 p-6">
            <p className="mono-label text-accent">Démonstration d'introduction</p>
            <p className="mt-2 text-base">{lesson.demo}</p>
          </div>

          <div className="panel space-y-4 p-6 leading-relaxed">
            {lesson.content.map((p, i) => (
              <p key={i} className="text-muted-foreground">
                {p}
              </p>
            ))}
          </div>

          {lesson.commands.length > 0 && (
            <div className="panel overflow-hidden p-0">
              <p className="mono-label border-b border-border px-5 py-3">Commandes de la leçon</p>
              <pre className="overflow-x-auto bg-[oklch(0.13_0.015_250)] p-5 font-mono text-[0.8rem] leading-relaxed">
                {lesson.commands.map((c) => (
                  <div key={c}>
                    <span className="text-accent">$ </span>
                    <span>{c}</span>
                  </div>
                ))}
              </pre>
            </div>
          )}

          <div className="panel p-6">
            <SectionTitle label="Validation" title="Quiz de fin de leçon" />
            <div className="space-y-6">
              {lesson.quiz.map((q, qi) => (
                <fieldset key={qi}>
                  <legend className="font-medium">{q.question}</legend>
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, oi) => {
                      const selected = answers[qi] === oi;
                      const isRight = checked && oi === q.answer;
                      const isWrong = checked && selected && oi !== q.answer;
                      return (
                        <label
                          key={oi}
                          className={`flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 text-sm transition-colors ${
                            isRight
                              ? "border-success/60 bg-success/10"
                              : isWrong
                                ? "border-destructive/60 bg-destructive/10"
                                : selected
                                  ? "border-primary/60"
                                  : "border-border hover:border-border-strong"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q${qi}`}
                            className="accent-primary"
                            checked={selected}
                            onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                          />
                          {opt}
                        </label>
                      );
                    })}
                  </div>
                  {checked && (
                    <p className="mt-3 rounded-md border border-border bg-background/60 p-3 text-sm text-muted-foreground">
                      {q.explanation}
                    </p>
                  )}
                </fieldset>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setChecked(true);
                  const score = lesson.quiz.filter((q, i) => answers[i] === q.answer).length;
                  if (score === lesson.quiz.length) toast.success("Quiz validé, leçon terminée.");
                  else toast.error("Réponses incorrectes — relisez la correction.");
                }}
                className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Corriger
              </button>
              {checked && (
                <span className="font-mono text-sm text-muted-foreground">
                  {correct}/{lesson.quiz.length} correct{correct > 1 ? "es" : "e"}
                </span>
              )}
            </div>
          </div>

          <nav className="flex flex-wrap justify-between gap-3">
            {prevLesson ? (
              <Link
                to="/parcours/$moduleId/lecon/$lessonId"
                params={{ moduleId: mod.id, lessonId: prevLesson.id }}
                className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm transition-colors hover:border-border-strong"
              >
                <ArrowLeft className="size-4" /> {prevLesson.title}
              </Link>
            ) : (
              <span />
            )}
            {nextLesson && nextLesson.status !== "locked" && (
              <Link
                to="/parcours/$moduleId/lecon/$lessonId"
                params={{ moduleId: mod.id, lessonId: nextLesson.id }}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {nextLesson.title} <ArrowRight className="size-4" />
              </Link>
            )}
          </nav>
        </article>

        <aside className="space-y-6">
          <div className="panel p-6">
            <SectionTitle label="Sommaire" title="Leçons du module" />
            <ol className="space-y-2">
              {mod.lessons.map((l, i) => (
                <li key={l.id}>
                  {l.status === "locked" ? (
                    <span className="flex gap-3 rounded-md px-2 py-1.5 text-sm opacity-50">
                      <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                      {l.title}
                    </span>
                  ) : (
                    <Link
                      to="/parcours/$moduleId/lecon/$lessonId"
                      params={{ moduleId: mod.id, lessonId: l.id }}
                      className={`flex gap-3 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary ${
                        l.id === lesson.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <span className="font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
                      {l.title}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="panel p-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="size-4 text-warning" />
              <h3 className="font-display text-sm font-semibold">Pratique immédiate</h3>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Ouvrez le terminal d'entraînement pour rejouer les commandes de cette leçon sur la machine
              cible du laboratoire.
            </p>
            <Link
              to="/terminal"
              className="mt-4 inline-block rounded-md border border-border-strong px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              Ouvrir le terminal
            </Link>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {mod.keywords.map((k) => (
                <Tag key={k}>{k}</Tag>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
