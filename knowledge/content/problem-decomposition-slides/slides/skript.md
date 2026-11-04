# Lecture notes: cutting problems

Notes on the deck "cutting problems". They explain the slides for reading afterwards and follow
their order, giving the numbers as the HTML deck counts them (every build-up step has a number
of its own, 30 frames), but they can also be read as a text on their own.

## What this is about

Big problems are not solved in one piece. They are cut, again and again, until the pieces can
be solved and checked. This input shows that you can already do this, hands you three cutting
patterns that work again and again, and explains how to recognise a good cut. At the end it
says why exactly this skill makes the difference when you work with an AI assistant.

**How do you eat an elephant? (frame 3).** One bite at a time. The saying is old, but it holds:
nobody eats an elephant in one piece, and nobody solves a big problem in one piece. Big problems
are not solved, they are cut, until the pieces can be solved.

## Part 1: you can already do this

**The party (frames 5 and 6).** Your flatmate turns 25, party on Saturday, 30 guests. Frame 5
shows this one thing, and nobody plans it as one thing. Frame 6 shows what you do straight
away: you cut it into drinks, food, music, guests and cleaning up, and you hand the pieces out.
That is decomposition. You have been able to do it for a long time; you have just never called
it that. Along the way, the pieces are cut so that you can ask about each one separately whether
it is done, and that will matter later in these notes.

## Part 2: different ways to cut

There are many ways to cut, and three of them are needed all the time.

**Divide and conquer: halve until it's easy (frames 8 to 15).** Think of a number between 1 and
100 and let someone find it with yes/no questions only. Frame 8 shows the starting state: a
hundred candidates, a bar across the full width, and somewhere inside it the 73 we are looking
for. With every question a row is added and the bar gets shorter: "bigger than 50?" yes, and
half is gone; "bigger than 75?" no, and again half. It goes on like this through 25, 12, 6, 3
and 2 candidates to the last question on frame 15, and the number is found. Seven questions are
always enough, whatever the number. The strategy is called divide and conquer, and it works
wherever one half can be ruled out after every cut. The yellow question at the foot of the last
frame, "how many steps in general?", is deliberately left open: every yes/no question is one
bit, and how many are needed is a question of information.

**The same trick when something breaks (frames 16 to 18).** The wifi is dead. Frame 16 shows
the chain of suspects: laptop, wifi, router, provider, internet. On frame 17 the test in the
middle arrives, and half the chain is dealt with: if the phone's hotspot works, the laptop is
fine. That is what you do by instinct when you look at the lights on the router or try another
device. Frame 18 adds a chain from programming: a program prints the wrong total, and the data
passes through reading the file, parsing, adding up, rounding and printing. Print the value in
the middle, after parsing. If it is right, the error lies behind that point, otherwise in front
of it. Whoever cut coarsely only knows that something is broken, whoever cut well knows where.

**Start smaller: solve an easier version first (frame 19).** When a problem is too big, solve a
smaller version that you really can do first, and grow from there. Nobody builds a group chat
first. You print a message on your own screen, then send it to yourself, then to another
computer, then two people chat, and only at the end is there a group chat. The bottom step is
where you start.

## Part 3: a good cut is testable

**Which one are you actually preparing? (frames 21 and 22).** "I need to learn maths" and "I
can solve an old exam in 90 minutes" both sound like exam preparation. The difference shows on
frame 22: with the first you never know whether you are done, while the second you can try out
tonight and get a yes or a no. A good piece is one with a test built into it.

**The same in a program (frames 23 and 24).** "The app works" is a feeling. "A wrong password
shows an error, ten times out of ten" is a test that says yes or no.

**Done means: the test passes (frame 25).** Done does not mean that something looks good; done
means that its test passes. If a task is cut so that every piece has a test of its own, nobody
has to wait for anyone else to know whether a piece is finished.

## Part 4: cuts are agreements

**Where you cut decides how much you have to talk (frame 27).** Back to the party. On the left
of the frame, two responsibilities with a clear edge: you do the starters, I do the dessert.
That works. On the right, two responsibilities overlap, both of you somehow do the food, and in
the overlap stands the question that then stays open: who buys the bread? Pieces work when the
border between them is clear, and whatever crosses the border gets written down.

**And this is how you talk to the AI assistant (frames 28 and 29).** There are two ways to give
the assistant a job. "Build me a chat app" is one big wish: the assistant cannot fulfil it well,
and you could not even check the result. Against it stands a small job that brings its test
along: write a function that puts the time in front of a message, and "hi" at 9:05 must give
"09:05 hi". The job says what should come out and how to check it, which takes ten seconds and
afterwards you know instead of believing. Cutting is the skill that takes you from "I hope the
AI is right" to "I have checked it": you cut the problem, the assistant solves the pieces, and
you check each one.

**One bite at a time (frame 30).** The elephant from the start, one more time. You can already
cut, you have gained three cutting patterns, and you recognise a good cut by the test built into
it.

## Related

On the platform, the project part of this input is the deck "cutting the lifi project"
(`cutting-the-lifi-project`), which applies the same ideas to the LiFi project.
