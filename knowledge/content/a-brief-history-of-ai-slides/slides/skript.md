# A Brief History of AI

Script for the deck *A Brief History of AI*, a live experiment with an AI
agent, in the order of the slides. It fits the start of any course on AI. The
agent is not mentioned until the part "let's compile the knowledge", because
it is meant as a surprise.

## Title

A brief history of AI, a live experiment with an AI agent. Before it starts,
an empty folder holds `milestones.md`, the collection of an earlier group or
the sample file from the lesson, Claude Code runs in that folder, and Remote
Control is switched on and opened once on the phone.

## Opening

When did AI begin? A few guesses from the room, such as 1950, 1956 or 2022
with ChatGPT, without resolving the question, because the answer depends on
what counts as AI, and that is what the experiment sorts out.

## What do you know?

Every pair writes milestones of AI they already know on cards: one card, one
milestone, the year if known, in large block letters. Everything counts,
from ChatGPT and chess computers to films and the robot lawnmower at home,
and there are no wrong cards. The cards go on the pinboard, roughly in order
of time.

## What your peers knew

An earlier group collected the same knowledge in a shared report, "A Brief
History of Artificial Intelligence". A short look at it: which milestones
appear there that are missing on the board, and which are missing there?
That the report contains errors is not revealed yet. Without an earlier
group, the sample file from the lesson takes its place, with six errors
built in.

## Let's compile the knowledge

Now let's do it properly: every milestone checked, every source read, every
fact written down. That is more than we can manage alone in the time we
have, so let's ask for help. Do you know who this is? A photo of the board
is sent from the phone straight to Claude Code, an AI agent. The audience
should expect thorough literature work; that an app comes out of it is the
surprise after step 1: libraries are boring, so let's build something
interactive.

The agent works in steps, each with its own prompt (copy button on the
slide), and each time it first shows its plan and waits for a go.

**Step 1 · research.** The inputs are the photo and `milestones.md`, the
earlier group's collection. The agent finds reliable sources for every
milestone and researches further ones itself, downloads every source, reads
it and extracts the key facts: what, who, where, when, and so what? It
stores them as a knowledge base in Markdown, one file per milestone with its
source and its origin (the earlier group, our group, agent). Errors in the
earlier group's list go to an Excel list, unverifiable cards to a list
"still to check". This step takes well over 20 minutes, so it starts early.

**Step 2 · build.** On this knowledge base alone, with no new facts, the
agent builds a visually compelling, interactive timeline. Every entry shows
the five key facts, links its source and shows where it came from.

**While the agent builds.** Once the plan for step 2 is approved, the link
on the slide opens Hannah Fry's video "Why AI agents are either the best or
worst thing we've ever built" (https://www.youtube.com/watch?v=WnzR5aOElvw),
and afterwards we go back to the agent.

Two things are deliberately not in the prompts: that the sources can be
worked through in parallel by sub-agents, which the agent should come up
with itself, and that the app will be published. We watch the agent at work
on the projector, and wishes from the room go straight in.

Trust, but check: Which errors did the agent find in the earlier group's
list? Which of our cards made it, which are "still to check"? What did the
agent add on its own? Does a source say what the app says?

Time for assessment, a short moment of shock, although it is not the
audience that is tested. Whoever has explored the timeline should be able
to test themselves.

**Step 3 · quiz.** A third prompt adds a quiz: 50 questions based only on
the knowledge base, four options each with exactly one correct, feedback
with a link to the matching entry, random order and a score. The agent
first shows three example questions, and the room judges them before it
builds the rest.

**Bonus · guided mode.** If time allows, the agent writes an engaging story
from the milestones, based only on the knowledge base, chooses a fitting
narrator voice from the OpenAI text-to-speech API and creates the audio in
advance. In guided mode the narrator tells the history of AI, and the app
opens the matching milestone on the timeline by itself. Visitors can pause,
skip and leave; the app says that the voice is AI-generated, and the API key,
read from the environment variable `OPENAI_API_KEY`, never ends up in the app
or in any file.

**Publish.** The surprise: a last prompt lets the agent create a public
repository, publish the app, its audio and the knowledge base with GitHub
Pages, without the downloaded sources, the Excel list and the photo, and make
a QR code for the URL. The URL is pasted into the slide: when we started,
this page did not exist.

## What's behind it

**From a photo to a website.** Four steps in one drawing: from the photo and
the list to a knowledge base with a file and a source per milestone, from
there to the timeline, the quiz and the public website. The agent did the
work, while people set the goal, approved each plan and checked the result.

**What the agent did, and what's behind it.** Everything the agent did is a
topic of its own in AI: it read a photo of handwriting (how computers see
images), wrote a plan (reasoning), generated text and code (how LLMs and
neural networks work), knew how to build a web app (how an LLM is trained),
used tools (rules vs. learning, tool use), got something wrong
(hallucination), checked facts against sources (trust and verification),
split the work among sub-agents (multi-agent systems) and published to the
web on its own (autonomy, safety, responsibility).

**How do these systems work?** What's the difference between ChatGPT and
Claude Code? How does a language model represent text, and meaning? Why
does it give a different answer every time? How much can it keep in mind at
once? Can I run an AI on my own laptop? Why do the models keep getting
better?

**What does it mean for us?** Where is AI already at work in our domains?
The machine predicts, who decides? How should we use AI in our studies and
in research? How much energy does an answer cost? Which jobs will change?
What does AI mean for the economy? Whose data is it? How do we regulate AI,
and where is all this going?

**Your turn:** everyone writes the one question they most want answered on
a card and pins it next to the timeline.

The next milestone is still blank.
