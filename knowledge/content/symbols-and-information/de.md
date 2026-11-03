---
title: Symbole und Information
summary: >-
  Wie aus unterscheidbaren Zuständen durch eine Vereinbarung Symbole werden,
  wie man mit halbierenden Ja-Nein-Fragen Information in Bit zählt und was ein
  größeres Alphabet an Bit je Symbol einbringt und an Sicherheit kostet.
objectives:
  intro: "Am Beispiel einer Lichtstrecke mit mehreren Farben zeigt dir diese Lektion, wie Licht zu einem Symbol wird und wie viel Information es trägt, und danach kannst du:"
  goals:
    - "erklären, warum ein Symbol ein vereinbarter und unterscheidbarer Zustand ist und eine fehlerfreie Übertragung ohne gemeinsame Tabelle trotzdem Unsinn liefert"
    - "begründen, warum halbierende Ja-Nein-Fragen eine von 32 Karten immer in fünf Fragen finden und im Schnitt mehr Information liefern als eine schiefe Frage"
    - "mit `H = log₂(N)` die Unsicherheit und mit `I = H₁ − H₂` die Information einer Antwort in Bit berechnen und mit `math.log2()` nachrechnen"
    - "ausrechnen, wie viele Bit ein Symbol aus N gleich wahrscheinlichen Farben trägt, wie sich die Übertragungsdauer einer Datei dadurch verändert und warum zwei Symbole in Gruppen trotzdem für jede Nachricht genügen"
    - "erklären, warum der Morsecode dem häufigen Buchstaben e den kürzesten Code gibt"
    - "abwägen, warum mehr Farben mehr Bit je Symbol bringen, aber enger zusammenrücken, sodass nur eine Messreihe die Größe des eigenen Alphabets festlegen kann"
translation_of: en
based_on: 2026-11-03
---

Nordatlantik, 1942: Funkverkehr würde den Geleitzug verraten, also halten die
Schiffe Funkstille und sprechen trotzdem miteinander, mit einer Lampe und einer
Klappe davor, kurz, kurz, kurz, lang. Das Licht selbst weiß nichts von
Buchstaben, und es bedeutet nur deshalb etwas, weil beide Schiffe dieselbe
Tabelle haben. In dieser Lektion geht es um die beiden Hälften dieser
Situation: was einen Zustand zum Symbol macht und wie viel dir ein Symbol sagen
kann. Das durchgehende Beispiel ist eine Strecke, die Daten mit Licht
überträgt: Eine LED sendet Farben, und ein Sensor unterscheidet sie.

## Unterscheidbar und vereinbart

Ein **Symbol** ist ein vereinbarter, unterscheidbarer Zustand, und beide Wörter
tragen. Unterscheidbar ist eine Frage der Physik und des Empfängers: Kann er
diesen Zustand von allen anderen trennen, auch wenn unterwegs Rauschen
dazukommt? Darum ging es in [[analog-and-digital]]. Vereinbart ist eine Frage
ganz anderer Art, die keine Messung beantworten kann, denn sie fragt, wofür der
Zustand steht, und das können nur die Menschen an beiden Enden festlegen.

Ein erhobener Daumen zeigt beide Hälften. Niemand verwechselt ihn mit einer
Faust oder einer offenen Hand, er ist also leicht zu unterscheiden, aber eine
Bedeutung trägt der Daumen selbst nicht: In weiten Teilen Europas heißt er
„gut“, in Teilen Westafrikas und des Nahen Ostens ist er eine Beleidigung, und
wer in Deutschland an den Fingern abzählt, hebt für „eins“ den Daumen, wo man
in den USA den Zeigefinger hebt.

Die Menge aller Symbole, die Sender und Empfänger vereinbart haben, ist ihr
**Alphabet**. Die 26 Buchstaben von A bis Z sind ein Alphabet, aber vier Farben
einer Lampe, zwei Töne oder eine Flagge, die entweder oben oder unten hängt,
sind genauso Alphabete.

## Perfekter Empfang, perfekter Unsinn

Was passiert, wenn die Vereinbarung fehlt, lässt sich leicht zeigen. Der
Sender buchstabiert *gans* mit vier Farben, Rot für g, Grün für a, Blau für n
und Gelb für s, und alle vier Farben kommen ohne einen einzigen Fehler an. Die
Tabelle des Empfängers vertauscht aber Rot und Gelb:

