---
kind: project
code: 1663
title: The Monty Hall Problem
summary: >-
  Wechseln oder bleiben? An einem berühmten Ratespiel lernt ihr, ein
  Experiment als Daten festzuhalten, es in R nachzubauen und so oft zu
  spielen, bis die Daten eine Antwort geben, die kaum jemand erwartet.
level: 1
modules: [ea]
areas: [ds]
phases:
  - id: play
    items: [geh-aufs-ganze, monty-hall-game]
    challenges:
      - id: challenge-1
  - id: vectors
    items: [data-representation-slides, r-vectors, r-comparisons]
    challenges:
      - id: challenge-2
  - id: data-frame
    items: [lets-make-a-deal, r-data-frames, r-data-types]
    challenges:
      - id: challenge-3
      - id: challenge-4
      - id: challenge-5
  - id: simulate
    items: [r-functions]
    challenges:
      - id: challenge-6
      - id: challenge-7
  - id: collect
    items: [tidy-data]
    challenges:
      - id: challenge-8
      - id: challenge-9
  - id: resolve
    items: [analytic-questions]
    challenges:
      - id: challenge-10
      - id: challenge-11
status: draft
updated: 2026-11-02
---

In einer Spielshow stehen drei Türen. Hinter einer wartet ein Auto, hinter
den beiden anderen je eine Ziege. Du wählst eine Tür, und der Moderator, der
weiß, wo das Auto steht, öffnet daraufhin eine der beiden anderen, und zwar
immer eine mit einer Ziege. Dann fragt er dich, ob du bei deiner Tür bleibst
oder zur anderen geschlossenen Tür wechselst.

Die meisten Menschen sind sicher, dass das keine Rolle spielt, weil ja zwei
Türen übrig sind. Ob das stimmt, findet ihr in diesem Projekt nicht durch
Nachdenken heraus, sondern mit Daten: Ihr spielt selbst, haltet jede Runde
fest, wertet einen Datensatz mit 100 Spielen aus und lasst R das Spiel so oft
wiederholen, bis die Antwort nicht mehr vom Zufall abhängt.

Unterwegs lernt ihr, was jede Datenanalyse braucht: wie man ein Experiment so
aufschreibt, dass man es auswerten kann, wie solche Daten in R als Vektoren
und als Tabelle aussehen und wie man mit wenigen Zeilen Code ein Experiment
beliebig oft durchführt.

## Das Spiel spielen {#play}

Wie sich das Spiel anfühlt, zeigt ein Ausschnitt aus der Sendung „Geh aufs
Ganze“ von 1994, der deutschen Fassung von „Let's Make a Deal“:
[[geh-aufs-ganze|Geh aufs Ganze: das Spiel im Fernsehen]]. Dort heißt der
Moderator Jörg Draeger, das Prinzip ist dasselbe.

Selbst spielen könnt ihr im [[monty-hall-game|Drei-Türen-Spiel]]. Es
schreibt jede Runde als R-Code mit, den ihr in der nächsten Phase braucht, und
behält die Runden in diesem Browser, bis ihr „Von vorn“ wählt.

### Challenge 1: Erst raten, dann spielen {#challenge-1}

Schreibt auf, bevor ihr die erste Runde spielt, was ihr erwartet: Gewinnt
man häufiger, wenn man bleibt, wenn man wechselt, oder ist es egal?

Spielt dann mindestens zehn Runden und entscheidet euch mal fürs Bleiben, mal
fürs Wechseln. Wer lieber am Tisch spielt: Zu zweit mit drei Bechern und
einer Münze geht es genauso, eine Person moderiert und weiß, wo die Münze
liegt. Notiert dann für jede Runde, wo der Gewinn lag, welchen Becher die
spielende Person zuerst gewählt hat, welchen die Moderation aufgedeckt hat
und ob gewechselt wurde.

## Runden als Vektoren {#vectors}

Eine Runde besteht aus vier Angaben: hinter welcher Tür das Auto stand,
welche Tür zuerst gewählt wurde, welche der Moderator geöffnet hat und ob die
Person geblieben ist oder gewechselt hat. Viele Runden lassen sich deshalb als
vier Vektoren aufschreiben, einer je Angabe, in denen die erste Stelle immer
zur ersten Runde gehört, die zweite zur zweiten und so weiter.
[[data-representation-slides|Die Folien]] zeigen an genau diesen vier
Angaben, wie R Vektoren und Tabellen hält, und reichen bis zur nächsten Phase.

