---
type: lesson
code: 1889
title: Probleme zerlegen
summary: >-
  Wie man ein Problem, das zu groß zum Lösen ist, in Stücke schneidet, die
  sich einzeln lösen und prüfen lassen, und warum das auch die Arbeit mit
  einer KI bestimmt.
objectives:
  intro: "Hier lernst du, ein zu großes Problem in lösbare Stücke zu schneiden, und kannst danach:"
  goals:
    - "an einem Alltagsbeispiel wie der Planung einer Party erklären, was Zerlegen bedeutet"
    - "mit Teile und herrsche eine Zahl zwischen 1 und 100 in höchstens sieben Ja-Nein-Fragen finden und einen Fehler in einer Kette mit einem Test in der Mitte eingrenzen"
    - "ein Problem zuerst in einer kleineren Fassung lösen und es von dort aus Schritt für Schritt erweitern"
    - "ein Teilstück so formulieren, dass ein eingebauter Test mit Ja oder Nein sagt, ob es fertig ist"
    - "Zuständigkeiten mit klaren Grenzen aufteilen und einem KI-Assistenten kleine Aufträge geben, die ihren Test mitbringen"
level: 1
duration: 25
topics: [solving-problems]
modules: [dup]
status: published
updated: 2026-11-04
---

![Folien: Probleme zerlegen](item:problem-decomposition-slides)

„Bau eine Chat-App“ löst niemand in einem Stück. Das sagt nichts über dich
aus, es ist der Normalzustand jedes interessanten Problems: Große Probleme
löst man nicht auf einen Schlag, man schneidet sie, immer wieder, bis die
Stücke klein genug sind, um sie zu lösen und zu prüfen.

Das kannst du übrigens schon. Am Samstag hat jemand Geburtstag, dreißig Gäste
kommen, und niemand plant „die Party“ als ein Ding. Du schneidest sie sofort in
Getränke, Essen, Musik, Gäste und Aufräumen, und dann verteilst du die Stücke.
Neu ist hier nur, dass du es mit Absicht machst und weißt, was einen Schnitt
besser macht als einen anderen.

![Ein Baum: oben das Problem „Party, Samstag, 30 Gäste“, darunter fünf Kästen für Getränke, Essen, Musik, Gäste und Aufräumen.](media/party.de.svg "Niemand plant die Party als ein Ding. Sie zerfällt sofort in Stücke, die sich einzeln erledigen und abhaken lassen.")

## Drei Schnittmuster

Es gibt bewährte Arten zu schneiden, und drei davon brauchst du ständig.

### Halbieren, bis es leicht ist

Die Informatik nennt das Teile und herrsche, englisch divide and conquer.
Denk dir eine Zahl zwischen 1 und 100. Mit Ja-Nein-Fragen, die den Bereich
jedes Mal halbieren, findest du jede Zahl in höchstens sieben Fragen: hundert
Kandidaten, dann fünfzig, fünfundzwanzig, zwölf, sechs, drei, zwei, gefunden.
Die Strategie funktioniert überall, wo du nach jedem Schnitt eine Hälfte
ausschließen kannst.

![Acht Zeilen untereinander. Links steht, wie viele Zahlen noch übrig sind, von 100 bis 1, in der Mitte ein Balken für den verbleibenden Bereich, rechts die Frage mit ihrer Antwort. Eine rote Senkrechte markiert die gesuchte 73.](media/halving-search.de.svg "Der Bereich von 1 bis 100, mit jeder Frage halbiert. Die gesuchte 73 bleibt im Balken, bis genau eine Zahl übrig ist.")

Warum es gerade sieben Fragen sind, hat mit Information zu tun: Jede
Ja-Nein-Frage liefert ein Bit, und sieben Bit unterscheiden 128 Möglichkeiten,
mehr als die hundert, die es hier gibt.

### Derselbe Trick, wenn etwas kaputt ist

Auch das kennst du. Ist das WLAN tot, testest du ohne nachzudenken in der Mitte
der Kette: Geht der Hotspot des Handys, liegt es nicht am Laptop, und die Hälfte
der Verdächtigen ist weg. Jeder Test halbiert die Kette. Genauso gehst du vor,
wenn ein Programm eine falsche Summe ausgibt: Lass dir den Zwischenwert in der
Mitte ausgeben; stimmt er, liegt der Fehler dahinter, sonst davor. Wer gut
zerlegt hat, weiß nicht nur, **dass** etwas kaputt ist, sondern **wo**.

![Zwei Ketten aus je fünf Kästen. Oben Laptop, WLAN, Router, Anbieter und Internet, unten Datei lesen, zerlegen, addieren, runden und ausgeben. Ein roter Pfeil zeigt jeweils auf die Mitte, die beiden Kästen davor sind ausgegraut.](media/debug-chain.de.svg "Fehlersuche durch Halbieren: Ein Test in der Mitte schließt die halbe Kette aus. Oben der Fall aus dem Alltag, darunter derselbe Gedanke in einem Programm.")

### Erst eine kleinere Fassung lösen

Ist ein Problem zu groß, löst du zuerst eine kleinere Fassung, die du wirklich
kannst, und wächst von dort aus. Niemand baut einen Gruppenchat als Erstes. Man
gibt zuerst eine Nachricht auf dem eigenen Bildschirm aus, schickt sie dann an
sich selbst und danach an einen anderen Rechner, und erst am Ende chatten
mehrere Menschen miteinander. Jede Stufe ist eine etwas größere Fassung
desselben Problems, und auf jeder läuft schon etwas.

