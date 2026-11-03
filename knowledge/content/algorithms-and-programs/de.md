---
title: Algorithmen und Programme
summary: >-
  Was ein Programm ist: ein Algorithmus, so vollständig aufgeschrieben, dass
  eine Maschine ihn Zeile für Zeile ausführen kann, ohne etwas zu ergänzen.
  Dazu die vier Bausteine jedes Programms an einer LED, die du gleich hier
  programmierst, was ein Verfahren kostet, wie du eine Fehlermeldung liest und
  wie du mit einem KI-Assistenten so arbeitest, dass du den Code verstehst.
objectives:
  intro: "Am Beispiel einer LED, die ein Programm Zeile für Zeile schaltet, zeigt dir diese Lektion, was ein Algorithmus ist und was ein Programm daraus macht, und danach kannst du:"
  goals:
    - "erklären, was einen Algorithmus ausmacht und warum ein Programm ein Algorithmus ist, der für eine Maschine vollständig aufgeschrieben wurde"
    - "Bubblesort von Hand auf wenigen Werten ausführen und die Bedingung benennen, an der es endet"
    - "für ein kurzes Programm mit `led.set_color()` und `time.sleep()` Zeile für Zeile vorhersagen, was die LED zeigt, und begründen, warum Pausen und Reihenfolge das Ergebnis verändern"
    - "die vier Bausteine Abfolge, benannter Wert, Wiederholung und Bedingung in einem Programm wiederfinden und erkennen, wann eine Schleife keinen Ausgang hat"
    - "zwei richtige Verfahren nach ihrem Aufwand vergleichen und sagen, wie dieser mit der Größe des Problems wächst"
    - "eine Fehlermeldung von Python lesen und darin Datei, Zeile und Ursache finden"
    - "einen KI-Assistenten so fragen, dass du den Code verstehst, und übernommenen Code selbst ändern"
translation_of: en
based_on: 2026-11-03
---

Um 1900 stand in vielen Wohnzimmern ein Klavier, das von selbst spielte. Die
Tasten bewegten sich, während der Hocker leer blieb, und die Musik kam von
einer Papierrolle über der Tastatur, in der jedes gestanzte Loch „drück jetzt
diese Taste“ bedeutete. Das Klavier verstand nichts von Musik und führte aus,
was auf der Rolle stand; der eigentliche Pianist war also, wer die Rolle
gestanzt hatte, vielleicht Jahrzehnte vorher. Die Rolle ist das Programm, das
Klavier die Maschine und wer stanzt, schreibt das Programm, und diese Lektion
sieht sich dieses Verhältnis genau an, mit einer LED statt eines Klaviers, die
du weiter unten selbst programmierst.

## Sei die Maschine

Stell dir vor, jemand hält nacheinander Farbkarten hoch, und du schreibst sie
nach vier Schritten mit: Sieh dir die Karte an, entscheide, welche von vier
Farben es ist, schreib ihren Anfangsbuchstaben auf und warte auf die nächste
Karte. Diesen Schritten kannst du folgen, ohne zu wissen, was die Folge der
Farben bedeutet, und genau das macht sie zu einem **Algorithmus**: einer
Folge von Schritten, die so genau beschrieben ist, dass man sie ausführen
kann, ohne ihren Zweck zu verstehen.

Ein Algorithmus braucht keinen Computer. Er kann in Alltagssprache auf einem
Zettel stehen, und ein Mensch kann ihn von Hand ausführen, so wie du eben.
Entscheidend ist, dass jeder Schritt eindeutig ist: Tausend Schritte sind
immer noch ein Algorithmus, solange jeder klar ist, während vier Schritte
keiner sind, wenn ein einziger davon ein Urteil verlangt, etwa „schreib auf,
ob die Farbe schön aussieht“. Donald Knuth, dessen Bücher das Standardwerk zum
Thema sind, nennt fünf Eigenschaften: Ein Algorithmus endet nach endlich
vielen Schritten, jeder Schritt ist genau festgelegt, er nimmt eine Eingabe
entgegen, er liefert eine Ausgabe, und jeder seiner Schritte lässt sich
tatsächlich ausführen.

Drei der vier Schritte kann ein Programm auf dem Gerät leicht übernehmen:
Hinsehen heißt den Sensor auslesen, Aufschreiben heißt einen Wert speichern,
und Warten ist eine einzige Zeile. Der zweite Schritt, das Entscheiden, welche
Farbe es ist, ist die eigentliche Arbeit eines Empfängers, und an ihm hängt
der größte Teil des LiFi-Projekts.

