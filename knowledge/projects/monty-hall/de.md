---
kind: project
code: 1663
title: The Monty Hall Problem
summary: >-
  Wechseln oder bleiben? An einem berühmten Ratespiel lernt ihr, ein
  Experiment als Daten festzuhalten, es in R nachzubauen und so oft zu
  spielen, bis die Daten eine Antwort geben, die kaum jemand erwartet.
level: 1
topics: [questions-and-measurement, programming-with-r, getting-data]
modules: [ea]
areas: [ds]
items: [hands-on-programming-with-r]
phases:
  - id: play
  - id: record
    items: [tidy-data]
  - id: simulate
    items: [r-vectors, r-functions]
  - id: analyse
    items: [analytic-questions]
status: draft
updated: 2026-10-27
---

In einer Spielshow stehen drei Türen. Hinter einer wartet ein Auto, hinter
den beiden anderen je eine Ziege. Du wählst eine Tür, und der Moderator, der
weiß, wo das Auto steht, öffnet daraufhin eine der beiden anderen, und zwar
immer eine mit einer Ziege. Dann fragt er dich, ob du bei deiner Tür bleibst
oder zur anderen geschlossenen Tür wechselst.

Die meisten Menschen sind sicher, dass das keine Rolle spielt, weil ja zwei
Türen übrig sind. Ob das stimmt, findet ihr in diesem Projekt nicht durch
Nachdenken heraus, sondern mit einem Experiment: Ihr spielt, haltet jede
Runde als Daten fest und lasst R das Spiel so oft wiederholen, bis die
Antwort nicht mehr vom Zufall abhängt.

Unterwegs lernt ihr, was jede Datenanalyse braucht: wie man ein Experiment so
aufschreibt, dass man es auswerten kann, wie solche Daten in R aussehen und
wie man mit wenigen Zeilen Code ein Experiment beliebig oft durchführt.

## Das Spiel von Hand spielen {#play}

Zu zweit, mit drei Karten, von denen eine das Auto ist: Eine Person
moderiert, die andere spielt. Spielt einige Runden, mal mit Wechseln, mal
ohne, und notiert, wie jede Runde ausgeht.

## Eine Runde als Daten {#record}

Was muss man über eine Runde aufschreiben, damit sich die Frage später
beantworten lässt? Ihr legt fest, welche Variablen ein Spiel beschreibt und
wie eine Tabelle aussieht, in der jede Runde eine Zeile ist.

## Das Spiel in R nachbauen {#simulate}

Ihr beschreibt eine Runde in R, mit Zufall für das Auto und die erste Wahl,
und lasst sie dann tausendfach laufen. Heraus kommt eine Tabelle mit
derselben Form wie eure Notizen von Hand, nur viel länger.

## Auswerten {#analyse}

Wie oft gewinnt, wer wechselt, und wie oft, wer bleibt? Ihr vergleicht eure
Runden von Hand mit der Simulation und überlegt, welche Art von Frage ihr
damit beantwortet habt.
