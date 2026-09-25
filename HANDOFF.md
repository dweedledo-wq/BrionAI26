# HANDOFF

## Actuele staat (2026-09-25, overdracht voor de volgende sessie)

- **Fases 1 t/m 5 zijn bewezen** (zie PROGRESS.md): live-build-pipeline,
  CI met ISO-Releases, GRUB-thema + splash met merklogo, Calamares
  end-to-end, first-boot-wizard. Nieuwste bewezen main-ISO:
  Release `iso-20260925-090100` (CI-run 36115003197, merge PR #7,
  SHA256 3e61027f…a018).
- **Volgende grote opdracht (productbesluit Brionize, 2026-09-25):
  "FUI Desktop v2"** — de desktop-laag in één keer schoon herontwerpen
  (live glas-tegels, hover/klik, AI-paneel, PWA-tegels, SysDash als
  Command Center-tegel i.p.v. Conky-HUD). **Eerst het ontwerp
  uitwerken en aan Brionize voorleggen; pas na zijn GO bouwen.**
  Volledig hoofdstuk in BLUEPRINT.md ("FUI Desktop v2").
- **Lopend wallpaper/lightdm-onderzoek** (details + bewijzen in
  PROGRESS.md, sectie 2026-09-25 "WALLPAPER/LIGHTDM-ONDERZOEKE"):
  - Fix 1 (xfdesktop monitor-level properties, commit `b291bb9`) en
    fix 2 (lightdm greeter-config, commit `30f30a3`) zijn gepusht naar
    `vibe/fui-staalblauw-8404e4` en bewezen via Release
    `iso-20260925-124551` (greeter toont staalblauwe wallpaper).
  - Fix 3 (autologin-user=user) en fix 4 (desktop-base default-symlinks
    + monitor1-blok in de xml) zijn inmiddels wél in `bin/apply-desktop`
    opgenomen en naar de werkbranch gepusht (commit `d94773a`,
    byte-exact geverifieerd).
  - Nog te leveren: CI-bewijs van de nieuwe push → VM-bewijs dat de
    live-desktop na frisse boot de wallpaper toont. Let op het
    autologin-risico voor de geïnstalleerde pc (live-only-variant
    overwegen; Calamares displaymanager.conf bestaat al).

## Werken met de repo (transport, 2026-09-25)

