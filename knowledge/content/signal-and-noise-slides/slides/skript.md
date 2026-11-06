# Lecture notes: why 16 and not 4? (Signal and noise)

These notes accompany the stagekit deck "why 16 and not 4?" and explain its contents for reading afterwards, in the order of the slides. Build-up steps and the segments of an animation count as frames of their own in the player and in the export (29 frames in all), so the references point to frames.

The core message: how many symbols a link carries is not decided by its code but by the ratio of the distance between the symbols to the scatter of the readings, and every measure that improves this ratio has a price that you should know before you pay it.

## Part 1: what the numbers say

**The lighthouse in the fog (Frame 4).** The lamp burns exactly as brightly as on a clear night, and yet the fog swallows the beam after a few metres. The signal has not become weaker; the disturbance has become stronger. Every LiFi link is in the same position: all senders are equally bright and all sensors equally good, and still the teams get very different distances.

**Same hardware, different alphabets (Frame 5).** An example of five teams with the same LED, the same sensor and the same task: the size of the alphabet each reached, its hit rate, and what it did about noise. The last column is the most important one, because it already contains the answer before anyone says it. If you already measure your own link, add your team as a sixth row in your head, with your alphabet, your hit rate and your measures. Then the question: with the same hardware and the same task, the largest and the smallest alphabet still differ by a factor of four, so where does the difference come from?

**Ten readings of one colour (Frames 6 to 8).** The LED shows the same red ten times and nothing changes, yet the sensor reports ten different numbers. They arrive one after the other, and the newest is yellow while it is the current one. That surprises most people, because a computer is the one machine that reliably gives the same output for the same input. But a sensor never gets the same input twice: the light flickers, the electronics hiss, someone walks past the window. This variation is called **noise**, and every measuring instrument has it.

In the last step the same ten values land on a number line, and you see what is left of them: a spread from 207 to 220. From this follows something that carries the whole deck: **a single reading says almost nothing.** The value 220 could be this colour, or a neighbouring colour in a bad moment, and only the ten together show where the colour really sits and how far it wanders.

**Not the code but the scatter (Frame 9).** The punchline comes early, and the evidence follows. That the quality of the program decides almost nothing here surprises most people, and that is exactly the point. Noise is not a defect and not a bug but a property of every measurement, and whoever makes it smaller fits in more symbols.

## Part 2: what decides your alphabet

**The same signal, averaged over longer windows (Frames 11 to 14).** There is a way to make the numbers calmer, and you already have it: measure for longer and average what arrives. At the top is the raw signal as it reaches the sensor, far too restless for a decision in a single instant. Below it the same signal is averaged, first over 4, then over 12, then over 32 readings. In each strip a yellow line runs through the same stretch of time, and a mean appears as soon as its window is full, so the bars settle closer and closer to the true level.

The place to look is the right-hand edge, where the bars are counted: the same stretch of time holds 288 raw readings, then 72, 24 and 9 means. **Calmness is not free, you pay for it in readings per second**, and readings per second are exactly what your speed is made of.

**Two symbols, two clouds (Frames 15 and 16).** Now two symbols on the same scale, each not a single value but a cloud of values whose width is the noise from before. At first the clouds are wide, and the parts that reach across the boundary, drawn red, are exactly the readings the receiver assigns to the wrong symbol. Then the clouds narrow, as they do with a longer window or shielded light, and at the same distance `d` every reading lands on its own side. Neither the distance nor the width decides on its own.

**The ratio is what counts (Frame 17).** The quantity this deck is about is a quotient: the distance `d` between two symbols, divided by the spread `s` of the readings. Your alphabet size measures nothing else, which is why it explains the table from the beginning.

From this follows a sharper version of a phrase that is easily used loosely. **Safely distinguishable** does not mean that the means are different. It means that the clouds do not touch, not even at their outermost values. A single reading that slips across the boundary is a wrong symbol, and one wrong symbol in fifty attempts costs you an alphabet size. If you record a colour only by its mean, you do not yet know whether it is usable.

**How many symbols fit? (Frames 18 to 20).** As soon as you think in bands instead of points, "how many colours can we use?" stops being a matter of trial and error and becomes a calculation. Measure the usable range of your link, from the darkest to the brightest value you can produce reliably, and measure the width of one cloud; the range divided by the width of one band is the number of symbols.

The example: the range runs from 40 to 840, so 800 units. If a colour scatters by plus or minus 100 around its mean, its band is 200 wide, not 100, because the cloud reaches in both directions, and four bands fill the range. If it scatters by only plus or minus 25, its band is 50 wide, and sixteen fit. That is the answer to the title: sixteen instead of four, because the clouds are four times narrower. Doing this calculation before you try colours saves you many attempts.

**Eight symbols, two window lengths (Frames 21 to 23).** Everything at once, for an alphabet of eight symbols. The gray dashes are the levels sent, the dots the readings, which arrive one after the other. With the short window six of thirty readings fall into another symbol's band and turn red, but forty symbols get through per second. With a window four times as long the readings scatter half as far, none lands in the wrong band, and only ten symbols get through per second. The readings are simulated, but the structure is real. The Distinguishability Lab of the LiFi project lets you turn the same knobs, the number of symbols, the length of the window and the speed, yourself (https://demos.lifi-project.de/distinguishability-lab/); your own numbers come only from your own link.

## Part 3: what it costs

**The toolbox, with price tags (Frame 25).** There are tools against noise, and hardly any of them are free. On the left you enlarge the distance, on the right you shrink the spread, and almost every price tag says one of two things: fewer bits per symbol, or fewer symbols per second.

Three tools are the exception, and they are the reason self-built optics are allowed in the LiFi project: aim the light better, block ambient light, fix the geometry. They improve the ratio without you giving anything up, and they cost only an afternoon with cardboard, passive and ten euros at most.

**Averaging is not free (Frame 26).** The most common reflex against noise is averaging. `read_stable()` reads the channel `c`, the fourth value of `sensor.read()`, ten times and returns the mean. The mean of ten readings scatters about three times less, by the square root of ten, but it takes ten times as long. That is not an argument against averaging but an argument for measuring the price instead of assuming it is zero. It is the same bargain as a longer integration time, made at a different place: once in the sensor, once in the program.

**Both roads lead to the same wall (Frame 27).** There are two ways to get more out of a link, and almost everyone wants both at once. More symbols squeeze the bands together, and faster symbols make the clouds wider. Both use up the same safety margin, and you only have one, so as soon as you want both, your decisions need numbers instead of opinions.

**One honest sentence (Frame 28).** An entry from a log of mistakes in its short form of two lines: the assistant suggested more gain, which sounded plausible, and the measurement showed that the scatter grew with it and two symbols were lost. Your own pair comes from one suggestion of your assistant about the optics: write down what it should achieve, measure, and record both lines. This is where the log of mistakes shows its purpose, and it is what sets the project apart from a programming course: no language model has access to a measurement on your link, so none can settle a question about it.

**The measuring staff in the fog (Frame 29).** Everything in this deck is a property of **your** link: your room, your distance, your ambient light. Your task is not to defeat the noise, which cannot be done, but to measure it and then decide which alphabet and which speed your link honestly delivers. The fog stays, and what you hold in your hand is the yardstick.

## Further reading

The experiment [[measuring-your-noise]] measures everything this deck talks about on your own link: the spread of one colour, the ratio `d/s` and how many symbols fit. How to measure honestly, with a control reading and one variable at a time, is covered by the deck [[measuring-and-experimenting]].
