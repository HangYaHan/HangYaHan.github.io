---
title: "Curated"
date: 2025-07-25
draft: false
---

<script src="https://registry.npmmirror.com/echarts/5.5.1/files/dist/echarts.min.js"></script>

<details class="curated-sec" open>
<summary>Music / 🎵 音乐</summary>

<div class="curated-updated">Last Updated: 2026.08.11 — Tracks: 1224</div>

<h3>Tags / 标签</h3>

<div class="curated-tags">#华语流行 #千禧年代金曲 #EDM电子 #粤语经典 #情歌重度用户 #动漫OST #DJ/Remix #乐器翻奏 #热梗夹带 #游戏BGM #回忆驱动</div>

<table class="curated-table">
<thead><tr><th>Tags</th><th>Notes</th></tr></thead>
<tbody>
<tr><td>华语流行</td><td>周杰伦、林俊杰、张惠妹、孙燕姿、王力宏……国语歌是我的根</td></tr>
<tr><td>千禧年代金曲</td><td>2000-2010 那批歌，小时候听的，现在还在听</td></tr>
<tr><td>EDM电子</td><td>写代码或者骑车的时候喜欢放</td></tr>
<tr><td>粤语经典</td><td>Beyond、陈慧娴、林忆莲、张学友的粤语歌</td></tr>
<tr><td>情歌重度用户</td><td>伤感情歌、失恋歌特别多，就是喜欢</td></tr>
<tr><td>动漫 OST</td><td>看过的番的 OP/ED，澤野弘之、梶浦由記那些</td></tr>
<tr><td>DJ / Remix</td><td>有时候 Remix 比原版带劲，DJ 版、Bootleg 都收</td></tr>
<tr><td>乐器翻奏</td><td>萨克斯吹的晴天，钢琴弹的天空之城，小提琴拉的卡农</td></tr>
<tr><td>热梗夹带</td><td>药水哥、老八话、白给话、黑喂狗、全世界都得了MVP</td></tr>
<tr><td>游戏BGM</td><td>红警3、星际、魔兽、MC，还有各种独立游戏的配乐</td></tr>
<tr><td>回忆驱动</td><td>不一定多好听，但它们连着某个时间、某个人</td></tr>
</tbody>
</table>

<div class="record-charts">
  <div class="record-chart-wrap">
    <h4 class="record-title">Languages / 语种</h4>
    <div class="record-chart">
      <div class="record-chart-label">语种<br>Languages</div>
      <div id="lang-chart" class="record-chart-canvas"></div>
    </div>
    <div class="record-legend" id="lang-legend"></div>
  </div>
  <div class="record-chart-wrap">
    <h4 class="record-title">Genres / 曲风</h4>
    <div class="record-chart">
      <div class="record-chart-label">曲风<br>Genres</div>
      <div id="genre-chart" class="record-chart-canvas"></div>
    </div>
    <div class="record-legend" id="genre-legend"></div>
  </div>
</div>

<div class="music-browser">
<div class="music-toolbar">
<input type="text" id="music-search" class="music-search" placeholder="搜索歌名 / 歌手…">
<span id="music-count" class="music-count"></span>
</div>
<ul id="music-list" class="music-list"></ul>
</div>

<script>
(function () {
  fetch('/music_list.txt')
    .then(function (r) { return r.text(); })
    .then(function (text) {
      var songs = text.split('\n').filter(function (s) { return s.trim(); });
      var ul = document.getElementById('music-list');
      var count = document.getElementById('music-count');
      var search = document.getElementById('music-search');
      function render(filter) {
        var f = (filter || '').toLowerCase();
        ul.innerHTML = '';
        var shown = 0;
        songs.forEach(function (s) {
          if (f && s.toLowerCase().indexOf(f) < 0) return;
          var li = document.createElement('li');
          li.className = 'music-item';
          li.textContent = s;
          ul.appendChild(li);
          shown++;
        });
        count.textContent = shown + ' / ' + songs.length + ' 首';
      }
      search.addEventListener('input', function (e) { render(e.target.value); });
      render('');
    });
})();
</script>