Unten stehen zehn Beispielrunden. Ersetzt sie durch eure eigenen: Kopiert den
R-Code unter dem [[monty-hall-game|Drei-Türen-Spiel]] und fügt ihn statt der vier Zeilen ein.

### Challenge 2: Eure Runden in R {#challenge-2}

Beantwortet mit R, jede Frage mit einer Zeile unter den Vektoren:

1. Wie oft lag die erste Wahl schon richtig, als Anteil aller Runden?
2. Welche Runden wurden gewonnen? Legt dafür einen Vektor `won` mit `TRUE`
   oder `FALSE` an. Gewonnen hat, wer geblieben ist und gleich richtig lag,
   oder wer gewechselt hat und zuerst falsch lag.
3. Wie viel Prozent aller Runden wurden gewonnen?
4. In wie viel Prozent der Runden ist die Person geblieben?
5. Wie oft gewinnt, wer bleibt, und wie oft, wer wechselt?

```r
prize_door <- c(2, 1, 3, 3, 1, 2, 2, 3, 1, 1)
contestant_choice <- c(2, 3, 1, 1, 1, 1, 3, 2, 2, 1)
monty_opens <- c(1, 2, 2, 2, 3, 3, 1, 1, 3, 2)
decision <- c("stay", "switch", "stay", "switch", "switch", "stay", "switch", "stay", "switch", "stay")

length(prize_door)
```

> [!SOLUTION]
> ```r static
> mean(prize_door == contestant_choice)        # 1.: 0.3
>
> won <- (decision == "stay" & prize_door == contestant_choice) |
>   (decision == "switch" & prize_door != contestant_choice)
> mean(won)                                    # 3.: 0.6
> mean(decision == "stay")                     # 4.: 0.5
> mean(won[decision == "stay"])                # 5.: 0.4
> mean(won[decision == "switch"])              # 5.: 0.8
> ```
>
> `mean()` eines logischen Vektors ist der Anteil der `TRUE`, weil R `TRUE`
> als 1 und `FALSE` als 0 rechnet. `won[decision == "stay"]` wählt aus `won`
> nur die Stellen aus, an denen die Person geblieben ist. Zehn Runden sind
> allerdings zu wenig, um daraus etwas zu schließen; deshalb kommen als
> Nächstes mehr Daten.

## 100 Spiele als Tabelle {#data-frame}

Der Datensatz [[lets-make-a-deal]] enthält 100 Spiele mit genau den Angaben,
die ihr eben als Vektoren hattet, dazu den Vornamen der Person. In R liegen
sie als **Data Frame** vor: eine Tabelle, deren Spalten Vektoren gleicher
Länge sind und deren Zeilen je ein Spiel beschreiben. Die Spiele sind für
diese Übung erzeugt und stammen nicht aus einer Aufzeichnung der Sendung.

So lädt man die Datei; in den Kästen dieser Phase ist die Tabelle als
`monty_hall` schon geladen.

```r
monty_hall <- read.csv("lets_make_a_deal.csv")
head(monty_hall)
```

### Challenge 3: Erster Blick {#challenge-3}

Wie viele Zeilen und Spalten hat die Tabelle, und welchen Typ hat jede
Spalte?

```r
monty_hall
```

> [!SOLUTION]
> ```r
> str(monty_hall)
> ```
>
> `str()` zeigt alles auf einmal: 100 Zeilen (`obs.`), fünf Spalten
> (`variables`), drei davon ganze Zahlen (`int`) und zwei Text (`chr`).
> Einzeln liefern `nrow()`, `ncol()` und `class(monty_hall$decision)`
> dasselbe.

### Challenge 4: Spalten und Zeilen {#challenge-4}

Probiert jeden Zugriff in einem eigenen Lauf:

1. Holt die Spalte `prize_door` einmal mit `$` und einmal mit eckigen
   Klammern. Was ist der Unterschied zwischen `monty_hall[, "prize_door"]`
   und `monty_hall["prize_door"]`?
2. Wählt die Spalten `prize_door` und `decision` zusammen aus.
3. Zeigt die ersten zehn und die letzten zehn Zeilen.
4. Zeigt alle Spalten außer der letzten.
5. Sortiert die Tabelle nach `prize_door`, aufsteigend und absteigend.

```r
monty_hall$prize_door
```

