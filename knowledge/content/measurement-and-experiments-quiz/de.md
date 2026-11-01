---
title: "Quiz: Messen und Experimentieren"
summary: >-
  Zwölf Fragen dazu, was ein Sensor wirklich liefert, warum Messwerte streuen,
  wozu Kontrollmessung und Integrationszeit dienen und was eine Messreihe zum
  Beleg macht. Jede Antwort kommt mit ihrer Begründung.
objectives:
  intro: "Mit diesem Quiz prüfst du in zwölf Fragen, ob du Folgendes kannst:"
  goals:
    - "begründen, warum nur eine Messung am Aufbau selbst entscheidet, wie er sich verhält, und keine Erklärung und kein Vorschlag"
    - "erklären, warum ein Farbsensor vier Werte liefert, die nie dem Gesendeten entsprechen, und warum du kalibrierst, statt zurückzurechnen"
    - "erklären, was eine Kontrollmessung bei ausgeschalteter LED und eine kürzere Integrationszeit mit den Messwerten machen"
    - "benennen, was eine Messreihe ausmacht und was in ihr Protokoll gehört"
    - "eine Glückssträhne an der Zahl der Wiederholungen von einem belastbaren Ergebnis unterscheiden"
translation_of: en
based_on: 2026-11-01
---

## Ein KI-Assistent schlägt vor, die Integrationszeit eines Sensors zu verdoppeln, „dann werden die Werte besser“. Warum genügt diese Auskunft nicht? {#me-001}

- [ ] Weil der Vorschlag aus allgemeinem Wissen über Sensoren stammt; erst die Bestätigung durch eine fachkundige Person macht ihn belastbar.
  > Eine zweite Meinung ist wieder nur eine Meinung. Auch die fachkundigste Person kennt genau diesen Aufbau nicht; belastbar wird der Vorschlag allein durch die Messung daran.
- [ ] Weil der Assistent nicht erklärt, warum ein längeres Fenster ruhigere Werte liefert; mit einer schlüssigen Begründung wäre die Auskunft ausreichend.
  > Eine schlüssige Erklärung ersetzt keine Messung. Sie sagt, warum etwas passieren sollte, nicht ob es in diesem Aufbau passiert und wie stark. Genau das ist der Fehlschluss, Nachdenken für Messen zu halten.
- [x] Weil niemand außer dem Aufbau selbst weiß, wie sich der Aufbau verhält; das entscheidet eine Messung.
  > Genau: Der physikalische Kanal ist die Ground Truth, zu der kein Sprachmodell Zugang hat. Ob „besser“ stimmt, zeigt nur eine Messreihe vor und nach der Änderung.
- [ ] Weil sich „besser“ erst beurteilen lässt, wenn der Assistent auch vorhersagt, welche Werte der Sensor nach der Änderung liefern wird.
  > Eine Vorhersage ist wieder nur eine Behauptung, nur eben mit Zahlen. Ob sie stimmt, entscheidet dieselbe Messreihe, die auch den ursprünglichen Vorschlag prüfen müsste.

> Vorschlag, Erklärung und Vorhersage sind alle Behauptungen, und erst eine Messung am Aufbau selbst macht aus einer von ihnen einen Beleg.

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

## Du misst fünfmal hintereinander dieselbe rote LED und bekommst für den Rotanteil: 198, 205, 201, 195, 206. Was folgt daraus? {#me-004}

- [ ] Der Sensor ist defekt, sonst käme fünfmal derselbe Wert.
  > Streuung ist der Normalfall jeder echten Messung: Rauschen von Sensor, Licht und Umgebung. Fünf identische Werte wären eher verdächtig.
- [x] Messwerte streuen; wer einen stabilen Wert braucht, mittelt über mehrere Messungen.
  > Genau: Der Einzelwert springt, der Mittelwert (hier etwa 201) liegt ruhig. Deshalb liest du mehrfach ab und mittelst, statt einer einzelnen Messung zu glauben. Und die Streuung selbst ist ein Ergebnis: Sie gehört mit ins Protokoll, denn sie entscheidet später darüber, wie viele Farben sich unterscheiden lassen.
