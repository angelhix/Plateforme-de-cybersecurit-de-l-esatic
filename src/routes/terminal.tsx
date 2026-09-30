import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Play, RotateCcw, Square } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { SectionTitle, Tag } from "@/components/ui-bits";
import { SimTerminal } from "@/components/sim-terminal";
import { objectiveLabels } from "@/lib/terminal-engine";

export const Route = createFileRoute("/terminal")({
  head: () => ({
    meta: [
      { title: "Terminal & laboratoires — ESATIC Cyber" },
      {
        name: "description",
        content:
          "Terminal d'entraînement dans le navigateur : commandes réalistes, machine cible isolée et objectifs vérifiés automatiquement.",
      },
      { property: "og:title", content: "Terminal & laboratoires — ESATIC Cyber" },
      {
        property: "og:description",
        content: "Rejouez les commandes de vos leçons sur une machine cible d'entraînement.",
      },
    ],
  }),
  component: TerminalPage,
});

function TerminalPage() {
  const [running, setRunning] = useState(true);
  const [seconds, setSeconds] = useState(60 * 60);
  const [reset, setReset] = useState(0);
  const [objectives, setObjectives] = useState<Record<string, boolean>>({});

  const handleObjectives = useCallback((o: Record<string, boolean>) => setObjectives(o), []);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const done = Object.values(objectives).filter(Boolean).length;
  const total = Object.keys(objectiveLabels).length;

  return (
    <AppShell
      title="Terminal & laboratoires"
      subtitle="Phase 1 — moteur simulé. La phase 2 branchera ce terminal sur une VM isolée par utilisateur."
      actions={
        <span className="rounded-md border border-border px-3 py-2 font-mono text-sm text-primary">
          {mm}:{ss}
        </span>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <SimTerminal key={reset} onObjectives={handleObjectives} className="h-[70vh] min-h-[480px]" />

        <aside className="space-y-6">
          <div className="panel p-6">
            <SectionTitle label="Machine cible" title="esatic-target" />
            <dl className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Adresse</dt>
                <dd>10.10.10.5</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Votre poste</dt>
                <dd>10.10.10.42</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">État</dt>
                <dd className={running ? "text-success" : "text-muted-foreground"}>
                  {running ? "en marche" : "arrêtée"}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Réseau</dt>
                <dd className="text-warning">isolé</dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setRunning(true);
                  toast.success("Machine cible démarrée.");
                }}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Play className="size-3.5" /> Démarrer
              </button>
              <button
                onClick={() => {
                  setRunning(false);
                  toast.info("Machine cible arrêtée.");
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-border-strong"
              >
                <Square className="size-3.5" /> Arrêter
              </button>
              <button
                onClick={() => {
                  setReset((r) => r + 1);
                  setSeconds(60 * 60);
                  setRunning(true);
                  toast.success("Laboratoire réinitialisé.");
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-border-strong"
              >
                <RotateCcw className="size-3.5" /> Réinitialiser
              </button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Session limitée à 60 minutes, détruite automatiquement à l'expiration. La cible n'a accès ni à
              internet ni au réseau de l'école.
            </p>
          </div>

          <div className="panel p-6">
            <SectionTitle
              label={`${done}/${total} validés`}
              title="Objectifs du scénario"
            />
            <ul className="space-y-3">
              {Object.entries(objectiveLabels).map(([key, label]) => {
                const ok = objectives[key];
                return (
                  <li key={key} className="flex items-start gap-3 text-sm">
                    {ok ? (
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                    ) : (
                      <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={ok ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="panel p-6">
            <SectionTitle label="Aide-mémoire" title="Commandes du scénario" />
            <div className="flex flex-wrap gap-1.5">
              {["ls -la", "cat .bash_history", "nmap -sV 10.10.10.5", "sudo -l", "find / -perm -4000", "submit"].map(
                (c) => (
                  <Tag key={c}>{c}</Tag>
                ),
              )}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Flèches haut/bas pour l'historique, Tab pour l'autocomplétion, `help` pour la liste complète.
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
