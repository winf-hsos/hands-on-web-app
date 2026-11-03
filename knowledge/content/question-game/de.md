---
type: demo
code: 2716
title: Fragespiel
summary: >-
  Eines von sechzehn Gesichtern ist gesucht, und du darfst nur Ja-Nein-Fragen
  stellen: Jede Antwort verkleinert die Menge, und um wie viel, misst das
  Spiel in Bit.
objectives:
  intro: "An diesem Demonstrator misst du die Information deiner eigenen Fragen und kannst danach:"
  goals:
    - "die Information einer Antwort als I = H₁ − H₂ aus der Zahl der Gesichter vorher und nachher ausrechnen"
    - "vor einer Frage abzählen, wie gut sie die übrigen Gesichter teilt, und daraus ihren Erwartungswert abschätzen"
    - "begründen, warum halbierende Fragen jedes der sechzehn Gesichter in vier Fragen finden"
    - "erklären, warum Raten meistens die schlechteste Frage ist, auch wenn es manchmal sofort trifft"
level: 1
duration: 10
topics: [representing-information]
modules: [dup]
relations:
  example_of: [symbols-and-information]
status: draft
updated: 2026-11-03
---

**Ziel:** Du erlebst, dass eine Antwort so viel Information bringt, wie sie
Möglichkeiten ausschließt. Sechzehn Gesichter bedeuten log₂(16) = 4 Bit
Unsicherheit, und jede Frage, die die Übrigen genau halbiert, beseitigt davon
ein Bit.

**Bedienung:** Tipp auf eine Frage, um sie zu stellen, oder auf ein Gesicht,
um zu raten; auch ein Rateversuch zählt als Frage. Wie viele Gesichter mit Ja
antworten würden, zeigt das Spiel nicht an, das Abzählen ist deine Strategie.
Nach jeder Antwort steht unter den Fragen, wie viel Bit sie gebracht hat und
wie viel die Frage im Mittel wert war, sodass du eine gut geplante Frage von
einer glücklichen unterscheiden kannst.

```question-game
```
