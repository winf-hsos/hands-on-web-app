---
type: lesson
code: 7482
title: Vergleichen und zählen
summary: >-
  Vergleiche liefern TRUE oder FALSE für jeden Wert. Wie man sie verknüpft,
  mit %in% gegen eine Liste prüft und damit zählt und Anteile berechnet.
level: 1
duration: 10
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-data-types]
status: draft
updated: 2026-10-27
---

## Worum es geht

Wie viele der Befragten sind älter als 50? Welcher Anteil ernährt sich vegan?
Solche Fragen beginnen mit einem Vergleich. In R liefert ein Vergleich für
jeden Wert eines Vektors `TRUE` oder `FALSE`, und mit diesen Wahrheitswerten
lässt sich zählen und auswählen.

## Vergleichen

| Zeichen | Bedeutung |
|---|---|
| `==` | gleich |
| `!=` | ungleich |
| `<`, `<=` | kleiner, kleiner oder gleich |
| `>`, `>=` | größer, größer oder gleich |

Wie das Rechnen gilt auch ein Vergleich für jeden Wert einzeln:

```r
ages <- c(56, 55, 47, 32, 74)
ages > 50
```

Gleichheit prüft man mit **zwei** Gleichheitszeichen. Ein einzelnes `=` ist
eine Zuweisung, wie der Pfeil `<-`. Texte vergleichst du genauso, in
Anführungszeichen: `diet == "vegan"`.

## Bedingungen verknüpfen

`&` heißt „und“, `|` heißt „oder“, und `!` kehrt einen Wahrheitswert um:

```r
ages <- c(56, 55, 47, 32, 74)
ages > 40 & ages < 60
```

So findest du alle zwischen 40 und 60. Mit `|` wären es alle, für die
mindestens eine der beiden Bedingungen gilt, hier also alle.

## Gegen eine Liste prüfen

Soll ein Wert zu einer Auswahl gehören, wird eine Kette aus `|` schnell lang.
`%in%` prüft für jeden Wert, ob er in einem anderen Vektor vorkommt:

```r
diet <- c("vegan", "omnivore", "vegetarian", "omnivore")
diet %in% c("vegan", "vegetarian")
```

## Zählen und Anteile

Rechnest du mit Wahrheitswerten, zählt `TRUE` als 1 und `FALSE` als 0. Damit
ist `sum()` eines Vergleichs die Zahl der Treffer und `mean()` ihr Anteil:

```r
ages <- c(56, 55, 47, 32, 74)
sum(ages > 50)
```

Ersetze im Kasten `sum` durch `mean`: 0,6 heißt, drei von fünf sind älter als
50. Diese beiden Zeilen wirst du beim Auswerten ständig schreiben.

## Zum Mitnehmen

- Vergleiche liefern `TRUE` oder `FALSE` für jeden Wert; gleich ist `==`.
- `&` ist „und“, `|` ist „oder“, `!` kehrt um; `%in%` prüft gegen eine Liste.
- `sum()` eines Vergleichs zählt die Treffer, `mean()` gibt ihren Anteil.
