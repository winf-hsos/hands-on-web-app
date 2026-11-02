---
title: Cutting problems
summary: >-
  How to cut a problem that is too big to solve into pieces that can be solved
  and checked one at a time, and why this also shapes working with an AI.
objectives:
  intro: "Here you learn to cut a problem that is too big into pieces you can solve, and afterwards you can:"
  goals:
    - "explain what decomposition means using an everyday example such as planning a party"
    - "use divide and conquer to find a number between 1 and 100 in at most seven yes/no questions, and narrow down a fault in a chain with a test in the middle"
    - "solve a smaller version of a problem first and grow it from there step by step"
    - "phrase a piece so that a built-in test says yes or no to whether it is done"
    - "split responsibilities along clear borders and give an AI assistant small jobs that bring their own test"
translation_of: de
based_on: 2026-11-02
---

"Build a chat app" cannot be solved in one piece, by anyone. That says nothing
about you; it is the normal state of every interesting problem. Big problems
are not solved in one go: they are cut, again and again, until the pieces are
small enough to be solved and checked.

You can already do this, by the way. Somebody's birthday is on Saturday,
thirty guests are coming, and nobody plans "the party" as one thing. You cut it
at once into drinks, food, music, guests and cleaning up, and then you hand the
pieces out. What is new here is only doing it on purpose, and knowing what
makes one cut better than another.

![A tree: at the top the problem "party, saturday, 30 guests", below it five boxes for drinks, food, music, guests and cleanup.](media/party.en.svg "Nobody plans the party as one thing. It falls apart at once into pieces that can be done and ticked off one by one.")

## Three cutting patterns

There are tried and tested ways to cut, and you will use three of them all
the time.

### Halve it until it is easy

Computer science calls this divide and conquer. Think of a number between 1
and 100. With yes-or-no questions that cut the range in half every time, you
find any number in at most seven questions: a hundred candidates, then fifty,
twenty-five, twelve, six, three, two, done. The strategy works wherever you can
rule out one half after every cut.

![Eight rows one below the other. On the left how many numbers are still left, from 100 down to 1, in the middle a bar for the remaining range, on the right the question with its answer. A red vertical line marks the 73 we are looking for.](media/halving-search.en.svg "The range from 1 to 100, halved with every question. The 73 we are looking for stays inside the bar until exactly one number is left.")

Why it is exactly seven questions has to do with information: every yes-or-no
question delivers one bit, and seven bits tell 128 possibilities apart, more
than the hundred there are here.

### The same trick when something is broken

You know this one too. When the wifi is dead, you test in the middle of the
chain without thinking about it: if the phone hotspot works, it is not the
laptop, and half the suspects are gone. Every test halves the chain. You do the
same when a program prints a wrong total: print the value in the middle; if it
is right, the fault lies behind it, otherwise before. Whoever has cut well
knows not only **that** something is broken, but **where**.

![Two chains of five boxes each. At the top laptop, wifi, router, provider and internet, below read file, parse, add up, round and print. A red arrow points at the middle of each, and the two boxes before it are greyed out.](media/debug-chain.en.svg "Finding a fault by halving: one test in the middle rules out half the chain. At the top the everyday case, below the same thought in a program.")

### Solve a smaller version first

When a problem is too big, solve a smaller version of it that you really can
do, and grow from there. Nobody builds a group chat first. You start by
printing a message on your own screen, then send it to yourself and after that
to another computer, and only at the end do several people chat with each
other. Every step is a slightly bigger version of the same problem, and on
every one of them something already runs.

![A staircase of five boxes that grow taller to the right: print a message, send it to yourself, send it to another computer, two people chatting, a group chat. The first box is blue and labelled "you are here".](media/smaller-first.en.svg "The staircase to the chat app: every step is a slightly bigger version of the same problem, and at the start you stand on the bottom one.")

## A good cut is testable

Cutting alone is not enough, because not every cut is equally good. Compare two
sentences: "I need to learn maths" and "I can solve an old exam in 90
minutes". Both sound like exam preparation. With the first one you never know
whether you are done; the second one you can try out tonight, and you get a yes
or a no. A good piece is one with a test built into it.

![Two boxes side by side. On the left, greyed out, "i need to learn maths.", on the right, highlighted, "i can solve an old exam in 90 minutes." with a tick below it.](media/testable-exam.en.svg "Two sentences that both sound like preparation. Only the right one tells you when you are done.")

In a program it is the same. "The app works" is a feeling. "A wrong password
shows an error, 10 times out of 10" is a test that answers yes or no.

![Two boxes side by side. On the left, greyed out, "the app works.", on the right, highlighted, "a wrong password shows an error, 10 times out of 10." with a tick below it.](media/testable-program.en.svg "A feeling and a test: only the right sentence can be checked.")

From this follows a simple rule: **done means the test passes**, not "it looks
good". Whoever cuts a task so that every piece has a test of its own does not
have to wait for anyone to know whether they are done.

## Cuts are agreements

Where you cut decides how much you have to talk. "You do the starters, I do
the dessert" works. "We both kind of do the food" turns into chaos, because
nobody knows who buys the bread. Pieces work when the border between them is
clear, and whatever crosses the border gets written down.

![On the left two boxes sharing an edge, "you: starters" and "me: dessert", with a tick below. On the right two boxes that overlap, both "the food", the overlap red with a question mark, and a cross below.](media/clear-borders.en.svg "A clear border against an overlap: on the left everyone knows what is theirs, on the right nobody knows who buys the bread.")

With an AI assistant, cutting is the key skill of all. "Build me a chat app" is
one big wish: the assistant cannot do it well, and you could not check the
result if it did. A small piece with its test is a different thing. It says
exactly what should come out and names the test with it, so you can check the
answer in ten seconds without having to believe the assistant.

![Two boxes side by side. On the left, greyed out, the big wish "build me a chat app.", on the right a small job in code font: a function that puts the time in front of a message, with the test that "hi" at 9:05 gives "09:05 hi".](media/small-pieces.en.svg "Two ways to give an assistant a job. You can check the one on the right, not the one on the left.")

You cut the problem, the assistant solves the pieces, and you check each one.
What a cut piece needs once a computer is supposed to solve it is shown in
[[input-processing-output]].

## Further reading

George Pólya: *How to Solve It*. Princeton University Press, 1945. The classic
on cutting problems, written for mathematics and readable far beyond it:
understand the problem, make a plan, carry it out, look back. His questions
("Do you know a related problem?", "Can you solve a part of it?") are the long
version of this page.
