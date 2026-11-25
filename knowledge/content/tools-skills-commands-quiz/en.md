---
type: quiz
code: 3230
title: "Quiz: Tools, skills and commands"
summary: >-
  Thirteen questions on the farm shop experiment, each answer with its reason. The
  questions come from the pool of the module and are in the format of its
  exam.
level: 2
duration: 26
topics: [ai-agents]
relations:
  checks: [tools-skills-commands]
modules: [aai]
areas: [ai]
questions: [tsc-001, tsc-002, tsc-003, tsc-004, tsc-005, tsc-006, tsc-007, tsc-012, tsc-008, tsc-009, tsc-013, tsc-010, tsc-011]
status: published
updated: 2026-11-25
---

## An agent has a role ("you are the assistant of the farm shop") but no tools. You ask it to place this week's order with the suppliers. What is the best it can do? {#tsc-001}

- [ ] Put the order together from what it knows about typical farm shops and send it.
  > Without a tool it cannot send anything, and what it knows about typical shops says nothing about the stock and sales of this shop. Such an order would be a guess.
- [x] Ask back what to order, how much and from which supplier, because it can see neither the products nor the stock nor the sales.
  > Correct: a language model can only write text. Without a tool it cannot reach the shop's data, so it can only ask back or guess, and asking back is the honest choice.
- [ ] Keep the order in its context and send it as soon as a tool is switched on.
  > Tools only appear in a new session, and an order without data would still be a guess later. The model does not plan across sessions.
- [ ] Read the shop's data from the project folder itself, since every agent can read files.
  > Reading files is just another tool. In this agent it is denied like all the others, and the model does not even see a denied tool.

## You ask an agent with the same tools the same question about the weekly order in two new sessions. The tools return exactly the same data both times, yet the quantities differ. What is the most likely reason? {#tsc-002}

- [ ] The model made an arithmetic mistake in one of the two sessions.
  > Arithmetic mistakes happen, but they do not explain why the two runs look at different periods and keep different amounts of stock. The runs follow different rules, not the same rule with a mistake.
- [ ] The second session remembers the first and corrects its order.
  > A new session starts with an empty context. It knows nothing about the first one.
- [x] The tools supply the data but not the shop's rules; the model decides the period, the stock to keep and the rounding by itself each time.
  > Correct: how many weeks count, how much stock to keep and whether the own farm is ordered from is in no tool. The model invents it, and not the same way every time.
- [ ] The tools returned random sales figures that only happened to look the same.
  > The question says the data was exactly the same. The difference arises only afterwards, in the model.

## What does a skill such as `weekly-order` add to an agent that the tools alone do not give it? {#tsc-003}

- [ ] Access to sales and stock, which the tools only release once the skill is loaded.
  > Access comes from the tools and the permissions in the configuration. A skill opens nothing; it is only text.
- [ ] A faster model, because the skill does the calculations in advance.
  > A skill calculates nothing. The model reads it and still does the calculations itself, with the same abilities as before.
- [ ] A short form with which a person can start the order in one line.
  > That is a command. A skill is loaded by the model when the task fits its description.
- [x] The knowledge of how this shop does the job, in plain words: which weeks count, how much stock to keep, what is never ordered.
  > Correct: a skill is an instruction of the kind you would give a new helper. It turns data into an order that follows the shop's rules.

## An agent knows twenty skills. At the start of a session, only the name and the description of each skill are in its context. Why is it built this way? {#tsc-004}

- [x] So that the context does not fill up with instructions that do not matter for the task; the model loads the whole text only when the description fits.
  > Correct: a skill only takes up space once it is needed. That is why the description decides whether it is loaded at all, and it has to say what the skill is for.
- [ ] So that the model cannot read skills that contain secret business rules.
  > The model can load and read every permitted skill. The short form saves space; it hides nothing.
- [ ] Because the text of a skill is only downloaded from the provider's server when it is loaded.
  > Skills lie as files in the project folder. The only thing that changes is when their text enters the context.
- [ ] Because the model needs the name and description to run the skill itself, like a tool.
  > A skill is not run but read. The model then follows its steps and calls the tools to do so.

