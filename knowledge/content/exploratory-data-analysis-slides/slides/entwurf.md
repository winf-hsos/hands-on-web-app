# Entwurf: Input „exploratory data analysis“

**Status:** freigegeben am 2026-11-02 und gebaut; das Deck ist jetzt die
Quelle, dieser Entwurf bleibt als Herleitung liegen. Beim Bau geändert: eine
neue Folie „readable names“ zeigt `rename()` und `factor()`, also 29 statt 27
Folien; die Folie „search long enough“ zeigt statt der stärksten
sachfremden Korrelation einen Mischversuch (jede Spalte für sich gemischt,
rund 7.000 von etwa 144.000 prüfbaren Paaren bestehen trotzdem einen Test
auf 5 %), weil die stärksten echten Korrelationen alle inhaltlich
zusammenhängen; der Blick auf den Preis ist eine Überblendung zweier
R-Abbildungen statt eines Zooms in einer; die Hafermilch-Frage misst, wer
Hafermilch überhaupt kaufen würde (nur 234 Befragte); die Liste der
Extremwerte reicht von 65 bis 999; Tabelle und Abfragen sind leicht
umformuliert. Die Vermutungen zu Bio, Ernährung und Hafermilch haben die
Daten bestätigt: Veganer sind die kleinste und auffälligste Gruppe, und die
Offenheit für Hafermilch fällt mit dem Alter von 68 % auf 38 %.

**Verortung:** Folien-Inhalt auf Hands-on Data Science
(`knowledge/content/exploratory-data-analysis-slides/`), Titel „Explorative
Datenanalyse“ / „Exploratory data analysis“, als wiederkehrender Input von 45
Minuten in EA (Kurs „Explorative Datenanalyse“), passend auch für WMG und
PMG. Er steht im Kurs vor den Lernpfaden zu R und neben der Lektion
„Welche Frage stellst du an die Daten?“ (`analytic-questions`) und dem
Beitrag von Leek und Peng (`leek-peng-what-is-the-question`). Kein Datum,
kein Verweis auf andere Sitzungen.

**Kernbotschaft:** `exploring finds questions worth asking, it does not
answer them.`

**Publikum:** Masterstudierende, die Daten auswerten sollen, mit wenig oder
ohne R; der Satz zeigt Code, verlangt aber nicht, ihn schon zu können.

**Quellen:**
- der Abschnitt „Analytic Questions“ der Google-Folien „Exploratory Data
  Analysis with R and Python“ (Folien 8 bis 22: das Flussdiagramm nach Leek
  und Peng, Frage für Frage aufgebaut) und der Abschnitt „Exploratory Data
  Analysis“ (Folien 23 bis 35: der Ablauf load, tidy, explore, communicate
  nach R for Data Science),
- Jeffery T. Leek, Roger D. Peng: *What is the question?* Science 347
  (6228), 1314–1315, 2015, mit seiner Abbildung, dem Entscheidungsbaum zu
  den sechs Typen von Datenanalysen; auf den Folien neu gezeichnet und als
  „after Leek & Peng (2015)“ ausgewiesen, nicht als Bild übernommen,
- *R for Data Science*, 2. Auflage, Kapitel „Exploratory data analysis“
  (Fragen erzeugen, Antworten suchen, Fragen schärfen; Variation und
  Kovariation; ungewöhnliche Werte lieber zu `NA` machen als Zeilen
  löschen) und die Abbildung zum Ablauf einer Datenanalyse aus der
  Einleitung,
- die Lektion `analytic-questions` mit ihren Beispielfragen zur Umfrage.

