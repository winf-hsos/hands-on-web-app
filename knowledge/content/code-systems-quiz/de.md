---
type: quiz
code: 7353
title: "Quiz: Codes und Codewörter"
summary: Vier Fragen zu Codetabellen, ihrer Größe und eindeutig lesbaren Codewörtern.
objectives:
  intro: "Mit diesem Quiz prüfst du in vier Fragen, ob du Folgendes kannst:"
  goals:
    - "begründen, warum ein Byte wie `01000001` erst durch die verwendete Tabelle eine Bedeutung bekommt"
    - "berechnen, wie viele Positionen ein Code aus vier Farben für 26 Buchstaben braucht"
    - "vorhersagen, was ankommt, wenn Sender und Empfänger verschiedene Tabellen benutzen"
    - "erkennen, ob eine Codetabelle präfixfrei ist"
level: 1
duration: 5
topics: [representing-information]
modules: [dup]
relations:
  checks: [code-as-agreement, prefix-free-code]
status: draft
updated: 2026-11-01
---

## Ein Programm liest das Byte `01000001`. Was ist es?

- [ ] Immer der Buchstabe A
- [ ] Immer die Zahl 65
- [x] Das hängt davon ab, nach welcher Tabelle das Programm es liest

> Bits tragen ihre Bedeutung nicht in sich. Als Text gelesen ist das Byte ein
> A, als Zahl 65 und in einem Graustufenbild ein dunkles Grau.

## Wie viele Positionen braucht ein Buchstabe, wenn du mit vier Farben alle 26 Buchstaben übertragen willst?

- [ ] Zwei
- [x] Drei
- [ ] Vier
- [ ] Sechsundzwanzig

> Mit zwei Positionen gibt es nur 4 · 4 = 16 Codewörter, mit drei bereits
> 4 · 4 · 4 = 64.

## Sender und Empfänger benutzen Tabellen, in denen die Codewörter für n und m vertauscht sind. Was passiert?

- [ ] Das Programm des Empfängers meldet einen Fehler.
- [x] Es kommt ein anderes, gültig aussehendes Wort an.
- [ ] Die Übertragung bricht ab.

> Jedes Codewort steht in beiden Tabellen, also findet der Empfänger jedes Mal
> einen gültigen Buchstaben, nur eben den falschen.

## Welche Tabellen sind präfixfrei?

- [x] a = `0`, b = `10`, c = `11`
- [ ] a = `0`, b = `01`, c = `10`
- [x] a = `00`, b = `01`, c = `10`
- [ ] a = `1`, b = `10`, c = `00`

> In der zweiten Tabelle ist `0` der Anfang von `01`, in der vierten `1` der
> Anfang von `10`. Die dritte ist präfixfrei, weil alle Codewörter gleich lang
> und verschieden sind.
