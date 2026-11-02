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
    items: [problem-decomposition, cutting-the-lifi-project, input-processing-output-slides, input-processing-output, input-processing-output-quiz, algorithms-and-programs-slides, algorithms-and-programs, algorithms-and-programs-quiz]
    challenges:
      - id: challenge-0
  - id: alphabet
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
    challenges:
      - id: challenge-1
        items: [lifi-colour-alphabet-quiz]
  - id: word
    items: [morse-code]
    challenges:
      - id: challenge-2
  - id: protocol
    challenges:
      - id: challenge-3
        items: [morse-code]
  - id: packet
    items: [byte, hexadecimal, binary-prefixes]
    challenges:
      - id: challenge-4
        items: [logic-gates]
status: draft
updated: 2026-11-01
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
Sensor gibt fortlaufend seine vier Messwerte aus. Jede Person bringt dabei ihr
eigenes Gerät an ihrem eigenen Laptop zum Laufen, und am Ende schaltet ihr die
LED des einen Geräts um und seht, wie sich die Zahlen des Sensors gegenüber
ändern.

**Neu ist** hier alles: Für die meisten ist es das erste eigene Programm, und
zwei Werkzeuge kommen dazu, die euch durch das ganze Projekt begleiten, das
Terminal, in dem ihr Programme startet, und der KI-Assistent, mit dem ihr
arbeitet. Wer dafür länger braucht, ist nicht im Rückstand; die meisten vor
euch hatten auch noch nie ein Terminal gesehen.

**Aufgabe:** Sechs kleine Programme, je eine Datei, die aufeinander aufbauen.
Wo in der Vorlage `TODO` steht, fehlt euer Code.

| | Datei | Was ihr dabei lernt |
|---|---|---|
| 1 | `task_1_light_on.py` | eine Funktion aufrufen und ihr Werte übergeben |
| 2 | `task_2_blink.py` | eine Schleife, also etwas mehrmals ausführen |
| 3 | `task_3_color_cycle.py` | eine Liste und wie man sie durchläuft |
| 4 | `task_4_measure.py` | eine Funktion, die Werte zurückgibt, und Messen in einer Situation nach der anderen |
| 5 | `task_5_react.py` | eine Bedingung, also je nach Lage etwas anderes ausführen |
| 6 | `task_6_human_receiver.py` | was ein Empfänger eigentlich leisten muss |

Mehr Bausteine gibt es nicht: Alles, was ihr im Projekt programmiert, besteht
aus Anweisungen nacheinander, wiederholt und unter einer Bedingung. Jede
Aufgabe startet ihr einzeln, etwa mit `python task_3_color_cycle.py`; Aufgabe 5
läuft, bis ihr sie mit Strg+C beendet.

**Den Schwellenwert findet ihr selbst.** In Aufgabe 4 nehmt ihr mit jeder
Eingabetaste einen Messwert auf: bei Raumlicht, mit der Hand über dem Sensor,
mit der Taschenlampe des Handys von weit weg und von nah. Der Wert `c` ist die
Helligkeit, und euer Schwellenwert für Aufgabe 5 liegt zwischen „abgedeckt“
und „Taschenlampe“. Bleibt `c` bei 65535 stehen, ist der Sensor übersteuert,
und ihr haltet die Lampe weiter weg.

**Selbst einmal Empfänger sein:** In Aufgabe 6 sendet euer Programm eine Folge
von Farben, und eine Person schreibt sie auf, ohne auf den Bildschirm zu
schauen; danach vergleicht ihr. Beim ersten Mal klappt das mühelos.
Interessant wird es, wenn ihr jedes Mal genau eine Sache ändert: schneller
senden, mehr Farben verwenden, den Start nicht ankündigen, dieselbe Farbe
zweimal hintereinander senden. Schreibt auf, woran es jedes Mal gescheitert
ist. Diese Liste ist ziemlich genau die Liste der Probleme, die euer Programm
in den nächsten Challenges lösen muss, und ihr habt sie selbst gefunden.

**Geschafft ist sie,** wenn die Programme auf beiden Geräten laufen und ihr vor
Zuschauern eine kleine Änderung daran vornehmt, etwa „lass die LED doppelt so
schnell blinken“ oder „dreh die Bedingung in Aufgabe 5 um“. Das ist keine
Falle, sondern der Anfang einer Gewohnheit, die bis zum Schluss bleibt: Euren
eigenen Code könnt ihr vor Ort ändern und wisst, was dann passiert, auch wenn
Teile davon mit dem Assistenten entstanden sind. Hier wird nichts gemessen,
keine Rangliste geführt und nichts abgegeben, aber ohne laufendes Gerät könnt
ihr Challenge 1 nicht einmal beginnen.

