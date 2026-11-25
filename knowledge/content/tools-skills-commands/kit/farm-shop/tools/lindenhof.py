"""The records of the Lindenhof farm shop: products, stock, sales, the till and the cash book.

This file stands in for the shop's database and its self-service till. The
tools in shop.py, orders.py and till.py read and write through it, so you do
not need to read it for the experiment.

The shop is invented. Its sales are generated from the date, so everyone who
asks on the same day gets the same numbers. To check your agent, run

    python tools/lindenhof.py [YYYY-MM-DD]

which prints the order and the daily closing that the shop's rules lead to,
worked out without any language model.
"""

import csv
import datetime as dt
import json
import math
import os
import random
import sys
from pathlib import Path

FOLDER = Path(__file__).resolve().parent.parent  # the folder farm-shop
SHOP = "Lindenhof farm shop"
FLOAT = 100.00  # change left in the cash box every evening
DEPOSIT = 0.15  # paid back in cash for every returned glass bottle or jar

# id, name, unit, price in EUR, supplier, pack size, shelf life in days, mean units sold per week, stock today
PRODUCTS = [
    ("milk", "milk", "1 l glass bottle", 1.80, "Meadow Dairy", 6, 7, 40, 8),
    ("yoghurt", "yoghurt", "500 g glass jar", 2.90, "Meadow Dairy", 6, 14, 22, 9),
    ("butter", "butter", "250 g", 3.40, "Meadow Dairy", 10, 30, 15, 6),
    ("cheese", "mountain cheese", "200 g", 4.90, "Meadow Dairy", 8, 60, 12, 30),
    ("lettuce", "lettuce", "1 head", 1.60, "Green Valley Growers", 12, 5, 30, 4),
    ("carrots", "carrots", "1 kg bag", 2.50, "Green Valley Growers", 10, 21, 18, 10),
    ("apples", "apples", "1 kg bag", 3.20, "Green Valley Growers", 10, 30, 25, 9),
    ("honey", "honey", "500 g jar", 7.90, "Bee Garden", 12, 730, 6, 3),
    ("jam", "strawberry jam", "340 g jar", 4.50, "Bee Garden", 12, 365, 8, 14),
    ("eggs", "eggs", "box of 6", 3.30, "own farm", 1, 21, 60, 35),
    ("potatoes", "potatoes", "2.5 kg bag", 4.20, "own farm", 1, 60, 20, 12),
]
FIELDS = ["id", "name", "unit", "price_eur", "supplier", "pack_size", "shelf_life_days"]
DIFFERENCES = [0.00, -0.50, 1.00, -4.50, 0.20, -12.00, 0.00]  # cash box against the books, Monday to Sunday


class ToolError(ValueError):
    """A request the shop cannot answer; the agent sees the message."""


def today():
    # LINDENHOF_TODAY replays a past day, such as the day of a test run
    fixed = os.environ.get("LINDENHOF_TODAY")
    return dt.date.fromisoformat(fixed) if fixed else dt.date.today()


def parse_date(text):
    try:
        return dt.date.fromisoformat(str(text).strip())
    except ValueError:
        raise ToolError(f"'{text}' is not a date, use the form YYYY-MM-DD")


def day_sales(day):
    """Units sold of every product on one day; the shop is closed on Sundays."""
    if day.weekday() == 6:
        return {p[0]: 0 for p in PRODUCTS}
    rng = random.Random(day.toordinal())
    weight = 1.35 if day.weekday() == 5 else 0.93  # Saturdays are busy
    return {p[0]: max(0, round(p[7] / 6 * weight * rng.uniform(0.6, 1.4))) for p in PRODUCTS}


def day_till(day):
    """What the self-service till recorded on one day and what lay in the cash box in the evening."""
    units = day_sales(day)
    price = {p[0]: p[3] for p in PRODUCTS}
    rng = random.Random(day.toordinal() * 7 + 1)
    cash = card = 0.0
    for pid, n in units.items():
        for _ in range(n):
            if rng.random() < 0.7:
                cash += price[pid]
            else:
                card += price[pid]
    returned = 0 if day.weekday() == 6 else rng.randint(4, 14)
    refunds = round(returned * DEPOSIT, 2)
    difference = 0.0 if day.weekday() == 6 else DIFFERENCES[day.weekday()]
    return {
        "receipts": sum(units.values()) // 3,
        "cash_sales_eur": round(cash, 2),
        "card_sales_eur": round(card, 2),
        "returned_bottles_and_jars": returned,
        "counted_cash_eur": round(FLOAT + cash - refunds + difference, 2),
    }


def past_day(text):
    day = parse_date(text or today().isoformat())
    if day > today():
        raise ToolError("that day has not happened yet")
    return day


# ------------------------------------------------------------------ what the tools call

def products():
    return [dict(zip(FIELDS, p[:7])) for p in PRODUCTS]


def stock():
    return {"date": today().isoformat(), "units_on_shelf": {p[0]: p[8] for p in PRODUCTS}}


