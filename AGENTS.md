# AGENTS.md

## Architecture

- This is a **Hugo**-powered GitHub Pages blog (generator: https://gohugo.io/), theme **LoveIt**.
- Blog posts are **Markdown files** under `content/posts/<category>/`. They are NOT GitHub Issues.
- No local build toolchain is required. The CI workflow builds and deploys on every push.

## Where posts live

Posts are plain Markdown files, grouped by category directory:

| Directory | Category |
|-----------|----------|
| `content/posts/fengya/` | 风雅涵章 |
| `content/posts/yawang/` | 雅望停云 |
| `content/posts/banyun/` | 搬运 |
| `content/posts/dushubiji/` | 读书笔记 |
| `content/posts/teachmyself/` | TeachMySelf |
| `content/posts/youyi/` | 游艺 |

`teachmyself/` posts carry a subcategory as the second item of `categories` (e.g. `["TeachMySelf", "金融工程 FE"]`), grouped under the TeachMySelf block on the archive page.

## Front matter format (YAML)

Every post starts with:

```yaml
---
title: "[风雅涵章] 文章标题"
date: 2025-08-15
draft: false
categories: ["风雅涵章"]
tags: ["风雅涵章"]
---
```

- `title` carries the category prefix in brackets (e.g. `[风雅涵章] ...`).
- `date` format: `YYYY-MM-DD`.
- `draft: true` hides the post from the built site.

## CI / deployment

- `.github/workflows/hugo.yml` builds with Hugo `0.164.0` (extended) and deploys `public/` to GitHub Pages.
- Triggered by `push` to `main` or `reconstruct_LoveIt`, and by `workflow_dispatch`.
- No auto-commit back to the repo; deployment only.

## Git / push responsibility

- **Never push.** Pushing to `origin` (GitHub) is the human author's job. The agent must NOT run `git push` (nor `git fetch`/`pull` against the remote when avoidable).
- The agent may stage and commit locally, but must stop there and leave all commits unpushed.
- Reason: network access to `github.com` is unreliable on this machine; the author pushes manually when ready.
- When a task involves "publishing" or "deploying", the agent commits locally, then tells the author to run `git push origin main` themselves.

## Auto-generated / ignored (do not edit)

- `public/` — Hugo build output (gitignored)
- `.hugo_build.lock` — Hugo lockfile (gitignored)
- `resources/` — Hugo asset cache (gitignored)

## Config & content you can edit

- `hugo.toml` — main config (title, menu, params, languages)
- `content/` — posts (`content/posts/...`) and pages (`about/`, `archive/`, `curated/`, `utility/`, `_index.md`)
- `static/` — static assets (images, files) referenced from posts
- `assets/` — stylesheets (`_custom.scss`) etc.
- `archetypes/` — Hugo content templates

## Unrelated content

- `workbench/` — scratch/draft directory (holds `TODO.md` with content/refactoring plans)
- `heritage/` — archived versions of writing skill definitions
- `.opencode/` — opencode configuration (writing skills)

## Known inconsistencies

- `archetypes/default.md` uses TOML front matter (`+++`), but all existing posts use YAML (`---`). Running `hugo new` will generate front matter that does not match the existing style; edit it manually to match the YAML format above.
