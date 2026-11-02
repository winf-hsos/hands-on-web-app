---
title: "Eingabe, Verarbeitung, Ausgabe: Das EVA-Modell"
summary: >-
  Du prüfst Kästen, ohne in sie hineinzusehen: einen Test, der nur scheitert,
  wenn er soll, eine Farbregel, die an einer einzigen Messung scheitert,
  eigene Testfälle und eine Kette aus encode() und decode(), deren
  Vereinbarung nicht übereinstimmt.
objectives:
  intro: "In dieser Übung prüfst du Kästen an ihrer Eingabe und ihrer erwarteten Ausgabe und kannst danach:"
  goals:
    - "einen Test aus einer Eingabe und einer erwarteten Ausgabe schreiben, bevor du das Ergebnis kennst, und erkennen, wann ein einzelner Test einen Fehler nicht aufdeckt"
    - "an einer fehlschlagenden Messung erklären, warum die Regel und nicht der Messwert falsch ist, und die Regel reparieren"
    - "eigene Testfälle für eine Entscheidungsregel finden, auch solche, an denen sie scheitert"
    - "in einer Kette aus encode() und decode() den Daten von Grenze zu Grenze folgen und die Vereinbarung finden, die nicht übereinstimmt"
translation_of: en
based_on: 2026-11-02
---

[[input-processing-output-slides|Probleme lösen mit Computern]] hat gezeigt,
dass jedes Stück, das ein Computer lösen kann, eine Eingabe, eine
Verarbeitung und eine Ausgabe hat, und dass eine bekannte Eingabe mit einer
erwarteten Ausgabe einen Test ergibt. In dieser Übung setzt du das an vier
kleinen Kästen ein.

## Schritt 1: Erst die Erwartung

Die Funktion `add()` soll zwei Zahlen addieren. Der Test unten gibt 2 und 3
hinein und sagt, bevor er läuft, was herauskommen muss.

```python
def add(a, b):
    return a + b

expected = 5
actual = add(2, 3)
print("erwartet:", expected, "tatsächlich:", actual)
if actual == expected:
    print("bestanden")
else:
    print("nicht bestanden")
```

Lass den Test laufen. Mach dann aus `a + b` ein `a * b`, sag voraus, was der
Test melden wird, und lass ihn noch einmal laufen. Suche zum Schluss eine
Eingabe, für die `a + b` und `a * b` dasselbe ergeben, sodass dieser Fehler
durchrutschen würde.

> [!HINT]
> Probiere kleine Zahlen, die gleich sind. Bei welcher Zahl ist es dasselbe,
> sie zu sich selbst zu addieren und sie mit sich selbst zu multiplizieren?

> [!SOLUTION]
> Mit `a * b` liefert der Kasten 6 statt 5, und der Test meldet „nicht
> bestanden“, ohne dass du eine Zeile in `add()` gelesen hast. Mit der
> Eingabe 2 und 2 liefern dagegen beide Fassungen 4, und ein Test mit
> `add(2, 2)` und der Erwartung 4 besteht, obwohl der Kasten multipliziert.
> Ein einzelner Test prüft nur die eine Eingabe, die er verwendet, und
> deshalb braucht ein Kasten meist mehrere Tests mit verschiedenen Eingaben.

## Schritt 2: Eine Regel, die an einer Messung scheitert

Ein Farbsensor liefert vier Zahlen, die Stärke des roten, grünen und blauen
Lichts und die Gesamthelligkeit. Die Funktion `classify()` entscheidet aus
diesen Zahlen, welche Farbe die Lampe zeigt. Die Liste `tests` enthält vier
Messungen zusammen mit der Farbe, die wirklich leuchtete, sodass jede Zeile
ein Test ist.

```python
def classify(r, g, b, c):
    if c < 100:
        return "off"
    strongest = max(r, g, b)
    if strongest == r:
        return "red"
    if strongest == g:
        return "green"
    return "blue"

# je vier Messwerte und die Farbe, die wirklich leuchtete
tests = [
    (203, 41, 57, 310, "red"),
    (35, 180, 70, 290, "green"),
    (30, 28, 34, 60, "off"),
    (60, 14, 19, 95, "red"),
]

for r, g, b, c, expected in tests:
    actual = classify(r, g, b, c)
    if actual == expected:
        print(r, g, b, c, "erwartet", expected, "tatsächlich", actual, "bestanden")
    else:
        print(r, g, b, c, "erwartet", expected, "tatsächlich", actual, "nicht bestanden")
```

Lass die Tests laufen und finde den, der scheitert. Erkläre, warum er
scheitert, und ändere die Regel, nicht die Messwerte, sodass alle vier Tests
bestehen.

> [!HINT]
> Vergleiche die Helligkeit `c` der fehlschlagenden Messung mit der Zahl in
> der ersten Zeile der Regel. Denk auch an den dritten Test: Eine Lampe, die
> wirklich aus ist, muss danach weiter als aus gelten.

> [!SOLUTION]
> Der vierte Test scheitert: Die rote Lampe war weiter vom Sensor entfernt,
> ihre Helligkeit von 95 liegt unter der Schwelle von 100, und die Regel
> erklärt sie für aus. Der Messwert stimmt, die Regel passt nicht zur
> Wirklichkeit. Eine Schwelle über 60 und höchstens 95 behebt das, etwa
> `if c < 80:`. Dann bestehen alle vier Tests, obwohl sich kein Messwert
> geändert hat, denn Eingabe und Regel entscheiden gemeinsam, was
> herauskommt.

