---
type: exercise
code: 4180
title: "Selbststudium R, Kapitel 5: Eine Frage beantworten"
summary: >-
  Der ganze Weg allein an einer von vier Fragen zu Einkauf und Bio: Variablen
  finden und aufbereiten, Kennzahlen und eine Abbildung, ein Befund in drei Sätzen.
objectives:
  intro: "In diesem Kapitel beantwortest du eine Frage an die Umfrage von Anfang bis Ende selbst, und kannst danach:"
  goals:
    - "eine Frage in die Spalten des Datensatzes übersetzen und ihre Codes im Codebuch nachschlagen"
    - "für jede Spalte Skalenniveau und Datentyp prüfen, sie passend umwandeln und eine Fragebatterie zu einem Wert je Person zusammenfassen"
    - "fehlende Werte zählen, ihren Grund benennen und angeben, wen eine Auswertung ausschließt"
    - "einen Zusammenhang mit Anteilen je Gruppe oder einer Korrelation beschreiben und zu jeder Zahl sagen, auf wie vielen Befragten sie beruht"
    - "eine Abbildung zeichnen, die die Frage beantwortet, und den Befund in drei Sätzen festhalten: Ergebnis, Basis und Grenze"
level: 1
duration: 120
topics: [questions-and-measurement, exploring-data, visualising-data, communicating-results]
modules: [pmg]
areas: [ds]
r_datasets: { survey: mds12_schoko_milch.csv }
relations:
  requires: [survey-exercise-figures]
  see_also: [milk-chocolate-survey, r-for-data-science]
status: published
updated: 2026-11-11
---

Die Leitfrage des Selbststudiums lautet: **Wo kaufen die Befragten ein, und
wer kauft Bio?** Im letzten Kapitel gehst du den ganzen Weg allein, an einer
Frage, die du aus vier auswählst. Genau so arbeitest du ab Sitzung 2 in der
Gruppe an eurem Thema, von der Frage über die Variablen, ihre Aufbereitung,
die Kennzahlen und eine Abbildung bis zu einem Befund, für den du
geradestehen kannst.

In den Kästen liegt die vollständige [[milk-chocolate-survey|Umfrage zu Milch
und Schokolade]] als Tabelle `survey` bereit, und das tidyverse ist geladen.
Jeder Kasten läuft für sich: Was ein Kasten anlegt, kennt der nächste nicht.
Deshalb legen die Lösungen Spalten wie `income_group` jedes Mal neu an, und
das solltest du in deinem Code genauso machen.

## Die Frage wählen

| | Frage | Spalten |
|---|---|---|
| A | Kaufen Haushalte mit höherem Einkommen mehr Bio? | `d049einkommen`, `v032bioanteil` |
| B | Kaufen Menschen auf dem Land häufiger direkt beim Erzeuger, im Hofladen oder auf dem Wochenmarkt? | `d044stadt` bzw. `D044stadtf`, `v008ort_5markt`, `v008ort_6hof` |
| C | Grüne Mobilität, grüner Konsum: Kaufen Haushalte mit E-Bike mehr Bio? | `d039besitz_9ebike`, `v032bioanteil` |
| D | Hängt die Einstellung zu Bio mit dem Umweltbewusstsein zusammen? | `p030green_*` und `p031bio_*` |

Bei Frage D bildest du aus jeder der beiden Fragebatterien einen Wert je
Person und drehst die umgepolten Aussagen vorher um. Die Fragen A und B hast
du in [[survey-exercise-comparing-groups|Kapitel 3]] und
[[survey-exercise-figures|Kapitel 4]] schon angefangen und gehst jetzt tiefer,
während C und D neu sind. Die Lösungen zeigen den Weg für alle vier Fragen;
lies jeweils nur den Teil zu deiner Frage, und erst dann, wenn du es selbst
versucht hast.

## Teil 1: Die Variablen vorbereiten

1. Such die Spalten, die du für deine Frage brauchst, im Codebuch und
   notiere für jede die Seite, den Fragetext in Kurzform und die Codes. Leg
   dann eine kleine Tabelle an, die nur eine Kennung `respondent_id` und
   diese Spalten enthält.

```r
survey
```

