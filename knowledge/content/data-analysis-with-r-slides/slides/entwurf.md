# Entwurf: Input „Datenanalyse mit R“

**Status:** am 29.09.2026 abends nach Nicolas' Durchsicht umgebaut (Titel „in a nutshell“, fünf Teile: Arbeitsumgebung, laden und sichten, transformieren, visualisieren, Selbststudium; EDA-Prozess nach Wickham, Skalenniveaus und Faktoren, Abbildungstypen, ggplot-Abbildungen mit Kopierknopf, Bundesländer als Faktor statt Join der Codes, schlanker Demonstrator, zwei Bilder mit dem Assistenten, Excel-Abfrage statt Werkzeuge-Abfrage, Fehlermeldungen gestrichen). Maßgeblich sind `data-analysis-with-r-in-a-nutshell.html` (umbenannt am 30.09.2026 nach dem Titel) und `skript.md`, nicht dieser Entwurf. Frühere Stände: zum Bau freigegeben am 29.09.2026; am selben Tag ergänzt um die Folie „what /onboarding does“ (Positron, R und Quarto über den Assistenten), die Übung in fünf Kapiteln statt der vier Stufen, die Folie „two commands“ (/self-study, /final-check) und die Abnahme im Ablaufbild. Die HTML-Datei ist seitdem die Quelle, dieser Entwurf ist nicht nachgeführt, gebaut als `datenanalyse-mit-r.html` (34 Folien, 42 Frames). Abweichungen beim Bau: Folie 18 in zwei Folien geteilt (Neue Spalten, Gruppen), Folie 21 in zwei (Tabelle aus dem Codebuch, Verbinden), damit jeder Code ungekürzt und kopierfertig auf die Folie passt; die Kette des Durchstichs erscheint einmal statt als wiederkehrender Wegweiser. Offene Punkte entschieden: Live-Abfragen über lifi.uber.space (Modul praxis-mgf), eigenes Schlussfoto, Selbsttest bis Sitzung 2 am 11.11.
**Verortung:** Sitzung 1 am 30.09.2026, F2 im [Modulkonzept Praxis](../../../../03%20-%20Module%20pro%20Semester/Werkzeuge%20und%20Praxis%20der%20Markt-%20und%20Gesellschaftsforschung/Modulkonzept%20Praxis.md) („Arbeitsumgebung: R und Positron“). Wiederkehrend, also kein Datum auf der Titelfolie.
**Dauer:** die ganze Sitzung, 13:15 bis 16:30. Die Folien rahmen, gearbeitet wird in Positron und OpenCode. Rund 30 Folien, davon ein Drittel Code zum Mittippen (jeder Codeblock hat einen Kopierknopf).
**Kernbotschaft:** Heute wird die Werkbank eingerichtet. Wer rausgeht, hat ein laufendes Setup, ist einmal den ganzen Weg von der Datei bis zur Abbildung gegangen und weiß, was bis Sitzung 2 zu tun ist.
**Material dazu:** Kursordner `data-analytics-courses` (Repository, lokal unter `C:\code\data-analytics-courses`), dort `course/modules/praxis-mgf/sessions/session-1.md` mit allem Code der Folien.

| Symbol | Bedeutung |
|---|---|
| 🎬 | Abschnittsfolie |
| 📷 | Foto |
| 🖼️ | Zeichnung |
| 📊 | Vergleich |
| 💬 | Merksatz |
| ⌨️ | Code |
| 🪜 | Aufbau in Schritten |
| 🧪 | Live-Moment |
| 🗳️ | Live-Abfrage |

## Ablauf der Sitzung

