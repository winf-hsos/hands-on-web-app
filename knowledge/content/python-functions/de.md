---
type: lesson
code: 9028
title: Eigene Funktionen
summary: >-
  Mit def gibst du einem Stück Programm einen Namen und rufst es auf, so oft du
  willst. Parameter geben ihm Werte mit, return gibt ein Ergebnis zurück, und
  ein Programm aus kleinen Funktionen ist leichter zu verstehen.
objectives:
  intro: "In dieser Lektion lernst du, eigene Funktionen zu schreiben, und kannst danach:"
  goals:
    - "eine Funktion mit `def` anlegen und erklären, warum sie erst beim Aufruf etwas bewirkt"
    - "einer Funktion über Parameter Werte mitgeben, in derselben Reihenfolge wie in der Klammer"
    - "mit `return` ein Ergebnis zurückgeben, den Unterschied zu `print()` erklären und begründen, warum eine Funktion ohne `return` `None` liefert"
    - "erklären, warum eine Variable, die in einer Funktion entsteht, außerhalb davon einen `NameError` auslöst"
    - "ein Programm aus einer Funktion `main` und kleinen Funktionen mit je einer Aufgabe aufbauen"
level: 1
duration: 25
topics: [programming-with-python, solving-problems]
modules: [dup]
relations:
  requires: [python-working-with-text, python-arithmetic]
  see_also: [problem-decomposition]
status: published
updated: 2026-11-01
---

`print`, `input`, `len` und `round` sind Funktionen, die Python mitbringt. Du
kannst aber auch eigene schreiben. Eine Funktion ist ein Stück Programm mit
einem Namen: Du schreibst es einmal und rufst es dann überall auf, wo du es
brauchst. Das spart Wiederholungen, und es hilft beim Denken, weil du eine
große Aufgabe in kleine, benannte Schritte zerlegen kannst.

## Eine Funktion definieren und aufrufen

```python
def greet():
    print("Hallo!")
    print("Schön, dass du da bist.")


greet()
greet()
```

Die erste Zeile beginnt mit `def` (für *define*), dann kommen der Name, ein
Paar runde Klammern und ein Doppelpunkt. Alles, was darunter **eingerückt**
ist, gehört zur Funktion. Python verlangt diese Einrückung, und üblich sind
vier Leerzeichen; im Editor hier rückt die Tab-Taste genau so weit ein, und
nach einem Doppelpunkt rückt Enter von selbst ein.

Wichtig ist der Unterschied zwischen **Definieren** und **Aufrufen**: Der
`def`-Block allein bewirkt noch nichts Sichtbares, er bringt Python nur bei, was
`greet` bedeutet. Erst `greet()` führt den Inhalt aus, und zwar jedes Mal von
Neuem.

## Parameter: der Funktion etwas mitgeben

Meist soll eine Funktion mit Werten arbeiten, die erst beim Aufruf feststehen.
Dafür schreibst du **Parameter** in die Klammern, also Namen, die beim Aufruf
einen Wert bekommen:

```python
def greet(name):
    print(f"Hallo {name}, schön, dass du da bist.")


greet("Ada")
greet("Alan")
```

Beim ersten Aufruf steht `name` innerhalb der Funktion für `"Ada"`, beim
zweiten für `"Alan"`. Mehrere Parameter trennst du durch Kommas, und beim
Aufruf kommen die Werte in derselben Reihenfolge.

## return: ein Ergebnis zurückgeben

Viele Funktionen sollen nichts ausgeben, sondern etwas ausrechnen und das
Ergebnis zurückliefern, damit das Programm damit weiterarbeiten kann. Das
erledigt `return`:

```python
def area(width, height):
    return width * height


kitchen = area(3, 4.5)
bathroom = area(2, 2.5)
print(f"Zusammen {kitchen + bathroom} Quadratmeter.")
```

Sobald Python auf `return` trifft, endet die Funktion, und der Aufruf
`area(3, 4.5)` steht an seiner Stelle für den zurückgegebenen Wert, hier
`13.5`.

Ein häufiger Stolperstein ist der Unterschied zwischen `print` und `return`.
`print` zeigt einen Wert auf dem Bildschirm an, und damit ist er für das
Programm verloren. `return` gibt ihn an die Stelle zurück, von der aus die
Funktion aufgerufen wurde. Probier aus, was hier passiert:

```python
def double_print(number):
    print(number * 2)


def double_return(number):
    return number * 2


a = double_print(4)
b = double_return(4)
print("a ist", a)
print("b ist", b)
```

`double_print` gibt zwar `8` aus, liefert aber nichts zurück, und dieses
Nichts heißt in Python `None`. Faustregel: Eine Funktion, die etwas ausrechnet,
gibt das Ergebnis mit `return` zurück, und ausgegeben wird erst dort, wo das
Programm das Ergebnis zeigen will.

## Was in der Funktion bleibt

Variablen, die innerhalb einer Funktion entstehen, gibt es nur dort. Sie
werden bei jedem Aufruf neu angelegt und verschwinden, wenn die Funktion
endet:

```python
def add_tax(price):
    tax = price * 0.19
    return price + tax


print(add_tax(100))
print(tax)
```

Die letzte Zeile scheitert mit einem `NameError`, weil `tax` außerhalb von
`add_tax` nicht existiert. Das ist gewollt: So kann jede Funktion ihre eigenen
Namen verwenden, ohne mit dem Rest des Programms in die Quere zu kommen. Was
eine Funktion nach außen geben will, gibt sie mit `return` zurück.

## Ein Programm aus Funktionen

Mit Funktionen lässt sich ein ganzes Programm so aufbauen, dass man es von
oben nach unten wie eine Gliederung liest. Üblich ist eine Funktion `main`,
die den Ablauf beschreibt und die Einzelschritte aufruft; ganz unten im
Programm steht dann nur noch der Aufruf von `main`.

```python
def main():
    name = ask_name()
    print(greeting(name))


def ask_name():
    return input("Wie heißt du? ").strip().title()


def greeting(name):
    return f"Hallo {name}, willkommen bei Python!"


main()
```

`main` darf `ask_name` und `greeting` aufrufen, obwohl die beiden weiter unten
stehen, denn Python führt `main` erst in der letzten Zeile aus, und bis dahin
hat es alle Definitionen gelesen. Jede Funktion hat eine einzige, klar
benannte Aufgabe, und wer das Programm verstehen will, liest zuerst `main`.
Das ist dieselbe Idee wie beim Zerlegen eines Problems in Teilprobleme:
[[problem-decomposition]].

## Zum Mitnehmen

- `def name(parameter):` definiert eine Funktion; der eingerückte Block
  darunter ist ihr Inhalt, und erst `name(wert)` führt ihn aus.
- Parameter bekommen beim Aufruf ihre Werte, in der Reihenfolge der Klammer.
- `return` beendet die Funktion und gibt einen Wert zurück; ohne `return`
  liefert sie `None`.
- Variablen in einer Funktion gibt es nur dort.
- Eine Funktion `main` beschreibt den Ablauf, kleine Funktionen erledigen die
  Schritte.
