# Clean Code & Maintainability Standards

## 1. Clean Code Philosophy

Code is read far more often than it is written. Writing clean code is not about aesthetic pedantry; it is an economic and operational imperative that preserves developer velocity, minimizes defects, and keeps software maintainable throughout its multi-year lifecycle.

### Core Directives
- **Simplicity Over Cleverness:** Prefer straightforward, explicit code over esoteric syntax, deeply nested ternary operators, or clever one-liners that obscure intent.
- **Self-Documenting Code:** Write code that reveals its purpose through clear naming, cohesive structure, and explicit control flows.
- **Rule of Three for Abstraction:** Do not prematurely abstract code. Duplicate logic twice is acceptable if the patterns are still evolving; abstract into a shared utility or component on the third occurrence when the shared invariants are fully understood.
- **Boy Scout Rule:** Always leave modified code cleaner, better typed, and better documented than you found it.

---

## 2. Naming Conventions & Expressiveness

Names should be unambiguous, pronounceable, searchable, and accurately reflect intent:

### Functions & Methods
- Use active verb-noun phrases that clearly describe what the function does and what it returns:
  - Good: `calculateInvoiceTotal()`, `validateUserCredentials()`, `fetchActiveSubscribers()`.
  - Bad: `data()`, `process()`, `handleStuff()`, `user()`.
- Boolean functions or predicates should read like questions: `hasPermission()`, `isValidEmail()`, `canAccessResource()`, `isArchived()`.

### Variables & Constants
- Variables should describe the data they hold:
  - Good: `remainingRetries`, `primaryPhoneNumber`, `shippingAddress`.
  - Bad: `val`, `temp`, `res2`, `arr`.
- Avoid abbreviations and acronyms unless they are universally accepted domain terminology (e.g., `id`, `url`, `html`, `ip`).
- Use uppercase snake_case for compile-time constants: `MAX_RETRY_ATTEMPTS`, `DEFAULT_PAGE_SIZE`.

---

## 3. Function & Component Design

- **Small & Focused:** Functions should ideally do one thing and do it well. Strive to keep function bodies focused on a single level of abstraction.
- **Low Parameter Count:** Aim for three or fewer parameters per function. When an operation requires many parameters, group them into a typed configuration object.
- **Pure Functions Where Possible:** Maximize pure functions (functions with no side effects whose return values depend solely on their arguments). Pure functions are trivial to test, reason about, and parallelize.
- **Command-Query Separation (CQS):** A function should either perform an action (command) or return data (query), but not both:
  - Query methods should not mutate state.
  - State-mutating commands should return simple confirmation or the mutated entity, avoiding unexpected side effects.

---

## 4. Control Flow & Error Handling

- **Early Returns / Guard Clauses:** Avoid deeply nested `if/else` ladders. Validate preconditions at the top of functions and return early:
  ```typescript
  // Preferred: Guard clauses
  function processOrder(order: Order, user: User): Result {
    if (!user.isAuthenticated) {
      return Result.error("Authentication required");
    }
    if (order.items.length === 0) {
      return Result.error("Cannot process empty order");
    }
    if (!order.hasValidPaymentMethod) {
      return Result.error("Valid payment method required");
    }

    return executeOrderPlacement(order, user);
  }
  ```
- **Explicit Error Handling:** Never swallow exceptions with empty `catch` blocks. Either handle the error meaningfully (log, retry, recover) or bubble it up to a centralized error boundary with contextual details.
- **Fail Fast:** Detect invalid arguments and corrupt state immediately at the boundary rather than allowing corrupt data to propagate through internal application layers.

---

## 5. Type Safety & Explicit Contracts

- **Strict Type Systems:** Avoid untyped escape hatches (`any`, raw unchecked dictionaries). Define explicit interfaces or types for all domain models, function arguments, and API payloads.
- **Avoid Primitive Obsession:** Group related primitive values into domain objects or value types (e.g., encapsulate `currency` and `amount` into a `Money` structure).
- **Discriminated Unions for State:** Represent state machines and complex entity variations using discriminated unions to ensure exhaustive type checking at compile time.

---

## 6. Meaningful Comments & Documentation Discipline

- **Explain "Why", Not "What":** Code explains what is happening; comments should explain **why** it is done that way, documenting business rationale, non-obvious workarounds, or regulatory constraints:
  - *Redundant:* `// Increment counter by 1` -> `counter++;`
  - *Valuable:* `// Offset by 1 second to accommodate clock drift on legacy payment gateway`
- **Delete Dead Code:** Never leave commented-out blocks of code in the codebase. Version control (Git) preserves historical implementations; dead code creates confusion and visual noise.
- **TODO Discipline:** When temporary shortcuts are necessary, tag them with standardized format: `// TODO(engineer-name): description of required improvement by [milestone/date]`.
