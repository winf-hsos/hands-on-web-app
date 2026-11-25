"""The tools of the group shop: they read the products, the stock and the sales."""

from mcp_lite import FastMCP
import lindenhof

mcp = FastMCP("shop")


@mcp.tool()
def products() -> list:
    """All products of the Lindenhof farm shop: id, name, unit, price, supplier, pack size and shelf life."""
    return lindenhof.products()


@mcp.tool()
def stock() -> dict:
    """How many units of each product are on the shelf right now."""
    return lindenhof.stock()


@mcp.tool()
def sales(from_date: str, to_date: str) -> dict:
    """Units sold of each product between two dates (YYYY-MM-DD), both included."""
    return lindenhof.sales(from_date, to_date)


mcp.run()
