---
type: lesson
code: 6513
title: Vergleiche und Wahrheitswerte
summary: >-
  Bevor ein Programm entscheiden kann, muss es eine Frage stellen, die sich
  mit ja oder nein beantworten lässt. In Python ist die Antwort ein eigener
  Wert, True oder False, und Vergleiche, and, or und not liefern ihn.
objectives:
  intro: "In dieser Lektion lernst du, wie Python Ja-Nein-Fragen stellt, und kannst danach:"
  goals:
    - "die Wahrheitswerte `True` und `False` als Werte vom Typ `bool` erkennen"
    - "Zahlen und Texte mit `==`, `!=`, `<`, `<=`, `>` und `>=` vergleichen und `=` von `==` unterscheiden"
    - "Texte unabhängig von Groß- und Kleinschreibung vergleichen, indem du sie vorher mit `lower()` angleichst"
    - "mehrere Bedingungen mit `and`, `or` und `not` verbinden und mit `in` prüfen, ob ein Wert in einer Liste oder ein Text in einem anderen steht"
    - "eine Funktion schreiben, die mit `return` einen Wahrheitswert zurückgibt, etwa `is_even(number)`"
level: 1
duration: 20
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-arithmetic, python-lists]
  see_also: [programming-principles]
status: draft
updated: 2026-11-01
---

In den [[programming-principles|Grundideen]] hast du den Türsteher
kennengelernt, der jedem Gast dieselbe Frage stellt: Bist du mindestens 18?
Eine solche Bedingung lässt sich immer mit ja oder nein beantworten, und erst
wenn die Antwort feststeht, kann ein Programm einen von zwei Wegen gehen.
Bevor es in der nächsten Lektion ums Entscheiden geht, lernst du hier, wie
Python solche Fragen stellt. Eine Antwort darauf hast du übrigens schon
gesehen: `in` hat dir bei den [[python-lists|Listen]] `True` oder `False`
geliefert.

## Wahr oder falsch: der Typ bool

Neben Zahlen und Texten kennt Python eine dritte Art einfacher Werte, die
**Wahrheitswerte**. Davon gibt es genau zwei, `True` für wahr und `False` für
falsch, und ihr Typ heißt `bool`, nach dem Mathematiker George Boole:

```python
print(True)
print(type(True))

door_open = False
print(door_open)
```

`True` und `False` stehen ohne Anführungszeichen und beginnen mit einem
Großbuchstaben. `"True"` in Anführungszeichen wäre ein Text, und `true`
kleingeschrieben kennt Python nicht. Einen Wahrheitswert kannst du wie jeden
anderen Wert in einer Variablen ablegen.

## Vergleichen

Meist schreibst du `True` und `False` nicht selbst hin, sondern lässt sie von
einem **Vergleich** ausrechnen. Der Türsteher fragt nach dem Alter:

```python
age = 17

print(age >= 18)
print(age < 18)
print(age == 17)
print(age != 17)
```

Jeder Vergleich ist eine Ja-Nein-Frage, und Python beantwortet sie mit einem
Wahrheitswert. Diese sechs Vergleiche gibt es:

| Zeichen | Frage | Beispiel mit `age = 17` |
|---|---|---|
| `==` | gleich? | `age == 17` ist `True` |
| `!=` | ungleich? | `age != 17` ist `False` |
| `<` | kleiner? | `age < 18` ist `True` |
| `<=` | kleiner oder gleich? | `age <= 16` ist `False` |
| `>` | größer? | `age > 12` ist `True` |
| `>=` | größer oder gleich? | `age >= 18` ist `False` |

Das Ergebnis eines Vergleichs ist ein Wert wie jeder andere, du kannst es also
auch einer Variablen geben und später verwenden:

```python
age = 17
adult = age >= 18
print(adult)
```

## `=` ist nicht `==`

Ein einfaches Gleichheitszeichen kennst du schon: `age = 17` **weist zu**, es
gibt dem Namen `age` den Wert 17. Das doppelte Gleichheitszeichen **fragt**,
ob zwei Werte gleich sind, und verändert dabei nichts:

```python
age = 17

print(age == 18)
print(age)
```

Die Frage `age == 18` wird mit `False` beantwortet, und `age` ist danach
immer noch 17. Liest du Code laut, hilft es, `=` als „bekommt“ und `==` als
„ist gleich?“ zu sprechen.

Vorsicht beim Vergleich mit Eingaben: `input()` liefert immer einen Text, und
ein Text ist nie gleich einer Zahl, auch wenn dieselben Ziffern darin stehen.

```python
print("18" == 18)
print(int("18") == 18)
```

