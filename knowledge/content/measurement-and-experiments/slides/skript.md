# Script: measuring and experimenting

These notes accompany the stagekit deck "measuring and experimenting". They explain the contents of the slides for reading afterwards. Build-up steps and the segments of an animation count as frames of their own in the player and in the export; the references therefore refer to frames.

The core message is: a single reading is not yet evidence. Knowledge only comes from a controlled measurement series: write down the expectation beforehand, change exactly one quantity, repeat, and document all results.

The running example is a colour sensor that measures the light of an LED, as in a link that transmits data with light. Any other sensor behaves the same in principle.

## 1. Measuring settles it

### Which ball lands first? (Frame 4)

For two thousand years Aristotle sounded plausible: heavy bodies should fall faster than light ones. As the legend goes, Galileo dropped two balls of different weight from the Leaning Tower of Pisa, and both arrived at the same time. A measurement decided what thinking and authority could not.

The picture carries straight over to working with an AI assistant. The assistant knows sensors of this kind and can give good reasons, but it does not know the concrete setup on the table. That setup is the tower, and a measurement series is the drop test.

### Three ways to answer the same question (Frames 5 to 7)

A plausible explanation says why something might hold. An AI prediction can even attach concrete numbers or an instruction to the claim. Both remain a claim. Only the measurement series on your own setup provides evidence of whether, and how strongly, the effect actually occurs. That is why, once the evidence appears, the first two boxes turn yellow with a warning sign: they still have to stand up to a measurement.

The example is the integration time. "Longer measurements collect more light" sounds reasonable. "Double the integration time, and recognition improves" is a clear prediction. Whether the recognition rate on this setup really rises from 41 to 47 correct recognitions out of 50 is decided only by the trial.

### A claim becomes a test (Frames 8 to 11)

An experiment begins with a question. From it follows a prediction, which you write down before measuring. Then you measure under controlled conditions; in the example, 50 symbols each with a short and with a long window, 41 recognised correctly with the short one and 47 with the long one. Finally you compare the result with the prediction: the hypothesis is supported or refuted. On the slide the four stations appear one after another, and the white frame marks the station the experiment has reached.

The order is decisive. If you measure first and only afterwards decide which result counts as a success, you can read almost any outcome as a fit. An expectation written down beforehand protects you from reading your own hopes into the data after the fact.

## 2. Know what you measure

### This concept lives at the input (Frame 13)

A receiver can be drawn as a box following the IPO pattern: light goes in, `classify()` processes the input, a colour name comes out. Here we zoom into the input side. To our eyes, red light falls on the sensor. For the program, what arrives there is not the concept "red" but a measurement.

### Four numbers instead of a colour (Frames 14 to 16)

The colour sensor delivers four values. Three channels measure through red, green and blue filters. The fourth channel is called clear and measures all the incoming light without a colour filter, which makes it especially sensitive to bright and dark.

The four numbers `r`, `g`, `b` and `c` are the program's actual input. Only processing turns them into the output `"red"`, `"blue"` or another symbol name. Exactly this separation prevents the misconception that a sensor already delivers the meaning of the measured signal.

### Sent is not measured (Frames 17 and 18)

If you set the LED to `r=255, g=0, b=0`, it is easy to expect the same numbers at the sensor. On the slide the light travels across, and the four values count up at the sensor to something like `r=203, g=41, b=57, c=310`. That is not a defect, it is the normal case.

The colour filters overlap. Light gets lost with distance and angle. Room light reaches the sensor as well. A formula that calculates today's readings back exactly to the LED values would already be wrong at the next table or on the next day. We have to learn to work with the readings of our own setup. The experiment [Sent is not measured](../../sent-is-not-measured/de.md) lets you see this on your own device.

### Measure the dark first (Frames 19 to 22)

Even with its own LED switched off, the sensor does not show zero, because room light is always there. That is why every measurement series begins with a control reading with the LED switched off. It provides the baseline against which all later values are read.

You can think of the measured value as made up of three contributions: ambient light, light from your own LED, and noise. The control reading estimates the first contribution. It also tells you when the surroundings change during the measurement series, for instance through afternoon sun or the LED of a neighbouring team.

## 3. One reading is a guess

### Which value is true? (Frames 24 to 28)

Five readings of the same red LED under the same settings can give 198, 205, 201, 195 and 206. On the slide they arrive one after another, and the newest stands in yellow. None of these values alone is "the true value", and yet each one is a real measurement. Every real measurement scatters. Five perfectly identical values would be more suspicious in a real setup than five slightly different ones.

A single reading is a draw from a distribution. It tells you little about where the values usually lie and how strongly they fluctuate. Only several readings make these two properties visible.

### How many readings per decision? (Frames 29 to 32)

A sender alternately sends "off" and "on". The receiver reads the sensor and decides at a threshold which of the two symbols has arrived. The same readings decide three times: once individually, once averaged over five readings, once over ten.

