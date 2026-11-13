---
type: demo
code: 4407
title: The hex viewer
summary: >-
  Any text you type or any file from your own computer, shown byte by byte in
  hex and as characters, with the signature that gives away the file type.
level: 1
duration: 10
topics: [representing-information]
modules: [dup]
relations:
  example_of: [place-value-systems]
status: published
updated: 2026-11-06
---

**Goal:** You see that every file is a sequence of bytes, recognise a file
type from its first bytes and find out how many bytes a character takes in
UTF-8.

**How to use it:** Type a text, or switch to File and choose any file from
your computer or drop it onto the demonstrator; the file is read in your
browser and never leaves it. On the left stands the offset of each row, in
the middle are the bytes in hex and on the right the same bytes as
characters, with a dot wherever a byte is not a printable character. Click a
byte to see it in hex, decimal and binary, and in a typed text also the
character it belongs to. Compare how a photo, a PDF and a Word document
begin, look for the line breaks in a text, and count the bytes of an umlaut
and of an emoji.

```hex-viewer
```
