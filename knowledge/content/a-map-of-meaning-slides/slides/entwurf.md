# Entwurf: Input „A map of meaning“

**Status:** Entwurf vom 05.11.2026, von Nicolas am selben Tag freigegeben,
gebaut (`a-map-of-meaning.html`) und seit dem 05.11.2026 online. Ab jetzt ist
die HTML-Datei die Quelle; dieser Entwurf wird nicht mehr nachgezogen.
**Verortung:** Deck zum Experiment `a-map-of-meaning` (Text-Embeddings). Es
begleitet das Experiment Schritt für Schritt: je Schritt ein kurzer Input, der
den Begriff oder die Idee erklärt, bevor die Gruppen am Demonstrator weiter
arbeiten. Auf der Seite des Experiments wird es oben eingebettet, als eigenes
Item `a-map-of-meaning-slides`.
**Kernbotschaft:** *A model turns every word and every text into a list of
numbers, a place on a map of meaning, so that a computer can search, compare
and even compute with meaning.*
**Publikum:** Studierende ohne Informatikhintergrund; sie kennen Tokens und
die Vorhersage des nächsten Tokens, aber noch keine Embeddings.
**Dauer:** rund 25 Minuten Input, verteilt über die 90 Minuten des
Experiments; 31 Folien, davon 7 Abschnittsfolien.
**Sprache:** Englisch, `style.toml` des Bereichs KI (Pink). Notizen deutsch.
**Titelfolie ohne Datum**, das Experiment kehrt wieder; kein Modulname, keine
Verweise auf andere Sitzungen oder Inhalte der Plattform.
**Keine Live-Abfragen und keine eingebetteten Demonstratoren:** Die Arbeit am
Modell geschieht auf der Seite des Experiments, das Deck zeigt die dort
gemessenen Werte.

**Farben:** Grau für alles Gewöhnliche; Pink (Rolle `blue`) für das, worauf
die Folie zeigt, etwa das Token „bank“, den Pfeil der Rechnung oder das
nächste Wort; Gelb für das Ergebnis einer Rechnung oder Suche (der Stern, wie
im Demonstrator). Grün und Rot kommen nicht vor, weil das Deck nichts bewertet.

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Vergleich |
| 💬 | Merksatz |
| ⌨️ | Code |
| 🪜 | Aufbau in Schritten |
| 🎞️ | Animation |

# Die Folien

## Teil 0: Titel und Eröffnung (3 Folien)

### Folie 1
**Titel:** `a map of meaning` · **Untertitel:** `prof. dr. nicolas meseth`

### Folie 2
Agenda aus `data-parts`: a map by hand · tokens get numbers · computing with
meaning · from tokens to a text · the model's map · what the map does not know
· inside the numbers

### Folie 3 📷
**Bild:** Blick von oben auf einen dunklen Tisch: ein großer heller Bogen
Papier, darauf 24 kleine Karten mit kurzen gedruckten Sätzen, die
schon zu losen Gruppen zusammengeschoben sind; zwei Hände schieben eine
weitere Karte zu einer Gruppe, mit Bleistift sind erste Kreise um die Gruppen
gezogen. Warmes Licht nur auf dem Bogen, ringsum Schwarz. Die Schrift auf den
Karten ist nicht lesbar.
**Text:** `before a computer can search for meaning, it has to know where each text belongs.`
**Dazu sagen.** Wenn ihr „cheap flights to Lisbon“ sucht, findet die
Suchmaschine eine Seite über günstige Flüge nach Portugal, obwohl kaum ein
Wort gleich ist. Dahinter steckt eine Karte der Bedeutung, und genau so eine
legt ihr gleich selbst mit Papierkarten.

## Teil 1: a map by hand (4 Folien)

### Folie 4 🎬
`a map by hand`

