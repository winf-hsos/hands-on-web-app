# Tools, Skills and Commands

Script for the experiment *Tools, skills and commands*, in the order of the
slides. The deck leads through the weekly order of an invented farm shop, lets
the agent write the skill for the daily closing by itself, and moves the agent
to a small model; the full steps, the starter folder and the solutions are in
the experiment itself.

## Opening

The Lindenhof farm shop is a small self-service shop on a farm. The owner
stocks the shelves, and the customers weigh, pay and take their goods
themselves. Two jobs come back again and again: every week someone has to work
out the order to the suppliers, and every evening someone has to count the cash
box and write the day into the cash book. An AI agent could do both, but it
cannot do either of them yet. We equip it one part at a time and look each time
at what changes. The shop and its numbers are invented.

## The naked agent

**One agent, three groups of tools.** The starter folder holds an agent called
`shop` in `opencode.jsonc`, with a model, a role in one sentence and the rules
for what it may do. Next to it is a small Python program with three groups of
tools: `shop` reads products, stock and sales, `orders` sends an order, and
`till` reads the self-service till and the cash box and writes the cash book.
At the start all three are switched off, and the first rule takes away
everything OpenCode brings along by itself, so the agent has no files, no shell
and no web.

**The naked agent.** Asked to place this week's order, `gpt-6-luna` answers:
"Sure, what items and quantities should I order, and from which suppliers?"
That is a sensible reply, since the model knows nothing about the shop. A
smaller model tends to guess at this point and invents products and
quantities. Neither is an order: without tools, a model can only ask back or
guess, because it cannot see anything of the shop.

## Tools

**A tool is a function the agent may call.** It has a name, parameters and a
description in words. The model sees only the description, never the code. It
writes a call, OpenCode runs it and puts the result back into the context. The
sales tool returns the units sold per product between two dates; the numbers
are generated from the date, so every group gets the same ones on the same day.

**Switching a group of tools on.** The tools run as an MCP server, a program of
its own that OpenCode starts and talks to through a fixed protocol. A group is
switched on by setting `"disabled"` to `false`. OpenCode notices the change by
itself, and a new session has the tools.

**What a tool may do.** A rule says `allow`, `ask` or `deny`, and the last rule
that matches wins. With `allow` the agent calls the tool whenever it decides
to. With `ask`, OpenCode stops before every call and asks the person; the shop
uses it for orders, because an order costs money and cannot be taken back.
With `deny` the tool is gone, and the model does not even see that it exists.

**Poll.** Two new sessions, the same tools, the same data and the same
question: will the agent place the same order twice?

**Same tools, same data, two different orders.** Two runs of `gpt-6-luna`
with the `shop` tools only both looked at the last week instead of four, both
ordered too little yoghurt, and the first one wanted to order eggs from the
farm itself, which the shop never orders. The model does not calculate wrongly;
it does not know the rules and invents its own each time. The tools give the
agent the shop's data, but not the rules by which the shop orders.

## Skills

**A skill is a file with know-how.** It is a Markdown file in a folder with a
fixed name, `.agents/skills/weekly-order/SKILL.md`. At the top it has a name
and a description, below them the steps in plain words, the way the owner would
explain them to a new helper. A skill adds no new ability and no code, only
knowledge of how this shop does the job.

**The agent loads a skill only when it needs it.** At the start, the agent's
context holds its role, its tools and, of the skill, only the name and the
description in one line. When a question fits the description, the model calls
the tool `skill`, and only then does the whole text come into the context. That
is why an agent can know dozens of skills without filling its context, and why
the description matters: it decides when the skill is loaded.

**With the skill, both runs follow the shop's rules.** The same question in two
new sessions, now with the skill: both runs look at four weeks, both arrive at
exactly the quantities that the solution script works out without a language
model, and both leave out the farm's own products. Nothing about the tools has
changed, and a skill turns a model that invents its own rules into one that
follows the rules of this shop.

## Commands

**A command is a prompt with a short name.** It is a Markdown file in
`.opencode/commands/` holding a prompt that someone would otherwise type every
week. The file name becomes the command, and `$ARGUMENTS` is the place for
whatever follows it. The command names the skill outright, so the model does
not have to find it by itself.

**What OpenCode sends to the agent.** Typing `/weekly-order Bee Garden` makes
OpenCode read the file, put "Bee Garden" in place of `$ARGUMENTS` and send the
whole text to the agent. The model sees no command, only a detailed prompt.
From there everything runs as before: the agent loads the skill, calls the
tools and shows its table, and OpenCode asks before the order because `orders`
is set to `ask`.

**Who decides when each part comes in.** The model decides when to call a tool,
and the permission decides whether it may. The model loads a skill when its
description fits, or when a command names it. A command is typed by a person,
and the model never starts one by itself. Whoever wants a process to start
reliably writes a command; whoever wants the agent to do something right by
itself writes a skill.

