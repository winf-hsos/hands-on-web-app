---
type: quiz
code: 3656
title: "Quiz: code systems"
summary: >-
  Nineteen questions on codes as agreements, on ASCII and UTF-8, on fixed and
  variable length, on the prefix trap and on bytes that mean text, colour or
  sound depending on the reading. Every answer comes with its reason.
level: 1
duration: 20
topics: [representing-information]
modules: [dup]
relations:
  checks: [code-systems]
questions: [cs-001, cs-002, cs-003, cs-004, cs-005, cs-006, cs-007, cs-008, cs-009, cs-010, cs-011, cs-012, cs-013, cs-014, cs-015, cs-016, cs-017, cs-018, cs-019]
status: published
updated: 2026-11-09
---

## What is a code system? {#cs-001}

- [ ] A method that protects data from unauthorised access.
  > That is encryption, a separate concept. A code hides nothing; on the contrary it is public so both sides can use it.
- [x] An agreed mapping from characters to sequences of symbols or bits.
  > Exactly: a rule saying which bit sequence means which character. Agreed, not given by nature, which is why several exist.
- [ ] A method that rewrites data so that it takes up less storage space.
  > That is compression. Some codes are economical as a side effect, but making things smaller is not their purpose.
- [ ] The programming language a program is written in.
  > The word 'code' has several everyday meanings. Here it is not source code but the mapping from characters to bit sequences.

## In ASCII, capital A stands for the number 65, B for 66, C for 67. What follows from that? {#cs-002}

- [ ] That letters are stored as letters in the computer, just with a number next to them.
  > Only the number is stored. A letter does not exist as a shape inside the computer; it appears only when a program renders the number using the same agreement.
- [ ] That the 65 follows from A's position in the alphabet once you count digits and punctuation as well.
  > The number does not follow from any calculation. It was fixed in the ASCII table, whose beginning is reserved for control and punctuation characters; A could just as well have been given 1 or 200.
- [x] That a letter in a computer is nothing but a number to which someone assigned this meaning.
  > Exactly, and that is the point of the whole concept: the same bits are text, image, or sound depending on which agreement you apply to them.
- [ ] That every computer has to store letters according to this table, because the numbers are fixed in the hardware.
  > The table is an agreement between programs, not a property of the hardware. There are many mappings: UTF-8, older character sets, a home-made colour alphabet. ASCII is common, not necessary.

## In Morse code E is a single dot while Q is four symbols long. In ASCII every character is exactly one byte. What is the advantage of the fixed length? {#cs-003}

- [ ] The message becomes shorter overall, because no character occupies more symbols than the others.
  > Usually the opposite: variable length can be shorter because frequent characters get short codes. Fixed length buys something else.
- [x] The receiver always knows where a character ends, without separators and without thinking.
  > Exactly: it just counts the same number of symbols every time. With variable length the code itself must reveal where a character ends, otherwise pauses or separators are needed. Morse really does need them.
- [ ] Fixed length is more robust against noise.
  > Against noise, distance between symbols helps, not code length. An error can happen in both; with variable length it is worse because everything after it shifts.
- [ ] Fixed length works without a previously agreed table, because the position within the byte already tells which character is meant.
  > Fixed length must be agreed too: which length, and which bit sequence means which character. The position only tells where a character starts, not what it means.

## A team agrees: a = 0, b = 01, c = 10. The sequence 010 is sent. Why is this code unusable? {#cs-004}

- [ ] Because the code words differ in length, and a code stays readable only with fixed length.
  > Variable length is allowed as such, Morse lives on it. The fault is not the lengths but that one code word is the prefix of another.
- [x] Because the sequence has two readings: 'a c' and 'b a' both fit.
  > Exactly: 0 + 10 gives 'a c', 01 + 0 gives 'b a'. A code must be uniquely decodable. Here a's code is the start of b's, so the receiver never knows whether a character has ended. Remedies: fixed length, a separator, or code words where none is the prefix of another.
- [ ] Because 0 and 1 are too few symbols; three characters would need a third symbol as a separator.
  > Two symbols suffice for any message. The fault is not the count but the choice of code words.
- [ ] Because an alphabet of only three characters yields too few combinations to form words unambiguously.
  > Three characters are perfectly fine. With a = 00, b = 01, c = 10 the same repertoire would be unambiguous.

## Your code gives every letter three colour positions from an alphabet of four colours. Now the space, the full stop and the ten digits are to be transmitted as well. What do you have to change about your code? {#cs-005}

