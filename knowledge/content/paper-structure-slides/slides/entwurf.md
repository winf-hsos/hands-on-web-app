# Entwurf: Input „how a scientific paper is built“

**Status:** Am 2026-11-10 mit allen Empfehlungen freigegeben und gebaut:
`how-a-scientific-paper-is-built.html`, 20 Folien, 35 Frames, Export ohne
Warnung. Abweichungen vom Entwurf: (1) Folie 4 zeigt 1935 bis 1985 statt
1940 bis 1980 und nur die Werte, die Sollaci & Pereira im Text nennen
(1935 keiner, 1950 über 10 %, 1955 etwa 20 %, 1970er über 80 %, 1980er
alle), als Punkte mit gestrichelter Verbindung und dem Hinweis darauf; ihre
Abbildung 1 ist nicht nachgezeichnet. (2) Folien 7 bis 10 ohne Rot: „goes
in“ mit grünem Haken, „stays out“ grau, der Punkt der Folie blau, dazu je
eine Punchline. (3) Folie 11 und 12: Die Zahlen des Entwurfs (Veganer, 2.29
gegen 1.99 €) stimmten nicht; 2.295 ist der Median von Veganern und
Vegetariern zusammen, Veganer allein nennen 2.00 € gegen 1.99 € der übrigen,
also keinen nennenswerten Unterschied. Gebaut ist deshalb der Vergleich
Vegetarier gegen Allesesser, Median 2.49 € (n = 29) gegen 1.99 € (n = 379),
und der Quizsatz lautet „vegetarians named a higher price limit, probably
because they value animal welfare.“ (4) Folie 14: Die Längenangabe heißt
„about 150 to 250 words“ nach Döring S. 776 (Beispiel 150–300) und dem
APA-Handbuch (höchstens 250), nicht nur nach Döring; das Beispiel-Abstract
nutzt dieselben Zahlen (611 von 2.809 nannten einen Preis). (5) Die
Sprechernotiz zu Folie 13 verweist nicht mehr auf die Übung der Lektion,
sondern sagt nur, dass im Ergebnisteil eine Zahl steht, die nicht stimmen
kann. (6) Die Sanduhr (Folie 6) trägt die Fußnote nach Cals & Kotz; der
Abschnitt „strengths and limitations“ steht im Paper ohne Nummer unter
„4. discussion“ und ist so gezeichnet.

**Verortung:** neuer Folien-Inhalt `paper-structure-slides` auf Hands-on
Data Science, eingebettet oben in die Lektion `paper-structure` („Aufbau
eines wissenschaftlichen Papers“), im Kurs „Praxis der Markt- und
Gesellschaftsforschung“ im ersten Abschnitt. Wiederkehrender Input von etwa
20 Minuten ohne Datum und ohne Verweis auf andere Sitzungen; er taugt ebenso
für Abschlussarbeiten.

**Kernbotschaft:** `every section of a paper has one job, and the most
common mistake is doing the job of another section, above all interpreting
in the results.`

**Publikum:** Bachelorstudierende im dritten Semester, die eine empirische
Ausarbeitung über eine vorhandene Umfrage schreiben; viele haben noch kein
Paper ganz gelesen.

**Sprache und Design:** Folien, Beispiele und Notizen englisch, `style.toml`
von Hands-on Data Science.

**Quellen:**
- Döring, *Forschungsmethoden und Evaluation*, 6. Aufl. 2023, Kap. 13: die
  Standardgliederung eines empirischen Artikels (S. 770), die Diskussion mit
  Limitationen (S. 770), Umfang der Teile mit dem Richtwert für 20 Seiten
  (S. 770–771), Titel (S. 771), jeder Befund nur einmal in Text, Tabelle oder
  Abbildung (S. 772), Abstract mit je einem Satz pro Teil (S. 776).
- Sollaci & Pereira (2004), *J Med Libr Assoc* 92(3): wie IMRaD zwischen
  1940 und 1980 zur Regel wurde und warum (modulares Lesen).
- APA, *Journal Article Reporting Standards* (JARS-Quant): was in welchen
  Teil gehört, darunter der Hinweis, eine Sekundäranalyse als solche zu
  kennzeichnen und die Datenquelle zu beschreiben.
- Cals & Kotz (2013), Serie „Effective writing and publishing scientific
  papers“, *J Clin Epidemiol* 66: Einleitung als Trichter, Methode als
  Rezept, Ergebnisse ohne Deutung, Diskussion als umgekehrter Trichter.
