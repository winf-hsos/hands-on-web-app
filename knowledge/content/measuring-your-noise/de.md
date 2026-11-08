---
type: experiment
code: 8794
title: Die eigene Streuung messen
summary: >-
  Eine Farbe zehnmal ablesen, über wachsende Fenster mitteln und die Streuung
  ausrechnen, dann den Abstand zur Nachbarfarbe ins Verhältnis setzen und
  nachrechnen, wie viele Symbole zwischen Boden und Decke eurer Strecke passen.
objectives:
  intro: "In diesem Experiment misst du die Streuung deiner eigenen Strecke und kannst danach:"
  goals:
    - "aus zehn Ablesungen einer Farbe Mittelwert und Streuung `s` bestimmen"
    - "an euren eigenen Zahlen zeigen, wie das Mitteln über Fenster von 1, 3, 5 und 10 Ablesungen die Streuung verkleinert und was es an Zeit kostet"
    - "für zwei benachbarte Farben den Abstand `d` und das Verhältnis `d/s` berechnen und entscheiden, ob sich ihre Bänder berühren"
    - "aus Boden, Decke und der Breite eines Bandes ausrechnen, wie viele Symbole in eure Strecke passen, und das mit dem Alphabet vergleichen, das ihr tatsächlich erreicht habt"
level: 1
duration: 45
topics: [transferring-information]
modules: [dup]
relations:
  see_also: [signal-and-noise]
status: published
updated: 2026-11-09
---

Ihr messt eine einzige Farbe immer wieder, ohne etwas zu verändern, und seht,
wie weit die Zahlen trotzdem wandern. Aus dieser Streuung, dem Abstand zur
Nachbarfarbe und dem Bereich zwischen dunkelstem und hellstem Wert rechnet ihr
am Ende aus, wie viele Symbole eure Strecke tragen kann, und vergleicht das mit
dem Alphabet, das ihr in Challenge 1 erreicht habt. Das Experiment setzt
voraus, dass eure Strecke schon läuft: Die LED des einen Geräts leuchtet in den
Sensor des anderen, und ihr könnt beide aus Python ansprechen. Die zwölf
Aufgaben sind über die ganze Seite durchnummeriert.

## Was ihr braucht

- zwei Geräte mit RGB-LED und Farbsensor, an zwei Laptops oder beide an einem
- das Sendeprogramm und das Empfangsprogramm unten
- euren Aufbau aus Challenge 1, so wie ihr ihn zuletzt benutzt habt, mit
  markierter Position beider Geräte
- zwei Farben aus eurem Alphabet, die dicht beieinanderliegen, etwa das Paar,
  das am häufigsten verwechselt wurde
- Papier und Stift

## Aufbau

1. Stellt die beiden Geräte so auf, wie ihr sie in Challenge 1 benutzt habt,
   und notiert den Abstand und ob das Deckenlicht an ist. Danach verändert ihr
   bis zum Ende des Experiments nichts mehr daran: nicht den Abstand, nicht die Optik
   und nicht das Licht im Raum.

Mit zwei Laptops läuft das Sendeprogramm am einen und das Empfangsprogramm am
anderen. Hängen beide Geräte an einem Laptop, startet ihr die beiden Programme
in zwei Terminals, entfernt in jedem das `#` vor der Zeile mit `use_device` und
tragt die Kennung des jeweiligen Master Bricks aus dem Brick Viewer ein.

## Vorher: eure Erwartung

2. Schreibt auf, bevor ihr messt, wie weit zehn Ablesungen derselben Farbe im
   Clear-Kanal `c` auseinanderliegen werden, vom kleinsten bis zum größten
   Wert, und um wie viel ruhiger der Mittelwert wird, wenn ihr jeweils zehn
   Ablesungen zusammenfasst: zehnmal so ruhig oder weniger?

In Aufgabe 5 vergleicht ihr eure Erwartung mit euren Zahlen.

## Die Programme

Das Sendeprogramm zeigt nacheinander eure beiden Farben, dann Schwarz und Weiß,
jeweils so lange, bis ihr die Eingabetaste drückt.

