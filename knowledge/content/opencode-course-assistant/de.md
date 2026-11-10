---
type: info
code: 8846
title: "OpenCode: dein KI-Agent für den Kursordner"
summary: >-
  Was OpenCode ist, wie du ihn mit dem Kursordner einrichtest, was er über den
  Kurs weiß, wie du mit ihm arbeitest und welche Befehle er kennt.
level: 1
duration: 20
topics: [ai-agents-as-tools, reproducible-work]
modules: [pmg]
areas: [ds]
status: published
updated: 2026-11-10
---

[OpenCode](https://opencode.ai) ist ein KI-Agent, der auf deinem Laptop in
einem Ordner arbeitet. Anders als ein Chat im Browser liest er die Dateien
in diesem Ordner selbst, schreibt neue, führt R-Code aus und sieht sich das
Ergebnis an, bevor er antwortet. Im Kurs arbeitet er im **Kursordner**, und
dort liegt alles, was er über den Kurs wissen muss. Du schreibst deine
Analyse und deine Ausarbeitung in Positron; OpenCode läuft im Fenster
daneben und hilft dir dabei.

## Einrichten

Die ganze Einrichtung steht auch im Kursordner in
`course/material/software.md`. Hast du sie schon erledigt, springst du zu
„Den Kursschlüssel hinterlegen“.

### 1. OpenCode installieren

Lade die Desktop-App von [opencode.ai/download](https://opencode.ai/download)
und installiere sie wie jedes andere Programm.

- **Windows:** den Windows-Installer herunterladen, ausführen und den
  Schritten folgen.
- **macOS:** *Apple Silicon*, wenn dein Mac einen M-Chip hat, sonst *Intel*.
  Das steht unter Apple-Menü → *Über diesen Mac* in der Zeile *Chip*. Die
  Datei öffnen und OpenCode in den Ordner *Programme* ziehen.

### 2. Den Kursordner holen

1. Öffne
   [github.com/winf-hsos/data-analytics-courses](https://github.com/winf-hsos/data-analytics-courses),
   klick auf den grünen Knopf **Code** und dann auf **Download ZIP**.
2. Entpacke die ZIP-Datei, unter Windows mit Rechtsklick → *Alle
   extrahieren*. Ein Doppelklick zeigt nur den Inhalt an und entpackt
   nichts, und darin kann weder der Agent noch R arbeiten.
3. Leg den Ordner dorthin, wo du ihn wiederfindest, etwa in *Dokumente*.
4. Leg die Umfragedaten aus ILIAS **unverändert** in den Unterordner `data/`.

### 3. Den Ordner in OpenCode öffnen

Starte OpenCode. Links steht die Liste **Projects**. Klick auf das
Ordnersymbol mit dem Plus (*Add project*), wähl den Kursordner und dann
**New session**. In das Eingabefeld tippst du

```text
/onboarding
```

Der Agent fragt nach deinem Modul und danach, was du mitbringst, prüft, ob
Positron, R und Quarto installiert sind, und installiert mit dir, was fehlt.
Vor jeder Installation sagt er, was er vorhat, und wartet auf dein OK.

Danach öffnest du **denselben Ordner** in Positron über *File → Open
Folder*. Im Explorer siehst du dann `my-code`, `data` und `course`.

### Den Kursschlüssel hinterlegen

Ohne Schlüssel arbeitet OpenCode mit einem freien Modell, das der Kursordner
voreingestellt hat. Für die Arbeit an der Ausarbeitung bekommt ihr einen
Kursschlüssel für ein stärkeres Modell; er wird im Teams-Kanal des Moduls
geteilt und steht nirgends sonst.

1. In OpenCode unter der Projektliste auf **Settings**, dann links auf
   **Providers**.
2. Beim Anbieter, für den der Schlüssel gilt, auf **+ Connect** klicken.
   Steht er nicht in der Liste, zuerst *Show more providers*.
3. **API key** wählen und den Schlüssel einfügen.
4. Unter dem Eingabefeld das Modell auswählen.

> [!IMPORTANT]
> Der Schlüssel ist wie ein Passwort, und jede Antwort kostet damit Geld.
> Schick ihn niemandem, leg ihn in keine Datei im Kursordner und kopiere
> ihn in keinen Chat, auch nicht in den mit OpenCode. Er gehört nur in das
> Feld unter *Providers*.

## Was der Agent über den Kurs weiß

Der Kursordner bringt seine eigenen Anweisungen mit, die OpenCode bei jedem
Start liest. Deshalb musst du ihm den Kurs nicht erklären:

| Datei im Kursordner | Was darin steht |
|---|---|
| `.opencode/course-assistant.md` | die Regeln, nach denen er arbeitet |
| `course/modules/praxis-mgf/NOW.md` | wo das Semester gerade steht und was noch nicht dran ist |
| `course/datasets/mds12-schoko-milch-codebook.md` | das Codebuch: zu jeder Frage der Umfrage Fragetext, Filter, Codes und die tatsächlich vorkommenden Werte |
| `course/material/` | Konventionen für R-Code, Fehlermeldungen, Software |
| `my-code/about-me.md` | was er sich über dich merkt: Modul, Betriebssystem, R-Erfahrung, Thema deiner Gruppe |

Er schreibt nur in `my-code/`, fragt, bevor er eine Datei ändert oder einen
Befehl ausführt, und schlägt dir vor, deinen KI-Einsatz in
`my-code/ai-log.md` festzuhalten. Ist der Stand von `NOW.md` älter als eine
Woche, schlägt er `/update-semester` vor.

## Die Befehle

Ein Befehl beginnt mit einem Schrägstrich und startet einen festen Ablauf.

| Befehl | Was er tut |
|---|---|
| `/onboarding` | der erste Start: Modul festlegen, kennenlernen, R, Positron, Pakete und Daten prüfen |
| `/update-semester` | holt neues Material, Vorlagen und Pakete in den Kursordner; `my-code/` und `data/` bleiben unberührt |
| `/paper` | legt die Vorlage für eure Ausarbeitung an: fragt nach Titel, Thema, Forschungsfrage und Autoren, legt ein Quarto-Dokument in `my-code/paper/` an und rendert es einmal als PDF |
| `/self-study` | begleitet das Selbststudium in R: Stand feststellen, nächstes Kapitel, Hilfe in Stufen |
| `/final-check` | die Abnahme des Selbststudiums: Selbsttest ausführen und ein kurzes Gespräch über deinen Code |

Fehlt dir ein Befehl, den die Lehrenden angesagt haben, holst du ihn mit
`/update-semester`.

## So arbeitest du mit ihm

Schreib in das Eingabefeld, was du erreichen willst, und sag dazu, worauf es
ankommt: welche Variable, welche Gruppe, welche Abbildung. Mit `@` und einem
Dateinamen hängst du eine Datei an, und ein Bildschirmfoto ziehst du einfach
ins Eingabefeld. Ein paar Beispiele für den Anfang:

- „Welche Fragen im Codebuch gehören zu unserem Spezialthema, und welche
  davon wurden allen gestellt?“
- „Hier ist unsere Forschungsfrage: … Welche Variablen beantworten sie, und
  was fehlt?“
- „Erklär mir diese Fehlermeldung aus Positron.“
- „Lies `@my-code/paper/paper.qmd` und sag mir, wo eine Zahl im Text von
  Hand steht statt aus dem Code.“

Bevor OpenCode eine Datei ändert oder einen Befehl ausführt, fragt er nach.
Lies, was er vorhat, bevor du zustimmst, und führ Code, den er schreibt,
selbst Zeile für Zeile aus. Für das, was in eurer Ausarbeitung steht, steht
ihr gerade und nicht der Agent; deshalb musst du jeden Schritt verstehen,
den du übernimmst.

## Wenn etwas nicht läuft

Frag zuerst den Agenten: Kopier die Fehlermeldung hinein oder zieh ein
Bildschirmfoto ins Eingabefeld. Antwortet das voreingestellte freie Modell
nicht, wähl unter dem Eingabefeld ein anderes freies Modell. Lässt sich
etwas nicht lösen, zeig es in der Sitzung.
