---
type: quiz
code: 4198
title: "Quiz: Befragungsdaten zeigen"
summary: >-
  Sechs Fragen dazu, wie du Itembatterien, Ratingskalen, Ja-Nein-Fragen und
  Gruppen unterschiedlicher Größe zeigst und solche Diagramme liest, jede mit
  ihrer Begründung.
level: 1
duration: 7
topics: [visualising-data]
modules: [ea]
areas: [ds]
relations:
  checks: [survey-charts]
questions: [hds-024, hds-025, hds-026, hds-027, hds-028, hds-029]
status: published
updated: 2026-11-16
---

## Warum sortierst du die vier Items einer Itembatterie im gestapelten Balkendiagramm nach ihrem Anteil der Zustimmung? {#hds-024}

- [ ] Weil ggplot2 gestapelte Balken nur zeichnen kann, wenn die Items als sortierter Faktor vorliegen.
  > Ohne Sortierung zeichnet ggplot2 die Balken genauso, nur in alphabetischer Reihenfolge der Spaltennamen; das Sortieren ist eine Entscheidung für die Lesenden, keine Bedingung von ggplot2.
- [x] Damit sich die Items als Rangfolge lesen lassen und niemand die Grenzen der Farbflächen über weit auseinanderliegende Balken hinweg vergleichen muss.
  > Richtig: Sortiert steht die Liebe zum Fleisch mit 59 % Zustimmung oben und die Vorliebe für Bio mit 38 % unten, und Items mit ähnlicher Zustimmung wie Umweltbewusstsein (53 %) und Kochen (51 %) stehen nebeneinander, wo man sie direkt vergleicht.
- [ ] Damit die Antwortstufen in jedem Balken von „strongly disagree“ bis „strongly agree“ in der richtigen Reihenfolge stehen.
  > Die Reihenfolge der Antwortstufen legt der Faktor mit `levels` fest, und sie folgt immer der Skala; das Sortieren der Items ändert daran nichts, es verschiebt nur ganze Balken.
- [ ] Weil die Anteile in den Balken erst nach dem Sortieren richtig berechnet werden.
  > Jeder Balken zeigt vor und nach dem Sortieren dieselben Anteile; das Sortieren ändert nur, an welcher Stelle er steht.

> Die Items einer Itembatterie sortierst du nach Zustimmung, damit eine Rangfolge entsteht, während die Antwortstufen in jedem Balken die Reihenfolge der Skala behalten.

## Was zeigen divergierende Balken einer Ratingskala auf einen Blick, das gestapelte Balken auf 100 % schlechter zeigen? {#hds-025}

- [ ] Den Mittelwert jedes Items auf der Skala von −2 bis +2.
  > Divergierende Balken zeigen keinen Mittelwert, sondern die Anteile der einzelnen Antwortstufen, links die Ablehnung und rechts die Zustimmung.
- [ ] Wie viele Personen jedes Item beantwortet haben.
  > Die Balken zeigen Anteile, keine Anzahlen; wie viele geantwortet haben, hier zwischen 2.798 und 2.804 je Item, müsste in der Beschriftung stehen.
- [ ] Den Anteil der neutralen Antworten, genauer als jede andere Darstellung.
  > Die neutrale Mitte passt auf keine der beiden Seiten; sie wird weggelassen und in der Bildunterschrift genannt oder zur Hälfte auf beide Seiten verteilt, und beides macht sie schwerer ablesbar, nicht leichter.
- [x] Wie sich Zustimmung und Ablehnung je Item zueinander verhalten, weil beide Seiten von einer gemeinsamen Nulllinie in der Mitte ausgehen.
  > Richtig: Bei der Vorliebe für Bio sieht man sofort, dass 33 % Ablehnung fast so viel sind wie 38 % Zustimmung, während im gestapelten Balken nur die beiden äußersten Stufen an einer gemeinsamen Linie beginnen.

> Divergierende Balken stapeln Ablehnung nach links und Zustimmung nach rechts einer gemeinsamen Nulllinie, sodass sich beide Seiten direkt vergleichen lassen; was mit den neutralen Antworten geschieht, muss im Diagramm stehen.

## Von den 2.809 Befragten kaufen 2.064 gewöhnlich beim Discounter und 358 im Bioladen ein. Warum zeigt ein Diagramm besser 73 % und 13 % statt dieser Anzahlen? {#hds-026}

- [ ] Anteile sind genauer als Anzahlen, weil sie Nachkommastellen haben.
  > Ein Anteil wird aus der Anzahl berechnet und enthält keine Information, die nicht schon in ihr und der Gesamtzahl steckt; genauer ist er nicht, nur leichter zu verstehen.
- [ ] Bei Anteilen braucht man die Fallzahl nicht mehr anzugeben.
  > Umgekehrt, gerade weil ein Anteil die Fallzahl verbirgt, schreibst du sie in die Beschriftung, etwa „shops_organic (n = 2809)“.
- [x] Ein Anteil sagt sofort, welcher Teil der Befragten gemeint ist, und bleibt vergleichbar, auch wenn Fragen von unterschiedlich vielen beantwortet wurden; eine Anzahl versteht nur, wer die Gesamtzahl kennt.
  > Richtig: 2.064 sagt für sich wenig, 73 % heißt, dass fast drei von vier Befragten beim Discounter einkaufen. Die Fallzahl, hier 2.809 für beide Fragen, gehört trotzdem in die Beschriftung.
- [ ] Mit Anzahlen müsste man die beiden Fragen zu einem Balken auf 100 % stapeln.
  > Das wäre in beiden Fällen falsch: 228 Personen kaufen an beiden Orten ein und 615 an keinem, die Anteile ergeben zusammen 86 % und kein Ganzes, und deshalb stehen die Fragen in getrennten Balken.

