"""Tools for the Lindenhof farm shop, served over the Model Context Protocol (MCP).

One file, no packages to install: it speaks JSON-RPC on stdin and stdout, the
way OpenCode, LM Studio and other agents start a local MCP server. Each group
of tools is its own server, so you can switch them on one at a time:

    python tools/farm_shop.py shop      products, stock, sales
    python tools/farm_shop.py orders    place_order
    python tools/farm_shop.py till      register_log, cash_count, write_cashbook

The shop is invented. Its sales are generated from the date, so everyone who
asks on the same day gets the same numbers.

    python tools/farm_shop.py solution [YYYY-MM-DD]

prints the order and the daily closing that the rules in the experiment lead
to, for checking your agent.
"""

import csv
import datetime as dt
import json
import math
import random
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent.parent  # the project folder
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
RETURNABLE = {"milk", "yoghurt"}  # glass with a deposit
DIFFERENCES = [0.00, -0.50, 1.00, -4.50, 0.20, -12.00, 0.00]  # cash box against the books, Monday to Sunday


# ------------------------------------------------------------------ the shop's world

def today():
    return dt.date.today()


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
    receipts = 0
    for pid, n in units.items():
        for _ in range(n):
            if rng.random() < 0.7:
                cash += price[pid]
            else:
                card += price[pid]
    receipts = sum(units.values()) // 3
    returned = 0 if day.weekday() == 6 else rng.randint(4, 14)
    refunds = round(returned * DEPOSIT, 2)
    difference = 0.0 if day.weekday() == 6 else DIFFERENCES[day.weekday()]
    counted = round(FLOAT + cash - refunds + difference, 2)
    return {
        "receipts": receipts,
        "cash_sales_eur": round(cash, 2),
        "card_sales_eur": round(card, 2),
        "returned_bottles_and_jars": returned,
        "counted_cash_eur": counted,
        "difference_eur": difference,
    }


# ------------------------------------------------------------------ tools

class ToolError(Exception):
    pass


def t_products(_):
    return [dict(zip(FIELDS, p[:7])) for p in PRODUCTS]


def t_stock(_):
    return {"date": today().isoformat(), "units_on_shelf": {p[0]: p[8] for p in PRODUCTS}}


def t_sales(args):
    start, end = parse_date(args.get("from_date")), parse_date(args.get("to_date"))
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


def t_place_order(args):
    supplier = str(args.get("supplier", "")).strip()
    suppliers = sorted({p[4] for p in PRODUCTS if p[4] != "own farm"})
    if supplier not in suppliers:
        raise ToolError(f"unknown supplier '{supplier}', the suppliers are: {', '.join(suppliers)}")
    items = args.get("items") or []
    known = {p[0]: p for p in PRODUCTS}
    lines = []
    for item in items:
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
    out = HERE / "outbox"
    out.mkdir(exist_ok=True)
    path = out / f"order-{today().isoformat()}-{supplier.lower().replace(' ', '-')}.json"
    path.write_text(json.dumps({"order": number, "supplier": supplier, "date": today().isoformat(), "items": lines}, indent=2), encoding="utf-8")
    return {"order": number, "supplier": supplier, "items": len(lines), "saved_as": str(path.relative_to(HERE))}


def t_register_log(args):
    day = parse_date(args.get("date") or today().isoformat())
    if day > today():
        raise ToolError("that day has not happened yet")
    till = day_till(day)
    return {"date": day.isoformat(), "receipts": till["receipts"], "cash_sales_eur": till["cash_sales_eur"],
            "card_sales_eur": till["card_sales_eur"], "returned_bottles_and_jars": till["returned_bottles_and_jars"]}


def t_cash_count(args):
    day = parse_date(args.get("date") or today().isoformat())
    if day > today():
        raise ToolError("that day has not happened yet")
    return {"date": day.isoformat(), "counted_cash_eur": day_till(day)["counted_cash_eur"]}


def t_write_cashbook(args):
    day = parse_date(args.get("date"))
    row = {"date": day.isoformat()}
    for key in ["cash_sales_eur", "card_sales_eur", "deposit_refunds_eur", "expected_cash_eur", "counted_cash_eur", "difference_eur"]:
        try:
            row[key] = f"{float(args.get(key)):.2f}"
        except (TypeError, ValueError):
            raise ToolError(f"{key} must be a number")
    row["note"] = str(args.get("note", "")).replace("\n", " ")
    path = HERE / "cashbook.csv"
    new = not path.exists()
    with path.open("a", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(row))
        if new:
            w.writeheader()
        w.writerow(row)
    return {"written": True, "file": "cashbook.csv", "date": row["date"]}


