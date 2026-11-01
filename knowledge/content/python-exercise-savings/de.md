---
type: exercise
code: 6814
title: "Übung: Sparziel"
summary: >-
  Ein Programm rechnet aus, wie viele Jahre ein Sparbetrag mit Zinsen bis zu
  einem Sparziel braucht. Es fragt so lange nach dem Zinssatz, bis er größer
  als 0 ist, damit die Schleife über die Jahre ein Ende findet.
objectives:
  intro: "In dieser Übung rechnest du aus, wann ein Sparziel erreicht ist, und kannst danach:"
  goals:
    - "mit `while True` und `break` so lange nach einer Eingabe fragen, bis sie gültig ist"
    - "begründen, warum eine Eingabe geprüft werden muss, damit eine spätere Schleife nicht endlos läuft"
    - "mit einer `while`-Schleife Jahr für Jahr Zinsen gutschreiben, bis ein Ziel erreicht ist, und dabei die Runden zählen"
    - "Geldbeträge mit `:.2f` im f-String auf zwei Nachkommastellen ausgeben"
level: 1
duration: 20
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-while-loops]
status: draft
updated: 2026-11-01
---

## Aufgabe

Schreib ein Programm, das ausrechnet, wie lange ein Sparbetrag mit Zinsen
braucht, bis er ein Sparziel erreicht. Es fragt nach dem Startbetrag, dem
Zinssatz in Prozent und dem Ziel. Beim Zinssatz fragt es so lange nach, bis
er größer als 0 ist, denn bei 0 Prozent oder weniger wüchse der Betrag nie,
und die Schleife über die Jahre liefe endlos. Dann gibt es für jedes Jahr den
Betrag am Jahresende aus, bis das Ziel erreicht ist, und zum Schluss, nach
wie vielen Jahren das der Fall war.

## So soll es aussehen

```text
Startbetrag in Euro? 1000
Zinssatz in Prozent? 0
Der Zinssatz muss größer als 0 sein, sonst wächst der Betrag nie.
Zinssatz in Prozent? 4
Sparziel in Euro? 1500
Jahr 1: 1040.00 Euro
Jahr 2: 1081.60 Euro
Jahr 3: 1124.86 Euro
Jahr 4: 1169.86 Euro
Jahr 5: 1216.65 Euro
Jahr 6: 1265.32 Euro
Jahr 7: 1315.93 Euro
Jahr 8: 1368.57 Euro
Jahr 9: 1423.31 Euro
Jahr 10: 1480.24 Euro
Jahr 11: 1539.45 Euro
Nach 11 Jahren ist das Ziel von 1500.00 Euro erreicht.
```

## Dein Programm

```python
def main():
    amount = float(input("Startbetrag in Euro? "))
    rate = ask_rate()
    goal = float(input("Sparziel in Euro? "))
    years = 0

    # Schreib Jahr für Jahr die Zinsen gut, bis das Ziel erreicht ist,
    # und gib dabei den Betrag am Ende jedes Jahres aus.

    print(f"Nach {years} Jahren ist das Ziel von {goal:.2f} Euro erreicht.")


def ask_rate():
    # Frag so lange nach, bis der Zinssatz größer als 0 ist.
    rate = float(input("Zinssatz in Prozent? "))
    return rate


main()
```

> [!HINT]
> In `ask_rate` gehört die Frage in eine Schleife `while True`. Gleich
> darunter prüft ein `if`, ob der Zinssatz größer als 0 ist, und verlässt die
> Schleife in diesem Fall mit `break`; sonst gibt das Programm den Hinweis
> aus, und die Schleife fragt von vorn. Nach der Schleife gibt `return` den
> Zinssatz zurück.

> [!HINT]
> Die Jahre zählt eine `while`-Schleife mit der Bedingung `amount < goal`. Im
> Rumpf kommen die Zinsen dazu, `amount += amount * rate / 100`, dann zählt
> `years` um eins hoch, und die Ausgabe zeigt Jahr und Betrag mit `:.2f`.

> [!SOLUTION]
> ```python
> def main():
>     amount = float(input("Startbetrag in Euro? "))
>     rate = ask_rate()
>     goal = float(input("Sparziel in Euro? "))
>     years = 0
>
>     while amount < goal:
>         amount += amount * rate / 100
>         years += 1
>         print(f"Jahr {years}: {amount:.2f} Euro")
>
>     print(f"Nach {years} Jahren ist das Ziel von {goal:.2f} Euro erreicht.")
>
>
> def ask_rate():
>     while True:
>         rate = float(input("Zinssatz in Prozent? "))
>         if rate > 0:
>             break
>         print("Der Zinssatz muss größer als 0 sein, sonst wächst der Betrag nie.")
>     return rate
>
>
> main()
> ```
>
> Das Programm hat zwei Schleifen, und die erste sorgt dafür, dass die zweite
> ein Ende findet: Nur bei einem Zinssatz über 0 wächst `amount` in jeder
> Runde und erreicht das Ziel irgendwann. Wie viele Jahre das dauert, weiß
> vorher niemand, deshalb ist die zweite eine `while`-Schleife, in der
> `years` mitzählt.

## Für Schnelle

Erweitere das Programm um eine feste Einzahlung am Ende jedes Jahres, nach
der es am Anfang fragt, etwa 100 Euro. Überlege dann, ob der Zinssatz mit
Einzahlung noch größer als 0 sein muss und in welchem Fall trotzdem eine
Endlosschleife droht.
