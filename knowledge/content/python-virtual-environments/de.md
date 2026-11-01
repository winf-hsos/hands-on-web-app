---
type: lesson
code: 2938
title: Virtuelle Python-Umgebungen
summary: >-
  Eine virtuelle Umgebung ist ein Ordner in deinem Projekt mit einem eigenen
  Python und eigenen Paketen. So braucht jedes Projekt nur, was es selbst
  installiert, und Projekte kommen sich nicht in die Quere.
objectives:
  intro: "In dieser Lektion richtest du für ein Projekt eine eigene Python-Umgebung ein und kannst danach:"
  goals:
    - "erklären, welches Problem eine virtuelle Umgebung löst"
    - "mit `python -m venv .venv` eine Umgebung im Projektordner anlegen"
    - "die Umgebung in der PowerShell und auf dem Mac aktivieren und mit `deactivate` wieder verlassen"
    - "am Prompt erkennen, ob eine Umgebung aktiv ist"
    - "mit `pip` Pakete in die Umgebung installieren und mit `requirements.txt` festhalten, welche ein Projekt braucht"
level: 2
duration: 15
topics: [working-with-the-computer, programming-with-python]
modules: [dup]
relations:
  requires: [python-on-the-command-line]
status: draft
updated: 2026-11-01
---

Python bringt viel mit, aber für vieles greifst du auf **Pakete** zurück, die
andere geschrieben haben: `requests` für Anfragen ans Netz, `pandas` für
Tabellen, `matplotlib` für Grafiken. Installiert werden sie mit `pip`, dem
Paketmanager von Python. Ohne weitere Vorkehrung landen sie dabei in der einen
Python-Installation deines Rechners, die alle deine Projekte teilen.

## Das Problem: alle Projekte teilen sich alles

Das geht so lange gut, bis zwei Projekte Verschiedenes brauchen. Ein altes
Projekt läuft nur mit einer älteren Fassung eines Pakets, ein neues braucht
die aktuelle. Installierst du für das neue Projekt die aktuelle, funktioniert
das alte nicht mehr. Außerdem sammeln sich mit der Zeit Pakete an, von denen
niemand mehr weiß, welches Projekt sie braucht.

Eine **virtuelle Umgebung** (englisch *virtual environment*, kurz *venv*)
löst beides. Sie ist ein Ordner im Projekt, der ein eigenes Python und einen
eigenen Platz für Pakete enthält. Was du installierst, während sie aktiv ist,
landet nur dort.

![Links die Python-Installation des Rechners; rechts zwei Projektordner, jeder mit einem eigenen Ordner .venv, in dem andere Fassungen desselben Pakets liegen](figure:two-environments "Jedes Projekt hat seine eigene Umgebung mit seinen eigenen Paketen; die Installation des Rechners bleibt unberührt.")

## Eine Umgebung anlegen

Wechsle in den Projektordner und lass Python die Umgebung anlegen. Der Ordner
heißt üblicherweise `.venv`:

```powershell
python -m venv .venv
```

```zsh
python3 -m venv .venv
```

`-m venv` heißt: Führe das Modul `venv` aus, das zu Python gehört. Danach
liegt im Projekt ein Ordner `.venv` mit einigen Tausend Dateien. Hineinsehen
musst du nicht, und von Hand ändern solltest du darin nichts.

## Aktivieren und verlassen

Damit `python` und `pip` die Umgebung benutzen, aktivierst du sie, und zwar
in jedem neuen Fenster der Kommandozeile wieder:

```powershell
.venv\Scripts\Activate.ps1
```

```zsh
source .venv/bin/activate
```

Der Prompt beginnt jetzt mit `(.venv)`. Solange das dasteht, ist die Umgebung
aktiv, und auch auf dem Mac heißt der Befehl darin einfach `python`. Mit
`deactivate` verlässt du sie wieder.

> [!NOTE]
> Meldet die PowerShell beim Aktivieren, dass die Ausführung von Skripts auf
> diesem System deaktiviert ist, erlaube sie einmalig für dein Benutzerkonto
> und versuche es erneut:
>
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
> ```

## Pakete installieren

In der aktiven Umgebung installierst du Pakete mit `pip`. `pip list` zeigt,
was installiert ist:

```powershell
pip install requests
pip list
```

Die Umgebung selbst gibst du nicht weiter und legst sie auch nicht in die
Cloud, denn sie ist groß und passt nur auf deinen Rechner. Weiter gibst du die
Liste der Pakete. `pip freeze` schreibt sie in eine Datei, und wer das Projekt
bekommt, legt eine eigene Umgebung an und installiert daraus genau dieselben
Fassungen:

```powershell
pip freeze > requirements.txt
pip install -r requirements.txt
```

Geht etwas schief, löschst du `.venv` einfach und legst die Umgebung neu an;
mit `requirements.txt` ist sie in einer Minute wiederhergestellt.
