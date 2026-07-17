# Gaming07 — Code & Technical Audit Report

**Project path:** `C:\Users\HP\.gemini\antigravity\scratch\Gaming07`  
**Audited on:** 2026-07-17  
**Auditor:** OpenCode (automated/static review)

---

## 1. Executive Summary

This audit covers the local static website for `gaming07.com` (a PC-game discovery/affiliate portal). The project is a client-side single-page style site composed of `index.html`, article pages under `articles/`, `style.css`, `script.js`, an `admin.html` control panel, and a small Node dependency footprint (`jimp`).

The codebase is visually polished and mostly responsive, but it carries **high security risk** because of committed secrets and weak client-side authentication. Several HTML/SEO, accessibility, and JavaScript hygiene issues also need correction before production traffic or further deployment.

**Overall risk level:** **HIGH**

### Scorecard (0–100)

| Category            | Score | Summary |
|---------------------|-------|---------|
| Security            | 30    | Private SSH key committed to git; historical deploy script uses plain FTP and uploads unfiltered files; client-side admin authentication; no CSP/rel attributes on external links. |
| HTML Quality        | 70    | Valid structure, canonical tags on articles, but inconsistent OG/JSON-LD, multiple `<h1>` on homepage, heavy inline styles, and missing `rel` on `target="_blank"` links. |
| CSS Quality         | 75    | Good custom-property theming, responsive media queries, dark/light mode; missing print/reduced-motion styles and some hover-only interactions. |
| JS Quality          | 65    | Modular helpers, localStorage abstraction, but heavy use of unsanitized `innerHTML`, client-side admin auth, and no input sanitization. |
| Accessibility       | 60    | ARIA labels and keyboard shortcuts present, but hover-only language menu, no focus trap, autoplay carousel without pause, no skip link. |
| Performance         | 70    | Script loaded at end of body, lazy loading on some images; large PNGs, render-blocking CSS font import, third-party Google Translate, no modern image formats. |
| Project Hygiene     | 55    | Unused `jimp` dependency, tracked deploy key, deleted-but-tracked CI/deploy files, incomplete `.gitignore`. |

---

## 2. Project Structure

```text
Gaming07/
├── .agents/                   # OpenCode skills (not part of the website)
├── .github/workflows/         # Empty deploy workflow directory
├── articles/                  # 9 HTML article/guide pages
├── assets/                    # 19 PNG images (some >2 MB)
├── blog-strategy/             # Markdown strategy docs
├── gaming07.com-audit/        # Previous SEO/technical audit reports
├── admin.html                 # Client-side admin dashboard
├── index.html                 # Homepage
├── style.css                  # ~51 KB stylesheet
├── script.js                  # ~59 KB JavaScript
├── package.json               # Single dependency: jimp
├── package-lock.json
├── robots.txt
├── sitemap.xml
├── .htaccess                  # Apache rewrite to extensionless URLs
├── .gitignore
├── cpanel_deploy_key          # ⚠️ PRIVATE SSH KEY (tracked by git)
├── cpanel_deploy_key.pub
└── gaming07_release.zip       # ~22 MB release archive (local only, gitignored)
```

---

## 3. Dependencies & `npm audit`

- `package.json` declares one dependency:
  - `jimp`: `^1.6.1`
- `package-lock.json` resolves correctly and pins all transitive packages.
- **`npm audit` result: `found 0 vulnerabilities`**
- `jimp` is **not imported or used anywhere** in `index.html`, `admin.html`, `script.js`, or the article pages. It adds ~22 MB of download/install surface and many transitive packages for zero runtime value. It should be removed.

---

## 4. HTML Audit

### 4.1 Global page metadata

| Check | Status | Notes |
|-------|--------|-------|
| Valid `<!DOCTYPE html>` | ✅ | Present on all inspected pages |
| `lang="en"` | ✅ | Set on every page; not updated when Google Translate switches language |
| Meta charset / viewport | ✅ | Present on all pages |
| Title + meta description | ✅ Partial | Present on all pages; title length acceptable |
| Canonical tag | ⚠️ | Present on article pages; **missing from `index.html`** |
| Open Graph / Twitter Cards | ⚠️ | Only on `once-human-stardust.html`, `nte-guide-debutant.html`, `endfield-logistique.html`; missing on homepage and main game reviews |
| JSON-LD schema | ⚠️ | Same 3 guide pages have `BlogPosting`/FAQ schema; missing elsewhere |
| Favicon | ✅ | `favicon.png` at root and referenced |
| Apple touch icon | ❌ | Not provided |

