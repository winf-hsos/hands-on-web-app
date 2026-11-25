---
type: experiment
code: 7292
title: Tools, skills and commands
summary: >-
  You give the agent of a small farm shop a task it cannot do, then add tools,
  skills and commands one at a time, let the agent write a skill itself, and
  find out how much more exact the instructions have to be for a small model.
objectives:
  intro: "In this experiment you equip an agent step by step for two processes of an invented farm shop, and afterwards you can:"
  goals:
    - "explain why an agent without tools can only ask back or guess"
    - "tell a tool, a skill and a command apart by what each one adds: access to the world, knowledge of how the work is done, and a short way for a person to start it"
    - "switch on tools in OpenCode and decide which of them have to ask before they act"
    - "write a skill and a command for a process, and have an agent write them from a description in plain words"
    - "compare how a strong and a small model choose their tools, and explain why a small model needs more exact instructions"
    - "use a strong agent to rewrite skills and commands for a small model"
level: 2
duration: 135
topics: [ai-agents]
relations:
  see_also: [ai-agents, be-the-agent, opencode]
modules: [aai]
areas: [ai]
status: published
updated: 2026-11-25
---

The Lindenhof farm shop is a small self-service shop on a farm: the shelves
are stocked by the owner, the customers weigh, pay and take their goods
themselves, and two jobs come back again and again. Every week someone has to
work out what to order from the suppliers, and every evening someone has to
count the cash box and write the day into the cash book. An
[[ai-agents|AI agent]] could do both, but only once it has what it needs:
tools that reach the shop's data, a skill that says how this shop does the
job, and a command with which a person starts the job in one line. In this
experiment you give the agent these things one at a time and watch what each
of them changes. Then you let the agent write a skill by itself, move it to a
small model that runs on your own computer, and use a strong model to prepare
the instructions so that the small one can follow them.

The shop, its products and its numbers are invented for the experiment. The
sales are generated from the date, so everyone who asks on the same day gets
the same numbers and you can compare your results with your neighbors'.

The slides lead through the experiment, from the naked agent to the briefing
of a small model.

![Slides: Tools, skills and commands](item:tools-skills-commands-slides)

## Setup

Before the first process, set up OpenCode, Python and the starter folder.
After each step, open *What should happen?* to check that you are ready for
the next one.

1. Install the desktop app of [[opencode|OpenCode]], as described on its
   page. OpenCode is the agent you work with; the language model comes from
   a provider such as OpenAI.

> [!EXPECTED]
> OpenCode opens with the list **Projects** on the left, which is still
> empty.

2. Check that Python 3 is installed: open a terminal and type
   `python --version`. If the command is unknown, install Python as
   described in [[python-on-the-command-line]]. The shop's tools are a
   Python script that needs no extra packages.

> [!EXPECTED]
> The terminal shows a version such as `Python 3.13.1`. If only
> `python3 --version` works, as on some Macs, you will change `python` to
> `python3` in `opencode.jsonc` in step 5.

3. Connect the model. The folder is set up for OpenAI's `gpt-6-luna`, which
   needs an OpenAI API key. In OpenCode, click **Settings** below the project
   list, then **Providers**, then **+ Connect** next to OpenAI, choose
   **API key** and paste the key you got for the class. The key stays on your
   laptop, so don't put it into the folder, a chat or a screenshot, because
   anyone who has it can use it at the key owner's expense.

> [!EXPECTED]
> OpenAI appears under *Providers* as connected, and below the input field
> of a session you can now choose `gpt-6-luna` among the models.

4. Download [the starter folder](media/farm-shop.zip) and unpack it to a
   place where you will find it again, such as *Documents*. On Windows,
   right-click the ZIP file and choose *Extract All*; a double click only
   shows what is inside and unpacks nothing.

> [!EXPECTED]
> A folder `farm-shop` with the files `opencode.jsonc` and `README.md` and
> the folder `tools` with `farm_shop.py` in it.

