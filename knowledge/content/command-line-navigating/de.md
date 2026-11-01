---
type: lesson
code: 4433
title: Durch Ordner navigieren
summary: >-
  Mit cd wechselst du in der Kommandozeile von Ordner zu Ordner, mit .. eine
  Ebene nach oben und mit ~ zurück nach Hause. Der Prompt zeigt dir nach jedem
  Schritt, wo du stehst.
objectives:
  intro: "In dieser Lektion bewegst du dich mit Befehlen durch den Ordnerbaum und kannst danach:"
  goals:
    - "mit `cd` in einen Ordner wechseln, mit relativem und mit absolutem Pfad"
    - "mit `cd ..` eine Ebene nach oben und mit `cd ~` in deinen Benutzerordner gehen"
    - "nach jedem Wechsel mit dem Prompt, `pwd` und `ls` prüfen, wo du bist und was dort liegt"
    - "Ordnernamen mit Leerzeichen in Anführungszeichen setzen"
    - "die Fehlermeldung deuten, die erscheint, wenn es einen Ordner an dieser Stelle nicht gibt"
level: 1
duration: 15
topics: [working-with-the-computer]
modules: [dup]
relations:
  requires: [command-line]
status: draft
updated: 2026-11-01
---

Nach dem Öffnen steht die Kommandozeile in deinem Benutzerordner. Um mit
Dateien an einer anderen Stelle zu arbeiten, wechselst du dorthin, so wie du
im Explorer oder Finder einen Ordner per Doppelklick öffnest. Der Befehl dafür
heißt `cd`, kurz für *change directory*.

## Einen Ordner tiefer

Gib `cd` den Ordner mit, in den du wechseln willst:

```powershell
cd Documents
```

Der Befehl gibt nichts aus, aber der Prompt ändert sich: Unter Windows steht
dort jetzt `PS C:\Users\anna\Documents>`, auf dem Mac `anna@MacBook Documents %`.
Du kannst auch mehrere Ebenen auf einmal gehen, indem du einen relativen Pfad
angibst, unter Windows mit `\`, auf dem Mac mit `/`:

```powershell
cd Documents\uni
```

```zsh
cd Documents/uni
```

> [!TIP]
> Die PowerShell versteht auch den Schrägstrich `/`. Wer ihn sich angewöhnt,
> tippt auf beiden Systemen dasselbe.

## Eine Ebene nach oben, und zurück nach Hause

Die zwei Punkte `..` stehen für den Ordner über dem aktuellen. `cd ..` geht
also eine Ebene nach oben, `cd ..\..` (auf dem Mac `cd ../..`) zwei. Mit der
Tilde kommst du von überall auf direktem Weg in deinen Benutzerordner zurück:

```powershell
cd ~
```

![Links ein Ordnerbaum mit einer gelben Markierung, die anzeigt, in welchem Ordner man steht; rechts eine PowerShell, in der nacheinander cd Documents, cd uni, cd .. und cd ~ eingegeben werden, und die Markierung wandert mit](figure:cd-moves "Jeder cd-Befehl versetzt dich an eine andere Stelle im Baum, und der Prompt zeigt sie an.")

## Ein absoluter Pfad führt von überall hin

Mit einem absoluten Pfad springst du direkt an eine Stelle, egal wo du gerade
bist:

```powershell
cd C:\Users\anna\Documents\uni
```

```zsh
cd /Users/anna/Documents/uni
```

Setze dabei deinen eigenen Benutzernamen statt `anna` ein. Mit `pwd` findest
du heraus, wie er heißt.

## Nach jedem Schritt nachsehen

Am Anfang lohnt es sich, nach jedem `cd` kurz zu prüfen, wo du gelandet bist:
Der Prompt nennt den Ordner, `pwd` den ganzen Pfad, und `ls` zeigt, was dort
liegt. So siehst du auch, wohin du als Nächstes wechseln kannst.

Gibt es den Ordner an dieser Stelle nicht, antwortet die Shell mit einer
Fehlermeldung, und du bleibst, wo du warst. In der PowerShell lautet sie
`Cannot find path 'C:\Users\anna\Dokumente' because it does not exist.`, auf
dem Mac `cd: no such file or directory: Dokumente`. Meist ist der Name falsch
geschrieben, wie hier mit dem deutschen „Dokumente“ statt `Documents`, oder du
bist nicht in dem Ordner, in dem du dich vermutet hast.

## Ordnernamen mit Leerzeichen

Ein Leerzeichen trennt für die Shell den Befehl von seinen Argumenten. Ein
Ordner namens `Meine Fotos` sähe deshalb aus wie zwei Argumente. Setze solche
Namen in Anführungszeichen:

```powershell
cd "Meine Fotos"
```

Die Tabulatortaste erledigt das für dich: Tippe `cd Mei` und drücke Tab.
