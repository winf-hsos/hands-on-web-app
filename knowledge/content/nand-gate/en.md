---
title: NAND gate
summary: >-
  A gate whose output is 0 only when all inputs are 1. Every other logic
  circuit can be built from it alone.
objectives:
  intro: "Once you know the NAND gate, you can:"
  goals:
    - "write down the truth table of the NAND gate"
    - "build NOT, AND and OR from NAND gates alone and use this to explain why NAND is universal"
    - "put together an XOR from four NAND gates and check it against the truth table"
    - "explain why chips in CMOS technology are often built from NAND gates"
translation_of: de
based_on: 2026-11-01
---

## Definition

A **NAND gate** ("not and") outputs 0 when all inputs are 1, and 1 in every
other case. It is an AND gate with an inverted output.

| A | B | NAND |
|---|---|---|
| 0 | 0 | 1 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

## One gate to build all the others

NAND is **universal**: every logic circuit, a whole processor included, can be
put together from NAND gates alone. You can see this by building the three
basic gates from it.

| Wanted | Built from NAND | Why it works |
|---|---|---|
| NOT A | NAND(A, A) | With both inputs equal, the output is 0 exactly when A = 1. |
| A AND B | NOT(NAND(A, B)) | The second NAND inverts the result of the first again. |
| A OR B | NAND(NOT A, NOT B) | NAND is 1 as soon as one input is 0, that is, as soon as A or B is 1. |

Since every other circuit can be built from NOT, AND and OR, the same holds
for NAND alone. An XOR, for example, takes four NAND gates. The same is true
of NOR, by the way, but not of AND or OR, because with them alone no bit can
be inverted.

## Why it matters in practice

In today's common CMOS technology, a two-input NAND gate is one of the
simplest gates of all: it needs four transistors. An AND gate there is a NAND
followed by an inverter and needs six. Chips are therefore often built from
many identical NAND blocks. **NAND flash** memory in USB sticks and SSDs is
named this way too, because its memory cells are connected in series much like
the transistors in a NAND gate.

> [!TIP]
> Try it on paper: draw an XOR from NAND gates only. Call the output of
> NAND(A, B) N; then A XOR B = NAND(NAND(A, N), NAND(B, N)). Check it against
> all four rows of the truth table.
