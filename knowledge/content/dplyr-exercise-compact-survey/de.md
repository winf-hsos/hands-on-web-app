---
type: exercise
code: 4374
title: "Übung: Vom Rohdatensatz zum kompakten Datensatz"
summary: >-
  Aus der vollständigen Umfrage zu Milch und Schokolade mit 606 Spalten machst
  du in Positron den kompakten Datensatz mit 21 Spalten: laden, filtern,
  auswählen und umbenennen, Codes in Wörter übersetzen und das Ergebnis als
  CSV und als RDS speichern.
objectives:
  intro: "In dieser Übung bereitest du einen echten Rohdatensatz für die Auswertung auf und kannst danach:"
  goals:
    - "eine große CSV-Datei mit `read_csv()` laden und mit `dim()` und `glimpse()` ansehen, bevor du etwas änderst"
    - "Zeilen mit `filter()` und `%in%` behalten und begründen, warum du welche weglässt"
    - "mit `select()` Spalten in einem Schritt auswählen und umbenennen"
    - "Zahlencodes mit `factor()` in benannte Stufen übersetzen und mit `case_when()` und `if_else()` neue Spalten bilden"
    - "eine Tabelle mit `write_csv()` und `saveRDS()` speichern und erklären, was die RDS-Datei bewahrt und die CSV-Datei verliert"
