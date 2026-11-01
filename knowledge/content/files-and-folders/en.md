---
title: Files and folders
summary: >-
  Everything stored on a computer sits in files, and files sit in folders,
  which in turn sit in folders. The path is the address at which you find a
  file in this tree.
objectives:
  intro: "In this lesson you learn how a computer organises its files, and afterwards you can:"
  goals:
    - "explain what a file is and what its name and extension are for"
    - "make file extensions visible in Explorer or in Finder"
    - "describe how folders form a tree that starts at a topmost folder"
    - "read a path on Windows (`C:\\Users\\…`) and on the Mac (`/Users/…`) and write one down yourself"
    - "tell an absolute path from a relative one"
translation_of: de
based_on: 2026-11-01
---

Everything you save on your computer ends up in a **file**: a photo, a term
paper, a song and also a program that you write. A file is a sequence of
bytes with a name, and the computer keeps track of where on the storage these
bytes are. So that you can find your files again, you put them into
**folders**. In the command line, folders are often called **directories**;
both words mean the same thing.

## Name and extension

The name of a file usually has two parts separated by a dot:
`hausarbeit.docx`, `urlaub.jpg`, `hallo.py`. The part after the last dot is
the **extension**. It tells the operating system what kind of content is in
the file and which program should open it: `.docx` with Word, `.jpg` with an
image viewer, `.py` with an editor for Python. The extension does not change
the content; if you rename `hallo.py` to `hallo.txt`, you still have the same
program, the computer just opens it differently.

Windows and macOS hide extensions by default. When you program, however, you
need them, otherwise the file you meant to save as `hallo.py` is really
called `hallo.py.txt`. So switch them on once:

- **Windows:** in Explorer under **View → Show → File name extensions**.
- **Mac:** in Finder under **Finder → Settings → Advanced → Show all filename
  extensions**.

## Folders form a tree

A folder can contain files and further folders, and those can contain
folders again. This creates a **tree** that starts at a topmost folder. On
Windows that is a drive such as `C:\`, on the Mac the folder `/`, which is
also called the **root**. Below it there is, among other things, `Users`
with a folder for every person who uses the computer, and in it your **home
folder** with your desktop, documents and downloads.

![A folder tree from C:\ through Users, anna and Documents to the file notizen.txt in the folder uni; below it the path to this file](figure:folder-tree "The path is the way through the tree: folder by folder down to the file.")

In Explorer and in Finder you only ever see one folder at a time, but the
tree behind it is always the same.

## The path: the address of a file

To name a file unambiguously, you write down the way that leads from the root
through the folders to it. This way is called a **path**. Between the folders
there is a separator, the backslash `\` on Windows and the forward slash `/`
on the Mac:

```text
C:\Users\anna\Documents\uni\notizen.txt
/Users/anna/Documents/uni/notizen.txt
```

Both lines mean the same place in the tree, the first on a Windows computer,
the second on a Mac. The last part is the name of the file, and everything
before it is the folders it sits in.

> [!TIP]
> On a system set to another language, Explorer and Finder may show some
> folders with translated names, such as “Dokumente” or “Bilder” on a German
> system. In the path they are still called `Documents` and `Pictures`, and
> that is how you have to write them in the command line too.

## Absolute and relative

A path that starts at the root is called **absolute**: it leads to the target
from any place, like a complete postal address. Often, though, it is
needlessly long. If you are already in the folder `Documents`,
`uni\notizen.txt` is enough (on the Mac `uni/notizen.txt`). Such a path is
called **relative**, because it applies from the folder you are currently in,
just as the directions “second door on the left” are only right from the
correct corridor.

Two shorthands come up again and again in relative paths:

| Symbol | means |
|---|---|
| `.` | the folder you are currently in |
| `..` | the folder one level above |

From `C:\Users\anna\Documents\uni`, `..\notizen.txt` therefore leads to a file
`notizen.txt` directly in `Documents`. These are exactly the paths you will
soon use to move through the command line.

> [!TIP]
> Spaces and special characters such as umlauts are allowed in file and
> folder names, but they make extra work in the command line. For folders in
> which you program, lower-case letters, digits and hyphens have proven
> themselves: `uebung-1` instead of `Übung 1`.
