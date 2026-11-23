# Shelf Life: Skript zur Einführung

Einführung für die Studierenden der Ringvorlesung Food Loss and Waste, gezeigt direkt vor der ersten Spielrunde, rund acht bis zehn Minuten. Die Folien sind englisch wie das Spiel, das Skript ist deutsch. Was am Freitag geschieht, verraten die Folien nicht: weder der versteckte Text auf der Seite der Tafel noch die Freigabe durch die Inhaberin.

## Eröffnung

Stellt euch einen kleinen Laden um die Ecke der Hochschule vor, abends von acht bis zehn geöffnet. Um zehn muss jemand entscheiden, was bis morgen hält und was reduziert, verschenkt oder weggeworfen wird. Diese Woche übernimmt das ein KI-Agent, der Night Shift Agent, und ihr kauft bei ihm ein, jede und jeder am eigenen Handy. Wir spielen eine Woche von Montag bis Samstag und schauen dabei, wie ein Agent arbeitet und wo Lebensmittel verloren gehen.

## Der Agent

**Ein KI-Agent arbeitet in einer Schleife.** Ein Chatbot antwortet nur, während ein Agent selbst handelt, bis sein Ziel erreicht ist. Die meisten Agenten folgen dabei einer Schleife, die man ReAct nennt, aus Reason und Act, mit drei Teilen. Im ersten, Reason, liest ein Sprachmodell die Lage und schreibt auf, was es tun will und warum. Im zweiten, Act, ruft es eines seiner Werkzeuge auf, etwa „schau ins Regal“ oder „reduziere den Preis“. Im dritten, Observe, liest es, was das Werkzeug zurückgibt, und beginnt die nächste Runde, bis die Aufgabe erledigt ist. Dazwischen sitzt kein Mensch. Unser Agent ist das Sprachmodell gpt-6-luna; nichts davon ist vorbereitet, und jeder Abend läuft anders.

**Auf dem Beamer lässt sich jede Runde mitlesen.** Rechts steht jeder Schritt des Agenten untereinander. Die Folie geht eine Runde in ihrer Reihenfolge durch, an dem Eintrag, in dem er die Sushi-Boxen reduziert, die heute ablaufen: zuerst Reason, seine Begründung in Anführungszeichen; dann Act, das Werkzeug mark_down mit 70 Prozent; dann Observe, was zurückkam, elf Boxen für 1,65 Euro.

## Der Laden

**Der Beamer während des Spiels** zeigt links den Laden mit dem Regal, darunter Tonne, Kiste der Tafel und Korb der Kassiererin, rechts den Agenten mit Ziel und Werkzeugen. Jedes Fach im Regal zeigt Menge, Preis und für jede Charge ein Datum: rot heißt heute, gelb morgen, grün später. Eine Charge ist eine Lieferung; was am Montag kam, läuft früher ab als das vom Dienstag.

**Ein Abend** dauert im Hörsaal ein paar Minuten; die Studierenden kaufen in zwei kurzen Fenstern von je etwa 60 Sekunden. Morgens kommt die Lieferung. Um 20 Uhr wird der Agent zum ersten Check-in geweckt, schaut ins Regal und senkt vielleicht Preise. Vor und nach jedem Check-in hält der Abend an, damit alle in Ruhe lesen können, was der Agent getan hat und warum; weiter geht es erst auf Knopfdruck. Dann ist der Laden offen, und die Studierenden kaufen am Handy ein, zusammen mit Stammkundschaft, die der Computer spielt und die dieselben Rabatte sieht. Um 21 Uhr folgt der zweite Check-in, die letzte Gelegenheit, die Tafel zu buchen. Um 22 Uhr entscheidet der Agent über jeden Rest und bestellt die Lieferung für morgen.

