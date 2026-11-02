---
title: "First light: device, assistant and first program"
summary: >-
  The start of the LiFi project: what sits on the device, what an AI agent
  like OpenCode does differently from a chat and what to watch out for, how
  the laptop is set up, and, together, the first program, a kitchen timer
  with a coloured lamp in the terminal.
objectives:
  intro: "With these slides and the tasks below you prepare for the LiFi project, and afterwards you can:"
  goals:
    - "name the parts of the device and describe the chain from your idea through OpenCode, your program, `lifi_hardware` and the Brick Daemon to the light"
    - "explain what sets an AI agent apart from a chat and describe its loop of thinking, acting and checking"
    - "tell the program from the language model and explain why keys, passwords and personal data stay out of the chat"
    - "explain what the context window is and why a new task gets a new session"
    - "start a Python program in the terminal and read an error message from the bottom up"
    - "build a kitchen timer in five steps with `input()`, `while`, `for`, `def` and `if`/`else`, running it after each step"
translation_of: de
based_on: 2026-11-02
---

Below the slides are the tasks you work through in the workshop, to read
again and to carry on with at home. You write your program in VS Code and run
it in the terminal. You set up both beforehand, as [[lifi-software]]
describes.

Your assistant could write the kitchen timer in ten seconds, but then you
would have a program and would have learned nothing. So use it as a teacher:
let it explain what a line does, let it read your file ("read my `timer.py`,
is step 2 right?") or run the program itself, and ask it for a hint instead of
the solution.

## Warm-up 1: your first program

Open your course folder in VS Code with *File > Open Folder*. On the left,
right-click the folder `my-code`, choose *New File* and call it `hello.py`.
Type this line into it and save with Ctrl+S (Cmd+S on a Mac):

```python static
print("Hello, world!")
```

Then open a terminal with *Terminal > New Terminal*. It starts in your course
folder, so you change into your folder with `cd my-code` and run the program
with `python hello.py`, on a Mac with `python3 hello.py`.

```text
> python hello.py
Hello, world!
```

> [!TIP]
> When you first open a `.py` file, VS Code offers to install its Python
> extension. Accept it. The play button at the top right runs the program as
> well, but it is worth seeing once what happens behind it in the terminal.

## Warm-up 2: asking and answering

Change `hello.py` so that the program asks for your name and greets you with
it. Then run it again; the up arrow in the terminal brings back the last
command.

```text
> python hello.py
What is your name? Kim
Hello, Kim!
```

> [!HINT]
> `input("…")` shows the question, waits for Enter and hands back what was
> typed. With `name = …` you remember it under a name, and `+` joins pieces
> of text.

> [!SOLUTION]
> ```python static
> name = input("What is your name? ")
> print("Hello, " + name + "!")
> ```

## The kitchen timer

Write a kitchen timer for the terminal. It asks how many seconds it should
run and then counts down, one line per second. A coloured lamp shows how it
stands: green while it runs, yellow in the last five seconds and red when
time is up. Without a device the lamp is a coloured block in the terminal;
with your device it becomes the LED.

```text
> python timer.py
How many seconds? five
Digits only, please: 8
Timer: 8 seconds
████ 8 s
████ 7 s
████ 6 s
████ 5 s
████ 4 s
████ 3 s
████ 2 s
████ 1 s
████ time is up!
```

Whoever writes it all at once gets lost. So cut the timer into five steps,
each with its own tool in Python, and run the program after every step; when
something breaks, the fault is in the last step. How to cut a problem like
this is shown in [[problem-decomposition]].

| Step | What has to happen | Tool |
|---|---|---|
| 1 | get the number of seconds | `input()` |
| 2 | check if the input is valid | `while` |
| 3 | count down each second | `for` |
| 4 | show a coloured lamp | `def` |
| 5 | decide which colour | `if` / `else` |

## Step 1: get the number of seconds

Create the file `timer.py` in `my-code`. The program asks for the number of
seconds, turns it into a whole number and prints it as a test.

> [!HINT]
> `input()` always hands back text, even if you type 20. Try
> `print(text + 1)` and read what Python says. `int(text)` turns the text
> into a whole number.

> [!SOLUTION]
> ```python static
> text = input("How many seconds? ")
> seconds = int(text)
> print("Timer:", seconds, "seconds")
> ```

Now start the timer and type `five` instead of a number. The program stops
with an error message:

```text
Traceback (most recent call last):
  File "…\my-code\timer.py", line 2, in <module>
    seconds = int(text)
ValueError: invalid literal for int() with base 10: 'five'
```

Read it from the bottom up. The last line says what went wrong: `int()`
cannot make a number out of "five". The lines above say where it happened,
in `timer.py` in line 2, and show that line. If you are stuck, let your
assistant run the program with `five` and explain the message.

## Step 2: check if the input is valid

Make the program ask again until only digits have been typed. Then try
`five` and then `20`, and ask your assistant what happens with `0`.

> [!HINT]
> `text.isdigit()` is true when the text consists of digits only, so for
> "20", but not for "five", "-3" or "2.5". `while` means "as long as", and
> the indented line below it is repeated. The new lines go between `input`
> and `int`.

> [!SOLUTION]
> ```python static
> text = input("How many seconds? ")
> while not text.isdigit():
>     text = input("Digits only, please: ")
> seconds = int(text)
> ```

## Step 3: count down each second

Let the program count down from the number typed to 1, one line per second,
and print "time is up!" at the end. Then, as a test, move `time.sleep(1)` out
of the indentation and watch what changes.

> [!HINT]
> `import time` belongs at the very top of the file; then `time.sleep(1)`
> waits one second. `range(seconds, 0, -1)` produces the numbers from
> `seconds` backwards down to 1, since the limit 0 is itself not included.

> [!SOLUTION]
> ```python static
> import time
>
> for remaining in range(seconds, 0, -1):
>     print(remaining, "s")
>     time.sleep(1)
>
> print("time is up!")
> ```

## Step 4: show a coloured lamp

You need the lamp three times in three colours, so you give its lines a
name. Copy the function `lamp(r, g, b)` below `import time` and try it with
`lamp(0, 200, 0)`, which is green. The values for red, green and blue each
range from 0 to 255.

```python static
def lamp(r, g, b):
    on = f"\033[48;2;{r};{g};{b}m"
    off = "\033[0m"
    print(on + " " * 12 + off, end=" ")
```

The characters with the backslash are instructions to the terminal that
switch a background colour on and off again; in between are twelve spaces,
which become coloured that way. You do not have to understand them to use
`lamp()`, and that is exactly what a function gives you: it hides the details
behind a name, just as `print()` and `input()` do. If you see strange
characters instead of a colour, your program runs in the old Windows
console; ask your assistant then.

## Step 5: decide which colour

Show a lamp in every round of the loop, yellow when five seconds or fewer
are left and green otherwise, and a red one once after the loop. Try it with
8 seconds.

> [!HINT]
> `if remaining <= 5:` checks a condition. If it is true, the indented block
> below it runs, otherwise the block below `else:`, always exactly one of the
> two. Yellow is `lamp(255, 200, 0)`, red is `lamp(255, 0, 0)`.

> [!SOLUTION]
> ```python static
> for remaining in range(seconds, 0, -1):
>     if remaining <= 5:
>         lamp(255, 200, 0)   # yellow
>     else:
>         lamp(0, 200, 0)     # green
>     print(remaining, "s")
>     time.sleep(1)
>
> lamp(255, 0, 0)             # red
> print("time is up!")
> ```

## The whole program

Read your finished program in VS Code from top to bottom, the way Python
reads it. That is why `import time` stands at the very top, then the function,
and only after that the part that uses it, because a function has to be
defined before it is called. Ask your assistant about every line you cannot
explain.

> [!SOLUTION]
> ```python static
> import time
>
> def lamp(r, g, b):
>     on = f"\033[48;2;{r};{g};{b}m"
>     off = "\033[0m"
>     print(on + " " * 12 + off, end=" ")
>
> text = input("How many seconds? ")
> while not text.isdigit():
>     text = input("Digits only, please: ")
> seconds = int(text)
> print("Timer:", seconds, "seconds")
>
> for remaining in range(seconds, 0, -1):
>     if remaining <= 5:
>         lamp(255, 200, 0)   # yellow
>     else:
>         lamp(0, 200, 0)     # green
>     print(remaining, "s")
>     time.sleep(1)
>
> lamp(255, 0, 0)             # red
> print("time is up!")
> ```

## For the quick ones

Show the time left in minutes and seconds, so `1:05` instead of `65 s`.

> [!HINT]
> `remaining // 60` gives the full minutes and `remaining % 60` the seconds
> left over. With `f"{minutes}:{secs:02d}"` the seconds always have two
> digits.

## Where are you?

When you are asked in the workshop where you are, answer with the line you
have reached. Whoever has reached the last one helps the team at the next
table or extends the timer.

1. OpenCode is installed and the course folder is open.
2. The assistant answers.
3. `/onboarding` has run through.
4. `hello.py` runs.
5. The timer counts down.
6. The timer shows its colours.

With your device, the lamp in the terminal becomes the LED: you swap
`lamp()` for `led.set_color()`, and your timer lights up on the table.
