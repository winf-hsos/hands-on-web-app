---
type: lesson
code: 4256
formerly: [analytic-questions]
title: Explorative Datenanalyse
summary: >-
  Wo das Erkunden in einer Datenanalyse steht, welche sechs Arten von Fragen
  man an Daten stellen kann und warum ein Muster, das beim Erkunden auffällt,
  eine Frage für die nächste Untersuchung ist und noch keine Antwort.
objectives:
  intro: "In dieser Lektion lernst du, was explorative Datenanalyse leistet und wo sie endet, und kannst danach:"
  goals:
    - "das Erkunden im Ablauf einer Datenanalyse verorten und als Kreislauf aus Transformieren, Visualisieren und Modellieren beschreiben"
    - "deskriptive, explorative, inferentielle, prädiktive, kausale und mechanistische Fragen unterscheiden und mit den sechs Ja-Nein-Fragen nach Leek und Peng bestimmen, welchen Typ eine Frage hat"
    - "jedem Typ eine passende Frage an die Umfrage zu Milch und Schokolade zuordnen und begründen, was du je nach Typ am Ende behaupten darfst"
    - "erkennen, wenn ein explorativer Befund stillschweigend als inferentielles oder kausales Ergebnis berichtet wird"
    - "fehlende und ungewöhnliche Werte beim Erkunden finden und erklären, warum der Median sie besser verträgt als der Mittelwert"
level: 1
duration: 55
topics: [exploring-data, questions-and-measurement]
modules: [ea, wmg, pmg]
areas: [ds]
relations:
  see_also: [the-effect, milk-chocolate-survey, milk-survey-compact]
status: published
updated: 2026-11-09
---

![Folien: Explorative Datenanalyse](item:exploratory-data-analysis-slides)

Wer einen neuen Datensatz bekommt, weiß noch nicht, was darin steckt. Die
explorative Datenanalyse ist der erste Blick hinein: Man sieht sich an,
welche Werte vorkommen, welche Spalten zusammenhängen und was nicht ins Bild
passt, und jede Grafik wirft die nächste Frage auf. Was dabei herauskommt,
ist eine bessere Kenntnis der Daten und eine Liste guter Fragen, aber noch
keine Antworten. Wie weit eine Antwort reichen darf, hängt von der Art der
Frage ab, und dafür haben Jeffery Leek und Roger Peng eine einfache Ordnung
vorgeschlagen, die du in ihrem zweiseitigen Beitrag nachlesen kannst:

![Das Paper zur Lektion](item:leek-peng-what-is-the-question)

## Wo das Erkunden steht

Nach *R for Data Science* beginnt jede Datenanalyse damit, die Daten zu laden
und in eine aufgeräumte Form zu bringen, und sie endet damit, dass man
mitteilt, was man verstanden hat. Dazwischen liegt das Erkunden, und es ist
kein einzelner Schritt, sondern ein Kreislauf: Man transformiert die Daten,
visualisiert sie, passt vielleicht ein einfaches Modell an, und jedes
Ergebnis schickt einen mit einer neuen Idee wieder zum Anfang. Das
Programmieren hält alles zusammen, damit sich jeder Schritt wiederholen
lässt.

Für den Anfang helfen zwei Fragen, die fast jede Erkundung trägt. Welche
**Variation** gibt es innerhalb einer Variable, welche Werte kommen also vor,
welche häufig und welche selten? Und welche **Kovariation** gibt es zwischen
Variablen, ändern sich also zwei Spalten gemeinsam? Für die erste ist das
Histogramm das Werkzeug, für die zweite je nach Art der Spalten das
Streudiagramm, der Boxplot oder ein Balkendiagramm mit Anteilen.

## Sechs Ja-Nein-Fragen

