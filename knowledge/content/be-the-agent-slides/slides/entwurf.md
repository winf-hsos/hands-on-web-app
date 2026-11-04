# Entwurf: Input „Be the Agent“

**Status:** Entwurf vom 02.10.2026, von Nicolas am selben Tag freigegeben und
gebaut (`be-the-agent.html`).
**Verortung:** Sitzungsdeck zum Experiment `experiments\be-the-agent\`, für
Applications of AI und Problem Solving with AI. Es führt durch die 30 Minuten
des Experiments und die erste Einordnung danach; auf der Webseite ist es
eingebettet und ersetzt dort den längeren Text (Nicolas, 2026-10-02: Seite
knapp halten, je Experiment eine Präsentation).
**Kernbotschaft:** *An AI agent is a language model that can only write text;
everything it does in the world happens through tools that the harness runs
for it.* (das Key Takeaway des Experiments)
**Publikum:** Master Agrar und Lebensmittel (AAI) bzw. Problem Solving with
AI; kaum Erfahrung mit Agenten, haben das Deck „AI Agents“ gesehen oder sehen
es danach.
**Dauer:** rund 40 Minuten mit Spiel; 18 Folien, davon drei Spielphasen.
**Sprache:** Englisch, `style.toml` des Bereichs (Pink). Notizen deutsch.
**Titelfolie ohne Datum**, das Experiment kehrt wieder.

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Vergleich |
| 💬 | Merksatz |
| ⌨️ | Code / Karte |
| 🪜 | Aufbau in Schritten |
| 🧪 | Live-Moment |
| 🗳️ | Live-Abfrage |

# Die Folien

## Teil 0: Titel und Eröffnung (3 Folien)

### Folie 1
**Titel:** `be the agent` · **Untertitel:** `artificial intelligence · prof. dr. nicolas meseth`

### Folie 2
Agenda aus `data-parts`: the game · play · what you just played

### Folie 3 📷
**Bild:** Blick von oben auf einen dunklen Tisch: ein kleiner Stapel
Karteikarten mit pinkem Band in der Mitte, eine Hand schiebt eine neue Karte
darauf; am Rand angeschnitten weitere Tische mit Papieren, einem Taschenrechner
und einem Ordner. Schwarzer Hintergrund, warmes Licht nur auf dem Stapel.
**Text:** `today, you are the agent, and the computer is your group.`
**Dazu sagen.** Letzte Woche haben wir einem Agenten zugesehen. Heute spielen
wir einen nach, ohne Rechner, damit sichtbar wird, wer eigentlich was tut.

## Teil 1: the game (5 Folien)

### Folie 4 🎬
`the game`

### Folie 5 🖼️ 🪜
**Titel klein:** `seven roles`
**Zeichnung:** in der Mitte der Tisch des Models mit dem Kartenstapel; vier
Werkzeugtische im Halbkreis (`search`, `web`, `files`, `calculator`); ein
gestrichelter Weg vom Model zu jedem Tisch, darauf eine kleine Figur
`harness`; am Rand eine Figur `observer` mit Klemmbrett.
Schritte: Model und Stapel · die vier Werkzeuge · der Harness auf dem Weg ·
der Observer.
**Dazu sagen.** Gruppen zu sieben; bei fünf oder sechs übernimmt jemand zwei
Rollen (Search und Web, dann Files und Calculator). Rollenkarten austeilen.

### Folie 6 ⌨️ 🪜
**Titel klein:** `four kinds of cards`
**Zeichnung:** vier Karten nebeneinander wie auf dem Tisch, mit farbigem
Band: `THINK: i need the size of the field first.` ·
`TOOL: read_file("fields")` · `RESULT: long acre, 4.5 ha, winter wheat` ·
`ANSWER: …`. Pink die Karten des Models, grau die des Werkzeugs.
**Dazu sagen.** Das Model schreibt nur drei Sorten Karten; die vierte, das
Ergebnis, kommt von einem Werkzeug.

### Folie 7 🪜
**Titel klein:** `the rules`
**Text (in Schritten, je eine Zeile):**
`the model sees only its stack, and nobody talks to it.`
`the harness carries every card to the right tool and brings the result back.`
`a tool does exactly what the card says, nothing more.`
`one card at a time, until the model writes ANSWER:.`

### Folie 8 ⌨️
**Titel klein:** `the system card`
**Code:** die fünf Werkzeuge der Systemkarte, je Zeile Aufruf und kurze
Beschreibung.
**Dazu sagen.** Das ist alles, was das Model über seine Werkzeuge weiß. Steht
etwas nicht auf dieser Karte, gibt es das für das Model nicht.

## Teil 2: play (5 Folien)

### Folie 9 🎬
`play`

### Folie 10 🧪
**Titel klein:** `task 1 · about 5 minutes`
**Text groß:** `how large is the field long acre, and what grows on it this year?`
**Live-Moment:** Aufwärmrunde, nur ein Werkzeugaufruf nötig. Danach: Hat
jemand zuerst gesucht statt die Datei gelesen?

### Folie 11 🧪
**Titel klein:** `task 2 · swap roles · about 12 minutes`
**Text groß:** `how much nitrogen may we still apply to long acre this spring? give the total in kg N for the whole field.`

### Folie 12 💬
**Titel klein:** `task 2 · compare`
**Statement:** `which nitrogen requirement did your model use, and where did it come from?`
**Dazu sagen.** Frage in die Runde, jede Gruppe nennt ihren Wert (keine
Live-Abfrage, Nicolas 2026-10-02). 210 stammt aus dem Archiv von 2009. Woran
hätte das Model das erkennen können? Genau das Problem haben echte Agenten
mit veralteten Quellen.

### Folie 13 🧪
**Titel klein:** `task 3 · if there is time`
**Text groß:** `plan the first nitrogen application on long acre: how much of which product, and can we spread it on 10 february?`
**Dazu sagen.** Die Falle steckt in der Wetterdatei; nur wer sie liest, merkt,
dass der Boden gefroren ist.

## Teil 3: what you just played (5 Folien)

### Folie 14 🎬
`what you just played`

### Folie 15 📊 🪜
**Titel klein:** `from the game to a real agent`
**Tabelle in Schritten:** stack of cards → context window · system card →
system prompt · `THINK:` → reasoning · `TOOL:` → tool call · harness →
harness · search, web, files, calculator → tools · `RESULT:` → observation ·
`ANSWER:` → stop condition.

### Folie 16 🧪
**Titel klein:** `the same, in a real agent`
**Bild:** Ausschnitt aus dem Protokoll einer echten Agentensitzung (Claude
Code, Sitzung „A Brief History of AI“), Überlegung, Werkzeugaufruf und
Ergebnis farbig markiert wie die Karten.
**Live-Moment:** gemeinsam die vier Kartenarten im echten Protokoll finden.

### Folie 17 💬
**Titel klein:** `key takeaway`
**Statement:** `an AI agent is a language model that can only write text; everything it does in the world happens through tools that the harness runs for it.`

### Folie 18 🪜
**Titel klein:** `reflect`
**Text (in Schritten):**
`in which round would the model have been stuck without the tools?`
`what would have changed if the model had to give up its stack after ten cards?`
`who did the thinking, who did the acting, and which of it could the model actually do?`
**Dazu sagen.** Erst jede und jeder für sich schriftlich, dann in der Gruppe.

# Was sich an der Webseite ändert

Die Seite wird knapp; was erklärt, steht im Deck, das oben auf der Seite
eingebettet ist. Bleiben soll, was man beim Spielen nachschlägt:

| Abschnitt | heute | danach |
|---|---|---|
| Einleitung | ein Absatz | zwei Sätze und der Kasten „To print“ |
| Slides | – | das Deck, eingebettet |
| What you need | fünf Punkte | drei Punkte |
| The roles | Tabelle mit drei Spalten | entfällt, steht auf Folie 5 und den Rollenkarten |
| The rules | sechs Regeln mit Erklärungen | vier kurze Zeilen |
| Steps | sechs Schritte mit Fragen | vier kurze Schritte |
| What you just played | Tabelle | entfällt, steht auf Folie 15 |
| Key takeaway | Kasten | bleibt |
| Go further | fünf Absätze | fünf Zeilen, je ein Satz |
| Reflection | drei Fragen | bleibt |
| The kit | Karussell und Protokollblatt | bleibt |

Das PDF der Anleitung wird entsprechend kürzer; das Deck hat sein eigenes PDF
zum Herunterladen.

# Entscheidungen von Nicolas (2026-10-02)

1. **Eröffnungsfoto:** wie beschrieben, ja.
2. **Keine Live-Abfrage;** Folie 12 ist eine Frage in die Runde.
3. **Folie 16:** Ausschnitt aus dem Agentenprotokoll von Sitzung 1, nur die
   Schritte des Agenten.
4. **Kürzung der Webseite:** offen, im Chat erläutert.