5. Open the folder in OpenCode: click the folder icon with the plus
   (*Add project*) next to **Projects**, choose `farm-shop` and click
   **New session**. If your computer only knows `python3`, open
   `opencode.jsonc` in an editor first and change `"python"` to `"python3"`
   in the three lines that start the tools.

> [!EXPECTED]
> A new session opens, and below the input field the agent `shop` with
> the model `gpt-6-luna` is selected. The folder sets this up, so you
> choose nothing yourself.

The folder holds two files that matter:

| file | what it does |
|---|---|
| `opencode.jsonc` | sets up two agents: `shop` with its model, a short role and the rules for what it may do, and `coach`, a second agent with a strong model for process 4; it also lists three groups of tools, all of them switched off |
| `tools/farm_shop.py` | the shop's tools: `shop` reads products, stock and sales, `orders` sends an order, `till` reads the self-service till and the cash box and writes the cash book |

The agent `shop` starts naked. The first rule in `opencode.jsonc` takes away
every tool OpenCode brings along, so it can neither read files nor run
commands nor search the web, and the rules after it give back only the shop's
tools and two skills:

```json
"permissions": [
  { "action": "*", "resource": "*", "effect": "deny" },
  { "action": "shop_*", "resource": "*", "effect": "allow" },
  { "action": "till_*", "resource": "*", "effect": "allow" },
  { "action": "orders_*", "resource": "*", "effect": "ask" },
  { "action": "skill", "resource": "weekly-order", "effect": "allow" },
  { "action": "skill", "resource": "daily-closing", "effect": "allow" }
]
```

Start a new session for every step, so that the agent does not remember the
step before.

## Process 1: the weekly order

You lead the agent through the weekly order and ask it the same thing at
every step. The shop's sales are generated from the date, so the quantities
below are those of our test on 24 November; on another day yours differ, but
the pattern stays the same.

1. Ask the naked agent:

   ```text
   Please place this week's order with our suppliers.
   ```

   Note what it does instead of ordering.

> [!EXPECTED]
> The agent cannot see the shop and cannot send anything, so it asks back
> or offers a template. In our test it answered: "Sure, what items and
> quantities should I order, and from which suppliers?" It places no
> order and calls no tool.

2. Give it tools to read the shop. In `opencode.jsonc`, set `"disabled"` to
   `false` for the server `shop` and save the file. OpenCode notices the
   change and starts `python tools/farm_shop.py shop` in the background; if
   the tools do not show up in a new session, close and reopen OpenCode. Ask
   the same question in two new sessions and write down the quantities of
   milk, yoghurt and butter both times.

> [!EXPECTED]
> The agent now calls `shop_products`, `shop_stock` and `shop_sales` and
> shows an order as a table, but it cannot send it, because it has no
> tool for ordering yet. The two sessions disagree. In our test, both
> looked at the sales of only the last week; one wanted 30 bottles of
> milk, 18 jars of yoghurt and 10 packs of butter, the other 36, 18 and
> 20, and the first also ordered eggs, which come from the own farm.

3. Compare your two answers with each other and with your neighbors': which
   weeks did the agent look at, how much stock did it want to keep, and did
   it order anything from the own farm?

> [!EXPECTED]
> The answers differ wherever the agent had to invent a rule: how many
> weeks of sales to look at, how much stock to keep, what to do with
> perishable products and whether the own farm is a supplier. The tools
> give it the shop's data, but nothing tells it how this shop orders.

