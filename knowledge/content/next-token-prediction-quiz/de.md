---
title: "Quiz: Vorhersage des nächsten Tokens"
summary: >-
  Zehn Fragen zur Lektion über die Vorhersage des nächsten Tokens, jede
  Antwort mit ihrer Begründung. Die Fragen stammen aus dem Pool des Moduls und
  haben das Format seiner Klausur.
translation_of: en
based_on: 2026-11-11
---

## Was berechnet ein Sprachmodell in einem einzigen Schritt? {#np-001}

- [ ] Das nächste Wort, das es schon vor dem Schreiben für die ganze Antwort geplant hat.
  > Das Modell plant keine ganze Antwort im Voraus; es sieht in jedem Schritt nur den Text bis hierher.
- [x] Für jedes Token seines Vokabulars eine Wahrscheinlichkeit, dass es als Nächstes kommt.
  > Richtig: Diese Wahrscheinlichkeiten sind alles, was das Modell in einem Schritt liefert; welches Token genommen wird, entscheidet das Programm darum herum.
- [ ] Den ganzen nächsten Satz auf einmal, der dann Wort für Wort angezeigt wird.
  > Die Antwort entsteht wirklich Token für Token; jedes neue Token braucht einen eigenen Durchlauf durch das Modell.
- [ ] Nur das eine wahrscheinlichste Token, ohne Werte für die anderen.
  > Das Modell rechnet für alle Tokens einen Wert aus; nur deshalb können Temperatur, Top k und Top p überhaupt eine Auswahl treffen.

## Warum braucht ein deutscher Text meist mehr Tokens als ein englischer mit demselben Inhalt? {#np-002}

- [ ] Jeder Umlaut und jedes ß wird grundsätzlich als eigenes Token gezählt.
  > Auch Wörter mit Umlaut können ein einzelnes Token sein; entscheidend ist, wie häufig ein Wort in den Texten war, aus denen das Vokabular gebaut wurde.
- [ ] Das Modell muss für Deutsch zusätzlich die Grammatik als Tokens mitschicken.
  > Grammatik wird nicht als Token mitgeschickt; die Tokens sind nur die Stücke des Textes selbst.
- [x] Das Vokabular des Modells wurde vor allem aus englischen Texten gebaut, deshalb zerfallen deutsche Wörter öfter in mehrere Stücke.
  > Richtig: Häufige Wörter sind ein Token, und was in den Texten für das Vokabular selten war, wird in Stücke zerlegt.
- [ ] Ein Token steht immer für genau eine Silbe, und deutsche Wörter haben mehr Silben.
  > Tokens folgen nicht den Silben: Ein häufiges Wort mit drei Silben kann ein einziges Token sein.

## Das Programm hat das nächste Token nach den Wahrscheinlichkeiten des Modells gezogen. Was geschieht als Nächstes? {#np-003}

- [x] Das Token wird an den Kontext angehängt, und das Modell berechnet aus dem längeren Text neue Wahrscheinlichkeiten.
  > Richtig: Jede Ausgabe wird zur Eingabe; das heißt autoregressiv.
- [ ] Das Modell prüft die bisherige Antwort und ersetzt frühere Tokens, die nicht mehr passen.
  > Ein geschriebenes Token wird nie zurückgenommen; das Modell kann nur weiterschreiben.
- [ ] Das Modell lernt aus dem gezogenen Token und passt seine Parameter an.
  > Beim Antworten ändern sich die Parameter nicht; gelernt wird nur beim Training.
- [ ] Das Programm zieht mit denselben Wahrscheinlichkeiten weiter, bis die Antwort fertig ist.
  > Für jedes neue Token berechnet das Modell neue Wahrscheinlichkeiten, weil der Kontext um ein Token länger geworden ist.

## Ein Sprachmodell schreibt flüssig und überzeugt etwas Falsches. Welche Erklärung folgt aus der Vorhersage des nächsten Tokens? {#np-004}

- [ ] Es hat in seiner Datenbank eine falsche Quelle nachgeschlagen.
  > Ein Sprachmodell schlägt nichts nach; es berechnet Wahrscheinlichkeiten für das nächste Token.
- [ ] Es erfindet absichtlich etwas, um kreativ zu wirken.
  > Das Modell hat keine Absicht; Tokens werden nach den Wahrscheinlichkeiten gezogen, die es berechnet.
- [ ] Der Tokenizer hat die Frage falsch zerlegt, und das Modell hat eine andere Frage beantwortet.
  > Der Tokenizer zerlegt jeden Text eindeutig; Halluzinationen entstehen beim Schreiben der Antwort.
- [x] Es schreibt die wahrscheinlichste Fortsetzung, und die ist nicht immer die wahre.
  > Richtig: Wo das Wahre auch das Plausibelste ist, schadet das nicht; wo nicht, entsteht eine Halluzination mit derselben Sicherheit.

## Du stellst einem Chatbot zweimal dieselbe Frage und bekommst zwei verschiedene Antworten. Woran liegt das? {#np-005}

- [ ] Der Anbieter beantwortet jede Frage mit einem anderen Modell.
  > Auch ein einziges Modell auf deinem Laptop antwortet unterschiedlich, solange die Temperatur über 0 liegt.
