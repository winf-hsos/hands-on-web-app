---
type: challenge
code: 4716
title: "Challenge 3: 100 Spiele erkunden"
summary: >-
  Ihr erkundet einen Datensatz mit 100 Spielen als Data Frame, greift auf Spalten und Zeilen zu und findet heraus, wie oft Bleiben und wie oft Wechseln gewinnt.
objectives:
  intro: "Mit dieser Challenge erkundest du mit deinem Team eine Tabelle in R und kannst danach:"
  goals:
    - "Zeilen, Spalten und Spaltentypen eines Data Frames bestimmen"
    - "mit `$` und eckigen Klammern Spalten und Zeilen auswählen und eine Tabelle sortieren"
    - "eine Tabelle um eine berechnete Spalte ergänzen und nach ihr filtern"
    - "erklären, warum man Anteile statt Anzahlen vergleicht, wenn die Gruppen verschieden groß sind"
level: 1
topics: [programming-with-r, exploring-data]
areas: [ds]
modules: [ea]
project: monty-hall
status: draft
updated: 2026-11-02
---

Der Datensatz [[lets-make-a-deal]] enthält 100 Spiele mit genau den Angaben,
die ihr eben als Vektoren hattet, dazu den Vornamen der Person. In R liegen
sie als **Data Frame** vor: eine Tabelle, deren Spalten Vektoren gleicher
Länge sind und deren Zeilen je ein Spiel beschreiben. Die Spiele sind für
diese Übung erzeugt und stammen nicht aus einer Aufzeichnung der Sendung.

So lädt man die Datei; in den Kästen dieser Challenge ist die Tabelle als
`monty_hall` schon geladen.

```r
monty_hall <- read.csv("lets_make_a_deal.csv")
head(monty_hall)
```

## Erster Blick

Wie viele Zeilen und Spalten hat die Tabelle, und welchen Typ hat jede
Spalte?

```r
monty_hall
```

> [!SOLUTION]
> ```r
> str(monty_hall)
> ```
>
> `str()` zeigt alles auf einmal: 100 Zeilen (`obs.`), fünf Spalten
> (`variables`), drei davon ganze Zahlen (`int`) und zwei Text (`chr`).
> Einzeln liefern `nrow()`, `ncol()` und `class(monty_hall$decision)`
> dasselbe.

## Spalten und Zeilen

Probiert jeden Zugriff in einem eigenen Lauf:

1. Holt die Spalte `prize_door` einmal mit `$` und einmal mit eckigen
   Klammern. Was ist der Unterschied zwischen `monty_hall[, "prize_door"]`
   und `monty_hall["prize_door"]`?
2. Wählt die Spalten `prize_door` und `decision` zusammen aus.
3. Zeigt die ersten zehn und die letzten zehn Zeilen.
4. Zeigt alle Spalten außer der letzten.
5. Sortiert die Tabelle nach `prize_door`, aufsteigend und absteigend.

```r
monty_hall$prize_door
```

> [!SOLUTION]
> ```r static
> monty_hall$prize_door                         # 1.: ein Vektor
> monty_hall[, "prize_door"]                    # 1.: ebenfalls ein Vektor
> monty_hall["prize_door"]                      # 1.: eine Tabelle mit einer Spalte
> monty_hall[, c("prize_door", "decision")]     # 2.
> monty_hall[1:10, ]                            # 3.: oder head(monty_hall, 10)
> monty_hall[91:100, ]                          # 3.: oder tail(monty_hall, 10)
> monty_hall[, -ncol(monty_hall)]               # 4.
> monty_hall[order(monty_hall$prize_door), ]    # 5.
> monty_hall[order(monty_hall$prize_door, decreasing = TRUE), ]
> ```
>
> In `tabelle[zeilen, spalten]` steht vor dem Komma, welche Zeilen, und
> dahinter, welche Spalten gemeint sind; bleibt eine Seite leer, gilt sie
> ganz. Eine einzelne Spalte mit Komma liefert einen Vektor, ohne Komma eine
> Tabelle. Eine negative Zahl lässt die Spalte weg.

## Wer hat gewonnen?

1. Fügt der Tabelle eine Spalte `won` hinzu, nach derselben Regel wie in
   [[monty-hall-challenge-2|Challenge 2]].
2. Legt eine neue Tabelle an, die nur die gewonnenen Spiele enthält. Wie
   viele davon wurden mit Wechseln gewonnen, wie viele mit Bleiben?
3. Wie oft gewinnt in diesen 100 Spielen, wer bleibt, und wie oft, wer wechselt?
4. Macht aus `decision` einen Faktor und seht euch seine Stufen an. Wozu ist
   das gut?

```r
monty_hall$won <- FALSE
head(monty_hall)
```

> [!SOLUTION]
> ```r
> monty_hall$won <- (monty_hall$decision == "stay" & monty_hall$prize_door == monty_hall$contestant_choice) |
>   (monty_hall$decision == "switch" & monty_hall$prize_door != monty_hall$contestant_choice)
>
> games_won <- monty_hall[monty_hall$won, ]
> table(games_won$decision)
> ```
>
> Von den 49 gewonnenen Spielen wurden 30 mit Bleiben und 19 mit Wechseln
> gewonnen. Das sieht nach einem Vorteil fürs Bleiben aus, ist aber eine
> Falle: Geblieben wurde in 74 Spielen, gewechselt nur in 26. Erst die
> Anteile sind vergleichbar, und die zeigen das Gegenteil:
>
> ```r static
> mean(monty_hall$won[monty_hall$decision == "stay"])     # 0.41
> mean(monty_hall$won[monty_hall$decision == "switch"])   # 0.73
> ```
>
> `factor(monty_hall$decision)` hat die Stufen `stay` und `switch`. Ein
> Faktor kennt alle erlaubten Werte; damit fallen Tippfehler auf, und
> Tabellen und Grafiken zeigen die Kategorien in einer festen Reihenfolge.
