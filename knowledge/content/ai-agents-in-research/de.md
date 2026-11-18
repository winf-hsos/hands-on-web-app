---
type: lesson
code: 6979
title: Was ist ein KI-Agent?
summary: >-
  Was einen KI-Agenten vom Chatbot unterscheidet, woraus er besteht, wie er
  Schritt für Schritt eine Rückmeldung zur Einleitung eines Papers in Quarto
  gibt und vor jeder Änderung fragt, wie lange die Aufgaben sind, die Agenten
  heute schaffen, und welche Risiken die Arbeit mit ihm hat und was jeweils
  dagegen hilft.
objectives:
  intro: "In dieser Lektion lernst du, was einen KI-Agenten ausmacht und wie du mit ihm an einem Paper arbeitest, und kannst danach:"
  goals:
    - "den Unterschied zwischen Chatbot und Agent mit der Arbeitsdefinition erklären, nach der ein Agent Werkzeuge in einer Schleife ausführt, um ein Ziel zu erreichen"
    - "die Teile eines Agenten benennen und sagen, was der Harness rund um das Sprachmodell übernimmt"
    - "das Protokoll eines Agentenlaufs lesen und erkennen, wann er nur liest und wann er etwas ändern will"
    - "mit dem Zeithorizont von METR einschätzen, wie lange die Aufgaben sind, die Agenten heute schaffen, und wie oft sie dabei scheitern"
    - "die Risiken der Arbeit mit einem Agenten benennen und zu jedem eine Gegenmaßnahme anwenden"
level: 1
duration: 25
topics: [ai-agents-as-tools]
modules: [pmg]
areas: [ds]
relations:
  see_also: [opencode-course-assistant, ai-research-support, text-for-ai]
status: draft
updated: 2026-11-18
---

![Folien: Was ist ein KI-Agent?](item:ai-agents-in-research-slides)

Ein Chatbot gleicht einem Berater am Telefon: Er sagt dir, welcher Schritt
als Nächstes kommt, und ausführen musst du ihn selbst. Ein Agent gleicht jemandem, dem du die
Schlüssel zu deinem Büro gibst: Er öffnet die Dateien selbst, liest sie,
ändert sie und startet Programme. Deshalb kann er so viel mehr, und deshalb
kommt es darauf an, was du ihn machen lässt. Diese Lektion erklärt, wie ein
Agent aufgebaut ist und wie er an einem Paper in Quarto arbeitet, etwa mit
dem Kursassistenten [[opencode-course-assistant]].

## Chatbot oder Agent

Bei einem Chatbot schreibst du einen Prompt, das Modell schreibt eine
Antwort, und der nächste Schritt liegt bei dir: Du kopierst den R-Code in
dein Skript, führst ihn aus und fügst die Fehlermeldung wieder ein. Bei einem
Agenten gibst du ein Ziel vor, und das Modell ruft selbst Werkzeuge auf,
sieht sich die Ergebnisse an und macht weiter, bis das Ziel erreicht ist: Es
liest dein Skript, führt es aus, sieht den Fehler und behebt ihn. Im Inneren
kann es dasselbe Sprachmodell sein, der Unterschied liegt in dem, was um das
Modell herum gebaut ist.

Simon Willison (2025) hat dafür eine knappe Arbeitsdefinition vorgeschlagen:

> An AI agent runs tools in a loop to achieve a goal.

Drei Begriffe tragen sie. Mit **Werkzeugen** kann der Agent Dateien lesen
und schreiben, Programme ausführen und im Netz suchen. Die **Schleife**
bedeutet, dass er sich ansieht, was ein Werkzeug zurückgegeben hat, und den
nächsten Schritt selbst wählt. Das **Ziel** beschreibt, was du willst, nicht
den Weg dorthin. Anthropic (2024) beschreibt Agenten fast gleich: als
Sprachmodelle, die Werkzeuge anhand der Rückmeldung ihrer Umgebung in einer
Schleife einsetzen.

## Woraus ein Agent besteht

Am Anfang stehen ein **Ziel**, etwa „give us feedback on the introduction of
our paper“, und ein **Sprachmodell**, das für sich allein nur Text erzeugen
kann und keine Datei öffnet. Dazu kommen:

