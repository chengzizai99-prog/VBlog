// 构建 GitHub Pages 子路径版本。
//
// 为什么不用 `PUBLIC_PATH=/VBlog/ npm run build`：
// Git Bash / MSYS 会把看着像路径的环境变量值当成 POSIX 路径，`/VBlog/` 被改写成
// `C:/Users/.../bash-win32-x64/VBlog/`，webpack 就会把带盘符的绝对路径写进 index.html。
// 所以这里在 Node 进程内设置环境变量，不经过 shell。
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PUBLIC_PATH = '/VBlog/';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const timeoutMs = 300000;

console.log('[build-pages] PUBLIC_PATH = ' + PUBLIC_PATH);

const child = spawn(process.execPath, ['build/build.js'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
  env: {
    ...process.env,
    NODE_ENV: 'production',
    // webpack 3 内部用 md4，Node 17+ 要开 legacy provider 才能构建
    NODE_OPTIONS: [(process.env.NODE_OPTIONS || ''), '--openssl-legacy-provider'].filter(Boolean).join(' '),
    PUBLIC_PATH,
  },
});

let sawComplete = false;
let buffered = '';
const scan = (chunk, out) => {
  out.write(chunk);
  buffered = (buffered + chunk.toString()).slice(-4096);
  if (!sawComplete && buffered.includes('Build complete.')) {
    sawComplete = true;
    // 看到结束标记后再等 2 秒让 webpack 把文件写完，然后主动收掉（Node 24 下它自己不会退）
    setTimeout(gracefulFinish, 2000);
  }
};

function gracefulFinish() {
  if (child.exitCode === null && !child.killed) child.kill();
}
child.stdout.on('data', (c) => scan(c, process.stdout));
child.stderr.on('data', (c) => scan(c, process.stderr));

// webpack 3 在 Node 24 下编译完不会自己退出（句柄没释放），所以到点就收掉。
const timer = setTimeout(() => {
  console.error('[build-pages] ' + timeoutMs + 'ms 超时，终止构建进程');
  child.kill();
}, timeoutMs);

child.on('exit', (code, signal) => {
  clearTimeout(timer);
  if (signal) console.log('[build-pages] build/build.js 被信号 ' + signal + ' 终止');

  try {
    const html = readFileSync(path.join(root, 'dist/index.html'), 'utf8');
    const refs = [...html.matchAll(/(?:src|href)=("[^"]*"|[^ >]+)/g)].map((m) => m[1].replace(/"/g, ''));
    const driveLetters = (html.match(/[A-Za-z]:[\\/]/g) || []).length;
    console.log('\n[build-pages] 资源引用:');
    refs.forEach((r) => console.log('  ' + r));
    console.log('[build-pages] 盘符/绝对路径出现次数: ' + driveLetters);

    const bad = refs.filter((r) => !r.startsWith(PUBLIC_PATH));
    if (!sawComplete) {
      console.error('[build-pages] 没看到 "Build complete."，构建不算成功');
      process.exit(1);
    }
    if (driveLetters > 0 || bad.length > 0) {
      console.error('[build-pages] 引用不合法: ' + JSON.stringify(bad));
      process.exit(1);
    }
    console.log('[build-pages] OK: 全部引用在 ' + PUBLIC_PATH + ' 下');
    process.exit(0);
  } catch (e) {
    console.error('[build-pages] 校验 dist/index.html 失败: ' + e.message);
    process.exit(1);
  }
});
