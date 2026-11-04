---
type: quiz
code: 6025
title: "Quiz: input, processing, output"
summary: >-
  Thirteen questions on the IPO box: its three parts, the test it brings
  along, what a sensor really delivers, chains and levels of boxes, and the
  two questions every box raises. Every answer comes with its reason.
objectives:
  intro: "This quiz lets you check in thirteen questions whether you can:"
  goals:
    - "name input, processing and output of a box and tell a real test from mere activity"
    - "explain why a computer receives numbers rather than a colour, and what belongs to the input of a box"
    - "explain what must agree at the boundaries of boxes in a chain and how you narrow down a fault"
    - "tell data flow from decomposition and choose the level of a box to fit the question"
    - "say which of the two questions of a box a program answers"
level: 1
duration: 15
topics: [solving-problems, processing-information]
modules: [dup]
relations:
  checks: [input-processing-output-slides]
status: published
updated: 2026-11-04
---

## According to the IPO model, what are the three parts of every piece of a problem that a computer can solve? {#ipo-001}

- [ ] Planning, implementation, documentation
  > That describes a way of working, not the shape of the problem itself.
- [ ] Hardware, software, data
  > Those are parts of a computer system, not the pattern a solvable piece of a problem follows.
- [x] Input, processing, output
  > Exactly: something goes in at the front, something comes out at the back, and in between the machine computes. Input, processing, output, IPO for short.
- [ ] Sender, channel, receiver
  > That is the picture of a transmission link. It is itself made of IPO boxes, but it is not the basic pattern.

> Every piece a computer can solve has an input, a processing and an output.

## Why does a box with a clear input and a clear expected output bring its own test along? {#ipo-002}

- [ ] Because the computer reports at every call whether the output it delivered matches the input.
  > The machine has no expectation. It carries out what is written and at most reports that it could not; whether the output matches is your comparison, not the computer's.
- [x] Because you can feed in a known input and compare the result with the expected output.
  > That is exactly the test: known input, expected output, comparison, with a yes or no and no room for interpretation.
- [ ] Because in a cleanly cut box you can see at once, just by reading the code, which line produces which part of the output.
  > Reading is not a test. Even a cleanly cut box can compute wrongly, and convincing-looking code does so especially quietly; the cut makes errors findable, not visible.
- [ ] Because the processing inside the box is then so manageable that it can hardly be wrong any more.
  > The processing can be as complex as you like. The box stays testable as long as input and output are clear.

> A known input and an expected output are already a test, without looking inside the box.

## A red lamp shines in front of a colour sensor with four measuring channels. What is the actual input a receiver program works with? {#ipo-003}

- [ ] The colour red, just as a person standing next to the sensor sees it.
  > That is how a person experiences it. The program does not receive a colour but what the sensor delivers, and that is numbers.
- [ ] The word "red", which the sensor reports to the program as the colour it recognised.
  > The sensor recognises nothing, it measures. "red" is the output the program has to produce from the readings, and exactly this decision is its processing.
- [x] Four numbers: the shares of red, green and blue and the overall brightness.
  > Exactly: the sensor delivers four readings, for example r=203, g=41, b=57, c=310. Which of them counts as red is a decision the program makes from the numbers.
- [ ] A small image of the lamp, from which the program reads off the colour at the brightest spot.
  > A colour sensor is not a camera. It has no pixels; it measures the incoming light as a whole and delivers exactly four numbers, not an image.

> The input of the box is what the sensor delivers, and the decision is the work of the program.

## A link sends text with light as a chain of boxes. Which statements are true? (Several answers may be correct.) {#ipo-004}

```text
"hi" → encode() → colours → light → sensor → decode() → "hi"
```

- [x] The output of `encode()` is the input of the next box.
  > Correct, that is what connecting boxes means: the output of one becomes the input of the next.
- [x] Sender and receiver must agree beforehand which colour stands for which letter.
  > Correct: `encode()` turns letters into colours and `decode()` turns colours back into letters, so both need the same table, for example "h" is red. Without it the receiver sees colours but cannot read them.
- [ ] `decode()` can work independently of what `encode()` does.
  > Wrong: `decode()` has to reverse exactly the agreement that `encode()` used, so the two are coupled through this shared table.