![Eine Treppe aus fünf Kästen, die nach rechts höher werden: Nachricht ausgeben, an dich selbst schicken, an einen anderen Rechner, zwei Menschen chatten, ein Gruppenchat. Der erste Kasten ist blau und trägt die Beschriftung „hier stehst du“.](media/smaller-first.de.svg "Die Treppe zur Chat-App: Jede Stufe ist eine etwas größere Fassung desselben Problems, und am Anfang stehst du auf der untersten.")

## Ein guter Schnitt ist prüfbar

Schneiden allein genügt nicht, denn nicht jeder Schnitt ist gleich gut.
Vergleiche zwei Sätze: „Ich muss Mathe lernen“ und „Ich löse eine alte Klausur
in 90 Minuten“. Beide klingen nach Klausurvorbereitung. Beim ersten weißt du
nie, ob du fertig bist; das zweite kannst du heute Abend ausprobieren und
bekommst ein Ja oder ein Nein. Ein gutes Stück ist eines, in das ein Test
eingebaut ist.

![Zwei Kästen nebeneinander. Links ausgegraut „Ich muss Mathe lernen.“, rechts hervorgehoben „Ich löse eine alte Klausur in 90 Minuten.“ mit einem Haken darunter.](media/testable-exam.de.svg "Zwei Sätze, die beide nach Vorbereitung klingen. Nur der rechte sagt dir, wann du fertig bist.")

In einem Programm ist es dasselbe. „Die App funktioniert“ ist ein Gefühl. „Ein
falsches Passwort zeigt zehnmal von zehn eine Fehlermeldung“ ist ein Test, der
mit Ja oder Nein antwortet.

![Zwei Kästen nebeneinander. Links ausgegraut „Die App funktioniert.“, rechts hervorgehoben „Ein falsches Passwort zeigt einen Fehler, zehnmal von zehn.“ mit einem Haken darunter.](media/testable-program.de.svg "Ein Gefühl und ein Test: Nur der rechte Satz lässt sich nachprüfen.")

Daraus folgt eine einfache Regel: **Fertig heißt, der Test läuft durch**, und
nicht „sieht gut aus“. Wer eine Aufgabe so schneidet, dass jedes Stück einen
eigenen Test hat, muss auf niemanden warten, um zu wissen, ob er fertig ist.

## Schnitte sind Absprachen

Wo du schneidest, entscheidet, wie viel ihr reden müsst. „Du machst die
Vorspeise, ich den Nachtisch“ funktioniert. „Wir machen beide irgendwie das
Essen“ wird Chaos, weil niemand weiß, wer das Brot kauft. Stücke funktionieren,
wenn die Grenze zwischen ihnen klar ist, und was über die Grenze geht, wird
aufgeschrieben.

![Links zwei Kästen mit gemeinsamer Kante, „du: Vorspeise“ und „ich: Nachtisch“, darunter ein Haken. Rechts zwei Kästen, die sich überlappen, beide „das Essen“, der Überschnitt rot mit einem Fragezeichen, darunter ein Kreuz.](media/clear-borders.de.svg "Eine klare Grenze gegen eine Überlappung: Links weiß jeder, was seins ist, rechts bleibt offen, wer das Brot kauft.")

Mit einem KI-Assistenten ist das Zerlegen die wichtigste Fähigkeit überhaupt.
„Bau mir eine Chat-App“ ist ein großer Wunsch: Der Assistent kann ihn nicht
gut erfüllen, und du könntest das Ergebnis nicht einmal prüfen, wenn er es
täte. Ein kleines Stück mit seinem Test ist etwas anderes. Es sagt genau, was
herauskommen soll, und nennt den Test gleich mit, sodass du die Antwort in
zehn Sekunden nachprüfen kannst, ohne dem Assistenten glauben zu müssen.

![Zwei Kästen nebeneinander. Links ausgegraut der große Wunsch „Bau mir eine Chat-App.“, rechts ein kleiner Auftrag in Codeschrift: eine Funktion, die der Nachricht die Uhrzeit voranstellt, mit dem Test, dass „hi“ um 9:05 „09:05 hi“ ergibt.](media/small-pieces.de.svg "Zwei Arten, einen Assistenten zu beauftragen. Den rechten Auftrag kannst du prüfen, den linken nicht.")

Du schneidest das Problem, der Assistent löst die Stücke, und du prüfst jedes
davon. Was ein geschnittenes Stück braucht, sobald ein Rechner es lösen soll,
zeigt [[input-processing-output]].

Wie das LiFi-Projekt in seine Challenges geschnitten ist und wie ihr im Team,
bei der Fehlersuche und mit dem Assistenten weiter zerlegt, zeigen die Folien
zum Projekt.

![Folien: Das LiFi-Projekt zerlegen](item:cutting-the-lifi-project)

## Zum Weiterlesen

George Pólya: *How to Solve It*. Princeton University Press, 1945. Der
Klassiker über das Zerlegen von Problemen, geschrieben für die Mathematik und
weit darüber hinaus lesbar: das Problem verstehen, einen Plan machen, ihn
ausführen und zurückblicken. Seine Fragen („Kennst du ein verwandtes
Problem?“, „Kannst du einen Teil davon lösen?“) sind die lange Fassung dieser
Seite.
