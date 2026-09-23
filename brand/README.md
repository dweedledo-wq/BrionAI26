# BrionAI26 — brand-map

Hier komen alle merkbestanden van BrionAI26. Nog niet aanwezig: logo.

## Wat we nodig hebben (van Brionize)
| Bestand | Doel | Eis |
|---|---|---|
| `logo/logo-original.*` | bronbestand | hoogste resolutie die u heeft (PNG/SVG bij voorkeur) |
| `logo/` — afgeleiden | boot, login, installer, bureaublad | worden hieruit gegenereerd (fase 2) |

## Hoe toe te voegen (als u het logo vanaf een pc hebt)
- **Via GitHub-web** (geen git nodig): ga naar
  `github.com/dweedledo-wq/BrionAI26` → map `brand/logo`
  → *Add file* → *Upload files* → sleep het logo erin → Commit.
- Of meegeven aan de AI-sessie (bv. via het Vibe-scherm), dan regelt de AI
  de plaatsing en de afgeleiden.

## Waar het logo voor gebruikt wordt (fase 2/4)
1. **GRUB/boot-splash** — eerste scherm dat u ziet bij opstarten.
2. **Login-scherm** (LightDM-achtergrond met logo).
3. **Calamares-installer** — merk-schermen i.p.v. generiek grijs.
4. **Bureaublad/wallpaper** — subtiel, donker, in de glas-look.
5. **ISO-artwork** — eventueel later ook USB-label/downloads-pagina.

Zodra het bronbestand er ligt, worden de afgeleiden (juiste maten/formaten)
hieruit gegenereerd en in de build opgenomen.

## Nog open
- **Accentkleur** van de lichtende tegelranden: cyan/teal of matrix-groen
  — te kiezen zodra het eerste buildscherm er is (of eerder door Brionize).
