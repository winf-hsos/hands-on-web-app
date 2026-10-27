---
type: tool
code: 3684
title: Positron
summary: >-
  Die kostenlose Entwicklungsumgebung von Posit für die Datenanalyse: ein
  Programm für R, Python und Quarto, mit Konsole, Datenansicht und Grafiken.
url: https://positron.posit.co/
license: Elastic License 2.0
level: 1
duration: 12
topics: [reproducible-work, programming-with-r, programming-with-python]
modules: [ea, dup]
areas: [ds, cs]
status: draft
updated: 2026-10-27
---

## Worum es geht

Die Codekästen auf dieser Plattform genügen zum Lernen. Für eigene
Auswertungen brauchst du ein Programm auf deinem Rechner, in dem du Skripte
schreibst, ausführst und die Ergebnisse ansiehst. Positron ist eine solche
Entwicklungsumgebung, gemacht von Posit, der Firma hinter RStudio und dem
tidyverse. Es ist für die Datenanalyse gebaut und kann R, Python und Quarto
in einem Programm, so dass du nicht für jede Sprache ein eigenes Werkzeug
lernen musst.

Positron ist kostenlos, auch für die Arbeit an der Hochschule und im Beruf,
und läuft unter Windows, macOS und Linux. Es baut auf Code OSS auf, demselben
Fundament wie Visual Studio Code; wer VS Code kennt, findet sich sofort
zurecht.

## Einrichten

Positron selbst bringt weder R noch Python mit. Du installierst also, was du
brauchst, und Positron findet es dann von selbst:

1. **Positron** über die Seite, die unten verlinkt ist.
2. **R**, mindestens in Version 4.2, von CRAN unter cloud.r-project.org.
3. **Python**, wenn du es brauchst, in einer aktuellen Version. Hast du keins,
   kann Positron es dir mit dem Werkzeug uv installieren.

**Quarto** musst du nicht eigens installieren; es ist in Positron schon
enthalten.

## Ein Projekt ist ein Ordner

Positron arbeitet mit Ordnern. Leg für jede Auswertung einen Ordner an, mit
Daten, Skripten und Berichten darin, und öffne ihn über *File → Open Folder*.
Dann findet dein Code jede Datei dort über ihren Namen, ohne langen Pfad, und
dein Projekt läuft auch auf einem anderen Rechner. Eine Projektdatei wie das
`.Rproj` von RStudio braucht Positron nicht; der geöffnete Ordner ist das
Projekt.

## Was du auf dem Bildschirm siehst

- **Editor:** Hier schreibst du Skripte (`.R`, `.py`) und Berichte (`.qmd`).
  Mit **Strg+Enter** (am Mac **Cmd+Enter**) führst du die Zeile oder die
  Auswahl aus, in der der Cursor steht.
- **Konsole:** Hier läuft der Code, und hier erscheinen die Ergebnisse. Du
  kannst auch direkt hineintippen, um etwas auszuprobieren.
- **Variables:** alle Objekte, die gerade existieren, mit Typ und Größe.
- **Data Explorer:** Aus *Variables* heraus öffnest du eine Tabelle wie in
  einer Tabellenkalkulation, mit Sortieren, Filtern und einer kleinen
  Übersicht für jede Spalte.
- **Plots:** die Grafiken, die dein Code zeichnet.
- **Help:** die Hilfe zu einer Funktion; **F1** auf einem Funktionsnamen
  öffnet sie.

## R und Python nebeneinander

Oben rechts wählst du, mit welcher Sprache und welcher Version du arbeitest.
Positron kann mehrere Sitzungen gleichzeitig offen halten, etwa eine für R
und eine für Python; Konsole, *Variables* und *Plots* zeigen immer die
Sitzung, die gerade aktiv ist. Führst du Code aus einem Skript aus, schickt
Positron ihn an eine Sitzung der passenden Sprache.

Für R gelten die Kürzel, die du aus den Codekästen hier kennst, etwa
**Strg+Umschalt+M** für die Pipe. Für Python bringt Positron eine eigene
Unterstützung mit und kennt die üblichen Umgebungen wie venv, uv und conda.

## Berichte mit Quarto

Ein Quarto-Dokument (`.qmd`) mischt Text und Code: Du schreibst die
Auswertung in Markdown, dazwischen stehen Codeblöcke in R oder Python, und
beim Rendern entsteht daraus ein Bericht als HTML, PDF oder Word, mit allen
Ergebnissen und Grafiken an ihrer Stelle. Die Leiste über dem Editor hat
einen Knopf, der den Bericht rendert und als Vorschau zeigt. Code
ausführen kannst du nur in der Quelltextansicht, nicht in der visuellen
Ansicht.

## Erweiterungen

Wie VS Code lässt sich Positron um Erweiterungen ergänzen. Sie kommen aus dem
freien Verzeichnis Open VSX, nicht aus dem Marketplace von Microsoft. Die
Unterstützung für R und Python ist schon eingebaut; die R- und
Python-Erweiterungen, die man aus VS Code kennt, brauchst du nicht und
solltest du nicht zusätzlich installieren.

## Was du von hier mitnimmst

Alles, was du in den Kästen dieser Plattform gelernt hast, funktioniert in
Positron genauso. Nur zwei Dinge musst du selbst tun: Pakete installieren und
laden, wie in [[r-packages]] beschrieben, und deine Daten einlesen, etwa mit
`read_csv()`, wie es die Seite zum [[milk-chocolate-survey|Datensatz der Umfrage]]
zeigt.