**Daten:** die Umfrage zu Milch und Schokolade (`milk-chocolate-survey`,
2.811 Befragte, 606 Spalten). Auf den Folien heißen die Spalten englisch wie
im Auszug `survey` (`age`, `diet`, `organic_share`, `price_too_expensive`
usw.); die Zahlen kommen aus der ganzen Umfrage. Zwei Befunde, die ich
beim Durchsehen gefunden habe und die den Teil 3 tragen:
- Die Frage, ab welchem Preis ein Liter Milch zu teuer ist, beantworteten
  612 Personen. Der Median liegt bei 1,99 €, der höchste Wert bei 999, und 16
  Antworten liegen über 20 €; im Auszug `survey` ist es eine einzelne 160.
  Das sind Tippfehler, Cent statt Euro, oder 999 als „weiß nicht“.
- Rund die Hälfte aller Zellen ist leer, weil viele Fragen nur einem Teil
  gestellt wurden; fehlend heißt hier meistens „nicht gefragt“.

Nachgerechnet sind bisher nur diese beiden Befunde und die Altersverteilung.
Was die Folien 23, 24 und 26 über Bio, Ernährung und Hafermilch sagen, ist
die erwartete Richtung, nicht das Ergebnis: Ich rechne es beim Bau aus und
passe Punchlines und Karten an das an, was die Daten zeigen, auch wenn dabei
kein Unterschied herauskommt.

**Sprache:** Folien, Beispiele und Daten englisch (Kleinschreibung),
Sprechernotizen und `skript.md` englisch, wie in den beiden Nachbarsätzen.

**Design:** die `theme.css` des Satzes zur Datentransformation (Pink als
Leitfarbe). Die sechs Typen von Fragen bekommen im ganzen Satz feste
Farben; `exploratory` ist pink, weil er der Typ dieses Satzes ist, die
anderen fünf grau, bis sie an der Reihe sind.

## Zu entscheiden

1. **Das Flussdiagramm neu gezeichnet (empfohlen)**, Frage für Frage
   aufgebaut wie in den Google-Folien, statt die Abbildung aus dem Paper als
   Bild zu zeigen: Die Abbildung steht unter dem Recht von *Science*, und
   eine eigene Zeichnung lässt sich animieren und in den Farben des Satzes
   halten.
2. **Grafiken aus echtem R.** Die Abbildungen in Teil 3 (Histogramm, Boxplot,
   Balken) erzeuge ich beim Bau mit ggplot2 aus der Umfrage und setze sie als
   SVG in die Folien, mit dem Code als `figcode` dahinter, so dass er sich
   kopieren lässt. Die Alternative wäre, sie mit `draw.js` nachzuzeichnen.
3. **Drei Live-Abfragen** (Folien 11, 13 und 25) über den
   Classroom-Live-Server.
4. **Die Umfrage ist noch Entwurf.** `milk-chocolate-survey` und
   `analytic-questions` stehen noch auf `draft`; der Satz verweist auf beide.
   Er kann trotzdem online gehen, die Verweise bleiben dann Text, bis die
   beiden freigegeben sind.

## Symbole

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Vergleich |
| 💬 | Merksatz |
| ⌨️ | Code |
| 🪜 | Aufbau in Schritten |
| 🧪 | Live-Moment |
| 🕹️ | eingebetteter Demonstrator |
| 🗳️ | Live-Abfrage |
| 🎞️ | Animation |

# Die Folien

## Teil 0: Auftakt (2 Folien)

### Folie 1 🎬

**Titel:** `exploratory data analysis`
**Untertitel:** `hands-on data science · Prof. Dr. Nicolas Meseth`

Die Agenda-Folie danach füllt stagekit aus den drei Teilen: `where exploring
fits`, `what is the question?`, `exploring the survey`.

### Folie 2 📷

**Bild:** ein Holztisch bei Nacht, von schräg oben. Darauf eine halb
gezeichnete Landkarte: links Küste, Fluss und Wege mit Tinte ausgeführt,
rechts noch leeres Papier mit ein paar Bleistiftlinien und Fragezeichen. Eine
Stirnlampe liegt auf der Karte und wirft einen warmen Lichtkegel auf die
Grenze zwischen Gezeichnetem und Leerem; daneben ein Messingkompass und ein
aufgeschlagenes Notizbuch. Außerhalb des Lichts verliert sich alles im
Schwarz.

