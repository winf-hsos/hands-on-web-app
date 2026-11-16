---
type: exercise
code: 8489
title: Von der Frage zum Diagramm
summary: >-
  Sechs Fragen an die kompakte Milchumfrage, und zu jeder wählst du selbst die
  Spalten und das Diagramm, das sie beantwortet, vom Alter je Ernährungsweise
  bis zum Markenexperiment; am Ende machst du eine Abbildung für eine
  Hausarbeit fertig.
objectives:
  intro: "In dieser Übung beantwortest du Fragen an die Milchumfrage mit Diagrammen, die du selbst auswählst, und kannst danach:"
  goals:
    - "zu einer Frage an Umfragedaten die Spalten finden, die sie beantworten, und die Skala jeder Spalte bestimmen"
    - "aus den Skalen zweier Variablen das passende Diagramm wählen, etwa Boxplots nebeneinander oder gestapelte Balken auf 100 %, und die Wahl in einem Satz begründen"
    - "ordinale Variablen mit `factor()` in die Reihenfolge ihrer Skala bringen und nominale Gruppen mit `fct_reorder()` nach einem Wert sortieren"
    - "fehlende Werte ausdrücklich mit `filter()` weglassen und in `caption` sagen, wer fehlt und warum"
    - "eine Abbildung mit einem Titel, der die Aussage nennt, einer Quelle und einem Theme fertig machen und mit `ggsave()` in einer Größe für eine Hausarbeit speichern"
level: 1
duration: 45
topics: [visualising-data]
modules: [ea]
areas: [ds]
relations:
  requires: [data-visualisation-basics]
  see_also: [which-chart, milk-survey-compact]
status: published
updated: 2026-11-16
---

Die Aufgaben am Ende der Lektion [[data-visualisation-basics]] nennen das
Diagramm schon, etwa „als Balken in der Reihenfolge der Skala“. In dieser
Übung ist es umgekehrt: Jede Aufgabe stellt eine Frage an die
[[milk-survey-compact|kompakte Milchumfrage]], und du entscheidest selbst,
welche Spalten sie beantworten und welches Diagramm zu ihnen passt. Dabei
hilft dir die Frage, mit der die Lektion beginnt, nämlich welche Skala jede
der beiden Variablen hat. Wenn du unsicher bist, führt dich der Demonstrator
[[which-chart]] mit ein paar Fragen zum passenden Diagramm und gibt dir eine
Vorlage in R aus.

In den Kästen liegt die Umfrage als `survey` bereit. Jeder Startcode enthält
schon den Rahmen aus `survey |>`, `filter()`, `ggplot()`, `aes()` und
`labs()` und läuft so, wie er dasteht, mit einer leeren Fläche als Ergebnis.
Das Geom fehlt mit Absicht, weil seine Wahl zur Aufgabe gehört; du schreibst
es an die Stelle des Kommentars. Fehlende Werte lässt du ausdrücklich mit
`filter()` weg und sagst in `caption`, wer fehlt und warum, denn in dieser
Umfrage heißt fehlend meist „nicht gefragt“.

## Alter und Ernährung

1. Wie alt sind die Befragten, die sich vegetarisch oder vegan ernähren, im
   Vergleich zu den anderen? Wähle Spalten und ein Diagramm, das die
   Altersverteilung aller fünf Ernährungsweisen nebeneinanderstellt, und
   lass die Befragten ohne Angabe zur Ernährung weg.

```r
survey |>
  filter() |>
  ggplot() +
  aes() +
  # choose a geom that fits the scales and write it here
  labs()
```

> [!HINT]
> Das Alter (`age`) ist eine Zahl, die Ernährungsweise (`diet`) eine
> Kategorie ohne Reihenfolge, und für eine Zahl je Gruppe kennst du aus der
> Lektion ein Diagramm, das wenig Platz braucht. Mit `fct_reorder(diet, age)`
> sortierst du die Gruppen nach ihrem Median. Zur Kontrolle: Der Median liegt
> bei den Vegetariern bei 38 Jahren, bei den Veganern bei 41 und bei den
> Allesessern und Flexitariern bei 51; es bleiben 2.781 Befragte, weil 28
> keine Ernährungsweise angegeben haben.

## Milch in Stadt und Dorf

2. Wird in der Großstadt seltener Milch getrunken als auf dem Dorf? Zeig für
   jede Wohnortgröße (`town_size`), wie oft im Haushalt Milch getrunken wird
   (`milk_freq`), und zwar so, dass sich die Wohnorte trotz ihrer
   verschiedenen Größe vergleichen lassen.

```r
survey |>
  filter() |>
  mutate() |>
  ggplot() +
  aes() +
  # choose a geom that fits the scales and write it here
  labs()
```

