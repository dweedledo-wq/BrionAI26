## FUI Desktop v2 — Ontwerpdocument (custom desktop shell)

**Status: TER GOEDKEURING — er wordt NIET gebouwd vóór jouw GO.**

### Kernafspraak (op verzoek van Brionize)
> We leveren niet eerder af dan wanneer alles werkt zoals op de referentiefoto. Dit document definieert "klaar" als **10 bewijsbare acceptatiecriteria (A1–A10)** — elk criterium vereist hard bewijs (VM-screenshot/video + groene CI-run), geen belofte.

### Wat er in staat
- **Hoofdstuk 0**: de 10 acceptatiecriteria met bewijsvorm per criterium — dit is de definitie van "klaar"
- **Architectuur**: XFCE blijft onderlaag (bewezen, GPU-loos); daarboven onze eigen shell: webview-tegelwand + tile-manager + `fui-data` daemon (alle data ÉCHT uit het eigen systeem, 1 Hz — geen nep-FUI)
- **Werkbladen**: Command Center (12-tegels raster: CPU/RAM/disk/net/Tailscale/PM2/n8n/logs/SysDash), AI Matrix (Claude/ChatGPT/Mistral/Gemini, hover/klik), Dev Studio
- **Hover/klik-state-machine**: IDLE → EXPANDED (200 ms debounce) → PINNED — het productgevoel uit de referentiefoto
- **Look**: staalblauw palet uit jouw foto (al vastgelegd in `mission-control.conf`), glas via picom, goud alleen voor het merk
- **Bouwvolgorde B1–B7**: elke stap eindigt met CI-build + VM-bewijs; B7 = volledige acceptatierun A1–A9 in één frisse boot
- **Risico's**: CPU-budget tegelwand (<15% op oude hardware), focus-timing (<300 ms), Tailscale-fallback

### Belangrijkste beslissing die jouw review nodig heeft
De tegelwand wordt **web-tech (HTML/CSS/JS in webviews)** bovenop XFCE, niet native GTK — dezelfde look als de foto, in dagen i.p.v. weken, en meetbaar lichter voor oude hardware. Conky en devilspie2 vervallen.

### Voor de GO heb ik nodig
1. GO of aanpassingen (liever nu dan na B3)
2. Bevestiging SysDash-hub-URL: `100.96.40.22:9000`
3. Bij A10 (live-test op de Asus): de Asus beschikbaar

Referentiefoto: `brand/reference/WhatsApp Image 2026-09-24 at 14.15.02.jpeg` (branch `fui-doelplaat`).
