---
type: exercise
code: 5348
title: "Selbststudium R, Kapitel 2: Einzelne Variablen beschreiben"
summary: >-
  Acht Aufgaben an der Umfrage zu Milch und Schokolade: Skalenniveaus
  bestimmen, Kennzahlen wählen, Codes übersetzen, fehlende und unglaubwürdige
  Werte erkennen, Mehrfachantworten und Fragebatterien auswerten.
objectives:
  intro: "In diesem Kapitel beschreibst du einzelne Variablen der Umfrage, und kannst danach:"
  goals:
    - "für eine Variable das Skalenniveau bestimmen und prüfen, ob der Datentyp in R dazu passt"
    - "mit `summarise()` die Kennzahlen berechnen, die zum Skalenniveau passen"
    - "Text und Codes mit `factor()` in eine sinnvolle Reihenfolge bringen und mit Bedeutung versehen"
    - "fehlende Werte zählen und unterscheiden, ob eine Frage nicht beantwortet oder gar nicht gestellt wurde"
    - "Rohdaten mit aufbereiteten Spalten vergleichen und unglaubwürdige Werte finden"
    - "Mehrfachantworten als Anteile der Befragten und eine Fragebatterie mit `across()` auswerten"
level: 1
duration: 180
topics: [exploring-data, questions-and-measurement, data-pitfalls]
modules: [pmg]
areas: [ds]
r_datasets: { survey: mds12_schoko_milch.csv }
relations:
  requires: [survey-exercise-first-look]
  see_also: [milk-chocolate-survey, r-for-data-science]
status: published
updated: 2026-11-11
---

Das Selbststudium folgt einer Leitfrage durch fünf Kapitel: **Wo kaufen die
Befragten ein, und wer kauft Bio?** Nachdem du in
[[survey-exercise-first-look|Kapitel 1]] den Datensatz kennengelernt hast,
beschreibst du in diesem Kapitel einzelne Variablen: was sie messen, auf
welchem Skalenniveau, wie viele Werte fehlen und welche Kennzahl dazu passt.
Dazu kommen drei Datenformen, die in Befragungen ständig vorkommen: Codes,
die erst eine Bedeutung bekommen müssen, Mehrfachantworten und
Fragebatterien.

In den Kästen auf dieser Seite liegt die vollständige
[[milk-chocolate-survey|Umfrage zu Milch und Schokolade]] als Tabelle
`survey` bereit, mit 2.811 Zeilen und 606 Spalten, und die Pakete des
tidyverse sind geladen. Jeder Kasten läuft für sich: Was du in einem Kasten
anlegst, etwa eine neue Spalte, gibt es im nächsten nicht mehr. Die Nummern
der Aufgaben entsprechen denen in `chapter_2.R` aus deinem Kursordner. Zu
jeder Aufgabe gibt es einen Kontrollwert, einen Tipp mit den Lesestellen und
eine Lösung; versuch jede zuerst allein.

