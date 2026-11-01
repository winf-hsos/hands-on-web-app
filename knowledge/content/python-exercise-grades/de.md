---
type: exercise
code: 8592
title: "Übung: Notenspiegel"
summary: >-
  Die Punkte einer Klausur stehen in einer Liste. Eine eigene Funktion macht
  aus Punkten eine Note, und eine Schleife gibt jede Klausur aus, zählt die
  bestandenen und berechnet den Durchschnitt.
objectives:
  intro: "In dieser Übung erstellst du den Notenspiegel einer Klausur und kannst danach:"
  goals:
    - "eine Funktion schreiben, die mit `if`, `elif` und `else` aus Punkten eine Note berechnet und mit `return` zurückgibt"
    - "mit `for` und `enumerate()` jede Klausur nummeriert mit Punkten und Note ausgeben"
    - "in derselben Schleife mit einer Sammelvariablen zählen, wie viele Klausuren bestanden sind"
    - "den Durchschnitt mit `sum()` und `len()` berechnen und mit `:.1f` auf eine Nachkommastelle ausgeben"
level: 1
duration: 20
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-for-loops, python-if-else]
status: draft
updated: 2026-11-01
---

## Aufgabe

Zehn Klausuren sind korrigiert, und ihre Punkte von 0 bis 100 stehen schon
im Programm. Schreib zuerst eine Funktion `grade(points)`, die zu den Punkten
die Note zurückgibt: ab 90 Punkten eine 1, ab 75 eine 2, ab 60 eine 3, ab 50
eine 4 und darunter eine 5. Das Hauptprogramm `main` gibt dann jede Klausur
mit ihrer Nummer, ihren Punkten und ihrer Note aus. Zum Schluss schreibt es,
wie viele Klausuren bestanden sind, also eine 4 oder besser haben, und wie
viele Punkte es im Durchschnitt waren, mit einer Nachkommastelle.

## So soll es aussehen

```text
Klausur 1: 95 Punkte, Note 1
Klausur 2: 72 Punkte, Note 3
Klausur 3: 48 Punkte, Note 5
Klausur 4: 88 Punkte, Note 2
Klausur 5: 61 Punkte, Note 3
Klausur 6: 50 Punkte, Note 4
Klausur 7: 30 Punkte, Note 5
Klausur 8: 79 Punkte, Note 2
Klausur 9: 90 Punkte, Note 1
Klausur 10: 66 Punkte, Note 3
8 von 10 bestanden
Durchschnitt: 67.9 Punkte
```

## Dein Programm

```python
def main():
    exams = [95, 72, 48, 88, 61, 50, 30, 79, 90, 66]
    passed = 0

    # Gib jede Klausur mit Nummer, Punkten und Note aus
    # und zähle dabei, wie viele bestanden sind.

    # Gib die Zahl der Bestandenen und den Durchschnitt aus.


def grade(points):
    # Gib zu den Punkten die Note 1 bis 5 zurück.
    return 5


main()
```

Weil `grade` ihr Ergebnis zurückgibt, kannst du sie einzeln prüfen, bevor du
die Schleife schreibst. Ersetze dazu die letzte Zeile vorübergehend durch
`print(grade(90), grade(89), grade(50), grade(49))`; herauskommen soll
`1 2 4 5`.

> [!HINT]
> In `grade` kommt es auf die Reihenfolge an: Prüfe zuerst `points >= 90`,
> dann mit `elif` die Bedingung `points >= 75` und so weiter nach unten, und
> was übrig bleibt, landet im `else`. Python nimmt den ersten Zweig, dessen
> Bedingung gilt, und so bekommen 95 Punkte nur die 1, obwohl 95 auch größer
> als 75 ist.

> [!HINT]
> `for number, points in enumerate(exams, start=1):` liefert in jeder Runde
> die Nummer und die Punkte einer Klausur. Ruf im Rumpf `grade(points)` auf,
> merk dir die Note in einer Variablen und zähl `passed` um eins hoch, wenn
> die Note 4 oder kleiner ist.

> [!SOLUTION]
> ```python
> def main():
>     exams = [95, 72, 48, 88, 61, 50, 30, 79, 90, 66]
>     passed = 0
>
>     for number, points in enumerate(exams, start=1):
>         mark = grade(points)
>         print(f"Klausur {number}: {points} Punkte, Note {mark}")
>         if mark <= 4:
>             passed += 1
>
>     average = sum(exams) / len(exams)
>     print(f"{passed} von {len(exams)} bestanden")
>     print(f"Durchschnitt: {average:.1f} Punkte")
>
>
> def grade(points):
>     if points >= 90:
>         return 1
>     elif points >= 75:
>         return 2
>     elif points >= 60:
>         return 3
>     elif points >= 50:
>         return 4
>     else:
>         return 5
>
>
> main()
> ```
>
> Eine einzige Schleife gibt jede Zeile aus und zählt dabei die Bestandenen,
> während den Durchschnitt `sum()` und `len()` ganz ohne Schleife liefern.
> Die Note heißt in `main` `mark` und nicht `grade`, weil dieser Name schon
> der Funktion gehört: Eine Variable `grade` in `main` würde die Funktion
> dort überdecken, und Python meldete beim Aufruf einen Fehler.

## Für Schnelle

Gib zusätzlich aus, wie oft jede Note vorkommt, etwa `Note 1: 2-mal`. Leg
dafür vor der Schleife eine Liste `counts = [0, 0, 0, 0, 0]` an, deren erste
Stelle die Einsen zählt, die zweite die Zweien und so weiter, und erhöhe in
der Schleife mit `counts[mark - 1] += 1` die passende Stelle. Eine zweite
Schleife mit `enumerate(counts, start=1)` gibt die fünf Zeilen danach aus.
