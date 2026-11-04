# AI Agents

Script for the deck *AI Agents*, which follows the experiment "A Brief History
of AI". In the order of the slides.

## Quick quiz

Four questions about what we just watched, answered anonymously on the phone.
They are not about the history of AI but about the agent that compiled it.

- **What did we give the agent to start the research?** A goal, a photo and
  a text file. No step-by-step recipe: the agent found the way itself.
- **Where did the agent do its work?** The files appeared in a folder on the
  laptop, but the language model ran in the cloud. It is far too large for a
  laptop.
- **Eight sub-agents researched at once. Who decided that?** The agent
  itself. Nothing in our prompt asked for it.
- **The agent asked us which file held the milestones. What does that
  show?** It noticed a mismatch: it compared the task with what it found in
  the folder and asked instead of guessing.

## What is an agent?

Who did the work while we watched? We typed a few sentences and said "yes" a few times. The
agent found the sources, downloaded them, read them and built the app.

A chatbot answers: you write a prompt, the model writes an answer, and the
next step is yours. An agent acts: you give it a goal, and the model calls
tools, looks at the results and carries on until the goal is reached. Under
the hood it is the same language model. The difference is what is built
around it.

A working definition: *an AI agent runs tools in a loop to achieve a goal*
(after Simon Willison, September 2025). Anthropic describes agents as "LLMs using
tools based on environmental feedback in a loop".

**Workflow or agent?** Not everything with AI inside is an agent. A workflow
follows steps that people defined in advance; an agent decides the next step
itself. A workflow fits when the steps are the same every time, even if an LLM does one
of them: for each supplier invoice, an LLM reads it, the system matches it with
the purchase order and books it or flags it. An agent fits when nobody knows
the steps in advance: "our main supplier raised prices by 12 %. Find
alternatives, compare their offers and draft a recommendation." Anthropic's advice: keep it as simple as possible and use
agents only where they are needed.

## Inside an agent

One drawing, built up step by step, with our example goal "build a knowledge
base on the history of AI":

1. **The goal and the model.** On its own, the model can only produce text.
   It cannot open a file or load a website.
2. **Tools:** read, write, edit, bash, web search, web fetch. The model only
   writes down which tool it wants to call with which arguments; the program
   on the computer carries it out. We saw it list the folder, download papers
   and write files.
3. **The loop:** think, act, observe, and again. In research this pattern is
   called ReAct (Yao et al., 2022). It is the core of every agent.
4. **The context window:** everything the agent "knows" is in this window,
   the task, every tool result, every intermediate thought. We saw "context
   14 %" in the corner of the app. When the window is full, the agent has to
   summarise or forget.
5. **Plan and instructions:** the plan is a tool like any other, a list the
   agent writes and ticks off. Skills and `agents.md` are instructions in text
   files that the agent loads when it needs them.
6. **Sub-agents:** the agent can start copies of itself, each with a fresh
   context window, and collect their results. That is what happened last
   week, and nobody asked for it.

The model decides, the tools carry it out, and the loop keeps running until the goal is reached.

**The harness.** Everything around the model is called the harness, like the
harness that hitches a horse to a cart: the model provides the power, the
harness steers it. It runs the loop, carries out the tool calls, manages the
context window, loads plans, skills and `agents.md`, and asks you for
permission. Claude Code, Codex and OpenCode are harnesses. An AI agent is an
LLM plus a harness, and the same model in a different harness is a different
agent.

## Agents and their models

**Models and apps.** Every app runs on a model. Each large company offers a
top model and a cheaper mid-range one (OpenAI: GPT-6.1 Sol and GPT-6 Luna;
Anthropic: Claude Fable 5.1 and Sonnet 5.5; Google: Gemini 3.1 Pro and Gemini
3.6 Flash); open models include DeepSeek V4.1, Qwen 3.8, Llama 4, Mistral
Large 3 and Gemma 4 (as of September 2026). They power
chat apps (chatgpt.com, claude.ai, gemini.google.com) as well as agents
(Claude Code, Codex, Antigravity, OpenCode, OpenClaw). The lines
blur: chat apps can search, run code and create files as well.

**Where does it run?** The harness and your files are on your computer; the
model runs on a cloud server, and only text goes back and forth. A language model on our own laptops is the topic
of "Open Models".

## Power and responsibility

**Why now?** METR measures how long a task may be (in the time a human needs
for it) for a model to finish it on its own in half of the cases: about 50
minutes for Claude 3.7 Sonnet in February 2025, about 3.5 hours for GPT-5 in
August 2025, 16 hours or more for Claude Mythos in April 2026: at least 19
times longer in 14 months. Between 2019
and 2024 this length doubled about every seven months, since 2023 rather
every four. These are software tasks; whether this carries over to other work
is open (see also: agents and work).

An agent acts with your permissions: it can read every file you can read, run
every command you can run, and publish to the internet. In "A Brief History
of AI" it would have published our app without asking, because we had told it to. What do we
allow, and who is responsible?

We open the loop, layer by layer, down to the model and back.

## Sources

- Simon Willison, [I think "agent" may finally have a widely enough agreed upon definition](https://simonwillison.net/2025/Sep/18/agents/), 18 September 2025
- Anthropic, [Building effective agents](https://www.anthropic.com/research/building-effective-agents), December 2024
- Yao et al., [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629), 2022
- Kwa et al. (METR), [Measuring AI Ability to Complete Long Tasks](https://arxiv.org/abs/2503.14499), 2025; [METR time horizons](https://metr.org/time-horizons/)
