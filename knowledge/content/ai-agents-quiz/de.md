---
title: "Quiz: KI-Agenten"
summary: >-
  Zwölf Fragen zur Lektion KI-Agenten, jede Antwort mit ihrer Begründung. Die
  Fragen stammen aus dem Pool des Moduls und haben das Format seiner Klausur.
translation_of: en
based_on: 2026-11-09
---

## Du bittest einen Chatbot, ein Skript zu reparieren, das mit einem Fehler abbricht. Er schlägt eine Änderung vor, du führst das Skript selbst aus und kopierst die neue Fehlermeldung zurück. Was ändert sich, wenn du dieselbe Aufgabe einem Agenten gibst? {#ag-001}

- [ ] Er nutzt ein größeres Sprachmodell, das beim Programmieren weniger Fehler macht.
  > Chatbot und Agent können auf demselben Modell laufen. Der Unterschied liegt nicht im Modell, sondern darin, was um das Modell herum gebaut ist.
- [x] Er führt das Skript selbst aus, liest den Fehler und entscheidet über die nächste Änderung, bis das Skript läuft.
  > Richtig: Der Agent übernimmt die Schritte, die beim Chatbot du machst. Er ruft Werkzeuge auf, beobachtet das Ergebnis und macht weiter, bis das Ziel erreicht ist.
- [ ] Er löst die Aufgabe in einem Schritt, weil er die ganze Lösung plant, bevor er etwas schreibt.
  > Ein Agent arbeitet gerade nicht in einem Schritt, sondern in einer Schleife: Er handelt, sieht sich das Ergebnis an und entscheidet dann neu. Ein Plan hilft ihm, ersetzt aber die Schleife nicht.
- [ ] Er fragt vor jedem Vorschlag um Erlaubnis, arbeitet sonst aber wie der Chatbot.
  > Um Erlaubnis fragen kann ein Agent, aber das ist nicht der Unterschied zum Chatbot. Entscheidend ist, dass er die Schritte selbst ausführt, statt sie dir zu überlassen.

## Ein Agent liest die Datei `fields.csv`. Was genau trägt das Sprachmodell zu diesem Schritt bei? {#ag-002}

- [ ] Es öffnet die Datei auf der Festplatte und lädt ihren Inhalt in seinen Speicher.
  > Ein Sprachmodell kann keine Datei öffnen. Es erzeugt nur Text; alles, was in der Welt passiert, führt ein Programm um das Modell herum aus.
- [x] Es schreibt einen Text, der das Werkzeug und seine Argumente nennt; ein Programm drumherum liest die Datei und gibt den Inhalt zurück.
  > Richtig: Der Werkzeugaufruf ist nur Text, wie die TOOL-Karte im Spiel. Der Harness führt ihn aus und legt das Ergebnis in den Kontext.
- [ ] Es schickt eine Anfrage an das Betriebssystem, das die Rechte prüft und die Datei liefert.
  > Das Modell spricht nicht mit dem Betriebssystem. Diese Anfrage stellt der Harness, nachdem er den Text des Modells als Werkzeugaufruf erkannt hat.
- [ ] Es erinnert sich aus dem Training an die Datei, weil solche Tabellen dort häufig vorkommen.
  > Eine Datei auf deinem Rechner kann nicht im Training vorgekommen sein. Was das Modell über sie weiß, steht nur dann im Kontext, wenn ein Werkzeug sie gelesen hat.

## Welche dieser Aufgaben löst man besser mit einem festen Workflow als mit einem Agenten? {#ag-003}

- [x] Jeden Morgen liest ein LLM die neuen Lieferscheine, ein Programm gleicht sie mit den Bestellungen ab und markiert Abweichungen.
  > Richtig: Die Schritte sind jedes Mal dieselben und lassen sich vorab festlegen. Dass ein LLM einen davon übernimmt, macht daraus noch keinen Agenten.
- [ ] Der Hauptlieferant einer Molkerei für Verpackungen ist insolvent; finde Alternativen, vergleiche Angebote und entwirf eine Empfehlung.
  > Hier weiß niemand vorher, welche Schritte nötig sind: welche Quellen, welche Anbieter, welche Rückfragen. Genau dafür ist ein Agent gedacht.