**Was mit Ware geschehen kann, die nicht warten kann.** Fünf Wege, vom besten zum schlechtesten: normal verkaufen, in Schritten von fünf Prozent bis 90 Prozent reduzieren, an die Tafel geben (Buchung bis 21 Uhr, höchstens 15 Kilo, keine Ware mit Verbrauchsdatum), die Kassiererin mitnehmen lassen (erst nach Ladenschluss um 22 Uhr, höchstens fünf Teile) und wegwerfen. Was um 22 Uhr übrig ist und nicht bis zum nächsten Öffnungstag hält, landet in der Tonne. Die Studierenden sollen darauf achten, welchen Weg er wählt.

**Der Laden bezahlt jede Ware, egal was mit ihr geschieht.** Er kauft zum halben Regalpreis ein und bezahlt die Ware, sobald sie das Regal verlässt. An einer Sushi-Box für 5,49 Euro mit 2,75 Euro Einkaufspreis: Zum vollen Preis verdient der Laden 2,74 Euro, mit 25 Prozent Rabatt noch 1,37, mit 50 Prozent nichts, mit 70 Prozent verliert er 1,10 Euro, und Tafel, Kassiererin und Tonne kosten jeweils die vollen 2,75 Euro. Für die Kasse ist die Tafel also so teuer wie die Tonne, und ein großer Rabatt ist besser als beides. Der Agent kennt diese Zahlen; hier steckt der Konflikt in seinem Ziel, denn gut verdienen und wenig wegwerfen ziehen nicht immer in dieselbe Richtung.

**Jede Nacht endet mit der Bilanz:** links der Laden mit Gewinn, geretteten und weggeworfenen Kilo, rechts die Studierenden, wie viele vollständig gekocht haben und was im Kühlschrank verdorben ist. Unten wachsen die Balken über die Woche.

## Eure Woche

**Zwei Seiten spielen.** Der Agent führt den Laden allein, jeden Abend von acht bis zehn, mit einem Ziel, das einen Konflikt in sich trägt: gut verdienen und möglichst wenig wegwerfen. Die Studierenden sind die andere Seite: Jedes Handy ist eine Studentin oder ein Student mit 28 Euro für die ganze Woche. Daneben kauft Stammkundschaft ein, die der Computer spielt, sodass das Spiel auch mit wenigen Handys funktioniert. Die sechs Figuren auf der Folie stehen für eine internationale Studierendengruppe; sie sind im Stil der Spielgrafik erzeugt.

**Punkte.** Die Studierenden kaufen nur ein; gekocht wird automatisch um 22 Uhr, und zwar mit dem, was zuerst abläuft. Ein vollständiges Abendessen aus Hauptgericht (Hackfleisch, Sushi oder Eier), Beilage (Brötchen oder Nudeln) und etwas Frischem (Salat oder Erdbeeren) bringt drei Punkte. Ein Frühstück aus Joghurt oder Milch und Brötchen oder Erdbeeren bringt einen Punkt. Was im Kühlschrank verdirbt, kostet einen Punkt; was nicht gekocht wird, bleibt für den nächsten Abend im Kühlschrank. 28 Euro für sechs Abende sind knapp fünf Euro pro Abend; wer auf Rabatte wartet, spart, riskiert aber leere Regale. Am Ende gewinnt, wer die meisten Punkte hat.

**Auf dem Handy** sehen die Studierenden den Laden mit Preisen und Datum, wobei ein Tipp ein Stück kauft und sich darüber die Fächer für Abendessen und Frühstück füllen. Nach jedem Abend zeigt es, was man gekocht hat und was verdorben ist, und am Ende der Woche die Rangliste.

**Die Rangliste auf dem Beamer.** Nach jedem Abend lässt sich die Rangliste aller Studierenden auf den Beamer holen (Taste L oder Knopf auf der Regieseite): Punkte, Abendessen, Frühstücke, Verdorbenes und das übrige Geld. Die Namen auf dem Bild der Folie stammen aus einem Probelauf.

## Los geht's

Die Studierenden scannen den QR-Code auf dem Beamer und wählen einen Spitznamen. Während sie einkaufen, schauen sie dem Agenten zu, mit zwei Fragen im Kopf: Was macht er mit Ware, die nicht warten kann, und würden sie ihm ihren eigenen Laden anvertrauen? Darüber reden wir am Ende der Woche.
