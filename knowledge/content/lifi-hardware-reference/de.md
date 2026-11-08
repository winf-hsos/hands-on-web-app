---
type: info
code: 6718
title: "`lifi_hardware` nachschlagen: alle Funktionen und zwei Geräte"
summary: >-
  Jede Funktion des Kursmoduls auf einen Blick, wie ihr herausfindet, welche UID zu welchem Gerät gehört, wie ein Skript gezielt eines von zwei Geräten anspricht und wie ein einziges Skript mit beiden zugleich arbeitet.
level: 1
duration: 12
topics: [working-with-the-computer, programming-with-python]
modules: [dup]
project: lifi
relations:
  see_also: [lifi-hardware, lifi-cockpit]
status: draft
updated: 2026-11-08
---

Diese Seite ist zum Nachschlagen gedacht. Warum es das Kursmodul gibt, wie ihr
es installiert und was sein Messprotokoll festhält, erklärt die Einführung
[[lifi-hardware]]; hier steht, was jede Funktion macht, und vor allem, wie ihr
arbeitet, wenn zwei Geräte am selben Laptop hängen. Alles bezieht sich auf
Version 0.7.0. Welche Version bei euch läuft, verrät eine Zeile:

```python static
import lifi_hardware
print(lifi_hardware.__version__)
```

## Alle Namen auf einen Blick

Das Kursmodul bietet drei Wege zu eurem Gerät an. Der bequeme Weg über `led`
und `sensor` genügt für ein Gerät, `LifiDevice` gibt euch die Verbindung selbst
in die Hand und ist der Weg für zwei Geräte in einem Skript, und `sender`,
`receiver` und `run_test` sind für den Test von [[lifi-challenge-1]] gebaut.

| Name | Was es ist |
|---|---|
| `led`, `sensor` | LED und Sensor des einen Geräts; sie verbinden sich beim ersten Gebrauch von selbst |
| `use_device(uid)` | wählt das Gerät für `led` und `sensor`, wenn zwei angeschlossen sind |
| `find_devices()` | die UIDs der Master Bricks aller vollständigen Geräte an diesem Laptop, als Liste (ab 0.5.0) |
| `LifiDevice.connect(...)` | verbindet sich mit einem Gerät und gibt es als Objekt mit `.led` und `.sensor` zurück |
| `Reading` | eine Messung mit den vier Werten `r`, `g`, `b` und `c` |
| `sender`, `receiver` | die beiden Geräte im Test von Challenge 1, jedes mit `.led` und `.sensor` |
| `run_test(...)` | führt den Test von Challenge 1 aus und stellt mit `gain=` und `integration_time=` den Sensor des Empfängers ein (ab 0.7.0) |

## Die LED

| Aufruf | Was er macht |
|---|---|
| `led.set_color(r, g, b)` | setzt die Farbe, jeder Wert von 0 bis 255; die LED behält sie, bis ein anderer Befehl kommt |
| `led.off()` | schaltet die LED aus, dasselbe wie `set_color(0, 0, 0)` |
| `led.color` | die Farbe, die gerade wirklich leuchtet, als `(r, g, b)` von der Hardware gelesen |
| `led.uid` | die UID des LED-Bricklets |
| `led.raw` | das Tinkerforge-Objekt darunter, für alles, was das Kursmodul nicht anbietet |

## Der Sensor

| Aufruf | Was er macht |
|---|---|
| `sensor.read()` | holt die jüngste fertige Messung als `Reading(r, g, b, c)`, jeder Wert von 0 bis 65535; wartet nicht auf eine neue |
| `sensor.set_integration_time(ms)` | wie lange eine Messung Licht sammelt; erlaubt sind 2.4, 24, 101, 154 und 700 |
| `sensor.set_gain(factor)` | die Verstärkung; erlaubt sind 1, 4, 16 und 60 |
| `sensor.integration_time`, `sensor.gain` | die aktuelle Einstellung nachsehen |
| `sensor.set_light(on)` | die weiße Beleuchtungs-LED auf dem Sensor; für die Lichtstrecke bleibt sie aus |
| `sensor.uid`, `sensor.raw` | die UID des Sensor-Bricklets und das Tinkerforge-Objekt darunter |

Ein anderer Wert als die erlaubten führt zu einem `ValueError`, der die
erlaubten Werte nennt. Ein `Reading` könnt ihr auf zwei Arten benutzen: Ihr
entpackt es gleich in vier Variablen, oder ihr greift über die Namen auf die
einzelnen Werte zu.

```python static
r, g, b, c = sensor.read()

reading = sensor.read()
print(reading.c)          # nur der Klarkanal
```

## Die Verbindung selbst in der Hand: `LifiDevice`

`LifiDevice.connect()` sucht das Gerät, verbindet sich und gibt ein Objekt
zurück, das LED und Sensor enthält. Alle Angaben in den Klammern sind
freiwillig:

| Angabe | Voreinstellung | Bedeutung |
|---|---|---|
| `master` | keine | die UID des Master Brick, also welches Gerät gemeint ist |
| `log_file` | `"lifi_log.jsonl"` | Datei für das Messprotokoll; `None` schaltet es ab |
| `server` | der Kursserver | wohin das Protokoll hochgeladen wird; `None` schaltet das Hochladen ab |
| `host`, `port` | `"localhost"`, `4223` | wo der Brick Daemon läuft; das bleibt so |

Das Objekt hat die Teile `.led` und `.sensor`, die genau wie oben `led` und
`sensor` funktionieren, dazu `.master_uid` und `.close()`. `close()` schaltet
die LED aus und trennt die Verbindung. Mit `with` erledigt das Python am Ende
des Blocks für euch, auch wenn euer Code darin mit einem Fehler abbricht:

```python static
from lifi_hardware import LifiDevice

with LifiDevice.connect() as lifi:
    lifi.led.set_color(255, 0, 0)
    print(lifi.sensor.read())
```

## Welche UID gehört zu welchem Gerät?

Jedes Gerät hat eine Hauptplatine, den Master Brick, und dessen UID ist der
Name, unter dem das Kursmodul das Gerät kennt. LED und Sensor nimmt es immer
vom selben Master Brick, sodass nie ein Gerät aus der LED des einen und dem
Sensor des anderen entsteht. Welche Geräte gerade an eurem Laptop hängen,
fragt ihr mit `find_devices()` ab:

```python static
from lifi_hardware import find_devices

print(find_devices())     # etwa ['64SK5w', '6Bq3Xa']
```

Die Liste sagt euch noch nicht, welches der beiden Geräte auf eurem Tisch
welche UID trägt. Am schnellsten findet ihr es heraus, indem ihr jedes Gerät
nacheinander kurz aufleuchten lasst; `log_file=None` und `server=None` halten
dabei euer Messprotokoll und euer Cockpit frei von diesem kleinen Test.

```python static
import time
from lifi_hardware import LifiDevice, find_devices

for uid in find_devices():
    with LifiDevice.connect(master=uid, log_file=None, server=None) as lifi:
        print("Jetzt leuchtet", uid)
        lifi.led.set_color(255, 255, 255)
        time.sleep(3)
```

Schreibt die UID danach auf einen Zettel am Gerät, dann müsst ihr das nur
einmal machen. Der Brick Viewer zeigt sie ebenfalls an, in der Zeile „Master
Brick“.

## Ein bestimmtes Gerät ansprechen

Hängen zwei Geräte am Laptop und ein Skript sagt nicht, welches es meint,
bricht es beim ersten Gebrauch von `led` oder `sensor` mit einer Fehlermeldung
ab, die beide UIDs nennt. Das ist Absicht: Ein Programm, das zufällig das
falsche Gerät erwischt, würde Messreihen verfälschen, ohne dass ihr es merkt.
Ihr wählt das Gerät auf einem von drei Wegen, und danach funktioniert alles
wie gewohnt.

**Im Skript mit `use_device()`.** Der Aufruf muss vor dem ersten Gebrauch von
`led` oder `sensor` stehen, am besten gleich unter dem Import. Steht er
später, sind `led` und `sensor` schon mit einem Gerät verbunden, und ihr
bekommt eine Fehlermeldung, die genau das sagt.

```python static
from lifi_hardware import led, sensor, use_device

use_device("64SK5w")
led.set_color(255, 0, 0)
```

**Von außen mit der Umgebungsvariable `LIFI_MASTER`.** Dann bleibt das Skript
unverändert, und ihr entscheidet beim Start, welches Gerät es benutzt. Das ist
praktisch, wenn dasselbe Skript einmal am einen und einmal am anderen Gerät
laufen soll. Im Terminal von Windows (PowerShell) sieht das so aus:

```powershell
$env:LIFI_MASTER = "64SK5w"
python messen.py
```

Auf dem Mac steht beides in einer Zeile:

```zsh
LIFI_MASTER=64SK5w python3 messen.py
```

Die Variable gilt in PowerShell, bis ihr das Terminal schließt, und nur in
diesem einen Terminal; auf dem Mac gilt sie nur für diesen einen Aufruf.

**Mit `LifiDevice.connect(master=...)`.** Das ist der Weg, wenn ihr die
Verbindung ohnehin selbst in der Hand habt, und der einzige, mit dem ein
Skript zwei Geräte zugleich benutzt.

Ein typischer Fall für die ersten beiden Wege sind zwei Skripte in zwei
Terminals, eines sendet und eines empfängt. Jedes nennt sein eigenes Gerät,
und beide laufen gleichzeitig. Weil beide Programme ihr Protokoll sonst in
dieselbe `lifi_log.jsonl` schreiben würden, wo sich die Zeilen beider Geräte
mischen, startet ihr sie am besten aus zwei verschiedenen Ordnern.

## Zwei Geräte in einem Skript

