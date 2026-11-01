---
type: lesson
code: 5197
title: Schleifen mit for
summary: >-
  Eine for-Schleife nimmt sich die Elemente einer Liste eins nach dem anderen
  vor und führt für jedes dieselben Zeilen aus. Damit rechnest du jede
  Temperatur um, summierst und zählst, baust neue Listen auf und läufst über
  Zahlenfolgen und Texte.
objectives:
  intro: "In dieser Lektion lernst du die for-Schleife kennen und kannst danach:"
  goals:
    - "mit `for` jedes Element einer Liste nacheinander bearbeiten und an der Einrückung erkennen, welche Zeilen zur Schleife gehören"
    - "mit einer Sammelvariablen, die vor der Schleife bei 0 beginnt, Werte aufsummieren und mit einem `if` im Rumpf zählen, wie viele Elemente eine Bedingung erfüllen"
    - "in einer Schleife mit `append()` aus einer Liste eine neue aufbauen"
    - "mit `range()` und einem, zwei oder drei Argumenten Zahlenfolgen erzeugen und vorhersagen, welche Zahl als letzte kommt"
    - "über die Zeichen eines Textes laufen und mit `enumerate()` die Elemente einer Liste nummeriert ausgeben, beginnend bei 1"
level: 1
duration: 25
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-lists, python-if-else]
  see_also: [programming-principles]
status: draft
updated: 2026-11-01
---

Am Ende der Lektion über [[python-lists|Listen]] blieb eine Frage offen: Wie
fängst du mit **jedem** Element einer Liste etwas Eigenes an, etwa jede
Temperatur in Fahrenheit umrechnen oder jeden Einkauf auf eine eigene Zeile
schreiben? Mit dem, was du bisher kennst, bräuchtest du für jedes Element eine
eigene Zeile, und sobald die Liste länger würde, müsstest du das Programm
ändern. Eine **Schleife** schreibt den Schritt nur einmal auf und wiederholt
ihn für jedes Element, so wie du in den [[programming-principles|Grundideen]]
jede Zwiebel im Netz geschält hast, eine nach der anderen, bis das Netz leer
war.

## Für jedes Element einer Liste

Die `for`-Schleife liest sich fast wie ein Satz: für jeden Einkauf in der
Einkaufsliste, schreib ihn auf eine eigene Zeile.

```python
shopping = ["Milch", "Brot", "Äpfel", "Käse"]

for item in shopping:
    print(f"- {item}")
```

Die Zeile beginnt mit `for`, dann folgen ein Name, das Wort `in`, die Liste
und ein Doppelpunkt. Alles, was darunter eingerückt ist, gehört zur Schleife
und heißt ihr **Rumpf**; wie bei [[python-functions|eigenen Funktionen]] zeigt
allein die Einrückung, wo er endet. Python führt den Rumpf für jedes Element
einmal aus, hier also viermal, und `item` steht dabei jedes Mal für das
nächste Element der Liste.

Der Rumpf darf auch mehrere Zeilen haben. Hier rechnet er jede Temperatur in
Fahrenheit um, und die letzte Zeile ist nicht eingerückt, gehört also nicht
mehr zur Schleife und läuft erst danach, ein einziges Mal:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]

for celsius in temperatures:
    fahrenheit = celsius * 9 / 5 + 32
    print(f"{celsius} °C sind {fahrenheit:.1f} °F")

print("Alle Werte umgerechnet.")
```

Rück die letzte Zeile probeweise ein und führ den Code noch einmal aus: Dann
erscheint der Satz nach jeder Temperatur, weil er jetzt zum Rumpf gehört.

## Die Schleifenvariable

Der Name zwischen `for` und `in` heißt **Schleifenvariable**. Sie ist eine
ganz normale Variable, die vor jeder Runde das nächste Element zugewiesen
bekommt, und ihren Namen wählst du selbst. Üblich ist die Einzahl dessen, was
die Liste in der Mehrzahl hält, also `for item in shopping`,
`for celsius in temperatures` oder `for name in names`. Python wäre auch mit
`for x in temperatures` zufrieden, aber wer das Programm liest, versteht
`celsius` sofort.

Nach der Schleife behält die Variable den Wert aus der letzten Runde:

```python
names = ["Ada", "Alan", "Grace"]

for name in names:
    print(f"Hallo {name}!")

print(f"Zuletzt begrüßt: {name}")
```

## Aufsummieren

`sum()` addiert alle Werte einer Liste auf einmal. Wie das im Inneren abläuft,
kannst du mit einer Schleife selbst schreiben, und dieses Muster brauchst du
immer dann, wenn es keine fertige Funktion gibt. Vor der Schleife legst du
eine Variable an, die bei 0 beginnt, und in jeder Runde kommt das aktuelle
Element dazu:

```python
prices = [2.49, 1.19, 3.99, 0.89]
total = 0

for price in prices:
    total += price
    print(f"+ {price:.2f} macht {total:.2f}")

