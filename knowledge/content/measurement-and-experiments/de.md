---
title: Messen und Experimentieren
summary: >-
  Warum eine einzelne Ablesung noch kein Beleg ist: wie aus einer Behauptung
  ein Test wird, was ein Sensor wirklich liefert, warum Messwerte streuen, was
  Mitteln und Integrationszeit kosten und wie eine kontrollierte Messreihe mit
  einer veränderten Größe zu einer Entscheidung führt.
objectives:
  intro: "Am Beispiel eines Farbsensors, der das Licht einer LED misst, zeigt dir diese Lektion, warum eine einzelne Ablesung noch kein Beleg ist, und danach kannst du:"
  goals:
    - "aus einer Behauptung einen Test machen, mit einer Frage, einer vorher notierten Vorhersage, einer Messung und einem Vergleich"
    - "erklären, warum der Sensor vier Zahlen `r`, `g`, `b` und `c` statt einer Farbe liefert und die gemessenen Werte von den gesendeten abweichen"
    - "begründen, warum Messwerte streuen und deshalb Mittelwert und Streuung zusammen ins Messprotokoll gehören"
    - "mit einer Simulation in Python zeigen, wie das Mitteln Fehlentscheidungen beseitigt, und abwägen, wie Mittelung und Integrationszeit sie gegen eine geringere Symbolrate tauschen"
    - "eine kontrollierte Messreihe planen, mit vorher notierter Erwartung, Kontrollmessung bei ausgeschalteter LED, genau einer geänderten Größe und genügend Wiederholungen"
    - "begründen, warum fünf Treffer in Folge Glück sein können, fünfzig aber nicht"
    - "durch Kalibrieren Referenzwerte bekannter Farben aufnehmen und eine neue Ablesung der nächstgelegenen Wolke zuordnen"
translation_of: en
based_on: 2026-11-04
---

![Folien: Messen und Experimentieren](item:measurement-and-experiments-slides)

Zweitausend Jahre lang glaubte man Aristoteles, dass schwere Körper schneller
fallen als leichte, weil es plausibel klang. Der Legende nach ließ Galilei zwei
unterschiedlich schwere Kugeln vom schiefen Turm von Pisa fallen, beide kamen
im selben Augenblick unten an, und eine Messung entschied, was Nachdenken und
Autorität nicht entscheiden konnten. Jeder Aufbau auf einem Tisch ist so ein
Turm: Ein KI-Assistent kennt Sensoren dieser Art und kann gute Gründe nennen,
aber nur eine Messung kennt genau diesen. Die Beispiele dieser Lektion
verwenden einen Farbsensor, der das Licht einer LED misst, wie bei einer
Strecke, die Daten mit Licht überträgt, und jeder andere Sensor verhält sich
im Prinzip genauso.

## Drei Arten zu antworten

Nimm die Frage, ob eine längere Integrationszeit, also ein längeres
Ablesefenster des Sensors, die Erkennung verbessert. Eine plausible Erklärung
sagt, warum das gelten könnte: Längere Messungen sammeln mehr Licht. Eine
KI-Vorhersage geht weiter und hängt eine Anweisung an die Behauptung:
Verdopple die Integrationszeit, dann wird die Erkennung besser. Beides bleiben
Behauptungen, so gut sie auch begründet sind, und erst eine Messreihe am
eigenen Aufbau zeigt, ob der Effekt eintritt und wie stark er ist, etwa 41 von
50 richtig erkannten Zeichen mit dem kurzen Fenster und 47 von 50 mit dem
langen.

## Aus einer Behauptung wird ein Test

Ein Experiment macht aus einer solchen Behauptung in vier Schritten einen
Test:

1. eine **Frage**: Verbessert ein längeres Fenster die Erkennung?
2. eine **Vorhersage**, vor dem Messen aufgeschrieben: Mit doppeltem Fenster
   werden mehr Zeichen richtig erkannt
3. eine **Messung** unter kontrollierten Bedingungen: je 50 Zeichen mit dem
   kurzen und mit dem langen Fenster
4. ein **Vergleich** des Ergebnisses mit der Vorhersage: 41 gegen 47 richtige
   stützen die Hypothese, und das umgekehrte Ergebnis würde sie widerlegen

Die Reihenfolge ist entscheidend, denn wer zuerst misst und erst hinterher
festlegt, welches Ergebnis als Erfolg zählt, kann fast jedes Ergebnis als
passend lesen. Eine vorher notierte Erwartung schützt dich davor, die eigenen
Hoffnungen nachträglich in die Daten hineinzulesen.

## Was ein Sensor liefert

