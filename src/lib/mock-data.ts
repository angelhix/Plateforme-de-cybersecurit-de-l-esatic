/**
 * Données simulées (mock) — étape 1/2 du cahier des charges.
 * Structure calquée sur la matrice 3 niveaux × 4 parties de la Section Cybersécurité.
 * À remplacer par l'API lors de l'étape « Intégration ».
 */

export type LevelId = 1 | 2 | 3;

export const levels: {
  id: LevelId;
  label: string;
  tagline: string;
  token: string;
}[] = [
  {
    id: 1,
    label: "Niveau 1 · Débutant",
    tagline: "Zéro prérequis — on part du terminal et du modèle réseau.",
    token: "level-1",
  },
  {
    id: 2,
    label: "Niveau 2 · Intermédiaire",
    tagline: "Administration, exploitation web, post-exploitation et AD.",
    token: "level-2",
  },
  {
    id: 3,
    label: "Niveau 3 · Avancé",
    tagline: "Furtivité, chaînes d'exploitation, mouvement latéral, reporting.",
    token: "level-3",
  },
];

export type Axis = "Terrain" | "Reconnaissance" | "Surface applicative" | "Exploitation";

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  status: "done" | "current" | "locked" | "todo";
  summary: string;
  demo: string;
  content: string[];
  commands: string[];
  quiz: {
    question: string;
    options: string[];
    answer: number;
    explanation: string;
  }[];
};

export type Module = {
  id: string;
  part: 1 | 2 | 3 | 4;
  level: LevelId;
  axis: Axis;
  title: string;
  description: string;
  themes: { label: string; weeks: string }[];
  keywords: string[];
  progress: number;
  locked: boolean;
  challengeIds: string[];
  lessons: Lesson[];
};

const quizPool = (question: string, options: string[], answer: number, explanation: string) => [
  { question, options, answer, explanation },
];

function lesson(
  id: string,
  title: string,
  minutes: number,
  status: Lesson["status"],
  summary: string,
  demo: string,
  content: string[],
  commands: string[],
  quiz: Lesson["quiz"],
): Lesson {
  return { id, title, minutes, status, summary, demo, content, commands, quiz };
}

