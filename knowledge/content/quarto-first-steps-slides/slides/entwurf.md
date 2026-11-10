# Entwurf: Input „first steps with quarto“

**Status:** Am 2026-11-10 mit allen Empfehlungen freigegeben und gebaut:
`first-steps-with-quarto.html`, 28 Folien und 47 Frames, Export ohne
Sprünge und ohne fremde Schriftgrößen. Das Beispiel-Paper liegt in
`example/` (`milk-prices.qmd`, `references.bib`; es braucht
`milk_survey_compact.csv` im selben Ordner), gerendert mit Quarto 1.10.3;
alle PDF-Ausschnitte auf den Folien stammen daraus und entstehen mit
`crops.py`. Abweichungen vom Entwurf:

- Folie 5: die drei Arten von Inhalt mit Klammern und Beschriftung statt
  farbig, weil drei Farben hier nichts bedeuten würden.
- Folie 6: die Dateien gleiten nicht, sondern die Pfeile zeichnen sich; das
  gerade arbeitende Programm und die Codeblöcke sind gelb, die eingesetzten
  Ergebnisse im `.md` grün, die noch fehlenden Dateien gestrichelte Plätze.
- Folie 8: Abstract ohne Zahl („We ask from which price on a litre of milk
  is too expensive for shoppers.“), damit keine Zahl von Hand im Paper steht;
  dazu `execute: echo: false` und `csl: apa` im Kopf und graue Erklärungen
  neben einzelnen Zeilen.
- Folie 9: Link und Fußnote auf zwei Zeilen; rechts das echte gerenderte
  Ergebnis.
- Folie 10 zeigt zusätzlich den Satz aus dem PDF („Section 2“); Folie 11 mit
  `\sum_{i=1}^{n} x_i`.
- Folie 13: „yes“/„no“ in Weiß und Grau statt Haken und Kreuzen, die Zeile
  `echo: false` blau.
- Folie 14: zusätzlich `filter(price_too_expensive <= 5)`, weil einzelne
  Antworten bis 999 Euro das Histogramm sonst zu einem Balken machen;
  Beschriftung „Price at which milk is too expensive.“
- Folie 15: `count(diet, sort = TRUE)`; Folie 17 mit den Sätzen des Papers.
- Folie 18: statt Döring (2023, S. 150) zitiert das Paper Wickham,
  Çetinkaya-Rundel und Grolemund (2023), *R for Data Science*, Kapitel 10,
  weil sich die Seite bei Döring nicht prüfen ließ; Ausgabe „(Wickham et al.,
  2023, chap. 10)“ in APA. Anordnung: `.bib` links, `.qmd` und PDF rechts.
- Folie 20: der Knopf als Schriftzug „preview“ ohne Symbol nachgezeichnet;
  daneben die beiden echten Seiten des PDFs.
- Folie 21: die Erkennungszeilen mit Quarto 1.10.3 und readr geprüft
  (`Validation of YAML front matter failed.`, `does not exist in current
  working directory`, `?@fig-threshold`).
- Zahlen: 2.809 Befragte und der Median 1,99 Euro (611 Antworten) stimmen;
  kein roter Kasten im Deck.

**Verortung:** neuer Folien-Inhalt `quarto-first-steps-slides` auf Hands-on
Data Science, eingebettet oben in die Lektion `quarto-first-steps` („Erste
Schritte mit Quarto“), im Kurs „Praxis der Markt- und Gesellschaftsforschung“
im ersten Abschnitt. Wiederkehrender Input von etwa 40 Minuten, also ohne
Datum und ohne Verweis auf andere Sitzungen oder Module; er taugt ebenso für
Abschlussarbeiten und jedes Modul, in dem mit R berichtet wird.

**Kernbotschaft:** `a quarto document holds text, code and results in one
source, so the paper always shows exactly what the analysis computes.`