```python static
from lifi_hardware import led, use_device

# only with both devices on one laptop: the UID of the sending master brick
# use_device("6qzRzc")

COLOURS = [
    ("Farbe A", 255, 0, 0),      # replace with the first colour of your pair
    ("Farbe B", 255, 60, 0),     # replace with its neighbour
    ("Boden", 0, 0, 0),
    ("Decke", 255, 255, 255),
]

for name, r, g, b in COLOURS:
    led.set_color(r, g, b)
    input(f"{name} leuchtet, Enter für die nächste ")

led.set_color(0, 0, 0)
```

Das Empfangsprogramm fragt, was gerade leuchtet, und misst dann für jedes
Fenster zehn Werte: beim Fenster 1 zehn einzelne Ablesungen, beim Fenster 3
zehn Mittelwerte aus je drei Ablesungen und so weiter. Für jedes Fenster gibt es
die zehn Werte, ihren Mittelwert und ihre Streuung `s` aus und sagt, wie lange
die Messung gedauert hat. Oben im Programm stellt ihr Verstärkung und
Integrationszeit des Sensors ein, und zwar genau so wie in eurer `alphabet.py`
aus Challenge 1, damit die Streuung zu eurem Alphabet passt. Der Sensor misst in
seinem eigenen Takt, eine Messung je Integrationszeit, und `sensor.read()` holt
die jüngste fertige Messung, ohne zu warten. Wer schneller liest, bekommt
denselben Wert mehrmals und hält ihn für eine ruhige Strecke; deshalb wartet das
Programm zwischen zwei Ablesungen etwas länger als eine Integrationszeit. Mit
154 ms dauert ein Durchgang gut eine halbe Minute, mit 700 ms über zwei Minuten,
und eine leere Eingabe beendet das Programm.

```python static
import statistics
import time

from lifi_hardware import sensor, use_device

# only with both devices on one laptop: the UID of the receiving master brick
# use_device("Xy12Ab")

GAIN = 16                # the same two settings as at the top of your alphabet.py
INTEGRATION_TIME = 154   # in ms: 2.4, 24, 101, 154 or 700
WINDOWS = [1, 3, 5, 10]

sensor.set_gain(GAIN)
sensor.set_integration_time(INTEGRATION_TIME)
# the sensor measures once per integration time, and read() returns the newest
# finished measurement without waiting: so wait a little longer than one
# integration time between two readings, and two before the first
PAUSE = INTEGRATION_TIME / 1000 + 0.02
time.sleep(2 * INTEGRATION_TIME / 1000)


def mean_of(n):
    values = []
    for _ in range(n):
        r, g, b, c = sensor.read()
        values.append(c)
        time.sleep(PAUSE)
    return sum(values) / n


while True:
    name = input("Was leuchtet gerade? (leer = Ende) ")
    if name == "":
        break
    for n in WINDOWS:
        start = time.time()
        means = [mean_of(n) for _ in range(10)]
        seconds = (time.time() - start) / 10
        print(f"{name}, Fenster {n}: {[round(m) for m in means]}")
        print(f"   Mittelwert {statistics.mean(means):.1f}, Streuung s {statistics.stdev(means):.1f}, "
              f"{seconds:.1f} s je Wert")
```

3. Tragt im Sendeprogramm oben eure beiden Farben ein und im Empfangsprogramm
   `GAIN` und `INTEGRATION_TIME` aus eurer `alphabet.py`, notiert beide Werte
   und startet das Sendeprogramm auf dem sendenden Gerät, das Empfangsprogramm
   auf dem empfangenden.

## Eine Farbe zehnmal ablesen

4. Lasst Farbe A leuchten, gebt im Empfangsprogramm ihren Namen ein und tragt
   für jedes Fenster die zehn Werte, ihren Mittelwert, die Streuung `s` und die
   Sekunden je Wert in die Tabelle ein.

Die Zeile für das Fenster 1 sind eure zehn Ablesungen derselben Farbe, in
denen sich nichts verändert hat außer den Zahlen.

