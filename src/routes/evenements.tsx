import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, Flag, Users } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { SectionTitle, Tag } from "@/components/ui-bits";
import { events, leaderboard } from "@/lib/mock-data";

export const Route = createFileRoute("/evenements")({
  head: () => ({
    meta: [
      { title: "Événements CTF — ESATIC Cyber" },
      {
        name: "description",
        content:
          "CTF chronométrés internes : CTF de fin de partie, Nuit du Pentest ESATIC, classements dédiés par événement.",
      },
      { property: "og:title", content: "Événements CTF — ESATIC Cyber" },
      {
        property: "og:description",
        content: "Les compétitions internes de la Section Cybersécurité et leurs classements.",
      },
    ],
  }),
  component: Evenements,
});

function Evenements() {
  const live = events.filter((e) => e.status === "en cours");
  const upcoming = events.filter((e) => e.status === "à venir");
  const past = events.filter((e) => e.status === "terminé");

  return (
    <AppShell title="Événements CTF" subtitle="Compétitions internes chronométrées, classement dédié">
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          {[
            { label: "En cours", list: live },
            { label: "À venir", list: upcoming },
            { label: "Terminés", list: past },
          ].map((group) =>
            group.list.length ? (
              <section key={group.label}>
                <SectionTitle label={group.label} title={`${group.list.length} événement${group.list.length > 1 ? "s" : ""}`} />
                <div className="space-y-4">
                  {group.list.map((e) => (
                    <article
                      key={e.id}
                      className={`panel animate-rise p-6 ${
                        e.status === "en cours" ? "border-primary/40" : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Tag tone={e.status === "en cours" ? "primary" : "muted"}>{e.status}</Tag>
                        <Tag>{e.level}</Tag>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold">{e.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        <Stat icon={CalendarClock} label="Début" value={e.start} />
                        <Stat icon={CalendarClock} label="Durée" value={e.duration} />
                        <Stat icon={Users} label="Équipes" value={String(e.teams)} />
                        <Stat icon={Flag} label="Épreuves" value={String(e.challenges)} />
                      </dl>
                      {e.status !== "terminé" && (
                        <button
                          onClick={() =>
                            toast.success(
                              e.status === "en cours"
                                ? "Participation enregistrée (simulation)."
                                : "Vous serez prévenu à l'ouverture (simulation).",
                            )
                          }
                          className="mt-5 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          {e.status === "en cours" ? "Rejoindre le CTF" : "S'inscrire"}
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ) : null,
          )}
        </div>

        <aside className="space-y-6">
          <div className="panel p-6">
            <SectionTitle label="Événement en cours" title="Classement live" />
            <ol className="space-y-2.5">
              {leaderboard.slice(0, 8).map((e, i) => (
                <li key={e.pseudo} className="flex items-center gap-3 font-mono text-sm">
                  <span className="w-5 text-muted-foreground">{i + 1}</span>
                  <span className="flex-1 truncate">{e.pseudo}</span>
                  <span className="text-accent">{Math.round(e.points / 6)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs text-muted-foreground">
              Les points d'événement sont comptés séparément du classement général.
            </p>
          </div>

          <div className="panel p-6">
            <SectionTitle label="Règlement" title="Cadre des CTF internes" />
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>· Flags au format ESATIC&#123;...&#125;, vérifiés côté serveur.</li>
              <li>· Partage de flag interdit : détection automatique et annulation des points.</li>
              <li>· Les attaques ne visent que les cibles fournies par la plateforme.</li>
              <li>· Les indices débloqués réduisent les points de l'épreuve.</li>
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="mono-label flex items-center gap-1.5">
        <Icon className="size-3" />
        {label}
      </dt>
      <dd className="mt-1 font-mono text-sm">{value}</dd>
    </div>
  );
}
