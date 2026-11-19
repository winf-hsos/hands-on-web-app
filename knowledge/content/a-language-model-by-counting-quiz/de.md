---
title: "Quiz: Wortverteilungen"
summary: >-
  Zehn Fragen zum Experiment über Wortverteilungen, jede Antwort mit ihrer
  Begründung. Die Fragen stammen aus dem Pool des Moduls und haben das Format
  seiner Klausur.
translation_of: en
based_on: 2026-11-19
---

## Warum bekommt im Experiment jeder Satz ein Anfangs-Token `<s>` und ein End-Token `</s>`? {#wd-001}

- [x] Damit das Modell lernt, wie Sätze beginnen und wann sie aufhören.
  > Richtig: Ohne `</s>` könnte das Modell nie ein Satzende ziehen und würde endlos weiterschreiben.
- [ ] Damit der Korpus größer wird und die Wahrscheinlichkeiten genauer werden.
  > Die beiden Tokens zählen nicht zur Korpusgröße; sie fügen keine Information über Wörter hinzu.
- [ ] Damit R die Sätze in der Tabelle auseinanderhalten kann.
  > Dafür gibt es die Spalte sentence_id; die beiden Tokens sind für das Modell da.
- [ ] Damit Satzzeichen wie der Punkt nicht als eigene Wörter gezählt werden.
  > Der Korpus hat keine Satzzeichen; die Tokens markieren Anfang und Ende, nicht Zeichen.

## Im Korpus folgt auf „eats“ zweimal „grass“ und einmal „grain“, auf nichts anderes. Wie groß ist P(grass | eats)? {#wd-002}

- [ ] 2/104, denn der Korpus hat 104 Wörter.
  > Bei einer bedingten Wahrscheinlichkeit teilt man durch die Zahl der Paare, die mit „eats“ beginnen, nicht durch den ganzen Korpus.
- [ ] 1/2, denn es gibt zwei verschiedene Wörter nach „eats“.
  > Gezählt werden die Vorkommen, nicht die verschiedenen Wörter: grass kommt doppelt so oft wie grain.
- [ ] 2, denn „eats grass“ kommt zweimal vor.
  > Das ist die Zählung, keine Wahrscheinlichkeit; eine Wahrscheinlichkeit liegt zwischen 0 und 1.
- [x] 2/3, also count(eats, grass) geteilt durch count(eats).
  > Richtig: Im Beutel „eats“ liegen zwei Karten grass und eine Karte grain.

## Ein Modell ohne Kontext zieht jedes Wort nur nach seiner Häufigkeit im Korpus. Was schreibt es? {#wd-003}

- [ ] Sätze aus dem Korpus, Wort für Wort abgeschrieben.
  > Ohne Kontext weiß das Modell nicht, welches Wort auf welches folgt, also kann es keinen Satz abschreiben.
- [x] Die Wörter im richtigen Verhältnis, aber ungeordnet und ohne Ende.
  > Richtig: etwa „the is the cow in the hen the“, und ohne Kontext gibt es auch kein Satzende vorherzusagen.
- [ ] Neue, flüssige Sätze, die aber manchmal falsch sind.
  > Flüssige Sätze braucht mindestens ein Wort Kontext; ohne ihn passen die Wörter nicht zueinander.
- [ ] Nur das häufigste Wort, also „the the the“.
  > Das schriebe es nur, wenn es immer das wahrscheinlichste Wort nähme; es zieht aber zufällig.

## Warum nimmt ein Sprachmodell beim Schreiben nicht immer das wahrscheinlichste nächste Wort, sondern zieht es zufällig nach seiner Wahrscheinlichkeit? {#wd-004}

- [ ] Weil es das wahrscheinlichste Wort nicht ausrechnen kann.
  > Das Modell hat alle Wahrscheinlichkeiten; das wahrscheinlichste Wort zu finden wäre leicht.
- [ ] Weil das Ziehen die Antworten wahrer macht.
  > Ziehen macht Texte abwechslungsreicher, nicht wahrer; auch gezogene Sätze können falsch sein.
- [x] Sonst schriebe es jedes Mal denselben Text und liefe leicht im Kreis.
  > Richtig: Bei Temperatur 0 nimmt das Modell immer das häufigste Wort und wiederholt sich, etwa „the cow sleeps in the cow sleeps …“.
- [ ] Weil das Ziehen weniger Rechenzeit braucht als das Suchen des Maximums.
  > Der Aufwand ist vernachlässigbar; der Grund ist der Text, der dabei entsteht.

## Im Beutel „the“ hat „cow“ die Wahrscheinlichkeit 0,16 und „barn“ 0,03. Was passiert bei einer Temperatur von 0,5? {#wd-005}

- [ ] Alle Wörter werden gleich wahrscheinlich.
  > Flacher wird die Verteilung bei einer Temperatur über 1, ganz gleich wäre sie erst bei einer sehr hohen.
- [ ] Die seltenen Wörter gewinnen, der Text wird abwechslungsreicher.
  > Das geschieht bei einer Temperatur über 1, etwa bei 2.
- [ ] Alle Wahrscheinlichkeiten werden halbiert.
  > Danach muss die Summe wieder 1 sein; jede Wahrscheinlichkeit wird mit 1/T potenziert und neu normiert.
- [x] Die häufigen Wörter gewinnen, die seltenen verlieren.
  > Richtig: cow steigt auf etwa 0,26, barn fällt auf etwa 0,01; unter 1 wird die Verteilung spitzer und der Text vorhersehbarer.

