---
type: quiz
code: 9351
title: "Quiz: sampling and synchronization"
summary: >-
  Fifteen questions on why a faster link breaks sooner, on drifting clocks and
  the sensor's measuring window, on markers and what they cost, on real links
  from the serial port to the mouse wheel, and on the change as the beat and
  its price in bits. Every answer comes with its reason.
level: 1
duration: 20
topics: [transferring-information]
modules: [dup]
relations:
  checks: [sampling-and-synchronization]
  see_also: [sampling-and-synchronization-slides]
questions: [ca-002, ca-001, ca-003, ca-011, ca-015, ca-010, ca-009, ca-012, ca-013, ca-007, ca-005, ca-006, ca-014, ca-008, ca-004]
status: published
updated: 2026-11-23
---

## Eighty musicians start together but without a conductor; after a minute they no longer play together. When someone gives the beat again and again, they stay together. What does that show? {#ca-002}

- [ ] The cue was not clear enough; with a sharper common start the orchestra would have stayed together.
  > Even with the sharpest start it drifts apart: everyone has their own tempo, and small differences add up with every beat. A better beginning only delays the drift, it does not prevent it.
- [x] An agreement at the start is not enough; recurring markers keep two clocks together.
  > Exactly, and the same holds for computers, only more slowly: a common start carries for a while, then you need either regular markers or a method that works without a shared clock at all.
- [ ] People cannot keep time, computers with a quartz clock can; for two devices the common start is therefore enough.
  > Computer clocks drift too, just orders of magnitude more slowly. That is exactly why it goes unnoticed at one symbol per second and shows at ten.
- [ ] Every member would only need a metronome of their own, all set to the same tempo.
  > A metronome of one's own is a clock of one's own, and eighty metronomes drift apart too, only more slowly than people. What keeps them together is a beat that everyone gets from the same place.

## A link sends colors with an LED and reads them with a color sensor. At one symbol per second it runs stably; at ten per second it breaks down. What causes this? (Several answers may be correct.) {#ca-001}

- [ ] The clocks of sender and receiver drift apart, and the error adds up over the symbols.
  > That is true, but it happens just the same at one symbol per second: the clocks drift apart at the same pace however fast the link sends. On its own it therefore does not explain why the link only breaks at ten symbols; the difference lies in how much room a symbol leaves for the error.
- [ ] The LED needs time to switch, and at ten color changes per second it can no longer keep up.
  > An LED switches in microseconds; ten changes per second are nothing for it. The limit lies in measuring, not in lighting.
- [x] Once a symbol gets shorter than the sensor's measuring window, the sensor blends two symbols into one value.
  > Correct, and this is the second, often overlooked problem: the sensor averages over its integration time. If a color change falls inside that window, the result matches no color.
- [ ] The computer can no longer finish ten readings plus comparisons per second in time, and the delay grows with every symbol.
  > Ten comparisons per second are trivial for any computer. The problem lies in the physics of measuring and in the drifting clocks.
- [x] The reading sits in the middle of a symbol and may slip by half a symbol at most, which at ten symbols per second is only 50 ms instead of 500 ms.
  > Correct: the clock error grows at the same pace at both rates, but at ten symbols per second it has only a tenth of the room. Two clocks that differ by 0.5 % last 100 seconds at one symbol per second and only 10 at ten.

## A color sensor uses a 50 ms integration time. The sender sends 25 symbols per second, so each symbol lasts 40 ms. What does the receiver get? {#ca-003}

- [x] Every reading contains parts of two symbols; the values fall between the colors, and recognition becomes unreliable.
  > Exactly: the window is longer than a symbol, so a color change always falls inside it. The sensor averages over it and returns a value that matches no color. Remedy: send more slowly or shorten the integration time, which in turn increases the scatter.
- [ ] About every second symbol is lost because the sensor only completes a reading every 50 ms; the rest arrive cleanly.
  > It does not behave that neatly. Individual symbols are not lost; the readings themselves become blends that match no symbol.
- [ ] Nothing unusual, as long as sender and receiver use the same rate; the integration time then no longer matters.
  > The same rate helps against drift but not against a measuring window that is too long. Even with perfectly equal rates the sensor averages across the change.
- [ ] The sensor notices that the color changed during the reading and returns no valid value for it.
  > It notices nothing; it dutifully returns a number. The sensor knows no symbols and no changes, it merely sums the light within its window. That is what makes this failure treacherous: the reading looks valid and is still meaningless.

