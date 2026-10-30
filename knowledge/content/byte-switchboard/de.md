---
title: Byte-Schalttafel
summary: >-
  Acht Schalter, ein Byte: Schalte die Bits um und sieh zu, wie die Zahl als
  Summe von Stellenwerten entsteht, binär, dezimal, hexadezimal und als
  Zeichen.
translation_of: en
based_on: 2026-10-30
---

Jeder Schalter unten ist ein Bit eines Bytes, darüber steht sein Stellenwert.
Klick auf einen Schalter, oder drück ihn und zieh über seine Nachbarn, und sieh
zu, wie sich die Zahl aus den eingeschalteten Schaltern zusammensetzt. Das Byte
beginnt bei 65, dem großen A.

```byte-switchboard
```

## Fragen zum Ausprobieren

- Welcher Schalter ändert die Zahl am meisten, welcher am wenigsten?
- Wie stellst du 255 ein, und wie die 1?
- Zähl mit +1 von 0 bis 16 und achte darauf, welche Schalter bei jedem Schritt
  umspringen. Wo läuft ein Übertrag über mehrere Stellen auf einmal?
- Was passiert, wenn du von 255 aus noch einen Schritt weiterzählst?
- Stell die Schalter auf 01000001 und dann auf 01100001. Was ändert sich am
  Text, und um wie viel ändert sich die Zahl?

## Was du sehen solltest

Die Zahl ist immer die Summe der Stellenwerte der eingeschalteten Schalter,
also die [[place-value-systems|Stellenwert-Bauanleitung]] zur Basis 2. Der
linke Schalter ist 128 wert und damit mehr als alle anderen zusammen (127). Die
Hexadezimalziffern ändern sich je Päckchen aus vier Schaltern, und das Zeichen
ist das Byte, gelesen durch die ASCII-Tabelle, die [[code-as-agreement]]
erklärt. Nach 255 läuft das Byte über: Die neunte Stelle, die es bräuchte, gibt
es nicht, also beginnt es wieder bei 0.
