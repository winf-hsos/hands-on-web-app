---
type: quiz
code: 4172
title: "Quiz: Diagramme und ggplot2"
summary: >-
  Zehn Fragen dazu, welches Diagramm zu welcher Variable passt und wie ggplot2
  es aus Schichten aufbaut, jede mit ihrer Begründung.
level: 1
duration: 12
topics: [visualising-data]
modules: [ea]
areas: [ds]
relations:
  checks: [data-visualisation-basics]
questions: [hds-014, hds-015, hds-016, hds-017, hds-018, hds-019, hds-020, hds-021, hds-022, hds-023]
status: published
updated: 2026-11-15
---

## Die nominale Variable `diet` hat fünf Ausprägungen, von omnivore (1.826 Personen) bis vegan (36). Welche Darstellung passt zu ihr? {#hds-014}

- [ ] Ein Histogramm von `diet`
  > Ein Histogramm teilt eine Zahlenachse in Intervalle; `diet` enthält keine Zahlen, sondern fünf Kategorien, und `geom_histogram()` bricht bei Text mit einem Fehler ab.
- [x] Ein Balkendiagramm, die Balken nach Häufigkeit sortiert
  > Richtig: Jeder Balken steht für eine Ernährungsweise, und weil eine nominale Variable keine eigene Reihenfolge hat, ordnest du die Balken nach ihrer Länge, sodass sich die Rangfolge von omnivore bis vegan auf einen Blick ablesen lässt.
- [ ] Ein Kreisdiagramm mit fünf Stücken
  > Winkel vergleicht das Auge schlechter als Längen, und die beiden kleinsten Gruppen wären schmale Keile von gut einem Prozent, an die kaum eine Beschriftung passt.
- [ ] Ein Balkendiagramm, die Balken alphabetisch sortiert
  > Das zeigt dieselben Zahlen, aber die alphabetische Reihenfolge trägt keine Bedeutung: flexitarian stünde vor omnivore, und wer die Rangfolge sucht, muss die Balkenlängen selbst vergleichen.

> Eine nominale Variable zeigst du als Balken, und weil ihre Kategorien keine eigene Reihenfolge haben, darf die Häufigkeit die Anordnung bestimmen.

## Die ordinale Variable `town_size` reicht von `city` bis `village`. Warum sortierst du ihre Balken nicht nach Häufigkeit? {#hds-015}

- [ ] Weil ggplot2 Balken immer alphabetisch anordnet und sich das nicht ändern lässt
  > Die Reihenfolge lässt sich sehr wohl festlegen: Als Text sortiert R die Kategorien alphabetisch, als Faktor mit `levels` behält `town_size` die Ordnung der Skala.
- [ ] Weil man bei ordinalen Variablen keine Häufigkeiten zählen darf
  > Zählen ist bei jeder kategorialen Variable erlaubt, auch bei einer ordinalen; offen ist nur, in welcher Reihenfolge die Balken stehen.
- [x] Weil die Skala eine eigene Reihenfolge hat, die beim Sortieren nach Häufigkeit zerrissen würde
  > Richtig: Von der Großstadt bis zum Dorf wird der Ort Schritt für Schritt kleiner, und nur in dieser Reihenfolge lässt sich ablesen, wie sich die Zahl der Befragten mit der Größe des Orts verändert; als Faktor mit `levels` behält `town_size` diese Ordnung.
- [ ] Weil eine sortierte Grafik die Häufigkeiten verfälscht
  > Beim Sortieren bleiben die Balken gleich lang, verfälscht wird also nichts; verloren geht die Ordnung der Skala, die den Kategorien ihre Bedeutung gibt.

> Hat eine Variable eine eigene Reihenfolge, gibt diese die Anordnung der Balken vor; nach Häufigkeit sortierst du nur, wo es keine solche Ordnung gibt.

## Das Histogramm aller 611 Antworten auf `price_too_expensive` zeigt im Grunde nur einen einzigen Balken. Was steckt dahinter? {#hds-016}

```r static
survey |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram()
```

