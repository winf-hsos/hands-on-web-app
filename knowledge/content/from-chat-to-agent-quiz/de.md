---
title: "Quiz: Vom Chat zum Agenten"
summary: >-
  Zwölf Fragen zu den ersten Schritten mit OpenCode, jede Antwort mit ihrer
  Begründung. Die Fragen stammen aus dem Pool des Moduls und haben das Format
  seiner Klausur.
translation_of: en
based_on: 2026-11-25
---

## Was macht aus einem Sprachmodell in OpenCode einen Agenten? {#fca-001}

- [ ] Ein größeres Modell, das auch schwierige Aufgaben ohne Hilfe löst.
  > Auch ein kleines Modell wie gemma-4-e2b arbeitet in OpenCode als Agent. Die Größe entscheidet, wie gut es das kann, nicht, ob es ein Agent ist.
- [x] Das Modell darf Werkzeuge aufrufen und sieht deren Ergebnisse, bevor es antwortet, so oft wie nötig.
  > Richtig: Die Schleife aus Werkzeugaufruf und Ergebnis ist der Unterschied. Das Modell schreibt auf, welches Werkzeug es aufrufen will, und entscheidet nach jedem Ergebnis, ob es fertig ist.
- [ ] Ein Gedächtnis, das sich alle früheren Sitzungen im Ordner merkt.
  > Eine neue Sitzung beginnt leer. Was der Agent über den Ordner weiß, steht in der AGENTS.md, nicht in einem Gedächtnis früherer Sitzungen.
- [ ] Feste Regeln, nach denen OpenCode antwortet, ohne das Modell zu fragen.
  > OpenCode antwortet nie selbst. Jede Antwort kommt vom Sprachmodell; OpenCode schickt die Anfrage und führt die Werkzeugaufrufe aus.

## ChatGPT kann im Web suchen und Python ausführen. Was kann der Agent in OpenCode, das ChatGPT im Browser nicht kann? {#fca-002}

- [ ] Im Web nach aktuellen Informationen suchen und die Quelle nennen.
  > Das können beide. Der Unterschied liegt nicht im Web, sondern darin, wo der Agent arbeitet.
- [ ] Seine Antworten in mehreren Sprachen schreiben, etwa Deutsch und Englisch.
  > Das liegt am Sprachmodell, nicht am Agenten. Ein Chat kann das genauso.
- [x] Mit den Dateien auf deinem Laptop arbeiten und deine Programme wie typst ausführen.
  > Richtig: ChatGPT arbeitet in seiner eigenen Umgebung in der Cloud. Der Agent arbeitet dort, wo deine Dateien und Programme sind, ohne Hochladen und Herunterladen.
- [ ] Ohne Sprachmodell weiterarbeiten, wenn keine Verbindung besteht.
  > Ohne Sprachmodell geht nichts. Ohne Internet hilft nur ein Modell auf dem eigenen Laptop, etwa gemma-4-e2b in LM Studio.

## Das Modell entscheidet, die Datei offers.md mit dem Werkzeug write anzulegen. Wer legt die Datei tatsächlich an? {#fca-003}

- [x] OpenCode, das den Aufruf liest, den das Modell geschrieben hat, und ihn ausführt.
  > Richtig: Ein Sprachmodell erzeugt nur Text. Es schreibt auf, welches Werkzeug es mit welchen Eingaben aufrufen will; OpenCode führt den Aufruf aus und meldet das Ergebnis zurück.
- [ ] Das Sprachmodell selbst, weil es Zugriff auf die Festplatte des Laptops hat.
  > Das Modell hat keinen Zugriff auf irgendetwas. Bei gpt-6-luna läuft es sogar auf einem Rechner von OpenAI, weit weg von deiner Festplatte.
- [ ] Der Anbieter des Modells, also OpenAI oder LM Studio, der die Antwort berechnet.
  > Der Anbieter berechnet nur den Text der Antwort. Werkzeuge führt er nicht aus, er kennt nur ihre Beschreibungen aus der Anfrage.
