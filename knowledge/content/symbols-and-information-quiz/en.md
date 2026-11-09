---
type: quiz
code: 4145
title: "Quiz: symbols and information"
summary: >-
  Sixteen questions on symbols, alphabets and agreements, on the bit as a
  measure of information, on halving questions and on what a larger alphabet
  buys. Every answer comes with its reason.
level: 1
duration: 20
topics: [representing-information, transferring-information]
modules: [dup]
relations:
  checks: [symbols-and-information, bit]
questions: [si-001, si-002, si-003, si-004, si-005, si-006, si-007, si-008, si-009, si-010, si-011, si-012, si-013, si-014, si-015, si-016]
status: published
updated: 2026-11-09
---

## What is a symbol in the sense of information theory? {#si-001}

- [ ] A small picture, such as an icon on a screen.
  > That is the everyday meaning. Here, symbol means something more general that can also be a colour, a tone or a hand gesture.
- [ ] A written character such as a letter or a digit, that is, something you can write down.
  > Written characters are one example of symbols, but only one. The colours of a lamp are symbols just as much, although none of them can be written down.
- [x] An agreed, distinguishable state.
  > Exactly, and both words matter: distinguishable, since the receiver must reliably tell it apart from all others, and agreed, since without an agreement the state carries no meaning.
- [ ] A single sensor reading, such as a particular brightness.
  > A reading is just a number at first. A range of readings only becomes a symbol once sender and receiver jointly give it a meaning.

> A symbol needs both: physics makes it distinguishable, and an agreement gives it a meaning.

## Two teams send data with coloured light, and their LED shows four colours they have agreed on. What is the alphabet of their link? {#si-002}

- [ ] The 26 letters from A to Z that the link is meant to carry.
  > The letters are what the messages say, but the link itself only sends colours. Its alphabet is what can be seen on the way, four colours here instead of 26 letters.
- [x] The set of the four colours that both teams have agreed on as symbols.
  > Exactly. How large this set may be is not decided by the agreement alone: the hardware and the surroundings have a say, which makes it a question of measurement.
- [ ] The order in which the colours of a message are sent.
  > The order is the message itself. The alphabet is the stock from which it is assembled.
- [ ] The mapping of the colours to bit sequences, such as green standing for 01.
  > That is the code, which builds on the alphabet. The alphabet is only the agreed set of colours themselves; how to write them in bits is a second step.

> The alphabet is the stock of agreed symbols, and a code then says what each of them stands for.

## A link sends letters as coloured flashes of light. Who decides that a green flash means "A"? {#si-003}

- [ ] The physics of light: each colour has a fixed wavelength, and from that the receiver recognises which character is meant.
  > The wavelength makes green distinguishable, nothing more. Which character stands behind it is not in the light; it arises from agreement alone.
- [x] Sender and receiver together, by an agreement made before the transmission.
  > Exactly, and both sides must use exactly the same mapping. In practice this agreement is a piece of documentation and two places in the code, one in the sender and one in the receiver.
- [ ] A standard for light transmission that all devices follow so that they understand each other.
  > Standards exist for many channels, but even they are agreed, not discovered: a standard is an agreement written down for many parties. Nothing in the light itself fixes the meaning.
- [ ] The receiver alone, since it is the side that has to turn readings into characters.
  > A receiver deciding alone is guessing. Unless the sender uses the same mapping, the result is reliably nonsense.

> Meaning is not in the signal but in an agreement that both sides made beforehand.

## What is a bit? {#si-004}

- [ ] A tiny component inside a computer that either passes or blocks current.
  > A bit is not a thing but a unit of measurement. It can be stored in components, but just as well in a flash of light or a hand gesture.
- [ ] The amount of storage a computer needs for a single character such as "A".
  > That describes a byte, a group of eight bits. The mix-up is common but immediately costs a factor of eight.
- [x] The amount of information in a decision between two equally likely possibilities.
  > Exactly: one yes or no, one on or off. The bit is the smallest currency in which information can be counted, and every larger amount is measured in it.
- [ ] The smallest brightness a sensor can still measure.
  > That would be a property of a particular sensor. A bit is independent of any hardware; it counts possibilities, not brightness.

> One bit is the answer to one yes/no question whose two answers are equally likely.