**Text:** `an explorer draws the map while walking, and every blank spot on
it is the next question.`

**Dazu sagen.** Explorers in the past did not know what they would find;
they walked, drew what they saw and marked what they did not understand yet.
Exploring data works the same way: you start without knowing what is in the
table, you draw a first picture, and the picture tells you where to look
next. What you bring home is a better map and a list of good questions, not
yet the answers.

## Teil 1: where exploring fits (4 Folien)

### Folie 3 🎬 where exploring fits

Abschnittsfolie mit Untertitel `the workflow of a data analysis`.

### Folie 4 🎞️

**Titel klein:** `the workflow of a data analysis`
**Zeichnung:** nach R for Data Science, wie in den Google-Folien Schritt für
Schritt aufgebaut: `load` → `tidy` → ein Kreis aus `transform`,
`visualise`, `model` mit der Überschrift `explore` → `communicate`, das Ganze
in einem Rahmen `program`.
**Animation:** schrittweise, vier Abschnitte.
1. `load` und `tidy` erscheinen nacheinander mit ihrem Pfeil.
2. Der Kreis `transform` → `visualise` → `model` → zurück zu `transform`
   zeichnet sich, ein Punkt läuft einmal herum; danach steht der Kreis mit
   der Beschriftung `explore`, pink.
3. `communicate` erscheint rechts.
4. Der Rahmen `program` legt sich um alles.
**Punchline:** `exploring sits in the middle, and it is a loop, not a
step.`
**Fußnote:** `after Wickham, Çetinkaya-Rundel & Grolemund: R for Data
Science, 2nd ed.`

**Dazu sagen.** Every analysis loads data and brings it into a tidy shape;
that is preparation. Understanding happens in the loop: you transform the
data, look at it in a picture, perhaps fit a simple model, and every picture
sends you back with a new idea. Only at the end do you communicate, and
programming holds it all together so that every step can be repeated.

### Folie 5 💬

**Merksatz:** `exploratory data analysis is a state of mind, not a fixed
procedure.`
**Sidenote:** `R for Data Science: generate questions, search for answers by
transforming and visualising, use what you learn to refine the questions.`

**Dazu sagen.** There is no checklist that makes an exploration complete.
What R for Data Science describes is a cycle of three moves, and the quality
of an exploration depends on the questions you bring into it.

### Folie 6 🖼️

**Titel klein:** `two kinds of questions`
**Zeichnung:** links eine einzelne Spalte als Histogramm mit der Frage
`what variation occurs within one variable?`, rechts zwei Spalten als
Punktwolke mit der Frage `what covariation occurs between variables?`.
**Punchline:** `almost every exploratory question asks how values vary, or
how two variables vary together.`

**Dazu sagen.** These two questions from R for Data Science are a good
starting point when you face a new table and do not know where to begin.
Part 3 asks both of the milk survey.

## Teil 2: what is the question? (9 Folien)

### Folie 7 🎬 what is the question?

Abschnittsfolie mit Untertitel `six types of data analysis`.

### Folie 8 🖼️

**Titel klein:** `the wrong question, answered correctly`
**Text:** `many analyses that are criticised later did not compute anything
wrong, they answered a different question than the one people read into
them.`
**Fußnote:** `Leek & Peng (2015): What is the question? Science 347,
1314–1315` als Link auf die DOI.

**Dazu sagen.** This is the observation behind a two-page paper by Jeffery
Leek and Roger Peng. A pattern found while exploring is reported as if it
held for everyone, or a good prediction is read as an explanation. To avoid
it, they suggest deciding which type of question you are asking before you
start.

### Folie 9 🎞️ 🪜

