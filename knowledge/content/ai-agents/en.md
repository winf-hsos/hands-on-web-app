---
type: lesson
code: 7829
title: AI agents
summary: >-
  A language model that uses tools in a loop to reach a goal: what sets an
  agent apart from a chatbot, what it is made of, when a fixed workflow is
  better, and what can go wrong when it acts with your permissions.
objectives:
  intro: "This lesson shows you what turns a language model into an agent, and afterwards you can:"
  goals:
    - "explain the difference between a chatbot and an agent, using the working definition of an agent that runs tools in a loop to achieve a goal"
    - "name the parts of an agent, the model, the tools, the loop, the context, the plan and the sub-agents, and say what each one does"
    - "decide whether a task needs an agent or whether a fixed workflow is the better choice"
    - "explain what can go wrong when an agent acts with your permissions, and how asking for its plan keeps you in control"
level: 1
duration: 15
topics: [ai-agents]
relations:
  requires: [a-brief-history-of-ai]
  see_also: [be-the-agent, open-models]
modules: [aai]
areas: [ai]
status: draft
updated: 2026-11-04
---

![Slides: AI agents](item:ai-agents-slides)

A chatbot answers, and you take the next step yourself: you copy the code, run it, paste back the error. An agent takes those steps on its own. Under the hood it is the same language model; the difference is what is built around it. A working definition: *an LLM agent runs tools in a loop to achieve a goal.*

Everything else, the plan, the instructions it loads, the sub-agents, the context it keeps in mind, is built around that loop. This page answers:

- What is the difference between a chatbot and an agent?
- What are the parts of an agent, and what does each one do?
- When is an agent the right choice, and when is a fixed workflow better?
- Why are agents suddenly everywhere?
- What can go wrong when an agent acts with your permissions?

You play an agent yourself in the experiment [[be-the-agent]], with cards and without a computer.

## The model, the tools, the loop

The **language model** can only produce text. It cannot open a file or load a web page. What it can do is write down which **tool** it wants to call, and with which arguments: read a file, write a file, run a command, search the web. A program on your computer, the **harness**, executes the call and hands the result back to the model. Then the model decides what to do next. This **loop**, think, act, observe, repeats until the goal is reached. In research the pattern is known as ReAct (Yao et al., 2022).

## Context, plans and sub-agents

Everything the agent "knows" during a task sits in its **context window**: the goal, every tool result, every intermediate thought. When it fills up, the agent has to summarise or forget. To stay on track, agents write themselves a **plan**, a to-do list they tick off, and read **instructions** stored in text files when they need them. For big tasks they can start **sub-agents**: copies of themselves, each with a fresh context window, working in parallel.

## Workflow or agent?

Not everything with AI inside is an agent. A **workflow** follows predefined steps; an **agent** decides the next step itself. The advice from Anthropic: keep it as simple as possible, and use agents only where the task needs that freedom.

## Handle with care

An agent acts with your permissions. It can read every file you can read, run every command you can run, and publish to the internet. Whoever gives an agent access hands over their own keys. Asking it to show its plan before it acts is where you stay in control.

![Quiz: AI agents](item:ai-agents-quiz)

## Further reading

- Simon Willison: [I think "agent" may finally have a widely enough agreed upon definition to be useful jargon now](https://simonwillison.net/2025/Sep/18/agents/), 18 September 2025.
- Anthropic: [Building effective agents](https://www.anthropic.com/research/building-effective-agents), December 2024.
- Shunyu Yao et al.: [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629), 2022.
- METR: [Measuring AI Ability to Complete Long Tasks](https://arxiv.org/abs/2503.14499), 2025.
