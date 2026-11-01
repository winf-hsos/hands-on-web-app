---
type: lesson
code: 4291
title: Fehler abfangen mit try und except
summary: >-
  Mit try und except fängt dein Programm einen Fehler ab, statt abzubrechen,
  etwa wenn jemand ein Wort eintippt, wo eine Zahl stehen soll. Du schreibst
  eine Funktion, die so lange fragt, bis eine gültige Zahl kommt.
objectives:
  intro: "In dieser Lektion lernst du, Fehler mit `try` und `except` abzufangen, und kannst danach:"
  goals:
    - "eine Eingabe mit `try` und `except ValueError` umwandeln, sodass eine ungültige Eingabe das Programm nicht beendet"
    - "begründen, warum du hinter `except` die erwartete Ausnahme nennst und nicht alle Fehler abfängst"
    - "mit `else` den Code, der nur bei Erfolg laufen soll, aus dem `try`-Block heraushalten"
    - "eine Funktion `get_int(prompt)` schreiben, die mit `while True` so lange fragt, bis eine ganze Zahl eingegeben wird"
    - "in einer eigenen Funktion mit `raise ValueError(...)` einen ungültigen Wert zurückweisen"
level: 1
duration: 25
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-error-messages, python-while-loops]
status: draft
updated: 2026-11-01
---

In [[python-working-with-text]] bricht das Programm mit einem `ValueError` ab,
sobald jemand bei `int(input(...))` etwas eintippt, das keine ganze Zahl ist,
und dort stand, dass du später lernst, wie man damit umgeht. Jetzt ist es so
weit: Einen solchen Fehler kannst du nicht verhindern, denn was jemand
eintippt, liegt nicht in deiner Hand, aber du kannst ihn **abfangen**: Python
versucht etwas, und wenn es schiefgeht, führt es statt des Abbruchs einen
Plan B aus. Ein Fehler, der beim Ausführen auftritt, heißt in Python
**Ausnahme** (*exception*), und `ValueError`, `ZeroDivisionError` und die
anderen aus [[python-error-messages]] sind solche Ausnahmen.

## try und except

Probier dieses Programm zweimal aus, einmal mit `19` und einmal mit `zwölf`:

```python
try:
    age = int(input("Wie alt bist du? "))
    print(f"Nächstes Jahr bist du {age + 1}.")
except ValueError:
    print("Das war keine ganze Zahl.")
```

Python führt den eingerückten Block unter `try` aus. Läuft er ohne Fehler
durch, überspringt es den `except`-Block. Löst dagegen eine Zeile im
`try`-Block einen `ValueError` aus, bricht Python den Block an dieser Stelle
ab, die restlichen Zeilen darin entfallen, und es geht im `except`-Block
weiter. Das Programm endet danach normal, ohne Fehlermeldung.

## Die erwartete Ausnahme nennen

Man kann `except` auch ohne Namen schreiben, dann fängt es jeden Fehler ab.
Das klingt bequem, verdeckt aber genau die Fehler, die du sehen müsstest. In
diesem Programm steckt ein Tippfehler, `aeg` statt `age`. Gib `19` ein:

```python
try:
    age = int(input("Wie alt bist du? "))
    print(f"Nächstes Jahr bist du {aeg + 1}.")
except:
    print("Das war keine ganze Zahl.")
```

Das Programm behauptet, `19` sei keine ganze Zahl, denn das nackte `except`
hat den `NameError` aus der zweiten Zeile abgefangen und mit der falschen
Erklärung versehen. Schreib `except ValueError:` und führe es noch einmal aus:
Jetzt erscheint der `NameError` mit Zeilennummer, und der Tippfehler ist in
einer Sekunde gefunden.

Nenne deshalb hinter `except` immer die Ausnahme, mit der du rechnest. Dann
behandelt dein Programm den einen Fall, den du vorhergesehen hast, und alles
andere meldet sich weiter so deutlich wie vorher.

## else: was nur bei Erfolg passieren soll

Je weniger im `try`-Block steht, desto genauer weißt du, wo die Ausnahme
herkommt. Code, der nur laufen soll, wenn alles geklappt hat, kommt deshalb in
einen `else`-Block:

```python
try:
    age = int(input("Wie alt bist du? "))
except ValueError:
    print("Das war keine ganze Zahl.")
else:
    print(f"Nächstes Jahr bist du {age + 1}.")
```

Der `else`-Block läuft nur, wenn im `try`-Block keine Ausnahme aufgetreten ist.
Im `try`-Block steht jetzt nur noch die eine Zeile, die wirklich an der
Eingabe scheitern kann.

## So lange fragen, bis die Eingabe passt

Bisher endet das Programm nach einer falschen Eingabe immerhin freundlich,
aber es endet. Besser ist es, noch einmal zu fragen. Mit `while True` aus
[[python-while-loops]] und `try` wird daraus eine Funktion, die du in jedem
Programm verwenden kannst, das eine ganze Zahl braucht:

