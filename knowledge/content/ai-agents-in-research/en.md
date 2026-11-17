---
title: What is an AI agent?
summary: >-
  What sets an AI agent apart from a chatbot, what it is made of, how it gives
  feedback on the introduction of a paper in Quarto step by step and asks
  before every change, what studies found about benefits and risks, and which
  rules apply when you work with one.
objectives:
  intro: "In this lesson you learn what makes an AI agent and how to work with one on a paper, and afterwards you can:"
  goals:
    - "explain the difference between a chatbot and an agent with the working definition of an agent that runs tools in a loop to achieve a goal"
    - "name the parts of an agent and say what the harness around the language model takes care of"
    - "read the log of an agent run and tell when it only reads and when it wants to change something"
    - "use three studies to explain why you judge an agent by what it delivers and make analysis decisions yourself"
    - "apply five rules for working with an agent on a paper"
translation_of: de
based_on: 2026-11-17
---

![Slides: What is an AI agent?](item:ai-agents-in-research-slides)

A chatbot is like a consultant on the phone: it tells you what to do, and you
carry it out yourself. An agent is like someone you hand the keys to your
office: it opens the files itself, reads them, changes them and runs
programs. That is why it can do so much more, and why it matters what you let
it do. This lesson explains how an agent is built and how it works on a paper
in Quarto, for example with the course assistant
[[opencode-course-assistant]].

## Chatbot or agent

With a chatbot you write a prompt, the model writes an answer, and the next
step is yours: you copy the R code into your script, run it and paste the
error message back. With an agent you give a goal, and the model calls tools
itself, looks at the results and carries on until the goal is reached: it
reads your script, runs it, sees the error and fixes it. Under the hood it
can be the same language model; the difference lies in what is built around
the model.

Simon Willison (2025) proposed a short working definition:

> An AI agent runs tools in a loop to achieve a goal.

Three terms carry it. With **tools** the agent can read and write files, run
programs and search the web. The **loop** means it looks at what a tool
returned and chooses the next step itself. The **goal** describes what you
want, not how to get there. Anthropic (2024) describes agents in almost the
same words, as language models that use tools based on feedback from their
environment in a loop.

## What an agent is made of

At the start there is a **goal**, such as "give us feedback on the
introduction of our paper", and a **language model**, which on its own can
only produce text and cannot open a file. Then come:

| Part | What it contributes |
|---|---|
| Tools | `read`, `edit`, `write`, `bash` for programs such as R or Quarto, `web search`; the model only writes down which tool it wants to call with which arguments, and the program around the model carries out the call |
| Loop | every result goes back to the model, which thinks, acts and observes again (in research this pattern is called ReAct) |
| Context window | everything the agent knows during a run: the goal, every file it has read, every result; it fills up with each file, and when it is full, the agent has to summarise or forget |
| Plan | a list the agent writes and ticks off itself, a tool like any other |
| Instructions | text files loaded at the start: `AGENTS.md` says what the agent should know about the project, and commands are prepared instructions for recurring tasks, such as how to give feedback on a paper |

What turns a language model into an agent is the loop.

Everything around the model is called the **harness**, like the harness that
hitches a horse to a cart: the model provides the power, the harness steers
it. The harness runs the loop, carries out the tool calls, manages the
context window, loads the plan, `AGENTS.md` and commands, and asks you for
permission. OpenCode, Claude Code and Codex are harnesses, and many of them
let you choose the model. An AI agent is therefore a language model plus a
harness.

## An agent at work

This is what a run looks like in the log when you ask an agent for feedback
on your introduction:

| Step | What happens |
|---|---|
| you | give us feedback on the structure of our introduction |
| `read` | `paper/paper.qmd` |
| `read` | `paper/sections/_introduction.qmd` |
| answer | the research question stands in the second paragraph; move it to the end of the introduction. |
| you | please move it |
| `edit` | `paper/sections/_introduction.qmd` – allow once · allow always · reject |

