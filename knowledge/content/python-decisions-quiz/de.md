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
questions: [hcs-016, hcs-017, hcs-018, hcs-019, hcs-020, hcs-021, hcs-022, hcs-023]
status: published
updated: 2026-11-09
---

## Welchen Typ hat der Wert von `5 > 3`? {#hcs-016}

- [ ] `int`
  > Ein Vergleich liefert keine Zahl, sondern `True` oder `False`.
- [ ] `str`
  > `True` sieht aus wie ein Wort, steht aber nicht in Anführungszeichen und ist deshalb kein Text.
- [x] `bool`
  > Ein Vergleich liefert einen Wahrheitswert, und der hat den Typ `bool`.
- [ ] `float`
  > Ein Vergleich rechnet nichts aus, sondern beantwortet eine Ja-Nein-Frage mit `True` oder `False`.

> Ein Vergleich beantwortet eine Ja-Nein-Frage, hier mit `True`. `True` und `False` sind Wahrheitswerte, und ihr Typ heißt `bool`.

## Was ist der Unterschied zwischen `x = 5` und `x == 5`? {#hcs-017}

- [x] `x = 5` gibt `x` den Wert 5, `x == 5` fragt, ob `x` gleich 5 ist.
  > Das einfache Gleichheitszeichen weist zu, das doppelte vergleicht.
- [ ] `x = 5` fragt, ob `x` gleich 5 ist, `x == 5` gibt `x` den Wert 5.
  > Es ist genau umgekehrt: Das einfache Zeichen weist zu, das doppelte fragt.
- [ ] Es gibt keinen, beide Schreibweisen bedeuten dasselbe.
  > In einer Bedingung wie `if x = 5:` meldet Python einen `SyntaxError` und schlägt `==` vor.
- [ ] `x = 5` vergleicht nur Zahlen, `x == 5` vergleicht auch Texte.
  > `x = 5` vergleicht gar nicht, sondern gibt `x` einen Wert, und `==` vergleicht Zahlen und Texte gleichermaßen.

> `=` weist zu und verändert damit `x`, `==` vergleicht und liefert `True` oder `False`, ohne etwas zu verändern.

## Was gibt `print("Ja" == "ja")` aus? {#hcs-018}

- [ ] `True`
  > Groß- und Kleinschreibung zählen, und `J` und `j` sind verschiedene Zeichen.
- [x] `False`
  > Die Texte unterscheiden sich im ersten Buchstaben, deshalb sind sie nicht gleich.
- [ ] Eine Fehlermeldung, weil man Texte nicht vergleichen kann
  > Texte lassen sich mit `==` vergleichen, Python prüft sie Zeichen für Zeichen.
- [ ] `Ja == ja`
  > `print` gibt nicht den Ausdruck aus, sondern sein Ergebnis, und das ist ein Wahrheitswert.

> Texte sind nur gleich, wenn sie Zeichen für Zeichen übereinstimmen, auch in der Groß- und Kleinschreibung. Mit `"Ja".lower() == "ja"` ergäbe der Vergleich `True`.

## Was gibt dieses Programm aus? {#hcs-019}

```python static
age = 15
student = True
print(age >= 18 or student, not student)
```

- [x] `True False`
  > `or` ist wahr, weil `student` wahr ist, und `not student` ergibt `False`.
- [ ] `False False`
  > `age >= 18` ist zwar falsch, aber `or` braucht nur eine wahre Seite, und `student` ist wahr.
- [ ] `True True`
  > `not` dreht den Wert von `student` um, aus `True` wird also `False`.
- [ ] `False True`
  > Beide Teile sind vertauscht: Für `or` genügt die wahre Seite `student`, und `not student` ist falsch.

> `age >= 18` ist falsch, `student` ist wahr, und für `or` genügt eine wahre Seite, also `True`. `not student` dreht `True` um und ergibt `False`.

## Welche Bedingungen sind wahr, wenn `number = 12` ist? (Mehrere richtige Antworten möglich.) {#hcs-020}

- [x] `number % 2 == 0`
  > 12 lässt sich ohne Rest durch 2 teilen, der Rest ist also 0.
- [ ] `number > 12`
  > 12 ist nicht größer als 12; wahr wäre `number >= 12`.
- [x] `10 < number and number < 20`
  > 12 liegt zwischen 10 und 20, beide Vergleiche sind wahr und damit auch `and`.
- [ ] `not number == 12`
  > `number == 12` ist wahr, und `not` macht daraus `False`.
- [x] `number in [4, 8, 12]`
  > 12 steht in der Liste, deshalb ist `in` wahr.

> 12 lässt sich ohne Rest durch 2 teilen, liegt zwischen 10 und 20 und steht in der Liste. Größer als sich selbst ist 12 nicht, und `not` dreht den wahren Vergleich `number == 12` in `False` um.

## Was gibt dieses Programm aus? {#hcs-021}

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
  > 25 ist mindestens 10, also läuft der erste Block, und die übrigen Bedingungen prüft Python nicht mehr.
- [ ] `warm`
  > `warm` käme nur heraus, wenn die Abfrage `temperature >= 20` zuerst stünde.
- [ ] `mild` und darunter `warm`
  > Aus einer Kette von `if`, `elif` und `else` läuft immer nur ein Block.
- [ ] `kalt`
  > `else` läuft nur, wenn keine Bedingung wahr ist, hier ist aber schon die erste wahr.

> Python nimmt die erste Bedingung, die wahr ist, und 25 ist mindestens 10. Die übrigen Bedingungen prüft es danach nicht mehr, deshalb gehört bei Bereichen die Abfrage mit dem höchsten Wert nach oben.

## Was gibt dieses Programm aus? {#hcs-022}

```python static
answer = "nein"

if answer == "ja" or "j":
    print("Zugestimmt.")
else:
    print("Abgelehnt.")
```

- [x] `Zugestimmt.`
  > Rechts vom `or` steht der Text `"j"`, und ein Text, der nicht leer ist, gilt als wahr, die Bedingung ist also immer erfüllt.
- [ ] `Abgelehnt.`
  > Das wäre die Absicht, aber die Bedingung ist anders gebaut, als sie sich liest.
- [ ] Eine Fehlermeldung
  > Die Bedingung ist gültiges Python, sie bedeutet nur etwas anderes, als sie sich liest.
- [ ] Gar nichts
  > Ist die Bedingung falsch, läuft der `else`-Block, eine Ausgabe gibt es also in jedem Fall.

> Python liest die Bedingung als `(answer == "ja") or "j"`. Rechts vom `or` steht kein Vergleich, sondern der Text `"j"`, und ein Text, der nicht leer ist, gilt als wahr. Richtig wäre `answer == "ja" or answer == "j"` oder `answer in ["ja", "j"]`.

## Was gibt dieses Programm aus? {#hcs-023}

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
  > 8 ist nicht größer als 10, aber größer als 5, und bei 20 beendet schon das erste `return` die Funktion.
- [ ] `mittel mittel`
  > Bei 20 ist schon die erste Bedingung wahr, und `return` beendet die Funktion, bevor die zweite geprüft wird.
- [ ] `klein groß`
  > Die letzte Zeile der Funktion erreicht nur eine Zahl, für die keine der beiden Bedingungen wahr ist.
- [ ] `groß mittel`
  > Die Reihenfolge der Ausgabe folgt den Aufrufen, zuerst `size(8)` und dann `size(20)`.

> 8 ist nicht größer als 10, aber größer als 5, also liefert `size(8)` den Text `"mittel"`. Bei 20 ist die erste Bedingung wahr, und `return` beendet die Funktion sofort mit `"groß"`.