> [!SOLUTION]
> ```r static
> monty_hall$prize_door                         # 1.: ein Vektor
> monty_hall[, "prize_door"]                    # 1.: ebenfalls ein Vektor
> monty_hall["prize_door"]                      # 1.: eine Tabelle mit einer Spalte
> monty_hall[, c("prize_door", "decision")]     # 2.
> monty_hall[1:10, ]                            # 3.: oder head(monty_hall, 10)
> monty_hall[91:100, ]                          # 3.: oder tail(monty_hall, 10)
> monty_hall[, -ncol(monty_hall)]               # 4.
> monty_hall[order(monty_hall$prize_door), ]    # 5.
> monty_hall[order(monty_hall$prize_door, decreasing = TRUE), ]
> ```
>
> In `tabelle[zeilen, spalten]` steht vor dem Komma, welche Zeilen, und
> dahinter, welche Spalten gemeint sind; bleibt eine Seite leer, gilt sie
> ganz. Eine einzelne Spalte mit Komma liefert einen Vektor, ohne Komma eine
> Tabelle. Eine negative Zahl lässt die Spalte weg.

### Challenge 5: Wer hat gewonnen? {#challenge-5}

1. Fügt der Tabelle eine Spalte `won` hinzu, nach derselben Regel wie in
   Challenge 2.
2. Legt eine neue Tabelle an, die nur die gewonnenen Spiele enthält. Wie
   viele davon wurden mit Wechseln gewonnen, wie viele mit Bleiben?
3. Wie oft gewinnt in diesen 100 Spielen, wer bleibt, und wie oft, wer wechselt?
4. Macht aus `decision` einen Faktor und seht euch seine Stufen an. Wozu ist
   das gut?

```r
monty_hall$won <- FALSE
head(monty_hall)
```

> [!SOLUTION]
> ```r
> monty_hall$won <- (monty_hall$decision == "stay" & monty_hall$prize_door == monty_hall$contestant_choice) |
>   (monty_hall$decision == "switch" & monty_hall$prize_door != monty_hall$contestant_choice)
>
> games_won <- monty_hall[monty_hall$won, ]
> table(games_won$decision)
> ```
>
> Von den 49 gewonnenen Spielen wurden 30 mit Bleiben und 19 mit Wechseln
> gewonnen. Das sieht nach einem Vorteil fürs Bleiben aus, ist aber eine
> Falle: Geblieben wurde in 74 Spielen, gewechselt nur in 26. Erst die
> Anteile sind vergleichbar, und die zeigen das Gegenteil:
>
> ```r static
> mean(monty_hall$won[monty_hall$decision == "stay"])     # 0.41
> mean(monty_hall$won[monty_hall$decision == "switch"])   # 0.73
> ```
>
> `factor(monty_hall$decision)` hat die Stufen `stay` und `switch`. Ein
> Faktor kennt alle erlaubten Werte; damit fallen Tippfehler auf, und
> Tabellen und Grafiken zeigen die Kategorien in einer festen Reihenfolge.

## Das Spiel in R nachbauen {#simulate}

Hundert Spiele sind ein Anfang, aber noch kein Beweis. R kann das Spiel
selbst spielen, so oft ihr wollt: Das Auto kommt hinter eine zufällige Tür,
die Person wählt eine zufällige Tür, und der Moderator öffnet eine Tür, die
weder gewählt ist noch das Auto verbirgt.

Für den Zufall gibt es `sample()`. `sample(1:3, 1)` zieht eine der Zahlen 1
bis 3. Eine Stolperstelle gibt es dabei, und zwar genau beim Moderator: Bleibt
ihm nur eine Tür, etwa Tür 3, dann zieht `sample(3, 1)` nicht die 3, sondern
eine Zahl aus `1:3`, weil R eine einzelne Zahl als „von 1 bis hier“ liest.

```r
sample(3, 1)
```

Sicher zieht man aus einem Vektor `doors` deshalb mit
`doors[sample(length(doors), 1)]`: Gezogen wird eine Stelle, nicht ein Wert.

### Challenge 6: Eine Runde {#challenge-6}

Schreibt eine Funktion `play_round()`, die eine Runde spielt. Sie bekommt
`"stay"` oder `"switch"` und gibt `TRUE` zurück, wenn die Runde gewonnen
ist. `setdiff(a, b)` liefert die Werte aus `a`, die nicht in `b` stehen;
damit findet ihr die Türen, die der Moderator öffnen darf, und die Tür, zu
der man wechselt.

```r
play_round <- function(decision) {
  doors <- 1:3
  prize_door <- sample(doors, 1)
  contestant_choice <- sample(doors, 1)
  # Welche Türen darf der Moderator öffnen, und welche öffnet er?
  # Welche Tür hat die Person am Ende?
  # Hat sie gewonnen?
  FALSE # ersetzt das durch euer Ergebnis
}

play_round("switch")
```