def sales(from_date, to_date):
    start, end = parse_date(from_date), parse_date(to_date)
    if end < start:
        raise ToolError("to_date lies before from_date")
    if end > today():
        raise ToolError(f"there are no sales after today ({today().isoformat()})")
    if (end - start).days > 366:
        raise ToolError("ask for at most one year at a time")
    total = {p[0]: 0 for p in PRODUCTS}
    open_days = 0
    day = start
    while day <= end:
        if day.weekday() != 6:
            open_days += 1
        for pid, n in day_sales(day).items():
            total[pid] += n
        day += dt.timedelta(days=1)
    return {"from_date": start.isoformat(), "to_date": end.isoformat(), "days_open": open_days, "units_sold": total}


def place_order(supplier, items):
    supplier = str(supplier or "").strip()
    suppliers = sorted({p[4] for p in PRODUCTS if p[4] != "own farm"})
    if supplier not in suppliers:
        raise ToolError(f"unknown supplier '{supplier}', the suppliers are: {', '.join(suppliers)}")
    known = {p[0]: p for p in PRODUCTS}
    lines = []
    for item in items or []:
        pid, qty = item.get("product"), item.get("quantity")
        if pid not in known:
            raise ToolError(f"unknown product '{pid}', use the ids from products")
        if known[pid][4] != supplier:
            raise ToolError(f"{pid} does not come from {supplier}")
        if not isinstance(qty, int) or qty <= 0:
            raise ToolError(f"the quantity of {pid} must be a whole number above zero")
        lines.append({"product": pid, "quantity": qty})
    if not lines:
        raise ToolError("an order needs at least one item")
    number = f"{today():%Y%m%d}-{sum(map(ord, supplier)) % 900 + 100}"
    out = FOLDER / "outbox"
    out.mkdir(exist_ok=True)
    path = out / f"order-{today().isoformat()}-{supplier.lower().replace(' ', '-')}.json"
    order = {"order": number, "supplier": supplier, "date": today().isoformat(), "items": lines}
    path.write_text(json.dumps(order, indent=2), encoding="utf-8")
    return {"order": number, "supplier": supplier, "items": len(lines), "saved_as": path.relative_to(FOLDER).as_posix()}


def register_log(date):
    day = past_day(date)
    till = day_till(day)
    return {"date": day.isoformat(), **{k: till[k] for k in ["receipts", "cash_sales_eur", "card_sales_eur", "returned_bottles_and_jars"]}}


def cash_count(date):
    day = past_day(date)
    return {"date": day.isoformat(), "counted_cash_eur": day_till(day)["counted_cash_eur"]}


def write_cashbook(date, cash_sales_eur, card_sales_eur, deposit_refunds_eur, expected_cash_eur, counted_cash_eur, difference_eur, note):
    row = {"date": parse_date(date).isoformat()}
    amounts = [cash_sales_eur, card_sales_eur, deposit_refunds_eur, expected_cash_eur, counted_cash_eur, difference_eur]
    names = ["cash_sales_eur", "card_sales_eur", "deposit_refunds_eur", "expected_cash_eur", "counted_cash_eur", "difference_eur"]
    for key, value in zip(names, amounts):
        try:
            row[key] = f"{float(value):.2f}"
        except (TypeError, ValueError):
            raise ToolError(f"{key} must be a number")
    row["note"] = str(note or "").replace("\n", " ")
    path = FOLDER / "cashbook.csv"
    new = not path.exists()
    with path.open("a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(row))
        if new:
            w.writeheader()
        w.writerow(row)
    return {"written": True, "file": "cashbook.csv", "date": row["date"]}


# ------------------------------------------------------------------ the expected results

def solution(day):
    print(f"Reference for {day.isoformat()} ({day:%A})\n")
    start, end = day - dt.timedelta(days=28), day - dt.timedelta(days=1)
    sold = {p[0]: 0 for p in PRODUCTS}
    d = start
    while d <= end:
        for pid, n in day_sales(d).items():
            sold[pid] += n
        d += dt.timedelta(days=1)
    print(f"Weekly order, sales {start} to {end}:")
    for supplier in sorted({p[4] for p in PRODUCTS if p[4] != "own farm"}):
        print(supplier)
        for pid, name, _, _, sup, pack, life, _, on_shelf in PRODUCTS:
            if sup != supplier:
                continue
            per_week = sold[pid] / 4
            target = math.ceil(per_week * (1.0 if life <= 7 else 1.5))
            need = max(0, target - on_shelf)
            qty = math.ceil(need / pack) * pack
            print(f"  {pid:9} {per_week:5.2f}/week  target {target:3}  stock {on_shelf:3}  order {qty}")
    till = day_till(day)
    refunds = round(till["returned_bottles_and_jars"] * DEPOSIT, 2)
    expected = round(FLOAT + till["cash_sales_eur"] - refunds, 2)
    diff = round(till["counted_cash_eur"] - expected, 2)
    print(f"\nDaily closing: cash {till['cash_sales_eur']:.2f}, card {till['card_sales_eur']:.2f}, "
          f"refunds {till['returned_bottles_and_jars']} x {DEPOSIT:.2f} = {refunds:.2f}")
    print(f"  expected {FLOAT:.2f} + {till['cash_sales_eur']:.2f} - {refunds:.2f} = {expected:.2f}, "
          f"counted {till['counted_cash_eur']:.2f}, difference {diff:+.2f} -> {'check' if abs(diff) > 2 else 'ok'}")


if __name__ == "__main__":
    solution(parse_date(sys.argv[1]) if len(sys.argv) > 1 else today())
