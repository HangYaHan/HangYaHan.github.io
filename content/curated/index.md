---
title: "Curated"
date: 2025-07-25
draft: false
---

<script src="https://registry.npmmirror.com/echarts/5.5.1/files/dist/echarts.min.js"></script>

<details class="curated-sec" id="music-sec">
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
  var charts = [];
  function buildRecord(chartId, legendId, data, palette) {
    var el = document.getElementById(chartId);
    if (!el) return;
    var chart = echarts.init(el);
    charts.push(chart);
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
  var sec = document.getElementById('music-sec');
  if (sec) sec.addEventListener('toggle', function () { if (sec.open) charts.forEach(function (c) { c.resize(); }); });
})();
</script>

</details>

<details class="curated-sec">
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
      for (var i = quotes.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = quotes[i]; quotes[i] = quotes[j]; quotes[j] = t;
      }
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

<details class="curated-sec" id="footprint-sec">
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
    var sec = document.getElementById('footprint-sec');
    if (sec) sec.addEventListener('toggle', function () { if (sec.open && chart) chart.resize(); });
  });
})();
</script>

</details>

<details class="curated-sec">
<summary>Film &amp; TV / 🎬 影视</summary>

<div class="curated-updated">看过：约 268 部（2026.09 整理）</div>

<p class="curated-intro">这个片单不是一次整理出来的：先是我我让列了第一批，第二批，第三批，然后我又让 AI 按我前面三批的偏好生成了一批，我逐条勾掉"看过"的，最后合并去重。所以它一定不完整——很多看过的片子想不起来、根本没列进来；也一定有错——可能有的我没看过，有的片名张冠李戴。仅供参考，想起来的时候随时补充。</p>

<div class="music-toolbar">
<input type="text" id="movie-search" class="music-search" placeholder="搜索片名…">
<span id="movie-count" class="music-count"></span>
</div>

<div id="movie-box">
<h3>华语电影</h3>
<ul>
<li>无问西东</li>
<li>活着</li>
<li>让子弹飞</li>
<li>阳光灿烂的日子</li>
<li>我不是药神</li>
<li>流浪地球</li>
<li>流浪地球2</li>
<li>城南旧事</li>
<li>甲方乙方</li>
<li>非诚勿扰</li>
<li>疯狂的石头</li>
<li>疯狂的赛车</li>
<li>无人区</li>
<li>夏洛特烦恼</li>
<li>西虹市首富</li>
<li>羞羞的铁拳</li>
<li>驴得水</li>
<li>唐人街探案2</li>
<li>唐人街探案3</li>
<li>飞驰人生1</li>
<li>飞驰人生2</li>
<li>飞驰人生3</li>
<li>八角笼中</li>
<li>周处除三害</li>
<li>喋血双雄</li>
<li>唐伯虎点秋香</li>
<li>国产凌凌漆</li>
<li>大内密探零零发</li>
<li>喜剧之王</li>
<li>少林足球</li>
<li>功夫</li>
<li>赌神</li>
<li>赌圣</li>
<li>无间道</li>
<li>古惑仔之人在江湖</li>
<li>古惑仔之猛龙过江</li>
<li>窃听风云</li>
<li>窃听风云2</li>
<li>寒战</li>
<li>寒战2</li>
<li>毒战</li>
<li>旺角卡门</li>
<li>警察故事</li>
<li>警察故事2</li>
<li>尖峰时刻</li>
<li>宝贝计划</li>
<li>新警察故事</li>
<li>门徒</li>
<li>扫毒</li>
<li>使徒行者</li>
<li>杀破狼</li>
<li>叶问</li>
<li>叶问2</li>
<li>叶问3</li>
<li>叶问4：完结篇</li>
<li>一代宗师</li>
<li>逃学威龙</li>
<li>逃学威龙2</li>
<li>逃学威龙3</li>
<li>整蛊专家</li>
<li>破坏之王</li>
<li>食神</li>
<li>九品芝麻官</li>
<li>长江七号</li>
<li>美人鱼</li>
<li>反贪风暴</li>
<li>使徒行者2：谍影行动</li>
<li>黄飞鸿</li>
<li>黄飞鸿之男儿当自强</li>
<li>霍元甲</li>
<li>少林寺</li>
<li>英雄本色2</li>
<li>英雄本色3</li>
<li>无间道2</li>
<li>无间道3：终极无间</li>
<li>红高粱</li>
</ul>

