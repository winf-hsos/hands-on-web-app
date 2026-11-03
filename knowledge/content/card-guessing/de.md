---
type: experiment
code: 9320
title: Eine Karte aus 32 erraten
summary: >-
  Eine Karte aus einem Skatblatt nur mit Ja/Nein-Fragen erraten, die Fragen
  zählen und dabei herausfinden, warum halbierende Fragen im Schnitt gewinnen
  und weshalb eine Karte aus 32 genau fünf Bit wert ist.
objectives:
  intro: "In diesem Experiment errätst du eine Karte aus 32 nur mit Ja/Nein-Fragen, zählst die Fragen und kannst danach:"
  goals:
    - "eine Ja/Nein-Frage formulieren, die die verbleibenden Möglichkeiten halbiert"
    - "an deinen eigenen Zählungen zeigen, dass halbierende Fragen bei 32 Karten immer nach fünf Fragen ans Ziel führen und Raten im Schnitt deutlich länger dauert"
    - "erklären, warum die Zahl der nötigen Halbierungen, `log₂(32) = 5`, die Unsicherheit in Bit misst"
    - "mit dem Erwartungswert begründen, warum eine Frage, die alles auf einmal klären kann, im Schnitt weniger Information bringt als eine halbierende"
    - "an einem gezinkten Spiel beschreiben, warum häufige Fälle kurze Codes verdienen, wie das „e“ im Morsecode"
level: 1
duration: 25
topics: [representing-information, transferring-information]
modules: [dup]
relations:
  see_also: [bit, morse-code, symbols-and-information]
status: draft
updated: 2026-11-01
---

Eine Person zieht verdeckt eine Karte, die andere darf nur Fragen stellen, auf
die es ein Ja oder ein Nein gibt. Ihr zählt, wie viele Fragen ihr braucht, und
aus diesen Zählungen entsteht eine Maßeinheit für Information, das Bit.

## Was ihr braucht

- zwei Personen und ein Skatblatt mit 32 Karten: vier Farben (Kreuz, Pik,
  Herz, Karo) mit je acht Werten (7, 8, 9, 10, Bube, Dame, König, Ass)
- allein oder ohne Karten das Programm unten, das eine Zahl von 1 bis 32 zieht
  und eure Fragen beantwortet
- Papier und Stift, für die freiwillige Runde 3 einen Würfel

## Aufbau

Die ziehende Person mischt, zieht eine Karte und hält sie verdeckt. Die
ratende Person stellt Fragen, die ziehende antwortet nur mit Ja oder Nein und
sagt nie mehr. Eine Runde endet, sobald die ratende Person die Karte sicher
kennt; die Frage, mit der sie das bestätigt, zählt nicht mit, wenn die Karte
schon vorher feststand. Tauscht nach jeder Runde die Rollen.

## Vorher: eure Erwartung

Schreibt auf, wie viele Fragen ihr eurer Meinung nach im Durchschnitt braucht,
wenn ihr einfach auf Karten tippt, und wie viele höchstens, wenn ihr geschickt
fragt.

## Runde 1: auf Karten tippen

Fragt in drei Runden nur nach einzelnen Karten, also „Ist es die Herz-Dame?“,
„Ist es die Pik-Sieben?“ und so weiter, bis ihr die Karte habt. Zählt die
Fragen jeder Runde.

## Runde 2: halbieren

Stellt jetzt in drei Runden nur Fragen, auf die bei der Hälfte der noch
möglichen Karten ein Ja kommt und bei der anderen Hälfte ein Nein. Notiert
nach jeder Antwort, wie viele Karten noch übrig sind, und zählt die Fragen.

> [!TIP]
> Eine gute erste Frage ist „Ist die Karte rot?“, denn Herz und Karo sind
> genau 16 der 32 Karten. Überlegt für jede weitere Frage, bevor ihr sie
> stellt, ob sie wirklich die Hälfte der übrigen Karten trifft.

## Runde 3 (freiwillig): ein gezinktes Spiel

Die ziehende Person würfelt verdeckt. Bei 1, 2 oder 3 nimmt sie den
Kreuz-Buben, sonst zieht sie eine Karte aus den übrigen 31. Die ratende Person
kennt diese Regel. Spielt drei Runden und überlegt vorher, welche erste Frage
sich jetzt lohnt.

## Allein spielen

