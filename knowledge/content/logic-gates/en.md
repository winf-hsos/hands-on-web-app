---
title: Logic gates
summary: >-
  The smallest building blocks a computer calculates with: circuits that turn
  one or two bits into a new bit according to a fixed rule.
objectives:
  intro: "This lesson introduces the logic gates a computer calculates with, and afterwards you can:"
  goals:
    - "tell the gates NOT, AND, OR, XOR, NAND and NOR apart by their rules"
    - "write down and read the truth table of every two-input gate"
    - "explain that a gate is a rule that can be built from relays, vacuum tubes or transistors"
    - "build a half adder from XOR and AND and use it to add two bits"
translation_of: de
based_on: 2026-11-01
---

A computer does not calculate with numbers but with bits, and every
calculation can be broken down into very small steps, each turning one or two
bits into a new bit. The circuits that carry out these steps are called
**logic gates**. A gate has one or more inputs and one output, and which bit
appears at the output depends only on the bits at the inputs.

## The most important gates

| Gate | Output is 1 if … |
|---|---|
| NOT | the input is 0 |
| AND | both inputs are 1 |
| OR | at least one input is 1 |
| XOR | exactly one input is 1 |
| NAND | not both inputs are 1 |
| NOR | no input is 1 |

NOT has only one input and inverts it. The others have two inputs, and NAND
and NOR are simply AND and OR followed by a NOT, which is what the N in the
name stands for.

## Everything at a glance: the truth table

Because two inputs have only four combinations, every gate can be described
completely in a table. It is called a **truth table**, and here all gates with
two inputs stand side by side:

| A | B | AND | OR | XOR | NAND | NOR |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 | 1 | 0 |
| 1 | 0 | 0 | 1 | 1 | 1 | 0 |
| 1 | 1 | 1 | 1 | 0 | 0 | 0 |

It is worth reading the table column by column: row by row, NAND is the
opposite of AND, and NOR the opposite of OR.

## What gates are made of

A gate is at first only a rule, and it can be built from anything that has two
states. The first calculating machines used relays, switches moved by an
electromagnet, later vacuum tubes and today transistors, of which a modern
processor contains many billions. The rule stays the same; only the parts
become smaller and faster.

## From gates to arithmetic

Adding two bits takes only two gates. The sum digit is 1 exactly when exactly
one of the two bits is 1, and that is XOR. The carry into the next digit is 1
exactly when both bits are 1, and that is AND. This circuit is called a **half
adder**, and several of them together add numbers of any length.

| A | B | Sum (XOR) | Carry (AND) |
|---|---|---|---|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

The last row is 1 + 1 = 10 in binary: sum 0, carry 1.

## One gate for everything

You do not need all six gates to build a computer. All the others can be put
together from NAND alone; why that is and what follows from it is shown in
[[nand-gate|the card on the NAND gate]].
