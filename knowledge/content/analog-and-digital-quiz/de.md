---
title: "Quiz: Analog und digital"
summary: >-
  Fünfzehn Fragen dazu, was etwas digital macht, warum mehr Stufen die Grenzen
  näher rücken lassen, was Digitalisieren kostet und was es einbringt. Jede
  Antwort kommt mit ihrer Begründung.
translation_of: en
based_on: 2026-11-04
---

## Was bedeutet es, wenn eine Größe „analog“ ist? {#ad-001}

- [x] Sie ändert sich stufenlos: Zwischen zwei Werten liegen immer noch weitere.
  > Genau: Stufenlos heißt, es gibt keine kleinste Stufe. Die Helligkeit von Licht ist so eine Größe, und ein Lichtsensor blickt genau auf so eine Welt.
- [ ] Sie stammt aus einem Gerät, das ohne Rechner und Programm auskommt, etwa aus einem Verstärker oder einem Plattenspieler.
  > Ob ein Rechner beteiligt ist, entscheidet nichts. Ein Verstärker arbeitet ohne Programm und trotzdem stufenlos, und ein Computer kann umgekehrt stufenlose Größen messen. Es geht allein um die Frage, ob die Größe stufenlos ist oder endlich viele Zustände hat.
- [ ] Sie gehört zu einer älteren, mechanischen Technik, so wie bei der analogen Fotografie oder der Schallplatte.
  > Das ist die Alltagsbedeutung, nicht der Fachbegriff. Fachlich geht es nur um die Frage, ob die Größe stufenlos ist oder endlich viele Zustände hat.
- [ ] Sie lässt sich nur ungefähr bestimmen: Ihr Wert ist nie exakt, sondern immer nur eine Schätzung.
  > Eine analoge Größe kann beliebig genau sein, sie hat sogar unendlich viele Zwischenwerte. Das Problem ist nicht ihre Genauigkeit, sondern dass ein Computer sie so nicht fassen kann.

> Analog heißt stufenlos, mit einem weiteren Wert zwischen je zwei Werten; Alter, Mechanik und das Fehlen eines Rechners spielen dafür keine Rolle.

## Was zeichnet ein digitales System aus? {#ad-002}

- [ ] Es arbeitet elektronisch: Seine Zustände werden durch Strom oder Spannung dargestellt.
  > Strom ist nur der übliche Träger, nicht das Merkmal. Digital geht auch mit Lichtblitzen, Flaggen oder Zetteln, und eine Fallblattanzeige ist digital, ohne einen einzigen Chip.
- [x] Es kennt nur endlich viele, klar voneinander getrennte Zustände.
  > Genau das ist die Definition. Alles Weitere über digital folgt aus den zwei Wörtern „endlich“ und „getrennt“.
- [ ] Es ist automatisch genauer als ein analoges System.
  > Im Gegenteil: Beim Übergang ins Digitale wird Genauigkeit bewusst weggeworfen. Was digital besser wird, ist nicht die Genauigkeit, sondern die Zuverlässigkeit.
- [ ] Es speichert Informationen als Zeichen und Text, sodass ein Mensch sie im Prinzip lesen könnte.
  > Gespeichert werden Zustände, meistens als Folgen von zwei Zuständen. Ob sie Text, Bild oder Ton bedeuten, ist eine Frage der Codierung, und die ist ein eigener Schritt.

> Digital heißt endlich viele Zustände ohne gültige Zwischenwerte, egal, was sie trägt.

## Ein Signal trägt dreimal dasselbe Rauschen, nur die Zahl der Bereiche, in die es geteilt wird, wächst von zwei über vier auf acht. Warum werden die Messwerte trotzdem unsicherer, je mehr Bereiche es gibt? {#ad-003}

- [ ] Weil das Rauschen mit jeder zusätzlichen Grenze zunimmt: Jede Grenze bringt ihre eigenen Störungen ins Signal.
  > Nein, das Rauschen ist in allen drei Fällen identisch. Was sich ändert, steht auf der anderen Seite des Vergleichs.
- [x] Weil der Abstand zwischen den Bereichen schrumpft, bis dieselbe Störung in den Nachbarbereich reicht.
  > Genau: Nicht das Rauschen wächst, der Sicherheitsabstand schrumpft. Der Abstand zwischen den Bereichen ist die Reserve gegen Störungen, und sie verteilt sich auf immer mehr Grenzen.
