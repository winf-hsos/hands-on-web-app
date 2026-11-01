---
type: lesson
code: 4828
title: Fehlermeldungen lesen
summary: >-
  Eine Fehlermeldung verrät dir, welcher Fehler in welcher Zeile passiert ist,
  wenn du sie von unten nach oben liest. Du lernst die häufigsten Fehler
  kennen und findest auch solche, bei denen Python gar nichts meldet.
objectives:
  intro: "In dieser Lektion lernst du, Fehlermeldungen zu lesen und Fehler gezielt zu suchen, und kannst danach:"
  goals:
    - "eine Fehlermeldung von unten nach oben lesen und darin Art, Grund und Zeile des Fehlers finden"
    - "`SyntaxError`, `IndentationError`, `NameError`, `TypeError`, `ValueError`, `IndexError` und `ZeroDivisionError` auslösen und ihre typische Ursache nennen"
    - "erklären, warum ein Programm mit einem `SyntaxError` gar nicht erst startet, während die anderen Fehler erst in ihrer Zeile auftreten"
    - "einen Fehler ohne Meldung eingrenzen, indem du Zwischenwerte ausgibst und prüfst, wo das Ergebnis zum ersten Mal vom Erwarteten abweicht"
level: 1
duration: 20
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-functions]
  see_also: [python-first-program, programming-principles]
status: draft
updated: 2026-11-01
---

In [[python-first-program|deinem ersten Programm]] hast du schon zwei
Fehlermeldungen gesehen: einen `SyntaxError`, weil ein Anführungszeichen
fehlte, und einen `NameError`, weil `Print` mit großem P geschrieben war.
Seitdem sind deine Programme länger geworden, sie haben Funktionen, Listen,
Entscheidungen und Schleifen, und entsprechend mehr kann schiefgehen. Diese
Lektion zeigt dir, wie eine Fehlermeldung aufgebaut ist, welche Fehler am
häufigsten vorkommen und wie du einen Fehler findest, wenn Python gar nichts
meldet und nur das Ergebnis nicht stimmt.

## Eine Fehlermeldung von unten nach oben lesen

Dieses Programm rechnet die Steuer auf einen Preis auf und enthält einen
Tippfehler. Führe es aus:

```python
def add_tax(price):
    tax = price * 0.19
    return price + tax


def main():
    total = add_tax(100)
    print(f"Mit Steuer: {totl} Euro")


main()
```

Python bricht ab und gibt diese Meldung aus:

```text
Traceback (most recent call last):
  File "program.py", line 11, in <module>
    main()
    ~~~~^^
  File "program.py", line 8, in main
    print(f"Mit Steuer: {totl} Euro")
                         ^^^^
NameError: name 'totl' is not defined. Did you mean: 'total'?
```

Eine solche Meldung heißt **Traceback**, weil sie den Weg zurückverfolgt, den
Python bis zum Fehler genommen hat. Am meisten erfährst du, wenn du sie von
unten nach oben liest:

1. Die **letzte Zeile** nennt die Art des Fehlers, hier `NameError`, und
   hinter dem Doppelpunkt den Grund: Den Namen `totl` kennt Python nicht.
   Oft hängt Python noch einen Vorschlag an, hier `Did you mean: 'total'?`.
2. Darüber steht, **wo** es passiert ist: in Zeile 8, innerhalb der Funktion
   `main`, und darunter die Zeile selbst. Die Zeichen `^^^^` zeigen auf die
   Stelle, an der Python nicht weiterkam.
3. Ganz oben steht, **woher** der Aufruf kam: aus Zeile 11, in der `main()`
   aufgerufen wird. `<module>` bezeichnet dabei das Programm selbst,
   außerhalb jeder Funktion.

Bei kurzen Programmen genügen meist die letzte Zeile und die Programmzeile
darüber. Die Schritte weiter oben werden wichtig, wenn eine Funktion von
mehreren Stellen aus aufgerufen wird, denn dann verraten sie, welcher Aufruf
den Fehler ausgelöst hat.

## Fehler, bei denen das Programm gar nicht erst startet

