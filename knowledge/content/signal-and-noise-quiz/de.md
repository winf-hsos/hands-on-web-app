---
title: "Quiz: Signal und Rauschen"
summary: >-
  Vierzehn Fragen zu Rauschen, Mitteln, dem Verhältnis von Abstand zu
  Streuung, der Zahl der Zeichen, die in eine Strecke passen, und dem Preis
  jedes Weges, dieses Verhältnis zu verbessern. Jede Antwort kommt mit ihrer
  Begründung.
translation_of: en
based_on: 2026-11-04
---

## Du misst zehnmal hintereinander dieselbe Farbe, ohne irgendetwas zu verändern, und bekommst zehn leicht verschiedene Zahlen. Was bedeutet das? {#sn-001}

- [ ] Der Sensor arbeitet fehlerhaft: Ein intakter Sensor liefert bei gleicher Farbe auch gleiche Zahlen.
  > Ein perfekt funktionierender Sensor verhält sich genauso. Jede Messung enthält Schwankungen, das ist Physik und keine Panne.
- [x] Das ist normal: Jede Messung schwankt, und diese Schwankung heißt Rauschen.
  > Genau. Rauschen ist nicht allein eine Störung von außen, sondern eine Eigenschaft jeder Messung. Interessant ist deshalb nicht, ob es rauscht, sondern wie stark.
- [ ] Das Programm hat einen Fehler, denn ein Computer liefert bei gleicher Eingabe dieselbe Ausgabe.
  > Für das Programm stimmt der Satz, für die Messung nicht: Die Eingabe ist hier das Licht am Sensor, und das ist nie zweimal exakt gleich. Auch ein fehlerfreies Programm gibt schwankende Werte weiter.
- [ ] Die LED flackert unmerklich, und der Sensor bildet dieses Flackern in seinen Werten ab.
  > Die LED hält ihren Wert. Selbst bei völlig gleichbleibendem Licht streuen die Messwerte, weil Sensor, Licht und Umgebung nie exakt gleich sind.

> Rauschen gehört zu jeder Messung, und die Frage ist deshalb nie, ob Messwerte streuen, sondern wie stark.

## Ein verrauschtes Rohsignal wird über Fenster aus 4, 12 und 32 Ablesungen gemittelt, und die gemittelten Werte werden umso ruhiger, je länger das Fenster ist. Was zeigt das? {#sn-002}

- [ ] Dass die gemittelten Werte von einem genaueren Sensor stammen als das Rohsignal.
  > Der Sensor ist für jedes Fenster derselbe. Was sich ändert, ist allein, wie viele Ablesungen in einen Wert eingehen.
- [ ] Dass das Rauschen mit der Zeit von selbst nachlässt, weil sich der Sensor erst einpendeln muss.
  > Das Rohsignal rauscht durchgehend gleich stark, vom ersten bis zum letzten Moment. Ruhiger werden nur die daraus gebildeten Werte, und zwar wegen der längeren Fenster, nicht wegen der verstrichenen Zeit.
- [x] Dass längere Messfenster die Schwankung glätten: Jeder Wert liegt näher am wahren Pegel.
  > Genau: Über ein längeres Fenster mitteln sich die Ausreißer heraus. Der Preis: Längere Fenster liefern weniger Werte und damit weniger Zeichen pro Sekunde.
- [ ] Dass man mit genügend langer Messung jedes beliebige Alphabet sicher übertragen kann.
  > Glätten hilft, aber es kostet Zeit, und die Restschwankung verschwindet nie ganz. Wer beliebig viele Zeichen will, braucht beliebig lange Messungen, und dann ist die Übertragung unbrauchbar langsam.

> Mitteln beruhigt die Werte und kostet Ablesungen pro Sekunde; die Streuung fällt mit der Wurzel aus der Fensterlänge.

## Zwei Gruppen bauen dieselbe Lichtstrecke, mit demselben Sensor und derselben LED. Die eine erreicht ein sicheres Alphabet aus 16 Farben, die andere nur aus 4. Woran liegt der Unterschied in erster Linie? {#sn-003}

