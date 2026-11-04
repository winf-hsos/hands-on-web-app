---
type: exercise
code: 5309
title: "First Light: Gerät, Assistent und erstes Programm"
summary: >-
  Der Einstieg ins LiFi-Projekt: was auf dem Gerät sitzt, was ein KI-Agent wie
  OpenCode anders macht als ein Chat und worauf man dabei achtet, wie der
  Laptop eingerichtet wird, und gemeinsam das erste Programm, ein Küchenwecker
  mit farbiger Lampe im Terminal.
objectives:
  intro: "Mit diesen Folien und den Aufgaben darunter bereitest du dich auf das LiFi-Projekt vor und kannst danach:"
  goals:
    - "die Teile des Geräts benennen und die Kette von deiner Idee über OpenCode, dein Programm, `lifi_hardware` und den Brick Daemon bis zum Licht beschreiben"
    - "erklären, was einen KI-Agenten von einem Chat unterscheidet, und seine Schleife aus Denken, Handeln und Prüfen beschreiben"
    - "Programm und Sprachmodell auseinanderhalten und begründen, warum keine Schlüssel, Passwörter oder persönlichen Daten in den Chat gehören"
    - "erklären, was das Kontextfenster ist und warum eine neue Aufgabe eine neue Sitzung bekommt"
    - "ein Python-Programm im Terminal starten und eine Fehlermeldung von unten nach oben lesen"
    - "einen Küchenwecker in fünf Schritten mit `input()`, `while`, `for`, `def` und `if`/`else` aufbauen und nach jedem Schritt ausführen"
level: 1
duration: 45
topics: [working-with-the-computer, programming-with-python]
modules: [dup]
relations:
  see_also: [problem-decomposition, visual-studio-code]
status: published
updated: 2026-11-04
---

![Folien: First Light](item:first-light-slides)

Unter den Folien stehen die Aufgaben, die du in der Werkstatt mitmachst, zum
Nachlesen und zum Weitermachen zu Hause. Du schreibst dein Programm in
VS Code und startest es im Terminal. Eingerichtet hast du beides vorher, wie
es [[lifi-software]] beschreibt.

Dein Assistent könnte den Küchenwecker in zehn Sekunden schreiben, aber dann
hättest du ein Programm und nichts gelernt. Nutze ihn deshalb als Lehrer: Lass
dir erklären, was eine Zeile macht, lass ihn deine Datei lesen („lies meine
`timer.py`, stimmt Schritt 2?“) oder das Programm selbst starten, und bitte
ihn um einen Hinweis statt um die Lösung.

## Vorbereitung 1: Dein erstes Programm

Öffne deinen Kursordner in VS Code über *Datei > Ordner öffnen*. Klicke links
mit der rechten Maustaste auf den Ordner `my-code`, wähle *Neue Datei* und
nenne sie `hello.py`. Schreib diese Zeile hinein und speichere mit Strg+S
(Cmd+S auf dem Mac):

```python static
print("Hallo, Welt!")
```

Öffne dann über *Terminal > Neues Terminal* ein Terminal. Es beginnt in deinem
Kursordner, also wechselst du mit `cd my-code` in deinen Ordner und startest
das Programm mit `python hello.py`, auf dem Mac mit `python3 hello.py`.

```text
> python hello.py
Hallo, Welt!
```

> [!TIP]
> VS Code bietet beim ersten Öffnen einer `.py`-Datei an, seine
> Python-Erweiterung zu installieren. Nimm das an. Der Abspielknopf oben
> rechts startet das Programm ebenfalls, aber es lohnt sich, einmal zu sehen,
> was dahinter im Terminal passiert.

## Vorbereitung 2: Fragen und antworten

Ändere `hello.py` so, dass das Programm nach deinem Namen fragt und dich
damit begrüßt. Starte es danach noch einmal; die Pfeiltaste nach oben holt im
Terminal den letzten Befehl zurück.

```text
> python hello.py
Wie heißt du? Kim
Hallo, Kim!
```

> [!HINT]
> `input("…")` zeigt die Frage, wartet auf die Eingabetaste und gibt zurück,
> was getippt wurde. Mit `name = …` merkst du dir das unter einem Namen, und
> `+` hängt Texte aneinander.

> [!SOLUTION]
> ```python static
> name = input("Wie heißt du? ")
> print("Hallo, " + name + "!")
> ```

## Der Küchenwecker

