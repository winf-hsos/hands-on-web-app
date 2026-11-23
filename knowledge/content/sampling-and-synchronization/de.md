---
title: Abtastung und Synchronisation
summary: >-
  Ein Empfänger sieht nur Licht und muss selbst herausfinden, wann das
  nächste Symbol beginnt. Diese Lektion zeigt, warum eine Strecke umso früher
  kippt, je schneller sie läuft, und vergleicht die zwei Antworten darauf:
  einen gemeinsamen Takt, den Marken immer wieder neu setzen, und einen
  Farbwechsel, der selbst den Takt gibt. Beide haben einen Preis, und er zeigt
  sich in den Minuten, die eine Datei braucht.
objectives:
  intro: "Am Beispiel einer Strecke, die Farben mit einer LED sendet und mit einem Sensor misst, zeigt dir diese Lektion, wie Sender und Empfänger sich einigen, wann ein Symbol beginnt, und danach kannst du:"
  goals:
    - "erklären, warum ein Empfänger keine Grenzen zwischen Symbolen sieht und warum zwei gleiche Symbole hintereinander zu einem verschmelzen"
    - "aus dem Unterschied zweier Uhren und der Symbolrate berechnen, nach wie vielen Sekunden der Empfänger das Nachbarsymbol liest, und begründen, warum der Spielraum für diesen Fehler höchstens ein halbes Symbol beträgt"
    - "erklären, warum Symbole, die kürzer sind als die Integrationszeit des Sensors, Messwerte liefern, die zu keinem Symbol passen"
    - "beschreiben, wie Marken den Uhrenfehler begrenzen und was sie an Rate kosten"
    - "Bits als Wechsel zwischen drei Farben kodieren und dekodieren, sodass es immer einen Wechsel zu sehen gibt"
    - "echte Strecken für beide Wege nennen, etwa das Startbit der seriellen Schnittstelle, den Manchester-Code des Ethernets und das Bit-Stuffing von USB"
    - "mit `math.log2()` vergleichen, wie viele Bits k Farben als Zustände und als Wechsel tragen, und erklären, warum zwei Bit pro Wechsel fünf Farben brauchen"
    - "mit t = n / (r · b) berechnen, wie lange eine Datei mit und ohne gemeinsamen Takt braucht"
translation_of: en
based_on: 2026-11-23
---

![Folien: Abtastung und Synchronisation](item:sampling-and-synchronization-slides)

Achtzig Musikerinnen und Musiker in einem Orchester können alle Takt halten,
und trotzdem liefen sie ohne jemanden, der den Takt gibt, nach einer Minute
auseinander, weil sich kleine Unterschiede im Tempo summieren und niemand den
eigenen Fehler bemerkt. Zwei Rechner, die sich Licht zuschicken, haben
dasselbe Problem. Der Sender weiß, wann jedes Symbol beginnt, weil er das
Licht selbst umschaltet, während der Empfänger nur Licht sieht und es
herausfinden muss. Diese Lektion zeigt, warum das umso schwerer wird, je
schneller eine Strecke läuft, und vergleicht die zwei grundsätzlichen
Antworten: einen gemeinsamen Takt oder einen Wechsel im Licht, der selbst den
Takt gibt. Die Beispiele verwenden eine LED und einen Farbsensor, und
dieselben Fragen stellen sich bei jeder Strecke, die Symbole nacheinander
sendet.

## Was der Empfänger sieht

Der Sender schaltet Symbole gleicher Länge mit klaren Grenzen dazwischen,
etwa Rot für 100 ms, dann Blau, dann noch einmal Blau. Beim Empfänger kommt
ein durchgehender Strom aus Licht ohne jede Grenze an. Wo zwei verschiedene
Farben aufeinandertreffen, sieht der Empfänger einen Wechsel, aber wo
dieselbe Farbe auf sich selbst folgt, verschmelzen die beiden Symbole zu
einem langen Stück, und nichts im Licht verrät, ob es eines war oder zwei.

