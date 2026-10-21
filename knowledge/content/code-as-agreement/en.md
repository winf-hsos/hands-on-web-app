---
title: A code is an agreement
summary: >-
  Why the same eight bits can be a letter, a number or a shade of grey, and
  why a code means nothing without its table.
translation_of: de
based_on: 2026-10-21
---

## What this is about

Inside a computer there are no letters, colours or sounds, only sequences of
states that we write down as zeros and ones. That `01000001` turns into an A on
your screen has nothing to do with the bits themselves; it is the work of a
table that people agreed on at some point. This lesson is about such tables:
what they do, how large they have to be and what happens when two sides do not
use the same one.

## A code maps

A **code** assigns a sequence of symbols to each character of a given set.
That is the whole definition. The symbols can be bits, but also short and long
tones, colours or hand signals; all that matters is that sender and receiver
know the same mapping.

| Character | ASCII (decimal) | ASCII (binary) |
|---|---|---|
| A | 65 | `01000001` |
| B | 66 | `01000010` |
| a | 97 | `01100001` |

The best-known table of this kind is ASCII from the 1960s. In it, capital A is
number 65, not because A is the 65th letter but because the first places in the
table are reserved for control characters. Lower-case a is number 97, and to
the computer it is an entirely different character that merely looks related
to us.

> [!NOTE]
> A code is not encryption. A code table is published on purpose so that
> everyone can use it, whereas encryption is meant to hide something.

## The same bits, different meanings

Take the byte `01000001`. Read as text it is an A, read as a number it is 65,
and in a greyscale image it is a fairly dark grey, because 65 out of 255
possible brightness levels lies towards the dark end. None of these readings is
more correct than the others, since which one applies is decided only by the
program reading the bits and the table it uses.

This leads to a rule you will meet again and again when programming: **data
does not carry its meaning with it.** A file opened with the wrong program is
not broken; it is just being read with the wrong table.

## How large must a table be?

Suppose you want to transmit the 26 letters of the alphabet with only four
symbols, say four colours. With a single symbol per letter you get four code
words, with two symbols 4 · 4 = 16, and with three symbols 4 · 4 · 4 = 64. In
general, *k* different symbols and *n* positions give *kⁿ* possible code words.

So two positions are not enough for 26 letters, while three are. The 38 code
words left over are not waste but a reserve for spaces, digits and punctuation
you may want to add later.

## When two tables disagree

The most dangerous mistake with codes produces no error message. If sender and
receiver have two tables that differ in a single entry, the receiver looks up
every incoming code word, finds a valid letter each time and assembles a word
that looks like a word. *Sonne* might become *Somme*, and no program notices,
because technically nothing went wrong.

That is why every code needs one single table that both sides use. If a
program needs the reverse direction, from code word to character, it should
compute it from the first table rather than write it down a second time by
hand.

## Characters that are not in the table

Every table is finite, and sooner or later someone wants to send a character
that is not in it, such as a space or an Ü. ASCII had exactly this problem with
every language except English, and the answer was Unicode, a table with room
for well over a hundred thousand characters.

For your own programs there are three defensible answers: add the character to
the table, remove it before sending, or reject it with a clear message. Making
no decision is the only answer that is not defensible, because then chance
decides.

## Key points

- A code maps characters to sequences of symbols, and it works only if both
  sides use the same mapping.
- With *k* symbols and *n* positions there are *kⁿ* code words.
- Wrong tables do not cause errors; they cause wrong results that look right.

How the receiver can tell where one code word ends and the next begins is the
subject of [[prefix-free-code|the term prefix-free code]].
