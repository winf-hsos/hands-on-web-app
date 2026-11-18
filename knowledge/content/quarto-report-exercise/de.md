---
type: exercise
code: 6183
title: "Übung: Ein kleiner Bericht mit Quarto"
summary: >-
  Aus einer Vorlage, in der nur der Kopf steht, wird in kleinen Schritten ein
  zweiseitiger Bericht über die Befragten der Umfrage, und dabei setzt du
  alles ein, was die Folien zu Quarto zeigen: Kopf, Markdown, Formel,
  Codeblock, Abbildung, Tabelle, Zahlen im Text, Querverweise und ein Zitat.
objectives:
  intro: "In dieser Übung baust du in einer einzigen Datei einen kleinen Bericht und kannst danach:"
  goals:
    - "den Kopf eines Quarto-Dokuments um Abstract, Abschnittsnummern und `echo: false` ergänzen"
    - "Überschriften, Hervorhebungen, eine Liste, einen Link, eine Fußnote und eine Formel in Markdown schreiben"
    - "die Umfrage in einem Codeblock laden und eine Abbildung und eine Tabelle mit Marke und Beschriftung erzeugen"
    - "Zahlen aus R in den Text setzen, statt sie abzutippen"
    - "auf Abschnitte, Abbildungen und Tabellen verweisen und eine Quelle zitieren"
level: 1
duration: 45
topics: [communicating-results, reproducible-work]
modules: [pmg]
areas: [ds]
datasets: [milk-chocolate-survey]
relations:
  requires: [quarto-first-steps]
  see_also: [quarto-first-steps-slides, quarto-paper-exercise, milk-chocolate-survey]
status: draft
updated: 2026-11-18
---

Die Folien [[quarto-first-steps-slides|Erste Schritte mit Quarto]] zeigen die
Bausteine eines Quarto-Dokuments an einem fertigen Beispiel. In dieser Übung
setzt du sie selbst zusammen: Du lädst eine Vorlage herunter, in der nur der
Kopf steht, und füllst sie Schritt für Schritt, bis ein kleiner Bericht
darüber entsteht, wer an der [[milk-chocolate-survey|Umfrage zu Milch und
Schokolade]] teilgenommen hat. Du arbeitest dabei die ganze Zeit in einer
einzigen Datei.

Rendere nach jedem Schritt mit **Preview** und sieh dir das PDF an. Dann
findest du einen Fehler sofort, solange seit dem letzten Rendern nur wenig
dazugekommen ist.

## Vorbereitung

1. Leg einen neuen Ordner `quarto-uebung` an und speichere darin zwei
   Dateien: die Vorlage [`bericht.qmd`](media/bericht.qmd) und die Umfrage
   `mds12_schoko_milch.csv` aus dem Kasten oben auf dieser Seite (oder aus
   ILIAS). Beide müssen im selben Ordner liegen, weil der Bericht die Daten
   über einen Dateinamen ohne Pfad einliest.

2. Öffne den Ordner in Positron und darin `bericht.qmd`. Trag bei `author`
   deinen Namen ein und rendere mit **Preview**. Im PDF stehen bisher nur
   Titel, Name und das heutige Datum.

> [!HINT]
> Bricht das Rendern ab, bevor ein PDF erscheint, fehlt meist das Paket
> rmarkdown. Installiere es einmal in der Konsole mit
> `install.packages("rmarkdown")` und rendere noch einmal.

## Teil 1: Der Kopf

3. Ergänze den Kopf um ein Abstract aus ein oder zwei Sätzen, schalte unter
   `typst` die Nummern der Abschnitte ein und blende unter `execute` den Code
   im ganzen Bericht aus. Achte auf die Einrückung mit Leerzeichen.

> [!SOLUTION]
> ```yaml
> ---
> title: "Wer hat an der Umfrage teilgenommen?"
> author: "Dein Name"
> date: today
> lang: de
> abstract: |
>   Wir beschreiben, wer an der Umfrage zu Milch und Schokolade
>   teilgenommen hat: wie alt die Befragten sind und wie sie sich ernähren.
> format:
>   typst:
>     papersize: a4
>     number-sections: true
> execute:
>   echo: false
> ---
> ```
>
> Das Abstract erscheint unter dem Datum. Die Nummern und das Ausblenden
> siehst du erst, wenn es Überschriften und Code gibt.

## Teil 2: Text in Markdown

