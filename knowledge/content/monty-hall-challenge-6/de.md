---
type: challenge
code: 7853
title: "Challenge 6: Die Antwort zeigen und einordnen"
summary: >-
  Ihr zeigt die Gewinnquoten der 100 Spiele als Balkendiagramm und ordnet ein, welche Art von Frage eure Auswertung, die Simulation und die Erklärung jeweils beantworten.
objectives:
  intro: "Mit dieser Challenge bringst du mit deinem Team das Projekt zu einer Antwort und kannst danach:"
  goals:
    - "erklären, warum Wechseln in zwei von drei Fällen gewinnt"
    - "mit dplyr eine Tabelle je Gruppe zusammenfassen"
    - "mit ggplot2 aus einer zusammengefassten Tabelle ein Balkendiagramm zeichnen"
    - "Fragen an Daten den sechs Typen analytischer Fragen zuordnen"
level: 1
topics: [questions-and-measurement, visualising-data]
areas: [ds]
modules: [ea]
project: monty-hall
status: draft
updated: 2026-11-02
---

Drei Quellen sagen dasselbe: eure eigenen Runden (mit viel Zufall), die
100 Spiele und die Simulation. Wer wechselt, gewinnt doppelt so oft.

Der Grund steckt in der ersten Wahl. Sie trifft in einem von drei Fällen das
Auto, und genau dann gewinnt, wer bleibt. In den anderen zwei von drei Fällen
liegt das Auto hinter einer der beiden anderen Türen, und weil der Moderator
weiß, wo es steht, öffnet er die andere. Die Tür, zu der man wechseln kann,
ist dann immer die mit dem Auto. Das Wissen des Moderators macht den
Unterschied: Öffnete er zufällig eine Tür und manchmal die mit dem Auto,
wären die beiden übrigen Türen tatsächlich gleich gut.

## Eine Grafik für die Antwort

Zeigt die Gewinnquote je Entscheidung in den 100 Spielen als Balkendiagramm. Mit
dplyr bekommt `monty_hall` die Spalte `won` und wird je Entscheidung
zusammengefasst; ggplot2 zeichnet daraus die Balken, Schicht für Schicht.

```r
monty_hall |>
  mutate(won = (decision == "stay") == (prize_door == contestant_choice))
```

> [!SOLUTION]
> ```r
> monty_hall |>
>   mutate(won = (decision == "stay") == (prize_door == contestant_choice)) |>
>   group_by(decision) |>
>   summarise(win_rate = mean(won)) |>
>   ggplot() +
>   aes(x = decision, y = win_rate) +
>   geom_col()
> ```
>
> `(decision == "stay") == (prize_door == contestant_choice)` ist eine
> kürzere Form der Regel: Gewonnen hat, wessen Entscheidung zur ersten Wahl
> passt, also bleiben bei richtiger und wechseln bei falscher.

## Welche Art von Frage war das?

Ordnet eure Fragen den sechs Typen aus [[analytic-questions]] zu. „Wie oft
gewannen in den 100 Spielen die, die wechselten?“ ist deskriptiv: Sie beschreibt
nur die 100 Spiele. Welche Frage beantwortet die Simulation, und welche die
Erklärung oben, warum Wechseln besser ist?

> [!SOLUTION]
> Die Simulation verallgemeinert über die beobachteten Spiele hinaus: Sie
> sagt, was in sehr vielen Spielen nach diesen Regeln passiert, und ähnelt
> damit einer inferentiellen Frage. Die Erklärung über das Wissen des
> Moderators ist mechanistisch: Sie sagt, wie es zu dem Ergebnis kommt. Bei
> einem Glücksspiel mit festen Regeln lässt sich das ausnahmsweise ganz
> klären; bei echten Daten bleibt es meist bei den ersten Typen.
