---
description: Reconcile and record the farm shop's end-of-day till closing.
---

Close the till for the requested date (if no date is provided, use today). Follow the `daily-closing` skill.

1. Call `till_register_log` and `till_cash_count` for that same date. If either result is unavailable, stop and ask the owner for the missing information; do not guess.
2. Calculate deposit refunds as (returned bottles + returned jars) × €0.15. Calculate expected cash as €100.00 + cash sales − deposit refunds, and difference as counted cash − expected cash. Keep all amounts to cents. Card sales are recorded but are not part of the cash calculation.
3. Call `till_write_cashbook` with the date, cash sales, card sales, deposit refunds, expected cash, counted cash, difference, and a short note stating whether the difference is within the inclusive ±€2.00 tolerance. If outside tolerance, flag the discrepancy for the owner.
4. Report the figures and whether the difference needs attention. Always record the closing, even when there is a discrepancy.
