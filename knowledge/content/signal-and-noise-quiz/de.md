---
title: "Quiz: Signal und Rauschen"
summary: >-
  Achtzehn Fragen dazu, was ein Sensor wirklich liefert, zu Rauschen und
  Mitteln, dem Verhältnis von Abstand zu Streuung, der Zahl der Zeichen, die
  in eine Strecke passen, dem Preis jedes Weges, es zu verbessern, und dazu,
  was eine Messreihe zum Beleg macht. Jede Antwort kommt mit ihrer Begründung.
translation_of: en
based_on: 2026-11-08
---

## Welche Aussagen über die Werte eines Farbsensors, der das Licht einer LED misst, treffen zu? (Mehrere richtige Antworten möglich.) {#me-005}

- [ ] Er liefert drei Werte, Rot, Grün und Blau, passend zu den drei Lämpchen in der LED.
  > Es sind vier: Zu Rot, Grün und Blau kommt der Clear-Kanal, der ungefiltert misst. Die Symmetrie zur LED ist verführerisch, aber der Sensor ist ein anderes Bauteil mit eigener Logik.
- [x] Neben Rot, Grün und Blau gibt es einen vierten, ungefilterten Kanal (Clear).
  > Richtig: Clear misst das gesamte einfallende Licht ohne Farbfilter und ist dadurch empfindlicher als die drei Farbkanäle.
- [x] Die gemessenen Werte entsprechen nicht einfach den RGB-Zahlen, die der Sender an seine LED schickt.
  > Richtig: Überlappende Farbfilter, Abstand und Umgebungslicht verschieben die Werte. Gesendetes (255, 0, 0) kommt nie als (255, 0, 0) an.
- [ ] Bei ausgeschalteter LED liefern alle Kanäle Null, weil ohne Sender kein Licht am Sensor ankommt.
  > Nein: Der Sender ist nicht die einzige Lichtquelle. Umgebungslicht ist immer da, und genau deshalb braucht es die Kontrollmessung als Bezugsgröße.

> Der Sensor liefert vier Zahlen, `r`, `g`, `b` und `c`, und keine davon ist die gesendete.

## Ein Sender schickt (255, 0, 0) an seine LED, der Sensor misst aber r=203, g=41, b=57. Wie gehst du damit um? {#me-007}

- [ ] Den Sensor reklamieren: Ein intakter Sensor müsste bei gesendetem (255, 0, 0) auch (255, 0, 0) anzeigen.
  > Der Sensor ist in Ordnung. Überlappende Farbfilter, Abstand und Umgebungslicht sorgen dafür, dass Messwerte nie den gesendeten Zahlen gleichen.
- [x] Für jede Sendefarbe messen, wie sie ankommt, und künftige Messungen diesen gelernten Mustern zuordnen.
  > Genau: Kalibrieren und klassifizieren. Nicht zurückrechnen, was gesendet wurde, sondern je Farbe das typische Ankunftsmuster lernen und Neues dem nächstliegenden Muster zuordnen.
- [ ] Eine Umrechnungsformel herleiten, die aus den Messwerten die gesendeten RGB-Zahlen exakt zurückrechnet.
  > Verführerisch, aber brüchig: Die Verzerrung hängt von Abstand, Umgebungslicht und Streuung ab und ändert sich mit ihnen. Die Rückrechnung, die heute stimmt, stimmt morgen nicht mehr.
- [ ] Die LED heller einstellen, bis die Messwerte den Sendewerten entsprechen.
  > Die Zahlen leben in verschiedenen Welten: Ansteuerwerte der LED gegen Messwerte des Sensors. Keine Helligkeit macht sie deckungsgleich.

> Kalibrieren, dann klassifizieren: Referenzen bekannter Farben, und jede neue Ablesung geht an die nächstgelegene davon.

## Bevor du die Farben einer LED mit einem Farbsensor vermisst, machst du eine Kontrollmessung: Sensorwerte aufnehmen, während die LED ausgeschaltet ist. Wozu? {#me-003}

- [ ] Um zu prüfen, ob der Sensor überhaupt reagiert, bevor Zeit in die eigentlichen Messungen fließt.
  > Einen Funktionstest nimmt man nebenbei mit, dafür bräuchte es aber keine aufgezeichnete Reihe. Der Zweck liegt in den Werten selbst: Sie sind die Bezugsgröße für alles Folgende.
- [ ] Damit sich der Sensor auf das Umgebungslicht einstellt und es danach von selbst aus den Werten herausrechnet.
  > Der Sensor lernt nichts und rechnet nichts heraus; er liefert weiter Rohwerte samt Raumlicht. Den Bezug zum Nullpunkt stellst du her, in deinem Programm und in deiner Deutung.
