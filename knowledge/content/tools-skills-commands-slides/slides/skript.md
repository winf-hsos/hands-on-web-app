# Tools, Skills and Commands

Script for the experiment *Tools, skills and commands*, in the order of the
slides. The deck leads through the weekly order of an invented farm shop, lets
the agent write the skill for the daily closing by itself, and moves the agent
to a small model; the full steps, every file and the folder after each process
are in the experiment itself.

## Opening

Farmer Jeff runs the Lindenhof farm shop, a small self-service shop on his
farm. He stocks the shelves, and the customers weigh, pay and take their goods
themselves. Two jobs come back again and again: every week someone has to work
out the order to the suppliers, and every evening someone has to count the cash
box and write the day into the cash book. Can an AI agent help Jeff with both,
and if so, what does it need? We build what it lacks one part at a time and
look each time at what changes. The shop and its numbers are invented.

## The naked agent

**An agent with a role and nothing else.** The starter folder holds little
more than the file `opencode.jsonc`, and in it an agent called `shop`: a model,
`gpt-6-luna`, a role in one sentence, and a single rule. That rule takes away
everything OpenCode brings along, so the agent can neither read files nor run
commands nor search the web. Everything else is added step by step.

**The naked agent.** Asked to place this week's order, `gpt-6-luna` answers:
"Sure, what items and quantities should I order, and from which suppliers?"
That is a sensible reply, since the model knows nothing about the shop. A
smaller model tends to guess at this point and invents products and
quantities. Neither is an order: without tools, a model can only ask back or
guess, because it cannot see anything of the shop.

## Tools

**A tool is a function the agent may call.** Like a function in mathematics,
it has a name, inputs and a result. It also has a description in words, and
that description is the only thing the language model learns about the tool;
it never sees the code behind it. The tool `shop_sales`, the tool `sales` in
the group `shop`, takes two dates and gives back the units sold of each
product between them.

**In the chat: the agent calls a tool.** Asked how many bottles of milk were
sold in the last four weeks, `gpt-6-luna` works out the two dates itself and
writes the call `shop_sales(from_date="2026-10-29", to_date="2026-11-25")`.
OpenCode runs it, not the model, and hands back the result, and only then does
the model answer: 163 bottles.

**Everything becomes part of the context.** The model remembers nothing by
itself. What it sees is one long text, the context: the role, the list of tools
with their descriptions, and Jeff's question. When the model calls a tool,
OpenCode appends the call and its result to this text, and the model writes its
answer from the longer text. Every result takes up room in the context, and
everything in the context can be used by the model.

**Where do the tools come from?** The tools do not live in OpenCode but in
small programs of their own, the servers. So that not every agent app has to
talk to every server in its own way, there is a common protocol, the Model
Context Protocol, MCP. It works like USB: any device with a USB port can read
any USB stick, and any app that speaks MCP can use any MCP server. There are
ready-made servers for GitHub, calendars or databases; for the farm shop we
write our own, three small Python files.

**What an MCP server can offer.** Tools, which the model calls by itself;
resources, data that the app can read and put into the context, such as files;
and prompts, prepared instructions that a person picks from a list. In this
experiment, the servers offer only tools.

**An MCP server in Python.** `tools/shop.py` is one group of tools in one file.
`FastMCP("shop")` makes the file a server named `shop`, and `lindenhof` is the
file in the starter folder that holds the shop's data. Every function with
`@mcp.tool()` above it becomes a tool: OpenCode puts the server's name in front
of the function's name, so `sales` becomes `shop_sales`, its parameters become
the inputs, and the text in triple quotes the description that the model
reads. What the function returns is the tool's result, and `mcp.run()` starts
the server. `FastMCP` has the same name as in the official Python
package `mcp`; the starter folder brings a small copy so that nobody has to
install anything.

**Switching the server on.** Two entries in `opencode.jsonc`, the
configuration file in the shop's folder, give the agent the tools: under `mcp`
the server with the command OpenCode starts it with (`python3` on macOS), and
under `permissions` a rule that allows all tools whose names start with
`shop_`, because the first rule forbids everything. Everything the agent needs
is in this one folder, and no global setting changes.

**The shop's tools.** For the weekly order the agent gets four tools in two
groups. Three only read: `shop_products` lists every product with supplier,
pack size and shelf life, `shop_stock` the units on the shelf and `shop_sales`
the units sold between two dates. The fourth acts: `orders_place_order` sends
an order to one supplier, which in the experiment lands as a file in the
folder `outbox`. Reading cannot break anything, while ordering costs money, so
the two groups get different rules.

**What a tool may do.** Each rule has one of three effects. With `allow` the
agent calls the tool whenever it decides to, with `ask` OpenCode stops before
every call and asks the person, and with `deny` the tool is gone, so that the
model does not even know it exists. `shop` is on `allow` and `orders` on
`ask`. The rules are in `opencode.jsonc` under the agent, and the last rule
that matches decides.

**Poll.** Two new sessions, the same tools, the same data and the same
question: will the agent place the same order twice? Everyone commits to an
expectation before the groups try it themselves.

