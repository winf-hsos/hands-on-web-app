---
type: lesson
code: 5525
title: Schleifen mit while
summary: >-
  Eine while-Schleife wiederholt ihren Rumpf, solange eine Bedingung gilt,
  auch wenn vorher niemand weiß, wie viele Runden es werden. Du lernst, wie du
  eine Endlosschleife erkennst und anhältst und wie ein Programm so lange
  fragt, bis eine Eingabe passt.
objectives:
  intro: "In dieser Lektion lernst du die while-Schleife kennen und kannst danach:"
  goals:
    - "eine `while`-Schleife schreiben, die läuft, solange eine Bedingung gilt, und vorhersagen, wie viele Runden sie dreht"
    - "mit einer `while`-Schleife ausrechnen, wie viele Schritte bis zu einem Ziel nötig sind, etwa bis sich ein Sparbetrag verdoppelt hat"
    - "erklären, warum eine Schleife endlos läuft, wenn der Rumpf ihre Bedingung nie falsch macht, und ein solches Programm mit „Stopp“ anhalten"
    - "mit `while True` und `break` so lange nach einer Eingabe fragen, bis sie gültig ist"
    - "begründen, wann `for` und wann `while` die passende Schleife ist"
level: 1
duration: 20
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-for-loops]
  see_also: [programming-principles]
status: published
updated: 2026-11-01
---

Die [[python-for-loops|for-Schleife]] weiß von Anfang an, wie viele Runden
sie dreht: so viele, wie die Liste Elemente hat oder `range()` Zahlen liefert.
In den [[programming-principles|Grundideen]] gab es aber noch eine zweite Art
von Schleife, die läuft, **solange eine Bedingung gilt**, wie das Rühren eines
Teigs, das erst aufhört, wenn keine Klümpchen mehr da sind. Wie viele Runden
das dauert, weiß vorher niemand, und genau dafür hat Python die
`while`-Schleife.

## Solange eine Bedingung gilt

```python
count = 3

while count > 0:
    print(count)
    count = count - 1

print("Los!")
```

Nach `while` steht eine Bedingung, wie du sie von `if` kennst
([[python-conditions]]), dann folgen ein Doppelpunkt und der eingerückte
Rumpf. Vor jeder Runde prüft Python die Bedingung: Ist sie wahr, läuft der
Rumpf einmal, und danach geht es zurück nach oben zur nächsten Prüfung; ist
sie falsch, macht das Programm hinter der Schleife weiter. Hier zählt der
Rumpf `count` in jeder Runde um eins herunter, nach der dritten Runde ist
`count` gleich 0, die Bedingung `count > 0` gilt nicht mehr, und es geht mit
`print("Los!")` weiter.

Ist die Bedingung schon bei der ersten Prüfung falsch, läuft der Rumpf kein
einziges Mal. Setz zum Ausprobieren `count = 0` an den Anfang.

## Wenn niemand weiß, wie viele Runden es werden

Für einen Countdown hättest du auch `range()` nehmen können. Eine
`while`-Schleife lohnt sich dort, wo sich die Zahl der Runden erst beim
Rechnen ergibt, etwa bei der Frage, wie viele Jahre es dauert, bis sich ein
Sparbetrag bei 5 Prozent Zinsen verdoppelt hat:

```python
amount = 1000
years = 0

while amount < 2000:
    amount = amount * 1.05
    years += 1

print(f"Nach {years} Jahren sind es {amount:.2f} Euro.")
```

Die Schleife schreibt Jahr für Jahr die Zinsen gut, zählt dabei mit und hört
in dem Jahr auf, in dem der Betrag zum ersten Mal 2000 Euro erreicht. Ändere
den Faktor auf `1.02` oder `1.10`, und die Schleife dreht ohne jede weitere
Änderung so viele Runden, wie es braucht.

Dasselbe Muster beantwortet die Frage, wie oft du eine Zahl halbieren kannst,
bis sie kleiner als 1 ist:

```python
number = 100
halvings = 0

while number >= 1:
    number = number / 2
    halvings += 1
    print(number)

print(f"{halvings}-mal halbiert.")
```

## Die Endlosschleife

Auf mancher Shampooflasche steht „Auftragen, ausspülen, wiederholen“, und
wer das wörtlich nimmt, kommt nie wieder aus der Dusche. Einer
`while`-Schleife geht es genauso, wenn ihr Rumpf nichts ändert, was die
Bedingung irgendwann falsch macht. Lösch im Countdown oben die Zeile
`count = count - 1` und führ den Code aus: `count` bleibt 3, `count > 0` gilt
für immer, und die Ausgabe füllt sich mit Dreien.

