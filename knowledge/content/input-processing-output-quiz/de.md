---
title: "Quiz: Eingabe, Verarbeitung, Ausgabe"
summary: >-
  Dreizehn Fragen zum IPO-Kasten: seine drei Teile, der Test, den er
  mitbringt, was ein Sensor wirklich liefert, Ketten und Ebenen von Kästen und
  die zwei Fragen, die jeder Kasten stellt. Jede Antwort kommt mit ihrer
  Begründung.
translation_of: en
based_on: 2026-11-04
---

## Aus welchen drei Teilen besteht nach dem IPO-Modell jedes Teilproblem, das ein Computer lösen kann? {#ipo-001}

- [ ] Planung, Umsetzung, Dokumentation
  > Das beschreibt eine Arbeitsweise, nicht die Form des Problems selbst.
- [ ] Hardware, Software, Daten
  > Das sind Bestandteile eines Computersystems, aber nicht das Muster, nach dem ein lösbares Teilproblem aufgebaut ist.
- [x] Eingabe, Verarbeitung, Ausgabe
  > Genau: Vorn geht etwas hinein, hinten kommt etwas heraus, und dazwischen rechnet die Maschine. Input, processing, output, kurz IPO.
- [ ] Sender, Kanal, Empfänger
  > Das ist das Bild einer Übertragungsstrecke. Sie besteht ihrerseits aus IPO-Kästen, ist aber nicht das Grundmuster selbst.

> Jedes Stück, das ein Computer lösen kann, hat eine Eingabe, eine Verarbeitung und eine Ausgabe.

## Warum bringt ein Kasten mit klarer Eingabe und klarer erwarteter Ausgabe seinen Test gleich mit? {#ipo-002}

- [ ] Weil der Computer bei jedem Aufruf selbst meldet, ob die gelieferte Ausgabe zur Eingabe passt.
  > Die Maschine kennt keine Erwartung. Sie führt aus, was dasteht, und meldet höchstens, dass sie es nicht konnte; ob die Ausgabe passt, vergleichst du, nicht der Computer.
- [x] Weil du eine bekannte Eingabe hineingeben und das Ergebnis mit der erwarteten Ausgabe vergleichen kannst.
  > Genau das ist der Test: bekannte Eingabe, erwartete Ausgabe, Vergleich, mit Ja oder Nein und ohne Deutungsspielraum.
- [ ] Weil man in einem klar geschnittenen Kasten beim Lesen des Codes sofort sieht, welche Zeile welchen Teil der Ausgabe erzeugt.
  > Lesen ist kein Test. Auch ein sauber geschnittener Kasten kann falsch rechnen, und überzeugend aussehender Code rechnet besonders unauffällig falsch; der Schnitt macht Fehler findbar, nicht sichtbar.
- [ ] Weil die Verarbeitung im Kasten dann so überschaubar ist, dass sie kaum noch falsch sein kann.
  > Die Verarbeitung kann beliebig kompliziert sein. Prüfbar bleibt der Kasten trotzdem, solange Eingabe und Ausgabe klar sind.

> Eine bekannte Eingabe und eine erwartete Ausgabe sind schon ein Test, ohne Blick in den Kasten.

## Vor einem Farbsensor mit vier Messkanälen leuchtet eine rote Lampe. Was ist die tatsächliche Eingabe, mit der ein Empfängerprogramm arbeitet? {#ipo-003}

- [ ] Die Farbe Rot, so wie sie auch ein Mensch sieht, der neben dem Sensor steht.
  > So erlebt es ein Mensch. Das Programm bekommt keine Farbe, sondern das, was der Sensor liefert, und das sind Zahlen.
- [ ] Das Wort "red", das der Sensor als erkannte Farbe an das Programm meldet.
  > Der Sensor erkennt nichts, er misst. "red" ist die Ausgabe, die das Programm aus den Messwerten erst erzeugen muss, und genau diese Entscheidung ist seine Verarbeitung.