### Folie 5 🖼️
**Titel klein:** `close in meaning, close on the map`
**Zeichnung:** ein Bogen mit kleinen Karten als Rechtecke mit Nummern, in
sechs lockeren Gruppen, jede Gruppe mit einem grauen Umriss und einem Namen
(travel, health, food, animals, money, computers). Die Karten 3 und 20 (bank)
und 8 und 12 (python) in Pink, jeweils in verschiedenen Gruppen.
**Dazu sagen.** So sehen die meisten Bögen am Ende aus. Die beiden Karten mit
„bank“ und die beiden mit „python“ liegen weit auseinander, weil ihr den Rest
des Satzes lest. Für euch heißt nah: nah in der Bedeutung, nicht in den
Buchstaben. Merkt euch die pinken Karten, sie kommen wieder.

### Folie 6 🖼️ 🪜
**Titel klein:** `a place is a list of numbers`
**Zeichnung:** dasselbe Blatt mit zwei Achsen von −10 bis 10, `right` und
`up`. Schritt 1: eine Karte (Nummer 1) liegt bei (−6, 4), gestrichelte Linien
zu den Achsen. Schritt 2: daneben in Codeschrift `card 1 → (−6, 4)`.
Schritt 3: zwei Karten, die auf dem Blatt aufeinander liegen, und eine dritte
Achse schräg nach hinten, auf der sie auseinander rücken; daneben
`(−6, 4, 2)` und `(−6, 4, −5)`.
**Dazu sagen.** Jeder Ort auf eurem Blatt lässt sich als zwei Zahlen
aufschreiben. Zwei Zahlen reichen aber nicht, um alles auseinander zu halten,
was sich unterscheidet. Jede weitere Zahl ist eine weitere Richtung, in der
sich Texte unterscheiden können.

### Folie 7 💬
**Text:** `an embedding is a list of numbers that says where something lies on a map of meaning.`
**Klein darunter:** `your sheet: 2 numbers per card · the model: 384 numbers per token and per text`
**Dazu sagen.** Das ist schon die ganze Idee. Der Rest des Experiments zeigt,
woher die Zahlen kommen und was man mit ihnen anfangen kann.

## Teil 2: tokens get numbers (4 Folien)

### Folie 8 🎬
`tokens get numbers`

### Folie 9 🖼️
**Titel klein:** `a table with one row per token`
**Zeichnung:** links eine Spalte mit Tokens in Codeschrift (`dog`, `puppy`,
`cat`, `car`, `…`), rechts je Token eine Zeile aus 16 kleinen Balken nach oben
und unten als Bild für die Zahlen, am Ende `… 384`. Darunter klein:
`30,522 tokens × 384 numbers`. Die Zeilen von `dog` und `puppy` sehen sich
ähnlich, die von `car` nicht.
**Dazu sagen.** Ein Sprachmodell ersetzt als Erstes jedes Token durch eine
Zeile aus einer großen Tabelle. Das kleine Modell im Experiment hat 30.522
Tokens und je 384 Zahlen. Niemand hat diese Zahlen von Hand eingetragen; wie
sie entstehen, sehen wir in Teil 4.

### Folie 10 🖼️ 🪜
**Titel klein:** `similarity is the angle between two arrows`
**Zeichnung:** drei kleine Bilder nebeneinander, jeweils zwei Pfeile von
einem gemeinsamen Ursprung: gleiche Richtung mit `1`, rechter Winkel mit `0`,
entgegengesetzt mit `−1`. Schritt 2: unter `−1` grau `almost never: the lowest
of 1.3 million word pairs is −0.09`.
**Dazu sagen.** Stellt euch die 384 Zahlen als Pfeil vom Mittelpunkt der Karte
vor. Ähnlich heißt: Die Pfeile zeigen in dieselbe Richtung. Negativ wird es
bei diesem Modell praktisch nie, auch nicht bei Gegensätzen.

