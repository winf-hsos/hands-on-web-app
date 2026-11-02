---
title: Symbole und Information
summary: >-
  Ein Symbol ist ein Zustand, der sich unterscheiden lässt und auf den man sich
  geeinigt hat, und wie viel Information er trägt, lässt sich in Halbierungen
  zählen: Bei N gleich wahrscheinlichen Möglichkeiten sind es log₂(N) Bit.
objectives:
  intro: "In dieser Lektion erfährst du, woher Bedeutung kommt und wie sich Information messen lässt, und kannst danach:"
  goals:
    - "ein Symbol als vereinbarten, unterscheidbaren Zustand bestimmen und erklären, warum auch eine perfekte Übertragung Unsinn ergeben kann"
    - "Information als beseitigte Unsicherheit erklären und mit `math.log2()` ausrechnen, wie viele Bit eine von N gleich wahrscheinlichen Möglichkeiten trägt"
    - "begründen, warum eine Frage, die das Feld halbiert, ein Bit wert ist und eine schiefe Frage im Mittel viel weniger"
    - "ausrechnen, wie viel schneller dieselbe Datei mit acht statt zwei Symbolen ankommt, und warum zwei Symbole in Gruppen trotzdem für jede Nachricht genügen"
    - "erklären, warum der Morsecode dem häufigen Buchstaben e den kürzesten Code gibt"
translation_of: en
based_on: 2026-11-01
---

Nordatlantik, 1942: Funkverkehr würde den Geleitzug verraten, also halten die
Schiffe Funkstille und sprechen trotzdem miteinander, mit einer Lampe und einer
Klappe davor, kurz, kurz, kurz, lang. Das Licht selbst weiß nichts von
Buchstaben, und es bedeutet nur deshalb etwas, weil beide Schiffe dieselbe
Tabelle haben. In dieser Lektion geht es um die beiden Hälften dieser
Situation: was einen Zustand zum Symbol macht und wie viel dir ein Symbol sagen
kann.

## Unterscheidbar und vereinbart

Ein **Symbol** ist ein vereinbarter, unterscheidbarer Zustand, und beide Wörter
tragen. Unterscheidbar ist eine Frage der Physik und des Empfängers: Kann er
diesen Zustand von allen anderen trennen, auch wenn unterwegs Rauschen
dazukommt? Darum ging es in [[analog-and-digital]]. Vereinbart ist eine Frage
ganz anderer Art, die keine Messung beantworten kann, denn sie fragt, wofür der
Zustand steht, und das können nur die Menschen an beiden Enden festlegen.

Die Menge aller Symbole, die Sender und Empfänger vereinbart haben, ist ihr
**Alphabet**. Die 26 Buchstaben von A bis Z sind ein Alphabet, aber vier Farben
einer Lampe, zwei Töne oder eine Flagge, die entweder oben oder unten hängt,
sind genauso Alphabete.

## Perfekter Empfang, perfekter Unsinn

Was passiert, wenn die Vereinbarung fehlt, lässt sich leicht zeigen. Sender
und Empfänger haben je eine Tabelle, die vier Farben vier Buchstaben zuordnet,
aber sie haben die Tabellen nicht gemeinsam geschrieben. Vier Farben kommen an,
jede einzelne richtig:

![Oben: empfangen yellow red green blue. Darunter zwei Tabellen nebeneinander. Die Tabelle des Senders ordnet red, green, blue und yellow die Buchstaben E, I, N und S zu, die Tabelle des Empfängers die Buchstaben I, N, S und E, rot gezeichnet. Unten: gemeint SEIN, gelesen EINS.](figure:two-tables "Beide Tabellen ordnen Farben Buchstaben zu, aber nicht auf dieselbe Weise: Vier Farben kommen ohne einen einzigen Fehler an, und der Empfänger liest ein anderes Wort.")

Das Programm übersetzt dieselben vier Farben mit beiden Tabellen:

```python
received = ["yellow", "red", "green", "blue"]   # every colour arrived correctly

sender_table = {"red": "E", "green": "I", "blue": "N", "yellow": "S"}
receiver_table = {"red": "I", "green": "N", "blue": "S", "yellow": "E"}

meant = ""
read = ""
for colour in received:
    meant += sender_table[colour]
    read += receiver_table[colour]

print("Gemeint:", meant)
print("Gelesen:", read)
```

Es gab keinen Übertragungsfehler, keine Störung und keine schlechte Messung,
und trotzdem ist die Nachricht wertlos. Schlimmer noch, aus *SEIN* wurde
*EINS*, wieder ein echtes Wort, sodass niemand bemerkt, dass etwas schiefging.
Ändere einen Eintrag in `receiver_table` und lass das Programm noch einmal
laufen: Solange sich die beiden Tabellen unterscheiden, kann das Signal perfekt
sein und die Bedeutung trotzdem falsch.

