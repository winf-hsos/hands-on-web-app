---
title: "Exercise: A folder for your studies"
summary: >-
  Using only the command line, you create a small folder structure for your
  studies, copy and move files in it and check at the end whether everything
  is in its place.
objectives:
  intro: "In this exercise you use the commands of the command line together, and afterwards you can:"
  goals:
    - "create a given folder structure with `mkdir` and `cd`"
    - "create, copy, move and rename files without using Explorer or Finder"
    - "check at any time with `pwd` and `ls` where you are and what is there"
    - "move between neighbouring folders with relative paths and `..`"
translation_of: de
based_on: 2026-11-01
---

At the end of this exercise, this structure should be in your home folder,
and you should get there without opening Explorer or Finder:

![A folder tree: studium contains programmieren and mathe; programmieren holds notizen.txt and the folder uebung-1 with hallo.py, mathe holds the file formeln.txt](figure:target "The goal of the exercise, starting from your home folder.")

Work through the steps in order and check with `ls` after each one whether
the result is right. If you make a typo, nothing is lost, because you can
rename misspelt names with `mv`.

## Step 1: The folders

Open the command line, go to your home folder and create the folder
`studium` there. Inside it, create the two folders `programmieren` and
`mathe`, and inside `programmieren` the folder `uebung-1`.

> [!HINT]
> You can change into a folder before you create something in it, or you can
> give the relative path: on Windows `mkdir studium\programmieren` creates
> `programmieren` inside `studium`, and on the Mac it is
> `mkdir studium/programmieren`.

> [!SOLUTION]
> ```powershell
> cd ~
> mkdir studium
> cd studium
> mkdir programmieren
> mkdir mathe
> cd programmieren
> mkdir uebung-1
> ```

## Step 2: The files

Create an empty file `notizen.txt` in `programmieren` and an empty file
`hallo.py` in `uebung-1`. Then go to the folder `mathe` and create
`formel.txt` there.

> [!HINT]
> On Windows you create an empty file with `New-Item`, on the Mac with
> `touch`. You get from `programmieren` to `mathe` with `cd ..\mathe`, on the
> Mac with `cd ../mathe`.

> [!SOLUTION]
> On Windows, while you are still in `programmieren`:
>
> ```powershell
> New-Item notizen.txt
> New-Item uebung-1\hallo.py
> cd ..\mathe
> New-Item formel.txt
> ```
>
> On the Mac:
>
> ```zsh
> touch notizen.txt
> touch uebung-1/hallo.py
> cd ../mathe
> touch formel.txt
> ```

## Step 3: Renaming and copying

In the goal, the file in `mathe` is not called `formel.txt` but
`formeln.txt`. Rename it. After that, put a copy of `formeln.txt` into
`programmieren` as a backup and delete this copy again straight away, because
it does not appear in the goal.

> [!HINT]
> Renaming is moving under a new name. The copy is in a neighbouring folder,
> so you reach it via `..`.

> [!SOLUTION]
> On Windows, in `mathe`:
>
> ```powershell
> mv formel.txt formeln.txt
> cp formeln.txt ..\programmieren
> rm ..\programmieren\formeln.txt
> ```
>
> On the Mac the commands are the same, with `/` instead of `\`.

## Step 4: Checking

Go back to `studium` and use `ls` to show the content of all three levels by
giving `ls` the folders as arguments. Compare the result with the drawing
above.

> [!SOLUTION]
> ```powershell
> cd ..
> pwd
> ls
> ls programmieren
> ls programmieren\uebung-1
> ls mathe
> ```
>
> `pwd` has to end with `studium`. On the Mac you write
> `ls programmieren/uebung-1`.

If everything is right, you have a folder in which you can keep your next
Python programs. The file that you will bring to life in the next step is
already waiting in `uebung-1`.
