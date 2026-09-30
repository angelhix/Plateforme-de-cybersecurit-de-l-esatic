import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/connexion")({
  head: () => ({
    meta: [
      { title: "Connexion — ESATIC Cyber" },
      {
        name: "description",
        content:
          "Connectez-vous ou créez votre compte sur la plateforme d'entraînement cybersécurité de l'ESATIC.",
      },
      { property: "og:title", content: "Connexion — ESATIC Cyber" },
      {
        property: "og:description",
        content: "Accès à la plateforme d'entraînement de la Section Cybersécurité de l'ESATIC.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 grid-backdrop opacity-50" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-surface shadow-panel lg:grid lg:grid-cols-2">
        <div className="hidden flex-col justify-between border-r border-border bg-[oklch(0.15_0.016_250)] p-8 lg:flex">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-md border border-border-strong font-mono text-sm font-bold text-primary">
              ES
            </span>
            <span className="font-display text-sm font-semibold">ESATIC Cyber</span>
          </Link>
          <div>
            <h2 className="font-display text-2xl font-semibold">
              La pratique d'abord.
              <br />
              <span className="text-primary">La théorie ensuite.</span>
            </h2>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>· 12 parties réparties sur 3 niveaux</li>
              <li>· Défis CTF au format ESATIC&#123;...&#125;</li>
              <li>· Terminal d'entraînement dans le navigateur</li>
              <li>· Classement archivé chaque année académique</li>
            </ul>
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            Charte d'utilisation : les techniques enseignées ne s'appliquent qu'aux cibles fournies.
          </p>
        </div>

        <div className="p-8">
          <div className="flex gap-1 rounded-md border border-border p-1">
            {(["connexion", "inscription"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded px-3 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                  mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success(
                mode === "connexion"
                  ? "Connexion simulée — les comptes réels arriveront avec le backend."
                  : "Inscription simulée — le compte sera créé à l'étape backend.",
              );
              void navigate({ to: "/tableau-de-bord" });
            }}
          >
            {mode === "inscription" && (
              <Field label="Pseudo" name="pseudo" placeholder="n0ctu4" />
            )}
            <Field
              label="Adresse email ESATIC"
              name="email"
              type="email"
              placeholder="prenom.nom@esatic.ci"
            />
            {mode === "inscription" && (
              <Field label="Promotion / filière" name="promo" placeholder="L2 RIT" />
            )}
            <Field label="Mot de passe" name="password" type="password" placeholder="••••••••" />

            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {mode === "connexion" ? "Se connecter" : "Créer mon compte"}
            </button>

            <p className="text-center font-mono text-xs text-muted-foreground">
              {mode === "connexion" ? (
                <button type="button" className="hover:text-primary" onClick={() => toast.info("Fonction disponible à l'étape backend.")}>
                  Mot de passe oublié ?
                </button>
              ) : (
                "Un email de vérification sera envoyé à l'adresse indiquée."
              )}
            </p>
          </form>

          <p className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
            Version de démonstration : les données affichées sont simulées, aucun compte n'est encore
            enregistré.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mono-label">{label}</span>
      <input
        name={name}
        type={type}
        required
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ring"
      />
    </label>
  );
}
