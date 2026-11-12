# Entwurf: Input „Reasoning“

**Status:** Entwurf vom 12.11.2026, von Nicolas am selben Tag freigegeben
(„Deck bauen“, die drei offenen Fragen ohne Änderung: Motiv wie vorgeschlagen,
alle Folien, Live-Moment wie beschrieben) und gebaut (`reasoning.html`,
36 Folien, 58 Frames). Abweichungen beim Bau: Eröffnungssatz gekürzt auf
„some questions are easier on paper than in your head.“; bei der Traktorfrage
kleine Zeichen statt Urteilskästen und unter der falschen Antwort „then
together: 12,000 €“; die METR-Folie zeigt nur die zwei gemessenen Punkte und
die Verdopplungslinie; die Zahlen zu o1 auf Folie 25 stehen in der Zeichnung.
Ab jetzt ist die HTML-Datei die Quelle.
**Verortung:** Eigenes Folien-Item `reasoning-slides`, eingebettet oben in der
Lektion „Reasoning“ (`knowledge/content/reasoning/en.md`, Code 6271). Das Deck
folgt der Reihenfolge und dem Wortlaut der Lektion, und alle drei Zeichnungen
der Lektion (`answer-or-think`, `learning-from-rewards`,
`longer-or-more-often`) kommen auch auf die Folien. Ohne Modulnamen, ohne
Termine, ohne Verweise auf Plattformseiten.
**Kernbotschaft:** *A reasoning model is still a next-token predictor that has
learned to write out its steps before it answers, and that is what made
agents possible.*
**Publikum (Annahme):** Master Agrar und Lebensmittel; kennen
„Next-token prediction“, „The bitter lesson“ und „AI agents“ und haben LM
Studio auf dem Laptop.
**Dauer (Annahme):** rund 35 Minuten; 36 Folien, davon 6 Abschnittsfolien,
2 Live-Abfragen und ein Live-Moment in LM Studio.
**Sprache:** Englisch, `style.toml` der KI-Decks (Pink), Notizen deutsch.
**Titelfolie ohne Datum**, weil der Satz wiederkehrt.
**Farben auf den Folien:** Grau für alles, Pink für den Punkt der Folie. In
der Zeitleiste heißt Pink „trainiert, zu denken“ und Grau „im Prompt
verlangt“; Grün und Rot nur für richtig und falsch bei der Traktorfrage, nie
als Urteilskasten.
**Bewusst nicht drin:** wie Reinforcement Learning rechnet (Gradienten,
GRPO), Process Reward Models, Benchmarks im Einzelnen.

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
| 🎞️ | Animation |

# Die Folien

## Teil 0: Titel und Eröffnung (3 Folien)

### Folie 1
**Titel:** `reasoning` · **Untertitel:** `artificial intelligence · prof. dr. nicolas meseth`

### Folie 2
Agenda aus `data-parts`: thinking is writing · from a trick to a skill ·
learning from rewards · longer or more often · what it is not · why agents
need it

### Folie 3 📷
**Bild:** Ein aufgeschlagenes, abgegriffenes Notizbuch auf einer Werkbank in
einer dunklen Scheune, daneben ein kurzer Bleistift; auf der Seite einige
Zeilen handschriftlicher Rechnung, nicht lesbar, eine davon durchgestrichen
und darunter neu angesetzt. Eine einzelne Lampe von oben, im Hintergrund
unscharf das Rad eines Traktors, das ins Schwarz übergeht. Schwarzer
Hintergrund, keine lesbare Schrift, keine Logos.
**Text:** `some questions are answered better on paper than in your head, and language models have learned the same.`
**Dazu sagen.** Wer eine Rechnung im Kopf überschlägt, nimmt die Zahl, die
sich aufdrängt; wer zwei Zeilen aufschreibt, sieht den Fehler. Genau diesen
Unterschied haben Sprachmodelle seit 2024 gelernt, und darum geht es jetzt.

## Teil 1: thinking is writing (8 Folien)

### Folie 4 🎬
`thinking is writing`

### Folie 5 🗳️
**Abfrage (Quiz):** `a tractor and a trailer cost 11,000 € together, and the tractor costs 10,000 € more than the trailer. what does the trailer cost?`
Antworten: `500 €` · `1,000 €` · `1,500 €` · `10,000 €`
Richtig: `500 €`
**Dazu sagen.** Erst abstimmen lassen, ohne Papier. Die meisten nehmen
1.000 €; dann wäre der Traktor 11.000 € und beides zusammen 12.000 €.

