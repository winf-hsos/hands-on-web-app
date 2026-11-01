---
title: Navigating through folders
summary: >-
  With cd you move from folder to folder in the command line, with .. one
  level up and with ~ back home. After every step the prompt shows you where
  you are.
objectives:
  intro: "In this lesson you move through the folder tree with commands, and afterwards you can:"
  goals:
    - "change into a folder with `cd`, using a relative and an absolute path"
    - "go one level up with `cd ..` and into your home folder with `cd ~`"
    - "check after every move with the prompt, `pwd` and `ls` where you are and what is there"
    - "put folder names that contain spaces in quotation marks"
    - "interpret the error message that appears when there is no folder of that name at that place"
translation_of: de
based_on: 2026-11-01
---

After opening, the command line is in your home folder. To work with files
somewhere else, you change to that place, just as you open a folder with a
double click in Explorer or Finder. The command for this is `cd`, short for
*change directory*.

## One folder down

Give `cd` the folder you want to change into:

```powershell
cd Documents
```

The command prints nothing, but the prompt changes: on Windows it now says
`PS C:\Users\anna\Documents>`, on the Mac `anna@MacBook Documents %`. You can
also go down several levels at once by giving a relative path, with `\` on
Windows and with `/` on the Mac:

```powershell
cd Documents\uni
```

```zsh
cd Documents/uni
```

> [!TIP]
> PowerShell understands the forward slash `/` as well. If you get used to
> it, you type the same thing on both systems.

## One level up, and back home

The two dots `..` stand for the folder above the current one. `cd ..`
therefore goes one level up, and `cd ..\..` (on the Mac `cd ../..`) two
levels. With the tilde you get straight back to your home folder from
anywhere:

```powershell
cd ~
```

![On the left a folder tree with a yellow marker showing which folder you are in; on the right a PowerShell in which cd Documents, cd uni, cd .. and cd ~ are typed one after the other, and the marker moves along](figure:cd-moves "Every cd command puts you at a different place in the tree, and the prompt shows it.")

## An absolute path leads there from anywhere

With an absolute path you jump directly to a place, no matter where you are
at the moment:

```powershell
cd C:\Users\anna\Documents\uni
```

```zsh
cd /Users/anna/Documents/uni
```

Use your own user name instead of `anna`. You can find out what it is with
`pwd`.

## Check after every step

At the beginning it pays to check briefly after every `cd` where you have
ended up: the prompt names the folder, `pwd` gives the whole path, and `ls`
shows what is there. This also shows you where you can go next.

If there is no folder of that name at that place, the shell answers with an
error message, and you stay where you were. In PowerShell it reads
`Cannot find path 'C:\Users\anna\Dokumente' because it does not exist.`, on
the Mac `cd: no such file or directory: Dokumente`. Usually the name is
misspelt, as here, where someone on a German system typed the displayed name
“Dokumente” instead of `Documents`, or you are not in the folder you thought
you were in.

## Folder names with spaces

For the shell, a space separates the command from its arguments. A folder
called `My Photos` would therefore look like two arguments. Put such names
in quotation marks:

```powershell
cd "My Photos"
```

The Tab key does this for you: type `cd My` and press Tab.
