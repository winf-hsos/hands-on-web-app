---
type: lesson
code: 1304
formerly: [dplyr-arrange-mutate]
title: Spalten berechnen mit mutate()
summary: >-
  Mit `mutate()` berechnest du neue Spalten aus vorhandenen, bildest mit
  `if_else()` und `case_when()` Gruppen wie Altersklassen und rechnest mit
  `group_by()` innerhalb jeder Gruppe, ohne dass eine Zeile verloren geht.
objectives:
  intro: "In dieser Lektion lernst du, mit `mutate()` neue Spalten zu berechnen, und kannst danach:"
  goals:
    - "mit `mutate()` eine neue Spalte aus vorhandenen berechnen, eine Spalte überschreiben und mehrere Spalten in einem Schritt anlegen, die aufeinander aufbauen"
    - "mit `if_else()` zwei Fälle unterscheiden und mit `case_when()` aus einer Zahl Gruppen wie Altersklassen bilden"
    - "mit `group_by()` und `mutate()` für jede Zeile einen Wert ihrer Gruppe berechnen, etwa den Mittelwert, und die Gruppierung mit `ungroup()` wieder auflösen"
    - "erklären, warum `mutate()` die Tabelle `survey` nicht verändert und wie du ein Ergebnis mit `<-` behältst"
level: 1
duration: 25
topics: [transforming-data, programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [dplyr-arrange]
status: published
updated: 2026-11-09
---

`select()`, `filter()` und `arrange()` arbeiten mit den Spalten, die eine
Tabelle schon hat. `mutate()` fügt neue hinzu, die du aus den vorhandenen
berechnest, und lässt dabei alle Zeilen stehen.

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
das Ergebnis die alte Spalte. So lassen sich die unplausiblen Preise durch
fehlende Werte ersetzen, ohne dass die Personen aus der Tabelle verschwinden,
wie es mit `filter()` geschähe:

```r
survey |>
  mutate(
    price_too_expensive = if_else(price_too_expensive > 10, NA, price_too_expensive)
  ) |>
  filter(!is.na(milk_brand)) |>
  select(id, milk_brand, price_too_expensive)
```

Das `filter()` am Ende zeigt nur die 611 Personen, die die Preisfrage
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
> Wert von `.default`. Teilst du Preise so in Klassen ein, landen alle 2.198
> Personen ohne Preisangabe in der letzten Klasse. Filtere sie vorher heraus
> oder fang sie mit einem ersten Fall `is.na(price_too_expensive) ~ NA` ab.

## Rechnen innerhalb von Gruppen

Bisher hat `mutate()` jede Zeile für sich berechnet. Manche Rechnungen
brauchen aber die anderen Zeilen derselben Gruppe, etwa wenn du wissen
willst, ob eine Person älter oder jünger ist als der Durchschnitt ihrer
Ernährungsweise. Dafür stellst du `group_by()` vor das `mutate()`:

```r
survey |>
  group_by(diet) |>
  mutate(
    mean_age_diet = mean(age),
    age_diff = age - mean_age_diet
  ) |>
  select(id, diet, age, mean_age_diet, age_diff)
```

`group_by()` ändert an den Daten nichts Sichtbares, merkt sich aber, welche
Zeilen zusammengehören, und die Ausgabe zeigt das in der Zeile
`# Groups: diet [6]`: sechs Gruppen, die fünf Ernährungsweisen und die
Personen ohne Angabe. `mean(age)` rechnet danach in jeder Gruppe für sich,
sodass alle Omnivoren den Wert 48,8 bekommen und alle Flexitarier 49,3. Die
Tabelle behält dabei alle 2.809 Zeilen, und `age_diff` sagt für jede Person,
wie weit sie vom Mittel ihrer Gruppe abweicht: Person 2 ist mit 35 Jahren
13,8 Jahre jünger als die Omnivoren im Mittel.

## Die Gruppierung wieder auflösen

Die Gruppierung bleibt an der Tabelle hängen, auch nach dem `mutate()`, und
jedes weitere Verb arbeitet ebenfalls je Gruppe. `slice_max()` aus der
Lektion [[dplyr-arrange]] liefert dann nicht die älteste Person insgesamt,
sondern die älteste jeder Ernährungsweise; `with_ties = FALSE` sorgt dafür,
dass es auch bei Gleichstand bei einer Person je Gruppe bleibt:

```r
survey |>
  group_by(diet) |>
  slice_max(age, n = 1, with_ties = FALSE) |>
  select(id, diet, age)
```

Das ist praktisch, wenn du es willst, und eine Falle, wenn du es vergisst.
Brauchst du die Gruppen nicht mehr, löst `ungroup()` sie auf. Hier zählt
`n()` zuerst in jeder Gruppe, wie viele Personen eine Ernährungsweise hat,
und nach dem `ungroup()` behält `filter()` nur die Ernährungsweisen mit
mindestens 100 Personen:

```r
survey |>
  group_by(diet) |>
  mutate(n_diet = n()) |>
  ungroup() |>
  filter(n_diet >= 100) |>
  select(id, diet, n_diet)
```

Es bleiben die 2.709 Omnivoren, Flexitarier und Vegetarier, während die je
36 vegan und pescetarisch lebenden Personen und die 28 ohne Angabe
herausfallen. Wie du mit `group_by()` jede Gruppe zu einer einzigen Zeile
zusammenfasst, statt alle Zeilen zu behalten, zeigt die Lektion
[[dplyr-summarize]].

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

- `mutate(name = Rechnung)` legt eine Spalte an oder überschreibt eine
  vorhandene, und in einem `mutate()` kann eine Spalte auf der vorigen
  aufbauen.
- `if_else()` unterscheidet zwei Fälle, `case_when()` beliebig viele, die es
  von oben nach unten prüft; ein `NA` landet dort bei `.default`.
- Mit `group_by()` davor rechnet `mutate()` je Gruppe, etwa einen
  Gruppenmittelwert, und behält dabei alle Zeilen; `ungroup()` löst die
  Gruppierung wieder auf.
- Ein Ergebnis bleibt nur, wenn du es weiterreichst oder mit `<-` speicherst.
