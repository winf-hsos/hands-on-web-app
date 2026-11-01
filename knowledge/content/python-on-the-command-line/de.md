---
type: lesson
code: 1299
title: Ein Python-Programm in der Kommandozeile starten
summary: >-
  Ein Python-Programm ist eine Textdatei mit der Endung .py. Du schreibst sie
  mit einem Editor, wechselst in der Kommandozeile in ihren Ordner und startest
  sie mit python oder, auf dem Mac, mit python3.
objectives:
  intro: "In dieser Lektion verlässt dein Python-Programm den Browser, und du kannst danach:"
  goals:
    - "prüfen, ob Python installiert ist, und die Version anzeigen"
    - "ein Programm als `.py`-Datei mit einem Editor speichern"
    - "in den Ordner des Programms wechseln und es mit `python` (Windows) oder `python3` (Mac) starten"
    - "die Fehlermeldung deuten, die erscheint, wenn die Datei nicht im aktuellen Ordner liegt"
    - "ein laufendes Programm mit Strg+C abbrechen"
level: 1
duration: 20
topics: [working-with-the-computer, programming-with-python]
modules: [dup]
relations:
  requires: [command-line-navigating, python-first-program]
status: published
updated: 2026-11-01
---

Auf dieser Plattform laufen deine Python-Programme im Browser: Du drückst
**Ausführen**, und die Ausgabe erscheint darunter. Auf deinem eigenen Rechner
geht es anders. Dort ist ein Programm eine Textdatei, deren Name auf `.py`
endet, und du übergibst sie in der Kommandozeile an Python, das sie liest und
Zeile für Zeile ausführt.

## Ist Python installiert?

Frage Python nach seiner Version. Unter Windows heißt der Befehl `python`,
auf dem Mac `python3`:

```powershell
python --version
```

```zsh
python3 --version
```

Antwortet die Shell mit einer Zeile wie `Python 3.13.1`, ist alles bereit.
Kennt sie den Befehl nicht, installiere Python von
[python.org](https://www.python.org/downloads/). Unter Windows öffnet sich
statt einer Fehlermeldung manchmal der Microsoft Store; auch dort kannst du
Python installieren. Schließe die Kommandozeile nach der Installation und
öffne sie neu, damit sie den neuen Befehl kennt.

## Das Programm als Datei speichern

Für Programme brauchst du einen **Editor**, der reinen Text speichert. Gut
geeignet sind [[visual-studio-code|Visual Studio Code]] oder
[[positron]], die Python-Code auch farbig hervorheben. Word oder Pages taugen
nicht, weil sie Formatierungen mit in die Datei schreiben.

Öffne den Ordner `studium\programmieren\uebung-1` aus der Übung im Editor,
öffne die Datei `hallo.py` und schreibe hinein:

```python static
name = input("Wie heißt du? ")
print(f"Hallo, {name}!")
```

Speichere die Datei. Achte darauf, dass sie wirklich `hallo.py` heißt und
nicht `hallo.py.txt`; dafür hast du die Dateiendungen sichtbar gemacht.

## Das Programm starten

Wechsle in der Kommandozeile in den Ordner, in dem die Datei liegt, und gib
ihren Namen als Argument an Python:

```powershell
cd ~\studium\programmieren\uebung-1
python hallo.py
```

```zsh
cd ~/studium/programmieren/uebung-1
python3 hallo.py
```

Python liest die Datei, führt sie aus, und was das Programm mit `print`
ausgibt, erscheint in der Kommandozeile. `input` wartet, bis du etwas tippst
und Enter drückst. Danach ist das Programm zu Ende, und der Prompt erscheint
wieder:

```text
PS C:\Users\anna\studium\programmieren\uebung-1> python hallo.py
Wie heißt du? Anna
Hallo, Anna!
PS C:\Users\anna\studium\programmieren\uebung-1>
```

![Oben eine PowerShell mit dem Befehl python hallo.py; darunter das Modell Eingabe, Verarbeitung, Ausgabe: die Datei hallo.py geht in Python hinein, heraus kommt der Text Hallo, Anna!](figure:python-runs-file "Die Datei ist die Eingabe, Python verarbeitet sie, und die Ausgabe erscheint in der Kommandozeile.")

Änderst du das Programm im Editor, speicherst du es und startest es mit der
Pfeiltaste nach oben und Enter gleich noch einmal.

## Wenn Python die Datei nicht findet

Die häufigste Fehlermeldung am Anfang sieht so aus:

```text
python: can't open file 'C:\\Users\\anna\\hallo.py': [Errno 2] No such file or directory
```

Python sucht `hallo.py` im aktuellen Verzeichnis, und dort liegt sie nicht.
Der Pfad in der Meldung verrät, wo Python gesucht hat. Wechsle mit `cd` in
den richtigen Ordner und prüfe mit `ls`, ob die Datei dort steht.

## Ein Programm abbrechen

Manche Programme laufen ewig, etwa wenn eine Schleife nie endet, oder warten
auf eine Eingabe, die du nicht machen willst. Mit **Strg+C** brichst du ein
laufendes Programm ab, auf dem Mac ebenfalls mit Control+C und nicht mit Cmd.
Python meldet dann `KeyboardInterrupt`, und der Prompt kehrt zurück.
