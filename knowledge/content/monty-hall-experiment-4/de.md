---
type: experiment
code: 5947
title: "Experiment 4: Das Spiel als Simulation"
summary: >-
  Ihr baut das Spiel in zwei Schritten in R nach: erst ein Spiel als Funktion, dann eine Simulation, die tausend Spiele als Datensatz erzeugt, den ihr auswertet und herunterladet.
objectives:
  intro: "In diesem Experiment baut ihr das Spiel in R nach und könnt danach:"
  goals:
    - "mit `sample()` zufällig ziehen und die Stolperstelle bei einer einzelnen Zahl umgehen"
    - "mit `setdiff()` die Türen bestimmen, die noch in Frage kommen"
    - "eine Funktion schreiben, die ein Spiel spielt und es als Zeile einer Tabelle zurückgibt"
    - "ein Experiment mit `lapply()` und `bind_rows()` viele Male wiederholen, sodass ein Datensatz mit einer Zeile je Spiel entsteht"
    - "einen Datensatz mit `write.csv()` und `saveRDS()` speichern"
level: 1
duration: 60
topics: [programming-with-r, getting-data]
areas: [ds]
modules: [ea]
project: monty-hall
status: published
updated: 2026-11-03
---

Hundert Spiele sind ein Anfang, aber noch kein Beweis. R kann das Spiel
selbst spielen, so oft ihr wollt: Das Auto kommt hinter eine zufällige Tür,
die Person wählt eine zufällige Tür, und der Moderator öffnet eine Tür, die
weder gewählt ist noch das Auto verbirgt. Ihr baut das in zwei Schritten:
erst ein einzelnes Spiel als Funktion, dann eine Simulation, die diese
Funktion tausendmal aufruft und daraus einen Datensatz macht, der aussieht
wie [[lets-make-a-deal]], nur zehnmal so groß.

## Schritt 1: Ein Spiel als Funktion

Für den Zufall gibt es `sample()`. `sample(1:3, 1)` zieht eine der Zahlen 1
bis 3. Eine Stolperstelle gibt es dabei, und zwar genau beim Moderator: Bleibt
ihm nur eine Tür, etwa Tür 3, dann zieht `sample(3, 1)` nicht die 3, sondern
eine Zahl aus `1:3`, weil R eine einzelne Zahl als „von 1 bis hier“ liest.

```r
sample(3, 1)
```

Sicher zieht man aus einem Vektor `doors` deshalb mit
`doors[sample(length(doors), 1)]`: Gezogen wird eine Stelle, nicht ein Wert.

Schreibt eine Funktion `play_game()`, die ein Spiel spielt. Sie bekommt
`"stay"` oder `"switch"` und gibt das Spiel als Tabelle mit einer Zeile
zurück, mit denselben Spalten wie die 100 Spiele und dazu `won`.
`setdiff(a, b)` liefert die Werte aus `a`, die nicht in `b` stehen; damit
findet ihr die Türen, die der Moderator öffnen darf, und die Tür, zu der man
wechselt.

```r
play_game <- function(decision) {
  doors <- 1:3
  prize_door <- sample(doors, 1)
  contestant_choice <- sample(doors, 1)
  # Welche Türen darf der Moderator öffnen, und welche öffnet er?
  # Welche Tür hat die Person am Ende?
  # Hat sie gewonnen?
  monty_opens <- NA # ersetzt das durch eure Tür
  won <- FALSE # und das durch euer Ergebnis
  tibble(prize_door, contestant_choice, monty_opens, decision, won)
}

play_game("switch")
```

> [!SOLUTION]
> ```r
> play_game <- function(decision) {
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
>   won <- final_choice == prize_door
>   tibble(prize_door, contestant_choice, monty_opens, decision, won)
> }
>
> play_game("switch")
> ```
>
> Lag die erste Wahl richtig, bleiben dem Moderator zwei Türen, sonst nur
> eine; genau dafür braucht es das sichere Ziehen von oben. `tibble()` macht
> aus den Werten eine Zeile, deren Spalten so heißen wie die Namen.

