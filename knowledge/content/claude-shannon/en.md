---
title: Claude Shannon
summary: >-
  Showed that circuits can calculate the way logic does, and with the bit
  founded information theory, on which every digital transmission rests.
translation_of: de
based_on: 2026-10-26
---

## Who he is

Claude Elwood Shannon was born in Michigan in 1916, studied mathematics and
electrical engineering, and spent most of his working life at Bell Labs, the
research laboratory of the American telephone company, and at MIT. Two of his
works are among the foundations of computer science: one shows how circuits
can reason logically, the other what information is and how much of it fits
through a line.

## Circuits that calculate

For his master's thesis in 1937, Shannon studied the relays that telephone
exchanges used to switch connections at the time. He noticed that every such
circuit can be described with the algebra George Boole had invented for logic
a hundred years earlier: two switches in a row behave like an AND, two side by
side like an OR. This made it possible to work out and simplify circuits at a
desk instead of trying them out, and, the other way round, to build every
logical rule as a circuit. The [[logic-gates]] that every processor is still
made of rest on this idea.

## What information is

In 1948 Shannon published "A Mathematical Theory of Communication". In it he
separates information from its meaning: how much information a message
carries depends only on how many messages would have been possible and how
likely they are. The smallest unit is the answer to a yes-or-no question, and
for it he used the word **bit**, which his colleague John Tukey had suggested.

Two results follow from this that still govern every transmission. The first:
if some symbols are more frequent than others, they can be written with
shorter codewords, saving bits on average, and Shannon stated how far this
can go at most. With Robert Fano he developed a method for such
[[prefix-free-code|prefix-free codes]]. The second: every line has a
**capacity**. Below this limit, messages can be sent as reliably as you like
despite noise, if they are cleverly given extra check bits; above it, this is
impossible however you go about it.

## Play as a method

Shannon was known for spending time on what looked like toys. He built an
electric mouse called Theseus that found its way through a maze and remembered
it, wrote one of the first papers on how a computer could play chess, and rode
a unicycle through the corridors of Bell Labs while juggling. Many of these
games were serious questions in another form: how a machine learns, how it
plans, how movements can be calculated. He died in Massachusetts in 2001.

## Takeaways

- Switches behave like logical statements, and that is why circuits can
  calculate.
- Information is measured in bits; how much a message contains depends on how
  surprising it is, not on what it means.
- Coding frequent things briefly saves bits, and every line has a capacity up
  to which transmission stays reliable despite noise.
