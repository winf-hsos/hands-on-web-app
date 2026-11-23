---
title: "Quiz: Abtastung und Synchronisation"
summary: >-
  Fünfzehn Fragen dazu, warum eine schnellere Strecke früher bricht, zu
  Uhren, die auseinanderlaufen, und zum Messfenster des Sensors, zu Marken und
  ihrem Preis, zu echten Verbindungen von der seriellen Schnittstelle bis zum
  Mausrad und zum Wechsel als Takt und seinem Preis in Bits. Jede Antwort kommt
  mit ihrer Begründung.
translation_of: en
based_on: 2026-11-23
---

## Achtzig Musikerinnen und Musiker beginnen gemeinsam, aber ohne Dirigent; nach einer Minute spielen sie nicht mehr zusammen. Gibt jemand immer wieder den Schlag vor, bleiben sie zusammen. Was zeigt das? {#ca-002}

- [ ] Der Einsatz war nicht deutlich genug; mit einem klareren gemeinsamen Start hätte das Orchester zusammengehalten.
  > Auch mit dem deutlichsten Start läuft es auseinander: Jeder hat sein eigenes Tempo, und kleine Unterschiede summieren sich mit jedem Schlag. Ein besserer Anfang verschiebt das Auseinanderlaufen nur, er verhindert es nicht.
- [x] Eine Absprache am Anfang reicht nicht; wiederkehrende Marken halten zwei Uhren zusammen.
  > Genau, und für Rechner gilt dasselbe, nur langsamer: Ein gemeinsamer Start trägt eine Weile, dann braucht es entweder regelmäßige Marken oder ein Verfahren, das ganz ohne gemeinsame Uhr auskommt.
- [ ] Menschen halten keinen Takt, Rechner mit Quarzuhr schon; für zwei Geräte genügt deshalb der gemeinsame Start.
  > Rechneruhren laufen ebenfalls auseinander, nur um Größenordnungen langsamer. Genau deshalb fällt es bei einem Symbol pro Sekunde nicht auf und bei zehn schon.
- [ ] Jedes Mitglied bräuchte nur ein eigenes Metronom, alle auf dasselbe Tempo gestellt.
  > Ein eigenes Metronom ist eine eigene Uhr, und auch achtzig Metronome laufen auseinander, nur langsamer als Menschen. Zusammen hält erst ein Schlag, den alle von derselben Stelle bekommen.

## Eine Strecke sendet Farben mit einer LED und liest sie mit einem Farbsensor. Bei einem Symbol pro Sekunde läuft sie stabil, bei zehn pro Sekunde bricht sie zusammen. Welche Ursachen stecken dahinter? (Mehrere richtige Antworten möglich.) {#ca-001}

- [x] Die Uhren von Sender und Empfänger laufen auseinander, und der Fehler summiert sich über die Symbole.
  > Richtig: Zwei Uhren laufen nie exakt gleich. Bei zehn Symbolen pro Sekunde ist ein Symbol nur 100 ms lang, und schon eine kleine Abweichung je Symbol schiebt den Messzeitpunkt nach wenigen Sekunden ins Nachbarsymbol.
- [ ] Die LED braucht Zeit zum Umschalten, und bei zehn Farbwechseln pro Sekunde kommt sie nicht mehr hinterher.
  > Eine LED schaltet in Mikrosekunden, zehn Wechsel pro Sekunde sind für sie nichts. Die Grenze liegt beim Messen, nicht beim Leuchten.
- [x] Wird ein Symbol kürzer als das Messfenster des Sensors, mischt er zwei Symbole zu einem Wert.
  > Richtig, und das ist das zweite, oft übersehene Problem: Der Sensor mittelt über seine Integrationszeit. Liegt in diesem Fenster ein Farbwechsel, entsteht ein Wert, der zu keiner Farbe passt.
