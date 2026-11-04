# Entwurf: Input „Open Models“

**Status:** Entwurf vom 07.10.2026, von Nicolas am selben Tag freigegeben und
gebaut (`open-models.html`). Die drei offenen Fragen nach meinen Vorschlägen
entschieden: Kundenliste eines Betriebs, „not published“, Notizblatt ja.
**Verortung:** Sitzungsdeck zum Experiment `experiments\open-models\` („An AI
on Your Laptop“, Katalog B5) und zur Konzeptseite „Open Models“, für
Applications of AI und Problem Solving with AI. Es führt durch die 30 Minuten
des Experiments und die Einordnung danach; auf der Webseite eingebettet. Ohne
Termine und ohne Verweise auf „nächste Woche“ (Regel vom 07.10.2026).
**Kernbotschaft:** *A language model is a file full of numbers that runs on
your own laptop without the internet; its size decides how good, how fast and
how hungry it is.*
**Publikum:** Master Agrar und Lebensmittel; haben Agenten gespielt und
gesehen, Modelle bisher nur in der Cloud benutzt.
**Dauer:** rund 70 Minuten mit Experiment und Gespräch; 22 Folien, davon vier
Live-Abfragen.
**Vorbereitung der Studierenden:** LM Studio installiert, darin Gemma 3 1B
(`google/gemma-3-1b`, 0,75 GB) und Gemma 3 4B (`google/gemma-3-4b`, 2,4 GB)
geladen, Laptop geladen (Nicolas, 07.10.2026; Größen laut lmstudio.ai am
07.10.2026).
**Sprache:** Englisch, `style.toml` des Bereichs (Pink). Notizen deutsch.
**Titelfolie ohne Datum.**

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Vergleich |
| 💬 | Merksatz |
| ⌨️ | Code / Eingabe |
| 🪜 | Aufbau in Schritten |
| 🧪 | Live-Moment |
| 🗳️ | Live-Abfrage |

# Die Folien

## Teil 0: Titel und Eröffnung (3 Folien)

### Folie 1
**Titel:** `open models` · **Untertitel:** `artificial intelligence · prof. dr. nicolas meseth`

### Folie 2
Agenda aus `data-parts`: what do you think? · offline · what a model is · open or closed

### Folie 3 📷
**Bild:** Ein aufgeklappter Laptop auf einem dunklen Holztisch, auf dem
Bildschirm ein Chatfenster mit einer langen Antwort; daneben liegt ein
gezogenes Netzwerkkabel, dessen Stecker ins Leere zeigt, und das WLAN-Symbol
in der Ecke des Bildschirms ist durchgestrichen. Schwarzer Hintergrund, warmes
Licht nur auf Gerät und Kabel.
**Text:** `no internet, and it still answers.`
**Dazu sagen.** Bisher lief jedes Modell, das wir benutzt haben, irgendwo in
einem Rechenzentrum. Jetzt holen wir eines auf den eigenen Rechner und sehen
nach, was es eigentlich ist.

## Teil 1: what do you think? (3 Folien)

### Folie 4 🎬
`what do you think?`

### Folie 5 🗳️
**Abfrage (Quiz):** `when you chat with ChatGPT, where does the model run?`
Antworten: `on my phone or laptop` · `in my browser` · `in a data centre` ✓ · `no idea`
**Dazu sagen.** Kurz auflösen; der Unterschied zwischen App und Modell kam
schon bei „where does it run?“ im Deck „AI Agents“ vor.

### Folie 6 🗳️
**Abfrage (Quiz):** `how big is a language model that runs on a laptop?`
Antworten: `a few megabytes` · `one to a few gigabytes` ✓ · `around 100 gigabytes` · `no idea`
**Dazu sagen.** Noch nicht auflösen, nur das Ergebnis stehen lassen; die
Auflösung kommt, wenn alle die Datei auf dem eigenen Rechner gefunden haben.

## Teil 2: offline (6 Folien)

### Folie 7 🎬
`offline`

### Folie 8 🧪
**Titel klein:** `step 1 · switch it off`
**Text (in Schritten):**
`turn off wi-fi.`
`load gemma 3 1b in lm studio.`
`ask it: “what does nitrogen fertiliser do for a wheat plant? two sentences.”`
**Live-Moment:** Alle schalten das WLAN ab, das Modell antwortet trotzdem.
Danach die Hand an das Gehäuse: Der Lüfter läuft an.

### Folie 9 ⌨️ 🪜
**Titel klein:** `step 2 · find the file`
**Text (in Schritten):**
`lm studio → my models → show in folder.`
`how big is the file? what is it called?`
**Dazu sagen.** Jetzt die Abfrage von Folie 6 auflösen: Die Datei hat
0,75 GB, und das ist das ganze Modell. Den Namen ansehen: Größe, Format und
Quantisierung stehen darin (Erklärung in Teil 3).

### Folie 10 🪜
**Titel klein:** `step 3 · three questions, two models`
**Text (in Schritten):** dieselben drei Fragen erst an Gemma 3 1B, dann an
Gemma 3 4B; je Antwort die Tokens pro Sekunde notieren, die LM Studio unter der
Antwort anzeigt.
`a field of 4.5 ha needs 140 kg of nitrogen per ha. how much is that in total?`
`what is the capital of lower saxony, and what is it known for?`
`translate into german: “the harvest was delayed by rain.”`
**Dazu sagen.** Eine Rechnung, eine Wissensfrage, eine Übersetzung. Zu zweit
arbeiten; wer einen schwachen Laptop hat, schaut beim Nachbarn mit.

### Folie 11 🗳️
**Abfrage (Umfrage):** `how many tokens per second did gemma 3 4b reach on your laptop?`
Antworten: `fewer than 5` · `5 to 20` · `20 to 50` · `more than 50`
**Dazu sagen.** Die Streuung zeigt, wie sehr das Erlebnis vom Rechner abhängt.
Wer eine Grafikkarte oder einen Apple-Chip hat, liegt meist weit vorn.

### Folie 12 📊
**Titel klein:** `1b or 4b?`
**Text:** zwei Spalten, `gemma 3 1b` und `gemma 3 4b`, darunter je `size`,
`speed`, `quality` als leere Zeilen, die im Gespräch gefüllt werden (Aufbau
in Schritten: erst die Spalten, dann je Zeile die Einschätzung aus dem Raum).
**Dazu sagen.** Wo war das kleine Modell gut genug, wo hat es Unsinn mit
Überzeugung gesagt? Meist rechnet das kleine falsch und erfindet bei der
Wissensfrage.

## Teil 3: what a model is (6 Folien)

### Folie 13 🎬
`what a model is`

### Folie 14 🖼️ 🪜
**Titel klein:** `a file full of numbers`
**Zeichnung:** links ein Dateisymbol `gemma-3-4b … .gguf · 2.4 GB`; Schritt 1:
ein Pfeil zu einem Raster aus Zahlen (`0.0213  -1.402  0.871 …`); Schritt 2:
darunter `4 billion parameters, also called weights`.
**Dazu sagen.** Ein Modell ist kein Programm mit Regeln und keine Datenbank
mit Texten, sondern eine sehr lange Liste von Zahlen. Wie diese Zahlen
entstehen, ist Thema von „Neural Networks“ und „Training a Large Language
Model“.

### Folie 15 🖼️ 🪜
**Titel klein:** `why 2.4 GB?`
**Zeichnung (Rechnung in Schritten):**
`4 billion numbers × 16 bits = 8 GB`
`4 billion numbers × ~4.5 bits = 2.4 GB`
`fewer bits per number: quantisation`
**Dazu sagen.** Die Zahlen werden gerundet gespeichert, damit das Modell in
den Arbeitsspeicher passt. Das kostet etwas Qualität und spart viel Platz;
im Dateinamen steht, wie stark gerundet wurde (etwa `Q4`).

### Folie 16 🖼️ 🪜
**Titel klein:** `what happens when you press enter`
**Zeichnung:** Datei → Arbeitsspeicher (bzw. Grafikspeicher) → für jedes neue
Token einmal durch alle Zahlen → nächstes Token; Schritt für Schritt
aufgebaut. Unten: `that is why bigger models are slower: more numbers per token.`
**Dazu sagen.** Inferenz heißt: das Modell anwenden, nicht trainieren. Jedes
Token kostet einen Durchgang durch alle Parameter, darum hängen die Tokens pro
Sekunde an Speicher und Rechenleistung.

### Folie 17 📊
**Titel klein:** `how big is big?`
**Vergleich (Balken, logarithmisch):** Gemma 3 1B (1 B) · Gemma 3 4B (4 B) ·
offene große Modelle mit hunderten Milliarden bis über einer Billion
Parameter · geschlossene Spitzenmodelle `not published`.
**Dazu sagen.** Was auf dem Laptop läuft, ist mehrere hundertmal kleiner als
das, was hinter ChatGPT oder Claude steckt. Die Zahlen der geschlossenen
Modelle veröffentlichen die Anbieter nicht.

### Folie 18 💬
**Statement:** `the same harness can talk to a model on your laptop.`
**Fußnote:** `see also: the harness`
**Dazu sagen.** Die Zeichnung „where does it run?“ aus „AI Agents“ in
Erinnerung rufen: Der gestrichelte Kasten „a local LLM“ ist das, was wir eben
gestartet haben. Ein Agent kann statt des Cloud-Modells ein lokales benutzen,
mit allen Folgen für Qualität und Tempo.

## Teil 4: open or closed (4 Folien)

### Folie 19 🎬
`open or closed`

### Folie 20 📊 🪜
**Titel klein:** `open weights, closed weights`
**Zwei Spalten (in Schritten):**
`open: download it, run it, change it` · Beispiele `gemma, qwen, llama, mistral, deepseek, gpt-oss`
`closed: use it as a service` · Beispiele `gpt, claude, gemini`
Darunter klein: `open weights is not the same as open source: the training data usually stays secret.`
**Dazu sagen.** Offen heißt meist nur: die Gewichte sind frei. Wie das Modell
entstand und womit, bleibt oft verborgen; ganz offene Modelle wie Olmo legen
auch die Daten offen.

### Folie 21 🗳️
**Abfrage (Umfrage):** `would you paste a farm's customer list into a cloud chatbot?`
Antworten: `yes` · `only with a contract` · `only into a local model` · `never`
**Dazu sagen.** Kein richtig oder falsch; die Verteilung ist der Einstieg ins
Gespräch über Datenschutz, Verträge und darüber, wann sich ein lokales Modell
lohnt.

