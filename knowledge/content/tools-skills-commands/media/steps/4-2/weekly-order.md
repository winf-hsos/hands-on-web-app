---
description: Work out this week's order and place it once the owner has agreed
agent: shop
---

Requested suppliers: `$ARGUMENTS`

1. First call `skill` with `{"name":"weekly-order"}`. If it cannot be loaded, stop and report the problem.
2. Follow the skill's read steps: `shop_products` with `{}`, `shop_stock` with `{}`, then `shop_sales` with `{"from_date":"<stock date minus 28 days>","to_date":"<stock date minus 1 day>"}` using actual `YYYY-MM-DD` dates. If the supplier argument is blank, plan for all external suppliers; otherwise plan only for the named suppliers. Never include `own farm`.
3. Compute quantities with the skill and show a table per supplier. If there is anything to order, ask the owner to approve the proposal, then stop. **Do not call `orders_place_order` during this command's initial turn.**
4. Only after approval in a later message, follow the skill's placement step: one `orders_place_order` call per approved supplier with a nonempty order. Pass `{"supplier":"<exact catalog supplier>","items":[{"product":"<catalog id>","quantity": <positive integer units>}]}` with the approved rows for that supplier only.
