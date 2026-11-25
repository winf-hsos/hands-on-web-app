---
title: "Quiz: Tools, Skills und Commands"
summary: >-
  Dreizehn Fragen zum Hofladen-Experiment, jede Antwort mit ihrer Begründung. Die
  Fragen stammen aus dem Pool des Moduls und haben das Format seiner Klausur.
translation_of: en
based_on: 2026-11-25
---

## Ein Agent hat eine Rolle („Du bist der Assistent des Hofladens“), aber keine Werkzeuge. Du bittest ihn, die Wochenbestellung bei den Lieferanten aufzugeben. Was ist das Beste, was er tun kann? {#tsc-001}

- [ ] Die Bestellung aus seinem Wissen über typische Hofläden zusammenstellen und abschicken.
  > Ohne Werkzeug kann er nichts abschicken, und was er über typische Läden weiß, sagt nichts über Bestand und Verkäufe dieses Ladens. Eine solche Bestellung wäre geraten.
- [x] Nachfragen, was und wie viel er bei welchem Lieferanten bestellen soll, weil er weder Produkte noch Bestand noch Verkäufe sehen kann.
  > Richtig: Ein Sprachmodell kann nur Text schreiben. Ohne Werkzeug erreicht es die Daten des Ladens nicht, also bleibt ihm nur Nachfragen oder Raten, und Nachfragen ist ehrlicher.
- [ ] Die Bestellung im Kontext speichern und abschicken, sobald ein Werkzeug eingeschaltet wird.
  > Werkzeuge erscheinen erst in einer neuen Sitzung, und eine Bestellung ohne Daten wäre auch später geraten. Das Modell plant nicht über Sitzungen hinweg.
- [ ] Die Daten des Ladens selbst aus dem Projektordner lesen, weil jeder Agent Dateien lesen kann.
  > Dateien lesen ist auch nur ein Werkzeug. In diesem Agenten ist es wie alle anderen verweigert, und ein verweigertes Werkzeug sieht das Modell nicht einmal.

## Du stellst einem Agenten mit denselben Werkzeugen in zwei neuen Sitzungen dieselbe Frage nach der Wochenbestellung. Die Werkzeuge liefern beide Male genau dieselben Daten, trotzdem weichen die Mengen ab. Woran liegt das am ehesten? {#tsc-002}

- [ ] Das Modell hat sich beim Rechnen in einer der beiden Sitzungen vertan.
  > Rechenfehler kommen vor, erklären aber nicht, dass beide Läufe verschiedene Zeiträume ansehen und verschieden viel Vorrat halten. Die Läufe folgen verschiedenen Regeln, nicht derselben Regel mit einem Fehler.
- [ ] Die zweite Sitzung erinnert sich an die erste und korrigiert deren Bestellung.
  > Eine neue Sitzung beginnt mit leerem Kontext. Sie weiß nichts von der ersten.
- [x] Die Werkzeuge liefern die Daten, aber nicht die Regeln des Ladens; das Modell legt Zeitraum, Vorrat und Rundung jedes Mal selbst fest.
  > Richtig: Wie viele Wochen zählen, wie viel Vorrat bleiben soll und ob der eigene Hof bestellt wird, steht in keinem Werkzeug. Das Modell erfindet es, und zwar nicht jedes Mal gleich.
- [ ] Die Werkzeuge haben zufällige Verkaufszahlen geliefert, die nur zufällig gleich aussahen.
  > Die Frage sagt, dass die Daten genau gleich waren. Der Unterschied entsteht erst danach, beim Modell.

## Was fügt ein Skill wie `weekly-order` einem Agenten hinzu, das ihm die Werkzeuge allein nicht geben? {#tsc-003}

- [ ] Den Zugriff auf Verkaufszahlen und Bestand, den die Werkzeuge erst nach dem Laden des Skills freigeben.
  > Den Zugriff geben die Werkzeuge und die Rechte in der Konfiguration. Ein Skill öffnet nichts, er ist nur Text.
