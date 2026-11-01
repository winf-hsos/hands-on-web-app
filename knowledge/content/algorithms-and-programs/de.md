---
title: Vom Algorithmus zum Programm
summary: >-
  Was aus einer Beschreibung einen Algorithmus macht, was ein Programm
  hinzufügt, woran ein Verfahren erkennt, dass es fertig ist, und warum eine
  richtige Lösung trotzdem unbrauchbar sein kann.
objectives:
  intro: "In dieser Lektion verfolgst du ein Verfahren vom Zettel bis in den Computer und kannst danach:"
  goals:
    - "erklären, was eine Beschreibung zum Algorithmus macht und warum ein Programm ein für den Computer vollständig aufgeschriebener Algorithmus ist"
    - "vorhersagen, was eine kurze Liste von Anweisungen bewirkt, und zeigen, dass eine andere Reihenfolge ein anderes Programm ergibt"
    - "Bubblesort von Hand auf wenigen Werten ausführen und seine Abbruchbedingung benennen"
    - "erklären, warum eine Schleife ohne erreichbares Ende nie aufhört und wann genau das gewollt ist"
    - "zwei richtige Verfahren nach ihrem Aufwand vergleichen und sagen, wie dieser mit der Größe des Problems wächst"
translation_of: en
based_on: 2026-11-01
---

Um 1900 stand in vielen Wohnzimmern ein Klavier, das von selbst spielte. Die
Tasten bewegten sich, während der Hocker leer blieb, und die Musik kam von
einer Papierrolle über der Tastatur, in der jedes gestanzte Loch „drück jetzt
diese Taste“ bedeutete. Das Klavier verstand nichts von Musik und führte aus,
was auf der Rolle stand; der eigentliche Pianist war also, wer die Rolle
gestanzt hatte, vielleicht Jahrzehnte vorher. Genau so verhalten sich ein
Programm, ein Computer und der Mensch, der das Programm schreibt, und diese
Lektion sieht sich das genauer an: was aus einer Beschreibung einen
Algorithmus macht, was ein Programm hinzufügt, wann ein solches Verfahren
endet und warum eine richtige Lösung trotzdem unbrauchbar sein kann.

## Was einen Algorithmus ausmacht

Stell dir vor, jemand hält nacheinander farbige Karten hoch, und du notierst
sie in vier Schritten: auf die Karte schauen, entscheiden, welche von vier
Farben sie hat, den Anfangsbuchstaben dieser Farbe aufschreiben und auf die
nächste Karte warten. Du kannst diese Schritte befolgen, ohne zu wissen, was
die Farbfolge bedeutet, und genau das macht sie zu einem **Algorithmus**:
einer Folge von Schritten, die so genau beschrieben ist, dass keine Frage
offen bleibt und wer sie ausführt, ihren Zweck nicht verstehen muss.

Ein Algorithmus braucht keinen Computer. Er kann in Alltagssprache auf einem
Zettel stehen, und ein Mensch kann ihn von Hand ausführen. Entscheidend ist,
dass jeder Schritt eindeutig ist: Tausend Schritte sind immer noch ein
Algorithmus, solange jeder davon klar ist, während vier Schritte keiner sind,
wenn ein einziger davon ein Urteil verlangt, etwa „schreib auf, ob die Farbe
hübsch aussieht“. Donald Knuth, dessen Bücher das Standardwerk zum Thema
sind, nennt fünf Eigenschaften: Ein Algorithmus endet nach endlich vielen
Schritten, jeder Schritt ist genau festgelegt, er nimmt eine Eingabe, er
liefert eine Ausgabe, und jeder seiner Schritte lässt sich tatsächlich
ausführen. Die [[programming-principles|Grundideen des Programmierens]]
vergleichen einen Algorithmus mit einem Rezept; hier geht es darum, was sich
ändert, wenn der Koch eine Maschine ist.

## Vom Algorithmus zum Programm

Ein Algorithmus auf dem Zettel ist noch kein Programm. Ein Mensch, der ihn
ausführt, ergänzt, was offensichtlich gemeint war, meist ohne es zu merken:
Fehlt ein Schritt, fügt er ihn ein, und ist die Reihenfolge ungeschickt,
stellt er sie um. Ein Computer macht weder das eine noch das andere. **Ein
Programm ist eine Liste von Anweisungen, die ein Computer genau und der Reihe
nach befolgt**, und damit kommt eine Anforderung hinzu, die der Zettel nie
hatte: Die Liste muss vollständig sein.

Der Kasten unten ist eine winzige Maschine dieser Art. Die Liste `program`
enthält vier Anweisungen für eine Lampe, und die Schleife darunter arbeitet
sie von oben nach unten ab: Eine Anweisung `color` schaltet die Lampe, eine
Anweisung `wait` lässt auf einer Uhr Zeit vergehen. Wie die Maschine innen
funktioniert, musst du noch nicht verstehen, denn die Python-Lektionen
erklären jeden Teil; vorerst änderst du nur die Liste.