First the top track fills: three of the thirty dots lie on the wrong side of the threshold, they are red and count as wrong decisions. Then the two lower tracks fill with the means, and none of their dots slips across the threshold any more. That is exactly the benefit of averaging.

The price appears last. For the same number of decisions the middle track needs five times and the bottom track ten times as many readings, and twenty symbols per second become four and two respectively. If you want to lower the error rate, you pay with speed.

How much averaging you need depends on the setup. With little noise even the single reading is always right, and averaging only costs time; with a lot of noise even the average of five is occasionally wrong. The numbers on the slide are simulated, the structure is real: which case is yours, only your own measurement series can tell you.

### Centre and spread belong together (Frames 33 to 35)

The mean describes roughly where a measurement series lies. But it does not say how reliably a single value lies near that mean. Two series can have the same mean and very different spreads.

That is why the individual values, or at least a suitable measure of spread, belong in the record. If you only write down the mean, you may be hiding exactly the fluctuation that later leads to wrongly recognised symbols.

### The knob: integration time (Frames 36 to 38)

The integration time is the sensor's reading window. In a long window the sensor collects more light and averages out short-term fluctuations. The values then sit more calmly together, but every measurement takes more time.

In the figure every reading is a bar, and its width is its time window. All three rows show the same second, and a yellow line runs through it: each bar appears when its window closes. Four long readings fit into the top row, twelve short ones into the bottom row. The height of the bar is the measured value. Shorter windows therefore deliver more measurements per second, but the values scatter more. With very short windows, individual readings leave the band that is still assigned to the correct symbol; in the last frame these outliers turn red. Gain is the second knob: it scales signal and noise alike and can drive the sensor into saturation.

### Calmer or faster (Frame 39)

"A longer window gives calmer readings, a shorter one gives them faster." This trade-off shapes every transmission with a sensor: more calm costs symbol rate. Where the best compromise lies depends on distance, room light, optics and setup. A table or an AI assistant can suggest a starting value, but the limit of your own setup has to be measured. What matters here is the method by which that limit can be found reliably in the first place.

## 4. Build evidence

### Two teams, two changes (Frames 41 and 42)

Team A changes the distance and the integration time at the same time. Team B changes only the distance. Both see their recognition rate improve, but only Team B has learned what caused the improvement. For Team A two possible causes remain inseparably mixed.

So the rule is: in a measurement series, exactly one quantity is changed on purpose. All other conditions stay as constant as possible and are written down.

### What makes a measurement series (Frames 43 to 45)

Before measuring, you write down the conditions and the expected effect. While measuring, you change exactly one quantity, take a control reading and repeat often enough. After measuring, you keep all the values, compare the result with the expectation and document the outcome.

These three phases are also the checklist for the measurement record. Conditions make the series repeatable. The expectation makes it honest. One changed quantity makes it interpretable. Repetitions make it reliable. Keeping all the values stops only the pleasant results from surviving. A repeatable result is worth more than an impressive one.

### Luck or skill? (Frames 46 to 48)

With two possible colours, pure guessing gets every second decision right. Five hits in a row happen by chance in about one attempt in 32, so in a room with many teams a lucky streak like that quickly happens somewhere.

Fifty hits in a row have a probability of roughly one in 1,125,899,906,842,624 when guessing, which is practically impossible. That is why reliable evidence needs long series: only enough repetitions separate skill from luck.

### Calibrate, then classify (Frames 49 to 52)

Calibrating means measuring known transmitted colours repeatedly under the conditions of your own setup. In the coordinate system this gives clouds of reference values. A new reading is then compared with these clouds and assigned to the closest one.

In the example the red readings lie in a region with a high red share and a low blue share, the blue readings in the opposite region. The green share is roughly constant here and is therefore left out of the two-dimensional picture. On the slide the new reading `r=170, b=80` appears first, then its distances to both clouds are drawn, and the shorter one, to the red references, turns yellow while the reading takes on red: "nearest match wins".

This does not calculate backwards to what the LED supposedly must have sent. Instead, a decision is made on the basis of your own measurement series, and that answers the question of how to recognise the sent colour from numbers that never match it.

### When the assistant and the data disagree (Frames 53 to 56)

The assistant suggests increasing the gain, because that is supposed to improve recognition. The measurement series, however, shows a drop from 94 to 82 per cent. Before we treat the suggestion as refuted, we check the quality of our own series: was only one quantity changed? Were there enough repetitions? Was there a control reading?

If these conditions are met, the measurement series is the authoritative truth for your own setup. The contradiction goes into the log of mistakes, with the suggestion, the measurement and the result. Documented cases like this are not an embarrassing failure but something learned.

### The closing sentence (Frame 57)

"If you did not measure it, you do not know it." Every claim about a setup is an invitation to an experiment. It is not the most beautiful explanation that wins, but the cleanest measurement series, and a single reading is not yet a measurement series.
