---
type: dataset
code: 5862
title: Produkte aus dem REWE-Onlineshop
summary: >-
  Gut 9.400 Lebensmittel und Drogerieartikel mit Preis, Kategorie, Herkunft,
  Bio-Kennzeichnung und Nährwerten: echte Daten mit Lücken, Dubletten und
  einigen Werten, die nicht stimmen können.
url: https://github.com/winf-hsos/data-analytics-code
file: rewe_products.csv
level: 1
duration: 5
topics: [getting-data, exploring-data, data-pitfalls]
modules: [ea]
areas: [ds]
relations:
  see_also: [eda-self-assessment]
status: draft
updated: 2026-10-27
---

## Worum es geht

Die Daten stammen aus dem Onlineshop von REWE und wurden für die Lehre
gesammelt; sie liegen im Repository zu den Data-Analytics-Kursen, das oben
verlinkt ist. Jede Zeile ist ein Produkt mit Name, Marke, Kategorie in drei
Stufen, Herkunftsland, Preis und, wo angegeben, den Nährwerten.

| Spalten | Inhalt |
|---|---|
| `product_id`, `gtin` | Nummer im Shop und Strichcode |
| `product_name`, `brand` | Name und Marke |
| `product_category`, `product_sub_category`, `product_type` | Kategorie, grob bis fein, etwa `Frische und Kühlung`, `Milch und Milchersatz`, `H-Milch` |
| `country_of_origin` | Herkunftsland |
| `bio`, `vegan`, `vegetarian` | Kennzeichnungen als `TRUE` oder `FALSE` |
| `price`, `grammage` | Preis in Euro und die Packungsangabe als Text |
| `energy_in_kcal` bis `salt_in_gram` | Nährwerte je 100 g oder 100 ml |

Die Spaltennamen sind in snake_case, so wie sie `janitor::clean_names()` aus
den Namen der Originaldatei macht. Weggelassen sind gegenüber dem Original
Produkttexte, Zutatenlisten, Bildlinks und eine immer leere Spalte, damit die
Datei schnell lädt.

## Worauf man achten sollte

- **Nicht jedes Produkt hat Nährwerte.** Bei Drogerieartikeln, Haushaltswaren
  und Tierbedarf fehlen sie naturgemäß, bei manchen Lebensmitteln auch.
  `vegan` und `vegetarian` sind nur bei rund jedem zehnten Produkt angegeben.
- **Manche Produkte stehen mehrfach in der Tabelle**, Zeile für Zeile
  gleich. Gut 9.400 Zeilen sind knapp 8.000 verschiedene Produkte.
- **Nicht jeder Wert stimmt.** Wer die Nährwerte ansieht, findet einige, die
  so nicht sein können.

Genau das macht die Daten für die explorative Datenanalyse geeignet; der
[[eda-self-assessment|Selbsttest]] arbeitet damit.
