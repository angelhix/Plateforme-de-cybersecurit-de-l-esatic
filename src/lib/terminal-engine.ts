/**
 * Moteur de terminal simulé (phase 1 du cahier des charges).
 * Scénario : reconnaissance d'une machine cible d'entraînement.
 * La phase 2 remplacera ce moteur par une session WebSocket vers une VM isolée.
 */

export type Line = { kind: "input" | "output" | "error" | "success" | "info"; text: string };

type Node = { type: "dir"; children: Record<string, Node> } | { type: "file"; content: string };

const dir = (children: Record<string, Node>): Node => ({ type: "dir", children });
const file = (content: string): Node => ({ type: "file", content });

export const fsRoot: Node = dir({
  home: dir({
    etudiant: dir({
      "notes.txt": file(
        "Cible d'entraînement : 10.10.10.5\nUtilisateur de service : svc_backup\nNe pas oublier de scanner tous les ports.",
      ),
      ".bash_history": file(
        "ls -la\ncat notes.txt\nssh svc_backup@10.10.10.5\n# mot de passe noté dans .config/creds\nnmap -sV 10.10.10.5",
      ),
      ".config": dir({
        creds: file("svc_backup:Ch4ngeM3!2026"),
      }),
      "flag.txt": file("ESATIC{terminal_is_home}"),
    }),
  }),
  etc: dir({
    passwd: file(
      "root:x:0:0:root:/root:/bin/bash\netudiant:x:1000:1000::/home/etudiant:/bin/bash\nsvc_backup:x:1001:1001::/opt/backup:/bin/sh",
    ),
    crontab: file("* * * * * root /opt/backup/run.sh"),
  }),
  opt: dir({
    backup: dir({
      "run.sh": file("#!/bin/sh\n# sauvegarde quotidienne\ntar -czf /tmp/backup.tgz /home/etudiant"),
    }),
  }),
  root: dir({}),
});

function resolve(path: string[], node: Node = fsRoot): Node | null {
  let cur: Node = node;
  for (const seg of path) {
    if (cur.type !== "dir") return null;
    const next = cur.children[seg];
    if (!next) return null;
    cur = next;
  }
  return cur;
}

function normalize(cwd: string[], arg: string): string[] {
  const segs = arg.startsWith("/") ? arg.split("/") : [...cwd, ...arg.split("/")];
  const out: string[] = [];
  for (const s of segs) {
    if (!s || s === ".") continue;
    if (s === "..") out.pop();
    else out.push(s);
  }
  return out;
}

export const commandList = [
  "help",
  "ls",
  "cd",
  "pwd",
  "cat",
  "whoami",
  "id",
  "ip",
  "ping",
  "nmap",
  "ssh",
  "sudo",
  "find",
  "clear",
  "history",
  "submit",
];

export type EngineState = { cwd: string[]; scanned: boolean; objectives: Record<string, boolean> };

export const initialState: EngineState = {
  cwd: ["home", "etudiant"],
  scanned: false,
  objectives: { "flag-lu": false, "scan-effectue": false, "creds-trouves": false },
};

export const objectiveLabels: Record<string, string> = {
  "scan-effectue": "Scanner la machine cible 10.10.10.5",
  "creds-trouves": "Retrouver les identifiants du compte de service",
  "flag-lu": "Lire le flag de l'exercice",
};

export function prompt(state: EngineState) {
  const path = "/" + state.cwd.join("/");
  const short = path === "/home/etudiant" ? "~" : path;
  return `etudiant@esatic-lab:${short}$`;
}

