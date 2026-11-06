---
title: Codesysteme
summary: >-
  Warum ein Code nichts als eine vereinbarte Tabelle ist, wie ASCII, Unicode
  und UTF-8 aus Buchstaben Zahlen und Bytes machen, wie ein Codebuch für vier
  Farben und 26 Buchstaben entsteht, warum der Empfänger nicht sieht, wo ein
  Zeichen endet, und warum dieselben Bytes Text, Bild und Ton sein können.
objectives:
  intro: "An einer Strecke, die Farben statt Buchstaben sendet, zeigt dir diese Lektion, was aus einem Zeichen eine Folge von Symbolen macht, und danach kannst du:"
  goals:
    - "erklären, warum ein Codesystem eine vereinbarte Tabelle ist und warum zwei leicht verschiedene Tabellen ein falsches Wort statt einer Fehlermeldung liefern"
    - "ASCII, Unicode und UTF-8 unterscheiden und Nummer und Bytes eines Zeichens mit `ord()` und `encode()` nachschlagen"
    - "mit `kⁿ` ausrechnen, wie viele Stellen ein Codewort für ein Alphabet und einen Zeichenvorrat braucht und wie viele Codewörter frei bleiben"
    - "ein Codebuch als Dictionary anlegen, die Tabelle zum Empfangen aus der zum Senden ableiten und entscheiden, was mit einem Zeichen geschieht, das nicht darin steht"
    - "an einem Beispiel zeigen, warum der Empfänger eines Codes mit verschieden langen Wörtern die Grenzen nicht findet, und drei Auswege nennen"
    - "erklären, warum dieselben Bytes als Text, Grauwerte oder Ton gelesen werden können und was entscheidet, welche Lesart gilt"
translation_of: en
based_on: 2026-11-06
---

![Folien: Codesysteme](item:code-systems-slides)

Im British Museum steht eine Granitplatte, im Jahr 196 vor Christus beschrieben,
die dasselbe dreimal sagt: einmal in Hieroglyphen, einmal in demotischer
Schrift, einmal auf Griechisch. Vierzehn Jahrhunderte lang konnte niemand das
obere Drittel lesen, und zwar nicht, weil die Zeichen verloren gewesen wären,
denn die lagen die ganze Zeit offen da, sondern weil die Vereinbarung verloren
war, welches Zeichen was bedeutet. Als Champollion sie in den 1820er-Jahren
schließlich herausfand, hat er den Stein weniger entziffert als eine Tabelle
zurückgewonnen, die zweitausend Jahre zuvor in den Köpfen der Menschen
existiert hatte und dann still außer Gebrauch geraten war. Davon handelt
diese Lektion, und es lohnt sich, das festzuhalten, bevor es um Bytes geht:
Nicht die Zeichen sind die Nachricht, sondern die Vereinbarung. Das
durchgehende Beispiel ist eine Strecke, die Farben statt Buchstaben sendet,
wie in [[symbols-and-information]].

## Die Vereinbarung ist alles

### Was ein Codesystem ist

Ein **Codesystem** ordnet Zeichen Folgen von Symbolen zu, und beide Seiten
haben sich auf diese Zuordnung geeinigt. Das ist schon die ganze Definition.
Damit sie nicht in der Luft hängt, hier eine echte Tabelle: **ASCII**, die
älteste dieser Vereinbarungen, die noch täglich benutzt wird. Das große A ist
65, B ist 66, das kleine a ist 97, und jede dieser Zahlen passt in ein Byte.

![Eine Tabelle mit vier Zeilen. Links die Zeichen A, B, C und a, ein Pfeil zu ihren Zahlen 65, 66, 67 und 97, und rechts dieselben Zahlen als je acht Bits, etwa 0100 0001 für 65. Darunter klein: Ein Code ist keine Verschlüsselung, keine Kompression und kein Programmtext.](media/ascii-letters-are-numbers.de.svg "Vom Zeichen zur Zahl zu den Bits: Alles, was der Rechner tatsächlich speichert, steht in der rechten Spalte.")

