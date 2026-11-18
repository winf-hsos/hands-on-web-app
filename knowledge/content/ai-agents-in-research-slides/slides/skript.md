# What is an AI agent?

Script to the deck `what-is-an-ai-agent.html`, in the order of the slides.
Frame numbers count every build-up step, as in the PDF.

The message of this input fits into one sentence: an agent is a language
model that runs tools in a loop until a goal is reached, so it can work in
your folder, and you decide what it may do and check what it did.

## Opening (frames 1–3)

A chatbot is like a consultant on the phone: it tells you what to do, and you
do it. An agent is like someone you hand the keys to your office: it opens
the files itself, reads them, changes them and runs programs. That is why it
can do so much more, and why it matters what you let it do.

## Part 1: chatbot or agent (frames 4–7)

**Chatbot and agent (frames 5–6).** With a chatbot you write a prompt, the
model writes an answer, and the next step is yours: you copy the R code into
your script, run it and paste the error message back. With an agent you give
a goal, and the model calls tools itself, looks at the results and carries on
until the goal is reached. The drawing puts the tools below the model, with
the loop between them, and ends in a result, so both rows are equally wide
and the agent's result stands where the chatbot's answer stands. Under the hood it can be the same language model;
the difference is what is built around it.

**A working definition (frame 7).** Following Simon Willison (2025): an AI
agent runs tools in a loop to achieve a goal. Tools let it read and write
files, run programs and search the web; the loop means it looks at what a
tool returned and decides on the next step itself; the goal is what you want,
not how to get there. Anthropic (2024) describes agents in almost the same
words, as language models that use tools based on feedback from their
environment in a loop.

## Part 2: inside an agent (frames 8–17)

One drawing is built up in eight stages, with the goal of getting feedback on
the introduction of a paper. The new part of each stage is bright, the known
parts are gray.

**The goal and the model (frames 9–11).** At the start there is a goal and a
language model, which on its own can only produce text. Then come the tools
(read, edit, write, bash for programs such as R or Quarto, and web search),
with the folder of the paper below them: the model only writes down which
tool it wants to call, and the program around it carries out the call. Then
the loop: every result goes back to the model, which thinks, acts and
observes again.

**Memory, plan and instructions (frames 12–16).** Everything the agent knows
during a run sits in its context window, which fills up with every file it
reads. The plan is a list the agent writes and ticks off. Instructions in
text files are loaded at the start: `AGENTS.md` says what the agent should
know about your project, skills say how you want certain things done and
are loaded only when a task needs them, and commands are prepared
instructions for what you often need, such as feedback on a paper. Then
everything is together, and only the loop stays highlighted, because it is
what makes the model an agent; the last stage shows the whole picture in
full color.

**The harness (frame 17).** Everything around the model is called the
harness. It runs the loop, carries out the tool calls, manages the context
window, loads `AGENTS.md`, skills and commands, and asks you for permission.
OpenCode, Claude Code and Codex are harnesses, and many of them let you
choose the model, so an AI agent is a language model plus a harness.

## Part 3: an agent at work (frames 18–25)

**One run, as the log shows it (frames 19–24).** You give a goal in one
sentence. Every tool call in the log is marked with a tools icon. The agent
reads the central file of the paper, finds that the sections live in files
of their own and reads the introduction. It answers that the research
question stands in the second paragraph instead of at the end. Nothing in
your files has changed so far. Only when you ask it to move the question does
it want to edit the file, and the harness stops and asks: allow once, allow
always, or reject, with the change shown line by line.

**What it may do without asking (frame 25).** In the settings of the harness,
here `opencode.json`, two lines let the agent read freely but make it ask
before it edits a file or runs a command. You can loosen this, but the safest
start is to let it ask and to read what it wants to do before you say yes.

## Part 4: how far agents get (frames 26–28)

**How long the tasks are that agents finish (frame 27).** METR measures the
time horizon of agents: the length of a task, measured as the time a human
expert needs, at which an agent succeeds half the time, and the shorter
length at which it succeeds four times out of five. GPT-4 managed tasks of
about 4 minutes in 2023, Claude 3.7 Sonnet about an hour in early 2025,
Claude Opus 4.6 about 12 hours and Claude Mythos Preview about 17 hours in
spring 2026; at four out of five the best model reaches about 3 hours. Since
2023 the time horizon has doubled about every four months. The tasks come
from software, machine learning and IT security, are well specified and
scored automatically, and METR itself calls values above 16 hours unreliable
with its current tasks. Agents now finish tasks that take an expert many
hours, but only half the time, so you check what they deliver.

**What can go wrong, and what helps (frame 28).** Eight risks, each with what
helps against it:

| risk | what helps |
|---|---|
| deletes or overwrites files | work in Git or on a copy |
| runs a harmful command | approve every command it runs |
| obeys orders hidden in a text it reads (indirect prompt injection, Greshake et al., 2023) | read what it wants to do first |
| code that runs but computes the wrong thing | check one number by hand |
| cites sources that do not exist | open every reference you cite |
| personal data leaves your computer, because what it reads goes to the provider | keep personal data out of the folder |
| settles for basic analyses (Gu et al., 2024) | decide on variables and method yourself |
| you no longer know your own paper | read every change you accept |

**Closing (frame 29).** An agent runs tools in a loop until a goal is
reached, so it can work in your folder, and you decide what it may do and
check what it did.

## Sources

- Anthropic (2024). Building effective agents.
  https://www.anthropic.com/engineering/building-effective-agents
- Gu, K. et al. (2024). BLADE: Benchmarking language model agents for
  data-driven science. Findings of EMNLP 2024. https://arxiv.org/abs/2408.09667
- Greshake, K. et al. (2023). Not what you've signed up for: Compromising
  real-world LLM-integrated applications with indirect prompt injection.
  arXiv 2302.12173. https://arxiv.org/abs/2302.12173
- METR (2026). Task-completion time horizons of frontier AI models, Time
  Horizon 1.1, last updated 8 September 2026.
  https://metr.org/time-horizons/ · data:
  https://metr.org/assets/benchmark_results_1_1.yaml
- Willison, S. (2025). I think "agent" may finally have a widely enough
  agreed upon definition to be useful jargon now.
  https://simonwillison.net/2025/Sep/18/agents/
