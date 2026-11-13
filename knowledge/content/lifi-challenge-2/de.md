---
type: challenge
code: 8005
title: "Challenge 2: Das Wort"
summary: >-
  Kurze Sätze aus drei Wörtern fehlerfrei und so schnell wie möglich übertragen, mit einem eigenen Codebuch und einem Takt, den euer Code selbst hält.
objectives:
  intro: "Mit dieser Challenge überträgst du Text und kannst danach:"
  goals:
    - "ein Codebuch von Zeichen auf Folgen eurer Farben festlegen und ausrechnen, wie lang die Codewörter sein müssen"
    - "Sender und Empfänger ohne gemeinsame Uhr über eine feste Symbolrate im Takt halten"
    - "erklären, warum eine Übertragung ab einer bestimmten Symbolrate scheitert"
level: 1
topics: [representing-information, transferring-information]
modules: [dup]
project: lifi
status: published
updated: 2026-11-13
---

Mit einem Alphabet aus Farben lassen sich Wörter übertragen, sobald zwei Dinge
geklärt sind: welche Folge von Farben für welches Zeichen steht, und wann der
Empfänger hinsieht. Das Erste ist ein Codebuch, das Zweite ein gemeinsamer
Takt.

**Ziel:** Kurze Sätze aus drei Wörtern fehlerfrei und so schnell wie möglich
übertragen. Der Kursserver schickt bei jedem Lauf einen neuen Satz aus echten
Wörtern, geschrieben mit den Großbuchstaben A bis Z und einem Leerzeichen
zwischen den Wörtern.

**Neu ist,** dass ab jetzt kein Testskript mehr vorgibt, wann die nächste Farbe
kommt. `run_test` sorgt nur dafür, dass Sender und Empfänger gemeinsam
anfangen; danach hält euer eigener Code den Takt, und wie ihr das schafft,
entscheidet ihr. Außerdem rückt der Test eine Ebene nach oben: Er übergibt dem
Sender Text und erwartet vom Empfänger Text zurück, und eure Funktionen aus
Challenge 1, die eine Farbe senden und erkennen, ruft ab jetzt nur noch euer
eigener Code auf. Genau das ist eine Abstraktionsschicht: Von oben seht ihr
Text, von innen Farben.

**Drei Aufgaben:** Zuerst legt ihr das Codebuch fest, dann bringt ihr die
Übertragung langsam zum Laufen, und zuletzt erhöht ihr das Tempo, bis sie
bricht. Zu jeder Aufgabe gibt es Tipps zum Aufklappen; eine Musterlösung gibt
es frühestens nach dem Wettbewerb.

## Eine Datei für alles

Ihr arbeitet wieder in genau einer Datei, `word.py`, ob mit einem Laptop oder
mit zwei. Sie hat dieselbe Form wie `alphabet.py` aus Challenge 1, und was ihr
dort gebaut habt, übernehmt ihr.

| Teil | Was hineinkommt |
|---|---|
| `COLORS` | euer Alphabet aus Challenge 1 |
| `GAIN`, `INTEGRATION_TIME` | die beiden Einstellungen des Sensors, wie in Challenge 1 |
| `calibrate(readings)` | eure Kalibrierung aus Challenge 1 |
| `send_symbol(name)`, `receive_symbol()` | aus Challenge 1; ab jetzt ruft nur euer eigener Code sie auf |
| `CODEBOOK` | neu: welche Folge von Farben für welches Zeichen steht |
| `SYMBOL_RATE` | neu: wie viele Farben ihr je Sekunde sendet |
| `send_text(text)` | neu: zerlegt den Text mit dem Codebuch in Farben und sendet sie im Takt |
| `receive_text(n_chars)` | neu: empfängt so viele Zeichen und gibt sie als Text zurück |
| `run_test(...)` | die letzte Zeile; sie startet beide Seiten gemeinsam, und ihr ändert sie nicht |

<!-- Die Vorlage word.py folgt, sobald der LiFi-Agent sie gebaut hat. -->

## Den Test starten

```text
python word.py
```

Auf dem Mac heißt der Befehl `python3`. Arbeitet ihr mit zwei Laptops,
startet ihr die Datei auf beiden, und der Kursserver gibt beiden eine
gemeinsame Startzeit; an einem Laptop läuft der Empfänger neben dem Sender
mit. Ab dem Start bekommt euer Sender den Satz über `send_text(text)`, und euer
Empfänger erfährt über `receive_text(n_chars)` nur, wie viele Zeichen kommen,
nie den Satz selbst.

Ein gewerteter Lauf sind drei Sätze hintereinander ohne Fehler bei derselben
Symbolrate. Das Ergebnis erscheint mit jedem Fehler im Terminal und in eurem
[[lifi-cockpit|Team-Cockpit]].

