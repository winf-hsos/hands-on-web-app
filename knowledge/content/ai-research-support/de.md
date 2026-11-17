---
type: lesson
code: 7990
title: KI-Unterstützung in der empirischen Forschung
summary: >-
  Wo KI in den sieben Schritten einer Studie viel Arbeit übernehmen kann und
  wo du entscheidest, wie du so fragst, dass die Entscheidung bei dir bleibt,
  was Studien über ihre Fehler gefunden haben und wie du dokumentierst, wofür
  du sie eingesetzt hast.
objectives:
  intro: "In dieser Lektion lernst du, wie du KI in einer empirischen Studie sinnvoll einsetzt, und kannst danach:"
  goals:
    - "für jeden Schritt einer Studie sagen, ob eine KI dort viel Arbeit übernehmen kann oder ob du entscheidest"
    - "eine Anfrage an eine KI so formulieren, dass sie hilft, ohne dir die Entscheidung abzunehmen"
    - "zu jeder Antwort einer KI benennen, was du prüfst, bevor du sie verwendest"
    - "an zwei Studien erklären, warum auch überzeugende Antworten falsch sein können"
    - "in einer Tabelle festhalten, wofür du KI eingesetzt und wie du das Ergebnis geprüft hast"
level: 1
duration: 20
topics: [ai-agents-as-tools]
modules: [pmg]
areas: [ds]
relations:
  see_also: [opencode-course-assistant, paper-structure, ai-agents-in-research]
status: draft
updated: 2026-11-17
---

![Folien: KI als Kopilot in der empirischen Forschung](item:ai-research-support-slides)

Im Cockpit eines Flugzeugs ist der Kopilot voll ausgebildet und fliegt große
Teile der Strecke, während die Kapitänin das Kommando behält und für den Flug
unterschreibt. Diese Rolle kann eine KI in deiner Studie einnehmen: Sie kann
viel, oft schnell und gut, aber du legst den Kurs fest und stehst für das
ein, was am Ende im Paper steht. Diese Lektion zeigt, wo das in einer Studie
gilt, wie du fragst und was du prüfst.

## Sieben Schritte einer Studie

Eine Studie mit Daten, die schon jemand erhoben hat, etwa eine
Sekundäranalyse einer Umfrage, läuft in sieben Schritten. Die ersten drei
planen sie: Du findest eine **Forschungsfrage**, liest, was über sie bekannt
ist (**Literatur**), und prüfst, welche **Daten und Spalten des Codebuchs**
sie beantworten können. Die übrigen vier arbeiten mit den Daten: **Analyse**,
**Abbildungen**, **Schreiben** und **Präsentation**.

| Schritt | Wer trägt die Arbeit |
|---|---|
| Forschungsfrage | du entscheidest, die KI ist Sparringspartner |
| Literatur | die KI übernimmt viel, du prüfst |
| Daten und Codebuch | du entscheidest, die KI ist Sparringspartner |
| Analyse | die KI übernimmt viel, du prüfst |
| Abbildungen | die KI übernimmt viel, du prüfst |
| Schreiben | die KI übernimmt viel, du prüfst |
| Präsentation | du entscheidest, die KI ist Sparringspartner |

Wo die KI viel übernimmt, etwa beim Suchen, beim R-Code, bei einer Abbildung
oder beim Glätten eines Absatzes, ist deine Aufgabe das Prüfen. Wo du
entscheidest, bei der Frage, bei der Wahl der Daten und bei dem, was du vor
Publikum sagst, hilft sie dir höchstens beim Nachdenken. Daneben läuft
Haushaltsarbeit wie Literaturangaben, Dateinamen und Formatierung, bei der
eine KI viel Zeit spart.

## Fragen, ohne die Entscheidung abzugeben

Wie du fragst, entscheidet, ob die KI dir hilft oder für dich entscheidet.
Die folgenden fünf Anfragen beziehen sich auf eine Umfrage zur Milch und
stehen auf Englisch wie auf den Folien; du kannst sie genauso auf Deutsch
stellen. Zu jeder gehört, was du an der Antwort prüfst.

**Forschungsfrage.** Die KI kennt das Codebuch nur, wenn du es ihr gibst,
und dann passt sie eine Frage gut an Spalten an. Bitte sie, hinzusehen statt
umzuschreiben:

```
here is our research question and the codebook of the survey. which columns
would answer it, and can the data answer it at all? don't change the
question, just tell us what you see.
```

Prüf danach, ob es die genannten Spalten im Codebuch gibt, ob die Frage zu
Daten passt, die schon erhoben sind, und ob sie noch fragt, was du wissen
wolltest, und nicht, was sich am leichtesten beantworten lässt.

**Literatur.** Frag nach Suchbegriffen und Orten, nicht nach fertigen
Quellen:

```
suggest search terms in english and german for studies on the willingness
to pay for organic milk, and name three journals where they appear.
```

Mit diesen Begriffen suchst du selbst im Katalog der Bibliothek und in einer
Fachdatenbank, öffnest jede Studie und zitierst nur, was du gelesen hast.

**Analyse.** Beim R-Code hilft eine KI am meisten:

```
write r code that compares the price from which milk is too expensive
between vegetarians and omnivores, with the median and the number of
respondents in each group.
```

Hier fällt ein Fehler aber auch am wenigsten auf, weil falscher Code oft
ohne Fehlermeldung läuft. Führ den
Code selbst aus, sieh nach, was er filtert und wie er fehlende Werte
behandelt, und zähl eine Gruppe von Hand nach, etwa mit `count()`. Stimmen
die Zahlen, kannst du dem Rest etwas mehr trauen.