**Same tools, same data, two different orders.** Two runs of `gpt-6-luna` with
the tools of the group `shop` wanted 30 and 36 bottles of milk, 18 jars of
yoghurt both times, and 10 and 20 packs of butter, while the shop's rules give
36, 30 and 20. Both runs looked at only the last week instead of four, and the
first wanted to order eggs from the own farm. The model does not calculate
badly; it does not know the rules and invents its own each time. The tools
give the agent the shop's data, but not the rules by which the shop orders.

## Skills

**How Jeff works out the weekly order.** Jeff orders by fixed rules that he
never wrote down: he takes the sales of the last four weeks, works out the
average per week and wants one and a half times that on the shelf, or just once
the average for fresh goods, so that nothing spoils. He rounds what is missing
up to whole packs, orders once per supplier and never from the own farm, and
looks at the list before anything is sent. He would write exactly this on a
sheet for a new helper, and a skill is that sheet for the agent: no new
ability, only the knowledge of how this shop does the job.

**A skill is a file with know-how.** A skill is a Markdown file in a folder
with a fixed name. At the top, between the dashes, are its name and its
description, the two lines the agent always sees; below them are the steps in
plain language. The whole file is in the experiment to copy.

**In the chat: the agent loads the skill first.** Asked the same question as
the naked agent, `gpt-6-luna` loads the skill `weekly-order` before it calls
any of the shop's tools, then reads the sales of the last four weeks up to and
including yesterday, as the skill says, shows the table and asks whether to
place the order.

**The skill enters the context only when it is needed.** At the start, the
context holds just one line of the skill, its name and its description. Only
when the question fits the description does the model call the tool `skill`,
and then the whole text enters the context, at the moment it is needed. This
way an agent can know dozens of skills without filling its context.

**How does the model know when to load a skill?** It has only the description
to go by, so a good description says both what the skill is about and when it
is needed: "Use it whenever an order or restocking is due." The instructions
then have to be clear enough to improve the result, and the model has to be
strong enough to connect the question to the description; the last part shows
a small model that never loads the skill at all.

**With the skill, both runs follow the shop's rules.** Two new sessions with
the skill both looked at four weeks, both came to exactly the quantities that
the checking script works out without any language model, and both left out
the own farm, although nothing about the tools changed. A skill turns a model
that invents its own rules into one that follows the rules of this shop.

## Commands

**A command is a saved prompt with a short name.** Jeff starts the order every
week, and every time he would have to type the same long prompt with all its
conditions. A command stores the prompt in a file and gives it a short name,
like a speed-dial button on a phone, so that Jeff types only `/weekly-order`.

**A command is a file, too.** The file name becomes the command. The
description at the top is for Jeff, who sees it in the list of commands, the
line `agent: shop` sets the agent that runs it, and below is the prompt the
agent gets, with `$ARGUMENTS` as the place for whatever follows the command.
The command names the skill, so that the model does not have to find it by
itself.

**What OpenCode sends to the agent.** Jeff types `/weekly-order Bee Garden`,
OpenCode reads the file, puts `Bee Garden` in place of `$ARGUMENTS` and sends
the whole text, word for word, to the agent. The model sees no command, only a
detailed prompt, and from there everything runs as before.

**Who decides when each part comes in.** The model decides when to call a tool,
and the permission decides whether it may. The model loads a skill when the
description fits, or because a command names it. A command is typed by a
person, and the model never starts one by itself.

## The agent writes

**The daily closing, in Jeff's words.** Every morning the cash box starts with
100 euros of change. Customers pay cash into the box or by card at the
self-service till, and card payments never reach the box. Whoever brings back a
glass bottle or jar takes 15 cents of deposit out of the box. In the evening
Jeff counts the box and compares it with what should be in it; a difference of
up to two euros either way is fine, anything more he wants to hear about. Then
the day goes into the cash book.

**The tools of the till.** For the daily closing the agent gets three more
tools: `till_register_log` gives the cash and card sales and the number of
returned bottles and jars, `till_cash_count` the cash counted in the box, and
`till_write_cashbook` adds a row to the cash book. On Thursday, 19 November,
the till shows 83.10 euros in cash, 30.80 by card and 6 returned bottles and
jars, and the box holds 177.70 euros. No tool knows about the 100 euros of
change or the 15 cents of deposit; those are only in Jeff's words.

**Why not let the agent write the skill?** Jeff can describe his job, but he
would never write a skill file, while the agent knows its tools and how a skill
is laid out. So Jeff describes the job in his own words, and the agent writes
the skill and the command from them. Someone still has to read what the agent
wrote before it runs every evening.

**Three rules let the agent write, but only skills and commands.** Three rules
go into the same `opencode.jsonc` in the shop's folder. The first allows the
skill the agent is about to write; the other two give it a tool to write files,
but only in the folders for skills and commands, and with `ask` OpenCode shows
every file before it is written. The cash book, the tools and the agent's own
configuration stay out of its reach; otherwise it could widen its own rights.

**The first attempt: a skill without a header.** Given Jeff's words,
`gpt-6-luna` wrote both files, but left out the header with name and
description in each. Asked to close 19 November, the agent read the till and
the cash box and then asked for the change and the deposit, as if it had no
skill: without a description, it never learned what its own skill was for. In
an earlier run, the same model wrote the header by itself, so the result varies
from run to run.