Der Empfänger nimmt pro Symbol einen Messwert. Diesen mittelt der Sensor
bereits über ein kurzes Messfenster, weil einzelne Werte streuen, wie
[[signal-and-noise|Signal und Rauschen]] gezeigt hat, und wenn diese Lektion
von dem Messwert spricht, den der Empfänger in einem Symbol nimmt, meint sie
diesen einen Wert. Die Frage ist, wann er ihn nimmt: Der Empfänger muss
wissen, wo ein Symbol beginnt und endet, und das Licht allein sagt es ihm
nicht.

## Keine zwei Uhren laufen gleich

Die naheliegende Antwort ist, sich auf eine Rate zu einigen. Sender und
Empfänger verwenden beide 100 ms pro Symbol, starten gemeinsam, und der
Empfänger misst in der Mitte jedes Zeitschlitzes, bei 50 ms, 150 ms, 250 ms
und so weiter. Das funktioniert, solange beide Uhren genau gleich schnell
laufen, und das tun keine zwei Uhren. Jede Uhr in einem Laptop oder einem
Mikrocontroller geht ein wenig falsch, um Bruchteile eines Prozents, und der
Fehler jedes Symbols kommt zu dem des vorigen hinzu.

![Zwei Zeilen. Oben zwölf nummerierte Kästen, die Zeitschlitze des Senders. Darunter zehn Punkte, die Messungen des Empfängers, jeder mit einer gestrichelten Linie zur oberen Zeile verbunden. Die ersten Punkte sitzen unter der Mitte ihres Schlitzes, dann rücken sie mit jedem Symbol weiter nach rechts; ab dem siebten liegen sie im nächsten Schlitz und sind rot.](figure:drift "Die Uhr des Empfängers geht 8 % nach, stark übertrieben, damit sich die Wirkung nach wenigen Symbolen zeigt. Ab der siebten Messung liest der Empfänger den Nachbarschlitz.")

Das Programm berechnet, wann der Empfänger jede Messung nimmt und in welchem
Schlitz des Senders sie landet:

```python
slot = 100       # ms pro Symbol, von beiden Seiten vereinbart
slow = 1.08      # die Uhr des Empfängers geht 8 % nach, stark übertrieben

for i in range(10):
    t = (i + 0.5) * slot * slow    # gemeint ist die Mitte von Schlitz i + 1
    print(f"Messung {i + 1} bei {t:.0f} ms landet in Schlitz {int(t // slot) + 1}")
```

Die ersten sechs Messungen landen im richtigen Schlitz, auch wenn jede etwas
später sitzt als die vorige. Messung 7 fällt auf 702 ms, also in Schlitz 8,
sodass Schlitz 7 nie gelesen wird und jedes Symbol ab dort um eins verschoben
ist. Der Fehler pro Symbol ist klein und harmlos, seine Summe ist es nicht.

## Der Sensor braucht Zeit zum Hinsehen

Es gibt eine zweite Ursache, und sie liegt im Sensor. Ein Sensor liefert
keinen Augenblickswert, sondern sammelt Licht über ein Messfenster und meldet
den Durchschnitt, seine **Integrationszeit**, die
[[signal-and-noise|Signal und Rauschen]] als Mittel gegen unruhige Messwerte
eingeführt hat. Das geht gut, solange das Fenster in ein Symbol passt.

![Zwei Felder auf derselben Zeitachse. Links wechseln Symbole von 100 ms zwischen hell und dunkel, und ein gelbes Fenster von 50 ms liegt ganz in einem hellen Symbol; das Kästchen darunter zeigt den Durchschnitt, den der Sensor meldet, reines Hell, und das Urteil lautet liest hell. Rechts Symbole von 40 ms, und dasselbe Fenster überdeckt einen Teil eines hellen und einen Teil eines dunklen Symbols; das Kästchen darunter zeigt ein Grau zwischen hell und dunkel, und das Urteil lautet passt zu keinem Symbol.](figure:window "Dasselbe Messfenster von 50 ms bei Symbolen von 100 ms und von 40 ms. Sobald die Symbole kürzer sind als das Fenster, enthält jede Messung einen Wechsel.")

