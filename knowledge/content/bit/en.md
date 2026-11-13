---
type: term
code: 3361
title: Bit
summary: >-
  A binary digit, 0 or 1, and at the same time the unit of information: the
  answer to one yes/no question whose two answers are equally likely.
objectives:
  intro: "Once you know the term bit, you can:"
  goals:
    - "describe a bit both as a binary digit with the values 0 and 1 and as the unit of information"
    - "explain why a binary digit carries at most one bit of information and sometimes less"
    - "work out that n bits tell 2ⁿ cases apart"
level: 1
duration: 5
topics: [representing-information]
modules: [dup]
relations:
  see_also: [place-value-systems, byte, claude-shannon]
status: published
updated: 2026-11-01
---

## Definition

A **bit** is a place in a [[place-value-systems|binary number]], which can hold one
of two values, written 0 and 1. The word is short for *binary digit*.

## Two meanings, one word

The word has a second meaning that is just as common: the bit is the unit in
which information is measured. One bit is what you learn from the answer to a
yes/no question whose two answers are equally likely, such as the toss of a
coin.

The two meanings fit together, and the shared name is no accident: a binary
digit can take exactly two values and therefore holds exactly one yes/no
answer, so the container is named after what goes into it. The distinction is
still worth keeping, because a container can be half empty. A binary digit
whose value is almost certain in advance carries less than one bit of
information, and compression saves digits precisely where that happens.

## Where the word comes from

[[claude-shannon|Claude Shannon]] used the word in print in 1948, in the paper
that founded information theory, and credited the statistician John W. Tukey
with coining it.

## Examples

- One bit tells two cases apart, two bits four, and *n* bits 2ⁿ.
- Eight bits form a [[byte]] with 256 possible values.
- A light that is either on or off at a given moment shows one binary digit.
