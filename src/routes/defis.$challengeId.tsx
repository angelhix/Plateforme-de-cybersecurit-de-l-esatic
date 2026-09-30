import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Download, Lightbulb, Send, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { DifficultyTag, SectionTitle, Tag } from "@/components/ui-bits";
import { challengeById, moduleById } from "@/lib/mock-data";

export const Route = createFileRoute("/defis/$challengeId")({
  loader: ({ params }) => {
    const challenge = challengeById(params.challengeId);
    if (!challenge) throw notFound();
    return { challenge };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Défi introuvable — ESATIC Cyber" }, { name: "robots", content: "noindex" }] };
    }
    const { challenge } = loaderData;
    const title = `${challenge.title} — Défi ${challenge.category} · ESATIC Cyber`;
    return {
      meta: [
        { title },
        { name: "description", content: challenge.statement[0]! },
        { property: "og:title", content: title },
        { property: "og:description", content: challenge.statement[0]! },
      ],
    };
  },
  component: ChallengeDetail,
});

function ChallengeDetail() {
  const { challenge } = Route.useLoaderData();
  const mod = moduleById(challenge.moduleId);

  const [flag, setFlag] = useState("");
  const [attempts, setAttempts] = useState(challenge.attemptsUsed);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [solved, setSolved] = useState(challenge.status === "résolu");

  const penalty = revealed.reduce((s, i) => s + challenge.hints[i].cost, 0);
  const remaining = challenge.maxAttempts - attempts;

  function submitFlag(e: React.FormEvent) {
    e.preventDefault();
    if (solved) return;
    if (remaining <= 0) {
      toast.error("Nombre d'essais épuisé pour ce défi.");
      return;
    }
    if (flag.trim() === challenge.flag) {
      setSolved(true);
      toast.success(`Flag correct — +${challenge.points - penalty} points.`);
    } else {
      setAttempts((a) => a + 1);
      toast.error(
        !flag.startsWith("ESATIC{")
          ? "Format attendu : ESATIC{...}"
          : `Flag incorrect. Essais restants : ${remaining - 1}`,
      );
    }
    setFlag("");
  }

  return (
    <AppShell
      title={challenge.title}
      subtitle={`${challenge.category} · ${challenge.difficulty} · par ${challenge.author}`}
      actions={<span className="font-mono text-sm text-accent">{challenge.points - penalty} pts</span>}
    >
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <div className="panel p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Tag tone="primary">{challenge.category}</Tag>
              <DifficultyTag difficulty={challenge.difficulty} />
              <Tag tone={solved ? "accent" : "muted"}>{solved ? "résolu" : challenge.status}</Tag>
            </div>
            <div className="mt-4 space-y-3 leading-relaxed text-muted-foreground">
              {challenge.statement.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {challenge.files.length > 0 && (
              <div className="mt-5">
                <p className="mono-label">Fichiers joints</p>
                <ul className="mt-2 space-y-2">
                  {challenge.files.map((f) => (
                    <li key={f.name}>
                      <button
                        onClick={() => toast.info("Téléchargement disponible à l'étape backend.")}
                        className="flex w-full items-center gap-3 rounded-md border border-border px-3 py-2.5 text-left text-sm transition-colors hover:border-border-strong"
                      >
                        <Download className="size-4 text-primary" />
                        <span className="flex-1 font-mono">{f.name}</span>
                        <span className="mono-label">{f.size}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <form onSubmit={submitFlag} className="panel p-6">
            <SectionTitle label="Soumission" title="Envoyer le flag" />
            {solved ? (
              <p className="rounded-md border border-success/40 bg-success/10 p-4 text-sm text-success">
                Défi résolu. Le flag a été validé et les points ajoutés à votre score.
              </p>
            ) : (
              <>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="ESATIC{...}"
                    className="flex-1 rounded-md border border-input bg-background px-3 py-2.5 font-mono text-sm outline-none focus:border-ring"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Send className="size-4" /> Soumettre
                  </button>
                </div>
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  Essais : {attempts}/{challenge.maxAttempts} · le flag est vérifié côté serveur, jamais
                  envoyé au navigateur.
                </p>
              </>
            )}
          </form>
        </div>

        <aside className="space-y-6">
          <div className="panel p-6">
            <SectionTitle label="Aide" title="Indices" />
            <p className="mb-4 text-xs text-muted-foreground">
              Le coût de chaque indice est déduit des points du défi.
            </p>
            <ul className="space-y-3">
              {challenge.hints.map((h, i) => (
                <li key={i} className="rounded-md border border-border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="mono-label">
                      Indice {i + 1} · −{h.cost} pts
                    </span>
                    {!revealed.includes(i) && (
                      <button
                        onClick={() => {
                          setRevealed((r) => [...r, i]);
                          toast.info(`Indice débloqué (−${h.cost} points).`);
                        }}
                        className="inline-flex items-center gap-1.5 rounded border border-border-strong px-2 py-1 font-mono text-xs transition-colors hover:bg-secondary"
                      >
                        <Lightbulb className="size-3" /> Débloquer
                      </button>
                    )}
                  </div>
                  {revealed.includes(i) && <p className="mt-2 text-sm text-muted-foreground">{h.text}</p>}
                </li>
              ))}
              {!challenge.hints.length && (
                <li className="text-sm text-muted-foreground">Aucun indice pour ce défi.</li>
              )}
            </ul>
          </div>

          <div className="panel p-6">
            <SectionTitle label="Statistiques" title="Ce défi" />
            <dl className="space-y-3 font-mono text-sm">
              <Row label="Résolutions" value={`${challenge.solves}`} icon />
              <Row label="Points de base" value={`${challenge.points}`} />
              <Row label="Pénalité indices" value={`−${penalty}`} />
              <Row label="Auteur" value={challenge.author} />
            </dl>
          </div>

          {mod && (
            <div className="panel p-6">
              <SectionTitle label="Rattaché à" title="Partie du programme" />
              <Link
                to="/parcours/$moduleId"
                params={{ moduleId: mod.id }}
                className="block rounded-md border border-border p-4 transition-colors hover:border-border-strong"
              >
                <span className="mono-label">
                  Niveau {mod.level} · Partie {mod.part}
                </span>
                <span className="mt-1 block font-medium">{mod.title}</span>
              </Link>
            </div>
          )}

          <Link
            to="/terminal"
            className="panel block p-6 transition-colors hover:border-border-strong"
          >
            <p className="mono-label">Laboratoire</p>
            <p className="mt-1 font-medium">Ouvrir le terminal d'entraînement</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Machine cible 10.10.10.5, session de 60 minutes.
            </p>
          </Link>
        </aside>
      </div>
    </AppShell>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-muted-foreground">
        {icon && <Users className="size-3.5" />}
        {label}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
