# Entwurf: Input „vectors and data frames in R“

**Status:** freigegeben am 2026-11-02 mit allen vier Empfehlungen und gebaut;
das Deck ist jetzt die Quelle, dieser Entwurf bleibt als Herleitung liegen.
Beim Bau geändert: Folie 11 zeigt, was R wirklich tut (`c(1, TRUE)` ergibt
zwei Zahlen, `c(1, TRUE, "stay")` die Texte `"1"`, `"TRUE"`, `"stay"`; der
Entwurf ließ `TRUE` erst zu `1` werden); das Spiel ist nicht eingebettet,
weil die Seite keine Ansicht ohne Kopf und Fuß hat, sondern ein Link mit
QR-Code; Folie 18 legt den Faktor unter neuem Namen ab, damit `decision` für
den Data Frame Text bleibt; Folie 9 zeigt nur `typeof()`, `class()` steht in
den Notizen.

**Verortung:** Folien-Inhalt auf Hands-on Data Science
(`knowledge/content/data-representation-slides/`), Kennung und Titel
„Vektoren und Data Frames“ / „Vectors and data frames“. Er gehört zum
Lernpfad „Einstieg in R“ (Teil 2 und 3) und zum Projekt „The Monty Hall
Problem“ (Phasen `vectors` und `data-frame`), als wiederkehrender Input von
45 Minuten in EA (Kurs „Explorative Datenanalyse“). Weil der Satz
wiederkehrt, steht kein Datum auf der Titelfolie und nirgends ein Verweis auf
andere Sitzungen.

**Kernbotschaft:** `a data frame is a list of equally long vectors, and every
vector holds values of one type.`

**Publikum:** Masterstudierende ohne oder mit wenig R, die die ersten
Lektionen (Rechnen, Namen, Funktionen) kennen.

**Quellen:** der Abschnitt „Data Representation“ der Google-Folien
„Exploratory Data Analysis with R and Python“ (Folien 36 bis 121: Skalar,
Vektor, Matrix, Data Frame; Typen, Indizes, Sonderwerte, Faktoren; Zugriff
auf Data Frames; Tibbles), dazu *Hands-On Programming with R* (Grolemund),
Kapitel „R Objects“ (atomare Vektoren mit genau einem Typ, die Regel, nach der
R beim Mischen umwandelt, Data Frames als Listen gleich langer Vektoren), und
*R for Data Science*, 2. Auflage (Wickham, Çetinkaya-Rundel, Grolemund),
Kapitel „Data tidying“ (Variable, Beobachtung, Wert), „Logical vectors“,
„Factors“ und „Missing values“. Die Folien nennen die beiden Bücher auf der
Schlussfolie als Weiterlesen, mit Link auf die freien Online-Fassungen.

**Beispiel:** das Drei-Türen-Spiel aus dem Projekt. Teil 2 rechnet mit den
zehn Beispielrunden der Projektphase `vectors`
(`prize_door <- c(2, 1, 3, 3, 1, 2, 2, 3, 1, 1)` usw.), Teil 3 mit dem
Datensatz `lets-make-a-deal` (100 Spiele, geladen als `monty_hall`); die
Zeichnungen zeigen dessen erste sechs Zeilen. In den 100 Spielen gewinnt, wer
bleibt, 30 von 74, wer wechselt, 19 von 26; das Ergebnis selbst verrät der
Satz nicht, es gehört dem Projekt.

**Sprache:** Folien, Beispiele und Daten englisch (`language = "en"`, also
Kleinschreibung), wie der Satz zur Datentransformation. Sprechernotizen und
`skript.md` ebenfalls englisch.

**Design:** die `theme.css` des Satzes zur Datentransformation (Hands-on Data
Science, Pink als Leitfarbe), unverändert übernommen. Die Typen bekommen
feste Farben, die durch den ganzen Satz gelten: `double` Blau, `integer`
Türkis, `character` Lila, `logical` Gelb. Rot und Grün bleiben der Bewertung
vorbehalten (gewonnen, verloren).

## Zu entscheiden

1. **Matrix nur als Durchgangsstation (empfohlen).** Die Google-Folien
   zeigen Skalar, Vektor, Matrix und Data Frame als Reihe. Ich schlage vor,
   die Matrix auf der Auftaktfolie einmal zu zeigen und dann fallen zu
   lassen, weil sie in der explorativen Analyse kaum vorkommt und die
   Botschaft „Spalten mit je einem Typ“ gerade von ihr abgrenzt.
