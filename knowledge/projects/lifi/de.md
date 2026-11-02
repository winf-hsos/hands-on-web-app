---
kind: project
code: 4577
title: Das LiFi-Projekt
summary: >-
  Ihr baut aus einer farbigen LED und einem Farbsensor eine Funkstrecke aus
  Licht und bringt sie in fünf Challenges, eine ganze Datei fehlerfrei zu
  übertragen.
level: 1
modules: [dup]
items: [petzold-code, visual-studio-code]
phases:
  - id: start
    challenge: lifi-challenge-0
    items: [first-light, problem-decomposition, cutting-the-lifi-project, input-processing-output-slides, input-processing-output, input-processing-output-quiz, algorithms-and-programs-slides, algorithms-and-programs, algorithms-and-programs-quiz]
  - id: alphabet
    challenge: lifi-challenge-1
    items:
      - sent-is-not-measured
      - measuring-and-experimenting
      - measurement-and-experiments
      - measurement-and-experiments-quiz
      - analog-and-digital-slides
      - analog-and-digital
      - analog-and-digital-quiz
      - symbols-and-information-slides
      - symbols-and-information
      - symbols-and-information-quiz
      - perfect-reception-perfect-nonsense
      - card-guessing
      - colours-on-a-number-line
      - signal-and-noise-slides
      - signal-and-noise
      - signal-and-noise-quiz
      - measuring-your-noise
      - believed-and-measured
      - place-value-systems
      - why-two-states
      - why-ten
      - lifi-colour-alphabet-quiz
  - id: word
    challenge: lifi-challenge-2
    items: [morse-code]
  - id: protocol
    challenge: lifi-challenge-3
    items: [morse-code]
  - id: packet
    challenge: lifi-challenge-4
    items: [byte, hexadecimal, binary-prefixes, logic-gates]
status: draft
updated: 2026-11-02
---

Jede Person im Team bekommt ein kleines Gerät mit einer RGB-LED und einem
Farbsensor. Stellt ihr zwei Geräte gegenüber, leuchtet die LED des einen in den
Sensor des anderen, und über diese kurze Strecke durch die Luft sollen Daten
fließen. Am Anfang unterscheidet ihr ein paar Farben, am Ende überträgt eure
Strecke eine unbekannte Datei Byte für Byte.

Das Gerät ist dabei nur der Anlass. Worum es eigentlich geht, ist, wie
Information digital dargestellt wird, wie man ein großes Problem in Stücke
zerlegt, die sich einzeln testen lassen, und wie man mit einem KI-Assistenten
programmiert, ohne ihm blind zu glauben. Licht eignet sich dafür, weil es
langsam und sichtbar ist: Was sonst unsichtbar im Rechner passiert, kann man
hier zusehen. Und weil kein Sprachmodell euren Aufbau kennt, müsst ihr das
Entscheidende messen, statt es zu erfragen.

## Phase 0: Das Gerät zum Leben erwecken {#start}

## Phase 1: Wie viele Farben kann der Sensor unterscheiden? {#alphabet}

## Phase 2: Aus Farben werden Buchstaben {#word}

## Phase 3: Ein Protokoll, das andere verstehen {#protocol}

## Phase 4: Eine ganze Datei {#packet}

## Was ihr braucht

Jede Person bekommt ein fertig montiertes Gerät, ein Team hat also beide Enden
der Strecke. Das ist mehr wert, als es klingt: Wer nur den Sender baut, muss
raten, was der Empfänger sieht, und ihr könnt nachsehen. Jede Person arbeitet
an ihrem eigenen Laptop mit ihrem eigenen Gerät; teilt die Arbeit nach den
beiden Enden auf und tauscht ab und zu die Rollen, damit ihr beide beide
Seiten kennt. Wenn eine Seite nicht funktioniert, liegt die Antwort meist auf
der anderen.

**Allein geht es auch.** Wer das Projekt ohne Partner angeht, schließt beide
Geräte an einen Laptop an und startet Sender und Empfänger als zwei Programme.
Jedes Programm sagt dann, welches Gerät es meint, mit der Kennung des Master
Bricks, die der Brick Viewer anzeigt:

```python static
from lifi_hardware import led, sensor, use_device

use_device("abc123")  # replace with the UID of your master brick
led.set_color(255, 0, 0)
```

Ihr verliert dabei den Partner, nicht das Projekt. Nur der Interop-Test in
Challenge 3 braucht ein anderes Team; wer allein ist, gibt seine
Protokollbeschreibung jemandem, der den Code nicht kennt, oder einem
KI-Assistenten in einer neuen Sitzung, und lässt sich den Empfänger
beschreiben, den er danach bauen würde. Die Lücken zeigen sich genauso.

Im Gehäuse aus dem 3D-Drucker stecken drei Bauteile von Tinkerforge:

| Bauteil | Aufgabe |
|---|---|
| Master Brick | steuert alles und hängt per USB-C am Laptop |
| RGB LED Bricklet 2.0 | der Sender, jede Farbe von 0 bis 255 |
| Color Bricklet 2.0 | der Empfänger, misst Rot, Grün, Blau und ungefiltertes Licht (C) jeweils von 0 bis 65535 |

