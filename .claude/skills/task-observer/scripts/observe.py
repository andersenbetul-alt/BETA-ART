#!/usr/bin/env python3
"""Append-only ledger of observed work patterns.

Observations live in .claude/observations/log.jsonl, one JSON object per line,
relative to the repository root. Adding a pattern that closely matches an
existing one bumps its occurrence count instead of creating a duplicate, so the
count stays meaningful as the signal for whether a pattern has earned a change.
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path

MERGE_THRESHOLD = 0.75  # similarity above which two patterns are the same one


def repo_root() -> Path:
    try:
        out = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"],
            capture_output=True, text=True, check=True,
        )
        return Path(out.stdout.strip())
    except (subprocess.CalledProcessError, FileNotFoundError):
        return Path.cwd()


def log_path() -> Path:
    return repo_root() / ".claude" / "observations" / "log.jsonl"


def now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def load() -> list[dict]:
    path = log_path()
    if not path.exists():
        return []
    records = []
    for line in path.read_text().splitlines():
        line = line.strip()
        if line:
            records.append(json.loads(line))
    return records


def save(records: list[dict]) -> None:
    path = log_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in records))


def normalize(text: str) -> str:
    return re.sub(r"[^a-z0-9 ]+", " ", text.lower()).split().__str__()


def similarity(a: str, b: str) -> float:
    return SequenceMatcher(None, normalize(a), normalize(b)).ratio()


def cmd_add(args: argparse.Namespace) -> int:
    records = load()

    for record in records:
        if record["status"] != "open":
            continue
        if similarity(record["pattern"], args.pattern) >= MERGE_THRESHOLD:
            record["occurrences"] += 1
            record["last_seen"] = now()
            if args.evidence and args.evidence not in record["evidence"]:
                record["evidence"] += "; " + args.evidence
            if args.cost:
                record["cost"] = args.cost
            if args.proposal:
                record["proposal"] = args.proposal
            save(records)
            print(f"#{record['id']} seen again — now {record['occurrences']} occurrences")
            print(f"  {record['pattern']}")
            return 0

    record = {
        "id": max((r["id"] for r in records), default=0) + 1,
        "pattern": args.pattern,
        "evidence": args.evidence,
        "occurrences": 1,
        "cost": args.cost or "unknown",
        "proposal": args.proposal or "",
        "status": "open",
        "first_seen": now(),
        "last_seen": now(),
    }
    records.append(record)
    save(records)
    print(f"#{record['id']} recorded — {record['pattern']}")
    return 0


def cmd_list(args: argparse.Namespace) -> int:
    records = [r for r in load() if args.status in ("all", r["status"])]
    if not records:
        print(f"No {args.status} observations.")
        return 0

    records.sort(key=lambda r: (-r["occurrences"], r["id"]))
    for r in records:
        times = "time" if r["occurrences"] == 1 else "times"
        print(f"#{r['id']}  [{r['status']}]  seen {r['occurrences']} {times}  cost: {r['cost']}")
        print(f"    {r['pattern']}")
        print(f"    evidence: {r['evidence']}")
        if r["proposal"]:
            print(f"    proposal: {r['proposal']}")
        if r.get("note"):
            print(f"    note: {r['note']}")
        print()

    ready = [r for r in records if r["status"] == "open" and r["occurrences"] >= 3]
    if ready:
        ids = ", ".join(f"#{r['id']}" for r in ready)
        print(f"Ready for review (3+ occurrences): {ids}")
    return 0


def cmd_resolve(args: argparse.Namespace) -> int:
    records = load()
    for record in records:
        if record["id"] == args.id:
            record["status"] = args.as_
            record["note"] = args.note
            record["last_seen"] = now()
            save(records)
            print(f"#{record['id']} marked {args.as_}")
            return 0
    print(f"No observation #{args.id}", file=sys.stderr)
    return 1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)

    add = sub.add_parser("add", help="record a pattern (or bump an existing one)")
    add.add_argument("--pattern", required=True, help="one sentence naming the repetition")
    add.add_argument("--evidence", required=True, help="concrete occurrences")
    add.add_argument("--cost", help="what the repetition costs")
    add.add_argument("--proposal", help="the change you would make")
    add.set_defaults(func=cmd_add)

    ls = sub.add_parser("list", help="show observations")
    ls.add_argument("--status", default="open", choices=["open", "promoted", "dismissed", "all"])
    ls.set_defaults(func=cmd_list)

    res = sub.add_parser("resolve", help="close an observation")
    res.add_argument("id", type=int)
    res.add_argument("--as", dest="as_", required=True, choices=["promoted", "dismissed"])
    res.add_argument("--note", default="", help="where it went, or why it was rejected")
    res.set_defaults(func=cmd_resolve)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
