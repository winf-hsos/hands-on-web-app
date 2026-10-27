---
type: tool
code: 3684
title: Positron
summary: >-
  Die kostenlose Entwicklungsumgebung von Posit für R und Python: wo du R auf
  deinem eigenen Rechner schreibst, wenn du über den Browser hinauswillst.
url: https://positron.posit.co/
level: 1
duration: 10
topics: [reproducible-work, programming-with-r]
modules: [ea]
areas: [ds]
status: draft
updated: 2026-10-27
---

## Worum es geht

Die R-Kästen auf dieser Plattform genügen zum Lernen. Für eigene Auswertungen
brauchst du R auf deinem Rechner und einen Ort, an dem du Skripte schreibst,
ausführst und Daten ansiehst. Positron ist eine solche Umgebung, gemacht von
Posit, der Firma hinter RStudio und dem tidyverse. Es ist kostenlos und
kann R und Python gleichermaßen.

## Einrichten

1. **R installieren.** Positron bringt R nicht selbst mit. Die aktuelle
   Version für Windows, macOS oder Linux gibt es bei CRAN unter
   cran.r-project.org.
2. **Positron installieren**, über die Seite, die unten verlinkt ist.
3. **Einen Ordner für dein Projekt öffnen.** Leg Daten und Skripte in einen
   gemeinsamen Ordner und öffne ihn in Positron über *File → Open Folder*.
   Dann findet R jede Datei dort ohne langen Pfad.
4. **Ein Skript anlegen** mit der Endung `.R`, die Pakete laden und loslegen.
   Mit **Strg+Enter** (am Mac **Cmd+Enter**) führst du die Zeile aus, in der
   der Cursor steht.

## Was du von hier mitnimmst

Alles, was du in den Kästen gelernt hast, funktioniert dort genauso,
einschließlich des Kürzels für die Pipe. Nur zwei Dinge musst du selbst tun:
Pakete installieren und laden, wie in [[r-packages]] beschrieben, und deine
Daten einlesen, etwa mit `read_csv()`, wie es die Seite zum
[[milk-chocolate-survey|Datensatz der Umfrage]] zeigt.
