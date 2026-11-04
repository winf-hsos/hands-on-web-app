---
title: "Quiz: Symbole und Information"
summary: >-
  Sechzehn Fragen zu Symbolen, Alphabeten und Vereinbarungen, zum Bit als Maß
  der Information, zu halbierenden Fragen und dazu, was ein größeres Alphabet
  einbringt. Jede Antwort kommt mit ihrer Begründung.
translation_of: en
based_on: 2026-11-04
---

## Was ist im Sinn der Informationstheorie ein Symbol? {#si-001}

- [ ] Ein kleines Bild, etwa ein Icon auf dem Bildschirm.
  > Das ist die Alltagsbedeutung. Hier meint Symbol etwas Allgemeineres, das auch eine Farbe, ein Ton oder eine Handbewegung sein kann.
- [ ] Ein Schriftzeichen wie ein Buchstabe oder eine Ziffer, also etwas, das man aufschreiben kann.
  > Schriftzeichen sind ein Beispiel für Symbole, aber nur eines. Die Farben einer Lampe sind genauso Symbole, obwohl sich keine davon aufschreiben lässt.
- [x] Ein vereinbarter, unterscheidbarer Zustand.
  > Genau, und beide Wörter tragen: unterscheidbar, weil der Empfänger ihn sicher von allen anderen trennen muss, und vereinbart, weil der Zustand ohne Absprache keine Bedeutung trägt.
- [ ] Ein einzelner Messwert eines Sensors, etwa eine bestimmte Helligkeit.
  > Ein Messwert ist erst einmal nur eine Zahl. Zum Symbol wird ein Bereich von Messwerten erst, wenn Sender und Empfänger ihm gemeinsam eine Bedeutung geben.

> Ein Symbol braucht beides: Die Physik macht es unterscheidbar, und eine Vereinbarung gibt ihm Bedeutung.

## Zwei Teams übertragen Daten mit farbigem Licht, und ihre LED zeigt vier vereinbarte Farben. Was ist das Alphabet ihrer Strecke? {#si-002}

- [ ] Die 26 Buchstaben von A bis Z, die über die Strecke gehen sollen.
  > Die Buchstaben sind der Inhalt der Nachrichten, aber die Strecke selbst sendet nur Farben. Ihr Alphabet ist, was unterwegs zu sehen ist, hier vier Farben statt 26 Buchstaben.
- [x] Die Menge der vier Farben, die beide Teams als Symbole vereinbart haben.
  > Genau. Wie groß diese Menge sein darf, entscheidet die Vereinbarung allerdings nicht allein: Hardware und Umgebung reden mit, und damit wird es eine Frage der Messung.
- [ ] Die Reihenfolge, in der die Farben einer Nachricht gesendet werden.
  > Die Reihenfolge ist die Nachricht selbst. Das Alphabet ist der Vorrat, aus dem sie zusammengesetzt wird.
- [ ] Die Zuordnung der Farben zu Bitfolgen, etwa dass Grün für 01 steht.
  > Das ist der Code, der auf dem Alphabet aufbaut. Das Alphabet ist nur die vereinbarte Menge der Farben selbst; wie man sie in Bits schreibt, ist ein zweiter Schritt.

> Das Alphabet ist der Vorrat vereinbarter Symbole, und ein Code sagt danach, wofür jedes davon steht.

## Eine Strecke überträgt Buchstaben als farbige Lichtblitze. Wer legt fest, dass ein grünes Aufleuchten „A“ bedeutet? {#si-003}

- [ ] Die Physik des Lichts: Jede Farbe hat eine feste Wellenlänge, und an der erkennt der Empfänger, welches Zeichen gemeint ist.
  > Die Wellenlänge macht Grün unterscheidbar, mehr nicht. Welches Zeichen dahintersteht, steht nicht im Licht, sondern entsteht allein durch Vereinbarung.
