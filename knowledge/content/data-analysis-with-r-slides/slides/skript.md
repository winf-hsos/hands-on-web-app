# Skript: data analysis with R in a nutshell

Sitzung 1 im Teil von Nicolas Meseth, „Praxis der Markt- und Gesellschaftsforschung“, 13:15 bis 16:30. Die Folien sind englisch, dieses Skript und die Sprechernotizen deutsch; das Skript folgt den Folien und übernimmt ihre Notizen. Die Folien rahmen, gearbeitet wird in Positron und OpenCode. Die Datengrafiken sind mit ggplot2 aus den echten Daten erzeugt, mit `figures/make_figures.R` im Folien-Design `figures/theme_stagekit.R`; auf jeder dieser Folien kopiert der Knopf oben rechts den Code dazu, und das Auge daneben zeigt ihn über der Folie. Folienverweise zählen Frames: Folien mit Aufbau und die Abfragen haben mehrere. Aller Code steht auch im Kursordner unter `course/modules/praxis-mgf/sessions/session-1.md`.

---

## Eröffnung (Frames 1 bis 9)

### Titel (Frame 1)

Sitzung 1 meines Teils. Heute wird es praktisch: einrichten, einmal den ganzen Weg von der Datei bis zur Abbildung gehen, im Schnelldurchlauf, und dann das Selbststudium bis Sitzung 2.

### Agenda (Frame 2)

Fünf Teile: Arbeitsumgebung, dann der Weg durch die Daten in drei Etappen (laden und sichten, transformieren, visualisieren), und zum Schluss das Selbststudium.

### Bild: before you build, you set up the workbench. (Frame 3)

Heute lernt ihr nicht R. Heute richten wir ein, womit ihr den Rest des Semesters arbeitet, und gehen einmal zusammen den ganzen Weg von der Datei bis zur Abbildung. Das eigentliche Lernen kommt danach, im eigenen Tempo.

### Abfrage: how are your Excel skills? (Frames 4 bis 5)

Handys raus, QR-Code scannen oder die Adresse aufrufen und den Code eintippen. Anonym, keine Anmeldung. Wer in Excel filtert, sortiert und Pivot-Tabellen baut, kennt die Hälfte von dem, was wir heute in R tun, nur unter anderem Namen. Bedienung: Beim Betreten öffnet sich die Frage, der nächste Schritt schließt sie und zeigt die Balken.

### Abfrage: how confident do you feel in R? (Frames 6 bis 7)

Wer „quite confident“ gesagt hat, setzt sich neben jemanden mit „never used it“. Das sind die Tandems für heute: Wer hängt, fragt erst den Nachbarn, dann mich. Bedienung: Beim Betreten öffnet sich die Frage, der nächste Schritt schließt sie und zeigt die Balken.

### Abfrage: how confident are you in visualising data? (Frames 8 bis 9)

Die dritte Frage. Die Antworten helfen mir im Teil Visualisieren: Wer bisher Diagramme in Excel gebaut hat, kennt die Formen; neu ist, dass die Art der Variable entscheidet, welche Form passt. Bedienung: Beim Betreten öffnet sich die Frage, der nächste Schritt schließt sie und zeigt die Balken.

## Teil 1: Arbeitsumgebung (Frames 10 bis 21)

### Zwei Fenster, ein Ordner (Frame 11)

Ihr öffnet denselben Ordner zweimal. In Positron schreibt und rechnet ihr. In OpenCode läuft euer Assistent; er kennt das Kursmaterial und hilft beim Einrichten, beim Code und bei Fehlermeldungen. Eure Arbeit gehört nach my-code, die Datensätze nach data; in diesem Modul kommen sie aus ILIAS. Was in course liegt, wird bei jedem Update ersetzt. Die Ordner heißen englisch, wie alles, was mit Code zu tun hat.

### Bis euer Assistent läuft (Frames 12 bis 15)

Das ist alles, was ihr von Hand macht: OpenCode Desktop installieren, den Kursordner holen, entpacken, in OpenCode öffnen, /onboarding tippen. Alles Weitere übernimmt der Assistent, auch Positron, R und Quarto.

### Bild: from here on, your assistant sets up the rest. (Frame 16)

Ab hier richtet der Assistent mit euch die Werkbank ein: Er sieht nach, was schon da ist, und sortiert den Rest ein.

### Was /onboarding tut (Frames 17 bis 19)

