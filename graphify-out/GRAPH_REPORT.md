# Graph Report - shopify  (2026-08-28)

## Corpus Check
- 20 files · ~3,908 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 35 nodes · 39 edges · 5 communities (4 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d2ed3164`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- theme.js
- Atelier — tema Shopify de producto único
- graphify-update.py
- initProductForms
- extras/README.md

## God Nodes (most connected - your core abstractions)
1. `Atelier — tema Shopify de producto único` - 8 edges
2. `initProductForms()` - 6 edges
3. `main()` - 4 edges
4. `edited_path()` - 3 edges
5. `repo_root()` - 3 edges
6. `find_graphify()` - 3 edges
7. `refreshCart()` - 3 edges
8. `showToast()` - 2 edges
9. `updateCartCount()` - 2 edges
10. `formatMoney()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `initProductForms()` --calls--> `refreshCart()`  [EXTRACTED]
  assets/theme.js → assets/theme.js  _Bridges community 0 → community 3_

## Import Cycles
- None detected.

## Communities (5 total, 1 thin omitted)

### Community 0 - "theme.js"
Cohesion: 0.22
Nodes (3): initCartPage(), refreshCart(), updateCartCount()

### Community 1 - "Atelier — tema Shopify de producto único"
Cohesion: 0.22
Nodes (8): Atelier — tema Shopify de producto único, Conectar este repositorio con Shopify, Cómo añadir tu producto, Desarrollo en local (opcional), Importante sobre los packs de precio (Compra 1 / Compra 2 y llévate 1 gratis), Notas técnicas, Qué incluye, Qué puedes editar sin tocar código

### Community 2 - "graphify-update.py"
Cohesion: 0.36
Nodes (7): edited_path(), find_graphify(), main(), Pull the edited file path out of a PostToolUse payload., Walk up from `start` to the directory holding .git, or None., Locate the graphify executable, including uv/pipx dirs not on PATH., repo_root()

### Community 3 - "initProductForms"
Cohesion: 0.40
Nodes (6): formatMoney(), initProductForms(), applyVariant(), findVariant(), selectedOptions(), showToast()

## Knowledge Gaps
- **8 isolated node(s):** `Conectar este repositorio con Shopify`, `Desarrollo en local (opcional)`, `Cómo añadir tu producto`, `Importante sobre los packs de precio (Compra 1 / Compra 2 y llévate 1 gratis)`, `Qué puedes editar sin tocar código` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `initProductForms()` connect `initProductForms` to `theme.js`?**
  _High betweenness centrality (0.059) - this node is a cross-community bridge._
- **What connects `Conectar este repositorio con Shopify`, `Desarrollo en local (opcional)`, `Cómo añadir tu producto` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._