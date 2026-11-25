---
name: daily-closing
description: Close the Lindenhof farm shop for one day, reconcile the till, and record the closing in the cash book.
---

# Daily closing

Use this workflow to close the Lindenhof farm shop for one day.

## Rules

- The cash box starts each morning with **€100.00** in change.
- Cash sales go into the box; card sales do not.
- Each returned deposit bottle or jar is refunded from the box at **€0.15 per item**.
- Expected closing cash = €100.00 + cash sales − deposit refunds.
- Difference = counted cash − expected closing cash. A difference within **±€2.00**, inclusive, is acceptable. Report a difference greater than €2.00 in either direction.
- Record every closing in the cash book, including acceptable differences.

## Procedure

1. Get the day's till register log and the counted cash amount for the same date. If either is unavailable, ask the owner rather than inventing figures.
2. From the register log, use the recorded cash sales and card sales. Calculate deposit refunds as the total returned bottles and jars multiplied by €0.15. Use the till's recorded return counts; do not treat card sales as cash in the box.
3. Calculate expected cash and the difference using the rules above. Keep euro amounts to cents.
4. Write the closing to the cash book with the date, cash sales, card sales, deposit refunds, expected cash, counted cash, difference, and a short note. Mention whether the difference is within tolerance; if it exceeds €2.00 in either direction, clearly flag it for the owner.
5. Briefly report the closing figures and whether the difference needs attention. Do not alter or omit a closing because of a discrepancy.

## Closing report

After completing and recording the cash-book closing, create a clear, one-page Typst report at `reports/closing-<date>.typ` (replace `<date>` with the closing date in `YYYY-MM-DD` form). Create the `reports` directory if needed. The report is an audit trail and must show the inputs and every calculation step/intermediate result, including:

- Date and till-register figures: cash sales, card sales, returned bottles, and returned jars.
- Deposit-return calculation: bottle count + jar count = total returns, then total returns × €0.15 = refund.
- Expected cash calculation: €100.00 opening float + cash sales − refunds = expected closing cash. Explicitly note card sales are excluded from cash.
- Counted cash, difference calculation (counted − expected), and whether the difference is within ±€2.00 or needs the owner's attention.
- Confirmation that the cash-book entry was made, with the figures recorded.

Keep it to one page without omitting any figures or steps. Compile it to PDF using `typst compile reports/closing-<date>.typ` and check that compilation succeeds (and the resulting PDF is one page). If compilation fails, fix the Typst source and retry. Do not claim a PDF was created unless compilation succeeded.
