# Entwurf: Input „how a scientific paper is built“ (zweite Fassung)

**Status:** freigegeben und gebaut am 2026-11-11 (23 Folien, 47 Frames), mit
diesen Abweichungen vom Entwurf:
- **Zahlen nach der Bereinigung.** Der Methodenteil lässt 23 unplausible
  Preise weg (20 über 10 €, 3 unter 0,50 €), wie die Dokumentation der Spalte
  `price_too_expensive` es nahelegt; danach liegt der Median der Vegetarier
  bei 2,45 € (n = 28), der Allesesser bei 1,99 € (n = 362), 588 Preise
  bleiben. Folie 15 und das Abstract nennen dieselben Zahlen.
- **Die Frage heißt kürzer** `do price limits for milk differ by diet?`,
  damit sie als schmalste Zeile am Ende des Trichters steht.
- **Fünf Diätgruppen** statt vier in Abbildung 1 (auch Pescetarier).
- **Diskussion ohne Vergleichsstudie:** keine Quelle gefunden, also der
  vorgesehene Ersatzsatz `whether this reflects concern for animals, the
  data cannot say.` Der falsche Satz ist ein echter Befund der Umfrage
  (`women named higher price limits than men.`, 2,00 € gegen 1,89 €) statt
  eines erfundenen über Ältere.
- **Folie 6** zeigt im zweiten Schritt Dörings unausgewogenes Paper (zwölf
  Seiten Theorie, zwei Ergebnisse, der Rest gestrichelt).
- **Folie 18:** Unterstreichungen grau, die jeweils neueste gelb, statt einer
  Farbe je Raum, weil Farben Bedeutung tragen; das Abstract hat 72 Wörter.
- **Folie 15:** Der Satz bleibt grau an seinem Platz stehen, während die
  Hälften in die Räume gleiten; die Räume haben eine Tür wie im Grundriss.

Die erste Fassung (20 Folien,
35 Frames, gebaut am 2026-11-10) steht mit ihrem Entwurf in der
Git-Geschichte; diese ersetzt sie nach Nicolas' Durchsicht: Die Folien ab
Frame 15 sind „unschön“, auf Frame 28 überlappen sich die beiden unteren
Markierungen, und insgesamt wirkt der Satz „lieblos“: „Diese Slides müssen
glänzen.“

**Die Idee der Neufassung:** Das Haus aus Eröffnung und Schluss trägt durch
den ganzen Satz, und statt über Abschnitte zu reden, zeigt der Satz einen.
- **Ein Grundriss statt einer Liste.** IMRaD erscheint als Grundriss eines
  Hauses mit vier Räumen, Titel und Abstract sind die Haustür, die Literatur
  der Raum hinten (Folie 4). Die Bilder der Teile setzen das fort: ein
  Puppenhaus im Schnitt, eine Badewanne in der Küche, ein Exposé.
- **Eine Studie, die durch den Satz läuft.** Die vier Listen „goes in / stays
  out“ werden zu vier Seiten eines kurzen Papers über die Milchumfrage, die
  der Satz wirklich schreibt (Folien 9 bis 12): je ein echter Absatz, am Rand
  mit Klammern beschriftet, was er leistet, und darunter grau ein Satz, der
  in diesen Raum nicht gehört, mit einem Pfeil in den Raum, in den er gehört.
  Am Ende setzt sich das Abstract aus genau diesen Seiten zusammen (Folie 18).
- **Formen statt Kästen.** Die Sanduhr wird als Sanduhr gezeichnet, die
  Längen der Teile als zwanzig Seiten eines Papers, der Satz aus dem Quiz
  wird sichtbar zerschnitten.
- **Frame 28:** Die Markierungen im Inhaltsverzeichnis des echten Papers
  bekommen Zeilen, die höher sind als die Markierung, dazu gelbe Ziffern für
  die Lesereihenfolge (Folie 16).

