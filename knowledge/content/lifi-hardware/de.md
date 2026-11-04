---
type: info
code: 5274
title: "Das Kursmodul `lifi_hardware`"
summary: >-
  Was das Python-Modul lifi_hardware euch abnimmt und was es bewusst sichtbar lässt, wie ihr LED und Sensor damit ansprecht, und was sein Messprotokoll festhält.
level: 1
duration: 12
topics: [working-with-the-computer, programming-with-python]
modules: [dup]
project: lifi
status: published
updated: 2026-11-04
---

Ein Modul ist in Python ein Stück fertiger Programmcode, das ihr mit einer
einzigen `import`-Zeile in euer eigenes Programm holt und dann benutzt.
Praktisch jedes Python-Programm arbeitet so: Für Mathematik, Zufallszahlen oder
Zeitmessung schreibt niemand den Code selbst, man importiert das Modul, das es
kann. Mit dem „Modul“ in eurem Studiengang hat das Wort übrigens nichts zu
schaffen, es wird leider für beides verwendet.

`lifi_hardware` ist ein solches Python-Modul, eigens für das LiFi-Projekt
geschrieben. Es enthält den Code, der mit eurem LiFi-Gerät spricht, und ihr
arbeitet im ganzen Projekt damit.

Die Hardware selbst kommt von Tinkerforge, und Tinkerforge liefert eine eigene
Programmierschnittstelle mit. Mit der könntet ihr direkt arbeiten, aber ihr
werdet es zumindest am Anfang nicht, und das hat einen Grund.

## Warum es das Kursmodul gibt

So sieht ein Programm aus, das über die Tinkerforge-Schnittstelle eine Farbe
setzt und eine Messung holt:

```python static
from tinkerforge.ip_connection import IPConnection
from tinkerforge.bricklet_rgb_led_v2 import BrickletRGBLEDV2
from tinkerforge.bricklet_color_v2 import BrickletColorV2

HOST = "localhost"
PORT = 4223
UID_LED = "ABC"       # steht auf dem Bauteil oder im Brick Viewer
UID_SENSOR = "XYZ"

ipcon = IPConnection()
led = BrickletRGBLEDV2(UID_LED, ipcon)
sensor = BrickletColorV2(UID_SENSOR, ipcon)
ipcon.connect(HOST, PORT)

led.set_rgb_value(255, 0, 0)
r, g, b, c = sensor.get_color()
print(r, g, b, c)

ipcon.disconnect()
```

Dasselbe mit dem Kursmodul:

```python static
from lifi_hardware import led, sensor

led.set_color(255, 0, 0)
print(sensor.read())
```

Der Unterschied sind nicht nur ein paar Zeilen. In der oberen Fassung stecken
mindestens fünf Dinge, die ihr in den ersten Tagen unmöglich verstehen könnt:
was eine IP-Verbindung ist, warum ein Programm auf dem eigenen Laptop eine
Netzwerkadresse braucht, was ein Port ist, was eine UID ist und woher man sie
bekommt, und warum man die Verbindung am Ende trennen muss.

Nichts davon ist Gegenstand dieses Projekts, es wäre Ballast, den ihr
mitschleppt, ohne daraus etwas zu lernen. Das Kursmodul nimmt euch diesen Teil
ab und lässt genau das übrig, worum es eigentlich geht: Licht erzeugen, Licht
messen und die beiden Einstellungen, mit denen ihr die Messung beeinflusst.

**Was es euch nicht abnimmt.** Es versteckt nicht alles, und das mit Absicht.
Die beiden Einstellungen des Sensors bleiben sichtbar, weil an ihnen die
wichtigste Abwägung des Projekts hängt; wer sie nie sieht, kann seinen
Durchsatz nicht einstellen.

## Installieren und aktualisieren

In eurem Kurs installiert die Einrichtung das Kursmodul für euch. Von Hand ist
es ein Befehl im Terminal (auf dem Mac `pip3`, wenn `pip` nicht gefunden wird):

```bash
pip install https://github.com/winf-hsos/lifi-hardware/archive/refs/heads/main.zip
```

