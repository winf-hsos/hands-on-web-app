---
type: lesson
code: 2239
title: Warum Text für KI besser ist
summary: >-
  Ein Plädoyer dafür, einen Bericht in Quarto, Typst oder LaTeX zu schreiben
  statt in Word: was ein Sprachmodell in einer Datei sieht, warum eine
  Änderung in Text lesbar bleibt, wie die drei Formate aussehen und was das
  für einen Bericht in Quarto bedeutet, und warum Werkzeuge mit Kommandozeile
  zu einem KI-Agenten passen.
objectives:
  intro: "In dieser Lektion lernst du, warum ein Bericht als Text für die Arbeit mit KI besser geeignet ist, und kannst danach:"
  goals:
    - "erklären, warum ein Sprachmodell eine Textdatei direkt lesen kann, eine Word-Datei aber erst entpacken muss"
    - "eine Änderung als Diff lesen und sagen, warum das bei Text geht und bei Word nicht"
    - "Überschrift, Fettdruck, Formel und Zitat in Quarto, Typst und LaTeX erkennen"
    - "beschreiben, wie aus einer Textquelle eine PDF-, HTML- oder Word-Datei wird"
    - "begründen, warum eine Zahl aus Code im Text weder dir noch einer KI falsch hineinrutschen kann"
    - "erklären, warum ein Werkzeug mit Kommandozeile zu einem KI-Agenten passt, und Beispiele über das Schreiben hinaus nennen"
level: 1
duration: 20
topics: [reproducible-work, communicating-results]
modules: [pmg]
areas: [ds]
relations:
  see_also: [quarto-first-steps, quarto-paper-exercise, ai-agents-in-research]
status: draft
updated: 2026-11-17
---

![Folien: Warum Text für KI besser ist](item:text-for-ai-slides)

Dieselben Worte kannst du auf zwei Arten übergeben. In einem offenen Heft
liest jede und jeder alle Zeilen auf einmal, zeigt auf einen Satz und ändert
ihn mit dem Bleistift. Ein rundum zugeklebtes Paket enthält denselben Text,
aber bevor jemand ein Wort lesen oder ändern kann, muss es ausgepackt und
danach wieder so verpackt werden, dass nichts verloren geht. Für ein
Sprachmodell ist eine Word-Datei das Paket und eine Textdatei das Heft.
Diese Lektion zeigt, warum das für die Arbeit mit KI den Unterschied macht.

## Word und die Alternative

Word ist vertraut, es hat Kommentare und Änderungsverfolgung, die viele
Betreuende nutzen, und für viele Texte genügt es. Dagegen spricht, dass Text
und Layout in einer Datei stecken, dass Zahlen aus einer Analyse von Hand
übertragen werden und veralten, sobald sich die Daten ändern, und dass
Formeln mühsam sind. Für diese Lektion zählt vor allem ein Punkt: Eine
.docx-Datei ist kein Text, sondern ein gepacktes Bündel von Dateien.

Quarto, Typst und LaTeX arbeiten dagegen mit reinen Textdateien:

- Die Quelle ist reiner Text, den jedes Programm und jedes Modell lesen kann.
- Inhalt und Layout sind getrennt, das Layout legt eine Vorlage fest.
- Zahlen, Tabellen und Abbildungen entstehen aus Code.
- Zitate kommen aus einer .bib-Datei, in jedem gewünschten Stil.
- Aus einer Quelle entstehen PDF, HTML oder Word.

Das gilt seit Jahren; neu ist, dass ein Sprachmodell direkt mit solchen
Dateien arbeiten kann. In einem Editor wie Positron können du und ein
KI-Agent gleichzeitig in derselben .qmd-Datei schreiben, beide nur am
Inhalt, und das Layout kommt erst hinzu, wenn Quarto die Datei setzt.

## Was ein Sprachmodell sieht

Ein Sprachmodell nimmt Text und gibt Text zurück, sonst nichts. Ein Bild,
eine Tabelle oder eine Word-Datei muss erst ein Programm rund um das Modell
in Text umwandeln, während eine Textdatei so gelesen wird, wie sie ist.
Hängst du eine .qmd-Datei an einen Prompt, liest das Modell sie sofort.
Hängst du eine .docx an, muss ein Agent erst ein kleines Python-Skript
schreiben und ausführen, das die Datei entpackt, etwa mit dem Paket
python-docx, bevor er einen einzigen Satz lesen kann; Chat-Werkzeuge machen
dasselbe im Hintergrund mit einem Konverter, und was dabei verloren geht,
etwa Kommentare oder nachverfolgte Änderungen, sieht das Modell nie.

