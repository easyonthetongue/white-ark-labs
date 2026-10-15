# Product drop folder

Create one folder per SKU here. Each folder must contain:

- `01-front.jpg`
- `02-three-quarter.jpg`
- `03-side.jpg`
- `04-detail.jpg`
- `product-description.txt`

After adding or changing a product, run `npm run catalog:publish` from the project folder. The command validates the catalogue, rebuilds the site, runs tests, commits the changes and pushes them to the configured Git remote.
