---
type: lesson
code: 4602
title: Funktionen aufrufen
summary: >-
  Funktionen sind die Werkzeuge von R: Sie bekommen Argumente, liefern ein
  Ergebnis und lassen sich ineinander schachteln.
objectives:
  intro: "In dieser Lektion lernst du, Funktionen in R aufzurufen, und kannst danach:"
  goals:
    - "eine Funktion wie `sqrt()` mit Argumenten in runden Klammern aufrufen und ihr Ergebnis weiterverwenden"
    - "Argumente über ihren Namen angeben, etwa `digits` bei `round()`, und erklären, was ein Standardwert ist"
    - "geschachtelte Aufrufe wie `round(sqrt(10), digits = 1)` von innen nach außen lesen"
    - "die Hilfeseite einer Funktion mit `?` öffnen und ihre Beispiele nutzen"
    - "die Meldung, dass R eine Funktion nicht findet, auf einen Tippfehler oder ein nicht geladenes Paket zurückführen"
level: 1
duration: 10
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-names]
status: draft
updated: 2026-11-01
---

Fast jeder Arbeitsschritt in R ist der Aufruf einer **Funktion**. Eine Funktion
hat einen Namen, dahinter stehen runde Klammern, und in den Klammern
bekommt sie ihre Werte, die *Argumente*. Zurück gibt sie ein Ergebnis.

```r
sqrt(16)
```

`sqrt()` zieht die Wurzel. Das Ergebnis kannst du anzeigen lassen, mit
einem Namen ablegen oder gleich weiterverwenden, wie jeden anderen Wert.

## Mehrere Argumente

Manche Funktionen brauchen mehr als einen Wert. `round()` rundet eine Zahl
und erfährt aus dem zweiten Argument, auf wie viele Stellen:

```r
round(3.14159, 2)
```

Argumente haben Namen, und du darfst sie hinschreiben. Dann ist die
Reihenfolge egal, und der Code erklärt sich selbst:

```r
round(3.14159, digits = 2)
```

Lässt du ein Argument weg, nimmt die Funktion ihren Standardwert. Bei
`round()` ist das null Nachkommastellen, `round(3.14159)` ergibt also 3.

## Funktionen schachteln

Das Ergebnis einer Funktion kann gleich das Argument der nächsten sein. R
liest solche Aufrufe von innen nach außen:

```r
round(sqrt(10), digits = 1)
```

Erst zieht `sqrt()` die Wurzel aus 10, dann rundet `round()` das Ergebnis
auf eine Stelle. Mehr als zwei, drei Ebenen werden schnell unübersichtlich;
dafür gibt es später die [[r-pipe|Pipe]].

## Hilfe finden

Zu jeder Funktion gibt es eine Hilfeseite mit allen Argumenten und
Beispielen. In R auf deinem eigenen Rechner öffnest du sie mit einem
Fragezeichen vor dem Namen:

```r static
?round
```

Ebenso gut funktioniert eine Suche im Netz nach „r round“. Die Hilfeseiten
sind knapp geschrieben, aber die Beispiele ganz unten lohnen sich fast immer.

## Wenn R eine Funktion nicht kennt

Vertippst du dich im Namen, meldet R, dass es die Funktion nicht findet:

```r
rund(3.14159)
```

Dieselbe Meldung kommt, wenn die Funktion aus einem Paket stammt, das nicht
geladen ist; davon handelt die Lektion [[r-packages]].

## Zum Mitnehmen

- Eine Funktion bekommt Argumente in runden Klammern und gibt ein Ergebnis
  zurück.
- Argumente lassen sich über ihren Namen angeben; fehlende bekommen einen
  Standardwert.
- Geschachtelte Aufrufe liest R von innen nach außen.