| Zeit | Teil | Folien |
|---|---|---|
| 13:15 | Eröffnung, zwei Abfragen, Tandems bilden | 1 bis 5 |
| 13:25 | **Arbeitsumgebung:** OpenCode, Kursordner, `/onboarding`, Positron, Daten | 6 bis 10 |
| 14:10 | **Auffrischung, erster Teil:** laden, ansehen, Pipe, filter, select, mutate, group_by | 11 bis 19 |
| 15:00 | Pause | |
| 15:15 | **Auffrischung, zweiter Teil:** Join, Abbildung, Fehlermeldungen | 20 bis 25 |
| 15:45 | **Selbststudium:** Selbsttest, Stufen, was der Assistent tut und was nicht | 26 bis 30 |
| 16:00 | Alle fangen mit dem Selbsttest an, ich gehe herum | 31 |

Puffer: Die Einrichtung dauert erfahrungsgemäß länger als geplant. Wird es eng, fällt Folie 25 (Fehlermeldungen) auf eine Minute zusammen, und der Join (20 bis 22) wird gezeigt statt getippt.

# Die Folien

## Teil 0: Eröffnung (5 Folien)

### Folie 1
**Titel:** `Datenanalyse mit R`
**Untertitel:** `Praxis der Markt- und Gesellschaftsforschung · Sitzung 1 · Prof. Dr. Nicolas Meseth`

### Folie 2
Agenda, automatisch: `Arbeitsumgebung` · `Auffrischung` · `Selbststudium`

### Folie 3 📷
**Bild:** Eine aufgeräumte Holzwerkbank im Streiflicht von links, schwarzer Hintergrund. An der Wand dahinter hängt Werkzeug ordentlich an einer Lochwand, auf der Platte liegt ein aufgeklappter Laptop, daneben ein Stapel Fragebögen und ein Bleistift. Warmes, gerichtetes Licht, kein Mensch im Bild, das Motiv rechts, links viel Dunkel für den Text.
**Text:** `Bevor man baut,` / `richtet man die Werkbank ein.`
**Dazu sagen.** Heute lernt ihr nicht R. Heute richten wir ein, womit ihr den Rest des Semesters arbeitet, und gehen einmal zusammen den ganzen Weg von der Datei bis zur Abbildung. Das eigentliche Lernen kommt danach, im eigenen Tempo.

### Folie 4 🗳️
**Abfrage:** `Habt ihr im Sommer „Werkzeuge der Markt- und Gesellschaftsforschung“ belegt?`
Antworten: `ja` · `nein`
**Dazu sagen.** Keine Wertung, ich brauche das für die Sitzordnung.

### Folie 5 🗳️
**Abfrage:** `Wie sicher fühlt ihr euch in R?`
Antworten: `noch nie benutzt` · `ein bisschen` · `ziemlich sicher`
**Dazu sagen.** Wer „ziemlich sicher“ gesagt hat, setzt sich neben jemanden mit „noch nie“. Das sind die Tandems für heute: Wer hängt, fragt erst den Nachbarn, dann mich.

## Teil 1: Arbeitsumgebung (5 Folien)

### Folie 6 🎬
`Arbeitsumgebung`

### Folie 7 🖼️
**Titel klein:** `zwei Fenster, ein Ordner`
**Zeichnung:** In der Mitte ein Ordner `data-analytics-courses` mit drei Unterordnern untereinander: `my-code` (weiß, „euer Ordner“), `data` (weiß, „aus ILIAS“), `course` (grau, „Material, nicht ändern“). Links ein Kasten `Positron` mit „hier arbeitet ihr“, rechts ein Kasten `OpenCode` mit „euer Assistent“; beide mit einem Pfeil auf den Ordner.
**Dazu sagen.** Ihr öffnet denselben Ordner zweimal. In Positron schreibt und rechnet ihr. In OpenCode läuft euer Assistent; er kennt das Kursmaterial und hilft beim Einrichten, beim Code und bei Fehlermeldungen. Eure Arbeit gehört nach `my-code`, die Daten nach `data`. Was in `course` liegt, wird bei jedem Update ersetzt. Die Ordner heißen englisch, wie alles, was mit Code zu tun hat.