Im Code ist die Vereinbarung ein Wörterbuch wie `sender_table`. Es wird nie
übertragen, es muss vorher auf beiden Seiten liegen, und damit ist es keine
Nachricht, sondern ein Versprechen. Im Experiment
[[perfect-reception-perfect-nonsense]] erlebst du das gebrochene Versprechen
selbst.

## Information ist beseitigte Unsicherheit

Was eine Nachricht wert ist, hängt nicht von ihrer Länge ab, sondern davon, wie
viel Unsicherheit sie beseitigt. Jemand zieht eine Karte aus einem Spiel mit 32
Karten, und du darfst nur Fragen stellen, die sich mit Ja oder Nein beantworten
lassen. Fragst du geschickt, etwa „Ist sie rot?“ und danach „Ist es Herz?“, bist
du nach fünf Fragen fertig:

![Sechs Kästen in einer Reihe: 32, 16, 8, 4, 2 und 1, verbunden durch Pfeile mit je einem Fragezeichen darüber. Über der Reihe steht noch möglich, darunter fünf Fragen, und jede halbiert, was übrig ist. Der letzte Kasten, 1, hat einen gelben Rahmen.](figure:halving "Jede Frage halbiert, was übrig ist, deshalb genügen fünf Fragen, und das ist kein Glück.")

Die Zahl der Halbierungen ist das Maß, und seine Einheit ist das **[[bit|Bit]]**.
Bei *N* gleich wahrscheinlichen Möglichkeiten beträgt die Unsicherheit

    H = log₂(N) Bit

Die 32 Karten sind nicht die Unsicherheit, sondern der Raum der Möglichkeiten;
die Unsicherheit ist die 5. **Information** ist dann eine Differenz, die
Unsicherheit vorher minus die Unsicherheit nachher, I = H₁ − H₂. Eine Frage,
die das Feld halbiert, senkt *H* um genau 1, ihre Antwort ist also ein Bit
wert. Python berechnet den Logarithmus mit `math.log2()`:

```python
import math

for n in [2, 4, 32, 26]:
    print(n, "Möglichkeiten:", round(math.log2(n), 2), "Bit")
```

Zwei Möglichkeiten ergeben ein Bit, vier ergeben zwei und 32 ergeben fünf. Für
26 Buchstaben kommen 4,7 Bit heraus, und das ist keine ganze Zahl von Fragen:
Ein Code aus Ja-Nein-Symbolen braucht fünf davon je Buchstabe, denn vier
ergeben nur 2⁴ = 16 Kombinationen und fünf ergeben 32, dasselbe *k*ⁿ wie in
[[place-value-systems]].

Du kannst dem Halbieren bei der Arbeit zusehen. Denk dir eine Zahl von 1 bis 32
aus und lass das Programm sie finden; beantworte jede Frage mit `j` oder `n`:

```python
low, high = 1, 32
questions = 0

while low < high:
    middle = (low + high) // 2
    answer = input(f"Ist deine Zahl größer als {middle}? (j/n) ")
    questions += 1
    if answer == "j":
        low = middle + 1
    else:
        high = middle

print(f"Deine Zahl ist {low}, gefunden mit {questions} Fragen.")
```

Welche Zahl du auch wählst, das Programm braucht genau fünf Fragen, weil jede
Antwort die Hälfte des Rests beseitigt. Das Experiment [[card-guessing]] spielt
dasselbe Spiel mit echten Karten und vergleicht es mit bloßem Raten.

## Nicht jede Antwort ist ein Bit wert

Eine schiefe Frage bringt weniger. Fragst du „Ist es das Pik-Ass?“, hörst du
fast immer Nein, und dieses Nein beseitigt fast nichts. Eine seltene Antwort
sagt viel, eine erwartete wenig, und weil du dir nicht aussuchen kannst, welche
du bekommst, zählt der Durchschnitt. Der **Erwartungswert** einer Frage zählt
über alle möglichen Antworten zusammen, wie wahrscheinlich jede Antwort ist,
mal das, was sie wert wäre:

    E = Σ pᵢ · log₂(1 / pᵢ)

Für eine Ja-Nein-Frage sind das zwei Summanden:

| Frage | Chance auf Ja | Ja ist wert | Nein ist wert | Im Mittel |
|---|---|---|---|---|
| „Ist sie rot?“ | 1/2 | 1 Bit | 1 Bit | 1 Bit |
| „Ist es das Pik-Ass?“ | 1/32 | 5 Bit | 0,05 Bit | 0,2 Bit |

