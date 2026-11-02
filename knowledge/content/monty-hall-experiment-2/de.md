---
type: experiment
code: 3175
title: "Experiment 2: Eure Spiele als Vektoren"
summary: >-
  Ihr spielt das Drei-Türen-Spiel am Rechner, haltet eure Spiele als vier Vektoren in R fest und beantwortet mit je einer Zeile, wie oft die erste Wahl stimmte und wie oft Bleiben und Wechseln gewinnen.
objectives:
  intro: "In diesem Experiment bringst du mit deinem Team eure Spiele nach R und kannst danach:"
  goals:
    - "die Spiele eines Experiments als Vektoren gleicher Länge festhalten"
    - "mit Vergleichen einen logischen Vektor wie `won` bilden"
    - "mit `mean()` Anteile aus einem logischen Vektor berechnen"
    - "mit eckigen Klammern nur die Stellen eines Vektors auswählen, die eine Bedingung erfüllen"
level: 1
duration: 45
topics: [programming-with-r]
areas: [ds]
modules: [ea]
project: monty-hall
status: published
updated: 2026-11-03
---

In der ersten Phase habt ihr festgelegt, was ihr von jedem Spiel festhaltet:
hinter welcher Tür das Auto stand, welche Tür zuerst gewählt wurde, welche
der Moderator geöffnet hat und ob die Person geblieben ist oder gewechselt
hat. Jetzt bekommen diese vier Angaben ihre Form in R. Viele Spiele lassen
sich als vier Vektoren aufschreiben, einer je Angabe, in denen die erste
Stelle immer zum ersten Spiel gehört, die zweite zum zweiten und so weiter.
[[data-representation-slides|Die Folien]] zeigen an genau diesen vier
Angaben, wie R Vektoren hält.

## Spielen

Spielt im [[monty-hall-game|Drei-Türen-Spiel]] mindestens zwanzig Spiele und
wechselt euch dabei ab. Entscheidet nicht immer gleich, sondern bleibt
ungefähr in der Hälfte der Spiele und wechselt in der anderen. Das Spiel
schreibt jede Runde mit und zeigt sie auf Wunsch als R-Code, einen Vektor je
Angabe. Speichert eure Spiele außerdem als CSV und als RDS; die Dateien
braucht ihr in der nächsten Phase.

## Auswerten

Unten stehen zehn Beispielspiele. Ersetzt sie durch eure eigenen: Kopiert den
R-Code aus dem Spiel und fügt ihn statt der vier Zeilen ein.

**Aufgabe:** Beantwortet mit R, jede Frage mit einer Zeile unter den Vektoren:

1. Wie oft lag die erste Wahl schon richtig, als Anteil aller Spiele?
2. Welche Spiele wurden gewonnen? Legt dafür einen Vektor `won` mit `TRUE`
   oder `FALSE` an. Gewonnen hat, wer geblieben ist und gleich richtig lag,
   oder wer gewechselt hat und zuerst falsch lag.
3. Wie viel Prozent aller Spiele wurden gewonnen?
4. In wie viel Prozent der Spiele ist die Person geblieben?
5. Wie oft gewinnt, wer bleibt, und wie oft, wer wechselt?

```r
prize_door <- c(2, 1, 3, 3, 1, 2, 2, 3, 1, 1)
contestant_choice <- c(2, 3, 1, 1, 1, 1, 3, 2, 2, 1)
monty_opens <- c(1, 2, 2, 2, 3, 3, 1, 1, 3, 2)
decision <- c("stay", "switch", "stay", "switch", "switch", "stay", "switch", "stay", "switch", "stay")

length(prize_door)
```

> [!SOLUTION]
> ```r static
> mean(prize_door == contestant_choice)        # 1.: 0.3
>
> won <- (decision == "stay" & prize_door == contestant_choice) |
>   (decision == "switch" & prize_door != contestant_choice)
> mean(won)                                    # 3.: 0.6
> mean(decision == "stay")                     # 4.: 0.5
> mean(won[decision == "stay"])                # 5.: 0.4
> mean(won[decision == "switch"])              # 5.: 0.8
> ```
>
> `mean()` eines logischen Vektors ist der Anteil der `TRUE`, weil R `TRUE`
> als 1 und `FALSE` als 0 rechnet. `won[decision == "stay"]` wählt aus `won`
> nur die Stellen aus, an denen die Person geblieben ist. Zehn oder zwanzig
> Spiele sind allerdings zu wenig, um daraus etwas zu schließen; deshalb
> kommen als Nächstes mehr Daten.
