---
title: Analog und digital
summary: >-
  Digital heißt nicht elektronisch, sondern endlich viele, klar getrennte
  Zustände. Eine kleine Störung ändert deshalb einen Wert, aber keinen Zustand,
  und dorthin führen zwei Schnitte, deren Preis du in Byte und Minuten zählen
  kannst.
objectives:
  intro: "In dieser Lektion erfährst du am Beispiel einer Lichtstrecke, was digital wirklich heißt und was der Weg dorthin kostet, und kannst danach:"
  goals:
    - "digital als endlich viele, klar getrennte Zustände bestimmen und Alltagsdinge wie einen Dimmer, einen Würfel oder eine Fallblattanzeige als analog oder digital einordnen"
    - "erklären, warum eine kleine Störung einen analogen Wert verändert, einen digitalen Zustand aber nicht, und warum digitale Kopien deshalb das Rauschen nicht erben"
    - "begründen, warum dieselbe Streuung der Messwerte, die zwei Bereiche mühelos verkraften, bei acht Bereichen Messwerte in den Nachbarbereich schiebt"
    - "Abtasten und Quantisieren unterscheiden und an Klötzchen oder harten Flecken erkennen, welcher der beiden Schnitte zu grob war"
    - "die Größe eines Bildes als Punkte mal Bits je Punkt abschätzen und in eine Übertragungszeit umrechnen"
    - "eine Schwelle im Code setzen, die aus einem Messwert ein Symbol macht, und ihren Wert aus der eigenen Messreihe begründen"
translation_of: en
based_on: 2026-11-03
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

Die Anzeigetafel aus der Sporthalle, die man von Hand umblättert, ist digital,
und dasselbe gilt für den Lichtschalter, den Abakus und den Würfel. Der
Rechenschieber, das Zeigerthermometer, der Dimmer und die Sanduhr sind
dagegen analog. In keinem dieser Dinge steckt ein Chip, also kann digital
nicht elektronisch bedeuten. Umgekehrt gilt es genauso: Ein Verstärker ist
elektronisch und trotzdem stufenlos, die Elektronik ist also nur der heute
übliche Träger digitaler Zustände.

Eine **analoge** Größe kann jeden beliebigen Wert annehmen: Zwischen zwei
Werten liegt immer noch ein weiterer, und es gibt keine kleinste Stufe. Ein
**digitales** System arbeitet andersherum, und seine Definition erwähnt
keinen Strom: **Digital heißt endlich viele Zustände, und was dazwischen
liegt, zählt nicht.**

Die zweite Hälfte dieses Satzes ist die wichtige. Ein Messwert, der irgendwo
zwischen den Zuständen liegt, wird einfach dem nächsten Zustand zugeordnet,
und deshalb bleibt eine kleine Störung ohne Folgen.

## Dieselbe Störung, zweimal

Wie das aussieht, zeigt dieselbe Störung in zwei Welten. Jede hat zwei
stehende Skalen von 0 bis 400, links die des Senders und rechts die des
Empfängers, sodass der Weg nach rechts läuft und der Wert nach oben. Gesendet
wird 300, und unterwegs kommen 23 dazu, sodass beim Empfänger 323 ankommt, der
gelbe Punkt; die gestrichelte Linie zeigt, wo 300 gewesen wäre.

![Zwei Hälften nebeneinander, jede mit zwei senkrechten Skalen, beschriftet gesendet und empfangen. Auf der linken Skala ein Punkt bei 300, auf der rechten ein gelber Punkt bei 323, dazwischen ein Pfeil mit +23 unterwegs und eine gestrichelte Linie auf der Höhe von 300. Links steht analog: jeder Wert zählt, und rot ein anderer Wert. Rechts steht digital: nur der Bereich zählt; eine waagrechte Grenze bei 200 teilt beide Skalen in dunkel unten und hell oben, beide Punkte liegen im Bereich hell, und grün steht dort noch hell, derselbe Zustand.](media/between.de.svg "Eine kleine Störung ändert den Wert, aber nicht den Zustand.")

