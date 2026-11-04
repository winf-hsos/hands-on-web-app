---
type: quiz
code: 3747
title: "Quiz: AI agents"
summary: >-
  Twelve questions on the lesson AI agents, each answer with its reason. The
  questions come from the pool of the module and are in the format of its
  exam.
level: 1
duration: 24
topics: [ai-agents]
relations:
  checks: [ai-agents]
modules: [aai]
areas: [ai]
status: published
updated: 2026-11-04
---

## You ask a chatbot to fix a script that stops with an error. It suggests a change, you run the script yourself and paste the new error message back. What changes if you give the same task to an agent? {#ag-001}

- [ ] It uses a larger language model that makes fewer mistakes when programming.
  > A chatbot and an agent can run on the same model. The difference is not the model but what is built around it.
- [x] It runs the script itself, reads the error and decides on the next change until the script works.
  > Correct: the agent takes over the steps you take with a chatbot. It calls tools, observes the result and carries on until the goal is reached.
- [ ] It solves the task in one step, because it plans the whole solution before writing anything.
  > An agent does not work in one step but in a loop: it acts, looks at the result and then decides again. A plan helps it but does not replace the loop.
- [ ] It asks for permission before each suggestion but otherwise works like the chatbot.
  > An agent may ask for permission, but that is not what sets it apart from a chatbot. What matters is that it carries out the steps itself instead of leaving them to you.

## An agent reads the file `fields.csv`. What exactly does the language model contribute to this step? {#ag-002}

- [ ] It opens the file on the disk and loads its content into its memory.
  > A language model cannot open a file. It only produces text; everything that happens in the world is carried out by a program around the model.
- [x] It writes text that names the tool and its arguments; a program around it reads the file and returns the content.
  > Correct: the tool call is just text, like the TOOL card in the game. The harness carries it out and puts the result into the context.
- [ ] It sends a request to the operating system, which checks the permissions and delivers the file.
  > The model does not talk to the operating system. The harness makes that request after it has recognised the model's text as a tool call.
- [ ] It recalls the file from training, because tables like this occur there frequently.
  > A file on your computer cannot have been part of the training. Whatever the model knows about it is in the context only if a tool has read it.

## Which of these tasks is better solved with a fixed workflow than with an agent? {#ag-003}

- [x] Every morning an LLM reads the new delivery notes, a program matches them with the orders and flags differences.
  > Correct: the steps are the same every time and can be fixed in advance. That an LLM does one of them does not make it an agent.
- [ ] A dairy's main supplier of packaging has gone bankrupt; find alternatives, compare offers and draft a recommendation.
  > Nobody knows the necessary steps in advance here: which sources, which suppliers, which follow-up questions. This is exactly what an agent is for.
- [ ] Find out why the yield on one field dropped last year, using all data and sources available.
  > A search for causes branches with every finding; which step comes next depends on the result of the previous one. That points to an agent.
- [ ] Build a small web app showing the bookings of the farm machinery, from a short description.
  > When building an app, the next step follows from the last one: read the error, change the code, test again. That is an agent's loop.

## Which of these jobs does the harness do rather than the language model? {#ag-004}

- [x] carry out the tool calls and return the results
  > Correct: the model only writes the call down; the harness carries it out, as in the game, where the Harness carries every card to the tool.
- [ ] decide which tool to call next
  > The model makes this decision. The harness checks and carries out what the model writes, but it does not choose the next step.
- [x] ask the user for permission before a command runs
  > Correct: asking is a rule in the program around the model; the model can neither trigger nor bypass it.
- [x] manage the context window, for example by summarising when it fills up
  > Correct: the harness decides what goes into the context window and what gets shortened when space runs out; the model only sees the result.
- [ ] write the plan for the task
  > The model writes the plan, through a tool like any other. The harness stores it and shows it again, but the content comes from the model.

## After two hours of work an agent suddenly repeats a step it had finished long ago. Which explanation fits best? {#ag-005}

- [ ] The model learned from the previous steps and adjusted its weights, which overwrote the earlier result.
  > A model's weights do not change while it is being used. Whatever it knows during a task sits only in its context window.
- [x] The context window was full; earlier results were summarised or removed, so the step is no longer in it.
  > Correct: what is no longer in the context, the model does not know. This is why agents write plans and notes into files they can read again.
- [ ] A tool reported an error, and the harness repeats failed calls on its own.
  > An error would come back as a result, and the model would react to it. The harness does not repeat a step that was finished long ago on its own.
- [ ] The language model only ever keeps the last tool result, so every earlier step is lost after one round.
  > Then the agent could not have worked for more than a few minutes. The context window holds every step until it is full.

## An agent is asked to research 40 milestones in the history of AI and starts eight sub-agents for it. What is the main advantage? {#ag-006}

- [x] Each sub-agent has a fresh context window, so the many sources do not fill the main agent's context, and they work at the same time.
  > Correct: the main agent only receives the results, not every page that was read. Its context stays free for the actual task.
- [ ] Sub-agents use a smaller model that specialises in searching the web.
  > A sub-agent may use a different model, but it does not have to and usually uses the same one. The advantage lies in the separate context and in working in parallel.
