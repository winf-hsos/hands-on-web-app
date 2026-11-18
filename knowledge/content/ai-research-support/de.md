---
type: lesson
code: 7990
title: KI-Unterstützung in der empirischen Forschung
summary: >-
  Welche Arten von KI es für wissenschaftliches Arbeiten gibt, in welchen vier
  Stufen sich die Arbeit mit ihr entwickelt hat, von der Antwort im Chat bis
  zum Agenten, der alles allein erledigt, was davon nach heutigen Studien
  funktioniert und wie du dokumentierst, wofür du sie eingesetzt hast.
objectives:
  intro: "In dieser Lektion lernst du, wie du KI in einer empirischen Studie sinnvoll einsetzt, und kannst danach:"
  goals:
    - "Chatbots, spezialisierte Werkzeuge und KI-Agenten unterscheiden und zu jeder Art Beispiele nennen"
    - "die neun Phasen einer empirischen Studie nach Döring benennen"
    - "vier Stufen der KI-Nutzung beschreiben und den Phasen einer Studie zuordnen"
    - "an Studien erklären, warum auch überzeugende Antworten falsch sein können und erfundene Quellen weiter vorkommen"
    - "in einer Tabelle festhalten, wofür du KI eingesetzt und wie du das Ergebnis geprüft hast"
level: 1
duration: 20
topics: [ai-agents-as-tools]
modules: [pmg]
areas: [ds]
relations:
  see_also: [opencode-course-assistant, paper-structure, ai-agents-in-research]
status: draft
updated: 2026-11-18
---

![Folien: KI als Kopilot in der empirischen Forschung](item:ai-research-support-slides)

Im Cockpit eines Flugzeugs ist der Kopilot voll ausgebildet und fliegt große
Teile der Strecke, während die Kapitänin entscheidet, wohin es geht, und für
die Landung einsteht. Diese Rolle kann eine KI in deiner Studie einnehmen:
Sie kann viel, oft schnell und gut, aber du legst den Kurs fest und stehst
für das ein, was am Ende im Paper steht. Diese Lektion zeigt zuerst, was
heute möglich ist, und fragt danach, was davon funktioniert und sinnvoll ist.

## Drei Arten von KI

„KI“ meint im wissenschaftlichen Arbeiten drei recht verschiedene Dinge.

| Art | Was sie leistet | Beispiele | Arbeitet mit |
|---|---|---|---|
| **Chatbots** | beantworten deine Fragen in einem Chatfenster | ChatGPT, Claude, Gemini, Chat AI (GWDG), HAWKI (Hochschule Osnabrück) | dem, was du eintippst oder hochlädst |
| **Spezialisierte Werkzeuge** | nutzen KI für eine bestimmte Aufgabe | Consensus, Elicit, Research Rabbit, NotebookLM, Napkin, Gamma | einer Datenbank von Papers, deinen PDFs oder deinem Text |
| **Agenten** | bekommen ein Ziel und erreichen es selbstständig | Claude Code, Codex, Antigravity (Google), OpenCode, Bionic (LM Studio) | deinen Dateien, Programmen und dem Web |