Ein Farbsensor liefert keine Farbe, sondern vier Zahlen: die Anteile von Rot,
Grün und Blau, hinter Farbfiltern gemessen und `r`, `g` und `b` geschrieben,
und einen vierten Wert `c` für *Clear*, der ohne Filter misst. Weil Clear das
gesamte einfallende Licht sieht, ist er empfindlicher als die Farbkanäle und
der nützlichste Wert, wenn du nur hell von dunkel unterscheiden musst. Im
Muster aus Eingabe, Verarbeitung und Ausgabe sind diese vier Zahlen die
Eingabe des empfangenden Programms, und erst die Verarbeitung macht daraus
einen Namen wie `"red"`.

Keine dieser Zahlen entspricht dem, was die LED bekommen hat. Stellst du die
LED auf reines Rot, `(255, 0, 0)`, misst der Sensor etwa `r=203, g=41, b=57`
und `c=310`, weil sich die Farbfilter überlappen, Abstand und Winkel Licht
schlucken und das Raumlicht immer mitgemessen wird. Das ist kein Defekt,
sondern der Normalfall, und es hat eine Folge: Du rechnest nicht von den
Messwerten auf das Gesendete zurück, denn eine Formel, die heute passt,
versagt am nächsten Tisch oder am nächsten Tag. Stattdessen arbeitest du mit
den Messwerten deines eigenen Aufbaus, und der Abschnitt über das Kalibrieren
zeigt, wie ein Programm daraus entscheidet, welche Farbe angekommen ist.

## Erst das Dunkel messen

Bevor du eine Farbe misst, misst du das Dunkel, denn ein Sensor zeigt nie
Null: Etwas Raumlicht kommt immer an. Deshalb beginnt jede Messreihe mit einer
**Kontrollmessung** bei ausgeschalteter LED. Sie ist der Nullpunkt, gegen den
du jede Farbe liest, denn jede Ablesung enthält zugleich Umgebungslicht, das
Licht der LED und Rauschen, und was die LED beiträgt, ist der Unterschied
zwischen einer Ablesung und diesem Umgebungspegel. Die Kontrollmessung verrät
dir außerdem, wenn sich die Umgebung ändert, durch Nachmittagssonne oder die
LED einer Nachbargruppe, denn dann wandert auch der Dunkelwert.

## Eine Ablesung ist ein Wurf

Liest du dieselbe rote LED fünfmal ab, ohne etwas zu verändern, bekommst du
fünf verschiedene Werte, etwa 198, 205, 201, 195 und 206. Keiner davon ist der
wahre, und doch ist jeder eine echte Messung, denn jede echte Messung streut:
Das Licht flackert, die Elektronik rauscht, jemand geht am Fenster vorbei.
Fünf gleiche Werte wären verdächtiger als fünf verschiedene. Eine einzelne
Ablesung ist ein Wurf aus einer Verteilung, und erst mehrere Ablesungen
zeigen, wo die Werte üblicherweise liegen und wie stark sie schwanken. Eine
einzelne Ablesung springt, während der Mittelwert mehrerer ruhig liegt, und
wenn du einen stabilen Wert brauchst, liest du deshalb mehrmals ab und
mittelst.

## Wie viele Ablesungen je Entscheidung?

Wie viel das ausmacht, zeigt sich, sobald ein Empfänger entscheiden muss. Ein
Sender schaltet seine LED abwechselnd aus und ein, und der Empfänger liest den
Sensor und entscheidet an einer Schwelle, welches der beiden Zeichen
angekommen ist. Die Zeichnung lässt dieselben Ablesungen dreimal entscheiden:
aus einer einzelnen Ablesung, aus dem Mittel von fünf und aus dem Mittel von
zehn.

![Drei waagrechte Spuren mit einer gestrichelten Schwelle in der Mitte und je dreißig Punkten, abwechselnd darunter und darüber. In der oberen Spur, eine Ablesung je Entscheidung, liegen drei Punkte auf der falschen Seite und sind rot. In den Spuren für das Mittel aus fünf und aus zehn liegt jeder Punkt auf seiner Seite. Rechts stehen die Kosten: 30 Ablesungen und 20 Zeichen pro Sekunde, 150 Ablesungen und 4 Zeichen pro Sekunde, 300 Ablesungen und 2 Zeichen pro Sekunde.](figure:decisions "Dreißig Entscheidungen aus denselben Ablesungen. Ein Punkt auf der falschen Seite der gestrichelten Schwelle ist eine Fehlentscheidung.")

