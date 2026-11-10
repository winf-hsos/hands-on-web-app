---
type: exercise
code: 5126
title: "Selbststudium R, Kapitel 4: Abbildungen"
summary: >-
  Aus den Tabellen der Kapitel 2 und 3 werden Abbildungen mit ggplot2: Alter,
  Wohnort, Einkaufsorte und Bio-Anteil, jede passend zur Frage und ohne Code verständlich.
objectives:
  intro: "In diesem Kapitel machst du aus Tabellen der Umfrage zu Milch und Schokolade Abbildungen, und kannst danach:"
  goals:
    - "die Verteilung einer Zahl mit einem Histogramm zeigen und eine Klassenbreite wählen, die ihre Form sichtbar macht"
    - "eine Kategorie und eine Frage mit Mehrfachantworten als Balkendiagramm zeigen, in einer Reihenfolge, die zur Variable passt"
    - "gestapelte, nebeneinanderstehende und auf 100 Prozent gestapelte Balken vergleichen und begründen, welche Form eine Frage beantwortet"
    - "Gruppen mit Boxplots und mit kleinen Vielfachen (`facet_wrap()`) nebeneinanderstellen"
    - "jede Abbildung mit `labs()` so beschriften, dass ein Mensch sie ohne deinen Code versteht, und eine Achse erkennen, die täuscht"
level: 1
duration: 150
topics: [visualising-data, exploring-data]
modules: [pmg]
areas: [ds]
r_datasets: { survey: mds12_schoko_milch.csv }
relations:
  requires: [survey-exercise-comparing-groups]
  see_also: [milk-chocolate-survey, r-for-data-science, fundamentals-of-data-visualization]
status: draft
updated: 2026-11-11
---

Die Leitfrage des Selbststudiums bleibt dieselbe: Wo kaufen die Befragten
ein, und wer kauft Bio? In den Kapiteln 2 und 3 hast du sie mit Tabellen
beantwortet, und in diesem Kapitel machst du daraus Abbildungen. Zwei Fragen
begleiten dich bei jeder: Welche Form passt zur Frage und zur Art der
Variable, und versteht ein Mensch die Abbildung, ohne deinen Code zu sehen?
Deshalb bekommt jede Abbildung mit `labs()` deutsche Beschriftungen statt
Variablennamen, so wie sie in deinem Bericht stehen würden.

In den Kästen liegt die ganze [[milk-chocolate-survey]] als `survey` bereit,
mit 2.811 Zeilen und 606 Spalten, und das tidyverse ist geladen. Jeder Kasten
läuft für sich. Spalten, die du in den Kapiteln 2 und 3 gebildet hast, etwa
`city_size` oder `organic_share`, stehen deshalb schon im Startcode der
Aufgabe, die sie braucht.

