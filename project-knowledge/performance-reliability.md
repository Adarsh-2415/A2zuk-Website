# Performance & Reliability Engineering

## 1. Performance Philosophy & Budgets

Performance is a fundamental feature of software engineering, directly impacting conversion rates, user retention, operational costs, and search rankings. High-performance systems are engineered deliberately through **proactive performance budgets, continuous profiling, and disciplined resource constraints**.

### Performance Budgets
Establish explicit performance thresholds before development begins:
- **Total Initial JavaScript Bundle:** < 150 KB (gzipped / brotli-compressed).
- **Initial Page Weight:** < 1.0 MB total transferred assets on initial landing.
- **Time to First Byte (TTFB):** < 200 ms for static content; < 500 ms for dynamic API requests.
- **Largest Contentful Paint (LCP):** < 2.5 seconds on 4G network profiles.
- **Interaction to Next Paint (INP):** < 200 milliseconds.
- **Cumulative Layout Shift (CLS):** < 0.1.

---

## 2. Core Web Vitals Optimization Strategies

### 1. Largest Contentful Paint (LCP)
- **Identify LCP Element:** In most web pages, LCP is a hero image, large heading block, or video thumbnail.
- **Prioritize LCP Assets:** Preload critical LCP assets using `<link rel="preload" as="image" href="..." fetchpriority="high" />`.
- **Eliminate Render-Blocking Resources:** Defer non-critical JavaScript (`defer` or `type="module"`) and inline or split critical CSS.

### 2. Interaction to Next Paint (INP) & Responsiveness
- **Break Up Long Tasks:** Avoid JavaScript tasks running longer than 50ms on the browser main thread. Break intensive computation into micro-tasks or offload to Web Workers.
- **Debounce & Throttle:** Debounce high-frequency user input events (search inputs, resize handlers, scroll listeners).
- **Avoid Forced Synchronous Layouts:** Never query layout geometries (`offsetHeight`, `getBoundingClientRect`) immediately after modifying DOM element styles within the same animation frame.

### 3. Cumulative Layout Shift (CLS) & Visual Stability
- **Explicit Aspect Ratios:** Always specify `width` and `height` attributes on `<img>` and `<video>` tags or declare CSS `aspect-ratio`.
- **Reserve Ad & Widget Space:** Pre-allocate static container heights for third-party embeds, advertisements, and async data widgets.
- **Font Display Swapping:** Use `font-display: swap` or `font-display: optional` combined with preloaded font subsets and size-adjusted fallback font metrics to prevent layout shifts during font swap.

---

## 3. Asset & Media Optimization Pipeline

### Modern Image Delivery
- **Next-Gen Formats:** Serve images formatted in AVIF or WebP formats, yielding 30-50% file size reductions over legacy JPEG/PNG formats.
- **Responsive Images:** Implement responsive `<picture>` or `srcset` attributes to serve appropriately scaled image resolutions tailored to the user's viewport and device pixel ratio (DPR):
  ```html
  <picture>
    <source srcset="hero-mobile.webp 480w, hero-desktop.webp 1200w" type="image/webp" />
    <img src="hero-fallback.jpg" alt="Hero representation" width="1200" height="600" loading="eager" fetchpriority="high" />
  </picture>
  ```
- **Native Lazy Loading:** Apply `loading="lazy"` to all images below the initial viewport fold. Never apply lazy loading to hero or above-the-fold imagery.

### Web Font Optimization
- **Font Subsetting:** Subset web fonts to include only relevant language character sets (e.g., Latin-1), shedding unused glyphs and reducing font files from hundreds of kilobytes to ~20-30KB.
- **Preload Critical Fonts:** Use `<link rel="preload" as="font" type="font/woff2" crossorigin href="..." />` for the primary font family.
- **Limit Variants:** Stick to essential weights (e.g., Regular 400 and Bold 700); avoid loading 6+ distinct font weights and italic variants.

---

## 4. Operational Reliability & Resilience Patterns

- **Graceful Degradation:** When auxiliary services (e.g., search autocomplete, recommendations engine) fail or encounter high latency, the core experience (e.g., product browsing, checkout) must continue functioning smoothly.
- **Timeouts & Circuit Breakers:** Wrap internal and external microservice/API calls in strict timeout boundaries. Trip circuit breakers when downstream failure rates exceed predefined thresholds to prevent cascading thread exhaustion.
- **Stateless Horizontal Scalability:** Eliminate server-bound in-memory session state. Keep application workers stateless, enabling automated horizontal scaling behind load balancers during traffic surges.
- **Health Checks:** Expose lightweight `/healthz` (liveness) and `/ready` (readiness) probes verifying database connectivity and essential dependency health for container orchestration.

---

## 5. Performance Profiling & Evidence-Based Optimization

- **Never Optimize Blindly:** Profile before and after introducing optimizations. Measure CPU usage, memory allocations, network transfer, and rendering frame rates using browser dev tools and backend profilers.
- **Synthetic vs. Real User Monitoring (RUM):**
  - *Synthetic Testing:* Automated CI lighthouse or WebPageTest runs under standardized network/CPU throttling.
  - *Real User Monitoring (RUM):* Capture field performance metrics from real end-user sessions to detect geographic or low-end device bottlenecks.
- **Memory Leak Auditing:** Continuously monitor memory growth in single-page apps and backend node processes. Verify that caches have fixed size bounds (LRU eviction) and that event listeners and timers are cleanly garbage-collected.
