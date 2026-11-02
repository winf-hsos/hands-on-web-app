---
type: lesson
code: 9387
title: Pakete
summary: >-
  Pakete erweitern R um neue Funktionen: einmal installieren, in jedem Skript
  laden. Dazu das tidyverse und was auf dieser Plattform schon bereitliegt.
objectives:
  intro: "In dieser Lektion lernst du, R mit Paketen um neue Funktionen zu erweitern, und kannst danach:"
  goals:
    - "erklären, was ein Paket ist und dass die meisten Pakete für R im Verzeichnis CRAN liegen"
    - "ein Paket mit `install.packages()` einmal installieren und mit `library()` am Anfang jedes Skripts laden"
    - "die Meldung, dass R eine Funktion nicht findet, auf ein installiertes, aber nicht geladenes Paket zurückführen"
    - "das `tidyverse` als Paketfamilie beschreiben und `dplyr`, `ggplot2`, `readr` und `tidyr` darin einordnen"
    - "begründen, warum `library()` in ein eigenes Skript gehört, obwohl `dplyr` auf dieser Plattform schon geladen ist"
level: 1
duration: 6
topics: [programming-with-r, reproducible-work]
modules: [ea]
areas: [ds]
relations:
  requires: [r-functions]
status: published
updated: 2026-11-01
---

R bringt von Haus aus viele Funktionen mit, aber längst nicht alle, die man
beim Auswerten braucht. Den Rest liefern **Pakete**: Sammlungen von
Funktionen, die andere geschrieben und veröffentlicht haben. Für R gibt es
über zwanzigtausend davon, die meisten im offiziellen Verzeichnis CRAN.

## Installieren und laden

Ein Paket brauchst du auf deinem Rechner nur einmal zu installieren. Danach
lädst du es in jedem Skript, das es benutzt, mit `library()`:

```r static
install.packages("dplyr")  # einmal
library(dplyr)             # am Anfang jedes Skripts
```

Beim Installieren steht der Name in Anführungszeichen, beim Laden nicht. Ist
ein Paket installiert, aber nicht geladen, kennt R seine Funktionen nicht und
meldet, dass es die Funktion nicht findet.

## Das tidyverse

Viele Pakete für die Datenanalyse folgen denselben Ideen und passen
zusammen. Zusammen heißen sie **tidyverse**: dplyr zum Transformieren,
ggplot2 für Grafiken, readr zum Einlesen, tidyr zum Aufräumen und einige
mehr. Mit `install.packages("tidyverse")` und `library(tidyverse)` holst du
sie alle auf einmal.

## Auf dieser Plattform

In den R-Kästen hier ist dplyr schon geladen, damit jedes Beispiel ohne
Vorrede läuft. Das ist eine Abkürzung dieser Seite: Auf deinem eigenen
Rechner gehört `library()` an den Anfang jedes Skripts, damit es auch morgen
und auf einem anderen Rechner läuft. Eine Umgebung, in der du R dort
schreibst, ist [[positron]].

## Zum Mitnehmen

- Pakete erweitern R um Funktionen.
- `install.packages("name")` einmal, `library(name)` in jedem Skript.
- Das tidyverse ist eine Familie von Paketen für die Datenanalyse, zu der
  auch dplyr gehört.