## The clocks of two computers differ by 0.5 %. After a shared start they send 10 symbols per second, so a symbol lasts 100 ms, and the receiver reads in the middle of each symbol. After how long does it read in the wrong symbol? {#ca-011}

- [ ] After 200 seconds: 0.5 % is one two-hundredth, so after 200 symbols the error is one symbol wide.
  > Symbols and seconds are swapped here. The clock error grows with elapsed time, not with the number of symbols: 0.5 % of 200 seconds would be 1 second, that is ten whole symbols.
- [ ] After 20 seconds: only then is the accumulated error as large as a whole symbol.
  > The arithmetic is right, the threshold is not. The reading sits in the middle of its symbol and leaves it as soon as the error reaches **half** a symbol. Long before a whole symbol, nonsense has been arriving.
- [x] After 10 seconds: 0.5 % of 10 seconds is 50 ms, and that is half a symbol.
  > Exactly. This shows why the problem depends on speed: at one symbol per second half a symbol is 500 ms long, and the same clocks would last a hundred seconds.
- [ ] Never, as long as both sides have agreed on the same rate.
  > Agreed is not achieved. Both sides *intend* 10 symbols per second, but each counts with its own clock, and no two clocks run exactly alike.

## Two clocks differ by 0.5 %, and the link sends 10 symbols per second, so 100 ms per symbol. The sensor reads with a window of 20 ms that sits in the middle of the symbol and has to fit into it entirely. After how long does the receiver read wrongly? {#ca-015}

- [ ] After 10 seconds: then the error has reached the 50 ms to the symbol border.
  > That holds for a reading with no width. The window, however, reaches 10 ms past the middle on either side and therefore hits the border sooner.
- [x] After 8 seconds: from the middle to the border is 50 ms, half the window takes 10 ms of it, so 40 ms remain, and 0.5 % of 8 seconds is 40 ms.
  > Exactly. Half a symbol is the most room a reading can have, and the measuring window takes some of it. A real link therefore never tips later than the calculation with half a symbol says.
- [ ] After 6 seconds: the whole 20 ms of the window come off the 50 ms to the border, leaving 30 ms.
  > The window sits in the middle and reaches only half its width, 10 ms, to either side. So half of it is subtracted, not the whole window.
- [ ] After 16 seconds: a symbol is 100 ms long, and without the window 80 ms of room remain.
  > The 80 ms are split between both sides of the window. The clock drifts in one direction only, though, so only one side counts, 40 ms.

## A color sensor's integration time is set to 50 ms. We need a symbol rate at which every reading falls entirely inside one symbol, even when the clocks drift a little. Which one fits? {#ca-010}

- [ ] 20 symbols per second: then a symbol is exactly 50 ms long, the same length as the measuring window.
  > With equal lengths the reading would have to sit exactly on the symbol, and it never does: as soon as it slips by a millisecond, a color change falls inside it. Equally long already means too fast.
- [x] 10 symbols per second: then a symbol is 100 ms long, twice the window, and the reading has room to move.
  > Exactly: the symbol has to be clearly longer than the window, not merely as long, or a little drift is enough to produce a mixed reading. Here 25 ms remain on each side of the window. The factor of two is a rule of thumb, not a law of nature; what a link really tolerates shows in a measurement.
- [ ] As fast as possible; the integration time is then set shorter to match.
  > A shorter window is possible, but it costs what already held for noise: the shorter the window, the more the readings scatter. That trades one problem for another rather than solving one.
- [ ] The rate does not matter as long as sender and receiver use the same one.
  > The same rate helps against slipping, not against mixing. The sensor averages over its window no matter how good the agreement is; if the symbol is shorter, every reading contains a color change.

## The clocks of sender and receiver drift so far apart that a marker has to follow every eight data symbols. The link sends 10 symbols per second with an alphabet of 4 colors. How many payload bits arrive per second? {#ca-009}

- [x] About 17.8 bit/s: eight out of every nine symbols carry data, and 10 times 2 times eight ninths is 17.8.
  > Exactly. Four colors carry 2 bits per symbol, which would be 20 bit/s; a ninth of that, about 11 %, goes to the markers. Whether that is worth it depends on how far the clocks really drift apart, and that is a question for a measurement.
- [ ] 20 bit/s: the marker is sent on top and costs no data time.
  > There is no alongside. The link shows one color at a time, and while the marker shines, no data symbol does. Every marker occupies a slot that data would otherwise have had.
- [ ] 17.5 bit/s: an eighth of the symbols are markers, so seven eighths of 20 bit/s remain.
  > This counts the marker as if it were the eighth data symbol. It comes after eight data symbols, though, so it is the ninth: one in nine symbols is a marker, not one in eight.
