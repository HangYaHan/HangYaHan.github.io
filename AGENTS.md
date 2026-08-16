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
| `content/posts/gewu/` | 格物致雅 |
| `content/posts/hanfen/` | 涵芬撷英 |
| `content/posts/yawang/` | 雅望停云 |
| `content/posts/youyi/` | 游艺 |

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

## Auto-generated / ignored (do not edit)

- `public/` — Hugo build output (gitignored)
- `.hugo_build.lock` — Hugo lockfile (gitignored)
- `resources/` — Hugo asset cache (gitignored)

## Config & content you can edit

- `hugo.toml` — main config (title, menu, params, languages)
- `content/` — posts (`content/posts/...`) and pages (`about/`, `curated/`, `utility/`, `_index.md`)
- `static/` — static assets (images, files) referenced from posts
- `assets/` — stylesheets (`_custom.scss`) etc.
- `archetypes/` — Hugo content templates

## Unrelated content

- `workbench/` — scratch/draft directory
- `heritage/` — archived versions of writing skill definitions
- `reconstruct/` — migration/refactoring notes (see `TODO.md`)
- `.opencode/` — opencode configuration (writing skills)

## Known inconsistencies

- `archetypes/default.md` uses TOML front matter (`+++`), but all existing posts use YAML (`---`). Running `hugo new` will generate front matter that does not match the existing style; edit it manually to match the YAML format above.