![Oben: empfangen red green blue yellow. Darunter zwei Tabellen nebeneinander. Die Tabelle des Senders ordnet red, green, blue und yellow die Buchstaben g, a, n und s zu, die Tabelle des Empfängers die Buchstaben s, a, n und g, wobei die vertauschten s und g rot gezeichnet sind. Unten: gemeint gans, gelesen sang.](figure:two-tables "Beide Tabellen ordnen Farben Buchstaben zu, aber nicht auf dieselbe Weise: Vier Farben kommen ohne einen einzigen Fehler an, und der Empfänger liest ein anderes Wort.")

Das Programm übersetzt dieselben vier Farben mit beiden Tabellen:

```python
received = ["red", "green", "blue", "yellow"]   # every colour arrived correctly

sender_table = {"red": "g", "green": "a", "blue": "n", "yellow": "s"}
receiver_table = {"red": "s", "green": "a", "blue": "n", "yellow": "g"}

meant = ""
read = ""
for colour in received:
    meant += sender_table[colour]
    read += receiver_table[colour]

print("Gemeint:", meant)
print("Gelesen:", read)
```

Es gab keinen Übertragungsfehler, keine Störung und keine schlechte Messung,
und trotzdem ist die Nachricht falsch. Schlimmer noch, aus *gans* wurde
*sang*, wieder ein echtes Wort, sodass niemand bemerkt, dass etwas schiefging.
Ändere einen Eintrag in `receiver_table` und lass das Programm noch einmal
laufen: Solange sich die beiden Tabellen unterscheiden, kann das Signal perfekt
sein und die Bedeutung trotzdem falsch.

Im Code ist die Vereinbarung ein Wörterbuch wie `sender_table`. Es wird nie
übertragen, es muss vorher auf beiden Seiten liegen, und damit ist es keine
Nachricht, sondern ein Versprechen, und wer es ändert, ohne es dem Gegenüber zu
sagen, baut den Unsinn von oben nach. Dasselbe Wörterbuch kann Farben genauso
gut Bitfolgen zuordnen, `{"red": "00", "green": "01", "blue": "10", "yellow": "11"}`,
und wie viele Stellen eine solche Folge braucht, ist Thema des nächsten Teils.
Im Experiment [[perfect-reception-perfect-nonsense]] erlebst du das gebrochene
Versprechen selbst.

## Das Ratespiel, gemessen

Was eine Nachricht wert ist, hängt nicht von ihrer Länge ab, sondern davon, wie
viel Unsicherheit sie beseitigt. Jemand zieht eine Karte aus einem Spiel mit 32
Karten, und du darfst nur Fragen stellen, die sich mit Ja oder Nein beantworten
lassen. Fragst du geschickt, etwa „Ist sie rot?“ und danach „Ist es Herz?“, bist
du nach fünf Fragen fertig:

![Sechs Kästen in einer Reihe: 32, 16, 8, 4, 2 und 1, verbunden durch Pfeile mit je einem Fragezeichen darüber. Über der Reihe steht noch möglich, darunter fünf Fragen, und jede halbiert, was übrig ist. Der letzte Kasten, 1, hat einen gelben Rahmen.](figure:halving "Jede Frage halbiert, was übrig ist, deshalb genügen fünf Fragen, und das ist kein Glück.")

Die Zahl der nötigen Halbierungen ist das Maß, um das es in diesem Teil geht,
und seine Einheit ist das **[[bit|Bit]]**: Eine Frage, die das Feld halbiert,
ist ein Bit wert. Du kannst dem Halbieren bei der Arbeit zusehen. Denk dir eine
Zahl von 1 bis 32 aus und lass das Programm sie finden; beantworte jede Frage
mit `j` oder `n`:

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

## Nicht jede Antwort ist gleich viel wert

Eine schiefe Frage bringt weniger. „Ist es das Pik-Ass?“ kann alles auf einmal
klären, aber nur in einem von 32 Fällen, und in den anderen 31 ist fast noch
alles übrig. Die halbierende Frage dagegen liefert immer genau ein Bit, wie die
Antwort auch ausfällt. Eine seltene Antwort sagt viel, eine erwartete wenig,
und weil du dir nicht aussuchen kannst, welche du bekommst, zählt der
Durchschnitt:

