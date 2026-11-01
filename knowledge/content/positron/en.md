---
title: Positron
summary: >-
  Posit's free development environment for data analysis: one program for R,
  Python and Quarto, with a console, a data viewer and plots.
objectives:
  intro: "This page introduces Positron, Posit's development environment for R, Python and Quarto on your own computer, and afterwards you can:"
  goals:
    - "install Positron, R and, if needed, Python"
    - "create a project folder for each analysis and open it with File → Open Folder"
    - "run code from the editor with Ctrl+Enter and look at the results in the console, Variables, Data Explorer and Plots"
    - "open sessions for R and Python side by side and switch between them"
    - "write a report as a Quarto document (`.qmd`) and render it as a preview"
translation_of: de
based_on: 2026-11-01
---

The code boxes on this platform are enough for learning. For analyses of
your own you need a program on your computer in which you write scripts, run
them and look at the results. Positron is such a development environment,
made by Posit, the company behind RStudio and the tidyverse. It is built for
data analysis and handles R, Python and Quarto in one program, so you do not
have to learn a separate tool for each language.

Positron is free, also for work at university and in your job, and runs on
Windows, macOS and Linux. It is built on Code OSS, the same foundation as
[[visual-studio-code|Visual Studio Code]]; if you know VS Code, you will feel at home straight away.

## Setting up

Positron itself brings neither R nor Python. So you install what you need,
and Positron then finds it by itself:

1. **Positron**, from the page linked below.
2. **R**, version 4.2 or later, from CRAN at cloud.r-project.org.
3. **Python**, if you need it, in a current version. If you have none,
   Positron can install it for you with the tool uv.

You do not need to install **Quarto** separately; it already comes with
Positron.

## A project is a folder

Positron works with folders. Create a folder for each analysis, with data,
scripts and reports in it, and open it with *File → Open Folder*. Then your
code finds every file there by its name, without a long path, and your
project also runs on another computer. Positron needs no project file like
RStudio's `.Rproj`; the open folder is the project.

## What you see on the screen

- **Editor:** where you write scripts (`.R`, `.py`) and reports (`.qmd`). With
  **Ctrl+Enter** (**Cmd+Enter** on a Mac) you run the line or selection the
  cursor is in.
- **Console:** where the code runs and the results appear. You can also type
  into it directly to try something out.
- **Variables:** all objects that currently exist, with type and size.
- **Data Explorer:** from *Variables* you open a table as in a spreadsheet, with sorting, filtering and a small summary of every column.
- **Plots:** the charts your code draws.
- **Help:** the help for a function; **F1** on a function name opens it.

## R and Python side by side

At the top right you choose which language and which version you work with.
Positron can keep several sessions open at once, say one for R and one for
Python; the console, *Variables* and *Plots* always show the session that is
currently active. When you run code from a script, Positron sends it to a
session of the matching language.

For R, the shortcuts you know from the code boxes here apply, such as
**Ctrl+Shift+M** for the pipe. For Python, Positron brings support of its own
and knows the usual environments such as venv, uv and conda.

## Reports with Quarto

A Quarto document (`.qmd`) mixes text and code: you write the analysis in
Markdown, with code blocks in R or Python in between, and rendering turns it
into a report as HTML, PDF or Word, with all results and charts in their
place. The bar above the editor has a button that renders the report and
shows it as a preview. You can only run code in the source view, not in the visual
view.

## Extensions

Like VS Code, Positron can be extended. Extensions come from the open
registry Open VSX, not from Microsoft's Marketplace. Support for R and Python
is already built in; you do not need the R and Python extensions known from
VS Code and should not install them as well.

## What you take with you from here

Everything you learned in the boxes on this platform works the same in
Positron. Only two things you have to do yourself: install and load
packages, as described in [[r-packages]], and read in your data, for
instance with `read_csv()`, as the page on the
[[milk-chocolate-survey|survey data set]] shows.