4. Write down how the shop really orders, as a skill. Create the file
   `.agents/skills/weekly-order/SKILL.md` in the folder with this content:

   ```markdown
   ---
   name: weekly-order
   description: How the Lindenhof farm shop works out its weekly order to the suppliers. Use it whenever an order or restocking is due.
   ---

   # Weekly order

   1. Get the sales of the last four weeks with `sales`: from 28 days ago up to
      and including yesterday. The average per week is the units sold divided
      by 4.
   2. The target stock is the average per week times 1.5. For perishable
      products, with a shelf life of 7 days or less, it is the average times
      1.0, so that nothing spoils. Round the target up to a whole unit.
   3. The need is the target minus the units on the shelf (`stock`). If it is
      zero or less, order nothing.
   4. Round the need up to a whole number of packs (`pack_size` in `products`).
   5. Make one order per supplier. Products from the own farm are never
      ordered.
   6. Show the order as a table per supplier with average, target, stock and
      quantity, and place it only after the owner has agreed.
   ```

   Ask the same question again in two new sessions. Before it calls any of
   the shop's tools, the agent now loads the skill; only its name and its
   description were in its context until then.

> [!EXPECTED]
> In the session you see the agent load the skill `weekly-order` first and
> call the shop's tools after it. Both sessions now give the same table,
> based on four weeks and without the own farm: in our test 36 bottles of
> milk, 30 jars of yoghurt and 20 packs of butter from Meadow Dairy and
> 20 bags of carrots from Green Valley Growers.

5. Let the agent act. Switch on the server `orders` the same way and ask
   again. When the agent has shown its table, answer `yes, place it`.
   OpenCode now stops before every order and asks you, because the rule for
   `orders_*` says `ask`: allow the order to Bee Garden and reject the one to
   Meadow Dairy.

> [!EXPECTED]
> OpenCode asks once per supplier before `orders_place_order` runs. The
> folder `outbox` then holds exactly one file, such as
> `order-2026-11-24-bee-garden.json`, and nothing for Meadow Dairy. The
> agent should tell you that one order was placed and the other was
> rejected; if it reports both as placed, believe the folder, not the
> agent.

6. Turn the process into a command. Create the file
   `.opencode/commands/weekly-order.md`:

   ```markdown
   ---
   description: Work out this week's order and place it after you agree
   agent: shop
   ---

   Work out this week's order with the skill weekly-order, for these suppliers:
   $ARGUMENTS

   If no supplier is named, do it for all of them. Show me the table first and
   place one order per supplier only after I have agreed.
   ```

   In a new session, type `/weekly-order Bee Garden`. OpenCode replaces
   `$ARGUMENTS` with what you typed after the command and sends the whole text
   to the agent.

> [!EXPECTED]
> The agent loads the skill and shows a table for Bee Garden alone, honey
> and jam, and then waits for your agreement before it orders anything.

7. Check the agent's numbers. In a terminal in the folder, run:

   ```text
   python tools/farm_shop.py solution
   ```

   The script works out the order with the rules of the skill, without any
   language model.

> [!EXPECTED]
> The script prints the four weeks it used, a table per supplier with the
> average per week, target, stock and quantity, and below it the daily
> closing of the day. Its quantities match the agent's table from step 4.

## Process 2: the agent writes its own skill

For the second process you write nothing yourself. This is how the owner
describes it:

> Every morning the cash box starts with 100 euros of change. Customers pay
> cash into the box or by card at the self-service till; card payments never
> reach the box. Whoever brings back a glass bottle or jar takes 15 cents of
> deposit out of the box. In the evening I count the box and compare it with
> what should be in it. A difference of up to two euros either way is fine,
> anything more I want to hear about. Then the day goes into the cash book.

1. Switch on the server `till` the same way and ask in a new session:

   ```text
   Please do the daily closing for today.
   ```

   Note what the agent finds out with the tools alone and where it gets
   stuck.

> [!EXPECTED]
> The agent reads the till with `till_register_log` and the cash box with
> `till_cash_count`, but no tool tells it about the 100 euros of change or
> the deposit, so it asks you for both or guesses. In our test
> `gpt-6-luna` asked for them and wrote nothing into the cash book.

