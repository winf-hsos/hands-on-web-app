---
title: The Monty Hall Problem
summary: >-
  Switch or stay? With a famous guessing game you learn to record an
  experiment as data, rebuild it in R and play it so often that the data give
  an answer hardly anyone expects.
translation_of: de
based_on: 2026-10-27
---

On a game show there are three doors. Behind one waits a car, behind each of
the other two a goat. You choose a door, and the host, who knows where the
car is, then opens one of the other two, always one with a goat. Then he asks
whether you stay with your door or switch to the other closed one.

Most people are sure that it makes no difference, since two doors are left.
Whether that is true is something you find out in this project not by
thinking but with an experiment: you play, record every round as data and
let R repeat the game so often that the answer no longer depends on chance.

Along the way you learn what every data analysis needs: how to write down an
experiment so that it can be analysed, what such data look like in R and how
a few lines of code run an experiment as often as you like.

## Playing the game by hand {#play}

In pairs, with three cards, one of which is the car: one person hosts, the
other plays. Play a few rounds, sometimes switching and sometimes not, and
note how each round ends.

## A round as data {#record}

What do you have to write down about a round so that the question can be
answered later? You decide which variables describe a game and what a table
looks like in which every round is one row.

## Rebuilding the game in R {#simulate}

You describe one round in R, with chance deciding the car and the first
choice, and then let it run a thousand times. The result is a table with the
same shape as your notes by hand, only much longer.

## Analysing {#analyse}

How often does someone who switches win, and how often someone who stays?
You compare your rounds by hand with the simulation and consider which kind
of question you have answered.
