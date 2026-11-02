# Entwurf: Input „types of variables“

**Status:** von Nicolas am 2026-11-02 freigegeben und gebaut. Abweichungen vom Entwurf beim Bau: Folie 12 nennt die Endpunkte der Skala so, wie die Daten sie beschreiben (1 hardly any, 5 almost all), und zeigt Median und Mittelwert der 30 Personen; Folie 14 behält den Baum von Folie 8 und schreibt unter Intervall und Verhältnis `<dbl>` und `<int>`, statt einen zweiten Baum mit stetig und Zählwert zu zeigen; Folie 15 teilt den Code auf `monty_hall` und `survey` auf, damit er kopiert sofort läuft; zum Merksatz kommen auf derselben Folie in einem zweiten Schritt die Leseempfehlungen. Nach Nicolas' Durchsicht vom 2026-11-03: die Beispiele im Baum sind allgemein (Augenfarbe, Kleidergröße, Temperatur, Körpergröße), Folie 10 zeigt die fünf Spiele als Raster mit `mean()` und `table()` statt eines roten Urteils, Folie 11 zeichnet echte Thermometer mit Skala, Folie 12 zeigt die Antworten als Balken mit Median und Mittelwert, die Typen in Folie 14 sind grau bis auf die Faktoren, und die Folie mit Link und QR-Code zur Tabelle ist entfallen, weil Verweise auf andere Inhalte nicht auf Folien gehören. 17 Folien, 33 Frames.

**Verortung:** Folien-Inhalt auf Hands-on Data Science
(`knowledge/content/types-of-variables-slides/`), Titel „Arten von
Variablen“ / „Types of variables“, als wiederkehrender Input von 20 Minuten im
Monty-Hall-Projekt, Phase 1 „Das Spiel spielen“, direkt nach der
interaktiven Tabelle „Was sollen wir messen?“ und vor den Vektoren. Kein
Datum, kein Verweis auf andere Sitzungen.

**Kernbotschaft:** `the scale of a variable decides what you may compute with
it, and R's type should say so.`

**Ablauf im Raum:** Ihr spielt das Spiel live, fragt euch, wie man die Spiele
systematisch aufzeichnet, und legt dafür in „Was sollen wir messen?“ eine
Tabelle mit Spalten und Zeilen an. Dieser Input setzt dort an: Er gibt den
Spalten Namen (Variable, Beobachtung), ordnet sie einem Skalenniveau zu und
übersetzt das Niveau in einen Datentyp von R. Am Ende geht es zurück in die
Tabelle, um die Typen der Spalten einzustellen.

**Publikum:** Masterstudierende ohne oder mit wenig R und meist ohne
Methodenvorwissen.

**Quellen:**
- Döring (2023): *Forschungsmethoden und Evaluation in den Sozial- und
  Humanwissenschaften*, 6. Aufl., Springer, Kapitel 8.2 (Variablen, S.
  225–226), 8.4 (die vier Skalenniveaus, S. 238–261) und 11.4
  (Datenmatrix, Codeplan, fehlende Werte, S. 576–585). Neu als Quelle
  `doering-research-methods` auf der Plattform.
- deine alten Abbildungen in „Background Data“: der Baum „types of
  variables“ (numerical: continuous, count; categorical: nominal, ordinal;
  qualitative) mit den R-Typen darunter, „variable (column) / observation
  (row)“, „Skalenniveaus“ mit Beispielen und die vier Tabellen „nominal /
  ordinal / interval / ratio variable“ mit Datentyp, Funktionen und
  Abbildung.
- *R for Data Science*, Kapitel „Data tidying“ (Variable, Beobachtung,
  Wert) und „Factors“.

**Sprache:** Folien englisch (Kleinschreibung), Sprechernotizen und
`skript.md` englisch, wie in den Nachbarsätzen.

**Design:** die neue `style.toml` von Hands-on Data Science (Schwarz, das
Dunkelblau der Plattform `#3d8fc4` als Akzent), dieselbe wie im Satz
„vectors and data frames in R“. Die Farben der R-Typen übernehme ich von
dort: double orange, integer türkis, character violett, logical gelb; factor
bekommt Rot.

**Interaktive Elemente:** keine Live-Abfragen. Ein Live-Moment mit der
Tabelle „Was sollen wir messen?“ am Schluss.

## Symbole

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Vergleich |
| 💬 | Merksatz |
| ⌨️ | Code |
| 🪜 | Aufbau in Schritten |
| 🧪 | Live-Moment |
| 🎞️ | Animation |

# Die Folien

## Teil 0: Einstieg (3 Folien)

### Folie 1 🎬

**Titel:** `types of variables`
**Untertitel:** `prof. dr. nicolas meseth`

### Folie 2

**Agenda** (von stagekit gefüllt): `observations and variables`, `four
scales`, `scales in r`

### Folie 3 📷