```python
def get_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Bitte gib eine ganze Zahl ein.")


def main():
    age = get_int("Wie alt bist du? ")
    print(f"Nächstes Jahr bist du {age + 1}.")


main()
```

Tippe zuerst `zwölf`, dann `12.5` und dann `12`. Gelingt die Umwandlung, gibt
`return` die Zahl zurück und beendet damit nicht nur die Schleife, sondern die
ganze Funktion; ein `break` braucht es deshalb nicht. Scheitert sie, gibt der
`except`-Block einen Hinweis aus, und die Schleife beginnt von vorn. `main`
muss sich um falsche Eingaben gar nicht mehr kümmern, denn `get_int` liefert
garantiert eine ganze Zahl.

Damit lässt sich auch die Lücke schließen, die in [[python-while-loops]]
offen blieb: Das Programm, das nach einer positiven Zahl fragt, brach bei
`zwölf` ab, bevor es überhaupt prüfen konnte, ob die Zahl größer als 0 ist.
Mit `try` und `else` fängt die Schleife beide Fälle ab:

```python
while True:
    try:
        number = int(input("Gib eine positive Zahl ein: "))
    except ValueError:
        print("Das war keine ganze Zahl, versuch es noch einmal.")
    else:
        if number > 0:
            break
        print("Die Zahl muss größer als 0 sein, versuch es noch einmal.")

print(f"Danke, mit {number} geht es weiter.")
```

Tippe nacheinander `zwölf`, `-3` und `5` ein. Die Prüfung mit `if` steht im
`else`-Block, weil sie nur dann einen Sinn ergibt, wenn die Umwandlung
gelungen ist.

## Auch andere Ausnahmen lassen sich abfangen

`except` funktioniert mit jeder Ausnahme, zum Beispiel mit dem
`ZeroDivisionError`. Dieses Programm teilt eine Rechnung auf mehrere Personen
auf:

```python
def get_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Bitte gib eine ganze Zahl ein.")


def main():
    total = get_int("Wie viel Euro kostet die Pizza? ")
    people = get_int("Wie viele Personen teilen sich die Rechnung? ")
    try:
        share = total / people
    except ZeroDivisionError:
        print("Auf null Personen lässt sich nichts aufteilen.")
    else:
        print(f"Jede Person zahlt {share:.2f} Euro.")


main()
```

Gib bei der zweiten Frage einmal `0` ein. Genauso gut könntest du hier vorher
mit `if people == 0:` prüfen, wie in [[python-if-else]]. Lässt sich der
Problemfall mit einer einfachen Bedingung beschreiben, ist eine Prüfung vorab
oft leichter zu lesen. Bei `int(input(...))` geht das nicht so einfach, denn
welche Texte eine gültige Zahl ergeben, weiß erst `int()` selbst, und dort ist
`try` der richtige Weg.

## Wann du nicht abfangen solltest

Abfangen lohnt sich für Fehler, die von außen kommen und auf die dein
Programm sinnvoll reagieren kann: eine Eingabe, die keine Zahl ist, oder eine
Null, durch die geteilt werden soll. Ein Fehler im eigenen Code dagegen, ein
falsch geschriebener Name, ein Text, der mit einer Zahl addiert wird, eine
Position, die es in der Liste nie geben kann, soll sichtbar bleiben. Fängst du
ihn ab, läuft das Programm mit einem falschen Ergebnis weiter, und du suchst
den Fehler später an einer ganz anderen Stelle. Die Fehlermeldung ist in
diesem Fall keine Störung, sondern die schnellste Hilfe, die du bekommen
kannst.

## Selbst eine Ausnahme auslösen

Auch deine eigenen Funktionen können eine Ausnahme melden, wenn sie mit einem
Wert aufgerufen werden, mit dem sie nicht arbeiten können. Dafür gibt es
`raise`:

```python
def split_bill(total, people):
    if people < 1:
        raise ValueError("Es muss mindestens eine Person sein.")
    return total / people


print(split_bill(30, 3))
print(split_bill(30, 0))
```

Der erste Aufruf liefert `10.0`, der zweite bricht mit einem `ValueError` und
deinem eigenen Text als Grund ab. So erfährt, wer die Funktion falsch aufruft,
sofort, was nicht stimmt, statt später ein unsinniges Ergebnis zu bekommen.
Wer die Funktion verwendet, kann den `ValueError` dann wie jeden anderen mit
`try` und `except` abfangen.

## Zum Mitnehmen

- `try` versucht einen Block; tritt darin die genannte Ausnahme auf, geht es im
  `except`-Block weiter, statt dass das Programm abbricht.
- Nenne hinter `except` immer die erwartete Ausnahme, etwa `ValueError`, damit
  Fehler im eigenen Code sichtbar bleiben.
- In den `try`-Block gehört nur, was scheitern kann; was danach bei Erfolg
  folgen soll, kommt in `else`.
- `while True` mit `try` und `return` fragt so lange, bis eine gültige Eingabe
  kommt.
- Mit `raise ValueError("…")` weist eine eigene Funktion einen ungültigen
  Wert zurück.