## The file `.opencode/commands/weekly-order.md` holds the text "Work out this week's order with the skill weekly-order, for these suppliers: $ARGUMENTS". You type `/weekly-order Bee Garden`. What does the language model receive? {#tsc-005}

- [ ] The line `/weekly-order Bee Garden`, and it looks for the matching file itself.
  > OpenCode resolves the command before the model sees anything. The model never receives the command itself.
- [ ] Nothing, because a command runs the order as a script without asking the model.
  > A command does not call a script. It sends a prompt to the agent, and the model works through it like any other message.
- [x] The text of the file, with `$ARGUMENTS` replaced by "Bee Garden".
  > Correct: a command is a saved prompt. OpenCode fills in the rest of the line and sends the whole text as if you had typed it yourself.
- [ ] The full text of the skill `weekly-order`, because the command names it.
  > The command only names the skill. The model then has to load it itself, with the tool `skill`.

## Who decides when a tool is called, a skill is loaded and a command is started? {#tsc-006}

- [ ] The model in all three cases, limited only by the permissions in the configuration.
  > The model never starts a command by itself. It is the way a person sets a process in motion.
- [ ] The person in all three cases, who sets the order in which they come in beforehand in the configuration.
  > The configuration sets what is allowed, not when. When a tool or a skill comes in is decided by the model while it works.
- [x] The model calls tools and loads skills by itself, as far as the permissions allow; a command is typed by a person.
  > Correct: the model uses tools and skills by its own decision. A command is the entry point for a person who wants to start the process reliably.
- [ ] OpenCode calls tools on a fixed plan, while the model chooses skills and commands.
  > OpenCode only carries out a tool call when the model writes one; there is no fixed plan. And the model does not choose commands.

## In `opencode.jsonc`, the rule for the order tools `orders_*` is set to `deny` instead of `ask`. You ask the agent to place this week's order. What happens? {#tsc-007}

- [ ] The agent calls the order tool, and OpenCode asks you first whether it may send the order.
  > That describes `ask`. With `deny` there is nothing to ask, because the tool is no longer there.
- [x] The model sees no order tool; it can work out and show the quantities but cannot send an order.
  > Correct: a denied tool disappears from the context. The model does not know it exists and can only say that it cannot place the order.
- [ ] The agent sends the order anyway, because the rule only produces warnings.
  > The rules are enforced by OpenCode, not followed by the model. With `deny` the tool cannot be called.
- [ ] The agent writes the order into a file with another tool instead.
  > In this agent all tools except the shop's are denied, writing files included. It has no other way.

## You want the farm shop's agent to write its skill for the daily closing by itself. Which rule in `opencode.jsonc` fits best? {#tsc-012}

- [x] `edit` only for `.agents/skills/**` and `.opencode/commands/**`, each with `ask`.
  > Correct: the agent may write exactly the files it needs for skills and commands, and you see each file before it is created.
- [ ] `edit` for `*` with `allow`, so that the agent is not interrupted for every file.
  > This would let the agent change every file in the folder, including `opencode.jsonc` with its own permissions and the cash book, without you seeing it.
- [ ] `bash` with `allow`, so that the agent can create the file with a command.
  > A shell allows far more than writing a skill, up to deleting files. For a text file, the permission `edit` on one folder is enough.
- [ ] No new rule; the agent writes the skill with the tool `skill`.
  > The tool `skill` loads an existing skill; it does not write one. Without a write permission the agent can only show the text.

## A small local model follows the skill but treats yoghurt with a shelf life of 14 days as perishable, although the skill says "7 days or less", and orders too little. Which change makes this step reliable regardless of the size of the model? {#tsc-008}

- [ ] Put the sentence in the skill in bold and add "always observe this".
  > That may help, but it remains a request to a model that has already read past the sentence once. It does not make the step reliable.
- [ ] Turn the skill into a command, so that a person starts the process.
  > A command changes who starts the process, not how exactly the model follows the steps. The mistake would remain the same.
- [ ] Set the rule for the order tools to `ask`.
  > With `ask` you see the wrong quantity before it is sent and can reject it. That protects against the damage but does not calculate correctly.
