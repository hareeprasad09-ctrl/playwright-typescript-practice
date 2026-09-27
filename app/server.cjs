const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const routes = { '/': ['index.html', 'text/html'], '/app.js': ['app.js', 'text/javascript'] };
const server = http.createServer((req, res) => {
  const route = routes[new URL(req.url, 'http://localhost').pathname];
  if (!route) { res.writeHead(404); res.end('Not found'); return; }
  res.writeHead(200, { 'Content-Type': `${route[1]}; charset=utf-8`, 'Cache-Control': 'no-store' });
  res.end(fs.readFileSync(path.join(__dirname, route[0])));
});
server.listen(4173, '127.0.0.1', () => console.log('Practice app: http://127.0.0.1:4173'));
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
