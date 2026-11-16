---
type: lesson
code: 3075
title: Stolperfallen bei der Datenvisualisierung
summary: >-
  Ein Diagramm kann mit lauter richtigen Zahlen ein falsches Bild zeichnen,
  wenn die Tinte nicht zum Wert passt. Zwei berühmte Beispiele und fünf
  Tricks an der kompakten Milchbefragung zeigen, woran du eine Täuschung
  erkennst und wie die ehrliche Fassung in ggplot2 aussieht.
objectives:
  intro: "In dieser Lektion lernst du, täuschende Diagramme zu erkennen und ehrlich zu zeichnen, und kannst danach:"
  goals:
    - "das Prinzip der proportionalen Tinte erklären und daraus begründen, warum Balken bei null beginnen, Punkte und Linien aber nicht müssen"
    - "eine abgeschnittene oder umgedrehte Achse, Anzahlen statt Anteilen, Flächen statt Längen, einen verschwiegenen Ausreißer und ein Kreisdiagramm als Täuschung oder Erschwernis benennen"
    - "zu jedem dieser Tricks in ggplot2 die bessere Fassung bauen, etwa mit Achse ab null, Anteilen mit Fallzahl, `scale_size_area()` oder einem Boxplot mit `caption`"
    - "eine Aussage über die Umfrage mit R prüfen, bevor du dem Diagramm glaubst, das sie belegen soll"
level: 1
duration: 45
topics: [visualising-data, data-pitfalls]
modules: [ea]
areas: [ds]
relations:
  requires: [data-visualisation-basics]
  see_also: [fundamentals-of-data-visualization, calling-bullshit]
status: published
updated: 2026-11-16
---

![Folien: Stolperfallen bei der Datenvisualisierung](item:misleading-charts-slides)

Ein Diagramm kann täuschen, ohne dass eine einzige Zahl darin falsch ist. Es
genügt, die Achse an der passenden Stelle abzuschneiden, Anzahlen zu zeigen,
wo Anteile gefragt sind, oder einen Ausreißer still mitzurechnen, und schon
sieht ein Unterschied groß aus, den es kaum gibt. Oft geschieht das ohne
Absicht, weil die Voreinstellung eines Programms oder eine schnelle Idee das
Bild bestimmt hat.

Diese Lektion zeigt die häufigsten Tricks an der kompakten Milchbefragung,
jeweils in zwei Codekästen: zuerst die täuschende Fassung, dann die bessere.
Du kannst beide ausführen, ändern und vergleichen. Hinter fast allen Tricks
steht dieselbe Regel, und mit ihr beginnt die Lektion.

## Proportionale Tinte

Stellt eine Fläche oder eine Länge einen Wert dar, muss sie zu diesem Wert
proportional sein, sodass ein doppelt so großer Wert auch doppelt so viel
Tinte bekommt. Claus O. Wilke nennt das in
[[fundamentals-of-data-visualization]] (Kapitel 17) das Prinzip der
proportionalen Tinte und übernimmt den Begriff von Carl Bergstrom und Jevin
West, die ihn in [[calling-bullshit]] ausführen. Aus der Regel folgen drei
Dinge, die du in jedem Diagramm prüfen kannst:

- **Balken beginnen bei null.** Ein Balken zeigt seinen Wert über seine
  Länge. Beginnt die Achse bei 34, zeigt ein Balken für 35 nur noch eine
  Länge von 1, und ein Unterschied von 13 % sieht aus wie das Fünffache.
- **Punkte und Linien dürfen woanders beginnen.** Sie zeigen ihren Wert über
  ihre Lage, nicht über eine Länge, deshalb ist eine Achse ab 34 bei ihnen
  keine Täuschung, solange sie beschriftet ist. Eine gefüllte Fläche unter
  einer Linie ist dagegen wieder Tinte und braucht die Null.
- **Eine Blase mit doppeltem Radius hat die vierfache Fläche.** Wer den
  Radius nach dem Wert bemisst, lässt einen doppelt so großen Wert viermal so
  groß aussehen.

