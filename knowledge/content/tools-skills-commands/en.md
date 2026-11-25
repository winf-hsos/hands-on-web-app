---
type: experiment
code: 7292
title: Tools, skills and commands
summary: >-
  You give the agent of a small farm shop a task it cannot do, then build its
  tools, skills and commands one at a time, let the agent write a skill
  itself, and find out how much more exact the instructions have to be for a
  small model.
objectives:
  intro: "In this experiment you equip an agent step by step for two processes of an invented farm shop, and afterwards you can:"
  goals:
    - "explain why an agent without tools can only ask back or guess"
    - "tell a tool, a skill and a command apart by what each one adds: access to the world, knowledge of how the work is done, and a short way for a person to start it"
    - "write a tool as a Python function, offer it to OpenCode through an MCP server and decide whether it has to ask before it acts"
    - "write a skill and a command for a process, and have an agent write them from a description in plain words"
    - "compare how a cloud model and a small model on your laptop choose their tools, and explain why a small model needs more exact instructions"
    - "use a frontier model to rewrite skills and commands for a small model"
level: 2
duration: 150
topics: [ai-agents]
relations:
  see_also: [ai-agents, be-the-agent, opencode]
modules: [aai]
areas: [ai]
status: published
updated: 2026-11-25
---

Farmer Jeff runs the Lindenhof farm shop, a small self-service shop on his
farm: he stocks the shelves, the customers weigh, pay and take their goods
themselves, and two jobs come back again and again. Every week someone has to
work out what to order from the suppliers, and every evening someone has to
count the cash box and write the day into the cash book. An
[[ai-agents|AI agent]] could do both, but only once it has what it needs:
tools that reach the shop's data, a skill that says how this shop does the
job, and a command with which a person starts the job in one line. In this
experiment you build these things one at a time and watch what each of them
changes. Then you let the agent write a skill by itself, move it to a small
model that runs on your own computer, and use a frontier model to prepare the
instructions so that the small one can follow them.

The shop, its products and its numbers are invented for the experiment. The
sales are generated from the date, so everyone who asks on the same day gets
the same numbers and you can compare your results with your neighbors'.

You start with an almost empty folder and add every file yourself. Each file
is on this page to copy, or to save with the button above its box, and each
change to the configuration comes with the whole file as it should look
afterwards. After each process you can download the complete folder in its
state at that point, so that a mistake in one process does not hold you up in
the next.

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
   described in [[python-on-the-command-line]]. The shop's tools are small
   Python programs that need no extra packages.

> [!EXPECTED]
> The terminal shows a version such as `Python 3.13.1`. If only
> `python3 --version` works, as on some Macs, write `python3` instead of
> `python` wherever `opencode.jsonc` starts a tool.

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
> the folder `tools`, which holds `lindenhof.py` and `mcp_lite.py`.

5. Open the folder in OpenCode: click the folder icon with the plus
   (*Add project*) next to **Projects**, choose `farm-shop` and click
   **New session**.

> [!EXPECTED]
> A new session opens, and below the input field the agent `shop` with
> the model `gpt-6-luna` is selected. The folder sets this up, so you
> choose nothing yourself.

The folder holds three files that matter:

| file | what it does |
|---|---|
| `opencode.jsonc` | sets up the agent `shop` with its model, a role in one sentence and the rules for what it may do; it has no tools yet |
| `tools/lindenhof.py` | stands in for the shop's database and its till: products, stock, sales and the cash box; you don't need to read it |
| `tools/mcp_lite.py` | a small MCP server that offers your Python functions to OpenCode as tools, without anything to install |

The agent `shop` starts naked. Its only rule takes away every tool OpenCode
brings along, so it can neither read files nor run commands nor search the
web:

```json
"permissions": [
  { "action": "*", "resource": "*", "effect": "deny" }
]
```

Every tool, skill and right the agent gets from here on is a rule that you add
below this one, and the last rule that matches decides. Start a new session
for every step, so that the agent does not remember the step before.

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

