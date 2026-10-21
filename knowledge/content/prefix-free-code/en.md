---
title: Prefix-free code
summary: >-
  A code in which no code word is the beginning of another. It can be read
  unambiguously without separators, even when the code words differ in length.
translation_of: de
based_on: 2026-10-21
---

## Definition

A code is **prefix-free** if no code word is the beginning (the prefix) of
another code word. A receiver can then read a sequence of symbols from left to
right and knows, the moment what it has read matches an entry in the table,
that it must be exactly that entry.

## Why it matters

When code words arrive back to back with no gaps, the receiver has to work out
for itself where one ends. If all code words have the same length, it simply
counts. But if frequent characters are to get shorter code words than rare
ones, so that messages become shorter on average, counting no longer works, and
this is where being prefix-free helps.

## An example that does not work

| Character | Code word |
|---|---|
| a | `0` |
| b | `01` |
| c | `10` |

The sequence `010` can be read as `0 10`, which is *ac*, or as `01 0`, which is
*ba*. Both readings follow the table, because the code word for a is the
beginning of the code word for b.

## An example that works

| Character | Code word |
|---|---|
| a | `0` |
| b | `10` |
| c | `11` |

Here no code word starts with another. The sequence `01011` can only be read
as `0 10 11`, which is *abc*.

## Where it occurs

International telephone country codes form a prefix-free code: because no
country code is the beginning of another, the network knows right after `+49`
that Germany is meant, without waiting for further digits. Many data
compression methods also use prefix-free codes, because they give frequent
characters short code words without needing separators.

Morse code, by contrast, is **not** prefix-free, since E (·) is the beginning
of I (··). It avoids confusion only because a pause is sent between letters,
and that pause is itself part of the code.