## Zwei berühmte Beispiele

Zwei Diagramme aus den Nachrichten sind so oft als Warnung gezeigt worden,
dass sie zum Lehrstoff gehören. Die Codekästen zeichnen sie mit ihren
Originalzahlen nach, die als kleine Tabelle direkt im Code stehen:
`tribble()` nimmt sie Zeile für Zeile entgegen, `tibble()` Spalte für Spalte.

### Der Steuerbalken aus dem Fernsehen

Im Sommer 2012 zeigte der US-Sender Fox Business, was geschieht, wenn die
Steuersenkungen aus der Zeit von Präsident Bush auslaufen: Der
Spitzensteuersatz steigt von 35 % auf 39,6 %. Die Werteachse begann bei
34 %, und so wirkte der zweite Balken fast sechsmal so hoch wie der erste.
Der Nachbau mit `coord_cartesian(ylim = c(34, 42))`:

```r
tribble(
  ~when, ~top_rate,
  "Now", 35,
  "Jan 1, 2013", 39.6
) |>
  ggplot() +
  aes(x = fct_inorder(when), y = top_rate) +
  geom_col() +
  coord_cartesian(ylim = c(34, 42)) +
  labs(x = NULL, y = "Top tax rate (%)")
```

### Der Steuerbalken ehrlich

Ohne `coord_cartesian()` beginnen die Balken bei null, wie ggplot2 es von
selbst einrichtet, und der zweite Balken ist nur noch 13 % höher als der
erste. Genau so groß ist der Unterschied zwischen 35 und 39,6:

```r
tribble(
  ~when, ~top_rate,
  "Now", 35,
  "Jan 1, 2013", 39.6
) |>
  ggplot() +
  aes(x = fct_inorder(when), y = top_rate) +
  geom_col() +
  labs(x = NULL, y = "Top tax rate (%)")
```

Ob 4,6 Prozentpunkte für hohe Einkommen viel oder wenig sind, darüber lässt
sich streiten. Das Diagramm sollte diesen Streit aber nicht mit einer
verschobenen Achse vorwegnehmen.

### Die umgedrehte Achse

Die Nachrichtenagentur Reuters veröffentlichte 2014 eine Grafik zu den Morden
mit Schusswaffen in Florida, wo 2005 das Gesetz „Stand Your Ground“ in Kraft
trat, das Notwehr mit der Waffe auch dort erlaubt, wo man hätte ausweichen
können. Die y-Achse lief von oben nach unten, mit der Null oben, und die
Fläche hing wie ein Vorhang herab. `scale_y_reverse()` baut das nach:

```r
tibble(
  year = 1990:2012,
  firearm_murders = c(873, 806, 789, 800, 739, 687, 668, 634, 589, 460, 499, 502,
                      552, 586, 555, 521, 740, 825, 780, 695, 669, 691, 721)
) |>
  ggplot() +
  aes(x = year, y = firearm_murders) +
  geom_area() +
  geom_vline(xintercept = 2005) +
  annotate("text", x = 2004.5, y = 950, label = "2005: \"Stand Your Ground\"", hjust = 1) +
  scale_y_reverse() +
  labs(x = NULL, y = "Murders using firearms")
```

### Die Achse richtig herum

Wer das Bild liest wie jedes andere Diagramm, sieht nach 2005 einen steilen
Abfall. Dieselben Zahlen mit der Null unten zeigen das Gegenteil: Die Morde
mit Schusswaffen stiegen von 521 im Jahr 2005 auf 825 im Jahr 2007.

```r
tibble(
  year = 1990:2012,
  firearm_murders = c(873, 806, 789, 800, 739, 687, 668, 634, 589, 460, 499, 502,
                      552, 586, 555, 521, 740, 825, 780, 695, 669, 691, 721)
) |>
  ggplot() +
  aes(x = year, y = firearm_murders) +
  geom_area() +
  geom_vline(xintercept = 2005) +
  annotate("text", x = 2004.5, y = 950, label = "2005: \"Stand Your Ground\"", hjust = 1) +
  labs(x = NULL, y = "Murders using firearms")
```