Bei Symbolen von 100 ms und einem Fenster von 50 ms kann jede Messung ganz in
einem Symbol liegen, und der Wert passt. Bei Symbolen von 40 ms enthält jedes
Fenster einen Wechsel, und der Sensor meldet eine Mischung aus zwei Farben,
die zu keiner von beiden passt. Es gibt keine Fehlermeldung, nur eine Zahl,
die zum falschen Symbol führt. Ein kürzeres Fenster hilft gegen das Mischen,
lässt die Messwerte aber stärker streuen, was derselbe Tausch ist wie beim
Rauschen, und so setzt die Integrationszeit der Länge eines Symbols eine
Untergrenze.

Beide Ursachen laufen auf dieselbe Frage hinaus, nämlich wann das nächste
Symbol beginnt. Eine Uhr kann es dem Empfänger sagen oder ein Wechsel im
Licht, und der Rest dieser Lektion sieht sich beide Antworten und ihren Preis
an.

## Wann kippt es?

Nimm zwei Uhren, die sich um ein halbes Prozent unterscheiden, ein
realistischer Wert für zwei gewöhnliche Geräte. Nach einer Sekunde liegen sie
5 ms auseinander, nach zehn Sekunden 50 ms, und der Fehler wächst in einer
geraden Linie weiter. Wie viel davon der Empfänger verträgt,
folgt daraus, wo er misst. Er nimmt seinen Messwert in der Mitte eines
Symbols, und bei zehn Symbolen pro Sekunde dauert ein Symbol 100 ms, also
sind es nach jeder Seite 50 ms bis zum Rand. Sobald der Fehler diese 50 ms
überschreitet, misst der Empfänger im Nachbarsymbol, und das geschieht nach
zehn Sekunden. Ein halbes Symbol ist der größte Spielraum, den eine Messung
hat, und oft hat sie weniger, weil das Messfenster des Sensors als Ganzes ins
Symbol passen muss: Bei einem Fenster von 20 ms bleiben nach jeder Seite
40 ms, und die Strecke kippt schon nach acht Sekunden. Die Rechnung unten
nimmt den günstigsten Fall an, eine echte Strecke kippt also nicht später,
als sie sagt.

Je schneller die Strecke, desto kürzer die Symbole, während der Fehler gleich
schnell wächst:

```python
drift = 0.005    # die beiden Uhren unterscheiden sich um 0,5 %

for rate in [1, 2, 5, 10, 20]:
    room = 1 / rate / 2          # Mitte bis Rand, in Sekunden
    print(f"{rate:2} Symbole pro Sekunde: falsch nach {room / drift:.0f} s")
```

Dieselben zwei Uhren halten bei einem Symbol pro Sekunde 100 Sekunden durch
und bei zwanzig nur 5. Das erklärt, warum eine Strecke, die langsam stabil
läuft, beim Beschleunigen plötzlich zusammenbricht, obwohl sich an den Uhren
nichts geändert hat.

## Marken setzen den Fehler zurück

Einmal gemeinsam starten genügt nicht, immer wieder gemeinsam starten schon.
Der Sender schiebt in festen Abständen eine **Marke** ein, ein reserviertes
Symbol, das der Empfänger mit keinem Datensymbol verwechseln kann, etwa eine
Farbe, die im Alphabet nicht vorkommt, oder eine kurze dunkle Pause. An jeder
Marke richtet der Empfänger sein Raster neu aus, sodass der Fehler auf null
fällt und nur bis zur nächsten Marke wieder wächst. Bei Uhren, die sich um
ein halbes Prozent unterscheiden, und einer Marke alle vier Sekunden wird der
Fehler nie größer als 4 s · 0,005 = 20 ms.

Um sich neu auszurichten, muss der Empfänger nicht nur wissen, dass eine
Marke kam, sondern wann sie begann. Er misst deshalb schneller, als Symbole
ankommen, etwa fünfmal pro Symbol, und merkt sich die erste Messung, die in
die Marke fällt. Die nächste Symbolgrenze liegt bei diesem Zeitpunkt plus
einer Symboldauer, und der verbleibende Fehler ist höchstens ein Messschritt.
Hier borgt sich der Weg mit Takt die Idee des anderen Wegs, die Reaktion auf
einen Wechsel, nur einmal pro Block statt bei jedem Symbol.

