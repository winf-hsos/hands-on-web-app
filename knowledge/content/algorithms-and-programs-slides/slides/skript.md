# Script: algorithms and programs

These notes accompany the stagekit deck "algorithms and programs". They explain the contents of the slides for reading afterwards and follow their order. Build-up steps and the segments of an animation count as frames of their own in the player and in the export (56 frames in all); the references therefore refer to frames.

The core message is: a program is an algorithm written down so completely that a machine can carry it out, line by line and without adding anything. The running example is an LED that a short Python program switches through the course module `lifi_hardware`.

## 1. Be the machine

### Who is playing? (Frame 4)

A piano is playing, the keys move, the stool is empty. Around 1900, self-playing pianos like this stood in many parlours. The player is the paper roll above the keyboard: every punched hole means "press this key now". The piano understands nothing about music, it only executes. The real pianist is the person who punched the roll, perhaps decades earlier. The roll is the program, the piano the machine and the puncher the programmer, and in the next moment you play the piano yourselves.

### Live: you are the receiver (Frame 5)

The lecturer holds up ten colour cards one after another, red, green, blue and yellow in random order, about every two seconds. Everyone follows the four steps on the slide: look at the card, decide which colour it is, write down its first letter, wait for the next card. Afterwards the sequence is read out and compared, and wherever someone got it wrong, the question is at which of the four steps it happened. A receiver that the device is later meant to replace works the same way: it looks, decides, notes and waits.

### That was an algorithm (Frame 6)

Now the thing gets its name. A sequence of steps described so precisely that you can carry it out without understanding what it is for is called an algorithm. It needs no computer, it can stand on a piece of paper, and that is exactly how you have just worked through it.

### Four lines, one of them hard (Frame 7)

The same four lines again, with the second one picked out. A program on the device can take over three of them easily: looking means reading the sensor, writing down means storing a value, and waiting is a single line. The second line, deciding which colour it is, is the actual work of a receiver, and most of the LiFi project hangs on it.

### One more algorithm, live (Frames 8 and 9)

Six volunteers line up unsorted in a row and strictly follow five rules: stand in a row, look at your right neighbour, swap if they are shorter than you, start again at the end of the row, and stop if a full pass had no swap. No thinking and no shortcuts, only executing. After two or three minutes the row stands in order of height. What you just ran is called bubble sort, because the tall ones rise to the right like bubbles, and a computer can sort the same way, following the same five rules, only millions of times faster.

Two observations are worth keeping for later in the deck: how did the procedure recognise its end, and how many comparisons was that with six people, and how many would it be with forty?

### Bubble sort on six bars (Frames 10 to 13)

The same rules on six bars instead of six people, starting from the order 2 5 1 6 3 4. Each frame shows the row after one more pass. Yellow marks the two bars being compared at the moment, and a bar that is taller than its right neighbour swaps places with it. The first pass makes three swaps, the second three more, and the third finds none, so the row turns green.

That is how the procedure knows it is done: a full pass finds nothing left to swap, and nobody from outside has to say "finished". Such a rule is called a termination condition, and it comes back in part 3.

### A program is an algorithm written for a machine (Frame 14)

In the step from the piece of paper to the machine, a requirement comes in that the paper did not have: completeness. A person reading it fills in what was obviously meant, while the machine fills in nothing.

## 2. The instruction follower

### A program is a list (Frame 16)

A program is a list of instructions that a computer follows exactly and in order. There is no more magic involved than a list and a computer that works through it, line by line, from top to bottom.

### The list at work (Frames 17 to 21)

The program has two lines at the top that fetch the tools, `import time` and `from lifi_hardware import led`, and below them four instructions. Each frame executes one more line, and the yellow one is the current line. The first makes the LED red, the second waits one second, the third makes the LED blue, and the fourth waits another second. To the right you see the LED and the time that has passed.

The machine does not know what was meant: it executes what is written, in the order in which it is written, and nothing else. Almost all the errors in the project come from exactly this difference.

### One line (Frames 22 to 25)

The line `led.set_color(255, 0, 0)` consists of three parts. `led` says which thing is addressed. `.set_color` says what should happen to it. The brackets say with which values, here full red, no green and no blue.

### Same instruction, different values (Frame 26)

Three times the same instruction with other values: `(255, 0, 0)` gives red, `(0, 0, 255)` blue, and `(255, 255, 0)` yellow, mixed from full red and full green. The name of the instruction says what happens, and the values say how.

## 3. Four building blocks

Every program in this world consists of four building blocks: instructions one after another, values with names, repetition and condition. You see all four on the LED. Every code block on these slides begins with `import time` and `from lifi_hardware import led`, so you can copy it and run it as it stands.

### Building block 1: one after another (Frame 28)

Instructions run in order, and the order is part of the program, not just a way of writing it down. New here is `time.sleep(1)`: the program waits one second before it executes the next line. Swap two lines, and you have a different program.

