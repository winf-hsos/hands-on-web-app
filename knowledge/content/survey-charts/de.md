---
type: lesson
code: 5275
title: Befragungsdaten zeigen
summary: >-
  Befragungen bestehen aus Itembatterien, Ratingskalen, Ja-Nein-Fragen und
  Gruppen sehr unterschiedlicher Größe. Diese Lektion zeigt an der kompakten
  Milchbefragung, wie du mehrere Items in einem Diagramm vergleichst,
  Ratingskalen um die neutrale Mitte stapelst und Anteile so zeigst, dass die
  Fallzahl sichtbar bleibt.
objectives:
  intro: "In dieser Lektion lernst du, typische Befragungsdaten mit ggplot2 zu zeigen, und kannst danach:"
  goals:
    - "mehrere Items mit derselben Skala mit `pivot_longer()` in die lange Form bringen und als gestapelte Balken auf 100 % zeigen, sortiert nach Zustimmung"
    - "aus Zahlencodes einer Ratingskala geordnete Stufen mit lesbaren Namen machen und sie mit einer divergierenden Farbskala zeigen"
    - "eine Ratingskala als divergierende Balken um die neutrale Mitte zeichnen und sagen, was mit den neutralen Antworten geschieht"
    - "mehrere Ja-Nein-Fragen als Anteile statt als Anzahlen zeigen und begründen, warum ihre Anteile nicht zusammen 100 % ergeben"
    - "Anteile von Gruppen vergleichen und die Fallzahl jeder Gruppe in die Beschriftung schreiben"
level: 1
duration: 35
topics: [visualising-data]
modules: [ea]
areas: [ds]
relations:
  requires: [data-visualisation-basics, tidy-data]
status: published
updated: 2026-11-16
---

Fragebögen fragen selten nur eine Sache. In der kompakten Milchbefragung
stehen vier Aussagen, die fast alle der 2.809 Befragten auf derselben Skala von −2
(trifft überhaupt nicht zu) bis +2 (trifft voll und ganz zu) bewertet haben,
dazu zwei Fragen, die nur Ja oder Nein kennen, und Gruppen wie die
Ernährungsweisen, von denen eine 36 und eine andere 1.826 Personen umfasst.
Wie du eine einzelne Ratingskala als Balken zeigst, kennst du aus
[[data-visualisation-basics]]; hier geht es darum, mehrere Fragen in einem
Diagramm zu vergleichen, ohne dass dabei Zahlen verloren gehen, die zum
Verständnis gehören.

Alle Codekästen laufen im Browser mit der Tabelle `survey`, und du kannst
jeden ändern und neu ausführen.

## Eine Itembatterie auf einen Blick

Eine Itembatterie ist eine Reihe von Aussagen mit derselben Antwortskala. In
der Umfrage sind es vier:

| Spalte | Aussage |
|---|---|
| `eco_conscious` | „Ich würde mich selbst als umweltbewusst bezeichnen.“ |
| `prefers_organic` | „Beim Lebensmitteleinkauf bevorzuge ich Bio-Produkte.“ |
| `loves_meat` | „Ich liebe Mahlzeiten mit Fleisch.“ |
| `loves_cooking` | „Ich liebe es, zu kochen oder zu backen.“ |

### Erst in die lange Form

Für ggplot2 stehen die vier Items ungünstig, nämlich in vier Spalten
nebeneinander, während ein Diagramm mit einem Balken je Item eine Spalte
braucht, die sagt, um welches Item es geht, und eine zweite mit der Antwort.
`pivot_longer()` aus [[tidy-data]] stellt die Tabelle so um: Alle Spalten
außer `id` wandern untereinander, ihr Name kommt in die neue Spalte `item`
und ihr Wert in die Spalte `value`.

```r
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value")
```

Aus 2.809 Zeilen werden 11.236, vier je Person, denn jede Person steht jetzt
einmal je Item in der Tabelle.

### Gestapelt auf 100 %