> [!HINT]
> Beide Spalten sind ordinal und kommen als Text aus der Datei, deshalb
> bringst du sie in `mutate()` mit `factor()` und `levels` in die
> Reihenfolge ihrer Skala, `town_size` von `city` über `large town`, `town`,
> `small town` und `very small town` bis `village`. Weil in der Großstadt
> fast dreimal so viele Befragte wohnen wie im Dorf, vergleichst du Anteile
> statt Anzahlen. Zur Kontrolle: Im Haushalt von 60,1 % der Befragten in der
> Großstadt wird täglich Milch getrunken, auf dem Dorf bei 61,9 %, und es
> bleiben 2.378 Befragte.

## Fleisch bei Allesessern und Flexitariern

3. Lieben Allesesser Fleisch wirklich mehr als Flexitarier? Zeig für diese
   beiden Gruppen, wie sie der Aussage „Ich liebe Mahlzeiten mit Fleisch“
   (`loves_meat`, −2 bis +2) zustimmen. Die Vegetarier, Veganer und
   Pescetarier lässt du weg, weil die Frage nur die beiden Gruppen
   vergleicht, die Fleisch essen, und das sagst du in `caption`.

```r
survey |>
  filter() |>
  ggplot() +
  aes() +
  # choose a geom that fits the scales and write it here
  labs()
```

> [!HINT]
> `diet %in% c("omnivore", "flexitarian")` behält genau die beiden Gruppen
> und verwirft dabei auch die Zeilen ohne Angabe zur Ernährung.
> `loves_meat` ist eine Ratingskala, die als Zahl in der Tabelle steht; damit
> `fill` fünf Stufen statt eines Farbverlaufs zeigt, schreibst du in `aes()`
> `factor(loves_meat)`. Zur Kontrolle: 74,9 % der Allesesser stimmen mit +1
> oder +2 zu, aber nur 33,9 % der Flexitarier, und es bleiben 1.823
> Allesesser und 747 Flexitarier.

## TikTok und Alter

4. Wer TikTok täglich nutzt, ist jünger, aber wie viel jünger? Zeig das Alter
   für jede Stufe der Nutzung (`tiktok`, von `daily` bis `never`). Die Frage
   nach den Medien hat nur etwa die Hälfte der Befragten bekommen, und das
   gehört in `caption`.

```r
survey |>
  filter() |>
  mutate() |>
  ggplot() +
  aes() +
  # choose a geom that fits the scales and write it here
  labs()
```

> [!HINT]
> Die Nutzung ist ordinal, mit den Stufen `daily`, `weekly`, `monthly`,
> `rarely` und `never`, und das Alter eine Zahl. Das ist dieselbe Kombination
> wie in Aufgabe 1, nur dass die Gruppen hier die Reihenfolge ihrer Skala
> behalten, statt nach dem Median sortiert zu werden. Zur Kontrolle: 1.367
> Befragte wurden gefragt und 1.442 nicht, und der Median des Alters liegt
> bei täglicher Nutzung bei 35 Jahren und bei `never` bei 54.

## Das Markenexperiment

5. Bewerten die Befragten die sieben Milchmarken unterschiedlich? Wer an
   diesem Teil der Befragung teilnahm, bekam eine von sieben Marken
   (`rated_brand`) gezeigt und bewertete ihre Qualität (`brand_quality`, −2
   bis +2). Welche Marke jemand sah, hat der Zufall entschieden, und deshalb
   ist das ein Experiment, in dem Unterschiede zwischen den Marken auf die
   Marke zurückgehen und nicht auf die Menschen, die sie bewertet haben. Zeig
   die Bewertungen je Marke so, dass die Marke mit den besten Bewertungen
   oben steht.

```r
survey |>
  filter() |>
  ggplot() +
  aes() +
  # choose a geom that fits the scales and write it here
  labs()
```

> [!HINT]
> Die Marke ist nominal und darf deshalb nach den Bewertungen sortiert
> werden: `fct_reorder(rated_brand, brand_quality, .fun = mean)` ordnet sie
> nach der mittleren Bewertung, und weil bei liegenden Balken die erste Stufe
> unten steht, landet die beste Marke oben. Die Bewertung kommt wie in
> Aufgabe 3 mit `factor()` in `fill`. Zur Kontrolle: Bei Bärenmarke geben
> 71,6 % eine +1 oder +2, bei Oatly 46,6 %, und es bleiben 2.309
> Bewertungen, weil 478 Befragte keine Marke gezeigt bekamen und 22 die
> gezeigte nicht bewertet haben.

## Eine Abbildung fertig machen

