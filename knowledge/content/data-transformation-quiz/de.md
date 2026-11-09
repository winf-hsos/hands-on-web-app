---
type: quiz
code: 6400
title: "Quiz: Daten transformieren"
summary: >-
  Zwölf Fragen zu den Grundoperationen, Tidy Data, den Verben von dplyr
  und fehlenden Werten, jede mit ihrer Begründung.
level: 1
duration: 15
topics: [transforming-data]
modules: [ea]
areas: [ds]
relations:
  checks: [data-transformation-basics, tidy-data, dplyr-select, dplyr-filter, dplyr-arrange, dplyr-mutate, dplyr-summarize]
questions: [hds-001, hds-002, hds-003, hds-004, hds-005, hds-006, hds-007, hds-008, hds-009, hds-010, hds-011, hds-012]
status: published
updated: 2026-11-09
---

## Du willst nur die Befragten aus Bayern betrachten. Welche Operation brauchst du? {#hds-001}

- [ ] Spalten auswählen
  > Spalten auswählen ändert, welche Merkmale du siehst, aber nicht, um welche Personen es geht.
- [x] Zeilen filtern
  > Richtig: Jede Person ist eine Zeile, und du willst eine Teilmenge dieser Zeilen behalten.
- [ ] Zusammenfassen
  > Zusammenfassen macht aus vielen Zeilen eine, etwa einen Mittelwert; die Bayern wären danach nicht mehr einzeln zu sehen.
- [ ] Sortieren
  > Sortieren bringt die Bayern vielleicht nach oben, behält aber alle anderen Zeilen.

> Um wen oder was es geht, entscheidet das Filtern der Zeilen; welche Spalten du danach brauchst, ist eine zweite Frage.

## Welche Operation macht aus allen Zeilen einer Tabelle immer genau eine? {#hds-002}

- [ ] `filter()` mit einer Bedingung
  > `filter()` kann zufällig genau eine Zeile übrig lassen, aber je nach Bedingung auch keine oder alle.
- [ ] `arrange()` nach einer Spalte
  > `arrange()` ändert nur die Reihenfolge, die Zahl der Zeilen bleibt gleich.
- [x] `summarize()` ohne `group_by()`
  > Richtig: `summarize()` fasst alle Zeilen zu einer zusammen, etwa zu einem Mittelwert und einer Anzahl; mit `group_by()` davor entsteht eine Zeile je Gruppe.
- [ ] `mutate()` mit einer neuen Spalte
  > `mutate()` berechnet für jede Zeile einen neuen Wert und behält alle Zeilen.

## Eine Tabelle hat die Spalten `id`, `price_2024` und `price_2025`. Was daran ist nicht tidy? {#hds-003}

- [ ] In einer Zelle stehen mehrere Werte.
  > Jede Zelle enthält hier genau einen Preis; das Problem liegt in den Spaltennamen.
- [x] Das Jahr ist eine Variable, steckt aber in den Spaltennamen.
  > Richtig: Tidy wären die Spalten `id`, `year` und `price` mit zwei Zeilen je `id`, dann lässt sich nach dem Jahr filtern und gruppieren wie nach jeder anderen Variable.
- [ ] Die Tabelle hat zu wenige Zeilen.
  > Die Zahl der Zeilen sagt nichts darüber, ob eine Tabelle tidy ist; entscheidend ist, ob jede Variable eine eigene Spalte hat.
- [ ] Die Spaltennamen sind englisch.
  > Die Sprache der Namen spielt für Tidy Data keine Rolle, solange jede Spalte genau eine Variable enthält.

## Was liefert `survey |> select(id, starts_with("milk"))`? (Mehrere richtige Antworten möglich.) {#hds-004}

- [x] alle 2.809 Zeilen
  > Richtig: `select()` wählt Spalten und ändert nie die Zahl der Zeilen.
- [x] die Spalte `id`
  > Richtig: `id` steht als erster Name in `select()` und bleibt deshalb vorne.
- [x] die Spalten `milk_freq` und `milk_brand`
  > Richtig: `starts_with("milk")` wählt alle Spalten, deren Name mit `milk` beginnt.