Mit der langen Tabelle wird jedes Item ein Balken und jede Antwortstufe eine
Farbe. Damit die Legende Wörter statt Zahlen zeigt, macht `factor()` mit
`levels` und `labels` aus den Codes −2 bis +2 fünf geordnete Stufen mit
Namen. `position_fill(reverse = TRUE)` stapelt jeden Balken auf 100 % und
legt die Ablehnung nach links, denn ohne `reverse` stünde die erste Stufe am
rechten Ende.

```r
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value") |>
  filter(!is.na(value)) |>
  mutate(answer = factor(value, levels = c(-2, -1, 0, 1, 2), labels = c(
    "strongly disagree", "disagree", "neutral", "agree", "strongly agree"
  ))) |>
  ggplot() +
  aes(y = item, fill = answer) +
  geom_bar(position = position_fill(reverse = TRUE)) +
  scale_fill_brewer(palette = "PuOr") +
  labs(x = "Share of respondents", y = NULL, fill = NULL)
```

`scale_fill_brewer(palette = "PuOr")` wählt eine divergierende Farbskala: Von
einem hellen Grau in der Mitte wird sie zur einen Seite immer kräftiger
orange und zur anderen immer kräftiger lila, sodass man Ablehnung und
Zustimmung schon an der Farbe unterscheidet und die Stärke an ihrer
Sättigung. Eine Skala von Rot nach Grün läge nahe, aber Rot und Grün
verwechseln viele Menschen mit einer Farbsehschwäche, und beide Farben lesen
sich leicht als falsch und richtig. `filter(!is.na(value))` lässt die
fehlenden Antworten weg, je Item zwischen 5 und 11.

### Nach Zustimmung sortiert

Im letzten Diagramm stehen die Items alphabetisch, und um herauszufinden,
welcher Aussage die meisten zustimmen, musst du die Grenzen der lila Flächen
über alle Balken hinweg vergleichen. Sortiert nach dem Anteil der Zustimmung
wird daraus eine Rangfolge. `value > 0` ist für jede zustimmende Antwort
`TRUE`, der Mittelwert davon also der Anteil der Zustimmung, und
`fct_reorder()` ordnet die Items danach:

```r
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value") |>
  filter(!is.na(value)) |>
  mutate(
    item = fct_reorder(item, value > 0, .fun = mean),
    answer = factor(value, levels = c(-2, -1, 0, 1, 2), labels = c(
      "strongly disagree", "disagree", "neutral", "agree", "strongly agree"
    ))
  ) |>
  ggplot() +
  aes(y = item, fill = answer) +
  geom_bar(position = position_fill(reverse = TRUE)) +
  scale_fill_brewer(palette = "PuOr") +
  labs(x = "Share of respondents", y = NULL, fill = NULL)
```

Oben steht jetzt die Liebe zum Fleisch mit 59 % Zustimmung, unten die
Vorliebe für Bio mit 38 %, und dazwischen liegen Umweltbewusstsein (53 %)
und Kochen (51 %) fast gleichauf. Die Antwortstufen sortierst du nie nach
Häufigkeit, denn sie sind ordinal und behalten die Reihenfolge der Skala;
sortiert werden nur die Items.

## Ratingskalen divergierend

Bei gestapelten Balken auf 100 % beginnen nur die beiden äußersten Stufen an
einer gemeinsamen Linie, am linken und am rechten Rand, während alle anderen
irgendwo im Balken beginnen. Wie viel
Zustimmung ein Item im Vergleich zu einem anderen bekommt, liest du deshalb
schlecht ab. Divergierende Balken stapeln die Antworten um eine Nulllinie in
der Mitte: Ablehnung geht nach links, Zustimmung nach rechts, und beide
Seiten lassen sich von dieser Linie aus direkt vergleichen.

### Anteile je Item und Antwort

Für dieses Diagramm rechnest du die Anteile selbst aus und zeichnest sie mit
`geom_col()`. Der Kasten zählt je Item jede Antwortstufe und teilt durch die
Zahl der Antworten auf dieses Item; `.by = item` sorgt dafür, dass `sum(n)`
je Item gerechnet wird.

