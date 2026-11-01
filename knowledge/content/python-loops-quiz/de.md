---
type: quiz
code: 8623
title: "Quiz: Schleifen"
summary: Acht Fragen zu for- und while-Schleifen, range(), Sammelvariablen, Endlosschleifen und enumerate().
objectives:
  intro: "Mit diesem Quiz prüfst du in acht Fragen, ob du Folgendes kannst:"
  goals:
    - "vorhersagen, welche Zahlen `range()` mit einem, zwei oder drei Argumenten liefert und wie oft eine Schleife darüber läuft"
    - "das Ergebnis einer Sammelvariablen ausrechnen und erkennen, warum sie vor der Schleife ihren Anfangswert bekommt"
    - "Runden und Endwert einer `while`-Schleife vorhersagen und erkennen, welche Schleife nie aufhört"
    - "begründen, wann `while` die passende Schleife ist, und vorhersagen, was `enumerate()` mit `start=1` liefert"
level: 1
duration: 10
topics: [programming-with-python]
modules: [dup]
relations:
  checks: [python-for-loops, python-while-loops]
status: draft
updated: 2026-11-01
---

## Was gibt dieses Programm aus?

```python static
for number in range(2, 10, 3):
    print(number)
```

- [x] 2, 5 und 8, jede Zahl auf einer eigenen Zeile
  > Die Folge beginnt bei 2 und geht in Dreierschritten weiter, bis die
  > nächste Zahl, 11, die Grenze 10 erreichen würde.
- [ ] 2, 5, 8 und 11
  > Das Ende gehört bei `range()` nie dazu, und 11 liegt sogar darüber.
- [ ] 3, 6 und 9
  > Das erste Argument ist der Anfang, die Folge beginnt also bei 2 und nicht
  > beim ersten Vielfachen von 3.
- [ ] 2, 3, 4, 5, 6, 7, 8 und 9
  > Das dritte Argument ist die Schrittweite, hier 3.

> `range(anfang, ende, schritt)` beginnt bei `anfang`, zählt in Schritten
> von `schritt` und hört vor `ende` auf: 2, 5, 8.

## Wie oft gibt `for i in range(5): print("Hallo")` den Gruß aus?

- [ ] Viermal
  > `range(5)` liefert 0, 1, 2, 3 und 4, das sind fünf Zahlen.
- [x] Fünfmal
  > Die Zahlen 0 bis 4 ergeben fünf Runden.
- [ ] Sechsmal
  > Die 5 selbst gehört nicht dazu, die Folge endet vorher.

> Mit einem Argument beginnt `range()` bei 0 und endet vor der Zahl, und
> deshalb liefert `range(5)` genau fünf Zahlen und die Schleife fünf Runden.

## Was gibt dieses Programm aus?

```python static
total = 0
for number in [4, 7, 1, 8]:
    if number > 3:
        total += number
print(total)
```

- [ ] `20`
  > Das wäre die Summe aller Zahlen, aber die 1 erfüllt die Bedingung nicht.
- [x] `19`
  > 4 + 7 + 8 = 19, denn nur diese drei Zahlen sind größer als 3.
- [ ] `3`
  > So viele Zahlen erfüllen die Bedingung, aber `total += number` zählt die
  > Werte zusammen und nicht die Treffer.
- [ ] `8`
  > Das ist die letzte Zahl, die dazukam, aber `total` sammelt alle
  > passenden Werte ein.

> Die Sammelvariable beginnt bei 0, und in jeder Runde, in der die Zahl
> größer als 3 ist, kommt sie dazu: 4, dann 11, dann 19.

## Jemand will die Preise addieren und erhält `3.5`. Warum?

```python static
for price in [2.5, 1.0, 3.5]:
    total = 0
    total += price
print(total)
```

- [ ] `print()` steht an der falschen Stelle und müsste eingerückt sein.
  > Dann erschiene in jeder Runde ein Wert, aber jeder wäre nur der gerade
  > aktuelle Preis.