In einem analogen Signal zählt jeder Wert, der empfangene ist also schlicht
ein anderer Wert, und die Störung ist Teil des Signals geworden. In einem
digitalen Signal zählt nur der Bereich: Eine Grenze bei 200 teilt beide
Skalen in dunkel und hell, 323 liegt genauso im Bereich hell wie 300 und
bedeutet deshalb denselben Zustand. Probier es aus:

```python
sent = 300          # the value the sender means
disturbance = 23    # what the way through the room adds
received = sent + disturbance

threshold = 200     # the boundary between dark and bright

def state(value):
    if value > threshold:
        return "bright"
    return "dark"

print("analog:  gesendet", sent, "- empfangen", received)
print("digital: gesendet", state(sent), "- empfangen", state(received))
```

Analog kommt ein anderer Wert an, digital derselbe Zustand. Setz die Störung
auf `-120`, und auch digital kippt der Zustand, denn jetzt ist die Störung
größer als der Abstand bis zur Grenze. Digital macht Störungen also nicht
unmöglich, es macht nur alle Störungen folgenlos, die kleiner sind als dieser
Abstand.

## Der Teil, den kein Programm kontrolliert

Nimm eine Strecke, die Daten mit Licht überträgt. Ein Programm stellt die
Helligkeit einer LED mit Zahlen ein, etwa `(255, 0, 0)` für volles Rot, das
Licht durchquert den Raum, und ein Farbsensor am anderen Ende macht daraus
wieder Zahlen. Die Strecke läuft also durch drei Zonen, digital, analog und
wieder digital.

![Links ein Kasten Sender mit den Zahlen 255, 0, 0 darüber und einem leuchtenden gelben Punkt, rechts ein Kasten Sensor mit den drei Messwerten r = 203, g = 41, b = 57. Dazwischen ist das Licht als unruhige Kurve gezeichnet, darüber stehen Umgebungslicht, Spiegelungen, Abstand, Winkel und Sensorrauschen. Gestrichelte Linien teilen das Bild in digital, analog und digital.](media/three-zones.de.svg "Die Mitte ist Physik: stufenlos und gestört, und kein Programm kontrolliert sie.")

Die Mitte ist Physik, und vieles stört sie: das Umgebungslicht von den
Fenstern und den Deckenlampen, Spiegelungen am Tisch und an der Kleidung,
Abstand und Winkel zwischen LED und Sensor und das Rauschen des Sensors
selbst, der nie zweimal genau denselben Wert misst. Kein Programm hat darauf
Einfluss. Wer diese analoge Mitte vergisst, wird später von jeder Störung
überrascht, und wer sie ernst nimmt, weiß, warum man messen muss.

## Licht hat keine Stufen, aber dein Programm braucht sie

Das Licht selbst ist analog, denn zwischen zwei Helligkeiten liegt immer noch
eine weitere. Das Programm auf der Empfangsseite braucht das Gegenteil, wenige
Zustände mit klarem Abstand.

![Oben ein Balken mit einem stufenlosen Verlauf von Schwarz nach Weiß, beschriftet mit Licht: zwischen zwei Helligkeiten liegt immer noch eine. Darunter vier getrennte Felder in Schwarz, Dunkelgrau, Hellgrau und Weiß, nummeriert von 0 bis 3, beschriftet mit dein Programm: wenige Zustände, klar getrennt.](media/light.de.svg "Digitalisieren macht aus dem stufenlosen Licht wenige Zustände.")

Das Programm bekommt diese Zustände in zwei Schritten: Der Sensor misst und
liefert eine Zahl, und das Programm entscheidet, zu welchem Zustand diese Zahl
gehört. Mehr steckt nicht im Wort **Digitalisieren**: ein Signal durch eine
endliche Folge von Zahlen darstellen.

## Dieselbe Streuung, in mehr Bereiche geschnitten

Zwei Zustände sind sicher, tragen aber wenig je Messung. Vier oder acht
Zustände trügen mehr, und wie viele du dir leisten kannst, zeigt ein Bild, das
du dir aus dieser Lektion merken solltest.

