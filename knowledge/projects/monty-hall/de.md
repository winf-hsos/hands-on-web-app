---
kind: project
code: 1663
title: Das Monty-Hall-Problem
summary: >-
  Wechseln oder bleiben? An einem berühmten Ratespiel lernt ihr, ein
  Experiment als Daten festzuhalten, es in R nachzubauen und so oft zu
  spielen, bis die Daten eine Antwort geben, die kaum jemand erwartet.
level: 1
modules: [ea]
areas: [ds]
phases:
  - id: play
    items: [geh-aufs-ganze, monty-hall-in-the-classroom, what-should-we-measure, types-of-variables-slides]
  - id: vectors
    items: [monty-hall-game, data-representation-slides, r-vectors, r-data-types, monty-hall-experiment-2]
  - id: tibble
    items: [lets-make-a-deal, monty-hall-experiment-3]
  - id: simulate
    items: [r-functions, monty-hall-experiment-4]
status: published
updated: 2026-11-03
---

In einer Spielshow stehen drei Türen. Hinter einer wartet ein Auto, hinter
den beiden anderen je eine Ziege. Du wählst eine Tür, und der Moderator, der
weiß, wo das Auto steht, öffnet daraufhin eine der beiden anderen, und zwar
immer eine mit einer Ziege. Dann fragt er dich, ob du bei deiner Tür bleibst
oder zur anderen geschlossenen Tür wechselst.

Die meisten Menschen sind sicher, dass das keine Rolle spielt, weil ja zwei
Türen übrig sind. Ob das stimmt, findet ihr in diesem Projekt nicht durch
Nachdenken heraus, sondern mit Daten: Ihr spielt selbst, haltet jede Runde
fest, wertet einen Datensatz mit 100 Spielen aus und lasst R das Spiel so oft
wiederholen, bis die Antwort nicht mehr vom Zufall abhängt. Jede Phase endet
mit einem Experiment, das ihr im Team durchführt.

Unterwegs lernt ihr, was jede Datenanalyse braucht: wie man ein Experiment so
aufschreibt, dass man es auswerten kann, wie solche Daten in R als Vektoren
und als Tibble aussehen und wie man mit wenigen Zeilen Code ein Experiment
beliebig oft durchführt und daraus einen Datensatz macht.

## Phase 1: Das Spiel spielen {#play}

## Phase 2: Spiele als Vektoren {#vectors}

## Phase 3: 100 Spiele als Tibble {#tibble}

## Phase 4: Das Spiel simulieren {#simulate}

## Was ihr braucht

Für alles reicht ein Browser, denn das Spiel und R laufen auf den Seiten der
Plattform. Wer lieber am eigenen Rechner arbeitet, nimmt [[positron]] und lädt
den [[lets-make-a-deal|Datensatz]] herunter. Zum Nachlesen passen aus
[[hands-on-programming-with-r]] die Kapitel 5 bis 7 über Objekte, die
Schreibweise mit eckigen Klammern und das Ändern von Werten, für Tibbles und
dplyr die ersten Kapitel von [[r-for-data-science]].
