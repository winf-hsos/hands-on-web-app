---
type: lesson
code: 2910
title: Logikgatter
summary: >-
  Die kleinsten Bausteine, aus denen ein Computer rechnet: Schaltungen, die aus
  einem oder zwei Bits nach einer festen Regel ein neues Bit machen.
level: 1
duration: 15
topics: [processing-information]
modules: [dup]
status: draft
updated: 2026-10-22
---

## Worum es geht

Ein Computer rechnet nicht mit Zahlen, sondern mit Bits, und jede Rechnung
lässt sich in sehr kleine Schritte zerlegen, die jeweils aus ein oder zwei Bits
ein neues Bit machen. Die Schaltungen, die diese Schritte ausführen, heißen
**Logikgatter**. Ein Gatter hat einen oder mehrere Eingänge und einen Ausgang,
und welches Bit am Ausgang erscheint, hängt allein davon ab, welche Bits an den
Eingängen anliegen.

## Die wichtigsten Gatter

| Gatter | Ausgang ist 1, wenn … |
|---|---|
| NOT | der Eingang 0 ist |
| AND | beide Eingänge 1 sind |
| OR | mindestens ein Eingang 1 ist |
| XOR | genau ein Eingang 1 ist |
| NAND | nicht beide Eingänge 1 sind |
| NOR | kein Eingang 1 ist |

NOT hat nur einen Eingang und kehrt ihn um. Die anderen haben zwei Eingänge,
und NAND und NOR sind einfach AND und OR mit einem NOT dahinter, worauf auch
das N im Namen hinweist.

## Alles auf einen Blick: die Wahrheitstabelle

Weil zwei Eingänge nur vier Kombinationen haben, lässt sich jedes Gatter
vollständig in einer Tabelle beschreiben. Sie heißt **Wahrheitstabelle**, und
hier stehen alle Gatter mit zwei Eingängen nebeneinander:

| A | B | AND | OR | XOR | NAND | NOR |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |

Es lohnt sich, die Tabelle spaltenweise zu lesen: NAND ist Zeile für Zeile das
Gegenteil von AND, NOR das Gegenteil von OR.

## Woraus Gatter bestehen

Ein Gatter ist zunächst nur eine Regel, und gebaut werden kann es aus allem,
was zwei Zustände hat. Die ersten Rechenmaschinen benutzten Relais, also
Schalter, die von einem Elektromagneten bewegt werden, später Röhren und heute
Transistoren, von denen ein moderner Prozessor viele Milliarden enthält. Die
Regel bleibt dabei dieselbe, nur die Bauteile werden kleiner und schneller.

## Aus Gattern wird Rechnen

Zwei Bits zu addieren, braucht nur zwei Gatter. Die Summenstelle ist genau dann
1, wenn genau eines der beiden Bits 1 ist, und das ist XOR. Der Übertrag in die
nächste Stelle ist genau dann 1, wenn beide Bits 1 sind, und das ist AND. Diese
Schaltung heißt **Halbaddierer**, und aus mehreren davon lassen sich Zahlen
beliebiger Länge addieren.

| A | B | Summe (XOR) | Übertrag (AND) |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

Die letzte Zeile ist 1 + 1 = 10 im Binärsystem: Summe 0, Übertrag 1.

## Ein Gatter für alles

Man braucht nicht alle sechs Gatter, um einen Computer zu bauen. Aus NAND allein
lassen sich alle anderen zusammensetzen, und warum das so ist und was daraus
folgt, zeigt [[nand-gate|die Karte zum NAND-Gatter]].