Vor dem Kapitel lohnt sich ein Blick in [[r-for-data-science]]: die
[ersten Schritte, Verteilungen und Zusammenhänge](https://r4ds.hadley.nz/data-visualize.html#first-steps)
(1.2 bis 1.5), die Abschnitte zu
[geometrischen Objekten](https://r4ds.hadley.nz/layers.html#sec-geometric-objects),
Facetten und Positionen (9.3, 9.4, 9.6) und zu
[Beschriftungen](https://r4ds.hadley.nz/communication.html#labels) (11.2).
Welche Abbildung wofür taugt, zeigt Claus Wilke im
[Directory of Visualizations](https://clauswilke.com/dataviz/directory-of-visualizations.html)
seines Buchs [[fundamentals-of-data-visualization]].

## Eine Variable zeigen

1. **4.1** Zeichne ein Histogramm des Alters (`Q002alter`) mit
   `geom_histogram()` und beschrifte beide Achsen. Probiere `binwidth = 1`,
   `5` und `10` aus und beschreib in zwei Sätzen, welche Breite die
   Verteilung am besten zeigt und was du siehst: Form, Spitzen und Grenzen.

```r
survey
```

> [!HINT]
> `binwidth` gehört in die Klammer von `geom_histogram()`, und mit `labs(x =
> …, y = …)` ersetzt du die Variablennamen an den Achsen. Lies dazu in R4DS
> den Abschnitt
> [Visualizing distributions](https://r4ds.hadley.nz/data-visualize.html#visualizing-distributions)
> (1.4).

> [!SOLUTION]
> ```r
> survey |>
>   ggplot() +
>   aes(x = Q002alter) +
>   geom_histogram(binwidth = 5) +
>   labs(x = "Alter in Jahren", y = "Anzahl der Befragten")
> ```
>
> Mit einer Breite von 5 Jahren ist die Form am klarsten: Unter 23 Jahren
> gibt es nur wenige Befragte, zwischen 28 und 52 Jahren liegen die Balken
> etwa gleich hoch, zwischen 53 und 62 Jahren am höchsten, und danach fällt
> die Verteilung ab, bis sie bei 75 Jahren fast endet. Die Grenzen zeigt erst
> `binwidth = 1`: Bei 29 Jahren sind es 76 Befragte, bei 30 nur noch 39, genau
> an der Grenze der Altersgruppen 18-29 und 30-44 (`Q002altergru4f`), und
> nach 74 Jahren mit 37 Befragten folgen nur noch 7 ältere bis 80 Jahre. Eine
> Breite von 10 Jahren glättet dagegen so stark, dass von beidem nichts mehr
> zu sehen ist.

2. **4.2** Zeichne ein Balkendiagramm der Befragten je Wohnortgröße
   (`city_size`) in der Reihenfolge des Codebuchs, von der Großstadt bis zum
   Dorf. Lass die 7 Befragten ohne Angabe weg und schreib in einem Kommentar
   im Code, dass du es machst. Begründe in einem Satz, warum du die Balken
   hier nicht nach Häufigkeit sortierst.

```r
survey |>
  mutate(
    city_size = factor(D044stadtf, levels = c(
      "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
      "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
    ))
  )
```

> [!HINT]
> Der Startcode bildet `city_size` so wie in Kapitel 2, Aufgabe 2.3: als
> Faktor, dessen Stufen die Reihenfolge festlegen. Hänge `filter()` und dann
> `ggplot()` mit `geom_bar()` an; `geom_bar()` zählt die Zeilen selbst.

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     ))
>   ) |>
>   # the 7 respondents without an answer on city size are left out
>   filter(!is.na(city_size)) |>
>   ggplot() +
>   aes(x = city_size) +
>   geom_bar() +
>   labs(x = "Größe des Wohnorts", y = "Anzahl der Befragten")
> ```
>
> Die Wohnortgröße ist ordinal, ihre Stufen haben also eine Reihenfolge von
> groß nach klein, und eine Sortierung nach Häufigkeit würde diese Ordnung
> zerreißen, sodass niemand mehr sieht, wie sich die Zahl der Befragten
> vom Großstadt- zum Dorfende verändert. Mit 1.042 Befragten ist die
> Großstadt die häufigste Kategorie, mit 188 die Kleinstadt unter 5.000
> Einwohnern die seltenste.

3. **4.3** Zeig die Einkaufsorte als liegende Balken, einen Balken je Ort,
   sortiert nach dem Anteil und mit der x-Achse in Prozent. Der Startcode ist
   die Tabelle `places` aus Kapitel 2, Aufgabe 2.7. Weil Spaltennamen wie
   `v008ort_5markt` niemand versteht, legst du davor eine kleine Tabelle
   `place_labels` mit den Spalten `place` und `label` an und verbindest
   beide mit `left_join()`.

```r
places <- survey |>
  summarize(across(v008ort_1discount:v008ort_9online, mean)) |>
  pivot_longer(everything(), names_to = "place", values_to = "share") |>
  mutate(pct = 100 * share)

places
```

> [!HINT]
> Die Bezeichnungen stehen im Codebuch auf Seite 8; das Codebuch
> (`data/M3b_Musterstudie-quantitativ.pdf`) gibt es nur in deinem
> Kursordner. Kurz gefasst lauten sie, in der Reihenfolge der Spalten:
> Discounter, Supermarkt, Verbrauchermarkt oder SB-Warenhaus, Fachgeschäft,
> Wochenmarkt, Hofladen, Bioladen oder Reformhaus, online bei Discounter
> oder Supermarkt, Onlinelebensmittelhändler. Eine kleine Tabelle schreibst
> du am bequemsten mit `tribble()` Zeile für Zeile. Liegende Balken
> bekommst du, wenn der Ort auf der y-Achse steht, und `fct_reorder(label,
> pct)` sortiert ihn nach dem Anteil. Lies dazu in R4DS
> [Basic joins](https://r4ds.hadley.nz/joins.html#sec-mutating-joins) (19.3)
> und
> [Modifying factor order](https://r4ds.hadley.nz/factors.html#sec-modifying-factor-order)
> (16.4).

> [!SOLUTION]
> ```r
> place_labels <- tribble(
>   ~place, ~label,
>   "v008ort_1discount", "Discounter",
>   "v008ort_2super", "Supermarkt",
>   "v008ort_3sbmarkt", "Verbrauchermarkt, SB-Warenhaus",
>   "v008ort_4fach", "Fachgeschäft",
>   "v008ort_5markt", "Wochenmarkt",
>   "v008ort_6hof", "Hofladen",
>   "v008ort_7bioladen", "Bioladen, Reformhaus",
>   "v008ort_8onlineds", "Online bei Discounter oder Supermarkt",
>   "v008ort_9online", "Onlinelebensmittelhändler"
> )
>
> places <- survey |>
>   summarize(across(v008ort_1discount:v008ort_9online, mean)) |>
>   pivot_longer(everything(), names_to = "place", values_to = "share") |>
>   mutate(pct = 100 * share)
>
> places |>
>   left_join(place_labels, by = join_by(place)) |>
>   ggplot() +
>   aes(x = pct, y = fct_reorder(label, pct)) +
>   geom_col() +
>   labs(x = "Anteil der Befragten, die dort einkaufen (%)", y = NULL)
> ```
>
> Weil die Tabelle die Anteile schon enthält, zeichnet `geom_col()` sie
> direkt, statt wie `geom_bar()` Zeilen zu zählen. Vorn liegen der
> Supermarkt mit 75,9 und der Discounter mit 73,5 Prozent, ganz hinten der
> Onlinelebensmittelhändler mit 6,2 Prozent. Zusammen ergeben die Balken
> weit mehr als 100 Prozent, denn jede Person konnte mehrere Orte nennen,
> und jeder Anteil bezieht sich auf die Befragten, nicht auf die Nennungen.
> `y = NULL` lässt die Achsenbeschriftung weg, weil die Ortsnamen für sich
> sprechen.

## Gruppen vergleichen

4. **4.4** Zeig, wie sich der Bio-Anteil (`organic_share`) in den vier
   Einkommensgruppen (`income_group`) verteilt. Der Startcode bildet beide
   Spalten wie in den Kapiteln 2 und 3, lässt Befragte ohne Angabe bei einer
   der beiden weg und zeichnet die gestapelte Fassung. Ändere ihn zweimal,
   zuerst mit `position = "dodge"` (nebeneinander) und dann mit
   `position = "fill"` (gestapelt auf 100 Prozent), und beschreib in zwei
   Sätzen, welche der drei Fassungen die Frage „Kaufen Menschen mit mehr
   Einkommen mehr Bio?“ am besten beantwortet und welche irreführend wäre.

```r
survey |>
  mutate(
    organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
      "(fast) nie Bio", "deutlich weniger als die Hälfte", "etwa die Hälfte",
      "deutlich mehr als die Hälfte", "(fast) nur Bio"
    )),
    income_group = case_when(
      d049einkommen <= 4 ~ "unter 2.000 €",
      d049einkommen <= 7 ~ "2.000 bis unter 3.500 €",
      d049einkommen <= 10 ~ "3.500 bis unter 5.000 €",
      d049einkommen == 11 ~ "5.000 € und mehr"
    ),
    income_group = fct_relevel(
      income_group, "unter 2.000 €", "2.000 bis unter 3.500 €",
      "3.500 bis unter 5.000 €", "5.000 € und mehr"
    )
  ) |>
  filter(!is.na(income_group), !is.na(organic_share)) |>
  ggplot() +
  aes(x = income_group, fill = organic_share) +
  geom_bar() +
  labs(x = "Netto-Haushaltseinkommen", y = "Anzahl der Befragten", fill = "Bio-Anteil am Einkauf")
