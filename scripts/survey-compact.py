"""Builds a compact version of the milk and chocolate survey for teaching.

Source: the published download of the online panel survey "mds12 Schoko/Milch"
by Prof. Ulrich Enneking (Hochschule Osnabrueck), already without postcode and
free text. This script keeps every respondent but only a handful of questions,
with readable English names and labelled values instead of codes. The first
eleven columns are the same as in the 30-row excerpt `survey`, so code from
the lessons runs on this table unchanged.

Dropped on purpose: income, education, employment and the two people who chose
"diverse" as gender (too few to analyse, easy to single out).

Usage: python scripts/survey-compact.py knowledge/media/datasets/mds12_schoko_milch.csv knowledge/media/datasets/milk_survey_compact.csv
"""

import csv
import sys

STATES = [
    'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen', 'Hamburg', 'Hessen',
    'Mecklenburg-Vorpommern', 'Niedersachsen', 'Nordrhein-Westfalen', 'Rheinland-Pfalz',
    'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen',
]
GENDER = {'1': 'male', '2': 'female'}
TOWN = {'1': 'city', '2': 'large town', '3': 'town', '4': 'small town', '5': 'very small town', '6': 'village'}
DIET = {'0': 'omnivore', '1': 'flexitarian', '2': 'vegetarian', '3': 'vegan', '4': 'pescetarian'}
MILK = {'4': 'daily', '3': 'weekly', '2': 'monthly', '1': 'rarely'}
MEDIA = {'4': 'daily', '3': 'weekly', '2': 'monthly', '1': 'rarely', '0': 'never'}
BRAND = {'Berchtesgardener Land': 'Berchtesgadener Land'}  # typo in the source

COLUMNS = [
    'id', 'age', 'gender', 'state', 'town_size', 'household_size', 'diet',
    'organic_share', 'milk_freq', 'milk_brand', 'price_too_expensive',
    'shops_discounter', 'shops_organic',
    'eco_conscious', 'prefers_organic', 'loves_meat', 'loves_cooking',
    'rated_brand', 'brand_quality', 'brand_buy',
    'tiktok',
]


def number(text):
    """'2.5' -> '2.5', '3.0' -> '3', '' -> '' (missing)."""
    if text in ('', 'NA'):
        return ''
    value = float(text)
    return str(int(value)) if value == int(value) else str(value)


def flag(text):
    """0/1 column of a multiple choice question -> TRUE/FALSE."""
    return {'1': 'TRUE', '0': 'FALSE'}.get(number(text), '')


def person(row):
    # Price A/B test: the price for Weihenstephan is in the first column, the
    # one for alpro in the second (same rule as scripts/survey-excerpt.py).
    brand = row['AB1619pvonw2f'] if row['AB1619pvonw2f'] not in ('', 'NA') else ''
    price = row['u017pvonwzuteuer1'] if brand == 'Weihenstephan' else row['u017pvonwzuteuer2'] if brand == 'alpro' else ''
    rated = row['AX010midiff7f'] if row['AX010midiff7f'] not in ('', 'NA') else ''
    return {
        'age': number(row['Q002alter']),
        'gender': GENDER[number(row['q004geschlecht'])],
        'state': STATES[int(float(row['q003land'])) - 1],
        'town_size': TOWN.get(number(row['d044stadt']), ''),
        'household_size': number(row['d042hhzahl']),
        'diet': DIET.get(number(row['v041nofleisch']), ''),
        'organic_share': number(row['v032bioanteil']),
        'milk_freq': MILK.get(number(row['v007freq3_mi']), ''),
        'milk_brand': brand,
        'price_too_expensive': number(price),
        'shops_discounter': flag(row['v008ort_1discount']),
        'shops_organic': flag(row['v008ort_7bioladen']),
        'eco_conscious': number(row['p030green_5umweltbewusst']),
        'prefers_organic': number(row['p031bio_1lieberbio']),
        'loves_meat': number(row['p033meat_1fan']),
        'loves_cooking': number(row['p035koch_2hobby']),
        'rated_brand': BRAND.get(rated, rated),
        'brand_quality': number(row['B010midiff7_1quali']),
        'brand_buy': number(row['B010midiff7_14kauf']),
        'tiktok': MEDIA.get(number(row['d216medien_18tiktok']), ''),
    }


def main(source, target):
    with open(source, encoding='utf-8', newline='') as f:
        people = [person(r) for r in csv.DictReader(f) if number(r['q004geschlecht']) in GENDER]
    with open(target, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=COLUMNS, lineterminator='\n')
        writer.writeheader()
        for i, p in enumerate(people, start=1):
            writer.writerow({'id': i, **p})
    print(f'{len(people)} rows, {len(COLUMNS)} columns -> {target}')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
