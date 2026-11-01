---
type: lesson
code: 1512
title: Ordner und Dateien anlegen, kopieren und verschieben
summary: >-
  Mit mkdir legst du Ordner an, mit cp kopierst du Dateien, mit mv
  verschiebst und benennst du sie um, und mit rm löschst du sie, und zwar
  endgültig, ohne Papierkorb.
objectives:
  intro: "In dieser Lektion veränderst du mit Befehlen, was auf deinem Rechner liegt, und kannst danach:"
  goals:
    - "mit `mkdir` einen Ordner anlegen"
    - "eine leere Datei anlegen, unter Windows mit `New-Item` und auf dem Mac mit `touch`"
    - "mit `cp` eine Datei kopieren und mit `mv` eine Datei verschieben oder umbenennen"
    - "erklären, warum `rm` vorsichtig zu benutzen ist, und eine Datei damit löschen"
    - "mit `cat` den Inhalt einer Textdatei anzeigen"
level: 1
duration: 20
topics: [working-with-the-computer]
modules: [dup]
relations:
  requires: [command-line-navigating]
status: published
updated: 2026-11-01
---

Bisher hast du dich nur umgesehen. Jetzt veränderst du etwas: Du legst Ordner
und Dateien an, kopierst und verschiebst sie. Probiere alles in einem eigenen
Übungsordner aus, damit nichts Wichtiges dazwischengerät. Wechsle dazu in
deinen Benutzerordner und lege ihn mit dem ersten neuen Befehl an.

## Ordner anlegen: mkdir

`mkdir` steht für *make directory* und legt einen Ordner im aktuellen
Verzeichnis an:

```powershell
cd ~
mkdir uebung
cd uebung
```

## Eine leere Datei anlegen

Hier unterscheiden sich die beiden Systeme. Unter Windows legt `New-Item`
eine leere Datei an, auf dem Mac `touch`:

```powershell
New-Item notizen.txt
```

```zsh
touch notizen.txt
```

Meist legst du Dateien aber mit dem Programm an, mit dem du sie auch füllst,
etwa mit einem Editor. Die Kommandozeile brauchst du dann zum Ordnen.

## Kopieren: cp

`cp` (*copy*) bekommt zwei Argumente: was kopiert werden soll, und wohin. Ist
das Ziel ein Ordner, landet die Kopie darin, unter demselben Namen. Ist das
Ziel ein neuer Name, entsteht die Kopie unter diesem Namen:

```powershell
mkdir archiv
cp notizen.txt archiv
cp notizen.txt notizen-alt.txt
```

Danach gibt es `notizen.txt` dreimal: das Original, eine Kopie in `archiv` und
eine Kopie namens `notizen-alt.txt`. Prüfe es mit `ls` und `ls archiv`.

## Verschieben und umbenennen: mv

`mv` (*move*) sieht aus wie `cp`, nur bleibt nichts zurück: Die Datei wandert
an die neue Stelle. Bekommt `mv` einen neuen Namen statt eines Ordners,
benennt es die Datei um, denn Umbenennen ist für die Shell nichts anderes als
Verschieben an denselben Ort unter anderem Namen:

```powershell
mv notizen-alt.txt archiv
mv notizen.txt ideen.txt
```

![Zwei Ordner nebeneinander, uebung und archiv; bei cp entsteht eine Kopie von notizen.txt in archiv, während das Original bleibt, bei mv wandert ideen.txt ganz hinüber](figure:copy-and-move "Kopieren lässt das Original stehen, Verschieben nimmt es mit.")

## Inhalt ansehen: cat

`cat` gibt den Inhalt einer Textdatei aus. Schreib zuerst etwas hinein, etwa
mit einem Editor, oder direkt in der Kommandozeile, denn `>` leitet die
Ausgabe eines Befehls in eine Datei um:

```powershell
echo "Kommandozeile üben" > ideen.txt
cat ideen.txt
```

Achtung: `>` überschreibt, was vorher in der Datei stand.

## Löschen: rm

`rm` (*remove*) löscht eine Datei:

```powershell
rm ideen.txt
```

> [!WARNING]
> Was du mit `rm` löschst, landet **nicht im Papierkorb**. Es ist sofort weg,
> und es gibt keine Rückfrage. Lösche deshalb nur, was du wirklich nicht mehr
> brauchst, prüfe vorher mit `ls`, ob du im richtigen Ordner bist, und schreibe
> den Namen lieber vollständig, statt mit Platzhaltern wie `*` viele Dateien
> auf einmal zu treffen.

Einen leeren Ordner entfernst du mit `rmdir` und seinem Namen. Ist er nicht
leer, weigert sich `rmdir` auf dem Mac, und die PowerShell fragt nach, ob sie
alles darin mitlöschen soll. Antworte dort mit `N`, wenn du nicht ganz sicher
bist; beides ist eine Bremse, die dich vor dem versehentlichen Löschen ganzer
Ordner schützt.
