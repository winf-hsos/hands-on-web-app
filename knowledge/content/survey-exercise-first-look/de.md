---
type: exercise
code: 4328
title: "Selbststudium R, Kapitel 1: Den Datensatz kennenlernen"
summary: >-
  Sechs Aufgaben zum ersten Blick auf die Umfrage zu Milch und Schokolade: wie
  groß sie ist, wer wer ist, wie die Spalten heißen und was nicht in ihnen steht.
objectives:
  intro: "In diesem Kapitel lernst du den vollständigen Datensatz der Umfrage kennen, bevor du mit ihm rechnest, und kannst danach:"
  goals:
    - "die Größe eines Datensatzes bestimmen und sagen, wofür eine Zeile und wofür eine Spalte steht"
    - "mit `n_distinct()` prüfen, ob eine Spalte jede Beobachtung eindeutig bezeichnet, und mit `mutate()` und `row_number()` eine eigene Kennung anlegen"
    - "Spalten mit `select()` und `starts_with()` nach ihrem Anfangsbuchstaben auswählen und dabei Groß- und Kleinschreibung unterscheiden"
    - "die Bedeutung der Codes einer Spalte im Codebuch nachschlagen"
    - "rohe und aufbereitete Spalten auseinanderhalten und für Tabelle und Abbildung die passende wählen"
    - "benennen, was man über eine Befragung wissen muss, obwohl es in keiner Spalte steht"
level: 1
duration: 90
topics: [exploring-data, programming-with-r, data-pitfalls]
modules: [pmg]
areas: [ds]
r_datasets: { survey: mds12_schoko_milch.csv }
relations:
  see_also: [milk-chocolate-survey, r-for-data-science]
status: published
updated: 2026-11-11
---

Dieses Kapitel ist das erste von fünf, in denen du R im eigenen Tempo an einer
durchgehenden Übung lernst. Eine Leitfrage zieht sich durch alle fünf: **Wo
kaufen die Befragten ein, und wer kauft Bio?** Bevor du sie beantworten kannst,
musst du den Datensatz kennen, und darum geht es hier: wie groß er ist, woran
man eine befragte Person wiederfindet, nach welchem System die Spalten benannt
sind und was man über die Befragung wissen muss, das in keiner Spalte steht.

In den Kästen auf dieser Seite liegt die Tabelle `survey` schon bereit, und
das tidyverse ist geladen. Anders als in den Lektionen ist `survey` hier nicht
die kompakte Fassung, sondern die ganze
[[milk-chocolate-survey|Umfrage zu Milch und Schokolade]]. Jeder Kasten läuft
für sich; was du in einem Kasten anlegst, ist im nächsten nicht mehr da. In
deinem Kursordner lädst du den Datensatz in Positron selbst:

```r static
library(tidyverse)
survey <- read_csv("data/mds12_schoko_milch.csv")
```