**The skill after one more request.** Told that the skill and the command did
not work and asked to compare them with `weekly-order`, the agent added the
headers, and the closing of 19 November came out right: 182.20 euros expected,
177.70 counted, a difference of −4.50 euros, entered into the cash book and
reported to Jeff. The skill writes the calculation as formulas and adds a rule
for missing data, but it names none of the tools, and the command has no line
`agent: shop`.

**A second request: a report Jeff can check.** An answer in the chat is gone
with the session, while Jeff wants a page on which he can check every step.
Typst is a small program that turns a text file into a PDF; installing it is
an optional step in the experiment. Two more rules let the agent write in a
folder `reports` and run exactly one command, `typst compile`, and a second
request is enough for the agent to extend its own skill.

**The report of 19 November.** With the extended skill, the agent wrote a page
with the till's figures, the deposit, the expected cash, the difference in red
and the entry in the cash book, and compiled it with `typst compile`. It then
tried to check the PDF with other commands, and OpenCode refused each of them,
because only `typst compile` is allowed.

## Small models

**Poll.** The same agent, the same tools and skills, but a small model that
runs on your laptop: what goes wrong first?

**Five questions, seven tools: which one does the model call?** Five
questions, each in a new session, with all three groups of tools and both
skills in place. `gpt-6-luna` chose the right tool every time and loaded the
skill `daily-closing` by itself for the question about the cash box. Both
Gemma models, `gemma-4-e2b` and the somewhat larger `gemma-4-e4b`, answered
the question about the cash taken with `till_cash_count`, the tool with the
word "cash" in its name, and reported the 177.70 euros counted in the box
instead of the 83.10 euros of cash sales. Asked whether the cash box was
right, neither loaded the skill; both read only the count and gave no verdict.
A small model picks the tool whose name fits a word of the question, and it
does not think of loading a skill by itself.

**The order that was never placed.** Asked to order honey, `gemma-4-e4b`
called the right tool, we rejected the call, and the model still answered that
the order had been placed. The folder `outbox` stayed empty, so nothing was
ordered; only the answer was wrong. `gpt-6-luna` and `gemma-4-e2b` reported
the rejection correctly. An agent's answer is not a receipt, so the result has
to be checked where the tool leaves it.

**/weekly-order with the skill written by hand.** With the command, which
names the skill, both small models loaded it. `gemma-4-e2b` came to the right
quantities, but tried to send a single order with all products to Meadow Dairy
before Jeff had agreed, and only the rule `ask` stopped it. `gemma-4-e4b`
never called `shop_stock`, invented the stock, ordered almost nothing and
proposed 72 eggs from the own farm. In the daily closing, `gemma-4-e4b`
expected 183.20 instead of 182.20 euros and wrote a difference of −5.50 euros
into the cash book. A skill that is enough for a cloud model leaves a small
one too much to decide for itself.

**A frontier model prepares the small one.** `gpt-6-luna` is itself one of
OpenAI's smaller models, only far larger than one that fits on a laptop. For
rewriting the instructions we therefore take a frontier model, `gpt-6.2-sol`,
as a second agent called `coach` in the same folder. It may read every file and
rewrite skills and commands, but it cannot run anything and asks before every
change. We told it what had gone wrong with the small models and asked it to
make the instructions exact enough to be followed step by step, with the
shop's rules unchanged.

**The same rule, written for a small model.** In about a minute, the coach
rewrote all four files. The rule for the target stock became a formula, with
`S` for the units sold from `shop_sales` and the rounding at the end. Every
step names the tool with its arguments, the stock has to come from
`shop_stock`, and the order goes out only after an explicit approval in a later
message, once per supplier. The daily closing calculates in whole cents and
checks its result, and the description of `daily-closing` now also names the
questions about the cash taken and the cash box.

**The small models with the coach's instructions.** Both models now answered
the question about the cash taken with the right tool, and neither claimed an
order that had been rejected. `gemma-4-e4b` loaded the skill for the cash box,
read the stock and waited for approval in the weekly order, and closed the day
correctly, but still got six of nine order quantities wrong. `gemma-4-e2b` got
all nine quantities right, but still did not load the skill for the cash box,
and in the daily closing it worked out the −4.50 euros without writing them
into the cash book. Exact instructions fixed most of the mistakes, and the
arithmetic that is left belongs in a tool, not in a skill.

**What to take away.** Tools give the agent access to the shop, as functions
with a name, inputs and a description, offered through MCP. A skill tells it
how this shop does the job and is loaded only when its description fits. A
command gives a person a short way to start the job and is never started by the
model. Rules in `opencode.jsonc` decide what the agent may do. What an agent
wrote has to be read before it runs, and results have to be checked where the
tools leave them. And the smaller the model, the more exact the instructions
have to be.

**Reflect.** Why did the answers differ with tools alone, although the agent
read exactly the same data? What would you check in a skill that an agent wrote
before you let it run every evening? Why does a small model need instructions
that a strong model can do without, and who pays for writing them?