### 4.2 Heading hierarchy

- **Homepage:** Each carousel slide contains an `<h1>`, resulting in **4 `<h1>` elements** on the page. SEO best practice is a single page-level `<h1>`.
- **Article pages:** Generally logical (`h1` → `h2` → `h3` → `h4`), though some FAQ headers jump from `h2` directly to `h4`.

### 4.3 Links

- **Internal links:** Mostly correct relative paths (`articles/...`, `../`).
- **External affiliate links:** 59 occurrences of `target="_blank"` across HTML files. **Almost none include `rel="noopener"`**; none include `rel="sponsored"`.
  - Security risk: `window.opener` access.
  - SEO/affiliate risk: missing `sponsored` hints for search engines.

### 4.4 Inline code

- **Inline `style` attributes** are widespread (hero backgrounds, guide cards, article headers, admin overrides).
- **Inline event handlers** exist, e.g. `onclick="event.stopPropagation(); document.getElementById('bottomStickyBanner').style.display='none';"` in article footers.
- Both practices reduce maintainability and complicate CSP adoption.

### 4.5 Semantic HTML & ARIA

- Semantic landmarks are weak: no `<main>` on the homepage (`articles/` pages use `<main>`), no `<aside>` consistently, no skip-to-content link.
- Carousel uses `aria-roledescription="carousel"`, `role="group"`, and dots as `role="tab"`/`aria-selected`; acceptable but lacks live-region announcement on slide change.
- Search modal has `role="dialog" aria-modal="true" aria-label="Game search"`. ❌ No focus trap is implemented.

---

## 5. CSS Audit

### 5.1 Strengths

- CSS custom properties (`:root`) handle colors, spacing, radius, fonts, transitions.
- Light/dark mode via `body.light-theme` variable overrides.
- Responsive breakpoints at 480px, 640px, 768px, 900px, 1024px, 1025px.
- Only **4 `!important` declarations** in `style.css`, all used to hide the Google Translate chrome.

### 5.2 Issues

| Issue | Severity | Details |
|-------|----------|---------|
| No print styles | Medium | Users cannot print guides cleanly; backgrounds/animations will waste ink. |
| No `prefers-reduced-motion` | Medium | Auto-play carousel, pulsing dots, hover zooms can’t be disabled by motion-sensitive users. |
| Hover-only language menu | Medium | `.lang-selector-container:hover .lang-dropdown` is not keyboard/screen-reader friendly. |
| `scale` property used | Low | `scale: 1.03` video transition works in modern browsers but lacks fallback; keep `transform: scale()` for broader support. |
| Large stylesheet | Low | ~51 KB single file is acceptable but could be split into critical + deferred. |

---

## 6. JavaScript Audit

### 6.1 Strengths

- `DOMContentLoaded` wrapper; script loaded at end of body.
- `safeGetJSON()` helper with fallback for `localStorage` failures.
- Theme, region, and wishlist persistence are isolated in `localStorage`.
- Keyboard shortcut (`Ctrl/Cmd + K`) and `Escape` for search modal.

### 6.2 Issues

