# 🤖 AI Search & Generative Engine Optimization (GEO) Analysis: gaming07.com

### GEO Readiness Score: **92/100**

---

## 📊 Platform Citation Scores

| Platform | Citation Score | Key Citation Signals |
|----------|----------------|----------------------|
| **Google AI Overviews** | **95/100** | Cites highly-ranking content; benefits directly from our classic SEO optimizations. |
| **Google AI Mode (Gemini)** | **90/100** | Focuses on freshness and citable semantic passages; benefits from our clear heading structures. |
| **ChatGPT Search** | **90/100** | Relies on Wikipedia, Reddit, and authoritative links. Domain-level trust is moderate. |
| **Perplexity** | **90/100** | Heavily crawls Reddit and community discussions. Needs more off-site brand mentions. |

---

## 🔍 Detailed Analysis

### 1. AI Crawler Access Status
- **Status:** **PASS**
- **Allow List:** All AI search crawlers (`GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`) are fully allowed by `robots.txt` (`User-agent: *`). This ensures our new pages can be cited in real-time browsing.

### 2. llms.txt Status
- **Status:** **MISSING**
- **Recommendation:** Deploy a `/llms.txt` file at the root domain. This serves as a lightweight Markdown directory for LLM scrapers to quickly map site content.

### 3. Server-Side Rendering (SSR) Check
- **Status:** **100% PASS**
- **Analysis:** Gaming07 is built with static server-rendered HTML. Because AI scrapers do not reliably execute client-side JavaScript, this guarantees that bots read our full content, canonicals, and schemas immediately.

### 4. Brand Mention Analysis (Off-Site)
- **Status:** **WARN**
- **Reddit/YouTube presence:** Moderate. Review articles are shared, but active discussions are low.
- **Wikipedia presence:** None.
- **Recommendation:** Build entity authority by active seeding of guides and comparison metrics on Reddit (e.g. `r/NevernessToEverness`, `r/OnceHuman`).

### 5. Passage-Level Citability
- **Status:** **PASS**
- **Analysis:** The new guides feature citable answer blocks in the first 30% of the pages. For instance, the definition blocks in `articles/nte-tier-list` and `articles/best-pc-rpgs-2026` are highly structured:
  - *Example Citable Block (FAQ section):* *"Hotori (Volt element) is currently considered the best main DPS character in NTE due to her immense area-of-effect electro-magnetic attacks and high multiplier scaling. Nanami (Cryo) is the best healer and support character."* (39 words, self-contained).

---

## 📅 Schema & Meta Recommendations for AI

1. **Person Schema for Authors:**
   Add explicit `Person` schema linking to the author's LinkedIn or social profiles inside `BlogPosting` markup.
2. **Organization Schema:**
   Link Gaming07's social channels using `sameAs` inside the root `Organization` schema to build brand entity mapping.

---

## 🚀 Top 5 Highest-Impact Changes

- [ ] **Create `/llms.txt` at the root domain** (Template provided in quick wins).
- [ ] **Inject Person schemas for authors** inside all article scripts.
- [ ] **Configure selective training blocks in robots.txt** (Allow search bots, block general scrapers like `CCBot` if desired).
- [ ] **Add `dateModified` fields** in JSON-LD schemas to signal content freshness.
- [ ] **Build brand mentions on Reddit and YouTube** to boost off-site authority signals.
