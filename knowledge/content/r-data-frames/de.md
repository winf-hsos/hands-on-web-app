---
type: lesson
code: 9214
title: Tabellen in R
summary: >-
  Eine Tabelle ist in R ein Data Frame aus gleich langen Vektoren: wie man
  sie ansieht, ihre Spalten herausholt und den Datensatz survey kennenlernt.
objectives:
  intro: "In dieser Lektion lernst du, wie R Tabellen als Data Frame speichert, und kannst danach:"
  goals:
    - "erklären, dass ein Data Frame aus gleich langen Vektoren besteht und ein Tibble seine übersichtlichere Variante ist"
    - "eine Tabelle wie `survey` anzeigen und die Spaltentypen `<int>`, `<dbl>` und `<chr>` in der Ausgabe lesen"
    - "eine breite Tabelle mit `glimpse()` Spalte für Spalte ansehen"
    - "eine Spalte mit `$` als Vektor herausholen und ihre Werte mit `table()` zählen"
    - "die Größe einer Tabelle mit `nrow()` und `ncol()` und ihre Spalten mit `names()` bestimmen"
level: 1
duration: 12
topics: [programming-with-r]
modules: [ea]
areas: [ds]
relations:
  requires: [r-missing-values]
status: draft
updated: 2026-11-01
---

Bisher hattest du einzelne Vektoren. Echte Daten kommen als Tabelle: jede
Zeile eine Person, jede Spalte eine Frage. In R heißt eine Tabelle
**Data Frame**, und sie ist nichts anderes als mehrere gleich lange Vektoren
nebeneinander. Alles, was du über Vektoren weißt, gilt deshalb für jede
Spalte.

## Eine Tabelle ansehen

In jedem R-Kasten auf dieser Plattform liegt eine kleine Tabelle bereit, die
`survey` heißt. Schreibst du ihren Namen, zeigt R sie an:

```r
survey
```

Die Variante des Data Frame, die du hier siehst, heißt **Tibble**; sie zeigt
sich etwas übersichtlicher an. Oben steht, wie viele Zeilen und Spalten die
Tabelle hat, und unter jedem Spaltennamen in spitzen Klammern ihr Typ:
`<int>` für ganze Zahlen, `<dbl>` für Kommazahlen, `<chr>` für Texte. Passt
nicht alles auf die Breite, nennt R die übrigen Spalten darunter.

Bei breiten Tabellen ist `glimpse()` praktischer. Es dreht die Ansicht um und
zeigt jede Spalte als Zeile, mit ihren ersten Werten:

```r
glimpse(survey)
```

## Spalten herausholen

Mit `$` holst du eine Spalte heraus, und sie ist ein ganz normaler Vektor.
Alles aus den vorigen Lektionen funktioniert damit:

```r
mean(survey$age)
```

Für Texte ist `table()` nützlich. Es zählt, wie oft jeder Wert vorkommt:

```r
table(survey$diet)
```

Wie groß eine Tabelle ist, sagen `nrow()` und `ncol()`, und `names()` nennt
die Spaltennamen.

## Der Datensatz `survey`

Die 30 Zeilen stammen aus einer Online-Befragung zu Milch und
Milchalternativen von Prof. Dr. Ulrich Enneking (Hochschule Osnabrück),
an der rund 2.800 Menschen teilgenommen haben. Für diese Lektionen sind es
wenige ausgewählte Personen und zehn Fragen; die Spalten sind englisch
benannt, wie es beim Programmieren üblich ist. Die ganze Befragung kannst du
als [[milk-chocolate-survey|Datensatz]] herunterladen.

| Spalte | Bedeutung |
|---|---|
| `id` | laufende Nummer der Person in diesem Auszug |
| `age` | Alter in Jahren |
| `gender` | Geschlecht (`female`, `male`) |
| `state` | Bundesland |
| `town_size` | Größe des Wohnorts, von `village` bis `city` |
| `household_size` | Zahl der Personen im Haushalt |
| `diet` | Ernährungsweise, etwa `omnivore`, `flexitarian`, `vegan` |
| `organic_share` | Anteil an Bio-Lebensmitteln beim Einkauf, von 1 (kaum) bis 5 (fast alles) |
| `milk_freq` | wie oft die Person Milch trinkt: `daily`, `weekly`, `monthly`, `rarely` |
| `milk_brand` | welche Marke ihr im Preisteil gezeigt wurde: `Weihenstephan` oder `alpro` |
| `price_too_expensive` | ab welchem Preis in Euro ihr ein Liter dieser Marke zu teuer wäre |

Nicht jede Person hat jede Frage bekommen, deshalb gibt es fehlende Werte.
Den Preisteil zum Beispiel sah nur ein Teil der Befragten, und jeweils nur
für eine der beiden Marken. Einige Werte sind auch bewusst seltsam, damit es
beim Aufräumen etwas zu entdecken gibt.

## Zum Mitnehmen

- Ein Data Frame ist eine Tabelle aus gleich langen Vektoren; ein Tibble ist
  die übersichtlichere Variante, die dplyr verwendet.
- `glimpse()` zeigt eine breite Tabelle Spalte für Spalte.
- `$` holt eine Spalte als Vektor heraus; `table()` zählt ihre Werte.