```

> [!HINT]
> `position` gehört in die Klammer von `geom_bar()`. Achte beim Vergleichen
> darauf, wie viele Befragte in jeder Einkommensgruppe stecken, und frag
> dich, ob die Höhe eines Balkens dann noch etwas über Bio aussagt. Lies
> dazu in R4DS
> [Position adjustments](https://r4ds.hadley.nz/layers.html#position-adjustments)
> (9.6).

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
>       "(fast) nie Bio", "deutlich weniger als die Hälfte", "etwa die Hälfte",
>       "deutlich mehr als die Hälfte", "(fast) nur Bio"
>     )),
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
>   filter(!is.na(income_group), !is.na(organic_share)) |>
>   ggplot() +
>   aes(x = income_group, fill = organic_share) +
>   geom_bar(position = "fill") +
>   labs(x = "Netto-Haushaltseinkommen", y = "Anteil innerhalb der Einkommensgruppe", fill = "Bio-Anteil am Einkauf")
> ```
>
> Die Frage vergleicht Anteile, deshalb beantwortet sie die Fassung mit
> `position = "fill"` am besten: Jeder Balken reicht bis 100 Prozent, und
> man sieht, dass der Anteil derer, die (fast) nie Bio kaufen, von 28,0
> Prozent unter 2.000 € auf 15,9 Prozent ab 5.000 € sinkt. Irreführend wären
> die gestapelte und die nebeneinanderstehende Fassung, weil sie Anzahlen
> zeigen und die Gruppen sehr verschieden groß sind: In der obersten
> Einkommensgruppe stecken nur 289 Befragte, in der zweiten 920, sodass dort
> jedes Segment klein aussieht, obwohl die oberste Gruppe anteilig am meisten
> Bio kauft. Insgesamt bleiben 2.694 Befragte mit beiden Angaben; in Kapitel
> 3 waren es in der obersten Gruppe 291, weil dort der Bio-Anteil keine Rolle
> spielte und 2 von ihnen ihn nicht angegeben haben.

