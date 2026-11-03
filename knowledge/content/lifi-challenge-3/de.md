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
project: lifi
status: draft
updated: 2026-11-03
---

Bisher wusste der Empfänger, wann es losgeht und wie lang die Nachricht ist. Das
fällt jetzt weg: Er muss selbst erkennen, wo eine Nachricht beginnt und wo sie
endet. Dafür braucht ihr Regeln, die so genau aufgeschrieben sind, dass auch ein
anderes Team danach einen Empfänger bauen könnte, und genau das wird geprüft.

**Ziel:** Der Empfänger läuft schon, bevor der Sender startet, und findet Anfang
und Ende einer Nachricht unbekannter Länge ohne menschliche Hilfe.

**Fünf Aufgaben:** Ihr kennzeichnet Anfang und Ende einer Nachricht, baut einen
Empfänger, der selbst wartet und erkennt, lasst ihn zwei Nachrichten
hintereinander lesen, beschreibt euer Protokoll für ein anderes Team und
einigt euch zum Schluss mit der ganzen Gruppe auf einen gemeinsamen Rahmen. Zu
den meisten Aufgaben gibt es Tipps zum Aufklappen.

## Die Dateien

Ihr arbeitet mit denselben drei Dateien weiter wie in Challenge 2 und fangt mit
euren eigenen an; dazu kommt die Vorlage für die Protokollbeschreibung.

| Datei | Was hineinkommt |
|---|---|
| `agreement.py` | wie bisher, dazu alles, was beide Seiten über Anfang und Ende einer Nachricht wissen müssen |
| `sender.py` | `calibrate()` wie bisher, `send_message(text)` sendet eine vollständige Nachricht |
| `receiver.py` | `calibrate()` wie bisher, `receive_message()` wartet, erkennt, liest und gibt die Nachricht zurück |
| `protocol-template.md` | eure Protokollbeschreibung für den Interop-Test |

Den Test startet ihr mit `run_test.py` aus der Vorlage, zuerst den Empfänger
und irgendwann später den Sender; wie genau, steht in ihrer Beschreibung.

## Aufgabe 1: Anfang und Ende kennzeichnen

Entwerft einen Rahmen um eure Nachricht, etwa eine Präambel am Anfang und eine
Endmarke, sodass der Empfänger an den Symbolen selbst erkennt, wo eine
Nachricht beginnt und wo sie aufhört. `send_message(text)` sendet die
Nachricht mitsamt diesem Rahmen.

**Datei:** `agreement.py` für das, was beide Seiten wissen müssen, und `sender.py`, die Funktion `send_message(text)`

> [!HINT]
> Fragt euch, was passiert, wenn euer Anfangsmuster zufällig mitten in der Nachricht vorkommt, und welche Zeichen in einer Nachricht überhaupt erlaubt sind.

> [!HINT]
> Trennt im Code die Frage, welche Symbole ihr sendet, von der Frage, wie ein Symbol zu Licht wird. Dann könnt ihr die untere Hälfte zum Testen durch eine Datei ersetzen: Der Sender schreibt seine Symbole hinein, der Empfänger liest sie von dort. So probiert ihr euren Rahmen ohne Hardware und ohne minutenlanges Warten aus, und wenn etwas nicht klappt, wisst ihr sofort, ob es an der Logik oder an der Optik liegt. In Challenge 4 wird diese Trennung Pflicht.

## Aufgabe 2: Der Empfänger wartet selbst

`receive_message()` wird aufgerufen, bevor der Sender startet, und bekommt
keine Länge mehr. Der Empfänger muss also jederzeit wissen, in welchem Zustand
er ist: Er wartet, er liest, oder er ist fertig.

**Datei:** `receiver.py`, die Funktion `receive_message()`

> [!HINT]
> Haltet den Zustand in einer eigenen Variablen fest und legt für jeden Zustand fest, was ein neues Symbol bewirkt. Dann springt der Empfänger nicht auf Rauschen an, solange er wartet.

> [!HINT]
> Das Fehlerbild verrät die Ursache: Fehlt der Anfang, hat der Empfänger zu spät eingesetzt, steht am Ende Müll, wurde das Ende nicht erkannt, und ist die Mitte falsch, ging unterwegs der Takt verloren.

## Aufgabe 3: Zwei Nachrichten ohne Neustart

Euer Empfänger liest zwei Nachrichten hintereinander, ohne dass ihr ihn neu
startet. Das ist auch die Live-Änderung bei der Abnahme.

**Datei:** `receiver.py`

> [!HINT]
> Nach der Endmarke muss der Empfänger wieder warten, als hätte er nie etwas gelesen. Prüft, ob dabei etwas aus der ersten Nachricht liegen bleibt.

## Aufgabe 4: Protokollbeschreibung und Interop-Test

Auf halber Strecke füllt ihr die Vorlage für die Protokollbeschreibung aus und
tauscht sie mit einem anderen Team, und jedes Team baut einen Empfänger für das
Protokoll des anderen. Nach dem Tausch sind keine Rückfragen erlaubt; was
unklar ist, wird aufgeschrieben.

**Datei:** `protocol-template.md`

> [!HINT]
> Der wichtigste Teil der Vorlage ist Abschnitt 8, das vollständige Beispiel: Wer euren Text nicht versteht, versteht meist das Beispiel.

> [!HINT]
> Schreibt auf, was ein anderes Team wissen muss, um einen Empfänger zu bauen, nicht, was ihr gebaut habt.

## Aufgabe 5: Die Normungssitzung

Die Phase endet mit einer Normungssitzung, in der sich die ganze Gruppe aus
euren Vorschlägen auf einen gemeinsamen Rahmen für das Finale einigt. Was
unterhalb der Bits liegt, also wie Bits zu Licht werden, bleibt dabei eure
eigene Sache.

**Datei:** keine; mitbringen könnt ihr eure Protokollbeschreibung und den
Bericht vom Interop-Test.

## Abnahme

**Gemessen wird,** ob der Empfänger ohne Hilfe richtig liest und wie viele Teams
mit eurer Beschreibung zurechtkamen. Bei der Abnahme entscheidet jemand anderes,
wann gesendet wird. Als Live-Änderung empfangt ihr zwei Nachrichten, ohne den
Empfänger neu zu starten.

## Stolpersteine und mehr

**Typische Stolpersteine:** Der Empfänger springt auf Rauschen an, die Präambel
kommt zufällig auch mitten in den Daten vor, das Ende wird nicht erkannt, oder
die Beschreibung schildert nur, was ihr gebaut habt, statt was ein anderes Team
wissen muss.