- [ ] An der Qualität des Codes, der die Grenzen zwischen den Farben zieht und die Messwerte zuordnet.
  > Der Code entscheidet, wo die Grenzen liegen, aber nicht, wie weit die Messwerte streuen. Sauberer Code allein vergrößert kein Alphabet.
- [ ] An der Verstärkung: Die erste Gruppe hat sie höher gestellt, und mehr Verstärkung liefert feinere Abstufungen.
  > Verstärkung hebt Signal und Rauschen gemeinsam an; der Abstand zwischen den Zeichen wächst, die Streuung aber genauso. Das entscheidende Verhältnis bleibt dabei gleich, und bei zu viel Verstärkung läuft der Sensor in die Sättigung.
- [x] Am Verhältnis von Abstand zwischen den Zeichen zu Streuung der Messwerte: Wer die Streuung kleiner bekommt, bringt mehr Zeichen unter.
  > Genau: Die Größe des Alphabets misst nichts anderes als dieses Verhältnis. Kleiner wird die Streuung durch Abschirmung gegen Umgebungslicht, saubere Optik, festen Abstand und längere Messfenster.
- [ ] Daran, dass die erste Gruppe hellere Farben gewählt hat.
  > Helligkeit allein hilft wenig, wenn die Werte trotzdem breit streuen. Es zählt der Abstand zwischen den Zeichen im Verhältnis zur Streuung, nicht der absolute Pegel.

> Über die Größe eines Alphabets entscheidet das Verhältnis d/s aus dem Abstand der Zeichen und der Streuung der Messwerte.

## Längere Messfenster liefern ruhigere Werte. Warum stellt man die Integrationszeit dann nicht einfach auf den höchsten Wert? {#sn-004}

- [ ] Weil sich bei langem Fenster so viel Licht ansammelt, dass jede Farbe den Höchstwert erreicht und nichts mehr unterscheidbar ist.
  > Sättigung kann vorkommen, ist aber kein Argument gegen lange Fenster an sich: Sie lässt sich über kleinere Verstärkung oder mehr Abstand vermeiden. Der eigentliche Preis wird in einer anderen Währung bezahlt: Zeit.
- [x] Weil jede Messung Zeit kostet: Längere Fenster bedeuten weniger Zeichen pro Sekunde und damit weniger Durchsatz.
  > Genau, und das ist der zentrale Zielkonflikt jeder Strecke mit einem Sensor: Signalqualität gegen Zeichenrate. Deshalb ist die Integrationszeit eine Einstellung, die du misst, statt sie einmal festzulegen und zu vergessen.
- [ ] Weil sich bei langer Messung mehr Störlicht ansammelt und die Werte dadurch ungenauer werden.
  > Störlicht sammelt sich mit, aber das Nutzlicht ebenso, und die Schwankung mittelt sich über das längere Fenster heraus. Die Werte werden ruhiger, nicht ungenauer; das ist ja der Grund für längere Fenster, nur eben langsamer.
- [ ] Weil der Sensor bei langer Integrationszeit keine Farben mehr unterscheidet.
  > Die Farbkanäle arbeiten unabhängig von der Fensterlänge weiter. Was sich ändert, ist nur die Ruhe der Werte und die Zeit, die sie kosten.

> Ruhige Werte bezahlst du mit Zeit, und aus Zeit pro Zeichen besteht der Durchsatz einer Strecke.

## Zwei Farben liefern Messreihen, die sich überlappen: Farbe A streut von 180 bis 240, Farbe B von 220 bis 280. Welche Maßnahmen greifen das Problem an der Wurzel an? (Mehrere richtige Antworten möglich.) {#sn-005}

- [x] Eine der beiden Farben durch eine weiter entfernte ersetzen.
  > Richtig: Das vergrößert den Abstand zwischen den Zeichen, also den Zähler im entscheidenden Verhältnis.
- [ ] Die Grenze genau in die Mitte der Überlappung legen.
  > Das ist die beste Grenze für eine schlechte Lage, aber es beseitigt die Überlappung nicht: Ein Teil der Messungen fällt weiterhin auf die falsche Seite.
- [x] Die Integrationszeit erhöhen, damit die Streuung schrumpft.
  > Richtig, und das ist der Nenner desselben Verhältnisses. Es kostet Zeichenrate, deshalb ist es eine Abwägung und keine Selbstverständlichkeit.
