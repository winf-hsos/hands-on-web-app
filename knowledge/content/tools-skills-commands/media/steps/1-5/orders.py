"""The tool of the group orders: it sends an order to a supplier."""

from mcp_lite import FastMCP
import lindenhof

mcp = FastMCP("orders")


@mcp.tool()
def place_order(supplier: str, items: list[dict]) -> dict:
    """Send an order to one supplier. Items are product ids with a whole number of units, such as [{"product": "honey", "quantity": 12}]."""
    return lindenhof.place_order(supplier, items)


mcp.run()
