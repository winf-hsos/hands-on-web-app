---
type: lesson
code: 6358
title: Vektoren
summary: >-
  In R ist fast alles ein Vektor, eine Reihe von Werten: wie man sie baut, mit
  ihnen rechnet, einzelne Werte herausholt, sie vergleicht und mit dem
  Ergebnis zählt, am Beispiel des Drei-Türen-Spiels.
objectives:
  intro: "In dieser Lektion lernst du Vektoren kennen, die Form, in der R fast alle Werte speichert, und kannst danach:"
  goals:
    - "mit `c()` einen Vektor bauen und mit `1:10` eine Zahlenfolge erzeugen"
    - "mit einem Vektor rechnen und zwei gleich lange Vektoren Stelle für Stelle verrechnen"
    - "einen Vektor mit `sum()`, `mean()`, `min()`, `max()` und `length()` zu einem einzigen Wert zusammenfassen"
    - "mit eckigen Klammern einzelne Stellen herausholen oder mit einem Minus weglassen, gezählt ab 1"
    - "Vektoren mit `==`, `!=`, `<`, `<=`, `>` und `>=` vergleichen, Bedingungen mit `&`, `|` und `!` verknüpfen und mit `%in%` gegen eine Liste prüfen"
    - "mit `sum()` die Treffer eines Vergleichs zählen, mit `mean()` ihren Anteil berechnen und mit einer Bedingung in eckigen Klammern Stellen auswählen"
level: 1
duration: 20
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-functions]
status: published
updated: 2026-11-03
---

Im Drei-Türen-Spiel steht hinter einer von drei Türen ein Auto, die Person
wählt eine Tür, der Moderator öffnet eine andere mit einer Ziege, und die
Person bleibt bei ihrer Wahl oder wechselt. Wer viele Spiele festhält, hat
für jede Angabe eine Reihe von Werten: die Türen mit dem Auto, die ersten
Wahlen, die Entscheidungen. In R heißt eine solche Reihe **Vektor**, und fast
alles in R ist einer. Auch eine einzelne Zahl ist ein Vektor, nur eben mit
einem Wert; daher die `[1]` vor jeder Ausgabe.

## Vektoren bauen

Mit `c()` (für *combine*) fasst du Werte zu einem Vektor zusammen, hier die
Türen, hinter denen in fünf Spielen das Auto stand:

```r
prize_door <- c(2, 1, 3, 3, 1)
prize_door
```

Für Zahlenfolgen gibt es eine Abkürzung: `1:5` ist der Vektor der Zahlen von
1 bis 5, etwa die Nummern der fünf Spiele.

Fünf Spiele ergeben mehrere Vektoren gleicher Länge, einen je Angabe. Die
erste Stelle gehört in jedem Vektor zum ersten Spiel, die zweite zum zweiten
und so weiter. Nehmen wir an, wir hätten die fünf Personen auch nach ihrem
Alter gefragt:

```r
prize_door <- c(2, 1, 3, 3, 1)
contestant_choice <- c(2, 3, 1, 1, 1)
decision <- c("stay", "switch", "stay", "switch", "switch")
age <- c(56, 55, 47, 32, 74)
```

## Mit Vektoren rechnen

Rechnest du mit einem Vektor, rechnet R mit jedem einzelnen Wert, hier das
Alter der fünf Personen ein Jahr später:

```r
age <- c(56, 55, 47, 32, 74)
age + 1
```

Zwei gleich lange Vektoren verrechnet R Stelle für Stelle, den ersten Wert
mit dem ersten, den zweiten mit dem zweiten. Haben fünf Personen mehrmals
gespielt, ergibt das für jede ihren Anteil gewonnener Spiele:

```r
played <- c(3, 1, 2, 4, 2)
won <- c(2, 0, 1, 3, 1)
won / played
```

Genau das macht R für Daten so bequem: Eine Spalte einer Tabelle ist ein
Vektor, und eine Rechnung gilt gleich für alle Zeilen, ohne Schleife. Mit den
Türnummern rechnet man dagegen nicht, denn sie sind Namen und keine Mengen.

## Funktionen für Vektoren

Viele Funktionen fassen einen Vektor zu einem einzigen Wert zusammen, etwa
`sum()`, `mean()`, `min()`, `max()` und `length()`:

```r
age <- c(56, 55, 47, 32, 74)
mean(age)
```

Probier im Kasten auch die anderen aus, indem du `mean` durch einen anderen
Namen ersetzt. `length(prize_door)` sagt, wie viele Spiele festgehalten sind.

## Einzelne Werte herausholen

