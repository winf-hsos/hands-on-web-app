# Datenvisualisierung mit R und ggplot2

Skript zum Foliensatz „data visualisation with R and ggplot2“. Die Folien
sind englisch, dieser Text folgt ihnen in derselben Reihenfolge. Die Zahlen
in Klammern sind Frames, also Folien samt Aufbauschritten.

## Eröffnung (1–3)

2.809 Menschen haben in der kompakten Fassung der Milchbefragung 21 Fragen
beantwortet, darunter, wie sie sich ernähren. Die Tabelle enthält die
Antwort, aber niemand liest 2.809 Zeilen, während fünf Balken sie auf einen
Blick zeigen. Darum geht es: welches Bild zu welcher Frage passt und wie man
es in R baut. Der Satz hat zwei Teile, zuerst die Auswahl des Diagramms, dann
das Werkzeug ggplot2.

## Teil 1: Welches Diagramm? (4–28)

**Die Skala entscheidet (5–9).** Die vier Skalenniveaus bestimmen das
Diagramm; die Folie baut sich Zeile für Zeile auf, von den Skalen über
Beispiel, Typ in R und Kennzahl bis zum Diagramm. Nominal und ordinal sind Kategorien, in R ein Faktor, beim
ordinalen mit festgelegter Reihenfolge der Stufen. Intervall und Verhältnis
sind Zahlen, in R `<dbl>`. Zu Kategorien passen Balken, zu Zahlen Histogramm
und Boxplot. Die Wahl ist also keine Geschmacksfrage, sondern folgt aus der
Skala.

**Die Landkarte (10).** Der Teil folgt einem Raster: oben eine Variable
(nominal, ordinal, eine Zahl), unten zwei Variablen (zwei Kategorien, eine
Zahl je Gruppe, zwei Zahlen). Die Karte kehrt beim Wechsel in die zweite
Reihe wieder.

**Nominal (11).** Die Ernährung hat keine natürliche Reihenfolge, also
bestimmt die Häufigkeit die Ordnung. `fct_infreq()` stellt die häufigste
Kategorie an den Anfang, `fct_rev()` dreht die Reihenfolge, damit sie oben
steht, und liegende Balken halten lange Namen lesbar.

**Ordinal (12–14).** Die Spalte `milk_freq` kommt als Text aus der Datei,
und R sortiert Text alphabetisch: daily, monthly, rarely, weekly. Damit ist
die Skala zerrissen. `factor()` mit `levels` gibt die Reihenfolge der Skala
vor, von täglich bis selten, und erst dann zeigt das Diagramm, dass die
Balken mit der Skala abnehmen. Nach Häufigkeit zu sortieren wäre bei einer
ordinalen Variable ebenso falsch.

**Ratingskalen (15).** Eine Bewertung von −2 bis +2 steht als Zahl in der
Tabelle, ist aber eine Abfolge von fünf Stufen. Fünf Balken zeigen, wie sich
die Antworten verteilen, und sagen mehr als ein Mittelwert von 0,6.

**Eine Zahl: das Histogramm (16).** Das Alter ist eine Zahl. Das Histogramm
teilt sie in Klassen, hier zu fünf Jahren, und zählt, wie viele Personen in
jede fallen. So wird die Form der Verteilung sichtbar. Die Klassenbreite
(`binwidth`) probiert man aus.

**Ausreißer (17–18).** Die Frage, ab welchem Preis ein Liter Milch zu teuer
ist, haben 611 Personen beantwortet, eine davon mit 999 €. Weil die Achse
bis zum größten Wert reicht, drängt sich alles Interessante in einen
einzigen Balken. Mit `filter(price_too_expensive <= 10)` wird die Verteilung
sichtbar. Was man dabei weglässt, gehört zum Diagramm dazu: Hier sind es 20
von 611 Antworten.

**Der Boxplot (19).** Dieselben Preise als Boxplot: Der Strich in der Box
ist der Median (1,99 €), die Box umfasst die mittlere Hälfte der Antworten,
die Linien reichen bis zum letzten Wert innerhalb von anderthalb Boxbreiten,
und was darüber hinausgeht, erscheint als einzelner Punkt. Der Boxplot
verliert die Form der Verteilung, braucht aber wenig Platz, und das macht
ihn stark, sobald man Gruppen vergleicht.

**Zwei Kategorien (20–21).** Ernährung und Einkauf im Bioladen: je
Ernährungsform ein Balken, mit `position = "fill"` auf 100 % gestapelt.
56 % der Veganer kaufen im Bioladen ein, aber nur 8 % der Allesesser. Auf
100 % gestapelt wird, weil die Gruppen sehr unterschiedlich groß sind (1.826
zu 36); dafür sieht man die Gruppengröße nicht mehr, und die gehört in die
Beschriftung.

**Eine Zahl je Gruppe (22).** Die Preisgrenze je gezeigter Marke, als
Boxplots nebeneinander. Die Mediane liegen fast gleich, 1,99 € und 2,00 €.
Weil die Marke zufällig zugeteilt wurde, ist das ein Experiment, und die
Marke macht für die Preisgrenze kaum einen Unterschied.

**Zwei Zahlen (23).** Alter und Preisgrenze im Streudiagramm, jeder Punkt
eine Person. Ein leichter Trend nach unten (r = −0,25): Wer älter ist, nennt
etwas niedrigere Preise. `alpha` macht die Punkte durchscheinend.

