# BrionAI26 — Voortgangslog

> Evidence before done: elke fase eindigt met een bewezen CI-build vóór de
> volgende fase begint. Status-details en afspraken: zie HANDOFF.md.

## Volgende stappen

1. GRUB-bootmenu met aparte opties "BrionAI26 live starten" en "BrionAI26
   installeren" — gebouwd, bewijs via CI-build nog te leveren.
2. SysDash-PWA (sysdash-brionize, private repo) als Command Center-tegel
   i.p.v. Conky-HUD.
3. Live-test nieuwste ISO.
4. Calamares-installatie → v1.0-tag.

## 2026-09-23 — GRUB-bootmenu (taak 1): ingebouwd, CI-bewijs volgt

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
- Droogrun + lokale simulatie van binary_grub_cfg bewezen: menu correct
  gegenereerd met alle placeholders gevuld; CI-build = het eindbewijs.

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
