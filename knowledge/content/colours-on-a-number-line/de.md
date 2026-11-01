---
type: experiment
code: 4111
title: Farben auf der Zahlengeraden
summary: >-
  Acht Farben über eine feste Strecke messen, ihre Werte im Clear-Kanal auf
  eine Zahlengerade eintragen und entscheiden, welche Farbe ihr streichen
  würdet, um sicher zu sein, erst ohne und dann mit eigener Optik.
objectives:
  intro: "In diesem Experiment vermisst du acht Farben über eine feste Strecke und kannst danach:"
  goals:
    - "für jede Farbe aus mehreren Ablesungen den kleinsten und den größten Wert des Clear-Kanals bestimmen und als Band auf einer Zahlengeraden eintragen"
    - "das Farbpaar mit der kleinsten Lücke finden und begründen, welche der beiden Farben du streichen würdest, um sicher zu sein"
    - "erklären, warum nicht der Abstand der Mittelwerte entscheidet, sondern ob sich die Bänder berühren"
    - "eine Kontrollmessung ohne Hilfsmittel und mit eigener Optik durchführen und beide Ergebnisse vergleichen"
    - "die Frage von Challenge 1, wie viele Zustände eure Strecke fehlerfrei unterscheidet, aus euren eigenen Messwerten stellen"
level: 1
duration: 50
topics: [transferring-information]
modules: [dup]
relations:
  requires: [sent-is-not-measured]
  see_also: [measuring-and-experimenting, analog-and-digital-slides, why-two-states]
status: draft
updated: 2026-11-01
---

Ihr sendet acht Farben über eure Strecke und tragt ein, wo jede auf einer
Zahlengeraden landet. Zwei davon liegen fast sicher dicht beieinander, und an
ihnen entscheidet ihr, wie groß euer Alphabet sein darf. Damit stellt ihr euch
die Frage von Challenge 1 selbst: Wie viele Farben kann der Sensor zuverlässig
unterscheiden?

## Was ihr braucht

- zwei Geräte mit RGB-LED und Farbsensor, an zwei Laptops oder beide an einem
- das Sendeprogramm und das Empfangsprogramm unten
- ein Lineal, Klebeband, Papier und Stift
- für die Kontrollmessung Material für eure eigene Optik, etwa Pappe, eine
  Röhre, schwarzes Papier oder Folie

## Aufbau

Stellt die beiden Geräte einander gegenüber, sodass die LED des einen in den
Sensor des anderen leuchtet, etwa acht Zentimeter auseinander wie in
[[sent-is-not-measured]]. Markiert die Position beider Geräte mit Klebeband,
denn der Abstand bleibt für das ganze Experiment derselbe. Notiert den
Abstand und ob das Deckenlicht an ist.

Mit zwei Laptops läuft das Sendeprogramm am einen und das Empfangsprogramm am
anderen. Hängen beide Geräte an einem Laptop, startet ihr die beiden Programme
in zwei Terminals, entfernt in jedem das `#` vor der Zeile mit `use_device` und
tragt die Kennung des jeweiligen Master Bricks aus dem Brick Viewer ein.

## Vorher: eure Erwartung

Schaut euch die acht Farben einmal mit bloßem Auge an, eine nach der anderen.
Schreibt auf, wie viele davon ihr sicher unterscheiden könnt und welche zwei
Farben eurer Meinung nach im Clear-Kanal `c` am dichtesten beieinanderliegen
werden.

## Die Programme

Das Sendeprogramm zeigt die acht Farben nacheinander, jeweils bis ihr die
Eingabetaste drückt.

```python static
from lifi_hardware import led, use_device

# only with both devices on one laptop: the UID of the sending master brick
# use_device("6qzRzc")

COLOURS = [
    ("Rot", 255, 0, 0),
    ("Orange", 255, 100, 0),
    ("Gelb", 255, 255, 0),
    ("Grün", 0, 255, 0),
    ("Cyan", 0, 255, 255),
    ("Blau", 0, 0, 255),
    ("Magenta", 255, 0, 255),
    ("Weiß", 255, 255, 255),
]

for name, r, g, b in COLOURS:
    led.set_color(r, g, b)
    input(f"{name} leuchtet, Enter für die nächste Farbe ")

led.set_color(0, 0, 0)
```

Das Empfangsprogramm fragt, welche Farbe gerade leuchtet, liest den Sensor
fünfmal ab und gibt die fünf Werte von `c` mit dem kleinsten und dem größten
aus. Eine leere Eingabe beendet es.

```python static
import time

from lifi_hardware import sensor, use_device

# only with both devices on one laptop: the UID of the receiving master brick
# use_device("Xy12Ab")

while True:
    name = input("Welche Farbe leuchtet? (leer = Ende) ")
    if name == "":
        break
    readings = []
    for _ in range(5):
        r, g, b, c = sensor.read()
        readings.append(c)
        time.sleep(0.2)
    print(name, readings, "kleinster:", min(readings), "größter:", max(readings))
```

## Runde 1: ohne Hilfsmittel

Messt alle acht Farben mit den nackten Geräten und tragt die fünf Ablesungen,
den kleinsten und den größten Wert in die erste Messtabelle ein.

