#!/usr/bin/env python3
"""
Remove duplicate top-of-page sticky bars from marketing /analyse/** pages.
The (marketing) layout already renders components/Navbar.tsx — these local
nav/div blocks caused a second header (logo + CTAs) on many guides.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ANALYSE = ROOT / "app" / "(marketing)" / "analyse"


def strip_once(text: str) -> tuple[str, bool]:
    orig = text
    t = text

    # 0) Analyse hub: {/* ── STICKY NAV ── */} + <nav>...</nav>
    t = re.sub(
        r"\n\s*\{\s*/\*\s*──\s*STICKY\s+NAV\s*──\s*\*/\s*\}\s*\n\s*<nav[\s\S]*?</nav>\s*",
        "\n",
        t,
        count=1,
        flags=re.IGNORECASE,
    )

    # 1) Adelaide / Darwin / Hobart / Canberra hub: {/* NAV */} + sticky <nav>
    t = re.sub(
        r"\n\s*\{\s*/\*\s*NAV\s*\*/\s*\}\s*\n\s*<nav[\s\S]*?</nav>\s*",
        "\n",
        t,
        count=1,
    )

    # 2) {/* Sticky Nav */} + <nav>...</nav> (multiline opening tag)
    t = re.sub(
        r"\n\s*\{\s*/\*\s*Sticky\s+Nav\s*\*/\s*\}\s*\n\s*<nav[\s\S]*?</nav>\s*",
        "\n",
        t,
        count=1,
        flags=re.IGNORECASE,
    )

    # 3) {/* Sticky nav */} + block until {/* Hero */} (handles nested <div> in sticky bar)
    t = re.sub(
        r"\n\s*\{\s*/\*\s*Sticky\s+nav\s*\*/\s*\}[\s\S]*?(?=\n\s*\{\s*/\*\s*Hero)",
        "\n",
        t,
        count=1,
        flags=re.IGNORECASE,
    )

    # 4) Breadcrumb sticky <nav> (Melbourne restaurant etc.)
    t = re.sub(
        r"\n\s*\{\s*/\*[\s\S]*?Breadcrumb\s+nav[\s\S]*?\*/\s*\}\s*\n\s*<nav[\s\S]*?</nav>\s*",
        "\n",
        t,
        count=1,
    )

    # 5) Perth hub: logo-mark sticky bar (no "Sticky Nav" comment)
    t = re.sub(
        r"\n\s*<nav style=\{\{ background: S\.white, borderBottom: `1px solid \$\{S\.border\}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 \}\}>[\s\S]*?logo-mark\.svg[\s\S]*?</nav>\s*\n",
        "\n",
        t,
        count=1,
    )

    # 6) Brisbane-style thin sticky row (Links only, no nested div)
    t = re.sub(
        r"\n\s*<div style=\{\{ position: 'sticky', top: 0, zIndex: 50, background: S\.white, borderBottom: `1px solid \$\{S\.border\}`, padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' \}\}>[\s\S]*?</div>\s*",
        "\n",
        t,
        count=1,
    )

    # 7) Standard suburb sticky <nav> (height 56, S.white, zIndex 50) — one per file
    t = re.sub(
        r"\n\s*<nav style=\{\{ background: S\.white, borderBottom: `1px solid \$\{S\.border\}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 \}\}>[\s\S]*?</nav>\s*",
        "\n",
        t,
        count=1,
    )

    # 8) Adelaide suburb variant with hex white
    t = re.sub(
        r"\n\s*<nav style=\{\{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 \}\}>[\s\S]*?</nav>\s*",
        "\n",
        t,
        count=1,
    )

    # 9) One-line compact <nav ... zIndex: 50 }}>...</nav> at start of page tree (Cranbourne etc.)
    t = re.sub(
        r"<nav style=\{\{ background: S\.white, borderBottom: `1px solid \$\{S\.border\}`, padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 \}\}>[\s\S]*?</nav>",
        "",
        t,
        count=1,
    )

    # 10) Sydney retail one-liner (logo-mark + Analyse free)
    t = re.sub(
        r"\n\s*<nav style=\{\{ background:S\.white,borderBottom:`1px solid \$\{S\.border\}`,padding:'0 24px',height:56,display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:0,zIndex:50\}\}>[\s\S]*?</nav>\s*",
        "\n",
        t,
        count=1,
    )

    changed = t != orig
    return t, changed


def process_file(path: Path) -> bool:
    raw = path.read_text(encoding="utf-8")
    t = raw
    for _ in range(6):
        t, changed = strip_once(t)
        if not changed:
            break
    if t != raw:
        path.write_text(t, encoding="utf-8")
        return True
    return False


def main() -> int:
    if not ANALYSE.is_dir():
        print("Missing", ANALYSE, file=sys.stderr)
        return 1
    changed_files: list[Path] = []
    for p in sorted(ANALYSE.rglob("page.tsx")):
        if process_file(p):
            changed_files.append(p)
    print(f"Updated {len(changed_files)} files under analyse/")
    for p in changed_files[:40]:
        print(" ", p.relative_to(ROOT))
    if len(changed_files) > 40:
        print(f" ... and {len(changed_files) - 40} more")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