The agent first reads the central file of the paper, finds that the sections
live in files of their own and reads the introduction. Then it answers, and
up to this point nothing in your files has changed. Only when you ask it to
move the question does it want to edit the file, and the harness stops and
asks: allow once, allow always or reject. Before you allow it, you see the
change as a diff, line by line.

What the agent may do without asking is set in the settings of the harness,
for OpenCode in `opencode.json`:

```json
"permission": {
  "edit": "ask",
  "bash": "ask"
}
```

With these lines it may read your files freely but has to ask before it
changes a file or runs a command in the shell. You can loosen this, for
example always allow R, but the safest start is to let it ask and to read
what it intends before you agree.

## What studies found

**Feeling faster, measured slower.** In a randomised trial by METR, 16
experienced software developers worked on 246 real tasks in their own
projects, each task randomly with or without AI tools as of early 2025
(Becker et al., 2025). Beforehand they expected to be 24 % faster with AI,
afterwards they believed they had been 20 % faster, and measured they took
19 % longer. The tools have improved since, and in February 2026 METR wrote
that newer data hint at a speed-up but can no longer be measured reliably
with this study design (METR, 2026). What remains is the gap between feeling
and measuring: judge an agent by what it delivers.

**Agents stop at simple analyses.** The BLADE benchmark (Gu et al., 2024)
gives models and agents 12 data sets with questions from published studies
and compares their analysis decisions with those of experts: which
variables, how they are transformed, which model. The models mostly chose
basic analyses; agents that could work with the data did better but still
made fewer and less varied decisions than the experts. So let an agent write
and run the code, but decide yourself which variables, which groups and
which method.

**Instructions hidden in what it reads.** A language model cannot reliably
tell your instructions apart from text it reads along the way. Greshake et
al. (2023) showed that a web page or a document can contain hidden
instructions that make an assistant do something else, such as sending data
somewhere. This is called indirect prompt injection, and there is no
complete protection against it yet. That is one more reason to keep the
permissions strict and to read what an agent intends before you allow it.

So when an agent reports "I fixed the analysis, everything runs", you read
the change and run the code yourself. That code runs says nothing about
whether it computes the right thing, and asking the agent whether it is sure
only gets you another confident answer.

## Five rules

1. Give the agent a goal and the context it needs: what the paper is about,
   which file, what you want back.
2. Let it ask before it changes a file or runs a program.
3. Read every change before you accept it.
4. Run the code yourself and check one number by hand.
5. Keep personal data out, and answer for the result yourself.

Whatever an agent does in your folder, it does on your behalf: names,
free-text answers with personal details and files you may not share stay
out, and the paper stays yours.

## Takeaways

- An agent runs tools in a loop until a goal is reached; a chatbot only
  answers, and the next step is yours.
- An agent is a language model plus a harness, and the harness decides what
  the agent may do without asking.
- Reading may be free, while changing and running should wait for your yes.
- Feeling faster is not the same as being faster, and which analysis is run
  is your decision.
- What an agent reads can steer it, so you read what it intends.

## Sources

- Anthropic (2024). [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents).
- Becker, J. et al. (2025). *Measuring the impact of early-2025 AI on
  experienced open-source developer productivity.* METR.
  [arXiv:2507.09089](https://arxiv.org/abs/2507.09089)
- Greshake, K. et al. (2023). *Not what you've signed up for: Compromising
  real-world LLM-integrated applications with indirect prompt injection.*
  [arXiv:2302.12173](https://arxiv.org/abs/2302.12173)
- Gu, K. et al. (2024). BLADE: Benchmarking language model agents for
  data-driven science. *Findings of EMNLP 2024.*
  [arXiv:2408.09667](https://arxiv.org/abs/2408.09667)
- METR (2026). [Update on the productivity study, 24 February 2026](https://metr.org/blog/2026-02-24-uplift-update/).
- Willison, S. (2025). [I think "agent" may finally have a widely enough agreed upon definition to be useful jargon now](https://simonwillison.net/2025/Sep/18/agents/).