- [ ] nur Zeilen, in denen eine Milchsorte angegeben ist
  > Nach Zeilen fragt `filter()`, nicht `select()`; fehlende Werte bleiben hier als `NA` stehen.

## Warum liefert `survey |> filter(milk_freq == NA)` keine einzige Zeile? {#hds-005}

- [ ] Weil in `milk_freq` keine Werte fehlen
  > Es fehlen sehr wohl Werte; `filter(is.na(milk_freq))` findet sie.
- [x] Weil ein Vergleich mit `NA` wieder `NA` ergibt
  > Richtig: R weiß nicht, ob ein unbekannter Wert gleich einem anderen unbekannten ist, und `filter()` behält nur Zeilen, in denen die Bedingung `TRUE` ist; nach fehlenden Werten fragt man deshalb mit `is.na()`.
- [ ] Weil man `NA` in Anführungszeichen schreiben muss
  > `"NA"` in Anführungszeichen wäre ein Text aus zwei Buchstaben und kein fehlender Wert.
- [ ] Weil `filter()` keine Vergleiche mit `==` erlaubt
  > `filter()` arbeitet ständig mit `==`, etwa `filter(diet == "vegan")`; nur der Vergleich mit `NA` führt ins Leere.

## Welche Zeilen behält `filter(diet %in% c("vegan", "vegetarian"), age < 50)`? {#hds-006}

- [ ] alle, die vegan oder vegetarisch sind, und zusätzlich alle unter 50
  > Das wäre ein „oder“ zwischen den Bedingungen, also `|`; das Komma verlangt beide.
- [x] nur die, die vegan oder vegetarisch sind und zugleich jünger als 50
  > Richtig: Das Komma verbindet Bedingungen mit „und“, und `%in%` prüft, ob der Wert eine der beiden Ernährungsweisen ist.
- [ ] nur die, die vegan und vegetarisch zugleich sind
  > `%in%` fragt, ob der Wert in der Liste vorkommt, also das eine oder das andere; eine Person hat in `diet` ohnehin nur einen Wert.
- [ ] keine, weil sich `%in%` nicht mit einer zweiten Bedingung kombinieren lässt
  > `%in%` liefert wie jeder Vergleich `TRUE` oder `FALSE` und lässt sich deshalb frei mit weiteren Bedingungen verbinden.

## Was liefert `survey |> arrange(desc(age))`? {#hds-007}

- [x] alle Zeilen, die älteste Person zuerst
  > Richtig: `arrange()` sortiert die ganzen Zeilen, und `desc()` dreht die Reihenfolge um, sodass das höchste Alter oben steht.
- [ ] nur die Zeile der ältesten Person
  > `arrange()` behält alle Zeilen; die älteste Person allein liefert etwa `slice_max(age)`.
- [ ] die Spalte `age` absteigend sortiert, die übrigen Spalten in alter Reihenfolge
  > Eine Zeile bleibt beim Sortieren immer zusammen, sonst gehörte das Alter danach zu einer anderen Person.
- [ ] alle Zeilen, die jüngste Person zuerst
  > So sortiert `arrange(age)` ohne `desc()`, also aufsteigend.

## Was liefert `survey |> mutate(age_months = age * 12)`? {#hds-008}

- [x] alle Zeilen und Spalten von `survey` und dazu die Spalte `age_months`
  > Richtig: `mutate()` berechnet für jede Zeile einen Wert und hängt ihn als neue Spalte an; Zeilen und übrige Spalten bleiben.
- [ ] `survey`, in dem die Spalte `age` durch das Alter in Monaten ersetzt ist
  > Überschrieben würde `age` nur mit `mutate(age = age * 12)`; ein neuer Name ergibt eine neue Spalte.
- [ ] nur die Spalte `age_months`
  > `mutate()` behält alle Spalten; nur die neue zu sehen, verlangt danach ein `select()`.
- [ ] eine einzige Zeile mit dem Alter in Monaten
  > Aus vielen Zeilen eine macht `summarize()`; `mutate()` rechnet Zeile für Zeile.

## `survey |> summarize(mean_price = mean(price_too_expensive))` liefert `NA`. Woran liegt das? {#hds-009}

