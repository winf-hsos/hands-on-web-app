---
type: exercise
code: 1279
title: "Input, processing, output: The IPO model"
summary: >-
  You test boxes without looking inside them: a test that only fails when it
  should, a colour rule that fails on a single reading, your own test cases,
  and a chain of encode() and decode() whose agreement does not match.
objectives:
  intro: "In this exercise you test boxes by their input and their expected output, and afterwards you can:"
  goals:
    - "write a test from an input and an expected output before you know the result, and recognise when a single test does not reveal an error"
    - "explain from a failing reading why the rule and not the reading is wrong, and repair the rule"
    - "find your own test cases for a decision rule, including ones on which it fails"
    - "follow the data from boundary to boundary in a chain of encode() and decode() and find the agreement that does not match"
level: 1
duration: 20
topics: [solving-problems, processing-information]
modules: [dup]
relations:
  requires: [input-processing-output]
status: published
updated: 2026-11-02
---

[[input-processing-output|Solving problems with computers]] showed
that every piece a computer can solve has an input, a processing and an
output, and that a known input with an expected output makes a test. In this
exercise you put that to work on four small boxes.

## Step 1: The expectation first

The function `add()` is to add two numbers. The test below puts in 2 and 3,
and before it runs, it says what has to come out.

```python
def add(a, b):
    return a + b

expected = 5
actual = add(2, 3)
print("expected:", expected, "actual:", actual)
if actual == expected:
    print("pass")
else:
    print("fail")
```

Run the test. Then change `a + b` into `a * b`, predict what the test will
report, and run it again. Finally, look for an input for which `a + b` and
`a * b` give the same result, so that this error would slip through.

> [!HINT]
> Try small numbers that are equal to each other. For which number is adding
> it to itself the same as multiplying it by itself?

> [!SOLUTION]
> With `a * b` the box returns 6 instead of 5, and the test reports fail,
> without you reading a line inside `add()`. With the input 2 and 2, however,
> both versions return 4, so a test with `add(2, 2)` and the expectation 4
> passes although the box multiplies. A single test only checks the one
> input it uses, which is why a box usually needs several tests with
> different inputs.

## Step 2: A rule that fails on one reading

A colour sensor delivers four numbers, the strength of red, green and blue
light and the overall brightness. The function `classify()` decides from
these numbers which colour the lamp shows. The list `tests` holds four
readings together with the colour that was really shown, so every line is a
test.

```python
def classify(r, g, b, c):
    if c < 100:
        return "off"
    strongest = max(r, g, b)
    if strongest == r:
        return "red"
    if strongest == g:
        return "green"
    return "blue"

# four readings each, and the colour that was really shown
tests = [
    (203, 41, 57, 310, "red"),
    (35, 180, 70, 290, "green"),
    (30, 28, 34, 60, "off"),
    (60, 14, 19, 95, "red"),
]

for r, g, b, c, expected in tests:
    actual = classify(r, g, b, c)
    if actual == expected:
        print(r, g, b, c, "expected", expected, "actual", actual, "pass")
    else:
        print(r, g, b, c, "expected", expected, "actual", actual, "fail")
```

Run the tests and find the one that fails. Explain why it fails, and change
the rule, not the readings, so that all four tests pass.

> [!HINT]
> Compare the brightness `c` of the failing reading with the number in the
> first line of the rule. Mind the third test as well: a lamp that is
> really off must still count as off afterwards.

> [!SOLUTION]
> The fourth test fails: the red lamp was further away from the sensor, its
> brightness of 95 lies below the threshold of 100, and the rule calls it
> off. The reading is correct, the rule does not fit reality. A threshold
> above 60 and at most 95 fixes it, for example `if c < 80:`. Then all four
> tests pass, although no reading has changed, because the input and the
> rule together decide what comes out.

## Step 3: Your own test cases

