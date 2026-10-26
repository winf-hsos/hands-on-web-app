---
type: lesson
code: 7291
title: Mit Text arbeiten
summary: >-
  Programme fragen nach Eingaben, setzen Texte zusammen und bringen sie in
  Form. Dazu gehören input, f-Strings, ein paar nützliche Methoden und das
  Umwandeln von Text in Zahlen.
level: 1
duration: 20
topics: [processing-information]
modules: [dup]
relations:
  requires: [python-values-and-variables]
status: draft
updated: 2026-10-26
---

## Worum es geht

Bisher haben deine Programme immer dasselbe ausgegeben. Spannend wird es, wenn
ein Programm nachfragt und mit der Antwort weiterarbeitet. Dafür gibt es in
Python die Funktion `input`, und weil eine Antwort immer als Text ankommt,
lernst du in dieser Lektion auch, Texte zusammenzusetzen, aufzuräumen und in
Zahlen zu verwandeln.

## Nach einer Eingabe fragen

`input` gibt einen Text aus, wartet, bis jemand etwas eintippt und Enter
drückt, und liefert das Eingetippte zurück. Meist legst du es gleich in einer
Variablen ab:

```python
name = input("Wie heißt du? ")
print("Hallo,", name)
```

Wenn du das Programm ausführst, erscheint unter dem Code ein Eingabefeld. Das
Leerzeichen am Ende von `"Wie heißt du? "` sorgt dafür, dass deine Antwort
nicht direkt am Fragezeichen klebt.

## Texte zusammensetzen

Zwei Strings verbindest du mit `+`, und mit `*` vervielfachst du einen:

```python
first = "Ada"
last = "Lovelace"
print(first + " " + last)
print("=" * 20)
```

Sobald mehrere Teile und Variablen zusammenkommen, wird das mit `+` schnell
unübersichtlich. Bequemer sind **f-Strings**: Du setzt ein `f` vor das erste
Anführungszeichen und schreibst Variablen in geschweiften Klammern direkt in
den Text.

```python
name = input("Wie heißt du? ")
city = input("Wo wohnst du? ")
print(f"Hallo {name}, schöne Grüße nach {city}!")
```

In den Klammern darf sogar eine kleine Rechnung stehen, etwa
`f"{2 * 21} ist die Antwort"`.

## Texte in Form bringen

Strings bringen eigene Funktionen mit, die man **Methoden** nennt. Du rufst sie
mit einem Punkt direkt am Text auf:

```python
answer = "   ada LOVELACE  "
print(answer.strip())
print(answer.strip().lower())
print(answer.strip().upper())
print(answer.strip().title())
print(answer.replace("ada", "Augusta Ada"))
```

`strip` entfernt Leerzeichen am Anfang und Ende, `lower` und `upper` machen
alles klein oder groß, `title` schreibt jedes Wort groß, und `replace` ersetzt
einen Teil des Textes durch einen anderen. Keine dieser Methoden ändert den
ursprünglichen String; jede liefert einen neuen, und deshalb lassen sie sich
wie im Beispiel hintereinander hängen. Besonders bei Eingaben lohnt sich das,
denn Menschen tippen gern ein Leerzeichen zu viel oder alles klein.

Wie lang ein Text ist, verrät die Funktion `len`:

```python
word = "Informatik"
print(len(word))
```

## Aus Text wird eine Zahl

`input` liefert immer einen String, auch wenn jemand eine Zahl eintippt. Mit
diesem Text kann Python nicht rechnen:

```python
age = input("Wie alt bist du? ")
print(age + 1)
```

Die Lösung ist, den Text vorher umzuwandeln. `int(...)` macht aus einem Text
eine ganze Zahl, `float(...)` eine Kommazahl, und `str(...)` macht aus einer
Zahl wieder einen Text:

```python
age = int(input("Wie alt bist du? "))
print(f"Nächstes Jahr bist du {age + 1}.")
```

Hier steckt ein Funktionsaufruf im anderen: Python führt zuerst das innere
`input` aus und gibt dessen Ergebnis dann an `int` weiter. Tippt jemand etwas
ein, das keine ganze Zahl ist, etwa `zwölf` oder `12.5`, bricht das Programm
mit einem `ValueError` ab. Wie man damit umgeht, ohne dass das Programm
abstürzt, kommt in einem späteren Teil.

## Zum Mitnehmen

- `input("Frage ")` wartet auf eine Eingabe und liefert sie immer als String.
- f-Strings wie `f"Hallo {name}"` setzen Werte direkt in einen Text ein.
- Methoden wie `strip`, `lower`, `upper`, `title` und `replace` liefern
  einen neuen, veränderten String; `len` zählt die Zeichen.
- `int(...)`, `float(...)` und `str(...)` wandeln zwischen Text und Zahlen um.
