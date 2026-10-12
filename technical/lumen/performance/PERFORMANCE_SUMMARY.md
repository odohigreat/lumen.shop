# LUMEN performance summary

## 1. Performance Overview

The optimisation work targeted initial JavaScript, image requests, Largest Contentful Paint (LCP) and loading-related layout shifts while preserving product, cart and checkout-preview behaviour. The historical local comparison recorded higher mobile scores, smaller initial JavaScript and zero measured shop/product Cumulative Layout Shift (CLS). These are local production-build measurements, not live Vercel results.

## 2. Lighthouse Performance Results

Scores below are three-run medians from the verified 12 October 2026 comparison. Changes are **score points**, not percentages of page-load speed.

| Page | Device profile | Baseline score | Optimised score | Improvement |
| --- | --- | ---: | ---: | ---: |
| Homepage | Mobile | 89 | 95 | +6 points |
| Shop | Mobile | 69 | 95 | +26 points |
| Product | Mobile | 73 | 96 | +23 points |
| Homepage | Desktop | 100 | 100 | 0 points |

The complete baseline/optimised collection and verification metadata are archived privately. The compact public repository contains only the two representative homepage reports linked below; those files alone do not verify every historical comparison row.

## 3. Technical Optimisations

| Area | Issue and implementation | Technical benefit |
| --- | --- | --- |
| Route loading | Secondary pages and cart/checkout overlays load through `React.lazy` dynamic imports; the homepage remains eager. | Defers code until the route or interaction needs it. |
| Motion features | `LazyMotion` with `domAnimation` and lightweight `m` components replaces broader motion component overhead. | Reduces initial JavaScript while retaining existing animation behaviour. |
| Responsive images | WebP sizes, responsive sources and resized logos replace oversized deliveries where applicable. | Allows smaller image transfers for smaller display sizes. |
| Alternate card images | Hidden alternate images mount on hover/focus; the primary remains visible until loading completes. | Avoids requesting alternate images before interaction. |
| Product gallery | Only the active full-size view mounts; thumbnails use 160px derivatives. | Avoids loading every full-size gallery image initially. |
| Loading layout | A viewport-height route loading reserve keeps the footer outside the initial viewport. | Removes the measured shop/product footer shifts during lazy-route loading. |
| Font and hero loading | Local WOFF2 preload and `font-display: swap`; homepage-only responsive hero preload. | Makes critical assets discoverable early without preloading the hero on other routes. |
| Loading priorities | First shop image and active product image use eager/high-priority loading; other card images are lazy. | Prioritises visible content over deferred imagery. |

Inspect [application loading](../../../src/App.tsx), [cards](../../../src/components/ui/ProductCard.tsx), [gallery](../../../src/components/product/ProductGallery.tsx), [critical preloads](../../../index.html) and [font styles](../../../src/index.css). Route splitting and existing image/font work form part of the implementation; not every mechanism was introduced in the same comparison. Savings of individual changes were not isolated experimentally.

## 4. Measurable Improvements

Historical measurements use independently calculated three-run metric medians, except the production bundle byte counts.

| Metric | Baseline → optimised | Change |
| --- | --- | --- |
| Initial main JavaScript, uncompressed | 420,822 → 375,674 bytes | 45,148 bytes less; 10.7% reduction |
| Homepage mobile LCP | 3.556 → 2.711 seconds | 23.7% reduction |
| Shop mobile LCP | 3.695 → 2.634 seconds | 28.7% reduction |
| Product mobile LCP | 3.083 → 2.408 seconds | 21.9% reduction |
| Homepage desktop LCP | 0.728 → 0.638 seconds | 12.3% reduction |
| Shop/product CLS | 0.420 → 0.000 | 0.420 absolute reduction, unitless |

Percentage reductions use `(baseline − optimised) / baseline × 100`, calculated from unrounded measurements. Homepage CLS remained zero. Score changes are listed separately above; Lighthouse scores are composite metrics, not direct speed measurements.

## 5. Testing Methodology

Lighthouse **13.5.0**, Chrome **154.0.0.0**, Node **24.7.0**; local Vite production preview at `http://127.0.0.1:4176`. Performance category only, default storage reset and no concurrent browser/build workloads. Three sequential isolated runs per profile and stage: **24 runs** across `/` mobile/desktop, `/shop` mobile and `/product/prod-lumen-01` mobile.

| Profile | Viewport / DPR | Simulated network | CPU slowdown |
| --- | --- | --- | --- |
| Mobile | 412×823 / 1.75 | RTT 150 ms; throughput 1638.4 kbps | 4× |
| Desktop | 1350×940 / 1 | RTT 40 ms; throughput 10240 kbps | 1× |

Each score/metric median is the middle of its three sorted values; independent medians need not come from the same run. Exact settings and timestamps remain embedded in retained reports. Tested snapshots were working trees at HEAD `98255bd0b33a3f59d77c7a1345cb1dcae9a8ef72`; that commit alone does not identify the tested source. Full source fingerprints are in the private archive.

To reproduce, build and run `npm run preview -- --host 127.0.0.1 --port 4176 --strictPort`, then use Lighthouse 13.5.0 against the local URL with `--only-categories=performance`. Add `--preset=desktop` for desktop. For comparisons, retain three sequential raw runs per profile and compare medians/ranges; do not measure the development server.

## 6. Supporting Evidence

| Genuine retained report | Individual score | LCP | CLS |
| --- | ---: | ---: | ---: |
| [Optimised homepage mobile](lumen-home-mobile-optimized.html) | 95/100 | 2.711 s | 0.000 |
| [Optimised homepage desktop](lumen-home-desktop-optimized.html) | 100/100 | 0.638 s | 0.000 |

Both are byte-identical copies of **optimised run 2** from the comparison collection. Their embedded Lighthouse JSON confirms these scores; the mobile file is not the earlier 90-point historical report. They are individual observations, not median exports. No report data was altered. Download and open HTML locally; GitHub normally displays its source. Earlier measurements and the complete comparison are retained privately, not linked as public deliverables.

## 7. Performance Limitations

Lab results vary with hardware, browser, workloads and hosting. They do not guarantee live Vercel or field performance, and do not certify a future release commit. The four-product demo has no large-catalog benchmark. Some editorial images remain remote; homepage code remains part of the eager entry on other routes. Individual optimisations were measured together, so causal savings per technique are unverified. No historical 98/100 claim or production-performance guarantee is made.