## Noch ein Algorithmus: Sortieren nach Regeln

Ein zweiter Algorithmus zeigt, wie viel ein paar genaue Regeln leisten.
Sechs Personen stehen in zufälliger Reihenfolge in einer Reihe, und jede folgt
fünf Regeln, ohne vorauszudenken: Stell dich in eine Reihe; sieh deinen
rechten Nachbarn an; ist er kleiner als du, tauscht ihr; am Ende der Reihe
beginnt alles von vorn; und hatte ein ganzer Durchgang keinen Tausch, hört
ihr auf. Nach ein paar Durchgängen steht die Reihe der Größe nach, obwohl
niemand das geplant hat. Das Verfahren heißt **Bubblesort**, weil die Großen
wie Blasen im Wasser nach rechts aufsteigen, und ein Computer kann genau so
sortieren, nach denselben fünf Regeln, nur millionenfach schneller.

![Sechs Balken der Höhen 2, 5, 1, 6, 3 und 4 in einer Reihe. Beim Abspielen läuft je Schritt ein Durchgang: Zwei benachbarte Balken werden gelb, während sie verglichen werden, und der größere rückt nach rechts. Nach dem dritten Durchgang, der nichts mehr zu tauschen findet, werden alle Balken grün.](figure:bubble "Jeder Schritt ist ein Durchgang: drei Vertauschungen, noch einmal drei, und ein dritter Durchgang ohne Tausch beendet das Verfahren.")

Die Zeichnung wendet die Regeln auf sechs Balken an. Der erste Durchgang
tauscht dreimal, der zweite noch dreimal, und der dritte findet nichts mehr
zu tauschen. In Python sehen die Regeln so aus:

```python
values = [2, 5, 1, 6, 3, 4]

passes = 0
while True:
    swaps = 0
    for i in range(len(values) - 1):
        if values[i] > values[i + 1]:
            values[i], values[i + 1] = values[i + 1], values[i]
            swaps = swaps + 1
    passes = passes + 1
    print(f"pass {passes}: {values}, {swaps} swaps")
    if swaps == 0:
        break
```

Die Zeile mit `for` läuft die Reihe entlang und vergleicht jeden Wert mit
seinem rechten Nachbarn, die Zeile nach dem `if` tauscht die beiden, und
`while True` außen herum beginnt den nächsten Durchgang. Setz andere Zahlen in
die Liste, mehr oder weniger als sechs, und dieselben Zeilen sortieren auch
sie.

Woher weiß das Verfahren, dass es fertig ist? Niemand sagt von außen
„fertig“, und niemand beurteilt, ob die Reihe sortiert aussieht, denn
Beurteilen gehört nicht zu den Regeln. Das Ende folgt aus den Regeln selbst:
Ein Durchgang ohne einen einzigen Tausch heißt, dass nichts mehr zu sortieren
ist. Eine solche Regel heißt **Abbruchbedingung**, und im Code ist es die
Zeile `if swaps == 0:` mit dem `break` darunter, das die Schleife verlässt.

## Ein Programm ist eine Liste

Ein Algorithmus auf dem Zettel ist noch kein Programm. Ein Mensch, der ihn
ausführt, ergänzt, was offensichtlich gemeint war, meist ohne es zu merken:
Fehlt ein Schritt, fügt er ihn hinzu, und ist die Reihenfolge ungeschickt,
stellt er sie um. Eine Maschine macht beides nicht. **Ein Programm ist eine
Liste von Anweisungen, die ein Computer genau und der Reihe nach befolgt**,
und damit kommt eine Anforderung hinzu, die der Zettel nie hatte: Die Liste
muss vollständig sein.

Das Programm unten schaltet eine LED. Die beiden Zeilen oben holen das
Werkzeug, `time` zum Warten und `led` aus dem Kursmodul `lifi_hardware`, und
die vier Zeilen darunter sind die Anweisungen. Führ es aus, und das Feld unter
dem Code zeigt, was die LED macht, auf einer Zeitachse, die so schnell läuft
wie die echte: Auf dem Gerät schalten dieselben Zeilen die echte LED.

```python
import time
from lifi_hardware import led

led.set_color(255, 0, 0)
time.sleep(1)
led.set_color(0, 0, 255)
time.sleep(1)
```

Die erste Anweisung macht die LED rot, die zweite wartet eine Sekunde, die
dritte macht die LED blau, und die vierte wartet noch eine Sekunde. Ist die
letzte Zeile erledigt, endet das Programm, und das Kursmodul schaltet die LED
aus. Die Maschine weiß nicht, was gemeint war: Sie führt aus, was dasteht, in
der Reihenfolge, in der es dasteht, und sonst nichts.

