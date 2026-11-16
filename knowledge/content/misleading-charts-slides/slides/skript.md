# Stolperfallen bei der Datenvisualisierung

Skript zum Foliensatz „pitfalls in data visualisation“. Die Folien sind englisch, dieser
Text folgt ihnen in derselben Reihenfolge. Die Zahlen in Klammern sind
Frames, also Folien samt Aufbauschritten. Alle Diagramme entstehen mit
`scripts/misleading-charts-figures.R` aus genau dem Code, den die Lektion
`misleading-charts` zeigt.

## Eröffnung (1–3)

Ein Diagramm kann täuschen, ohne dass eine einzige Zahl darin falsch ist.
Das Eröffnungsbild zeigt einen Balken, der sechsmal so hoch aussieht wie der
andere, und unter der Lupe die abgeschnittene Achse, an der das Verhältnis
nicht mehr stimmt. Der Satz hat drei Teile: die eine Regel hinter fast allen
Tricks, zwei berühmte Beispiele aus den Nachrichten und fünf Tricks an der
kompakten Milchbefragung, jeweils mit der besseren Fassung daneben.

## Teil 1: Proportionale Tinte (4–7)

**Die Regel (5).** Wo eine Fläche oder eine Länge einen Wert darstellt, muss
sie zu diesem Wert proportional sein, sodass ein doppelt so großer Wert auch
doppelt so viel Tinte bekommt. Claus O. Wilke beschreibt dieses Prinzip der
proportionalen Tinte in Kapitel 17 von *Fundamentals of Data Visualization*
und übernimmt den Begriff von Carl Bergstrom und Jevin West, den Autoren von
*Calling Bullshit*.

**Balken und Punkte (6).** Dieselben zwei Werte, 35 und 39,6, erscheinen
dreimal. Als Balken ab null ist der zweite 1,13-mal so lang wie der erste,
wie die Werte. Als Balken auf einer Achse ab 34 bleibt vom ersten eine
Länge von 1 und vom zweiten eine von 5,6, und die Tinte erzählt vom
Fünffachen. Als Punkte auf derselben Achse ab 34 täuscht nichts, denn ein
Punkt hat keine Länge und zeigt seinen Wert über die Lage, die man an der
Achse abliest. Deshalb beginnen Balken bei null, während Punkte und Linien
woanders beginnen dürfen; eine gefüllte Fläche unter einer Linie ist
allerdings wieder Tinte.

**Blasen (7).** Bei einer Blase trägt die Fläche den Wert. Wer den Radius
nach dem Wert bemisst, verdoppelt mit dem Wert den Radius und vervierfacht
die Fläche. Ist dagegen die Fläche proportional zum Wert, wächst der Radius
nur um den Faktor Wurzel zwei, und die zweite Blase hat doppelt so viel
Tinte wie die erste; in ggplot2 leistet das `scale_size_area()`.

## Teil 2: Zwei berühmte Fälle (8–12)

Beide Fälle sind nicht als Bildschirmfoto übernommen, sondern mit ihren
Originalzahlen in ggplot2 nachgebaut; der Code steht in der Lektion.

**Der Steuerbalken (9–10).** Fox Business zeigte im Sommer 2012, was
geschieht, wenn die Steuersenkungen aus der Zeit von Präsident Bush
auslaufen: Der Spitzensteuersatz steigt von 35 % auf 39,6 %. Die Achse begann
bei 34 %, und der zweite Balken wirkte fast sechsmal so hoch wie der erste.
Mit der Achse ab null (10) ist er 13 % höher, und das ist der Unterschied
zwischen 35 und 39,6. Ob 4,6 Prozentpunkte viel sind, ist eine politische
Frage, die eine verschobene Achse nicht beantworten sollte.

**Die umgedrehte Achse (11–12).** Reuters veröffentlichte 2014 eine Grafik
zu den Morden mit Schusswaffen in Florida, wo 2005 das Gesetz „Stand Your
Ground“ in Kraft trat. Die y-Achse lief von oben nach unten, mit der Null
oben, sodass ein Anstieg wie ein Rückgang aussah. Mit der Null unten (12)
zeigen dieselben Zahlen des Florida Department of Law Enforcement, dass die
Morde mit Schusswaffen von 521 im Jahr 2005 auf 825 im Jahr 2007 stiegen. Ob
das Gesetz die Ursache ist, zeigt keine der beiden Fassungen, denn dafür
bräuchte es einen Vergleich mit Staaten ohne ein solches Gesetz.

