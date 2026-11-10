---
type: lesson
code: 8043
title: Erste Schritte mit Quarto
summary: >-
  Alles, was du für ein wissenschaftliches Paper in Quarto brauchst: Kopf,
  Markdown, R-Code mit Abbildungen und Tabellen, Zahlen aus dem Code im Text,
  Querverweise, Formeln, Zitate und das Rendern nach PDF über Typst.
objectives:
  intro: "In dieser Lektion lernst du, ein Paper in Quarto zu schreiben, in dem Text, Code und Ergebnisse in einer Quelle liegen, und kannst danach:"
  goals:
    - "erklären, was beim Rendern eines Quarto-Dokuments passiert und warum es alles selbst laden muss, was es braucht"
    - "den Kopf eines Papers in YAML schreiben, mit Titel, Autoren, Abstract, Sprache und dem Format Typst auf A4"
    - "Text in Markdown gliedern und auszeichnen, mit Überschriften, Listen, Links und Fußnoten"
    - "R-Code in Blöcken ausführen und mit Optionen steuern, was im PDF erscheint"
    - "Abbildungen und Tabellen aus dem Code mit Beschriftung erzeugen und im Text auf sie verweisen"
    - "Zahlen im Text aus dem Code berechnen lassen, statt sie abzutippen"
    - "Formeln setzen, Literatur aus einer BibTeX-Datei zitieren und ein Literaturverzeichnis erzeugen"
    - "die häufigsten Fehler beim Rendern erkennen und beheben"
level: 1
duration: 60
topics: [communicating-results, reproducible-work]
modules: [pmg, ea, wmg]
areas: [ds]
relations:
  see_also: [paper-structure, eda-software, milk-survey-compact]
status: published
updated: 2026-11-10
---

![Folien: Erste Schritte mit Quarto](item:quarto-first-steps-slides)