- [ ] Finde heraus, warum der Ertrag auf einem Schlag im letzten Jahr eingebrochen ist, mit allen Daten und Quellen, die verfügbar sind.
  > Eine Ursachensuche verzweigt sich mit jedem Befund neu; welcher Schritt folgt, hängt vom Ergebnis des vorigen ab. Das spricht für einen Agenten.
- [ ] Baue nach einer kurzen Beschreibung eine kleine Web-App, die die Buchungen der Landmaschinen zeigt.
  > Beim Bauen einer App entscheidet sich der nächste Schritt aus dem letzten: Fehler lesen, Code ändern, erneut testen. Das ist die Schleife eines Agenten.

## Welche dieser Aufgaben übernimmt der Harness und nicht das Sprachmodell? (Mehrere richtige Antworten möglich.) {#ag-004}

- [x] die Werkzeugaufrufe ausführen und die Ergebnisse zurückgeben
  > Richtig: Das Modell schreibt den Aufruf nur auf; ausgeführt wird er vom Harness, wie im Spiel, wo der Harness jede Karte zum Werkzeug trägt.
- [ ] entscheiden, welches Werkzeug als Nächstes aufgerufen wird
  > Diese Entscheidung trifft das Modell. Der Harness prüft und führt aus, was das Modell schreibt, aber er wählt den nächsten Schritt nicht.
- [x] vor einem Befehl beim Nutzer um Erlaubnis fragen
  > Richtig: Die Rückfrage ist eine Regel im Programm um das Modell herum; das Modell kann sie weder auslösen noch umgehen.
- [x] das Kontextfenster verwalten, etwa zusammenfassen, wenn es voll wird
  > Richtig: Was ins Kontextfenster kommt und was bei Platzmangel gekürzt wird, entscheidet der Harness; das Modell sieht nur das Ergebnis.
- [ ] den Plan für die Aufgabe schreiben
  > Den Plan schreibt das Modell, über ein Werkzeug wie jedes andere. Der Harness speichert ihn und legt ihn wieder vor, aber der Inhalt kommt vom Modell.

## Nach zwei Stunden Arbeit wiederholt ein Agent plötzlich einen Schritt, den er längst erledigt hatte. Welche Erklärung passt am besten? {#ag-005}

- [ ] Das Modell hat aus den bisherigen Schritten gelernt und seine Gewichte angepasst, wodurch das frühere Ergebnis überschrieben wurde.
  > Während der Nutzung ändern sich die Gewichte eines Modells nicht. Was es während einer Aufgabe weiß, steht ausschließlich im Kontextfenster.
- [x] Das Kontextfenster war voll; frühere Ergebnisse wurden zusammengefasst oder entfernt, sodass der Schritt nicht mehr darin steht.
  > Richtig: Was nicht mehr im Kontext steht, weiß das Modell nicht. Deshalb schreiben Agenten Pläne und Notizen in Dateien, die sie wieder lesen können.
- [ ] Ein Werkzeug hat einen Fehler gemeldet, und der Harness wiederholt fehlgeschlagene Aufrufe selbstständig.
  > Ein Fehler käme als Ergebnis zurück, und das Modell würde darauf reagieren. Einen längst erledigten Schritt wiederholt der Harness nicht von sich aus.
- [ ] Das Sprachmodell behält immer nur das letzte Werkzeugergebnis, deshalb geht jeder frühere Schritt nach einer Runde verloren.
  > Dann hätte der Agent schon nach wenigen Minuten nicht mehr arbeiten können. Das Kontextfenster hält alle Schritte, bis es voll ist.

## Ein Agent soll 40 Meilensteine der KI-Geschichte recherchieren und startet dafür acht Sub-Agenten. Was ist der wichtigste Vorteil? {#ag-006}

- [x] Jeder Sub-Agent hat ein frisches Kontextfenster, sodass die vielen Quellen den Kontext des Hauptagenten nicht füllen, und sie arbeiten gleichzeitig.
  > Richtig: Der Hauptagent bekommt nur die Ergebnisse zurück, nicht jede gelesene Seite. So bleibt sein Kontext frei für die eigentliche Aufgabe.
- [ ] Sub-Agenten nutzen ein kleineres Modell, das auf die Websuche spezialisiert ist.
  > Ein Sub-Agent kann ein anderes Modell nutzen, muss es aber nicht; meist ist es dasselbe. Der Vorteil liegt im getrennten Kontext und in der Parallelität.