<h3>华语电视剧</h3>
<ul>
<li>大明王朝1566</li>
<li>雍正王朝</li>
<li>康熙王朝</li>
<li>三国演义（94版）</li>
<li>红楼梦（87版）</li>
<li>士兵突击</li>
<li>我的团长我的团</li>
<li>亮剑</li>
<li>西游记（86版）</li>
<li>水浒传（98版）</li>
<li>家有儿女</li>
<li>编辑部的故事</li>
<li>大宅门</li>
<li>乔家大院</li>
<li>康熙微服私访记</li>
<li>花千骨</li>
<li>走向共和</li>
<li>爱情公寓</li>
<li>欢乐颂</li>
<li>我的前半生</li>
<li>人民的名义</li>
<li>潜伏</li>
<li>风筝</li>
</ul>

<h3>动画</h3>
<ul>
<li>千与千寻</li>
<li>哈尔的移动城堡</li>
<li>你的名字</li>
<li>天气之子</li>
<li>钢之炼金术师FA</li>
<li>死亡笔记</li>
<li>数码宝贝</li>
<li>网球王子</li>
<li>四驱兄弟</li>
<li>圣斗士星矢</li>
<li>蜡笔小新</li>
<li>樱桃小丸子</li>
<li>名侦探柯南</li>
<li>火影忍者</li>
<li>高达00</li>
<li>高达UC</li>
<li>西游记（动画版）</li>
<li>哪吒传奇</li>
<li>小鲤鱼历险记</li>
<li>虹猫蓝兔七侠传</li>
<li>黑猫警长</li>
<li>葫芦兄弟</li>
<li>海尔兄弟</li>
<li>大头儿子和小头爸爸</li>
<li>喜羊羊与灰太狼</li>
<li>熊出没</li>
<li>猪猪侠</li>
<li>秦时明月</li>
<li>狐妖小红娘</li>
<li>魁拔</li>
<li>蓝猫淘气三千问</li>
</ul>

<h3>日剧 / 日影</h3>
<ul>
<li>白色巨塔</li>
<li>逆转裁判</li>
<li>东京塔</li>
</ul>

