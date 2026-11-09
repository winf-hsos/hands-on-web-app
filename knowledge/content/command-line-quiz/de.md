---
type: quiz
code: 4904
title: "Quiz: Die Kommandozeile"
summary: Sieben Fragen zu Pfaden, den Befehlen der Kommandozeile und dem Start eines Python-Programms.
objectives:
  intro: "Mit diesem Quiz prüfst du in sieben Fragen, ob du Folgendes kannst:"
  goals:
    - "in einem Pfad den Dateinamen und die Ordner erkennen und absolute von relativen Pfaden unterscheiden"
    - "vorhersagen, wohin `cd ..` führt"
    - "den richtigen Befehl zum Anzeigen, Verschieben und Umbenennen wählen"
    - "einschätzen, was mit einer Datei passiert, die du mit `rm` löschst"
    - "die Fehlermeldung beim Start eines Python-Programms auf ihre Ursache zurückführen"
level: 1
duration: 8
topics: [working-with-the-computer]
modules: [dup]
relations:
  checks: [files-and-folders, command-line, command-line-navigating, command-line-files, python-on-the-command-line]
questions: [hcs-001, hcs-002, hcs-003, hcs-004, hcs-005, hcs-006, hcs-007]
status: published
updated: 2026-11-09
---

## In welchem Ordner liegt die Datei `C:\Users\anna\Documents\uni\notizen.txt`? {#hcs-001}

- [ ] `Documents`
  > `Documents` liegt eine Ebene höher und enthält den Ordner `uni`, nicht die Datei.
- [x] `uni`
  > Der Teil direkt vor dem Dateinamen ist der Ordner, in dem die Datei liegt.
- [ ] `notizen.txt`
  > `notizen.txt` ist der Name der Datei selbst und kein Ordner.