- [x] The chain shows the order in which the data flow through the system.
  > Correct: boxes in a row show the data flow, from message to message.
- [ ] The chain shows how the problem is decomposed into subproblems.
  > Wrong: that is what boxes inside boxes show, since an opened box contains smaller ones. Boxes in a row show flow, not hierarchy.

> Boxes in a row show data flow, and sender and receiver fit together only when they use the same agreement.

## Look at this function as an IPO box. What are its input and its output? {#ipo-005}

```python static
def encode(text):
    colours = []
    for letter in text:
        colours.append(colour_for(letter))
    return colours
```

- [x] The input is a text, the output is a list of colours.
  > Correct: `text` goes in, every letter adds a colour to the list, and `colours` comes out. That is the sender's box.
- [ ] The input is a list of colours, the output is a text.
  > That would be the opposite direction, `decode()` on the receiver's side. Here it is the other way round, since the parameter is the text.
- [ ] The input is light, the output is four sensor readings.
  > That describes the sensor, a different box of the chain. This function works only with text and colours.
- [ ] The input is a single letter, the output is a single colour.
  > That describes `colour_for`, the small box inside. The function `encode` receives a whole text and loops over every letter, and what comes out is the list of all colours.

> The parameters of a function are its input, its return value is its output, and a call inside it is a smaller box.

## You want to check a box `classify()` that decides on a colour from four sensor readings. Which test fits the IPO model? {#ipo-006}

- [ ] Run `classify()` for an hour on live readings and see whether it holds up without crashing.
  > An endurance run checks stability, not whether the decision is right. Without an expected output it is no IPO test.
- [ ] Call `classify()` with random numbers and check that no error message appears.
  > "No error message" only means that the machine could carry out what was written. It says nothing about whether the colour is right.
- [x] Feed in stored readings that were certainly taken with a red lamp and check that "red" comes out.
  > Exactly: known input, expected output, comparison. The box is checked against data whose truth you know.
- [ ] Read the source code of `classify()` line by line and trace every condition in your head with example values.
  > Reading helps understanding but does not replace a test, because convincing-looking code can still decide wrongly.

> A test needs inputs whose correct output you know beforehand.

## The IPO box raises two questions: how does the box do its work, and how are input and output represented for the machine? Which of them does a program answer? {#ipo-007}

- [ ] Both: a program also defines how colours and characters are represented.
  > Tempting, but the representation is a decision of its own, about symbols and codes, made before the program, which only applies it.
- [x] The question of processing: a program describes how the box does its work.
  > Exactly: a program is what happens inside the box. The question of representation stays open and is answered by readings, symbols and code systems.
- [ ] The question of representation: a program defines what data look like.
  > The other way round: how data are represented is precisely the question a program does not answer. It works with a representation agreed beforehand.
- [ ] Neither: programs are a separate, third topic.
  > Programs are not a third topic but the answer to the first question, which is why the topic of IPO leads straight on to what a program is.

> Programs answer how a box works; representation answers what crosses its edges.

## The same IPO model appears on several levels. Which statements are true? (Several answers may be correct.) {#ipo-008}

```text
system:     message → sender   → light
function:   text    → encode() → colours
logic gate: 1, 1    → AND      → 1
```

- [x] Seen from outside, the whole sender is a single box: message in, light out.
  > Correct: `send()` is then the name for all the processing inside.
- [x] Opening the box turns its processing into a chain of smaller boxes with inputs and outputs of their own.
  > Correct, and each of those smaller boxes can be checked on its own, which is what makes the levels so useful.
- [ ] A single logic gate is too small for the IPO model, because it does not process anything but merely lets current pass or blocks it.
  > Wrong: passing or blocking according to a fixed rule already is processing. An AND gate has inputs, two truth values, a processing rule and an output; it has the same shape at a different resolution.
- [x] Which level is the right one depends on the question you are investigating.
  > Correct: testing the whole system needs different inputs and outputs than examining only `encode()`.

> The shape stays the same on every level, and the right level is the one at which your question can be tested.

## A text transmission over a light link delivers the wrong text at the end. According to the box model, what is the most sensible next step? {#ipo-009}

- [ ] Repeat the whole transmission until the text comes out right.
  > Repeating without narrowing down keeps testing the same big box, and even if it works once, you do not know what was wrong before.