### Folie 11 📊 🪜
**Titel klein:** `measured with the model`
**Zeichnung:** waagerechte Balken von 0 bis 1, je Paar eine Zeile:
`dog · puppy 0.81`, `dog · cat 0.66`, `dog · car 0.48`, Schritt 2:
`warm · cold 0.72`, `hot · cold 0.53`, `puppy · invoice 0.22`. Die beiden
Gegensatzpaare in Pink.
**Dazu sagen.** Erst sortieren lassen, dann zeigen. Die Gegensätze liegen
nah beieinander, weil sie an denselben Stellen im Text stehen: beim Wetter,
beim Getränk, beim Ofen. Die Karte weiß, worum es geht, aber kaum, in welche
Richtung. Und selbst Wörter, die nichts gemeinsam haben, kommen noch auf 0,2.

## Teil 3: computing with meaning (4 Folien)

### Folie 12 🎬
`computing with meaning`

### Folie 13 🖼️ 🎞️
**Titel klein:** `king − man + woman`
**Zeichnung:** eine Skizze, nicht maßstäblich, wie im Demonstrator: `man`
unten links, `king` oben links, `woman` unten rechts.
**Animation:** schrittweise.
1. Der pinke Pfeil von `man` zu `king` erscheint; daneben klein
   `king − man`. Danach: der Pfeil steht.
2. Eine Kopie des Pfeils gleitet nach rechts, bis sie bei `woman` beginnt.
   Danach: zwei gleiche Pfeile, die gestrichelten Seiten schließen das
   Parallelogramm.
3. An der Spitze erscheint der gelbe Stern mit `≈ queen 0.85`.
**Dazu sagen.** Weil die Zahlen Richtungen sind, kann man mit ihnen rechnen.
Die Subtraktion nimmt „Mann sein“ heraus und lässt „königlich“ übrig, die
Addition legt „Frau sein“ dazu. Dass die Zeichnung ein Parallelogramm ist,
liegt an der Rechnung: Derselbe Pfeil kommt zweimal vor.

### Folie 14 📊
**Titel klein:** `the same works elsewhere`
**Zeichnung:** eine Tabelle in drei Spalten, Rechnung, nächstes Wort, Wert:
`paris − france + germany` → `berlin 0.79`; `puppy − dog + cat` →
`kitten 0.87`; `doctor − hospital + school` → `teacher 0.82`;
`walked − walk + swim` → `swimming 0.91`, darunter grau `swam 0.88`. Das
nächste Wort jeweils in Gelb.
**Dazu sagen.** Hauptstadt, Jungtier, Arbeitsort: Niemand hat dem Modell diese
Richtungen beigebracht. Bei der Vergangenheit hat es „swim“ gut erwischt, die
Vergangenheit nur schwach.

### Folie 15 📊
**Titel klein:** `the way back is blurred`
**Zeichnung:** `queen − woman + man` mit drei Balken: `lord 0.79`,
`brother 0.75`, `king 0.74`; `king` in Pink.
**Dazu sagen.** Die Richtungen sind da, aber unscharf. Wenn eine Rechnung
nicht klappt, liegen mehrere Wörter fast gleich nah am Ergebnis.

## Teil 4: from tokens to a text (6 Folien)

### Folie 16 🎬
`from tokens to a text`

### Folie 17 ⌨️
**Titel klein:** `what the model reads`
**Zeichnung:** vier Zeilen, je Text links in normaler Schrift, rechts seine
Tokens als kleine Kästen in Codeschrift, `[CLS]` und `[SEP]` in Grau:
`I can't get home tonight` → `[CLS] i can ' t get home tonight [SEP]`;
`unbelievably` → `[CLS] un ##bel ##ie ##va ##bly [SEP]`;
`ChatGPT` → `[CLS] chat ##gp ##t [SEP]`;
`Ich bin krank` → `[CLS] ich bin k ##rank [SEP]`.
Die Zerstückelungen (`##…`) in Pink.
**Dazu sagen.** `[CLS]` und `[SEP]` sind keine Wörter, sondern Marken für
Anfang und Ende, mit eigenen Zahlen. Ein seltenes Wort wird in Stücke
geschnitten, die allein wenig bedeuten; deshalb kommen `unbelievably` und
`incredibly` nur auf 0,35, und ein englisches Modell versteht Deutsch kaum.