Ein paar kurze Fragen, zuerst nach eurem Modul. Dann sieht der Assistent nach, was schon da ist: Positron, R, Quarto. Wer im Kick-off schon installiert hat, ist hier schnell durch. Fehlt etwas, fragt er, ob er es selbst installieren soll, unter Windows mit winget, auf dem Mac mit Homebrew, oder ob ihr es lieber selbst macht und er Schritt für Schritt begleitet. Vor jeder Installation fragt er. Dann die Pakete, die Daten, und zum Schluss der Systemcheck, einschließlich eines Test-PDFs mit Quarto.

### Bild: your assistant keeps notes on your work. (Frame 20)

Beim Onboarding fragt er, in welchem Modul ihr seid: Derselbe Kursordner dient auch „Werkzeuge“ und dem Mastermodul „Empirisches Arbeiten“. Dazu Vorkenntnisse und Sprache. Später notiert er, woran ihr arbeitet und wo ihr hängt, damit ihr nicht jedes Mal von vorn erklärt. Die Notizen stehen in my-code/about-me.md: eure Datei, lesen, ändern, löschen erlaubt. Nichts Persönliches: keine Namen, keine Noten. Und alles, was er liest, geht an ein Sprachmodell auf einem Server; darum gehören Passwörter und Persönliches nicht in den Chat.

### Jetzt ihr (Frame 21)

Rund 40 Minuten. Alle richten ein, ich gehe herum. Wer fertig ist, hilft dem Tandem. Fertig ist, wer in Positron die drei Ordner sieht und my-code/session_1.R angelegt hat.

## Teil 2: Laden und sichten (Frames 22 bis 33)

### Explorative Datenanalyse (Frame 23)

So beschreiben Wickham und Kollegen in R for Data Science die explorative Datenanalyse: Daten importieren, aufräumen, dann der Kreis aus transformieren, visualisieren und modellieren, bis man die Daten versteht, und zum Schluss kommunizieren. Wir gehen den Weg heute in drei Etappen, und dieses Bild zeigt jeweils, wo wir sind. Jetzt: importieren, also laden und einen ersten Blick auf die Daten werfen. Das Aufräumen steckt bei uns im Transformieren. Modelle, also Tests und Regressionen, kommen aus dem statistischen Teil des Moduls bei Herrn Enneking. Kommunizieren mit Quarto ist Sitzung 2.

### Die Daten: eine CSV-Datei (Frames 24 bis 26)

Bevor wir laden: Was ist das für eine Datei? CSV heißt comma-separated values, und so sieht sie aus, wenn man sie in einem Texteditor öffnet: reiner Text, hier ein Ausschnitt, vier von 606 Spalten, die ersten drei Befragten. Die erste Zeile enthält die Spaltennamen. Jede weitere Zeile ist eine befragte Person. Das Komma trennt die Spalten, und NA steht für einen fehlenden Wert, hier bei der Kinderzahl: Die Frage wurde Menschen, die allein leben, gar nicht gestellt. read_csv() liest den Text und macht daraus eine Tabelle, ein tibble, mit einer Spalte je Name. Weil die Datei reiner Text ist, kann sie jedes Programm lesen, auch euer Assistent. Aufpassen bei Dateien aus einem deutschen Excel: Das trennt mit Semikolon und schreibt Dezimalzahlen mit Komma; dafür gibt es read_csv2(). Unsere Datei ist UTF-8 mit Kommas, read_csv() genügt ohne weitere Angaben.

### Laden (Frame 27)

Strg+Enter führt die Zeile aus. Die Meldungen nach library sind keine Fehler. Der Pfeil aus Kleiner-Zeichen und Minus gibt dem Ergebnis einen Namen. Namen im Code sind englisch: survey, nicht umfrage; das gilt ab jetzt für alles, was ihr benennt. Der Pfad beginnt mit data/, weil Positron den Kursordner geöffnet hat; das ist der Grund, warum ihr den ganzen Ordner öffnet und nicht nur eine Datei. Unten ein Tipp für andere Datensätze: clean_names() aus dem Paket janitor macht aus unordentlichen Spaltennamen mit Leerzeichen, Umlauten und Großbuchstaben saubere Namen in snake_case. Bei unserer Befragung aber nicht: Es würde 186 der 606 Namen ändern, aus Q002alter q002alter machen, und die aufbereitete Q004geschlecht kollidiert mit der rohen q004geschlecht und heißt danach q004geschlecht_2. Die Unterscheidung klein gleich roh, groß gleich aufbereitet wäre weg. Nicht blind aufräumen.

