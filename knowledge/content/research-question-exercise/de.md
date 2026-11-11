---
type: exercise
code: 2417
title: "Übung: Die eigene Forschungsfrage schärfen"
summary: >-
  Vom Spezialthema der Gruppe über drei Ideen zu einer Forschungsfrage, die
  die Umfrage beantworten kann: sechs Angaben, vier Fallen und der
  Realitätstest am Codebuch mit dem Kursassistenten.
objectives:
  intro: "In dieser Übung macht ihr als Gruppe aus eurem Spezialthema eine Forschungsfrage für den Bericht, und könnt danach:"
  goals:
    - "zu einem Thema die passenden Fragen im Codebuch finden und sagen, wem sie gestellt wurden"
    - "aus einem Thema mehrere Ideen für Fragen ableiten und die tragfähigste auswählen"
    - "eine Idee über die sechs Angaben zu einer präzisen Frage schärfen und sie gegen die zwei Bedingungen und die vier Fallen prüfen"
    - "eure Frage mit dem Kursassistenten gegen das Codebuch halten und seine Antwort selbst nachprüfen"
    - "die gewählte Fassung mit ihren Spalten, Filtern und Fallzahlen festhalten und begründen, was ihr geändert habt"
level: 1
duration: 60
topics: [questions-and-measurement, ai-agents-as-tools]
modules: [pmg]
areas: [ds]
relations:
  requires: [research-questions]
  see_also: [opencode-course-assistant, milk-chocolate-survey]
status: draft
updated: 2026-11-11
---

Am Anfang steht bei jeder Gruppe ein Spezialthema, etwa Pflanzendrinks,
Bio-Lebensmittel oder Fleischkonsum, und ein Thema ist noch keine Frage. In
dieser Übung geht ihr den Weg aus der Lektion
[[research-questions|Was ist eine Forschungsfrage?]] einmal an eurem eigenen
Thema: vom Thema über mehrere Ideen zu einer Frage, die die
[[milk-chocolate-survey|Umfrage zu Milch und Schokolade]] beantworten kann.
Ihr arbeitet als Gruppe und mit dem
[[opencode-course-assistant|Kursassistenten]] in eurem Kursordner, der das
Codebuch kennt. Haltet eure Ergebnisse in einer gemeinsamen Notiz fest, denn
am Ende steht die Frage im Bericht.

## Teil 1: Vom Thema zu Ideen

1. Schreibt euer Spezialthema in einem Satz auf und lasst euch vom
   Kursassistenten zeigen, was die Umfrage dazu hergibt:

   ```text
   Unser Spezialthema ist <euer Thema>. Welche Fragen im Codebuch gehören
   dazu? Nenn für jede die Spalte, den Fragetext in Kurzform und wem die
   Frage gestellt wurde. Rechne nichts aus.
   ```

2. Formuliert aus dieser Liste drei Ideen für Fragen, und zwar möglichst
   verschiedener Art: eine beschreibende („wie viele, wie oft“), eine nach
   einem Zusammenhang („unterscheiden sich Gruppen“) und, falls euer Thema
   eines der Experimente der Umfrage berührt, eine kausale.

3. Wählt die Idee, die euch am meisten interessiert und zu der die Umfrage
   am meisten Spalten hat. Notiert in einem Satz, warum die Antwort etwas
   darüber sagt, wie Menschen einkaufen oder essen.

> [!HINT]
> Die meisten Fragen der Umfrage sind nicht allen gestellt worden. Eine Idee,
> deren wichtigste Spalte nur ein paar Dutzend Befragte beantwortet haben,
> trägt keinen Bericht, auch wenn sie spannend klingt. Kausale Fragen lassen
> sich in dieser Umfrage nur an den Experimenten beantworten, in denen der
> Zufall die Variante zugeteilt hat, etwa an den Preisstufen von Alpro
> Haferdrink.

## Teil 2: Eine Idee schärfen