- [ ] Ein schnelleres Modell, weil der Skill die Rechenarbeit vorab erledigt.
  > Ein Skill rechnet nichts. Das Modell liest ihn und rechnet weiterhin selbst, mit denselben Fähigkeiten wie vorher.
- [ ] Eine Kurzform, mit der eine Person die Bestellung mit einer Zeile starten kann.
  > Das ist ein Command. Ein Skill wird vom Modell geladen, wenn die Aufgabe zu seiner Beschreibung passt.
- [x] Das Wissen, wie dieser Laden die Arbeit macht, in normaler Sprache: welche Wochen zählen, wie viel Vorrat bleibt, was nie bestellt wird.
  > Richtig: Ein Skill ist eine Anleitung, wie man sie einer neuen Aushilfe gibt. Er macht aus Daten eine Bestellung nach den Regeln des Ladens.

## Ein Agent kennt zwanzig Skills. Zu Beginn einer Sitzung stehen von jedem Skill nur Name und Beschreibung in seinem Kontext. Warum ist das so gebaut? {#tsc-004}

- [x] Damit der Kontext nicht mit Anleitungen volläuft, die für die Aufgabe keine Rolle spielen; den ganzen Text lädt das Modell erst, wenn die Beschreibung passt.
  > Richtig: Ein Skill kostet erst Platz, wenn er gebraucht wird. Deshalb entscheidet die Beschreibung, ob er überhaupt geladen wird, und muss sagen, wofür er da ist.
- [ ] Damit das Modell die Skills nicht lesen kann, die geheime Geschäftsregeln enthalten.
  > Das Modell kann jeden erlaubten Skill laden und lesen. Die kurze Form spart Platz, sie verbirgt nichts.
- [ ] Weil der Text eines Skills erst beim Laden vom Server des Anbieters heruntergeladen wird.
  > Skills liegen als Dateien im Projektordner. Was sich ändert, ist nur, wann ihr Text in den Kontext kommt.
- [ ] Weil das Modell Name und Beschreibung braucht, um den Skill selbst auszuführen wie ein Werkzeug.
  > Ein Skill wird nicht ausgeführt, sondern gelesen. Das Modell folgt danach seinen Schritten und ruft dafür die Werkzeuge auf.

## Die Datei `.opencode/commands/weekly-order.md` enthält den Text „Work out this week's order with the skill weekly-order, for these suppliers: $ARGUMENTS“. Du tippst `/weekly-order Bee Garden`. Was bekommt das Sprachmodell? {#tsc-005}

- [ ] Die Zeile `/weekly-order Bee Garden`, und es sucht sich die passende Datei selbst.
  > Den Befehl löst OpenCode auf, bevor das Modell etwas sieht. Das Modell bekommt nie den Befehl selbst.
- [ ] Nichts, denn ein Command führt die Bestellung als Skript aus, ohne das Modell zu fragen.
  > Ein Command ruft kein Skript auf. Er schickt einen Prompt an den Agenten, und das Modell arbeitet ihn ab wie jede andere Nachricht.
- [x] Den Text der Datei, in dem `$ARGUMENTS` durch „Bee Garden“ ersetzt ist.
  > Richtig: Ein Command ist ein gespeicherter Prompt. OpenCode setzt den Rest der Zeile ein und schickt den ganzen Text, als hättest du ihn selbst getippt.
- [ ] Den vollständigen Text des Skills `weekly-order`, weil der Command ihn nennt.
  > Der Command nennt den Skill nur. Laden muss ihn das Modell danach selbst, mit dem Werkzeug `skill`.

## Wer entscheidet, wann ein Werkzeug aufgerufen, ein Skill geladen und ein Command gestartet wird? {#tsc-006}

- [ ] Bei allen dreien das Modell, eingeschränkt nur durch die Rechte in der Konfiguration.
  > Einen Command startet das Modell nie von selbst. Er ist der Weg, auf dem eine Person einen Ablauf in Gang setzt.
