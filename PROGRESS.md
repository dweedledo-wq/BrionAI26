# BrionAI26 — Voortgangslog

> Evidence before done: elke fase eindigt met een bewezen CI-build vóór de
> volgende fase begint. Status-details en afspraken: zie HANDOFF.md.

## Volgende stappen

1. Live-test nieuwste ISO op de doel-pc (Asus): SysDash-tegel
   (Super+S → hub), tegelwand + hover, splash, first-boot wizard.
   (GRUB-menu + logo + fontfix: bewezen; installatie-flow: bewezen, zie
   hieronder.)
2. v1.0-tag zetten (installatie-flow is volledig VM-bewezen).
3. Na v1.0: repo privé zetten (besluit Brionize; let op: private repo's
   krijgen geen gratis Actions-minuten meer).

## 2026-09-24 — CALAMARES-INSTALLATIE END-TO-END VM-BEWEZEN ✅

- **Volledige flow doorgelopen in QEMU** met Release `iso-20260924-182536`
  (SHA256 98c7b443…b23a2) op een verse 20G virtio-schijf:
  1. GRUB → "BrionAI26 installeren" (hotkey i) → boot met
     `brionai26.install=1`.
  2. Calamares autostart na live-login: venster stond automatisch op
     het scherm, **zonder requirements-fouten** (live-config geeft de
     live-gebruiker NOPASSWD-sudo + pkexec werkt via de wrapper).
  3. Wizard doorklikt: Welcome → Location → Keyboard → Partitions
     ("Erase disk", vda 20 GiB gedetecteerd) → Users (brionize) →
     Summary → Install.
  4. Installatie voltooid: session.log `completion: succeeded`,
     schrijfpartitie vda1 (ext4, 20 GiB) aangemaakt.
  5. **Reboot van de geïnstalleerde schijf** (zonder ISO): branded
     lightdm-login (staalblauw #060B16, hostname brionai26).
  6. **Inloggen met de tijdens de installatie aangemaakte credentials
     gelukt** → BrionAI26 Mission Control-desktop volledig aanwezig
     (Conky-HUD, werkbladen, tegels).
- **Belangrijk voor de doel-pc:** start de installatie altijd via de
  GRUB-entry "BrionAI26 installeren" of het desktop-icoon
  "Installeer BrionAI26" (beide lopen via `calamares-install-debian`:
  fstab-backup + pkexec). Rechtstreeks `calamares` vanuit een terminal
  zonder pkexec faalt bewezen op rechten (geen admin → alle
  requirements rood).
- `libxcb-cursor0` expliciet toegevoegd aan de installer-pakketlijst
  (Qt6 xcb-plugin vereist het; voorkomt een leesbare crash op sommige
  mirrors waar het niet als dependency meekomt).
- **Build-bewijs libxcb-cursor0 + typo-fix:** CI-run 36065037996 op
  `vibe/fui-staalblauw-8404e4` geslaagd — Release `iso-20260924-221326`
  (SHA256 8888e016…a67ad). `bin/apply-desktop` blob-exact geverifieerd
  (91f8456) gelijk aan de VM-bewezen versie.

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

## 2026-09-24 — SYSDASH-TEGEL (taak 2) BEWEZEN ✅

- Sjabloon-repo: `brionize-nl/sysdash` (publiek); de draaiende hub staat
  op de Asus-desktop (private repo `sysdash-brionize` volgens Brionize —
  voor de tegel niet nodig, de hub is bereikbaar via Tailscale).
- **Hub-besluit vastgesteld (Brionize):** de tegel verbindt met de
  **bestaande hub op de Asus** — Super+S opent
  `http://100.96.40.22:9000` (Tailscale-IP van de Asus, poort 9000 uit
  `sysdash-web.service`). Tailscale gekozen omdat het IP stabiel is;
  Cloudflare Quick Tunnel is afgewezen (roterende URL's, onbruikbaar
  voor een vaste hotkey). sysdash draait dus niet mee op de ISO.
- **CI-run 35984530846 geslaagd op main** (merge PR #4) — Release
  `iso-20260924-100944` met de definitieve Tailscale-hotkey. Eerdere
  bewijs-runs: 35981095804 op de branch (Tailscale-versie, commit
  `4818014d`), 35973564731 (localhost-versie) en 35928301094
  (placeholder-versie):
  hotkey **Super+S** opent het sysdash-dashboard als PWA-tegel op het
  Command Center (werkblad 1). Na een kopieerfout in de Super+G-regel
  (commit `fd754540`) is die hersteld en blob-exact geverifieerd.
- Conky-HUD blijft voorlopig naast sysdash staan tot de live-test.
- Voorwaarde: de doel-pc moet lid zijn van de Tailscale (de hub draait op
  de Asus; pc + laptop worden door sysdash gemonitord).

## 2026-09-23 — GRUB-bootmenu (taak 1) BEWEZEN ✅

- **CI-run 35926599028 geslaagd op main** (merge PR #1; eerdere bewijs-run
  35924803553 op de branch) — Release `iso-20260923-221840` (1471 MB):
  - Eigen `config/bootloaders/grub-pc/grub.cfg` (officiële live-build
  override-route): menu-opties "BrionAI26 live starten" (default, hotkey l)
  en "BrionAI26 installeren" (hotkey i) + submenu met fail-safe,
  integriteitscontrole en UEFI-settings.
- "BrionAI26 installeren" zet `brionai26.install=1` op de kernel-cmdline;
  autostart-wrapper `brionai26-install-mode` start dan na de live-login
  `calamares-install-debian` (Debian-wrapper: fstab-backup + pkexec).
- `lb config --bootloaders "grub-pc,grub-efi"`: BIOS-default van
  live-build is syslinux — nu tonen BIOS én UEFI hetzelfde GRUB-menu.
- `sudo` toegevoegd aan de desktop-pakketlijst: zonder sudo geeft
  live-config de live-gebruiker geen NOPASSWD-sudo + polkit-YES, waarmee
  pkexec (Calamares) in de live-sessie zou blokkeren.
- First-boot wizard start niet meer in de live-sessie (check op
  `boot=live` op de kernel-cmdline): alleen op de geïnstalleerde pc.
- Droogrun + lokale simulatie van binary_grub_cfg: menu correct
  gegenereerd met alle placeholders gevuld.

## 2026-09-23 — FASE 5 BEWEZEN: first-boot wizard ✅

- **CI-run 35905142233 geslaagd** (commit `743ab3c`):
  - Wizard (zenity, geverifieerd in trixie) vraagt bij eerste login om
    git-identiteit en optionele AI-sleutels (verborgen invoer, chmod 600,
    ~/.config/brionai26/*.key). Draait eenmalig via marker-bestand.
  - Geplaatst als /usr/bin/brionai26-firstboot + autostart-entry (XFCE).
  - GRUB-menu toont voortaan "BrionAI26" (GRUB_DISTRIBUTOR) + quiet splash.
  - README uitgebreid: download-link, hotkey-kaart, installatie-instructies.
- Droogrun ving twee ontbrekende mkdir's (usr/bin, autostart) vóór de push;
  blob-verificatie bevestigde de push identiek aan de geteste versie.

## 2026-09-23 — LOOK-POLISH 2: gouden vensterdecoratie ✅

- **CI-run 35898371987 geslaagd** (Release `iso-20260923-175953`, 1395 MB):
  eigen xfwm4-thema "BrionAI26" (gouden titeltekst #F0C090 op donker),
  gebouwd door live-hook uit het kleurveranderbare Default-thema.

## 2026-09-23 — FASE 4 BEWEZEN: Calamares installer ✅

- **CI-run 35894259863 geslaagd**: Calamares 3.3.14 + settings-debian,
  "Installeer BrionAI26"-icoon op de live-desktop (pkexec calamares).

## 2026-09-23 — LOOK-POLISH 1: sci-fi HUD ✅

- **CI-run 35896414869 geslaagd**: JetBrains Mono overal, HUD-symbolen
  (◉ SYS/CPU/RAM/DSK/NET/BAT), batterij-tegel.

## 2026-09-23 — FASE 3 BEWEZEN: Dev Studio + VS Code ✅

- **CI-run 35885427596 geslaagd** (1328 MB): VS Code (Microsoft apt-repo),
  Geany, git/gitg/tmux/python/node/npm. Publieke Release-download toegevoegd.

## 2026-09-23 — FASE 2 AF: werkbladen + AI Matrix ✅

- **CI-run 35871715186**: 3 werkbladen, Super+1/2/3, Super+C/G/M/A PWA's.
- **CI-run 35855421072** (738,5 MB): eerste desktop-ISO, na conky-fix
  (conky is virtueel in trixie; conky-all is de provider).

## 2026-09-22 — FASE 1 BEWEZEN ✅

- **CI-run 35791024492** (353 MB): eerste kale basis-ISO.

## 2026-09-22 (start)

- Project gestart. Doel: eigen Linux — Debian kaal strippen, eigen inrichting
  (3 werkbladen, AI-tools, devstack), Calamares-installer, first-boot wizard.
  "Eerst bewijs, dan verder": elke fase eindigt met een bewezen build.
