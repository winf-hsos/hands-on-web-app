---
type: lesson
code: 3692
title: A brief history of AI
summary: >-
  Seventy-five years of artificial intelligence, built live with an agent: a
  group collects the milestones it knows, and an AI agent researches, checks
  and turns them into a timeline with a quiz.
objectives:
  intro: "In this lesson an AI agent writes down the history of AI, and afterwards you can:"
  goals:
    - "explain why the beginning of AI can be dated to 1950, 1956 or 2022, depending on what counts"
    - "describe the steps an agent takes from a photo of a pinboard to a published timeline with a quiz"
    - "check a fact that an AI has researched against its source instead of asking the AI whether it is sure"
level: 1
duration: 90
topics: [ai-agents, language-models]
relations:
  see_also: [ai-agents]
modules: [aai]
areas: [ai]
status: published
updated: 2026-11-04
---

![Slides: A brief history of AI](item:a-brief-history-of-ai-slides)

When did artificial intelligence begin: in 1950 with Alan Turing, in 1956 at a workshop in Dartmouth, or in 2022 with ChatGPT? Instead of answering from a slide, a group collects what it already knows on a pinboard and hands it to an AI agent. The agent researches every milestone, reads the sources, checks an earlier group's list for errors, and turns the result into an interactive timeline with a quiz, which it finally publishes on the web.

![Two boxes at the top, a photo of the pinboard and the file milestones.md, lead into the first of four boxes in a row: knowledge base, timeline app, quiz and public website. Below each box the step that makes it and what comes out: a file per milestone with its source, every entry links to its source, 50 questions from the knowledge base, on GitHub Pages without the sources.](media/experiment.en.svg "The experiment in four steps. People set the goal, approve each plan and check the result, and the agent does the work in between.")