- [ ] Der Rechner schafft zehn Messungen samt Vergleich pro Sekunde nicht mehr rechtzeitig, und die Verzögerung wächst mit jedem Symbol.
  > Zehn Vergleiche pro Sekunde sind für jeden Rechner nichts. Das Problem liegt in der Physik der Messung und im Auseinanderlaufen der Uhren.

## Ein Farbsensor misst mit 50 ms Integrationszeit. Der Sender schickt 25 Symbole pro Sekunde, jedes Symbol steht also 40 ms. Was kommt beim Empfänger an? {#ca-003}

- [x] Jede Messung enthält Anteile zweier Symbole; die Werte liegen zwischen den Farben, und die Erkennung wird unzuverlässig.
  > Genau: Das Messfenster ist länger als ein Symbol, also fällt immer ein Farbwechsel hinein. Der Sensor mittelt darüber und liefert einen Wert, der zu keiner Farbe passt. Abhilfe: langsamer senden oder die Integrationszeit verkürzen, was wiederum die Streuung erhöht.
- [ ] Etwa jedes zweite Symbol geht verloren, weil der Sensor nur alle 50 ms eine Messung fertig hat; die übrigen kommen sauber an.
  > So sauber verhält es sich nicht. Es gehen nicht einzelne Symbole verloren, sondern die Messwerte selbst werden zu Mischungen, die sich keinem Symbol zuordnen lassen.
- [ ] Nichts Auffälliges, solange Sender und Empfänger dieselbe Rate benutzen; die Integrationszeit spielt dann keine Rolle mehr.
  > Dieselbe Rate hilft gegen das Auseinanderlaufen, aber nicht gegen ein zu langes Messfenster. Auch bei perfekt gleicher Rate mittelt der Sensor über den Wechsel hinweg.
- [ ] Der Sensor bemerkt, dass die Farbe während der Messung gewechselt hat, und liefert für diese Messung keinen gültigen Wert.
  > Er bemerkt nichts, er liefert brav eine Zahl. Der Sensor kennt keine Symbole und keine Wechsel, er summiert nur das Licht seines Fensters. Genau das macht diesen Fehler so tückisch: Die Messung sieht gültig aus und ist trotzdem sinnlos.

## Die Uhren zweier Rechner gehen um 0,5 % auseinander. Nach einem gemeinsamen Start senden sie 10 Symbole pro Sekunde, ein Symbol ist also 100 ms lang, und der Empfänger misst in der Mitte jedes Symbols. Nach welcher Zeit misst er im falschen Symbol? {#ca-011}

- [ ] Nach 200 Sekunden: 0,5 % sind ein Zweihundertstel, also ist der Fehler nach 200 Symbolen eines groß.
  > Hier sind Symbole und Sekunden vertauscht. Der Uhrenfehler wächst mit der verstrichenen Zeit, nicht mit der Zahl der Symbole: 0,5 % von 200 Sekunden wären 1 Sekunde, also zehn ganze Symbole.
- [ ] Nach 20 Sekunden: Erst dann ist der aufgelaufene Fehler so groß wie ein ganzes Symbol.
  > Die Rechnung stimmt, die Schwelle nicht. Der Messpunkt sitzt in der Mitte seines Symbols und verlässt es schon, wenn der Fehler ein **halbes** Symbol erreicht. Bis zum ganzen Symbol ist längst Unsinn angekommen.
- [x] Nach 10 Sekunden: 0,5 % von 10 Sekunden sind 50 ms, und das ist ein halbes Symbol.
  > Genau. Daran sieht man, warum das Problem an der Geschwindigkeit hängt: Bei einem Symbol pro Sekunde wäre ein halbes Symbol 500 ms lang, und dieselben Uhren hielten hundert Sekunden durch.
- [ ] Gar nicht, solange beide Seiten dieselbe Rate vereinbart haben.
  > Vereinbart ist nicht erreicht. Beide Seiten *wollen* 10 Symbole pro Sekunde, aber jede zählt mit ihrer eigenen Uhr, und keine zwei Uhren laufen exakt gleich.

