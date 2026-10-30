# Entwurf: Input „data transformation with R and dplyr“

**Status:** freigegeben am 2026-10-30 mit den drei Empfehlungen und gebaut;
das Deck ist jetzt die Quelle, dieser Entwurf bleibt als Herleitung liegen.

**Verortung:** Folien-Inhalt auf Hands-on Data Science
(`knowledge/content/data-transformation-slides/`), neben dem Lernpfad
„Datentransformation mit R und dplyr“; als wiederkehrender Input von etwa 45
Minuten in EA (Kurs „Explorative Datenanalyse“), WMG und PMG. Weil der Satz
wiederkehrt, steht kein Datum auf der Titelfolie und nirgends ein Verweis auf
andere Sitzungen.

**Kernbotschaft:** `a handful of verbs is enough for almost every data
preparation, and the pipe chains them into a sequence you can read like a
sentence.`

**Sprache:** Folien, Beispiele und Daten englisch (`language = "en"`, also
Kleinschreibung). Sprechernotizen und `skript.md` ebenfalls englisch, damit
das Skript auf der englischen Seite passt; sag Bescheid, wenn du die Notizen
lieber deutsch hättest.

**Design:** eine eigene `style.toml` für Hands-on Data Science. Sie übernimmt
alle Werte aus dem Data-Analytics-Stil und ersetzt nur die Leitfarbe:
Pink `#F472B6` statt Hochschulblau (das Pink der Plattform in der Fassung für
dunklen Grund), Teilfarben aus der Pink-Reihe. Damit ist auch die
Hervorhebung im Code (`.hl`) pink. Die Gruppenfarben für `group_by()` bleiben
Blau, Lila und Türkis.

**Daten:** die ersten sechs Zeilen des Auszugs `survey` mit den Spalten
`id`, `age`, `diet` und `organic_share`, also dieselbe kleine Tabelle wie im
Demonstrator der Verben auf der Seite. Alle Animationen beginnen mit genau
dieser Tabelle an derselben Stelle. Die Code-Folien am Ende rechnen mit allen
30 Zeilen.

**Technik:** stagekit 0.2.0 mit `anim.js`. Die Kopie im Repository
(`vendor/stagekit/`) ist älter und kennt noch keine Animationen; sie wird vor
dem Bau mit `tools/sync.py` erneuert.

## Zu entscheiden

1. **Verben zuerst ohne Pipe (empfohlen).** In Teil 2 steht jedes Verb in
   der Form `filter(survey, age >= 50)`, passend zur Regel „das erste Argument
   ist eine Tabelle“. Die letzte Verb-Folie braucht zwei Verben ineinander,
   und genau dieses Problem löst Teil 3 mit der Pipe. Die Alternative wäre die
   Pipe schon vor den Verben, so wie im Lernpfad, dann aber ohne den Moment,
   in dem man merkt, wozu sie gut ist.
2. **Pink neben Rot.** Pink `#F472B6` liegt nah am Rot `#FF4D6D`, das in
   stagekit „falsch“ heißt (Kreuz beim `filter()`). Ich schlage vor, Rot für
   diesen Satz auf ein reineres `#EF4444` zu setzen, damit die beiden auf der
   Leinwand unterscheidbar bleiben.
3. **Zwei Live-Abfragen** (Folien 22 und 23) über den Classroom-Live-Server,
   wie in den Data-Analytics-Decks. Ohne Server zeigen sie im PDF nur Frage
   und QR-Code.

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

**Titel:** `data transformation with R and dplyr`
**Untertitel:** `hands-on data science · Prof. Dr. Nicolas Meseth`

Die Agenda-Folie danach füllt stagekit aus den drei Teilen: `why transform`,
`the verbs`, `the pipe`.

### Folie 2 📷

**Bild:** Draufsicht auf ein dunkles Holzbrett vor schwarzem Grund. Links
liegt ungeordnet Gemüse vom Markt mit Erde und Blättern, rechts stehen kleine
Schalen mit geschnittenen, sortierten Zutaten, wie ein Koch sie vor dem
Kochen bereitstellt. Ein einzelnes warmes Licht von oben, der Rand verliert
sich im Schwarz.