**Bild:** Zollstock, Thermometer, Küchenwaage und ein Zettel mit einer
Strichliste nebeneinander auf schwarzem Grund, von schräg oben, warmes
Streiflicht (erzeugt, 3840 × 2160).
**Text:** `a ruler, a thermometer, a scale and a tally sheet all measure, but
what you may do with their numbers is not the same.`
**Dazu sagen.** Vier Werkzeuge, vier Arten von Zahlen: Eine Länge darf man
verdoppeln, eine Temperatur in Grad Celsius nicht, und die Striche auf dem
Zettel zählen nur, wie oft etwas vorkam. Um diesen Unterschied geht es.

## Teil 1: observations and variables (3 Folien)

### Folie 4 🎬

`observations and variables` / `what a row and a column mean`

### Folie 5 🖼️ 🪜

**Titel klein:** `one row per game, one column per fact`
**Zeichnung:** die Tabelle aus dem Raum, fünf Spalten (`game`,
`prize_door`, `contestant_choice`, `monty_opens`, `decision`) und vier
Zeilen. Schritt 1: eine Zeile blau umrandet, daneben `observation (row)`.
Schritt 2: eine Spalte gelb hinterlegt, daneben `variable (column)`.
Schritt 3: eine Zelle markiert, `value (cell)`.
**Punchline:** `an observation is one game, a variable is one fact that can
differ from game to game.`
**Dazu sagen.** Nach *R for Data Science* und Döring (S. 577): Fälle in die
Zeilen, Variablen in die Spalten, ein Wert je Zelle. Diese Ordnung haben wir
im Raum schon gebaut, jetzt bekommt sie ihre Namen.

### Folie 6 📊

**Titel klein:** `a variable varies`
**Zeichnung:** links `decision`: „stay“, „switch“, „stay“ … (Variable),
rechts `number_of_doors`: 3, 3, 3 … grau (Konstante).
**Punchline:** `a fact that is the same in every game is a constant, and a
constant needs no column.`
**Dazu sagen.** Döring (S. 225): Eine Variable ist ein Merkmal, das
verschiedene Ausprägungen annehmen kann. Die Zahl der Türen ist in jedem
Spiel drei; sie gehört in die Beschreibung der Studie, nicht in die Tabelle.
Kurz erwähnen: manche Variablen sieht man direkt (die Tür), andere nur über
Indikatoren (Risikobereitschaft); das heißt manifest und latent.

## Teil 2: four scales (6 Folien)

### Folie 7 🎬

`four scales` / `what the numbers may mean`

### Folie 8 🖼️ 🪜

**Titel klein:** `types of variables`
**Zeichnung:** dein Baum aus „Background Data“, neu gezeichnet: oben
`types of variables`, darunter `categorical` (→ `nominal`, `ordinal`),
`numerical` (→ `interval`, `ratio`) und abseits `qualitative` (freier
Text). Unter jedem Blatt ein Beispiel aus Spiel oder Milchumfrage:
`decision`, `organic_share (1 never … 5 only)`, `year`, `price`,
`free text answer`. Schritt für Schritt: erst die beiden Äste, dann die
Blätter, dann die Beispiele.
**Punchline:** keine.
**Dazu sagen.** Döring spricht von Skalenniveaus (S. 239) und fasst Intervall
und Verhältnis als Kardinalskala oder metrisch zusammen; dein Baum trennt
numerische Variablen zusätzlich in stetig und Zählwerte, das kommt auf Folie
13 bei den R-Typen zurück.

### Folie 9 📊 🪜

**Titel klein:** `what each scale allows`
**Zeichnung:** Tabelle, Zeilen `nominal`, `ordinal`, `interval`, `ratio`,
Spalten `equal or not`, `order`, `differences`, `ratios`, Häkchen
treppenförmig, Zeile für Zeile aufgebaut; rechts je Zeile das Beispiel.
**Punchline:** `each scale keeps everything the one above it allows and adds
one more question you may ask.`
**Dazu sagen.** Döring S. 240–258: gleich/ungleich, größer/kleiner, gleiche
Abstände, gleiche Verhältnisse mit echtem Nullpunkt. Nach unten kann man
immer wechseln, nach oben nicht (S. 235).

### Folie 10 🖼️

**Titel klein:** `door 3 is not three times door 1`
**Zeichnung:** drei Türen mit 1, 2, 3; darunter `mean(prize_door)` → `2`,
rot durchgestrichen als Aussage „the average car stands behind door 2“.
**Punchline:** `a number used as a name is still a name, and its mean means
nothing.`
**Dazu sagen.** Nominal codiert als Zahl: R rechnet, ohne zu fragen. Döring
(S. 238): Software berechnet auch sinnlose Mittelwerte. Der Codeplan (S.
577–579) hält fest, was jede Zahl bedeutet.

### Folie 11 🖼️ 🎞️