## An alphabet has four colours, all equally likely. How much information does a single received symbol carry, and why? {#si-005}

- [ ] 4 bits, because each of the four colours is a possibility of its own, and each possibility counts as one bit.
  > Bits do not count the possibilities themselves but the yes/no decisions needed to pin one down. That is considerably fewer: two for four possibilities.
- [x] 2 bits, because two yes/no decisions suffice to determine one of four colours.
  > Exactly, and the reasoning is halving: the first question splits the four into two halves, the second hits the colour. Every doubling of the alphabet adds exactly one bit per symbol.
- [ ] 1 bit, because the receiver makes one decision per symbol: it has arrived or it has not.
  > Whether something arrives is not the question; which of the four colours it is, is. A symbol is not automatically one bit: how much it carries depends on how many possibilities it was chosen from.
- [ ] It depends on the colour sent, because an easily recognised colour such as red carries more than a hard one such as yellow.
  > Recognisability affects reliability, not amount. With four equally likely colours, each carries the same information: what counts is the number of possibilities, not the actual choice.

> With N equally likely symbols, each carries log₂(N) bits, so four colours carry two.

## A link switches from 2 to 8 colours and still sends the same number of symbols per second. How does the transfer time of the same file change? {#si-006}

- [ ] It drops to a quarter, because 8 divided by 2 is 4.
  > You do not divide the numbers of colours: information grows with doubling. From 2 to 8 is two more doublings, from 1 to 3 bits per symbol.
- [x] It drops to a third: each symbol now carries 3 bits instead of 1.
  > Exactly: 2 colours carry 1 bit per symbol, 8 colours carry 3. Same symbol rate, three times the bit rate, a third of the time, provided the eight colours stay distinguishable, which is the limit that the distance between regions sets.
- [ ] It stays the same, since the symbol rate has not changed.
  > The symbol rate is the same, but each symbol now carries more. Time is saved by packing more bits into each symbol, not only by flashing faster.
- [ ] It drops to an eighth, one eighth per colour.
  > That would require every additional colour to contribute equally. Information grows by one bit only per doubling of the alphabet, not per single colour.

> Time follows bits per symbol, log₂(2) = 1 against log₂(8) = 3, so a third.

## More symbols per alphabet means more bits per symbol. Why not simply make the alphabet huge, say 256 colours? {#si-007}

- [ ] Because a lamp can mix only a limited number of distinct colours from its three channels.
  > An RGB LED mixes millions of shades from three channels, so sending is not the problem. The bottleneck sits on the other side.
- [ ] Because the receiver would need a lookup table for 256 colours whose search per symbol takes too long.
  > 256 entries are nothing for a computer; a single byte has that many values, and the lookup takes a fraction of a microsecond. The limit is not computational.
- [x] Because the receiver must still tell the symbols apart reliably: the more there are, the closer their measurement regions crowd together.
  > Exactly, and this is where two ideas interlock: the measure of information says what a larger alphabet buys, and the distance between regions says what it costs. Where the balance lies is decided by noise, ambient light and measurement.
- [ ] Because an alphabet needs only as many symbols as the text has distinct characters; further colours would go unused.
  > Character set and alphabet are not tied like that: more colours per symbol means fewer symbols per character, hence faster. Nothing would go unused; the limit lies with the receiver, not the text.

> A larger alphabet carries more per symbol until noise makes neighbouring symbols indistinguishable.

## A receiver recognises every colour without error; recognition accuracy is 100 percent. Yet the resulting text is nonsense. What is the most likely cause? {#si-008}

- [ ] The sensor delivers distorted readings, for instance because the gain is set too high.
  > Distorted readings would already spoil the recognition of the colours. But that is flawless, so the fault lies behind it.
- [x] Sender and receiver use different mappings from colours to characters.
  > Exactly: the signal arrives perfectly, but the agreement is broken. Meaning is not in the light but in the mapping, which must be identical on both sides. A classic after sender and receiver code were written separately.
- [ ] Ambient light shifts the readings, so the receiver sees the colours but sorts them into the wrong regions.
  > Colours sorted into the wrong regions would be recognition errors, and those would not be at zero. Recognition here is flawless; the fault lies behind it.
- [ ] The alphabet has fewer colours than the text has distinct characters, so several characters end up on the same colour.
  > Nobody maps it like that. A small alphabet maps characters to groups of symbols, which makes the transmission slower, not wrong.

