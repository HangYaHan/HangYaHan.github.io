# AGENTS.md

## Architecture

- **Hugo** (0.164.0 extended) + theme **LoveIt**, deployed to GitHub Pages by CI.
- Blog posts are **Markdown files** under `content/posts/<dir>/`. They are NOT GitHub Issues.
- No local toolchain is *required*, but a local `hugo` CLI exists for preview/build.

## Where posts live

| Directory | front-matter category | Notes |
|-----------|----------------------|-------|
| `content/posts/fengya/` | 雅望停云 | dir name is legacy; URLs still contain `风雅涵章` |
| `content/posts/yawang/` | 雅望停云 | |
| `content/posts/dushubiji/` | 读书笔记 | |
| `content/posts/banyun/` | 搬运 | |
| `content/posts/teachmyself/` | TeachMySelf | 2nd `categories` item = subcategory |
| `content/posts/youyi/` | 游艺 | |

- **`风雅涵章` was merged into `雅望停云`** (2026-09). Titles now read `[雅望停云] …`. Old category URL `/categories/风雅涵章/` is gone.
- `teachmyself/` posts carry a subcategory as the second `categories` item (e.g. `["TeachMySelf", "金融工程 FE"]`). Many of these are `draft: true`.

## Front matter (YAML)

```yaml
---
title: "[雅望停云] 文章标题"
date: 2026-09-06
draft: false
categories: ["雅望停云"]
tags: ["随笔", "人文思考"]      # real keywords, NOT category mirrors
series: "东湖往事"               # optional
subseries: "年度投资复盘"        # optional; requires series
---
```

- `title` carries the category prefix in brackets, matching the category.
- `date`: `YYYY-MM-DD`.
- `draft: true` hides the post.
- `series` / `subseries` drive the Archive series area. Current series: `年度记录`(→ 年度总结 / 年度投资复盘), `TeachMySelf`(→ course subseries), `读书笔记`, `搬运`, `东湖往事`, `别后`.
- Tag vocabulary + plan live in `workbench/tags-plan.md` and `workbench/tags-review.md`.

## Key templates & assets (project overrides)

- `layouts/partials/header.html` — custom desktop/mobile header; holds the **开往/Travellings** link and includes the splash partial.
- `layouts/partials/splash.html` — full-screen welcome overlay (copy inside marked `【文案区】`).
- `layouts/home.html` — homepage (sidebar / Daily Pick / Now / Navigation / Recent).
- `layouts/section/archive.html` — Archive page: **系列区 (series/subseries)** + **ECharts graph** (injects JSON + loads `bloggraph.js`) + **按半年折叠的时间归档**. Category tree was removed.
- `layouts/section/utility.html`, `layouts/shortcodes/{dca,mortgage,option,fundfee,diewithzero}.html` — finance tools.
- `static/js/bloggraph.js` — Archive graph logic (modes: 全部/双链/关键词/分类).
- `assets/css/_override.scss` — palette variables (月白 / 天青 / 黛蓝).
- `assets/css/_custom.scss` — components & design tokens (`--ui-*`, `--g-*`); homepage, graph, curated, splash, series.
- `static/footprint.json`, `static/china-cities.json`, `static/lib/chart.umd.min.js`. ECharts also loaded from `registry.npmmirror.com` CDN (archive/curated).

## Dark mode gotcha (important)

- LoveIt toggles `document.body[theme="dark"]`, **not** `html[data-theme="dark"]`.
- In SCSS always write `body[theme="dark"] & { … }` for dark overrides. Using `html[data-theme=…]` silently does nothing.

## CI / deployment

- `.github/workflows/hugo.yml` builds with Hugo `0.164.0` (extended), deploys `public/`.
- Triggered by `push` to `main` / `reconstruct_LoveIt`, and `workflow_dispatch`.
- No auto-commit back to the repo; deployment only.

## Git / push responsibility

- **Never push.** Pushing to `origin` is the human author's job; agent must NOT `git push` (avoid remote fetch/pull too).
- Agent may stage/commit locally, then stop. Tell the author to run `git push origin main`.
- Reason: network to `github.com` is unreliable here.

## Build gotchas

- A running `hugo server` holds `.hugo_build.lock` → a plain `hugo` build will hang. Stop the server first (or run builds with a timeout and kill `hugo`).
- Stale `public/` keeps removed pages (e.g. deleted category dirs). Use `hugo --gc --cleanDestinationDir` to get a truthful output.
- PowerShell 5.1 reads `.ps1` as ANSI: don't put Chinese literals in `.ps1` (they corrupt). Pass data via UTF-8 JSON + an ASCII-only script, or use the edit/write tools.
- Do NOT use PowerShell `Add-Content`/`Set-Content` for Chinese content in `.scss`/`.md` — it writes GBK and breaks Hugo's UTF-8 parse. Use the edit/write tools.
- Publishing a draft from `workbench/`: **check the destination path does not already exist first** (once overwrote an existing post).

## Auto-generated / ignored (do not edit)

- `public/` (build output), `.hugo_build.lock`, `resources/` — gitignored.

## Config & content you can edit

- `hugo.toml` — main config (title, menu, `params`, timezone `Asia/Shanghai`, footer).
- `content/` — posts and pages (`about/`, `archive/`, `curated/`, `utility/`, `_index.md`).
- `static/` — static assets (`js/`, `lib/`, `.json`, images).
- `assets/` — stylesheets (`_override.scss`, `_custom.scss`).
- `layouts/` — template overrides listed above.
- `archetypes/` — content templates.

## Scratch / unrelated

- `workbench/` — plans & drafts: `TODO.md`, `design-language.md`, `tags-plan.md`, `tags-review.md`, `模型清单.md`.
- `heritage/` — archived writing-skill definitions.
- `.opencode/` — opencode config (writing skills).

## Known inconsistencies

- `archetypes/default.md` uses TOML front matter (`+++`); all posts use YAML (`---`). Edit manually after `hugo new`.
- Post dir `fengya/` now belongs to category `雅望停云`; kept for stable URLs. If renaming, add Hugo aliases to avoid dead links.
