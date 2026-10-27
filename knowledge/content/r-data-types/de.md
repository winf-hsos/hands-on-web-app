---
type: lesson
code: 7019
title: Zahlen, Texte und Wahrheitswerte
summary: >-
  Jeder Vektor hat einen Typ: Zahl, Text oder Wahrheitswert. Woran man ihn
  erkennt, warum ein Vektor nur einen Typ haben kann und wie man umwandelt.
level: 1
duration: 10
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-vectors]
status: draft
updated: 2026-10-27
---

## Worum es geht

R unterscheidet, welche Art von Wert in einem Vektor steht, denn davon hängt
ab, wofür man ihn verwenden kann. Mit Zahlen kann man rechnen, mit Texten nicht.
Für den Anfang genügen drei Typen.

| Typ | Beispiel | Wofür |
|---|---|---|
| `numeric` | `1.09`, `47` | Messwerte, Preise, Anzahlen |
| `character` | `"vegan"` | Text, etwa Kategorien und Namen |
| `logical` | `TRUE`, `FALSE` | Ja oder nein, das Ergebnis eines Vergleichs |

Texte stehen immer in Anführungszeichen. `TRUE` und `FALSE` stehen ohne,
denn sie sind keine Texte, sondern Wahrheitswerte.

## Den Typ erfragen

`class()` verrät, welchen Typ ein Wert hat:

```r
diet <- c("vegan", "omnivore", "vegetarian")
class(diet)
```

Ganze Zahlen, die R selbst erzeugt, etwa mit `1:10`, haben den Typ
`integer`. Für dich verhalten sie sich wie jede andere Zahl.

## Ein Vektor, ein Typ

Ein Vektor kann nur einen Typ haben. Mischst du Zahlen und Texte, macht R
stillschweigend aus allem Text, denn eine Zahl lässt sich immer als Text
schreiben, aber nicht jeder Text als Zahl:

```r
answers <- c(3, 5, "keine Angabe", 2)
answers
```

Die Anführungszeichen in der Ausgabe zeigen es: Aus den Zahlen sind Texte
geworden, mit denen sich nicht mehr rechnen lässt. Genau das passiert oft
beim Einlesen von Daten, wenn in einer Zahlenspalte ein einziges Wort steht.

## Umwandeln

Mit `as.numeric()` machst du aus Texten wieder Zahlen. Was sich nicht als
Zahl lesen lässt, wird zu `NA`, einem fehlenden Wert, und R warnt dich davor:

```r
as.numeric(c("3", "5", "keine Angabe", "2"))
```

Ebenso gibt es `as.character()`. Umgekehrt zählt R `TRUE` als 1 und `FALSE`
als 0, wenn du mit Wahrheitswerten rechnest; das wird beim
[[r-comparisons|Vergleichen]] sehr nützlich.

## Wenn R mit Text rechnen soll

Versuchst du, mit einem Text zu rechnen, bricht R ab und sagt, dass ein
Argument nicht numerisch ist:

```r
"3" + 4
```

Wenn dir diese Meldung begegnet, prüfe mit `class()`, welchen Typ deine
Werte wirklich haben.

## Zum Mitnehmen

- Drei Typen für den Anfang: Zahlen (`numeric`), Texte (`character`) und
  Wahrheitswerte (`logical`); `class()` verrät den Typ.
- Ein Vektor hat nur einen Typ; gemischte Werte werden zu Text.
- `as.numeric()` wandelt um und macht aus Unlesbarem `NA`.