> Perfect reception with different tables gives perfect nonsense.

## An alphabet has 16 symbols. At most how many yes/no questions are needed to determine a received symbol with certainty? {#si-009}

- [x] 4, because halving four times leads from 16 possibilities to one.
  > Exactly: 16, 8, 4, 2, 1. The same calculation as guessing a card by halving, and at the same time the statement that a symbol out of 16 carries 4 bits.
- [ ] 8, because each question halves, and half of 16 possibilities is 8.
  > Halving does not mean halving the count once but counting how often you can halve. For 16 that is only four steps.
- [ ] 15, because in the worst case you have to rule out 15 symbols one by one.
  > That is asking one by one. It works, but it is the slow procedure; with clever questions, half of the candidates drop out with every answer.
- [ ] 2, because every question has two answers, and two times two answers cover 16.
  > Two questions separate only four possibilities, two times two. For 16 you need four doublings.

> The number of halvings is log₂(16) = 4, and that is also the number of bits.

## Which statements about bits are true? (Several answers may be correct.) {#si-010}

- [x] One bit distinguishes exactly two possibilities.
  > Exactly, that is the definition: on or off, yes or no, bright or dark.
- [ ] A bit and a byte denote the same amount, just in different contexts.
  > A byte is eight bits. Confusing the two throws every size estimate off by a factor of eight.
- [x] Any information can be represented as a sequence of bits.
  > Correct, and that is why one and the same technology can carry text, pictures and sound. How the mapping works in detail is a question of codes.
- [ ] Bits exist only in computers, because only there are states stored electrically.
  > A light switch, a coin toss, a raised flag: each is one bit, no computer involved. Bits count possibilities, whatever they live in.
- [ ] A message contains more bits if its content is more important.
  > Information measures possibilities, not importance. A "yes" at the altar and a "yes" at the deli counter carry the same single bit.

> Bits count possibilities, independent of hardware and of importance.

## An alphabet has four colours, so each symbol carries 2 bits. A 12-bit identifier is to be transmitted. How many symbols does that take at least? {#si-011}

- [ ] 12, one symbol per bit.
  > That would be the case with only two colours. Four colours pack two bits into each symbol, which halves the length.
- [x] 6, because 12 bits divided by 2 bits per symbol.
  > Exactly, and this division is half of every throughput calculation: bits divided by bits per symbol gives the number of symbols, and times the seconds per symbol the duration.
- [ ] 3, because 12 divided by 4 colours.
  > You divide by bits per symbol, not by the number of colours. Four colours carry 2 bits, not 4.
- [ ] 24, each bit twice to be safe.
  > Securing by repetition is a real technique, redundancy, but a separate decision. The question asked for the minimum.

> Bits divided by bits per symbol gives the number of symbols.

## Why is an alphabet of just two symbols in principle enough for any message, however complicated? {#si-012}

- [ ] It is not enough: text needs at least 26 symbols.
  > The way out is grouping: five two-way symbols give 32 combinations, more than enough for 26 letters.
- [ ] Because two symbols lie furthest apart in the signal, so the receiver never confuses them.
  > True, but it does not answer the question: being recognisable robustly is not the same as being expressive. That two symbols suffice for any message is due to grouping, not to the gap.
- [x] Because every symbol of a larger alphabet can be replaced by a fixed group of two-way symbols; it only costs length.
  > Exactly, and that is why the bit is the universal currency: everything can be exchanged into binary decisions. For the same reason, a standard defined in bits rather than colours even survives swapping the carrier, say sound instead of light.
- [ ] Because computers work with two states internally anyway, so every message is already in that form before sending.
  > That is an observation, not a reason: computers work that way because grouping works, not the other way round.

> What a large alphabet achieves per symbol, two symbols achieve in a group.

## In terms of symbols and information, what does this dictionary establish? {#si-013}

```python static
ALPHABET = {
    "red":    "00",
    "green":  "01",
    "blue":   "10",
    "yellow": "11",
}
```

- [ ] The four colours a lamp can produce, each with the code the manufacturer assigned to it.
  > A lamp can produce far more colours than listed, and the codes come from whoever wrote the table, not from a manufacturer. The dictionary selects and assigns; it describes no limit of the hardware.