Dieses Programm zieht eine Zahl von 1 bis 32, die für eine Karte steht, und
beantwortet zwei Arten von Fragen: `> 16` heißt „Ist sie größer als 16?“,
`= 7` heißt „Ist es genau die 7?“. Nach jeder Antwort zeigt es, wie viele
Zahlen noch möglich sind, und es hört auf, sobald nur noch eine übrig ist.

```python
import random

secret = random.randint(1, 32)
possible = list(range(1, 33))
questions = 0

print("Gesucht ist eine Zahl von 1 bis 32.")
print("Fragt mit > 16 (größer als 16?) oder = 7 (genau 7?).")

while len(possible) > 1:
    question = input("Frage: ").replace(" ", "")
    number = int(question[1:])
    if question[0] == ">":
        answer = secret > number
        possible = [n for n in possible if (n > number) == answer]
    else:
        answer = secret == number
        possible = [n for n in possible if (n == number) == answer]
    questions += 1
    print(question, "ja" if answer else "nein", "· noch", len(possible), "möglich")

print("Es ist die", possible[0], "nach", questions, "Fragen.")
```

## Messtabelle

| Runde | Karte | Fragen | Karten übrig nach jeder Antwort |
|---|---|---|---|
| tippen, 1 | | | |
| tippen, 2 | | | |
| tippen, 3 | | | |
| halbieren, 1 | | | |
| halbieren, 2 | | | |
| halbieren, 3 | | | |
| gezinkt, 1 | | | |
| gezinkt, 2 | | | |
| gezinkt, 3 | | | |

## Was eine Frage im Schnitt wert ist

Eine Antwort, die eine von zwei gleich wahrscheinlichen Möglichkeiten
ausschließt, ist ein **Bit** wert. Allgemein ist eine Antwort mit der
Wahrscheinlichkeit `p` genau `log₂(1/p)` Bit wert: Je seltener sie ist, desto
mehr trägt sie. Den Durchschnitt einer Frage bekommt ihr, wenn ihr für jede
mögliche Antwort ihre Wahrscheinlichkeit mit ihrem Wert multipliziert und
alles addiert. Das Programm rechnet das für eine halbierende Frage und für
„Ist es das Pik-Ass?“ aus.

```python
from math import log2

def worth(p):
    return p * log2(1 / p)

print("halbierend:", round(worth(1/2) + worth(1/2), 2), "Bit")
print("Pik-Ass?:  ", round(worth(1/32) + worth(31/32), 2), "Bit")
```

## Auswerten

- Wie viele Fragen habt ihr beim Tippen im Durchschnitt gebraucht, und wie
  viele beim Halbieren? Wie weit lagen eure Erwartungen daneben?
- Kam das Halbieren jedes Mal mit fünf Fragen aus? Warum fünf, und wie hängt
  diese Zahl mit der Folge 32, 16, 8, 4, 2, 1 zusammen?
- Gab es eine Runde, in der das Tippen schneller war? Warum gewinnt das
  Halbieren trotzdem, obwohl ihr euch die Antwort nicht aussuchen könnt?
- Was bringt die Frage „Ist es das Pik-Ass?“ im Schnitt, verglichen mit einer
  halbierenden Frage, und wann am Ende einer Runde ist sie trotzdem die
  richtige?
- Welche erste Frage lohnt sich im gezinkten Spiel, und wie viele Fragen habt
  ihr dort im Durchschnitt gebraucht? Was folgt daraus für einen Code, in dem
  manche Zeichen viel häufiger sind als andere?

Der Morsecode nutzt genau das, was das gezinkte Spiel zeigt: Das „e“, der
häufigste Buchstabe, bekommt mit einem einzigen Punkt das kürzeste Zeichen,
seltene Buchstaben wie das „q“ bekommen lange ([[morse-code]]). Was ein Bit
genau ist, steht beim Begriff [[bit]], und wie viele Bit ein Symbol aus eurem
eigenen Farbalphabet trägt, zeigt die Lektion [[symbols-and-information]].

> [!NOTE]
> Mit einer ganzen Gruppe zieht die Lehrperson verdeckt eine Karte, und die
> Gruppe darf nur Ja/Nein-Fragen stellen. Sie rät zuerst frei, und erst wenn
> die ersten Zählungen an der Tafel stehen, kommt die halbierende Frage dazu.
