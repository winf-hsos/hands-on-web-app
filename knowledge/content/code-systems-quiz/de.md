---
title: "Quiz: Codesysteme"
summary: >-
  Neunzehn Fragen zu Codes als Vereinbarungen, zu ASCII und UTF-8, zu fester
  und variabler Länge, zur Präfix-Falle und zu Bytes, die je nach Lesart Text,
  Farbe oder Ton bedeuten. Jede Antwort kommt mit ihrer Begründung.
translation_of: en
based_on: 2026-11-09
---

## Was ist ein Codesystem? {#cs-001}

- [ ] Ein Verfahren, das Daten vor fremdem Zugriff schützt.
  > Das ist Verschlüsselung, ein eigenes Konzept. Ein Code verbirgt nichts, er ist im Gegenteil öffentlich, damit beide Seiten ihn benutzen können.
- [x] Eine vereinbarte Zuordnung von Zeichen zu Folgen von Symbolen oder Bits.
  > Genau: eine Vorschrift, welche Bitfolge welches Zeichen bedeutet. Vereinbart, nicht naturgegeben, und deshalb gibt es mehrere davon.
- [ ] Ein Verfahren, das Daten so umschreibt, dass sie weniger Speicherplatz belegen.
  > Das ist Kompression. Manche Codes sind nebenbei sparsam, aber kleiner machen ist nicht ihr Zweck.
- [ ] Die Programmiersprache, in der ein Programm geschrieben ist.
  > Das Wort „Code“ hat im Alltag mehrere Bedeutungen. Hier geht es nicht um Quelltext, sondern um die Zuordnung von Zeichen zu Bitfolgen.

## In ASCII steht das große A für die Zahl 65, B für 66, C für 67. Was folgt daraus? {#cs-002}

- [ ] Dass Buchstaben im Rechner als Buchstaben gespeichert werden, nur mit einer Nummer daneben.
  > Gespeichert wird nur die Zahl. Ein Buchstabe existiert im Rechner nicht als Form, sondern erst dann, wenn ein Programm die Zahl nach derselben Vereinbarung wieder darstellt.
- [ ] Dass sich die 65 aus der Stellung von A im Alphabet ergibt, sobald man Ziffern und Satzzeichen mitzählt.
  > Die Zahl folgt aus keiner Rechnung. Sie wurde in der ASCII-Tabelle festgelegt, deren Anfang für Steuerzeichen und Satzzeichen reserviert ist; man hätte A ebenso gut die 1 oder die 200 geben können.
- [x] Dass ein Buchstabe im Rechner nichts anderes ist als eine Zahl, der jemand diese Bedeutung zugewiesen hat.
  > Genau, und das ist die Pointe des ganzen Konzepts: Dieselben Bits sind Text, Bild oder Ton, je nachdem, welche Vereinbarung man auf sie anwendet.
- [ ] Dass jeder Rechner Buchstaben nach dieser Tabelle ablegen muss, weil die Zahlen in der Hardware festgelegt sind.
  > Die Tabelle ist eine Vereinbarung zwischen Programmen, keine Eigenschaft der Hardware. Es gibt viele Zuordnungen: UTF-8, ältere Zeichensätze, ein selbst erfundenes Farbalphabet. ASCII ist verbreitet, nicht notwendig.

## Im Morsecode ist das E ein einzelner Punkt, das Q dagegen vier Zeichen lang. In ASCII ist jedes Zeichen genau ein Byte lang. Was ist der Vorteil der festen Länge? {#cs-003}

- [ ] Die Nachricht wird insgesamt kürzer, weil kein Zeichen mehr Symbole belegt als die anderen.
  > Meistens umgekehrt: Variable Länge kann kürzer werden, weil häufige Zeichen kurze Codes bekommen. Feste Länge kauft etwas anderes ein.
- [x] Der Empfänger weiß immer, wo ein Zeichen endet, ohne Trennzeichen und ohne Nachdenken.
  > Genau: Er zählt einfach immer gleich viele Symbole ab. Bei variabler Länge muss aus dem Code selbst hervorgehen, wo Schluss ist, sonst braucht es Pausen oder Trennzeichen. Morse braucht sie deshalb wirklich.
