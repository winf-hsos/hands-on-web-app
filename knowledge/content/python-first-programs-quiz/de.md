---
type: quiz
code: 4381
title: "Quiz: Erste Programme"
summary: Sechs Fragen zu Werten, Variablen, Text, Rechnen und eigenen Funktionen in Python.
level: 1
duration: 8
topics: [processing-information]
modules: [dup]
relations:
  checks: [python-first-program, python-values-and-variables, python-working-with-text, python-arithmetic, python-functions]
status: draft
updated: 2026-10-26
---

## Was gibt `print("3" + "4")` aus?

- [ ] `7`
- [x] `34`
- [ ] Eine Fehlermeldung, weil man Texte nicht addieren kann

> Beide Werte stehen in Anführungszeichen und sind deshalb Texte. Bei Texten
> hängt `+` die beiden aneinander, gerechnet wird nicht.

## Jemand tippt bei `age = input("Alter? ")` die Zahl `19` ein. Welchen Typ hat `age`?

- [ ] `int`
- [ ] `float`
- [x] `str`

> `input` liefert immer einen String, auch wenn nur Ziffern eingetippt wurden.
> Zum Rechnen wandelt man ihn mit `int(...)` um.

## Welche Werte liefern `17 // 5` und `17 % 5`?

- [ ] `3.4` und `0`
- [x] `3` und `2`
- [ ] `3` und `0.4`
- [ ] `2` und `3`

> 17 durch 5 ergibt 3 mit Rest 2. `//` liefert den ganzzahligen Teil, `%` den
> Rest.

## Welche dieser Namen kann eine Variable in Python haben? (mehrere richtig)

- [x] `total_price`
- [ ] `2nd_place`
- [ ] `my-name`
- [x] `seconds_per_day`
- [ ] `class`

> Namen bestehen aus Buchstaben, Ziffern und Unterstrichen und beginnen nicht
> mit einer Ziffer. Ein Bindestrich wäre ein Minuszeichen, und `class` ist ein
> reserviertes Wort von Python.

## Welchen Wert hat `result` am Ende?

```python static
def double(number):
    print(number * 2)


result = double(4)
```

- [ ] `8`
- [ ] `"8"`
- [x] `None`

> `double` gibt die 8 nur aus, liefert aber nichts zurück, weil ein `return`
> fehlt. Eine Funktion ohne `return` liefert `None`.

## Ein Programm bricht ab mit `NameError: name 'totl' is not defined`. Was ist am wahrscheinlichsten passiert?

- [ ] Python ist für dieses Programm zu alt.
- [x] Ein Name ist falsch geschrieben, oder die Variable hat an dieser Stelle noch keinen Wert.
- [ ] Eine Zahl wurde durch null geteilt.

> Ein `NameError` heißt, dass Python einen Namen nicht kennt. Meist ist es ein
> Tippfehler wie hier, wo vermutlich `total` gemeint war, oder die Variable
> bekommt erst weiter unten einen Wert.