- [x] Das nächste Token wird zufällig nach den Wahrscheinlichkeiten des Modells gezogen.
  > Richtig: Das Modell und seine Wahrscheinlichkeiten bleiben gleich; verschieden ist nur, welches Token gezogen wird, und jedes Token verändert alles, was danach kommt.
- [ ] Das Modell hat aus der ersten Antwort gelernt und antwortet beim zweiten Mal besser.
  > Im Chat lernt das Modell nichts; seine Parameter ändern sich zwischen zwei Fragen nicht.
- [ ] Die Frage wird vor dem Senden zufällig umformuliert.
  > Die Frage kommt unverändert an; der Zufall steckt im Ziehen der Tokens der Antwort.

## Was bewirkt eine Temperatur von 0? {#np-006}

- [ ] Alle Tokens werden gleich wahrscheinlich, und die Antwort wird zufällig.
  > Das ist die Richtung hoher Temperaturen; bei 0 gewinnt immer das wahrscheinlichste Token.
- [ ] Das Modell antwortet nicht, weil keine Token gezogen werden dürfen.
  > Auch bei 0 wird geschrieben, nur ohne Zufall.
- [x] Es wird immer das wahrscheinlichste Token genommen, und dieselbe Frage bekommt jedes Mal dieselbe Antwort.
  > Richtig: Die Wahrscheinlichkeiten werden so scharf, dass das wahrscheinlichste Token alles bekommt.
- [ ] Das Modell schreibt kreativer, weil es seltene Tokens bevorzugt.
  > Seltene Tokens bekommen bei 0 gar keine Chance; mehr Abwechslung bringt eine höhere Temperatur.

## Das Modell berechnet für das nächste Token field 41 %, barn 22 %, yard 9 %, shed 6 % und für alle anderen weniger. Welche Tokens bleiben bei Top p = 0,6 übrig? {#np-007}

- [ ] nur field
  > field allein hat 41 % und erreicht 0,6 noch nicht; es braucht ein zweites Token.
- [x] field und barn
  > Richtig: Top p behält so viele der wahrscheinlichsten Tokens, bis zusammen 0,6 erreicht ist; 41 % und 22 % ergeben 63 %.
- [ ] field, barn und yard
  > Drei Tokens behält Top k = 3; für Top p = 0,6 genügen schon field und barn.
- [ ] 60 % der Tokens
  > p ist ein Anteil der Wahrscheinlichkeit, nicht der Tokens; die meisten Tokens haben fast keine Wahrscheinlichkeit.

## Ein Chat fühlt sich an wie ein Gespräch mit Gedächtnis. Was geschieht tatsächlich bei jeder neuen Nachricht? {#np-008}

- [ ] Das Modell speichert jedes Gespräch in seinen Parametern und erinnert sich daran.
  > Die Parameter ändern sich beim Antworten nicht; ein Gespräch hinterlässt im Modell keine Spur.
- [ ] Nur die neue Nachricht wird geschickt, den Rest ergänzt das Modell aus seinem Gedächtnis.
  > Das Modell hat kein Gedächtnis für frühere Aufrufe; was nicht im Kontext steht, gibt es für das Modell nicht.
- [x] Das Programm schickt das ganze bisherige Gespräch noch einmal an das Modell, weil es sich zwischen zwei Aufrufen nichts merkt.
  > Richtig: Deshalb wächst der Kontext mit jeder Nachricht.
- [ ] Das Programm schickt nur die letzte Antwort des Modells mit, nicht die eigenen Fragen.
  > Es schickt alles mit: Systemprompt, alle Fragen und alle Antworten, markiert mit Tokens dafür, wer was gesagt hat.

## Der Kontext ist voll, und in LM Studio ist Rolling Window eingestellt. Was geschieht? {#np-009}

- [ ] Das Modell entscheidet selbst, welche Nachrichten unwichtig sind, und vergisst nur diese.
  > Nicht das Modell entscheidet, sondern das Programm darum herum, und Rolling Window streicht einfach die ältesten.
- [ ] Die Antwort bricht ab, sobald das Fenster voll ist.
  > Das ist die Einstellung Stop at Limit.
- [x] Die ältesten Nachrichten fallen weg und existieren für das Modell nicht mehr.
  > Richtig: Was wegfällt, entscheidet das Programm um das Modell herum, und das Modell weiß davon nichts.
- [ ] Der Anfang und die letzten Nachrichten bleiben, und die Mitte wird herausgeschnitten.
  > Das ist die Einstellung Truncate Middle.

## Bei Attention wird jedes Token mit jedem Token davor in Beziehung gesetzt. Der Kontext wird doppelt so lang. Wie verändert sich die Zahl der Zellen im Raster? {#np-010}

- [ ] Sie bleibt gleich.
  > Das Raster hängt von der Länge des Kontexts ab: Mehr Tokens bedeuten mehr Zeilen und mehr Spalten.
- [ ] Sie steigt um ein Viertel.
  > Die Zahl der Zellen wächst mit dem Quadrat der Länge, also deutlich stärker als die Länge selbst.
- [ ] Sie verdoppelt sich.
  > Das gälte, wenn jedes Token nur mit einer festen Zahl anderer Tokens verglichen würde; hier ist es jedes Token davor.
- [x] Sie vervierfacht sich.
  > Richtig: Das Raster hat n mal n Zellen, also bringt die doppelte Länge viermal so viele Zellen; deshalb sind lange Kontexte so teuer.