- [x] Sender und Empfänger gemeinsam, durch eine Vereinbarung vor der Übertragung.
  > Genau, und beide Seiten müssen exakt dieselbe Zuordnung benutzen. In der Praxis ist diese Vereinbarung ein Stück Dokumentation und zwei Stellen im Code, eine im Sender und eine im Empfänger.
- [ ] Eine Norm für Lichtübertragung, an die sich alle Geräte halten, damit sie sich untereinander verstehen.
  > Normen gibt es für viele Kanäle, aber auch sie werden vereinbart, nicht gefunden: Eine Norm ist eine Vereinbarung, die für viele aufgeschrieben ist. Im Licht selbst legt nichts die Bedeutung fest.
- [ ] Der Empfänger allein, denn er ist die Seite, die aus Messwerten Zeichen machen muss.
  > Ein Empfänger, der allein entscheidet, rät. Ohne dass der Sender dieselbe Zuordnung benutzt, kommt zuverlässig Unsinn heraus.

> Die Bedeutung steckt nicht im Signal, sondern in einer Vereinbarung, die beide Seiten vorher getroffen haben.

## Was ist ein Bit? {#si-004}

- [ ] Ein winziges Bauteil im Computer, das Strom entweder durchlässt oder sperrt.
  > Ein Bit ist kein Ding, sondern eine Maßeinheit. Es lässt sich in Bauteilen speichern, aber genauso in einem Lichtblitz oder einer Handbewegung.
- [ ] Die Speichermenge, die ein Computer für ein einzelnes Zeichen wie „A“ braucht.
  > Das beschreibt ein Byte, eine Gruppe von acht Bit. Die Verwechslung ist verbreitet, kostet aber gleich den Faktor acht.
- [x] Die Informationsmenge einer Entscheidung zwischen zwei gleich wahrscheinlichen Möglichkeiten.
  > Genau: ein Ja oder Nein, ein An oder Aus. Das Bit ist die kleinste Währung, in der sich Information zählen lässt, und jede größere Menge wird in dieser Währung gemessen.
- [ ] Die kleinste Helligkeit, die ein Sensor noch messen kann.
  > Das wäre eine Eigenschaft eines bestimmten Sensors. Ein Bit ist von jeder Hardware unabhängig, es zählt Möglichkeiten, nicht Helligkeiten.

> Ein Bit ist die Antwort auf eine Ja-Nein-Frage, deren beide Antworten gleich wahrscheinlich sind.

## Ein Alphabet hat vier Farben, alle gleich wahrscheinlich. Wie viel Information trägt ein einzelnes empfangenes Symbol, und warum? {#si-005}

- [ ] 4 Bit, denn jede der vier Farben ist eine eigene Möglichkeit, und jede Möglichkeit zählt ein Bit.
  > Bits zählen nicht die Möglichkeiten selbst, sondern die Ja-Nein-Entscheidungen, die nötig sind, um eine davon zu bestimmen. Das sind deutlich weniger, bei vier Möglichkeiten zwei.
- [x] 2 Bit, denn zwei Ja-Nein-Entscheidungen genügen, um eine von vier Farben sicher zu bestimmen.
  > Genau, und die Begründung ist das Halbieren: Die erste Frage teilt die vier in zwei Hälften, die zweite trifft die Farbe. Jede Verdopplung des Alphabets bringt genau ein weiteres Bit je Symbol.
- [ ] 1 Bit, denn der Empfänger trifft je Symbol eine Entscheidung: Es ist angekommen oder nicht.
  > Ob etwas ankommt, ist nicht die Frage, sondern welche der vier Farben es ist. Ein Symbol ist nicht automatisch ein Bit: Wie viel es trägt, hängt davon ab, aus wie vielen Möglichkeiten es ausgewählt wurde.