**Unverändert:** Verortung (oben in der Lektion `paper-structure`, etwa
20 Minuten, ohne Datum), Kernbotschaft, Publikum, Sprache, `style.toml`,
Quellen (Döring 2023, Kap. 13; Sollaci & Pereira 2004; APA JARS-Quant;
Cals & Kotz 2013; Dorina et al. 2025), die Live-Abfrage
`paper-sentence-section` und die Zahlen der Beispielstudie: Median der
Preisgrenze bei Vegetariern 2.49 € (n = 29), bei Allesessern 1.99 €
(n = 379), 611 von 2,809 Befragten nannten eine Grenze.

**Kernbotschaft:** `every section of a paper has one job, and the most
common mistake is doing the job of another section, above all interpreting
in the results.`

## Symbole

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Abbildung mit Daten |
| 🪜 | Aufbau in Schritten |
| 🎞️ | Animation |
| 🗳️ | Live-Abfrage |

# Die Folien

## Teil 0: Auftakt (3 Folien)

### Folie 1 🎬

**Titel:** `how a scientific paper is built` · **Untertitel:** `prof. dr. nicolas meseth`

### Folie 2

Agenda aus den vier Teilen.

### Folie 3 📷 (bleibt)

**Bild:** Grundriss und gedruckter Artikel auf dem dunklen Tisch.
**Text:** `readers don't read a paper from start to end, they jump to the room
they need, so every room has to be where they expect it.`

## Teil 1: one shape for all papers (4 Folien)

### Folie 4 🖼️ 🪜

**Titel klein:** `imrad`
**Zeichnung:** ein Grundriss in dünnen hellen Linien, wie ein Bauplan: vier
Räume in einer Reihe, verbunden durch Türen; in jedem Raum oben sein Name in
48, darunter seine Frage in 32: `introduction` · `why, and what is the
question?`, `methods` · `how did we find out?`, `results` · `what did we
find?`, `discussion` · `what does it mean?`. Links davor grau gestrichelt
die Haustür `title, abstract`, rechts dahinter ein schmaler Raum
`references`. Der Raum, der gerade dazukommt, ist blau umrandet.
**Aufbau:** Haustür und Einleitung, dann Raum für Raum.

### Folie 5 📊

**Titel klein:** `how imrad won`
**Abbildung:** wie bisher nur die Werte, die Sollaci & Pereira im Text
nennen, als Punkte (1935 keiner, 1950 über 10 %, 1955 etwa 20 %, 1975 über
80 %, 1985 alle), aber ruhiger: Fläche unter der Verbindung in Dunkelgrau
statt gestrichelter Linie, die Werte direkt an den Punkten. Neu oben an der
100-%-Linie die vier Zeitschriften an dem Jahr, in dem sie nur noch IMRaD
druckten: `nejm` 1975, `bmj` 1980, `jama` und `the lancet` 1985.
**Punchline (bleibt):** `editors made imrad the rule, because readers can
then jump straight to the section they need.`

### Folie 6 🖼️

**Titel klein:** `how long is each part?`
**Zeichnung:** zwanzig kleine Seiten nebeneinander in zwei Reihen zu zehn,
jede mit angedeuteten Textzeilen, nach Abschnitt eingefärbt: 1 Seite
Einleitung, 4 Theorie, 2 Methode, **6 Ergebnisse in Blau**, 3 Diskussion,
4 Literatur; unter jeder Gruppe ihr Name. Darunter grau `a rule of thumb for
an empirical paper of 20 pages`.
**Punchline (bleibt):** `the results take the most room, and the theory
must not crowd them out.`

### Folie 7 🖼️ 🪜

**Titel klein:** `the hourglass`
**Zeichnung:** eine echte Sanduhr als Umriss, zwei gewölbte Kolben und eine
schmale Mitte. Im oberen Kolben von breit nach schmal `the topic and why it
matters`, `what is known`, `the gap`, an der Engstelle oben blau `your
question`; in der Mitte `how you found out`, `what you found`; an der
Engstelle unten blau `your answer`, darunter breiter `compared with others`,
`limitations`, `what follows from it`. Rechts grau die Abschnittsnamen an
Klammern. **Aufbau:** oberer Kolben, Mitte, unterer Kolben.
**Punchline (bleibt):** `the introduction ends with your question, and the
discussion begins with its answer.`

## Teil 2: what goes where (5 Folien)

### Folie 8 📷 neu