Schreib einen Küchenwecker für das Terminal. Er fragt, wie viele Sekunden
laufen sollen, und zählt dann herunter, eine Zeile pro Sekunde. Eine farbige
Lampe zeigt, wie es steht: grün, solange er läuft, gelb in den letzten fünf
Sekunden und rot, wenn die Zeit um ist. Ohne Gerät ist die Lampe ein farbiger
Block im Terminal, mit deinem Gerät wird sie zur LED.

```text
> python timer.py
Wie viele Sekunden? fünf
Bitte nur Ziffern: 8
Timer: 8 Sekunden
████ 8 s
████ 7 s
████ 6 s
████ 5 s
████ 4 s
████ 3 s
████ 2 s
████ 1 s
████ Zeit ist um!
```

Wer alles auf einmal schreibt, verliert sich. Zerlege den Wecker deshalb in
fünf Schritte, von denen jeder sein Werkzeug in Python hat, und starte das
Programm nach jedem Schritt; geht dann etwas kaputt, liegt der Fehler im
letzten Schritt. Wie man ein Problem so schneidet, zeigt
[[problem-decomposition]].

| Schritt | Was passieren muss | Werkzeug |
|---|---|---|
| 1 | die Sekunden abfragen | `input()` |
| 2 | prüfen, ob die Eingabe gültig ist | `while` |
| 3 | jede Sekunde herunterzählen | `for` |
| 4 | eine farbige Lampe zeigen | `def` |
| 5 | entscheiden, welche Farbe | `if` / `else` |

## Schritt 1: Die Sekunden abfragen

Lege in `my-code` die Datei `timer.py` an. Das Programm fragt nach der Zahl
der Sekunden, macht daraus eine ganze Zahl und gibt sie zur Probe aus.

> [!HINT]
> `input()` gibt immer Text zurück, auch wenn du 20 tippst. Probier
> `print(text + 1)` und lies, was Python dazu sagt. `int(text)` macht aus dem
> Text eine ganze Zahl.

> [!SOLUTION]
> ```python static
> text = input("Wie viele Sekunden? ")
> seconds = int(text)
> print("Timer:", seconds, "Sekunden")
> ```

Starte den Wecker jetzt und tippe `fünf` statt einer Zahl. Das Programm bricht
mit einer Fehlermeldung ab:

```text
Traceback (most recent call last):
  File "…\my-code\timer.py", line 2, in <module>
    seconds = int(text)
ValueError: invalid literal for int() with base 10: 'fünf'
```

Lies sie von unten nach oben. Die letzte Zeile sagt, was schiefging: Aus
„fünf“ kann `int()` keine Zahl machen. Die Zeilen darüber sagen, wo es
passiert ist, nämlich in `timer.py` in Zeile 2, und zeigen diese Zeile. Kommst
du nicht weiter, lass deinen Assistenten das Programm mit `fünf` starten und
die Meldung erklären.

## Schritt 2: Die Eingabe prüfen

Sorge dafür, dass das Programm so lange erneut fragt, bis nur Ziffern
eingegeben wurden. Probier danach `fünf` und dann `20`, und frag deinen
Assistenten, was bei `0` passiert.

> [!HINT]
> `text.isdigit()` ist wahr, wenn der Text nur aus Ziffern besteht, also für
> „20“, aber nicht für „fünf“, „-3“ oder „2.5“. `while` heißt „solange“, und die
> eingerückte Zeile darunter wird wiederholt. Die neuen Zeilen gehören zwischen
> `input` und `int`.

> [!SOLUTION]
> ```python static
> text = input("Wie viele Sekunden? ")
> while not text.isdigit():
>     text = input("Bitte nur Ziffern: ")
> seconds = int(text)
> ```

## Schritt 3: Jede Sekunde herunterzählen

Lass das Programm von der eingegebenen Zahl bis 1 herunterzählen, eine Zeile
pro Sekunde, und am Ende „Zeit ist um!“ ausgeben. Rücke danach probeweise
`time.sleep(1)` aus und sieh nach, was sich ändert.

> [!HINT]
> `import time` gehört ganz oben in die Datei, dann wartet `time.sleep(1)`
> eine Sekunde. `range(seconds, 0, -1)` liefert die Zahlen von `seconds`
> rückwärts bis 1, denn die Grenze 0 gehört selbst nicht dazu.

> [!SOLUTION]
> ```python static
> import time
>
> for remaining in range(seconds, 0, -1):
>     print(remaining, "s")
>     time.sleep(1)
>
> print("Zeit ist um!")
> ```

