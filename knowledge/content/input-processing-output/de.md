---
title: "Eingabe, Verarbeitung, Ausgabe: ein Kasten, den du prüfen kannst"
summary: >-
  Jedes Stück eines Problems, das ein Computer lösen kann, hat eine Eingabe,
  eine Verarbeitung und eine Ausgabe. Klare Ränder geben jedem Stück einen
  eigenen Test, zeigen, wo Stücke übereinstimmen müssen, und führen zu dem
  Kasten, der versagt.
objectives:
  intro: "In dieser Lektion nimmst du die Form aus Eingabe, Verarbeitung und Ausgabe auseinander und kannst danach:"
  goals:
    - "Eingabe, Verarbeitung und Ausgabe eines Teilproblems benennen und aus einer bekannten Eingabe und einer erwarteten Ausgabe einen Test dafür schreiben"
    - "erklären, warum ein Farbsensor vier Zahlen statt einer Farbe liefert und wo die Regel des Programms ins Spiel kommt"
    - "begründen, warum Kästen in einer Kette an jeder Grenze eine Vereinbarung brauchen, und einen Fehler finden, indem du den Daten von Grenze zu Grenze folgst"
    - "Kästen in einer Reihe (Datenfluss) von Kästen in einem Kasten (Zerlegung) unterscheiden und die Ebene wählen, die sich prüfen lässt"
    - "die beiden Fragen jedes Kastens, wie er arbeitet und wie seine Daten dargestellt sind, den Programmen und der Darstellung zuordnen"
translation_of: en
based_on: 2026-11-01
---

Denk an das Bestellterminal in einem Schnellrestaurant. Du tippst ein paar
Bilder an und bezahlst, und wenig später steht ein Tablett bereit, während
die Küche dazwischen unsichtbar bleibt. Du musst sie nicht sehen, denn du
weißt, was du hineingibst und was herauskommen soll, und liegt das falsche
Essen auf dem Tablett, weißt du auch, dass zwischen diesen beiden Rändern
etwas schiefgegangen ist. Die [[programming-principles|Grundideen des
Programmierens]] haben diese Form am Pfandautomaten als Eingabe,
Verarbeitung und Ausgabe vorgestellt. Diese Lektion setzt sie ein, denn klare
Ränder erlauben dir, ein Stück eines Problems zu prüfen, Stücke miteinander
zu verbinden und das Stück zu finden, das versagt.

## Ein Kasten, den du prüfen kannst

Angenommen, ein kleines Stück Code namens `add()` soll 2 und 3 addieren. Die
beiden Zahlen sind die **Eingabe**, die Arbeit in `add()` ist die
**Verarbeitung**, und das Ergebnis ist die **Ausgabe**; zusammen kürzt man
sie nach den englischen Wörtern input, processing und output mit **IPO** ab,
auf Deutsch auch mit EVA. Noch bevor der Code läuft, kannst
du sagen, was herauskommen soll, nämlich 5, und damit ist ein Test
geschrieben: Eingabe hineingeben, Verarbeitung laufen lassen und die
tatsächliche Ausgabe mit der erwarteten vergleichen.

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

Der Test ist bestanden. Mach aus `a + b` ein `a * b` und lass ihn noch
einmal laufen: 2 mal 3 ist 6, und der Test fällt durch. Um das zu
entscheiden, musstest du keine einzige Zeile in `add()` lesen, denn die
Ränder des Kastens genügten. Deshalb müssen die Stücke, in die du
[[problem-decomposition|ein Problem zerlegst]], prüfbar sein: Ein Kasten mit
unscharfen Rändern ist schwer zu lösen und unmöglich zu prüfen, während ein
Kasten mit einer konkreten Eingabe und einer erwarteten Ausgabe genau sagt,
was fertig heißt.

Die Erwartung muss vor dem Ergebnis feststehen. Wer `add(2, 3)` aufruft und
nur ansieht, was herauskommt, nickt fast alles ab, und wer nur prüft, dass
keine Fehlermeldung erscheint, erfährt, dass der Computer den Code ausführen
konnte, aber nicht, dass er richtig gerechnet hat.

## Was der Kasten wirklich bekommt

Halt eine rote Lampe vor einen Farbsensor. Deine Augen sehen Rot, der
Computer nicht. Ein gängiger Farbsensor hat vier Messkanäle, einen, der vor
allem auf rotes Licht anspricht, einen für Grün, einen für Blau und einen für
die Gesamthelligkeit, und für eine einzelne Messung liefert er vielleicht
203, 41, 57 und 310. Diese vier Zahlen sind alles, was das Programm bekommt.

