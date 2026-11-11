# Entwurf: Input „what is a research question?“ (zweite Fassung)

**Status:** Am 2026-11-11 mit allen Empfehlungen freigegeben und am selben
Tag gebaut: 30 Folien, 57 Frames, Export ohne Warnung (keine springenden
Schritte, keine fremden Schriftgrößen). Die erste Fassung (25 Folien,
50 Frames, gebaut am 2026-11-10) steht in der Git-Geschichte; diese ersetzt
sie nach Nicolas' Durchsicht: „sehr lieblos, sehr viele Boxen, Boxen, Boxen,
keine oder kaum Bilder“. Abweichungen vom Entwurf: (1) Folie 21 zeigt zu
jedem Mittelwert sein 95-%-Intervall, damit „kein klarer Effekt“ sichtbar
wird, und die Punchline ist kürzer (`the price hardly moved purchase
certainty, and for a good question that is an answer too.`). (2) Folie 24
zeigt die Zuordnung als Zeilen ohne Rahmen unter dem Satz statt mit Linien
von jeder Stelle, und die Zeile „online, november 2025“ ist zu einem Satz
darunter geworden. (3) Die Sprechernotizen zu Folie 6 und 7 sagen, dass die
Frage nach dem Alter gegen die Erwartung ausgeht: Unter 30 kaufen 54 %
mindestens zur Hälfte Bio, über 60 nur 38 %. (4) Die Punchline zur Rettung
zitiert „make“ wie der Satz darüber, nicht „makes“.

**Was sich ändert:**
- **Antworten zeigen statt Fragen einrahmen.** Wo die erste Fassung eine Frage
  in einen Kasten setzte, zeigt die neue, was die Daten auf sie antworten:
  echte Zahlen aus der Umfrage als kleine Abbildungen (Anteil Discounter,
  Online-Einkauf in Großstädten, Bio-Anteil nach Ernährung, Ergebnis des
  Preisexperiments). Alle Zahlen unten sind in der CSV nachgerechnet.
- **Sätze statt Kastenreihen.** Fragen stehen als Text auf der Folie, die
  wichtigen Wörter darin hervorgehoben (`d.highlight`), Begründungen grau
  darunter. Kästen bleiben nur dort, wo etwas bewertet wird (`d.verdict`).
- **Fünf neue Fotos** eröffnen die Teile, im selben Licht wie das Archiv der
  Eröffnung: Regal mit Pflanzendrinks, Checkliste im Cockpit, leeres Fach im
  Archiv, Bleistift im Spitzer, Codebuch mit Textmarker.
- **Deine vier Punkte:** Der Trichter ist neu gezeichnet, alles mittig, auch
  die Frage unter der Spitze (Folie 5). Das erste Quiz ist raus. Die drei
  Arten von Fragen haben keine Kastenreihe mehr, sondern je eine kleine
  Abbildung mit der Antwort (Folie 8). „the data came first“ ist neu
  gezeichnet, von links nach rechts lesbar und mit einem Rückweg in weitem
  Bogen statt der engen Ecke (Folie 23).

**Verortung, Publikum, Sprache, Quellen:** wie in der ersten Fassung.
Eingebettet oben in die Lektion `research-questions`, wiederkehrend ohne
Datum, etwa 35 Minuten, Folien englisch, `style.toml` von Hands-on Data
Science, Quellen Döring (2023, Kap. 5) und Huntington-Klein (*The Effect*,
Kap. 2) als Fußnoten mit Link.

**Kernbotschaft:** `a good research question can be answered with evidence,
says something about how the world works, and fits the data you actually
have.`

## Symbole

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Abbildung mit echten Daten |
| 💬 | Merksatz |
| 🪜 | Aufbau in Schritten |
| 🗳️ | Live-Abfrage |

# Die Folien

## Teil 0: Auftakt (3 Folien)

### Folie 1 🎬

**Titel:** `what is a research question?` · **Untertitel:** `prof. dr. nicolas meseth`

### Folie 2

Agenda aus den Teilen `from topic to question`, `what makes a good one`,
`questions without an answer`, `sharpening a question`, `the reality test`.

### Folie 3 📷 (bleibt)

**Bild:** das Archiv mit der Taschenlampe.
**Text:** `a data set with 606 columns answers nothing by itself, until a
question tells you which shelf to light up.`

## Teil 1: from topic to question (4 Folien)

### Folie 4 📷 neu

**Bild:** ein Kühlregal im dunklen Supermarkt, Reihen von Kartons ohne Marke
(Hafer, Soja, Mandel), nur ein Regalboden im Licht; schwarzer Grund, Blick
leicht von der Seite.
**Text:** `plant-based milk is a topic, and a topic names a shelf without
saying what you want to know about it.`

### Folie 5 🖼️ 🪜

**Titel klein:** `topic, problem, question`
**Zeichnung:** ein Trichter aus drei Bändern, jedes Band mit seinem Text
mittig; links davon grau `topic`, `problem`, `question` auf der Höhe ihres
Bandes. Schritt 1 `plant-based milk`, Schritt 2 `how price affects choosing
oat milk over cow's milk`, Schritt 3 unter der Spitze, ebenfalls mittig und
gelb (das, worum es geht): `how does purchase certainty for alpro oat drink
change when its price rises from 1.79 to 2.09 euros?`
Fußnote: Döring (2023), S. 148.