- [ ] Niemand, bis du den Vorschlag des Modells kopierst und selbst speicherst.
  > So arbeitet ein Chat. Im Agenten Build ist write erlaubt, die Datei steht danach ohne dein Zutun im Ordner.

## Du legst im Ordner lindenhof eine Datei AGENTS.md mit einer Beschreibung des Hofladens an. Was bewirkt sie? {#fca-004}

- [ ] Der Agent liest sie, sobald du sie in einer Nachricht erwähnst.
  > Dafür bräuchte es die Datei nicht. OpenCode liest sie von selbst, ohne dass du sie erwähnst.
- [ ] Sie wird zu einem neuen Werkzeug, das das Modell bei Bedarf aufruft.
  > Werkzeuge kommen aus OpenCode oder aus Werkzeugservern. Die AGENTS.md ist Text, kein Werkzeug.
- [ ] Sie ist eine Notiz für Menschen, die das Modell nie zu sehen bekommt.
  > Im Gegenteil: In einer neuen Sitzung antwortet der Agent als Helfer des Hofladens, obwohl du nichts über den Laden gesagt hast. Das weiß er aus der AGENTS.md.
- [x] OpenCode stellt ihren Inhalt in jeder Sitzung dieses Ordners vor alles, was du schreibst.
  > Richtig: Die Datei steht im Systemprompt, den OpenCode mit jeder Anfrage schickt. So weiß der Agent in jeder Sitzung, wofür der Ordner da ist.

## Du lädst gemma-4-e2b in LM Studio mit einem Kontextfenster von 8.192 Tokens und schickst in OpenCode nur „hi“. Statt einer Antwort kommt der Fehler: request (10581 tokens) exceeds the available context size (8192 tokens). Warum ist die Anfrage so groß? {#fca-005}

- [ ] Ein Token ist ein Zeichen, und OpenCode füllt kurze Nachrichten auf.
  > Ein Token ist ein Wortstück von etwa vier Zeichen, und aufgefüllt wird nichts. Das „hi“ selbst ist nur ein Token.
- [x] Jede Anfrage enthält den Systemprompt von OpenCode samt AGENTS.md und die Beschreibungen aller Werkzeuge.
  > Richtig: In unserem Test waren das rund 25.000 Zeichen Systemprompt und 18.000 Zeichen für 14 Werkzeuge, zusammen über zehntausend Tokens, bevor das „hi“ kam.
- [ ] LM Studio hängt alle früheren Sitzungen des Ordners an.
  > LM Studio bekommt nur, was OpenCode schickt, und eine neue Sitzung beginnt leer. Frühere Sitzungen sind nicht dabei.
- [ ] Die Modelldatei von 4,4 GB wird bei jeder Anfrage mitgezählt.
  > Die Modelldatei ist das Modell selbst, nicht Text in seinem Kontext. Das Kontextfenster zählt nur den Text der Anfrage und der Antwort.

## Bei 8.192 Tokens Kontext antwortet gemma-4-e2b in OpenCode schon auf „hi“ nur mit einem Fehler, weil die Anfrage 10.581 Tokens groß ist. Was hilft? {#fca-006}

- [ ] /compact eingeben, damit OpenCode die Sitzung zusammenfasst.
  > Es gibt nichts zusammenzufassen: Schon Systemprompt und Werkzeuge allein passen nicht hinein, und die fasst /compact nicht zusammen.
- [ ] Eine kürzere Nachricht schicken, etwa nur „h“.
  > Das „hi“ ist ein einziges Token von über zehntausend. Eine kürzere Nachricht ändert an der Größe der Anfrage so gut wie nichts.
- [ ] Die AGENTS.md löschen, damit der Systemprompt kürzer wird.
  > Die AGENTS.md des Hofladens hat nur ein paar hundert Zeichen. Es fehlen aber fast 2.400 Tokens, also rund 10.000 Zeichen.
