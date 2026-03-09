# Product Finder Wizard — Process Log

## Project Goal

Build a step-by-step product finder for Hemlock & Oak (hemlockandoak.com) that guides customers through a questionnaire to narrow down notebooks, planners, and other stationery products. Modeled after Canada's Innovation Business Benefits Finder — a guided wizard with progressive filtering.

## Status: Local Dev Complete, Pending Shopify Deployment

All 8 categories implemented and working locally. Next step is porting normalization to JS and deploying via Liquid templates.

## Research Completed

### 1. Shopify Store Audit (March 7, 2026)

Full API audit of hemlock-oak.myshopify.com via Shopify Admin API.

**Catalog Summary:**
- 292 active products, 1,886 total variants
- 174 draft, 40 archived, 7 unlisted

**Product Categories (active only):**

| Category | Products | Variants | Price Range |
|----------|----------|----------|-------------|
| Dated Planners | 55 | 468 | $10–$129 |
| Undated Planners | 6 | 28 | $19–$108 |
| Planner Inserts | 15 | 50 | $8–$59 |
| Notebooks | 105 | 874 | $11–$89 |
| Stickers | 37 | 141 | $4–$8 |
| Notepads & Stickies | 25 | 25 | $5–$14 |
| Jewellery | 5 | 28 | $79–$1,549 |
| Pen Refills | 2 | 2 | $4 |
| Gift Bundles | 6 | 7 | $88–$125 |
| Gift Cards | 1 | 10 | $5–$200 |
| Free Downloads | 8 | 8 | $0 |

### 2. Data Quality Issues Found & Fixed

- `Dated Panners` typo in product_type (18 products) → fixed in build script
- `Notebook` vs `Notebooks` → normalized to `notebooks`
- 20+ sticker products have empty product_type → classified by tags/title
- GSM weight sometimes in tags, sometimes only in title → check both
- Older notebooks (Luminé, Lunar, Floriculture, Monarque, Blank) missing GSM/cover → default to 150gsm hardcover
- Blue Floriculture missing pattern → check variant option values as fallback
- Minimalist Horizontal was being classified as "horizontal" → moved minimalist check before horizontal in extraction order
- `Undated Daily Planner (6-Month, Hardcover, 120gsm)` misclassified as Notebook → fixed

## Implementation History

### Phase 1: Core (Notebooks + Dated + Undated Planners)
- Built `build_catalog.py` — data pipeline from `shopify_products_full.json` → `products.js`
- Built `finder.js` — wizard engine with declarative `FLOWS` object
- Built `finder.css` — brand-aligned styling
- Built `index.html` — local dev shell
- Generated `products.js` — 186 products across all 8 categories

### Phase 2: All Categories
- Added flows for Inserts (binding format radio + insert type checkbox), Stickers (type radio)
- Added direct-to-results for Notepads, Accessories, Jewellery
- Added category images from Shopify CDN for all 8 categories

### Phase 3: UX Polish
- **Guided Journaling tags** on qualifying planner products (dated weekly, horizontal, W&D + all undated)
- **Fun facts** system — auto-rotates every 5s with fade transition, keyed by step ID
- **Skip (show all)** button — small underlined link between Back and Next
- **Progress bar animation** — dots scale in/out when steps appear/disappear (e.g. 70gsm → size step hidden)
- **Mobile-first responsive** — base styles for phones, `min-width` queries at 480px and 700px
- **Category cards:** `object-fit: contain` on white background, forest-green hover with lift
- **Product cards:** Flexbox equal-height, price + colours inline, binding formats as individual pills
- **OOS handling:** Hidden by default with "Show Sold Out (n)" toggle; inserts always hidden
- **All-OOS categories:** Greyed out on entry screen with "Currently sold out" label
- **Inserts note:** Permanent message about covers not available yet + Facebook community group link
- **No rounded corners** (`--radius: 0px`)
- **URL hash state** for shareability

### Key Rules Established
- Never call 150gsm paper "Lynx" — always "Heritage"
- Never expose trade secrets (supplier origins, proprietary processes, book-cloth country of origin)
- Fun facts are user-editable in finder.js (~lines 196-224) — always preserve user's edits

## Auto-Update Strategy (Decided)

**Approach: Liquid templates** (server-rendered JSON on Shopify page load)

Why Liquid over alternatives:
- **vs Static products.js:** No manual rebuild needed when products change
- **vs Storefront API:** No token to configure, no CORS, no client-side auth
- **vs Admin API:** No credentials exposed, no security risk

Implementation plan:
1. Port `build_catalog.py` normalization to JS `normalizeCatalog()` function
2. Shopify Liquid template loops through collections, outputs raw JSON
3. `finder.js` normalizes on load; falls back to static `products.js` for local dev

## Files

| File | Purpose |
|------|---------|
| `PLAN.md` | Full implementation plan (flows, data model, architecture, deployment) |
| `PROCESS.md` | This file — process log and decisions |
| `build_catalog.py` | Data pipeline: shopify_products_full.json → products.js |
| `finder.js` | Wizard engine, filtering, rendering, fun facts, normalization |
| `finder.css` | Mobile-first responsive styles, brand tokens |
| `index.html` | Local dev shell |
| `products.js` | Static product catalog (generated, local dev fallback) |

## Next Steps

1. Port normalization logic to JS
2. Write Shopify Liquid page template
3. Demo to Tia locally (open index.html in browser)
4. Upload to Shopify (CSS/JS to Assets, create page with Liquid template)
5. Add homepage CTA linking to `/pages/product-finder`
