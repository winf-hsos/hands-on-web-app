---
type: challenge
code: 5947
title: "Challenge 4: Das Spiel als Funktion"
summary: >-
  Ihr schreibt eine Funktion, die eine Runde des Spiels spielt, und lasst R damit zehntausend Runden mit Bleiben und mit Wechseln spielen.
objectives:
  intro: "Mit dieser Challenge baust du mit deinem Team das Spiel in R nach und kannst danach:"
  goals:
    - "mit `sample()` zufällig ziehen und die Stolperstelle bei einer einzelnen Zahl umgehen"
    - "mit `setdiff()` die Türen bestimmen, die noch in Frage kommen"
    - "eine Funktion schreiben, die eine Runde eines Experiments spielt"
    - "mit `replicate()` ein Experiment viele Male wiederholen und die Ergebnisse auswerten"
level: 1
topics: [programming-with-r]
areas: [ds]
modules: [ea]
project: monty-hall
status: draft
updated: 2026-11-02
---

Hundert Spiele sind ein Anfang, aber noch kein Beweis. R kann das Spiel
selbst spielen, so oft ihr wollt: Das Auto kommt hinter eine zufällige Tür,
die Person wählt eine zufällige Tür, und der Moderator öffnet eine Tür, die
weder gewählt ist noch das Auto verbirgt.

Für den Zufall gibt es `sample()`. `sample(1:3, 1)` zieht eine der Zahlen 1
bis 3. Eine Stolperstelle gibt es dabei, und zwar genau beim Moderator: Bleibt
ihm nur eine Tür, etwa Tür 3, dann zieht `sample(3, 1)` nicht die 3, sondern
eine Zahl aus `1:3`, weil R eine einzelne Zahl als „von 1 bis hier“ liest.

```r
sample(3, 1)
```

Sicher zieht man aus einem Vektor `doors` deshalb mit
`doors[sample(length(doors), 1)]`: Gezogen wird eine Stelle, nicht ein Wert.

## Eine Runde

Schreibt eine Funktion `play_round()`, die eine Runde spielt. Sie bekommt
`"stay"` oder `"switch"` und gibt `TRUE` zurück, wenn die Runde gewonnen
ist. `setdiff(a, b)` liefert die Werte aus `a`, die nicht in `b` stehen;
damit findet ihr die Türen, die der Moderator öffnen darf, und die Tür, zu
der man wechselt.

```r
play_round <- function(decision) {
  doors <- 1:3
  prize_door <- sample(doors, 1)
  contestant_choice <- sample(doors, 1)
  # Welche Türen darf der Moderator öffnen, und welche öffnet er?
  # Welche Tür hat die Person am Ende?
  # Hat sie gewonnen?
  FALSE # ersetzt das durch euer Ergebnis
}

play_round("switch")
```

> [!SOLUTION]
> ```r
> play_round <- function(decision) {
>   doors <- 1:3
>   prize_door <- sample(doors, 1)
>   contestant_choice <- sample(doors, 1)
>   options <- setdiff(doors, c(prize_door, contestant_choice))
>   monty_opens <- options[sample(length(options), 1)]
>   if (decision == "switch") {
>     final_choice <- setdiff(doors, c(contestant_choice, monty_opens))
>   } else {
>     final_choice <- contestant_choice
>   }
>   final_choice == prize_door
> }
>
> play_round("switch")
> ```
>
> Lag die erste Wahl richtig, bleiben dem Moderator zwei Türen, sonst nur
> eine; genau dafür braucht es das sichere Ziehen von oben.

## Zehntausend Runden

Spielt mit eurer Funktion 10.000 Runden mit Wechseln und 10.000 mit Bleiben.
Wie oft gewinnt jede Strategie? `replicate(n, ausdruck)` wertet einen
Ausdruck `n`-mal aus und sammelt die Ergebnisse in einem Vektor; eine
`for`-Schleife ginge auch, braucht aber mehr Zeilen.

```r
# Kopiert eure Funktion play_round() aus „Eine Runde“ hierher.
replicate(5, sample(1:3, 1))
```

> [!SOLUTION]
> ```r
> play_round <- function(decision) {
>   doors <- 1:3
>   prize_door <- sample(doors, 1)
>   contestant_choice <- sample(doors, 1)
>   options <- setdiff(doors, c(prize_door, contestant_choice))
>   monty_opens <- options[sample(length(options), 1)]
>   if (decision == "switch") {
>     final_choice <- setdiff(doors, c(contestant_choice, monty_opens))
>   } else {
>     final_choice <- contestant_choice
>   }
>   final_choice == prize_door
> }
>
> c(
>   stay = mean(replicate(10000, play_round("stay"))),
>   switch = mean(replicate(10000, play_round("switch")))
> )
> ```
>
> Bleiben gewinnt in etwa einem Drittel der Runden, Wechseln in etwa zwei
> Dritteln. Die Zahlen schwanken von Lauf zu Lauf ein wenig, bei 10.000
> Runden aber kaum noch.
