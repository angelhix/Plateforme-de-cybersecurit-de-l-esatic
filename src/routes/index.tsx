import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Flag, GraduationCap, SquareTerminal, Trophy } from "lucide-react";

import { levels, modules, challenges, adminStats, leaderboard } from "@/lib/mock-data";
import { LevelTag, Meter, Tag } from "@/components/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ESATIC Cyber — Apprendre la cybersécurité par la pratique" },
      {
        name: "description",
        content:
          "Parcours guidés, défis CTF, terminal dans le navigateur et classement conservé d'une génération à l'autre. La plateforme de la Section Cybersécurité de l'ESATIC.",
      },
      { property: "og:title", content: "ESATIC Cyber — Apprendre la cybersécurité par la pratique" },
      {
        property: "og:description",
        content:
          "Trois niveaux, quatre axes, des défis CTF et un terminal d'entraînement. Plateforme du Club Informatique de l'ESATIC.",
      },
    ],
  }),
  component: Landing,
});

const axes = [
  { n: 1, title: "Systèmes & Réseaux", text: "Le terrain : Linux, permissions, processus, OSI et TCP/IP." },
  { n: 2, title: "Recon, Scan & Analyse", text: "OSINT, dorks, Nmap, Wireshark — collecter avant d'agir." },
  { n: 3, title: "Web, BDD & Crypto", text: "HTTP, injections, vulnérabilités applicatives, cryptographie." },
  { n: 4, title: "Exploitation & Post-exploit.", text: "Exploits, shells, escalade, Active Directory, rapport." },
];