export const modules: Module[] = [
  {
    id: "n1-p1",
    part: 1,
    level: 1,
    axis: "Terrain",
    title: "Bases Linux & réseau",
    description:
      "Le terrain de jeu : se déplacer dans un système Linux, comprendre les permissions, les processus, puis lire le réseau avec le modèle OSI et TCP/IP.",
    themes: [
      { label: "Terminal, permissions, processus", weeks: "S1–S3" },
      { label: "Modèle OSI / TCP-IP, protocoles", weeks: "S4–S5" },
    ],
    keywords: ["terminal", "permissions", "processus", "OSI", "TCP/IP"],
    progress: 100,
    locked: false,
    challengeIds: ["c-linux-1", "c-net-1"],
    lessons: [
      lesson(
        "l-n1p1-1",
        "Le terminal, votre premier outil",
        18,
        "done",
        "Naviguer, lire, écrire : les 12 commandes qui couvrent 90 % du travail quotidien.",
        "En trois commandes, on retrouve un mot de passe laissé en clair dans l'historique d'un utilisateur négligent.",
        [
          "Un pentesteur passe l'essentiel de son temps dans un terminal. Avant tout outil offensif, il faut être rapide dans le système lui-même.",
          "Le système de fichiers Linux est un arbre unique dont la racine est `/`. Tout est fichier : un disque, un socket réseau, un processus.",
          "On travaille toujours depuis un répertoire courant. `pwd` l'affiche, `cd` le change, `ls` liste ce qu'il contient.",
        ],
        ["pwd", "ls -la /home/etudiant", "cat /home/etudiant/.bash_history"],
        quizPool(
          "Quelle commande affiche le répertoire courant ?",
          ["ls", "pwd", "cd", "whoami"],
          1,
          "`pwd` (print working directory) affiche le chemin absolu du répertoire courant.",
        ),
      ),
      lesson(
        "l-n1p1-2",
        "Permissions et utilisateurs",
        22,
        "done",
        "Lire un `-rwxr-xr--`, comprendre root, sudo, et pourquoi un bit mal placé donne le système entier.",
        "Un script de sauvegarde inscriptible par tous, lancé par root : trois lignes ajoutées et la machine est à nous.",
        [
          "Chaque fichier appartient à un utilisateur et à un groupe, avec trois triplets de droits : propriétaire, groupe, autres.",
          "L'escalade de privilèges commence presque toujours par une permission trop large : un fichier sensible lisible, un script inscriptible, un binaire SUID.",
        ],
        ["whoami", "id", "ls -l /etc/shadow", "find / -perm -4000 -type f"],
        quizPool(
          "Que signifie le bit SUID sur un binaire ?",
          [
            "Le binaire est caché",
            "Le binaire s'exécute avec les droits de son propriétaire",
            "Le binaire est chiffré",
            "Le binaire ne peut pas être supprimé",
          ],
          1,
          "SUID fait tourner le programme avec les privilèges du propriétaire — souvent root, donc une voie d'escalade classique.",
        ),
      ),
      lesson(
        "l-n1p1-3",
        "Modèle OSI et TCP/IP",
        25,
        "current",
        "Des couches aux paquets : où se situe chaque attaque que vous apprendrez ensuite.",
        "On observe une requête HTTP traverser les couches, et le mot de passe apparaît en clair côté application.",
        [
          "Le modèle OSI découpe la communication en 7 couches. En pratique on raisonne sur 4 : liaison, réseau (IP), transport (TCP/UDP), application.",
          "Savoir à quelle couche on se trouve dit quel outil utiliser : ARP en couche 2, scan de ports en couche 4, injection SQL en couche 7.",
        ],
        ["ip a", "ss -tulpn", "ping -c 2 10.10.10.5"],
        quizPool(
          "À quelle couche travaille un scan de ports TCP ?",
          ["Liaison", "Réseau", "Transport", "Application"],
          2,
          "Les ports appartiennent à la couche transport (TCP/UDP).",
        ),
      ),
      lesson(
        "l-n1p1-4",
        "Protocoles réseau du quotidien",
        20,
        "todo",
        "DNS, DHCP, HTTP, SSH : ce qu'ils révèlent d'une infrastructure.",
        "Une simple requête DNS mal configurée expose la liste complète des serveurs internes.",
        [
          "Chaque protocole laisse des traces exploitables : bannières de version, enregistrements DNS, en-têtes HTTP.",
          "La reconnaissance (partie 2) consiste en grande partie à interroger poliment ces protocoles avant toute attaque.",
        ],
        ["dig esatic.local any", "curl -I http://10.10.10.5"],
        quizPool(
          "Quel port utilise SSH par défaut ?",
          ["21", "22", "23", "80"],
          1,
          "SSH écoute par défaut sur le port TCP 22.",
        ),
      ),
    ],
  },
  {
    id: "n1-p2",
    part: 2,
    level: 1,
    axis: "Reconnaissance",
    title: "Reconnaissance & scan",
    description:
      "Collecter avant d'agir : OSINT, dorks Google, corrélation d'informations, puis Nmap et Wireshark pour cartographier la cible.",
    themes: [
      { label: "OSINT, dorks Google, corrélation", weeks: "S1–S3" },
      { label: "Nmap, Wireshark", weeks: "S4–S5" },
    ],
    keywords: ["OSINT", "dorks", "Nmap", "Wireshark"],
    progress: 62,
    locked: false,
    challengeIds: ["c-osint-1", "c-net-1"],
    lessons: [
      lesson(
        "l-n1p2-1",
        "OSINT : ce qu'internet sait déjà",
        24,
        "done",
        "Recouper des sources publiques pour reconstruire un organigramme et des adresses email.",
        "À partir d'un seul pseudo, on retrouve un dépôt Git contenant une clé d'API active.",
        [
          "L'OSINT ne touche jamais la cible : on lit ce qui est déjà public. C'est la phase la moins risquée et souvent la plus rentable.",
          "La valeur vient de la corrélation : un nom + un format d'email + une fuite ancienne suffisent à deviner un identifiant valide.",
        ],
        ["whois esatic.ci", "theharvester -d esatic.ci -b all"],
        quizPool(
          "Un dork Google sert à :",
          [
            "Scanner des ports",
            "Affiner une recherche pour exposer des fichiers indexés par erreur",
            "Casser un mot de passe",
            "Chiffrer une requête",
          ],
          1,
          "Les opérateurs de recherche (site:, filetype:, inurl:) révèlent des ressources indexées involontairement.",
        ),
      ),
      lesson(
        "l-n1p2-2",
        "Nmap : cartographier une cible",
        28,
        "current",
        "Découverte d'hôtes, scan de ports, détection de versions et de système.",
        "Un scan de versions révèle un service FTP de 2011 avec une vulnérabilité publique connue.",
        [
          "Nmap répond à trois questions : qui est en ligne, quels ports sont ouverts, quels services les écoutent.",
          "Le scan de versions (`-sV`) est le vrai point de bascule : il transforme une liste de ports en liste de vulnérabilités candidates.",
        ],
        ["nmap -sn 10.10.10.0/24", "nmap -sV -p- 10.10.10.5"],
        quizPool(
          "Que fait l'option -sV de Nmap ?",
          [
            "Un scan silencieux",
            "Une détection des versions de services",
            "Un scan UDP",
            "Une analyse de vulnérabilités",
          ],
          1,
          "`-sV` interroge les services pour déterminer leur version exacte.",
        ),
      ),
      lesson(
        "l-n1p2-3",
        "Wireshark : lire le trafic",
        26,
        "todo",
        "Filtres d'affichage, suivi de flux, extraction d'identifiants en clair.",
        "Dans une capture de 4 secondes, on extrait un identifiant FTP transmis sans chiffrement.",
        [
          "Une capture réseau est la vérité terrain : elle montre exactement ce qui circule, pas ce que la documentation prétend.",
          "Les filtres (`http.request`, `tcp.port == 21`) transforment un bruit illisible en preuve exploitable.",
        ],
        ["tcpdump -i eth0 -w capture.pcap", "tshark -r capture.pcap -Y http.request"],
        quizPool(
          "Quel filtre Wireshark isole les requêtes HTTP ?",
          ["tcp.flags", "http.request", "ip.src", "dns.qry"],
          1,
          "`http.request` ne conserve que les requêtes HTTP sortantes.",
        ),
      ),
    ],
  },
  {
    id: "n1-p3",
    part: 3,
    level: 1,
    axis: "Surface applicative",
    title: "Web, BDD & cryptographie",
    description:
      "La surface la plus exposée : HTTP, exploration web, injections SQL, vulnérabilités courantes et bases de la cryptographie.",
    themes: [
      { label: "HTTP, exploration web, vulnérabilités", weeks: "S1–S3" },
      { label: "Injections SQL, crypto de base", weeks: "S4–S5" },
    ],
    keywords: ["HTTP", "SQLi", "crypto", "OWASP"],
    progress: 20,
    locked: false,
    challengeIds: ["c-web-1", "c-crypto-1", "c-web-2"],
    lessons: [
      lesson(
        "l-n1p3-1",
        "HTTP de l'intérieur",
        22,
        "current",
        "Méthodes, en-têtes, cookies, codes de statut : le protocole que toute attaque web manipule.",
        "Un cookie de session sans attribut HttpOnly, et un simple script suffit à voler le compte.",
        [
          "HTTP est sans état : la session est donc portée par un jeton, souvent un cookie. Qui tient le jeton tient le compte.",
          "Lire les en-têtes de réponse donne déjà la pile technique, le serveur, parfois la version — et les protections absentes.",
        ],
        ["curl -v http://10.10.10.8/login", "curl -I http://10.10.10.8"],
        quizPool(
          "Que protège l'attribut HttpOnly d'un cookie ?",
          [
            "Il empêche sa lecture par JavaScript",
            "Il le chiffre",
            "Il le limite à HTTPS",
            "Il le rend permanent",
          ],
          0,
          "HttpOnly interdit l'accès au cookie depuis JavaScript, ce qui limite le vol de session par XSS.",
        ),
      ),
      lesson(
        "l-n1p3-2",
        "Injections SQL : la première faille",
        30,
        "todo",
        "Du guillemet qui casse la requête à l'extraction complète d'une base.",
        "Un seul caractère dans un champ de connexion, et l'authentification est contournée.",
        [
          "Une injection SQL survient quand une entrée utilisateur est concaténée dans une requête au lieu d'être passée en paramètre.",
          "La défense n'est pas le filtrage de caractères mais les requêtes préparées, côté serveur, systématiquement.",
        ],
        ["sqlmap -u 'http://10.10.10.8/item?id=1' --dbs"],
        quizPool(
          "La défense correcte contre l'injection SQL est :",
          [
            "Masquer les messages d'erreur",
            "Filtrer les apostrophes",
            "Utiliser des requêtes préparées",
            "Désactiver JavaScript",
          ],
          2,
          "Les requêtes préparées séparent le code SQL des données : l'entrée ne peut plus être interprétée.",
        ),
      ),
      lesson(
        "l-n1p3-3",
        "Cryptographie : les bases utiles",
        24,
        "locked",
        "Encodage, hachage, chiffrement symétrique et asymétrique — et ce qui les distingue.",
        "Un « mot de passe chiffré » qui n'était qu'un base64 : décodé en une seconde.",
        [
          "Encoder n'est pas chiffrer. Base64 est réversible sans secret, un hash ne se « déchiffre » pas.",
          "Le hachage sert au stockage de mots de passe (avec sel), le chiffrement au transport et à la confidentialité.",
        ],
        ["echo 'RVNBVElDezEyM30=' | base64 -d", "hashcat -m 0 hash.txt rockyou.txt"],
        quizPool(
          "Base64 est :",
          ["Un chiffrement", "Un encodage réversible", "Un hachage", "Une signature"],
          1,
          "Base64 est un encodage : réversible sans clé, il n'apporte aucune confidentialité.",
        ),
      ),
    ],
  },
  {
    id: "n1-p4",
    part: 4,
    level: 1,
    axis: "Exploitation",
    title: "Exploitation & rapport",
    description:
      "Transformer une vulnérabilité en accès : exploits, reverse/bind shell, Metasploit, post-exploitation, puis rédaction du rapport.",
    themes: [
      { label: "Exploits, reverse/bind shell, Metasploit", weeks: "S1–S3" },
      { label: "Post-exploitation, rapport", weeks: "S4–S5" },
    ],
    keywords: ["exploit", "reverse shell", "Metasploit", "rapport"],
    progress: 0,
    locked: true,
    challengeIds: ["c-pwn-1", "c-forensics-1"],
    lessons: [
      lesson(
        "l-n1p4-1",
        "Du service vulnérable au shell",
        30,
        "locked",
        "Choisir un exploit, comprendre son payload, obtenir un accès interactif.",
        "Un service obsolète et 40 secondes plus tard, un shell s'ouvre sur la machine cible.",
        [
          "Un exploit n'est utile que si l'on comprend ce qu'il envoie : sinon on ne sait ni le corriger ni le documenter.",
          "Un reverse shell contourne les pare-feux entrants : c'est la cible qui vous rappelle.",
        ],
        ["nc -lvnp 4444", "msfconsole -q"],
        quizPool(
          "Un reverse shell est utilisé parce que :",
          [
            "Il est plus rapide",
            "La cible initie la connexion et contourne le filtrage entrant",
            "Il est chiffré",
            "Il ne laisse aucune trace",
          ],
          1,
          "Les pare-feux filtrent surtout l'entrant : faire sortir la connexion depuis la cible passe plus souvent.",
        ),
      ),
      lesson(
        "l-n1p4-2",
        "Rédiger un rapport exploitable",
        20,
        "locked",
        "Impact, reproduction, criticité, remédiation : le livrable qui donne de la valeur au test.",
        "Deux rapports sur la même faille : l'un est classé sans suite, l'autre déclenche un correctif en 24 h.",
        [
          "Un rapport se lit à deux niveaux : synthèse pour la décision, détail technique pour la correction.",
          "Sans étapes de reproduction, une vulnérabilité n'est pas traitée. C'est la partie la plus souvent bâclée.",
        ],
        [],
        quizPool(
          "Quel élément est indispensable dans une fiche de vulnérabilité ?",
          ["Le nom de l'outil", "Les étapes de reproduction", "Le temps passé", "Le pseudo de l'auteur"],
          1,
          "Sans reproduction, l'équipe technique ne peut ni vérifier ni corriger la faille.",
        ),
      ),
    ],
  },
  {
    id: "n2-p1",
    part: 1,
    level: 2,
    axis: "Terrain",
    title: "Administration & TCP/IP approfondi",
    description:
      "systemd et cron, durcissement système, SSH et handshake TCP, DNS avancé : le terrain revu avec plus d'autonomie.",
    themes: [
      { label: "systemd/cron, durcissement", weeks: "S1–S3" },
      { label: "SSH, handshake TCP, DNS avancé", weeks: "S4–S5" },
    ],
    keywords: ["systemd", "cron", "durcissement", "SSH", "DNS"],
    progress: 0,
    locked: true,
    challengeIds: ["c-linux-2"],
    lessons: [
      lesson(
        "l-n2p1-1",
        "Tâches planifiées et services",
        26,
        "locked",
        "systemd, cron, et les mauvaises configurations qui offrent root.",
        "Une tâche cron root pointant vers un script modifiable : escalade en une minute.",
        [
          "Tout service persistant est une surface : un fichier d'unité mal protégé équivaut à une exécution de code en root.",
          "Auditer les tâches planifiées est un réflexe de post-exploitation autant que d'administration.",
        ],
        ["systemctl list-timers", "cat /etc/crontab"],
        quizPool(
          "Pourquoi auditer /etc/crontab en post-exploitation ?",
          [
            "Pour lire les logs",
            "Pour repérer des scripts privilégiés modifiables",
            "Pour changer l'heure",
            "Pour lister les utilisateurs",
          ],
          1,
          "Un script lancé par root mais modifiable par un utilisateur simple est une escalade directe.",
        ),
      ),
    ],
  },
  {
    id: "n2-p2",
    part: 2,
    level: 2,
    axis: "Reconnaissance",
    title: "Recon avancée & capture",
    description:
      "OSINT approfondi, Nmap avancé, énumération de services, analyse fine avec Wireshark et tcpdump.",
    themes: [
      { label: "OSINT approfondi, Nmap avancé", weeks: "S1–S3" },
      { label: "Énumération de services, capture", weeks: "S4–S5" },
    ],
    keywords: ["énumération", "NSE", "tcpdump"],
    progress: 0,
    locked: true,
    challengeIds: ["c-net-2"],
    lessons: [
      lesson(
        "l-n2p2-1",
        "Énumération de services",
        28,
        "locked",
        "SMB, LDAP, SNMP, HTTP : tirer le maximum d'un port ouvert.",
        "Un partage SMB anonyme livre la liste complète des comptes du domaine.",
        [
          "Un port ouvert n'est qu'un début : l'énumération transforme « 445/tcp open » en noms d'utilisateurs et chemins de partage.",
          "Les scripts NSE de Nmap automatisent une grande partie de ce travail sans perdre en lisibilité.",
        ],
        ["nmap --script smb-enum-shares -p445 10.10.10.12"],
        quizPool(
          "Que permet un partage SMB en accès anonyme ?",
          ["Rien", "Lister fichiers et parfois comptes", "Obtenir root", "Chiffrer le trafic"],
          1,
          "Un accès anonyme expose souvent l'arborescence et des informations de comptes réutilisables.",
        ),
      ),
    ],
  },
  {
    id: "n2-p3",
    part: 3,
    level: 2,
    axis: "Surface applicative",
    title: "Exploitation web & crypto appliquée",
    description:
      "SQLi avancée, XSS/CSRF/IDOR, Burp Suite, chiffrement, hachage et PKI mis en pratique.",
    themes: [
      { label: "SQLi, XSS/CSRF/IDOR, Burp Suite", weeks: "S1–S3" },
      { label: "Chiffrement, hachage, PKI", weeks: "S4–S5" },
    ],
    keywords: ["XSS", "CSRF", "IDOR", "Burp", "PKI"],
    progress: 0,
    locked: true,
    challengeIds: ["c-web-2", "c-crypto-2"],
    lessons: [
      lesson(
        "l-n2p3-1",
        "IDOR et contrôle d'accès",
        26,
        "locked",
        "La faille la plus fréquente et la plus simple : changer un identifiant dans l'URL.",
        "Un identifiant de facture incrémenté, et l'on accède aux documents de tous les clients.",
        [
          "IDOR n'est pas un bug technique mais une autorisation manquante côté serveur.",
          "Aucune obfuscation d'identifiant ne remplace une vérification « cet utilisateur a-t-il le droit ? ».",
        ],
        [],
        quizPool(
          "Une faille IDOR provient de :",
          [
            "Un défaut de chiffrement",
            "Une absence de vérification d'autorisation côté serveur",
            "Un mot de passe faible",
            "Un port ouvert",
          ],
          1,
          "Le serveur sert la ressource demandée sans vérifier que le demandeur y a droit.",
        ),
      ),
    ],
  },
  {
    id: "n2-p4",
    part: 4,
    level: 2,
    axis: "Exploitation",
    title: "Post-exploitation & Active Directory",
    description:
      "Méthodologie offensive, escalade Linux et Windows, Active Directory, forensics et rapport.",
    themes: [
      { label: "Méthodologie, privesc Linux/Windows", weeks: "S1–S3" },
      { label: "Active Directory, forensics, rapport", weeks: "S4–S5" },
    ],
    keywords: ["privesc", "Active Directory", "forensics"],
    progress: 0,
    locked: true,
    challengeIds: ["c-pwn-1", "c-forensics-1"],
    lessons: [
      lesson(
        "l-n2p4-1",
        "Escalade de privilèges Linux",
        30,
        "locked",
        "Énumération locale méthodique : SUID, sudo, capabilities, noyau.",
        "Une entrée sudo mal cadrée transforme un compte de service en root.",
        [
          "L'escalade est un travail d'inventaire : on liste tout, on compare aux configurations attendues.",
          "Automatiser (linpeas) fait gagner du temps, mais comprendre la sortie reste indispensable.",
        ],
        ["sudo -l", "getcap -r / 2>/dev/null"],
        quizPool(
          "Que montre `sudo -l` ?",
          [
            "Les utilisateurs connectés",
            "Les commandes autorisées via sudo",
            "Les processus root",
            "Les groupes système",
          ],
          1,
          "`sudo -l` liste ce que le compte courant peut exécuter via sudo — souvent une voie d'escalade.",
        ),
      ),
    ],
  },
  {
    id: "n3-p1",
    part: 1,
    level: 3,
    axis: "Terrain",
    title: "Durcissement & pivoting",
    description:
      "Capabilities, VLAN et pare-feu, tunnels, introduction à SMB/LDAP/Kerberos.",
    themes: [
      { label: "Capabilities, VLAN, pare-feu", weeks: "S1–S3" },
      { label: "Tunnels, SMB/LDAP/Kerberos", weeks: "S4–S5" },
    ],
    keywords: ["pivoting", "tunnels", "Kerberos"],
    progress: 0,
    locked: true,
    challengeIds: ["c-net-2"],
    lessons: [
      lesson(
        "l-n3p1-1",
        "Pivoter dans un réseau segmenté",
        32,
        "locked",
        "Utiliser une machine compromise comme relais vers un sous-réseau inaccessible.",
        "Un tunnel SSH, et le réseau « isolé » devient joignable depuis le poste de l'attaquant.",
        [
          "Le pivoting ne casse pas la segmentation : il l'emprunte, via une machine qui a le droit de parler aux deux côtés.",
          "C'est l'étape qui sépare une compromission isolée d'une compromission de domaine.",
        ],
        ["ssh -D 1080 user@10.10.10.5", "proxychains nmap -sT 172.16.0.0/24"],
        quizPool(
          "Le pivoting consiste à :",
          [
            "Contourner un mot de passe",
            "Utiliser un hôte compromis comme relais réseau",
            "Effacer les journaux",
            "Chiffrer un payload",
          ],
          1,
          "On route son trafic à travers la machine compromise pour atteindre d'autres segments.",
        ),
      ),
    ],
  },
  {
    id: "n3-p2",
    part: 2,
    level: 3,
    axis: "Reconnaissance",
    title: "Recon furtive & analyse",
    description:
      "Scan évasif, OSINT multi-sources, analyse de trafic chiffré, cartographie d'infrastructure.",
    themes: [
      { label: "Scan évasif, OSINT multi-sources", weeks: "S1–S3" },
      { label: "Trafic chiffré, cartographie", weeks: "S4–S5" },
    ],
    keywords: ["furtivité", "évasion", "TLS"],
    progress: 0,
    locked: true,
    challengeIds: ["c-osint-1"],
    lessons: [
      lesson(
        "l-n3p2-1",
        "Scanner sans être détecté",
        30,
        "locked",
        "Timing, fragmentation, leurres : réduire l'empreinte face à un IDS.",
        "Le même scan, deux configurations : l'une déclenche 40 alertes, l'autre aucune.",
        [
          "La furtivité est un compromis entre vitesse et bruit : un scan lent et partiel passe souvent inaperçu.",
          "Côté défense, comprendre ces techniques permet d'écrire des règles de détection utiles.",
        ],
        ["nmap -T2 -f --top-ports 50 10.10.10.20"],
        quizPool(
          "Baisser le timing d'un scan (-T2) permet :",
          [
            "D'aller plus vite",
            "De réduire les chances de détection",
            "De scanner l'UDP",
            "D'éviter les faux positifs",
          ],
          1,
          "Un rythme plus lent ressemble davantage à du trafic normal et déclenche moins d'alertes.",
        ),
      ),
    ],
  },
  {
    id: "n3-p3",
    part: 3,
    level: 3,
    axis: "Surface applicative",
    title: "Web, BDD & crypto avancés",
    description:
      "Chaînes d'exploitation web, attaques d'API, cryptographie appliquée, audit de base de données.",
    themes: [
      { label: "Chaînes d'exploitation, API", weeks: "S1–S3" },
      { label: "Crypto appliquée, audit BDD", weeks: "S4–S5" },
    ],
    keywords: ["API", "chaîne d'exploitation", "audit BDD"],
    progress: 0,
    locked: true,
    challengeIds: ["c-web-2", "c-crypto-2"],
    lessons: [
      lesson(
        "l-n3p3-1",
        "Chaîner plusieurs vulnérabilités",
        34,
        "locked",
        "Assembler trois failles mineures pour obtenir un impact critique.",
        "Un upload limité + une inclusion de fichier + une tâche planifiée : exécution de code à distance.",
        [
          "Une faille « faible » prise seule devient critique dans une chaîne. C'est ce raisonnement que les CTF avancés récompensent.",
          "Documenter la chaîne complète est indispensable : corriger un seul maillon peut suffire à casser l'attaque.",
        ],
        [],
        quizPool(
          "Pourquoi documenter une chaîne complète ?",
          [
            "Pour gonfler le rapport",
            "Parce que corriger un maillon peut neutraliser toute l'attaque",
            "Pour prouver la difficulté",
            "Ce n'est pas nécessaire",
          ],
          1,
          "La défense a besoin de voir la chaîne pour choisir la correction la plus efficace.",
        ),
      ),
    ],
  },
  {
    id: "n3-p4",
    part: 4,
    level: 3,
    axis: "Exploitation",
    title: "Scénarios complets",
    description:
      "Exploitation multi-étapes, mouvement latéral dans un domaine AD, persistance, reporting complet.",
    themes: [
      { label: "Exploitation multi-étapes, latéral AD", weeks: "S1–S3" },
      { label: "Persistance, reporting complet", weeks: "S4–S5" },
    ],
    keywords: ["mouvement latéral", "persistance", "reporting"],
    progress: 0,
    locked: true,
    challengeIds: ["c-pwn-1"],
    lessons: [
      lesson(
        "l-n3p4-1",
        "Mouvement latéral en domaine",
        36,
        "locked",
        "Du premier poste au contrôleur de domaine : réutilisation d'identifiants et délégation.",
        "Un hash récupéré sur un poste bureautique ouvre une session administrateur ailleurs.",
        [
          "Le mouvement latéral exploite la confiance interne : mêmes comptes, mêmes mots de passe, droits trop larges.",
          "La détection repose sur les journaux d'authentification, pas sur l'antivirus.",
        ],
        [],
        quizPool(
          "Le mouvement latéral exploite surtout :",
          [
            "Des exploits noyau",
            "La réutilisation d'identifiants et des droits trop larges",
            "Le déni de service",
            "Le phishing externe",
          ],
          1,
          "Les identifiants valides réutilisés d'une machine à l'autre sont le vecteur dominant.",
        ),
      ),
    ],
  },
];