```r
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value") |>
  filter(!is.na(value)) |>
  mutate(item = fct_reorder(item, value > 0, .fun = mean)) |>
  count(item, value) |>
  mutate(share = n / sum(n) * 100, .by = item)
```

### Um die Mitte gestapelt

Der Trick liegt in einer Zeile: Die Anteile der Ablehnung bekommen ein
Minuszeichen, und ggplot2 stapelt negative Werte von der Null aus nach links
und positive nach rechts. `group = -abs(value)` legt die Reihenfolge des
Stapelns fest, sodass die gemäßigten Antworten an der Mitte liegen und die
starken außen, und `scale_x_continuous(labels = abs)` schreibt an die Achse
links wieder positive Prozente.

```r
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value") |>
  filter(!is.na(value)) |>
  mutate(item = fct_reorder(item, value > 0, .fun = mean)) |>
  count(item, value) |>
  mutate(share = n / sum(n) * 100, .by = item) |>
  filter(value != 0) |>
  mutate(
    share = if_else(value < 0, -share, share),
    answer = factor(value, levels = c(-2, -1, 1, 2), labels = c(
      "strongly disagree", "disagree", "agree", "strongly agree"
    ))
  ) |>
  ggplot() +
  aes(x = share, y = item, fill = answer, group = -abs(value)) +
  geom_col() +
  geom_vline(xintercept = 0) +
  scale_x_continuous(labels = abs) +
  scale_fill_brewer(palette = "PuOr") +
  labs(
    x = "Share of respondents (%)", y = NULL, fill = NULL,
    caption = "Not shown: neutral answers, 26.2 to 34.5 % per item"
  )
```

Jetzt fällt auf, was im gestapelten Balken unterging: Bei der Vorliebe für
Bio stehen 33 % Ablehnung gegen 38 % Zustimmung, die Meinungen sind also fast
gleich verteilt, während bei den drei anderen Items die Zustimmung mehr als
doppelt so groß ist wie die Ablehnung, beim Umweltbewusstsein sogar viermal
so groß.

> [!IMPORTANT]
> Die neutrale Mitte passt auf keine der beiden Seiten. Dieses Diagramm lässt
> sie weg und nennt ihren Anteil in der Bildunterschrift, weil Anteile von 26,2
> bis 34,5 % zu groß sind, um sie zu verschweigen. Die andere übliche Lösung
> teilt die neutralen Antworten zur Hälfte nach links und rechts auf; dafür
> muss jede neutrale Zeile zweimal in der Tabelle stehen, und das macht den
> Code deutlich länger.

## Mehrere Ja-Nein-Fragen

Die Umfrage fragt, wo jemand gewöhnlich einkauft, und `shops_discounter` und
`shops_organic` enthalten `TRUE` oder `FALSE`. Der Mittelwert von `TRUE` und
`FALSE` ist der Anteil der `TRUE`, denn R rechnet `TRUE` als 1 und `FALSE` als
0. Mit der langen Form genügt deshalb ein `summarise()` für beide Fragen,
und `n()` zählt dazu, wie viele Personen geantwortet haben:

```r
survey |>
  select(id, shops_discounter, shops_organic) |>
  pivot_longer(-id, names_to = "question", values_to = "yes") |>
  summarise(share = mean(yes) * 100, n = n(), .by = question)
```

Im Diagramm steht dann der Anteil statt der Anzahl, also 73 % statt 2.064
und 13 % statt 358. Eine Anzahl versteht nur, wer die Gesamtzahl kennt, ein
Anteil sagt sofort, welcher Teil der Befragten gemeint ist, und bleibt
vergleichbar, auch wenn eine Frage nur einem Teil gestellt wurde. Die
Fallzahl kommt in die Beschriftung, die Prozentzahl mit `geom_text()` an den
Balken:

```r
survey |>
  select(id, shops_discounter, shops_organic) |>
  pivot_longer(-id, names_to = "question", values_to = "yes") |>
  summarise(share = mean(yes) * 100, n = n(), .by = question) |>
  mutate(question = paste0(question, " (n = ", n, ")")) |>
  ggplot() +
  aes(x = share, y = question, label = paste0(round(share), " %")) +
  geom_col() +
  geom_text(hjust = -0.2) +
  scale_x_continuous(limits = c(0, 100)) +
  labs(x = "Share who answered yes (%)", y = NULL)
```