## Zwei Uhren gehen um 0,5 % auseinander, gesendet werden 10 Symbole pro Sekunde, also 100 ms je Symbol. Der Sensor misst mit einem Fenster von 20 ms, das mitten im Symbol liegt und ganz hineinpassen muss. Nach welcher Zeit misst der Empfänger falsch? {#ca-015}

- [ ] Nach 10 Sekunden: Dann hat der Fehler die 50 ms bis zur Symbolgrenze erreicht.
  > Das gilt für eine Messung ohne Breite. Das Fenster ragt aber 10 ms zu jeder Seite über die Mitte hinaus und stößt deshalb früher an die Grenze.
- [x] Nach 8 Sekunden: Von der Mitte bis zur Grenze sind es 50 ms, das halbe Fenster nimmt 10 ms davon, also bleiben 40 ms, und 0,5 % von 8 Sekunden sind 40 ms.
  > Genau. Ein halbes Symbol ist der größte Spielraum, den eine Messung haben kann, und das Messfenster nimmt davon noch etwas weg. Eine echte Strecke kippt deshalb nie später, als die Rechnung mit einem halben Symbol sagt.
- [ ] Nach 6 Sekunden: Von den 50 ms bis zur Grenze gehen die ganzen 20 ms des Fensters ab, es bleiben 30 ms.
  > Das Fenster liegt mittig, es reicht nur mit seiner halben Breite, 10 ms, zu jeder Seite. Abgezogen wird deshalb die Hälfte, nicht das ganze Fenster.
- [ ] Nach 16 Sekunden: Ein Symbol ist 100 ms lang, ohne das Fenster bleiben 80 ms Spielraum.
  > Die 80 ms verteilen sich auf beide Seiten des Fensters. Die Uhr läuft aber nur in eine Richtung weg, also zählt nur eine Seite, 40 ms.

## Die Integrationszeit eines Farbsensors steht auf 50 ms. Gesucht ist eine Symbolrate, bei der jede Messung ganz in ein Symbol fällt, auch wenn die Uhren leicht auseinanderlaufen. Welche passt? {#ca-010}

- [ ] 20 Symbole pro Sekunde: Dann ist ein Symbol genau 50 ms lang, also genauso lang wie das Messfenster.
  > Bei gleicher Länge müsste die Messung exakt auf dem Symbol liegen, und das gelingt nie: Sobald sie um eine Millisekunde verrutscht, liegt ein Farbwechsel darin. Gleich lang heißt schon zu schnell.
- [x] 10 Symbole pro Sekunde: Dann ist ein Symbol 100 ms lang, doppelt so lang wie das Fenster, und die Messung hat Spielraum.
  > Genau: Das Symbol muss deutlich länger sein als das Fenster, nicht nur gleich lang, sonst genügt schon eine kleine Drift für eine Mischmessung. Hier bleiben 25 ms auf jeder Seite des Fensters. Der Faktor zwei ist eine Faustregel und keine Naturkonstante; was eine Strecke wirklich verträgt, zeigt eine Messung.
- [ ] So schnell wie möglich; die Integrationszeit wird danach passend kürzer gestellt.
  > Ein kürzeres Fenster geht, kostet aber, was schon beim Rauschen galt: Je kürzer das Fenster, desto stärker streuen die Werte. Damit wird ein Problem gegen ein anderes getauscht, statt eines zu lösen.
- [ ] Die Rate ist gleichgültig, solange Sender und Empfänger dieselbe benutzen.
  > Die gleiche Rate hilft gegen das Verrutschen, nicht gegen das Mischen. Der Sensor mittelt über sein Fenster, egal wie gut die Absprache ist; ist das Symbol kürzer, liegt in jeder Messung ein Farbwechsel.

## Die Uhren von Sender und Empfänger laufen so stark auseinander, dass nach je acht Datensymbolen eine Marke kommen muss. Gesendet werden 10 Symbole pro Sekunde mit einem Alphabet aus 4 Farben. Wie viele Nutzbits kommen pro Sekunde an? {#ca-009}