**Bild:** ein Puppenhaus im Querschnitt auf einem dunklen Tisch, vier Räume
nebeneinander, jeder warm beleuchtet und eindeutig eingerichtet (Flur mit
Garderobe, Werkstatt, Küche, Wohnzimmer), schwarzer Grund, Blick frontal
leicht von oben, keine Schrift.
**Text:** `every room of a paper has one job, and what belongs to another room
gets carried there.`

### Folien 9 bis 12 🖼️ 🪜 (je eine Seite des Beispielpapers)

**Gemeinsamer Aufbau:** links eine Seite des Papers als heller Umriss mit
der Abschnittsüberschrift und einem echten Absatz in 32 (etwa sechs bis acht
Zeilen), rechts am Rand graue Klammern mit dem Namen dessen, was der
jeweilige Satz leistet; der Satz, um den es auf der Folie geht, blau.
Darunter, abgesetzt, ein grauer durchgestrichener Satz, der hier nicht
hingehört, mit einem Pfeil und dem Raum, in den er gehört.
**Aufbau:** Schritt 1 die Seite, Schritt 2 die Randklammern, Schritt 3 der
falsche Satz mit seinem Pfeil.

**Folie 9, `introduction`.** Der Absatz verengt sich von Satz zu Satz,
gesetzt als Trichter (Zeilen mittig, jede kürzer): `milk competes on price
in every supermarket.` (topic) · `earlier studies asked why people choose
plant-based milk, and found health, the environment and taste (dorina et al.,
2025).` (what is known) · `whether people's price limits differ with their
diet has not been asked.` (the gap) · blau `do people with different diets
name different price limits for milk?` (the question). **Falscher Satz:**
`vegetarians accept higher prices.` → `belongs in the results`.
**Punchline:** `the introduction narrows from the topic to your question,
and the question stands in its last paragraph.`

**Folie 10, `methods`.** `we reanalysed the milk and chocolate survey, an
existing online survey of 2,809 adults in germany.` (data source) ·
`respondents were shown a milk and asked from which price it would be too
expensive; 611 named a price.` (measure and sample) · ein Satz zur
Bereinigung (cleaning), den ich beim Bau aus der Aufbereitung der Spalte
`price_too_expensive` übernehme, statt ihn zu erfinden · blau `we compared
the medians of the diet groups.` (analysis). **Falscher Satz:** `the median is the middle value of a
sorted list.` → `belongs in a textbook`.
**Punchline (bleibt):** `the methods are a recipe that would let someone
else repeat your analysis.`

**Folie 11, `results`.** Links der Absatz, rechts daneben eine kleine
Abbildung, die dasselbe nicht noch einmal sagt, sondern ergänzt: die Mediane
der Diätgruppen als Punkte mit n. Absatz: `vegetarians named a median price
limit of 2.49 € (n = 29), omnivores 1.99 € (n = 379).` · blau `figure 1
shows all four groups.` **Falscher Satz:** `probably because they value
animal welfare.` → `belongs in the discussion`.
**Punchline (bleibt):** `the results report what the data say, and leave
what it means to the discussion.`

**Folie 12, `discussion`.** Der Absatz weitet sich, als umgekehrter
Trichter: blau `vegetarians named higher price limits than omnivores.` (the
answer) · `this fits studies that link a plant-based diet to concern for
animals.` (compared with others) · `only 29 vegetarians named a limit, and
one milk was shown.` (limitations) · `a larger sample should test whether
the difference holds.` (what follows). **Falscher Satz:** `among people over
60, the difference was larger.` → `a new result belongs in the results`.
**Punchline (bleibt):** `the discussion opens with the answer and then
widens like an upside-down funnel.`

Die Wortwahl im Vergleich mit anderen Studien („this fits studies that …“)
steht nur, wenn ich beim Bau eine Quelle finde, die genau das sagt; sonst
heißt der Satz `whether this reflects concern for animals, the data cannot
say.` und das Feld `what the data cannot say`.

## Teil 3: the most common mistake (4 Folien)

### Folie 13 📷 neu

**Bild:** eine freistehende weiße Badewanne mitten in einer dunklen Küche
zwischen Herd und Esstisch, ein Lichtkegel von oben, sonst Dunkelheit;
fotografisch, ruhig, leicht absurd.
**Text:** `the most common mistake is not a wrong number, but a sentence
standing in the wrong room.`