Bevor man Schlüsse zieht, sollte man wissen, welche Art von Frage man stellt.
Davon hängt ab, welche Methode passt, welche Daten man braucht und vor allem,
was man am Ende behaupten darf. Leek und Peng unterscheiden sechs Typen, und
man findet den passenden, indem man oben beginnt und so lange weitergeht,
bis eine Antwort zu einem Typ führt:

1. **Fasst du die Daten zusammen?** Wenn nicht, ist es noch keine
   Datenanalyse, etwa wenn man nur einzelne Zeilen zeigt.
2. **Berichtest du die Zusammenfassung, ohne sie zu deuten?** Dann ist die
   Frage *deskriptiv*.
3. **Prüfst du, ob deine Entdeckungen auch in einer neuen Stichprobe gelten
   würden?** Wenn nicht, ist sie *explorativ*.
4. **Willst du wissen, wie sich eine Größe verändert, wenn man den
   Durchschnitt einer anderen verändert?** Wenn ja, geht es bei Frage 6
   weiter, sonst bei Frage 5.
5. **Willst du Werte für einzelne Personen oder Dinge vorhersagen?** Dann
   ist die Frage *prädiktiv*, sonst *inferentiell*.
6. **Suchst du einen Effekt, der im Durchschnitt auftritt, oder einen, der
   in jedem Einzelfall genau so eintritt?** Im Durchschnitt ist die Frage
   *kausal*, in jedem Einzelfall *mechanistisch*.

## Die sechs Typen am Beispiel

Die Beispiele stammen aus der [[milk-chocolate-survey|Umfrage zu Milch und Schokolade]].

| Typ | Vorgehen | Beispiel |
|---|---|---|
| deskriptiv | zählen und zusammenfassen, ohne zu deuten | Wie viele der Befragten trinken täglich Milch? |
| explorativ | Muster suchen, die neue Fragen aufwerfen | Kaufen Jüngere häufiger Hafermilch als Ältere? |
| inferentiell | prüfen, ob ein Muster mehr ist als Zufall | Ist das ein echtes Muster oder Zufall? |
| prädiktiv | für Einzelne vorhersagen, oft mit maschinellem Lernen | Lässt sich aus Alter, Ernährung und Einkaufsort vorhersagen, ob jemand Hafermilch kauft? |
| kausal | herausfinden, was sich im Durchschnitt ändert, wenn man eine Größe verändert, am sichersten mit einem Experiment | Sinkt die Kaufbereitschaft für alpro, wenn der Preis um zehn Cent steigt? |
| mechanistisch | verstehen, wie eine Ursache in jedem Einzelfall genau wirkt | Wie viel Energie braucht ein Liter Milch, um von 4 auf 60 Grad warm zu werden? |

Inferentiell heißt nicht, dass man dafür andere Daten bräuchte. Ein
Signifikanztest auf genau diesen Daten prüft, ob ein Unterschied dieser
Größe in einer Stichprobe dieser Größe auch durch Zufall entstanden sein
könnte. Ist das unwahrscheinlich, nennt man ihn signifikant: Er ist
systematisch und nicht zufällig. Ob er auch für ganz Deutschland gilt, ist eine
eigene Frage, denn sie hängt davon ab, wie gut die Stichprobe Deutschland
abbildet.

Die kausale Frage lässt sich mit dieser Umfrage tatsächlich beantworten, weil
der Preis für alpro darin ein Experiment war. Im Regal standen Weihenstephan
für 1,79 Euro und Gut & Günstig für 1,09 Euro, und alpro kostete je nach
Zufall 1,69, 1,79, 1,89 oder 2,09 Euro. Für jede der drei Milchsorten sagten
die Befragten, wie sicher sie sie kaufen würden, von −4 für „sicher nicht“
bis +4 für „sicher“. Weil der Zufall entschied, wer welchen Preis sah,
unterscheiden sich die Gruppen nur im Preis, und ein Unterschied in der
Kaufbereitschaft geht auf ihn zurück. Die mechanistische Frage dagegen
beantwortet keine Umfrage, sondern die Physik; solche Fragen sind in der
Datenanalyse selten.