Zwei Einzelheiten lohnen einen zweiten Blick. Die 65 ist nicht die Position
des A im Alphabet: Die ersten 32 Plätze der Tabelle gehören den Steuerzeichen,
deshalb fangen die Buchstaben so spät an. Und das kleine a ist 97, eine ganz
andere Zahl und keine Spielart derselben, sodass `A` und `a` für den Rechner
zwei Zeichen sind, die nur für uns verwandt aussehen. Den Buchstaben selbst
gibt es erst wieder, wenn ein Programm die Zahl 65 nimmt, in derselben Tabelle
nachschlägt und die Form zeichnet; zwischen Tastatur und Bildschirm existiert
er als Buchstabe gar nicht. Python schlägt mit `ord()` und `chr()` in beide
Richtungen der Tabelle nach:

```python
print(ord("A"), ord("B"), ord("a"))
print(chr(65), chr(97))
print(format(ord("A"), "08b"))
```

### Derselbe Buchstabe, drei Codesysteme

Wenn ein Code eine Tabelle ist, kann es mehrere davon geben, und es gibt sie.
Dasselbe A ist in ASCII eine Folge von acht Bits, im Morsecode ein Punkt und
ein Strich und in einem Alphabet aus Farben drei Farben hintereinander.

![Links ein großes A, von dem drei Pfeile zu drei Kästen führen: 0100 0001 mit der Beschriftung ASCII, Punkt Strich mit Morse und red green green mit ein Farbcode.](media/code-as-agreement.de.svg "Derselbe Buchstabe unter drei Vereinbarungen: Keine ist richtiger als die anderen, jede ist eine Tabelle, die jemand aufgeschrieben hat und andere übernommen haben.")

Drei Dinge ist ein Code nicht, weil alle drei im Alltag mit ihm verwechselt
werden. Er ist keine Verschlüsselung: Ein Code verbirgt nichts und wird mit
Absicht veröffentlicht, damit beide Seiten ihn benutzen können. Er ist keine
Kompression: Manche Codes sind nebenbei sparsam, aber etwas kleiner zu machen
ist nicht ihr Zweck. Und er ist kein Quelltext, auch wenn beide gleich heißen.

### Wenn die Tabelle zu klein ist

Die 128 Plätze von ASCII reichen für Englisch und für sonst nichts: keine
Umlaute, kein Eurozeichen, kein Griechisch, kein Chinesisch, kein Emoji.

![Sieben Kästen mit den Zeichen A, z, 7, ?, ä, € und π. Unter den ersten vier steht ein Haken, unter den letzten dreien ein Kreuz, ihr Rahmen ist rot. Unter jedem Zeichen steht seine Nummer in Unicode, 65, 122, 55, 63, 228, 8364 und 960, dazu die Zeile: Unicode, eine Nummer für jedes davon. Unten klein: UTF-8 schreibt diese Nummern dann als Bytes, häufige in einem, seltene in bis zu vier.](media/too-small-a-table.de.svg "Kennt ASCII das Zeichen? Drei der sieben Zeichen haben dort keine Nummer, also hat Unicode jedem Zeichen jeder Schrift eine gegeben.")

Die Tabelle war zu klein, also wurde eine größere vereinbart, und dabei lohnt
es sich, zwei Schritte auseinanderzuhalten, weil sie ständig verwechselt
werden. **Unicode** legt fest, welche *Nummer* ein Zeichen hat, und gibt jedem
Zeichen jeder Schrift eine, weit über 100.000 Stück. **UTF-8** legt fest, wie
diese Nummer als *Bytes* aufgeschrieben wird, und zwar mit wechselnder Länge:
Zeichen, die ständig vorkommen, bleiben bei einem Byte, seltenere kosten zwei,
drei oder vier. Das ist derselbe Gedanke, der dem E im Morsecode einen
einzigen Punkt gegeben hat, und er kommt weiter unten wieder, wo er Ärger macht.
`ord()` liefert die Nummer in Unicode, `encode()` die Bytes in UTF-8:

```python
for ch in ["A", "ä", "€", "π"]:
    print(ch, ord(ch), ch.encode("utf-8"), len(ch.encode("utf-8")), "Bytes")
```

