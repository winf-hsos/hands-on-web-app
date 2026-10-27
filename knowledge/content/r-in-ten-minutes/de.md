---
type: lesson
code: 1815
title: R in zehn Minuten
summary: >-
  Gerade so viel R, wie man für dplyr braucht: rechnen, Werte benennen,
  Vektoren, Funktionen, fehlende Werte, eine Tabelle ansehen und die Pipe.
level: 1
duration: 25
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [data-transformation-basics]
status: draft
updated: 2026-10-27
---

## Worum es geht

R ist eine Programmiersprache, die für die Arbeit mit Daten gemacht wurde.
Diese Lektion zeigt nur das, was du für die folgenden Lektionen zu dplyr
brauchst, und lässt alles andere weg. Jeder Codekasten ist ein kleiner
Editor: Du kannst den Code ändern und mit **Ausführen** starten. R läuft dabei
in deinem Browser, installieren musst du nichts; beim ersten Klick dauert das
Laden einen Moment.

## R als Taschenrechner

R rechnet aus, was du schreibst, und zeigt das Ergebnis sofort an:

```r
3 + 4
2.19 * 1.07
2^10
```

Die `[1]` vor jedem Ergebnis kannst du vorerst übersehen; sie zählt die Werte
einer Ausgabe mit und wird erst bei langen Ausgaben nützlich.

## Werten einen Namen geben

Mit `<-` legst du einen Wert unter einem Namen ab. Danach steht der Name für
den Wert, und R zeigt ihn an, sobald du ihn allein in eine Zeile schreibst:

```r
price <- 2.19
price_with_tax <- price * 1.07
price_with_tax
```

Den Pfeil liest man „bekommt“: `price` bekommt den Wert 2,19. Auch `=`
funktioniert, aber in R ist der Pfeil üblich, und so steht es auch in den
meisten Beispielen, die du im Netz findest.

## Vektoren: mehrere Werte auf einmal

Fast alles in R ist ein **Vektor**, eine Reihe von Werten derselben Art. Mit
`c()` (für *combine*) baust du einen. Rechnest du mit einem Vektor, rechnet R
mit jedem einzelnen Wert:

```r
ages <- c(56, 55, 47, 32, 74)
ages + 1
mean(ages)
```

Genau das macht R für Daten so bequem: Eine Spalte einer Tabelle ist ein
Vektor, und eine Rechnung gilt gleich für alle Zeilen.

## Funktionen

`mean()` ist eine **Funktion**: Sie bekommt in den Klammern ihre Werte, die
*Argumente*, und gibt ein Ergebnis zurück. Argumente können einen Namen
tragen, und Funktionen lassen sich ineinander schachteln:

```r
ages <- c(56, 55, 47, 32, 74)
round(mean(ages), digits = 1)
max(ages) - min(ages)
```

R liest geschachtelte Aufrufe von innen nach außen: erst `mean(ages)`, dann
`round()` mit diesem Ergebnis.

## Texte und fehlende Werte

Texte stehen in Anführungszeichen. Fehlt ein Wert, etwa weil jemand eine
Frage nicht beantwortet hat, steht dort `NA` (*not available*). Mit `NA` lässt
sich nicht rechnen, und R sagt das ehrlich:

```r
diet <- c("vegan", "omnivore", "vegetarian")
organic_share <- c(5, NA, 2)
mean(organic_share)
mean(organic_share, na.rm = TRUE)
```

Erst mit `na.rm = TRUE` (*remove NA*) lässt R die fehlenden Werte weg. Dass
man das ausdrücklich sagen muss, ist Absicht: Fehlende Werte sollen nicht
unbemerkt verschwinden.

## Eine Tabelle ansehen

In jedem R-Kasten auf dieser Plattform liegt eine kleine Tabelle bereit, die
`survey` heißt. Schreibst du ihren Namen, zeigt R sie an:

```r
survey
```

Eine Tabelle heißt in R **Data Frame**; die Variante, die dplyr verwendet,
nennt sich **Tibble**. Oben steht, wie viele Zeilen und Spalten sie hat, und
unter jedem Spaltennamen in spitzen Klammern ihr Typ: `<int>` für ganze
Zahlen, `<dbl>` für Kommazahlen, `<chr>` für Texte. Passt nicht alles auf die
Breite, nennt R die übrigen Spalten darunter.