- [x] Rund 17,8 bit/s: Von neun Symbolen tragen acht Daten, und 10 mal 2 mal acht Neuntel sind 17,8.
  > Genau. Vier Farben tragen 2 Bit je Symbol, das wären 20 bit/s; ein Neuntel davon, rund 11 %, geht für die Marken drauf. Ob sich das lohnt, hängt davon ab, wie stark die Uhren wirklich auseinanderlaufen, und das ist eine Frage für eine Messung.
- [ ] 20 bit/s: Die Marke wird zusätzlich gesendet und kostet keine Datenzeit.
  > Ein Nebenher gibt es nicht. Die Strecke zeigt nur eine Farbe zur Zeit, und solange die Marke leuchtet, leuchtet kein Datensymbol. Jede Marke belegt einen Zeitschlitz, den sonst Daten hätten.
- [ ] 17,5 bit/s: Ein Achtel der Symbole sind Marken, also bleiben sieben Achtel von 20 bit/s.
  > Hier ist die Marke mitgezählt worden, als wäre sie das achte Datensymbol. Sie kommt aber nach acht Datensymbolen, also ist sie das neunte: Von neun Symbolen ist eines eine Marke, nicht von acht.
- [ ] 20 bit/s, wenn als Marke eine der vier Farben dient; dann geht nichts verloren.
  > Dann ist die Marke von einem Datensymbol nicht mehr zu unterscheiden, und der Empfänger richtet seine Symbolgrenzen an der falschen Stelle aus. Eine Marke muss ein Symbol sein, das in den Daten nicht vorkommt, etwa eine kurze dunkle Pause, und sie kostet trotzdem ihren Zeitschlitz.

## Eine serielle Schnittstelle (UART) schickt jedes Byte mit einem Startbit davor und einem Stoppbit dahinter. Warum genügt es, dass die Uhren beider Seiten auf ein paar Prozent genau gehen? {#ca-012}

- [x] Am Wechsel von 1 auf 0 zu Beginn des Startbits startet der Empfänger seine Uhr neu, und sie muss danach nur etwa zehn Bit lang halten.
  > Genau: Das Startbit ist eine Marke vor jedem Byte. Bis zum Stoppbit sind es zehn Bit, und ein Fehler von ein paar Prozent wächst in dieser Zeit auf weit weniger als ein halbes Bit. Danach ruht die Leitung, und das nächste Startbit setzt die Uhr wieder auf null.
- [ ] Das Startbit überträgt die Taktrate des Senders, und der Empfänger stellt seine Uhr darauf ein.
  > Die Rate ist vorher vereinbart, etwa 9600 Bit pro Sekunde; das Startbit trägt keinen Wert. Es liefert nur einen Zeitpunkt, an dem der Empfänger neu anfängt zu zählen.
- [ ] Der Empfänger misst jedes Bit mehrmals und nimmt die Mehrheit, dadurch mitteln sich die Uhrenfehler heraus.
  > Mehrfaches Messen hilft gegen Rauschen, nicht gegen eine Uhr, die immer in dieselbe Richtung abweicht. Ihr Fehler summiert sich, egal wie oft gemessen wird; erst eine Marke setzt ihn zurück.
- [ ] Eine eigene Leitung im Kabel überträgt den Takt des Senders, sodass der Empfänger keine eigene Uhr braucht.
  > Eine eigene Leitung für den Takt hat UART gerade nicht, nur eine Leitung je Richtung. Deshalb braucht der Empfänger seine eigene Uhr und die Marke vor jedem Byte.

## Welche dieser Verbindungen halten einen gemeinsamen Takt, den der Empfänger immer wieder nachstellt? (Mehrere richtige Antworten möglich.) {#ca-013}

- [x] Die serielle Schnittstelle (UART) mit einem Startbit vor jedem Byte.
  > Richtig: Jedes Bit hat eine vereinbarte Dauer, und das Startbit ist die Marke, an der der Empfänger seine Uhr neu startet.