Die meisten Berichte entstehen durch Kopieren: In R entsteht eine Grafik,
sie wird exportiert und in Word eingefügt, und eine Zahl wird von Hand in
den Text übertragen. Ändert sich danach ein Filter, stimmt der Bericht nicht
mehr, und niemand merkt es. [Quarto](https://quarto.org) dreht das um. Ein
Quarto-Dokument enthält den Text und den Code, der die Ergebnisse
berechnet, und beim Rendern rechnet es sich selbst: Abbildungen, Tabellen
und jede Zahl im Text kommen frisch aus den Daten. Diese Lektion zeigt alles,
was du dafür brauchst, an einem kleinen Paper über die
[[milk-survey-compact]].

## Was du brauchst

Quarto ist in Positron schon enthalten, und Quarto bringt Typst mit, das
Programm, das aus dem Dokument ein PDF setzt. Installieren musst du nur noch
das R-Paket rmarkdown, über das Quarto den R-Code ausführt. Führ diese Zeile
einmal in der Konsole aus:

```r static
install.packages("rmarkdown")
```

Wie du R und Positron einrichtest, steht in [[eda-software]].

## Ein Dokument, drei Bestandteile

Ein Quarto-Dokument ist eine Textdatei mit der Endung `.qmd`. Du legst sie in
Positron über *File → New File → Quarto Document* an und speicherst sie im
Ordner deines Projekts, etwa als `milk-prices.qmd`. Die Datei besteht aus
genau drei Dingen:

1. einem **Kopf** zwischen zwei Zeilen mit drei Strichen, der Angaben zum
   ganzen Dokument enthält,
2. **Text** in Markdown,
3. **R-Code** in Blöcken, die beim Rendern ausgeführt werden.

Beim **Rendern** führt Quarto zuerst den ganzen R-Code von oben nach unten in
einer frischen R-Sitzung aus und setzt die Ergebnisse an die Stelle der
Blöcke. Das Ergebnis gibt es an Typst weiter, das daraus das PDF setzt.
Daraus folgen zwei Regeln, die die meisten Fehlermeldungen erklären: Das
Dokument muss alles selbst laden, was es braucht, auch wenn es in deiner
Konsole schon geladen ist, und ein Fehler im Code hält das Rendern an.

## Der Kopf

Im Kopf steht alles, was das Dokument als Ganzes betrifft. Er ist in YAML
geschrieben: ein Name, ein Doppelpunkt, ein Wert, und was zusammengehört,
wird mit Leerzeichen eingerückt, nie mit Tabulatoren. Für ein Paper auf
Deutsch sieht er so aus:

```yaml
---
title: "Was ist Milch wert?"
subtitle: "Eine Auswertung der Umfrage zu Milch und Schokolade"
author:
  - name: Erika Muster
    affiliation:
      - name: Hochschule Osnabrück
  - name: Max Beispiel
date: today
lang: de
abstract: |
  Zwei bis drei Sätze, die das ganze Paper zusammenfassen.
format:
  typst:
    papersize: a4
    number-sections: true
    toc: false
bibliography: references.bib
execute:
  echo: false
  warning: false
---
```

Die wichtigsten Zeilen:

- `lang: de` sorgt für deutsche Silbentrennung und deutsche Beschriftungen
  wie „Abbildung“ und „Tabelle“.
- `format: typst` rendert das Dokument über Typst als PDF.
- `papersize: a4` ist nötig, weil Quarto sonst das amerikanische Format
  Letter nimmt.
- `number-sections: true` nummeriert die Abschnitte; erst dann zeigen
  Verweise auf Abschnitte eine Nummer.
- `execute: echo: false` blendet den R-Code im ganzen Dokument aus, sodass
  im PDF nur die Ergebnisse stehen. In einem Paper ist das der Normalfall.

## Text in Markdown

Markdown ist Text mit ein paar Zeichen für die Form. Du schreibst den Inhalt,
und die Form kommt aus der Vorlage:

```markdown
# Einleitung

Milch ist eines der am häufigsten gekauften Lebensmittel. Wir fragen,
**wie viel** sie den Befragten wert ist, und nutzen dafür eine
*Online-Befragung*.

- ein Punkt einer Liste
- ein zweiter Punkt

1. ein nummerierter Punkt
2. ein zweiter

Mehr zu Quarto steht auf [quarto.org](https://quarto.org).^[Eine Fußnote
steht direkt im Text.]
```

Eine Raute macht eine Überschrift, zwei Rauten eine Unterüberschrift. Vor
jeder Liste muss eine Leerzeile stehen, sonst wird sie zu Fließtext in einer
Zeile; das ist der häufigste stille Fehler in Markdown.

## Abschnitte, auf die du verweisen kannst

Eine Überschrift bekommt in geschweiften Klammern eine Marke, die mit `sec-`
beginnt. Im Text verweist du mit `@` auf diese Marke, und Quarto setzt
daraus „Abschnitt 2“, auch wenn sich die Gliederung später ändert:

```markdown
# Methode {#sec-method}

Wie wir die Daten aufbereitet haben, beschreibt @sec-method.
```

Marken schreibst du klein und ohne Unterstriche, also `sec-method` und nicht
`sec_Method`.

## R-Code in Blöcken

Ein Codeblock beginnt mit drei Backticks und `{r}` und endet mit drei
Backticks. Zeilen, die mit `#|` beginnen, sind Optionen für diesen Block;
Quarto liest sie, R ignoriert sie. Der erste Block lädt in jedem Dokument die
Pakete und die Daten:

````markdown
```{r}
#| label: setup
#| message: false
library(tidyverse)

survey <- read_csv("milk_survey_compact.csv")
```
````

Der Pfad zur Datei gilt relativ zum Dokument: Liegt die CSV-Datei im selben
Ordner wie die `.qmd`-Datei, genügt ihr Name.

Mit den Optionen steuerst du, was im PDF erscheint:

| Option | Wirkung |
|---|---|
| `echo: false` | der Code läuft, wird aber nicht gezeigt; das Ergebnis erscheint |
| `include: false` | der Code läuft, aber weder Code noch Ergebnis erscheinen |
| `eval: false` | der Code wird gezeigt, aber nicht ausgeführt |
| `warning: false` | Warnungen erscheinen nicht im Dokument |
| `message: false` | Meldungen, etwa beim Laden eines Pakets, erscheinen nicht |

Was für das ganze Dokument gelten soll, stellst du im Kopf unter `execute:`
ein, statt es in jeden Block zu schreiben.

## Abbildungen

Eine Abbildung entsteht aus einem Block, der eine Grafik zeichnet. Damit sie
eine Nummer und eine Beschriftung bekommt und du auf sie verweisen kannst,
braucht der Block eine Marke, die mit `fig-` beginnt, und eine Beschriftung
mit `fig-cap`:

````markdown
```{r}
#| label: fig-threshold
#| fig-cap: "Preis, ab dem ein Liter Milch zu teuer ist."
#| fig-width: 6
#| fig-height: 3.5
survey |>
  filter(price_too_expensive <= 5) |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram(binwidth = 0.25) +
  labs(x = "Preis in Euro", y = "Anzahl Befragte")
```
````

Ohne `fig-` am Anfang der Marke ist es keine Abbildung, auf die man verweisen
kann. Breite und Höhe stehen in Zoll; 6 mal 3,5 passt gut auf eine Seite in
A4.

## Tabellen

Für Tabellen gilt dasselbe mit `tbl-` und `tbl-cap`. Einen Data Frame machst
du mit `knitr::kable()` zu einer gesetzten Tabelle; das funktioniert mit
Typst zuverlässig:

````markdown
```{r}
#| label: tbl-diet
#| tbl-cap: "Befragte nach Ernährungsweise."
survey |>
  count(diet) |>
  arrange(desc(n)) |>
  knitr::kable(col.names = c("Ernährungsweise", "Anzahl"))
```
````

Eine kleine Tabelle, die nicht aus den Daten kommt, schreibst du direkt in
Markdown und gibst ihr die Beschriftung in einer Zeile darunter:

```markdown
| Teil       | Seiten |
|------------|-------:|
| Einleitung |      1 |
| Methode    |      2 |

: Umfang der Teile {#tbl-parts}
```

## Verweise auf Abbildungen und Tabellen

Im Text verweist du mit `@` und der Marke. Quarto nummeriert und setzt das
richtige Wort davor, und die Nummern stimmen auch, nachdem du Abbildungen
umgestellt hast:

```markdown
Wie @fig-threshold zeigt, liegen die meisten Antworten unter zwei Euro.
Die Ernährungsweisen der Befragten stehen in @tbl-diet.
```

Schreib nie „die Abbildung unten“, denn wo „unten“ ist, entscheidet der
Seitenumbruch.

## Zahlen im Text

Das ist der Teil, der das Abtippen ersetzt: Eine Zahl im Satz kann R-Code
sein. Zwischen einfachen Backticks mit `{r}` davor wird der Ausdruck beim
Rendern berechnet und das Ergebnis eingesetzt:

```markdown
Insgesamt haben `{r} nrow(survey)` Personen teilgenommen. Der Median der
Preisschwelle liegt bei
`{r} median(survey$price_too_expensive, na.rm = TRUE)` Euro.
```

Längere Rechnungen legst du in einen Block mit `include: false` und setzt im
Text nur noch das Ergebnis ein:

````markdown
```{r}
#| include: false
median_threshold <- survey |>
  summarize(median = median(price_too_expensive, na.rm = TRUE)) |>
  pull(median)
```

Der Median der Preisschwelle liegt bei `{r} median_threshold` Euro.
````

Schreib jeden Wert, der aus den Daten kommt, auf diese Weise. Ändern sich die
Daten, ändert sich der Satz mit.

## Formeln

Formeln stehen zwischen Dollarzeichen, im Satz mit einem, als eigene Zeile
mit zwei. Die Schreibweise ist die von LaTeX, und eine abgesetzte Formel
bekommt wie eine Abbildung eine Marke, hier mit `eq-`:

```markdown
Der Mittelwert $\bar{x}$ ist definiert als

$$
\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i
$$ {#eq-mean}

Wir verwenden @eq-mean für alle Preisangaben.
```

Innerhalb von `$$` darf keine Leerzeile stehen.

## Zitieren

Die Literatur steht in einer eigenen Datei im BibTeX-Format, etwa
`references.bib` neben dem Dokument. Einen Eintrag dafür geben Google
Scholar, Literaturprogramme wie Zotero und die Seiten der Verlage aus:

```text
@book{doering2023,
  author    = {Döring, Nicola},
  title     = {Forschungsmethoden und Evaluation in den Sozial- und
               Humanwissenschaften},
  edition   = {6},
  publisher = {Springer},
  year      = {2023},
  doi       = {10.1007/978-3-662-64762-2}
}
```

Im Kopf steht `bibliography: references.bib`, und im Text zitierst du mit
`@` und dem Schlüssel des Eintrags:

```markdown
Eine Forschungsfrage grenzt das Thema ein [@doering2023, S. 148].
Wie @doering2023 zeigt, ...

# Literatur {.unnumbered}

::: {#refs}
:::
```

Eckige Klammern setzen den Verweis in Klammern, ohne sie steht der Name im
Satz. Das Literaturverzeichnis erscheint dort, wo der Block `{#refs}` steht,
sonst am Ende des Dokuments. Den Zitierstil legt `csl:` im Kopf fest, etwa
`csl: apa.csl` mit einer Datei aus dem
[Zotero Style Repository](https://www.zotero.org/styles). Bei Typst übernimmt
Typst das Zitieren selbst; wer genau den Stil einer CSL-Datei will, schreibt
zusätzlich `citeproc: true` in den Kopf.

## Rendern

In Positron rendert der Knopf **Preview** über dem Editor das Dokument, und
das PDF erscheint im Bereich *Viewer* daneben. Im Terminal macht dasselbe

```text
quarto render milk-prices.qmd
```

Das PDF liegt danach neben der `.qmd`-Datei.

## Wenn das Rendern scheitert

Die meisten Fehler kommen aus vier Ursachen, und die Meldung verrät, welche
es ist:

1. **`could not find function`:** Ein Paket ist nicht geladen. Das Dokument
   rendert in einer frischen Sitzung und kennt nur, was es selbst lädt; der
   `library()`-Aufruf gehört in den ersten Block.
2. **`does not exist` beim Einlesen:** Die Datei liegt nicht dort, wo der Pfad
   relativ zum Dokument hinzeigt.
3. **Ein Fehler im YAML:** Meist ist die Einrückung falsch oder ein
   Doppelpunkt im Titel steht ohne Anführungszeichen.
4. **`?@fig-...` im PDF:** Die Marke beginnt nicht mit `fig-` oder `tbl-`,
   oder sie ist anders geschrieben als im Verweis.

Zwei Fehler halten das Rendern nicht an, fallen aber im PDF auf: eine Liste
ohne Leerzeile davor, die zu Fließtext wird, und ein PDF im Format Letter,
weil `papersize: a4` fehlt. Hilft das alles nicht, kopier die Meldung in den
Chat mit deinem KI-Agenten.

## Das ganze Beispiel zum Herunterladen

Das kleine Paper aus den Folien steht hier vollständig, auf Englisch wie die
Folien; für ein deutsches Paper setzt du `lang: de` in den Kopf. Leg beide
Dateien zusammen mit `milk_survey_compact.csv` aus dem
[[milk-survey-compact]] in einen Ordner, öffne die `.qmd`-Datei in Positron
und rendere sie. Zuerst das Dokument selbst:

````markdown file=milk-prices.qmd
---
title: "What is milk worth?"
author: "Group 4"
date: today
lang: en
abstract: |
  We ask from which price on a litre
  of milk is too expensive for shoppers.
format:
  typst:
    papersize: a4
    number-sections: true
execute:
  echo: false
bibliography: references.bib
csl: apa
---

<!-- This paper reads the compact milk survey from the file
     milk_survey_compact.csv, which must lie in the same folder. -->

```{r}
#| label: setup
#| message: false
library(tidyverse)

survey <- read_csv("milk_survey_compact.csv")
```

## Introduction

Milk is one of the few foods whose price many shoppers know by heart. We ask
from which price on a litre is *too expensive*, and we look at the whole
distribution of the answers before we summarise it [@wickham2023, chap. 10].

## Method {#sec-method}

The data come from an online survey with a **quota sample** of people who do
their own shopping. Each respondent saw one of two brands of milk, chosen at
random, and named the price from which it would be too expensive. We use

- `price_too_expensive`, the price in euros, and
- `diet`, the diet the respondents named.

We summarise the prices with the median rather than the mean

$$
\bar{x} = \frac{1}{n} \sum_{i=1}^{n} x_i
$$

because a few answers lie far above any real price.^[Some answers reach 999
euros, a common code for "don't know".]

## Results

```{r}
#| label: fig-threshold
#| fig-cap: "Price at which milk is too expensive."
survey |>
  filter(price_too_expensive <= 5) |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram(binwidth = 0.25)
```

@fig-threshold shows the answers up to five euros.

The median threshold is
`{r} median(survey$price_too_expensive, na.rm = TRUE)`
euros.

```{r}
#| label: tbl-diet
#| tbl-cap: "Respondents by diet."
survey |>
  count(diet, sort = TRUE) |>
  knitr::kable()
```

Most respondents eat meat, see @tbl-diet.

## Discussion

As described in @sec-method, the respondents form a quota sample and not a
random one, so the thresholds describe the people who took part and not all
of Germany.
````

Daneben gehört die Literaturdatei, auf die der Kopf mit `bibliography:`
verweist:

```text file=references.bib
@book{wickham2023,
  author = {Wickham, Hadley and
    Çetinkaya-Rundel, Mine and
    Grolemund, Garrett},
  title = {R for Data Science},
  edition = {2},
  publisher = {O'Reilly},
  year = {2023},
  url = {https://r4ds.hadley.nz}
}
```

## Zum Mitnehmen

- Ein Quarto-Dokument besteht aus einem Kopf in YAML, Text in Markdown und
  R-Code in Blöcken, und beim Rendern rechnet es sich selbst.
- Das Dokument lädt alles selbst, was es braucht, und ein Fehler im Code hält
  das Rendern an.
- Abbildungen bekommen eine Marke mit `fig-`, Tabellen mit `tbl-`, Abschnitte
  mit `sec-`, und auf jede verweist du mit `@`.
- Jede Zahl, die aus den Daten kommt, steht als `` `{r} ...` `` im Text.
- Literatur steht in einer BibTeX-Datei und wird mit `[@schlüssel]` zitiert.
- Für ein PDF auf Deutsch gehören `lang: de`, `format: typst` und
  `papersize: a4` in den Kopf.