Marken tragen keine Daten, und das ist ihr Preis: Eine Marke alle acht
Symbole kostet ein Achtel der Rate. Einmal gemeinsam zu starten kostet nichts,
lässt den Fehler aber unbegrenzt wachsen, und wie oft eine Marke nötig ist,
hängt davon ab, wie weit die eigenen Uhren auseinanderlaufen, was eine Frage
für eine Messung ist.

Viele echte Strecken arbeiten so. Eine serielle Schnittstelle (UART, wie bei
RS-232) ruht zwischen den Zeichen auf 1, und jedes Zeichen beginnt mit einem
Startbit 0: An dessen fallender Flanke startet der Empfänger seine Uhr neu
und liest danach jedes Bit in seiner Mitte. Weil diese Marke vor jedem
Zeichen kommt, müssen die Uhren nur über etwa zehn Bit zusammenhalten, und
eine Abweichung von wenigen Prozent schadet nicht. Das Zeitsignal DCF77, das
Funkuhren empfangen, senkt zu Beginn jeder Sekunde seine Amplitude ab, für
100 ms bei einer 0 und für 200 ms bei einer 1, und lässt die Absenkung in
Sekunde 59 aus, sodass die Lücke den Beginn der nächsten Minute markiert. Ein
VGA-Monitor bekommt nach jeder Bildzeile einen Synchronisationspuls und nach
jedem Bild einen weiteren.

## Der Wechsel als Takt

Der zweite Weg braucht keine Uhr. Jede Farbe ist ein Symbol, und jeder
Farbwechsel heißt „das nächste“. Der Empfänger misst, so oft er kann, und
reagiert nur auf Wechsel, also gibt es nichts, was driften könnte. Die naive
Fassung hat einen Fehler, den vom Anfang dieser Lektion: Zwei gleiche Symbole
hintereinander erzeugen keinen Wechsel, und der Empfänger kann eines nicht
von zweien unterscheiden.

Die Lösung ist, die Information im Wechsel statt in der Farbe zu tragen. Von
jeder Farbe aus sind zwei Nachfolger erlaubt, einer für 1 und einer für 0,
und die Farbe selbst ist als ihr eigener Nachfolger verboten, sodass es immer
einen Wechsel zu sehen gibt.

![Drei farbige Kreise an den Ecken eines Dreiecks, Rot oben, Grün unten rechts und Blau unten links, mit einem Pfeil im Uhrzeigersinn darin. Daneben: Schritt im Uhrzeigersinn = 1, Schritt gegen den Uhrzeigersinn = 0, keine Farbe folgt auf sich selbst. Darunter vier Quadrate Rot, Grün, Rot, Blau und zwischen ihnen die Bits 1, 0, 0.](figure:triangle "Drei Farben auf einem Dreieck: Ein Schritt im Uhrzeigersinn bedeutet 1, einer dagegen 0. Rot, Grün, Rot, Blau trägt deshalb die Bits 1, 0, 0.")

Das Programm geht für eine 1 in die eine und für eine 0 in die andere
Richtung um das Dreieck und dekodiert, indem es die Richtung jedes Wechsels
ansieht:

```python
order = ["red", "green", "blue"]    # im Uhrzeigersinn um das Dreieck

def encode(bits, start="red"):
    colors = [start]
    for bit in bits:
        step = 1 if bit == "1" else -1
        colors.append(order[(order.index(colors[-1]) + step) % 3])
    return colors

def decode(colors):
    bits = ""
    for a, b in zip(colors, colors[1:]):
        step = (order.index(b) - order.index(a)) % 3
        bits += "1" if step == 1 else "0"
    return bits

sent = encode("100")
print(sent)
print(decode(sent))
```

Aus den Bits `100` werden Rot, Grün, Rot, Blau, und der Dekodierer liefert
wieder `100`. `encode` braucht eine Startfarbe, die kein Bit trägt, also
werden für drei Bits vier Farben gesendet.

