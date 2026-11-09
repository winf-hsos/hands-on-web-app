---
type: lesson
code: 6557
title: Was heißt Daten transformieren?
summary: >-
  Kaum eine Frage lässt sich an Rohdaten direkt ablesen. Eine Handvoll
  Grundoperationen formt eine Tabelle in die Tabelle um, die die Antwort
  enthält, in R, Python, SQL oder Excel.
objectives:
  intro: "In dieser Lektion lernst du, was es heißt, Daten zu transformieren, und kannst danach:"
  goals:
    - "erklären, warum sich eine Frage selten direkt an Rohdaten ablesen lässt und was Daten transformieren bedeutet"
    - "die Grundoperationen Spalten auswählen, Zeilen filtern, Sortieren, neue Spalten berechnen, Zusammenfassen und Gruppieren benennen und angeben, was jede an einer Tabelle ändert"
    - "begründen, warum sich die Operationen verketten lassen und warum ihre Reihenfolge zählt"
    - "eine Frage an Daten als Folge von Grundoperationen planen, bevor du Code schreibst"
    - "jeder Operation ihr Verb in `dplyr`, etwa `select()` oder `filter()`, und ihre Entsprechung in SQL, pandas und Excel zuordnen"
level: 1
duration: 15
topics: [transforming-data]
modules: [ea]
areas: [ds]
status: draft
updated: 2026-11-09
---

![Folien: Sechs Verben und eine Pipe](item:data-transformation-slides)

Angenommen, du hast eine Umfrage mit einigen tausend Befragten vor dir und
willst wissen, ob Menschen, die sich vegan oder vegetarisch ernähren, mehr Bio
kaufen als andere. Die Antwort steht nirgends in der Tabelle. Sie steckt
darin, aber erst, wenn du die richtigen Zeilen auswählst, sie nach der
Ernährungsweise in Gruppen teilst und je Gruppe einen Mittelwert bildest.

Genau das heißt **Daten transformieren**: aus einer Tabelle eine andere
machen, die eine Frage beantwortet, ohne neue Daten zu erheben. In der
Praxis verbringt man damit mehr Zeit als mit jeder Statistik, denn fast jede
Grafik und jedes Modell braucht die Daten in einer Form, in der sie nicht
geliefert wurden.

## Eine Tabelle hinein, eine Tabelle heraus

Die gute Nachricht: Für die allermeisten Fragen genügt eine Handvoll
Grundoperationen. Jede nimmt eine Tabelle und gibt wieder eine Tabelle
zurück, und deshalb lassen sie sich hintereinander schalten, in der
Reihenfolge, die die Frage verlangt.

| Operation | Frage dahinter | was sich ändert |
|---|---|---|
| **Spalten auswählen** | Welche Merkmale brauche ich? | weniger Spalten |
| **Zeilen filtern** | Um wen oder was geht es? | weniger Zeilen |
| **Sortieren** | Was steht oben? | Reihenfolge der Zeilen |
| **Neue Spalten berechnen** | Was lässt sich aus den Merkmalen ableiten? | mehr Spalten |
| **Zusammenfassen** | Was ist typisch, wie viele sind es? | eine Zeile statt vieler |
| **Gruppieren** | Wie unterscheiden sich Teilgruppen? | eine Zeile je Gruppe |

Die Frage vom Anfang wird damit zu einer Folge von Schritten, die man
fast wie einen Satz lesen kann:

1. Nimm die Umfrage,
2. behalte die Zeilen, in denen der Bio-Anteil beantwortet ist,
3. teile sie nach der Ernährungsweise in Gruppen,
4. berechne je Gruppe den mittleren Bio-Anteil und zähle die Personen,
5. sortiere die Gruppen nach diesem Mittelwert.

Die Reihenfolge zählt dabei: Wer zuerst je Gruppe den Mittelwert bildet und
erst danach die fehlenden Antworten herausfiltern will, findet keine
einzelnen Befragten mehr, nach denen sich filtern ließe. So eine Folge plant
man deshalb am besten auf Papier, bevor man eine Zeile Code schreibt, und
wer die Schritte kennt, muss danach nur noch übersetzen.

## Dieselben Ideen überall

Die Grundoperationen sind keine Erfindung einer bestimmten Software. Sie
stecken in jedem Werkzeug für Tabellen, nur unter anderen Namen:

| Operation | R mit dplyr | SQL | Python mit pandas | Excel |
|---|---|---|---|---|
| Spalten auswählen | `select()` | `SELECT` | `df[columns]` | Spalten ausblenden |
| Zeilen filtern | `filter()` | `WHERE` | `df.query()` | Filter |
| Sortieren | `arrange()` | `ORDER BY` | `df.sort_values()` | Sortieren |
| Neue Spalten | `mutate()` | Ausdruck im `SELECT` | `df.assign()` | Formel in neuer Spalte |
| Zusammenfassen | `summarize()` | `COUNT`, `AVG`, … | `df.agg()` | Pivot-Tabelle |
| Gruppieren | `group_by()` | `GROUP BY` | `df.groupby()` | Pivot-Tabelle |

Auf dieser Plattform verwenden wir **R mit dem Paket dplyr**. Seine
Funktionen heißen wie die Tätigkeit, die sie ausführen, und deshalb nennt man
sie die **Verben** von dplyr. Wer sie einmal verstanden hat, findet sich auch
in SQL oder pandas schnell zurecht, denn gedacht wird überall gleich.

## Ausprobieren, bevor man programmiert

In der Demo zu den Verben siehst du an sechs Zeilen der Umfrage, wie jedes
Verb eine Tabelle umformt, bevor du in den folgenden Lektionen selbst Code
schreibst.

![Die Verben von dplyr zum Ausprobieren](item:dplyr-verbs-demo)

## Zum Mitnehmen

- Daten transformieren heißt, eine Tabelle so umzuformen, dass sie eine Frage
  beantwortet.
- Eine Handvoll Operationen genügt: auswählen, filtern, sortieren, berechnen,
  zusammenfassen und gruppieren.
- Jede Operation macht aus einer Tabelle eine Tabelle, deshalb lassen sie
  sich zu einer Folge von Schritten verketten, deren Reihenfolge die Frage
  bestimmt.
- Die Ideen sind in R, SQL, pandas und Excel dieselben, nur die Namen
  wechseln.