Mit eckigen Klammern greifst du auf Stellen eines Vektors zu. Die Zählung
beginnt bei 1, `prize_door[2]` ist also die Tür mit dem Auto im zweiten
Spiel:

```r
prize_door <- c(2, 1, 3, 3, 1)
prize_door[2]
```

In die Klammern passt auch ein Vektor von Stellen, etwa `prize_door[c(1, 3)]`
für das erste und das dritte Spiel, oder `prize_door[2:4]` für die Spiele 2
bis 4. Ein Minus lässt eine Stelle weg: `prize_door[-1]` ist alles außer dem
ersten Spiel.

## Vergleichen

Lag die erste Wahl schon richtig? Solche Fragen beginnen mit einem Vergleich.
Wie das Rechnen gilt auch ein Vergleich für jeden Wert einzeln und liefert
für jede Stelle `TRUE` oder `FALSE`:

| Zeichen | Bedeutung |
|---|---|
| `==` | gleich |
| `!=` | ungleich |
| `<`, `<=` | kleiner, kleiner oder gleich |
| `>`, `>=` | größer, größer oder gleich |

```r
prize_door <- c(2, 1, 3, 3, 1)
contestant_choice <- c(2, 3, 1, 1, 1)
prize_door == contestant_choice
```

Im ersten und im fünften Spiel lag die erste Wahl richtig. Gleichheit prüft
man mit **zwei** Gleichheitszeichen; ein einzelnes `=` ist eine Zuweisung wie
der Pfeil `<-`. Texte vergleichst du genauso, in Anführungszeichen:
`decision == "switch"`. Zahlen lassen sich auch der Größe nach vergleichen,
etwa `age > 50`.

## Bedingungen verknüpfen

`&` heißt „und“, `|` heißt „oder“, und `!` kehrt einen Wahrheitswert um. Wer
geblieben ist und gleich richtig lag, hat mit Bleiben gewonnen:

```r
prize_door <- c(2, 1, 3, 3, 1)
contestant_choice <- c(2, 3, 1, 1, 1)
decision <- c("stay", "switch", "stay", "switch", "switch")
decision == "stay" & prize_door == contestant_choice
```

Nur das erste Spiel erfüllt beide Bedingungen. Mit `|` wären es alle Spiele,
für die mindestens eine der beiden gilt.

## Gegen eine Liste prüfen

Soll ein Wert zu einer Auswahl gehören, wird eine Kette aus `|` schnell lang.
`%in%` prüft für jeden Wert, ob er in einem anderen Vektor vorkommt, etwa ob
eine Person zu denen gehört, die mehrmals gespielt haben:

```r
contestant <- c("Mia", "Jonas", "Lea", "Mia", "Tom")
contestant %in% c("Mia", "Tom")
```

## Zählen und Anteile

Rechnest du mit Wahrheitswerten, zählt `TRUE` als 1 und `FALSE` als 0. Damit
ist `sum()` eines Vergleichs die Zahl der Treffer und `mean()` ihr Anteil:

```r
prize_door <- c(2, 1, 3, 3, 1)
contestant_choice <- c(2, 3, 1, 1, 1)
sum(prize_door == contestant_choice)
```

Ersetze im Kasten `sum` durch `mean`: 0,4 heißt, in zwei von fünf Spielen lag
die erste Wahl richtig. Diese beiden Zeilen wirst du beim Auswerten ständig
schreiben.

## Mit einer Bedingung auswählen

Ein Vergleich passt auch in die eckigen Klammern. Dann holt R nur die Stellen
heraus, an denen er `TRUE` ergibt, hier das Alter derer, die gewechselt
haben:

```r
age <- c(56, 55, 47, 32, 74)
decision <- c("stay", "switch", "stay", "switch", "switch")
age[decision == "switch"]
```

So lassen sich zwei Gruppen vergleichen: `mean(age[decision == "switch"])`
gegen `mean(age[decision == "stay"])`.

## Zum Mitnehmen

- `c()` baut einen Vektor, `1:10` eine Zahlenfolge; die Stellen mehrerer
  Vektoren gehören zusammen, wenn sie dasselbe Spiel beschreiben.
- Rechnungen und Vergleiche gelten für jeden Wert, zwei Vektoren werden
  Stelle für Stelle verrechnet; gleich ist `==`.
- `&` ist „und“, `|` ist „oder“, `!` kehrt um; `%in%` prüft gegen eine Liste.
- `sum()`, `mean()`, `length()` und ihre Verwandten fassen einen Vektor
  zusammen; `sum()` eines Vergleichs zählt die Treffer, `mean()` gibt ihren
  Anteil.
- `[ ]` holt Stellen heraus, gezählt ab 1, oder mit einer Bedingung genau die,
  für die sie gilt.
