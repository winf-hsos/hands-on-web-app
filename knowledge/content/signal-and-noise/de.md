---
title: Signal und Rauschen
summary: >-
  Zwei Strecken mit derselben Hardware tragen einmal sechzehn Zeichen und
  einmal vier. Diese Lektion zeigt, was ein Sensor wirklich liefert, warum das
  Verhältnis vom Abstand zweier Zeichen zur Streuung der Messwerte über die
  Größe eines Alphabets entscheidet und wie eine saubere Messreihe zeigt, ob
  eine Verbesserung gewirkt hat.
objectives:
  intro: "Am Beispiel eines Farbsensors, der das Licht einer LED misst, zeigt dir diese Lektion, warum die Streuung der Messwerte entscheidet, wie viele Zeichen eine Strecke tragen kann, und danach kannst du:"
  goals:
    - "erklären, warum der Sensor vier Zahlen `r`, `g`, `b` und `c` statt einer Farbe liefert, warum sie vom Gesendeten abweichen und warum jede Messreihe mit einer Kontrollmessung im Dunkeln beginnt"
    - "eine Messreihe mit `statistics.mean()` und `statistics.stdev()` durch ihren Mittelwert und ihre Streuung beschreiben"
    - "erklären, warum das Mitteln über längere Fenster oder eine längere Integrationszeit die Werte beruhigt und was das an Ablesungen pro Sekunde kostet"
    - "begründen, warum zwei Zeichen nur dann sicher unterscheidbar sind, wenn sich ihre Wolken nicht überlappen, und aus dem nutzbaren Bereich und der Streuung berechnen, wie viele Zeichen hineinpassen"
    - "mit Referenzwerten bekannter Farben kalibrieren und eine neue Ablesung der nächstgelegenen Wolke zuordnen"
    - "die Wege, das Verhältnis von Abstand zu Streuung zu verbessern, danach ordnen, was sie an Bits pro Zeichen oder Zeichen pro Sekunde kosten"
    - "eine Messreihe mit vorher notierter Vorhersage, genau einer veränderten Größe und genügend Wiederholungen planen und begründen, warum fünf Treffer in Folge Glück sein können, fünfzig aber nicht"
translation_of: en
based_on: 2026-11-08
---

![Folien: Signal und Rauschen](item:signal-and-noise-slides)

Zwei Gruppen mit derselben LED, demselben Farbsensor und demselben Raum können
bei Alphabeten aus sechzehn und aus vier Farben landen, und die Qualität ihrer
Programme erklärt den Unterschied nicht. Erklären lässt er sich damit, wie
stark die Messwerte streuen. Diese Lektion beginnt bei dem, was ein Sensor
wirklich liefert, rechnet aus der Streuung aus, wie viele Zeichen eine Strecke
tragen kann, und endet bei der Frage, wie du herausfindest, ob eine
Verbesserung wirklich geholfen hat. Die Beispiele verwenden einen Farbsensor,
der das Licht einer LED misst, und jeder andere Sensor verhält sich im Prinzip
genauso.

## Was ein Sensor liefert

Ein Farbsensor liefert keine Farbe, sondern vier Zahlen: die Anteile von Rot,
Grün und Blau, hinter Farbfiltern gemessen und `r`, `g` und `b` geschrieben,
und einen vierten Wert `c` für *Clear*, der ohne Filter misst. Weil Clear das
gesamte einfallende Licht sieht, ist er der empfindlichste Kanal und der
nützlichste, wenn du nur hell von dunkel unterscheiden musst. Im Muster aus
Eingabe, Verarbeitung und Ausgabe sind diese vier Zahlen die Eingabe des
empfangenden Programms, und erst die Verarbeitung macht daraus einen Namen wie
`"red"`.

Keine dieser Zahlen entspricht dem, was die LED bekommen hat. Stellst du die
LED auf reines Rot, `(255, 0, 0)`, misst der Sensor etwa `r=203, g=41, b=57`
und `c=310`, weil sich die Farbfilter überlappen, Abstand und Winkel Licht
schlucken und das Raumlicht immer mitgemessen wird. Das ist kein Defekt,
sondern der Normalfall, und es hat eine Folge: Du rechnest nicht von den
Messwerten auf das Gesendete zurück, denn eine Formel, die heute passt,
versagt am nächsten Tisch oder am nächsten Tag. Stattdessen arbeitest du mit
den Messwerten deines eigenen Aufbaus, und der Abschnitt über das Kalibrieren
zeigt, wie ein Programm daraus entscheidet, welche Farbe angekommen ist.

