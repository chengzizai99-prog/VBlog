// 本地静态服务，用来验收 dist 产物（不做构建，只发文件）
// 有 .gz 且浏览器接受 gzip 时直接发压缩体，用来近似验证 Nginx gzip_static。
import http from 'http'
import fs from 'fs'
import path from 'path'

const root = path.resolve(process.argv[2] || 'dist')
const port = Number(process.argv[3] || 8094)
const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.gz': 'application/gzip',
}

http.createServer((req, res) => {
    const url = decodeURIComponent((req.url || '/').split('?')[0])
    let file = path.join(root, url)
    if (!file.startsWith(root)) {
        res.writeHead(403).end('forbidden')
        return
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        file = path.join(root, 'index.html')
    }

    const headers = { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' }
    const acceptsGzip = /gzip/.test(req.headers['accept-encoding'] || '')
    if (acceptsGzip && fs.existsSync(file + '.gz') && !file.endsWith('.gz')) {
        headers['Content-Encoding'] = 'gzip'
        headers['Vary'] = 'Accept-Encoding'
        file = file + '.gz'
    }

    res.writeHead(200, headers)
    res.end(fs.readFileSync(file))
}).listen(port, '127.0.0.1', () => console.log('serving ' + root + ' on http://127.0.0.1:' + port))