Echte Strecken verwenden dieselbe Idee mit zwei Pegeln statt drei Farben.
Der **Manchester-Code** legt in die Mitte jedes Bits einen Wechsel, von
niedrig nach hoch für eine 1 und von hoch nach niedrig für eine 0, so beim
Ethernet nach 10BASE-T und bei Infrarot-Fernbedienungen nach RC-5, die wie
eine LED Licht senden. Der Empfänger nimmt seinen Takt aus diesen Wechseln,
und der Preis ist, dass die Leitung zwei Wechsel pro Bit schaffen muss.
USB 1.x und 2.0 verwenden **NRZI**, wobei eine 0 ein Wechsel ist und eine 1
keiner, sodass eine lange Folge von Einsen die Leitung ohne Wechsel ließe;
nach sechs Einsen fügt der Sender deshalb eine zusätzliche 0 ein, die der
Empfänger wieder entfernt. Dieses **Bit-Stuffing** kostet höchstens ein
Siebtel der Rate, ganz ähnlich wie eine Marke.

## Ohne Uhr heißt nicht ohne Zeit

Der Empfänger weiß nicht, wie lange ein Symbol dauert, und er muss es auch
nicht wissen. Er misst, so oft er will, und behält nur die Farben in der
Reihenfolge, in der sie auftauchen. Während eines Wechsels misst der Sensor
allerdings Mischwerte, wie die Zeichnung zum Messfenster gezeigt hat, und ein
Empfänger, der jede Messung für bare Münze nähme, würde daraus Symbole
erfinden. Er braucht deshalb eine Schwelle, wie lange eine Farbe stillstehen
muss, bevor sie zählt. Häng diese Zeilen an das Programm oben an:

```python
from itertools import groupby

# der Empfänger misst etwa viermal pro Symbol; "mix" ist eine Messung
# während eines Wechsels, die zu keiner Farbe passt
readings = ["red", "red", "red", "mix", "green", "green", "green", "green",
            "mix", "red", "red", "red", "mix", "blue", "blue", "blue"]

colors = []
for color, run in groupby(readings):
    if len(list(run)) >= 2:      # eine Farbe muss stillstehen, bevor sie zählt
        colors.append(color)

print(colors)
print(decode(colors))
```

`groupby()` fasst Folgen gleicher Messwerte zusammen, und nur Folgen aus
mindestens zwei Messungen zählen als Farbe, sodass die drei Mischwerte
verschwinden und wieder `100` herauskommt. Setz die Schwelle auf 1, und der
Dekodierer stolpert über die Mischwerte. Zeit spielt außerdem noch auf eine
zweite Art eine Rolle, denn wie viele Wechsel pro Sekunde die Strecke
schafft, entscheidet, wie schnell sie ist, mit denselben Grenzen durch das
Messfenster wie zuvor. Länger als mit Uhr muss eine Farbe dabei nicht
stehen, denn die Schwelle zählt Messungen und keine Millisekunden: Ein
Empfänger, der oft misst, bringt seine zwei Messungen in einem gleich langen
Symbol unter, und auf beiden Wegen setzt das Messfenster das kürzeste
Symbol.

## Was der Wechsel an Bits kostet

Die Freiheit von der Uhr bezahlt man mit Kapazität. Als Zustände tragen
k Farben log₂ k Bits pro Symbol, als Wechsel aber nur log₂(k − 1), weil die
aktuelle Farbe als Nachfolger wegfällt:

```python
import math

for k in range(3, 10):
    print(f"{k} Farben: {math.log2(k):.2f} Bit als Zustände, "
          f"{math.log2(k - 1):.2f} als Wechsel")
```

Drei Farben tragen 1 Bit pro Wechsel statt 1,58, vier tragen 1,58 statt 2.
Hier steckt eine Falle für alle, die in Zweierpotenzen denken: Für saubere
zwei Bit pro Wechsel braucht man fünf Farben, nicht vier, und für drei Bit
neun. Ein Alphabet für Wechsel hat die Größe 2ⁿ + 1.

