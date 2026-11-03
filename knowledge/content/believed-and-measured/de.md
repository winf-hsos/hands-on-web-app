---
type: experiment
code: 4050
title: Geglaubt und gemessen
summary: >-
  Einen Vorschlag des KI-Assistenten zur Optik in eine Vorhersage mit Zahl
  verwandeln, vorher und nachher mit genau einer Änderung messen und das
  Ergebnis in zwei Zeilen festhalten: was ihr geglaubt und was ihr gemessen
  habt.
objectives:
  intro: "In diesem Experiment prüfst du einen Vorschlag des KI-Assistenten an deiner eigenen Strecke und kannst danach:"
  goals:
    - "aus einem allgemeinen Vorschlag eine Vorhersage machen, die angibt, welche Größe sich in welche Richtung und ungefähr um wie viel ändert"
    - "eine Kontrollmessung vor der Änderung durchführen und danach genau eine Größe verändern"
    - "mit Mittelwert, Streuung `s` und dem Verhältnis `d/s` entscheiden, ob die Messung die Vorhersage stützt"
    - "das Ergebnis in den zwei Zeilen „Wir glaubten“ und „Wir maßen“ für das Irrtumsprotokoll festhalten"
level: 1
duration: 40
topics: [transferring-information]
modules: [dup]
relations:
  requires: [measuring-your-noise]
  see_also: [signal-and-noise-slides, measurement-and-experiments]
status: draft
updated: 2026-11-01
---

Fragt ihr einen KI-Assistenten, wie eure Strecke mehr Farben unterscheiden
kann, bekommt ihr Vorschläge, die alle plausibel klingen: eine Röhre innen
mattschwarz streichen, eine Blende vor den Sensor setzen, die Verstärkung
erhöhen. Keiner davon ist an eurem Aufbau geprüft, denn der Assistent kennt
weder euren Raum noch euren Abstand noch euer Licht. In diesem Experiment
nehmt ihr einen solchen Vorschlag beim Wort, schreibt vorher auf, was er
bewirken soll, und lasst die Messung entscheiden.

## Was ihr braucht

- zwei Geräte mit RGB-LED und Farbsensor, an zwei Laptops oder beide an einem
- euren Aufbau aus Challenge 1 mit markierter Position beider Geräte
- das Sende- und das Empfangsprogramm aus [[measuring-your-noise]]
- zwei Farben aus eurem Alphabet, die dicht beieinanderliegen
- euren KI-Assistenten
- das Material für die eine Änderung, die ihr prüfen wollt, etwa schwarzes
  Papier, Pappe oder Klebeband

## Aufbau

Stellt die Geräte so auf, wie ihr sie in Challenge 1 benutzt habt, und
markiert ihre Position. Außer der einen Änderung, die ihr prüft, bleibt alles
gleich: der Abstand, das Licht im Raum und das Programm. Im Empfangsprogramm
genügt für dieses Experiment das Fenster 1, setzt also `WINDOWS = [1]`; dann
dauert eine Messung nur wenige Sekunden.

## Schritt 1: einen Vorschlag einholen

Beschreibt dem Assistenten euren Aufbau in zwei, drei Sätzen und fragt ihn,
was ihr an der Optik ändern könnt, damit die Messwerte weniger streuen oder
die Farben weiter auseinanderliegen. Wählt aus seinen Antworten **einen**
Vorschlag aus, den ihr mit genau einer Änderung umsetzen könnt, und schreibt
ihn wörtlich ab.

## Schritt 2: vorher aufschreiben, was ihr glaubt

Macht aus dem Vorschlag eine Vorhersage, die eine Messung widerlegen kann. Sie
nennt die Größe, die sich ändern soll, die Richtung und ungefähr den Betrag,
zum Beispiel: „Mit der mattschwarzen Röhre halbiert sich die Streuung `s` von
Farbe A, und `d/s` steigt von 5 auf 10.“ Ein Satz wie „es wird besser“ lässt
sich nicht widerlegen und taugt deshalb nicht.

## Schritt 3: die Kontrollmessung

