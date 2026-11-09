---
type: quiz
code: 9132
title: "Quiz: Fehler und Ausnahmen"
summary: Acht Fragen zum Lesen von Fehlermeldungen, zu den häufigsten Fehlern und zum Abfangen mit try und except.
objectives:
  intro: "Mit diesem Quiz prüfst du in acht Fragen, ob du Folgendes kannst:"
  goals:
    - "in einer Fehlermeldung Art und Zeile des Fehlers finden"
    - "vorhersagen, welcher Fehler bei einem Programm auftritt und ob es vorher etwas ausgibt"
    - "`TypeError` und `ValueError` an einem Beispiel unterscheiden"
    - "vorhersagen, was ein Programm mit `try` und `except` bei einer Eingabe ausgibt, und erklären, warum ein `except` ohne Namen Fehler verdeckt"
    - "entscheiden, welche Fehler sich abzufangen lohnt und wie du einen Fehler ohne Meldung suchst"
level: 1
duration: 10
topics: [programming-with-python]
modules: [dup]
relations:
  checks: [python-error-messages, python-exceptions]
questions: [hcs-032, hcs-033, hcs-034, hcs-035, hcs-036, hcs-037, hcs-038, hcs-039]
status: draft
updated: 2026-11-09
---

## In welcher Zeile ist der Fehler passiert, und welcher Art ist er? {#hcs-032}

Ein Programm bricht mit dieser Meldung ab:

```text
Traceback (most recent call last):
  File "program.py", line 9, in <module>
    main()
    ~~~~^^
  File "program.py", line 6, in main
    print(shopping[3])
          ~~~~~~~~^^^
IndexError: list index out of range
```

- [ ] In Zeile 9, ein `IndexError`
  > In Zeile 9 steht nur der Aufruf von `main()`, von dort kam Python zur Stelle des Fehlers, aber der Fehler selbst liegt weiter unten.
- [x] In Zeile 6, ein `IndexError`
  > Die Programmzeile direkt über der letzten Zeile der Meldung ist Zeile 6, und dort fehlt die Position 3.
- [ ] In Zeile 6, ein `NameError`
  > Die Art des Fehlers steht in der letzten Zeile, und dort heißt es `IndexError`.
- [ ] In Zeile 9, ein `SyntaxError`
  > Bei einem `SyntaxError` liefe das Programm gar nicht erst los, hier hat es aber bis Zeile 6 gearbeitet.

> Die letzte Zeile nennt die Art, `IndexError`, und den Grund: Die Position 3 gibt es in der Liste nicht. Die Programmzeile direkt darüber, Zeile 6 in `main`, ist die, in der es passiert ist; Zeile 9 ist nur der Aufruf, der dorthin geführt hat.

## Was erscheint, wenn du dieses Programm ausführst? {#hcs-033}

```python static
print("Start")
for number in [1, 2, 3]
    print(number)
print("Ende")
```

- [ ] `Start`, danach eine Fehlermeldung
  > Bei einem `SyntaxError` läuft auch die erste Zeile nicht, obwohl sie in Ordnung ist.
- [x] Nur eine Fehlermeldung, ein `SyntaxError`
  > Den fehlenden Doppelpunkt bemerkt Python, bevor es irgendeine Zeile ausführt.
- [ ] `Start`, `1`, `2`, `3` und `Ende`
  > Hinter `for number in [1, 2, 3]` fehlt der Doppelpunkt, und deshalb läuft das Programm nicht.
- [ ] `Start` und `Ende`, die Schleife wird übersprungen
  > Python überspringt nichts, was falsch geschrieben ist, sondern lehnt das ganze Programm ab.

> Hinter `for number in [1, 2, 3]` fehlt der Doppelpunkt. Python prüft den ganzen Text, bevor es die erste Zeile ausführt, und meldet deshalb `SyntaxError: expected ':'`, ohne vorher `Start` auszugeben.

## Welchen Fehler meldet `print("Preis: " + 4.5)`? {#hcs-034}

- [x] `TypeError`
  > `+` verbindet einen String nur mit einem String, und `4.5` ist eine Zahl, also passen die Typen nicht.
- [ ] `ValueError`
  > Ein `ValueError` heißt, dass der Typ stimmt und nur der Wert nicht passt, hier passt aber schon der Typ nicht.
- [ ] `SyntaxError`
  > Die Zeile ist richtig geschrieben, der Fehler zeigt sich erst beim Ausführen.
- [ ] `NameError`
  > Der einzige Name in der Zeile ist `print`, und den kennt Python.

> `+` kann einen String nur mit einem String verbinden, und `4.5` ist eine Zahl. Python meldet `TypeError: can only concatenate str (not "float") to str`. Ein f-String wie `f"Preis: {4.5}"` löst das Problem.

## Was liefert `int("12.5")`? {#hcs-035}

- [ ] `12`
  > `int()` rundet einen Text nicht ab. Bei einer Kommazahl, die schon eine Zahl ist, liefert `int(12.5)` tatsächlich `12`, aber hier steht ein Text.
- [ ] `12.5`
  > `int()` liefert immer eine ganze Zahl und nie eine Kommazahl.
- [x] Einen `ValueError`
  > `"12.5"` ist ein String und damit der richtige Typ, stellt aber keine ganze Zahl dar.
- [ ] Einen `TypeError`
  > Der Typ stimmt: `int()` nimmt einen String an, nur dieser Wert passt nicht.

