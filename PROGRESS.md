# PROGRESS — reisverslag (BrionAI26)

## 2026-09-23 — Definitieve thuisbasis: dweedledo-wq/BrionAI26 ✅
- Nieuwe publieke repo aangemaakt door Brionize:
  `github.com/dweedledo-wq/BrionAI26` — publiek, dus gratis Actions-minuten
  (precies zoals de CI-strategie in BLUEPRINT.md voorschrijft).
- Volledige projectstatus overgezet via de Mistral GitHub App:
  README, CI-workflow, build-scripts, BLUEPRINT, HANDOFF, PROGRESS,
  brand-map, .gitignore, .env.example.
- Executable-bits van scripts blijven weg via API-push; workflow roept
  scripts daarom via `sh` aan (commit in workflow verwerkt).
- Eerstvolgende stap: eerste CI-run op deze repo laten uitdraaien tot een
  geslaagde ISO-artifact — dan is fase 1 hier formeel bewezen. Daarna:
  logo uploaden (brand/logo), accentkleur kiezen, fase 2 (desktop-laag).

## 2026-09-22 — FASE 1 BEWEZEN: eerste ISO gebouwd in CI ✅
- **CI-run 35791024492 geslaagd** (commit `5b9ddfa`, ~5,5 min bouwtijd):
  `brionai26-amd64.hybrid.iso` — **353 MB artifact** geüpload
  (14 dagen bewaard) — gebouwd in `dweedledo-wq/Vibe` (toenmalige
  tijdelijke thuisbasis, inmiddels vervangen door deze repo).
- Bewijs leverde drie runs (vaste "evidence before done"-discipline):
  1. Run 35789362236: ISO gebouwd, maar verify faalde — SHA256SUMS
     bevatte pad `../dist/…` dat niet matchte bij de check. Fix: checksum
     binnen `dist/` genereren met bare bestandsnaam.
  2. Run 35790137048: opnieuw verify-faal — de check draaide vanuit
     repo-root. Fix: `cd dist && sha256sum --check SHA256SUMS`.
  3. Run 35791024492: **volledig geslaagd** — build + verify + upload.
- **CI-tijd bevestigd:** volledige ISO-build in ~5-6 minuten — ruim binnen
  de verwachting ("tientallen minuten") uit BLUEPRINT.md.

## 2026-09-22 — Fase 1: minimaal basissysteem-ISO opgezet
- Officiële Debian Live Manual (hoofdstuk "The basics") geraadpleegd voor de
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
  verwijderd; onderbouwing "waarom Debian en niet Mint/Ubuntu"
  vastgelegd. Missie-control-look, hover-tegels en de naam BrionAI26
  zijn als productbesluiten vastgelegd (zie BLUEPRINT.md beslislog).

## 2026-09-22 (start)
- Project gestart. Doel vastgelegd: een eigen Linux — Debian kaal
  strippen, eigen inrichting (3 werkbladen, AI-tools, devstack),
  Calamares-installer, first-boot wizard. "Eerst bewijs, dan verder":
  elke fase eindigt met een bewezen build vóór de volgende fase begint.
