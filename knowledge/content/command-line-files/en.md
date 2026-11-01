---
title: Creating, copying and moving folders and files
summary: >-
  With mkdir you create folders, with cp you copy files, with mv you move and
  rename them, and with rm you delete them, permanently and without a
  recycle bin.
objectives:
  intro: "In this lesson you use commands to change what is stored on your computer, and afterwards you can:"
  goals:
    - "create a folder with `mkdir`"
    - "create an empty file, with `New-Item` on Windows and with `touch` on the Mac"
    - "copy a file with `cp` and move or rename a file with `mv`"
    - "explain why `rm` has to be used with care, and delete a file with it"
    - "show the content of a text file with `cat`"
translation_of: de
based_on: 2026-11-01
---

So far you have only looked around. Now you change something: you create
folders and files, copy them and move them. Try everything out in a practice
folder of its own, so that nothing important gets caught up in it. To do
that, change into your home folder and create the practice folder with the
first new command.

## Creating a folder: mkdir

`mkdir` stands for *make directory* and creates a folder in the current
directory:

```powershell
cd ~
mkdir uebung
cd uebung
```

## Creating an empty file

Here the two systems differ. On Windows `New-Item` creates an empty file, on
the Mac `touch`:

```powershell
New-Item notizen.txt
```

```zsh
touch notizen.txt
```

Usually, though, you create files with the program you also fill them with,
such as an editor, and you then need the command line to keep them in order.

## Copying: cp

`cp` (*copy*) takes two arguments: what is to be copied, and where to. If the
target is a folder, the copy ends up inside it under the same name. If the
target is a new name, the copy is created under that name:

```powershell
mkdir archiv
cp notizen.txt archiv
cp notizen.txt notizen-alt.txt
```

After that, `notizen.txt` exists three times: the original, a copy in
`archiv` and a copy called `notizen-alt.txt`. Check it with `ls` and
`ls archiv`.

## Moving and renaming: mv

`mv` (*move*) looks like `cp`, except that nothing stays behind: the file
travels to the new place. If `mv` gets a new name instead of a folder, it
renames the file, because for the shell renaming is nothing other than moving
to the same place under a different name:

```powershell
mv notizen-alt.txt archiv
mv notizen.txt ideen.txt
```

![Two folders side by side, uebung and archiv; with cp a copy of notizen.txt appears in archiv while the original stays, with mv ideen.txt moves all the way across](figure:copy-and-move "Copying leaves the original where it is, moving takes it along.")

## Viewing content: cat

`cat` prints the content of a text file. First write something into the
file, for example with an editor, or directly in the command line, because
`>` redirects the output of a command into a file:

```powershell
echo "Practising the command line" > ideen.txt
cat ideen.txt
```

Careful: `>` overwrites whatever was in the file before.

## Deleting: rm

`rm` (*remove*) deletes a file:

```powershell
rm ideen.txt
```

> [!WARNING]
> What you delete with `rm` does **not end up in the recycle bin**. It is
> gone immediately, and there is no confirmation prompt. So only delete what
> you really no longer need, check with `ls` beforehand that you are in the
> right folder, and write out the full name rather than hitting many files at
> once with wildcards such as `*`.

You remove an empty folder with `rmdir` and its name. If it is not empty,
`rmdir` refuses on the Mac, and PowerShell asks whether it should delete
everything inside as well. Answer `N` there if you are not completely sure;
both are a brake that protects you from deleting whole folders by accident.