4. Schreib unter den Kopf vier Überschriften der zweiten Ebene: Einleitung,
   Daten, Ergebnisse und Diskussion. Gib der Überschrift „Daten“ die Marke
   `{#sec-daten}`, damit du später auf sie verweisen kannst.

> [!SOLUTION]
> ```markdown
> ## Einleitung
>
> ## Daten {#sec-daten}
>
> ## Ergebnisse
>
> ## Diskussion
> ```
>
> Im PDF tragen die Überschriften jetzt die Nummern 1 bis 4, weil der Kopf
> `number-sections: true` setzt.

5. Schreib unter „Einleitung“ zwei oder drei Sätze darüber, worum es im
   Bericht geht. Setz dabei ein Wort **fett** und eines *kursiv*, verlinke die
   Seite der Umfrage auf dieser Plattform und ergänze eine Fußnote, etwa wer
   die Umfrage durchgeführt hat.

> [!SOLUTION]
> ```markdown
> Jeder Bericht über eine Umfrage beginnt mit der Frage, **wer** geantwortet
> hat. Erst danach lässt sich sagen, für wen die Ergebnisse gelten. Wir
> beschreiben die Befragten der
> [Umfrage zu Milch und Schokolade](https://hands-on-computer-science.de/ds/de/items/milk-chocolate-survey/)
> nach Alter und *Ernährungsweise*.^[Die Umfrage hat Prof. Dr. Ulrich Enneking
> im November 2025 durchgeführt.]
> ```
>
> Ein Zeilenumbruch in der Quelle ist im PDF kein Zeilenumbruch: Erst eine
> leere Zeile beginnt einen neuen Absatz.

6. Zähl unter „Daten“ als Liste die drei Spalten auf, mit denen du arbeitest:
   `Q002alter` (Alter in Jahren), `Q004geschlechtf` (Geschlecht) und
   `V041nofleischf` (Ernährungsweise). Schreib Spaltennamen in Backticks,
   damit sie als Code erscheinen. Ergänze danach die Formel für einen Anteil,
   *p* = *k* / *n*, als Formel in einer eigenen Zeile, und erkläre *k* und *n* im
   Satz darunter.

> [!SOLUTION]
> ```markdown
> Wir verwenden drei Spalten:
>
> - `Q002alter`, das Alter in Jahren,
> - `Q004geschlechtf`, das Geschlecht, und
> - `V041nofleischf`, die Ernährungsweise.
>
> Anteile berechnen wir als
>
> $$
> p = \frac{k}{n},
> $$
>
> wobei $k$ die Zahl der Befragten mit einer Eigenschaft ist und $n$ die Zahl
> aller Befragten, die die Frage beantwortet haben.
> ```
>
> Fehlt die leere Zeile vor der Liste, setzt Quarto die Spiegelstriche als
> Fließtext in den Satz davor. Das bricht nichts ab und fällt deshalb erst im
> PDF auf.

## Teil 3: Code und Ergebnisse

7. Füg direkt unter dem Kopf einen Codeblock ein, der das tidyverse lädt und
   die Umfrage als `survey` einliest. Gib ihm die Marke `setup` und die
   Option `message: false`. Rendere: Im PDF ändert sich nichts. Warum?

> [!SOLUTION]
> ````markdown
> ```{r}
> #| label: setup
> #| message: false
> library(tidyverse)
>
> survey <- read_csv("mds12_schoko_milch.csv")
> ```
> ````
>
> Der Block läuft, aber er hat kein sichtbares Ergebnis: Den Code blendet
> `echo: false` im Kopf aus, die Meldungen beim Laden blendet
> `message: false` aus.

8. Setz an den Anfang des Abschnitts „Daten“ einen Satz, der sagt, wie viele
   Personen an der Umfrage teilgenommen haben. Tipp die Zahl nicht ab,
   sondern lass sie von R ausrechnen.

> [!SOLUTION]
> ```markdown
> An der Umfrage haben `{r} nrow(survey)` Personen teilgenommen.
> ```
>
> Im PDF steht dort 2811. Ändert sich der Datensatz, etwa weil du Befragte
> ausschließt, ändert sich die Zahl beim nächsten Rendern mit.

9. Erzeuge unter „Ergebnisse“ ein Histogramm des Alters mit einer Breite von
   fünf Jahren je Balken. Gib dem Block eine Marke, die mit `fig-` beginnt,
   und eine Beschriftung. Schreib darunter einen Satz, der mit `@fig-…` auf
   die Abbildung verweist.