**Titel klein:** `six yes-or-no questions`
**Zeichnung:** das Flussdiagramm nach Leek und Peng, neu gezeichnet, von
oben nach unten: sechs Fragen als Kästen, `yes` und `no` an den Pfeilen,
die sechs Typen als farbige Endpunkte, dazu `not a data analysis` grau.
**Animation:** schrittweise, sieben Abschnitte, wie in den Google-Folien
(dort Folien 9 bis 22); jeder Abschnitt zeichnet eine Frage und ihre
Ausgänge.
1. `did you summarise the data?` → no: `not a data analysis`.
2. `did you report the summaries without interpretation?` → yes:
   `descriptive`.
3. `did you quantify whether your discoveries are likely to hold in a new
   sample?` → no: `exploratory` (pink).
4. `are you trying to figure out how changing the average of one measurement
   affects another?` → no führt zu Frage 5, yes zu Frage 6.
5. `are you trying to predict measurement(s) for individuals?` → yes:
   `predictive`, no: `inferential`.
6. `is the effect you are looking for an average effect or a deterministic
   effect?` → average: `causal`, deterministic: `mechanistic`.
7. Unter drei Endpunkten erscheint klein, womit man sie typischerweise
   beantwortet: `machine learning` (predictive), `experimentation`,
   `causal inference` (causal).
**Fußnote:** `after Leek & Peng (2015), Science 347, 1314–1315`

**Dazu sagen.** You start at the top and answer until you reach a type. The
two questions that matter most are whether you want to say something beyond
the sample at hand and whether you are asking for a cause. The tree is
strict on purpose: it names what you are entitled to claim at the end.

### Folie 10 📊

**Titel klein:** `six types, asked of one survey`
**Zeichnung:** Tabelle mit drei Spalten, die Typen in ihren Farben:

| type | what you do | a question for the milk survey |
|---|---|---|
| descriptive | count and summarise | how many respondents drink milk every day? |
| exploratory | look for patterns | do younger people buy oat milk more often? |
| inferential | check if it holds beyond the sample | does that hold for everyone who shops in Germany? |
| predictive | predict for individuals | can age, diet and shop predict who buys oat milk? |
| causal | change one thing, watch another | do fewer people buy alpro if it costs ten cents more? |
| mechanistic | understand each single case | how much energy heats a litre of milk from 4 to 60 °C? |

**Dazu sagen.** The examples are those of the lesson on analytic questions.
The causal question can actually be answered with this survey, because the
alpro price was an experiment: chance decided who saw which price. The
mechanistic one cannot be answered by any survey; it belongs to physics.

### Folie 11 🗳️

**Abfrage:** `"how many respondents buy organic food at least weekly?",
which type of question is this?`
Antworten: `descriptive` (richtig), `exploratory`, `inferential`,
`causal`.

### Folie 12 🎞️

**Titel klein:** `the step people skip`
**Zeichnung:** ein Ausschnitt des Baums mit `exploratory`, `inferential` und
`causal`; darunter ein Satz in einer Sprechblase: `in our survey, younger
people buy more oat milk.`
**Animation:** schrittweise, zwei Abschnitte.
1. Der Satz wird zu `young people prefer oat milk.`; im Baum springt die
   Markierung von `exploratory` auf `inferential`, ein rotes Ausrufezeichen
   am übersprungenen Kasten.
2. Der Satz wird zu `being young makes people buy oat milk.`; die Markierung
   springt auf `causal`.
**Punchline:** `the data stay the same, only the claim grows, and with it
what you would have to show.`

**Dazu sagen.** The most common mistake is not a wrong calculation but a
silent promotion: an exploratory finding about these 2,811 people is
reported as a fact about everyone, or even as a cause. Nothing in the data
changed between the three sentences; only the claim did.

### Folie 13 🗳️

**Abfrage:** `"in our survey, vegetarians buy more organic food, so
vegetarians in Germany buy more organic food." which type of claim is the
second half?`
Antworten: `descriptive`, `exploratory`, `inferential` (richtig), `causal`.

### Folie 14 🖼️