- [ ] Feste Länge ist störungssicherer gegen Rauschen.
  > Gegen Rauschen hilft Abstand zwischen den Symbolen, nicht die Codelänge. Ein Fehler kann in beiden Systemen passieren, er wirkt bei variabler Länge nur schlimmer, weil danach alles verrutscht.
- [ ] Feste Länge kommt ohne vorher vereinbarte Tabelle aus, weil die Position im Byte schon sagt, welches Zeichen gemeint ist.
  > Auch feste Länge muss vereinbart werden: welche Länge, und welche Bitfolge welches Zeichen bedeutet. Die Position sagt nur, wo ein Zeichen anfängt, nicht, was es bedeutet.

## Ein Team vereinbart: a = 0, b = 01, c = 10. Gesendet wird die Folge 010. Warum ist dieser Code unbrauchbar? {#cs-004}

- [ ] Weil die Codewörter verschieden lang sind und ein Code nur mit fester Länge lesbar bleibt.
  > Variable Länge ist an sich erlaubt, Morse lebt davon. Der Fehler liegt nicht in den Längen, sondern darin, dass ein Codewort der Anfang eines anderen ist.
- [x] Weil die Folge zwei Lesarten hat: „a c“ und „b a“ passen beide.
  > Genau: 0 + 10 ergibt „a c“, 01 + 0 ergibt „b a“. Ein Code muss eindeutig decodierbar sein. Hier ist der Code von a der Anfang des Codes von b, deshalb weiß der Empfänger nie, ob ein Zeichen schon zu Ende ist. Abhilfe: feste Länge, ein Trennzeichen, oder Codewörter, von denen keines der Anfang eines anderen ist.
- [ ] Weil 0 und 1 zu wenige Symbole sind; für drei Zeichen bräuchte es ein drittes Symbol als Trenner.
  > Zwei Symbole genügen für jede Nachricht. Der Fehler liegt nicht in der Anzahl, sondern in der Wahl der Codewörter.
- [ ] Weil ein Alphabet aus nur drei Zeichen zu wenige Kombinationen ergibt, um Wörter eindeutig zu bilden.
  > Drei Zeichen sind vollkommen in Ordnung. Mit a = 00, b = 01, c = 10 wäre derselbe Vorrat eindeutig lesbar.

## Dein Code gibt jedem Buchstaben drei Farbstellen aus einem Alphabet von vier Farben. Jetzt sollen zusätzlich das Leerzeichen, der Punkt und die zehn Ziffern übertragen werden. Was musst du an deinem Code ändern? {#cs-005}

- [x] Nichts an der Länge: Drei Farbstellen ergeben 64 Codewörter, gebraucht werden 38, es bleiben 26 frei.
  > Genau. Die freien Codewörter waren nie Abfall, sondern Vorrat. Genau dafür sind sie da: für Leerzeichen, Ziffern, Satzzeichen und später Steuerzeichen.
- [ ] Eine vierte Farbstelle, denn die 64 Codewörter sind mit den 26 Buchstaben bereits vergeben.
  > 26 Buchstaben belegen 26 der 64 Codewörter, nicht alle. Die Tabelle ist deutlich leerer, als sie sich anfühlt.
- [ ] Eine fünfte Farbe ins Alphabet aufnehmen, damit die zwölf neuen Zeichen Platz finden.
  > Das würde die Kapazität erhöhen, ist hier aber nicht nötig, und es ist der teuerste Weg: Eine fünfte Farbe muss der Sensor zuverlässig von den anderen vier unterscheiden können.
- [ ] Für die zwölf neuen Zeichen ein Trennzeichen einführen, weil sie keine Buchstaben sind.
  > Ein Trennzeichen braucht nur, wer verschieden lange Codewörter benutzt. Bei fester Länge zählt der Empfänger ab, und für ihn ist ein Punkt genauso ein Codewort wie ein Buchstabe.

## ASCII kennt 128 Zeichen. Warum gibt es trotzdem noch Unicode und UTF-8? (Mehrere richtige Antworten möglich.) {#cs-006}

