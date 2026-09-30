import { Link, useRouterState } from "@tanstack/react-router";
import {
  Flag,
  Home,
  LayoutDashboard,
  Route as RouteIcon,
  Shield,
  SquareTerminal,
  Trophy,
  User,
  Swords,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { currentUser, rankFor } from "@/lib/mock-data";

const nav = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/parcours", label: "Parcours", icon: RouteIcon },
  { to: "/defis", label: "Défis", icon: Flag },
  { to: "/terminal", label: "Terminal & labs", icon: SquareTerminal },
  { to: "/classement", label: "Classement", icon: Trophy },
  { to: "/evenements", label: "Événements CTF", icon: Swords },
  { to: "/profil", label: "Profil", icon: User },
  { to: "/administration", label: "Administration", icon: Shield },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const rank = rankFor(currentUser.points);

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Link to="/" onClick={onNavigate} className="flex items-center gap-2.5 px-2 py-1">
        <span className="flex size-9 items-center justify-center rounded-md border border-border-strong bg-background font-mono text-sm font-bold text-primary">
          ES
        </span>
        <span className="leading-tight">
          <span className="block font-display text-sm font-semibold">ESATIC Cyber</span>
          <span className="mono-label">Section cybersécurité</span>
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent text-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <item.icon className={cn("size-4", active && "text-primary")} />
              {item.label}
              {active && <span className="ml-auto size-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>

      <Link
        to="/profil"
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-md border border-border bg-background/60 p-3 transition-colors hover:border-border-strong"
      >
        <span className="flex size-9 items-center justify-center rounded-md bg-primary/15 font-mono text-xs font-bold text-primary">
          {currentUser.pseudo.slice(0, 2).toUpperCase()}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate font-mono text-sm">{currentUser.pseudo}</span>
          <span className="mono-label">
            {rank.name} · {currentUser.points} pts
          </span>
        </span>
      </Link>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-sidebar-border bg-sidebar lg:block">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-background/80"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-sidebar-border bg-sidebar">
            <button
              aria-label="Fermer"
              className="absolute right-3 top-4 text-muted-foreground"
              onClick={() => setOpen(false)}
            >
              <X className="size-4" />
            </button>
            <SidebarContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex flex-wrap items-center gap-4 border-b border-border bg-background/85 px-4 py-4 backdrop-blur md:px-8">
          <button
            aria-label="Ouvrir le menu"
            className="text-muted-foreground lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="size-5" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold md:text-2xl">{title}</h1>
            {subtitle && (
              <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
