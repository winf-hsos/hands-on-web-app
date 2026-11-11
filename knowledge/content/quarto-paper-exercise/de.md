---
type: exercise
code: 5352
title: "Übung: Den eigenen Bericht mit Quarto anlegen"
summary: >-
  Der Kursassistent legt mit /paper die Vorlage für euren Bericht an; ihr
  rendert sie, findet euch in Kopf und Abschnitten zurecht und macht sie mit
  eurer Frage, einer Zahl aus R, einem Zitat und einer ersten eigenen
  Abbildung zu eurer.
objectives:
  intro: "In dieser Übung legt ihr den Bericht an, in dem ihr bis zur Abgabe schreibt, und könnt danach:"
  goals:
    - "mit dem Kursassistenten die Vorlage des Berichts anlegen und als PDF rendern"
    - "sagen, was in paper.qmd steht und was in den Dateien unter sections/"
    - "eine Zahl aus R in den Text setzen und eine Quelle aus references.bib zitieren"
    - "eine eigene Abbildung mit Marke und Beschriftung einbauen und im Text auf sie verweisen"
    - "einen Fehler beim Rendern lesen und mit dem Assistenten beheben"
level: 1
duration: 60
topics: [communicating-results, reproducible-work, ai-agents-as-tools]
modules: [pmg]
areas: [ds]
relations:
  requires: [quarto-first-steps]
  see_also: [paper-structure, opencode-course-assistant, research-question-exercise]
status: published
updated: 2026-11-11
---

Euer Bericht entsteht mit Quarto aus einer Quelle, in der Text, R-Code,
Abbildungen und Literatur zusammenliegen, und ihr müsst ihn nicht von Hand
anlegen: Der [[opencode-course-assistant|Kursassistent]] in eurem Kursordner
kopiert mit dem Befehl `/paper` eine Vorlage, trägt Titel, Thema, Frage und
Namen ein und rendert sie einmal als PDF. In dieser Übung legt ihr die
Vorlage an und macht sie Schritt für Schritt zu eurem Bericht. Was die
einzelnen Bausteine bedeuten, steht in der Lektion
[[quarto-first-steps|Erste Schritte mit Quarto]], und was in welchen
Abschnitt gehört, in [[paper-structure|Aufbau eines wissenschaftlichen
Papers]].

Eine Person der Gruppe legt den Bericht an. Die anderen bekommen danach den
Ordner `my-code/paper/` als Kopie in ihren eigenen Kursordner, und weil jeder
Abschnitt eine eigene Datei ist, kommt ihr euch beim Schreiben kaum in die
Quere. Die Daten gibt niemand weiter, jede Person hat sie aus ILIAS.

## Teil 1: Die Vorlage anlegen

1. Holt den neuesten Stand des Kursordners, damit der Befehl `/paper` da
   ist:

   ```text
   /update-semester
   ```

2. Startet die Vorlage:

   ```text
   /paper
   ```

   Der Assistent fragt nach Arbeitstitel, Spezialthema, Forschungsfrage und
   Autorinnen und Autoren. Alles darf vorläufig sein; nehmt für die Frage
   die Fassung, die ihr in der Übung
   [[research-question-exercise|Die eigene Forschungsfrage schärfen]]
   erarbeitet habt, oder die, die ihr gerade habt.

3. Wenn der Assistent `FERTIG` meldet, öffnet das PDF und blättert es
   durch: Deckblatt, Abstract, Inhaltsverzeichnis, die Abschnitte mit ihren
   Beispielen und die Literatur.

> [!HINT]
> Meldet der Assistent einen Fehler, lasst ihn die letzten Zeilen erklären.
> Am häufigsten fehlt die Datei `data/mds12_schoko_milch.csv`; sie kommt aus
> ILIAS in den Ordner `data/` eures Kursordners. Auf dem Mac kann beim
> ersten Rendern XQuartz fehlen, und auch dabei hilft der Assistent.

## Teil 2: Sich in der Vorlage zurechtfinden

4. Öffnet in Positron den Ordner `my-code/paper/` und verschafft euch einen
   Überblick:

   ```text
   my-code/paper/
     paper.qmd          das zentrale Dokument: Kopf, Daten laden, Abschnitte einfügen
     references.bib     die Literatur
     sections/
       _introduction.qmd
       _methods.qmd
       _results.qmd
       _discussion.qmd
       _conclusion.qmd
       _ai-use.qmd      Angaben zur KI-Nutzung, gehört zur Abgabe
   ```

