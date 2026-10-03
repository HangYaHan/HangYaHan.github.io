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

  var PROMPT = 'YaHan:/$';
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
  function promptEcho(cmd) {
    raw('<span class="term-prompt-inline">' + esc(PROMPT) + '</span> <span class="term-cmd">' + esc(cmd) + '</span>');
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
      ['ls [category] [@tag] [-t [n]] [-r]', 'list posts; -t recent n, -r reverse'],
      ['cat <n>', 'read a post by its [n] index'],
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
      var tag = p.sub ? (p.cat + '/' + p.sub) : p.cat;
      raw('<span class="term-date">' + esc(p.date) + '</span>' +
          '<span class="term-tag">' + esc(tag) + '</span>' +
          '<span class="term-idx">[' + n + ']</span> ' + link(p));
    }
    raw('<span class="term-dim">' + arr.length + ' post(s) · open with cat &lt;n&gt;</span>');
  }
  function cmdLs(args) {
    var cats = [], tags = [], recent = -1, reverse = false;
    for (var i = 0; i < args.length; i++) {
      var a = args[i];
      if (a === '-r') { reverse = true; }
      else if (a === '-t') {
        var n = parseInt(args[i + 1], 10);
        if (!isNaN(n)) { recent = n; i++; } else { recent = 10; }
      }
      else if (a.charAt(0) === '@') { tags.push(a.slice(1).toLowerCase()); }
      else if (a.charAt(0) === '-') { plain('ls: unknown option: ' + a, 'term-err'); return; }
      else { cats.push(a.toLowerCase()); }
    }
    var arr = posts.filter(function (p) { return catFilter(p, cats) && tagFilter(p, tags); });
    if (recent >= 0) arr = arr.slice(0, recent);
    if (reverse) arr = arr.slice().reverse();
    listPosts(arr);
  }

  function cmdCat(args) {
    var token = args[0];
    if (!/^\d+$/.test(token || '')) { plain('cat: usage cat <n>', 'term-err'); return; }
    var p = resolve(token);
    if (!p) { plain('cat: no such post: ' + token, 'term-err'); return; }
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
    raw('Type <span class="term-key">help</span> for commands, <span class="term-key">ls</span> to list posts.');
  }

  var COMMANDS = {
    help: cmdHelp,
    ls: cmdLs,
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
  banner();
  fitTerminal();
  window.addEventListener('load', fitTerminal);
  window.addEventListener('resize', fitTerminal);
  input.focus({ preventScroll: true });
})();
