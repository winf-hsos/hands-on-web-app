---
type: exercise
code: 1528
title: "Übung: Ein Ordner fürs Studium"
summary: >-
  Du legst nur mit der Kommandozeile eine kleine Ordnerstruktur für dein
  Studium an, kopierst und verschiebst darin Dateien und prüfst am Ende, ob
  alles an seinem Platz ist.
objectives:
  intro: "In dieser Übung wendest du die Befehle der Kommandozeile zusammen an und kannst danach:"
  goals:
    - "eine vorgegebene Ordnerstruktur mit `mkdir` und `cd` anlegen"
    - "Dateien anlegen, kopieren, verschieben und umbenennen, ohne den Explorer oder Finder zu benutzen"
    - "mit `pwd` und `ls` jederzeit prüfen, wo du bist und was dort liegt"
    - "dich mit relativen Pfaden und `..` zwischen benachbarten Ordnern bewegen"
level: 1
duration: 15
topics: [working-with-the-computer]
modules: [dup]
relations:
  requires: [command-line-files]
status: draft
updated: 2026-11-01
---

Am Ende dieser Übung soll in deinem Benutzerordner diese Struktur stehen, und
zwar ohne dass du dafür den Explorer oder den Finder öffnest:

![Ein Ordnerbaum: studium enthält programmieren und mathe; in programmieren liegen notizen.txt und der Ordner uebung-1 mit hallo.py, in mathe die Datei formeln.txt](figure:target "Das Ziel der Übung, ausgehend von deinem Benutzerordner.")

Arbeite die Schritte der Reihe nach ab und sieh nach jedem mit `ls` nach, ob
das Ergebnis stimmt. Wenn du dich vertippst, ist nichts verloren: Mit `mv`
benennst du falsch geschriebene Namen um.

## Schritt 1: Die Ordner

Öffne die Kommandozeile, gehe in deinen Benutzerordner und lege dort den
Ordner `studium` an. Lege darin die beiden Ordner `programmieren` und `mathe`
an, und in `programmieren` den Ordner `uebung-1`.

> [!HINT]
> Du kannst in einen Ordner wechseln, bevor du darin etwas anlegst, oder den
> relativen Pfad angeben: `mkdir studium\programmieren` legt unter Windows
> `programmieren` in `studium` an, auf dem Mac heißt es
> `mkdir studium/programmieren`.

> [!SOLUTION]
> ```powershell
> cd ~
> mkdir studium
> cd studium
> mkdir programmieren
> mkdir mathe
> cd programmieren
> mkdir uebung-1
> ```

## Schritt 2: Die Dateien

Lege in `programmieren` eine leere Datei `notizen.txt` an und in `uebung-1`
eine leere Datei `hallo.py`. Gehe dann in den Ordner `mathe` und lege dort
`formel.txt` an.

> [!HINT]
> Unter Windows legst du eine leere Datei mit `New-Item` an, auf dem Mac mit
> `touch`. Von `programmieren` nach `mathe` kommst du mit `cd ..\mathe`, auf
> dem Mac mit `cd ../mathe`.

> [!SOLUTION]
> Unter Windows, wenn du noch in `programmieren` bist:
>
> ```powershell
> New-Item notizen.txt
> New-Item uebung-1\hallo.py
> cd ..\mathe
> New-Item formel.txt
> ```
>
> Auf dem Mac:
>
> ```zsh
> touch notizen.txt
> touch uebung-1/hallo.py
> cd ../mathe
> touch formel.txt
> ```

## Schritt 3: Umbenennen und kopieren

Im Ziel heißt die Datei in `mathe` nicht `formel.txt`, sondern `formeln.txt`.
Benenne sie um. Lege danach eine Kopie von `formeln.txt` als Sicherung in
`programmieren` an und lösche diese Kopie gleich wieder, denn im Ziel kommt
sie nicht vor.

> [!HINT]
> Umbenennen ist Verschieben unter neuem Namen. Die Kopie liegt in einem
> Nachbarordner, also erreichst du sie über `..`.

> [!SOLUTION]
> Unter Windows, in `mathe`:
>
> ```powershell
> mv formel.txt formeln.txt
> cp formeln.txt ..\programmieren
> rm ..\programmieren\formeln.txt
> ```
>
> Auf dem Mac stehen dieselben Befehle mit `/` statt `\`.

## Schritt 4: Prüfen

Gehe zurück in `studium` und lass dir mit `ls` den Inhalt aller drei Ebenen
anzeigen, indem du `ls` die Ordner als Argumente mitgibst. Vergleiche das
Ergebnis mit der Zeichnung oben.

> [!SOLUTION]
> ```powershell
> cd ..
> pwd
> ls
> ls programmieren
> ls programmieren\uebung-1
> ls mathe
> ```
>
> `pwd` muss mit `studium` enden. Auf dem Mac schreibst du
> `ls programmieren/uebung-1`.

Wenn alles stimmt, hast du einen Ordner, in dem du die nächsten
Python-Programme ablegen kannst. In `uebung-1` liegt schon die Datei, die du
im nächsten Schritt mit Leben füllst.
