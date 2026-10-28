---
type: dataset
code: 3742
title: "Let's Make a Deal: 100 Spiele mit drei Türen"
summary: >-
  Wo stand das Auto, welche Tür wählte die Person, welche öffnete der
  Moderator, und blieb sie bei ihrer Wahl oder wechselte sie? Ein kleiner,
  sauberer Datensatz für die ersten Schritte mit Vektoren und Data Frames.
url: https://github.com/winf-hsos/data-analytics-code/tree/main/data/monty_hall_problem
file: lets_make_a_deal.csv
level: 1
duration: 5
topics: [getting-data, programming-with-r]
modules: [ea]
areas: [ds]
status: draft
updated: 2026-10-28
---

## Worum es geht

Jede Zeile ist ein Spiel nach den Regeln der Spielshow „Let's Make a Deal“:
Hinter einer von drei Türen steht ein Auto, die Person wählt eine Tür, der
Moderator öffnet eine andere, hinter der kein Auto steht, und die Person
bleibt bei ihrer Wahl oder wechselt zur letzten geschlossenen Tür. Die Daten
liegen im Repository zu den Data-Analytics-Kursen, das unten verlinkt ist,
und gehören zum Projekt [[monty-hall]].

| Spalte | Inhalt |
|---|---|
| `contestant` | Vorname der Person; manche spielen mehrmals |
| `prize_door` | die Tür, hinter der das Auto steht, `1` bis `3` |
| `contestant_choice` | die Tür, die die Person zuerst wählt |
| `monty_opens` | die Tür, die der Moderator öffnet |
| `decision` | `stay` (bleiben) oder `switch` (wechseln) |

Ob ein Spiel gewonnen wurde, steht nicht in der Tabelle. Das lässt sich aus
den anderen Spalten ableiten, und genau das ist eine der ersten Aufgaben im
Projekt.

## Worauf man achten sollte

- **Die Daten sind vollständig und stimmig.** Es fehlt kein Wert, und der
  Moderator öffnet nie die Tür mit dem Auto oder die gewählte Tür. Damit
  eignen sie sich für den Anfang, bevor es um unordentliche Daten geht.
- **Gewechselt wird selten.** Nur in gut einem Viertel der Spiele wechselt
  die Person; der Vergleich der beiden Gruppen beruht also auf
  unterschiedlich vielen Spielen.
- **Hundert Spiele sind wenig.** Was die Daten nahelegen, prüft das Projekt
  deshalb mit einer Simulation über viele tausend Spiele.
