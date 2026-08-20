# Graph Report - BETA-ART  (2026-08-20)

## Corpus Check
- Corpus is ~102 words - fits in a single context window. You may not need a graph.

## Summary
- 5 nodes · 5 edges · 2 communities (1 shown, 1 thin omitted)
- Extraction: 60% EXTRACTED · 20% INFERRED · 20% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.75)
- Token cost: 56,380 input · 0 output

## Community Hubs (Navigation)
- Vulnerability Reporting Policy
- Version Support Matrix

## God Nodes (most connected - your core abstractions)
1. `Security Policy` - 3 edges
2. `Supported Versions` - 3 edges
3. `Reporting a Vulnerability` - 2 edges
4. `BETA-ART` - 1 edges
5. `Version Support Matrix (5.1.x, 5.0.x, 4.0.x, <4.0)` - 1 edges

## Surprising Connections (you probably didn't know these)
- `BETA-ART` --conceptually_related_to--> `Security Policy`  [AMBIGUOUS]
  README.md → SECURITY.md

## Communities (2 total, 1 thin omitted)

### Community 0 - "Vulnerability Reporting Policy"
Cohesion: 0.67
Nodes (3): BETA-ART, Reporting a Vulnerability, Security Policy

## Ambiguous Edges - Review These
- `BETA-ART` → `Security Policy`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to

## Knowledge Gaps
- **1 isolated node(s):** `BETA-ART`
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `BETA-ART` and `Security Policy`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Security Policy` connect `Vulnerability Reporting Policy` to `Version Support Matrix`?**
  _High betweenness centrality (0.500) - this node is a cross-community bridge._
- **Why does `Supported Versions` connect `Version Support Matrix` to `Vulnerability Reporting Policy`?**
  _High betweenness centrality (0.500) - this node is a cross-community bridge._
- **What connects `BETA-ART` to the rest of the system?**
  _1 weakly-connected nodes found - possible documentation gaps or missing edges._