**Publikum:** Bachelorstudierende im dritten Semester, die R mit dem
tidyverse und ggplot2 in Positron kennen und eine Ausarbeitung schreiben
müssen; Markdown und Quarto sind für die meisten neu.

**Sprache und Design:** Folien, Beispiele und Notizen englisch (Entscheidung
Nicolas vom 2026-11-10), `style.toml` von Hands-on Data Science wie das
EDA-Deck. Code in Codeschrift, das Neue einer Code-Folie blau, R-Pipes und
ggplot-Schichten je auf eigener Zeile, `ggplot()` leer und `aes()` als
eigene Schicht.

**Beispiel:** ein durchgehendes kleines Paper `milk-prices.qmd` an der
kompakten Milch-Umfrage (`milk_survey_compact.csv`): Titel, Abstract, eine
Abbildung (Verteilung der genannten Preisschwelle oder Bio-Anteil nach
Ernährungsweise), eine Tabelle mit Kennzahlen, ein Wert im Text per Inline-R,
ein Zitat. Jede Folie zeigt einen Ausschnitt daraus, und am Ende steht das
gerenderte PDF. Die Datei kommt als Download in die Lektion, damit jede und
jeder sie selbst rendern kann. Alle Zahlen rechne ich beim Bau mit R nach.

## Zu entscheiden

1. **Das Beispiel-Paper an der kompakten Umfrage (empfohlen)**, nicht an der
   Rohfassung: Es geht um Quarto, nicht um das Aufbereiten, und die
   kompakte Fassung hat lesbare Spaltennamen. Die Gruppen übertragen es dann
   auf ihre Daten im Kursordner.
2. **PDF über Typst, LaTeX nur als Fußnote (empfohlen).** Typst kommt mit
   Quarto mit, rendert schnell und scheitert nicht an Umlauten im Pfad; wer
   LaTeX kennt, sieht in einer Zeile, dass es auch geht.
3. **Zwei Live-Abfragen** (Folien 4 und 19) über den Classroom-Live-Server
   wie in den anderen HODS-Decks.
4. **Eine Animation** (Folie 6): der Weg von `.qmd` über die Ausführung des
   R-Codes zu Markdown und weiter über Typst zum PDF. Das ist in der Sache
   ein Ablauf, und wer ihn einmal gesehen hat, versteht die meisten
   Fehlermeldungen beim Rendern.

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
| 🗳️ | Live-Abfrage |
| 🎞️ | Animation |

# Die Folien

## Teil 0: Auftakt (2 Folien)

### Folie 1 🎬

**Titel:** `first steps with quarto`
**Untertitel:** `prof. dr. nicolas meseth`

Die Agenda füllt stagekit aus den Teilen `one source`, `writing`,
`code and results`, `the scholarly apparatus` und `rendering`.

### Folie 2 📷

**Bild:** ein Schreibtisch vor schwarzem Grund, darauf ein Laptop mit einer
Grafik auf dem Bildschirm und daneben ein ausgedruckter Bericht, in dem
dieselbe Grafik steht; zwischen beiden liegen eine Schere und ein
Klebestift, ein paar ausgeschnittene Grafiken liegen schief herum. Warmes
Licht von oben, Ränder im Schwarz.

**Text:** `every time the data change, someone copies the chart into the
report again, unless the report computes the chart itself.`

**Dazu sagen.** So entstehen die meisten Berichte: In R entsteht eine
Grafik, sie wird exportiert und in Word eingefügt, und eine Zahl wird von
Hand in den Text übertragen. Ändert sich ein Filter, stimmt der Bericht
nicht mehr, und niemand merkt es. Quarto dreht das um: Der Bericht enthält
den Code, und beim Rendern rechnet er sich selbst.

## Teil 1: one source (5 Folien)

### Folie 3 🖼️ 🪜

