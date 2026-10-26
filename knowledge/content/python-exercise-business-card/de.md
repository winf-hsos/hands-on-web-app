---
type: exercise
code: 3293
title: "Übung: Visitenkarte"
summary: >-
  Ein Programm fragt nach Name, Studiengang und Stadt und gibt daraus eine
  ordentlich formatierte Visitenkarte aus, egal wie schlampig getippt wurde.
level: 1
duration: 15
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-working-with-text]
status: draft
updated: 2026-10-26
---

## Aufgabe

Schreib ein Programm, das nacheinander nach einem Namen, einem Studiengang und
einer Stadt fragt und daraus eine kleine Visitenkarte macht. Der Name soll
dabei in Großbuchstaben erscheinen, Studiengang und Stadt mit großen
Anfangsbuchstaben, und überzählige Leerzeichen am Anfang oder Ende einer
Eingabe sollen verschwinden. Oben und unten begrenzt eine Linie aus 30
Gleichheitszeichen die Karte.

## So soll es aussehen

Mit den Eingaben `  ada lovelace`, `mathematik` und `london  ` gibt das
Programm aus:

```text
Name:   ada lovelace
Studiengang: mathematik
Stadt: london
==============================
  ADA LOVELACE
  Mathematik · London
==============================
```

## Dein Programm

Das Gerüst fragt schon nach dem Namen. Ergänze den Rest und probier es mit
verschiedenen, auch absichtlich schlampigen Eingaben aus.

```python
name = input("Name: ")

# Frag nach Studiengang und Stadt.

# Gib die Karte aus.
```

> [!HINT]
> Die Methoden aus der Lektion lassen sich hintereinander hängen:
> `input("Name: ").strip().upper()` liest, räumt auf und macht groß, alles in
> einer Zeile. Die Linie bekommst du mit `"=" * 30`.

> [!HINT]
> Für die zweite Zeile der Karte setzt ein f-String beide Werte mit dem Punkt
> dazwischen zusammen: `f"  {course} · {city}"`.

> [!SOLUTION]
> ```python
> name = input("Name: ").strip().upper()
> course = input("Studiengang: ").strip().title()
> city = input("Stadt: ").strip().title()
>
> line = "=" * 30
> print(line)
> print(f"  {name}")
> print(f"  {course} · {city}")
> print(line)
> ```
>
> Die Linie steht in einer Variablen, weil sie zweimal gebraucht wird. Wenn
> die Karte breiter werden soll, änderst du die Zahl nur an einer Stelle.

## Für Schnelle

Lass die Linie genau so lang werden wie die längste Zeile der Karte. Die
Funktion `max` liefert die größte von mehreren Zahlen, etwa
`max(len(a), len(b))`.
