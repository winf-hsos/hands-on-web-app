---
type: test
code: 7510
title: "Selbsttest R: Umfrage zu Milch und Schokolade"
summary: >-
  Elf kleine Aufgaben auf der ganzen Umfrage, die du direkt auf der Seite
  prüfst: acht, in denen du selbst Code schreibst, und drei, in denen du
  vorgegebenen Code liest.
level: 1
duration: 45
topics: [exploring-data, programming-with-r, data-pitfalls]
modules: [pmg]
areas: [ds]
r_datasets: { survey: mds12_schoko_milch.csv }
checks:
  - { md5: 06c131cb00477b64637a40eec7781743, review: survey-exercise-describing-variables }
  - { md5: bbb4177ff7c8ede063978a95e0adc8e0, review: survey-exercise-describing-variables }
  - { md5: c21fe90d968765cb18fb24ab87f5eec8, review: survey-exercise-comparing-groups }
  - { md5: 1af7e592fe0c082720b2c64b046ed07b, review: survey-exercise-comparing-groups }
  - { md5: 7fd7d0e482752985c4e708224a35394c, review: survey-exercise-describing-variables }
  - { md5: dd7b4b6a831a9449261166e829087515, review: survey-exercise-describing-variables }
  - { md5: bb20e64c619cd0bb568c68d701637629, review: survey-exercise-describing-variables }
  - { plot: { counts: [425, 728, 769, 889], rows: 4, defaults: [Q002altergru4f, Q002altergru4] }, review: survey-exercise-figures }
  - { md5: 5fc039684d3805e442f4c99fc0d2a649, review: survey-exercise-comparing-groups }
  - { md5: 2bbd990c5281146712e9b88561c2d03d, review: survey-exercise-describing-variables }
  - { md5: 0baa435477adb894f640c2f544a78150, review: survey-exercise-describing-variables }
relations:
  see_also: [milk-chocolate-survey, survey-exercise-first-look]
status: published
updated: 2026-11-11
---

Mit diesem Test findest du heraus, ob du mit R schon so sicher bist, dass du
in der nächsten Sitzung mitkommst. Jede der elf Aufgaben ergibt genau einen
Wert oder eine Abbildung. Mit **Prüfen** unter dem Kasten läuft dein Code im
Hintergrund, und darunter steht, ob das Ergebnis stimmt. Geprüft wird, was die
letzte Zeile deines Codes ergibt, also genau das, was dir **Ausführen**
anzeigt. Stimmt es nicht,
nennt die Seite das Kapitel der [[survey-exercise-first-look|Übung]], in dem
du nacharbeiten kannst; am Ende der Seite siehst du, wie viele Aufgaben du
schon richtig hast.

In den Aufgaben 1 bis 8 schreibst du selbst Code: Jeder Kasten beginnt mit
`survey`, und du schreibst mit einer Pipe dahinter weiter. In den Aufgaben 9
bis 11 liest du vorgegebenen Code. Er läuft ohne Fehler, und trotzdem steckt etwas
darin, das man wissen muss. In jedem Kasten liegt die ganze
[[milk-chocolate-survey|Umfrage]] als `survey` bereit, und das tidyverse ist
geladen.

Der Test hat keine Note, und niemand sieht dein Ergebnis außer dir: Es bleibt
in diesem Browser gespeichert. Die richtigen Antworten stehen nicht im Klartext
in der Seite, sondern nur als Prüfsumme. Dein Kursassistent könnte den Test
lösen, bestehen kannst du ihn nur selbst, aber er hilft dir gern, eine
Funktion oder eine Fehlermeldung zu verstehen.

## Aufgabe 1: Daten laden und zählen

Wie viele Befragte wohnen in einer Großstadt? Die Größe des Wohnorts steht in
`D044stadtf`.

```r check=1
survey
```

> [!HINT]
> `count()` oder `filter()` mit `nrow()`. Welche Werte in `D044stadtf`
> vorkommen, zeigt dir `count(survey, D044stadtf)`.

## Aufgabe 2: Eine Kennzahl berechnen

Wie alt sind die Befragten im Durchschnitt (`Q002alter`)? Eine Nachkommastelle
genügt.

```r check=2
survey
```

> [!HINT]
> `mean()` innerhalb von `summarise()`, oder direkt auf die Spalte.

## Aufgabe 3: Zeilen filtern

Wie viele Befragte sind 60 Jahre oder älter **und** wohnen in einem Dorf?

```r check=3
survey
```

> [!HINT]
> `filter()` mit zwei Bedingungen, getrennt durch ein Komma.

## Aufgabe 4: Gruppieren und zusammenfassen

Berechne das Durchschnittsalter je Größe des Wohnorts (`D044stadtf`).
Befragte ohne Angabe zum Wohnort zählen nicht mit. Wie hoch ist das
niedrigste Durchschnittsalter? Eine Nachkommastelle.

```r check=4
survey
```

> [!HINT]
> `group_by()` und `summarise()`; fehlende Angaben zur Ortsgröße zählen nicht
> mit.

## Aufgabe 5: Eine neue Spalte berechnen

