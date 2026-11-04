---
title: "Quiz: Zahlensysteme"
summary: >-
  Vierzehn Fragen zu Stellenwert, Binär- und Hexadezimalzahlen, Bit und Byte und
  den beiden Leitern der Einheiten. Jede Antwort kommt mit ihrer Begründung.
objectives:
  intro: "Mit diesem Quiz prüfst du in zwölf Fragen, ob du Folgendes kannst:"
  goals:
    - "Zahlen zur Basis 10, 8, 2 und 16 nach der Regel Ziffer mal Stellenwert lesen"
    - "binär zählen und eine Zahl wie 13 ins Binärsystem übertragen"
    - "begründen, warum die Zehn nur Anatomie ist und Rechner zur Basis 2 arbeiten"
    - "Bit und Byte erklären und zeigen, warum ein Byte in genau zwei Hexziffern passt"
    - "erklären, warum eine Festplatte mit 1 TB nur 931 GB anzeigt"
translation_of: en
based_on: 2026-11-04
---

## Warum bedeutet die Ziffernfolge 123 einhundertdreiundzwanzig? {#ns-001}

- [ ] Weil die Ziffern zusammen ein festes Symbol für diese Zahl bilden.
  > Dann bräuchte jede Zahl ihr eigenes Symbol, und du müsstest unendlich viele lernen. Der Trick des Stellenwertsystems ist gerade, mit zehn Ziffern jede Zahl zu schreiben.
- [x] Weil jede Stelle eine Zehnerpotenz wert ist: 1 mal 100 plus 2 mal 10 plus 3 mal 1.
  > Genau: Die Ziffer sagt wie oft, die Stelle sagt was. Dieselbe Ziffer 1 ist vorn hundert wert und hinten eins. Diese Bauanleitung heißt Stellenwertsystem, und sie funktioniert mit jeder Basis, nicht nur mit der Zehn.
- [ ] Weil die Ziffern von links nach rechts der Größe nach aufsteigen und so die Zahl aufbauen.
  > Zufall dieses Beispiels. 321 funktioniert nach derselben Regel: 3 mal 100 plus 2 mal 10 plus 1 mal 1.
- [ ] Weil jede Stelle zehnmal so viel zählt wie die davor: 1 mal 1 plus 2 mal 10 plus 3 mal 100.
  > Die Zehnerpotenzen stimmen, die Richtung nicht: Diese Rechnung ergibt 321. Die Stellenwerte wachsen von rechts nach links, die Einer stehen ganz rechts.

## Was ist an der Basis 10 unseres Zahlensystems besonders? {#ns-002}

- [ ] Sie ist die einzige Basis, mit der sich jede beliebige Zahl darstellen lässt.
  > Mathematisch ist keine Basis ausgezeichnet. Jede Basis ab 2 kann jede Zahl darstellen, nach derselben Bauanleitung.
- [ ] Computer sind auf die Basis 10 angewiesen, weil ihre Eingaben und Ausgaben dezimal sind.
  > Dezimal ist nur die Oberfläche für Menschen. Innen rechnen Computer zur Basis 2 und übersetzen an Ein- und Ausgabe hin und her; für sie ist die Zehn eher unpraktisch.
- [x] Nichts, außer dass wir zehn Finger haben.
  > Genau: Die Zehn ist Anatomie, kein Naturgesetz. Ein Wesen mit acht Fingern würde zur Basis 8 zählen und käme genauso weit. Die Bauanleitung (Ziffer mal Stellenwert, aufsummiert) bleibt bei jeder Basis dieselbe.
- [ ] Nur zur Basis 10 gibt es die Ziffer 0, die eine leere Stelle markiert.
  > Jede Basis braucht die Null, sonst ließe sich eine leere Stelle nicht von einer fehlenden unterscheiden. Zur Basis R gibt es die Ziffern 0 bis R minus 1.

## Welche Zahl bedeutet die Binärfolge 110? {#ns-003}

- [ ] 110, die Schreibweise ändert nichts am Wert.
  > Die Schreibweise ändert alles: Dieselben Ziffern bedeuten je nach Basis verschiedene Zahlen. Binär gelesen sind die Stellen 4, 2 und 1 wert.
- [x] 6, denn 1 mal 4 plus 1 mal 2 plus 0 mal 1.
  > Genau, dieselbe Bauanleitung wie im Dezimalsystem, nur mit Zweierpotenzen als Stellenwerten: 4, 2, 1 statt 100, 10, 1.
