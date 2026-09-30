import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "@/lib/utils";
import {
  commandList,
  initialState,
  prompt,
  runCommand,
  type EngineState,
  type Line,
} from "@/lib/terminal-engine";

const banner: Line[] = [
  { kind: "info", text: "ESATIC Lab — environnement d'entraînement simulé (phase 1)" },
  { kind: "output", text: "Cible du scénario : 10.10.10.5 · tapez `help` pour la liste des commandes." },
  { kind: "output", text: "" },
];

const lineColor: Record<Line["kind"], string> = {
  input: "text-foreground",
  output: "text-muted-foreground",
  error: "text-destructive",
  success: "text-success",
  info: "text-primary",
};

export function SimTerminal({
  onObjectives,
  className,
}: {
  onObjectives?: (objectives: Record<string, boolean>) => void;
  className?: string;
}) {
  const [lines, setLines] = useState<Line[]>(banner);
  const [state, setState] = useState<EngineState>(initialState);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    onObjectives?.(state.objectives);
  }, [state.objectives, onObjectives]);

  function submit() {
    const entry = value;
    const currentPrompt = prompt(state);
    const result = runCommand(entry, state);
    setState(result.state);
    setHistory((h) => (entry.trim() ? [...h, entry.trim()] : h));
    setHistoryIndex(null);
    setValue("");
    setLines((prev) =>
      result.clear
        ? []
        : [...prev, { kind: "input", text: `${currentPrompt} ${entry}` }, ...result.lines],
    );
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const word = value.split(/\s+/).pop() ?? "";
      const match = commandList.find((c) => c.startsWith(word) && word.length > 0);
      if (match) setValue(value.slice(0, value.length - word.length) + match + " ");
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const idx = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      setValue(history[idx]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const idx = historyIndex + 1;
      if (idx >= history.length) {
        setHistoryIndex(null);
        setValue("");
      } else {
        setHistoryIndex(idx);
        setValue(history[idx]);
      }
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border-strong bg-[oklch(0.13_0.015_250)]",
        className,
      )}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-destructive/70" />
        <span className="size-2.5 rounded-full bg-warning/70" />
        <span className="size-2.5 rounded-full bg-success/70" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          etudiant@esatic-lab — bash
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[0.8rem] leading-relaxed">
        {lines.map((line, i) => (
          <p key={i} className={cn("whitespace-pre-wrap break-words", lineColor[line.kind])}>
            {line.text || "\u00a0"}
          </p>
        ))}

        <div className="flex items-center gap-2">
          <span className="shrink-0 text-accent">{prompt(state)}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            aria-label="Entrée du terminal"
            className="w-full flex-1 bg-transparent font-mono text-[0.8rem] text-foreground outline-none"
          />
        </div>
      </div>
    </div>
  );
}
