---
type: lesson
code: 6358
title: Vektoren
summary: >-
  In R ist fast alles ein Vektor, eine Reihe von Werten: wie man sie baut, mit
  ihnen rechnet und einzelne Werte herausholt.
objectives:
  intro: "In dieser Lektion lernst du Vektoren kennen, die Form, in der R fast alle Werte speichert, und kannst danach:"
  goals:
    - "mit `c()` einen Vektor bauen und mit `1:10` eine Zahlenfolge erzeugen"
    - "mit einem Vektor rechnen und zwei gleich lange Vektoren Stelle für Stelle verrechnen"
    - "einen Vektor mit `sum()`, `mean()`, `min()`, `max()` und `length()` zu einem einzigen Wert zusammenfassen"
    - "mit eckigen Klammern einzelne Stellen herausholen oder mit einem Minus weglassen, gezählt ab 1"
level: 1
duration: 10
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-functions]
status: published
updated: 2026-11-01
---

Daten bestehen selten aus einem einzelnen Wert. Das Alter aller Befragten,
die Preise eines Einkaufs, die Antworten auf eine Frage: Das sind Reihen von
Werten. In R heißt eine solche Reihe **Vektor**, und fast alles in R ist
einer. Auch eine einzelne Zahl ist ein Vektor, nur eben mit einem Wert; daher
die `[1]` vor jeder Ausgabe.

## Vektoren bauen

Mit `c()` (für *combine*) fasst du Werte zu einem Vektor zusammen:

```r
ages <- c(56, 55, 47, 32, 74)
ages
```

Für Zahlenfolgen gibt es eine Abkürzung: `1:10` ist der Vektor der Zahlen
von 1 bis 10.

## Mit Vektoren rechnen

Rechnest du mit einem Vektor, rechnet R mit jedem einzelnen Wert:

```r
ages <- c(56, 55, 47, 32, 74)
ages + 1
```

Zwei gleich lange Vektoren verrechnet R Stelle für Stelle, den ersten Wert
mit dem ersten, den zweiten mit dem zweiten:

```r
prices <- c(1.09, 2.49, 0.89)
amounts <- c(3, 1, 2)
prices * amounts
```

Genau das macht R für Daten so bequem: Eine Spalte einer Tabelle ist ein
Vektor, und eine Rechnung gilt gleich für alle Zeilen, ohne Schleife.

## Funktionen für Vektoren

Viele Funktionen fassen einen Vektor zu einem einzigen Wert zusammen, etwa
`sum()`, `mean()`, `min()`, `max()` und `length()`:

```r
ages <- c(56, 55, 47, 32, 74)
mean(ages)
```

Probier im Kasten auch die anderen aus, indem du `mean` durch einen anderen
Namen ersetzt.

## Einzelne Werte herausholen

Mit eckigen Klammern greifst du auf Stellen eines Vektors zu. Die Zählung
beginnt bei 1:

```r
ages <- c(56, 55, 47, 32, 74)
ages[2]
```

In die Klammern passt auch ein Vektor von Stellen, etwa `ages[c(1, 3)]` für
den ersten und den dritten Wert, oder `ages[2:4]` für die Stellen 2 bis 4.
Ein Minus lässt eine Stelle weg: `ages[-1]` ist alles außer dem ersten Wert.

## Zum Mitnehmen

- `c()` baut einen Vektor, `1:10` eine Zahlenfolge.
- Rechnungen gelten für jeden Wert, zwei Vektoren werden Stelle für Stelle
  verrechnet.
- `sum()`, `mean()`, `length()` und ihre Verwandten fassen einen Vektor
  zusammen; `[ ]` holt einzelne Stellen heraus, gezählt ab 1.