Wie groß der Unterschied ist, zeigt ein einziger Satz. In einer Quarto-Datei
steht er in einer Zeile mit 62 Bytes, die beiden Sternchen setzen das Wort
fett:

```markdown
Women name a **higher** price than men.
```

Mit Quarto 1.10 als Word-Datei ausgegeben, wird daraus ein Zip-Archiv aus 16
Dateien mit gut zehn Kilobyte. Der Satz selbst steht in `word/document.xml`,
zerlegt in Stücke, weil jeder Wechsel der Formatierung ein neues Stück
beginnt: „Women name a“, „higher“ und „price than men.“ stehen alle da, aber
verstreut zwischen Tags. Um dort ein Wort zu ändern, muss ein Programm das Archiv entpacken,
das richtige Stück im XML finden, es ändern, ohne die Struktur zu zerstören,
und alles wieder packen. Eine Datei, die Word selbst speichert, ist noch
größer. Eine Textdatei liest und ändert das Modell dagegen Zeile für Zeile.

## Eine Änderung, die du lesen kannst

Ändert eine KI eine Textdatei, lässt sich die Änderung als **Diff** zeigen:
die alte Zeile mit Minus, die neuen Zeilen mit Plus.

```diff
- Women name a higher price than men.
+ Women name a higher price than men
+ (median 2.00 € vs. 1.89 €).
```

Ein KI-Agent zeigt dir genau das, bevor er in deine Datei schreibt, und du
nimmst die Änderung an oder lehnst sie ab. In einer Word-Datei geschieht
dieselbe Änderung im gepackten XML, und du siehst das Ergebnis, nicht die
Änderung. Mit denselben Diffs arbeitet auch die Versionsverwaltung: Git hält
jede Änderung an einer Textdatei als Version fest, die du vergleichen und
zurückholen kannst, während es bei einer .docx nur weiß, dass sich die Datei
geändert hat.

## Drei Textformate

Überschrift, Fettdruck, Formel und Zitat sehen in den drei Formaten so aus:

| | Quarto (`.qmd`) | Typst (`.typ`) | LaTeX (`.tex`) |
|---|---|---|---|
| Überschrift | `# Results` | `= Results` | `\section{Results}` |
| Fettdruck | `the **median** price` | `the *median* price` | `the \textbf{median} price` |
| Formel | `$\tilde{x} = 2.00$` | `$tilde(x) = 2.00$` | `$\tilde{x} = 2.00$` |
| Zitat | `[@doering2023]` | `@doering2023` | `\cite{doering2023}` |

Quarto nutzt Markdown, die leichteste Schreibweise. Typst ist ein neueres
Satzsystem mit eigener kurzer Schreibweise und sehr schneller Ausgabe. LaTeX
ist seit Jahrzehnten der Standard in Mathematik und Physik und die
ausführlichste der drei. Alle drei halten Formeln als Text und holen Zitate
aus einer .bib-Datei.

Aus dem Text setzt ein Programm die Datei, die du abgibst. Quarto liest
Markdown mit Code, führt den Code aus und erzeugt eine Webseite, eine
Word-Datei oder ein PDF; für das PDF reicht es den Text an Typst oder LaTeX
weiter. Typst und LaTeX setzen PDF direkt. In Text zu schreiben heißt also
nicht, auf Word zu verzichten: Will deine Betreuung eine .docx zum
Kommentieren, erzeugt Quarto sie aus derselben Quelle.

## Dein Bericht als Text

In Quarto kann eine Zahl im Text direkt aus R kommen. Ein Chunk berechnet
den Median und formatiert ihn mit zwei Nachkommastellen, und ein
Inline-Ausdruck schreibt ihn in den Satz:

````markdown
```{r}
med_w <- sprintf("%.2f", median(women$price))
```

Women name a median of `{r} med_w` €.
````

Daraus macht Quarto „Women name a median of 2.00 €.“, und ändern sich die
Daten, ändert sich die Zahl mit. Für die Arbeit mit KI zählt das doppelt:
Eine KI, die deinen Text bearbeitet, kann die Zahl weder erfinden noch
vertippen, weil sie nicht im Text steht, sondern im Code, und wenn du den
Code prüfst, prüfst du die Zahl.

Ein Paper in Quarto kann ein kleiner Ordner sein, wie die Vorlage im
Kursordner:

```
paper/
  paper.qmd
  references.bib
  sections/
    _introduction.qmd
    _methods.qmd
    _results.qmd
    _discussion.qmd
```

