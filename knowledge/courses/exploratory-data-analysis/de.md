---
kind: course
code: 1419
access_code: EDA-26
module: ea
formerly: [eda-2026-27-ws]
institution: hs-osnabrueck
areas: [ds]
title: Explorative Datenanalyse
subtitle: Ein Teil des Mastermoduls Empirisches Arbeiten
summary: >-
  Daten kennenlernen, bevor man Schlüsse zieht: Verteilungen, Zusammenhänge
  und Auffälligkeiten finden und zeigen, mit R und guten Grafiken.
sections:
  - project: monty-hall
  - path: getting-started-with-r
  - title: { de: "Explorative Datenanalyse (EDA)", en: "Exploratory data analysis (EDA)" }
    items: [exploratory-data-analysis-basics, dplyr-exercise-compact-survey, milk-survey-compact]
  - path: data-transformation-with-r
  - path: data-visualisation-with-r
  - title: { de: Selbsttest, en: Self-assessment }
    items: [eda-self-assessment, rewe-products]
status: published
updated: 2026-11-09
---

Diese Sammlung begleitet den Teil zur explorativen Datenanalyse im
Mastermodul Empirisches Arbeiten. Nach einem Einstieg in R zeigt die Lektion
[[exploratory-data-analysis-basics]] an der Umfrage zu Milch und Schokolade,
was Erkunden leistet und welche Art von Frage es beantworten kann, und in
einer Übung baust du danach aus der Rohfassung der Umfrage den kompakten
Datensatz, mit dem es weitergeht. Es folgen die Datentransformation mit dplyr
und die Datenvisualisierung mit ggplot2; weitere Abschnitte zum Beschreiben
und Prüfen von Daten entstehen gerade und sind dann ebenfalls von Anfang an
verfügbar. Am Ende zeigt dir ein Selbsttest, wo du stehst.
