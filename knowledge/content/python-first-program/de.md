---
type: lesson
code: 8773
title: Dein erstes Programm
summary: >-
  Ein Programm ist ein Text mit Anweisungen, die der Computer von oben nach
  unten ausführt. Du schreibst dein erstes in Python, direkt hier auf der
  Seite, und lernst, Fehlermeldungen zu lesen.
objectives:
  intro: "In dieser Lektion schreibst du dein erstes Python-Programm und kannst danach:"
  goals:
    - "erklären, dass ein Programm eine Folge von Anweisungen ist, die Python von oben nach unten ausführt"
    - "mit `print()` Texte, Zahlen und leere Zeilen ausgeben, auch mehrere Werte durch Kommas getrennt"
    - "einen String in Anführungszeichen von einer Zahl ohne Anführungszeichen unterscheiden"
    - "Kommentare mit `#` schreiben, die Python überspringt"
    - "eine Fehlermeldung von unten nach oben lesen und einen `SyntaxError` von einem `NameError` unterscheiden"
level: 1
duration: 15
topics: [programming-with-python]
modules: [dup]
status: published
updated: 2026-11-01
---

Ein Programm ist ein Text, in dem Anweisungen an den Computer stehen, und der
Computer führt diese Anweisungen genau so aus, wie sie dastehen: eine nach der
anderen, von oben nach unten. Damit er sie versteht, müssen sie in einer
Sprache mit festen Regeln geschrieben sein, einer **Programmiersprache**. Du
lernst hier **Python**, eine Sprache, die sich gut liest und in der
Wissenschaft, in der Datenanalyse und in der KI weit verbreitet ist.

Installieren musst du nichts. Jeder Kasten mit Code auf dieser Seite ist ein
kleiner Editor: Du kannst den Code ändern und mit **Ausführen** (oder
Strg+Enter) starten, und darunter erscheint, was das
Programm ausgibt. Beim ersten Mal dauert es ein paar Sekunden, bis Python
geladen ist.

## Hallo, Welt

Das erste Programm in fast jeder Sprache gibt einen Gruß aus. In Python ist es
eine einzige Zeile:

```python
print("Hallo, Welt!")
```

`print` ist eine **Funktion**, also ein fertiges Stück Programm, das eine
Aufgabe erledigt, hier: etwas auf den Bildschirm schreiben. Was die Funktion
ausgeben soll, steht in den runden Klammern dahinter. Die Anführungszeichen
sagen Python, dass `Hallo, Welt!` ein Text ist und kein Befehl; einen solchen
Text nennt man **String**.

Ändere den Text zwischen den Anführungszeichen und führe das Programm noch
einmal aus. Mit **Zurücksetzen** kommst du jederzeit zum ursprünglichen Code
zurück.

## Zeile für Zeile

Ein Programm darf beliebig viele Zeilen haben, und Python führt sie in der
Reihenfolge aus, in der sie dastehen:

```python
print("Erste Zeile")
print("Zweite Zeile")
print()
print("Nach einer leeren Zeile")
```

Ein `print()` ohne etwas in den Klammern gibt eine leere Zeile aus. Du kannst
`print` auch mehrere Werte geben, durch Kommas getrennt; dann setzt es jeweils
ein Leerzeichen dazwischen:

```python
print("Ein Tag hat", 24, "Stunden.")
```

Die `24` steht hier ohne Anführungszeichen, weil sie eine Zahl ist und kein
Text. Was es mit diesem Unterschied auf sich hat, lernst du in der nächsten
Lektion.

## Kommentare

Alles, was in einer Zeile hinter einem `#` steht, ignoriert Python. Solche
**Kommentare** sind Notizen für Menschen, die den Code lesen, auch für dich
selbst in ein paar Wochen:

```python
# Begrüßung für den ersten Tag
print("Willkommen!")  # erscheint auf dem Bildschirm
```

## Wenn etwas schiefgeht

Python ist streng: Schon ein fehlendes Anführungszeichen genügt, und das
Programm startet nicht. Führe diesen Code aus und sieh dir an, was passiert:

```python
print("Hallo, Welt!)
```

Statt einer Ausgabe erscheint eine **Fehlermeldung**. Sie wirkt zuerst
abschreckend, sagt aber ziemlich genau, was los ist: in welcher Zeile Python
nicht weiterkam (`line 1`), an welcher Stelle (das `^` darunter) und welche
Art von Fehler es ist. Ein `SyntaxError` bedeutet, dass der Text gegen die
Regeln der Sprache verstößt, hier, weil der String nie endet. Setze das
fehlende Anführungszeichen, und das Programm läuft.

Ein zweiter Fehler, der am Anfang oft vorkommt:

```python
Print("Hallo, Welt!")
```

Python unterscheidet zwischen Groß- und Kleinschreibung. Eine Funktion namens
`Print` gibt es nicht, und deshalb meldet Python einen `NameError`: Es kennt
diesen Namen nicht.

> [!TIP]
> Fehlermeldungen liest man von unten nach oben. Die letzte Zeile nennt die
> Art des Fehlers und meist auch den Grund, darüber steht, wo er passiert ist.

Fehler gehören zum Programmieren dazu, auch bei Profis. Wer programmiert,
verbringt einen guten Teil der Zeit damit, Fehlermeldungen zu lesen und den
Code daraufhin zu verbessern. Wie du jede Meldung Zeile für Zeile liest und
welche Fehler am häufigsten vorkommen, zeigt dir später [[python-error-messages]].

## Zum Mitnehmen

- Ein Programm ist eine Folge von Anweisungen, die Python von oben nach unten
  ausführt.
- `print(...)` gibt aus, was in den Klammern steht. Text steht in
  Anführungszeichen, Zahlen nicht.
- Mit `#` beginnt ein Kommentar, den Python überspringt.
- Eine Fehlermeldung nennt Zeile, Stelle und Art des Fehlers; die letzte Zeile
  sagt am meisten.