- [x] Nothing about the length: three colour positions give 64 code words, 38 are needed, 26 stay free.
  > Exactly. The spare code words were never waste, they were stock. That is what they are for: space, digits, punctuation and later control characters.
- [ ] A fourth colour position, because the 64 code words are already taken by the 26 letters.
  > 26 letters occupy 26 of the 64 code words, not all of them. The table is far emptier than it feels.
- [ ] Add a fifth colour to the alphabet so the twelve new characters fit.
  > That would raise the capacity, but it is not needed here, and it is the most expensive route: a fifth colour has to be reliably distinguishable from the other four by the sensor.
- [ ] Introduce a separator for the twelve new characters, because they are not letters.
  > A separator is only needed with code words of different lengths. With fixed length the receiver simply counts, and to it a full stop is just as much a code word as a letter.

## ASCII has 128 characters. So why do Unicode and UTF-8 exist as well? (Several answers may be correct.) {#cs-006}

- [x] Because 128 characters are nowhere near enough for the world's writing systems.
  > Correct: umlauts, Greek, Cyrillic, Chinese, emoji. Unicode assigns a number to every character, currently over 100,000 of them.
- [ ] Because ASCII, at one byte per character, is too slow for today's computers to process.
  > ASCII is as fast to decode as it gets, one byte per character. The reason for Unicode is the repertoire, not speed.
- [x] Because UTF-8 uses variable length: common characters stay one byte, rare ones need more.
  > Correct, and it is the same idea as Morse: frequent means short. That is why English text in UTF-8 is almost as compact as ASCII, while German umlauts cost one extra byte each.
- [ ] Because Unicode encodes images and sound alongside characters, which ASCII lacks.
  > Unicode encodes characters, emoji included, but not images or sound. Those have code systems of their own.

## A disk holds the byte sequence `48 65 6C 6C 6F`. How does a program know whether this is text, part of an image, or a piece of sound? {#cs-007}

- [ ] The bytes themselves reveal it; text bytes look different from image bytes.
  > The same bytes can mean anything. `48 65 6C 6C 6F` is 'Hello' in ASCII but could equally be five grey values or five audio samples.
- [ ] From the storage location: text, images and sound live in separate areas of the disk.
  > The disk has no areas for data types; it stores bytes wherever there is room. The convention about what the bytes mean has to come from elsewhere.
- [x] From additional agreements: the file extension, a header inside the file, or because the program simply assumes it.
  > Exactly: the type is itself an agreement, either shipped along or assumed. That is why many message formats carry a type field: the receiver should not have to guess what is arriving.
- [ ] The operating system stores the meaning of every byte.
  > It stores bytes and a file name, nothing more. Interpretation happens on opening, and it can go wrong: open an image as text and you see garbage.

## A pixel is stored with one byte each for red, green, and blue. How many different colours can be represented? {#cs-008}

- [ ] 768, that is 3 times 256.
  > You do not add: each of the 256 red levels can be combined with every green and every blue level. So you multiply.
- [x] About 16.7 million, that is 256 times 256 times 256.
  > Exactly, and in bits: 8 plus 8 plus 8 is 24 bits per pixel, so 2 to the power of 24 possibilities. That number is what '24-bit colour depth' means.
- [ ] 256, since one byte is enough for a colour.
  > One byte is enough for one channel. Only three channels together make the colour, and their combinations multiply.
- [ ] Unlimited, because colour is continuous.
  > Colour in the world is continuous, in memory it is not: three bytes give finitely many states. That is exactly what digitising means.

## A colour is written as `#AC8909`. What notation is this and what is it for? {#cs-009}

- [ ] A separate code system for colours, independent of RGB.
  > These are the same three RGB values, just written differently: AC is 172, 89 is 137, 09 is 9.
- [x] Hexadecimal: a compact notation for bytes where two digits are exactly one byte.
  > Exactly: 16 digits (0 to 9 and A to F), so 4 bits per digit and 8 bits per pair. That is why three pairs are exactly the three colour bytes. People read `AC` more easily than `10101100`.
- [ ] A six-character checksum by which a program tells whether the colour value arrived undamaged.
  > A checksum would be computed from the data, while here it is simply the colour value itself, written in a different base.
- [ ] The memory address at which the colour value is stored in RAM; hence the hash sign in front.
  > Addresses are also written in hex, hence the confusion. Here it is the content, not the location.

## The same logo can be stored as a bitmap (one colour per pixel) or as vector graphics (instructions like "circle, centre, radius, colour"). Which statements are true? (Several answers may be correct.) {#cs-010}