<h3>欧美电影</h3>
<ul>
<li>泰坦尼克号</li>
<li>阿凡达</li>
<li>盗梦空间</li>
<li>星际穿越</li>
<li>楚门的世界</li>
<li>肖申克的救赎</li>
<li>阿甘正传</li>
<li>海上钢琴师</li>
<li>机器人总动员</li>
<li>寻梦环游记</li>
<li>疯狂动物城</li>
<li>冰雪奇缘</li>
<li>玩具总动员</li>
<li>黑客帝国</li>
<li>怦然心动</li>
<li>触不可及</li>
<li>三傻大闹宝莱坞</li>
<li>摔跤吧爸爸</li>
<li>指环王系列</li>
<li>复仇者联盟系列</li>
<li>辛德勒的名单</li>
<li>拯救大兵瑞恩</li>
<li>美丽人生</li>
<li>心灵捕手</li>
<li>超体</li>
<li>头号玩家</li>
<li>火星救援</li>
<li>蝙蝠侠：黑暗骑士</li>
<li>蝙蝠侠：黑暗骑士崛起</li>
<li>小丑</li>
<li>猫鼠游戏</li>
<li>华尔街之狼</li>
<li>模仿游戏</li>
<li>美丽心灵</li>
<li>沉默的羔羊</li>
<li>七宗罪</li>
<li>海边的曼彻斯特</li>
<li>谍影重重</li>
<li>碟中谍</li>
<li>007：大战皇家赌场</li>
<li>星球大战：新希望</li>
<li>星球大战：帝国反击战</li>
<li>终结者2</li>
<li>异形</li>
<li>异形契约</li>
<li>普罗米修斯</li>
<li>环太平洋</li>
<li>哥斯拉</li>
<li>金刚</li>
<li>侏罗纪公园</li>
<li>变形金刚</li>
<li>速度与激情</li>
<li>闪灵</li>
<li>爱在黎明破晓前</li>
<li>爱在日落黄昏时</li>
<li>放牛班的春天</li>
<li>疯狂原始人</li>
<li>神偷奶爸</li>
<li>小黄人大眼萌</li>
<li>超能陆战队</li>
<li>无敌破坏王</li>
<li>银河护卫队3</li>
<li>蜘蛛侠：纵横宇宙</li>
<li>哥斯拉大战金刚2：帝国崛起</li>
<li>死侍与金刚狼</li>
<li>奥本海默</li>
<li>变形金刚2</li>
<li>变形金刚3</li>
<li>变形金刚4：绝迹重生</li>
<li>速度与激情5</li>
<li>速度与激情7</li>
<li>速度与激情8</li>
<li>速度与激情：特别行动</li>
<li>碟中谍4：幽灵协议</li>
<li>碟中谍5：神秘国度</li>
<li>碟中谍6：全面瓦解</li>
<li>谍影重重2</li>
<li>谍影重重3</li>
<li>007：无暇赴死</li>
<li>007：幽灵党</li>
<li>终结者：黑暗命运</li>
<li>终结者：创世纪</li>
<li>独立日</li>
<li>2012</li>
<li>后天</li>
<li>侏罗纪世界</li>
<li>侏罗纪世界2</li>
<li>侏罗纪世界3</li>
<li>环太平洋2：雷霆再起</li>
<li>哥斯拉2：怪兽之王</li>
<li>金刚：骷髅岛</li>
<li>金刚狼3：殊死一战</li>
<li>钢铁侠</li>
<li>钢铁侠2</li>
<li>钢铁侠3</li>
<li>美国队长</li>
<li>美国队长2</li>
<li>美国队长3：内战</li>
<li>银河护卫队2</li>
<li>奇异博士</li>
<li>黑豹</li>
<li>蜘蛛侠：英雄归来</li>
<li>蜘蛛侠：英雄远征</li>
<li>蚁人</li>
<li>蚁人2：黄蜂女现身</li>
<li>正义联盟</li>
<li>神奇女侠</li>
<li>海王</li>
<li>怪兽电力公司</li>
<li>海底总动员</li>
<li>赛车总动员</li>
<li>玩具总动员3</li>
<li>冰雪奇缘2</li>
<li>功夫熊猫</li>
<li>功夫熊猫2</li>
<li>功夫熊猫3</li>
<li>驯龙高手</li>
<li>驯龙高手2</li>
<li>马达加斯加</li>
<li>快乐的大脚</li>
<li>出租车司机</li>
<li>极速车王</li>
<li>大空头</li>
</ul>

<h3>欧美剧集</h3>
<ul>
<li>绝命毒师</li>
<li>风骚律师</li>
<li>越狱</li>
<li>黑袍纠察队</li>
</ul>

<h3>韩国</h3>
<ul>
<li>寄生虫</li>
<li>熔炉</li>
<li>釜山行</li>
<li>汉江怪物</li>
<li>雪国列车</li>
<li>鱿鱼游戏</li>
<li>黑暗荣耀</li>
</ul>

<h3>纪录片</h3>
<ul>
<li>手术两百年</li>
<li>空中浩劫</li>
</ul>

</div>

<script>
(function () {
  var box = document.getElementById('movie-box');
  var input = document.getElementById('movie-search');
  var count = document.getElementById('movie-count');
  var lis = box.querySelectorAll('li');
  var uls = box.querySelectorAll('ul');
  var total = lis.length;
  function render() {
    var q = input.value.trim().toLowerCase();
    var shown = 0;
    uls.forEach(function (ul) {
      var vis = 0;
      ul.querySelectorAll('li').forEach(function (li) {
        var m = !q || li.textContent.toLowerCase().indexOf(q) >= 0;
        li.style.display = m ? '' : 'none';
        if (m) vis++;
      });
      ul.style.display = vis ? '' : 'none';
      shown += vis;
    });
    count.textContent = q ? (shown + ' / ' + total + ' 部') : (total + ' 部');
  }
  input.addEventListener('input', render);
  render();
})();
</script>

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

<details class="curated-sec" id="gunpla-sec">
<summary>Gunpla &amp; Kits / 🤖 胶库</summary>
<p class="curated-intro">保存我买过、拼过的拼装模型：约九成是万代高达（Gunpla），其余是其他品牌的拼装套件。清单整理中，先从 workbench 迁过来。</p>
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