5. **4.5** Zeichne Boxplots des Alters je Stufe von `organic_share` mit
   `geom_boxplot()`, die Stufen auf der y-Achse, damit die langen Texte
   lesbar bleiben. Beschreib dann in zwei Sätzen, ob die Befragten, die viel
   Bio kaufen, jünger oder älter sind, was ein Boxplot zeigt und was er
   verbirgt, und wie viele Menschen in der Gruppe „(fast) nur Bio“ stecken.

```r
survey |>
  mutate(
    organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
      "(fast) nie Bio", "deutlich weniger als die Hälfte", "etwa die Hälfte",
      "deutlich mehr als die Hälfte", "(fast) nur Bio"
    ))
  )
```

> [!HINT]
> Leg das Alter auf `x` und `organic_share` auf `y`, dann liegen die Boxen
> waagerecht. Wie viele Menschen in einer Gruppe stecken, verrät dir der
> Boxplot nicht; dafür brauchst du `count(organic_share)` in einem eigenen
> Lauf. Lies dazu in R4DS
> [Visualizing relationships](https://r4ds.hadley.nz/data-visualize.html#visualizing-relationships)
> (1.5).

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     organic_share = factor(v032bioanteil, levels = 1:5, labels = c(
>       "(fast) nie Bio", "deutlich weniger als die Hälfte", "etwa die Hälfte",
>       "deutlich mehr als die Hälfte", "(fast) nur Bio"
>     ))
>   ) |>
>   filter(!is.na(organic_share)) |>
>   ggplot() +
>   aes(x = Q002alter, y = organic_share) +
>   geom_boxplot() +
>   labs(x = "Alter in Jahren", y = "Bio-Anteil am Einkauf")
> ```
>
> Wer mehr Bio kauft, ist im Mittel etwas jünger: Der Median liegt bei 52
> Jahren in den beiden Gruppen mit wenig Bio und bei 44 Jahren in der Gruppe
> „(fast) nur Bio“, aber die Boxen überlappen sich weit. Ein Boxplot zeigt
> Median, die beiden Quartile und den Bereich der übrigen Werte, hier ohne
> Ausreißer, verbirgt aber, wie viele
> Menschen dahinterstecken und wie sich ihr Alter innerhalb der Box verteilt;
> in der Gruppe „(fast) nur Bio“ sind es nur 111 Befragte, in der Gruppe
> „deutlich weniger als die Hälfte“ dagegen 938.

6. **4.6** Zeig den Anteil, der im Hofladen und auf dem Wochenmarkt
   einkauft, je Wohnortgröße als zwei Balkendiagramme nebeneinander. Der
   Startcode ist die Tabelle aus Kapitel 3, Aufgabe 3.3. Bring die beiden
   Anteile mit `pivot_longer()` untereinander, eine Spalte für den Ort und
   eine für den Anteil, und teile die Abbildung mit `facet_wrap()`.
   Beschreib in einem Satz, was die Abbildung schneller zeigt als die
   Tabelle.

```r
survey |>
  mutate(
    city_size = factor(D044stadtf, levels = c(
      "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
      "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
    ))
  ) |>
  # the 7 respondents without an answer on city size are left out
  filter(!is.na(city_size)) |>
  group_by(city_size) |>
  summarize(
    n = n(),
    farm_shop = 100 * mean(v008ort_6hof),
    market = 100 * mean(v008ort_5markt)
  )