- [x] Both are code systems: they describe the same image under different agreements.
  > Correct, and that is the core: there is no single right representation, only different mappings with different strengths.
- [ ] The vector version gives the smaller file for any motif, because instructions take less space than pixels.
  > For simple shapes usually, for a photo certainly not: describing a photo as vectors would be absurdly expensive. It depends on the content.
- [x] Only the vector version can be enlarged arbitrarily without producing jagged edges.
  > Correct: the instruction 'circle with radius r' can be redrawn at any size, a grid of pixels cannot.
- [ ] The bitmap version needs no agreement of its own, because one colour per pixel is the natural form of an image anyway.
  > It needs agreements too: width, height, pixel order, colour depth, channel order. Without those a bitmap is just a byte sequence.

## `encode("cab")` returns a bit sequence. What is it, and how does the receiver recover the characters? {#cs-011}

```python static
CODE = {"a": "00", "b": "01", "c": "10", "d": "11"}

def encode(text):
    return "".join(CODE[char] for char in text)
```

- [x] 100001, and the receiver simply cuts the sequence into pairs.
  > Exactly: c is 10, a is 00, b is 01. Because all code words have the same length, counting suffices; no separator is needed. The receiver uses exactly this dictionary the other way round.
- [ ] 100001, but without separators the sequence cannot be read back.
  > The bit sequence is right. Separators are needed only for variable length; here every character is exactly two bits, which is rule enough.
- [ ] cab, because join reassembles the looked-up characters into the original text at the end.
  > join concatenates what the loop yields, and the loop yields each character's code word from the dictionary, not the character itself. What comes back is a string of zeros and ones.
- [ ] 001001; the order in the dictionary decides.
  > The order inside the dictionary is irrelevant, only the mapping. The text is read left to right: c, a, b.

## Which of the following are code systems in the sense of this concept? (Several answers may be correct.) {#cs-012}

- [x] A barcode on a package
  > Yes: bar widths stand for digits, following a publicly fixed agreement.
- [x] Braille
  > Yes: six dot positions, each raised or not. That is 6 bits per character, felt instead of seen.
- [x] The DNA in a cell
  > Yes, and the oldest code of all: three bases in a row stand for one amino acid, and this mapping is the same in every living thing. An agreement nobody negotiated and everybody keeps.
- [x] A colour alphabet that a team invents for a lamp
  > Yes, and that is the point: a code system needs no computer, only an agreement and distinguishable states.
- [ ] The loudness of a sound
  > No: a continuous physical quantity with no agreed mapping. It becomes a code only once someone decides what quiet and loud are meant to mean.

## Four teams present their code table. Which of them can be read unambiguously without separators? (Several answers may be correct.) {#cs-013}

- [x] a = 00, b = 01, c = 10, d = 11
  > Fixed length: the receiver cuts the sequence into pairs and never has to wonder where a character ends.
- [x] a = 0, b = 10, c = 110, d = 111
  > Different lengths and still unambiguous: no code word is the beginning of another one. As soon as a piece read matches the table, it can only be that character.
- [ ] a = 0, b = 10, c = 01, d = 11
  > `010` is either "a b" or "c a", and both stick to the table. The code word of a is the beginning of the code word of c, so after a `0` the receiver does not know whether the character has ended.
- [ ] a = 0, b = 1, c = 01, d = 10
  > `01` is either "c" or "a b", and both are allowed. Different lengths really are the problem here, but only because the short code words start the long ones.

## This line makes an RGB LED glow a warm gold. What do the three numbers mean? {#cs-014}

```python static
led.set_color(236, 171, 3)
```

- [ ] Three numbers from a table in which every displayable colour has its own entry.
  > There is no such table, and one entry would need a single number, not three. The colour is mixed from three shares, not looked up.
- [x] The shares of the three primary colours: much red, slightly less green, almost no blue, each from 0 to 255.
  > Exactly, and every screen uses the same agreement: three channels, one byte each, together 16.7 million colours. Written as hex that is #ECAB03.
- [ ] Brightness, hue and saturation of the colour, in that order, each as a value from 0 to 255.
  > That would be a different agreement; it exists (HSV), but `set_color` expects the three primary shares. Again: numbers mean only what has been agreed.
- [ ] The wavelength of the light in nanometres.
  > A wavelength would be a single number, roughly 380 to 750 for visible light. An RGB LED does not produce colours by wavelength but by mixing three fixed primaries.