Vorher lesen solltest du in [[doering-research-methods|Döring (2023)]]
Kapitel 8.4 „Messung und die vier Skalenniveaus“ und in
[[r-for-data-science|R for Data Science]] die Abschnitte
[3.2 „Rows“ und 3.3 „Columns“](https://r4ds.hadley.nz/data-transform.html#rows),
[3.4 „The pipe“](https://r4ds.hadley.nz/data-transform.html#sec-the-pipe),
[13.3 „Counts“ und 13.6 „Numeric summaries“](https://r4ds.hadley.nz/numbers.html#sec-counts)
sowie [16.2 „Factor basics“](https://r4ds.hadley.nz/factors.html#factor-basics),
dazu auf der Seite zum Datensatz den Abschnitt „Was man wissen sollte, bevor
man rechnet“.

## Teil 1: Skalenniveau und Datentyp

1. **2.1** Bestimm für jede der Variablen `q003land`, `D044stadtf`,
   `Q002alter`, `v032bioanteil`, `d049einkommen` und `p031bio_1lieberbio`
   das Skalenniveau (nominal, ordinal, intervall- oder verhältnisskaliert)
   und begründe es mit einem halben Satz. Lass dir dann mit `glimpse()`
   zeigen, welchen Datentyp R jeder dieser Spalten gegeben hat, und
   beschreib, wo er nicht zum Skalenniveau passt.

```r
survey
```

> [!HINT]
> Mit 606 Spalten wird `glimpse(survey)` sehr lang; wähl die sechs Spalten
> vorher mit `select()` aus. Was die Codes bedeuten, steht im Abschnitt
> „Wichtige Variablen und ihre Codes“ von
> `course/datasets/mds12-schoko-milch.md` in deinem Kursordner, die Aussage
> hinter `p031bio_1lieberbio` lautet „Beim Lebensmitteleinkauf bevorzuge ich
> Bio-Produkte“. Lesen: Döring 8.4 und R4DS
> [16.1 und 16.2](https://r4ds.hadley.nz/factors.html#factor-basics).

> [!SOLUTION]
> ```r
> survey |>
>   select(
>     q003land, D044stadtf, Q002alter,
>     v032bioanteil, d049einkommen, p031bio_1lieberbio
>   ) |>
>   glimpse()
> ```
>
> - `q003land` ist nominal, denn die Bundesländer haben keine Reihenfolge,
>   und die Zahlen 1 bis 16 sind nur alphabetisch vergebene Codes.
> - `D044stadtf` ist ordinal, denn Wohnorte lassen sich von der Großstadt
>   bis zum Dorf ordnen, aber die Abstände zwischen den Stufen sind nicht
>   gleich.
> - `Q002alter` ist verhältnisskaliert, denn das Alter hat einen natürlichen
>   Nullpunkt, und „doppelt so alt“ ergibt einen Sinn.
> - `v032bioanteil` ist ordinal, denn die fünf Stufen reichen von „(fast)
>   nie Bio“ bis „(fast) nur Bio“, ohne gleiche Abstände.
> - `d049einkommen` ist ordinal, denn es sind elf Einkommensklassen, deren
>   erste („unter 500 €“) und letzte („5.000 € und mehr“) offen sind.
> - `p031bio_1lieberbio` ist ordinal, eine Zustimmung von −2 bis +2; in der
>   Praxis behandelt man solche Skalen oft wie intervallskaliert, sobald man
>   Mittelwerte bildet, wie in Aufgabe 2.8.
>
> R kennt nur Zahlen und Text: Alle Spalten außer `D044stadtf` sind
> ganze Zahlen (`<int>`), `D044stadtf` ist Text (`<chr>`). Passend ist das
> nur beim Alter. Bei Bundesland, Bio-Anteil und Einkommen hält R Codes für
> Zahlen, mit denen man rechnen könnte, obwohl etwa ein mittleres Bundesland
> von 7,6 nichts bedeutet, und beim Wohnort kennt der Text keine
> Reihenfolge, sodass R ihn alphabetisch sortiert. Lädst du die Datei auf
> deinem Rechner mit `read_csv()`, stehen dort `<dbl>` statt `<int>`, weil
> `read_csv()` alle Zahlen als Kommazahlen liest; am Befund ändert das
> nichts.

## Teil 2: Kennzahlen und Reihenfolgen

2. **2.2** Berechne in einem einzigen `summarise()` Minimum, Maximum, Median
   und Standardabweichung von `Q002alter`, und begründe in einem Satz, warum
   das die passenden Kennzahlen für diese Variable sind. Zur Kontrolle:
   Median 50, Standardabweichung 14,7.

```r
survey
```

> [!HINT]
> Die Funktionen heißen `min()`, `max()`, `median()` und `sd()`, und
> `summarise()` nimmt mehrere davon nacheinander auf, jede mit einem eigenen
> Namen für die neue Spalte. Lesen: R4DS
> [13.6 „Numeric summaries“](https://r4ds.hadley.nz/numbers.html#numeric-summaries).

> [!SOLUTION]
> ```r
> survey |>
>   summarise(
>     min_age = min(Q002alter),
>     max_age = max(Q002alter),
>     median_age = median(Q002alter),
>     sd_age = sd(Q002alter)
>   )
> ```
>
> Die Befragten sind zwischen 18 und 80 Jahre alt, die Hälfte ist höchstens
> 50, und die Standardabweichung beträgt 14,7 Jahre. Weil das Alter
> verhältnisskaliert ist, sind Abstände und damit eine Streuung sinnvoll,
> und Minimum und Maximum zeigen die Spannweite, die die Quoten vorgeben.
> Beim Alter fehlt kein Wert, deshalb braucht es hier kein `na.rm = TRUE`.

3. **2.3** Zähl die Befragten nach `D044stadtf` mit `count()`. Die
   Reihenfolge ist alphabetisch und damit sinnlos, denn „Dorf“ steht vor
   „Großstadt“. Leg deshalb mit `mutate()` eine neue Spalte `city_size` an,
   die dieselben Werte als Faktor in der Reihenfolge des Codebuchs enthält,
   von „Großstadt“ bis „Dorf“, und zähl dann nach `city_size`. Beschreib in
   einem Satz, welche Kategorie die häufigste ist (der Modus) und wie viele
   Personen keine Angabe gemacht haben. Zur Kontrolle: In der Tabelle steht
   „Große Mittelstadt“ an zweiter Stelle, und `NA` steht bei 7 Personen.

```r
survey
```

> [!HINT]
> Die Reihenfolge im Codebuch (Seite 32, die PDF liegt in deinem Kursordner
> unter `data/M3b_Musterstudie-quantitativ.pdf`) lautet Großstadt, Große
> Mittelstadt, Große Kleinstadt, Kleinstadt über 5.000, Kleinstadt unter
> 5.000 und Dorf. Schreib in
> `factor(D044stadtf, levels = c("Großstadt", ...))` die Werte genau so, wie
> `count()` sie zeigt, denn ein Tippfehler macht aus einem Wert still ein
> `NA`. Lesen: R4DS
> [16.2 „Factor basics“](https://r4ds.hadley.nz/factors.html#factor-basics).

> [!SOLUTION]
> ```r
> survey |>
>   count(D044stadtf)
> ```
>
> ```r
> survey |>
>   mutate(
>     city_size = factor(
>       D044stadtf,
>       levels = c(
>         "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>         "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>       )
>     )
>   ) |>
>   count(city_size)
> ```
>
> Die häufigste Kategorie ist die Großstadt mit 1.042 Befragten, also mehr
> als ein Drittel, und 7 Personen haben keine Angabe gemacht. Steht nach
> dem Umwandeln bei `NA` eine größere Zahl als 7, ist einer der Werte in
> `levels` falsch geschrieben.

4. **2.4** `v032bioanteil` ist der Bio-Anteil am eigenen Einkauf, als Code
   von 1 bis 5. Leg eine Spalte `organic_share` an, die die Codes als Text
   trägt, in der richtigen Reihenfolge, mit `factor()`, `levels = 1:5` und
   `labels = c(...)`. Zähl dann nach `organic_share`, berechne mit
   `mutate()` nach `count()` den Anteil in Prozent, und beschreib in einem
   Satz, welcher Wert der Median ist. Zur Kontrolle: „(fast) nie Bio“
   21,7 %, „etwa die Hälfte“ 26,3 %, 18 Personen ohne Angabe.

```r
survey
```

> [!HINT]
> Die Codes stehen im Codebuch auf Seite 28 (Kapitel 1, Aufgabe 1.4):
> 1 „(fast) nie Bio“, 2 „deutlich weniger als die Hälfte“, 3 „etwa die
> Hälfte“, 4 „deutlich mehr als die Hälfte“, 5 „(fast) nur Bio“. Den
> Median einer geordneten Variable findest du, indem du die Anteile von oben
> aufaddierst, bis du über 50 Prozent kommst. Lesen: R4DS
> [16.2](https://r4ds.hadley.nz/factors.html#factor-basics) und
> [3.3 „Columns“](https://r4ds.hadley.nz/data-transform.html#columns)
> (dort `mutate()`).

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     organic_share = factor(
>       v032bioanteil,
>       levels = 1:5,
>       labels = c(
>         "(fast) nie Bio", "deutlich weniger als die Hälfte", "etwa die Hälfte",
>         "deutlich mehr als die Hälfte", "(fast) nur Bio"
>       )
>     )
>   ) |>
>   count(organic_share) |>
>   mutate(percent = n / sum(n) * 100)
> ```
>
> Ein Drittel der Befragten kauft nach eigener Angabe deutlich weniger als
> die Hälfte Bio (33,4 %), ein gutes Fünftel (fast) nie und nur 3,9 %
> (fast) nur Bio. Weil
> die Zeile `NA` in `sum(n)` mitzählt, beziehen sich die Prozente auf alle
> 2.811 Befragten. Der Median ist „deutlich weniger als die Hälfte“, denn
> von den 2.793 Personen mit Angabe liegen 21,8 % bei Code 1 und zusammen
> 55,4 % bei Code 1 oder 2. Prüfen lässt sich das mit
> `median(v032bioanteil, na.rm = TRUE)` in einem `summarise()`, das 2
> ergibt; das ist erlaubt, weil der Median nur die Reihenfolge braucht.

## Teil 3: Fehlende und unglaubwürdige Werte

5. **2.5** Berechne, wie viele Befragte beim Einkommen (`d049einkommen`)
   keine Angabe gemacht haben, absolut und in Prozent. Beschreib in einem
   Satz, warum sie fehlen könnten und ob das dieselbe Art Fehlen ist wie bei
   einer Frage, die jemandem gar nicht gestellt wurde. Zur Kontrolle:
   3,6 %.

```r
survey
```

> [!HINT]
> `is.na()` liefert für jede Zeile `TRUE` oder `FALSE`. Die Summe davon ist
> die Zahl der fehlenden Werte, der Mittelwert ihr Anteil. Lesen: R4DS
> [18.2 „Explicit missing values“](https://r4ds.hadley.nz/missing-values.html#explicit-missing-values)
> und auf der Seite zum [[milk-chocolate-survey|Datensatz]] den Abschnitt
> „Was man wissen sollte, bevor man rechnet“.

> [!SOLUTION]
> ```r
> survey |>
>   summarise(
>     n_missing = sum(is.na(d049einkommen)),
>     percent_missing = mean(is.na(d049einkommen)) * 100
>   )
> ```
>
> Bei 100 der 2.811 Befragten fehlt das Einkommen, das sind 3,6 %. Der
> Fragebogen bot hier „Keine Angabe“ an, und das Einkommen ist eine Frage,
> die viele als zu persönlich empfinden; die Frage wurde also allen gestellt,
> und 100 Personen haben die Antwort verweigert. Das ist eine andere Art
> Fehlen als bei einer Filterfrage, die jemand gar nicht bekommen hat: Dort
> gibt es keine Antwort, weil keine erwartet war, hier fehlt eine Antwort,
> die es hätte geben sollen.

6. **2.6** Die Frage nach der Zahl der Kinder unter 12 Jahren gibt es
   zweimal, roh (`d043kinderzahl`) und aufbereitet (`D043kinderzahl`).

   a) Vergleich das Maximum beider Spalten und beschreib, was passiert ist.

   b) Zeig die Zeilen, die roh einen Wert haben, aufbereitet aber nicht,
   zusammen mit der Haushaltsgröße `d042hhzahl`, und beschreib, woran man
   erkennt, dass diese Werte nicht stimmen können. Damit du die Zeilen
   wiederfindest, leg vorher eine Spalte `respondent_id` an, die die
   Zeilen durchnummeriert, wie in Kapitel 1.

   c) Zähl mit `count(d042hhzahl, is_asked = !is.na(d043kinderzahl))`, wer
   überhaupt einen Wert hat, und beschreib, wem die Frage gestellt wurde.

   Zur Kontrolle: 12 Werte wurden bei der Aufbereitung entfernt.

```r
survey
```

> [!HINT]
> Bei `max()` brauchst du hier `na.rm = TRUE`, weil viele Werte fehlen. Für
> b) verbindest du in `filter()` zwei Bedingungen mit `!is.na()` und
> `is.na()`. Die Bedingung für c) steht im Codebuch auf Seite 32: Die Frage
> kam nur, wenn bei Frage 42 (Personen im Haushalt) mindestens 2 stand.
> Lesen: `course/datasets/mds12-schoko-milch.md` in deinem Kursordner,
> „Fehlend heißt oft: nicht gefragt“, und R4DS
> [12.2 „Comparisons“](https://r4ds.hadley.nz/logicals.html#comparisons).

> [!SOLUTION]
> ```r
> survey |>
>   summarise(
>     max_raw = max(d043kinderzahl, na.rm = TRUE),
>     max_clean = max(D043kinderzahl, na.rm = TRUE)
>   )
> ```
>
> Roh ist das Maximum 911234567890 Kinder, aufbereitet 9. In das Feld
> konnte man jede Zahl tippen, und bei der Aufbereitung wurden die
> unmöglichen Werte entfernt.
>
> ```r
> survey |>
>   mutate(respondent_id = row_number(), .before = 1) |>
>   filter(!is.na(d043kinderzahl), is.na(D043kinderzahl)) |>
>   select(respondent_id, d042hhzahl, d043kinderzahl, D043kinderzahl)
> ```
>
> Es sind 12 Zeilen. Ein Haushalt mit 2 bis 4 Personen kann nicht 11, 22,
> 222 oder 1.000 Kinder unter 12 Jahren haben, und schon gar nicht mehr
> Kinder als Personen; Werte wie 12345 oder 11111010 sehen eher nach
> wahllos getippten Ziffern aus als nach einer Antwort. Ganz sauber ist auch
> die aufbereitete Spalte nicht: Zwei Personen aus Zwei-Personen-Haushalten
> haben dort 9 Kinder.
>
> ```r
> survey |>
>   count(d042hhzahl, is_asked = !is.na(d043kinderzahl))
> ```
>
> Wer allein lebt, hat nie einen Wert, und das passt zur Bedingung im
> Codebuch: Die Frage bekam nur, wer mindestens zwei Personen im Haushalt
> angegeben hat. In Haushalten ab zwei Personen fehlt der Wert dagegen nur bei
> 79 Personen, die die Frage nach der Bedingung bekommen haben müssten, und
> bei den 14 Personen ohne Angabe zur Haushaltsgröße fehlt er ganz. Die
> Spalte `is_asked` zeigt also, wer einen Wert hat; wer gefragt wurde,
> verrät erst die Bedingung im Codebuch.

## Teil 4: Mehrfachantworten und Fragebatterien

7. **2.7** Bei der Frage „Wo kaufen Sie gewöhnlich Ihre Lebensmittel ein?“
   konnte jede Person mehrere Orte nennen, und für jeden Ort gibt es eine
   Spalte, von `v008ort_1discount` bis `v008ort_9online` (1 = genannt, 0 =
   nicht genannt). Berechne für jeden der neun Orte den Anteil der
   Befragten, die ihn genannt haben, in Prozent, sortiere absteigend und
   speichere das Ergebnis unter `places`. Begründe in einem Satz, warum der
   Mittelwert einer 0/1-Spalte ein Anteil ist. Heb dir den Code auf, denn
   du brauchst die Tabelle in Kapitel 4 wieder. Zur Kontrolle: Wochenmarkt
   17,5 %, Hofladen 14,1 %, Bioladen 12,8 %.

```r
survey
```

> [!HINT]
> Der Weg führt über `summarise(across(v008ort_1discount:v008ort_9online, mean))`,
> das eine breite Zeile mit neun Mittelwerten ergibt, und
> `pivot_longer()`, das daraus eine lange Tabelle mit einer Zeile je Ort
> macht. Lesen: R4DS
> [5.3 „Lengthening data“](https://r4ds.hadley.nz/data-tidy.html#sec-pivoting),
> [12.4 „Summaries“](https://r4ds.hadley.nz/logicals.html#sec-logical-summaries)
> und `course/datasets/mds12-schoko-milch.md` in deinem Kursordner,
> „Mehrfachantworten: die Basis ist die Person“.

> [!SOLUTION]
> ```r
> places <- survey |>
>   summarise(across(v008ort_1discount:v008ort_9online, mean)) |>
>   pivot_longer(
>     everything(),
>     names_to = "place",
>     values_to = "share"
>   ) |>
>   mutate(percent = share * 100) |>
>   arrange(desc(percent))
>
> places
> ```
>
> Vorn liegen der Supermarkt mit 75,9 % und der Discounter mit 73,5 %, vor
> dem Fachgeschäft mit 36,6 % und dem SB-Warenhaus mit 30,2 %; ganz hinten
> stehen die beiden Online-Wege mit 10,8 % und 6,2 %. Der Mittelwert einer
> 0/1-Spalte ist die Summe der Einsen geteilt durch die Zahl der Personen,
> und das ist genau der Anteil derer, die den Ort genannt haben. Die
> Prozente ergeben zusammen gut 277 %, weil jede Person im Mittel fast drei
> Orte genannt hat; die Basis ist die Person, nicht die Nennung.

8. **2.8** Frage 31 besteht aus sieben Aussagen zu Bio-Produkten, jede von
   +2 (trifft voll und ganz zu) bis −2 (trifft überhaupt nicht zu), in den
   Spalten `p031bio_1lieberbio` bis `p031bio_7besserfuehlen`.

   a) Berechne mit `across(starts_with(...))` den Mittelwert jeder Aussage.

   b) Zwei Aussagen sind im Codebuch mit (R) markiert. Beschreib, welche es
   sind und was das für einen Mittelwert über alle sieben Aussagen heißt.

   Zur Kontrolle: `p031bio_5gesund` hat den höchsten Mittelwert, 0,18.

```r
survey
```

> [!HINT]
> In jeder Aussage fehlen ein paar Werte; ohne `na.rm = TRUE` ist jeder
> Mittelwert `NA`. Damit `across()` es an `mean()` weitergibt, schreibst du
> die Funktion als `\(x) mean(x, na.rm = TRUE)`. Die Aussagen stehen im
> Codebuch auf den Seiten 27 und 28, das nur in deinem Kursordner liegt
> (`data/M3b_Musterstudie-quantitativ.pdf`). Achte auf die Richtung: Bei
> welchen Aussagen heißt Zustimmung, dass jemand Bio weniger schätzt?

> [!SOLUTION]
> ```r
> survey |>
>   summarise(across(starts_with("p031bio"), \(x) mean(x, na.rm = TRUE))) |>
>   pivot_longer(
>     everything(),
>     names_to = "statement",
>     values_to = "mean"
>   )
> ```
>
> Alle Mittelwerte liegen nahe null, zwischen −0,10 bei `p031bio_2gleich`
> und 0,18 bei `p031bio_5gesund` („Bio-Lebensmittel sind gesünder als
> konventionelle Lebensmittel“); im Mittel sind die Befragten also bei
> keiner Aussage klar dafür oder dagegen. Mit (R) markiert sind
> `p031bio_2gleich` („Zwischen biologisch und konventionell erzeugten
> Lebensmitteln sehe ich kaum Unterschiede“) und `p031bio_4teuer` („Ich
> kaufe keine Bio-Lebensmittel, weil sie mir zu teuer sind“). Bei ihnen
> heißt Zustimmung eine ablehnende Haltung gegenüber Bio, bei den anderen
> fünf eine zustimmende. Wer alle sieben einfach mittelt, lässt die beiden
> gegen die übrigen arbeiten; vorher müssen sie umgepolt werden, und weil die
> Skala um null liegt, genügt dafür ein Minus, etwa `-p031bio_2gleich`.

## Wie es weitergeht

Im Kurs begleitet dich der [[opencode-course-assistant|Kursassistent]] durch
die Kapitel und schaut sich deinen Code an; weiter geht es mit
[[survey-exercise-comparing-groups|Kapitel 3: Gruppen vergleichen]].
