# BrionAI26 — Voortgangslog

> Evidence before done: elke fase eindigt met een bewezen CI-build vóór de
> volgende fase begint. Status-details en afspraken: zie HANDOFF.md.

## Volgende stappen

- Gebruiker: nieuwste ISO op USB live-booten en tegelwand + hover testen
  (devilspie2 nog nooit op echte hardware bewezen).
- Eerste echte Calamares-installatie op een testmachine.
- Fase 5: first-boot wizard (git-identiteit, AI-sleutels, Tailscale).
- Afwerking: GRUB-menu branding, Calamares NL-teksten, README-hotkeykaart.
- Oude testbranches op `dweedledo-wq/Vibe` opruimen (handmatig, gebruiker).

## 2026-09-23 — LOOK-POLISH 2: gouden vensterdecoratie ✅

- **CI-run 35898371987 geslaagd** (commit `0437438`, Release
  `iso-20260923-175953` — 1395 MB):
  - Eigen xfwm4-thema "BrionAI26": kopie van het kleurveranderbare
    Default-thema, met gouden titeltekst (#F0C090) op donker, blauwgrijze
    inactieve titels, gebouwd door live-hook 2200-build-xfwm4-theme.chroot.
  - Skel xfwm4.xml verwijst naar thema BrionAI26 + composited redirect.
  - Themerc en hook staan als aparte repo-bestanden in bin/branding/ (robuust
    tegen de terugkerende content-afwijkingen bij API-pushes).
- Blob-verificatie vóór de build ving een kapotte quote in apply-desktop
  (regel 159) — hersteld vóór CI, run in één keer geslaagd.

## 2026-09-23 — FASE 4 BEWEZEN: Calamares installer in ISO ✅

- **CI-run 35894259863 geslaagd** (commit `7525145`, ~10 min): Release
  met Calamares + "Installeer BrionAI26" desktop-icoon (pkexec calamares).
- Calamares 3.3.14 + calamares-settings-debian gegevengecheckt in trixie.

## 2026-09-23 — LOOK-POLISH 1: sci-fi HUD ✅

- **CI-run 35896414869 geslaagd** (Release 1395 MB): JetBrains Mono
  overal (conky + GTK), HUD-symbolen (◉ SYS/CPU/RAM/DSK/NET/BAT),
  batterij-tegel, gestippelde gouden separators.

## 2026-09-23 — FASE 3 BEWEZEN: Dev Studio + VS Code ✅

- **CI-run 35885427596 geslaagd** (1328 MB): VS Code via officiële
  Microsoft apt-repo, Geany reserve, git/gitg/tmux/python/node/npm.
- Downloads automatisch als publieke GitHub Release (geen login nodig).

## 2026-09-23 — FASE 2 AF: werkbladen + AI Matrix ✅

- **CI-run 35871715186**: 3 werkbladen, Super+1/2/3, Super+C/G/M/A PWA's.
- **CI-run 35855421072** (738,5 MB): eerste desktop-ISO, na conky-fix.

## 2026-09-22 — FASE 1 BEWEZEN ✅

- **CI-run 35791024492** (353 MB): eerste kale basis-ISO.

## 2026-09-22 (start)

- Project gestart. Doel: eigen Linux — Debian kaal strippen, eigen inrichting
  (3 werkbladen, AI-tools, devstack), Calamares-installer, first-boot wizard.
  "Eerst bewijs, dan verder": elke fase eindigt met een bewezen build.