- [x] Das Modell in LM Studio mit einer größeren Context Length neu laden, etwa 32.768.
  > Richtig: Dann passt die Anfrage hinein, und es bleibt Platz für das Gespräch und die Dateien, die der Agent liest. Dafür braucht das Modell mehr Arbeitsspeicher.

## gemma-4-e2b soll einen Flyer als Typst-Datei schreiben und kompilieren. typst compile meldet in der ersten Zeile error: expected expression, und das Modell schreibt die Datei immer wieder neu, ohne dass es klappt. Was ist der wahrscheinlichste Grund? {#fca-007}

- [ ] Typst ist auf dem Laptop nicht installiert, deshalb scheitert jeder Versuch.
  > Die Fehlermeldung kommt von Typst selbst, das Programm läuft also. Ohne Typst käme die Meldung, dass der Befehl unbekannt ist.
- [x] Es schreibt Markdown, in dem # eine Überschrift markiert, in Typst beginnt mit # aber ein Befehl.
  > Richtig: Markdown hat das Modell unzählige Male gesehen, Typst selten. Typst erwartet = für Überschriften, und aus der Fehlermeldung erkennt das kleine Modell das nicht. Am Ende gab gemma-4-e2b dem Compiler die Schuld.
- [ ] Dem Agenten fehlt das Werkzeug shell, deshalb kann er typst gar nicht aufrufen.
  > Dann gäbe es gar keine Meldung von Typst. Das Modell hat typst compile aufgerufen und die Fehlermeldung bekommen.
- [ ] Das Kontextfenster des kleinen Modells ist zu klein für eine ganze Flyer-Datei.
  > Ein Flyer hat ein paar hundert Zeichen. Wäre der Kontext zu klein, gäbe es eine Fehlermeldung von LM Studio, nicht von Typst.

## Nachdem gemma-4-e2b am Typst-Flyer gescheitert ist, wechselst du in derselben Sitzung zu gpt-6-luna und schreibst nur „Fix the error.“ Warum genügt das? {#fca-008}

- [ ] gpt-6-luna kennt die Datei flyer.typ aus seinem Training.
  > Die Datei ist eben erst in deinem Ordner entstanden. Kein Modell kann sie aus dem Training kennen.
- [ ] OpenCode erklärt dem neuen Modell den Fehler in einer eigenen Nachricht.
  > OpenCode schreibt keine Erklärungen. Es markiert nur den Wechsel des Modells und schickt die Sitzung weiter wie bisher.
- [x] Mit jeder Anfrage geht die ganze Sitzung mit, also auch die Versuche des kleinen Modells und die Fehlermeldungen von Typst.
  > Richtig: Das Modell merkt sich nichts, aber OpenCode schickt alles mit. So sieht gpt-6-luna, was schiefging, liest die Datei, ändert sie und kompiliert, in unserem Test in etwa 15 Sekunden.
- [ ] Ein Wechsel des Modells startet eine neue Sitzung, in der gpt-6-luna alle Dateien neu einliest.
  > Der Wechsel bleibt in derselben Sitzung, und das ist der Punkt: In einer neuen Sitzung wüsste gpt-6-luna nicht, welcher Fehler gemeint ist.

## Was bewirkt der Befehl /compact in einer langen Sitzung? {#fca-009}

- [ ] Er löscht die ältesten Nachrichten, bis die Sitzung wieder ins Kontextfenster passt.
  > Gelöscht wird nichts ersatzlos. An die Stelle des Verlaufs tritt eine Zusammenfassung.
- [x] Das Modell fasst die Sitzung zusammen, und die Arbeit geht mit der Zusammenfassung weiter.
  > Richtig: Das schafft Platz, aber Einzelheiten, die nicht in der Zusammenfassung stehen, sind weg. Jede Anfrage wird danach kürzer und billiger. Kurz vor der Grenze des Kontextfensters macht OpenCode das von selbst.
