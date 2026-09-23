# BLUEPRINT — BrionAI26 (eigen Linux, Debian-basis)

## Wat wij bouwen
Wij bouwen een **eigen Linux-distributie**: **BrionAI26**.
Geen doorsnee-desktop, maar een doelgericht besturingssysteem dat op een
USB-stick past, op vrijwel elke (ook oudere) pc boot en installeert, en
daarna een kant-en-klare 24/7-werkplek is: het **Citizen Developer & AI
Command Center** van Brionize — van idee tot eindproduct bouwen met AI,
automatisering (n8n) en developer-tooling, het liefst op oude hardware
zonder (goede) GPU.

### Kleurpalet (productbesluit, vastgesteld door AI in overleg met Brionize)
**Missie-control-look** — gekozen om de "monitorwand uit films"-visie te
dragen. Alle kleuren liggen als variabelen in één thema-bestand per
build (`brand/theme/`), dus **later altijd aanpasbaar** zonder de rest
van het systeem aan te raken.

| Rol | Kleur | Hex | Gebruik |
|---|---|---|---|
| Achtergrond diep | vrijwel zwart | `#0A0E12` | bureaublad, basisvlakken |
| Achtergrond paneel | donkerblauw-grijs | `#131A21` | tegelpanelen, taakbalk |
| Glas-fill | semi-transparant | `rgba(19,26,33,0.72)` | picom-glas-effect |
| Accent 1 (primair) | cyan/teal | `#00E5FF` | lichtende randen, hotkeys, klok |
| Accent 2 (secundair) | matrix-groen | `#00FF9C` | status-OK, actieve tegels |
| Waarschuwing | amber | `#FFB300` | hoge CPU/RAM, PM2-problemen |
| Fout/kritiek | rood | `#FF3B4E` | service-down, logs fout |
| Tekst primair | helder wit-blauw | `#D7E6F0` | HUD-tekst, labels |
| Tekst secundair | gedempt | `#6B8399` | bij-regels, tijdstempels |

- **Waarom dit palet:** cyan/teal is dé kleur van film-HUD's (Iron Man,
  Westworld, SpaceX-console) en leest op oude schermen het scherpst;
  matrix-groen als tweede accent geeft de AI-tegels hun eigen signaal;
  amber/rood houden het mission-control-overzicht leesbaar zonder extra
  kleur-ruis.
- **Donker boven licht:** het palet is bewust donker (24/7-gebruik,
  oude schermen, minder stroop voor de GPU-loze hardware).
- Zodra het logo van Brionize binnen is, wordt gecontroleerd of de
  logo-kleuren harmoniëren; zo niet, wordt het accent bijgesteld
  (en dat kan ook later altijd, via het thema-bestand).

### Branding (fase 2/4)
De naam **BrionAI26** is overal zichtbaar, vanaf het eerste scherm:
- **Boot**: GRUB-menu en opstartscherm (splash) in BrionAI26-stijl.
- **Login-scherm** in de glas-look.
- **Calamares-installer**: eigen merk-schermen i.p.v. generiek grijs.
- Systeemnaam/versie overal consistent (bv. `BrionAI26 1.0 (Debian
  stable-basis)`).
- Logo komt in `brand/logo/` (bronbestand, zie `brand/README.md`); afgeleiden
  voor boot/login/installer worden daaruit gegenereerd.

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
  dunne lichtende randen (cyan/teal), monospace-HUD-lettertype, subtiele
  "glasvezel"-lijnen. Geen standaard grijs bureaublad-thema maar een
  HUD-overlay over alles.
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
1. **Basissysteem** — `live-build`-configuratie: Debian-basis, kernel/bootloader/netwerk, live-boot-mechanisme. *Bewezen: geslaagde CI-run 35845349377 (353 MB ISO).*
2. **Desktop-laag** — XFCE dark, 3 werkbladen, Conky, tiling, hotkeys.
3. **Devstack & apps** — zie hierboven.
4. **Installer-integratie** — Calamares in de live-omgeving, configureren voor onze schijf-/bootloader-eisen.
5. **First-boot wizard** — zie hierboven.

## CI-strategie
- Vrijwel alles via `apt`/binaire installs, dus een volledige ISO-build
  hoort **ruim binnen tientallen minuten** op een standaard GitHub
  Actions-runner te passen. **Bevestigd:** volledige build in ~5-6 min.
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

## Human in the loop bij CLI-toegang (grondregel, vastgesteld door Brionize)

Van toepassing op AI met CLI/terminal-toegang bínnen BrionAI26: als we
AI-tools (Claude, ChatGPT, Mistral, Gemini) op de geïnstalleerde pc
terminal-toegang geven, blijft de mens (Brionize) de CEO/dirigent: het
laatste besluit ligt altijd bij de mens. De AI mag voorstellen en
uitvoeren wat is goedgekeurd, maar niets blijvends, externs of
publicerends zonder menselijke eindbeslissing. Deze regel gaat
specifiek over AI-in-het-systeem en vervangt niet de bestaande
werkwijze van het bouwproject zelf (zie HANDOFF.md).

## API's & sleutels (fase 3/5)

Alle benodigde API's staan in `.env.example` (placeholders, geen waarden).
- AI-assistenten (ANTHROPIC/OPENAI/GEMINI/MISTRAL) — via de first-boot-wizard.
- Infrastructuur (Tailscale, GitHub, Supabase, Cloudflare, n8n) — bewust
  via interactieve CLI-login (tailscale up, gh auth login, supabase login,
  cloudflared tunnel login): geen geheimen op schijf, geen limieten.

## Wat nog open staat
- Pakketlijsten/hooks voor desktop-laag (fase 2) en devstack (fase 3) nog
  uitwerken.
- Exacte Calamares-configuratie voor onze schijf-/bootloader-eisen.
- Onderverdeling gebruikersaanmaak: wat Calamares doet, wat de
  first-boot-wizard doet.
- Logo-upload in `brand/logo/` (Brionize heeft upload gepland).

## Beslislog
- **2026-09-23 — Human-in-the-loop bij CLI-toegang vastgesteld (productbesluit, Brionize).**
  Grondregel: bij AI met CLI/terminal-toegang bínnen BrionAI26 blijft de
  mens altijd de CEO/dirigent — niets blijvends, externs of publicerends
  zonder menselijke eindbeslissing (details in de gelijknamige sectie).
- **2026-09-23 — Kleurpalet vastgesteld (productbesluit, AI in overleg met Brionize).**
  Missie-control-palet: achtergrond `#0A0E12`/`#131A21`, primair accent
  cyan/teal `#00E5FF` (lichtende randen, hotkeys), secundair matrix-groen
  `#00FF9C` (status/actieve tegels), amber/rood voor waarschuwing/fout.
  Alle kleuren als variabelen in één thema-bestand → later altijd
  aanpasbaar. Check tegen logo-kleuren zodra die binnen zijn.
- **2026-09-22 — Naam vastgesteld (productbesluit, Brionize): BrionAI26.**
  De distributie heet officieel **BrionAI26** — zichtbaar op boot, login,
  installer en in het hele systeem.
- **2026-09-22 — Project gestart als eigen Linux op Debian-basis.**
  Doel: BrionAI26 — eigen distributie op basis van kaalgestript Debian,
  met eigen inrichting (werkbladen, AI-tools, devstack, wizard).
  Live-build + Calamares + GitHub Actions als bouwomgeving.
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
- **2026-09-22 — Fase 1 opgezet en bewezen.** Minimale `live-build`-config
  (stable/amd64/iso-hybrid); CI-run 35845349377 leverde de eerste echte
  ISO (353 MB, ~5,5 min).
