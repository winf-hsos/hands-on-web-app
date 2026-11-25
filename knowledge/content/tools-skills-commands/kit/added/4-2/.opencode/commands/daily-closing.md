---
description: Reconcile and record the farm shop's end-of-day till closing.
agent: shop
---

Requested closing date: `$ARGUMENTS`

1. First call `skill` with `{"name":"daily-closing"}`. Follow its **Close** workflow, not **Check**. If the skill cannot be loaded, stop and report the problem.
2. Call `till_register_log` with `{"date": D}`, where `D` is the requested `YYYY-MM-DD`, or `""` if blank or today. Use the returned `date` as `D` and call `till_cash_count` with `{"date": D}`. Follow the skill's missing-data and date checks. A cash count alone is not a closing.
3. Follow the skill's integer-cent steps and arithmetic checks. Use the register's `returned_bottles_and_jars` once, and keep card sales out of expected cash.
4. Call `till_write_cashbook` with the skill's exact argument table (amounts in euros). Write even if the difference is outside tolerance. Report the result as directed by the skill.