### Folie 8 🪜
**Titel klein:** `bis euer Assistent läuft`
**Text**, vier Zeilen im Raster wie im Kick-off, links der Schritt, rechts der Verweis in Blau oder Codeschrift:
1. `OpenCode installieren` · `opencode.ai/download`
2. `Kursordner herunterladen` · `github.com/winf-hsos/data-analytics-courses`
3. `entpacken und in OpenCode öffnen` · `Add project`
4. `eintippen` · `/onboarding`

**Sidenote:** `Windows: Rechtsklick, „Alle extrahieren“. Ein Doppelklick auf die ZIP entpackt nichts.`
**Dazu sagen.** Das ist alles, was ihr von Hand macht. Ab `/onboarding` übernimmt der Assistent: ein paar kurze Fragen, zuerst nach eurem Modul, dann prüft er R, installiert fehlende Pakete, schickt euch zu Positron und zu den Daten und lässt zum Schluss den Systemcheck laufen, den ihr vom Kick-off kennt. Vor jeder Installation fragt er.

### Folie 9 💬
**Statement:** `Euer Assistent merkt sich, woran ihr arbeitet.`
**Sidenote:** `in my-code/about-me.md: eure Datei, lesen, ändern, löschen erlaubt.`
**Dazu sagen.** Beim Onboarding fragt er, in welchem Modul ihr seid: Derselbe Kursordner dient auch „Werkzeuge“ und dem Mastermodul „Empirisches Arbeiten“. Dazu Vorkenntnisse und Sprache. Später notiert er, woran ihr arbeitet und wo ihr hängt, damit ihr nicht jedes Mal von vorn erklärt. Nichts Persönliches: keine Namen, keine Noten. Und alles, was er liest, geht an ein Sprachmodell auf einem Server; darum gehören Passwörter und Persönliches nicht in den Chat.

### Folie 10 🧪
**Titel klein:** `jetzt ihr`
**Text:** `OpenCode · Kursordner · /onboarding` / `Positron: File > Open Folder` / `Daten aus ILIAS nach data/`
**Sidenote:** `Fertig, wenn in Positron links my-code, data und course stehen.`
**Live-Moment:** Rund 40 Minuten. Alle richten ein, ich gehe herum. Wer fertig ist, hilft dem Tandem. Fertig ist, wer in Positron die drei Ordner sieht und `my-code/session_1.R` angelegt hat.

## Teil 2: Auffrischung (15 Folien)

### Folie 11 🎬
`Auffrischung`

### Folie 12 🖼️ 🪜
**Titel klein:** `der Durchstich`
**Zeichnung:** Eine Kette aus sechs Kästen, verbunden mit Pfeilen: `laden` → `ansehen` → `umformen` → `zusammenfassen` → `verbinden` → `zeichnen`. Darunter je die Funktion in Codeschrift: `read_csv()`, `glimpse()`, `filter()` `mutate()`, `summarise()`, `left_join()`, `ggplot()`. Dieselbe Zeichnung kehrt als Wegweiser wieder (Folien 14, 20, 23): der aktuelle Kasten gelb, die erledigten weiß, die kommenden grau.
**Dazu sagen.** Das ist die ganze Kette, die ihr für eure Auswertung braucht. Heute gehen wir sie einmal von vorn bis hinten, jeder Schritt klein. Es kommt nicht darauf an, dass ihr ihn auswendig könnt, sondern dass ihr ihn lesen könnt.

### Folie 13 ⌨️
**Titel klein:** `laden`
**Code:**
```r
library(tidyverse)
survey <- read_csv("data/mds12_schoko_milch.csv")
```
**Sidenote:** `<- gibt dem Ergebnis einen Namen. Ab jetzt steht survey rechts im Variablenfenster.`
**Dazu sagen.** Strg+Enter führt die Zeile aus. Die Meldungen nach `library` sind keine Fehler. Namen im Code sind englisch: `survey`, nicht `umfrage`; das gilt ab jetzt für alles, was ihr benennt. Der Pfad beginnt mit `data/`, weil Positron den Kursordner geöffnet hat; das ist der Grund, warum ihr den ganzen Ordner öffnet und nicht nur eine Datei.

