# Entwurf: Input „tidy data with tidyr“

**Status:** Entwurf vom 2026-11-09, freigegeben am 2026-11-09 mit allen vier
Empfehlungen, gebaut.

**Verortung:** neuer Folien-Inhalt `tidy-data-slides` auf Hands-on Data
Science, eingebettet oben in die Lektion `tidy-data` (Pfad „Datentransformation
mit R und dplyr“, Schritt 2). Wiederkehrender Input von etwa 40 Minuten, also
ohne Datum auf der Titelfolie und ohne Verweis auf andere Sitzungen oder
Module.

**Kernbotschaft:** `a table is tidy when every variable has its column, every
observation its row and every value its cell, and four tidyr verbs bring
almost any messy table into that shape.`

**Publikum:** Studierende ohne Programmiererfahrung, die R und die Verben von
dplyr gerade kennenlernen; `select()`, `filter()` und die Pipe setzt das Deck
voraus, `group_by()` und `summarize()` erscheinen nur am Ende eines Beispiels
als Ausblick.

**Sprache und Design:** wie das dplyr-Deck: Folien, Beispiele und Notizen
englisch, `style.toml` von Hands-on Data Science (Pink als Leitfarbe), Code in
Codeschrift, das Neue einer Code-Folie hervorgehoben.

**Daten:** die echte Rohfassung der Umfrage zu Milch und Schokolade
(`mds12_schoko_milch.csv`, 2.811 Zeilen, 606 Spalten), die als Datensatz auf
der Seite liegt. Sie ist an genau den Stellen unaufgeräumt, die das Deck
braucht, sodass kein Beispiel erfunden werden muss:

| Muster | Stelle in der Umfrage | Verb |
|---|---|---|
| Werte in Spaltennamen | F13: angemessener Preis je Marke in drei Spalten `u013pzahl_1weihen`, `_2gut`, `_3alpro` | `pivot_longer()` |
| zwei Variablen in einer Spalte | dieselben Preise und die Kaufsicherheit aus F15 in einer langen Tabelle mit `measure` und `value` | `pivot_wider()` |
| zwei Werte in einer Zelle | F14: Preisklasse als Text „0,90 bis 1,10 EUR“ | `separate_wider_delim()` |
| mehrere Werte in einer Zelle | F8: Einkaufsorte, als Liste „discounter, supermarket, farm shop“ | `separate_longer_delim()` |
| eine Spalte je Antwort mit 0 und 1 | F8 in der Rohfassung: neun Spalten `v008ort_1discount` bis `_9online` | `pivot_longer()` und `filter()` |

Erste Zahlen aus einem Probelauf: Die Preisfrage F13 haben 231 Personen
beantwortet. Lang gemacht hat die Tabelle 8.433 Zeilen, davon 7.740 leer.
Die Mediane der genannten Preise liegen bei 1,49 Euro für Weihenstephan, 1,09 für
Gut & Günstig und 1,69 für alpro; im Regal standen 1,79, 1,09 und 1,79. Eine
Person nannte 150 Euro. Alle Zahlen rechne ich beim Bau noch einmal mit R
nach.

**Code:** Jeder Codeblock läuft kopiert sofort. Die Animationen zeigen drei
oder vier Befragte mit einfachen Spaltennamen (`price_weihenstephan`), die
Code-Folien danach arbeiten auf der ganzen Rohfassung mit ihren echten Namen.

## Zu entscheiden

1. **Einfache Namen in den Animationen, echte auf den Code-Folien
   (empfohlen).** `u013pzahl_1weihen` ist auf einer Animation schwer zu lesen
   und lenkt vom Umformen ab. Die Code-Folien zeigen danach, dass dieselben
   Handgriffe mit den echten Namen gehen, und mit `names_pattern` sogar die
   Marke aus dem Namen herausziehen. Die Alternative wären echte Namen
   überall.
2. **Die Folie zu `".value"` (Folie 22) aufnehmen (empfohlen).** Sie zeigt den
   Fall, dass zwei Variablen über dieselben drei Marken verteilt sind (Preis
   und Kaufsicherheit), und löst ihn mit einem einzigen `pivot_longer()`. Das
   ist der schwierigste Teil des Decks; ohne ihn ist es fünf Minuten kürzer.