### Folie 6 🖼️ 🪜

**Titel klein:** `two conditions`
**Zeichnung:** eine Karte mit zwei Achsen statt sechs Kästen: waagerecht
`answerable with evidence`, senkrecht `teaches us how the world works`.
Schritt für Schritt landen drei Fragen als Text auf der Karte: `which milk ad
is the best?` links (grau, darunter `no measure decides "best"`), `how many
respondents live in a big city?` rechts unten (grau, `answerable, but it
teaches nothing`), und rechts oben grün mit Haken `do older respondents buy a
larger share of organic food?`
Fußnote: Huntington-Klein, *The Effect*, Kap. 2.

### Folie 7 💬

**Titel klein:** `question or hypothesis`
**Zwei Sätze untereinander, groß, ohne Rahmen:** `which shops do vegans use
for their food?` (blau), darunter grau `a research question: open, for when
prior knowledge is thin`; dann `respondents over 60 buy a larger share of
organic food than respondents under 30.`, darunter grau `a hypothesis: a
claim with a direction, derived from theory you have to cite`.
**Punchline:** `with a survey that is already collected, the open question
is the normal case.`

## Teil 2: what makes a good one (5 Folien)

### Folie 8 📊 🪜

**Titel klein:** `three kinds of questions`
**Drei Spalten, je Frage und Antwort aus den Daten als kleine Abbildung,**
Spalte für Spalte:
- `descriptive`: `what share of the respondents shops at a discounter?` →
  ein Balken, **73 %** (`v008ort_1discount`).
- `relational`: `do people in big cities shop online more often?` → zwei
  Balken, **9 %** in Großstädten gegen **4 %** sonst (`D044stadtf`,
  `v008ort_9online`).
- `causal`: `does a higher price lower purchase certainty for alpro?` →
  vier Punkte für die vier Preise; gelbes Warndreieck mit `only with a design
  that separates the cause, here an experiment`.

### Folie 9 📷 neu

**Bild:** die Hand einer Pilotin mit einer gedruckten Checkliste auf einem
Klemmbrett, dahinter ein dunkles Cockpit mit wenigen Instrumentenlichtern;
die Schrift auf dem Blatt ist nicht lesbar.
**Text:** `pilots go through their checklist before take-off, and you go
through yours before you compute anything.`

### Folie 10 🪜

**Titel klein:** `a checklist`
**Fünf Zeilen nacheinander,** je das Stichwort blau und die Prüffrage weiß,
ohne Rahmen: `potential results` · `would every possible answer teach you
something?`, `feasibility` · `do the data contain what you need?`, `scale` ·
`can you answer it in the time you have?`, `design` · `can these data
separate what you want to separate?`, `simplicity` · `is it one question,
not three?`
Fußnote: Huntington-Klein, *The Effect*, 2.4.

### Folie 11 📊 🪜

**Titel klein:** `too broad, just right`
**Schritt 1:** oben grau `what drives organic food purchases?` mit `a whole
research programme, not one question`. **Schritt 2:** darunter groß die enge
Frage `do vegetarians buy a larger share of organic food than people who eat
meat without restrictions?`, drei Stellen hervorgehoben und darunter benannt:
`vegetarians` (variation, `V041nofleischf`), `share of organic food`
(outcome, `v032bioanteil`), `than people who eat meat without restrictions`
(comparison). **Schritt 3:** die Antwort als zwei Balken: **65 %** der
Vegetarier kaufen mindestens zur Hälfte Bio, **36 %** derer ohne
Einschränkung (Codes 3 bis 5 von `v032bioanteil`).
**Punchline:** `a narrow question names one variation, one outcome and one
comparison, and then it has an answer.`

### Folie 12 💬 (bleibt)

`a question you can answer well is worth more than an important one you can
only talk about.`

## Teil 3: questions without an answer (4 Folien)

### Folie 13 📷 neu

**Bild:** dasselbe Archiv, der Lichtkegel trifft ein leeres Fach.
**Text:** `some questions sound important and still find an empty shelf in
your data.`

### Folie 14 🪜

**Titel klein:** `four traps`
**Vier Zeilen nacheinander, ohne Rahmen:** links grau die Falle, in der
Mitte die Frage, rechts grau, warum die Daten sie nicht beantworten:
`normative` · `should oat milk cost as much as cow's milk?` · `data describe
what is, they do not judge it`; `vague` · `what do germans think about
food?` · `no object, no measure`; `causal without design` · `does a higher
income make people buy organic?` · `income goes with education, place and
values`; `not in the data` · `has organic buying grown since 2020?` · `one
survey at one time`. Die aktuelle Zeile weiß, die vorigen grau.

### Folie 15 🖼️ 🪜

