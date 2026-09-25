# FUI Desktop v2 — Ontwerpdocument (custom desktop shell)

Status: **TER GOEDKEURING AAN BRIONIZE** — pas na GO wordt er gebouwd.
Referentie: `brand/reference/WhatsApp Image 2026-09-24 at 14.15.02.jpeg`
(op branch `fui-doelplaat`) — het vastgestelde eindbeeld.
Vastgelegde besluiten: BLUEPRINT.md "FUI Desktop v2" + PROGRESS.md.

---

## 0. Definitie van "klaar" (acceptatiecriteria — niet eerder afleveren)

Het product is pas AF wanneer ALLE onderstaande criteria **bewezen** zijn
(VM-screenshot/­video + CI-build groen). Geen enkele stap telt als "klaar"
op mijn woord; elk criterium heeft hard bewijs nodig.

| # | Criterium | Bewijs |
|---|---|---|
| A1 | Frisse VM-boot van de Release-ISO toont op Command Center (Super+1) de tegelwand: ≥6 glas-tegels met LIVE data (CPU/RAM/disk/net/Tailscale/PM2), geen Conky-tekst maar webview-tegels | VM-screenshot na frisse boot, tegels zichtbaar, waarden lopen mee |
| A2 | Hover/klik: tegel onder muis komt vloeiend naar voren (groot + focus, direct typen); muis eraf = klapt terug naar rasterplek | VM-video of before/after screenshots |
| A3 | AI Matrix (Super+2): paneel met Claude/ChatGPT/Mistral/Gemini-tegels, zelfde hover/klik-gedrag | VM-screenshot |
| A4 | PWA-tegel + browser-tegel: pagina-inhoud zichtbaar in kleine tegel, hover/klik werkt | VM-screenshot |
| A5 | SysDash-tegel op Command Center toont de hub (via Tailscale); zonder hub zichtbare nette fallback-tegel | VM-screenshot |
| A6 | Look = referentiefoto: staalblauw palet (`mission-control.conf`), glas-effect, lichtende randen, HUD-font — geen standaard-XFCE-grijs | VM-screenshot naast referentiefoto |
| A7 | 3 werkbladen (Command Center / AI Matrix / Dev Studio) met Super+1/2/3, gelijke look & feel | VM-screenshots per werkblad |
| A8 | Werkt zonder GPU in QEMU (xrender/picom) — het doel is oude hardware | CI-run + VM-bewijs in software-rendering |
| A9 | ISO-build groen in CI; ISO downloadable als Release; frisse boot = het bewijsscherm | CI-run + Release-link |
| A10 | Na installatie via Calamares op de Asus: zelfde beeld als de VM | Foto/screenshot van de Asus |

**Arbeidsafspraak:** ik lever niets af vóór A1–A9 bewezen zijn. A10 (echte
hardware) doen we samen zodra jij de ISO op de Asus zet.

---

## 1. Wat is dit (naming, definitief)

We bouwen een **custom desktop shell** met een **FUI-look**:
- *Shell* = de software-laag die de werkplek tekent en regelt (tegelwand,
  hover/klik-machine, launcher).
- *FUI* = de design-taal van de referentiefoto (glas, licht, staalblauw).

De shell wordt NIET vanaf scratch geschreven: XFCE blijft de onderlaag
(vensterbeheer zonder GPU-eisen), onze shell zit er als laag bovenop.

## 2. Architectuur (wat blijft / wat nieuw)

```
┌─────────────────────────────────────────────┐
│  FUI-shell (nieuw)                          │
│  ├── tegelwand-host: 1 webview-venster per  │
│  │   werkblad, HTML/CSS/JS, semi-transparant │
│  ├── tile-manager (JS): raster, hover/klik, │
│  │   focus-stabilisatie (200 ms debounce)    │
│  ├── data-bus: /usr/local/bin/fui-data →    │
│  │   JSON (CPU/RAM/disk/net/Tailscale/PM2),  │
│  │   1 Hz push naar alle tegels              │
│  └── PWA/browser-tegels: aparte webviews     │
│      (Chromium/Firefox) via wmctrl in raster │
├─────────────────────────────────────────────┤
│  XFCE 4.20 (blijft) — vensterbeheer, picom   │
│  (glas, xrender), hotkeys, werkbladen        │
├─────────────────────────────────────────────┤
│  Debian + live-build + Calamares (bewezen)   │
└─────────────────────────────────────────────┘
```

**Vervalt:** Conky-HUD, devilspie2, losse heredoc-XML in apply-desktop.
**Blijft:** pipeline, CI, Calamares, boot-branding, 3 werkbladen +
Super-hotkeys, staalblauw palet, wallpaper/autologin-fixes, wizard.

### Waarom webview-tegels en niet native widgets
- De referentiefoto is een "web-look": glas, gloed, gradient-randen —
  dit is in HTML/CSS in uren te bouwen, in GTK in weken.
- Live data (1 Hz JSON) is een fetch-away in JS.
- Semi-transparante webviews + picom = echt glas-effect op de desktop.
- Op oude hardware: 1 webview-proces per werkblad is lichter dan 6–8
  aparte vensters met eigen compositing.

## 3. Werkbladen & tegelplattegrond

### 3.1 Command Center (Super+1) — de controlekamer
Raster 4×3 (12 plekken), tegels in glas-look:

```
┌────────┬────────┬────────┬────────┐
│ CPU    │ RAM    │ DISK   │ NET    │
├────────┼────────┼────────┼────────┤
│ SYS-   │ PM2    │ n8n    │ TAIL-  │
│ DASH   │        │        │ SCALE  │
├────────┼────────┼────────┼────────┤
│ LOGS   │ SERVICES│ TEMPO │ KLOK  │
└────────┴────────┴────────┴────────┘
```