level: 1
duration: 45
topics: [getting-data, transforming-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [dplyr-select, dplyr-filter, dplyr-arrange-mutate]
  see_also: [milk-chocolate-survey, milk-survey-compact, positron]
status: draft
updated: 2026-11-09
---

## Aufgabe

Die [[milk-chocolate-survey|Umfrage zu Milch und Schokolade]] kommt als eine
Datei mit 2.811 Zeilen und 606 Spalten, deren Namen Codes aus dem Fragebogen
sind und deren Werte meist Zahlen, deren Bedeutung nur das Codebuch kennt.
Für die Auswertung brauchst du davon 21 Spalten mit Namen, die man lesen
kann, und Wörter statt Codes. Genau diese Tabelle ist der
[[milk-survey-compact|kompakte Datensatz]], und in dieser Übung baust du sie
selbst. Du arbeitest in [[positron|Positron]] auf deinem Rechner, weil die
Rohdaten für den Browser zu groß sind, und schreibst alle Schritte in ein
Skript, damit du sie jederzeit wiederholen kannst.

1. Lege in Positron einen Projektordner an, lade die Datei
   `mds12_schoko_milch.csv` von der Seite der
   [[milk-chocolate-survey|Umfrage]] herunter und lege sie in diesen Ordner.
   Lade sie mit `read_csv()` in eine Tabelle `raw` und sieh sie dir mit
   `dim()` und `glimpse()` an.
2. Zähle mit `count()`, welche Werte in `q004geschlecht` vorkommen, und
   behalte mit `filter()` nur die Personen mit 1 (männlich) oder 2
   (weiblich). Die zwei Personen, die „divers“ angegeben haben, sind für eine
   Auswertung zu wenige und wären in den Daten leicht wiederzuerkennen.
3. Wähle mit `select()` die Spalten der folgenden Tabelle aus und gib ihnen
   im selben Schritt ihren neuen Namen, nach dem Muster `neu = alt`.
4. Übersetze mit `mutate()` und `factor()` die Zahlencodes von `gender`,
   `state`, `town_size`, `diet`, `milk_freq` und `tiktok` in Wörter.
5. Bilde mit `mutate()` die übrigen Spalten: `price_too_expensive` aus den
   beiden Preisspalten, `shops_discounter` und `shops_organic` als `TRUE` oder
   `FALSE`, einen korrigierten Markennamen in `rated_brand` und eine laufende
   Nummer `id`. Bring die Spalten danach mit `select()` in die Reihenfolge des
   kompakten Datensatzes.
6. Speichere die Tabelle mit `write_csv()` als `milk_survey_compact.csv` und
   mit `saveRDS()` als `milk_survey_compact.rds`. Lies beide Dateien wieder
   ein und vergleiche sie mit `glimpse()` und mit `count(diet)`.

Diese Spalten brauchst du, mit ihrem Namen in den Rohdaten:

| neuer Name | Spalte in den Rohdaten | was darin steht |
|---|---|---|
| `age` | `Q002alter` | Alter in Jahren |
| `gender` | `q004geschlecht` | 1 männlich, 2 weiblich |
| `state` | `q003land` | Bundesland, 1 bis 16 in alphabetischer Reihenfolge |
| `town_size` | `d044stadt` | Größe des Wohnorts, 1 Großstadt bis 6 Dorf |
| `household_size` | `d042hhzahl` | Personen im Haushalt |
| `diet` | `v041nofleisch` | Ernährungsweise, 0 bis 4 |
| `organic_share` | `v032bioanteil` | Bio-Anteil am Einkauf, 1 bis 5 |
| `milk_freq` | `v007freq3_mi` | wie oft Milch getrunken wird, 4 täglich bis 1 selten |
| `milk_brand` | `AB1619pvonw2f` | Preisexperiment: gezeigte Marke |
| `price_weihenstephan` | `u017pvonwzuteuer1` | zu teuer ab … Euro, wenn Weihenstephan gezeigt wurde |
| `price_alpro` | `u017pvonwzuteuer2` | zu teuer ab … Euro, wenn alpro gezeigt wurde |
| `shops_discounter` | `v008ort_1discount` | kauft beim Discounter ein, 1 oder 0 |
| `shops_organic` | `v008ort_7bioladen` | kauft im Bioladen ein, 1 oder 0 |
| `eco_conscious` | `p030green_5umweltbewusst` | „umweltbewusst“, −2 bis +2 |
| `prefers_organic` | `p031bio_1lieberbio` | „bevorzuge Bio“, −2 bis +2 |
| `loves_meat` | `p033meat_1fan` | „liebe Fleisch“, −2 bis +2 |
| `loves_cooking` | `p035koch_2hobby` | „liebe Kochen“, −2 bis +2 |
| `rated_brand` | `AX010midiff7f` | Markenexperiment: gezeigte Marke |
| `brand_quality` | `B010midiff7_1quali` | Qualität dieser Marke, −2 bis +2 |
| `brand_buy` | `B010midiff7_14kauf` | würde diese Marke kaufen, −2 bis +2 |
| `tiktok` | `d216medien_18tiktok` | TikTok-Nutzung, 4 täglich bis 0 nie |

## So soll es aussehen

Am Ende von Schritt 5 zeigt `glimpse(survey)` diese Tabelle:

```text
Rows: 2,809
Columns: 21
$ id                  <int> 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,…
$ age                 <dbl> 55, 35, 62, 36, 60, 68, 65, 41, 51, 71, 64…
$ gender              <fct> male, male, male, female, male, male, fema…
$ state               <fct> Baden-Württemberg, Hessen, Hamburg, Sachse…
$ town_size           <fct> very small town, city, city, city, city, t…
$ household_size      <dbl> 1, 2, 1, 1, 1, 2, 1, 5, 2, 1, 1, 2, 1, 2, …
$ diet                <fct> omnivore, omnivore, omnivore, flexitarian,…
$ organic_share       <dbl> 1, 2, 3, 2, 1, 2, 2, 2, 2, 3, 1, 3, 2, 3, …
$ milk_freq           <fct> rarely, daily, NA, monthly, daily, daily, …
$ milk_brand          <chr> NA, NA, NA, NA, NA, NA, NA, "alpro", NA, N…
$ price_too_expensive <dbl> NA, NA, NA, NA, NA, NA, NA, 2.99, NA, NA, …
$ shops_discounter    <lgl> TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, …
$ shops_organic       <lgl> FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, …
$ eco_conscious       <dbl> 0, 0, 2, 1, 2, 0, 0, 2, 2, 2, -1, 1, 1, 2,…
$ prefers_organic     <dbl> -2, 2, 2, 1, -1, 0, 0, 1, 0, 1, -2, 0, -1,…
$ loves_meat          <dbl> 0, 2, 2, -1, 2, 1, 0, 0, 1, 1, 2, 2, 2, 1,…
$ loves_cooking       <dbl> -2, -1, 0, 0, 0, 1, 2, 1, -2, 0, 0, 1, 1, …
$ rated_brand         <chr> "Weihenstephan", "Berchtesgadener Land", N…
$ brand_quality       <dbl> 1, 0, NA, 1, 1, 0, 0, 2, 2, NA, 0, 0, NA, …
$ brand_buy           <dbl> -1, 1, NA, NA, -2, 0, -1, 1, 2, NA, -2, 0,…
$ tiktok              <fct> NA, NA, NA, NA, NA, NA, NA, NA, NA, NA, NA…
```

## Dein Code

Schreib den Code in ein Skript in deinem Projektordner, etwa
`compact-survey.R`. Das Gerüst zeigt die Schritte, die Lücken füllst du:

```r static
library(tidyverse)

# 1. Laden und ansehen
raw <- read_csv("mds12_schoko_milch.csv")
dim(raw)
glimpse(raw)

# 2. Nur männlich und weiblich
raw |>
  count()

# 3. bis 5. Auswählen, umbenennen, übersetzen, neu bilden
survey <- raw |>
  filter() |>
  select(
    age = Q002alter,
    gender = q004geschlecht
    # … die übrigen Spalten der Tabelle
  ) |>
  mutate(
    gender = factor(gender, levels = 1:2, labels = c("male", "female"))
    # … die übrigen Übersetzungen und neuen Spalten
  ) |>
  select()

glimpse(survey)

# 6. Speichern und vergleichen
write_csv(survey, "milk_survey_compact.csv")
saveRDS(survey, "milk_survey_compact.rds")
```

> [!HINT]
> `glimpse()` zeigt bei 606 Spalten eine sehr lange Ausgabe. Für den ersten
> Blick genügt oft `glimpse(raw[, 1:20])`, das nur die ersten 20 Spalten
> zeigt. Zur Kontrolle: `dim(raw)` liefert 2811 und 606, und `count()` findet
> in `q004geschlecht` 1.328 Männer, 1.481 Frauen und zwei Personen mit dem
> Wert 3.

> [!HINT]
> `factor()` macht aus einer Spalte eine mit festen Stufen. `levels` nennt
> die Codes in der Reihenfolge, die die Stufen haben sollen, und `labels` die
> Wörter dafür, in derselben Reihenfolge:
>
> ```r static
> diet = factor(
>   diet,
>   levels = 0:4,
>   labels = c("omnivore", "flexitarian", "vegetarian", "vegan", "pescetarian")
> )
> ```
>
> Bei `milk_freq` und `tiktok` stehen die großen Codes für häufig, deshalb
> beginnt `levels` dort mit der größten Zahl, also `4:1` und `4:0`. Die
> Wörter für `town_size` sind `city`, `large town`, `town`, `small town`,
> `very small town` und `village`, für `milk_freq` `daily`, `weekly`,
> `monthly` und `rarely`, und bei `tiktok` kommt `never` dazu. Die 16
> Bundesländer schreibst du am besten vorher in einen Vektor `states`.

> [!HINT]
> Wer im Preisexperiment Weihenstephan sah, hat seinen Preis in
> `price_weihenstephan`, wer alpro sah, in `price_alpro`. `case_when()`
> wählt je Zeile die passende Spalte. Aus einer Spalte mit 1 und 0 wird mit
> `shops_discounter == 1` eine mit `TRUE` und `FALSE`. In `rated_brand`
> steht 316-mal der Tippfehler „Berchtesgardener Land“, den `if_else()`
> durch „Berchtesgadener Land“ ersetzt. `row_number()` liefert die laufende
> Nummer, und im letzten `select()` übernimmt `shops_discounter:tiktok` alle
> Spalten von der einen bis zur anderen.

> [!SOLUTION]
> ```r static
> library(tidyverse)
>
> raw <- read_csv("mds12_schoko_milch.csv")
> dim(raw)
>
> raw |>
>   count(q004geschlecht)
>
> states <- c(
>   "Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen",
>   "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen",
>   "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen",
>   "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"
> )
>
> survey <- raw |>
>   filter(q004geschlecht %in% c(1, 2)) |>
>   select(
>     age = Q002alter,
>     gender = q004geschlecht,
>     state = q003land,
>     town_size = d044stadt,
>     household_size = d042hhzahl,
>     diet = v041nofleisch,
>     organic_share = v032bioanteil,
>     milk_freq = v007freq3_mi,
>     milk_brand = AB1619pvonw2f,
>     price_weihenstephan = u017pvonwzuteuer1,
>     price_alpro = u017pvonwzuteuer2,
>     shops_discounter = v008ort_1discount,
>     shops_organic = v008ort_7bioladen,
>     eco_conscious = p030green_5umweltbewusst,
>     prefers_organic = p031bio_1lieberbio,
>     loves_meat = p033meat_1fan,
>     loves_cooking = p035koch_2hobby,
>     rated_brand = AX010midiff7f,
>     brand_quality = B010midiff7_1quali,
>     brand_buy = B010midiff7_14kauf,
>     tiktok = d216medien_18tiktok
>   ) |>
>   mutate(
>     id = row_number(),
>     gender = factor(gender, levels = 1:2, labels = c("male", "female")),
>     state = factor(state, levels = 1:16, labels = states),
>     town_size = factor(
>       town_size,
>       levels = 1:6,
>       labels = c("city", "large town", "town", "small town", "very small town", "village")
>     ),
>     diet = factor(
>       diet,
>       levels = 0:4,
>       labels = c("omnivore", "flexitarian", "vegetarian", "vegan", "pescetarian")
>     ),
>     milk_freq = factor(
>       milk_freq,
>       levels = 4:1,
>       labels = c("daily", "weekly", "monthly", "rarely")
>     ),
>     tiktok = factor(
>       tiktok,
>       levels = 4:0,
>       labels = c("daily", "weekly", "monthly", "rarely", "never")
>     ),
>     price_too_expensive = case_when(
>       milk_brand == "Weihenstephan" ~ price_weihenstephan,
>       milk_brand == "alpro" ~ price_alpro
>     ),
>     shops_discounter = shops_discounter == 1,
>     shops_organic = shops_organic == 1,
>     rated_brand = if_else(rated_brand == "Berchtesgardener Land", "Berchtesgadener Land", rated_brand)
>   ) |>
>   select(
>     id, age, gender, state, town_size, household_size, diet,
>     organic_share, milk_freq, milk_brand, price_too_expensive,
>     shops_discounter:tiktok
>   )
>
> glimpse(survey)
>
> write_csv(survey, "milk_survey_compact.csv")
> saveRDS(survey, "milk_survey_compact.rds")
>
> from_csv <- read_csv("milk_survey_compact.csv")
> from_rds <- readRDS("milk_survey_compact.rds")
>
> from_csv |>
>   count(diet)
>
> from_rds |>
>   count(diet)
> ```
>
> Aus der CSV-Datei kommt `diet` als Text zurück, und `count()` sortiert die
> Ernährungsweisen alphabetisch, von `flexitarian` bis `vegetarian`. Aus der
> RDS-Datei kommt sie als Faktor zurück, und `count()` hält die Reihenfolge
> der Stufen ein, die du festgelegt hast, von `omnivore` bis `pescetarian`.
> Eine CSV-Datei ist einfacher Text, den jedes Programm lesen kann, aber sie
> kennt keine Typen; die RDS-Datei kann nur R lesen, dafür bewahrt sie die
> Tabelle genau so, wie du sie gebaut hast. Nebenbei ist sie mit 35 kB nicht
> einmal ein Achtel so groß wie die CSV-Datei mit 296 kB, und die Rohdaten
> hatten noch 4,9 MB.

## Für Schnelle

Die Spalten `price_weihenstephan` und `price_alpro` sind im Ergebnis nicht
mehr enthalten, weil sie in `price_too_expensive` aufgegangen sind. Prüfe
mit `count(milk_brand, is.na(price_too_expensive))`, ob jede Person, die eine
Marke gesehen hat, auch einen Preis genannt hat. Lege danach mit `mutate()`
eine Spalte `age_group` als Faktor mit den Stufen `18-29`, `30-49`, `50-64`
und `65+` an, wie in der Lektion [[dplyr-arrange-mutate]], und speichere die
Tabelle erneut als RDS: Liest du sie wieder ein, stehen die Altersgruppen in
der richtigen Reihenfolge und nicht alphabetisch.
