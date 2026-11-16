---
type: quiz
code: 8265
title: "Quiz: Stolperfallen bei der Datenvisualisierung"
summary: >-
  Acht Fragen zur proportionalen Tinte, zu abgeschnittenen und umgedrehten
  Achsen, zu Anzahlen und Anteilen, Blasen und Ausreißern, jede mit ihrer
  Begründung.
level: 1
duration: 10
topics: [visualising-data, data-pitfalls]
modules: [ea]
areas: [ds]
relations:
  checks: [misleading-charts]
questions: [hds-030, hds-031, hds-032, hds-033, hds-034, hds-035, hds-036, hds-037]
status: draft
updated: 2026-11-16
---

## Was besagt das Prinzip der proportionalen Tinte? {#hds-030}

- [x] Stellt eine Fläche oder Länge einen Wert dar, muss sie zu diesem Wert proportional sein.
  > Richtig: Ein doppelt so großer Wert bekommt doppelt so viel Tinte; daraus folgt etwa, dass Balken bei null beginnen und Blasen nach ihrer Fläche bemessen werden.
- [ ] Ein Diagramm soll so wenig Tinte wie möglich verbrauchen.
  > Sparsame Gestaltung ist eine andere Idee; die proportionale Tinte fragt nicht, wie viel Tinte ein Diagramm braucht, sondern ob die Tinte zum dargestellten Wert passt.
- [ ] Jede Gruppe in einem Diagramm bekommt eine eigene Farbe in gleicher Stärke.
  > Das Prinzip handelt von Flächen und Längen, die einen Wert tragen, nicht von der Wahl der Farben.
- [ ] Jede Achse eines Diagramms muss bei null beginnen.
  > Das gilt nur, wo eine Länge oder Fläche den Wert zeigt, wie bei Balken; Punkte und Linien zeigen ihren Wert über die Lage, und ihre Achse darf woanders beginnen.

> Wo eine Fläche oder Länge einen Wert zeigt, muss sie zu ihm proportional sein; das ist das Prinzip der proportionalen Tinte nach Bergstrom und West.

## Warum darf die y-Achse eines Liniendiagramms bei 34 % beginnen, die eines Balkendiagramms aber nicht? {#hds-031}

- [ ] Weil ggplot2 bei Linien die Null nicht zeichnen kann.
  > ggplot2 kann jede Achse bei null beginnen lassen; der Unterschied liegt darin, wie Linie und Balken ihren Wert zeigen.
- [ ] Weil Linien nur für Zeitreihen verwendet werden.
  > Linien zeigen oft Zeitreihen, aber das erklärt nicht, warum die Achse nicht bei null beginnen muss; entscheidend ist, dass keine Länge den Wert trägt.
- [x] Ein Balken zeigt seinen Wert über seine Länge, eine Linie über ihre Lage.
  > Richtig: Schneidet man die Achse unter Balken ab, passen die Längen nicht mehr zu den Werten; bei einer Linie liest man die Lage an der beschrifteten Achse ab, und keine Länge täuscht.
- [ ] Weil Prozentwerte nie bei null beginnen.
  > Prozentwerte können sehr wohl null sein; die Regel hängt an der Form des Diagramms, nicht an der Einheit.

> Balken tragen ihren Wert als Länge und beginnen deshalb bei null; Punkte und Linien tragen ihn als Lage, und ihre Achse darf woanders beginnen.

## 1.451 Personen trinken täglich Milch, 682 wöchentlich. In einem Blasendiagramm ist der Radius jeder Blase proportional zur Anzahl (`scale_radius()`). Wie viel größer wirkt die Blase für täglich? {#hds-032}

- [ ] Gut doppelt so groß, wie es den Zahlen entspricht
  > Doppelt so groß wäre die Fläche, wenn sie proportional zur Anzahl wäre, wie bei `scale_size_area()`; hier ist es der Radius.
- [x] Rund viereinhalbmal so groß, weil die Fläche mit dem Quadrat des Radius wächst
  > Richtig: Der Radius ist 1.451 / 682 ≈ 2,1-mal so groß, die Fläche also rund 2,1² ≈ 4,5-mal, und das Auge vergleicht die Flächen.
