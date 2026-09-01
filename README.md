# 涵舍 · HangYaHan's Blog

https://HangYaHan.github.io

个人博客，记录生活思考、读书笔记、技术整理与项目随笔。

## 技术栈

- 静态站点生成器：[Hugo](https://gohugo.io/)，主题 [LoveIt](https://hugoloveit.com/)
- 部署：[GitHub Pages](https://pages.github.com/)，CI 自动构建（`.github/workflows/hugo.yml`）

## 文章分类

文章放在 `content/posts/<分类>/` 下；`content/archive/` 是按分类折叠的全部文章归档页。

| 目录 | 分类 |
|------|------|
| `fengya` | 风雅涵章 |
| `yawang` | 雅望停云 |
| `banyun` | 搬运 |
| `dushubiji` | 读书笔记 |
| `teachmyself` | TeachMySelf |
| `youyi` | 游艺 |

`teachmyself` 分类下按系列分子类（金融工程、光谱、机器学习、摄影、操作系统等），体现在每篇文章 front matter 的 `categories` 第二项。

## 写文章

在 `content/posts/<分类>/` 下新建 `.md` 文件，front matter 用 YAML：

```yaml
---
title: "[风雅涵章] 文章标题"
date: 2025-08-15
draft: false
categories: ["风雅涵章"]
tags: ["风雅涵章"]
---
```

push 到 `main` 分支后，GitHub Actions 自动构建并部署。