### Folie 14 ⌨️
**Titel klein:** `ansehen`
**Code:**
```r
nrow(survey)
ncol(survey)
survey |> select(starts_with("Q002")) |> glimpse()
```
**Sidenote:** `2.811 Befragte, 813 Variablen. Zu viel zum Ansehen, also auswählen.`

### Folie 15 🖼️
**Titel klein:** `813 Spalten, ein System`
**Zeichnung links:** die Präfixe als kleine Tabelle: `q` Screening · `v` Verhalten · `p` Einstellungen · `d` Demographie · `m` Milch · `s` Schokolade.
**Zeichnung rechts:** die Kette am Alter, von oben nach unten: `q002geburt` → `Q002alter` → `Q002altergru4` → `Q002altergru4f`, daneben grau: „roh“, „berechnet“, „gruppiert“, „als Text“.
**Punch:** `klein = roh, groß = aufbereitet, f = als Text`
**Dazu sagen.** Der erste Buchstabe sagt, zu welchem Block die Frage gehört, und mit `starts_with()` holt ihr euch einen Block heraus. Kleinbuchstaben sind so, wie die Antworten aus dem Befragungstool kamen, Großbuchstaben hat Herr Enneking aufbereitet. Das Codebuch dazu ist die Studiendokumentation in `data/`.

### Folie 16 ⌨️
**Titel klein:** `die Pipe: „und dann“`
**Code:**
```r
survey |> count(D044stadtf, sort = TRUE)
```
**Sidenote:** `Nimm die Umfrage, und dann zähle nach Wohnortgröße.`
**Dazu sagen.** Ab jetzt lest ihr jedes `|>` als „und dann“. `NA` heißt fehlend: sieben Personen ohne Angabe.

### Folie 17 ⌨️ 📊
**Titel klein:** `Zeilen oder Spalten`
**Code** zweimal nebeneinander:
```r
survey |>
  filter(Q002alter >= 60) |>
  count(D044stadtf)
```
```r
survey |>
  select(Q002alter, D044stadtf) |>
  glimpse()
```
**Beschriftung darunter:** `filter() behält Zeilen` · `select() behält Spalten`
**Dazu sagen.** Das ist die häufigste Verwechslung am Anfang.

### Folie 18 ⌨️
**Titel klein:** `neue Spalten, Gruppen`
**Code:**
```r
survey |>
  mutate(is_60_plus = Q002alter >= 60) |>
  count(is_60_plus)

survey |>
  group_by(D044stadtf) |>
  summarise(mean_age = mean(Q002alter), n_respondents = n()) |>
  arrange(mean_age)
```
**Dazu sagen.** `mutate()` rechnet eine Spalte aus, `group_by()` und `summarise()` machen aus jeder Gruppe eine Zeile. Schaut auf die Spalte `n_respondents`. Die Präfixe sagen, was drinsteht: `is_` ja/nein, `mean_` Mittelwert, `n_` Anzahl.

### Folie 19 💬
**Statement:** `Über wen spricht diese Zahl?`
**Sidenote:** `Ein Mittelwert aus 7 Personen trägt weniger als einer aus 1.042. Und wer fehlt, fehlt oft, weil man ihn nicht gefragt hat.`
**Dazu sagen.** Diese Frage stellt ihr ab heute bei jeder Zahl, die R oder der Assistent ausrechnet. Sie ist der häufigste Fehler von KI-Assistenten: ein stilles `na.rm = TRUE`, und die Zahl gilt plötzlich nur noch für einen Teil der Befragten. Im Selbsttest kommt sie zweimal vor.

### Folie 20 ⌨️
**Titel klein:** `Zahlen ohne Bedeutung`
**Code:**
```r
survey |> count(q003land)
```
**Sidenote:** `Bundesland 1 bis 16. Welches ist welches? Das steht nicht in den Daten, sondern im Codebuch, S. 7.`

