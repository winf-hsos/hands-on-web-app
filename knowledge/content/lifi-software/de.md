---
type: lesson
code: 2165
title: "Benötigte Software im LiFi-Projekt"
summary: >-
  Die fünf Programme, die vor der ersten Zeile Code auf eurem Laptop sein müssen, wozu jedes da ist, und wie ihr sie installiert: das erste von Hand, den Rest mit eurem KI-Assistenten.
objectives:
  intro: "Hier richtest du deinen Laptop für das LiFi-Projekt ein und kannst danach:"
  goals:
    - "sagen, welches der fünf Programme wofür da ist"
    - "OpenCode installieren und den Kursordner so einrichten, dass dein Assistent übernehmen kann"
    - "prüfen, ob Python, Brick Daemon, Brick Viewer und das Kursmodul lifi_hardware zusammenspielen"
    - "mit dem Brick Viewer entscheiden, ob ein Fehler in deinem Programm liegt oder davor"
level: 1
duration: 20
topics: [working-with-the-computer, programming-with-python]
modules: [dup]
project: lifi
status: published
updated: 2026-11-02
---

Fünf Programme müssen auf eurem Laptop sein, bevor ihr die erste Zeile Code
schreibt. Alle sind kostenlos, und alle laufen unter Windows und macOS. Nur das
erste installiert ihr von Hand, bei den anderen vier hilft euch euer
KI-Assistent.