- [ ] Das hängt von der gesendeten Farbe ab, denn eine gut erkennbare Farbe wie Rot trägt mehr als eine schwer erkennbare wie Gelb.
  > Erkennbarkeit betrifft die Zuverlässigkeit, nicht die Menge. Bei vier gleich wahrscheinlichen Farben trägt jede dieselbe Information: Entscheidend ist die Zahl der Möglichkeiten, nicht die getroffene Wahl.

> Bei N gleich wahrscheinlichen Symbolen trägt jedes log₂(N) Bit, vier Farben tragen also zwei.

## Eine Strecke wechselt von 2 auf 8 Farben und sendet weiterhin gleich viele Symbole je Sekunde. Wie ändert sich die Übertragungsdauer derselben Datei? {#si-006}

- [ ] Sie sinkt auf ein Viertel, denn 8 geteilt durch 2 ist 4.
  > Die Farbzahlen teilt man nicht: Information wächst mit dem Verdoppeln. Von 2 auf 8 sind es zwei Verdopplungen mehr, also von 1 auf 3 Bit je Symbol.
- [x] Sie sinkt auf ein Drittel: Jedes Symbol trägt jetzt 3 Bit statt 1.
  > Genau: 2 Farben tragen 1 Bit je Symbol, 8 Farben tragen 3. Gleiche Symbolrate, dreifache Bitrate, ein Drittel der Zeit, vorausgesetzt, die acht Farben bleiben unterscheidbar, und genau diese Grenze setzt der Abstand zwischen den Bereichen.
- [ ] Sie bleibt gleich, denn die Symbolrate hat sich nicht geändert.
  > Die Symbolrate ist gleich, aber jedes Symbol transportiert jetzt mehr. Zeit spart, wer mehr Bit in jedes Symbol packt, nicht nur, wer schneller blinkt.
- [ ] Sie sinkt auf ein Achtel, ein Achtel je Farbe.
  > Dann müsste jede zusätzliche Farbe gleich viel bringen. Information wächst aber nur mit jeder Verdopplung des Alphabets um ein Bit, nicht mit jeder einzelnen Farbe.

> Die Zeit folgt den Bits je Symbol, log₂(2) = 1 gegen log₂(8) = 3, also ein Drittel.

## Mehr Symbole je Alphabet heißt mehr Bit je Symbol. Warum macht man das Alphabet dann nicht einfach riesig, etwa 256 Farben? {#si-007}

- [ ] Weil eine Lampe aus ihren drei Kanälen nur eine begrenzte Zahl verschiedener Farben mischen kann.
  > Eine RGB-LED mischt aus drei Kanälen Millionen Farbtöne, am Senden scheitert es also nicht. Das Nadelöhr sitzt auf der anderen Seite.
- [ ] Weil der Empfänger für 256 Farben eine Zuordnungstabelle bräuchte, deren Durchsuchen je Symbol zu lange dauert.
  > 256 Einträge sind für einen Rechner nichts, ein einzelnes Byte hat so viele Werte, und das Nachschlagen dauert Bruchteile einer Mikrosekunde. Die Grenze ist nicht rechnerisch.
- [x] Weil der Empfänger die Symbole noch sicher auseinanderhalten muss: Je mehr es sind, desto enger rücken ihre Messbereiche zusammen.
  > Genau, hier greifen zwei Gedanken ineinander: Das Maß der Information sagt, was ein größeres Alphabet bringt, und der Abstand zwischen den Bereichen sagt, was es kostet. Wo das Gleichgewicht liegt, entscheiden Rauschen, Umgebungslicht und Messung.
- [ ] Weil ein Alphabet nur so viele Symbole braucht, wie der Text verschiedene Zeichen hat; weitere Farben blieben ungenutzt.
  > Zeichenvorrat und Alphabet hängen nicht so zusammen: Mehr Farben je Symbol heißt weniger Symbole je Zeichen, also schneller. Ungenutzt bliebe nichts; die Grenze liegt beim Empfänger, nicht beim Text.

