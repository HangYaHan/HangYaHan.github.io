/* Hanshe terminal homepage — a lightweight hand-rolled shell
 * Data: #term-index / #term-meta (injected by layouts/home.html)
 * No third-party deps; monospace prompt, plain text output.
 */
(function () {
  'use strict';

  var body = document.getElementById('term-body');
  var input = document.getElementById('term-input');
  var form = document.getElementById('term-form');
  var win = document.getElementById('term-window');
  if (!body || !input || !form || !win) return;

  var posts = [];
  var meta = {};
  try { posts = JSON.parse(document.getElementById('term-index').textContent) || []; } catch (e) { posts = []; }
  try { meta = JSON.parse(document.getElementById('term-meta').textContent) || {}; } catch (e) { meta = {}; }

  var cwd = '/';
  var FS = {};
  var DIRS = [];
  var DIRNAME = {};
  var DIRNAME_EN = { yawang: 'essays', dushubiji: 'reading-notes', banyun: 'reposts', youyi: 'recreation' };
  var CAT_EN = {};
  var lang = 'en';
  var LOGO = " _    _                __     __   _    _\n| |  | |               \\ \\   / /  | |  | |\n| |__| | __ _ _ __   __ \\ \\_/ /_ _| |__| | __ _ _ __\n|  __  |/ _` | '_ \\ / _` \\   / _` |  __  |/ _` | '_ \\\n| |  | | (_| | | | | (_| || | (_| | |  | | (_| | | | |\n|_|  |_|\\__,_|_| |_|\\__, ||_|\\__,_|_|  |_|\\__,_|_| |_|\n                     __/ |\n                    |___/";
  var history = [];
  var hIndex = -1;

  /* ---------- output ---------- */
  function scrollDown() { body.scrollTop = body.scrollHeight; }
  function raw(html, cls) {
    var d = document.createElement('div');
    d.className = 'term-line' + (cls ? ' ' + cls : '');
    d.innerHTML = html;
    body.appendChild(d);
    scrollDown();
    return d;
  }
  function plain(text, cls) {
    var d = document.createElement('div');
    d.className = 'term-line' + (cls ? ' ' + cls : '');
    d.textContent = text;
    body.appendChild(d);
    scrollDown();
    return d;
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function promptText() { return 'YaHan:' + displayPath(cwd) + '$'; }
  function setPrompt() {
    var el = document.getElementById('term-prompt');
    if (el) el.textContent = promptText();
  }
  function promptEcho(cmd) {
    raw('<span class="term-prompt-inline">' + esc(promptText()) + '</span> <span class="term-cmd">' + esc(cmd) + '</span>');
  }

  /* ---------- post lookup ---------- */
  function resolve(token) {
    if (!token || !/^\d+$/.test(String(token))) return null;
    var i = parseInt(token, 10);
    return posts[i - 1] || null;
  }
  function link(p) {
    return '<a class="term-a" href="' + esc(p.url) + '">' + esc(p.title) + '</a>';
  }

  /* ---------- virtual filesystem ---------- */
  function decodeSeg(s) { try { return decodeURIComponent(s); } catch (e) { return s; } }
  function urlParts(p) {
    var parts = String(p.url || '').split('/').filter(Boolean);
    return { dir: parts[1] || '', file: parts[2] ? decodeSeg(parts[2]) : '' };
  }
  function buildTree() {
    FS = {}; DIRS = []; DIRNAME = {};
    for (var i = 0; i < posts.length; i++) {
      var u = urlParts(posts[i]);
      if (!u.dir || !u.file) continue;
      if (!FS[u.dir]) {
        FS[u.dir] = [];
        DIRS.push(u.dir);
        var catName = posts[i].cat || u.dir;
        DIRNAME[u.dir] = catName;
        CAT_EN[catName] = DIRNAME_EN[u.dir] || catName;
      }
      FS[u.dir].push(posts[i]);
    }
    DIRS.sort(function (a, b) { return a.localeCompare(b); });
  }
  function normalizePath(input, base) {
    var p = String(input == null ? '' : input).trim();
    if (!p) return base || '/';
    if (p.charAt(0) === '~') p = p.slice(1) || '/';
    var abs = p.charAt(0) === '/';
    var segs = (abs ? p : (base || '/') + '/' + p).split('/');
    var out = [];
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (!s || s === '.') continue;
      if (s === '..') { out.pop(); continue; }
      out.push(s);
    }
    return '/' + out.join('/');
  }
  function dirSlug(name) {
    if (FS[name]) return name;
    for (var i = 0; i < DIRS.length; i++) {
      if (DIRNAME[DIRS[i]] === name || DIRNAME_EN[DIRS[i]] === name) return DIRS[i];
    }
    return null;
  }
  function canonicalPath(path) {
    if (!path || path === '/') return '/';
    var segs = String(path).slice(1).split('/');
    var slug = dirSlug(segs[0]);
    if (!slug) return null;
    segs[0] = slug;
    return '/' + segs.join('/');
  }
  function displayName(slug) {
    if (lang === 'en') return DIRNAME_EN[slug] || DIRNAME[slug] || slug;
    return DIRNAME[slug] || slug;
  }
  function displayPath(path) {
    if (!path || path === '/') return '/';
    var segs = path.slice(1).split('/');
    segs[0] = displayName(segs[0]);
    return '/' + segs.join('/');
  }
  function langOfName(name) {
    if (!name) return null;
    if (FS[name]) return 'en';
    for (var i = 0; i < DIRS.length; i++) {
      if (DIRNAME[DIRS[i]] === name) return 'zh';
      if (DIRNAME_EN[DIRS[i]] === name) return 'en';
    }
    return null;
  }
  function pathLang(input, base) {
    var direct = langOfName(input);
    if (direct) return direct;
    var p = normalizePath(input, base);
    if (p === '/') return null;
    return langOfName(p.slice(1).split('/')[0]);
  }
  function setLang(next) {
    if (!next || next === lang) return;
    lang = next;
    plain('language: ' + (lang === 'en' ? 'English' : '中文'), 'term-dim');
  }
  function resolveDirArg(arg, base) {
    var slug = dirSlug(arg);
    if (slug) return '/' + slug;
    return canonicalPath(normalizePath(arg, base));
  }
  function isDir(path) {
    var p = canonicalPath(path);
    if (!p) return false;
    if (p === '/') return true;
    return p.lastIndexOf('/') === 0 && !!FS[p.slice(1)];
  }
  function findFile(path) {
    var p = canonicalPath(path);
    if (!p) return null;
    var m = p.match(/^\/([^\/]+)\/(.+)$/);
    if (!m || !FS[m[1]]) return null;
    var want = decodeSeg(m[2]);
    var files = FS[m[1]];
    for (var i = 0; i < files.length; i++) {
      if (urlParts(files[i]).file === want) return files[i];
    }
    return null;
  }

  /* ---------- minimal markdown renderer ---------- */
  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, '<code class="term-ic">$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '[image: $1]');
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="term-a" href="$2">$1</a>');
    return s;
  }
  function renderMd(md) {
    md = String(md || '').replace(/\{\{[<%][\s\S]*?[>%]\}\}/g, '');
    var lines = md.split(/\r?\n/);
    var out = [], inCode = false, buf = [];
    function flushCode() {
      if (buf.length) out.push('<pre class="term-code">' + esc(buf.join('\n')) + '</pre>');
      buf = [];
    }
    for (var i = 0; i < lines.length; i++) {
      var ln = lines[i];
      if (/^```/.test(ln)) { if (inCode) { flushCode(); inCode = false; } else { inCode = true; } continue; }
      if (inCode) { buf.push(ln); continue; }
      var h = ln.match(/^(#{1,6})\s+(.*)$/);
      if (h) { out.push('<div class="term-h term-h' + h[1].length + '">' + inline(h[2]) + '</div>'); continue; }
      if (/^\s*>\s?/.test(ln)) { out.push('<div class="term-quote">' + inline(ln.replace(/^\s*>\s?/, '')) + '</div>'); continue; }
      if (/^\s*[-*+]\s+/.test(ln)) { out.push('<div class="term-li">· ' + inline(ln.replace(/^\s*[-*+]\s+/, '')) + '</div>'); continue; }
      if (/^\s*\|/.test(ln)) { out.push('<div class="term-tr">' + inline(ln) + '</div>'); continue; }
      if (/^\s*(-{3,}|\*{3,})\s*$/.test(ln)) { out.push('<div class="term-hr"></div>'); continue; }
      out.push(ln.trim() === '' ? '<div class="term-sp"></div>' : '<div class="term-p">' + inline(ln) + '</div>');
    }
    flushCode();
    return out.join('');
  }

  /* ---------- commands ---------- */
  function cmdHelp() {
    var rows = [
      ['ls [path] [-t [n]] [-r] [-ongoing] [@tag]', 'list dir/files; -t recent n, -r reverse, -ongoing updating'],
      ['cd <dir> / pwd', 'change / print directory (zh or en names)'],
      ['cat <path|n>', 'read a post by path or [n] index'],
      ['tree [dir]', 'show the directory tree'],
      ['tags [-n <k>] [-a]', 'list tags + counts; -n top k, -a A-Z'],
      ['server', 'site / client / runtime info'],
      ['banner / clear / echo <text>', 'banner / clear / print text'],
      ['help', 'this help']
    ];
    raw('Available commands:', 'term-dim');
    for (var i = 0; i < rows.length; i++) {
      raw('<span class="term-cmdtbl-k">' + esc(rows[i][0]) + '</span><span class="term-cmdtbl-v">' + esc(rows[i][1]) + '</span>', 'term-cmdtbl');
    }
  }

  function catFilter(p, cats) {
    return cats.every(function (c) {
      return (p.cat || '').toLowerCase() === c ||
             (p.sub || '').toLowerCase() === c ||
             (p.series || '').toLowerCase() === c ||
             (p.subseries || '').toLowerCase() === c;
    });
  }
  function tagFilter(p, tags) {
    return tags.every(function (t) {
      return (p.tags || []).some(function (x) { return String(x).toLowerCase() === t; });
    });
  }
  function listPosts(arr) {
    if (!arr.length) { plain('(no matching posts)', 'term-dim'); return; }
    for (var i = 0; i < arr.length; i++) {
      var p = arr[i];
      var n = posts.indexOf(p) + 1;
      var catLabel = lang === 'en' ? (CAT_EN[p.cat] || p.cat) : p.cat;
      var tag = p.sub ? (catLabel + '/' + p.sub) : catLabel;
      var status = (p.status === 'ongoing') ? '<span class="term-status">[更新中]</span>' : '';
      raw('<span class="term-date">' + esc(p.date) + '</span>' +
          '<span class="term-tag">' + esc(tag) + '</span>' +
          '<span class="term-idx">[' + n + ']</span> ' + link(p) + status);
    }
    raw('<span class="term-dim">' + arr.length + ' post(s) · open with cat &lt;n&gt;</span>');
  }
  function listDirs() {
    if (!DIRS.length) { plain('(empty)', 'term-dim'); return; }
    for (var i = 0; i < DIRS.length; i++) {
      raw('<span class="term-dir">' + esc(displayName(DIRS[i])) + '/</span> <span class="term-dim">(' + FS[DIRS[i]].length + ')</span>');
    }
    raw('<span class="term-dim">' + DIRS.length + ' dir(s) · cd &lt;dir&gt; to enter · tree for all</span>');
  }

  function cmdLs(args) {
    var cats = [], tags = [], recent = -1, reverse = false, onlyOngoing = false, pathArg = null, pathLangArg = null;
    for (var i = 0; i < args.length; i++) {
      var a = args[i];
      if (a === '-r') { reverse = true; }
      else if (a === '-ongoing') { onlyOngoing = true; }
      else if (a === '-t') {
        var n = parseInt(args[i + 1], 10);
        if (!isNaN(n)) { recent = n; i++; } else { recent = 10; }
      }
      else if (a.charAt(0) === '@') { tags.push(a.slice(1).toLowerCase()); }
      else if (a.charAt(0) === '-') { plain('ls: unknown option: ' + a, 'term-err'); return; }
      else if (pathArg === null && isDir(resolveDirArg(a, cwd))) { pathArg = resolveDirArg(a, cwd); pathLangArg = pathLang(a, cwd); }
      else { cats.push(a.toLowerCase()); }
    }

    var hasFilters = tags.length || cats.length || recent >= 0 || onlyOngoing;
    if (!pathArg && cwd === '/' && hasFilters) {
      var arr = posts.filter(function (p) { return catFilter(p, cats) && tagFilter(p, tags); });
      if (onlyOngoing) arr = arr.filter(function (p) { return p.status === 'ongoing'; });
      if (recent >= 0) arr = arr.slice(0, recent);
      if (reverse) arr = arr.slice().reverse();
      listPosts(arr);
      return;
    }

    var target = pathArg || cwd;
    if (!isDir(target)) { plain('ls: not a directory: ' + target, 'term-err'); return; }
    if (pathLangArg) setLang(pathLangArg);
    if (target === '/') { listDirs(); return; }

    var files = FS[target.slice(1)].slice();
    if (cats.length) files = files.filter(function (p) { return catFilter(p, cats); });
    if (tags.length) files = files.filter(function (p) { return tagFilter(p, tags); });
    if (onlyOngoing) files = files.filter(function (p) { return p.status === 'ongoing'; });
    if (recent >= 0) files = files.slice(0, recent);
    if (reverse) files = files.slice().reverse();
    listPosts(files);
  }

  function cmdCat(args) {
    var token = args[0];
    if (!token) { plain('cat: usage cat <path|n>', 'term-err'); return; }
    var p = null;
    if (/^\d+$/.test(token)) {
      p = resolve(token);
    } else {
      var path = normalizePath(token, cwd);
      if (isDir(path)) { plain('cat: ' + token + ' is a directory', 'term-err'); return; }
      p = findFile(path);
    }
    if (!p) { plain('cat: no such file: ' + token, 'term-err'); return; }
    plain('### ' + p.title + '  (' + p.date + ')', 'term-dim');
    var target = p.md || (p.url + 'index.md');
    raw('<span class="term-dim">reading ' + esc(target) + ' …</span>');
    fetch(target).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (txt) {
      raw('<div class="term-article">' + renderMd(txt) + '</div>');
      raw('<span class="term-dim">── end · <a class="term-a" href="' + esc(p.url) + '">open in browser</a> ──</span>');
    }).catch(function () {
      plain('read failed, opening page: ' + p.url, 'term-err');
      window.location.href = p.url;
    });
  }

  function cmdCd(args) {
    var target = args.length ? resolveDirArg(args[0], cwd) : '/';
    if (!target || !isDir(target)) { plain('cd: not a directory: ' + (args[0] || '/'), 'term-err'); return; }
    if (args.length) setLang(pathLang(args[0], cwd));
    cwd = target;
    setPrompt();
  }

  function cmdPwd() { plain(displayPath(cwd)); }

  function treeDir(path, prefix) {
    var items = [];
    if (path === '/') {
      for (var i = 0; i < DIRS.length; i++) items.push({ type: 'dir', name: DIRS[i], path: '/' + DIRS[i] });
    } else {
      var files = FS[path.slice(1)];
      for (var j = 0; j < files.length; j++) items.push({ type: 'file', name: urlParts(files[j]).file, post: files[j] });
    }
    for (var k = 0; k < items.length; k++) {
      var it = items[k], last = k === items.length - 1;
      var branch = last ? '└─ ' : '├─ ';
      var next = prefix + (last ? '   ' : '│  ');
      if (it.type === 'dir') {
        raw('<span class="term-tree">' + esc(prefix + branch) + '</span><span class="term-dir">' + esc(displayName(it.name)) + '/</span>');
        treeDir(it.path, next);
      } else {
        var st = it.post.status === 'ongoing' ? ' <span class="term-status">[更新中]</span>' : '';
        raw('<span class="term-tree">' + esc(prefix + branch) + '</span>' + esc(it.name) + st);
      }
    }
  }

  function cmdTree(args) {
    var target = args.length ? resolveDirArg(args[0], cwd) : cwd;
    if (!target || !isDir(target)) { plain('tree: not a directory: ' + (args[0] || cwd), 'term-err'); return; }
    if (args.length) setLang(pathLang(args[0], cwd));
    raw('<span class="term-dir">' + esc(displayPath(target)) + '</span>');
    treeDir(target, '');
  }

  function uniqCount(arr) {
    var m = {};
    for (var i = 0; i < arr.length; i++) {
      var k = arr[i];
      if (!k) continue;
      m[k] = (m[k] || 0) + 1;
    }
    return Object.keys(m).map(function (k) { return { name: k, n: m[k] }; })
      .sort(function (a, b) { return b.n - a.n; });
  }
  function cmdTags(args) {
    var alpha = false, top = 0;
    for (var i = 0; i < args.length; i++) {
      var a = args[i];
      if (a === '-a') { alpha = true; }
      else if (a === '-n') {
        var n = parseInt(args[i + 1], 10);
        if (!isNaN(n)) { top = n; i++; }
        else { plain('tags: -n needs a number', 'term-err'); return; }
      }
      else { plain('tags: unknown option: ' + a, 'term-err'); return; }
    }
    var all = [];
    for (var j = 0; j < posts.length; j++) all = all.concat(posts[j].tags || []);
    var c = uniqCount(all);
    if (alpha) c.sort(function (a, b) { return a.name.localeCompare(b.name, 'zh-Hans-CN'); });
    if (top > 0) c = c.slice(0, top);
    raw('Tags' + (alpha ? ' (A-Z)' : ' (by count)') + ':', 'term-dim');
    raw(c.map(function (t) { return '<span class="term-chip">' + esc(t.name) + ' <span class="term-dim">' + t.n + '</span></span>'; }).join(''));
  }

  function serverRows(title, rows) {
    raw('<span class="term-cmdtbl-k">' + esc(title) + '</span>', 'term-cmdtbl');
    for (var i = 0; i < rows.length; i++) {
      raw('<span class="term-dim">' + esc(rows[i][0]) + '</span>  ' + esc(rows[i][1]));
    }
  }
  function cmdServer() {
    serverRows('host', [
      ['addr', window.location.host],
      ['proto', window.location.protocol.replace(':', '')],
      ['path', window.location.pathname]
    ]);

    var build = [];
    build.push((meta.title || '') + ' · ' + (meta.postCount || posts.length) + ' posts · ' + (meta.catCount || 0) + ' categories');
    if (meta.hugo) build.push('Hugo ' + meta.hugo + (meta.build ? ' · built ' + meta.build : ''));
    if (meta.since) build.push('since ' + meta.since);
    serverRows('build', [['site', build.join(' · ')]]);

    var ua = navigator.userAgent || '';
    var os = /Windows/i.test(ua) ? 'Windows' : /Mac OS X/i.test(ua) ? 'macOS'
           : /Android/i.test(ua) ? 'Android' : /iPhone|iPad|iPod/i.test(ua) ? 'iOS'
           : /Linux/i.test(ua) ? 'Linux' : 'unknown';
    var br = /Edg\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome'
           : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'unknown';
    var conn = navigator.connection || {};
    var tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { tz = ''; }
    var net = (navigator.onLine ? 'online' : 'offline');
    if (conn.effectiveType) net += ' · ' + conn.effectiveType;
    if (conn.downlink) net += ' · ~' + conn.downlink + ' Mb/s';
    serverRows('client', [
      ['ua', br + ' on ' + os],
      ['locale', navigator.language + (tz ? ' · ' + tz : '')],
      ['screen', screen.width + 'x' + screen.height + ' · viewport ' + window.innerWidth + 'x' + window.innerHeight + ' · dpr ' + (window.devicePixelRatio || 1)],
      ['net', net],
      ['cpu', (navigator.hardwareConcurrency || 'n/a') + ' cores · ' + (navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'n/a')]
    ]);

    var perf = [];
    try {
      var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
      if (nav) {
        perf.push('TTFB ' + Math.round(nav.responseStart) + 'ms');
        perf.push('DOMContentLoaded ' + Math.round(nav.domContentLoadedEventEnd) + 'ms');
        perf.push('load ' + Math.round(nav.loadEventEnd || nav.duration) + 'ms');
      }
    } catch (e) { /* ignore */ }
    serverRows('perf', [[perf.length ? perf.join(' · ') : 'n/a']]);

    raw('<span class="term-dim">static hosting (GitHub Pages) — no backend server attached.</span>');
  }

  function banner() {
    var lines = LOGO.split('\n');
    var lw = 0;
    for (var i = 0; i < lines.length; i++) { if (lines[i].length > lw) lw = lines[i].length; }
    var rule = new Array(lw + 1).join('=');
    var pre = document.createElement('pre');
    pre.className = 'term-logo';
    pre.textContent = rule + '\n' + LOGO + '\n' + rule;
    body.appendChild(pre);
    if (meta.desc) plain(meta.desc, 'term-dim');
    raw('<span class="term-dim">' + (meta.postCount || posts.length) + ' posts · ' + (meta.catCount || 0) + ' categories · last update ' + (posts[0] ? esc(posts[0].date) : '—') + '</span>');
    raw('Type <span class="term-key">help</span> for commands, <span class="term-key">ls</span> to browse files, <span class="term-key">tree</span> for all.');
  }

  var COMMANDS = {
    help: cmdHelp,
    ls: cmdLs,
    cd: cmdCd,
    pwd: cmdPwd,
    tree: cmdTree,
    cat: cmdCat,
    tags: cmdTags,
    server: cmdServer,
    banner: banner,
    clear: function () { body.innerHTML = ''; },
    echo: function (args) { plain(args.join(' ')); }
  };

  /* ---------- input loop ---------- */
  function run(line) {
    var parts = line.trim().split(/\s+/);
    var name = (parts[0] || '').toLowerCase();
    var args = parts.slice(1);
    if (!name) return;
    var fn = COMMANDS[name];
    if (fn) { fn(args); }
    else {
      plain('command not found: ' + parts[0], 'term-err');
      raw('<span class="term-dim">try <span class="term-key">help</span></span>');
    }
  }

  function submit(line) {
    promptEcho(line);
    if (line.trim()) {
      history.push(line.trim());
      if (history.length > 200) history.shift();
    }
    hIndex = -1;
    run(line);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var line = input.value;
    input.value = '';
    submit(line);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') {
      if (!history.length) return;
      e.preventDefault();
      if (hIndex < 0) hIndex = history.length;
      hIndex = Math.max(0, hIndex - 1);
      input.value = history[hIndex];
      setTimeout(function () { input.setSelectionRange(input.value.length, input.value.length); }, 0);
    } else if (e.key === 'ArrowDown') {
      if (hIndex < 0) return;
      e.preventDefault();
      hIndex++;
      if (hIndex >= history.length) { hIndex = -1; input.value = ''; }
      else { input.value = history[hIndex]; }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete(input.value);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      body.innerHTML = '';
    }
  });

  function complete(val) {
    var names = Object.keys(COMMANDS);
    var parts = val.split(/\s+/);
    if (parts.length <= 1) {
      var p = parts[0] || '';
      var hit = names.filter(function (n) { return n.indexOf(p) === 0; });
      if (hit.length === 1) { input.value = hit[0] + ' '; }
      else if (hit.length > 1) { plain(hit.join('  '), 'term-dim'); }
    }
  }

  win.addEventListener('click', function (e) {
    var sel = window.getSelection();
    if (sel && String(sel).length) return;
    if (e.target && e.target.closest && e.target.closest('a')) return;
    input.focus({ preventScroll: true });
  });

  /* ---------- fit the terminal to the remaining first-screen height ---------- */
  function fitTerminal() {
    var page = document.querySelector('.terminal-page');
    var screenEl = document.querySelector('.term-screen');
    if (!page || !screenEl) return;
    var top = page.getBoundingClientRect().top + window.scrollY;
    var footer = document.querySelector('footer');
    var fh = footer ? footer.getBoundingClientRect().height : 0;
    var h = window.innerHeight - top - fh - 12;
    if (h < 170) h = 170;
    screenEl.style.height = h + 'px';
  }

  /* ---------- boot ---------- */
  buildTree();
  setPrompt();
  banner();
  fitTerminal();
  window.addEventListener('load', fitTerminal);
  window.addEventListener('resize', fitTerminal);
  input.focus({ preventScroll: true });
})();
