---
type: quiz
code: 6245
title: "Quiz: Unsicherheit zeigen"
summary: >-
  Fünf Fragen zu Standardfehler, Fehlerbalken und dazu, was sich aus
  überlappenden Intervallen schließen lässt und was nicht, jede mit ihrer
  Begründung.
level: 1
duration: 6
topics: [visualising-data, data-pitfalls]
modules: [ea]
areas: [ds]
relations:
  checks: [showing-uncertainty]
questions: [hds-038, hds-039, hds-040, hds-041, hds-042]
status: published
updated: 2026-11-16
---

## Wovon hängt der Standardfehler eines Mittelwerts ab, den du mit `sd(x) / sqrt(n())` berechnest? {#hds-038}

- [ ] Nur von der Zahl der Werte.
  > Die Fallzahl steht im Nenner, aber im Zähler steht die Standardabweichung, sodass bei gleicher Fallzahl weit streuende Antworten einen größeren Standardfehler ergeben als ähnliche.
- [x] Von der Streuung der einzelnen Werte und von der Zahl der Werte.
  > Richtig: Er wächst mit der Standardabweichung und schrumpft mit der Wurzel der Fallzahl, sodass erst viermal so viele Werte ihn halbieren.
- [ ] Von der Höhe des Mittelwerts: Je größer der Mittelwert, desto größer der Standardfehler.
  > Der Mittelwert kommt in der Formel nicht vor; verschiebt man alle Antworten um eine Stufe, ändert sich der Mittelwert, der Standardfehler aber nicht.
- [ ] Nur von der Standardabweichung.
  > Die Standardabweichung wird durch die Wurzel der Fallzahl geteilt, und deshalb haben Veganer und Allesesser bei `prefers_organic` trotz fast gleicher Standardabweichung von 1,20 sehr verschiedene Standardfehler.

> Der Standardfehler ist die Standardabweichung geteilt durch die Wurzel der Fallzahl; er wächst mit der Streuung und schrumpft mit der Zahl der Antworten.

## Bei `prefers_organic` (−2 bis +2) haben Allesesser und Veganer fast dieselbe Standardabweichung von 1,20. Das Intervall Mittelwert ± 2 Standardfehler ist bei den Veganern aber 0,80 breit, bei den Allesessern nur 0,11. Woran liegt das? {#hds-039}

- [ ] Veganer sind sich untereinander weniger einig als Allesesser.
  > Dann wäre ihre Standardabweichung größer, sie ist aber in beiden Gruppen fast gleich, 1,20.
- [ ] Der Mittelwert der Veganer ist höher, und ein höherer Mittelwert hat ein breiteres Intervall.
  > Die Höhe des Mittelwerts geht in den Standardfehler nicht ein, nur Streuung und Fallzahl bestimmen ihn.
- [x] An der Fallzahl: 36 Veganer stehen 1.819 Allesessern gegenüber.
  > Richtig: Bei gleicher Streuung entscheidet die Fallzahl, und weil die Wurzel aus 1.819 / 36 etwa 7,1 ist, ist der Standardfehler der Veganer rund siebenmal so groß, 0,20 statt 0,028.
- [ ] Die Veganer wurden zufällig ausgewählt, die Allesesser nicht.
  > Die Ernährungsweise wurde nicht zugeteilt, sondern erfragt, und das gilt für alle Gruppen gleich; die Breite des Intervalls kommt aus der Fallzahl.

> Kleine Gruppen haben breite Intervalle, auch wenn ihre Antworten nicht stärker streuen, und deshalb gehört die Fallzahl ins Diagramm.

## In einem Diagramm mit `geom_pointrange()` steht der Punkt für Oatly bei 0,48, und die Linie reicht von 0,38 bis 0,59. Die Bildunterschrift lautet „Points: mean; lines: mean ± 2 standard errors“. Was zeigt die Linie? {#hds-040}

- [ ] Dass 95 % der Befragten Oatly zwischen 0,38 und 0,59 bewertet haben.
  > Die Linie beschreibt den Mittelwert und nicht die einzelnen Antworten, und tatsächlich liegt keine einzige Bewertung in diesem Bereich, weil die Skala nur ganze Stufen von −2 bis +2 kennt.