- [ ] Er packt den Verlauf verlustfrei wie eine ZIP-Datei, sodass nichts verloren geht.
  > Das Modell liest Text, keine gepackten Daten. Die Zusammenfassung ist kürzer, weil sie Einzelheiten weglässt.
- [ ] Er wechselt zu einem kleineren Modell, das für dieselbe Sitzung weniger Tokens braucht.
  > Das Modell bleibt dasselbe. Ein kleineres Modell bräuchte für denselben Text auch nicht weniger Tokens.

## Du hast den Agenten gebeten, offers.md zu löschen, und er hat es getan. Danach gibst du /undo ein. Was passiert? {#fca-010}

- [ ] Deine Nachricht verschwindet aus der Sitzung, die Datei bleibt aber gelöscht.
  > /undo nimmt auch die Änderungen am Ordner zurück, die der Agent für diese Nachricht gemacht hat.
- [ ] Das Modell schreibt offers.md neu, aus dem, was es von der Datei noch weiß.
  > Das Modell ist daran nicht beteiligt. Die Datei kommt aus einem Schnappschuss, Zeichen für Zeichen wie vorher.
- [ ] OpenCode holt die Datei aus dem Papierkorb von Windows oder macOS.
  > Ein Befehl des Agenten löscht meist am Papierkorb vorbei. OpenCode verlässt sich deshalb auf seinen eigenen Schnappschuss.
- [x] Deine Nachricht verschwindet, und offers.md kommt aus einem Schnappschuss zurück.
  > Richtig: OpenCode legt vor jeder Änderung einen Schnappschuss des Ordners an, und /undo nimmt Nachricht und Änderungen gemeinsam zurück. Das macht es leichter, einen Agenten ausprobieren zu lassen.

## Du willst dieselbe Anfrage für den Flyer noch einmal mit einem anderen Modell ausprobieren, ohne die bisherige Sitzung zu verlieren. Welcher Befehl passt? {#fca-011}

- [x] /fork, das eine neue Sitzung ab einer früheren Nachricht startet.
  > Richtig: Die neue Sitzung hat den Verlauf bis zu dieser Nachricht, die alte bleibt unverändert. Danach wählst du dort das andere Modell.
- [ ] /undo, das die letzte Nachricht zurücknimmt.
  > Damit ginge der bisherige Versuch verloren, samt den Dateien, die der Agent dafür geändert hat.
- [ ] /new, das eine neue Sitzung startet.
  > Die neue Sitzung beginnt leer. Du müsstest alles bis zur Anfrage für den Flyer wiederholen.
- [ ] /export, das die Sitzung als Datei speichert.
  > /export sichert die Sitzung zum Nachlesen, startet aber nichts neu.

## Du arbeitest im Ordner lindenhof einmal mit gpt-6-luna und einmal mit gemma-4-e2b in LM Studio. Was verlässt dabei deinen Laptop? {#fca-012}

- [ ] Bei gpt-6-luna nur deine getippten Nachrichten, nie der Inhalt von Dateien.
  > Was der Agent mit read liest, steht als Ergebnis in der Sitzung und geht mit jeder weiteren Anfrage an OpenAI.
- [ ] Bei gemma-4-e2b gehen die Anfragen an Google, weil das Modell von Google stammt.
  > Google hat das Modell gebaut, aber es läuft in LM Studio auf deinem Laptop. Die Anfragen gehen an 127.0.0.1, also an den eigenen Rechner.
- [x] Bei gpt-6-luna jede Anfrage mit Systemprompt, Nachrichten und allem, was der Agent gelesen hat; bei gemma-4-e2b nichts.
  > Richtig: Das größere Modell rechnet bei OpenAI, also muss die ganze Anfrage dorthin. Das kleine rechnet auf deinem Laptop, dafür ist es langsamer und macht mehr Fehler.
- [ ] In beiden Fällen nichts, weil OpenCode auf dem Laptop läuft.
  > OpenCode läuft zwar lokal, aber es schickt die Anfragen an den Anbieter des Modells, und gpt-6-luna läuft bei OpenAI.
