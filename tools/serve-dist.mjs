// 本地模拟 GitHub Pages 子路径部署：把 dist 挂在 /VBlog 前缀下，不做 301 跳转。
// 用法: node tools/serve-dist.mjs [port]   (默认 8110)
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const port = Number(process.argv[2] || 8110);
const root = path.resolve('dist');
const prefix = '/VBlog';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.gz': 'application/gzip',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.map': 'application/json',
};

http
  .createServer(async (req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0]);
    if (url !== prefix && !url.startsWith(prefix + '/')) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('only served under ' + prefix);
      return;
    }
    // /VBlog 不带斜杠也照常返回 index.html（Pages 会 301，这里故意不做，用来测相对路径风险）
    let rel = url.slice(prefix.length).replace(/^\//, '');
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    const file = path.join(root, rel);
    try {
      const buf = await readFile(file);
      res.writeHead(200, { 'content-type': types[path.extname(file).toLowerCase()] || 'application/octet-stream' });
      res.end(buf);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('not found: ' + rel);
    }
  })
  .listen(port, '127.0.0.1', () => {
    console.log('serving dist at http://127.0.0.1:' + port + prefix + '/ (不跳转，/VBlog 直接回 index.html)');
  });
