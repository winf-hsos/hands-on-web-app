---
type: lesson
code: 1304
title: Zeilen sortieren und Spalten berechnen mit arrange() und mutate()
summary: >-
  Mit `arrange()` bringst du die Zeilen einer Tabelle in eine Reihenfolge, mit
  `mutate()` berechnest du neue Spalten aus vorhandenen, bis hin zu Gruppen
  wie Altersklassen mit `if_else()` und `case_when()`.
objectives:
  intro: "In dieser Lektion lernst du, Zeilen mit `arrange()` zu sortieren und mit `mutate()` neue Spalten zu berechnen, und kannst danach:"
  goals:
    - "Zeilen mit `arrange()` aufsteigend, mit `desc()` absteigend und nach mehreren Spalten sortieren und sagen, wo fehlende Werte dabei landen"
    - "mit `slice_head()` und `slice_max()` nur die ersten oder die größten Zeilen einer Tabelle behalten"
    - "mit `mutate()` eine neue Spalte aus vorhandenen berechnen, eine Spalte überschreiben und mehrere Spalten in einem Schritt anlegen, die aufeinander aufbauen"
    - "mit `if_else()` zwei Fälle unterscheiden und mit `case_when()` aus einer Zahl Gruppen wie Altersklassen bilden"
    - "erklären, warum `mutate()` die Tabelle `survey` nicht verändert und wie du ein Ergebnis mit `<-` behältst"