> [!SOLUTION]
> ````markdown
> ```{r}
> #| label: fig-alter
> #| fig-cap: "Alter der Befragten."
> #| fig-width: 6
> #| fig-height: 3.5
> survey |>
>   ggplot() +
>   aes(x = Q002alter) +
>   geom_histogram(binwidth = 5) +
>   labs(x = "Alter in Jahren", y = "Anzahl Befragte")
> ```
>
> @fig-alter zeigt, wie alt die Befragten sind.
> ```
> ````
>
> Quarto nummeriert die Abbildung und schreibt im Text „Abbildung 1“, weil
> der Kopf `lang: de` setzt. `fig-width` und `fig-height` geben die Größe in
> Zoll an und dürfen fehlen.

10. Ergänze den Satz unter der Abbildung um zwei weitere Zahlen aus R: das
    Median-Alter und den Anteil der Frauen in Prozent, gerundet auf ganze
    Zahlen. In `Q004geschlechtf` stehen die Werte `Frauen` und `Männer`.

> [!SOLUTION]
> ```markdown
> @fig-alter zeigt, wie alt die Befragten sind. Die Hälfte ist jünger als
> `{r} median(survey$Q002alter)` Jahre, und
> `{r} round(mean(survey$Q004geschlechtf == "Frauen", na.rm = TRUE) * 100)`
> Prozent sind Frauen.
> ```
>
> Im PDF steht: „Die Hälfte ist jünger als 50 Jahre, und 53 Prozent sind
> Frauen.“ Der Mittelwert eines Vergleichs mit `==` ist der Anteil der
> Zeilen, in denen er zutrifft, also genau das *k* / *n* aus deiner Formel.

11. Erzeuge darunter eine Tabelle, wie viele Befragte sich wie ernähren, mit
    der Anzahl und dem Anteil in Prozent, sortiert nach Anzahl. Gib dem Block
    eine Marke, die mit `tbl-` beginnt, und eine Beschriftung, und verweise im
    Satz darunter auf die Tabelle.

> [!SOLUTION]
> ````markdown
> ```{r}
> #| label: tbl-ernaehrung
> #| tbl-cap: "Befragte nach Ernährungsweise."
> survey |>
>   count(V041nofleischf, sort = TRUE) |>
>   mutate(anteil = round(n / sum(n) * 100, 1)) |>
>   knitr::kable(col.names = c("Ernährungsweise", "Anzahl", "Anteil in %"))
> ```
>
> Die meisten Befragten essen Fleisch ohne Einschränkung, wie
> @tbl-ernaehrung zeigt.
> ```
> ````
>
> `knitr::kable()` macht aus dem Data Frame eine gesetzte Tabelle, und
> `col.names` gibt den Spalten Namen für Lesende. Die 28 Personen ohne Angabe
> stehen als `NA` in der letzten Zeile.

## Teil 4: Verweise und Quellen

12. Schreib unter „Diskussion“ zwei Sätze darüber, für wen die Zahlen gelten.
    Verweise dabei auf den Abschnitt „Daten“, statt „oben“ zu schreiben. Die
    Befragten kommen aus einem Online-Panel mit Quoten für Alter, Geschlecht
    und Bundesland.

> [!SOLUTION]
> ```markdown
> Wie in @sec-daten beschrieben, stammen die Daten aus einer Online-Befragung
> mit Quoten für Alter, Geschlecht und Bundesland. Eine solche
> Quotenstichprobe ist keine Zufallsstichprobe, deshalb beschreiben die Zahlen
> die Menschen, die teilgenommen haben, und nicht ganz Deutschland.
> ```
>
> Im PDF steht „Kapitel 2“, und die Nummer stimmt auch dann noch, wenn du
> später einen Abschnitt davor einfügst.

13. Belege die Aussage über die Quotenstichprobe mit dem Lehrbuch von Döring
    (2023). Damit alles in einer Datei bleibt, steht die Quelle im Kopf statt
    in einer eigenen Datei `references.bib`. Kopiere den Block unten in den
    Kopf, ergänze unter `typst` die Zeile `citeproc: true`, setz
    `[@doering2023]` hinter „keine Zufallsstichprobe“ und schließ den Bericht
    mit einer Überschrift für die Literatur ab.

    ```yaml
    references:
      - id: doering2023
        type: book
        author:
          - family: Döring
            given: Nicola
        issued:
          year: 2023
        title: "Forschungsmethoden und Evaluation in den Sozial- und Humanwissenschaften"
        edition: 6
        publisher: Springer
        publisher-place: Berlin
        DOI: 10.1007/978-3-662-64762-2
    ```

