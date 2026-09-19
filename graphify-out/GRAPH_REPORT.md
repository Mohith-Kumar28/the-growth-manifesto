# Graph Report - the-growth-manifesto  (2026-09-19)

## Corpus Check
- 47 files · ~175,389 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 337 nodes · 454 edges · 19 communities (15 shown, 4 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.7)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dce0f914`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- growth/index.tsx
- routeTree.gen.ts
- devDependencies
- db.ts
- dependencies
- compilerOptions
- scripts
- Building For Production
- generate-og-images.py
- confessions-wall.tsx
- manifest.json
- lead-intake.tsx
- 0001_init.sql
- 0004_likes_and_lead_details.sql
- prettier.config.js
- vite.config.ts

## God Nodes (most connected - your core abstractions)
1. `scripts` - 17 edges
2. `compilerOptions` - 17 edges
3. `Building For Production` - 9 edges
4. `Reveal()` - 7 edges
5. `seo()` - 7 edges
6. `Card` - 6 edges
7. `scrollToId()` - 6 edges
8. `FileRoutesByPath` - 6 edges
9. `include` - 6 edges
10. `Masthead()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `scrollToId()` --references--> `lenis`  [EXTRACTED]
  src/components/growth/smooth-scroll.tsx → package.json
- `SmoothScroll()` --references--> `lenis`  [EXTRACTED]
  src/components/growth/smooth-scroll.tsx → package.json
- `ConfessionCard()` --calls--> `addConfession`  [EXTRACTED]
  src/components/growth/confession-card.tsx → src/server/db.ts
- `LikeablePostcard()` --calls--> `toggleConfessionLike`  [EXTRACTED]
  src/components/growth/confessions-wall.tsx → src/server/db.ts
- `IntakePage()` --calls--> `addLead`  [EXTRACTED]
  src/components/growth/lead-intake.tsx → src/server/db.ts

## Import Cycles
- None detected.

## Communities (19 total, 4 thin omitted)

### Community 0 - "growth/index.tsx"
Cohesion: 0.05
Nodes (35): lenis, lenis, BookACall(), CAL_URL_EXPORT, CtaFooter(), SOCIALS, TabKey, TABS (+27 more)

### Community 1 - "routeTree.gen.ts"
Cohesion: 0.09
Nodes (33): absolute(), breadcrumb(), ldScript(), seo(), SeoOptions, SITE_NAME, SITE_URL, TAGLINE (+25 more)

### Community 2 - "devDependencies"
Cohesion: 0.05
Nodes (39): eslint, jsdom, devDependencies, eslint, jsdom, prettier, sharp, @tailwindcss/typography (+31 more)

### Community 3 - "db.ts"
Cohesion: 0.10
Nodes (22): confessions, leads, remote, D1, db(), enforceRate(), listConfessions, now() (+14 more)

### Community 4 - "dependencies"
Cohesion: 0.07
Nodes (29): canvas-confetti, @cloudflare/vite-plugin, framer-motion, lucide-react, dependencies, canvas-confetti, @cloudflare/vite-plugin, framer-motion (+21 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (27): DOM, DOM.Iterable, ES2022, eslint.config.js, prettier.config.js, **/*.ts, **/*.tsx, vite/client (+19 more)

### Community 6 - "scripts"
Cohesion: 0.08
Nodes (25): imports, name, pnpm, onlyBuiltDependencies, private, scripts, build, cf:login (+17 more)

### Community 7 - "Building For Production"
Cohesion: 0.12
Nodes (16): Adding A Route, Adding Links, API Routes, Building For Production, Data Fetching, Demo files, Deploy to Cloudflare Workers, Getting Started (+8 more)

### Community 8 - "generate-og-images.py"
Cohesion: 0.17
Nodes (9): advance(), Card, _download_im_fell(), fonts(), measure(), Inline advance of `text`. label: trims edge whitespace and pads, so measure…, parts = [(text, colour), ...] laid out as one centred line., Google serves plain .ttf to a UA it doesn't recognise as woff2-capable. (+1 more)

### Community 9 - "confessions-wall.tsx"
Cohesion: 0.20
Nodes (13): ConfessionCard(), formatDate(), MONTHS, PostcardFace(), useFitLines(), ConfessionsWall(), LikeablePostcard(), route (+5 more)

### Community 10 - "manifest.json"
Cohesion: 0.17
Nodes (11): background_color, description, display, icons, lang, name, orientation, scope (+3 more)

### Community 11 - "lead-intake.tsx"
Cohesion: 0.27
Nodes (9): FoundersPage(), MRR_BANDS, STAGES, Field(), IntakePage(), PillGroup(), PORTFOLIO_TYPES, VcPage() (+1 more)

## Knowledge Gaps
- **153 isolated node(s):** `confessions`, `leads`, `confession_likes`, `name`, `private` (+148 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `growth/index.tsx`, `scripts`?**
  _High betweenness centrality (0.300) - this node is a cross-community bridge._
- **Why does `lenis` connect `growth/index.tsx` to `dependencies`?**
  _High betweenness centrality (0.265) - this node is a cross-community bridge._
- **Why does `SmoothScroll()` connect `growth/index.tsx` to `confessions-wall.tsx`, `lead-intake.tsx`?**
  _High betweenness centrality (0.219) - this node is a cross-community bridge._
- **What connects `confessions`, `leads`, `confession_likes` to the rest of the system?**
  _153 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `growth/index.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05380852550663871 - nodes in this community are weakly interconnected._
- **Should `routeTree.gen.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08637873754152824 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._