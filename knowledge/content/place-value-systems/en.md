---
type: lesson
code: 2045
title: "Place value: what 123 really says"
summary: >-
  Why ten digits are enough for infinitely many numbers, why the ten itself
  is only anatomy, and how the same recipe reads a number in any base.
objectives:
  intro: "This lesson takes our way of writing numbers apart, and afterwards you can:"
  goals:
    - "explain why place value makes ten digits enough for infinitely many numbers"
    - "separate the ten as mere convention from the recipe of digit times place value, which holds in every base"
    - "convert a string of digits from any base to decimal, for example `123` in base 8 to 83"
    - "explain why every base needs the digit 0 and why a string of digits is ambiguous until its base is known"
    - "use kⁿ to work out how many positions a code of k symbols, such as four colours, needs for 26 letters"
level: 1
duration: 15
topics: [representing-information]
modules: [dup]
relations:
  see_also: [petzold-code, ifrah-universal-history-of-numbers]
status: draft
updated: 2026-11-04
---

![Slides: Number systems](item:number-systems-slides)

That `123` means one hundred and twenty-three is an agreement, not a law of
nature. Every place in the number carries a power of ten, the digit says how
often, and the ten itself comes from nothing deeper than the number of
fingers on two hands. This lesson pulls our own notation apart, because it
falls into two pieces: one that is pure convention, and one that is
mathematics and works the same way in every number system. Everything that
follows, bits included, lives in the second piece.

## Why ten?

Ask people why we count to ten and the answers get reverent: because ten
divides nicely, because it works out well mathematically, because that is how
it grew. The true answer is more banal, because we have ten fingers, and that
is all there is to it.

## The place value trick

Take the number `123`. It does not say "one, two, three" but one hundred, two
tens and three ones: every place carries a power of ten, and the digit only
says how often that power occurs.

![In 123, the digit says how often and the place says what. The same digit 1 is worth a hundred at the front and one at the back.](media/place-value-ten.en.svg)

This recipe is called a **place value system**, and it is the only reason ten
digits are enough for infinitely many numbers: instead of inventing a new
symbol for every number, we give the position a meaning. The place values
grow from right to left, so the ones are always at the far right; read the
other way round, the same digits would give 321.

## The creature with eight fingers

Now picture a creature with eight fingers. It invented the same recipe, but
its places run out after eight, and it writes `123` on a sheet of paper. Which
number does it mean? Work it out before you look at the figure.

![The same three digits, the same recipe, powers of eight instead of powers of ten. The creature's 123 is our 83.](media/place-value-eight.en.svg)

The digits are the same and the procedure is the same, but the number is
not. A string of digits means nothing at all until you know the base it was
written in, which is why programmers write it next to the number when there
is any doubt, as in 123₈ or `0x7B`.

## Any base

The recipe works with every base from two upwards. A base *b* has the digits
0 to *b* − 1, so base 8 uses 0 to 7 and base 2 only 0 and 1, and the places
are worth 1, *b*, *b*², *b*³ and so on from the right. To read a number, you
multiply every digit by the value of its place and add everything up. Every
base can represent every number; a smaller base only needs more places for
it. The digit 0 is needed in every base, because without it an empty place
could not be told apart from a missing one.

> [!TIP]
> If you find yourself learning a new rule for a new base, stop: there is
> none. It is always digit times place value, added up.

## Digits do not have to look like digits

A digit is only a symbol that stands for a value by agreement. If you can
reliably tell four colours apart, you have four digits, and agreeing which
colour stands for which value is enough to make a sequence of colours a number
in base 4.

![Three colour positions with four possible colours each. The place values are 16, 4 and 1, exactly as in any other base, and red-yellow-green reads as 13.](media/colours-as-digits.en.svg)

Two things follow from this, and they hold for every code of this kind. The
order is part of the message: red-yellow-green and green-yellow-red are
different code words, for exactly the reason that 123 and 321 are different
numbers. And the arithmetic runs both ways: with *k* symbols and *n* positions
you can distinguish *k*ⁿ code words, so if you know how many characters you
need, you can work out how many positions that costs. Four colours and two
positions give 16 combinations, which is not enough for 26 letters; three
positions give 64, which is.

## In short

Ten was never special: it is the number of fingers on two hands, and nothing
else. The recipe of digit times place value is what counts, and it carries
straight on to [[binary-numbers|the binary numbers]] a computer works with.

![Quiz: Number systems](item:number-systems-quiz)
