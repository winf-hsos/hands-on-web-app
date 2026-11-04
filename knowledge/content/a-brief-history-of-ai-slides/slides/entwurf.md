# Entwurf: Input „A Brief History of AI — Built Live with an Agent“

**Status:** freigegeben und gebaut am 2026-09-23 → `slides/a-brief-history-of-ai.html`. Ab jetzt ist die HTML-Datei die Quelle; dieser Entwurf wird nicht mehr nachgezogen. Abweichungen beim Bau: Folie 3 („today“) entfällt, die Agenda zeigt dasselbe; der Prompt steht vollständig auf der Folie mit Kopierknopf; Folie 19 hat ein Eingabefeld für die URL; der QR-Code kommt vom Agenten.
**Verortung:** Applications of Artificial Intelligence, WS 2026/27, Sitzung 1
(Do 24.09.2026, 11:30–13:00, OS 0105), 35 Kursmitglieder
**Zweck:** Orientierung für Nicolas durch die 90 Minuten, zugleich auf dem
Beamer sichtbar. Kein Wort zu Prüfung, Ablauf, Curriculum — das kommt in
Sitzung 2. Die Sitzung soll beeindrucken: Die Studierenden entscheiden jetzt,
ob sie bleiben.
**Kernbotschaft:** *A chatbot talks. An agent acts.* Und: Was ihr heute
gesehen habt, nehmen wir in diesem Semester Schicht für Schicht auseinander.
**Sprache:** Englisch (Folien und Prompts); Sprechernotizen deutsch.
**Design:** `style.toml` aus dem Praxisprojekt übernommen (Schwarz,
Hochschulblau als Leitfarbe), nur `language = "en"`.
**Titelfolie ohne Datum** — die Sitzung kehrt jedes Wintersemester wieder.

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Vergleich |
| 💬 | Merksatz |
| ⌨️ | Code / Prompt |
| 🪜 | Aufbau in Schritten |
| 🧪 | Live-Moment |
| 🕹️ | eingebetteter Demonstrator |

## Zeitplan (90 min)

| Teil | Minuten | Was passiert |
|---|---|---|
| 1 Opening | 0–5 | Eröffnungsfoto, Ansage: heute bauen wir |
| 2 What we know | 5–20 | Pinnwand: Meilensteine der KI, die ihr kennt |
| 3 Let the agent build | 20–60 | Claude Code baut live; währenddessen vier Anrisse fürs Semester |
| 4 Check & publish | 60–80 | App ansehen, Fehler suchen, auf GitHub Pages veröffentlichen |
| 5 What's next | 80–90 | Link mitnehmen, Hausaufgabe, Ausblick |

# Die Folien

## Teil 1: Opening (3 Folien)

### Folie 1 📷
**Bild:** Ein langer, dunkler Gang, an dessen Wänden in regelmäßigen Abständen
leuchtende Tafeln hängen — jede mit einer Jahreszahl, von einer alten
Lochkarte vorn bis zu einem hellen Bildschirm ganz hinten. Schwarzer
Hintergrund, kühles Licht, Blick den Gang entlang.
**Text:** `75 years of artificial intelligence. today, we build its history — with an AI.`
**Dazu sagen.** Willkommen. Heute gibt es keine Folien über Organisation und
Prüfung, das kommt nächste Woche. Heute machen wir etwas zusammen.

### Folie 2 (Titel)
**Titel:** `a brief history of AI — built live with an agent`
**Titel klein:** `applications of artificial intelligence · prof. dr. nicolas meseth`

### Folie 3 🪜
**Titel klein:** `today`
**Text (in Schritten):**
`1 · what do you already know?`
`2 · an AI agent builds a web app from it`
`3 · we check it and publish it`
`4 · you leave with a link`
**Dazu sagen.** Das Ziel am Ende der 90 Minuten: eine öffentliche Web-App, die
es heute Morgen noch nicht gab. Ihr liefert den Inhalt, der Agent baut.

## Teil 2: What we know (3 Folien)

### Folie 4 🎬
`what we know`

### Folie 5 🧪
**Titel klein:** `your turn: milestones of AI`
**Text:**
`one card = one milestone`
`year (if you know it) + what happened`
`block letters, big`
`pin it on the board`
**Live-Moment:** 10 Minuten. Karten und dicke Stifte austeilen, zu zweit
arbeiten lassen. Alles zählt: ChatGPT, Schachcomputer, Filme, der Mähroboter
zuhause. Nicolas sortiert grob auf der Pinnwand nach Zeit.
**Dazu sagen.** Es gibt keine falschen Karten. Was nicht stimmt, findet der
Agent — oder wir.

