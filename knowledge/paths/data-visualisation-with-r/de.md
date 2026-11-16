---
kind: path
code: 7542
areas: [ds]
title: Datenvisualisierung mit R und ggplot2
summary: >-
  Daten zeigen, statt sie nur zu beschreiben: warum Kennzahlen nicht
  genügen, welches Diagramm zu welcher Frage passt, wie ggplot2 es baut und
  wie eine Grafik ehrlich bleibt, mit der Milchumfrage direkt im Browser.
goal: >-
  Du baust mit ggplot2 Grafiken, die eine Frage an einen Datensatz
  beantworten, wählst für jede Variable eine passende Darstellung, zeigst
  Befragungsdaten mit ihren Fallzahlen und erkennst Grafiken, die täuschen.
audience: Alle, die Daten auswerten wollen, ohne Programmiererfahrung
level: 1
requires: [getting-started-with-r, data-transformation-with-r]
sections:
  - title: { de: "Teil 1: Das passende Diagramm", en: "Part 1: The fitting chart" }
    steps:
      - why-visualise
      - data-visualisation-basics
  - title: { de: "Teil 2: Üben", en: "Part 2: Practice" }
    steps:
      - ggplot-exercise-survey
  - title: { de: "Teil 3: Befragungsdaten zeigen", en: "Part 3: Showing survey data" }
    steps:
      - survey-charts
  - title: { de: "Teil 4: Ehrlich zeigen", en: "Part 4: Showing honestly" }
    steps:
      - misleading-charts
      - item: showing-uncertainty
        optional: true
status: published
updated: 2026-11-16
---

Dieser Pfad zeigt, wie aus einer Tabelle eine Grafik wird, die eine Frage
beantwortet. Er beginnt mit einem Plädoyer: Kennzahlen wie Mittelwert und
Korrelation verschweigen die Form der Daten, und erst eine Grafik zeigt sie.
Danach arbeitet er mit dem Paket ggplot2, das jede Grafik aus wenigen
Schichten zusammensetzt, den Daten, der Zuordnung von Variablen zu Achsen und
Farben und den Formen, die sie zeigen. In einer Übung wählst du selbst, mit
welchem Diagramm du eine Frage an die Umfrage beantwortest, danach geht es
um Itembatterien und Ratingskalen, wie sie in fast jeder Befragung vorkommen,
und zum Schluss um Grafiken, die täuschen, und wie es besser geht. Wer
mag, lernt am Ende noch, Unsicherheit mit Fehlerbalken zu zeigen.
