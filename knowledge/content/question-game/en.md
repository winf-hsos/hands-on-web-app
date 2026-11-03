---
title: Question game
summary: >-
  One of sixteen faces is the secret, and you may only ask yes-or-no
  questions: every answer shrinks the crowd, and the game measures by how
  much in bits.
objectives:
  intro: "With this demo you measure the information of your own questions, and afterwards you can:"
  goals:
    - "work out the information of an answer as I = H₁ − H₂ from the number of faces before and after"
    - "count before a question how well it splits the faces left, and estimate its expected value from that"
    - "argue why halving questions find any of the sixteen faces in four questions"
    - "explain why guessing is mostly the worst question, even though it sometimes hits at once"
translation_of: de
based_on: 2026-11-03
---

**Goal:** Experience that an answer brings as much information as it rules
out possibilities. Sixteen faces mean log₂(16) = 4 bits of uncertainty, and
every question that splits the rest exactly in half removes one bit of it.

**How to use:** Tap a question to ask it, or a face to guess; a guess counts
as a question too. The game does not show how many faces would answer yes,
since counting them is your strategy. After every answer, the panel below the
questions shows how many bits it gained and what the question was worth on
average, so you can tell a well planned question from a lucky one.

```question-game
```
