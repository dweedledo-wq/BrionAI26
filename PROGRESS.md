# BrionAI26 — Voortgangslog

> Evidence before done: elke fase eindigt met een bewezen CI-build vóór de
> volgende fase begint. Status-details en afspraken: zie HANDOFF.md.

## Volgende stappen

1. Live-test nieuwste ISO: SysDash-tegel (Super+S → hub op de Asus),
   tegelwand + hover, splash, first-boot wizard na installatie.
   (GRUB-menu + logo + fontfix: bewezen, zie hieronder.)
2. Calamares-installatie → v1.0-tag.
3. Na v1.0-bewijsvoering: repo privé zetten (besluit Brionize; let op:
   private repo's krijgen geen gratis Actions-minuten meer).

## 2026-09-24 — GRUB-THEMA + FONTFIX + MERKLOGO BEWEZEN ✅

- **CI-build:** run 36039837209 op `vibe/fui-staalblauw-8404e4`, alle
  stappen groen; Release `iso-20260924-182536` (SHA256 geverifieerd
  98c7b443…b23a2).
- **VM-bewijs (QEMU, legacy/El Torito):** GRUB-menu rendert in gfxterm met
  1. staalblauwe achtergrond #060B16 (pixelcheck (6,11,22)), 2. merklogo
  (1193 goud-pixels in het logo-gebied), 3. eigen menu-entries ("BrionAI26
  live starten" / "BrionAI26 installeren" / "Geavanceerde opties"), en
  4. **geen** `file not found` font-error meer (de oorzaak van de eerdere
  kale tekstmodus).
- **Drie root causes gevonden en gefixt (alle met ISO-/VM-bewijs):**
  1. `build-iso-docker` mountte `config/` niet → thema-overlay kwam nooit
     in de build-container (ISO-bewijs: template-theme.txt met lege titel).
  2. Onze theme.txt verwees naar `splash.png` zonder `../` → GRUB vond de
     splash niet en viel terug naar tekstmodus (template gebruikt
     `../splash.png`; nu gelijkgetrokken).
  3. ImageMagick ontbrak in de build-container → `convert` (96px-logo voor
     de splash) faalde zodra config/ wél gemount was; nu mee-geïnstalleerd.
- **Transport-les:** de 26KB base64-logo-blob in splash.svg raakte corrupt
  over de push-API (240 afwijkingen). Oplossing: `@BRIONAI26_LOGO_B64@`-
  placeholder; apply-desktop injecteert het logo bij build-tijd uit brand/.
  PR #7 met de volledige serie staat open.

## 2026-09-24 — SYSDASH-TEGEL (taak 2) BEWOZEN ✅