DATE = {"type": "string", "description": "a date in the form YYYY-MM-DD"}
NUMBER = {"type": "number"}
GROUPS = {
    "shop": [
        ("products", f"All products of the {SHOP}: id, name, unit, price, supplier, pack size and shelf life.", {}, [], t_products),
        ("stock", "How many units of each product are on the shelf right now.", {}, [], t_stock),
        ("sales", "Units sold of each product between two dates, both included.",
         {"from_date": DATE, "to_date": DATE}, ["from_date", "to_date"], t_sales),
    ],
    "orders": [
        ("place_order", "Send an order to one supplier. Items are product ids with a whole number of units.",
         {"supplier": {"type": "string"},
          "items": {"type": "array", "items": {"type": "object", "properties": {"product": {"type": "string"}, "quantity": {"type": "integer"}}, "required": ["product", "quantity"]}}},
         ["supplier", "items"], t_place_order),
    ],
    "till": [
        ("register_log", "What the self-service till recorded on one day: receipts, cash and card sales, and how many deposit bottles and jars were returned.",
         {"date": DATE}, ["date"], t_register_log),
        ("cash_count", "The cash counted in the cash box at the end of one day.", {"date": DATE}, ["date"], t_cash_count),
        ("write_cashbook", "Add the closing of one day to the cash book.",
         {"date": DATE, "cash_sales_eur": NUMBER, "card_sales_eur": NUMBER, "deposit_refunds_eur": NUMBER,
          "expected_cash_eur": NUMBER, "counted_cash_eur": NUMBER, "difference_eur": NUMBER, "note": {"type": "string"}},
         ["date", "cash_sales_eur", "card_sales_eur", "deposit_refunds_eur", "expected_cash_eur", "counted_cash_eur", "difference_eur", "note"],
         t_write_cashbook),
    ],
}


# ------------------------------------------------------------------ MCP over stdio

def serve(group):
    tools = {name: (desc, props, req, fn) for name, desc, props, req, fn in GROUPS[group]}

    def reply(msg_id, result=None, error=None):
        out = {"jsonrpc": "2.0", "id": msg_id}
        out["error" if error else "result"] = error or result
        sys.stdout.write(json.dumps(out) + "\n")
        sys.stdout.flush()

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
        except json.JSONDecodeError:
            continue
        method, msg_id, params = msg.get("method"), msg.get("id"), msg.get("params") or {}
        if msg_id is None:
            continue  # a notification, such as notifications/initialized
        if method == "initialize":
            reply(msg_id, {
                "protocolVersion": params.get("protocolVersion", "2025-06-18"),
                "capabilities": {"tools": {}},
                "serverInfo": {"name": f"farm-shop-{group}", "version": "1.0.0"},
            })
        elif method == "ping":
            reply(msg_id, {})
        elif method == "tools/list":
            reply(msg_id, {"tools": [
                {"name": n, "description": d, "inputSchema": {"type": "object", "properties": p, "required": r}}
                for n, (d, p, r, _) in tools.items()
            ]})
        elif method == "tools/call":
            name = params.get("name")
            if name not in tools:
                reply(msg_id, error={"code": -32602, "message": f"unknown tool {name}"})
                continue
            try:
                result, failed = tools[name][3](params.get("arguments") or {}), False
            except ToolError as e:
                result, failed = {"error": str(e)}, True
            reply(msg_id, {"content": [{"type": "text", "text": json.dumps(result, ensure_ascii=False)}], "isError": failed})
        else:
            reply(msg_id, error={"code": -32601, "message": f"unknown method {method}"})


# ------------------------------------------------------------------ the expected results

def solution(day):
    print(f"Reference for {day.isoformat()} ({day:%A})\n")
    start, end = day - dt.timedelta(days=28), day - dt.timedelta(days=1)
    global today
    real_today, today = today, (lambda: day)
    sold = t_sales({"from_date": start.isoformat(), "to_date": end.isoformat()})["units_sold"]
    today = real_today
    print(f"Weekly order, sales {start} to {end}:")
    for supplier in sorted({p[4] for p in PRODUCTS if p[4] != "own farm"}):
        lines = []
        for pid, name, _, _, sup, pack, life, _, stock in PRODUCTS:
            if sup != supplier:
                continue
            per_week = sold[pid] / 4
            target = math.ceil(per_week * (1.0 if life <= 7 else 1.5))
            need = max(0, target - stock)
            qty = math.ceil(need / pack) * pack
            lines.append(f"  {pid:9} {per_week:5.2f}/week  target {target:3}  stock {stock:3}  order {qty}")
        print(supplier)
        print("\n".join(lines))
    till = day_till(day)
    refunds = round(till["returned_bottles_and_jars"] * DEPOSIT, 2)
    expected = round(FLOAT + till["cash_sales_eur"] - refunds, 2)
    diff = round(till["counted_cash_eur"] - expected, 2)
    print(f"\nDaily closing: cash {till['cash_sales_eur']:.2f}, card {till['card_sales_eur']:.2f}, "
          f"refunds {till['returned_bottles_and_jars']} x {DEPOSIT:.2f} = {refunds:.2f}")
    print(f"  expected {FLOAT:.2f} + {till['cash_sales_eur']:.2f} - {refunds:.2f} = {expected:.2f}, "
          f"counted {till['counted_cash_eur']:.2f}, difference {diff:+.2f} -> {'check' if abs(diff) > 2 else 'ok'}")


if __name__ == "__main__":
    arg = sys.argv[1] if len(sys.argv) > 1 else ""
    if arg in GROUPS:
        serve(arg)
    elif arg == "solution":
        solution(parse_date(sys.argv[2]) if len(sys.argv) > 2 else today())
    else:
        sys.exit("usage: python tools/farm_shop.py shop|orders|till|solution [YYYY-MM-DD]")