2. Let the agent write into two folders. In `opencode.jsonc`, two rules under
   the agent `shop` are switched off with `//`; remove the slashes and put a
   comma after the rule before them:

   ```json
   { "action": "edit", "resource": ".agents/skills/**", "effect": "ask" },
   { "action": "edit", "resource": ".opencode/commands/**", "effect": "ask" }
   ```

   The agent may now write files, but only skills and commands, and only after
   you have allowed each one.

> [!EXPECTED]
> Nothing visible changes until you ask the agent to write. If OpenCode
> reports an error in `opencode.jsonc` when a session starts, a comma is
> missing or one too many.

3. In a new session, paste the owner's description and ask the agent to turn
   it into a skill and a command:

   ```text
   This is how I do the daily closing: <the owner's description>
   Write this down as a skill called daily-closing in
   .agents/skills/daily-closing/SKILL.md, so that you can do it on your own
   from now on, and add a command /daily-closing in
   .opencode/commands/daily-closing.md that takes the day as its argument.
   ```

   OpenCode shows you each file before it is written. Read it before you
   allow it: is everything from the owner's description in it, and does it
   name the tools?

> [!EXPECTED]
> OpenCode asks twice, once for the skill and once for the command. The
> skill should name the tools, the 100 euros of change, the 15 cents per
> bottle or jar, the two euros of tolerance and the entry in the cash
> book. In our test, `gpt-6-luna` wrote this skill on the first attempt:
>
> ```markdown
> ---
> name: daily-closing
> description: Close a day in the Lindenhof farm shop cash book using the till log and cash count.
> ---
>
> # Daily closing
>
> When asked to close a day, use the supplied day in `YYYY-MM-DD` format.
>
> 1. Retrieve that day's till register log and cash-box count using
>    `till_register_log` and `till_cash_count`.
> 2. Calculate deposit refunds as `(returned bottles + returned jars) × €0.15`.
> 3. Calculate expected closing cash as `€100 opening float + cash sales −
>    deposit refunds`. Card sales do not go into the cash box and must not be
>    included. Receipts are informational only.
> 4. Calculate the difference as `counted cash − expected cash`.
> 5. Write the day to the cash book with `till_write_cashbook`, supplying cash
>    sales, card sales, deposit refunds, expected cash, counted cash, and
>    difference in euros. Add a brief note with the returned bottle/jar count
>    and any relevant details.
> 6. If the absolute difference is greater than €2.00, tell the owner the date
>    and amount/direction of the discrepancy. A difference of exactly €2.00, or
>    less, either way is acceptable. Still record every closing in the cash
>    book.
>
> Use euro amounts (including cents) and do not round away cents. If required
> source information is missing or inconsistent, ask the owner rather than
> guessing or recording an invented closing.
> ```
>
> Compared with a skill written by hand, the agent named the tools with
> their full names, wrote the calculation as formulas and added a rule for
> missing data. What it left out was a fixed answer for the owner, and it
> gave its command no `agent:` line, so the command runs with whichever
> agent is selected.

4. In a new session, close last Thursday with the agent's own command, for
   example `/daily-closing 2026-11-19`, and compare the result with
   `python tools/farm_shop.py solution 2026-11-19` and with the row the agent
   wrote into `cashbook.csv`.

> [!EXPECTED]
> For 19 November the till shows 83.10 euros in cash and 30.80 by card,
> and 6 bottles and jars came back, so 0.90 euros of deposit went out.
> The box should hold 100.00 + 83.10 − 0.90 = 182.20 euros but holds
> 177.70, a difference of −4.50 euros, more than the two euros the owner
> accepts, so the agent should point it out. `cashbook.csv` has a new row
> with these numbers. On Thursdays the box always lacks 4.50 euros.

## Process 3: a strong and a small model

So far a strong model has done the work. Now the same agent runs on a small
model that fits on your laptop, and you find out what changes. If your laptop
is too slow for it, work in pairs with someone whose laptop manages it.

1. Install [[lm-studio|LM Studio]] as described on its page, download the
   small model `google/gemma-4-e2b` (about 3 GB), load it and start the local
   server under *Developer*.

