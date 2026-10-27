"""Builds the small survey excerpt used in the data science lessons.

Source: the online panel survey "mds12 Schoko/Milch" by Prof. Ulrich Enneking
(Hochschule Osnabrueck), which is not public. This script keeps 30 people
and ten variables, with readable English names and labelled values instead of
codes, and drops everything that could point to a person: no postcode, no
income, no free text, nobody from a category with only a handful of answers.

The 30 people are chosen, not just drawn, so that the excerpt shows what the
lessons need: every kind of diet, missing values that mean "not asked", and
the odd price that is surely a typo.

Usage: python scripts/survey-excerpt.py <path to mds12_schoko_milch.csv>
Writes knowledge/media/datasets/milk_survey.csv.
"""

import csv
import random
import sys
from pathlib import Path

STATES = [
    'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen',
    'Mecklenburg-Vorpommern', 'Niedersachsen', 'Nordrhein-Westfalen', 'Rheinland-Pfalz',
    'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen',
]
GENDER = {'1': 'male', '2': 'female'}
TOWN = {'1': 'city', '2': 'large town', '3': 'town', '4': 'small town', '5': 'very small town', '6': 'village'}
DIET = {'0': 'omnivore', '1': 'flexitarian', '2': 'vegetarian', '3': 'vegan', '4': 'pescetarian'}
MILK = {'4': 'daily', '3': 'weekly', '2': 'monthly', '1': 'rarely'}

COLUMNS = ['id', 'age', 'gender', 'state', 'town_size', 'household_size', 'diet',
           'organic_share', 'milk_freq', 'milk_brand', 'price_too_expensive']


def number(text):
    """'2.5' -> '2.5', '3.0' -> '3', '' -> '' (missing)."""
    if text in ('', 'NA'):
        return ''
    value = float(text)
    return str(int(value)) if value == int(value) else str(value)


def person(row):
    # An A/B test showed one of two brands; the price for Weihenstephan is in
    # the first price column, the one for alpro in the second (the numbers of
    # answers match the group sizes in the codebook).
    brand = row['AB1619pvonw2f'] if row['AB1619pvonw2f'] not in ('', 'NA') else ''
    price = row['u017pvonwzuteuer1'] if brand == 'Weihenstephan' else row['u017pvonwzuteuer2'] if brand == 'alpro' else ''
    return {
        'age': number(row['Q002alter']),
        'gender': GENDER.get(row['q004geschlecht'], ''),
        'state': STATES[int(row['q003land']) - 1],
        'town_size': TOWN.get(row['d044stadt'], ''),
        'household_size': number(row['d042hhzahl']),
        'diet': DIET.get(row['v041nofleisch'], ''),
        'organic_share': number(row['v032bioanteil']),
        'milk_freq': MILK.get(row['v007freq3_mi'], ''),
        'milk_brand': brand,
        'price_too_expensive': number(price),
    }


def main(source):
    with open(source, encoding='utf-8', newline='') as f:
        people = [person(r) for r in csv.DictReader(f) if r['q004geschlecht'] in GENDER]
    random.seed(2026)
    random.shuffle(people)

    chosen = []
    def take(test, n):
        for p in people:
            if len([c for c in chosen if test(c)]) >= n:
                return
            if p not in chosen and test(p):
                chosen.append(p)

    # every diet at least once, a few who were asked about the milk price
    for diet, n in [('vegan', 1), ('vegetarian', 2), ('pescetarian', 1), ('flexitarian', 5)]:
        take(lambda p, d=diet: p['diet'] == d, n)
    # prices for both brands, so that they can be compared by group
    for brand in ('alpro', 'Weihenstephan'):
        take(lambda p, b=brand: p['milk_brand'] == b and p['price_too_expensive'] != '' and float(p['price_too_expensive']) <= 5, 4)
    # one price that cannot be meant as euros for a litre of milk
    take(lambda p: p['price_too_expensive'] != '' and float(p['price_too_expensive']) >= 50, 1)
    take(lambda p: p['milk_freq'] == '', 3)
    take(lambda p: True, 30)
    chosen = chosen[:30]
    random.shuffle(chosen)

    target = Path(__file__).resolve().parent.parent / 'knowledge/media/datasets/milk_survey.csv'
    target.parent.mkdir(parents=True, exist_ok=True)
    with open(target, 'w', encoding='utf-8', newline='') as f:
        out = csv.DictWriter(f, fieldnames=COLUMNS, lineterminator='\n')
        out.writeheader()
        for i, p in enumerate(chosen, 1):
            out.writerow({'id': i, **p})
    print(f'wrote {len(chosen)} rows to {target}')


if __name__ == '__main__':
    main(sys.argv[1])