Bei der Frage „Wo kaufen Sie gewöhnlich Ihre Lebensmittel ein?“ konnte jede
Person mehrere Orte nennen, je Ort eine Spalte von `v008ort_1discount` bis
`v008ort_9online` (1 = genannt, 0 = nicht genannt). Berechne mit `mutate()`
für jede Person, wie viele Orte sie genannt hat, in einer neuen Spalte
`n_places`. Wie viele Orte nennen die Befragten im Durchschnitt? Eine
Nachkommastelle.

```r check=5
survey
```

> [!HINT]
> `mutate()` mit den neun Spalten von `v008ort_1discount` bis
> `v008ort_9online`. Mit `rowSums(pick(...))` musst du sie nicht einzeln
> addieren.

## Aufgabe 6: Anteile bei Mehrfachantworten

Wie viel Prozent der Befragten kaufen beim Discounter ein
(`v008ort_1discount`)? Eine Nachkommastelle.

```r check=6
survey
```

> [!HINT]
> Die Basis sind die Befragten, nicht die Nennungen. Und: in Prozent.

## Aufgabe 7: Fehlende Werte und Filterführung

Die Frage, wie oft jemand Milch trinkt (`v007freq3_mi`), hat bei vielen
Befragten keinen Wert, und einen Teil davon hat man gar nicht gefragt. Wie
viele Befragte haben Milch gekauft **und** verzehrt (`v006gekauft_3mi == 3`)
und trotzdem keinen Wert bei `v007freq3_mi`?

```r check=7
survey
```

> [!HINT]
> Wem wurde die Frage `v007freq3_mi` gestellt? Auf der Seite zur
> [[milk-chocolate-survey|Umfrage]] steht, warum fehlend meistens „nicht
> gefragt“ heißt. Fehlende Werte findest du mit `is.na()`.

## Aufgabe 8: Eine Abbildung mit ggplot2

Zeichne ein Balkendiagramm mit der Zahl der Befragten je Altersgruppe
(`Q002altergru4f`), beide Achsen mit einer Beschriftung, die ein Mensch
versteht.

```r check=8
survey
```

> [!HINT]
> `ggplot()` mit `geom_bar()`, und `labs()` für beide Achsen.

## Aufgabe 9: Code lesen, aufbereitete Variablen

Der Code im Kasten berechnet das Durchschnittsalter nach Geschlecht. Das
Ergebnis hat drei Zeilen: Frauen, Männer und `NA` mit 2 Personen. Woher kommt
die dritte Zeile?

- **a)** Zwei Personen haben die Frage nach dem Geschlecht nicht beantwortet.
- **b)** Zwei Personen haben in der Befragung „divers“ angegeben; in der
  aufbereiteten Variable wurden sie auf `NA` gesetzt.
- **c)** R fügt bei `group_by()` immer eine Zeile für fehlende Werte hinzu.
- **d)** Beim Einlesen der Datei sind zwei Zeilen beschädigt worden.

Prüf deine Vermutung mit Code, bevor du antwortest, und schreib dann den
Buchstaben zwischen die Anführungszeichen in der letzten Zeile.

```r check=9
survey |>
  group_by(Q004geschlechtf) |>
  summarise(mean_age = mean(Q002alter), n_respondents = n())

""
```

> [!HINT]
> Vergleich die rohe Spalte `q004geschlecht` mit der aufbereiteten
> `Q004geschlechtf`, etwa mit `count(survey, q004geschlecht, Q004geschlechtf)`.

## Aufgabe 10: Code lesen, stille Fallausschlüsse

Der Code im Kasten berechnet, wie oft die Befragten im Durchschnitt Milch
trinken (4 = meistens täglich bis 1 = seltener). Er läuft ohne Fehler, aber
über wen spricht die Zahl? Auf wie vielen Befragten beruht sie? Unter dem
vorgegebenen Code steht schon `survey` als Anfang deiner Antwort.

```r check=10
survey |>
  summarise(mean_milk_frequency = mean(v007freq3_mi, na.rm = TRUE))

survey
```

> [!HINT]
> Wie viele Werte hat `v007freq3_mi`, die nicht fehlen?

## Aufgabe 11: Code lesen, die Basis eines Anteils

Der Code im Kasten soll zeigen, wie viele Befragte bei welchem Einkaufsort
kaufen. Laut Ergebnis kaufen 26,5 % beim Discounter, in Aufgabe 6 kam aber
etwas anderes heraus. Worauf bezieht sich der Anteil in diesem Code?

- **a)** auf die Befragten
- **b)** auf alle Nennungen zusammen
- **c)** auf die neun Einkaufsorte
- **d)** auf die Haushalte

```r check=11
survey |>
  select(v008ort_1discount:v008ort_9online) |>
  pivot_longer(everything(), names_to = "place", values_to = "is_mentioned") |>
  filter(is_mentioned == 1) |>
  count(place, name = "n_mentions") |>
  mutate(pct_mentions = round(100 * n_mentions / sum(n_mentions), 1))

""
```

> [!HINT]
> Worauf bezieht sich `sum(n_mentions)`, wenn jede Person mehrere Orte nennen
> kann?
