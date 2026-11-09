---
title: "Quiz: Offene Modelle"
summary: >-
  Sechs Fragen zur Lektion Offene Modelle, jede Antwort mit ihrer Begründung.
  Die Fragen stammen aus dem Pool des Moduls und haben das Format seiner
  Klausur.
translation_of: en
based_on: 2026-11-09
---

## Du schaltest das WLAN ab, und das Modell in LM Studio antwortet trotzdem. Was folgt daraus? {#om-001}

- [x] Das ganze Modell liegt als Datei auf dem Laptop und wird von dessen Prozessor oder Grafikkarte gerechnet.
  > Richtig: Alles, was das Modell kann, steckt in der Datei mit den Parametern; mehr braucht es zum Antworten nicht.
- [ ] LM Studio speichert frühere Antworten aus dem Internet zwischen und spielt sie offline wieder ab.
  > Das Modell erzeugt jede Antwort neu, Token für Token; auch Fragen, die nie zuvor gestellt wurden, beantwortet es offline.
- [ ] Das Modell antwortet aus einer kleinen Textdatenbank, die mit LM Studio installiert wurde.
  > Ein Sprachmodell enthält keine Texte zum Nachschlagen, sondern Zahlen, aus denen es neue Texte erzeugt.
- [ ] Das Modell schickt die Fragen nach, sobald die Verbindung zurück ist, und zeigt bis dahin vorläufige Antworten.
  > Ein lokales Modell schickt nichts weg; die Antwort, die es offline gibt, ist bereits die endgültige.

## Ein Modell hat 8 Milliarden Parameter, jeder mit 4 Bit gespeichert. Wie groß ist die Datei ungefähr? {#om-002}

- [x] 4 GB
  > Richtig: 8 Milliarden mal 4 Bit sind 32 Milliarden Bit, also 4 Milliarden Byte.
- [ ] 8 GB
  > Das wären 8 Bit, also ein Byte je Parameter. Bei 4 Bit braucht jeder Parameter nur ein halbes Byte.
- [ ] 32 GB
  > Hier wurden Bit und Byte verwechselt: 32 Milliarden Bit sind 4 Milliarden Byte, nicht 32.
- [ ] 16 GB
  > Das entspräche 16 Bit je Parameter, der ungerundeten Speicherung; quantisiert mit 4 Bit ist es ein Viertel davon.

## Gemma 3 4B antwortet auf demselben Laptop deutlich langsamer als Gemma 3 1B. Warum? {#om-003}

- [x] Jedes Token durchläuft alle Parameter, und das 4B-Modell hat viermal so viele.
  > Richtig: Mehr Zahlen je Token bedeuten mehr Rechenarbeit je Token und damit weniger Tokens pro Sekunde.
- [ ] Das größere Modell durchsucht für jede Antwort eine größere Textdatenbank.
  > Ein Modell sucht nicht in gespeicherten Texten; es rechnet jedes Token aus seinen Parametern.
- [ ] Das größere Modell schreibt längere Antworten, weil es mehr weiß.
  > Längere Antworten dauern insgesamt länger, ändern aber nicht die Tokens pro Sekunde, und die sind beim größeren Modell niedriger.
- [ ] Das größere Modell prüft jede Antwort im Internet, bevor es sie zeigt.
  > Beide Modelle laufen offline; keines prüft etwas im Internet.

## Welche Aussagen über offene Modelle treffen zu? (Mehrere richtige Antworten möglich.) {#om-004}

- [x] Ihre Gewichte lassen sich herunterladen und auf eigener Hardware betreiben.
  > Richtig: Genau das macht ein Modell offen.
- [ ] Ihre Trainingsdaten werden stets mit den Gewichten veröffentlicht.
  > Offene Gewichte sind nicht Open Source; die Trainingsdaten bleiben meist geheim, nur wenige Modelle wie Olmo legen sie offen.
- [x] Man kann sie anpassen, etwa mit eigenen Daten nachtrainieren.
  > Richtig: Wer die Gewichte hat, kann sie weiter verändern.
- [x] Für sie können Lizenzen gelten, die manche Nutzungen einschränken.
  > Richtig: Offen heißt nicht ohne Bedingungen; manche Lizenzen begrenzen etwa die kommerzielle Nutzung.
- [ ] Man kann sie nicht in einem Agenten einsetzen.
  > Ein Harness kann jedes Modell ansprechen, auch ein lokales offenes.

## In welcher Lage ist ein lokales offenes Modell die sinnvollste Wahl? {#om-005}

- [x] Eine Tierarztpraxis will Behandlungsnotizen zusammenfassen, die die Praxis nicht verlassen dürfen.
  > Richtig: Wenn die Daten das Haus nicht verlassen dürfen, ist ein lokales Modell oft der einzige Weg.
- [ ] Eine Studentin will auf einem langsamen Laptop die bestmögliche Antwort auf eine schwierige Forschungsfrage.
  > Ein Modell, das auf einem langsamen Laptop läuft, ist klein; für die bestmögliche Antwort ist ein großes Modell in der Cloud besser.
- [ ] Ein Start-up will viele verschiedene Modelle schnell ausprobieren, ohne Hardware zu kaufen.
  > Ohne eigene Hardware fehlt die Grundlage für den lokalen Betrieb; Cloud-Dienste sind hier einfacher.
- [ ] Ein Marketingteam braucht aktuelle Preise der Konkurrenz aus dem Netz.
  > Ein lokales Modell weiß nur, was in seinen Parametern steckt; aktuelle Preise braucht eine Websuche.

## Was bedeutet es, ein Modell zu quantisieren? {#om-006}

- [x] Die Parameter mit weniger Bit speichern, wodurch die Datei kleiner wird und etwas Qualität verloren geht.
  > Richtig: Die Zahlen werden gerundet, damit das Modell in den Speicher passt.
- [ ] Selten gebrauchte Wörter aus dem Wortschatz entfernen, damit das Modell schneller wird.
  > Der Wortschatz bleibt gleich; quantisiert werden die Zahlen, nicht die Wörter.
- [ ] Das Modell in Teile zerlegen, die auf mehreren Rechnern laufen.
  > Das wäre eine Verteilung des Modells; die Zahl der Bits je Parameter bliebe dabei gleich.
- [ ] Das Modell ein zweites Mal mit weniger Daten trainieren.
  > Quantisieren verändert ein fertiges Modell, ohne es neu zu trainieren.