- [x] Write a tool that works out the target stock per product from sales and shelf life in code, and name it in the skill.
  > Correct: what can be fixed exactly belongs in code. The model then only has to call the tool, and the rule always applies the same way.

## The agent has the till's tools but no skill for the daily closing yet. It reads the cash sales, the card sales, the returned deposit bottles and the counted cash. What does it still lack to work out the expected cash? {#tsc-009}

- [x] The change in the box in the morning and the deposit per bottle; neither is in any tool, only in the owner's description.
  > Correct: these are rules of the shop, not data of a day. They belong in the skill, otherwise the model has to ask back or guess.
- [ ] The card sales, which have to be added to the cash in the box.
  > The tool already supplies the card sales, and they never reach the box. Adding them gives the wrong result.
- [ ] Nothing; the expected cash is the counted cash, and the difference is always zero.
  > That is exactly what a small model guessed in our tests. The closing then never finds a difference and misses its purpose.
- [ ] A tool that works out the difference, because a language model cannot subtract numbers.
  > A good model calculates correctly with a few numbers. What it lacks is not the arithmetic but two values that only the owner knows.

## All three groups of tools are switched on. Asked how many jars of honey are left on the shelf, `gpt-6-luna` calls `shop_stock` at once, while a small local model asks back whether it should look up the stock. How do you explain the difference? {#tsc-013}

- [ ] The small model sees fewer tools because its context is smaller.
  > Both models receive the same nine tool descriptions. The difference lies in what they make of them.
- [ ] The small model may not call `shop_stock`, because local models have different permissions.
  > Permissions belong to the agent, not to the model. With the same rules, every model may call the same tools.
- [ ] The strong model knows the honey stock from training and only calls the tool to confirm it.
  > No model knows the stock of an invented shop. The strong model called the tool because that was the only way to get the number.
- [x] Working out the right tool from a question in everyday words is itself an achievement of the model, and a small model recognizes less often that "on the shelf" means the same as `shop_stock`.
  > Correct: choosing a tool is not a mechanism of the program but a decision of the model. A skill that says which tool fits which question takes this decision off the small model.

## An agent on a small local model is asked to order 12 jars of honey from Bee Garden. It calls `orders_place_order`, you reject OpenCode's request, and it answers: "I've placed an order for 12 jars of honey from Bee Garden." What do you learn from this? {#tsc-010}

- [ ] The rejection did not work; the order reached the supplier anyway.
  > OpenCode does not carry out a rejected call. There is no order in the folder `outbox`; only the model's answer is wrong.
- [ ] The model found a second tool with which it sent the order another way.
  > Apart from `orders_place_order` the agent has no tool that orders. It sent nothing; it only claimed to.
- [x] An agent's answer is not a receipt: a small model easily reports what it meant to do rather than what the tool returned, so you check the result yourself.
  > Correct: the tool returned a rejection, and the model reported success anyway. Whether anything was ordered is shown by `outbox`, not by the agent's text.
- [ ] Small models cannot call tools; the whole answer was made up.
  > The call did happen, since OpenCode showed it to you for approval. What was made up is only that it succeeded.

## With the same skill, `gpt-6-luna` orders exactly by the shop's rules, while a small local model treats yoghurt with a shelf life of 14 days as perishable and orders too little. A strong model then rewrites the skill. What is most likely to change? {#tsc-011}

- [ ] The skill gets shorter, because a small model reads long texts less well.
  > As a rule it gets longer, not shorter: what the strong model filled in by itself has to be spelled out for the small one.
- [x] Every step names the tool with its arguments and the calculation as a formula, and whatever can be stated precisely is spelled out, such as that yoghurt with 14 days does not count as perishable.
  > Correct: a small model needs more exact instructions than a large one. The strong model writes them because it knows where room for mistakes is left.
- [ ] The shop's rules are simplified so that the small model can manage them, for example a factor of 1.5 for all products.
  > That would change the shop, not the instruction. The task is to write down the same rules precisely enough for a small model to follow them.
- [ ] The skill is told to work more slowly and carefully.
  > Such a request changes little, because the model does not know where it should be more careful. What works is to fix the error-prone places precisely.
