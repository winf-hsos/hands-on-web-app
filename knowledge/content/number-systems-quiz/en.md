---
type: quiz
code: 7154
formerly: [lifi-colour-alphabet-quiz]
title: "Quiz: number systems"
summary: >-
  Fourteen questions on place value, binary and hexadecimal numbers, bits and
  bytes, and the two ladders of units. Every answer comes with its reason.
level: 1
duration: 15
topics: [representing-information]
modules: [dup]
relations:
  checks: [place-value-systems, bit, byte]
questions: [ns-001, ns-002, ns-003, ns-004, ns-005, ns-013, ns-012, ns-014, ns-010, ns-007, ns-008, ns-009, ns-011]
status: published
updated: 2026-11-24
---

## Why does the digit sequence 123 in the decimal system mean one hundred and twenty-three? {#ns-001}

- [ ] Because together the digits form one fixed symbol for this number.
  > Then every number would need its own symbol and you would have to learn infinitely many. The whole trick of place value is writing any number with ten digits.
- [x] Because each position is worth a power of ten: 1 times 100 plus 2 times 10 plus 3 times 1.
  > Exactly: the digit says how many, the position says of what. The same digit 1 is worth a hundred at the front and one at the back. This recipe is called place value, and it works with any base, not just ten.
- [ ] Because the digits increase in size from left to right and build up the number that way.
  > A coincidence of this example. The decimal number 321 follows the same rule: 3 times 100 plus 2 times 10 plus 1 times 1.
- [ ] Because each position counts ten times as much as the one before: 1 times 1 plus 2 times 10 plus 3 times 100.
  > The powers of ten are right, the direction is not: this calculation gives the decimal number 321. Place values grow from right to left, the ones are at the far right.

## What is special about the base 10 of our number system? {#ns-002}

- [ ] It is the only base in which every possible number can be represented.
  > Mathematically no base is privileged. Every base from 2 upwards can represent every number, following the same recipe.
- [ ] Computers depend on base 10 because their inputs and outputs are decimal.
  > Decimal is only the surface for humans. Inside, computers work in base 2 and translate at input and output; for them, ten is rather impractical.
- [x] Nothing, except that we have ten fingers.
  > Exactly: ten is anatomy, not a law of nature. A creature with eight fingers would count in base 8 and get just as far. The recipe (digit times place value, summed up) stays the same for every base.
- [ ] Only base 10 has the digit 0, which marks an empty position.
  > Every base needs zero, otherwise an empty position could not be told from a missing one. Base R uses the digits 0 to R minus 1.

## Which decimal number does the binary number 110 represent? {#ns-003}

- [ ] The decimal number 110, the notation does not change the value.
  > The notation changes everything: the same digits mean different numbers depending on the base. Read as binary, the positions are worth 4, 2, and 1.
- [x] The decimal number 6, because 1 times 4 plus 1 times 2 plus 0 times 1.
  > Exactly, the same recipe as in decimal, just with powers of two as place values: 4, 2, 1 instead of 100, 10, 1.
- [ ] The decimal number 3, because 1 times 1 plus 1 times 2 plus 0 times 4.
  > The place values are right, the direction is not: the ones position is at the far right, not the left. Read from the right, the positions are worth 1, 2, and 4, so 0 plus 2 plus 4.
- [ ] The decimal number 220, because each digit is multiplied by the base 2.
  > It is not the base that gets multiplied onto every digit but the place value, and that differs per position: rightmost 1, then 2, then 4. The products are then added, not written side by side.

## You count in binary: 0, 1, 10, 11, 100, 101, and then? Which binary number comes next, and why? {#ns-004}

- [ ] The binary number 102, because the last position moves on by one digit, just as in decimal.
  > Base 2 only has the digits 0 and 1. A 2 can never appear in a binary number, just as decimal has no single digit for ten.
- [ ] The binary number 1000, because the binary number 101 exhausts the three positions and a fourth one is added.
  > Carried too early: the binary number 101 is the decimal number 5, next comes the decimal number 6, which does not need a fourth binary digit yet. Only after the binary number 111 (decimal 7) does 1000 follow.
- [x] The binary number 110: the last digit overflows and carries a 1, just like counting from 09 to 10 in decimal.
  > Exactly: counting works the same in every base. When the highest digit is reached, the position resets to 0 and the next position goes up by one. In binary this just happens much more often, because after 1 you are done.
- [ ] The binary number 111, because after the binary number 101 the remaining zeros turn into ones one after another.
  > That skips a number: the binary number 111 is the decimal number 7, but we are looking for the decimal number 6, binary 110. Counting only raises the last position by one, and the 1 there overflows: the binary number 101 becomes 110.

## A creature with eight fingers writes the digit sequence 123 in its base-8 system. Which decimal number is that? {#ns-005}

