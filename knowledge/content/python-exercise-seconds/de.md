---
type: exercise
code: 8206
title: "Übung: Sekunden umrechnen"
summary: >-
  Eine eigene Funktion macht aus einer Zahl von Sekunden eine lesbare Dauer
  wie 2 h 5 min 7 s, und ein kleines Hauptprogramm fragt danach.
objectives:
  intro: "In dieser Übung schreibst du eine eigene Funktion, die Sekunden in eine lesbare Dauer umrechnet, und kannst danach:"
  goals:
    - "mit `//` und `%` eine Zahl von Sekunden schrittweise in Stunden, Minuten und Sekunden zerlegen"
    - "eine Funktion schreiben, die ihr Ergebnis mit `return` als Text zurückgibt, statt es selbst auszugeben"
    - "Eingabe und Ausgabe in einer Funktion `main` von der eigentlichen Rechnung trennen"
    - "eine Funktion einzeln mit Werten prüfen, deren Ergebnis du im Kopf kennst, etwa 59, 60, 3600 und 3661 Sekunden"
level: 1
duration: 20
topics: [programming-with-python, solving-problems]
modules: [dup]
relations:
  requires: [python-functions]
status: published
updated: 2026-11-01
---

## Aufgabe

Schreib eine Funktion `format_duration(seconds)`, die eine Zahl von Sekunden
bekommt und einen Text zurückgibt, der dieselbe Dauer in Stunden, Minuten und
Sekunden ausdrückt, etwa `"2 h 5 min 7 s"` für 7507 Sekunden. Die Funktion
selbst gibt nichts aus, sie liefert den Text mit `return`. Ein Hauptprogramm
`main` fragt nach den Sekunden, ruft die Funktion auf und gibt das Ergebnis
aus.

## So soll es aussehen

```text
Wie viele Sekunden? 7507
7507 Sekunden sind 2 h 5 min 7 s.
```

## Dein Programm

```python
def main():
    answer = input("Wie viele Sekunden? ")
    seconds = int(answer)
    duration = format_duration(seconds)
    print(f"{seconds} Sekunden sind {duration}.")


def format_duration(seconds):
    # Rechne Stunden, Minuten und Sekunden aus und gib den Text zurück.
    return ""


main()
```

Weil `format_duration` ihr Ergebnis zurückgibt, kannst du sie auch einzeln
prüfen. Ersetze dazu die letzte Zeile vorübergehend durch
`print(format_duration(7507))` und vergleiche mit dem erwarteten Ergebnis.

> [!HINT]
> Eine Stunde hat 3600 Sekunden. `seconds // 3600` liefert die vollen Stunden,
> und `seconds % 3600` die Sekunden, die danach übrig bleiben. Mit diesem Rest
> machst du für die Minuten dasselbe noch einmal mit 60.

> [!HINT]
> Prüfe deine Funktion mit Werten, bei denen du das Ergebnis im Kopf weißt:
> 59 Sekunden, 60 Sekunden, 3600 Sekunden und 3661 Sekunden.

> [!SOLUTION]
> ```python
> def main():
>     answer = input("Wie viele Sekunden? ")
>     seconds = int(answer)
>     duration = format_duration(seconds)
>     print(f"{seconds} Sekunden sind {duration}.")
>
>
> def format_duration(seconds):
>     hours = seconds // 3600
>     rest = seconds % 3600
>     minutes = rest // 60
>     rest = rest % 60
>     return f"{hours} h {minutes} min {rest} s"
>
>
> main()
> ```
>
> Die Funktion zerlegt die Sekunden in zwei Schritten, zuerst in Stunden und
> Rest, dann den Rest in Minuten und Sekunden. Für 7507 ergibt das 2 Stunden
> und 307 Sekunden Rest, und 307 Sekunden sind 5 Minuten und 7 Sekunden.

## Für Schnelle

Erweitere die Funktion um Tage, sodass 90061 Sekunden als `1 d 1 h 1 min 1 s`
erscheinen.