level: 1
duration: 25
topics: [transforming-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [dplyr-filter]
status: published
updated: 2026-11-09
---

`select()` und `filter()` machen eine Tabelle kleiner, weil sie nur einen Teil
der Spalten oder der Zeilen behalten. Die beiden Verben dieser Lektion lassen
dagegen alle Zeilen stehen: `arrange()` ändert nur ihre Reihenfolge, und
`mutate()` fügt neue Spalten hinzu, die du aus den vorhandenen berechnest.

## Zeilen sortieren

`arrange()` sortiert die Zeilen nach den Werten einer Spalte, und zwar
aufsteigend, also die kleinste Zahl zuerst. Damit die Ausgabe übersichtlich
bleibt, behält ein `select()` danach nur vier Spalten:

```r
survey |>
  arrange(age) |>
  select(id, age, gender, diet)
```

Oben stehen jetzt die jüngsten Befragten. Texte sortiert `arrange()`
alphabetisch, sodass `arrange(diet)` die Zeilen mit `flexitarian` vor die mit
`omnivore` stellt.

## Absteigend mit `desc()`

Für die umgekehrte Reihenfolge legst du `desc()` um den Spaltennamen, kurz
für *descending*, absteigend. Dann stehen die ältesten Befragten oben:

```r
survey |>
  arrange(desc(age)) |>
  select(id, age, gender, diet)
```

## Nach mehreren Spalten

Nennst du mehrere Spalten, sortiert `arrange()` zuerst nach der ersten und
zieht die nächste nur heran, wo die erste gleich ist. Hier stehen die
Ernährungsweisen alphabetisch und innerhalb jeder Ernährungsweise die
Ältesten vorn:

```r
survey |>
  arrange(diet, desc(age)) |>
  select(id, diet, age, gender)
```

## Wohin die fehlenden Werte kommen

Bei der Preisfrage fehlt für die meisten Befragten ein Wert, weil sie die
Frage nie gesehen haben. `arrange()` stellt Zeilen mit `NA` immer ans Ende,
ob du aufsteigend oder absteigend sortierst:

```r
survey |>
  arrange(desc(price_too_expensive)) |>
  select(id, milk_brand, price_too_expensive)
```

Absteigend sortiert ist das zugleich ein schneller Weg zu Ausreißern: Die
160 Euro für einen Liter Milch, die du aus der Lektion [[dplyr-filter]]
kennst, stehen ganz oben.

## Die ersten oder größten Zeilen

Oft interessieren nach dem Sortieren nur die ersten Zeilen. `slice_head()`
behält so viele, wie du mit `n` angibst, in der Reihenfolge, in der die
Tabelle gerade steht:

```r
survey |>
  arrange(desc(age)) |>
  slice_head(n = 3) |>
  select(id, age, gender, diet)
```

`slice_max()` erledigt Sortieren und Abschneiden in einem Schritt und
behält die Zeilen mit den größten Werten einer Spalte; `slice_min()` behält
die mit den kleinsten. Teilen sich mehrere Zeilen den letzten Platz, liefert
es alle davon, auch wenn es dann mehr als `n` werden:

```r
survey |>
  slice_max(price_too_expensive, n = 3) |>
  select(id, milk_brand, price_too_expensive)
```

## Eine neue Spalte berechnen

`mutate()` fügt der Tabelle eine Spalte hinzu. Links vom Gleichheitszeichen
steht der Name der neuen Spalte, rechts die Rechnung, in der du die
vorhandenen Spalten verwendest. Die Umfrage lief im November 2025, und so
ergibt sich das ungefähre Geburtsjahr jeder befragten Person:

```r
survey |>
  mutate(birth_year = 2025 - age) |>
  select(id, age, birth_year)
```

R rechnet dabei mit der ganzen Spalte auf einmal, wie du es aus der Lektion
[[r-vectors]] kennst, und `2025 - age` liefert für jede Zeile ein eigenes
Ergebnis. Ungefähr ist das Geburtsjahr, weil die Daten nicht verraten, ob
jemand im November schon Geburtstag hatte. Die neue Spalte steht am Ende der
Tabelle, und deshalb holt das `select()` sie in die Ausgabe.

## Mehrere Spalten auf einmal

In einem `mutate()` kannst du mehrere Spalten anlegen, durch Kommas getrennt,
und eine Spalte, die du gerade berechnet hast, steht für die nächste schon
bereit. Hier wird aus dem Geburtsjahr das Jahrzehnt, in dem jemand geboren
ist: `birth_year / 10` macht aus 1969 die 196,9, `floor()` rundet sie auf 196
ab, und mal zehn ergibt das 1960.

```r
survey |>
  mutate(
    birth_year = 2025 - age,
    birth_decade = floor(birth_year / 10) * 10
  ) |>
  select(id, age, birth_year, birth_decade)
```

## Zwei Fälle mit `if_else()`

Oft soll eine neue Spalte keine Zahl enthalten, sondern sagen, zu welcher
Gruppe eine Zeile gehört. `if_else()` prüft eine Bedingung und liefert für
jede Zeile den ersten Wert, wenn sie zutrifft, und sonst den zweiten:

```r
survey |>
  mutate(age_group = if_else(age < 50, "under 50", "50 and over")) |>
  select(id, age, age_group)
```

## Eine Spalte überschreiben

Gibst du einer Spalte in `mutate()` einen Namen, den es schon gibt, ersetzt
das Ergebnis die alte Spalte. So lässt sich der unplausible Preis durch einen
fehlenden Wert ersetzen, ohne dass die Person aus der Tabelle verschwindet,
wie es mit `filter()` geschähe:

```r
survey |>
  mutate(
    price_too_expensive = if_else(price_too_expensive > 10, NA, price_too_expensive)
  ) |>
  filter(!is.na(milk_brand)) |>
  select(id, milk_brand, price_too_expensive)
```

Das `filter()` am Ende zeigt nur die neun Personen, die die Preisfrage
gesehen haben. Bei allen anderen ist schon die Bedingung
`price_too_expensive > 10` unbekannt, und `if_else()` gibt dann ebenfalls
`NA` zurück, sodass ein fehlender Wert fehlend bleibt. Ob du einen Wert so
ersetzt oder die Zeile weglässt, hängt von der Frage ab: Für einen mittleren
Preis kommt beides auf dasselbe hinaus, wer aber zählen will, wie viele
Personen die Marke alpro gesehen haben, braucht die Zeile noch.

## Gruppen bilden mit `case_when()`

Für mehr als zwei Gruppen wird eine Kette aus `if_else()` schnell
unleserlich. `case_when()` nimmt beliebig viele Fälle in der Form
`Bedingung ~ Wert`, und `.default` legt fest, was gilt, wenn keine Bedingung
zutrifft. So teilst du das Alter in vier Altersgruppen ein:

```r
survey |>
  mutate(
    age_group = case_when(
      age < 30 ~ "18-29",
      age < 50 ~ "30-49",
      age < 65 ~ "50-64",
      .default = "65+"
    )
  ) |>
  select(id, age, age_group)
```

`case_when()` prüft die Fälle für jede Zeile von oben nach unten und nimmt
den ersten, der zutrifft. Deshalb genügt in der zweiten Zeile `age < 50`,
denn wer jünger als 30 ist, hat seine Gruppe schon in der ersten Zeile
bekommen. Vertausch einmal die ersten beiden Fälle und sieh nach, wo die
26-Jährigen dann landen.

> [!WARNING]
> Ein fehlender Wert erfüllt keine der Bedingungen und bekommt deshalb den
> Wert von `.default`. Teilst du Preise so in Klassen ein, landen alle 21
> Personen ohne Preisangabe in der letzten Klasse. Filtere sie vorher heraus
> oder fang sie mit einem ersten Fall `is.na(price_too_expensive) ~ NA` ab.

## Das Ergebnis behalten

`mutate()` verändert `survey` nicht, sondern liefert eine neue Tabelle, die R
ausgibt und danach vergisst. Willst du mit einer neuen Spalte weiterarbeiten,
hängst du die nächsten Verben an dieselbe Pipe oder legst das Ergebnis mit
`<-` unter einem eigenen Namen ab, wie hier, um danach nach der neuen Spalte
zu sortieren:

```r
survey_groups <- survey |>
  mutate(age_group = if_else(age < 50, "under 50", "50 and over"))

survey_groups |>
  arrange(age_group, age) |>
  select(id, age, age_group)
```

Den Namen `survey` selbst zu überschreiben ist möglich, aber selten eine gute
Idee, weil danach niemand mehr sieht, wie die Tabelle ursprünglich aussah.

## Zum Mitnehmen

- `arrange()` sortiert Zeilen aufsteigend, `desc()` dreht die Reihenfolge
  um, und weitere Spalten entscheiden bei Gleichstand; fehlende Werte landen
  immer am Ende.
- `slice_head()` behält die ersten Zeilen, `slice_max()` und `slice_min()`
  die mit den größten oder kleinsten Werten einer Spalte.
- `mutate(name = Rechnung)` legt eine Spalte an oder überschreibt eine
  vorhandene, und in einem `mutate()` kann eine Spalte auf der vorigen
  aufbauen.
- `if_else()` unterscheidet zwei Fälle, `case_when()` beliebig viele, die es
  von oben nach unten prüft; ein `NA` landet dort bei `.default`.
- Ein Ergebnis bleibt nur, wenn du es weiterreichst oder mit `<-` speicherst.