> Ein größeres Alphabet trägt mehr je Symbol, bis das Rauschen benachbarte Symbole ununterscheidbar macht.

## Ein Empfänger erkennt jede Farbe fehlerfrei, die Trefferquote der Erkennung liegt bei 100 Prozent. Trotzdem kommt als Text nur Unsinn heraus. Was ist die wahrscheinlichste Ursache? {#si-008}

- [ ] Der Sensor liefert verfälschte Werte, etwa weil die Verstärkung zu hoch eingestellt ist.
  > Verfälschte Werte würden schon die Erkennung der Farben verderben. Die ist aber makellos, der Fehler liegt also hinter ihr.
- [x] Sender und Empfänger benutzen unterschiedliche Zuordnungen von Farben zu Zeichen.
  > Genau: Das Signal kommt perfekt an, aber die Vereinbarung ist gebrochen. Bedeutung steckt nicht im Licht, sondern in der Zuordnung, und die muss auf beiden Seiten identisch sein. Ein Klassiker, wenn Sender- und Empfängercode getrennt geschrieben wurden.
- [ ] Das Umgebungslicht verschiebt die Messwerte, sodass der Empfänger die Farben zwar sieht, aber in die falschen Bereiche einsortiert.
  > Falsch einsortierte Farben wären Erkennungsfehler, und die stünden dann nicht bei null. Die Erkennung ist hier aber makellos; der Fehler liegt hinter ihr.
- [ ] Das Alphabet hat weniger Farben als der Text verschiedene Zeichen, deshalb landen mehrere Zeichen auf derselben Farbe.
  > So ordnet niemand zu. Ein kleines Alphabet bildet Zeichen auf Gruppen von Symbolen ab, und das macht die Übertragung langsamer, nicht falscher.

> Perfekter Empfang mit verschiedenen Tabellen ergibt perfekten Unsinn.

## Ein Alphabet hat 16 Symbole. Wie viele Ja-Nein-Fragen braucht man höchstens, um ein empfangenes Symbol sicher zu bestimmen? {#si-009}

- [x] 4, denn viermal halbieren führt von 16 Möglichkeiten auf eine.
  > Genau: 16, 8, 4, 2, 1. Dieselbe Rechnung wie beim Kartenraten durch Halbieren, und zugleich die Aussage, dass ein Symbol aus 16 genau 4 Bit trägt.
- [ ] 8, denn jede Frage halbiert, und die Hälfte von 16 Möglichkeiten sind 8.
  > Halbieren heißt nicht, die Anzahl einmal zu halbieren, sondern zu zählen, wie oft man halbieren kann. Das sind bei 16 nur vier Schritte.
- [ ] 15, denn im schlechtesten Fall muss man 15 Symbole einzeln ausschließen.
  > So fragt, wer einzeln durchgeht. Das funktioniert, ist aber das langsame Verfahren; mit geschickten Fragen fällt mit jeder Antwort die Hälfte weg.
- [ ] 2, denn jede Frage hat zwei Antworten, und zweimal zwei Antworten decken 16 ab.
  > Zwei Fragen trennen nur vier Möglichkeiten, zwei mal zwei. Für 16 braucht es vier Verdopplungen.

> Die Zahl der Halbierungen ist log₂(16) = 4, und das ist zugleich die Zahl der Bits.

## Welche Aussagen über Bits treffen zu? {#si-010}

- [x] Ein Bit unterscheidet genau zwei Möglichkeiten.
  > Genau, das ist die Definition: an oder aus, ja oder nein, hell oder dunkel.
- [ ] Ein Bit und ein Byte bezeichnen dieselbe Menge, nur in verschiedenen Zusammenhängen.
  > Ein Byte sind acht Bit. Wer beides verwechselt, verrechnet sich bei jeder Größenangabe um den Faktor acht.