- [x] Open the big box and check an inner box, say `encode()`, on its own with a known input.
  > Exactly: one level down, the small boxes have their own inputs and outputs and can be checked one by one, so that "wrong somewhere" becomes "wrong here".
- [ ] Put the source code of sender and receiver side by side and look for the spot where the agreement does not match.
  > Reading can help but does not replace a check: whether `encode()` really delivers what the code seems to say shows only when you call it with a known input. And the fault may sit in a box that is not code at all, such as the sensor.
- [ ] Change the distance between sender and receiver and send again.
  > That changes a condition of the surroundings but checks no box, and if it happens to help, the cause remains unknown.

> Follow the data and test one boundary after the other until you find the box where they first go wrong.

## Why does the computer not "see" a colour, only numbers? {#ipo-010}

- [ ] Because the colour sensor is too cheap; a better one would deliver colours directly.
  > Even the best sensor delivers readings, that is numbers. The difference is precision, not the kind of delivery.
- [x] Because a machine can only work with things that exist in a representation it can process, usually numbers.
  > Exactly the core point: before a computer can work with something, it has to be represented. Your eyes see red, the box sees 203, 41, 57, 310.
- [ ] Because the detour via numbers is a quirk of the programming language; a language with a built-in colour type would see the colour directly.
  > This has nothing to do with the programming language. A built-in colour type would itself be a representation, with numbers underneath, so the question lies deeper than Python.
- [ ] Because the lamp never emits pure red.
  > That is a real issue of measurement, but it does not explain the principle: even the purest red would arrive as numbers.
- [ ] Because it does recognise the colour but stores it as numbers inside and can therefore only pass it on that way.
  > The order is wrong: there is no recognising that comes before the numbers. Inside the machine there is no seeing in the human sense, only the four numbers and whatever the program decides from them.

> A computer works only with representations, and the meaning comes from the rule in the program.

## An AI assistant is an IPO box as well: your words go in, code comes out, and you cannot look inside. What follows from that? {#ipo-011}

- [ ] The box is finished and no longer needs checking.
  > The opposite follows: precisely because you cannot look inside, its output needs checking all the more.
- [ ] The input hardly matters: the assistant delivers similarly good code for any question, however you phrase it.
  > No, the input is yours: your words decide what comes out, and a vague request yields vague results. That is why it pays to phrase requests small and testable.
- [x] You know the input and check the output, since the processing is closed to you.
  > Exactly: the processing is out of reach, but input and output belong to you, and the checking happens at the output.
- [ ] The box works fastest, so as much work as possible should go there.
  > Being closed says nothing about speed. What follows is not more work for the box but more checking of its output.

> With a test you do not have to trust a box you cannot look into.

## Which of the following calls is a test with a built-in expectation? {#ipo-012}

```python static
def to_signal(brightness):
    if brightness > 100:
        return "on"
    return "off"
```

- [x] Call `to_signal(150)` and check that `"on"` comes out.
  > Exactly: known input, 150, expected output, `"on"`, since 150 is greater than 100, and a comparison. A yes or no result with no interpretation.
- [ ] Call `to_signal(150)` and look at the result.
  > Close, but the expectation is missing: without deciding beforehand what must come out, you will nod at anything afterwards.
- [ ] Call `to_signal()` with many different values to keep the function busy.
  > Many calls without expectations are a lot of activity and no checking. Only an expected output for each input turns them into tests.
- [ ] Check that the call produces no error message.
  > "Runs without errors" only means that the machine could carry out what was written. A function can return the wrong thing without any error.

> The expectation comes before the result; without it, a call is no test.

## Which of these belongs to the input of the box `classify()`, which decides on a colour from a sensor's readings? {#ipo-013}

- [ ] The recognised colour, for example "red".
  > That is the output: the colour is the result of the decision, not its raw material.
- [x] The four readings of the sensor.
  > Correct: the four numbers are all the box receives.
- [ ] The source code of `classify()`.
  > The source code is the processing itself, the inside of the box, not an input.
- [ ] The colour as a person sees it.
  > What people see never reaches the box. It receives only the representation the sensor delivers, which is numbers.

> Input, processing and output are three different things: readings, rule and decision.