### Folie 21 ⌨️
**Titel klein:** `verbinden`
**Code:** die Tabelle `states` mit Namen und Quoten und der `left_join()` zu `respondents_by_state` (wie in `course/modules/praxis-mgf/sessions/session-1.md`, Abschnitt 8)
**Dazu sagen.** Den Code tippt ihr nicht ab, dafür ist der Kopierknopf da. Worum es geht: `left_join()` hängt an jede Zeile links die passende Zeile rechts an, verbunden über die gemeinsame Spalte.

### Folie 22 📊 🖼️
**Titel klein:** `Anteil gegen Quote`
**Zeichnung:** waagerechte Balken je Bundesland, Abweichung von der Quote in Prozentpunkten, sortiert. Niedersachsen ragt mit +4,4 nach rechts heraus (gelb), Nordrhein-Westfalen mit −3,3 nach links; die übrigen grau und klein.
**Punch:** `Wie die Daten entstanden sind, steht nicht in den Daten.`
**Dazu sagen.** Warum Niedersachsen? Für das Spezialthema Regionalität wurden rund 200 Menschen aus Osnabrück zusätzlich befragt. Das steht in der Studiendokumentation auf Seite 3, nicht in der CSV. Für eure Berichte heißt das: Aussagen über „die Deutschen“ nur mit Vorsicht.

### Folie 23 ⌨️
**Titel klein:** `zeichnen`
**Code:**
```r
survey |>
  filter(!is.na(D044stadtf)) |>
  ggplot(aes(x = fct_infreq(D044stadtf))) +
  geom_bar() +
  labs(x = "Größe des Wohnorts", y = "Anzahl Befragte")
```
**Sidenote:** `in ggplot() verbindet + die Schichten, nicht |>`

### Folie 24 🖼️
**Titel klein:** `das Ergebnis`
**Zeichnung:** das Balkendiagramm aus Folie 23, nachgezeichnet mit den echten Zahlen (Großstadt 1.042, Große Kleinstadt 595, Dorf 388, Große Mittelstadt 328, Kleinstadt >5000 263, Kleinstadt <5000 188), Achsen beschriftet wie im Code.
**Dazu sagen.** Achsen mit Wörtern, die ein Mensch versteht, nicht mit Variablennamen. Das ist die Regel für jede Abbildung im Bericht.

### Folie 25 📊
**Titel klein:** `die drei häufigsten Fehlermeldungen`
**Text**, drei Zeilen, links die Meldung in Codeschrift, rechts die Ursache:
- `could not find function` · `library(tidyverse) fehlt`
- `object '…' not found` · `nicht erzeugt oder falsch geschrieben: q002alter ≠ Q002alter`
- `does not exist in current working directory` · `Positron hat nicht den Kursordner geöffnet`

**Dazu sagen.** Lest die Meldung ganz, bevor ihr etwas ändert. Und wenn es keine der drei ist: die ganze Meldung in den Assistenten, erklären lassen, selbst beheben.

## Teil 3: Selbststudium (7 Folien)

### Folie 26 🎬
`Selbststudium`

### Folie 27 🖼️
**Titel klein:** `erst testen, dann lernen`
**Zeichnung:** `Selbsttest` → Raute `bestanden?` → rechts `ja: fertig` (grüner Rahmen mit Haken) · unten `nein: die Stufe, an der es hakt` → zurück zu `Selbsttest`.
**Dazu sagen.** Ihr fangt mit dem Test an, nicht mit dem Lernen. Wer ihn besteht, ist fertig. Wer nicht, sieht bei jeder Aufgabe, wo er nacharbeiten kann.