<script>
(function () {
  if (typeof echarts === 'undefined') return;
  function buildRecord(chartId, legendId, data, palette) {
    var el = document.getElementById(chartId);
    if (!el) return;
    var chart = echarts.init(el);
    chart.setOption({
      tooltip: { trigger: 'item', formatter: '{b}：{c}%' },
      series: [{
        type: 'pie',
        radius: ['40%', '80%'],
        center: ['50%', '50%'],
        itemStyle: { borderRadius: 4, borderColor: 'rgba(0,0,0,0.35)', borderWidth: 1 },
        label: { show: false },
        labelLine: { show: false },
        emphasis: { scale: true, scaleSize: 6, itemStyle: { shadowBlur: 12, shadowColor: 'rgba(0,0,0,0.3)' } },
        data: data.map(function (d, i) {
          return { name: d.name, value: d.value, itemStyle: { color: palette[i % palette.length] } };
        })
      }]
    });
    var legend = document.getElementById(legendId);
    if (legend) {
      legend.innerHTML = data.map(function (d, i) {
        return '<span class="record-legend-item"><i style="background:' + palette[i % palette.length] + '"></i>' + d.name + ' ' + d.value + '%</span>';
      }).join('');
    }
  }
  buildRecord('lang-chart', 'lang-legend', [
    { name: '华语', value: 55 }, { name: '英语', value: 32 }, { name: '粤语', value: 8 }, { name: '日语', value: 4 }, { name: '其他', value: 1 }
  ], ['#f6a6b2', '#8fc4e2', '#f6d365', '#a8d8a8', '#c9c9c9']);
  buildRecord('genre-chart', 'genre-legend', [
    { name: '情歌', value: 40 }, { name: '流行', value: 25 }, { name: '电子', value: 18 }, { name: '摇滚', value: 6 }, { name: '民谣', value: 4 }, { name: '原声', value: 4 }, { name: 'Hip-Hop', value: 1 }, { name: '其他', value: 2 }
  ], ['#f6a6b2', '#8fc4e2', '#b39ddb', '#f08585', '#a8d8a8', '#f6d365', '#80cbc4', '#c9c9c9']);
})();
</script>

</details>

<details class="curated-sec" open>
<summary>Quotes / 📜 语林</summary>

<div class="curated-updated">Last Updated: 2026.08.18 — Quotes: 258</div>

<p class="curated-intro">这部分的内容的由来要从“哲学本”说起，它最初是我高中时期用来摘抄喜欢句子的笔记本，最初只是为了写作积累素材，后来慢慢变成了收集“至理名言”的小小宝库。可惜那本本子后来遗失了，至今仍未找到，实在令人遗憾。我清楚地记得里面记录了许多让我心动的句子，或许它现在正静静地躺在家中某个角落吃灰，也可能早已在垃圾场化为废纸，飘向了异世界。前些日子回家大扫除时，我还特意想找回那本旧本子，把家翻了个底朝天，依然没有找到。真的就这样丢失了吗？实在有些不甘心。毕竟，正常打扫卫生时看到那样一本整理得井井有条的本子，怎么会舍得丢掉呢？现在只要世界上有一台计算机保存着我的 repository，我的“哲学本”就再也不会丢了。本科时，我又新开了一本“哲学本”，并一直延续至今。现在有了个人博客，我也不再需要手抄内容，毕竟每一次 git 提交都会自动保存历史，所以这里的内容也成了“哲学本”的超集。现在我将持续往其中添加新的内容。</p>

<div class="qt-player">
  <div class="qt-text" id="qt-text"></div>
  <div class="qt-source" id="qt-source"></div>
  <div class="qt-bar">
    <span class="qt-progress" id="qt-progress"></span>
    <button class="qt-btn" id="qt-prev" type="button" title="上一句">⏮</button>
    <button class="qt-btn" id="qt-play" type="button" title="暂停/继续">⏸</button>
    <button class="qt-btn" id="qt-next" type="button" title="下一句">⏭</button>
  </div>
