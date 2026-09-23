# BrionAI26 — Voortgangslog

> Evidence before done: elke fase eindigt met een bewezen CI-build vóór de
> volgende fase begint. Status-details en afspraken: zie HANDOFF.md.

## Volgende stappen (na fase 3)

- Fase 4 (Calamares: ISO installeert zichzelf permanent op schijf),
  fase 5 (first-boot wizard met git-identiteit + AI-sleutels).
- Oude testbranches op `dweedledo-wq/Vibe` opruimen (handmatig, gebruiker).

## 2026-09-23 — FASE 3 BEWEZEN: Dev Studio + VS Code in ISO ✅

- **CI-run 35885427596 geslaagd** (~12 min): Release
  `iso-20260923-160937` — **1328 MB ISO** publiek downloadbaar.
  Eerdere devstack-run: 35882563654 (11m25s, geany/git/tmux/python/node).
- Keuze professional tooling (opdracht Brionize: "professionals, beste keuzes"):
  - **VS Code** (`code`) via officiële Microsoft apt-repo — de standaard in
    bedrijfsontwikkeling. Geïnstalleerd via live-hook 2000-install-vscode.chroot.
  - **Geany** blijft geïnstalleerd als lichte reserve-editor (geen netwerk/uitbreidingen nodig).
  - git, gitg (visueel), tmux, build-essential, python3 + pip + venv, nodejs,
    npm, curl, wget, openssh-client.
  - Super+E opent VS Code op Dev Studio; Super+T terminal; Geany via menu.
- Downloads voortaan automatisch als publieke GitHub Release bij elke
  geslaagde build (geen login nodig) — workflow-stap toegevoegd.

## 2026-09-23 — FASE 2 AF: werkbladen + AI Matrix in ISO bewezen ✅

- **CI-run 35871715186 geslaagd** (commit `871bb87`, ~8 min bouwtijd):
  `brionai26-amd64.hybrid.iso` — **888,8 MB artifact** (14 dagen bewaard).
- Toegevoegd in deze build:
  - `desktop/skel/.config/xfce4/xfconf/xfce-perchannel-xml/xfwm4.xml` —
    3 werkbladen: Command Center / AI Matrix / Dev Studio.
  - `desktop/skel/.config/xfce4/xfconf/xfce-perchannel-xml/xfce4-keyboard-shortcuts.xml` —
    Super+1/2/3 wisselt werkblad; Super+C/G/M/A opent Claude/ChatGPT/
    Mistral/Gemini als PWA (chromium --app) op werkblad AI Matrix.
  - `chromium` in de pakketlijst (geverifieerd aanwezig in trixie).
- Opzet: XFCE leest de xfconf-XML's uit /etc/skel bij eerste login van een
  nieuwe gebruiker; wmctrl (al aanwezig) doet de werkblad-wissel in de
  shortcuts zodat geen extra tooling nodig is.

## 2026-09-23 — FASE 2 BEWEZEN: desktop-ISO gebouwd in CI ✅

- **CI-run 35855421072 geslaagd** (commit `d1fcad1`, ~8 min bouwtijd):
  `brionai26-amd64.hybrid.iso` — **738,5 MB artifact** geüpload (14 dagen
  bewaard) met volledige XFCE-mission-control desktop.
- Route naar de oplossing — zes falende runs dienden als bewijs:
  1. Run 35849002493: eerste fase-2-poging. Annotatie wees op inline-comments
     in de pakketlijst; `desktop/`-map niet gemount in de build-container.
  2. Run 35849868998: zelfde exit 123, oorzaak nog onbekend.
  3. Run 35850710447: `gtk3-engines-xfence` verwijderd (bestaat niet in
     stable) — nog steeds exit 123.
  4. Run 35852671251: log-afvang toegevoegd, maar log niet gevonden.
  5. Run 35853674950: `build/` gemount, `.build/`-structuur zichtbaar maar
     live-build logt naar stdout, niet naar een bestand.
  6. Run 35854867717: `lb build 2>&1 | tee live-build.log`-fix gepusht
     (commits `48dfe24`→`44d55b7`, inclusief POSIX-veilige exit-afhandeling
     omdat `PIPESTATUS` niet bestaat in dash). **Annotatie onthulde de echte
     oorzaak: `conky` is in trixie een virtueel pakket** zonder installatie-
     kandidaat.
  7. Fix: `conky-all` in de pakketlijst (`conky-std` + `conky-all`
     conflicteren onderling — run 35855232533 bewees dat).
  8. Run 35855421072: **volledig geslaagd** — build + verify + upload.
- Downloads: publieke Release-publicatie toegevoegd aan de workflow nadat
  artifact-downloads GitHub-login bleken te vereisen (gebruiker vond de
  download niet op mobiel).

## 2026-09-22 — FASE 1 BEWEZEN: eerste ISO gebouwd in CI ✅

- **CI-run 35791024492 geslaagd** (commit `5b9ddfa`, ~5,5 min bouwtijd):
  `brionai26-amd64.hybrid.iso` — **353 MB artifact** geüpload (14 dagen
  bewaard) — gebouwd in `dweedledo-wq/Vibe` (toenmalige tijdelijke
  thuisbasis, inmiddels vervangen door deze repo).
- Bewijs leverde drie runs (vaste "evidence before done"-discipline):
  1. Run 35789362236: ISO gebouwd, maar verify faalde — SHA256SUMS bevatte
     pad `../dist/…` dat niet matchte bij de check. Fix: checksum binnen
     `dist/` genereren met bare bestandsnaam.
  2. Run 35790137048: opnieuw verify-faal — de check draaide vanuit
     repo-root. Fix: `cd dist && sha256sum --check SHA256SUMS`.
  3. Run 35791024492: **volledig geslaagd** — build + verify + upload.
- **CI-tijd bevestigd:** volledige ISO-build in ~5-6 minuten — ruim binnen
  de verwachting ("tientallen minuten") uit BLUEPRINT.md.

## 2026-09-22 — Fase 1: minimaal basissysteem-ISO opgezet

- Officiële Debian Live Manual (hoofstuk "The basics") geraadpleegd voor de
  `live-build`-aanpak (`lb config` → `lb build` →
  `live-image-amd64.hybrid.iso`).
- Minimale eerste build opgezet: kaal basissysteem, nog géén
  desktop/devstack/Calamares.
- Toegevoegd: `bin/build-iso` (live-build in privileged
  `debian:stable`-container), `bin/build-iso-docker` (docker-wrapper),
  `.github/workflows/build-iso.yml` (build + verify + artifact-upload),
  `.gitignore`, `.env.example` (lege placeholders, per security-grondregel).

## 2026-09-22 — BLUEPRINT herschreven

- BLUEPRINT.md herschreven in opdracht van Brionize: het document gaat nu
  alléén nog over dit product. Alle LFS/BLFS/zusterproject-verwijzingen
  verwijderd; onderbouwing "waarom Debian en niet Mint/Ubuntu" vastgelegd.
  Missie-control-look, hover-tegels en de naam BrionAI26 zijn als
  productbesluiten vastgelegd (zie BLUEPRINT.md beslislog).

## 2026-09-22 (start)

- Project gestart. Doel vastgelegd: een eigen Linux — Debian kaal strippen,
  eigen inrichting (3 werkbladen, AI-tools, devstack), Calamares-installer,
  first-boot wizard. "Eerst bewijs, dan verder": elke fase eindigt met een
  bewezen build vóór de volgende fase begint.
