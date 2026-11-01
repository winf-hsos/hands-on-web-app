---
title: Python virtual environments
summary: >-
  A virtual environment is a folder in your project with its own Python and
  its own packages. This way every project only has what it installs itself,
  and projects do not get in each other's way.
objectives:
  intro: "In this lesson you set up a Python environment of its own for a project, and afterwards you can:"
  goals:
    - "explain which problem a virtual environment solves"
    - "create an environment in the project folder with `python -m venv .venv`"
    - "activate the environment in PowerShell and on the Mac and leave it again with `deactivate`"
    - "tell from the prompt whether an environment is active"
    - "install packages into the environment with `pip` and record in `requirements.txt` which ones a project needs"
translation_of: de
based_on: 2026-11-01
---

Python comes with a lot, but for many things you rely on **packages** that
others have written: `requests` for requests to the web, `pandas` for tables,
`matplotlib` for charts. You install them with `pip`, Python's package
manager. Without further precautions they end up in the one Python
installation on your computer, which all your projects share.

## The problem: all projects share everything

This works well until two projects need different things. An old project only
runs with an older version of a package, while a new one needs the current
version. If you install the current version for the new project, the old one
stops working. On top of that, packages pile up over time, and nobody knows
any more which project needs them.

A **virtual environment** (*venv* for short) solves both problems. It is a
folder in the project that contains its own Python and its own place for
packages, and whatever you install while it is active ends up only there.

![On the left the computer's Python installation; on the right two project folders, each with its own folder .venv holding different versions of the same package](figure:two-environments "Every project has its own environment with its own packages, and the computer's installation stays untouched.")

## Creating an environment

Change into the project folder and let Python create the environment. The
folder is usually called `.venv`:

```powershell
python -m venv .venv
```

```zsh
python3 -m venv .venv
```

`-m venv` means: run the module `venv`, which comes with Python. Afterwards
the project contains a folder `.venv` with a few thousand files. You do not
need to look inside, and you should not change anything in it by hand.

## Activating and leaving

So that `python` and `pip` use the environment, you activate it, and you do
so again in every new command line window:

```powershell
.venv\Scripts\Activate.ps1
```

```zsh
source .venv/bin/activate
```

The prompt now starts with `(.venv)`. As long as that is there, the
environment is active, and inside it the command is simply `python`, on the
Mac too. With `deactivate` you leave it again.

> [!NOTE]
> If PowerShell reports during activation that running scripts is disabled
> on this system, allow it once for your user account and try again:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

## Installing packages

In the active environment you install packages with `pip`. `pip list` shows
what is installed:

```powershell
pip install requests
pip list
```

You do not pass the environment itself on, and you do not put it in the
cloud either, because it is large and only fits your computer. What you pass
on is the list of packages. `pip freeze` writes it to a file, and whoever
gets the project creates an environment of their own and installs exactly
the same versions from it:

```powershell
pip freeze > requirements.txt
pip install -r requirements.txt
```

If something goes wrong, you simply delete `.venv` and create the environment
again; with `requirements.txt` it is restored in a minute.