Derselbe Befehl holt auch eine neue Fassung, etwa wenn eine Funktion
dazukommt oder ein Fehler behoben ist. Die Bibliothek von Tinkerforge kommt
als Abhängigkeit von selbst mit. Der Code liegt in einem öffentlichen
GitHub-Repository:
[github.com/winf-hsos/lifi-hardware](https://github.com/winf-hsos/lifi-hardware).

## Die Schnittstelle

Für den Anfang genügt eine Zeile, die zwei Objekte hereinholt:

```python static
from lifi_hardware import led, sensor
```

Beide verbinden sich beim ersten Gebrauch von selbst mit eurem Gerät, ohne
Adressen, Kennungen oder Konfiguration. Endet euer Programm, geht die LED von
selbst aus, und die Verbindung wird sauber geschlossen.

### Die LED, der Sender

```python static
led.set_color(r, g, b)   # jeder Wert von 0 bis 255
led.off()                # dasselbe wie led.set_color(0, 0, 0)
led.color                # die aktuelle Farbe als (r, g, b), von der Hardware gelesen
```

Die Hardware behält eine gesetzte Farbe, bis ein anderer Befehl kommt; von
eurem Programm weiß sie nichts. Benutzt ihr `led` und `sensor` wie oben,
schaltet das Kursmodul die LED am Programmende für euch aus, auch wenn das Ende
durch Strg+C oder einen Fehler kommt. Geht ihr den weiter unten beschriebenen
Weg über `LifiDevice`, bleibt die LED an, solange ihr das Gerät nicht selbst
schließt. `led.color` fragt die Hardware selbst und keinen gemerkten Wert. Das
hilft bei der Fehlersuche, wenn ihr wissen wollt, was gerade wirklich leuchtet.

### Der Sensor, der Empfänger

```python static
reading = sensor.read()          # Reading(r, g, b, c), jeder Wert von 0 bis 65535
r, g, b, c = sensor.read()       # gleich in vier Variablen entpackt

sensor.set_integration_time(ms)  # erlaubt: 2.4, 24, 101, 154 oder 700
sensor.set_gain(factor)          # erlaubt: 1, 4, 16 oder 60
sensor.integration_time          # die aktuelle Einstellung nachsehen
sensor.gain                      # die aktuelle Einstellung nachsehen
sensor.set_light(True)           # die weiße Beleuchtungs-LED des Sensors
```

Vier Dinge müsst ihr über den Sensor wissen.

1. **Er misst vier Kanäle, nicht drei.** Rot, Grün und Blau sind gefiltert;
   der vierte Kanal `c`, der Klarkanal, misst ungefiltert und ist deshalb der
   empfindlichste.
2. **Die Messwerte entsprechen nicht den gesendeten RGB-Werten.** Dazwischen
   liegen Filter, die sich überlappen, der Abstand und das Umgebungslicht, und
   genau deshalb kalibriert ihr.
3. **Der Sensor misst in seinem eigenen Takt,** eine Messung je
   Integrationszeit. `read()` holt die jüngste fertige Messung und wartet
   nicht. Lest ihr öfter, als der Sensor misst, bekommt ihr denselben Wert
   mehrmals; neue Information kommt höchstens einmal je Integrationszeit. Genau
   deshalb ist die Integrationszeit eine Einstellung: ruhigere Werte gegen
   weniger Messungen pro Sekunde.
4. **Der Sensor startet immer im selben Zustand,** mit Verstärkung 16,
   Integrationszeit 154 ms und ausgeschalteter Beleuchtungs-LED, damit
   Messreihen vergleichbar sind. Welche Einstellungen zu eurer Strecke passen,
   können euch nur eure eigenen Messungen sagen.

Die kleine weiße Beleuchtungs-LED auf dem Sensor ist dafür gedacht, Gegenstände
anzuleuchten, deren Oberflächenfarbe man messen will. Für eure Lichtstrecke
stört sie nur; deshalb ist sie am Anfang aus, und ihr lasst sie aus. Mehr zu
LED und Sensor steht in [[lifi-device]].

### Mehr Kontrolle, wenn ihr sie braucht

Wollt ihr selbst bestimmen, wann verbunden und getrennt wird, nehmt ihr die
Klasse hinter den beiden bequemen Objekten:

```python static
from lifi_hardware import LifiDevice

lifi = LifiDevice.connect()      # findet LED und Sensor von selbst
lifi.led.set_color(255, 0, 0)
print(lifi.sensor.read())
lifi.close()                     # LED aus, Verbindung getrennt
```

Mit eingebautem Aufräumen geht es auch: Die Form mit `with` schließt das Gerät
am Ende des Blocks für euch, selbst wenn euer Code darin scheitert.

```python static
with LifiDevice.connect() as lifi:
    lifi.led.set_color(255, 0, 0)
    print(lifi.sensor.read())
```

`connect()` kennt außerdem ein paar Optionen, etwa `log_file=None` (kein
Messprotokoll) und `server=None` (kein Hochladen, dazu gleich mehr).

### Zwei Geräte an einem Laptop

Euer Team hat zwei Geräte, und manchmal ist es praktisch, beide an denselben
Laptop zu stecken, eines als Sender und eines als Empfänger. Dann kann das
Kursmodul nicht wissen, welches ihr meint, also sagt es ihm jedes Skript, und
zwar mit der UID des Master Brick. Das ist der kurze Code der Hauptplatine, den
der Brick Viewer neben „Master Brick“ anzeigt. Ruft `use_device()` auf, bevor
ihr `led` oder `sensor` zum ersten Mal benutzt; danach geht alles wie gewohnt:

```python static
from lifi_hardware import led, sensor, use_device

use_device("64SK5w")     # die UID des Master Brick dieses Geräts
led.set_color(255, 0, 0)
```

Euer zweites Skript nennt die andere UID. Stecken zwei Geräte und ein Skript
wählt keines, bekommt ihr eine Fehlermeldung, die beide UIDs auflistet, sodass
ihr die richtige kopieren könnt. Dieselbe Wahl geht ohne Änderung am Code über
die Umgebungsvariable `LIFI_MASTER` und mit
`LifiDevice.connect(master="64SK5w")`. Das braucht das Kursmodul ab Version
0.4.0.

### Sender, Empfänger und der Test für Challenge 1

Ab Version 0.6.0 kennt das Kursmodul für [[lifi-challenge-1]] drei weitere
Namen: `sender` und `receiver` sind die beiden Geräte eures Teams, jedes mit
`.led` und `.sensor`, und `run_test` führt den Test aus. Eure Datei legt ihre
Farben und drei Funktionen fest und übergibt sie in der letzten Zeile:

```python static
from lifi_hardware import receiver, run_test, sender

COLORS = {"off": (0, 0, 0), "white": (255, 255, 255)}

def calibrate(readings):        # readings["white"]: die Messwerte, während Weiß leuchtete
    ...

def send_symbol(name):
    r, g, b = COLORS[name]
    sender.led.set_color(r, g, b)

def receive_symbol():
    r, g, b, c = receiver.sensor.read()
    return "off"                # der Name der erkannten Farbe

run_test(send_symbol, receive_symbol, calibrate, symbols=COLORS)
```

Welches Gerät sendet, fragt das Modul beim Start, ob nun beide an einem Laptop
hängen oder jedes an seinem eigenen. Was gesendet und was empfangen wurde,
notiert `run_test` selbst über `note_sent()` und `note_received()` und schickt
es an den Kursserver, der vergleicht; euer Code ruft diese beiden Funktionen
nicht auf, damit das Ergebnis nicht davon abhängt, was euer Skript für
gesendet hält.

## Das Messprotokoll und das Cockpit

Alles, was euer Gerät macht, schreibt das Kursmodul in eine Datei namens
`lifi_log.jsonl` in dem Ordner, in dem euer Programm läuft: jede gesetzte
Farbe, jede Messung, jede geänderte Einstellung, eine Textzeile je Ereignis.
Das ist das Gedächtnis eurer Messreihen. Es gehört euch, und es funktioniert
immer, auch ganz ohne Internet.

Zusätzlich schickt das Kursmodul dieselben Ereignisse an den Kursserver. So
seht ihr eure eigene Strecke live im Browser, im
[Team-Cockpit](https://lifi.hsos.uber.space/cockpit): oben, was eure LED
sendet, darunter, was euer Sensor misst, auf einer gemeinsamen Zeitachse.
Passen die beiden nicht zusammen, seht ihr euren Fehler vor euch. Das Cockpit
ist euer wichtigstes Werkzeug, um Fehler auf der Strecke zu finden; wie ihr es
lest und bedient, steht in [[lifi-cockpit]].

> [!IMPORTANT]
> Es gilt volle Transparenz: Hochgeladen wird genau das, was in eurer lokalen
> Datei steht, keine Zeile mehr. Stürzt euer Programm ab, geht die Art des
> Fehlers mit, mit einer bereinigten Meldung, aus der die Dateipfade vorher
> entfernt sind; euer Quellcode geht nie mit. Der Fehler erscheint dann als
> rote Marke in eurem Cockpit. Wollt ihr das Hochladen nicht, schaltet ihr es
> jederzeit und ohne jeden Nachteil ab, mit `LifiDevice.connect(server=None)`
> oder der Umgebungsvariable `LIFI_SERVER=off`. Das lokale Protokoll läuft
> trotzdem weiter.

## Ein Blick hinein

Das Kursmodul ist kein Zaubertrick, sondern eine überschaubare Menge
Python-Code, die ihr öffnen und lesen könnt, und spätestens ab
[[lifi-challenge-2]] solltet ihr das einmal machen. Der Quelltext liegt offen
im [GitHub-Repository](https://github.com/winf-hsos/lifi-hardware). Darin
findet ihr dieselben Tinkerforge-Aufrufe wie im ersten Beispiel oben, dazu ein
paar Zeilen, die die Kennungen eures Geräts selbst nachschlagen, sodass ihr nie
eine UID tippen müsst, außer wenn zwei Geräte am selben Laptop hängen.

Das ist ein Muster, das euch im Studium ständig begegnen wird: Unter jeder
bequemen Schnittstelle liegt eine weniger bequeme, und darunter noch eine. Die
Tinkerforge-Schnittstelle verbirgt ihrerseits, wie die Daten tatsächlich über
das USB-Kabel laufen, und darunter geht es weiter bis zu einzelnen
Spannungspegeln auf einer Leitung.

Braucht ihr einmal etwas, das das Kursmodul nicht kann, dürft ihr jederzeit
eine Ebene tiefer greifen und die Tinkerforge-Schnittstelle direkt benutzen.
Das Kursmodul lässt die Tür mit Absicht offen: `led.raw` und `sensor.raw` sind
die Tinkerforge-Objekte darunter, mit allem, was sie können. Verboten ist das
nicht, ihr müsst es nur nicht am ersten Tag.
