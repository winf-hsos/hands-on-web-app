// An item has one type or several (Nicolas, 2026-11-02): the slides to a
// concept carry its article as well, `type: [lesson, slides]`, and are found
// under both. The first type is the one the item is shown as.

/** All types of an item, the first one first. */
export const typesOf = (lead) => [lead.type].flat();

/** Whether an item is of this type, among others or alone. */
export const hasType = (lead, type) => typesOf(lead).includes(type);