![Drei gleich hohe Säulen, jede der ganze Bereich der Messwerte von niedrig unten bis hoch oben, geteilt in 2, 4 und 8 Bereiche. In jeder liegen sieben weiße Punkte in einem grauen Band knapp über der Mitte, jeder Punkt eine Messung, während dieselbe Farbe kommt. Bei 2 und 4 Bereichen bleibt das Band in seinem Bereich; bei 8 reicht es über beide Grenzen, und drei Punkte sind rot, weil sie im Nachbarbereich liegen.](media/regions.de.svg "Die Messwerte streuen so stark wie vorher, aber bei mehr Bereichen landen manche im falschen.")

Die senkrechte Achse ist das, was der Sensor meldet, etwa der Messwert des
Klarkanals. Jede der drei Säulen ist derselbe Bereich von Messwerten, einmal
in zwei, einmal in vier und einmal in acht Bereiche geschnitten, also für ein
Alphabet aus zwei, vier oder acht Farben. Jeder Punkt ist eine Messung,
während der Sender immer dieselbe Farbe zeigt, und weil die Störungen aus der
Mitte nie ruhen, stimmen die Messungen nie genau überein. Das graue Band zeigt,
wie weit sie streuen, und es ist in allen drei Säulen gleich breit, denn die
Lichtstrecke ist dieselbe.

Von links nach rechts ist nicht die Streuung gewachsen, sondern der Abstand
geschrumpft. Der Abstand von der Mitte eines Bereichs bis zur nächsten Grenze
ist deine Sicherheitsreserve, und mehr Bereiche verteilen dieselbe Reserve auf
mehr Grenzen. Das Programm rechnet dasselbe mit Zahlen nach, mit denselben
sieben Abweichungen wie in der Zeichnung:

```python
low, high = 0, 420         # the range of readings
levels = 2                 # try 4 and 8

# how far seven readings of the same colour lay from the value that was sent
scatter = [-16, 30, -41, 8, 43, -21, 19]

width = (high - low) / levels
target = levels // 2       # the region just above the middle
sent = low + (target + 0.5) * width

regions = []
for s in scatter:
    regions.append(int((sent + s - low) // width))

print("Jeder Bereich ist", width, "breit")
print("Von der Mitte bis zur Grenze:", width / 2, "- größte Abweichung:", max(abs(s) for s in scatter))
print("Gelesene Bereiche:", regions)
print("Im falschen Bereich:", len(regions) - regions.count(target), "von", len(regions))
```

Bei zwei Bereichen liegt die Grenze 105 von der Mitte entfernt, die größte
Abweichung beträgt 43, und alle sieben Messwerte landen im richtigen Bereich.
Bei vier Bereichen schrumpft der Abstand auf 52,5, was noch reicht, aber nicht
mehr großzügig ist. Bei acht sind es nur noch 26,25, und drei der sieben
Messwerte landen in einem Nachbarbereich. Die Streuung war jedes Mal dieselbe,
nur die Grenzen sind näher gerückt.

Acht Bereiche wären verlockend, denn jede Messung trüge dann drei
[[bit|Bit]] statt einem, wie [[symbols-and-information]] erklärt. Das ist
dasselbe Argument, das erklärt, [[why-two-states|warum Rechner mit zwei
Zuständen arbeiten]], hier nur auf einen Sensor statt auf eine Leitung
angewandt. Die andere Hälfte des Problems steht in [[signal-and-noise]]: Dort
bleibt die Zahl der Symbole gleich, während stattdessen die Streuung der
Messwerte gemessen wird, und beide Wege enden an derselben Wand.

## Was die weggeworfene Genauigkeit einbringt

Digitalisieren ist eine Einbahnstraße. Sobald ein Messwert einem Bereich
zugeordnet ist, kann niemand mehr sagen, welcher der unendlich vielen Werte in
diesem Bereich es wirklich war. Dieser Verlust ist kein Versehen, sondern der
Preis, und was er einbringt, zeigen zwei Ketten von Kopien.

![Zwei Reihen aus je vier Kästen, überschrieben mit Original, Kopie 1, Kopie 2 und Kopie 3 und verbunden durch Pfeile. Oben enthält jeder Kasten eine Welle, die von Kasten zu Kasten zackiger wird, darunter steht Band: jede Kopie übernimmt das Rauschen der letzten und fügt eigenes hinzu. Unten steht in jedem Kasten 0110, darunter Datei: jede Kopie wird gelesen und aus sauberen Bits neu gesetzt.](media/copies.de.svg "Jede digitale Kopie entsteht neu aus sauberen Zuständen und erbt das Rauschen deshalb nie.")