### Zwei Tabellen, eine Nachricht

Jetzt der Fehler, der am meisten Zeit kostet, sobald zwei Leute an einer
Strecke arbeiten. Angenommen, beide haben die Codetabelle getrennt abgetippt,
und in einer Abschrift sind die Einträge für n und m vertauscht, während alles
andere übereinstimmt.

![Zwei Tabellen, links der Sender, rechts der Empfänger. Beim Sender ist n gleich 0110 und m gleich 1001, beim Empfänger umgekehrt. Ein Pfeil trägt 0110 von links nach rechts, auf beiden Seiten dieselben Bits. Unter dem Sender: getippt sonne. Unter dem Empfänger in Rot: ausgegeben somme.](media/two-tables-one-message.de.svg "Der Sender schlägt n nach und sendet sein Codewort, und der Empfänger findet für dieselben Bits in seiner Tabelle einen tadellosen Buchstaben, nur nicht den gesendeten.")

Technisch geht dabei nichts schief. Keine Ausnahme wird ausgelöst, keine
Prüfsumme schlägt fehl, kein Byte ist beschädigt: Der Empfänger schlägt jede
Gruppe von Bits nach, bekommt jedes Mal eine gültige Antwort und gibt ein Wort
aus, das genau wie ein Wort aussieht. Du hast `sonne` getippt, heraus kam
`somme`, und das Programm kann es nicht wissen. Das widerspricht dem Gefühl,
dass Rechner sich beschweren, wenn etwas falsch ist, denn sie beschweren sich,
wenn etwas kaputtgeht, und eine falsche Vereinbarung macht nichts kaputt: Sie
wird korrekt ausgeführt, und das Ergebnis ist Unsinn mit sauberem Gesicht.
[[symbols-and-information]] nennt das perfekten Empfang und perfekten Unsinn.

## Ein Codebuch bauen

### Wie viele Stellen je Buchstabe?

Angenommen, die Strecke kennt vier Farben und soll die 26 Buchstaben senden.
Wie lang muss jede Farbfolge sein? Die Rechnung ist die aus
[[place-value-systems]]: Mit *k* Symbolen und *n* Stellen gibt es *k*ⁿ
Codewörter.

![Oben vier farbige Quadrate, das Farbalphabet, und die Zeile 26 Buchstaben zu codieren. Darunter drei Spalten: 1 Stelle ergibt 4 Codes, reicht nicht für 26, mit Kreuz; 2 Stellen ergeben 4 x 4 = 16, reicht nicht für 26, mit Kreuz; 3 Stellen ergeben 4 x 4 x 4 = 64, reicht für 26, mit Haken.](media/positions-per-letter.de.svg "Vier Farben im Alphabet und 26 Buchstaben zu codieren: Eine Stelle ergibt vier Codewörter, zwei ergeben sechzehn, drei ergeben vierundsechzig.")

Zwei Stellen reichen für 26 Buchstaben nicht, drei schon, und 26 Buchstaben
mit drei Farbstellen lassen 38 Codewörter übrig.

### Das Codebuch

![Ein Raster aus 64 Plätzen in acht Reihen zu je acht. Jeder Platz trägt seine Nummer zur Basis 4 von 000 bis 333. Die ersten 26 enthalten die Buchstaben a bis z, die nächsten zwölf, hervorgehoben, das Leerzeichen, den Punkt und die Ziffern 0 bis 9, und die letzten 26 sind leer.](media/codebook-64-slots.de.svg "Vierundsechzig Plätze, jeder mit seiner Nummer zur Basis 4: Die Buchstaben füllen 26 davon, Leerzeichen, Punkt und die zehn Ziffern zwölf weitere, und 26 bleiben leer.")

Das Bild zeigt, was die Rechnung verbirgt: Die Tabelle ist viel leerer, als
sie sich anfühlt. Die übrigen Codewörter sind Vorrat für später und kein
Abfall. Wenn du mittendrin beschließt, auch ein Leerzeichen oder eine Ziffer zu
senden, sind die Plätze schon da, und an keiner Länge muss sich etwas ändern.
Welche Farbfolge zu welchem Platz gehört, entscheidest allein du: Die Plätze
liefert die Rechnung, die Zuordnung ist die Vereinbarung.

