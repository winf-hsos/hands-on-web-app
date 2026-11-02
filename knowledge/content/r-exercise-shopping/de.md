---
type: exercise
code: 8563
title: "Übung: Der Wocheneinkauf"
summary: >-
  Ein Kassenbon als Vektoren: Du rechnest die Summe aus, zählst teure
  Artikel und gehst mit einem Preis um, der auf dem Bon fehlt.
objectives:
  intro: "In dieser Übung wertest du einen Kassenbon mit Vektoren aus, auf dem ein Preis fehlt, und kannst danach:"
  goals:
    - "Preise und Mengen als Vektoren Stelle für Stelle multiplizieren und mit `sum()` aufsummieren"
    - "einen fehlenden Preis mit `na.rm = TRUE` ausdrücklich aus Summe und Zählung herausnehmen"
    - "mit `sum()` über einen Vergleich zählen, wie viele Artikel mehr als einen bestimmten Preis kosten"
    - "mit `%in%` und eckigen Klammern Artikel auswählen und ihren Anteil am bekannten Gesamtbetrag berechnen"
    - "beurteilen, welche Antworten sich ändern, sobald der fehlende Preis bekannt ist"
level: 1
duration: 20
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-missing-values]
status: published
updated: 2026-11-01
---

## Aufgabe

Auf einem Kassenbon stehen sechs Artikel. Für jeden kennst du den Preis je
Stück und die Menge, nur beim Käse ist der Preis unleserlich:

| Artikel | Preis je Stück | Menge |
|---|---|---|
| Milch | 1,09 | 3 |
| Haferdrink | 1,79 | 2 |
| Brot | 2,49 | 1 |
| Käse | unleserlich | 1 |
| Äpfel | 0,45 | 6 |
| Schokolade | 1,29 | 2 |

Beantworte mit R drei Fragen, jede in einem eigenen Kasten:

1. Was kostet der Einkauf ohne den Käse?
2. Wie viele Artikel kosten je Stück mehr als 1,50 Euro?
3. Welchen Anteil am bekannten Gesamtbetrag machen Milch und Haferdrink
   zusammen aus?

## Dein Code

```r
items <- c("Milch", "Haferdrink", "Brot", "Käse", "Äpfel", "Schokolade")
prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
amounts <- c(3, 2, 1, 1, 6, 2)

# 1. Summe ohne den Käse
```

```r
items <- c("Milch", "Haferdrink", "Brot", "Käse", "Äpfel", "Schokolade")
prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
amounts <- c(3, 2, 1, 1, 6, 2)

# 2. Artikel über 1,50 Euro
```

```r
items <- c("Milch", "Haferdrink", "Brot", "Käse", "Äpfel", "Schokolade")
prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
amounts <- c(3, 2, 1, 1, 6, 2)

# 3. Anteil von Milch und Haferdrink
```

> [!HINT]
> `prices * amounts` gibt den Betrag je Zeile des Bons. Beim Käse steht dort
> `NA`, deshalb braucht `sum()` ein bestimmtes Argument. Zur Kontrolle: Der
> bekannte Betrag ist 14,62 Euro.

> [!HINT]
> Für die zweite Frage zählst du einen Vergleich mit `sum()`. Der fehlende
> Preis des Käses ist auch hier im Weg. Für die dritte wählst du mit `%in%`
> die beiden Getränke aus und teilst ihren Betrag durch den bekannten
> Gesamtbetrag.

> [!SOLUTION]
> ```r
> items <- c("Milch", "Haferdrink", "Brot", "Käse", "Äpfel", "Schokolade")
> prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
> amounts <- c(3, 2, 1, 1, 6, 2)
>
> sum(prices * amounts, na.rm = TRUE)
> ```
>
> ```r
> prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
>
> sum(prices > 1.50, na.rm = TRUE)
> ```
>
> ```r
> items <- c("Milch", "Haferdrink", "Brot", "Käse", "Äpfel", "Schokolade")
> prices <- c(1.09, 1.79, 2.49, NA, 0.45, 1.29)
> amounts <- c(3, 2, 1, 1, 6, 2)
>
> totals <- prices * amounts
> drinks <- items %in% c("Milch", "Haferdrink")
> sum(totals[drinks]) / sum(totals, na.rm = TRUE)
> ```
>
> Der Einkauf kostet ohne den Käse 14,62 Euro. Zwei Artikel kosten mehr als
> 1,50 Euro, der Haferdrink und das Brot; ob der Käse dazugehört, weiß
> niemand. Milch und Haferdrink machen knapp 47 Prozent des bekannten Betrags
> aus. In der letzten Zeile braucht nur der Nenner `na.rm`, denn unter den
> beiden Getränken fehlt kein Preis.

## Für Schnelle

Der Käse hat 3,99 Euro gekostet. Setze den Preis ein: Welche deiner
Antworten ändern sich, und welche Zeilen deines Codes musst du dafür
anfassen?
