# From Chat to Agent

Script for the experiment *From chat to agent*, in the order of the slides.
The deck introduces OpenCode with two language models, one in the cloud and
one on the laptop, and follows the experiment: from a chat to an agent with
an `AGENTS.md`, three things the agent does in the folder, a small model that
fails where a larger one succeeds, the context window, the most useful commands and the
agent in a browser. The full steps and prompts are in the experiment itself.

## Opening

Farmer Jeff runs the Lindenhof farm shop, a small self-service shop on his
farm. This week he wants to put up a flyer with his offers: eggs, honey,
potatoes and kale. A chat such as ChatGPT writes him a nice text, but it
gives him neither the flyer as a file nor a program that works out the
discounts. We meet the tool we work with from now on, OpenCode, and see what
turns a chat into an agent. The shop and its prices are invented.

## Chat and agent

**A chat answers, an agent works on the task.** In a chat, you write
something and the language model writes text back. An agent uses the same
kind of model, but the model may call tools: read and write files, run
commands, search the web. The result of every call goes back to the model,
which decides whether it is done or has to do more. This loop is the whole
difference. The model itself does nothing; it only writes down which tool it
wants to call, and OpenCode carries the call out.

**One app, two models.** OpenCode brings no language model of its own. It
sends what you type to a provider and shows the answer. We connect two:
OpenAI with `gpt-6-luna`, a larger model in the cloud, which needs the key of
the class, and LM Studio with `gemma-4-e2b`, a small model on the laptop.
LM Studio needs no connecting, since OpenCode finds its server at
`127.0.0.1:1234` by itself. With `gpt-6-luna`, everything you type leaves the
laptop; with `gemma-4-e2b` it stays there, but the small model is slower and
makes more mistakes.

**Four words you meet in OpenCode.** A *project* is a folder on the laptop,
and the agent reads and writes only there. A *session* is one conversation
in that folder with its own context, and a new session starts empty. The
*agent* is a role for the model with its own instructions and permissions:
the built-in agent *Build* may change files and run commands, *Plan* may only
read and plan. The *model* is chosen below the input field and can be
switched in the middle of a session.

## The folder

**AGENTS.md: what the agent reads first.** The file `AGENTS.md` tells the
agent what the folder is for: who works here, what it is about and which
rules apply. OpenCode puts it in front of everything you type, in every
session of the folder, and the command `/init` writes a first version. Asked
in a new session who it works for, the agent answers as Jeff's helper at the
Lindenhof farm shop without a word about the shop in that session.

**The tools of the agent Build.** Asked for its tools, the agent lists them,
because OpenCode sends a description of every tool along with every request.
In our test there were 14: `read`, `write`, `edit`, `glob` and `grep` for
files, `webfetch` and `websearch` for the web, and `shell`, `execute`,
`question`, `skill`, `subagent`, `generate_image` and `generate_video`. In
the agent *Build*, all of them are allowed.

**What OpenCode sends when you type hi.** With verbose logging switched on
under *Model Server*, LM Studio shows every request in full. For a plain
`hi`, the request held a system prompt of about 25,000 characters, which
tells the model how to work and includes the `AGENTS.md`, then the 14 tools
with their parameters, about 18,000 characters, and finally the two
characters typed. All of it goes to the model with every single request.

## The agent acts

**Three things the agent does in your folder.** A chat such as ChatGPT can
search the web and run Python too, but in its own environment in the cloud,
while the agent works on the laptop with your files and your programs. It
reads and writes files: the offers end up in `offers.md` in the folder, with
nothing to upload or download. It looks
something up: in our test it searched twice, read the seasonal calendar of
regional-saisonal.de and named kale, Brussels sprouts, leeks and lamb's
lettuce, and whether it read the page correctly is for you to check. It
writes and runs a program: `prices.py` reads the offers, takes 10 percent off
every product above 5 euros and prints the list, and if the program fails,
the agent reads the error and tries again. A click on the grey lines in the
session, such as *Used 1 Write*, shows every tool call with its input and
its result.

