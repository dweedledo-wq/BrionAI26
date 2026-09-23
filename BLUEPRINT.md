# BLUEPRINT — BrionAI26 (eigen Linux, Debian-basis)

## Wat wij bouwen
Wij bouwen een **eigen Linux-distributie**: **BrionAI26**.
Geen doorsnee-desktop, maar een doelgericht besturingssysteem dat op een
USB-stick past, op vrijwel elke (ook oudere) pc boot en installeert, en
daarna een kant-en-klare 24/7-werkplek is: het **Citizen Developer & AI
Command Center** van Brionize — van idee tot eindproduct bouwen met AI,
automatisering (n8n) en developer-tooling, het liefst op oude hardware
zonder (goede) GPU.

### Branding (fase 2/4)
De naam **BrionAI26** is overal zichtbaar, vanaf het eerste scherm:
- **Boot**: GRUB-menu en opstartscherm (splash) in BrionAI26-stijl.
- **Login-scherm** in de glas-look.
- **Calamares-installer**: eigen merk-schermen i.p.v. generiek grijs.
- Systeemnaam/versie overal consistent (bv. `BrionAI26 1.0 (Debian
  stable-basis)`).
- Logo komt in `brand/logo/` (bronbestand, zie `brand/README.md`); afgeleiden
  voor boot/login/installer worden daaruit gegenereerd.
- Nog open: **kleur van de lichtende randen** (cyan/teal of
  matrix-groen) — wordt met Brionize vastgesteld vóór fase 2.

## Waarom Debian als basis (en niet Mint of Ubuntu)
Een eigen Linux bouwen betekent: een bestaande, betrouwbare basis nemen,
die **helemaal kaal strippen** en er onze eigen inrichting op zetten. Dat
is een geheel legale en normale route — Ubuntu (op Debian), Linux Mint
(op Ubuntu), Raspberry Pi OS (op Debian) en Kali Linux (op Debian) zijn
precies zo begonnen.

Wij kiezen **Debian zelf** als basis, en niet Linux Mint of Ubuntu, omdat:
- Debian de **bron** is — Mint en Ubuntu zijn er zelf op gebouwd; wie van
  Mint start, moet eerst een extra laag (Ubuntu + Mint-gereedschap) weer
  afstrippen.
- Debian van zich al **kaal** te leveren is (minimale installatie), wat
  precies onze insteek is.
- Debian een **officieel bouwgereedschap** heeft voor eigen live/installer
  ISO's: `live-build` (van het debian-live project) — gedocumenteerd,
  breed gebruikt, voorspelbaar. Voor Mint-respins bestaat geen
  equivalent officieel gereedschap.
- Debian's standaardkernel de **breedste oude-hardware-ondersteuning**
  heeft — onze eis "generieke hardware, geen GPU-afhankelijkheid" wordt
  zo vanzelf ingevuld.

## Architectuur
- **Basis: Debian (stable), minimaal geïnstalleerd** — gestript tot het
  hoognodige, via `apt` (kant-en-klare binaire pakketten). Geen
  broncode-compilatie van kernel/desktopomgeving: dat houdt de bouw
  snel en herstelbaar.