Messt ohne die Änderung beide Farben je dreimal hintereinander mit dem
Empfangsprogramm und tragt Mittelwert und Streuung `s` jeder Messung in die
Tabelle ein. Die drei Durchgänge zeigen euch, wie stark die Werte schon ohne
jede Änderung von einem Durchgang zum nächsten schwanken; ein Unterschied, der
kleiner ist als diese Schwankung, beweist nachher nichts.

## Schritt 4: genau eine Änderung

Setzt jetzt den Vorschlag um, und zwar nur ihn, ohne die Geräte zu bewegen.
Messt dann beide Farben wieder je dreimal.

| Durchgang | Mittelwert A | s von A | Mittelwert B | s von B |
|---|---|---|---|---|
| vorher 1 | | | | |
| vorher 2 | | | | |
| vorher 3 | | | | |
| nachher 1 | | | | |
| nachher 2 | | | | |
| nachher 3 | | | | |

Das Programm im Browser rechnet aus den Werten eines Durchgangs den Abstand
`d`, die größere Streuung `s` und das Verhältnis `d/s` aus. Ersetzt die
Platzhalter durch eure eigenen Werte, einmal mit einem Durchgang vorher und
einmal mit einem nachher.

```python
# replace the placeholders with the values of one run before and one run after the change
runs = {
    "vorher": {"mean_a": 640, "s_a": 9.1, "mean_b": 700, "s_b": 10.4},
    "nachher": {"mean_a": 610, "s_a": 4.8, "mean_b": 668, "s_b": 5.5},
}

for name, run in runs.items():
    d = abs(run["mean_b"] - run["mean_a"])
    s = max(run["s_a"], run["s_b"])
    print(f"{name}: Abstand d {d:.0f}, Streuung s {s:.1f}, d/s {d / s:.1f}")
```

## Schritt 5: die zwei Zeilen

Schreibt das Ergebnis in zwei Zeilen auf, die erste mit eurer Vorhersage aus
Schritt 2 und die zweite mit dem, was die Messung gezeigt hat, beide mit
Zahlen.

| Zeile | euer Text |
|---|---|
| Vorschlag des Assistenten | |
| Wir glaubten: | |
| Wir maßen: | |

> [!TIP]
> Ein Beispiel aus einem Irrtumsprotokoll: „Wir glaubten: Mehr Verstärkung
> bringt uns mehr Farben.“ und „Wir maßen: Die Streuung wuchs mit, und wir
> verloren zwei Symbole.“ Die Verstärkung hebt das Signal und das Rauschen
> gleichermaßen an, deshalb ändert sie `d/s` kaum, und nahe der Decke kann der
> Sensor sogar übersteuern.

## Auswerten

- Hat die Messung eure Vorhersage gestützt, widerlegt oder keins von beiden,
  weil der Unterschied kleiner war als die Schwankung zwischen den drei
  Durchgängen der Kontrollmessung?
- Hat die Änderung den Abstand `d`, die Streuung `s` oder beides verändert, und
  was ist mit dem Verhältnis `d/s` geschehen?
- Hättet ihr ohne die Kontrollmessung gewusst, ob die Änderung überhaupt etwas
  bewirkt hat?
- Was hätte der Assistent über euren Aufbau wissen müssen, um richtig zu
  liegen, und konnte er das wissen?
- Widerlegt die Messung den Vorschlag, gehören die beiden Zeilen in euer
  Irrtumsprotokoll; stützt sie ihn, gehört die Änderung mit ihren Zahlen in
  euer Messprotokoll und in die Beschreibung eurer Lösung.

Warum fast jede Maßnahme gegen Rauschen einen Preis hat und nur wenige, darunter
eine bessere Optik, nichts kosten als Bastelzeit, zeigen die Folien
[[signal-and-noise-slides]] und die Lektion [[signal-and-noise]]. Warum eine
saubere Messreihe gegen eine plausible Erklärung gewinnt, zeigt die Lektion
[[measurement-and-experiments]].

> [!NOTE]
> Mit einer ganzen Gruppe prüft jedes Team einen anderen Vorschlag, und an der
> Tafel entsteht eine Liste mit zwei Spalten, „Wir glaubten“ und „Wir maßen“.
> Am Ende zählt die Gruppe, wie viele der Vorschläge die Messung überstanden
> haben und bei welchen der Assistent etwas über den Aufbau hätte wissen
> müssen, das er nicht wissen konnte.
