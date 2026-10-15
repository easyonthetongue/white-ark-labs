import { syncCatalog } from '../src/sync/catalog-sync.mjs';

const args = process.argv.slice(2);
try {
  const report = await syncCatalog({
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force'),
    sku: args.find((arg) => arg.startsWith('--sku='))?.slice(6) || null
  });
  console.log(JSON.stringify(report, null, 2));
  if (report.status !== 'completed') process.exitCode = 1;
} catch (error) {
  console.error(`Product catalog sync could not start: ${error.message}`);
  process.exitCode = 1;
}