### Dieselbe Tabelle in beide Richtungen

Senden heißt, ein Zeichen nachzuschlagen und ein Codewort zu bekommen.
Empfangen heißt, dieselbe Tabelle andersherum zu lesen.

![Zwei Zeilen. Senden: "cab", ein Pfeil in einen Kasten nachschlagen, ein Pfeil zu 002 000 001. Empfangen: 002 000 001, ein Pfeil in einen Kasten rückwärts suchen, ein Pfeil zu "cab". Eine Klammer verbindet beide Zeilen: eine Tabelle.](media/table-both-directions.de.svg "Codieren und Decodieren sind eine Tabelle in zwei Richtungen, hier mit den Codewörtern aus dem Codebuch: a ist 000, b ist 001, c ist 002.")

Solange keine zwei Zeichen dasselbe Codewort haben, ist das Nachschlagen in
Gegenrichtung eindeutig. Im Programm ist die Tabelle ein Dictionary, und die
zum Empfangen leitest du am besten in einer Zeile aus der zum Senden ab, statt
sie ein zweites Mal abzutippen, denn zwei getrennt gepflegte Tabellen sind zwei
Dinge, die auseinanderlaufen können, und wie das aussieht, hast du gerade
gesehen:

```python
code = {"a": "000", "b": "001", "c": "002"}
back = {word: letter for letter, word in code.items()}

sent = [code[ch] for ch in "cab"]
print(sent)
print("".join(back[word] for word in sent))
```

### Was nicht in der Tabelle steht

Eines deckt die Tabelle noch nicht ab, und es zeigt sich in den ersten
Minuten des ersten Tests: ein Zeichen, das nicht darin steht. Jemand tippt ein
Leerzeichen, einen Umlaut, eine Ziffer.

![Oben der Aufruf send("guten morgen") und der Hinweis: Das Codebuch kennt a bis z und sonst nichts. Darunter die zwölf Zeichen in Kästen, unter jedem Buchstaben ein Haken; der Kasten des Leerzeichens ist rot gestrichelt, darunter ein Fragezeichen. Unten drei Kästen: in die Tabelle aufnehmen, vor dem Senden entfernen, mit einer Meldung abbrechen.](media/not-in-the-table.de.svg "Jeder Buchstabe hat ein Codewort, das Leerzeichen hat keins, und das Programm muss damit etwas anfangen.")

Drei Antworten sind vertretbar: das Zeichen in die Tabelle aufnehmen, es vor
dem Senden entfernen oder mit einer klaren Meldung ablehnen. Keine
Entscheidung zu treffen gehört nicht dazu, denn mit einem solchen Zeichen
geschieht so oder so etwas, und dann entscheidet der Zufall oder das Programm
stürzt vor allen ab. Im Dictionary oben löst `code[" "]` einen `KeyError` aus,
was immerhin ein ehrlicher Absturz ist. Und widersteh dem bequemen Gedanken,
ein Leerzeichen sei ja nichts: Für den Text ist es ein Zeichen wie jedes
andere, und ein Empfänger kann keine Lücke erfinden, die nie gesendet wurde.

## Wo endet ein Zeichen?

### Ein Code, der nicht funktioniert

Hier ist ein Code, der harmlos aussieht und nicht funktioniert. Vereinbart, a
sei `0`, b sei `01` und c sei `10`, tippt „a c“ und sendet die Folge `010`.

![Sender und Empfänger haben dieselbe Tabelle a = 0, b = 01, c = 10. Zwischen ihnen die drei Bits 010, ohne Lücken dazwischen. Unter dem Sender: getippt a c. Beim Empfänger zwei Lesarten übereinander: nach dem ersten Bit geschnitten ergeben die Bits a und c, nach dem zweiten Bit b und a.](media/prefix-ambiguity.de.svg "Beide Seiten haben dieselbe Tabelle, und es geht trotzdem schief: Der Empfänger kann die drei Bits nach dem ersten oder nach dem zweiten schneiden, und beide Schnitte halten sich an die Vereinbarung.")