Ob das Gesetz den Anstieg verursacht hat, zeigt keine der beiden Fassungen,
denn dafür bräuchte es einen Vergleich mit Staaten ohne ein solches Gesetz.
Die Grafik sollte aber wenigstens nicht das Gegenteil dessen zeigen, was in
den Zahlen steht.

## Fünf Tricks an der Umfrage

Die folgenden Tricks begegnen dir in Berichten, Präsentationen und
Abschlussarbeiten, meist ohne böse Absicht. Zu jedem gibt es zwei
Codekästen an der Tabelle `survey`, zuerst die täuschende Fassung und dann
die bessere.

### Ein Cent wird riesig

Im Preisexperiment sahen die Befragten zufällig entweder Weihenstephan oder
Alpro und sagten, ab welchem Preis ihnen ein Liter zu teuer wäre. Der Median
liegt bei Weihenstephan bei 1,99 € und bei Alpro bei 2,00 €. Schneidet
`coord_cartesian()` die Achse knapp unter dem kleineren Wert ab, wird aus
einem Cent ein Balken, der doppelt so hoch ist wie der andere:

```r
survey |>
  filter(!is.na(price_too_expensive)) |>
  group_by(milk_brand) |>
  summarise(median_price = median(price_too_expensive)) |>
  ggplot() +
  aes(x = milk_brand, y = median_price) +
  geom_col() +
  coord_cartesian(ylim = c(1.98, 2.01)) +
  labs(x = "Brand shown", y = "Median: too expensive from (€)")
```

### Ein Cent bleibt ein Cent

Die bessere Fassung lässt die Balken bei null beginnen, schreibt die Mediane
mit `geom_text()` darüber und nennt unter jeder Marke die Fallzahl. Ein Cent
ist bei Preisen um 2 € kein Unterschied, über den sich zu reden lohnt, und so
sieht er jetzt auch aus:

```r
survey |>
  filter(!is.na(price_too_expensive)) |>
  group_by(milk_brand) |>
  summarise(median_price = median(price_too_expensive), n = n()) |>
  ggplot() +
  aes(x = paste0(milk_brand, "\n(n = ", n, ")"), y = median_price) +
  geom_col() +
  geom_text(aes(label = format(median_price, nsmall = 2)), vjust = -0.5) +
  coord_cartesian(ylim = c(0, 2.2)) +
  labs(x = "Brand shown", y = "Median: too expensive from (€)")
```

Hier steht `coord_cartesian()` wieder, diesmal mit einer Grenze ab null, die
nur oben Platz für die Beschriftung schafft. Die Funktion selbst täuscht also
nicht; es kommt darauf an, wo die Achse beginnt.

### Anzahl statt Anteil

Welche Ernährungsweise kauft am ehesten im Bioladen? Zählt man nur die
Kundschaft des Bioladens, liegen die Flexitarier mit 150 Personen und die
Allesesser mit 147 weit vorn, und die 20 Veganer scheinen kaum eine Rolle zu
spielen:

```r
survey |>
  filter(shops_organic, !is.na(diet)) |>
  ggplot() +
  aes(y = fct_rev(fct_infreq(diet))) +
  geom_bar() +
  labs(x = "People who shop in an organic store", y = NULL)
```

### Anteil je Gruppe, mit Fallzahl

Die Anzahlen zeigen vor allem, wie groß die Gruppen sind, denn in der Umfrage
stehen 1.826 Allesesser und nur 36 Veganer. Wer wissen will, welche Gruppe am
ehesten im Bioladen einkauft, braucht den Anteil je Gruppe: 56 % der Veganer
gegenüber 8 % der Allesesser. Die Fallzahl gehört in die Beschriftung, weil
hinter dem längsten Balken nur 36 Menschen stehen:

```r
survey |>
  filter(!is.na(diet)) |>
  group_by(diet) |>
  summarise(share = 100 * mean(shops_organic), n = n()) |>
  ggplot() +
  aes(x = share, y = fct_reorder(paste0(diet, " (n = ", n, ")"), share)) +
  geom_col() +
  labs(x = "Shop in an organic store (%)", y = NULL)
```

Falsch ist keines der beiden Diagramme: Die Anzahlen beschreiben, wie sich
die Kundschaft des Bioladens zusammensetzt, die Anteile, welche Gruppe am
ehesten dort einkauft. Täuschend wird es, wenn die Überschrift die eine Frage
stellt und das Diagramm die andere beantwortet.

### Doppelt so viel, viermal so groß

1.451 Personen trinken zu Hause täglich Milch und 682 wöchentlich, also
etwas weniger als halb so viele. `scale_radius()` macht hier den Radius jeder
Blase proportional zur Anzahl, und weil die Fläche mit dem Quadrat des Radius
wächst, wirkt die Blase für täglich rund viereinhalbmal so groß wie die für
wöchentlich:

```r
survey |>
  filter(!is.na(milk_freq)) |>
  count(milk_freq) |>
  mutate(milk_freq = factor(milk_freq, levels = c(
    "daily", "weekly", "monthly", "rarely"
  ))) |>
  ggplot() +
  aes(x = milk_freq, y = 1, size = n) +
  geom_point() +
  scale_radius(limits = c(0, NA), range = c(0, 50)) +
  scale_y_continuous(breaks = NULL) +
  labs(x = "How often milk is drunk at home", y = NULL)
```

### Die Fläche nach dem Wert

`scale_size_area()` macht stattdessen die Fläche proportional zur Anzahl, und
die Blase für täglich ist jetzt gut doppelt so groß wie die für wöchentlich.
Noch leichter zu vergleichen wären Balken, denn eine Länge schätzt das Auge
genauer als eine Fläche; Blasen lohnen sich erst, wenn x und y schon belegt
sind wie bei `geom_count()`.

```r
survey |>
  filter(!is.na(milk_freq)) |>
  count(milk_freq) |>
  mutate(milk_freq = factor(milk_freq, levels = c(
    "daily", "weekly", "monthly", "rarely"
  ))) |>
  ggplot() +
  aes(x = milk_freq, y = 1, size = n) +
  geom_point() +
  scale_size_area(max_size = 50) +
  scale_y_continuous(breaks = NULL) +
  labs(x = "How often milk is drunk at home", y = NULL)
```

### Der stille Ausreißer

Wer die mittlere Preisgrenze je Marke zeigt, bekommt 7,25 € bei
Weihenstephan und 9,07 € bei Alpro, als würden die Befragten für Alpro ein
Viertel mehr bezahlen. Die Balken beginnen korrekt bei null und täuschen
trotzdem, denn in den Mittelwerten stecken Antworten wie 344 € und 999 € für
einen Liter Milch:

```r
survey |>
  filter(!is.na(price_too_expensive)) |>
  group_by(milk_brand) |>
  summarise(mean_price = mean(price_too_expensive)) |>
  ggplot() +
  aes(x = milk_brand, y = mean_price) +
  geom_col() +
  labs(x = "Brand shown", y = "Mean: too expensive from (€)")
```

### Ein Boxplot, der sagt, was fehlt

Der Boxplot zeigt nur die Preise bis 10 € und darin die Mediane, 1,99 € und
2,00 €, und `caption` nennt, was weggelassen ist: 20 von 611 Antworten über
10 €, bis hinauf zu 999 €. Wer das Diagramm liest, kann so selbst
entscheiden, ob er den Schnitt bei 10 € für richtig hält:

```r
survey |>
  filter(price_too_expensive <= 10) |>
  ggplot() +
  aes(x = milk_brand, y = price_too_expensive) +
  geom_boxplot() +
  labs(
    x = "Brand shown", y = "Too expensive from (€)",
    caption = "Left out: 20 of 611 answers above 10 €, up to 999 €"
  )
```

### Winkel statt Längen