> [!SOLUTION]
> ```r
> play_round <- function(decision) {
>   doors <- 1:3
>   prize_door <- sample(doors, 1)
>   contestant_choice <- sample(doors, 1)
>   options <- setdiff(doors, c(prize_door, contestant_choice))
>   monty_opens <- options[sample(length(options), 1)]
>   if (decision == "switch") {
>     final_choice <- setdiff(doors, c(contestant_choice, monty_opens))
>   } else {
>     final_choice <- contestant_choice
>   }
>   final_choice == prize_door
> }
>
> play_round("switch")
> ```
>
> Lag die erste Wahl richtig, bleiben dem Moderator zwei Türen, sonst nur
> eine; genau dafür braucht es das sichere Ziehen von oben.

### Challenge 7: Zehntausend Runden {#challenge-7}

Spielt mit eurer Funktion 10.000 Runden mit Wechseln und 10.000 mit Bleiben.
Wie oft gewinnt jede Strategie? `replicate(n, ausdruck)` wertet einen
Ausdruck `n`-mal aus und sammelt die Ergebnisse in einem Vektor; eine
`for`-Schleife ginge auch, braucht aber mehr Zeilen.

```r
# Kopiert eure Funktion play_round() aus Challenge 6 hierher.
replicate(5, sample(1:3, 1))
```

> [!SOLUTION]
> ```r
> play_round <- function(decision) {
>   doors <- 1:3
>   prize_door <- sample(doors, 1)
>   contestant_choice <- sample(doors, 1)
>   options <- setdiff(doors, c(prize_door, contestant_choice))
>   monty_opens <- options[sample(length(options), 1)]
>   if (decision == "switch") {
>     final_choice <- setdiff(doors, c(contestant_choice, monty_opens))
>   } else {
>     final_choice <- contestant_choice
>   }
>   final_choice == prize_door
> }
>
> c(
>   stay = mean(replicate(10000, play_round("stay"))),
>   switch = mean(replicate(10000, play_round("switch")))
> )
> ```
>
> Bleiben gewinnt in etwa einem Drittel der Runden, Wechseln in etwa zwei
> Dritteln. Die Zahlen schwanken von Lauf zu Lauf ein wenig, bei 10.000
> Runden aber kaum noch.

## Jede Runde eine Zeile {#collect}

Eine Gewinnquote ist eine Zahl; wer später andere Fragen stellen will, etwa
ob die Tür des Autos eine Rolle spielt, braucht die einzelnen Runden. Die
Simulation soll deshalb dieselbe Art Tabelle liefern wie der Datensatz: eine
Zeile je Runde, eine Spalte je Angabe.

### Challenge 8: Die Simulation als Tabelle {#challenge-8}

Erzeugt 1.000 Runden auf einmal als Vektoren und fügt sie zu einem Data
Frame `simulation` mit den Spalten `prize_door`, `contestant_choice`,
`decision` und `won` zusammen. `sample(1:3, n, replace = TRUE)` zieht `n`
Türen auf einmal, und `ifelse()` entscheidet für jede Stelle eines Vektors
einzeln.

Überlegt dabei: Warum braucht ihr für `won` die Tür des Moderators gar
nicht?

```r
n <- 1000
prize_door <- sample(1:3, n, replace = TRUE)
head(prize_door)
```

> [!SOLUTION]
> ```r
> n <- 1000
> prize_door <- sample(1:3, n, replace = TRUE)
> contestant_choice <- sample(1:3, n, replace = TRUE)
> decision <- sample(c("stay", "switch"), n, replace = TRUE)
> won <- ifelse(decision == "stay", prize_door == contestant_choice, prize_door != contestant_choice)
>
> simulation <- data.frame(prize_door, contestant_choice, decision, won)
> head(simulation)
> ```
>
> Wer wechselt, landet immer auf der Tür, die weder gewählt noch geöffnet
> ist. Lag die erste Wahl falsch, ist das die Tür mit dem Auto, denn die
> andere falsche hat der Moderator ja geöffnet. Wechseln gewinnt also genau
> dann, wenn die erste Wahl falsch war, und das entscheidet sich, bevor der
> Moderator etwas öffnet.

### Challenge 9: Wie oft gewinnt wer? {#challenge-9}