### Sichten (Frame 28)

glimpse() zeigt jede Spalte mit ihrem Datentyp und den ersten Werten: dbl für Zahlen, chr für Text. Eine Zeile ist eine befragte Person, eine Spalte eine Frage; 606 Spalten sind lang, scrollt einmal durch. Nach der Pipe beginnt eine neue Zeile, eingerückt, auch bei nur einem Schritt. Darunter klein, was außerdem hilft: nrow() und ncol() zählen Zeilen und Spalten, names() listet die Spaltennamen, summary() fasst jede Spalte zusammen, und skim() aus dem Paket skimr zeigt je Spalte fehlende Werte, Füllgrad, Mittelwert, Streuung und ein kleines Histogramm. Wie die Namen gebaut sind, zeigt die nächste Folie.

### 606 Spalten, ein System (Frame 29)

Der erste Buchstabe sagt, zu welchem Block die Frage gehört (Codebuch, Seite 4), und mit select(starts_with("Q002")) holt ihr euch einen Block heraus, hier die Altersspalten. Hier die sechs, die ihr am meisten braucht; im Codebuch stehen noch b für Bewertungen, u für Gesamturteile, w für Wissensfragen, und ac oder ax für die Varianten eines Experiments. Kleinbuchstaben sind so, wie die Antworten aus dem Befragungstool kamen, Großbuchstaben hat Herr Enneking aufbereitet. Das Codebuch ist die Studiendokumentation in data/.

### the pipe: the result becomes the first argument (Frames 30 bis 31)

Was die Pipe genau tut: Sie nimmt das Ergebnis dessen, was links von ihr steht, und setzt es als erstes Argument in die Funktion rechts ein. Das erste Argument fast jeder tidyverse-Funktion ist die Tabelle, mit der sie arbeitet. survey |> count(D044stadtf) ist also genau dasselbe wie count(survey, D044stadtf). Die Pipe ändert nicht, was gerechnet wird, nur wie man es schreibt.

### without and with the pipe (Frames 32 bis 33)

Dieselbe Rechnung zweimal: die Befragten ab 60, gezählt nach Wohnortgröße, sortiert nach Anzahl. Ohne Pipe verschachtelt man die Funktionen ineinander und muss von innen nach außen lesen: Wo fängt es an? Bei survey, ganz in der Mitte. Und welches Argument gehört zu welcher Funktion? Mit der Pipe steht jeder Schritt in seiner Zeile, in der Reihenfolge, in der er passiert: Nimm die Umfrage, und dann filtere, und dann zähle, und dann sortiere. Die dritte Möglichkeit, Zwischenergebnisse mit eigenen Namen, funktioniert auch, erzeugt aber lauter Objekte, die man nur einmal braucht. Nach jeder Pipe beginnt eine neue Zeile. Unten der Tastaturkürzel für die Pipe in Positron.

## Teil 3: Transformieren (Frames 34 bis 44)

### Explorative Datenanalyse (Frame 35)

Die Daten sind geladen. Jetzt transformieren: Zeilen und Spalten auswählen, neue Spalten berechnen, gruppieren und zusammenfassen, Codes in Namen verwandeln, Tabellen verbinden. Unter transform fasse ich fast alles zusammen, was zwischen Laden und Abbildung passiert.

### Zeilen oder Spalten (Frame 36)

filter() behält die Zeilen, die eine Bedingung erfüllen, hier alle ab 60. select() behält Spalten. Das ist die häufigste Verwechslung am Anfang. In Excel wäre filter() der Filter auf einer Spalte, select() das Ausblenden von Spalten.

### Neue Spalten (Frame 37)

mutate() rechnet eine neue Spalte aus, hier TRUE oder FALSE, für jede Zeile. In Excel wäre das eine neue Spalte mit einer Formel, die man nach unten zieht. Der Name sagt, was drinsteht: is_ für Ja/Nein. Die Präfixe stehen in den Konventionen im Kursordner.

### Gruppen (Frame 38)

group_by() teilt die Daten in Gruppen, summarise() macht aus jeder Gruppe eine Zeile, n() zählt die Personen, arrange() sortiert. In Excel ist das die Pivot-Tabelle. Schaut auf die Spalte n_respondents: Ein Mittelwert aus sieben Personen trägt weniger als einer aus 1.042. Und wer fehlt, fehlt oft, weil man ihn nicht gefragt hat. Diese Frage stellt ihr ab heute bei jeder Zahl, die R oder der Assistent ausrechnet; ein stilles na.rm = TRUE ist der häufigste Fehler von KI-Assistenten.

