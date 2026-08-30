---
title: "Curated / 收藏"
date: 2025-07-25
draft: false
---

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

<h3>Languages / 语种</h3>

<div class="bar-row"><span class="bar-label">华语 Mandarin</span><span class="bar-track"><span class="bar-fill" style="width:55%"></span></span><span class="bar-pct">~55%</span></div>
<div class="bar-row"><span class="bar-label">英语 English</span><span class="bar-track"><span class="bar-fill" style="width:32%"></span></span><span class="bar-pct">~32%</span></div>
<div class="bar-row"><span class="bar-label">粤语 Cantonese</span><span class="bar-track"><span class="bar-fill" style="width:8%"></span></span><span class="bar-pct">~8%</span></div>
<div class="bar-row"><span class="bar-label">日语 Japanese</span><span class="bar-track"><span class="bar-fill" style="width:4%"></span></span><span class="bar-pct">~4%</span></div>
<div class="bar-row"><span class="bar-label">其他 Other</span><span class="bar-track"><span class="bar-fill" style="width:1%"></span></span><span class="bar-pct">~1%</span></div>

<h3>Genres / 曲风</h3>

<div class="bar-row"><span class="bar-label">情歌 Ballad</span><span class="bar-track"><span class="bar-fill" style="width:40%"></span></span><span class="bar-pct">~40%</span></div>
<div class="bar-row"><span class="bar-label">流行 Pop</span><span class="bar-track"><span class="bar-fill" style="width:25%"></span></span><span class="bar-pct">~25%</span></div>
<div class="bar-row"><span class="bar-label">电子 EDM</span><span class="bar-track"><span class="bar-fill" style="width:18%"></span></span><span class="bar-pct">~18%</span></div>
<div class="bar-row"><span class="bar-label">摇滚 Rock</span><span class="bar-track"><span class="bar-fill" style="width:6%"></span></span><span class="bar-pct">~6%</span></div>
<div class="bar-row"><span class="bar-label">民谣 Folk</span><span class="bar-track"><span class="bar-fill" style="width:4%"></span></span><span class="bar-pct">~4%</span></div>
<div class="bar-row"><span class="bar-label">原声 OST</span><span class="bar-track"><span class="bar-fill" style="width:4%"></span></span><span class="bar-pct">~4%</span></div>
<div class="bar-row"><span class="bar-label">Hip-Hop / Rap</span><span class="bar-track"><span class="bar-fill" style="width:1%"></span></span><span class="bar-pct">~1%</span></div>
<div class="bar-row"><span class="bar-label">其他 Other</span><span class="bar-track"><span class="bar-fill" style="width:2%"></span></span><span class="bar-pct">~2%</span></div>

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

</details>

<details class="curated-sec" open>
<summary>Quotes / 📜 语林</summary>

<div class="curated-updated">Last Updated: 2026.08.18 — Quotes: 258</div>

<p class="curated-intro">这部分的内容的由来要从“哲学本”说起，它最初是我高中时期用来摘抄喜欢句子的笔记本，最初只是为了写作积累素材，后来慢慢变成了收集“至理名言”的小小宝库。可惜那本本子后来遗失了，至今仍未找到，实在令人遗憾。我清楚地记得里面记录了许多让我心动的句子，或许它现在正静静地躺在家中某个角落吃灰，也可能早已在垃圾场化为废纸，飘向了异世界。前些日子回家大扫除时，我还特意想找回那本旧本子，把家翻了个底朝天，依然没有找到。真的就这样丢失了吗？实在有些不甘心。毕竟，正常打扫卫生时看到那样一本整理得井井有条的本子，怎么会舍得丢掉呢？现在只要世界上有一台计算机保存着我的 repository，我的“哲学本”就再也不会丢了。本科时，我又新开了一本“哲学本”，并一直延续至今。现在有了个人博客，我也不再需要手抄内容，毕竟每一次 git 提交都会自动保存历史，所以这里的内容也成了“哲学本”的超集。现在我将持续往其中添加新的内容。</p>

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

<div class="curated-updated">去过的地方 — 按生活状态分级（悬停查看详情）</div>

<div id="footprint-map" style="width:100%;height:520px;"></div>

<div class="footprint-legend" style="display:flex;flex-wrap:wrap;gap:.6rem 1.2rem;margin-top:.8rem;font-size:.85rem;">
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#b8c0c6;margin-right:.35rem;"></span>路过</span>
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#8fc4e2;margin-right:.35rem;"></span>短期旅行</span>
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#2f7ca3;margin-right:.35rem;"></span>中期旅行</span>
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#1c3d5c;margin-right:.35rem;"></span>长期旅行</span>
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#d99a2b;margin-right:.35rem;"></span>出差</span>
  <span><span style="display:inline-block;width:.8em;height:.8em;border-radius:.15rem;background:#c8402a;margin-right:.35rem;"></span>定居</span>
</div>

<script src="https://registry.npmmirror.com/echarts/5.5.1/files/dist/echarts.min.js"></script>
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
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json').then(function (r) { return r.json(); }),
    fetch('/footprint.json').then(function (r) { return r.json(); })
  ]).then(function (res) {
    echarts.registerMap('china', res[0]);
    var chart = echarts.init(document.getElementById('footprint-map'));
    var seriesData = [];
    Object.keys(res[1]).forEach(function (name) {
      var d = res[1][name];
      if (!d.level || !LEVELS[d.level]) return;
      seriesData.push({ name: name, value: 1, itemStyle: { areaColor: LEVELS[d.level] } });
    });
    chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: function (p) {
          var d = res[1][p.name];
          if (!d || (!d.level && !d.notes)) return p.name;
          var html = p.name;
          if (d.level) html += '<br/>' + d.level;
          if (d.notes) html += '<br/>' + d.notes;
          return html;
        }
      },
      series: [{
        type: 'map', map: 'china', roam: true,
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
