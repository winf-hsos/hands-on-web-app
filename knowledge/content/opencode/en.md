---
type: tool
code: 9180
title: OpenCode
summary: >-
  A free AI agent that works in a folder on your laptop: it reads and writes
  the files there, calls tools and asks before it acts. We use its desktop
  app, which connects to a language model in the cloud or on your own laptop.
objectives:
  intro: "This page introduces OpenCode, the agent we work with in the experiments, and afterwards you can:"
  goals:
    - "install the desktop app of OpenCode and open a folder in it as a project"
    - "connect a provider with an API key and choose the model and the agent of a session"
    - "allow or reject what the agent asks to do, and tell where a folder keeps its agents, skills and commands"
url: https://opencode.ai
license: open source (MIT), free of charge; the language models cost what their provider charges
level: 1
duration: 10
topics: [ai-agents]
relations:
  see_also: [ai-agents, lm-studio, from-chat-to-agent]
modules: [aai]
areas: [ai]
status: published
updated: 2026-11-25
---

OpenCode is an [[ai-agents|AI agent]] that works in a folder on your laptop.
Unlike a chat in the browser, it reads the files in that folder itself, writes
new ones, calls tools and looks at their results before it answers. It is
free and open source, and it does not bring a language model of its own: you
connect it to a provider in the cloud, such as OpenAI, with an API key, or to
a model on your own laptop in [[lm-studio]]. OpenCode exists as a program for
the terminal and as a desktop app; we use the **desktop app**.

## Setting up

1. **Install the desktop app** from
   [opencode.ai/download](https://opencode.ai/download) like any other
   program. On Windows, run the installer and follow the steps. On a Mac,
   choose *Apple Silicon* if your Mac has an M chip, otherwise *Intel*; you
   find the chip under Apple menu → *About This Mac*. Open the file and drag
   OpenCode into the *Applications* folder.
2. **Open a folder.** OpenCode always works in one folder, which it calls a
   project. On the left is the list **Projects**: click the folder icon with
   the plus (*Add project*), choose the folder and then **New session**.
3. **Connect a model.** Click **Settings** below the project list and then
   **Providers** on the left. Click **+ Connect** next to the provider, for
   example OpenAI, choose **API key** and paste the key. If the provider is
   not in the list, click *Show more providers* first. Models in LM Studio
   appear by themselves once its local server is running.

> [!IMPORTANT]
> An API key is like a password, and every answer costs money with it.
> Send it to nobody, put it in no file in the folder and paste it into no
> chat, not even the one with OpenCode. It belongs only in the field under
> *Providers*, where it stays on your laptop.

## Working with it

- **A session** is one conversation with the agent. A new session starts
  without any memory of the one before, which is why experiments often ask
  you to start a new one for every step.
- **The model and the agent** of a session are chosen below the input
  field. A folder can define several agents, each with its own model, role
  and rules; the Tab key switches between them.
- **Permissions:** before the agent does something its rules mark as *ask*,
  such as changing a file or sending an order, OpenCode stops and shows you
  what it is about to do. You allow it or reject it, and a rejected action is
  not carried out.

## What a folder can bring along

A folder can set up OpenCode for its purpose, so that everyone who opens it
gets the same agent. OpenCode reads these files when a session starts:

| file or folder | what it holds |
|---|---|
| `opencode.jsonc` | the agents with their model, role and permissions, and the tools they may use |
| `.agents/skills/<name>/SKILL.md` | skills: instructions the agent loads when a task needs them |
| `.opencode/commands/<name>.md` | commands: a prompt with a short name that you start with `/name` |
| `AGENTS.md` | general instructions for every session in this folder |

If a change to `opencode.jsonc` does not show up in a new session, close and
reopen OpenCode. The experiment [[from-chat-to-agent]] takes the first steps
with OpenCode, and [[tools-skills-commands]] builds such a folder step by step.