export type ChallengeCategory =
  | "Web"
  | "Crypto"
  | "Forensics"
  | "Réseau"
  | "Stéganographie"
  | "Reverse"
  | "OSINT"
  | "Linux"
  | "Pwn";

export type Difficulty = "Facile" | "Moyen" | "Difficile" | "Insane";
export type ChallengeStatus = "non commencé" | "en cours" | "résolu";

export type Challenge = {
  id: string;
  title: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  points: number;
  status: ChallengeStatus;
  solves: number;
  author: string;
  moduleId: string;
  statement: string[];
  files: { name: string; size: string }[];
  hints: { text: string; cost: number }[];
  maxAttempts: number;
  attemptsUsed: number;
  flag: string;
};

export const challenges: Challenge[] = [
  {
    id: "c-linux-1",
    title: "Premiers pas dans la boîte",
    category: "Linux",
    difficulty: "Facile",
    points: 50,
    status: "résolu",
    solves: 128,
    author: "kouame.y",
    moduleId: "n1-p1",
    statement: [
      "Une session vous est ouverte sur une machine d'entraînement. Un fichier de note a été laissé dans le répertoire personnel d'un utilisateur, mais il n'est pas là où vous l'attendez.",
      "Explorez le système et retrouvez le flag.",
    ],
    files: [],
    hints: [
      { text: "Les fichiers commençant par un point ne s'affichent pas avec un simple `ls`.", cost: 5 },
      { text: "Regardez du côté de l'historique du shell.", cost: 10 },
    ],
    maxAttempts: 10,
    attemptsUsed: 2,
    flag: "ESATIC{terminal_is_home}",
  },
  {
    id: "c-net-1",
    title: "Le port oublié",
    category: "Réseau",
    difficulty: "Facile",
    points: 75,
    status: "en cours",
    solves: 84,
    author: "kouame.y",
    moduleId: "n1-p2",
    statement: [
      "Un serveur de l'infrastructure d'entraînement expose un service non documenté sur un port haut.",
      "Identifiez le service, sa version, et récupérez la bannière : le flag y est inscrit.",
    ],
    files: [],
    hints: [{ text: "Un scan des 65535 ports prend du temps, mais il est nécessaire ici.", cost: 10 }],
    maxAttempts: 10,
    attemptsUsed: 3,
    flag: "ESATIC{banner_grabbing_101}",
  },
  {
    id: "c-osint-1",
    title: "Empreinte publique",
    category: "OSINT",
    difficulty: "Moyen",
    points: 120,
    status: "non commencé",
    solves: 41,
    author: "aya.k",
    moduleId: "n1-p2",
    statement: [
      "Un membre fictif du club a publié un peu trop d'informations sur ses profils publics.",
      "À partir du pseudo `n0ctu4`, retrouvez le nom du projet abandonné dans lequel une clé a été laissée. Le flag est le nom du dépôt.",
    ],
    files: [{ name: "indices.txt", size: "1,2 Ko" }],
    hints: [{ text: "Le même pseudo est réutilisé sur plusieurs plateformes.", cost: 15 }],
    maxAttempts: 8,
    attemptsUsed: 0,
    flag: "ESATIC{osint_correlation}",
  },
  {
    id: "c-web-1",
    title: "Connexion trop permissive",
    category: "Web",
    difficulty: "Facile",
    points: 100,
    status: "résolu",
    solves: 96,
    author: "aya.k",
    moduleId: "n1-p3",
    statement: [
      "Le portail d'entraînement possède un formulaire de connexion écrit un peu vite.",
      "Authentifiez-vous en tant qu'administrateur sans connaître son mot de passe.",
    ],
    files: [],
    hints: [{ text: "Que se passe-t-il si vous ajoutez une apostrophe dans le champ identifiant ?", cost: 10 }],
    maxAttempts: 12,
    attemptsUsed: 4,
    flag: "ESATIC{sqli_login_bypass}",
  },
  {
    id: "c-web-2",
    title: "Facture n°1042",
    category: "Web",
    difficulty: "Moyen",
    points: 150,
    status: "non commencé",
    solves: 33,
    author: "kouame.y",
    moduleId: "n2-p3",
    statement: [
      "L'espace client du portail affiche vos factures via un identifiant numérique.",
      "Accédez à la facture d'un autre utilisateur pour obtenir le flag.",
    ],
    files: [],
    hints: [{ text: "Le serveur vérifie-t-il vraiment à qui appartient la ressource ?", cost: 20 }],
    maxAttempts: 10,
    attemptsUsed: 0,
    flag: "ESATIC{idor_invoice}",
  },
  {
    id: "c-crypto-1",
    title: "Pas vraiment chiffré",
    category: "Crypto",
    difficulty: "Facile",
    points: 75,
    status: "résolu",
    solves: 110,
    author: "aya.k",
    moduleId: "n1-p3",
    statement: [
      "Un fichier de configuration contient un secret présenté comme « chiffré ».",
      "Retrouvez le contenu original.",
    ],
    files: [{ name: "config.enc", size: "312 o" }],
    hints: [{ text: "Comptez les caractères et cherchez un `=` en fin de chaîne.", cost: 5 }],
    maxAttempts: 15,
    attemptsUsed: 1,
    flag: "ESATIC{base64_is_not_crypto}",
  },
  {
    id: "c-crypto-2",
    title: "Sel manquant",
    category: "Crypto",
    difficulty: "Difficile",
    points: 250,
    status: "non commencé",
    solves: 9,
    author: "kouame.y",
    moduleId: "n2-p3",
    statement: [
      "Une fuite contient une table de hachés non salés issus d'une ancienne application du club.",
      "Retrouvez le mot de passe du compte `admin`.",
    ],
    files: [{ name: "dump.sql", size: "48 Ko" }],
    hints: [
      { text: "Identifiez d'abord l'algorithme d'après la longueur du haché.", cost: 25 },
      { text: "Une liste de mots classique suffit.", cost: 40 },
    ],
    maxAttempts: 8,
    attemptsUsed: 0,
    flag: "ESATIC{unsalted_hashes_fall}",
  },
  {
    id: "c-forensics-1",
    title: "Quatre secondes de trafic",
    category: "Forensics",
    difficulty: "Moyen",
    points: 175,
    status: "non commencé",
    solves: 27,
    author: "aya.k",
    moduleId: "n1-p4",
    statement: [
      "Une capture réseau très courte a été réalisée pendant qu'un technicien se connectait à un service interne.",
      "Extrayez l'identifiant transmis et composez le flag.",
    ],
    files: [{ name: "capture.pcap", size: "2,4 Mo" }],
    hints: [{ text: "Tous les protocoles ne chiffrent pas leurs identifiants.", cost: 20 }],
    maxAttempts: 10,
    attemptsUsed: 0,
    flag: "ESATIC{cleartext_credentials}",
  },
  {
    id: "c-linux-2",
    title: "La tâche de minuit",
    category: "Linux",
    difficulty: "Moyen",
    points: 200,
    status: "non commencé",
    solves: 18,
    author: "kouame.y",
    moduleId: "n2-p1",
    statement: [
      "Vous disposez d'un accès utilisateur limité sur une machine. Une tâche planifiée tourne toutes les minutes avec des privilèges élevés.",
      "Obtenez un shell root et lisez `/root/flag.txt`.",
    ],
    files: [],
    hints: [{ text: "Vérifiez les droits d'écriture sur les scripts appelés par cron.", cost: 25 }],
    maxAttempts: 10,
    attemptsUsed: 0,
    flag: "ESATIC{cron_writable_script}",
  },
  {
    id: "c-net-2",
    title: "De l'autre côté du VLAN",
    category: "Réseau",
    difficulty: "Difficile",
    points: 300,
    status: "non commencé",
    solves: 6,
    author: "kouame.y",
    moduleId: "n3-p1",
    statement: [
      "Un segment interne n'est pas joignable depuis votre poste, mais une machine compromise a un pied dans les deux réseaux.",
      "Pivotez et récupérez le flag sur le serveur isolé.",
    ],
    files: [],
    hints: [{ text: "Un proxy SOCKS via SSH est le chemin le plus court.", cost: 40 }],
    maxAttempts: 8,
    attemptsUsed: 0,
    flag: "ESATIC{pivot_through_trust}",
  },
  {
    id: "c-pwn-1",
    title: "Débordement introductif",
    category: "Pwn",
    difficulty: "Difficile",
    points: 275,
    status: "non commencé",
    solves: 7,
    author: "aya.k",
    moduleId: "n1-p4",
    statement: [
      "Un binaire d'entraînement lit une entrée sans vérifier sa taille.",
      "Détournez le flux d'exécution pour appeler la fonction cachée.",
    ],
    files: [{ name: "vuln", size: "16 Ko" }],
    hints: [{ text: "Cherchez d'abord le décalage exact avant l'adresse de retour.", cost: 40 }],
    maxAttempts: 12,
    attemptsUsed: 0,
    flag: "ESATIC{stack_smash_intro}",
  },
  {
    id: "c-stego-1",
    title: "L'affiche du club",
    category: "Stéganographie",
    difficulty: "Facile",
    points: 75,
    status: "non commencé",
    solves: 52,
    author: "aya.k",
    moduleId: "n1-p2",
    statement: ["Une affiche du club cache un message. Rien ne se voit à l'œil nu."],
    files: [{ name: "affiche.png", size: "840 Ko" }],
    hints: [{ text: "Commencez par les métadonnées, puis les bits de poids faible.", cost: 10 }],
    maxAttempts: 15,
    attemptsUsed: 0,
    flag: "ESATIC{hidden_in_plain_sight}",
  },
  {
    id: "c-reverse-1",
    title: "Vérificateur de licence",
    category: "Reverse",
    difficulty: "Moyen",
    points: 180,
    status: "non commencé",
    solves: 21,
    author: "kouame.y",
    moduleId: "n2-p1",
    statement: [
      "Un petit programme demande une clé de licence et refuse tout ce que vous tapez.",
      "Retrouvez la clé attendue.",
    ],
    files: [{ name: "licence", size: "12 Ko" }],
    hints: [{ text: "Les chaînes du binaire en disent déjà beaucoup.", cost: 20 }],
    maxAttempts: 12,
    attemptsUsed: 0,
    flag: "ESATIC{static_key_in_binary}",
  },
];