- [ ] Gleich groß, weil Blasen nur die Lage zeigen
  > Bei einem Blasendiagramm trägt gerade die Größe den Wert; die Lage zeigt hier nur die Kategorie.
- [ ] Achtmal so groß, weil Blasen als Kugeln gelesen werden
  > Die Blasen sind flache Kreise, und das Auge vergleicht ihre Fläche; mit dem Quadrat des Verhältnisses von rund 2,1 kommt man auf etwa 4,5.

> Wer den Radius nach dem Wert bemisst, quadriert den Eindruck; `scale_size_area()` macht die Fläche proportional zum Wert.

## Ein Balkendiagramm aus dem US-Fernsehen zeigte den Spitzensteuersatz von 35 % und 39,6 % auf einer Achse, die bei 34 % begann. Wie verhalten sich die sichtbaren Balkenlängen zueinander? {#hds-033}

- [ ] Der zweite Balken ist etwa 1,13-mal so lang wie der erste.
  > Das wäre das Verhältnis bei einer Achse ab null, 39,6 / 35; ab 34 % bleiben vom ersten Balken nur 1 und vom zweiten 5,6 Prozentpunkte sichtbar.
- [ ] Beide Balken sind gleich lang, weil ggplot2 die Achse anpasst.
  > Eine Achse ab 34 % macht die Werte nicht gleich; sie vergrößert den Unterschied sogar.
- [x] Der zweite Balken ist 5,6-mal so lang wie der erste.
  > Richtig: Sichtbar sind 39,6 − 34 = 5,6 gegen 35 − 34 = 1 Prozentpunkt; aus einem Unterschied von 13 % wird so fast das Sechsfache.
- [ ] Der zweite Balken ist 4,6-mal so lang wie der erste.
  > 4,6 ist der Unterschied in Prozentpunkten; die Längen über der Achse ab 34 % sind 1 und 5,6.

> Unter einer abgeschnittenen Achse zeigt ein Balken nur noch den Rest über dem Schnitt, und das Verhältnis der Längen hat mit dem der Werte nichts mehr zu tun.

## In einer Grafik zu den Morden mit Schusswaffen in Florida lief die y-Achse von oben nach unten, mit der Null oben (`scale_y_reverse()`). Nach 2005 fällt die Linie steil ab. Was ist nach 2005 tatsächlich geschehen? {#hds-034}

- [ ] Die Zahl der Morde mit Schusswaffen ging stark zurück.
  > So liest man das Bild, wenn man die umgedrehte Achse übersieht; weil die Null oben liegt, bedeutet eine Linie, die nach unten geht, mehr Morde.
- [ ] Die Zahl blieb gleich, nur die Skala wechselte.
  > Die Skala ist über die ganze Grafik dieselbe, nur umgedreht; die Linie bewegt sich, weil sich die Zahlen ändern.
- [ ] Das Gesetz von 2005 hat nachweislich zu mehr Morden geführt.
  > Die Grafik zeigt einen Anstieg nach 2005, aber keine Ursache; dafür bräuchte es einen Vergleich, etwa mit Staaten ohne ein solches Gesetz.
- [x] Die Zahl der Morde mit Schusswaffen stieg deutlich, von 521 auf 825 im Jahr 2007.
  > Richtig: Bei umgedrehter Achse heißt „nach unten“ „mehr“; mit der Null unten zeigt dieselbe Reihe einen steilen Anstieg.

> Eine umgedrehte Achse kehrt die Leserichtung um, ohne eine Zahl zu ändern; lies deshalb zuerst die Achsen, bevor du einer Linie glaubst.

## In der Umfrage kaufen 147 Allesesser und 20 Veganer im Bioladen ein. Insgesamt gibt es 1.826 Allesesser und 36 Veganer. Welches Diagramm beantwortet die Frage, welche Ernährungsweise am ehesten im Bioladen kauft? {#hds-035}

- [ ] Balken mit der Anzahl der Bioladen-Kunden je Ernährungsweise
  > Die Anzahlen zeigen vor allem, wie groß die Gruppen sind; dass die Allesesser vorn liegen, sagt nur, dass es viele von ihnen gibt.
- [ ] Ein Kreisdiagramm der Bioladen-Kunden nach Ernährungsweise
  > Auch der Kreis zeigt, wie sich die Kundschaft zusammensetzt, also wieder Anzahlen, und das in Winkeln, die schwerer zu vergleichen sind als Längen.