> [!HINT]
> Auf den Folien steht die Literatur in `references.bib`, und Typst setzt die
> Zitate dann selbst. Eine Quelle im Kopf kennt Typst nicht; mit
> `citeproc: true` übernimmt Pandoc das Zitieren, und ohne die Zeile bricht
> das Rendern mit `label <doering2023> does not exist` ab. Die Literatur
> erscheint dann an der Stelle von `::: {#refs}`.

> [!SOLUTION]
> Im Kopf:
>
> ```yaml
> format:
>   typst:
>     papersize: a4
>     number-sections: true
>     citeproc: true
> ```
>
> Im Text und am Ende:
>
> ```markdown
> Eine solche Quotenstichprobe ist keine Zufallsstichprobe [@doering2023],
> deshalb beschreiben die Zahlen die Menschen, die teilgenommen haben, und
> nicht ganz Deutschland.
>
> ## Literatur {.unnumbered}
>
> ::: {#refs}
> :::
> ```
>
> Im PDF steht „(Döring 2023)“, und unter „Literatur“ der ganze Eintrag.
> `{.unnumbered}` hält die Literatur aus der Nummerierung heraus. Mit einer
> Seite zitierst du als `[@doering2023, S. …]`, mit der Seite, auf der du
> nachgelesen hast.

## Wenn du früher fertig bist

14. Bau absichtlich Fehler ein, rendere und lies, was Quarto meldet. Mach
    jeden Fehler danach wieder rückgängig.
    - Setz ein `#` vor `library(tidyverse)`.
    - Ändere die Marke `fig-alter` in `alter`, aber nicht den Verweis.
    - Rück im Kopf `papersize: a4` um zwei Leerzeichen weiter ein.

> [!SOLUTION]
> Ohne `library(tidyverse)` kennt R `read_csv()` nicht, und das Rendern
> bricht mit `could not find function "read_csv"` ab, auf einem deutsch
> eingestellten Rechner mit `konnte Funktion "read_csv" nicht finden`; die
> Zeile `Quitting from bericht.qmd:…` nennt die Zeilen des Blocks. Ohne
> `fig-` am Anfang ist der Block keine Abbildung, auf die man verweisen kann,
> und im PDF steht `?@fig-alter`, ohne dass etwas abbricht. Die falsche
> Einrückung meldet Quarto als `YAMLException: bad indentation of a mapping
> entry`, mit Zeile und Spalte in Klammern.

15. Ändere im Kopf `lang: de` in `lang: en` und rendere noch einmal. Was
    ändert sich, ohne dass du am Text etwas anfasst?

> [!SOLUTION]
> Aus „Abbildung“, „Tabelle“, „Kapitel“ und „Zusammenfassung“ werden
> „Figure“, „Table“, „Section“ und „Abstract“, und die Silbentrennung folgt
> den englischen Regeln. Die Wörter, die du selbst geschrieben hast, bleiben
> deutsch.

## Die ganze Datei