- [ ] 3, denn 1 mal 1 plus 1 mal 2 plus 0 mal 4.
  > Die Stellenwerte stimmen, die Richtung nicht: Die Einerstelle steht ganz rechts, nicht links. Von rechts gelesen sind die Stellen 1, 2 und 4 wert, also 0 plus 2 plus 4.
- [ ] 220, denn jede Ziffer wird mit der Basis 2 multipliziert.
  > Nicht die Basis wird an jede Ziffer multipliziert, sondern der Stellenwert, und der ist je Stelle ein anderer: ganz rechts 1, dann 2, dann 4. Die Produkte werden anschließend addiert, nicht nebeneinander geschrieben.

## Du zählst binär: 0, 1, 10, 11, 100, 101, und dann? Welche Zahl kommt als nächstes, und warum? {#ns-004}

- [ ] 102, denn die letzte Stelle zählt wie im Zehnersystem eine Ziffer weiter.
  > Zur Basis 2 gibt es nur die Ziffern 0 und 1. Eine 2 kann in keiner Binärzahl vorkommen, genau wie das Dezimalsystem keine eigene Ziffer für die Zehn hat.
- [ ] 1000, denn mit 101 sind die drei Stellen ausgeschöpft und eine vierte kommt hinzu.
  > Zu früh übergelaufen: 101 ist die 5, danach kommt die 6, und die braucht noch keine vierte Stelle. Erst nach 111 (der 7) geht es mit 1000 weiter.
- [x] 110: Die letzte Stelle läuft über und reicht eine 1 weiter, wie beim Zählen von 09 auf 10.
  > Genau: Zählen funktioniert in jeder Basis gleich. Ist die höchste Ziffer erreicht, springt die Stelle auf 0, und die nächste Stelle zählt eins hoch. Binär passiert das nur viel öfter, weil nach der 1 schon Schluss ist.
- [ ] 111, denn nach 101 werden die verbliebenen Nullen der Reihe nach zu Einsen.
  > Damit wäre eine Zahl übersprungen: 111 ist die 7, gesucht ist die 6. Beim Zählen wird nur die letzte Stelle um eins erhöht, und die 1 dort läuft über: 101 wird 110.

## Ein Wesen mit acht Fingern schreibt die Zahl 123 in seinem Achtersystem. Welche Zahl ist das in unserem Zehnersystem? {#ns-005}

- [ ] 123, denn eine Zahl bleibt dieselbe, egal mit wie vielen Fingern gezählt wird.
  > Die Zahl dahinter ist überall gleich, ihre Schreibweise nicht. Dieselben Ziffern bedeuten zur Basis 8 etwas anderes, weil die Stellen 64, 8 und 1 wert sind.
- [x] 83, denn 1 mal 64 plus 2 mal 8 plus 3 mal 1.
  > Genau: gleiche Bauanleitung, andere Stellenwerte. Statt 100, 10, 1 sind die Stellen 64, 8, 1 wert, also Achterpotenzen. Wer das einmal gerechnet hat, kann jede Basis lesen.
- [ ] 48, denn die Ziffernsumme 1 plus 2 plus 3, multipliziert mit der Basis 8.
  > Die Ziffern werden nicht erst addiert und dann mit der Basis verrechnet. Jede Ziffer wird einzeln mit ihrem eigenen Stellenwert multipliziert (64, 8, 1), erst dann wird summiert.
- [ ] Das Achtersystem kann die Zahl 123 gar nicht darstellen.
  > Jede Basis ab 2 kann jede Zahl darstellen. Die Ziffern 1, 2 und 3 sind zur Basis 8 sogar alle erlaubt, verboten wären erst 8 und 9.

## Bisher hast du Binärzahlen gelesen. Jetzt andersherum: Wie schreibst du die Zahl 13 im Binärsystem? {#ns-013}

- [ ] 1011
  > Das sind 8 + 2 + 1 = 11. Die Ziffern stimmen, aber die Reihenfolge nicht: Wer die Stellenwerte von rechts nach links abarbeitet und das Ergebnis dann so hinschreibt, wie er es gefunden hat, dreht die Zahl um.
- [x] 1101
  > 8 + 4 + 0 + 1 = 13. Der bequemste Weg geht von der größten Zweierpotenz abwärts: 16 ist zu groß, 8 passt (Rest 5), 4 passt (Rest 1), 2 passt nicht, 1 passt. Das ergibt von links nach rechts 1, 1, 0, 1.
- [ ] 1110
  > Das sind 8 + 4 + 2 = 14, also eins zu viel. Ein Blick auf die letzte Stelle genügt zur Kontrolle: Sie trägt die 1, und ungerade Zahlen haben dort immer eine Eins.