### Folie 18 🖼️ 🪜
**Titel klein:** `four steps from tokens to one list`
**Zeichnung:** die Abbildung `tokens-to-text` der Seite: „The bank raised its
rates“, Tokens oben, je Token ein Streifen mit acht Balken, Linien von jedem
Token zu jedem, die Streifen im Zusammenhang, unten ein Streifen für den Text.
`bank` in Pink.
**Aufbau:** Schritt 1 nur die Tokens (`cutting`); Schritt 2 die Streifen
(`looking up`); Schritt 3 die Linien und die veränderten Streifen
(`adjusting`); Schritt 4 der Mittelwert (`averaging`). Das Stichwort des
Schritts steht jeweils links in Gelb.
**Dazu sagen.** Schneiden, nachschlagen, anpassen, mitteln. Das Anpassen ist
die Attention eines Transformers: In jeder der sechs Schichten schaut jedes
Token auf alle anderen und nimmt etwas von denen auf, die für es zählen. Am
Ende wird gemittelt und auf Länge 1 gebracht.

### Folie 19 📊
**Titel klein:** `the same token, two meanings`
**Zeichnung:** zwei Sätze untereinander, `bank` jeweils in Pink:
`the bank raised its interest rates.` und `we watched the ducks from the
bank of the river.`; daneben zwei Werte für das Token `bank` am Ende der
sechs Schichten: `money · river 0.76`, `money · money 0.88` (zwei Sätze über
Geld).
**Dazu sagen.** Beide starten mit derselben Zeile der Tabelle und landen an
verschiedenen Orten. Deshalb sind diese Embeddings mehr als ein Wörterbuch.

### Folie 20 🖼️
**Titel klein:** `where the numbers come from`
**Zeichnung:** zwei Felder nebeneinander. Links `stage 1: guess the hidden
word`: ein Satz `the ___ barked at the postman` mit Kandidaten `dog`, `puppy`
darunter. Rechts `stage 2: pairs that belong together`: zwei Textkästen mit
einer Frage und ihrer Antwort, ein Pfeil zieht sie zusammen, ein dritter Text
wird weggeschoben; darunter `> 1 billion pairs`.
**Dazu sagen.** In der ersten Stufe lernt ein Modell, verdeckte Wörter aus
ihren Nachbarn zu erraten; dafür muss es Wörtern, die an denselben Stellen
stehen können, ähnliche Zahlen geben. In der zweiten wurden Texte, die
zusammengehören, näher zusammengeschoben.

### Folie 21 💬
**Text:** `you shall know a word by the company it keeps.`
**Klein darunter:** `john rupert firth, 1957`
**Dazu sagen.** Es geht nicht um Wörter, die nebeneinander stehen, Hund und
Katze tun das selten, sondern um Wörter mit denselben Nachbarn.

## Teil 5: the model's map (4 Folien)

### Folie 22 🎬
`the model's map`

### Folie 23 🖼️
**Titel klein:** `384 directions, drawn on two`
**Zeichnung:** links eine schräg gezeichnete Punktwolke im Raum, rechts
darunter ihr Schatten auf einer Fläche, verbunden durch dünne Lichtlinien;
daneben klein `principal component analysis: the two directions in which the
cards differ most`.
**Dazu sagen.** 384 Richtungen kann niemand zeichnen. Die Karte zeigt ihren
Schatten auf den zwei Richtungen, in denen sich die Karten am meisten
unterscheiden. Was im Schatten nah liegt, liegt meist auch in den 384 Zahlen
nah, aber nicht immer; im Zweifel gelten die Werte.