### Tipp: tidylog sagt, was jeder Schritt getan hat (Frame 39)

Ein Paket, das jede Transformation kommentiert: tidylog. Einmal nach dem tidyverse laden, dann meldet jedes filter, select, mutate, group_by und summarise in der Konsole, was es getan hat: wie viele Zeilen es entfernt hat, welche Spalten dazukamen, wie viele Gruppen es gibt. Hier: filter hat 2.042 Befragte entfernt, 73 Prozent, 769 bleiben. Das beantwortet die Frage von eben, über wen eine Zahl spricht, bei jedem Schritt von selbst. Gerade wenn der Assistent Code schreibt, ist das die schnellste Kontrolle. Die Reihenfolge ist wichtig: tidylog nach dem tidyverse laden, sonst überschreibt dplyr es wieder.

### Ausprobieren: die dplyr-Verben (Demonstrator) (Frame 40)

Sechs Befragte, damit man jede Zeile sieht; die Spalten sind Fragen aus unserer Befragung: Alter, Größe des Wohnorts (vereinfacht zu Stadt, Kleinstadt, Dorf) und Personen im Haushalt. Oben die Verben, darunter der Code, links die Tabelle vorher, rechts nachher. filter streicht Zeilen durch, select blendet Spalten aus, arrange sortiert, mutate hängt eine Spalte an, group_by färbt die Gruppen und summarise macht aus jeder Gruppe eine Zeile. Der letzte Knopf stellt summarise und mutate nebeneinander: dieselben Gruppen, derselbe Mittelwert, aber drei gegen sechs Zeilen.

### Zahlen ohne Bedeutung (Frame 41)

Zahlen ohne Codebuch bedeuten nichts. Auf Seite 7 der Studiendokumentation steht: alphabetisch nach den deutschen Namen. Also geben wir den Codes ihre Namen.

### Von Codes zu Namen (Frame 42)

Den Code tippt ihr nicht ab, dafür ist der Kopierknopf da. factor() macht aus den Zahlen 1 bis 16 eine Variable mit Kategorien: levels sagt, welche Codes es gibt und in welcher Reihenfolge, labels, wie sie heißen. Die Reihenfolge ist die des Codebuchs. Der Datensatz bekommt dadurch eine neue Spalte state; q003land bleibt, wie sie ist. Die Namen stehen englisch wie auf den Folien.

### Die Quoten aus dem Codebuch (Frame 43)

Neben den Codes steht im Codebuch die Quote: welcher Anteil der Befragten aus welchem Land kommen sollte, in Prozent, daher pct_quota. tibble() baut eine kleine Tabelle von Hand, mit denselben Namen wie in state.

### Verbinden (Frame 44)

Verbunden wird über die gemeinsame Spalte state. In Excel wäre das ein SVERWEIS. Die Namen der neuen Spalten sagen, was drinsteht: pct_ ist Prozent, diff_ eine Differenz, _pp heißt Prozentpunkte. Wie weit jedes Land von seiner Quote abweicht, zeigt gleich eine Abbildung.

## Teil 4: Visualisieren (Frames 45 bis 57)

### Explorative Datenanalyse (Frame 46)

Jetzt visualisieren. Welche Abbildung passt, hängt vor allem davon ab, was eine Variable misst; darum beginnen wir mit den Skalenniveaus.

### Welche Abbildung? Das Skalenniveau entscheidet (Frame 47)

Die vier Skalenniveaus aus Werkzeuge, Döring Kapitel 8.4. Nominal: Kategorien ohne Reihenfolge, das Bundesland. Ordinal: Kategorien mit Reihenfolge, die Größe des Wohnorts. Intervall: Zahlen mit gleichen Abständen, aber ohne echten Nullpunkt, das Geburtsjahr. Verhältnis: Zahlen mit Nullpunkt, das Alter; man kann sagen, doppelt so alt. In R werden Kategorien zu Faktoren, Zahlen zu dbl. Daraus folgt die Kennzahl und die Abbildung: Kategorien zählt man und zeigt Balken, Zahlen fasst man mit Mittelwert und Streuung zusammen und zeigt Histogramm oder Boxplot.

### Nominal: Balken, nach Häufigkeit (Frame 48)