- [ ] 20 bit/s, if one of the four colors serves as the marker; then nothing is lost.
  > Then the marker cannot be told apart from a data symbol, and the receiver aligns its symbol borders in the wrong place. A marker has to be a symbol that does not occur in the data, such as a short dark pause, and it still costs its slot.

## A serial port (UART) sends every byte with a start bit before it and a stop bit after it. Why is it enough for the clocks of both sides to be accurate to a few per cent? {#ca-012}

- [x] At the change from 1 to 0 at the start bit the receiver restarts its clock, which then only has to hold for about ten bits.
  > Exactly: the start bit is a marker before every byte. Up to the stop bit it is ten bits, and an error of a few per cent grows to far less than half a bit in that time. Then the line rests, and the next start bit sets the clock back to zero.
- [ ] The start bit carries the sender's rate, and the receiver sets its clock to it.
  > The rate is agreed beforehand, for instance 9600 bits per second; the start bit carries no value. It only supplies a moment at which the receiver starts counting again.
- [ ] The receiver reads every bit several times and takes the majority, so the clock errors average out.
  > Reading several times helps against noise, not against a clock that is always off in the same direction. Its error adds up however often you read; only a marker resets it.
- [ ] A separate wire in the cable carries the sender's clock, so the receiver needs no clock of its own.
  > A separate wire for the clock is exactly what UART does not have, only one wire per direction. That is why the receiver needs its own clock and the marker before every byte.

## Which of these links keep a shared beat that the receiver resets again and again? (Several answers may be correct.) {#ca-013}

- [x] The serial port (UART) with a start bit before every byte.
  > Correct: every bit has an agreed length, and the start bit is the marker at which the receiver restarts its clock.
- [x] Early ethernet (10BASE-T) with the Manchester code, which changes in the middle of every bit.
  > Correct: every bit lasts exactly 100 ns, so there is a beat. The change in the middle of every bit resets the receiver's clock in every bit, more often than any other method.
- [x] USB 1 and 2, where the sender inserts an extra 0 after six ones.
  > Correct: every bit has a fixed length, and the inserted 0 forces a change at which the receiver resets its clock. Bit stuffing costs at most a seventh of the rate, much like a marker.
- [ ] The rotary encoder of a mouse wheel, whose two sensors run through the states 00, 01, 11 and 10 as it turns.
  > The rotary encoder works without any clock: the direction lies in which neighboring state follows, and how fast the hand turns does not matter. It belongs to the second way, where the change itself is the beat.

## A sender codes with changes, but like this: each color is a symbol, and a color change merely means "the next symbol starts here". What problem does this method have? {#ca-007}

- [ ] It is slower than a transmission with a fixed beat, because each symbol only counts as complete with the next change.
  > It is true that a symbol is only settled with the next change, but that does not make it slower: the sender changes as fast as the receiver reliably sees the changes. The problem lies elsewhere.
- [x] Two equal symbols in a row produce no change and arrive as one.
  > Exactly: "red red" looks to the receiver like one long "red". That is why in the better method the change carries the information, not the color: once the current color is excluded as a successor, the case cannot occur any more.
- [ ] The receiver still needs a shared clock to know when the next change is due.
  > A clock in the sense of a shared beat is not needed. One timing decision remains, though: how long must a color hold still to count as a new state rather than an intermediate value during the change?
- [ ] It only works with exactly two colors, because with more colors the receiver cannot tell which change is meant.
  > The number of colors is not the problem: any change is a change, whichever colors are involved. With two colors it would even be worse, because then every repeat swallows a change.

## A sender codes without a shared clock: it uses three colors, and the information is carried not by the color itself but by the change to the next one. From each color two successors are allowed, standing for 0 and 1. What is the price of this freedom? {#ca-005}

- [ ] None: the number of colors stays the same, and since no beat is needed any more, even the markers fall away.
  > The number of colors does stay the same, but not every color may follow every other. That restriction costs capacity per change. What is saved on markers is paid for here.
- [ ] The receiver has to read much more often than the sender changes, so that no change escapes it.
  > Reading more often than the sender changes is required in every method, including one with a beat and markers. That is the ordinary price of measuring, not the price of this freedom.
- [x] Each change carries only 1 bit instead of the 1.58 bits three states could carry.
  > Exactly: the current color is excluded as a successor, so of three colors two choices remain, which is 1 bit. In general a change carries log2(k − 1) bits instead of log2(k). Freedom from the clock is paid for with capacity, and that is often a good deal.