- [x] Frühes Ethernet (10BASE-T) mit dem Manchester-Code, der in der Mitte jedes Bits wechselt.
  > Richtig: Jedes Bit dauert genau 100 ns, es gibt also einen Takt. Der Wechsel in jeder Bitmitte stellt die Uhr des Empfängers in jedem Bit nach, so oft wie bei keinem anderen Verfahren.
- [x] USB 1 und 2, bei dem der Sender nach sechs Einsen eine zusätzliche 0 einfügt.
  > Richtig: Jedes Bit hat eine feste Dauer, und die eingefügte 0 erzwingt einen Wechsel, an dem der Empfänger seine Uhr nachstellt. Das Bit-Stuffing kostet höchstens ein Siebtel der Rate, ähnlich wie eine Marke.
- [ ] Der Drehgeber eines Mausrads, dessen zwei Sensoren beim Drehen die Zustände 00, 01, 11 und 10 durchlaufen.
  > Der Drehgeber kommt ganz ohne Uhr aus: Die Richtung steckt darin, welcher Nachbarzustand folgt, und wie schnell die Hand dreht, spielt keine Rolle. Er gehört zum zweiten Weg, bei dem der Wechsel selbst der Takt ist.

## Ein Sender codiert über Wechsel, aber so: Jede Farbe ist ein Symbol, und ein Farbwechsel bedeutet nur „hier kommt das nächste Symbol“. Welches Problem hat dieses Verfahren? {#ca-007}

- [ ] Es ist langsamer als eine Übertragung mit festem Takt, weil jedes Symbol erst mit dem nächsten Wechsel als abgeschlossen gilt.
  > Dass ein Symbol erst mit dem nächsten Wechsel feststeht, stimmt, macht es aber nicht langsamer: Der Sender wechselt so schnell, wie der Empfänger die Wechsel sicher sieht. Das Problem liegt woanders.
- [x] Zwei gleiche Symbole hintereinander erzeugen keinen Wechsel und kommen als eines an.
  > Genau: „rot rot“ sieht für den Empfänger aus wie ein langes „rot“. Deshalb trägt im besseren Verfahren nicht die Farbe die Information, sondern der Übergang: Ist die eigene Farbe als Nachfolger ausgeschlossen, kann der Fall gar nicht mehr auftreten.
- [ ] Der Empfänger braucht trotzdem eine gemeinsame Uhr, um zu wissen, wann der nächste Wechsel fällig ist.
  > Eine Uhr im Sinne eines gemeinsamen Takts braucht er nicht. Eine Zeitentscheidung bleibt aber: Wie lange muss eine Farbe stabil anliegen, damit sie als neuer Zustand zählt und nicht als Zwischenwert während des Wechsels?
- [ ] Es funktioniert nur mit genau zwei Farben, weil der Empfänger bei mehr Farben nicht weiß, welcher Wechsel gemeint ist.
  > Die Zahl der Farben ist nicht das Problem: Jeder Wechsel ist ein Wechsel, egal zwischen welchen Farben. Bei zwei Farben wäre es sogar besonders schlimm, weil dann jede Wiederholung einen Wechsel verschluckt.

## Ein Sender codiert ohne gemeinsame Uhr: Er benutzt drei Farben, und nicht die Farbe selbst trägt die Information, sondern der Übergang zur nächsten. Von jeder Farbe aus sind zwei Nachfolger erlaubt, sie stehen für 0 und 1. Was ist der Preis dieser Freiheit? {#ca-005}

- [ ] Keinen: Die Farbzahl bleibt gleich, und weil kein Takt mehr nötig ist, entfallen sogar die Marken.
  > Die Farbzahl bleibt zwar gleich, aber nicht jede Farbe darf auf jede folgen. Diese Einschränkung kostet Kapazität je Übergang. Was bei den Marken gespart wird, wird hier bezahlt.