Die Funktion `worth()` setzt die Zahlen ein:

```python
import math

def worth(p_yes):
    p_no = 1 - p_yes
    return p_yes * math.log2(1 / p_yes) + p_no * math.log2(1 / p_no)

print(round(worth(1 / 2), 2))
print(round(worth(1 / 32), 2))
```

Ein ganzes Bit bekommt nur die Frage, die das Feld wirklich in zwei Hälften
teilt, und deshalb gewinnt das Halbieren im Durchschnitt: Es holt aus jeder
Antwort den größten sicheren Gewinn. Die zweite Zeile zeigt noch etwas, das du
dir merken solltest: Eine Frage, deren Ausgang fast sicher ist, trägt kaum
Information, wie lang ihre Antwort auch sein mag, und genau auf dieser
Beobachtung beruht die Kompression.

## Was das für ein Alphabet bedeutet

Dieselbe Rechnung sagt dir, was ein Symbol wert ist. Jedes Symbol aus einem
Alphabet von *N* gleich wahrscheinlichen Symbolen trägt log₂(N) Bit, zwei
Farben tragen also ein Bit je Symbol, vier tragen zwei und acht tragen drei.
Bei gleich vielen Symbolen je Sekunde ist dieselbe Datei mit acht Farben
deshalb in einem Drittel der Zeit übertragen, die sie mit zwei braucht.

Warum dann nicht gleich 256 Farben? Weil die Physik mitredet: Mehr Symbole
bedeuten kleinere Abstände zwischen ihnen, und ab einem gewissen Punkt frisst
das Rauschen den Gewinn wieder auf, wie [[analog-and-digital]] und
[[signal-and-noise]] zeigen. Damit wird
die Größe eines Alphabets zu einer Frage der Messung und nicht des Geschmacks.

Am anderen Ende genügen zwei Symbole für jede beliebige Nachricht, sie brauchen
nur mehr Platz. Fünf Blitze mit je zwei Möglichkeiten ergeben 2⁵ = 32
Kombinationen, genug für ein ganzes Alphabet. Was ein großes Alphabet je
Symbol leistet, leisten zwei Symbole in der Gruppe, und deshalb kommt jeder
Rechner mit 0 und 1 aus ([[why-two-states]]): Ein kleines Alphabet ist keine
Sackgasse, sondern nur langsamer.

## Wenn Symbole nicht gleich wahrscheinlich sind

Bisher waren alle Symbole gleich wahrscheinlich. In echtem Text sind sie es
nicht, und der [[morse-code|Morsecode]] nutzt das aus: Der häufigste Buchstabe
im Deutschen wie im Englischen, das e, bekommt den kürzesten Code, einen
einzelnen Punkt, das t einen einzelnen Strich, und ein seltener Buchstabe wie
das q braucht vier Zeichen, `− − · −`.

Die Ungleichbehandlung lohnt sich, weil sie die durchschnittliche Nachricht
verkürzt: Was oft vorkommt, soll wenig kosten. Ein seltenes Symbol trägt mehr
Information als ein häufiges, also darf es auch mehr Platz einnehmen. Codes
mit ungleich langen Codewörtern haben allerdings ihren eigenen Preis, denn der
Empfänger muss herausfinden, wo ein Codewort endet; der Morsecode verwendet
dafür Pausen, und ein präfixfreier Code kommt ohne sie
aus.

## Zum Mitnehmen

- Ein Symbol ist ein vereinbarter, unterscheidbarer Zustand: Die Physik
  entscheidet, ob er sich unterscheiden lässt, und nur eine Vereinbarung, was
  er bedeutet.
- Die Vereinbarung, etwa ein Wörterbuch aus Farben und Buchstaben, muss vorher
  auf beiden Seiten liegen; weicht sie ab, ergibt perfekter Empfang perfekten
  Unsinn.
- Information ist beseitigte Unsicherheit, und bei *N* gleich wahrscheinlichen
  Möglichkeiten beträgt die Unsicherheit log₂(N) Bit.
- Eine Frage, die das Feld halbiert, ist ein Bit wert; eine schiefe Frage ist
  im Mittel viel weniger wert, auch wenn sie alles auf einmal klären könnte.
- Ein Symbol aus *N* gleich wahrscheinlichen Symbolen trägt log₂(N) Bit,
  größere Alphabete sind also schneller, bis das Rauschen die Grenze setzt, und
  zwei Symbole in Gruppen genügen für jede Nachricht.
- Häufige Symbole verdienen kurze Codes, deshalb gibt der Morsecode dem e einen
  einzelnen Punkt.