2. **Basis-R und Tibble.** Teil 3 greift mit Basis-R zu (`$`, `[ ]`), weil
   die Projekt-Challenges 3 bis 5 genau das verlangen; Filtern, Sortieren und
   neue Spalten mit dplyr bleiben dem Satz zur Datentransformation. Die
   Basis-R-Fassungen von `subset()`, `order()` und `write.csv()` aus den
   Google-Folien lasse ich weg.
3. **Zwei Live-Abfragen** (Folien 12 und 22) über den Classroom-Live-Server,
   wie im Satz zur Datentransformation.
4. **Das Drei-Türen-Spiel eingebettet** (Folie 5). Das setzt voraus, dass die
   Seite des Spiels in einem Rahmen läuft; das prüfe ich beim Bau, und ohne
   Rahmen wird es ein Link mit QR-Code.

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

**Titel:** `vectors and data frames in R`
**Untertitel:** `hands-on data science · Prof. Dr. Nicolas Meseth`

Die Agenda-Folie danach füllt stagekit aus den drei Teilen: `from a value to
a table`, `vectors`, `data frames`.

### Folie 2 📷

**Bild:** ein alter Setzkasten aus dunklem Holz, leicht schräg von vorn, vor
schwarzem Grund. Die Fächer sind unterschiedlich groß, und in jeder senkrechten
Reihe liegt nur eine Sorte Dinge: in einer Reihe Bleilettern, in der nächsten
Messingschrauben, dann kleine Glasperlen, dann gefaltete Papierzettel. Warmes
Licht von oben links, der Rand des Kastens verliert sich im Schwarz.

**Text:** `a type case keeps many small things in order because every column
holds only one kind of thing.`

**Dazu sagen.** A printer's type case looks like a mess of tiny compartments,
and yet a typesetter finds every letter blind, because each column holds one
kind of thing and every compartment has its place. R keeps data in the same
way: a table is a row of columns, and each column holds values of exactly one
kind. Once you see this, most of what R does with data stops being a surprise.

## Teil 1: from a value to a table (4 Folien)

### Folie 3 🎞️

**Titel klein:** `four shapes of data`
**Zeichnung:** links ein einzelnes Kästchen mit `2`, daneben Platz für drei
weitere Formen.
**Animation:** schrittweise, drei Abschnitte, wie in den Google-Folien.
1. Aus dem Kästchen wächst nach unten eine Spalte aus zehn Kästchen
   (`2 1 3 3 1 2 2 3 1 1`), Beschriftung `vector`; der einzelne Wert heißt
   jetzt `scalar value`.
2. Daneben legt sich eine zweite und dritte Spalte gleicher Art an, alles in
   Blau, Beschriftung `matrix`: ein Block, in dem alle Zellen denselben Typ
   haben.
3. Rechts entsteht eine Tabelle aus vier Spalten in vier Farben (Zahlen,
   Zahlen, Zahlen, Text), Beschriftung `data frame`; danach stehen alle vier
   Formen nebeneinander.
**Punchline:** `in a matrix every cell has the same type, in a data frame
every column has its own.`

**Dazu sagen.** A single value is rare in data analysis; almost everything
comes as many values of the same kind, a vector. A matrix stacks vectors of
one type into a block, which suits numbers but not a table where one column
holds names and another prices. That is what the data frame is for, and it is
where we are heading.

### Folie 4 🖼️

**Titel klein:** `one game, four facts`
**Zeichnung:** drei Türen, hinter der zweiten ein Auto. Darunter vier Zeilen:
`prize_door 2`, `contestant_choice 2`, `monty_opens 1`, `decision "stay"`.
**Text:** `a game show with three doors: you pick one, the host opens another
with a goat behind it, and you stay or switch.`

**Dazu sagen.** Our example for the whole session is the Monty Hall game.
Every game can be written down as four facts: where the car was, which door
was picked first, which door the host opened and whether the player stayed
or switched. Whether staying or switching is better is the question of the
project, and the data will answer it, not us.

### Folie 5 🕹️

**Titel klein:** `play a few rounds`
**Demo:** das Drei-Türen-Spiel (`monty-hall-game`) eingebettet; unter dem
Spiel erscheint der R-Code der gespielten Runden.

**Live-Moment:** Zwei, drei Freiwillige spielen je eine Runde am Beamer, das
Publikum ruft „stay“ oder „switch“. Danach zeigt das Spiel die Runden als vier
Zeilen R-Code.

**Dazu sagen.** Look at what the game writes down after a few rounds: four
lines, one per fact, each with as many values as we played rounds. Those four
lines are already the data, and the rest of this session is about how R holds
them.

### Folie 6 ⌨️

