---
type: quiz
code: 9166
title: "Quiz: your colour alphabet is a number system"
summary: >-
  Two questions for the LiFi project: why an alphabet of colours is a place
  value system, and how many colour positions a letter needs.
level: 1
duration: 5
topics: [representing-information]
modules: [dup]
relations:
  checks: [place-value-systems]
status: draft
updated: 2026-10-30
---

These questions belong to the [[lifi]] project, where a team sends letters as
sequences of colours. The general questions on number systems are in
[[number-systems-quiz]].

## Your team transmits letters as sequences of four colours, say red-blue-green. In what sense have you already built a place value system? {#ns-012}

- [ ] Not at all: a place value system needs digits with numeric values, and colours have no value.
  > Digits do not have to look like numbers. As soon as each colour stands for a value and position matters, it is a place value system, whatever the digits look like.
- [x] Four colours are four digits, so base 4: three positions give 4 to the power of 3, that is 64 possibilities, and position determines place value.
  > Exactly, your colour alphabet is a number system in disguise: red-blue-green and green-blue-red are different code words because position counts. The formula N = kⁿ for the number of code words is the same calculation as asking how many numbers fit into n digits of base k.
- [ ] Only halfway: position does count, but without a colour for zero the system lacks its most important digit.
  > Zero is not missing, it just has no special status: which of the four colours stands for 0 is an agreement, exactly as for 1, 2 and 3. Four colours are four fully fledged digits.
- [ ] Only with exactly two colours would it be a place value system, because computers work with bits internally.
  > Base 2 is a special case, not a privilege. Place value systems work with any base from 2 upwards, your four colours included.

## Your alphabet has four colours. You want to tell 26 letters apart and give every letter a fixed number of colour positions. How many positions do you need at least? {#ns-014}

- [ ] Two, because two positions are already 4 times 4.
  > Two positions give 4² = 16 combinations, and 16 is not enough for 26 letters. The calculation is set up correctly but comes out too small; ten characters are missing.
- [x] Three, because 4³ is 64 and that is the first count that suffices.
  > Exactly the place value calculation, read backwards: with k digits and n positions you can represent kⁿ combinations. 4² = 16 is too few, 4³ = 64 is enough, and 38 combinations go unused. That waste is the price of a fixed length.
- [ ] Five, because 26 letters need five bits, and every colour position is one position.
  > Five bits is right, but a bit is a position with **two** possibilities. A colour position with four colours carries two bits, so you need only half as many positions, rounded up to three.
- [ ] Twenty-six, because every letter needs its own position.
  > That would be the case if a position could only mark one letter. The whole trick of a place value system is that positions **combine**: every extra position multiplies the number of possibilities by four instead of adding one.