## Two team members typed up their code table independently. In the receiver's table the entries for "n" and "m" have accidentally been swapped; everything else matches. The sender transmits the word "norm". What happens? {#cs-015}

- [ ] The receiver reports an error, because the sequence it received does not match its table.
  > The sequence matches its table perfectly well, just to a different letter. There is nothing for the program to be surprised about.
- [ ] The receiver outputs "norm", because the bit sequence carries its meaning with it.
  > A bit sequence carries no meaning with it. It only gets meaning from the table someone looks it up in, and here there are two different tables.
- [x] The receiver outputs "morn", and nothing points to an error.
  > That is what makes wrong tables so treacherous: no error arrives, only clean nonsense. That is the Rosetta Stone story, in miniature.
- [ ] The transmission stops at the first wrongly mapped character.
  > The receiver could only stop if it noticed something was wrong. But it just looks things up, and every time it gets a valid answer.

## Your team has written down the table for sending. The receiver gets the bit sequence `11000110`. Which text has it received? {#cs-016}

```python static
code = {"a": "00", "b": "01", "c": "10", "d": "11"}
```

- [x] "dabc": the sequence is cut into pairs from the front and each pair is looked up backwards.
  > 11 00 01 10 gives d, a, b, c. Because all code words are two bits long, counting is enough, and the table works in both directions.
- [ ] "cbad": when decoding, the sequence is cut into pairs from the back.
  > Cutting from the back happens to give pairs here too, but it reverses the order. The receiver reads in the same order in which it was sent.
- [ ] A single character, because eight bits are one byte, and one byte carries exactly one character.
  > A byte carries one character if the agreement says so, as in ASCII. Your agreement says two bits per character, so eight bits hold four characters here.
- [ ] Nothing at all: decoding needs a second table from bits to letters, and this one points the wrong way.
  > As long as no two characters share a code word, one table carries both directions. In the program you invert it once; that is craft, not a new agreement.

## Your code table contains the 26 letters and nothing else. Someone types "good morning" and presses send. Which statement is true? {#cs-017}

- [ ] The space is the absence of a character and therefore needs no code.
  > To you a space looks like nothing; to the text it is a character like any other. Without a code "goodmorning" arrives, and the receiver cannot invent the gap.
- [x] The space has no code; your program has to decide what happens to it, otherwise chance decides.
  > Exactly. Either you add the space to the table, or you drop it beforehand, or you stop with a message. All three are defensible; making no decision is not.
- [ ] The receiver recognises the word boundary from the pause between symbols.
  > That confuses two levels. Pauses between symbols belong to the transmission and sit between all symbols, including inside a word. The space belongs to the text.
- [ ] The space is automatically given the next free code word; after all, 64 are available.
  > Nothing happens automatically in a code. Free code words are space, not a mapping, and whatever the sender assigns on its own is still unknown to the receiver.

## Braille writes every character as six dots, and each dot is either raised or not. How many different characters can be told apart that way? {#cs-018}

- [ ] 12, that is 6 dots times 2 states.
  > You do not multiply across the dots, you multiply per dot: each of the six dots doubles the number of patterns.
- [ ] 36, that is 6 to the power of 2.
  > Base and exponent are the wrong way round. The base is how many states one position has (two), the exponent is how many positions there are (six).
- [x] 64, that is 2 to the power of 6.
  > Exactly the same calculation as for the colour alphabet, just with two states and six positions. Braille is a six-bit code you read with your finger.
- [ ] 6, because each dot stands for one character.
  > That would not get you far with six characters. The dot is the position, not the character; the character is the pattern of all six.

## One team codes every letter with three colour positions. Another team gives the ten most frequent letters two colour positions and all the others four. Which statements are true? (Several answers may be correct.) {#cs-019}

- [x] For ordinary English text the second team needs fewer colour positions per letter on average.
  > The ten most frequent letters make up most of a text. If you give them the discount, you happily pay two extra positions for the rare remainder. This is exactly the idea behind Morse code and behind compression.
- [ ] The second team's code is shorter for any sequence of characters.
  > With "xyzxyz" it loses: four positions per letter instead of three. The advantage holds on average over typical text, not in every single case.
- [x] The second team's code can be read without separators as long as no short code word is the beginning of a long one.
  > That is the price of variable length. It is not forbidden, it just puts a condition on the table that the first team does not have to worry about.
- [ ] The first team's code does without an agreement, because fixed length is self-evident.
  > Fixed length makes counting easy, but which three colours mean which letter still has to be in a table. No code works without an agreement.