- [ ] Sub-agents may access files the main agent has no permission for.
  > Sub-agents run in the same harness with the same or narrower permissions. They may not do more than the agent that starts them.
- [ ] Several sub-agents vote on every answer, which rules out invented facts.
  > Each sub-agent researches a part of its own; there is no vote. Invented facts remain possible and have to be checked.

## You use Claude Code on your laptop, and it creates files in your project folder. Where does the language model run? {#ag-007}

- [ ] On your laptop, inside the program you installed.
  > The harness runs on the laptop, not the model; a model of this size does not fit on a laptop.
- [x] On a server of the provider; only text travels back and forth, while the harness and the files stay on your laptop.
  > Correct: the harness sends the context to the model in the cloud and carries out its tool calls locally. That is why the files appear on your machine.
- [ ] Partly on the laptop and partly in the cloud: small steps locally, large ones on the server.
  > The model is not split by the size of a step. Every decision is made by the same model on the server; only the tools run locally.
- [ ] In the browser, which downloads the model at the start of the session.
  > Claude Code does not run in the browser, and the model is not downloaded. Running a model locally is possible, but it is a separate choice with smaller models.

## Your agent works with your user account, and you have allowed it to run commands without asking. What can it do? {#ag-008}

- [x] delete files in your personal folder
  > Correct: anything your account may do, the agent may do as well, deleting included.
- [x] publish a website through your GitHub account
  > Correct: if your account is signed in on the computer, a command from the agent can publish in your name.
- [ ] read files on a colleague's laptop on the same network that your account has no access to
  > The agent has exactly your permissions, no more. What your account cannot reach, the agent cannot reach either.
- [x] read every file your account can read, private documents included
  > Correct: the agent does not distinguish between project files and private documents; it can access everything you can.
- [ ] change the model's weights so that it remembers your project next week
  > The weights belong to the provider and do not change through use. An agent can only remember through files it reads again.

## Two agents use exactly the same language model but different harnesses. Which statement is correct? {#ag-009}

- [ ] They behave the same, because all decisions are made in the model.
  > The model decides, but only about what the harness puts in front of it. Other tools, instructions and permissions lead to other decisions.
- [x] They can behave differently, because the harness determines which tools, instructions, permissions and context the model gets.
  > Correct: an agent is an LLM plus a harness. The same model in a different harness is a different agent.
- [ ] They differ only in speed, because the harness sets how fast the model computes.
  > How fast the model computes is determined by the provider's server. The harness changes what the model sees and may do, and with it the behaviour.
- [ ] They give the same answers in a different layout, because the harness only formats the output.
  > The harness does more than format; it runs the loop, the tools and the context. Which answers come about at all depends on that.

## An agent is asked to work out how much nitrogen may still be applied to a field. Its web search returns a current page and an archived page from 2009 with a different requirement, and it calculates with the 2009 value. What does this show? {#ag-010}

- [ ] The search tool made a mistake; a better one would only return current pages.
  > The search did what it was asked: it found matching pages. Old sources exist on the real web too, and an agent has to deal with them.
- [x] The model works only with what is in its context; whether it notices an outdated source depends on whether it reads and checks the result carefully.
  > Correct: the year was in the search result. An agent is only as good as the results that reach it and the way it handles them; in the game "Be the Agent" this is exactly the trap of Task 2.
- [ ] The harness should have filtered out the old page, because it checks every result for correctness.
  > The harness checks whether a call is valid, not whether a result is correct in substance. Judging that remains the model's job.
- [ ] A larger model would have known the current value from training, so the mistake is down to the size of the model alone.
  > Training knowledge has a cut-off date and may itself be outdated. That is exactly why an agent searches for sources and has to judge how old they are.

## Which sequence describes the loop at the core of every agent? {#ag-011}

- [ ] plan, carry out all steps, deliver a report
  > This lacks the observing between steps. An agent looks at every result before it chooses the next step.
- [ ] prompt, answer, user feedback, new prompt
  > That is a conversation with a chatbot: the human takes the next step. With an agent the loop closes without the human.
- [x] think, act, observe, and again until the goal is reached
  > Correct: in research this pattern is called ReAct (Yao et al., 2022); in the game it is the THINK, TOOL and RESULT cards.
- [ ] search, read, summarise, and stop after one answer
  > This is a fixed sequence with a single pass. An agent has no fixed number of passes; it stops when the goal is reached.

## METR reports a "time horizon" of several hours for current models. What does it measure? {#ag-012}

- [ ] How long a model can work before its context window is full.
  > The measure has nothing to do with the context window. It measures the length of tasks, not how long the model runs.
- [x] The length of tasks, measured in the time a human needs, that a model completes on its own in half of the cases.
  > Correct: a horizon of four hours means that tasks a human needs four hours for succeed in about half of the cases.
- [ ] How many hours of human work a model saves on average per day.
  > METR does not measure saved working time. Whether the time horizon translates into savings is a separate, open question.
- [ ] How long the model needs for a task that a human completes in one hour.
  > What is measured is not the model's computing time but how long the tasks it still manages may be.
