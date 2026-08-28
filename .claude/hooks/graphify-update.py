#!/usr/bin/env python3
"""PostToolUse hook: refresh the graphify knowledge graph after a file edit.

Reads the hook payload on stdin, resolves the repository the edited file
belongs to, and runs `graphify update` on it. Written in Python rather than a
shell pipeline so the same hook works on macOS, Linux and Windows without
depending on jq or a POSIX shell.

Always exits 0: a failure to index must never block an edit.
"""

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


def edited_path(payload):
    """Pull the edited file path out of a PostToolUse payload."""
    for section, key in (("tool_input", "file_path"), ("tool_response", "filePath")):
        value = (payload.get(section) or {}).get(key)
        if value:
            return Path(value)
    return None


def repo_root(start):
    """Walk up from `start` to the directory holding .git, or None."""
    for candidate in [start, *start.parents]:
        if (candidate / ".git").exists():
            return candidate
    return None


def find_graphify():
    """Locate the graphify executable, including uv/pipx dirs not on PATH."""
    found = shutil.which("graphify")
    if found:
        return found
    for extra in (Path.home() / ".local" / "bin", Path.home() / ".local" / "share" / "uv" / "tools" / "graphifyy" / "bin"):
        for name in ("graphify", "graphify.exe"):
            candidate = extra / name
            if candidate.exists():
                return str(candidate)
    return None


def main():
    try:
        payload = json.load(sys.stdin)
    except (json.JSONDecodeError, ValueError):
        return

    target = edited_path(payload)
    if target is None:
        return

    root = repo_root(target.parent if target.parent.exists() else Path.cwd())
    if root is None:
        # Edited a file outside any repository — nothing to index.
        return

    graphify = find_graphify()
    if graphify is None:
        # Not installed on this machine; stay silent rather than nagging on
        # every edit. `graphify --version` is the thing to check by hand.
        return

    subprocess.run(
        [graphify, "update", str(root)],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        timeout=110,
        check=False,
    )


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass
    sys.exit(0)