export const categories: ChallengeCategory[] = [
  "Web",
  "Crypto",
  "Forensics",
  "Réseau",
  "Stéganographie",
  "Reverse",
  "OSINT",
  "Linux",
  "Pwn",
];

export const difficulties: Difficulty[] = ["Facile", "Moyen", "Difficile", "Insane"];

export type Rank = { name: string; min: number };

export const ranks: Rank[] = [
  { name: "Recrue", min: 0 },
  { name: "Analyste", min: 500 },
  { name: "Pentester", min: 1500 },
  { name: "Élite", min: 3000 },
];

export function rankFor(points: number): Rank {
  return [...ranks].reverse().find((r) => points >= r.min) ?? ranks[0]!;
}

export function nextRankFor(points: number) {
  return ranks.find((r) => r.min > points) ?? null;
}

export type Badge = {
  id: string;
  name: string;
  description: string;
  obtained: boolean;
  date?: string;
};

export const badges: Badge[] = [
  { id: "b1", name: "Premier sang", description: "Première résolution d'un défi", obtained: true, date: "12/10/2025" },
  { id: "b2", name: "Série de 7 jours", description: "Sept jours d'activité consécutifs", obtained: true, date: "03/11/2025" },
  { id: "b3", name: "Terrain balisé", description: "Module « Bases Linux & réseau » terminé", obtained: true, date: "18/11/2025" },
  { id: "b4", name: "Chasseur de ports", description: "Cinq défis Réseau résolus", obtained: false },
  { id: "b5", name: "Cryptanalyste", description: "Cinq défis Crypto résolus", obtained: false },
  { id: "b6", name: "Finaliste CTF", description: "Top 10 d'un événement CTF", obtained: false },
];

