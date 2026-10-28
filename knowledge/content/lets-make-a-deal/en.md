---
title: "Let's Make a Deal: 100 games with three doors"
summary: >-
  Where was the car, which door did the contestant pick, which did the host
  open, and did the contestant stay or switch? A small, clean data set for the
  first steps with vectors and data frames.
translation_of: de
based_on: 2026-10-28
---

## What this is about

Each row is a game played by the rules of the game show "Let's Make a
Deal": a car stands behind one of three doors, the contestant picks a door,
the host opens another one that does not hide the car, and the contestant
stays with the first pick or switches to the last closed door. The data are
in the repository for the data analytics courses linked below and belong to
the project [[monty-hall]].

| Column | Content |
|---|---|
| `contestant` | first name of the contestant; some play more than once |
| `prize_door` | the door with the car behind it, `1` to `3` |
| `contestant_choice` | the door the contestant picks first |
| `monty_opens` | the door the host opens |
| `decision` | `stay` or `switch` |

Whether a game was won is not in the table. It follows from the other
columns, and working it out is one of the first tasks in the project.

## What to look out for

- **The data are complete and consistent.** No value is missing, and the
  host never opens the door with the car or the one that was picked. That
  makes them a good start, before messy data come along.
- **Few contestants switch.** Only a good quarter of the games end with a
  switch, so the two groups being compared rest on different numbers of
  games.
- **A hundred games are not many.** The project therefore checks what the
  data suggest with a simulation of many thousands of games.
