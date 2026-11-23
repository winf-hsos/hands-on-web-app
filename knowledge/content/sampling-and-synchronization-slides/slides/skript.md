# Lecture notes: sampling and synchronization

These notes accompany the stagekit deck "sampling and synchronization" and explain its contents for reading afterwards, in the order of the slides. Build-up steps and the segments of an animation count as frames of their own in the player and in the export (71 frames in all), so the references point to frames. The deck was written on 2026-11-23, taking its starting point from the LiFi deck of the same name.

The core message: a receiver only sees light and has to find out by itself when the next symbol begins. There are two basic answers, a shared beat that is set again and again with markers, or a change in the light that serves as the beat, and each of them has a price that shows up in the time a file needs. Real links use both, from the serial port to USB.

## Part 1: why fast breaks

**The orchestra (Frame 4).** Every musician in an orchestra can keep time, and yet without the person with the baton they would drift apart within a minute. That is not a lack of skill: small differences in tempo add up, and nobody notices their own error. Two computers that send each other light have exactly this problem.

**What the receiver sees (Frames 5 to 7).** At the top the sender switches seven symbols of equal length with clear borders. The next step shows what arrives: one continuous band of light without borders, in which each change is a short blend, because the LED does not switch in zero time and the sensor's window overlaps the change, and in which two equal colors in a row merge into one long stretch. The last step lays the sender's borders over it, and at the question marks the receiver sees no change at all. How is it to know when the next symbol begins? That question runs through the whole deck.

**Cause one: no two clocks run alike (Frames 8 to 10).** The top row shows the time slots of the sender, the bottom row the readings of the receiver. Both have agreed on the same rate, but the receiver's clock runs slightly slow, greatly exaggerated here at eight per cent so that the effect shows after a few symbols. The first readings sit almost in the middle of their slot, then they wander further right with every symbol until they land in the neighboring slot, and from there on the receiver reads the wrong symbol, marked in red. The error per symbol is harmless while its sum is not.

**Cause two: the sensor needs time to look (Frames 11 to 13).** A sensor does not deliver an instantaneous value but collects light over its measuring window and reports the average, its integration time, here 50 ms. The box below each window shows what the sensor reports. On the left the symbols last 100 ms, longer than the window, so the window lies entirely within one symbol and the box shows plain bright. On the right they last 40 ms, shorter than the window, so every window contains a change, and the box shows a gray between bright and dark that matches no symbol. There is no error message, only a wrong number.

**One question (Frames 14 to 16).** Both causes are versions of the same question: when does the next symbol begin? The sender knows, because it switches itself, while the receiver only sees light. There are two basic answers, either a clock tells the receiver or a change does, and the next two parts read out the price tag of each.

## Part 2: a shared beat

**How much room does a reading have? (Frames 18 and 19).** At ten symbols per second a symbol lasts 100 ms, and the receiver reads in its middle. From there it is 50 ms to either border, so the moment of reading may drift by 50 ms before it lands in the neighboring symbol. The second step adds the measuring window, here 20 ms: since the sensor collects over the whole window, the whole window has to stay inside the symbol, and the room shrinks to 40 ms on either side. Half a symbol is the most room a reading has, and the longer the sensor looks, the sooner it tips.

**When does it tip? (Frames 20 to 22).** The line is the accumulated clock error over time for two clocks that differ by half a per cent, five milliseconds per second, a straight line that keeps growing. The dashed line is the room from the slide before, 50 ms at ten symbols per second. They cross after ten seconds, and from there on the receiver measures in the neighboring symbol; the check is one line, since 0.5 % of 10 seconds is 50 ms. With a window of 20 ms it tips after eight seconds already.

**The same clocks at two rates (Frames 23 and 24).** The same two clocks at one and at ten symbols per second. At one symbol per second a symbol lasts 1000 ms, the room is 500 ms, and 500 ms divided by 5 ms per second gives 100 seconds until it tips. At ten symbols per second the symbol lasts 100 ms, the room is 50 ms, and it tips after 10 seconds. The clocks are the same, only the room has shrunk.

