---
type: experiment
code: 8402
title: Perfekt empfangen, perfekter Unsinn
summary: >-
  Vier Farben fehlerfrei übertragen und trotzdem ein falsches Wort lesen, weil
  Sender und Empfänger heimlich verschiedene Tabellen benutzen, und daran
  sehen, dass die Bedeutung aus einer Vereinbarung kommt und nicht aus dem
  Signal.
objectives:
  intro: "In diesem Experiment überträgst du ein Wort mit vier Farben, die alle richtig ankommen, und kannst danach:"
  goals:
    - "zeigen, dass eine fehlerfreie Übertragung ein falsches Wort ergeben kann, wenn die beiden Zuordnungstabellen voneinander abweichen"
    - "begründen, warum keine Messung am Signal einen solchen Fehler aufdecken kann"
    - "ausrechnen, wie viele verschiedene Tabellen es für vier Farben und vier Buchstaben gibt und wie wahrscheinlich zwei unabhängig geschriebene übereinstimmen"
    - "erklären, warum ein Wort, das sich in ein anderes echtes Wort verwandelt, gefährlicher ist als offensichtlicher Unsinn"
    - "die Vereinbarung als Wörterbuch in Python aufschreiben, das bei Sender und Empfänger vorher vorliegen muss"
level: 1
duration: 20
topics: [representing-information, transferring-information]
modules: [dup]
relations:
  see_also: [symbols-and-information]
status: draft
updated: 2026-11-01
---

Ihr übertragt ein Wort aus vier Farben, und jede Farbe kommt richtig an.
Trotzdem liest die empfangende Seite etwas anderes, als gesendet wurde, und
die Frage, warum das so ist, führt zur Hälfte dessen, was ein Symbol
ausmacht: Es muss nicht nur unterscheidbar, sondern auch vereinbart sein.

## Was ihr braucht

- zwei Personen, oder eine Person allein mit vier kleinen Zetteln
- ein Gerät mit RGB-LED und das Sendeprogramm unten, oder ersatzweise vier
  farbige Karten oder ein Bildschirm, der eine Farbe groß zeigt
- Papier und Stift für jede Person

## Aufbau

Ihr arbeitet mit vier Farben, **Rot, Grün, Blau und Gelb**, und mit vier
Buchstaben, **E, I, N und S**. Daraus lassen sich kurze Wörter bilden, etwa
*EINS*, *SEIN*, *NEIN*, *SINN*, *SIE* oder *EIS*. Eine Zuordnungstabelle legt
fest, welche Farbe für welchen Buchstaben steht.

Zu zweit setzt ihr euch so, dass die empfangende Person die LED oder die
Karten sieht, aber nicht auf das Papier der sendenden Person schauen kann.

## Vorher: eure Erwartung

Schreibt auf, wie viele verschiedene Zuordnungstabellen es für vier Farben und
vier Buchstaben gibt, wenn jeder Buchstabe genau einmal vorkommt, und wie
wahrscheinlich es ist, dass zwei Personen ohne Absprache dieselbe Tabelle
schreiben.

## Runde 1: zwei Tabellen ohne Absprache

Jede Person schreibt für sich eine Tabelle, die jeder der vier Farben einen der
vier Buchstaben zuordnet, und zwar ohne mit der anderen zu sprechen und ohne
ihre Tabelle zu zeigen. Die sendende Person wählt ein Wort, übersetzt es mit
**ihrer** Tabelle in Farben und sendet sie nacheinander. Die empfangende
Person notiert jede Farbe, die sie sieht, und übersetzt die Folge erst danach
mit **ihrer** Tabelle in Buchstaben.

Allein legt ihr die vier Buchstaben auf Zettel, mischt sie verdeckt und legt
je einen neben jede Farbe: Das ist die Tabelle der empfangenden Seite, die ihr
noch nicht kennt. Eure eigene Tabelle schreibt ihr offen auf, übersetzt ein
Wort in Farben, notiert die Farbfolge und deckt die Zettel erst dann auf, um
die Folge mit ihnen zurückzuübersetzen.

Vergleicht zuerst nur die Farben: Sind alle so angekommen, wie sie gesendet
wurden? Erst danach vergleicht ihr die Wörter und deckt die beiden Tabellen
auf. Wiederholt die Runde mit einem zweiten Wort.