- [ ] Bei allen dreien die Person, die vorher in der Konfiguration festlegt, in welcher Reihenfolge sie drankommen.
  > Die Konfiguration legt fest, was erlaubt ist, nicht wann. Wann ein Werkzeug oder Skill drankommt, entscheidet das Modell während der Arbeit.
- [x] Werkzeuge ruft das Modell auf und Skills lädt es selbst, soweit die Rechte es erlauben; einen Command tippt eine Person.
  > Richtig: Werkzeuge und Skills setzt das Modell nach eigener Entscheidung ein. Ein Command ist der Einstieg für den Menschen, der den Ablauf zuverlässig starten will.
- [ ] Werkzeuge ruft OpenCode nach festem Plan auf, Skills und Commands wählt das Modell.
  > OpenCode führt einen Werkzeugaufruf nur aus, wenn das Modell ihn schreibt; einen festen Plan gibt es nicht. Und Commands wählt das Modell nicht.

## In `opencode.jsonc` steht die Regel für die Bestellwerkzeuge `orders_*` auf `deny` statt auf `ask`. Du bittest den Agenten, die Wochenbestellung aufzugeben. Was passiert? {#tsc-007}

- [ ] Der Agent ruft das Bestellwerkzeug auf, und OpenCode fragt dich vorher, ob es die Bestellung abschicken darf.
  > Das beschreibt `ask`. Bei `deny` gibt es nichts zu fragen, weil das Werkzeug gar nicht mehr da ist.
- [x] Das Modell sieht kein Bestellwerkzeug; es kann die Mengen ausrechnen und zeigen, aber keine Bestellung abschicken.
  > Richtig: Ein verweigertes Werkzeug verschwindet aus dem Kontext. Das Modell weiß nicht, dass es existiert, und kann nur noch sagen, dass es nicht bestellen kann.
- [ ] Der Agent schickt die Bestellung trotzdem ab, weil die Regel nur Warnungen erzeugt.
  > Die Regeln werden von OpenCode durchgesetzt, nicht vom Modell befolgt. Bei `deny` kann das Werkzeug nicht aufgerufen werden.
- [ ] Der Agent schreibt die Bestellung stattdessen mit einem anderen Werkzeug in eine Datei.
  > In diesem Agenten sind alle Werkzeuge außer denen des Ladens verweigert, auch das Schreiben von Dateien. Ihm bleibt kein anderer Weg.

## Du willst, dass der Agent des Hofladens seinen Skill für den Kassenabschluss selbst schreibt. Welche Regel in `opencode.jsonc` passt dazu am besten? {#tsc-012}

- [x] `edit` nur für `.agents/skills/**` und `.opencode/commands/**`, jeweils mit `ask`.
  > Richtig: Der Agent darf genau die Dateien schreiben, die er für Skills und Commands braucht, und du siehst jede Datei, bevor sie entsteht.
- [ ] `edit` für `*` mit `allow`, damit der Agent nicht bei jeder Datei unterbrochen wird.
  > Damit dürfte der Agent jede Datei im Ordner ändern, auch `opencode.jsonc` mit seinen eigenen Rechten und das Kassenbuch, ohne dass du es siehst.
- [ ] `shell` mit `allow`, damit der Agent die Datei mit einem Befehl anlegen kann.
  > Eine Shell erlaubt weit mehr als das Schreiben eines Skills, bis hin zum Löschen von Dateien. Für eine Textdatei genügt das Recht `edit` auf einen Ordner.
- [ ] Keine neue Regel; der Agent schreibt den Skill mit dem Werkzeug `skill`.
  > Das Werkzeug `skill` lädt einen vorhandenen Skill, es schreibt keinen. Ohne Schreibrecht kann der Agent den Text nur anzeigen.

## Ein kleines lokales Modell hält sich an den Skill, stuft aber Joghurt mit 14 Tagen Haltbarkeit als verderblich ein, obwohl der Skill „7 Tage oder weniger“ sagt, und bestellt zu wenig. Welche Änderung macht diesen Schritt unabhängig von der Größe des Modells zuverlässig? {#tsc-008}