function Landing() {
  const featured = challenges.filter((c) => c.difficulty !== "Insane").slice(0, 3);
  const level1 = modules.filter((m) => m.level === 1);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md border border-border-strong font-mono text-sm font-bold text-primary">
              ES
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-semibold">ESATIC Cyber</span>
              <span className="mono-label">Club Informatique · Section Cyber</span>
            </span>
          </div>
          <nav className="hidden items-center gap-6 font-mono text-xs uppercase tracking-wider text-muted-foreground md:flex">
            <Link to="/parcours" className="transition-colors hover:text-primary">
              Parcours
            </Link>
            <Link to="/defis" className="transition-colors hover:text-primary">
              Défis
            </Link>
            <Link to="/terminal" className="transition-colors hover:text-primary">
              Terminal
            </Link>
            <Link to="/classement" className="transition-colors hover:text-primary">
              Classement
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/connexion"
              className="rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-border-strong"
            >
              Connexion
            </Link>
            <Link
              to="/tableau-de-bord"
              className="hidden rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:block"
            >
              Commencer
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-backdrop opacity-60" />
        <div className="relative mx-auto grid max-w-[1600px] gap-10 px-4 py-16 md:px-8 md:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="animate-rise">
            <p className="mono-label">Plateforme interne · usage pédagogique</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.05] md:text-6xl">
              Apprendre la cybersécurité <span className="text-primary glow-text">par la pratique</span>, à
              l'ESATIC.
            </h1>
            <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
              Trois niveaux, quatre axes qui suivent la chronologie d'un pentest, des défis CTF avec flags
              au format <span className="font-mono text-foreground">ESATIC&#123;...&#125;</span>, un terminal
              d'entraînement dans le navigateur et un classement conservé d'une génération à l'autre.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/parcours"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Voir les parcours <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/terminal"
                className="inline-flex items-center gap-2 rounded-md border border-border-strong px-5 py-3 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <SquareTerminal className="size-4" /> Essayer le terminal
              </Link>
            </div>

            <dl className="mt-12 grid max-w-2xl grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { k: "Membres", v: adminStats.members },
                { k: "Défis", v: challenges.length },
                { k: "Leçons", v: adminStats.publishedLessons },
                { k: "Soumissions", v: adminStats.submissions },
              ].map((s) => (
                <div key={s.k}>
                  <dd className="font-display text-2xl font-semibold text-primary">{s.v}</dd>
                  <dt className="mono-label mt-1">{s.k}</dt>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-rise panel overflow-hidden p-0 font-mono text-[0.78rem] shadow-panel">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
              <span className="size-2.5 rounded-full bg-destructive/70" />
              <span className="size-2.5 rounded-full bg-warning/70" />
              <span className="size-2.5 rounded-full bg-success/70" />
              <span className="ml-2 text-xs text-muted-foreground">esatic-lab — démonstration</span>
            </div>
            <div className="space-y-1 bg-[oklch(0.13_0.015_250)] p-5 leading-relaxed">
              <p className="text-accent">etudiant@esatic-lab:~$ nmap -sV 10.10.10.5</p>
              <p className="text-muted-foreground">PORT     ÉTAT  SERVICE   VERSION</p>
              <p className="text-muted-foreground">22/tcp   open  ssh       OpenSSH 8.2p1</p>
              <p className="text-muted-foreground">80/tcp   open  http      Apache httpd 2.4.41</p>
              <p className="text-muted-foreground">2121/tcp open  ftp       vsftpd 2.3.4</p>
              <p className="text-primary">→ version historiquement vulnérable, piste à creuser</p>
              <p className="mt-3 text-accent">etudiant@esatic-lab:~$ cat .config/creds</p>
              <p className="text-muted-foreground">svc_backup:Ch4ngeM3!2026</p>
              <p className="mt-3 text-accent">
                etudiant@esatic-lab:~$ submit ESATIC&#123;...&#125;
                <span className="ml-1 inline-block animate-blink">▋</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <p className="mono-label">Chronologie d'un pentest</p>
          <h2 className="mt-2 text-2xl font-semibold md:text-3xl">Quatre axes, revus à trois niveaux</h2>
          <p className="mt-3 max-w-3xl text-muted-foreground">
            Les mêmes axes reviennent chaque année : ce qui change, c'est la profondeur. La cryptographie
            sert au réseau, au web et aux bases de données — les modules se recoupent au lieu de s'enchaîner
            comme des sujets isolés.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {axes.map((a) => (
              <article key={a.n} className="panel animate-rise p-5">
                <span className="font-mono text-3xl font-bold text-primary/25">0{a.n}</span>
                <h3 className="mt-2 font-display text-base font-semibold">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {levels.map((l) => (
              <div key={l.id} className="panel p-5">
                <LevelTag level={l.id} />
                <h3 className="mt-2 font-display text-base font-semibold">{l.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{l.tagline}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-[1600px] gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="mono-label">Niveau 1 · Débutant</p>
                <h2 className="mt-2 text-2xl font-semibold">Commencer sans prérequis</h2>
              </div>
              <Link
                to="/parcours"
                className="font-mono text-xs uppercase tracking-wider text-primary hover:underline"
              >
                Tous les parcours
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {level1.map((m) => (
                <Link
                  key={m.id}
                  to="/parcours/$moduleId"
                  params={{ moduleId: m.id }}
                  className="panel group flex flex-col gap-3 p-5 transition-all hover:border-border-strong md:flex-row md:items-center md:gap-6"
                >
                  <span className="font-mono text-xs text-muted-foreground">P{m.part}</span>
                  <span className="flex-1">
                    <span className="block font-display font-semibold group-hover:text-primary">
                      {m.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {m.themes.map((t) => t.label).join(" · ")}
                    </span>
                  </span>
                  <span className="w-full md:w-40">
                    <span className="mb-1 block font-mono text-xs text-muted-foreground">
                      {m.progress}%
                    </span>
                    <Meter value={m.progress} />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-2xl font-semibold">Défis en vedette</h2>
              <Link
                to="/defis"
                className="font-mono text-xs uppercase tracking-wider text-primary hover:underline"
              >
                Catalogue
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {featured.map((c) => (
                <Link
                  key={c.id}
                  to="/defis/$challengeId"
                  params={{ challengeId: c.id }}
                  className="panel group flex items-center gap-4 p-4 transition-all hover:border-border-strong"
                >
                  <Flag className="size-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium group-hover:text-primary">{c.title}</span>
                    <span className="mt-1 flex gap-1.5">
                      <Tag tone="primary">{c.category}</Tag>
                      <Tag>{c.difficulty}</Tag>
                    </span>
                  </span>
                  <span className="font-mono text-sm text-accent">{c.points}</span>
                </Link>
              ))}
            </div>

            <div className="panel mt-6 p-5">
              <div className="flex items-center gap-2">
                <Trophy className="size-4 text-primary" />
                <h3 className="font-display text-sm font-semibold">Haut du classement</h3>
              </div>
              <ol className="mt-4 space-y-2.5">
                {leaderboard.slice(0, 5).map((e) => (
                  <li key={e.pseudo} className="flex items-center gap-3 font-mono text-sm">
                    <span className="w-5 text-muted-foreground">{e.rankPosition}</span>
                    <span className="flex-1 truncate">{e.pseudo}</span>
                    <span className="text-xs text-muted-foreground">{e.promotion}</span>
                    <span className="text-accent">{e.points}</span>
                  </li>
                ))}
              </ol>
              <Link
                to="/classement"
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-primary hover:underline"
              >
                Classement complet <ArrowRight className="size-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="panel flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <GraduationCap className="size-5 text-primary" />
              <h2 className="mt-3 text-2xl font-semibold">Prêt pour votre première séance ?</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">
                Un document préparatoire avant la séance, la pratique pendant. Les techniques enseignées ne
                s'appliquent qu'aux cibles fournies par la plateforme.
              </p>
            </div>
            <Link
              to="/connexion"
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Créer mon compte <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="mt-8 font-mono text-xs text-muted-foreground">
            ESATIC Cyber · Section Cybersécurité du Club Informatique · document interne, usage pédagogique
          </p>
        </div>
      </section>
    </div>
  );
}
