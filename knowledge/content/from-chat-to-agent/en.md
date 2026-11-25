---
type: experiment
code: 5040
title: From chat to agent
summary: >-
  You set up OpenCode with a model in the cloud and one on your laptop, chat
  with both as in ChatGPT, turn the chat into an agent that writes files,
  looks things up and runs programs, and watch a small model fail where a
  larger one succeeds.
objectives:
  intro: "In this experiment you take your first steps with OpenCode, and afterwards you can:"
  goals:
    - "connect OpenCode to OpenAI and to LM Studio, open a folder as a project and start a session"
    - "tell a chat from an agent by what the agent can do: read and write files, look things up and run programs"
    - "set up an agent for a folder with an AGENTS.md and find out which tools it has, in the session and in the log of LM Studio"
    - "compare a small model on your laptop with a larger model in the cloud on the same task, and switch the model in the middle of a session"
    - "explain what the context window is, why an agent fills it before you have typed a word, and what happens when it is full"
    - "use the commands of OpenCode that you need every day, and let an agent work in a browser"
level: 1
duration: 90
topics: [ai-agents]
relations:
  see_also: [opencode, lm-studio, ai-agents, tools-skills-commands]
modules: [aai]
areas: [ai]
status: published
updated: 2026-11-25
---

A chat in the browser answers, and some chats can also search the web or run
a little Python, but only in their own environment in the cloud: they do not
see the files on your laptop and cannot use your programs. An
[[ai-agents|AI agent]] works where your files are, because it calls tools on
your computer and looks at their results before it answers. In this experiment you
meet the agent you will work with from now on, [[opencode|OpenCode]], and use
it with two very different language models: `gpt-6-luna` from OpenAI, which
runs in the cloud, and `gemma-4-e2b` from Google, which runs in
[[lm-studio|LM Studio]] on your own laptop.

The thread through the experiment is the Lindenhof farm shop, a small
self-service shop on a farm whose owner Jeff wants a flyer with this week's
offers. You start in an empty folder, and by the end it holds the flyer as a
PDF, a small Python program and, if you like, a letter to a supplier, all
written by the agent. In the experiment [[tools-skills-commands]] you later
give the same shop an agent of its own.

What comes out depends on the model and on chance, because a language model
does not answer the same way twice. The results under *What should happen?*
are those of our tests in November 2026; yours will differ in the details.

The slides lead through the experiment, from the first chat to the agent in
a browser.

![Slides: From chat to agent](item:from-chat-to-agent-slides)

## Setup

Before you start, install the programs and get the models ready. Downloads
are large, so do this at home and not in the lecture room.

1. Install the desktop app of OpenCode and LM Studio, as described on the
   pages [[opencode]] and [[lm-studio]]. Check that Python 3 is installed by
   typing `python --version` in a terminal; if it is not, follow
   [[python-on-the-command-line]].

> [!EXPECTED]
> OpenCode opens with an empty list of projects on the left, LM Studio opens
> with its chat, and the terminal shows a version such as `Python 3.13.1`.

