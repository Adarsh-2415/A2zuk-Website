# Application Security & Data Privacy

## 1. Security Philosophy & Threat Modeling

Security is an integral engineering discipline woven into every phase of system design, implementation, testing, and deployment. 

### Core Directives
- **Defense in Depth:** Never rely on a single defensive boundary. Layer security controls across the client interface, reverse proxy, application service layer, network policies, and database engines.
- **Never Rely on Client-Side Security:** Frontend validations, hidden form fields, and client-side route guards are user conveniences, not security boundaries. All authorization, permission verification, and data integrity checks must be strictly enforced on trusted servers or database engines.
- **Principle of Least Privilege:** Grant users, service workers, processes, and service credentials the minimal permissions necessary to execute their assigned responsibilities.
- **No Claims of Absolute Security:** No system is impervious. Approach architecture with humility: identify limitations, evaluate attack surfaces, minimize blast radiuses, and actively verify controls.

---

## 2. OWASP Top 10 Mitigation Matrix

| Vulnerability Vector | Threat Mechanism | Engineering Defense Strategy |
| :--- | :--- | :--- |
| **A01: Broken Access Control** | Unauthorized resource access, bypassing permissions, IDOR. | Enforce object-level authorization checks server-side on every request; verify record ownership against authenticated user context; deny by default. |
| **A02: Cryptographic Failures** | Exposing sensitive data in transit or rest; weak hashing. | Enforce TLS 1.3 everywhere; use modern key derivation (Argon2id, bcrypt) for passwords; encrypt sensitive data at rest using AES-256-GCM; manage keys securely. |
| **A03: Injection (SQL, Command, LDAP)** | Hostile input executed as interpreter commands. | Use parameterized queries and prepared statements exclusively; avoid raw shell execution; validate against strict input schemas. |
| **A04: Insecure Design** | Architectural flaws, missing business-logic safeguards. | Perform threat modeling during design phases; implement rate limits, account lockouts, transaction quotas, and abuse-resistant workflows. |
| **A05: Security Misconfiguration** | Default passwords, verbose errors, open cloud buckets, missing headers. | Disable debug modes in production; apply security baseline headers; automate configuration auditing; close unnecessary ports. |
| **A06: Vulnerable & Outdated Components** | Unpatched third-party dependencies and supply-chain exploits. | Implement automated software composition analysis (SCA); pin dependency versions; review supply-chain integrity; update dependencies promptly. |
| **A07: Identification & Auth Failures** | Credential stuffing, brute-force, session hijacking. | Enforce strong password complexity; implement adaptive rate-limiting; use cryptographically random session IDs with secure cookie attributes; support MFA. |
| **A08: Software & Data Integrity Failures** | Untrusted deserialization, tampered CI/CD pipelines. | Verify digital signatures; protect CI/CD workflows with branch protections; never deserialize untrusted objects without cryptographic validation. |
| **A09: Security Logging & Monitoring Failures** | Undetected breaches, inability to audit incidents. | Log security-relevant events (auth failures, privilege escalations); correlate logs with unique request IDs; ship logs to central, tamper-evident storage. |
| **A10: Server-Side Request Forgery (SSRF)** | Server tricked into fetching arbitrary internal/external resources. | Validate and sanitize destination URLs against strict domain allowlists; disable redirects; restrict outgoing network calls from backend containers to internal IPs. |

---

## 3. Web Vulnerabilities: Technical Controls

### Cross-Site Scripting (XSS)
- **Context-Aware Output Encoding:** Ensure all dynamic output rendered in templates is properly HTML-entity encoded by default.
- **Sanitize Dynamic HTML:** When rendering user-supplied rich text is mandatory, sanitize input through hardened HTML sanitizers configured with strict element and attribute allowlists.
- **Content Security Policy (CSP):** Enforce strict CSP headers restricting executable script origins and prohibiting `unsafe-inline` and `unsafe-eval`.

### Cross-Site Request Forgery (CSRF)
- **SameSite Cookies:** Serve all authentication and session cookies with `SameSite=Lax` or `SameSite=Strict`.
- **Anti-CSRF Tokens:** For state-changing operations relying on session cookies, validate cryptographically signed, synchronized anti-CSRF tokens in headers or form bodies.
- **Custom Request Headers:** Require custom headers (e.g., `X-Requested-With` or `Content-Type: application/json`) on mutating requests to leverage browser CORS preflight protections.

---

## 4. Secrets Management & Configuration Safety

- **Never Commit Secrets:** Under no circumstance should API keys, database passwords, encryption secrets, private certificates, or auth tokens be committed to version control repositories.
- **Environment Variables:** Inject secrets at runtime via secure environment variable injection or dedicated secrets managers.
- **`.gitignore` Discipline:** Maintain comprehensive `.gitignore` rules covering `.env`, `.env.local`, `.pem`, `.key`, and local credential stores.
- **Secret Scanning:** Employ automated pre-commit hooks and repository scanning tools to detect and block accidental secret exposure.

---

## 5. Production Hardening & Security Headers

Deploy all applications behind modern reverse proxies or edge gateways configured with production-grade security headers:

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline';
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

---

## 6. Data Privacy, Minimization & Retention

- **Privacy by Design:** Collect and retain only the minimal personal data strictly necessary to fulfill the intended business use-case (Data Minimization).
- **Sensitive Data Handling (PII):** Mask or redact Personally Identifiable Information (PII) before writing to application log files or error tracking systems.
- **Right to Erasure & Export:** Architect database structures and file storage systems to support clean data deletion and export workflows in compliance with global privacy regulations (e.g., GDPR, CCPA).
- **Audit Trails:** Record audit events when administrative users inspect or modify sensitive customer records.