- [ ] Weil der Sensor bei feinen Stufen ungenauer misst: Kleine Unterschiede zwischen Nachbarbereichen kann er nicht mehr sauber auflösen.
  > Der Sensor weiß nichts von den Bereichen, er liefert einfach Werte. Die Bereiche zieht erst danach das Programm ein.
- [ ] Weil mehr Bereiche mehr Rechenzeit kosten und dabei Messwerte verloren gehen.
  > Ein Vergleich mit sieben Grenzen statt einer ist für den Rechner kein messbarer Unterschied. Das Problem ist geometrisch, nicht rechnerisch.

> Nicht das Rauschen wächst, sondern der Abstand schrumpft, weil derselbe Bereich in mehr und schmalere Bereiche geschnitten wird.

## Beim Digitalisieren wird ein stufenloser Wertebereich in endlich viele Bereiche geteilt. Welche Aussagen treffen zu? {#ad-004}

- [x] Alle Werte innerhalb desselben Bereichs gelten danach als ein und derselbe Zustand.
  > Genau das ist der Kern: Die Unterschiede innerhalb eines Bereichs werden bewusst aufgegeben, damit die Unterschiede zwischen den Bereichen zählen.
- [ ] Mit genügend vielen Stufen verschwindet der Unterschied zur analogen Größe vollständig.
  > Er wird kleiner, aber er verschwindet nie: Endlich viele Stufen bleiben endlich viele. Und feinere Stufen erkaufst du dir mit einem schrumpfenden Abstand gegen Rauschen.
- [ ] Beim Digitalisieren wird das Signal von Störungen befreit, weil danach nur noch der Bereich zählt und nicht mehr der genaue Wert.
  > Das Digitalisieren selbst reinigt nichts; eine Störung, die groß genug ist, landet im Bereich nebenan. Robust wird es erst, wenn die Bereiche weiter auseinanderliegen als die Störung.
- [x] Aus der digitalen Fassung lässt sich der ursprüngliche exakte Wert nicht zurückgewinnen.
  > Richtig: Welcher der unendlich vielen Werte im Bereich es war, ist nach der Zuordnung nicht mehr feststellbar. Digitalisieren ist eine Einbahnstraße.
- [ ] Digitalisieren funktioniert nur bei Signalen wie Licht und Ton, die sich als Welle beschreiben lassen.
  > Es funktioniert bei allem, was sich messen lässt: Temperatur, Druck, Tastenwege, Mausbewegungen. Überall gelten dieselben zwei Schritte: messen, dann einem Bereich zuordnen.

> Innerhalb eines Bereichs ist jeder Unterschied endgültig aufgegeben, und genau das macht die Unterschiede zwischen den Bereichen zuverlässig.

## Digitale Technik wirft beim Digitalisieren Information weg und ist trotzdem zuverlässiger als analoge. Warum? {#ad-005}

- [x] Weil die wenigen Zustände weit auseinanderliegen: Eine kleine Störung ändert den Zustand nicht und ist beim nächsten Ablesen spurlos verschwunden.
  > Genau: Die weggeworfene Genauigkeit ist der Preis, der gekaufte Abstand ist die Reserve. Solange die Störung kleiner bleibt als der Abstand, wird sie bei jedem Ablesen vollständig getilgt.
- [ ] Weil digitale Bauteile nicht rauschen: Sie schalten nur zwischen an und aus, und dabei entsteht keine Störung.
  > Auch digitale Schaltungen rauschen, die Physik macht keine Ausnahme. Der Unterschied ist, dass Rauschen unterhalb des Abstands zwischen den Zuständen folgenlos bleibt.
- [ ] Weil weniger Information übertragen wird und dadurch weniger Fehler passieren können.
  > Klingt plausibel, ist aber nicht der Mechanismus. Ein leises analoges Signal trägt auch wenig Information und ist trotzdem störanfällig. Entscheidend ist der Abstand zwischen den Zuständen, nicht die Menge.