Beide Lesarten folgen der Tabelle, weil der Empfänger nicht sieht, wo ein
Zeichen endet. Er sieht einen Strom von Bits ohne Lücken und weiß nicht, ob
die erste `0` schon ein ganzes Zeichen war oder der Anfang eines längeren. Das
Problem ist nicht, dass die Codewörter verschieden lang sind. Das Problem ist,
dass das Codewort für a der *Anfang* des Codeworts für b ist, sodass nichts im
Strom die Grenze markiert.

### Probier es aus: die Präfix-Falle

In der Präfix-Falle legst du die Codewörter für a, b, c und d selbst fest,
tippst ein Wort und siehst jede Lesart, zwischen denen der Empfänger wählen
müsste. Bring die Liste auf eine einzige, ohne allen Codewörtern dieselbe Länge
zu geben, und bau danach einen Code mit so vielen Lesarten wie möglich.

![Die Präfix-Falle](item:prefix-trap)

### Drei Auswege

Es gibt drei Auswege, und keiner davon ist der offizielle.

![Drei Spalten, jede mit einem Haken. Feste Länge: a = 00, b = 01, c = 10, abzählen statt raten. Ein Trennzeichen: a = Punkt Strich, b = Strich Punkt Punkt Punkt, c = Strich Punkt Strich Punkt, Morse mit Pausen dazwischen. Kein Codewort beginnt ein anderes: a = 0, b = 10, c = 110, lesen, bis es passt.](media/three-ways-out.de.svg "Feste Länge, ein ausdrückliches Trennzeichen oder Codewörter, von denen keines ein anderes beginnt: Alle drei machen die Nachricht lesbar.")

**Feste Länge** ist der einfachste: Jedes Zeichen hat gleich viele Stellen,
also zählt der Empfänger ab, statt zu raten. Ein **Trennzeichen** verwendet
der Morsecode, in Form von Pausen zwischen den Buchstaben. Der dritte Weg ist
der interessante: Beginnt kein Codewort ein anderes, heißt der Code
**präfixfrei**, und er behält verschiedene Längen und lässt sich trotzdem
eindeutig lesen, denn sobald das Gelesene zu einem Eintrag passt, kann es nur
dieser Eintrag sein.

### Was feste Länge kostet

Warum sollte also überhaupt jemand variable Länge wollen, wenn sie so viel
Sorgfalt verlangt?

![Das Wort experiment in zwei Codes als Reihe von Kästen, deren Breite die Zahl der Stellen ist. Fest, drei Stellen für jeden Buchstaben: 30 Stellen, 3,0 je Buchstabe. Variabel, zwei für die häufigen und vier für den Rest: 26 Stellen, 2,6 je Buchstabe. Darunter: die zehn häufigsten Buchstaben im Deutschen, e n i s r a t d h u.](media/fixed-versus-variable.de.svg "Dasselbe Wort in zwei selbst gebauten Codes: drei Farbstellen für jeden Buchstaben gegen zwei für die zehn häufigsten Buchstaben und vier für den Rest.")

Weil feste Länge den Buchstaben, die man ständig sendet, keinen Rabatt gibt.
Gib den zehn häufigsten Buchstaben zwei Stellen und dem Rest vier, und ein
gewöhnliches Wort wird kürzer: `experiment` braucht 26 Stellen statt 30.
Variable Länge ist im Mittel kürzer, aber nicht bei jedem Wort, denn ein Wort
aus lauter seltenen Buchstaben wird länger. Wer diesen Gedanken weit genug
verfolgt, landet bei der Kompression; hier geht es nur darum, dass es eine Wahl
ist und beide Antworten etwas kosten.

## Dieselben Bits, andere Bedeutungen

### Eine Bytefolge, drei Lesarten

Bisher ging es nur um Text, aber nichts an der Überlegung hatte mit Text zu
tun, und hier ist der Beweis. Nimm acht aufeinanderfolgende Bytes aus der Mitte
eines Fotos.

