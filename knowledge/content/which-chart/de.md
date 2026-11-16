---
type: demo
code: 5161
title: Welches Diagramm passt?
summary: >-
  Ein paar Fragen zu den Variablen führen zum passenden Diagramm für eine
  Frage an Umfragedaten, mit einer Skizze, den Fallstricken und einer Vorlage
  für R und ggplot2, die sich auch direkt mit Spalten der Milch-Umfrage füllen
  lässt.
level: 1
duration: 10
topics: [visualising-data]
modules: [ea]
areas: [ds]
relations:
  see_also: [milk-survey-compact]
status: published
updated: 2026-11-15
---

**Ziel:** Du findest für eine Frage an Umfragedaten das Diagramm, das sie
beantwortet, und bekommst dazu eine Vorlage in R, die du nur noch mit deinen
Spalten füllen musst.

**Bedienung:** Beantworte die Fragen mit einem Klick auf eine der großen
Schaltflächen oder mit den Zifferntasten. Oben sammeln sich deine Antworten,
und mit „Zurück“ nimmst du die letzte zurück. Am Ende stehen das passende
Diagramm mit einer Skizze, der Grund, warum es passt, worauf du achten solltest
und der R-Code mit einem Knopf zum Kopieren. Darunter kannst du stattdessen
eine oder zwei Spalten der Milch-Umfrage wählen: Der Demonstrator zeigt dann,
wie die Fragen für sie ausgehen, und füllt den Code mit ihren Namen, sodass er
in jedem R-Codekasten der Plattform läuft.

Welches Diagramm passt, entscheidet vor allem das **Skalenniveau** der
Variablen. Kategorien ohne Reihenfolge darfst du nach Häufigkeit sortieren,
Kategorien mit Reihenfolge behalten die Ordnung ihrer Skala, und Zahlen zeigst
du als Verteilung. Bei **einer** Variablen geht es darum, wie sich die
Antworten verteilen; bei **zwei** Variablen darum, wie sie zusammenhängen, und
dann bestimmt die Kombination der beiden Skalen die Darstellung.

```which-chart
```