- [ ] Sub-Agenten dürfen auf Dateien zugreifen, für die der Hauptagent keine Rechte hat.
  > Sub-Agenten laufen im selben Harness mit denselben oder engeren Rechten. Mehr dürfen sie nicht als der Agent, der sie startet.
- [ ] Mehrere Sub-Agenten stimmen über jede Antwort ab, wodurch erfundene Angaben ausgeschlossen sind.
  > Jeder Sub-Agent recherchiert einen eigenen Teil; eine Abstimmung findet nicht statt. Erfundene Angaben bleiben möglich und müssen geprüft werden.

## Du nutzt Claude Code auf deinem Laptop, und es legt Dateien in deinem Projektordner an. Wo läuft das Sprachmodell? {#ag-007}

- [ ] Auf deinem Laptop, im Programm, das du installiert hast.
  > Auf dem Laptop läuft der Harness, nicht das Modell; ein Modell dieser Größe passt nicht auf einen Laptop.
- [x] Auf einem Server des Anbieters; hin und her geht nur Text, während Harness und Dateien auf deinem Laptop bleiben.
  > Richtig: Der Harness schickt den Kontext an das Modell in der Cloud und führt dessen Werkzeugaufrufe lokal aus. Deshalb entstehen die Dateien bei dir.
- [ ] Teils auf dem Laptop, teils in der Cloud: kleine Schritte lokal, große auf dem Server.
  > Das Modell wird nicht nach Schrittgröße aufgeteilt. Jede Entscheidung trifft dasselbe Modell auf dem Server; lokal laufen nur die Werkzeuge.
- [ ] Im Browser, der das Modell zu Beginn der Sitzung herunterlädt.
  > Claude Code läuft nicht im Browser, und das Modell wird nicht heruntergeladen. Ein Modell lokal zu betreiben ist möglich, aber eine eigene Entscheidung mit kleineren Modellen.

## Dein Agent arbeitet mit deinem Benutzerkonto, und du hast ihm erlaubt, Befehle ohne Rückfrage auszuführen. Was kann er tun? (Mehrere richtige Antworten möglich.) {#ag-008}

- [x] Dateien in deinem persönlichen Ordner löschen
  > Richtig: Alles, was dein Konto darf, darf der Agent auch, Löschen eingeschlossen.
- [x] eine Webseite über dein GitHub-Konto veröffentlichen
  > Richtig: Ist dein Konto auf dem Rechner angemeldet, kann ein Befehl des Agenten in deinem Namen veröffentlichen.
- [ ] Dateien auf dem Laptop einer Kollegin im selben Netz lesen, auf die dein Konto keinen Zugriff hat
  > Der Agent hat genau deine Rechte, nicht mehr. Was dein Konto nicht erreicht, erreicht auch er nicht.
- [x] jede Datei lesen, die dein Konto lesen kann, auch private Dokumente
  > Richtig: Der Agent unterscheidet nicht zwischen Projektdateien und privaten Dokumenten; er hat Zugriff auf alles, was du hast.
- [ ] die Gewichte des Modells ändern, damit es sich nächste Woche an dein Projekt erinnert
  > Die Gewichte liegen beim Anbieter und ändern sich durch die Nutzung nicht. Erinnern kann sich ein Agent nur über Dateien, die er wieder liest.

## Zwei Agenten nutzen genau dasselbe Sprachmodell, aber verschiedene Harnesses. Welche Aussage stimmt? {#ag-009}

- [ ] Sie verhalten sich gleich, weil alle Entscheidungen im Modell fallen.
  > Das Modell entscheidet, aber nur über das, was ihm der Harness vorlegt. Andere Werkzeuge, Anweisungen und Rechte führen zu anderen Entscheidungen.
- [x] Sie können sich verschieden verhalten, weil der Harness bestimmt, welche Werkzeuge, Anweisungen, Rechte und welchen Kontext das Modell bekommt.
  > Richtig: Ein Agent ist ein LLM plus ein Harness. Dasselbe Modell in einem anderen Harness ist ein anderer Agent.
- [ ] Sie unterscheiden sich nur in der Geschwindigkeit, weil der Harness festlegt, wie schnell das Modell rechnet.
  > Wie schnell das Modell rechnet, bestimmt der Server des Anbieters. Der Harness ändert, was das Modell sieht und tun darf, und damit das Verhalten.
