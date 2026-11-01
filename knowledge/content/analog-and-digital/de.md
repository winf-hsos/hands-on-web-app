---
title: Analog und digital
summary: >-
  Digital heißt nicht elektronisch, sondern endlich viele, klar getrennte
  Zustände. Dorthin führen zwei Schnitte, deren Preis du in Byte zählen
  kannst, und die Genauigkeit, die sie wegwerfen, kauft eine Entscheidung, die
  kleine Störungen nicht mehr umwerfen.
objectives:
  intro: "In dieser Lektion erfährst du, was digital wirklich heißt und was der Weg dorthin kostet, und kannst danach:"
  goals:
    - "digital als endlich viele, klar getrennte Zustände bestimmen und Alltagsdinge wie einen Dimmer, einen Würfel oder eine Fallblattanzeige als analog oder digital einordnen"
    - "zeigen, wo eine Strecke, die Daten mit Licht überträgt, analog ist und wo digital"
    - "erklären, warum dasselbe Wackeln, das zwei Stufen mühelos verkraften, bei acht Stufen Messwerte in den Nachbarbereich schiebt"
    - "Abtasten und Quantisieren unterscheiden und an Klötzchen oder harten Flecken erkennen, welcher der beiden Schnitte zu grob war"
    - "die Größe einer Datei als Punkte mal Bits je Punkt abschätzen und in eine Übertragungszeit umrechnen"
translation_of: en
based_on: 2026-11-01
---

Stell dir die Abfahrtstafel eines Bahnhofs vor, aus der Zeit vor den Chips:
Die Fallblattanzeige klappert, bis jeder Buchstabe an seinem Platz ist.
Nirgends steckt ein Computer darin, und trotzdem ist die Tafel vollkommen
digital, denn jedes Blatt ruht in genau einer seiner Stellungen, und während
es umklappt, gibt es dazwischen keinen gültigen Zustand. Deshalb kannst du sie
auch aus zwanzig Metern Entfernung lesen, und sie zeigt gleich zu Beginn, worum
es in dieser Lektion geht: Digital ist eine Frage der Zustände, nicht der
Elektronik.

## Endlich viele Zustände, und nichts dazwischen

Eine **analoge** Größe kann jeden beliebigen Wert annehmen: Zwischen zwei
Werten liegt immer noch ein weiterer, und es gibt keine kleinste Stufe. Die
Helligkeit einer Lampe, der Zeiger eines Zeigerthermometers und der Sand in
einer Sanduhr sind in diesem Sinn analog. Ein **digitales** System arbeitet
andersherum, und seine Definition erwähnt keinen Strom: **Digital heißt
endlich viele Zustände, und was dazwischen liegt, zählt nicht.**

Beide Hälften dieses Satzes tragen. Die erste ist harmlos, denn sie sagt nur,
dass sich die Zustände abzählen lassen. An der zweiten hängt die ganze Technik,
denn wenn nichts zwischen den Zuständen zählt, kann zwischen ihnen auch nichts
schiefgehen. Ein Lichtschalter rastet auf an oder aus ein, ein Würfel auf der
Kante kippt auf eine Seite, und eine Perle am Abakus liegt auf der einen oder
der anderen Seite ihres Stabs, also sind alle drei digital, ganz ohne Chip.
Umgekehrt gilt es genauso: Ein Verstärker ist elektronisch und trotzdem
stufenlos, die Elektronik ist also nur der heute übliche Träger digitaler
Zustände und nicht das, was sie digital macht.

## Wo analog endet

Nimm eine Strecke, die Daten mit Licht überträgt. Ein Programm stellt die
Helligkeit einer LED mit Zahlen ein, etwa `(255, 0, 0)` für volles Rot, das
Licht durchquert den Raum, und ein Farbsensor am anderen Ende macht daraus
wieder Zahlen. Die Strecke läuft also durch drei Zonen, digital, analog und
wieder digital.