LED und Sensor sitzen nebeneinander an der Vorderseite, getrennt durch eine
Wand, damit ein Gerät nicht sein eigenes Licht sieht. Die kleine weiße Lampe
auf dem Sensor bleibt aus, sie bringt nur Streulicht. Beim Sensor lassen sich
Integrationszeit und Verstärkung einstellen; beide verändern, wie empfindlich
und wie schnell er misst.

Selbst baut ihr nur eure Optik zwischen den Geräten. Erlaubt ist alles, was
selbst kein Licht erzeugt oder misst, also Röhren, Pappe, Farbe, Folie,
Spiegel, Linsen oder Teile aus dem 3D-Drucker. Zusätzliche Sensoren, weitere
Lichtquellen, Laser oder ein Austausch von LED und Sensor sind nicht erlaubt.

## Software und KI-Assistent

Ihr programmiert in Python mit Visual Studio Code, und als KI-Assistent ist
OpenCode eingerichtet. Euer Programm läuft auf dem Laptop und steuert das Gerät
über USB, aufgespielt wird nichts. Damit der Laptop das Gerät findet, muss im
Hintergrund der Brick Daemon laufen; der Brick Viewer zeigt euch, ob alles
erkannt wird.

Für den Zugriff auf LED und Sensor gibt es das Kursmodul `lifi_hardware`. Damit
reichen Befehle wie `led.set_color(r, g, b)` und `sensor.read()`, ohne dass ihr
euch um die Details der Hardware kümmern müsst. Wie ihr das Kursmodul und die
Vorlagen auf euren Rechner bekommt, steht in eurem Kurs.

Für jede Challenge gibt es eine Vorlage mit einem **Vertrag**: eine Handvoll
Funktionen mit festem Namen, festen Argumenten und festem Rückgabewert. Was ihr
innerhalb dieser Funktionen schreibt, ist eure Sache, und eigene Funktionen
dürft ihr beliebig ergänzen. Das Testskript ruft ausschließlich die
Vertragsfunktionen auf, deshalb läuft bei jedem Team derselbe Test, und die
Ergebnisse sind vergleichbar.

| Challenge | Was ihr umsetzt |
|---|---|
| 0 | sechs kleine Aufgaben, je ein Skript, von `task_1_light_on.py` bis `task_6_human_receiver.py` |
| 1 | `ALPHABET_SIZE`, `calibrate_sender()`, `calibrate_receiver()`, `send_symbol(index)`, `receive_symbol()` |
| 2 | `send_text(text)`, `receive_text(n_chars)` |
| 3 | `send_message(text)`, `receive_message()` |
| 4 | `send_bits(bits)`, `receive_bits()` |

Die Verträge wachsen mit: erst einzelne Symbole, dann Text bekannter Länge,
dann Text, dessen Länge der Empfänger nicht kennt, und zuletzt nur noch Bits.
Auf jeder Stufe sieht man genau die Abstraktion, um die es in der Challenge
geht. **Selbsttest und Abnahme sind dasselbe Skript:** Mit ihm testet ihr
selbst, so oft ihr wollt, und mit ihm wird auch abgenommen. Ändert es deshalb
nicht; bei der Abnahme läuft ohnehin die Originalfassung.

## So wird abgenommen

Jede Challenge ab der ersten endet an einem gemeinsamen Testtisch, an dem für
alle dieselben Bedingungen gelten, auch derselbe feste Abstand zwischen den
Geräten. Kalibriert vor jedem Durchgang neu, denn das Licht am Testtisch ist ein
anderes als an eurem Platz, und baut eure Optik so, dass sie den Weg dorthin
übersteht.

Zu jeder Abnahme gehört eine Live-Änderung: Ihr ändert euren Code vor Ort nach
einer Vorgabe. Damit zeigt ihr, dass ihr versteht, was ihr mit dem KI-Assistenten
gebaut habt. Eine schriftliche Dokumentation ist nicht verlangt; einzige
Ausnahme ist die Protokollbeschreibung aus Challenge 3, ohne die der
Interop-Test nicht funktioniert.

Wie die Challenges bewertet werden und wann die Abnahmen stattfinden, steht
in eurem Kurs.

## Was jede Challenge hervorbringt

Aus jeder Challenge kommen drei Ergebnisse, die niemand einsammelt oder
bewertet. Sie sind für euch, und es lohnt sich, sie vom ersten Tag an zu
führen, denn jede Challenge baut auf der vorigen auf.

- **Messprotokolle:** Was habt ihr verändert, was gleich gelassen, und was kam
  heraus? Ein gutes Protokoll versteht euer Partner auch eine Woche später noch.
- **Eine Beschreibung eurer Lösung:** wie eure Strecke funktioniert, so genau,
  dass ein anderes Team sie nachbauen könnte. Ab Challenge 3 wird daraus die
  vollständige Beschreibung eures Protokolls.
- **Ein Irrtumsprotokoll:** zwei oder drei Stellen, an denen der KI-Assistent
  etwas vorgeschlagen hat und eine Messung es widerlegt hat. Das ist kein
  Geständnis, sondern das nützlichste Dokument, das ihr schreibt, weil es genau
  zeigt, wo das Wissen des Assistenten endet und eures beginnt.

Zusammen erzählen diese drei, wie ihr das Problem gelöst habt, und sie sind die
beste Vorbereitung, wenn ihr später erklären wollt, warum euer Gerät so
funktioniert, wie es funktioniert.