- [ ] Sie geben dieselben Antworten in anderer Gestaltung, weil der Harness nur die Ausgabe formatiert.
  > Der Harness formatiert nicht nur; er führt die Schleife, die Werkzeuge und den Kontext. Davon hängt ab, welche Antworten überhaupt entstehen.

## Ein Agent soll ausrechnen, wie viel Stickstoff auf einem Feld noch gedüngt werden darf. Seine Websuche liefert eine aktuelle Seite und eine archivierte Seite von 2009 mit einem anderen Bedarfswert, und er rechnet mit dem Wert von 2009. Was zeigt das? {#ag-010}

- [ ] Das Suchwerkzeug hat einen Fehler gemacht; ein besseres würde nur aktuelle Seiten liefern.
  > Die Suche hat getan, was verlangt war: passende Seiten gefunden. Alte Quellen stehen auch im echten Netz, und ein Agent muss mit ihnen umgehen.
- [x] Das Modell arbeitet nur mit dem, was in seinem Kontext steht; ob es eine veraltete Quelle bemerkt, hängt davon ab, ob es das Ergebnis sorgfältig liest und prüft.
  > Richtig: Die Jahreszahl stand im Suchergebnis. Ein Agent ist nur so gut wie die Ergebnisse, die ihn erreichen, und wie sein Umgang damit; im Spiel „Be the Agent“ ist genau das die Falle von Aufgabe 2.
- [ ] Der Harness hätte die alte Seite aussortieren müssen, weil er jedes Ergebnis auf Richtigkeit prüft.
  > Der Harness prüft, ob ein Aufruf gültig ist, nicht, ob ein Ergebnis inhaltlich stimmt. Das zu beurteilen bleibt Sache des Modells.
- [ ] Ein größeres Modell hätte den aktuellen Wert aus dem Training gekannt, deshalb liegt der Fehler allein an der Modellgröße.
  > Trainingswissen hat einen Stichtag und kann selbst veraltet sein. Gerade deshalb sucht ein Agent nach Quellen und muss deren Alter beurteilen.

## Welche Abfolge beschreibt die Schleife, die den Kern jedes Agenten bildet? {#ag-011}

- [ ] planen, alle Schritte ausführen, Bericht abgeben
  > Hier fehlt das Beobachten zwischen den Schritten. Ein Agent schaut sich jedes Ergebnis an, bevor er den nächsten Schritt wählt.
- [ ] Prompt, Antwort, Rückmeldung des Nutzers, neuer Prompt
  > Das ist das Gespräch mit einem Chatbot: Den nächsten Schritt macht der Mensch. Beim Agenten schließt sich die Schleife ohne ihn.
- [x] denken, handeln, beobachten, und wieder von vorn, bis das Ziel erreicht ist
  > Richtig: In der Forschung heißt dieses Muster ReAct (Yao et al., 2022); im Spiel sind es die Karten THINK, TOOL und RESULT.
- [ ] suchen, lesen, zusammenfassen, und nach einer Antwort aufhören
  > Das ist eine feste Abfolge mit einem einzigen Durchgang. Einem Agenten ist die Zahl der Durchgänge nicht vorgegeben; er hört auf, wenn das Ziel erreicht ist.

## METR berichtet für aktuelle Modelle einen „Zeithorizont“ von mehreren Stunden. Was misst er? {#ag-012}

- [ ] Wie lange ein Modell arbeiten kann, bis sein Kontextfenster voll ist.
  > Mit dem Kontextfenster hat das Maß nichts zu tun. Es misst die Länge von Aufgaben, nicht die Laufzeit des Modells.
- [x] Die Länge von Aufgaben, gemessen in der Zeit, die ein Mensch braucht, die ein Modell in der Hälfte der Fälle allein schafft.
  > Richtig: Ein Horizont von vier Stunden heißt, dass Aufgaben, für die ein Mensch vier Stunden braucht, in etwa der Hälfte der Fälle gelingen.
- [ ] Wie viele Stunden menschlicher Arbeit ein Modell im Durchschnitt pro Tag einspart.
  > Eingesparte Arbeitszeit misst METR nicht. Ob sich der Zeithorizont in Einsparungen übersetzt, ist eine eigene, offene Frage.
- [ ] Wie lange das Modell für eine Aufgabe braucht, die ein Mensch in einer Stunde erledigt.
  > Gemessen wird nicht die Rechenzeit des Modells, sondern wie lange die Aufgaben sein dürfen, die es noch schafft.