- [x] The agreement: which symbol carries which group of bits. The receiver needs exactly the same mapping, only in reverse.
  > Exactly: this is an alphabet as a code, four symbols of 2 bits each. These lines are one half of the agreement, and if sender and receiver differ in even one entry, perfect reception becomes perfect nonsense.
- [ ] The order in which the colours are sent: first red, then green, then blue, then yellow.
  > The order is determined by the message, not the dictionary. This only says what each colour means; when it appears is decided by the text.
- [ ] How many symbols are sent per second, because two bits per symbol determine the pace of the transmission.
  > Bits per symbol say how much a symbol carries, not how long it lasts. The dictionary says nothing about time, and deliberately so: the meaning of the symbols and the pace of the transmission are separate decisions.

> The dictionary is the agreement in code, and it has to exist identically on both sides.

## Sixteen faces, one of them is the secret. Question A is "does it wear glasses?", and eight of the sixteen do. Question B is "is it face number 7?". Which question is worth more on average? {#si-014}

- [x] Question A: it yields a guaranteed 1 bit, question B only about a third of that on average.
  > Question A halves the field no matter how it turns out: 16 become 8, exactly 1 bit. Question B resolves everything in one case out of sixteen (4 bits) but leaves 15 possibilities in the other fifteen, which buys almost nothing. On average that is about 0.34 bits.
- [ ] Question B: a yes solves the puzzle completely at once, which A can never do.
  > True for the rare lucky case, and this is the most common misconception. But you do not get to choose which answer you receive, and in fifteen cases out of sixteen you learn almost nothing. Count what a question yields on average, not at its best.
- [ ] Both the same: they are both yes/no questions, and a yes/no answer is one bit.
  > One bit is the ceiling of a yes/no answer, not its value. It is reached only when both outcomes are equally likely, and the more lopsided the question, the less of it remains.
- [ ] That depends on luck and cannot be said in advance.
  > The single outcome depends on luck, the expected value does not. That is exactly why questions can be compared before you ask them, and why halving is the best strategy.

> Only a question that splits the field in half is worth a whole bit; the expected value of a lopsided one is far lower.

## In Morse code the most common letter, "e", is also the shortest: a single dot. Rare letters like "q" are long. Why does that unequal treatment pay off? {#si-015}

- [ ] Because short codes are less error-prone, so the most common letter should be the best protected.
  > If anything it is the other way round: a single dot is easier to miss than a long sequence. The gain is not in safety but in the length of the whole message.
- [ ] Because "e" is the most important letter and important letters should arrive first.
  > Common is not the same as important, and the order of the letters does not change either way. All that matters is how often a letter occurs.
- [x] Because it makes the average message shorter: what occurs often then costs little.
  > Exactly the point. When letters are not equally likely, a rare letter carries more information than a common one, so it may also take up more room. Every compression scheme rests on that observation.
- [ ] Because an alphabet with codes of different lengths can hold more letters than one with equal lengths.
  > The number of letters that can be represented depends on the length, not on its unevenness: codes of equal length with the same maximum length can represent at least as many. The gain from unequal lengths lies in the average.

> Frequent symbols get short codes, so the average message gets shorter.

## A link can reliably manage only two symbols, bright and dark. It is still supposed to transmit an alphabet of 32 characters by grouping several flashes. How many flashes does one group need at least? {#si-016}

- [ ] 16, half the number of characters.
  > The number of flashes does not grow in proportion to the number of characters but logarithmically: each extra flash doubles the number of groups instead of adding two. 16 flashes would cover 65,536 characters.
- [x] 5, because two to the fifth is 32.
  > Each flash carries one decision between two possibilities, so one bit; five flashes carry five bits and thus tell 32 groups apart. That is the halving calculation read backwards.
- [ ] 32, because every character needs one flash.
  > That would be the case if every character had its own symbol, but there are only two symbols. Grouping several flashes is precisely the way around that.
- [ ] 6, because one extra place is needed to separate the groups.
  > Not a foolish thought, since the receiver has to separate the groups somehow. But the fixed length does that job by itself: if every group has five flashes, the receiver simply counts along. A separator is only needed when groups may differ in length.

> n flashes with two possibilities give 2ⁿ groups, and 2⁵ = 32.