| Fenster | zehn Werte | Mittelwert | Streuung s | Sekunden je Wert |
|---|---|---|---|---|
| 1 | | | | |
| 3 | | | | |
| 5 | | | | |
| 10 | | | | |

Wer die Streuung lieber selbst nachrechnet, setzt die zehn Werte einer Zeile in
das Programm im Browser ein:

```python
import statistics

# replace the placeholders with the ten values of one row of your table
values = [214, 211, 218, 209, 216, 213, 220, 207, 215, 212]

mean = statistics.mean(values)
s = statistics.stdev(values)
print(f"Mittelwert {mean:.1f}, Streuung s {s:.1f}")
```

> [!TIP]
> Die Streuung `s` ist die Standardabweichung: Etwa zwei Drittel der Werte
> liegen weniger als `s` vom Mittelwert entfernt, und fast alle, 997 von 1000,
> weniger als `3 · s`. Eine Farbe belegt deshalb ein Band von etwa `6 · s`
> Breite, `3 · s` nach unten und `3 · s` nach oben.

5. Lest in der Zeile für das Fenster 1 ab, wie weit eure zehn Ablesungen
   auseinanderliegen und wie groß ihre Streuung `s` ist, und vergleicht beides
   mit eurer Erwartung aus Aufgabe 2.
6. Rechnet aus, auf welchen Bruchteil die Streuung vom Fenster 1 zum Fenster
   10 geschrumpft ist und was das an Sekunden je Wert gekostet hat.

> [!SOLUTION]
> Wer mehrere Ablesungen mittelt, verkleinert die Streuung ungefähr um die
> Wurzel aus ihrer Zahl: beim Fenster 3 auf knapp 0,6, beim Fenster 5 auf
> knapp 0,45 und beim Fenster 10 auf etwa 0,32, also auf ein Drittel und nicht
> auf ein Zehntel. Die Antwort auf Aufgabe 2 lautet deshalb „weniger“. Dafür
> dauert jeder Wert so viel länger, wie er Ablesungen enthält: Mit einer
> Integrationszeit von 154 ms braucht ein Wert im Fenster 10 rund 1,7 Sekunden
> statt knapp einer Fünftelsekunde. Das Mitteln im Programm ist damit derselbe
> Handel wie eine längere Integrationszeit im Sensor. Schrumpft eure Streuung deutlich weniger, wandert vermutlich
> etwas langsam mit, etwa das Licht im Raum, und eine solche Drift lässt sich
> durch Mitteln nicht wegmitteln.

## Die Nachbarfarbe und das Verhältnis d/s

7. Lasst jetzt Farbe B leuchten und messt genauso wie in Aufgabe 4.
8. Rechnet für jedes Fenster den Abstand `d` zwischen den beiden Mittelwerten
   aus, nehmt die größere der beiden Streuungen als `s`, teilt `d` durch `s`
   und tragt alles in die Tabelle ein.

Die beiden Bänder berühren sich nicht, solange `d` größer ist als `6 · s`,
also solange `d/s` über 6 liegt.

| Fenster | Mittelwert A | Mittelwert B | Abstand d | größeres s | d/s | Bänder getrennt? |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 3 | | | | | | |
| 5 | | | | | | |
| 10 | | | | | | |

9. Lest ab, ab welchem Fenster die Bänder eurer beiden Farben getrennt sind,
   und schreibt auf, was es für euer Tempo hieße, dieses Fenster immer zu
   benutzen.

> [!SOLUTION]
> Das Mitteln verschiebt die Mittelwerte kaum, der Abstand `d` bleibt also
> über alle Fenster ungefähr gleich, und nur `s` schrumpft. Deshalb wächst
> `d/s` mit der Wurzel aus dem Fenster: Ein Paar mit `d/s` = 3 im Fenster 1
> kommt im Fenster 5 auf etwa 6,7 und ist dort getrennt. Jedes Symbol braucht
> dann aber fünf Ablesungen statt einer, und eure Strecke überträgt nur noch
> ein Fünftel so viele Symbole pro Sekunde. Liegt `d/s` schon im Fenster 1
> unter 2, reicht selbst das Fenster 10 kaum, und es lohnt sich eher, zwei
> Farben zu wählen, die weiter auseinanderliegen.

