"""Builds the REWE product data used in the data science self-assessment.

Source: data/rewe_products.csv in Nicolas Meseth's repository
github.com/winf-hsos/data-analytics-code, product data from the REWE online
shop. This script keeps every product but only the columns the exercises
need, and names them in snake_case, as janitor::clean_names() would: product
texts, ingredient lists, image links and the always empty manufacturer are
dropped, so that the file loads quickly in the browser.

Usage: python scripts/rewe-excerpt.py <path to rewe_products.csv>
Writes knowledge/media/datasets/rewe_products.csv.
"""

import csv
import re
import sys
from pathlib import Path

COLUMNS = [
    'productId', 'gtin', 'productName', 'brand', 'productCategory', 'productSubCategory',
    'productType', 'countryOfOrigin', 'bio', 'vegan', 'vegetarian', 'price', 'grammage',
    'servingSize', 'servingSizeUom', 'energyInKcal', 'fatInGram', 'fatSatInGram',
    'proteinInGram', 'carbsInGram', 'sugarInGram', 'saltInGram',
]
LOGICAL = {'True': 'TRUE', 'False': 'FALSE', 'true': 'TRUE', 'false': 'FALSE'}


def snake(name):
    return re.sub(r'(?<=[a-z0-9])([A-Z])', r'_\1', name).lower()


def main(source):
    with open(source, encoding='utf-8', newline='') as f:
        rows = list(csv.DictReader(f))
    target = Path(__file__).resolve().parent.parent / 'knowledge/media/datasets/rewe_products.csv'
    with open(target, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, lineterminator='\n')
        writer.writerow([snake(c) for c in COLUMNS])
        for row in rows:
            writer.writerow([LOGICAL.get(row[c], row[c]) for c in COLUMNS])
    print(f'{len(rows)} rows, {len(COLUMNS)} columns -> {target}')


if __name__ == '__main__':
    main(sys.argv[1])
