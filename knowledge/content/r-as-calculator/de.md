---
type: lesson
code: 2735
title: R als Taschenrechner
summary: >-
  Der erste Kontakt mit R: rechnen, Klammern setzen, ganzzahlig teilen und
  Kommentare schreiben, direkt im Browser.
objectives:
  intro: "In dieser Lektion lernst du R von seiner einfachsten Seite kennen, als Taschenrechner im Browser, und kannst danach:"
  goals:
    - "mit `+`, `-`, `*`, `/` und `^` rechnen und dabei Punkt vor Strich und Klammern berücksichtigen"
    - "Dezimalzahlen in R mit Punkt statt Komma schreiben"
    - "mit `%/%` ohne Rest teilen und mit `%%` den Rest berechnen, etwa um ein Alter seinem Jahrzehnt zuzuordnen"
    - "Kommentare hinter `#` schreiben, die deinen Code erklären"
level: 1
duration: 8
topics: [programming-with-r]
modules: [ea]
areas: [ds]
status: published
updated: 2026-11-01
---

R ist eine Programmiersprache, die für die Arbeit mit Daten gemacht wurde.
Bevor es um Daten geht, lernst du R von seiner einfachsten Seite kennen: als
Taschenrechner. Jeder Codekasten auf dieser Seite ist ein kleiner Editor. Du
kannst den Code ändern und mit **Ausführen** starten; R läuft dabei in deinem
Browser, installieren musst du nichts. Beim ersten Klick dauert das Laden
einen Moment.

## Rechnen

R rechnet aus, was du schreibst, und zeigt das Ergebnis sofort an:

```r
3 + 4
19.90 - 2.50
6 * 7
1 / 3
```

Dezimalzahlen schreibst du mit Punkt, nicht mit Komma, wie fast überall beim
Programmieren. Die `[1]` vor jedem Ergebnis kannst du vorerst übersehen; sie
zählt die Werte einer Ausgabe mit und wird erst bei langen Ausgaben nützlich.

## Potenzen und Klammern

Mit `^` rechnest du hoch. Es gilt Punkt vor Strich, und Klammern ändern die
Reihenfolge wie in der Schule:

```r
2^10
2 + 3 * 4
(2 + 3) * 4
```

## Ganzzahlig teilen

Zwei Rechenzeichen begegnen dir beim Auswerten von Daten immer wieder. `%/%`
teilt ohne Rest, `%%` liefert nur den Rest:

```r
17 %/% 5
17 %% 5
```

Damit lässt sich zum Beispiel ein Alter einem Jahrzehnt zuordnen: `47 %/% 10 * 10`
ergibt 40.

## Kommentare

Alles hinter einem `#` ignoriert R. So schreibst du Notizen in deinen Code,
die ihn erklären:

```r
# Preis für einen Liter Milch mit 7 Prozent Mehrwertsteuer
1.09 * 1.07
```

Kommentare sind für Menschen, auch für dich selbst in ein paar Wochen.

## Zum Mitnehmen

- R rechnet mit `+`, `-`, `*`, `/` und `^`, Punkt vor Strich, Klammern zuerst.
- `%/%` teilt ohne Rest, `%%` gibt den Rest.
- Dezimalzahlen mit Punkt, Kommentare hinter `#`.