### Folie 28 📊
**Titel klein:** `vier Stufen`
**Text** als Tabelle: `0 Arbeitsumgebung · 0,5 h` / `1 laden und ansehen · 3 h` / `2 umformen · 3 h` / `3 Abbildungen · 2 h`
**Sidenote:** `Wer im Sommer dabei war: 1 bis 2 Stunden. Wer bei null anfängt: 8 bis 10.`

### Folie 29 ⌨️
**Titel klein:** `so sieht eine Aufgabe aus`
**Code:**
```r
# Aufgabe 6: Wie viel Prozent der Befragten kaufen beim Discounter ein?
answer_6 <- NULL   # replace NULL with your code

check_answer(6, answer_6)
```
**Ausgabe darunter** (Codeschrift, grau): `Aufgabe 6 (Anteile bei Mehrfachantworten): noch nicht.` / `Tipp: Die Basis sind die Befragten, nicht die Nennungen.`
**Dazu sagen.** Elf Aufgaben, acht zum Schreiben, drei zum Lesen: vorgegebener Code, der fehlerfrei läuft und trotzdem etwas verschweigt. Jede Aufgabe prüft sich sofort selbst. Der Test hat keine Note und wird nicht eingesammelt.

### Folie 30 💬
**Statement:** `Der Assistent kann diesen Test für euch lösen.` / `Er kann ihn nicht für euch bestehen.`
**Dazu sagen.** Euer Assistent ist so eingestellt, dass er keine Aufgabe des Selbsttests löst. Er erklärt euch aber jede Funktion, jede Fehlermeldung, rechnet eine ähnliche Aufgabe mit einer anderen Variable vor. Wer ihn trotzdem austrickst oder ChatGPT fragt, belügt niemanden außer sich selbst und merkt es in Sitzung 2.

### Folie 31 📊
**Titel klein:** `euer Assistent`
**Zwei Spalten:** links `tut` (grüner Rahmen): `erklärt, so oft ihr wollt` · `liest Fehlermeldungen` · `schreibt Code in kleinen Schritten` · `tidyverse, |>, ggplot2, englische Namen`; rechts `tut nicht` (roter Rahmen): `löst den Selbsttest` · `entscheidet, was ihr untersucht` · `verantwortet das Ergebnis`
**Punch:** `Der Agent kann Code schreiben. Ihr entscheidet das Was und verantwortet das Ergebnis.`
**Dazu sagen.** Derselbe Satz wie im Kick-off, jetzt mit dem Werkzeug in der Hand. Schreibt euch auf, wo ihr ihn korrigiert habt; das KI-Protokoll kommt nach `my-code/ai-log.md`. Das braucht ihr später für den Methodenteil.

### Folie 32 📷
**Bild:** dieselbe Werkbank wie in Folie 3, jetzt mit Arbeit darauf: neben dem Laptop ein ausgedrucktes Balkendiagramm, der Bleistift liegt quer darüber, eine Schreibtischlampe brennt. Gleiches Licht, gleicher Blickwinkel.
**Text:** `Bis Sitzung 2:` / `Selbsttest bestehen.`
**Dazu sagen.** Den Rest der Sitzung fangt ihr mit dem Selbsttest an, ich gehe herum. Sitzung 2 ist am 11. November; bis dahin ist genug Zeit, auch für die, die bei null anfangen. Wann genau, steht im Zeitplan in ILIAS.

---

## Offene Punkte zur Freigabe

1. **Live-Abfragen (Folien 4 und 5):** über deinen Abfrage-Server `https://lifi.uber.space` wie im LiFi-Deck? Sonst werden daraus Handzeichen-Folien.
2. **Zweites Foto für den Schluss (Folie 32)** oder dasselbe wie in der Eröffnung?
3. **Die Lage von Sitzung 2:** Zwischen morgen und dem 11.11. liegen sechs Wochen, und Herr Enneking frischt schon am 07.10. die Statistik auf. Soll der Selbsttest bis zum 07.10. bestanden sein, damit alle bei ihm mitkommen? Dann ändere ich Folie 32, `JETZT.md` und die Selbststudiumsseite.