- [ ] The decimal number 123, because a number stays the same no matter how many fingers are used for counting.
  > The number behind it is the same everywhere, its notation is not. The same digits mean something different in base 8, because the positions are worth 64, 8, and 1.
- [x] The decimal number 83, because 1 times 64 plus 2 times 8 plus 3 times 1.
  > Exactly: same recipe, different place values. Instead of 100, 10, 1 the positions are worth 64, 8, 1, that is, powers of eight. Once you have done this calculation, you can read any base.
- [ ] The decimal number 48, because the digit sum 1 plus 2 plus 3, multiplied by the base 8.
  > The digits are not added first and then combined with the base. Each digit is multiplied by its own place value (64, 8, 1), and only then is everything summed.
- [ ] The digit sequence 123 cannot be written in base 8 at all.
  > Every base from 2 upwards can represent every number. The digits 1, 2, and 3 are all allowed in base 8; only 8 and 9 would be forbidden.

## So far you have been reading binary numbers. Now the other way round: how do you write the decimal number 13 in binary? {#ns-013}

- [ ] 1011 (binary)
  > That is the decimal number 11, because 8 + 2 + 1 = 11. The digits are right but their order is not: working through the place values from right to left and writing the result down in that order reverses the number.
- [x] 1101 (binary)
  > 8 + 4 + 0 + 1 gives the decimal number 13. The easiest route goes down from the largest power of two: 16 is too big, 8 fits (5 left), 4 fits (1 left), 2 does not, 1 does. Left to right that gives 1, 1, 0, 1.
- [ ] 1110 (binary)
  > That is the decimal number 14, because 8 + 4 + 2 = 14, one too many. A glance at the last digit is enough to check: it carries the 1, and odd numbers always have a one there.
- [ ] 1100 (binary)
  > That is the decimal number 12, because 8 + 4 = 12. The remainder of 1 has been dropped; after the 4 exactly one is left over, and it needs the last place.

## In the LiFi project your team transmits each letter as three colours in a row, each chosen from a palette of four, say red-blue-green. In what sense have you already built a place value system? {#ns-012}

- [ ] Not at all: a place value system needs digits with numeric values, and colours have no value.
  > Digits do not have to look like numbers. As soon as each colour stands for a value and position matters, it is a place value system, whatever the digits look like.
- [x] Four colours are four digits, so base 4: three positions give 4 to the power of 3, that is 64 possibilities, and position determines place value.
  > Exactly, your colour alphabet is a number system in disguise: red-blue-green and green-blue-red are different code words because position counts. The formula N = kⁿ for the number of code words is the same calculation as asking how many numbers fit into n digits of base k.
- [ ] Only halfway: position does count, but without a colour for zero the system lacks its most important digit.
  > Zero is not missing, it just has no special status: which of the four colours stands for 0 is an agreement, exactly as for 1, 2 and 3. Four colours are four fully fledged digits.
- [ ] Only with exactly two colours would it be a place value system, because computers work with bits internally.
  > Base 2 is a special case, not a privilege. Place value systems work with any base from 2 upwards, your four colours included.

## Your LiFi alphabet has four colours. You want to tell 26 letters apart and give every letter a fixed number of colour positions. How many positions do you need at least? {#ns-014}

- [ ] Two, because two positions are already 4 times 4.
  > Two positions give 4² = 16 combinations, and 16 is not enough for 26 letters. The calculation is set up correctly but comes out too small; ten characters are missing.
- [x] Three, because 4³ is 64 and that is the first count that suffices.
  > Exactly the place value calculation, read backwards: with k digits and n positions you can represent kⁿ combinations. 4² = 16 is too few, 4³ = 64 is enough, and 38 combinations go unused. That waste is the price of a fixed length.
- [ ] Five, because 26 letters need five bits, and every colour position is one position.
  > Five bits is right, but a bit is a position with **two** possibilities. A colour position with four colours carries two bits, so you need only half as many positions, rounded up to three.
- [ ] Twenty-six, because every letter needs its own position.
  > That would be the case if a position could only mark one letter. The whole trick of a place value system is that positions **combine**: every extra position multiplies the number of possibilities by four instead of adding one.

## Why do computers use base 2 and not base 10 right away? {#ns-010}

- [ ] Because the arithmetic units only master the simplest rules, and the multiplication table in base 2 is the shortest.
  > The short multiplication table is a pleasant consequence, not the reason. Mathematically every base is equally powerful; the deciding factor is the physics of the components, which keep two states apart most reliably.
- [x] Because two states have the largest separation and can therefore be told apart most reliably, billions of times without error.
  > Exactly: the more levels you squeeze into the same range, the smaller the gaps and the sooner noise strikes. Base 10 would mean ten voltage levels instead of two, with correspondingly more errors. On and off is the most robust alphabet there is.
