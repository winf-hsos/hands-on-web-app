---
type: challenge
code: 3175
title: "Challenge 2: Eure Runden in R"
summary: >-
  Ihr schreibt eure Runden als vier Vektoren in R und beantwortet mit je einer Zeile, wie oft die erste Wahl stimmte und wie oft Bleiben und Wechseln gewinnen.
objectives:
  intro: "Mit dieser Challenge bringst du mit deinem Team eure Runden nach R und kannst danach:"
  goals:
    - "Runden eines Experiments als Vektoren gleicher Länge festhalten"
    - "mit Vergleichen einen logischen Vektor wie `won` bilden"
    - "mit `mean()` Anteile aus einem logischen Vektor berechnen"
    - "mit eckigen Klammern nur die Stellen eines Vektors auswählen, die eine Bedingung erfüllen"
level: 1
topics: [programming-with-r]
areas: [ds]
modules: [ea]
project: monty-hall
status: draft
updated: 2026-11-02
---

Eine Runde besteht aus vier Angaben: hinter welcher Tür das Auto stand,
welche Tür zuerst gewählt wurde, welche der Moderator geöffnet hat und ob die
Person geblieben ist oder gewechselt hat. Viele Runden lassen sich deshalb als
vier Vektoren aufschreiben, einer je Angabe, in denen die erste Stelle immer
zur ersten Runde gehört, die zweite zur zweiten und so weiter.
[[data-representation-slides|Die Folien]] zeigen an genau diesen vier
Angaben, wie R Vektoren und Tabellen hält, und reichen bis zur nächsten Phase.

Unten stehen zehn Beispielrunden. Ersetzt sie durch eure eigenen: Kopiert den
R-Code unter dem [[monty-hall-game|Drei-Türen-Spiel]] und fügt ihn statt der vier Zeilen ein.

**Aufgabe:** Beantwortet mit R, jede Frage mit einer Zeile unter den Vektoren:

1. Wie oft lag die erste Wahl schon richtig, als Anteil aller Runden?
2. Welche Runden wurden gewonnen? Legt dafür einen Vektor `won` mit `TRUE`
   oder `FALSE` an. Gewonnen hat, wer geblieben ist und gleich richtig lag,
   oder wer gewechselt hat und zuerst falsch lag.
3. Wie viel Prozent aller Runden wurden gewonnen?
4. In wie viel Prozent der Runden ist die Person geblieben?
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
> nur die Stellen aus, an denen die Person geblieben ist. Zehn Runden sind
> allerdings zu wenig, um daraus etwas zu schließen; deshalb kommen als
> Nächstes mehr Daten.