Oben ein Tonband: Jede Kopie nimmt die Welle der vorigen Kopie auf, mitsamt
dem Rauschen, das schon darin steckt, und legt eigenes Rauschen obendrauf. Das
Rauschen sammelt sich also an, und die Welle wird von Kopie zu Kopie zackiger.
Unten eine Datei: Bei jeder Kopie werden die Bits gelesen, `0110` wird
erkannt, und die Kopie wird aus diesen sauberen Bits neu gesetzt, also bleibt
`0110` immer `0110`. Das Programm kopiert beides zehnmal hintereinander:

```python
import random

random.seed(4)
noise = 0.1                   # how much every copy adds, at most

tape = [0.0, 1.0, 1.0, 0.0]   # the original as a stepless signal
file = [0, 1, 1, 0]           # the original as bits

for copy in range(10):
    # the tape keeps whatever arrives, noise included
    tape = [v + random.uniform(-noise, noise) for v in tape]
    # the file is read again: above the middle counts as 1, below as 0
    file = [1 if v + random.uniform(-noise, noise) > 0.5 else 0 for v in file]

print("Band nach 10 Kopien: ", [round(v, 2) for v in tape])
print("Datei nach 10 Kopien:", file)
```

Das Band hat sich nach zehn Kopien vom Original entfernt, die Datei ist noch
genau `[0, 1, 1, 0]`. Setz `noise` auf `0.6`, und auch die Datei kippt, denn
dann ist eine einzelne Störung größer als der halbe Abstand zwischen 0 und 1.

Jede Störung, die kleiner ist als dieser Abstand, verschwindet beim Ablesen
vollständig, und deshalb gleicht auch die tausendste Kopie einer Datei dem
Original. Digitale Technik ist also nicht zuverlässig, obwohl sie Information
wegwirft, sondern gerade **weil** sie Information wegwirft.

## Zwei Schnitte

Ein Bild zu digitalisieren braucht zwei Schnitte. Der **erste Schnitt** geht
durch die Fläche: Aus dem stufenlosen Bild werden Messpunkte, etwa 16 × 16.
Das ist das **Abtasten** (sampling), und wie fein es ist, heißt
**Auflösung**. Der **zweite Schnitt** geht durch den Wert: Die Helligkeit jedes
Punkts wird auf eine der vereinbarten Stufen gerundet, etwa auf vier
Graustufen. Das ist das **Quantisieren**, und die Zahl der Stufen heißt
**Farbtiefe**. Diese Stufen sind genau die Bereiche aus dem Abschnitt oben,
nur auf ein Bild angewendet.

Beide Schnitte werfen Detail weg, aber sie hinterlassen verschiedene Spuren,
und daran erkennst du, an welchem Regler du drehen musst. Ein Bild aus
sichtbaren Klötzchen hatte zu wenige Punkte, das Abtasten war also zu grob.
Ein Bild, dessen weiche Schattierungen in harte Flecken oder Streifen
zerfallen, hatte zu wenige Stufen, das Quantisieren war also zu grob. An
beiden Reglern selbst drehen kannst du am [[photo-digitiser]].

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
[[byte|Byte]] und braucht wenig mehr als zwei Minuten. Auflösung und
Farbtiefe sind damit keine Feinheiten, sondern die beiden Hebel, an denen die
Übertragungsdauer hängt: Was du behältst, bezahlst du in Minuten.

## Wie weit kannst du gehen?

Mach ein Foto immer gröber, mit 128, 32, 8 und schließlich 2 Punkten je Kante,
und irgendwo dazwischen zeigt es nicht mehr, was es gezeigt hat. Wo genau das
passiert, darüber werden Menschen streiten, und genau diese Uneinigkeit ist
der Punkt: Eine richtige Menge gibt es nicht, nur eine Abwägung gegen die
Übertragungszeit, die jemand bewusst treffen muss. Wer ein Bild über eine
Lichtstrecke schicken will, steht genau vor dieser Frage, und am
[[photo-digitiser]] kannst du sie für dich beantworten.

