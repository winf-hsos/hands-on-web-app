---
kind: path
code: 8715
areas: [ds]
title: Datentransformation mit R und dplyr
summary: >-
  Aus Rohdaten die Tabelle machen, die eine Frage beantwortet: erst die Idee,
  dann die Verben von dplyr, an einer echten Umfrage und direkt im Browser.
goal: >-
  Du zerlegst eine Frage an einen Datensatz in Grundoperationen und setzt sie
  mit select() und filter() in R um, auch wenn Werte fehlen oder nicht
  stimmen können.
audience: Alle, die Daten auswerten wollen, ohne Programmiererfahrung
level: 1
requires: [getting-started-with-r]
sections:
  - title: { de: "Teil 1: Die Idee", en: "Part 1: The idea" }
    steps:
      - data-transformation-basics
      - dplyr-verbs-demo
      - tidy-data
  - title: { de: "Teil 2: Erste Verben in R", en: "Part 2: First verbs in R" }
    steps:
      - dplyr-select
      - dplyr-filter
      - dplyr-exercise-price
      - data-transformation-quiz
status: draft
updated: 2026-10-27
---

Dieser Pfad beginnt ohne Code. Im ersten Teil geht es darum, was es heißt,
Daten zu transformieren, welche wenigen Grundoperationen dafür genügen und
welche Form eine Tabelle haben sollte, damit sie sich leicht auswerten
lässt. Das gilt für jedes Werkzeug, ob R, Python, SQL oder Excel.

Im zweiten Teil setzt du die Ideen in R mit dem Paket dplyr um. Jeder
Codekasten ist ein kleiner Editor, in dem R direkt in deinem Browser läuft;
installieren musst du nichts. Alle Beispiele verwenden einen kleinen
Ausschnitt aus einer Umfrage zu Milch und Milchalternativen. Wer R noch nicht
kennt, beginnt mit dem Lernpfad [[getting-started-with-r]]; dort lernst du
auch den Datensatz kennen.

Weitere Teile zu `arrange()`, `mutate()`, `summarize()` und `group_by()`
und zum Verknüpfen von Tabellen folgen.