## Das Sendeprogramm

Mit dem Gerät zeigt dieses Programm eine Farbe nach der anderen, jeweils bis
ihr die Eingabetaste drückt. Tragt in `word` die Farbfolge eures Wortes ein.

```python static
from lifi_hardware import led

COLOURS = {
    "red": (255, 0, 0),
    "green": (0, 255, 0),
    "blue": (0, 0, 255),
    "yellow": (255, 255, 0),
}

word = ["blue", "red", "green", "blue"]  # replace with the colours of your word

for name in word:
    led.set_color(*COLOURS[name])
    input(f"{name} leuchtet, Enter für die nächste Farbe ")

led.set_color(0, 0, 0)
```

## Runde 2: die Vereinbarung

Einigt euch jetzt offen auf eine gemeinsame Tabelle und schreibt sie zweimal
ab, sodass jede Person eine Kopie vor sich hat. Übertragt ein drittes Wort auf
dieselbe Weise wie in Runde 1.

> [!TIP]
> Probiert in Runde 1 auch ein Wort, das sich in ein anderes echtes Wort
> verwandeln könnte. Mit den richtigen zwei Tabellen wird aus *SEIN* zum
> Beispiel *EINS*, und dann fällt der Fehler niemandem auf.

## Tabellen

| Farbe | Tabelle der sendenden Seite | Tabelle der empfangenden Seite |
|---|---|---|
| Rot | | |
| Grün | | |
| Blau | | |
| Gelb | | |

## Messtabelle

| Durchgang | gesendetes Wort | gesendete Farben | gesehene Farben | gelesenes Wort |
|---|---|---|---|---|
| Runde 1, erstes Wort | | | | |
| Runde 1, zweites Wort | | | | |
| Runde 2, gemeinsame Tabelle | | | | |

## Dieselben Farben, zwei Tabellen

Die Übersetzung lässt sich auch im Browser nachstellen. Die beiden
Wörterbücher sind zwei Tabellen, die in keiner Zeile übereinstimmen, weil
jeder Buchstabe bei der empfangenden Seite eine Farbe weitergerutscht ist.
Lasst das Programm zuerst mit *EINS* laufen, dann mit *SEIN*, und ändert
danach die Tabellen, um zu sehen, was sonst noch ankommt.

```python
sender_table = {"red": "E", "green": "I", "blue": "N", "yellow": "S"}
receiver_table = {"red": "I", "green": "N", "blue": "S", "yellow": "E"}

word = "EINS"
colour_of = {letter: colour for colour, letter in sender_table.items()}
colours = [colour_of[letter] for letter in word]
received = "".join(receiver_table[colour] for colour in colours)

print("gesendet:", word, colours)
print("gelesen: ", received)
```

## Auswerten

- Wie viele Farben sind in Runde 1 falsch angekommen, und was ist dann
  schiefgegangen?
- Welche Messung an LED oder Sensor hätte den Fehler finden können? Woran
  hättet ihr ihn ohne den Vergleich der Tabellen überhaupt bemerkt?
- Wie viele Tabellen gibt es für vier Farben und vier Buchstaben, und wie oft
  dürftet ihr erwarten, dass zwei Personen ohne Absprache dieselbe schreiben?
  Stimmt das mit eurer Erwartung von vorher überein?
- Warum ist ein Wort, das sich in ein anderes echtes Wort verwandelt, schlimmer
  als ein Wort, das offensichtlich keinen Sinn ergibt?
- Im LiFi-Projekt steht diese Vereinbarung als Wörterbuch in euren beiden
  Programmen und wird nie übertragen. Was passiert, wenn eine Person sie
  ändert und es der anderen nicht sagt?

Dass ein Symbol ein vereinbarter und unterscheidbarer
Zustand ist, zeigt die Lektion [[symbols-and-information]].

> [!NOTE]
> Mit einer ganzen Gruppe bereitet die Lehrperson zwei Tabellen vor, die
> heimlich voneinander abweichen, und gibt sie zwei Freiwilligen, während die
> übrigen nur die vier Farbkarten sehen. Bevor die zweite Tabelle aufgedeckt
> wird, rät die Gruppe, woran es liegt. Online zeigen die beiden ihre Karten
> in die Kamera.