Chatbots sind die Allrounder: Sie erklären, formulieren und schreiben Code,
kennen aber nur, was du ihnen gibst, und alles geschieht im Browser, getrennt
von deinen eigenen Dateien. Spezialisierte Werkzeuge nutzen KI für eine
bestimmte Aufgabe und erledigen sie oft besser als ein Chatbot: Consensus
und Elicit suchen in echten Literaturdatenbanken, Research Rabbit zeigt, wie
Papers einander zitieren, NotebookLM beantwortet Fragen zu deinen PDFs,
[Napkin](https://www.napkin.ai) macht aus einem Text ein Diagramm und
[Gamma](https://gamma.app) aus einer Gliederung Folien. Agenten sind von
anderer Art: Du gibst ihnen ein Ziel und nicht den Weg, und sie erreichen es
selbstständig in einer Schleife aus Planen, Handeln und Prüfen. Zum Handeln
nutzen sie Werkzeuge, vor allem deine Dateien, Programme und das Web, und
sie arbeiten so lange, bis das Ziel erreicht ist (siehe die Lektion „Was ist
ein KI-Agent“).

Welche Werkzeuge sich für welche Arbeit anbieten, zeigt die folgende
Übersicht. Sie folgt der Liste der Universitätsbibliothek Duisburg-Essen und
den Werkzeugen, die in der Blockwoche „KI als Copilot“ an der Hochschule
Osnabrück für die einzelnen Phasen wissenschaftlichen Arbeitens eingesetzt
wurden.

| Wofür | Werkzeuge |
|---|---|
| Thema finden und erste Orientierung | ChatGPT (Deep Research), Claude, Gemini, Perplexity, Consensus |
| Literatur finden und prüfen | Elicit, Consensus, Semantic Scholar, scienceOS, Scite, Research Rabbit, Litmaps |
| Papers verstehen und Wissen ordnen | NotebookLM, SciSpace, Explainpaper |
| Daten analysieren und darstellen | ChatGPT, Gemini, Julius AI, Agenten wie Claude Code oder OpenCode |
| Diagramme und Folien | Napkin, Gamma |
| Schreiben und überarbeiten | ChatGPT Canvas, Claude, DeepL Write, Paperpal |

Chat AI der GWDG steht Angehörigen vieler deutscher Hochschulen kostenlos zur
Verfügung und verarbeitet Daten DSGVO-konform, solange du eines ihrer eigenen
Modelle wählst. An der Hochschule Osnabrück bietet
[HAWKI](https://hawki.hs-osnabrueck.de) einen solchen Zugang.

## Neun Phasen einer Studie

![Das Lehrbuch zum Forschungsprozess](item:doering-research-methods)

Döring (2023, Abschnitt 1.3.1) beschreibt den Forschungsprozess einer
quantitativen Studie in neun Phasen und widmet jeder ein eigenes Kapitel.
Gruppiert man sie, ergeben sich drei Abschnitte:

| Abschnitt | Phasen |
|---|---|
| planen | 1 Forschungsthema · 2 Forschungsstand und theoretischer Hintergrund · 3 Untersuchungsdesign |
| Daten erheben | 4 Operationalisierung · 5 Stichprobenziehung · 6 Datenerhebung |
| auswerten und berichten | 7 Datenaufbereitung · 8 Datenanalyse · 9 Ergebnispräsentation |

Qualitative Studien durchlaufen ähnliche Phasen, aber zumindest teilweise im
Kreis, weil die Auswertung zurück in die Erhebung führen kann. Die mittlere
Zeile zählt nur, wenn du selbst Daten erhebst; bei einer Sekundäranalyse,
etwa einer Umfrage, die schon jemand durchgeführt hat, haben andere die
Phasen 4 bis 6 übernommen, und deine Studie beginnt mit dem Codebuch.

## Was möglich ist: vier Stufen

Wie wir mit KI arbeiten, hat sich in vier Stufen entwickelt, und jede Stufe
baut auf der vorigen auf: Was die KI auf Stufe 1 kann, kann sie auf Stufe 4
immer noch, es kommt jeweils etwas dazu. Mit jeder Stufe gibst du mehr von der
Arbeit ab und siehst weniger davon.

| Stufe | Wo die KI arbeitet | Dein Teil | Was neu dazukommt |
|---|---|---|---|
| **1 beantwortet Fragen** | im Chat | fragen und die Antwort von Hand übertragen | die Grundlage |
| **2 schreibt Dokumente** | im Chat | einen Prompt schreiben und das Dokument übertragen, etwa den Entwurf deines Methodenteils | Dokumente |
| **3 handelt in deinen Dateien** | in deinem Ordner, mit Werkzeugen | das Ziel setzen und Rückmeldung geben, in einer Schleife, bis es passt | Werkzeuge, deine Dateien, eine Schleife |
| **4 arbeitet allein** | in deinem Ordner, mit Werkzeugen | keiner: niemand prüft das Ergebnis, vielleicht weil es niemand mehr nachvollziehen kann | kein Mensch mehr in der Schleife |

Stufe 4 klingt nach Zukunft, hat in der Mathematik aber schon begonnen: Im
November 2026 begutachtete ein Komitee unter dem Physiker David Gross einen
Beweis, den eine KI für den Existenzteil des Yang-Mills-Problems gefunden und
in der Beweissprache Lean hatte prüfen lassen, und schrieb dazu, es behaupte
noch nicht, den Beweis vollständig zu verstehen (Science, 2026).

Alle vier Stufen sind heute möglich. Ob sie auch funktionieren und ob sie
sinnvoll sind, ist eine andere Frage, und sie stellt sich für jede Phase
einer Studie neu.

**Denkaufgabe.** Geh die neun Phasen durch: Welche Stufe passt zu welcher
Phase, und wo hast du KI schon eingesetzt, auf welcher Stufe? Einige
Anregungen:

- Forschungsfrage: Ein Chatbot kann sagen, welche Spalten des Codebuchs zu
  deiner Frage passen, ein Agent kann Codebuch und Daten lesen und prüfen, ob
  eine Frage überhaupt beantwortbar ist. Je mehr die KI auswählt, desto eher
  wird die Frage die, die sich am leichtesten beantworten lässt.
- Forschungsstand: Ein spezialisiertes Werkzeug wie Consensus oder Elicit
  findet und fasst Studien zusammen, ein Agent kann Datenbanken durchsuchen
  und den Forschungsstand entwerfen. In dein Paper kommt nur, was du geöffnet
  und gelesen hast.
- Datenanalyse: Ein Agent schreibt, startet und korrigiert R-Code. Falscher
  Code läuft oft ohne Fehlermeldung, deshalb prüfst du, was er filtert und
  wie er fehlende Werte behandelt, und zählst eine Gruppe von Hand nach.
- Ergebnispräsentation: Ein Chatbot kommentiert deine Abbildung oder deinen
  Text, ein Agent kann alle Abbildungen zeichnen und sogar das ganze Paper
  schreiben. Gerade hier stellt sich die Frage nach dem Sinn am
  dringendsten, denn du stehst für jeden Satz ein.

## Was funktioniert

**Die zerklüftete Grenze.** In einem Feldexperiment bei der Boston
Consulting Group bearbeiteten 758 Beraterinnen und Berater realistische
Aufgaben, ein Teil mit GPT-4, ein Teil ohne (Dell'Acqua, Mollick et al.,
2023). Bei Aufgaben, die das Modell gut beherrscht, also innerhalb der
Grenze, erledigte die Gruppe mit KI 12,2 % mehr Aufgaben, war 25,1 %
schneller und lieferte Arbeit von über 40 % höherer Qualität. Bei einer
ähnlich aussehenden Aufgabe knapp außerhalb der Grenze kam sie um
19 Prozentpunkte seltener zur richtigen Lösung als die Gruppe ohne KI. Ethan
Mollick hat das Bild der „jagged frontier“ aus dieser Studie in
*Co-Intelligence* (2024) bekannt gemacht und führt es in *Co-Existence*
(2026) fort. Die Grenze verläuft zerklüftet, sodass Aufgaben, die sich
ähneln, auf verschiedenen Seiten liegen, und von innen siehst du nicht, auf
welcher du gerade bist. Was möglich aussieht, musst du deshalb trotzdem
prüfen.

**Die Grenze wandert.** Mit jeder Generation von Modellen wächst die Grenze,
aber sie wird nicht einfach größer, sondern ändert ihre Form: Manche Ecken
rücken weit nach außen, andere verschieben sich zur Seite, und die
Einbuchtungen wandern mit. So kamen erst Aufgaben wie einen Text glätten oder
eine Fehlermeldung erklären hinein, dann R-Code schreiben und ein Paper
zusammenfassen, dann als Agent eine ganze Analyse rechnen oder die Literatur
durchsuchen. Zu beurteilen, worauf es in einer Studie ankommt, und nur
Quellen zu zitieren, die es wirklich gibt, lag 2026 noch draußen. Manche, etwa
die Autoren des Szenarios *AI 2027* oder Anthropic-Chef Dario Amodei, halten
es für möglich, dass KI um 2027 alles kann, was Menschen können, und das
besser; das ist eine Hypothese, keine Vorhersage. Das Bild ist vereinfacht und
keine Messung, aber es erklärt, warum die Frage nie nur lautet, ob KI eine
Aufgabe grundsätzlich kann, sondern ob genau diese Aufgabe innerhalb der
Grenze des Modells liegt, das du gerade nutzt. Mit jedem neuen Modell prüfst
du das neu.

**Quellen, die es nicht gibt.** Walters und Wilder (2023) ließen GPT-3.5 und
GPT-4 kurze Literaturüberblicke zu 42 Themen schreiben und prüften alle 636
Literaturangaben. Bei GPT-3.5 gab es 55 % der Quellen gar nicht, bei GPT-4
18 %. Von den Quellen, die es gab, hatten 43 % bzw. 24 % falsche Angaben zu
Autoren, Jahr oder Seiten.

**Erfundene Quellen 2026.** Mit neueren Modellen ist das Problem nicht
verschwunden. Topaz et al. (2026) prüften die Literaturangaben von
2,5 Millionen biomedizinischen Papers: 2023 zitierte eines von 2.828 Papers
mindestens eine Quelle, die es nicht gibt, 2025 eines von 458 und in den
ersten sieben Wochen 2026 eines von 277. Rao, Wong und Callison-Burch (2026)
prüften 221.000 Links, die KI-Systeme als Quellen angaben: Von den Links der
Deep-Research-Agenten hatte es 10,7 % nie gegeben, bei Modellen mit Websuche
4,8 %. Zahlen zu den neuesten Modellen gibt es noch nicht; die jüngsten in
dieser Studie sind GPT-5.1 und Claude Sonnet 4.5, und von ihren Links liefen
zwischen 4 und 10 % ins Leere.

Nennt dir eine KI eine Studie, die perfekt passt, samt DOI, dann öffnest du
sie über die DOI und liest sie. Auch eine DOI kann erfunden sein oder zu
einem anderen Artikel führen, und die KI zu fragen, ob die Studie echt ist,
hilft nicht, weil sie in beiden Fällen gleich überzeugt antwortet.

## Du bleibst Autorin oder Autor

Drei Regeln gelten, gleich mit welchem Werkzeug und auf welcher Stufe du
arbeitest:

1. Du stehst für jeden Satz ein, auch für den, den eine KI geschrieben hat.
2. Du hältst fest, wofür du KI eingesetzt und wie du das Ergebnis geprüft
   hast.
3. Du achtest auf Verzerrungen: Eine KI gibt wieder, was in ihren Daten
   häufig ist, nicht, was für die Menschen gilt, die du untersuchst. Eine
   Zusammenfassung von Studien, eine Kodierung von Freitextantworten oder die
   Beschreibung einer Gruppe kann deshalb schief sein; frag dich, wen ein
   Ergebnis auslässt, und vergleiche es mit deinen Daten. Fairness gehört zu
   den Kernanforderungen der Ethik-Leitlinien der EU-Kommission für
   vertrauenswürdige KI.

Für die zweite Regel genügt eine Tabelle im Anhang deines Papers, mit einer
Zeile je Einsatz:

| Werkzeug und Modell | Wofür | Abschnitt | Wie geprüft |
|---|---|---|---|
| Agent (Modell) | R-Code für Abbildung 2 | Ergebnisse | ausgeführt, n von Hand gezählt |
| Chatbot (Modell) | Suchbegriffe | Einleitung | in der Bibliothek gesucht |
| Recherchewerkzeug | Studien finden | Einleitung | jede zitierte Studie gelesen |
| Agent (Modell) | Rückmeldung zur Gliederung | Methode | 2 von 5 Punkten übernommen |

Die letzte Spalte ist die wichtigste, denn sie zeigt, dass du Autorin oder
Autor geblieben bist. Wenn du sie fortlaufend ausfüllst, kostet jede Zeile
eine Minute.

## Zum Mitnehmen

- Chatbots beantworten Fragen im Browser, spezialisierte Werkzeuge nutzen KI
  für eine bestimmte Aufgabe, Agenten bekommen ein Ziel und erreichen es
  selbstständig in einer Schleife.
- Die Arbeit mit KI hat vier Stufen, und jede baut auf der vorigen auf:
  Fragen beantworten, Dokumente schreiben, in deinen Dateien handeln mit
  deiner Rückmeldung, und allein arbeiten, ohne dass jemand das Ergebnis
  prüft.
- Was möglich ist, funktioniert nicht überall gleich gut, und von innen
  siehst du die Grenze nicht, deshalb prüfst du jedes Ergebnis.
- Erfundene Quellen kommen weiter vor, in Antworten von KI wie in
  veröffentlichten Papers; zitiere nur, was du geöffnet und gelesen hast.
- Halte in einer Tabelle fest, wofür du KI eingesetzt und wie du geprüft
  hast.
- Was funktioniert, lernst du nur, indem du selbst mit KI arbeitest, denn wir
  alle erkunden die zerklüftete Grenze gerade und schieben sie nach außen.

## Quellen

- Universitätsbibliothek Duisburg-Essen (2026). *KI-Tools.*
  [uni-due.de/ub/ki-tools.php](https://www.uni-due.de/ub/ki-tools.php)
- Döring, N. (2023). *Forschungsmethoden und Evaluation in den Sozial- und
  Humanwissenschaften* (6. Aufl.). Springer.
  [doi:10.1007/978-3-662-64762-2](https://doi.org/10.1007/978-3-662-64762-2)
- Dell'Acqua, F., McFowland, E., Mollick, E. R. et al. (2023). *Navigating
  the jagged technological frontier: Field experimental evidence of the
  effects of AI on knowledge worker productivity and quality.* Harvard
  Business School Working Paper 24-013.
  [SSRN 4573321](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321)
- Mollick, E. (2024). *Co-Intelligence: Living and working with AI.*
  Portfolio.
- Mollick, E. (2026). *Co-Existence: The next phase of AI.* Penguin Random
  House.
- Kokotajlo, D., Alexander, S., Larsen, T., Lifland, E. & Dean, R. (2025).
  *AI 2027.* [ai-2027.com](https://ai-2027.com)
- *Science* (2026). AI rivals tackle one of physics' deepest mathematical
  challenges.
  [science.org](https://www.science.org/content/article/ai-rivals-tackle-one-physics-deepest-mathematical-challenges)
- Walters, W. H. & Wilder, E. I. (2023). Fabrication and errors in the
  bibliographic citations generated by ChatGPT. *Scientific Reports* 13,
  14045. [doi:10.1038/s41598-023-41032-5](https://doi.org/10.1038/s41598-023-41032-5)
- Topaz, M. et al. (2026). Fabricated citations: an audit across 2.5 million
  biomedical papers. *The Lancet* 407 (10541), 1779–1781.
  [doi:10.1016/S0140-6736(26)00603-3](https://doi.org/10.1016/S0140-6736(26)00603-3)
- Rao, D., Wong, E. & Callison-Burch, C. (2026). *Detecting and correcting
  reference hallucinations in commercial LLMs and deep research agents.*
  arXiv 2604.03173.
  [doi:10.48550/arXiv.2604.03173](https://doi.org/10.48550/arXiv.2604.03173)
- Europäische Kommission, Hochrangige Expertengruppe für KI (2019).
  *Ethik-Leitlinien für eine vertrauenswürdige KI.*
  [digital-strategy.ec.europa.eu](https://digital-strategy.ec.europa.eu/en/library/ethics-guidelines-trustworthy-ai)
