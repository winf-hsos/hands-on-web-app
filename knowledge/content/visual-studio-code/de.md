---
type: tool
code: 5136
title: Visual Studio Code
summary: >-
  Der kostenlose Editor von Microsoft, in dem du Programme schreibst, ihre
  Dateien siehst und sie im eingebauten Terminal startest, mit Erweiterungen
  für Python und fast jede andere Sprache.
objectives:
  intro: "Diese Seite stellt dir Visual Studio Code vor, den Editor, mit dem du auf deinem eigenen Rechner programmierst, und danach kannst du:"
  goals:
    - "VS Code und die Erweiterung für Python installieren"
    - "einen Projektordner über File → Open Folder öffnen und darin Dateien anlegen"
    - "die Bereiche Explorer, Editor und Terminal finden und die Befehlspalette mit Strg+Umschalt+P öffnen"
    - "ein Python-Programm mit dem Knopf Run Python File oder im Terminal starten"
    - "einstellen, welches Python VS Code verwendet, und erkennen, wann eine virtuelle Umgebung aktiv ist"
url: https://code.visualstudio.com/
license: Microsoft Software License (Quellcode Code OSS unter MIT)
level: 1
duration: 12
topics: [working-with-the-computer, programming-with-python]
modules: [dup]
relations:
  see_also: [positron, python-on-the-command-line]
status: draft
updated: 2026-11-01
---

Die Codekästen auf dieser Plattform genügen zum Lernen. Sobald deine
Programme auf deinem eigenen Rechner laufen sollen, brauchst du einen Editor,
in dem du sie schreibst, ihre Dateien im Blick hast und sie startest.
Visual Studio Code, kurz VS Code, ist ein solcher Editor. Er kommt von
Microsoft, ist kostenlos, läuft unter Windows, macOS und Linux und ist unter
Programmierenden der am weitesten verbreitete Editor überhaupt.

VS Code ist zunächst ein schlanker Editor für Text. Was er über eine
Programmiersprache weiß, bringen **Erweiterungen** mit: Mit der Erweiterung
für Python färbt er deinen Code ein, schlägt dir beim Tippen Namen vor,
markiert Fehler, bevor du das Programm startest, und führt es auf Knopfdruck
aus. Im Modul Digitalisierung und Programmierung und im [[lifi|LiFi-Projekt]] schreibst
du deine Programme in VS Code.

## Einrichten

1. **VS Code** über die Seite, die unten verlinkt ist. Unter Windows lässt du
   bei der Installation das Häkchen bei *Add to PATH* gesetzt, dann kannst
   du VS Code auch aus der Kommandozeile öffnen.
2. **Python** von [python.org](https://www.python.org/downloads/), wenn du es
   noch nicht hast. VS Code bringt kein eigenes Python mit.
3. Die **Erweiterung Python** von Microsoft. Klick links auf das Symbol mit
   den vier Quadraten (*Extensions*), suche nach *Python* und installiere den
   Eintrag von Microsoft; er bringt die Hilfen beim Tippen und den Debugger
   gleich mit.

Die Menüs von VS Code sind englisch, und diese Seite nennt sie so. Ein
deutsches Sprachpaket gibt es als Erweiterung, aber die meisten Anleitungen,
auch die im LiFi-Projekt, verwenden die englischen Namen.

## Ein Projekt ist ein Ordner

VS Code arbeitet mit Ordnern, nicht mit einzelnen Dateien. Öffne über
*File → Open Folder* den Ordner, in dem dein Projekt liegt, etwa
`studium\programmieren\uebung-1` aus der [[command-line-exercise|Übung zur Kommandozeile]]. Alles,
was du dann anlegst, landet in diesem Ordner, und das Terminal startet
ebenfalls dort, so dass Python deine Dateien über ihren Namen findet.

Beim ersten Öffnen fragt VS Code, ob du den Autoren der Dateien im Ordner
vertraust. Bei einem Ordner, den du selbst angelegt hast, antwortest du mit
*Yes, I trust the authors*.

## Was du auf dem Bildschirm siehst

- **Explorer** (links): die Dateien und Unterordner des geöffneten Ordners.
  Über die kleinen Symbole oben legst du eine neue Datei oder einen neuen
  Ordner an.
- **Editor** (Mitte): die geöffneten Dateien, jede in einem eigenen Reiter.
  Ein Punkt im Reiter heißt, dass die Datei noch nicht gespeichert ist; mit
  **Strg+S** (am Mac **Cmd+S**) speicherst du sie. Wer das oft vergisst,
  schaltet *File → Auto Save* ein.
- **Terminal** (unten): eine Kommandozeile mitten im Editor, die im
  geöffneten Ordner beginnt. Du öffnest sie über *Terminal → New Terminal*.
- **Befehlspalette:** Mit **Strg+Umschalt+P** (am Mac **Cmd+Umschalt+P**)
  öffnet sich oben ein Suchfeld für jeden Befehl, den VS Code kennt. Wenn du
  nicht weißt, wo etwas im Menü steht, tippst du hier ein paar Buchstaben
  seines Namens.

## Ein Python-Programm starten

Öffnest du eine Datei mit der Endung `.py`, erscheint oben rechts über dem
Editor ein Dreieck mit dem Namen *Run Python File*. Ein Klick speichert die
Datei und startet sie im Terminal; die Ausgabe erscheint dort, und dort
tippst du auch, wenn das Programm mit `input` nach etwas fragt.

Hinter dem Knopf steckt nichts anderes als der Befehl, den du in der
[[python-on-the-command-line|Kommandozeile]] von Hand eingibst. Du kannst genauso gut selbst
`python hallo.py` (am Mac `python3 hallo.py`) ins Terminal schreiben, und
wenn etwas nicht klappt, hilft es zu wissen, dass beides dasselbe ist.

## Welches Python?

Auf vielen Rechnern ist mehr als ein Python installiert, und jedes Projekt
kann eine eigene [[python-virtual-environments|virtuelle Umgebung]] haben.
Welches Python VS Code verwendet, steht unten rechts in der Statusleiste,
sobald eine `.py`-Datei offen ist. Ein Klick darauf, oder in der
Befehlspalette *Python: Select Interpreter*, zeigt dir alle, die VS Code
gefunden hat. Liegt im Projektordner ein Ordner `.venv`, schlägt VS Code ihn
von selbst vor, und neue Terminals aktivieren ihn dann gleich.

## VS Code und Positron

[[positron]] baut auf demselben Fundament auf wie VS Code, dem freien Code
OSS, und sieht deshalb fast gleich aus. Für die Datenanalyse in R und Python
ist Positron die bessere Wahl, weil es Konsole, Tabellenansicht und Grafiken
gleich mitbringt. Für das Programmieren in Python, wie in diesem Pfad und im
LiFi-Projekt, ist VS Code der Standard, und was du in einem der beiden
Programme lernst, kannst du im anderen weiterverwenden.

## Erweiterungen und KI-Assistenten

Erweiterungen kommen aus dem Marketplace von Microsoft, den du über das
Symbol *Extensions* erreichst. Installiere nur, was du wirklich brauchst, und
nur Einträge mit vielen Downloads von einem bekannten Herausgeber, denn eine
Erweiterung darf auf deinem Rechner fast alles.

KI-Assistenten arbeiten ebenfalls in VS Code, entweder als Erweiterung oder,
wie OpenCode im LiFi-Projekt, als Programm im Terminal. Dann liest der
Assistent die Dateien im geöffneten Ordner und schreibt hinein, und im
Explorer und Editor siehst du sofort, was er verändert hat.
