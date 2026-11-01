---
title: Folder tree and command line
summary: >-
  A terminal below its folder tree: you see where you are, which way a path
  takes while you are still typing it, and what every command changes in the
  tree, in PowerShell and on a Mac.
objectives:
  intro: "In this demo you type commands into a terminal and see at the same time what they do in the folder tree. Afterwards you can:"
  goals:
    - "point to the place in the folder tree where you are for any prompt"
    - "follow a relative or absolute path through the tree before you run it, with `..` and `~` as well"
    - "predict what `cd`, `ls`, `mkdir`, `cp`, `mv` and `rm` change in the tree"
    - "trace an error message of the shell back to a wrong name or a wrong place"
translation_of: de
based_on: 2026-11-02
---

**Goal:** See what a command line otherwise hides: where you are, which way a
path takes through the folder tree and what a command changes there. The
commands and error messages are those of PowerShell on Windows and of the
Terminal on a Mac; only the file system is made up, and it lives in your
browser alone.

**How to use:** Type a command and press Enter, such as `ls`, `cd Documents`
or `mkdir archive`. While you type, the way of the path lights up in the tree,
and the line below describes it. A click on a folder writes the `cd` that leads
there, the Tab key completes names, and the arrow keys bring back earlier
commands. At the top you choose Windows or Mac. With "Predict" every command
waits for a second Enter before it shows what it did.

```shell-demo
tree:
  Desktop: {}
  Documents:
    uni:
      maths: {}
      notes.txt: "Two ideas for the LiFi project\n"
    shopping.txt: "milk\nbread\napples\n"
  Downloads:
    hello.py: "print(\"Hello from the command line!\")\n"
  My Photos:
    holiday.jpg: ""
```
