---
type: challenge
code: 8649
title: "Challenge 0: Der Funke"
summary: >-
  Jedes Gerät läuft am eigenen Laptop: Die LED zeigt eine Farbe aus eurem Code, und der Sensor meldet fortlaufend, was er sieht.
objectives:
  intro: "Mit dieser Challenge bringst du dein Gerät zum Laufen und kannst danach:"
  goals:
    - "die LED aus eigenem Code in einer gewählten Farbe leuchten lassen"
    - "die vier Messwerte des Sensors auslesen und deuten"
    - "einen Schwellenwert für die Helligkeit selbst messen statt raten"
    - "als menschlicher Empfänger benennen, woran eine Übertragung scheitert"
    - "dein Programm vor Zuschauern gezielt ändern"
level: 1
topics: [working-with-the-computer, programming-with-python]
modules: [dup]
project: lifi
status: published
updated: 2026-11-02
---

Bevor ihr irgendetwas überträgt, muss jedes Gerät auf eurem eigenen Rechner
laufen: die LED leuchtet in einer Farbe, die ihr im Code wählt, und der Sensor
meldet, was er sieht.

**Ziel:** Auf jedem Gerät zeigt die LED eine Farbe aus eurem Code, und der
Sensor gibt fortlaufend seine vier Messwerte aus. Jede Person bringt dabei ihr
eigenes Gerät an ihrem eigenen Laptop zum Laufen, und am Ende schaltet ihr die
LED des einen Geräts um und seht, wie sich die Zahlen des Sensors gegenüber
ändern.

**Neu ist** hier alles: Für die meisten ist es das erste eigene Programm, und
zwei Werkzeuge kommen dazu, die euch durch das ganze Projekt begleiten, das
Terminal, in dem ihr Programme startet, und der KI-Assistent, mit dem ihr
arbeitet. Wer dafür länger braucht, ist nicht im Rückstand; die meisten vor
euch hatten auch noch nie ein Terminal gesehen.

**Aufgabe:** Sechs kleine Programme, je eine Datei, die aufeinander aufbauen.
Wo in der Vorlage `TODO` steht, fehlt euer Code.

| | Datei | Was ihr dabei lernt |
|---|---|---|
| 1 | `task_1_light_on.py` | eine Funktion aufrufen und ihr Werte übergeben |
| 2 | `task_2_blink.py` | eine Schleife, also etwas mehrmals ausführen |
| 3 | `task_3_color_cycle.py` | eine Liste und wie man sie durchläuft |
| 4 | `task_4_measure.py` | eine Funktion, die Werte zurückgibt, und Messen in einer Situation nach der anderen |
| 5 | `task_5_react.py` | eine Bedingung, also je nach Lage etwas anderes ausführen |
| 6 | `task_6_human_receiver.py` | was ein Empfänger eigentlich leisten muss |

Mehr Bausteine gibt es nicht: Alles, was ihr im Projekt programmiert, besteht
aus Anweisungen nacheinander, wiederholt und unter einer Bedingung. Jede
Aufgabe startet ihr einzeln, etwa mit `python task_3_color_cycle.py`; Aufgabe 5
läuft, bis ihr sie mit Strg+C beendet.

**Den Schwellenwert findet ihr selbst.** In Aufgabe 4 nehmt ihr mit jeder
Eingabetaste einen Messwert auf: bei Raumlicht, mit der Hand über dem Sensor,
mit der Taschenlampe des Handys von weit weg und von nah. Der Wert `c` ist die
Helligkeit, und euer Schwellenwert für Aufgabe 5 liegt zwischen „abgedeckt“
und „Taschenlampe“. Bleibt `c` bei 65535 stehen, ist der Sensor übersteuert,
und ihr haltet die Lampe weiter weg.

**Selbst einmal Empfänger sein:** In Aufgabe 6 sendet euer Programm eine Folge
von Farben, und eine Person schreibt sie auf, ohne auf den Bildschirm zu
schauen; danach vergleicht ihr. Beim ersten Mal klappt das mühelos.
Interessant wird es, wenn ihr jedes Mal genau eine Sache ändert: schneller
senden, mehr Farben verwenden, den Start nicht ankündigen, dieselbe Farbe
zweimal hintereinander senden. Schreibt auf, woran es jedes Mal gescheitert
ist. Diese Liste ist ziemlich genau die Liste der Probleme, die euer Programm
in den nächsten Challenges lösen muss, und ihr habt sie selbst gefunden.

**Geschafft ist sie,** wenn die Programme auf beiden Geräten laufen und ihr vor
Zuschauern eine kleine Änderung daran vornehmt, etwa „lass die LED doppelt so
schnell blinken“ oder „dreh die Bedingung in Aufgabe 5 um“. Das ist keine
Falle, sondern der Anfang einer Gewohnheit, die bis zum Schluss bleibt: Euren
eigenen Code könnt ihr vor Ort ändern und wisst, was dann passiert, auch wenn
Teile davon mit dem Assistenten entstanden sind. Hier wird nichts gemessen,
keine Rangliste geführt und nichts abgegeben, aber ohne laufendes Gerät könnt
ihr Challenge 1 nicht einmal beginnen.

**Typische Stolpersteine:** Der Brick Daemon läuft nicht; ohne ihn findet euer
Programm die Hardware nicht, so richtig der Code auch ist, also prüft ihn
jedes Mal zuerst. Unter Windows fehlt Python im Suchpfad, fast immer wegen des
fehlenden Häkchens bei „Add python.exe to PATH“ während der Installation, und
auf dem Mac heißen die Befehle `python3` und `pip3`. Zeigt der Brick Viewer das
Gerät nicht an, liegt das Problem vor eurem Code und nicht darin: Kabel,
Anschluss, Stromversorgung.

**Die Zahlen passen nicht:** Ihr schickt der LED `(255, 0, 60)`, und der Sensor
meldet ganz andere Werte. Das ist richtig und kein Fehler. Warum das so ist und
was daraus folgt, ist Thema der nächsten Phase; lasst die Frage bis dahin offen.

**Für Schnelle:** Probiert verschiedene Farben aus und notiert, was der Sensor
jeweils meldet, dann verändert den Abstand und beobachtet, was mit den Zahlen
passiert. Diese Notizen braucht ihr in Challenge 1 sofort.