Ein Kreisdiagramm hält sich an die proportionale Tinte, denn jedes Stück ist
so groß wie sein Anteil, aber es macht den Vergleich schwer. `coord_polar()`
biegt hier einen gestapelten Balken der fünf Ernährungsweisen zum Kreis, und
ob Pescetarier und Veganer gleich viele sind, lässt sich kaum sagen:

```r
survey |>
  filter(!is.na(diet)) |>
  count(diet) |>
  ggplot() +
  aes(x = "", y = n, fill = diet) +
  geom_col() +
  coord_polar(theta = "y") +
  labs(x = NULL, y = NULL, fill = NULL)
```

### Sortierte Balken

Dieselben Zahlen als Balken, nach der Anzahl sortiert. Längen sind leichter
zu vergleichen als Winkel, und die beiden kleinsten Gruppen mit je 36
Personen stehen jetzt sichtbar gleich lang untereinander:

```r
survey |>
  filter(!is.na(diet)) |>
  count(diet) |>
  ggplot() +
  aes(x = n, y = fct_reorder(diet, n)) +
  geom_col() +
  labs(x = "Number of respondents", y = NULL)
```

## Manipulationsgalerie

Wer einmal selbst ein täuschendes Diagramm gebaut hat, erkennt die Tricks
danach schneller. In dieser Gruppenaktivität bekommt jede Gruppe eine
falsche oder irreführende Aussage über die Umfrage und baut ein Diagramm, das
sie scheinbar belegt, ohne eine einzige Zahl zu fälschen. Die Aussagen:

- „Veganer sind die größten Bio-Käufer im Land.“
- „Für Alpro würden die Leute viel mehr zahlen als für Weihenstephan.“
- „Frauen sind viel umweltbewusster als Männer.“
- „Oatly hat mit Abstand den schlechtesten Ruf aller Marken.“
- „Ältere Menschen trinken viel öfter täglich Milch als jüngere.“
- „Wer TikTok nutzt, trinkt kaum noch Milch.“

So geht ihr vor:

1. Zieht eine Aussage und prüft sie zuerst mit `count()`, `group_by()` und
   `summarise()`, damit ihr wisst, was die Daten wirklich sagen.
2. Baut im Codekasten unten ein Diagramm, das die Aussage scheinbar belegt.
   Erlaubt ist alles aus dieser Lektion: eine abgeschnittene Achse,
   ausgewählte Gruppen, Anzahlen statt Anteilen, Mittelwerte mit Ausreißern
   und ein Titel, der mehr verspricht, als die Daten tragen.
3. Zeigt euer Diagramm den anderen Gruppen ohne den Code. Sie benennen den
   Trick und sagen, welche Zahl sie bräuchten, um die Aussage zu prüfen.
4. Baut danach die ehrliche Fassung und stellt sie neben die täuschende.

Der Codekasten enthält nur das Gerüst. `geom_col()` passt, wenn ihr vorher
mit `summarise()` einen Wert je Gruppe ausrechnet; zählt ggplot2 selbst,
nehmt ihr `geom_bar()`, für Verteilungen `geom_boxplot()`.

```r
survey |>
  filter() |>
  group_by() |>
  summarise() |>
  ggplot() +
  aes() +
  geom_col()
```

