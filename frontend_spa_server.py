from __future__ import annotations

import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class SpaRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, directory: str, **kwargs):
        self._spa_directory = Path(directory)
        super().__init__(*args, directory=directory, **kwargs)

    def do_GET(self) -> None:
        requested = self.path.split("?", 1)[0].split("#", 1)[0]
        candidate = (self._spa_directory / requested.lstrip("/")).resolve()

        if requested not in {"/", ""} and candidate.exists():
            return super().do_GET()

        self.path = "/index.html"
        return super().do_GET()


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Serve the built frontend with SPA route fallback.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=3000)
    parser.add_argument("--directory", default="frontend/dist")
    return parser.parse_args()


if __name__ == "__main__":
    args = parse_args()
    root = Path(args.directory).resolve()
    handler = lambda *handler_args, **handler_kwargs: SpaRequestHandler(  # noqa: E731
        *handler_args,
        directory=str(root),
        **handler_kwargs,
    )
    server = ThreadingHTTPServer((args.host, args.port), handler)
    print(f"Frontend SPA server running on http://{args.host}:{args.port}")
    server.serve_forever()