Einzelne Spalten holst du mit `$` heraus, und jede ist ein Vektor:

```r
mean(survey$age)
table(survey$diet)
```

## Der Datensatz `survey`

Die 30 Zeilen stammen aus einer Online-Befragung zu Milch und
Milchalternativen von Prof. Dr. Ulrich Enneking (Hochschule Osnabrück),
an der rund 2.800 Menschen teilgenommen haben. Für diese Lektionen sind es
wenige ausgewählte Personen und zehn Fragen; die Spalten sind englisch
benannt, wie es beim Programmieren üblich ist.

| Spalte | Bedeutung |
|---|---|
| `id` | laufende Nummer der Person in diesem Auszug |
| `age` | Alter in Jahren |
| `gender` | Geschlecht (`female`, `male`) |
| `state` | Bundesland |
| `town_size` | Größe des Wohnorts, von `village` bis `city` |
| `household_size` | Zahl der Personen im Haushalt |
| `diet` | Ernährungsweise, etwa `omnivore`, `flexitarian`, `vegan` |
| `organic_share` | Anteil an Bio-Lebensmitteln beim Einkauf, von 1 (kaum) bis 5 (fast alles) |
| `milk_freq` | wie oft die Person Milch trinkt: `daily`, `weekly`, `monthly`, `rarely` |
| `milk_brand` | welche Marke ihr im Preisteil gezeigt wurde: `Weihenstephan` oder `alpro` |
| `price_too_expensive` | ab welchem Preis in Euro ihr ein Liter dieser Marke zu teuer wäre |

Nicht jede Person hat jede Frage bekommen, deshalb gibt es fehlende Werte.
Den Preisteil zum Beispiel sah nur ein Teil der Befragten, und jeweils nur
für eine der beiden Marken. Einige Werte sind auch bewusst seltsam, damit es
beim Aufräumen etwas zu entdecken gibt.

## Die Pipe: und dann

Mit dplyr schreibt man eine Auswertung als Kette von Schritten. Das Zeichen
`|>` heißt **Pipe** und reicht das Ergebnis links als erstes Argument an die
Funktion rechts weiter. Am besten liest man es als „und dann“:

```r
survey |> nrow()
```

Das heißt dasselbe wie `nrow(survey)`: Nimm `survey` und dann zähle die
Zeilen. Ein Verb von dplyr hängst du genauso an:

```r
survey |> filter(diet == "vegan")
```

Das liest sich: Nimm `survey` und dann behalte die Zeilen, in denen `diet`
gleich `"vegan"` ist. Bei einem
Schritt ist der Unterschied klein, bei fünf Schritten macht die Pipe aus
einem unlesbaren Knäuel von Klammern eine Liste, die man von oben nach unten
liest.

> [!TIP]
> Die Pipe tippst du schneller mit **Strg+Umschalt+M** (am Mac
> **Cmd+Umschalt+M**). Das Kürzel funktioniert in jedem R-Kasten dieser
> Plattform genauso wie in Positron.

> [!NOTE]
> In älteren Beispielen steht statt `|>` oft `%>%`. Das ist die Pipe aus dem
> Paket magrittr, die es gab, bevor R eine eigene bekam. Für alles, was du
> hier lernst, verhalten sich beide gleich.

## Pakete

dplyr ist ein **Paket**, eine Erweiterung von R. Auf dieser Plattform ist es
schon geladen. Arbeitest du in Positron auf deinem eigenen Rechner,
installierst du es einmal und lädst es dann am Anfang jedes Skripts:

```r static
install.packages("dplyr")  # einmal
library(dplyr)             # in jedem Skript
```

## Zum Mitnehmen

- `<-` gibt einem Wert einen Namen, `c()` baut einen Vektor, und Rechnungen
  gelten für jeden Wert eines Vektors.
- `NA` steht für einen fehlenden Wert; `na.rm = TRUE` lässt ihn beim Rechnen
  ausdrücklich weg.
- Eine Tabelle ist ein Data Frame oder Tibble, eine Spalte holst du mit `$`.
- `|>` liest man „und dann“ und macht aus einer Auswertung eine Folge von
  Schritten.
