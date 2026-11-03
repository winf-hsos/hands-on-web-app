---
title: "Required software in the LiFi project"
summary: >-
  The five programs that have to be on your laptop before your first line of code, what each one is for, and how you install them: the first by hand, the rest with your AI assistant.
objectives:
  intro: "Here you set up your laptop for the LiFi project and can then:"
  goals:
    - "say which of the five programs is there for what"
    - "install OpenCode and set up the course folder so that your assistant can take over"
    - "check that Python, Brick Daemon, Brick Viewer and the course module lifi_hardware work together"
    - "use the Brick Viewer to decide whether a fault is in your program or before it"
translation_of: de
based_on: 2026-11-03
---

Five programs have to be on your laptop before your first line of code. All of
them are free, and all of them run on Windows and on macOS. You install only
the first one by hand; your AI assistant helps you with the other four.

| Program | What you need it for | Where to get it |
|---|---|---|
| **OpenCode** | your AI assistant | [opencode.ai/download](https://opencode.ai/download) |
| **Python** | the language you program in | [python.org](https://www.python.org/downloads/) |
| **Visual Studio Code** | the editor you write in | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Brick Daemon** | connects your hardware to the laptop | [Tinkerforge downloads](https://www.tinkerforge.com/en/doc/Downloads.html) |
| **Brick Viewer** | shows whether the hardware is recognised, and helps you find faults | [Tinkerforge downloads](https://www.tinkerforge.com/en/doc/Downloads.html) |

On top of these comes the course module `lifi_hardware`, which is how your
programs talk to your device. It is installed with a single command and brings
the Tinkerforge library with it; what it can do is in [[lifi-hardware]]. The
slides [[first-light]] show the whole setup at a glance, from your device to
the green LED.

## What each program does

**OpenCode** is the AI assistant. It reads and changes the files in your
course folder, runs commands for you when you allow it, and knows this course.

**Python** is the language you write your sender and receiver in. It reads
almost like English, which makes it a good first language, but it is not a
toy: Python is one of the most widely used languages there are, in data
analysis, artificial intelligence, automation, scientific computing and a
large part of the web. What you learn here you can use straight away
elsewhere.

**Visual Studio Code** is the editor. This is where you write your code, where
you see your files, and where the terminal lives in which you start your
programs.

**Brick Daemon** is a background program. It runs invisibly and translates
between the hardware on the USB port and your Python programs; without it your
program cannot find the device. When one day nothing works at all, "is the
Brick Daemon even running?" is one of the first questions to ask.

**Brick Viewer** is a window onto your hardware. It shows you which parts are
recognised, lets you switch the LED by hand and watch the sensor values run,
all without a line of your own code. For finding faults it is worth gold: if
it works in the Brick Viewer, the fault is in your program, and if it does
not, the fault is somewhere before your program.

**Git** you do not need. It is a tool for keeping track of versions of files,
and if you already know it, you can use it to fetch the course folder instead
of the ZIP; that way is described below under the alternatives.

## Installation step by step

The installation has two parts. In the first part you do three things by
hand, the minimum your assistant needs to run. In the second part your
assistant takes over: with the command `/onboarding` it installs the rest
together with you and checks every step on your laptop. Every step of the
second part is also described here by hand, so you can look something up or do
it yourself.

## Part 1: until your assistant runs

### 1. OpenCode

Download the desktop app from [opencode.ai/download](https://opencode.ai/download)
and install it like any other program.

- **Windows:** Download the Windows installer, run it and follow the steps.
- **macOS:** Download the version for your Mac, *Apple Silicon* if your Mac
  has an M chip, *Intel* otherwise. You find out under Apple menu > *About
  This Mac*: the line *Chip* says Apple M1, M2 and so on. Open the downloaded
  file and drag OpenCode into the Applications folder.

If you prefer working in a terminal, there is also a terminal version,
described below under the alternatives.

### 2. The course folder

The course folder holds everything your assistant needs to know about this
project, and it is the folder you work in for the whole project.

1. Open [github.com/winf-hsos/lifi-project](https://github.com/winf-hsos/lifi-project),
   click the green button **Code** and then **Download ZIP**. Or download it
   directly:
   [lifi-project-main.zip](https://github.com/winf-hsos/lifi-project/archive/refs/heads/main.zip).
2. Unpack the ZIP file: on **Windows** right-click it, choose *Extract All*
   and confirm, on **macOS** double-click it.
3. You now have a folder `lifi-project-main`. Move it to a place where you
   will find it again, for example your *Documents* folder. You may rename it
   to `lifi-project`.

> [!WARNING]
> On Windows there is a trap: if you only double-click the ZIP file, Windows
> shows you its contents as if it were a folder, but nothing is unpacked, and
> your assistant cannot work in there. Always use *Extract All*.

Inside the folder you will see:

- `my-code`: **your folder.** Everything you write goes here, and your copy
  of each challenge lands here.
- `course`: the course material. Your assistant reads it; you do not change
  it.
- a few more files for OpenCode, which you can ignore.

### 3. Open the folder and start

Start OpenCode. On its start page you see a list **Projects** on the left.

1. **Add your course folder.** Click the small folder icon with the plus next
   to *Projects* (its tooltip says *Add project*). In the window that opens,
   select your course folder, `lifi-project-main` or `lifi-project`, and click
   *Select Folder*. It now appears in the list of projects.
2. **Start a session.** Click **New session**. Below the input field you see
   the model your course folder has selected for you: the course model from
   OpenAI. It needs the course key, which comes next.

**The course key** is a long line of characters that you get in your course.
You enter it in OpenCode: click **Settings** below the list of projects, then
**Providers** on the left. At the provider the key is for, click **+ Connect**
(if it is not in the list, click *Show more providers* first), choose
**API key** and paste it.

> [!IMPORTANT]
> A key costs money every time the assistant answers. Treat it like a
> password: do not send it to anyone and do not paste it into a chat, not even
> the one with your assistant.

## Part 2: your assistant takes over

In the new session, type

```
/onboarding
```

and press Enter. Your assistant asks you three short questions and then
installs the rest with you, one step at a time: Python, Visual Studio Code,
the Brick Daemon and Brick Viewer, and the course module `lifi_hardware`.
Before it installs anything, it tells you what it is about to do and waits for
your OK. At the end it tests your device: your LED lights up green, and the
sensor reports its first readings.

You do not need the instructions below for that; they describe the same steps
by hand.

### Python

**Windows:** Download the installer from
[python.org/downloads](https://www.python.org/downloads/) and run it.

> [!IMPORTANT]
> In the first window, tick **"Add python.exe to PATH"** before you click
> "Install Now". Without that tick the command line will not find Python
> later, and this is by far the most common stumbling block.

To check, open the **Command Prompt** and type

```powershell
python --version
```

A version number should appear, something like `Python 3.13.1`.

**macOS:** A Mac comes with an older Python preinstalled, but you should not
use that one. Download the installer from
[python.org/downloads](https://www.python.org/downloads/) and run it. To
check, open the **Terminal** and type

```bash
python3 --version
```

A version number should appear, something like `Python 3.13.1`. Remember: on
a Mac the command is `python3`, not `python`.

### Visual Studio Code

Download the editor from [code.visualstudio.com](https://code.visualstudio.com/)
and install it. On Windows you can also type
`winget install --id Microsoft.VisualStudioCode -e` in a terminal; that is
what your assistant does. Later, when you open your first Python file, VS Code
offers to install the Python extension. Accept.

Two things to try right away:

- **Open a folder** via *File > Open Folder*. VS Code always works with a
  folder, not with single files.
- **Open a terminal** via *Terminal > New Terminal*. This window at the bottom
  of the editor is the command line where you start your programs.

Then open your course folder in VS Code. You write your programs in
`my-code`.

### Brick Daemon and Brick Viewer

You get both from the
[Tinkerforge download page](https://www.tinkerforge.com/en/doc/Downloads.html).
Download the version for your operating system and install it: on **Windows**
these are two `.exe` installers, on **macOS** two `.dmg` packages that you
open and drag into the Applications folder.

The Brick Daemon starts by itself afterwards and keeps running as a background
service. You do not see it, and that is normal.

### The course module lifi_hardware

This is how your Python programs talk to the hardware. `/onboarding` installs
it for you; by hand, in a terminal:

```bash
pip install https://github.com/winf-hsos/lifi-hardware/archive/refs/heads/main.zip
```

On a Mac, use `pip3` instead of `pip` if needed. The package brings the
Tinkerforge library along, so you do not install that separately.

### Check that everything works together

Connect a device over USB and start the Brick Viewer. If your Master Brick
shows up there with the LED and the colour sensor, the installation is
complete. Click around and switch the LED on by hand. That is not programming
yet, but it is proof that everything is talking to everything else.

## Getting updates

During the project new material is added: new templates, new pages, sometimes
a new version of `lifi_hardware`. When your course says there is something
new, type `/update-semester` in OpenCode. Your assistant fetches the newest
version of the course folder. Your folder `my-code` is not touched;
everything else is replaced by the course version, so do not change it.
There is one exception, when a challenge gets a new form: then the update
resets its folder in `my-code` once, the old templates go and the
instructions are replaced, while files with names of your own stay.

## Alternatives

### The course folder with Git

If you know Git, you can clone the course folder instead of downloading the
ZIP. First you need Git:

- **Windows:** Download Git from [git-scm.com/downloads](https://git-scm.com/downloads)
  and install it; you can accept the installer's defaults throughout. This
  also installs **Git Bash**, a terminal you need for the terminal version of
  OpenCode. To check, close VS Code completely and open it again (a program
  you just installed only becomes visible to VS Code after a restart), open a
  terminal and type `git --version`.
- **macOS:** In the Terminal, simply type `git --version`. If Git is missing,
  macOS offers to install the Command Line Tools by itself; accept and wait
  until it is done. Alternatively via [Homebrew](https://brew.sh):
  `brew install git`.

Then, in a terminal:

```bash
git clone https://github.com/winf-hsos/lifi-project.git
```

Everything else works the same way, and `/update-semester` notices that your
folder is a Git clone. One rule applies: do not commit in this folder. The
update resets it to the course version and removes commits made there. Your
own work in `my-code` is not tracked by Git and stays untouched.

### OpenCode in the terminal

Instead of the desktop app you can use OpenCode in a terminal, for example the
one in VS Code.

**Windows:** First make **Git Bash** the standard terminal of VS Code, once:
press Ctrl+Shift+P, type `Terminal: Select Default Profile`, press Enter and
choose **Git Bash**. OpenCode only works in this terminal, and this way every
new terminal is a Git Bash. Then open a new terminal (*Terminal > New
Terminal*) and type:

```bash
curl -fsSL https://opencode.ai/install | bash
```

**macOS:** In the terminal in VS Code:

```bash
curl -fsSL https://opencode.ai/install | bash
```

Alternatively via [Homebrew](https://brew.sh): `brew install sst/tap/opencode`.

To check, open a new terminal and type `opencode --version`; a version number
should appear. Then change into your course folder in the terminal and start
OpenCode with `opencode`. You enter your key there with the command
`/connect`.

## When something does not work

The questions that help most often:

1. Is the Brick Daemon running? Without it no program finds the hardware.
2. Does the Brick Viewer show your device? If not, the fault is before your
   code. Unplug the USB cable and plug it in again: that cures a surprising
   number of cases.
3. Are you using `python` or `python3`, `pip` or `pip3`? On a Mac it is almost
   always the one with the 3.

Or ask your assistant to check your setup. It runs the same test as in
`/onboarding` and tells you what is missing.