- [ ] Fast alle haben denselben Preis genannt.
  > Die Antworten streuen durchaus um den Median von 1,99 €, nur sieht man das nicht, solange die Achse bis 999 € reicht und alle üblichen Preise in denselben Balken fallen.
- [x] Wenige extreme Werte bis 999 € dehnen die Achse so weit, dass fast alle Antworten im ersten Balken landen; du filterst sie heraus und sagst, was du weggelassen hast.
  > Richtig: Der Median liegt bei 1,99 €, das Maximum bei 999 €, und das Histogramm muss die ganze Spanne zeigen. Mit `filter(price_too_expensive <= 10)` werden die üblichen Preise sichtbar, und unter die Grafik gehört der Hinweis, dass 20 der 611 Antworten über 10 € nicht gezeigt sind.
- [ ] Die Balken sind zu breit, und eine kleinere `binwidth` löst das Problem.
  > Schmalere Balken ändern die Achse nicht: Sie reicht weiter bis 999 €, und die üblichen Preise drängen sich ganz links auf wenigen Millimetern zusammen.
- [ ] Die Werte über 10 € sind Fehler und werden ohne weiteren Hinweis aus dem Datensatz gelöscht.
  > Ob 999 € ein Tippfehler oder ein Scherz ist, weißt du nicht; du lässt solche Werte für diese Grafik weg, ohne sie zu löschen, und sagst dazu, wie viele Antworten fehlen.

> Ein einziger Balken heißt meist, dass wenige extreme Werte die Achse dehnen; wer sie für die Grafik weglässt, sagt, wie viele es sind und wo die Grenze liegt.

## Was zeigt die Linie innerhalb der Box dieses Boxplots? {#hds-017}

```r static
survey |>
  ggplot() +
  aes(y = age) +
  geom_boxplot()
```

- [ ] Den Mittelwert
  > Den Mittelwert zeigt `geom_boxplot()` nicht; die Linie liegt beim Median, und bei einer schiefen Verteilung weichen beide deutlich voneinander ab.
- [ ] Die Mitte zwischen kleinstem und größtem Wert
  > Die Mitte der Spannweite hinge allein an den beiden extremsten Personen; die Linie richtet sich dagegen nach der Person in der Mitte, wenn man alle der Größe nach ordnet.
- [x] Den Median
  > Richtig: Die eine Hälfte der Werte liegt darunter, die andere darüber; beim Alter der Befragten liegt die Linie bei 50 Jahren.
- [ ] Den häufigsten Wert
  > Den häufigsten Wert, den Modus, zeigt ein Boxplot gar nicht; wo die meisten Werte liegen, siehst du eher in einem Histogramm.

> Die Box umfasst die mittlere Hälfte der Werte vom ersten bis zum dritten Quartil, und die Linie darin ist der Median.

## Du willst zeigen, ob das Einkaufen im Bioladen mit der Ernährungsweise zusammenhängt. Die Gruppen sind sehr ungleich groß, von 1.826 omnivoren bis zu 36 veganen Personen. Zeigst du Anzahlen oder Anteile? {#hds-018}

- [ ] Anzahlen als gestapelte Balken mit `geom_bar()`
  > Der Balken der Omnivoren ist dann rund fünfzigmal so lang wie der der Veganer, und dass mehr als die Hälfte der Veganer im Bioladen einkauft, verschwindet in einem kaum sichtbaren Stück.
- [ ] Anzahlen nebeneinander mit `geom_bar(position = "dodge")`
  > Nebeneinander zeigt wieder vor allem die Größe der Gruppen: Rund 150 Omnivore kaufen im Bioladen ein, aber nur etwa 20 Veganer, obwohl der Anteil bei den Veganern siebenmal so hoch ist.
- [x] Anteile innerhalb jeder Gruppe mit `geom_bar(position = "fill")`
  > Richtig: Jeder Balken reicht bis 100 %, sodass die Größe der Gruppe keine Rolle mehr spielt und der Unterschied sichtbar wird: 56 % der Veganer, 21 % der Vegetarier und 8 % der Omnivoren kaufen im Bioladen ein.