- Beispielpaper zum Zerlegen: Dorina, Nikpour, Mullan & Uren (2025),
  „Health, Environment or Taste? Using the Theory of Planned Behaviour to
  Predict Plant-Based Milk Consumption“, *Foods* 14(11), 1970,
  doi:10.3390/foods14111970, CC BY 4.0. Eine Online-Befragung zu
  Pflanzenmilch mit N = 286, durchgehend IMRaD, Antwort auf die Fragen im
  ersten Absatz der Diskussion.

## Zu entscheiden

1. **Das Beispielpaper von Dorina et al. (2025) (empfohlen)** als echtes
   Paper, das die Folien Abschnitt für Abschnitt zeigen und das die Lektion
   als Literaturquelle zum Zerlegen einbettet. Es passt im Thema
   (Pflanzenmilch), in der Methode (Online-Befragung) und in der Länge, und
   es steht unter CC BY, sodass Ausschnitte auf die Folien dürfen. Es hat
   zwei Schwächen, die sich zum Üben eignen: eine unmögliche
   Standardabweichung im Ergebnisteil und neue Mittelwerte in der
   Diskussion.
2. **Die Sanduhr als eine Animation** (Folie 6): Einleitung verengt sich zur
   Frage, Methode und Ergebnisse bleiben schmal, die Diskussion weitet sich
   wieder. Das ist kein Ablauf in der Zeit, deshalb schlage ich einen
   Aufbau in Schritten statt einer Animation vor.
3. **Eine Live-Abfrage** (Folie 11): ein Satz, und wohin er gehört.

## Symbole

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Vergleich |
| 💬 | Merksatz |
| 🪜 | Aufbau in Schritten |
| 🗳️ | Live-Abfrage |

# Die Folien

## Teil 0: Auftakt (2 Folien)

### Folie 1 🎬

**Titel:** `how a scientific paper is built`
**Untertitel:** `prof. dr. nicolas meseth`

Die Agenda füllt stagekit aus den Teilen `one shape for all papers`,
`what goes where`, `the most common mistake` und `the abstract`.

### Folie 2 📷

**Bild:** ein aufgeschlagener Bauplan eines Hauses auf einem dunklen Tisch
vor schwarzem Grund, die Räume beschriftet, daneben ein gedrucktes Paper,
dessen Abschnittsüberschriften man erahnt. Licht von oben, Ränder im
Schwarz.

**Text:** `readers don't read a paper from start to end, they jump to the
room they need, so every room has to be where they expect it.`

**Dazu sagen.** Wer ein Paper liest, liest zuerst Titel und Abstract, dann
oft die Diskussion und erst danach, wenn überhaupt, die Methode. Das geht
nur, weil alle Paper gleich gebaut sind.

## Teil 1: one shape for all papers (4 Folien)

### Folie 3 🖼️ 🪜

**Titel klein:** `imrad`
**Zeichnung:** vier Blöcke untereinander, Schritt für Schritt:
`introduction: why and what is the question?`,
`methods: how did we find out?`,
`results: what did we find?`,
`discussion: what does it mean?`
Davor grau `title, abstract`, danach grau `references`.

**Dazu sagen.** Vier Abschnitte, vier Fragen. Döring nennt den Forschungsstand
als eigenen fünften Teil; viele Zeitschriften ziehen ihn in die Einleitung.

### Folie 4 🖼️

**Titel klein:** `how imrad won`
**Zeichnung:** ein Liniendiagramm 1940 bis 1980, Anteil der Originalartikel
in vier großen medizinischen Zeitschriften mit IMRaD-Gliederung: über 10 %
um 1950, über 80 % in den 1970ern, in den 1980ern alle.
Fußnote: `sollaci & pereira (2004)`.

**Dazu sagen.** Die Gliederung haben nicht Forschende erfunden, sondern
Herausgeber durchgesetzt, weil Leser damit gezielt in einen Abschnitt
springen können.

### Folie 5 📊

**Titel klein:** `how long is each part?`
**Balken:** Döring's Richtwert für 20 Seiten: introduction 1, theory 4,
methods 2, results 6, discussion 3, references 4.
Fußnote: `after döring (2023), p. 771`.

**Dazu sagen.** Der größte Teil sind die Ergebnisse. Zwölf Seiten Theorie
und zwei Seiten Ergebnisse nennt Döring unausgewogen.

### Folie 6 🖼️ 🪜

**Titel klein:** `the hourglass`
**Zeichnung:** eine Sanduhr, oben breit `the world`, verengt sich zu
`the gap` und `your question` (Ende der Einleitung), schmal in der Mitte
`methods` und `results`, unten weitet sie sich zu `answer`, `compared with
others`, `limitations`, `implications`. Schritt für Schritt von oben nach
unten.

**Dazu sagen.** Die Einleitung endet mit der Frage, die Diskussion beginnt
mit der Antwort. Wer nur den letzten Absatz der Einleitung und den ersten
der Diskussion liest, weiß, worum es geht.