- [x] Weil 128 Zeichen für die Schriften der Welt bei weitem nicht reichen.
  > Richtig: Umlaute, Griechisch, Kyrillisch, Chinesisch, Emoji. Unicode vergibt für jedes Zeichen eine Nummer, aktuell über 100.000 Stück.
- [ ] Weil ASCII mit einem Byte je Zeichen für heutige Rechner zu langsam zu verarbeiten ist.
  > ASCII ist denkbar schnell zu decodieren, ein Byte je Zeichen. Der Grund für Unicode ist der Vorrat, nicht das Tempo.
- [x] Weil UTF-8 mit variabler Länge arbeitet: gängige Zeichen bleiben ein Byte, seltene brauchen mehr.
  > Richtig, und das ist derselbe Gedanke wie bei Morse: häufig heißt kurz. Deshalb ist ein englischer Text in UTF-8 fast so kompakt wie in ASCII, und deutsche Umlaute kosten je ein Byte mehr.
- [ ] Weil Unicode neben Zeichen auch Bilder und Töne kodiert, die in ASCII fehlen.
  > Unicode kodiert Zeichen, auch Emoji, aber keine Bilder oder Töne. Dafür gibt es eigene Codesysteme.

## Auf einer Festplatte liegt die Bytefolge `48 65 6C 6C 6F`. Woher weiß ein Programm, ob das ein Text, ein Bildausschnitt oder ein Stück Ton ist? {#cs-007}

- [ ] Die Bytes selbst verraten es, Textbytes sehen anders aus als Bildbytes.
  > Dieselben Bytes können alles bedeuten. `48 65 6C 6C 6F` ist in ASCII „Hello“, könnte aber genauso fünf Grauwerte oder fünf Tonabtastwerte sein.
- [ ] Aus dem Speicherort: Text, Bilder und Töne liegen auf der Platte in getrennten Bereichen.
  > Die Platte kennt keine Bereiche für Datentypen, sie speichert Bytes, wo Platz ist. Die Konvention, was die Bytes bedeuten, muss anderswo herkommen.
- [x] Aus zusätzlichen Absprachen: Dateiendung, Kopfdaten der Datei, oder weil das Programm es schlicht voraussetzt.
  > Genau: Der Typ ist selbst wieder eine Vereinbarung, die mitgeliefert oder vorausgesetzt wird. Deshalb tragen viele Nachrichtenformate ein Typfeld: Der Empfänger soll nicht raten müssen, was da kommt.
- [ ] Das Betriebssystem speichert zu jedem Byte, was es bedeutet.
  > Es speichert Bytes und einen Dateinamen, mehr nicht. Die Deutung passiert erst beim Öffnen, und dann kann sie auch schiefgehen: Wer ein Bild als Text öffnet, sieht Zeichensalat.

## Ein Bildpunkt wird mit je einem Byte für Rot, Grün und Blau gespeichert. Wie viele verschiedene Farben lassen sich damit darstellen? {#cs-008}

- [ ] 768, also 3 mal 256.
  > Addiert wird nicht: Jede der 256 Rotstufen lässt sich mit jeder Grün- und jeder Blaustufe kombinieren. Deshalb wird multipliziert.
- [x] Rund 16,7 Millionen, also 256 mal 256 mal 256.
  > Genau, und in Bits gerechnet: 8 plus 8 plus 8 sind 24 Bit je Bildpunkt, also 2 hoch 24 Möglichkeiten. Genau diese Zahl steckt hinter der Angabe „24 Bit Farbtiefe“.
- [ ] 256, ein Byte reicht ja für eine Farbe.
  > Ein Byte reicht für einen Kanal. Erst drei Kanäle zusammen ergeben die Farbe, und ihre Kombinationen multiplizieren sich.
- [ ] Unbegrenzt viele, weil Farbe stufenlos ist.
  > Farbe in der Welt ist stufenlos, im Speicher nicht: Drei Bytes ergeben endlich viele Zustände. Genau das heißt Digitalisieren.

## Eine Farbe wird als `#AC8909` notiert. Was ist das für eine Schreibweise und wozu dient sie? {#cs-009}