| Teil | Was er beiträgt |
|---|---|
| Werkzeuge | `read`, `edit`, `write`, `bash` für Programme wie R oder Quarto, `web search`; das Modell schreibt nur auf, welches Werkzeug es mit welchen Argumenten aufrufen will, ausgeführt wird der Aufruf vom Programm rund um das Modell |
| Schleife | jedes Ergebnis geht zurück an das Modell, das wieder denkt, handelt und beobachtet (in der Forschung heißt das Muster ReAct) |
| Kontextfenster | alles, was der Agent während eines Laufs weiß: das Ziel, jede gelesene Datei, jedes Ergebnis; es füllt sich mit jeder Datei, und ist es voll, muss der Agent zusammenfassen oder vergessen |
| Plan | eine Liste, die der Agent selbst schreibt und abhakt, ein Werkzeug wie jedes andere |
| Anweisungen | Textdateien, die zu Beginn geladen werden: `AGENTS.md` sagt, was der Agent über das Projekt wissen soll, Skills beschreiben, wie du bestimmte Dinge erledigt haben willst, und werden erst geladen, wenn eine Aufgabe sie braucht, Befehle sind vorbereitete Anweisungen für das, was du oft brauchst, etwa eine Rückmeldung zu einem Paper |

Was ein Sprachmodell zum Agenten macht, ist die Schleife.

Alles rund um das Modell heißt **Harness**, wie das Geschirr, mit dem ein
Pferd vor den Wagen gespannt wird: Das Modell liefert die Kraft, das Geschirr
lenkt sie. Der Harness führt die Schleife aus, setzt die Werkzeugaufrufe um,
verwaltet das Kontextfenster, lädt `AGENTS.md`, Skills und Befehle und fragt
dich um Erlaubnis. OpenCode, Claude Code und Codex sind solche Harnesses, und
bei vielen kannst du das Modell wählen. Ein KI-Agent ist also ein
Sprachmodell plus Harness.

## Ein Agent bei der Arbeit

So sieht ein Lauf im Protokoll aus, wenn ihr einen Agenten um Rückmeldung
zur Einleitung bittet:

| Schritt | Was passiert |
|---|---|
| ihr | give us feedback on the structure of our introduction |
| `read` | `paper/paper.qmd` |
| `read` | `paper/sections/_introduction.qmd` |
| Antwort | the research question stands in the second paragraph; move it to the end of the introduction. |
| ihr | please move it |
| `edit` | `paper/sections/_introduction.qmd` – allow once · allow always · reject |

Der Agent liest zuerst die zentrale Datei des Papers, stellt fest, dass die
Abschnitte in eigenen Dateien liegen, und liest die Einleitung. Dann
antwortet er, und bis hierhin hat sich an euren Dateien nichts geändert. Erst
als ihr ihn bittet, die Frage zu verschieben, will er die Datei bearbeiten,
und der Harness hält an und fragt: einmal erlauben, immer erlauben oder
ablehnen. Bevor du erlaubst, siehst du die Änderung als Diff, Zeile für
Zeile.

Was der Agent ohne Nachfrage darf, steht in den Einstellungen des Harness,
bei OpenCode in `opencode.json`:

```json
"permission": {
  "edit": "ask",
  "bash": "ask"
}
```

Mit diesen Zeilen darf er deine Dateien frei lesen, muss aber fragen, bevor
er eine Datei ändert oder einen Befehl in der Shell ausführt. Du kannst das
lockern, etwa R immer erlauben, aber der sicherste Anfang ist, ihn fragen zu
lassen und zu lesen, was er vorhat, bevor du zustimmst.

## Wie weit Agenten kommen

**Wie lang die Aufgaben sind, die Agenten schaffen.** METR misst den
Zeithorizont von Agenten: die Länge einer Aufgabe, gemessen an der Zeit, die
eine Fachperson dafür braucht, bei der ein Agent sie in der Hälfte der Fälle
löst, und die kürzere Länge, bei der er vier von fünf Aufgaben löst (METR,
2026).

