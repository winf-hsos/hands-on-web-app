---
type: quiz
code: 3442
title: "Quiz: Entscheidungen"
summary: Acht Fragen zu Wahrheitswerten, Vergleichen, and, or und not und zu Entscheidungen mit if, elif und else in Python.
objectives:
  intro: "Mit diesem Quiz prüfst du in acht Fragen, ob du Folgendes kannst:"
  goals:
    - "den Typ `bool` erkennen und `=` von `==` unterscheiden"
    - "vorhersagen, was ein Vergleich von Texten und eine Bedingung mit `and`, `or` und `not` ergibt"
    - "aus mehreren Bedingungen die heraussuchen, die für einen Wert wahr sind"
    - "vorhersagen, welchen Block eine Kette aus `if`, `elif` und `else` ausführt und was eine Funktion mit mehreren `return` liefert"
    - "erklären, warum `answer == \"ja\" or \"j\"` immer wahr ist"
level: 1
duration: 10
topics: [programming-with-python]
modules: [dup]
relations:
  checks: [python-conditions, python-if-else]
status: published
updated: 2026-11-01
---

## Welchen Typ hat der Wert von `5 > 3`?

- [ ] `int`
- [ ] `str`
- [x] `bool`

> Ein Vergleich beantwortet eine Ja-Nein-Frage, hier mit `True`. `True` und
> `False` sind Wahrheitswerte, und ihr Typ heißt `bool`.

## Was ist der Unterschied zwischen `x = 5` und `x == 5`?

- [x] `x = 5` gibt `x` den Wert 5, `x == 5` fragt, ob `x` gleich 5 ist.
- [ ] `x = 5` fragt, ob `x` gleich 5 ist, `x == 5` gibt `x` den Wert 5.
  > Es ist genau umgekehrt: Das einfache Zeichen weist zu, das doppelte fragt.
- [ ] Es gibt keinen, beide Schreibweisen bedeuten dasselbe.
  > In einer Bedingung wie `if x = 5:` meldet Python einen `SyntaxError` und
  > schlägt `==` vor.

> `=` weist zu und verändert damit `x`, `==` vergleicht und liefert `True`
> oder `False`, ohne etwas zu verändern.

## Was gibt `print("Ja" == "ja")` aus?

- [ ] `True`
- [x] `False`
- [ ] Eine Fehlermeldung, weil man Texte nicht vergleichen kann

> Texte sind nur gleich, wenn sie Zeichen für Zeichen übereinstimmen, auch in
> der Groß- und Kleinschreibung. Mit `"Ja".lower() == "ja"` ergäbe der
> Vergleich `True`.

## Was gibt dieses Programm aus?

```python static
age = 15
student = True
print(age >= 18 or student, not student)
```

- [x] `True False`
- [ ] `False False`
  > `age >= 18` ist zwar falsch, aber `or` braucht nur eine wahre Seite, und
  > `student` ist wahr.
- [ ] `True True`
- [ ] `False True`

> `age >= 18` ist falsch, `student` ist wahr, und für `or` genügt eine wahre
> Seite, also `True`. `not student` dreht `True` um und ergibt `False`.

## Welche Bedingungen sind wahr, wenn `number = 12` ist? (mehrere richtig)

- [x] `number % 2 == 0`
- [ ] `number > 12`
  > 12 ist nicht größer als 12; wahr wäre `number >= 12`.
- [x] `10 < number and number < 20`
- [ ] `not number == 12`
  > `number == 12` ist wahr, und `not` macht daraus `False`.
- [x] `number in [4, 8, 12]`

> 12 lässt sich ohne Rest durch 2 teilen, liegt zwischen 10 und 20 und steht
> in der Liste. Größer als sich selbst ist 12 nicht, und `not` dreht den
> wahren Vergleich `number == 12` in `False` um.

## Was gibt dieses Programm aus?

```python static
temperature = 25

if temperature >= 10:
    print("mild")
elif temperature >= 20:
    print("warm")
else:
    print("kalt")
```

- [x] `mild`
- [ ] `warm`
  > `warm` käme nur heraus, wenn die Abfrage `temperature >= 20` zuerst
  > stünde.
- [ ] `mild` und darunter `warm`
  > Aus einer Kette von `if`, `elif` und `else` läuft immer nur ein Block.
- [ ] `kalt`

> Python nimmt die erste Bedingung, die wahr ist, und 25 ist mindestens 10.
> Die übrigen Bedingungen prüft es danach nicht mehr, deshalb gehört bei
> Bereichen die Abfrage mit dem höchsten Wert nach oben.

## Was gibt dieses Programm aus?

```python static
answer = "nein"

if answer == "ja" or "j":
    print("Zugestimmt.")
else:
    print("Abgelehnt.")
```

- [x] `Zugestimmt.`
- [ ] `Abgelehnt.`
  > Das wäre die Absicht, aber die Bedingung ist anders gebaut, als sie sich
  > liest.
- [ ] Eine Fehlermeldung

> Python liest die Bedingung als `(answer == "ja") or "j"`. Rechts vom `or`
> steht kein Vergleich, sondern der Text `"j"`, und ein Text, der nicht leer
> ist, gilt als wahr. Richtig wäre `answer == "ja" or answer == "j"` oder
> `answer in ["ja", "j"]`.

## Was gibt dieses Programm aus?

```python static
def size(number):
    if number > 10:
        return "groß"
    if number > 5:
        return "mittel"
    return "klein"


print(size(8), size(20))
```

- [x] `mittel groß`
- [ ] `mittel mittel`
  > Bei 20 ist schon die erste Bedingung wahr, und `return` beendet die
  > Funktion, bevor die zweite geprüft wird.
- [ ] `klein groß`
  > Die letzte Zeile der Funktion erreicht nur eine Zahl, für die keine der
  > beiden Bedingungen wahr ist.
- [ ] `groß mittel`

> 8 ist nicht größer als 10, aber größer als 5, also liefert `size(8)` den
> Text `"mittel"`. Bei 20 ist die erste Bedingung wahr, und `return` beendet
> die Funktion sofort mit `"groß"`.