6. Wähle eine deiner Abbildungen aus den Aufgaben 1 bis 5 und mach sie für
   eine Hausarbeit fertig: mit einem Titel, der die Aussage nennt statt nur
   das Thema, einer `caption` mit der Quelle und mit dem, was du weggelassen
   hast, einem Theme wie `theme_minimal()` und gespeichert mit `ggsave()` in
   einer Größe, die auf eine Seite passt.

```r
final_plot <- survey |>
  filter() |>
  ggplot() +
  aes() +
  labs(
    title = "",
    caption = ""
  ) +
  theme_minimal()

ggsave("figure.png", final_plot, width = 16, height = 10, units = "cm")

final_plot
```

> [!HINT]
> Kopiere den Code deiner Abbildung an die Stelle von `filter()` bis
> `aes()` und ergänze in `labs()` die Achsen. Ein Titel, der die Aussage
> nennt, ist ein Satz wie „Vegetarians are the youngest group“ statt „Age by
> diet“. Eine A4-Seite hat mit üblichen Rändern rund 16 cm Platz in der
> Breite; speicherst du die Abbildung in dieser Breite, muss sie in der
> Arbeit nicht verkleinert werden, und die Schrift erscheint etwa so groß
> wie der Text.

## Zum Nachdenken

- In Aufgabe 1 sind die Boxen der 36 Veganer und der 1.826 Allesesser gleich
  breit. Was verrät das Diagramm über die Größe der Gruppen, und wie würdest
  du sie sichtbar machen?
- Aufgabe 2 zeigt kaum einen Unterschied zwischen Stadt und Dorf. Wie
  lautet ein Titel, der dieses Ergebnis ehrlich nennt, und warum ist auch
  das eine Aussage?
- Warum darfst du nach Aufgabe 5 sagen, dass die Marke die Bewertung
  verändert, nach Aufgabe 1 aber nicht, dass jüngere Menschen sich wegen
  ihres Alters vegetarisch ernähren?

## Lösungen

> [!SOLUTION]
> Aufgabe 1:
>
> ```r
> survey |>
>   filter(!is.na(diet)) |>
>   ggplot() +
>   aes(x = age, y = fct_reorder(diet, age)) +
>   geom_boxplot() +
>   labs(
>     x = "Age in years", y = NULL,
>     caption = "28 respondents without an answer on diet left out"
>   )
> ```
>
> Eine Zahl je Gruppe zeigen Boxplots nebeneinander am knappsten, und weil
> die Ernährungsweise nominal ist, darfst du die Gruppen nach dem Median
> sortieren. Die Vegetarier sind mit einem Median von 38 Jahren die jüngste
> Gruppe und die Veganer mit 41 Jahren die zweitjüngste, während Allesesser,
> Flexitarier und Pescetarier mit 51, 51 und 52 Jahren fast gleich alt sind.
> Der Boxplot verschweigt aber, dass hinter den Boxen der Veganer und der
> Pescetarier nur je 36 Personen stehen; Histogramme mit `facet_wrap(~ diet)`
> zeigen das, weil die kleinen Gruppen dort kaum Balken haben.

> [!SOLUTION]
> Aufgabe 2:
>
> ```r
> survey |>
>   filter(!is.na(milk_freq), !is.na(town_size)) |>
>   mutate(
>     town_size = factor(town_size, levels = c(
>       "city", "large town", "town", "small town", "very small town", "village"
>     )),
>     milk_freq = factor(milk_freq, levels = c(
>       "daily", "weekly", "monthly", "rarely"
>     ))
>   ) |>
>   ggplot() +
>   aes(y = town_size, fill = milk_freq) +
>   geom_bar(position = "fill") +
>   labs(
>     x = "Share of respondents", y = NULL, fill = "Milk at home",
>     caption = "424 respondents not asked about milk and 7 without a town size left out"
>   )
> ```
>
> Zwei Kategorien vergleichst du mit gestapelten Balken auf 100 %, und weil
> beide ordinal sind, behalten Balken und Farben die Reihenfolge ihrer
> Skala. Die Antwort ist nein: In allen sechs Wohnortgrößen wird bei 56 bis
> 64 % der Befragten täglich Milch getrunken, in der Großstadt bei 60,1 % und
> auf dem Dorf bei 61,9 %, und die kleinen Unterschiede folgen keiner
> Richtung vom großen zum kleinen Ort. Nicht gefragt wurde, wer in den
> letzten zwölf Monaten keine Milch verzehrt hat, und das sind die 424
> fehlenden Antworten.

