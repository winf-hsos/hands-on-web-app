---
type: exercise
code: 2352
title: "Übung: Pizzarechner"
summary: >-
  Eine Gruppe bestellt Pizza: Das Programm rechnet aus, wie viele Pizzen es
  braucht und was jede Person bezahlt, Trinkgeld eingerechnet.
objectives:
  intro: "In dieser Übung schreibst du einen Pizzarechner für eine Gruppe und kannst danach:"
  goals:
    - "eine Eingabe mit `int()` in eine Zahl umwandeln und damit weiterrechnen"
    - "eine ganzzahlige Division so aufrunden, dass jede angebrochene Pizza mitzählt, etwa mit `(slices + SLICES_PER_PIZZA - 1) // SLICES_PER_PIZZA`"
    - "einen prozentualen Aufschlag wie das Trinkgeld mit `1 + TIP` einrechnen und einen Betrag auf mehrere Personen aufteilen"
    - "feste Werte als Konstanten in Großbuchstaben an den Anfang des Programms stellen"
    - "Geldbeträge mit `:.2f` im f-String auf zwei Nachkommastellen ausgeben"
level: 1
duration: 20
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-arithmetic, python-working-with-text]
status: draft
updated: 2026-11-01
---

## Aufgabe

Ihr bestellt als Gruppe Pizza. Jede Person isst drei Stücke, eine Pizza hat
acht Stücke und kostet 11,50 Euro, und auf den Gesamtpreis kommen 10 Prozent
Trinkgeld. Schreib ein Programm, das nach der Zahl der Personen fragt und dann
ausgibt, wie viele Pizzen ihr bestellen müsst, was alles zusammen kostet und
welchen Betrag jede Person beiträgt.

Es dürfen Stücke übrig bleiben, aber niemand soll zu kurz kommen: Bei sieben
Personen braucht ihr 21 Stücke, und dafür reichen zwei Pizzen nicht, es
müssen drei sein.

## So soll es aussehen

```text
Wie viele Personen? 7
Ihr braucht 3 Pizzen.
Zusammen mit Trinkgeld: 37.95 Euro
Pro Person: 5.42 Euro
```

## Dein Programm

```python
SLICES_PER_PERSON = 3
SLICES_PER_PIZZA = 8
PRICE_PER_PIZZA = 11.50
TIP = 0.10

people = int(input("Wie viele Personen? "))

# Wie viele Stücke werden gebraucht, und wie viele Pizzen sind das?

# Was kostet alles, und was zahlt jede Person?
```

Die Namen in Großbuchstaben oben sind Werte, die sich im Programm nicht
ändern; so schreibt man in Python üblicherweise **Konstanten**. Wenn die
Pizzeria die Preise erhöht, änderst du nur diese eine Zeile.

> [!HINT]
> `slices // SLICES_PER_PIZZA` zählt nur die vollen Pizzen und rundet damit ab.
> Prüfe mit `%`, ob Stücke übrig bleiben, die noch eine angebrochene Pizza
> brauchen, oder rechne mit `(slices + SLICES_PER_PIZZA - 1) // SLICES_PER_PIZZA`,
> was immer aufrundet.

> [!HINT]
> 10 Prozent Trinkgeld heißt: Der Preis wird mit `1 + TIP` malgenommen. Für
> die Ausgabe mit zwei Nachkommastellen sorgt `:.2f` im f-String.

> [!SOLUTION]
> ```python
> SLICES_PER_PERSON = 3
> SLICES_PER_PIZZA = 8
> PRICE_PER_PIZZA = 11.50
> TIP = 0.10
>
> people = int(input("Wie viele Personen? "))
>
> slices = people * SLICES_PER_PERSON
> pizzas = (slices + SLICES_PER_PIZZA - 1) // SLICES_PER_PIZZA
> total = pizzas * PRICE_PER_PIZZA * (1 + TIP)
> share = total / people
>
> print(f"Ihr braucht {pizzas} Pizzen.")
> print(f"Zusammen mit Trinkgeld: {total:.2f} Euro")
> print(f"Pro Person: {share:.2f} Euro")
> ```
>
> Der Trick in der Zeile mit `pizzas`: Wer vor dem ganzzahligen Teilen sieben
> Stücke dazuzählt, rundet damit auf, denn jede angebrochene Pizza schiebt das
> Ergebnis über die nächste ganze Zahl. Bei 21 Stücken ergibt das
> `28 // 8 = 3`, bei genau 24 Stücken `31 // 8 = 3`.

## Für Schnelle

Frag zusätzlich, wie viele Stücke pro Person es sein sollen, und gib aus, wie
viele Stücke am Ende übrig bleiben.
