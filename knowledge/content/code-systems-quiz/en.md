---
title: "Quiz: codes and code words"
summary: Four questions about code tables, their size and unambiguous code words.
objectives:
  intro: "This quiz lets you check in four questions whether you can:"
  goals:
    - "explain why a byte such as `01000001` only gets its meaning from the table used to read it"
    - "work out how many positions a code of four colours needs for 26 letters"
    - "predict what arrives when sender and receiver use different tables"
    - "recognise whether a code table is prefix-free"
translation_of: de
based_on: 2026-11-01
---

## A program reads the byte `01000001`. What is it?

- [ ] Always the letter A
- [ ] Always the number 65
- [x] That depends on which table the program reads it with

> Bits do not carry their meaning with them. Read as text the byte is an A, as
> a number 65, and in a greyscale image a dark grey.

## How many positions does a letter need if you want to transmit all 26 letters with four colours?

- [ ] Two
- [x] Three
- [ ] Four
- [ ] Twenty-six

> With two positions there are only 4 · 4 = 16 code words, with three already
> 4 · 4 · 4 = 64.

## Sender and receiver use tables in which the code words for n and m are swapped. What happens?

- [ ] The receiver's program reports an error.
- [x] A different word arrives that looks valid.
- [ ] The transmission stops.

> Every code word is in both tables, so the receiver finds a valid letter every
> time, just the wrong one.

## Which tables are prefix-free?

- [x] a = `0`, b = `10`, c = `11`
- [ ] a = `0`, b = `01`, c = `10`
- [x] a = `00`, b = `01`, c = `10`
- [ ] a = `1`, b = `10`, c = `00`

> In the second table `0` is the beginning of `01`, in the fourth `1` is the
> beginning of `10`. The third is prefix-free because all code words have the
> same length and are distinct.