- [x] Wie genau der Mittelwert der Oatly-Bewertungen geschätzt ist, als ungefähres 95-%-Intervall für den Mittelwert.
  > Richtig: Die Linie reicht zwei Standardfehler unter und über den Mittelwert und beschreibt damit, wie stark er von Stichprobe zu Stichprobe schwanken würde.
- [ ] Die niedrigste und die höchste Bewertung von Oatly.
  > Die Bewertungen von Oatly reichen von −2 bis +2; die Linie ist viel kürzer, weil sie aus dem Standardfehler berechnet ist.
- [ ] Eine Standardabweichung unter und über dem Mittelwert.
  > Die Standardabweichung der Oatly-Bewertungen ist 0,96, sodass eine solche Linie fast zwei Stufen lang wäre; laut Bildunterschrift zeigt sie zwei Standardfehler von je etwa 0,05.

> Eine Linie aus Standardfehlern beschreibt die Genauigkeit des Mittelwerts und nicht die Streuung der Antworten, und was sie zeigt, steht in der Beschriftung.

## Was ergibt die Faustregel Mittelwert ± 2 Standardfehler ungefähr? {#hds-041}

- [ ] Den Bereich, in dem 95 % der einzelnen Antworten liegen.
  > Dafür bräuchte man die Standardabweichung statt des Standardfehlers; das Intervall aus Standardfehlern beschreibt den Mittelwert und ist viel schmaler als die Streuung der Antworten.
- [ ] Ein exaktes Testergebnis, ob sich zwei Gruppen unterscheiden.
  > Die Faustregel ist eine Näherung und kein Test; ob sich zwei Mittelwerte über den Zufall hinaus unterscheiden, beantwortet ein statistischer Test.
- [x] Ein ungefähres 95-%-Intervall für den Mittelwert.
  > Richtig: Als vereinfachte Faustregel, gestützt auf die Normalverteilung mit dem genauen Faktor 1,96, schließt ein so gebautes Intervall in etwa 95 von 100 Stichproben den Mittelwert der Gesamtheit ein.
- [ ] Ein ungefähres 68-%-Intervall für den Mittelwert.
  > Etwa 68 % gelten für ein Intervall von einem Standardfehler unter bis einem über dem Mittelwert; mit zwei Standardfehlern sind es etwa 95 %.

> Mittelwert ± 2 Standardfehler ist ein ungefähres 95-%-Intervall für den Mittelwert, eine vereinfachte Faustregel und kein Test.

## Im Markenexperiment reicht das Intervall Mittelwert ± 2 Standardfehler bei Bärenmarke von 0,89 bis 1,10 und bei Milchhof Müller regional von 0,74 bis 0,94. Was folgt aus der Überlappung? {#hds-042}

- [ ] Die beiden Marken werden unter allen Menschen, für die die Stichprobe steht, gleich gut bewertet.
  > Überlappung beweist keine Gleichheit, denn zwei Intervalle können sich überlappen, obwohl sich die Mittelwerte über den Zufall hinaus unterscheiden.
- [ ] Bärenmarke wird sicher besser bewertet, weil ihr Punkt höher liegt.
  > Der höhere Punkt gilt für diese Stichprobe; ob der Unterschied über den Zufall hinausgeht, zeigen weder Punkt noch Linie allein.
- [x] Allein daraus folgt nicht, dass beide Marken gleich bewertet werden; ob der Unterschied über den Zufall hinausgeht, beantwortet ein statistischer Test.
  > Richtig: Der Unterschied zweier Mittelwerte ist weniger unsicher, als die beiden Intervalle zusammen vermuten lassen, und ein Test stuft den Unterschied von 0,15 hier sogar als kaum zufällig ein.
- [ ] Das Experiment ist gescheitert, weil die Intervalle zu breit sind.
  > Intervalle zeigen ehrlich, wie genau die Mittelwerte geschätzt sind, und mit gut 300 Bewertungen je Marke sind diese sogar recht schmal.

> Überlappende Intervalle beweisen keine Gleichheit und getrennte ersetzen keinen Test; ob ein Unterschied über den Zufall hinausgeht, entscheidet ein statistischer Test.
