# Entwurf: Input „What Is an AI Agent?“ (seit 01.10.2026 „AI Agents“, Datei `ai-agents.html`)

**Status:** freigegeben am 2026-09-30 mit geänderten Quizfragen (Claude Code statt Geschichte), gebaut → `slides/what-is-an-ai-agent.html`. Ab jetzt ist die HTML-Datei die Quelle.
**Verortung:** Applications of Artificial Intelligence, WS 2026/27, Sitzung 2
(Do 01.10.2026, 11:30–13:00, HR 0004), direkt nach der Fortsetzung des
Experiments „A Brief History of AI“ (ca. 45 min). Für das Deck bleiben rund
30 Minuten, danach Organisatorisches.
**Kernbotschaft:** *An AI agent is a language model that uses tools in a loop
to reach a goal.* Alles andere (Plan, Skills, Subagenten, Kontext) ist um
diese Schleife herum gebaut, und genau das haben wir eben gesehen.
**Publikum:** Master Agrar- und Lebensmittelwirtschaft, Nutztier-,
Pflanzenwissenschaften, Land Use Transformation; fast niemand hat schon mit
einem Agenten gearbeitet (Handzeichen in Sitzung 1).
**Sprache:** Englisch auf den Folien, Notizen deutsch. `style.toml` des Moduls.
**Titelfolie ohne Datum** — der Input kehrt wieder.
**Grundlage:** eigene Recherche (Quellen unten) und die alten Folien aus der
Inbox: der Aufbau „AI agents“ aus *Scientific Writing and AI* (Folien 20–32:
goal → LLM → tools → Dateisystem → Kontextfenster → Schleife → Plan → Skills
→ agents.md) und die Landkarte „AI landscape“ und „AI agents“ aus
*Einführung Generative KI* (Folien 29–30). Übernommen werden die Ideen, nicht
die Excalidraw-Optik: Die Zeichnungen entstehen neu in `draw.js`.

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

## Zeitplan (ca. 30 min)

| Teil | Minuten | Was passiert |
|---|---|---|
| 1 Quick quiz | 0–7 | vier Fragen zum Agenten im Experiment, am Handy |
| 2 What is an agent? | 7–12 | Chatbot vs. Agent, die Definition |
| 3 Inside the loop | 12–22 | die Anatomie, Schritt für Schritt, an dem, was wir gesehen haben |
| 4 The landscape | 22–27 | welche Agenten es gibt, wo sie laufen, warum gerade jetzt |
| 5 Handle with care | 27–30 | Risiken, Überleitung ins Semester |

# Die Folien

## Titel und Agenda (2 Folien)

### Folie 1
`what is an AI agent?` · Untertitel `applications of artificial intelligence · prof. dr. nicolas meseth`

### Folie 2
Agenda aus `data-parts`: quick quiz · what is an agent? · inside the loop · the landscape · handle with care

## Teil 1: quick quiz (4 Folien)

Live-Abfragen über classroom-live wie in den anderen Modulen
(`data-live-url="https://live.hsos.uber.space"`, `data-live-module="aai"`,
`data-live-series="what-is-an-ai-agent"`). Jede Frage in zwei Schritten:
offen, dann Auflösung. **Gefragt wird nach Claude Code als Agent im
Experiment, nicht nach der Geschichte der KI** (Nicolas, 2026-09-30). Wer
zugesehen hat, kann antworten. Anonym, zählt nicht. Die Antworten sind die
Vorlage für Teil 3.

### Folie 3 🗳️
**Abfrage** `what-we-gave` — `what did we give the agent to start the research?`
- `a step-by-step instruction for every source`
- **`a goal, a photo and a text file`** ✔
- `a list of all websites it should visit`
- `a program we wrote for it`

**Dazu sagen.** Kein Rezept, sondern ein Ziel. Den Weg hat der Agent selbst
gefunden.

### Folie 4 🗳️
**Abfrage** `where-it-worked` — `where did the agent do its work?`
- `on the laptop: the model and everything else ran there`
- **`in a folder on the laptop; the language model ran in the cloud`** ✔
- `in the browser, just like ChatGPT`
- `on a university server`