Drei der dreißig Einzelablesungen landen auf der falschen Seite der Schwelle,
keiner der Mittelwerte dagegen. Der Preis steht rechts: Dieselben dreißig
Entscheidungen brauchen fünf- oder zehnmal so viele Ablesungen, und ein
Sensor, der zwanzig Ablesungen pro Sekunde liefert, trägt dann vier oder zwei
Zeichen pro Sekunde statt zwanzig. Das Programm unten simuliert einen solchen
Empfänger. `random.gauss()` zieht eine Ablesung, die um einen Pegel mit einer
vorgegebenen Streuung schwankt, hier 300 für aus und 700 für ein, und alles
unter 500 gilt als aus:

```python
import random
import statistics

random.seed(1)
noise = 130       # how much a single reading wobbles
threshold = 500   # below means off, above means on
wrong = {1: 0, 5: 0, 10: 0}

for i in range(30):
    level = 700 if i % 2 else 300      # off and on, one after the other
    readings = [random.gauss(level, noise) for _ in range(10)]
    for n in wrong:
        value = statistics.mean(readings[:n])
        if (value > threshold) != (level > threshold):
            wrong[n] += 1

for n, count in wrong.items():
    print(f"{n} Ablesung(en) je Entscheidung: {count} von 30 falsch, {30 * n} Ablesungen")
```

Bei einer Streuung von 130 liegen die Einzelablesungen bei 3 der 30 Zeichen
falsch, und beide Mittelwerte treffen jedes. Setz `noise` auf 250, wie in
einem unruhigeren Raum, dann liegen die Einzelablesungen 8-mal falsch, und
selbst das Mittel aus fünf rutscht einmal ab. Lösch danach die Zeile mit
`random.seed(1)`: Jeder Lauf zieht dann neue Ablesungen, und die Zahlen
ändern sich von Lauf zu Lauf, genau wie bei einer echten Messung. Welcher Fall
zutrifft, hängt vom Aufbau ab, denn bei wenig Rauschen entscheidet schon die
einzelne Ablesung richtig, und das Mitteln kostet nur Zeit. Wie viele
Ablesungen eine Entscheidung braucht, sagt dir deshalb nur eine Messung an
deinem eigenen Aufbau.

## Mitte und Streuung gehören zusammen

Der Mittelwert sagt ungefähr, wo eine Messreihe liegt, aber nicht, wie
verlässlich ein einzelner Wert in seiner Nähe liegt, und zwei Reihen können
denselben Mittelwert und sehr unterschiedliche Streuungen haben.
`statistics.stdev()` misst diese Streuung als Standardabweichung, ungefähr den
typischen Abstand eines Werts vom Mittelwert. Das Programm vergleicht die fünf
ruhigen Ablesungen von oben mit fünf unruhigen und zählt, wie viele Werte über
230 liegen, wo die nächste Farbe beginnen könnte:

```python
import statistics

calm = [198, 205, 201, 195, 206]
restless = [150, 260, 180, 240, 175]

for name, series in [("ruhig", calm), ("unruhig", restless)]:
    mean = statistics.mean(series)
    spread = round(statistics.stdev(series))
    beyond = sum(1 for value in series if value > 230)
    print(f"{name}: Mittelwert {mean}, Streuung {spread}, {beyond} über 230")
```

Beide Reihen haben den Mittelwert 201, aber die ruhige streut um 5 und die
unruhige um 47, und zwei ihrer fünf Werte liegen schon im Bereich der nächsten
Farbe. Wer nur den Mittelwert aufschreibt, versteckt genau die Schwankung, die
später zu falsch erkannten Zeichen führt, und deshalb gehören die einzelnen
Werte oder wenigstens ein Maß der Streuung mit ins Protokoll.

## Der Regler: die Integrationszeit

Die **Integrationszeit** ist das Ablesefenster des Sensors und bestimmt, über
wie viel Licht ein einzelner Wert mittelt. Ein langes Fenster liefert ruhige
Werte, aber wenige pro Sekunde, ein kurzes viele Ablesungen, die stärker
streuen, bis einzelne in den Bereich einer anderen Farbe rutschen.

![Drei Zeilen zeigen dieselbe Sekunde. Jede Ablesung ist ein Balken, dessen Breite sein Zeitfenster ist: vier breite Balken in der oberen Zeile, acht in der mittleren und zwölf schmale unten. Je breiter die Balken, desto näher bleiben sie an der Mitte eines grauen Bandes; in der unteren Zeile verlassen zwei Balken das Band und sind rot.](figure:integration "Dieselbe Sekunde, gelesen mit langen, mittleren und kurzen Fenstern. Je kürzer das Fenster, desto mehr Ablesungen, und desto stärker streuen sie.")