Zum Einstieg lohnen sich in [[r-for-data-science]] das Kapitel
[2 „Workflow: basics“](https://r4ds.hadley.nz/workflow-basics.html), die
Abschnitte [6.1 und 6.2 „Scripts“ und „Projects“](https://r4ds.hadley.nz/workflow-scripts.html)
und [7.2 „Reading data from a file“](https://r4ds.hadley.nz/data-import.html#reading-data-from-a-file),
dazu die Seite zur [[milk-chocolate-survey|Umfrage]]. Die Nummern der Aufgaben
stimmen mit denen in `chapter_1.R` aus deinem Kursordner überein, und zu
vielen gibt es einen Kontrollwert, an dem du dein Ergebnis selbst prüfen
kannst.

## Teil 1: Wie groß, und wer ist wer?

1. **1.1** Bestimme, wie viele Zeilen und wie viele Spalten `survey` hat.
   Beschreib dann in einem Satz, wofür eine Zeile und wofür eine Spalte steht.

```r
survey
```

> [!HINT]
> Lies dazu auf der Seite zur [[milk-chocolate-survey|Umfrage]] den Anfang,
> im Kursordner in `course/datasets/mds12-schoko-milch.md` den Abschnitt
> „Eckdaten“. Die Kopfzeile einer ausgegebenen Tabelle nennt ihre Größe
> schon, und `nrow()` und `ncol()` liefern die beiden Zahlen einzeln.

> [!SOLUTION]
> ```r
> nrow(survey)
> ncol(survey)
> ```
>
> `survey` hat 2.811 Zeilen und 606 Spalten: Jede Zeile ist eine befragte
> Person, und jede Spalte ist eine Frage oder, bei Mehrfachantworten und
> Fragebatterien, ein Teil einer Frage oder ein daraus abgeleiteter Wert. Die
> Postleitzahl und die offenen Antworten sind nicht enthalten, damit niemand
> über sie wiederzuerkennen ist.

2. **1.2** Jede Beobachtung in einem Datensatz sollte sich eindeutig
   bezeichnen lassen, damit man sie wiederfindet und Tabellen verbinden kann.
   Prüfe mit `n_distinct()` für die ersten fünf Spalten, ob eine von ihnen
   das leistet: Eine Kennung hätte so viele verschiedene Werte, wie es Zeilen
   gibt. Wenn keine passt, leg mit `mutate()` eine neue Spalte
   `respondent_id` an, die die Zeilen mit `row_number()` durchnummeriert, und
   speichere das Ergebnis wieder unter `survey`.

```r
survey
```

> [!HINT]
> Lies dazu in [[r-for-data-science]] den Abschnitt
> [3.3 „Columns“](https://r4ds.hadley.nz/data-transform.html#columns). Die
> Namen der ersten fünf Spalten zeigt dir `survey` in der Kopfzeile. Ein
> einziges `summarize()` mit fünf Aufrufen von `n_distinct()` zählt ihre
> verschiedenen Werte nebeneinander.
>
> Kontrolle: `respondent_id` hat 2.811 verschiedene Werte.

> [!SOLUTION]
> ```r
> survey |>
>   summarize(
>     q001hheinkauf = n_distinct(q001hheinkauf),
>     q002geburt = n_distinct(q002geburt),
>     q003land = n_distinct(q003land),
>     q004geschlecht = n_distinct(q004geschlecht),
>     q005os = n_distinct(q005os)
>   )
> ```
>
> Die fünf Spalten haben 2, 61, 16, 3 und 2 verschiedene Werte, also keine
> auch nur annähernd 2.811; es sind Antworten, die viele Personen teilen,
> etwa das Bundesland oder das Geburtsjahr. Auch sonst hat keine Spalte des
> Datensatzes mehr als 99 verschiedene Werte, eine Kennung musst du also
> selbst anlegen:
>
> ```r
> survey <- survey |>
>   mutate(respondent_id = row_number())
>
> survey |>
>   summarize(n_ids = n_distinct(respondent_id))
> ```
>
> `respondent_id` hat 2.811 verschiedene Werte, eine für jede Zeile. Die
> Nummer hängt an der Reihenfolge der Zeilen in der Datei; solange du die
> Datei so lädst, wie sie ist, bezeichnet sie immer dieselbe Person.

## Teil 2: Spaltennamen und Codebuch

3. **1.3** Der erste Buchstabe eines Spaltennamens sagt, zu welchem Block die
   Frage gehört. Zähle, wie viele Spalten zum Block `v` (Verhalten) gehören,
   indem du sie mit `select(starts_with("v"))` auswählst und mit `ncol()`
   zählst. `starts_with()` unterscheidet von sich aus nicht zwischen groß und
   klein; schlag in der Hilfe nach (`?starts_with`), wie man das einstellt,
   und zähle dann nur die Spalten, die mit einem kleinen `v` beginnen.
   Beschreib in einem Satz, warum der Unterschied hier wichtig sein kann.

```r
survey
```

> [!HINT]
> Lies dazu auf der Seite zur [[milk-chocolate-survey|Umfrage]] den Abschnitt
> „Wie die Spalten heißen“, im Kursordner in
> `course/datasets/mds12-schoko-milch.md` die Abschnitte „Die Präfixe“ und
> „Klein oder groß“. Die Einstellung, die du suchst, ist ein Argument von
> `starts_with()`, dessen Name schon sagt, dass es um die Schreibweise geht.
>
> Kontrolle: mit großem und kleinem `v` 85, nur kleines `v` 82. Die
> vollständige Fassung im Kursordner kommt auf 86 und 85, weil die beiden
> Fassungen nicht genau dieselben Spalten haben.

> [!SOLUTION]
> ```r
> survey |>
>   select(starts_with("v")) |>
>   ncol()
>
> survey |>
>   select(starts_with("v", ignore.case = FALSE)) |>
>   ncol()
>
> survey |>
>   select(starts_with("V", ignore.case = FALSE)) |>
>   names()
> ```
>
> Mit großem und kleinem `v` sind es 85 Spalten, nur mit kleinem `v` 82. Die
> drei übrigen, `V041nofleischf`, `V041nofleisch3` und `V041nofleisch3f`,
> beginnen mit einem großen `V` und sind damit aufbereitete Spalten zur
> Ernährungsweise, zwei davon mit Text statt Codes. Der Unterschied ist
> wichtig, weil kleine Buchstaben für Rohdaten und große für aufbereitete
> Spalten stehen: Wer mit `starts_with("v")` die Rohdaten eines Blocks
> auswählen will, bekommt ohne `ignore.case = FALSE` aufbereitete Spalten
> dazu, in denen dieselbe Frage ein zweites Mal steckt, teils als Text.

4. **1.4** Die Spalte `v032bioanteil` enthält Zahlen von 1 bis 5. Schlag die
   Frage im Codebuch nach und notiere die Seite, den Fragetext in Kurzform
   und was die Codes 1 und 5 heißen.

```r
survey
```

> [!HINT]
> Das Codebuch gibt es nur in deinem Kursordner, als
> `data/M3b_Musterstudie-quantitativ.pdf`; in der PDF findest du die Frage
> mit Strg+F (Mac: Cmd+F) und der Suche nach `v032`. Dieselben Angaben in
> Textform stehen in `course/datasets/mds12-schoko-milch-codebook.md`. Welche
> Codes tatsächlich vorkommen, zeigt dir `count()` hier im Kasten.
>
> Kontrolle: Die Frage steht auf Seite 28.

> [!SOLUTION]
> ```r
> survey |>
>   count(v032bioanteil)
> ```
>
> Die Frage steht auf Seite 28 des Codebuchs und fragt, wie groß der Anteil
> von Biolebensmitteln am gesamten normalen Einkauf ist. Code 1 heißt „Ich
> kaufe (fast) nie Bio“, Code 5 „Ich kaufe (fast) nur Bio“; dazwischen
> liegen „deutlich weniger als die Hälfte“ (2), „etwa die Hälfte“ (3) und
> „deutlich mehr als die Hälfte“ (4). Am häufigsten ist Code 2 mit 938
> Personen, Code 5 haben nur 111 gewählt, und bei 18 Personen fehlt der
> Wert. Ohne das Codebuch wüsstest du nicht einmal, ob 5 viel oder wenig Bio
> bedeutet.

5. **1.5** Zeige für die ersten fünf Befragten `respondent_id`, `q002geburt`,
   `Q002alter`, `Q002altergru4` und `Q002altergru4f` nebeneinander, mit
   `select()` und `slice()`. Beschreib dann in einem Satz, wie die vier
   Altersspalten zusammenhängen und welche du für eine Tabelle und welche für
   eine Abbildung nehmen würdest.

```r
survey
```

> [!HINT]
> Lies dazu in [[r-for-data-science]] den Abschnitt
> [3.2 „Rows“](https://r4ds.hadley.nz/data-transform.html#rows), dort stehen
> `slice()` und seine Verwandten. `respondent_id` aus Aufgabe 1.2 gibt es in
> diesem Kasten noch nicht; leg sie zu Beginn der Pipe mit `mutate()` wieder
> an.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(respondent_id = row_number()) |>
>   select(respondent_id, q002geburt, Q002alter, Q002altergru4, Q002altergru4f) |>
>   slice(1:5)
> ```
>
> Die erste Person ist 1970 geboren, 55 Jahre alt und gehört zur Gruppe 3,
> `45-59 Jahre`. Die vier Spalten bilden eine Kette: `q002geburt` ist das
> rohe Geburtsjahr, `Q002alter` das daraus berechnete Alter (bei allen
> 2.811 Befragten 2025 minus Geburtsjahr), `Q002altergru4` die Altersgruppe
> als Code von 1 bis 4 und `Q002altergru4f` dieselbe Gruppe als Text. Für
> eine Tabelle mit Kennzahlen wie dem mittleren Alter nimmst du `Q002alter`,
> für eine Abbildung oder eine Tabelle nach Altersgruppen `Q002altergru4f`,
> weil dort lesbare Gruppen statt Codes stehen.

## Teil 3: Was nicht in den Daten steht

6. **1.6** Lies im Codebuch die Seiten 1 bis 3 über Ziel der Befragung,
   Stichprobe und Durchführung. Nenne dann zwei Dinge, die man für die
   Auswertung wissen muss, die aber in keiner Spalte stehen.

```r
survey
```

> [!HINT]
> Das Codebuch liegt nur in deinem Kursordner
> (`data/M3b_Musterstudie-quantitativ.pdf`). Lies dazu auf der Seite zur
> [[milk-chocolate-survey|Umfrage]] den Anfang und den Abschnitt „Was man
> wissen sollte, bevor man rechnet“, im Kursordner in
> `course/datasets/mds12-schoko-milch.md` den Abschnitt „Die Stichprobe ist
> nicht bundesrepräsentativ“. Frag dich, wer überhaupt in die Befragung kam
> und wie.

> [!SOLUTION]
> Zwei Beispiele von mehreren möglichen: Die Befragten kommen aus einem
> Online-Panel und wurden nach Quoten für Alter, Geschlecht und Bundesland
> ausgewählt, nicht zufällig, und es sind nur Menschen, die für ihren
> Haushalt selbst einkaufen. Außerdem wurden für ein Spezialthema rund 200
> Personen aus Stadt und Landkreis Osnabrück zusätzlich befragt, weshalb
> Niedersachsen überrepräsentiert ist. Das zweite siehst du in den Daten
> nur, wenn du es schon weißt:
>
> ```r
> survey |>
>   count(q003land) |>
>   mutate(share_respondents = n / sum(n))
> ```
>
> Niedersachsen hat den Code 9 und kommt auf 382 Befragte, 13,6 Prozent,
> während die Quote 9,2 Prozent vorsah. Aussagen über „die Deutschen“ gehen
> mit diesen Daten deshalb nur mit Vorsicht.

## Wie es weitergeht

Im Kursordner begleitet dich der [[opencode-course-assistant|Kursassistent]]
durch dieselben Aufgaben und schaut sich deinen Code an, und weiter geht es
mit [[survey-exercise-describing-variables|Kapitel 2: Einzelne Variablen
beschreiben]].
