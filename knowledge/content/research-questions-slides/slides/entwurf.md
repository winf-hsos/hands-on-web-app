# Entwurf: Input „what is a research question?“

**Status:** Am 2026-11-10 mit allen Empfehlungen freigegeben und am selben
Tag gebaut: `what-is-a-research-question.html`, 25 Folien, 50 Frames, Export
ohne Warnung (keine springenden Schritte, keine fremden Schriftgrößen).
Abweichungen vom Entwurf:
- **Spaltenzahl:** Die CSV der Wissensbasis (`mds12_schoko_milch.csv`) hat
  606 Spalten, nicht 813; die 813 stehen in der Kursbeschreibung der
  vollständigen Datei. Folie 3 sagt 606.
- **Keine roten Kreuze:** Schwache Fragen stehen grau und gestrichelt mit
  grauer Begründung (Folien „two conditions“, „too broad, just right“,
  „four traps“, „rescue the question“), die tragfähige Fassung als grüner
  Kasten mit Haken. In „the data came first“ ist „adapt the question“ blau
  mit einem Pfeil zurück zur Frage, „drop it“ grau gestrichelt.
- **Preisexperiment:** Die Alpro-Preise sind blau statt gelb (Gelb heißt im
  Design „aktuell“), dazu die Gruppengrößen 141, 142, 161 und 157 und eine
  Punchline.
- **„too broad, just right“:** Die enge Frage des Entwurfs (Bioanteil im
  Discounter gegen andere Geschäfte) ist mit den Daten nicht beantwortbar,
  weil `v032bioanteil` den Bioanteil am gesamten Einkauf misst. Ersetzt durch
  „do vegetarians buy a larger share of organic food than people who eat meat
  without restrictions?“ mit den drei Teilen und ihren Spalten.
- **Filter:** Laut Fragebogen ging der Preistest an F6 = 3 oder 2, in den
  Daten kommt unter den 601 Zugewiesenen nur `v006gekauft_3mi` = 3 vor
  (gekauft und verzehrt). Deshalb heißt es auf „from idea to question“
  „bought and drank“ und in der geschärften Frage „among people who buy and
  drink milk“ statt „among milk buyers“. Die Codebuch-Folie nennt die echten
  Spalten (`v006gekauft_3mi == 3` statt „F6“) und die Fallzahlen 601
  zugewiesen, 596 mit Urteil zu Alpro.
- **Abfragen:** Antworten auf rund 26 Zeichen gekürzt; richtige Antwort der
  ersten Abfrage „do vegans buy more organic?“ statt „do vegans pay more for
  milk?“ (was jemand bezahlt, steht nicht in der Umfrage), in der zweiten „do
  vegans use farm shops?“. Kennungen `rq-which-is-a-question` und
  `rq-what-the-survey-answers`.
- **Beispiele** für die drei Arten von Fragen: Anteil Discounter
  (`v008ort_1discount`), Großstadt und Online-Einkauf (`d044stadt`,
  `v008ort_9online`), Preis und Kaufsicherheit (Experiment).
- **Fußnoten** verlinken die beiden Bücher (DOI des Döring, theeffectbook.net),
  da es externe Bücher sind; keine Plattformlinks.
- Zusätzliche Punchlines auf „too broad, just right“, „rescue the question“
  und „the price experiment“; die Folie „question or hypothesis“ hebt die
  Forschungsfrage blau hervor und sagt darunter, warum.

**Verortung:** neuer Folien-Inhalt `research-questions-slides` auf Hands-on
Data Science, eingebettet oben in die Lektion `research-questions` („Was ist
eine Forschungsfrage?“), im Kurs „Praxis der Markt- und
Gesellschaftsforschung“ im ersten Abschnitt. Wiederkehrender Input von etwa
35 Minuten ohne Datum und ohne Verweis auf andere Sitzungen; er taugt ebenso
für Abschlussarbeiten und jedes Methodenseminar.

**Kernbotschaft:** `a good research question can be answered with evidence,
says something about how the world works, and fits the data you actually
have.`

**Publikum:** Bachelorstudierende im dritten Semester, die eine bereits
erhobene Umfrage auswerten und daraus eine Ausarbeitung schreiben; sie
kennen R und das Codebuch, aber noch nicht den Unterschied zwischen Thema,
Frage und Hypothese.

**Sprache und Design:** Folien, Beispiele und Notizen englisch, `style.toml`
von Hands-on Data Science. Die Spaltennamen der Umfrage erscheinen in
Codeschrift, wie sie im Codebuch stehen.