### Folie 6 🖼️🪜
**Titel klein:** `answer at once, or think first`
**Zeichnung:** `answer-or-think` aus der Lektion. Schritt 0: die obere Reihe
(Frage → sofort 1,000 €, rot mit Kreuz). Schritt 1: die untere Reihe mit den
vier Zeilen Rechnung und 500 € in Grün.
**Dazu sagen.** Ein Modell, das die Antwort ins allernächste Token setzen
muss, nimmt die naheliegende Zahl. Schreibt es vorher seine Schritte auf,
liest es beim Antworten seine eigenen Notizen mit, denn sie stehen jetzt im
Kontext. Das heißt Reasoning, und Modelle, die darauf trainiert sind, heißen
Reasoning-Modelle.

### Folie 7 💬
**Text:** `a reasoning model is the same transformer predicting the same tokens, and what changed is what it has learned to write before the answer.`
**Dazu sagen.** Es gibt keinen verborgenen Ort, an dem das Modell still
nachdenkt. Was in der App hinter „Thinking…“ zugeklappt ist, ist Text wie
jeder andere.

### Folie 8 🖼️
**Titel klein:** `more tokens, more computation`
**Zeichnung:** Links eine Frage und ein einzelnes Token als Antwort, darüber
ein Pfeil durch einen Block `all layers` mit der Beschriftung `one pass`.
Rechts dieselbe Frage, gefolgt von einer langen Reihe kleiner Tokens, über
jedem ein kurzer Strich; darunter `500 tokens of thought = 500 passes`, die
Reihe in Pink.
**Dazu sagen.** Jedes Token kostet einen Durchgang durch alle Schichten,
egal ob die Frage „2 + 2“ heißt oder ein schweres Rätsel ist. Jedes Token der
Gedanken ist ein weiterer Durchgang.

### Folie 9 🖼️🪜
**Titel klein:** `the context is the paper`
**Zeichnung:** `37 × 48` groß; Schritt 1: darunter wie auf einem Zettel
`37 × 40 = 1,480` · `37 × 8 = 296` · `1,480 + 296 = 1,776`, das Ergebnis in
Pink. In Codeschrift, Stelle für Stelle ausgerichtet.
**Dazu sagen.** Im Kopf ist das mühsam, auf Papier nicht, weil die
Zwischenergebnisse liegen bleiben. Für ein Sprachmodell ist der Kontext das
Papier: Was es aufgeschrieben hat, liest es bei jedem späteren Token wieder.

### Folie 10 🖼️
**Titel klein:** `small steps are easier than one big step`
**Zeichnung:** Links ein großer Sprung von der Frage zur Antwort als ein
langer Bogen, grau mit Fragezeichen; rechts dieselbe Strecke als Treppe aus
vier kurzen Stufen, jede mit einer Zeile der Rechnung beschriftet, in Pink.
**Dazu sagen.** „x + x + 10.000 = 11.000“ ist leicht richtig zu treffen, die
Frage als Ganzes nicht. Jeder kleine Schritt liegt nah an etwas, das das
Modell schon tausendfach gesehen hat.

### Folie 11 🖼️🪜
**Titel klein:** `a step on paper can be checked`
**Zeichnung:** Eine Spalte Gedankentext in Codeschrift: `trailer: 1,000` ·
`tractor: 11,000` · `together: 12,000`; Schritt 1: darunter in Pink
`wait, that is 12,000, not 11,000.` und ein neuer Ansatz `trailer: x …`. Der
falsche Teil bleibt stehen und wird grau.
**Dazu sagen.** Ein geschriebenes Token wird nie zurückgenommen, auch hier
nicht. Die Korrektur löscht den Fehler nicht, sie steht später im Text, und
die Antwort beruht auf allem davor. Keiner dieser vier Effekte ist von Hand
eingebaut; sie folgen daraus, wie ein Sprachmodell arbeitet.

## Teil 2: from a trick to a skill (4 Folien)

### Folie 12 🎬
`from a trick to a skill`

### Folie 13 📊🪜
**Titel klein:** `asking for steps already helped`
**Zeichnung:** Zwei Balkenpaare. Schritt 0: `eight worked examples in the
prompt` mit `18 %` grau und `57 %` Pink (PaLM 540B, Rechenaufgaben aus der
Grundschule, GSM8K). Schritt 1: `"let's think step by step"` mit `18 %` grau
und `79 %` Pink. Fußnote: `wei et al. 2022 · kojima et al. 2022`.
**Dazu sagen.** 2021 zeigten Forschende von MIT und Google das Notizblatt,
Anfang 2022 kam Chain-of-Thought mit Beispielen, vier Monate später reichte
ein einziger Satz. Das Modell dachte aber nur, wenn man es darum bat, und so,
wie die Beispiele es vormachten.

