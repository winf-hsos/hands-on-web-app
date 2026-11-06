# Lecture notes: number systems

This text explains the slides "number systems" for reading afterwards. It follows the order of the slides, and the references count frames (every build-up step is a frame of its own), but it can also be read without the slides. The lessons [[place-value-systems]], [[binary-numbers]], [[why-two-states]], [[hexadecimal]] and [[binary-prefixes]] treat the same material in more detail.

One scheme carries the whole deck: the digits at the top, the place values below them, the sum at the bottom. It comes three times, with base 10, base 8 and base 2, and after that twice more, with base 16 and with colours. Once you have seen it, you can read any base without learning a new rule.

## Why do we count to ten? (Frame 4)

Ask around why our number system has ten digits, of all numbers. The answers usually come out reverent: because it divides nicely, because it is mathematically practical, because that is how it grew.

The right answer is more banal, because we have ten fingers and that is all. There is no constant of nature in it and no special property of ten, only anatomy.

That is the hook for everything that follows. If the ten is a coincidence, then it can be done differently, and everything that seems self-evident about the way we write numbers falls into two parts: one that is pure convention, and another that is mathematics and works the same way in every system.

## What 123 really says (Frames 5 and 6)

Take the number 123. What does it actually say?

Not "one, two, three". It says one hundred, two tens and three ones. Every place carries a power of ten, and the digit only says how often that power occurs.

    1 · 100  +  2 · 10  +  3 · 1  =  123

Everybody knows that, but hardly anyone has ever written it down like this. Exactly this recipe is called a **place value system**, and it is the only reason ten digits are enough for infinitely many numbers: instead of inventing a new symbol for every number, you give the position a meaning.

## The eight-finger creature writes 123 (Frames 7 and 8)

Now picture a creature with eight fingers. It invented the same procedure, but it counts to eight before the place overflows. It also writes `123` on a sheet of paper.

Which number does it mean? Work it out before you read on.

The same scheme, only with powers of eight instead of powers of ten: 64, 8, 1.

    1 · 64  +  2 · 8  +  3 · 1  =  83

The same three digits and the same procedure give a different number. From this follows something that carries the rest of the deck: a string of digits on its own means nothing at all, as long as the base is not written next to it.

## Two flippers: counting in binary (Frames 9 to 17)

The dolphin in Frame 9 has two flippers, so its number system knows exactly two digits, 0 and 1. On the slide the dolphin's numbers appear one row at a time, with a question mark where the next one will be, so that you can guess each before it is shown.

| us | the dolphin |
| --- | ---------- |
| 0 | 0 |
| 1 | 1 |
| 2 | 10 |
| 3 | 11 |
| 4 | 100 |
| 5 | 101 |
| 6 | 110 |
| 7 | 111 |
| 8 | 1000 |

Count along. At the step from 1 to 10 most people hesitate for a moment before they see that this is exactly what happens for us between 9 and 10: the digits are used up, so a new place is opened. With two digits it just happens all the time, and the numbers get long quickly.

## The dolphin writes 110 (Frames 18 to 21)

The scheme for the third time, now with powers of two: 4, 2, 1.

    1 · 4  +  1 · 2  +  0 · 1  =  6

`110` is not one hundred and ten. If you have come along this far, you can read any base, because there is no new rule any more: it is always digit times place value, added up.

Then a fourth place appears on the left, with a question mark instead of its value. What is it worth? Every place is worth twice its right-hand neighbour, so after 4, 2 and 1 comes 8, and the slide resolves the question mark with the next step.

## Why two, of all things? (Frames 23 and 24)

A computer could in principle use any base. Decimal computers really did exist, and they died out. Why?

The answer is not mathematics but engineering. Imagine a wire carrying a voltage between zero and five volts. If you want to send ten digits, you have to cut this range into ten compartments, each half a volt wide. If you want to send two digits, there are two compartments of two and a half volts.

Every real wire wobbles: cables act as antennas, components warm up, power supplies hum. The same wobble that never matters with two compartments regularly throws the digit into the neighbouring compartment with ten. The more states have to fit into the same range, the smaller the gaps, and the sooner noise wins.

Two states are the cheapest thing you can build reliably: on and off, current and no current, bright and dark. The price for that is more places, and places are cheap.

## Three generations of the same switch (Frames 25 to 28)

The history of the computer confirms this, because every computer ever built consists of switches with two states. The first ones were **relays**: an electromagnet pulls a contact closed, with an audible click. Konrad Zuse's Z3 of 1941 used about 2,600 of them. Then came the **vacuum tube**, which switches without moving parts and therefore about a thousand times faster; the ENIAC of 1945 had 17,468 of them, and they burnt out constantly. The **transistor**, invented in 1947, is the same switch made of a semiconductor, and it became so small that billions of them fit on a single chip today. The technology changed three times, and the principle stayed the same: on or off.

## Eight bits make a byte (Frames 29 and 30)

The same scheme with eight places. The place values are 128, 64, 32, 16, 8, 4, 2, 1, each place double its right-hand neighbour.

    0 1 0 0 0 0 0 1   →   64 + 1 = 65

Eight places with two possibilities each give 2⁸ = 256 values, read as a number 0 to 255. That is why colour channels in image editing run from 0 to 255: one channel is exactly one byte.

The word **bit** is also a measure of information, and here it turns up as a digit, as binary digit. That is no coincidence and no pun: a place with two possible values holds exactly one yes/no answer, so the container is named after its content. The distinction is still useful, though, because a container can also be half empty, and compression lives from exactly that.

## Try it: eight switches, one number (Frame 31)