The app that the agent built and published with one group is online: [A Brief History of AI](https://winf-hsos.github.io/a-brief-history-of-ai/). This page describes how to run the experiment yourself, in a room with a group or on your own.

## What you need

- An AI agent that works in a folder on your computer, such as [Claude Code](https://www.anthropic.com/claude-code). The prompts below were written for it, but any agent that can read files, search the web and run programs will do.
- An empty folder with a file `milestones.md` in it: the milestones an earlier group collected. If there is no earlier group, take the [sample file](media/milestones.md), into which six errors have been built on purpose.
- A pinboard, cards and thick pens, if you work with a group, and a way to get a photo of the board to the agent. Claude Code's Remote Control takes it straight from a phone.
- A GitHub account, if the app is to be published at the end.
- For the bonus step only: a key for the OpenAI API in the environment variable `OPENAI_API_KEY`, set before the agent starts.

Plan at least 90 minutes. Step 1 alone takes well over 20, because the agent downloads and reads every source, so start it early and collect the cards or look at the earlier group's list while it works.

## What do you know?

Before the agent gets involved, everyone writes down what they already know about the history of AI: one card for one milestone, with the year if you know it, in large block letters. Everything counts, from ChatGPT and chess computers to films and the robot lawnmower at home, and there are no wrong cards. The cards go on the pinboard, roughly in order of time, and someone takes a photo of the board.

Then take a short look at `milestones.md`. Which milestones appear there that are missing on the board, and which are missing there? Whether the file contains errors is something the agent should find out.

## Step 1: research

Start the agent in the folder with `milestones.md`, attach the photo of the pinboard, and give it this task:

```text
We are a group of students learning about artificial intelligence.
Help us build a knowledge base on the history of AI.

Inputs:
- a photo of our pinboard: milestones our group knows
- milestones.md: AI milestones that an earlier group collected

Tasks:
- find reliable sources for every milestone, and research further
  important milestones yourself
- download every source and save it
- read each source and extract the key facts:
  what? who? where? when? — and so what?
- store them in a structured knowledge base as Markdown, one file per
  milestone, with its source and its origin: the earlier group, our group,
  or agent
- write all errors you find in milestones.md to an Excel list
- pinboard cards you cannot verify go to a list "still to check"

First read everything and show me your plan. Wait for my go.
```

The agent first reads the file, looks at the photo and answers with a plan. Read the plan before you say "go": it tells you which files and folders the agent is going to create and how it wants to proceed. Nothing in the prompt says how the work is to be split up, so watch whether the agent hands the sources to several sub-agents that work in parallel. When it has finished, open one of the files in the knowledge base and see what a milestone looks like.

## Step 2: build

A knowledge base is thorough, but nobody wants to browse it, so the agent now turns it into something to explore:

```text
Now build a visually compelling, interactive web app "A Brief History
of AI" for our group. It guides visitors through the history of AI
on a timeline.

- use only the knowledge base — no new facts
- every entry shows what, who, where, when and so what,
  and links to its source
- show where each entry came from: the earlier group, our group, agent
- a static site (HTML, CSS, JavaScript, no build step), in English
- must work on phones and on the projector; do not include the photo

Show me your plan first. Wait for my go.
```

While the agent builds, it creates files, opens the app in a browser, looks at what it has made and improves it. Wishes from the room can go straight in. If there is time to wait, Hannah Fry's talk [Why AI agents are either the best or worst thing we've ever built](https://www.youtube.com/watch?v=WnzR5aOElvw) fits the moment.

## Check the result

Let the agent start the app and click through it before anything else is added. Four questions guide the check:

1. Which errors did the agent find in the earlier group's list? Open the Excel list.
2. Which of the cards from the pinboard made it, and which are "still to check"?
3. What did the agent add on its own?
4. Click a source: does it say what the app says?

The last question matters most. Asking the agent whether it is sure gives you an answer that sounds certain either way, while the source either says it or it does not.

> [!SOLUTION]
> The [sample file](media/milestones.md) contains six errors:
>
> 1. The Dartmouth workshop of 1956 took place at Dartmouth College in Hanover, New Hampshire, not at Harvard University.
> 2. The perceptron of 1958 was built by Frank Rosenblatt, not by Marvin Minsky, who criticised it in 1969.
> 3. The Lighthill report of 1973 was written for the British Science Research Council, not for the United States Congress.
> 4. Garry Kasparov lost in 1997 to IBM's Deep Blue, by 3½ to 2½; Watson is the system that won Jeopardy! in 2011.
> 5. AlphaGo beat Lee Sedol 4 to 1, not 5 to 0, and the one game it lost is famous for that reason.
> 6. ChatGPT was released on 30 November 2022, not in March 2022.

## Step 3: quiz

Whoever has clicked through the timeline should be able to test what they learned, so the agent adds a quiz:

```text
Add a quiz to the app, so visitors can test what they learned
about the history of AI.

- 50 interesting questions, based only on the knowledge base
- 4 answer options per question, exactly one of them correct
- the wrong options must be plausible, not silly
- after each answer: right or wrong, the correct answer,
  and a link to the matching entry on the timeline
- questions in random order, a score at the end
- same design as the timeline; must work on phones

Show me three example questions first. Wait for my go.
```

Judge the three example questions before you say "go": are they too easy, or do they ask about something that is not in the knowledge base? The correct answers come from the knowledge base, while the wrong ones are made up by the model, and being plausibly wrong is a skill of its own.

## Bonus: guided mode

If there is time left and an API key at hand, a narrator can tell the story while the timeline follows:

```text
Add a guided mode to the app: a narrator tells the history of AI,
and the app follows along.

- write an engaging story from the milestones, based only on the knowledge base
- choose a fitting narrator voice from the OpenAI text-to-speech API;
  the API key is in the environment variable OPENAI_API_KEY
- create the audio in advance — the app itself never calls the API
- while the narrator speaks, the app opens the matching milestone
  on the timeline by itself, no clicks needed
- the user can pause, skip and leave the guided mode at any time
- say in the app that the voice is AI-generated
- never write the API key into the app or into any file

Show me the outline of the story and the voice you chose first.
Wait for my go.
```

> [!WARNING]
> Set the key as an environment variable before the agent starts, never type it into the conversation, and never let the agent show the variable while a projector is on. Because the agent creates the audio in advance, the finished app needs no key and can be public.

## Publish

The last step puts the app on the web:

```text
Create a public GitHub repository "brief-history-of-ai" and publish
the app with GitHub Pages. Give me the URL.

Publish only the app, its audio and the knowledge base — not the
downloaded sources, not the Excel list, not the photo.

Then make a QR code for the URL and open it in the browser,
so everybody in the room can scan it.
```

The downloaded sources stay out of the repository because they are other people's texts, and the photo stays out because it shows the group's handwriting. After a minute or two the page is online, and everyone in the room can open it on their phone.

## What's behind it

Looking back, every step the agent took is a topic of its own in AI:

| The agent … | What's behind it |
|---|---|
| read a photo of handwriting | how computers see images |
| wrote a plan | reasoning |
| generated text and code | how language models and neural networks work |
| knew how to build a web app | how a language model is trained |
| used tools: files, browser, web | rules vs. learning, tool use |
| got something wrong | hallucination |
| checked facts against sources | trust and verification |
| split the work among sub-agents | multi-agent systems |
| published to the web on its own | autonomy, safety, responsibility |

Which of these questions do you most want answered? Write it on a card and pin it next to the timeline, because the photo of those cards shows where to look next.

![Quiz: A brief history of AI](item:a-brief-history-of-ai-quiz)

## Further reading

- Alan M. Turing: [Computing Machinery and Intelligence](https://doi.org/10.1093/mind/LIX.236.433), *Mind* 59 (1950), 433–460.
- Rich Sutton: [[the-bitter-lesson]], 2019, with Ethan Mollick's music video about it.
