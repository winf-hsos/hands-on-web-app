---
title: "Quiz: Algorithmen und Programme"
summary: >-
  Vierzehn Fragen dazu, was einen Algorithmus ausmacht, was ein Programm
  hinzufügt, zur Reihenfolge von Anweisungen, zu Schleifen, die enden oder
  nicht, und zum Aufwand eines Verfahrens. Jede Antwort kommt mit ihrer
  Begründung.
translation_of: en
based_on: 2026-11-04
---

Mehrere Fragen zeigen kurze Programme, die eine farbige Lampe schalten:
`lamp.set_color(r, g, b)` gibt der Lampe eine Farbe, gemischt aus Rot, Grün
und Blau mit Anteilen zwischen 0 und 255, und `time.sleep(1)` wartet eine
Sekunde, bevor die nächste Zeile läuft.

## Jemand hält farbige Karten hoch, und du befolgst vier Schritte: auf die Karte schauen, entscheiden, welche Farbe sie hat, ihr Zeichen notieren, auf die nächste Karte warten. Was macht diese Anleitung zu einem Algorithmus? {#aa-001}

- [ ] Dass sie sich auf einen Computer übertragen ließe, denn nur was ein Rechner ausführen könnte, zählt als Algorithmus.
  > Ein Algorithmus braucht keinen Computer, nicht einmal in Gedanken. Du kannst diese Schritte von Hand ausführen, und sie sind trotzdem ein Algorithmus; was sie dazu macht, ist die Eindeutigkeit jedes Schritts, nicht, wer ihn ausführt.
- [x] Dass die Schritte so genau beschrieben sind, dass man sie ausführen kann, ohne zu verstehen, wozu sie dienen.
  > Genau die Definition: eine eindeutige Schrittfolge, bei der keine Frage offen bleibt. Wer ihr folgt, ist die Maschine.
- [ ] Dass sie aus wenigen, überschaubaren Schritten besteht, die man sich ohne Aufschreiben merken kann.
  > Länge und Merkbarkeit sind egal. Auch tausend Schritte sind ein Algorithmus, solange jeder eindeutig ist, und vier Schritte sind keiner, wenn einer davon ein Urteil verlangt.
- [ ] Dass sie in einer Programmiersprache aufgeschrieben ist, denn erst eine feste Syntax macht aus einer Anleitung einen Algorithmus.
  > Das wäre erst das Programm. Der Algorithmus kann in Alltagssprache auf einem Zettel stehen; entscheidend ist, dass jeder Schritt eindeutig ist, nicht, in welcher Sprache er steht.

> Was einen Algorithmus ausmacht, ist die Genauigkeit seiner Schritte, nicht die Maschine und nicht die Sprache.

## Worin liegt der Unterschied zwischen einem Algorithmus und einem Programm? {#aa-002}

- [ ] Ein Programm ist die fortgeschrittene Stufe eines Algorithmus, die erst nötig wird, wenn ein Problem für die Bearbeitung von Hand zu groß ist.
  > Es geht nicht um Größe oder Schwierigkeit, sondern um den Leser, Mensch oder Maschine. Auch ein winziger Ablauf wird zum Programm, sobald er vollständig genug für eine Maschine aufgeschrieben ist.
- [ ] Ein Algorithmus beschreibt, wie gerechnet wird; ein Programm legt fest, wie die Daten dafür gespeichert und verwaltet werden.
  > Beide beschreiben denselben Ablauf, nur für verschiedene Leser. Rechnen gegen Speichern ist eine andere Grenze, die zwischen Verarbeitung und Daten, nicht die zwischen Algorithmus und Programm.
- [x] Ein Programm ist derselbe Ablauf, aber so vollständig aufgeschrieben, dass eine Maschine ihn ausführen kann.
  > Genau: Ein Mensch ergänzt beim Lesen, was offensichtlich gemeint war, eine Maschine nicht, und deshalb muss ein Programm vollständig sein.
- [ ] Es gibt keinen wesentlichen: Beide sind eindeutige Schrittfolgen, und welches Wort man benutzt, hängt vom Fachgebiet ab.
  > Die Nähe ist echt, der Unterschied auch: Der Ablauf mit den Karten ist ein Algorithmus, aber noch kein Programm, weil ein Mensch beim Ausführen Lücken ergänzt, die eine Maschine nicht ergänzen würde.

> Ein Programm ist eine Liste von Anweisungen, die ein Computer genau und der Reihe nach befolgt; es darf sich also nicht darauf verlassen, dass jemand Gemeintes ergänzt.

## Was siehst du an der Lampe, wenn dieses Programm läuft? {#aa-003}