**Titel klein:** `rescue the question`
**Ein Satz, der sich ändert:** Schritt 1 `does a higher income make people
buy organic?`, das Wort `make` gelb hervorgehoben. Schritt 2 darunter `is
household income related to the share of organic food people buy?`, `related
to` grün hervorgehoben, mit Haken.
**Punchline (bleibt):** `"makes" becomes "is related to", and the report
says honestly why it cannot claim more.`

### Folie 16 🗳️ (bleibt)

`which question can the milk survey answer?` mit `do vegans use farm shops?`
als richtiger Antwort, Kennung `rq-what-the-survey-answers`.

## Teil 4: sharpening a question (5 Folien)

### Folie 17 📷 neu

**Bild:** ein Bleistift in einem Handspitzer, frische Späne auf dunklem
Holztisch, schwarzer Grund, ein einzelnes Licht.
**Text:** `a vague idea becomes a question once you can say who, where, when,
what varies, what you measure and what you compare.`

### Folie 18 🪜

**Titel klein:** `from idea to question`
**Links grau die Idee** `prices and oat milk`; **rechts sechs Zeilen ohne
Rahmen,** die nacheinander erscheinen, links das Feld grau, rechts der Inhalt
weiß: `who` people who bought and drank milk or milk alternatives in the
last 12 months, `where` an online panel across germany, `when` november 2025,
`variation` price of alpro oat drink: 1.69, 1.79, 1.89 or 2.09 euros,
`outcome` purchase certainty from −4 to +4, `comparison` each price against
the regular 1.79.

### Folie 19 💬 (bleibt)

Die geschärfte Frage als Satz.

### Folie 20 🖼️

**Titel klein:** `the price experiment`
**Zeichnung:** vier Regalböden nebeneinander, auf jedem drei Kartons als
Umriss (Giebel oben, nicht als Kasten) mit Preisschild darunter:
Weihenstephan 1.79, Gut & Günstig 1.09, alpro mit dem Preis der Gruppe in
Blau; darunter die Gruppengrößen 141, 142, 161, 157.
**Punchline:** `chance decided which shelf each respondent saw, so a
difference in purchase certainty can be put down to the price.`

### Folie 21 📊 neu

**Titel klein:** `and the answer`
**Abbildung:** mittlere Kaufsicherheit für alpro je Preis auf einer Skala
von −4 bis +4 mit Nulllinie: 1.69 → **+0.1**, 1.79 → **−0.1**, 1.89 →
**0.0**, 2.09 → **−0.3** (n = 140, 139, 161, 156). Die vier Punkte liegen
fast auf der Nulllinie.
**Punchline:** `the price hardly moved purchase certainty, and that is an
answer too, because every possible result of a good question teaches you
something.`

## Teil 5: the reality test (4 Folien)

### Folie 22 📷 neu

**Bild:** ein aufgeschlagener Ordner mit Fragebogenseiten, eine Hand zieht
mit einem gelben Textmarker eine Zeile nach; die Schrift ist nicht lesbar,
schwarzer Grund.
**Text:** `the data came first, so the question has to fit them and not the
other way round.`

### Folie 23 🖼️ 🪜

**Titel klein:** `the data came first`
**Zeichnung, von links nach rechts:** `your question` → `is every word a
column in the codebook?` → drei Ausgänge untereinander: `yes` → grüner
Kasten `answerable` mit Haken; `partly` → blau `adapt the question` mit einem
Pfeil, der in weitem Bogen unter der Zeichnung zur Frage zurückführt; `no` →
grau gestrichelt `drop it`. Schritt 1 nur die Frage und die Prüfung, Schritt
2 die drei Ausgänge.

### Folie 24 🖼️

**Titel klein:** `check it against the codebook`
**Oben die geschärfte Frage als Satz,** vier Stellen hervorgehoben; von jeder
führt eine Linie nach unten zu ihrer Spalte in Codeschrift und dem, was das
Codebuch dazu sagt: `people who buy and drink milk` → `v006gekauft_3mi == 3`;
`price of alpro oat drink` → `ad015p1reaktion4`, codes 1 to 4 for 1.69 to
2.09; `purchase certainty` → `U015p1reaktion4_3alpro`, −4 to +4; `the
regular 1.79 euros` → `ad015p1reaktion4 == 2`. Grau darunter: `601
respondents saw a price, 596 of them rated alpro`.

### Folie 25 📷 (bleibt)

**Bild:** das Archiv, die Person hält den Ordner.
**Text:** `write your question down before you compute anything, check every
word against the codebook, and change the question rather than the data.`

## Zu entscheiden

1. **Die Antwort des Preisexperiments zeigen (empfohlen).** Folie 21 verrät
   das Ergebnis: Der Preis hat die Kaufsicherheit kaum bewegt. Das ist ein
   gutes Beispiel für „potential results“, nimmt den Studierenden aber eine
   Entdeckung, falls sie das Experiment selbst auswerten sollen. Ohne Folie 21
   endet Teil 4 mit dem Regal.
2. **Fünf neue Fotos (empfohlen).** Alternative sind drei (Regal, leeres
   Fach, Textmarker), ohne Cockpit und Bleistift.
3. **Ein Quiz bleibt** (Folie 16). Wenn du gar keine Abfrage willst, fällt
   auch diese weg.