- [ ] Weil Computer Fehler automatisch erkennen und herausrechnen, sobald ein Wert nicht zu den umliegenden passt.
  > Fehlererkennung gibt es, aber sie ist eine eigene, zusätzliche Zutat, die mit Redundanz und Prüfsummen arbeitet. Die Grundrobustheit kommt schon vorher aus dem Abstand zwischen den Zuständen.

> Digital ist zuverlässig, weil es Genauigkeit wegwirft: Störungen, die kleiner sind als der Abstand zwischen den Zuständen, verschwinden bei jedem Ablesen.

## Ein Programm liest einen Helligkeitswert von einem Sensor und vergleicht ihn danach mit einer Schwelle. Was leistet der Vergleich `value > 250` im Sinn des Digitalisierens? {#ad-007}

```python static
value = sensor.read()

if value > 250:
    symbol = "bright"
else:
    symbol = "dark"
```

- [ ] Er wandelt das analoge Licht in einen digitalen Wert um, denn erst nach dem Vergleich liegt ein echter digitaler Zustand vor.
  > Das ist schon passiert: `sensor.read()` hat den Wert geliefert, und die Wandlung steckt im Sensor. Von hier an wird nur noch mit Zahlen gearbeitet.
- [ ] Er misst die Helligkeit ein zweites Mal, zur Kontrolle, damit ein Ausreißer der ersten Messung nicht durchrutscht.
  > Ein Vergleich misst nichts, er entscheidet nur über einen Wert, der schon da ist. Gemessen wird ausschließlich in der Zeile darüber.
- [x] Er zieht die Grenze, die viele mögliche Zahlenwerte auf zwei bedeutungstragende Zustände reduziert: Hier entsteht ein Alphabet.
  > Genau: Der Sensor liefert Hunderte möglicher Werte, und erst die Grenze macht daraus Symbole. Wo sie liegt und wie viele Grenzen es gibt, ist eine Entwurfsentscheidung.
- [ ] Er erhöht die Genauigkeit des Messwerts, weil aus einem schwankenden Zahlenwert ein eindeutiges Ergebnis wird.
  > Das Gegenteil: Aus vielen unterscheidbaren Werten werden zwei. Genau dieses bewusste Vergröbern kauft die Robustheit.

> Der Sensor macht aus dem Licht Zahlen; die Schwelle ist die Entscheidung, die aus Zahlen Symbole macht.

## Eine Musikkassette verliert bei jedem Überspielen hörbar Qualität, eine kopierte Datei ist auch nach der tausendsten Kopie identisch. Warum? {#ad-008}

- [ ] Weil Dateien komprimiert gespeichert sind und beim Kopieren deshalb weniger Daten kaputtgehen können.
  > Kompression ist ein anderes Thema, und sie macht Daten eher empfindlicher gegen Fehler, nicht robuster. Auch eine unkomprimierte Datei kopiert sich perfekt.
- [x] Beim digitalen Kopieren werden Zustände abgelesen und frisch gesetzt; kleine Störungen unterhalb des Abstands zwischen den Zuständen verschwinden dabei jedes Mal vollständig.
  > Genau: Jede digitale Kopie ist eine Neugeburt aus sauberen Zuständen. Die Kassette kopiert dagegen die stufenlose Wellenform mitsamt allem Rauschen und legt eigenes obendrauf, bei jeder Generation.
- [ ] Weil Computer viel schneller kopieren als ein Kassettendeck, bleibt kaum Zeit, in der sich Störungen einschleichen können.
  > Die Geschwindigkeit spielt dabei keine Rolle. Eine langsame digitale Kopie ist genauso perfekt wie eine schnelle.
- [ ] Weil Dateien beim Kopieren nicht neu geschrieben, sondern nur verknüpft werden; eine zweite Fassung entsteht also gar nicht.
  > Verknüpfungen gibt es, aber eine echte Kopie ist eine echte zweite Folge von Zuständen, und die ist trotzdem identisch. Genau das ist die Pointe.

> Einen Zustand ablesen und frisch setzen tilgt jede Störung, die kleiner ist als der Abstand zwischen den Zuständen, deshalb altern digitale Kopien nicht.

## Was heißt es, ein Signal zu „digitalisieren“? {#ad-009}

- [x] Es durch eine endliche Folge von Zahlen darstellen.
  > Genau. Mehr steckt nicht im Wort: messen und die Messwerte endlich vielen Zuständen zuordnen. Was die Zahlen bedeuten, regelt danach die Codierung.