Jede Anweisungszeile hat drei Teile. In `led.set_color(255, 0, 0)` sagt `led`,
welches Ding gemeint ist, `.set_color`, was mit ihm passieren soll, und die
Klammern, mit welchen Werten: hier volles Rot, kein Grün und kein Blau.
Dieselbe Anweisung mit anderen Werten ergibt andere Farben, `(0, 0, 255)` Blau
und `(255, 255, 0)` Gelb, gemischt aus vollem Rot und vollem Grün. Ändere die
Werte im Feld und führ es noch einmal aus, etwa zu `(255, 0, 255)` oder zu
`(40, 0, 0)` für ein schwaches Rot.

## Vier Bausteine

Jedes Programm dieser Lektion, und jedes, das du im Projekt schreibst, besteht
aus vier Bausteinen: Anweisungen nacheinander, Werte mit Namen, Wiederholung
und Bedingung. Alle vier lassen sich an der LED sehen.

### 1 · Nacheinander

Anweisungen laufen der Reihe nach, und die Reihenfolge gehört zum Programm,
sie ist nicht bloß eine Schreibweise. `time.sleep(1)` lässt das Programm eine
Sekunde warten, bevor es die nächste Zeile ausführt, und ein Computer wartet
nur dort, wo ein Programm es sagt.

Lösch im Feld oben das erste `time.sleep(1)` und führ es noch einmal aus. Rot
und Blau kommen jetzt beide bei 0 Sekunden, Rot dauert also gar nicht: Auf dem
Gerät leuchtet es etwa eine Millisekunde, viel zu kurz für ein Auge, und du
siehst nur Blau. Die Zeitachse zeigt es als Haarstrich am Anfang. Das Programm
ist nicht kaputt, sondern richtig und für dich nur zu schnell.

Die Reihenfolge zählt auch, wenn keine Zeile fehlt. Im nächsten Programm
steht die Pause zwischen den beiden Farben:

```python
import time
from lifi_hardware import led

led.set_color(255, 0, 0)
time.sleep(1)
led.set_color(0, 0, 255)
```

Rot bleibt eine Sekunde, dann kommt Blau, und gleich danach endet das
Programm, und die LED geht aus, du siehst also Rot. Verschieb jetzt
`time.sleep(1)` ans Ende, unter die blaue Zeile: Blau kommt sofort und bleibt
eine Sekunde, du siehst also Blau. Dieselben drei Zeilen ergeben ein anderes
Programm, weil die Maschine nicht umstellt, was gemeint war, sondern
ausführt, was wo steht.

### 2 · Ein Wert mit Namen

Ein Name für einen Wert, den du danach überall benutzt: `bright = 120` legt
die Helligkeit einmal fest, und Rot, Grün und Blau richten sich alle danach.

```python
import time
from lifi_hardware import led

bright = 120
led.set_color(bright, 0, 0)
time.sleep(1)
led.set_color(0, bright, 0)
time.sleep(1)
led.set_color(0, 0, bright)
time.sleep(1)
```

Ändere `120` in `255` oder `30` und führ es aus: Alle drei Farben ändern sich
mit. Der Gewinn ist nicht die Kürze, sondern die eine Stelle zum Ändern statt
drei.

### 3 · Noch einmal

Eine Liste von Farben und eine Schleife darüber. Jede Farbe in der Liste ist
ein Zahlentripel wie `(255, 0, 0)`, und `for r, g, b in colors:` packt jedes
Tripel in die drei Zahlen aus, die `led.set_color` erwartet.

```python
import time
from lifi_hardware import led

colors = [(255, 0, 0), (0, 255, 0),
          (0, 0, 255), (255, 255, 0)]
for r, g, b in colors:
    led.set_color(r, g, b)
    time.sleep(1)
```

Eine Schleife ist keine Magie, sondern eine Schreibweise: Dieselben zwei
eingerückten Zeilen laufen viermal, jedes Mal mit dem nächsten Wert aus der
Liste, und die Zeitachse zeigt vier Durchläufe in vier Sekunden. Ergänze eine
fünfte Farbe in der Liste, und die Schleife macht einen fünften Durchlauf,
ohne dass sich sonst etwas ändert.

### 4 · Nur wenn

Eine Bedingung führt eine Zeile nur aus, wenn sie zutrifft, und `else` sagt,
was sonst passiert. Hier bleibt Gelb drei Sekunden und jede andere Farbe eine:

```python
import time
from lifi_hardware import led

colors = [(255, 0, 0), (0, 255, 0),
          (0, 0, 255), (255, 255, 0)]
for r, g, b in colors:
    led.set_color(r, g, b)
    if (r, g, b) == (255, 255, 0):
        time.sleep(3)
    else:
        time.sleep(1)
```

Die Durchläufe folgen wie vorher aufeinander, aber der gelbe Balken wird
dreimal so lang wie die anderen, vier Durchläufe und sechs Sekunden
zusammen. Damit hängt der Ablauf von etwas ab, das sich unterwegs ändert, und
ein Programm kann auf etwas reagieren, statt stur dasselbe abzuspulen, etwa
auf den Wert, den der Sensor gerade misst.

### Wann endet das?

Eine Schleife `while True:` wiederholt ihren Rumpf, solange ihre Bedingung
gilt, und `True` gilt immer:

```python
import time
from lifi_hardware import led

while True:
    led.set_color(255, 0, 0)
    time.sleep(1)
    led.set_color(0, 0, 255)
    time.sleep(1)
```

Dieses Programm endet nie, weil sein Rumpf keinen Ausgang hat. Auf dem Gerät
blinkt es, bis du es mit Strg+C anhältst, und hier hält die Seite es nach 20
Sekunden an. Die Abbruchbedingung kennst du vom Sortieren, ein Durchgang ohne
Tausch; hier fehlt sie. Fürs Dauerblinken ist das sogar richtig, und ein
Programm, das auf Nachrichten wartet, läuft ebenfalls in so einer Schleife.
Ein Empfänger, der auf das Ende einer Nachricht warten soll, braucht dagegen
eine Bedingung, an der seine Schleife endet, und die Klage „mein Programm
hängt“ heißt fast immer, dass die Schleife keinen Ausgang hat. Mehr solche
Schleifen zeigt [[python-while-loops]].

Eine Bedingung kann auch dastehen und trotzdem nie eintreten. Mach im
Sortierprogramm weiter oben aus der `4` in der Liste eine `5`, sodass zwei
Werte gleich sind, und aus `>` ein `>=`, sodass die Regel „tausch, wenn du
größer oder gleich groß bist“ lautet. Die beiden Fünfen tauschen dann in jedem
Durchgang die Plätze, jeder Durchgang hat einen Tausch, und die Reihe kommt nie
zur Ruhe, also hältst du das Programm mit **Stopp** an: Ein einziges Zeichen in
der Regel entscheidet, ob das Verfahren endet.

## Was kostet es?

Alle Programme bis hierher funktionieren, und für die LED reicht das. Sobald
ein Programm aber viele Daten verarbeitet, etwa eine ganze Datei über das
Licht schickt, kommt eine zweite Frage dazu: Wie viel Arbeit braucht es
dafür? Jemand denkt sich eine Zahl zwischen 1 und 100, und du darfst Fragen
stellen, die mit Ja oder Nein beantwortet werden. Du kannst eine Zahl nach der
anderen abfragen, was im schlimmsten Fall 99 Fragen braucht, oder fragen, ob
die Zahl größer als 50 ist, und so den Bereich mit jeder Frage halbieren, was
höchstens sieben braucht. Beide Verfahren finden die Zahl sicher, und der
Unterschied wächst mit der Größe des Problems:

| Zahlen | einzeln | halbieren |
|---|---|---|
| 100 | 99 | 7 |
| 1.000 | 999 | 10 |
| 1.000.000 | 999.999 | 20 |

Richtig zu sein ist deshalb nur das Mindeste, und danach vergleicht man
Verfahren nach ihrem **Aufwand**: wie viele Schritte, wie viel Zeit oder wie
viele Messungen sie brauchen, und vor allem, wie diese Zahl wächst, wenn das
Problem wächst. Das Halbieren kannst du in [[symbols-and-information]]
selbst ausprobieren, wo ein kleines Programm deine Zahl aus 32 errät.

Auch Bubblesort hat einen Aufwand, und das Feld unten zählt ihn als Zahl der
Vergleiche, bis die Reihe sortiert ist. Sechs Werte in umgekehrter
Reihenfolge brauchen 30 Vergleiche.

```python
values = [6, 5, 4, 3, 2, 1]

comparisons = 0
while True:
    swaps = 0
    for i in range(len(values) - 1):
        comparisons = comparisons + 1
        if values[i] > values[i + 1]:
            values[i], values[i + 1] = values[i + 1], values[i]
            swaps = swaps + 1
    if swaps == 0:
        break
print(f"{len(values)} values sorted with {comparisons} comparisons")
```