Ein Programm, das nicht aufhört, hältst du hier mit der Schaltfläche
**Stopp** an, die an der Stelle von **Ausführen** steht, solange ein Programm
läuft. Danach holt **Zurücksetzen** den ursprünglichen Code zurück. Auf
deinem eigenen Rechner bricht [[python-on-the-command-line|im Terminal]] die
Tastenkombination Strg+C ein solches Programm ab.

Nicht jede Endlosschleife ist so leicht zu sehen. Im Sparbeispiel ändert sich
`amount` zwar in jeder Runde, aber mit dem Faktor `1.00`, also 0 Prozent
Zinsen, bleibt der Betrag trotzdem bei 1000, und das Ziel ist nie erreicht.
Bevor du eine `while`-Schleife schreibst, frag dich deshalb, was im Rumpf die
Bedingung ihrem Ende näherbringt und ob das in jedem Fall geschieht.

## Fragen, bis die Antwort passt

Eine häufige Aufgabe für `while` ist eine Eingabe, die nur bestimmte Werte
haben darf. Das Programm soll so lange fragen, bis jemand eine positive Zahl
eintippt, und wie oft das sein wird, weiß es vorher nicht. Am klarsten
schreibst du das mit `while True` und `break`:

```python
while True:
    number = int(input("Gib eine positive Zahl ein: "))
    if number > 0:
        break
    print("Die Zahl muss größer als 0 sein, versuch es noch einmal.")

print(f"Danke, mit {number} geht es weiter.")
```

`while True` ist eine Schleife, deren Bedingung immer gilt, also eine gewollte
Endlosschleife. Beendet wird sie von innen: `break` verlässt die Schleife
sofort, und das Programm macht hinter ihr weiter. So steht die Frage nur
einmal im Programm, am Anfang des Rumpfs, und die Prüfung direkt darunter.
Tipp zuerst `-3` und dann `0` ein, bevor du eine passende Zahl wählst.
`break` beendet übrigens auch eine `for`-Schleife, bevor ihre Liste zu Ende
ist.

## for oder while?

Beide Schleifen wiederholen ihren Rumpf, und jede `for`-Schleife ließe sich
auch mit `while` schreiben:

```python
for number in range(1, 4):
    print(f"for: {number}")

number = 1
while number < 4:
    print(f"while: {number}")
    number += 1
```

Beide geben 1, 2 und 3 aus, aber die `while`-Fassung muss sich selbst um drei
Dinge kümmern, die `for` von allein erledigt: einen Anfangswert, eine
Bedingung und eine Zeile, die weiterzählt, und wer die letzte vergisst, hat
eine Endlosschleife. Daraus ergibt sich eine einfache Regel: Gehst du durch
eine Liste, einen Text oder eine bekannte Zahl von Runden, nimm `for`; hängt
das Ende von etwas ab, das sich erst in der Schleife zeigt, etwa von einem
wachsenden Betrag oder von einer Eingabe, nimm `while`.

## Was noch fehlt

Das Programm, das nach einer positiven Zahl fragt, hat noch eine Lücke: Tippt
jemand `zwölf` statt `12`, kommt die Schleife gar nicht bis zur Prüfung, denn
schon `int("zwölf")` bricht das Programm mit einem `ValueError` ab. Probier es
im Kasten oben aus. Wie du eine solche Meldung liest, zeigt
[[python-error-messages]], und wie ein Programm den Fehler abfängt und einfach
noch einmal fragt, folgt mit [[python-exceptions]] in Teil 4 dieses Pfads.

## Zum Mitnehmen

- `while bedingung:` wiederholt den Rumpf, solange die Bedingung gilt, und
  prüft sie vor jeder Runde; ist sie schon zu Anfang falsch, läuft der Rumpf
  gar nicht.
- `while` passt, wenn sich die Zahl der Runden erst beim Rechnen oder durch
  Eingaben ergibt.
- Ändert der Rumpf nichts, was die Bedingung irgendwann falsch macht, läuft
  die Schleife endlos; auf dieser Seite hält **Stopp** sie an, im Terminal
  Strg+C.
- `while True` mit `break` fragt so lange nach, bis eine Eingabe gültig ist.
- Für Listen, Texte und eine feste Zahl von Runden ist `for` einfacher und
  sicherer.
