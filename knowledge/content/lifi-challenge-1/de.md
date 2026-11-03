---
type: challenge
code: 9618
title: "Challenge 1: Das Alphabet"
summary: >-
  Wie viele Farben unterscheidet eure Strecke in 20 Versuchen ohne einen Fehler? Die Antwort ist euer Alphabet für alles Weitere.
objectives:
  intro: "Mit dieser Challenge findest du mit deinem Team das Alphabet eurer Strecke und kannst danach:"
  goals:
    - "Sender und Empfänger vor jedem Durchgang kalibrieren"
    - "mit einer Kontrollmessung zeigen, ob ein Aufbau etwas bringt"
    - "aus der Zahl der Farben und Stellen die Zahl der Codewörter berechnen"
    - "Verwechslungen im Ergebnis auf ihre Ursache zurückführen"
level: 1
topics: [transferring-information, representing-information]
modules: [dup]
project: lifi
status: published
updated: 2026-11-03
---

Jetzt geht es um die Strecke selbst. Ein Sensor misst nie zweimal genau
dasselbe, Umgebungslicht stört, und der Abstand verändert alles. Die Frage
dieser Phase ist, wie viele Zustände euer Aufbau zuverlässig auseinanderhalten
kann, denn das ist euer Alphabet für alles Weitere.

Ein solches Alphabet ist ein Stellenwertsystem, und die Zahl eurer Farben ist
seine Basis: Wer vier Farben sicher unterscheidet, arbeitet zur Basis 4, und
eine Folge von Farben ist eine Zahl ([[place-value-systems]]). Daraus folgt
zweierlei für alles Weitere: Die Reihenfolge gehört zur Nachricht, denn
Rot-Gelb-Grün und Grün-Gelb-Rot sind verschiedene Codewörter, und die Rechnung
geht in beide Richtungen. Mit *k* Farben und *n* Stellen unterscheidet ihr
*k*ⁿ Codewörter, und wer weiß, wie viele Zeichen er braucht, kann ausrechnen,
wie viele Stellen das kostet.

**Ziel:** Herausfinden, wie viele Zustände eure Strecke in 20 Versuchen ohne
einen einzigen Fehler unterscheidet. Das entscheidet über das ganze Projekt:
Wer vier Zustände sicher unterscheidet, sendet später zwei Bit je Symbol, wer
sechzehn schafft, sendet vier und überträgt bei gleichem Tempo doppelt so viel.

**Neu ist,** dass ihr zum ersten Mal etwas über euren Aufbau herausfinden müsst,
statt es euch auszudenken. Wie viele Zustände unterscheidbar sind, weiß vorher
niemand, auch der KI-Assistent nicht, denn es hängt von eurem Sensor, eurem
Abstand, eurem Raum und dem ab, was ihr dazwischen baut.

**Aufgabe:** Der Sender zeigt eine Farbe aus einem Satz, den ihr selbst
festlegt, und der Empfänger sagt, welche es war. Timing spielt noch keine
Rolle, denn den Takt gibt in dieser Challenge das Testskript vor: Es zeigt
eine Farbe, wartet, bis der Empfänger gemessen hat, und nimmt dann die
nächste.

**Vier Aufgaben:** Zuerst zählt ihr mit bloßem Auge, dann bringt ihr eurem
Empfänger in `alphabet.py` bei, eure Farben zu lernen und wiederzuerkennen,
und zuletzt vergrößert ihr das Alphabet, erst ohne und dann mit eurem Aufbau.
So entstehen die drei Zahlen, die in eure Notizen gehören. Zu jeder Aufgabe
gibt es Tipps zum Aufklappen. Eine Musterlösung gibt es für diese Challenge
nicht; am Ende der Seite steht stattdessen ein Beispiel mit der Erklärung,
warum es keine gute Lösung ist.

**Die drei Ergebnisse dieser Challenge** (siehe [[lifi-challenges]]) sind damit die Messprotokolle ohne und mit Hilfsmitteln, als
Beschreibung eurer Lösung ein Foto des Aufbaus mit einem Satz, warum ihr ihn so
gebaut habt, und euer Irrtumsprotokoll. Für das letzte ist diese Challenge die
ergiebigste Quelle: Fragt ihr den Assistenten, warum die Röhre nicht hilft,
schlägt er mattschwarze Innenwände, Blenden und engere Öffnungen vor, alles
plausibel und nichts davon geprüft, bis ihr es gemessen habt.

