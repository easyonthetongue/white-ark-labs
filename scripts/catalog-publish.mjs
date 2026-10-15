import { spawnSync } from 'node:child_process';

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
};

run('npm', ['run', 'products:sync']);
run('npm', ['run', 'build']);
run('npm', ['test']);
run('git', ['add', 'catalog/products', 'src/assets/catalogue', 'src/data/imported-products.mjs', 'src/data/catalogue-sync-state.json', 'src/data/catalogue-audit.json']);
const status = spawnSync('git', ['status', '--porcelain'], { encoding: 'utf8' });
if (!status.stdout.trim()) { console.log('Catalogue is already up to date; nothing to commit.'); process.exit(0); }
run('git', ['commit', '-m', 'Sync product catalogue']);
run('git', ['push']);
console.log('Catalogue published. GitHub Actions will rebuild and deploy the site.');
