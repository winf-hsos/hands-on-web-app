# Script: solving problems with computers

These notes accompany the stagekit deck "solving problems with computers". They explain the contents of the slides for reading afterwards and can be read as a text of their own. Build-up steps and the segments of an animation count as frames of their own in the player and in the export; the references therefore refer to frames, from Frame 1 to Frame 44.

The core message is: a piece of a problem that a computer can solve always has the same shape, input, processing and output, and once its input and its expected output are clear, the piece brings its own test. Programs answer the question of the processing, while the representation of the data is a second question in its own right.

The running example is the light link of the LiFi project, in which a sender turns text into coloured light and a receiver turns the light back into text.

## 1. What happens in the middle?

### The invisible in-between (Frames 1 to 4)

The opening shows an ordering terminal in a fast-food restaurant. At the front we enter an order, and a little later a tray appears, while the kitchen in between stays invisible. For ordering, it is still enough to know what goes in and what is supposed to come out.

The terminal also hints at a second question, because we do not simply speak our order into the room. We choose tiles, quantities and options, so even before the kitchen gets to work, the order has been brought into a form the system can process. This question of representation comes back at the end of the deck.

### The shape of a solvable piece (Frames 5 to 8)

A piece that a computer can solve always has the same shape. At the front data go in, which is the input, and at the back data come out, which is the output. In between lies the processing. Together the three parts are called input, processing and output, IPO for short.

The box is not a particular device but a way of thinking. We can use it to describe a pocket calculator, a Python function, a sensor, a sender or a whole transmission system. What matters first is not the technical details but the edges of the box: what really goes in, and what is really supposed to come out?

### The built-in test (Frames 9 to 12)

A small example shows why a good cut through a problem is testable. The function `add()` gets `2, 3` and is supposed to return `5`. With that, a test has already been written:

1. Write down the expected output, `5`, before anything runs (Frame 10).
2. Put `2, 3` in and run the processing (Frame 11): on the slide, the input travels into the box and the actual output `5` comes out.
3. Compare the actual output with the expected one: they match, and the test passes.

If the same box returned `6` instead, the same test would fail (Frame 12). To find that out, we do not need to know how `add()` works inside, because clear inputs and expected outputs make a box testable on their own. The sentence to remember: if you know the input and the expected output, you already have a test.

## 2. The boxes in the light link

### The sender (Frame 14)

The sender of the light link is an IPO box. A message such as `"hi"` goes in, `encode()` processes the text, and a sequence of colour symbols comes out.

The edges matter: before `encode()` there are characters, after it there are colour symbols. Which colour carries which meaning is not a fact of nature but an agreement within the team, and only this agreement makes the sender's output understandable for the next piece of the link.

### What does the receiver really see? (Frames 15 to 17)

At the receiver, it looks at first as if red light goes in. For the computer, though, no concept "red" goes in, because the sensor measures the light and delivers readings, for example:

`r = 203, g = 41, b = 57, c = 310`

On the slide, the red light turns into these four numbers, which count up as the sensor measures (Frame 16). The first three stand for the measured red, green and blue components, the fourth for the overall brightness. Only then does the processing, `classify()`, apply a decision rule to the numbers, and the output `"red"` comes out of the box (Frame 17). Your eyes see red, but the box only sees four numbers.

### Same reading, two rules (Frames 18 to 20)

How much the processing decides becomes clear with a weak red light. The sensor delivers small numbers, `r = 40, g = 12, b = 15, c = 70`, and a rule decides what they mean:

- The first rule says `off` whenever the brightness `c` is below 100, and otherwise the largest of the three colour channels wins. With `c = 70`, the output is `"off"` (Frame 18).
- The second rule uses a threshold of 50 instead, so the same reading is bright enough, `r` is the largest channel, and the output is `"red"` (Frame 19).

The input stayed the same, and only the processing changed, yet the output changed with it. Which rule is right is decided by a test: if we write down beforehand that the LED sent red and `"red"` should therefore come out, the first rule fails and the second passes (Frame 20). The rule decides what the numbers mean, and a test decides which rule is right.