## Eine Datei für alles

Für diese Challenge habt ihr genau eine Datei, `alphabet.py`, ganz gleich, ob
ihr mit einem Laptop arbeitet oder mit zwei. Das Testskript ruft drei eurer
Funktionen auf, nicht mehr; wie ihr sie innen baut, ist eure Sache, und eigene
Funktionen dürft ihr beliebig ergänzen.

| Teil | Was hineinkommt |
|---|---|
| `COLORS` | euer Alphabet, eine Farbe je Zeile; die erste Zeile ist Farbe 0 |
| `calibrate(readings)` | lernt aus den Messwerten, die der Test übergibt, wie jede Farbe beim Empfänger aussieht |
| `send_symbol(index)` | zeigt Farbe Nummer `index` auf der LED des Senders; diese Funktion ist schon fertig |
| `receive_symbol()` | misst und gibt die Nummer der Farbe zurück, die es erkannt hat |
| `run_test(...)` | die letzte Zeile; sie führt den Test aus, und ihr ändert sie nicht |

`sender.led` ist die LED des sendenden Geräts, `receiver.sensor` der Sensor
des empfangenden. Beides und `run_test` kommen aus dem Kursmodul ab Version
0.5.0 ([[lifi-hardware]]).

## Den Test starten

```text
python alphabet.py
```

Auf dem Mac heißt der Befehl `python3`, falls `python` nicht gefunden wird.

**Beide Geräte an einem Laptop:** Das Modul findet beide, lässt die LED des
einen leuchten und fragt, ob dieses Gerät sendet oder empfängt. Danach läuft
der Test von selbst: Farbe zeigen, messen, notieren, nächste Farbe.

**Je ein Gerät an zwei Laptops:** Ihr startet dieselbe Datei auf beiden
Laptops, und jeder fragt, ob er sendet oder empfängt. Der Kursserver bringt die
beiden über euer Team zusammen und sagt an, wann die nächste Farbe kommt, ihr
müsst sie also nicht im selben Moment starten. Beide Laptops brauchen dafür
WLAN.

Jeder Durchgang bekommt eine neue Zufallsfolge vom Kursserver, sodass niemand
sie vorher kennt. Am Ende zeigen beide Seiten das Ergebnis und jeden Fehler,
und der Durchgang erscheint in eurem [[lifi-cockpit|Team-Cockpit]]. Ohne
Server läuft mit beiden Geräten an einem Laptop trotzdem ein Übungsdurchgang,
der nicht zählt. Für schnelle Versuche zwischendurch genügen weniger
Versuche, dafür ändert ihr die letzte Zeile in
`run_test(send_symbol, receive_symbol, calibrate, symbols=len(COLORS), runs=5)`.
Gewertet werden nur Durchgänge mit 20 Versuchen.

## Aufgabe 1: Mit bloßem Auge zählen

Bevor ihr eine Zeile Code schreibt, zählt ihr, wie viele Farben ihr selbst
sicher unterscheidet, wenn ihr sie einzeln seht und nicht nebeneinander. In
manchem schlägt euer Auge den Sensor deutlich, in anderem verliert es klar,
und ein Grund dafür zählt für den Rest der Challenge: Euer Sehen kalibriert
sich ständig neu, wenn sich das Licht im Raum ändert, der Sensor dagegen
meldet einfach andere Zahlen.

**Datei:** keine; die Zahl kommt in eure Notizen.

> [!HINT]
> Eine Person lässt die LED Farben einzeln und in zufälliger Reihenfolge zeigen, etwa mit `task_3_color_cycle.py` aus Challenge 0, und die andere nennt jede Farbe, ohne sie mit einer anderen vergleichen zu können. Fangt mit wenigen, deutlich verschiedenen Farben an und nehmt nach und nach ähnlichere dazu.

## Aufgabe 2: Kalibrieren