- [x] `total = 0` steht im Rumpf und setzt die Summe in jeder Runde zurück.
  > Richtig: Die Zeile gehört vor die Schleife, dann ergibt sich `7.0`.
- [ ] Bei Kommazahlen rechnet `+=` nicht zuverlässig.
  > `+=` addiert Kommazahlen genauso wie ganze Zahlen.

> Eine Sammelvariable bekommt ihren Anfangswert **vor** der Schleife. Im
> Rumpf wird sie in jeder Runde wieder auf 0 gesetzt, und am Ende hält sie
> nur noch den letzten Preis.

## Was gibt dieses Programm aus?

```python static
number = 100
rounds = 0
while number > 10:
    number = number // 2
    rounds += 1
print(rounds, number)
```

- [x] `4 6`
  > 100 wird zu 50, 25, 12 und 6, und bei 6 ist die Bedingung `number > 10`
  > nicht mehr erfüllt.
- [ ] `3 12`
  > Nach drei Runden ist `number` 12 und damit noch größer als 10, also läuft
  > eine weitere Runde.
- [ ] `4 6.25`
  > `//` teilt ganzzahlig, aus 25 wird deshalb 12 und nicht 12.5.
- [ ] `5 3`
  > Vor der fünften Runde ist `number` schon 6, und die Schleife endet.

> Die Bedingung wird vor jeder Runde geprüft: 100, 50, 25 und 12 sind größer
> als 10, 6 nicht mehr. Das ergibt vier Runden und den Endwert 6.

## Welche dieser Schleifen hören nie auf, wenn `count` vorher 0 ist? (mehrere richtig)

- [x] `while count < 3: print(count)`
  > Der Rumpf gibt nur aus und ändert `count` nie.
- [ ] `while count < 3: count += 1`
  > Nach drei Runden ist `count` gleich 3, und die Schleife endet.
- [x] `while count < 3: count -= 1`
  > `count` wird immer kleiner und bleibt deshalb für immer unter 3.
- [ ] `while count > 3: count += 1`
  > Die Bedingung ist schon bei der ersten Prüfung falsch, der Rumpf läuft
  > kein einziges Mal.

> Eine `while`-Schleife endet nur, wenn ihr Rumpf die Bedingung irgendwann
> falsch macht. Hält ein Programm im Browser nicht an, beendet die
> Schaltfläche **Stopp** es.

## Für welche Aufgaben ist `while` die passende Schleife? (mehrere richtig)

- [ ] Jeden Einkauf einer Liste auf eine eigene Zeile schreiben
  > Die Liste gibt die Runden vor, das ist ein Fall für `for`.
- [x] So lange nach dem Alter fragen, bis eine Zahl über 0 eingegeben wird
  > Wie viele Versuche es braucht, zeigt sich erst beim Fragen.
- [ ] Die Zahlen von 1 bis 10 ausgeben
  > Die Zahl der Runden steht fest, `for` mit `range(1, 11)` ist einfacher.
- [x] Ausrechnen, nach wie vielen Jahren sich ein Sparbetrag verdoppelt hat
  > Die Zahl der Jahre ist gerade das, was die Schleife herausfinden soll.

> `for` passt, wenn eine Liste, ein Text oder eine feste Zahl von Runden den
> Ablauf vorgibt, `while`, wenn sich das Ende erst in der Schleife zeigt.

## Was gibt dieses Programm aus?

```python static
for number, item in enumerate(["Milch", "Brot"], start=1):
    print(number, item)
```

- [ ] `0 Milch` und `1 Brot`
  > So zählt `enumerate()` ohne `start=1`, wie der Index ab 0.
- [x] `1 Milch` und `2 Brot`
  > Mit `start=1` beginnt die Nummer bei 1.
- [ ] `Milch 1` und `Brot 2`
  > `enumerate()` liefert zuerst die Nummer und dann das Element, und in
  > dieser Reihenfolge stehen sie auch in `print()`.

> `enumerate()` liefert in jeder Runde die Nummer und das Element, die
> Schleife verteilt sie auf `number` und `item`, und `start=1` lässt die
> Zählung bei 1 beginnen.