- [ ] Es in eine Form bringen, die sich über das Internet übertragen lässt.
  > Übertragung ist ein eigener Schritt und setzt die Zahlenform meist schon voraus. Digitalisieren passiert davor, am Übergang von der Welt zur Zahl.
- [ ] Es verkleinern, damit es weniger Speicher braucht.
  > Das ist Kompression, ein anderes Thema. Digitalisieren kann die Datenmenge sogar riesig machen, man denke an unkomprimiertes Video.
- [ ] Es mit einem elektronischen Gerät aufnehmen statt mit einem mechanischen.
  > Auch ein Kassettenrekorder ist elektronisch und zeichnet trotzdem analog auf, mit der Spannung als stufenloser Magnetisierung. Digital wird ein Signal erst, wenn es in endlich viele Zahlen übersetzt ist.

> Digitalisieren heißt nichts weiter, als ein Signal durch eine endliche Folge von Zahlen darzustellen.

## Eine Strecke überträgt Daten mit Licht: Ein Programm stellt die Helligkeit einer LED mit Zahlen von 0 bis 255 ein, und ein Farbsensor am anderen Ende macht aus dem Licht wieder Zahlen. Wo verläuft die Grenze zwischen analog und digital? {#ad-010}

- [ ] Schon am Sender: Weil die LED mit Zahlen von 0 bis 255 angesteuert wird, ist auch ihr Licht digital.
  > Die Ansteuerung ist digital, das Licht selbst nicht: Seine Helligkeit ist stufenlos, sie hängt von Abstand und Winkel ab, und das Umgebungslicht addiert sich dazu. Zwischen den beiden Geräten ist die Strecke analog.
- [ ] Erst im Programm auf der Empfangsseite, wenn es den Messwert mit einer Schwelle vergleicht.
  > Da ist der Wert längst eine Zahl. Der Vergleich reduziert viele Zahlen auf wenige Symbole, das ist wichtig, aber digital war es schon vorher.
- [x] Im Farbsensor: Er setzt das stufenlose Licht in Zahlen um, und ab dort rechnet alles mit Zahlen.
  > Genau. Die ganze Strecke läuft digital, analog, digital: Der Sender macht aus Zahlen Licht, das Licht fliegt stufenlos und gestört durch den Raum, und der Sensor macht daraus wieder Zahlen. Das analoge Mittelstück ist der Teil, den kein Programm kontrolliert, und genau dort entscheidet sich, wie zuverlässig die Strecke ist.
- [ ] Nirgends: Die ganze Strecke ist digital, weil an beiden Enden Computer stehen.
  > Die Computer an den Enden ändern nichts daran, dass dazwischen Physik liegt. Wer das analoge Mittelstück vergisst, wundert sich später über jede Störung.

> Digital, analog, digital: Die Grenzen liegen an der LED und im Sensor, und die Mitte gehört der Physik.

## Welche dieser Dinge arbeiten im Sinn dieses Konzepts digital, also mit endlich vielen, klar getrennten Zuständen? {#ad-011}

- [ ] Ein stufenloser Lichtdimmer
  > Stufenlos ist das Gegenteil von digital: Zwischen zwei Helligkeiten liegt immer noch eine dritte.
- [x] Ein Lichtschalter mit an und aus
  > Zwei Zustände, und was dazwischen liegt, zählt nicht: Das ist digital in Reinform, ganz ohne Computer. Halb gedrückt ist kein gültiger Zustand, der Schalter schnappt in einen von beiden.
- [ ] Ein Zeigerthermometer
  > Der Zeiger wandert stufenlos, jede Zwischenstellung ist möglich und gültig. Erst wer ihn an einer Skala mit Bereichen abliest, digitalisiert.
- [x] Ein Würfel
  > Sechs Zustände, und dazwischen gibt es nichts Gültiges: Ein Würfel auf der Kante kippt in eine Lage. Genau dieses Einrasten in getrennte Zustände macht digital aus.
- [ ] Eine Sanduhr
  > Der Sandstand sinkt stufenlos. Über die einzelnen Körner lässt sich streiten, aber abgelesen wird der stufenlose Füllstand.

