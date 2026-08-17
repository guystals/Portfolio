const http = require('http');
const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

function sendFile(response, filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const contentType = contentTypes[extension] || 'application/octet-stream';

  fs.readFile(filePath, (error, data) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500, {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      response.end(error.code === 'ENOENT' ? 'Not found' : 'Internal server error');
      return;
    }

    response.writeHead(200, { 'Content-Type': contentType });
    response.end(data);
  });
}

const server = http.createServer((request, response) => {
  const requestPath = request.url === '/' ? '/index.html' : request.url;
  const safePath = path.normalize(decodeURIComponent(requestPath)).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(rootDir, safePath);

  if (!filePath.startsWith(rootDir)) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  sendFile(response, filePath);
});

server.listen(port, () => {
  console.log(`Static server running at http://127.0.0.1:${port}`);
});