- [ ] Ein eigenes Codesystem für Farben, unabhängig von RGB.
  > Es sind dieselben drei RGB-Anteile, nur anders aufgeschrieben: AC ist 172 (viel Rot), 89 ist 137 (etwas weniger Grün), 09 ist 9 (fast kein Blau).
- [x] Hexadezimal: eine kompakte Schreibweise für Bytes, bei der zwei Stellen genau ein Byte ergeben.
  > Genau: 16 Ziffern (0 bis 9 und A bis F), also 4 Bit je Stelle und 8 Bit je Paar. Deshalb sind drei Paare genau die drei Farbbytes. Menschen lesen `AC` leichter als `10101100`.
- [ ] Eine Prüfsumme aus sechs Zeichen, an der ein Programm erkennt, ob der Farbwert unbeschädigt angekommen ist.
  > Eine Prüfsumme würde aus den Daten berechnet, hier steht dagegen schlicht der Farbwert selbst, nur in anderer Basis.
- [ ] Die Speicheradresse, an der der Farbwert im Arbeitsspeicher abgelegt ist; daher das Raute-Zeichen davor.
  > Adressen schreibt man auch hexadezimal, daher die Verwechslung. Hier ist es aber der Inhalt, nicht der Ort.

## Dasselbe Logo lässt sich als Bitmap (eine Farbe je Bildpunkt) oder als Vektorgrafik (Anweisungen wie „Kreis, Mittelpunkt, Radius, Farbe“) speichern. Welche Aussagen treffen zu? (Mehrere richtige Antworten möglich.) {#cs-010}

- [x] Beides sind Codesysteme: Sie beschreiben dasselbe Bild nach verschiedenen Vereinbarungen.
  > Richtig, und das ist der Kern: Es gibt nicht die eine richtige Darstellung, sondern verschiedene Zuordnungen mit verschiedenen Stärken.
- [ ] Die Vektorfassung ergibt bei jedem Motiv die kleinere Datei, weil Anweisungen weniger Platz brauchen als Bildpunkte.
  > Bei einfachen Formen meistens, bei einem Foto keineswegs: Ein Foto als Vektorgrafik zu beschreiben, wäre absurd aufwendig. Es hängt am Motiv.
- [x] Nur die Vektorfassung lässt sich beliebig vergrößern, ohne dass Treppenstufen entstehen.
  > Richtig: Die Anweisung „Kreis mit Radius r“ lässt sich in jeder Größe neu zeichnen, ein Raster aus Bildpunkten dagegen nicht.
- [ ] Die Bitmapfassung braucht keine eigene Vereinbarung, weil eine Farbe je Bildpunkt ohnehin die natürliche Form eines Bildes ist.
  > Auch sie braucht Absprachen: Breite, Höhe, Reihenfolge der Bildpunkte, Farbtiefe, Kanalreihenfolge. Ohne die ist eine Bitmap nur eine Bytefolge.

## `encode("cab")` liefert eine Bitfolge. Wie lautet sie, und wie findet der Empfänger die Zeichen darin wieder? {#cs-011}

```python static
CODE = {"a": "00", "b": "01", "c": "10", "d": "11"}

def encode(text):
    return "".join(CODE[char] for char in text)
```

- [x] 100001, und der Empfänger schneidet die Folge einfach in Zweiergruppen.
  > Genau: c ist 10, a ist 00, b ist 01. Weil alle Codewörter gleich lang sind, genügt Abzählen; ein Trennzeichen ist überflüssig. Der Empfänger benutzt genau dieses Wörterbuch in umgekehrter Richtung.
- [ ] 100001, aber ohne Trennzeichen ist die Folge nicht wieder lesbar.
  > Die Bitfolge stimmt. Trennzeichen braucht nur variable Länge; hier ist jedes Zeichen genau zwei Bit lang, das reicht als Regel.
- [ ] cab, denn join setzt die nachgeschlagenen Zeichen am Ende wieder zum ursprünglichen Text zusammen.
  > join fügt zusammen, was die Schleife liefert, und die liefert je Zeichen das Codewort aus dem Wörterbuch, nicht das Zeichen selbst. Zurück kommt eine Zeichenkette aus Nullen und Einsen.
