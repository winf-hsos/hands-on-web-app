---
title: "Exercise: Sharpening your own research question"
summary: >-
  From your group's special topic through three ideas to a research question
  the survey can answer: six specifications, four traps and the reality check
  against the codebook with the course assistant.
objectives:
  intro: "In this exercise your group turns its special topic into a research question for the paper, and afterwards you can:"
  goals:
    - "find the questions in the codebook that belong to a topic and say whom they were asked"
    - "derive several ideas for questions from a topic and pick the one that holds best"
    - "sharpen an idea into a precise question through the six specifications and check it against the two conditions and the four traps"
    - "hold your question against the codebook with the course assistant and check its answer yourselves"
    - "record the chosen version with its columns, filters and numbers of cases and explain what you changed"
translation_of: de
based_on: 2026-11-11
---

Every group starts with a special topic, such as plant-based drinks, organic
food or meat consumption, and a topic is not yet a question. In this
exercise you go the way from the lesson
[[research-questions|What is a research question?]] once on your own topic:
from the topic through several ideas to a question that the
[[milk-chocolate-survey|survey on milk and chocolate]] can answer. You work
as a group and with the [[opencode-course-assistant|course assistant]] in
your course folder, which knows the codebook. Keep your results in a shared
note, because in the end the question goes into the paper.

## Part 1: From topic to ideas

1. Write down your special topic in one sentence and let the course
   assistant show you what the survey has on it:

   ```text
   Our special topic is <your topic>. Which questions in the codebook belong
   to it? For each, give the column, the question text in short and whom
   the question was asked. Do not calculate anything.
   ```

2. From this list, write down three ideas for questions, of different kinds
   where possible: a descriptive one ("how many, how often"), one about a
   relationship ("do groups differ") and, if your topic touches one of the
   survey's experiments, a causal one.

3. Choose the idea that interests you most and for which the survey has the
   most columns. Note in one sentence why the answer says something about
   how people shop or eat.

> [!HINT]
> Most questions of the survey were not asked to everyone. An idea whose
> most important column only a few dozen respondents answered will not
> carry a paper, however exciting it sounds. In this survey, causal
> questions can only be answered for the experiments in which chance
> assigned the variant, such as the price levels of Alpro oat drink.

## Part 2: Sharpening an idea

4. Make the six specifications for your idea. Copy this table into your
   note and fill in the right column:

   | Specification | your question |
   |---|---|
   | who | |
   | where | |
   | when | |
   | what varies | |
   | what you measure | |
   | what you compare | |

   Then write the question in one sentence that contains all six
   specifications.

5. Check the question yourselves against the two conditions: can it be
   answered with evidence, and would an unexpected result change your mind?
   Then go through the four traps (normative, vague, causal without a
   design, not in the data) and rebuild the question wherever it falls into
   one of them.

> [!HINT]
> This is what the way can look like. The topic "organic food" leads to the
> idea "What influences buying organic food?", which is a research
> programme, not a question for a paper. With the six specifications it
> becomes: "Does the share of their food that respondents buy organic differ
> between respondents in a big city and respondents in a village?" The
> columns for it are `v032bioanteil` and `D044stadtf`, and because the
> question asks about a relationship, in the end you may speak of a
> difference, but not of the big city being its cause.

## Part 3: The reality check

6. Give your question to the course assistant with the command
   `/research-question` and write it directly after it:

   ```text
   /research-question <your question>
   ```

   It classifies the question, checks it by the standards of the lesson,
   looks up the column in the codebook for every part, with filter and
   number of cases, and gives a verdict: answerable, adjust or discard. If
   the command is missing in your course folder, get it with
   `/update-semester`, or paste the prompt from the exercise in the lesson.

7. Check its answer before you take anything over: look up every column it
   names in the codebook yourselves, read the question text and compare the
   filter and the number of cases. If a column measures something other
   than what your question needs, adjust the question, not your reading of
   the column.

8. If the assistant's verdict is "adjust" or "discard", choose one of its two
   sharpened versions or write your own, and repeat step 6 with it until
   the verdict is "answerable".

## Part 4: Recording the question

9. Record in your note:
   - the sharpened question in one sentence,
   - the columns that answer it, each with filter and number of cases,
   - what you changed compared with the first version, and why.

10. Write the question where the paper needs it: if your paper already
    exists, at the end of the introduction in
    `my-code/paper/sections/_introduction.qmd`; otherwise you enter it when
    you create the paper in the exercise
    [[quarto-paper-exercise|Setting up your own paper with Quarto]].

## What comes next

Your question may still change once you start the analysis, because some
things only show in the data. If it changes, repeat the reality check and
record what you changed and why; the paper ends up stating the question you
actually answered.