### Folie 14 🗳️ (bleibt)

`where does this sentence belong?` mit dem Satz über Vegetarier, richtige
Antwort `discussion`.

### Folie 15 🖼️ 🎞️

**Titel klein:** `result or interpretation`
**Zeichnung:** der Satz aus dem Quiz groß und mittig in einer Zeile pro
Hälfte. **Animation, schrittweise:** Abschnitt 1, eine gestrichelte
Schnittlinie fährt zwischen „limit,“ und „probably“ durch den Satz;
Abschnitt 2, die erste Hälfte gleitet nach links unten in einen Raum
`results` und bekommt dort ihre Zahlen (`2.49 € against 1.99 €, n = 29 and
379`), die zweite gleitet nach rechts unten in einen Raum `discussion` und
wird vorsichtig (`this may reflect …, as earlier studies suggest`). Danach
stehen zwei Räume mit je einem ganzen Satz da.
**Punchline (bleibt):** `a result says what the data show, and the
“because” waits for the discussion.`

### Folie 16 🖼️ 🪜

**Titel klein:** `dissecting a real paper`
**Zeichnung:** das Inhaltsverzeichnis von Dorina et al. (2025) wie bisher,
aber mit Zeilenabstand 48 statt 42, damit die Markierungen (Höhe 40) sich
nicht berühren. Vor die markierten Zeilen kommen gelbe Ziffern 1, 2, 3 als
Lesereihenfolge, rechts blau, was dort zu lesen ist: `1 the question, with
hypotheses`, `2 the answer, in its first paragraph`, `3 the limitations,
before you trust it`.

## Teil 4: the abstract (3 Folien)

### Folie 17 📷 neu

**Bild:** ein gedrucktes Exposé eines Hauses auf dem dunklen Tisch, eine
Seite mit einem kleinen Foto des Hauses und einem kurzen Textblock, daneben
ein Schlüssel; Schrift nicht lesbar, schwarzer Grund.
**Text:** `the abstract is the paper's listing: one paragraph that tells a
reader whether to open the door.`

### Folie 18 🖼️ 🪜

**Titel klein:** `the paper in miniature`
**Zeichnung:** das Abstract der Beispielstudie als ein Absatz Fließtext,
nicht als Tabelle. Satz für Satz kommt er hinzu, jeder Satz mit einer feinen
Unterstreichung in der Farbe seines Raums und darüber klein und grau der
Raum, aus dem er stammt (`introduction`, `methods`, `results`,
`discussion`); die Sätze sind die blauen Sätze der Folien 9 bis 12, gekürzt.
Rechts unten grau die Wortzahl, die mitwächst (`84 words`) und am Ende neben
`150 to 250 words are usual, written last` steht.

### Folie 19 📷 (bleibt)

**Bild:** das fertige Hausmodell auf dem Grundriss.
**Text:** `write your question at the end of the introduction and your
answer at the start of the discussion, and let everything else connect the
two.`

## Zu entscheiden

1. **Eine Beispielstudie, die der Satz schreibt (empfohlen).** Die vier
   Seiten (Folien 9 bis 12) und das Abstract sind Text, den ich schreibe, mit
   den Zahlen der Milchumfrage; Dorina et al. bleibt das echte Paper zum
   Zerlegen. Alternative: Ausschnitte aus Dorina et al. (CC BY) auf den vier
   Seiten. Das ist echter, passt aber nicht zur Frage, die der Satz von der
   Sanduhr bis zum Abstract verfolgt.
2. **Vier neue Fotos (empfohlen):** Puppenhaus, Badewanne in der Küche,
   Exposé, dazu die beiden vorhandenen. Die Badewanne ist bewusst ein wenig
   komisch; wenn dir das zu verspielt ist, wird es ein Sofa im Badezimmer
   oder ein Buch im Kühlschrank.
3. **Die Animation auf Folie 15 (empfohlen):** Der Satz wird wirklich
   zerschnitten, weil das der Vorgang ist, um den es geht. Ohne Animation
   erscheinen die beiden Räume in einem Schritt.
