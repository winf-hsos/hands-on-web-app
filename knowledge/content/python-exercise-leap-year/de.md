---
type: exercise
code: 1216
title: "Übung: Schaltjahr"
summary: >-
  Eine Funktion prüft mit Rest, and und or, ob ein Jahr ein Schaltjahr ist, und
  ein kleines Hauptprogramm fragt nach dem Jahr und antwortet mit einem Satz.
objectives:
  intro: "In dieser Übung schreibst du eine Funktion, die Schaltjahre erkennt, und kannst danach:"
  goals:
    - "eine Regel mit Ausnahmen in eine einzige Bedingung aus `%`, `and` und `or` übersetzen"
    - "mit runden Klammern festlegen, welche Teile einer Bedingung zusammengehören"
    - "eine Funktion schreiben, die einen Wahrheitswert mit `return` zurückgibt, und ihn mit `if` und `else` in einen Satz verwandeln"
    - "eine Regel mit Beispielen prüfen, die jede Ausnahme abdecken, etwa 2024, 2023, 1900 und 2000"
level: 1
duration: 15
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-conditions, python-if-else]
status: published
updated: 2026-11-01
---

## Aufgabe

Ein Jahr hat 365 Tage, ein Schaltjahr einen mehr, den 29. Februar. Nach
unserem Kalender ist ein Jahr ein Schaltjahr, wenn es durch 4 teilbar ist.
Davon gibt es eine Ausnahme: Ist es auch durch 100 teilbar, ist es kein
Schaltjahr. Und die Ausnahme hat selbst eine Ausnahme: Ist es durch 400
teilbar, ist es doch eines. 2024 ist also ein Schaltjahr, 2023 nicht, 1900
nicht und 2000 wieder schon.

Schreib eine Funktion `is_leap_year(year)`, die `True` zurückgibt, wenn
`year` ein Schaltjahr ist, und sonst `False`. Ein Hauptprogramm `main` fragt
nach einem Jahr und antwortet mit einem Satz.

## So soll es aussehen

Zwei Durchläufe, einmal mit 2024 und einmal mit 1900:

```text
Welches Jahr? 2024
2024 ist ein Schaltjahr.

Welches Jahr? 1900
1900 ist kein Schaltjahr.
```

## Dein Programm

```python
def main():
    year = int(input("Welches Jahr? "))
    # Gib mit Hilfe von is_leap_year einen passenden Satz aus.


def is_leap_year(year):
    # Gib True zurück, wenn year ein Schaltjahr ist, sonst False.
    return False


main()
```

> [!HINT]
> „Durch 4 teilbar“ heißt, dass beim Teilen durch 4 kein Rest bleibt, in
> Python also `year % 4 == 0`. „Nicht durch 100 teilbar“ ist dann
> `year % 100 != 0`. Übersetze zuerst jede der drei Regeln in einen solchen
> Vergleich, bevor du sie verbindest.

> [!HINT]
> In Worten lautet die ganze Regel: durch 4 teilbar, **und** dazu entweder
> nicht durch 100 teilbar **oder** durch 400 teilbar. Weil Python `and` vor
> `or` rechnet, gehört der Teil mit `or` in runde Klammern. Prüfe die Funktion
> danach mit allen vier Beispielen aus der Aufgabe.

> [!SOLUTION]
> ```python
> def main():
>     year = int(input("Welches Jahr? "))
>     if is_leap_year(year):
>         print(f"{year} ist ein Schaltjahr.")
>     else:
>         print(f"{year} ist kein Schaltjahr.")
>
>
> def is_leap_year(year):
>     return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
>
>
> main()
> ```
>
> Die Funktion braucht kein `if`, denn die Bedingung selbst ist schon der
> Wahrheitswert, den sie zurückgeben soll. Bei 1900 ist der erste Teil wahr,
> in der Klammer aber sind beide Seiten falsch, und damit ist das ganze
> Ergebnis `False`. Die Klammern sorgen dafür, dass sich die Bedingung so
> liest wie die Regel in Worten, mit dem `or` als Ausnahme zur Ausnahme.

## Für Schnelle

Schreib eine Funktion `days_in_month(month, year)`, die zurückgibt, wie viele
Tage ein Monat hat, mit `month` als Zahl von 1 bis 12. Der Februar hat 28
Tage, in einem Schaltjahr 29, April, Juni, September und November haben 30,
alle anderen 31. Verwende darin `is_leap_year`, und für die Monate mit 30
Tagen hilft `in` mit einer Liste.
