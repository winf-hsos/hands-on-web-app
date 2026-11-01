---
type: exercise
code: 8495
title: "Übung: Kinokasse"
summary: >-
  Eine Funktion berechnet den Preis einer Kinokarte aus Alter und
  Studierendenstatus, und ein kleines Hauptprogramm fragt beides ab und nennt
  den Preis.
objectives:
  intro: "In dieser Übung schreibst du die Preisregeln einer Kinokasse als Funktion, und kannst danach:"
  goals:
    - "mehrere Preisregeln mit `if`, `elif` und `else` in die richtige Reihenfolge bringen, sodass die erste passende gewinnt"
    - "in einer Funktion auf jedem Weg mit `return` einen Preis zurückgeben"
    - "eine Ja-Nein-Antwort mit `strip()`, `lower()` und `==` in einen Wahrheitswert verwandeln, ganz gleich, wie sie getippt wurde"
    - "einen Wahrheitswert als Parameter übergeben und in einer Bedingung ohne `== True` verwenden"
    - "die Funktion einzeln mit Grenzfällen prüfen, etwa mit 5, 6, 17 und 18 Jahren"
level: 1
duration: 20
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-if-else]
status: draft
updated: 2026-11-01
---

## Aufgabe

An der Kinokasse gelten diese Preise: Kinder unter 6 Jahren sehen den Film
umsonst, wer unter 18 ist, zahlt 6.00 Euro, Studierende zahlen 7.50 Euro, und
alle anderen 10.00 Euro. Schreib eine Funktion `ticket_price(age, student)`,
die das Alter als Zahl und mit `student` einen Wahrheitswert bekommt und den
passenden Preis zurückgibt. Ein Hauptprogramm `main` fragt nach dem Alter und
danach, ob die Person studiert, und gibt den Preis mit zwei Nachkommastellen
aus. Bei der zweiten Frage soll `ja` in jeder Schreibweise zählen, also auch
`Ja` oder `JA`, und jede andere Antwort als nein.

## So soll es aussehen

```text
Wie alt bist du? 21
Studierst du? (ja/nein) Ja
Dein Ticket kostet 7.50 Euro.
```

## Dein Programm

```python
def main():
    age = int(input("Wie alt bist du? "))
    answer = input("Studierst du? (ja/nein) ")
    # Mach aus der Antwort einen Wahrheitswert, auch bei "Ja" oder "JA".
    student = False
    price = ticket_price(age, student)
    print(f"Dein Ticket kostet {price:.2f} Euro.")


def ticket_price(age, student):
    # Prüfe die Regeln der Reihe nach und gib den Preis zurück.
    return 0.0


main()
```

Weil `ticket_price` ihr Ergebnis zurückgibt, kannst du sie auch ohne Eingaben
prüfen. Ersetze dazu die letzte Zeile vorübergehend durch
`print(ticket_price(16, True))` und überlege vorher, welcher Preis
herauskommen muss.

> [!HINT]
> Wer unter 6 ist, ist auch unter 18, und wer mit 16 schon studiert, ist
> trotzdem unter 18. Weil Python bei `if` und `elif` die erste wahre
> Bedingung nimmt, gehört die engste Regel nach oben: zuerst unter 6, dann
> unter 18, dann Studierende, und für alle übrigen bleibt `else`.

> [!HINT]
> `answer.strip().lower() == "ja"` ist schon der Wahrheitswert, den du für
> `student` brauchst, ein `if` ist dafür nicht nötig. Prüfe die Funktion an
> den Grenzen: Mit 5 Jahren ist der Film umsonst, mit 6 kostet er 6.00 Euro,
> mit 17 ebenfalls und mit 18 erst 7.50 oder 10.00 Euro.

> [!SOLUTION]
> ```python
> def main():
>     age = int(input("Wie alt bist du? "))
>     answer = input("Studierst du? (ja/nein) ")
>     student = answer.strip().lower() == "ja"
>     price = ticket_price(age, student)
>     print(f"Dein Ticket kostet {price:.2f} Euro.")
>
>
> def ticket_price(age, student):
>     if age < 6:
>         return 0.0
>     elif age < 18:
>         return 6.0
>     elif student:
>         return 7.5
>     else:
>         return 10.0
>
>
> main()
> ```
>
> Die Regeln stehen in der Reihenfolge von der engsten zur weitesten, denn
> nach der ersten wahren Bedingung beendet `return` die Funktion. Bei 21
> Jahren sind die ersten beiden Bedingungen falsch, und weil `student` schon
> ein Wahrheitswert ist, genügt danach `elif student:` ohne `== True`.

## Für Schnelle

Dienstag ist Kinotag: Dann kostet jedes Ticket, das nicht ohnehin umsonst ist,
2 Euro weniger. Gib `ticket_price` einen dritten Parameter `cinema_day` und
lass `main` zusätzlich fragen, ob heute Dienstag ist. Studierende zahlen dann
5.50 Euro, und ein Kind unter 6 bleibt bei 0.00 Euro.