## Wie viele Symbole passen?

10. Messt den Boden mit ausgeschalteter LED und die Decke mit weißer LED, beide
    in dem Fenster, das ihr für eure Übertragung verwenden würdet.

Der Bereich ist die Decke minus der Boden, ein Band ist `6 · s` breit, und der
Bereich geteilt durch die Breite eines Bandes sagt, wie viele Symbole
hineinpassen, wenn ihr sie gleichmäßig verteilt.

```python
# replace the placeholders with your own values
floor = 40      # c with the LED off
ceiling = 840   # c with the LED white
s = 8.3         # the larger spread of your two colours, in the window you use

band = 6 * s
symbols = int((ceiling - floor) // band)
print(f"Bereich {ceiling - floor}, Band {band:.0f} breit, Platz für {symbols} Symbole")
```

11. Setzt Boden, Decke und die größere Streuung in das Programm ein und tragt
    das Ergebnis in die Tabelle ein, zusammen mit dem Alphabet, das ihr in
    Challenge 1 tatsächlich erreicht habt.

| | Wert |
|---|---|
| Fenster | |
| Boden (LED aus) | |
| Decke (LED weiß) | |
| Bereich | |
| Breite eines Bandes (6 · s) | |
| Symbole, die hineinpassen | |
| euer Alphabet aus Challenge 1 | |

12. Vergleicht die Rechnung mit eurem Alphabet. Verspricht sie mehr Symbole,
    als ihr erreicht habt, schreibt auf, was die Rechnung annimmt, das an
    eurer Strecke nicht stimmt.

> [!SOLUTION]
> Die Rechnung nimmt an, dass eure Farben gleichmäßig zwischen Boden und Decke
> verteilt liegen, dass alle gleich stark streuen und dass das Licht zwischen
> Kalibrieren und Messen gleich bleibt. Meist stimmt mindestens eines davon
> nicht: Farben liegen in `c` gedrängt, helle Farben streuen stärker als
> dunkle, oder das Licht hat sich verändert.

## Auswertung

- Die Rechnung kennt nur den Kanal `c`, also nur die Helligkeit. Was bedeutet
  das für die Zahl der Symbole, die eure Strecke tragen kann?

- Welche Maßnahme würdet ihr als Nächstes ausprobieren, um `d/s` zu
  vergrößern: einen kürzeren Abstand, eine Abschirmung gegen das Raumlicht,
  Farben, die weiter auseinanderliegen, oder ein längeres Fenster? Was kostet
  jede davon?
- Würdet ihr lieber viele Symbole mit einem langen Fenster senden oder wenige
  mit einem kurzen, wenn ihr in derselben Zeit möglichst viel übertragen
  wollt? Im [[distinguishability-lab]] könnt ihr beides ausprobieren, bevor
  ihr euch für eure eigene Strecke entscheidet.

> [!SOLUTION]
> Zwei Farben, die in `c` fast gleich liegen, können sich in `r`, `g` oder `b`
> deutlich unterscheiden. Vergleicht euer Empfänger alle drei Farbkanäle, kann
> die Strecke deshalb mehr Symbole tragen, als die Rechnung mit `c` allein
> ergibt.

Warum über die Größe des Alphabets nichts anderes entscheidet als das
Verhältnis `d/s` und was jede Maßnahme dagegen kostet, erklärt die Lektion
[[signal-and-noise]] mit ihren Folien, und dort steht auch, wie man eine
Messreihe sauber anlegt, mit Kontrollmessung und genau einer veränderten
Größe.

> [!NOTE]
> Mit einer ganzen Gruppe misst jedes Team seine eigene Streuung und trägt drei
> Zahlen in eine gemeinsame Tabelle an der Tafel ein: das erreichte Alphabet,
> `d/s` beim Fenster 1 und die Zahl der Symbole, die nach der Rechnung
> hineinpassen. Sortiert nach dem erreichten Alphabet sieht die Gruppe dann,
> ob die Rangfolge der Teams der Rangfolge von `d/s` folgt und welche Teams
> davon abweichen.
