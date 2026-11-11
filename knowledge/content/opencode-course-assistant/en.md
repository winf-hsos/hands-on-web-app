---
title: "OpenCode: your AI agent for the course folder"
summary: >-
  What OpenCode is, how you set it up with the course folder, what it knows
  about the course, how you work with it and which commands it knows.
translation_of: de
based_on: 2026-11-10
---

[OpenCode](https://opencode.ai) is an AI agent that works in a folder on
your laptop. Unlike a chat in the browser, it reads the files in that
folder itself, writes new ones, runs R code and looks at the result before
it answers. In the course it works in the **course folder**, which holds
everything it needs to know about the course. You write your analysis and
your paper in Positron; OpenCode runs in the window next to it and helps
you.

## Setting up

The whole setup is also described in the course folder in
`course/material/software.md`. If you have already done it, skip to
"Adding the course key".

### 1. Install OpenCode

Download the desktop app from
[opencode.ai/download](https://opencode.ai/download) and install it like any
other program.

- **Windows:** download the Windows installer, run it and follow the steps.
- **macOS:** *Apple Silicon* if your Mac has an M chip, otherwise *Intel*.
  You find it under Apple menu → *About This Mac* in the line *Chip*. Open
  the file and drag OpenCode into the *Applications* folder.

### 2. Get the course folder

1. Open
   [github.com/winf-hsos/data-analytics-courses](https://github.com/winf-hsos/data-analytics-courses),
   click the green **Code** button and then **Download ZIP**.
2. Unpack the ZIP file, on Windows with right-click → *Extract All*. A
   double click only shows the contents and unpacks nothing, and neither
   the agent nor R can work in there.
3. Put the folder where you will find it again, for instance in
   *Documents*.
4. Put the survey data from ILIAS **unchanged** into the subfolder `data/`.

### 3. Open the folder in OpenCode

Start OpenCode. On the left is the list **Projects**. Click the folder icon
with the plus (*Add project*), choose the course folder and then **New
session**. In the input field you type

```text
/onboarding
```

The agent asks for your module and what you bring with you, checks whether
Positron, R and Quarto are installed and installs whatever is missing
together with you. Before every installation it says what it plans to do
and waits for your OK.

Afterwards you open **the same folder** in Positron via *File → Open
Folder*. In the Explorer you then see `my-code`, `data` and `course`.

### Adding the course key

Without a key, OpenCode works with a free model preset by the course
folder. For working on your paper you get a course key for a stronger
model; it is shared in the module's Teams channel and nowhere else.

1. In OpenCode click **Settings** below the project list, then **Providers**
   on the left.
2. Click **+ Connect** next to the provider the key is for. If it is not in
   the list, click *Show more providers* first.
3. Choose **API key** and paste the key.
4. Select the model below the input field.

> [!IMPORTANT]
> The key is like a password, and every answer costs money with it. Send it
> to nobody, put it in no file in the course folder and paste it into no
> chat, not even the one with OpenCode. It belongs only in the field under
> *Providers*.

## What the agent knows about the course

The course folder brings its own instructions, which OpenCode reads every
time it starts. That is why you do not have to explain the course to it:

| File in the course folder | What it contains |
|---|---|
| `.opencode/course-assistant.md` | the rules it works by |
| `course/modules/praxis-mgf/NOW.md` | where the semester stands and what is not covered yet |
| `course/datasets/mds12-schoko-milch-codebook.md` | the codebook: for every question of the survey the wording, filter, codes and the values that actually occur |
| `course/material/` | conventions for R code, error messages, software |
| `my-code/about-me.md` | what it remembers about you: module, operating system, R experience, your group's topic |

It only writes in `my-code/`, asks before it changes a file or runs a
command, and suggests that you record your use of AI in
`my-code/ai-log.md`. If `NOW.md` is more than a week old, it suggests
`/update-semester`.

## The commands

A command starts with a slash and runs a fixed procedure.

| Command | What it does |
|---|---|
| `/onboarding` | the first start: set the module, get to know you, check R, Positron, packages and data |
| `/update-semester` | brings new material, templates and packages into the course folder; `my-code/` and `data/` stay untouched |
| `/paper` | creates the template for your paper: asks for title, topic, research question and authors, creates a Quarto document in `my-code/paper/` and renders it once as a PDF |
| `/research-question` | feedback on your research question after the lesson [What is a research question?](/ds/en/items/research-questions/): classification, check, the columns in the codebook and a verdict, with two sharpened versions where needed |
| `/paper-feedback` | feedback on the structure of your paper after the lesson [How a scientific paper is built](/ds/en/items/paper-structure/), for the whole paper or only one section |
| `/self-study` | accompanies the self-study in R: find out where you stand, next chapter, help in stages |
| `/final-check` | the sign-off of the self-study: run the self-test and a short conversation about your code |

If a command the lecturers announced is missing, get it with
`/update-semester`.

## How to work with it

Write into the input field what you want to achieve and say what matters:
which variable, which group, which chart. With `@` and a file name you
attach a file, and a screenshot you simply drag into the input field. A few
examples to start with:

- "Which questions in the codebook belong to our special topic, and which
  of them were asked to everyone?"
- "Here is our research question: … Which variables answer it, and what is
  missing?"
- "Explain this error message from Positron to me."
- "Read `@my-code/paper/paper.qmd` and tell me where a number in the text is
  typed by hand instead of coming from the code."

Before OpenCode changes a file or runs a command, it asks. Read what it
plans to do before you agree, and run code it writes yourself, line by
line. You answer for what is in your paper, not the agent; that is why you
have to understand every step you take over.

### Feedback on your research question and paper

Two commands give you feedback by the standards of the lessons, without
calculating or rewriting anything for you. Both work without the command
too, if you simply ask.

**`/research-question`** is for when you have a first version of your
question; write it directly after the command:

```text
/research-question Do vegans buy oat drink more often than people who eat everything?
```

The agent first says whether the text is already a question or still a
topic. Then it checks the two conditions, the kind of question and the four
traps, looks up the column in the codebook for every part of the question,
with its filter and number of cases, and gives a verdict in one word:
answerable, adjust or discard. For the last two it suggests two sharpened
versions, and you choose between them. It calculates nothing, because the
point is whether the question holds, not what its answer is. Afterwards you
look up the named columns in the codebook yourselves.

**`/paper-feedback`** is for when your paper has some text in it. Without an
addition the agent looks at the whole paper, with the name of a section
only at that part:

```text
/paper-feedback results
```

You get an overall impression, at most three points per section with the
passage they are about, a list of which sentence should move where, and the
one next step. It looks especially for interpretations in the results, such
as a "probably because" that belongs in the discussion. It only rewrites
when you ask, and it gives no grade.

## If something does not work

Ask the agent first: paste the error message or drag a screenshot into the
input field. If the preset free model does not answer, choose another free
model below the input field. If something cannot be solved, show it in the
session.