## Schritt 2: Die Simulation als Datensatz

Schreibt eine Funktion `simulate_games(n)`, die `n` Spiele spielt und sie
als einen Datensatz mit einer Zeile je Spiel zurückgibt. Die Entscheidung
soll dabei zufällig sein, bleiben oder wechseln. Zwei Werkzeuge helfen:
`lapply(x, f)` ruft `f` für jeden Wert von `x` auf und sammelt die Ergebnisse
in einer Liste, und `bind_rows()` stapelt eine Liste von Tabellen zu einer.
Simuliert damit 1.000 Spiele und berechnet, wie oft Bleiben und wie oft
Wechseln gewinnt.

```r
# Kopiert eure Funktion play_game() aus Schritt 1 hierher.

decisions <- sample(c("stay", "switch"), 5, replace = TRUE)
decisions
```

> [!SOLUTION]
> ```r
> play_game <- function(decision) {
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
>   won <- final_choice == prize_door
>   tibble(prize_door, contestant_choice, monty_opens, decision, won)
> }
>
> simulate_games <- function(n) {
>   decisions <- sample(c("stay", "switch"), n, replace = TRUE)
>   bind_rows(lapply(decisions, play_game))
> }
>
> simulation <- simulate_games(1000)
> simulation |>
>   group_by(decision) |>
>   summarize(games = n(), rate = mean(won))
> ```
>
> Bleiben gewinnt in etwa einem Drittel der Spiele, Wechseln in etwa zwei
> Dritteln. Die Zahlen schwanken von Lauf zu Lauf ein wenig, bei 1.000
> Spielen aber nur noch um wenige Prozentpunkte. Die 100 Spiele liegen mit 41
> und 73 Prozent nahe daran, eure eigenen Spiele vermutlich weiter weg; je
> weniger Spiele, desto mehr Zufall steckt im Ergebnis.

Überlegt dabei: Warum hängt `won` am Ende gar nicht davon ab, welche Tür der
Moderator öffnet?

> [!SOLUTION]
> Wer wechselt, landet immer auf der Tür, die weder gewählt noch geöffnet
> ist. Lag die erste Wahl falsch, ist das die Tür mit dem Auto, denn die
> andere falsche hat der Moderator ja geöffnet. Wechseln gewinnt also genau
> dann, wenn die erste Wahl falsch war, und das entscheidet sich, bevor der
> Moderator etwas öffnet. Weil die erste Wahl in zwei von drei Spielen falsch
> ist, gewinnt Wechseln in zwei von drei Spielen.

## Den Datensatz mitnehmen

Speichert eure Simulation als CSV und als RDS. Im Kasten erscheinen danach
die beiden Dateien zum Herunterladen; am eigenen Rechner liegen sie im
Arbeitsverzeichnis, und dort geht statt `write.csv()` auch `write_csv()` aus
dem Tidyverse.

```r
# Kopiert play_game() und simulate_games() hierher.

simulation <- simulate_games(1000)
write.csv(simulation, "monty_hall_simulation.csv", row.names = FALSE)
saveRDS(simulation, "monty_hall_simulation.rds")
```

Welche der beiden Dateien behält, dass `won` ein Wahrheitswert ist und
`decision` Text? Lest beide wieder ein und vergleicht mit `glimpse()`.

> [!SOLUTION]
> Die RDS-Datei hält die Tabelle so, wie R sie im Speicher hat, mit allen
> Typen; `readRDS()` gibt genau dasselbe Tibble zurück. Die CSV-Datei ist
> reiner Text, den jedes Programm lesen kann; welchen Typ eine Spalte hat,
> errät `read_csv()` beim Einlesen neu. Bei diesen Spalten gelingt das, bei
> einem Faktor ginge die Reihenfolge seiner Stufen verloren.
