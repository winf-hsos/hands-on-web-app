"""A small MCP server without anything to install.

It offers the part of FastMCP from the official Python package `mcp` that the
farm shop needs, with the same names, so that a tool file reads the same as
one written for the real package:

    from mcp_lite import FastMCP

    mcp = FastMCP("shop")

    @mcp.tool()
    def stock() -> dict:
        "How many units of each product are on the shelf right now."
        return ...

    mcp.run()

The name of the function becomes the name of the tool, its parameters with
their types become the tool's inputs, and its docstring becomes the
description that the language model reads. `run()` then answers OpenCode on
stdin and stdout in the Model Context Protocol (JSON-RPC, one message per
line). With `pip install mcp`, the first line can become
`from mcp.server.fastmcp import FastMCP` and everything else stays.
"""

import inspect
import json
import sys
import typing

TYPES = {str: "string", int: "integer", float: "number", bool: "boolean", list: "array", dict: "object"}


def schema(annotation):
    """The JSON schema of one parameter, from its Python type."""
    origin = typing.get_origin(annotation) or annotation
    out = {"type": TYPES.get(origin, "string")}
    args = typing.get_args(annotation)
    if origin is list and args:
        out["items"] = schema(args[0])
    return out


class FastMCP:
    def __init__(self, name):
        self.name = name
        self.tools = {}

    def tool(self):
        """Register the function below as a tool."""
        def register(fn):
            self.tools[fn.__name__] = fn
            return fn
        return register

    def describe(self, name, fn):
        params = inspect.signature(fn).parameters
        hints = typing.get_type_hints(fn)
        return {
            "name": name,
            "description": inspect.getdoc(fn) or "",
            "inputSchema": {
                "type": "object",
                "properties": {p: schema(hints.get(p, str)) for p in params},
                "required": [p for p, v in params.items() if v.default is inspect.Parameter.empty],
            },
        }

    def run(self):
        """Answer OpenCode until it closes the connection."""
        for line in sys.stdin:
            try:
                msg = json.loads(line)
            except json.JSONDecodeError:
                continue
            if msg.get("id") is None:
                continue  # a notification, such as notifications/initialized
            self.answer(msg.get("id"), msg.get("method"), msg.get("params") or {})

    def answer(self, msg_id, method, params):
        if method == "initialize":
            result = {
                "protocolVersion": params.get("protocolVersion", "2025-06-18"),
                "capabilities": {"tools": {}},
                "serverInfo": {"name": self.name, "version": "1.0.0"},
            }
        elif method == "ping":
            result = {}
        elif method == "tools/list":
            result = {"tools": [self.describe(n, fn) for n, fn in self.tools.items()]}
        elif method == "tools/call" and params.get("name") in self.tools:
            try:
                value, failed = self.tools[params["name"]](**(params.get("arguments") or {})), False
            except (ValueError, TypeError) as e:
                value, failed = {"error": str(e)}, True
            result = {"content": [{"type": "text", "text": json.dumps(value, ensure_ascii=False)}], "isError": failed}
        else:
            return self.send({"jsonrpc": "2.0", "id": msg_id, "error": {"code": -32601, "message": f"unknown method or tool: {method} {params.get('name', '')}".strip()}})
        self.send({"jsonrpc": "2.0", "id": msg_id, "result": result})

    def send(self, msg):
        sys.stdout.write(json.dumps(msg) + "\n")
        sys.stdout.flush()
