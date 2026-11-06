---
title: Signal und Rauschen
summary: >-
  Zwei Strecken mit derselben Hardware tragen einmal sechzehn Zeichen und
  einmal vier. Der Unterschied liegt nicht im Programm, sondern im Verhältnis
  vom Abstand zweier Zeichen zur Streuung der Messwerte um jedes von ihnen.
objectives:
  intro: "Diese Lektion zeigt dir, warum die Streuung der Messwerte entscheidet, wie viele Zeichen eine Strecke tragen kann, und danach kannst du:"
  goals:
    - "eine Messreihe mit `statistics.mean()` und `statistics.stdev()` durch ihren Mittelwert und ihre Streuung beschreiben"
    - "erklären, warum das Mitteln über längere Fenster die Werte beruhigt und was das an Ablesungen pro Sekunde kostet"
    - "begründen, warum zwei Zeichen nur dann sicher unterscheidbar sind, wenn sich ihre Wolken nicht überlappen, und warum das Verhältnis von Abstand zu Streuung zählt"
    - "aus dem nutzbaren Bereich und der Streuung berechnen, wie viele Zeichen in eine Strecke passen"
    - "die Wege, das Verhältnis zu verbessern, danach ordnen, was sie an Bits pro Zeichen oder Zeichen pro Sekunde kosten"
translation_of: en
based_on: 2026-11-04
---

![Folien: Signal und Rauschen](item:signal-and-noise-slides)

Ein Leuchtturm im Nebel ist ein seltsamer Anblick. Die Lampe brennt genauso
hell wie in einer klaren Nacht, und trotzdem erstirbt der Strahl nach wenigen
Metern, weil mit dem Signal nichts passiert ist, mit allem um es herum aber
sehr viel.

Dasselbe gilt für eine Strecke, die Daten als Licht von einer LED zu einem
Farbsensor trägt. Zwei Gruppen mit derselben LED, demselben Sensor und
demselben Raum können bei Alphabeten aus sechzehn und aus vier Farben landen,
und die Qualität ihrer Programme erklärt den Unterschied nicht. Erklären lässt
er sich damit, wie stark die Messwerte streuen, und diese Lektion zeigt, wie
du das misst und wie du damit rechnest.

## Zehn Ablesungen einer Farbe

Richtest du einen Sensor auf eine Farbe und liest ihn zehnmal ab, ohne etwas
zu verändern, bekommst du zehn verschiedene Zahlen, etwa 214, 211, 218, 209,
216, 213, 220, 207, 215 und 212. Das überrascht viele, denn ein Computer ist
die eine Maschine, die bei gleicher Eingabe verlässlich dieselbe Ausgabe
liefert, aber der Sensor bekommt nie zweimal dieselbe Eingabe: Das Licht
flackert, die Elektronik rauscht, jemand geht vorbei. Diese Schwankung heißt
**Rauschen**, und jedes Messgerät hat sie.

Zwei Zahlen beschreiben eine solche Reihe, der **Mittelwert**, der sagt, wo
die Farbe liegt, und die **Streuung**, die sagt, wie weit sie wandert. Pythons
Modul `statistics` liefert beide:

```python
import statistics

readings = [214, 211, 218, 209, 216, 213, 220, 207, 215, 212]

print("Mittelwert:", statistics.mean(readings))
print("Streuung:", round(statistics.stdev(readings), 1))
print("von", min(readings), "bis", max(readings))
```

Die Farbe liegt bei 213,5 und wandert zwischen 207 und 220. `statistics.stdev()`
liefert die Standardabweichung, das übliche Maß für die Streuung, das ungefähr
den typischen Abstand einer Ablesung vom Mittelwert angibt, hier 4,0. Eine
einzelne Ablesung sagt für sich fast nichts, denn 220 könnte diese Farbe sein
oder eine benachbarte, die gerade einen schlechten Moment hat, und erst die
ganze Reihe zeigt, wo die Farbe liegt und wie weit sie abschweift.