## Dieselben zwei Schnitte beim Ton

Die zwei Schnitte sind kein Bildthema, sondern das Verfahren, und beim Ton
sieht man sie an einer einzigen Kurve.

![Drei Felder nebeneinander. Links eine glatte Kurve, beschriftet mit die Schallwelle, stufenlos. In der Mitte dieselbe Kurve, blass, mit gestrichelten senkrechten Linien und zwölf Punkten auf der Kurve, beschriftet mit Schnitt 1: Abtasten, 12 Zeitpunkte. Rechts vier waagrechte Stufenlinien, auf die die zwölf Punkte zur nächsten Stufe gerückt sind, beschriftet mit Schnitt 2: Quantisieren, 4 Amplitudenstufen. In jedem Feld zeigt eine Achse nach rechts, beschriftet Zeit, und eine nach oben, beschriftet Amplitude.](media/two-cuts.de.svg "Das Abtasten zerlegt die Zeit, und das Quantisieren zerlegt die Amplitude.")

Beim Ton zerlegt das Abtasten die Zeit statt der Fläche, und wie oft je
Sekunde gemessen wird, heißt **Abtastrate**. Das Quantisieren zerlegt die
**Amplitude** statt der Helligkeit, also wie weit die Luft gerade ausgelenkt
ist, was das Mikrofon in eine Spannung übersetzt; wie fein es die Stufen
setzt, heißt hier **Bittiefe**. Eine CD speichert 44.100 Messungen je Sekunde mit je 16 Bit.
Das Programm macht mit der Welle aus der Zeichnung dasselbe wie ihr rechtes
Feld:

```python
import math

samples = 12      # cut 1: how many points in time
levels = 4        # cut 2: how many amplitude levels

for i in range(samples):
    t = (i + 0.5) / samples
    value = 0.5 + 0.3 * math.sin(2 * math.pi * t * 1.3 + 0.4) + 0.12 * math.sin(2 * math.pi * t * 3.1 + 1)
    level = round(value * (levels - 1))
    print("Zeitpunkt", round(t, 2), "- Wert", round(value, 3), "- Stufe", level)
```

Setz `levels` auf `2`, und von der Welle bleibt nur noch laut und leise; setz
`samples` auf `4`, und von ihrem Verlauf bleibt fast nichts. Wie das klingt,
hörst du am [[audio-digitiser]]: Wer die Abtastrate einer Aufnahme
herunterdreht, hört, wie eine Stimme blechern wird.

## Wo dein Alphabet entsteht

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

Mit mehr Farben gilt dasselbe für jede Grenze. Zwei Farben sind sicher, und
acht sind schnell, und irgendwo dazwischen liegt euer Alphabet. Wo genau,
wissen nur eure eigenen Messungen, denn die Breite eines Bereichs muss zur
Streuung der Messwerte passen, und wie weit sie streuen, weiß nur, wer sie
gemessen hat.

## Zum Mitnehmen

- Digital heißt endlich viele, klar getrennte Zustände ohne gültige
  Zwischenwerte; Elektronik ist nur der übliche Träger.
- Eine kleine Störung ändert einen analogen Wert, aber keinen digitalen
  Zustand, solange sie kleiner ist als der Abstand bis zur nächsten Grenze.
- Zwischen Sender und Sensor ist jede Strecke analog; erst eine Messung und
  eine Entscheidung machen sie wieder digital.
- Mehr Bereiche tragen mehr je Messung, rücken die Grenzen aber näher an
  dieselbe Streuung, sodass zwei Bereiche sicher sind und acht schon zu viele
  sein können.
- Weggeworfene Genauigkeit ist der Preis der Robustheit: Digitale Kopien
  entstehen bei jedem Ablesen neu und erben das Rauschen nicht.
- Digitalisieren braucht zwei Schnitte, Abtasten (Auflösung oder Abtastrate)
  und Quantisieren (Farb- oder Bittiefe), und ein Bild kostet Punkte × Bits je
  Punkt.
- Eine Schwelle oder eine Einteilung in Bereiche ist eine Entscheidung, und sie
  gehört dorthin, wo eine Messreihe sie hinlegt.