Der Empfänger kann nicht ausrechnen, welches Symbol angekommen ist. Seine Messwerte hängen von Abstand, Raumlicht und dem
einzelnen Bauteil ab, und dieselbe Farbe ergibt nie zweimal genau dieselben
Zahlen. Er muss also erst lernen, wie eure Symbole in diesem Aufbau aussehen.
Vor jedem Durchgang zeigt `run_test` deshalb euer ganzes Alphabet einmal,
nimmt von jeder Farbe ein paar Messwerte auf und übergibt sie eurem
`calibrate(readings)`: `readings[0]` ist die Liste der Messwerte, während
Farbe 0 leuchtete, `readings[1]` die von Farbe 1 und so weiter, und jeder
Messwert hat die vier Kanäle `r`, `g`, `b` und `c`. Was ihr davon behaltet,
einen Mittelwert, einen Bereich oder eine Regel, entscheidet ihr. Im Test
vergleicht `receive_symbol()` dann jeden neuen Messwert damit und wählt die
ähnlichste Farbe. Kalibriert wird vor jedem Durchgang neu, auch bei der
Abnahme, denn nach dem Tragen und unter anderem Licht passen alte Werte nicht
mehr.

**Datei:** `alphabet.py`, die Funktion `calibrate(readings)`

> [!HINT]
> Die Vorlage behält von jeder Farbe nur den ersten Messwert. Ein Mittelwert über alle Messwerte einer Farbe ist ruhiger, weil sich die kleinen Schwankungen des Sensors dabei ausgleichen.

> [!HINT]
> `readings[index]` ist eine Liste von Messwerten, und `sum(reading.r for reading in readings[index]) / len(readings[index])` ist der Mittelwert des Rotkanals für diese Farbe. Dasselbe gilt für `g`, `b` und `c`, und alle vier zusammen legt ihr in `REFERENCES[index]` ab.

## Aufgabe 3: Erkennen

`receive_symbol()` misst einmal und gibt die Nummer der Farbe zurück, deren
Referenz aus der Kalibrierung dem Messwert am ähnlichsten ist. Die Vorlage
gibt bisher immer 0 zurück, besteht also nur, solange jede gesendete Farbe
zufällig Farbe 0 ist.

**Datei:** `alphabet.py`, die Funktion `receive_symbol()`

> [!HINT]
> Was „ähnlich“ heißt, legt ihr selbst fest. Naheliegend ist, wie weit der Messwert auf allen vier Kanälen zusammen von der Referenz einer Farbe entfernt liegt; die Farbe mit dem kleinsten Abstand gewinnt.

> [!HINT]
> Entscheidet nicht danach, welcher Kanal am größten ist. Das klappt für Rot, Grün und Blau in einem ruhigen Raum und versagt bei allem anderen; warum, steht unten im Abschnitt zum Beispiel.

## Aufgabe 4: Das Alphabet vergrößern

Jetzt messt ihr, wie viele Farben eure Strecke in 20 Versuchen ohne einen
Fehler unterscheidet, und zwar zweimal: zuerst ohne Hilfsmittel, also mit
nackter LED und nacktem Sensor und den Gehäusen Wand an Wand, und danach mit
eurem Aufbau, einer Röhre, einer Blende oder was euch einfällt.

Es zählt das Ergebnis mit eurem Aufbau. Ohne die Messung ohne Hilfsmittel wisst
ihr aber nicht, ob euer Aufbau überhaupt etwas gebracht hat, und genau darum gehört diese
Kontrollmessung dazu. Was ihr bauen dürft, steht unter [[lifi-device]].

**Datei:** `alphabet.py`, die Liste `COLORS`

> [!HINT]
> Fangt mit den beiden Farben an, die schon in `COLORS` stehen, also aus und weiß. Klappen damit 20 Versuche ohne Fehler, geht ihr auf 4, indem ihr das `#` vor den nächsten beiden Farben entfernt, und dann auf 8. Die letzte Größe ohne Fehler ist euer Ergebnis, und hoch zu pokern lohnt sich nicht, denn acht sicher erkannte Zustände sind mehr wert als sechzehn mit gelegentlicher Verwechslung.