> [!EXPECTED]
> LM Studio shows the server as running, and in OpenCode the model
> `lmstudio/google/gemma-4-e2b` appears in the list below the input field.

2. Switch on all three groups of tools, so that the agent has to choose among
   nine tools. Ask each of these questions in a new session and note which
   tool the agent calls first:

   | question | tool you expect |
   |---|---|
   | How many jars of honey are left on the shelf? | |
   | How much cash did the shop take on 2026-11-19? | |
   | How many bottles of milk did we sell from 2026-11-10 to 2026-11-23? | |
   | Is the cash box right for 2026-11-19? Do not write anything yet. | |
   | Order 12 jars of honey from Bee Garden. | |

   Then run `/weekly-order` and `/daily-closing 2026-11-19`.

> [!EXPECTED]
> The tools to expect are `shop_stock`, `till_register_log`, `shop_sales`,
> `till_register_log` together with `till_cash_count`, and
> `orders_place_order`. In our test `gpt-6-luna` chose the right one every
> time. For the cash box it read both tools and then asked for the change
> and the deposit, and it reported the honey order as rejected when we
> rejected it. Both commands gave the same result as the solution.

3. Switch the agent to the small model: in `opencode.jsonc`, change the
   `"model"` of the agent `shop` to `"lmstudio/google/gemma-4-e2b"`, keep LM
   Studio running with the model loaded, and ask the same five questions and
   both commands again, each in a new session.

> [!EXPECTED]
> Expect mistakes, and expect them in different places from run to run.
> In our tests, one run per question, the two small Gemma models did this:
>
> | question | `gemma-4-e4b` | `gemma-4-e2b` |
> |---|---|---|
> | honey on the shelf | asks back instead | `shop_stock` |
> | cash taken on 19 November | `till_register_log` | `till_cash_count`, and reports the counted 177.70 including the change |
> | milk sold | `shop_sales` | `shop_sales` |
> | is the cash box right | `till_cash_count` only | `till_cash_count` only |
> | order 12 jars of honey | `orders_place_order`, reports the order as placed although it was rejected | no tool, answers "I will place an order" |
> | `/weekly-order` | loads the skill, but looks at five weeks, orders too much and orders jam | does not load the skill and calls `orders_place_order` at once with an empty list |
> | `/daily-closing 2026-11-19` | correct | correct |

4. Compare the two models question by question: where did the small model
   choose the wrong tool, call no tool at all, or break a rule of the skill?
   Check its numbers against `python tools/farm_shop.py solution`.

> [!EXPECTED]
> The small models mostly call a tool that fits the words of the question,
> but not always the one that answers it. The short skill for the daily
> closing is enough for them, while the weekly order, with its four rules
> and its rounding, is too much. Most worth remembering is the order that
> was never placed: an agent's answer is not a receipt, and only the folder
> `outbox` shows what was really ordered.

## Process 4: a strong model prepares the small one

The small model needs more exact instructions than the strong one. Writing
them is work that a strong model does well, so you let one do it.

1. Switch to the agent `coach` with the Tab key or below the input field. It
   runs on `gpt-6-luna`, may read every file in the folder and may rewrite
   skills and commands, but it cannot run anything and asks before every
   change. Tell it what you saw in process 3, for example:

   ```text
   The agent shop is going to run on a small local model, gemma-4-e2b,
   instead of gpt-6-luna. With the same skills and commands, the small model
   made mistakes: <what you saw>. Rework both skills and both commands so that
   a small model can follow them step by step. Keep the shop's rules exactly
   as they are, but say for every step which tool to call with which
   arguments, and leave nothing to judgment that can be stated precisely.
   ```

   Read every change before you allow it.

> [!EXPECTED]
> The coach reads the skills, the commands, `opencode.jsonc` and the
> tools, and then asks you once for each file it wants to change. In our
> test it rewrote both skills and both commands in one go: it named every
> tool call with its arguments, wrote the calculations as formulas with
> rounding up, stated that yoghurt with its 14 days uses the factor 1.5,
> excluded the own farm explicitly and gave the answer a fixed form of
> three lines.

