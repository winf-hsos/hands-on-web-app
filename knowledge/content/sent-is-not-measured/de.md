---
type: experiment
code: 5151
title: Gesendet ist nicht gemessen
summary: >-
  Die LED auf reines Rot setzen und ablesen, was der Sensor daraus macht,
  dann Licht, Hand und Abstand ändern und am Ende vor der Frage stehen, wie
  man aus vier Zahlen auf die gesendete Farbe zurückrechnen soll.
objectives:
  intro: "In diesem Experiment vergleichst du die Farbe, die du an die LED sendest, mit dem, was der Sensor daraus misst, und kannst danach:"
  goals:
    - "vor einer Messung eine Erwartung schriftlich festhalten und sie hinterher mit den Messwerten vergleichen"
    - "erklären, warum der Sensor bei reinem Rot `(255, 0, 0)` auch in `g`, `b` und `c` Werte meldet"
    - "eine Messreihe durchführen, in der du jeweils genau eine Bedingung änderst und jede Bedingung fünfmal abliest"
    - "beschreiben, wie Deckenlicht, eine Hand im Strahl und der Abstand die vier Werte verändern und wie stark sie schon ohne jede Änderung schwanken"
    - "begründen, warum man aus den Messwerten nicht einfach auf die gesendete Farbe zurückrechnen kann"
level: 1
duration: 20
topics: [transferring-information]
modules: [dup]
relations:
  see_also: [measurement-and-experiments]
status: published
updated: 2026-11-01
---

Ihr gebt der LED eine Farbe, deren Zahlen ihr genau kennt, und lest ab, was
der Sensor daraus macht. Heraus kommt etwas anderes, als ihr hineingesteckt
habt, und daraus entsteht die Frage, mit der dieses Experiment endet.

## Was ihr braucht

- zwei Geräte mit RGB-LED und Farbsensor, oder ein Gerät und ein weißes Blatt
  Papier
- ein Programm, das die LED auf eine Farbe setzt und die vier Messwerte des
  Sensors ausgibt; das Messprogramm aus Challenge 0 des LiFi-Projekts genügt
- ein Lineal, Papier und Stift

## Aufbau

Stellt die beiden Geräte etwa 8 Zentimeter auseinander, sodass die beiden Stege sich berühren und die LED des einen in den Sensor des anderen leuchtet. Mit nur einem Gerät haltet ihr das weiße Blatt etwa fünf Zentimeter vor das Gerät, damit das Licht der LED in den eigenen Sensor zurückfällt. Notiert den Abstand und ob das Deckenlicht an ist.

## Vorher: eure Erwartung

Die LED bekommt reines Rot, also `(255, 0, 0)`. Schreibt auf, **bevor** ihr
messt, welche vier Zahlen der Sensor eurer Meinung nach meldet: `r`, `g`, `b`
und `c`, den Kanal ohne Farbfilter.

## Runde 1: reines Rot

Setzt die LED auf `(255, 0, 0)` und lest die vier Werte fünfmal hintereinander
ab, ohne etwas zu verändern. Tragt alle fünf Ablesungen in die Messtabelle
ein, nicht nur die schönste.

## Runde 2: eine Änderung nach der anderen

Ändert jeweils genau eine Bedingung, lest wieder fünfmal ab und stellt danach
alles zurück, bevor die nächste Änderung kommt:

1. Deckenlicht aus.
2. Eine Hand halb zwischen LED und Sensor.
3. Den Abstand verdoppeln, auf etwa zehn Zentimeter.

> [!TIP]
> Notiert vor jeder Änderung, welcher der vier Werte sich eurer Meinung nach am
> stärksten ändern wird. So seht ihr hinterher, ob ihr den Sensor schon
> versteht oder nur beobachtet.

## Messtabelle

In jede Zelle kommen die fünf Ablesungen, durch Kommas getrennt.

| Bedingung | r | g | b | c |
|---|---|---|---|---|
| Erwartung | | | | |
| Rot, Ausgangslage | | | | |
| Deckenlicht aus | | | | |
| Hand dazwischen | | | | |
| doppelter Abstand | | | | |

## Auswerten

- Wie weit lagen Erwartung und Messung auseinander? Warum zeigen Grün und Blau
  überhaupt Werte, obwohl die LED nur rot leuchtet?
- Welcher der vier Werte hat am stärksten auf das Deckenlicht reagiert, und
  welcher auf den Abstand?
- Wie stark schwanken die fünf Ablesungen einer Bedingung, obwohl ihr dabei
  nichts verändert habt?
- Und die Frage, die stehen bleibt: Wie wollt ihr aus vier solchen Zahlen
  zurückrechnen, welche Farbe gesendet wurde, wenn dieselbe Farbe bei jedem
  Licht und jedem Abstand andere Zahlen liefert?

Wie man mit solchen Zahlen trotzdem sicher entscheidet und warum dafür eine
einzelne Ablesung nie genügt, zeigt die Lektion
[[measurement-and-experiments]].
