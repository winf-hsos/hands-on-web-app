---
type: challenge
code: 8005
title: "Challenge 2: Das Wort"
summary: >-
  Zehn Zeichen fehlerfrei und so schnell wie möglich übertragen, mit einer eigenen Codetabelle und einem gemeinsamen Takt.
objectives:
  intro: "Mit dieser Challenge überträgst du Wörter und kannst danach:"
  goals:
    - "eine Codetabelle von Buchstaben auf Folgen eurer Symbole festlegen"
    - "Sender und Empfänger über eine feste Symbolrate im Takt halten"
    - "erklären, warum eine höhere Symbolrate ohne gemeinsame Uhr scheitert"
level: 1
topics: [representing-information, transferring-information]
modules: [dup]
project: lifi
status: draft
updated: 2026-11-03
---

Mit einem Alphabet aus Farben lassen sich Wörter übertragen, sobald zwei Dinge
geklärt sind: welche Folge von Farben für welchen Buchstaben steht, und wann der
Empfänger hinsieht. Das Erste ist eine Codetabelle, das Zweite ein gemeinsamer
Takt.

**Ziel:** Zehn Zeichen fehlerfrei und so schnell wie möglich übertragen.

**Neu ist,** dass ab jetzt kein Testskript mehr vorgibt, wann das nächste Symbol
kommt: Sender und Empfänger müssen im selben Takt arbeiten, und wie sie das
schaffen, entscheidet ihr. Außerdem rückt der Test eine Ebene nach oben. Er
übergibt euch Text und erwartet Text zurück, und eure Funktionen aus
Challenge 1, die ein Symbol senden und erkennen, ruft ab jetzt nur noch euer
eigener Code auf. Genau das ist eine Abstraktionsschicht: Von oben seht ihr
Text, von innen Symbole.

**Drei Aufgaben:** Zuerst legt ihr die Codetabelle fest, dann bringt ihr die
Übertragung langsam zum Laufen, und zuletzt erhöht ihr das Tempo, bis sie
bricht. Zu jeder Aufgabe gibt es Tipps zum Aufklappen.

## Drei Dateien

Jede Seite hat ihre eigene Datei, und eine dritte hält fest, worauf sich beide
einigen müssen:

| Datei | Was hineinkommt |
|---|---|
| `agreement.py` | euer Alphabet, `SYMBOL_RATE` (wie viele Symbole ihr je Sekunde sendet) und die Zuordnung von Buchstaben zu Symbolen |
| `sender.py` | `calibrate()` zeigt euer Alphabet einmal, `send_text(text)` überträgt eine Zeichenkette |
| `receiver.py` | `calibrate()` lernt, wie jedes Symbol aussieht, `receive_text(n_chars)` empfängt so viele Zeichen und gibt sie zurück |

Den Test startet ihr mit `run_test.py` aus der Vorlage; wie genau, steht in
ihrer Beschreibung. Der Empfänger erfährt dabei nur, wie viele Zeichen kommen,
nie das Wort selbst.

## Aufgabe 1: Die Codetabelle

Legt fest, welche Folge eurer Symbole für welchen Buchstaben steht. Beide
Seiten müssen dieselbe Tabelle verwenden, deshalb steht sie nur an einer
Stelle.

**Datei:** `agreement.py`, die Zuordnung von Buchstaben zu Symbolen

> [!HINT]
> Mit *k* Farben und *n* Stellen unterscheidet ihr *k*ⁿ Codewörter ([[place-value-systems]]). Rechnet aus, wie viele Stellen eure Alphabetgröße für 26 Buchstaben braucht: Bei vier Farben reichen drei, denn 4³ = 64.

> [!HINT]
> Sind alle Codewörter gleich lang, weiß der Empfänger ohne Trennzeichen, wo ein Buchstabe endet.

## Aufgabe 2: Langsam zum Laufen bringen

`send_text(text)` zerlegt den Text mit eurer Codetabelle in Symbole und sendet
sie nacheinander, `receive_text(n_chars)` empfängt so viele Zeichen und gibt
sie als Text zurück. Fangt langsam an, mit einem Symbol pro Sekunde, und hört
erst auf, wenn ein Wort ohne Fehler ankommt.

**Datei:** `sender.py` und `receiver.py`, dazu `SYMBOL_RATE` in `agreement.py`

> [!HINT]
> Eure Funktionen aus Challenge 1, die ein Symbol senden und eines erkennen, nehmt ihr mit. Neu ist nur, was darüber liegt: Text in Symbole zerlegen und aus Symbolen wieder Text machen.

> [!HINT]
> Rechnet aus, wie lange ein Symbol bei eurer Rate leuchtet, und überlegt, zu welchem Zeitpunkt innerhalb dieser Zeit der Empfänger am besten misst.

## Aufgabe 3: Das Tempo erhöhen

Erhöht die Symbolrate Schritt für Schritt und notiert bei jeder Stufe, ob das
Wort noch fehlerfrei ankommt. Diese Messreihe hebt ihr auf, denn in
Challenge 3 braucht ihr sie wieder.

**Datei:** `agreement.py`, der Wert `SYMBOL_RATE`

> [!HINT]
> Ändert immer nur eine Sache, also entweder die Rate oder die Größe des Alphabets. Wer beides zugleich verstellt, weiß danach nicht, was den Fehler verursacht hat.

> [!HINT]
> Das Fehlerbild verrät die Ursache: Kommen zu wenige Zeichen an, liegt es am Takt, sind einzelne Zeichen falsch, ist das Alphabet für diese Rate zu groß.

## Abnahme

**Gemessen wird** zuerst, ob alle zehn Zeichen stimmen, und erst dann die Dauer.
Bei der Abnahme sendet ihr ein Wort, das ihr vorher nicht kennt. Als
Live-Änderung verdoppelt ihr eure Symbolrate.

## Stolpersteine und mehr

**Typische Stolpersteine:** Was bei einem Symbol pro Sekunde klappt, zerfällt
bei fünf, weil die beiden Seiten keine gemeinsame Uhr haben. Der Empfänger misst
genau während eines Farbwechsels, startet zu spät, oder die Codewörter werden
länger als nötig.

**Für Schnelle:** Gebt häufigen Buchstaben kürzere Codewörter und achtet darauf,
dass sie trotzdem eindeutig lesbar bleiben.