- [ ] Der Empfänger muss deutlich öfter messen, als der Sender wechselt, damit ihm kein Übergang entgeht.
  > Öfter messen, als der Sender wechselt, muss der Empfänger bei jedem Verfahren, auch mit Takt und Marken. Das ist der gewöhnliche Preis des Messens, kein Preis dieser Freiheit.
- [x] Jeder Übergang trägt nur 1 Bit statt der 1,58 Bit, die drei Zustände tragen könnten.
  > Genau: Die eigene Farbe scheidet als Nachfolger aus, von drei Farben bleiben also zwei Wahlmöglichkeiten, das ist 1 Bit. Allgemein trägt ein Übergang log2(k − 1) Bit statt log2(k). Die Freiheit von der Uhr wird mit Kapazität bezahlt, und das ist oft ein guter Handel.
- [ ] Das Verfahren ist auf drei Farben festgelegt, denn mit mehr Farben lassen sich 0 und 1 den Nachfolgern nicht mehr eindeutig zuordnen.
  > Es funktioniert mit drei und mehr Farben; mehr Farben bringen sogar mehr Bit je Übergang, weil mehr Nachfolger zur Wahl stehen. Bei fünf Farben sind es glatte 2 Bit je Übergang, und die Zuordnung bleibt eindeutig.

## Ein Sender codiert über Farbübergänge (die eigene Farbe ist als Nachfolger ausgeschlossen) und will 2 Bit je Übergang übertragen. Wie viele Farben braucht sein Alphabet? {#ca-006}

- [ ] Zwei, eine Farbe je Bitwert; der Wechsel dazwischen markiert nur die Grenze.
  > Bei zwei Farben gibt es von jeder aus nur einen erlaubten Nachfolger. Der Übergang ist dann vorhersehbar und trägt gar keine Information.
- [ ] Vier, weil 4 gleich 2 hoch 2 ist.
  > Der Reflex zur Zweierpotenz führt hier in die Irre: Von vier Farben bleiben nur drei Nachfolger, das sind 1,58 Bit. Eine Farbe fehlt.
- [x] Fünf, denn dann sind von jeder Farbe aus vier Nachfolger erlaubt.
  > Genau: Gebraucht werden 2 hoch 2 gleich vier Wahlmöglichkeiten, und weil die eigene Farbe wegfällt, braucht es eine mehr. Wer über Übergänge codiert, braucht also ein Alphabet der Größe 2 hoch n plus 1, nicht 2 hoch n. Der Preis ist eine zusätzliche Farbe, die sicher unterscheidbar sein muss.
- [ ] Acht, wie bei einem gewöhnlichen Alphabet für 3 Bit.
  > Acht Farben wären reichlich (sieben Nachfolger, 2,8 Bit je Übergang), aber unnötig viele und damit unnötig schwer zu unterscheiden.

## Im Mausrad sitzt ein Drehgeber mit zwei Sensoren A und B. Beim Drehen durchlaufen sie die Zustände 00, 01, 11 und 10 im Kreis. Warum braucht der Rechner dafür keine Uhr? {#ca-014}

- [x] Die Richtung steckt allein darin, welcher Nachbarzustand als nächster kommt, und der Rechner reagiert nur auf Wechsel.
  > Genau: Es ändert sich immer nur ein Sensor, also hat jeder Zustand zwei erlaubte Nachfolger, eine Raste vor oder zurück. Wie schnell oder langsam gedreht wird, ist egal, denn gezählt werden Wechsel, keine Zeitabschnitte.
- [ ] Die Maus sendet ihre Zustände mit einer festen Rate, die der Rechner kennt.
  > Eine feste Rate wäre ein Takt, und genau den braucht der Drehgeber nicht. Eine Raste kann eine Millisekunde oder eine Minute dauern, der Rechner erkennt sie trotzdem.
