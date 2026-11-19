---
title: "Quiz: Eine Karte der Bedeutung"
summary: >-
  Zehn Fragen zum Experiment über die Karte der Bedeutung, jede Antwort mit
  ihrer Begründung. Die Fragen stammen aus dem Pool des Moduls und haben das
  Format seiner Klausur.
translation_of: en
based_on: 2026-11-19
---

## Was ist ein Embedding? {#mm-001}

- [x] Eine Liste von Zahlen für den Ort eines Textes auf einer Karte, auf der Bedeutungsähnliches nah beieinanderliegt.
  > Richtig: Ähnliche Bedeutung heißt nahe Orte, beim Modell im Experiment mit 384 Zahlen je Text.
- [ ] Eine verkleinerte Kopie des Textes, aus der sich der Text wiederherstellen lässt.
  > Aus den Zahlen lässt sich der Text nicht zurückgewinnen; sie sagen nur, wo er auf der Karte liegt.
- [ ] Die Liste der Schlüsselwörter, die in einem Text vorkommen.
  > Eine Suche nach Schlüsselwörtern vergleicht Buchstaben; ein Embedding findet auch Texte, die kein Wort mit der Anfrage teilen.
- [ ] Eine Kennnummer, unter der ein Text in einer Datenbank abgelegt wird.
  > Eine Kennnummer sagt nichts über die Bedeutung; die Zahlen eines Embeddings lassen sich dagegen vergleichen.

## Das Modell im Experiment liefert für dog und puppy die Ähnlichkeit 0,81, für dog und cat 0,66 und für dog und car 0,48. Was zeigt das? {#mm-002}

- [ ] Wörter mit ähnlichen Buchstaben bekommen ähnliche Zahlen.
  > Dann müsste car näher an cat liegen als puppy; die Buchstaben spielen für die Karte keine Rolle.
- [ ] Das Modell hat ein Wörterbuch mit Synonymen gespeichert und schlägt darin nach.
  > Niemand hat dem Modell Synonyme eingegeben; die Nähe ist beim Training entstanden, weil die Wörter ähnlich verwendet werden.
- [ ] Eine Ähnlichkeit unter 0,5 bedeutet, dass zwei Wörter Gegensätze sind.
  > Gegensätze wie hot und cold liegen sogar recht nah beieinander; unter 0,5 heißt nur weniger verwandt.
- [x] Je ähnlicher die Bedeutung, desto näher liegen die Wörter auf der Karte.
  > Richtig: Welpe und Hund liegen am nächsten, ein Auto am weitesten weg, obwohl car fast wie cat aussieht.

## Warum liegen hot und cold auf der Karte des Modells nah beieinander (0,53), fast so nah wie hot und warm (0,68)? {#mm-003}

- [ ] Das Modell hat bei diesen beiden Wörtern einen Fehler gemacht, der beim nächsten Training verschwindet.
  > Es ist kein Zufall: Fast alle Gegensätze liegen auf solchen Karten nah beieinander, weil sie in denselben Zusammenhängen stehen.
- [x] Gegensätze werden an denselben Stellen verwendet, etwa für Wetter, Getränke oder einen Ofen, und die Karte erfasst das Thema eines Wortes, kaum seine Richtung.
  > Richtig: Wörter mit denselben Nachbarn bekommen ähnliche Zahlen, und genau das gilt für Gegensätze.
- [ ] Gegensätze bekommen immer eine Ähnlichkeit nahe −1, und 0,53 ist bei diesem Modell nur anders skaliert.
  > Bei diesem Modell kommen negative Werte fast nie vor; ein gegensätzlicher Sinn heißt nicht entgegengesetzte Richtung.
- [ ] Beide Wörter bestehen aus drei bis vier Buchstaben und werden deshalb in dieselben Tokens geschnitten.
  > hot und cold sind zwei verschiedene Tokens; die Länge eines Wortes bestimmt nicht seine Zahlen.

## Die Rechnung king − man + woman ergibt beim Modell im Experiment queen. Warum funktioniert das? {#mm-004}