- [ ] 001001, die Reihenfolge im Wörterbuch entscheidet.
  > Die Reihenfolge im Wörterbuch spielt keine Rolle, nur die Zuordnung. Gelesen wird der Text von links nach rechts: c, a, b.

## Welche der folgenden Dinge sind Codesysteme im Sinn dieses Konzepts? (Mehrere richtige Antworten möglich.) {#cs-012}

- [x] Ein Strichcode auf einer Verpackung
  > Ja: Strichbreiten stehen für Ziffern, nach einer öffentlich festgelegten Vereinbarung.
- [x] Die Blindenschrift Braille
  > Ja: sechs Punktpositionen, jede gesetzt oder nicht. Das sind 6 Bit je Zeichen, tastbar statt sichtbar.
- [x] Die DNA in einer Zelle
  > Ja, und der älteste Code von allen: Drei Basen in Folge stehen für eine Aminosäure, und diese Zuordnung ist bei allen Lebewesen dieselbe. Eine Vereinbarung, die niemand ausgehandelt hat und die trotzdem alle einhalten.
- [x] Ein Farbalphabet, das ein Team für eine Lampe erfindet
  > Ja, und das ist die Pointe: Ein Codesystem braucht keinen Computer, nur eine Vereinbarung und unterscheidbare Zustände.
- [ ] Die Lautstärke eines Geräuschs
  > Nein: eine stufenlose physikalische Größe, ohne vereinbarte Zuordnung. Erst wenn jemand festlegt, was leise und laut bedeuten sollen, wird ein Code daraus.

## Vier Teams legen ihre Codetabelle vor. Welche davon lassen sich ohne Trennzeichen eindeutig lesen? (Mehrere richtige Antworten möglich.) {#cs-013}

- [x] a = 00, b = 01, c = 10, d = 11
  > Feste Länge: Der Empfänger schneidet die Folge in Zweiergruppen und braucht gar nicht zu überlegen, wo ein Zeichen endet.
- [x] a = 0, b = 10, c = 110, d = 111
  > Verschieden lang und trotzdem eindeutig: Kein Codewort steht am Anfang eines anderen. Sobald ein gelesenes Stück in der Tabelle steht, kann es nur dieses Zeichen sein.
- [ ] a = 0, b = 10, c = 01, d = 11
  > `010` ist entweder „a b“ oder „c a“, und beides hält sich an die Tabelle. Das Codewort von a ist der Anfang des Codeworts von c, deshalb weiß der Empfänger nach einer `0` nicht, ob das Zeichen schon zu Ende ist.
- [ ] a = 0, b = 1, c = 01, d = 10
  > `01` ist entweder „c“ oder „a b“, und beides ist erlaubt. Verschiedene Längen sind hier tatsächlich das Problem, aber nur weil die kurzen Codewörter am Anfang der langen stehen.

## Diese Zeile lässt eine RGB-LED in einem warmen Gold leuchten. Was bedeuten die drei Zahlen? {#cs-014}

```python static
led.set_color(236, 171, 3)
```

- [ ] Drei Nummern aus einer Tabelle, in der jede darstellbare Farbe mit einem eigenen Eintrag steht.
  > Eine solche Tabelle gibt es nicht, und ein Eintrag bräuchte auch nur eine Nummer, nicht drei. Die Farbe entsteht durch Mischen dreier Anteile, nicht durch Nachschlagen.
- [x] Die Anteile der drei Grundfarben: viel Rot, etwas weniger Grün, fast kein Blau, jeder Anteil von 0 bis 255.
  > Genau, und dieselbe Vereinbarung benutzt jeder Bildschirm: drei Kanäle, je ein Byte, zusammen 16,7 Millionen Farben. Als Hex geschrieben ist das #ECAB03.