**Text:** `no cook serves the groceries the way they come from the market,
and every recipe is a handful of techniques in a certain order.`

**Dazu sagen.** Kochen besteht aus wenigen Techniken wie Schneiden,
Aussortieren, Ordnen und Zusammengeben, und jedes Rezept kombiniert sie
anders. Mit Daten ist es genauso: Kaum eine Frage lässt sich an den Rohdaten
ablesen, aber eine Handvoll Grundoperationen macht aus jeder Tabelle die, in
der die Antwort steht.

## Teil 1: why transform (4 Folien)

### Folie 3 🖼️

**Titel klein:** `a question for the survey`
**Zeichnung:** die Umfrage als blasse Tabelle mit 30 Zeilen und elf Spalten,
darüber in Weiß die Frage `do vegetarians buy more organic food than
others?`. Die Spalten `diet` und `organic_share` sind etwas heller als der
Rest.
**Punchline:** `the answer is in the table, but you cannot read it off.`

**Dazu sagen.** Die Antwort steckt in den Daten, aber erst wenn man die
richtigen Zeilen nimmt, nach Ernährung trennt und je Gruppe einen
Durchschnitt bildet. Das ist Datentransformation: aus einer Tabelle eine
andere machen, ohne neue Daten zu erheben.

### Folie 4 🎞️

**Titel klein:** `a table in, a table out`
**Zeichnung:** links die sechs Zeilen der Umfrage, in der Mitte ein Kasten
`transformation`, rechts Platz für das Ergebnis.
**Animation:** schrittweise, zwei Abschnitte.
1. Die Tabelle fährt in den Kasten; danach steht sie nicht mehr links, und
   der Kasten leuchtet gelb.
2. Rechts erscheint eine kleinere Tabelle (drei Zeilen, zwei Spalten); danach
   sind Kasten und Ergebnis zu sehen, der Kasten wieder weiß.
**Punchline:** `every transformation takes a table and returns a table,
which is why they can be chained.`

### Folie 5 🖼️ 🪜

**Titel klein:** `six basic operations`
**Zeichnung:** sechs kleine Piktogramme im Raster 3 × 2, jedes eine
Mini-Tabelle vor und nach der Operation, darunter die Frage dahinter:

| Operation | Frage | Piktogramm |
|---|---|---|
| `select columns` | `which characteristics do I need?` | zwei von vier Spalten bleiben |
| `filter rows` | `who is this about?` | zwei von fünf Zeilen fallen weg |
| `sort` | `what comes first?` | Zeilen in neuer Reihenfolge |
| `compute new columns` | `what can be derived?` | eine Spalte kommt dazu |
| `summarize` | `what is typical, how many?` | viele Zeilen werden eine |
| `group` | `how do subgroups differ?` | eine Zeile je Gruppe |

**Aufbau:** drei Schritte zu je zwei Piktogrammen (Spalten und Zeilen,
Reihenfolge und neue Spalten, Zusammenfassen und Gruppen).

### Folie 6 📊

**Titel klein:** `the same ideas everywhere`
**Text:** Tabelle mit den Zeilen der sechs Operationen und den Spalten
`dplyr`, `SQL`, `pandas` und `excel` (`select()` · `SELECT` ·
`df[columns]` · `hide columns` usw., wie in der Lektion auf der Seite).

**Dazu sagen.** Wer die Operationen einmal verstanden hat, findet sich in
SQL und pandas schnell zurecht; nur die Namen ändern sich.

## Teil 2: the verbs (17 Folien)

### Folie 7 ⌨️ 🪜

**Titel klein:** `dplyr names its functions after what they do`
**Code:** `library(dplyr)`
**Text, in drei Schritten:**
- `the first argument is always a table`
- `columns go by their name, without quotes and without $`
- `the result is a new table, the original stays as it was`

**Dazu sagen.** Deshalb heißen die Funktionen die Verben von dplyr. Die
dritte Regel überrascht oft: Wer das Ergebnis behalten will, muss es einem
Namen zuweisen.