**Faster breaks sooner (Frames 25 and 26).** The same calculation for five rates, from 100 seconds at one symbol per second down to 5 seconds at twenty. That explains why a link that runs stably at a slow rate suddenly collapses when it is sped up, although nothing about the clocks has changed.

**Markers reset the error (Frames 27 and 28).** Agreeing once is not enough, while agreeing again and again is: at fixed intervals the sender inserts a marker, and the receiver realigns its time grid to it. The error line becomes a sawtooth that grows, drops to zero at each marker and grows again, so the error can never become larger than what accumulates between two markers, here 20 ms with a marker every four seconds. A marker is a reserved symbol, for instance a color that does not occur in the data alphabet or a short dark pause, and the only requirement is that the receiver cannot confuse it with a data symbol.

**How the receiver uses a marker (Frames 29 to 31).** Seeing the marker in its grid does not help the receiver by itself. It measures faster than symbols arrive, here five times per symbol, and notes when the marker begins: the first reading inside the pause turns yellow. It restarts its grid there, so the next symbol border is the start of the marker plus one symbol length, and afterwards the error is at most one measuring step.

**Try it: the drift simulator (Frame 32).** In the embedded simulator the receiver's clock runs 2 % slow. Left alone, it shows after how many symbols the readings are half a slot off and when the first red rings, the wrong reads, appear. Setting the slider "sync marker every" to eight symbols keeps the error small, and the display "marker overhead" shows what that costs.

**The price of markers (Frame 33).** Starting together once costs no symbol at all but lets the error grow without limit. Markers limit the error but carry no data, so a marker every eight symbols costs an eighth of the rate. How often a marker is needed depends on how far your own clocks drift apart, and that is measured rather than believed.

**A start bit before every character (Frames 34 and 35).** A serial port, UART for short, is the simplest connection between two devices; a microcontroller sends text to a laptop through it, and mice and modems used to hang on such plugs (RS-232). While nothing is sent, the line rests at 1. Every character begins with a start bit 0, followed by eight data bits and a stop bit 1. The change from 1 to 0 at the start bit is the marker: there the receiver restarts its clock and then reads every bit in its middle. Since this happens before every character, the clocks only have to stay together for ten bits, and a deviation of a few per cent does no harm.

**The missing second (Frames 36 and 37).** Radio clocks set themselves from a time signal that the transmitter DCF77 sends from Mainflingen near Frankfurt. At the start of every second it lowers its signal briefly, for 100 ms for a 0 and for 200 ms for a 1, so time and date arrive bit by bit within a minute. In second 59 the dip is left out. The gap is the marker: the clock recognizes that a new minute begins with the next pulse, and so it knows which bit has which place.

**A pulse after every line (Frames 38 and 39).** VGA is the classic connection between a computer and its monitor, with the blue plug and its two screws. The picture travels over the cable line by line, from left to right and from top to bottom. After every line a sync pulse comes on a wire of its own, and the monitor starts the next line at the left edge again; after the last line a second pulse sends it back to the top. At 640 × 480 pixels and 60 pictures per second these are about 31,500 line markers per second, and without them the picture would slant.

## Part 3: the change as the beat

**A change means "next" (Frames 41 and 42).** The naive idea makes every color a symbol and every change of color mean "next, please". The receiver no longer needs a clock; it measures as often as it can and reacts only to changes. But two equal symbols in a row produce no change: six symbols are sent and only three changes are seen.

**The change carries the bit (Frames 43 to 46).** The fix is to let the change carry the information instead of the color. From every color two successors are allowed, one for 1 and one for 0, and the color itself is forbidden as its own successor, so there is always a change to see. On a triangle of three colors a clockwise step means 1 and an anticlockwise one 0: red to green is clockwise, so 1, green back to red is anticlockwise, so 0, and red to blue is anticlockwise as well, so 0.