### Folie 14 📊
**Titel klein:** `trained to think before every answer`
**Zeichnung:** Zwei Balken für AIME, einen Mathematikwettbewerb für starke
Schülerinnen und Schüler: `gpt-4o` `12 %` grau, `o1` `74 %` Pink. Darunter
`september 2024, reinforcement learning on a large scale`. Fußnote:
`openai 2024, one attempt per problem`.
**Dazu sagen.** o1 war das erste Modell, das gelernt hatte, vor jeder Antwort
zu denken. OpenAI verriet nicht, wie, und zeigt bis heute nur eine
Zusammenfassung der Gedanken. Im Januar 2025 legte DeepSeek mit R1 offene
Gewichte und das Rezept vor.

### Folie 15 🖼️🪜
**Titel klein:** `milestones`
**Zeichnung:** Zeitleiste von 2021 bis 2025, im Aufbau in drei Schritten.
Schritt 0, grau (im Prompt verlangt): `scratchpads 2021` · `chain of thought
01/2022` · `self-consistency 03/2022` · `step by step 05/2022` · `react
10/2022`. Schritt 1, Pink (trainiert): `o1 09/2024` · `o3, gemini 2.0 flash
thinking 12/2024` · `deepseek-r1 01/2025`. Schritt 2, Pink: `claude 3.7
sonnet 02/2025` · `imo gold 07/2025` · `gpt-5, gpt-oss 08/2025`. Legende mit
den zwei Farben.
**Dazu sagen.** Die Lücke zwischen 2022 und 2024 ist der Unterschied zwischen
einem Trick und einer trainierten Fähigkeit. Nach R1 bot binnen Wochen jedes
große Labor ein denkendes Modell an.

## Teil 3: learning from rewards (6 Folien)

### Folie 16 🎬
`learning from rewards`

### Folie 17 🖼️🪜
**Titel klein:** `three stages, and only the last is new`
**Zeichnung:** Drei Kästen nebeneinander, je Schritt einer: `pretraining`
(`predict the next token on the internet, books and code`), `examples of
thinking` gestrichelt (`optional: a few thousand worked answers`), `learning
from rewards` in Pink (`attempts that a program can check`).
**Dazu sagen.** Beim Vortraining sieht das Modell schon viele vorgerechnete
Lösungen; es weiß also, wie Denken auf Papier aussieht. Neu ist die dritte
Stufe.

### Folie 18 🖼️🎞️
**Titel klein:** `one round of learning from rewards`
**Zeichnung:** `learning-from-rewards` aus der Lektion.
**Animation (schrittweise):** Abschnitt 1: Aus der Aufgabe fließt ein Pfeil
ins Modell, danach stehen die vier Versuche mit ihren Antworten da.
Abschnitt 2: Hinter jedem Versuch erscheinen Haken oder Kreuz und `reward 1`
bzw. `reward 0`. Abschnitt 3: Die pinke Linie läuft von den belohnten
Versuchen zurück ins Modell, Beschriftung `the thinking that led to ✓ becomes
more likely`. Rückwärts springt jeder Abschnitt nur zurück.
**Dazu sagen.** Geprüft wird nur die Antwort, nie der Weg. Das wiederholt
sich über viele tausend Aufgaben, und dabei setzt sich durch, welche Art zu
denken öfter ankommt.

### Folie 19 🗳️
**Abfrage (Quiz):** `in learning from rewards, what does the program check?`
Antworten: `every step of the thinking` · `only the final answer` · `how long the thinking is` · `whether it sounds human`
Richtig: `only the final answer`

### Folie 20 💬
**Titel klein:** `nobody writes the thoughts`
**Text:** in Codeschrift `wait, wait. wait. that's an aha moment i can flag here.`
darunter `deepseek r1-zero, trained with rewards alone: aime from 16 % to 71 %`
**Dazu sagen.** R1-Zero bekam keine Beispiele fürs Denken, nur Belohnungen.
Seine Gedanken wurden im Training von selbst länger, und es fing an, die
eigenen Schritte zu prüfen. Das Zitat steht so im Paper.

