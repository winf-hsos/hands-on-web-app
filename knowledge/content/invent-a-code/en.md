---
type: experiment
code: 8604
title: Invent a code
summary: >-
  With paper, a pen and four symbols, invent a code for the 26 letters,
  compare how many symbols a word costs in every proposal, and then send a
  word without gaps and see whether the others can still read it.
objectives:
  intro: "In this experiment you invent a code together with others, without a computer, and afterwards you can:"
  goals:
    - "work out how many positions a code with four symbols needs for 26 letters, and explain why three are enough and two are not"
    - "compare codes of fixed and of variable length by the number of symbols a word costs"
    - "show with your own table why a code of variable length can become ambiguous when the symbols are sent without gaps"
    - "change a table so that it can be read without gaps, and say what the change costs"
level: 1
duration: 30
topics: [representing-information]
modules: [dup]
relations:
  see_also: [code-systems, prefix-trap, morse-code]
status: draft
updated: 2026-11-06
---

A code is an agreement about which sequence of symbols stands for which
letter, and anyone can invent one in a few minutes. In this experiment you do
exactly that, with four symbols and nothing but paper, and compare your
proposal with those of the others. Most proposals work when the letters are
written down with gaps between them. The interesting moment comes when the
gaps disappear, as they do on any wire, where the receiver only sees one
symbol after another.

## What you need

- paper and a pen for every person, and a board or a large sheet for the group
- four symbols that are easy to write and to tell apart; this page uses the
  four colours red, green, blue and yellow, written `R`, `G`, `B` and `Y`
- a group of three or more; the experiment works just as well with a whole
  class at the board

## Step 1: invent a code

Work alone or in pairs for five minutes. Give each of the 26 letters its own
sequence of the four symbols and write the table down. There are only two
rules: no two letters may have the same sequence, and somebody who has your
table must be able to read a word written in your code. Everything else is up
to you, including whether all sequences have the same length.

1. How many different sequences can you form with one position, with two and
   with three? How many positions does a code need in which every letter has
   the same length?

> [!SOLUTION]
> Four symbols give 4 sequences with one position, 4 × 4 = 16 with two and
> 4 × 4 × 4 = 64 with three. Sixteen are too few for 26 letters, so a code
> with a fixed length needs three positions, and 38 sequences stay free.

## Step 2: what a word costs

Agree on a word of about ten letters that nobody has to spell out, such as
`ASSISTANCE`, and write it in your code. Collect on the board how many symbols
the word costs in every proposal.

2. Whose proposal is the shortest, and what did its authors do differently?
3. How long is the word in every code in which all letters have three
   positions? Does it depend on the word?

> [!SOLUTION]
> With three positions per letter every word of ten letters costs 30 symbols,
> whatever the letters are. Proposals below that give some letters shorter
> sequences, with one or two positions, and they gain most when they give the
> short sequences to the letters that come up most often in text. In
> `ASSISTANCE` nine of ten letters belong to the most frequent ones in English
> and in German, so a code with two positions for these and four for the rest
> needs 9 × 2 + 4 = 22 symbols. Morse code follows the same idea: the most
> frequent letter, E, is a single dot.

## Step 3: send without gaps

Take the shortest proposal with sequences of different length. One person
picks a short word in secret, writes it in this code as one continuous row
of symbols without any gap, and the others try to read it with the table.

4. Do all of them read the same word? If not, write down every reading that
   fits the table.
5. Where exactly does it go wrong? Look for two sequences in the table of
   which one is the beginning of the other.

> [!SOLUTION]
> A typical short proposal gives `A = R`, `B = G`, `C = B`, `D = Y` and then
> `E = RR`, `F = RG` and so on. Written with gaps, `RR` is clearly an E;
> without gaps nobody can tell whether `RR` is one E or two A. The fault is
> not that the sequences differ in length, but that the sequence of A is the
> beginning of the sequence of E: once the receiver has read an `R`, it does
> not know whether the letter has already ended. The demonstrator
> [[prefix-trap]] lists every reading of such a row of bits automatically.

## Step 4: repair the table

Change the shortest proposal so that a row without gaps can be read in only
one way, and count again what the word from step 2 costs.

6. What did you change, and how many symbols does the word cost now compared
   with the code of three positions?

> [!SOLUTION]
> There are three ways out, and each costs something. With a fixed length of
> three positions the receiver simply counts, and the word costs 30 symbols. A
> separator, a fifth symbol or a pause as in Morse code, makes the row
> readable but costs one extra symbol after every letter. The third way keeps
> the different lengths but makes sure that no sequence is the beginning of
> another, for example by giving ten frequent letters two positions that
> start with `R`, `G` or `B` and all other letters four positions that start
> with `Y`; then `ASSISTANCE` still needs only 22 symbols.

## Evaluation

- Which proposal would you choose for a link that has to transmit any text,
  and which would you choose if it only ever transmits English or German?
- Why did nobody notice the ambiguity as long as the words were written with
  gaps?
- What would the receiver have to know about your code that is not in the
  table, for example where a message begins?
- Why is a code that saves symbols harder to get right than one that does not?

Why every code is an agreement that both sides must write down in the same
way, and how ASCII and UTF-8 answer the same questions as your table, is
shown in the lesson [[code-systems]].

> [!NOTE]
> With a whole class at the board, collect three or four proposals of
> different length, write their cost for the same word next to each other,
> and then let one person send a word in the shortest of them without gaps.
> The class usually finds several readings within a minute, and nobody has to
> explain beforehand why a code needs a fixed length or a separator.
