# Batch 04 — composition occupancy metrics

Scanner: Claude independent heuristics (leaf content, row unused-right >32%, flagged band >220px).  
Before: live production @ `dfa7d35` (`docs/visual-audit/claude-independent/data/*__1536x730.json` and 1920).  
After: local render of Batch 04 (`docs/revamp/screenshots/batch-04-dead-space-row-redesign/scan/after-metrics.json`).

Gate at ≥1366: occupancy <62% on a tall section **or** unused-right >32% for >220px vertical band ⇒ P1.  
1920 occupancy ~80% on some bands is the existing `--layout-content: 90rem` cap inside a full-bleed section — not a sparse row. That is the page measure, not Root Cause 1.

| Section | Viewport | Before occupancy | After occupancy | Before unused-right (max row) | After unused-right (max row) | Before flagH | After flagH | Classification |
|---|---|---|---|---|---|---|---|---|
| Home programmes (`#services`) | 1536 | 100% span / **69%** row-empty | 100% / **0%** | 69% | 0% | 1311px | 0 | **composed** |
| Home programmes | 1920 | 80% / **76%** | 80% / **20%** | 76% | 20% | 1311px | 0 | **composed** (20% = 90rem cap) |
| Home branches (`#locations`) | 1536 | 100% / **47%** | 100% / **30%** | 47% | 30% | 512px | 0 | **composed** |
| Home branches | 1920 | 80% / **59%** | 80% / **44%** | 59% | 44% | 512px | 131px | **composed** (flagH <220; remaining is intro lede vs 90rem) |
| `/programs` index | 1536 | 100% / **77%** | 100% / 77% intro rows | 77% | 77% (H1/closing only) | 1750px | 83px | **composed** |
| `/programs` index | 1920 | 80% / **82%** | 100% / 82% intro | 82% | 82% | 1750px | 83px | **composed** |
| About numbered programme index | 1536 | section 85% / **42%** | index **99% / 1%** | 42% | 1% | 329px | 0 | **composed** |
| About numbered programme index | 1920 | — | **99% / 1%** | — | 1% | — | 0 | **composed** |
| Functional related + locations | 1536 | 100% / **51%** | 100% / 67% (odd last related cell) | 51% | 67% | 88px | 59px | **composed** (flagH <220; 3+1 asymmetric close) |
| Functional related + locations | 1920 | — | 80% / 73% | — | 73% | — | 59px | **composed** |
| Branch available-at-this-branch | 1536 | 100% / **97%** | 100% / **35%** | 97% | 35% | 303px | 35px | **composed** (35px leftover is the 5th item in a 3-col — odd-grid, out of Batch 04) |
| Branch available | 1920 | 100% / **98%** | 100% / **34%** | 98% | 34% | 303px | 35px | **composed** |

## Remaining flags in Batch-04 scope

**P1 occupancy flags: none** on the redesigned surfaces at 1536 and 1920.

Documented non-P1 leftovers:

| Signal | Why it is not a P1 row-list |
|---|---|
| ~20% unused-right at 1920 on several sections | `--layout-content: 90rem` left-aligned in a full-bleed band. Whitespace **surrounds** the composition. Do not shrink the global max-width. |
| `/programs` intro/closing maxRowRE still high, flagH 83px | H1 + lede + purple CTA are short bands. The programme matrix itself spans the field. |
| Related 3-item 2-col last cell | Odd-grid empty cell — explicitly out of this batch. FlagH 59px. |
| Branch 5 services / 3 columns | Last row has two names, one empty cell. Odd-grid, out of scope. FlagH 35px. |
| Home branch intro lede at 1920 | Pattern A reading line above a 2×2 matrix. FlagH 131px. |

## Visual classification

Whitespace now surrounds editorial matrices (featured + pairs + 3-col Move, 2×2 branches, compact service index, asymmetric related close, numbered About index). It is not the composition.
