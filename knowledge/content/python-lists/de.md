---
type: lesson
code: 2129
title: Listen
summary: >-
  Eine Liste fasst viele Werte unter einem Namen zusammen, in fester
  Reihenfolge. Du greifst über die Position auf einzelne Werte zu, hängst neue
  an, sortierst und rechnest mit allen auf einmal.
objectives:
  intro: "In dieser Lektion lernst du Listen kennen und kannst danach:"
  goals:
    - "eine Liste mit eckigen Klammern anlegen und mit `[0]` und `[-1]` auf das erste und das letzte Element zugreifen"
    - "erklären, warum die Positionen bei 0 beginnen und wann Python einen `IndexError` meldet"
    - "mit `len()`, `sum()`, `min()` und `max()` die Werte einer Liste zählen und zusammenfassen und daraus einen Durchschnitt berechnen"
    - "eine Liste mit `append()` und `remove()` verändern, ein Element ersetzen und mit `in` prüfen, ob ein Wert darin vorkommt"
    - "mit `sorted()` eine sortierte Fassung erzeugen und mit `split()` und `join()` zwischen Text und Liste wechseln"
level: 1
duration: 20
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-values-and-variables, python-working-with-text]
  see_also: [programming-principles]
status: published
updated: 2026-11-01
---

Bisher hat jede Variable genau einen Wert gehalten. Oft sind es aber viele
Werte derselben Art: die Temperaturen einer Woche, alle Einkäufe, die Namen
einer Gruppe. Für jeden eine eigene Variable anzulegen, wäre mühsam, und das
Programm wüsste nicht, dass sie zusammengehören. Dafür gibt es **Listen**: Sie
fassen viele Werte unter einem Namen zusammen, in einer festen Reihenfolge,
wie die Wagen eines Zuges aus den [[programming-principles|Grundideen]].

## Eine Liste anlegen

Eine Liste steht in eckigen Klammern, die Werte darin heißen **Elemente** und
werden durch Kommas getrennt:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]
shopping = ["Milch", "Brot", "Äpfel"]
empty = []

print(temperatures)
print(shopping)
print(len(shopping))
```

`len()` kennst du schon von Texten; bei einer Liste zählt es die Elemente. Eine
Liste darf auch leer sein, und Elemente verschiedener Typen darf sie ebenfalls
enthalten. Meistens stehen in einer Liste aber Werte derselben Art, weil man
mit ihnen dasselbe anfangen will.

## Auf ein Element zugreifen

Jedes Element hat eine Position, den **Index**, und Python beginnt beim Zählen
mit 0. Das erste Element hat also den Index 0, das zweite den Index 1. Mit
einem negativen Index zählst du von hinten: `-1` ist das letzte Element.

```python
shopping = ["Milch", "Brot", "Äpfel"]

print(shopping[0])
print(shopping[1])
print(shopping[-1])
```

Fragst du nach einer Position, die es nicht gibt, meldet Python einen Fehler.
Ändere im Kasten oben eine Zeile zu `print(shopping[3])` und sieh dir die
Meldung an: Die Liste hat drei Elemente mit den Positionen 0, 1 und 2, und
`IndexError: list index out of range` sagt, dass 3 darüber hinausgeht.

Ein Element lässt sich auch ersetzen, indem du seiner Position einen neuen
Wert zuweist:

```python
shopping = ["Milch", "Brot", "Äpfel"]
shopping[1] = "Brötchen"
print(shopping)
```

## Mit allen Werten auf einmal rechnen

Für Listen aus Zahlen bringt Python Funktionen mit, die alle Elemente
zusammenfassen:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]

print(sum(temperatures))
print(min(temperatures))
print(max(temperatures))

average = sum(temperatures) / len(temperatures)
print(f"Im Mittel {average:.1f} Grad")
```

Den Durchschnitt gibt es nicht als eigene Funktion, aber er ist schnell
gerechnet: die Summe geteilt durch die Zahl der Werte.

## Eine Liste verändern

Eine Liste kann wachsen und schrumpfen. `append()` hängt ein Element hinten
an, `remove()` entfernt das erste Element mit dem angegebenen Wert:

```python
shopping = ["Milch", "Brot", "Äpfel"]

shopping.append("Käse")
print(shopping)

shopping.remove("Brot")
print(shopping)
```

`append` und `remove` sind **Methoden** wie `upper()` bei Texten und werden
ebenso mit einem Punkt an den Namen gehängt. Anders als bei Texten verändern
die Methoden einer Liste aber die Liste selbst: Du schreibst nicht `shopping = shopping.append("Käse")`,
sondern nur `shopping.append("Käse")`.

Ob ein Wert in der Liste vorkommt, fragst du mit `in`. Die Antwort ist `True`
oder `False`, ein Wahrheitswert, mit dem du in Teil 2 dieses Pfads
Entscheidungen triffst:

```python
shopping = ["Milch", "Brot", "Äpfel"]

print("Brot" in shopping)
print("Butter" in shopping)
```

`remove()` mit einem Wert, der nicht in der Liste steht, bricht übrigens mit
einem `ValueError` ab.

## Sortieren

`sorted()` gibt eine sortierte Fassung der Liste zurück, Zahlen der Größe nach
und Texte nach dem Alphabet. Die ursprüngliche Liste bleibt dabei, wie sie war:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]

print(sorted(temperatures))
print(sorted(temperatures, reverse=True))
print(temperatures)
```

Mit `reverse=True` sortiert `sorted()` absteigend, also mit dem größten Wert
zuerst.

## Von Text zu Liste und zurück

Oft kommen mehrere Werte als ein einziger Text an, etwa aus einer Eingabe.
`split()` zerlegt einen Text an einem Trennzeichen in eine Liste von Texten,
und `join()` setzt eine Liste von Texten wieder zu einem Text zusammen:

```python
line = "Milch, Brot, Äpfel, Käse"
shopping = line.split(", ")
print(shopping)
print(len(shopping))

print(" und ".join(shopping))
```

Achte darauf, dass `join()` am Trennzeichen hängt und die Liste in der Klammer
steht, nicht umgekehrt. Ohne Angabe in der Klammer trennt `split()` an
Leerzeichen.

## Was noch fehlt

Mit einer Liste kannst du jetzt viele Werte halten, einzelne herausgreifen und
alle zusammenfassen. Was dir noch fehlt, ist ein Weg, mit **jedem** Element
etwas Eigenes anzufangen, etwa jede Temperatur in Fahrenheit umzurechnen oder
jeden Einkauf auf eine eigene Zeile zu schreiben. Das ist die Aufgabe von
Schleifen, und sie folgen in Teil 2 dieses Pfads.

## Zum Mitnehmen

- Eine Liste steht in eckigen Klammern und hält viele Werte in fester
  Reihenfolge.
- Der Index beginnt bei 0, `[-1]` ist das letzte Element, und eine Position
  außerhalb der Liste ergibt einen `IndexError`.
- `len()`, `sum()`, `min()` und `max()` fassen eine Liste zusammen; der
  Durchschnitt ist `sum(...) / len(...)`.
- `append()` und `remove()` verändern die Liste selbst, `in` prüft, ob ein Wert
  darin steht, `sorted()` liefert eine sortierte Fassung.
- `split()` macht aus einem Text eine Liste, `join()` aus einer Liste einen
  Text.
