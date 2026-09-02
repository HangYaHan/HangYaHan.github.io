/* Blog Graph — /archive/ 图谱
 * 数据: layouts/section/archive.html 注入的 <script type="application/json">#archive-graph-data script
 * 依赖: ECharts (defer 已保证先于本文件)
 * 样式/配色: CSS 变量 --g-* 与 --ui-*（见 _custom.scss），亮暗两套
 */
(function () {
  'use strict';

  var holder = document.getElementById('archive-graph-data');
  if (!holder) return;
  var scriptEl = holder.querySelector('script');
  if (!scriptEl) return;

  var posts = [];
  try { posts = JSON.parse(scriptEl.textContent); } catch (e) { posts = []; }
  if (!posts || !posts.length) return;
  if (typeof echarts === 'undefined') {
    var shell0 = document.getElementById('graph-canvas-shell');
    if (shell0) shell0.setAttribute('data-load-fail', '1');
    return;
  }

  var canvasEl = document.getElementById('graph-canvas');
  var shellEl = document.getElementById('graph-canvas-shell');
  var emptyEl = document.getElementById('graph-empty');
  var searchEl = document.getElementById('graph-search');
  var tagBox = document.getElementById('sb-tags');
  var statsEl = document.getElementById('sb-stats');
  var recentEl = document.getElementById('sb-recent');
  var selectedBody = document.getElementById('sb-selected-body');
  var selectedHint = document.getElementById('sb-selected-hint');
  var modeBtns = Array.prototype.slice.call(document.querySelectorAll('#graph-modes .mode-tab'));
  if (!canvasEl || !shellEl || !emptyEl || !searchEl || !tagBox || !statsEl || !recentEl) return;

  var chart = null;
  var mode = 'all';
  var query = '';
  var activeTag = '';
  var selected = null;
  var state = { nodes: [], links: [] };

  function cssVar(name, fb) {
    var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fb;
  }
  function colors() {
    return {
      post: cssVar('--g-node-post', '#2c3a46'),
      tag: cssVar('--g-node-tag', '#2f7ca3'),
      cat: cssVar('--g-node-cat', '#a1793f'),
      text: cssVar('--g-text', '#2c3a46'),
      muted: cssVar('--g-text-muted', '#8a9aa6'),
      border: cssVar('--g-border', '#d3dde6'),
      surface: cssVar('--g-surface', '#ffffff'),
      lineTag: cssVar('--g-line-tag', 'rgba(47,124,163,.32)'),
      lineCat: cssVar('--g-line-cat', 'rgba(161,121,63,.30)')
    };
  }
  function norm(s) { return String(s || '').toLowerCase(); }
  /* 过滤「与分类重名」的噪音标签 */
  function realTags(p) {
    return (p.tags || []).filter(function (t) {
      return t && norm(t) !== norm(p.cat) && norm(t) !== norm(p.sub);
    });
  }
  function typeName(t) {
    if (t === 'post') return '文章';
    if (t === 'tag') return '关键词';
    return '分类';
  }

  function currentPosts() {
    var list = posts;
    var q = norm(query);
    if (q) {
      list = list.filter(function (p) {
        return [p.title, p.sum, p.cat, p.sub].concat(p.tags || []).join(' ').toLowerCase().indexOf(q) >= 0;
      });
    }
    if (activeTag) {
      list = list.filter(function (p) { return realTags(p).indexOf(activeTag) >= 0; });
    }
    return list;
  }
  function tagCounts(list) {
    var m = {};
    list.forEach(function (p) {
      realTags(p).forEach(function (t) { m[t] = (m[t] || 0) + 1; });
    });
    return m;
  }
  function catCounts(list) {
    var m = {};
    list.forEach(function (p) {
      if (p.cat) m[p.cat] = (m[p.cat] || 0) + 1;
      if (p.sub) m[p.sub] = (m[p.sub] || 0) + 1;
    });
    return m;
  }

  /* ---------- 图数据 ---------- */
  function buildState() {
    var list = currentPosts();
    var nodes = [], links = [];
    var ids = {};
    var tc = tagCounts(posts);
    var cc = catCounts(posts);
    function nid(id, raw, type, size) {
      if (ids[id]) return;
      ids[id] = true;
      nodes.push({ id: id, raw: raw, type: type, size: size });
    }
    function edge(a, b, kind) {
      if (ids[a] && ids[b]) links.push({ source: a, target: b, kind: kind });
    }
    var showCat = mode === 'categories' || mode === 'all';
    var showTag = mode === 'tags' || mode === 'all';

    list.forEach(function (p) {
      var pid = 'p:' + p.url;
      if (showCat) {
        if (p.cat) nid('c:' + p.cat, p.cat, 'category', Math.min(32, 14 + (cc[p.cat] || 1) * 2));
        if (p.sub) nid('c:' + p.sub, p.sub, 'category', Math.min(32, 14 + (cc[p.sub] || 1) * 2));
      }
      nid(pid, p.title, 'post', 18);
      if (showTag) {
        realTags(p).forEach(function (t) {
          nid('t:' + t, t, 'tag', Math.min(24, 10 + (tc[t] || 1) * 2));
          edge(pid, 't:' + t, 'tag');
        });
      }
      if (showCat) {
        if (p.cat) edge(pid, 'c:' + p.cat, 'category');
        if (p.sub) edge(pid, 'c:' + p.sub, 'category');
      }
    });
    state.nodes = nodes;
    state.links = links;
    return list;
  }

  /* ---------- ECharts ---------- */
  function catIdx(type) { return type === 'post' ? 0 : (type === 'tag' ? 1 : 2); }

  function option() {
    var c = colors();
    var showPostLabels = query !== '' || activeTag !== '' || mode === 'tags';
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item', confine: true,
        backgroundColor: c.surface, borderColor: c.border, borderWidth: 1,
        textStyle: { color: c.text, fontSize: 12 },
        formatter: function (p) {
          if (p.dataType !== 'node' || !p.data) return '';
          return typeName(p.data.type) + '：' + p.data.raw;
        }
      },
      legend: {
        top: 6, left: 8, itemWidth: 10, itemHeight: 10, itemGap: 12,
        textStyle: { color: c.muted, fontSize: 11 },
        data: [
          { name: '文章', itemStyle: { color: c.post } },
          { name: '关键词', itemStyle: { color: c.tag } },
          { name: '分类', itemStyle: { color: c.cat } }
        ]
      },
      series: [{
        type: 'graph', layout: 'force', roam: true, draggable: true, symbol: 'circle',
        categories: [
          { name: '文章', itemStyle: { color: c.post } },
          { name: '关键词', itemStyle: { color: c.tag } },
          { name: '分类', itemStyle: { color: c.cat } }
        ],
        data: state.nodes.map(function (n) {
          var isPost = n.type === 'post';
          return {
            id: n.id, raw: n.raw, type: n.type, category: catIdx(n.type), symbolSize: n.size,
            url: n.url, date: n.date, cat: n.cat, sub: n.sub, sum: n.sum,
            itemStyle: {
              borderColor: c.surface,
              borderWidth: n.size > 22 ? 2 : 1.5
            },
            label: {
              show: !isPost || showPostLabels,
              position: 'right', distance: 8, color: c.text,
              fontSize: isPost ? 11 : 10, fontWeight: 600,
              overflow: 'truncate', width: 160,
              formatter: n.raw
            }
          };
        }),
        links: state.links.map(function (l) {
          return {
            source: l.source, target: l.target,
            lineStyle: {
              width: l.kind === 'tag' ? 1 : 1.2,
              opacity: l.kind === 'tag' ? 0.32 : 0.28,
              color: l.kind === 'tag' ? c.lineTag : c.lineCat
            }
          };
        }),
        force: { repulsion: 220, edgeLength: [58, 104], gravity: 0.15, friction: 0.3, layoutAnimation: true },
        emphasis: {
          focus: 'adjacency', scale: 1.18,
          lineStyle: { width: 2.4, opacity: 0.9 },
          label: { show: true, fontWeight: 700 }
        },
        blur: { itemStyle: { opacity: 0.15 }, label: { opacity: 0.08 }, lineStyle: { opacity: 0.03 } },
        labelLayout: { hideOverlap: true },
        animationDuration: 650, animationEasing: 'cubicOut'
      }]
    };
  }

  function ensureChart() {
    if (!chart) chart = echarts.init(canvasEl);
  }

  function showEmpty(title, desc) {
    emptyEl.querySelector('strong').textContent = title;
    emptyEl.querySelector('span').textContent = desc;
    emptyEl.style.display = 'flex';
    shellEl.classList.add('is-empty');
  }
  function hideEmpty() {
    emptyEl.style.display = 'none';
    shellEl.classList.remove('is-empty');
  }

  /* ---------- 侧栏渲染 ---------- */
  function renderSelected() {
    if (!selected) {
      selectedHint.style.display = '';
      selectedBody.style.display = 'none';
      selectedBody.textContent = '';
      return;
    }
    selectedHint.style.display = 'none';
    selectedBody.style.display = '';
    selectedBody.textContent = '';
    var d = selected;

    var pill = document.createElement('span');
    pill.className = 'node-type node-type-' + d.type;
    pill.textContent = typeName(d.type);
    selectedBody.appendChild(pill);

    var h2 = document.createElement('h2');
    h2.textContent = d.raw;
    selectedBody.appendChild(h2);

    if (d.type === 'post') {
      if (d.sum) {
        var sum = document.createElement('p');
        sum.className = 'selected-sum';
        sum.textContent = d.sum;
        selectedBody.appendChild(sum);
      }
      var meta = document.createElement('div');
      meta.className = 'selected-meta';
      if (d.date) { var dt = document.createElement('span'); dt.textContent = d.date; meta.appendChild(dt); }
      var seg = [d.cat, d.sub].filter(Boolean).join(' · ');
      if (seg) { var cg = document.createElement('span'); cg.textContent = seg; meta.appendChild(cg); }
      selectedBody.appendChild(meta);

      var post = findPostByUrl(d.url);
      if (post && realTags(post).length) {
        var chips = document.createElement('div');
        chips.className = 'selected-tags';
        realTags(post).forEach(function (t) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'tag-pill';
          b.textContent = '#' + t;
          b.addEventListener('click', function () { goTag(t); });
          chips.appendChild(b);
        });
        selectedBody.appendChild(chips);
      }
      if (d.url) {
        var a = document.createElement('a');
        a.className = 'open-post-btn';
        a.href = d.url;
        a.textContent = '打开文章';
        selectedBody.appendChild(a);
      }
    } else {
      var info = document.createElement('p');
      info.className = 'muted selected-sum';
      if (d.type === 'tag') {
        var tcount = 0;
        posts.forEach(function (p) { if (realTags(p).indexOf(d.raw) >= 0) tcount++; });
        info.textContent = '含此关键词的文章 ' + tcount + ' 篇，点击下方标签可只显示相关文章。';
        if (activeTag) {
          var clear = document.createElement('button');
          clear.type = 'button';
          clear.className = 'tag-pill';
          clear.textContent = '清除筛选';
          clear.addEventListener('click', function () { goTag(''); });
          selectedBody.appendChild(info);
          selectedBody.appendChild(clear);
          return;
        }
      } else {
        var ccount = 0;
        posts.forEach(function (p) { if (p.cat === d.raw || p.sub === d.raw) ccount++; });
        info.textContent = '此分类共 ' + ccount + ' 篇。';
      }
      selectedBody.appendChild(info);
    }
  }

  function renderTags() {
    var tc = tagCounts(posts);
    var arr = Object.keys(tc)
      .map(function (k) { return { name: k, count: tc[k] }; })
      .sort(function (a, b) { return b.count - a.count || a.name.localeCompare(b.name, 'zh'); })
      .slice(0, 12);
    tagBox.textContent = '';
    if (!arr.length) {
      var none = document.createElement('span');
      none.className = 'muted';
      none.textContent = '暂无独立关键词（文章补 tag 后会出现在这里）';
      tagBox.appendChild(none);
      return;
    }
    arr.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tag-pill' + (activeTag === t.name ? ' active' : '');
      var text = document.createElement('span');
      text.textContent = '#' + t.name;
      var count = document.createElement('span');
      count.className = 'pill-count';
      count.textContent = t.count;
      b.appendChild(text);
      b.appendChild(count);
      b.addEventListener('click', function () {
        goTag(activeTag === t.name ? '' : t.name);
      });
      tagBox.appendChild(b);
    });
  }

  function renderStats(list) {
    var tagSet = {}, catSet = {};
    state.nodes.forEach(function (n) {
      if (n.type === 'tag') tagSet[n.raw] = 1;
      if (n.type === 'category') catSet[n.raw] = 1;
    });
    var cards = [
      { k: '文章', v: list.length },
      { k: '关键词', v: Object.keys(tagSet).length },
      { k: '分类', v: Object.keys(catSet).length },
      { k: '关系', v: state.links.length }
    ];
    statsEl.textContent = '';
    cards.forEach(function (c) {
      var card = document.createElement('div');
      card.className = 'stat-card';
      var strong = document.createElement('strong');
      strong.textContent = c.v;
      var span = document.createElement('span');
      span.textContent = c.k;
      card.appendChild(strong);
      card.appendChild(span);
      statsEl.appendChild(card);
    });
  }

  function renderRecent() {
    recentEl.textContent = '';
    posts.slice(0, 8).forEach(function (p) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'recent-row';
      var title = document.createElement('span');
      title.className = 'recent-title';
      title.textContent = p.title;
      var meta = document.createElement('span');
      meta.className = 'recent-meta';
      meta.textContent = p.cat || '未分类';
      b.appendChild(title);
      b.appendChild(meta);
      b.addEventListener('click', function () {
        query = '';
        activeTag = '';
        mode = 'all';
        syncModeButtons();
        if (searchEl.value) searchEl.value = '';
        render();
        focusNode('p:' + p.url);
      });
      recentEl.appendChild(b);
    });
  }

  function renderAll(list) {
    renderTags();
    renderStats(list);
    renderRecent();
    renderSelected();
  }

  /* ---------- 主渲染 ---------- */
  function render() {
    var list = buildState();
    if (!state.nodes.length) {
      hideEmpty();
      showEmpty('没有找到匹配的内容', '试试更短的搜索词，或清除筛选');
      chart && chart.clear();
      renderAll(list);
      return;
    }
    hideEmpty();
    ensureChart();
    chart.setOption(option(), true);
    if (selected && !state.nodes.some(function (n) { return n.id === selected.id; })) {
      selected = null;
    }
    renderAll(list);
  }

  function focusNode(id) {
    if (!chart) return;
    var idx = -1;
    state.nodes.some(function (n, i) { if (n.id === id) { idx = i; return true; } return false; });
    if (idx < 0) return;
    var n = state.nodes[idx];
    chart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
    chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: idx });
    chart.dispatchAction({ type: 'focusNodeAdjacency', seriesIndex: 0, dataIndex: idx });
    selected = n;
    renderSelected();
  }

  function selectNode(node) {
    var idx = -1;
    state.nodes.some(function (n, i) { if (n.id === node.id) { idx = i; return true; } return false; });
    if (idx >= 0) {
      chart.dispatchAction({ type: 'downplay', seriesIndex: 0 });
      chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: idx });
      chart.dispatchAction({ type: 'focusNodeAdjacency', seriesIndex: 0, dataIndex: idx });
    }
    selected = node;
    renderSelected();
  }

  function findPostByUrl(url) {
    for (var i = 0; i < posts.length; i++) if (posts[i].url === url) return posts[i];
    return null;
  }

  function goTag(t) {
    activeTag = t;
    if (t) { mode = 'tags'; syncModeButtons(); }
    selected = null;
    if (!t) render();
    else { query = ''; if (searchEl.value) searchEl.value = ''; render(); }
  }

  function syncModeButtons() {
    modeBtns.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-mode') === mode); });
  }

  function setMode(m) {
    mode = m;
    if (m !== 'tags') activeTag = '';
    selected = null;
    syncModeButtons();
    render();
  }

  /* ---------- 事件 ---------- */
  function bindEvents() {
    modeBtns.forEach(function (b) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode')); });
    });
    searchEl.addEventListener('input', function () {
      query = searchEl.value;
      selected = null;
      render();
    });
    if (chart) {
      chart.on('click', function (p) {
        if (p.dataType === 'node' && p.data) selectNode(p.data);
      });
    }
    window.addEventListener('resize', function () { chart && chart.resize(); });
  }

  /* 主题切换监听：body[theme] 变化 → 换色重绘 */
  var mo = null;
  function watchTheme() {
    if (typeof MutationObserver === 'undefined') return;
    mo = new MutationObserver(function () {
      if (!chart) return;
      chart.setOption(option(), true);
      renderSelected();
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ['theme'] });
  }

  render();
  bindEvents();
  if (shellEl.getBoundingClientRect().height > 0) chart && chart.resize();
  watchTheme();
})();