5. Öffnet `paper.qmd` und rendert es selbst mit **Preview**. Gerendert wird
   immer nur `paper.qmd`, auch wenn ihr gerade in einem Abschnitt schreibt;
   die Abschnitte fügt es mit `{{< include … >}}` ein.

6. Öffnet die Abschnitte nacheinander und lest die Kommentare zwischen
   `<!--` und `-->`: Sie sagen, was in den Abschnitt gehört, und erscheinen
   nicht im PDF.

## Teil 3: Die Vorlage zu eurer machen

7. Schreibt in `sections/_introduction.qmd` über eure Frage zwei oder drei
   Sätze, warum das Thema wichtig ist, und zitiert dabei Döring mit
   Seitenzahl, etwa `[@doering2023, S. 150]`. Prüft, ob die Forschungsfrage
   am Ende der Einleitung steht.

8. Ergänzt in `sections/_methods.qmd` unter „Daten“, dass ihr eine
   vorhandene Umfrage auswertet, also eine Sekundäranalyse macht, und wer sie
   erhoben hat. Die Zahl der Befragten steht dort schon als Inline-R,
   `` `r nrow(survey)` ``; schreibt nach diesem Muster eine zweite Zahl in den
   Text, etwa wie viele Befragte eine Frage beantwortet haben, die ihr
   braucht.

9. Ersetzt in `sections/_results.qmd` die Beispielabbildung durch eine
   erste eigene zu einer Spalte eurer Frage: Kopiert den Block, gebt ihm eine
   neue Marke, die mit `fig-` beginnt, eine Beschriftung in `fig-cap` und
   eure Spalten, und verweist im Satz darüber mit `@fig-…` auf sie.

10. Rendert noch einmal und prüft im PDF: Die Abbildung hat eine Nummer, der
    Verweis im Text nennt dieselbe, die Zahl aus R steht im Satz, und Döring
    erscheint unter „Literatur“.

> [!HINT]
> So sieht ein Block für eine Abbildung aus, hier mit der Größe des
> Wohnorts; setzt eure eigene Spalte ein:
>
> ````markdown
> ```{r}
> #| label: fig-city-size
> #| fig-cap: "Befragte nach Größe des Wohnorts"
> #| fig-width: 6
> #| fig-height: 3.5
> survey |>
>   ggplot() +
>   aes(x = D044stadtf) +
>   geom_bar() +
>   labs(x = "Wohnort", y = "Anzahl Befragte")
> ```
> ````
>
> Im Text darüber steht dann etwa: „@fig-city-size zeigt, wie sich die
> Befragten auf die Größe ihres Wohnorts verteilen.“ Eine Abbildung ist an
> dieser Stelle noch keine Antwort auf eure Frage; es geht darum, dass der
> Weg vom Code bis ins PDF steht.

## Teil 4: Eine erste Rückmeldung

11. Bittet den Assistenten um eine Rückmeldung zum Aufbau, sobald in einem
    Abschnitt eigener Text steht, etwa zur Einleitung:

    ```text
    /paper-feedback Einleitung
    ```

    Er zeigt, was im Abschnitt trägt und was in einen anderen gehört, und
    schreibt nichts um, solange ihr ihn nicht darum bittet.

12. Tragt in `sections/_ai-use.qmd` ein, wofür ihr den Assistenten in dieser
    Übung genutzt habt: Vorlage anlegen, Fehler beim Rendern, Rückmeldung zum
    Aufbau.

## Wie es weitergeht

Ab jetzt wächst der Bericht mit eurer Auswertung: Jede Abbildung und
Tabelle, die eure Frage beantwortet, kommt mit Marke und Beschriftung in die
Ergebnisse, und jede Zahl im Text kommt aus R, damit sie stimmt, wenn sich an
der Aufbereitung etwas ändert. Die Beispiele aus der Vorlage löscht ihr,
sobald eigene da sind. Rendert oft, denn ein Fehler ist schnell gefunden,
solange seit dem letzten Rendern wenig dazugekommen ist.