```python static
lamp.set_color(255, 0, 0)
time.sleep(1)
lamp.set_color(0, 0, 255)
```

- [x] Eine Sekunde Rot, danach Blau.
  > Richtig: Zeile für Zeile, von oben nach unten. Rot, eine Sekunde warten, Blau.
- [ ] Rot und Blau gleichzeitig, also Violett.
  > Ein Programm läuft Zeile für Zeile, nicht alles auf einmal, und die zweite Farbe ersetzt die erste.
- [ ] Nur Blau, weil die erste Zeile übersprungen wird.
  > Übersprungen wird nichts: Rot leuchtet wirklich, und dank `time.sleep(1)` lange genug, um es zu sehen.
- [ ] Nur Rot: Die Lampe behält die erste Farbe, die sie bekommt, bis das Programm endet.
  > Eine Farbe ist kein Zustand für immer. Jede Zeile setzt die Farbe neu, also ersetzt die dritte Zeile das Rot nach der Sekunde durch Blau.

> Der Computer führt die Zeilen in der Reihenfolge aus, in der sie stehen, und jede ändert den Zustand, den die nächste vorfindet.

## Jemand wundert sich: „Die Lampe wird nie rot, dabei steht es doch da!“ Was ist los? {#aa-004}

```python static
lamp.set_color(255, 0, 0)
lamp.set_color(0, 0, 255)
```

- [ ] Die erste Zeile enthält einen Fehler, den die Maschine stillschweigend überspringt; sonst müsste Rot zu sehen sein.
  > Die Zeile ist korrekt und läuft, und eine Maschine überspringt auch nichts stillschweigend: Ist etwas falsch, bricht sie mit einer Meldung ab. Das Problem liegt nicht im Code, sondern im Zeitmaßstab.
- [ ] Die zweite Zeile ersetzt die erste, bevor diese läuft: Bei zwei gleichartigen Befehlen gilt nur der letzte.
  > Die Maschine fasst nichts zusammen und lässt nichts aus. Beide Zeilen laufen, in dieser Reihenfolge; Rot war da, nur eben extrem kurz.
- [x] Rot leuchtet, aber nur für einen winzigen Bruchteil einer Sekunde; ohne Pause ist das für das Auge unsichtbar.
  > Genau: Das Programm ist richtig und nur zu schnell. Deine Augen sind langsam, die Maschine ist es nicht, und Anweisungen kosten nur dort sichtbare Zeit, wo eine Pause es sagt.
- [ ] Die Lampe reagiert träge: Bei zwei so schnell folgenden Befehlen kommt nur der letzte an, der erste geht in der Hardware verloren.
  > Eine Lampe schaltet weit schneller, als ein Auge folgen kann, und verloren geht nichts: Sie war rot, dann blau. Der Engpass ist die Wahrnehmung, nicht die Hardware.

> Ein Computer wartet nur dort, wo das Programm es ihm sagt.

## Welche Rolle spielt der Teil `(255, 0, 0)` in dieser Zeile? {#aa-005}

```python static
lamp.set_color(255, 0, 0)
```

- [ ] Er sagt, welche Lampe angesprochen wird: Die drei Zahlen kennzeichnen, welche von mehreren Lampen gemeint ist.
  > Welches Ding gemeint ist, sagt `lamp` vor dem Punkt. Die Zahlen in der Klammer beschreiben nicht die Lampe, sondern die Farbe, die sie zeigen soll.
- [x] Er sagt, mit welchen Werten die Anweisung ausgeführt wird: voller Rotanteil, kein Grün, kein Blau.
  > Richtig: `lamp` sagt, welches Ding, `set_color` sagt, was damit geschehen soll, und die Klammer sagt, mit welchen Werten. Andere Werte ergeben ein anderes Ergebnis.
- [ ] Er ist eine Notiz für Lesende, die den gewünschten Rotanteil erklärt; ausgeführt wird nur der Teil vor der Klammer.
  > Notizen für Menschen sehen anders aus, als Kommentare mit `#`. Diese Werte werden ausgeführt und bestimmen unmittelbar, was die Lampe zeigt; ohne sie wüsste `set_color` nicht, welche Farbe gemeint ist.
- [ ] Er sagt, wie lange die Anweisung läuft: 255 Millisekunden lang, danach ist die Lampe wieder aus.
  > Eine Dauer steht in dieser Zeile nirgends; dafür gibt es eine eigene Anweisung wie `time.sleep(1)`. Die drei Zahlen sind die Anteile von Rot, Grün und Blau, und die Farbe bleibt, bis eine andere Zeile sie ändert.