```python
program = [
    ("color", "red"),
    ("wait", 1),
    ("color", "blue"),
    ("wait", 1),
]

clock = 0
for command, value in program:
    if command == "color":
        print(f"{clock} s  Lampe: {value}")
    elif command == "wait":
        clock = clock + value
print(f"{clock} s  Ende")
```

Die Lampe ist eine Sekunde rot und dann eine Sekunde blau. Lösch jetzt das
erste `("wait", 1),` und lass die Maschine noch einmal laufen: Rot und Blau
erscheinen beide bei 0 Sekunden, Rot dauert also überhaupt nicht. Eine
echte Lampe wäre für einen winzigen Bruchteil einer Sekunde rot, viel zu
kurz für ein Auge, und du sähest immer nur Blau. Das Programm ist nicht
kaputt, sondern richtig und nur zu schnell für dich, denn ein Computer wartet
nur dort, wo das Programm es sagt.

Setz die Zeile danach wieder ein, aber ans Ende der Liste, sodass beide
Farben zuerst kommen und beide Wartezeiten danach. Die Lampe wird jetzt rot
und sofort blau, und erst dann wartet die Maschine zwei Sekunden, mit blauer
Lampe. Es fehlt keine Zeile, und trotzdem ist es ein anderes Programm, denn
die Reihenfolge gehört zum Programm und ist nicht bloß eine Schreibweise.

Fast jeder Fehler in einem Programm entsteht aus dieser Lücke zwischen dem,
was gemeint war, und dem, was dasteht, und nur selten daraus, dass etwas
kaputt ist. Kann der Computer eine Zeile gar nicht ausführen, etwa weil ein
Name falsch geschrieben ist, hält er an und meldet die Zeile und den Grund;
wie du eine solche Meldung liest, zeigt [[python-error-messages]].

## Sortieren nach Regeln

Ein zweiter Algorithmus zeigt, wie viel ein paar genaue Regeln erreichen.
Sechs Personen stehen in zufälliger Reihenfolge in einer Reihe, und jede
befolgt dieselben Regeln, ohne vorauszudenken: Schau deinen rechten Nachbarn
an und tausch mit ihm den Platz, wenn du größer bist; ist das Ende der Reihe
erreicht, fang links wieder an; und hör auf, sobald ein ganzer Durchgang
durch die Reihe ohne Tausch blieb. Nach ein paar Durchgängen steht die Reihe
nach Größe sortiert, obwohl niemand es geplant hat. Das Verfahren heißt
**Bubblesort**, weil die Großen nach rechts aufsteigen wie Blasen im Wasser.

![Sechs Balken der Höhen 2, 5, 1, 6, 3 und 4 in einer Reihe. Beim Abspielen läuft je Schritt ein Durchgang: Zwei benachbarte Balken werden gelb, während sie verglichen werden, und der größere rückt nach rechts. Nach dem dritten Durchgang, der nichts mehr zu tauschen findet, werden alle Balken grün.](figure:bubble "Jeder Schritt ist ein Durchgang: drei Vertauschungen, noch einmal drei, und ein dritter Durchgang ohne Tausch beendet das Verfahren.")

Die Zeichnung wendet dieselben Regeln auf sechs Balken an. Der erste
Durchgang vertauscht dreimal, der zweite noch dreimal, und der dritte findet
nichts mehr zu tauschen. In Python sehen die Regeln so aus:

```python
values = [2, 5, 1, 6, 3, 4]

passes = 0
while True:
    swaps = 0
    for i in range(len(values) - 1):
        if values[i] > values[i + 1]:
            values[i], values[i + 1] = values[i + 1], values[i]
            swaps = swaps + 1
    passes = passes + 1
    print(f"Durchgang {passes}: {values}, {swaps} Vertauschungen")
    if swaps == 0:
        break
```

Die Zeile mit `for` läuft die Reihe entlang und vergleicht jeden Wert mit
seinem rechten Nachbarn, die Zeile nach dem `if` vertauscht die beiden, und
die Schleife `while True` darum herum beginnt den nächsten Durchgang. Die
Ausgabe zeigt die Reihe nach jedem Durchgang, wie in der Zeichnung. Setz
andere Zahlen in die Liste, mehr oder weniger als sechs, und dieselben Zeilen
sortieren auch sie.

## Wann ist Schluss?

Woher weiß Bubblesort, dass es fertig ist? Niemand ruft von außen „fertig“,
und niemand beurteilt, ob die Reihe sortiert aussieht, denn Urteilen gehört
nicht zu den Regeln. Das Ende folgt aus den Regeln selbst: Ein Durchgang ohne
eine einzige Vertauschung heißt, dass nichts mehr zu sortieren ist. Eine
solche Regel heißt **Abbruchbedingung**, und im Code ist sie die Zeile
`if swaps == 0:` mit dem `break` darunter, das die Schleife verlässt.