- [ ] Den Satz im Skill fett setzen und mit „unbedingt beachten“ ergänzen.
  > Das kann helfen, bleibt aber eine Bitte an ein Modell, das den Satz schon einmal überlesen hat. Zuverlässig wird der Schritt so nicht.
- [ ] Aus dem Skill einen Command machen, damit die Person den Ablauf startet.
  > Ein Command ändert, wer den Ablauf startet, nicht wie genau das Modell die Schritte befolgt. Der Fehler bliebe derselbe.
- [ ] Die Regel für die Bestellwerkzeuge auf `ask` setzen.
  > Mit `ask` siehst du die falsche Menge vor dem Abschicken und kannst ablehnen. Das schützt vor dem Schaden, rechnet aber nicht richtig.
- [x] Ein Werkzeug schreiben, das den Zielbestand je Produkt aus Verkäufen und Haltbarkeit in Code ausrechnet, und es im Skill nennen.
  > Richtig: Was sich genau festlegen lässt, gehört in Code. Das Modell muss dann nur noch das Werkzeug aufrufen, und die Regel gilt immer gleich.

## Der Agent hat die Werkzeuge der Kasse, aber noch keinen Skill für den Kassenabschluss. Er liest Barumsatz, Kartenumsatz, zurückgegebene Pfandflaschen und das gezählte Bargeld. Was fehlt ihm noch, um den Sollbestand der Kasse zu berechnen? {#tsc-009}

- [x] Das Wechselgeld vom Morgen und der Pfandbetrag je Flasche; beides steht in keinem Werkzeug, sondern nur in der Beschreibung der Inhaberin.
  > Richtig: Das sind Regeln des Ladens, keine Daten eines Tages. Sie gehören in den Skill, sonst muss das Modell nachfragen oder raten.
- [ ] Die Kartenumsätze, die zum Bargeld in der Kasse addiert werden müssen.
  > Die Kartenumsätze liefert das Werkzeug schon, und sie erreichen die Kasse nie. Wer sie addiert, rechnet falsch.
- [ ] Nichts; der Sollbestand ist das gezählte Bargeld, und die Differenz ist immer null.
  > Ein Abschluss, der das annimmt, findet nie eine Differenz und verfehlt seinen Zweck.
- [ ] Ein Werkzeug, das die Differenz ausrechnet, weil ein Sprachmodell keine Zahlen subtrahieren kann.
  > Mit ein paar Zahlen rechnet ein gutes Modell richtig. Ihm fehlen nicht die Rechenschritte, sondern zwei Werte, die nur die Inhaberin kennt.

## Alle drei Werkzeuggruppen sind eingeschaltet. Auf die Frage, wie viel Bargeld der Laden am 19. November eingenommen hat, ruft `gpt-6-luna` `till_register_log` auf und nennt die Bareinnahmen, ein kleines lokales Modell ruft dagegen `till_cash_count` auf und nennt den gezählten Kassenbestand. Wie erklärst du den Unterschied? {#tsc-013}

- [ ] Das kleine Modell sieht weniger Werkzeuge, weil sein Kontext kleiner ist.
  > Beide Modelle bekommen dieselben sieben Werkzeugbeschreibungen. Der Unterschied liegt darin, was sie daraus machen.
- [ ] Das kleine Modell darf `till_register_log` nicht aufrufen, weil lokale Modelle andere Rechte haben.
  > Die Rechte hängen am Agenten, nicht am Modell. Mit denselben Regeln darf jedes Modell dieselben Werkzeuge aufrufen.
- [ ] Das starke Modell kennt die Einnahmen aus dem Training und ruft das Werkzeug nur zur Bestätigung auf.
  > Die Einnahmen eines erfundenen Ladens kennt kein Modell. Das starke Modell hat das Werkzeug aufgerufen, weil nur so die Zahl zu bekommen war.
