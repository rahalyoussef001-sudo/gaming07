# 📅 Prioritized SEO Action Plan: gaming07.com

This document lists the prioritized action items needed to address the findings of the July 17, 2026 SEO Audit.

---

## Phase 1: Critical Fixes (Immediate)

### 1. Self-Referencing Canonical Tags
- **Issue:** Homepage and new category pages do not have canonical tags.
- **Action:** Add the following lines in the `<head>` of each file:
  - **`index.html`:** `<link rel="canonical" href="https://gaming07.com/">`
  - **`games.html`:** `<link rel="canonical" href="https://gaming07.com/games">`
  - **`guides.html`:** `<link rel="canonical" href="https://gaming07.com/guides">`
  - **`news.html`:** `<link rel="canonical" href="https://gaming07.com/news">`
- **Effort:** 5 minutes.

### 2. Update XML Sitemap
- **Issue:** `sitemap.xml` is missing new clean URLs.
- **Action:** Append these entries inside the `<urlset>` tag in `sitemap.xml`:
  - `https://gaming07.com/games`
  - `https://gaming07.com/guides`
  - `https://gaming07.com/news`
  - `https://gaming07.com/articles/best-pc-rpgs-2026`
  - `https://gaming07.com/articles/nte-tier-list`
- **Effort:** 3 minutes.

---

## Phase 2: Schema & Structured Data (High Impact)

### 1. Homepage WebSite Schema
- **Action:** Inject a `WebSite` JSON-LD script into `index.html` to define Gaming07's name, URL, and search query target.

### 2. Original Reviews BlogPosting Schema
- **Action:** Inject standard `BlogPosting` and `FAQPage` JSON-LD schemas into:
  - `articles/neverness-to-everness.html`
  - `articles/once-human.html`
  - `articles/arknights-endfield.html`
  - `articles/where-winds-meet.html`
  - `articles/raid-shadow-legends.html`
  - `articles/review.html`

### 3. CollectionPage Schema for Categories
- **Action:** Inject `CollectionPage` schema into `games.html`, `guides.html`, and `news.html` to help Google understand that these are catalog listing pages.

---

## Phase 3: Social & Open Graph Meta (Medium Impact)

### 1. Inject Open Graph Tags
- **Action:** Add OG tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) to:
  - `index.html`
  - `games.html`
  - `guides.html`
  - `news.html`
  - The 6 original review articles.
