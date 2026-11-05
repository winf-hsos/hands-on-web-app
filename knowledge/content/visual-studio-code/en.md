---
title: Visual Studio Code
summary: >-
  Microsoft's free editor in which you write programs, see their files and
  run them in the built-in terminal, with extensions for Python and almost
  any other language.
objectives:
  intro: "This page introduces Visual Studio Code, the editor you program with on your own computer, and afterwards you can:"
  goals:
    - "install VS Code and the Python extension"
    - "open a project folder with File → Open Folder and create files in it"
    - "find the Explorer, the editor and the terminal and open the Command Palette with Ctrl+Shift+P"
    - "run a Python program with the Run Python File button or in the terminal"
    - "choose which Python VS Code uses and tell when a virtual environment is active"
translation_of: de
based_on: 2026-11-01
---

The code boxes on this platform are enough for learning. As soon as your
programs are meant to run on your own computer, you need an editor in which
you write them, keep an eye on their files and run them. Visual Studio Code,
VS Code for short, is such an editor. It comes from Microsoft, is free, runs
on Windows, macOS and Linux and is the most widely used editor among
programmers.

At first VS Code is a lean text editor. What it knows about a programming
language comes from **extensions**: with the Python extension it colours your
code, suggests names as you type, marks errors before you run the program and
runs it at the push of a button. In the module Digitization and Programming
and in the [[lifi|LiFi project]] you write your programs in VS Code.

## Setting up

1. **VS Code** from the page linked below. On Windows, leave the box *Add to
   PATH* ticked during installation, so that you can also open VS Code from
   the command line.
2. **Python** from [python.org](https://www.python.org/downloads/), if you do
   not have it yet. VS Code does not come with a Python of its own.
3. The **Python extension** by Microsoft. Click the icon with the four squares
   on the left (*Extensions*), search for *Python* and install the entry by
   Microsoft; it brings the typing aids and the debugger along with it.

## A project is a folder

VS Code works with folders, not with single files. Use *File → Open Folder*
to open the folder your project lives in, for example
`studium\programmieren\uebung-1` from the
[[command-line-exercise|command-line exercise]]. Everything you create then
ends up in this folder, and the terminal starts there too, so Python finds
your files by their names.

The first time you open a folder, VS Code asks whether you trust the authors
of the files in it. For a folder you created yourself, answer *Yes, I trust
the authors*.

## What you see on the screen

- **Explorer** (left): the files and subfolders of the open folder. The small
  icons at the top create a new file or a new folder.
- **Editor** (centre): the open files, each in a tab of its own. A dot in the
  tab means the file has not been saved yet; **Ctrl+S** (on a Mac **Cmd+S**)
  saves it. If you often forget, switch on *File → Auto Save*.
- **Terminal** (bottom): a command line inside the editor that starts in the
  open folder. Open it with *Terminal → New Terminal*.
- **Command Palette:** **Ctrl+Shift+P** (on a Mac **Cmd+Shift+P**) opens a
  search box at the top for every command VS Code knows. If you do not know
  where something is in the menus, type a few letters of its name here.

## Running a Python program

When you open a file ending in `.py`, a triangle named *Run Python File*
appears at the top right above the editor. One click saves the file and runs
it in the terminal; the output appears there, and that is also where you type
when the program asks for something with `input`.

The button does nothing more than the command you type by hand on the
[[python-on-the-command-line|command line]]. You can just as well type
`python hallo.py` (on a Mac `python3 hallo.py`) into the terminal yourself,
and when something goes wrong, it helps to know that both are the same.

## Which Python?

Many computers have more than one Python installed, and every project can
have a [[python-virtual-environments|virtual environment]] of its own. The
Python VS Code uses is shown at the bottom right of the status bar as soon as
a `.py` file is open. Clicking it, or *Python: Select Interpreter* in the
Command Palette, shows you all the ones VS Code has found. If the project
folder contains a folder `.venv`, VS Code suggests it on its own, and new
terminals then activate it straight away.

## VS Code and Positron

[[positron]] is built on the same foundation as VS Code, the free Code OSS,
and therefore looks almost the same. For data analysis in R and Python,
Positron is the better choice because it comes with a console, a table viewer
and plots. For programming in Python, as in this path and in the LiFi
project, VS Code is the standard, and what you learn in one of the two
programs carries over to the other.

## Extensions and AI assistants

Extensions come from Microsoft's Marketplace, which you reach through the
*Extensions* icon. Install only what you really need, and only entries with
many downloads from a well-known publisher, because an extension may do
almost anything on your computer.

AI assistants work in VS Code as well, either as an extension or, like
OpenCode in the LiFi project, as a program in the terminal. The assistant
then reads the files in the open folder and writes to them, and the Explorer
and the editor show you at once what it has changed.
