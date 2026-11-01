---
type: lesson
code: 3916
title: Werten einen Namen geben
summary: >-
  Mit dem Pfeil <- legst du ein Ergebnis unter einem Namen ab und rechnest mit
  dem Namen weiter; dazu die Regeln für gute Namen.
objectives:
  intro: "In dieser Lektion lernst du, Ergebnissen mit dem Pfeil `<-` einen Namen zu geben, und kannst danach:"
  goals:
    - "einen Wert mit `<-` unter einem Namen ablegen und mit dem Namen weiterrechnen"
    - "erklären, warum eine Zuweisung nichts anzeigt und ein neuer Wert den alten überschreibt"
    - "gültige und aussagekräftige Namen in Kleinbuchstaben mit `_` zwischen den Wörtern wählen und beachten, dass Groß- und Kleinschreibung zählt"
    - "die Meldung, dass R ein Objekt nicht findet, auf einen Tippfehler oder eine noch nicht ausgeführte Zeile zurückführen"
level: 1
duration: 8
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-as-calculator]
status: draft
updated: 2026-11-01
---

Ein Ergebnis, das R nur anzeigt, ist im nächsten Moment wieder weg. Damit du
damit weiterrechnen kannst, gibst du ihm einen Namen. Programmierer sprechen
von einer *Variable*: einem Namen, hinter dem ein Wert steht.

## Der Pfeil

Mit `<-` legst du einen Wert unter einem Namen ab. Den Pfeil liest man
„bekommt“: `price` bekommt den Wert 1,09. Danach steht der Name für den Wert,
und R zeigt ihn an, sobald du ihn allein in eine Zeile schreibst:

```r
price <- 1.09
price_with_tax <- price * 1.07
price_with_tax
```

Die erste und die zweite Zeile zeigen nichts an, denn Zuweisen ist kein
Anzeigen. Erst die dritte fragt nach dem Wert.

Auch `=` funktioniert als Zuweisung, aber in R ist der Pfeil üblich, und so
steht es auch in den meisten Beispielen, die du im Netz findest.

## Überschreiben

Weist du einem Namen einen neuen Wert zu, ist der alte weg. Das gilt auch,
wenn der neue Wert aus dem alten berechnet wird:

```r
litres <- 2
litres <- litres + 1
litres
```

## Gute Namen

Ein Name darf Buchstaben, Ziffern, `_` und `.` enthalten, muss aber mit einem
Buchstaben beginnen. Leerzeichen sind nicht erlaubt, und R unterscheidet
Groß- und Kleinschreibung: `Price` und `price` sind zwei verschiedene Namen.

Üblich ist, Namen klein zu schreiben und Wörter mit `_` zu trennen, etwa
`price_per_litre`. Ein guter Name sagt, was drinsteht; `x` verrät das nicht.

## Wenn R einen Namen nicht kennt

Vertippst du dich oder benutzt du einen Namen, bevor du ihm etwas zugewiesen
hast, meldet R, dass es das Objekt nicht findet:

```r
price <- 1.09
prise * 2
```

Diese Meldung wird dir oft begegnen. Fast immer ist es ein Tippfehler oder
eine Zeile, die noch nicht ausgeführt wurde.

## Zum Mitnehmen

- `<-` gibt einem Wert einen Namen, den du statt des Werts benutzen kannst.
- Ein neuer Wert überschreibt den alten.
- Namen klein, mit `_` zwischen Wörtern; Groß- und Kleinschreibung zählt.
