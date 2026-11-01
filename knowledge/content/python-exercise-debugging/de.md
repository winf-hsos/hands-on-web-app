---
type: exercise
code: 1544
title: "Übung: Fehlersuche"
summary: >-
  Ein kleines Kassenprogramm enthält vier Fehler, drei mit Fehlermeldung und
  einen, der nur eine falsche Summe liefert. Du findest und behebst sie einen
  nach dem anderen.
objectives:
  intro: "In dieser Übung suchst und behebst du die Fehler in einem fertigen Programm und kannst danach:"
  goals:
    - "aus der letzten Zeile einer Fehlermeldung Art und Grund des Fehlers ablesen und die genannte Zeile im Programm finden"
    - "einen `SyntaxError`, einen `NameError` und einen `TypeError` an ihrer Meldung erkennen und beheben"
    - "einen Fehler ohne Meldung finden, indem du Zwischenwerte in einer Schleife ausgibst"
    - "einen Fehler nach dem anderen beheben und nach jeder Änderung neu prüfen, ob die Ausgabe dem Vorbild entspricht"
level: 1
duration: 20
topics: [programming-with-python]
modules: [dup]
relations:
  requires: [python-error-messages]
status: draft
updated: 2026-11-01
---

## Aufgabe

Eine Kasse soll die Preise der eingescannten Artikel auflisten, ihre Zahl und
die Summe ausgeben, nach einem Rabatt in Prozent fragen und den Betrag nach
Abzug des Rabatts nennen. Das Programm dafür ist schon geschrieben, aber es
enthält vier Fehler: Drei davon führen zu einer Fehlermeldung, und einer
bewirkt nur, dass am Ende eine falsche Summe herauskommt.

Führe das Programm aus, lies die Fehlermeldung und behebe den Fehler, den sie
meldet. Führe es dann erneut aus, denn hinter jedem behobenen Fehler kann der
nächste zum Vorschein kommen. Wenn keine Meldung mehr erscheint, vergleiche
die Ausgabe Zeile für Zeile mit dem Vorbild unten und suche den letzten
Fehler. Bei der Frage nach dem Rabatt gibst du `10` ein.

## So soll es aussehen

```text
Kassenbon
  1.29 Euro
  2.49 Euro
  0.99 Euro
  3.79 Euro
Artikel: 4
Summe: 8.56 Euro
Rabatt in Prozent? 10
Mit 10 % Rabatt: 7.70 Euro
```

## Dein Programm

```python
def with_discount(price, percent)
    return price - price * percent / 100


def main():
    # Preise der eingescannten Artikel in Euro
    prices = [1.29, 2.49, 0.99, 3.79]
    print("Kassenbon")
    total = 0
    for price in prices:
        print(f"  {price:.2f} Euro")
        total = price
    print("Artikel: " + len(prices))
    print(f"Summe: {total:.2f} Euro")
    percent = int(input("Rabatt in Prozent? "))
    final = with_discount(totl, percent)
    print(f"Mit {percent} % Rabatt: {final:.2f} Euro")


main()
```

> [!HINT]
> Lies jede Meldung von unten nach oben, wie in [[python-error-messages]]. Die
> letzte Zeile nennt Art und Grund des Fehlers, und darüber steht die Nummer
> der Zeile, in der Python nicht weiterkam. Beim ersten Fehler erscheint noch
> keine einzige Ausgabe, und das verrät schon, welche Art von Fehler es sein
> muss.

> [!HINT]
> Wenn das Programm durchläuft, aber `Summe: 3.79 Euro` ausgibt, schau dir an,
> was in der Schleife mit `total` passiert. Setze dafür in die Schleife unter
> die Zeile mit `total` ein `print("total ist jetzt", total)` und vergleiche
> die Werte mit dem, was du im Kopf ausrechnen würdest.

> [!SOLUTION]
> ```python
> def with_discount(price, percent):
>     return price - price * percent / 100
>
>
> def main():
>     # Preise der eingescannten Artikel in Euro
>     prices = [1.29, 2.49, 0.99, 3.79]
>     print("Kassenbon")
>     total = 0
>     for price in prices:
>         print(f"  {price:.2f} Euro")
>         total = total + price
>     print(f"Artikel: {len(prices)}")
>     print(f"Summe: {total:.2f} Euro")
>     percent = int(input("Rabatt in Prozent? "))
>     final = with_discount(total, percent)
>     print(f"Mit {percent} % Rabatt: {final:.2f} Euro")
>
>
> main()
> ```
>
> Die vier Fehler zeigen sich in dieser Reihenfolge: Hinter
> `def with_discount(price, percent)` fehlt der Doppelpunkt (`SyntaxError`),
> `"Artikel: " + len(prices)` verbindet einen Text mit einer Zahl
> (`TypeError`, behoben mit einem f-String oder `str(len(prices))`), und
> `totl` ist ein Tippfehler für `total` (`NameError`). Der vierte Fehler
> meldet sich nicht: `total = price` ersetzt die Summe bei jedem Durchlauf
> durch den aktuellen Preis, sodass am Ende nur der letzte übrig bleibt, und
> erst `total = total + price` zählt die Preise zusammen.

## Für Schnelle

Lass die Kasse zusätzlich ausgeben, wie viele Euro der Rabatt spart, und
prüfe mit `if`, ob der eingegebene Rabatt zwischen 0 und 100 liegt. Liegt er
außerhalb, soll das Programm `Ungültiger Rabatt` ausgeben und ohne Rabatt
weiterrechnen.