| Programm | Wofür ihr es braucht | Wo es das gibt |
|---|---|---|
| **OpenCode** | euer KI-Assistent | [opencode.ai/download](https://opencode.ai/download) |
| **Python** | die Sprache, in der ihr programmiert | [python.org](https://www.python.org/downloads/) |
| **Visual Studio Code** | der Editor, in dem ihr schreibt | [code.visualstudio.com](https://code.visualstudio.com/) |
| **Brick Daemon** | verbindet eure Hardware mit dem Laptop | [Downloads bei Tinkerforge](https://www.tinkerforge.com/de/doc/Downloads.html) |
| **Brick Viewer** | zeigt, ob die Hardware erkannt wird, und hilft bei der Fehlersuche | [Downloads bei Tinkerforge](https://www.tinkerforge.com/de/doc/Downloads.html) |

Dazu kommt das Kursmodul `lifi_hardware`, über das eure Programme mit eurem
Gerät sprechen. Es ist mit einem einzigen Befehl installiert und bringt die
Bibliothek von Tinkerforge mit; was es kann, steht in [[lifi-hardware]]. Einen
Überblick über den ganzen Aufbau, vom Gerät bis zur grünen LED, geben die
Folien [[first-light]].

## Was jedes Programm macht

**OpenCode** ist der KI-Assistent. Er liest und ändert die Dateien in eurem
Kursordner, führt Befehle für euch aus, wenn ihr es erlaubt, und kennt diesen
Kurs.

**Python** ist die Sprache, in der ihr Sender und Empfänger schreibt. Sie liest
sich fast wie Englisch, was sie zu einer guten ersten Sprache macht, aber sie
ist kein Spielzeug: Python gehört zu den meistgenutzten Sprachen überhaupt, in
der Datenanalyse, der künstlichen Intelligenz, der Automatisierung, im
wissenschaftlichen Rechnen und in einem großen Teil des Webs. Was ihr hier
lernt, könnt ihr anderswo sofort weiterverwenden.

**Visual Studio Code** ist der Editor. Hier schreibt ihr euren Code, seht eure
Dateien und habt das Terminal, in dem ihr eure Programme startet.

**Brick Daemon** ist ein Hintergrundprogramm. Es läuft unsichtbar und
übersetzt zwischen der Hardware am USB-Anschluss und euren Python-Programmen;
ohne es findet euer Programm das Gerät nicht. Wenn eines Tages gar nichts mehr
geht, ist „Läuft der Brick Daemon überhaupt?“ eine der ersten Fragen.

**Brick Viewer** ist ein Fenster auf eure Hardware. Er zeigt, welche Teile
erkannt werden, lässt euch die LED von Hand schalten und die Sensorwerte
mitlaufen, ganz ohne eine Zeile eigenen Code. Für die Fehlersuche ist er Gold
wert: Funktioniert es im Brick Viewer, liegt der Fehler in eurem Programm, und
funktioniert es dort nicht, liegt er irgendwo davor.

**Git** braucht ihr nicht. Es ist ein Werkzeug, um Versionen von Dateien zu
verfolgen, und wer es schon kennt, kann damit den Kursordner holen statt der
ZIP-Datei; wie das geht, steht unten bei den Alternativen.

## Installation Schritt für Schritt

Die Installation hat zwei Teile. Im ersten Teil erledigt ihr drei Dinge von
Hand, das Minimum, das euer Assistent zum Laufen braucht. Im zweiten Teil
übernimmt der Assistent: Mit dem Befehl `/onboarding` installiert er gemeinsam
mit euch den Rest und prüft jeden Schritt auf eurem Laptop. Jeder Schritt des
zweiten Teils ist hier auch von Hand beschrieben, damit ihr nachschlagen oder
ihn selbst ausführen könnt.

## Teil 1: bis euer Assistent läuft

### 1. OpenCode

Ladet die Desktop-App von [opencode.ai/download](https://opencode.ai/download)
herunter und installiert sie wie jedes andere Programm.

- **Windows:** Ladet den Windows-Installer herunter, startet ihn und folgt den
  Schritten.
- **macOS:** Ladet die Version für euren Mac herunter, *Apple Silicon*, wenn
  euer Mac einen M-Chip hat, sonst *Intel*. Das seht ihr unter Apple-Menü >
  *Über diesen Mac*: Die Zeile *Chip* sagt Apple M1, M2 und so weiter. Öffnet
  die geladene Datei und zieht OpenCode in den Ordner Programme.

Wer lieber im Terminal arbeitet, findet unten bei den Alternativen eine
Terminal-Fassung.

### 2. Der Kursordner

Der Kursordner enthält alles, was euer Assistent über dieses Projekt wissen
muss, und ihr arbeitet für das ganze Projekt darin.

1. Öffnet [github.com/winf-hsos/lifi-project](https://github.com/winf-hsos/lifi-project),
   klickt auf den grünen Knopf **Code** und dann auf **Download ZIP**. Oder
   ladet ihn direkt:
   [lifi-project-main.zip](https://github.com/winf-hsos/lifi-project/archive/refs/heads/main.zip).
2. Entpackt die ZIP-Datei: unter **Windows** mit einem Rechtsklick auf
   *Alle extrahieren* und Bestätigen, unter **macOS** mit einem Doppelklick.
3. Jetzt habt ihr einen Ordner `lifi-project-main`. Verschiebt ihn an einen
   Ort, an dem ihr ihn wiederfindet, etwa in eure *Dokumente*. Ihr dürft ihn
   in `lifi-project` umbenennen.

> [!WARNING]
> Unter Windows gibt es eine Falle: Ein Doppelklick auf die ZIP-Datei zeigt
> ihren Inhalt, als wäre sie ein Ordner, aber entpackt ist dann nichts, und
> euer Assistent kann darin nicht arbeiten. Nehmt immer *Alle extrahieren*.

Im Ordner seht ihr:

- `my-code`: **euer Ordner.** Alles, was ihr schreibt, kommt hierher, und
  eure Kopie jeder Challenge landet hier.
- `course`: das Kursmaterial. Euer Assistent liest es, ihr ändert es nicht.
- ein paar weitere Dateien für OpenCode, die ihr übergehen könnt.

### 3. Ordner öffnen und starten

Startet OpenCode. Auf der Startseite seht ihr links eine Liste **Projects**.

1. **Kursordner hinzufügen.** Klickt auf das kleine Ordnersymbol mit dem Plus
   neben *Projects* (sein Tooltip sagt *Add project*). Im Fenster, das sich
   öffnet, wählt ihr euren Kursordner, `lifi-project-main` oder
   `lifi-project`, und klickt *Select Folder*. Er steht jetzt in der Liste der
   Projekte.
2. **Sitzung starten.** Klickt auf **New session**. Unter dem Eingabefeld seht
   ihr das Modell, das euer Kursordner für euch ausgewählt hat: das Kursmodell
   von OpenAI. Es braucht den Kursschlüssel, und der kommt als Nächstes.

**Der Kursschlüssel** ist eine lange Zeichenfolge, die ihr in eurem Kurs
bekommt. Ihr tragt ihn in OpenCode ein: Klickt unter der Liste der Projekte
auf **Settings**, dann links auf **Providers**. Beim Anbieter, für den der
Schlüssel gilt, klickt ihr auf **+ Connect** (steht er nicht in der Liste,
zuerst auf *Show more providers*), wählt **API key** und fügt ihn ein.

> [!IMPORTANT]
> Ein Schlüssel kostet bei jeder Antwort des Assistenten Geld. Behandelt ihn
> wie ein Passwort: Schickt ihn niemandem und fügt ihn in keinen Chat ein,
> auch nicht in den mit eurem Assistenten.

## Teil 2: euer Assistent übernimmt

Tippt in der neuen Sitzung

```
/onboarding
```

und drückt Enter. Euer Assistent stellt euch drei kurze Fragen und
installiert dann mit euch den Rest, einen Schritt nach dem anderen: Python,
Visual Studio Code, Brick Daemon und Brick Viewer und das Kursmodul
`lifi_hardware`. Bevor er etwas installiert, sagt er, was er vorhat, und
wartet auf euer OK. Am Ende testet er euer Gerät: Eure LED leuchtet grün, und
der Sensor meldet seine ersten Messwerte.

Die folgenden Anleitungen braucht ihr dafür nicht; sie beschreiben dieselben
Schritte von Hand.

### Python

**Windows:** Ladet den Installer von
[python.org/downloads](https://www.python.org/downloads/) herunter und startet
ihn.

> [!IMPORTANT]
> Setzt im ersten Fenster den Haken bei **„Add python.exe to PATH“**, bevor ihr
> auf „Install Now“ klickt. Ohne diesen Haken findet die Kommandozeile Python
> später nicht, und das ist mit Abstand der häufigste Stolperstein.

Zum Prüfen öffnet ihr die **Eingabeaufforderung** und tippt

```powershell
python --version
```

Es sollte eine Versionsnummer erscheinen, etwa `Python 3.13.1`.

**macOS:** Auf dem Mac ist ein älteres Python vorinstalliert, das ihr aber
nicht benutzen solltet. Ladet den Installer von
[python.org/downloads](https://www.python.org/downloads/) herunter und startet
ihn. Zum Prüfen öffnet ihr das **Terminal** und tippt

```bash
python3 --version
```

Es sollte eine Versionsnummer erscheinen, etwa `Python 3.13.1`. Merkt euch:
Auf dem Mac heißt der Befehl `python3`, nicht `python`.

### Visual Studio Code

Ladet den Editor von [code.visualstudio.com](https://code.visualstudio.com/)
herunter und installiert ihn. Unter Windows geht auch
`winget install --id Microsoft.VisualStudioCode -e` in einem Terminal; so
macht es euer Assistent. Wenn ihr später eure erste Python-Datei öffnet, bietet
VS Code an, die Python-Erweiterung zu installieren. Nehmt an.

Zwei Dinge solltet ihr gleich ausprobieren:

- **Einen Ordner öffnen** über *Datei > Ordner öffnen*. VS Code arbeitet
  immer mit einem Ordner, nicht mit einzelnen Dateien.
- **Ein Terminal öffnen** über *Terminal > Neues Terminal*. Dieses Fenster
  unten im Editor ist die Kommandozeile, in der ihr eure Programme startet.

Öffnet danach euren Kursordner in VS Code. Eure Programme schreibt ihr in
`my-code`.

### Brick Daemon und Brick Viewer

Beide gibt es auf der
[Download-Seite von Tinkerforge](https://www.tinkerforge.com/de/doc/Downloads.html).
Ladet die Fassung für euer Betriebssystem herunter und installiert sie: unter
**Windows** zwei `.exe`-Installer, unter **macOS** zwei `.dmg`-Pakete, die ihr
öffnet und in den Ordner Programme zieht.

Der Brick Daemon startet danach von selbst und läuft als Hintergrunddienst
weiter. Ihr seht ihn nicht, und das ist normal.

### Das Kursmodul lifi_hardware

Darüber sprechen eure Python-Programme mit der Hardware. `/onboarding`
installiert es für euch; von Hand geht es in einem Terminal so:

```bash
pip install https://github.com/winf-hsos/lifi-hardware/archive/refs/heads/main.zip
```

Auf dem Mac nehmt ihr nötigenfalls `pip3` statt `pip`. Das Paket bringt die
Bibliothek von Tinkerforge mit, die ihr deshalb nicht eigens installiert.

### Prüfen, ob alles zusammenspielt

Schließt ein Gerät über USB an und startet den Brick Viewer. Erscheint dort
euer Master Brick mit der LED und dem Farbsensor, ist die Installation
vollständig. Klickt euch durch und schaltet die LED von Hand ein. Das ist
noch kein Programmieren, aber der Beweis, dass alles mit allem spricht.

## Aktualisierungen holen

Im Lauf des Projekts kommt neues Material dazu: neue Vorlagen, neue Seiten,
manchmal eine neue Fassung von `lifi_hardware`. Wenn es in eurem Kurs heißt,
dass es Neues gibt, tippt ihr in OpenCode `/update-semester`. Euer Assistent
holt dann die neueste Fassung des Kursordners. Euer Ordner `my-code` bleibt
dabei unberührt; alles andere wird durch die Fassung des Kurses ersetzt, also
ändert es nicht.

## Alternativen

### Der Kursordner mit Git

Wer Git kennt, kann den Kursordner klonen, statt die ZIP-Datei zu laden.
Zuerst braucht ihr Git:

- **Windows:** Ladet Git von [git-scm.com/downloads](https://git-scm.com/downloads)
  herunter und installiert es; die Voreinstellungen des Installers könnt ihr
  durchweg übernehmen. Dabei kommt auch **Git Bash** mit, ein Terminal, das
  ihr für die Terminal-Fassung von OpenCode braucht. Zum Prüfen schließt ihr
  VS Code ganz und öffnet es wieder (ein gerade installiertes Programm sieht
  VS Code erst nach einem Neustart), öffnet ein Terminal und tippt
  `git --version`.
- **macOS:** Tippt im Terminal einfach `git --version`. Fehlt Git, bietet
  macOS von selbst an, die Command Line Tools zu installieren; nehmt an und
  wartet, bis es fertig ist. Alternativ geht es über
  [Homebrew](https://brew.sh) mit `brew install git`.

Dann in einem Terminal:

```bash
git clone https://github.com/winf-hsos/lifi-project.git
```

Alles Weitere funktioniert genauso, und `/update-semester` merkt, dass euer
Ordner ein Git-Klon ist. Eine Regel gilt: In diesem Ordner nicht committen.
Die Aktualisierung setzt ihn auf die Fassung des Kurses zurück und entfernt
dort gemachte Commits. Eure eigene Arbeit in `my-code` verfolgt Git nicht, sie
bleibt unberührt.

### OpenCode im Terminal

Statt der Desktop-App könnt ihr OpenCode in einem Terminal benutzen, etwa in
dem von VS Code.

**Windows:** Macht zuerst einmalig **Git Bash** zum Standardterminal von VS
Code: Strg+Umschalt+P drücken, `Terminal: Select Default Profile` tippen,
Enter drücken und **Git Bash** wählen. OpenCode läuft nur in diesem Terminal,
und so ist jedes neue Terminal eine Git Bash. Öffnet dann ein neues Terminal
(*Terminal > Neues Terminal*) und tippt:

```bash
curl -fsSL https://opencode.ai/install | bash
```

**macOS:** Im Terminal von VS Code:

```bash
curl -fsSL https://opencode.ai/install | bash
```

Alternativ geht es über [Homebrew](https://brew.sh) mit
`brew install sst/tap/opencode`.

Zum Prüfen öffnet ihr ein neues Terminal und tippt `opencode --version`; es
sollte eine Versionsnummer erscheinen. Wechselt dann im Terminal in euren
Kursordner und startet OpenCode mit `opencode`. Den Schlüssel tragt ihr dort
mit dem Befehl `/connect` ein.

## Wenn etwas nicht funktioniert

Diese Fragen helfen am häufigsten:

1. Läuft der Brick Daemon? Ohne ihn findet kein Programm die Hardware.
2. Zeigt der Brick Viewer euer Gerät? Wenn nicht, liegt der Fehler vor eurem
   Code. Zieht das USB-Kabel ab und steckt es wieder ein: Das heilt
   erstaunlich viele Fälle.
3. Benutzt ihr `python` oder `python3`, `pip` oder `pip3`? Auf dem Mac ist es
   fast immer die Variante mit der 3.

Oder bittet euren Assistenten, eure Einrichtung zu prüfen. Er führt denselben
Test aus wie bei `/onboarding` und sagt euch, was fehlt.