### With a pause, and without (Frames 29 to 31)

Two programs side by side, each with a timeline from 0 to 2 seconds below it. On the left the program from building block 1, with a pause between the colours; on the right the same colours without a pause between them, followed by a wait of two seconds. The first segment runs half a second: on the left the LED is red, on the right it is already blue. The second runs up to two seconds.

Both programs are correct. Without a pause, red lives for about a millisecond, far too short for an eye, so you only see blue. The program is not broken, it is only too fast for your eyes.

### Pause in the middle, or at the end (Frames 32 to 34)

The same three lines, once with `time.sleep(1)` in the middle and once at the end. On the left red stays for a second, then blue comes, and right after that the program ends. On the right blue comes at once and stays for a second. When a program ends, the course module switches the LED off, so on the left you only see red and on the right only blue. No line is missing, and still it is a different program: the machine does not rearrange what was meant, it executes what stands where.

### Building block 2: a value with a name (Frame 35)

A name for a value that you then use everywhere: `bright = 120` sets the brightness once, and red, green and blue all follow it. The gain is not brevity but one place to change instead of three.

### Building block 3: again (Frame 36)

A list of colours and a loop over it. Every colour in the list is a triple of numbers such as `(255, 0, 0)`, and `for r, g, b in colors:` unpacks each triple into the three numbers that `led.set_color` expects. A loop is not magic but a way of writing: the same two indented lines run four times, each time with the next value from the list.

### The loop you write, and what actually happens (Frames 37 to 41)

On the left the loop as you write it, on the right what becomes of it on a time axis. Once started, the four passes follow each other on their own, each with the next value from the list and each lasting one second: red, green, blue and yellow, four passes and four seconds in all.

### Building block 4: only if (Frame 42)

A condition executes a line only if it holds, and `else` says what happens otherwise. Here yellow stays for three seconds and every other colour for one. With that, the run depends on something that changes along the way, and a program can react to something instead of reeling off the same thing, for instance to the value the sensor is measuring right now.

### When does this end? (Frame 43)

A loop `while True:` that switches between red and blue. You know the termination condition from sorting in part 1, a pass without a swap; here it is missing. The condition is always true and the body has no way out, so this program never ends. For continuous blinking that is even right, and Ctrl+C stops it. A receiver that is meant to wait for the end of a message, on the other hand, needs a condition at which its loop ends. The workshop classic "my program hangs" almost always means "my loop has no way out".

### What does it cost? (Frame 44)

A game for comparison: someone thinks of a number between 1 and 100, and you may ask questions that are answered with yes or no. Asking every number one by one takes 99 questions in the worst case. Asking whether it is greater than 50, and so halving the range every time, takes at most seven. With a thousand numbers it is 999 against 10.

Both procedures are correct and are still worlds apart. The same holds for sorting from part 1: six people need at most 30 comparisons, forty up to 1,560. Being correct is the minimum, and after that you compare how the cost grows with the size of the problem. For a transmission this becomes the concrete question of how many seconds a file is on its way.

## 4. It does what is written

### An error message (Frames 46 to 49)

A traceback looks threatening, but it is a precise report, and the slide reads it line by line. The program `blink.py` contains the line `time.slep(1)`, and Python answers:

```
Traceback (most recent call last):
  File "C:\lifi\blink.py", line 5, in <module>
    time.slep(1)
    ^^^^^^^^^
AttributeError: module 'time' has no attribute 'slep'. Did you mean: 'sleep'?
```

First it names the file and the line. Then it shows what stands in that line, and the carets point at the place. The last line says what exactly does not exist, here `slep` instead of `sleep`, and Python even guesses what was meant. It does not act on the guess, though: the machine did not fail, it executed what was written and reports exactly where it got stuck.

### Information, not a verdict (Frames 50 and 51)

An error message is information about the program and not a judgement of you as a person. Read it out loud, because most of the time it says literally what is wrong. In a live moment the lecturer then builds errors into the blinking program on purpose, one after another, and the audience reads together what the message says: a typo in a name, a forgotten bracket, a wrong indentation.

## 5. Working with the assistant

### Two ways to ask (Frames 53 and 54)

The first request, "write me a program for the LED.", gets you code you do not understand. The second says what should come out and orders the explanation along with it: "the LED should be red for three seconds, then blue. explain each line before you write it." That gets you code and understanding.

### Never keep code you cannot change (Frame 55)

Every hand-over ends with a small change you make yourself: swap a colour, adjust a waiting time. If you cannot change it, you have not taken the code over but only copied it.

### Your turn (Frame 56)

Three small programs on your own device. First, light on: red for two seconds, then off. Second, blink five times, with the speed set in one place. Third, show a list of colours, one second each. Number two is the real task, because changing the speed must not mean digging through the code, so it needs building block 2; number three needs building block 3, the loop over a list.