- [ ] 1100
  > Das sind 8 + 4 = 12. Der Rest von 1 ist unterschlagen worden; nach der 4 bleibt genau eine 1 übrig, und die braucht die letzte Stelle.

## Im LiFi-Projekt überträgt euer Team Buchstaben als Folgen aus vier Farben, etwa rot-blau-grün. Inwiefern habt ihr damit bereits ein Stellenwertsystem gebaut? {#ns-012}

- [ ] Gar nicht: Ein Stellenwertsystem braucht Ziffern mit Zahlenwerten, und Farben haben keinen Wert.
  > Ziffern müssen nicht wie Zahlen aussehen. Sobald jede Farbe für einen Wert steht und die Position zählt, ist es ein Stellenwertsystem, egal wie die Ziffern aussehen.
- [x] Vier Farben sind vier Ziffern, also die Basis 4: Drei Stellen ergeben 4 hoch 3 gleich 64 Möglichkeiten, und die Position bestimmt den Stellenwert.
  > Genau, euer Farbalphabet ist ein Zahlensystem in Verkleidung: rot-blau-grün und grün-blau-rot sind verschiedene Codewörter, weil die Stelle zählt. Die Formel N = kⁿ für die Zahl der Codewörter ist dieselbe Rechnung wie die Frage, wie viele Zahlen in n Stellen zur Basis k passen.
- [ ] Nur zur Hälfte: Die Position zählt zwar, aber ohne eine Farbe für die Null fehlt dem System seine wichtigste Ziffer.
  > Die Null fehlt nicht, sie hat nur keine Sonderstellung: Welche der vier Farben für 0 steht, ist Vereinbarung, genau wie bei 1, 2 und 3. Vier Farben sind vier vollwertige Ziffern.
- [ ] Nur mit genau zwei Farben wäre es ein Stellenwertsystem, weil Computer intern mit Bits arbeiten.
  > Die Basis 2 ist ein Spezialfall, kein Privileg. Stellenwertsysteme funktionieren mit jeder Basis ab 2, eure vier Farben eingeschlossen.

## Euer LiFi-Alphabet hat vier Farben. Ihr wollt damit 26 Buchstaben unterscheiden und gebt jedem Buchstaben eine feste Zahl von Farbstellen. Wie viele Stellen braucht ihr mindestens? {#ns-014}

- [ ] Zwei, denn zwei Stellen sind schon 4 mal 4.
  > Zwei Stellen ergeben 4² = 16 Kombinationen, und 16 reichen für 26 Buchstaben nicht. Die Rechnung ist richtig angesetzt, das Ergebnis aber zu klein; es fehlen zehn Zeichen.
- [x] Drei, denn 4³ sind 64 und damit erstmals genug.
  > Genau die Rechnung des Stellenwertsystems, nur andersherum gelesen: Mit k Ziffern und n Stellen sind kⁿ Kombinationen darstellbar. 4² = 16 ist zu wenig, 4³ = 64 reicht, und 38 Kombinationen bleiben ungenutzt. Diese Verschwendung ist der Preis der festen Länge.
- [ ] Fünf, denn 26 Buchstaben brauchen fünf Bit, und jede Farbstelle ist eine Stelle.
  > Fünf Bit stimmen, aber ein Bit ist eine Stelle mit **zwei** Möglichkeiten. Eine Farbstelle mit vier Farben trägt zwei Bit, also braucht ihr nur halb so viele Stellen, aufgerundet drei.
- [ ] Sechsundzwanzig, denn jeder Buchstabe braucht seine eigene Stelle.
  > Das wäre der Fall, wenn jede Stelle nur einen Buchstaben markieren könnte. Der ganze Trick des Stellenwertsystems ist aber, dass Stellen sich **kombinieren**: Jede zusätzliche Stelle vervierfacht die Zahl der Möglichkeiten, statt sie um eins zu erhöhen.

## Warum rechnen Computer zur Basis 2 und nicht gleich zur Basis 10? {#ns-010}

- [ ] Weil die Rechenwerke nur die einfachsten Rechenregeln beherrschen und das Einmaleins zur Basis 2 am kürzesten ist.
  > Das kurze Einmaleins ist eine angenehme Folge, nicht der Grund. Mathematisch ist jede Basis gleich mächtig; den Ausschlag gibt die Physik der Bauteile, die zwei Zustände am sichersten auseinanderhalten.
- [x] Weil zwei Zustände den größten Abstand haben und sich darum am zuverlässigsten unterscheiden lassen, milliardenfach und fehlerfrei.
  > Genau: Je mehr Stufen auf denselben Wertebereich verteilt werden, desto kleiner die Abstände und desto eher schlägt das Rauschen zu. Basis 10 hieße zehn Spannungsstufen statt zwei, mit entsprechend mehr Fehlern. An und aus ist das robusteste Alphabet, das es gibt.