ggplot() baut eine Abbildung in Schichten: welche Daten, welche Spalte auf welche Achse (aes), welche Form (geom_bar zählt selbst), welche Beschriftung (labs). Die Schichten verbindet das Plus, nicht die Pipe. Bundesländer sind nominal, also sortiert nach Häufigkeit: fct_infreq() stellt das häufigste nach vorn, fct_rev() dreht es, damit es oben steht. Die Beschriftungen sind für Menschen, nicht für R.

### Befragte je Bundesland (Frame 49)

Genau dieser Code, dazu nur das Folien-Design, das die Farben der Folien übernimmt. Oben rechts der Kopierknopf: Er kopiert den Code zur Abbildung. Nordrhein-Westfalen vorn, dann Niedersachsen, mehr als Bayern; warum, sehen wir gleich an der Quote.

### Als Text: alphabetisch (Frame 50)

Die Größe des Wohnorts, so wie die Spalte D044stadtf aus der Datei kommt, als Text: R sortiert alphabetisch. Das Dorf steht vorn, die Großstadt irgendwo in der Mitte, und die Reihenfolge von groß nach klein ist verloren. Die Größe des Wohnorts ist aber ordinal, ihre Kategorien haben eine Reihenfolge. Wie man sie R beibringt, zeigt die nächste Folie.

### Ordinal: ein Faktor behält die Reihenfolge (Frame 51)

Die Lösung: factor() mit levels legt die Reihenfolge fest, genau so, wie das Codebuch sie vorgibt. Die Werte schreibt ihr genau so, wie count() sie zeigt; ein Tippfehler macht aus einem Wert still ein NA. filter(!is.na()) lässt die sieben ohne Angabe weg, und das sagt man dazu.

### Als Faktor: in der Reihenfolge der Skala (Frame 52)

Als Faktor, von der Großstadt bis zum Dorf: Man sieht auf einen Blick, wie sich die Befragten verteilen. Bei einer ordinalen Variable sortiert man nicht nach Häufigkeit, sondern nach der Skala.

### Eine Zahl: das Histogramm (Frame 53)

Das Alter ist verhältnisskaliert, eine Zahl. Das Histogramm teilt sie in Klassen, hier je fünf Jahre (binwidth), und zählt, wie viele in jede fallen. Man sieht die Form der Verteilung: wo die meisten liegen, wie breit sie streut, ob es Ränder gibt. Die Befragung beginnt bei 18 und endet bei 80. Code über den Kopierknopf; probiert binwidth = 1 und 10.

### Eine Zahl je Gruppe: der Boxplot (Frame 54)

Ein Boxplot fasst eine Zahl je Gruppe zusammen: der Strich in der Box ist der Median, die Box die mittlere Hälfte, die Linien reichen bis zu den normalen Werten, Punkte darüber hinaus. Hier das Alter je Wohnortgröße, die Gruppen in der Reihenfolge der Skala, weil city_size ein Faktor ist. Was er verbirgt: wie viele Menschen in jeder Box stecken.

### Welche Abbildung für welche Frage? (Frame 55)

Die sechs Formen, die ihr für fast alles braucht. Balken für Mengen je Kategorie. Histogramm für die Verteilung einer Zahl. Boxplot für eine Zahl über Gruppen. Gestapelte Balken auf 100 Prozent für eine Kategorie über Gruppen, etwa den Bio-Anteil je Einkommensgruppe. Streudiagramm für zwei Zahlen. Liniendiagramm für eine Entwicklung über die Zeit. Die Frage entscheidet, nicht der Geschmack. Mehr bei Claus Wilke, die Seite steht in der Literatur im Kursordner.

### Zur Erinnerung: der Join (Frame 56)

Zur Erinnerung der Join aus dem Teil davor: respondents_by_state hat eine Zeile je Bundesland, mit der Zahl der Befragten, dem Anteil in der Stichprobe, der Quote und der Differenz in Prozentpunkten. Genau diese Differenz, diff_quota_pp, zeigt die nächste Abbildung.

### Stichprobe gegen Quote (Frame 57)

Die Tabelle aus dem Join, als Abbildung. Oben rechts neben dem Kopierknopf das Auge: Es zeigt den Code zur Abbildung über der Folie. geom_col() nimmt Werte, die schon ausgerechnet sind; geom_bar() zählt selbst. fct_reorder() sortiert die Länder nach ihrer Abweichung. Niedersachsen liegt gut vier Prozentpunkte über seiner Quote, Nordrhein-Westfalen gut drei darunter. Warum? Für das Spezialthema Regionalität wurden rund 200 Menschen aus Osnabrück zusätzlich befragt. Das steht in der Studiendokumentation auf Seite 3, nicht in der CSV. Für eure Berichte heißt das: Aussagen über „die Deutschen“ nur mit Vorsicht.

