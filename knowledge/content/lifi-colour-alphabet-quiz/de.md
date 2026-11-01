---
title: "Quiz: Euer Farbalphabet ist ein Zahlensystem"
summary: >-
  Zwei Fragen zum LiFi-Projekt: warum ein Alphabet aus Farben ein
  Stellenwertsystem ist und wie viele Farbstellen ein Buchstabe braucht.
objectives:
  intro: "Mit diesem Quiz zum LiFi-Projekt prüfst du, ob du Folgendes kannst:"
  goals:
    - "begründen, warum ein Alphabet aus vier Farben ein Stellenwertsystem zur Basis 4 ist"
    - "erklären, warum die Reihenfolge der Farben zum Codewort gehört und keine Farbe als Null fehlt"
    - "mit kⁿ berechnen, wie viele Farbstellen ein Buchstabe mindestens braucht, damit 26 Buchstaben unterscheidbar sind"
translation_of: en
based_on: 2026-11-01
---

Diese Fragen gehören zum Projekt [[lifi]], in dem ein Team Buchstaben als
Folgen von Farben überträgt. Die allgemeinen Fragen zu Zahlensystemen stehen
in [[number-systems-quiz]].

## Euer Team überträgt Buchstaben als Folgen aus vier Farben, etwa rot-blau-grün. Inwiefern habt ihr damit bereits ein Stellenwertsystem gebaut? {#ns-012}

- [ ] Gar nicht: Ein Stellenwertsystem braucht Ziffern mit Zahlenwerten, und Farben haben keinen Wert.
  > Ziffern müssen nicht wie Zahlen aussehen. Sobald jede Farbe für einen Wert steht und die Position zählt, ist es ein Stellenwertsystem, egal wie die Ziffern aussehen.
- [x] Vier Farben sind vier Ziffern, also die Basis 4: Drei Stellen ergeben 4 hoch 3 gleich 64 Möglichkeiten, und die Position bestimmt den Stellenwert.
  > Genau, euer Farbalphabet ist ein Zahlensystem in Verkleidung: rot-blau-grün und grün-blau-rot sind verschiedene Codewörter, weil die Stelle zählt. Die Formel N = kⁿ für die Zahl der Codewörter ist dieselbe Rechnung wie die Frage, wie viele Zahlen in n Stellen zur Basis k passen.
- [ ] Nur zur Hälfte: Die Position zählt zwar, aber ohne eine Farbe für die Null fehlt dem System seine wichtigste Ziffer.
  > Die Null fehlt nicht, sie hat nur keine Sonderstellung: Welche der vier Farben für 0 steht, ist Vereinbarung, genau wie bei 1, 2 und 3. Vier Farben sind vier vollwertige Ziffern.
- [ ] Nur mit genau zwei Farben wäre es ein Stellenwertsystem, weil Computer intern mit Bits arbeiten.
  > Die Basis 2 ist ein Spezialfall, kein Privileg. Stellenwertsysteme funktionieren mit jeder Basis ab 2, eure vier Farben eingeschlossen.

## Euer Alphabet hat vier Farben. Ihr wollt damit 26 Buchstaben unterscheiden und gebt jedem Buchstaben eine feste Zahl von Farbstellen. Wie viele Stellen braucht ihr mindestens? {#ns-014}

- [ ] Zwei, denn zwei Stellen sind schon 4 mal 4.
  > Zwei Stellen ergeben 4² = 16 Kombinationen, und 16 reichen für 26 Buchstaben nicht. Die Rechnung ist richtig angesetzt, das Ergebnis aber zu klein; es fehlen zehn Zeichen.
- [x] Drei, denn 4³ sind 64 und damit erstmals genug.
  > Genau die Rechnung des Stellenwertsystems, nur andersherum gelesen: Mit k Ziffern und n Stellen sind kⁿ Kombinationen darstellbar. 4² = 16 ist zu wenig, 4³ = 64 reicht, und 38 Kombinationen bleiben ungenutzt. Diese Verschwendung ist der Preis der festen Länge.
- [ ] Fünf, denn 26 Buchstaben brauchen fünf Bit, und jede Farbstelle ist eine Stelle.
  > Fünf Bit stimmen, aber ein Bit ist eine Stelle mit **zwei** Möglichkeiten. Eine Farbstelle mit vier Farben trägt zwei Bit, also braucht ihr nur halb so viele Stellen, aufgerundet drei.
- [ ] Sechsundzwanzig, denn jeder Buchstabe braucht seine eigene Stelle.
  > Das wäre der Fall, wenn jede Stelle nur einen Buchstaben markieren könnte. Der ganze Trick des Stellenwertsystems ist aber, dass Stellen sich **kombinieren**: Jede zusätzliche Stelle vervierfacht die Zahl der Möglichkeiten, statt sie um eins zu erhöhen.