- [ ] Die Entwickler haben dem Modell die Regel beigebracht, dass man männliche Wörter in weibliche umwandeln kann.
  > Niemand hat diese Richtungen eingegeben; sie sind beim Training von selbst entstanden.
- [ ] Das Modell schlägt in einer Tabelle von Wortpaaren nach, welches Wort zu king und woman passt.
  > Es gibt keine solche Tabelle; das Ergebnis ist das Wort, dessen Zahlen dem Ergebnis der Rechnung am nächsten liegen.
- [x] Die Subtraktion nimmt eine Richtung heraus, hier ein Mann zu sein, die Addition setzt eine andere ein, und der Rest, etwas Königliches, bleibt erhalten.
  > Richtig: Weil die Zahlen Richtungen sind, kann man mit ihnen rechnen, Stelle für Stelle.
- [ ] Die Buchstaben von man werden aus king entfernt und die von woman angehängt.
  > Gerechnet wird mit den 384 Zahlen der Wörter, nicht mit ihren Buchstaben.

## Das Token bank bekommt in „The bank raised its interest rates.“ andere Zahlen als in „We watched the ducks from the bank of the river.“ Warum? {#mm-005}

- [ ] Das Modell hat für jede Bedeutung von bank einen eigenen Eintrag in seiner Tabelle und wählt den passenden aus.
  > Beide Sätze beginnen beim selben Eintrag der Tabelle; erst die Verarbeitung im Satz ändert die Zahlen.
- [ ] Die Position im Satz allein bestimmt die Zahlen, und bank steht in beiden Sätzen an verschiedenen Stellen.
  > Die Position fließt mit ein, entscheidend sind aber die Nachbarn: river oder interest rates.
- [ ] Das Modell lost bei jedem Aufruf zufällig etwas andere Zahlen aus.
  > Ein Embedding-Modell rechnet ohne Zufall; derselbe Satz bekommt immer dieselben Zahlen.
- [x] In mehreren Runden schaut jedes Token auf alle anderen Tokens des Satzes und verschiebt seine Zahlen zu denen, die für es wichtig sind.
  > Richtig: Das ist die Attention, und so landet bank nach river woanders als nach interest rates.

## Wie kommt das Modell im Experiment von den Zahlen seiner Tokens zu einer einzigen Liste für den ganzen Text? {#mm-006}

- [x] Es bildet nach dem Anpassen den Durchschnitt aller Listen, Stelle für Stelle, und skaliert das Ergebnis auf die Länge 1.
  > Richtig: Diese eine Liste von 384 Zahlen ist das Embedding des Textes.
- [ ] Es nimmt die Zahlen des ersten Tokens, weil dieses für den ganzen Text steht.
  > Dieses Modell nimmt alle Tokens; der Anfangsmarker [CLS] zählt nur wie jedes andere Token mit.
- [ ] Es hängt die Listen aller Tokens hintereinander, so dass längere Texte längere Listen bekommen.
  > Jeder Text bekommt gleich viele Zahlen, 384, sonst ließen sich Texte verschiedener Länge nicht vergleichen.
- [ ] Es zählt, wie oft jedes Wort im Text vorkommt, und schreibt die Zählungen in die Liste.
  > Zählungen der Wörter wären eine Schlüsselwortsuche; das Embedding entsteht aus den gelernten Zahlen der Tokens.

## Die Suche nach „I can't get home tonight“ findet zuerst die Karte „My train was cancelled and I missed the last connection.“, obwohl beide kein Wort gemeinsam haben. Wie kommt das? {#mm-007}

- [ ] Die Suche ergänzt die Anfrage um Synonyme und sucht dann nach gemeinsamen Wörtern.
  > Synonyme werden nicht ergänzt; eine Suche nach Wörtern hätte für diese Anfrage gar nichts gefunden.
- [x] Auch die Anfrage wird in 384 Zahlen umgerechnet, und die Suche listet die Karten, deren Zahlen denen der Anfrage am ähnlichsten sind.
  > Richtig: Gesucht wird nach Nähe auf der Karte, also nach Bedeutung, nicht nach Buchstaben.
