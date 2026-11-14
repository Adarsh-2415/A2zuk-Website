# SEO, Search Visibility & Discoverability

## 1. Technical SEO Philosophy & Ethics

Search engine optimization (SEO) is the engineering practice of structuring, optimizing, and presenting digital content so that search crawlers can discover, parse, understand, and index pages accurately and efficiently.

### Realistic SEO Expectations
- **Best Practices vs. Rank Guarantees:** Implementing technical SEO standards guarantees crawler accessibility and proper semantic indexation. It **does not guarantee specific search rankings or traffic volumes**, which depend on search engine algorithms, domain authority, content quality, and competitive landscapes. Never promise guaranteed ranking positions.
- **User-Centric Architecture:** Search engines increasingly evaluate real-world user satisfaction. High performance, accessible structure, responsive layouts, and clear information architecture directly correlate with search discoverability.

---

## 2. Crawlability & Indexation Controls

### `robots.txt` Configuration
Provide a clear `robots.txt` file at the domain root instructing web crawlers on permitted access paths and pointing directly to the XML sitemap:
```text
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /checkout/
Disallow: /account/

Sitemap: https://www.example.com/sitemap.xml
```

### Directives & Meta Robots
- **Index vs. Noindex:** Apply `<meta name="robots" content="noindex, nofollow">` or `X-Robots-Tag: noindex` headers to sensitive, duplicate, or internal administrative pages to prevent accidental public indexing.
- **Canonical URLs:** Specify an explicit canonical link tag on every indexed page to avoid duplicate-content penalties stemming from query parameters, tracking tags, or alternate domain aliases:
  ```html
  <link rel="canonical" href="https://www.example.com/services/web-development" />
  ```
- **Redirect Discipline:**
  - `301 Moved Permanently`: Transfer search equity when resources permanently change URLs.
  - `302 Found / 307 Temporary Redirect`: For temporary reroutes (preserves original canonical indexation).
  - Avoid redirect chains and loops (limit redirects to a single hop).

### XML Sitemaps
- Generate and maintain clean, valid XML sitemaps following the sitemaps.org standard.
- Include only canonical, indexable URLs returning `200 OK` status codes (exclude redirects, error pages, and `noindex` paths).
- Update `<lastmod>` timestamps accurately upon meaningful content updates.

---

## 3. Semantic Document Structure & On-Page SEO

Search crawlers rely heavily on semantic document outlines to extract topical context.

### Semantic Outline Guidelines
- **Single `<h1>` Per Page:** Every discoverable page must feature exactly one primary `<h1>` heading encapsulating the core topic of the document.
- **Strict Heading Hierarchy:** Structure secondary sections using strict, unskipped hierarchical tags (`<h1>` -> `<h2>` -> `<h3>`). Never select heading tags based on visual styling; style headings using CSS classes while preserving semantic tag levels.
- **Semantic HTML5 Containers:** Encase content within appropriate semantic tags (`<header>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`) rather than generic `<div>` wrappers.
- **Descriptive Image Alt Text:** Every informative `<img>` must supply descriptive `alt` text aiding both screen readers and image crawlers. Decorative images must specify empty `alt=""` and `aria-hidden="true"`.

---

## 4. Metadata Architecture & Social Graph Sharing

Ensure every public route dynamically populates essential HTML head tags:

```html
<!-- Primary Document Metadata -->
<title>Professional Web Architecture & Services | Company Name</title>
<meta name="description" content="Concise, compelling summary of the page content between 150-160 characters." />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<!-- Open Graph (Facebook, LinkedIn, Messaging Apps) -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.example.com/services" />
<meta property="og:title" content="Professional Web Architecture & Services" />
<meta property="og:description" content="Concise, compelling summary of the page content." />
<meta property="og:image" content="https://www.example.com/images/og-services.jpg" />

<!-- Twitter / X Card Metadata -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Professional Web Architecture & Services" />
<meta name="twitter:description" content="Concise, compelling summary of the page content." />
<meta name="twitter:image" content="https://www.example.com/images/og-services.jpg" />
```

---

## 5. Structured Data (Schema.org / JSON-LD)

Implement structured data using Schema.org specifications formatted in `application/ld+json` script blocks. Structured data provides explicit semantic context for search engine rich snippets.

### Example: Organization & Breadcrumb Schemas
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Organization Name",
  "url": "https://www.example.com",
  "logo": "https://www.example.com/logo.png",
  "sameAs": [
    "https://twitter.com/example",
    "https://github.com/example"
  ]
}
</script>
```

---

## 6. Performance, Core Web Vitals & Search Impact

Search engines prioritize fast, visually stable pages:
- **Largest Contentful Paint (LCP):** Preload hero imagery, optimize web font loading, and ensure server response times (TTFB) remain under acceptable thresholds.
- **Cumulative Layout Shift (CLS):** Reserve explicit `width` and `height` dimensions or aspect ratio CSS on images, video embeds, and dynamic widgets to prevent layout jumps during load.
- **Interaction to Next Paint (INP):** Ensure user interactions respond swiftly without blocking the main execution thread.