> [!SOLUTION]
> Was die Daten zu den sechs Aussagen sagen und welcher Trick naheliegt:
>
> - **Veganer:** Mit 56 % kaufen sie anteilig am häufigsten im Bioladen,
>   aber unter den 355 Bioladen-Kunden mit Angabe zur Ernährung sind nur 20
>   Veganer, dagegen 150 Flexitarier und 147 Allesesser. „Im Land“ passt
>   ohnehin nicht, weil die Stichprobe aus einem Online-Panel stammt. Der
>   naheliegende Trick sind Anteile ohne Fallzahl unter einem Titel, der von
>   den „größten Käufern“ spricht.
> - **Alpro:** Die Mittelwerte liegen bei 9,07 € und 7,25 €, weil
>   Ausreißer bis 999 € darin stecken; die Mediane liegen bei 2,00 € und
>   1,99 €. Naheliegend sind Mittelwerte mit Ausreißern oder Mediane mit
>   abgeschnittener Achse.
> - **Frauen und Männer:** Auf der Skala von −2 bis +2 liegt der Mittelwert
>   von `eco_conscious` bei 0,57 und 0,45, der Median bei beiden bei 1, und
>   54 % der Frauen gegenüber 51 % der Männer stimmen zu. Naheliegend ist eine
>   Achse, die bei 0,4 beginnt.
> - **Oatly:** Die mittlere Qualitätsbewertung (`brand_quality`) liegt bei
>   0,48, bei Gut&Günstig bei 0,56 und bei den übrigen Marken zwischen 0,84
>   und 0,99; alle sind positiv. Naheliegend ist eine Achse ab 0,45, in der
>   Oatly fast verschwindet.
> - **Ältere:** Unter 60 Jahren trinken 61 % derer, die zur Milch gefragt
>   wurden, täglich Milch, ab 60 ebenfalls 61 %. Wer nur die 18- bis
>   29-Jährigen (52 %) mit den 40- bis 49-Jährigen (68 %) vergleicht, findet
>   einen Unterschied, den es zwischen jung und alt nicht gibt. Der Trick ist
>   die Auswahl der Gruppen.
> - **TikTok:** Wer täglich TikTok nutzt, trinkt zu 60 % täglich Milch, wer
>   es nie nutzt, zu 63 %. Nur die 45 Personen, die TikTok monatlich nutzen,
>   kommen auf 36 %. Der Trick ist, die kleine Gruppe herauszugreifen und die
>   Fallzahl zu verschweigen; dazu kommt, dass nur etwa die Hälfte der
>   Befragten zu TikTok gefragt wurde.

## Das Wichtigste

- Die Tinte muss proportional zum Wert sein, den sie zeigt: Balken und
  Flächen beginnen bei null, während Punkte und Linien ihren Wert über die
  Lage zeigen und woanders beginnen dürfen.
- Eine abgeschnittene oder umgedrehte Achse verändert das Bild, ohne eine
  Zahl zu ändern, deshalb liest du bei jedem Diagramm zuerst die Achsen.
- Anzahlen zeigen die Größe der Gruppen und Anteile, wie verbreitet etwas in
  einer Gruppe ist; wer Anteile zeigt, nennt die Fallzahl dazu.
- Blasen bemisst du nach ihrer Fläche mit `scale_size_area()`, nie nach dem
  Radius, und wo es geht, nimmst du gleich Längen statt Flächen oder Winkeln.
- Was du weglässt oder was einen Mittelwert verzerrt, sagst du im Diagramm,
  etwa mit `caption`.

![Quiz: Stolperfallen bei der Datenvisualisierung](item:misleading-charts-quiz)

## Quellen und Weiterlesen

Claus O. Wilke: *Fundamentals of Data Visualization*, Kapitel 17 „The
principle of proportional ink“, frei lesbar unter
<https://clauswilke.com/dataviz/proportional-ink.html>.

Carl T. Bergstrom und Jevin D. West: *Calling Bullshit. The Art of
Skepticism in a Data-Driven World*. Random House, 2020. Ihre Seite zur
proportionalen Tinte steht unter
<https://www.callingbullshit.org/tools/tools_proportional_ink.html>.

Der Steuerbalken lief im Juli 2012 in der Sendung *Cavuto* auf Fox Business;
beschrieben haben ihn Media Matters
(<https://www.mediamatters.org/fox-business/dishonest-fox-chart-bush-tax-cut-edition>)
und FlowingData
(<https://flowingdata.com/2012/08/06/fox-news-continues-charting-excellence/>),
das auch die Achse ab 34 % nennt.

Die Grafik zu Florida erschien im Februar 2014 bei Reuters und wurde unter
anderem von Business Insider nachgedruckt. Die Zahlen sind die Morde mit
Schusswaffen, die das Florida Department of Law Enforcement jährlich
veröffentlicht, für die Jahre 1990 bis 2012.