![Links ein kleines Foto eines Papageis mit roter Markierung, ein Pfeil zu acht Kästen mit den Bytes 4D 00 00 B0 24 1E FF 45. Von dort drei Pfeile zu drei Kästen: als Text, M . . . $ . . E; als Grauwerte, acht graue Balken von Schwarz bis Weiß; als Ton, eine Linie durch acht Punkte einer Welle.](media/three-readings.de.svg "Dieselben acht Bytes, auf drei Arten gelesen, und jede Lesart ist technisch einwandfrei.")

Als Text gelesen sind es ein großes M, ein Dollarzeichen, ein großes E und
fünf Zeichen, die kein Editor anzeigen kann, und genau das bekommst du, wenn du
eine Bilddatei versehentlich im Texteditor öffnest. Als Grauwerte gelesen sind
es acht Helligkeiten, als Tonabtastwerte acht Punkte einer Welle. Die Bytes
sagen nicht, welche Lesart die richtige ist, und sie wehren sich gegen keine.
Zeichensalat auf dem Bildschirm ist keine Fehlfunktion, sondern eine korrekt
ausgeführte falsche Vereinbarung.

### Ein Bildpunkt, drei Zahlen

Bilder sind also derselbe Gedanke wie Text mit einer anderen Tabelle. Ein
Bildpunkt sind drei Zahlen zwischen 0 und 255, eine für den Rotanteil, eine für
Grün und eine für Blau.