## Teil 5: Selbststudium (Frames 58 bis 66)

### Erst testen, dann lernen (Frame 59)

Ihr fangt mit dem Test an, nicht mit dem Lernen. Wer ihn besteht, geht direkt zur Abnahme mit /final-check. Wer nicht, sieht bei jeder Aufgabe, welches Kapitel der Übung dazu passt, arbeitet die Übung mit /self-study durch und macht dann den Test noch einmal. Am Ende steht bei allen dieselbe Abnahme.

### Eine Übung, fünf Kapitel (Frame 60)

Eine Übung statt vieler einzelner, am Datensatz, den ihr gerade kennengelernt habt, mit einer Leitfrage: Wo kaufen die Befragten ein, und wer kauft Bio? Jedes Kapitel ist eine R-Datei in my-code/self-study. Zu jeder Aufgabe steht, welchen Abschnitt aus R for Data Science ihr vorher lest, und bei vielen ein Kontrollwert, mit dem ihr euer Ergebnis selbst prüft. Kapitel 5 ist die Generalprobe für die Gruppenarbeit: eine Frage allein beantworten, bis zum Befund in drei Sätzen. Wer Werkzeuge im Sommer belegt hat, ist oft in ein, zwei Stunden durch; wer bei null anfängt, braucht zwölf bis vierzehn. Überblick: course/modules/praxis-mgf/self-study.md.

### So sieht eine Aufgabe aus (Frame 61)

Der Selbsttest liegt nach dem Onboarding in my-code/self-test. Elf Aufgaben, acht zum Schreiben, drei zum Lesen: vorgegebener Code, der fehlerfrei läuft und trotzdem etwas verschweigt. Jede Aufgabe prüft sich sofort selbst. Der Test hat keine Note und wird nicht eingesammelt.

### your assistant could solve this test for you. it cannot pass it for you. (Frame 62)

Euer Assistent ist so eingestellt, dass er keine Aufgabe des Selbsttests löst. Er erklärt euch aber jede Funktion, jede Fehlermeldung, rechnet eine ähnliche Aufgabe mit einer anderen Variable vor. Bei der Übung hilft er in Stufen: erst die Lesestelle, dann die Funktion, dann euer eigener Code; die Lösung erst, wenn ihr es selbst versucht habt. Wer ihn trotzdem austrickst oder ChatGPT fragt, belügt niemanden außer sich selbst und merkt es in Sitzung 2.

### Zwei Befehle (Frames 63 bis 64)

Zwei Befehle in OpenCode. /self-study: Der Assistent weiß, in welchem Kapitel ihr seid, zeigt die Lesestellen und hilft in Stufen. Wenn ihr „Kapitel 2 fertig“ sagt, führt er eure Datei aus, vergleicht mit den Kontrollwerten und stellt euch eine Frage zu eurem Code. /final-check: Er führt euren Selbsttest aus, und wenn alles stimmt, fragt er euch zu zwei, drei Stellen eures Codes, warum ihr es so gemacht habt, und lässt sich euren Befund aus Kapitel 5 erklären. Genau das wird in Referat und Bericht verlangt: die eigenen Zahlen erklären können.

### Euer Assistent (Frame 65)

Er erklärt, so oft ihr wollt, liest Fehlermeldungen, schreibt Code in kleinen Schritten und achtet darauf, dass ihr euch an die Standards des Kurses haltet: tidyverse, Pipe, ggplot2, englische Namen. Derselbe Satz wie im Kick-off, jetzt mit dem Werkzeug in der Hand. Schreibt euch auf, wo ihr ihn korrigiert habt; das KI-Protokoll kommt nach my-code/ai-log.md. Das braucht ihr später für den Methodenteil.

### Bild: in the end: explain your numbers. (Frame 66)

So soll es aussehen: Nicht der Assistent erklärt euch eure Abbildung, sondern ihr erklärt sie ihm. Was zeigt sie, über wen spricht die Zahl, was folgt daraus und was nicht? Genau das übt /final-check. Den Rest der Sitzung fangt ihr mit dem Selbsttest an, ich gehe herum. Bis Sitzung 2: Selbsttest, Übung, soweit ihr sie braucht, und /final-check. Sitzung 2 ist am 11. November; bis dahin ist genug Zeit, auch für die, die bei null anfangen. Wann genau, steht im Zeitplan in ILIAS.