export function runCommand(
  input: string,
  state: EngineState,
): { lines: Line[]; state: EngineState; clear?: boolean } {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [], state };

  const [cmd, ...args] = trimmed.split(/\s+/);
  const next: EngineState = { ...state, objectives: { ...state.objectives } };
  const out = (text: string, kind: Line["kind"] = "output"): Line => ({ kind, text });

  switch (cmd) {
    case "help":
      return {
        state: next,
        lines: [
          out("Commandes disponibles dans ce laboratoire simulé :", "info"),
          out("  ls, cd, pwd, cat, find      exploration du système de fichiers"),
          out("  whoami, id                  identité et groupes"),
          out("  ip a, ping <hôte>           réseau local"),
          out("  nmap [-sV] <hôte>           reconnaissance de services"),
          out("  ssh <user>@<hôte>           connexion distante"),
          out("  sudo -l                     droits sudo du compte courant"),
          out("  history, clear, help        utilitaires"),
          out("  submit ESATIC{...}          soumettre le flag trouvé"),
        ],
      };

    case "clear":
      return { state: next, lines: [], clear: true };

    case "pwd":
      return { state: next, lines: [out("/" + next.cwd.join("/"))] };

    case "whoami":
      return { state: next, lines: [out("etudiant")] };

    case "id":
      return {
        state: next,
        lines: [out("uid=1000(etudiant) gid=1000(etudiant) groupes=1000(etudiant),27(sudo)")],
      };

    case "ls": {
      const showHidden = args.includes("-la") || args.includes("-a") || args.includes("-al");
      const target = args.find((a) => !a.startsWith("-"));
      const node = resolve(target ? normalize(next.cwd, target) : next.cwd);
      if (!node) return { state: next, lines: [out(`ls: ${target} : aucun fichier de ce type`, "error")] };
      if (node.type === "file") return { state: next, lines: [out(target ?? "")] };
      const names = Object.keys(node.children).filter((n) => showHidden || !n.startsWith("."));
      if (!names.length) return { state: next, lines: [out("")] };
      return {
        state: next,
        lines: names.sort().map((n) => {
          const child = node.children[n]!;
          const isDir = child.type === "dir";
          const size = child.type === "file" ? String(child.content.length).padStart(4, " ") : "4096";
          return out(
            `${isDir ? "drwxr-xr-x" : "-rw-r--r--"}  etudiant  ${size}  ${n}${isDir ? "/" : ""}`,
          );
        }),
      };
    }

    case "cd": {
      const target = args[0] ?? "/home/etudiant";
      const path = normalize(next.cwd, target === "~" ? "/home/etudiant" : target);
      const node = resolve(path);
      if (!node) return { state: next, lines: [out(`cd: ${target} : aucun dossier de ce type`, "error")] };
      if (node.type !== "dir") return { state: next, lines: [out(`cd: ${target} : n'est pas un dossier`, "error")] };
      next.cwd = path;
      return { state: next, lines: [] };
    }

    case "cat": {
      if (!args[0]) return { state: next, lines: [out("cat : opérande manquante", "error")] };
      const node = resolve(normalize(next.cwd, args[0]));
      if (!node) return { state: next, lines: [out(`cat: ${args[0]} : aucun fichier de ce type`, "error")] };
      if (node.type === "dir") return { state: next, lines: [out(`cat: ${args[0]} : est un dossier`, "error")] };
      if (args[0].includes("creds")) next.objectives["creds-trouves"] = true;
      if (node.content.includes("ESATIC{")) next.objectives["flag-lu"] = true;
      return { state: next, lines: node.content.split("\n").map((l) => out(l)) };
    }

    case "find": {
      if (args.includes("-4000") || args.join(" ").includes("perm")) {
        return {
          state: next,
          lines: [
            out("/usr/bin/passwd"),
            out("/usr/bin/sudo"),
            out("/opt/backup/helper"),
            out("(un binaire SUID inhabituel dans /opt mérite un examen)", "info"),
          ],
        };
      }
      return {
        state: next,
        lines: [
          out("/home/etudiant"),
          out("/home/etudiant/notes.txt"),
          out("/home/etudiant/flag.txt"),
          out("/home/etudiant/.bash_history"),
          out("/home/etudiant/.config"),
          out("/home/etudiant/.config/creds"),
        ],
      };
    }

    case "ip":
      return {
        state: next,
        lines: [
          out("1: lo    inet 127.0.0.1/8"),
          out("2: eth0  inet 10.10.10.42/24  état UP"),
        ],
      };

    case "ping": {
      const host = args.find((a) => !a.startsWith("-")) ?? "";
      if (!host) return { state: next, lines: [out("ping : hôte manquant", "error")] };
      if (host !== "10.10.10.5")
        return { state: next, lines: [out(`ping: ${host} : hôte injoignable depuis le laboratoire`, "error")] };
      return {
        state: next,
        lines: [
          out("PING 10.10.10.5 56(84) octets de données."),
          out("64 octets de 10.10.10.5 : icmp_seq=1 ttl=64 temps=0.42 ms"),
          out("64 octets de 10.10.10.5 : icmp_seq=2 ttl=64 temps=0.38 ms"),
          out("--- statistiques ---  2 paquets transmis, 2 reçus, 0 % perte"),
        ],
      };
    }

    case "nmap": {
      const host = args.find((a) => /\d+\.\d+\.\d+\.\d+/.test(a));
      if (!host) return { state: next, lines: [out("nmap : préciser une cible, ex. nmap -sV 10.10.10.5", "error")] };
      if (host !== "10.10.10.5")
        return {
          state: next,
          lines: [out(`Nmap : aucun hôte actif sur ${host} dans ce laboratoire.`, "error")],
        };
      next.scanned = true;
      next.objectives["scan-effectue"] = true;
      const versions = args.includes("-sV");
      return {
        state: next,
        lines: [
          out("Démarrage de Nmap 7.94 sur 10.10.10.5"),
          out("Rapport de scan pour esatic-target (10.10.10.5)"),
          out("L'hôte est actif (latence 0.00041 s)."),
          out(""),
          out("PORT     ÉTAT  SERVICE" + (versions ? "   VERSION" : "")),
          out("22/tcp   open  ssh" + (versions ? "       OpenSSH 8.2p1" : "")),
          out("80/tcp   open  http" + (versions ? "      Apache httpd 2.4.41" : "")),
          out("2121/tcp open  ftp" + (versions ? "       vsftpd 2.3.4" : "")),
          out(""),
          versions
            ? out("vsftpd 2.3.4 est une version historiquement vulnérable — piste à creuser.", "info")
            : out("Ajoutez -sV pour obtenir les versions de services.", "info"),
        ],
      };
    }

    case "ssh": {
      const target = args[0] ?? "";
      if (!target.includes("@"))
        return { state: next, lines: [out("Utilisation : ssh utilisateur@hôte", "error")] };
      if (!next.scanned)
        return {
          state: next,
          lines: [out("ssh : connexion refusée. Commencez par identifier les services ouverts.", "error")],
        };
      return {
        state: next,
        lines: [
          out(`${target}'s password:`),
          out("Permission denied (publickey,password).", "error"),
          out("Un mot de passe traîne peut-être dans la configuration de l'utilisateur.", "info"),
        ],
      };
    }

    case "sudo": {
      if (args[0] === "-l")
        return {
          state: next,
          lines: [
            out("L'utilisateur etudiant peut exécuter les commandes suivantes sur esatic-lab :"),
            out("    (root) NOPASSWD: /usr/bin/find"),
            out("`find` exécutable en root permet une escalade directe.", "info"),
          ],
        };
      return { state: next, lines: [out("sudo : mot de passe requis dans ce laboratoire", "error")] };
    }

    case "submit": {
      const flag = args.join(" ").trim();
      if (flag === "ESATIC{terminal_is_home}") {
        next.objectives["flag-lu"] = true;
        return { state: next, lines: [out("Flag correct. Exercice validé, +50 points.", "success")] };
      }
      return { state: next, lines: [out("Flag incorrect. Continuez l'exploration.", "error")] };
    }

    default:
      return { state: next, lines: [out(`${cmd} : commande introuvable. Tapez help.`, "error")] };
  }
}
