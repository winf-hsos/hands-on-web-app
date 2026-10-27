---
type: lesson
code: 4256
title: Welche Frage stellst du an die Daten?
summary: >-
  Beschreiben, erkunden, verallgemeinern, vorhersagen, Ursachen finden oder
  Mechanismen verstehen: sechs Arten von Fragen an Daten, und sechs
  Ja-Nein-Fragen, mit denen man herausfindet, welche man gerade stellt.
level: 1
duration: 12
topics: [questions-and-measurement, exploring-data]
modules: [ea]
areas: [ds]
relations:
  see_also: [leek-peng-what-is-the-question, the-effect, milk-chocolate-survey]
status: draft
updated: 2026-10-27
---

## Worum es geht

Bevor man rechnet, sollte man wissen, welche Art von Frage man stellt. Davon
hängt ab, welche Methode passt, welche Daten man braucht und vor allem, was
man am Ende behaupten darf. Jeffery Leek und Roger Peng haben dafür eine
einfache Ordnung vorgeschlagen ([[leek-peng-what-is-the-question]]): sechs
Typen von Fragen, die man mit einer Folge von Ja-Nein-Fragen auseinanderhält.

## Sechs Ja-Nein-Fragen

Man beginnt oben und geht so lange weiter, bis eine Antwort zu einem Typ
führt:

1. **Fasst du die Daten zusammen?** Wenn nicht, ist es noch keine
   Datenanalyse, etwa wenn man nur einzelne Zeilen zeigt.
2. **Berichtest du die Zusammenfassung, ohne sie zu deuten?** Dann ist die
   Frage *deskriptiv*.
3. **Prüfst du, ob deine Entdeckungen auch in einer neuen Stichprobe gelten
   würden?** Wenn nicht, ist sie *explorativ*.
4. **Willst du wissen, wie sich eine Größe verändert, wenn man den
   Durchschnitt einer anderen verändert?** Wenn ja, geht es bei Frage 6
   weiter, sonst bei Frage 5.
5. **Willst du Werte für einzelne Personen oder Dinge vorhersagen?** Dann
   ist die Frage *prädiktiv*, sonst *inferentiell*.
6. **Suchst du einen Effekt, der im Durchschnitt auftritt, oder einen, der
   in jedem Einzelfall genau so eintritt?** Im Durchschnitt ist die Frage
   *kausal*, in jedem Einzelfall *mechanistisch*.

## Die sechs Typen am Beispiel

Die Beispiele stammen aus der [[milk-chocolate-survey|Umfrage zu Milch und Schokolade]].

| Typ | Was man tut | Beispiel |
|---|---|---|
| deskriptiv | zählen und zusammenfassen, ohne zu deuten | Wie viele der Befragten trinken täglich Milch? |
| explorativ | Muster suchen, die neue Fragen aufwerfen | Kaufen Jüngere häufiger Hafermilch als Ältere? |
| inferentiell | prüfen, ob ein Muster über die Stichprobe hinaus gilt | Gilt das auch für alle, die in Deutschland einkaufen? |
| prädiktiv | für Einzelne vorhersagen, oft mit maschinellem Lernen | Lässt sich aus Alter, Ernährung und Einkaufsort vorhersagen, ob jemand Hafermilch kauft? |
| kausal | herausfinden, was sich im Durchschnitt ändert, wenn man eine Größe verändert, am sichersten mit einem Experiment | Kaufen weniger Menschen alpro, wenn der Preis um zehn Cent steigt? |
| mechanistisch | verstehen, wie eine Ursache in jedem Einzelfall genau wirkt | Wie viel Energie braucht ein Liter Milch, um von 4 auf 60 Grad warm zu werden? |

Die kausale Frage lässt sich mit dieser Umfrage tatsächlich beantworten, weil
der Preis für alpro darin ein Experiment war: Der Zufall hat entschieden, wer
welchen Preis zu sehen bekam. Die mechanistische Frage dagegen beantwortet
keine Umfrage, sondern die Physik; solche Fragen sind in der Datenanalyse
selten.

## Explorativ ist ein Anfang, kein Ergebnis

Fast alles, was man beim ersten Blick in einen Datensatz tut, ist explorativ:
Verteilungen ansehen, Gruppen vergleichen, nach Zusammenhängen suchen. Das
ist der Kern der explorativen Datenanalyse und genau richtig, solange man das
Ergebnis auch so nennt. Ein Muster, das beim Erkunden auffällt, ist eine gute
Frage für die nächste Untersuchung, aber noch keine Antwort.

Der häufigste Fehler ist, eine Stufe zu überspringen. Wer in einer Umfrage
mit 600 Spalten lange genug sucht, findet immer irgendeinen Zusammenhang,
auch wenn er nur zufällig in diesen 2.811 Menschen steckt. Berichtet man ihn
dann, als gelte er für alle, ist aus einer explorativen Frage stillschweigend
eine inferentielle geworden, und liest man ihn als Ursache, sogar eine
kausale.

## Zum Mitnehmen

- Sechs Typen von Fragen: deskriptiv, explorativ, inferentiell, prädiktiv,
  kausal und mechanistisch.
- Sechs Ja-Nein-Fragen führen zum Typ; die entscheidenden sind, ob man über
  die Stichprobe hinaus schließen will und ob man nach einer Ursache fragt.
- Der Typ der Frage bestimmt, was man am Ende behaupten darf. Ein explorativer
  Befund ist der Anfang einer Untersuchung, nicht ihr Ergebnis.