> Eine Anweisung nennt ein Ding, was damit geschehen soll und mit welchen Werten; andere Werte ändern das Ergebnis, während die Anweisung dieselbe bleibt.

## Welchen Vorteil bringt die erste Zeile, `bright = 255`? {#aa-006}

```python static
bright = 255
lamp.set_color(bright, 0, 0)
time.sleep(1)
lamp.set_color(bright, bright, 0)
```

- [ ] Das Programm läuft schneller, weil die Maschine den Wert nur einmal lesen muss statt bei jedem Aufruf neu.
  > Auf das Tempo hat ein benannter Wert keinen messbaren Einfluss, denn eine Zahl zu lesen kostet die Maschine nichts. Der Gewinn liegt bei dem Menschen, der das Programm ändert.
- [ ] Ohne sie bliebe die Lampe dunkel, denn erst diese Zeile schaltet die Helligkeit auf den Höchstwert.
  > Die Zeile schaltet nichts, sie gibt nur einer Zahl einen Namen. Du könntest in beiden Aufrufen direkt 255 schreiben, und die Lampe leuchtete genauso. Der Name ist eine Entscheidung, keine Notwendigkeit.
- [x] Die Helligkeit lässt sich an genau einer Stelle ändern statt an jeder Verwendung.
  > Genau: ein Wert mit einem Namen. Willst du die Lampe dimmen, änderst du eine Zeile, und beide Aufrufe von `set_color` ziehen mit.
- [ ] Namen sind Pflicht: Eine Anweisung wie `set_color` nimmt nur benannte Werte an, keine nackten Zahlen in der Klammer.
  > Zahlen direkt hinzuschreiben ist erlaubt und oft in Ordnung. Ein Name lohnt sich dort, wo derselbe Wert mehrfach vorkommt oder sich ändern soll.

> Ein Wert mit einem Namen gibt dir eine Stelle zum Ändern statt vieler.

## Wie lange läuft dieses Programm ungefähr, und was zeigt die Lampe? {#aa-007}

```python static
colors = [(255, 0, 0), (0, 255, 0),
          (0, 0, 255), (255, 255, 0)]
for r, g, b in colors:
    lamp.set_color(r, g, b)
    time.sleep(1)
```

- [ ] Eine Sekunde: Die Schleife zeigt alle vier Farben gleichzeitig.
  > Eine Schleife läuft einen Durchlauf nach dem anderen, nicht gleichzeitig: einen je Wert.
- [x] Etwa vier Sekunden: vier Durchläufe, in denen je eine Farbe eine Sekunde lang leuchtet.
  > Genau: Dieselben zwei Zeilen laufen viermal, jedes Mal mit dem nächsten Wert aus der Liste, und auch Wiederholung kostet Zeit.
- [ ] Unendlich: Eine `for`-Schleife läuft, bis man sie abbricht.
  > Diese Schleife hat ein eingebautes Ende: Sie läuft genau einmal je Eintrag der Liste, dann ist Schluss.
- [ ] Vier Sekunden, aber nur die letzte Farbe, Gelb, ist je zu sehen.
  > Dank `time.sleep(1)` im Körper der Schleife bleibt jede Farbe eine volle Sekunde sichtbar, nicht nur die letzte.

> Eine Schleife ist eine Schreibweise: Dieselben Zeilen laufen einmal je Wert, ein Durchlauf nach dem anderen.

## Wie lange läuft dieses Programm insgesamt, ungefähr? {#aa-008}

```python static
colors = [(255, 0, 0), (255, 255, 0), (0, 0, 255)]
for r, g, b in colors:
    lamp.set_color(r, g, b)
    if (r, g, b) == (255, 255, 0):
        time.sleep(3)
    else:
        time.sleep(1)
```

- [ ] 3 Sekunden
  > Das wäre eine Sekunde je Durchlauf, aber der gelbe Durchlauf wartet drei.
- [ ] 9 Sekunden
  > Das wären drei Sekunden je Durchlauf, aber nur Gelb wartet drei, die anderen eine.
- [x] 5 Sekunden
  > Genau: Rot 1, Gelb 3, Blau 1. Die Bedingung entscheidet in jedem Durchlauf, welcher Zweig mit `time.sleep` läuft.
- [ ] 4 Sekunden
  > Fast: Wer `if` und `else` je einmal zählt, kommt auf 3 plus 1. Aber jeder der drei Durchläufe wartet, also 1 plus 3 plus 1.

> Eine Bedingung wird in jedem Durchlauf neu geprüft, deshalb hängt der Ablauf vom jeweiligen Wert ab.

