---
type: challenge
code: 9258
title: "Challenge 3: Der Lauscher"
summary: >-
  Der Empfänger findet Anfang und Ende einer Nachricht unbekannter Länge selbst, nach einem Protokoll, das auch ein anderes Team versteht.
objectives:
  intro: "Mit dieser Challenge entwirfst du ein Protokoll und kannst danach:"
  goals:
    - "eine Nachricht mit Präambel und Endmarke rahmen"
    - "einen Empfänger bauen, der weiß, ob er wartet, liest oder fertig ist"
    - "ein Protokoll so beschreiben, dass ein anderes Team danach einen Empfänger baut"
    - "das Protokoll ohne Hardware mit einer Datei testen"
level: 1
topics: [transferring-information, solving-problems]
modules: [dup]
status: draft
updated: 2026-11-02
---

Bisher wusste der Empfänger, wann es losgeht und wie lang die Nachricht ist. Das
fällt jetzt weg: Er muss selbst erkennen, wo eine Nachricht beginnt und wo sie
endet. Dafür braucht ihr Regeln, die so genau aufgeschrieben sind, dass auch ein
anderes Team danach einen Empfänger bauen könnte, und genau das wird geprüft.

**Ziel:** Der Empfänger läuft schon, bevor der Sender startet, und findet Anfang
und Ende einer Nachricht unbekannter Länge ohne menschliche Hilfe.

**Aufgabe:** Ihr entwerft einen Rahmen um eure Nachricht, etwa eine Präambel am
Anfang und eine Endmarke, und einen Empfänger, der weiß, in welchem Zustand er
ist: Er wartet, er liest oder er ist fertig. Eure Regeln schreibt ihr als
Protokollbeschreibung auf.

**Interop-Test:** Auf halber Strecke tauscht ihr eure Protokollbeschreibung mit
einem anderen Team, und jedes Team baut einen Empfänger für das Protokoll des
anderen. Nach dem Tausch sind keine Rückfragen erlaubt; was unklar ist, wird
aufgeschrieben. Die Phase endet mit einer Normungssitzung, in der die ganze
Gruppe sich auf einen gemeinsamen Rahmen für das Finale einigt.

**Gemessen wird,** ob der Empfänger ohne Hilfe richtig liest und wie viele Teams
mit eurer Beschreibung zurechtkamen. Bei der Abnahme entscheidet jemand anderes,
wann gesendet wird. Als Live-Änderung empfangt ihr zwei Nachrichten, ohne den
Empfänger neu zu starten.

**Tipp:** Trennt im Code die Frage, welche Bits gesendet werden, von der Frage,
wie Bits zu Licht werden. Dann könnt ihr das Protokoll mit einer Datei statt mit
der Hardware testen.

**Typische Stolpersteine:** Der Empfänger springt auf Rauschen an, die Präambel
kommt zufällig auch mitten in den Daten vor, das Ende wird nicht erkannt, oder
die Beschreibung schildert nur, was ihr gebaut habt, statt was ein anderes Team
wissen muss.