- [x] Balken mit dem Anteil der Bioladen-Kunden je Ernährungsweise, mit der Fallzahl in der Beschriftung
  > Richtig: 56 % der Veganer gegenüber 8 % der Allesesser beantworten die Frage nach dem „am ehesten“; die Fallzahl zeigt, dass hinter dem längsten Balken nur 36 Menschen stehen.
- [ ] Balken mit der Anzahl aller Befragten je Ernährungsweise
  > Dieses Diagramm sagt nichts über den Bioladen, sondern nur, wie viele Personen jede Ernährungsweise haben.

> Anzahlen zeigen die Größe der Gruppen, Anteile, wie verbreitet etwas in einer Gruppe ist; wer Anteile zeigt, nennt die Fallzahl dazu.

## Die mittlere Preisgrenze liegt bei 7,25 € für Weihenstephan und 9,07 € für Alpro, die Mediane bei 1,99 € und 2,00 €. Ein Balkendiagramm der Mittelwerte beginnt bei null. Warum täuscht es trotzdem? {#hds-036}

- [x] In den Mittelwerten stecken einzelne Antworten wie 344 € und 999 €, die das Bild bestimmen, ohne dass das Diagramm es sagt.
  > Richtig: Wenige extreme Antworten ziehen den Mittelwert nach oben, der Median bleibt bei rund 2 €; besser ist ein Median oder Boxplot, und was weggelassen wird, steht in `caption`.
- [ ] Weil Balken für Preise nie bei null beginnen dürfen.
  > Balken beginnen immer bei null, auch für Preise; die Täuschung steckt hier nicht in der Achse, sondern im Wert, den die Balken zeigen.
- [ ] Weil Alpro tatsächlich ein Viertel teurer ist und das Diagramm das untertreibt.
  > Die Mediane liegen nur einen Cent auseinander; der Abstand der Mittelwerte entsteht durch wenige extreme Antworten, nicht durch die Mehrheit der Befragten.
- [ ] Weil Mittelwerte nur als Kreisdiagramm gezeigt werden dürfen.
  > Ein Kreisdiagramm zeigt Anteile an einem Ganzen, keine Mittelwerte; das Problem ist der Ausreißer im Mittelwert, nicht die Form des Diagramms.

> Ein Mittelwert mit Ausreißern kann täuschen, auch wenn die Achse stimmt; Median oder Boxplot und ein Hinweis auf das Weggelassene zeigen ehrlicher.

## Der Code zeigt die Mediane der Preisgrenze, 1,99 € und 2,00 €, als Balken. Welche Änderung macht daraus ein ehrliches Diagramm? {#hds-037}

```r static
survey |>
  filter(!is.na(price_too_expensive)) |>
  group_by(milk_brand) |>
  summarise(median_price = median(price_too_expensive)) |>
  ggplot() +
  aes(x = milk_brand, y = median_price) +
  geom_col() +
  coord_cartesian(ylim = c(1.98, 2.01))
```

- [x] Die Zeile mit `coord_cartesian()` streichen, damit die Balken bei null beginnen
  > Richtig: Ohne die Grenzen 1,98 bis 2,01 beginnen die Balken bei null, und der Unterschied von einem Cent sieht so klein aus, wie er ist.
- [ ] `geom_col()` durch `geom_bar()` ersetzen
  > `geom_bar()` zählt Zeilen, statt die Mediane zu zeigen, und an der abgeschnittenen Achse ändert das nichts.
- [ ] Die Grenzen auf `ylim = c(1.99, 2.00)` verengen
  > Damit beginnt die Achse genau am kleineren Wert, und dessen Balken schrumpft fast auf nichts; der Unterschied wirkt noch größer.
- [ ] `median()` durch `mean()` ersetzen
  > Die Mittelwerte von 7,25 € und 9,07 € enthalten Ausreißer bis 999 € und reichten weit über die Grenzen hinaus; das löst die Täuschung nicht, sondern fügt eine zweite hinzu.

> `coord_cartesian(ylim = …)` unter Balken schneidet die Achse ab; ohne diese Zeile beginnen Balken in ggplot2 von selbst bei null.