Ein einziges Skript, das mit der LED des einen Geräts sendet und mit dem
Sensor des anderen misst, hat einen großen Vorteil: Es weiß genau, wann die
Farbe gewechselt hat. Bei zwei Programmen oder zwei Laptops wisst ihr das
nicht, und genau diese Unsicherheit macht Kalibrierung und Messreihen
schwieriger. Für Versuche an eurer Strecke, etwa wie stark eine Farbe streut
oder welche Integrationszeit sich lohnt, ist ein Skript mit beiden Geräten
deshalb der bequemste Aufbau.

Dafür verbindet ihr euch zweimal mit `LifiDevice.connect()`, je einmal mit
der UID jedes Geräts. Beide Verbindungen leben nebeneinander, und jedes Gerät
bekommt sein eigenes Messprotokoll, damit sich die Zeilen nicht mischen. Ein
`with` mit zwei Verbindungen schließt am Ende beide.

```python static
import time
from lifi_hardware import LifiDevice

SENDING = "64SK5w"      # UID des Geräts, dessen LED sendet
RECEIVING = "6Bq3Xa"    # UID des Geräts, dessen Sensor misst

with LifiDevice.connect(master=SENDING, log_file="lifi_log_tx.jsonl") as tx, \
     LifiDevice.connect(master=RECEIVING, log_file="lifi_log_rx.jsonl") as rx:

    pause = 2 * rx.sensor.integration_time / 1000    # in Sekunden

    for color in [(255, 0, 0), (0, 255, 0), (0, 0, 255)]:
        tx.led.set_color(*color)
        time.sleep(pause)
        print(color, rx.sensor.read())
```

`tx` und `rx` sind die üblichen Kurznamen für Sender (transmitter) und
Empfänger (receiver). Ihr könnt sie nennen, wie ihr wollt, nur nicht
`sender` und `receiver`, denn so heißen die beiden Namen, die das Kursmodul
für den Test von Challenge 1 anbietet.

Die Pause nach dem Farbwechsel ist der Teil, der am häufigsten fehlt. Der
Sensor misst in seinem eigenen Takt, und `read()` holt die jüngste fertige
Messung, ohne zu warten. Direkt nach `set_color()` ist das noch eine Messung
von vorher, und die Messung, die gerade läuft, hat einen Teil ihrer Zeit noch
das alte Licht gesammelt. Erst die Messung danach sieht nur die neue Farbe.
Wer also zwei Integrationszeiten wartet, liest sicher einen Wert der neuen
Farbe. Ändert ihr die Integrationszeit, wächst die Pause im Beispiel von
selbst mit.

Mit beiden Geräten in einem Skript dürft ihr natürlich auch beide Sensoren
lesen oder beide LEDs schalten, etwa um eine Strecke in beide Richtungen zu
prüfen. Jedes Gerät lädt sein Protokoll wie gewohnt hoch, solange ihr das
Hochladen nicht abschaltet.

## Und der Test von Challenge 1?

Für den Test von [[lifi-challenge-1]] müsst ihr nichts davon selbst
schreiben. `sender` und `receiver` finden die Geräte von selbst: Hängen beide
am selben Laptop, lässt das Kursmodul eine LED leuchten und fragt, ob dieses
Gerät sendet oder empfängt, und legt danach wie im Beispiel oben je ein
Protokoll pro Gerät an, `lifi_log_<UID>.jsonl`. Auch die beiden Einstellungen
des Sensors setzt ihr dort nicht selbst mit `set_gain()` oder
`set_integration_time()`, sondern über `GAIN` und `INTEGRATION_TIME` oben in
der Vorlage, die `run_test` vor der Kalibrierung am Empfänger einstellt. Wie
eure Datei für den Test aussieht, steht in [[lifi-challenge-1]].

## Wenn eine Fehlermeldung kommt

Die Meldungen des Kursmoduls sind englisch und sagen meist schon, was zu tun
ist. Die häufigsten:

| Meldung beginnt mit | Was los ist |
|---|---|
| `2 devices found, with the master bricks …` | Zwei Geräte hängen am Laptop und das Skript hat keines gewählt; die Meldung schlägt den passenden Aufruf schon vor. |
| `Not found at master brick …` | Die UID passt zu keinem Gerät, meist ein Tippfehler; die Meldung nennt die vorhandenen UIDs. |
| `led and sensor are already connected to master brick …` | `use_device()` kam erst nach dem ersten Gebrauch von `led` oder `sensor`. |
| `Not found: RGB LED Bricklet 2.0` oder `Color Bricklet 2.0` | Das Gerät steckt nicht, ein Kabel zwischen den Platinen sitzt locker, oder der Brick Daemon läuft nicht. |
| `There is no integration time of …` oder `There is no gain of …` | Ein Wert, den der Sensor nicht kennt; die Meldung nennt die erlaubten. |

Hilft die Meldung nicht weiter, lohnt sich der Blick in den Quelltext im
[GitHub-Repository](https://github.com/winf-hsos/lifi-hardware): Jede dieser
Meldungen steht dort an der Stelle, an der sie entsteht, und der Code darum
herum zeigt, was das Kursmodul vorher geprüft hat.