2. Give the agent tools to read the shop. A tool is a Python function: its
   name becomes the tool's name, its parameters become what the agent has to
   fill in, and the text in quotes below the first line becomes the
   description, the only thing the model reads about the tool. Create the file
   `tools/shop.py` with three tools:

   ```python static file=shop.py
   """The tools of the group shop: they read the products, the stock and the sales."""

   from mcp_lite import FastMCP
   import lindenhof

   mcp = FastMCP("shop")


   @mcp.tool()
   def products() -> list:
       """All products of the Lindenhof farm shop: id, name, unit, price, supplier, pack size and shelf life."""
       return lindenhof.products()


   @mcp.tool()
   def stock() -> dict:
       """How many units of each product are on the shelf right now."""
       return lindenhof.stock()


   @mcp.tool()
   def sales(from_date: str, to_date: str) -> dict:
       """Units sold of each product between two dates (YYYY-MM-DD), both included."""
       return lindenhof.sales(from_date, to_date)


   mcp.run()
   ```

   `FastMCP("shop")` makes the file an MCP server named `shop`,
   `@mcp.tool()` marks each function below it as a tool, and `mcp.run()`
   waits for OpenCode to call one. Then tell OpenCode to start the server and
   let the agent use it. In `opencode.jsonc`, put the server between the
   braces after `"servers":`

   ```json
   "shop": {
     "type": "local",
     "command": ["python", "tools/shop.py"],
     "codemode": false
   }
   ```

   and add a rule after the first one under `"permissions"`, with a comma
   after the line before it:

   ```json
   { "action": "shop_*", "resource": "*", "effect": "allow" }
   ```

   OpenCode puts the server's name in front of each tool, so the tools are
   called `shop_products`, `shop_stock` and `shop_sales`, and the rule allows
   all three. The whole file after this step:
   [opencode.jsonc](media/steps/1-2/opencode.jsonc). Save the file, start a
   new session, ask the same question as in step 1 and write down the
   quantities of milk, yoghurt and butter. Do this twice, each time in a new
   session.

> [!EXPECTED]
> The agent now calls `shop_products`, `shop_stock` and `shop_sales` and
> shows an order as a table, but it cannot send it, because it has no
> tool for ordering yet. If no tool is called, close and reopen OpenCode,
> and check `opencode.jsonc` for a missing or extra comma. The two
> sessions disagree. In our test, both looked at the sales of only the
> last week; one wanted 30 bottles of milk, 18 jars of yoghurt and 10
> packs of butter, the other 36, 18 and 20, and the first also ordered
> eggs, which come from the own farm.

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

   ```markdown file=SKILL.md
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

   The first rule forbids loading skills, too, so add a rule that allows this
   one ([opencode.jsonc](media/steps/1-4/opencode.jsonc) after this step):

   ```json
   { "action": "skill", "resource": "weekly-order", "effect": "allow" }
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

5. Let the agent act. Create the file `tools/orders.py` with the tool that
   sends an order:

   ```python static file=orders.py
   """The tool of the group orders: it sends an order to a supplier."""

   from mcp_lite import FastMCP
   import lindenhof

   mcp = FastMCP("orders")


   @mcp.tool()
   def place_order(supplier: str, items: list[dict]) -> dict:
       """Send an order to one supplier. Items are product ids with a whole number of units, such as [{"product": "honey", "quantity": 12}]."""
       return lindenhof.place_order(supplier, items)


   mcp.run()
   ```

   Add the server `orders` next to `shop` the same way, with
   `"command": ["python", "tools/orders.py"]`, and a rule that makes the agent
   ask before every order, because an order costs money and cannot be taken
   back ([opencode.jsonc](media/steps/1-5/opencode.jsonc) after this step):

   ```json
   { "action": "orders_*", "resource": "*", "effect": "ask" }
   ```

   Ask again in a new session. When the agent has shown its table, answer
   `yes, place it`. OpenCode now stops before every order and asks you: allow
   the order to Bee Garden and reject the one to Meadow Dairy.

> [!EXPECTED]
> OpenCode asks once per supplier before `orders_place_order` runs. The
> folder `outbox` then holds exactly one file, such as
> `order-2026-11-24-bee-garden.json`, and nothing for Meadow Dairy. The
> agent should tell you that one order was placed and the other was
> rejected; if it reports both as placed, believe the folder, not the
> agent.

6. Turn the process into a command. Create the file
   `.opencode/commands/weekly-order.md`:

   ```markdown file=weekly-order.md
   ---
   description: Work out this week's order and place it once the owner has agreed
   agent: shop
   ---

   Work out this week's order with the skill weekly-order, for these suppliers:
   $ARGUMENTS

   If no supplier is named, do it for all of them. Show me the table first and
   place one order per supplier only after I have agreed.
   ```

   The description is what you see in OpenCode's list of commands, and the
   text below the line is the prompt the agent gets. In a new session, type
   `/weekly-order Bee Garden`. OpenCode replaces `$ARGUMENTS` with what you
   typed after the command and sends the whole text to the agent. A command
   needs no rule, because only you can start it.