## Aufgabe 1: Das Codebuch

Legt fest, welche Folge eurer Farben für welches Zeichen steht. Sender und
Empfänger lesen dasselbe `CODEBOOK`, deshalb steht es nur einmal in der Datei.

**Datei:** `word.py`, das Codebuch `CODEBOOK`

> [!HINT]
> Mit *k* Farben und *n* Stellen unterscheidet ihr *k*ⁿ Codewörter ([[place-value-systems]]). Für 26 Buchstaben und das Leerzeichen reichen bei vier Farben drei Stellen, denn 4³ = 64; mit zwei Farben braucht ihr fünf, denn 2⁵ = 32.

> [!HINT]
> Sind alle Codewörter gleich lang, weiß der Empfänger ohne Trennzeichen, wo ein Zeichen endet.

## Aufgabe 2: Langsam zum Laufen bringen

`send_text(text)` zerlegt den Text mit eurem Codebuch in Farben und zeigt sie
nacheinander, jede für `1 / SYMBOL_RATE` Sekunden. `receive_text(n_chars)`
misst im selben Takt, macht aus jeder Folge von Farben wieder ein Zeichen und
gibt den Text zurück, sobald alle Zeichen da sind. Fangt langsam an, mit einer
Farbe pro Sekunde, und hört erst auf, wenn drei Sätze hintereinander ohne
Fehler ankommen.

**Datei:** `word.py`, die Funktionen `send_text` und `receive_text`, dazu
`SYMBOL_RATE`

> [!HINT]
> Eure Funktionen aus Challenge 1, die eine Farbe senden und eine erkennen, nehmt ihr mit. Neu ist nur, was darüber liegt: Text in Farben zerlegen und aus Farben wieder Text machen.

> [!HINT]
> Rechnet aus, wie lange eine Farbe bei eurer Rate leuchtet, und überlegt, zu welchem Zeitpunkt innerhalb dieser Zeit der Empfänger am besten misst.

> [!HINT]
> Beide Seiten fangen gemeinsam an, aber jede hat ihre eigene Uhr, und `time.sleep()` wartet nie ganz genau so lange wie verlangt. Rechnet deshalb für jede Farbe aus, wann sie beginnt, gemessen vom Start an, statt kurze Pausen aneinanderzureihen, deren kleine Fehler sich aufaddieren.

## Aufgabe 3: Das Tempo erhöhen

Erhöht `SYMBOL_RATE` Schritt für Schritt und notiert bei jeder Stufe, ob drei
Sätze noch fehlerfrei ankommen. Diese Messreihe hebt ihr auf, denn in
Challenge 3 braucht ihr sie wieder.

**Datei:** `word.py`, der Wert `SYMBOL_RATE`

> [!HINT]
> Ändert immer nur eine Sache, also entweder die Rate oder die Größe des Alphabets. Wer beides zugleich verstellt, weiß danach nicht, was den Fehler verursacht hat.

> [!HINT]
> Das Fehlerbild verrät die Ursache: Verrutscht ab einer Stelle alles, liegt es am Takt, sind einzelne Zeichen falsch, ist das Alphabet für diese Rate zu groß.

## Abnahme und Wertung

Ihr lasst gewertete Läufe am eigenen Platz laufen, die Gehäuse von Sender und
Empfänger Wand an Wand. Nicolas geht durch die Reihen, sieht sich euren Aufbau
an und hakt bestandene Läufe ab. Bestanden habt ihr mit einem gewerteten Lauf,
also drei Sätzen hintereinander ohne Fehler, bei beliebiger Symbolrate.

Auf der [Challenge-Tafel](https://lifi.hsos.uber.space/challenges) steht zu
jedem Team, wie viele Zeichen und wie viele Bit pro Sekunde es überträgt. Die
Rangfolge richtet sich nach den Zeichen pro Sekunde, und bei Gleichstand liegt
das Team vorn, das den Wert früher erreicht hat. Im Wettbewerb zeigen die
besten Teams ihren Lauf live; eine Live-Änderung gibt es in Challenge 2 nicht.

## Stolpersteine und mehr

**Typische Stolpersteine:** Was bei einer Farbe pro Sekunde klappt, zerfällt
bei fünf, weil die beiden Seiten keine gemeinsame Uhr haben und sich jede
kleine Verspätung von Farbe zu Farbe aufaddiert. Der Empfänger misst genau
während eines Farbwechsels, oder die Codewörter werden länger als nötig.

**Für Schnelle:** Gebt häufigen Buchstaben kürzere Codewörter und achtet
darauf, dass sie trotzdem eindeutig lesbar bleiben ([[prefix-trap]]).