### Folie 21 🖼️🪜
**Titel klein:** `why maths and code came first`
**Zeichnung:** Links `checkable`: `maths: compare with the known result` ·
`code: run the tests`, mit einem Haken je Zeile. Schritt 1: rechts
`loophole`: `the test only checks that it runs` → `a program that runs and
does nothing`, das Wort `reward hacking` in Pink.
**Dazu sagen.** Ein Programm kann Millionen Versuche schnell beurteilen, ohne
dass ein Mensch jeden lesen muss. Hat die Belohnung ein Schlupfloch, findet
das Modell es.

### Folie 22 🖼️
**Titel klein:** `from a large model to your laptop`
**Zeichnung:** Ein großer Kasten `deepseek-r1` → Pfeil `thoughts and
answers` → sechs kleine Kästen, der kleinste `1.5 b` in Pink. Darunter
`the smallest beat gpt-4o on aime`.
**Dazu sagen.** Destillation: Ein kleines Modell, das auf den Gedanken eines
großen nachtrainiert wird, denkt viel besser als allein. Deshalb gibt es
Reasoning-Modelle, die in LM Studio auf dem Laptop laufen.

## Teil 4: longer or more often (5 Folien)

### Folie 23 🎬
`longer or more often`

### Folie 24 🖼️🪜
**Titel klein:** `two curves`
**Zeichnung:** Zwei kleine Diagramme nebeneinander, x-Achse logarithmisch,
y-Achse `accuracy`. Schritt 0: links `train-time compute`, eine steigende
graue Linie. Schritt 1: rechts `test-time compute`, eine steigende pinke
Linie. Fußnote: `shape after openai 2024, for illustration`.
**Dazu sagen.** Bis dahin wurde ein Modell vor allem durch mehr Training
besser. Seit o1 zählt auch, wie viel Rechenzeit es auf eine einzelne Frage
verwendet, und jedes Zehnfache bringt einen ähnlichen Gewinn.

### Folie 25 🖼️🪜
**Titel klein:** `think longer, or think more often`
**Zeichnung:** `longer-or-more-often` aus der Lektion. Schritt 0: links die
lange Kette mit dem korrigierten Schritt. Schritt 1: rechts die fünf Versuche
und die Mehrheit. Schritt 2: darunter `o1 on aime: 74 % with one attempt,
83 % with 64 attempts and a vote`.
**Dazu sagen.** Länger heißt eine Kette mit mehr Schritten und Prüfungen; in
Stanford reichte es 2025, ein „Wait“ anzuhängen, wenn das Modell aufhören
wollte. Öfter heißt mehrere Versuche und eine Entscheidung. Ein kleines
Modell, das gut denken darf, schlägt bei passenden Aufgaben ein 14-mal
größeres.

### Folie 26 💬
**Text:** `learning and search are the two methods that keep scaling with computation, and a reasoning model uses both.`
**Dazu sagen.** Das ist die bittere Lektion von Rich Sutton noch einmal:
Lernen aus Belohnungen im Training, Probieren und Prüfen im Moment der
Antwort.

### Folie 27 📊
**Titel klein:** `thinking is not free`
**Zeichnung:** Zwei Zeilen für ARC-AGI mit o3: `76 %` · `about $26 per
puzzle`; `88 %` · `172 × the computation` · `thousands of dollars per
puzzle`, die zweite Zeile in Pink. Darunter `thinking tokens are billed like
answer tokens`. Fußnote: `arc prize 2024`.
**Dazu sagen.** Frühe Modelle dachten lange über 2 + 3 nach. Deshalb lässt
sich die Denkmenge einstellen, oft als low, medium und high, und neuere
Modelle wie GPT-5 entscheiden je Frage selbst, wie viel sie denken.

### Folie 28 🧪
**Titel klein:** `low or high`
**Text:** drei Zeilen: `change the numbers of the tractor question` ·
`ask once with reasoning low and once with reasoning high` · `compare time,
tokens and the thoughts`
**Live-Moment:** In LM Studio gpt-oss-20b laden, im Panel rechts unter
*Reasoning* zwischen low und high wechseln, die aufgeklappten Gedanken
vorlesen lassen. Frage zum Schluss: Wo bemerkt das Modell einen Fehler, und
liest es die geänderten Zahlen wirklich?

## Teil 5: what it is not (3 Folien)

### Folie 29 🎬
`what it is not`