## Teil 2: what goes where (4 Folien)

### Folie 7 📊

**Titel klein:** `introduction`
**Zwei Spalten:** links grün, was hineingehört (why it matters, what is
known, the gap, the question at the end), rechts rot, was nicht (a summary
of the whole field, results, a question that appears only later).

**Dazu sagen.** Ein Trichter: vom Allgemeinen zur Lücke und zur Frage, die
im letzten Absatz steht.

### Folie 8 📊

**Titel klein:** `methods`
**Zwei Spalten:** hinein: data source and that it is a secondary analysis,
who was asked and how they were recruited, the questions you use, how you
cleaned the data, how you analysed; nicht hinein: explaining what a mean is,
results.
Fußnote: `apa jars-quant`.

**Dazu sagen.** Die Methode ist ein Rezept: Könnte jemand mit diesen Angaben
dieselbe Auswertung wiederholen? Für euch heißt das auch, ehrlich zu
schreiben, dass ihr eine vorhandene Umfrage auswertet und wer sie erhoben
hat.

### Folie 9 📊

**Titel klein:** `results`
**Zwei Spalten:** hinein: what you found, in the order of your questions,
numbers, tables and figures, each finding once; nicht hinein: why it is so,
what it means, adjectives like „remarkably“.

**Dazu sagen.** Jeder Befund steht genau einmal da, im Text, in einer
Tabelle oder in einer Abbildung, nicht dreimal (Döring, S. 772).

### Folie 10 📊

**Titel klein:** `discussion`
**Zwei Spalten:** hinein: the answer first, comparison with other studies,
limitations, implications; nicht hinein: new results, repeating every
number, „more research is needed“ as the only conclusion.

**Dazu sagen.** Nach dem Abstract ist sie der Teil, den Fachleute zuerst
lesen, und sie beginnt mit der Antwort auf die Frage aus der Einleitung.

## Teil 3: the most common mistake (3 Folien)

### Folie 11 🗳️

**Abfrage (Quiz):** `where does this sentence belong? "vegans named a
higher price threshold, probably because they value animal welfare."`
Antworten: `introduction`, `methods`, `results`, `discussion` (richtig).

### Folie 12 📊 🪜

**Titel klein:** `result or interpretation`
**Zwei Kästen:** links `results` mit dem ersten Halbsatz `vegans named a
higher price threshold (median 2.29 vs 1.99 euros).` (Zahlen beim Bau
nachrechnen), rechts `discussion` mit dem zweiten `this may reflect that
they value animal welfare, as earlier studies suggest.` Schritt 2: ein
Pfeil trennt den Satz in zwei.

**Dazu sagen.** Der Befund ist, was die Daten sagen; das „weil“ ist eine
Deutung, und die gehört in die Diskussion, wo sie mit anderen Studien
verglichen und als Vermutung gekennzeichnet wird.

### Folie 13 🖼️ 🪜

**Titel klein:** `dissecting a real paper`
**Zeichnung:** die erste Seite des Beispielpapers verkleinert als Umriss
(Titel, Abschnittsköpfe), daneben Schritt für Schritt Marken: wo die Frage
steht (`1.2 the current study`), wo die Antwort steht (erster Absatz von
`4 discussion`), wo die Limitationen stehen.
Fußnote: `dorina et al. (2025), foods 14(11), cc by 4.0`.

**Dazu sagen.** So lest ihr jedes Paper: erst die Frage am Ende der
Einleitung, dann die Antwort am Anfang der Diskussion, dann prüfen, ob die
Methode trägt. In diesem Paper findet ihr dabei auch einen Fehler, den die
Übung in der Lektion aufdeckt.

## Teil 4: the abstract (2 Folien)

### Folie 14 🖼️ 🪜

**Titel klein:** `the paper in miniature`
**Zeichnung:** fünf Zeilen, je eine Zeile für `problem`, `question`,
`method`, `findings`, `conclusion`, Schritt für Schritt mit einem Satz aus
einem Beispiel-Abstract zur Milch-Umfrage gefüllt; darunter grau `150 to
250 words`.
Fußnote: `after döring (2023), p. 776`.

**Dazu sagen.** Das Abstract ist das ganze Paper in einem Absatz, je ein
Satz pro Teil, und es entsteht zuletzt.

### Folie 15 📷

**Bild:** derselbe Bauplan wie auf Folie 2, jetzt steht daneben das fertige
kleine Haus als Modell.

**Text:** `write your question at the end of the introduction and your
answer at the start of the discussion, and let everything else connect the
two.`

**Dazu sagen.** Mit dieser Gliederung legt ihr die Vorlage eurer
Ausarbeitung an; die Überschriften stehen schon, ihr füllt die Räume.
