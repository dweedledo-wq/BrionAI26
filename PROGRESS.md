# BrionAI26 — Voortgangslog

> Evidence before done: elke fase eindigt met een bewezen CI-build vóór de
> volgende fase begint. Status-details en afspraken: zie HANDOFF.md.

## Volgende stappen (na fase 4)

- Fase 5: first-boot wizard (git-identiteit, AI-sleutels, Tailscale).
- Look-polish vervolg: eigen xfwm4-thema (gouden titelbalken), paneel-styling,
  picom-blur versterken.
- Oude testbranches op `dweedledo-wq/Vibe` opruimen (handmatig, gebruiker).

## 2026-09-23 — FASE 4 BEWEZEN: Calamares installer in ISO ✅

- **CI-run 35894259863 geslaagd** (commit `7525145`, ~10 min): Release
  `iso-20260923-171843` — ISO met Calamares + "Installeer BrionAI26"
  desktop-icoon (pkexec calamares).
- Calamares 3.3.14 + calamares-settings-debian gegevengecheckt in trixie
  vóór invoering (packages.debian.org).
- Droogrun van apply-desktop bewees: installer-icoon en pakketlijst correct
  in de skel geplaatst.

## 2026-09-23 — LOOK-POLISH 1: sci-fi HUD ✅

- **CI-run 35896414869 geslaagd** (commit `94cf996`, Release
  `iso-20260923-174323` — **1395 MB**):
  - JetBrains Mono (HUD-lettertype) overal: conky, GTK (menu's/vensters).
  - Conky-HUD geüpgradeerd: HUD-symbolen (◉ SYS/CPU/RAM/DSK/NET/BAT),
    batterij-tegel, gestippelde gouden separators.
- Eerste conky-push had 3 tekstafwijkingen (dubbele default_color, gap_y=2,
  Lua-comment-syntaxis) — direct hersteld in vervolgcommit `dd85e7a` en
  blob-geverifieerd (content-truncatie-issues bij API-pushes zijn terugkerend;
  blob-check via git/trees is nu standaard).

## 2026-09-23 — FASE 3 BEWEZEN: Dev Studio + VS Code in ISO ✅

- **CI-run 35885427596 geslaagd** (~12 min): Release `iso-20260923-160937`
  — **1328 MB ISO**. VS Code via officiële Microsoft apt-repo (live-hook),
  Geany reserve, git/gitg/tmux/python/node/build-essential.
- Downloads automatisch als publieke GitHub Release (geen login nodig).

## 2026-09-23 — FASE 2 AF: werkbladen + AI Matrix in ISO bewezen ✅

- **CI-run 35871715186 geslaagd**: 3 werkbladen (Command Center / AI Matrix /
  Dev Studio), Super+1/2/3 wissel, Super+C/G/M/A AI-PWA's, chromium.
- **CI-run 35855421072** (eerste desktop-ISO 738,5 MB) na 6 falende runs:
  log-vangnet (tee) onthulde conky-virtueel-pakket als oorzaak.

## 2026-09-22 — FASE 1 BEWEZEN ✅

- **CI-run 35791024492 geslaagd** (353 MB): eerste kale basis-ISO, in
  `dweedledo-wq/Vibe` gebouwd. Drie runs bewezen de verify-fixes.

## 2026-09-22 (start)

- Project gestart. Doel: eigen Linux — Debian kaal strippen, eigen inrichting
  (3 werkbladen, AI-tools, devstack), Calamares-installer, first-boot wizard.
  "Eerst bewijs, dan verder": elke fase eindigt met een bewezen build.