Die zentrale Datei `paper.qmd` hält die Einstellungen und holt die
Abschnitte mit `{{< include sections/_introduction.qmd >}}` herein, die
Literatur liegt in `references.bib`. Quarto führt den Code aus, und Typst
setzt das PDF. Jede Datei ist Text, also kann ein Agent den ganzen Bericht
lesen, einen Abschnitt mit einem anderen abgleichen und eine einzelne Zeile
ändern, und du siehst jede Änderung, bevor sie geschieht.

## Die KI dort abholen, wo sie arbeitet

Ein KI-Agent arbeitet im Terminal: Er tippt einen Befehl, liest, was
zurückkommt, und entscheidet über den nächsten Schritt. Ein Werkzeug, das
eine Kommandozeile mitbringt, kann eine KI deshalb genauso bedienen wie du,
und Quarto, Typst und LaTeX bringen jeweils eine mit:

```bash
quarto render paper.qmd --to pdf
typst compile paper.typ
latexmk -pdf paper.tex
```

Ein Agent kann dein Paper also selbst setzen, die Fehlermeldungen lesen und
die Quelle korrigieren. Word hat Menüs und Knöpfe, aber keinen Befehl, der
ein Dokument setzt oder ändert; es gibt Umwege wie Pandoc oder Skripte, die
Word fernsteuern, doch Word selbst ist für einen Menschen mit Maus gebaut.

Immer mehr Werkzeuge folgen derselben Idee, halten ihre Dateien als Text und
bringen eine Kommandozeile mit:

- [Excalidraw](https://github.com/excalidraw/cli) speichert jede Zeichnung
  als JSON-Text, und seine offizielle Kommandozeile, gemacht „for humans and
  agents“, rendert Zeichnungen und macht aus Mermaid-Text bearbeitbare
  Zeichnungen.
- [Mermaid](https://mermaid.js.org) schreibt ein Diagramm als Text, und
  GitHub, Quarto und Excalidraw zeichnen es.
- [FFmpeg](https://ffmpeg.org) schneidet, wandelt und verbindet Videos und
  Audio mit einem einzigen Befehl, ohne Schnittprogramm.
- Eine .csv-Datei ist eine Tabelle als reiner Text, während eine .xlsx-Datei
  ein gepacktes Bündel ist wie eine .docx.
- Eine .svg-Datei ist eine Vektorgrafik als Text, die eine KI Zeile für
  Zeile schreiben und ändern kann.
- Die Folien dieser Lektion sind eine HTML-Datei und ein Skript, also kann
  eine KI sie bauen und ändern wie ein Paper in Quarto.

Auch eine Zeichnung ist Text. Hier eine kleine Zeichnung, ein Kasten
„paper.qmd“ mit einem Pfeil zu einem Kasten „paper.pdf“, als
Excalidraw-Datei, gekürzt, weil echte Dateien jedem Element noch Farben,
einen Startwert für den handgezeichneten Strich und eine Version mitgeben:

```json
{
  "type": "excalidraw",
  "elements": [
    { "id": "box-1", "type": "rectangle",
      "x": 0, "y": 0, "width": 240, "height": 100 },
    { "type": "text", "text": "paper.qmd", "containerId": "box-1" },
    { "type": "arrow", "x": 240, "y": 50, "points": [[0, 0], [160, 0]] }
  ]
}
```

Und dieselbe Zeichnung als SVG, ohne die Definition der Pfeilspitze:

```xml
<svg viewBox="0 0 640 100">
  <rect x="0" y="0" width="240" height="100"/>
  <text x="120" y="58">paper.qmd</text>
  <line x1="240" y1="50" x2="400" y2="50" marker-end="url(#arrow)"/>
  <rect x="400" y="0" width="240" height="100"/>
  <text x="520" y="58">paper.pdf</text>
</svg>
```

Ein Agent kann also ein Diagramm zeichnen, indem er diese Zeilen schreibt,
und du kannst lesen und ändern, was er gezeichnet hat.

## Zum Mitnehmen

- Ein Sprachmodell liest und schreibt Text; eine Textdatei braucht keinen
  Zwischenschritt, eine Word-Datei schon.
- In einer Textdatei ist jede Änderung einer KI eine Zeile, die du lesen
  kannst, bevor du sie annimmst.
- Quarto, Typst und LaTeX unterscheiden sich in der Schreibweise, teilen
  aber die Idee: Text als Quelle, Layout aus einer Vorlage.
- Aus einer Quelle in Quarto entstehen PDF, HTML und, wenn nötig, Word.
- Eine Zahl, die aus Code kommt, kann weder dir noch einer KI falsch in den
  Text rutschen.
- Ein KI-Agent arbeitet im Terminal, deshalb passen Werkzeuge mit
  Textdateien und Kommandozeile zu ihm, Word dagegen nicht.