Bevor Python die erste Zeile ausführt, liest es den ganzen Text und prüft, ob
er den Regeln der Sprache folgt. Findet es dabei einen Verstoß, meldet es
einen **SyntaxError** und führt keine einzige Zeile aus, auch nicht die, die
vor dem Fehler stehen:

```python
print("Fläche berechnen")


def area(width, height)
    return width * height


print(area(3, 4))
```

Die Meldung lautet `SyntaxError: expected ':'`, und das `^` steht direkt
hinter der Klammer, wo der Doppelpunkt fehlt. Beachte, dass auch
`Fläche berechnen` nicht erscheint, obwohl diese Zeile selbst in Ordnung ist.
Ein fehlendes Anführungszeichen wie in deinem ersten Programm ergibt
ebenfalls einen `SyntaxError`, dort mit dem Grund
`unterminated string literal`, also ein Text, der nie endet.

Ein besonderer Fall ist der **IndentationError**, ein Fehler in der
Einrückung. Nach einem Doppelpunkt erwartet Python einen eingerückten Block,
und hier fehlt er:

```python
def greet(name):
print(f"Hallo {name}!")


greet("Ada")
```

Python meldet `IndentationError: expected an indented block after function
definition on line 1`. Den umgekehrten Fall, eine Zeile, die ohne Grund
eingerückt ist, meldet es als `IndentationError: unexpected indent`.

## Fehler, die erst beim Ausführen auftreten

Alle anderen Fehler bemerkt Python erst, wenn es an der betreffenden Zeile
ankommt. Was davor steht, wird ganz normal ausgeführt, und erst dann bricht das
Programm ab.

Ein **NameError** bedeutet, dass Python einen Namen nicht kennt. Neben
Tippfehlern wie `totl` ist eine häufige Ursache eine Variable, die nur
innerhalb einer Funktion existiert, wie du es in [[python-functions]] gesehen
hast:

```python
def average(numbers):
    result = sum(numbers) / len(numbers)
    return result


average([12.5, 14.0, 9.5])
print(f"Durchschnitt: {result}")
```

`result` gibt es nur in `average`. Die Funktion gibt den Wert zwar mit
`return` zurück, aber der Aufruf in Zeile 6 hebt ihn nirgends auf. Richtig
wäre `result = average([12.5, 14.0, 9.5])`, dann gibt es auch außerhalb der
Funktion eine Variable `result`.

Ein **TypeError** entsteht, wenn ein Wert den falschen Typ für eine Operation
hat, am häufigsten, wenn Text und Zahl mit `+` verbunden werden:

```python
age = 19
print("Du bist " + age + " Jahre alt.")
```

`TypeError: can only concatenate str (not "int") to str` heißt: An einen
String lässt sich nur ein String hängen, keine ganze Zahl. Ein f-String wie
`f"Du bist {age} Jahre alt."` oder `str(age)` löst das Problem, wie in
[[python-working-with-text]].

Ein **ValueError** ist verwandt, aber feiner: Der Typ stimmt, nur der Wert
passt nicht. `int` nimmt gern einen String entgegen, aber nicht jeden:

```python
number = int("zwölf")
print(number)
```

Die Meldung `invalid literal for int() with base 10: 'zwölf'` sagt, dass sich
dieser Text nicht als ganze Zahl im Zehnersystem lesen lässt. Genau das
passiert, wenn bei `int(input(...))` jemand ein Wort oder `12.5` eintippt.

Ein **IndexError** meldet einen Zugriff auf eine Position, die es in einer
Liste nicht gibt:

```python
shopping = ["Milch", "Brot", "Äpfel"]
print(shopping[3])
```

Die Liste hat die Positionen 0, 1 und 2, und `list index out of range` heißt,
dass 3 außerhalb davon liegt (mehr dazu in [[python-lists]]).

Ein **ZeroDivisionError** schließlich entsteht bei einer Division durch null.
Selten schreibt jemand `10 / 0` hin, aber es passiert leicht, wenn eine Liste
leer ist:

```python
temperatures = []
print(sum(temperatures) / len(temperatures))
```

`len(temperatures)` ist 0, und Python meldet `division by zero`.

## Die häufigsten Fehler auf einen Blick

