---
name: daily-closing
description: 'Load this skill for cash questions and closing: how much cash the shop took (cash sales), how much was counted in the cash box, whether the box is right, or /daily-closing. Load it before reading till tools.'
---

# Daily closing

## 1. Choose the workflow before calling any till tool

| Owner asks | Workflow |
| --- | --- |
| “How much cash did we take?” or asks for cash sales | **Sales only**: read the register log and report `cash_sales_eur`. This is not the counted cash or expected cash. |
| “How much was counted?” or asks for the amount physically in the box | **Count only**: read the cash count and report `counted_cash_eur`. This alone does not tell you whether the box is right. |
| “Is the cash box right?” or asks to check/reconcile it without closing | **Check**: read both tools and reconcile; do not write. |
| `/daily-closing` or asks to close the day or record its closing | **Close**: read both tools, reconcile, and write the closing even if it is outside tolerance. |

## 2. Read only the data needed

Use the requested day as `D` in `YYYY-MM-DD`. If the owner did not specify a day or said “today,” use `D = ""` on the first read: the till resolves it to the shop's today. For an ambiguous date ask the owner before proceeding.

1. **Sales only, Check, Close:** call `till_register_log` with `{"date": D}`. Take `cash_sales_eur` from this result. For **Sales only**, report it as cash sales for the result's `date` and stop. Otherwise also take `card_sales_eur` and `returned_bottles_and_jars` (already the combined item count). Set `D` to the returned `date` before the next call.
2. **Count only, Check, Close:** call `till_cash_count` with `{"date": D}`. Take `counted_cash_eur` from this result. For **Count only**, report it as counted cash for the result's `date` and stop. For **Check** or **Close**, the two results must have the same `date`.
3. If a required read fails, a required field is missing, or a returned date does not match the requested day (when explicit) or the other result, stop and ask the owner to resolve it. Do not guess or write an incomplete closing.

## 3. Reconcile in integer cents (no tool call)

1. Convert `cash_sales_eur` and `counted_cash_eur` to integer cents by multiplying by 100 (e.g. `234.7` euros is `23470` cents). Save card sales separately for reporting and writing. **Never add card sales to the box.**
2. `refund_cents = returned_bottles_and_jars × 15`. Each item refunds €0.15 from the box.
3. `subtotal_cents = 10000 + cash_sales_cents`. The opening float is €100.00.
4. `expected_cents = subtotal_cents − refund_cents`.
5. `difference_cents = counted_cents − expected_cents`. A negative number means a shortage.
6. Check against the original inputs before proceeding: `expected_cents − 10000 + refund_cents = cash_sales_cents` and `expected_cents + difference_cents = counted_cents`. If either fails, redo the arithmetic from the tool values. If you cannot verify it, report the problem instead of writing unverified figures.
7. If `-200 <= difference_cents <= 200`, use note `Within tolerance`. Otherwise use `Outside tolerance — check cash discrepancy` and flag it to the owner. Exactly ±€2.00 is within tolerance.

Example (not live data): cash sales €234.70, 8 returns, counted €331.50. Refund `8 × 15 = 120`; subtotal `10000 + 23470 = 33470`; expected `33470 − 120 = 33350`; difference `33150 − 33350 = -200` cents. Expected €333.50, difference −€2.00, within tolerance.

## 4. Record only a Close, then report

- **Check:** skip the write and report the figures below.
- **Close:** call `till_write_cashbook` once, with exactly the keys below. Use numeric euros, not strings or cents: divide each computed cents value by 100. Copy cash sales, card sales and counted cash from their respective reads.

  | Argument | Value |
  | --- | --- |
  | `date` | `D`, the matching date from the reads |
  | `cash_sales_eur` | Register log's `cash_sales_eur` |
  | `card_sales_eur` | Register log's `card_sales_eur` |
  | `deposit_refunds_eur` | `refund_cents / 100` |
  | `expected_cash_eur` | `expected_cents / 100` |
  | `counted_cash_eur` | Cash count's `counted_cash_eur` |
  | `difference_eur` | `difference_cents / 100`, with its sign |
  | `note` | The tolerance note from step 3 |

Report the date, cash and card sales, refunds, expected cash, counted cash, and signed difference, with two decimal places. Say whether the difference needs attention. For **Close**, say it was recorded only if the tool returned `written: true`; otherwise report that the write was not confirmed. Do not retry the write automatically.
