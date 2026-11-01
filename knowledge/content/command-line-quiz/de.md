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
status: draft
updated: 2026-11-01
---

## In welchem Ordner liegt die Datei `C:\Users\anna\Documents\uni\notizen.txt`?

- [ ] `Documents`
- [x] `uni`
- [ ] `notizen.txt`
- [ ] `C:\`

> Der letzte Teil eines Pfads ist der Name der Datei, der Teil davor der
> Ordner, in dem sie direkt liegt. `uni` liegt seinerseits in `Documents`.

## Welche dieser Pfade sind absolut? (mehrere richtig)

- [x] `C:\Users\anna\Documents`
- [ ] `Documents\uni`
- [x] `/Users/anna/Documents`
- [ ] `..\bilder`

> Ein absoluter Pfad beginnt an der Wurzel, unter Windows mit dem Laufwerk wie
> `C:\`, auf dem Mac mit `/`. Die anderen beiden gelten nur von einem
> bestimmten Ordner aus und sind relativ.

## Der Prompt lautet `PS C:\Users\anna\Documents\uni>`. Wo bist du nach `cd ..`?

- [ ] In `C:\Users\anna`
- [x] In `C:\Users\anna\Documents`
- [ ] Immer noch in `uni`, denn `..` ist kein Ordnername
- [ ] In `C:\`

> `..` steht für den Ordner eine Ebene über dem aktuellen. Von `uni` aus ist
> das `Documents`.

## Mit welchem Befehl siehst du, welche Dateien im aktuellen Ordner liegen?

- [ ] `pwd`
- [x] `ls`
- [ ] `cd`
- [ ] `cat`

> `ls` listet den Inhalt eines Ordners. `pwd` nennt nur den Pfad des aktuellen
> Ordners, `cd` wechselt ihn, und `cat` zeigt den Inhalt einer Datei.

## Was bewirkt `mv bericht.txt bericht-final.txt`?

- [ ] Es entsteht eine Kopie namens `bericht-final.txt`, das Original bleibt.
- [x] Die Datei heißt danach `bericht-final.txt`, eine `bericht.txt` gibt es nicht mehr.
- [ ] Die Datei wird in einen Ordner namens `bericht-final.txt` verschoben.

> Ist das Ziel kein vorhandener Ordner, sondern ein neuer Name, benennt `mv`
> die Datei um. Eine Kopie entsteht nur mit `cp`.

## Du hast eine Datei aus Versehen mit `rm` gelöscht. Wo findest du sie?

- [ ] Im Papierkorb
- [ ] Im Ordner `.trash` des aktuellen Verzeichnisses
- [x] Nirgends, sie ist ohne Umweg gelöscht

> `rm` löscht sofort und ohne Rückfrage, der Papierkorb gehört zum Explorer
> und zum Finder, nicht zur Kommandozeile. Wiederherstellen lässt sie sich
> höchstens aus einer Sicherung.

## `python hallo.py` antwortet mit `can't open file … No such file or directory`. Was ist die wahrscheinlichste Ursache?

- [ ] Im Programm steht ein Tippfehler.
- [ ] Python ist nicht installiert.
- [x] Du bist nicht in dem Ordner, in dem `hallo.py` liegt.

> Python hat gestartet, sonst käme die Meldung nicht von Python, und es hat
> die Datei gar nicht erst gelesen, ein Tippfehler darin fiele also noch nicht
> auf. Es sucht `hallo.py` im aktuellen Verzeichnis, und dort liegt sie nicht.
