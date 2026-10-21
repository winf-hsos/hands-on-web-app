---
kind: project
code: 4577
title: "LiFi: Daten mit Licht übertragen"
summary: >-
  Zu zweit baut ihr aus einer farbigen LED und einem Farbsensor eine
  Funkstrecke aus Licht und bringt sie in fünf Challenges dazu, am Ende eine
  ganze Datei fehlerfrei zu übertragen.
level: 1
topics: [transferring-information, representing-information]
modules: [dup]
items: [petzold-code]
phases:
  - id: start
    challenges:
      - id: challenge-0
  - id: alphabet
    challenges:
      - id: challenge-1
  - id: word
    items: [knock-code, morse-code, morse-and-the-type-case]
    challenges:
      - id: challenge-2
        items: [code-as-agreement, prefix-free-code, code-systems-quiz]
  - id: protocol
    challenges:
      - id: challenge-3
        items: [morse-code]
  - id: packet
    challenges:
      - id: challenge-4
        items: [logic-gates]
status: draft
updated: 2026-10-22
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

## Das Gerät zum Leben erwecken {#start}

Bevor ihr irgendetwas überträgt, muss jedes Gerät auf eurem eigenen Rechner
laufen: die LED leuchtet in einer Farbe, die ihr im Code wählt, und der Sensor
meldet, was er sieht.

### Challenge 0: Der Funke {#challenge-0}

**Ziel:** Auf jedem Gerät zeigt die LED eine Farbe aus eurem Code, und der
Sensor gibt fortlaufend seine vier Messwerte aus.

**Aufgabe:** Sechs kleine Programme, die aufeinander aufbauen: Licht an,
blinken, durch Farben wechseln, messen, auf einen Schwellenwert reagieren und
zum Schluss ein Mensch als Empfänger, der die Farben selbst abliest.

**Geschafft ist sie,** wenn die Programme laufen und ihr vor Zuschauern eine
kleine Änderung daran vornehmt. Hier wird nichts gemessen und keine Rangliste
geführt.

**Typische Stolpersteine:** Der Brick Daemon läuft nicht, unter Windows fehlt
Python im Suchpfad, auf dem Mac heißen die Befehle `python3` und `pip3`. Zeigt
der Brick Viewer das Gerät nicht an, prüft Kabel, Anschluss und Stromversorgung.
Und wundert euch nicht, dass der Sensor nie genau die Zahlen meldet, die ihr der
LED geschickt habt: Genau damit beginnt Phase 2.

## Wie viele Farben kann der Sensor unterscheiden? {#alphabet}

Jetzt geht es um die Strecke selbst. Ein Sensor misst nie zweimal genau
dasselbe, Umgebungslicht stört, und der Abstand verändert alles. Die Frage
dieser Phase ist, wie viele Zustände euer Aufbau zuverlässig auseinanderhalten
kann, denn das ist euer Alphabet für alles Weitere.

### Challenge 1: Das Alphabet {#challenge-1}

**Ziel:** Herausfinden, wie viele Zustände eure Strecke in 50 Versuchen ohne
einen einzigen Fehler unterscheidet.

**Aufgabe:** Notiert zuerst, wie viele Farben ihr mit bloßem Auge unterscheiden
könnt. Dann misst ihr: Für jedes Symbol drückt ein Mensch die Eingabetaste,
Timing spielt noch keine Rolle. Messt einmal mit dem nackten Gerät und einmal
mit eurer eigenen Optik zwischen den Geräten; es zählt der bessere Wert, und
beide gehören in eure Notizen.

**Bei der Abnahme** werden am Testtisch 20 zufällige Symbole übertragen. Als
Live-Änderung nehmt ihr ein weiteres Symbol in euer Alphabet auf.

**Typische Stolpersteine:** feste Schwellenwerte statt einer Kalibrierung vor
jedem Durchgang, der ungefilterte Kanal C wird übersehen, obwohl er der
empfindlichste ist, zu wenige Wiederholungen beim Messen, und Farben, die
schön aussehen, statt Farben, die der Sensor gut unterscheidet.

