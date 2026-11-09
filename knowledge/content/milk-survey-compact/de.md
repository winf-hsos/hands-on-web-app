---
type: dataset
code: 9176
title: Umfrage zu Milch, kompakt
summary: >-
  Alle 2.809 Befragten der Milch-Umfrage, aber nur 21 ausgewählte Fragen mit
  englischen Spaltennamen und Wörtern statt Codes: der Einstieg in eine echte
  Befragung mit Filterfragen, Experimenten und Ausreißern.
authors: [Ulrich Enneking]
year: 2025
file: milk_survey_compact.csv
level: 1
duration: 10
topics: [getting-data, exploring-data, data-pitfalls]
modules: [ea]
areas: [ds]
relations:
  see_also: [milk-chocolate-survey, r-data-frames]
status: published
updated: 2026-11-09
---

Dieser Datensatz ist ein Auszug aus der [[milk-chocolate-survey]] von Prof.
Dr. Ulrich Enneking. Alle Befragten sind drin, aber statt 606 Spalten nur eine
Auswahl an Fragen, mit englischen Spaltennamen und Wörtern statt Zahlencodes.
Jede Zeile ist eine befragte Person.

Die ersten elf Spalten heißen und sehen genauso aus wie im kleinen Datensatz
`survey` aus der Lektion [[r-data-frames]]. Code, der dort läuft, läuft deshalb
auch hier, nur mit 2.809 statt 30 Personen.

## Die Spalten

| Spalte | Bedeutung | fehlend |
|---|---|---|
| `id` | laufende Nummer | 0 |
| `age` | Alter in Jahren, 18 bis 80 | 0 |
| `gender` | `female` oder `male` | 0 |
| `state` | Bundesland | 0 |
| `town_size` | Größe des Wohnorts: `city`, `large town`, `town`, `small town`, `very small town`, `village` | 7 |
| `household_size` | Personen im Haushalt; 5 heißt „5 und mehr“ | 14 |
| `diet` | Ernährungsweise: `omnivore`, `flexitarian`, `vegetarian`, `vegan`, `pescetarian` | 28 |
| `organic_share` | Bio-Anteil am Einkauf, von 1 (fast nie) bis 5 (fast nur Bio) | 18 |
| `milk_freq` | wie oft im Haushalt Milch getrunken wird: `daily`, `weekly`, `monthly`, `rarely` | 424 |
| `milk_brand` | Preisexperiment: welche Marke gezeigt wurde, `Weihenstephan` oder `alpro` | 2.190 |
| `price_too_expensive` | ab welchem Preis in Euro diese Marke zu teuer wäre | 2.198 |
| `shops_discounter` | kauft gewöhnlich beim Discounter ein, `TRUE` oder `FALSE` | 0 |
| `shops_organic` | kauft gewöhnlich im Bioladen ein, `TRUE` oder `FALSE` | 0 |
| `eco_conscious` | „Ich würde mich selbst als umweltbewusst bezeichnen.“ Von −2 (trifft überhaupt nicht zu) bis +2 (trifft voll und ganz zu) | 6 |
| `prefers_organic` | „Beim Lebensmitteleinkauf bevorzuge ich Bio-Produkte.“ −2 bis +2 | 11 |
| `loves_meat` | „Ich liebe Mahlzeiten mit Fleisch.“ −2 bis +2 | 5 |
| `loves_cooking` | „Ich liebe es, zu kochen oder zu backen.“ −2 bis +2 | 11 |
| `rated_brand` | Markenexperiment: welche von sieben Milchmarken zufällig zur Bewertung gezeigt wurde | 478 |
| `brand_quality` | Bewertung dieser Marke, von geringer (−2) bis hoher (+2) Qualität | 500 |
| `brand_buy` | Bewertung dieser Marke, von „würde ich nicht kaufen“ (−2) bis „würde ich kaufen“ (+2) | 587 |
| `tiktok` | wie oft TikTok genutzt wird, von `daily` bis `never` | 1.442 |

## Was du wissen solltest, bevor du rechnest

- **Fehlend heißt meist „nicht gefragt“.** Nach der Milch hat die Befragung
  nur gefragt, wer in den letzten zwölf Monaten Milch verzehrt hat; das
  Preisexperiment bekam nur ein Teil der Befragten, die Frage nach den Medien
  etwa die Hälfte. Die vielen `NA` in diesen Spalten kommen aus dem Aufbau der
  Befragung, nicht aus Nachlässigkeit.
- **Zwei Experimente stecken drin.** Welche Marke jemand in `milk_brand` und
  in `rated_brand` zu sehen bekam, hat der Zufall entschieden. Unterschiede
  zwischen diesen Gruppen gehen deshalb auf die Marke zurück und nicht auf die
  Menschen, die sie bewertet haben.
- **Nicht jeder Wert ist plausibel.** In `price_too_expensive` stehen Preise,
  die für einen Liter Milch kaum gemeint sein können.
- **Die Stichprobe ist quotiert, nicht zufällig.** Sie bildet Deutschland nach
  Alter, Geschlecht und Bundesland ab, aber nur Menschen, die bei einem
  Online-Panel mitmachen und selbst einkaufen.

## Was nicht drin ist

Einkommen, Schulabschluss und Erwerbsstatus fehlen, ebenso die zwei Personen,
die beim Geschlecht „divers“ angegeben haben: Für eine Auswertung sind sie zu
wenige, und sie wären leicht wiederzuerkennen.

## Wie er entsteht

Den Auszug baust du in der [[dplyr-exercise-compact-survey|Übung zum
kompakten Datensatz]] selbst, aus der Rohfassung der Umfrage: laden, filtern,
Spalten auswählen und umbenennen, Codes in Wörter übersetzen und speichern.
Deshalb gibt es ihn in zwei Formaten. Die CSV-Datei ist einfacher Text, den
jedes Programm lesen kann; liest R sie ein, sind `gender`, `diet` und die
anderen übersetzten Spalten wieder Text, und `count(diet)` sortiert die
Ernährungsweisen alphabetisch. Die RDS-Datei bewahrt die Tabelle so, wie die
Übung sie gebaut hat, mit Faktoren und der Reihenfolge ihrer Stufen, kann
aber nur von R gelesen werden.