4. Macht für eure Idee die sechs Angaben. Übernehmt dazu diese Tabelle in
   eure Notiz und füllt die rechte Spalte aus:

   | Angabe | eure Frage |
   |---|---|
   | wer | |
   | wo | |
   | wann | |
   | welche Variation | |
   | welches Ergebnis | |
   | welcher Vergleich | |

   Formuliert danach die Frage in einem Satz, in dem alle sechs Angaben
   stecken.

5. Prüft die Frage selbst gegen die zwei Bedingungen: Lässt sie sich mit
   Belegen beantworten, und würde ein unerwartetes Ergebnis eure Meinung
   ändern? Geht dann die vier Fallen durch (normativ, vage, kausal ohne
   Design, nicht in den Daten) und baut die Frage um, wo sie in eine davon
   tappt.

> [!HINT]
> So kann der Weg aussehen. Das Thema „Bio-Lebensmittel“ führt zur Idee
> „Was beeinflusst den Kauf von Bio?“, und die ist ein Forschungsprogramm,
> keine Frage für einen Bericht. Mit den sechs Angaben wird daraus: „Unterscheidet
> sich der Anteil ihrer Lebensmittel, den die Befragten in Bio-Qualität kaufen,
> zwischen Befragten in einer Großstadt und Befragten auf dem Dorf?“ Die Spalten
> dazu sind `v032bioanteil` und `D044stadtf`, und weil die Frage nach einem
> Zusammenhang fragt, dürft ihr am Ende von einem Unterschied sprechen, aber
> nicht davon, dass die Großstadt die Ursache ist.

## Teil 3: Der Realitätstest

6. Gebt eure Frage dem Kursassistenten mit dem Befehl `/research-question`
   und schreibt sie direkt dahinter:

   ```text
   /research-question <eure Frage>
   ```

   Er ordnet die Frage ein, prüft sie nach den Maßstäben der Lektion, sucht
   für jeden Teil die Spalte im Codebuch mit Filter und Fallzahl und urteilt:
   beantwortbar, anpassen oder verwerfen. Fehlt der Befehl in eurem
   Kursordner, holt ihn mit `/update-semester`, oder fügt den Auftrag aus der
   Übung der Lektion ein.

7. Prüft seine Antwort, bevor ihr etwas übernehmt: Schlagt jede genannte
   Spalte im Codebuch selbst nach, lest den Fragetext und vergleicht Filter
   und Fallzahl. Misst eine Spalte etwas anderes, als eure Frage braucht,
   passt die Frage an und nicht die Deutung der Spalte.

8. Hat der Assistent „anpassen“ oder „verwerfen“ geurteilt, entscheidet euch
   für eine seiner beiden geschärften Fassungen oder schreibt eine eigene,
   und wiederholt Schritt 6 mit ihr, bis das Urteil „beantwortbar“ lautet.

## Teil 4: Die Frage festhalten

9. Haltet in eurer Notiz fest:
   - die geschärfte Frage in einem Satz,
   - die Spalten, die sie beantworten, jeweils mit Filter und Fallzahl,
   - was ihr gegenüber der ersten Fassung geändert habt und warum.

10. Schreibt die Frage dorthin, wo der Bericht sie braucht: Gibt es euren
    Bericht schon, ans Ende der Einleitung in
    `my-code/paper/sections/_introduction.qmd`, sonst übernehmt ihr sie beim
    Anlegen in der Übung [[quarto-paper-exercise|Den eigenen Bericht mit
    Quarto anlegen]].

## Wie es weitergeht

Eure Frage darf sich noch ändern, sobald ihr mit der Auswertung beginnt,
denn manches zeigt sich erst in den Daten. Ändert sie sich, wiederholt den
Realitätstest und haltet fest, was ihr warum geändert habt; im Bericht steht
am Ende die Frage, die ihr tatsächlich beantwortet habt.