> [!HINT]
> Bei Fehlern zeigt euch das Ergebnis, wie sie aussehen. Werden jedes Mal dieselben zwei Farben verwechselt, liegen sie zu dicht beieinander, und ihr ersetzt eine davon; sieht es zufällig aus, ist eher die Kalibrierung schuld.

## Abnahme

**Bei der Abnahme** lasst ihr den Test am eigenen Platz laufen, und die
Gehäuse von Sender und Empfänger berühren sich dabei mit den Wänden. Nicolas
geht durch die Reihen, sieht sich euren Aufbau an und prüft euer Ergebnis. Ein
einziger Fehler gilt für diese Alphabetgröße als nicht bestanden. Danach kann
eine Live-Änderung kommen, etwa „Geht auf zwölf Farben und lasst es noch
einmal laufen“, und dafür müsst ihr die Stellen in eurem Code finden, die von
der Größe des Alphabets abhängen.

## Ein Beispiel, keine Lösung

Eine Musterlösung gibt es für diese Challenge nicht. Hier steht stattdessen
der Empfänger aus Sitzung 4 in der Form von `alphabet.py`: Er nimmt das
Raumlicht als Grundwert (Baseline), zieht es von jedem Messwert ab und
entscheidet nach dem größten der drei Farbkanäle zwischen Rot, Grün und Blau.

```python static file=example.py
"""
Challenge 1: an example, not a solution
=======================================

This is the receiver written live in session 4, brought into the form of
alphabet.py. It works for red, green and blue in a quiet room, and it shows
nicely where a first idea breaks. Read the page "Why this is not a good
solution" before you build on it.

The idea in three steps:
  1. Baseline: what the sensor measures while the LED is off.
  2. Subtract the baseline from every new reading, so that what is left
     is the light of the sending LED.
  3. Whichever of r, g and b is largest after that decides the colour.

Run it with:  python example.py   (on a Mac: python3)
"""

from lifi_hardware import receiver, run_test, sender

COLORS = [
    (0, 0, 0),          # 0: off
    (255, 0, 0),        # 1: red
    (0, 255, 0),        # 2: green
    (0, 0, 255),        # 3: blue
]

# The room light, measured during calibration while colour 0 (off) showed
BASELINE = {"r": 0, "g": 0, "b": 0}


def calibrate(readings):
    """Keeps only the baseline: the average of the readings with the LED off."""
    off = readings[0]
    BASELINE["r"] = sum(reading.r for reading in off) / len(off)
    BASELINE["g"] = sum(reading.g for reading in off) / len(off)
    BASELINE["b"] = sum(reading.b for reading in off) / len(off)


def send_symbol(index):
    r, g, b = COLORS[index]
    sender.led.set_color(r, g, b)


def receive_symbol():
    r, g, b, c = receiver.sensor.read()

    # Subtract the room light
    r = r - BASELINE["r"]
    g = g - BASELINE["g"]
    b = b - BASELINE["b"]

    # The largest channel decides
    if r > g and r > b:
        return 1        # red
    elif g > r and g > b:
        return 2        # green
    else:
        return 3        # blue
    # Note what is missing: there is no way to answer 0 (off).


run_test(send_symbol, receive_symbol, calibrate, symbols=len(COLORS))
```

### Warum das keine gute Lösung ist

Das Beispiel funktioniert, und genau das macht es gefährlich. Sendet ihr Rot,
Grün und Blau in einem ruhigen Raum, erkennt es alle drei. In Sitzung 4 hat es
genau das vor allen gezeigt, und ein paar Sekunden später ging die LED aus, und
das Programm sagte „grün“. Hier steht, warum, und was sonst noch wartet.

**Aus hat keine Antwort.** Das Programm kann nur Rot, Grün oder Blau
zurückgeben, weil die Regel den größten von drei Kanälen wählt, und einen
größten gibt es immer. Ist die LED aus, bleibt nach dem Abziehen des
Grundwerts nur Rauschen übrig, auf jedem Kanal ein paar Zähler mehr oder
weniger. Einer davon ist zufällig der größte und gewinnt; in Sitzung 4 war es
Grün. Euer Empfänger braucht einen Weg zu sagen „da ist nichts“, also eine
Regel, die zuerst prüft, wie viel Licht angekommen ist, und erst dann fragt,
welche Farbe es war.