```

> [!HINT]
> `pivot_longer(c(farm_shop, market), names_to = "place", values_to =
> "pct")` macht aus den zwei Spalten zwei Zeilen je Wohnortgröße. Damit über
> den Teilen „Hofladen“ und „Wochenmarkt“ steht statt der Spaltennamen,
> übersetzt du sie danach mit `mutate()` und `if_else()`. `facet_wrap(vars(place))`
> zeichnet dann je Ort ein eigenes Diagramm mit derselben Achse. Lies dazu
> in R4DS [Facets](https://r4ds.hadley.nz/layers.html#facets) (9.4).

> [!SOLUTION]
> ```r
> survey |>
>   mutate(
>     city_size = factor(D044stadtf, levels = c(
>       "Großstadt", "Große Mittelstadt", "Große Kleinstadt",
>       "Kleinstadt >5000", "Kleinstadt <5000", "Dorf"
>     ))
>   ) |>
>   # the 7 respondents without an answer on city size are left out
>   filter(!is.na(city_size)) |>
>   group_by(city_size) |>
>   summarize(
>     n = n(),
>     farm_shop = 100 * mean(v008ort_6hof),
>     market = 100 * mean(v008ort_5markt)
>   ) |>
>   pivot_longer(c(farm_shop, market), names_to = "place", values_to = "pct") |>
>   mutate(place = if_else(place == "farm_shop", "Hofladen", "Wochenmarkt")) |>
>   ggplot() +
>   aes(x = pct, y = city_size) +
>   geom_col() +
>   facet_wrap(vars(place)) +
>   labs(x = "Anteil der Befragten, die dort einkaufen (%)", y = "Größe des Wohnorts")
> ```
>
> Die Abbildung zeigt auf einen Blick, dass die beiden Orte gegenläufig sind:
> Zum Hofladen gehen in der Großstadt 11,9 Prozent und im Dorf 17,8 Prozent,
> auf den Wochenmarkt in der Großstadt 19,0 Prozent und im Dorf nur 13,1
> Prozent, während man in der Tabelle zwei Zahlenreihen Zeile für Zeile
> vergleichen muss, um das zu sehen.

## Eine Abbildung, die täuscht

7. **4.7** Der Startcode ist die Abbildung der Einkaufsorte aus Aufgabe 4.3,
   als `plot_places` gespeichert. Lass die x-Achse erst bei 5 Prozent
   beginnen, indem du `+ coord_cartesian(xlim = c(5, NA), expand = FALSE)`
   anhängst, und vergleiche die Abbildung mit der aus 4.3. Beschreib in zwei
   Sätzen, wie viel länger der Balken „Supermarkt“ gegenüber
   „Onlinelebensmittelhändler“ jetzt aussieht, wie viel größer der Anteil
   wirklich ist und warum Balken bei null beginnen müssen.

```r
place_labels <- tribble(
  ~place, ~label,
  "v008ort_1discount", "Discounter",
  "v008ort_2super", "Supermarkt",
  "v008ort_3sbmarkt", "Verbrauchermarkt, SB-Warenhaus",
  "v008ort_4fach", "Fachgeschäft",
  "v008ort_5markt", "Wochenmarkt",
  "v008ort_6hof", "Hofladen",
  "v008ort_7bioladen", "Bioladen, Reformhaus",
  "v008ort_8onlineds", "Online bei Discounter oder Supermarkt",
  "v008ort_9online", "Onlinelebensmittelhändler"
)

