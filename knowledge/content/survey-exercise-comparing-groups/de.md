---
type: exercise
code: 2739
title: "Selbststudium R, Kapitel 3: Gruppen vergleichen"
summary: >-
  Sieben Aufgaben zu der Frage, ob sich Gruppen unterscheiden: Einkaufsorte und
  Bio-Anteil nach Wohnort, Einkommen und Kindern im Haushalt, und bei jeder Zahl
  die Frage, wie viele Menschen hinter ihr stehen.
objectives:
  intro: "In diesem Kapitel vergleichst du Gruppen von Befragten miteinander, und kannst danach:"
  goals:
    - "erklären, was `summarise()` und `mutate()` mit und ohne `group_by()` aus einer Tabelle machen"
    - "je Gruppe die Zahl der Befragten und den Anteil einer Antwort in Prozent berechnen"
    - "mit `count()`, `group_by()`, `mutate()` und `ungroup()` die Verteilung einer Variable innerhalb jeder Gruppe bestimmen"
    - "mit `case_when()` eigene Gruppen bilden und sie mit `fct_relevel()` in eine sinnvolle Reihenfolge bringen"
    - "zu jedem Vergleich sagen, über wen er spricht und wie viele Menschen hinter jeder Zahl stehen"
level: 1
duration: 180
topics: [transforming-data, exploring-data, data-pitfalls]
modules: [pmg]
areas: [ds]
r_datasets: { survey: mds12_schoko_milch.csv }
relations:
  requires: [survey-exercise-describing-variables]
  see_also: [milk-chocolate-survey, r-for-data-science]
status: published
updated: 2026-11-11
---

Die Leitfrage der fünf Kapitel bleibt dieselbe: **Wo kaufen die Befragten
ein, und wer kauft Bio?** Jetzt wird es interessant, denn du fragst, ob sich
Gruppen unterscheiden, ob also Menschen auf dem Dorf anders einkaufen als in
der Großstadt und Haushalte mit mehr Einkommen häufiger Bio kaufen. Das
Werkzeug dafür ist `group_by()` zusammen mit `summarise()`, und die wichtigste
Frage bei jeder Gruppe lautet, wie viele Menschen hinter ihr stehen.

In den Kästen liegt die ganze
[[milk-chocolate-survey|Umfrage zu Milch und Schokolade]] als Tabelle `survey`
bereit, und das tidyverse ist geladen. Weil jeder Kasten für sich läuft, gibt
es die Spalten `city_size` und `organic_share` aus Kapitel 2 hier nicht von
selbst; wo eine Aufgabe sie braucht, legst du sie am Anfang der Pipe selbst an,
und der Tipp zeigt dir den Code dafür. In `chapter_3.R` aus deinem Kursordner
tragen die Aufgaben in derselben Reihenfolge die Nummern 3.1 bis 3.7, und zu den meisten gibt
es im Tipp einen Kontrollwert, an dem du dein Ergebnis selbst prüfen kannst.

## Teil 1: Zusammenfassen und gruppieren

1. Führ die beiden Pipes aus und vergleich, wie viele Zeilen jedes
   Ergebnis hat. Beschreib den Unterschied zwischen `summarise()` und
   `mutate()` in einem Satz, und schreib das `summarise()` danach mit der
   kürzeren Funktion, die dasselbe liefert.

```r
survey |>
  summarise(n_respondents = n())

survey |>
  mutate(n_respondents = n())
```

