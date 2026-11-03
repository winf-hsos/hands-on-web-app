---
type: info
code: 1473
title: "Challenges im LiFi-Projekt"
summary: >-
  Welchen Vertrag jede Challenge festlegt, wie sie am Testtisch abgenommen wird und welche drei Ergebnisse ihr aus jeder Challenge mitnehmt.
objectives:
  intro: "Hier erfährst du, woran eine Challenge gemessen wird, und kannst danach:"
  goals:
    - "erklären, was der Vertrag einer Challenge festlegt und was er dir freilässt"
    - "beschreiben, wie eine Abnahme am Testtisch abläuft"
    - "erklären, wozu die Live-Änderung bei jeder Abnahme dient"
    - "Messprotokoll, Lösungsbeschreibung und Irrtumsprotokoll führen"
level: 1
duration: 9
topics: [solving-problems]
modules: [dup]
project: lifi
status: published
updated: 2026-11-04
---

## Vorlagen und Verträge

Für jede Challenge gibt es eine Vorlage mit einem **Vertrag**: eine Handvoll
Funktionen mit festem Namen, festen Argumenten und festem Rückgabewert. Was ihr
innerhalb dieser Funktionen schreibt, ist eure Sache, und eigene Funktionen
dürft ihr beliebig ergänzen. Das Testskript ruft ausschließlich die
Vertragsfunktionen auf, deshalb läuft bei jedem Team derselbe Test, und die
Ergebnisse sind vergleichbar.

| Challenge | Was ihr umsetzt |
|---|---|
| 0 | sechs kleine Aufgaben, je ein Skript, von `task_1_light_on.py` bis `task_6_human_receiver.py` |
| 1 | `COLORS`, `calibrate(readings)`, `send_symbol(name)` und `receive_symbol()` in einer Datei, `alphabet.py` |
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