> [!SOLUTION]
> So sieht `bericht.qmd` am Ende aus. Gerendert ergibt sie zwei Seiten.
>
> ````markdown
> ---
> title: "Wer hat an der Umfrage teilgenommen?"
> author: "Dein Name"
> date: today
> lang: de
> abstract: |
>   Wir beschreiben, wer an der Umfrage zu Milch und Schokolade
>   teilgenommen hat: wie alt die Befragten sind und wie sie sich ernähren.
> format:
>   typst:
>     papersize: a4
>     number-sections: true
>     citeproc: true
> execute:
>   echo: false
> references:
>   - id: doering2023
>     type: book
>     author:
>       - family: Döring
>         given: Nicola
>     issued:
>       year: 2023
>     title: "Forschungsmethoden und Evaluation in den Sozial- und Humanwissenschaften"
>     edition: 6
>     publisher: Springer
>     publisher-place: Berlin
>     DOI: 10.1007/978-3-662-64762-2
> ---
>
> ```{r}
> #| label: setup
> #| message: false
> library(tidyverse)
>
> survey <- read_csv("mds12_schoko_milch.csv")
> ```
>
> ## Einleitung
>
> Jeder Bericht über eine Umfrage beginnt mit der Frage, **wer** geantwortet
> hat. Erst danach lässt sich sagen, für wen die Ergebnisse gelten. Wir
> beschreiben die Befragten der
> [Umfrage zu Milch und Schokolade](https://hands-on-computer-science.de/ds/de/items/milk-chocolate-survey/)
> nach Alter und *Ernährungsweise*.^[Die Umfrage hat Prof. Dr. Ulrich Enneking
> im November 2025 durchgeführt.]
>
> ## Daten {#sec-daten}
>
> An der Umfrage haben `{r} nrow(survey)` Personen teilgenommen. Wir
> verwenden drei Spalten:
>
> - `Q002alter`, das Alter in Jahren,
> - `Q004geschlechtf`, das Geschlecht, und
> - `V041nofleischf`, die Ernährungsweise.
>
> Anteile berechnen wir als
>
> $$
> p = \frac{k}{n},
> $$
>
> wobei $k$ die Zahl der Befragten mit einer Eigenschaft ist und $n$ die Zahl
> aller Befragten, die die Frage beantwortet haben.
>
> ## Ergebnisse
>
> ```{r}
> #| label: fig-alter
> #| fig-cap: "Alter der Befragten."
> #| fig-width: 6
> #| fig-height: 3.5
> survey |>
>   ggplot() +
>   aes(x = Q002alter) +
>   geom_histogram(binwidth = 5) +
>   labs(x = "Alter in Jahren", y = "Anzahl Befragte")
> ```
>
> @fig-alter zeigt, wie alt die Befragten sind. Die Hälfte ist jünger als
> `{r} median(survey$Q002alter)` Jahre, und
> `{r} round(mean(survey$Q004geschlechtf == "Frauen", na.rm = TRUE) * 100)`
> Prozent sind Frauen.
>
> ```{r}
> #| label: tbl-ernaehrung
> #| tbl-cap: "Befragte nach Ernährungsweise."
> survey |>
>   count(V041nofleischf, sort = TRUE) |>
>   mutate(anteil = round(n / sum(n) * 100, 1)) |>
>   knitr::kable(col.names = c("Ernährungsweise", "Anzahl", "Anteil in %"))
> ```
>
> Die meisten Befragten essen Fleisch ohne Einschränkung, wie
> @tbl-ernaehrung zeigt.
>
> ## Diskussion
>
> Wie in @sec-daten beschrieben, stammen die Daten aus einer Online-Befragung
> mit Quoten für Alter, Geschlecht und Bundesland. Eine solche
> Quotenstichprobe ist keine Zufallsstichprobe [@doering2023], deshalb
> beschreiben die Zahlen die Menschen, die teilgenommen haben, und nicht ganz
> Deutschland.
>
> ## Literatur {.unnumbered}
>
> ::: {#refs}
> :::
> ````

## Zum Nachschlagen

Alles aus dieser Übung steht ausführlicher in der Dokumentation von Quarto,
auf Englisch:

- [Guide](https://quarto.org/docs/guide/): der Einstieg in alle Themen
- [Front Matter](https://quarto.org/docs/authoring/front-matter.html): Titel,
  Autorinnen und Autoren, Datum und Abstract im Kopf
- [Markdown Basics](https://quarto.org/docs/authoring/markdown-basics.html):
  Überschriften, Hervorhebungen, Listen, Links, Fußnoten und Formeln
- [Execution Options](https://quarto.org/docs/computations/execution-options.html):
  `echo`, `message`, `warning` und die anderen Optionen eines Codeblocks
- [Inline Code](https://quarto.org/docs/computations/inline-code.html): Zahlen
  aus R im Text
- [Figures](https://quarto.org/docs/authoring/figures.html) und
  [Tables](https://quarto.org/docs/authoring/tables.html): Abbildungen und
  Tabellen mit Marke und Beschriftung
- [Cross References](https://quarto.org/docs/authoring/cross-references.html):
  Verweise auf Abschnitte, Abbildungen und Tabellen
- [Citations](https://quarto.org/docs/authoring/citations.html): Zitate und
  Literaturverzeichnis
- [Typst](https://quarto.org/docs/output-formats/typst.html): das Format, aus
  dem das PDF entsteht, mit allen Optionen unter `typst:`
