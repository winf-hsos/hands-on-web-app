---
title: "Shelf Life: a week in an AI agent's corner shop"
summary: >-
  A game for the lecture hall: for one week, an AI agent runs a small food
  shop in the evenings, and you shop there as shared flats on your phones.
  On the projector, every step of the agent can be read along.
objectives:
  intro: "With this game you watch an AI agent at work, and afterwards you can:"
  goals:
    - "describe how an agent uses tools in a loop of reasoning, acting and observing"
    - "name the ways out for food that will not keep until tomorrow and what each of them costs the shop"
    - "argue where you would leave decisions to an agent and where you would not"
translation_of: de
based_on: 2026-11-23
---

In Shelf Life, the Night Shift Agent runs a corner shop that opens from eight
to ten in the evening, six evenings from Monday to Saturday. Its goal carries
a conflict: earn good money and waste as little food as possible. For this it
has eleven tools with which it looks at the shelf, cuts prices, books the
food bank, lets the cashier take something home, throws goods in the bin and
orders for the next day. A language model works behind it, nothing is
scripted, and every evening runs differently.

You play the other side. Every phone is a shared flat with €28 for the whole
week, and at 22:00 your flat cooks automatically with whatever in the fridge
expires first. A complete dinner earns three points, a breakfast one, and
whatever spoils costs a point. Regular customers, played by the computer,
shop next to you, so the game also works with only a few phones.

The game is played in the lecture hall: the projector shows the shop and, on
the right, every step of the agent with its reason, and the evening pauses
before and after every check-in so that everyone can read along. How the
game runs is shown in the [[shelf-life-slides|introduction]], and what
happens inside the agent in the slides [[inside-the-agent-slides]]. The
source code of the game is available under the MIT license on
[GitHub](https://github.com/winf-hsos/shelf-life).
