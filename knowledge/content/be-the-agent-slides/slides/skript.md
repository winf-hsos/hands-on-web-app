# Be the Agent

Script for the experiment *Be the Agent*, in the order of the slides. The deck
leads through the game and the first look back at it; the instructions, the
cards and the Observer's sheet are on the course website under
*Experiments*.

## Opening

In the experiment "A Brief History of AI" we watched an AI agent at work. Now the
group plays one, without a
computer, so that we can see who does what: the language model, the tools and
the program that connects them. Now, you are the agent, and the computer is
your group.

## The game

**Seven roles.** In the middle sits the Model with its stack of cards. Four
players are the tools, each at a table of their own: Search knows only the
titles and keywords of the web pages, Web has the pages themselves, Files keeps
the farm's files and Calculator calculates. The Harness carries every card
between the Model and the tools and brings the result back, and the Observer
keeps the log. A group of six lets one person play Search and Web; a group of
five also merges Files and Calculator.

**Four kinds of cards.** The Model writes three kinds of cards: `THINK:` for a
note to itself, `TOOL:` for a tool call and, at the end, `ANSWER:`. The fourth
kind, `RESULT:`, always comes from a tool. On the cards, pink is everything the
Model writes and grey everything a tool returns. The example is the start of Task 1:
the Model does not know which files there are, so it lists them first; after
the three dots come two more cards, `read_file("fields")` and its result,
before the answer.

**The rules.** The Model sees only its stack, and nobody talks to it. The
Harness carries every card to the right tool and brings the result back. A
tool does exactly what the card says, nothing more, and never guesses what was
meant. The Model writes one card at a time, until it writes `ANSWER:`.

**The system card** lists the six tools: `search`, `open`, `list_files`,
`read_file`, `calculator` and `write_file`. It is everything the Model knows
about its tools; whatever is not on this card does not exist for the Model. It
does not say which files there are, so the Model has to look first, just as a
real agent lists a folder before it reads anything.

## Play

**Task 1**, about five minutes: how large is the field Long Acre, and what
grows on it this year? A warm-up with two tool calls: list the files, then
read the right one.

**Task 2**, after swapping roles, about twelve minutes: how much nitrogen may
we still apply to Long Acre this spring, in kg N for the whole field?

**Compare.** Which nitrogen requirement did your model use, and where did it
come from? The search also finds an archived page from 2009 with a higher
value, and a model can only notice that it is outdated if it reads carefully.
Real agents run into the same problem with outdated sources.

**Task 3**, if there is time: plan the first nitrogen application, with the
product and the date. The trap is in the weather file, which no task mentions and which only shows
up in the list of files.

## What you just played

**Every card on this table is one step of the agent.** A photo of a group in
the middle of Task 2: the task and the system card, the Model's cards in pink
and the results from the tools in grey. The stack is everything the Model knew.

**From the game to a real agent.** The stack of cards is the context window,
everything the model knows. The system card is the system prompt. A `THINK:`
card is the model's reasoning or plan, a `TOOL:` card a tool call written as
text, and the Harness is the harness, the program that runs the tools. A
`RESULT:` card is the observation that is added to the context, and `ANSWER:`
is the stop: the goal is reached.

**The same, in a real agent.** A shortened excerpt from the agent's log in
the experiment “A Brief History of AI”: it lists the folder, reads a previous group's
file, notices that the pinboard photo and `milestones.md` are missing and asks
for them, and later starts eight sub-agents. Every line is one of the four
kinds of cards.

**Key takeaway.** An AI agent is a large language model (LLM) that can only write text;
everything it does in the world happens through tools that the harness runs
for it.

**Reflect.** In which round would the Model have been stuck without the tools?
What would have changed if the Model had had to give up its stack after ten
cards? Who did the thinking, who did the acting, and which of it could the
Model actually do? Everyone writes first, then the group discusses.