### Folie 22 🪜
**Titel klein:** `when local makes sense`
**Text (in Schritten):**
`your data must not leave the building.`
`you need it offline, in a barn or on a tractor.`
`you use it so much that tokens get expensive.`
`and you accept a smaller, slower model in return.`

## Teil 5: Abschluss (2 Folien)

### Folie 23 💬
**Titel klein:** `key takeaway`
**Statement:** `a language model is a file full of numbers that runs on your own laptop without the internet; its size decides how good, how fast and how hungry it is.`

### Folie 24 🪜
**Titel klein:** `discuss`
**Text (in Schritten):**
`what surprised you about the size, speed or quality of the local model?`
`which data would you trust a local model with, but not a cloud service?`
`when should a farm or a food company run its own model instead of renting one?`
**Dazu sagen.** Erst jede und jeder für sich schriftlich, dann in der Gruppe.

# Was dazu auf die Webseite kommt

- **Experiment** `experiments\open-models\open-models.md` („An AI on Your
  Laptop“) nach der Gliederung im Konzept: Key Takeaway, Short description mit
  eingebettetem Deck, Steps (Basic experiment: die drei Schritte und die drei
  Fragen; Extensions: Quantisierungen vergleichen, ein drittes Modell wie
  Qwen3 4B, dieselben Fragen an ein Cloud-Modell mit Tabelle zu Qualität,
  Tempo, Kosten und Datenschutz, Kontextlänge ausprobieren), Discussion,
  Concepts, Material (LM Studio, die zwei Modelle mit Größen, ein Blatt zum
  Notieren der Tokens pro Sekunde und Einschätzungen).
- **Konzeptseite** `website\concepts\open-models.qmd`: Summary, Erklärung
  (Modell als Datei, Parameter und Gewichte, Quantisierung, Inferenz, Größe,
  offen und geschlossen, wann lokal), Slides, Practice questions, Further
  reading.
- **Fragen** im Pool unter `questions\open-models\` (Kürzel `om`), Übungsfragen
  und Klausurvarianten, danach Classroom Live melden.

# Offene Fragen an Nicolas

1. **Abfrage zum Datenschutz (Folie 21):** passt das Beispiel mit der
   Kundenliste eines Betriebs, oder lieber etwas aus dem Studium (eigene
   Abschlussarbeit, Interviewdaten)?
2. **Folie 17:** Die Zahlen großer offener Modelle nehme ich von den
   Modellseiten (etwa DeepSeek V4 Pro mit 1,6 Billionen Parametern laut
   lmstudio.ai); geschlossene stehen als „not published“. Einverstanden?
3. **Ein Blatt zum Notieren** (Typst, wie das Protokollblatt bei „Be the
   Agent“) mit Spalten für Modell, Frage, Tokens pro Sekunde, Einschätzung:
   ja oder nein?
