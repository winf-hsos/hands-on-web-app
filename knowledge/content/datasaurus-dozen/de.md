---
type: dataset
code: 7392
title: Datasaurus Dozen
summary: >-
  Ein Dinosaurier aus 142 Punkten und zwölf weitere Bilder, vom Stern bis zur
  Zielscheibe, mit fast denselben Mittelwerten, Standardabweichungen und
  derselben Korrelation: das berühmteste Beispiel dafür, dass Kennzahlen die
  Form der Daten verschweigen.
authors: [Alberto Cairo, Justin Matejka, George Fitzmaurice]
year: 2017
file: datasaurus_dozen.csv
level: 1
duration: 10
topics: [visualising-data, exploring-data]
modules: [ea]
areas: [ds]
r_datasets: { datasaurus_dozen: datasaurus_dozen.csv }
relations:
  see_also: [why-visualise, matejka-same-stats-different-graphs, same-stats-shapes, anscombe-quartet]
status: published
updated: 2026-11-16
---

Den Dinosaurier hat der Informationsdesigner Alberto Cairo 2016 aus 142 Punkten
gezeichnet. Justin Matejka und George Fitzmaurice haben ihn 2017 in ihrem
Aufsatz [[matejka-same-stats-different-graphs]] Punkt für Punkt in zwölf
andere Bilder verschoben, ohne dass sich Mittelwerte, Standardabweichungen
und Korrelation nennenswert änderten. Die Lektion [[why-visualise]] rechnet
die Kennzahlen nach und zeichnet alle 13 Bilder.

Die Datei stammt aus dem R-Paket
[datasauRus](https://cran.r-project.org/package=datasauRus) (MIT-Lizenz), wo
dieselbe Tabelle `datasaurus_dozen` heißt. Wer die CSV-Datei unter diesem
Namen einliest, kann den Code der Lektion unverändert ausführen.

## Die Spalten

Jede Zeile ist ein Punkt in einem der 13 Bilder.

| Spalte | Inhalt |
|---|---|
| `dataset` | das Bild: `dino`, `away`, `h_lines`, `v_lines`, `x_shape`, `star`, `high_lines`, `dots`, `circle`, `bullseye`, `slant_up`, `slant_down` oder `wide_lines` |
| `x`, `y` | die Lage des Punkts, beide zwischen 0 und 100 |

Anders als bei den Formen in [[same-stats-shapes]] stimmen die Kennzahlen
nicht auf zwei, sondern nur auf eine Nachkommastelle überein.

## Nachrechnen und zeichnen

```r
datasaurus_dozen |>
  group_by(dataset) |>
  summarize(
    mean_x = mean(x),
    mean_y = mean(y),
    sd_x = sd(x),
    sd_y = sd(y),
    r = cor(x, y)
  )
```

Auf eine Nachkommastelle gerundet steht in jeder Zeile dasselbe: 54,3 und
47,8 für die Mittelwerte, 16,8 und 26,9 für die Standardabweichungen, und
die Korrelation liegt zwischen −0,06 und −0,07.

```r
datasaurus_dozen |>
  ggplot() +
  aes(x = x, y = y) +
  geom_point(size = 0.8) +
  facet_wrap(vars(dataset))
```
