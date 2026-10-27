"""Builds the downloadable version of the survey "mds12 Schoko/Milch".

Source: the part of the online panel survey by Prof. Ulrich Enneking
(Hochschule Osnabrueck) that he agreed to publish on the platform: all
2,811 people, with the questions of the main study and of the two studies
on chocolate and milk (2026-10-27). This script leaves every value as it is
and only drops the columns that could point to a person: the full postcode,
which alone is unique for about half of those who gave one, and every open
answer, in which people may write anything about themselves.

Usage: python scripts/survey-download.py <path to the part as received>
Writes knowledge/media/datasets/mds12_schoko_milch.csv.
"""

import csv
import sys
from pathlib import Path

DROPPED = [
    'd048plz',
    # open answers: "other" fields, unaided brand recall, reasons
    'v041nofleisch_other', 'v041diaet_other', 'v008ort_other', 'd037schule_other',
    'd046miete_other', 'm071ungestuetzt', 'm072gestuetzt_other', 'm073haferpro_other',
    's055ungestuetzt', 's056gestuetzt_other', 's061info_other', 'S053grund2',
]


def main(source):
    with open(source, encoding='utf-8', newline='') as f:
        rows = list(csv.reader(f))
    head = rows[0]
    missing = [c for c in DROPPED if c not in head]
    if missing:
        sys.exit(f'not in the source: {", ".join(missing)}')
    keep = [i for i, name in enumerate(head) if name not in DROPPED]

    target = Path(__file__).resolve().parent.parent / 'knowledge/media/datasets/mds12_schoko_milch.csv'
    with open(target, 'w', encoding='utf-8', newline='') as f:
        writer = csv.writer(f, lineterminator='\n')
        for row in rows:
            writer.writerow([row[i] for i in keep])
    print(f'{len(rows) - 1} rows, {len(keep)} columns -> {target}')


if __name__ == '__main__':
    main(sys.argv[1])