## Aus welchen Bausteinen ist jedes Programm gebaut? Kreuz alle an, die dazugehören. (Mehrere richtige Antworten möglich.) {#aa-009}

- [x] Anweisungen, die nacheinander laufen.
  > Richtig: die Grundlage, Zeile für Zeile von oben nach unten.
- [x] Werte, die einen Namen bekommen.
  > Richtig: eine Stelle zum Ändern statt vieler.
- [x] Wiederholung.
  > Richtig: Dieselben Zeilen laufen mehrmals, jedes Mal mit dem nächsten Wert.
- [x] Bedingungen: Etwas geschieht nur, wenn etwas zutrifft.
  > Richtig: Damit reagiert ein Programm, statt immer dieselben Schritte abzuspulen.

> Alle vier zusammen sind das ganze Baumaterial: Abfolge, benannte Werte, Wiederholung und Bedingung.

## Dein Programm bricht mit dieser Meldung ab. Was fängst du damit an? {#aa-010}

```text
Traceback (most recent call last):
  File "blink.py", line 7, in <module>
    lamp.set_colour(255, 0, 0)
AttributeError: 'Lamp' object has no attribute 'set_colour'. Did you mean: 'set_color'?
```

- [ ] Der Rechner ist abgestürzt; nach einem Neustart läuft das Programm meist wieder, denn solche Meldungen kommen und gehen.
  > Nichts ist abgestürzt, und nach dem Neustart käme dieselbe Meldung wieder, weil der falsche Name weiter in Zeile 7 steht. Die Maschine hat geordnet angehalten und genau gemeldet, woran es lag.
- [x] Die Meldung nennt Datei, Zeile und Ursache: In Zeile 7 steht `set_colour`, das es nicht gibt; gemeint war `set_color`.
  > Genau: Eine Fehlermeldung ist eine Auskunft, kein Urteil. Lies sie laut vor; meist sagt sie wörtlich, was falsch ist.
- [ ] Das Programm überfordert den Rechner; die Meldung zeigt, dass er beim Ausführen von Zeile 7 nicht mehr mitgekommen ist.
  > Mit Leistung hängt das nicht zusammen, denn ein paar Zeilen überfordern keinen Rechner. Im Code steht ein Name, den es nicht gibt, und genau das sagt die Meldung, nicht mehr.
- [ ] Die Meldung ist eine Warnung, die du überlesen kannst: Das Programm läuft nach Zeile 7 weiter, und die Lampe leuchtet trotzdem.
  > Es ist keine Warnung, sondern ein Abbruch: Das Programm endet in Zeile 7, und danach leuchtet nichts mehr. Die Meldung ist der schnellste Weg zur Lösung, kein Rauschen.

> Der Computer hat ausgeführt, was dastand, und meldet genau, wo er hängen geblieben ist; die letzte Zeile der Meldung nennt die Ursache.

## Wann endet dieses Programm? {#aa-011}

```python static
while True:
    lamp.set_color(255, 0, 0)
    time.sleep(1)
    lamp.set_color(0, 0, 255)
    time.sleep(1)
```

- [ ] Wenn beide Farben einmal gezeigt wurden, denn dann ist der Körper der Schleife vollständig abgearbeitet.
  > Nach Blau springt die Schleife wieder an ihren Anfang, und ein Durchlauf ist kein Ende.
- [ ] Nach einer Weile von selbst, wenn die Maschine merkt, dass nichts Neues passiert.
  > Die Maschine merkt nichts und beurteilt nichts. Sie führt aus, was dasteht, und da steht: für immer.
- [x] Nie: Die Bedingung ist immer wahr, und der Körper der Schleife hat keinen Ausweg.
  > Genau: Ein Ablauf endet nur, wenn sein Ende erreichbar ist. Diese Schleife blinkt, bis jemand von außen abbricht, was bei einer Lampe, die dauernd blinken soll, sogar gewollt ist; ein Programm, das fertig werden soll, braucht eine Abbruchbedingung.
- [ ] Nach einer festen Zahl von Wiederholungen, denn jede Schleife hat eine eingebaute Obergrenze, damit die Maschine nicht hängen bleibt.
  > Es gibt keine eingebaute Obergrenze, und die Maschine schützt sich auch nicht selbst vor dem Hängenbleiben. Was nicht dasteht, passiert nicht.

> Eine Schleife endet nur, wenn ihr Ende erreichbar ist; `while True` ohne Ausweg läuft für immer.

## Beim Zahlenraten zwischen 1 und 100 führen zwei Verfahren sicher zum Ziel: alle Zahlen einzeln abfragen (bis zu 99 Fragen) oder den Bereich halbieren (höchstens 7 Fragen). Was folgt daraus? {#aa-012}

