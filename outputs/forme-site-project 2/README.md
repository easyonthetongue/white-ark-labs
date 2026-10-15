# FORME manufacturer website

A fast, zero-dependency static website for a leather-goods manufacturer. Its visual source of truth is the supplied White Ark prototype, adapted into a GitHub Pages-compatible build with a clean `/products/` catalogue route.

## Run locally

Requires Node.js 20 or newer.

```sh
npm run dev
```

Open `http://localhost:4173` once. The development server watches `src/`, rebuilds the site, and refreshes the browser automatically whenever a source file changes.

Run the automated checks separately with:

```sh
npm test
```

## Edit the site

- Homepage design and content: `src/pages/index.html`
- Catalogue design and its 89 products: `src/pages/products.html`
- Quote recipient: `src/data/site.json`
- Routing and production transformations: `scripts/build-whiteark.mjs`

Run `npm run build` after making changes. Generated files are written to `dist/` and should not be edited directly.

During design work, keep `npm run dev` running instead. Ask Codex to update the colours, typography, spacing, page content, products, or layout; the open preview will update after each saved change without downloading another HTML file.

## Quote requests

The quote form validates the enquiry, carries product context from each product page, and prepares a complete email in the visitor's email application. Add the real receiving email address to `quoteRecipient` in `src/data/site.json` before publishing. No enquiry data is stored by the static website.

For direct server-side delivery instead, connect a form provider or a serverless endpoint and update the form handler. GitHub Pages cannot process form submissions itself.

## Deploy to GitHub Pages

1. Create or choose a GitHub repository.
2. Push this project to its `main` branch.
3. In **Settings → Pages**, select **GitHub Actions** as the source.
4. The included workflow tests, builds, and deploys `dist/`.

The site uses relative URLs, so it works at either `username.github.io/repository/` or a custom domain. The deployment is only live after the `Deploy static site to GitHub Pages` workflow succeeds and the Pages URL loads.
