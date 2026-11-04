---
type: experiment
code: 7882
title: Be the agent
summary: >-
  Your group plays an AI agent with cards instead of a computer: one of you is
  the language model, one carries the messages, four are the tools, and one
  keeps the log.
objectives:
  intro: "In this experiment you run by hand the loop that every AI agent runs on, and afterwards you can:"
  goals:
    - "run the loop of thinking, acting and observing with cards and say which step happens where"
    - "tell what the model does, what the tools do and what the harness carries between them"
    - "explain why the model knows only what is in its context and why its work can only be as good as the results that reach it"
    - "compare your log with the log of a real agent and recognise the same rounds and tool calls"
level: 1
duration: 60
topics: [ai-agents]
relations:
  see_also: [ai-agents]
modules: [aai]
areas: [ai]
status: draft
updated: 2026-11-04
---

An AI agent is a large language model (LLM) that can only write text:
everything it does in the world happens through tools, which a program around
it, the harness, runs on its behalf. The model knows only what is in its
context, so its work can only be as good as the results that reach it. In this
game your group plays such an agent with cards instead of a computer, and by
the end you will have run by hand the loop that every AI agent runs on.

![A table during the game, seen from above: the card for Task 2, pink TOOL cards and grey RESULT cards written by hand, the system card and stacks of blank cards](media/game-table.jpg "A group in the middle of Task 2: the cards the Model has written lie in pink next to the grey results the tools have sent back, and every card on the table is one step of the agent.")

The slides lead through the game: the roles, the cards, the rules, the three
tasks and what you just played.

![Slides: Be the agent](item:be-the-agent-slides)

## What you need

- A group of seven; with five or six, one person takes two roles.
- [The cards](media/be-the-agent-cards.pdf), seven A4 sheets to cut along the
  dashed lines; print the sheet with blank cards several times, because a game
  uses twenty or more.
- [The Observer's sheet](media/be-the-agent-observer.pdf), one per group and
  task, with room for 22 rounds and the counts at the end.
- A pen for everyone, a calculator and room for the tools to sit apart from
  the Model.

All farm data and web pages are invented for this game and are not advice for
real fertilisation.

![The Observer's sheet: a table with the columns round, card, tool, what it said and note, and a box for the counts at the end](media/be-the-agent-observer.svg "The Observer's sheet, one per group and task.")

## Steps

1. Hand out the role cards; the Model's stack starts with the system card and
   Task 1 on top.
2. Play Task 1, then swap roles and play Task 2.
3. The Observer reads the log aloud: rounds, tool calls per tool, errors and
   cards on the stack.
4. Play Task 3 if there is time, then compare your log with the log of a real
   agent.

While you play, four rules apply:

- The Model sees only its stack of cards, and nobody talks to it.
- It writes one card at a time, starting with `THINK:`, `TOOL:` or `ANSWER:`.
- The Harness carries every `TOOL:` card to the right tool and brings back the
  `RESULT:` card.
- A tool does exactly what the card says, nothing more, and never guesses what
  was meant.

![Close-up of the same table: handwritten TOOL cards such as open and calculator next to the RESULT cards from the tools](media/game-table-close.jpg "Close-up of the same table: the Model's TOOL cards next to the RESULT cards the tools wrote back.")

## Extensions

Each extension changes the game in one respect, so that you can compare the
result with your first round.

1. **Limited memory:** the stack holds at most eight cards, and a `SUMMARY:`
   card replaces the oldest ones when it is full.
2. **Two tools at once:** the Model may write two tool cards per turn, which
   the Harness carries in parallel.
3. **A new tool:** someone becomes `forecast("date")`, added to the system
   card, and you watch whether the Model uses it unprompted.
4. **A wrong result:** one tool secretly returns a wrong value, and you find
   out whether the Model notices.
5. **Be the tool for a chatbot:** solve Task 2 with a chatbot in your browser,
   supplying every file, page and calculation yourself.

## Discussion

Write down your own answers first, then discuss them in your group.

1. In which round would the Model have been stuck without the tools, and which
   tool was used most?
2. What would have gone differently if the Model had had to give up its stack
   after ten cards?
3. Who did the thinking, who did the acting, and which of it could the Model
   actually do?

What you just ran by hand, the loop of thinking, acting and observing, is the
subject of [[ai-agents]].