> Mehrere Ja-Nein-Fragen zeigst du als Anteile, weil sie ohne Gesamtzahl verständlich und untereinander vergleichbar sind, und die Fallzahl schreibst du dazu.

## Im Diagramm bevorzugen 72 % der Veganer (n = 36) und 30 % der Allesesser (n = 1.819) beim Einkauf Bio. Warum gehört die Fallzahl in die Beschriftung? {#hds-027}

- [x] Weil ein Anteil aus 36 Antworten viel stärker vom Zufall abhängt als einer aus 1.819, und das sieht man den Balken selbst nicht an.
  > Richtig: Bei 36 Personen verschiebt eine einzige den Anteil um fast 3 Prozentpunkte, bei 1.819 Personen um 0,05. Beide Balken sehen gleich solide aus, und erst die Fallzahl zeigt, wie verlässlich sie sind.
- [ ] Weil ggplot2 die Balken sonst nicht nach dem Anteil sortieren kann.
  > Sortiert wird mit `fct_reorder(group, share)`, und das klappt mit und ohne Fallzahl im Namen; die Fallzahl steht für die Menschen da, die das Diagramm lesen.
- [ ] Weil der Balken der Veganer sonst länger aussähe, als er ist.
  > Die Länge stimmt, der Balken zeigt die 72 % richtig; was ohne Fallzahl fehlt, ist die Auskunft, auf wie vielen Antworten diese 72 % beruhen.
- [ ] Weil Gruppen mit weniger als 100 Personen nicht ins Diagramm gehören und die Fallzahl zeigt, welche das sind.
  > Kleine Gruppen wegzulassen würde Information verstecken; du zeigst sie und sagst mit der Fallzahl, wie viel Gewicht ihr Anteil tragen kann.

> Wer Anteile von Gruppen sehr unterschiedlicher Größe vergleicht, schreibt die Fallzahl in die Beschriftung, denn ein Anteil aus wenigen Antworten kann sich durch wenige Personen stark verschieben.

## Die Tabelle `survey` hat 2.809 Zeilen, eine je befragter Person. Wie sieht die Tabelle nach diesem Code aus? {#hds-028}

```r static
survey |>
  select(id, eco_conscious, prefers_organic, loves_meat, loves_cooking) |>
  pivot_longer(-id, names_to = "item", values_to = "value")
```

- [ ] 2.809 Zeilen mit den Spalten `id`, `item` und `value`
  > Die Spalten stimmen, die Zeilenzahl nicht, denn jede Person hat vier Items beantwortet und steht deshalb viermal in der Tabelle.
- [x] 11.236 Zeilen mit den Spalten `id`, `item` und `value`, eine Zeile je Person und Item
  > Richtig: `pivot_longer()` stellt die vier Items untereinander, 2.809 × 4 = 11.236 Zeilen; der Spaltenname kommt in `item`, die Antwort in `value`, und `id` bleibt stehen, weil `-id` sie vom Umstellen ausnimmt.
- [ ] 4 Zeilen, eine je Item, mit dem Mittelwert der Antworten
  > `pivot_longer()` fasst nichts zusammen, sondern stellt nur um; einen Mittelwert je Item ergäbe erst ein anschließendes `summarise()`.
- [ ] 11.236 Zeilen mit den Spalten `id`, `eco_conscious`, `prefers_organic`, `loves_meat` und `loves_cooking`
  > Die vier Spalten der Items gibt es danach nicht mehr; ihre Namen stehen jetzt als Werte in der Spalte `item`.

> `pivot_longer()` macht aus mehreren Spalten mit derselben Skala zwei Spalten, eine für den Namen und eine für den Wert, sodass ggplot2 je Item einen Balken zeichnen kann.

## Im divergierenden Diagramm der vier Items reicht der Balken von `prefers_organic` links bis etwa 33 % und rechts bis etwa 38 %; die neutralen Antworten sind nicht gezeigt. Was liest du daraus ab? {#hds-029}

- [ ] 33 % lehnen die Aussage völlig ab, haben also −2 angekreuzt.
  > Die linke Seite fasst beide Stufen der Ablehnung zusammen, 13,6 % mit −2 und 19,0 % mit −1; wie viel davon auf −2 entfällt, zeigt erst die dunklere Farbe außen.
- [ ] Weil der rechte Teil länger ist als der linke, hat `prefers_organic` die höchste Zustimmung der vier Items.
  > Mit 38 % hat `prefers_organic` die niedrigste Zustimmung, die anderen drei Items liegen zwischen 51 und 59 %, und deshalb steht es im nach Zustimmung sortierten Diagramm ganz unten.
- [ ] 71 % stimmen der Aussage zu, denn beide Seiten zusammen zeigen die Zustimmung.
  > Die linke Seite steht für Ablehnung, nicht für Zustimmung; beide Seiten zusammen zeigen nur, wie viele überhaupt Stellung bezogen haben, gut 70 %.
- [x] Etwa ein Drittel lehnt die Aussage ab, etwas mehr stimmen zu, und die übrigen rund 30 % haben neutral geantwortet.
  > Richtig: 32,7 % Ablehnung, 37,7 % Zustimmung und 29,6 % neutral ergeben zusammen 100 %; die Meinungen zur Vorliebe für Bio sind also fast gleich verteilt.

> In divergierenden Balken liest du links die Ablehnung und rechts die Zustimmung ab, jeweils beide Stufen zusammen, und was zu 100 % fehlt, sind die neutralen Antworten.
