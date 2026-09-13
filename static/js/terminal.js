/* 涵舍终端首页 — 轻量自绘 shell
 * 数据：#term-index / #term-meta（由 layouts/home.html 注入）
 * 无第三方依赖；不做等宽列对齐，规避中文 cell 宽度问题。
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

  var PROMPT = 'visitor@hanshe:~$';
  var history = [];
  var hIndex = -1;

  /* ---------- 输出 ---------- */
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

  /* ---------- 文章查找 ---------- */
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

  /* ---------- 轻量 markdown 渲染 ---------- */
  function inline(s) {
    s = esc(s);
    s = s.replace(/`([^`]+)`/g, '<code class="term-ic">$1</code>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '[图片: $1]');
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

  /* ---------- 命令实现 ---------- */
  function cmdHelp() {
    var rows = [
      ['ls [分类]', '列出文章；-t 只列最近 10 篇'],
      ['cat <序号|slug>', '在终端里阅读文章'],
      ['open <序号|slug>', '跳转到文章页面'],
      ['find <关键词>', '搜索标题 / 摘要 / 标签（别名 grep）'],
      ['series [系列名]', '列出系列 / 系列下的文章'],
      ['categories / tags', '列出分类 / 关键词'],
      ['daily', '随机一句词 + 一首歌'],
      ['now', '此刻状态'],
      ['about / archive / curated / utility', '打开对应页面'],
      ['links', '联系方式'],
      ['gui / home', '回到图形版首页'],
      ['theme [light|dark|auto]', '切换配色'],
      ['whoami / pwd / date / echo / history', '小工具'],
      ['banner / clear / help', '横幅 / 清屏 / 本帮助']
    ];
    raw('可用命令：', 'term-dim');
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
    if (!arr.length) { plain('（没有匹配的文章）', 'term-dim'); return; }
    for (var i = 0; i < arr.length; i++) {
      var p = arr[i];
      var n = posts.indexOf(p) + 1;
      var tag = p.sub ? (p.cat + '/' + p.sub) : p.cat;
      raw('<span class="term-date">' + esc(p.date) + '</span>' +
          '<span class="term-tag">' + esc(tag) + '</span>' +
          '<span class="term-idx">[' + n + ']</span> ' + link(p));
    }
    raw('<span class="term-dim">共 ' + arr.length + ' 篇 · 用 cat/open &lt;序号&gt; 打开</span>');
  }
  function cmdLs(args) {
    if (args[0] === '-t') { listPosts(posts.slice(0, 10)); return; }
    listPosts(catFilter(args[0]));
  }

  function cmdCat(args) {
    var p = resolve(args[0]);
    if (!p) { plain('cat: 找不到文章：' + (args[0] || ''), 'term-err'); return; }
    plain('### ' + p.title + '  (' + p.date + ')', 'term-dim');
    var target = p.md || (p.url + 'index.md');
    raw('<span class="term-dim">正在读取 ' + esc(target) + ' …</span>');
    fetch(target).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.text();
    }).then(function (txt) {
      raw('<div class="term-article">' + renderMd(txt) + '</div>');
      raw('<span class="term-dim">── 完 · <a class="term-a" href="' + esc(p.url) + '">在网页中打开</a> ──</span>');
    }).catch(function () {
      plain('读取失败，改为打开网页：' + p.url, 'term-err');
      window.location.href = p.url;
    });
  }

  function cmdOpen(args) {
    var p = resolve(args[0]);
    if (!p) {
      if (!args[0]) { window.location.href = '/posts/'; return; }
      plain('open: 找不到文章：' + args[0], 'term-err'); return;
    }
    plain('→ ' + p.url);
    window.location.href = p.url;
  }

  function cmdFind(args) {
    var q = args.join(' ').toLowerCase();
    if (!q) { plain('find: 用法 find <关键词>', 'term-err'); return; }
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
  function cmdSeries(args) {
    var names = uniqCount(posts.map(function (p) { return p.series; }));
    if (!names.length) { plain('（暂无系列）', 'term-dim'); return; }
    if (!args[0]) {
      for (var i = 0; i < names.length; i++) {
        raw('<span class="term-idx">' + esc(String(names[i].n)) + ' 篇</span> <span class="term-cmdtbl-k">' + esc(names[i].name) + '</span>');
      }
      raw('<span class="term-dim">用 series &lt;系列名&gt; 查看该系列文章</span>');
      return;
    }
    var name = args.join(' ').toLowerCase();
    var arr = posts.filter(function (p) { return (p.series || '').toLowerCase() === name; });
    if (!arr.length) { plain('series: 没有系列 ' + args.join(' '), 'term-err'); return; }
    arr = arr.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var subs = uniqCount(arr.map(function (p) { return p.subseries; }));
    if (subs.length) {
      for (var s = 0; s < subs.length; s++) {
        raw('<span class="term-tag">' + esc(subs[s].name) + '（' + subs[s].n + '）</span>');
        listPosts(arr.filter(function (p) { return p.subseries === subs[s].name; }));
      }
      var loose = arr.filter(function (p) { return !p.subseries; });
      if (loose.length) listPosts(loose);
    } else {
      listPosts(arr);
    }
  }
  function cmdCategories() {
    var c = uniqCount(posts.map(function (p) { return p.cat; }));
    for (var i = 0; i < c.length; i++) {
      raw('<span class="term-idx">' + esc(String(c[i].n)) + ' 篇</span> <span class="term-cmdtbl-k">' + esc(c[i].name) + '</span>');
    }
  }
  function cmdTags() {
    var all = [];
    for (var i = 0; i < posts.length; i++) all = all.concat(posts[i].tags || []);
    var c = uniqCount(all);
    raw('高频关键词：', 'term-dim');
    raw(c.map(function (t) { return '<span class="term-chip">' + esc(t.name) + ' <span class="term-dim">' + t.n + '</span></span>'; }).join(''));
  }

  function cmdDaily() {
    Promise.all([
      fetch('/quotes.txt').then(function (r) { return r.text(); }),
      fetch('/music_list.txt').then(function (r) { return r.text(); })
    ]).then(function (res) {
      var q = res[0].split('\n').filter(function (s) { return s.trim(); });
      var m = res[1].split('\n').filter(function (s) { return s.trim(); });
      raw('<span class="term-dim">每日一歌一句</span>');
      if (q.length) raw('<span class="term-quote">' + esc(q[Math.floor(Math.random() * q.length)]) + '</span>');
      if (m.length) raw('<span class="term-p">♪ ' + esc(m[Math.floor(Math.random() * m.length)]) + '</span>');
    }).catch(function () { plain('daily: 读取失败', 'term-err'); });
  }

  function cmdLinks() {
    var rows = [];
    if (meta.github) rows.push(['GitHub', meta.github]);
    if (meta.bilibili) rows.push(['Bilibili', meta.bilibili]);
    if (meta.email) rows.push(['Email', meta.email]);
    rows.push(['RSS', '/index.xml']);
    for (var i = 0; i < rows.length; i++) {
      raw('<span class="term-cmdtbl-k">' + esc(rows[i][0]) + '</span><a class="term-a" href="' + esc(rows[i][1]) + '">' + esc(rows[i][1]) + '</a>', 'term-cmdtbl');
    }
  }

  function cmdTheme(args) {
    var mode = (args[0] || 'toggle').toLowerCase();
    if (mode === 'toggle') {
      mode = (document.body.getAttribute('theme') === 'dark') ? 'light' : 'dark';
    }
    if (['light', 'dark', 'auto'].indexOf(mode) < 0) { plain('theme: 用法 theme [light|dark|auto]', 'term-err'); return; }
    try { window.localStorage.setItem('theme', mode); } catch (e) {}
    var isDark = mode === 'dark' ||
      (mode === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.body.setAttribute('theme', isDark ? 'dark' : 'light');
    document.body.setAttribute('cfg-theme', mode);
    plain('已切换为 ' + mode);
  }

  function banner() {
    raw('<span class="term-banner">涵舍</span> <span class="term-dim">HANSHE · terminal</span>');
    if (meta.desc) plain(meta.desc, 'term-dim');
    raw('<span class="term-dim">' + (meta.postCount || posts.length) + ' 篇文章 · ' + (meta.catCount || 0) + ' 个分类 · since ' + esc(meta.since || '') + '</span>');
    raw('输入 <span class="term-key">help</span> 查看命令，<span class="term-key">ls</span> 列出文章，<span class="term-key">gui</span> 回到图形首页。');
    raw('<span class="term-dim">最后更新：' + (posts[0] ? esc(posts[0].date) : '—') + '</span>');
  }

  var COMMANDS = {
    help: cmdHelp,
    ls: cmdLs,
    cat: cmdCat,
    open: cmdOpen,
    find: cmdFind,
    grep: cmdFind,
    series: cmdSeries,
    categories: cmdCategories,
    cats: cmdCategories,
    tags: cmdTags,
    daily: cmdDaily,
    now: function () { plain(meta.now || '（未设置）'); },
    about: function () { window.location.href = '/about/'; },
    archive: function () { window.location.href = '/archive/'; },
    curated: function () { window.location.href = '/curated/'; },
    utility: function () { window.location.href = '/utility/'; },
    posts: function () { window.location.href = '/posts/'; },
    links: cmdLinks,
    contact: cmdLinks,
    gui: function () { window.location.href = '/home/'; },
    home: function () { window.location.href = '/home/'; },
    theme: cmdTheme,
    whoami: function () { plain('visitor — 一个路过的人。'); plain('这里是 ' + (meta.title || '涵舍') + ' 的终端入口。'); },
    pwd: function () { plain('/home/visitor'); },
    date: function () { plain(new Date().toString()); },
    echo: function (args) { plain(args.join(' ')); },
    history: function () {
      for (var i = 0; i < history.length; i++) raw('<span class="term-idx">' + (i + 1) + '</span> ' + esc(history[i]));
    },
    banner: banner,
    clear: function () { body.innerHTML = ''; },
    exit: function () { plain('谢绝退出。这里没有 exit，只有 gui。', 'term-dim'); }
  };

  /* ---------- 输入循环 ---------- */
  function run(line) {
    var parts = line.trim().split(/\s+/);
    var name = (parts[0] || '').toLowerCase();
    var args = parts.slice(1);
    if (!name) return;
    var fn = COMMANDS[name];
    if (fn) { fn(args); }
    else {
      plain('command not found: ' + parts[0], 'term-err');
      raw('<span class="term-dim">试试 <span class="term-key">help</span></span>');
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
    input.focus();
  });

  /* ---------- 启动 ---------- */
  banner();
  input.focus();
})();