| Fehler | typische Ursache |
|---|---|
| `SyntaxError` | Doppelpunkt, Klammer oder Anführungszeichen fehlt |
| `IndentationError` | Block nach einem Doppelpunkt nicht eingerückt, oder eine Zeile zu viel eingerückt |
| `NameError` | Name falsch geschrieben, Groß- und Kleinschreibung vertauscht, oder Variable gibt es nur in einer Funktion |
| `TypeError` | Text und Zahl mit `+` verbunden, oder ein Wert vom falschen Typ an eine Funktion gegeben |
| `ValueError` | Text, der keine Zahl ist, an `int()` oder `float()` gegeben |
| `IndexError` | Position außerhalb der Liste, oft eins zu weit, weil die Zählung bei 0 beginnt |
| `ZeroDivisionError` | durch null geteilt, oft durch `len()` einer leeren Liste |

## Wenn das Ergebnis einfach falsch ist

Die unangenehmsten Fehler melden sich gar nicht. Das Programm läuft durch,
aber es rechnet etwas anderes, als du gemeint hast. Diese Funktion soll eine
Temperatur von Fahrenheit in Celsius umrechnen, und 212 Grad Fahrenheit, der
Siedepunkt von Wasser, sollten 100 Grad Celsius ergeben:

```python
def to_celsius(fahrenheit):
    return fahrenheit - 32 * 5 / 9


print(to_celsius(212))
```

Heraus kommt `194.22222222222223`. Hier hilft dasselbe Vorgehen wie bei einem
Kuchen, der nicht aufgegangen ist, das du aus den
[[programming-principles|Grundideen]] kennst: nicht alles neu schreiben,
sondern Schritt für Schritt prüfen, wo das Ergebnis zum ersten Mal anders ist
als erwartet. Dafür gibst du die **Zwischenwerte** mit `print` aus:

```python
fahrenheit = 212
print("fahrenheit - 32 ergibt", fahrenheit - 32)
print("32 * 5 / 9 ergibt", 32 * 5 / 9)
print("alles zusammen ergibt", fahrenheit - 32 * 5 / 9)
```

Der erste Zwischenwert stimmt, `180` ist der richtige Abstand zum
Gefrierpunkt. Der zweite zeigt aber, dass Python zuerst `32 * 5 / 9`
ausgerechnet und das Ergebnis dann von 212 abgezogen hat, denn Punktrechnung
geht vor Strichrechnung ([[python-arithmetic]]). Mit Klammern,
`(fahrenheit - 32) * 5 / 9`, rechnet die Funktion richtig. Sobald der Fehler
gefunden ist, nimmst du die zusätzlichen `print`-Zeilen wieder heraus.

Ein zweites Mittel klingt seltsam, hilft aber erstaunlich oft: Erkläre dein
Programm Zeile für Zeile laut, jemand anderem oder notfalls einer
Quietscheente auf dem Schreibtisch. Unter Programmierern heißt das
**Rubber-Duck-Debugging**. Wer jede Zeile in Worte fassen muss, merkt dabei
oft selbst, an welcher Stelle der Code etwas anderes sagt, als man gemeint
hat.

> [!TIP]
> Ändere immer nur eine Sache und führe das Programm danach erneut aus. Wenn
> du mehrere Stellen auf einmal änderst, weißt du hinterher nicht, welche
> Änderung geholfen hat, und manchmal baust du dabei einen neuen Fehler ein.

## Zum Mitnehmen

- Eine Fehlermeldung liest du von unten nach oben: Die letzte Zeile nennt Art
  und Grund, darüber stehen Zeile und Funktion, ganz oben der erste Aufruf.
- Ein `SyntaxError` oder `IndentationError` verhindert, dass auch nur eine
  Zeile läuft; alle anderen Fehler treten erst in ihrer Zeile auf.
- `NameError` heißt unbekannter Name, `TypeError` falscher Typ, `ValueError`
  falscher Wert beim richtigen Typ.
- `IndexError` und `ZeroDivisionError` entstehen oft durch eine Liste, die
  kürzer oder leerer ist als gedacht.
- Fehler ohne Meldung findest du, indem du Zwischenwerte ausgibst und
  prüfst, wo das Ergebnis zum ersten Mal vom Erwarteten abweicht.