| Issue | Severity | Details |
|-------|----------|---------|
| **Unsanitized `innerHTML` from localStorage** | **Critical/High** | `renderHomepageOffers`, `createGameCardCell`, `injectPromoBanner`, `injectPromoPopup`, `renderOffersTable`, modal contents, etc. build HTML from `localStorage` values without escaping. A malicious admin offer or banner text can execute arbitrary script (persistent XSS). |
| **Client-side admin authentication** | **High** | `admin.html` verifies a SHA-256 hash stored in `script.js`. This is trivially bypassed by setting `sessionStorage.setItem('g7_admin_logged_in','true')` or cracking the hash offline. |
| **Contact form self-XSS** | High | `handleContactSubmit()` injects `name` and `email` directly into `.innerHTML` after the fake submit. |
| **No input validation on offer forms** | High | Offer name, excerpt, links, etc. are used verbatim in HTML output. |
| **Hardcoded offer IDs / URLs** | Medium | Affiliate links and IDs are embedded in both HTML and JS (`defaultOffers`). Admin panel can change them, but defaults are still in source. |
| **No focus trap in search modal** | Medium | Users can tab out of the modal onto the underlying page. |
| **Carousel autoplay with no pause** | Medium | `setInterval(nextSlide, 6000)` runs forever; no pause on hover/focus. |
| **No error boundaries** | Low | External script (`Google Translate`) or broken `localStorage` could fail silently or leave UI broken. |
| **Global functions** | Low | `initFooterModals`, `initLanguageSelector`, `translatePage` pollute global scope. |

---

## 7. Security / Secrets

> **Do not print secret contents.** This section reports the presence and risk only.

| Item | Risk | Status |
|------|------|--------|
| `cpanel_deploy_key` | **Critical** | Private SSH key file tracked by git. Length 1,823 bytes indicates a PEM key. Compromise allows server access. **Must be rotated immediately.** |
| `cpanel_deploy_key.pub` | High | Public key is less sensitive, but its pair is compromised; should also be removed from repo. |
| `gaming07_release.zip` | High | ~22 MB archive. Not tracked by git (gitignored), but it is present locally and may contain the key or other credentials. Do not distribute. Scan before deletion. |
| `deploy.js` / `.github/workflows/deploy.yml` | **Critical** | Tracked in git history (currently deleted in working tree). The script used **plain FTP** (`secure: false`) and did **not exclude** `cpanel_deploy_key`, `.agents`, `blog-strategy`, etc. from upload. History must be purged. |
| `.gitignore` | High | Does not ignore `cpanel_deploy_key`, `cpanel_deploy_key.pub`, or `.github` secrets. |
| No CSP / security headers | High | No `Content-Security-Policy`, `X-Frame-Options`, `Referrer-Policy`, etc. configured in `.htaccess` or HTML meta. |
| Admin hash in source | High | Password hash exposed in JavaScript. |

---

## 8. Build / Deployment

- **No build scripts** in `package.json`.
- **No active CI/CD** in the working tree (`.github/workflows/` directory exists but is empty).
- **`.github/workflows/deploy.yml` and `deploy.js` are tracked in git but deleted locally.** They used GitHub Secrets + plain FTP to push files to cPanel.
- **`.htaccess`** present and functional:
  - Redirects `/index.html` → `/`
  - Redirects `.html` URLs → extensionless
  - Rewrites extensionless requests back to `.html`
- **No integrity hashes (SRI)** on the local `script.js`/`style.css`; no Subresource Integrity on third-party Google Fonts/Translate.

---

## 9. Robots / Sitemap

- **`robots.txt`**:
  ```
  User-agent: *
  Allow: /
  Disallow: /admin.html
  Disallow: /admin
  Sitemap: https://gaming07.com/sitemap.xml
  ```
  - Correctly blocks admin path.
- **`sitemap.xml`**:
  - Lists 10 URLs.
  - All use `https://gaming07.com/`.
  - `lastmod` is uniform (`2026-07-16`).
  - Missing `/admin.html` (good).
  - ❌ Does not include a trailing slash; consistent with extensionless `.htaccess` URLs.

---

## 10. Accessibility Quick Scan

| Requirement | Status | Notes |
|-------------|--------|-------|
| Skip-to-content link | ❌ | Missing on all pages. |
| Focus indicators | ⚠️ | Inputs have visible focus; generic buttons rely on browser defaults. |
| Keyboard language menu | ❌ | Hover-only dropdown. |
| ARIA landmarks | ⚠️ | No `<main>` on homepage; structure otherwise okay. |
| Autoplay control | ❌ | Hero carousel auto-advances; no pause/play button. |
| Contrast | ⚠️ | Dark mode generally readable; `--text-dark: #4b5563` on dark gray cards may be borderline. |
| ALT text | ✅ | Images have descriptive alt text; article header backgrounds are decorative inline styles. |
| RTL/Arabic | ❌ | Arabic is offered but `dir="rtl"` and RTL overrides are not handled. |