- [x] Jede Information lässt sich als Folge von Bits darstellen.
  > Richtig, und deshalb kann ein und dieselbe Technik Texte, Bilder und Töne transportieren. Wie die Zuordnung im Einzelnen aussieht, ist eine Frage der Codes.
- [ ] Bits gibt es nur in Computern, denn nur dort werden Zustände elektrisch gespeichert.
  > Ein Lichtschalter, ein Münzwurf, eine hochgezogene Flagge: Jedes davon ist ein Bit, ganz ohne Computer. Bits zählen Möglichkeiten, egal worin sie stecken.
- [ ] Eine Nachricht enthält mehr Bits, wenn ihr Inhalt wichtiger ist.
  > Information misst Möglichkeiten, nicht Wichtigkeit. Ein „Ja“ vor dem Traualtar und ein „Ja“ an der Wursttheke tragen dasselbe eine Bit.

> Bits zählen Möglichkeiten, unabhängig von Hardware und Wichtigkeit.

## Ein Alphabet hat vier Farben, jedes Symbol trägt also 2 Bit. Übertragen werden soll eine Kennung mit 12 Bit. Wie viele Symbole braucht das mindestens? {#si-011}

- [ ] 12, ein Symbol je Bit.
  > So wäre es bei nur zwei Farben. Vier Farben packen zwei Bit in jedes Symbol, das halbiert die Länge.
- [x] 6, denn 12 Bit geteilt durch 2 Bit je Symbol.
  > Genau, und diese Division ist die halbe Durchsatzrechnung: Bits geteilt durch Bits je Symbol ergibt die Zahl der Symbole, und mal Sekunden je Symbol die Dauer.
- [ ] 3, denn 12 geteilt durch 4 Farben.
  > Geteilt wird durch die Bits je Symbol, nicht durch die Zahl der Farben. Vier Farben tragen 2 Bit, nicht 4.
- [ ] 24, zur Sicherheit jedes Bit doppelt.
  > Absichern durch Wiederholung ist eine echte Technik, die Redundanz, aber eine eigene Entscheidung. Gefragt war das Minimum.

> Bits geteilt durch Bits je Symbol ergibt die Zahl der Symbole.

## Warum genügt im Prinzip ein Alphabet aus nur zwei Symbolen für jede noch so komplizierte Nachricht? {#si-012}

- [ ] Es genügt nicht: Für Texte braucht man mindestens 26 Symbole.
  > Der Ausweg ist die Gruppe: Fünf Zweiersymbole ergeben 32 Kombinationen, mehr als genug für 26 Buchstaben.
- [ ] Weil zwei Symbole im Signal am weitesten auseinanderliegen und der Empfänger sie deshalb nie verwechselt.
  > Das stimmt, beantwortet aber die Frage nicht: Robust erkennbar heißt nicht ausdrucksfähig. Dass zwei Symbole für jede Nachricht reichen, liegt am Gruppieren, nicht am Abstand.
- [x] Weil sich jedes Symbol eines größeren Alphabets durch eine feste Gruppe von Zweiersymbolen ersetzen lässt; es kostet nur Länge.
  > Genau, und deshalb ist das Bit die Universalwährung: Alles lässt sich in Zweierentscheidungen wechseln. Aus demselben Grund überlebt eine Norm, die in Bits statt in Farben festgelegt ist, sogar den Tausch des Trägers, etwa Ton statt Licht.
- [ ] Weil Computer intern ohnehin mit zwei Zuständen arbeiten und jede Nachricht schon vor dem Senden in dieser Form vorliegt.
  > Das ist eine Beobachtung, keine Begründung: Computer arbeiten so, weil das Gruppieren funktioniert, nicht umgekehrt.

> Was ein großes Alphabet je Symbol leistet, leisten zwei Symbole in der Gruppe.

## Was legt dieses Wörterbuch im Sinn von Symbolen und Information fest? {#si-013}

