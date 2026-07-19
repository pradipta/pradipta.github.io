# Pradipta Sarma — Personal Site

Personal portfolio and tech blog, migrated from Jekyll to **Astro**.

Live site: [https://pradipta.github.io](https://pradipta.github.io)

---

## Overview

### What changed

- Rebuilt the site in **Astro + TypeScript + Tailwind CSS**
- Preserved every existing blog post, image, and public URL (`/:slug/`)
- Added a cleaner layout with Home, Blog, Projects, About, and 404
- Added light/dark theme (system default + manual toggle + `localStorage`)
- Added SEO essentials: sitemap, robots.txt, RSS, Open Graph, Twitter cards, canonical URLs, JSON-LD
- Added blog UX: reading time, tags, previous/next posts, desktop TOC, syntax highlighting, code copy buttons
- Deployed via **GitHub Actions → GitHub Pages**

### Why Astro

Astro is a strong fit for a content-heavy personal site:

- Ships minimal JavaScript by default (fast by design)
- First-class Markdown content collections with typed frontmatter
- Excellent static output for GitHub Pages
- Built-in image tooling, RSS helpers, and sitemap integrations

---

## Prerequisites

- **Node.js ≥ 22 LTS** (the project `engines` field requires `>=22.12.0`)
- npm (comes with Node)

Check your versions:

```bash
node -v
npm -v
```

---

## Installation

```bash
git clone https://github.com/pradipta/pradipta.github.io.git
cd pradipta.github.io
npm install
```

---

## Local Development

Start the dev server:

```bash
npm run dev
```

Open **[http://localhost:4321](http://localhost:4321)** (Astro’s default).

---

## Build

Create a production build:

```bash
npm run build
```

Output is written to **`dist/`**.

---

## Preview

Preview the production build locally:

```bash
npm run preview
```

This serves the contents of `dist/` (typically at [http://localhost:4321](http://localhost:4321)).

---

## GitHub Pages Deployment

This repository is a user site (`username.github.io`), so it deploys to the site root — **no `base` path** is required.

### 1. Repository settings

1. Open the repo on GitHub → **Settings** → **Pages**
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Ensure the default branch is `master` or `main` (the workflow listens to both)

### 2. GitHub Actions configuration

The workflow lives at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

It:

- Runs on push to `main` / `master` (and via manual **workflow_dispatch**)
- Builds with the official [`withastro/action`](https://github.com/withastro/action)
- Deploys with `actions/deploy-pages`

No extra secrets are required for a public Pages site.

### 3. Astro configuration

Relevant settings in [`astro.config.mjs`](astro.config.mjs):

```js
export default defineConfig({
  site: "https://pradipta.github.io",
  trailingSlash: "always",
  // no `base` — this is a username.github.io root site
});
```

### 4. Base path handling

| Repo type | Example URL | `base` |
| --- | --- | --- |
| User/org site (this project) | `https://pradipta.github.io/` | omit / `/` |
| Project site | `https://user.github.io/repo/` | `/repo` |

Because this repo is `pradipta.github.io`, assets and routes use root-relative paths (`/blog/`, `/assets/img/...`).

### 5. Asset path handling

- Static assets live in **`public/`** and are copied to `dist/` as-is
- Blog cover images remain at **`/assets/img/<filename>`** to preserve old URLs
- Favicons are in `public/` (`favicon.ico`, apple-touch icons, etc.)

### 6. Custom domain support (optional)

If you later use a custom domain:

1. Configure DNS at your registrar (A/AAAA or CNAME per GitHub’s docs)
2. Add `public/CNAME` containing only your domain, e.g.:

   ```text
   example.com
   ```

3. Update `site` in `astro.config.mjs` to that domain
4. Keep **no** `base` path for an apex/custom domain on a user site

### 7. CNAME handling

- Do **not** add a CNAME file unless you own a custom domain
- If present, GitHub Pages will serve the site on that hostname

### 8. Deployment commands

Locally you only need:

```bash
npm run build
```

Production deploys happen automatically when you push to the default branch. You can also run the workflow from the GitHub **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**.

### 9. Adding future blog posts

1. Create a Markdown file in `src/content/blog/`
2. Use a URL-friendly filename — it becomes the path:

   ```text
   src/content/blog/my-new-post.md  →  https://pradipta.github.io/my-new-post/
   ```

3. Add frontmatter (see Content Guide below)
4. Commit and push — GitHub Actions builds and deploys

---

## Content Guide

### Add a new blog post

Create `src/content/blog/your-slug.md`:

```md
---
title: "Your Post Title"
date: 2026-07-19
description: "Short summary for SEO and cards."
img: cover-image.png
tags: [Java, Git]
featured: false
draft: false
---

Your content in Markdown…
```

Frontmatter fields:

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Post title |
| `date` | yes | Publication date |
| `description` | no | Meta / card summary |
| `img` | no | Filename under `public/assets/img/` |
| `figCaption` | no | Caption under the cover image |
| `tags` | no | Array of strings |
| `featured` | no | Show on the home Featured section |
| `draft` | no | When `true`, excluded from listings/RSS |

### Add images

1. Put files in `public/assets/img/`
2. Reference covers via frontmatter: `img: my-photo.jpg` → `/assets/img/my-photo.jpg`
3. Inline in Markdown:

   ```md
   ![Alt text](/assets/img/my-photo.jpg)
   ```

### Edit metadata

Site-wide metadata lives in [`src/consts.ts`](src/consts.ts) (title, description, social links, author).

Projects listed on Home / Projects are defined in [`src/data/projects.ts`](src/data/projects.ts).

### Create tags

Add tags in post frontmatter. Tag index and per-tag pages are generated automatically at `/tags/` and `/tags/<slug>/`.

### Publish changes

```bash
git add .
git commit -m "Add post: your slug"
git push origin master
```

GitHub Actions deploys the update. Confirm under **Actions** and **Settings → Pages**.

---

## Project structure

```text
src/
  components/     # UI pieces (Header, Footer, PostCard, TOC, …)
  content/blog/   # Markdown posts (content collection)
  data/           # Typed data (projects)
  layouts/        # Base + blog layouts
  pages/          # Routes (/, /blog/, /about/, /projects/, /:slug/, …)
  styles/         # Global CSS + Tailwind
  utils/          # Helpers (reading time, post queries)
public/
  assets/img/     # Images + favicons (preserved paths)
  robots.txt
.github/workflows/deploy.yml
astro.config.mjs
```

---

## Theme

- Defaults to **system preference**
- Toggle in the header switches light/dark
- Preference is stored in `localStorage` under `theme`
- An inline boot script on `<html>` prevents a flash of the wrong theme

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run astro` | Astro CLI |

---

## License

See [LICENSE](LICENSE).
