# White Ark Labs website upgrade — implementation report

## 1. Summary

The two-page consumer-style prototype is now a 77-page canonical static website for a Pakistan-based leather goods product-development and managed-manufacturing partner. The minimalist White Ark visual language, typography, colour system, imagery and grid rhythm were retained while cart, pricing, checkout and retail language were removed from the production output.

The site remains dependency-free and deployable to GitHub Pages.

## 2. Sitemap

- `/`
- `/products`
- `/products/womens-handbags`
- `/products/travel-business-bags`
- `/products/small-leather-goods`
- `/products/belts-lifestyle-accessories`
- `/products/pouches-organizers`
- `/products/[46 product slugs]`
- `/materials`
- `/materials/[6 material slugs]`
- `/craftsmanship`
- `/craftsmanship/[12 technique slugs]`
- `/capabilities/construction-finishing`
- `/our-process`
- `/about`
- `/get-a-quote`

Compatibility pages preserve `/products.html`, `/quote/` and the 12 earlier generated product slugs. They are excluded from the XML sitemap and point to canonical replacements.

## 3. Final catalogue

| Category | Published products |
| --- | ---: |
| Women’s Handbags | 12 |
| Travel & Business Bags | 8 |
| Small Leather Goods | 10 |
| Belts & Lifestyle Accessories | 8 |
| Pouches & Organizers | 8 |
| **Total** | **46** |

All requested archetypes are represented with distinctive B2B catalogue names.

## 4. Legacy catalogue audit

All 89 former records are individually recorded in `src/data/catalogue-audit.json`:

- KEEP: 20
- MODIFY: 23
- REPLACE: 3
- REMOVE: 43

The resulting 46 records retain useful archetypes and imagery while normalizing categories, descriptions, specifications and relationships.

## 5. Materials and craftsmanship

Six material families contain descriptions, characteristics, applications, finish options, sourcing status and data-driven related products. Twelve craftsmanship techniques contain applications, compatible materials, production considerations, availability status and related products. A separate section contains 12 construction and finishing capabilities.

Availability language is intentionally qualified. Exotic skins, fur, unverifiable certifications and factory-ownership claims are absent.

## 6. Data architecture

`src/data/catalogue.mjs` is the single source of truth for categories, products, materials, techniques and construction capabilities. It uses stable IDs and slugs, normalized references and deterministic timestamps. `scripts/validate-data.mjs` stops the build for missing fields, duplicate identities, incorrect category totals or orphaned relationships.

The project remains static because an external database would add unnecessary infrastructure for this catalogue.

## 7. Catalogue search and filtering

The shared listing interface powers the main catalogue and all five category pages. It provides keyword search, category/material/technique filters, name/category sorting, reset controls, counts and an empty state. State is encoded in query parameters, restored on direct visits and updated through browser history.

## 8. Quote behavior

Product, material and technique links prepopulate the quote form. The form validates required fields, email syntax, upload type and an 8 MB upload limit. A honeypot is included for basic automated-submission resistance.

The form posts `multipart/form-data` only when `quoteEndpoint` is configured. It shows success only after a 2xx handler response. Without an endpoint it visibly states that delivery is not configured and does not discard or falsely confirm the request.

## 9. Testing

Executed successfully:

- Data validation and deterministic build
- 13 automated test cases
- 46 product routes, five category routes, six material routes and 12 technique routes
- All generated internal links and breadcrumbs
- Search, each filter, combined filters, sorting and query-state round trips
- Product gallery markup, relational links and quote preselection
- Quote validation, mocked handler success and handler failure
- Sitemap, canonical metadata, Open Graph and structured data checks
- Desktop dropdown, live catalogue filtering, image switching and quote failure-state browser flows
- Unknown-route HTTP 404 check

Result: 13 passed, 0 failed.

## 10. Remaining issues

- A real quote endpoint and receiving workflow are not configured, so production delivery remains intentionally disabled.
- The current images are retained from the supplied prototype and reused as design references. Replace them with approved product-specific photography as it becomes available.
- GitHub Pages cannot emit configurable HTTP 301 responses. Legacy compatibility pages use canonical, no-index client redirects; a custom host should convert these to server-level 301 rules.

## 11. Required configuration

- `quoteEndpoint` in `src/data/site.json`: secure HTTPS form handler.
- `quoteRecipient` in `src/data/site.json`: optional published contact destination.
- `SITE_URL`: canonical production origin during non-GitHub builds.

No client-side credentials or API keys are required or exposed.

## 12. Future catalogue edits

Edit `src/data/catalogue.mjs`. New products need a unique `WAL-###` ID and slug plus valid category, material and technique IDs. Related product sections on material and technique pages are derived automatically. Run `npm test` after every catalogue change; the build will reject invalid relationships, duplicate identities and unexpected category counts.