> [!HINT]
> Lies dazu in [[r-for-data-science]] die Abschnitte
> [3.3 „Columns“](https://r4ds.hadley.nz/data-transform.html#columns) und
> [3.5 „Groups“](https://r4ds.hadley.nz/data-transform.html#groups). Die
> kürzere Funktion kennst du aus Kapitel 2, wo du mit ihr Häufigkeiten
> gezählt hast.
>
> Kontrolle: 1 Zeile gegen 2.811 Zeilen.

> [!SOLUTION]
> ```r
> survey |>
>   count()
> ```
>
> `summarise()` fasst alle 2.811 Zeilen zu einer einzigen Zeile mit der Zahl
> der Befragten zusammen, während `mutate()` alle 2.811 Zeilen behält und
> jeder von ihnen dieselbe Zahl als neue Spalte anhängt. Die Abkürzung für
> das `summarise()` ist `count()`, das seine Spalte allerdings `n` nennt.

2. Setz vor beide Pipes aus 3.1 ein `group_by(Q004geschlechtf)` und
   führ sie erneut aus. Beschreib, was sich bei `summarise()` und was sich bei
   `mutate()` ändert, und find heraus, woher die Zeile mit `NA` kommt.

```r
survey |>
  summarise(n_respondents = n())

survey |>
  mutate(n_respondents = n())
```

> [!HINT]
> Lies dazu in [[r-for-data-science]] die Abschnitte 3.5.1 bis 3.5.3 unter
> [3.5 „Groups“](https://r4ds.hadley.nz/data-transform.html#groups). Für das
> `NA` vergleich die aufbereitete Spalte mit der Rohspalte `q004geschlecht`;
> die Spur liegt im Abschnitt „Zwei Menschen verschwinden in der
> Aufbereitung“ in `course/datasets/mds12-schoko-milch.md` in deinem
> Kursordner.

> [!SOLUTION]
> ```r
> survey |>
>   group_by(Q004geschlechtf) |>
>   summarise(n_respondents = n())
>
> survey |>
>   group_by(Q004geschlechtf) |>
>   mutate(n_respondents = n()) |>
>   select(Q004geschlechtf, n_respondents)
>
> survey |>
>   count(q004geschlecht, Q004geschlechtf)
> ```
>
> Mit `group_by()` liefert `summarise()` eine Zeile je Gruppe: 1.481 Frauen,
> 1.328 Männer und 2 Personen mit `NA`. `mutate()` behält dagegen alle 2.811
> Zeilen, schreibt aber in jede die Größe ihrer eigenen Gruppe, und das
> Ergebnis bleibt gruppiert, wie die Zeile `# Groups: Q004geschlechtf [3]`
> zeigt; das `select()` dient nur dazu, die beiden Spalten nebeneinander zu
> sehen. Die Zählung mit der Rohspalte zeigt, woher das `NA` kommt: Die zwei
> Personen, die „divers“ (Code 3) angegeben haben, sind in der aufbereiteten
> Spalte fehlend. Bei zwei Personen ist keine Gruppenauswertung möglich, aber
> vermerkt ist diese Entscheidung nirgends, und wer so etwas entscheidet,
> schreibt es in den Methodenteil.

## Teil 2: Anteile vergleichen

3. Berechne je Wohnortgröße (`city_size`) die Zahl der Befragten und
   den Anteil in Prozent, die im Hofladen (`v008ort_6hof`) und auf dem
   Wochenmarkt (`v008ort_5markt`) einkaufen. Lass die 7 Personen ohne Angabe
   zum Wohnort weg und begründe das in einem Kommentar im Code. Beschreib dann
   in einem Satz, was auffällt, wenn du beide Spalten nebeneinander liest.

```r
survey
```

> [!HINT]
> `city_size` ist die Wohnortgröße aus `D044stadtf` als Faktor in der
> Reihenfolge von groß nach klein, so wie du sie in Kapitel 2 angelegt hast.
> Deine Pipe beginnt deshalb so:
>
> ```r
> survey |>
>   mutate(city_size = factor(D044stadtf, levels = c(
>     "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>     "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>   ))) |>
>   count(city_size)
> ```
>
> In den Spalten `v008ort_*` steht 1 für genannt und 0 für nicht genannt.
> Der Mittelwert einer Bedingung wie `v008ort_6hof == 1` ist der Anteil der
> Befragten, auf die sie zutrifft; lies dazu in [[r-for-data-science]] den
> Abschnitt [12.4 „Summaries“](https://r4ds.hadley.nz/logicals.html#sec-logical-summaries).
>
> Kontrolle: Hofladen im Dorf 17,8 %, Wochenmarkt im Dorf 13,1 %.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(city_size = factor(D044stadtf, levels = c(
>     "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>     "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>   ))) |>
>   # without a city size a person belongs to none of the groups we compare,
>   # and 7 people would be too few for a group of their own
>   filter(!is.na(city_size)) |>
>   group_by(city_size) |>
>   summarise(
>     n_respondents = n(),
>     pct_farm_shop = 100 * mean(v008ort_6hof == 1),
>     pct_market = 100 * mean(v008ort_5markt == 1)
>   )
> ```
>
> Beide Orte stehen für den Einkauf direkt beim Erzeuger, verhalten sich
> aber gegenläufig: Den Hofladen nennen in der Großstadt 11,9 % und in den
> kleinen Kleinstädten und Dörfern 19,2 und 17,8 %, den Wochenmarkt dagegen
> in Großstädten, Mittelstädten und großen Kleinstädten rund 19 bis 20 % und
> in den kleinen Orten nur 10,6 und 13,1 %. Wer beide Orte zu einer Spalte „direkt beim Erzeuger“
> zusammenfasste, sähe diesen Unterschied nicht. Die Anteile beziehen sich
> auf die Befragten, nicht auf die Nennungen, denn jede Person konnte mehrere
> Einkaufsorte angeben.

4. Berechne, wie sich der Bio-Anteil (`organic_share`) innerhalb
   jeder Wohnortgröße verteilt. Zähl dazu mit `count(city_size,
   organic_share)`, gruppier dann nach `city_size`, berechne mit `mutate()`
   den Anteil jeder Zeile an ihrer Gruppe in Prozent
   (`pct = 100 * n / sum(n)`) und heb die Gruppierung am Ende mit `ungroup()`
   wieder auf. Lass Personen ohne Angabe bei Wohnort oder Bio-Anteil weg, und
   begründe in einem Satz, warum hier `mutate()` passt und nicht
   `summarise()`.

```r
survey
```

> [!HINT]
> `organic_share` ist der Bio-Anteil am Lebensmitteleinkauf aus
> `v032bioanteil` mit seinen fünf Stufen als Faktor. Zusammen mit
> `city_size` beginnt deine Pipe so:
>
> ```r
> survey |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     )),
>     organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
>       "(fast) nie Bio", "deutlich weniger als die Hälfte", "etwa die Hälfte",
>       "deutlich mehr als die Hälfte", "(fast) nur Bio"
>     ))
>   ) |>
>   count(organic_share)
> ```
>
> Kontrolle: „(fast) nie Bio“ in der Großstadt 20,9 %, im Dorf 23,4 %.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     )),
>     organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
>       "(fast) nie Bio", "deutlich weniger als die Hälfte", "etwa die Hälfte",
>       "deutlich mehr als die Hälfte", "(fast) nur Bio"
>     ))
>   ) |>
>   filter(!is.na(city_size), !is.na(organic_share)) |>
>   count(city_size, organic_share) |>
>   group_by(city_size) |>
>   mutate(pct = 100 * n / sum(n)) |>
>   ungroup()
> ```
>
> `summarise()` würde jede Wohnortgröße zu einer einzigen Zeile
> zusammenfassen, während `mutate()` die fünf Zeilen je Gruppe behält und
> `sum(n)` dank `group_by()` nur über die eigene Gruppe bildet. Die
> Verteilungen ähneln sich: „(fast) nie Bio“ sagen in der Großstadt 20,9 %
> und im Dorf 23,4 %, und überall kauft rund ein Drittel deutlich weniger als
> die Hälfte Bio. Am ehesten fällt das Dorf auf, wo nur 10,1 % deutlich mehr
> als die Hälfte Bio kaufen, in den anderen Wohnortgrößen 13,9 bis 17,2 %;
> bei 385 Befragten im Dorf lässt sich aus diesen Zahlen allein aber nicht
> sagen, ob das mehr als Zufall ist. `ungroup()` sorgt dafür, dass ein
> weiterer Schritt nicht unbemerkt je Wohnortgröße rechnet.

