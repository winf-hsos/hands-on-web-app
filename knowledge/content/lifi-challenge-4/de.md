---
type: challenge
code: 3439
title: "Challenge 4: Das Paket"
summary: >-
  Eine unbekannte Datei von höchstens 2 KiB kommt Byte für Byte unverändert an, und eine Prüfsumme beweist es.
objectives:
  intro: "Mit dieser Challenge überträgst du eine ganze Datei und kannst danach:"
  goals:
    - "Bytes statt Text über eure Strecke senden"
    - "mit einer Prüfsumme zeigen, dass eine Datei unverändert angekommen ist"
    - "ausrechnen, wie lange eine Übertragung bei eurer Bitrate dauert"
    - "einen gemeinsamen Paketrahmen mit eigenen Entscheidungen verbinden"
level: 1
topics: [transferring-information, representing-information]
modules: [dup]
project: lifi
status: draft
updated: 2026-11-03
---

Im Finale geht es nicht mehr um Text, sondern um Bytes: eine Datei, die ihr
vorher nicht kennt, soll unverändert ankommen. Der gemeinsame Rahmen aus der
Normungssitzung legt fest, wie ein Paket aussieht, alles andere entscheidet ihr
selbst.

**Ziel:** Eine unbekannte Datei von höchstens 2 KiB (2048 Byte), etwa ein Text
oder ein kleines Bild, wird Byte für Byte übertragen. Ob sie wirklich unverändert
angekommen ist, zeigt ein Vergleich der Prüfsummen (SHA-256).

**Was feststeht und was frei ist:** Der Rahmen der Gruppe legt Präambel,
Dateityp, Länge, Nutzdaten, Prüfsumme und Endmarke fest. Frei sind Alphabet,
Farben, Sensoreinstellungen, Symbolrate, Kalibrierung, wie ihr mit
auseinanderlaufenden Uhren umgeht und eure Optik. Erstmals dürft ihr auch den
Rückweg nutzen: Dreht ihr eines der Geräte um, kann der Empfänger dem Sender
antworten, etwa um ein kaputtes Stück neu anzufordern. Das ist erlaubt, aber
nicht verlangt.

**Drei Aufgaben:** Ihr baut eure unterste Schicht, die Bits sendet und
empfängt, messt, wie weit eure Geräte über viele Symbole auseinanderlaufen, und
übertragt damit eine ganze Datei. Zu jeder Aufgabe gibt es Tipps zum
Aufklappen.

## Die Dateien

Ihr schreibt nur noch zwei Funktionen in `device.py`. Den Rahmen übernimmt
`frame.py`, und diese Datei ist für alle Teams gleich: Sie weiß nichts über
Licht, sondern nur, wie aus einer Datei ein Bitstrom wird, und ruft dafür eure
beiden Funktionen auf.

| Datei | Was hineinkommt |
|---|---|
| `device.py` | `send_bits(bits)` überträgt eine Liste aus Nullen und Einsen, `receive_bits()` gibt eine solche Liste zurück |
| `frame.py` | Präambel, Dateityp, Länge, Prüfsumme und Endmarke; ihr ändert sie nicht |

## Aufgabe 1: Bits senden und empfangen

Schreibt `send_bits(bits)` und `receive_bits()` so, dass eine Liste aus Nullen
und Einsen unverändert auf der anderen Seite ankommt. Wie aus Bits Symbole und
aus Symbolen Licht werden, entscheidet ihr allein.

**Datei:** `device.py`

> [!HINT]
> Im Rahmen steht nichts über Zeit. Wie schnell ihr sendet und wie der Empfänger eure Rate erfährt, gehört in eure eigene Schicht, denn eine Übertragung per Schall hätte dafür ganz andere Regeln.

> [!HINT]
> Ein Symbol aus einem Alphabet mit vier Farben trägt zwei Bit, eines aus acht Farben drei. Rechnet mit eurer Alphabetgröße aus Challenge 1 aus, wie viele Symbole eine Datei braucht.

## Aufgabe 2: Die Drift messen

Messt, wie weit eure beiden Geräte über tausend Symbole auseinanderlaufen.
Dann wisst ihr, wie groß euer Problem mit den Uhren ist, bevor ihr eine
Lösung dafür baut.

**Datei:** keine vorgegebene; die Messreihe kommt in eure Notizen.

> [!HINT]
> Sendet ein Muster, das der Empfänger kennt, und schaut, ab welchem Symbol er aus dem Tritt kommt. Wiederholt die Messung ein paarmal, denn eine einzelne Messreihe sagt wenig darüber, wie stark eure Uhren wirklich abweichen.

## Aufgabe 3: Die Datei übertragen

Übertragt eine Datei bis 2 KiB mit `run_test.py` aus der Vorlage. Der
Empfänger schreibt die Datei, prüft die Prüfsumme und gibt den SHA-256 aus, und
der Durchgang zählt nur, wenn er auf beiden Seiten gleich ist.

**Datei:** `device.py`; `frame.py` und `run_test.py` bleiben, wie sie sind.

> [!HINT]
> Eure Strecke schafft grob 10 bis 50 Bit pro Sekunde. Rechnet aus, wie lange 2048 Byte, also 16.384 Bit, bei eurer Rate dauern, und plant das Tempo danach.

> [!HINT]
> Übt zuerst mit einer kleinen Textdatei, die ihr lesen könnt, und erst danach mit einem kleinen Bild.

## Abnahme

**Gemessen wird** die Dauer, aber nur, wenn die Prüfsumme stimmt; eine
Übertragung, die bei 90 Prozent abbricht, zählt nicht. Dass der Empfänger die
Datei am Ende öffnet und anzeigt, ist die Show, nicht der Beweis.

## Stolpersteine und mehr

**Typische Stolpersteine:** Code, der stillschweigend Text erwartet, eine
Präambel, die in beliebigen Daten auch vorkommen kann, ein zu ehrgeiziges
Timing und ein Aufbau, der den Weg zum Testtisch nicht übersteht.

**Für Schnelle:** Verschlüsselt die Nutzdaten, denn Licht ist öffentlich, und
jedes Nachbarteam kann seinen Sensor neben euren stellen. Oder ersetzt Licht
durch Schall, mit einer zweiten Fassung von `device.py`, die Lautsprecher und
Mikrofon statt LED und Sensor nutzt, während `frame.py` und `run_test.py`
bleiben, wie sie sind.
