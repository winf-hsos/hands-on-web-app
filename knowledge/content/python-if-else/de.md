---
type: lesson
code: 7132
title: Entscheidungen mit if, elif und else
summary: >-
  Mit if führt ein Programm einen Block nur aus, wenn eine Bedingung wahr ist,
  mit else geht es sonst einen anderen Weg, und mit elif wählt es aus mehreren
  Wegen den ersten, dessen Bedingung zutrifft.
objectives:
  intro: "In dieser Lektion lernst du, wie ein Programm Entscheidungen trifft, und kannst danach:"
  goals:
    - "mit `if`, Doppelpunkt und eingerücktem Block Code nur dann ausführen, wenn eine Bedingung wahr ist, und mit `else` einen zweiten Weg angeben"
    - "mit `elif` aus mehreren Wegen wählen und begründen, warum dabei die Reihenfolge der Bedingungen zählt"
    - "verschachtelte Abfragen mit `and` zu einer Bedingung zusammenfassen, wo das möglich ist"
    - "in einer Funktion je nach Fall mit mehreren `return` verschiedene Ergebnisse zurückgeben"
    - "die typischen Fehler erkennen und beheben: `=` statt `==`, einen fehlenden Doppelpunkt und `answer == \"ja\" or \"j\"`"
level: 1
duration: 25
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-conditions, python-functions]
  see_also: [programming-principles]
status: draft
updated: 2026-11-01
---

Mit [[python-conditions|Vergleichen]] kann dein Programm jetzt Fragen stellen,
die Python mit `True` oder `False` beantwortet. Bisher hat es die Antwort
aber nur ausgegeben. In dieser Lektion reagiert es darauf und geht, wie der
Türsteher aus den [[programming-principles|Grundideen]], je nach Antwort den
einen oder den anderen Weg.

## if: nur wenn die Bedingung wahr ist

```python
age = int(input("Wie alt bist du? "))

if age >= 18:
    print("Herzlich willkommen!")

print("Bis bald.")
```

Die Zeile mit `if` besteht aus dem Wort `if`, einer Bedingung und einem
Doppelpunkt. Alles, was darunter eingerückt ist, führt Python nur aus, wenn
die Bedingung wahr ist; das kennst du schon von
[[python-functions|Funktionen]], und auch hier sind vier Leerzeichen üblich.
Die letzte Zeile ist nicht eingerückt und gehört deshalb nicht mehr dazu, sie
läuft in jedem Fall. Probier es mit 20 und mit 15 aus.

## else: der andere Weg

Bei 15 sagt das Programm oben nur „Bis bald.“, und der Gast erfährt nicht,
warum er draußen bleibt. Mit `else` schreibst du den zweiten Weg dazu:

```python
age = int(input("Wie alt bist du? "))

if age >= 18:
    print("Herzlich willkommen!")
else:
    print("Leider erst ab 18.")
```

`else` steht auf derselben Höhe wie das `if`, hat selbst keine Bedingung und
endet ebenfalls mit einem Doppelpunkt. Von den beiden Blöcken führt Python
immer genau einen aus: den unter `if`, wenn die Bedingung wahr ist, sonst den
unter `else`.

## elif: mehr als zwei Wege

Eine Ampel hat drei Farben, und wie in den Grundideen fragt das Programm
eine nach der anderen ab. Dafür gibt es `elif`, kurz für *else if*, also
„sonst, wenn“:

```python
light = "yellow"

if light == "red":
    print("Anhalten.")
elif light == "yellow":
    print("Abbremsen.")
else:
    print("Fahren.")
```

Python prüft die Bedingungen von oben nach unten und führt den Block der
**ersten** aus, die wahr ist. Alle weiteren überspringt es, und nur wenn
keine zutrifft, kommt der Block unter `else` an die Reihe. Ändere `light` auf
`"red"` und auf `"green"` und sieh nach, welcher Block jeweils läuft.

Weil die erste wahre Bedingung gewinnt, kommt es auf die Reihenfolge an. Hier
bekommt eine Temperatur ein Wort:

```python
temperature = 25

if temperature >= 30:
    print("heiß")
elif temperature >= 20:
    print("warm")
elif temperature >= 10:
    print("mild")
else:
    print("kalt")
```

Bei 25 Grad ist die erste Bedingung falsch, die zweite wahr, und das Programm
gibt „warm“ aus. Dass 25 auch mindestens 10 ist, spielt keine Rolle mehr,
denn nach dem ersten Treffer ist die Entscheidung gefallen. Deshalb muss die
zweite Bedingung auch nicht `temperature >= 20 and temperature < 30` lauten:
Wer so weit kommt, ist schon unter 30. Dreh die Reihenfolge um, und das
Programm liegt daneben:

```python
temperature = 35

if temperature >= 10:
    print("mild")
elif temperature >= 20:
    print("warm")
elif temperature >= 30:
    print("heiß")
else:
    print("kalt")
```

35 ist mindestens 10, also gewinnt gleich die erste Bedingung, und die
Abfragen für „warm“ und „heiß“ kommen nie zum Zug. Bei Bereichen fängst du
deshalb an einem Ende an, beim höchsten oder beim niedrigsten Wert, und
arbeitest dich zum anderen vor.