**Typische Stolpersteine:** Der Brick Daemon läuft nicht; ohne ihn findet euer
Programm die Hardware nicht, so richtig der Code auch ist, also prüft ihn
jedes Mal zuerst. Unter Windows fehlt Python im Suchpfad, fast immer wegen des
fehlenden Häkchens bei „Add python.exe to PATH“ während der Installation, und
auf dem Mac heißen die Befehle `python3` und `pip3`. Zeigt der Brick Viewer das
Gerät nicht an, liegt das Problem vor eurem Code und nicht darin: Kabel,
Anschluss, Stromversorgung.

**Die Zahlen passen nicht:** Ihr schickt der LED `(255, 0, 60)`, und der Sensor
meldet ganz andere Werte. Das ist richtig und kein Fehler. Warum das so ist und
was daraus folgt, ist Thema der nächsten Phase; lasst die Frage bis dahin offen.

**Für Schnelle:** Probiert verschiedene Farben aus und notiert, was der Sensor
jeweils meldet, dann verändert den Abstand und beobachtet, was mit den Zahlen
passiert. Diese Notizen braucht ihr in Challenge 1 sofort.

## Wie viele Farben kann der Sensor unterscheiden? {#alphabet}

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

### Challenge 1: Das Alphabet {#challenge-1}

**Ziel:** Herausfinden, wie viele Zustände eure Strecke in 50 Versuchen ohne
einen einzigen Fehler unterscheidet. Das entscheidet über das ganze Projekt:
Wer vier Zustände sicher unterscheidet, sendet später zwei Bit je Symbol, wer
sechzehn schafft, sendet vier und überträgt bei gleichem Tempo doppelt so viel.

**Neu ist,** dass ihr zum ersten Mal etwas über euren Aufbau herausfinden müsst,
statt es euch auszudenken. Wie viele Zustände unterscheidbar sind, weiß vorher
niemand, auch der KI-Assistent nicht, denn es hängt von eurem Sensor, eurem
Abstand, eurem Raum und dem ab, was ihr dazwischen baut.

**Aufgabe:** Der Sender zeigt eine Farbe aus einem Satz, den ihr selbst
festlegt, und der Empfänger sagt, welche es war. Timing spielt noch keine
Rolle: Ein Mensch drückt die Eingabetaste, das Programm misst, und der Name des
erkannten Zustands erscheint beim Empfänger.

**Dreimal gezählt** wird, und alle drei Zahlen gehören in eure Notizen:

1. **Mit bloßem Auge:** Bevor ihr eine Zeile Code schreibt, zählt ihr, wie
   viele Farben ihr selbst sicher unterscheidet, wenn ihr sie einzeln seht und
   nicht nebeneinander. In manchem schlägt euer Auge den Sensor deutlich, in
   anderem verliert es klar, und ein Grund dafür zählt für den Rest der
   Challenge: Euer Sehen kalibriert sich ständig neu, wenn sich das Licht im
   Raum ändert, der Sensor dagegen meldet einfach andere Zahlen.
2. **Ohne Hilfsmittel:** nackte LED, nackter Sensor, fester Abstand.
3. **Mit eurem Aufbau:** Ihr baut euren Lichtkanal, eine Röhre, eine Blende
   oder was euch einfällt, und messt erneut.

Es zählt das dritte, bessere Ergebnis. Ohne das zweite wisst ihr aber nicht, ob
euer Aufbau überhaupt etwas gebracht hat, und genau darum ist diese
Kontrollmessung Pflicht. Was ihr bauen dürft, steht unter „Was ihr braucht“.

**Die drei Ergebnisse dieser Challenge** (siehe „Was jede Challenge
hervorbringt“) sind damit die Messprotokolle ohne und mit Hilfsmitteln, als
Beschreibung eurer Lösung ein Foto des Aufbaus mit einem Satz, warum ihr ihn so
gebaut habt, und euer Irrtumsprotokoll. Für das letzte ist diese Challenge die
ergiebigste Quelle: Fragt ihr den Assistenten, warum die Röhre nicht hilft,
schlägt er mattschwarze Innenwände, Blenden und engere Öffnungen vor, alles
plausibel und nichts davon geprüft, bis ihr es gemessen habt.

**Was ihr in der Vorlage ausfüllt:** Alles kommt in `device.py`, und das
Testskript fragt genau fünf Dinge ab, nicht mehr. Wie ihr sie innen baut, ist
eure Sache, und eigene Funktionen dürft ihr beliebig ergänzen.