- [x] Den optischen Aufbau verbessern: abschirmen, Röhre, fester Abstand.
  > Richtig: Weniger Fremdlicht und eine stabile Geometrie senken die Streuung, ohne eine einzige Millisekunde Zeichenrate zu kosten. Die beste Sorte Verbesserung.
- [ ] Mehr Farben ins Alphabet aufnehmen, damit die Überlappung weniger ins Gewicht fällt.
  > Das verschärft die Lage: Mehr Farben bedeuten kleinere Abstände, und die Überlappung nimmt zu statt ab.

> Eine Überlappung verschwindet nur, wenn der Abstand wächst oder die Streuung schrumpft, nicht durch eine verschobene Grenze.

## Die Funktion `read_stable()` liest einen Sensor zehnmal über `read_clear()` ab und gibt den Mittelwert zurück. Was bewirkt sie, verglichen mit einer einzelnen Ablesung? {#sn-006}

```python static
def read_stable(n=10):
    values = [read_clear() for _ in range(n)]
    return sum(values) / n
```

- [ ] Sie macht den Sensor genauer, weil er zehnmal so viel Licht sammelt.
  > Der Sensor selbst bleibt unverändert; er misst zehnmal dasselbe. Verbessert wird nur, was das Programm aus den zehn Werten macht.
- [x] Sie mittelt die Schwankung heraus: Der Rückgabewert streut weniger als eine einzelne Ablesung, und die Funktion dauert zehnmal so lang.
  > Genau, und beide Hälften gehören zusammen. Mitteln ist dasselbe Geschäft wie eine längere Integrationszeit: ruhigere Werte gegen Zeit. Wer nur die erste Hälfte sieht, wundert sich über den eingebrochenen Durchsatz.
- [ ] Sie entfernt Ausreißer: Ein einzelner verrutschter Wert fällt im Mittel über zehn Ablesungen nicht mehr ins Gewicht.
  > Ein Mittelwert dämpft Ausreißer, aber er wirft sie nicht weg; ein einzelner starker Ausreißer zieht ihn spürbar mit. Wer Ausreißer wirklich verwerfen will, nimmt den Median.
- [ ] Sie sorgt dafür, dass das gesendete Zeichen zuverlässig erkannt wird, weil der Mittelwert die Schwankung neutralisiert.
  > Sie verbessert die Chancen, garantiert aber nichts: Liegen zwei Zeichen zu dicht beieinander, hilft auch ein ruhiger Mittelwert nicht mehr.

> Mitteln in Software ist dasselbe Geschäft wie eine längere Integrationszeit: ruhigere Werte gegen mehr Zeit je Wert.

## Zwei Wege sollen eine Übertragung beschleunigen: mehr Zeichen ins Alphabet aufnehmen oder schneller messen. Was haben beide gemeinsam? {#sn-007}

- [ ] Beide sind kostenlos, solange die Hardware mitspielt, denn sie ändern nur, wie das Programm die Messwerte deutet.
  > Beide kosten dasselbe, nämlich Sicherheitsabstand zwischen dem, was ankommt, und dem, was noch sicher unterscheidbar ist.
- [ ] Beide erfordern einen empfindlicheren Sensor, weil die vorhandene Hardware feinere Abstufungen nicht auflöst.
  > Ein besserer Sensor verschöbe die Grenze, aber die Struktur des Problems bliebe dieselbe. Auch mit Spitzenhardware gibt es eine Wand, sie steht nur weiter hinten.
- [x] Beide verkleinern den Sicherheitsabstand: einmal über den Abstand zwischen den Zeichen, einmal durch mehr Streuung je Messung. Sie enden an derselben Wand.
  > Genau: Der eine Weg schiebt die Zeichen zusammen, der andere macht die Messwerte unruhiger. In beiden Fällen schrumpft dasselbe Verhältnis, und deshalb begrenzen beide zusammen den Durchsatz.
- [ ] Beide funktionieren nur, wenn das Umgebungslicht konstant bleibt.
  > Konstantes Umgebungslicht hilft immer, ist aber nicht das Gemeinsame der beiden Wege. Ihr gemeinsamer Preis ist der schrumpfende Sicherheitsabstand.