**Titel klein:** `copy and paste`
**Zeichnung:** links ein R-Skript, rechts ein Word-Dokument, dazwischen drei
Pfeile „export chart“, „copy table“, „type number“. Schritt 2: Im Skript
ändert sich eine Zeile (gelb), die drei Pfeile werden grau und gestrichelt,
und im Dokument stehen Grafik, Tabelle und Zahl mit gelbem Warnzeichen
(`verdict` „caution“): niemand weiß, ob sie noch stimmen.

**Dazu sagen.** Drei Wege, auf denen Ergebnisse ins Dokument kommen, und
jeder ist eine Handarbeit, die man beim nächsten Durchlauf wiederholen
müsste.

### Folie 4 🗳️

**Abfrage:** `what do you write longer texts in today?`
Antworten: `word`, `google docs`, `latex or typst`, `markdown`,
`something else` (Umfrage, keine richtige Antwort).

### Folie 5 🖼️ 🪜

**Titel klein:** `one source`
**Zeichnung:** ein einziges Dokument `milk-prices.qmd`, in dem drei Arten
von Inhalt farbig markiert sind: oben der Kopf (`---` … `---`) „metadata“,
dazwischen Text „markdown“, dazwischen Codeblöcke „R“. Schritt für Schritt
erscheinen die drei Beschriftungen.

**Dazu sagen.** Ein Quarto-Dokument ist eine Textdatei mit der Endung
`.qmd`. Sie besteht aus genau drei Dingen: einem Kopf mit Angaben zum
Dokument, Text in Markdown und R-Code in Blöcken. Mehr gibt es nicht zu
lernen; der Rest sind Einzelheiten dieser drei.

### Folie 6 🎞️

**Titel klein:** `what rendering does`
**Animation:** schrittweise, vier Abschnitte. Eine Kette aus Kästen
`milk-prices.qmd` → `knitr runs R` → `milk-prices.md` → `typst` →
`milk-prices.pdf`.
1. Das `.qmd` gleitet in `knitr runs R`; die Codeblöcke darin leuchten gelb.
2. Heraus kommt `.md`, in dem an der Stelle der Codeblöcke jetzt eine kleine
   Grafik und eine Tabelle stehen (Ergebnis grün).
3. Das `.md` gleitet in `typst`.
4. Heraus kommt das PDF mit Titel, Abbildung und Tabelle.
Danach zu sehen: die ganze Kette, darunter in Grau `quarto render
milk-prices.qmd` als der eine Befehl, der alles auslöst.

**Dazu sagen.** Beim Rendern führt Quarto erst den ganzen R-Code von oben
nach unten in einer frischen Sitzung aus, setzt die Ergebnisse ein und gibt
das Ganze an Typst, das daraus das PDF setzt. Daraus folgen zwei Regeln:
Das Dokument muss alles selbst laden, was es braucht, und ein Fehler im Code
hält das Rendern an.

### Folie 7 💬

**Satz:** `the document is the analysis, so a number in the text can only be
wrong if the code is wrong.`

## Teil 2: writing (4 Folien)

### Folie 8 ⌨️

**Titel klein:** `the header`
**Code:** der YAML-Kopf des Beispiels:
```yaml
---
title: "What is milk worth?"
author: "Group 4"
date: today
lang: en
abstract: |
  We use an online survey with 2,809 respondents ...
format:
  typst:
    papersize: a4
    number-sections: true
bibliography: references.bib
---
```
Hervorgehoben: `typst` und `papersize: a4` (ohne die Zeile wird das Papier
US-Letter, die Voreinstellung von Quarto).

**Dazu sagen.** Der Kopf steht zwischen zwei Zeilen mit drei Strichen und
ist YAML: Name, Doppelpunkt, Wert, Einrückung mit Leerzeichen. Hier steht
alles, was das Dokument als Ganzes betrifft, und das Format, in das es
gerendert wird. (`lang: de` setzt deutsche Silbentrennung und
Beschriftungen wie „Abbildung“; das sage ich dazu, auf der Folie bleibt das
Beispiel englisch.)

### Folie 9 📊

