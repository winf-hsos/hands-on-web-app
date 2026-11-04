# Entwurf: Input „Next-Token Prediction“

**Status:** Entwurf vom 22.10.2026, von Nicolas am selben Tag freigegeben (eigenes Deck, Name passt) und gebaut (`next-token-prediction.html`, 24 Folien, 52 Frames). Abweichungen beim Bau: Eröffnungssatz ohne Zeitbezug („every answer of a language model is written one token at a time.“), Antworten der Abfragen auf höchstens 26 Zeichen gekürzt, Top p mit 0.6 statt 0.9 (damit der Schnitt sichtbar vor dem Rest liegt), Temperatur echt gerechnet mit 1000 Resttokens.
**Verortung:** Eigenes Deck zur neuen Konzeptseite „Next-Token Prediction“
(`website\concepts\next-token-prediction.qmd`). Es wird im Anschluss an das
Experiment „An AI on Your Laptop“ gezeigt, während LM Studio auf allen Laptops
noch offen ist. Gedacht für Applications of AI und Problem Solving with AI.
Ohne Termine und ohne Verweise auf „nächste Woche“.
**Kernbotschaft:** *A language model writes one token at a time, and the whole
context flows into the prediction of every single one.*
**Publikum:** Master Agrar und Lebensmittel; haben eben Gemma 3 1B und 4B
lokal laufen lassen und Tokens pro Sekunde gemessen, kennen aus „Be the Agent“
den Kartenstapel als Kontext.
**Dauer:** rund 30 Minuten; 22 Folien, davon drei Live-Abfragen und drei
Live-Momente in LM Studio.
**Bewusst nicht drin:** wie Embeddings entstehen (eigene Sitzung), wie
Attention rechnet (später), Training.
**Sprache:** Englisch, `style.toml` des Bereichs (Pink). Notizen deutsch.
**Titelfolie ohne Datum.**

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Vergleich |
| 💬 | Merksatz |
| 🪜 | Aufbau in Schritten |
| 🧪 | Live-Moment |
| 🗳️ | Live-Abfrage |

# Die Folien

## Teil 0: Titel und Eröffnung (3 Folien)

### Folie 1
**Titel:** `next-token prediction` · **Untertitel:** `artificial intelligence · prof. dr. nicolas meseth`

### Folie 2
Agenda aus `data-parts`: tokens · one at a time · choosing · the context · the transformer

### Folie 3 📷
**Bild:** Eine alte Schreibmaschine auf einem dunklen Tisch, von oben schräg
fotografiert; im eingespannten Papier steht eine halbe Zeile Text, und genau
eine Taste ist gedrückt und von einem schmalen Lichtstrahl getroffen, alles
andere liegt im Dunkeln. Schwarzer Hintergrund, keine lesbare Schrift, keine
Logos.
**Text:** `every answer you just saw was written one token at a time.`
**Dazu sagen.** Ihr habt eben gemessen, wie viele Tokens pro Sekunde euer
Laptop schafft. Jetzt sehen wir nach, was ein Token ist und was in jedem
dieser Schritte passiert.

## Teil 1: tokens (4 Folien)

### Folie 4 🎬
`tokens`

### Folie 5 🖼️🪜
**Titel klein:** `a token is a piece of text`
**Zeichnung:** Der Satz `the farmer drove the tractor into the` in farbigen
Kästchen, ein Kästchen je Token; Schritt 1: darunter je Kästchen eine Zahl
(die Nummer im Wortschatz). Fußnote: `split and numbers for illustration`.
**Dazu sagen.** Das Modell sieht keine Buchstaben, sondern Nummern aus einer
festen Liste. Häufige Wörter sind ein Token, seltene werden zerlegt.

### Folie 6 🖼️🪜
**Titel klein:** `rare words fall apart`
**Zeichnung:** Drei Wörter, je zerlegt: `tractor` (ein Token),
`unbelievable` (`un · believ · able`), `Düngebedarfsermittlung` (sechs bis
acht Stücke). Schritt 1: Zeile `english: about ¾ of a word per token ·
german: more tokens for the same text`.
**Dazu sagen.** Deutsche Fachbegriffe kosten viele Tokens; das ist einer der
Gründe, warum ein deutscher Text langsamer und teurer ist als ein englischer.
**Live-Moment (optional):** OpenAI-Tokenizer im Browser, denselben Satz
englisch und deutsch einfügen.

