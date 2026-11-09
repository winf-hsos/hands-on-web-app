---
type: info
code: 9733
title: "Benötigte Software für die Datenanalyse mit R"
summary: >-
  Was auf deinem Laptop sein muss, bevor du eigene Daten mit R auswertest:
  R, die Entwicklungsumgebung Positron mit dem tidyverse und der eingebaute
  KI-Assistent Posit Assistant, wozu jedes da ist und wie du alles einrichtest.
level: 1
duration: 30
topics: [reproducible-work, programming-with-r]
modules: [ea]
areas: [ds]
status: published
updated: 2026-11-09
---

Die Codekästen auf dieser Plattform laufen im Browser und genügen zum Lernen.
Sobald du eigene Daten auswertest, brauchst du drei Dinge auf deinem Laptop.
Alle sind kostenlos zu haben und laufen unter Windows und macOS, und du
installierst sie in der Reihenfolge der Tabelle.

| Programm | Wofür du es brauchst | Wo es das gibt |
|---|---|---|
| **R** | die Sprache, in der du Daten auswertest | [cloud.r-project.org](https://cloud.r-project.org/) |
| **Positron** | die Entwicklungsumgebung, in der du schreibst, ausführst und Ergebnisse ansiehst | [positron.posit.co/download](https://positron.posit.co/download.html) |
| **Posit Assistant** | der KI-Assistent, schon in Positron eingebaut | braucht nur einen Anbieter für das Sprachmodell |

Dazu kommt das Paket **tidyverse** mit dplyr, ggplot2, readr und tidyr, das du
einmal mit einem einzigen Befehl in R installierst.

## Was jedes Programm macht

**R** ist die Sprache, in der du rechnest, Tabellen umformst und Grafiken
zeichnest. Alles, was du in den Codekästen hier gelernt hast, ist R und läuft
auf deinem Laptop genauso.

**Positron** ist die Entwicklungsumgebung von Posit, der Firma hinter RStudio
und dem tidyverse. Hier schreibst du Skripte, führst sie aus und siehst
Konsole, Variablen, Tabellen und Grafiken nebeneinander. Positron bringt R
nicht mit, sondern findet das R, das du installiert hast. Was es sonst kann,
steht auf der Seite [[positron]].

**Posit Assistant** ist der KI-Assistent, der seit Positron 2026.07 fest
eingebaut ist und dort den früheren Positron Assistant ersetzt. Du stellst ihm in einem
Chat Fragen zu deinem Code, lässt dir eine Fehlermeldung erklären oder einen
Schritt vorschlagen. Er kennt dabei mehr als den Text, den du ihm schickst:
die geöffneten Dateien, die geladenen Daten, deine Grafiken und was zuletzt in
der Konsole passiert ist. Das Sprachmodell dahinter kommt von einem Anbieter,
mit dem du Positron einmal verbindest; ohne diese Verbindung bleibt der
Assistent stumm.

## Installation Schritt für Schritt

### 1. R

Öffne [cloud.r-project.org](https://cloud.r-project.org/) und lade die
aktuelle Version für dein Betriebssystem herunter. Positron braucht
mindestens R 4.2, nimm aber die neueste.

- **Windows:** Unter *Download R for Windows* → *base* lädst du eine Datei
  `R-…-win.exe`. Starte sie und übernimm die Voreinstellungen. Rtools, das
  dir dieselbe Seite anbietet, brauchst du nicht.
- **macOS:** Unter *Download R for macOS* gibt es zwei Pakete. Hat dein Mac
  einen M-Chip, nimmst du das mit `arm64` im Namen, sonst das mit `x86_64`.
  Welchen Chip du hast, siehst du unter Apple-Menü → *Über diesen Mac* in der
  Zeile *Chip*. Öffne das Paket und folge den Schritten.

### 2. Positron

Lade Positron von
[positron.posit.co/download](https://positron.posit.co/download.html) herunter.

- **Windows:** Nimm den *User install*. Er braucht keine Administratorrechte
  und installiert Positron nur für dich. Positron braucht unter Windows das
  aktuelle *Visual C++ Redistributable* von Microsoft, das die Download-Seite
  verlinkt; auf den meisten Rechnern ist es schon da.
- **macOS:** Nimm *Apple Silicon*, wenn dein Mac einen M-Chip hat, sonst
  *Intel*. Öffne die geladene Datei und zieh Positron in den Ordner
  Programme.

### 3. Ein Ordner für deine Auswertung

Positron arbeitet mit Ordnern, und jede Auswertung bekommt ihren eigenen. Leg
einen Ordner an, etwa `eda` in deinen *Dokumenten*, und öffne ihn in Positron
über *File → Open Folder*. Leg darin über *File → New File* eine Datei vom Typ
*R File* an und speichere sie als `setup.R`.

Sobald ein Ordner eine R-Datei enthält, startet Positron beim Öffnen von
selbst eine R-Sitzung, und zwar mit der Standardversion deines Systems oder,
wenn es keine gibt, mit der neuesten. Unten siehst du dann die **Konsole** mit
der Versionsnummer von R. Läuft noch keine Sitzung, wählst du R oben rechts
aus.

### 4. Das tidyverse

Schreib in `setup.R` diese Zeile, setz den Cursor hinein und drück
**Strg+Enter** (am Mac **Cmd+Enter**):

```r static
install.packages("tidyverse")
```

R lädt jetzt eine ganze Reihe von Paketen herunter, was ein paar Minuten
dauern kann. Das musst du nur einmal tun; danach lädst du das tidyverse in
jedem Skript mit `library(tidyverse)`, wie es [[r-packages]] beschreibt.

### 5. Prüfen, ob alles zusammenspielt

Führ diese Zeilen aus:

```r static
library(tidyverse)

mpg |>
  ggplot() +
  aes(x = displ, y = hwy) +
  geom_point()
```

Erscheint im Bereich **Plots** eine Punktwolke aus Autos, laufen R, Positron
und das tidyverse zusammen. Im Bereich **Variables** siehst du noch nichts,
denn `mpg` gehört zu ggplot2 und ist kein eigenes Objekt. Schreib zum
Ausprobieren `autos <- mpg` in die Konsole: Jetzt steht `autos` dort, und ein
Klick auf das Tabellensymbol daneben öffnet die Daten im **Data Explorer**.

## Den Assistenten verbinden

Posit Assistant braucht einen Anbieter, der das Sprachmodell stellt. Für
Studierende ist **GitHub Copilot** der einfachste Weg, denn GitHub stellt es
verifizierten Studierenden als *Copilot Student* kostenlos zur Verfügung, und
es liefert auch Vorschläge direkt beim Tippen.

1. **GitHub-Konto.** Leg ein Konto auf [github.com](https://github.com) an,
   wenn du noch keins hast, am besten mit deiner Hochschuladresse.
2. **Als Studierende oder Studierender bestätigen.** Unter
   [github.com/settings/education/benefits](https://github.com/settings/education/benefits)
   bewirbst du dich für die Vorteile von GitHub Education. Dafür brauchst du
   deine Hochschuladresse oder eine aktuelle Immatrikulationsbescheinigung.
   Die Prüfung kann ein paar Tage dauern; bis dahin hast du die kostenlose
   Fassung Copilot Free mit einem begrenzten Kontingent.
3. **In Positron verbinden.** Öffne die Befehlspalette mit
   **Strg+Umschalt+P** (am Mac **Cmd+Umschalt+P**), tipp
   `Posit Assistant: Configure AI Providers` und klick bei **GitHub Copilot**
   auf **Connect**. Positron schickt dich in den Browser, wo du dich bei
   GitHub anmeldest und den Zugriff erlaubst.
4. **Chat öffnen.** Über die Befehlspalette mit `View: Show Posit Assistant`
   öffnest du den Chat. Frag ihn als Erstes, was in deiner Tabelle `autos`
   steht.

Beim Tippen schlägt dir Copilot jetzt grau den Rest der Zeile vor. Mit
**Tab** übernimmst du den Vorschlag, mit **Esc** verwirfst du ihn.

Statt GitHub Copilot kannst du einen anderen Anbieter verbinden, etwa
Anthropic oder OpenAI mit einem eigenen Schlüssel, den du dort direkt
bezahlst, oder Posit AI Pass, das Angebot von Posit selbst. Die Liste
erscheint im selben Fenster wie oben. Vorschläge beim Tippen gibt es nur mit
GitHub Copilot und Posit AI Pass; mit den anderen Anbietern hast du den Chat.

> [!IMPORTANT]
> Der Assistent schickt deinem Anbieter nicht nur deine Frage, sondern auch
> den Zusammenhang, also Code, Konsolenausgaben und Angaben zu den geladenen
> Daten. Posit selbst speichert davon nichts, solange du einen fremden
> Anbieter wie GitHub nutzt, der Anbieter aber nach seinen eigenen Regeln. Für die öffentlichen Datensätze dieser Plattform ist das
> kein Problem. Arbeitest du mit Daten, in denen Personen zu erkennen sind,
> etwa aus einer eigenen Befragung, schalte den Assistenten in den
> Einstellungen ab (`assistant.enabled`), bevor du sie lädst.

Ein Schlüssel, falls du einen nutzt, ist wie ein Passwort: Schick ihn
niemandem und füg ihn in keinen Chat ein, auch nicht in den mit dem
Assistenten.

## Wie du mit dem Assistenten arbeitest

Der Assistent ist gut darin, eine Fehlermeldung zu übersetzen, eine Funktion
zu erklären oder einen ersten Entwurf für eine Grafik zu schreiben. Je nach
Einstellung fragt er dich, bevor er eine Datei ändert oder Code ausführt;
lass diese Rückfragen eingeschaltet, statt alles freizugeben. Lies jeden Vorschlag, bevor du ihn
übernimmst, und führ ihn Zeile für Zeile aus. Ob ein Ergebnis stimmt,
erkennst du nur, wenn du verstehst, was der Code tut, und genau das üben die
Lektionen dieser Plattform.

## Wenn etwas nicht funktioniert

1. **Positron findet R nicht.** Schließ Positron ganz und öffne es neu, denn
   ein gerade installiertes R sieht es erst nach einem Neustart. Hilft das
   nicht, prüf, ob du R wirklich installiert hast und nicht nur Positron.
2. **`install.packages()` bricht ab.** Prüf die Internetverbindung und
   versuch es noch einmal. Fragt R, ob es Pakete *from source* installieren
   soll, antworte mit `no`.
3. **Der Assistent antwortet nicht.** Meist fehlt die Verbindung zum
   Anbieter. Öffne `Posit Assistant: Configure AI Providers` noch einmal und
   sieh nach, ob dein Anbieter als verbunden angezeigt wird.

Oder frag den Assistenten selbst, sobald er läuft: Kopier die Fehlermeldung in
den Chat und lass sie dir erklären.