```python static
ALPHABET = {
    "red":    "00",
    "green":  "01",
    "blue":   "10",
    "yellow": "11",
}
```

- [ ] Die vier Farben, die eine Lampe erzeugen kann, jeweils mit dem Code, den der Hersteller dafür vorgesehen hat.
  > Eine Lampe kann weit mehr Farben erzeugen, als hier stehen, und die Codes stammen von dem, der die Tabelle geschrieben hat, nicht von einem Hersteller. Das Wörterbuch wählt aus und ordnet zu, es beschreibt keine Grenze der Hardware.
- [x] Die Vereinbarung: welches Symbol welche Bitgruppe trägt. Der Empfänger braucht exakt dieselbe Zuordnung, nur in Gegenrichtung.
  > Genau: Hier steht ein Alphabet als Code, vier Symbole mit je 2 Bit. Diese Zeilen sind die eine Hälfte der Absprache, und weichen Sender und Empfänger auch nur in einem Eintrag ab, wird aus perfektem Empfang perfekter Unsinn.
- [ ] Die Reihenfolge, in der die Farben gesendet werden: erst Rot, dann Grün, dann Blau, dann Gelb.
  > Die Reihenfolge bestimmt die Nachricht, nicht das Wörterbuch. Hier steht nur, was jede Farbe bedeutet; wann sie drankommt, entscheidet der Text.
- [ ] Wie viele Symbole je Sekunde gesendet werden, denn zwei Bit je Symbol legen das Tempo der Übertragung fest.
  > Bits je Symbol sagen, wie viel ein Symbol trägt, nicht wie lange es dauert. Über Zeit sagt das Wörterbuch nichts, und das ist Absicht: Die Bedeutung der Symbole und das Tempo der Übertragung sind getrennte Entscheidungen.

> Das Wörterbuch ist die Vereinbarung im Code, und es muss auf beiden Seiten identisch vorliegen.

## Sechzehn Gesichter, eines ist gesucht. Frage A lautet „Trägt es eine Brille?“, und acht der sechzehn tragen eine. Frage B lautet „Ist es Gesicht Nummer 7?“. Welche Frage bringt im Durchschnitt mehr? {#si-014}

- [x] Frage A: Sie bringt garantiert 1 Bit, Frage B im Durchschnitt nur etwa ein Drittel davon.
  > Frage A halbiert, egal wie die Antwort ausfällt: 16 werden zu 8, das ist genau 1 Bit. Frage B löst in einem von sechzehn Fällen alles auf (4 Bit), lässt aber in den anderen fünfzehn noch 15 Möglichkeiten übrig, was fast nichts einbringt. Im Mittel sind das etwa 0,34 Bit.
- [ ] Frage B: Ein „Ja“ löst das Rätsel sofort vollständig auf, das kann Frage A nie.
  > Das stimmt für den seltenen Glücksfall und ist die häufigste Fehlvorstellung. Du kannst dir aber nicht aussuchen, welche Antwort du bekommst, und in fünfzehn von sechzehn Fällen erfährst du fast nichts. Zähl, was eine Frage im Mittel einbringt, nicht im besten Fall.
- [ ] Beide gleich viel: Es sind beides Ja-Nein-Fragen, und eine Ja-Nein-Antwort ist ein Bit.
  > Ein Bit ist die Obergrenze einer Ja-Nein-Antwort, nicht ihr Wert. Erreicht wird sie nur, wenn beide Ausgänge gleich wahrscheinlich sind, und je schiefer die Frage, desto weniger bleibt davon übrig.
- [ ] Das hängt vom Glück ab und lässt sich vorher nicht sagen.
  > Der einzelne Ausgang hängt vom Glück ab, der Erwartungswert nicht. Genau deshalb lassen sich Fragen vergleichen, bevor du sie stellst, und genau das macht die halbierende Frage zur besten Strategie.

