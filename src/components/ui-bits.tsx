import { Link } from "@tanstack/react-router";
import { CheckCircle2, Lock, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { Challenge, Difficulty, LevelId, Module } from "@/lib/mock-data";

export function SectionTitle({
  label,
  title,
  action,
}: {
  label?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {label && <p className="mono-label">{label}</p>}
        <h2 className="mt-1 text-lg font-semibold">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="panel animate-rise p-4">
      <div className="flex items-start justify-between">
        <p className="mono-label">{label}</p>
        <Icon className="size-4 text-primary" />
      </div>
      <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Meter({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-700"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

const difficultyClasses: Record<Difficulty, string> = {
  Facile: "border-success/40 text-success",
  Moyen: "border-primary/40 text-primary",
  Difficile: "border-warning/40 text-warning",
  Insane: "border-destructive/40 text-destructive",
};

export function DifficultyTag({ difficulty }: { difficulty: Difficulty }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider",
        difficultyClasses[difficulty],
      )}
    >
      {difficulty}
    </span>
  );
}

export function Tag({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "primary" | "accent" }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider",
        tone === "muted" && "border-border text-muted-foreground",
        tone === "primary" && "border-primary/40 text-primary",
        tone === "accent" && "border-accent/40 text-accent",
      )}
    >
      {children}
    </span>
  );
}

const levelColor: Record<LevelId, string> = {
  1: "text-level-1",
  2: "text-level-2",
  3: "text-level-3",
};

export function LevelTag({ level }: { level: LevelId }) {
  return (
    <span className={cn("font-mono text-[0.65rem] uppercase tracking-wider", levelColor[level])}>
      Niveau {level}
    </span>
  );
}

export function ModuleCard({ module: mod }: { module: Module }) {
  return (
    <Link
      to="/parcours/$moduleId"
      params={{ moduleId: mod.id }}
      className={cn(
        "panel group animate-rise flex flex-col gap-4 p-5 transition-all hover:border-border-strong hover:shadow-glow",
        mod.locked && "opacity-70",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <LevelTag level={mod.level} />
            <span className="mono-label">Partie {mod.part}</span>
          </div>
          <h3 className="mt-2 font-display text-base font-semibold group-hover:text-primary">
            {mod.title}
          </h3>
        </div>
        {mod.locked ? (
          <Lock className="size-4 shrink-0 text-muted-foreground" />
        ) : mod.progress === 100 ? (
          <CheckCircle2 className="size-4 shrink-0 text-success" />
        ) : null}
      </div>

      <p className="line-clamp-3 text-sm text-muted-foreground">{mod.description}</p>

      <div className="flex flex-wrap gap-1.5">
        {mod.keywords.slice(0, 4).map((k) => (
          <Tag key={k}>{k}</Tag>
        ))}
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span>{mod.lessons.length} leçons</span>
          <span className={mod.progress === 100 ? "text-success" : "text-primary"}>
            {mod.progress}%
          </span>
        </div>
        <Meter value={mod.progress} />
      </div>
    </Link>
  );
}

export function ChallengeCard({ challenge: ch }: { challenge: Challenge }) {
  return (
    <Link
      to="/defis/$challengeId"
      params={{ challengeId: ch.id }}
      className="panel group animate-rise flex flex-col gap-3 p-5 transition-all hover:border-border-strong hover:shadow-glow"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Tag tone="primary">{ch.category}</Tag>
          <DifficultyTag difficulty={ch.difficulty} />
        </div>
        <span className="font-mono text-sm text-accent">{ch.points} pts</span>
      </div>

      <h3 className="font-display text-base font-semibold group-hover:text-primary">{ch.title}</h3>
      <p className="line-clamp-2 text-sm text-muted-foreground">{ch.statement[0]}</p>

      <div className="mt-auto flex items-center justify-between border-t border-border pt-3 font-mono text-xs text-muted-foreground">
        <span>{ch.solves} résolutions</span>
        <span
          className={cn(
            ch.status === "résolu" && "text-success",
            ch.status === "en cours" && "text-warning",
          )}
        >
          {ch.status}
        </span>
      </div>
    </Link>
  );
}