3. **Die Folie zu `fill()` (Folie 30) aufnehmen (empfohlen).** Tabellen aus
   Excel, in denen eine Gruppe nur in ihrer ersten Zeile steht, begegnen den
   Studierenden in Projekten ständig; es ist eine Folie ohne neue Idee.
4. **Drei Live-Abfragen** über den Classroom-Live-Server wie im dplyr-Deck
   (Folien 7, 17 und 28).

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
| 🗳️ | Live-Abfrage |
| 🎞️ | Animation |

# Die Folien

## Teil 0: Auftakt (2 Folien)

### Folie 1 🎬

**Titel:** `tidy data with tidyr`
**Untertitel:** `prof. dr. nicolas meseth`

Die Agenda danach füllt stagekit aus den Teilen `what tidy means`,
`wide to long`, `long to wide`, `one cell, many things` und `the map`.

### Folie 2 📷

**Bild:** eine Werkstattwand mit Lochplatte vor schwarzem Grund, jedes
Werkzeug hängt in seinem aufgemalten Umriss, ein Umriss je Werkzeug; unten
links am Bildrand eine offene Kiste, in die Werkzeuge kreuz und quer
geworfen sind. Warmes Licht von oben, die Ränder verlieren sich im Schwarz.

**Text:** `in a tidy workshop every tool has its own place, so you find it
without searching, and tidy data gives every value a place of its own in
the same way.`

**Dazu sagen.** Aus der Kiste bekommt man jedes Werkzeug auch, aber jedes
Mal muss man suchen; an der Wand greift man hin. Mit Tabellen ist es
genauso: Unaufgeräumte Daten enthalten alles, aber jede Frage beginnt mit
Suchen und Umbauen. Dieses Deck zeigt, wie eine aufgeräumte Tabelle aussieht
und mit welchen vier Handgriffen man dorthin kommt.

## Teil 1: what tidy means (6 Folien)

### Folie 3 🖼️ 🪜

**Titel klein:** `one answer, four tables`
**Zeichnung:** dieselben Daten viermal, je eine kleine Tabelle in einem
Raster 2 × 2: drei Befragte haben für drei Marken genannt, welcher Preis für
einen Liter angemessen ist.
1. lang: `id`, `brand`, `price`, neun Zeilen
2. breit: `id`, `weihenstephan`, `gut`, `alpro`, drei Zeilen
3. eine Zelle je Person: `id`, `prices` mit `"weihenstephan 1.49, gut 1.09,
   alpro 1.89"`
4. quer: Marken als Zeilen, Personen als Spalten
**Aufbau:** Schritt für Schritt erscheint je eine Tabelle; im letzten Schritt
bekommt die erste einen grünen Rahmen mit Haken.
**Punchline:** `all four hold the same numbers, but only the first lets you
ask a question with the verbs you know.`

**Dazu sagen.** Keine der vier Tabellen ist falsch, und die zweite lesen
Menschen sogar am leichtesten. Wer aber den Median je Marke will, kommt nur
mit der ersten ohne Umbau aus: `group_by(brand)` und `summarize()`. Bei der
zweiten bräuchte man drei Rechnungen, bei der dritten müsste man erst Text
zerlegen.

### Folie 4 🎞️

**Titel klein:** `three rules`
**Zeichnung:** die lange Tabelle aus Folie 3, groß.
**Animation:** schrittweise, drei Abschnitte, jeweils mit einer Zeile Text
unter der Tabelle.
1. Die Spalte `brand` leuchtet gelb auf: `every variable has its own
   column`.
2. Die Zeile „Person 2, alpro, 1.49“ leuchtet auf, die Spalte wird wieder
   weiß: `every observation has its own row`.
3. Eine einzelne Zelle leuchtet auf: `every value has its own cell`.

**Dazu sagen.** Die drei Regeln von Hadley Wickham, der auch dplyr und tidyr
geschrieben hat. Eine Variable ist etwas, das man misst oder fragt (Marke,
Preis), eine Beobachtung ist alles, was zu einer Einheit gemessen wurde, und
ein Wert ist eine einzelne Angabe.