## The agent writes

**The daily closing, in the owner's words.** Every morning the cash box starts
with 100 euros of change. Customers pay cash into the box or by card at the
self-service till, and card payments never reach the box. Whoever brings back a
glass bottle or jar takes 15 cents of deposit out of the box. In the evening
the owner counts the box and compares it with what should be in it; a
difference of up to two euros either way is fine, anything more the owner
wants to hear about. Then the day goes into the cash book. For this process
nobody writes a skill by hand: the groups give the agent the owner's words and
let it write the skill and the command itself.

**Two rules let the agent write, but only skills and commands.** The starter
folder already holds two rules in `opencode.jsonc`, switched off with `//`.
They give the agent a tool to write files, but only in `.agents/skills` and
`.opencode/commands`, and with `ask` OpenCode shows every file before it is
created. The cash book, the tools and the agent's own configuration stay out of
its reach; otherwise it could widen its own permissions.

**The skill the agent wrote.** On its first attempt, `gpt-6-luna` named the
tools with their full names, wrote the calculation as formulas and added a rule
the owner never stated: ask when data is missing instead of guessing. With its
own command it closed Thursday, 19 November correctly, with a difference of
−4.50 euros. What it left out was a fixed form for its answer, and its command
has no `agent: shop` line. That is why you read a skill an agent wrote before
you let it run every evening.

## Small models

**Poll.** The same agent, the same tools and skills, but a small model that
runs on your laptop: what goes wrong first?

**Five questions, nine tools: which one does the model call?** With all three
groups switched on, the model chooses among nine tools. `gpt-6-luna` chose the
right one every time, and for the cash box it asked for the change and the
deposit instead of guessing. The two Gemma models failed at different places:
Gemma 4 E4B asked back when asked how much honey is on the shelf, and Gemma 4
E2B took the counted cash as the day's cash takings and so reported 177.70
euros including the change. Both checked the cash box only halfway. Choosing
the right tool from a question in everyday words is itself work that the model
has to do.

**The order that was never placed.** Asked to order 12 jars of honey, Gemma 4
E4B called `orders_place_order`, OpenCode asked, the request was rejected, and
the model still reported that it had placed the order. It reported what it
meant to do, not what the tool returned, and the folder `outbox` stayed empty.
An agent's answer is not a receipt, so check the result where the tool leaves
it.

**The same skill on small models.** With the skill written by hand, Gemma 4
E4B loaded the skill but looked at five weeks instead of four, ordered too much
and ordered jam although enough was on the shelf. Gemma 4 E2B did not load the
skill at all and called `orders_place_order` at once with an empty list. The
short skill for the daily closing, on the other hand, was enough for both. A
skill that is enough for a strong model leaves a small one too much to decide
for itself.

**A strong model prepares the small one.** The starter folder has a second
agent, `coach`, which runs on `gpt-6-luna`. It may read every file in the
folder and rewrite skills and commands, but it cannot run anything and asks
before every change. The groups tell it what went wrong on the small model and
ask it to make the instructions exact enough for a small model to follow step
by step. Any strong agent works instead, such as Claude Code in the same
folder.

**The same rule, written for a small model.** The skill written by hand says
that the target is the average times 1.5, or times 1.0 for products with a
shelf life of seven days or less, and `gpt-6-luna` manages with that. The coach
wrote the same rule for the small model: which field from which tool to use,
the calculation as a formula, and the case at which the small model failed,
yoghurt with its 14 days, spelled out. The shop's rules stay the same, but
nothing is left to the model's judgment any more.

**The small model with the coach's instructions.** With the coach's files, both small models
handled the weekly order nearly right: Gemma 4 E4B now looked at four weeks
and left the own farm out, with only yoghurt still wrong, and Gemma 4 E2B got
all nine quantities right, although it listed the own farm's eggs and potatoes
in its table. Gemma 4 E4B now found the honey with `shop_stock`, and Gemma 4
E2B reported the rejected order as rejected. What nobody had told the coach
about stayed as it was: both models still checked the cash box with the count
alone, and Gemma 4 E2B still took the counted cash for the takings. Some
things got worse: Gemma 4 E4B suddenly claimed it had no access to the sales,
and Gemma 4 E2B miscalculated the daily closing and did not write the cash
book. The coach fixed what it was told about, while the rest stayed as
unreliable as before, so one good run is not yet a test, and arithmetic that
keeps going wrong belongs in a tool rather than in a skill.

**What each part adds.** Tools give the agent access to the shop, a skill
tells it how the shop does the job, and a command gives a person a short way to
start it, and the smaller the model, the more exactly all three have to be
written.

**Reflect.** Why did the answers differ with tools alone, although the agent
read exactly the same data? What would you check in a skill that an agent wrote
before you let it run every evening? Why does a small model need instructions
that a strong model can do without, and who pays for writing them?
