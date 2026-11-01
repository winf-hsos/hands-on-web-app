---
type: lesson
code: 3818
title: Die Grundideen des Programmierens
summary: >-
  Bevor du eine Zeile Python schreibst: was ein Programm ist und welche
  wenigen Bausteine in jeder Programmiersprache wiederkehren, erklärt mit
  Bildern aus dem Alltag statt mit Code.
objectives:
  intro: "Diese Lektion stellt dir die Bausteine vor, aus denen jedes Programm besteht, ganz ohne Code, und danach kannst du:"
  goals:
    - "erklären, warum ein Programm eine Folge genauer Anweisungen ist, die der Computer wörtlich nimmt"
    - "an einem Beispiel aus dem Alltag Eingabe, Verarbeitung und Ausgabe unterscheiden"
    - "beschreiben, was eine Variable ist und was passiert, wenn sie einen neuen Wert bekommt"
    - "Verzweigungen und Schleifen an Alltagsbeispielen erkennen und erklären, wann eine Schleife endet"
    - "erklären, wozu eine Funktion dient und was ihre Parameter und ihr Rückgabewert sind"
level: 1
duration: 15
topics: [solving-problems, processing-information, programming-with-python]
modules: [dup]
relations:
  see_also: [problem-decomposition]
status: published
updated: 2026-11-01
---

Ein Computer rechnet schneller als jeder Mensch und wird dabei nie müde, aber
er versteht nichts von selbst: Er befolgt Anweisungen, und zwar genau die,
die dastehen. Programmieren heißt deshalb, eine Aufgabe so genau zu
beschreiben, dass jemand sie erledigen kann, der nicht mitdenkt und nicht
nachfragt. Dafür gibt es eine Handvoll Grundideen, die in jeder
Programmiersprache wiederkehren. Diese Lektion stellt sie ohne eine Zeile
Code vor, mit Bildern aus dem Alltag, und die Lektionen danach zeigen dir,
wie jede davon in Python aussieht.

## Ein Programm ist ein Rezept

Ein Rezept ist eine Folge von Schritten in einer festen Reihenfolge: erst die
Butter schmelzen, dann den Zucker einrühren, dann die Eier. Ein Programm ist
genauso aufgebaut, nur dass der Koch ein Computer ist, der jeden Schritt
wörtlich nimmt. Steht im Rezept „Butter aufs Brot“, legt er dir das ganze
Päckchen darauf; „eine Prise Salz“ ist ihm zu ungenau, und ein vergessener
Schritt fällt ihm nicht auf. Eine solche genaue Schrittfolge, die eine
Aufgabe sicher löst, nennt man **Algorithmus**, und ein Programm ist ein
Algorithmus, aufgeschrieben in einer Sprache, die der Computer lesen kann.

Daraus folgt die wichtigste Gewohnheit beim Programmieren: Wenn ein Programm
etwas anderes macht, als du willst, hat der Computer fast nie einen Fehler
gemacht. Er hat ausgeführt, was dasteht, und die Frage ist, was du anders
aufschreiben musst.

## Eingabe, Verarbeitung, Ausgabe

Denk an einen Pfandautomaten im Supermarkt. Du steckst Flaschen hinein, das
ist die **Eingabe**. Der Automat erkennt jede Flasche und zählt das Pfand
zusammen, das ist die **Verarbeitung**. Am Ende druckt er einen Bon, das ist
die **Ausgabe**. Fast jedes Programm folgt diesem Muster: Es bekommt etwas,
etwa eine Zahl, die du eintippst, oder eine Datei, macht etwas damit und gibt
ein Ergebnis zurück, auf dem Bildschirm, in einer Datei oder als Signal an
ein Gerät.

## Variablen: Behälter mit Aufkleber

Ein Programm muss sich Dinge merken: deinen Namen, einen Zwischenstand, die
Anzahl der Flaschen. Dafür gibt es **Variablen**. Stell dir eine Variable als
Behälter vor, auf dem ein Aufkleber mit einem Namen klebt. Im Behälter liegt
ein Wert, und über den Namen auf dem Aufkleber findet das Programm ihn
wieder, wann immer es ihn braucht.

