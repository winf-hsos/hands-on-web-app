---
type: term
code: 1748
title: NAND-Gatter
summary: >-
  Ein Gatter, dessen Ausgang nur dann 0 ist, wenn alle Eingänge 1 sind. Aus ihm
  allein lässt sich jede andere Logikschaltung bauen.
objectives:
  intro: "Wenn du das NAND-Gatter kennst, kannst du:"
  goals:
    - "die Wahrheitstabelle des NAND-Gatters angeben"
    - "NOT, AND und OR allein aus NAND-Gattern bauen und damit begründen, warum NAND universell ist"
    - "ein XOR aus vier NAND-Gattern zusammensetzen und mit der Wahrheitstabelle prüfen"
    - "erklären, warum Chips in CMOS-Technik gern aus NAND-Gattern aufgebaut werden"
level: 2
duration: 10
topics: [processing-information]
modules: [dup]
relations:
  part_of: [logic-gates]
status: draft
updated: 2026-11-01
---

## Definition

Ein **NAND-Gatter** („not and“) liefert am Ausgang 0, wenn alle Eingänge 1 sind,
und in jedem anderen Fall 1. Es ist ein AND-Gatter mit umgekehrtem Ausgang.

| A | B | NAND |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

## Ein Gatter, aus dem sich alle anderen bauen lassen

NAND ist **universell**: Jede Logikschaltung, also auch ein ganzer Prozessor,
lässt sich aus NAND-Gattern allein zusammensetzen. Das sieht man, wenn man die
drei Grundgatter daraus baut.

| Gesucht | Aus NAND gebaut | Warum es stimmt |
|---|---|---|
| NOT A | NAND(A, A) | Sind beide Eingänge gleich, ist der Ausgang 0 genau dann, wenn A = 1 ist. |
| A AND B | NOT(NAND(A, B)) | Das zweite NAND kehrt das Ergebnis des ersten wieder um. |
| A OR B | NAND(NOT A, NOT B) | NAND ist 1, sobald einer der Eingänge 0 ist, also sobald A oder B 1 ist. |

Weil sich aus NOT, AND und OR jede andere Schaltung bauen lässt, gilt das
damit auch für NAND allein. Ein XOR braucht zum Beispiel vier NAND-Gatter.
Dasselbe gilt übrigens für NOR, aber nicht für AND oder OR, denn mit ihnen
allein lässt sich kein Bit umkehren.

## Warum das in der Praxis zählt

In der heute üblichen CMOS-Technik ist ein NAND-Gatter mit zwei Eingängen eines
der einfachsten Gatter überhaupt: Es braucht vier Transistoren. Ein AND-Gatter
ist dort ein NAND mit einem Inverter dahinter und braucht sechs. Chips werden
deshalb gern aus vielen gleichen NAND-Bausteinen aufgebaut. Auch der
**NAND-Flash**-Speicher in USB-Sticks und SSDs trägt den Namen, weil seine
Speicherzellen ähnlich in Reihe geschaltet sind wie die Transistoren in einem
NAND-Gatter.

> [!TIP]
> Probier es auf Papier: Zeichne ein XOR nur aus NAND-Gattern. Nenne den
> Ausgang von NAND(A, B) N; dann ist A XOR B = NAND(NAND(A, N), NAND(B, N)).
> Prüf es mit allen vier Zeilen der Wahrheitstabelle.