- [ ] Weil sich zur Basis 2 kürzere Zahlen ergeben und der Speicher dadurch weniger Stellen braucht.
  > Das Gegenteil stimmt: Binärzahlen sind länger, die 255 braucht acht Stellen statt drei. Der Preis wird gern bezahlt, weil jede einzelne Stelle dafür fast unzerstörbar ist.
- [ ] Historischer Zufall: Die ersten Computer arbeiteten mit Relais, die nur zwei Stellungen kennen, und dabei ist es geblieben.
  > Es gab tatsächlich Dezimalrechner, und sie sind ausgestorben, weil sie fehleranfälliger und aufwendiger waren. Die Basis 2 hat sich aus einem physikalischen Grund durchgesetzt, nicht aus Gewohnheit.

## Das Wort „Bit“ hat zwei Bedeutungen: Maß für Information (eine Ja/Nein-Antwort) und Binärziffer (eine 0 oder 1). Wie passen die beiden zusammen? {#ns-006}

- [ ] Gar nicht: Das Maß stammt aus der Nachrichtentechnik, die Ziffer aus der Mathematik, und der gleiche Name ist Zufall.
  > Kein Zufall: Eine Binärziffer kann genau zwei Werte annehmen und trägt damit genau die Information einer Ja/Nein-Antwort. Die Ziffer ist der Behälter, die Information der Inhalt.
- [x] Eine Binärziffer hat zwei mögliche Werte und fasst darum genau eine Ja/Nein-Antwort: Der Behälter ist nach dem Inhalt benannt.
  > Genau. Und die Unterscheidung bleibt nützlich: Ein Behälter kann auch halb leer sein. Eine Binärziffer, deren Wert fast sicher feststeht, trägt weniger als ein Bit Information, und genau dort spart Kompression Ziffern ein.
- [ ] Das Informationsmaß war die ursprüngliche Bedeutung; seit Computer in Binärziffern rechnen, meint Bit nur noch die Ziffer.
  > Beide Bedeutungen sind lebendig. Wer Kompression verstehen will, braucht sogar beide gleichzeitig: Dort werden Ziffern gespart, weil sie weniger als ein Bit Information trugen.
- [ ] Eine Ziffer speichert nur einen Zustand; für eine ganze Ja/Nein-Antwort braucht es zwei Ziffern, eine je Möglichkeit.
  > Eine Ziffer speichert nicht einen Zustand, sondern hat zwei mögliche Werte, und die decken die zwei Möglichkeiten der Antwort ab. Eine Ziffer fasst deshalb genau ein Bit; mehrere Ziffern braucht, wer mehr als ein Bit übertragen will.

## Was ist ein Byte, und wie viele verschiedene Werte kann es annehmen? {#ns-007}

- [ ] Ein Paket aus acht Bit, also acht verschiedene Werte, einer je Bit.
  > Acht Bit stimmt, aber die Werte multiplizieren sich: Jede der acht Stellen verdoppelt die Möglichkeiten. 2 hoch 8 sind 256, nicht 8.
- [ ] Die kleinste Zahl, die ein Computer speichern kann, mit 2 hoch 8 gleich 256 als größtem Wert.
  > Das Byte ist eine Verpackungseinheit, keine Zahl. Es ist die übliche kleinste adressierbare Einheit im Speicher, und was die acht Bit darin bedeuten, entscheidet die Vereinbarung. Als Zahl gelesen reicht es außerdem von 0 bis 255, nicht bis 256.
- [x] Ein Paket aus acht Bit, mit 2 hoch 8 gleich 256 möglichen Werten.
  > Genau: acht Stellen zur Basis 2, jede verdoppelt die Möglichkeiten, zusammen 256. Als Zahl gelesen reicht ein Byte von 0 bis 255, und genau deshalb laufen Farbkanäle in der Bildbearbeitung von 0 bis 255.
- [ ] Ein Paket aus tausend Bit, daher die Vorsilbe Kilo im Kilobyte, mit tausend möglichen Werten.
  > Ein Byte sind acht Bit. Das Kilobyte ist die nächste Verpackungsstufe darüber, tausend Byte, nicht tausend Bit. Und selbst bei tausend Bit wären die Werte 2 hoch 1000, nicht tausend.

## Hexadezimal ist das Stellenwertsystem zur Basis 16 mit den Ziffern 0 bis 9 und A bis F. Warum passt ein Byte in genau zwei Hexadezimalstellen? {#ns-008}