2. Switch back to `shop`, which still runs on the small model, and repeat the
   five questions and both commands in new sessions.

> [!EXPECTED]
> Some mistakes are gone and others are not. In our test, one run per
> task:
>
> | task | `gemma-4-e4b` before | after | `gemma-4-e2b` before | after |
> |---|---|---|---|---|
> | `/weekly-order` | five weeks, 6 of 9 quantities wrong | four weeks, own farm left out, 8 of 9 right (yoghurt 36 instead of 30) | no table, empty order | all 9 quantities right, but lists eggs and potatoes from the own farm |
> | `/daily-closing 2026-11-19` | correct | correct | correct | expects 182.10 instead of 182.20 and does not write the cash book |
> | honey on the shelf | asks back | `shop_stock` | `shop_stock` | `shop_stock` |
> | cash taken | `till_register_log` | `till_register_log` | `till_cash_count` | `till_cash_count` |
> | milk sold | `shop_sales` | answers that it has no access | `shop_sales` | `shop_sales` |
> | is the cash box right | count only | count only | count only | count only |
> | order 12 jars of honey | reports the order as placed | reports the order as placed | no tool | reports the rejection |

3. Put the old and the new skill side by side: what did the coach make more
   exact, and which of the small model's mistakes are gone?

> [!EXPECTED]
> The coach fixed what it had been told about: the weekly order, the
> failure described to it, went from unusable to nearly right. What
> nobody had told it about stayed as it was, such as checking the cash
> box with only one of the two tools, and a few things got worse, such as
> the daily closing on `gemma-4-e2b`, which the longer skill now leads
> astray. Small models also vary from run to run, so one good run is not
> yet a test. Report every mistake you see to the coach, run each task
> several times, and move the steps that keep going wrong, such as
> arithmetic, out of the skill and into a tool (extension 1).

Instead of the agent `coach` you can use any strong agent on the folder, such
as Claude Code: open it in the folder and give it the same request. It can
read everything in the folder and asks before it changes a file.

## Extensions

1. **A rule as code.** Ask yourself which step of the weekly order the small
   model still gets wrong most easily, and add a tool to `tools/farm_shop.py`
   that does exactly this step, such as the rounding to whole packs. Then
   rerun `/weekly-order` on the small model.
2. **Too much freedom.** Change the rule for `orders_*` from `ask` to
   `allow` and run `/weekly-order` once more. Then change it to `deny` and
   watch what the agent does with an order it cannot send.

> [!EXPECTED]
> With `allow`, OpenCode no longer asks, and the orders land in `outbox`
> as soon as the agent decides to send them, even if the skill says to
> wait for the owner. With `deny`, the tool disappears from the agent's
> context, so it can only show the table and tell you that it cannot
> order.

3. **A third process.** Think of a third job in the shop, such as answering
   customers' questions about opening hours and products, and let the agent
   write the skill and the command for it.

## Reflection

- What did the naked agent do with a task it could not carry out, and what
  would you have preferred?
- Why did the answers differ at the step with tools alone, although the
  agent read exactly the same data?
- What does a skill hold that no tool can give the agent, and why does the
  agent see only its name and description until it loads it?
- Who decides when a command runs, and who decides when a skill is loaded?
- What would you check in a skill that an agent wrote by itself before you let
  it run every evening?
- Why does a small model need instructions that a strong model can do without,
  and what does that cost the person who writes them?
- Which of the shop's tools should always ask before they act, and which may
  run freely?

The parts you added here, tools that act in the world, instructions that the
agent loads when it needs them and commands that start a whole process, are
what turns a language model into an agent; [[ai-agents]] describes the loop
that holds them together.

![Quiz: Tools, skills and commands](item:tools-skills-commands-quiz)