## Schritt 3: Eigene Testfälle

Hier steht die Regel mit der Schwelle 80. Ergänze die Liste um zwei eigene
Tests: eine blaue Lampe und eine gelbe. Gelbes Licht ist eine Mischung aus
Rot und Grün, der Sensor misst also Rot und Grün etwa gleich stark, zum
Beispiel 180 und 175, und wenig Blau.

```python
def classify(r, g, b, c):
    if c < 80:
        return "off"
    strongest = max(r, g, b)
    if strongest == r:
        return "red"
    if strongest == g:
        return "green"
    return "blue"

tests = [
    (203, 41, 57, 310, "red"),
    (35, 180, 70, 290, "green"),
    (30, 28, 34, 60, "off"),
    (60, 14, 19, 95, "red"),
    # deine Tests: (r, g, b, c, "erwartete Farbe"),
]

for r, g, b, c, expected in tests:
    actual = classify(r, g, b, c)
    if actual == expected:
        print(r, g, b, c, "erwartet", expected, "tatsächlich", actual, "bestanden")
    else:
        print(r, g, b, c, "erwartet", expected, "tatsächlich", actual, "nicht bestanden")
```

Was antwortet die Regel für deine gelbe Lampe, und warum?

> [!HINT]
> Ein Test ist eine weitere Zeile in der Liste, für eine blaue Lampe etwa
> `(30, 50, 190, 260, "blue"),`. Schreib bei Gelb die Farbe hin, die du
> erwartest, also `"yellow"`, und nicht das, was die Regel deiner Meinung
> nach sagen wird.

> [!SOLUTION]
> ```python static
> tests = [
>     (203, 41, 57, 310, "red"),
>     (35, 180, 70, 290, "green"),
>     (30, 28, 34, 60, "off"),
>     (60, 14, 19, 95, "red"),
>     (30, 50, 190, 260, "blue"),
>     (180, 175, 40, 380, "yellow"),
> ]
> ```
>
> Der blaue Test besteht, der gelbe scheitert mit `red`: Die Regel kennt nur
> drei Farben und lässt den stärksten Kanal gewinnen, auch wenn er kaum
> stärker ist als der zweite. Keine Zeile ist kaputt, aber die Regel hat für
> diese Eingabe keine Antwort. Ein Test, der so scheitert, ist ein guter
> Fund, denn er zeigt, was der Regel noch fehlt.

## Schritt 4: Der Fehler an der Grenze

Ein Sender macht mit `encode()` aus Text Farben, und ein Empfänger macht mit
`decode()` aus den Farben wieder Text. Beide schlagen ihre Farben in einer
Tabelle nach: In einem Python-Wörterbuch ist `SENDER["a"]` die Farbe, die der
Sender für den Buchstaben `a` verwendet, und `RECEIVER["blue"]` der
Buchstabe, den der Empfänger für Blau liest.

```python
SENDER = {"h": "red", "i": "green", "a": "blue", "b": "white"}
RECEIVER = {"red": "h", "green": "i", "blue": "b", "white": "a"}

def encode(text):
    colours = []
    for letter in text:
        colours.append(SENDER[letter])
    return colours

def decode(colours):
    text = ""
    for colour in colours:
        text = text + RECEIVER[colour]
    return text

message = "hi"
colours = encode(message)
received = decode(colours)
print("gesendet:", message, "| Licht:", colours, "| empfangen:", received)
if received == message:
    print("bestanden")
else:
    print("nicht bestanden")
```

Lass die Kette mit `"hi"` laufen und danach mit `"ab"`. Folge den Daten mit
Hilfe der ausgegebenen Zeile von Grenze zu Grenze und entscheide, welcher
Kasten falsch ist: `encode()`, `decode()` oder keiner von beiden. Bring die
Kette dann für beide Nachrichten zum Bestehen.

> [!HINT]
> Sieh dir bei `"ab"` das Licht dazwischen an. Welchen Buchstaben meint der
> Sender mit `blue`, und welchen liest der Empfänger dafür?

> [!SOLUTION]
> Mit `"hi"` besteht der Test, mit `"ab"` scheitert er, weil `"ba"`
> ankommt. Beide Funktionen arbeiten genau so, wie sie geschrieben sind:
> `encode()` macht aus `a` Blau, wie seine Tabelle sagt, und `decode()` macht
> aus Blau ein `b`, wie seine eigene Tabelle sagt. Der Fehler liegt in der
> Vereinbarung an der Grenze, denn die beiden Tabellen sind sich bei Blau und
> Weiß nicht einig. Sobald der Empfänger dieselbe Vereinbarung verwendet,
> kommen beide Nachrichten an:
>
> ```python static
> RECEIVER = {"red": "h", "green": "i", "blue": "a", "white": "b"}
> ```

## Für Schnelle

Erweitere `classify()` aus Schritt 3 so, dass dein gelber Test besteht und
alle anderen Tests weiter bestehen. Eine mögliche Regel: Sind Rot und Grün
beide viel stärker als Blau und unterscheiden sich um weniger als 20, ist
die Lampe gelb. Füge danach einen Test hinzu, bei dem deine neue Regel falsch
antwortet, und überlege, ob diese Messung wirklich vorkommen kann.