- [ ] Keins von beiden, weil 36 Personen für einen Vergleich zu wenige sind
  > Eine kleine Gruppe macht einen Anteil unsicherer, aber nicht wertlos; du zeigst den Anteil und nennst dazu, wie groß die Gruppe ist.

> Sind Gruppen sehr verschieden groß, vergleichst du Anteile innerhalb der Gruppen, weil die Grafik sonst vor allem zeigt, welche Gruppe die größte ist.

## Du willst zeigen, wie zwei numerische Variablen zusammenhängen, etwa die Bewertungen `eco_conscious` und `prefers_organic`. Welche Darstellung passt? {#hds-019}

- [x] Ein Streudiagramm, in dem jede Person ein Punkt ist
  > Richtig: Jede Achse trägt eine der beiden Zahlen, und an der Punktwolke siehst du, ob hohe Werte der einen mit hohen Werten der anderen zusammengehen; bei diesen beiden Bewertungen ist das mit r = 0,41 der Fall.
- [ ] Zwei Histogramme nebeneinander
  > Jedes Histogramm zeigt die Verteilung einer Variable für sich, und welche Werte bei derselben Person zusammentreffen, geht dabei verloren.
- [ ] Ein Balkendiagramm mit dem Mittelwert jeder Variable
  > Zwei Mittelwerte sagen, wo jede Variable im Schnitt liegt, aber nichts darüber, ob beide gemeinsam steigen oder fallen.
- [ ] Ein Liniendiagramm, das die Werte der Reihe nach verbindet
  > Eine Linie verbindet Punkte in einer Reihenfolge, etwa über die Zeit; die Befragten haben keine solche Reihenfolge, und die Linie liefe kreuz und quer.

> Zwei Zahlen zeigst du als Streudiagramm. Liegen viele Punkte aufeinander, wie hier 385 Personen auf dem Punkt (0, 0), macht `geom_count()` statt `geom_point()` sichtbar, wie viele es sind.

## Dieser Code zeichnet kein Diagramm, sondern gibt nur eine Zuordnung von Spalten aus. Warum? {#hds-020}

```r static
survey |>
  ggplot() |>
  aes(x = age)
```

- [ ] `aes()` gehört in die Klammern von `ggplot()`.
  > `aes()` darf als eigene Schicht stehen, so schreibt es diese Plattform sogar; der Fehler liegt im Zeichen davor.
- [x] Nach `ggplot()` werden Schichten mit `+` verbunden, nicht mit `|>`.
  > Richtig: Die Pipe reicht den Datensatz an `ggplot()` weiter, danach baut `+` die Grafik Schicht für Schicht auf. Mit `|>` bekommt `aes()` das ganze Diagramm als Argument, und R gibt nur diese Zuordnung aus, statt etwas zu zeichnen.
- [ ] Es fehlt ein Geom wie `geom_histogram()`.
  > Ohne Geom zeichnet ggplot2 immerhin eine Fläche mit Achsen; dass gar kein Diagramm erscheint, liegt schon am Übergang zu `aes()`.
- [ ] `survey` muss in die Klammern von `ggplot()`, weil die Pipe den Datensatz nicht weiterreicht.
  > Die erste Pipe arbeitet richtig: Sie reicht `survey` als erstes Argument an `ggplot()` weiter, und dort ist das der Datensatz.

> `|>` führt den Datensatz zu `ggplot()`, und ab dort verbindet `+` die Schichten der Grafik.

## Die Tabelle aus `count(diet)` enthält die Häufigkeiten schon in der Spalte `n`. Welche Schicht zeichnet daraus die Balken? {#hds-021}

```r static
survey |>
  count(diet) |>
  ggplot() +
  aes(x = diet, y = n)
```

- [ ] `geom_bar()`
  > `geom_bar()` zählt die Zeilen selbst, doch in der Tabelle von `count()` steht jede Ernährungsweise nur in einer Zeile; eine vorgegebene Höhe wie `y = n` nimmt `geom_bar()` nicht an und bricht mit einem Fehler ab.
