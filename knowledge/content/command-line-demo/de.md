---
type: demo
code: 7342
title: Ordnerbaum und Kommandozeile
summary: >-
  Ein Terminal unter seinem Ordnerbaum: Du siehst, wo du stehst, welchen Weg
  ein Pfad nimmt, schon während du ihn tippst, und was jeder Befehl im Baum
  verändert, in der PowerShell und auf dem Mac.
objectives:
  intro: "In diesem Demonstrator tippst du Befehle in ein Terminal und siehst zugleich, was sie im Ordnerbaum bewirken. Danach kannst du:"
  goals:
    - "zu jedem Prompt die Stelle im Ordnerbaum zeigen, an der du gerade stehst"
    - "einem relativen oder absoluten Pfad im Baum folgen, bevor du ihn ausführst, auch mit `..` und `~`"
    - "vorhersagen, was `cd`, `ls`, `mkdir`, `cp`, `mv` und `rm` im Baum verändern"
    - "eine Fehlermeldung der Shell einem falschen Namen oder einem falschen Standort zuordnen"
level: 1
duration: 15
topics: [working-with-the-computer]
modules: [dup]
relations:
  example_of: [command-line-navigating, command-line-files]
  see_also: [files-and-folders]
status: published
updated: 2026-11-02
---

**Ziel:** Du siehst, was eine Kommandozeile sonst verbirgt: wo du gerade
stehst, welchen Weg ein Pfad durch den Ordnerbaum nimmt und was ein Befehl
dort verändert. Die Befehle und Fehlermeldungen sind die der PowerShell unter
Windows und des Terminals auf dem Mac, nur das Dateisystem ist ausgedacht und
liegt allein in deinem Browser.

**Bedienung:** Tippe einen Befehl und drück Enter, etwa `ls`, `cd Documents`
oder `mkdir archiv`. Schon beim Tippen leuchtet der Weg des Pfads im Baum auf,
und die Zeile darunter beschreibt ihn. Ein Klick auf einen Ordner schreibt den
passenden `cd`-Befehl, die Tabulatortaste ergänzt Namen, und mit den
Pfeiltasten holst du frühere Befehle zurück. Oben wählst du Windows oder Mac.
Mit „Vorhersagen“ wartet jeder Befehl auf ein zweites Enter, bevor er zeigt,
was er bewirkt.

```shell-demo
tree:
  Desktop: {}
  Documents:
    uni:
      mathe: {}
      notizen.txt: "Zwei Ideen für das LiFi-Projekt\n"
    einkauf.txt: "Milch\nBrot\nÄpfel\n"
  Downloads:
    hallo.py: "print(\"Hallo aus der Kommandozeile!\")\n"
  Meine Fotos:
    urlaub.jpg: ""
```
