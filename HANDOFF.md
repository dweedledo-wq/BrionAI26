# HANDOFF

## Voor de AI die dit oppakt (bv. Mistral) — lees dit eerst, volledig

Dit is een **eerlijke, volledige overdracht** van het project
**BrionAI26**: een eigen Linux-distributie op basis van kaalgestript
Debian (stable), met eigen inrichting en een eigen doel — zie
BLUEPRINT.md voor het volledige productdoel en de architectuur.

1. **Lees eerst BLUEPRINT.md en PROGRESS.md, helemaal, vóór je iets bouwt.**
   PROGRESS.md bevat de actuele status en de eerstvolgende stap.
2. **Daarna mag je zelfstandig (autopilot) doorwerken** binnen wat in
   BLUEPRINT.md is vastgelegd — je hoeft niet voor elke implementatiestap
   terug te vragen. Wél teruggeven aan de mens (Brionize) bij:
   - een echt productbeslispunt waarvoor meerdere geldige richtingen
     bestaan en de keuze het eindproduct wezenlijk bepaalt;
   - iets dat geld kost of een externe, blijvende verplichting aangaat;
   - een actie die naar buiten toe publiceert/verzendt namens Brionize;
   - een destructieve of moeilijk terug te draaien actie;
   - een nieuwe privacy-, security- of rechtengrens.
   Voor gewone implementatiedetails, scripts schrijven, bugs oplossen,
   commits maken: gewoon doorgaan.

## Niet-onderhandelbare regels, ongeacht welke AI dit uitvoert
- **Nooit hardcoded secrets, wachtwoorden, API-keys of persoonlijke
  gegevens in de repository** — ook niet tijdelijk. Alleen `.env.example`
  met lege placeholders; echte waarden komen pas op de doelmachine, via
  de first-boot-wizard.
- **Evidence before done:** claim nooit dat een build werkt, een ISO
  bootable is, of een stap "klaar" is zonder dat daadwerkelijk getest en
  bewezen (bijvoorbeeld: een geslaagde CI-run, een daadwerkelijk gebouwde
  ISO). Eén grondige verificatie is beter dan tien halve.
- **Officiële bron eerst.** Gebruik voor elk onderdeel (Debian Live
  Manual, pakketdocumentatie, Calamares-documentatie) de officiële,
  actuele documentatie — niet uit het geheugen gokken over
  versies/commando's die kunnen zijn veranderd.
- **Documenteer terwijl je werkt.** Werk PROGRESS.md continu bij (wat is
  gedaan, wat werkte niet en waarom, wat is de volgende stap) en houd
  BLUEPRINT.md actueel als architectuurkeuzes concreter worden. Het moet
  voor een volgende sessie opnieuw leesbaar zijn zonder gokken.
- **Reproduceerbaar.** Alle benodigde context staat in deze repo; geen
  externe project-state veronderstellen.

## Eerstvolgende stap
Zie PROGRESS.md. Kern: fase 1 (minimale kaal-basissysteem-ISO) is
geconfigureerd maar **nog niet bewezen** — het bewijs is een geslaagde
CI-run die een ISO-artifact oplevert. Levering hangt momenteel af van
schrijftoegang tot deze repo (zie PROGRESS.md).