Die beiden Anteile ergeben zusammen 86 % und nicht 100 %, denn wer beim
Discounter einkauft, kann auch in den Bioladen gehen: 228 Personen haben
beides angekreuzt und 615 keins von beiden. Deshalb gehören mehrere
Ja-Nein-Fragen in getrennte Balken und nie in einen gestapelten Balken oder
ein Kreisdiagramm, die beide behaupten würden, dass sich die Antworten zu
einem Ganzen addieren. `limits = c(0, 100)` zeigt die Achse bis 100 %,
damit der Abstand zum Ganzen sichtbar bleibt.

## Gruppen vergleichen, ohne Zahlen zu verstecken

Wie viele Menschen bevorzugen beim Einkauf Bio, je nach Ernährungsweise?
`prefers_organic > 0` ist wahr für jede zustimmende Antwort, der Mittelwert
also wieder ein Anteil, und `paste0()` schreibt die Fallzahl jeder Gruppe in
ihren Namen, bevor `fct_reorder()` die Gruppen nach dem Anteil ordnet:

```r
survey |>
  filter(!is.na(diet), !is.na(prefers_organic)) |>
  summarise(share = mean(prefers_organic > 0) * 100, n = n(), .by = diet) |>
  mutate(group = paste0(diet, " (n = ", n, ")")) |>
  ggplot() +
  aes(x = share, y = fct_reorder(group, share)) +
  geom_col() +
  labs(x = "Prefer organic products (% agreeing)", y = NULL)
```

72 % der Veganer bevorzugen Bio, aber nur 30 % der Allesesser. Die
Beschriftung zeigt, worauf diese Zahlen beruhen: Hinter dem obersten Balken
stehen 36 Personen, hinter dem untersten 1.819, und bei 36 Personen
verschiebt eine einzige den Anteil um fast 3 Prozentpunkte, bei 1.819 um
0,05. Die Balken sehen gleich solide aus, sind es aber nicht, und ohne die
Fallzahl könnte das niemand erkennen. Bei den Allesessern steht 1.819 statt
1.826, weil sieben von ihnen diese Frage nicht beantwortet haben; die
Fallzahl in der Beschriftung ist immer die Zahl derer, auf denen der Balken
beruht. Wie du diese Unsicherheit selbst ins Bild bringst, zeigt
[[showing-uncertainty]].

## Das Wichtigste

- Eine Itembatterie bringt `pivot_longer()` in die lange Form, eine Zeile je
  Person und Item, und dann wird jedes Item ein Balken, gestapelt auf 100 %
  und nach Zustimmung sortiert.
- Die Stufen einer Ratingskala werden geordnete Faktorstufen mit Namen, und
  eine divergierende Farbskala wie `"PuOr"` zeigt die Richtung über die Farbe
  und die Stärke über die Sättigung.
- Divergierende Balken legen Ablehnung nach links und Zustimmung nach rechts
  einer gemeinsamen Nulllinie, und was mit den neutralen Antworten geschieht,
  steht im Diagramm.
- Mehrere Ja-Nein-Fragen zeigst du als Anteile in getrennten Balken, weil
  sich ihre Antworten nicht zu 100 % addieren.
- Wer Anteile von Gruppen vergleicht, schreibt die Fallzahl in die
  Beschriftung, denn ein Anteil aus 36 Antworten ist weit weniger verlässlich
  als einer aus 1.819.

![Quiz: Befragungsdaten zeigen](item:survey-charts-quiz)

## Zum Weiterlesen

Claus O. Wilke: [[fundamentals-of-data-visualization]], darin die Kapitel
„Color scales“ zu divergierenden Farbskalen und „Visualizing proportions“ zu
gestapelten Balken und ihren Alternativen.

Hadley Wickham, Mine Çetinkaya-Rundel und Garrett Grolemund:
[[r-for-data-science]], darin das Kapitel „Data tidying“ zu `pivot_longer()`
und der langen Form.