- [x] Um zu wissen, was der Sensor durch Umgebungslicht ohnehin misst; erst dagegen lassen sich die Werte bei eingeschalteter LED deuten.
  > Genau: Der Sensor misst nie Null, weil immer Raumlicht da ist. Die Kontrollmessung ist der Nullpunkt, gegen den jede Farbmessung verglichen wird, und sie verrät, wenn sich die Umgebung ändert.
- [ ] Um zu sehen, wie stark die Werte ohne Licht streuen; sobald die LED leuchtet, geht das Rauschen ohnehin im Signal unter.
  > Die Streuung mitzunehmen ist richtig, der Schluss nicht: Das Rauschen verschwindet mit dem Signal nicht, es liegt weiter auf jedem Wert. Und der Hauptzweck bleibt der Nullpunkt, gegen den jede Farbmessung gelesen wird.

> Jede Ablesung enthält Umgebungslicht, das Licht der LED und Rauschen; die Kontrollmessung erfasst den ersten Anteil, damit sich der zweite ablesen lässt.

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

## Warum legst du vor einer Messreihe fest, welches Ergebnis du erwartest, statt einfach zu messen und dann zu schauen? {#me-010}

- [ ] Weil sich die Sensoreinstellungen nur dann sinnvoll wählen lassen, wenn vorher feststeht, welche Werte herauskommen sollen.
  > Die Einstellungen richten sich nach Aufbau und Umgebungslicht, nicht nach dem erhofften Ergebnis. Der Sensor misst mit jeder Einstellung; das Problem entsteht später, beim Deuten der Werte.
- [ ] Damit die Reihe abgebrochen werden kann, sobald das erwartete Ergebnis erreicht ist, und keine überflüssigen Wiederholungen anfallen.
  > Genau das wäre die Verzerrung, die vermieden werden soll: Wer aufhört, sobald es passt, sammelt Belege für die eigene Hoffnung. Die Zahl der Wiederholungen wird vorher festgelegt und durchgezogen.
- [x] Ohne vorher festgelegte Erwartung lässt sich fast jedes Ergebnis hinterher als Erfolg deuten.
  > Genau: Wer erst misst und dann entscheidet, was „gut“ heißt, biegt die Deutung unbemerkt zum Wunschergebnis. Die vorab notierte Erwartung macht aus der Messung einen ehrlichen Ja-Nein-Test.
- [ ] Weil ein Protokoll ohne notierte Erwartung nicht als Messreihe gilt, sondern nur als Sammlung einzelner Werte.
  > Was eine Messreihe ausmacht, sind Wiederholung und festgehaltene Bedingungen, nicht die Erwartung. Die dient nicht der Form, sondern dem Schutz davor, sich selbst zu täuschen.

> Die vorher notierte Erwartung schützt dich davor, hinterher die eigenen Hoffnungen in die Daten zu lesen.

## Eine Gruppe verändert zwischen zwei Messreihen gleichzeitig den Abstand zwischen Sender und Sensor und die Integrationszeit. Die zweite Reihe ist deutlich besser. Was weiß sie jetzt? {#me-002}

- [ ] Dass beide Änderungen geholfen haben, sonst wäre die zweite Reihe nicht so deutlich besser.
  > Die Deutlichkeit belegt nichts über die Verteilung: Es kann eine Änderung allein gewesen sein, und die andere hat vielleicht sogar geschadet, ohne dass es auffiel.
- [x] Dass es besser wurde, aber nicht, woran es lag.
  > Genau das Problem: Zwei gleichzeitig veränderte Größen lassen sich im Ergebnis nicht mehr trennen. Deshalb veränderst du je Messreihe nur eine Größe.
- [ ] Dass der Abstand entscheidend war, denn er wirkt physikalisch stärker.
  > Das ist eine Vermutung im Gewand eines Ergebnisses. Welche Größe wie stark wirkt, war ja gerade die offene Frage.
- [ ] Dass die Reihe nicht verwertbar ist und wiederholt werden muss, bevor sich überhaupt etwas sagen lässt.
  > Ganz so streng ist es nicht: Die Reihe belegt, dass die Kombination hilft. Sie beantwortet nur nicht, welcher Anteil wofür steht; das klären zwei saubere Nachmessungen mit je einer Änderung.

> Verändere je Messreihe genau eine Größe, sonst lässt sich ein Unterschied nicht seiner Ursache zuordnen.

## Was gehört in das Protokoll einer Messreihe? (Mehrere richtige Antworten möglich.) {#me-008}

- [x] Was verändert wurde und was konstant blieb.
  > Richtig: Ohne diese Angabe lässt sich später nicht sagen, worauf ein Unterschied zurückgeht.