Ein Ablauf endet nur, wenn sein Ende erreichbar ist. Lösch die beiden Zeilen
mit `if swaps == 0:` und `break` und lass das Programm noch einmal laufen:
`while True` hat jetzt keinen Ausweg mehr, die Durchgänge gehen endlos
weiter, und du hältst das Programm mit **Stopp** an. Der Computer merkt
nicht, dass nichts Neues mehr passiert, denn er merkt überhaupt nichts und
führt aus, was dasteht. Ein Fehler ist das nicht immer: Eine Lampe, die
blinken soll, bis jemand sie ausschaltet, läuft in genau so einer
Endlosschleife, und ebenso ein Programm, das auf Nachrichten wartet. Eine
Schleife, die enden soll, braucht dagegen eine Bedingung, die irgendwann
zutrifft, und die Klage „mein Programm hängt“ heißt fast immer, dass ihr
diese fehlt. Mehr solche Schleifen zeigt [[python-while-loops]].

Eine Bedingung kann auch dastehen und trotzdem nie eintreten, und daran
siehst du, wie genau die Regeln sein müssen. Mach aus der `4` in der Liste
eine `5`, sodass zwei Werte gleich sind, und aus `>` ein `>=`, sodass die
Regel lautet „tausch, wenn du größer oder gleich groß bist“. Die beiden
Fünfen tauschen dann in jedem Durchgang die Plätze, jeder Durchgang hat eine
Vertauschung, und die Reihe kommt nie zur Ruhe; ein einziges Zeichen in der
Regel entscheidet also, ob das Verfahren endet.

## Richtig ist nur das Mindeste

Zwei Verfahren können beide richtig sein und trotzdem Welten auseinander
liegen. Jemand denkt sich eine Zahl zwischen 1 und 100, und du darfst Fragen
stellen, die mit Ja oder Nein beantwortet werden. Du kannst eine Zahl nach
der anderen abfragen, was im ungünstigsten Fall 99 Fragen kostet, oder du
fragst, ob die Zahl größer als 50 ist, und halbierst so mit jeder Frage den
Bereich, was höchstens sieben Fragen kostet. Beide Verfahren finden die Zahl
sicher, und der Unterschied wächst mit der Größe des Problems:

| Zahlen | einzeln | halbieren |
|---|---|---|
| 100 | 99 | 7 |
| 1.000 | 999 | 10 |
| 1.000.000 | 999.999 | 20 |

Eine Lösung kann also richtig und trotzdem unbrauchbar sein, und deshalb
vergleicht man Verfahren nach ihrem **Aufwand**: wie viele Schritte, wie viel
Zeit oder wie viele Messungen sie brauchen, und vor allem, wie diese Zahl
wächst, wenn das Problem wächst. Das Halbieren kannst du in [[card-guessing]]
selbst ausprobieren.

Auch Bubblesort hat einen Aufwand, und der Kasten unten zählt ihn als Zahl
der Vergleiche, bis die Reihe sortiert ist. Sechs Werte in umgekehrter
Reihenfolge brauchen 30 Vergleiche.

```python
values = [6, 5, 4, 3, 2, 1]

comparisons = 0
while True:
    swaps = 0
    for i in range(len(values) - 1):
        comparisons = comparisons + 1
        if values[i] > values[i + 1]:
            values[i], values[i + 1] = values[i + 1], values[i]
            swaps = swaps + 1
    if swaps == 0:
        break
print(f"{len(values)} Werte sortiert mit {comparisons} Vergleichen")
```

Ersetz jetzt die Liste durch `list(range(40, 0, -1))`, das die Zahlen von 40
abwärts bis 1 liefert. Vierzig Werte brauchen 1.560 Vergleiche und tausend
bräuchten 999.000, denn bei n Werten in umgekehrter Reihenfolge macht das
Verfahren n Durchgänge mit je n − 1 Vergleichen. Sein Aufwand wächst also
nicht wie die Länge der Reihe, sondern ungefähr wie ihr Quadrat, und deshalb
verwenden `sorted()` und `sort()` aus [[python-lists]] ein geschickteres
Verfahren, dessen Aufwand viel langsamer wächst.

## Zum Mitnehmen

- Ein Algorithmus ist eine Folge von Schritten, so genau, dass man sie
  ausführen kann, ohne ihren Zweck zu verstehen; er braucht keinen Computer.
- Ein Programm ist eine Liste von Anweisungen, die ein Computer genau und der
  Reihe nach befolgt. Er ergänzt nichts, also muss die Liste vollständig
  sein, und eine andere Reihenfolge ergibt ein anderes Programm.
- Ein Verfahren endet nur, wenn seine Abbruchbedingung erreichbar ist;
  Bubblesort hört nach einem Durchgang ohne Vertauschung auf.
- Richtig zu sein ist das Mindeste: Zwei richtige Verfahren vergleicht man
  nach ihrem Aufwand und danach, wie er mit der Größe des Problems wächst.