**Quellen:**
- Döring, *Forschungsmethoden und Evaluation*, 6. Aufl. 2023, Kap. 5: vom
  Thema zum Forschungsproblem und zur Frage (S. 148), Eingrenzung in vier
  Schritten (S. 148–149), Hypothese gegen Forschungsfrage (S. 149–152),
  explorative, deskriptive und explanative Studien (S. 152), Kriterien der
  Themenwahl und Grenzen der Untersuchbarkeit (S. 152–157).
- Huntington-Klein, *The Effect*, Kap. 2 „Research Questions“: eine
  Forschungsfrage muss mit Belegen beantwortbar sein und das Verständnis der
  Welt verbessern (2.1), warum man mit einer Frage und nicht mit dem
  Durchsuchen der Daten beginnt (2.2), Fragen aus einer Gelegenheit wie einem
  vorhandenen Datensatz (2.3) und die Prüfliste aus 2.4 (Potential Results,
  Feasibility, Scale, Design, Keep It Simple).
- Beide Bücher stehen schon als Literaturquellen auf der Plattform
  (`doering-research-methods`, `the-effect`) und werden in der Lektion
  eingebettet; auf den Folien stehen sie als Fußnote ohne Link (Regel: keine
  Plattformlinks auf Folien).

**Daten:** die Umfrage zu Milch und Schokolade (`mds12_schoko_milch`, 2.811
Befragte, Hauptstudie und Teilstudien), alle Beispiele aus dem Codebuch des
Kursordners. Fallzahlen und Preisstufen prüfe ich beim Bau in der CSV nach.

## Zu entscheiden

1. **Das durchgehende Beispiel ist das Preisexperiment zu Alpro Haferdrink
   (empfohlen).** Der Preis wurde zufällig auf 1,69, 1,79, 1,89 oder
   2,09 Euro gesetzt, die Konkurrenten blieben fest, und gemessen wurde die
   Kaufsicherheit. Daran lässt sich zeigen, wie aus „Preise und Hafermilch“
   eine präzise Frage wird, und es ist die eine Stelle in den Daten, an der
   sogar eine kausale Frage beantwortbar ist.
2. **Hypothesen bekommen eine Folie, nicht einen Teil (empfohlen).** Döring
   unterscheidet ausführlich Unterschieds-, Zusammenhangs- und
   Veränderungshypothesen; für eine deskriptive Sekundäranalyse genügt, den
   Unterschied zur Frage zu kennen und zu wissen, wann man eine Hypothese
   aufstellen darf.
3. **Zwei Live-Abfragen** (Folien 5 und 15).
4. **Kein eingebetteter Demonstrator.** Das Modulkonzept nennt einen
   „Prüfer“ für eingetippte Forschungsfragen; den gibt es noch nicht, und die
   Übung mit dem Agenten am Codebuch leistet dasselbe. Wenn du ihn willst,
   ist er eine eigene Aufgabe.

## Symbole

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Vergleich |
| 💬 | Merksatz |
| ⌨️ | Code |
| 🪜 | Aufbau in Schritten |
| 🧪 | Live-Moment |
| 🗳️ | Live-Abfrage |
| 🎞️ | Animation |

# Die Folien

## Teil 0: Auftakt (2 Folien)

### Folie 1 🎬

**Titel:** `what is a research question?`
**Untertitel:** `prof. dr. nicolas meseth`

Die Agenda füllt stagekit aus den Teilen `from topic to question`,
`what makes a good one`, `questions without an answer`,
`sharpening a question` und `the reality test`.

### Folie 2 📷

**Bild:** ein riesiges, dunkles Archiv mit Regalen bis unter die Decke vor
schwarzem Grund; eine Person steht im Gang und leuchtet mit einer
Taschenlampe auf ein einzelnes Fach, nur dort ist Licht. Blick schräg von
hinten, kühles Licht im Strahl, sonst Schwarz.

**Text:** `a data set with 813 columns answers nothing by itself, until a
question tells you which shelf to light up.`

**Dazu sagen.** Die Umfrage enthält Antworten auf Hunderte von Fragen, aber
keine davon ist eure. Wer ohne Frage hineinsieht, findet Muster, die zufällig
sind, und kann am Ende nicht sagen, was die Arbeit herausgefunden hat. Die
Forschungsfrage ist der Teil, an dem alles andere hängt.

## Teil 1: from topic to question (4 Folien)

### Folie 3 🖼️ 🪜

**Titel klein:** `topic, problem, question`
**Zeichnung:** ein Trichter in drei Stufen, Schritt für Schritt:
`topic: plant-based milk` → `problem: how price affects choosing oat milk
over cow's milk` → `question: how does purchase certainty for alpro oat
drink change when its price rises from 1.79 to 2.09 euros?`
Fußnote: `after döring (2023), p. 148`.

