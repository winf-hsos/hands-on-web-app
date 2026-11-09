---
type: exercise
code: 3967
title: "Übung: Die Preisfrage"
summary: >-
  Ab welchem Preis ist ein Liter Milch zu teuer? Mit select() und filter()
  findest du heraus, wer die Frage beantwortet hat, und räumst eine
  unplausible Angabe aus dem Weg.
objectives:
  intro: "In dieser Übung wendest du `select()` und `filter()` auf die Preisfrage der Umfrage an und kannst danach:"
  goals:
    - "mit `!is.na()` die Zeilen finden, in denen eine Antwort vorliegt, und sie mit `nrow()` zählen"
    - "mehrere Bedingungen in einem `filter()` durch ein Komma verbinden, etwa um einen unplausiblen Ausreißer auszuschließen"
    - "mit `==` und `!=` nach Textwerten wie Marke und Ernährungsweise filtern"
    - "nach dem Filtern mit `select()` nur die Spalten behalten, die du brauchst"
    - "erklären, warum `filter()` Zeilen mit fehlendem Wert schon verwirft, sobald du mit diesem Wert vergleichst"
level: 1
duration: 20
topics: [transforming-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [dplyr-select, dplyr-filter]
status: published
updated: 2026-11-09
---

## Aufgabe

In der Umfrage wurde einem Teil der Befragten eine Milchmarke gezeigt, mal
Weihenstephan, mal alpro, mit der Frage, ab welchem Preis ihnen ein Liter zu
teuer wäre. Die Marke steht in `milk_brand`, die Antwort in
`price_too_expensive`. Alle anderen haben die Frage nie gesehen, bei ihnen
fehlen beide Werte. Beantworte mit `select()` und `filter()` drei Fragen,
jede mit einer eigenen Pipe in ihrer eigenen Box.

## Dein Code

1. Wie viele Personen haben die Preisfrage beantwortet?

```r
survey |>
  filter() |>
  nrow()
```

2. Zeige für diese Personen nur `id`, `age`, `diet`, `milk_brand` und
   `price_too_expensive`, und lass dabei die eine Angabe weg, die als
   Literpreis nicht ernst gemeint sein kann.

```r
survey |>
  filter() |>
  select()
```

3. Wer von ihnen ernährt sich nicht omnivor und hat den Preis für alpro
   genannt?

```r
survey |>
  filter()
```

> [!HINT]
> Eine Person hat die Frage beantwortet, wenn `price_too_expensive` nicht
> fehlt. Wie man nach fehlenden Werten fragt, steht in der Lektion
> [[dplyr-filter]]; das Gegenteil bekommst du mit `!`. Zur Kontrolle: Es
> sind neun Personen.

> [!HINT]
> Für die zweite Frage brauchst du zwei Bedingungen in `filter()`, durch ein
> Komma getrennt, und danach ein `select()`. Eine Grenze von 10 Euro trennt
> ernst gemeinte Literpreise sicher von dem einen Ausreißer; es bleiben
> acht Zeilen.

> [!SOLUTION]
> Frage 1:
>
> ```r
> survey |>
>   filter(!is.na(price_too_expensive)) |>
>   nrow()
> ```
>
> Frage 2:
>
> ```r
> survey |>
>   filter(!is.na(price_too_expensive), price_too_expensive <= 10) |>
>   select(id, age, diet, milk_brand, price_too_expensive)
> ```
>
> Frage 3:
>
> ```r
> survey |>
>   filter(milk_brand == "alpro", diet != "omnivore") |>
>   select(id, age, diet, milk_brand, price_too_expensive)
> ```
>
> In der zweiten Pipe ist die erste Bedingung genau genommen überflüssig,
> denn `filter()` wirft Zeilen mit fehlendem Preis ohnehin hinaus, sobald du
> mit dem Preis vergleichst. Sie schadet aber nicht und macht beim Lesen
> klar, was gemeint ist. Bei der dritten Frage sind es drei Personen, alle
> flexitarisch.

## Für Schnelle

Wer hat die Marke Weihenstephan gesehen und findet einen Liter schon ab
höchstens 2 Euro zu teuer? Sortiere die Spalten so, dass der Preis vorne
steht.