## Das Modell mit einem Wort Kontext schreibt „the milk is green“. Jedes Wortpaar darin kommt im Korpus vor. Was zeigt das? {#wd-006}

- [x] Das Modell kennt nur, welche Wörter aufeinander folgen, und prüft keine Tatsachen.
  > Richtig: So entstehen flüssige, falsche Sätze, bei echten Modellen Halluzinationen genannt.
- [ ] Im Korpus steht ein Fehler, den das Modell übernommen hat.
  > Im Korpus stehen „the milk is white“ und „the grass is green“, beide richtig; erst die Kombination ist falsch.
- [ ] Die Temperatur war zu niedrig eingestellt.
  > Auch bei niedriger Temperatur kann so ein Satz entstehen; die Ursache ist, dass das Modell nur Nachbarschaften kennt.
- [ ] Das Modell hat den Satz wörtlich aus dem Korpus kopiert.
  > Der Satz steht nicht im Korpus; er ist neu zusammengesetzt.

## Mit einem Wort Kontext steht etwa einer von sechs geschriebenen Sätzen wörtlich im Korpus, mit zwei Wörtern etwa zwei von drei. Was folgt daraus? {#wd-007}

- [ ] Mit mehr Kontext schreibt das Modell mehr neue Sätze.
  > Es ist umgekehrt: Mit mehr Kontext haben die meisten Wortpaare nur eine Fortsetzung, und das Modell schreibt ab.
- [x] Mehr Kontext macht das Modell sicherer und richtiger, und zugleich kopiert es mehr aus seinen Trainingsdaten.
  > Richtig: Ein echtes Dilemma, denn ein Modell kann so Texte wiedergeben, die geschützt oder privat sind.
- [ ] Zwei Wörter Kontext sind immer schlechter als eines.
  > Zwei Wörter verhindern viele falsche Sätze; der Preis ist, dass das Modell mehr abschreibt.
- [ ] Die Anteile hängen nur vom Zufall ab und ändern sich bei jedem Durchlauf stark.
  > Über viele geschriebene Sätze gemessen sind die Anteile stabil; sie folgen aus den Zählungen.

## Im Korpus folgt auf „milks the“ nur „cow“, also ist P(sheep | milks the) = 0. Was bedeutet diese Null? {#wd-008}

- [ ] Dass man Schafe nicht melken kann.
  > Schafe werden gemolken; die Null sagt nichts über die Welt.
- [ ] Dass das Wort sheep nicht im Vokabular steht.
  > sheep steht im Vokabular, es folgt nur nie auf „milks the“.
- [ ] Dass das Modell die Wahrscheinlichkeit falsch gerechnet hat.
  > Die Rechnung stimmt: 0 von 1 Fortsetzungen; das Problem ist der kleine Korpus.
- [x] Dass diese Fortsetzung im Korpus nie gezählt wurde.
  > Richtig: Null heißt nur „nie gezählt“, und was das Modell nicht gezählt hat, kann es nicht schreiben.

## Die Tabelle aller gezählten Wortpaare hat 34 × 34 = 1.156 Zellen, gefüllt sind 72. Warum kann eine solche Tabelle nicht zu einem echten Sprachmodell heranwachsen? {#wd-009}

- [x] Mit jedem Wort Kontext wächst die Tabelle um den Faktor der Vokabulargröße, und fast alle Zellen bleiben leer.
  > Richtig: Bei 100.000 Tokens sind es 10¹⁰ und 10¹⁵ Zellen, wie viel Text man auch zählt; deshalb lernen echte Modelle in einem neuronalen Netz, welche Tokens einander ähneln.
- [ ] Weil Computer nicht genug Speicher für 1.156 Zellen haben.
  > 1.156 Zellen sind winzig; das Problem beginnt bei echten Vokabularen und längerem Kontext.
- [ ] Weil Wahrscheinlichkeiten in einer Tabelle nicht für Sprache taugen.
  > Für einen winzigen Korpus taugen sie, wie das Experiment zeigt; sie wachsen nur nicht mit.
- [ ] Weil echte Sprachmodelle gar keine Wahrscheinlichkeiten für das nächste Token berechnen.
  > Sie berechnen genau diese Wahrscheinlichkeiten, nur auf andere Weise als durch Zählen.

## Was haben die Beutel mit Wortkarten aus dem Experiment und ein großes Sprachmodell gemeinsam, und worin unterscheiden sie sich? {#wd-010}

- [ ] Beide speichern eine Tabelle mit allen Wortpaaren; das Sprachmodell hat nur eine größere.
  > Eine solche Tabelle bliebe fast leer; ein Sprachmodell speichert gelernte Zahlen, keine Zählungen.
- [ ] Sie haben nichts gemeinsam: Das Sprachmodell versteht Sprache, die Beutel zählen nur.
  > Beide beantworten dieselbe Frage nach dem nächsten Token und schreiben Wort für Wort.
- [x] Beide liefern P(next | context) und ziehen daraus; das Sprachmodell rechnet aber mit einem neuronalen Netz statt durch Zählen.
  > Richtig: Die Frage und das Schreiben sind dieselben, das Wie ist völlig anders.
- [ ] Beide nehmen immer das wahrscheinlichste Wort; das Sprachmodell kennt nur mehr Wörter.
  > Beide ziehen zufällig nach der Wahrscheinlichkeit, mit einer Temperatur als Einstellung.