### Folie 5 🖼️ 🪜

**Titel klein:** `what is one observation?`
**Zeichnung:** links die breite Tabelle mit einer Zeile je Person, rechts die
lange mit einer Zeile je Person und Marke; darüber je eine Frage.
**Aufbau:** Schritt 1 zeigt links die Frage `how old are the people who
answered?` und einen Haken unter der breiten Tabelle. Schritt 2 zeigt rechts
`which brand is thought to be cheapest?` und einen Haken unter der langen.
**Punchline:** `what counts as one observation depends on the question, so
tidy is a property of a table and a question together.`

**Dazu sagen.** Für das Alter ist die Person die Einheit, und eine Zeile je
Person ist genau richtig. Für den Vergleich der Marken ist die Einheit „eine
Person bewertet eine Marke“, und dann gehören drei Zeilen zu jeder Person.

### Folie 6 🖼️

**Titel klein:** `why it pays off`
**Zeichnung:** links die breite Tabelle mit dem Code, den man für drei
Mediane braucht (`summarize(weihenstephan = median(weihenstephan), gut = …,
alpro = …)`), rechts die lange mit `group_by(brand) |> summarize(median =
median(price))`.
**Punchline:** `in a tidy table one line of code covers every brand, however
many there are.`

**Dazu sagen.** Bei drei Marken ist der Unterschied lästig, bei dreißig
entscheidend. Und ggplot2 kann nur nach Marke färben, wenn die Marke eine
Spalte ist.

### Folie 7 🗳️

**Abfrage:** `respondents gave a price for each of three brands, one column
per brand. is this table tidy?`
- `yes, one row per person`
- `no, values sit in the column names` ✔ (Quizfrage)
- `no, one cell holds two values`
- `it depends on the question`

**Dazu sagen.** Streng genommen hat auch die vierte Antwort recht, und das ist
die Brücke zu Folie 5: Für jede Frage, die Marken vergleicht, stecken die
Marken als Werte in den Spaltennamen. Kennung `tidy-wide-prices`.

### Folie 8 🖼️

**Titel klein:** `four ways to be messy`
**Zeichnung:** vier kleine Piktogramme, je eine Mini-Tabelle mit dem Fehler
gelb markiert und darunter das Verb, das ihn behebt:

| Muster | Verb |
|---|---|
| values in column names | `pivot_longer()` |
| two variables in one column | `pivot_wider()` |
| two values in one cell | `separate_wider_delim()` |
| a list in one cell | `separate_longer_delim()` |

**Dazu sagen.** Das ist die Landkarte für den Rest. tidyr wird mit dem
tidyverse geladen, `library(tidyverse)` genügt.

## Teil 2: wide to long (7 Folien)

### Folie 9 🖼️

**Titel klein:** `the price question, as the survey stores it`
**Zeichnung:** vier Zeilen der Rohfassung mit `id` und den drei Spalten
`u013pzahl_1weihen`, `u013pzahl_2gut`, `u013pzahl_3alpro`, darunter grau der
Hinweis, dass 2.580 von 2.811 Zeilen in allen drei Spalten leer sind.
**Punchline:** `the brand is a variable, but here it hides in three column
names.`

### Folie 10 🎞️

**Titel klein:** `pivot_longer(): columns become rows`
**Zeichnung:** links die breite Tabelle mit drei Befragten und den einfachen
Namen `weihenstephan`, `gut`, `alpro`, rechts Platz für die lange.
**Animation:** schrittweise, vier Abschnitte.
1. Die drei Markenspalten leuchten gelb; `id` bleibt weiß.
2. Die erste Zeile faltet sich auf: Ihre `id` wird dreimal kopiert, die drei
   Spaltennamen fahren als Werte in eine neue Spalte `brand`, die drei Preise
   in eine Spalte `price`. Danach stehen rechts drei Zeilen.
3. Die beiden anderen Befragten folgen gleichzeitig; rechts stehen neun
   Zeilen.
4. Die breite Tabelle verblasst, über der langen erscheinen die Namen der
   beiden neuen Spalten in Gelb: `names_to` und `values_to`.

