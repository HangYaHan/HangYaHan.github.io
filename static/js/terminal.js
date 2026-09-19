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
  function slugOf(url) {
    var parts = String(url || '').replace(/\/+$/, '').split('/');
    return parts[parts.length - 1] || '';
  }
  function resolve(token) {
    if (!token) return null;
    if (/^\d+$/.test(token)) {
      var i = parseInt(token, 10);
      return posts[i - 1] || null;
    }
    var t = String(token).toLowerCase();
    for (var i = 0; i < posts.length; i++) {
      if (slugOf(posts[i].url).toLowerCase() === t) return posts[i];
    }
    for (var j = 0; j < posts.length; j++) {
      if (posts[j].title.toLowerCase().indexOf(t) >= 0) return posts[j];
    }
    return null;
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
      ['ls [category]', 'list posts; -t for the 10 most recent'],
      ['cat <n|slug>', 'read a post in the terminal'],
      ['find <keyword>', 'search title / summary / tags (alias: grep)'],
      ['categories / tags', 'list categories / tags'],
      ['about / archive / curated / utility', 'open the page'],
      ['whoami / pwd / date / echo / history', 'small utilities'],
      ['banner / clear / help', 'banner / clear / this help']
    ];
    raw('Available commands:', 'term-dim');
    for (var i = 0; i < rows.length; i++) {
      raw('<span class="term-cmdtbl-k">' + esc(rows[i][0]) + '</span><span class="term-cmdtbl-v">' + esc(rows[i][1]) + '</span>', 'term-cmdtbl');
    }
  }

  function catFilter(token) {
    if (!token) return posts.slice();
    var t = String(token).toLowerCase();
    return posts.filter(function (p) {
      return (p.cat || '').toLowerCase() === t || (p.sub || '').toLowerCase() === t ||
             (p.series || '').toLowerCase() === t || (p.subseries || '').toLowerCase() === t;
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
    raw('<span class="term-dim">' + arr.length + ' post(s) · open with cat/open &lt;n&gt;</span>');
  }
  function cmdLs(args) {
    if (args[0] === '-t') { listPosts(posts.slice(0, 10)); return; }
    listPosts(catFilter(args[0]));
  }

  function cmdCat(args) {
    var p = resolve(args[0]);
    if (!p) { plain('cat: no such post: ' + (args[0] || ''), 'term-err'); return; }
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

  function cmdFind(args) {
    var q = args.join(' ').toLowerCase();
    if (!q) { plain('find: usage find <keyword>', 'term-err'); return; }
    var hits = posts.filter(function (p) {
      return [p.title, p.summary, p.cat, p.sub, p.series, p.subseries].concat(p.tags || [])
        .join(' ').toLowerCase().indexOf(q) >= 0;
    });
    listPosts(hits);
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
  function cmdCategories() {
    var c = uniqCount(posts.map(function (p) { return p.cat; }));
    for (var i = 0; i < c.length; i++) {
      raw('<span class="term-idx">' + esc(String(c[i].n)) + ' posts</span> <span class="term-cmdtbl-k">' + esc(c[i].name) + '</span>');
    }
  }
  function cmdTags() {
    var all = [];
    for (var i = 0; i < posts.length; i++) all = all.concat(posts[i].tags || []);
    var c = uniqCount(all);
    raw('Top tags:', 'term-dim');
    raw(c.map(function (t) { return '<span class="term-chip">' + esc(t.name) + ' <span class="term-dim">' + t.n + '</span></span>'; }).join(''));
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
    find: cmdFind,
    grep: cmdFind,
    categories: cmdCategories,
    cats: cmdCategories,
    tags: cmdTags,
    about: function () { window.location.href = '/about/'; },
    archive: function () { window.location.href = '/archive/'; },
    curated: function () { window.location.href = '/curated/'; },
    utility: function () { window.location.href = '/utility/'; },
    posts: function () { window.location.href = '/posts/'; },
    whoami: function () { plain('visitor — just someone passing by.'); plain('Hanshe terminal — a personal space.'); },
    pwd: function () { plain('/'); },
    date: function () { plain(new Date().toString()); },
    echo: function (args) { plain(args.join(' ')); },
    history: function () {
      for (var i = 0; i < history.length; i++) raw('<span class="term-idx">' + (i + 1) + '</span> ' + esc(history[i]));
    },
    banner: banner,
    clear: function () { body.innerHTML = ''; },
    exit: function () { plain('There is no exit here.', 'term-dim'); }
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
