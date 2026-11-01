---
title: "Quiz: The command line"
summary: Seven questions on paths, the commands of the command line and starting a Python program.
objectives:
  intro: "This quiz uses seven questions to check whether you can:"
  goals:
    - "recognise the file name and the folders in a path and tell absolute paths from relative ones"
    - "predict where `cd ..` takes you"
    - "choose the right command for listing, moving and renaming"
    - "judge what happens to a file you delete with `rm`"
    - "trace the error message when starting a Python program back to its cause"
translation_of: de
based_on: 2026-11-01
---

## In which folder is the file `C:\Users\anna\Documents\uni\notizen.txt`?

- [ ] `Documents`
- [x] `uni`
- [ ] `notizen.txt`
- [ ] `C:\`

> The last part of a path is the name of the file, and the part before it is
> the folder the file sits in directly. `uni` in turn sits in `Documents`.

## Which of these paths are absolute? (several are right)

- [x] `C:\Users\anna\Documents`
- [ ] `Documents\uni`
- [x] `/Users/anna/Documents`
- [ ] `..\pictures`

> An absolute path starts at the root, on Windows with a drive such as `C:\`,
> on the Mac with `/`. The other two only apply from a particular folder and
> are relative.

## The prompt reads `PS C:\Users\anna\Documents\uni>`. Where are you after `cd ..`?

- [ ] In `C:\Users\anna`
- [x] In `C:\Users\anna\Documents`
- [ ] Still in `uni`, because `..` is not a folder name
- [ ] In `C:\`

> `..` stands for the folder one level above the current one. From `uni`
> that is `Documents`.

## Which command shows you which files are in the current folder?

- [ ] `pwd`
- [x] `ls`
- [ ] `cd`
- [ ] `cat`

> `ls` lists the content of a folder. `pwd` only gives the path of the
> current folder, `cd` changes it, and `cat` shows the content of a file.

## What does `mv report.txt report-final.txt` do?

- [ ] A copy called `report-final.txt` is created, and the original stays.
- [x] Afterwards the file is called `report-final.txt`, and there is no `report.txt` any more.
- [ ] The file is moved into a folder called `report-final.txt`.

> If the target is not an existing folder but a new name, `mv` renames the
> file. A copy is only created with `cp`.

## You deleted a file with `rm` by mistake. Where do you find it?

- [ ] In the recycle bin
- [ ] In the folder `.trash` of the current directory
- [x] Nowhere, it has been deleted directly

> `rm` deletes immediately and without asking, and the recycle bin belongs to
> Explorer and Finder, not to the command line. At most, the file can be
> restored from a backup.

## `python hallo.py` answers with `can't open file … No such file or directory`. What is the most likely cause?

- [ ] There is a typo in the program.
- [ ] Python is not installed.
- [x] You are not in the folder that `hallo.py` is in.

> Python has started, otherwise the message would not come from Python, and
> it has not even read the file yet, so a typo in it would not show up so
> far. It looks for `hallo.py` in the current directory, and the file is not
> there.