</div>

<div class="music-browser">
<div class="music-toolbar">
<input type="text" id="quote-search" class="music-search" placeholder="搜索句子 / 出处…">
<span id="quote-count" class="music-count"></span>
</div>
<ul id="quote-list" class="music-list"></ul>
</div>

<script>
(function () {
  fetch('/quotes.txt')
    .then(function (r) { return r.text(); })
    .then(function (text) {
      var quotes = text.split('\n').filter(function (s) { return s.trim(); });
      for (var i = quotes.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = quotes[i]; quotes[i] = quotes[j]; quotes[j] = t;
      }
      var idx = 0, typing = false, paused = false, timer = null;
      var textEl = document.getElementById('qt-text');
      var srcEl = document.getElementById('qt-source');
      var progEl = document.getElementById('qt-progress');
      var playEl = document.getElementById('qt-play');
      function parse(q) {
        var p = q.split(' -- ');
        return { text: p[0], src: p.length > 1 ? '—— ' + p[1] : '' };
      }
      function showProgress() {
        if (progEl) progEl.textContent = (idx + 1) + ' / ' + quotes.length;
      }
      function typeQuote() {
        if (paused) return;
        if (typing) return;
        var q = parse(quotes[idx]);
        typing = true;
        textEl.textContent = '';
        srcEl.textContent = '';
        showProgress();
        var pos = 0;
        timer = setInterval(function () {
          if (paused) return;
          pos++;
          textEl.textContent = q.text.slice(0, pos);
          if (pos >= q.text.length) {
            clearInterval(timer);
            typing = false;
            srcEl.textContent = q.src;
            timer = setTimeout(function () { next(true); }, 6000);
          }
        }, 45);
      }
      function next(auto) {
        clearTimeout(timer);
        clearInterval(timer);
        typing = false;
        idx = (idx + 1) % quotes.length;
        typeQuote();
      }
      function prev() {
        clearTimeout(timer);
        clearInterval(timer);
        typing = false;
        idx = (idx - 1 + quotes.length) % quotes.length;
        typeQuote();
      }
      document.getElementById('qt-next').addEventListener('click', function () { next(); });
      document.getElementById('qt-prev').addEventListener('click', prev);
      playEl.addEventListener('click', function () {
        paused = !paused;
        playEl.textContent = paused ? '▶' : '⏸';
      });
      typeQuote();
      var ul = document.getElementById('quote-list');
      var count = document.getElementById('quote-count');
      var search = document.getElementById('quote-search');
      function render(filter) {
        var f = (filter || '').toLowerCase();
        ul.innerHTML = '';
        var shown = 0;
        quotes.forEach(function (s) {
          if (f && s.toLowerCase().indexOf(f) < 0) return;
          var li = document.createElement('li');
          li.className = 'music-item';
          li.textContent = s;
          ul.appendChild(li);
          shown++;
        });
        count.textContent = shown + ' / ' + quotes.length + ' 句';
      }
      search.addEventListener('input', function (e) { render(e.target.value); });
      render('');
    });
})();
</script>

</details>

<details class="curated-sec" open>
<summary>Footprint / 🗺️ 足迹地图</summary>

<div class="curated-updated">去过的地方 — 城市级标注（悬停查看详情）</div>

<div id="footprint-map" style="width:100%;height:520px;"></div>

<div class="footprint-legend" style="display:flex;flex-wrap:wrap;gap:.6rem 1.2rem;margin-top:.8rem;font-size:.85rem;">
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#b8c0c6;margin-right:.35rem;"></span>路过</span>
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#8fc4e2;margin-right:.35rem;"></span>短期旅行</span>
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#2f7ca3;margin-right:.35rem;"></span>中期旅行</span>
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#1c3d5c;margin-right:.35rem;"></span>长期旅行</span>
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#d99a2b;margin-right:.35rem;"></span>出差</span>
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#c8402a;margin-right:.35rem;"></span>定居</span>
</div>