![Links ein Kasten Sender mit den Zahlen 255, 0, 0 darüber, rechts ein Kasten Sensor mit drei Messwerten r = 203, g = 41, b = 57. Dazwischen ist das Licht als unruhige Kurve gezeichnet, darüber stehen Umgebungslicht, Abstand und Rauschen. Gestrichelte Linien teilen das Bild in digital, analog und digital.](figure:three-zones "Die Mitte ist Physik: stufenlos, gestört von Umgebungslicht, Abstand und Rauschen, und kein Programm der Welt kontrolliert sie.")

Das Licht selbst ist analog, denn zwischen zwei Helligkeiten liegt immer noch
eine weitere. Das Programm auf der Empfangsseite braucht das Gegenteil,
endlich viele Zustände mit klarem Abstand, und es bekommt sie in zwei
Schritten: Der Sensor misst und liefert eine Zahl, und das Programm
entscheidet, zu welchem Zustand diese Zahl gehört. Mehr steckt nicht im Wort
**Digitalisieren**: ein Signal durch eine endliche Folge von Zahlen darstellen.

## Die Schwelle ist eine Entscheidung

Die einfachste Entscheidung kennt zwei Zustände. Ein Programm, das
Helligkeitswerte liest, vergleicht jeden mit einer Schwelle, und alles darüber
gilt als hell (`"bright"`), alles andere als dunkel (`"dark"`):

```python
readings = [412, 398, 87, 405, 92, 79, 401, 388, 95, 410]
threshold = 250

symbols = []
for value in readings:
    if value > threshold:
        symbols.append("bright")
    else:
        symbols.append("dark")

print(symbols)
```

An diesem einen Vergleich werden aus Hunderten möglicher Messwerte zwei
Symbole. Die Schwelle ist keine Naturkonstante, sondern eine Entscheidung, und
von hier an gilt die Entscheidung, nicht die Physik. Setz sie auf 400 und lass
das Programm noch einmal laufen: Die Werte 398 und 388, die eindeutig zu hell
gehören, zählen plötzlich als dunkel. Wohin eine Schwelle gehört, ist deshalb
keine Gefühlssache, sondern eine Frage der Messreihe: Erst misst du, was hell
und dunkel wirklich liefern, dann legst du die Schwelle dazwischen
([[measurement-and-experiments]]).

## Wie viele Zustände kannst du dir leisten?

Zwei Zustände sind sicher, tragen aber wenig je Messung. Vier oder acht
Zustände trügen mehr, und wie viele du dir leisten kannst, zeigt ein Bild, das
du dir aus dieser Lektion merken solltest.

![Drei gleich hohe Säulen, geteilt in 2, 4 und 8 Bereiche. In jeder sitzt eine Messung mit demselben Schwankungsband im zweiten Bereich von unten. Bei 2 und 4 Bereichen bleibt das Band in seinem Bereich und bekommt einen grünen Haken; bei 8 reicht es über beide Grenzen, ist rot gezeichnet und bekommt ein rotes Kreuz.](figure:decision-levels "Dreimal dieselbe Messung mit demselben Wackeln, und nur die Zahl der Bereiche wächst.")

Von links nach rechts ist nicht das Rauschen gewachsen, sondern der Abstand
geschrumpft. Der Abstand von einer Messung bis zur nächsten Grenze ist deine
Sicherheitsreserve, und mehr Bereiche verteilen dieselbe Reserve auf mehr
Grenzen. Bei zwei Bereichen sitzt das Band bequem in seinem eigenen, bei vier
wird es knapp, und bei acht reicht dasselbe Band über die Grenze. Das ist
dasselbe Argument, das erklärt, [[why-two-states|warum Rechner mit zwei
Zuständen arbeiten]], hier nur auf einen Sensor statt auf eine Leitung
angewandt. Die andere Hälfte des Problems steht in [[signal-and-noise]]: Dort
bleibt die Zahl der Symbole gleich, während stattdessen die Streuung der
Messwerte gemessen wird, und beide Wege enden an derselben Wand.