- [ ] Die LED wird beim Messen langsam schwächer.
  > Die Werte gehen rauf und runter, nicht stetig bergab. Das ist Rauschen, kein Trend.
- [ ] Nur der letzte Wert zählt, denn da war der Sensor eingeschwungen.
  > Auch der letzte Wert ist nur ein Wurf aus derselben Streuung. Er ist nicht wahrer als die anderen vier.

> Eine einzelne Ablesung ist ein Wurf; der Mittelwert mehrerer liegt ruhig, und die Streuung um ihn ist ein eigenes Ergebnis.

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

## Ein Sensor kann dasselbe Licht mit langen, mittleren oder kurzen Ablesefenstern lesen. Eine Gruppe will schneller senden und verkürzt dafür die Integrationszeit des Sensors stark. Was ist zu erwarten? {#me-006}

- [ ] Die Werte bleiben so ruhig wie zuvor und kommen häufiger; das Fenster legt nur fest, wie oft der Sensor einen neuen Wert liefert.
  > Die Häufigkeit stimmt, die Ruhe nicht: Das Fenster bestimmt auch, über wie viel Licht ein Wert mittelt. Kürzer heißt weniger Licht je Wert, und das Rauschen schlägt stärker durch.
- [ ] Die Werte werden ruhiger, weil der Sensor weniger Zeit hat zu rauschen.
  > Andersherum: Ein kurzes Fenster mittelt über weniger Licht, also schlägt das Rauschen stärker durch, und einzelne kurze Ablesungen rutschen in den Nachbarbereich.
- [x] Mehr Messungen pro Sekunde, aber stärker streuende Werte; einzelne können in den falschen Bereich rutschen.
  > Genau der Zielkonflikt: kurze Fenster für eine hohe Zeichenrate gegen lange Fenster für ruhige Werte. Wo ein Aufbau seine Grenze hat, klärt nur eine Messreihe.
- [ ] Die Werte streuen stärker, dafür sinkt auch die Zahl der Messungen pro Sekunde.
  > Halb richtig, halb falsch: Die Streuung steigt, aber ein kürzeres Fenster erlaubt mehr Ablesungen pro Sekunde, nicht weniger. Sonst gäbe es keinen Zielkonflikt.

> Länger ist ruhiger und kürzer ist schneller: Die Integrationszeit tauscht ruhige Werte gegen Tempo.

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

## Was macht eine Messreihe aus, im Unterschied zu einer einzelnen Messung? {#me-011}

- [ ] Dass mit besonderer Sorgfalt gemessen wird: ruhiger Aufbau, sauber eingestellter Sensor, und jeder Wert wird sofort notiert.
  > Sorgfalt gehört dazu, macht aber noch keine Reihe: Auch eine einzelne, sorgfältige Messung bleibt ein Wurf. Der Unterschied liegt in Wiederholung, festgehaltenen Bedingungen und der einen veränderten Größe.
- [x] Mehrere Messungen unter gleichen, festgehaltenen Bedingungen, bei denen gezielt höchstens eine Größe verändert wird.
  > Genau: Wiederholung fängt die Streuung ein, die festgehaltenen Bedingungen machen sie wiederholbar, und die eine veränderte Größe macht Unterschiede deutbar.
- [ ] Möglichst viele Messungen bei möglichst vielen verschiedenen Einstellungen, damit sich hinterher jeder Zusammenhang aus den Daten ablesen lässt.
  > Viel messen allein ergibt einen Datenhaufen. Wenn sich zwischen zwei Werten mehrere Größen zugleich geändert haben, lässt sich hinterher kein Zusammenhang mehr sauber zuordnen; deshalb je Reihe nur eine Größe.
- [ ] Dieselbe Messung zu verschiedenen Tageszeiten, damit sich zufällige Schwankungen im Mittel aufheben.
  > Wiederholen ist richtig, aber zu verschiedenen Tageszeiten ändert sich ungeplant das Umgebungslicht. Dann wandern die Bedingungen mit, und keiner weiß, ob ein Unterschied vom Zufall oder vom Licht kommt.

> Wiederholung, festgehaltene Bedingungen und eine veränderte Größe machen aus einzelnen Ablesungen eine Messreihe.

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