## Teil 3: Gruppen selbst bilden

5. Das Einkommen (`d049einkommen`) hat elf Stufen, für einen
   Vergleich zu viele. Bilde mit `case_when()` eine Spalte `income_group` mit
   vier Gruppen, in der Personen ohne Angabe `NA` bleiben, und bring die
   Gruppen mit `fct_relevel()` in die richtige Reihenfolge:

   - „unter 2.000 €“ aus den Codes 1 bis 4,
   - „2.000 bis unter 3.500 €“ aus den Codes 5 bis 7,
   - „3.500 bis unter 5.000 €“ aus den Codes 8 bis 10,
   - „5.000 € und mehr“ aus Code 11.

   Bilde außerdem eine Spalte `is_organic_half`, die `TRUE` ist, wenn jemand
   mindestens etwa die Hälfte Bio kauft (`v032bioanteil` ab 3). Berechne dann
   je Einkommensgruppe die Zahl der Befragten und den Anteil mit
   `is_organic_half` in Prozent.

```r
survey
```

> [!HINT]
> Die Codes stehen im Codebuch auf Seite 33; das PDF liegt nur in deinem
> Kursordner unter `data/M3b_Musterstudie-quantitativ.pdf`, die Kurzfassung
> im Abschnitt „Wichtige Variablen und ihre Codes“ in
> `course/datasets/mds12-schoko-milch.md`. Lies dazu in
> [[r-for-data-science]] die Abschnitte
> [12.5 „Conditional transformations“](https://r4ds.hadley.nz/logicals.html#conditional-transformations)
> und
> [16.4 „Modifying factor order“](https://r4ds.hadley.nz/factors.html#sec-modifying-factor-order).
> Achte beim Mittelwert darauf, dass nicht alle Befragten die Frage nach dem
> Bio-Anteil beantwortet haben.
>
> Kontrolle: 291 Befragte in „5.000 € und mehr“; Anteil mit
> `is_organic_half` in „unter 2.000 €“ 38,3 %, in „5.000 € und mehr“ 50,2 %.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     income_group = case_when(
>       d049einkommen %in% 1:4 ~ "unter 2.000 €",
>       d049einkommen %in% 5:7 ~ "2.000 bis unter 3.500 €",
>       d049einkommen %in% 8:10 ~ "3.500 bis unter 5.000 €",
>       d049einkommen == 11 ~ "5.000 € und mehr"
>     ),
>     income_group = fct_relevel(
>       income_group,
>       "unter 2.000 €", "2.000 bis unter 3.500 €",
>       "3.500 bis unter 5.000 €", "5.000 € und mehr"
>     ),
>     is_organic_half = v032bioanteil >= 3
>   ) |>
>   group_by(income_group) |>
>   summarise(
>     n_respondents = n(),
>     pct_organic_half = 100 * mean(is_organic_half, na.rm = TRUE)
>   )
> ```
>
> Der Anteil steigt mit dem Einkommen stetig an, von 38,3 % unter 2.000 €
> über 44,6 und 46,7 % auf 50,2 % bei 5.000 € und mehr. Ohne
> `na.rm = TRUE` stünde in jeder Gruppe `NA`, weil 18 Befragte die Frage
> nach dem Bio-Anteil nicht beantwortet haben; die Anteile gelten also für
> alle, die sie beantwortet haben. Die 100 Befragten ohne Angabe zum
> Einkommen stehen in einer eigenen Zeile mit `NA`, und ihr Anteil von
> 52,5 % gehört zu keiner Einkommensgruppe.

6. Find heraus, ob Haushalte mit Kindern unter 12 häufiger beim
   Discounter (`v008ort_1discount`) einkaufen. Bilde dazu eine Spalte
   `has_children`, die `TRUE` ist, wenn `D043kinderzahl` größer als 0 ist.
   Zähl zuerst, bei wie vielen Befragten `has_children` fehlt und in welchen
   Haushaltsgrößen (`d042hhzahl`) sie leben, und beschreib in einem Satz,
   über wen dein Vergleich spricht. Vergleich danach den Anteil, der beim
   Discounter einkauft.

```r
survey
```

> [!HINT]
> Erinnere dich an Kapitel 2, Aufgabe 6: Die Frage nach den Kindern wurde
> nur gestellt, wenn zum Haushalt mindestens zwei Personen gehören (Codebuch
> Seite 32), und bei der Aufbereitung zu `D043kinderzahl` sind 12
> unglaubwürdige Werte entfernt worden. Warum ein fehlender Wert oft „nicht
> gefragt“ heißt, steht auf der Seite zur
> [[milk-chocolate-survey|Umfrage]] unter „Was man wissen sollte, bevor man
> rechnet“. Mit `count(d042hhzahl, has_children)` siehst du beides auf
> einmal.
>
> Kontrolle: 436 Befragte mit Kindern unter 12.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(has_children = D043kinderzahl > 0) |>
>   count(d042hhzahl, has_children)
>
> survey |>
>   mutate(has_children = D043kinderzahl > 0) |>
>   group_by(has_children) |>
>   summarise(
>     n_respondents = n(),
>     pct_discounter = 100 * mean(v008ort_1discount == 1)
>   )
> ```
>
> Bei 929 Befragten fehlt `has_children`: 824 leben allein und wurden gar
> nicht gefragt, bei 14 fehlt die Haushaltsgröße, und 91 leben in Haushalten
> mit zwei bis vier Personen ohne gültige Angabe, darunter die 12, deren
> Werte bei der Aufbereitung entfernt wurden. Der Vergleich spricht also nur
> über Menschen in Haushalten mit mindestens zwei Personen, und „ohne Kinder
> unter 12“ heißt hier vor allem Zwei-Personen-Haushalte (1.087 der 1.446),
> nicht Alleinlebende. Zwischen den Gruppen gibt es kaum einen Unterschied:
> Mit Kindern kaufen 75,0 % der 436 Befragten beim Discounter, ohne Kinder
> 74,0 % der 1.446.

## Teil 4: Wie viele stecken dahinter?

7. Berechne das Durchschnittsalter (`Q002alter`) nach Ernährungsweise
   (`V041nofleischf`) zusammen mit der Zahl der Befragten je Gruppe, und
   sortier nach der Gruppengröße. Beschreib dann in zwei Sätzen, wie sehr du
   dem Mittelwert der kleinsten Gruppe traust und was neben dieser Zahl in
   einem Bericht stehen müsste.

```r
survey
```

> [!HINT]
> Lies dazu in [[r-for-data-science]] den Abschnitt
> [3.6 „Case study: aggregates and sample size“](https://r4ds.hadley.nz/data-transform.html#sec-sample-size).
>
> Kontrolle: Die kleinste Gruppe mit Angabe sind die 36 veganen Befragten.

> [!SOLUTION]
> ```r
> survey |>
>   group_by(V041nofleischf) |>
>   summarise(
>     n_respondents = n(),
>     mean_age = mean(Q002alter)
>   ) |>
>   arrange(desc(n_respondents))
> ```
>
> Die 36 veganen Befragten sind im Mittel 41,8 Jahre alt, die 134
> vegetarischen 39,3 und die 37 pescetarischen 44,8 Jahre, während die 749
> flexitarischen und die 1.827 ohne Einschränkung mit 49,3 und 48,8 Jahren
> deutlich älter sind. Einem Mittelwert aus 36 Menschen traue ich nur
> grob, weil wenige Personen ihn um mehrere Jahre verschieben können und
> andere 36 Menschen ein spürbar anderes Ergebnis liefern könnten. In einem
> Bericht gehört neben jeden Mittelwert die Zahl der Befragten, aus der er
> stammt, am besten auch ein Maß für die Streuung wie die
> Standardabweichung (bei den Veganen 12,3 Jahre), und die 28 Befragten
> ohne Angabe zur Ernährungsweise brauchen eine eigene Erklärung, statt
> stillschweigend wegzufallen.

## Wie es weitergeht

Deine Lösungen kannst du mit dem [[opencode-course-assistant|Kursassistenten]]
in deinem Kursordner durchgehen, und weiter geht es mit
[[survey-exercise-figures|Kapitel 4: Abbildungen]].