![Drei Behälter mit je einem blauen Aufkleber: vorname mit dem Text Anna, alter mit der Zahl 19 und punkte mit der Zahl 0.](figure:containers "Jeder Behälter trägt einen Namen und enthält genau einen Wert.")

Zu diesem Bild gehören drei Dinge. Ein Behälter enthält **immer genau einen Wert**:
Legst du einen neuen hinein, ist der alte weg, ohne dass er irgendwo
aufgehoben wird. Der neue Wert darf **aus dem alten berechnet** werden: Die
Variable `punkte` funktioniert wie die Anzeigetafel im Stadion, die bei jedem
Tor nachsieht, was sie gerade zeigt, und eins mehr anschreibt. Und der Name
auf dem Aufkleber ist **für Menschen** gedacht: Dem Computer ist es gleich,
ob ein Behälter `alter` oder `x` heißt, aber wer dein Programm liest, auch du
selbst in drei Wochen, versteht `alter` sofort.

Was in einem Behälter liegt, kann von verschiedener Art sein: eine Zahl, ein
Text oder eine Antwort wie ja oder nein. Die Art entscheidet, was man mit dem
Wert anfangen kann. Zwei Zahlen kann man addieren, zwei Texte kann man nur
aneinanderhängen, so wie man Mehl abwiegen, aber nicht zählen kann, während
man Eier zählt.

## Listen: ein Zug mit nummerierten Wagen

Manchmal ist es nicht ein Wert, sondern eine ganze Reihe: alle Einkäufe, alle
Messwerte eines Tages, alle Namen einer Gruppe. Dafür gibt es **Listen**. Eine
Liste ist wie ein Zug: Jeder Wagen trägt einen Wert, die Wagen stehen in
fester Reihenfolge und sind durchnummeriert, und man kann hinten einen
anhängen oder einen abkoppeln. Über die Nummer kommst du an einen bestimmten
Wagen. Viele Sprachen, auch Python, fangen dabei mit 0 an zu zählen, so dass
der erste Wagen die Nummer 0 trägt.

## Verzweigungen: der Türsteher

Ein Programm muss oft entscheiden, was als Nächstes geschieht. Denk an einen
Türsteher vor einem Club: Er stellt bei jedem Gast dieselbe Frage, nämlich ob
er mindestens 18 ist, und je nach Antwort lässt er ihn hinein oder schickt
ihn nach Hause. Eine solche **Verzweigung** besteht immer aus einer Frage, die
sich mit ja oder nein beantworten lässt, der **Bedingung**, und aus zwei
Wegen, von denen genau einer gegangen wird.

![Ein Kasten mit der Frage mindestens 18? Ein Pfeil mit ja führt zu einem grünen Kasten einlassen, ein Pfeil mit nein zu einem roten Kasten abweisen.](figure:fork "Die Bedingung ist eine Ja-Nein-Frage, und von den beiden Wegen wird genau einer gegangen.")

Im Alltag triffst du solche Entscheidungen ständig, ohne darüber
nachzudenken: Wenn es regnet, nimmst du den Schirm mit, sonst die
Sonnenbrille. Im Programm musst du sie ausdrücklich hinschreiben, und auch den
zweiten Weg, denn wer ihn vergisst, hat ein Programm, das bei Sonnenschein
einfach nichts macht. Gibt es mehr als zwei Möglichkeiten, reiht man mehrere
Fragen hintereinander, so wie eine Ampel erst fragt, ob sie rot zeigt, dann,
ob gelb, und sonst grün.

## Schleifen: dasselbe noch einmal

Viele Aufgaben bestehen darin, denselben Schritt immer wieder zu machen. Für
einen Salat schälst du jede Zwiebel im Netz, eine nach der anderen, und hörst
auf, wenn das Netz leer ist. Eine **Schleife** schreibt einen solchen Schritt
nur einmal auf und sagt dazu, wie oft oder wie lange er wiederholt wird.

![Oben steht für jede Zwiebel im Netz: schälen, darunter vier Kästen Zwiebel 1 bis 4. Unter den ersten beiden steht geschält, und ein gelber Rahmen markiert Zwiebel 3.](figure:loop "Die Schleife nimmt sich ein Stück nach dem anderen vor und ist gerade bei der dritten Zwiebel.")