- `git push` vanaf de sandbox faalt ("No anonymous write access") en
  `gh api`-mutaties zijn geblokkeerd; de GitHub App-authenticatie werkt
  wél. Bestanden pushen gaat via de tool `github_app_create_or_update_file`
  (per bestand; vereist de huidige blob-sha van het bestand op de
  branch). Grote bestanden tot ~12KB gaan goed; binaire/logo-blobs
  kunnen over de API corrupt raken — gebruik placeholders (les uit
  PR #7).
- Nieuwe remote branches aanmaken kan niet via de tool; werk op de
  bestaande branch `vibe/fui-staalblauw-8404e4` of merge via PRs.
- Werkt `git push` in een nieuwe sessie wél, gebruik die route.
- Lees-werk (clonen, fetchen, CI/logs bekijken, releases downloaden)
  werkt gewoon via git/gh.

## VM-testomgeving (QEMU) — de bewezen aanpak

- QEMU met `-display none`; monitor via unix-socket `/tmp/vm/monitor.sock`
  (hulp: `mon.py`), serial via `/tmp/vm/serial.sock` (`ssend.py` of de
  eenvoudiger `sx.py`), screendumps → PPM → PIL-kleurhistogram +
  tesseract OCR. Toetsen sturen via QEMU-monitor `sendkey` (shift nodig?
  dan `shift-<toets>`, bv. `shift-s` voor hoofdletter).
- Live-gebruiker: naam `user`, wachtwoord `live`. TTY3 (ctrl-alt-f3)
  geeft auto-login shell. Serial-shell starten: `sudo systemctl start
  serial-getty@ttyS0.service`, daarna inloggen via serial.
- **D-Bus-valkuil:** xfconf-wijzigingen vanaf een serial-shell pakken
  niet in de GUI-sessie. Gebruik altijd
  `DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus`, `DISPLAY=:0`,
  `XAUTHORITY=/home/user/.Xauthority` (env overnemen van het draaiende
  xfdesktop-proces). xfdesktop herladen kan koppig zijn; een volledige
  `systemctl restart lightdm` is de betrouwbare route.
- Kleurpalet voor pixel-bewijs: BG_DEEP #060B16 = RGB(6,11,22);
  teal-biedende Debian-default = RGB(0,52,69).

## Voor de AI die dit oppikt (bv. Mistral) — lees dit eerst, volledig

Dit is een **eerlijke, volledige overdracht** van het project
**BrionAI26**: een eigen Linux-distributie op basis van kaalgestript
Debian (stable), met eigen inrichting en een eigen doel — zie
BLUEPRINT.md voor het volledige productdoel en de architectuur.

1. **Lees eerst BLUEPRINT.md en PROGRESS.md, helemaal, vóór je iets bouwt.**
   PROGRESS.md bevat de actuele status en de eerstvolgende stap.
2. **Daarna mag je zelfstandig (autopilot) doorwerken** binnen wat in
   BLUEPRINT.md is vastgelegd — je hoeft niet voor elke implementatiestap
   terug te vragen. Wél teruggeven aan de mens (Brionize) bij:
   - een echt productbeslispunt waarvoor meerdere geldige richtingen
     bestaan en de keuze het eindproduct wezenlijk bepaalt;
   - iets dat geld kost of een externe, blijvende verplichting aangaat;
   - een actie die naar buiten toe publiceert/verzendt namens Brionize;
   - een destructieve of moeilijk terug te draaien actie;
   - een nieuwe privacy-, security- of rechtengrens.
   Voor gewone implementatiedetails, scripts schrijven, bugs oplossen,
   commits maken: gewoon doorgaan.
3. **Brionize is Nederlandstalig** — communiceer in gewoon Nederlands,
   helder en zonder jargon omhaal; leg technische keuzes kort uit.
   Vraag hooguit één korte vraag als iets echt niet te ontdekken is.

## Niet-onderhandelbare regels, ongeacht welke AI dit uitvoert
- **Nooit hardcoded secrets, wachtwoorden, API-keys of persoonlijke
  gegevens in de repository** — ook niet tijdelijk. Alleen `.env.example`
  met lege placeholders; echte waarden komen pas op de doelmachine, via
  de first-boot-wizard.
- **Evidence before done:** claim nooit dat een build werkt, een ISO
  bootable is, of een stap "klaar" is zonder dat daadwerkelijk getest en
  bewezen (bijvoorbeeld: een geslaagde CI-run, een daadwerkelijk gebouwde
  ISO). Eén grondige verificatie is beter dan tien halve.
- **Officiële bron eerst.** Gebruik voor elk onderdeel (Debian Live
  Manual, pakketdocumentatie, Calamares-documentatie) de officiële,
  actuele documentatie — niet uit het geheugen gokken over
  versies/commando's die kunnen zijn veranderd.
- **Documenteer terwijl je werkt.** Werk PROGRESS.md continu bij (wat is
  gedaan, wat werkte niet en waarom, wat is de volgende stap) en houd
  BLUEPRINT.md actueel als architectuurkeuzes concreeter worden. Het moet
  voor een volgende sessie opnieuw leesbaar zijn zonder gokken.
- **Reproduceerbaar.** Alle benodigde context staat in deze repo; geen
  externe project-state veronderstellen.

## Eerstvolgende stap

Zie PROGRESS.md ("Volgende stappen"). Kern: **FUI Desktop v2 — eerst het
ontwerp uitwerken en aan Brionize voorleggen, pas na zijn GO bouwen.**
Daarnaast liggen de wallpaper/lightdm-fixes 3+4 klaar om te pushen,
CI-bewijs op te leveren en in de VM te bewijzen (details in PROGRESS.md).
