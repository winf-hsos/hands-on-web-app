---
type: dataset
code: 7391
title: "Gleiche Zahlen, andere Bilder: die Formen"
summary: >-
  Neun Punktwolken mit je 142 Punkten, von der Wolke über den Stern bis zum
  Herz, alle mit denselben Mittelwerten, Standardabweichungen und derselben
  Korrelation: die Daten des Demonstrators zum Nachrechnen und Zeichnen.
file: same_stats_shapes.csv
level: 1
duration: 10
topics: [visualising-data, exploring-data]
modules: [ea]
areas: [ds]
relations:
  see_also: [why-visualise, same-stats-demo, matejka-same-stats-different-graphs, anscombe-quartet]
r_datasets: { same_stats_shapes: same_stats_shapes.csv }
status: published
updated: 2026-11-16
---

Das sind die Punkte des Demonstrators [[same-stats-demo]] aus der Lektion
[[why-visualise]]. Wir haben sie für diese Plattform nach dem Verfahren von
Justin Matejka und George Fitzmaurice erzeugt
([[matejka-same-stats-different-graphs]]): Eine Punktwolke wird Punkt für
Punkt in Richtung einer Form verschoben, und eine Verschiebung bleibt nur,
wenn sich Mittelwerte, Standardabweichungen und Korrelation auf zwei
Nachkommastellen nicht ändern. Es sind nicht die Daten des „Datasaurus Dozen“
aus dem Aufsatz.

## Die Spalten

Jede Zeile ist ein Punkt in einer Form.

| Spalte | Inhalt |
|---|---|
| `shape` | die Form: `cloud`, `circle`, `bullseye`, `star`, `heart`, `cross`, `h-lines`, `v-lines` oder `slant` |
| `point` | die Nummer des Punkts, 1 bis 142 |
| `x`, `y` | die Lage des Punkts, zwischen 0 und 100 mit zwei Nachkommastellen |

Alle Formen sind aus derselben Wolke entstanden, deshalb gehört Punkt 17 der
Wolke zu Punkt 17 jeder anderen Form. So kann der Demonstrator jeden Punkt
von einem Bild ins nächste wandern lassen.

## Nachrechnen und zeichnen

Die Kennzahlen je Form, so wie in der Lektion für das Quartett von Anscombe:

```r
same_stats_shapes |>
  group_by(shape) |>
  summarize(
    mean_x = mean(x),
    mean_y = mean(y),
    sd_x = sd(x),
    sd_y = sd(y),
    r = cor(x, y)
  )
```

Mittelwerte und Standardabweichungen sind in jeder Zeile gleich, und die
Korrelation liegt überall um −0,06. Auf zwei Nachkommastellen gerundet sind
es 48,26 und 51,83 für die Mittelwerte, 19,64 und 20,37 für die
Standardabweichungen und −0,06 für die Korrelation. Erst das Bild zeigt den
Unterschied:

```r
same_stats_shapes |>
  ggplot() +
  aes(x = x, y = y) +
  geom_point(size = 0.8) +
  facet_wrap(vars(shape))
```
