---
type: demo
code: 5257
title: Was sollen wir messen?
summary: >-
  Eine leere Tabelle für die gespielten Runden: Leg Variablen als Spalten an,
  gib ihnen einen Datentyp, trag jedes Spiel als Zeile ein und speichere alles
  als CSV- oder RDS-Datei für R.
objectives:
  intro: "Mit diesem Demonstrator legst du selbst fest, wie die Runden des Drei-Türen-Spiels festgehalten werden, und kannst danach:"
  goals:
    - "erklären, dass eine Zeile eine Beobachtung und eine Spalte eine Variable ist"
    - "für eine Frage entscheiden, welche Variablen notiert werden müssen, und ihnen Namen geben, die R ohne Umweg versteht"
    - "jeder Variablen einen passenden Datentyp zuordnen: character, double, integer, logical oder factor"
    - "eine Tabelle als CSV- und als RDS-Datei speichern und beschreiben, warum nur RDS die Datentypen bewahrt"
level: 1
duration: 10
topics: [questions-and-measurement]
modules: [ea]
areas: [ds]
relations:
  see_also: [monty-hall-game, types-of-variables-slides]
status: draft
updated: 2026-11-02
---

**Ziel:** Du entwirfst die Tabelle, in der die gespielten Runden des
Drei-Türen-Spiels festgehalten werden, und entscheidest dabei, welche Fakten
über ein Spiel notiert werden und in welcher Form ihre Werte vorliegen.

**Bedienung:** Die Tabelle beginnt leer. Mit „Spalte hinzufügen“ legst du eine
Variable an, gibst ihr oben einen Namen und wählst darunter auf Wunsch einen
Datentyp, und mit „Zeile hinzufügen“ trägst du ein weiteres Spiel ein. Jede
Zelle lässt sich bearbeiten, wobei Enter zur Zeile darunter springt. Ein Wert,
der nicht zum gewählten Typ passt, bekommt einen gelben Rahmen, bleibt aber
stehen. Zum Schluss speicherst du die Tabelle als CSV oder als RDS, und
darunter steht der R-Code, der die Datei wieder einliest. Die Tabelle bleibt in
diesem Browser gespeichert, bis du „Von vorn“ wählst.

Jede **Zeile** ist eine Beobachtung, hier also ein gespieltes Spiel. Jede
**Spalte** ist eine Variable, also ein Fakt, den wir für jedes Spiel
festhalten, etwa die Tür mit dem Auto oder die Entscheidung zwischen Bleiben
und Wechseln. Alle Werte einer Spalte haben denselben Datentyp, und das Kürzel
im Kopf der Spalte zeigt ihn so, wie R ihn bei einem Tibble anzeigt: `<chr>`
für Text, `<dbl>` für Zahlen mit Komma, `<int>` für ganze Zahlen, `<lgl>` für
`TRUE` und `FALSE` und `<fct>` für Kategorien mit festen Stufen. Ohne gewählten
Typ zeigt das Kürzel in grau, welchen Typ R aus den eingetragenen Werten
erkennen würde.

```data-table
```
