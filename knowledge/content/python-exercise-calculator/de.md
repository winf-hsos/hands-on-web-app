---
type: exercise
code: 1928
title: "Übung: Taschenrechner"
summary: >-
  Ein Taschenrechner fragt nach zwei Zahlen und einem Rechenzeichen, lässt
  sich von falschen Eingaben und einer Division durch null nicht aus der Ruhe
  bringen und rechnet, so lange du willst.
objectives:
  intro: "In dieser Übung schreibst du einen Taschenrechner, der mit falschen Eingaben umgehen kann, und kannst danach:"
  goals:
    - "eine Funktion `get_number(prompt)` schreiben, die mit `while True`, `try` und `except ValueError` so lange fragt, bis eine Zahl kommt"
    - "mit `if`, `elif` und `else` je nach Rechenzeichen die passende Rechnung auswählen und ein unbekanntes Zeichen melden"
    - "eine Division durch null abfangen und begründen, wann `except` und wann eine Prüfung vorab die bessere Wahl ist"
    - "ein Programm mit einer `while`-Schleife so lange wiederholen, bis jemand aufhören will"
level: 1
duration: 25
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-exceptions, python-if-else]
status: draft
updated: 2026-11-01
---

## Aufgabe

Schreib einen Taschenrechner. Er fragt nach einer Zahl, einem Rechenzeichen
und einer zweiten Zahl, rechnet und gibt die Rechnung mit ihrem Ergebnis aus.
Danach fragt er `Noch eine Rechnung? (j/n)` und beginnt von vorn, solange die
Antwort `j` lautet.

Für die Zahlen schreibst du eine Funktion `get_number(prompt)`, die so lange
fragt, bis sich die Eingabe mit `float()` in eine Zahl umwandeln lässt, wie
`get_int` in [[python-exceptions]]. Als Rechenzeichen versteht der Rechner
`+`, `-`, `*` und `/`; bei jedem anderen Zeichen gibt er eine Meldung aus,
ebenso bei einer Division durch null. In keinem Fall soll das Programm mit
einer Fehlermeldung abbrechen.

In dieser Übung kommt alles aus den vier Teilen des Pfads zusammen: eine
Eingabe und eigene Funktionen aus dem ersten, Entscheidungen aus dem zweiten,
eine Schleife aus dem dritten und abgefangene Fehler aus dem vierten.

## So soll es aussehen

```text
Erste Zahl: 12
Rechenzeichen (+ - * /): *
Zweite Zahl: drei
Das ist keine Zahl, versuch es noch einmal.
Zweite Zahl: 3
12.0 * 3.0 = 36.0
Noch eine Rechnung? (j/n) j
Erste Zahl: 7
Rechenzeichen (+ - * /): /
Zweite Zahl: 0
Durch null lässt sich nicht teilen.
Noch eine Rechnung? (j/n) j
Erste Zahl: 2
Rechenzeichen (+ - * /): %
Zweite Zahl: 5
Das Rechenzeichen % kenne ich nicht.
Noch eine Rechnung? (j/n) n
Tschüss!
```

Kommazahlen tippst du mit Punkt ein, also `2.5`, denn `float("2,5")` löst
einen `ValueError` aus, und dein Rechner fragt dann einfach noch einmal.

## Dein Programm

```python
def get_number(prompt):
    # So lange fragen, bis float() die Eingabe umwandeln kann
    return float(input(prompt))


def main():
    a = get_number("Erste Zahl: ")
    operator = input("Rechenzeichen (+ - * /): ").strip()
    b = get_number("Zweite Zahl: ")
    # Je nach Rechenzeichen rechnen und die Rechnung ausgeben

    # Fragen, ob noch eine Rechnung folgen soll


main()
```

> [!HINT]
> Für `get_number` brauchst du dasselbe Muster wie für `get_int`: eine
> Schleife `while True`, darin `try` mit `return float(input(prompt))` und
> darunter `except ValueError` mit einem Hinweis. Für die Wiederholung legst
> du in `main` alles, was zu einer Rechnung gehört, in eine zweite Schleife
> `while True` und verlässt sie mit `break`, wenn die Antwort nicht `j` ist.

> [!HINT]
> Prüfe das Rechenzeichen mit `if operator == "+":`, dann mit `elif` die
> übrigen drei, und fange mit `else` alles andere ab. Im Zweig für `/` setzt
> du die Division in einen `try`-Block mit `except ZeroDivisionError`.

> [!SOLUTION]
> ```python
> def get_number(prompt):
>     while True:
>         try:
>             return float(input(prompt))
>         except ValueError:
>             print("Das ist keine Zahl, versuch es noch einmal.")
>
>
> def main():
>     while True:
>         a = get_number("Erste Zahl: ")
>         operator = input("Rechenzeichen (+ - * /): ").strip()
>         b = get_number("Zweite Zahl: ")
>
>         if operator == "+":
>             print(f"{a} + {b} = {a + b}")
>         elif operator == "-":
>             print(f"{a} - {b} = {a - b}")
>         elif operator == "*":
>             print(f"{a} * {b} = {a * b}")
>         elif operator == "/":
>             try:
>                 print(f"{a} / {b} = {a / b}")
>             except ZeroDivisionError:
>                 print("Durch null lässt sich nicht teilen.")
>         else:
>             print(f"Das Rechenzeichen {operator} kenne ich nicht.")
>
>         again = input("Noch eine Rechnung? (j/n) ").strip().lower()
>         if again != "j":
>             break
>     print("Tschüss!")
>
>
> main()
> ```
>
> `get_number` sorgt dafür, dass `main` sich um falsche Eingaben nicht
> kümmern muss, denn welche Texte eine Zahl ergeben, kann nur `float()` selbst
> entscheiden, und deshalb ist `except ValueError` dort der richtige Weg. Bei
> der Division durch null wäre eine Prüfung vorab mit `if b == 0:` genauso
> gut, weil sich der Problemfall mit einer einzigen Bedingung beschreiben
> lässt. Die Lösung fängt den `ZeroDivisionError` ab, weil die Übung
> `except` üben soll, und du kannst die Prüfung vorab als zweiten Weg
> ausprobieren.
> Wichtig ist in beiden Fällen, dass nur die eine Zeile mit der Division
> geschützt ist und nicht der ganze Rechner.

## Für Schnelle

Bring deinem Rechner `**` für Potenzen bei, sodass `2 ** 10` das Ergebnis
`1024.0` liefert. Rechne außerdem `0.1 + 0.2` und sieh dir das Ergebnis an:
Kommazahlen sind im Computer nicht immer exakt gespeichert. Speichere das
Ergebnis deshalb zuerst in einer Variablen `result` und gib es mit
`round(result, 2)` auf zwei Nachkommastellen gerundet aus.