Ersetz jetzt die Liste durch `list(range(40, 0, -1))`, das ergibt die Zahlen
von 40 abwärts bis 1. Vierzig Werte brauchen 1.560 Vergleiche, und tausend
bräuchten 999.000, weil das Verfahren bei n Werten in umgekehrter Reihenfolge
n Durchgänge mit je n − 1 Vergleichen macht. Sein Aufwand wächst also nicht
wie die Länge der Reihe, sondern ungefähr wie ihr Quadrat, und deshalb nutzen
`sorted()` und `sort()` aus [[python-lists]] ein geschickteres Verfahren,
dessen Aufwand viel langsamer wächst. Für eine Übertragung über Licht wird
daraus die handfeste Frage, wie viele Sekunden eine Datei unterwegs ist.

## Eine Fehlermeldung lesen

Kann die Maschine eine Zeile gar nicht ausführen, hält sie an und sagt,
warum. Das Programm unten hat einen Tippfehler in seiner zweiten Anweisung;
führ es aus.

```python
import time
from lifi_hardware import led

led.set_color(255, 0, 0)
time.slep(1)
led.set_color(0, 0, 255)
```

Ein Traceback sieht bedrohlich aus, ist aber eine genaue Auskunft, und er
liest sich von oben nach unten. Zuerst nennt er Datei und Zeile, hier
`program.py` und Zeile 5, denn die Seite speichert den Code aus dem Feld unter
diesem Namen. Dann zeigt er, was in dieser Zeile steht, und die Spitzen
darunter zeigen auf die Stelle. Die letzte Zeile sagt, was genau es nicht
gibt, hier `slep` statt `sleep`, und Python rät sogar, was gemeint war.
Ausgeführt wird die Vermutung aber nicht: Die Maschine hat nicht versagt,
sondern ausgeführt, was dastand, und meldet genau, wo sie hängen geblieben
ist. Die LED zeigt dasselbe, denn sie wurde vor Zeile 5 rot und geht aus,
wenn das Programm anhält.

Eine Fehlermeldung ist eine Auskunft über das Programm, kein Urteil über
dich. Lies sie laut vor, denn meist sagt sie wörtlich, was nicht stimmt, und
dann korrigier die Zeile und führ sie noch einmal aus. [[python-error-messages]]
geht die häufigen Meldungen einzeln durch.

## Mit dem Assistenten arbeiten

Die meisten Programme im Projekt schreibst du zusammen mit einem
KI-Assistenten, und wie du fragst, entscheidet, was du bekommst. „Schreib mir
ein Programm für die LED“ bringt dir Code, den du nicht verstehst. „Die LED
soll drei Sekunden rot leuchten, dann blau. Erklär jede Zeile, bevor du sie
schreibst“ sagt, was herauskommen soll, und bestellt die Erklärung gleich mit,
und das bringt dir Code und Verständnis.

Behalte nie Code, den du nicht ändern kannst. Jede Übergabe endet mit einer
kleinen Änderung, die du selbst machst, etwa einer anderen Farbe oder einer
anderen Wartezeit, und die Felder auf dieser Seite sind der Ort, das zu üben.
Kannst du ein Stück Code nicht ändern, hast du es nicht übernommen, sondern
nur kopiert.

## Zum Mitnehmen

- Ein Algorithmus ist eine Folge von Schritten, so genau, dass man sie
  ausführen kann, ohne ihren Zweck zu verstehen; er braucht keinen Computer.
- Ein Programm ist eine Liste von Anweisungen, die ein Computer genau und der
  Reihe nach befolgt. Es ergänzt nichts, also muss die Liste vollständig sein,
  und eine andere Reihenfolge ergibt ein anderes Programm.
- Jedes Programm besteht aus vier Bausteinen: nacheinander, ein Wert mit
  Namen, Wiederholung und Bedingung.
- Ein Verfahren endet nur, wenn seine Abbruchbedingung erreichbar ist;
  Bubblesort hört nach einem Durchgang ohne Tausch auf, und `while True:` ohne
  Ausgang hört nie auf.
- Richtig ist das Mindeste: Zwei richtige Verfahren vergleicht man nach ihrem
  Aufwand und danach, wie er mit der Größe des Problems wächst.
- Eine Fehlermeldung nennt Datei, Zeile und Ursache, und sie ist eine
  Auskunft, kein Urteil.
