---
type: challenge
code: 6293
title: "Challenge 5: Die Simulation als Tabelle"
summary: >-
  Ihr erzeugt tausend Runden auf einmal als Tabelle mit einer Zeile je Runde und vergleicht ihre Gewinnquoten mit euren eigenen Runden und den 100 Spielen.
objectives:
  intro: "Mit dieser Challenge hältst du mit deinem Team eine Simulation als Tabelle fest und kannst danach:"
  goals:
    - "mit `sample(..., replace = TRUE)` viele Zufallswerte auf einmal ziehen"
    - "mit `ifelse()` für jede Stelle eines Vektors einzeln entscheiden"
    - "Vektoren gleicher Länge mit `data.frame()` zu einer Tabelle zusammenfügen"
    - "mit `table()` Kombinationen zweier Spalten auszählen und Gewinnquoten vergleichen"
level: 1
topics: [programming-with-r, getting-data]
areas: [ds]
modules: [ea]
project: monty-hall
status: draft
updated: 2026-11-02
---

Eine Gewinnquote ist eine Zahl; wer später andere Fragen stellen will, etwa
ob die Tür des Autos eine Rolle spielt, braucht die einzelnen Runden. Die
Simulation soll deshalb dieselbe Art Tabelle liefern wie der Datensatz: eine
Zeile je Runde, eine Spalte je Angabe.

## Tausend Runden als Data Frame

Erzeugt 1.000 Runden auf einmal als Vektoren und fügt sie zu einem Data
Frame `simulation` mit den Spalten `prize_door`, `contestant_choice`,
`decision` und `won` zusammen. `sample(1:3, n, replace = TRUE)` zieht `n`
Türen auf einmal, und `ifelse()` entscheidet für jede Stelle eines Vektors
einzeln.

Überlegt dabei: Warum braucht ihr für `won` die Tür des Moderators gar
nicht?

```r
n <- 1000
prize_door <- sample(1:3, n, replace = TRUE)
head(prize_door)
```

> [!SOLUTION]
> ```r
> n <- 1000
> prize_door <- sample(1:3, n, replace = TRUE)
> contestant_choice <- sample(1:3, n, replace = TRUE)
> decision <- sample(c("stay", "switch"), n, replace = TRUE)
> won <- ifelse(decision == "stay", prize_door == contestant_choice, prize_door != contestant_choice)
>
> simulation <- data.frame(prize_door, contestant_choice, decision, won)
> head(simulation)
> ```
>
> Wer wechselt, landet immer auf der Tür, die weder gewählt noch geöffnet
> ist. Lag die erste Wahl falsch, ist das die Tür mit dem Auto, denn die
> andere falsche hat der Moderator ja geöffnet. Wechseln gewinnt also genau
> dann, wenn die erste Wahl falsch war, und das entscheidet sich, bevor der
> Moderator etwas öffnet.

## Wie oft gewinnt wer?

Zählt in `simulation`, wie oft mit Bleiben und mit Wechseln gewonnen und
verloren wurde, und berechnet die beiden Gewinnquoten. Vergleicht sie mit
euren eigenen Runden und mit den 100 Spielen. Arbeitet dafür im Kasten der
vorigen Aufgabe weiter, denn jeder Kasten beginnt ohne die Werte der anderen.

> [!SOLUTION]
> ```r
> n <- 1000
> prize_door <- sample(1:3, n, replace = TRUE)
> contestant_choice <- sample(1:3, n, replace = TRUE)
> decision <- sample(c("stay", "switch"), n, replace = TRUE)
> won <- ifelse(decision == "stay", prize_door == contestant_choice, prize_door != contestant_choice)
> simulation <- data.frame(prize_door, contestant_choice, decision, won)
>
> table(simulation$decision, simulation$won)
> ```
>
> `table()` mit zwei Vektoren zählt jede Kombination. Die Quoten liefern
> `mean(simulation$won[simulation$decision == "stay"])` und dasselbe mit
> `"switch"`: etwa 0,33 und 0,67. Die 100 Spiele liegen mit 0,41 und 0,73 nahe
> daran, eure zehn Runden vermutlich weiter weg; je weniger Runden, desto
> mehr Zufall steckt im Ergebnis.