> Was in einen von endlich vielen Zuständen einrastet, ist digital, mit oder ohne Chip.

## Du entwirfst ein Alphabet aus Farben für eine Strecke, die Daten mit Licht überträgt, und legst fest, wie viele Farben es hat. Was ist der Kern dieser Entscheidung? {#ad-012}

- [x] Ein Tauschgeschäft: Mehr Farben tragen mehr je Messung, rücken die Bereiche aber enger zusammen, und wie viele sicher sind, entscheiden Messungen.
  > Genau: Es gibt keine allgemein richtige Zahl, nur die richtige Zahl für einen bestimmten Aufbau, sein Licht und sein Rauschen. Deshalb gewinnt das bestvermessene Alphabet, nicht das mutigste.
- [ ] Mehr Farben lohnen sich, weil jede Messung dann mehr Bits trägt und die Übertragung entsprechend schneller wird.
  > Nur solange jede Messung noch stimmt. Ab einer gewissen Enge kosten die Erkennungsfehler mehr Zeit, als das größere Alphabet einspart.
- [ ] Zwei Farben sind die sichere Wahl, weil der größte Abstand die wenigsten Fehler bringt und ein Fehler mehr kostet als etwas Tempo.
  > Wer bei großem Abstand trotzdem nur zwei Farben nutzt, verschenkt Tempo. Auch Vorsicht hat einen Preis, und ob er gerechtfertigt ist, zeigt nur die Messung.
- [ ] Die Zahl ist Geschmackssache, solange sauber kalibriert wird: Die Kalibrierung legt die Grenzen dorthin, wo sie sicher liegen.
  > Kalibrieren verschiebt die Grenzen an die richtigen Stellen, aber es vergrößert nicht den Abstand zwischen ihnen. Gegen zu enge Bereiche hilft keine noch so gute Kalibrierung.

> Die Größe eines Alphabets ist eine Abwägung zwischen Tempo und Abstand, und das Wackeln der Messwerte entscheidet sie.

## Beim Digitalisieren eines Fotos entstehen aus dem stufenlosen Bild 64 × 64 Bildpunkte mit je 256 Helligkeitsstufen. Welcher der beiden Schritte ist das Abtasten? {#ad-013}

- [ ] Das Runden jeder Helligkeit auf eine der 256 vereinbarten Stufen.
  > Das ist der zweite Schnitt, das Quantisieren: Es zerlegt den Wert. Das Abtasten zerlegt die Achse, hier also die Bildfläche.
- [ ] Das Umrechnen der fertigen Stufenwerte in Binärzahlen.
  > Die Binärdarstellung kommt erst nach beiden Schnitten; sie ändert nichts mehr daran, wie viele Punkte und Stufen es gibt.
- [x] Das Zerlegen der stufenlosen Bildfläche in die 64 × 64 Messpunkte.
  > Genau: Das Abtasten zerlegt die Achse, Fläche oder Zeit, in endlich viele Messpunkte, und wie fein, das ist die Auflösung. Das Quantisieren zerlegt danach den gemessenen Wert in Stufen.
- [ ] Das Speichern der Bildpunkte in einer Datei mit Kopfdaten.
  > Das Speichern verpackt nur, was Abtasten und Quantisieren vorher erzeugt haben. Die beiden Schnitte sind da längst passiert.

> Das Abtasten schneidet die Achse in Punkte, das Quantisieren den Wert in Stufen.

## Ein Graustufenbild wird mit 100 × 100 Bildpunkten und 8 Bit je Bildpunkt digitalisiert. Wie groß ist die entstehende Datei? {#ad-014}

- [ ] 80.000 Byte, denn 100 · 100 · 8 ergibt 80.000.
  > Die Rechnung stimmt, aber ihr Ergebnis sind Bit, nicht Byte. Erst die Division durch 8 macht daraus die Dateigröße in Byte.
- [x] 10.000 Byte, denn 100 · 100 · 8 = 80.000 Bit, und 8 Bit sind ein Byte.
  > Genau: Punkte mal Bits je Punkt ergibt die Größe in Bit, geteilt durch 8 die Größe in Byte. Diese eine Rechnung trägt jede Abschätzung einer Dateigröße.
