---
title: "Same Stats, Different Graphs"
summary: >-
  Justin Matejka and George Fitzmaurice use simulated annealing to create
  data sets that share the same statistics and yet give completely different
  pictures, among them the "Datasaurus Dozen".
translation_of: de
based_on: 2026-11-16
---

The paper generalises Anscombe's quartet: instead of building data sets by
hand, a program moves the points of a cloud in small steps towards a target
shape and keeps each step only if the means, standard deviations and
correlation do not change to two decimals. In this way a dinosaur made of
points becomes twelve more pictures with the same statistics, the
"Datasaurus Dozen", and the same method can keep the boxplots the same as
well.

## Why it fits here

The shapes in the demonstrator [[same-stats-demo]] were made afresh for the
platform with this method; the lesson [[why-visualise]] explains what
follows from it for analysing data.