> [!EXPECTED]
> The agent loads the skill and shows a table for Bee Garden alone, honey
> and jam, and then waits for your agreement before it orders anything.

7. Check the agent's numbers. In a terminal in the folder, run:

   ```text
   python tools/lindenhof.py
   ```

   The script works out the order with the rules of the skill, without any
   language model.

> [!EXPECTED]
> The script prints the four weeks it used, a table per supplier with the
> average per week, target, stock and quantity, and below it the daily
> closing of the day. Its quantities match the agent's table from step 4.

The folder after process 1:
[farm-shop-after-process-1.zip](media/farm-shop-after-process-1.zip).

## Process 2: the agent writes its own skill

For the second process you write no skill yourself. This is how Jeff
describes it:

> Every morning the cash box starts with 100 euros of change. Customers pay
> cash into the box or by card at the self-service till; card payments never
> reach the box. Whoever brings back a glass bottle or jar takes 15 cents of
> deposit out of the box. In the evening I count the box and compare it with
> what should be in it. A difference of up to two euros either way is fine,
> anything more I want to hear about. Then the day goes into the cash book.

1. Give the agent the tools of the till. Create the file `tools/till.py`:

   ```python static file=till.py
   """The tools of the group till: they read the self-service till and the cash box and write the cash book."""

   from mcp_lite import FastMCP
   import lindenhof

   mcp = FastMCP("till")


   @mcp.tool()
   def register_log(date: str) -> dict:
       """What the self-service till recorded on one day (YYYY-MM-DD): receipts, cash and card sales, and how many deposit bottles and jars were returned."""
       return lindenhof.register_log(date)


   @mcp.tool()
   def cash_count(date: str) -> dict:
       """The cash counted in the cash box at the end of one day (YYYY-MM-DD)."""
       return lindenhof.cash_count(date)


   @mcp.tool()
   def write_cashbook(date: str, cash_sales_eur: float, card_sales_eur: float, deposit_refunds_eur: float,
                      expected_cash_eur: float, counted_cash_eur: float, difference_eur: float, note: str) -> dict:
       """Add the closing of one day (YYYY-MM-DD) to the cash book, with all amounts in euros and a short note."""
       return lindenhof.write_cashbook(date, cash_sales_eur, card_sales_eur, deposit_refunds_eur,
                                       expected_cash_eur, counted_cash_eur, difference_eur, note)


   mcp.run()
   ```

   Add the server `till` with `"command": ["python", "tools/till.py"]` and
   the rule `{ "action": "till_*", "resource": "*", "effect": "allow" }`
   ([opencode.jsonc](media/steps/2-1/opencode.jsonc) after this step). Then
   ask in a new session:

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

2. Let the agent write into two folders. Add three rules under the agent
   `shop` ([opencode.jsonc](media/steps/2-2/opencode.jsonc) after this step):

   ```json
   { "action": "skill", "resource": "daily-closing", "effect": "allow" },
   { "action": "edit", "resource": ".agents/skills/**", "effect": "ask" },
   { "action": "edit", "resource": ".opencode/commands/**", "effect": "ask" }
   ```

   The first one allows the skill the agent is about to write. The other two
   give it a tool to write files, but only skills and commands, and only after
   you have allowed each file. The cash book, the tools and its own
   configuration stay out of its reach; otherwise it could widen its own
   rights.

> [!EXPECTED]
> Nothing visible changes until you ask the agent to write. If OpenCode
> reports an error in `opencode.jsonc` when a session starts, a comma is
> missing or one too many.

3. In a new session, paste Jeff's description and ask the agent to turn it
   into a skill and a command:

   ```text
   This is how I do the daily closing: <Jeff's description>
   Write this down as a skill called daily-closing in
   .agents/skills/daily-closing/SKILL.md, so that you can do it on your own
   from now on, and add a command /daily-closing in
   .opencode/commands/daily-closing.md that takes the day as its argument.
   ```

   OpenCode shows you each file before it is written. Read it before you
   allow it: does it start with a header with `name` and `description`, like
   your skill `weekly-order`, is everything from Jeff's description in it,
   and does it name the tools? If something is missing, tell the agent in the
   same session and let it fix the file.

