---
title: Wie aus einer Messung ein Beleg wird
summary: >-
  Eine einzelne Ablesung ist ein Wurf und keine Tatsache. Was ein Sensor
  wirklich liefert, warum Messwerte streuen, was Mitteln und Integrationszeit
  kosten und wie aus einer Messreihe mit einer veränderten Größe ein Beleg
  wird.
objectives:
  intro: "Am Beispiel eines Farbsensors, der das Licht einer LED misst, zeigt dir diese Lektion, warum eine einzelne Ablesung noch kein Beleg ist, und danach kannst du:"
  goals:
    - "erklären, warum ein Sensor vier Zahlen statt einer Farbe liefert und warum du kalibrierst und klassifizierst, statt auf das Gesendete zurückzurechnen"
    - "mit einer Simulation in Python zeigen, wie das Mitteln über fünf oder zehn Ablesungen Fehlentscheidungen beseitigt und was es an Zeichen pro Sekunde kostet"
    - "erklären, wozu eine Kontrollmessung bei ausgeschalteter LED dient und wie die Integrationszeit ruhige Werte gegen Tempo tauscht"
    - "eine Messreihe planen, mit vorher notierter Erwartung, genau einer veränderten Größe, genügend Wiederholungen und vollständigem Protokoll"
    - "begründen, warum fünf Treffer in Folge Glück sein können, fünfzig aber nicht"
translation_of: en
based_on: 2026-11-01
---

Ob sich ein echter Aufbau so verhält, wie du es erwartest, entscheidet nur
eine Messung, nicht das Nachdenken, nicht das Bauchgefühl und auch kein
KI-Assistent. Zweitausend Jahre lang glaubte man Aristoteles, dass schwere
Körper schneller fallen als leichte, und der Legende nach genügten zwei Kugeln
vom schiefen Turm von Pisa, um den Irrtum zu beenden. Jeder Aufbau auf einem
Tisch ist so ein Turm: Ein Assistent kennt Sensoren dieser Art, aber nur eine
Messung kennt genau diesen. Die Beispiele dieser Lektion verwenden einen
Farbsensor, der das Licht einer LED misst, wie bei einer Strecke, die Daten
mit Licht überträgt, und jeder andere Sensor verhält sich im Prinzip genauso.

## Was ein Sensor liefert

Ein Farbsensor liefert keine Farbe, sondern vier Zahlen: die Anteile von Rot,
Grün und Blau, hinter Farbfiltern gemessen und `r`, `g` und `b` geschrieben,
und einen vierten Wert `c` für *Clear*, der ohne Filter misst. Weil Clear das
gesamte einfallende Licht sieht, ist er empfindlicher als die Farbkanäle und
der nützlichste Wert, wenn du nur hell von dunkel unterscheiden musst.

Keine dieser Zahlen entspricht dem, was die LED bekommen hat. Stellst du die
LED auf reines Rot, `(255, 0, 0)`, misst der Sensor etwa `r=203, g=41, b=57`,
weil sich die Farbfilter überlappen, Abstand und Winkel Licht schlucken und
das Raumlicht immer mitgemessen wird. Das ist kein Defekt, sondern der
Normalfall, und es hat eine Folge: Du rechnest nicht von den Messwerten auf
das Gesendete zurück, denn eine Formel, die heute passt, versagt am nächsten
Tisch oder am nächsten Tag. Stattdessen **kalibrierst** du, indem du jede
Farbe, die du senden willst, mehrmals misst und diese Werte als Referenzen
aufhebst, und dann **klassifizierst** du, indem du jede neue Ablesung der
nächstgelegenen Gruppe von Referenzen zuordnest.

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
Rauschen entscheidet, welche Farbe herauskommt. Im Experiment
[[sent-is-not-measured]] siehst du den Unterschied zwischen gesendet und
gemessen an einem echten Gerät.

## Eine Ablesung ist ein Wurf

Liest du dieselbe rote LED fünfmal ab, ohne etwas zu verändern, bekommst du
fünf verschiedene Werte, etwa 198, 205, 201, 195 und 206. Keiner davon ist der
wahre, und doch ist jeder eine echte Messung, denn jede echte Messung streut:
Das Licht flackert, die Elektronik rauscht, jemand geht am Fenster vorbei.
Fünf gleiche Werte wären verdächtiger als fünf verschiedene. Eine einzelne
Ablesung springt, während der Mittelwert mehrerer ruhig liegt, und wenn du
einen stabilen Wert brauchst, liest du deshalb mehrmals ab und mittelst.

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

## Erst das Dunkel messen

Es gibt einen zweiten Grund, mehr als einmal zu messen. Ein Sensor zeigt nie
Null, weil immer etwas Raumlicht ankommt, und deshalb beginnt jede Messreihe
mit einer **Kontrollmessung** bei ausgeschalteter LED. Sie ist der Nullpunkt,
gegen den du jede Farbe liest: Was die LED beiträgt, ist der Unterschied
zwischen einer Ablesung und diesem Umgebungspegel, und jede Ablesung enthält
zugleich Umgebungslicht, das Licht der LED und Rauschen. Die Kontrollmessung
verrät dir außerdem, wenn sich die Umgebung ändert, durch Nachmittagssonne
oder eine Lampe in der Nähe, denn dann wandert auch der Dunkelwert.

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
die beste Einstellung liegt, beantwortet keine Tabelle und kein Assistent,
sondern nur eine Messreihe am Aufbau selbst, und [[signal-and-noise]] rechnet
aus, was die Einstellung für die Zahl der Zeichen bedeutet, die eine Strecke
tragen kann.

## Gezielt messen

Eine **Messreihe** besteht aus mehreren Ablesungen unter gleichen,
festgehaltenen Bedingungen, bei denen höchstens eine Größe gezielt verändert
wird. Ändert eine Gruppe Abstand und Integrationszeit zugleich und eine
andere nur den Abstand, sehen vielleicht beide ihre Erkennung besser werden,
aber nur die zweite weiß, woran es lag. Eine Messreihe folgt vor, während und
nach dem Messen ein paar Regeln:

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
echten Gerät durch. Kurz gesagt:
Was du nicht gemessen hast, weißt du nicht.

## Zum Mitnehmen

- Ein Sensor liefert Zahlen und keine Farbe, und sie stimmen nie mit dem
  Gesendeten überein, deshalb kalibrierst du mit bekannten Farben und ordnest
  jede neue Ablesung den nächstgelegenen Referenzen zu.
- Eine einzelne Ablesung ist ein Wurf, und das Mitteln über mehrere beseitigt
  Fehlentscheidungen um den Preis von mehr Ablesungen und damit weniger
  Zeichen pro Sekunde.
- Eine Kontrollmessung bei ausgeschalteter LED liefert den Umgebungspegel,
  gegen den jede andere Ablesung gelesen wird.
- Eine längere Integrationszeit liefert ruhigere, aber weniger Ablesungen,
  eine kürzere mehr Ablesungen, die stärker streuen.
- Eine Messreihe hat eine vorher notierte Erwartung, genau eine veränderte
  Größe, genügend Wiederholungen und ein Protokoll aller Werte.
- Fünf Treffer in Folge können Glück sein, fünfzig nicht, und eine saubere
  Messreihe wiegt schwerer als jeder noch so gut begründete Vorschlag.