## Small and large

**Poll: a flyer as a Typst file.** Typst turns a text file into a PDF, much
like LaTeX but simpler, and it accepts no mistakes. A small model on the
laptop and a larger one in the cloud each get the task to make the flyer as a
Typst file and compile it.

**The small model writes Markdown into a Typst file.** The first attempt of
`gemma-4-e2b` used `#` for the heading and `##` for every product, as in
Markdown. In Typst, `#` starts a command, so `typst compile` stopped in the
first line with `error: expected expression`. Typst expects `=` and `==` for
headings.

**The same session, two models.** `gemma-4-e2b` wrote the file, compiled it,
got the error, rewrote the file five times without compiling, compiled again,
rewrote it twice more and compiled a third time, always in Markdown. Its last
answer put the blame on compiling the file through the tools rather than on
the file. Switched to `gpt-6-luna` in the same session, the prompt *Fix the
error.* was enough: the larger model read the file, edited it and compiled it,
and `flyer.pdf` was there after about 15 seconds. It needed no more
explanation, because the whole session with every attempt and every error
message was still in its context.

**The flyer of the larger model.** The PDF from our test is plain but
correct, with a title, a subtitle and three offers with their prices. One
more sentence to the agent is enough for more design.

## The context window

**10,581 tokens for a plain hi.** Language models count in tokens, pieces of
words of about four characters in English. The request for `hi` came to
10,581 tokens, before any question was asked.

**The context window has to hold everything.** The context window is how
much text a model can see at once, and it is set when the model is loaded in
LM Studio. With 8,192 tokens, the request for `hi` does not fit, and OpenCode
shows an error instead of an answer. With 32,768 tokens, it fits, and there
is room left for the conversation and the files the agent reads. A larger
window needs more memory on the laptop. A model that is enough for a chat in
LM Studio can be too small for an agent.

**/compact makes room.** A language model remembers nothing between two
requests, so OpenCode sends the whole session every time: system prompt,
tools, every message, every tool call and every result. The session grows
until it no longer fits. `/compact` has the model summarize the session and
continues with the summary, which makes room and saves money, but what is
not in the summary is gone. OpenCode compacts by itself when a session gets
close to the limit. A long session costs more with every message, because
the whole conversation goes to the model again each time.

## Commands and browser

**Commands are for OpenCode, not for the model.** Everything that begins
with `/` in the input field is a command for OpenCode. The seven used most
often are `/init` for `AGENTS.md`, `/undo` to take back the last message
together with every file the agent changed for it, `/compact`, `/fork` to
start a new session from an earlier message, `/new` (also Ctrl + T),
`/export` to save the session with every request and tool call, and `/mcp`
for the tool servers of the folder.

**The agent in a browser.** The desktop app of OpenCode has a browser of its
own, and a large model can work in it: open pages, read them, follow links
and fill in forms. The session shows two calls, `skill`, which loads the
instructions for the browser, and `execute`, which runs a script that drives
it, while the page opens on the right. A small model usually gets lost in
such tasks.

**One step further: computer use.** Some agents control the whole computer:
they look at screenshots, move the mouse and type, in any program. OpenCode
does not have this built in and would need an extra tool server. Such an
agent can do everything you can, so it should get only what the task needs.

## What to take away

- An agent calls tools and reads their results until the job is done.
- `AGENTS.md` tells it what the folder is for.
- Every request carries the system prompt and all tool descriptions.
- A small model is free and private, but fails sooner on exact tasks.
- The context window has to hold the whole session.
- Check what the agent wrote, read and ran.

## Reflect

- What could the agent do that a chat in the browser cannot, and where did
  you have to check its work?
- The small model blamed the compiler for its own mistake: what would have
  helped it?
- What leaves your laptop when you work with `gpt-6-luna`, and what when you
  work with `gemma-4-e2b`?