## Verbinden statt verschachteln

In einem `if`-Block darf wieder ein `if` stehen. Der Türsteher, der Alter und
Gästeliste prüft, ließe sich so schreiben:

```python
age = 20
on_list = True

if age >= 18:
    if on_list:
        print("Herein!")
```

Weil beide Fragen nur zusammen zum Einlass führen, ist eine Bedingung mit
`and` kürzer und leichter zu lesen:

```python
age = 20
on_list = True

if age >= 18 and on_list:
    print("Herein!")
```

Bei `if on_list:` fällt außerdem auf, dass kein `== True` dasteht. Das ist
auch nicht nötig, denn `on_list` ist schon ein Wahrheitswert. Verschachteln
lohnt sich erst, wenn jede Frage ihre eigene Antwort braucht, etwa „Leider
erst ab 18.“ für die Jüngeren und „Du stehst nicht auf der Liste.“ für die
anderen.

## Entscheidungen in Funktionen

Eine Entscheidung steckt oft in einer Funktion, die je nach Fall ein anderes
Ergebnis zurückgibt. Jeder Weg bekommt dann sein eigenes `return`:

```python
def temperature_word(temperature):
    if temperature >= 30:
        return "heiß"
    elif temperature >= 20:
        return "warm"
    elif temperature >= 10:
        return "mild"
    else:
        return "kalt"


print(temperature_word(25))
print(temperature_word(3))
```

Da `return` die Funktion sofort beendet, kommt Python nach einem Treffer gar
nicht mehr zu den Zeilen darunter. Deshalb siehst du dieselbe Entscheidung
oft auch ohne `elif` und `else` geschrieben, mit dem letzten Fall ganz unten:

```python
def describe_number(number):
    if number < 0:
        return "negativ"
    if number == 0:
        return "null"
    return "positiv"


print(describe_number(-3))
print(describe_number(0))
print(describe_number(8))
```

Beide Schreibweisen sind richtig. Wichtig ist nur, dass jeder Weg durch die
Funktion bei einem `return` ankommt, sonst liefert sie in diesem Fall `None`.

## Typische Fehler

Der häufigste Fehler ist ein einfaches Gleichheitszeichen in der Bedingung.
`=` weist zu und fragt nichts, deshalb lehnt Python die Zeile ab und schlägt
selbst `==` vor:

```python
answer = "ja"

if answer = "ja":
    print("Prima.")
```

Fehlt der Doppelpunkt am Ende der `if`-Zeile, meldet Python
`SyntaxError: expected ':'` und zeigt mit einem Pfeil auf die Stelle, an der
er hingehört.

Tückischer ist ein Fehler, für den es keine Meldung gibt. Wer „ja“ oder
kurz „j“ als Zustimmung gelten lassen will, schreibt leicht Folgendes:

```python
answer = "nein"

if answer == "ja" or "j":
    print("Du hast zugestimmt.")
else:
    print("Du hast abgelehnt.")
```

Obwohl die Antwort „nein“ ist, stimmt das Programm zu. Python liest die
Bedingung nämlich als `(answer == "ja") or "j"`, und auf der rechten Seite
steht kein Vergleich, sondern nur der Text `"j"`. Ein Text, der nicht leer
ist, gilt in einer Bedingung als wahr, und damit ist die ganze Bedingung
immer wahr. Richtig ist, jede Seite als eigenen Vergleich zu schreiben, oder
gleich `in` mit einer Liste zu verwenden:

```python
answer = "nein"

if answer == "ja" or answer == "j":
    print("Du hast zugestimmt.")
else:
    print("Du hast abgelehnt.")

if answer in ["ja", "j"]:
    print("Auch hier: zugestimmt.")
else:
    print("Auch hier: abgelehnt.")
```

## Was noch fehlt

Dein Programm kann jetzt je nach Eingabe verschiedene Wege gehen, aber jede
Entscheidung fällt genau einmal. Tippt jemand bei einer Ja-Nein-Frage etwas
ganz anderes, möchtest du noch einmal fragen, bis eine gültige Antwort kommt,
und bei einer Liste von Temperaturen möchtest du für **jede** ein Wort
ausgeben. Dafür muss ein Teil des Programms wiederholt laufen, und das
übernehmen Schleifen, die in Teil 3 dieses Pfads mit [[python-for-loops]]
beginnen.

## Zum Mitnehmen

- `if bedingung:` führt den eingerückten Block darunter nur aus, wenn die
  Bedingung wahr ist; `else:` gibt den Weg für alle anderen Fälle an.
- Mit `elif` gibt es beliebig viele Wege, und Python nimmt den ersten, dessen
  Bedingung wahr ist; die Reihenfolge zählt.
- Zwei Fragen, die nur zusammen gelten, verbindest du mit `and`, statt zwei
  `if` ineinander zu schachteln.
- In einer Funktion kann jeder Weg ein eigenes `return` haben, und jeder Weg
  sollte bei einem ankommen.
- In der Bedingung steht `==`, nicht `=`, die Zeile endet mit einem
  Doppelpunkt, und `answer == "ja" or "j"` ist immer wahr.
