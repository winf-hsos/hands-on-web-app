---
type: lesson
code: 7166
title: Die Kommandozeile
summary: >-
  In der Kommandozeile sagst du dem Rechner mit getippten Befehlen, was er tun
  soll. Du öffnest sie unter Windows als PowerShell und auf dem Mac als
  Terminal und lernst, wie ein Befehl aufgebaut ist.
objectives:
  intro: "In dieser Lektion öffnest du zum ersten Mal die Kommandozeile und kannst danach:"
  goals:
    - "erklären, was die Kommandozeile ist und warum Programmierende sie benutzen"
    - "unter Windows die PowerShell und auf dem Mac das Terminal öffnen"
    - "am Prompt ablesen, in welchem Ordner du gerade bist"
    - "einen Befehl in Befehlsname und Argumente zerlegen"
    - "mit `pwd` den aktuellen Ordner und mit `ls` seinen Inhalt anzeigen"
level: 1
duration: 15
topics: [working-with-the-computer]
modules: [dup]
relations:
  requires: [files-and-folders]
status: published
updated: 2026-11-01
---

Im Explorer oder im Finder klickst du auf Symbole, um Ordner zu öffnen und
Dateien zu verschieben. Dieselben Dinge kannst du auch mit getippten Befehlen
erledigen: Du schreibst eine Zeile, drückst Enter, und der Rechner antwortet
mit einer Zeile Text. Dieses Fenster heißt **Kommandozeile**, auf Englisch
*command line*, oder nach dem Fenster, in dem sie läuft, **Terminal**. Das
Programm darin, das deine Befehle liest und ausführt, heißt **Shell**: unter
Windows die **PowerShell**, auf dem Mac die **zsh**.

## Warum tippen statt klicken?

Für einzelne Dateien ist die Maus oft schneller. Die Kommandozeile hat aber
drei Vorteile, die beim Programmieren zählen. Viele Werkzeuge gibt es nur
dort, auch Python selbst: Ein Programm, das du schreibst, startest du am
einfachsten mit einem Befehl. Befehle lassen sich aufschreiben, wiederholen
und an andere weitergeben, Klickfolgen kaum. Und auf Servern, auf denen später
deine Programme laufen, gibt es oft gar keine Fenster, nur die Kommandozeile.

## Die Kommandozeile öffnen

- **Windows:** Drücke die Windows-Taste, tippe `PowerShell` und öffne
  **Windows PowerShell**. Unter Windows 11 findest du sie auch im **Terminal**,
  das mit einer PowerShell startet.
- **Mac:** Drücke Cmd+Leertaste, tippe `Terminal` und drücke Enter. Du findest
  das Programm auch im Finder unter **Programme → Dienstprogramme**.

Es öffnet sich ein Fenster mit wenig mehr als einer Zeile, die auf deine
Eingabe wartet. Diese Zeile heißt **Prompt**.

![Zwei Terminalfenster nebeneinander, links PowerShell, rechts das Mac-Terminal, in beiden der Befehl ls Documents mit seiner Ausgabe; darunter ist die Zeile aus der PowerShell in Prompt, Befehl und Argument zerlegt](figure:anatomy "Links die PowerShell unter Windows, rechts das Terminal auf dem Mac: Der Prompt sieht anders aus, der Befehl ist derselbe.")

## Der Prompt sagt dir, wo du bist

Der Prompt endet unter Windows mit `>` und auf dem Mac mit `%`. Davor steht
der Ordner, in dem du gerade arbeitest, das **aktuelle Verzeichnis**. Unter
Windows ist das zum Beispiel `PS C:\Users\anna>`, auf dem Mac
`anna@MacBook ~ %`. Die Tilde `~` ist die Abkürzung für deinen Benutzerordner,
auf dem Mac also `/Users/anna`.

Das aktuelle Verzeichnis ist wichtig, weil sich jeder relative Pfad darauf
bezieht. Nach dem Öffnen bist du immer in deinem Benutzerordner.

## Aufbau eines Befehls

Ein Befehl beginnt mit seinem **Namen**, danach folgen, durch Leerzeichen
getrennt, seine **Argumente**: das, worauf der Befehl wirken soll. Probiere
die beiden ersten Befehle aus. `pwd` steht für *print working directory* und
gibt das aktuelle Verzeichnis aus:

```powershell
pwd
```

`ls` steht für *list* und zeigt, was im aktuellen Verzeichnis liegt:

```powershell
ls
```

Gibst du `ls` einen Ordner als Argument mit, zeigt es dessen Inhalt, ohne dass
du dorthin wechseln musst:

```powershell
ls Documents
```

Die Ausgabe sieht in der PowerShell ausführlicher aus als auf dem Mac, weil sie
zu jedem Eintrag auch Art, Datum und Größe nennt. In der ersten Spalte steht
ein `d` (*directory*) für jeden Ordner.

> [!NOTE]
> Die Befehle in diesem Pfad heißen in der PowerShell und auf dem Mac gleich.
> Die PowerShell hat eigentlich längere Namen wie `Get-ChildItem` für `ls`,
> kennt die kurzen aber als Abkürzung. Wo sich die beiden unterscheiden, steht
> es dabei.

## Zwei Helfer, die dir viel Tippen ersparen

- Die **Pfeiltaste nach oben** holt den letzten Befehl zurück, mehrmaliges
  Drücken die davor. So wiederholst du einen Befehl oder korrigierst einen
  Tippfehler, ohne alles neu zu schreiben.
- Die **Tabulatortaste** ergänzt Namen: Tippe `ls Doc` und drücke Tab, und die
  Shell schreibt den Rest von `Documents` selbst. Die PowerShell setzt dabei
  `.\` davor, was „im aktuellen Ordner“ heißt und nichts ändert.

Mit `clear` räumst du das Fenster auf, wenn es zu voll wird; deine Dateien
bleiben davon unberührt.

> [!TIP]
> Das Leerzeichen zwischen Befehl und Argument zählt. `ls Documents`
> funktioniert, `lsDocuments` nicht, denn ohne Leerzeichen sucht die Shell
> einen Befehl mit genau diesem Namen.