> [!HINT]
> Lies vorher in [[r-for-data-science]] den Abschnitt 10.2
> [„Questions“](https://r4ds.hadley.nz/EDA.html#questions). Das Codebuch ist
> die Studiendokumentation `data/M3b_Musterstudie-quantitativ.pdf`, die es nur
> in deinem Kursordner gibt; die Seitenzahlen in den Lösungen beziehen sich
> darauf. Die Kennung legst du mit `mutate(respondent_id = row_number(),
> .before = 1)` an, und bei einer ganzen Fragebatterie hilft
> `select(starts_with("p030green"))`.

> [!SOLUTION]
> Die Kennung `respondent_id` gibt es auf dieser Seite nicht von Anfang an,
> deshalb legt jede Lösung sie selbst an.
>
> **Frage A.** `d049einkommen` ist das Netto-Haushaltseinkommen (F49, S. 33)
> mit den Codes 1 „unter 500 €“ bis 11 „5.000 € und mehr“ in Stufen zu 500 €;
> wer „keine Angabe“ gewählt hat, ist fehlend. `v032bioanteil` ist der Anteil
> von Bio am gesamten Einkauf (F32, S. 28), von 1 „(fast) nie Bio“ über 2
> „deutlich weniger als die Hälfte“, 3 „etwa die Hälfte“ und 4 „deutlich mehr
> als die Hälfte“ bis 5 „(fast) nur Bio“.
>
> ```r
> survey |>
>   mutate(respondent_id = row_number(), .before = 1) |>
>   select(respondent_id, d049einkommen, v032bioanteil)
> ```
>
> **Frage B.** `d044stadt` ist die Größe des Wohnorts nach eigener
> Einschätzung (F44, S. 32), von 1 „Großstadt“ (mehr als 100.000 Einwohner)
> bis 6 „Dorf“ (weniger als 2.000), und `D044stadtf` dieselbe Angabe als Text.
> `v008ort_5markt` und `v008ort_6hof` gehören zur Frage, wo jemand
> gewöhnlich Lebensmittel einkauft (F8, S. 8, Mehrfachnennung): 1 heißt
> Wochenmarkt bzw. Hofladen oder direkt beim Erzeuger genannt, 0 nicht
> genannt.
>
> ```r
> survey |>
>   mutate(respondent_id = row_number(), .before = 1) |>
>   select(respondent_id, d044stadt, D044stadtf, v008ort_5markt, v008ort_6hof)
> ```
>
> **Frage C.** `d039besitz_9ebike` gehört zur Frage, was der Haushalt besitzt
> (F39, S. 31, Mehrfachnennung), mit 1 für ein E-Bike und 0 für keins;
> `v032bioanteil` ist dieselbe Spalte wie bei Frage A.
>
> ```r
> survey |>
>   mutate(respondent_id = row_number(), .before = 1) |>
>   select(respondent_id, d039besitz_9ebike, v032bioanteil)
> ```
>
> **Frage D.** Die fünf Spalten `p030green_*` sind Aussagen zum Umweltschutz
> beim Konsum (F30, S. 27), etwa „Ich würde mich selbst als umweltbewusst
> bezeichnen“, die sieben Spalten `p031bio_*` Aussagen zu Bio-Produkten (F31,
> S. 27 und 28), etwa „Beim Lebensmitteleinkauf bevorzuge ich Bio-Produkte“.
> Beide reichen von +2 „trifft voll und ganz zu“ bis −2 „trifft überhaupt
> nicht zu“, und bei F31 sind `p031bio_2gleich` („kaum Unterschiede“) und
> `p031bio_4teuer` („zu teuer“) mit (R) als umgepolt markiert.
>
> ```r
> survey |>
>   mutate(respondent_id = row_number(), .before = 1) |>
>   select(respondent_id, starts_with("p030green"), starts_with("p031bio"))
> ```

2. Bestimme für jede deiner Spalten das Skalenniveau und prüfe, ob
   der Datentyp dazu passt. Wandle um, wo es nötig ist: in einen Faktor mit
   richtiger Reihenfolge, in Gruppen oder, bei umgepolten Aussagen, in
   umgedrehte Werte.

```r
survey
```

> [!HINT]
> Gruppen bildest du mit `case_when()` und bringst sie mit `fct_relevel()` in
> die richtige Reihenfolge, so wie in Aufgabe 5 aus
> [[survey-exercise-comparing-groups|Kapitel 3]]. Ein Vergleich wie
> `v032bioanteil >= 3` macht aus einem Code einen Wahrheitswert. Weil die
> Aussagen von −2 bis +2 um null herum liegen, drehst du eine umgepolte
> Aussage mit einem Minuszeichen um, und `rowMeans(pick(starts_with("p030green")))`
> bildet in `mutate()` den Mittelwert jeder Zeile über die gewählten Spalten.

> [!SOLUTION]
> **Frage A.** Beide Spalten sind ordinal, liegen aber als ganze Zahlen vor.
> Für einen Vergleich sind elf Einkommensstufen zu viele, deshalb fasst die
> Lösung sie wie in Kapitel 3 zu vier Gruppen zusammen. Den Bio-Anteil teilt
> sie an der Stelle „etwa die Hälfte“ in zwei Gruppen: `organic_half` ist
> `TRUE`, wenn jemand mindestens etwa die Hälfte Bio kauft.
>
> ```r
> survey |>
>   mutate(
>     income_group = case_when(
>       d049einkommen <= 4 ~ "unter 2.000 €",
>       d049einkommen <= 7 ~ "2.000 bis unter 3.500 €",
>       d049einkommen <= 10 ~ "3.500 bis unter 5.000 €",
>       d049einkommen == 11 ~ "5.000 € und mehr"
>     ),
>     income_group = fct_relevel(
>       income_group, "unter 2.000 €", "2.000 bis unter 3.500 €",
>       "3.500 bis unter 5.000 €", "5.000 € und mehr"
>     ),
>     organic_half = v032bioanteil >= 3
>   ) |>
>   count(income_group, organic_half)
> ```
>
> Wer keine Einkommensangabe gemacht hat, landet in keiner Gruppe und bleibt
> `NA`, und dasselbe gilt für `organic_half` ohne Angabe zum Bio-Anteil. Wenn
> du alle fünf Stufen des Bio-Anteils zeigen willst, legst du wie in Kapitel 3
> einen Faktor `organic_share` mit `factor(v032bioanteil, levels = 1:5,
> labels = …)` an.
>
> **Frage B.** Die Wohnortgröße ist ordinal; `D044stadtf` ist Text und würde
> alphabetisch sortiert, deshalb wird daraus ein Faktor von der Großstadt bis
> zum Dorf. Die beiden Einkaufsorte sind nominal mit zwei Werten, und als 0
> und 1 können sie bleiben, weil ihr Mittelwert genau der Anteil der Einsen
> ist.
>
> ```r
> survey |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     ))
>   ) |>
>   count(city_size)
> ```
>
> **Frage C.** Der E-Bike-Besitz ist nominal mit zwei Werten und wird zum
> Wahrheitswert `has_ebike`, der Bio-Anteil wie bei Frage A zu `organic_half`.
>
> ```r
> survey |>
>   mutate(
>     has_ebike = d039besitz_9ebike == 1,
>     organic_half = v032bioanteil >= 3
>   ) |>
>   count(has_ebike, organic_half)
> ```
>
> **Frage D.** Jede einzelne Aussage ist ordinal. Wer den Mittelwert über
> mehrere Aussagen bildet, behandelt die Abstände zwischen den Stufen als
> gleich groß; das ist bei solchen Skalen üblich, aber eine Annahme, die du
> nennen solltest. Dass die beiden (R)-Aussagen andersherum gepolt sind,
> zeigt sich auch in den Daten, denn sie hängen negativ mit den übrigen
> zusammen:
>
> ```r
> survey |>
>   summarize(
>     r_equal = cor(p031bio_2gleich, p031bio_1lieberbio, use = "complete.obs"),
>     r_expensive = cor(p031bio_4teuer, p031bio_6biokauf, use = "complete.obs")
>   )
> ```
>
> Die Korrelationen liegen bei −0,25 und −0,41. Nach dem Umdrehen bildet die
> Lösung je Person einen Mittelwert über die fünf Aussagen zur Umwelt
> (`green_score`) und über die sieben zu Bio (`organic_score`), beide wieder
> zwischen −2 und +2:
>
> ```r
> survey |>
>   mutate(
>     p031bio_2gleich = -p031bio_2gleich,
>     p031bio_4teuer = -p031bio_4teuer,
>     green_score = rowMeans(pick(starts_with("p030green"))),
>     organic_score = rowMeans(pick(starts_with("p031bio")))
>   ) |>
>   select(green_score, organic_score)
> ```

3. Prüf, welche Werte in deinen Spalten vorkommen und wie viele
   fehlen, und beschreib in einem Satz, warum sie fehlen. Leg fest, wen du
   aus der Auswertung ausschließt, und zähle, wie viele das sind.

```r
survey
```

> [!HINT]
> Lies in [[r-for-data-science]] den Abschnitt 10.3 „Variation“ im
> [Kapitel zur explorativen Datenanalyse](https://r4ds.hadley.nz/EDA.html#questions).
> `count()` zeigt dir jeden vorkommenden Wert, und `sum(is.na(…))` in
> `summarize()` zählt die fehlenden. Ob ein fehlender Wert „nicht gefragt“
> oder „nicht geantwortet“ heißt, steht unter „Was man wissen sollte, bevor
> man rechnet“ auf der Seite zur [[milk-chocolate-survey]]; die Blöcke `q`,
> `v`, `p` und `d` hat laut Datensatzführer
> (`course/datasets/mds12-schoko-milch.md` in deinem Kursordner) jede
> befragte Person bekommen.

> [!SOLUTION]
> In allen vier Fragen kommen nur die Codes vor, die das Codebuch nennt, das
> zeigt `count()` für jede Spalte. Weil alle Spalten aus Blöcken stammen, die
> jede befragte Person bekommen hat, heißt ein fehlender Wert hier nicht
> „nicht gefragt“, sondern „nicht geantwortet“.
>
> **Frage A.** Beim Einkommen bot der Fragebogen „keine Angabe“ an, und das
> haben 100 Personen gewählt; beim Bio-Anteil fehlen 18 Antworten.
>
> ```r
> survey |>
>   summarize(
>     income_missing = sum(is.na(d049einkommen)),
>     organic_missing = sum(is.na(v032bioanteil)),
>     excluded = sum(is.na(d049einkommen) | is.na(v032bioanteil)),
>     remaining = sum(!is.na(d049einkommen) & !is.na(v032bioanteil))
>   )
> ```
>
> Ausgeschlossen werden 117 Personen, weil eine von ihnen bei beiden Fragen
> keine Angabe gemacht hat, und es bleiben 2.694.
>
> **Frage B.** Nur bei der Wohnortgröße fehlen Werte, bei 7 Personen; die
> Einkaufsorte sind vollständig, weil jede Mehrfachnennung als 0 oder 1
> gespeichert ist.
>
> ```r
> survey |>
>   summarize(
>     city_missing = sum(is.na(d044stadt)),
>     market_missing = sum(is.na(v008ort_5markt)),
>     farm_missing = sum(is.na(v008ort_6hof)),
>     remaining = sum(!is.na(d044stadt))
>   )
> ```
>
> Ohne die 7 bleiben 2.804 Befragte.
>
> **Frage C.** Der E-Bike-Besitz ist vollständig, beim Bio-Anteil fehlen
> dieselben 18 Antworten wie bei Frage A.
>
> ```r
> survey |>
>   summarize(
>     ebike_missing = sum(is.na(d039besitz_9ebike)),
>     organic_missing = sum(is.na(v032bioanteil)),
>     remaining = sum(!is.na(v032bioanteil))
>   )
> ```
>
> Es bleiben 2.793 Befragte.
>
> **Frage D.** Alle zwölf Aussagen reichen von −2 bis +2, und bei jeder
> fehlen zwischen 5 und 11 Antworten:
>
> ```r
> survey |>
>   select(starts_with("p030green"), starts_with("p031bio")) |>
>   pivot_longer(everything(), names_to = "item", values_to = "value") |>
>   group_by(item) |>
>   summarize(
>     min = min(value, na.rm = TRUE),
>     max = max(value, na.rm = TRUE),
>     missing = sum(is.na(value))
>   )
> ```
>
> Die Lösung bildet die beiden Werte nur für Personen, die alle Aussagen
> ihrer Batterie beantwortet haben, denn `rowMeans()` ohne `na.rm = TRUE`
> ergibt sonst `NA`. Wer bei mindestens einer der zwölf Aussagen fehlt, fällt
> heraus:
>
> ```r
> survey |>
>   mutate(
>     green_missing = rowSums(is.na(pick(starts_with("p030green")))),
>     organic_missing = rowSums(is.na(pick(starts_with("p031bio"))))
>   ) |>
>   summarize(
>     excluded = sum(green_missing > 0 | organic_missing > 0),
>     remaining = sum(green_missing == 0 & organic_missing == 0)
>   )
> ```
>
> Das sind 53 Personen, und es bleiben 2.758.

## Teil 2: Antworten

4. Beschreib zuerst jede deiner Variablen einzeln und dann ihren
   Zusammenhang, mit Anteilen oder Mittelwerten je Gruppe oder, bei Frage D,
   mit einer Korrelation (`cor()` mit `use = "complete.obs"`). Gib zu jeder
   Zahl an, auf wie vielen Befragten sie beruht.

```r
survey
```

> [!HINT]
> Lies in [[r-for-data-science]] den Abschnitt 10.5 „Covariation“ im
> [Kapitel zur explorativen Datenanalyse](https://r4ds.hadley.nz/EDA.html#questions).
> Der Mittelwert einer Bedingung wie `mean(v032bioanteil >= 3)` ist der
> Anteil, für den sie zutrifft, und `n()` in `summarize()` liefert die Zahl
> der Befragten je Gruppe gleich mit. Schließ die Personen, die du in 5.3
> ausgeschlossen hast, vorher mit `filter()` aus, dann beruhen alle Zahlen auf
> derselben Basis.

> [!SOLUTION]
> **Frage A.** Von den 2.694 Befragten mit beiden Angaben kaufen 44,3 Prozent
> mindestens etwa die Hälfte Bio, und der Median des Einkommens liegt bei
> Code 7, also bei 3.000 bis unter 3.500 €.
>
> ```r
> survey |>
>   filter(!is.na(d049einkommen), !is.na(v032bioanteil)) |>
>   summarize(
>     n = n(),
>     median_income_code = median(d049einkommen),
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   )
> ```
>
> Je Einkommensgruppe steigt dieser Anteil stetig, von 38,3 Prozent unter
> 2.000 € (661 Befragte) über 44,6 und 46,7 Prozent auf 50,2 Prozent bei
> 5.000 € und mehr (289 Befragte):
>
> ```r
> survey |>
>   filter(!is.na(d049einkommen), !is.na(v032bioanteil)) |>
>   mutate(
>     income_group = case_when(
>       d049einkommen <= 4 ~ "unter 2.000 €",
>       d049einkommen <= 7 ~ "2.000 bis unter 3.500 €",
>       d049einkommen <= 10 ~ "3.500 bis unter 5.000 €",
>       d049einkommen == 11 ~ "5.000 € und mehr"
>     ),
>     income_group = fct_relevel(
>       income_group, "unter 2.000 €", "2.000 bis unter 3.500 €",
>       "3.500 bis unter 5.000 €", "5.000 € und mehr"
>     )
>   ) |>
>   group_by(income_group) |>
>   summarize(
>     n = n(),
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   )
> ```
>
> **Frage B.** Von den 2.804 Befragten mit Angabe zum Wohnort kaufen 17,6
> Prozent auf dem Wochenmarkt und 14,1 Prozent im Hofladen ein, und 25,5
> Prozent nennen mindestens einen der beiden Orte.
>
> ```r
> survey |>
>   filter(!is.na(d044stadt)) |>
>   summarize(
>     n = n(),
>     share_market = mean(v008ort_5markt) * 100,
>     share_farm = mean(v008ort_6hof) * 100,
>     share_direct = mean(v008ort_5markt == 1 | v008ort_6hof == 1) * 100
>   )
> ```
>
> Je Wohnortgröße laufen die beiden Orte gegeneinander: Den Hofladen nennen
> in der Großstadt 11,9 Prozent und im Dorf 17,8 Prozent, den Wochenmarkt
> dagegen in der Großstadt 19,0 und im Dorf nur 13,1 Prozent. Wer mindestens
> einen der beiden Orte nennt, liegt in jeder Gruppe zwischen 23,9 und 28,7
> Prozent.
>
> ```r
> survey |>
>   filter(!is.na(D044stadtf)) |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     ))
>   ) |>
>   group_by(city_size) |>
>   summarize(
>     n = n(),
>     share_market = mean(v008ort_5markt) * 100,
>     share_farm = mean(v008ort_6hof) * 100,
>     share_direct = mean(v008ort_5markt == 1 | v008ort_6hof == 1) * 100
>   )
> ```
>
> Die beiden kleinsten Gruppen sind die Kleinstädte unter 5.000 Einwohnern
> mit 188 und die Dörfer mit 388 Befragten.
>
> **Frage C.** Von den 2.793 Befragten mit Angabe zum Bio-Anteil hat ein
> Viertel ein E-Bike im Haushalt, 25,2 Prozent, und 44,6 Prozent kaufen
> mindestens etwa die Hälfte Bio.
>
> ```r
> survey |>
>   filter(!is.na(v032bioanteil)) |>
>   summarize(
>     n = n(),
>     share_ebike = mean(d039besitz_9ebike) * 100,
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   )
> ```
>
> Mit E-Bike sind es 48,5 Prozent von 705 Befragten, ohne E-Bike 43,2
> Prozent von 2.088:
>
> ```r
> survey |>
>   filter(!is.na(v032bioanteil)) |>
>   mutate(has_ebike = d039besitz_9ebike == 1) |>
>   group_by(has_ebike) |>
>   summarize(
>     n = n(),
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   )
> ```
>
> **Frage D.** Bei den 2.758 Befragten, die alle zwölf Aussagen beantwortet
> haben, liegt das Umweltbewusstsein im Mittel bei 0,36 und die Einstellung
> zu Bio bei 0,06, also nahe der Mitte „teils, teils“. Die Korrelation der
> beiden Werte beträgt 0,51.
>
> ```r
> survey |>
>   mutate(
>     p031bio_2gleich = -p031bio_2gleich,
>     p031bio_4teuer = -p031bio_4teuer,
>     green_score = rowMeans(pick(starts_with("p030green"))),
>     organic_score = rowMeans(pick(starts_with("p031bio")))
>   ) |>
>   filter(!is.na(green_score), !is.na(organic_score)) |>
>   summarize(
>     n = n(),
>     mean_green = mean(green_score),
>     mean_organic = mean(organic_score),
>     r = cor(green_score, organic_score)
>   )
> ```
>
> Weil die Lösung vorher alle Personen mit fehlenden Werten ausgeschlossen
> hat, braucht `cor()` hier kein `use = "complete.obs"`; ohne den `filter()`
> wäre es nötig.

5. Zeichne eine Abbildung, die deine Frage beantwortet, so, dass du
   sie in einen Bericht übernehmen könntest: mit passender Form, sinnvoller
   Reihenfolge, Beschriftungen und, bei Anteilen, einer Achse, die bei null
   beginnt.

```r
survey |>
  ggplot() +
  aes()
```

> [!HINT]
> Welche Form zu welcher Frage passt, zeigt Claus Wilkes
> [Directory of Visualizations](https://clauswilke.com/dataviz/directory-of-visualizations.html),
> und die Werkzeuge kennst du aus [[survey-exercise-figures|Kapitel 4]]. Hast
> du die Anteile schon mit `summarize()` berechnet, zeichnet `geom_col()` sie
> als Balken, deren Achse von selbst bei null beginnt. Titel, Achsen und eine
> Zeile zur Basis setzt du mit `labs(title = …, x = …, y = …, caption = …)`.

> [!SOLUTION]
> **Frage A.** Ein Balken je Einkommensgruppe mit dem Anteil, der mindestens
> etwa die Hälfte Bio kauft, und über jedem Balken die Zahl der Befragten:
>
> ```r
> survey |>
>   filter(!is.na(d049einkommen), !is.na(v032bioanteil)) |>
>   mutate(
>     income_group = case_when(
>       d049einkommen <= 4 ~ "unter 2.000 €",
>       d049einkommen <= 7 ~ "2.000 bis unter 3.500 €",
>       d049einkommen <= 10 ~ "3.500 bis unter 5.000 €",
>       d049einkommen == 11 ~ "5.000 € und mehr"
>     ),
>     income_group = fct_relevel(
>       income_group, "unter 2.000 €", "2.000 bis unter 3.500 €",
>       "3.500 bis unter 5.000 €", "5.000 € und mehr"
>     )
>   ) |>
>   group_by(income_group) |>
>   summarize(
>     n = n(),
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   ) |>
>   ggplot() +
>   aes(x = income_group, y = share_organic_half, label = paste0("n = ", n)) +
>   geom_col() +
>   geom_text(vjust = -0.5) +
>   labs(
>     title = "Mehr Einkommen, etwas mehr Bio",
>     x = "Netto-Haushaltseinkommen",
>     y = "Anteil, der mindestens etwa die Hälfte Bio kauft (%)",
>     caption = "2.694 Befragte mit Angaben zu Einkommen und Bio-Anteil"
>   )
> ```
>
> **Frage B.** Die beiden Einkaufsorte nebeneinander je Wohnortgröße. Dafür
> bringt `pivot_longer()` die beiden Anteile in eine Spalte, und liegende
> Balken lassen Platz für die langen Namen der Wohnorte; `fct_rev()` sorgt
> dafür, dass die Großstadt oben steht.
>
> ```r
> survey |>
>   filter(!is.na(D044stadtf)) |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     ))
>   ) |>
>   group_by(city_size) |>
>   summarize(
>     market = mean(v008ort_5markt) * 100,
>     farm_shop = mean(v008ort_6hof) * 100
>   ) |>
>   pivot_longer(c(market, farm_shop), names_to = "place", values_to = "share") |>
>   ggplot() +
>   aes(x = share, y = fct_rev(city_size), fill = place) +
>   geom_col(position = "dodge") +
>   scale_fill_discrete(labels = c(farm_shop = "Hofladen", market = "Wochenmarkt")) +
>   labs(
>     title = "Auf dem Dorf eher Hofladen, in der Stadt eher Wochenmarkt",
>     x = "Anteil der Befragten, die dort einkaufen (%)",
>     y = NULL,
>     fill = NULL,
>     caption = "2.804 Befragte mit Angabe zur Wohnortgröße"
>   )
> ```
>
> **Frage C.** Zwei Balken genügen, einer für Haushalte mit und einer für
> Haushalte ohne E-Bike:
>
> ```r
> survey |>
>   filter(!is.na(v032bioanteil)) |>
>   mutate(ebike = if_else(d039besitz_9ebike == 1, "mit E-Bike", "ohne E-Bike")) |>
>   group_by(ebike) |>
>   summarize(
>     n = n(),
>     share_organic_half = mean(v032bioanteil >= 3) * 100
>   ) |>
>   ggplot() +
>   aes(x = ebike, y = share_organic_half, label = paste0("n = ", n)) +
>   geom_col(width = 0.5) +
>   geom_text(vjust = -0.5) +
>   labs(
>     title = "Haushalte mit E-Bike kaufen etwas häufiger Bio",
>     x = NULL,
>     y = "Anteil, der mindestens etwa die Hälfte Bio kauft (%)",
>     caption = "2.793 Befragte mit Angabe zum Bio-Anteil"
>   )
> ```
>
> **Frage D.** Zwei Werte je Person zeigt ein Streudiagramm. Weil die Werte
> Mittelwerte weniger Stufen sind, liegen viele Punkte genau aufeinander;
> `geom_jitter()` verschiebt sie ein wenig, und `alpha` macht dichte Stellen
> dunkler. Die Gerade von `geom_smooth()` zeigt die Richtung des
> Zusammenhangs.
>
> ```r
> survey |>
>   mutate(
>     p031bio_2gleich = -p031bio_2gleich,
>     p031bio_4teuer = -p031bio_4teuer,
>     green_score = rowMeans(pick(starts_with("p030green"))),
>     organic_score = rowMeans(pick(starts_with("p031bio")))
>   ) |>
>   filter(!is.na(green_score), !is.na(organic_score)) |>
>   ggplot() +
>   aes(x = green_score, y = organic_score) +
>   geom_jitter(width = 0.05, height = 0.05, alpha = 0.2) +
>   geom_smooth(method = "lm", formula = y ~ x) +
>   labs(
>     title = "Wer umweltbewusster ist, sieht Bio positiver (r = 0,51)",
>     x = "Umweltbewusstsein (Mittel aus 5 Aussagen, -2 bis +2)",
>     y = "Einstellung zu Bio (Mittel aus 7 Aussagen, -2 bis +2)",
>     caption = "2.758 Befragte, die alle zwölf Aussagen beantwortet haben"
>   )
> ```

## Teil 3: Der Befund

6. Schreib deinen Befund in drei Sätzen auf. Der erste nennt das
   Ergebnis mit einer Zahl, der zweite die Basis, also über wen die Zahl
   spricht, wie viele es sind und wer fehlt, und der dritte die Grenze, also
   was ausdrücklich nicht aus dem Ergebnis folgt.

> [!HINT]
> Denk bei der Grenze an zwei Dinge. Das erste ist die Stichprobe: Was dazu
> unter „Was man wissen sollte, bevor man rechnet“ auf der Seite zur
> [[milk-chocolate-survey]] steht, ergänzt der Abschnitt „Die Stichprobe ist
> nicht bundesrepräsentativ“ im Datensatzführer
> `course/datasets/mds12-schoko-milch.md` in deinem Kursordner. Das zweite
> ist, dass ein Zusammenhang keine Ursache ist; überleg, welche dritte
> Variable hinter deinem Ergebnis stecken könnte.

> [!SOLUTION]
> Für alle vier Fragen gilt dieselbe Grenze der Stichprobe: Sie ist nach
> Alter, Geschlecht und Bundesland quotiert, aber nicht zufällig gezogen, und
> mit 13,6 Prozent kommen mehr Befragte aus Niedersachsen, als die Quote
> vorsah, weil laut Datensatzführer für ein Spezialthema zusätzlich Menschen
> aus der Region Osnabrück befragt wurden.
>
> **Frage A.**
> - *Ergebnis:* Je höher das Haushaltseinkommen, desto häufiger kaufen die
>   Befragten mindestens etwa die Hälfte Bio, von 38,3 Prozent unter 2.000 €
>   bis 50,2 Prozent bei 5.000 € und mehr.
> - *Basis:* Die Zahlen beruhen auf 2.694 der 2.811 Befragten, denn 117
>   haben beim Einkommen oder beim Bio-Anteil keine Angabe gemacht, und die
>   oberste Einkommensgruppe umfasst nur 289 Personen.
> - *Grenze:* Der Bio-Anteil ist eine Selbsteinschätzung in einer
>   quotierten Online-Stichprobe, und der Zusammenhang zeigt nicht, dass mehr
>   Geld zu mehr Bio führt, denn mit dem Einkommen ändern sich auch andere
>   Merkmale der Haushalte.
>
> **Frage B.**
> - *Ergebnis:* Auf dem Land kaufen die Befragten häufiger im Hofladen ein
>   (Dorf 17,8 Prozent, Großstadt 11,9 Prozent), aber seltener auf dem
>   Wochenmarkt (Dorf 13,1 Prozent, Großstadt 19,0 Prozent), sodass der
>   Anteil, der mindestens einen der beiden Orte nennt, kaum vom Wohnort
>   abhängt.
> - *Basis:* Die Zahlen beruhen auf 2.804 Befragten mit Angabe zur
>   Wohnortgröße, die sie selbst eingeschätzt haben, und die ländlichen
>   Gruppen sind klein, 388 im Dorf und 188 in Kleinstädten unter 5.000
>   Einwohnern.
> - *Grenze:* Die Daten sagen, wo die Befragten einkaufen, nicht warum; ob
>   es in ihrer Nähe einen Wochenmarkt oder Hofladen gibt, steht nicht im
>   Datensatz, und für ganz Deutschland gilt das Ergebnis nur mit der
>   Vorsicht, die die Stichprobe verlangt.
>
> **Frage C.**
> - *Ergebnis:* Haushalte mit E-Bike kaufen etwas häufiger mindestens etwa
>   die Hälfte Bio als Haushalte ohne, 48,5 gegenüber 43,2 Prozent.
> - *Basis:* Die Zahlen beruhen auf 2.793 Befragten mit Angabe zum
>   Bio-Anteil, davon 705 mit E-Bike; 18 ohne Angabe fehlen.
> - *Grenze:* Daraus folgt nicht, dass grüne Mobilität und grüner Konsum
>   zusammengehören, denn ein E-Bike haben vor allem Haushalte mit mehr
>   Einkommen, und die kaufen nach Frage A ohnehin mehr Bio.
>
> Dass das Einkommen als dritte Variable infrage kommt, zeigt ein Blick auf
> den E-Bike-Besitz je Einkommensgruppe: Er steigt von 13,8 Prozent unter
> 2.000 € auf 33,0 Prozent in den beiden oberen Gruppen.
>
> ```r
> survey |>
>   filter(!is.na(d049einkommen)) |>
>   mutate(
>     income_group = case_when(
>       d049einkommen <= 4 ~ "unter 2.000 €",
>       d049einkommen <= 7 ~ "2.000 bis unter 3.500 €",
>       d049einkommen <= 10 ~ "3.500 bis unter 5.000 €",
>       d049einkommen == 11 ~ "5.000 € und mehr"
>     ),
>     income_group = fct_relevel(
>       income_group, "unter 2.000 €", "2.000 bis unter 3.500 €",
>       "3.500 bis unter 5.000 €", "5.000 € und mehr"
>     )
>   ) |>
>   group_by(income_group) |>
>   summarize(
>     n = n(),
>     share_ebike = mean(d039besitz_9ebike) * 100
>   )
> ```
>
> **Frage D.**
> - *Ergebnis:* Wer sich als umweltbewusster beschreibt, hat auch eine
>   positivere Einstellung zu Bio, mit einer Korrelation von 0,51.
> - *Basis:* Die Zahl beruht auf 2.758 der 2.811 Befragten, die alle zwölf
>   Aussagen beantwortet haben; 53 fehlen bei mindestens einer.
> - *Grenze:* Beide Werte sind Einstellungen, die dieselben Personen im
>   selben Fragebogen angegeben haben, und die Korrelation sagt weder, was
>   die Ursache ist, noch, ob diese Menschen tatsächlich mehr Bio kaufen.

## Wie es weitergeht

Mit diesem Kapitel ist die Übung abgeschlossen. Löse danach den
[[survey-self-test|Selbsttest]] noch einmal, und sprich in deinem Kursordner
mit dem [[opencode-course-assistant|Kursassistenten]] bei der Abnahme über
deinen Code und deinen Befund.