Länger ist ruhiger und kürzer ist schneller, und dieser Zielkonflikt kehrt bei
jeder Übertragung mit einem Sensor wieder, weil die Zeichenrate davon abhängt.
Die **Verstärkung** ist der zweite Regler: Sie skaliert die Werte und mit
ihnen das Rauschen, und zu viel davon treibt den Sensor in die Sättigung. Wo
die beste Einstellung liegt, hängt von Abstand, Raumlicht und Optik ab, und
deshalb kann eine Tabelle oder ein Assistent einen Startwert vorschlagen, aber
nur eine Messreihe am Aufbau selbst findet die Grenze. [[signal-and-noise]]
rechnet aus, was die Einstellung für die Zahl der Zeichen bedeutet, die eine
Strecke tragen kann.

## Gezielt messen

Eine **Messreihe** besteht aus mehreren Ablesungen unter gleichen,
festgehaltenen Bedingungen, bei denen höchstens eine Größe gezielt verändert
wird. Ändert eine Gruppe Abstand und Integrationszeit zugleich und eine
andere nur den Abstand, sehen vielleicht beide ihre Erkennung besser werden,
aber nur die zweite weiß, woran es lag, während bei der ersten zwei mögliche
Ursachen vermischt bleiben. Eine Messreihe folgt vor, während und nach dem
Messen ein paar Regeln:

| Wann | Was du machst | Warum |
|---|---|---|
| vorher | die Bedingungen und das erwartete Ergebnis aufschreiben | ohne notierte Erwartung lässt sich hinterher fast jedes Ergebnis als Erfolg lesen |
| währenddessen | genau eine Größe verändern, eine Kontrollmessung machen, oft genug wiederholen | nur dann lässt sich ein Unterschied seiner Ursache zuordnen |
| nachher | jeden Wert behalten, mit der Erwartung vergleichen, das Ergebnis festhalten | Ausreißer sind oft die interessanteste Information |

Ins Protokoll gehören deshalb die Bedingungen, die veränderte Größe, die Zahl
der Wiederholungen und alle Werte, auch die unbequemen. Ein wiederholbares
Ergebnis ist mehr wert als ein beeindruckendes.

## Glück oder Können

Wiederholungen schützen dich vor einem Glückstreffer. Ein Empfänger, der nur
Rot von Blau unterscheiden soll, liegt durch reines Raten jedes zweite Mal
richtig, und fünf Treffer in Folge beweisen deshalb wenig. Das Programm lässt
jemanden tausend Versuche mit je fünf Entscheidungen raten und zählt die
Versuche ohne einen einzigen Fehler:

```python
import random

random.seed(4)
lucky = 0
for attempt in range(1000):
    hits = 0
    for trial in range(5):
        guess = random.choice(["red", "blue"])
        sent = random.choice(["red", "blue"])
        if guess == sent:
            hits += 1
    if hits == 5:
        lucky += 1
print(lucky, "von 1000 Versuchen treffen durch Raten 5 von 5")
```

Etwa jeder 32. Versuch gelingt durch Zufall, hier 32 von 1000, denn die
Chance auf fünf Treffer in Folge ist 0,5⁵ = 1/32, und in einem Raum voller
Gruppen passiert eine solche Glückssträhne ständig irgendwo. Fünfzig Treffer
in Folge haben eine Chance von eins zu 2⁵⁰, also eins zu
1.125.899.906.842.624, und kommen durch Glück praktisch nie vor. Deshalb wird
ein Empfänger mit langen Serien geprüft.

## Erst kalibrieren, dann klassifizieren

Zurück zu den vier Zahlen, die nie mit dem Gesendeten übereinstimmen. Statt
aus ihnen zurückzurechnen, **kalibrierst** du, indem du jede Farbe, die du
senden willst, unter den Bedingungen deines Aufbaus mehrmals misst und diese
Werte als Referenzen aufhebst, und dann **klassifizierst** du, indem du jede
neue Ablesung der nächstgelegenen Gruppe von Referenzen zuordnest. In einem
Koordinatensystem bilden die Referenzen Wolken:

![Ein Koordinatensystem mit dem Rotanteil r nach rechts und dem Blauanteil b nach oben. Sechs rote Referenzwerte bilden unten rechts eine Wolke, sechs blaue oben links. Eine neue Ablesung bei r 170, b 80 ist mit gestrichelten Linien mit beiden Wolken verbunden; die kürzere Linie zur roten Wolke ist hervorgehoben, und die neue Ablesung nimmt die Farbe Rot an.](figure:calibration "Kalibrieren, dann klassifizieren: Eine neue Ablesung gehört zur nächstgelegenen Wolke von Referenzen. Der Grünanteil bleibt hier etwa gleich und ist weggelassen.")

