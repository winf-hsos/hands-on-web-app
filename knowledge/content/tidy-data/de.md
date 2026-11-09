---
type: lesson
code: 9961
title: Tidy Data
summary: >-
  Jede Variable eine Spalte, jede Beobachtung eine Zeile, jeder Wert eine
  Zelle: drei Regeln, nach denen sich Tabellen leicht auswerten lassen, und
  woran man Daten erkennt, die ihnen nicht folgen.
objectives:
  intro: "In dieser Lektion lernst du die Regeln von Tidy Data kennen, nach denen sich Tabellen leicht auswerten lassen, und kannst danach:"
  goals:
    - "die drei Regeln von Tidy Data nennen und prüfen, ob eine Tabelle ihnen folgt"
    - "für eine Fragestellung bestimmen, was in einer Tabelle eine Beobachtung ist"
    - "Werte in Spaltennamen und mehrere Werte in einer Zelle als Verstöße gegen die Regeln erkennen und Codes statt Bedeutungen als Fehlerquelle"
    - "beschreiben, wie eine breite Tabelle durch Pivotieren mit `pivot_longer()` aus `tidyr` in die lange Form kommt"
    - "begründen, warum sich das Aufräumen vor dem Auswerten lohnt"
level: 1
duration: 15
topics: [transforming-data, getting-data]
modules: [ea]
areas: [ds]
relations:
  deepens: [data-transformation-basics]
status: draft
updated: 2026-11-09
---

Die Grundoperationen aus [[data-transformation-basics]] funktionieren am
besten, wenn eine Tabelle eine bestimmte Form hat. Hadley Wickham, der auch
dplyr geschrieben hat, nennt diese Form **Tidy Data**, sinngemäß
*aufgeräumte Daten*. Die Idee ist älter als R und gilt genauso für SQL,
pandas oder eine Tabellenkalkulation.

## Drei Regeln

Eine Tabelle ist tidy, wenn

1. jede **Variable** eine eigene Spalte hat,
2. jede **Beobachtung** eine eigene Zeile hat und
3. in jeder **Zelle** genau ein Wert steht.

Was eine Beobachtung ist, hängt von der Frage ab. In einer Umfrage ist es
meist eine befragte Person: Alles, was wir über sie wissen, steht in ihrer
Zeile, und jede Frage hat ihre Spalte. `survey` ist so aufgebaut.

## Woran man Daten erkennt, die nicht tidy sind

Solche Tabellen sind nicht falsch, denn oft lesen Menschen sie sogar leichter
oder sie entstehen ganz natürlich bei der Erhebung, aber sie machen das
Auswerten mühsamer. Drei Muster begegnen einem dabei immer wieder: Die ersten
beiden verletzen eine der Regeln, das dritte verletzt keine und ist trotzdem
eine stete Fehlerquelle.

### Werte stecken in Spaltennamen

In der Umfrage wurde zufällig entschieden, für welche Marke jemand den
Preis angeben sollte. Das Erhebungswerkzeug hat dafür zwei Spalten
angelegt, eine je Marke, und in jeder Zeile ist nur eine davon gefüllt:

| id | price_weihenstephan | price_alpro |
|---|---|---|
| 3 | | 1.51 |
| 13 | 2.00 | |
| 14 | 1.09 | |

Die Marke ist hier keine Spalte, sondern steckt im Spaltennamen. Wer wissen
will, ob der Preis von der Marke abhängt, muss erst beide Spalten
zusammenführen. In `survey` ist das schon geschehen, mit einer Spalte für die
Marke und einer für den Preis:

| id | milk_brand | price_too_expensive |
|---|---|---|
| 3 | alpro | 1.51 |
| 13 | Weihenstephan | 2.00 |
| 14 | Weihenstephan | 1.09 |

Jetzt ist die Marke eine Variable wie jede andere, nach der man filtern und
gruppieren kann. Das Umformen von der breiten in die lange Form heißt
*pivotieren*; in R erledigt das `pivot_longer()` aus dem Paket tidyr.

### Mehrere Werte in einer Zelle

Steht in einer Zelle `"vegetarisch, bio, regional"`, lässt sich nicht mehr
einfach zählen, wie viele Menschen regional einkaufen. Tidy wäre eine
Spalte je Merkmal mit Ja oder Nein, oder eine eigene Tabelle mit einer Zeile
je Person und Merkmal.

### Codes statt Bedeutungen

In der Rohfassung der Umfrage steht für das Geschlecht `1` oder `2` und für
die Ortsgröße eine Zahl von 1 bis 6. Was die Zahlen bedeuten, verrät nur das
Codebuch. Das verletzt keine der drei Regeln, ist aber eine stete
Fehlerquelle: R rechnet bereitwillig den Mittelwert des Geschlechts aus. In
`survey` stehen deshalb für Geschlecht und Ortsgröße Wörter, wo die Rohdaten
Codes hatten; Skalen wie der Bio-Anteil von 1 bis 5 bleiben Zahlen, weil ihre
Reihenfolge etwas bedeutet.

## Erst aufräumen, dann auswerten

In der Praxis sieht der Ablauf deshalb fast immer gleich aus: Daten laden,
in die Form von Tidy Data bringen, dann mit den Grundoperationen auswerten.
Der zweite Schritt kostet oft mehr Zeit als der dritte, und er lohnt sich,
weil danach jede weitere Frage nur noch ein paar Zeilen braucht.

## Zum Mitnehmen

- Tidy ist eine Tabelle, wenn jede Variable eine Spalte, jede
  Beobachtung eine Zeile und jeder Wert eine Zelle hat.
- Typische Abweichungen sind Werte in Spaltennamen und mehrere Werte in
  einer Zelle; Codes ohne Bedeutung verletzen keine Regel, machen das
  Auswerten aber fehleranfällig.
- Wer zuerst aufräumt, kann danach jede Frage mit denselben wenigen Verben
  beantworten.
