---
type: lesson
code: 4821
title: Ein Code ist eine Vereinbarung
summary: >-
  Warum dieselben acht Bits ein Buchstabe, eine Zahl oder ein Grauwert sein
  können, und weshalb ein Code ohne seine Tabelle nichts bedeutet.
level: 1
duration: 20
topics: [representing-information]
modules: [dup]
status: draft
updated: 2026-10-21
---

## Worum es geht

Im Rechner gibt es keine Buchstaben, keine Farben und keine Töne, sondern nur
Folgen von Zuständen, die wir als Nullen und Einsen aufschreiben. Dass aus
`01000001` auf deinem Bildschirm ein A wird, liegt nicht an den Bits selbst,
sondern an einer Tabelle, auf die sich irgendwann Menschen geeinigt haben. In
dieser Lektion geht es um genau diese Tabellen: was sie leisten, wie groß sie
sein müssen und was passiert, wenn zwei Seiten nicht dieselbe benutzen.

## Ein Code ordnet zu

Ein **Code** ordnet jedem Zeichen eines Vorrats eine Folge von Symbolen zu. Das
ist schon die ganze Definition. Die Symbole können Bits sein, aber auch kurze
und lange Töne, Farben oder Handzeichen; entscheidend ist nur, dass Sender und
Empfänger dieselbe Zuordnung kennen.

| Zeichen | ASCII (dezimal) | ASCII (binär) |
|---|---|---|
| A | 65 | `01000001` |
| B | 66 | `01000010` |
| a | 97 | `01100001` |

Die bekannteste Tabelle dieser Art ist ASCII aus den 1960er-Jahren. Dort ist
das große A die Nummer 65, und zwar nicht, weil A der 65. Buchstabe wäre,
sondern weil die ersten Plätze der Tabelle für Steuerzeichen reserviert sind.
Das kleine a hat die Nummer 97 und ist für den Rechner ein völlig anderes
Zeichen, das uns nur zufällig ähnlich vorkommt.

> [!NOTE]
> Ein Code ist keine Verschlüsselung. Eine Codetabelle wird absichtlich
> veröffentlicht, damit alle sie benutzen können, während eine Verschlüsselung
> etwas verbergen soll.

## Dieselben Bits, verschiedene Bedeutungen

Nimm das Byte `01000001`. Als Text gelesen ist es ein A, als Zahl gelesen 65,
und in einem Graustufenbild ist es ein ziemlich dunkles Grau, weil 65 von 255
möglichen Helligkeitsstufen eher am dunklen Ende liegt. Keine dieser Lesarten
ist richtiger als die anderen, denn welche gilt, entscheidet allein das
Programm, das die Bits liest, und die Tabelle, die es dafür verwendet.

Daraus folgt eine Regel, die dir beim Programmieren immer wieder begegnen wird:
**Daten tragen ihre Bedeutung nicht in sich.** Eine Datei, die mit dem falschen
Programm geöffnet wird, ist nicht kaputt, sie wird nur nach der falschen
Tabelle gelesen.

## Wie groß muss eine Tabelle sein?

Angenommen, du willst die 26 Buchstaben des Alphabets mit nur vier Symbolen
übertragen, etwa mit vier Farben. Mit einem einzigen Symbol pro Buchstabe
kommst du auf vier Codewörter, mit zwei Symbolen auf 4 · 4 = 16 und mit drei
Symbolen auf 4 · 4 · 4 = 64. Allgemein gilt: Bei *k* verschiedenen Symbolen und
*n* Stellen gibt es *kⁿ* mögliche Codewörter.

Für 26 Buchstaben reichen zwei Stellen also nicht, drei schon. Die 38
Codewörter, die übrig bleiben, sind kein Verlust, sondern ein Vorrat für
Leerzeichen, Ziffern und Satzzeichen, die du später vielleicht doch noch
brauchst.

## Wenn zwei Tabellen nicht übereinstimmen

Der gefährlichste Fehler bei Codes erzeugt keine Fehlermeldung. Haben Sender
und Empfänger zwei Tabellen, die sich nur in einem Eintrag unterscheiden, dann
schlägt der Empfänger jedes ankommende Codewort nach, findet jedes Mal einen
gültigen Buchstaben und setzt daraus ein Wort zusammen, das wie ein Wort
aussieht. Aus *Sonne* wird dann vielleicht *Somme*, und kein Programm merkt es,
weil technisch nichts schiefgegangen ist.

Deshalb gehört zu jedem Code eine einzige, gemeinsam benutzte Tabelle. Wer in
einem Programm die Rückrichtung braucht, also vom Codewort zum Zeichen, sollte
sie aus der ersten Tabelle berechnen, statt sie ein zweites Mal von Hand
aufzuschreiben.

## Zeichen, die nicht in der Tabelle stehen

Jede Tabelle ist endlich, und früher oder später will jemand ein Zeichen
senden, das nicht darin vorkommt, etwa ein Leerzeichen oder ein Ü. ASCII hatte
genau dieses Problem mit allen Sprachen außer Englisch, und die Antwort darauf
war Unicode, eine Tabelle mit Platz für weit über hunderttausend Zeichen.

Für deine eigenen Programme gibt es drei vertretbare Antworten: das Zeichen in
die Tabelle aufnehmen, es vor dem Senden entfernen oder mit einer klaren
Meldung ablehnen. Keine Entscheidung zu treffen ist die einzige Antwort, die
nicht vertretbar ist, denn dann entscheidet der Zufall.

## Zum Mitnehmen

- Ein Code ist eine Zuordnung von Zeichen zu Symbolfolgen, und er funktioniert
  nur, wenn beide Seiten dieselbe Zuordnung benutzen.
- Bei *k* Symbolen und *n* Stellen gibt es *kⁿ* Codewörter.
- Falsche Tabellen erzeugen keine Fehler, sondern falsche Ergebnisse, die
  richtig aussehen.

Wie der Empfänger erkennt, wo ein Codewort endet und das nächste beginnt, zeigt
[[prefix-free-code|der Begriff präfixfreier Code]].