- [x] `geom_col()`
  > Richtig: `geom_col()` nimmt die Höhe der Balken aus `y`, hier aus der Spalte `n`, und zählt nichts selbst.
- [ ] `geom_histogram()`
  > Ein Histogramm teilt eine Zahlenachse in Intervalle und zählt selbst, während `diet` eine Kategorie und keine Zahl ist.
- [ ] Egal, `geom_bar()` und `geom_col()` sind zwei Namen für dasselbe.
  > Beide zeichnen Balken, aber `geom_bar()` zählt die Zeilen des Datensatzes, während `geom_col()` fertige Zahlen aus `y` übernimmt.

> Rohdaten mit einer Zeile je Person zeichnet `geom_bar()` und zählt dabei selbst; eine Tabelle mit fertigen Zahlen braucht `geom_col()`.

## Dieser Code soll alle Balken blau färben. Stattdessen erscheinen sie in einem rötlichen Standardton, und daneben steht eine Legende mit dem Eintrag „blue“. Warum? {#hds-022}

```r static
survey |>
  ggplot() +
  aes(x = diet, fill = "blue") +
  geom_bar()
```

- [ ] R kennt den Farbnamen `"blue"` nicht, man muss `"#0000FF"` schreiben.
  > R kennt `"blue"` sehr wohl, und mit `"#0000FF"` an derselben Stelle wären die Balken genauso rötlich, weil das Problem der Ort ist und nicht der Name.
- [ ] `fill` färbt nur den Rand, für die Fläche braucht man `colour`.
  > Es ist umgekehrt: `fill` färbt die Fläche und `colour` den Rand; der Fehler liegt darin, dass `fill` innerhalb von `aes()` steht.
- [x] Eine feste Farbe gehört außerhalb von `aes()`, etwa `geom_bar(fill = "blue")`; innerhalb von `aes()` behandelt ggplot2 `"blue"` wie eine Variable mit einem einzigen Wert.
  > Richtig: In `aes()` stehen Zuordnungen von Variablen zu Eigenschaften der Grafik. Der Text „blue“ wird dort zu einer Kategorie, die die erste Farbe der Standardpalette und einen Eintrag in der Legende bekommt.
- [ ] `fill` wirkt bei `geom_bar()` nicht, nur bei `geom_col()`.
  > Beide Geoms nehmen `fill` an; ohne Wirkung wären die Balken grau geblieben und hätten nicht die rötliche Standardfarbe bekommen.

> In `aes()` steht, was sich nach den Daten richtet; eine feste Farbe für alle Balken setzt du als Argument des Geoms.

## Was bewirkt die letzte Zeile `facet_wrap(~ gender)` in diesem Code? {#hds-023}

```r static
survey |>
  ggplot() +
  aes(x = age) +
  geom_histogram(binwidth = 5) +
  facet_wrap(~ gender)
```

- [ ] Sie färbt die Balken des Histogramms nach Geschlecht.
  > Das leistet `aes(fill = gender)` mit einem einzigen Histogramm aus farbigen Balken, während `facet_wrap()` eigene Felder zeichnet.
- [x] Sie zeichnet für jedes Geschlecht ein eigenes Histogramm in einem eigenen Feld, alle mit denselben Achsen.
  > Richtig: `facet_wrap()` teilt die Daten nach den Werten von `gender` und zeichnet dieselbe Grafik für jede Gruppe noch einmal; weil die Achsen gleich sind, lassen sich die Felder direkt vergleichen.
- [ ] Sie zeigt nur die Personen des ersten Geschlechts in der Tabelle.
  > Weggelassen wird niemand: Jede Person erscheint in genau einem Feld, und alle Felder zusammen enthalten alle Befragten.
- [ ] Sie sortiert die Balken nach Geschlecht.
  > Die Balken eines Histogramms stehen immer in der Reihenfolge der Zahlenachse; `facet_wrap()` verteilt die Daten auf mehrere Felder und lässt die Balken darin, wie sie sind.

> `facet_wrap()` zeichnet eine Grafik je Gruppe, nebeneinander und mit gemeinsamen Achsen, sodass sich die Gruppen ohne Farben vergleichen lassen.