## Erst das Dunkel messen

Bevor du eine Farbe misst, misst du das Dunkel, denn ein Sensor zeigt nie
Null: Etwas Raumlicht kommt immer an. Deshalb beginnt jede Messreihe mit einer
**Kontrollmessung** bei ausgeschalteter LED. Jede Ablesung enthält zugleich
Umgebungslicht, das Licht der LED und Rauschen, und was die LED beiträgt, ist
der Unterschied zwischen einer Ablesung und diesem Umgebungspegel. Die
Kontrollmessung verrät dir außerdem, wenn sich die Umgebung ändert, durch
Nachmittagssonne oder die LED einer Nachbargruppe, denn dann wandert auch der
Dunkelwert.

## Zehn Ablesungen einer Farbe

Richtest du den Sensor auf eine Farbe und liest ihn zehnmal ab, ohne etwas zu
verändern, bekommst du zehn verschiedene Zahlen, etwa 214, 211, 218, 209,
216, 213, 220, 207, 215 und 212. Das überrascht viele, denn ein Computer ist
die eine Maschine, die bei gleicher Eingabe verlässlich dieselbe Ausgabe
liefert, aber der Sensor bekommt nie zweimal dieselbe Eingabe: Das Licht
flackert, die Elektronik rauscht, jemand geht vorbei. Diese Schwankung heißt
**Rauschen**, und jedes Messgerät hat sie, sodass zehn gleiche Werte
verdächtiger wären als zehn verschiedene.

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
oder eine benachbarte, die gerade einen schlechten Moment hat. Zwei Reihen
können außerdem denselben Mittelwert haben und sehr unterschiedlich streuen,
und ein Protokoll, das nur den Mittelwert enthält, versteckt genau die
Schwankung, die später zu falsch erkannten Zeichen führt. Deshalb gehört die
Streuung mit hinein.

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

Dasselbe Mitteln kann der Sensor selbst übernehmen. Seine
**Integrationszeit** ist das Ablesefenster, über das ein einzelner Wert Licht
sammelt, und eine längere liefert ruhigere Werte, aber weniger pro Sekunde,
genau wie das Mitteln im Programm. Die **Verstärkung** ist der zweite Regler:
Sie skaliert die Werte und mit ihnen das Rauschen, und zu viel davon treibt
den Sensor in die Sättigung.

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
das heißt, die Wolken überlappen sich.

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
spart sich einen Nachmittag mit Alphabeten, die nie funktionieren konnten.
Mehr Zeichen machen die Bänder schmaler, und schnellere Zeichen machen die
Wolken breiter, weil ein kürzeres Fenster über weniger Licht mittelt, also
verbrauchen beide denselben Sicherheitsabstand, wie [[analog-and-digital]] von
der anderen Seite zeigt. Das Experiment [[measuring-your-noise]] geht diese
Schritte an einer echten Strecke, von zehn Ablesungen einer Farbe bis zur Zahl
der Zeichen, die hineinpassen.

## Erst kalibrieren, dann klassifizieren

Die Wolken sagen dem Empfänger auch, welche Farbe angekommen ist. Statt aus
den vier Zahlen zurückzurechnen, **kalibrierst** du, indem du jede Farbe, die
du senden willst, unter den Bedingungen deines Aufbaus mehrmals misst und
diese Werte als Referenzen aufhebst, und dann **klassifizierst** du, indem du
jede neue Ablesung der nächstgelegenen Wolke von Referenzen zuordnest:

![Ein Koordinatensystem mit dem Rotanteil r nach rechts und dem Blauanteil b nach oben. Sechs rote Referenzwerte bilden unten rechts eine Wolke, sechs blaue oben links. Eine neue Ablesung bei r 170, b 80 ist mit gestrichelten Linien mit beiden Wolken verbunden; die kürzere Linie zur roten Wolke ist hervorgehoben, und die neue Ablesung nimmt die Farbe Rot an.](figure:calibration "Kalibrieren, dann klassifizieren: Eine neue Ablesung gehört zur nächstgelegenen Wolke von Referenzen. Der Grünanteil bleibt hier etwa gleich und ist weggelassen.")

Das Programm hält die Referenzen aus der Zeichnung als Paare `(r, b)`,
berechnet die Mitte jeder Wolke und vergleicht mit `math.dist()` den Abstand
der neuen Ablesung zu beiden Mitten:

```python
import math
import statistics

# reference readings (r, b) of colours you know, measured beforehand
red = [(188, 50), (195, 62), (198, 58), (200, 55), (205, 70), (210, 48)]
blue = [(30, 195), (35, 210), (40, 215), (45, 220), (50, 205), (55, 198)]

def centre(points):
    r = statistics.mean(p[0] for p in points)
    b = statistics.mean(p[1] for p in points)
    return (r, b)

new = (170, 80)
to_red = math.dist(new, centre(red))
to_blue = math.dist(new, centre(blue))
print("Abstand zu Rot:", round(to_red))
print("Abstand zu Blau:", round(to_blue))
print("Rot" if to_red < to_blue else "Blau")
```

Die neue Ablesung liegt 37 Einheiten von der Mitte der roten Referenzen
entfernt und 180 von der der blauen, also gilt sie als Rot. Probier
`new = (120, 130)`, eine Ablesung fast genau zwischen den beiden Wolken: Die
Abstände unterscheiden sich dann nur noch um eine Einheit, und ein wenig
Rauschen entscheidet, welche Farbe herauskommt. Die Entscheidung stützt sich
auf deine eigenen Referenzen, und so lässt sich eine Farbe aus Zahlen
erkennen, die nie mit ihr übereinstimmen.

## Die Regler haben Preisschilder