- **Bouw-gereedschap: `live-build`** (officieel Debian-gereedschap voor
  aangepaste live/installer-ISO's). Zie de officiële Debian Live Manual.
- **Installer: Calamares** — distributie-onafhankelijke, grafische
  installer die vanuit de live-omgeving het systeem permanent naar de
  interne schijf installeert (partitioneren, formatteren, bootloader).
  Gebruikt door bestaande eigen distributies (KDE neon, Manjaro,
  EndeavourOS). Calamares voorkomt dat we zelf een installatiemechanisme
  moeten uitvinden.
- **Type ISO: volledige installer-naar-schijf**, geen live-boot-only
  (reden: hitte/slijtage van een persistent-USB-stick, 24/7-doel).
- **Bouw-omgeving: GitHub Actions** — `live-build` draait in een
  privileged `debian:stable`-container op de runner (chroot/mount vraagt
  root). Geen eigen buildserver nodig.

## Onze eigen inrichting (de "ziel" van dit OS)
Dit is wat BrionAI26 tot óns product maakt.

### Visie: mission control, geen bureaublad
Het hele systeem voelt als de **controlekamer uit een film**: een wand van
hightech monitoren, glas en licht. Elk werkblad is zo'n wand — meerdere
tegels tegelijk in beeld en tegelijk bedienbaar. Concreet:
- **Look:** donkere achtergrond, panelen als doorschijnend **glas** met
  dunne lichtende randen (cyan/teal of matrix-groen), monospace-
  HUD-lettertype, subtiele "glasvezel"-lijnen. Geen standaard grijs
  bureaublad-thema maar een HUD-overlay over alles.
- **Tegels i.p.v. zwevende vensters:** vensters vallen automatisch in een
  **raster** — modus **2×2** (grote tegels) of modus **4×4** (kleine
  tegels, echte monitorwand-look). Eén tegel kan op **PiP**-modus: één
  groot + de rest klein in beeld.
- **Hover-uitbreiding (productbesluit Brionize):** in de kleine-tegels-
  modi (4×4 of PiP) wordt de tegel waar de muis overheen beweegt
  **direct groot naar voren gebracht** (focus-inclusief: meteen kunnen
  typen), en zodra de muis de tegel verlaat, **klapt de tegel vanzelf
  weer klein** terug op zijn rasterplek. Zo scrolt u als het ware door
  de monitorwand: aanraken = groot + actief, wegglijden = klein.
- **Bediening:** Super+1/2/3 wisselt de werkbladen; een hotkey wisselt het
  raster (2×2 ↔ 4×4); vensters hoeven nooit gesleept te worden.

### Werkbladen (vast, vrij uitbreidbaar)
- **Command Center (Super+1)** — de controlekamer: wand van live status-
  tegels (CPU, RAM, opslag, netwerk/Tailscale, n8n-flows, PM2, logs),
  elk als eigen glas-tegel, alles tegelijk in één oogopslag.
- **AI Matrix (Super+2)** — de AI-tegelwand: Claude AI, ChatGPT, Mistral
  AI, Gemini als PWA-vensters (hotkeys Super+C/G/M/A), standaard **2×2**
  (alle vier tegelijk actief) of PiP (één groot + drie klein).
- **Dev Studio (Super+3)** — de bouwplaats: editor groot, terminals/
  PM2/n8n-status als tegels eromheen.

### Technische onderbouwing (fase 2)
- **XFCE** — lichtgewicht, draait soepel op oude hardware.
- **picom** (compositor) — geeft het échte glas-effect: doorschijnende
  panelen en zachte schaduwen; ook op oude hardware draaibaar
  (xrender-backend werkt zonder GPU).
- **Conky** — de live HUD-tegels: CPU/RAM/opslag, Tailscale-status, logs,
  processtatus — puur tekst/grafieken, gestyled als glaspanelen.
- **devilspie2/wmctrl** — het aparte tiling-mechanisme dat vensters
  automatisch in het 2×2/4×4-raster plaatst (bewust gescheiden van
  Conky, dat alleen toont).
- **Hover-uitbreiding, technisch:** XFCE "focus volgt muis" + een
  devilspie2-regel die bij focus een venster groot maakt en bij unfocus
  terugschuift naar zijn rasterplek (devilspie2 reageert op focus-
  events, geen polling nodig). In- en uitklappen krijgen een korte
  stabilisatie-vertraging (bv. 150-250 ms) zodat de wand niet flikkert
  als de muis er even langs schampt; gladde animatie via picom.
  Wordt in fase 2 gebouwd en getest — met name de scherpte van de
  focus-timing (meteen kunnen typen) is een aandachtspunt.

### Devstack & apps (fase 3)
- Via `apt` en officiële install-repositories/scripts: Node.js
  (NodeSource), Bun (officieel script), Python 3, PostgreSQL, SQLite,
  Supabase CLI (officiële binary), GitHub CLI (officieel apt-repo), n8n
  (npm), Tailscale (officieel apt-repo), cloudflared (officiële .deb),
  PM2 (npm) + systemd watchdogs (zelfherstellend).

### First-boot wizard (fase 5)
Draait éénmalig ná installatie op de doel-pc: lokale gebruiker aanmaken,
`tailscale up`, `gh auth login`, optionele AI-keys (Anthropic/OpenAI/
Gemini/Mistral) naar `~/.env`. Schakelt zichzelf na afloop uit.

## Bouwfasen
1. **Basissysteem** — `live-build`-configuratie: Debian-basis, kernel/bootloader/netwerk, live-boot-mechanisme. *Huidige fase; eerst een bewezen minimale ISO-build.*
2. **Desktop-laag** — XFCE dark, 3 werkbladen, Conky, tiling, hotkeys.
3. **Devstack & apps** — zie hierboven.
4. **Installer-integratie** — Calamares in de live-omgeving, configureren voor onze schijf-/bootloader-eisen.
5. **First-boot wizard** — zie hierboven.

## CI-strategie
- Vrijwel alles via `apt`/binaire installs, dus een volledige ISO-build
  hoort **ruim binnen tientallen minuten** op een standaard GitHub
  Actions-runner te passen. Moet bevestigd worden door de eerste echte
  build, niet aangenomen.
- Repo is publiek → gratis Actions-minuten tijdens de bouwfase.
- Mocht er tóch een aangepast pakket gecompileerd moeten worden
  (zeldzaam): officiële bron eerst, checksum-verplichte fallback-keten,
  nooit stilzwijgend een andere versie accepteren.

## Security / Secrets (grondregel, niet onderhandelbaar)
- **Nooit hardcoded secrets, accounts of persoonlijke data in de repo.**
- `.env.example` met alleen lege placeholders; echte waarden uitsluitend
  via de first-boot-wizard op de doel-pc, lokaal, buiten git
  (`.gitignore`).
- Geen API-keys of tokens in build-configuratie/CI-workflow-bestanden.

## Wat nog open staat
- Pakketlijsten/hooks voor desktop-laag (fase 2) en devstack (fase 3) nog
  uitwerken.
- Exacte Calamares-configuratie voor onze schijf-/bootloader-eisen.
- Onderverdeling gebruikersaanmaak: wat Calamares doet, wat de
  first-boot-wizard doet.
- Fase-1-bewijs: CI-run die daadwerkelijk een ISO-artifact oplevert.

## Beslislog
- **2026-09-22 — Naam vastgesteld (productbesluit, Brionize): BrionAI26.**
  De distributie heet officieel **BrionAI26** — zichtbaar op boot, login,
  installer en in het hele systeem. Logo en accentkleur volgen nog.
- **2026-09-22 — Project gestart als eigen Linux op Debian-basis.**
  Doel: BrionAI26 — eigen distributie op basis van
  kaalgestript Debian, met eigen inrichting (werkbladen, AI-tools,
  devstack, wizard). Live-build + Calamares + GitHub Actions als
  bouwomgeving.
- **2026-09-22 — Missie-control-look vastgesteld (productbesluit, Brionize).**
  Elk werkblad wordt een "monitorwand uit films": hightech glas-panelen,
  lichtende randen, HUD-lettertype; vensters vallen automatisch in een
  **2×2- of 4×4-raster** (tegelmodus, incl. PiP-variant), nooit los
  zwevend. Command Center = live status-tegels; AI Matrix = vier
  AI-assistenten tegelijk; Dev Studio = editor + terminals als tegels.
  Technisch: XFCE + picom (glas-effect, ook zonder GPU) + Conky +
  devilspie2/wmctrl. Dit is de leidende look voor de hele desktop-fase.
- **2026-09-22 — Hover-uitbreiding vastgesteld (productbesluit, Brionize).**
  In de kleine-tegels-modi groeit de tegel onder de muis direct groot
  mee (focus inclusief: meteen typen); muis eraf = tegel klapt vanzelf
  terug klein. Implementatie: focus-volgt-muis + devilspie2 focus-
  events, met korte stabilisatie-vertraging tegen geflikker; gladde
  animatie via picom. Bouwt en bewijst in fase 2.
- **2026-09-22 — Fase 1 opgezet (nog niet bewezen).** Minimale
  `live-build`-config (stable/amd64/iso-hybrid) met CI-workflow die de
  ISO als artifact levert; bewijs volgt uit de eerste geslaagde CI-run.
