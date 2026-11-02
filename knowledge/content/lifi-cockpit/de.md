---
type: info
code: 5033
title: "Das Team-Cockpit"
summary: >-
  Das Cockpit zeigt eure Lichtstrecke live im Browser, oben was eure LED sendet und darunter was euer Sensor misst, und es ist euer wichtigstes Werkzeug, um Fehler zu finden.
objectives:
  intro: "Hier lernst du das Team-Cockpit kennen und kannst danach:"
  goals:
    - "das Cockpit für dein Team öffnen und sagen, woher seine Daten kommen"
    - "Statuszeile, Senderband und Sensorkurven lesen"
    - "dich in der Zeitleiste bewegen, vom Signal weniger Sekunden bis zur Übersicht über Tage"
    - "Abstürze deines Programms gezielt anspringen und sehen, was kurz davor gesendet und gemessen wurde"
    - "der Reihe nach prüfen, warum keine Daten ankommen"
level: 1
duration: 8
topics: [working-with-the-computer, transferring-information]
modules: [dup]
project: lifi
status: draft
updated: 2026-11-02
---

Das Team-Cockpit zeigt eure Lichtstrecke live im Browser: oben, was eure LED
sendet, darunter, was euer Sensor misst, beides auf derselben Zeitachse. Es ist
euer wichtigstes Werkzeug für die Fehlersuche, weil sich die meisten Probleme
hier auf einen Blick zeigen. Wechselt das Senderband richtig, aber die Kurven
bewegen sich nicht, stimmen Ausrichtung oder Abstand nicht. Springen die Kurven
im Takt der Farben, aber euer Programm erkennt trotzdem nichts, liegt der
Fehler in euren Schwellen oder eurem Timing.

## Öffnen

Das Cockpit liegt unter
[lifi.hsos.uber.space/cockpit](https://lifi.hsos.uber.space/cockpit).

Beim ersten Öffnen fragt es nach eurem Teamnamen. Danach steht der Name in der
Adresse (etwa `.../cockpit?team=team-07`), sodass ihr die Seite als Lesezeichen
speichern oder den Link im Team teilen könnt. Mit „switch team“ oben rechts
wechselt ihr das Team.

Die Daten kommen von selbst: Sobald euer Programm das Kursmodul
[[lifi-hardware]] benutzt, schickt es sein Messprotokoll an den Kursserver, und
das Cockpit zeigt es an. Einstellen müsst ihr nichts. Was dabei hochgeladen
wird und wie ihr das abschaltet, steht ebenfalls dort.

## Die Statuszeile

Oben stehen sechs Werte, die sich laufend aktualisieren:

- ob gerade Daten ankommen („live“) oder wann zuletzt,
- die aktuelle Farbe der LED mit einem Farbfeld,
- die letzte Messung mit ihren vier Kanälen r, g, b und c,
- die Messungen je Sekunde,
- die eingestellte Verstärkung und Integrationszeit,
- der letzte Fehler, falls euer Programm abgestürzt ist.

## Die Zeitleiste lesen

Die große Fläche ist eine Zeitleiste, die von Sekunden bis zur ganzen
Projektzeit reicht. Was sie zeigt, hängt davon ab, wie weit ihr hineinzoomt.

**Nah herangezoomt**, bis zu einem Fenster von etwa 15 Minuten, seht ihr das
rohe Signal: oben das Senderband, in dem jeder Block genau die Farbe hat, die
die LED in diesem Moment zeigte, und darunter die vier Kanäle des Sensors als
Kurven. Der Kanal c, die helle Linie, misst das gesamte Licht und ist am
empfindlichsten. Gestrichelte senkrechte Marken zeigen, wo eine Sitzung begann
oder endete und wo Einstellungen geändert wurden; rote Marken sind Abstürze
eures Programms.

**Weit herausgezoomt** wird dieselbe Fläche zur Aktivitätsübersicht: Blaue
Balken zeigen, wann und wie viel ihr gearbeitet habt (je höher und heller,
desto mehr Messungen), und rote Striche darüber markieren Zeiten mit Fehlern.
So findet ihr die Stelle, an der etwas Interessantes passiert ist, auch Tage
später wieder.

Unter der Fläche steht immer eine Achse mit Uhrzeit und Datum, darüber der
sichtbare Zeitraum und seine Länge, sodass ihr nie raten müsst, wo ihr gerade
seid.

## Verschieben und zoomen

Die Bedienung funktioniert so, wie ihr sie aus Videoschnitt oder Karten-Apps
kennt:

- **Mausrad** zoomt hinein und heraus, um den Punkt, auf dem die Maus steht.
- **Doppelklick** auf einen blauen Aktivitätsbalken springt direkt in dessen
  Zeitraum, an jeder anderen Stelle zoomt er stark um den geklickten Punkt.
- **Ziehen** mit gedrückter Maustaste verschiebt das Fenster in der Zeit.
- **Darüberfahren** zeigt Einzelheiten: über dem Senderband die genauen
  RGB-Werte und seit wann die Farbe an ist, über den Kurven die nächste Messung
  mit allen vier Werten und ihrem Zeitstempel, über Marken, was sie bedeuten.
- Die Knöpfe **30 s / 5 min / 1 h / 24 h / all** springen zu festen Fenstern,
  **+ / −** zoomen schrittweise.

Sobald ihr in die Vergangenheit zoomt oder zieht, folgt die Ansicht nicht mehr
der Zeit. Der grüne Knopf **„● live“** bringt euch zurück in die Gegenwart, wo
der rechte Rand wieder mit der Uhr mitläuft.

## Fehler schnell finden

Neben den Zoomknöpfen steht **errors: show · hide · only**.

- **show** ist die normale Ansicht: Fehler erscheinen als rote Marken zwischen
  allem anderen.
- **hide** blendet die Fehlermarken aus, wenn ihr nur das Signal ansehen wollt.
- **only** dimmt alles andere ab. Herausgezoomt wird jeder Zeitraum mit einem
  Fehler zu einem hohen roten Balken, sodass selbst ein einzelner Absturz an
  einem ganzen Nachmittag sofort auffällt.

Die beiden Pfeilknöpfe **‹** und **›** springen zum vorigen und zum nächsten
Fehler, über eure ganze Zeitleiste hinweg. Der Fehler landet in der Mitte eines
Fensters von 40 Sekunden, sodass ihr seht, was eure LED gesendet und euer
Sensor gemessen hat, kurz bevor euer Programm ausstieg. Fahrt ihr über einen
Pfeil, seht ihr, welcher Fehler als Nächstes kommt. Eure Wahl zwischen show,
hide und only merkt sich euer Browser.

## Wenn nichts ankommt

Steht im Status dauerhaft „no data yet“, prüft der Reihe nach:

1. Läuft euer Programm gerade, und benutzt es `lifi_hardware`?
2. Stimmt der Teamname in der Adresse?
3. Hat euer Laptop Internet?

Ohne Netz läuft euer Programm übrigens ganz normal weiter; nur das Cockpit
bleibt leer, und alles Wichtige steht trotzdem in eurer lokalen Protokolldatei
`lifi_log.jsonl`. Ist euer Gerät noch keinem Team zugeordnet, sagt in eurem
Kurs Bescheid; das dauert eine Minute.
