---
type: exercise
code: 7488
title: "Übung: Wetterwoche"
summary: >-
  Die Temperaturen einer Woche stehen in einer Liste. Das Programm fasst sie
  zusammen, nimmt einen neuen Messwert auf und zeigt, wie sich das Bild
  dadurch ändert.
objectives:
  intro: "In dieser Übung wertest du die Temperaturen einer Woche aus und kannst danach:"
  goals:
    - "mit `min()`, `max()`, `sum()` und `len()` eine Liste von Messwerten zusammenfassen"
    - "über `[0]` und `[-1]` den ersten und den letzten Wert einer Liste ausgeben"
    - "einen eingegebenen Wert mit `float()` umwandeln und mit `append()` an die Liste hängen"
    - "mit `sorted()` die Werte geordnet ausgeben, ohne die Liste selbst zu verändern"
    - "Kommazahlen mit `:.1f` im f-String auf eine Nachkommastelle ausgeben"
level: 1
duration: 20
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-lists]
status: draft
updated: 2026-11-01
---

## Aufgabe

Eine Wetterstation hat an sieben Tagen mittags die Temperatur gemessen; die
Werte stehen schon im Programm. Schreib ein Programm, das ausgibt, wie viele
Messwerte es gibt, welcher Wert am Anfang und welcher am Ende der Woche stand,
wie warm es höchstens und mindestens war und wie hoch der Durchschnitt ist.
Danach fragt es nach dem Messwert von heute, hängt ihn an die Liste und gibt
den neuen Durchschnitt und alle Werte der Größe nach aus.

## So soll es aussehen

```text
7 Messwerte
Erster Tag: 12.5 Grad, letzter Tag: 15.5 Grad
Höchstens 18.0 Grad, mindestens 9.5 Grad
Durchschnitt: 13.4 Grad
Temperatur heute? 21
Jetzt 8 Messwerte, Durchschnitt: 14.4 Grad
Der Größe nach: [9.5, 11.0, 12.5, 13.5, 14.0, 15.5, 18.0, 21.0]
```

## Dein Programm

```python
temperatures = [12.5, 14.0, 9.5, 18.0, 13.5, 11.0, 15.5]

# Wie viele Werte, erster und letzter, höchster und niedrigster, Durchschnitt?

# Den Wert von heute erfragen und anhängen, dann neu auswerten
```

> [!HINT]
> Den Durchschnitt liefert keine eigene Funktion: Teile die Summe durch die
> Zahl der Werte, also `sum(temperatures) / len(temperatures)`. Mit `:.1f` im
> f-String erscheint er mit einer Nachkommastelle.

> [!HINT]
> `input()` liefert einen Text. Damit er als Zahl in die Liste kommt, wandle
> ihn mit `float()` um, bevor du ihn mit `append()` anhängst. Nach dem
> Anhängen ist die Liste um ein Element länger, und `len()` und `sum()` sehen
> den neuen Wert von selbst.

> [!SOLUTION]
> ```python
> temperatures = [12.5, 14.0, 9.5, 18.0, 13.5, 11.0, 15.5]
>
> average = sum(temperatures) / len(temperatures)
> print(f"{len(temperatures)} Messwerte")
> print(f"Erster Tag: {temperatures[0]} Grad, letzter Tag: {temperatures[-1]} Grad")
> print(f"Höchstens {max(temperatures)} Grad, mindestens {min(temperatures)} Grad")
> print(f"Durchschnitt: {average:.1f} Grad")
>
> today = float(input("Temperatur heute? "))
> temperatures.append(today)
>
> average = sum(temperatures) / len(temperatures)
> print(f"Jetzt {len(temperatures)} Messwerte, Durchschnitt: {average:.1f} Grad")
> print(f"Der Größe nach: {sorted(temperatures)}")
> ```
>
> Der Durchschnitt wird nach dem Anhängen neu berechnet, denn die Variable
> `average` hält noch den alten Wert: Sie hat sich die Zahl gemerkt, nicht die
> Rechnung. Und weil `sorted()` eine neue Liste liefert, steht in
> `temperatures` weiter die Reihenfolge der Messtage.

## Für Schnelle

Gib zusätzlich aus, an welchem Tag es am wärmsten war. `temperatures.index(wert)`
liefert die Position, an der ein Wert zum ersten Mal steht; zähl eins dazu,
damit der erste Tag Tag 1 heißt und nicht Tag 0.