The [byte switchboard](https://hands-on-computer-science.de/cs/en/items/byte-switchboard/) has eight switches, and the number follows along. Three questions are worth asking there: Which switch changes the number the most? How do you set 255, and how 1? And what happens if you count one step past 255?

## You have seen these before (Frames 33 and 34)

Nobody can read eight zeroes and ones at a glance, and there is a shorthand for that which turns up everywhere in computing: the colour `#ECAB03` on a web page, the address `3C:22:FB:9A:01:7E` of a network card, `U+00E4` for the letter ä in Unicode, the Windows error code `0x80070005`, and `89 50 4E 47` at the start of every PNG file. What do these strings have in common? They consist only of the digits 0 to 9 and the letters A to F. They are numbers, written with sixteen digits instead of ten.

## Sixteen fingers: counting in hex (Frames 35 to 38)

To read them, all you need is a creature with sixteen fingers, such as the alien in Frame 35 with four hands of four fingers each. It counts to fifteen before a place overflows, and so it needs sixteen different digits. Up to 9 it writes what we write. For ten our digits are used up, so six letters are borrowed: A stands for 10, B for 11, and so on up to F for 15. After F the alien runs out of digits too, and the same thing happens as for us between 9 and 10 and for the dolphin between 1 and 10: a new place opens, and `10` means sixteen.

| us | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| the alien | 9 | A | B | C | D | E | F | 10 | 11 |

## The alien writes 123 (Frames 39 and 40)

The scheme for the fourth time, now with powers of sixteen: 256, 16, 1.

    1 · 256  +  2 · 16  +  3 · 1  =  291

Hexadecimal is therefore not a new principle but the same place value system with a larger base.

## Hexadecimal: four bits at a time (Frames 41 to 43)

The reason for sixteen, of all numbers, lies in the byte. Four bits have 2⁴ = 16 states, and 16 is exactly the number of hex digits. So one hex digit fits a packet of four, and a whole byte fits into two digits:

    1101 0010   →   D2

Read back with the recipe of base 16, D2 is 13 · 16 + 2 = 210, the same number that the eight bits give with powers of two. Hex is only a reading aid for bytes, and once you have seen it, you can read any hex dump.

## The same file, twice (Frames 44 and 45)

The first sixteen bytes of a PNG file, on the left in hexadecimal, on the right the same bytes as characters, with a dot for every byte that is not a printable character. Two things can be seen there. The first bytes give away what kind of file it is: every PNG file starts with `89 50 4E 47`, and the three bytes in the middle are the letters P, N and G. And between the readable positions there are just as many unreadable ones, which are the same stuff. A file is nothing but a sequence of numbers.

With that, the colour notation `#ECAB03` also becomes something you can work out: three bytes, two hex digits each, one byte per colour channel.

## Try it: look inside any file (Frame 46)

The [hex viewer](https://hands-on-computer-science.de/cs/en/items/hex-viewer/) shows any file from your own computer in the same two columns, and the file never leaves the browser. Three questions are worth asking there: How do a photo, a PDF and a Word document begin? Where in a text file do you find the line breaks? And how many bytes does an umlaut take, and how many an emoji?

## Two ladders of units (Frame 47)

The decimal ladder takes a factor of 1000 per rung: kilobyte, megabyte, gigabyte, terabyte. The binary ladder takes 1024, because memory is organised in powers of two and 2¹⁰ = 1024 is the round binary number closest to 1000.

| Step | decimal | | binary | |
| ----- | ------- | ----- | ----- | ----- |
| Byte | 10⁰ | 1 | 2⁰ | 1 |
| Kilo | 10³ | 1 000 | 2¹⁰ | 1 024 |
| Mega | 10⁶ | 1 000 000 | 2²⁰ | 1 048 576 |
| Giga | 10⁹ | 1 000 000 000 | 2³⁰ | 1 073 741 824 |
| Tera | 10¹² | 1 000 000 000 000 | 2⁴⁰ | 1 099 511 627 776 |

Written as powers, the difference is plain: the decimal ladder climbs in steps of 10³, the binary one in steps of 2¹⁰, and 2¹⁰ is 1024, not 1000.

In everyday speech both ladders have the same names. If you want to be precise, you say kibibyte, mebibyte, gibibyte for the binary rung, but almost nobody does, and that is where the puzzle on the next slide comes from.

## The missing 69 gigabytes (Frames 48 and 49)

The box says 1 terabyte. You install the disk, and the computer shows 931 gigabytes. Who is cheating here?

Guess first, before you read on.

Nobody is cheating. The manufacturer counts up the decimal ladder, and for them a terabyte is a trillion bytes. The operating system takes exactly the same trillion bytes and divides it down the binary ladder, by 1024³, and arrives at 931. Not a single byte is missing. Every rung adds 2.4 percent to the gap, so it is 7.4 percent at giga and 10 percent at tera, and both sides call their rung a gigabyte. That is not fraud but a word problem.

## Colours can be digits too (Frames 51 to 53)

Digits do not have to look like digits. If you can reliably tell four colours apart, you have four digits and work in base 4. Decide which colour is which digit, say red for 0, green for 1, blue for 2, yellow for 3. Then the colour sequence red-yellow-green is the number

    0 · 16  +  3 · 4  +  1 · 1  =  13

and with three places 4³ = 64 combinations are available, enough for an alphabet of 26 letters.

Two things follow. The order is part of the message: red-yellow-green and green-yellow-red are different code words, for exactly the same reason that 123 and 321 are different numbers. And the arithmetic works in both directions: if you know how many characters you have to distinguish, you can work out how many places you need, and if you decide on a number of colours, you know at once how long your code words will be.

## Ten was never special (Frames 54 and 55)

The closing sentence is the opening sentence seen from the other side. Ten is the number of fingers on two hands, and nothing else.

Once you have seen that, you will no longer think of any base as natural, or of any as difficult. Binary, hexadecimal and a colour system are the same procedure with different digits.