![Links das Foto mit einer roten Markierung auf einem Bildpunkt, ein Pfeil zu drei Balken: Rot 236, Grün 171, Blau 3. Darunter: dieselbe Farbe hexadezimal, zwei Stellen je Byte, und groß in diesem Goldton #ECAB03.](media/rgb-mixing.de.svg "Ein Bildpunkt des Fotos, seine drei Anteile als Balken und dieselbe Farbe hexadezimal geschrieben.")

Die Anteile werden multipliziert, nicht addiert, weil sich jede Rotstufe mit
jeder Grün- und Blaustufe kombinieren lässt: 256 · 256 · 256 ≈ 16,7 Millionen
Farben, also 24 Bit je Bildpunkt. Die Schreibweise `#ECAB03` ist kein anderes
System, nur eine kürzere Art, dieselben drei Bytes mit je zwei Stellen zu
schreiben, wie in [[place-value-systems|Hexadezimal]]. Eine RGB-LED mischt ihre Farbe aus denselben
drei Anteilen wie ein Bildpunkt auf dem Bildschirm, und ein Farbsensor misst
sie in denselben drei Kanälen zurück.

### Wer sagt, welche Lesart gilt?

Wenn die Bytes nicht sagen, welche Lesart die richtige ist, muss es etwas
anderes tun.

![Drei Kästen. Die Dateiendung: .txt .png .wav. Kopfdaten in der Datei: Der Anfang sagt es. Ein Typfeld: in der Nachricht.](media/who-says-which-reading.de.svg "Drei Wege zu sagen, wie Bytes zu lesen sind, vom schwächsten bis zu dem, den ein Protokoll einbaut.")

Die **Dateiendung** ist der schwächste, denn eine umbenannte Datei ändert
innen nichts. **Kopfdaten** am Anfang der Datei sind verlässlicher: Ein PNG
beginnt zum Beispiel immer mit denselben acht Bytes. Und ein **Typfeld** in
einer Nachricht sagt dem Empfänger, wie der Rest zu lesen ist, damit er nicht
raten muss. Welche Lesart gilt, ist eine weitere Vereinbarung, und ein eigenes
Protokoll braucht sie, sobald es mehr als eine Art von Inhalt sendet.

## Codes ohne Rechner

Für nichts davon brauchte es Strom. Ein Strichcode macht aus Strichbreiten
Ziffern. Die Notenschrift macht aus Lage und Form Tonhöhe und Dauer. Braille
macht aus sechs erhabenen Punkten ein Zeichen, und Louis Braille hat es 1825 mit
sechzehn Jahren entworfen. Die DNA macht aus drei Basen eine Aminosäure, und
diese Tabelle ist bei fast allen Lebewesen der Erde dieselbe, womit sie das
älteste Codesystem dieser Lektion ist und zugleich das bei Weitem
verbreitetste. Keines davon braucht einen Rechner, aber jedes braucht eine
Vereinbarung, und bei zweien lohnt es sich nachzurechnen.

![Drei Spalten. Braille: sechs Punkte, drei davon erhaben, 2 Zustände und 6 Stellen, 2⁶ = 64. DNA: die Basen A, C und G, 4 Basen und 3 Stellen, 4³ = 64. Farbalphabet: drei farbige Quadrate, 4 Farben und 3 Stellen, 4³ = 64.](media/sixty-four-everywhere.de.svg "Zwei Zustände an sechs Stellen, vier Basen an drei Stellen, vier Farben an drei Stellen: drei Systeme ohne jeden Zusammenhang und eine Zahl.")

Braille ist ein Sechs-Bit-Code, den man mit den Fingerspitzen liest: Jeder
Punkt ist erhaben oder nicht, sechs Punkte, 2⁶ = 64 Muster. Die DNA hat vier
Basen und drei Stellen je Aminosäure, 4³ = 64, und das Farbalphabet mit vier
Farben und drei Stellen hat ebenfalls 4³ = 64. Der Zufall ist keiner: Wer eine
feste Zahl von Stellen mit einer festen Zahl von Zuständen je Stelle
kombiniert, rechnet immer dieselbe Rechnung, ob die Stellen Fingerspitzen,
Moleküle oder Lichtblitze sind.

Und damit zurück zur Granitplatte: Schreib die Tabelle einmal auf, für beide
Seiten, und leite alles andere daraus ab.

## Das Wichtigste

- Ein Codesystem ist eine vereinbarte Tabelle von Zeichen zu Folgen von
  Symbolen; die Bits tragen keine eigene Bedeutung.
- ASCII gibt den Zeichen des Englischen die Nummern 0 bis 127, Unicode gibt
  jedem Zeichen jeder Schrift eine Nummer, und UTF-8 schreibt diese Nummern als
  ein bis vier Bytes.
- Zwei leicht verschiedene Tabellen erzeugen keine Fehlermeldung, sondern ein
  falsches Wort, deshalb gibt es die Tabelle einmal, und die Gegenrichtung wird
  aus ihr abgeleitet.
- Mit *k* Symbolen und *n* Stellen gibt es *k*ⁿ Codewörter; vier Farben
  brauchen für 26 Buchstaben drei Stellen, und 38 Codewörter bleiben frei.
- Ein Zeichen, das nicht in der Tabelle steht, braucht eine Entscheidung:
  aufnehmen, entfernen oder mit einer Meldung abbrechen.
- Ist ein Codewort der Anfang eines anderen, findet der Empfänger die Grenzen
  nicht; feste Länge, ein Trennzeichen oder ein präfixfreier Code lösen das.
- Dieselben Bytes sind je nach Tabelle Text, Bild oder Ton, und eine Endung,
  Kopfdaten oder ein Typfeld sagen, was davon gilt.

![Quiz: Codesysteme](item:code-systems-quiz)

## Zum Weiterlesen

[[petzold-code]] baut in den Kapiteln 1 bis 3 einen Code von Grund auf, beginnend
mit einer Taschenlampe, die durchs Fenster blinkt, und kommt bei Morsecode und
Braille an, bevor das erste Byte auftaucht.

Simon Singh: *Geheime Botschaften*. Hanser, 2000 (englisch *The Code Book*,
1999). Das Kapitel über Linear B und die Entzifferung alter Schriften erzählt
die Geschichte des Steins von Rosetta ausführlich und zeigt, was es wirklich
heißt, eine verlorene Tabelle zurückzugewinnen.

Joel Spolsky: „The Absolute Minimum Every Software Developer Absolutely,
Positively Must Know About Unicode and Character Sets (No Excuses!)“, 2003,
<https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/>.
Zwanzig Jahre alt und noch immer die klarste kurze Erklärung, warum Text
kaputt ankommt (englisch).