- [ ] Eine Hand dreht gleichmäßig genug, sodass jede Raste ungefähr gleich lange dauert.
  > Eine Hand dreht alles andere als gleichmäßig, und das muss sie auch nicht. Der Drehgeber verlässt sich auf keine Dauer, nur auf die Reihenfolge der Zustände.
- [ ] Beide Sensoren wechseln immer gleichzeitig, und dieser gemeinsame Wechsel ersetzt den Takt.
  > Umgekehrt: Es ändert sich immer nur einer der beiden Sensoren. Deshalb kommt der gegenüberliegende Zustand nie direkt, und die Richtung bleibt eindeutig.

## Ein Team codiert ohne Uhr über Farbübergänge und schließt daraus: „Über Zeit müssen wir gar nicht mehr nachdenken.“ Warum stimmt das nicht? (Mehrere richtige Antworten möglich.) {#ca-008}

- [x] Während eines Farbwechsels misst der Sensor Mischwerte; das Team muss festlegen, wie lange eine Farbe stabil anliegen muss, damit sie zählt.
  > Richtig: Ohne diese Schwelle zählt der Empfänger die Zwischenwerte des Wechsels als eigene Zustände und erfindet Symbole. Die Uhr ist weg, die Zeitentscheidung nicht.
- [ ] Ohne Uhr fehlt dem Empfänger die Zählung, welches Symbol gerade dran ist; die Reihenfolge der Symbole lässt sich dann nicht mehr sicher feststellen.
  > Die Reihenfolge ergibt sich aus der Reihenfolge der Wechsel, und die bleibt erhalten. Das ist gerade die Stärke des Verfahrens.
- [x] Wie viele Übergänge pro Sekunde möglich sind, entscheidet weiterhin über den Durchsatz, und dafür gelten Messfenster und Streuung wie bisher.
  > Richtig: Ohne Uhr heißt nicht beliebig schnell. Der Sensor braucht je Messung seine Integrationszeit, und zu schnelle Wechsel verschwimmen genauso wie mit Takt.
- [ ] Der Empfänger muss trotzdem im selben Moment messen, in dem der Sender wechselt, sonst fällt seine Messung mitten in einen Übergang.
  > Genau das entfällt, und es ist der ganze Gewinn des Verfahrens. Der Empfänger darf messen, wann er will, er reagiert nur auf Änderungen. Eine Messung mitten im Übergang ist dabei kein Unglück, sondern der Grund für die Schwelle, ab der eine Farbe zählt.

## Ein Sender schickt 5 Symbole pro Sekunde mit einem Alphabet aus 4 Farben und einem gemeinsamen Takt. Wie lange dauert eine Datei von 2 KiB (16.384 Bit) mindestens? {#ca-004}

- [ ] Rund 55 Minuten: 1 Bit je Symbol, also 5 bit/s.
  > Das wäre die Rechnung mit 1 Bit je Symbol, also mit nur zwei Farben. Vier Farben tragen 2 Bit.
- [x] Rund 27 Minuten: 2 Bit je Symbol, also 10 bit/s.
  > Genau: Vier Farben tragen 2 Bit je Symbol, mal 5 Symbole pro Sekunde ergibt 10 bit/s. 16.384 Bit geteilt durch 10 sind 1638 Sekunden, gut 27 Minuten. Die Rechnung t = n / (r · b) hat genau zwei Stellschrauben, Symbole je Sekunde und Bits je Symbol.
- [ ] Rund 14 Minuten: 4 Bit je Symbol, also 20 bit/s.
  > Das wäre die Rechnung mit 4 Bit je Symbol. Vier Farben tragen aber 2 Bit, nicht 4: Es zählt, wie oft man halbieren muss, nicht die Zahl der Farben selbst.
- [ ] Das lässt sich erst sagen, wenn die Fehlerrate der Strecke bekannt ist.
  > Fehler verlängern die Dauer durch Wiederholungen, gefragt war aber das Minimum. Und ohne diese Grundrechnung lässt sich gar nicht beurteilen, ob sich eine Wiederholung lohnt.