## Texte vergleichen

Zwei Texte sind gleich, wenn sie Zeichen für Zeichen übereinstimmen, und
dabei zählt auch die Groß- und Kleinschreibung. Tippe hier einmal `ja`, dann
`Ja` und dann `  JA ` mit Leerzeichen ein:

```python
answer = input("Hast du ein Ticket? ")

print(answer == "ja")
print(answer.strip().lower() == "ja")
```

Für Python sind `"Ja"` und `"ja"` verschiedene Texte. Wer eine Antwort
prüfen will, gleicht sie deshalb vorher an: `strip()` entfernt die
Leerzeichen am Rand, `lower()` macht alle Buchstaben klein, so wie du es von
den [[python-working-with-text|Texten]] kennst. Danach genügt ein einziger
Vergleich mit `"ja"`, ganz gleich, wie jemand die Antwort getippt hat.

## and, or und not

Oft hängt eine Entscheidung an mehr als einer Frage. Der Türsteher lässt nur
herein, wer mindestens 18 ist **und** auf der Gästeliste steht. Ins
Schwimmbad kommt kostenlos, wer jünger als 6 ist **oder** Geburtstag hat.
Python verbindet solche Bedingungen mit `and` und `or`:

```python
age = 20
on_list = True
print(age >= 18 and on_list)

age = 4
birthday = False
print(age < 6 or birthday)
```

`and` ergibt nur dann `True`, wenn beide Seiten wahr sind. `or` ergibt
`True`, sobald mindestens eine Seite wahr ist, also auch, wenn es beide sind.
Und `not` dreht einen Wahrheitswert um:

```python
raining = False
print(not raining)
print(not raining and 15 > 10)
```

Kommen `and` und `or` in einer Bedingung zusammen, rechnet Python das `and`
zuerst, so wie Punkt vor Strich. Setz in solchen Fällen runde Klammern, dann
ist für dich und für Python klar, was zusammengehört.

Für einen Bereich gibt es eine kurze Schreibweise. Ob jemand ein Teenager
ist, also mindestens 13 und jünger als 20, kannst du mit `and` fragen oder
beide Vergleiche aneinanderhängen, wie man es aus der Mathematik kennt:

```python
age = 15
print(age >= 13 and age < 20)
print(13 <= age < 20)
```

## in: kommt es darin vor?

`in` kennst du von den Listen: Es fragt, ob ein Wert in einer Liste steht, und
liefert ebenfalls einen Wahrheitswert. Mit `not in` fragst du das Gegenteil,
und bei Texten prüft `in`, ob ein Text in einem anderen vorkommt:

```python
guests = ["Ada", "Alan", "Grace"]

print("Ada" in guests)
print("Linus" in guests)
print("Linus" not in guests)
print("nan" in "Banane")
```

## Eine Funktion, die mit ja oder nein antwortet

Eine Funktion kann einen Wahrheitswert genauso zurückgeben wie eine Zahl
oder einen Text. Ob eine Zahl gerade ist, verrät dir `%` aus dem
[[python-arithmetic|Rechnen]]: Dann ist der Rest beim Teilen durch 2 null.

```python
def is_even(number):
    return number % 2 == 0


print(is_even(4))
print(is_even(7))
```

Python rechnet zuerst `number % 2`, vergleicht das Ergebnis mit 0 und gibt
den Wahrheitswert mit `return` zurück. Solche Funktionen heißen gern
`is_…` oder `has_…`, weil sich ihr Aufruf dann wie eine Frage liest:
`is_even(4)` heißt „ist 4 gerade?“.

Bisher gibt das Programm die Antworten nur aus. Wie es auf eine Antwort
reagiert und je nach Ergebnis etwas anderes ausführt, lernst du in der
nächsten Lektion, [[python-if-else]].

## Zum Mitnehmen

- `True` und `False` sind die beiden Wahrheitswerte, ihr Typ heißt `bool`.
- Die Vergleiche `==`, `!=`, `<`, `<=`, `>` und `>=` liefern einen
  Wahrheitswert; `=` weist zu, `==` fragt nach Gleichheit.
- Texte müssen Zeichen für Zeichen übereinstimmen, auch in der Groß- und
  Kleinschreibung; `strip()` und `lower()` gleichen eine Eingabe vorher an.
- `and` braucht zwei wahre Seiten, `or` mindestens eine, und `not` dreht um;
  `in` fragt, ob etwas in einer Liste oder einem Text vorkommt.
- Eine Funktion wie `is_even(number)` kann einen Wahrheitswert mit `return`
  zurückgeben.