### Folie 11 ⌨️ 🧪

**Titel klein:** `the code`
**Code:**
```r
prices |>
  pivot_longer(
    cols = c(weihenstephan, gut, alpro),
    names_to = "brand",
    values_to = "price"
  )
```
mit einem `tribble()` darüber, der `prices` anlegt, damit der Block kopiert
läuft. Hervorgehoben: `pivot_longer`, `names_to`, `values_to`.
**Text klein daneben:** drei Fragen, drei Argumente: `which columns?`, `where
do their names go?`, `where do their values go?`

### Folie 12 ⌨️

**Titel klein:** `with the real survey`
**Code:**
```r
raw |>
  select(id, starts_with("u013pzahl")) |>
  pivot_longer(
    cols = starts_with("u013pzahl"),
    names_to = "brand",
    values_to = "price"
  )
```
**Aufbau:** Schritt 1 zeigt darunter das Ergebnis: 8.433 Zeilen, die ersten
sechs davon, `brand` mit Werten wie `u013pzahl_1weihen` und viele `NA`.
**Dazu sagen.** Es funktioniert, aber zwei Dinge stören: 7.740 leere Zeilen
von Menschen, die die Frage nie gesehen haben, und unhandliche Markennamen.

### Folie 13 ⌨️

**Titel klein:** `cleaning up on the way`
**Code:** derselbe Block mit zwei Argumenten mehr:
```r
    names_pattern = "u013pzahl_\\d(.*)",
    values_drop_na = TRUE
```
**Aufbau:** Schritt 1 zeigt das Ergebnis: knapp 700 Zeilen, `brand` heißt jetzt
`weihen`, `gut` und `alpro`.
**Seitenkasten:** `names_prefix`, `names_pattern`, `names_sep`,
`values_drop_na`, je mit einem halben Satz.

**Dazu sagen.** `names_pattern` nimmt aus dem Spaltennamen nur, was in der
Klammer steht; `\\d` ist die Ziffer davor. Wer reguläre Ausdrücke nicht mag,
nimmt `names_prefix = "u013pzahl_"` und behält die Ziffer.

### Folie 14 ⌨️ 📊

**Titel klein:** `now one line answers it`
**Code:**
```r
prices_long |>
  filter(price <= 10) |>
  group_by(brand) |>
  summarize(n = n(), median = median(price))
```
**Aufbau:** Schritt 1 zeigt daneben die Tabelle mit den Medianen und in Grau
die Preise im Regal (1,79, 1,09, 1,79).
**Punchline:** `respondents put alpro above weihenstephan, although both
stood on the shelf at 1.79.`

**Dazu sagen.** `filter(price <= 10)` nimmt die Angabe von 150 Euro
heraus. Die Frage, warum alpro ein höherer Preis zugestanden wird, ist eine für die
explorative Analyse; hier zählt, dass sie jetzt eine Zeile Code kostet.

### Folie 15 🖼️

**Titel klein:** `nine columns of zeros and ones`
**Zeichnung:** vier Zeilen von F8 in der Rohfassung, eine Spalte je
Einkaufsort von `v008ort_1discount` bis `v008ort_9online`, gefüllt mit 0 und
1, die Einsen gelb.
**Code:** `pivot_longer()` mit `names_to = "shop"`, danach
`filter(value == 1)` und `count(shop)`.
**Punchline:** `a question with several answers is one variable, however many
columns the survey tool makes of it.`

**Dazu sagen.** Erhebungswerkzeuge legen Mehrfachauswahl fast immer so ab. Lang
gemacht und auf die Einsen gefiltert, steht in jeder Zeile eine Person und ein
Ort, an dem sie einkauft.

## Teil 3: long to wide (6 Folien)

### Folie 16 🖼️

**Titel klein:** `two variables in one column`
**Zeichnung:** eine lange Tabelle mit `id`, `brand`, `measure` und `value`,
in der `measure` abwechselnd `price` und `sure` heißt (angemessener Preis aus
F13 und Kaufsicherheit von −4 bis +4 aus F15).
**Punchline:** `price and certainty are two variables, so they need two
columns, even if the table looks tidy at first sight.`