**Es gibt kein „weiß ich nicht“.** Das ist dasselbe Problem in allgemeiner
Form: Was auch immer gemessen wird, das Programm nennt mit voller Überzeugung
eine Farbe. Ein Messwert zwischen zwei Farben, eine Hand im Lichtweg, ein
Blitz vom Nachbarteam, alles kommt als Rot, Grün oder Blau heraus. Ein
Empfänger, der sagen kann „das sieht nach keiner meiner Farben aus“, merkt
wenigstens, dass etwas schiefging.

**Mischfarben sehen aus wie ihr stärkster Teil.** Gelb ist Rot und Grün
zugleich, Weiß ist alles drei. Die Regel schaut nur, welcher Kanal am größten
ist, also kommt Gelb als Rot oder Grün heraus, je nachdem, welcher Teil des
Sensors stärker reagiert, und Weiß als der Kanal, der gerade vorn liegt.
Sobald euer Alphabet über drei Farben hinauswächst, beschreibt „größter Kanal“
es nicht mehr. Ihr müsst dann den ganzen Messwert, alle Kanäle zusammen, mit
dem vergleichen, wie jede Farbe beim Kalibrieren aussah.

**Der Grundwert ist ein Foto eines Augenblicks.** Das Raumlicht wird einmal am
Anfang gemessen. Schaltet jemand die Deckenbeleuchtung ein, öffnet die
Jalousie oder beugt sich über den Tisch, stimmt der Grundwert für alles
Folgende nicht mehr, und jeder Messwert liegt um den Unterschied daneben.
Deshalb kalibriert der Test vor jedem Durchgang neu, und deshalb lohnt die
Frage, wie sehr euer eigener Empfänger leidet, wenn sich das Licht mitten im
Durchgang ändert.

**Euer Gerät ist nicht das Gerät des Nachbarteams.** Die Regel setzt voraus,
dass rotes Licht den Rotkanal zum größten macht. Das gilt nur, wenn die Filter
eures Sensors und die Farben eurer LED mitspielen. Ist der Grünkanal eines
Sensors schwächer, kann grünes Licht den Blaukanal zum größten machen, und die
Regel versagt bei diesem Gerät, während sie beim Gerät daneben funktioniert.
Genau dafür gibt es die Kalibrierung: Ihr müsst nichts über eure Bauteile
annehmen, sondern messt, wie jede Farbe auf eurem Gerät wirklich aussieht, und
entscheidet danach.

**Was daraus folgt:** Alle fünf Probleme haben dieselbe Ursache, denn das
Programm entscheidet nach einer festen Regel, die sich jemand ausgedacht hat,
statt nach den Messwerten der Kalibrierung. Ein besserer Empfänger behält, wie
jede Farbe beim Kalibrieren aussah, vergleicht einen neuen Messwert mit allen
davon und behandelt einen Messwert, der zu keiner passt, als Fehler, den er
bemerkt, statt als Farbe.

## Stolpersteine und mehr

**Typische Stolpersteine:** feste Schwellenwerte statt einer Kalibrierung vor
jedem Durchgang („über 500 im Rotkanal heißt Rot“ klappt am Dienstag und
versagt am Donnerstag, weil das Licht im Raum ein anderes ist; wer das bemerkt,
kommt auf die Kalibrierung, und das ist das stärkste Ergebnis dieser
Challenge), der ungefilterte Kanal C wird übersehen, obwohl er der
empfindlichste ist, zu wenige Wiederholungen beim Messen (wer jeden Zustand
dreimal ohne Fehler sieht, weiß noch nichts), und Farben, die schön aussehen,
statt Farben, die der Sensor gut unterscheidet.

**Für Schnelle:** Probiert verschiedene Integrationszeiten des Sensors aus und
messt, was sie am Ergebnis ändern. Längere Messungen sind ruhiger, erlauben aber
weniger Messungen pro Sekunde, und genau dieser Tausch entscheidet in
Challenge 4 über euren Durchsatz.