> [!EXPECTED]
> OpenCode asks twice, once for the skill and once for the command. The
> result differs from run to run. In one of our tests, `gpt-6-luna`
> wrote a complete skill with its header on the first attempt. In
> another, it left out the header of both files, so the agent never
> learned what its new skill was for: with `/daily-closing 2026-11-19` it
> read the till and the cash box and then asked for the change and the
> deposit, as in step 1. We told it in a new session:
>
> ```text
> The skill daily-closing and the command /daily-closing do not work.
> Compare both files with the skill weekly-order and the command
> weekly-order in this folder and fix them.
> ```
>
> It added the headers, and the closing worked. This is the skill after
> the fix:
>
> ```markdown
> ---
> name: daily-closing
> description: Close the Lindenhof farm shop for one day, reconcile the till, and record the closing in the cash book.
> ---
>
> # Daily closing
>
> Use this workflow to close the Lindenhof farm shop for one day.
>
> ## Rules
>
> - The cash box starts each morning with **€100.00** in change.
> - Cash sales go into the box; card sales do not.
> - Each returned deposit bottle or jar is refunded from the box at **€0.15 per item**.
> - Expected closing cash = €100.00 + cash sales − deposit refunds.
> - Difference = counted cash − expected closing cash. A difference within **±€2.00**, inclusive, is acceptable. Report a difference greater than €2.00 in either direction.
> - Record every closing in the cash book, including acceptable differences.
>
> ## Procedure
>
> 1. Get the day's till register log and the counted cash amount for the same date. If either is unavailable, ask the owner rather than inventing figures.
> 2. From the register log, use the recorded cash sales and card sales. Calculate deposit refunds as the total returned bottles and jars multiplied by €0.15. Use the till's recorded return counts; do not treat card sales as cash in the box.
> 3. Calculate expected cash and the difference using the rules above. Keep euro amounts to cents.
> 4. Write the closing to the cash book with the date, cash sales, card sales, deposit refunds, expected cash, counted cash, difference, and a short note. Mention whether the difference is within tolerance; if it exceeds €2.00 in either direction, clearly flag it for the owner.
> 5. Briefly report the closing figures and whether the difference needs attention. Do not alter or omit a closing because of a discrepancy.
> ```
>
> Compared with the skill you wrote by hand, the agent wrote the
> calculation as formulas and added a rule for missing data, but it named
> none of the tools, and its command has no `agent:` line, so the command
> runs with whichever agent is selected. Our two files after the fix:
> [SKILL.md](media/steps/2-3/SKILL.md) and
> [daily-closing.md](media/steps/2-3/daily-closing.md).

4. In a new session, close last Thursday with the agent's own command, for
   example `/daily-closing 2026-11-19`, and compare the result with
   `python tools/lindenhof.py 2026-11-19` and with the row the agent wrote
   into `cashbook.csv`.

> [!EXPECTED]
> For 19 November the till shows 83.10 euros in cash and 30.80 by card,
> and 6 bottles and jars came back, so 0.90 euros of deposit went out.
> The box should hold 100.00 + 83.10 − 0.90 = 182.20 euros but holds
> 177.70, a difference of −4.50 euros, more than the two euros Jeff
> accepts, so the agent should point it out. `cashbook.csv` has a new row
> with these numbers. On Thursdays the box always lacks 4.50 euros.