**Dazu sagen.** So sehen Daten oft aus, die aus einer Datenbank oder einem
Messgerät kommen. Der Mittelwert von `value` wäre Unsinn, weil er Euro und
Skalenpunkte mischt.

### Folie 17 🗳️

**Abfrage:** `a long table has 3 people, 3 brands and 2 measures in rows.
how many rows does it have?`
- `6`
- `9`
- `18` ✔
- `27`

Kennung `tidy-count-rows`.

### Folie 18 🎞️

**Titel klein:** `pivot_wider(): rows become columns`
**Zeichnung:** die lange Tabelle aus Folie 16 für zwei Befragte, rechts
Platz.
**Animation:** schrittweise, drei Abschnitte.
1. Die Spalten `measure` und `value` leuchten gelb.
2. Die beiden Zeilen „Person 1, alpro, price“ und „Person 1, alpro, sure“
   fahren zusammen zu einer Zeile; `price` und `sure` steigen als
   Spaltennamen nach oben, ihre Werte rücken darunter.
3. Alle übrigen Paare folgen gleichzeitig; rechts steht `id`, `brand`,
   `price`, `sure`.

### Folie 19 ⌨️

**Titel klein:** `the code`
**Code:**
```r
answers |>
  pivot_wider(
    names_from = measure,
    values_from = value
  )
```
mit `tribble()` darüber. Hervorgehoben: `pivot_wider`, `names_from`,
`values_from`.
**Text klein daneben:** `names_from: which column gives the new names?`,
`values_from: which column fills them?`

### Folie 20 ⌨️ 📊

**Titel klein:** `wide is for people`
**Code:** `prices_long |> count(brand, diet) |> pivot_wider(names_from =
brand, values_from = n)` auf der Rohfassung.
**Aufbau:** Schritt 1 zeigt die Kreuztabelle, Ernährungsweisen als Zeilen,
Marken als Spalten.
**Punchline:** `keep data long while you analyse it, and make it wide only
when a person has to read it.`

### Folie 21 🖼️

**Titel klein:** `two directions`
**Zeichnung:** eine breite und eine lange Tabelle nebeneinander, dazwischen
zwei Pfeile, oben `pivot_longer()` nach rechts, unten `pivot_wider()` nach
links.
**Dazu sagen.** Die beiden Verben heben sich auf. Wer unsicher ist, in welche
Richtung er will, fragt nach der Einheit einer Zeile.

### Folie 22 ⌨️ 🎞️ (siehe Entscheidung 2)

**Titel klein:** `two variables across three brands`
**Zeichnung und Code:** eine breite Tabelle mit sechs Spalten
`price_weihen`, `price_gut`, `price_alpro`, `sure_weihen`, `sure_gut`,
`sure_alpro`, daneben
```r
both |>
  pivot_longer(
    cols = -id,
    names_to = c(".value", "brand"),
    names_sep = "_"
  )
```
**Animation:** schrittweise, zwei Abschnitte. Erst zerfallen die sechs
Spaltennamen am Unterstrich in zwei Teile, der erste Teil gelb, der zweite
weiß; dann wird der gelbe Teil zum Spaltennamen, der weiße zum Wert in
`brand`, und es steht `id`, `brand`, `price`, `sure` da.
**Dazu sagen.** `".value"` heißt: Dieser Teil des Namens bleibt ein
Spaltenname. Damit wird aus der breiten Tabelle in einem Schritt die tidy
Tabelle von Folie 18.

## Teil 4: one cell, many things (6 Folien)

### Folie 23 🎞️

**Titel klein:** `two values in one cell`
**Zeichnung:** eine Tabelle mit `id`, `brand` und `range`, darin Text wie
`"0.90 to 1.10"` (F14, Preisklasse).
**Animation:** schrittweise, zwei Abschnitte. Erst leuchtet in jeder Zelle
der Trenner ` to ` gelb, dann teilt sich die Zelle dort, und links und rechts
fahren `from` und `to` in zwei eigene Spalten.

### Folie 24 ⌨️