## Länger messen macht ruhiger

Es gibt einen Weg, die Zahlen ruhiger zu machen: länger messen und mitteln,
was ankommt. Die Zeichnung zeigt oben ein Rohsignal und darunter dasselbe
Signal, gemittelt über Fenster aus 4, 12 und 32 Ablesungen, wobei jeder dicke
Balken ein gemittelter Wert ist.

![Vier Streifen übereinander. Oben eine unruhige Linie aus 288 Rohwerten um einen gestrichelten Pegel. Darunter dasselbe Signal als gemittelte Balken: 72 kurze Balken für Fenster aus 4, 24 für Fenster aus 12 und 9 lange Balken für Fenster aus 32. Je länger das Fenster, desto näher liegen die Balken am gestrichelten Pegel.](figure:windows "Dasselbe Rohsignal, gemittelt über immer längere Fenster. Längere Fenster liefern ruhigere Werte, und weniger davon.")

Je länger das Fenster, desto näher rücken die Balken an den wahren Pegel, aber
dieselbe Zeitspanne enthält jetzt nur noch 72, 24 und schließlich 9 Werte
statt 288. Ruhe bezahlst du mit Ablesungen pro Sekunde, und aus Ablesungen pro
Sekunde besteht das Tempo einer Übertragung. Das Programm zieht mit
`random.gauss()` 288 verrauschte Ablesungen eines gleichbleibenden Lichts und
mittelt sie in denselben Fenstern:

```python
import random
import statistics

random.seed(6)
# 288 raw readings of one constant light: level 500, noise 20
raw = [random.gauss(500, 20) for _ in range(288)]

for window in [1, 4, 12, 32]:
    means = [statistics.mean(raw[i:i + window]) for i in range(0, len(raw), window)]
    spread = statistics.stdev(means)
    print(f"Fenster aus {window}: {len(means)} Werte, Streuung {spread:.1f}")
```

Die Streuung fällt von 20,3 auf 10,3, 5,8 und 3,9, aber nicht im selben Maß
wie das Fenster wächst: Das vierfache Fenster halbiert sie nur, weil die
Streuung eines Mittelwerts mit der Wurzel aus der Zahl der gemittelten
Ablesungen schrumpft. Zehnmal ruhigere Werte kosteten deshalb hundertmal so
viele Ablesungen.

## Zwei Zeichen, zwei Wolken

Stell jetzt zwei Zeichen auf dieselbe Skala. Jedes ist kein einzelner Wert,
sondern eine Wolke von Werten, und die Breite der Wolke ist das Rauschen, das
du gerade gemessen hast.

![Zwei Felder mit je zwei glockenförmigen Wolken, Zeichen a und Zeichen b, im selben Abstand d und mit einer gestrichelten Grenze dazwischen. Links sind die Wolken schmal, und die Grenze liegt im leeren Raum. Rechts sind die Wolken breit, und die Teile, die über die Grenze reichen, sind rot.](figure:two-clouds "Derselbe Abstand d, zweimal. Bei schmalen Wolken landet jede Ablesung auf ihrer Seite, bei breiten sind die roten Teile die Ablesungen, die der Empfänger falsch liest.")