### Folie 8 🖼️

**Titel klein:** `six rows of the survey`
**Zeichnung:** die Tabelle mit `id`, `age`, `diet`, `organic_share` und den
Zeilen 1 bis 6 (56 omnivore 2, 55 omnivore 2, 47 omnivore 1, 32 omnivore 1,
74 flexitarian 2, 48 vegetarian 2). Sie steht pixelgleich dort, wo alle
folgenden Animationen beginnen.
**Fußnote:** `organic_share: share of organic food when shopping, from 1
(hardly any) to 5 (almost all)`

### Folie 9 🎞️

**Titel klein:** `select(): keep columns`
**Code oben:** `select(survey, id, diet)`, `select` pink.
**Animation:** schrittweise, zwei Abschnitte.
1. Die Köpfe von `id` und `diet` werden gelb; danach ist zu sehen, welche
   Spalten bleiben.
2. `age` und `organic_share` blenden aus, `diet` rückt an `id` heran; danach
   steht die schmale Tabelle mit allen sechs Zeilen.

### Folie 10 ⌨️

**Titel klein:** `three ways to say which columns`
**Code**, je Block mit einer Zeile Erklärung rechts:
```r
select(survey, id, diet)
select(survey, -organic_share)
select(survey, id, starts_with("organic"))
```
`by name` · `all but this one` · `by a pattern in the name`

### Folie 11 🎞️

**Titel klein:** `filter(): keep rows`
**Code oben:** `filter(survey, age >= 50)`
**Animation:** schrittweise, zwei Abschnitte.
1. Ein gelber Rahmen läuft die Spalte `age` hinunter, und jede Zeile bekommt
   rechts einen grünen Haken oder ein rotes Kreuz (`56 ✓`, `55 ✓`, `47 ✗`,
   `32 ✗`, `74 ✓`, `48 ✗`); danach stehen alle sechs Urteile da.
2. Die Zeilen mit Kreuz blenden aus, die übrigen rücken zusammen; danach
   bleiben die Zeilen 1, 2 und 5.

### Folie 12 ⌨️

**Titel klein:** `conditions`
**Code:**
```r
filter(survey, diet == "vegan")
filter(survey, age >= 50 & diet != "omnivore")
filter(survey, diet %in% c("vegan", "vegetarian"))
filter(survey, !is.na(organic_share))
```
**Text rechts:** `==` `equal`, `!=` `not equal`, `&` `and`, `|` `or`,
`%in%` `one of`, `is.na()` `missing`.
**Remark (rot):** `= assigns, == compares`

### Folie 13 🎞️

**Titel klein:** `arrange(): sort rows`
**Code oben:** `arrange(survey, desc(age))`
**Animation:** schrittweise, ein Abschnitt. Die Zeilen gleiten an ihren
neuen Platz, die Werte in `age` gelb, solange sie wandern; danach steht die
Tabelle in der Reihenfolge 74, 56, 55, 48, 47, 32.

### Folie 14 ⌨️

**Titel klein:** `ascending, descending, several columns`
**Code:**
```r
arrange(survey, age)
arrange(survey, desc(age))
arrange(survey, diet, desc(age))
```
**Dazu sagen.** Die zweite Spalte entscheidet nur bei Gleichstand in der
ersten.

### Folie 15 🎞️

**Titel klein:** `mutate(): compute new columns`
**Code oben:** `mutate(survey, decade = age %/% 10 * 10)`
**Animation:** schrittweise, zwei Abschnitte.
1. Rechts erscheint eine leere Spalte `decade`; danach ist der Platz da.
2. Zeile für Zeile leuchtet `age` gelb auf, und daneben erscheint der Wert
   (50, 50, 40, 30, 70, 40); danach ist die Spalte gefüllt, die Zahl der
   Zeilen unverändert.

### Folie 16 ⌨️