- [ ] The method is tied to three colors, because with more colors 0 and 1 can no longer be assigned unambiguously to the successors.
  > It works with three colors or more; more colors even yield more bits per change, because more successors are available. With five colors it is a clean 2 bits per change, and the assignment stays unambiguous.

## A sender codes with color changes (the current color is excluded as a successor) and wants to transmit 2 bits per change. How many colors does its alphabet need? {#ca-006}

- [ ] Two, one color per bit value; the change between them merely marks the border.
  > With two colors there is only one allowed successor from each. The change is then predictable and carries no information at all.
- [ ] Four, because 4 equals 2 squared.
  > The reflex towards powers of two misleads here: of four colors only three successors remain, which is 1.58 bits. One color is missing.
- [x] Five, because then four successors are allowed from each color.
  > Exactly: you need 2 squared, that is four choices, and because the current color drops out you need one more. Coding with changes therefore calls for an alphabet of size 2 to the power n plus 1, not 2 to the power n. The price is one extra color that must be reliably distinguishable.
- [ ] Eight, as for an ordinary alphabet carrying 3 bits.
  > Eight colors would be plenty (seven successors, 2.8 bits per change) but needlessly many and thus needlessly hard to tell apart.

## A mouse wheel contains a rotary encoder with two sensors, A and B. As it turns, they run through the states 00, 01, 11 and 10 in a circle. Why does the computer need no clock for this? {#ca-014}

- [x] The direction lies only in which neighboring state comes next, and the computer reacts only to changes.
  > Exactly: only one sensor changes at a time, so each state has two allowed successors, one notch forward or back. How fast or slowly the wheel turns does not matter, because changes are counted, not stretches of time.
- [ ] The mouse sends its states at a fixed rate that the computer knows.
  > A fixed rate would be a beat, which is exactly what the encoder does not need. A notch may take a millisecond or a minute, and the computer still recognizes it.
- [ ] A hand turns evenly enough that every notch takes about the same time.
  > A hand turns anything but evenly, and it does not need to. The encoder relies on no duration, only on the order of the states.
- [ ] Both sensors always change at the same time, and this joint change replaces the beat.
  > The opposite: only one of the two sensors changes at a time. That is why the state across never comes directly, and the direction stays unambiguous.

## A team codes without a clock, using color changes, and concludes: "We do not have to think about time at all any more." Why is that wrong? (Several answers may be correct.) {#ca-008}

- [x] During a color change the sensor reads blended values; the team must decide how long a color has to hold still before it counts.
  > Correct: without this threshold the receiver counts the intermediate values of the change as states of their own and invents symbols. The clock is gone, the timing decision is not.
- [ ] Without a clock the receiver has no count of which symbol is due; the order of the symbols can then no longer be determined reliably.
  > The order follows from the order of the changes, which is preserved. That is precisely the strength of the method.
- [x] How many changes per second are possible still decides the throughput, and the measuring window and scatter apply as before.
  > Correct: without a clock does not mean arbitrarily fast. The sensor needs its integration time per reading, and changes that come too fast blur just as with a beat.
- [ ] The receiver still has to read at the very moment the sender changes, otherwise its reading lands in the middle of a change.
  > That is exactly what falls away, and it is the whole gain of the method. The receiver may read whenever it likes; it only reacts to changes. A reading in the middle of a change is no disaster but the reason for the threshold before a color counts.

## A sender sends 5 symbols per second with an alphabet of 4 colors and a shared beat. How long does a 2 KiB file (16,384 bits) take at least? {#ca-004}

- [ ] About 55 minutes: 1 bit per symbol, so 5 bit/s.
  > That is the calculation with 1 bit per symbol, that is, with only two colors. Four colors carry 2 bits.
- [x] About 27 minutes: 2 bits per symbol, so 10 bit/s.
  > Exactly: four colors carry 2 bits per symbol, times 5 symbols per second gives 10 bit/s. 16,384 bits divided by 10 is 1638 seconds, a good 27 minutes. The calculation t = n / (r · b) has exactly two levers, symbols per second and bits per symbol.
- [ ] About 14 minutes: 4 bits per symbol, so 20 bit/s.
  > That is the calculation with 4 bits per symbol. Four colors carry 2 bits, not 4: what counts is how often you halve, not the number of colors itself.
- [ ] That can only be said once the link's error rate is known.
  > Errors lengthen the time through repeats, but the question asked for the minimum. And without this basic calculation you cannot judge whether a repeat is worth it.