Here is the rule with the threshold of 80. Add two tests of your own to the
list: a blue lamp, and a yellow lamp. Yellow light is a mix of red and green,
so the sensor measures red and green about equally strongly, for example
180 and 175, and little blue.

```python
def classify(r, g, b, c):
    if c < 80:
        return "off"
    strongest = max(r, g, b)
    if strongest == r:
        return "red"
    if strongest == g:
        return "green"
    return "blue"

tests = [
    (203, 41, 57, 310, "red"),
    (35, 180, 70, 290, "green"),
    (30, 28, 34, 60, "off"),
    (60, 14, 19, 95, "red"),
    # your tests: (r, g, b, c, "expected colour"),
]

for r, g, b, c, expected in tests:
    actual = classify(r, g, b, c)
    if actual == expected:
        print(r, g, b, c, "expected", expected, "actual", actual, "pass")
    else:
        print(r, g, b, c, "expected", expected, "actual", actual, "fail")
```

What does the rule answer for your yellow lamp, and why?

> [!HINT]
> A test is one more line in the list, for a blue lamp perhaps
> `(30, 50, 190, 260, "blue"),`. For yellow, write the colour you expect,
> `"yellow"`, and not what you think the rule will say.

> [!SOLUTION]
> ```python static
> tests = [
>     (203, 41, 57, 310, "red"),
>     (35, 180, 70, 290, "green"),
>     (30, 28, 34, 60, "off"),
>     (60, 14, 19, 95, "red"),
>     (30, 50, 190, 260, "blue"),
>     (180, 175, 40, 380, "yellow"),
> ]
> ```
>
> The blue test passes, while the yellow one fails with `red`: the rule only
> knows three colours and lets the strongest channel win, even when it is
> barely stronger than the second. No line is broken, but the rule has no
> answer for this input. A test that fails like this is a good find, since
> it shows what the rule is still missing.

## Step 4: The fault at the boundary

A sender turns text into colours with `encode()`, and a receiver turns the
colours back into text with `decode()`. Both look up their colours in a
table: in a Python dictionary, `SENDER["a"]` is the colour the sender uses
for the letter `a`, and `RECEIVER["blue"]` is the letter the receiver reads
for blue.

```python
SENDER = {"h": "red", "i": "green", "a": "blue", "b": "white"}
RECEIVER = {"red": "h", "green": "i", "blue": "b", "white": "a"}

def encode(text):
    colours = []
    for letter in text:
        colours.append(SENDER[letter])
    return colours

def decode(colours):
    text = ""
    for colour in colours:
        text = text + RECEIVER[colour]
    return text

message = "hi"
colours = encode(message)
received = decode(colours)
print("sent:", message, "| light:", colours, "| received:", received)
if received == message:
    print("pass")
else:
    print("fail")
```

Run the chain with `"hi"`, then with `"ab"`. Follow the data from boundary
to boundary using the printed line, and decide which box is wrong:
`encode()`, `decode()` or neither. Then make the chain pass for both
messages.

> [!HINT]
> For `"ab"`, look at the light in between. Which letter does the sender mean
> by `blue`, and which letter does the receiver read for it?

> [!SOLUTION]
> With `"hi"` the test passes, and with `"ab"` it fails, because `"ba"`
> arrives. Both functions work exactly as written: `encode()` turns `a` into
> blue as its table says, and `decode()` turns blue into `b` as its own table
> says. The fault lies in the agreement at the boundary, since the two tables
> disagree about blue and white. Once the receiver uses the same agreement,
> both messages arrive:
>
> ```python static
> RECEIVER = {"red": "h", "green": "i", "blue": "a", "white": "b"}
> ```

## For the quick ones

Extend `classify()` from step 3 so that your yellow test passes and all the
other tests still pass. One possible rule: if red and green are both much
stronger than blue and differ by less than 20, the lamp is yellow. Then add
a test for which your new rule gives the wrong answer, and consider whether
that reading could really occur.