Python kann diese Entscheidung treffen. Das Programm hält die Referenzen aus
der Zeichnung als Paare `(r, b)`, berechnet die Mitte jeder Gruppe und
vergleicht mit `math.dist()` den Abstand der neuen Ablesung zu beiden Mitten:

```python
import math
import statistics

# reference readings (r, b) of colours you know, measured beforehand
red = [(188, 50), (195, 62), (198, 58), (200, 55), (205, 70), (210, 48)]
blue = [(30, 195), (35, 210), (40, 215), (45, 220), (50, 205), (55, 198)]

def centre(points):
    r = statistics.mean(p[0] for p in points)
    b = statistics.mean(p[1] for p in points)
    return (r, b)

new = (170, 80)
to_red = math.dist(new, centre(red))
to_blue = math.dist(new, centre(blue))
print("Abstand zu Rot:", round(to_red))
print("Abstand zu Blau:", round(to_blue))
print("Rot" if to_red < to_blue else "Blau")
```

Die neue Ablesung liegt 37 Einheiten von der Mitte der roten Referenzen
entfernt und 180 von der der blauen, also gilt sie als Rot. Probier
`new = (120, 130)`, eine Ablesung fast genau zwischen den beiden Gruppen: Die
Abstände unterscheiden sich dann nur noch um eine Einheit, und ein wenig
Rauschen entscheidet, welche Farbe herauskommt. Nichts davon rechnet auf das
zurück, was die LED gesendet haben müsste, denn die Entscheidung stützt sich
auf deine eigene Messreihe, und so lässt sich eine Farbe aus Zahlen erkennen,
die nie mit ihr übereinstimmen.

## Wenn Assistent und Messung sich widersprechen

Angenommen, ein KI-Assistent schlägt vor, die Verstärkung zu erhöhen, weil
das die Erkennung verbessere, und deine Messreihe zeigt, dass die
Erkennungsrate von 94 auf 82 Prozent fällt. Bevor du den Vorschlag als
widerlegt ablegst, prüfst du deine eigene Reihe: Wurde nur eine Größe
verändert, gab es genug Wiederholungen, gab es eine Kontrollmessung? War die
Reihe sauber, gewinnt sie, denn der Assistent kennt Sensoren dieser Art, aber
nicht deinen Aufbau. Der Fall kommt dann mit Vorschlag, Messung und Ergebnis
in ein Irrtumsprotokoll, damit das Gelernte nicht verloren geht. Das
Experiment [[believed-and-measured]] führt eine solche Prüfung an einem
echten Gerät durch.

Jede Behauptung über einen Aufbau ist deshalb eine Einladung zu einem
Experiment, in dem nicht die schönste Erklärung gewinnt, sondern die sauberste
Messreihe, und eine einzelne Ablesung ist noch keine Messreihe. Was du nicht
gemessen hast, weißt du nicht.

## Zum Mitnehmen

- Aus einer Behauptung wird ein Test durch eine Frage, eine vorher notierte
  Vorhersage, eine Messung und einen Vergleich, in dieser Reihenfolge.
- Ein Sensor liefert Zahlen und keine Farbe, und sie stimmen nie mit dem
  Gesendeten überein, deshalb kalibrierst du mit bekannten Farben und ordnest
  jede neue Ablesung den nächstgelegenen Referenzen zu.
- Eine Kontrollmessung bei ausgeschalteter LED liefert den Umgebungspegel,
  gegen den jede andere Ablesung gelesen wird.
- Eine einzelne Ablesung ist ein Wurf, und das Mitteln über mehrere beseitigt
  Fehlentscheidungen um den Preis von mehr Ablesungen und damit weniger
  Zeichen pro Sekunde.
- Mittelwert und Streuung gehören zusammen ins Protokoll, weil zwei Reihen mit
  demselben Mittelwert sehr unterschiedlich streuen können.
- Eine längere Integrationszeit liefert ruhigere, aber weniger Ablesungen,
  eine kürzere mehr Ablesungen, die stärker streuen.
- Eine Messreihe hat eine vorher notierte Erwartung, genau eine veränderte
  Größe, genügend Wiederholungen und ein Protokoll aller Werte.
- Fünf Treffer in Folge können Glück sein, fünfzig nicht, und eine saubere
  Messreihe wiegt schwerer als jeder noch so gut begründete Vorschlag.

![Quiz: Messen und Experimentieren](item:measurement-and-experiments-quiz)
