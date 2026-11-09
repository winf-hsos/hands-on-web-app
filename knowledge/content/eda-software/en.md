---
title: "Required software for data analysis with R"
summary: >-
  What has to be on your laptop before you analyse your own data with R: R,
  the development environment Positron with the tidyverse and the built-in AI
  assistant Posit Assistant, what each one is for and how you set it all up.
translation_of: de
based_on: 2026-11-09
---

The code boxes on this platform run in the browser and are enough for
learning. As soon as you analyse your own data, you need three things on your
laptop. All of them are available at no cost and run on Windows and macOS,
and you install them in the order of the table.

| Program | What you need it for | Where to get it |
|---|---|---|
| **R** | the language you analyse data in | [cloud.r-project.org](https://cloud.r-project.org/) |
| **Positron** | the development environment in which you write, run and look at results | [positron.posit.co/download](https://positron.posit.co/download.html) |
| **Posit Assistant** | the AI assistant, already built into Positron | only needs a provider for the language model |

On top of that comes the **tidyverse** package with dplyr, ggplot2, readr and
tidyr, which you install once in R with a single command.

## What each program does

**R** is the language in which you calculate, reshape tables and draw charts.
Everything you have learnt in the code boxes here is R and runs on your
laptop in exactly the same way.

**Positron** is the development environment from Posit, the company behind
RStudio and the tidyverse. Here you write scripts, run them and see console,
variables, tables and charts side by side. Positron does not bring R along
but finds the R you have installed. What else it can do is described on the
page [[positron]].

**Posit Assistant** is the AI assistant that has been built into Positron
since version 2026.07, where it replaces the earlier Positron Assistant. In a
chat you ask it about your code, have it explain an error message or suggest
a step. It knows more than the text you send it: the open files, the loaded
data, your charts and what last happened in the console. The language model
behind it comes from a provider that you connect Positron to once; without
this connection the assistant stays silent.

## Installation step by step

### 1. R

Open [cloud.r-project.org](https://cloud.r-project.org/) and download the
current version for your operating system. Positron needs at least R 4.2,
but take the newest one.

- **Windows:** Under *Download R for Windows* → *base* you download a file
  `R-…-win.exe`. Start it and keep the defaults. You do not need Rtools,
  which the same page offers you.
- **macOS:** Under *Download R for macOS* there are two packages. If your Mac
  has an M chip, take the one with `arm64` in its name, otherwise the one
  with `x86_64`. You can see which chip you have under Apple menu → *About
  This Mac* in the line *Chip*. Open the package and follow the steps.

### 2. Positron

Download Positron from
[positron.posit.co/download](https://positron.posit.co/download.html).

- **Windows:** Take the *User install*. It needs no administrator rights and
  installs Positron for you only. On Windows Positron needs the current
  *Visual C++ Redistributable* from Microsoft, which the download page links
  to; most computers already have it.
- **macOS:** Take *Apple Silicon* if your Mac has an M chip, otherwise
  *Intel*. Open the downloaded file and drag Positron into the Applications
  folder.

### 3. A folder for your analysis

Positron works with folders, and every analysis gets its own. Create a
folder, for instance `eda` in your *Documents*, and open it in Positron via
*File → Open Folder*. In it, create a file of type *R File* via *File → New
File* and save it as `setup.R`.

As soon as a folder contains an R file, Positron starts an R session by
itself when you open it, with your system's default version or, if there is
none, with the newest one. Below you then see the **Console** with the
version number of R. If no session is running yet, choose R at the top
right.

### 4. The tidyverse

Write this line into `setup.R`, put the cursor in it and press **Ctrl+Enter**
(on a Mac **Cmd+Enter**):

```r static
install.packages("tidyverse")
```

R now downloads a whole series of packages, which can take a few minutes. You
only have to do this once; afterwards you load the tidyverse in every script
with `library(tidyverse)`, as [[r-packages]] describes.

### 5. Check that everything works together

Run these lines:

```r static
library(tidyverse)

mpg |>
  ggplot() +
  aes(x = displ, y = hwy) +
  geom_point()
```

If a scatter plot of cars appears in the **Plots** pane, R, Positron and the
tidyverse work together. In the **Variables** pane you see nothing yet,
because `mpg` belongs to ggplot2 and is not an object of its own. To try it
out, write `my_cars <- mpg` into the console: now `my_cars` is listed there, and a
click on the table icon next to it opens the data in the **Data Explorer**.

## Connecting the assistant

Posit Assistant needs a provider that supplies the language model. For
students **GitHub Copilot** is the easiest way, because GitHub gives it to
verified students at no cost as *Copilot Student*, and it also makes
suggestions right while you type.

1. **GitHub account.** Create an account on [github.com](https://github.com)
   if you do not have one yet, preferably with your university address.
2. **Get verified as a student.** At
   [github.com/settings/education/benefits](https://github.com/settings/education/benefits)
   you apply for the benefits of GitHub Education. For this you need your
   university address or a current certificate of enrolment. The check can
   take a few days; until then you have the free version Copilot Free with a
   limited allowance.
3. **Connect in Positron.** Open the command palette with **Ctrl+Shift+P**
   (on a Mac **Cmd+Shift+P**), type `Posit Assistant: Configure AI Providers`
   and click **Connect** next to **GitHub Copilot**. Positron sends you to the
   browser, where you sign in to GitHub and allow the access.
4. **Open the chat.** Via the command palette, `View: Show Posit Assistant`
   opens the chat. As a first question, ask it what is in your table `my_cars`.

While you type, Copilot now suggests the rest of the line in grey. **Tab**
accepts the suggestion, **Esc** dismisses it.

Instead of GitHub Copilot you can connect another provider, for instance
Anthropic or OpenAI with a key of your own that you pay for there directly,
or Posit AI Pass, Posit's own offer. The list appears in the same window as
above. Suggestions while you type come only with GitHub Copilot and Posit AI
Pass; with the other providers you have the chat.

> [!IMPORTANT]
> The assistant sends your provider not only your question but also the
> context, that is code, console output and information about the loaded
> data. Posit itself stores none of it as long as you use an outside
> provider such as GitHub, but the provider does under its own rules. For the
> public data sets of this platform that is no problem. If you work with data
> in which people can be identified, for instance from a survey of your own,
> switch the assistant off in the settings (`assistant.enabled`) before you
> load them.

A key, if you use one, is like a password: send it to nobody and paste it
into no chat, not even the one with the assistant.

## How to work with the assistant

The assistant is good at translating an error message, explaining a function
or writing a first draft of a chart. Depending on the settings it asks you
before it changes a file or runs code; keep these questions switched on
instead of approving everything. Read every suggestion before you take it
over, and run it line by line. Whether a result is right you can only tell
if you understand what the code does, and that is exactly what the lessons of
this platform practise.

## If something does not work

1. **Positron does not find R.** Close Positron completely and open it again,
   because it only sees a freshly installed R after a restart. If that does
   not help, check that you really installed R and not just Positron.
2. **`install.packages()` stops with an error.** Check the internet
   connection and try again. If R asks whether to install packages *from
   source*, answer `no`.
3. **The assistant does not answer.** Usually the connection to the provider
   is missing. Open `Posit Assistant: Configure AI Providers` again and check
   whether your provider is shown as connected.

Or ask the assistant itself once it runs: copy the error message into the
chat and have it explained.