- [x] Vier Zahlen: die Anteile von Rot, Grün und Blau und die Gesamthelligkeit.
  > Genau: Der Sensor liefert vier Messwerte, etwa r=203, g=41, b=57, c=310. Was davon als Rot gilt, entscheidet das Programm aus den Zahlen.
- [ ] Ein kleines Bild der Lampe, aus dem das Programm die Farbe an der hellsten Stelle abliest.
  > Ein Farbsensor ist keine Kamera. Er hat keine Bildpunkte, sondern misst das einfallende Licht als Ganzes und liefert genau vier Zahlen, kein Bild.

> Die Eingabe des Kastens ist das, was der Sensor liefert, und die Entscheidung ist die Arbeit des Programms.

## Eine Strecke überträgt Text mit Licht als Kette von Kästen. Welche Aussagen treffen zu? (Mehrere richtige Antworten möglich.) {#ipo-004}

```text
"hi" → encode() → Farben → Licht → Sensor → decode() → "hi"
```

- [x] Die Ausgabe von `encode()` ist die Eingabe des nächsten Kastens.
  > Richtig, genau das heißt, Kästen zu verbinden: Die Ausgabe des einen wird zur Eingabe des nächsten.
- [x] Sender und Empfänger müssen vorher vereinbaren, welche Farbe für welchen Buchstaben steht.
  > Richtig: `encode()` macht aus Buchstaben Farben und `decode()` aus Farben wieder Buchstaben, also brauchen beide dieselbe Tabelle, etwa „h“ ist Rot. Ohne sie sieht der Empfänger Farben, kann sie aber nicht lesen.
- [ ] `decode()` kann unabhängig davon arbeiten, was `encode()` macht.
  > Falsch: `decode()` muss genau die Vereinbarung umkehren, nach der `encode()` kodiert hat; die beiden sind über diese gemeinsame Tabelle gekoppelt.
- [x] Die Kette zeigt, in welcher Reihenfolge die Daten durch das System fließen.
  > Richtig: Kästen in einer Reihe zeigen den Datenfluss, von der Nachricht bis zur Nachricht.
- [ ] Die Kästen lassen sich in beliebiger Reihenfolge anordnen, solange jeder vorkommt.
  > Falsch: Jeder Kasten braucht genau das, was der Kasten davor liefert. `decode()` kann nicht mit dem Text „hi“ anfangen, es braucht die Messwerte des Sensors, also gehört die Reihenfolge zur Kette.

> Kästen in einer Reihe zeigen den Datenfluss, und Sender und Empfänger passen nur zusammen, wenn sie dieselbe Vereinbarung nutzen.

## Betrachte diese Funktion als IPO-Kasten. Was sind ihre Eingabe und ihre Ausgabe? {#ipo-005}

```python static
def encode(text):
    colours = []
    for letter in text:
        colours.append(colour_for(letter))
    return colours
```

- [x] Die Eingabe ist ein Text, die Ausgabe eine Liste von Farben.
  > Richtig: `text` geht hinein, jeder Buchstabe fügt der Liste eine Farbe hinzu, und `colours` kommt heraus. Das ist der Kasten des Senders.
- [ ] Die Eingabe ist eine Liste von Farben, die Ausgabe ein Text.
  > Das wäre die Gegenrichtung, also `decode()` beim Empfänger. Hier ist es andersherum, denn der Parameter ist der Text.
- [ ] Die Eingabe ist Licht, die Ausgabe sind vier Sensorwerte.
  > Das beschreibt den Sensor, einen anderen Kasten der Kette. Diese Funktion arbeitet nur mit Text und Farben.
- [ ] Die Eingabe ist ein einzelner Buchstabe, die Ausgabe eine einzelne Farbe.
  > Das beschreibt `colour_for`, den kleinen Kasten im Inneren. Die Funktion `encode` bekommt einen ganzen Text und läuft mit der Schleife über jeden Buchstaben; heraus kommt die Liste aller Farben.

> Die Parameter einer Funktion sind ihre Eingabe, ihr Rückgabewert ist ihre Ausgabe, und ein Aufruf darin ist ein kleinerer Kasten.

