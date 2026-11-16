---
type: paper
code: 1219
title: "Same Stats, Different Graphs"
summary: >-
  Justin Matejka und George Fitzmaurice erzeugen mit simuliertem Abkühlen
  Datensätze, die dieselben Kennzahlen haben und doch ganz verschiedene
  Bilder ergeben, darunter den „Datasaurus Dozen“.
authors: [Justin Matejka, George Fitzmaurice]
year: 2017
venue: Proceedings of the 2017 CHI Conference on Human Factors in Computing Systems, 1290–1294
doi: 10.1145/3025453.3025912
level: 2
duration: 15
topics: [visualising-data, exploring-data]
modules: [ea]
areas: [ds]
status: draft
updated: 2026-11-16
---

Der Beitrag verallgemeinert das Quartett von Anscombe: Statt Datensätze von
Hand zu bauen, verschiebt ein Programm die Punkte einer Wolke in kleinen
Schritten in Richtung einer Zielform und behält jeden Schritt nur, wenn sich
Mittelwerte, Standardabweichungen und Korrelation auf zwei Nachkommastellen
nicht ändern. So entstehen aus einem Dinosaurier aus Punkten zwölf weitere
Bilder mit denselben Kennzahlen, der „Datasaurus Dozen“, und dasselbe
Verfahren hält auf Wunsch auch die Boxplots gleich.

## Warum es hierher passt

Die Formen im Demonstrator [[same-stats-demo]] sind nach diesem Verfahren
für die Plattform neu erzeugt; die Lektion [[why-visualise]] erklärt, was
daraus für das Auswerten folgt.