| Frage | Chance auf Ja | Ja ist wert | Nein ist wert | Im Mittel |
|---|---|---|---|---|
| „Ist sie rot?“ | 1/2 | 1 Bit | 1 Bit | 1 Bit |
| „Ist es das Pik-Ass?“ | 1/32 | 5 Bit | 0,05 Bit | 0,2 Bit |

Allgemein trägt jede mögliche Antwort bei, wie wahrscheinlich sie ist, mal das,
was sie wert wäre, und über alle Antworten zusammengezählt ist das der
**Erwartungswert** einer Frage:

    E = Σ pᵢ · log₂(1 / pᵢ)

Dabei ist pᵢ die Wahrscheinlichkeit einer Antwort und log₂(1 / pᵢ) das, was
diese Antwort in Bit wert ist: Je unwahrscheinlicher sie ist, desto mehr trägt
sie. Für eine Ja-Nein-Frage sind das zwei Summanden, und die Funktion
`worth()` setzt die Zahlen ein:

```python
import math

def worth(p_yes):
    p_no = 1 - p_yes
    return p_yes * math.log2(1 / p_yes) + p_no * math.log2(1 / p_no)

print(round(worth(1 / 2), 2))
print(round(worth(1 / 32), 2))
```

Von Hand gerechnet ergibt die halbierende Frage ½ · 1 + ½ · 1 = 1 Bit und die
Frage nach dem Pik-Ass 1/32 · 5 + 31/32 · 0,05 ≈ 0,16 + 0,05 ≈ 0,2 Bit. Ein
ganzes Bit bekommt nur die Frage, die das Feld wirklich in zwei Hälften
teilt, und deshalb gewinnt das Halbieren im Durchschnitt: Es holt aus jeder
Antwort den größten sicheren Gewinn, und die schiefe Frage lohnt sich erst ganz
am Ende, wenn nur noch zwei Möglichkeiten übrig sind. Die zweite Zeile zeigt
außerdem, dass eine Frage, deren Ausgang fast sicher ist, kaum Information
trägt, wie lang ihre Antwort auch sein mag, und genau auf dieser Beobachtung
beruht die Kompression.

## Ein Bit und zwei Formeln

Allgemein gesagt ist ein Bit die Informationsmenge einer Entscheidung zwischen
zwei gleich wahrscheinlichen Möglichkeiten. Ein Lichtschalter hält ein Bit, und
dafür braucht er keinen Rechner. Damit lassen sich beide Größen aufschreiben.
Die **Unsicherheit** von *N* gleich wahrscheinlichen Möglichkeiten beträgt

    H = log₂(N) Bit

und misst, wie viele Halbierungen noch fehlen. **Information** ist eine
Differenz, die Unsicherheit vorher minus die Unsicherheit nachher,

    I = H₁ − H₂

und misst, was eine Antwort tatsächlich beseitigt hat. 32 Karten bedeuten eine
Unsicherheit von 5 Bit, und jede halbierende Frage beseitigt 1 Bit; die 32 ist
der Raum der Möglichkeiten, die Unsicherheit dagegen die 5. Python berechnet
den Logarithmus mit `math.log2()`:

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

## Was ein größeres Alphabet bringt

Dasselbe Werkzeug sagt dir, was ein Symbol wert ist. Jedes Symbol aus einem
Alphabet von *N* gleich wahrscheinlichen Farben trägt log₂(N) Bit, zwei Farben
tragen also ein Bit je Symbol, vier tragen zwei, acht tragen drei und sechzehn
tragen vier. Weil dieselbe Datei dann weniger Symbole braucht, ist sie früher
durch:

![Eine Tabelle mit vier Zeilen für 2, 4, 8 und 16 Farben. Die zweite Spalte nennt die Bit je Symbol als log₂(2) = 1 bis log₂(16) = 4. Die dritte Spalte zeigt die Zeit für dieselbe Datei als Balken: 100 % bei zwei Farben, 50 % bei vier, 33 % bei acht und 25 % bei sechzehn.](figure:alphabet-bits "Dieselbe Datei bei gleicher Symbolrate: Nur das Alphabet ändert sich, und mit ihm die Zeit, die die Datei braucht.")