| Modell | erschienen | löst die Hälfte | löst vier von fünf |
|---|---|---|---|
| GPT-4 | März 2023 | 4 min | 1 min |
| Claude 3.7 Sonnet | Februar 2025 | 1 h | 12 min |
| GPT-5 | August 2025 | 3,4 h | 38 min |
| Claude Opus 4.6 | Februar 2026 | 12 h | 70 min |
| Claude Mythos Preview | April 2026 | 17 h | 3,1 h |

Seit 2023 hat sich der Zeithorizont etwa alle vier Monate verdoppelt. Die
Aufgaben stammen aus Softwareentwicklung, maschinellem Lernen und
IT-Sicherheit, sind klar beschrieben und werden automatisch bewertet, und
Werte über 16 Stunden hält METR mit seinen derzeitigen Aufgaben selbst für
unzuverlässig. Für dein Paper heißt das: Ein Agent schafft lange Arbeitsstrecken
allein, scheitert aber an einem guten Teil davon, und was er liefert, ist ein
Entwurf, den du prüfst.

**Was schiefgehen kann und was hilft.**

| Risiko | Was hilft |
|---|---|
| Er löscht oder überschreibt Dateien. | Arbeite in einem Git-Repository oder auf einer Kopie. |
| Er führt einen schädlichen Befehl aus. | Lass dich jeden Befehl bestätigen, den er ausführt. |
| Er folgt Anweisungen, die in einer Webseite oder Datei versteckt sind (indirekte Prompt-Injection, Greshake et al., 2023); einen vollständigen Schutz dagegen gibt es bisher nicht. | Lies, was er vorhat, bevor du es erlaubst. |
| Sein Code läuft, berechnet aber das Falsche. | Prüf eine Zahl von Hand. |
| Er nennt Quellen, die es nicht gibt. | Öffne jede Quelle, die du zitierst. |
| Persönliche Daten verlassen deinen Rechner, denn was er liest, geht an den Anbieter des Modells. | Halte persönliche Daten aus dem Ordner heraus. |
| Er bleibt bei einfachen Analysen stehen (Gu et al., 2024). | Entscheide selbst über Variablen und Methode. |
| Du kennst dein eigenes Paper nicht mehr. | Lies jede Änderung, bevor du sie annimmst. |

Meldet ein Agent „ich habe die Analyse repariert, alles läuft“, liest du
deshalb die Änderung und führst den Code selbst aus, denn dass Code läuft,
sagt nichts darüber, ob er das Richtige berechnet. Was ein Agent in deinem
Ordner ausführt, geschieht in deinem Auftrag, und das Paper bleibt deins.

## Zum Mitnehmen

- Ein Agent führt Werkzeuge in einer Schleife aus, bis ein Ziel erreicht
  ist; ein Chatbot antwortet nur, und den nächsten Schritt machst du.
- Ein Agent ist ein Sprachmodell plus Harness, und der Harness entscheidet,
  was der Agent ohne Nachfrage darf.
- Lesen darf er frei, Ändern und Ausführen sollten auf dein Ja warten.
- Agenten schaffen inzwischen Aufgaben, für die eine Fachperson viele Stunden
  braucht, aber nur in der Hälfte der Fälle, deshalb prüfst du, was sie
  liefern.
- Zu jedem Risiko gibt es eine Gegenmaßnahme, und die wichtigste ist, jede
  Änderung zu lesen, bevor du sie annimmst.

## Quellen

- Anthropic (2024). [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents).
- Greshake, K. et al. (2023). *Not what you've signed up for: Compromising
  real-world LLM-integrated applications with indirect prompt injection.*
  [arXiv:2302.12173](https://arxiv.org/abs/2302.12173)
- Gu, K. et al. (2024). BLADE: Benchmarking language model agents for
  data-driven science. *Findings of EMNLP 2024.*
  [arXiv:2408.09667](https://arxiv.org/abs/2408.09667)
- METR (2026). [Task-completion time horizons of frontier AI models](https://metr.org/time-horizons/), Time Horizon 1.1, Stand 8. September 2026; Werte aus den [Rohdaten](https://metr.org/assets/benchmark_results_1_1.yaml).
- Willison, S. (2025). [I think “agent” may finally have a widely enough agreed upon definition to be useful jargon now](https://simonwillison.net/2025/Sep/18/agents/).