### Folie 7 📊
**Titel klein:** `the vocabulary`
**Text:** groß `262,000` · darunter `tokens in the vocabulary of gemma 3`
**Dazu sagen.** Alles, was das Modell je schreiben kann, setzt sich aus diesen
Stücken zusammen. Wie aus den Nummern Bedeutung wird, ist ein eigenes Thema.

## Teil 2: one at a time (5 Folien)

### Folie 8 🎬
`one at a time`

### Folie 9 🗳️
**Abfrage (Quiz):** `in one step, what does the model compute?`
Antworten: `the next word` · `the whole answer` · `a probability for every token in its vocabulary` · `the answer it found on the internet`
Richtig: `a probability for every token in its vocabulary`

### Folie 10 🖼️🪜
**Titel klein:** `the field, the barn, or the yard?`
**Zeichnung:** Oben der Satz `the farmer drove the tractor into the …`,
darunter ein Balkendiagramm: `field` 41 %, `barn` 22 %, `yard` 9 %, `shed`
6 %, `mud` 4 %, `…` (der Rest). Schritt 1: Hinweis
`262,000 bars, most of them almost zero`. Fußnote: `probabilities for illustration`.
**Dazu sagen.** Das ist alles, was ein Modell ausgibt: eine Liste. Die
Antwort entsteht erst danach.

### Folie 11 🖼️🪜
**Titel klein:** `the loop`
**Zeichnung:** Kreislauf in vier Schritten, im Aufbau nacheinander:
`context` → `model` → `probabilities` → `pick one token` → zurück an das Ende
des Kontexts. Darunter wächst eine Zeile mit jedem Schritt um ein Token:
`the farmer drove the tractor into the field` → `… field ,` → `… field , where`.
Schritt 4: `until an end token, or the maximum length`.
**Dazu sagen.** Autoregressiv heißt: Jede Ausgabe wird wieder Eingabe. Jeder
Umlauf ist ein Durchgang durch alle Parameter, deshalb messen wir
Geschwindigkeit in Tokens pro Sekunde (Bezug zum Experiment).

### Folie 12 💬
**Text:** `the model writes the most plausible continuation, which is not always the true one.`
**Dazu sagen.** Ein geschriebenes Token wird nie zurückgenommen; hat das
Modell früh falsch abgebogen, baut es darauf auf. Daher kommen
Halluzinationen: flüssig und falsch, mit derselben Sicherheit.

## Teil 3: choosing (4 Folien)

### Folie 13 🗳️
**Abfrage (Quiz):** `ask the same question twice: why do you get two different answers?`
Antworten: `the model learned from the first chat` · `the next token is drawn at random from the list` · `the server switched to another model` · `the model looked it up again`
Richtig: `the next token is drawn at random from the list`

### Folie 14 🖼️🪜
**Titel klein:** `temperature`
**Zeichnung:** Dasselbe Balkendiagramm wie auf Folie 10 dreimal
nebeneinander, gerechnet (Softmax mit Temperatur aus denselben Werten):
`0` (nur `field`), `1` (wie berechnet), `2` (fast flach). Je Schritt eine
Spalte.
**Dazu sagen.** Die Temperatur macht die Liste spitzer oder flacher. Bei 0
immer dieselbe Antwort, bei hohen Werten haben auch unwahrscheinliche Tokens
eine Chance.

### Folie 15 🖼️
**Titel klein:** `top k and top p`
**Zeichnung:** Das Balkendiagramm mit zwei Schnittlinien: `top k = 3` hinter
dem dritten Balken; `top p = 0.9` dort, wo die Summe 90 % erreicht.
**Dazu sagen.** Beide schneiden den Schwanz der Liste ab, bevor gezogen wird.
Top p passt sich an: Ist das Modell sicher, bleiben wenige Kandidaten, ist es
unsicher, viele.

### Folie 16 🧪
**Titel klein:** `turn the dial`
**Text:** drei Zeilen: `same question, temperature 0, three times` ·
`same question, temperature 1, three times` · `raise the temperature until it falls apart`
**Live-Moment:** In LM Studio in den Entwicklermodus wechseln, damit die
Einstellungen sichtbar sind; Gemma 3 1B, eine kurze Frage aus dem Experiment.
Zum Schluss: Bei welcher Temperatur kippte es?
**Dazu sagen.** Das Modell ändert sich dabei nicht; geändert wird nur, wie
aus der Liste gezogen wird.