> Mehr Zeichen machen die Bänder schmaler, schnellere Zeichen die Wolken breiter, und beide verbrauchen denselben Spielraum.

## Eine Gruppe dokumentiert ihre Farben mit je einem Mittelwert: rot 210, orange 245, gelb 280. Warum genügt das für die Entscheidung über die Größe des Alphabets nicht? {#sn-008}

- [x] Weil die Mittelwerte nichts darüber sagen, wie weit die einzelnen Ablesungen um sie herum streuen.
  > Genau: 35 Punkte Abstand sind reichlich, wenn die Werte um ±5 schwanken, und hoffnungslos bei ±30. Zu jeder Farbe gehört deshalb ein Streumaß, mindestens der kleinste und der größte beobachtete Wert.
- [ ] Weil ein Mittelwert aus zu wenigen Messungen zufällig zu hoch oder zu tief liegen kann.
  > Das stimmt für kleine Messreihen, trifft aber nicht den Kern: Auch ein aus hundert Messungen ermittelter, verlässlicher Mittelwert sagt nichts über die Streuung. Es fehlt nicht Genauigkeit, es fehlt die zweite Angabe.
- [ ] Weil drei Farben zu wenig für ein brauchbares Alphabet sind; erst ab vier trägt jedes Zeichen zwei Bit.
  > Drei Zeichen sind ein gültiges Alphabet, es trägt knapp anderthalb Bit. Die Frage ist nicht die Anzahl, sondern ob die drei sicher trennbar sind.
- [ ] Weil die Werte offenbar aus dem Clear-Kanal stammen und der für Farben ungeeignet ist.
  > Der Clear-Kanal ist eine legitime und oft robuste Wahl. Auch mit den Farbkanälen bliebe das Problem dasselbe: ohne Streumaß keine Aussage.

> Ein Zeichen beschreiben zwei Zahlen, sein Mittelwert und seine Streuung; der Mittelwert allein kann nicht sagen, ob es brauchbar ist.

## Was heißt es, dass zwei Zustände „sicher unterscheidbar“ sind? {#sn-009}

- [ ] Ihre Mittelwerte sind verschieden, mit deutlichem Abstand, wenn man jede Farbe zehnmal misst.
  > Verschiedene Mittelwerte sind die Mindestbedingung, aber sie genügen nicht: Auch bei verschiedenen Mittelwerten können sich die Messreihen überlappen.
- [x] Ihre Messreihen überlappen nicht: Auch die extremsten Werte des einen liegen noch klar auf seiner Seite der Grenze.
  > Genau, und das ist ein empirischer Befund, kein rechnerischer: Du siehst es erst, wenn du oft genug gemessen hast. Zehn Messungen je Farbe sind das Minimum, mit dem sich das beurteilen lässt.
- [ ] Der Empfänger ordnet sie in mindestens der Hälfte der Versuche der richtigen Seite der Grenze zu.
  > Die Hälfte ist bei zwei Zuständen genau so gut wie Raten. Sicher heißt praktisch immer, nicht öfter als zufällig.
- [ ] Die beiden Farben sehen für das menschliche Auge klar verschieden aus, etwa Rot gegen Grün.
  > Das Auge ist nicht der Empfänger. Zwei für dich deutlich verschiedene Farben können im Sensorwert dicht beieinanderliegen, und umgekehrt.

> Sicher unterscheidbar heißt, dass sich die Wolken nicht berühren, nicht einmal an ihren äußersten Ablesungen.

## Um den Sensor baust du einen passiven optischen Aufbau: Röhren, Blenden, Spiegel, nichts mit Strom. Was bewirkt er messtechnisch? (Mehrere richtige Antworten möglich.) {#sn-010}

- [ ] Er verstärkt das Licht der LED, so wie eine höhere Verstärkung am Sensor die Messwerte anhebt.
  > Passive Optik erzeugt kein Licht und verstärkt es auch nicht. Sie kann es bündeln und führen, aber die LED gibt nicht mehr her als vorher. Ihr Nutzen liegt woanders: weniger Fremdlicht, feste Geometrie.