- [ ] Das Modell versteht die Situation und weiß, dass ein ausgefallener Zug einen nicht nach Hause bringt.
  > Das Modell vergleicht nur Zahlen; dass es kein Weltwissen prüft, zeigt etwa die Verneinung, die es kaum bemerkt.
- [ ] Die Karte wurde zuletzt hinzugefügt und steht deshalb oben.
  > Die Reihenfolge ergibt sich allein aus der Ähnlichkeit zur Anfrage, nicht aus der Reihenfolge der Karten.

## Was erfasst die Karte eines Embedding-Modells wie im Experiment kaum? (Mehrere richtige Antworten möglich.) {#mm-008}

- [x] Eine Verneinung: „I do not love this film.“ liegt nah an „I love this film.“
  > Richtig: Beide Sätze handeln davon, diesen Film zu lieben, und ein kleines Wort ändert das Thema nicht (0,74).
- [x] Die Wortfolge: „The dog bit the man.“ und „The man bit the dog.“ sind fast gleich.
  > Richtig: Beide Sätze haben dieselben Tokens, und der Durchschnitt kümmert sich nicht um die Reihenfolge (0,97).
- [x] Ob eine Aussage wahr ist: „Vaccines cause autism.“ und „Vaccines do not cause autism.“ liegen nah beieinander.
  > Richtig: Die Karte beantwortet, worum es geht, nicht, ob es stimmt (0,86).
- [ ] Das Thema eines Textes, etwa ob er von Reisen oder vom Kochen handelt.
  > Das Thema ist genau das, was die Karte gut erfasst: Die Reisekarten liegen zusammen, das Rezept weit weg.

## Ein Chatbot soll Fragen aus den Unterlagen einer Hochschule beantworten (Retrieval-Augmented Generation). Welche Rolle spielen Embeddings dabei? {#mm-009}

- [x] Sie finden die Absätze, die der Frage am ähnlichsten sind, und diese kommen in den Kontext des Sprachmodells.
  > Richtig: Die Frage wird in Zahlen umgerechnet, die Suche nach Bedeutung findet die Absätze, und das Sprachmodell schreibt daraus die Antwort.
- [ ] Das Sprachmodell wird mit den Embeddings der Unterlagen neu trainiert, bevor es antwortet.
  > Neu trainiert wird nichts; die passenden Absätze werden bei jeder Frage nachgeschlagen.
- [ ] Die Embeddings prüfen, ob die Antwort des Sprachmodells wahr ist.
  > Ob etwas stimmt, erfasst die Karte kaum; sie findet auch Absätze, die das Gegenteil behaupten.
- [ ] Die Embeddings übersetzen die Antwort am Ende in die Sprache der Frage.
  > Übersetzen ist nicht ihre Aufgabe; ein Embedding ist eine Liste von Zahlen und kein Text.

## Woher kommen die Zahlen eines Embedding-Modells? {#mm-010}

- [ ] Fachleute haben für jede der 384 Richtungen festgelegt, was sie bedeutet, etwa Tier, Geld oder Reise.
  > Niemand hat die Richtungen gewählt; die meisten bedeuten nichts, was ein Mensch benennen könnte.
- [ ] Sie werden aus den Buchstaben eines Wortes berechnet, jeder Buchstabe ergibt eine feste Zahl.
  > Dann lägen car und cat nah beieinander; tatsächlich liegt puppy viel näher an cat.
- [x] Sie wurden gelernt: Wörter in denselben Zusammenhängen bekommen ähnliche Zahlen, zusammengehörige Texte rücken näher.
  > Richtig: „You shall know a word by the company it keeps“, danach Training mit über einer Milliarde Textpaaren.
- [ ] Sie werden bei jeder Anfrage zufällig neu vergeben.
  > Dann wären Ähnlichkeiten bedeutungslos; die Zahlen liegen nach dem Training fest.
