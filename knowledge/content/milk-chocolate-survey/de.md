---
type: dataset
code: 5318
title: Umfrage zu Milch und Schokolade
summary: >-
  Eine Online-Befragung von 2.811 Menschen zu Einkauf, Ernährung und
  Einstellungen, mit zwei Teilstudien zu Schokolade und Milch: echte Daten mit
  Filterfragen, Experimenten und allem, was beim Auswerten dazugehört.
authors: [Ulrich Enneking]
year: 2025
file: mds12_schoko_milch.csv
level: 2
duration: 10
topics: [getting-data, exploring-data, data-pitfalls]
modules: [ea, wmg, pmg]
areas: [ds]
relations:
  see_also: [r-data-frames]
status: draft
updated: 2026-11-09
---

Prof. Dr. Ulrich Enneking (Fachgebiet Agrarmarketing, Hochschule Osnabrück)
hat im November 2025 Menschen in ganz Deutschland online befragt, die für
ihren Haushalt Lebensmittel einkaufen. Ein Panelanbieter hat sie rekrutiert,
mit Quoten für Alter, Geschlecht und Bundesland. Die Studie ist für die Lehre
gemacht: Sie enthält fast jede Art von Frage, die in der Marktforschung
vorkommt, und dazu einige Experimente. Er hat der Nutzung auf dieser
Plattform zugestimmt.

Jede Zeile ist eine befragte Person, jede Spalte eine Antwort oder ein daraus
abgeleiteter Wert. Der kleine Datensatz `survey` aus der Lektion [[r-data-frames]] ist
ein Auszug daraus.

## Was drinsteht

| Teil | Wer wurde gefragt | Worum es geht |
|---|---|---|
| Hauptstudie | alle 2.811 | Einkauf und Einkaufsorte, Ernährungsweise, Einstellungen zu Bio, Regionalität, Umwelt und neuen Lebensmitteln, Preise für Milch, Siegel, Haushalt und Person |
| Schokolade | 275 | Kaufanlässe und Kriterien, Markenbekanntheit, Bewertung einzelner Marken, vegane Schokolade und Schokolade mit Milch |
| Milch | rund 230 | Anlässe und Kriterien, Kuhmilch und Hafermilch, Verpackung, Herstellermarke und Handelsmarke |

Die beiden Teilstudien haben verschiedene Personen beantwortet. Wer
Schokolade bekam, hat bei allen Fragen zur Milch einen fehlenden Wert, und
umgekehrt.

## Wie die Spalten heißen

Der erste Buchstabe eines Spaltennamens sagt, zu welchem Block die Frage
gehört; danach folgen die Nummer der Frage im Fragebogen und ein Stichwort.

| Anfang | Block |
|---|---|
| `q` | Auswahl der Befragten und Quoten, etwa Alter und Bundesland |
| `v` | Verhalten, etwa was jemand kauft und wie oft |
| `p` | psychologische Skalen, etwa Einstellungen zu Bio |
| `b`, `u`, `w` | Bewertungen, Gesamturteile, Wissensfragen |
| `d` | Angaben zur Person und zum Haushalt |
| `a` | welche Variante eines Experiments jemand gesehen hat |
| `s`, `m` | die Teilstudien zu Schokolade und Milch |

Kleinbuchstaben stehen für Rohdaten, wie sie aus dem Fragebogen kamen,
Großbuchstaben für aufbereitete Spalten. Ein `f` am Ende heißt, dass dort
Wörter statt Codes stehen. Am Alter lässt sich die Kette verfolgen:
`q002geburt` ist das Geburtsjahr, `Q002alter` das Alter in Jahren,
`Q002altergru4` die Altersgruppe als Zahl und `Q002altergru4f` dieselbe
Gruppe als Text, etwa `45-59 Jahre`.

## Was man wissen sollte, bevor man rechnet

- **Fehlend heißt meistens „nicht gefragt“.** Rund die Hälfte aller Zellen
  ist leer, weil viele Fragen nur einem Teil der Befragten gestellt wurden:
  nach einer Filterfrage, in einer Teilstudie oder in einer Variante eines
  Experiments. Wer fehlende Werte einfach entfernt, ändert dabei, über wen er
  spricht.
- **Zahlen sind oft Codes.** In `q004geschlecht` oder `d044stadt` stehen
  Zahlen, deren Bedeutung der Fragebogen festlegt. Wo es eine Spalte mit `f`
  am Ende gibt, etwa `D044stadtf`, steht die Bedeutung schon dort.
- **Experimente stecken mitten in der Befragung.** Die Spalten mit `a` am
  Anfang sagen, welche Variante jemand zufällig bekam, etwa welche Milchmarke
  zu bewerten war oder welcher Preis zu sehen war. Diese Gruppen lassen sich
  vergleichen, weil der Zufall sie gebildet hat.
- **Die Stichprobe ist quotiert, nicht zufällig.** Sie bildet Deutschland nach
  Alter, Geschlecht und Bundesland ab, aber nur Menschen, die bei einem
  Online-Panel mitmachen und selbst einkaufen.

## Was nicht drin ist

Die Postleitzahl und alle offenen Antworten, in denen Menschen frei
formuliert haben, sind entfernt, zusammen 13 Spalten. Bei rund der Hälfte
der Befragten kam ihre Postleitzahl im ganzen Datensatz nur ein einziges Mal
vor, und in einem freien Text kann jemand mehr über sich verraten, als er
wollte.
Alles andere steht so in der Datei, wie es aus der Befragung kam.