- [ ] Nur das Halbieren verdient den Namen Algorithmus; das einzelne Abfragen ist bloßes Ausprobieren ohne Verfahren.
  > Beide sind korrekte Algorithmen, mit eindeutigen Schritten, sicherem Ende und richtigem Ergebnis. Sie unterscheiden sich in etwas anderem.
- [x] Eine Lösung kann richtig und trotzdem unbrauchbar sein; Verfahren vergleicht man nach ihrem Aufwand.
  > Genau: Richtig zu sein ist das Mindeste, danach zählt der Aufwand, hier die Zahl der Fragen.
- [ ] Bei modernen Computern spielt der Unterschied keine Rolle mehr, weil beide Verfahren ohnehin in Sekundenbruchteilen fertig sind.
  > Schnelle Rechner verschieben die Grenze, heben sie aber nicht auf: Aus 99 gegen 7 wird bei tausend Zahlen 999 gegen 10, der Abstand wächst also mit dem Problem.
- [ ] Das langsame Verfahren ist sicherer, weil es jede Zahl ausdrücklich prüft, und deshalb vorzuziehen.
  > Beide sind gleich sicher, denn beide enden garantiert mit der richtigen Zahl. Langsamkeit bringt hier keine Sicherheit, nur Aufwand.

> Entscheidend ist, wie der Aufwand mit der Größe des Problems wächst.

## Sechs Personen sortieren sich nach diesen Regeln der Größe nach: auf den rechten Nachbarn schauen, tauschen, wenn man größer ist, am Ende der Reihe wieder links anfangen. Woran erkennt dieser Ablauf, dass er fertig ist? {#aa-013}

- [ ] Nach genau einem Durchgang durch die Reihe, denn dann hat jede Person ihren Nachbarn einmal geprüft.
  > Ein Durchgang schiebt nur die größte Person ganz nach rechts; der Rest kann noch durcheinander stehen.
- [ ] Wenn die Personen sehen, dass die Reihe sortiert aussieht.
  > „Sieht sortiert aus“ ist ein Urteil, und die Regeln enthalten keines, denn wer sie befolgt, arbeitet als Maschine. Das Ende muss aus den Regeln selbst folgen.
- [x] An einem vollständigen Durchgang, in dem niemand mehr getauscht hat.
  > Genau: Das ist die eingebaute Abbruchbedingung. Keine Vertauschung im ganzen Durchgang heißt, dass nichts mehr zu sortieren ist, und ohne eine solche Bedingung liefe der Ablauf ewig weiter.
- [ ] Gar nicht von selbst: Wie bei jeder Wiederholung von vorn muss jemand von außen abbrechen, sobald die Reihe stimmt.
  > Das wäre eine Schleife ohne Ausweg. Diese hier hat einen, und genau das unterscheidet sie von `while True` ohne Abbruchbedingung.

> Bubblesort endet nach seiner eigenen Regel: einem Durchgang ohne Vertauschung.

## Was zeigt die Lampe, wenn dieses Programm läuft? {#aa-014}

```python static
lamp.set_color(255, 0, 0)
lamp.set_color(0, 0, 255)
time.sleep(1)
```

- [ ] Eine Sekunde Rot, dann Blau: Das `time.sleep(1)` gehört erkennbar zur roten Phase.
  > Die Maschine ordnet nichts zu und nichts um. Sie führt die Zeilen der Reihe nach aus, und die Pause steht nach beiden Farbwechseln.
- [ ] Eine Sekunde Blau, dann Rot: Die Pause hält die zuletzt gesetzte Farbe fest, und die erste Zeile wird danach nachgeholt.
  > Nachgeholt wird nichts: Die Maschine führt jede Zeile genau einmal aus, Rot vor Blau, und nach der letzten Zeile ist Schluss. Die Lampe bleibt blau.
- [x] Rot nur für einen Sekundenbruchteil, dann eine Sekunde Blau.
  > Genau: Blau ersetzt Rot sofort, und erst danach wartet die Maschine, mit blauer Lampe. Dieselben drei Zeilen mit der Pause in der Mitte wären ein anderes Programm, denn die Reihenfolge gehört zum Programm.
- [ ] Das Programm ist fehlerhaft und startet nicht, weil `time.sleep(1)` als letzte Zeile nicht erlaubt ist.
  > Jede dieser Zeilen ist für sich gültig, in jeder Reihenfolge. Das Programm läuft; es zeigt nur nicht, was vielleicht gemeint war.

> Es fehlt keine Zeile, und trotzdem macht die Reihenfolge ein anderes Programm daraus.