5. *Optional:* a report to check. An answer in the chat is gone with the
   session, while Jeff wants a page that shows every step of the closing.
   Install [Typst](https://typst.app), a program that turns a text file into
   a PDF: on Windows type `winget install --id Typst.Typst` in a terminal, on
   a Mac `brew install typst`, and check with `typst --version`. Then let the
   agent write reports and run exactly one command, `typst compile`, for files
   in the folder `reports` ([opencode.jsonc](media/steps/2-5/opencode.jsonc)
   after this step):

   ```json
   { "action": "edit", "resource": "reports/**", "effect": "allow" },
   { "action": "shell", "resource": "typst compile reports/*", "effect": "allow" }
   ```

   In a new session, ask the agent to extend its skill, then run
   `/daily-closing 2026-11-19` again in another new session:

   ```text
   Extend the skill daily-closing: after the closing, write a clear one-page
   report of the day as reports/closing-<date>.typ in Typst, with every step
   and every intermediate result, so that I can check the closing, and turn
   it into a PDF with typst compile.
   ```

> [!EXPECTED]
> The skill gets a new section on the report, and after the closing the
> folder `reports` holds `closing-2026-11-19.typ` and
> `closing-2026-11-19.pdf`, a page with the till's figures, the deposit,
> the expected cash, the difference and the entry in the cash book. In
> our test the agent then tried to check the PDF with other commands,
> and OpenCode refused each one, because only `typst compile` is allowed.
> Our extended skill: [SKILL.md](media/steps/2-5/SKILL.md).

The folder after process 2, without the optional step:
[farm-shop-after-process-2.zip](media/farm-shop-after-process-2.zip).

## Process 3: a cloud model and a small model

So far a model in the cloud has done the work. `gpt-6-luna` is one of
OpenAI's smaller models, but it is still far larger than a model that fits on
a laptop. Now the same agent runs on such a small model, and you find out what
changes. If your laptop is too slow for it, work in pairs with someone whose
laptop manages it.

1. Install [[lm-studio|LM Studio]] as described on its page and download the
   small model `google/gemma-4-e2b` (about 4.4 GB) under *Model Search*.
   Then open **Model Server** in the bar on the left, switch *Status* to
   *Running* and load the model with **+ Load Model**.

> [!EXPECTED]
> The page *Model Server* shows *Status: Running*, the address
> `http://127.0.0.1:1234` and, under *Loaded Models*, `google/gemma-4-e2b`
> marked *READY*. In OpenCode, the model `lmstudio/google/gemma-4-e2b` now
> appears in the list below the input field.

2. The agent now has all three groups of tools, so it has to choose among
   the shop's seven tools. Ask each of these questions in a new session,
   still with `gpt-6-luna`, and note which tool the agent calls first:

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
> time. For the cash box it loaded the skill `daily-closing` and found
> the −4.50 euros without writing anything, it reported the honey order
> as rejected when we rejected it, and both commands gave the same result
> as `python tools/lindenhof.py`.

3. Switch the agent to the small model: in `opencode.jsonc`, change the
   `"model"` of the agent `shop` to `"lmstudio/google/gemma-4-e2b"`
   ([opencode.jsonc](media/steps/3-3/opencode.jsonc) after this step), keep
   LM Studio running with the model loaded, and ask the same five questions
   and both commands again, each in a new session.

> [!EXPECTED]
> In our test we ran `gemma-4-e2b` and, for comparison, the somewhat larger
> `gemma-4-e4b`. Both chose `shop_stock` and `shop_sales` correctly, but for
> the cash taken on 19 November they called `till_cash_count` and reported
> the 177.70 euros counted in the box instead of the 83.10 euros of cash
> sales. For the cash box neither loaded the skill `daily-closing`; both read
> only the count and gave no verdict. Asked to order honey, `gemma-4-e2b`
> reported the rejection, while `gemma-4-e4b` claimed that the order had been
> placed, although the folder `outbox` stayed empty. With `/weekly-order`,
> `gemma-4-e2b` came to the right quantities but tried to send a single order
> with all products to Meadow Dairy before anyone had agreed, and
> `gemma-4-e4b` never called `shop_stock`, invented the stock and proposed 72
> eggs from the own farm. With `/daily-closing 2026-11-19`, `gemma-4-e2b`
> found the −4.50 euros, while `gemma-4-e4b` expected 183.20 instead of 182.20
> euros and wrote a difference of −5.50 euros into the cash book. Your results
> may differ, because small models vary a lot from run to run.

4. Compare the two models question by question: where did the small model
   choose the wrong tool, call no tool at all, or break a rule of the skill?
   Check its numbers against `python tools/lindenhof.py`.

> [!EXPECTED]
> The small models fail where the cloud model fills a gap by itself: they
> choose a tool by a word in its name, do not connect a question to the
> description of a skill, skip or miscalculate a step of the skill, and report
> what they meant to do instead of what the tool returned. The commands help,
> because they name the skill, but the skill itself leaves too much open for
> a small model. Two safeguards held throughout: the rule `ask` stopped every
> order, and the files in `outbox` and `cashbook.csv` showed what had really
> happened.

The folder after process 3:
[farm-shop-after-process-3.zip](media/farm-shop-after-process-3.zip).

## Process 4: a frontier model prepares the small one

The small model needs more exact instructions than the cloud model. Writing
them is work that a frontier model, one of the largest models a provider
offers, does well, so you let one do it.

1. Add a second agent, `coach`, to `opencode.jsonc`: after the closing brace
   of the agent `shop`, put a comma and this block
   ([opencode.jsonc](media/steps/4-1/opencode.jsonc) after this step):

   ```json
   "coach": {
     "description": "Prepares the shop agent for a smaller model",
     "mode": "primary",
     "model": "openai/gpt-6.2-sol",
     "system": "You help the owner of the Lindenhof farm shop to prepare the agent \"shop\" in this folder for a smaller language model. Its role and rules are in opencode.jsonc, its tools in tools/shop.py, tools/orders.py and tools/till.py, its skills in .agents/skills and its commands in .opencode/commands.",
     "permissions": [
       { "action": "*", "resource": "*", "effect": "deny" },
       { "action": "read", "resource": "*", "effect": "allow" },
       { "action": "glob", "resource": "*", "effect": "allow" },
       { "action": "grep", "resource": "*", "effect": "allow" },
       { "action": "list", "resource": "*", "effect": "allow" },
       { "action": "edit", "resource": ".agents/skills/**", "effect": "ask" },
       { "action": "edit", "resource": ".opencode/commands/**", "effect": "ask" }
     ]
   }
   ```

   The coach runs on `gpt-6.2-sol`, may read every file in the folder and may
   rewrite skills and commands, but it cannot run anything and asks before
   every change. Switch to it with the Tab key or below the input field and
   tell it what you saw in process 3, for example:

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
> In our test the coach read the configuration, the three tool files, both
> skills and both commands, and then rewrote all four files in about a minute.
> Every step now names the tool with its arguments, the stock has to come from
> `shop_stock`, and the order goes out only after an explicit approval in a
> later message, once per supplier. The daily closing calculates in whole
> cents and checks its result against the values of the tools. The
> description of `daily-closing` now also names the questions about the cash
> taken and about the cash box, so that a small model loads the skill there.
> The shop's rules stayed the same. Our coach's files:
> [weekly-order/SKILL.md](media/steps/4-2/weekly-order/SKILL.md),
> [daily-closing/SKILL.md](media/steps/4-2/daily-closing/SKILL.md),
> [weekly-order.md](media/steps/4-2/weekly-order.md) and
> [daily-closing.md](media/steps/4-2/daily-closing.md).

2. Switch back to `shop`, which still runs on the small model, and repeat the
   five questions and both commands in new sessions.

> [!EXPECTED]
> In our test both small models now answered the question about the cash
> taken with `till_register_log`, and neither claimed an order that had been
> rejected. `gemma-4-e4b` loaded the skill for the cash box and found the
> −4.50 euros without writing anything. With `/weekly-order` it read the stock
> with `shop_stock`, left out the own farm and waited for approval, but still
> got six of nine quantities wrong, such as 48 instead of 30 jars of yoghurt;
> its daily closing was right and went into the cash book. `gemma-4-e2b` now
> got all nine quantities right and waited for approval, but it still did not
> load the skill for the cash box, and in the daily closing it worked out the
> −4.50 euros without writing them into the cash book.

3. Put the old and the new skill side by side: what did the coach make more
   exact, and which of the small model's mistakes are gone?

> [!EXPECTED]
> The coach made exact what the cloud model had filled in by itself: which
> tool comes at which step with which arguments, that the stock has to come
> from `shop_stock`, that nothing is ordered before a later approval, and the
> calculation as a formula in whole numbers. Most of the small models'
> mistakes are gone. What is left is arithmetic and holding out to the last
> step, and no instruction makes a small model reliable at those. What can be
> stated exactly belongs in code: a tool that works out the order quantities
> itself, as in extension 1, takes the arithmetic away from the model.

Instead of the agent `coach` you can use any strong agent on the folder, such
as Claude Code: open it in the folder and give it the same request. It can
read everything in the folder and asks before it changes a file.

The folder after process 4, with the skills and commands our coach wrote:
[farm-shop-after-process-4.zip](media/farm-shop-after-process-4.zip).

## Extensions

1. **A rule as code.** Ask yourself which step of the weekly order the small
   model still gets wrong most easily, and add a tool to `tools/shop.py`
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