Es gibt zwei Arten, eine Schleife zu beenden. Die erste ist die aus dem Bild:
**für jedes Stück** einer Liste einmal, also so oft, wie die Liste lang ist.
Die zweite läuft, **solange eine Bedingung gilt**, wie beim Rühren eines
Teigs, das erst aufhört, wenn keine Klümpchen mehr da sind; wie viele Runden
das dauert, weiß vorher niemand.

Bei der zweiten Art lauert eine Falle, die schon auf mancher Shampooflasche
steht: „Auftragen, ausspülen, wiederholen.“ Wer das wörtlich nimmt, steht bis
in alle Ewigkeit unter der Dusche, weil nirgends steht, wann Schluss ist.
Eine Schleife, deren Bedingung nie falsch wird, heißt **Endlosschleife**, und
sie ist einer der häufigsten Fehler am Anfang.

## Funktionen: die Kaffeemaschine

Eine Kaffeemaschine kann einen Cappuccino machen, und du musst dafür nicht
wissen, wie heiß das Wasser sein muss oder wie lange die Milch schäumt. Du
drückst eine Taste, sagst vielleicht noch, ob die Tasse groß oder klein sein
soll, und bekommst einen Cappuccino. Eine **Funktion** ist so eine Maschine
im Programm: eine Folge von Schritten, die einen Namen bekommt, etwa
`make_cappuccino`, damit man sie mit einem Wort aufrufen kann, statt die Schritte jedes Mal neu
hinzuschreiben.

![Links der Parameter "groß", in der Mitte ein Kasten mit der Funktion make_cappuccino, rechts unter Rückgabewert noch nichts. Abgespielt verschwindet der Parameter in der Funktion, und eine große Tasse Cappuccino kommt heraus; danach dasselbe mit "klein" und einer kleinen Tasse.](figure:machine "Dieselbe Funktion, zweimal aufgerufen: Der Parameter ändert sich, die Schritte im Inneren bleiben gleich.")

Was du der Funktion beim Aufruf mitgibst, heißt **Parameter**, und was sie
dir zurückgibt, **Rückgabewert**. Eine Funktion ist also ein kleines Programm
mit eigener Eingabe, Verarbeitung und Ausgabe. Das hat zwei Vorteile: Du
schreibst die Schritte nur einmal auf und kannst sie beliebig oft benutzen,
und wer die Funktion benutzt, muss ihr Inneres nicht kennen, genau wie bei
der Kaffeemaschine. Mit Funktionen zerlegst du außerdem eine große Aufgabe in
kleine, die du einzeln lösen und prüfen kannst; wie man dabei vorgeht, zeigt
[[problem-decomposition]].

## Wenn es nicht klappt

Kein Programm läuft beim ersten Versuch. Fehler zu finden, auf Englisch
**Debugging**, ist deshalb kein Zeichen, dass du etwas falsch machst, sondern
der größte Teil der Arbeit. Man geht dabei vor wie bei einem Kuchen, der nicht
aufgegangen ist: nicht alles neu backen, sondern Schritt für Schritt prüfen,
wo das Ergebnis zum ersten Mal anders ist als erwartet. Damit das leichter
fällt, schreibt man **Kommentare** in den Code, Notizen für Menschen, die der
Computer überspringt, so wie die Bleistiftnotiz am Rand eines Rezepts.

## Wie es weitergeht

| Grundidee | Alltagsbild | in Python |
|---|---|---|
| Folge von Anweisungen | Rezept | [[python-first-program]] |
| Variable | Behälter mit Aufkleber | [[python-values-and-variables]] |
| Eingabe und Ausgabe | Pfandautomat | [[python-working-with-text]] |
| Funktion | Kaffeemaschine | [[python-functions]] |
| Liste | Zug mit nummerierten Wagen | [[python-lists]] |
| Verzweigung | Türsteher | folgt in Teil 2 dieses Pfads |
| Schleife | Zwiebeln schälen | folgt in Teil 2 dieses Pfads |

Behalte die Bilder im Kopf, wenn du gleich mit Python anfängst. Die Sprache
ist neu, aber die Ideen dahinter kennst du jetzt.
