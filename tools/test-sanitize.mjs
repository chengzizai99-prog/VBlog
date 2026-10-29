// 验证 src/main.js 里 $sanitize 的 DOMPurify 配置：同样的配置，脏 HTML 进去必须干净出来。
import { JSDOM } from 'jsdom'
import createDOMPurify from 'dompurify'

const { window } = new JSDOM('')
const DOMPurify = createDOMPurify(window)

const sanitize = (html) =>
    DOMPurify.sanitize(html, { ADD_ATTR: ['target'], ALLOW_DATA_ATTR: false })

const dirty = [
    '<img src=x onerror="window.__pwned=1">',
    '<script>window.__pwned=1</script>',
    '<a href="javascript:alert(1)">click</a>',
    '<p onclick="window.__pwned=1">text</p>',
    '<iframe src="https://evil.example"></iframe>',
    '<a href="https://github.com/x" target="_blank" rel="noopener">ok</a>',
    '<h1>标题</h1><pre><code>const a = 1</code></pre>',
].join('\n')

const out = sanitize(dirty)

const checks = {
    'no onerror': !/onerror/i.test(out),
    'no script tag': !/<script/i.test(out),
    'no javascript: url': !/javascript:/i.test(out),
    'no inline onclick': !/onclick/i.test(out),
    'no iframe': !/<iframe/i.test(out),
    'keeps h1': /<h1>/.test(out),
    'keeps pre/code': /<pre>/.test(out) && /<code>/.test(out),
    'keeps target attr': /target="_blank"/.test(out),
    'keeps normal link': /https:\/\/github\.com\/x/.test(out),
}

let failed = 0
for (const [name, ok] of Object.entries(checks)) {
    console.log((ok ? 'PASS ' : 'FAIL ') + name)
    if (!ok) failed++
}
console.log('sanitized output:', JSON.stringify(out))
process.exit(failed === 0 ? 0 : 1)