### Folie 6 🧪
**Titel klein:** `snap`
**Text:** `this photo is all the agent gets from us.`
**Live-Moment:** Pinnwand fotografieren (zwei Fotos), per Remote Control vom
Handy direkt an Claude Code. Gemeinsam kurz draufschauen: Was hätte ein
Mensch Mühe zu lesen?

## Teil 3: Let the agent build (9 Folien)

### Folie 7 🎬
`let the agent build`

### Folie 8 ⌨️
**Titel klein:** `the task`
**Code (Prompt an Claude Code, gekürzt auf der Folie, vollständig in den Notizen):**
```
Build an interactive web app "A Brief History of AI"
that guides visitors through the history of AI
along a timeline.

Inputs:
- photos of our pinboard (what the students know)
- milestones.md (curated, with sources)

Rules:
- no entry without a verified source
- unverifiable pinboard cards go to "still to check"
- mark entries that came from the students
- static site for GitHub Pages, works on phones
- no student names, don't publish the photos

First read everything and show me your plan.
```
**Dazu sagen.** Das ist alles, was wir ihm sagen. Den Rest entscheidet er —
welche Dateien, welcher Aufbau, welche Werkzeuge.

### Folie 9 🧪
**Titel klein:** `watch`
**Text:** `plan · read · write · run · look · fix · repeat`
**Live-Moment:** Claude Code auf den Beamer. Den Plan laut vorlesen, dann mit
„go ahead“ freigeben. Studierende dürfen Wünsche hineinrufen (Filter nach
Kategorie, Quiz „guess the year“, Bilder). Während der Agent arbeitet,
laufen die Folien 10–15.

### Folie 10 🖼️ 📊
**Titel klein:** `chatbot vs. agent`
**Zeichnung:** Links ein Kasten *chatbot*: Eingabe → Modell → Text; der Mensch
trägt Code, Fehler und Dateien selbst hin und her (Pfeilschleife über eine
Figur). Rechts ein Kasten *agent*: Modell in der Mitte, darum Werkzeuge
(files, terminal, browser, web, github), die Schleife *think → act → observe*
läuft ohne den Menschen.
**Punch:** `a chatbot talks. an agent acts.`
**Dazu sagen.** Mit ChatGPT im Browser hätten wir den Code bekommen — und
dann selbst Dateien angelegt, ausprobiert, Fehlermeldungen zurückkopiert. Hier
ist der Mensch aus der Schleife raus. Das ist das Thema dieses Semesters.

### Folie 11 💬
**Titel klein:** `four questions for this semester`
**Text:** `what did we just watch — and how does it work?`
**Dazu sagen.** Überleitung: Vier Dinge sind euch gerade vielleicht
aufgefallen. Jedes ist ein Thema, das wir auseinandernehmen.

### Folie 12 🖼️
**Titel klein:** `1 · how does a language model write?`
**Zeichnung:** Ein Satzanfang aus dem Prompt, dahinter drei Kandidaten für das
nächste Wort mit Balken (Wahrscheinlichkeiten), der gewählte gelb markiert.
**Punch:** `one token at a time.`
**Dazu sagen.** Alles, was der Agent schreibt — Plan, Code, Texte — entsteht
Wort für Wort, genauer: Token für Token. Wie das geht, schauen wir uns an.

### Folie 13 🖼️
**Titel klein:** `2 · where does it learn that?`
**Zeichnung:** Drei Stufen als Treppe: *pre-training* (Text aus dem Internet)
→ *fine-tuning* (Beispiele) → *human feedback* (Bewertungen).
**Punch:** `nobody programmed it to write web apps.`
**Dazu sagen.** Niemand hat dem Modell HTML beigebracht. Es hat es gelernt —
aus Daten. Wie trainiert man so etwas?

### Folie 14 🖼️ 📊
**Titel klein:** `3 · rules vs. learning`
**Zeichnung:** Die Werkzeuge des Agenten zweigeteilt: links *learned* (das
Modell: planen, schreiben, entscheiden), rechts *rules* (git, browser,
Websuche, Taschenrechner — exakt und vorhersagbar).
**Punch:** `agents bring both worlds together.`
**Dazu sagen.** Für manche Aufgaben sind Regeln besser: Rechnen, Dateien
speichern, veröffentlichen. Ein Agent entscheidet, wann er welches Werkzeug
nimmt. Den Unterschied zwischen Lernen und Regeln brauchen wir das ganze
Semester.

### Folie 15 🖼️
**Titel klein:** `4 · how did it read our handwriting?`
**Zeichnung:** Das Pinnwandfoto → Gitter aus Kacheln → Reihen von Zahlen
(Vektoren) → Text.
**Punch:** `to a model, everything is numbers.`
**Dazu sagen.** Das Modell hat unsere Karten gelesen. Bilder, Texte, Code —
für das Modell sind das alles Zahlen. Wie diese Zahlen Bedeutung tragen, ist
eine der schönsten Ideen der KI.

