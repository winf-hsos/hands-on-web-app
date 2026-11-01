---
type: person
code: 8740
title: Claude Shannon
summary: >-
  Zeigte, dass Schaltungen rechnen können wie die Logik, und begründete mit
  dem Bit die Informationstheorie, auf der jede digitale Übertragung beruht.
objectives:
  intro: "Nach diesem Porträt weißt du, wer Claude Shannon war und was er zu den Grundlagen der Informatik beigetragen hat, und kannst:"
  goals:
    - "zeigen, dass sich zwei Schalter hintereinander wie ein UND und zwei nebeneinander wie ein ODER verhalten, und erklären, warum man deshalb mit Schaltungen rechnen kann"
    - "das Bit als Antwort auf eine Ja-Nein-Frage beschreiben"
    - "erklären, warum die Menge an Information in einer Nachricht davon abhängt, wie überraschend sie ist, und nicht davon, was sie bedeutet"
    - "begründen, warum kürzere Codewörter für häufige Zeichen im Schnitt Bits sparen"
    - "erklären, was die Kapazität einer Leitung über zuverlässige Übertragung trotz Störungen aussagt"
born: 1916
died: 2001
level: 1
duration: 8
topics: [transferring-information, representing-information, processing-information]
modules: [dup]
relations:
  see_also: [logic-gates, prefix-free-code]
status: draft
updated: 2026-11-01
---

## Wer er ist

Claude Elwood Shannon wurde 1916 in Michigan geboren, studierte Mathematik und
Elektrotechnik und arbeitete den größten Teil seines Berufslebens an den Bell
Labs, dem Forschungslabor der amerikanischen Telefongesellschaft, und am MIT.
Zwei seiner Arbeiten gehören zu den Grundlagen der Informatik: Die eine zeigt,
wie Schaltungen logisch denken, die andere, was Information ist und wie viel
davon durch eine Leitung passt.

## Schaltungen, die rechnen

Für seine Masterarbeit von 1937 untersuchte Shannon die Relais, mit denen
Telefonzentralen damals Verbindungen schalteten. Er bemerkte, dass sich jede
solche Schaltung mit der Algebra beschreiben lässt, die George Boole hundert
Jahre zuvor für die Logik erfunden hatte: Zwei Schalter hintereinander
verhalten sich wie ein UND, zwei nebeneinander wie ein ODER. Damit konnte man
Schaltungen am Schreibtisch berechnen und vereinfachen, statt sie
auszuprobieren, und umgekehrt jede logische Regel als Schaltung bauen. Auf
dieser Idee beruhen die [[logic-gates]], aus denen bis heute jeder Prozessor
besteht.

## Was Information ist

1948 veröffentlichte Shannon „A Mathematical Theory of Communication“. Darin
löst er Information von ihrer Bedeutung: Wie viel Information eine Nachricht
trägt, hängt nur davon ab, wie viele Nachrichten möglich gewesen wären und wie
wahrscheinlich sie sind. Die kleinste Einheit ist die Antwort auf eine
Ja-Nein-Frage, und dafür verwendete er das Wort **Bit**, das sein Kollege John
Tukey vorgeschlagen hatte.

Daraus folgen zwei Ergebnisse, die bis heute jede Übertragung bestimmen. Das
erste: Wenn manche Zeichen häufiger sind als andere, kann man sie mit kürzeren
Codewörtern schreiben und so im Schnitt Bits sparen, und Shannon gab an, wie
weit das höchstens geht. Mit Robert Fano entwickelte er ein Verfahren für
solche [[prefix-free-code|präfixfreien Codes]]. Das zweite: Jede Leitung hat
eine **Kapazität**. Unterhalb dieser Grenze lassen sich Nachrichten trotz
Störungen beliebig zuverlässig übertragen, wenn man sie geschickt mit
zusätzlichen Prüfbits versieht; oberhalb geht das nicht, egal wie man es
anstellt.

## Spielen als Methode

Shannon war bekannt dafür, sich mit scheinbaren Spielereien zu beschäftigen.
Er baute eine elektrische Maus namens Theseus, die durch ein Labyrinth fand
und sich den Weg merkte, schrieb einen der ersten Aufsätze darüber, wie ein
Computer Schach spielen könnte, und fuhr jonglierend Einrad durch die Flure
der Bell Labs. Viele dieser Spiele waren ernsthafte Fragen in anderer Form:
wie eine Maschine lernt, wie sie plant, wie man Bewegungen berechnet. Er starb
2001 in Massachusetts.

## Zum Mitnehmen

- Schalter verhalten sich wie logische Aussagen, und deshalb kann man mit
  Schaltungen rechnen.
- Information misst man in Bits; wie viel eine Nachricht enthält, hängt davon
  ab, wie überraschend sie ist, nicht davon, was sie bedeutet.
- Häufiges kurz zu codieren spart Bits, und jede Leitung hat eine Kapazität,
  bis zu der sich trotz Störungen zuverlässig übertragen lässt.