- [x] Er hält Umgebungslicht fern, das sonst als Störanteil in jeder Messung landet.
  > Richtig, und in einem Raum mit Deckenbeleuchtung ist das der größte Hebel. Weniger Fremdlicht heißt kleinere Streuung, ohne Zeitverlust.
- [x] Er stabilisiert die Geometrie: Abstand und Winkel bleiben zwischen zwei Messungen gleich.
  > Richtig: Ein verrutschtes Gerät verschiebt alle Werte, und sorgfältig vermessene Referenzen stimmen nicht mehr. Reproduzierbarkeit ist die halbe verlässliche Strecke.
- [ ] Er ersetzt die Kalibrierung, weil die Werte mit fester Röhre nicht mehr verrutschen können.
  > Im Gegenteil: Nach jeder Änderung am Aufbau kalibrierst du neu, weil sich alle Pegel verschieben. Deshalb gehören beide Messreihen ins Protokoll, vorher und nachher.

> Abschirmung und feste Geometrie machen die Streuung kleiner, ohne Bits oder Tempo zu kosten.

## Eine andere Gruppe empfiehlt dir ihre Einstellungen für denselben Sensor: „Integrationszeit 50 ms, Verstärkung 4x, damit haben wir 8 Farben geschafft.“ Wie gehst du damit um? {#sn-011}

- [ ] Übernehmen, denn mit derselben Hardware liefern dieselben Einstellungen auch dieselben Ergebnisse.
  > Die Gruppe hat etwas über ihren eigenen Aufbau gezeigt: ihre Optik, ihren Abstand, ihren Platz im Raum. Deine Werte können deutlich abweichen.
- [ ] Nur die Verstärkung übernehmen, denn die hängt vom Sensor ab; die Integrationszeit dagegen vom eigenen Aufbau.
  > Die Trennung hält nicht: Auch die passende Verstärkung hängt davon ab, wie viel Licht am Sensor ankommt, also von Abstand, Optik und Raum. Beide Werte sind fremde Messergebnisse, die als Startpunkt Zeit sparen, aber eigene Messungen nicht ersetzen.
- [x] Als Startpunkt nehmen und dann selbst messen: mehrere Einstellungen durchprobieren und die Trefferquote je Einstellung protokollieren.
  > Genau: Der Kanal ist die einzige verlässliche Instanz, und er ist bei jedem Aufbau ein anderer. Dasselbe gilt für Vorschläge eines KI-Assistenten; auch die sind Hypothesen, keine Messwerte.
- [ ] Die Verstärkung höher stellen als die andere Gruppe, dann werden es mehr als 8 Farben.
  > Mehr Verstärkung verstärkt auch das Rauschen und kann in die Sättigung führen. Ob sie hilft, entscheidet deine Messreihe, nicht die Richtung des Reglers.

> Fremde Einstellungen sind eine Hypothese über deine Strecke, und erst deine eigene Messreihe prüft sie.

## Welche Aussagen über Rauschen treffen zu? (Mehrere richtige Antworten möglich.) {#sn-012}

- [x] Rauschen lässt sich verkleinern, aber nie ganz beseitigen.
  > Richtig: Abschirmung, Optik und längere Messfenster drücken es, aber jede Messung behält eine Restschwankung.
- [x] Wie viel Rauschen stört, hängt vom Abstand zwischen den Zeichen ab.
  > Richtig, und deshalb ist die absolute Streuung allein nie die Antwort. Entscheidend ist immer das Verhältnis von Abstand zu Streuung.
- [ ] Rauschen stammt aus dem Umgebungslicht; in einem abgedunkelten Raum verschwindet es.
  > Umgebungslicht ist ein großer Beitrag, aber nicht der einzige: Auch Sensor und Elektronik rauschen, und im Dunkeln bleibt eine Schwankung übrig.
- [x] Wer schneller misst, bekommt unruhigere Werte.
  > Richtig, und das ist der Zielkonflikt in einem Satz: Ein kürzeres Messfenster sammelt weniger Licht und mittelt weniger, dafür passen mehr Zeichen in dieselbe Sekunde.
