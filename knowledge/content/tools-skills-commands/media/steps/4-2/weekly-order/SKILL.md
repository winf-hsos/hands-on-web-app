---
name: weekly-order
description: 'Load this skill for weekly orders, supplier orders or restocking, including /weekly-order. Read products, stock and sales, then show a proposal before asking the owner to approve it.'
---

# Weekly order

## 1. Read products, stock and sales before calculating

1. Call `shop_products` with `{}`. Use each product's `id`, `name`, `supplier`, `pack_size` and `shelf_life_days` from the result. Exclude all rows with `supplier = "own farm"` (including eggs and potatoes). If no suppliers were named, use all remaining suppliers. If suppliers were named, match them to the remaining catalog names (ignoring case), then use the exact catalog names. If a name does not match, ask which eligible supplier the owner means; do not silently switch to all suppliers.
2. Call `shop_stock` with `{}`. Use its `date` as the shop's today. Take each product's stock from `units_on_shelf[id]`. **Stock must come from this call**, not from memory, sales, or a guess.
3. Count back 28 calendar days from the stock date for `from_date` and 1 calendar day for `to_date`. Call `shop_sales` with `{"from_date": "<from_date>", "to_date": "<to_date>"}`, replacing both values with `YYYY-MM-DD` dates. Both endpoints are included: exactly 28 days, ending yesterday. Example: stock date `2026-11-25` → `{"from_date":"2026-10-28","to_date":"2026-11-24"}`. Take units sold from `units_sold[id]`, not `days_open`.
4. If any required call fails, any needed field or product id is missing, or the sales dates don't match the request, stop and tell the owner what is missing or wrong. Do not substitute zero for missing data. Do not propose or place an order from incomplete data.

## 2. Compute each eligible product's row (no tool call)

Join the tool results by product `id`. For each product of a selected supplier, let `S = units_sold[id]`, `stock = units_on_shelf[id]`, and `P = pack_size`.

1. `average = S / 4`. Do not round it before calculating the target.
2. If `shelf_life_days <= 7`, `target = ceil(S / 4)` (average × 1.0). Otherwise `target = ceil(3 × S / 8)` (average × 1.5). `ceil` means round up to the next whole number only if there is a fraction.
3. `need = target − stock`. If `need <= 0`, use `quantity = 0`. Otherwise use `packs = ceil(need / P)` and `quantity = packs × P`. The order quantity is **units**, not packs.

Example (not live data): 85 units sold, shelf life 14 days, stock 9, pack size 6 → average 21.25, target `ceil(255 / 8) = 32`, need 23, packs 4, quantity 24 units.

## 3. Show the proposal and stop (no order tool call)

Show one table per selected supplier with product, average units/week, target units, stock units and proposed order units. Show zero quantities as zero. If every quantity is zero, say nothing needs ordering and stop. Otherwise ask the owner to approve the displayed proposal and end the turn. **Do not call `orders_place_order` on this turn.** The initial request, the slash command and a tool permission prompt are not approval of the displayed proposal.

## 4. Place only the approved orders

1. Continue only after the owner explicitly approves the displayed proposal in a later message. If approval is unclear, ask which proposal the owner approves. If the owner changes it, show the updated proposal and wait for approval again. If the owner declines, stop.
2. For each approved supplier with at least one positive quantity, call `orders_place_order` once. Set `supplier` to that supplier's exact catalog name. Set `items` to one `{"product": "<catalog id>", "quantity": <positive integer units>}` per approved row **for that supplier only**. Omit zero quantities and anything from `own farm`. Never merge suppliers or send an empty order.

   Example shape, not an order to send: `{"supplier":"Meadow Dairy","items":[{"product":"yoghurt","quantity":24}]}`.

3. If OpenCode asks for permission to call the tool, respect that separate gate. Report the returned order number per successful supplier. If a call is denied or fails, report which order was not confirmed; do not claim it was sent or automatically retry it.
