---
type: term
code: 3170
title: Präfixfreier Code
summary: >-
  Ein Code, bei dem kein Codewort der Anfang eines anderen ist. Er lässt sich
  ohne Trennzeichen eindeutig lesen, auch wenn die Codewörter verschieden lang
  sind.
level: 2
duration: 10
topics: [representing-information]
modules: [dup]
relations:
  deepens: [code-as-agreement]
status: draft
updated: 2026-10-21
---

## Definition

Ein Code heißt **präfixfrei**, wenn kein Codewort der Anfang (das Präfix) eines
anderen Codeworts ist. Ein Empfänger kann eine solche Symbolfolge dann von
links nach rechts lesen und weiß in dem Moment, in dem das Gelesene zu einem
Eintrag der Tabelle passt, dass es genau dieser Eintrag sein muss.

## Warum das wichtig ist

Kommen Codewörter ohne Lücken hintereinander an, muss der Empfänger selbst
herausfinden, wo eines endet. Sind alle Codewörter gleich lang, zählt er
einfach mit. Sollen häufige Zeichen aber kürzere Codewörter bekommen als
seltene, damit Nachrichten im Durchschnitt kürzer werden, geht das Zählen nicht
mehr, und genau hier hilft die Präfixfreiheit.

## Ein Beispiel, das nicht funktioniert

| Zeichen | Codewort |
|---|---|
| a | `0` |
| b | `01` |
| c | `10` |

Die Folge `010` lässt sich als `0 10` lesen, also *ac*, oder als `01 0`, also
*ba*. Beide Lesarten halten sich an die Tabelle, weil das Codewort von a der
Anfang des Codeworts von b ist.

## Ein Beispiel, das funktioniert

| Zeichen | Codewort |
|---|---|
| a | `0` |
| b | `10` |
| c | `11` |

Hier beginnt kein Codewort mit einem anderen. Die Folge `01011` kann nur als
`0 10 11` gelesen werden, also *abc*.

## Wo er vorkommt

Die internationalen Telefonvorwahlen bilden einen präfixfreien Code: Weil keine
Ländervorwahl der Anfang einer anderen ist, weiß das Netz nach `+49` sofort,
dass Deutschland gemeint ist, ohne auf weitere Ziffern zu warten. Auch viele
Verfahren zur Datenkompression arbeiten mit präfixfreien Codes, weil sie
häufigen Zeichen kurze Codewörter geben, ohne Trennzeichen zu brauchen.

Der Morsecode ist dagegen **nicht** präfixfrei, denn das E (·) ist der Anfang
des I (··). Er kommt nur deshalb ohne Verwechslungen aus, weil zwischen den
Buchstaben eine Pause gesendet wird, die selbst ein Teil des Codes ist.