- [x] Der Aufbau: Abstand, Umgebungslicht, Sensoreinstellungen.
  > Richtig: Nur mit den Bedingungen ist eine Messung wiederholbar und mit anderen vergleichbar.
- [x] Alle Messwerte, auch die unbequemen.
  > Richtig: Wer nur die schönen Werte notiert, misst nicht, sondern sammelt Belege für die eigene Hoffnung. Ausreißer sind oft die interessanteste Information.
- [x] Wie oft gemessen wurde.
  > Richtig: Ob ein Ergebnis auf 5 oder auf 50 Wiederholungen steht, entscheidet darüber, wie belastbar es ist.

> Ins Protokoll gehören die Bedingungen, die veränderte Größe, die Zahl der Wiederholungen und jeder Wert, damit jemand anderes die Reihe wiederholen könnte.

## Ein Empfänger soll Rot und Blau unterscheiden. Im Test liegt er 5-mal von 5 richtig, und jemand sagt: „Fertig, funktioniert.“ Was ist der Haken? {#me-009}

- [ ] Nichts, fünf Treffer ohne einen einzigen Fehler belegen sauber, dass die Unterscheidung steht.
  > Bei zwei Farben schafft reines Raten fünf Treffer in Folge mit einer Wahrscheinlichkeit von rund drei Prozent. In einem Raum voller Gruppen passiert das ständig irgendwo.
- [x] Fünf Treffer können bei zwei Farben noch Glück sein; erst viele Wiederholungen trennen Können von Zufall.
  > Genau: Raten trifft mit 50 Prozent je Versuch. 5 aus 5 gelingt dem Zufall in etwa jedem 32. Anlauf, 50 aus 50 praktisch nie. Deshalb werden Empfänger mit langen Serien geprüft.
- [ ] Der Test hätte mit mehr als zwei Farben laufen müssen.
  > Die Aufgabe war Rot gegen Blau; mehr Farben sind eine andere, spätere Aufgabe. Der Haken liegt in der kleinen Zahl der Versuche, nicht in der Farbzahl.
- [ ] Fünf Treffer zeigen nur, dass die Schwelle gerade passt; entscheidend ist, wie weit der Mittelwert der Messwerte von der Schwelle entfernt liegt.
  > Der Abstand zur Schwelle ist eine nützliche Größe, aber ein Mittelwert aus wenigen Messungen ist selbst nur ein Wurf. Der Haken bleibt die kleine Zahl der Versuche, nicht die Lage der Schwelle.

> Die Chance auf fünf Treffer in Folge durch Raten ist 0,5⁵ = 1/32, die auf fünfzig eins zu 2⁵⁰.

## Ein KI-Assistent hat vorgeschlagen, die Verstärkung des Sensors zu erhöhen, „das verbessert die Erkennung“. Deine saubere Messreihe zeigt das Gegenteil: Die Erkennungsrate sinkt. Wie gehst du vor? (Mehrere richtige Antworten möglich.) {#me-012}

- [x] Die Messreihe samt Bedingungen dokumentieren.
  > Richtig: Ohne festgehaltene Bedingungen ist der Widerspruch später weder nachvollziehbar noch wiederholbar.
- [ ] Der Messung misstrauen; die KI kennt solche Sensoren besser als du.
  > Falsch herum: Die KI kennt Sensoren dieser Art, aber nicht deinen Aufbau. Die Messung am echten Gerät ist die Ground Truth, zu der kein Sprachmodell Zugang hat.
- [x] Kurz prüfen, ob die Messreihe sauber war: nur eine Größe verändert, genug Wiederholungen, Kontrollmessung vorhanden.
  > Richtig: Bevor du einen Vorschlag als widerlegt ablegst, gehört die eigene Messung auf den Prüfstand. Erst eine saubere Reihe trägt den Widerspruch.
- [x] Den Fall in ein Irrtumsprotokoll aufnehmen: Vorschlag, Messung, Ergebnis.
  > Richtig: Genau dafür ist ein solches Protokoll da. Dokumentierte Fälle, in denen eine Messung einen Vorschlag widerlegt hat, gehören zu dem, woraus du am meisten lernst.
- [ ] Die höhere Verstärkung trotzdem übernehmen, denn eine einzelne widersprechende Messreihe wiegt weniger als eine gut begründete Empfehlung.
  > Die Gewichtung ist verkehrt: Eine Begründung sagt, warum etwas gelten sollte, die saubere Messreihe zeigt, was in deinem Aufbau gilt. Wer gegen die eigene saubere Messung entscheidet, hat das Messen aufgegeben.

> Prüf zuerst die eigene Reihe; war sie sauber, wiegt sie schwerer als der Vorschlag, und der Fall kommt ins Irrtumsprotokoll.

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