## Du willst einen Kasten `classify()` prüfen, der aus vier Sensorwerten eine Farbe entscheidet. Welcher Test passt zum IPO-Modell? {#ipo-006}

- [ ] `classify()` eine Stunde lang mit laufenden Messwerten arbeiten lassen und schauen, ob es ohne Absturz durchhält.
  > Ein Dauerlauf prüft die Stabilität, aber nicht, ob die Entscheidung stimmt. Ohne erwartete Ausgabe ist es kein IPO-Test.
- [ ] `classify()` mit zufälligen Zahlen aufrufen und prüfen, dass keine Fehlermeldung kommt.
  > „Keine Fehlermeldung“ heißt nur, dass die Maschine ausführen konnte, was dastand. Ob die Farbe stimmt, sagt das nicht.
- [x] Gespeicherte Messwerte, die sicher bei roter Lampe entstanden sind, hineingeben und prüfen, ob "red" herauskommt.
  > Genau: bekannte Eingabe, erwartete Ausgabe, Vergleich. Der Kasten wird an Daten geprüft, deren Wahrheit du kennst.
- [ ] Den Quelltext von `classify()` Zeile für Zeile lesen und jede Bedingung im Kopf mit Beispielwerten nachvollziehen.
  > Lesen hilft beim Verstehen, ersetzt aber keinen Test, denn auch überzeugend aussehender Code kann falsch entscheiden.

> Ein Test braucht Eingaben, deren richtige Ausgabe du vorher kennst.

## Aus dem IPO-Kasten ergeben sich zwei Fragen: Wie arbeitet der Kasten, und wie werden Eingabe und Ausgabe für die Maschine dargestellt? Welche davon beantwortet ein Programm? {#ipo-007}

- [ ] Beide: Ein Programm legt auch fest, wie Farben und Zeichen dargestellt werden.
  > Verlockend, aber die Darstellung ist eine eigene Entscheidung über Symbole und Codes, die vor dem Programm fällt; das Programm setzt sie nur um.
- [x] Die Frage der Verarbeitung: Ein Programm beschreibt, wie der Kasten arbeitet.
  > Genau: Ein Programm ist das, was im Kasten geschieht. Die Frage der Darstellung bleibt offen und wird mit Messwerten, Symbolen und Codesystemen beantwortet.
- [ ] Die Frage der Darstellung: Ein Programm legt fest, wie Daten aussehen.
  > Andersherum: Wie Daten dargestellt werden, ist gerade die Frage, die ein Programm nicht beantwortet. Es arbeitet mit einer Darstellung, die vorher vereinbart wurde.
- [ ] Keine von beiden: Programme sind ein eigenes, drittes Thema.
  > Programme sind kein drittes Thema, sondern die Antwort auf die erste Frage, und deshalb führt das Thema IPO direkt zu der Frage, was ein Programm ist.

> Programme beantworten, wie ein Kasten arbeitet; die Darstellung beantwortet, was seine Ränder überquert.

## Dasselbe IPO-Modell erscheint auf mehreren Ebenen. Welche Aussagen treffen zu? (Mehrere richtige Antworten möglich.) {#ipo-008}

```text
System:      Nachricht → Sender   → Licht
Funktion:    Text      → encode() → Farben
Logikgatter: 1, 1      → AND      → 1
```

- [x] Von außen betrachtet ist der ganze Sender ein einziger Kasten: Nachricht hinein, Licht heraus.
  > Richtig: `send()` ist dann der Name für die gesamte Verarbeitung im Inneren.
- [x] Öffnest du den Kasten, wird seine Verarbeitung zu einer Kette kleinerer Kästen mit eigenen Eingaben und Ausgaben.
  > Richtig, und jeder dieser kleineren Kästen lässt sich einzeln prüfen, was die Ebenen so nützlich macht.
