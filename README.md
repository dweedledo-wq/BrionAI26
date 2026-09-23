# BrionAI26

Eigen Linux-distributie op basis van kaalgestript Debian (stable).
Zie BLUEPRINT.md voor de productvisie en PROGRESS.md voor het bewijslog.

## Download

Nieuwste ISO: zie [Releases](https://github.com/dweedledo-wq/BrionAI26/releases)
— publiek downloadbaar, geen account nodig. Minimaal een 4 GB USB-stick.

## Wat zit erin

- Debian stable (trixie), XFCE-desktop met mission-control-look
- 3 werkbladen + tegelwand (devilspie2) met hover-uitbreiding
- AI Matrix: Claude / ChatGPT / Mistral / Gemini als PWA-vensters
- Dev Studio: VS Code, Geany, git, tmux, Python, Node.js
- Calamares-installer ("Installeer BrionAI26" op de live-desktop)
- First-boot wizard: git-identiteit + AI-sleutels
- Boot-splash met BrionAI26-logo, gouden HUD-conky, JetBrains Mono

## Sneltoetsen

| Toets | Actie |
|---|---|
| Super+1 | Werkblad Command Center |
| Super+2 | Werkblad AI Matrix |
| Super+3 | Werkblad Dev Studio |
| Super+C | Claude (PWA, opent op AI Matrix) |
| Super+G | ChatGPT (PWA) |
| Super+M | Mistral (PWA) |
| Super+A | Gemini (PWA) |
| Super+E | VS Code (opent op Dev Studio) |
| Super+T | Terminal (opent op Dev Studio) |

## Bouwen

CI bouwt automatisch bij pushes naar `bin/` of `desktop/`
(workflow: `.github/workflows/build-iso.yml`). Lokaal: `sh bin/build-iso-docker`
(Docker vereist). Elke geslaagde build wordt gepubliceerd als Release.

## Installatie

1. ISO op USB-stick schrijven (bv. met balenaEtcher of `dd`)
2. Live-booten en testen — raakt de interne schijf niet aan
3. Dubbelklik "Installeer BrionAI26" om permanent te installeren
4. Eerste login: first-boot wizard start automatisch
