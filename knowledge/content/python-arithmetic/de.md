---
type: lesson
code: 3848
title: Rechnen
summary: >-
  Python als Taschenrechner und mehr: die Rechenzeichen, ganzzahlige Division
  mit Rest, Vorrang und Klammern, Runden und eine kleine Überraschung mit
  Kommazahlen.
objectives:
  intro: "In dieser Lektion lernst du, mit Python zu rechnen, und kannst danach:"
  goals:
    - "mit den Rechenzeichen `+`, `-`, `*`, `/` und `**` rechnen, auch in Kurzformen wie `total += 5`, und wissen, dass `/` immer einen `float` liefert"
    - "mit `//` und `%` eine Menge in ganze Einheiten und einen Rest zerlegen und mit `%` prüfen, ob eine Zahl durch eine andere teilbar ist"
    - "vorhersagen, in welcher Reihenfolge Python eine Rechnung auswertet, und die Reihenfolge mit Klammern selbst festlegen"
    - "mit `round()` einen Wert runden und mit `:.2f` im f-String nur die Ausgabe auf zwei Stellen bringen"
    - "erklären, warum `0.1 + 0.2` nicht genau `0.3` ergibt"
level: 1
duration: 15
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-values-and-variables]
status: draft
updated: 2026-11-01
---

Rechnen ist das, was Computer am schnellsten können, und in Python sieht eine
Rechnung fast so aus wie auf dem Papier. Ein paar Rechenzeichen gibt es aber
nur beim Programmieren, und zwei davon, `//` und `%`, wirst du ständig
brauchen.

## Die Rechenzeichen

```python
print(7 + 3)
print(7 - 3)
print(7 * 3)
print(7 / 3)
print(7 // 3)
print(7 % 3)
print(7 ** 3)
```

| Zeichen | bedeutet | `7 … 3` |
|---|---|---|
| `+` `-` `*` | Plus, Minus, Mal | `10`, `4`, `21` |
| `/` | Geteilt, Ergebnis immer ein `float` | `2.3333333333333335` |
| `//` | Geteilt ohne Rest (ganzzahlige Division) | `2` |
| `%` | Rest dieser Division (Modulo) | `1` |
| `**` | Hoch | `343` |

`//` und `%` gehören zusammen: 7 durch 3 ergibt 2, Rest 1. Damit zerlegst du
eine Menge in ganze Stücke und das, was übrig bleibt, etwa Minuten in Stunden
und Minuten:

```python
minutes = 135
hours = minutes // 60
rest = minutes % 60
print(f"{minutes} Minuten sind {hours} Stunden und {rest} Minuten.")
```

`%` beantwortet außerdem die Frage, ob eine Zahl durch eine andere teilbar ist:
Dann ist der Rest null. Eine Zahl `n` ist zum Beispiel gerade, wenn `n % 2`
null ergibt.

## Punkt vor Strich

Es gelten dieselben Vorrangregeln wie in der Mathematik: `**` zuerst, dann
`*`, `/`, `//` und `%`, zuletzt `+` und `-`. Mit runden Klammern legst du
selbst fest, was zuerst gerechnet wird.

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
```

Klammern schaden auch dort nicht, wo sie nicht nötig wären. Wenn du dir beim
Lesen einer Rechnung nicht sicher bist, setz sie.

## Runden

Eine Division mit `/` liefert oft mehr Nachkommastellen, als jemand lesen
möchte. `round(wert, stellen)` rundet auf die gewünschte Zahl von Stellen:

```python
price = 10 / 3
print(price)
print(round(price, 2))
print(f"{price:.2f} Euro")
```

Die letzte Zeile zeigt eine zweite Möglichkeit: Im f-String rundet `:.2f`
hinter dem Namen die Zahl nur für die Ausgabe auf zwei Stellen, der Wert in
der Variablen bleibt, wie er ist. Für Geldbeträge ist das praktisch, weil es
auch `5.10` mit zwei Stellen schreibt statt `5.1`.

## Eine kleine Überraschung

```python
print(0.1 + 0.2)
```

Das Ergebnis ist nicht genau `0.3`. Der Grund ist kein Fehler in Python:
Computer speichern Kommazahlen als Bits, und viele Dezimalbrüche wie 0,1
lassen sich damit nur sehr genau annähern, aber nicht exakt darstellen, so wie
1/3 im Dezimalsystem nie aufgeht. Für die meisten Rechnungen spielt der winzige
Unterschied keine Rolle; du solltest ihn nur kennen, damit er dich nicht
verwirrt, und Ergebnisse für die Ausgabe runden.

## Rechnen mit Variablen

Natürlich rechnet Python auch mit Variablen, und eine Rechnung, die eine
Variable verändert, lässt sich abkürzen: `total += 5` bedeutet dasselbe wie
`total = total + 5`, und ebenso gibt es `-=`, `*=` und `/=`.

```python
total = 0
total += 4.50
total += 2.20
total += 3.80
print(f"Summe: {total:.2f} Euro")
```

## Zum Mitnehmen

- `+`, `-`, `*`, `/` und `**` rechnen wie gewohnt; `/` liefert immer einen
  `float`.
- `//` teilt ohne Rest, `%` liefert den Rest. Zusammen zerlegen sie eine Menge
  in ganze Einheiten und das, was übrig bleibt.
- Klammern bestimmen die Reihenfolge, sonst gilt Punkt vor Strich.
- `round(x, 2)` rundet den Wert, `f"{x:.2f}"` nur die Ausgabe.
- Kommazahlen sind im Computer Näherungen; für die Ausgabe rundet man sie.