Zählt in `simulation`, wie oft mit Bleiben und mit Wechseln gewonnen und
verloren wurde, und berechnet die beiden Gewinnquoten. Vergleicht sie mit
euren eigenen Runden und mit den 100 Spielen. Arbeitet dafür im Kasten von
Challenge 8 weiter, denn jeder Kasten beginnt ohne die Werte der anderen.

> [!SOLUTION]
> ```r
> n <- 1000
> prize_door <- sample(1:3, n, replace = TRUE)
> contestant_choice <- sample(1:3, n, replace = TRUE)
> decision <- sample(c("stay", "switch"), n, replace = TRUE)
> won <- ifelse(decision == "stay", prize_door == contestant_choice, prize_door != contestant_choice)
> simulation <- data.frame(prize_door, contestant_choice, decision, won)
>
> table(simulation$decision, simulation$won)
> ```
>
> `table()` mit zwei Vektoren zählt jede Kombination. Die Quoten liefern
> `mean(simulation$won[simulation$decision == "stay"])` und dasselbe mit
> `"switch"`: etwa 0,33 und 0,67. Die 100 Spiele liegen mit 0,41 und 0,73 nahe
> daran, eure zehn Runden vermutlich weiter weg; je weniger Runden, desto
> mehr Zufall steckt im Ergebnis.

## Auflösung {#resolve}

Drei Quellen sagen dasselbe: eure eigenen Runden (mit viel Zufall), die
100 Spiele und die Simulation. Wer wechselt, gewinnt doppelt so oft.

Der Grund steckt in der ersten Wahl. Sie trifft in einem von drei Fällen das
Auto, und genau dann gewinnt, wer bleibt. In den anderen zwei von drei Fällen
liegt das Auto hinter einer der beiden anderen Türen, und weil der Moderator
weiß, wo es steht, öffnet er die andere. Die Tür, zu der man wechseln kann,
ist dann immer die mit dem Auto. Das Wissen des Moderators macht den
Unterschied: Öffnete er zufällig eine Tür und manchmal die mit dem Auto,
wären die beiden übrigen Türen tatsächlich gleich gut.

### Challenge 10: Eine Grafik für die Antwort {#challenge-10}

Zeigt die Gewinnquote je Entscheidung in den 100 Spielen als Balkendiagramm. Mit
dplyr bekommt `monty_hall` die Spalte `won` und wird je Entscheidung
zusammengefasst; ggplot2 zeichnet daraus die Balken, Schicht für Schicht.

```r
monty_hall |>
  mutate(won = (decision == "stay") == (prize_door == contestant_choice))
```

> [!SOLUTION]
> ```r
> monty_hall |>
>   mutate(won = (decision == "stay") == (prize_door == contestant_choice)) |>
>   group_by(decision) |>
>   summarise(win_rate = mean(won)) |>
>   ggplot() +
>   aes(x = decision, y = win_rate) +
>   geom_col()
> ```
>
> `(decision == "stay") == (prize_door == contestant_choice)` ist eine
> kürzere Form der Regel: Gewonnen hat, wessen Entscheidung zur ersten Wahl
> passt, also bleiben bei richtiger und wechseln bei falscher.

### Challenge 11: Welche Art von Frage war das? {#challenge-11}

Ordnet eure Fragen den sechs Typen aus [[analytic-questions]] zu. „Wie oft
gewannen in den 100 Spielen die, die wechselten?“ ist deskriptiv: Sie beschreibt
nur die 100 Spiele. Welche Frage beantwortet die Simulation, und welche die
Erklärung oben, warum Wechseln besser ist?

> [!SOLUTION]
> Die Simulation verallgemeinert über die beobachteten Spiele hinaus: Sie
> sagt, was in sehr vielen Spielen nach diesen Regeln passiert, und ähnelt
> damit einer inferentiellen Frage. Die Erklärung über das Wissen des
> Moderators ist mechanistisch: Sie sagt, wie es zu dem Ergebnis kommt. Bei
> einem Glücksspiel mit festen Regeln lässt sich das ausnahmsweise ganz
> klären; bei echten Daten bleibt es meist bei den ersten Typen.

## Was ihr braucht

Für alles reicht ein Browser, denn das Spiel und R laufen auf den Seiten der
Plattform. Wer lieber am eigenen Rechner arbeitet, nimmt [[positron]] und lädt
den [[lets-make-a-deal|Datensatz]] herunter. Zum Nachlesen passen aus
[[hands-on-programming-with-r]] die Kapitel 5 bis 7 über Objekte, die
Schreibweise mit eckigen Klammern und das Ändern von Werten.
