---
type: tool
code: 6942
title: LM Studio Bionic
summary: >-
  An AI agent by the makers of LM Studio that works on documents and code with
  open models, either on your own laptop or in the maker's cloud, and could
  serve as an alternative to OpenCode in teaching.
objectives:
  intro: "This page introduces LM Studio Bionic, an agent for open models, and afterwards you can:"
  goals:
    - "tell Bionic apart from LM Studio and say which of the two a task needs"
    - "choose whether a session runs on a local, a remote or a cloud model, and what each choice costs"
    - "set up a project for documents or for a folder of code and give the agent a focused task"
    - "use skills in the SKILL.md format, also those you already use in other agents"
    - "weigh what speaks for and against Bionic as an agent tool in a course"
url: https://lmstudio.ai/docs/bionic
license: proprietary; free plan for local models, paid plans for cloud models
level: 2
duration: 15
topics: [ai-agents]
relations:
  see_also: [lm-studio, ai-agents]
modules: [aai]
areas: [ai]
status: published
updated: 2026-11-05
---

LM Studio Bionic is an AI agent made by the company behind
[[lm-studio]]. Where LM Studio lets you chat with a language model and turn
its dials, Bionic gives a model tools and lets it work on a task until it is
done: it reads and writes documents, builds slides and spreadsheets, searches
a codebase, edits files and runs commands. What an agent is and how it works
in a loop of thinking and acting is explained in [[ai-agents]].

Bionic is a separate program, not a mode of LM Studio. It runs its local
models on the same runtime as LM Studio, and the maker recommends keeping LM
Studio for detailed settings such as temperature or context length, which
Bionic does not show.

This page describes Bionic as of November 2026, after its documentation on
lmstudio.ai; it has not yet been tried in a course here.

## Where the model runs

In every session you choose in the model picker where the model runs, and
this choice decides what the session costs and where your data goes:

- **Local:** a model you have downloaded runs on your own computer. It needs
  no account and no credits, and nothing leaves the laptop, but the model
  must fit into its memory, and small models are much weaker agents than
  large ones.
- **Remote:** a local model on another of your devices, connected through LM
  Link, does the computing, while the conversation stays where you work.
- **Cloud:** large open models such as Kimi, GLM or DeepSeek run on the
  maker's servers in the USA. This needs an account and credits, and the
  maker promises *Zero Data Retention*, which means that prompts and answers
  are not stored.

Local models are downloaded under *Settings → Local Models → Explore*; the
default model for new sessions is set under *Settings → General* as *Root
model*.

## Projects and sessions

Bionic organises work in **projects**, and each project holds several
**sessions**. A project shares its files and, for code, its folder; a session
is one conversation with one task. Sessions keep running in the background
when you switch to another one, and two of them can stand side by side.

There are two kinds of work:

- **Documents:** you drag in files or describe what the agent should research,
  and it creates reports, decks, spreadsheets or summaries in a sandbox of the
  project. Changes are saved as checkpoints that you can review and roll
  back, and web search can be switched on under *Settings → General*.
- **Code:** when you create the project, you switch on *Allow coding* and
  choose the root folder of a codebase. Then the agent can search the
  repository, edit files, use Git and run shell commands there, and it shows
  each change as a diff.

The maker recommends the same rhythm for code as for any agent: let it
inspect and explain first, agree on the change, let it edit, ask it to run
focused tests, and then read the diff yourself. Before a shell command runs,
Bionic asks for approval; in the mode *Auto Review*, a fixed list of safe
commands passes at once and a second agent judges the rest.

## Skills

A **skill** is a folder with a file `SKILL.md` that holds instructions for a
recurring task, such as reviewing a text against a checklist or building a
report in a fixed format. Bionic uses the same format as other agents and can
use skills you already have for Codex or Claude Code
(*Settings → Skills → Use skills found in other apps*). In a chat, **@** opens
the list of skills and files, and after a task that went well, you can ask
Bionic to turn it into a skill.

## Plans and costs

The free plan contains the agent, local models, local voice input and LM Link
for up to five devices. The plans *Bionic+* (20 US dollars a month) and *Pro*
(100 US dollars a month) add the cloud models with an allowance of usage, and
usage beyond it is paid with credits that depend on the model and the number
of tokens. The page *Billing and Usage* in the settings shows what was used in
the last 30 days.

## Bionic in a course

Bionic could take the place of an agent such as OpenCode in a course. Both let
students give an agent a task and watch it work on files and commands, but
they differ in ways that matter for teaching:

| | LM Studio Bionic | OpenCode |
|---|---|---|
| Interface | desktop program with windows, tabs and previews | mainly the terminal |
| Kind of work | documents, slides, tables and code | code |
| Models | local, remote or the maker's cloud | many providers, local models through a server such as LM Studio's |
| Source | proprietary | open source |

Before using it with students, a few questions need an answer:

- **Hardware:** a free, local setup only works if the students' laptops can
  run a model that is good enough for agentic work; models that fit into
  8 GB are often too weak for it.
- **Costs:** cloud models need an account and a paid plan or credits for each
  student, unless the course pays for an organisation.
- **Data:** the cloud runs in the USA. Zero Data Retention is a promise of the
  maker, so personal data and unpublished material should stay on local
  models.
- **Control:** an agent that runs commands can change or delete files, so
  students should work in a folder of their own and with Git, and read the
  diffs before they keep them.
