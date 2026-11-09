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
based_on: 2026-11-09
---

## In which folder is the file `C:\Users\anna\Documents\uni\notizen.txt`? {#hcs-001}

- [ ] `Documents`
  > `Documents` is one level higher and holds the folder `uni`, not the file.
- [x] `uni`
  > The part directly before the file name is the folder the file sits in.
- [ ] `notizen.txt`
  > `notizen.txt` is the name of the file itself and not a folder.
- [ ] `C:\`
  > `C:\` is the root of the drive where the path begins, and four more folders follow before the file.

> The last part of a path is the name of the file, and the part before it is the folder the file sits in directly. `uni` in turn sits in `Documents`.

## Which of these paths are absolute? (Several answers may be correct.) {#hcs-002}

- [x] `C:\Users\anna\Documents`
  > The path starts with the drive `C:\` and so at the root.
- [ ] `Documents\uni`
  > The path names no drive and only applies from the folder that contains `Documents`.
- [x] `/Users/anna/Documents`
  > On the Mac and on Linux the root begins with `/`, so the path is absolute.
- [ ] `..\pictures`
  > `..` leads one level up from the current folder, so the path depends on where you are right now.

> An absolute path starts at the root, on Windows with a drive such as `C:\`, on the Mac with `/`. The other two only apply from a particular folder and are relative.

## The prompt reads `PS C:\Users\anna\Documents\uni>`. Where are you after `cd ..`? {#hcs-003}

- [ ] In `C:\Users\anna`
  > You would only get there with a second `cd ..`, because each `..` only goes up one level.
- [x] In `C:\Users\anna\Documents`
  > `..` is the folder directly above `uni`, and that is `Documents`.
- [ ] Still in `uni`, because `..` is not a folder name
  > `..` is a fixed name that exists in every folder, and it stands for the folder above.
- [ ] In `C:\`
  > `cd \` leads to the root of the drive, while `cd ..` only goes up one level.

> `..` stands for the folder one level above the current one. From `uni` that is `Documents`.

## Which command shows you which files are in the current folder? {#hcs-004}

- [ ] `pwd`
  > `pwd` gives the path of the current folder, but not what is in it.
- [x] `ls`
  > `ls` lists the files and folders in the current folder.
- [ ] `cd`
  > `cd` changes the folder and shows nothing while doing so.
- [ ] `cat`
  > `cat` shows the content of a file, not that of a folder.

> `ls` lists the content of a folder. `pwd` only gives the path of the current folder, `cd` changes it, and `cat` shows the content of a file.

## What does `mv report.txt report-final.txt` do? {#hcs-005}

- [ ] A copy called `report-final.txt` is created, and the original stays.
  > `cp` makes a copy, while `mv` moves or renames, and the original is gone afterwards.
- [x] Afterwards the file is called `report-final.txt`, and there is no `report.txt` any more.
  > Because there is no folder `report-final.txt`, `mv` renames the file.
- [ ] The file is moved into a folder called `report-final.txt`.
  > `mv` only moves into a folder if it already exists; it does not create one.
- [ ] The file stays `report.txt`, and `mv` reports an error because `report-final.txt` does not exist yet.
  > The target does not need to exist beforehand, because a new name is exactly the case in which `mv` renames.

> If the target is not an existing folder but a new name, `mv` renames the file. A copy is only created with `cp`.

## You deleted a file with `rm` by mistake. Where do you find it? {#hcs-006}

- [ ] In the recycle bin
  > Explorer and Finder put a file into the recycle bin, whereas `rm` deletes it without that detour.
- [ ] In the folder `.trash` of the current directory
  > `rm` creates no such folder; it keeps nothing back.
- [x] Nowhere, it has been deleted directly
  > `rm` deletes immediately, and you get the file back from a backup at most.
- [ ] In a backup that `rm` makes
  > `rm` makes no backup; you only have one if you set it up yourself.

> `rm` deletes immediately and without asking, and the recycle bin belongs to Explorer and Finder, not to the command line. At most, the file can be restored from a backup.

## `python hallo.py` answers with `can't open file … No such file or directory`. What is the most likely cause? {#hcs-007}

- [ ] There is a typo in the program.
  > Python never gets as far as the content, because it does not find the file, so a typo in it would only show up after that.
- [ ] Python is not installed.
  > The message comes from Python itself, so Python is running.
- [x] You are not in the folder that `hallo.py` is in.
  > Python looks for `hallo.py` in the current folder and does not find it there, and a `cd` into the right folder fixes that.
- [ ] The file is still open in another program.
  > Python can still read a file that is open elsewhere, and the message says that the file does not exist at this place at all.

> Python has started, otherwise the message would not come from Python, and it has not even read the file yet, so a typo in it would not show up so far. It looks for `hallo.py` in the current directory, and the file is not there.