**Titel klein:** `rounds as vectors`
**Code:**
```r
prize_door <- c(2, 1, 3, 3, 1, 2, 2, 3, 1, 1)
contestant_choice <- c(2, 3, 1, 1, 1, 1, 3, 2, 2, 1)
monty_opens <- c(1, 2, 2, 2, 3, 3, 1, 1, 3, 2)
decision <- c("stay", "switch", "stay", "switch", "switch",
              "stay", "switch", "stay", "switch", "stay")
```
**Sidenote:** `c() combines values into a vector, and the first value of each
belongs to the first round.`

## Teil 2: vectors (13 Folien)

### Folie 7 🎬 vectors

Abschnittsfolie mit Untertitel `many values of one kind`.

### Folie 8 🎞️

**Titel klein:** `the same position, the same round`
**Zeichnung:** die vier Vektoren als waagrechte Kästchenreihen untereinander,
die Positionen 1 bis 10 als graue Zahlen darüber.
**Animation:** schrittweise, zwei Abschnitte.
1. Ein gelber Rahmen läuft senkrecht über Position 1 und markiert in allen
   vier Reihen das erste Kästchen; danach steht er dort, und rechts erscheint
   `round 1: car behind 2, picked 2, host opened 1, stayed`.
2. Der Rahmen springt auf Position 8; rechts steht jetzt Runde 8.
**Punchline:** `four vectors of the same length describe ten rounds, as long
as nobody mixes up the order.`

**Dazu sagen.** Nothing in R ties the first value of `prize_door` to the
first value of `decision`; only the position does. This works as long as all
four vectors have the same length and the same order, and a data frame,
later, is the structure that guarantees exactly that.

### Folie 9 🖼️

**Titel klein:** `one vector, one type`
**Zeichnung:** vier Vektoren in den Typfarben, darunter je der Typ:
`c(2, 1, 3)` double, `c(2L, 1L, 3L)` integer, `c("stay", "switch")`
character, `c(TRUE, FALSE)` logical.
**Text:** `typeof()` und `class()` als zwei Zeilen Code.
**Punchline:** `every value in a vector has the same type, and R tells you
which one.`

**Dazu sagen.** Hands-On Programming with R calls these atomic vectors: the
smallest building block of data in R, and always of one type. There are two
more types, complex and raw, which you will hardly meet in data analysis.
Numbers you type are doubles; whole numbers from a file often arrive as
integers.

### Folie 10 ⌨️

**Titel klein:** `asking a vector`
**Code:**
```r
length(prize_door)
typeof(decision)
mean(prize_door)
table(decision)
```
**Sidenote:** `sum, mean, median, min, max, range, sd, sort, unique, table:
functions that take a whole vector at once.`

### Folie 11 🎞️

**Titel klein:** `when types meet`
**Zeichnung:** `c(1, TRUE, "stay")` als drei Kästchen in drei Typfarben.
**Animation:** schrittweise, zwei Abschnitte.
1. `TRUE` wird zu `1`, das Kästchen färbt sich blau; danach zwei blaue und
   ein lila Kästchen.
2. Beide Zahlen werden zu Text `"1"`, alle drei Kästchen lila; darunter
   `logical → double → character`.
**Punchline:** `R never mixes types in a vector, it quietly converts to the
most general one.`

**Dazu sagen.** This rule from Hands-On Programming with R explains many
surprises later: one stray text value in a column of numbers, a dash or
"n/a", and the whole column becomes text, so `mean()` no longer works. When
a column has the wrong type, look for the one value that pulled it there.

### Folie 12 🗳️

**Abfrage:** `what does typeof(c(3, 1, "2")) return?`
Antworten: `double`, `integer`, `character` (richtig), `an error`.

### Folie 13 🎞️

**Titel klein:** `comparing whole vectors`
**Zeichnung:** `prize_door` und `contestant_choice` als zwei Kästchenreihen
übereinander, darunter eine leere Reihe.
**Animation:** halbautomatisch, ein Abschnitt: Position für Position
vergleicht ein Rahmen die beiden Werte, und unten erscheint `TRUE` (gelb)
oder `FALSE`; danach steht die ganze logische Reihe da, rechts davon
`prize_door == contestant_choice`.
**Punchline:** `an operation on two vectors works position by position, with
no loop to write.`

**Dazu sagen.** This is the most useful habit of R: arithmetic and
comparisons work on whole vectors at once. The result here is a logical
vector, one answer per round to the question whether the first pick was
already right.

### Folie 14 ⌨️

