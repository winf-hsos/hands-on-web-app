---
type: quiz
code: 4381
title: "Quiz: Erste Programme"
summary: Acht Fragen zu Werten, Variablen, Text, Rechnen, Listen und eigenen Funktionen in Python.
objectives:
  intro: "Mit diesem Quiz prüfst du in acht Fragen, ob du Folgendes kannst:"
  goals:
    - "vorhersagen, was `+` bei zwei Texten ergibt und welchen Typ der Wert aus `input()` hat"
    - "die Ergebnisse von `//` und `%` ausrechnen"
    - "gültige Variablennamen von ungültigen und reservierten unterscheiden"
    - "mit dem Index auf Elemente einer Liste zugreifen und vorhersagen, wie `append()` sie verändert"
    - "erkennen, dass eine Funktion ohne `return` den Wert `None` liefert, und einen `NameError` auf seine wahrscheinliche Ursache zurückführen"
level: 1
duration: 10
topics: [programming-with-python]
modules: [dup]
relations:
  checks: [python-first-program, python-values-and-variables, python-working-with-text, python-arithmetic, python-lists, python-functions]
questions: [hcs-008, hcs-009, hcs-010, hcs-011, hcs-012, hcs-013, hcs-014, hcs-015]
status: published
updated: 2026-11-09
---

## Was gibt `print("3" + "4")` aus? {#hcs-008}

- [ ] `7`
  > Gerechnet wird nur mit Zahlen, und in Anführungszeichen sind `3` und `4` Texte.
- [x] `34`
  > Bei Texten hängt `+` den zweiten an den ersten an.
- [ ] Eine Fehlermeldung, weil man Texte nicht addieren kann
  > Texte lassen sich mit `+` verbinden, einen Fehler gäbe es erst bei Text plus Zahl, etwa `"3" + 4`.
- [ ] `"34"`
  > `print` gibt den Inhalt des Textes aus, die Anführungszeichen gehören nicht dazu.

> Beide Werte stehen in Anführungszeichen und sind deshalb Texte. Bei Texten hängt `+` die beiden aneinander, gerechnet wird nicht.

## Jemand tippt bei `age = input("Alter? ")` die Zahl `19` ein. Welchen Typ hat `age`? {#hcs-009}

- [ ] `int`
  > Auch wenn nur Ziffern eingetippt werden, liefert `input` einen Text, der erst mit `int(...)` zur Zahl wird.
- [ ] `float`
  > Zur Kommazahl wird die Eingabe ebenso wenig, denn `input` liefert immer einen String.
- [x] `str`
  > `input` liefert immer einen String, ganz gleich, was eingetippt wird.
- [ ] `bool`
  > Ein Wahrheitswert entsteht etwa aus einem Vergleich, `input` liefert dagegen immer einen String.

> `input` liefert immer einen String, auch wenn nur Ziffern eingetippt wurden. Zum Rechnen wandelt man ihn mit `int(...)` um.

## Welche Werte liefern `17 // 5` und `17 % 5`? {#hcs-010}

- [ ] `3.4` und `0`
  > `3.4` wäre das Ergebnis von `17 / 5`, während `//` den Rest weglässt und `%` ihn liefert.
- [x] `3` und `2`
  > 5 passt dreimal in 17, und es bleiben 2 übrig.
- [ ] `3` und `0.4`
  > `%` liefert den Rest als ganze Zahl, nicht den Teil hinter dem Komma.
- [ ] `2` und `3`
  > Die Reihenfolge ist vertauscht: `//` liefert die 3, `%` den Rest 2.

> 17 durch 5 ergibt 3 mit Rest 2. `//` liefert den ganzzahligen Teil, `%` den Rest.

## Welche dieser Namen kann eine Variable in Python haben? (Mehrere richtige Antworten möglich.) {#hcs-011}

- [x] `total_price`
  > Buchstaben und Unterstriche sind erlaubt, also ist das ein gültiger Name.
- [ ] `2nd_place`
  > Ein Name darf nicht mit einer Ziffer beginnen.
- [ ] `my-name`
  > Python liest den Bindestrich als Minus und rechnet `my` minus `name`.
- [x] `seconds_per_day`
  > Der Name besteht nur aus Buchstaben und Unterstrichen, ist also gültig und dazu gut lesbar.
