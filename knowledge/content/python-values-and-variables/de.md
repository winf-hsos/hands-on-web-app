---
type: lesson
code: 1026
title: Werte und Variablen
summary: >-
  Programme rechnen mit Zahlen und Texten. Damit sie einen Wert später
  wiederfinden, geben sie ihm einen Namen, und genau das ist eine Variable.
level: 1
duration: 20
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-first-program]
status: draft
updated: 2026-10-26
---

## Worum es geht

Fast jedes Programm arbeitet mit **Werten**: einer Temperatur, einem Preis,
einem Namen. Python unterscheidet dabei verschiedene Arten von Werten, und von
der Art hängt ab, was man mit einem Wert anfangen kann. Damit ein Programm einen
Wert später wiederverwenden kann, legt es ihn unter einem Namen ab, und so
einen Namen nennt man **Variable**.

## Drei Arten von Werten

Für den Anfang genügen drei Arten, die man in Python **Datentypen** nennt:

| Typ | steht für | Beispiele |
|---|---|---|
| `int` | ganze Zahlen (*integer*) | `42`, `-7`, `0` |
| `float` | Kommazahlen (*floating point*) | `3.5`, `-0.25`, `100.0` |
| `str` | Text (*string*) | `"Hallo"`, `"42"`, `""` |

Mit der Funktion `type` fragst du Python, welchen Typ ein Wert hat:

```python
print(type(42))
print(type(3.5))
print(type("42"))
```

Achte auf das letzte Beispiel: `"42"` steht in Anführungszeichen und ist
deshalb ein Text, der zufällig aus zwei Ziffern besteht, und keine Zahl.

> [!WARNING]
> Kommazahlen schreibt Python mit einem **Punkt**, wie im Englischen. Probier
> aus, was `print(3,5)` ausgibt: Python sieht darin zwei Zahlen, 3 und 5, und
> gibt beide mit einem Leerzeichen dazwischen aus.

## Variablen

Eine Variable legst du an, indem du einem Namen mit `=` einen Wert zuweist:

```python
temperature = 21.5
city = "Osnabrück"
print("In", city, "sind es", temperature, "Grad.")
```

Das `=` bedeutet in Python nicht „ist gleich“ wie in der Mathematik, sondern
„bekommt den Wert“: Python rechnet aus, was rechts steht, und legt das
Ergebnis unter dem Namen links ab. Danach steht der Name überall, wo du ihn
verwendest, für diesen Wert.

Eine Variable kann später einen neuen Wert bekommen. Dann ist der alte weg,
und ab dieser Zeile gilt der neue:

```python
count = 1
print(count)
count = count + 1
print(count)
```

Die Zeile `count = count + 1` ist mathematisch Unsinn, für Python aber klar:
Nimm den jetzigen Wert von `count`, zähle eins dazu und lege das Ergebnis
wieder unter `count` ab.

## Gute Namen

Für Namen gelten ein paar feste Regeln: Sie bestehen aus Buchstaben, Ziffern
und dem Unterstrich `_`, beginnen nicht mit einer Ziffer und enthalten keine
Leerzeichen. Groß- und Kleinschreibung zählt, `price` und `Price` sind zwei
verschiedene Variablen. Außerdem sind Wörter wie `if`, `for` oder `class`
reserviert, weil sie in Python selbst eine Bedeutung haben.

```python
2nd_place = "Ada"
```

Dieser Name beginnt mit einer Ziffer, und deshalb bricht Python mit einem
`SyntaxError` ab, noch bevor das Programm überhaupt läuft.

Darüber hinaus gibt es Gewohnheiten, an die sich fast alle halten: Namen
werden klein geschrieben, mehrere Wörter verbindet ein Unterstrich
(`total_price`), und ein Name sagt, was in der Variablen steckt. `x` und `a`
sind schnell getippt, aber `seconds_per_day` versteht man auch noch in einem
Monat.

> [!NOTE]
> Die Namen in den Beispielen sind englisch, wie fast überall beim
> Programmieren. So liest sich der Code zusammen mit den englischen Wörtern
> von Python selbst, etwa `print` oder `type`, wie aus einem Guss. Was ein
> Programm auf dem Bildschirm ausgibt, darf natürlich deutsch sein.

## Der Typ entscheidet, was passiert

Das Pluszeichen zeigt gut, warum der Typ wichtig ist. Bei Zahlen addiert es,
bei Texten hängt es die Texte aneinander:

```python
print(42 + 1)
print("42" + "1")
```

Und wenn du beides mischst, weiß Python nicht, was du willst, und meldet einen
`TypeError`:

```python
print("42" + 1)
```

Wie du einen Text in eine Zahl verwandelst und umgekehrt, lernst du in der
nächsten Lektion.

## Zum Mitnehmen

- Werte haben einen Typ: `int` für ganze Zahlen, `float` für Kommazahlen mit
  Punkt, `str` für Text in Anführungszeichen.
- `name = wert` legt einen Wert unter einem Namen ab; ein neuer Wert ersetzt
  den alten.
- Namen sind klein geschrieben, verbinden Wörter mit `_` und sagen, was in der
  Variablen steckt.
- Was ein Operator wie `+` bewirkt, hängt vom Typ der Werte ab.