## Schritt 4: Eine farbige Lampe zeigen

Die Lampe brauchst du dreimal in drei Farben, also gibst du ihren Zeilen
einen Namen. Schreib die Funktion `lamp(r, g, b)` unter `import time` ab und
probiere sie mit `lamp(0, 200, 0)` aus; das ist grün. Die Werte für Rot, Grün
und Blau reichen jeweils von 0 bis 255.

```python static
def lamp(r, g, b):
    on = f"\033[48;2;{r};{g};{b}m"
    off = "\033[0m"
    print(on + " " * 12 + off, end=" ")
```

Die Zeichen mit dem Backslash sind Anweisungen an das Terminal, die eine
Hintergrundfarbe ein- und wieder ausschalten; dazwischen stehen zwölf
Leerzeichen, die dadurch farbig werden. Du musst sie nicht verstehen, um
`lamp()` zu benutzen, und genau das ist der Gewinn einer Funktion: Sie
verbirgt die Einzelheiten hinter einem Namen, wie `print()` und `input()`
auch. Siehst du statt einer Farbe seltsame Zeichen, läuft dein Programm in der
alten Windows-Konsole; frag dann deinen Assistenten.

## Schritt 5: Die Farbe wählen

Zeig in jeder Runde der Schleife eine Lampe, gelb bei fünf oder weniger
verbleibenden Sekunden und sonst grün, und nach der Schleife einmal eine rote.
Probier es mit 8 Sekunden.

> [!HINT]
> `if remaining <= 5:` prüft eine Bedingung. Ist sie wahr, läuft der
> eingerückte Block darunter, sonst der Block unter `else:`, und zwar immer
> genau einer von beiden. Gelb ist `lamp(255, 200, 0)`, rot `lamp(255, 0, 0)`.

> [!SOLUTION]
> ```python static
> for remaining in range(seconds, 0, -1):
>     if remaining <= 5:
>         lamp(255, 200, 0)   # gelb
>     else:
>         lamp(0, 200, 0)     # grün
>     print(remaining, "s")
>     time.sleep(1)
>
> lamp(255, 0, 0)             # rot
> print("Zeit ist um!")
> ```

## Das ganze Programm

Lies dein fertiges Programm in VS Code von oben nach unten, so wie Python es
liest. Deshalb steht `import time` ganz oben, dann die Funktion und erst danach
der Teil, der sie benutzt, denn eine Funktion muss definiert sein, bevor sie
aufgerufen wird. Frag deinen Assistenten nach jeder Zeile, die du nicht
erklären kannst.

> [!SOLUTION]
> ```python static
> import time
>
> def lamp(r, g, b):
>     on = f"\033[48;2;{r};{g};{b}m"
>     off = "\033[0m"
>     print(on + " " * 12 + off, end=" ")
>
> text = input("Wie viele Sekunden? ")
> while not text.isdigit():
>     text = input("Bitte nur Ziffern: ")
> seconds = int(text)
> print("Timer:", seconds, "Sekunden")
>
> for remaining in range(seconds, 0, -1):
>     if remaining <= 5:
>         lamp(255, 200, 0)   # gelb
>     else:
>         lamp(0, 200, 0)     # grün
>     print(remaining, "s")
>     time.sleep(1)
>
> lamp(255, 0, 0)             # rot
> print("Zeit ist um!")
> ```

## Für Schnelle

Zeig die verbleibende Zeit in Minuten und Sekunden an, also `1:05` statt
`65 s`.

> [!HINT]
> `remaining // 60` liefert die vollen Minuten und `remaining % 60` die
> übrigen Sekunden. Mit `f"{minutes}:{secs:02d}"` haben die Sekunden immer zwei
> Stellen.

## Wo stehst du?

Wirst du in der Werkstatt gefragt, wo du stehst, antworte mit der Zeile, bis
zu der du gekommen bist. Wer die letzte erreicht hat, hilft dem Team am
Nachbartisch oder baut den Wecker aus.

1. OpenCode ist installiert und der Kursordner geöffnet.
2. Der Assistent antwortet.
3. `/onboarding` ist durchgelaufen.
4. `hello.py` läuft.
5. Der Wecker zählt herunter.
6. Der Wecker zeigt seine Farben.

Mit deinem Gerät wird aus der Lampe im Terminal die LED: Du tauschst `lamp()`
gegen `led.set_color()`, und dein Wecker leuchtet auf dem Tisch.
