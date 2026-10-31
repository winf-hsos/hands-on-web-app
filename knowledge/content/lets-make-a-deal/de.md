---
type: dataset
code: 3742
title: "Let's Make a Deal: 100 Spiele mit drei Türen"
summary: >-
  Wo stand das Auto, welche Tür wählte die Person, welche öffnete der
  Moderator, und blieb sie bei ihrer Wahl oder wechselte sie? Ein kleiner,
  sauberer Datensatz für die ersten Schritte mit Vektoren und Data Frames.
file: lets_make_a_deal.csv
level: 1
duration: 5
topics: [getting-data, programming-with-r]
modules: [ea]
areas: [ds]
status: published
updated: 2026-10-28
---

## Worum es geht

Jede Zeile ist ein Spiel nach den Regeln der Spielshow „Let's Make a Deal“:
Hinter einer von drei Türen steht ein Auto, die Person wählt eine Tür, der
Moderator öffnet eine andere, hinter der kein Auto steht, und die Person
bleibt bei ihrer Wahl oder wechselt zur letzten geschlossenen Tür. Die Spiele
sind für die Übung erzeugt, nicht in der Sendung aufgezeichnet. Sie gehören
zum Projekt [[monty-hall]].

| Spalte | Inhalt |
|---|---|
| `contestant` | ein ausgedachter Vorname; manche spielen mehrmals |
| `prize_door` | die Tür, hinter der das Auto steht, `1` bis `3` |
| `contestant_choice` | die Tür, die die Person zuerst wählt |
| `monty_opens` | die Tür, die der Moderator öffnet |
| `decision` | `stay` (bleiben) oder `switch` (wechseln) |

Ob ein Spiel gewonnen wurde, steht nicht in der Tabelle. Das lässt sich aus
den anderen Spalten ableiten, und genau das ist eine der ersten Aufgaben im
Projekt.