- [ ] Ein fehlerkorrigierender Code macht es überflüssig, sich mit Rauschen zu befassen.
  > Fehlerkorrektur hilft gegen die Fehler, die trotzdem passieren, und sie kostet zusätzliche Bits. Sie ersetzt keinen sauberen Aufbau, sie ergänzt ihn.

> Rauschen lässt sich verkleinern, aber nie auf null bringen, und wie sehr es stört, hängt vom Abstand der Zeichen ab.

## Du hast eine Strecke vermessen. Ihr nutzbarer Bereich reicht von 40 bis 840, und jede Farbe streut um ihren Mittelwert herum um ±25. Wie viele Zeichen passen sicher hinein? {#sn-013}

- [ ] 32, denn der Bereich ist 800 breit und die Streuung beträgt 25.
  > Hier ist die Streuung nur einmal gerechnet. Eine Farbe streut in beide Richtungen, ihr Band ist also 50 breit und nicht 25. Mit 32 Zeichen würden sich benachbarte Wolken überlappen.
- [x] 16, denn jedes Zeichen braucht ein Band von 50 (±25), und 800 geteilt durch 50 sind 16.
  > Genau: nutzbarer Bereich geteilt durch die Breite eines Bandes. Und das ist keine Schätzung, sondern eine Rechnung, die du vor dem Ausprobieren machen kannst.
- [ ] 17, denn zwischen 16 Bändern liegen 17 Grenzen.
  > Gezählt werden die Bänder, nicht die Grenzen. Zwischen 16 Bändern liegen übrigens 15 Grenzen, nicht 17.
- [ ] Das lässt sich nicht ausrechnen, dafür muss man die Farben durchprobieren.
  > Ausprobieren musst du am Ende trotzdem, aber die Zahl sagt dir vorher, wo du landen kannst. Wer erst rechnet, spart sich das Durchprobieren von Alphabetgrößen, die nie funktionieren konnten.

> Die Zahl der Zeichen ist der nutzbare Bereich geteilt durch die Breite eines Bandes, und ein Band ist doppelt so breit wie die Streuung.

## Du hast deine Farben am Fenster kalibriert, bei Tageslicht. Später arbeitet die Strecke im abgedunkelten Teil des Raums, mit demselben Gerät und demselben Aufbau. Welche Aussagen treffen zu? (Mehrere richtige Antworten möglich.) {#sn-014}

- [ ] Die gemessenen Mittelwerte gelten weiter, denn die LED sendet dieselben Farben wie vorher.
  > Der Sensor misst nicht die Farbe der LED, sondern alles Licht, das ankommt. Fehlt das Tageslicht, fehlt es in jedem Messwert, und alle Mittelwerte rutschen nach unten.
- [x] Die Grenzen zwischen den Zeichen müssen neu bestimmt werden.
  > Die Grenzen liegen zwischen den alten Mittelwerten, und die stimmen nicht mehr. Eine Grenze, die am Fenster mittig lag, liegt im Dunkeln womöglich neben allen Wolken.
- [x] Die Streuung kann sich ändern, denn weniger Fremdlicht heißt in der Regel ruhigere Werte.
  > Und zwar zu deinen Gunsten: Tageslicht schwankt, mit Wolken und mit vorbeigehenden Leuten. Im Dunkeln wird die Wolke schmaler, und damit passen mehr Zeichen hinein als am Fenster.
- [ ] Das Verhältnis von Abstand zu Streuung bleibt unverändert, weil beide gleich stark mitwandern.
  > Das wäre bequem, stimmt aber nicht. Der Abstand zwischen zwei Farben und die Streuung hängen an verschiedenen Dingen und ändern sich unabhängig voneinander.
- [x] Eine neue Kalibrierung dort, wo die Strecke arbeitet, ist nötig; eine einzelne Kontrollmessung genügt nicht.
  > Eine einzelne Messung sagt nichts über die Streuung, und die Streuung entscheidet. Miss jede Farbe wieder mehrfach, so wie beim ersten Mal.

> Mittelwerte und Streuung gehören zu einem Ort und einem Licht, deshalb wird eine Strecke dort neu kalibriert, wo sie arbeitet.