**Titel klein:** `one row in, one row out`
**Code:**
```r
mutate(
  survey,
  decade = age %/% 10 * 10,
  organic_fan = organic_share >= 4
)
```
**Dazu sagen.** `mutate()` rechnet in jeder Zeile für sich und kann
mehrere Spalten auf einmal anlegen; eine Spalte darf auf eine zuvor im selben
Aufruf berechnete zugreifen.

### Folie 17 🎞️

**Titel klein:** `summarize(): many rows become one`
**Code oben:** `summarize(survey, n = n(), mean_age = mean(age))`
**Animation:** schrittweise, zwei Abschnitte.
1. Die sechs Zeilen werden gezählt: ein Zähler `n` läuft von 1 bis 6,
   während jede Zeile kurz gelb wird; danach steht `n = 6`.
2. Die sechs Werte aus `age` fliegen in eine Zelle und werden zu `52`;
   danach steht nur noch die Ergebnistabelle mit einer Zeile, `n` und
   `mean_age`.

### Folie 18 ⌨️

**Titel klein:** `summary functions`
**Code:**
```r
summarize(
  survey,
  n = n(),
  mean_organic = mean(organic_share, na.rm = TRUE),
  oldest = max(age)
)
```
**Text rechts:** `n()`, `mean()`, `median()`, `min()`, `max()`, `sd()`
**Remark:** `one missing value makes the mean NA, unless na.rm = TRUE`

### Folie 19 🎞️

**Titel klein:** `group_by(): split into groups`
**Code oben:** `group_by(survey, diet)`
**Animation:** schrittweise, zwei Abschnitte.
1. Jede Zeile bekommt die Farbe ihrer Gruppe (omnivore, flexitarian,
   vegetarian), über der Tabelle erscheint `groups: diet [3]`; danach ist zu
   sehen, dass sich an den Daten nichts geändert hat.
2. Die Zeilen ordnen sich in drei Blöcke mit Abstand dazwischen; danach
   stehen die Gruppen getrennt.

### Folie 20 🎞️

**Titel klein:** `group_by() and summarize(): one row per group`
**Animation:** schrittweise, ein Abschnitt. Jeder Block fällt zu einer Zeile
zusammen, in seiner Gruppenfarbe; danach steht die Tabelle
`flexitarian 1 74`, `omnivore 4 47.5`, `vegetarian 1 48`.

### Folie 21 ⌨️

**Titel klein:** `two verbs at once`
**Code:**
```r
summarize(
  group_by(survey, diet),
  n = n(),
  mean_age = mean(age)
)
```
**Punchline:** `group_by() alone changes nothing you can see; it tells the
next verb to work per group.`

**Dazu sagen.** Hier steckt ein Verb im anderen. Bei zwei geht das noch, bei
vier nicht mehr, und genau dafür gibt es die Pipe.

### Folie 22 🗳️

**Abfrage:** `you only want the respondents from Bavaria. which verb?`
(Kennung `verb-for-rows`, Quiz)
- `select()`
- `filter()` ✔
- `arrange()`
- `mutate()`

### Folie 23 🗳️

**Abfrage:** `you need the average age per diet. what do you use?`
(Kennung `verbs-for-groups`, Quiz)
- `summarize()`
- `group_by()`
- `group_by() + summarize()` ✔
- `mutate()`

## Teil 3: the pipe (7 Folien)

### Folie 24 ⌨️ 🪜

**Titel klein:** `nested calls are read from the inside out`
**Code:**
```r
arrange(
  summarize(
    group_by(
      filter(survey, age >= 40),
      diet
    ),
    n = n()
  ),
  desc(n)
)
```
**Aufbau:** vier Schritte, in denen die Nummern 1 bis 4 neben `filter`,
`group_by`, `summarize` und `arrange` erscheinen, von innen nach außen.
**Dazu sagen.** Gelesen wird von innen nach außen, und die Argumente stehen
weit weg von ihrer Funktion: `desc(n)` gehört zu `arrange()` ganz oben.

### Folie 25 ⌨️

