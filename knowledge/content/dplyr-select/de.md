---
type: lesson
code: 9726
title: Spalten auswählen mit select()
summary: >-
  Mit select() behältst du nur die Spalten, die eine Frage braucht: nach
  Namen, Bereichen, Mustern oder Typen. Nebenbei lernst du rename() und
  relocate() kennen.
level: 1
duration: 20
topics: [transforming-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-in-ten-minutes]
status: draft
updated: 2026-10-27
---

## Worum es geht

Echte Datensätze sind breit. Die Umfrage, aus der `survey` stammt, hat über
800 Spalten, und für eine einzelne Frage braucht man selten mehr als eine
Handvoll davon. `select()` behält die Spalten, die du nennst, und lässt alle
anderen weg; an den Zeilen ändert es nichts.

## Spalten beim Namen nennen

Das erste Argument von `select()` ist die Tabelle, die die Pipe liefert,
danach folgen die Spalten, durch Kommas getrennt und ohne Anführungszeichen:

```r
survey |> select(id, age, diet)
```

Die Reihenfolge, in der du die Spalten nennst, ist auch die Reihenfolge im
Ergebnis. So kannst du eine Tabelle zugleich verkleinern und umsortieren:

```r
survey |> select(diet, age, id)
```

## Bereiche und Ausschlüsse

Ein Doppelpunkt wählt alle Spalten von einer bis zu einer anderen, so wie
sie in der Tabelle nebeneinander stehen:

```r
survey |> select(id:state)
```

Ein Minuszeichen schließt eine Spalte aus, und alle übrigen bleiben:

```r
survey |> select(-state, -town_size, -household_size)
```

Ausschließen ist praktisch, wenn du fast alles behalten willst. Bei sehr
breiten Datensätzen ist es meistens klarer, die gewünschten Spalten
ausdrücklich zu nennen, denn dann sieht man im Code, womit gerechnet wird.

## Spalten nach Mustern

Gut benannte Spalten folgen Mustern, und dplyr bringt kleine Helfer mit, die
solche Muster erkennen:

| Helfer | wählt Spalten, deren Name … |
|---|---|
| `starts_with("milk")` | mit `milk` beginnt |
| `ends_with("size")` | auf `size` endet |
| `contains("price")` | irgendwo `price` enthält |
| `everything()` | alle übrigen Spalten |

```r
survey |> select(id, starts_with("milk"))
```

Ein Helfer kann auch allein stehen, dann bleiben nur die Spalten, die zum
Muster passen:

```r
survey |> select(ends_with("size"))
```

Hier zahlt sich eine Regel aus, die man beim Aufbereiten von Daten oft
unterschätzt: Wer Spalten einheitlich benennt, kann sie später in Gruppen
auswählen, statt jede einzeln aufzuzählen.

## Spalten nach ihrem Typ

`where()` wählt Spalten nach einer Eigenschaft ihres Inhalts. Mit
`is.numeric` bekommst du alle Spalten mit Zahlen, mit `is.character` alle
mit Text:

```r
survey |> select(where(is.numeric))
```

Achte darauf, dass auch `id` eine Zahl ist. R weiß nicht, dass sich mit
dieser Nummer nicht sinnvoll rechnen lässt; das musst du selbst wissen.

## Umbenennen

`rename()` gibt einer Spalte einen neuen Namen und lässt sonst alles, wie es
ist. Der neue Name steht links, der alte rechts, wie bei einer Zuweisung:

```r
survey |>
  rename(brand = milk_brand, too_expensive = price_too_expensive) |>
  names()
```

`names()` zeigt nur die Spaltennamen, und so siehst du die beiden neuen am
Ende, ohne dass die Tabelle sie aus Platzgründen weglässt.

Dasselbe geht auch innerhalb von `select()`, dann aber nur für die
ausgewählten Spalten:

```r
survey |> select(id, brand = milk_brand, too_expensive = price_too_expensive)
```

## Spalten nach vorne holen

Manchmal willst du alle Spalten behalten und nur bestimmte zuerst sehen. Das
erledigt `relocate()`:

```r
survey |> relocate(diet, organic_share)
```

## Zum Mitnehmen

- `select()` behält nur die genannten Spalten, in der genannten Reihenfolge;
  die Zeilen bleiben unverändert.
- `a:b` wählt einen Bereich, `-a` schließt eine Spalte aus.
- `starts_with()`, `ends_with()`, `contains()` und `where()` wählen Spalten
  nach Namen oder Typ und belohnen eine einheitliche Benennung.
- `rename(neu = alt)` benennt um, `relocate()` sortiert Spalten nach vorne.