Du kannst es mit Zahlen ausprobieren. Das Programm unten teilt einen Bereich
von Messwerten zwischen 100 und 400 in mehrere Bereiche, von unten ab 0
nummeriert. Der Sender zielt auf die Mitte des zweiten Bereichs, Bereich 1,
und das Licht kommt zehnmal mit dem Wackeln aus der Liste beim Sensor an,
jeder Messwert ist also der gesendete Wert plus sein Wackeln:

```python
low, high = 100, 400       # the range of readings
levels = 2                 # try 4 and 8

# how far ten readings of the same light lay from the value that was sent
wobble = [9, -19, 23, -6, 29, -25, 3, 17, -13, -28]

width = (high - low) / levels
sent = low + 1.5 * width   # the middle of region 1

regions = []
for w in wobble:
    value = sent + w
    regions.append(int((value - low) // width))

print("Jeder Bereich ist", width, "breit")
print("Von der Mitte bis zur Grenze:", width / 2, "- größtes Wackeln:", max(abs(w) for w in wobble))
print("Gelesene Bereiche:", regions)
print("Im falschen Bereich:", len(regions) - regions.count(1), "von", len(regions))
```

Bei zwei Stufen liegt die Grenze 75 von der Mitte entfernt, das größte
Wackeln beträgt 29, und alle zehn Messwerte landen in Bereich 1. Bei vier
Stufen schrumpft der Abstand auf 37,5, was noch reicht, aber nicht mehr
großzügig ist. Bei acht sind es nur noch 18,75, und fünf der zehn Messwerte
landen in einem Nachbarbereich. Das Wackeln war jedes Mal dasselbe, nur die
Grenzen sind näher gerückt.

Acht Stufen wären verlockend, denn jede Messung trüge dann drei
[[bit|Bit]] statt einem, wie [[symbols-and-information]] erklärt. Wie viele
Stufen sicher sind, ist deshalb keine Geschmacksfrage, sondern eine Frage des
Wackelns deiner eigenen Messwerte, und die Breite eines Bereichs muss dazu
passen.

## Was die weggeworfene Genauigkeit einbringt

Digitalisieren ist eine Einbahnstraße. Sobald ein Messwert einem Bereich
zugeordnet ist, kann niemand mehr sagen, welcher der unendlich vielen Werte in
diesem Bereich es wirklich war. Dieser Verlust ist kein Versehen, sondern der
Preis, und was er einbringt, ist Robustheit: Jede Störung, die kleiner ist als
der Abstand zwischen den Zuständen, verschwindet beim Ablesen vollständig.

Eine Musikkassette zeigt den Unterschied. Beim Überspielen kopiert das Band
die stufenlose Welle mitsamt ihrem Rauschen und legt eigenes Rauschen
obendrauf, sodass jede Generation etwas schlechter klingt als die davor. Eine
Datei wird als Folge von Zuständen gelesen und bei jeder Kopie frisch gesetzt,
die kleinen Störungen jedes Schritts verschwinden also, und auch die
tausendste Kopie gleicht dem Original. Digitale Technik ist also nicht zuverlässig,
obwohl sie Information wegwirft, sondern gerade **weil** sie Information
wegwirft.

## Zwei Schnitte

Ein Signal zu digitalisieren braucht immer zwei Schnitte, und die Zeichnung
zeigt beide an derselben Kurve. Sie könnte ein Ton im Lauf der Zeit sein oder
die Helligkeit entlang einer Zeile eines Fotos.

![Drei Felder nebeneinander. Links eine glatte Kurve, beschriftet mit das Signal, stufenlos. In der Mitte dieselbe Kurve, blass, mit gestrichelten senkrechten Linien und zwölf Punkten auf der Kurve, beschriftet mit Schnitt 1: Abtasten, 12 Messpunkte. Rechts vier waagrechte Stufenlinien, auf die die zwölf Punkte zur nächsten Stufe gerückt sind, beschriftet mit Schnitt 2: Quantisieren, 4 Stufen.](figure:two-cuts "Der erste Schnitt geht durch die Achse, der zweite durch den Wert.")