### Folie 30 📊
**Titel klein:** `the thoughts are not always the reason`
**Zeichnung:** Zwei Balken: `claude 3.7 sonnet` `25 %`, `deepseek-r1` `39 %`,
Überschrift über den Balken `used a hint and said so`; der Rest jedes Balkens
grau mit `gave another reason`. Fußnote: `anthropic 2025`.
**Dazu sagen.** Anthropic gab den Modellen einen Hinweis auf die Antwort und
prüfte, ob die Gedanken ihn erwähnen, wenn das Modell ihn nutzte. Meist
lieferten sie stattdessen eine plausible Begründung. Die Gedanken helfen dem
Modell zur Antwort, sie sind kein Fenster in sein Inneres. Dass man sie lesen
kann, ist trotzdem eine Chance für die Sicherheit (Korbak et al. 2025).

### Folie 31 💬
**Titel klein:** `do they really reason?`
**Text:** `a long and convincing chain of thought is no proof, so the answer still has to be checked.`
**Dazu sagen.** Apple ließ 2025 Reasoning-Modelle Rätsel wachsender
Schwierigkeit lösen, etwa die Türme von Hanoi mit immer mehr Scheiben, und
ab einer Größe brach die Genauigkeit ein. Andere hielten dagegen, manche
Rätsel seien gar nicht lösbar gewesen oder die Antworten länger als erlaubt.
Für die Praxis genügt: weniger Fehler bei Aufgaben mit vielen Schritten, aber
nicht keine.

## Teil 6: why agents need it (3 Folien)

### Folie 32 🎬
`why agents need it`

### Folie 33 🖼️🪜
**Titel klein:** `thinking inside the loop`
**Zeichnung:** Die Agentenschleife wie im Deck „AI agents“: `think` →
`call a tool` → `read the result` → zurück zu `think`. Schritt 1: an
`think` drei pinke Beschriftungen `a plan before the first step` · `a check
after each result` · `wait, that failed`.
**Dazu sagen.** Die Schleife heißt ReAct und stammt von 2022, aber Agenten
mit den damaligen Modellen kamen selten weit: Jeder Schritt einer langen
Aufgabe ist eine Gelegenheit für einen Fehler, und sie merkten es nicht. Seit
o3 und Claude 4 denken Modelle auch zwischen zwei Werkzeugaufrufen.

### Folie 34 📊
**Titel klein:** `how long an agent can work`
**Zeichnung:** Diagramm mit logarithmischer y-Achse `length of tasks solved
in half of the cases` (Minuten bis Stunden) und Zeitachse 2019 bis 2026;
graue Punkte für ältere Modelle, zwei beschriftete Punkte in Pink:
`claude 3.7 sonnet, 02/2025: about 1 hour` und `claude opus 4.5, 11/2025:
over 5 hours`. Darunter `doubling about every seven months`. Fußnote:
`metr 2025, 2026; points except the two labelled ones for illustration`.
**Dazu sagen.** METR misst, wie lange Aufgaben aus der Softwareentwicklung
für eine erfahrene Person dauern würden, die ein Modell in der Hälfte der
Fälle löst. Diese Länge verdoppelt sich etwa alle sieben Monate, seit 2024
schneller.

### Folie 35 💬
**Text:** `an agent that works for hours is a model that thinks before it acts, many thousands of times in a row.`
**Dazu sagen.** Zurück zur Traktorfrage vom Anfang: Dasselbe Prinzip, zwei
Zeilen vor der Antwort, ist im Großen das, was Agenten trägt.

### Folie 36
**Titel klein:** `further reading`
**Text:** Liste: wei et al. 2022 (chain of thought) · kojima et al. 2022 ·
openai 2024 (learning to reason with llms) · deepseek-ai 2025 (deepseek-r1) ·
anthropic 2025 (reasoning models don't always say what they think) · metr
2025 (measuring ai ability to complete long tasks). Jeder Eintrag ein Link.

# Offene Fragen an Nicolas

1. Passt das Eröffnungsmotiv (Notizbuch mit durchgestrichener Rechnung in der
   Scheune), oder lieber ein anderes?
2. Rund 35 Minuten mit 36 Folien: so lassen, oder kürzen (Kandidaten:
   Folie 22 Destillation, Folie 24 zwei Kurven, Folie 26 bittere Lektion)?
3. Der Live-Moment in LM Studio (Folie 28) setzt gpt-oss-20b auf den Laptops
   voraus; sonst zeige ich ihn am Beamer oder lasse ihn weg.
