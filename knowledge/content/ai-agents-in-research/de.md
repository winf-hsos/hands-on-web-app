---
type: lesson
code: 6979
title: Was ist ein KI-Agent?
summary: >-
  Was einen KI-Agenten vom Chatbot unterscheidet, woraus er besteht, wie er
  Schritt für Schritt eine Rückmeldung zur Einleitung eines Papers in Quarto
  gibt und vor jeder Änderung fragt, was Studien über Nutzen und Risiken
  gefunden haben und welche Regeln für die Arbeit mit ihm gelten.
objectives:
  intro: "In dieser Lektion lernst du, was einen KI-Agenten ausmacht und wie du mit ihm an einem Paper arbeitest, und kannst danach:"
  goals:
    - "den Unterschied zwischen Chatbot und Agent mit der Arbeitsdefinition erklären, nach der ein Agent Werkzeuge in einer Schleife ausführt, um ein Ziel zu erreichen"
    - "die Teile eines Agenten benennen und sagen, was der Harness rund um das Sprachmodell übernimmt"
    - "das Protokoll eines Agentenlaufs lesen und erkennen, wann er nur liest und wann er etwas ändern will"
    - "mit drei Studien begründen, warum du einen Agenten an dem misst, was er liefert, und Analyseentscheidungen selbst triffst"
    - "fünf Regeln für die Arbeit mit einem Agenten an einem Paper anwenden"
level: 1
duration: 25
topics: [ai-agents-as-tools]
modules: [pmg]
areas: [ds]
relations:
  see_also: [opencode-course-assistant, ai-research-support, text-for-ai]
status: draft
updated: 2026-11-17
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
| Anweisungen | Textdateien, die zu Beginn geladen werden: `AGENTS.md` sagt, was der Agent über das Projekt wissen soll, Befehle sind vorbereitete Anweisungen für wiederkehrende Aufgaben, etwa wie er eine Rückmeldung zu einem Paper gibt |

Was ein Sprachmodell zum Agenten macht, ist die Schleife.

Alles rund um das Modell heißt **Harness**, wie das Geschirr, mit dem ein
Pferd vor den Wagen gespannt wird: Das Modell liefert die Kraft, das Geschirr
lenkt sie. Der Harness führt die Schleife aus, setzt die Werkzeugaufrufe um,
verwaltet das Kontextfenster, lädt Plan, `AGENTS.md` und Befehle und fragt
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

## Was Studien gefunden haben

**Gefühlt schneller, gemessen langsamer.** In einer randomisierten Studie von
METR arbeiteten 16 erfahrene Softwareentwicklerinnen und -entwickler an 246
echten Aufgaben in ihren eigenen Projekten, jede Aufgabe per Zufall mit oder
ohne KI-Werkzeuge vom Stand Anfang 2025 (Becker et al., 2025). Vorher
erwarteten sie, mit KI 24 % schneller zu sein, hinterher glaubten sie, 20 %
schneller gewesen zu sein, gemessen brauchten sie 19 % länger. Die Werkzeuge
sind seitdem besser geworden, und im Februar 2026 schrieb METR, neuere Daten
deuteten auf einen Zeitgewinn hin, ließen sich mit diesem Studiendesign aber
nicht mehr verlässlich messen (METR, 2026). Was bleibt, ist die Lücke
zwischen Gefühl und Messung: Miss einen Agenten an dem, was er liefert.

**Agenten bleiben bei einfachen Analysen.** Der Benchmark BLADE (Gu et al.,
2024) gibt Modellen und Agenten 12 Datensätze mit Fragen aus
veröffentlichten Studien und vergleicht ihre Analyseentscheidungen mit denen
von Fachleuten: welche Variablen, wie sie umgeformt werden, welches Modell.
Die Modelle wählten meist einfache Analysen; Agenten, die mit den Daten
arbeiten konnten, schnitten besser ab, trafen aber immer noch weniger und
weniger vielfältige Entscheidungen als die Fachleute. Lass einen Agenten
also den Code schreiben und ausführen, aber entscheide selbst, welche
Variablen, welche Gruppen und welche Methode.

**Anweisungen, versteckt im Gelesenen.** Ein Sprachmodell kann deine
Anweisungen nicht zuverlässig von Text unterscheiden, den es unterwegs
liest. Greshake et al. (2023) haben gezeigt, dass eine Webseite oder ein
Dokument versteckte Anweisungen enthalten kann, die einen Assistenten etwas
anderes ausführen lassen, etwa Daten weiterzuschicken. Das heißt indirekte
Prompt-Injection, und einen vollständigen Schutz dagegen gibt es bisher
nicht. Ein Grund mehr, die Berechtigungen streng zu halten und zu lesen, was
ein Agent vorhat, bevor du es erlaubst.

Meldet ein Agent „ich habe die Analyse repariert, alles läuft“, liest du
deshalb die Änderung und führst den Code selbst aus. Dass Code läuft, sagt
nichts darüber, ob er das Richtige berechnet, und auf die Frage, ob er sicher
sei, bekommst du nur eine weitere überzeugte Antwort.

## Fünf Regeln

1. Gib dem Agenten ein Ziel und den Kontext, den er braucht: worum es im
   Paper geht, welche Datei, was du zurückhaben willst.
2. Lass ihn fragen, bevor er eine Datei ändert oder ein Programm ausführt.
3. Lies jede Änderung, bevor du sie annimmst.
4. Führ den Code selbst aus und prüf eine Zahl von Hand.
5. Halte persönliche Daten heraus, und steh selbst für das Ergebnis ein.

Was ein Agent in deinem Ordner ausführt, geschieht in deinem Auftrag: Namen,
Freitextantworten mit persönlichen Angaben und Dateien, die du nicht teilen
darfst, bleiben draußen, und das Paper bleibt deins.

## Zum Mitnehmen

- Ein Agent führt Werkzeuge in einer Schleife aus, bis ein Ziel erreicht
  ist; ein Chatbot antwortet nur, und den nächsten Schritt machst du.
- Ein Agent ist ein Sprachmodell plus Harness, und der Harness entscheidet,
  was der Agent ohne Nachfrage darf.
- Lesen darf er frei, Ändern und Ausführen sollten auf dein Ja warten.
- Gefühlt schneller ist nicht dasselbe wie schneller; welche Analyse gerechnet
  wird, entscheidest du.
- Was ein Agent liest, kann ihn steuern, deshalb liest du, was er vorhat.

## Quellen

- Anthropic (2024). [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents).
- Becker, J. et al. (2025). *Measuring the impact of early-2025 AI on
  experienced open-source developer productivity.* METR.
  [arXiv:2507.09089](https://arxiv.org/abs/2507.09089)
- Greshake, K. et al. (2023). *Not what you've signed up for: Compromising
  real-world LLM-integrated applications with indirect prompt injection.*
  [arXiv:2302.12173](https://arxiv.org/abs/2302.12173)
- Gu, K. et al. (2024). BLADE: Benchmarking language model agents for
  data-driven science. *Findings of EMNLP 2024.*
  [arXiv:2408.09667](https://arxiv.org/abs/2408.09667)
- METR (2026). [Update zur Produktivitätsstudie vom 24. Februar 2026](https://metr.org/blog/2026-02-24-uplift-update/).
- Willison, S. (2025). [I think “agent” may finally have a widely enough agreed upon definition to be useful jargon now](https://simonwillison.net/2025/Sep/18/agents/).
