---
title: What is an AI agent?
summary: >-
  What sets an AI agent apart from a chatbot, what it is made of, how it gives
  feedback on the introduction of a paper in Quarto step by step and asks
  before every change, how long the tasks are that agents finish today, and
  which risks working with one brings and what helps against each.
objectives:
  intro: "In this lesson you learn what makes an AI agent and how to work with one on a paper, and afterwards you can:"
  goals:
    - "explain the difference between a chatbot and an agent with the working definition of an agent that runs tools in a loop to achieve a goal"
    - "name the parts of an agent and say what the harness around the language model takes care of"
    - "read the log of an agent run and tell when it only reads and when it wants to change something"
    - "use METR's time horizon to judge how long the tasks are that agents finish today and how often they fail at them"
    - "name the risks of working with an agent and apply a countermeasure to each"
translation_of: de
based_on: 2026-11-18
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
| Context window | everything the agent knows during a run: the goal, every file it has read, every result; it fills up with each file, and when it is full, the agent has to summarize or forget |
| Plan | a list the agent writes and ticks off itself, a tool like any other |
| Instructions | text files loaded at the start: `AGENTS.md` says what the agent should know about the project, skills say how you want certain things done and are loaded only when a task needs them, and commands are prepared instructions for what you often need, such as feedback on a paper |

What turns a language model into an agent is the loop.

Everything around the model is called the **harness**, like the harness that
hitches a horse to a cart: the model provides the power, the harness steers
it. The harness runs the loop, carries out the tool calls, manages the
context window, loads `AGENTS.md`, skills and commands, and asks you for
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

## How far agents get

**How long the tasks are that agents finish.** METR measures the time
horizon of agents: the length of a task, measured as the time a human expert
needs, at which an agent succeeds half the time, and the shorter length at
which it succeeds four times out of five (METR, 2026).

| Model | released | succeeds half the time | succeeds four out of five |
|---|---|---|---|
| GPT-4 | March 2023 | 4 min | 1 min |
| Claude 3.7 Sonnet | February 2025 | 1 h | 12 min |
| GPT-5 | August 2025 | 3.4 h | 38 min |
| Claude Opus 4.6 | February 2026 | 12 h | 70 min |
| Claude Mythos Preview | April 2026 | 17 h | 3.1 h |

Since 2023 the time horizon has doubled about every four months. The tasks
come from software engineering, machine learning and IT security, are well
specified and scored automatically, and METR itself calls values above 16
hours unreliable with its current tasks. For your paper this means that an
agent can do long stretches of work on its own but fails at a good share of
them, so what it delivers is a draft you check.

**What can go wrong, and what helps.**

| Risk | What helps |
|---|---|
| It deletes or overwrites files. | Work in a Git repository or on a copy. |
| It runs a harmful command. | Approve every command it runs. |
| It follows instructions hidden in a web page or a file (indirect prompt injection, Greshake et al., 2023), and there is no complete protection against this yet. | Read what it wants to do before you allow it. |
| Its code runs but computes the wrong thing. | Check one number by hand. |
| It cites sources that do not exist. | Open every reference you cite. |
| Personal data leave your computer, because what it reads goes to the provider of the model. | Keep personal data out of the folder. |
| It settles for basic analyses (Gu et al., 2024). | Decide on variables and method yourself. |
| You no longer know your own paper. | Read every change before you accept it. |

When an agent reports "I fixed the analysis, everything runs", you therefore
read the change and run the code yourself, because running code says nothing
about whether it computes the right thing. Whatever an agent does in your
folder, it does on your behalf, and the paper stays yours.

## Takeaways

- An agent runs tools in a loop until a goal is reached; a chatbot only
  answers, and the next step is yours.
- An agent is a language model plus a harness, and the harness decides what
  the agent may do without asking.
- Reading is free, while changing and running should wait for your yes.
- Agents now finish tasks that take an expert many hours, but only half the
  time, so you check what they deliver.
- Every risk has a countermeasure, and the most important one is to read
  every change before you accept it.

## Sources

- Anthropic (2024). [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents).
- Greshake, K. et al. (2023). *Not what you've signed up for: Compromising
  real-world LLM-integrated applications with indirect prompt injection.*
  [arXiv:2302.12173](https://arxiv.org/abs/2302.12173)
- Gu, K. et al. (2024). BLADE: Benchmarking language model agents for
  data-driven science. *Findings of EMNLP 2024.*
  [arXiv:2408.09667](https://arxiv.org/abs/2408.09667)
- METR (2026). [Task-completion time horizons of frontier AI models](https://metr.org/time-horizons/), Time Horizon 1.1, last updated 8 September 2026; values from the [raw data](https://metr.org/assets/benchmark_results_1_1.yaml).
- Willison, S. (2025). [I think "agent" may finally have a widely enough agreed upon definition to be useful jargon now](https://simonwillison.net/2025/Sep/18/agents/).