## Runde 2: die Zahlengerade

Zeichnet auf Papier eine lange waagerechte Linie von null bis etwas über euren
größten Wert und tragt jede Farbe als kurzes Band vom kleinsten bis zum
größten Wert ein, mit ihrem Namen darüber. Sucht dann die beiden Farben, deren
Bänder am dichtesten beieinanderliegen oder sich sogar überlappen, und
entscheidet, welche der beiden ihr streichen würdet, um sicher zu sein.

Das Programm im Browser sortiert eure Bänder und rechnet die Lücke zwischen
benachbarten Farben aus; eine negative Lücke heißt, dass sich die beiden
Bänder überlappen. Ersetzt die Platzhalter durch eure eigenen Werte.

```python
# replace the placeholders with your own smallest and largest values of c
bands = {
    "Rot": (1000, 1050),
    "Orange": (1400, 1450),
    "Gelb": (2600, 2650),
    "Grün": (1800, 1850),
    "Cyan": (2400, 2450),
    "Blau": (900, 950),
    "Magenta": (2000, 2050),
    "Weiß": (3800, 3850),
}

ordered = sorted(bands, key=lambda name: bands[name][0])
for lower, upper in zip(ordered, ordered[1:]):
    gap = bands[upper][0] - bands[lower][1]
    print(f"{lower} bis {upper}: Lücke {gap}")
```

> [!TIP]
> Eine Lücke, die kleiner ist als die Breite der beiden Bänder, ist knapp.
> Fünf Ablesungen zeigen das Band nur ungefähr, und bei 50 Versuchen findet
> ein einzelner Ausreißer genau diese Lücke.

## Runde 3: mit eurer eigenen Optik

Baut jetzt eure Optik zwischen die beiden Geräte, etwa eine Röhre, eine
Abschirmung gegen das Deckenlicht oder eine feste Halterung, ohne die
markierten Positionen zu verändern. Erlaubt ist alles, was selbst kein Licht
erzeugt oder misst. Messt dieselben acht Farben noch einmal,
tragt sie in die zweite Messtabelle ein und zeichnet eine zweite Zahlengerade
unter die erste.

## Messtabelle ohne Optik

| Farbe | fünf Ablesungen von c | kleinster Wert | größter Wert |
|---|---|---|---|
| Rot | | | |
| Orange | | | |
| Gelb | | | |
| Grün | | | |
| Cyan | | | |
| Blau | | | |
| Magenta | | | |
| Weiß | | | |

## Messtabelle mit Optik

| Farbe | fünf Ablesungen von c | kleinster Wert | größter Wert |
|---|---|---|---|
| Rot | | | |
| Orange | | | |
| Gelb | | | |
| Grün | | | |
| Cyan | | | |
| Blau | | | |
| Magenta | | | |
| Weiß | | | |

## Eure Entscheidung

| | ohne Optik | mit Optik |
|---|---|---|
| dichtestes Paar | | |
| Lücke dieses Paars | | |
| gestrichene Farbe | | |
| Farben, die sicher bleiben | | |

## Auswerten

- Welche beiden Farben lagen am dichtesten beieinander? Stimmt das mit eurer
  Erwartung überein, und wie viele Farben konnte euer Auge unterscheiden, die
  der Sensor nicht auseinanderhält, oder umgekehrt?
- Warum genügt es nicht, dass zwei Farben verschiedene Mittelwerte haben?
- Welche Farbe habt ihr gestrichen, und warum gerade diese und nicht ihre
  Nachbarin? Wie viele Farben bleiben übrig, deren Bänder sich nicht berühren?
- Was hat eure Optik verändert: die Lage der Bänder, ihre Breite oder beides?
  Woran hättet ihr ohne die erste Messung gemerkt, ob sie überhaupt etwas
  bewirkt?
- Zwei Farben, die in `c` fast gleich liegen, können sich in `r`, `g` oder `b`
  deutlich unterscheiden. Was würde das für die Zahl eurer Farben bedeuten?
- Und die Frage, die bleibt, ist die von Challenge 1: Wie viele Farben behaltet
  ihr, wenn in 50 Versuchen kein einziger Wert in das Band einer anderen Farbe
  fallen darf?

Warum mehr Bereiche bei gleichem Rauschen enger werden, zeigen die Folien
[[analog-and-digital-slides]], und wie man eine solche Messreihe sauber anlegt, die
Folien [[measuring-and-experimenting]]. Dass Rechner aus demselben Grund mit
nur zwei Zuständen arbeiten, erklärt [[why-two-states]].

> [!NOTE]
> Mit einer ganzen Gruppe baut ein Team vorn auf, die Lehrperson gibt die acht
> Farben vor, und die Gruppe trägt die Werte gemeinsam auf einer Zahlengeraden
> an der Tafel ein, bevor sie entscheidet, welche zwei Farben gestrichen
> werden. Online bringt jedes Team seine eigene Messtabelle mit, und auf eine
> gemeinsame Zahlengerade kommen die Clear-Werte aller Teams für Rot und Blau;
> so sieht die Gruppe auch, wie verschieden dieselben Farben in verschiedenen
> Aufbauten landen.