> `int()` kann nur Texte umwandeln, die eine ganze Zahl darstellen. `"12.5"` ist ein String, also der richtige Typ, aber kein passender Wert, und deshalb meldet Python `ValueError: invalid literal for int() with base 10: '12.5'`.

## Was gibt dieses Programm aus, wenn du `19` eintippst? {#hcs-036}

```python static
try:
    age = int(input("Alter? "))
    print(f"Nächstes Jahr: {aeg + 1}")
except:
    print("Keine ganze Zahl.")
```

- [ ] `Nächstes Jahr: 20`
  > `aeg` ist ein Tippfehler für `age`, und der `NameError` verhindert diese Ausgabe.
- [x] `Keine ganze Zahl.`
  > Das `except` ohne Namen fängt den `NameError` ab und gibt die Meldung für eine falsche Eingabe aus, obwohl die Eingabe stimmte.
- [ ] Eine Fehlermeldung mit `NameError`
  > Den `NameError` gibt es, aber das `except` ohne Namen fängt ihn ab, bevor er als Meldung erscheint.
- [ ] Eine Fehlermeldung mit `ValueError`
  > `int("19")` gelingt, einen `ValueError` gibt es also nicht, und abgefangen würde er ebenfalls.

> `int("19")` gelingt, aber in der nächsten Zeile steht der Tippfehler `aeg`, und Python löst einen `NameError` aus. Weil hinter `except` keine Ausnahme genannt ist, fängt es auch diesen Fehler ab und gibt die falsche Erklärung aus. Mit `except ValueError:` würde der `NameError` sichtbar.

## Du tippst nacheinander `zehn`, `10.5` und `10`. Was erscheint? {#hcs-037}

```python static
def get_int(prompt):
    while True:
        try:
            return int(input(prompt))
        except ValueError:
            print("Bitte eine ganze Zahl.")


number = get_int("Zahl? ")
print(number * 2)
```

- [ ] Einmal `Bitte eine ganze Zahl.`, dann `20`
  > Auch `10.5` ist für `int()` keine ganze Zahl.
- [x] Zweimal `Bitte eine ganze Zahl.`, dann `20`
  > `zehn` und `10.5` lösen beide einen `ValueError` aus, und bei `10` liefert `return` die Zahl, die verdoppelt `20` ergibt.
- [ ] Zweimal `Bitte eine ganze Zahl.`, dann `21`
  > Das Programm verdoppelt die Zahl, und `10 * 2` ergibt `20`.
- [ ] Einmal `Bitte eine ganze Zahl.`, dann bricht das Programm bei `10.5` mit einem `ValueError` ab
  > Der `ValueError` bei `10.5` wird genauso abgefangen wie der bei `zehn`, und die Schleife fragt noch einmal.

> `zehn` und `10.5` lösen beide einen `ValueError` aus, der abgefangen wird, und die Schleife fragt jeweils noch einmal. Bei `10` gibt `return` die Zahl zurück und beendet die Funktion, und `10 * 2` ergibt `20`.

## Welche Fehler lohnt es sich abzufangen? (Mehrere richtige Antworten möglich.) {#hcs-038}

- [x] Ein `ValueError`, weil jemand bei `int(input(...))` ein Wort eintippt
  > Eine falsche Eingabe kommt von außen, und das Programm kann sinnvoll reagieren, indem es noch einmal fragt.
- [ ] Ein `NameError`, weil im eigenen Code ein Name falsch geschrieben ist
  > Das ist ein Fehler im Programm selbst. Abgefangen bliebe er unentdeckt, statt mit seiner Zeilennummer gemeldet zu werden.
- [x] Ein `ZeroDivisionError`, weil jemand `0` als Zahl der Personen eingibt
  > Auch die `0` kommt von außen, und das Programm kann um eine andere Zahl bitten.
- [ ] Ein `TypeError`, weil der eigene Code einen Text mit einer Zahl addiert
  > Auch das ist ein Fehler im Programm, den du beheben solltest, statt ihn zu verstecken.

> Abfangen lohnt sich bei Fehlern, die von außen kommen, etwa durch eine Eingabe, und auf die das Programm sinnvoll reagieren kann. Fehler im eigenen Code sollen sichtbar bleiben, damit du sie findest und behebst.

## Ein Programm läuft ohne Meldung, gibt aber ein falsches Ergebnis aus. Was hilft am ehesten als Erstes? {#hcs-039}

- [ ] Das ganze Programm in `try` und `except` setzen
  > Wo keine Ausnahme auftritt, gibt es auch nichts abzufangen.
- [ ] Das Programm von vorn neu schreiben
  > Neu schreiben kostet viel Zeit, und solange du nicht weißt, wo der Fehler liegt, kann er wieder darin stehen.
- [x] Zwischenwerte mit `print` ausgeben und prüfen, wo sie zum ersten Mal vom Erwarteten abweichen
  > Die erste Stelle, an der ein Zwischenwert nicht stimmt, grenzt den Fehler ein.
- [ ] Mehrere Stellen auf einmal ändern und hoffen, dass eine davon hilft
  > Ändert sich danach etwas, weißt du nicht, welche Änderung es war, und neue Fehler kommen leicht hinzu.

> Wie bei einem Kuchen, der nicht aufgegangen ist, prüfst du Schritt für Schritt, wo das Ergebnis zum ersten Mal anders ist als erwartet. Die Stelle, an der ein Zwischenwert nicht mehr stimmt, grenzt den Fehler ein.