**Abbildungen.** Eine KI beherrscht das Handwerk einer Abbildung: sortieren,
beschriften, Farben. Sag in der Anfrage, was sich ändern soll und dass die
Daten bleiben, wie sie sind:

```
make this bar chart readable: bars sorted by size, labels for people, the
number of respondents in the caption. keep the data as they are.
```

Prüf danach, ob die Abbildung noch deine Frage
beantwortet, ob Balken bei null beginnen und ob die Beschriftungen in deinen
Worten sagen, was du meinst.

**Schreiben.** Bitte um Rückmeldung statt um Text:

```
read our methods section and list what someone would need to repeat the
analysis. don't rewrite it, only name what is missing.
```

Eine Liste dessen, was fehlt, kannst du Punkt für Punkt prüfen, übernehmen
oder verwerfen. Lässt du doch umschreiben, lies jeden Satz so, als hättest du
ihn selbst geschrieben, und achte auf Behauptungen, die ohne Quelle
dazugekommen sind.

## Wo es schiefgeht

Warum so viel Prüfen? Zwei Studien zeigen, dass KI gerade dort Fehler macht,
wo ihre Antworten überzeugend aussehen.

**Die zerklüftete Grenze.** In einem Feldexperiment bei der Boston
Consulting Group bearbeiteten 758 Beraterinnen und Berater realistische
Aufgaben, ein Teil mit GPT-4, ein Teil ohne (Dell'Acqua et al., 2023). Bei
Aufgaben, die das Modell gut beherrscht, also innerhalb der Grenze, erledigte
die Gruppe mit KI 12,2 % mehr Aufgaben, war 25,1 % schneller und lieferte
Arbeit von über 40 % höherer Qualität. Bei einer ähnlich aussehenden Aufgabe
knapp außerhalb der Grenze kam sie um 19 Prozentpunkte seltener zur
richtigen Lösung als die Gruppe ohne KI. Die Grenze verläuft zerklüftet:
Aufgaben, die sich ähneln, liegen auf verschiedenen Seiten, und von innen
siehst du nicht, auf welcher du gerade bist.

**Quellen, die es nicht gibt.** Walters und Wilder (2023) ließen GPT-3.5 und
GPT-4 kurze Literaturüberblicke zu 42 Themen schreiben und prüften alle 636
Literaturangaben. Bei GPT-3.5 gab es 55 % der Quellen gar nicht, bei GPT-4
18 %. Von den Quellen, die es gab, hatten 43 % bzw. 24 % falsche Angaben zu
Autoren, Jahr oder Seiten. Neuere Modelle und Agenten, die im Netz suchen,
machen solche Fehler seltener, verschwunden ist das Problem aber nicht.

Nennt dir eine KI eine Studie, die perfekt passt, samt DOI, dann öffnest du
sie über die DOI und liest sie. Auch eine DOI kann erfunden sein oder zu
einem anderen Artikel führen, und die KI zu fragen, ob die Studie echt ist,
hilft nicht, weil sie in beiden Fällen gleich überzeugt antwortet.

## Du bleibst Autorin oder Autor

Drei Regeln gelten, gleich mit welchem Werkzeug du arbeitest:

1. Du stehst für jeden Satz ein, auch für den, den eine KI geschrieben hat.
2. Du hältst fest, wofür du KI eingesetzt und wie du das Ergebnis geprüft
   hast.
3. Nichts Persönliches geht in den Chat: keine Namen von Befragten und keine
   Freitextantworten mit persönlichen Angaben, denn was du eintippst oder
   hochlädst, verlässt deinen Rechner.

Für die zweite Regel genügt eine Tabelle im Anhang deines Papers, mit einer
Zeile je Einsatz:

| Werkzeug und Modell | Wofür | Abschnitt | Wie geprüft |
|---|---|---|---|
| Agent (Modell) | R-Code für Abbildung 2 | Ergebnisse | ausgeführt, n von Hand gezählt |
| Chat-App (Modell) | Suchbegriffe | Einleitung | in der Bibliothek gesucht |
| Agent (Modell) | Rückmeldung zur Gliederung | Methode | 2 von 5 Punkten übernommen |

Die letzte Spalte ist die wichtigste, denn sie zeigt, dass du Autorin oder
Autor geblieben bist. Wenn du sie fortlaufend ausfüllst, kostet jede Zeile
eine Minute.

## Zum Mitnehmen

- In Literatur, Analyse, Abbildungen und Schreiben kann eine KI viel Arbeit
  übernehmen, und deine Aufgabe ist das Prüfen; Frage, Daten und
  Präsentation entscheidest du.
- Frag nach Rückmeldung, Suchbegriffen oder Code, und sag dazu, was die KI
  nicht ändern soll.
- Auch überzeugende Antworten können falsch sein, deshalb prüfst du jede.
- Eine Quelle, die echt aussieht, ist noch keine Quelle, die du gelesen hast.
- Halte in einer Tabelle fest, wofür du KI eingesetzt und wie du geprüft
  hast.

## Quellen

- Dell'Acqua, F. et al. (2023). *Navigating the jagged technological
  frontier: Field experimental evidence of the effects of AI on knowledge
  worker productivity and quality.* Harvard Business School Working Paper
  24-013. [SSRN 4573321](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4573321)
- Walters, W. H. & Wilder, E. I. (2023). Fabrication and errors in the
  bibliographic citations generated by ChatGPT. *Scientific Reports* 13,
  14045. [doi:10.1038/s41598-023-41032-5](https://doi.org/10.1038/s41598-023-41032-5)
