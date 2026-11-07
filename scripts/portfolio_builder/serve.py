#!/usr/bin/env python3
"""Multi-threaded static server for SAWA UNITED Portfolio preview on 0.0.0.0:8080."""
import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class PreviewHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "public, max-age=300")
        super().end_headers()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    root = os.path.abspath(
        os.path.join(os.path.dirname(__file__), "..", "..", "portfolio")
    )
    handler = partial(PreviewHandler, directory=root)
    server = ThreadingHTTPServer(("0.0.0.0", port), handler)
    print(f"Serving {root} on http://0.0.0.0:{port}", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
