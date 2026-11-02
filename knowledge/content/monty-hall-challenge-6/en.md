---
title: "Challenge 6: Showing and placing the answer"
summary: >-
  You show the win rates of the 100 games as a bar chart and place which kind of question your analysis, the simulation and the explanation each answer.
objectives:
  intro: "With this challenge you and your team bring the project to an answer and can then:"
  goals:
    - "explain why switching wins in two cases out of three"
    - "summarise a table per group with dplyr"
    - "draw a bar chart from a summarised table with ggplot2"
    - "assign questions about data to the six types of analytic questions"
translation_of: de
based_on: 2026-11-02
---

Three sources say the same: your own rounds (with a lot of chance), the 100
games and the simulation. Whoever switches wins twice as often.

The reason lies in the first choice. It hits the car in one case out of
three, and exactly then staying wins. In the other two cases out of three
the car is behind one of the other two doors, and since the host knows where
it is, he opens the other one. The door one can switch to is then always the
one with the car. The host's knowledge makes the difference: if he opened a
door at random, sometimes the one with the car, the two remaining doors
would indeed be equally good.

## A plot for the answer

Show the win rate per decision in the 100 games as a bar chart. With dplyr,
`monty_hall` gets the column `won` and is summarised per decision; ggplot2
draws the bars from it, layer by layer.

```r
monty_hall |>
  mutate(won = (decision == "stay") == (prize_door == contestant_choice))
```

> [!SOLUTION]
> ```r
> monty_hall |>
>   mutate(won = (decision == "stay") == (prize_door == contestant_choice)) |>
>   group_by(decision) |>
>   summarise(win_rate = mean(won)) |>
>   ggplot() +
>   aes(x = decision, y = win_rate) +
>   geom_col()
> ```
>
> `(decision == "stay") == (prize_door == contestant_choice)` is a shorter
> form of the rule: whoever's decision fits the first choice has won, that is
> staying after a right choice and switching after a wrong one.

## What kind of question was that?

Assign your questions to the six types from [[analytic-questions]]. "How
often did those who switched win in the 100 games?" is descriptive: it only
describes the 100 games. Which question does the simulation answer, and
which the explanation above of why switching is better?

> [!SOLUTION]
> The simulation generalises beyond the observed games: it says what happens
> in very many games played by these rules, and so resembles an inferential
> question. The explanation via the host's knowledge is mechanistic: it says
> how the result comes about. For a game of chance with fixed rules this can
> exceptionally be settled completely; with real data one usually stays with
> the first types.