print(f"Summe: {total:.2f} Euro")
```

Eine solche Variable heißt **Sammelvariable** (englisch *accumulator*), weil
sie Runde für Runde das Ergebnis einsammelt. `total += price` ist die
Kurzform von `total = total + price` aus der Lektion über das
[[python-arithmetic|Rechnen]]. Wichtig ist, dass `total = 0` **vor** der
Schleife steht: Im Rumpf würde die Variable in jeder Runde wieder auf 0
gesetzt, und am Ende stünde nur der letzte Preis darin.

## Zählen mit einer Bedingung

Eine Sammelvariable kann auch zählen. Statt den Wert dazuzunehmen, zählt sie
bei jedem passenden Element um eins hoch, und welches Element passt,
entscheidet ein `if` im Rumpf, wie du es aus [[python-if-else]] kennst:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]
warm_days = 0

for celsius in temperatures:
    if celsius > 13:
        warm_days += 1

print(f"{warm_days} von {len(temperatures)} Tagen waren wärmer als 13 Grad.")
```

Achte auf die zwei Stufen der Einrückung: Das `if` gehört zur Schleife, und
`warm_days += 1` gehört zum `if` und läuft deshalb nur in den Runden, in denen
die Bedingung gilt.

## Eine neue Liste aufbauen

Oft soll aus einer Liste eine neue entstehen, etwa eine Liste aller
Temperaturen in Fahrenheit, mit der das Programm weiterrechnen kann. Dann
beginnt die Sammelvariable nicht bei 0, sondern als leere Liste, und
`append()` hängt in jeder Runde ein Element an:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]
fahrenheit = []

for celsius in temperatures:
    fahrenheit.append(round(celsius * 9 / 5 + 32, 1))

print(fahrenheit)
print(f"Höchstens {max(fahrenheit)} °F")
```

Die neue Liste ist ein ganz normaler Wert, mit dem das Programm weiterarbeiten
kann, hier etwa mit `max()`. Steht das `append()` in einem `if`, übernimmt
die Schleife nur einen Teil der Elemente; probier aus, nur die Werte über 13
Grad in die neue Liste zu schreiben.

## Zahlenfolgen mit range()

Manchmal gibt es gar keine Liste, sondern nur eine Zahl von Runden, etwa wenn
ein Programm das Einmaleins der 7 ausgeben soll. Dafür erzeugt `range()` eine
Folge ganzer Zahlen, über die die Schleife läuft:

```python
for number in range(1, 11):
    print(f"{number} × 7 = {number * 7}")
```

`range(1, 11)` beginnt bei 1 und hört **vor** der 11 auf, so wie auch der
Index einer Liste nie ihre Länge erreicht. Das ist anfangs ungewohnt, hat aber
einen Vorteil: Wie viele Zahlen herauskommen, ist einfach die Differenz, hier
11 − 1 = 10. Mit einem, zwei oder drei Argumenten ergibt `range()` diese
Folgen:

```python
print(list(range(5)))
print(list(range(2, 6)))
print(list(range(0, 20, 5)))
print(list(range(10, 0, -2)))
```

Mit einem Argument beginnt die Folge bei 0 und endet vor der Zahl, sodass
`range(5)` genau fünf Zahlen liefert. Mit zwei Argumenten gibst du Anfang und
Ende vor, und ein drittes ist die Schrittweite, die auch negativ sein darf, um
rückwärts zu zählen. `list()` macht aus der Folge eine Liste, damit `print()`
alle Zahlen auf einmal zeigt; in einer Schleife ist das nicht nötig.

## Die Zeichen eines Textes

Ein Text ist für die Schleife eine Folge von Zeichen, und `for` nimmt sie
sich eins nach dem anderen vor:

```python
word = "Avocado"

for letter in word:
    print(letter)
```

Zusammen mit einer Sammelvariablen und einem `if` zählt die Schleife zum
Beispiel die Vokale eines Wortes. `in` prüft bei einem Text, ob ein Zeichen
darin vorkommt, und `lower()` sorgt dafür, dass auch das große A am Anfang
mitzählt:

```python
word = "Avocado"
vowels = 0

for letter in word.lower():
    if letter in "aeiouäöü":
        vowels += 1

print(f"{word} hat {vowels} Vokale.")
```

## Nummeriert mit enumerate()

Für eine Ausgabe wie „Tag 1“, „Tag 2“ brauchst du zu jedem Element auch seine
Nummer. `enumerate()` liefert in jeder Runde beides, die Nummer und das
Element, und die Schleife nimmt sie in zwei Variablen entgegen:

```python
temperatures = [12.5, 14.0, 9.5, 16.0, 13.5]

for day, celsius in enumerate(temperatures, start=1):
    print(f"Tag {day}: {celsius} Grad")
```

Ohne `start=1` beginnt die Zählung wie der Index bei 0. Die Reihenfolge der
beiden Variablen ist fest: zuerst die Nummer, dann das Element.

## Zum Mitnehmen

- `for element in liste:` führt den eingerückten Rumpf für jedes Element
  einmal aus; die Schleifenvariable hält dabei das aktuelle Element und heißt
  am besten wie die Einzahl der Liste.
- Eine Sammelvariable beginnt vor der Schleife bei 0 oder als leere Liste und
  sammelt im Rumpf mit `+=` oder `append()` das Ergebnis ein.
- Ein `if` im Rumpf zählt oder übernimmt nur die Elemente, die eine Bedingung
  erfüllen.
- `range(ende)`, `range(anfang, ende)` und `range(anfang, ende, schritt)`
  erzeugen ganze Zahlen, und das Ende gehört nie dazu.
- Über einen Text läuft die Schleife Zeichen für Zeichen, und
  `enumerate(liste, start=1)` liefert zu jedem Element seine Nummer.