Es gibt mehrere Wege, das Verhältnis *d*/*s* zu verbessern, und kaum einer
ist umsonst:

| Weg | Wirkung | Preis |
|---|---|---|
| Farben weiter auseinander wählen | *d* wird größer | weniger Zeichen passen in den Bereich |
| weniger Zeichen verwenden | *d* wird größer | weniger Bits pro Zeichen |
| das Licht besser ausrichten | *d* wird größer | nur Handwerk |
| längere Integrationszeit | *s* wird kleiner | weniger Zeichen pro Sekunde |
| mehrere Ablesungen mitteln | *s* wird kleiner | weniger Zeichen pro Sekunde |
| Umgebungslicht abschirmen | *s* wird kleiner | nur Handwerk |
| die Geometrie festlegen | *s* wird kleiner | nur Handwerk |

Die drei Wege, die nur Handwerk kosten, sind die Ausnahme: Das Licht
ausrichten, Umgebungslicht abhalten und den Abstand mit einer Röhre oder einem
Halter festlegen verbessern das Verhältnis, ohne Bits oder Tempo herzugeben.
Alles andere ist ein Tausch, und ob er sich an deiner Strecke lohnt, kann nur
eine Messung beantworten.

## Hat es wirklich geholfen?

Nimm die Frage, ob eine längere Integrationszeit die Erkennung verbessert.
Eine plausible Erklärung sagt, warum das gelten könnte: Längere Messungen
sammeln mehr Licht. Ein KI-Assistent geht weiter und hängt eine Anweisung an:
Verdopple die Integrationszeit, dann wird die Erkennung besser. Beides bleiben
Behauptungen, so gut sie auch begründet sind, und erst eine Messung am eigenen
Aufbau zeigt, ob der Effekt eintritt und wie stark er ist. Ein Experiment
macht aus einer solchen Behauptung in vier Schritten einen Test:

1. eine **Frage**: Verbessert ein längeres Fenster die Erkennung?
2. eine **Vorhersage**, vor dem Messen aufgeschrieben: Mit doppeltem Fenster
   werden mehr Zeichen richtig erkannt
3. eine **Messung** unter kontrollierten Bedingungen: je 50 Zeichen mit dem
   kurzen und mit dem langen Fenster
4. ein **Vergleich** des Ergebnisses mit der Vorhersage: 41 gegen 47 richtige
   stützen die Hypothese, und das umgekehrte Ergebnis würde sie widerlegen

Die Reihenfolge ist entscheidend, denn wer zuerst misst und erst hinterher
festlegt, welches Ergebnis als Erfolg zählt, kann fast jedes Ergebnis als
passend lesen.

## Gezielt messen

Eine **Messreihe** besteht aus mehreren Ablesungen unter gleichen,
festgehaltenen Bedingungen, bei denen genau eine Größe gezielt verändert
wird. Ändert eine Gruppe Abstand und Integrationszeit zugleich und eine
andere nur den Abstand, sehen vielleicht beide ihre Erkennung besser werden,
aber nur die zweite weiß, woran es lag. Eine Messreihe folgt vor, während und
nach dem Messen ein paar Regeln:

| Wann | Was du machst | Warum |
|---|---|---|
| vorher | die Bedingungen und das erwartete Ergebnis aufschreiben | ohne notierte Erwartung lässt sich hinterher fast jedes Ergebnis als Erfolg lesen |
| währenddessen | genau eine Größe verändern, eine Kontrollmessung machen, oft genug wiederholen | nur dann lässt sich ein Unterschied seiner Ursache zuordnen |
| nachher | jeden Wert behalten, mit der Erwartung vergleichen, das Ergebnis festhalten | Ausreißer sind oft die interessanteste Information |

Wiederholungen schützen dich außerdem vor einem Glückstreffer. Ein Empfänger,
der nur Rot von Blau unterscheiden soll, liegt durch reines Raten jedes
zweite Mal richtig, also gelingen fünf Treffer in Folge durch Zufall bei einem
von 32 Versuchen, und in einem Raum voller Gruppen passiert eine solche
Glückssträhne ständig irgendwo. Fünfzig Treffer in Folge haben eine Chance von
eins zu 2⁵⁰, etwa eins zu einer Billiarde, und deshalb wird ein Empfänger mit
langen Serien geprüft, und ein wiederholbares Ergebnis ist mehr wert als ein
beeindruckendes.

## Wenn Assistent und Messung sich widersprechen

Angenommen, ein KI-Assistent schlägt vor, die Verstärkung zu erhöhen, weil
das die Erkennung verbessere, und deine Messreihe zeigt, dass die
Erkennungsrate von 94 auf 82 Prozent fällt. Bevor du den Vorschlag als
widerlegt ablegst, prüfst du deine eigene Reihe: Wurde nur eine Größe
verändert, gab es genug Wiederholungen, gab es eine Kontrollmessung? War die
Reihe sauber, gewinnt sie, denn der Assistent kennt Sensoren dieser Art, aber
nicht deinen Aufbau. Der Fall kommt dann mit Vorschlag, Messung und Ergebnis
in ein Irrtumsprotokoll, damit das Gelernte nicht verloren geht.

Alles in dieser Lektion ist eine Eigenschaft einer bestimmten Strecke, mit
ihrem Raum, ihrem Abstand und ihrem Umgebungslicht, und eine Strecke, die am
Fenster bei Tageslicht kalibriert wurde, muss im abgedunkelten Raum neu
gemessen werden. Kein Sprachmodell hat darauf Zugriff, und am Ende gewinnt
nicht die schönste Erklärung, sondern die sauberste Messreihe.

## Zum Mitnehmen

- Ein Sensor liefert Zahlen und keine Farbe, und sie stimmen nie mit dem
  Gesendeten überein, deshalb liest du sie gegen eine Kontrollmessung im
  Dunkeln und kalibrierst mit bekannten Farben.
- Jede Ablesung streut, deshalb beschreibst du eine Reihe durch ihren
  Mittelwert und ihre Streuung, und eine einzelne Ablesung sagt fast nichts.
- Mitteln über längere Fenster oder eine längere Integrationszeit beruhigt
  die Werte, aber die Streuung fällt nur mit der Wurzel aus der Fensterlänge,
  und jeder gemittelte Wert kostet Ablesungen.
- Zwei Zeichen sind sicher unterscheidbar, wenn sich ihre Wolken nicht
  überlappen, und es zählt das Verhältnis von Abstand zu Streuung, nicht die
  Mittelwerte allein.
- Wie viele Zeichen passen, ist der nutzbare Bereich geteilt durch die Breite
  eines Bandes, und die ist doppelt so groß wie die Streuung.
- Eine neue Ablesung gehört zur nächstgelegenen Wolke von Referenzen.
- Fast jede Verbesserung kostet Bits pro Zeichen oder Zeichen pro Sekunde,
  außer das Licht auszurichten, Umgebungslicht abzuschirmen und die Geometrie
  festzulegen.
- Ob eine Verbesserung geholfen hat, zeigt eine Messreihe mit vorher
  notierter Vorhersage, genau einer veränderten Größe und genügend
  Wiederholungen, denn fünf Treffer in Folge können Glück sein, fünfzig
  nicht.

![Quiz: Signal und Rauschen](item:signal-and-noise-quiz)
