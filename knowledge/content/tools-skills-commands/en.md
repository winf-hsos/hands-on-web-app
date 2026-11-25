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
  see_also: [ai-agents, be-the-agent]
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

## What you need

- [OpenCode](https://opencode.ai), the agent in a terminal or as a desktop
  app, free for Windows, macOS and Linux.
- Python 3, without any extra packages.
- A strong language model that can call tools. The folder is set up for
  OpenAI's `gpt-6-luna`, which needs an OpenAI account connected in OpenCode.
- For processes 3 and 4, [LM Studio](https://lmstudio.ai) with the small model
  `google/gemma-4-e2b` (about 3 GB), which runs on most laptops. In LM Studio,
  download the model, load it and start the local server under *Developer*;
  OpenCode then finds it as `lmstudio/google/gemma-4-e2b`. If your laptop is
  too slow, work in pairs with someone whose laptop manages it.
- [The starter folder](media/farm-shop.zip), unzipped to a place of your
  choice.

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

Open the folder in OpenCode: in a terminal, change into it and type
`opencode`, or open it as a project in the desktop app. The agent `shop` is
already selected. Start a new session for every step, so that the agent does
not remember the step before.

## Process 1: the weekly order

You lead the agent through the weekly order and ask it the same thing at
every step.

1. Ask the naked agent:

   ```text
   Please place this week's order with our suppliers.
   ```

   Note what it does instead of ordering.

2. Give it tools to read the shop. In `opencode.jsonc`, set `"disabled"` to
   `false` for the server `shop` and save the file. OpenCode notices the
   change and starts `python tools/farm_shop.py shop` in the background; if
   the tools do not show up in a new session, restart OpenCode. Ask the same
   question in two new sessions and write down the quantities of milk,
   yoghurt and butter both times.

3. Compare your two answers with each other and with your neighbors': which
   weeks did the agent look at, how much stock did it want to keep, and did
   it order anything from the own farm?

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

5. Let the agent act. Switch on the server `orders` the same way and ask
   again. When the agent has shown its table, answer `yes, place it`.
   OpenCode now stops before every order and asks you, because the rule for
   `orders_*` says `ask`: allow the order to Bee Garden and reject the one to
   Meadow Dairy. The orders you allowed lie in the folder `outbox`.

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

7. Check the agent's numbers. In a terminal in the folder, run:

   ```text
   python tools/farm_shop.py solution
   ```

   The script works out the order with the rules of the skill, without any
   language model.

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

2. Let the agent write into two folders. In `opencode.jsonc`, two rules under
   the agent `shop` are switched off with `//`; remove the slashes and put a
   comma after the rule before them:

   ```json
   { "action": "edit", "resource": ".agents/skills/**", "effect": "ask" },
   { "action": "edit", "resource": ".opencode/commands/**", "effect": "ask" }
   ```

   The agent may now write files, but only skills and commands, and only after
   you have allowed each one.

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

4. In a new session, close last Thursday with the agent's own command, for
   example `/daily-closing 2026-11-19`, and compare the result with
   `python tools/farm_shop.py solution 2026-11-19` and with the row the agent
   wrote into `cashbook.csv`.

> [!SOLUTION]
> In our test, `gpt-6-luna` wrote this skill on the first attempt:
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
> With its own command it closed Thursday, 19 November correctly: 100.00 plus
> 83.10 cash minus 0.90 deposit gives 182.20, the box held 177.70, and it
> reported the difference of −4.50. Compared with a skill written by hand, the
> agent named the tools with their full names, wrote the calculation as
> formulas and added a rule for missing data; what it left out was a fixed
> answer for the owner, and it gave its command no `agent:` line, so the command
> runs with whichever agent is selected.
>
> Without the skill, `gpt-6-luna` reads the till and the cash box and then asks
> for the change and the deposit, because no tool tells it either. On
> Thursdays the box always lacks 4.50 euros.

## Process 3: a strong and a small model

So far a strong model has done the work. Now the same agent runs on a small
model that fits on your laptop, and you find out what changes.

1. Switch on all three groups of tools, so that the agent has to choose among
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

2. Switch the agent to the small model: in `opencode.jsonc`, change the
   `"model"` of the agent `shop` to `"lmstudio/google/gemma-4-e2b"`, keep LM
   Studio running with the model loaded, and ask the same five questions and
   both commands again, each in a new session.

3. Compare the two models question by question: where did the small model
   choose the wrong tool, call no tool at all, or break a rule of the skill?
   Check its numbers against `python tools/farm_shop.py solution`.

> [!SOLUTION]
> The tools to expect are `shop_stock`, `till_register_log`, `shop_sales`,
> `till_register_log` together with `till_cash_count`, and
> `orders_place_order`. In our tests, one run per question, the models did
> this:
>
> | question | `gpt-6-luna` | `gemma-4-e4b` | `gemma-4-e2b` |
> |---|---|---|---|
> | honey on the shelf | `shop_stock` | asks back instead | `shop_stock` |
> | cash taken on 19 November | `till_register_log` | `till_register_log` | `till_cash_count`, and reports the counted 177.70 including the change |
> | milk sold | `shop_sales` | `shop_sales` | `shop_sales` |
> | is the cash box right | both till tools, then asks for the change and the deposit | `till_cash_count` only | `till_cash_count` only |
> | order 12 jars of honey | `orders_place_order`, reports the rejection | `orders_place_order`, reports the order as placed although it was rejected | no tool, answers "I will place an order" |
> | `/weekly-order` | exactly the solution | loads the skill, but looks at five weeks, orders too much and orders jam | does not load the skill and calls `orders_place_order` at once with an empty list |
> | `/daily-closing 2026-11-19` | correct, note "check" | correct | correct |
>
> The strong model chose the right tool every time. The small ones mostly
> called a tool that fits the words of the question, but not always the one
> that answers it, and they failed at different places, so a second run may go
> wrong somewhere else. The short skill for the daily closing was enough for
> all three, while the weekly order, with its four rules and its rounding,
> was too much for the small models. Most worth remembering is the order that
> was never placed: an agent's answer is not a receipt, and only the folder
> `outbox` shows what was really ordered.

## Process 4: a strong model prepares the small one

The small model needs more exact instructions than the strong one. Writing
them is work that a strong model does well, so you let one do it.

1. Switch to the agent `coach` with the Tab key. It runs on `gpt-6-luna`, may
   read every file in the folder and may rewrite skills and commands, but it
   cannot run anything and asks before every change. Tell it what you saw in
   process 3, for example:

   ```text
   The agent shop is going to run on a small local model, gemma-4-e2b,
   instead of gpt-6-luna. With the same skills and commands, the small model
   made mistakes: <what you saw>. Rework both skills and both commands so that
   a small model can follow them step by step. Keep the shop's rules exactly
   as they are, but say for every step which tool to call with which
   arguments, and leave nothing to judgment that can be stated precisely.
   ```

   Read every change before you allow it.

2. Switch back to `shop`, which still runs on the small model, and repeat the
   five questions and both commands in new sessions.

3. Put the old and the new skill side by side: what did the coach make more
   exact, and which of the small model's mistakes are gone?

Instead of the agent `coach` you can use any strong agent on the folder, such
as Claude Code: open it in the folder and give it the same request. It can
read everything in the folder and asks before it changes a file.

> [!SOLUTION]
> In our test, the coach rewrote both skills and both commands in one go. It
> named every tool call with its arguments as JSON, wrote the calculations as
> formulas with rounding up, stated that yoghurt with its 14 days uses the
> factor 1.5, excluded the shop's own farm explicitly, widened the skill's
> description so that it also covers questions about the stock, and gave the
> answer a fixed form of three lines. With these files, one run per task, the
> small models did this:
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
>
> The coach fixed what it had been told about: the weekly order, which was
> the failure we described to it, went from unusable to nearly right on both
> models. What nobody had told it about stayed as it was, such as checking
> the cash box with only one of the two tools, and a few things even got
> worse, such as the daily closing on `gemma-4-e2b`, which the longer skill
> now leads astray. Small models also vary from run to run, so one good run
> is not yet a test. Two lessons follow: report every mistake you see to the
> coach and run each task several times, and move the steps that keep going
> wrong, such as arithmetic, out of the skill and into a tool (extension 1).

## Extensions

1. **A rule as code.** Ask yourself which step of the weekly order the small
   model still gets wrong most easily, and add a tool to `tools/farm_shop.py`
   that does exactly this step, such as the rounding to whole packs. Then
   rerun `/weekly-order` on the small model.
2. **Too much freedom.** Change the rule for `orders_*` from `ask` to
   `allow` and run `/weekly-order` once more. Then change it to `deny` and
   watch what the agent does with an order it cannot send.
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