**How many choices does a change have? (Frames 47 to 49).** The information lies in the number of choices, not in the number of colors. With three colors the next color after red can only be green or blue, two choices and exactly one bit. With four colors there are three choices from red. Two changes in a row then give 3 × 3 = 9 sequences, a place value system with base 3, not 4. In general k colors leave k − 1 choices for every change.

**What the change costs in bits (Frames 50 and 51).** The freedom from the clock is paid for in capacity. As states, k colors carry log₂ k bits, as changes only log₂(k − 1). Three colors carry 1 bit instead of 1.58, four carry 1.58 instead of 2. Whoever thinks in powers of two falls into a trap here: for a clean two bits per change you need five colors, not four, and in general an alphabet of size 2ⁿ + 1.

**A change in every bit (Frames 52 and 53).** Ethernet is the network cable with the wide, transparent plug, and in its early form 10BASE-T, at 10 Mbit/s, it uses the Manchester code: in the middle of every bit the voltage changes, from low to high for a 1 and from high to low for a 0. Since every bit brings a change, the receiver needs no accurate clock of its own and keeps in step with the changes. The price is an extra change at the border between two equal bits, so up to two changes per bit.

**Light that changes in every bit (Frames 54 and 55).** Many remote controls send following the method RC-5, with invisible infrared light, much like our LED. A key press sends 14 bits of just under 1.8 ms each, and every bit holds a change as well: for a 1 the first half is dark and the second lit, for a 0 the other way round. The TV therefore needs no clock that matches the remote control exactly.

**An extra bit for a change (Frames 56 to 58).** USB is the plug for keyboards, sticks and phones. In USB 1 and 2 a 0 means a change on the line and a 1 none, so a long run of ones would leave the line unchanged for a long time, and the receiver would lose its beat. After six ones the sender therefore slips in an extra 0, which forces a change and which the receiver removes again. This bit stuffing costs at most a seventh of the rate, much like a marker.

**Without a clock is not without time (Frames 59 to 61).** The most common fallacy is that time no longer matters once the clock is gone. Two decisions about time remain. During a change the sensor measures mixed values, as shown in part 1, so the receiver needs a threshold for how long a color must be seen before it counts as a new state; otherwise it invents symbols from the in-between values. And how many changes per second the link manages still decides the throughput, with exactly the limits from part 1.

## Part 4: choosing a way

**Two ways, two price tags (Frames 63 and 64).** With a clock the receiver counts time, markers limit the drift, and each marker is a symbol without data, while every color carries the full log₂ k bits. Without a clock the receiver waits for a change, there is no clock that could drift, mixed readings are filtered out, and every color carries only log₂(k − 1) bits. A color does not have to last longer than with a clock, since in both ways the sensor's window sets the shortest symbol. Neither way is right or wrong, and which one fits better depends on your own link.

**What a file costs (Frames 65 and 66).** Whatever the strategy, in the end this calculation counts: the time t for a file is the number of bits n divided by symbols per second r times bits per symbol b. It has exactly two levers, b and r, and everything in this deck decides about both.

**What 2 KiB look like (Frames 67 and 68).** The picture has 128 × 128 pixels, and each of them is black or white, so it needs exactly one bit. That makes 16,384 bits or 2 KiB, a picture the size of a stamp; with gray levels or colors it would be several times as large.

**2 KiB at five symbols per second (Frames 69 and 70).** With a clock, four colors carry 2 bits per symbol, which at five symbols per second gives 10 bit/s and a little over 27 minutes, not counting the markers. Without a clock the same four colors carry only 1.58 bits per change, which makes about 34 minutes. That is the price of the freedom from the clock, in minutes. How far the two levers can be turned at all is a question of its own, that of throughput and its limits.

**Closing (Frame 71).** No two clocks run alike, which is not a quirk of a particular laptop but a property of the world. The only choice is what you do about it: agree again and again with markers, or make the change itself the beat. Which way pays off is shown by a measurement on your own link.
