---
type: lesson
code: 3754
title: Dateien und Ordner
summary: >-
  Alles, was auf einem Rechner gespeichert ist, steckt in Dateien, und Dateien
  liegen in Ordnern, die wieder in Ordnern liegen. Der Pfad ist die Adresse,
  unter der du eine Datei in diesem Baum findest.
objectives:
  intro: "In dieser Lektion lernst du, wie ein Rechner seine Dateien ordnet, und kannst danach:"
  goals:
    - "erklären, was eine Datei ist und wozu ihr Name und ihre Endung dienen"
    - "die Dateiendungen im Explorer oder im Finder sichtbar machen"
    - "beschreiben, wie Ordner einen Baum bilden, der bei einem obersten Ordner beginnt"
    - "einen Pfad unter Windows (`C:\\Users\\…`) und auf dem Mac (`/Users/…`) lesen und selbst aufschreiben"
    - "einen absoluten von einem relativen Pfad unterscheiden"
level: 1
duration: 15
topics: [working-with-the-computer]
modules: [dup]
status: published
updated: 2026-11-01
---

Alles, was du auf deinem Rechner speicherst, landet in einer **Datei**: ein
Foto, eine Hausarbeit, ein Lied und auch ein Programm, das du schreibst. Eine
Datei ist eine Folge von Bytes mit einem Namen, und der Rechner merkt sich, wo
auf dem Speicher diese Bytes liegen. Damit du deine Dateien wiederfindest,
legst du sie in **Ordner**. In der Kommandozeile heißen Ordner oft auch
**Verzeichnisse** (englisch *directory*); gemeint ist dasselbe.

## Name und Endung

Der Name einer Datei hat meist zwei Teile, die ein Punkt trennt:
`hausarbeit.docx`, `urlaub.jpg`, `hallo.py`. Der Teil nach dem letzten Punkt
ist die **Endung**. Sie sagt dem Betriebssystem, welche Art von Inhalt in der
Datei steht und mit welchem Programm es sie öffnen soll: `.docx` mit Word,
`.jpg` mit einer Bildanzeige, `.py` mit einem Editor für Python. Am Inhalt
ändert die Endung nichts; wer `hallo.py` in `hallo.txt` umbenennt, hat danach
immer noch dasselbe Programm, nur öffnet der Rechner es anders.

Windows und macOS blenden die Endungen in der Grundeinstellung aus. Wer
programmiert, braucht sie aber, sonst heißt die Datei, die du als `hallo.py`
speichern wolltest, in Wahrheit `hallo.py.txt`. Schalte sie deshalb einmal
ein:

- **Windows:** im Explorer unter **Anzeigen → Einblenden →
  Dateinamenerweiterungen**.
- **Mac:** im Finder unter **Finder → Einstellungen → Erweitert → Alle
  Dateinamensuffixe einblenden**.

## Ordner bilden einen Baum

Ein Ordner kann Dateien enthalten und weitere Ordner, und die können wieder
Ordner enthalten. So entsteht ein **Baum**, der bei einem obersten Ordner
beginnt. Unter Windows ist das ein Laufwerk wie `C:\`, auf dem Mac der Ordner
`/`, den man auch **Wurzel** nennt. Darunter liegt unter anderem `Users` mit
einem Ordner für jede Person, die den Rechner benutzt, und darin dein
**Benutzerordner** mit Schreibtisch, Dokumenten und Downloads.

![Ein Ordnerbaum von C:\ über Users, anna und Documents bis zur Datei notizen.txt im Ordner uni; darunter der Pfad zu dieser Datei](figure:folder-tree "Der Pfad ist der Weg durch den Baum: Ordner für Ordner bis zur Datei.")

Im Explorer und im Finder siehst du davon immer nur einen Ordner auf einmal,
aber der Baum dahinter ist immer derselbe.

## Der Pfad: die Adresse einer Datei

Um eine Datei eindeutig zu bezeichnen, schreibst du den Weg auf, der von der
Wurzel durch die Ordner bis zu ihr führt. Dieser Weg heißt **Pfad**. Zwischen
den Ordnern steht ein Trennzeichen, unter Windows der Rückstrich `\`, auf dem
Mac der Schrägstrich `/`:

```text
C:\Users\anna\Documents\uni\notizen.txt
/Users/anna/Documents/uni/notizen.txt
```

Beide Zeilen meinen dieselbe Stelle im Baum, die erste auf einem
Windows-Rechner, die zweite auf einem Mac. Der letzte Teil ist der Name der
Datei, alles davor sind die Ordner, in denen sie steckt.

> [!TIP]
> Explorer und Finder zeigen manche Ordner mit deutschem Namen an, etwa
> „Dokumente“ oder „Bilder“. Im Pfad heißen sie trotzdem `Documents` und
> `Pictures`, und so musst du sie in der Kommandozeile auch schreiben.

## Absolut und relativ

Ein Pfad, der an der Wurzel beginnt, heißt **absolut**: Er führt von jeder
Stelle aus zum Ziel, so wie eine vollständige Postanschrift. Oft ist er aber
unnötig lang. Wenn du ohnehin schon im Ordner `Documents` bist, genügt
`uni\notizen.txt` (auf dem Mac `uni/notizen.txt`). Ein solcher Pfad heißt
**relativ**, weil er von dem Ordner aus gilt, in dem du gerade bist, so wie
die Wegbeschreibung „zweite Tür links“ nur vom richtigen Flur aus stimmt.

Zwei Abkürzungen kommen in relativen Pfaden immer wieder vor:

| Zeichen | bedeutet |
|---|---|
| `.` | der Ordner, in dem du gerade bist |
| `..` | der Ordner eine Ebene darüber |

Von `C:\Users\anna\Documents\uni` aus führt `..\notizen.txt` also zu einer
Datei `notizen.txt` direkt in `Documents`. Genau mit solchen Pfaden bewegst du
dich gleich durch die Kommandozeile.

> [!TIP]
> Leerzeichen und Umlaute in Datei- und Ordnernamen sind erlaubt, machen in
> der Kommandozeile aber Arbeit. Für Ordner, in denen du programmierst, haben
> sich kleine Buchstaben, Ziffern und Bindestriche bewährt: `uebung-1` statt
> `Übung 1`.