**Titel klein:** `ten degrees are not twice as warm as five`
**Zeichnung:** zwei Thermometer, 5 °C und 10 °C; Animation: die Skala
wechselt zu Fahrenheit, aus 5 und 10 werden 41 und 50, das „doppelt“
verschwindet. Daneben ein Preis 1 € → 2 €, der in Cent umgerechnet doppelt
bleibt.
**Animation:** schrittweise, ein Abschnitt: die Zahlen am Thermometer
wechseln von °C nach °F (rund 1,5 s), danach steht 41 / 50 neben 2 € /
200 ct.
**Punchline:** `ratios need a true zero, which a price has and a temperature
in celsius does not.`
**Dazu sagen.** Döring S. 246 und 258. Für die Praxis selten wichtig, weil
kaum ein Verfahren eigens für Verhältnisskalen gebaut ist; Döring fasst
beide deshalb oft als metrisch zusammen.

### Folie 12 📊

**Titel klein:** `is a rating scale ordinal or interval?`
**Zeichnung:** die Antwortskala aus der Milchumfrage `1 never · 2 · 3 half
· 4 · 5 only`, darunter zwei Positionen: `purists: ordinal, use median()` und
`pragmatists: five or more steps, treat as interval, use mean()`.
**Punchline:** `if in doubt, compute both, and say which one you report.`
**Dazu sagen.** Döring S. 236, 243 und 252–253: ab fünf annähernd
gleichabständigen Stufen werden Ratingskalen oft als intervallskaliert
behandelt; im Zweifel beide Auswertungen rechnen, meist stimmen sie überein.

## Teil 3: scales in R (4 Folien)

### Folie 13 🎬

`scales in r` / `from a scale to a data type`

### Folie 14 🖼️ 🪜

**Titel klein:** `every scale has its type in r`
**Zeichnung:** dein Baum mit den R-Typen darunter, in den Farben der Typen:
nominal `<chr>` `<lgl>` `<fct>`, ordinal `<fct>` (ordered), interval und
ratio stetig `<dbl>`, Zählwert `<int>`, qualitativ `<chr>`.
**Punchline:** `a factor is how r remembers that a column is categorical.`

### Folie 15 ⌨️

**Titel klein:** `telling r what a column is`
**Code:**
```r
games <- games |>
  mutate(
    decision = factor(decision, levels = c("stay", "switch")),
    organic_share = factor(organic_share, levels = 1:5, ordered = TRUE)
  )
```
**Dazu sagen.** `factor()` für nominal, `ordered = TRUE` für ordinal; Zahlen
bleiben `<dbl>` oder `<int>`. Damit sortieren Tabellen und Abbildungen
richtig, und `mean()` auf einem Faktor gibt eine Warnung statt einer
sinnlosen Zahl.

### Folie 16 📊 🪜

**Titel klein:** `what you may compute`
**Zeichnung:** nach deinen vier Tabellen, verdichtet: Zeilen nominal,
ordinal, interval, ratio; Spalten `count`, `location`, `spread`,
`picture`. Treppe: nominal `count()` und Balken nach Häufigkeit; ordinal
dazu `median()`, `quantile()` und Balken in der Reihenfolge der Skala;
interval dazu `mean()`, `sd()`, Histogramm und Boxplot; ratio dazu
Verhältnisse wie `new / old`.
**Punchline:** `the scale tells you which function makes sense, r will run
all of them anyway.`

### Folie 17 🧪

**Titel klein:** `back to our table`
**Text:** `give every column of our table a type, then save it as rds.`
**Live-Moment:** Die Tabelle „Was sollen wir messen?“ auf dem Beamer. Die
Gruppe ordnet jede Spalte einem Skalenniveau zu und stellt den Typ ein
(`decision` als Faktor, die Türen als Zahl oder als Faktor, darüber kurz
streiten lassen), dann Export als RDS und `str(readRDS(…))` in R.
**Dazu sagen.** Die Türen sind der schöne Streitfall: Als Zahl lassen sie
sich vergleichen (`prize_door == contestant_choice`), als Faktor wären sie
ehrlicher. Beides ist vertretbar, solange man die Wahl begründet und den
Mittelwert nicht berichtet.

## Schluss (2 Folien)

### Folie 18 💬

`the scale of a variable decides what you may compute with it, and r's type
should say so.`

### Folie 19

**Text:** Schlusssatz plus `to read on:` Döring (2023), Kapitel 8.4 „Messung
und die vier Skalenniveaus“, und *R for Data Science*, Kapitel „Factors“
(r4ds.hadley.nz/factors.html).

# Offene Punkte

1. **Zählwerte:** Dein Baum trennt numerisch in `continuous` und `count`,
   Döring dagegen nach Intervall und Verhältnis. Ich zeige beides: Folie 8
   nach Döring, Folie 14 mit deinem Baum für die R-Typen. Wenn dir eine
   Einteilung genügt, nehme ich lieber deine.
2. **Qualitative Variablen** (freier Text) stehen nur als Ast im Baum, ohne
   eigene Folie; bei 20 Minuten reicht das aus meiner Sicht.
3. **Folie 11** ist die einzige Animation; die übrigen Schritte sind
   einfacher Aufbau.