- [x] Aus einer Frage in Alltagssprache das passende Werkzeug abzuleiten, ist selbst eine Leistung des Modells, und ein kleines Modell geht eher nach dem Wort „cash“ im Namen eines Werkzeugs als nach dessen Beschreibung.
  > Richtig: Die Werkzeugwahl ist keine Mechanik des Programms, sondern eine Entscheidung des Modells. Ein Skill, der sagt, welches Werkzeug bei welcher Frage dran ist, nimmt dem kleinen Modell diese Entscheidung ab.

## Ein Agent auf einem kleinen lokalen Modell soll 12 Gläser Honig bei Bee Garden bestellen. Er ruft `orders_place_order` auf, du lehnst die Rückfrage von OpenCode ab, und er antwortet: „Ich habe 12 Gläser Honig bei Bee Garden bestellt.“ Was lernst du daraus? {#tsc-010}

- [ ] Die Ablehnung hat nicht gewirkt; die Bestellung ist trotzdem beim Lieferanten angekommen.
  > OpenCode führt einen abgelehnten Aufruf nicht aus. Im Ordner `outbox` liegt keine Bestellung; falsch ist nur die Antwort des Modells.
- [ ] Das Modell hat ein zweites Werkzeug gefunden, mit dem es die Bestellung auf anderem Weg abgeschickt hat.
  > Der Agent hat außer `orders_place_order` kein Werkzeug, das bestellt. Er hat nichts abgeschickt, er hat es nur behauptet.
- [x] Die Antwort eines Agenten ist keine Quittung: Ein kleines Modell berichtet leicht, was es vorhatte, statt was das Werkzeug zurückgegeben hat, also prüft man das Ergebnis selbst.
  > Richtig: Das Werkzeug hat eine Ablehnung zurückgegeben, das Modell hat trotzdem Erfolg gemeldet. Ob bestellt wurde, zeigt `outbox`, nicht der Text des Agenten.
- [ ] Kleine Modelle können keine Werkzeuge aufrufen; die ganze Antwort war erfunden.
  > Der Aufruf hat stattgefunden, OpenCode hat ihn dir ja zur Freigabe vorgelegt. Erfunden war nur, dass er gelungen sei.

## Mit demselben Skill bestellt `gpt-6-luna` genau nach den Regeln des Ladens, ein kleines lokales Modell dagegen hält Joghurt mit 14 Tagen Haltbarkeit für verderblich und bestellt zu wenig. Ein starkes Modell schreibt den Skill daraufhin um. Was wird sich am ehesten ändern? {#tsc-011}

- [ ] Der Skill wird kürzer, weil ein kleines Modell lange Texte schlechter liest.
  > Kürzer wird er in der Regel nicht, sondern länger: Was das starke Modell selbst ergänzt hat, muss für das kleine ausdrücklich dastehen.
- [x] Jeder Schritt nennt das Werkzeug mit seinen Argumenten und die Rechnung als Formel, und was sich genau festlegen lässt, steht ausdrücklich da, etwa dass Joghurt mit 14 Tagen nicht als verderblich gilt.
  > Richtig: Ein kleines Modell braucht genauere Anweisungen als ein großes. Das starke Modell schreibt sie, weil es weiß, wo Spielraum für Fehler bleibt.
- [ ] Die Regeln des Ladens werden vereinfacht, damit das kleine Modell sie schafft, etwa ein Faktor 1,5 für alle Produkte.
  > Das würde den Laden ändern, nicht die Anweisung. Gefragt ist, dieselben Regeln so genau aufzuschreiben, dass auch ein kleines Modell sie befolgt.
- [ ] Der Skill bekommt die Anweisung, langsamer und sorgfältiger zu arbeiten.
  > Eine solche Bitte ändert wenig, weil das Modell nicht weiß, wo es sorgfältiger sein müsste. Wirksam ist, die fehleranfälligen Stellen genau festzulegen.