---

## 11. Performance Quick Scan

| Item | Status | Notes |
|------|--------|-------|
| Render-blocking CSS | ⚠️ | `style.css` is in `<head>`; Google Fonts `@import` adds another blocking round-trip. Consider preconnect/link preload. |
| Render-blocking JS | ✅ | `script.js` is at end of `<body>`, which is fine for static content. |
| Image optimization | ⚠️ | All images are PNG. Several are 1–2.7 MB. No WebP/AVIF, no `srcset`, no `sizes`. Only homepage card images use `loading="lazy"`. |
| Third-party requests | ⚠️ | Google Fonts, Google Translate (`translate.google.com`), and `ne.perfcore.com` video assets. No SRI or preconnect. |
| Caching | N/A | No cache-control headers configured in `.htaccess` for static assets. |

---

## 12. Findings by Severity

### Critical

1. **Private SSH key committed to git** (`cpanel_deploy_key`). Rotate credentials and purge from git history.
2. **Historical deploy script used plain FTP and uploaded unfiltered files**, including the key. Remove from history.
3. **Persistent XSS through unsanitized `innerHTML`** populated from `localStorage` offer/banner/popup data.
4. **Client-side admin authentication** is only obfuscation; anyone can unlock the dashboard.

### High

5. `target="_blank"` external links lack `rel="noopener noreferrer sponsored"` (59 occurrences).
6. No Content Security Policy or security headers.
7. Contact form injects user input into `.innerHTML` (self-XSS).
8. `gaming07_release.zip` may contain credentials; treat as sensitive.
9. Home page has multiple `<h1>` elements.
10. Missing canonical tag on `index.html`.
11. Missing Open Graph / JSON-LD on homepage and main review pages.

### Medium

12. Hover-only language selector is not keyboard accessible.
13. Autoplay carousel has no pause control.
14. No focus trap in search modal.
15. No `@media (prefers-reduced-motion)` support.
16. No print stylesheet.
17. Unused `jimp` dependency inflates supply-chain surface.
18. Article images are not lazy-loaded.
19. Hardcoded affiliate links/offer IDs in HTML and JS defaults.
20. No `apple-touch-icon`.
21. `.github/workflows/deploy.yml` uses deprecated `actions/checkout@v3` / `setup-node@v3`.

### Low

22. Inline `style` and `onclick` attributes scattered across markup.
23. Google Translate script is loaded without SRI.
24. Region badge shows "Detecting..." briefly; no ARIA live region for update.
25. `aria-roledescription="slide"` support varies across screen readers.

---

## 13. Prioritized Action Plan

See `ACTION-PLAN.md` for a concise, ordered checklist. The highest-priority items:

1. **Rotate the cPanel/SSH key immediately** and remove `cpanel_deploy_key` + `.pub` from git history.
2. **Delete and purge** `deploy.js` and `.github/workflows/deploy.yml` from git history; redesign deployment to use SFTP/FTPS or git-based deploys, and never upload `cpanel_deploy_key*`.
3. **Add `.gitignore` rules** for `cpanel_deploy_key*`, `*.pem`, `gaming07_release.zip`, `.env`, `node_modules/`, `deploy.js`, and any future workflow secrets.
4. **Sanitize all DOM writes**: replace `innerHTML` with `textContent` where possible, and escape HTML before rendering offer/banner/popup/contact data. Use a small HTML-escaping helper.
5. **Add `rel="noopener noreferrer sponsored"`** to every affiliate/external `target="_blank"` link.
6. **Implement real server-side admin authentication** if an admin panel is needed; remove the client-side hash check.
7. **Add security headers** via `.htaccess` or server config (CSP with `script-src`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
8. **Fix index SEO**: add canonical, Open Graph, and JSON-LD (Organization / WebSite).
9. **Improve accessibility**: add skip link, focus trap, keyboard language menu, carousel pause/play, and `prefers-reduced-motion`.
10. **Remove unused `jimp` dependency** (`npm uninstall jimp`).