Mit vier Farben braucht die Datei die Hälfte der Zeit, die sie mit zwei
braucht, mit acht ein Drittel und mit sechzehn ein Viertel, während die Datei
und die Symbolrate gleich bleiben.

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
verkürzt: Was oft vorkommt, soll wenig kosten, und nach demselben Grundsatz
verkleinern Kompressionsverfahren bis heute Dateien. Ein seltenes Symbol trägt mehr
Information als ein häufiges, also darf es auch mehr Platz einnehmen. Codes
mit ungleich langen Codewörtern haben allerdings ihren eigenen Preis, denn der
Empfänger muss herausfinden, wo ein Codewort endet; der Morsecode verwendet
dafür Pausen, und ein präfixfreier Code kommt ohne sie aus.

## Dein Alphabet

Warum dann nicht gleich 256 Farben? Mehr Farben bringen mehr Bit je Symbol,
dieselbe Datei braucht also weniger Symbole und kommt früher an, aber die
Farben rücken auch enger zusammen, das Rauschen reicht über die Lücke, und
Symbole werden falsch gelesen, wie [[analog-and-digital]] und
[[signal-and-noise]] zeigen. Wo die Grenze liegt, verrät keine Formel, und
deshalb ist die Größe deines Alphabets keine Frage des Geschmacks, sondern das
Ergebnis einer Messung. Genau danach fragt [[lifi-challenge-1]], und vier
Schritte führen zur Antwort:

1. das Alphabet vereinbaren und aufschreiben
2. für jedes Symbol ein Profil messen
3. dem Empfänger beibringen, jedes Symbol zu erkennen
4. 20 zufällige Symbole senden und die Fehler zählen

Der erste Schritt ist der, den alle überspringen wollen, und wer die
Vereinbarung nur im Kopf hat, baut den Unsinn aus dem ersten Teil nach, sobald
zwei Leute parallel arbeiten. Licht bedeutet nichts, bis ihr vereinbart, was es
bedeutet, und wie viel es bedeutet, könnt ihr zählen.

## Zum Mitnehmen

- Ein Symbol ist ein vereinbarter, unterscheidbarer Zustand: Die Physik
  entscheidet, ob er sich unterscheiden lässt, und nur eine Vereinbarung, was
  er bedeutet.
- Die Vereinbarung, etwa ein Wörterbuch aus Farben und Buchstaben, muss vorher
  auf beiden Seiten liegen; weicht sie ab, ergibt perfekter Empfang perfekten
  Unsinn.
- Eine Frage, die das Feld halbiert, ist ein Bit wert; eine schiefe Frage ist
  im Mittel viel weniger wert, auch wenn sie alles auf einmal klären könnte.
- Bei *N* gleich wahrscheinlichen Möglichkeiten beträgt die Unsicherheit
  H = log₂(N) Bit, und die Information einer Antwort ist I = H₁ − H₂.
- Ein Symbol aus *N* gleich wahrscheinlichen Symbolen trägt log₂(N) Bit,
  größere Alphabete sind also schneller, und zwei Symbole in Gruppen genügen
  für jede Nachricht.
- Häufige Symbole verdienen kurze Codes, deshalb gibt der Morsecode dem e einen
  einzelnen Punkt.
- Mehr Farben rücken enger zusammen, deshalb legt nur eine Messreihe die Größe
  des eigenen Alphabets fest.

## Zum Weiterlesen

Claude E. Shannon: „A Mathematical Theory of Communication“. *Bell System
Technical Journal* 27, 1948. Der Aufsatz, aus dem das Bit, die Unsicherheit
als Logarithmus und die Grenze jeder Kompression stammen; die ersten Seiten
kommen mit wenig Mathematik aus, und wie es dazu kam, erzählt
[[claude-shannon]].

James Gleick: *The Information: A History, a Theory, a Flood*. Pantheon, 2011.
Eine Geschichte der Information von den Trommelsprachen Afrikas über den
Telegrafen bis zu Shannon, gut lesbar und ohne Formeln.
