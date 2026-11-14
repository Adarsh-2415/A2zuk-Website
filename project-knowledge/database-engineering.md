# Database Engineering & Data Modeling

## 1. Data Modeling Philosophy & Data Integrity

The database is the durable source-of-truth for application state. Code can be refactored or rewritten in minutes, but corrupted or poorly modeled data incurs compounding friction, technical debt, and risk.

### Core Directives
- **Enforce Invariants in the Schema:** Never rely solely on application-level code to maintain data integrity. Use database constraints (`NOT NULL`, `UNIQUE`, `CHECK`, foreign keys with `ON DELETE` rules) to physically prevent corrupt or orphaned records.
- **Normalization First, Pragmatic Denormalization Later:** Design schemas following Third Normal Form (3NF) to eliminate data duplication and update anomalies. Only introduce controlled denormalization when empirical query profiling proves read bottlenecks under production workloads.
- **Explicit Migrations:** All schema alterations must be captured in deterministic, version-controlled migration scripts. Never execute ad-hoc, untracked DDL statements against staging or production databases.

---

## 2. Relational Schema Design Standards

### Primary Keys & Identifiers
- **Surrogate Keys:** Use surrogate primary keys for entity records:
  - Auto-incrementing integers / bigints for high-write-throughput internal tables where compact index size is critical.
  - Universally Unique Identifiers (UUIDv4 or time-ordered UUIDv7) when IDs must be generated client-side, distributed across nodes, or exposed publicly without revealing total record volume or predictable sequential enumeration.
- **Natural Keys:** Reserve natural keys (e.g., ISO country codes, standard currency symbols) only for immutable, globally standardized reference entities.

### Relationships & Referential Integrity
- **Foreign Key Constraints:** Explicitly define foreign key constraints for all relational associations.
- **Cascade Directives:** Be deliberate with cascading operations. Use `ON DELETE RESTRICT` or `NO ACTION` by default to prevent accidental deletion of critical historical records. Use `ON DELETE CASCADE` only for tightly owned child entities (e.g., line items belonging to an order draft).
- **Soft Deletes vs. Hard Deletes:** Where legal, regulatory, or audit considerations require data preservation, implement soft deletes via timestamp columns (`deleted_at TIMESTAMP WITH TIME ZONE NULL`). Ensure query layers consistently filter soft-deleted rows and that unique indexes account for null deleted timestamps.

---

## 3. Indexing Strategy & Query Optimization

Indexes are critical for read performance but carry write and storage overhead.

### Indexing Best Practices
- **Foreign Key Indexing:** Index foreign key columns by default, as relational databases frequently join on foreign keys and perform cascade checks.
- **Compound / Composite Indexes:** Design multi-column indexes matching query filter patterns:
  - Follow the **Equality, Range, Sort** rule when ordering index columns.
  - Understand prefix matching: an index on `(status, created_at)` accelerates queries filtering by `status` or `(status AND created_at)`, but cannot be used for queries filtering solely by `created_at`.
- **Covering Indexes:** For high-throughput critical queries, include frequently selected columns within the index to allow the database engine to satisfy queries directly from index pages without table lookups.
- **Avoid Over-Indexing:** Every additional index slows down `INSERT`, `UPDATE`, and `DELETE` throughput and consumes buffer memory. Periodically review query logs to identify and drop unused indexes.

### Query Performance Standards
- **Eliminate N+1 Query Patterns:** Always eager-load related records using SQL `JOIN` clauses or batch lookup operations rather than querying children inside an iteration loop.
- **Selectivity & Pagination:**
  - Never use unbounded `SELECT *` queries in production. Select only necessary columns.
  - Prefer cursor-based (keyset) pagination (`WHERE id > :last_seen_id ORDER BY id ASC LIMIT 25`) over deep offset pagination (`OFFSET 50000 LIMIT 25`), which forces full index scans.
- **Execution Plan Inspection:** Use `EXPLAIN ANALYZE` (or database equivalent) to evaluate query execution plans, watching for full table scans, high disk IO, and temporary sort operations.

---

## 4. Transactions, Concurrency & Locking

- **Atomicity via Transactions:** Wrap multi-step data mutations in database transactions so that partial failures automatically roll back, maintaining system consistency.
- **Isolation Levels:**
  - Default to `READ COMMITTED` for general application operations.
  - Elevate to `REPEATABLE READ` or `SERIALIZABLE` when executing financial reconciliations or inventory allocations where phantom reads or non-repeatable reads would corrupt balances.
- **Deadlock Mitigation:** Access tables and acquire locks in a consistent, uniform order across all application transactions to prevent cyclic wait conditions.
- **Short-Lived Transactions:** Keep transactions as brief as possible. Never perform external network calls, file uploads, or heavy CPU tasks while holding open database transactions and locks.

---

## 5. Security, Row-Level Controls & Backup Safety

- **Parameterized Queries:** Always use parameterized queries or prepared statements via battle-tested database libraries or ORMs. **Never concatenate raw user strings into SQL queries**, eliminating SQL Injection risks.
- **Least-Privilege Database Accounts:**
  - Maintain separate database credentials for application runtime (limited to `SELECT`, `INSERT`, `UPDATE`, `DELETE`) versus migration runners (which hold `ALTER`, `CREATE`, `DROP` DDL permissions).
  - Do not use database superuser accounts for day-to-day application operations.
- **Row-Level Security (RLS):** When employing multi-tenant databases or direct client-to-database architectures, enforce database-level Row-Level Security policies to guarantee tenant isolation at the persistence engine level.
- **Backups & Disaster Recovery:**
  - Maintain automated, regular full backups accompanied by continuous write-ahead log (WAL) archiving for Point-In-Time Recovery (PITR).
  - Routinely test backup restoration into isolated environments to verify recovery time objectives (RTO) and recovery point objectives (RPO).