**Titel klein:** `intermediate tables`
**Code:**
```r
older <- filter(survey, age >= 40)
grouped <- group_by(older, diet)
counts <- summarize(grouped, n = n())
result <- arrange(counts, desc(n))
```
**Punchline:** `readable, but full of names nobody needs again.`

### Folie 26 🖼️

**Titel klein:** `the pipe passes the table on`
**Zeichnung:** oben `x |> f(y)`, darunter `f(x, y)`, ein Pfeil zeigt, wie `x`
in den ersten Platz der Funktion wandert.
**Text:** `read |> as "and then"`
**Sidenote:** `%>% from older code means the same; ctrl+shift+m types it`

### Folie 27 🎞️

**Titel klein:** `a pipeline`
**Zeichnung:** links der Code mit fünf Zeilen, rechts vier Stationen in einer
Reihe (`filter(age >= 40)`, `group_by(diet)`, `summarize(n = n())`,
`arrange(desc(n))`), davor die sechs Zeilen der Umfrage.
**Animation:** schrittweise, vier Abschnitte; in jedem fährt die Tabelle in
die nächste Station, die zugehörige Codezeile wird gelb, und die Tabelle
kommt verwandelt heraus.
1. `filter`: Zeile 4 (32 Jahre) fällt weg; danach fünf Zeilen.
2. `group_by`: die Zeilen färben sich nach Gruppe; danach dieselben fünf
   Zeilen in drei Farben.
3. `summarize`: drei Zeilen `omnivore 3`, `flexitarian 1`, `vegetarian 1`.
4. `arrange`: die Reihenfolge nach `n`, absteigend; danach die fertige
   Tabelle rechts.

### Folie 28 ⌨️ 🪜

**Titel klein:** `the same, as you would write it`
**Code:**
```r
survey |>
  filter(age >= 40) |>
  group_by(diet) |>
  summarize(n = n()) |>
  arrange(desc(n))
```
**Aufbau:** fünf Schritte, in denen neben jeder Zeile der gelesene Satz
erscheint: `take the survey,` · `and then keep everyone aged 40 or older,` ·
`and then group by diet,` · `and then count,` · `and then sort by the
count.`

### Folie 29 🪜

**Titel klein:** `plan in words, then translate`
**Text:** links die Frage von Folie 3 in fünf Schritten (`take the survey`,
`keep the rows with an organic share`, `split by diet`, `average and count
per group`, `sort by the average`), rechts erscheint Schritt für Schritt das
passende Verb.

### Folie 30 ⌨️ 🧪

**Titel klein:** `the answer`
**Code:**
```r
survey |>
  filter(!is.na(organic_share)) |>
  group_by(diet) |>
  summarize(
    n = n(),
    mean_organic = mean(organic_share)
  ) |>
  arrange(desc(mean_organic))
```
**Ausgabe:** die Ergebnistabelle für die 30 Zeilen des Auszugs (beim Bau in
R berechnet).
**Live-Moment:** den Code in einen R-Kasten auf der Seite oder in Positron
kopieren und laufen lassen, dann eine Zeile ändern, etwa `median()` statt
`mean()`.
**Dazu sagen.** Mit 30 Personen beantwortet das die Frage noch nicht; der
Datensatz zum Herunterladen hat 2.811.

## Teil 4: Abschluss (2 Folien)

### Folie 31 💬

**Titel klein:** `six verbs and a pipe`
**Text:** zwei Spalten, jede Zeile Verb und Wirkung: `select()` `columns` ·
`filter()` `rows` · `arrange()` `order` · `mutate()` `new columns` ·
`summarize()` `one row` · `group_by()` `per group` · `|>` `and then`

### Folie 32 📷

**Bild:** dasselbe Brett wie auf Folie 2, jetzt mit einem fertig
angerichteten Teller in der Mitte, die leeren Schalen am Rand, gleiches
Licht.
**Text:** `to practise: the learning path "data transformation with R and
dplyr" on hands-on data science.`

**Dazu sagen.** Der Lernpfad zeigt dieselben Verben mit R-Kästen, die im
Browser laufen. Die Adresse kommt auf die Folie, sobald die Seite
veröffentlicht ist.