- [ ] Ein einzelnes Logikgatter ist zu klein für das IPO-Modell, weil es nichts verarbeitet, sondern nur Strom durchlässt oder sperrt.
  > Falsch: Durchlassen oder Sperren nach einer festen Regel ist bereits Verarbeitung. Ein UND-Gatter hat Eingaben, zwei Wahrheitswerte, eine Verarbeitungsregel und eine Ausgabe; es hat dieselbe Form in anderer Auflösung.
- [x] Welche Ebene die richtige ist, hängt von der Frage ab, die du gerade untersuchst.
  > Richtig: Wer das ganze System testet, braucht andere Eingaben und Ausgaben als jemand, der nur `encode()` untersucht.

> Die Form bleibt auf jeder Ebene gleich, und die richtige Ebene ist die, auf der sich deine Frage prüfen lässt.

## Eine Textübertragung über eine Lichtstrecke liefert am Ende falschen Text. Was ist nach dem Kastenmodell der sinnvollste nächste Schritt? {#ipo-009}

- [ ] Die ganze Übertragung so oft wiederholen, bis der Text stimmt.
  > Wiederholen ohne Eingrenzen prüft immer denselben großen Kasten, und selbst wenn es einmal klappt, weißt du nicht, was vorher falsch war.
- [x] Den großen Kasten öffnen und einen inneren Kasten, etwa `encode()`, für sich mit bekannter Eingabe prüfen.
  > Genau: Eine Ebene tiefer haben die kleinen Kästen eigene Eingaben und Ausgaben und lassen sich einzeln prüfen, sodass aus „irgendwo falsch“ ein „hier falsch“ wird.
- [ ] Den Quelltext von Sender und Empfänger nebeneinanderlegen und die Stelle suchen, an der die Vereinbarung nicht zusammenpasst.
  > Lesen kann helfen, ersetzt aber keine Prüfung: Ob `encode()` wirklich liefert, was im Code zu stehen scheint, zeigt erst ein Aufruf mit bekannter Eingabe. Und der Fehler kann in einem Kasten stecken, der gar kein Code ist, etwa im Sensor.
- [ ] Den Abstand zwischen Sender und Empfänger verändern und erneut senden.
  > Das ändert eine Bedingung der Umgebung, prüft aber keinen Kasten, und wenn es zufällig hilft, bleibt die Ursache unbekannt.

> Folge den Daten und prüfe eine Grenze nach der anderen, bis du den Kasten findest, an dem sie zuerst falsch werden.

## Warum „sieht“ der Computer keine Farbe, sondern nur Zahlen? {#ipo-010}

- [ ] Weil der Farbsensor zu billig ist; ein besserer würde Farben direkt liefern.
  > Auch der beste Sensor liefert Messwerte, also Zahlen. Der Unterschied liegt in der Genauigkeit, nicht in der Art der Lieferung.
- [x] Weil eine Maschine nur mit Dingen arbeiten kann, die in einer verarbeitbaren Darstellung vorliegen, meistens als Zahlen.
  > Genau die Kernaussage: Bevor ein Computer mit etwas arbeiten kann, muss es dargestellt sein. Deine Augen sehen Rot, der Kasten sieht 203, 41, 57, 310.
- [ ] Weil der Umweg über Zahlen eine Eigenheit der Programmiersprache ist; eine Sprache mit eingebautem Farbtyp würde die Farbe direkt sehen.
  > Mit der Programmiersprache hängt das nicht zusammen. Auch ein eingebauter Farbtyp wäre nur eine Darstellung, mit Zahlen darunter, und die Frage liegt deshalb tiefer als Python.
- [ ] Weil die Lampe nie reines Rot ausstrahlt.
  > Das ist ein echtes Messproblem, erklärt aber nicht das Prinzip: Selbst reinstes Rot käme als Zahlen an.
- [ ] Weil er die Farbe sehr wohl erkennt, sie intern aber als Zahlen ablegt und deshalb nur so weitergeben kann.
  > Die Reihenfolge stimmt nicht: Es gibt kein Erkennen, das vor den Zahlen läge. In der Maschine gibt es kein Sehen im menschlichen Sinn, nur die vier Zahlen und das, was das Programm daraus entscheidet.