**Dazu sagen.** Ein Thema benennt nur einen Gegenstand. Das Problem legt
fest, welche Erkenntnis man über welchen Aspekt gewinnen will. Die Frage
macht daraus etwas, das man mit Daten beantworten kann. Der häufigste
Anfängerfehler ist, beim Thema stehen zu bleiben.

### Folie 4 📊 🪜

**Titel klein:** `two conditions`
**Zwei Kästen nebeneinander:** `answerable with evidence` und `tells us
something about how the world works`. Schritt 2: darunter je ein Beispiel,
links mit Kreuz `which milk ad is the best?` (was heißt „beste“?), rechts
mit Kreuz `how many respondents live in lower saxony?` (beantwortbar, aber
ohne Erkenntnis). Schritt 3: in der Mitte mit Haken `do respondents who
care about the environment buy a larger share of organic food?`
Fußnote: `after huntington-klein, the effect, ch. 2`.

**Dazu sagen.** Huntington-Klein verlangt zwei Dinge: Es muss Belege geben,
die die Frage beantworten können, und die Antwort muss etwas darüber sagen,
warum Menschen tun, was sie tun. Ein Prüfstein: Würde ein unerwartetes
Ergebnis deine Meinung ändern? Wenn nicht, ist die Frage keine.

### Folie 5 🗳️

**Abfrage:** `which of these is a research question?`
Antworten: `sustainability and milk`, `milk is too cheap`,
`do vegans pay more for milk?` (richtig), `analyse the milk survey`.

### Folie 6 📊

**Titel klein:** `question or hypothesis`
**Zwei Spalten:** links `research question`: open, often a w-question,
when prior knowledge is thin; rechts `hypothesis`: a claim with a direction
(`respondents over 60 buy more organic food than those under 30`), derived
from theory or earlier findings, which you have to cite.
Fußnote: `after döring (2023), pp. 149–152`.

**Dazu sagen.** Eine Hypothese ist keine Vermutung aus dem Bauch, sondern
muss sich auf Theorie oder frühere Befunde stützen, die man zitiert. Wo das
Vorwissen dafür fehlt, stellt man eine offene Frage. Für eine Auswertung
einer vorhandenen Umfrage ist die Frage der Normalfall.

## Teil 2: what makes a good one (4 Folien)

### Folie 7 🖼️ 🪜

**Titel klein:** `three kinds of questions`
**Zeichnung:** drei Spalten `descriptive` (how many, how often, how is it
distributed), `relational` (do groups differ, do two things go together),
`causal` (what happens if we change one thing). Schritt für Schritt je ein
Beispiel aus der Umfrage. Bei `causal` ein gelbes Warndreieck
(`verdict "caution"`): braucht ein Design, das die Ursache trennt.

**Dazu sagen.** Was man am Ende behaupten darf, hängt von der Art der Frage
ab. Beschreiben und vergleichen geht mit jeder Umfrage, eine Ursache
behaupten nur, wenn die Daten es hergeben. (Wer die sechs Typen nach Leek
und Peng kennt, sieht hier deren grobe Fassung.)

### Folie 8 📊 🪜

**Titel klein:** `a checklist`
**Liste in Schritten,** jede Zeile eine Prüffrage:
- `potential results: would every possible answer teach you something?`
- `feasibility: do the data contain what you need?`
- `scale: can you answer it in the time you have?`
- `design: can these data separate what you want to separate?`
- `simplicity: is it one question, not three?`
Fußnote: `after huntington-klein, the effect, 2.4`.

**Dazu sagen.** Jede Zeile ist eine Frage, die ihr euch an eure eigene Frage
stellt, bevor ihr anfangt zu rechnen.

### Folie 9 📊

**Titel klein:** `too broad, just right`
**Zwei Kästen:** links mit Kreuz `what drives organic food purchases?`,
rechts mit Haken `do respondents who prefer organic products buy a larger
share of organic food in the discounter than in other shops?` Darunter grau:
`one variation, one outcome, one comparison`.

**Dazu sagen.** Die breite Frage klingt wichtiger, aber sie ist ein ganzes
Forschungsprogramm. Die enge Frage lässt sich in vier Wochen beantworten,
und ihr wisst danach etwas.

### Folie 10 💬

**Satz:** `a question you can answer well is worth more than an important
one you can only talk about.`

## Teil 3: questions without an answer (3 Folien)

### Folie 11 📊 🪜

**Titel klein:** `four traps`
**Vier Kästen nacheinander, je mit Kreuz und einem Beispiel:**
- `normative`: `should oat milk cost as much as cow's milk?` → data describe,
  they do not judge
- `vague`: `what do germans think about food?` → no object, no measure
- `causal without design`: `does a higher income make people buy organic?`
  → one survey, income goes with education, place and values
- `not in the data`: `has organic buying grown since 2020?` → one wave
  only, november 2025