**Titel klein:** `markdown`
**Zwei Spalten:** links, was man tippt (`## Method`, `**important**`,
`*survey*`, `- one item`, `[link](https://quarto.org)`, `^[a footnote]`),
rechts, was im PDF steht.

**Dazu sagen.** Markdown ist Text mit ein paar Zeichen für die Form: Rauten
für Überschriften, Sterne für Betonung, Striche für Listen. Man schreibt
Inhalt, die Form kommt aus der Vorlage.

### Folie 10 ⌨️

**Titel klein:** `sections you can point to`
**Code:** `## Method {#sec-method}` und im Text `as described in
@sec-method`.

**Dazu sagen.** Eine Überschrift bekommt eine Marke, und auf die Marke
verweist man mit `@`. Quarto setzt daraus „Section 2“ und zählt richtig,
auch wenn sich die Gliederung ändert.

### Folie 11 🖼️

**Titel klein:** `math`
**Zeichnung:** links `$\bar{x} = \frac{1}{n} \sum x_i$` als getippter Text,
rechts die gesetzte Formel, wie sie im PDF erscheint (als Bild aus dem
gerenderten Beispiel, weil stagekit Brüche bewusst nicht setzt).

**Dazu sagen.** Formeln stehen zwischen Dollarzeichen, im Satz einfach, als
eigene Zeile doppelt. Die Schreibweise ist die von LaTeX, und jeder
KI-Assistent kann sie.

## Teil 3: code and results (5 Folien)

### Folie 12 ⌨️

**Titel klein:** `a code chunk`
**Code:**
````
```{r}
#| label: setup
#| message: false
library(tidyverse)

survey <- read_csv("milk_survey_compact.csv")
```
````
Hervorgehoben: die Zeilen mit `#|`.

**Dazu sagen.** Ein Codeblock beginnt mit drei Backticks und `{r}`. Die
Zeilen mit `#|` am Anfang sind Optionen für diesen Block; Quarto liest sie,
R ignoriert sie.

### Folie 13 📊

**Titel klein:** `chunk options`
**Tabelle:** `echo: false` (code not shown, result shown), `include: false`
(runs, nothing shown), `eval: false` (shown, not run), `warning: false`,
`message: false`. Spalte „code shown“, „runs“, „result shown“ mit Haken und
Kreuzen.

**Dazu sagen.** In einem Paper will man den Code meist nicht sehen, wohl
aber das Ergebnis. Das stellt man für das ganze Dokument im Kopf ein
(`execute: echo: false`) statt in jedem Block.

### Folie 14 ⌨️

**Titel klein:** `a figure`
**Code:**
````
```{r}
#| label: fig-threshold
#| fig-cap: "Price at which a litre of milk is too expensive."
survey |>
  ggplot() +
  aes(x = price_too_expensive) +
  geom_histogram(binwidth = 0.25)
```
````
Hervorgehoben: `fig-threshold` und `fig-cap`; rechts klein die Abbildung,
wie sie im PDF steht, mit „Figure 1: …“.

**Dazu sagen.** Eine Abbildung braucht zwei Dinge: eine Marke, die mit
`fig-` beginnt, und eine Beschriftung. Ohne `fig-` am Anfang ist es keine
Abbildung, auf die man verweisen kann.

### Folie 15 ⌨️

**Titel klein:** `a table`
**Code:** ein Block mit `#| label: tbl-diet` und `#| tbl-cap:`, darin
`survey |> count(diet) |> knitr::kable()` (über mehrere Zeilen nach der
Pipe-Regel); rechts die gesetzte Tabelle.

**Dazu sagen.** Dasselbe für Tabellen, mit `tbl-`. Ein Data Frame wird mit
`knitr::kable()` zur gesetzten Tabelle; für schönere gibt es Pakete wie `gt`
oder `tinytable`.

### Folie 16 ⌨️ 🪜

