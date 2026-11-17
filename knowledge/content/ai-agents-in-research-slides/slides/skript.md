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
until the goal is reached. Under the hood it can be the same language model;
the difference is what is built around it.

**A working definition (frame 7).** Following Simon Willison (2025): an AI
agent runs tools in a loop to achieve a goal. Tools let it read and write
files, run programs and search the web; the loop means it looks at what a
tool returned and decides on the next step itself; the goal is what you want,
not how to get there. Anthropic (2024) describes agents in almost the same
words, as language models that use tools based on feedback from their
environment in a loop.

## Part 2: inside an agent (frames 8–16)

One drawing is built up in seven stages, with the goal of getting feedback on
the introduction of a paper. The new part of each stage is bright, the known
parts are grey.

**The goal and the model (frames 9–11).** At the start there is a goal and a
language model, which on its own can only produce text. Then come the tools
(read, edit, write, bash for programs such as R or Quarto, and web search):
the model only writes down which tool it wants to call, and the program
around it carries out the call. Then the loop: every result goes back to the
model, which thinks, acts and observes again.

**Memory, plan and instructions (frames 12–15).** Everything the agent knows
during a run sits in its context window, which fills up with every file it
reads. The plan is a list the agent writes and ticks off. Instructions in
text files are loaded at the start: `AGENTS.md` says what the agent should
know about the project, and commands are prepared instructions for recurring
tasks, such as how to give feedback on a paper. In the last stage everything
is together, and only the loop stays highlighted, because it is what makes
the model an agent.

**The harness (frame 16).** Everything around the model is called the
harness. It runs the loop, carries out the tool calls, manages the context
window, loads plans, `AGENTS.md` and commands, and asks you for permission.
OpenCode, Claude Code and Codex are harnesses, and many of them let you
choose the model, so an AI agent is a language model plus a harness.

## Part 3: an agent at work (frames 17–24)

**One run, as the log shows it (frames 18–23).** You give a goal in one
sentence. The agent reads the central file of the paper, finds that the
sections live in files of their own and reads the introduction. It answers
that the research question stands in the second paragraph instead of at the
end. Nothing in your files has changed so far. Only when you ask it to move
the question does it want to edit the file, and the harness stops and asks:
allow once, allow always, or reject, with the change shown line by line.

**What it may do without asking (frame 24).** In the settings of the harness,
here `opencode.json`, two lines let the agent read freely but make it ask
before it edits a file or runs a command. You can loosen this, but the safest
start is to let it ask and to read what it wants to do before you say yes.

## Part 4: what studies found (frames 25–31)

**Feeling faster, measured slower (frame 26).** In a randomised trial by METR
(Becker et al., 2025), 16 experienced developers worked on 246 real tasks in
their own projects, each task randomly with or without early-2025 AI tools.
Beforehand they expected to be 24 percent faster with AI, afterwards they
believed they had been 20 percent faster, and measured they took 19 percent
longer. The tools have improved since, and in February 2026 METR wrote that
its newer data hint at a speed-up but that this design can no longer measure
it reliably. What remains is the gap between feeling and measuring, so an
agent is judged by what it delivers.

**Agents stop at simple analyses (frame 27).** The BLADE benchmark (Gu et
al., 2024) gives models and agents 12 data sets with questions from published
studies and compares their analysis decisions with those of expert analysts.
The models mostly chose basic analyses, and agents that could work with the
data did better but still made fewer and less varied decisions than the
experts. Which variables, which groups and which method therefore stay your
decisions.

**Instructions hidden in what it reads (frame 28).** A language model cannot
reliably tell your instructions apart from text it reads along the way.
Greshake et al. (2023) showed that a web page or document can contain hidden
instructions that make an assistant do something else; this is called
indirect prompt injection, and there is no complete protection against it.
That is one more reason to let an agent ask before it acts.

**Quiz (frames 29–31).** The agent reports that it fixed the analysis and
everything runs. The right answer is to read the change and run it yourself,
because running code says nothing about whether it computes the right thing,
and asking the agent whether it is sure only yields another confident answer.

## Part 5: working with an agent (frames 32–38)

**Five rules (frames 33–37).** Give the agent a goal and the context it
needs. Let it ask before it changes a file or runs a program. Read every
change before you accept it. Run the code yourself and check one number by
hand. Keep personal data out, and answer for the result yourself.

**Closing (frame 38).** An agent runs tools in a loop until a goal is
reached, so it can work in your folder, and you decide what it may do and
check what it did.

## Sources

- Anthropic (2024). Building effective agents.
  https://www.anthropic.com/engineering/building-effective-agents
- Becker, J. et al. (2025). Measuring the impact of early-2025 AI on
  experienced open-source developer productivity. arXiv 2507.09089.
  https://arxiv.org/abs/2507.09089
- METR (2026). Update on the developer productivity study, 24 February 2026.
  https://metr.org/blog/2026-02-24-uplift-update/
- Gu, K. et al. (2024). BLADE: Benchmarking language model agents for
  data-driven science. Findings of EMNLP 2024. https://arxiv.org/abs/2408.09667
- Greshake, K. et al. (2023). Not what you've signed up for: Compromising
  real-world LLM-integrated applications with indirect prompt injection.
  arXiv 2302.12173. https://arxiv.org/abs/2302.12173
- Willison, S. (2025). I think "agent" may finally have a widely enough
  agreed upon definition to be useful jargon now.
  https://simonwillison.net/2025/Sep/18/agents/