- [ ] `C:\`
  > `C:\` ist die Wurzel des Laufwerks, an der der Pfad beginnt, und bis zur Datei folgen noch vier Ordner.

> Der letzte Teil eines Pfads ist der Name der Datei, der Teil davor der Ordner, in dem sie direkt liegt. `uni` liegt seinerseits in `Documents`.

## Welche dieser Pfade sind absolut? (Mehrere richtige Antworten möglich.) {#hcs-002}

- [x] `C:\Users\anna\Documents`
  > Der Pfad beginnt mit dem Laufwerk `C:\` und damit an der Wurzel.
- [ ] `Documents\uni`
  > Der Pfad nennt kein Laufwerk und gilt nur von dem Ordner aus, in dem `Documents` liegt.
- [x] `/Users/anna/Documents`
  > Auf dem Mac und unter Linux beginnt die Wurzel mit `/`, der Pfad ist also absolut.
- [ ] `..\bilder`
  > `..` führt vom aktuellen Ordner eine Ebene nach oben, der Pfad hängt also davon ab, wo du gerade bist.

> Ein absoluter Pfad beginnt an der Wurzel, unter Windows mit dem Laufwerk wie `C:\`, auf dem Mac mit `/`. Die anderen beiden gelten nur von einem bestimmten Ordner aus und sind relativ.

## Der Prompt lautet `PS C:\Users\anna\Documents\uni>`. Wo bist du nach `cd ..`? {#hcs-003}

- [ ] In `C:\Users\anna`
  > Dorthin kämst du erst mit einem zweiten `cd ..`, denn jedes `..` geht nur eine Ebene nach oben.
- [x] In `C:\Users\anna\Documents`
  > `..` ist der Ordner direkt über `uni`, und das ist `Documents`.
- [ ] Immer noch in `uni`, denn `..` ist kein Ordnername
  > `..` ist ein fester Name, den es in jedem Ordner gibt, und er steht für den Ordner darüber.
- [ ] In `C:\`
  > Zur Wurzel des Laufwerks führt `cd \`, während `cd ..` nur eine Ebene nach oben geht.

> `..` steht für den Ordner eine Ebene über dem aktuellen. Von `uni` aus ist das `Documents`.

## Mit welchem Befehl siehst du, welche Dateien im aktuellen Ordner liegen? {#hcs-004}

- [ ] `pwd`
  > `pwd` nennt den Pfad des aktuellen Ordners, aber nicht, was darin liegt.
- [x] `ls`
  > `ls` listet die Dateien und Ordner im aktuellen Ordner auf.
- [ ] `cd`
  > `cd` wechselt den Ordner und zeigt dabei nichts an.
- [ ] `cat`
  > `cat` zeigt den Inhalt einer Datei, nicht den eines Ordners.

> `ls` listet den Inhalt eines Ordners. `pwd` nennt nur den Pfad des aktuellen Ordners, `cd` wechselt ihn, und `cat` zeigt den Inhalt einer Datei.

## Was bewirkt `mv bericht.txt bericht-final.txt`? {#hcs-005}

- [ ] Es entsteht eine Kopie namens `bericht-final.txt`, das Original bleibt.
  > Eine Kopie macht `cp`, während `mv` verschiebt oder umbenennt, und das Original ist danach fort.
- [x] Die Datei heißt danach `bericht-final.txt`, eine `bericht.txt` gibt es nicht mehr.
  > Weil es keinen Ordner `bericht-final.txt` gibt, benennt `mv` die Datei um.
- [ ] Die Datei wird in einen Ordner namens `bericht-final.txt` verschoben.
  > In einen Ordner verschiebt `mv` nur, wenn es ihn schon gibt, neu angelegt wird er nicht.
- [ ] Die Datei bleibt `bericht.txt`, und `mv` meldet einen Fehler, weil es `bericht-final.txt` noch nicht gibt.
  > Das Ziel muss vorher nicht existieren, denn ein neuer Name ist gerade der Fall, in dem `mv` umbenennt.

> Ist das Ziel kein vorhandener Ordner, sondern ein neuer Name, benennt `mv` die Datei um. Eine Kopie entsteht nur mit `cp`.

## Du hast eine Datei aus Versehen mit `rm` gelöscht. Wo findest du sie? {#hcs-006}

- [ ] Im Papierkorb
  > In den Papierkorb legen Explorer und Finder eine Datei, `rm` löscht sie dagegen ohne diesen Umweg.
- [ ] Im Ordner `.trash` des aktuellen Verzeichnisses
  > Einen solchen Ordner legt `rm` nicht an, es behält nichts zurück.
- [x] Nirgends, sie ist ohne Umweg gelöscht
  > `rm` löscht sofort, und zurück bekommst du die Datei höchstens aus einer Sicherung.
- [ ] In einer Sicherung, die `rm` anlegt
  > `rm` legt keine Sicherung an, eine hast du nur, wenn du sie selbst eingerichtet hast.

> `rm` löscht sofort und ohne Rückfrage, der Papierkorb gehört zum Explorer und zum Finder, nicht zur Kommandozeile. Wiederherstellen lässt sie sich höchstens aus einer Sicherung.

## `python hallo.py` antwortet mit `can't open file … No such file or directory`. Was ist die wahrscheinlichste Ursache? {#hcs-007}

- [ ] Im Programm steht ein Tippfehler.
  > Bis zum Inhalt kommt Python gar nicht, weil es die Datei nicht findet, ein Tippfehler darin fiele also erst danach auf.
- [ ] Python ist nicht installiert.
  > Die Meldung kommt von Python selbst, Python läuft also.
- [x] Du bist nicht in dem Ordner, in dem `hallo.py` liegt.
  > Python sucht `hallo.py` im aktuellen Ordner und findet sie dort nicht, und ein `cd` in den richtigen Ordner behebt das.
- [ ] Die Datei ist noch in einem anderen Programm geöffnet.
  > Eine Datei, die anderswo geöffnet ist, kann Python trotzdem lesen, und die Meldung sagt, dass es die Datei an dieser Stelle gar nicht gibt.

> Python hat gestartet, sonst käme die Meldung nicht von Python, und es hat die Datei gar nicht erst gelesen, ein Tippfehler darin fiele also noch nicht auf. Es sucht `hallo.py` im aktuellen Verzeichnis, und dort liegt sie nicht.