- [ ] Helligkeit, Farbton und Sättigung der Farbe, in dieser Reihenfolge, jeweils als Wert von 0 bis 255.
  > Das wäre eine andere Vereinbarung, es gibt sie tatsächlich (HSV), aber `set_color` erwartet die drei Grundfarbenanteile. Wieder gilt: Zahlen bedeuten nur das, was vereinbart ist.
- [ ] Die Wellenlänge des Lichts in Nanometern.
  > Eine Wellenlänge wäre eine einzige Zahl und läge bei sichtbarem Licht zwischen etwa 380 und 750. Eine RGB-LED erzeugt Farben nicht über die Wellenlänge, sondern durch Mischen dreier fester Grundfarben.

## Zwei Teammitglieder haben ihre Codetabelle unabhängig voneinander abgetippt. In der Tabelle des Empfängers sind versehentlich die Einträge für „n“ und „m“ vertauscht, alles andere stimmt überein. Der Sender schickt das Wort „sonne“. Was passiert? {#cs-015}

- [ ] Der Empfänger meldet einen Fehler, weil die empfangene Folge nicht zu seiner Tabelle passt.
  > Die Folge passt sehr wohl zu seiner Tabelle, nur eben zu einem anderen Buchstaben. Es gibt nichts, worüber sich das Programm wundern könnte.
- [ ] Der Empfänger gibt „sonne“ aus, denn die Bitfolge trägt ihre Bedeutung mit sich.
  > Eine Bitfolge trägt keine Bedeutung mit sich. Sie bekommt sie erst durch die Tabelle, in der jemand nachschlägt, und hier sind es zwei verschiedene Tabellen.
- [x] Der Empfänger gibt „somme“ aus, und nichts deutet auf einen Fehler hin.
  > Genau das macht falsche Tabellen so tückisch: Es kommt kein Fehler an, sondern sauberer Unsinn. Genau davon handelt der Stein von Rosetta, nur in klein.
- [ ] Die Übertragung bricht beim ersten falsch zugeordneten Zeichen ab.
  > Abbrechen könnte der Empfänger nur, wenn er merkte, dass etwas nicht stimmt. Er schlägt aber nur nach und bekommt jedes Mal eine gültige Antwort.

## Dein Team hat die Tabelle für das Senden aufgeschrieben. Der Empfänger bekommt die Bitfolge `11000110`. Welchen Text hat er empfangen? {#cs-016}

```python static
code = {"a": "00", "b": "01", "c": "10", "d": "11"}
```

- [x] „dabc“, denn die Folge wird von vorn in Zweiergruppen geschnitten und jede Gruppe rückwärts nachgeschlagen.
  > 11 00 01 10 ergibt d, a, b, c. Weil alle Codewörter zwei Bit lang sind, genügt Abzählen, und die Tabelle lässt sich in beide Richtungen benutzen.
- [ ] „cbad“, denn beim Dekodieren wird die Folge von hinten in Zweiergruppen geschnitten.
  > Von hinten zu schneiden ergibt hier zufällig auch Zweiergruppen, dreht aber die Reihenfolge um. Der Empfänger liest in derselben Reihenfolge, in der gesendet wurde.
- [ ] Ein einziges Zeichen, denn acht Bit sind ein Byte, und ein Byte trägt genau ein Zeichen.
  > Ein Byte trägt ein Zeichen, wenn die Vereinbarung das sagt, etwa in ASCII. Die Vereinbarung hier sagt zwei Bit je Zeichen, also stecken hier vier Zeichen in acht Bit.
- [ ] Gar nichts, denn zum Dekodieren braucht es eine zweite Tabelle von Bits auf Buchstaben; die vorhandene zeigt in die falsche Richtung.
  > Solange keine zwei Zeichen dasselbe Codewort haben, trägt eine Tabelle beide Richtungen. Im Programm dreht man sie einmal um, das ist Handwerk, aber keine neue Vereinbarung.

## Deine Codetabelle enthält die 26 Buchstaben, sonst nichts. Jemand tippt „guten morgen“ und drückt auf Senden. Welche Aussage trifft zu? {#cs-017}