Keine der beiden Zahlen entscheidet allein: Der Abstand zweier Zeichen
bedeutet nichts ohne die Breite der Wolken, und die Breite nichts ohne den
Abstand. Es zählt das Verhältnis *d*/*s* aus dem Abstand *d* der Mittelwerte
zweier Zeichen und der Streuung *s* der Ablesungen um jedes von ihnen.
**Sicher unterscheidbar** heißt deshalb nicht, dass die Mittelwerte
verschieden sind, sondern dass sich die Wolken nicht überlappen, nicht einmal
an ihren äußersten Ablesungen, denn eine einzige Ablesung, die über die
Grenze wandert, ist ein falsches Zeichen. Das Programm vergleicht zwei Farben
mit je zehn Ablesungen:

```python
import statistics

a = [214, 211, 218, 209, 216, 213, 220, 207, 215, 212]
b = [251, 247, 255, 244, 252, 249, 258, 246, 250, 253]

d = statistics.mean(b) - statistics.mean(a)
s = max(statistics.stdev(a), statistics.stdev(b))
print("d =", d)
print("s =", round(s, 1))
print("d / s =", round(d / s, 1))
print("Lücke zwischen den Wolken:", min(b) - max(a))
```

Die Mittelwerte liegen 37 auseinander, fast das Neunfache der Streuung, und
zwischen der höchsten Ablesung von `a` und der niedrigsten von `b` bleiben
noch 24 Einheiten leerer Raum, also sind diese beiden Farben sicher
unterscheidbar. Rück `b` näher heran, indem du unter den beiden Listen die
Zeile `b = [value - 25 for value in b]` einfügst: Die Lücke wird negativ, und
das heißt, die Wolken überlappen sich. Notizen zu einer Farbe, die nur ihren
Mittelwert enthalten, können deshalb nicht sagen, ob die Farbe brauchbar ist.

## Wie viele Zeichen passen hinein?

Sobald du in Bändern statt in Punkten denkst, wird aus der Frage, wie viele
Farben eine Strecke verwenden kann, eine Rechnung. Du misst den nutzbaren
Bereich, vom dunkelsten bis zum hellsten Wert, den die Strecke verlässlich
erzeugt, und die Breite einer Wolke, und dann teilst du.

![Eine Skala von 40 unten bis 840 oben, zweimal gefüllt. Links vier Bänder von je 200 Breite, darunter 800 / 200 = 4; rechts sechzehn schmale Bänder von je 50 Breite, darunter 800 / 50 = 16.](figure:how-many "Derselbe Bereich, gefüllt mit breiten und mit schmalen Bändern. Je schmaler ein Band, desto mehr passen hinein.")

Ein Beispiel: Der Bereich reicht von 40 bis 840, ist also 800 Einheiten breit,
und jede Farbe streut um bis zu 25 in beide Richtungen um ihren Mittelwert.
Ihr Band ist deshalb 50 breit und nicht 25, weil die Wolke nach beiden Seiten
ausgreift, und 800 geteilt durch 50 ergibt 16:

```python
floor = 40      # darkest value the link produces reliably
ceiling = 840   # brightest value
spread = 25     # every symbol wanders up to 25 either side of its mean

band = 2 * spread
print((ceiling - floor) // band, "Zeichen passen hinein")
```

Setz `spread` auf 100, dann passen nur noch 4 Zeichen hinein. Die beiden
Gruppen vom Anfang dieser Lektion unterscheiden sich womöglich in nichts als
dieser Zahl, und wer die Rechnung vor dem Ausprobieren von Farben macht,
spart sich einen Nachmittag mit Alphabeten, die nie funktionieren konnten. Das
Experiment [[measuring-your-noise]] geht diese Schritte an einer echten
Strecke, von zehn Ablesungen einer Farbe bis zur Zahl der Zeichen, die
hineinpassen.

## Die Regler haben Preisschilder

Es gibt mehrere Wege, das Verhältnis zu verbessern, und kaum einer ist
umsonst:

| Weg | Wirkung | Preis |
|---|---|---|
| Farben weiter auseinander wählen | *d* wird größer | weniger Zeichen passen in den Bereich |
| weniger Zeichen verwenden | *d* wird größer | weniger Bits pro Zeichen |
| das Licht besser ausrichten | *d* wird größer | nur Handwerk |
| längere Integrationszeit | *s* wird kleiner | weniger Zeichen pro Sekunde |
| mehrere Ablesungen mitteln | *s* wird kleiner | weniger Zeichen pro Sekunde |
| Umgebungslicht abschirmen | *s* wird kleiner | nur Handwerk |
| die Geometrie festlegen | *s* wird kleiner | nur Handwerk |

Mitteln in Software ist dasselbe Geschäft wie eine längere Integrationszeit im
Sensor, nur an anderer Stelle abgeschlossen. Die Funktion `read_stable()`
liest zehnmal ab und gibt den Mittelwert zurück, und `read_clear()` vertritt
hier den Sensor und liefert eine Ablesung mit Rauschen:

```python
import random
import statistics

def read_clear():
    # stands in for the sensor: one reading of a constant light, with noise
    return random.gauss(500, 20)

def read_stable(n=10):
    values = [read_clear() for _ in range(n)]
    return sum(values) / n

random.seed(2)
single = [read_clear() for _ in range(100)]
stable = [read_stable() for _ in range(100)]
print("Streuung einzelner Ablesungen:", round(statistics.stdev(single), 1))
print("Streuung von read_stable():", round(statistics.stdev(stable), 1))
```

Die gemittelten Werte streuen etwa ein Drittel so stark wie einzelne, 6,3
statt 21,5, und jeder von ihnen kostet zehn Ablesungen. Das ist kein Argument
gegen das Mitteln, sondern eines dafür, zu messen, was es kostet, statt
anzunehmen, es sei umsonst. Die drei Wege, die nur Handwerk kosten, sind die
Ausnahme: Das Licht ausrichten, Umgebungslicht abhalten und den Abstand mit
einer Röhre oder einem Halter festlegen verbessern das Verhältnis, ohne Bits
oder Tempo herzugeben.

## Beide Wege führen an dieselbe Wand

Es gibt zwei Wege, mehr aus einer Strecke herauszuholen, und meist will man
beide zugleich: Mehr Zeichen machen die Bänder schmaler, und schnellere
Zeichen machen die Wolken breiter, weil ein kürzeres Fenster über weniger
Licht mittelt. Beide verbrauchen denselben Sicherheitsabstand, und den gibt
es nur einmal. Es ist dieselbe Abwägung zwischen mehr Information je Zeichen
und mehr Fehlern, die Rechner mit [[place-value-systems|zwei Zuständen]] arbeiten
lässt.

Alles in dieser Lektion ist eine Eigenschaft einer bestimmten Strecke, mit
ihrem Raum, ihrem Abstand und ihrem Umgebungslicht. Eine Strecke, die am
Fenster bei Tageslicht kalibriert wurde, passt in einem abgedunkelten Raum
nicht mehr, weil sich dort Mittelwerte und Streuung ändern, und deshalb
müssen die Grenzen dort neu gemessen werden, wo die Strecke arbeitet. Kein
Lesen und kein Sprachmodell hat darauf Zugriff, denn die einzige Instanz ist
der Kanal selbst.

## Zum Mitnehmen

- Jede Messung streut, deshalb beschreibst du eine Reihe durch ihren
  Mittelwert und ihre Streuung, und eine einzelne Ablesung sagt fast nichts.
- Mitteln über längere Fenster beruhigt die Werte, aber die Streuung fällt
  nur mit der Wurzel aus der Fensterlänge, und jeder gemittelte Wert kostet
  Ablesungen.
- Zwei Zeichen sind sicher unterscheidbar, wenn sich ihre Wolken nicht
  überlappen, und es zählt das Verhältnis von Abstand zu Streuung, nicht die
  Mittelwerte allein.
- Wie viele Zeichen passen, ist der nutzbare Bereich geteilt durch die Breite
  eines Bandes, und die ist doppelt so groß wie die Streuung.
- Fast jede Verbesserung kostet Bits pro Zeichen oder Zeichen pro Sekunde,
  außer das Licht auszurichten, Umgebungslicht abzuschirmen und die Geometrie
  festzulegen.

![Quiz: Signal und Rauschen](item:signal-and-noise-quiz)