Der **erste Schnitt** misst das Signal an endlich vielen Stellen, bei einem
Ton in der Zeit, bei einem Bild über die Fläche. Das ist das **Abtasten**
(sampling), und wie fein es ist, heißt **Auflösung**: 16 × 16 Punkte bei einem
winzigen Bild, 44.100 Messungen je Sekunde bei einer CD. Der **zweite Schnitt**
rundet jeden gemessenen Wert auf eine der vereinbarten Stufen. Das ist das
**Quantisieren**, und die Zahl der Stufen heißt bei einem Bild **Farbtiefe**
und bei einem Ton **Bittiefe**, in der Zeichnung vier Graustufen, bei einer CD
16 Bit je Messung. Diese Stufen sind genau die Bereiche aus dem Abschnitt
oben.

Beide Schnitte hinterlassen ihre eigenen Spuren, und daran erkennst du, an
welchem Regler du drehen musst. Ein Bild aus sichtbaren Klötzchen hatte zu
wenige Punkte, das Abtasten war also zu grob. Ein Bild, dessen weiche
Schattierungen in harte Flecken oder Streifen zerfallen, hatte zu wenige
Stufen, das Quantisieren war also zu grob.

## Was ein Bild kostet

Eine einzige Rechnung trägt jede Dateigröße: **Punkte × Bits je Punkt**. Eine
Stufe braucht so viele Bits, wie nötig sind, um alle Stufen zu unterscheiden,
vier Graustufen brauchen also zwei Bit und 256 Stufen acht, dasselbe *k*ⁿ wie
in [[place-value-systems]]. Das Programm rechnet aus, was ein Bild aus
64 × 64 Punkten über eine langsame Strecke kostet, die 30 Bit je Sekunde
schafft:

```python
points = 64 * 64
rate = 30   # bits per second

for bits_per_point in [24, 8, 2, 1]:
    size = points * bits_per_point
    minutes = size / rate / 60
    print(bits_per_point, "Bit je Punkt:", size // 8, "Byte,", round(minutes, 1), "Minuten")
```

In voller Farbe, mit 24 Bit je Punkt, belegt das Bild 12.288 Byte und braucht
fast 55 Minuten; in Schwarz-Weiß, mit einem Bit je Punkt, belegt es 512
[[byte|Byte]] und braucht wenig mehr als zwei Minuten. Dasselbe Bild und eine
einzige Entscheidung machen mehr als fünfzig Minuten Unterschied.

Darum ist Digitalisieren keine Fleißaufgabe nach dem Motto „so fein wie
möglich“, sondern eine Abwägung, welches Detail seine Übertragungszeit wert
ist. Mach ein Foto immer gröber, und irgendwann zeigt es nicht mehr, was es
gezeigt hat, und wo genau das passiert, darüber werden Menschen streiten. Eine
richtige Menge gibt es nicht, nur eine Abwägung, die jemand bewusst treffen
muss.

## Zum Mitnehmen

- Digital heißt endlich viele, klar getrennte Zustände ohne gültige
  Zwischenwerte; Elektronik ist nur der übliche Träger.
- Zwischen Sender und Sensor ist jede Strecke analog; erst eine Messung und
  eine Entscheidung machen sie wieder digital.
- Eine Schwelle oder eine Einteilung in Bereiche ist eine Entscheidung, und sie
  gehört dorthin, wo eine Messreihe sie hinlegt.
- Mehr Stufen tragen mehr je Messung, rücken die Grenzen aber näher an
  dasselbe Wackeln, sodass zwei Stufen sicher sind und acht schon zu viele sein
  können.
- Weggeworfene Genauigkeit ist der Preis der Robustheit: Störungen, die kleiner
  sind als der Abstand zwischen den Zuständen, verschwinden bei jedem Ablesen,
  und digitale Kopien bleiben identisch.
- Digitalisieren braucht zwei Schnitte, Abtasten (Auflösung) und Quantisieren
  (Farb- oder Bittiefe), und eine Datei kostet Punkte × Bits je Punkt.
