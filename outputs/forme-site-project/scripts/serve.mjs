import { execFile } from 'node:child_process';
import { createServer } from 'node:http';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const watchedDirectories = [path.resolve('src/pages'), path.resolve('src/data'), path.resolve('scripts')];
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' };
const liveReload = `<script>
  (() => {
    const stream = new EventSource('/__live-reload');
    stream.addEventListener('reload', () => window.location.reload());
  })();
</script>`;
const clients = new Set();
let rebuilding = false;
let queued = false;
let lastSourceStamp = 0;

async function sourceStamp() {
  let newest = 0;
  for (const directory of watchedDirectories) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const info = await stat(path.join(directory, entry.name));
      newest = Math.max(newest, info.mtimeMs);
    }
  }
  return newest;
}

function build() {
  if (rebuilding) {
    queued = true;
    return;
  }
  rebuilding = true;
  execFile(process.execPath, ['scripts/build-whiteark.mjs'], { cwd: path.resolve('.') }, (error, stdout, stderr) => {
    rebuilding = false;
    if (error) {
      console.error(stderr || error.message);
    } else {
      process.stdout.write(stdout);
      for (const response of clients) response.write('event: reload\ndata: updated\n\n');
    }
    if (queued) {
      queued = false;
      build();
    }
  });
}

const server = createServer(async (request, response) => {
  if (request.url === '/__live-reload') {
    response.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
    response.write('data: connected\n\n');
    clients.add(response);
    request.on('close', () => clients.delete(response));
    return;
  }
  try {
    const urlPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    let filePath = path.join(root, urlPath);
    if (!filePath.startsWith(root)) throw new Error('Invalid path');
    const info = await stat(filePath).catch(() => null);
    if (info?.isDirectory()) filePath = path.join(filePath, 'index.html');
    let data = await readFile(filePath);
    if (path.extname(filePath) === '.html') {
      data = Buffer.from(data.toString().replace('</body>', `${liveReload}</body>`));
    }
    response.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
    response.end(data);
  } catch {
    const data = await readFile(path.join(root, '404.html'));
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(data);
  }
});

lastSourceStamp = await sourceStamp();
setInterval(async () => {
  const currentStamp = await sourceStamp().catch((error) => {
    console.error(`Watcher error: ${error.message}`);
    return lastSourceStamp;
  });
  if (currentStamp > lastSourceStamp) {
    lastSourceStamp = currentStamp;
    build();
  }
}, 500);

build();
server.listen(port, '127.0.0.1', () => {
  console.log(`FORME live preview: http://localhost:${port}`);
  console.log('Watching src/ — saved changes rebuild and refresh automatically.');
});