### Boxes can be plugged together (Frames 21 to 25)

The output of one box can become the input of the next, and the whole link can be read as a chain:

`"hi" → encode() → colour symbols → light → decode() → "hi"`

On the slide, the data flow through this chain in two segments: first through the sender, which turns `"hi"` into colours (Frame 22), then across the light to the receiver, which turns the colours back into `"hi"` (Frame 23). Finally the four boundaries light up (Frame 24): at every connection point, the form and meaning of the data have to be agreed. A piece can work correctly on its own and the whole link can still fail, if two neighbouring boxes expect different things at their boundary.

The chain also gives you a route for debugging. If `"hi"` does not arrive at the end, we do not check everything at once but follow the data from boundary to boundary: the code that was produced, the colour the LED shows, the readings of the sensor and finally the text `decode()` returns. The guiding question, as Frame 25 puts it, is up to which boundary the data are still correct.

## 3. Boxes all the way down

### Opening a box (Frames 27 to 29)

From the outside, the whole sender can be seen as one box: a message goes in, light comes out, and `send()` names the whole processing.

If we open this box (Frame 28), its processing turns into a chain of smaller boxes that encode the text, choose a colour and drive the LED. Each small box again has its own inputs and outputs (Frame 29) and can be checked separately: text becomes symbols, symbols become a colour, and the colour becomes a voltage at the LED.

How far we open a box depends on our question. If you test the whole link, you need different inputs and outputs than someone who only looks at `encode()` or at driving the LED, and so we open a box only as far as the current question requires.

### The same shape at three levels (Frames 30 to 32)

The IPO pattern survives across the levels:

- System: a message goes in, the sender works, light comes out.
- Function: text goes in, `encode()` works, symbols come out.
- Logic gate: `1, 1` goes in, the AND rule is applied, `1` comes out.

The size changes from row to row while the shape stays the same. That is why IPO can connect very different technical things with one another without blurring their differences.

### Chain and nesting (Frames 33 and 34)

There are two relationships between boxes that must not be confused:

- Boxes in a row show data flow and answer where the data go next.
- Boxes inside boxes show hierarchical decomposition and answer what smaller work happens inside.

Both relationships are ways of cutting a problem, once into steps that follow each other and once into smaller work inside a box. Which view fits depends on the question, and the fitting level is the one at which a clear input and an expected output can be stated. Frame 34 sums this up: the right level is the one you can test. If a box cannot be tested, it is usually still too large, or its edges are still vague.

## 4. Two questions inside every box

### Processing and representation (Frames 36 to 39)

Every IPO box gives rise to two basic questions.

The first is how the box does its work (Frame 37). That is the question of processing, and its answer is called a program. What a program is exactly is the subject of the deck "algorithms and programs".

The second is how things are written down so that a machine can work with them (Frame 38). That is the question of how inputs and outputs are represented, and the sensor has already shown it: "red" had to become four numbers before a program could work with it. This question runs through many topics, from readings to symbols, codes and number systems (Frame 39).

### An AI agent is a box, too (Frames 40 to 43)

An AI agent can also be seen as an IPO box: a task goes in, and code comes out. The inside of this box is hard to look into, which is exactly why clear edges matter even more.

A clear example makes the input precise (Frame 41), and an expected result provides the yardstick (Frame 42). Only running the code and comparing the actual with the expected result decides whether the suggestion is usable (Frame 43). You do not have to trust a box when you have a test for it, and that holds above all for systems that are hard to see through.

### Behind the counter (Frame 44)

The closing picture goes back to the restaurant of the opening and looks behind the counter: order tickets in a row, the fryer, the station where the burger is put together, and in front the tray that was ordered at the terminal. At the beginning we knew only the order and the tray, and now we know the shape of every piece a computer can solve and how its edges make a test possible.

Behind the counter, the order is worked through step by step, ticket by ticket and station by station. The processing inside the box in the middle is called a program, and what a program is exactly is the subject of the deck "algorithms and programs".