> [!SOLUTION]
> Aufgabe 3:
>
> ```r
> survey |>
>   filter(diet %in% c("omnivore", "flexitarian"), !is.na(loves_meat)) |>
>   ggplot() +
>   aes(y = diet, fill = factor(loves_meat)) +
>   geom_bar(position = "fill") +
>   labs(
>     x = "Share of respondents", y = NULL,
>     fill = "\"I love meals\nwith meat\"\n(-2 to +2)",
>     caption = "Only omnivores and flexitarians; 5 of them without a rating left out"
>   )
> ```
>
> Eine Ratingskala je Gruppe zeigst du als gestapelte Balken auf 100 %, weil
> ihre Stufen geordnete Kategorien sind und Anteile die verschieden großen
> Gruppen vergleichbar machen. Die Antwort ist ja, und zwar deutlich: 74,9 %
> der Allesesser stimmen zu, 38,7 % sogar mit +2, während es bei den
> Flexitariern 33,9 % und 8,0 % sind und die größte Gruppe von ihnen, 43,0 %,
> in der Mitte bei 0 bleibt.

> [!SOLUTION]
> Aufgabe 4:
>
> ```r
> survey |>
>   filter(!is.na(tiktok)) |>
>   mutate(tiktok = factor(tiktok, levels = c(
>     "daily", "weekly", "monthly", "rarely", "never"
>   ))) |>
>   ggplot() +
>   aes(x = tiktok, y = age) +
>   geom_boxplot() +
>   labs(
>     x = "Uses TikTok", y = "Age in years",
>     caption = "Only the 1,367 respondents who were asked about TikTok"
>   )
> ```
>
> Das Alter ist eine Zahl und die Nutzung ordinal, also stehen Boxplots in
> der Reihenfolge der Skala nebeneinander. Der Median steigt von 35 Jahren
> bei täglicher Nutzung über 40, 41 und 44 Jahre auf 54 Jahre bei `never`,
> sodass die täglichen Nutzer im Median 19 Jahre jünger sind als die, die
> TikTok nie nutzen; die Boxen überlappen sich aber, und ein Viertel der
> täglichen Nutzer ist 51 Jahre oder älter. Dass die Hälfte nicht gefragt
> wurde, verzerrt das Bild beim Alter vermutlich wenig, denn Gefragte und
> nicht Gefragte sind im Median gleich alt, 50 Jahre.

> [!SOLUTION]
> Aufgabe 5:
>
> ```r
> survey |>
>   filter(!is.na(brand_quality)) |>
>   ggplot() +
>   aes(
>     y = fct_reorder(rated_brand, brand_quality, .fun = mean),
>     fill = factor(brand_quality)
>   ) +
>   geom_bar(position = "fill") +
>   labs(
>     x = "Share of respondents", y = NULL, fill = "Quality\n(-2 to +2)",
>     caption = "Each respondent rated one brand drawn at random; 500 without a rating left out"
>   )
> ```
>
> Die Marke ist nominal und die Bewertung eine Ratingskala, also passen
> gestapelte Balken auf 100 % je Marke, nach der mittleren Bewertung
> sortiert. Fünf Marken liegen nah beieinander, von 71,6 % hohen Bewertungen
> (+1 oder +2) bei Bärenmarke bis 64,6 % bei Milchhof Müller regional, während
> Gut&Günstig mit 51,6 % und Oatly mit 46,6 % deutlich abfallen. Weil der
> Zufall die Marke zugeteilt hat, darfst du den Unterschied der Marke
> zuschreiben; ob er mehr ist als Zufall, beantwortet erst ein Test.

> [!SOLUTION]
> Aufgabe 6, hier mit der Abbildung aus Aufgabe 5:
>
> ```r
> final_plot <- survey |>
>   filter(!is.na(brand_quality)) |>
>   ggplot() +
>   aes(
>     y = fct_reorder(rated_brand, brand_quality, .fun = mean),
>     fill = factor(brand_quality)
>   ) +
>   geom_bar(position = "fill") +
>   labs(
>     title = "Oatly and Gut&Günstig are rated lowest for quality",
>     x = "Share of respondents", y = NULL, fill = "Quality\n(-2 to +2)",
>     caption = "Source: milk survey, compact. Each respondent rated one of seven brands drawn at random.\n2,309 ratings; 500 respondents without a rating left out."
>   ) +
>   theme_minimal()
>
> ggsave("brand_quality.png", final_plot, width = 16, height = 10, units = "cm")
>
> final_plot
> ```
>
> Die Form bleibt die aus Aufgabe 5, weil sie zu einer nominalen Marke und
> einer Ratingskala passt; neu sind nur der Titel, der den Befund nennt, die
> Quelle mit dem, was fehlt, das ruhigere Theme und die Datei. Mit 16 mal 10
> cm füllt die Abbildung die Breite einer A4-Seite, ohne dass die Schrift
> beim Einfügen kleiner wird.