**Titel klein:** `numbers in the text`
**Code:** Text mit Inline-R:
`` The median threshold is `{r} median(survey$price_too_expensive, na.rm = TRUE)` euros. ``
Schritt 2: darunter, was im PDF steht: „The median threshold is 1.99
euros.“ (Zahl beim Bau nachrechnen.)

**Dazu sagen.** Das ist der Teil, der das Abtippen ersetzt: Eine Zahl im Satz
ist R-Code, und wenn sich die Daten ändern, ändert sich die Zahl mit. Jeden
Wert, der aus den Daten kommt, so schreiben.

## Teil 4: the scholarly apparatus (3 Folien)

### Folie 17 ⌨️ 🪜

**Titel klein:** `cross-references`
**Code:** `@fig-threshold shows that most respondents ...` und `see
@tbl-diet`. Schritt 2: das Ergebnis „Figure 1 shows …“, „see Table 1“.

**Dazu sagen.** Nie „die Abbildung unten“ schreiben, sondern auf die Marke
verweisen; Quarto nummeriert, und die Nummern stimmen auch nach dem
Umstellen.

### Folie 18 🖼️ 🪜

**Titel klein:** `citations`
**Zeichnung:** drei Kästen: `references.bib` mit einem BibTeX-Eintrag
`@book{doering2023, …}`, das `.qmd` mit `[@doering2023, p. 150]`, das PDF
mit „(Döring, 2023, S. 150)“ und unten dem Literaturverzeichnis. Schritt für
Schritt von links nach rechts.

**Dazu sagen.** Literatur steht in einer eigenen Datei im BibTeX-Format, die
jedes Literaturprogramm und Google Scholar ausgibt. Im Text zitiert man mit
`@` und dem Schlüssel; den Stil (etwa APA) bestimmt eine CSL-Datei im Kopf.

### Folie 19 🗳️

**Abfrage (Quiz):** `which label lets you write @fig-prices?`
Antworten: `label: prices`, `label: fig-prices` (richtig),
`label: figure-prices`, `fig-cap: prices`.

## Teil 5: rendering (3 Folien)

### Folie 20 🖼️

**Titel klein:** `render`
**Zeichnung:** der Preview-Knopf in Positron (nachgezeichnet, kein
Bildschirmfoto) und daneben die Zeile `quarto render milk-prices.qmd` im
Terminal, darunter das fertige PDF.

**Dazu sagen.** In Positron rendert der Knopf „Preview“ über dem Editor,
und das PDF erscheint im Viewer daneben; im Terminal rendert
`quarto render`. Positron bringt Quarto mit, und Quarto bringt Typst mit;
installieren muss man nur das R-Paket `rmarkdown` (geprüft in der Doku von
Quarto 1.11 und Positron am 2026-11-10).

### Folie 21 📊

**Titel klein:** `when rendering fails`
**Liste in Schritten:** die vier häufigsten Ursachen mit der Zeile, an der
man sie erkennt: ein Paket nicht geladen (`could not find function`), Datei
nicht gefunden (Pfad relativ zum Dokument), Einrückung im YAML falsch,
Marke ohne `fig-`/`tbl-` (`?@fig-…` im PDF). Dazu in Grau die zwei
stillen Fehler, die nicht abbrechen: fehlende Leerzeile vor einer Liste
(die Liste wird Fließtext) und fehlendes `papersize: a4`.

**Dazu sagen.** Das Dokument rendert in einer frischen Sitzung; was nur in
der Konsole geladen wurde, kennt es nicht.

### Folie 22 📷

**Bild:** derselbe Schreibtisch wie auf Folie 2, jetzt aufgeräumt: nur der
Laptop und daneben der gedruckte Bericht, Schere und Klebestift sind weg.

**Text:** `write the analysis once, render as often as you like, and every
number in the paper stays the one the data give.`

**Dazu sagen.** Ab jetzt entsteht die Ausarbeitung in Quarto, und jede
Änderung an den Daten ist ein Klick auf Rendern statt ein Nachmittag mit
Kopieren.