- [ ] 30.000 Byte, denn jeder Bildpunkt braucht drei Farbkanäle zu je einem Byte.
  > Die drei Kanäle gehören zu Farbbildern mit 24 Bit je Punkt. Hier sind Graustufen mit 8 Bit vereinbart, also ein Byte je Punkt.
- [ ] 1.250 Byte, denn die 100 · 100 Bit werden noch durch 8 geteilt.
  > Hier ist die Farbtiefe verloren gegangen: 100 · 100 zählt nur die Punkte, jeder Punkt trägt aber 8 Bit, nicht eines.

> Punkte mal Bits je Punkt ergibt Bit, und acht Bit sind ein Byte.

## Ein digitalisiertes Foto zeigt deutlich erkennbare Klötzchen, die Farben innerhalb der Klötzchen wirken aber natürlich und fein abgestuft. Welcher Schritt der Digitalisierung war zu grob? {#ad-015}

- [x] Das Abtasten: zu wenige Bildpunkte für die Fläche.
  > Genau: Klötzchen sind sichtbare Abtastpunkte. Die Farbtiefe war dagegen offenbar ausreichend, sonst wären Streifen in den Verläufen oder harte Farbsprünge zu sehen.
- [ ] Das Quantisieren: zu wenige Stufen je Farbkanal.
  > Zu grobes Quantisieren zeigt sich anders, als Streifen in glatten Verläufen oder als harte Farbsprünge, nicht als Klötzchen. Die Klötzchen kommen vom Abtasten.
- [ ] Die Übertragung: Beim Kopieren der Datei hat sich Rauschen aufaddiert.
  > Digitale Kopien addieren kein Rauschen, das ist ja gerade ihr Vorteil. Aufaddiertes Rauschen wäre außerdem körnig und unregelmäßig, nicht ordentlich klötzchenförmig.
- [ ] Beide Schritte gleichermaßen: Klötzchen entstehen immer aus dem Zusammenspiel.
  > Die beiden Schnitte hinterlassen getrennte Spuren, und genau daran erkennst du sie: Klötzchen zeigen auf das Abtasten, Streifen auf das Quantisieren. Dieses Bild zeigt nur Klötzchen.

> Klötzchen heißen zu wenige Punkte, harte Flecken in weichen Schattierungen heißen zu wenige Stufen.

## Warum digitalisiert man ein Bild nicht einfach immer mit höchster Auflösung und 24 Bit Farbtiefe, bevor man es über eine langsame Strecke mit 30 Bit je Sekunde schickt? {#ad-016}

- [ ] Weil ein Farbsensor auf der Empfangsseite nur drei Kanäle misst und deshalb höchstens 3 Bit je Bildpunkt ankommen können.
  > Die drei Kanäle eines Sensors begrenzen nicht, wie viele Bits je Bildpunkt übertragen werden können, denn die Bits werden ohnehin nacheinander als Symbole gesendet. Die Grenze liegt woanders.
- [ ] Weil sich große Dateien beim Übertragen stärker verrauschen als kleine.
  > Die Fehlerwahrscheinlichkeit je Symbol hängt vom Kanal ab, nicht von der Dateigröße. Eine große Datei bietet nur mehr Gelegenheiten, sie kostet aber vor allem eines: Zeit.
- [ ] Weil mehr als 8 Bit Farbtiefe auf dem Bildschirm des Empfängers nicht darstellbar sind.
  > Übliche Bildschirme zeigen gerade diese 24 Bit, 8 je Kanal. Die Darstellbarkeit ist nicht das Problem, sondern der Preis jedes behaltenen Bits auf dem Weg dorthin.
- [x] Weil jeder Bildpunkt und jede Stufe Bits kostet und ein großes Bild bei 30 Bit je Sekunde Stunden bräuchte.
  > Genau: Punkte mal Bits je Punkt ergibt die Dateigröße, und die Rate der Strecke macht daraus Zeit; 256 × 256 Punkte in voller Farbe bräuchten mehr als 14 Stunden. Digitalisieren heißt deshalb abwägen, welches Detail die Zeit wert ist.

> Auf einer langsamen Strecke kostet jedes behaltene Bit Zeit, deshalb sind Auflösung und Farbtiefe eine Abwägung und keine Frage von „so fein wie möglich“.
