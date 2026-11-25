"""The tools of the group till: they read the self-service till and the cash box and write the cash book."""

from mcp_lite import FastMCP
import lindenhof

mcp = FastMCP("till")


@mcp.tool()
def register_log(date: str) -> dict:
    """What the self-service till recorded on one day (YYYY-MM-DD): receipts, cash and card sales, and how many deposit bottles and jars were returned."""
    return lindenhof.register_log(date)


@mcp.tool()
def cash_count(date: str) -> dict:
    """The cash counted in the cash box at the end of one day (YYYY-MM-DD)."""
    return lindenhof.cash_count(date)


@mcp.tool()
def write_cashbook(date: str, cash_sales_eur: float, card_sales_eur: float, deposit_refunds_eur: float,
                   expected_cash_eur: float, counted_cash_eur: float, difference_eur: float, note: str) -> dict:
    """Add the closing of one day (YYYY-MM-DD) to the cash book, with all amounts in euros and a short note."""
    return lindenhof.write_cashbook(date, cash_sales_eur, card_sales_eur, deposit_refunds_eur,
                                    expected_cash_eur, counted_cash_eur, difference_eur, note)


mcp.run()