**Titel klein:** `search long enough, and you will find something`
**Zeichnung:** ein Raster aus 606 kleinen grauen Punkten, einer je Spalte
der Umfrage; einige Paare sind durch dünne Linien verbunden, eine davon
pink hervorgehoben mit ihrem Korrelationswert daneben (beim Bau aus der
Umfrage gerechnet: das stärkste Paar zweier Spalten, die inhaltlich nichts
miteinander zu tun haben).
**Punchline:** `with 606 columns some pattern always appears, even if it
lives only in these 2,811 people.`

**Dazu sagen.** With 606 columns there are more than 180,000 pairs of
variables, and some of them will look related by chance alone. That is no
reason not to explore; it is the reason why an exploratory finding is a
question for the next study and not its result.

### Folie 15 💬

**Merksatz:** `exploring finds questions worth asking, it does not answer
them.`

## Teil 3: exploring the survey (12 Folien)

### Folie 16 🎬 exploring the survey

Abschnittsfolie mit Untertitel `variation, covariation, the unexpected`.

### Folie 17 ⌨️

**Titel klein:** `a first look`
**Code:**
```r
library(tidyverse)
survey <- read_csv("mds12_schoko_milch.csv")
dim(survey)
glimpse(survey)
```
**Ausgabe:** `2811 606` und die ersten Zeilen von `glimpse()`.
**Sidenote:** `before any question: how many rows, how many columns, which
types, and what one row stands for.`

**Dazu sagen.** One row is one person who shops for a household, one column
is one answer or a value derived from answers. That sentence is worth
writing down before anything else, because every later question depends on
it.

### Folie 18 🖼️

**Titel klein:** `half of the table is empty`
**Zeichnung:** die Tabelle als Raster von 2.811 × 606 winzigen Zellen,
gefüllte hell, leere dunkel; deutlich sichtbar breite dunkle Blöcke, die den
Teilstudien Schokolade und Milch entsprechen.
**Punchline:** `in a survey, missing usually means "not asked", and dropping
those rows changes who you are talking about.`

**Dazu sagen.** About half of all cells are empty, and almost none of them
because someone refused to answer. The chocolate questions went to 275
people, the milk questions to about 230. Remove every row with a missing
value, and nobody is left; remove them for one question, and you are
talking about a different group than you think.

### Folie 19 🖼️

**Titel klein:** `variation: how old are the respondents?`
**Zeichnung:** Histogramm von `age`, 2.811 Personen, Klassenbreite fünf
Jahre, aus R erzeugt.
**Code** als `figcode`: `ggplot(survey, aes(x = age)) + geom_histogram(binwidth = 5)`
**Punchline:** `ages from 18 to 80 with the middle around 50: a quota sample,
not a random one.`

**Dazu sagen.** The histogram is the first tool for variation: what values
occur, which are common, which are rare. The shape here is no accident; the
panel provider filled quotas for age, gender and federal state. That matters
for every later claim beyond the sample.

### Folie 20 🎞️

**Titel klein:** `unusual values: when is milk too expensive?`
**Zeichnung:** das Histogramm von `price_too_expensive` (612 Antworten), aus R
erzeugt: ein einziger hoher Balken ganz links, die x-Achse reicht bis 999.
**Animation:** schrittweise, zwei Abschnitte.
1. Die Achse zoomt auf 0 bis 5 €; jetzt zeigt sich die eigentliche
   Verteilung um 1,99 €.
2. Rechts erscheint eine kleine Liste der 16 Werte über 20 €, darunter
   `160`, `199`, `999`.
**Punchline:** `one strange value can hide a whole distribution, so look at
the extremes before you look at the average.`

**Dazu sagen.** The first picture is useless: a single bar, because a few
answers of 999 stretch the axis. Zoom in, and the real picture appears.
Then look at the extreme values themselves. A 160 is almost certainly 1.60
typed without the point, and 999 is a common code for "don't know".