- [x] In der Spalte fehlen Werte, und ohne `na.rm = TRUE` ist dann auch der Mittelwert `NA`.
  > Richtig: Die meisten Befragten haben die Preisfrage nie gesehen, und ein Mittelwert über unbekannte Werte ist selbst unbekannt; `mean(price_too_expensive, na.rm = TRUE)` lässt sie weg.
- [ ] `summarize()` kann nur zählen, nicht mitteln.
  > In `summarize()` steht jede Funktion, die viele Werte zu einem macht, etwa `mean()`, `median()` oder `max()`.
- [ ] Ohne `group_by()` rechnet `summarize()` nichts aus.
  > Ohne `group_by()` fasst `summarize()` die ganze Tabelle zu einer Zeile zusammen; das ist ein gültiges Ergebnis.
- [ ] Ein Ausreißer wie 160 Euro lässt den Mittelwert scheitern.
  > Ein Ausreißer verzerrt den Mittelwert, macht ihn aber nicht zu `NA`; das liegt an den fehlenden Antworten.

> Fehlende Werte machen Mittelwert, Summe und Maximum zu `NA`, solange du nicht ausdrücklich `na.rm = TRUE` angibst.

## Wie viele Zeilen hat das Ergebnis von `survey |> group_by(diet) |> summarize(n = n())`? {#hds-010}

- [x] eine je Wert, der in `diet` vorkommt
  > Richtig: `group_by()` bildet eine Gruppe je vorkommendem Wert, fehlende Angaben als eigene Gruppe `NA`, und `summarize()` macht daraus je Gruppe eine Zeile.
- [ ] so viele wie `survey`, eine je Person
  > Eine Zeile je Person behält `mutate()`; `summarize()` fasst jede Gruppe zu einer Zeile zusammen.
- [ ] genau eine
  > Genau eine Zeile entsteht ohne `group_by()`; mit ihm gibt es eine Zeile je Gruppe.
- [ ] zwei, eine für `diet` und eine für `n`
  > `diet` und `n` sind die Spalten des Ergebnisses; die Zahl der Zeilen hängt davon ab, wie viele Gruppen es gibt.

## Welche Ausdrücke zählen, wie viele Befragte es je Ernährungsweise gibt? (Mehrere richtige Antworten möglich.) {#hds-011}

- [x] `survey |> count(diet)`
  > Richtig: `count(diet)` ist die Kurzform für Gruppieren und Zählen und liefert eine Spalte `n`.
- [x] `survey |> group_by(diet) |> summarize(n = n())`
  > Richtig: Das ist die ausführliche Form derselben Auszählung; `n()` zählt die Zeilen jeder Gruppe.
- [ ] `survey |> summarize(n = n())`
  > Ohne `group_by()` zählt das alle Befragten zusammen und liefert eine einzige Zahl.
- [ ] `survey |> arrange(diet)`
  > `arrange()` sortiert die Befragten nach ihrer Ernährungsweise, zählt sie aber nicht.

## Welche Pipeline beantwortet die Frage, wie alt die vegan lebenden Befragten im Durchschnitt sind? {#hds-012}

- [x] `survey |> filter(diet == "vegan") |> summarize(mean_age = mean(age))`
  > Richtig: Erst die Zeilen auswählen, um die es geht, dann zusammenfassen.
- [ ] `survey |> summarize(mean_age = mean(age)) |> filter(diet == "vegan")`
  > Nach `summarize()` gibt es nur noch die Spalte `mean_age`; nach `diet` lässt sich dann nicht mehr filtern, und R meldet einen Fehler.
- [ ] `survey |> select(age) |> filter(diet == "vegan")`
  > `select(age)` wirft `diet` weg, bevor `filter()` es braucht; außerdem fehlt der Mittelwert.
- [ ] `survey |> filter(diet = "vegan") |> summarize(mean_age = mean(age))`
  > Ein einzelnes `=` weist zu und vergleicht nicht; `filter()` bricht mit einem Hinweis auf `==` ab.

> Die Reihenfolge der Verben folgt der Frage: erst auswählen, um wen es geht, dann zusammenfassen.
