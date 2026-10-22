# Lecture notes: cutting the lifi project

Notes on the deck "cutting the lifi project", the project part of the input on cutting
problems. They explain the slides for reading afterwards and follow their order, giving the
numbers as the HTML deck counts them (every build-up step has a number of its own, 18 frames),
but they can also be read as a text on their own. The general ideas they rely on, the three
cutting patterns and the testable piece, are explained in the notes on "cutting problems"
(`problem-decomposition`).

## What this is about

The LiFi project is a large problem, and these notes show how it is cut into challenges and how
the same habits of cutting carry you through every one of them: when nothing arrives, when two
people share the work, and when you give a job to the AI assistant.

**This is your elephant (frame 3).** Two small devices face each other, with light between
them, and in the end a whole file is to travel across that gap. That is the elephant you will be
eating in the project.

## Part 1: the elephant

**The task (frame 5).** "Transfer a file from one laptop to another, using light." Put like
this, as one piece, nobody can solve it, no professional, no AI and not you either. That is not
a threat but the normal state of things: interesting problems are always too big at the start.

**The same problem, cut (frames 6 to 8).** Frame 6 shows the big problem on its own. Frame 7
shows it cut into four pieces: telling colours apart, turning letters into colours, finding the
beginning and the end of a message, and moving a whole file. Every piece is solvable, by you.
Frame 8 gives the pieces their names, and that is the point: the project is built along exactly
this decomposition, and the four pieces are Challenge 1 to 4.

**Start smaller: the challenges are the stairs (frame 9).** The same pattern as in the general
part, now with your own steps: first light on and off, then as many colours as the sensor can
tell apart, then a single character, then a word, and at the end a whole file. The steps are
Challenges 0 to 4, and you start on the bottom one.

**One question, four questions (frame 10).** Behind the decomposition sits the map of the whole
module. The big question is how computers solve complex problems, and beneath it lie four
questions about information: how computers represent it, how they store it, how they transfer
it and how they process it. Under each question stand examples of its concepts, for
transferring for instance signal and noise, timing and protocols. The light link is the
transferring, but you also represent colours as symbols, you store a file, and you process it
with a checksum, so the project touches all four questions.

## Part 2: cutting along the way

Cutting does not stop once the challenges are set; it goes with you through each of them.

**When nothing arrives (frames 12 and 13).** In the project your chain is sender, LED, air,
sensor and receiver, and you will walk along it often when nothing arrives. Frame 13 puts the
test in the middle: is the LED lit at all, and does the sensor see a torch? Every test in the
middle halves the chain of suspects.

**One person per end of the link (frame 14).** In a team of two the same holds as for the
party: one person takes each end of the link, and whatever crosses the border between them, for
instance which colour stands for which character, is written down. How serious that is shows in
Challenge 3, when another team has to read your agreement and build a receiver from it.

**A testable piece of the project (frames 15 and 16).** "The receiver works" is a feeling. "Red
or blue, recognised correctly 50 times in a row" is a measurement. Every challenge is written
like that, and the acceptance tests run like that: there is always a test that says yes or no.

**And the assistant gets small pieces (frames 17 and 18).** "Build me the file transfer" is one
big wish: the assistant cannot fulfil it well, and you could not even check the result. Against
it stands the small job with its test: read the sensor ten times and return the average; with
the sensor covered the average stays under 10, and with the red LED on it goes over 100. That
takes ten seconds to check, without having to believe the assistant. Cutting is why working with
an AI assistant can be checked at all, and it is one of the four goals of the module: you cut
the problem, the assistant solves the pieces, and you check each one.