plot_places <- survey |>
  summarize(across(v008ort_1discount:v008ort_9online, mean)) |>
  pivot_longer(everything(), names_to = "place", values_to = "share") |>
  mutate(pct = 100 * share) |>
  left_join(place_labels, by = join_by(place)) |>
  ggplot() +
  aes(x = pct, y = fct_reorder(label, pct)) +
  geom_col() +
  labs(x = "Anteil der Befragten, die dort einkaufen (%)", y = NULL)

plot_places
```

> [!HINT]
> `expand = FALSE` verhindert, dass ggplot2 links und rechts einen kleinen
> Rand anfügt, sodass die Achse wirklich bei 5 beginnt. Für den Vergleich
> brauchst du die beiden Anteile aus der Lösung von 4.3 und die Länge der
> Balken, die nach dem Abschneiden übrig bleibt. Lies dazu in R4DS
> [Coordinate systems](https://r4ds.hadley.nz/layers.html#coordinate-systems)
> (9.7).

> [!SOLUTION]
> ```r
> place_labels <- tribble(
>   ~place, ~label,
>   "v008ort_1discount", "Discounter",
>   "v008ort_2super", "Supermarkt",
>   "v008ort_3sbmarkt", "Verbrauchermarkt, SB-Warenhaus",
>   "v008ort_4fach", "Fachgeschäft",
>   "v008ort_5markt", "Wochenmarkt",
>   "v008ort_6hof", "Hofladen",
>   "v008ort_7bioladen", "Bioladen, Reformhaus",
>   "v008ort_8onlineds", "Online bei Discounter oder Supermarkt",
>   "v008ort_9online", "Onlinelebensmittelhändler"
> )
>
> plot_places <- survey |>
>   summarize(across(v008ort_1discount:v008ort_9online, mean)) |>
>   pivot_longer(everything(), names_to = "place", values_to = "share") |>
>   mutate(pct = 100 * share) |>
>   left_join(place_labels, by = join_by(place)) |>
>   ggplot() +
>   aes(x = pct, y = fct_reorder(label, pct)) +
>   geom_col() +
>   labs(x = "Anteil der Befragten, die dort einkaufen (%)", y = NULL)
>
> plot_places +
>   coord_cartesian(xlim = c(5, NA), expand = FALSE)
> ```
>
> Wirklich ist der Anteil beim Supermarkt mit 75,9 Prozent rund zwölfmal so
> groß wie beim Onlinelebensmittelhändler mit 6,2 Prozent, aber ab 5 Prozent
> bleiben von den Balken nur 70,9 und 1,2 Prozentpunkte übrig, sodass der
> eine gut sechzigmal so lang aussieht wie der andere. Ein Balken zeigt
> seinen Wert durch seine Länge, und nur wenn alle bei null beginnen, sind
> die Längen so zueinander wie die Werte; ohne `expand = FALSE` beginnt die
> Achse wegen des Rands schon bei etwa 1,5 Prozent, und der Effekt ist mit
> einem Verhältnis von rund 16 zu 1 kleiner, aber immer noch falsch.

## Wie es weitergeht

Wenn du an einer Abbildung hängen bleibst, hilft dir der
[[opencode-course-assistant|Kursassistent]] in deinem Kursordner weiter,
und im nächsten Kapitel, [[survey-exercise-own-question]], beantwortest du
mit Tabellen und Abbildungen eine Frage an die Umfrage selbst.