**Für Schnelle:** Probiert verschiedene Integrationszeiten des Sensors aus und
messt, was sie am Ergebnis ändern.

## Aus Farben werden Buchstaben {#word}

Mit einem Alphabet aus Farben lassen sich Wörter übertragen, sobald zwei Dinge
geklärt sind: welche Folge von Farben für welchen Buchstaben steht, und wann der
Empfänger hinsieht. Das Erste ist eine Codetabelle, das Zweite ein gemeinsamer
Takt.

### Challenge 2: Das Wort {#challenge-2}

**Ziel:** Zehn Zeichen fehlerfrei und so schnell wie möglich übertragen.

**Aufgabe:** Ihr legt eine Codetabelle fest, die jeden Buchstaben auf eine Folge
eurer Symbole abbildet, und einigt euch auf eine feste Symbolrate, zum Beispiel
ein Symbol pro Sekunde. Ein Mensch startet beide Programme, und der Empfänger
erfährt nur, wie viele Zeichen kommen.

**Gemessen wird** zuerst, ob alle zehn Zeichen stimmen, und erst dann die Dauer.
Bei der Abnahme sendet ihr ein Wort, das ihr vorher nicht kennt. Als
Live-Änderung verdoppelt ihr eure Symbolrate.

**Typische Stolpersteine:** Was bei einem Symbol pro Sekunde klappt, zerfällt
bei fünf, weil die beiden Seiten keine gemeinsame Uhr haben. Der Empfänger misst
genau während eines Farbwechsels, startet zu spät, oder die Codewörter werden
länger als nötig.

**Für Schnelle:** Gebt häufigen Buchstaben kürzere Codewörter und achtet darauf,
dass sie trotzdem eindeutig lesbar bleiben.

## Ein Protokoll, das andere verstehen {#protocol}

Bisher wusste der Empfänger, wann es losgeht und wie lang die Nachricht ist. Das
fällt jetzt weg: Er muss selbst erkennen, wo eine Nachricht beginnt und wo sie
endet. Dafür braucht ihr Regeln, die so genau aufgeschrieben sind, dass auch ein
anderes Team danach einen Empfänger bauen könnte, und genau das wird geprüft.

### Challenge 3: Der Lauscher {#challenge-3}

**Ziel:** Der Empfänger läuft schon, bevor der Sender startet, und findet Anfang
und Ende einer Nachricht unbekannter Länge ohne menschliche Hilfe.

**Aufgabe:** Ihr entwerft einen Rahmen um eure Nachricht, etwa eine Präambel am
Anfang und eine Endmarke, und einen Empfänger, der weiß, in welchem Zustand er
ist: Er wartet, er liest oder er ist fertig. Eure Regeln schreibt ihr als
Protokollbeschreibung auf.

**Interop-Test:** Auf halber Strecke tauscht ihr eure Protokollbeschreibung mit
einem anderen Team, und jedes Team baut einen Empfänger für das Protokoll des
anderen. Nach dem Tausch sind keine Rückfragen erlaubt; was unklar ist, wird
aufgeschrieben. Die Phase endet mit einer Normungssitzung, in der die ganze
Gruppe sich auf einen gemeinsamen Rahmen für Phase 5 einigt.

**Gemessen wird,** ob der Empfänger ohne Hilfe richtig liest und wie viele Teams
mit eurer Beschreibung zurechtkamen. Bei der Abnahme entscheidet jemand anderes,
wann gesendet wird. Als Live-Änderung empfangt ihr zwei Nachrichten, ohne den
Empfänger neu zu starten.

**Tipp:** Trennt im Code die Frage, welche Bits gesendet werden, von der Frage,
wie Bits zu Licht werden. Dann könnt ihr das Protokoll mit einer Datei statt mit
der Hardware testen.

**Typische Stolpersteine:** Der Empfänger springt auf Rauschen an, die Präambel
kommt zufällig auch mitten in den Daten vor, das Ende wird nicht erkannt, oder
die Beschreibung schildert nur, was ihr gebaut habt, statt was ein anderes Team
wissen muss.

## Eine ganze Datei {#packet}