**Dazu sagen.** Die Dateien erschienen im Ordner auf meinem Rechner, das
Modell selbst ist viel zu groß dafür. Distraktor 1 ist genau das, was man
leicht glaubt.

### Folie 5 🗳️
**Abfrage** `who-split-the-work` — `the research ran in 8 sub-agents at once. who decided that?`
- `our prompt told it to`
- **`the agent itself`** ✔
- `a setting in the app`
- `nobody, it always works that way`

**Dazu sagen.** Stand nirgends im Prompt. Der Aha-Moment von letzter Woche.

### Folie 6 🗳️
**Abfrage** `plan-first` — `why did every prompt end with "show me your plan. wait for my go."?`
- `the agent cannot start without permission`
- **`to check and correct the plan before it acts`** ✔
- `to save money`
- `to make it work faster`

**Dazu sagen.** Der Agent hätte auch ohne losgelegt. Der Plan ist unsere
Stelle zum Eingreifen, das kommt in Teil 3 und am Ende wieder.

## Teil 2: what is an agent? (3 Folien)

### Folie 7 🎬📷
**Bild:** Symbolfoto, rechts, schwarzer Grund: ein aufgeklappter Laptop auf
einem Schreibtisch in einem dunklen Raum, auf dem Bildschirm laufen Fenster,
daneben ordentlich gestapelte Ausdrucke und ein leerer Stuhl — jemand hat
gearbeitet, aber niemand sitzt da.
**Text:** `who did the work?`
**Dazu sagen.** Zurück zu eben: Wir haben zwei Sätze getippt und ein paarmal
„yes“ gesagt. Wer hat die Quellen gefunden, heruntergeladen, gelesen, die App
gebaut?

### Folie 8 📊🪜
**Titel klein:** `chatbot vs. agent`
**Zeichnung:** zwei Bahnen übereinander.
- oben `chatbot`: `you` → `prompt` → `LLM` → `answer` → `you` (du machst den nächsten Schritt)
- Schritt 1, unten `agent`: `you` → `goal` → `LLM ⟳ tools` → `result`; die Schleife gelb
**Punchline:** `a chatbot answers. an agent acts.`
**Dazu sagen.** Unter der Haube dasselbe Sprachmodell. Der Unterschied ist,
was drumherum gebaut ist.

### Folie 9 💬
**Titel klein:** `a working definition`
**Text groß:** `an LLM agent runs tools in a loop to achieve a goal.`
**Fußnote:** `simon willison, september 2025 · anthropic: agents are "LLMs using tools based on environmental feedback in a loop"` (beide verlinkt)
**Dazu sagen.** Drei Teile, die wir gleich einzeln ansehen: das Sprachmodell,
die Werkzeuge, die Schleife. „Goal“ heißt: Die Schleife hört auf, wenn das
Ziel erreicht ist.

## Teil 3: inside the loop (7 Folien)

Eine Zeichnung, die sich über sechs Folien aufbaut, nach dem Vorbild der
alten Folie 32 aus *Scientific Writing and AI*, aber mit unserem Beispiel:
Ziel `"build a knowledge base on the history of AI"`. Jedes neue Element
bekommt einen Satz „what we saw today“ darunter.

### Folie 10 🖼️🪜
**Titel klein:** `the goal and the model`
**Zeichnung:** oben das Ziel als Zitat, darunter `LLM` im Kasten.
**Text:** `what we saw: two sentences, a photo, a text file.`
**Dazu sagen.** Das Modell allein kann nur Text erzeugen. Es kann keine Datei
öffnen, keine Webseite laden.

### Folie 11 🖼️🪜
**Titel klein:** `tools`
**Zeichnung:** rechts die Werkzeugspalte: `read` · `write` · `edit` · `bash` ·
`web search` · `web fetch`; Pfeil `calls` vom Modell. Rechts daneben
`your files` (Ordnersymbol, Bootstrap Icons).
**Text:** `what we saw: it listed the folder, downloaded papers, wrote files.`
**Dazu sagen.** Das Modell schreibt nur auf, welches Werkzeug es mit welchen
Argumenten aufrufen will; ausgeführt wird es von dem Programm auf meinem
Rechner. Werkzeuge sind die Hände.