export type LeaderboardEntry = {
  rankPosition: number;
  pseudo: string;
  promotion: string;
  points: number;
  solved: number;
  rank: string;
  trend: number;
};

export const leaderboard: LeaderboardEntry[] = [
  { rankPosition: 1, pseudo: "n0ctu4", promotion: "L3 RIT", points: 3420, solved: 48, rank: "Élite", trend: 0 },
  { rankPosition: 2, pseudo: "sh3llby", promotion: "M1 SSI", points: 3180, solved: 45, rank: "Élite", trend: 2 },
  { rankPosition: 3, pseudo: "kouassi_h", promotion: "L3 RIT", points: 2740, solved: 39, rank: "Pentester", trend: -1 },
  { rankPosition: 4, pseudo: "aya.k", promotion: "M1 SSI", points: 2510, solved: 37, rank: "Pentester", trend: 1 },
  { rankPosition: 5, pseudo: "byt3fl1p", promotion: "L2 MIAGE", points: 2190, solved: 33, rank: "Pentester", trend: -2 },
  { rankPosition: 6, pseudo: "achiraf", promotion: "L2 RIT", points: 1860, solved: 29, rank: "Pentester", trend: 3 },
  { rankPosition: 7, pseudo: "z3ro_day", promotion: "L3 MIAGE", points: 1640, solved: 26, rank: "Pentester", trend: 0 },
  { rankPosition: 8, pseudo: "traoré_m", promotion: "L2 RIT", points: 1280, solved: 22, rank: "Analyste", trend: 1 },
  { rankPosition: 9, pseudo: "nmap_fan", promotion: "L1 RIT", points: 940, solved: 18, rank: "Analyste", trend: 4 },
  { rankPosition: 10, pseudo: "diaby_s", promotion: "L1 MIAGE", points: 720, solved: 14, rank: "Analyste", trend: -1 },
  { rankPosition: 11, pseudo: "koffi_a", promotion: "L1 RIT", points: 610, solved: 12, rank: "Analyste", trend: 2 },
  { rankPosition: 12, pseudo: "yao_l", promotion: "L2 MIAGE", points: 450, solved: 9, rank: "Recrue", trend: 0 },
];