- [ ] `class`
  > `class` ist ein reserviertes Wort von Python und kann deshalb kein Name sein.

> Namen bestehen aus Buchstaben, Ziffern und Unterstrichen und beginnen nicht mit einer Ziffer. Ein Bindestrich wäre ein Minuszeichen, und `class` ist ein reserviertes Wort von Python.

## Was gibt `print(colors[1])` aus, wenn `colors = ["rot", "grün", "blau"]` ist? {#hcs-012}

- [ ] `rot`
  > `rot` steht an Position 0, denn die Zählung beginnt bei 0.
- [x] `grün`
  > Index 1 ist das zweite Element, weil die Zählung bei 0 beginnt.
- [ ] `blau`
  > `blau` steht an Position 2, und als letztes Element erreichst du es auch mit `colors[-1]`.
- [ ] `["rot", "grün"]`
  > Ein einzelner Index liefert genau ein Element, mehrere bekäme man mit einem Ausschnitt wie `colors[0:2]`.

> Der Index beginnt bei 0: `colors[0]` ist `"rot"`, `colors[1]` ist `"grün"`. Das letzte Element erreichst du mit `colors[-1]`.

## Was gibt dieses Programm aus? {#hcs-013}

```python static
numbers = [3, 8, 1]
numbers.append(5)
print(len(numbers), max(numbers), sorted(numbers)[0])
```

- [ ] `3 8 3`
  > `append` verändert die Liste, sie hat danach vier Elemente, und `sorted(numbers)[0]` ist das kleinste Element, nicht das erste.
- [x] `4 8 1`
  > Die Liste hat vier Elemente, das größte ist 8, und sortiert steht die 1 vorn.
- [ ] `4 5 1`
  > `max` liefert den größten Wert, nicht den zuletzt angehängten.
- [ ] `4 8 3`
  > `sorted(numbers)[0]` nimmt das erste Element der sortierten Liste, und das ist die 1, nicht die 3 vom Anfang.

> `append` hängt die 5 hinten an, die Liste hat danach vier Elemente. Das größte ist weiterhin die 8, und `sorted(numbers)[0]` ist das kleinste Element, die 1. Die Liste `numbers` selbst bleibt dabei unsortiert.

## Welchen Wert hat `result` am Ende? {#hcs-014}

```python static
def double(number):
    print(number * 2)


result = double(4)
```

- [ ] `8`
  > Die 8 erscheint zwar auf dem Bildschirm, aber `print` gibt sie nur aus und liefert sie nicht zurück.
- [ ] `"8"`
  > Auch als Text kommt nichts zurück, denn ohne `return` liefert die Funktion `None`.
- [x] `None`
  > Ohne `return` liefert jede Funktion `None`.
- [ ] `0`
  > Ohne `return` liefert die Funktion nicht 0, sondern `None`, also gar keinen Wert.

> `double` gibt die 8 nur aus, liefert aber nichts zurück, weil ein `return` fehlt. Eine Funktion ohne `return` liefert `None`.

## Ein Programm bricht ab mit `NameError: name 'totl' is not defined`. Was ist am wahrscheinlichsten passiert? {#hcs-015}

- [ ] Python ist für dieses Programm zu alt.
  > Die Meldung nennt den Namen `totl`, den Python nicht kennt, und mit der Version hat das nichts zu tun.
- [x] Ein Name ist falsch geschrieben, oder die Variable hat an dieser Stelle noch keinen Wert.
  > `totl` ist vermutlich ein Tippfehler für `total`, oder die Variable bekommt ihren Wert erst später.
- [ ] Eine Zahl wurde durch null geteilt.
  > Teilen durch null meldet Python als `ZeroDivisionError`.
- [ ] Der Variablen `totl` wurde ein Text statt einer Zahl zugewiesen.
  > Einen falschen Typ meldet Python als `TypeError`, der `NameError` heißt dagegen, dass es `totl` gar nicht gibt.

> Ein `NameError` heißt, dass Python einen Namen nicht kennt. Meist ist es ein Tippfehler wie hier, wo vermutlich `total` gemeint war, oder die Variable bekommt erst weiter unten einen Wert.
