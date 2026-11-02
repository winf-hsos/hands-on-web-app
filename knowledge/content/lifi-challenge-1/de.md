---
type: challenge
code: 9618
title: "Challenge 1: Das Alphabet"
summary: >-
  Wie viele Farben unterscheidet eure Strecke in 50 Versuchen ohne einen Fehler? Die Antwort ist euer Alphabet für alles Weitere.
objectives:
  intro: "Mit dieser Challenge findest du mit deinem Team das Alphabet eurer Strecke und kannst danach:"
  goals:
    - "Sender und Empfänger vor jedem Durchgang kalibrieren"
    - "mit einer Kontrollmessung zeigen, ob ein Aufbau etwas bringt"
    - "aus der Zahl der Farben und Stellen die Zahl der Codewörter berechnen"
    - "Verwechslungen im Protokoll auf ihre Ursache zurückführen"
level: 1
topics: [transferring-information, representing-information]
modules: [dup]
project: lifi
status: published
updated: 2026-11-02
---

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
Kontrollmessung Pflicht. Was ihr bauen dürft, steht unter [[lifi-device]].

**Die drei Ergebnisse dieser Challenge** (siehe [[lifi-challenges]]) sind damit die Messprotokolle ohne und mit Hilfsmitteln, als
Beschreibung eurer Lösung ein Foto des Aufbaus mit einem Satz, warum ihr ihn so
gebaut habt, und euer Irrtumsprotokoll. Für das letzte ist diese Challenge die
ergiebigste Quelle: Fragt ihr den Assistenten, warum die Röhre nicht hilft,
schlägt er mattschwarze Innenwände, Blenden und engere Öffnungen vor, alles
plausibel und nichts davon geprüft, bis ihr es gemessen habt.

**Was ihr in der Vorlage ausfüllt:** In dieser Challenge sendet ein Gerät nur
und das andere empfängt nur, deshalb hat jede Seite ihre eigene Datei, und eine
dritte hält fest, worauf sich beide einigen müssen. Das Testskript ruft genau
vier Funktionen auf, nicht mehr. Wie ihr sie innen baut, ist eure Sache, und
eigene Funktionen dürft ihr beliebig ergänzen.

| Datei | Was hineinkommt |
|---|---|
| `agreement.py` | `SYMBOL_COLORS`, euer Alphabet, eine Farbe je Zeile; die erste Zeile ist Symbol 0. `ALPHABET_SIZE` zählt die Zeilen selbst und wird nie von Hand geändert |
| `sender.py` | `calibrate()` spielt euer Alphabet einmal durch, `send_symbol(index)` zeigt ein Symbol und kehrt erst zurück, wenn der Empfänger genug Zeit zum Messen hatte |
| `receiver.py` | `calibrate()` misst dabei mit und legt für jedes Symbol einen Referenzwert in `REFERENCES` ab, `receive_symbol()` misst und gibt zurück, welches Symbol es war |

Was auf beiden Seiten gleich sein muss, gehört in `agreement.py` und nicht
doppelt in die beiden anderen Dateien, denn so können sich Sender und Empfänger
darin nie widersprechen. LED und Sensor kommen in dieser Datei nicht vor, sie
hält nur Vereinbarungen fest.

Der Empfänger kann nicht ausrechnen, welches Symbol angekommen ist, er muss
vorher lernen, wie eure Symbole in diesem Aufbau aussehen, und vergleicht dann
jeden neuen Messwert mit den Referenzen. Daraus folgt zweierlei: Beim
Kalibrieren müssen beide Seiten im selben Takt laufen, sonst ordnet der
Empfänger seine Messwerte den falschen Symbolen zu, und kalibriert wird vor
jedem Durchgang neu, auch am Testtisch.

**Selbsttest und Abnahme sind dasselbe Skript.** Ihr startet es zweimal, jedes
in seiner Rolle, mit `python run_test.py sender` und
`python run_test.py receiver`; es lädt dabei nur die Datei seiner Rolle. Beide Seiten schreiben ein Protokoll
(`sent.txt` und `received.txt`); legt beide in einen Ordner und vergleicht sie
mit `python compare.py`. Für schnelle Versuche zwischendurch genügen weniger
Durchgänge (`--runs 10`). Weil bei der Abnahme genau dieses Skript läuft, könnt
ihr den Wertungslauf vorher so oft proben, wie ihr wollt, und am Testtisch
passiert nichts Neues. Bewährt hat sich, mit den beiden Farben anzufangen, die
schon in `SYMBOL_COLORS` stehen, also aus und weiß, und nach 50 fehlerfreien
Durchgängen auf 4 zu gehen, indem ihr das `#` vor den nächsten beiden Farben
entfernt, und dann auf 8; die letzte Größe ohne Fehler ist euer Ergebnis. Verwechselt `compare.py`
jedes Mal dieselben zwei Symbole, liegen sie zu dicht beieinander, sieht es
zufällig aus, sind eher Timing oder Kalibrierung schuld.

**Beide Geräte an einem Laptop:** Ihr könnt auch beide Geräte eures Teams an
denselben Laptop anschließen und Sender und Empfänger in zwei Terminals
nebeneinander starten; dann landen beide Protokolle im selben Ordner, und
`compare.py` läuft sofort. Dafür muss das Modul wissen, welches Gerät welches
ist: Oben in `sender.py` und `receiver.py` steht die Zeile
`# use_device("put the UID here")`. Entfernt in beiden Dateien das `#` und
tragt die UID des Master Bricks des jeweiligen Geräts ein, die des sendenden in
`sender.py` und die des empfangenden in `receiver.py`. Kennt ihr die UIDs
nicht, startet zuerst ohne; die Fehlermeldung nennt beide, und der Brick Viewer
zeigt, welche zu welcher Box gehört. Mit nur einem angeschlossenen Gerät bleibt
die Zeile, wie sie ist. Eines wird dabei schwieriger: Die Eingabetaste lässt
sich nicht in beiden Terminals im selben Moment drücken, zwischen dem ersten
und dem zweiten Druck liegt leicht eine Sekunde, und eure Kalibrierung muss das
aushalten.

**Bei der Abnahme** baut ihr am Testtisch euren Aufbau auf, kalibriert, und es
werden 20 zufällige Symbole übertragen. Ein einziger Fehler gilt für diese
Alphabetgröße als nicht bestanden; acht sicher erkannte Zustände sind also mehr
wert als sechzehn mit gelegentlicher Verwechslung. Als Live-Änderung erweitert
ihr euer Alphabet, etwa auf bis zu zwölf Symbole, mit weiteren Farben in
`SYMBOL_COLORS`, und lasst den Test erneut laufen; dafür müsst ihr die Stellen
in eurem Code finden, die von der Größe des Alphabets abhängen.

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
