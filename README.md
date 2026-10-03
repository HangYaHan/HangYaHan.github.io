# 涵舍 · HangYaHan's Blog

https://HangYaHan.github.io

个人博客，记录生活思考、读书笔记、技术整理与项目随笔。

## 技术栈

- 静态站点生成器：[Hugo](https://gohugo.io/)，主题 [LoveIt](https://hugoloveit.com/)
- 部署：[GitHub Pages](https://pages.github.com/)，CI 自动构建（`.github/workflows/hugo.yml`）
- 前端零框架；图表用 [ECharts](https://echarts.apache.org/)（CDN），交互为原生 JS

## 站点结构

| 页面 | 内容 |
|------|------|
| 首页 `/` | 侧栏简介 · Daily Pick（每日一歌一句）· Now · 导航入口 · 最近更新 |
| 归档 `/archive/` | **系列区**（两级：系列/子系列）· **ECharts 关系图谱**（全部/双链/关键词/分类）· **按半年折叠的时间归档** |
| 收藏 `/curated/` | 音乐 · 足迹地图 · 语林（句子）· 影视 · 胶库（模型）· 书籍/博主/网站/网课 |
| 工具 `/utility/` | 定投 / 房贷 / 期权 / 基金费率 / Die With Zero 计算器（纯前端） |
| 关于 `/about/` | 关于我与本站 |

- 全站含**开往（Travellings）**随机穿梭入口（顶栏 🚇 / 移动端菜单）
- 首次进入有**全屏欢迎页**（可点击/自动淡出）

## 文章分类

文章放在 `content/posts/<目录>/` 下：

| 目录 | 分类 |
|------|------|
| `yawang` | 雅望停云 |
| `banyun` | 搬运 |
| `dushubiji` | 读书笔记 |
| `youyi` | 游艺 |

- `风雅涵章` 已并入 `雅望停云`（2026-09）；旧 `fengya` 目录已并入 `yawang`，文章文件名统一为 `雅望停云- 标题.md`。

## 写文章

在 `content/posts/<分类>/` 下新建 `.md`，front matter 用 YAML：

```yaml
---
title: "[雅望停云] 文章标题"
date: 2026-09-06
draft: false
categories: ["雅望停云"]
tags: ["随笔", "人文思考"]   # 真实关键词，不是分类镜像
series: "东湖往事"            # 可选：归档页系列区
subseries: "年度投资复盘"     # 可选：子系列（需先有 series）
---
```

- `title` 的方括号前缀与分类一致；`draft: true` 暂不发布。
- `series` / `subseries` 会自动出现在归档页「系列」区。
- `tags` 用于归档页图谱的「关键词」模式与站内搜索。

推送到 `main` 后，GitHub Actions 自动构建并部署。