> Ein Computer arbeitet nur mit Darstellungen, und die Bedeutung kommt aus der Regel im Programm.

## Auch ein KI-Assistent ist ein IPO-Kasten: Deine Worte gehen hinein, Code kommt heraus, und hineinsehen kannst du nicht. Was folgt daraus? {#ipo-011}

- [ ] Der Kasten ist fertig und muss nicht mehr geprüft werden.
  > Das Gegenteil folgt: Gerade weil du nicht hineinsehen kannst, muss seine Ausgabe umso gründlicher geprüft werden.
- [ ] Die Eingabe spielt kaum eine Rolle: Der Assistent liefert zu jeder Frage ähnlich guten Code, egal wie du sie stellst.
  > Nein, die Eingabe gehört dir: Deine Worte bestimmen, was herauskommt, und ein vager Auftrag liefert vage Ergebnisse. Deshalb lohnt es sich, Aufträge klein und prüfbar zu formulieren.
- [x] Du kennst die Eingabe und prüfst die Ausgabe, weil dir die Verarbeitung verschlossen ist.
  > Genau: Die Verarbeitung ist unzugänglich, aber Eingabe und Ausgabe gehören dir, und geprüft wird am Ausgang.
- [ ] Der Kasten arbeitet am schnellsten, also sollte möglichst viel Arbeit dorthin.
  > Dass er verschlossen ist, sagt nichts über sein Tempo. Daraus folgt nicht mehr Arbeit für den Kasten, sondern mehr Prüfung seiner Ausgabe.

> Mit einem Test musst du einem Kasten, in den du nicht hineinsehen kannst, nicht vertrauen.

## Welcher der folgenden Aufrufe ist ein Test mit eingebauter Erwartung? {#ipo-012}

```python static
def to_signal(brightness):
    if brightness > 100:
        return "on"
    return "off"
```

- [x] `to_signal(150)` aufrufen und prüfen, dass `"on"` herauskommt.
  > Genau: bekannte Eingabe, 150, erwartete Ausgabe, `"on"`, denn 150 ist größer als 100, und ein Vergleich. Ein Ergebnis mit Ja oder Nein, ohne Deutung.
- [ ] `to_signal(150)` aufrufen und sich das Ergebnis ansehen.
  > Fast, aber die Erwartung fehlt: Wer vorher nicht festlegt, was herauskommen muss, nickt hinterher alles ab.
- [ ] `to_signal()` mit vielen verschiedenen Werten aufrufen, um die Funktion gut auszulasten.
  > Viele Aufrufe ohne Erwartungen sind viel Beschäftigung ohne Prüfung. Erst eine erwartete Ausgabe je Eingabe macht Tests daraus.
- [ ] Prüfen, dass der Aufruf keine Fehlermeldung erzeugt.
  > „Läuft ohne Fehler“ heißt nur, dass die Maschine ausführen konnte, was dastand. Eine Funktion kann ohne jeden Fehler das Falsche zurückgeben.

> Die Erwartung steht vor dem Ergebnis; ohne sie ist ein Aufruf kein Test.

## Was gehört zur Eingabe des Kastens `classify()`, der aus den Messwerten eines Sensors eine Farbe entscheidet? {#ipo-013}

- [ ] Die erkannte Farbe, zum Beispiel "red".
  > Das ist die Ausgabe: Die Farbe ist das Ergebnis der Entscheidung, nicht ihr Ausgangsmaterial.
- [x] Die vier Messwerte des Sensors.
  > Richtig: Die vier Zahlen sind alles, was der Kasten bekommt.
- [ ] Der Quelltext von `classify()`.
  > Der Quelltext ist die Verarbeitung selbst, das Innere des Kastens, keine Eingabe.
- [ ] Die Farbe, wie ein Mensch sie sieht.
  > Was Menschen sehen, erreicht den Kasten nie. Er bekommt nur die Darstellung, die der Sensor liefert, und das sind Zahlen.

> Eingabe, Verarbeitung und Ausgabe sind drei verschiedene Dinge: Messwerte, Regel und Entscheidung.
