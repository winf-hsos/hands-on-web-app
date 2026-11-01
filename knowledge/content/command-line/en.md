---
title: The command line
summary: >-
  In the command line you tell the computer what to do with typed commands.
  You open it as PowerShell on Windows and as Terminal on the Mac and learn
  how a command is built.
objectives:
  intro: "In this lesson you open the command line for the first time, and afterwards you can:"
  goals:
    - "explain what the command line is and why programmers use it"
    - "open PowerShell on Windows and Terminal on the Mac"
    - "read from the prompt which folder you are currently in"
    - "break a command down into the command name and its arguments"
    - "show the current folder with `pwd` and its content with `ls`"
translation_of: de
based_on: 2026-11-01
---

In Explorer or in Finder you click on icons to open folders and move files.
You can do the same things with typed commands as well: you write a line,
press Enter, and the computer answers with a line of text. This window is
called the **command line**, or, after the window it runs in, the
**terminal**. The program inside it that reads and carries out your commands
is called the **shell**: **PowerShell** on Windows and **zsh** on the Mac.

## Why type instead of click?

For single files the mouse is often faster. The command line, however, has
three advantages that count when you program. Many tools exist only there,
Python itself included, and the easiest way to start a program you have
written is with a command. Commands can be written down, repeated and passed
on to others, which hardly works for sequences of clicks. And on servers,
where your programs will later run, there are often no windows at all, only
the command line.

## Opening the command line

- **Windows:** Press the Windows key, type `PowerShell` and open **Windows
  PowerShell**. On Windows 11 you also find it in **Terminal**, which starts
  with a PowerShell.
- **Mac:** Press Cmd+Space, type `Terminal` and press Enter. You also find
  the program in Finder under **Applications → Utilities**.

A window opens with little more than a line that waits for your input. This
line is called the **prompt**.

![Two terminal windows side by side, PowerShell on the left and the Mac Terminal on the right, both showing the command ls Documents with its output; below, the line from PowerShell is broken down into prompt, command and argument](figure:anatomy "PowerShell on Windows on the left, Terminal on the Mac on the right: the prompt looks different, but the command is the same.")

## The prompt tells you where you are

On Windows the prompt ends with `>` and on the Mac with `%`. Before that
stands the folder you are currently working in, the **current directory**.
On Windows this is, for example, `PS C:\Users\anna>`, on the Mac
`anna@MacBook ~ %`. The tilde `~` is short for your home folder, which on the
Mac is `/Users/anna`.

The current directory matters because every relative path refers to it.
After opening the command line you are always in your home folder.

## How a command is built

A command starts with its **name**, followed, separated by spaces, by its
**arguments**: what the command should act on. Try out the first two
commands. `pwd` stands for *print working directory* and prints the current
directory:

```powershell
pwd
```

`ls` stands for *list* and shows what is in the current directory:

```powershell
ls
```

If you give `ls` a folder as an argument, it shows that folder's content
without you having to change into it:

```powershell
ls Documents
```

The output in PowerShell looks more detailed than on the Mac, because it also
gives the type, date and size of every entry. The first column has a `d`
(*directory*) for every folder.

> [!NOTE]
> The commands in this path have the same names in PowerShell and on the Mac.
> PowerShell actually has longer names such as `Get-ChildItem` for `ls`, but
> it knows the short ones as aliases. Where the two differ, it says so.

## Two helpers that save you a lot of typing

- The **up arrow key** brings back the last command, and pressing it several
  times brings back the ones before. This lets you repeat a command or fix a
  typo without writing everything again.
- The **Tab key** completes names: type `ls Doc` and press Tab, and the shell
  writes the rest of `Documents` for you. PowerShell puts `.\` in front, which
  means “in the current folder” and changes nothing.

With `clear` you tidy up the window when it gets too full; your files are not
affected by it.

> [!TIP]
> The space between the command and the argument counts. `ls Documents`
> works, `lsDocuments` does not, because without the space the shell looks
> for a command with exactly that name.