| | Was |
|---|---|
| `ALPHABET_SIZE` | wie viele Symbole ihr verwendet, nummeriert von 0 bis `ALPHABET_SIZE - 1` |
| `calibrate_sender()` | spielt euer Alphabet einmal durch |
| `calibrate_receiver()` | misst dabei mit und merkt sich für jedes Symbol einen Referenzwert |
| `send_symbol(index)` | zeigt ein Symbol und kehrt erst zurück, wenn der Empfänger genug Zeit zum Messen hatte |
| `receive_symbol()` | misst und gibt zurück, welches Symbol es war |

Der Empfänger kann nicht ausrechnen, welches Symbol angekommen ist, er muss
vorher lernen, wie eure Symbole in diesem Aufbau aussehen, und vergleicht dann
jeden neuen Messwert mit den Referenzen. Daraus folgt zweierlei: Beim
Kalibrieren müssen beide Seiten im selben Takt laufen, sonst ordnet der
Empfänger seine Messwerte den falschen Symbolen zu, und kalibriert wird vor
jedem Durchgang neu, auch am Testtisch.

**Selbsttest und Abnahme sind dasselbe Skript.** Ihr startet es auf beiden
Rechnern, jeder in seiner Rolle, mit `python run_test.py sender` und
`python run_test.py receiver`. Beide Seiten schreiben ein Protokoll
(`sent.txt` und `received.txt`); legt beide in einen Ordner und vergleicht sie
mit `python compare.py`. Für schnelle Versuche zwischendurch genügen weniger
Durchgänge (`--runs 10`). Weil bei der Abnahme genau dieses Skript läuft, könnt
ihr den Wertungslauf vorher so oft proben, wie ihr wollt, und am Testtisch
passiert nichts Neues. Bewährt hat sich, mit `ALPHABET_SIZE = 2` anzufangen,
also aus und weiß, und nach 50 fehlerfreien Durchgängen auf 4 und dann auf 8 zu
gehen; die letzte Größe ohne Fehler ist euer Ergebnis. Verwechselt `compare.py`
jedes Mal dieselben zwei Symbole, liegen sie zu dicht beieinander, sieht es
zufällig aus, sind eher Timing oder Kalibrierung schuld.

**Bei der Abnahme** baut ihr am Testtisch euren Aufbau auf, kalibriert, und es
werden 20 zufällige Symbole übertragen. Ein einziger Fehler gilt für diese
Alphabetgröße als nicht bestanden; acht sicher erkannte Zustände sind also mehr
wert als sechzehn mit gelegentlicher Verwechslung. Als Live-Änderung erweitert
ihr euer Alphabet, etwa auf bis zu zwölf Symbole, und lasst den Test erneut
laufen; dafür müsst ihr die Stellen in eurem Code finden, die von der Größe des
Alphabets abhängen.

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
Gruppe sich auf einen gemeinsamen Rahmen für das Finale einigt.

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

**Ziel:** Eine unbekannte Datei von höchstens 2 KiB (2048 Byte), etwa ein Text
oder ein kleines Bild, wird Byte für Byte übertragen. Ob sie wirklich unverändert
angekommen ist, zeigt ein Vergleich der Prüfsummen (SHA-256).

**Aufgabe:** Der Rahmen der Gruppe legt Präambel, Dateityp, Länge, Nutzdaten,
Prüfsumme und Endmarke fest. Frei sind Alphabet, Farben, Sensoreinstellungen,
Symbolrate, Kalibrierung, wie ihr mit auseinanderlaufenden Uhren umgeht und eure
Optik. Erstmals dürft ihr auch den Rückweg nutzen: Dreht ihr eines der Geräte
um, kann der Empfänger dem Sender antworten, etwa um ein kaputtes Stück neu
anzufordern. Das ist erlaubt, aber nicht verlangt. Eure Strecke schafft grob 10
bis 50 Bit pro Sekunde, rechnet also nach, wie lange 16.384 Bit dauern.

**Gemessen wird** die Dauer, aber nur, wenn die Prüfsumme stimmt; eine
Übertragung, die bei 90 Prozent abbricht, zählt nicht. Dass der Empfänger die
Datei am Ende öffnet und anzeigt, ist die Show, nicht der Beweis.

**Typische Stolpersteine:** Code, der stillschweigend Text erwartet, eine
Präambel, die in beliebigen Daten auch vorkommen kann, ein zu ehrgeiziges
Timing und ein Aufbau, der den Weg zum Testtisch nicht übersteht.

**Für Schnelle:** Verschlüsselt die Nutzdaten, oder ersetzt Licht durch Schall.

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