**Dazu sagen.** Diese Fragen sind nicht dumm, aber mit diesen Daten nicht zu
beantworten. Die normative Frage kann man umbauen („Wie viele Befragte
finden, dass …?“), die kausale in eine Zusammenhangsfrage, die vage durch
Eingrenzen.

### Folie 12 📊

**Titel klein:** `rescue the question`
**Zwei Spalten,** links die Falle, rechts die beantwortbare Fassung, grün:
`does income make people buy organic?` → `is household income related to
the share of organic food bought?`

**Dazu sagen.** Aus „macht“ wird „hängt zusammen“, und im Bericht steht
dann ehrlich, warum man nicht mehr behaupten kann.

### Folie 13 🗳️

**Abfrage (Quiz):** `which question can the milk survey answer?`
Antworten: `is milk too cheap?`, `do vegans shop at farm shops more often?`
(richtig), `did prices change since 2020?`, `does advertising cause brand
loyalty?`

## Teil 4: sharpening a question (3 Folien)

### Folie 14 🖼️ 🪜

**Titel klein:** `from idea to question`
**Zeichnung:** links die vage Idee `prices and oat milk`; rechts sechs
Felder, die nacheinander gefüllt werden:
`who`: people who bought milk or milk alternatives in the last 12 months,
`where`: an online panel across germany,
`when`: november 2025,
`variation`: price of alpro oat drink at 1.69, 1.79, 1.89 or 2.09 euros,
`outcome`: purchase certainty from −4 to +4,
`comparison`: each price against the regular 1.79.

**Dazu sagen.** Wer diese sechs Felder ausfüllen kann, hat eine Frage. Wer
an einem Feld hängen bleibt, weiß jetzt, wo sie noch unscharf ist.

### Folie 15 💬

**Satz (die geschärfte Frage):** `how does purchase certainty for alpro oat
drink change among milk buyers when its price lies 10 cents below or 10 or
30 cents above the regular 1.79 euros?`

**Dazu sagen.** Das ist eine Frage, die man in einen Titel schreiben kann,
und jedes Wort darin entspricht einer Spalte oder einer Zeile im Datensatz.

### Folie 16 🖼️

**Titel klein:** `the price experiment`
**Zeichnung:** vier Gruppen nebeneinander, je ein Regal mit drei Packungen
(Weihenstephan 1.79, Gut & Günstig 1.09, alpro mit wechselndem Preis), die
alpro-Preise gelb; darunter `randomly assigned`.

**Dazu sagen.** Weil der Zufall entschieden hat, wer welchen Preis sah,
unterscheiden sich die Gruppen nur im Preis. Hier, und nur hier, dürft ihr
sagen, dass der Preis die Kaufsicherheit verändert. Das ist der Unterschied
zwischen einem Design, das ihr geerbt habt, und einer Frage, die nur gut
klingt.

## Teil 5: the reality test (3 Folien)

### Folie 17 🖼️ 🪜

**Titel klein:** `the data came first`
**Zeichnung:** drei Kästen im Kreis: `your question` → `codebook` →
`variables`. Schritt 2: drei Ausgänge `answerable` (Haken), `adapt the
question` (gelb), `drop it` (Kreuz).

**Dazu sagen.** Die Daten sind erhoben, und keine Frage kann eine Spalte
nachträglich erzeugen. Also passt sich die Frage den Daten an und nicht
umgekehrt; die Daten passend zu reden ist der Fehler, nicht das Anpassen.
In der angewandten Marktforschung ist das der Normalfall.

### Folie 18 📊

**Titel klein:** `check it against the codebook`
**Tabelle:** die geschärfte Frage zerlegt in ihre Teile, je mit der Spalte
aus dem Codebuch (`F6` für Milchkäufer, `ad015p1reaktion4` für die
Preisstufe, `U015p1reaktion4_3alpro` für die Kaufsicherheit) und dem Filter
(wem die Frage gestellt wurde, n ≈ 600). Zahlen beim Bau nachgeprüft.

**Dazu sagen.** Für jedes Wort der Frage gibt es eine Spalte, und für jede
Spalte steht im Codebuch, wem sie gestellt wurde. Fehlt eine, ändert sich
die Frage.

### Folie 19 📷

**Bild:** dasselbe Archiv wie auf Folie 2, jetzt steht die Person am
beleuchteten Fach und hält einen einzelnen Ordner aufgeschlagen in der Hand.

**Text:** `write your question down before you compute anything, check every
word against the codebook, and change the question rather than the data.`

**Dazu sagen.** Das ist der Auftrag für die Übung: die eigene Frage mit dem
Agenten gegen das Codebuch halten und in einer geschärften Fassung
aufschreiben.