> Nur eine Frage, die das Feld halbiert, ist ein ganzes Bit wert; der Erwartungswert einer schiefen Frage liegt weit darunter.

## Im Morsecode ist der häufigste Buchstabe, das „e“, auch der kürzeste: ein einzelner Punkt. Seltene Buchstaben wie das „q“ sind lang. Warum lohnt sich diese Ungleichbehandlung? {#si-015}

- [ ] Weil kurze Codes weniger fehleranfällig sind und der häufigste Buchstabe deshalb am besten geschützt sein sollte.
  > Eher andersherum: Ein einzelner Punkt ist leichter zu übersehen als eine lange Folge. Der Gewinn liegt nicht bei der Sicherheit, sondern bei der Länge der ganzen Nachricht.
- [ ] Weil das „e“ der wichtigste Buchstabe ist und wichtige Zeichen zuerst ankommen sollen.
  > Häufig ist nicht dasselbe wie wichtig, und die Reihenfolge der Zeichen ändert sich dadurch ohnehin nicht. Entscheidend ist allein, wie oft ein Zeichen vorkommt.
- [x] Weil die durchschnittliche Nachricht dadurch kürzer wird: Was oft vorkommt, kostet dann wenig.
  > Genau darum geht es. Wenn Zeichen nicht gleich wahrscheinlich sind, trägt ein seltenes Zeichen mehr Information als ein häufiges, und es darf deshalb auch mehr Platz kosten. Auf dieser Beobachtung beruht jede Kompression.
- [ ] Weil ein Alphabet mit unterschiedlich langen Codes mehr Zeichen aufnehmen kann als eines mit gleich langen.
  > Die Zahl der darstellbaren Zeichen hängt an der Länge, nicht an ihrer Ungleichheit: Mit gleich langen Codes derselben Maximallänge lassen sich mindestens genauso viele Zeichen bilden. Der Gewinn ungleicher Längen liegt beim Durchschnitt.

> Häufige Symbole bekommen kurze Codes, dadurch wird die durchschnittliche Nachricht kürzer.

## Eine Strecke schafft zuverlässig nur zwei Symbole, hell und dunkel. Sie soll trotzdem ein Alphabet aus 32 Zeichen übertragen, indem sie mehrere Blitze zu einer Gruppe zusammenfasst. Wie viele Blitze braucht eine Gruppe mindestens? {#si-016}

- [ ] 16, also die Hälfte der Zeichenzahl.
  > Die Zahl der Blitze wächst nicht proportional zur Zeichenzahl, sondern logarithmisch: Jeder zusätzliche Blitz verdoppelt die Zahl der Gruppen, statt sie um zwei zu erhöhen. 16 Blitze reichten für 65.536 Zeichen.
- [x] 5, denn zwei hoch fünf sind 32.
  > Jeder Blitz trägt eine Entscheidung zwischen zwei Möglichkeiten, also ein Bit; fünf Blitze tragen fünf Bit und unterscheiden damit 32 Gruppen. Das ist die Halbierungsrechnung, nur andersherum gelesen.
- [ ] 32, denn für jedes Zeichen wird ein Blitz gebraucht.
  > Das wäre der Fall, wenn jedes Zeichen ein eigenes Symbol bekäme, aber es gibt nur zwei Symbole. Genau deshalb werden mehrere Blitze zu einer Gruppe zusammengefasst.
- [ ] 6, weil eine zusätzliche Stelle für die Abgrenzung der Gruppen gebraucht wird.
  > Der Gedanke ist nicht dumm, denn irgendwie muss der Empfänger die Gruppen trennen. Dafür genügt aber die feste Länge selbst: Wenn jede Gruppe fünf Blitze hat, zählt der Empfänger einfach mit. Eine eigene Trennstelle braucht nur, wer unterschiedlich lange Gruppen zulässt.

> n Blitze mit je zwei Möglichkeiten ergeben 2ⁿ Gruppen, und 2⁵ = 32.