**Wenn Punkte sich stapeln (24–25).** Zwei Ratingskalen ergeben nur 25
mögliche Punkte, und auf dem in der Mitte liegen 385 Personen. Das
Streudiagramm verrät das nicht. `geom_count()` zeichnet Kreise nach Anzahl
und macht den Zusammenhang sichtbar (r = 0,41).

**Was man vermeidet (26–27).** Ein Kreisdiagramm verlangt, Winkel zu
vergleichen, was Menschen schlecht können, während Balken Längen zeigen, die
wir gut vergleichen. Noch schlechter ist ein Kreis in 3D. Eine
abgeschnittene Achse unter Balken übertreibt Unterschiede: 64,7 % der Frauen
und 56,3 % der Männer trinken täglich Milch, und mit einer Achse ab 55 %
sieht das aus wie das Dreifache. Balken beginnen bei null.

**Welches Diagramm passt? (28).** Der Demonstrator „Welches Diagramm passt?“
führt mit wenigen Fragen zur passenden Darstellung und gibt den R-Code als
Vorlage aus, auf Wunsch mit Spalten der kompakten Umfrage.

## Teil 2: Ein Diagramm in Schichten (29–45)

**Drei Schichten (30).** Jedes ggplot2-Diagramm besteht aus denselben drei
Schichten: den Daten (eine Zeile je Person), der Ästhetik (`aes()`, welche
Spalte auf welche Achse oder in welche Farbe geht) und dem Geom (der Form:
Balken, Punkte, Boxen). Daneben stehen die vier übrigen Schichten, die mit
Voreinstellungen kommen.
Leland Wilkinson hat das 1999 als Grammatik der Grafik beschrieben, Hadley
Wickham hat sie mit ggplot2 nach R gebracht.

**Schicht für Schicht (31–34).** `ggplot()` allein ergibt eine leere
Fläche. `aes(x = age)` legt das Alter auf die x-Achse, `geom_histogram()`
zeichnet die Balken, `labs()` beschriftet für Menschen. Nach jeder Zeile ist
das Ergebnis ein gültiges Diagramm, und wer einen Fehler sucht, nimmt die
Schichten von unten wieder weg.

**Sieben Schichten (35).** Die Grammatik kennt sieben Schichten. Drei
schreibt man immer: Daten, Ästhetik (mit den Skalen, die aus Werten
Positionen und Farben machen) und Geom. Die übrigen vier haben
Voreinstellungen: Statistik (was vor dem Zeichnen gerechnet wird,
`geom_bar()` zählt von selbst, `stat_summary()` rechnet, was man vorgibt),
Facetten (ein Feld je Gruppe, sonst eines), Koordinaten (sonst rechtwinklig)
und Theme (alles, was nicht von den Daten abhängt).

**Andere Koordinaten (36).** Ein einzelner Balken, gestapelt nach
Ernährungsweise, wird mit `coord_polar(theta = "y")` zum Kreisdiagramm.
Daten, Ästhetik und Geom bleiben gleich, nur das Koordinatensystem ändert
sich; deshalb hat ggplot2 kein eigenes Geom für Kreise.

**Pipe und Plus (37).** Die Pipe `|>` reicht die Daten weiter, bis sie in
`ggplot()` ankommen; danach kommen Schichten mit `+` dazu. Wer nach
`ggplot()` weiter mit der Pipe schreibt, übergibt das Diagramm an `aes()`,
und R zeichnet nichts, sondern gibt nur eine Zuordnung aus.

**geom_bar() und geom_col() (38).** `geom_bar()` bekommt die Rohdaten und
zählt selbst, `geom_col()` bekommt eine Tabelle mit fertigen Werten, etwa aus
`count()`, und zeichnet sie nur.

**Ästhetik (39–40).** Was in `aes()` steht, hängt an einer Spalte und
ändert sich von Balken zu Balken (`fill = shops_organic`); was außerhalb im
Geom steht, gilt für alle gleich (`fill = "steelblue"`). Weitere Ästhetiken
sind `colour`, `size`, `shape` und `alpha`. In Anzahlen gestapelt zeigt
`fill` die Gruppengröße, verliert aber die Anteile der kleinen Gruppen.

**Die Reihenfolge ist ein Faktor (41).** Nicht ggplot2 bestimmt die
Reihenfolge der Balken, sondern der Faktor: `fct_infreq()` sortiert nach
Häufigkeit, `fct_rev()` dreht um, `factor()` mit `levels` legt eine eigene
Reihenfolge fest.

**Kleine Vielfache (42).** `facet_wrap(~ gender)` zeichnet dasselbe
Diagramm je Gruppe, nebeneinander und mit denselben Achsen.

**Beschriftungen (43).** `labs()` setzt Titel, Achsen, Legende und Quelle;
der Titel nennt die Aussage, die Quelle die Fallzahl.
`scale_x_continuous(labels = scales::percent)` schreibt Anteile als
Prozent.

**Speichern (44).** `ggsave()` schreibt ein Diagramm als Datei, mit einer
Größe in Zentimetern. Im Quarto-Bericht zeichnet der Code-Chunk das
Diagramm selbst, und die Bildunterschrift steht in `#| fig-cap`.

**Schluss (45).** Die Skala entscheidet das Diagramm, und drei Schichten
bauen es: Daten, Ästhetik und ein Geom.