- Elke tegel: titelbalk (HUD-font, TEXT_DIM), status-led (OK=steel,
  WARN=amber, CRIT=rood), live inhoud.
- Hover = tegel schuift naar voren over de buren (z-scale), 200 ms
  debounce tegen geflikker; klik = vastgezet (pinned), nogmaals klikken
  of Esc = terug.
- In pinned-stand: tegel is groot + focus (direct typen indien input).

### 3.2 AI Matrix (Super+2)
- 2×2 raster: Claude (Super+C), ChatGPT (Super+G), Mistral (Super+M),
  Gemini (Super+A) als PWA-webviews.
- Zelfde hover/klik-gedrag; standaard allemaal klein → hover = groot.
- PiP-variant (Super+P): één groot, rest klein — hotkey wisselt.

### 3.3 Dev Studio (Super+3)
- Editor-tegel groot (2×2-plekken), terminals/PM2/n8n-status klein
  eromheen; zelfde hover/klik-machine.

## 4. Hover/klik-state-machine (kern van het productgevoel)

```
IDLE (klein, in raster)
  ├─ muis-hover ≥200 ms → EXPANDED (groot, bovenliggend, focus)
  ├─ klik           → PINNED (blijft groot, ook als muis weggaat)
  └─ Super+Escape   → alles IDLE
EXPANDED
  ├─ muis weg ≥200 ms → IDLE
  └─ klik           → PINNED
PINNED
  ├─ klik op andere tegel → die wordt PINNED, deze IDLE
  └─ Esc / nogmaals klik  → IDLE
```

- Focus gaat mee naar de expanderende tegel (focus volgt muis tijdens
  hover; bij klik definitief).
- Animaties via CSS transforms (GPU-vrij: picom xrender laat CSS
  subpixel-transities soepel lopen op lage fps-count).

## 5. Databronnen (alles ECHT, geen nep-FUI)

| Tegel | Bron | Poll |
|---|---|---|
| CPU/RAM/DISK | `fui-data` daemon: /proc/stat, /proc/meminfo, df | 1 Hz |
| NET | /proc/net/dev, up/down-snelheid | 1 Hz |
| Tailscale | `tailscale status --json` | 5 s |
| PM2 | `pm2 jlist` (via bestand uit cron) | 5 s |
| n8n | health-endpoint hub | 5 s |
| SysDash | hub-URL via Tailscale (of nette offline-tegel) | 10 s |
| Logs | journalctl -f (gebufferde tail, laatste 50 regels) | push |

`fui-data` = klein Python-daemon die alles bundelt en op
`localhost:7633/json` zet; tegels fetchen daar (geen internet nodig,
alles lokaal — data is ECHT uit het eigen systeem).

## 6. Look & feel (uit de referentiefoto + theme-conf)

- BG_DEEP `#060B16`, panelen `#0A1424` @ 72% alpha (picom-glas).
- Randen: 1px `rgba(38,131,192,0.6)` + 6px glow `#2683C0` op 35%.
- Goud `#F0C090` alléén voor merk (BRIONAI26-titel, logo).
- HUD-font: Monospace Bold; TEXT_MAIN `#CDD8E1`, TEXT_DIM `#7A93B8`.
- Scanline-subtiliteit optioneel (foto-look), default aan, uitschakelbaar.

## 7. Wat vervalt na v2 (opruimstap)

- Conky-config + autostart (vervangen door tegelwand).
- devilspie2-regels (vervangen door tile-manager + wmctrl).
- Oude heredoc-XML-fixes in apply-desktop worden geconsolideerd tot
  één schoon XML-bestand.

## 8. Bouwvolgorde (elke stap = build + VM-bewijs, geen stap zonder)

1. **B1 — Tegelwand-host Command Center**: webview fullscreen op
   werkblad 1, 12 tegels statisch in de juiste look → VM-screenshot.
2. **B2 — Live data**: fui-data-daemon + fetch in tegels; waarden
   lopen mee in VM → VM-screenshot met actieve waarden.
3. **B3 — Hover/klik-machine**: state-machine + animatie → VM-video.
4. **B4 — AI Matrix + PWA/browser-tegels** (Super+2) → VM-screenshots.
5. **B5 — Dev Studio + hotkeys** (Super+3, wissel-raster) → screenshots.
6. **B6 — Opruimen**: Conky/devilspie2 eruit, ISO-slim → CI groen.
7. **B7 — Volledige acceptatierun**: frisse boot → alle criteria A1–A9
   bewezen in één run → Release-ISO voor de Asus (A10 samen).

## 9. Risico's & hoe we ze bewaken

| Risico | Bewaking |
|---|---|
| Webview-tegels te zwaar voor oude hardware | B1 meet RAM/CPU in VM met software-rendering; drempel: <15% CPU totaal |
| Focus-timing voelt traag | B3: hover→groot <300 ms gemeten; anders debounce tunen |
| picom xrender + webview-transparantie | B1 begint met bewezen picom-config uit v1 |
| Tailscale afwezig in VM | A5 fallback-tegel is ontworpen onderdeel, geen error |

## 10. Wat ik nodig heb van Brionize

1. **GO op dit ontwerp** (of aanpassingen — liever nu dan na B3).
2. Bevestiging: hub-URL voor SysDash = `100.96.40.22:9000` (staat in
   PROGRESS.md — klopt dat nog?).
3. Bij A10: de Asus beschikbaar voor de live-test.

---

*Ontwerp: 2026-09-25, ter goedkeuring. Bouw start pas na expliciete GO
van Brionize op dit document.*