### Folie 24 📊 🪜
**Titel klein:** `search by meaning`
**Zeichnung:** links die Anfrage `I can't get home tonight` als gelber Stern,
rechts zwei Spalten: `by meaning` mit `1 · my train was cancelled … 0.31` und
`7 · we landed in lisbon three hours late`, `by keywords` mit `nothing: no
card shares a word`. Schritt 2: unten drei kleine Suchen
`river → 20 (0.49), 3 (0.20)` und `snake → 8 (0.46), 12 (0.24)`, mit 3, 20,
8, 12 in Pink.
**Dazu sagen.** Die Suche findet Karte 1, obwohl kein Wort gleich ist. Und
die pinken Karten aus Teil 1 trennt sie, obwohl sie auf der Karte nah
beieinander liegen: Im Satz haben „bank“ und „python“ ihre Zahlen angepasst.

### Folie 25 💬
**Text:** `a search by meaning finds texts that share no word with the question.`
**Dazu sagen.** Das ist der Kern dessen, was Suchmaschinen, Shops und
Chatbots heute mit Embeddings machen.

## Teil 6: what the map does not know (3 Folien)

### Folie 26 🎬
`what the map does not know`

### Folie 27 📊 🪜
**Titel klein:** `about the same, or the same?`
**Zeichnung:** drei Paare mit je einem Balken:
`I love this film. · I do not love this film.` 0.74;
`I love this film. · What a wonderful movie!` 0.59;
Schritt 2: `The dog bit the man. · The man bit the dog.` 0.97;
`Vaccines cause autism. · Vaccines do not cause autism.` 0.86.
Das Wort, das den Unterschied macht (`not`, die vertauschte Reihenfolge), in
Pink.
**Dazu sagen.** Erst raten lassen, welches Paar ähnlicher ist. Die Karte
beantwortet „worum geht es?“; ein „not“ ändert das Thema nicht, und ein
Mittelwert kennt keine Reihenfolge.

### Folie 28 💬
**Text:** `a map of meaning knows what a text is about, but not whether it is true.`
**Dazu sagen.** Ein Chatbot, der so nachschlägt, findet Texte zum richtigen
Thema, auch die, die das Gegenteil behaupten.

## Teil 7: inside the numbers (3 Folien)

### Folie 29 🎬
`inside the numbers`

### Folie 30 🖼️ 🪜
**Titel klein:** `similarity is one sum`
**Zeichnung:** zwei Zahlenreihen untereinander in Codeschrift, `card 1` und
`card 7`, je die ersten sechs Zahlen und `…`; Schritt 2: dazwischen je ein
`×`, darunter die Produkte; Schritt 3: rechts `Σ = 0.32` in Gelb und die
Formel `similarity = a₁b₁ + a₂b₂ + … + a₃₈₄b₃₈₄`.
**Dazu sagen.** Weil jeder Pfeil die Länge 1 hat, ist die Ähnlichkeit einfach
die Summe der 384 Produkte. Eine Suchmaschine nach Bedeutung macht genau das,
nur für Millionen Texte.

### Folie 31 🖼️
**Titel klein:** `what real systems do with it`
**Zeichnung:** mit `d.ipo` von oben nach unten: `question` → `384 numbers` →
`the nearest paragraphs` → `language model` → `answer`; daneben klein
`retrieval-augmented generation`, und darunter in einer grauen Zeile
`search · recommendations · duplicate questions · inside every language model`.
**Dazu sagen.** Chatbots, die aus euren Dokumenten antworten, machen die
Frage erst zu Zahlen, suchen die ähnlichsten Absätze und geben sie dem
Sprachmodell mit. Und in jedem Sprachmodell wird jedes Token als Erstes durch
eine solche Zahlenliste ersetzt.

## Offene Fragen an Nicolas (mit der Freigabe erledigt)

Beides blieb so, wie hier vorgeschlagen: Die Zeichnung baut sich in Schritten
auf, und die Rechnung mit Bedeutung ist die einzige Animation des Decks.

- Die Zeichnung auf Folie 18 ist die Abbildung der Seite, in vier Schritten
  aufgebaut statt fertig. Passt das, oder soll sie als Ganzes stehen?
- Folie 13 ist die einzige Animation; sonst Aufbau in Schritten. Passt das?