### Folie 12 🖼️🪜
**Titel klein:** `the loop`
**Zeichnung:** Pfeil vom Werkzeug zurück ins Modell (`result`), die Schleife
gelb, dazu das Bootstrap-Symbol arrow-repeat. Drei Wörter an der Schleife:
`think → act → observe`.
**Text:** `what we saw: it read a source, then decided what to do next.`
**Dazu sagen.** Das Muster heißt in der Forschung ReAct (Yao u. a., 2022):
denken, handeln, Ergebnis ansehen, weiter. Der Kern jedes Agenten.

### Folie 13 🖼️🪜
**Titel klein:** `context window`
**Zeichnung:** ein Speicher neben dem Modell, der sich mit jeder Runde füllt
(Balken in Gelb, `14 % of 1M tokens`).
**Text:** `what we saw: "context 14 %" in the corner.`
**Dazu sagen.** Alles, was der Agent „weiß“, steht in diesem Fenster: Aufgabe,
jede Werkzeugantwort, jede Zwischenüberlegung. Ist es voll, muss er
zusammenfassen oder vergessen. Thema einer späteren Sitzung.

### Folie 14 🖼️🪜
**Titel klein:** `plan and instructions`
**Zeichnung:** unten links eine Aufgabenliste mit Haken (`read inputs` ✔,
`research sources`, `write knowledge base`); oben links `skills` und
`agents.md` als Dateien, Pfeil `loads`.
**Text:** `what we saw: "show me your plan. wait for my go."`
**Dazu sagen.** Der Plan ist ein Werkzeug wie jedes andere: Der Agent schreibt
sich eine Liste und hakt ab. Skills und `agents.md` sind Anweisungen in
Textdateien, die er bei Bedarf liest. Wie meine Agenten für die Lehre.

### Folie 15 🖼️🪜
**Titel klein:** `sub-agents`
**Zeichnung:** das Modell schickt acht kleine Kopien los (`task`), jede mit
eigenem Kontextfenster, und sammelt ihre Ergebnisse ein.
**Text:** `what we saw: "research by 8 agents" — nobody asked for that.`
**Dazu sagen.** Das war der Aha-Moment von letzter Woche: Wir haben es nicht
verlangt. Parallel geht schneller, und jede Kopie hat ein frisches
Kontextfenster.

### Folie 16 💬
**Titel klein:** `all of it together`
**Zeichnung:** die volle Zeichnung aus 10–15, alles in Grau außer der
Schleife in Gelb.
**Punchline:** `the model thinks. the tools act. the loop keeps going until the goal is reached.`

## Teil 4: the landscape (4 Folien)

### Folie 17 📊
**Titel klein:** `workflow or agent?`
**Zeichnung:** links ein fester Pfad aus drei Kästen (`predefined steps`),
rechts die Schleife (`the model decides the next step`).
**Fußnote:** `anthropic, building effective agents (2024)` (verlinkt)
**Dazu sagen.** Nicht alles, wo KI drinsteckt, ist ein Agent. Ein Workflow
folgt festen Schritten, ein Agent entscheidet selbst. Anthropics Rat: so
einfach wie möglich, Agenten nur, wo es nötig ist.

### Folie 18 📊
**Titel klein:** `models, apps, agents`
**Zeichnung:** drei Spalten nach dem Vorbild der alten Landkarte.
- `models`: GPT, Claude, Gemini · open: Llama, Qwen, DeepSeek, Mistral, Gemma
- `apps`: chatgpt.com, claude.ai, gemini.google.com
- `agents`: Claude Code, Codex, Antigravity, OpenCode, OpenClaw
**Dazu sagen.** Ein Modell steckt in vielen Produkten. Die Grenzen
verschwimmen: Auch ChatGPT kann inzwischen suchen, Code ausführen, Dateien
erzeugen. Genaue Modellnummern lassen wir weg, sie veralten im Monat.