### Folie 21 ⌨️

**Titel klein:** `deal with them, and say so`
**Code:**
```r
survey |>
  mutate(price_too_expensive = if_else(
    price_too_expensive > 20, NA, price_too_expensive
  ))
```
**Sidenote:** `R for Data Science: turn unusual values into NA rather than
dropping the rows, and report what you did.`

**Dazu sagen.** Dropping the whole row would also drop everything else the
person said. Setting only this one answer to missing keeps the rest. Which
threshold is right is a judgement, and that is why it belongs in the report,
not hidden in the code.

### Folie 22 📊

**Titel klein:** `mean or median?`
**Zeichnung:** zwei Zahlen nebeneinander, vor und nach der Bereinigung:
Mittelwert und Median von `price_too_expensive`; der Mittelwert springt, der
Median bleibt bei 1,99 €. Die genauen Werte rechne ich beim Bau aus.
**Punchline:** `the median barely notices a typing error, the mean is
dragged along by it.`

### Folie 23 🖼️

**Titel klein:** `covariation: organic food and diet`
**Zeichnung:** Boxplots von `organic_share` (1 bis 5) je `diet`, aus R
erzeugt, die Gruppengröße unter jeder Box.
**Code** als `figcode`: `ggplot(survey, aes(x = diet, y = organic_share)) + geom_boxplot()`
**Punchline:** `the groups differ, and the smallest group differs most, which
is exactly where chance plays the biggest part.`

**Dazu sagen.** A categorical and a numerical variable: the boxplot is the
standard picture. Read the group sizes before the boxes; a striking box
built on a handful of people is a reason for a closer look, not for a
headline.

### Folie 24 🖼️

**Titel klein:** `covariation: oat milk and age`
**Zeichnung:** gestapelte Anteile: in jeder Altersgruppe der Anteil derer,
die Hafermilch kaufen, aus der Teilstudie Milch (rund 230 Personen), aus R
erzeugt.
**Punchline:** `a pattern in about 230 people is a question for the next
study, not yet an answer.`

**Dazu sagen.** This is the exploratory question from the table in part 2.
The picture suggests an answer, but it rests on about 230 people from a
quota sample. To say something about everyone in Germany, the question
becomes inferential, and that needs different methods.

### Folie 25 🗳️

**Abfrage:** `the price for a litre of alpro was shown at random, either
lower or higher. which type of question can this answer?`
Antworten: `descriptive`, `exploratory`, `predictive`, `causal` (richtig).

### Folie 26 🖼️

**Titel klein:** `from exploring to the next question`
**Zeichnung:** drei Karten nebeneinander, jede mit einem Befund aus Teil 3
und der Frage, die er aufwirft: `younger people buy more oat milk` →
`does it hold for Germany?` (inferential); `vegetarians buy more organic
food` → `is it the diet or the income?` (causal); `16 price answers above 20
€` → `how should the questionnaire ask?` (eine Frage an das Design der
Studie).
**Punchline:** `the result of an exploration is a list of better questions.`

### Folie 27 💬

**Merksatz:** `exploring finds questions worth asking, it does not answer
them.`
**Sidenote:** `to read on: Leek & Peng (2015), "What is the question?", and
R for Data Science, chapter "Exploratory data analysis".` Beide als Links.

**Dazu sagen.** Take the map with you: draw what you see, mark what you do
not understand, and keep the question marks. Exploring is the start of every
analysis, and the honest name for its findings is "worth checking".

# Umfang

27 Folien, davon 4 Abschnitts- und Titelfolien, 1 Foto und 22 Inhaltsfolien
mit 4 Animationen (darunter der Baum mit sieben Abschnitten), 3
Live-Abfragen und 5 Grafiken aus R; mit den Aufbauschritten etwa 42 Frames.
Bei rund 1,5 Minuten je Inhaltsfolie und etwas Zeit für die Abfragen passt das
in 45 Minuten.