**Titel klein:** `counting with TRUE and FALSE`
**Code:**
```r
first_pick_right <- prize_door == contestant_choice
sum(first_pick_right)
mean(first_pick_right)
```
**Sidenote:** `R counts TRUE as 1 and FALSE as 0, so mean() of a logical
vector is a share.`

**Dazu sagen.** R for Data Science devotes a chapter to logical vectors for
a reason: almost every question about data passes through one. Here the
share of rounds in which the first pick was already right is 0.3.

### Folie 15 ⌨️ 🪜

**Titel klein:** `picking values by position`
**Code:** Zeile für Zeile aufgebaut, das Ergebnis jeweils als Kommentar, der
neue Teil pink.
```r
decision[1]
decision[-1]
decision[2:4]
decision[c(1, 3)]
```
**Sidenote:** `square brackets select, a minus leaves out, and the result is
again a vector.`

### Folie 16 🎞️

**Titel klein:** `picking values by a condition`
**Zeichnung:** die logische Reihe `decision == "stay"` über der Reihe
`first_pick_right`.
**Animation:** schrittweise, ein Abschnitt: die Kästchen unter `FALSE`
verblassen und fallen heraus, die übrigen rücken zusammen; danach steht nur
noch die Teilmenge da, darunter `first_pick_right[decision == "stay"]`.
**Punchline:** `a logical vector in square brackets keeps exactly the
positions that are TRUE.`

**Dazu sagen.** This is how you will answer the project question: take the
wins and keep only the rounds in which the player stayed, then only those in
which the player switched, and compare the shares.

### Folie 17 🖼️

**Titel klein:** `when a value is missing`
**Zeichnung:** ein Vektor `c(2, NA, 3)`, das `NA` grau gestrichelt; darunter
`mean()` ergibt `NA`, `mean(…, na.rm = TRUE)` ergibt `2.5`. Am Rand klein die
Verwandten `NULL`, `NaN`, `Inf`.
**Punchline:** `NA means "not known", so anything computed with it is not
known either, until you say what to do.`

**Dazu sagen.** A round in which nobody wrote down the host's door is not a
door 0; it is missing, and R marks it with NA. R for Data Science treats
missing values as a topic of their own because they spread through every
calculation. `is.na()` finds them, `na.rm = TRUE` leaves them out, and the
decision which of the two is right is yours.

### Folie 18 ⌨️

**Titel klein:** `factors: text with fixed levels`
**Code:**
```r
decision <- factor(decision, levels = c("stay", "switch"))
levels(decision)
table(decision)
```
**Sidenote:** `a factor knows all its possible values and their order, even
those that do not occur.`

**Dazu sagen.** For a variable with a fixed set of values, a factor is the
better type: it rejects typos as new values, keeps an order for tables and
plots, and counts levels that do not occur. The package forcats, part of the
tidyverse, offers functions to reorder and combine levels.

### Folie 19 💬

**Merksatz:** `a vector is a row of values of one type, and position i
belongs to observation i.`

## Teil 3: data frames (9 Folien)

### Folie 20 🎬 data frames

Abschnittsfolie mit Untertitel `vectors side by side`.

### Folie 21 🎞️

**Titel klein:** `vectors become a table`
**Zeichnung:** die vier Vektoren als senkrechte Spalten in den Typfarben,
mit Abstand zueinander.
**Animation:** schrittweise, zwei Abschnitte.
1. Die Spalten rücken zusammen, über ihnen erscheinen die Namen als
   Kopfzeile, links die Zeilennummern; danach eine Tabelle mit zehn Zeilen.
2. Eine Zeile wird gelb umrandet, darunter `one row is one game`, und eine
   Spalte, darunter `one column is one vector`.
**Code darunter:** `games <- data.frame(prize_door, contestant_choice,
monty_opens, decision)`
**Punchline:** `a data frame is a list of equally long vectors, and every
vector holds values of one type.`

**Dazu sagen.** This is the central sentence of the session, and it is how
both books describe the data frame. The table guarantees what we had to
promise ourselves before: all columns have the same length, and row 8 is
round 8 in every column.

### Folie 22 🗳️

**Abfrage:** `which of these can be a column of a data frame?`
Antworten: `c(1, 2, 3)`, `c("stay", "switch", "stay")`,
`c(TRUE, FALSE, TRUE)`, `all of them` (richtig).

### Folie 23 ⌨️

**Titel klein:** `100 games from a file`
**Code:**
```r
monty_hall <- read.csv("lets_make_a_deal.csv")
str(monty_hall)
```
**Ausgabe** als zweiter Block, mit den fünf Zeilen von `str()`; die Typen
`chr` und `int` in ihren Typfarben.
**Sidenote:** `str() shows every column with its type and its first values,
and is the first thing to run on new data.`