![Eine IPO-Zeile: links die vier Messwerte r=203 g=41 b=57 c=310, in der Mitte der Kasten classify(), rechts die Ausgabe "red". Darunter: vier Zahlen, eine Entscheidungsregel, ein Wort.](figure:receiver "Der Empfänger bekommt nicht das Wort Rot, sondern vier Zahlen, und eine Regel im Programm macht daraus eine Entscheidung.")

Die Eingabe des Kastens sind also vier Zahlen und keine Farbe, während das
Wort `red` seine Ausgabe ist. Dazwischen liegt eine Regel, die entscheidet,
zum Beispiel: Ist das Licht zu schwach, gilt die Lampe als aus, und sonst
gewinnt der stärkste der drei Farbkanäle. Mit dem Rot, das du siehst, kann
ein Computer nicht arbeiten, weil er eine Darstellung braucht, die er
verarbeiten kann, und auch die Zahlen tragen die Entscheidung nicht von
selbst, denn die Regel kommt aus dem Programm.

Der Kasten unten enthält eine solche Regel in der Funktion `classify()`,
dazu vier Messungen, bei denen du weißt, welche Farbe wirklich leuchtete,
sodass jede Zeile der Liste ein Test ist.

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

Drei Tests bestehen, der vierte fällt durch: Die rote Lampe war weiter vom
Sensor entfernt, ihre Helligkeit von 95 liegt unter der Schwelle von 100, und
die Regel erklärt sie für aus. Keine Zeile ist kaputt, aber Regel und
Wirklichkeit passen nicht zusammen. Mach aus der `100` eine `80` und lass es
noch einmal laufen, dann bestehen alle vier, obwohl sich kein Messwert
geändert hat. Änderst du stattdessen einen Messwert und lässt die Regel, kann
sich die Ausgabe ebenso ändern, denn Eingabe und Regel entscheiden gemeinsam,
was herauskommt. Ein echter Empfänger braucht mehr Regeln als diese, etwa
eine für Licht, in dem zwei Kanäle fast gleich stark sind.

## Kästen in einer Reihe

Die meisten Systeme sind Ketten solcher Kästen, in denen die Ausgabe des
einen zur Eingabe des nächsten wird. Eine Strecke, die Text mit Licht
überträgt, wie im Projekt [[lifi]], ist eine solche Kette: Der Sender macht
mit `encode()` aus dem Text `"hi"` eine Folge von Farben, das Licht trägt die
Farben hinüber, und der Empfänger macht mit `decode()` wieder `"hi"` daraus.

![Eine Kette von links nach rechts: der Text "hi", der Kasten encode() mit der Beschriftung Sender, fünf Punkte mit der Beschriftung Licht, der Kasten decode() mit der Beschriftung Empfänger und wieder der Text "hi". Eine blaue Klammer darüber verbindet encode() und decode() und sagt: dieselbe Vereinbarung auf beiden Seiten.](figure:chain "Die Ausgabe des einen Kastens ist die Eingabe des nächsten, und beide Enden des Lichts brauchen dieselbe Vereinbarung.")

Kästen passen nur zusammen, wenn ihre Ränder übereinstimmen. Verwendet der
Sender Blau für den Buchstaben `a`, liest der Empfänger Blau aber als `b`,
können beide Kästen genau so arbeiten, wie sie geschrieben sind, und das
ganze System versagt trotzdem; jede Grenze braucht deshalb eine Vereinbarung
über Form und Bedeutung der Daten. Wie aus einer solchen Vereinbarung ein
Code wird, zeigt [[code-as-agreement]].

Die Kette sagt dir auch, wie du suchst, wenn etwas schiefgeht. Kommt am Ende
nicht `"hi"` an, hilft es wenig, auf das ganze System zu starren, und es ist
besser, den Daten zu folgen und eine Grenze nach der anderen zu prüfen: ob
`encode()` die richtigen Farben erzeugt hat, ob die Lampe sie gezeigt hat, ob
der Sensor plausible Zahlen geliefert hat und ob `decode()` aus diesen Zahlen
den richtigen Text gemacht hat. Die erste Grenze, an der die Daten falsch
sind, sagt dir, welchen Kasten du öffnen musst.

## Kästen in Kästen