## Teil 3: Fünf Tricks an der Umfrage (13–25)

Jede Folie zeigt links die täuschende Fassung und im nächsten Schritt rechts
die bessere. Die täuschende trägt eine graue Überschrift, die bessere eine
blaue.

**Abgeschnittene Achse (14–15).** Im Preisexperiment sahen die Befragten
zufällig Weihenstephan oder Alpro und nannten den Preis, ab dem ihnen ein
Liter zu teuer wäre. Die Mediane liegen bei 1,99 € und 2,00 €. Schneidet
`coord_cartesian()` die Achse bei 1,98 € ab, ist der eine Balken doppelt so
hoch wie der andere. Die bessere Fassung beginnt bei null, schreibt die
Mediane über die Balken und nennt die Fallzahl, 318 bei Weihenstephan und 293
bei Alpro; ein Cent bei Preisen um 2 € ist kein Unterschied, über den sich zu
reden lohnt.

**Anzahl statt Anteil (16–17).** Wer im Bioladen einkauft, gezählt nach
Ernährungsweise, ergibt 150 Flexitarier, 147 Allesesser und nur 20 Veganer.
Das zeigt vor allem die Größe der Gruppen, denn die Umfrage enthält 1.826
Allesesser und 36 Veganer. Die Frage, welche Gruppe am ehesten im Bioladen
kauft, beantwortet der Anteil je Gruppe: 56 % der Veganer und 8 % der
Allesesser, mit der Fallzahl in der Beschriftung.

**Radius statt Fläche (18–19).** 1.451 Personen trinken täglich Milch, 682
wöchentlich. Mit `scale_radius()` wächst der Radius mit der Anzahl, und die
Blase für täglich wirkt rund viereinhalbmal so groß wie die für wöchentlich.
Mit `scale_size_area()` ist die Fläche proportional, und die Blase ist gut
doppelt so groß. Noch leichter zu vergleichen wären Balken.

**Der stille Ausreißer (20–21).** Die mittlere Preisgrenze liegt bei 7,25 €
für Weihenstephan und 9,07 € für Alpro, als würden die Befragten für Alpro
ein Viertel mehr bezahlen. Die Achse beginnt korrekt bei null, doch in den
Mittelwerten stecken Antworten wie 344 € und 999 € für einen Liter Milch. Der
Boxplot der Preise bis 10 € zeigt die Mediane von 1,99 € und 2,00 €, und
seine Beschriftung nennt, was fehlt: 20 von 611 Antworten über 10 €.

**Winkel statt Längen (22–23).** Ein Kreisdiagramm hält sich an die
proportionale Tinte, verlangt aber, Winkel zu vergleichen, und ob
Pescetarier und Veganer gleich viele sind, lässt sich im Kreis kaum sagen.
Als sortierte Balken stehen die beiden kleinsten Gruppen mit je 36 Personen
sichtbar gleich lang untereinander, denn Längen sind leichter zu vergleichen
als Winkel.

**Manipulationsgalerie (24–25).** Jede Gruppe zieht eine falsche oder
irreführende Aussage über die Umfrage, prüft zuerst mit `count()` und
`summarise()`, was die Daten wirklich sagen, und baut dann ein Diagramm, das
die Aussage scheinbar belegt, ohne eine Zahl zu fälschen. Die anderen
Gruppen sehen nur das Diagramm und benennen den Trick, und zum Schluss baut
jede Gruppe die ehrliche Fassung daneben. Die sechs Aussagen betreffen die
Veganer als größte Bio-Käufer, die Zahlungsbereitschaft für Alpro, das
Umweltbewusstsein von Frauen und Männern, den Ruf von Oatly, die Milch der
Älteren und die Milch der TikTok-Nutzer. Was die Daten zu jeder sagen, steht
aufgeklappt in der Lektion.

## Schluss (26)

Die Tinte muss proportional zum Wert sein, den sie zeigt, und wer ein
Diagramm liest, schaut deshalb zuerst auf die Achsen, bevor er dem Bild
glaubt.