### Folie 19 🖼️
**Titel klein:** `where does it run?`
**Zeichnung:** links `your computer` mit Agent und Dateien, rechts `cloud`
mit dem Modell, dazwischen Text hin und her; im nächsten Schritt ein
gestrichelter Kasten `local model` auf dem Rechner.
**Text:** `next week: a model on your own laptop.`
**Dazu sagen.** Der Agent läuft bei mir, das Modell in einem Rechenzentrum.
Nächste Woche holen wir ein Modell auf den eigenen Rechner (LM Studio).

### Folie 20 📊
**Titel klein:** `why now?`
**Zeichnung:** Balken auf logarithmischer Achse: Länge der Aufgaben, die ein
Modell in der Hälfte der Fälle selbständig schafft (gemessen an der Zeit, die
ein Mensch braucht).
- Feb 2025 Claude 3.7 Sonnet: `about 50 minutes`
- Aug 2025 GPT-5: `about 3.5 hours`
- Apr 2026 Claude Mythos: `16 hours or more`
**Punchline:** `the length of tasks agents can finish doubles every few months.`
**Fußnote:** `METR, time horizons (2025, update january 2026)` (verlinkt)
**Dazu sagen.** Zwischen 2019 und 2024 verdoppelte sich die Länge etwa alle
sieben Monate, seit 2023 eher alle vier. Es sind Programmieraufgaben; ob das
auf andere Arbeit übertragbar ist, ist offen, und genau das diskutieren wir in
„agents and work“.

## Teil 5: handle with care (2 Folien)

### Folie 21 💬
**Titel klein:** `an agent acts with your permissions`
**Text:** drei Zeilen, nacheinander:
- `it can read every file you can read.`
- `it can run every command you can run.`
- `it can publish to the internet.`
**Dazu sagen.** Letzte Woche hätte er ohne Rückfrage veröffentlicht, weil wir
es verlangt hatten. Das OpenClaw-Video (Link folgt in ILIAS): ein Agent, der
unter Druck sensible Daten veröffentlicht. Die Frage für das Semester: Was
lassen wir zu, und wer ist verantwortlich?

### Folie 22 📷
**Bild:** das Foto aus Folie 7, jetzt sitzt jemand am Schreibtisch und sieht
auf den Bildschirm.
**Text:** `this semester, we open the loop.` · klein: `layer by layer, down to the model and back.`
**Dazu sagen.** Überleitung zum Semesterplan.

# Offene Punkte

1. **classroom-live:** Für das Modul muss auf `/feedback/live` ein Kurs
   angelegt werden (Vorschlag `aai-ws2026`, Modul `aai`, Sprache `en`), sonst
   landen die Sitzungen ohne Kurs. Den Admin-Schlüssel hinterlegst du am
   Vortragsrechner mit Taste L, eine Sitzung beginnt mit C.
2. **METR-Zahlen** geprüft: Claude 3.7 Sonnet rund 50 Minuten (Abstract des
   Papers), GPT-5 3 h 34 min, Mythos mindestens 16 h (Wikipedia, METR). Einen
   Wert für GPT-4 habe ich nicht belegt gefunden, deshalb fehlt er.
3. **Organisatorisches** (Semesterplan, Klausur, RT, Hausaufgabe LM Studio):
   als Teil 6 an dieses Deck anhängen oder mit dem PDF des Plans zeigen?

# Quellen

- Simon Willison, „I think 'agent' may finally have a widely enough agreed
  upon definition to be useful jargon now“, 18.09.2025:
  https://simonwillison.net/2025/Sep/18/agents/
- Anthropic, „Building effective agents“, Dezember 2024:
  https://www.anthropic.com/research/building-effective-agents
- Yao u. a., „ReAct: Synergizing Reasoning and Acting in Language Models“,
  2022: https://arxiv.org/abs/2210.03629
- METR, „Measuring AI Ability to Complete Long Tasks“, März 2025:
  https://arxiv.org/abs/2503.14499 · Übersicht (Stand 08.05.2026):
  https://metr.org/time-horizons/ · Time Horizon 1.1 (Januar 2026) laut
  https://en.wikipedia.org/wiki/METR
- OpenClaw, Namens- und Projektgeschichte:
  https://en.wikipedia.org/wiki/OpenClaw