export type Season = {
  id: string;
  label: string;
  status: "en cours" | "archivée";
  champion: string;
  participants: number;
  challenges: number;
};

export const seasons: Season[] = [
  { id: "2025-2026", label: "Saison 2025–2026", status: "en cours", champion: "—", participants: 187, challenges: 14 },
  { id: "2024-2025", label: "Saison 2024–2025", status: "archivée", champion: "sh3llby", participants: 142, challenges: 36 },
  { id: "2023-2024", label: "Saison 2023–2024", status: "archivée", champion: "kouassi_h", participants: 96, challenges: 28 },
];

export type CtfEvent = {
  id: string;
  name: string;
  status: "à venir" | "en cours" | "terminé";
  start: string;
  duration: string;
  teams: number;
  challenges: number;
  description: string;
  level: string;
};

export const events: CtfEvent[] = [
  {
    id: "e1",
    name: "CTF final — Partie 2 (Niveau 1)",
    status: "en cours",
    start: "Aujourd'hui, 14h00",
    duration: "4 h",
    teams: 22,
    challenges: 8,
    description:
      "CTF de clôture de la partie Reconnaissance & scan. Épreuves OSINT, Nmap et analyse de capture.",
    level: "Niveau 1",
  },
  {
    id: "e2",
    name: "Nuit du Pentest ESATIC",
    status: "à venir",
    start: "14/10/2026, 18h00",
    duration: "12 h",
    teams: 0,
    challenges: 18,
    description:
      "Événement inter-niveaux : scénario complet, de la reconnaissance au rapport, sur une infrastructure dédiée.",
    level: "Tous niveaux",
  },
  {
    id: "e3",
    name: "CTF final — Partie 1 (Niveau 1)",
    status: "terminé",
    start: "22/08/2026",
    duration: "4 h",
    teams: 19,
    challenges: 6,
    description: "Linux, permissions, processus et lecture de réseau.",
    level: "Niveau 1",
  },
  {
    id: "e4",
    name: "CTF final — Partie 4 (Niveau 2)",
    status: "terminé",
    start: "05/07/2026",
    duration: "6 h",
    teams: 14,
    challenges: 10,
    description: "Post-exploitation, escalade de privilèges et Active Directory.",
    level: "Niveau 2",
  },
];