- [ ] Das Leerzeichen ist die Abwesenheit eines Zeichens und braucht deshalb keinen Code.
  > Für dich sieht ein Leerzeichen nach Nichts aus, für den Text ist es ein Zeichen wie jedes andere. Ohne Code kommt „gutenmorgen“ an, und der Empfänger kann die Lücke nicht erfinden.
- [x] Das Leerzeichen hat keinen Code; dein Programm muss festlegen, was damit geschieht, sonst entscheidet der Zufall.
  > Genau. Entweder du nimmst das Leerzeichen in die Tabelle auf, oder du wirfst es vorher weg, oder du brichst mit einer Meldung ab. Alle drei sind vertretbar; keine Entscheidung zu treffen ist es nicht.
- [ ] Der Empfänger erkennt die Wortgrenze an der Pause zwischen den Symbolen.
  > Das verwechselt zwei Ebenen. Pausen zwischen Symbolen gehören zur Übertragung und stehen zwischen allen Symbolen, auch mitten im Wort. Das Leerzeichen gehört zum Text.
- [ ] Das Leerzeichen bekommt automatisch das nächste freie Codewort, es stehen ja 64 zur Verfügung.
  > Automatisch geschieht in einem Code gar nichts. Freie Codewörter sind Platz, keine Zuordnung, und was der Sender selbst vergibt, weiß der Empfänger noch lange nicht.

## Die Blindenschrift Braille schreibt jedes Zeichen als sechs Punkte, und jeder Punkt ist entweder gesetzt oder nicht. Wie viele verschiedene Zeichen lassen sich damit unterscheiden? {#cs-018}

- [ ] 12, also 6 Punkte mal 2 Zustände.
  > Multipliziert wird nicht über die Punkte hinweg, sondern für jeden Punkt einzeln: Jeder der sechs Punkte verdoppelt die Zahl der Muster.
- [ ] 36, also 6 hoch 2.
  > Hier stehen Grundzahl und Hochzahl vertauscht. Die Grundzahl ist, wie viele Zustände eine Stelle hat (zwei), die Hochzahl, wie viele Stellen es gibt (sechs).
- [x] 64, also 2 hoch 6.
  > Genau dieselbe Rechnung wie beim Farbalphabet, nur mit zwei Zuständen und sechs Stellen. Braille ist ein Sechs-Bit-Code, den man mit dem Finger liest.
- [ ] 6, denn jeder Punkt steht für ein Zeichen.
  > Dann käme man mit sechs Zeichen nicht weit. Der Punkt ist die Stelle, nicht das Zeichen; das Zeichen ist das Muster aus allen sechs.

## Ein Team codiert alle Buchstaben mit drei Farbstellen. Ein anderes Team gibt den zehn häufigsten Buchstaben zwei Farbstellen und allen übrigen vier. Welche Aussagen treffen zu? (Mehrere richtige Antworten möglich.) {#cs-019}

- [x] Für gewöhnlichen deutschen Text braucht das zweite Team im Schnitt weniger Farbstellen je Buchstabe.
  > Die zehn häufigsten Buchstaben machen den größten Teil eines Textes aus. Wer ihnen den Rabatt gibt, zahlt für den seltenen Rest gern zwei Stellen mehr. Genau dieser Gedanke steckt hinter Morse und hinter Kompression.
- [ ] Der Code des zweiten Teams ist bei jeder beliebigen Zeichenfolge kürzer.
  > Bei „xyzxyz“ verliert es: vier statt drei Stellen je Buchstabe. Der Vorteil gilt im Schnitt über typischen Text, nicht in jedem Einzelfall.
- [x] Der Code des zweiten Teams ist ohne Trennzeichen lesbar, solange kein kurzes Codewort am Anfang eines langen steht.
  > Das ist der Preis der variablen Länge. Sie ist nicht verboten, sie stellt nur eine Bedingung an die Tabelle, um die sich das erste Team nicht kümmern muss.
- [ ] Der Code des ersten Teams verzichtet auf eine Vereinbarung, weil feste Länge sich von selbst versteht.
  > Feste Länge macht das Abzählen einfach, aber welche drei Farben welchen Buchstaben bedeuten, muss trotzdem in einer Tabelle stehen. Ohne Vereinbarung geht kein Code.