2. Install [Typst](https://typst.app/open-source/), a program that turns a
   text file into a PDF, much like LaTeX but simpler. On Windows, type
   `winget install --id Typst.Typst` in a terminal, on a Mac
   `brew install typst`. Then close the terminal, open a new one and type
   `typst --version`.

> [!EXPECTED]
> The terminal shows a version such as `typst 0.14.2`. If the command is
> unknown, the terminal was opened before the installation; close every
> terminal and open a new one. OpenCode, too, finds Typst only if it was
> started after the installation.

3. In LM Studio, download the model `google/gemma-4-e2b` under *Model
   Search*. It needs about 4.4 GB of disk and runs on a laptop with 8 GB of
   memory.

> [!EXPECTED]
> The model appears under *Library*.

4. Load the model with enough context. Under *Library*, select
   `gemma-4-e2b`, open the tab *Load* and set *Context Length* to `32768`.
   Then load the model. The context is how much text the model can see at
   once, and you will find out below why an agent needs a lot of it.

> [!EXPECTED]
> The model shows as loaded at the top of the window. If LM Studio warns
> that your memory is short, choose `16384` instead.

5. Start the local server of LM Studio, through which other programs reach
   the model: click *Model Server* in the bar on the left and switch
   *Status* to *Running*.

> [!EXPECTED]
> The status reads *Running*, next to it stands *Reachable at:
> http://127.0.0.1:1234*, and `google/gemma-4-e2b` is listed under *Loaded
> Models* with the label *READY*.

## Connecting OpenCode to the models

OpenCode brings no language model of its own. It sends what you type to a
provider and shows you the answer, so before the first question it has to
know where the models are.

6. Connect OpenAI. In OpenCode, open *Settings* (Ctrl + , or Cmd + ,), then
   *Providers*, click *+ Connect* next to OpenAI, choose *API key* and paste
   the key you got for the class. The key is like a password, and every
   answer costs money with it, so paste it nowhere else.

> [!EXPECTED]
> Under *Connected providers*, OpenAI is listed.

7. Look at the same list again with LM Studio's server running. You do not
   connect LM Studio yourself: OpenCode looks for its server at
   `127.0.0.1:1234` and lists every model it finds there.

> [!EXPECTED]
> LM Studio is listed under *Connected providers* as well, marked
> *Custom*. Under *Settings → Models*, the section *LM Studio* lists the
> models you have downloaded, among them *Gemma 4 E2B*. If LM Studio is
> missing, its server was not running when OpenCode started: start the
> server and restart OpenCode.

8. Create a folder `lindenhof` in a place where you will find it again, such
   as *Documents*. In OpenCode, click *Add project* (the folder icon with the
   plus), choose the folder and click *New session*.

> [!EXPECTED]
> A new session opens with an empty input field. Below it, the agent
> *Build* is selected next to a model, and below that the name of the folder
> and its path.

## A chat, as in ChatGPT

9. Choose `GPT-6 Luna` in the model picker below the input field and ask:

   ```text
   What could a small farm shop offer in December? Give me five products with a fair price each.
   ```

> [!EXPECTED]
> An answer as you know it from ChatGPT, with a list of products and prices.
> At the top right of the window, OpenCode now shows how many tokens the
> session holds and what it has cost so far.

10. Click the model picker again, switch to `Gemma 4 E2B` under *LM Studio*
    and ask the same question in the same session.

> [!EXPECTED]
> The answer comes more slowly, and you may hear your laptop's fan, because
> the model now runs on it. The costs at the top right do not grow, since a
> model on your own laptop costs nothing per answer, and nothing you typed
> left your computer.

So far OpenCode has behaved like a chat. The next sections show what makes
it an agent.

## An agent for the folder

An agent works in a folder and should know what the folder is for. OpenCode
reads a file `AGENTS.md` in the folder at the start of every session and puts
its content in front of everything you type.

11. Switch back to `GPT-6 Luna` and create the file with a command: type
    `/init` in the input field and send it.

> [!EXPECTED]
> The agent looks around the folder, finds it empty and either asks you what
> the project is about or writes a short `AGENTS.md` by itself. The file
> appears in the folder.

12. Replace what `/init` wrote with a description of your own. Open
    `AGENTS.md` in an editor, or ask the agent to write it, and give it this
    content:

    ```markdown file=AGENTS.md
    # Lindenhof farm shop

    You help Jeff, who runs the Lindenhof farm shop, a small self-service shop
    on his farm. Customers weigh, pay and take their goods themselves.

    - Answer in English and keep it short.
    - Write every file into this folder.
    - Prices are in euros with two decimals, such as 6.50.
    ```

    Start a new session (Ctrl + T or *New session*) and ask:

    ```text
    Who are you working for, and what do you know about the shop?
    ```

> [!EXPECTED]
> The agent answers as Jeff's helper at the Lindenhof farm shop, without you
> having said a word about it in this session. Everything it knows comes from
> `AGENTS.md`.

13. Ask the agent which tools it has:

    ```text
    Which tools do you have? List their exact names with one line each on what they do.
    ```

> [!EXPECTED]
> A list of about a dozen tools, among them `read`, `write`, `edit`, `glob`,
> `grep`, `shell`, `webfetch`, `websearch`, `question`, `skill` and
> `subagent`. The model knows them because OpenCode sends a description of
> every tool along with every request. In the agent *Build*, all of them
> are allowed.

14. See for yourself what OpenCode sends. In LM Studio, open *Model Server*,
    then the menu *…* above the *Server Logs* at the bottom, and switch on
    *Verbose Logging*. Switch OpenCode to `Gemma 4 E2B`, send `hi` in a new
    session and look at the log in LM Studio. The request starts with
    `Received request: POST to /v1/chat/completions with body {`; search it for
    `"tools"`.

> [!EXPECTED]
> The log shows the whole request: a long system prompt from OpenCode, your
> `AGENTS.md`, your `hi` and the list `"tools"` with the name, description and
> parameters of every tool. In our test it held 14 tools, and the tool
> descriptions alone were about 18,000 characters long, the system prompt
> about 25,000. A second, short request without tools follows: OpenCode asks
> the model for a title for the session.

## The agent acts

Now give the agent work in your folder. Use `GPT-6 Luna` for this
section, and look at the grey lines between your message and the answer,
such as *Used 1 Write*: a click on them unfolds every tool call with what went
in and what came out.

15. Let the agent write a file:

    ```text
    Write this week's offers into a file offers.md: fresh eggs 0.40 euros each, honey 6.50 euros a jar, potatoes 2.50 euros for 2.5 kg, kale 3.20 euros a kilo.
    ```

> [!EXPECTED]
> The file `offers.md` appears in the folder, and in the session you see the
> call of `write` with the path and the content. A chat would have given you
> the text to copy or a file to download; the agent put it where it belongs.

16. Let the agent look something up:

    ```text
    Which vegetables are in season in Germany in December? Look it up on the web, name your source and add two of them to offers.md with a fair price.
    ```

> [!EXPECTED]
> The agent searches the web, opens a page and answers with a source. In our
> test it searched twice, read the seasonal calendar of regional-saisonal.de
> and named kale, Brussels sprouts, leeks and lamb's lettuce. Check the
> source yourself: the agent read a real page, but whether it read it
> correctly is up to you to judge.

17. Let the agent write and run a program:

    ```text
    Write a Python program prices.py that reads the offers from offers.md, gives 10 percent off every product above 5 euros and prints the new price list. Run it and show me the output.
    ```

> [!EXPECTED]
> The agent writes `prices.py`, runs it with `shell` and shows what the
> program printed. If the program fails at first, the agent reads the error
> message, changes the file and runs it again, on your laptop and with the
> Python you installed there.

## A small and a larger model

A model on your laptop is free and private, but it is much smaller than the
models in the cloud. You see the difference best on a task that has to be
exactly right, such as a file for a program that accepts no mistakes.

18. Switch to `Gemma 4 E2B` and ask in the same session:

    ```text
    Make a one-page flyer for this week's offers as a Typst document flyer.typ. Then compile it to a PDF with typst compile flyer.typ.
    ```

    Watch what the model does when Typst reports an error.

> [!EXPECTED]
> In our tests, `gemma-4-e2b` wrote Markdown into the file, with `#` for
> headings and `**` for bold, which Typst does not understand: `typst compile`
> stopped with `error: expected expression` in the first line. The model
> rewrote the file seven times, always in Markdown, apologized and finally
> said that the compiler or its tools were the problem, not its file. No PDF
> came out.

19. Switch to `GPT-6 Luna` in the same session and ask:

    ```text
    Fix the error.
    ```

> [!EXPECTED]
> OpenCode marks the switch in the session with *Switched to GPT-6 Luna*.
> The larger model reads `flyer.typ`, rewrites it in real Typst, compiles it
> and reports that `flyer.pdf` was created, in our test within about 15
> seconds. Open the PDF. The larger model needed no more explanation than
> *Fix the error*, because the whole session, with the small model's
> attempts and Typst's messages, was still in its context.

## The context window

A language model sees a limited amount of text at once, its context window,
counted in tokens; a token is a piece of a word, and in English one token is
about four characters. Everything the model is to take into account has to
fit: the system prompt, the tool descriptions, `AGENTS.md`, the whole
conversation so far and every file the agent has read. When you loaded
`gemma-4-e2b`, you gave it 32,768 tokens.

20. Make the window small. In LM Studio, under *Library*, set the *Context
    Length* of `gemma-4-e2b` to `8192`, eject the model and load it again. Then
    send `hi` to `Gemma 4 E2B` in a new session of OpenCode.

> [!EXPECTED]
> No answer, but an error. In our test it read: `request (10581 tokens)
> exceeds the available context size (8192 tokens), try increasing it`.
> A plain `hi` came to more than ten thousand tokens, because the agent sends
> its system prompt and its tools along before your first word. A model that
> is enough for a chat in LM Studio can be too small for an agent.

21. Set the *Context Length* back to `32768`, load the model again and send
    `hi` once more.

> [!EXPECTED]
> Now the model answers. At the top right, OpenCode shows that the session
> already holds about ten thousand tokens.

22. Switch to `GPT-6 Luna`, go back to the session with the flyer and type
    `/compact`.

> [!EXPECTED]
> OpenCode has the model summarize the session so far and continues with the
> summary instead of the whole conversation. The number of tokens at the top
> right drops. A long session costs more with every message, because the
> whole conversation is sent again each time, and at some point it no longer
> fits; `/compact` makes room, but details that are not in the summary are
> gone. OpenCode compacts by itself when a session gets close to the limit.

## Commands

Everything that begins with `/` in the input field is a command for
OpenCode, not a message for the model. Type `/` to see all of them.

23. Try the commands you will need most often, each in one of your sessions:

    | command | what it does |
    |---|---|
    | `/init` | sets up `AGENTS.md` for the folder |
    | `/undo` | takes back your last message, together with every file the agent changed for it |
    | `/compact` | summarizes the session to make room in the context |
    | `/fork` | starts a new session from an earlier message, for example to try the same request with another model |
    | `/new` | starts a new session (also Ctrl + T) |
    | `/export` | saves the whole session as a JSON file, with every request and every tool call |
    | `/mcp` | shows the tool servers of the folder and switches them on and off |

    Ask the agent to delete `offers.md`, and then take it back with `/undo`.

> [!EXPECTED]
> After `/undo`, your message is gone from the session and `offers.md` is
> back in the folder, because OpenCode keeps a snapshot of the folder before
> every change. `/mcp` still shows *No MCPs configured*; in the experiment
> [[tools-skills-commands]] you add servers there.

## The agent in a browser

The desktop app of OpenCode has a browser of its own, and a larger model can
work in it: open pages, read them, follow links and fill in forms.

24. With `GPT-6 Luna`, ask:

    ```text
    Open https://hands-on-computer-science.de in the browser and tell me what the start page offers.
    ```

> [!EXPECTED]
> The browser opens on the right side of the window with the page. In the
> session you see *Skill* and *Execute*: the agent loaded the instructions
> for the browser and then wrote a small program that controls it. It
> answers with the three areas of the site and what can be found there.

25. Give it a task with several steps:

    ```text
    On hands-on-computer-science.de, find the experiment about tools, skills and commands and tell me how long it takes and what I need for it.
    ```

> [!EXPECTED]
> The agent searches or clicks its way to the page, which you can follow in
> the browser, and answers with the duration and the setup. A small model
> such as `gemma-4-e2b` usually gets lost in such a task, so leave the
> browser to the larger one.

Some agents go one step further and control the whole computer: they look at
screenshots and move the mouse and type, in any program. OpenCode does not
have this built in. It needs an extra tool server and is something to be
careful with, because such an agent can do everything you can.

## Extensions

1. **A letter in Word.** Ask `GPT-6 Luna` to write a short letter from Jeff
   to the supplier Bee Garden as `letter.docx`, ordering 12 more jars of
   honey before Christmas, with Python and the package `python-docx`. The
   agent may have to install the package first, with
   `pip install python-docx`. Then ask it to change the date and the
   quantity in the existing file.
2. **The same task twice.** Use `/fork` on your message with the flyer and
   give it to `Gemma 4 E2B` again, this time with the hint that Typst marks
   headings with `=` and bold with `*`. Does the hint get the small model
   through?
3. **What does a session cost?** Use `/export` on your longest session and
   look at the file: how many requests went to the model, and how much of
   each request was the same as the one before?

## Reflection

- What could the agent do that a chat in the browser cannot, and where did
  you have to check its work?
- Why does OpenCode send the description of every tool with every request,
  and what does that cost in a model with a small context?
- What does `AGENTS.md` change, and what would you write into it for a
  folder of your own?
- The small model blamed the compiler for its own mistake. What would have
  helped it, and when is a small model on your laptop the better choice
  anyway?
- What leaves your laptop when you work with `GPT-6 Luna`, and what when you
  work with `Gemma 4 E2B`?
- Which of the agent's tools would you allow without asking, and which only
  after it asks you first?

![Quiz: From chat to agent](item:from-chat-to-agent-quiz)