- [ ] Because base 2 gives shorter numbers, so memory needs fewer digits.
  > The opposite is true: binary numbers are longer, the decimal number 255 needs eight binary digits instead of three decimal ones. The price is happily paid because each digit is nearly indestructible.
- [ ] Because an international standard prescribes base 2, and all computers must follow it so that they can communicate with each other.
  > No such standard exists: computers calculated in binary long before they were networked, and network protocols define formats, not the base inside the arithmetic unit. The deciding factor is physics, because two states can be told apart most reliably.

## What is a byte, and how many different values can it take? {#ns-007}

- [ ] A bundle of eight bits, so eight different values, one per bit.
  > Eight bits is right, but the values multiply: each of the eight positions doubles the possibilities. 2 to the power of 8 is 256, not 8.
- [ ] The smallest number a computer can store, with 2 to the power of 8, that is 256, as its largest value.
  > A byte is a unit of packaging, not a number. It is the usual smallest addressable unit of memory, and what its eight bits mean is decided by an agreement. Read as a binary number it also runs from decimal 0 to 255, not up to 256.
- [x] A bundle of eight bits, with 2 to the power of 8, that is 256, possible values.
  > Exactly: eight base-2 positions, each doubling the possibilities, 256 in total. Read as a binary number, a byte runs from decimal 0 to 255, which is exactly why colour channels in image editing run from 0 to 255.
- [ ] A bundle of a thousand bits, hence the prefix kilo in kilobyte, with a thousand possible values.
  > A byte is eight bits. The kilobyte is the next packaging level above, a thousand bytes, not a thousand bits. And even with a thousand bits the values would be 2 to the power of 1000, not a thousand.

## Hexadecimal is the place value system with base 16, using the digits 0 to 9 and A to F. Why does one byte fit into exactly two hex digits? {#ns-008}

- [ ] A historical accident: the first computers had two-digit displays, and base 16 was adapted to fit them.
  > It is arithmetic, not accident: 16 times 16 is exactly 256. That is precisely why base 16 became the shorthand for bytes.
- [x] One hex digit holds 16 values, exactly 4 bits; two digits hold 8 bits, and 16 times 16 is 256.
  > Exactly, and that is why hex is the shorthand for bytes: people read the hexadecimal number AC more easily than the binary number 10101100, and both are the decimal number 172. The colour #AC8909 is simply three bytes, two digits each.
- [ ] Because the six letters A to F supply exactly the bits that the ten digits lack to make a byte.
  > A to F are not bits but ordinary digits with the values 10 to 15. They are needed because base 16 requires sixteen different digits and our ten are not enough. Their number has nothing to do with the byte.
- [ ] Because one byte consists of 16 bits, and each hex digit represents exactly 8 of them.
  > A byte has 8 bits, not 16. One hex digit holds 16 values, which is 4 bits; two digits make 8 bits and thus the 256 values of a byte.

## Which decimal number does the hexadecimal number FF represent? {#ns-009}

- [ ] The decimal number 1515, because F is 15, and both digit values are written one after the other.
  > You do not write the digit values next to each other; you combine them with the place values: 15 times 16 plus 15 times 1.
- [ ] The decimal number 30, because F is 15, and the two positions are added together.
  > The left position is worth sixteens, not ones: 15 times 16 plus 15 times 1, not 15 plus 15.
- [x] The decimal number 255, because 15 times 16 plus 15 times 1, the largest value of a byte.
  > Exactly. FF is the full byte, 11111111 in binary. That is why the colour #FF0000 means full red: first channel at maximum, the others at zero.
- [ ] The decimal number 240, because F is 15, and 15 times 16 gives 240.
  > The left position is right, the right one is missing: the second F is another 15 times 1. Together 240 plus 15 equals 255.

## A hard drive is labelled 1 terabyte, but the operating system shows only 931 gigabytes. Where are the missing 69 gigabytes? {#ns-011}

- [ ] They are spare areas the manufacturer keeps for defective spots, and the system hides them.
  > Such reserves exist, but they are tiny and included in neither figure. Not a single byte is missing: both figures describe the same amount of storage, just in different units.
- [ ] The operating system reserves them for its own files, swap space and recovery.
  > System files cost some space, but not seven percent of an empty drive. The difference is in the units.
- [x] Nowhere: the manufacturer counts in steps of 1000, the system in steps of 1024, and 1024 is 2 to the power of 10.
  > Exactly: kilo, mega, giga are decimal, factor 1000 each; storage is organised in powers of two, and 2 to the power of 10, which is 1024, is close enough to 1000 to confuse the two. Every step adds about 2.4 percent to the gap, so at giga, three steps up, it is 7.4 percent. The clean names for the 1024 steps are kibi, mebi, gibi.
- [ ] The manufacturer rounds up generously so that the packaging shows a round number.
  > Nothing is rounded, the figure is exact. It just uses the decimal reading, which sounds better. Both readings are defined; the annoyance is that they share the same name.