Im Finale geht es nicht mehr um Text, sondern um Bytes: eine Datei, die ihr
vorher nicht kennt, soll unverändert ankommen. Der gemeinsame Rahmen aus der
Normungssitzung legt fest, wie ein Paket aussieht, alles andere entscheidet ihr
selbst.

### Challenge 4: Das Paket {#challenge-4}

**Ziel:** Eine unbekannte Datei von höchstens 2 KB, etwa ein Text oder ein
kleines Bild, wird Byte für Byte übertragen. Ob sie wirklich unverändert
angekommen ist, zeigt ein Vergleich der Prüfsummen (SHA-256).

**Aufgabe:** Der Rahmen der Gruppe legt Präambel, Dateityp, Länge, Nutzdaten,
Prüfsumme und Endmarke fest. Frei sind Alphabet, Farben, Sensoreinstellungen,
Symbolrate, Kalibrierung, wie ihr mit auseinanderlaufenden Uhren umgeht und eure
Optik. Erstmals dürft ihr auch den Rückweg nutzen: Dreht ihr eines der Geräte
um, kann der Empfänger dem Sender antworten, etwa um ein kaputtes Stück neu
anzufordern. Das ist erlaubt, aber nicht verlangt. Eure Strecke schafft grob 10
bis 50 Bit pro Sekunde, rechnet also nach, wie lange 2 KB dauern.

**Gemessen wird** die Dauer, aber nur, wenn die Prüfsumme stimmt; eine
Übertragung, die bei 90 Prozent abbricht, zählt nicht. Dass der Empfänger die
Datei am Ende öffnet und anzeigt, ist die Show, nicht der Beweis.

**Typische Stolpersteine:** Code, der stillschweigend Text erwartet, eine
Präambel, die in beliebigen Daten auch vorkommen kann, ein zu ehrgeiziges
Timing und ein Aufbau, der den Weg zum Testtisch nicht übersteht.

**Für Schnelle:** Verschlüsselt die Nutzdaten, oder ersetzt Licht durch Schall.

## Was ihr braucht

Jede Person bekommt ein fertig montiertes Gerät, ein Team hat also beide Enden
der Strecke. Im Gehäuse aus dem 3D-Drucker stecken drei Bauteile von
Tinkerforge:

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
euch um die Details der Hardware kümmern müsst. Den Kursordner richtet ihr mit
dem Befehl `/onboarding` in OpenCode ein; er installiert alles und testet euer
Gerät. Eure eigenen Programme gehören in den Ordner `my-code`, den spätere
Aktualisierungen des Kursmaterials nie anfassen.

Für jede Challenge gibt es eine Vorlage mit fest vorgegebenen Funktionen und
einem Testskript. Mit genau diesem Skript testet ihr selbst, und mit ihm wird
auch abgenommen; ändert es deshalb nicht.

> [!NOTE]
> Das Kursmodul schickt eure Messwerte automatisch an den Kursserver. Dort
> seht ihr sie im Team-Cockpit als Zeitverlauf von LED-Farbe und Sensorkanälen,
> was bei der Fehlersuche sehr hilft.

## So wird abgenommen

Jede Challenge ab der ersten endet an einem gemeinsamen Testtisch, an dem für
alle dieselben Bedingungen gelten, auch derselbe feste Abstand zwischen den
Geräten. Kalibriert vor jedem Durchgang neu, denn das Licht am Testtisch ist ein
anderes als an eurem Platz, und baut eure Optik so, dass sie den Weg dorthin
übersteht.

Zu jeder Abnahme gehört eine Live-Änderung: Ihr ändert euren Code vor Ort nach
einer Vorgabe. Damit zeigt ihr, dass ihr versteht, was ihr mit dem KI-Assistenten
gebaut habt. Eine schriftliche Dokumentation ist nicht verlangt, aber
Messprotokolle und eine kurze Liste der Stellen, an denen eine Messung einen
Vorschlag der KI widerlegt hat, helfen euch selbst am meisten. Einzige Ausnahme
ist die Protokollbeschreibung in Phase 4, ohne die der Interop-Test nicht
funktioniert.

Wie die Challenges in eurem Semester bewertet werden und wann die Abnahmen
stattfinden, steht in eurem Kurs.
