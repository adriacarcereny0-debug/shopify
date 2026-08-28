# Graph Report - shopify  (2026-08-28)

## Corpus Check
- 18 files · ~3,550 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 27 nodes · 29 edges · 5 communities (2 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `51443b72`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Atelier — tema Shopify de producto único
- theme.js
- initProductForms
- initCartPage
- extras/README.md

## God Nodes (most connected - your core abstractions)
1. `Atelier — tema Shopify de producto único` - 8 edges
2. `initProductForms()` - 6 edges
3. `refreshCart()` - 3 edges
4. `showToast()` - 2 edges
5. `updateCartCount()` - 2 edges
6. `formatMoney()` - 2 edges
7. `selectedOptions()` - 2 edges
8. `findVariant()` - 2 edges
9. `applyVariant()` - 2 edges
10. `initCartPage()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `initProductForms()` --calls--> `refreshCart()`  [EXTRACTED]
  assets/theme.js → assets/theme.js  _Bridges community 1 → community 2_

## Import Cycles
- None detected.

## Communities (5 total, 3 thin omitted)

### Community 0 - "Atelier — tema Shopify de producto único"
Cohesion: 0.22
Nodes (8): Atelier — tema Shopify de producto único, Conectar este repositorio con Shopify, Cómo añadir tu producto, Desarrollo en local (opcional), Importante sobre los packs de precio (Compra 1 / Compra 2 y llévate 1 gratis), Notas técnicas, Qué incluye, Qué puedes editar sin tocar código

### Community 2 - "initProductForms"
Cohesion: 0.40
Nodes (6): formatMoney(), initProductForms(), applyVariant(), findVariant(), selectedOptions(), showToast()

## Knowledge Gaps
- **8 isolated node(s):** `Conectar este repositorio con Shopify`, `Desarrollo en local (opcional)`, `Cómo añadir tu producto`, `Importante sobre los packs de precio (Compra 1 / Compra 2 y llévate 1 gratis)`, `Qué puedes editar sin tocar código` (+3 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `initProductForms()` connect `initProductForms` to `theme.js`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `initCartPage()` connect `initCartPage` to `theme.js`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **What connects `Conectar este repositorio con Shopify`, `Desarrollo en local (opcional)`, `Cómo añadir tu producto` to the rest of the system?**
  _8 weakly-connected nodes found - possible documentation gaps or missing edges._