**Titel klein:** `separate_wider_delim()`
**Code:**
```r
ranges |>
  separate_wider_delim(
    range,
    delim = " to ",
    names = c("from", "to")
  ) |>
  mutate(from = as.numeric(from), to = as.numeric(to))
```
Hervorgehoben: `separate_wider_delim`, `delim`, `names`.
**Dazu sagen.** Was aus einem Text herausgeschnitten wird, bleibt Text; erst
`as.numeric()` macht Zahlen daraus. Das Gegenstück, das zwei Spalten zu einer
verbindet, heißt `unite()`.

### Folie 25 🎞️

**Titel klein:** `a list in one cell`
**Zeichnung:** `id` und `shops`, darin `"discounter, supermarket, farm
shop"`, `"supermarket"`, `"discounter, organic shop"`.
**Animation:** schrittweise, zwei Abschnitte. Erst leuchten die Kommas gelb,
dann zerfällt jede Zelle an ihnen, die Teile rutschen untereinander, und die
`id` wird für jede neue Zeile kopiert.

### Folie 26 ⌨️

**Titel klein:** `separate_longer_delim()`
**Code:**
```r
shopping |>
  separate_longer_delim(shops, delim = ", ") |>
  count(shops)
```
**Aufbau:** Schritt 1 zeigt die Zählung.
**Punchline:** `wider splits a cell into columns, longer splits it into rows,
and the question decides which one you need.`

### Folie 27 📊

**Titel klein:** `one question, three shapes`
**Zeichnung:** dieselbe Mehrfachauswahl dreimal: als Liste in einer Zelle
(Folie 25), als neun Spalten mit 0 und 1 (Folie 15) und tidy mit einer Zeile
je Person und Ort; zwei Pfeile mit den Verben führen zur tidy Form.

### Folie 28 🗳️

**Abfrage:** `a cell holds "vegan, organic, regional" and you want to count
how often each label occurs. which verb?`
- `pivot_longer()`
- `pivot_wider()`
- `separate_wider_delim()`
- `separate_longer_delim()` ✔

Kennung `tidy-verb-for-lists`.

## Teil 5: the map (4 Folien)

### Folie 29 🖼️

**Titel klein:** `spreadsheet habits`
**Zeichnung:** eine kleine Tabelle wie aus Excel, in der die Marke nur in der
ersten Zeile ihres Blocks steht und darunter leer ist.

### Folie 30 ⌨️ (siehe Entscheidung 3)

**Titel klein:** `fill()`
**Code:** `sheet |> fill(brand)`; Aufbau: Schritt 1 zeigt die Lücken gefüllt,
die neuen Werte grün.
**Dazu sagen.** `fill()` schreibt den letzten bekannten Wert nach unten. Dazu
passt `drop_na()`, das Zeilen mit fehlenden Werten entfernt, aber erst, wenn
man weiß, warum sie fehlen.

### Folie 31 📊

**Titel klein:** `from symptom to verb`
**Tabelle:**

| what you see | what you do |
|---|---|
| values in column names | `pivot_longer()` |
| two variables in one column | `pivot_wider()` |
| two values in one cell | `separate_wider_delim()` |
| a list in one cell | `separate_longer_delim()` |
| a group named only once | `fill()` |

### Folie 32 📷

**Bild:** dieselbe Werkstattwand, jetzt ohne Kiste, ein Werkzeug wird gerade
in seinen Umriss gehängt.
**Text:** `tidying comes first and costs time, but after it every new
question is only a few lines of code.`

**Dazu sagen.** In echten Projekten kostet das Aufräumen oft mehr Zeit als die
Auswertung. Zum Üben zeigt die Lektion zu Tidy Data dieselben Verben mit
R-Boxen, die im Browser laufen.

# Die Lektion dazu

Die Lektion `tidy-data` bekommt das Deck oben eingebettet und wird um tidyr
erweitert: je ein Abschnitt zu `pivot_longer()`, `pivot_wider()` und den
beiden `separate_…()`-Verben mit R-Boxen, die im Browser laufen (kleine
Tabellen aus `tribble()`, damit nichts geladen werden muss), dazu Lernziele
zu den vier Verben und eine Dauer von etwa 35 statt 15 Minuten. Der Abschnitt
„Codes statt Bedeutungen“ bleibt.
