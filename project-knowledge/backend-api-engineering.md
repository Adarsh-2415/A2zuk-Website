# Backend Engineering & API Standards

## 1. Backend Architecture & Service Responsibilities

Backend systems serve as the trusted execution environment and system-of-record for business rules, authorization enforcement, transactional integrity, and data persistence.

### Core Directives
- **Zero Client Trust:** Never trust incoming client data. All client inputs—headers, query params, body payloads, cookies—must be treated as untrusted and rigorously sanitized and validated.
- **Enforce Invariants at the Core:** Business invariants, permission policies, and data integrity constraints must be codified and enforced in server-side application logic and database constraints, never delegated to frontend checks.
- **Fail Deterministically:** Provide consistent, structured error responses that communicate failure reasons clearly to API consumers without exposing internal stack traces, system paths, or environment secrets.

---

## 2. API Contract Design & Conventions

Standardize on predictable RESTful (or RPC) architectural conventions across all endpoints.

### Resource Modeling & HTTP Verbs
- `GET`: Retrieve representations of resources. Must remain strictly idempotent and safe (no state mutations or side effects).
- `POST`: Create new resources or execute non-idempotent computational actions.
- `PUT`: Complete replacement/update of an existing resource representation.
- `PATCH`: Partial update of specific fields on an existing resource.
- `DELETE`: Remove a resource. Idempotent in outcome.

### HTTP Status Code Discipline
Use HTTP status codes accurately according to specification:
- `200 OK`: Request succeeded with returned content.
- `201 Created`: Resource successfully created (include `Location` header or created entity representation).
- `204 No Content`: Request succeeded with no content returned (e.g., successful deletion).
- `400 Bad Request`: Payload validation failed or syntax was malformed.
- `401 Unauthorized`: Request lacks valid authentication credentials.
- `403 Forbidden`: Authenticated user lacks sufficient permissions for the requested resource.
- `404 Not Found`: Target resource does not exist (or concealed for privacy/security).
- `409 Conflict`: Request conflicts with current system state (e.g., duplicate unique key, version mismatch).
- `422 Unprocessable Content`: Semantically invalid data (business rule violations).
- `429 Too Many Requests`: Rate limit threshold exceeded.
- `500 Internal Server Error`: Unhandled server exception.
- `503 Service Unavailable`: Temporary downstream outage or capacity exhaustion.

### Standardized Error Envelope
Ensure all non-2xx API error responses follow a consistent, machine-readable envelope:
```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "One or more input fields are invalid.",
    "correlationId": "req-947ba-89a1-43ef",
    "details": [
      {
        "field": "email",
        "issue": "INVALID_EMAIL_FORMAT",
        "message": "The provided email address is not well-formed."
      }
    ]
  }
}
```

---

## 3. Authentication, Authorization & Access Control

- **Authentication (Who are you?):** Verify identities using robust, proven protocols (e.g., modern secure session cookies with `HttpOnly`, `SameSite=Strict`, `Secure` flags, or cryptographically signed tokens with short lifespans and secure rotation).
- **Authorization (What can you do?):**
  - Implement Role-Based Access Control (RBAC) or Attribute-Based Access Control (ABAC).
  - Enforce object-level permission verification on every request. Check both that the user possesses the correct role and that they have explicit ownership/access to the specific resource instance (mitigating Insecure Direct Object References - IDOR).
- **Least Privilege Principle:** Application service accounts and database connections must run with the bare minimum permissions required to execute their specific responsibilities.

---

## 4. Concurrency, Idempotency & Transactional Workflows

- **Idempotency Keys:** Support `Idempotency-Key` headers for mutating endpoints (especially payment and billing operations). Cache transaction outcomes keyed by the unique idempotency token to return identical cached responses upon duplicate submissions.
- **Race Condition Prevention:**
  - Leverage database-level transactions with appropriate isolation levels (`READ COMMITTED`, `SERIALIZABLE`).
  - Use optimistic locking (version timestamps / sequence numbers) or pessimistic row locks (`SELECT ... FOR UPDATE`) when concurrent actors could mutate shared balance or inventory records.
- **Resilient External Integrations:**
  - Wrap third-party API calls in strict timeout boundaries.
  - Implement retry mechanisms with exponential backoff and jitter strictly for idempotent operations.
  - Offload long-running external API synchronizations to background workers.

---

## 5. Security Hardening, Rate Limiting & Abuse Prevention

- **Rate Limiting:** Protect all public endpoints—especially authentication, password resets, and compute-heavy queries—using sliding window rate-limiting algorithms (e.g., via memory caches or Redis token buckets).
- **Request Size Limiting:** Restrict maximum payload sizes on incoming requests (e.g., 100KB for JSON, capped limits for multipart uploads) to thwart Denial of Service (DoS) memory exhaustion attacks.
- **File Upload Protection:**
  - Validate uploads by file signatures (magic bytes), not client-provided file extensions or MIME types.
  - Store uploaded assets in isolated object storage buckets outside the application server execution root.
  - Strip executable permissions, sanitize filenames, and serve user assets via separate domains or content-disposition attachments.
- **Safe Logging & Auditing:**
  - Log contextual operational data accompanied by unique request correlation IDs.
  - Strictly filter out passwords, API keys, cardholder data, authentication tokens, and personally identifiable information (PII) from application logs.