## Einen Weg wählen

Keiner der beiden Wege ist richtig oder falsch, und die Tabelle vergleicht,
was jeder von ihnen kostet:

| | mit gemeinsamem Takt | mit dem Wechsel als Takt |
|---|---|---|
| der Empfänger erkennt das nächste Symbol an | seiner Uhr | einem Wechsel im Licht |
| was schiefgehen kann | die Uhren laufen auseinander | Mischwerte zählen als Symbole |
| was hilft | Marken in festen Abständen | Mischwerte werden herausgefiltert |
| Preis | jede Marke ist ein Symbol ohne Daten | k Farben tragen nur log₂(k − 1) Bits |

Welche Strategie auch immer, am Ende zählt eine Rechnung: Die Zeit *t* für
eine Datei ist die Zahl der Bits *n* geteilt durch das Produkt aus Symbolen
pro Sekunde *r* und Bits pro Symbol *b*, also t = n / (r · b). Sie hat genau
zwei Hebel, und alles in dieser Lektion entscheidet über beide. In eine
Datei von 2 KiB passt etwa ein Schwarz-Weiß-Bild aus 128 × 128 Pixeln mit
einem Bit pro Pixel, das sind genau 16.384 Bits. Das Programm vergleicht die
beiden Wege für eine Datei dieser Größe mit vier Farben bei fünf
Symbolen pro Sekunde:

```python
import math

n = 2 * 1024 * 8    # 2 KiB in Bits
r = 5               # Symbole pro Sekunde

for name, b in [("mit Takt", 2), ("ohne Takt", math.log2(3))]:
    t = n / (r * b)
    print(f"{name}: {t / 60:.1f} Minuten")
```

Mit Takt braucht die Datei 27,3 Minuten, ohne 34,5, die Freiheit von der Uhr
kostet bei dieser Datei also etwa sieben Minuten. Der Vergleich lässt
allerdings die Marken weg: Bei einer Marke alle acht Symbole tragen nur
sieben von acht Symbolen Daten, und die Zeit mit Takt wächst auf
31,2 Minuten. Welcher Weg sich lohnt, hängt davon ab, wie weit deine Uhren
driften und wie sauber dein Sensor einen Wechsel sieht, und beides sind
Fragen für eine Messung an der eigenen Strecke. Wie weit sich die beiden
Hebel *r* und *b* überhaupt drehen lassen, ist eine eigene Frage, die nach
dem Durchsatz und seinen Grenzen.

## Das Wichtigste

- Der Empfänger sieht einen Strom aus Licht ohne Grenzen, und zwei gleiche
  Symbole hintereinander verschmelzen zu einem.
- Keine zwei Uhren laufen gleich, und ihr Fehler summiert sich von Symbol zu
  Symbol; weil der Empfänger in der Mitte eines Symbols misst, hat er
  höchstens ein halbes Symbol Spielraum, bevor er den Nachbarn liest, also
  kippt eine schnellere Strecke früher.
- Symbole, die kürzer sind als die Integrationszeit des Sensors, liefern
  Mischwerte, die zu keinem Symbol passen.
- Marken in festen Abständen setzen den Uhrenfehler zurück, und jede Marke
  kostet ein Symbol ohne Daten.
- Wenn der Wechsel das Bit trägt und keine Farbe auf sich selbst folgen darf,
  gibt es immer einen Wechsel zu sehen, und der Empfänger braucht keine Uhr.
- Die serielle Schnittstelle, DCF77 und VGA arbeiten mit Marken, das Ethernet
  nach 10BASE-T, RC-5 und USB mit Wechseln.
- Als Wechsel tragen k Farben nur log₂(k − 1) Bits, also brauchen zwei Bit
  pro Wechsel fünf Farben.
- Ohne Uhr müssen Mischwerte während eines Wechsels herausgefiltert werden,
  also spielt Zeit weiter eine Rolle, auch wenn eine Farbe nicht länger
  stehen muss als mit Uhr.
- Die Zeit für eine Datei ist t = n / (r · b), und die Wahl des Wegs
  entscheidet über beide Hebel.