## Teil 4: the context (4 Folien)

### Folie 17 🎬
`the context`

### Folie 18 🖼️🪜
**Titel klein:** `everything it sees`
**Zeichnung:** Ein Stapel wie die Karten aus „Be the Agent“, von unten nach
oben im Aufbau: `system prompt` · `the conversation so far` · `your document`
· `the answer so far`. Daneben: `the model remembers nothing between two calls`.
Schritt 3: drei Aufrufe nebeneinander, der Stapel wird mit jeder Nachricht
höher, weil das Programm das ganze Gespräch jedes Mal neu schickt.
**Dazu sagen.** Der Kartenstapel im Spiel war genau das. Ein Chat wirkt wie
ein Gegenüber mit Gedächtnis, aber gesendet wird jedes Mal alles.

### Folie 19 🗳️
**Abfrage (Quiz):** `how many tokens fit into the context of gemma 3 4b?`
Antworten: `4,000` · `32,000` · `128,000` · `no limit`
Richtig: `128,000`
**Dazu sagen.** Gemma 3 1B: 32,000. Große Cloud-Modelle schaffen eine Million
und mehr.

### Folie 20 🪜🧪
**Titel klein:** `why there is a limit`
**Text:** im Aufbau: `trained on texts up to a certain length` ·
`every new token is related to every token before it` ·
`every token in the context needs memory`; dann: `when it is full, the beginning is gone.`
**Live-Moment:** Gemma 3 1B mit sehr kurzer Kontextlänge neu laden (in den
Ladeeinstellungen), einen langen Text einfügen, nach dem ersten Absatz fragen.
**Dazu sagen.** Längerer Kontext heißt mehr RAM; das sieht man in LM Studio
direkt beim Laden.

## Teil 5: the transformer (2 Folien)

### Folie 21 🖼️🪜
**Titel klein:** `it, the tractor or the gate?`
**Zeichnung:** Der Satz `the tractor did not fit through the gate because it was too wide`;
Schritt 1: eine Linie von `it` zu `tractor`; Schritt 2: das Ende wechselt zu
`too narrow`, die Linie springt zu `gate`. Darunter klein:
`transformer, 2017: when predicting the next token, look at all tokens of the context at once`.
**Dazu sagen.** Frühere Modelle lasen Wort für Wort und trugen eine
Zusammenfassung mit, die nach hinten verschwamm. Der Transformer betrachtet
alle Tokens zugleich und lernt, welche gerade wichtig sind; das heißt
Attention. Wie das rechnet, kommt später.

### Folie 22 💬
**Titel klein:** `key takeaway`
**Text:** `a language model writes one token at a time, and the whole context flows into the prediction of every single one.`

## Danach

- Reflexionsfragen und „see also: transformer explainer“ wie in den anderen
  Decks am Ende, falls gewünscht (zwei Folien mehr).

# Offene Fragen

1. **Eigenes Deck oder Teil von „Open Models“?** Mein Vorschlag ist ein eigenes
   Deck, weil das Open-Models-Deck schon 74 Frames hat und das Konzept eine
   eigene Seite bekommt. In der Sitzung läuft es direkt nach dem Experiment.
2. **Überschneidung mit „Tokens, Probabilities and Meaning“** (laut Modulplan
   die nächste Sitzung): Tokens und Wahrscheinlichkeiten wären dann hier
   abgedeckt, und die nächste Sitzung könnte sich auf Bedeutung, also
   Embeddings, konzentrieren. Soll ich den Modulagenten danach fragen?
3. **LM Studio:** Die Doku nennt nur Temperature, Top P und Max Tokens
   wörtlich. Wie die Einstellungen für Top K, Kontextlänge und die Regel bei
   vollem Kontext in der aktuellen Fassung heißen, steht dort nicht, und eine
   Anzeige der Token-Wahrscheinlichkeiten gibt es laut Doku nicht. Darum zeigen
   die Folien die Wahrscheinlichkeiten als Zeichnung, und die Live-Momente
   nennen nur Temperatur, Länge und Kontextlänge.
4. **Experimentanleitung:** Soll „An AI on Your Laptop“ eine Erweiterung
   „Turn the dials“ bekommen (Temperatur, Länge, Kontextlänge), passend zu
   Folie 16 und 20?
