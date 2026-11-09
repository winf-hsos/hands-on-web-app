---
type: experiment
code: 4716
title: "Experiment 3: 100 Spiele als Tibble"
summary: >-
  Ihr erkundet einen Datensatz mit 100 Spielen als Tibble mit dem Tidyverse, wählt Spalten und Zeilen aus, ergänzt, wer gewonnen hat, und findet heraus, wie oft Bleiben und wie oft Wechseln gewinnt.
objectives:
  intro: "In diesem Experiment erkundest du mit deinem Team eine Tabelle in R und kannst danach:"
  goals:
    - "eine CSV-Datei mit `read_csv()` als Tibble einlesen und mit `glimpse()` Zeilen, Spalten und Spaltentypen bestimmen"
    - "mit `select()`, `pull()`, `slice_head()` und `arrange()` Spalten und Zeilen auswählen und eine Tabelle sortieren"
    - "mit `mutate()` eine berechnete Spalte ergänzen, mit `filter()` nach ihr filtern und mit `count()` und `summarize()` je Gruppe auszählen"
    - "erklären, warum man Anteile statt Anzahlen vergleicht, wenn die Gruppen verschieden groß sind"
level: 1
duration: 60
topics: [programming-with-r, exploring-data]
areas: [ds]
modules: [ea]
project: monty-hall
status: published
updated: 2026-11-03
---

Der Datensatz [[lets-make-a-deal]] enthält 100 Spiele mit genau den Angaben,
die ihr eben als Vektoren hattet, dazu den Vornamen der Person. Die Spiele
sind für diese Übung erzeugt und stammen nicht aus einer Aufzeichnung der
Sendung. Eine Tabelle, deren Spalten Vektoren gleicher Länge sind und deren
Zeilen je ein Spiel beschreiben, heißt im Tidyverse **Tibble**. Ihr arbeitet
mit den Funktionen von dplyr, die eine Tabelle Schritt für Schritt umformen,
verbunden mit der Pipe `|>`.

Am eigenen Rechner lädt man das Tidyverse und liest die Datei mit
`read_csv()`; eure eigenen Spiele aus der vorigen Phase gehen genauso, aus der
CSV-Datei oder mit `readRDS()` aus der RDS-Datei.

```r static
library(tidyverse)
monty_hall <- read_csv("lets_make_a_deal.csv")
my_games <- as_tibble(readRDS("monty_hall_spiele.rds"))
```

In den Kästen dieses Experiments ist dplyr schon geladen und die Tabelle als
`monty_hall` da.

## Erster Blick

Wie viele Zeilen und Spalten hat die Tabelle, und welchen Typ hat jede
Spalte?

```r
monty_hall
```

> [!SOLUTION]
> ```r
> glimpse(monty_hall)
> ```
>
> Schon der Ausdruck der Tabelle sagt es im Kopf: `100 × 5`, also 100 Zeilen
> und fünf Spalten, und unter jedem Spaltennamen ihr Typ. Ein Tibble zeigt
> nur die ersten zehn Zeilen, damit die Ausgabe lesbar bleibt. `glimpse()`
> dreht die Tabelle und zeigt jede Spalte als Zeile mit ihrem Typ und den
> ersten Werten: der Vorname und die Entscheidung als Text (`<chr>`), die
> Türen als Zahlen (`<int>` hier, `<dbl>` nach `read_csv()`).

## Spalten und Zeilen

Probiert jeden Schritt in einem eigenen Lauf:

1. Holt die Spalte `prize_door` einmal mit `select()` und einmal mit
   `pull()`. Was ist der Unterschied?
2. Wählt die Spalten `prize_door` und `decision` zusammen aus.
3. Zeigt die ersten zehn und die letzten zehn Zeilen.
4. Zeigt alle Spalten außer `contestant`.
5. Sortiert die Tabelle nach `prize_door`, aufsteigend und absteigend.

```r
monty_hall |>
  select(prize_door)
```

> [!SOLUTION]
> ```r static
> # 1.: eine Tabelle mit einer Spalte
> monty_hall |>
>   select(prize_door)
>
> # 1.: ein Vektor
> monty_hall |>
>   pull(prize_door)
>
> # 2.
> monty_hall |>
>   select(prize_door, decision)
>
> # 3.
> monty_hall |>
>   slice_head(n = 10)
>
> # 3.
> monty_hall |>
>   slice_tail(n = 10)
>
> # 4.
> monty_hall |>
>   select(-contestant)
>
> # 5.
> monty_hall |>
>   arrange(prize_door)
>
> # 5.
> monty_hall |>
>   arrange(desc(prize_door))
> ```
>
> Jede dieser Funktionen bekommt eine Tabelle und gibt wieder eine Tabelle
> zurück; nur `pull()` holt eine Spalte als Vektor heraus, so wie ihr ihn aus
> der vorigen Phase kennt. Ein Minus vor dem Namen lässt eine Spalte weg.

## Wer hat gewonnen?

1. Ergänzt die Tabelle mit `mutate()` um eine Spalte `won`, nach derselben
   Regel wie in [[monty-hall-experiment-2|Experiment 2]].
2. Legt mit `filter()` eine neue Tabelle an, die nur die gewonnenen Spiele
   enthält. Wie viele davon wurden mit Wechseln gewonnen, wie viele mit
   Bleiben? `count()` zählt die Zeilen je Wert einer Spalte.
3. Wie oft gewinnt in diesen 100 Spielen, wer bleibt, und wie oft, wer
   wechselt? `group_by()` teilt die Tabelle in Gruppen, und `summarize()`
   fasst jede Gruppe zu einer Zeile zusammen.
4. Macht aus `decision` einen Faktor und seht euch seine Stufen an. Wozu ist
   das gut?

```r
monty_hall |>
  mutate(won = FALSE)
```

> [!SOLUTION]
> ```r
> monty_hall <- monty_hall |>
>   mutate(won = (decision == "stay" & prize_door == contestant_choice) |
>     (decision == "switch" & prize_door != contestant_choice))
>
> games_won <- monty_hall |>
>   filter(won)
> games_won |>
>   count(decision)
>
> monty_hall |>
>   group_by(decision) |>
>   summarize(games = n(), rate = mean(won))
> ```
>
> Von den 49 gewonnenen Spielen wurden 30 mit Bleiben und 19 mit Wechseln
> gewonnen. Das sieht nach einem Vorteil fürs Bleiben aus, ist aber eine
> Falle: Geblieben wurde in 74 Spielen, gewechselt nur in 26. Erst die
> Anteile sind vergleichbar, und die zeigen das Gegenteil: Bleiben gewinnt in
> 41 Prozent der Spiele, Wechseln in 73 Prozent.
>
> `mutate(decision = factor(decision))` macht aus der Spalte einen Faktor mit
> den Stufen `stay` und `switch`, und `glimpse()` zeigt danach `<fct>`. Ein
> Faktor kennt alle erlaubten Werte; damit fallen Tippfehler auf, und Tabellen
> und Grafiken zeigen die Kategorien in einer festen Reihenfolge.