## Explorativ ist ein Anfang, kein Ergebnis

Der erste Blick in einen Datensatz ist fast immer explorativ: Verteilungen
ansehen, Gruppen vergleichen, nach Zusammenhängen suchen. Das ist genau
richtig, solange man das Ergebnis auch so nennt. Ein Muster, das beim
Erkunden auffällt, ist eine gute Frage für die nächste Untersuchung, aber
noch keine Antwort.

Der häufigste Fehler ist, eine Stufe zu überspringen. Wer in einer Umfrage
mit 606 Spalten lange genug sucht, findet immer irgendeinen Zusammenhang,
auch wenn er nur zufällig in diesen 2.811 Menschen steckt: Mischt man jede
Spalte für sich zufällig durch, sodass keine mehr etwas mit einer anderen zu
tun hat, bestehen immer noch rund 7.000 Paare von Spalten einen Test auf dem
Fünf-Prozent-Niveau. Berichtet man einen solchen Zusammenhang, als sei er
systematisch, ist aus einer explorativen Frage stillschweigend eine
inferentielle geworden, und liest man ihn als Ursache, sogar eine kausale.

Daraus folgt, dass die Fragen vor die Erhebung gehören. Schreibt man vorher
auf, was man wissen will und was man nach der Theorie erwartet, prüft man eine
Hypothese ein einziges Mal; sucht man erst hinterher in den Daten, gibt man
dem Zufall Tausende Gelegenheiten. Erkunden bleibt wertvoll, aber was es
findet, ist eine Frage für die nächste Erhebung.

## Was beim Erkunden der Umfrage auffällt

Die Folien erkunden die Umfrage zu Milch und Schokolade, und drei Befunde
lassen sich auf fast jeden Datensatz übertragen:

- **Fehlend heißt meist „nicht gefragt“.** Fast die Hälfte aller Zellen ist
  leer, weil viele Fragen nur an einen Teil der Befragten gingen. Entfernt
  man alle Zeilen mit einer Lücke, bleibt niemand übrig, und entfernt man sie
  für eine Frage, spricht man über eine andere Gruppe, als man denkt.
- **Ein seltsamer Wert kann eine ganze Verteilung verdecken.** Bei der Frage,
  ab welchem Preis ein Liter Milch zu teuer ist, liegen 16 Antworten über 20
  Euro, bis hin zu 999. Ein Histogramm aller Antworten zeigt dann nur einen
  einzigen Balken, und erst der Blick auf die Extremwerte zeigt, was los ist.
- **Der Median verträgt Ausreißer, der Mittelwert nicht.** Mit allen
  Antworten liegt der Mittelwert bei 8,11 Euro, ohne die 16 Extremwerte bei
  2,17 Euro, während der Median in beiden Fällen 1,99 Euro beträgt. Setzt man
  unplausible Werte auf `NA`, statt die ganze Zeile zu entfernen, bleibt
  alles andere erhalten, was die Person gesagt hat; welche Schwelle man dafür
  wählt, gehört in den Bericht.

## Zum Mitnehmen

- Erkunden ist ein Kreislauf aus Transformieren, Visualisieren und
  Modellieren, der mit zwei Fragen beginnt: Wie variiert eine Variable, und
  wie variieren zwei gemeinsam?
- Sechs Typen von Fragen: deskriptiv, explorativ, inferentiell, prädiktiv,
  kausal und mechanistisch. Entscheidend ist, ob ein Muster mehr sein soll
  als Zufall und ob man nach einer Ursache fragt.
- Inferentiell heißt, mit einem Test auf diesen Daten zu prüfen, ob ein
  Muster mehr ist als Zufall; kausal verlangt am sichersten ein Experiment.
- Fragen und Erwartungen aus der Theorie gehören vor die Erhebung; ein
  explorativer Befund ist der Anfang einer Untersuchung, nicht ihr Ergebnis.