Von außen kann der ganze Sender ein einziger Kasten sein: Eine Nachricht
geht hinein, Licht kommt heraus, und `send()` ist der Name für die gesamte
Verarbeitung darin. Hat dieser Kasten die richtige Größe für deine Frage,
hörst du dort auf. Schlägt ein Test fehl und du musst wissen, warum, öffnest
du den Kasten und findest eine Kette kleinerer: einen, der den Text kodiert,
einen, der die nächste Farbe wählt, und einen, der die Lampe schaltet, jeder
mit eigener Eingabe, Verarbeitung, Ausgabe und eigenem Test, und jeden davon
kannst du wieder öffnen.

![Drei IPO-Zeilen untereinander. System: Nachricht, Sender, Licht. Funktion: Text, encode(), Farben. Logikgatter: 1, 1, AND, 1.](figure:levels "Dieselbe Form auf drei Ebenen: ein System, eine Funktion und ein einzelnes Logikgatter.")

Die Form übersteht jede Ebene. Ein ganzes System, eine einzelne Funktion und
ein einzelnes [[logic-gates|Logikgatter]], das zwei Bits nimmt und eines
zurückgibt, haben alle eine Eingabe, eine feste Verarbeitung und eine
Ausgabe; ihre Größe ändert sich, ihre Form bleibt dieselbe.

Zwei Arten von Beziehung zwischen Kästen solltest du auseinanderhalten.
Kästen in einer Reihe zeigen, wohin die Daten als Nächstes gehen, was man
**Datenfluss** nennt, während Kästen in einem Kasten zeigen, welche kleinere
Arbeit darin geschieht, was **Zerlegung** heißt. Keine Ebene passt für jede
Frage: Die richtige ist die, auf der deine aktuelle Frage eine klare Eingabe
und eine erwartete Ausgabe hat, und kannst du für einen Kasten keinen Test
schreiben, sind seine Ränder noch unscharf oder der Kasten ist noch zu groß.

## Zwei Fragen in jedem Kasten

Sind die Ränder klar, hinterlässt jeder Kasten zwei Fragen. Die erste fragt,
wie der Kasten seine Arbeit verrichtet, und ihre Antwort ist ein Programm,
ein Algorithmus, der so aufgeschrieben ist, dass ein Computer ihn ausführen
kann; dieser Frage folgt [[algorithms-and-programs]]. Die zweite fragt, wie
das, was die Ränder überquert, geschrieben wird, damit eine Maschine damit
arbeiten kann. Der Sensor hat sichtbares Licht in vier Zahlen verwandelt,
und andere Antworten machen aus Zahlen, Buchstaben, Bildern und Dateien
Bits, wie [[place-value-systems]], [[binary-numbers]] und
[[code-as-agreement]] zeigen.

## Auch ein schwarzer Kasten braucht einen Test

Ein KI-Assistent passt in dasselbe Bild, denn du gibst ihm eine Aufgabe und
bekommst Code. Was darin geschieht, ist viel schwerer einzusehen als bei
`add()`, und umso wichtiger sind klare Ränder: Gib ihm ein konkretes Beispiel
als Eingabe, schreib das Ergebnis auf, das du erwartest, und lass dann den
Code laufen, den du bekommen hast, und vergleiche. Mit einem Test musst du
einem Kasten, in den du nicht hineinsehen kannst, nicht vertrauen. Im
Restaurant ist es genauso, denn du musstest die Küche nicht sehen, um dein
Tablett zu prüfen, aber sobald das Tablett falsch ist, reicht der große
Kasten nicht mehr, und du verfolgst die Bestellung von Station zu Station.

## Zum Mitnehmen

- Jedes Stück eines Problems, das ein Computer lösen kann, hat eine Eingabe,
  eine Verarbeitung und eine Ausgabe.
- Eine bekannte Eingabe mit einer erwarteten Ausgabe ist ein Test, der ohne
  Blick in den Kasten auskommt; die Erwartung steht vor dem Ergebnis.
- Ein Computer bekommt nie, was du siehst, sondern eine Darstellung, etwa
  vier Messwerte, und das Programm liefert die Regel, die daraus eine
  Entscheidung macht.
- Kästen in einer Reihe zeigen den Datenfluss und brauchen an jeder Grenze
  eine Vereinbarung; Kästen in einem Kasten zeigen die Zerlegung, und die
  richtige Ebene ist die, die du prüfen kannst.
- Jeder Kasten stellt zwei Fragen: wie er arbeitet, was ein Programm
  beantwortet, und wie seine Eingaben und Ausgaben dargestellt sind.