### Folie 24 🎞️

**Titel klein:** `a vector or a table?`
**Zeichnung:** die ersten sechs Zeilen von `monty_hall`.
**Animation:** schrittweise, zwei Abschnitte.
1. `monty_hall$decision`: die Spalte löst sich heraus und legt sich waagrecht
   als Vektor hin, ohne Kopf.
2. `monty_hall["decision"]`: die Spalte löst sich mit ihrem Kopf und bleibt
   eine Tabelle mit einer Spalte.
**Punchline:** `$ takes the vector out of the table, single brackets keep a
smaller table.`

**Dazu sagen.** Both look almost the same on screen, but they are different
things: a function like `mean()` wants the vector, a function like `head()`
works on the table. When an error says something about a "list" or a
"data.frame", this is usually the reason.

### Folie 25 ⌨️ 🪜

**Titel klein:** `rows and columns`
**Code:** Zeile für Zeile, Ergebnis jeweils in einem Wort als Kommentar.
```r
monty_hall[1, ]                        # first row
monty_hall[, 2]                        # second column, as a vector
monty_hall[1:10, c("prize_door", "decision")]
nrow(monty_hall); ncol(monty_hall)
```
**Sidenote:** `[rows, columns]: an empty place means all of them.`

### Folie 26 ⌨️

**Titel klein:** `a new column from the others`
**Code:**
```r
monty_hall$won <-
  (monty_hall$decision == "stay" &
     monty_hall$prize_door == monty_hall$contestant_choice) |
  (monty_hall$decision == "switch" &
     monty_hall$prize_door != monty_hall$contestant_choice)
```
**Zeichnung daneben:** die sechs Zeilen mit der neuen Spalte `won`, `TRUE`
grün, `FALSE` rot.
**Sidenote:** `a column is a vector, so everything from part 2 works on it.`

**Dazu sagen.** Whether a game was won is not in the file, but it follows
from three columns. The rule is long, and with dplyr it becomes much
shorter; here it shows that a new column is nothing but a vector computed
from other vectors.

### Folie 27 📊

**Titel klein:** `data frame and tibble`
**Zeichnung:** links die Ausgabe von `monty_hall` als Data Frame (alle 100
Zeilen rauschen durch, abgeschnitten), rechts dieselben Daten als Tibble: zehn
Zeilen, unter jedem Spaltennamen der Typ `<chr>`, `<int>`, `<lgl>`, darüber
`# A tibble: 100 × 6`.
**Text:** `as_tibble(monty_hall)` als Codezeile.
**Punchline:** `a tibble is a data frame with better manners: it shows the
types and does not flood the console.`

**Dazu sagen.** R for Data Science works with tibbles throughout, and every
tidyverse function returns one. For everything said today a tibble behaves
like a data frame; it prints more helpfully, keeps a table a table when you
select one column with brackets, and never turns text into factors behind
your back.

### Folie 28 🖼️

**Titel klein:** `tidy data`
**Zeichnung:** nach R for Data Science, Kapitel „Data tidying“: dieselbe
Tabelle dreimal, einmal mit hervorgehobenen Spalten `each variable is a
column`, einmal mit hervorgehobener Zeile `each observation is a row`, einmal
mit hervorgehobener Zelle `each value is a cell`.
**Punchline:** `when a table is tidy, every column is a vector of one
variable, and the tools of R fit it.`

**Dazu sagen.** Our game table is tidy: one row per game, one column per
fact. Data from the wild often is not, for example with one column per year
or two facts in one cell, and then it has to be reshaped first.

## Schluss (1 Folie)

### Folie 29 💬

**Merksatz:** `a data frame is a list of equally long vectors, and every
vector holds values of one type.`
**Sidenote:** `to read on: Hands-On Programming with R, chapter "R Objects",
and R for Data Science, chapters "Data tidying", "Logical vectors",
"Factors" and "Missing values".` Beide Titel als Links auf die freien
Online-Fassungen.

**Dazu sagen.** If you remember one picture from today, take the type case:
compartments in columns, each column one kind of thing, all columns equally
long. Everything else in this module, transforming, visualising, modelling,
works on tables of this kind.

# Umfang

29 Folien, davon 3 Abschnittsfolien, 1 Titel, 1 Foto und 24 Inhaltsfolien
mit 7 Animationen, 2 Live-Abfragen und einem eingebetteten Spiel; mit den
Aufbauschritten etwa 45 Frames. Bei rund 1,5 Minuten je Inhaltsfolie und dem
Spiel am Anfang passt das in 45 Minuten.
