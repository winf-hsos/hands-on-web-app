---
name: weekly-order
description: How the Lindenhof farm shop works out its weekly order to the suppliers. Use it whenever an order or restocking is due.
---

# Weekly order

1. Get the sales of the last four weeks with `sales`: from 28 days ago up to
   and including yesterday. The average per week is the units sold divided
   by 4.
2. The target stock is the average per week times 1.5. For perishable
   products, with a shelf life of 7 days or less, it is the average times
   1.0, so that nothing spoils. Round the target up to a whole unit.
3. The need is the target minus the units on the shelf (`stock`). If it is
   zero or less, order nothing.
4. Round the need up to a whole number of packs (`pack_size` in `products`).
5. Make one order per supplier. Products from the own farm are never
   ordered.
6. Show the order as a table per supplier with average, target, stock and
   quantity, and place it only after the owner has agreed.