- [ ] Zufall der Geschichte: Die ersten Rechner hatten zweistellige Anzeigen, und die Basis 16 wurde daran angepasst.
  > Es ist Arithmetik, kein Zufall: 16 mal 16 ist genau 256. Gerade deshalb hat sich die Basis 16 als Kurzschrift für Bytes durchgesetzt.
- [x] Eine Hexziffer fasst 16 Werte, also genau 4 Bit; zwei Ziffern fassen 8 Bit, und 16 mal 16 ist 256.
  > Genau, und deshalb ist Hex die Kurzschrift für Bytes: Menschen lesen AC leichter als 10101100, und beides ist die 172. Die Farbe #AC8909 ist schlicht drei Bytes, je zwei Stellen.
- [ ] Weil die sechs Buchstaben A bis F genau die Bits ergänzen, die den zehn Ziffern zum Byte fehlen.
  > A bis F sind keine Bits, sondern gewöhnliche Ziffern mit den Werten 10 bis 15. Sie werden gebraucht, weil die Basis 16 sechzehn verschiedene Ziffern verlangt und unsere zehn nicht reichen. Mit dem Byte hat ihre Anzahl nichts zu tun.
- [ ] Weil eine Hexziffer ein halbes Byte darstellt, nämlich 8 Werte, und zwei Hälften ein Ganzes ergeben.
  > Das halbe Byte stimmt, die Zahl nicht: Ein halbes Byte sind 4 Bit, also 2 hoch 4 gleich 16 Werte, nicht 8. Mit 8 Werten je Ziffer kämen zwei Ziffern nur auf 64, und das Byte mit seinen 256 Werten passte nicht hinein.

## Welchen Wert hat die Hexadezimalzahl FF? {#ns-009}

- [ ] 1515, denn F ist die 15, und beide Ziffernwerte werden hintereinander geschrieben.
  > Die Ziffernwerte werden nicht hintereinander geschrieben, sondern mit den Stellenwerten verrechnet: 15 mal 16 plus 15 mal 1.
- [ ] 30, denn F ist die 15, und die beiden Stellen werden addiert.
  > Die linke Stelle ist Sechzehner wert, nicht Einer: 15 mal 16 plus 15 mal 1, nicht 15 plus 15.
- [x] 255, denn 15 mal 16 plus 15 mal 1, der größte Wert eines Bytes.
  > Genau. FF ist das volle Byte, binär 11111111. Deshalb bedeutet die Farbe #FF0000 volles Rot: erster Kanal auf Maximum, die anderen auf null.
- [ ] 240, denn F ist die 15, und 15 mal 16 ergibt 240.
  > Die linke Stelle stimmt, die rechte fehlt: Das zweite F ist noch einmal 15 mal 1. Zusammen 240 plus 15 gleich 255.

## Eine Festplatte ist mit 1 Terabyte beschriftet, das Betriebssystem zeigt aber nur 931 Gigabyte an. Wo sind die restlichen 69 Gigabyte? {#ns-011}

- [ ] Sie sind Reservebereiche, die der Hersteller für defekte Stellen vorhält und die das System ausblendet.
  > Solche Reserven gibt es, sie sind aber winzig und in keiner der beiden Zahlen enthalten. Es fehlt kein einziges Byte: Beide Angaben beschreiben dieselbe Menge Speicher, nur mit verschiedenen Einheiten.
- [ ] Das Betriebssystem reserviert sie für eigene Dateien, Auslagerung und Wiederherstellung.
  > Systemdateien kosten etwas Platz, aber nicht sieben Prozent einer leeren Platte. Der Unterschied steckt in den Einheiten.
- [x] Nirgends: Der Hersteller rechnet mit 1000er-Schritten, das System mit 1024er-Schritten, und 1024 ist 2 hoch 10.
  > Genau: Kilo, Mega, Giga sind dezimal je Faktor 1000; Speicher wird aber binär organisiert, in Zweierpotenzen, und 2 hoch 10 gleich 1024 liegt nahe genug an 1000, um beide zu verwechseln. Jede Stufe vergrößert den Abstand um rund 2,4 Prozent, bei Giga, drei Stufen hoch, sind es also 7,4 Prozent. Die sauberen Namen für die 1024er-Schritte sind Kibi, Mebi, Gibi.
- [ ] Der Hersteller rundet großzügig auf, damit auf der Verpackung eine glatte Zahl steht.
  > Gerundet wird nicht, die Angabe stimmt exakt. Sie benutzt nur die dezimale Lesart, die günstiger klingt. Beide Lesarten sind definiert, ärgerlich ist nur, dass sie denselben Namen tragen.