<script>
(function () {
  var LEVELS = {
    '路过': '#b8c0c6',
    '短期旅行': '#8fc4e2',
    '中期旅行': '#2f7ca3',
    '长期旅行': '#1c3d5c',
    '出差': '#d99a2b',
    '定居': '#c8402a'
  };
  Promise.all([
    fetch('/china-cities.json').then(function (r) { return r.json(); }),
    fetch('/footprint.json').then(function (r) { return r.json(); })
  ]).then(function (res) {
    var geo = res[0], data = res[1];
    echarts.registerMap('cn-cities', geo);
    var chart = echarts.init(document.getElementById('footprint-map'));

    var featNames = geo.features.map(function (f) { return f.properties.name; });
    function matchCity(name) {
      for (var i = 0; i < featNames.length; i++) {
        var k = featNames[i];
        if (k === name || k.indexOf(name) === 0) return k;
      }
      return null;
    }

    var byFeat = {};
    var seriesData = [];
    data.forEach(function (d) {
      var fn = matchCity(d.name);
      if (!fn) return;
      byFeat[fn] = d;
      var colors = d.levels.map(function (l) { return LEVELS[l]; });
      var itemStyle;
      if (colors.length === 1) {
        itemStyle = { areaColor: colors[0] };
      } else {
        itemStyle = {
          areaColor: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: colors[0] },
            { offset: 0.5, color: colors[0] },
            { offset: 0.5, color: colors[1] },
            { offset: 1, color: colors[1] }
          ])
        };
      }
      seriesData.push({ name: fn, value: 1, itemStyle: itemStyle });
    });

    chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: function (p) {
          var d = byFeat[p.name];
          if (!d) return p.name;
          var html = '<b>' + p.name + '</b>';
          if (d.levels && d.levels.length) html += '<br/>' + d.levels.join(' + ');
          if (d.notes) html += '<br/>' + d.notes;
          return html;
        }
      },
      series: [{
        type: 'map', map: 'cn-cities', roam: true,
        label: { show: false },
        emphasis: { label: { show: true }, itemStyle: { areaColor: '#15506f' } },
        itemStyle: { areaColor: '#e8eef3', borderColor: '#c3d3dd', borderWidth: 0.6 },
        data: seriesData
      }]
    });
    window.addEventListener('resize', function () { if (chart) chart.resize(); });
  });
})();
</script>

</details>

<details class="curated-sec">
<summary>Film & TV / 🎬 影视</summary>
<p>想到几个写几个，慢慢补。</p>
</details>

<details class="curated-sec">
<summary>Books / 📚 书籍</summary>
<p>先放上我写过书评的书：</p>
<ul>
<li>《别做正常的傻瓜》</li>
<li>《The C Programming Language》</li>
<li>《人类群星闪耀时》</li>
<li>《人月神话》</li>
<li>《万千微尘纷坠心田》</li>
<li>《选择做富人》</li>
<li>《禅与摩托车维修艺术》</li>
</ul>
</details>

<details class="curated-sec">
<summary>Bloggers / ✍️ 博主</summary>
<p>你关注的博客、UP主。</p>
</details>

<details class="curated-sec">
<summary>Websites / 🌐 网站</summary>
<p>常用工具站、资源站。</p>
</details>

<details class="curated-sec">
<summary>Courses / 🎓 网课</summary>
<ul>
<li>【公开课】中华诗词 - 叶嘉莹</li>
<li>【厦门大学】金融工程 - 郑振龙</li>
<li>【南京大学】操作系统原理 - 蒋炎岩</li>
<li>【哈佛大学】CS50</li>
<li>【台湾大学】中国文学史 - 欧丽娟</li>
<li>【台湾大学】唐诗新思路 - 欧丽娟</li>
<li>【印度理工学院】光电子材料与器件</li>
<li>【西安交通大学】模拟集成电路设计 - 张鸿</li>
<li>拉扎维（待补）</li>
<li>新手小牛（待补）数模电，别忘了本科的课程</li>
</ul>
</details>