## Teil 4: Check & publish (4 Folien)

### Folie 16 🎬
`check & publish`

### Folie 17 🧪
**Titel klein:** `test it`
**Text:**
`open it on your phone`
`find one thing that is wrong or missing`
**Live-Moment:** Der Agent startet die App lokal; Nicolas klickt durch. Wenn
der Agent „still to check“-Einträge gefunden hat: vorlesen — welche Karten
konnte er nicht belegen, und warum?
**Dazu sagen.** Vertrauen ist gut: Wir prüfen. Jeder Eintrag hat eine Quelle
— klickt eine an.

### Folie 18 🧪 ⌨️
**Titel klein:** `publish`
**Code:**
```
Create a public GitHub repository and publish
the app with GitHub Pages. Give me the URL.
```
**Live-Moment:** Der Agent legt das Repository an, pusht, schaltet Pages ein.
Während Pages baut (1–2 Minuten): Rückblick, wie viele Schritte der Agent
gebraucht hat.

### Folie 19 🧪
**Titel klein:** `it's live`
**Text:** URL und QR-Code (werden live eingesetzt, notfalls an die Tafel)
**Dazu sagen.** Vor 90 Minuten gab es diese Seite nicht.

## Teil 5: What's next (5 Folien)

### Folie 20 🪜 🖼️
**Titel klein:** `behind the scenes: this session was prepared by agents, too`
**Zeichnung (in Schritten):** Ein Agent in der Mitte (*orchestrator*) verteilt
vier Aufträge an vier Subagenten nebeneinander — *1943–1989*, *1997–2017*,
*2018–2024*, *2025–2026*. Jeder öffnet Quellen (kleine Dokument-Symbole mit
grünem Haken oder rotem Kreuz) und liefert ein Ergebnis zurück; der
Orchestrator führt alles in `milestones.md` zusammen.
**Text darunter (Schritt 2):** `4 agents in parallel · every source opened · 8 errors in last year's list found`
**Punch:** `agents can delegate — and check each other.`
**Dazu sagen.** Die Faktenbasis, die der Agent heute bekommen hat, haben
gestern Abend ebenfalls Agenten geprüft: Einer hat die Arbeit aufgeteilt,
vier Subagenten haben gleichzeitig recherchiert, jede Quelle geöffnet und
gemeldet, was sie bestätigt — und was nicht. Dabei kamen acht Fehler aus der
Liste des letzten Jahres heraus, etwa „Sharkey“ statt Shakey. Arbeitsteilung,
Parallelität und gegenseitige Kontrolle sind ein eigenes Thema im Semester.

### Folie 21 🪜
**Titel klein:** `what the agents did today — and what we'll unpack`
**Text (in Schritten, je eine Zeile):**
`read a photo of handwriting` → `representation`
`wrote a plan, code and text` → `how LLMs work · training`
`used tools: files, browser, git, web` → `rules vs. learning · tool use`
`checked facts against sources` → `trust and verification`
`split the work among sub-agents` → `multi-agent systems`
`published to the web on its own` → `autonomy, safety, responsibility`
**Dazu sagen.** Die Liste von heute ist das Programm des Semesters. Jede
Zeile ist ein Termin.

### Folie 22 🧪
**Titel klein:** `your homework`
**Text:**
`pick one milestone in the app`
`open its source — does it say what the app says?`
`bring your finding next week`
**Dazu sagen.** Die erste Übung des Semesters: einem KI-Ergebnis nicht einfach
glauben. Befunde bringen wir nächste Woche ein — der Agent bessert nach.

### Folie 23 💬
**Titel klein:** `next week`
**Text:** `how this course works — and your first experiment on your own laptop.`

### Folie 24 📷
**Bild:** Derselbe Gang wie auf Folie 1, jetzt vom Ende aus gesehen: Die
letzte Tafel ist leer und leuchtet.
**Text:** `the next milestone is still blank.`
**Dazu sagen.** Schluss. Die Geschichte wird gerade weitergeschrieben — und in
diesem Semester schauen wir, wie.

---

## Offene Fragen an Nicolas

1. **Eröffnungsbild:** Gang mit leuchtenden Jahrestafeln (Folie 1 und 22,
   Anfang und Ende) — einverstanden, oder ein anderes Motiv?
2. **Design:** Werte aus dem Praxisprojekt (Schwarz, Hochschulblau), nur auf
   Englisch — passt das?
3. **Prompt auf Folie 8:** so, oder willst du ihn live frei formulieren (dann
   zeigt die Folie nur die Stichpunkte)?
