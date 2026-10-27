---
type: exercise
code: 5471
title: "Übung: Was kostet die Milch im Jahr?"
summary: >-
  Ein Haushalt trinkt jede Woche Milch: Du rechnest mit Namen und Funktionen
  aus, was das im Jahr kostet und wie viel ein Wechsel der Marke spart.
level: 1
duration: 15
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-functions]
status: draft
updated: 2026-10-27
---

## Aufgabe

Ein Haushalt kauft jede Woche drei Liter Milch einer Markenmilch für 1,79 Euro
je Liter. Beantworte mit R drei Fragen und gib jedem Zwischenergebnis einen
Namen, statt alles in eine lange Rechnung zu schreiben:

1. Was kostet die Milch in einem Jahr mit 52 Wochen?
2. Wie viel spart der Haushalt im Jahr, wenn er auf eine Handelsmarke für
   1,09 Euro je Liter wechselt? Runde auf ganze Euro.
3. Wie viele volle Wochen könnte er von dieser Ersparnis die Handelsmarke
   kaufen, und wie viele Euro blieben übrig?

## Dein Code

```r
litres_per_week <- 3
price_brand <- 1.79

# 1. Kosten im Jahr
```

> [!HINT]
> Lege zuerst die Kosten im Jahr für beide Marken unter je einem Namen ab.
> Die Ersparnis ist ihr Unterschied, und `round()` rundet sie.

> [!HINT]
> Eine Woche Handelsmarke kostet `litres_per_week * price_store`. Wie oft das
> in die Ersparnis passt, sagt `%/%`, was übrig bleibt, sagt `%%`. Zur
> Kontrolle: Es sind 33 volle Wochen.

> [!SOLUTION]
> ```r
> litres_per_week <- 3
> price_brand <- 1.79
> price_store <- 1.09
>
> cost_brand <- litres_per_week * price_brand * 52
> cost_store <- litres_per_week * price_store * 52
> saving <- round(cost_brand - cost_store)
> week_store <- litres_per_week * price_store
>
> saving %/% week_store
> ```
>
> Die Milch der Marke kostet im Jahr 279,24 Euro, die Handelsmarke 170,04
> Euro, die Ersparnis beträgt gerundet 109 Euro. Davon lassen sich 33 volle
> Wochen Handelsmarke kaufen; `saving %% week_store` zeigt, dass 1,09 Euro
> übrig bleiben.

## Für Schnelle

Wie ändert sich die Ersparnis, wenn der Haushalt nur zwei Liter pro Woche
trinkt? Wenn du gute Namen gewählt hast, musst du dafür nur eine einzige
Zahl ändern.
