---
title: Starting a Python program in the command line
summary: >-
  A Python program is a text file with the extension .py. You write it with an
  editor, change into its folder in the command line and start it with python
  or, on the Mac, with python3.
objectives:
  intro: "In this lesson your Python program leaves the browser, and afterwards you can:"
  goals:
    - "check whether Python is installed and show its version"
    - "save a program as a `.py` file with an editor"
    - "change into the program's folder and start it with `python` (Windows) or `python3` (Mac)"
    - "interpret the error message that appears when the file is not in the current folder"
    - "stop a running program with Ctrl+C"
translation_of: de
based_on: 2026-11-01
---

On this platform your Python programs run in the browser: you press **Run**,
and the output appears below. On your own computer it works differently.
There, a program is a text file whose name ends in `.py`, and in the command
line you hand it to Python, which reads it and carries it out line by line.

## Is Python installed?

Ask Python for its version. On Windows the command is `python`, on the Mac
`python3`:

```powershell
python --version
```

```zsh
python3 --version
```

If the shell answers with a line such as `Python 3.13.1`, everything is
ready. If it does not know the command, install Python from
[python.org](https://www.python.org/downloads/). On Windows the Microsoft
Store sometimes opens instead of an error message; you can install Python
there as well. Close the command line after the installation and open it
again so that it knows the new command.

## Saving the program as a file

For programs you need an **editor** that saves plain text. Good choices are
[Visual Studio Code](https://code.visualstudio.com/) or [[positron]], which
also highlight Python code in colour. Word or Pages are no use, because they
write formatting into the file as well.

Open the folder `studium\programmieren\uebung-1` from the exercise in the
editor, open the file `hallo.py` and write into it:

```python static
name = input("What is your name? ")
print(f"Hello, {name}!")
```

Save the file. Make sure that it really is called `hallo.py` and not
`hallo.py.txt`; that is why you made the file extensions visible.

## Starting the program

In the command line, change into the folder the file is in and give its name
to Python as an argument:

```powershell
cd ~\studium\programmieren\uebung-1
python hallo.py
```

```zsh
cd ~/studium/programmieren/uebung-1
python3 hallo.py
```

Python reads the file and carries it out, and whatever the program prints
with `print` appears in the command line. `input` waits until you type
something and press Enter. After that the program has finished, and the
prompt appears again:

```text
PS C:\Users\anna\studium\programmieren\uebung-1> python hallo.py
What is your name? Anna
Hello, Anna!
PS C:\Users\anna\studium\programmieren\uebung-1>
```

![At the top a PowerShell with the command python hallo.py; below it the model of input, processing and output: the file hallo.py goes into Python, and out comes the text Hello, Anna!](figure:python-runs-file "The file is the input, Python processes it, and the output appears in the command line.")

If you change the program in the editor, you save it and start it again
straight away with the up arrow key and Enter.

## When Python cannot find the file

The most common error message at the beginning looks like this:

```text
python: can't open file 'C:\\Users\\anna\\hallo.py': [Errno 2] No such file or directory
```

Python looks for `hallo.py` in the current directory, and it is not there.
The path in the message tells you where Python looked. Change into the right
folder with `cd` and check with `ls` that the file is there.

## Stopping a program

Some programs run forever, for example when a loop never ends, or they wait
for input you do not want to give. With **Ctrl+C** you stop a running
program, on the Mac also with Control+C and not with Cmd. Python then reports
`KeyboardInterrupt`, and the prompt comes back.