export const currentUser = {
  pseudo: "achiraf",
  name: "Achiraf Balogun",
  email: "achiraf.balogun@esatic.ci",
  role: "apprenant" as "apprenant" | "formateur" | "admin",
  promotion: "L2 RIT",
  bio: "Membre de la Section Cybersécurité. Niveau 1 en cours, objectif : le CTF de fin de partie.",
  points: 1860,
  solved: 29,
  position: 6,
  streak: 7,
  joined: "Octobre 2025",
  level: 1 as LevelId,
};

export const activity = [
  { day: "Lun", points: 120 },
  { day: "Mar", points: 75 },
  { day: "Mer", points: 200 },
  { day: "Jeu", points: 0 },
  { day: "Ven", points: 150 },
  { day: "Sam", points: 275 },
  { day: "Dim", points: 100 },
];

export const recentSolves = [
  { challenge: "Pas vraiment chiffré", category: "Crypto", points: 75, when: "il y a 2 h" },
  { challenge: "Connexion trop permissive", category: "Web", points: 100, when: "hier" },
  { challenge: "Premiers pas dans la boîte", category: "Linux", points: 50, when: "il y a 3 j" },
  { challenge: "L'affiche du club", category: "Stéganographie", points: 75, when: "il y a 5 j" },
];

export const adminStats = {
  members: 187,
  activeWeek: 96,
  publishedChallenges: 14,
  publishedLessons: 26,
  submissions: 1842,
  successRate: 38,
  runningLabs: 3,
};

export const adminChallengeRows = challenges.slice(0, 8).map((c) => ({
  id: c.id,
  title: c.title,
  category: c.category,
  difficulty: c.difficulty,
  solves: c.solves,
  published: c.status !== "non commencé" || c.solves > 20,
  author: c.author,
}));

export const auditLog = [
  { at: "09:24", who: "kouame.y", what: "Publication du défi « De l'autre côté du VLAN »" },
  { at: "08:51", who: "admin", what: "Rôle formateur accordé à aya.k" },
  { at: "hier", who: "aya.k", what: "Modification de la leçon « Injections SQL »" },
  { at: "hier", who: "admin", what: "Suspension du compte test_bot" },
  { at: "il y a 2 j", who: "kouame.y", what: "Ouverture de l'événement CTF final — Partie 2" },
];

export function moduleById(id: string) {
  return modules.find((m) => m.id === id);
}

export function challengeById(id: string) {
  return challenges.find((c) => c.id === id);
}

export function challengesForModule(id: string) {
  const mod = moduleById(id);
  if (!mod) return [];
  return challenges.filter((c) => mod.challengeIds.includes(c.id) || c.moduleId === id);
}
