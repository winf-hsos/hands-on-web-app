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
updated: 2026-11-02
---

Im Finale geht es nicht mehr um Text, sondern um Bytes: eine Datei, die ihr
vorher nicht kennt, soll unverändert ankommen. Der gemeinsame Rahmen aus der
Normungssitzung legt fest, wie ein Paket aussieht, alles andere entscheidet ihr
selbst.

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
