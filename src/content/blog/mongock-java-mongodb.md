---
title: "Mongock, Mongo and Java"
date: 2020-11-29 13:32:20 +0300
updatedDate: 2026-07-19
description: "Run MongoDB schema and data migrations from Java with Mongock: when to use it, how changesets work, and what to get right."
img: mongock.png
tags: [Java, Spring, Mongo, MongoDB, Mongock, SpringBoot]
---

Schema and data migrations belong in version control and in the deploy path — not as one-off scripts someone remembers to run. For relational databases, Flyway and Liquibase are the usual choices. For MongoDB, [Mongock](https://www.mongock.io/) fills a similar role: Java (or Kotlin) changesets that run with the application and record what has already been applied.

[Mongobee](https://github.com/mongobee/mongobee), an earlier tool in this space, is unmaintained. Prefer Mongock for new work.

## When Mongock fits

Use Mongock when:

- The database is MongoDB (or another NoSQL store Mongock supports).
- Migrations are naturally expressed as code (indexes, document backfills, collection renames).
- You want migrations to run as part of application startup (or a controlled runner) across environments.

Prefer Flyway/Liquibase when the primary store is relational and the team already standardizes on SQL migrations.

## Dependencies (coordinates drift)

Early Mongock lived under `com.github.cloudyrock.mongock`. Current community artifacts use the `io.mongock` group. **Do not copy years-old Maven snippets blindly** — take BOM, runner, and driver coordinates from the [current Mongock docs](https://docs.mongock.io/v5/get-started/).

Typical shape for Spring Boot:

- Import `mongock-bom` (or use the Spring Boot 3 starter artifacts the docs list for your Boot major).
- Add the Spring Boot runner and a MongoDB / Spring Data driver matching your stack.

Avoid pulling an old "mongock-core" alongside the BOM-managed modules; duplicate classes on the classpath are a common failure mode ([historical example](https://github.com/cloudyrock/mongock/issues/274)).

## Wiring

Exact annotations and property names have evolved with Mongock majors. Conceptually you:

1. Enable the Mongock runner (annotation or builder/bean config).
2. Tell it which package(s) hold migration classes.
3. Ship `ChangeUnit` / changelog classes with ordered, uniquely identified changesets.

Consult [quick start](https://docs.mongock.io/v5/get-started/) for the API that matches the version you pin. Builder-style setup is useful when you need explicit control over beans and execution.

## Writing a changeset

A migration class holds one or more changesets. Each changeset should:

- Have a **stable, unique `id`** — Mongock records applied ids; renaming an id later does not re-run history cleanly.
- Be **idempotent where practical**, or assume it runs exactly once and design accordingly (backfills especially).
- Fail loudly on unexpected state — a half-applied migration is worse than a failed deploy.

Illustrative example (API names vary by Mongock major; treat this as shape, not copy-paste for every version):

```java
@ChangeLog(order = "001")
public class UserMigrations {

    @ChangeSet(order = "001", id = "ensure-users-email-index", author = "pradipta")
    public void ensureEmailIndex(MongoDatabase db) {
        db.getCollection("users")
            .createIndex(Indexes.ascending("email"));
    }

    @ChangeSet(order = "002", id = "backfill-user-status", author = "pradipta")
    public void backfillStatus(MongoTemplate template) {
        Query missing = Query.query(Criteria.where("status").exists(false));
        Update setActive = new Update().set("status", "ACTIVE");
        template.updateMulti(missing, setActive, "users");
    }
}
```

Empty "hello world" changesets teach the runner; production changesets should do real, reviewable work.

## Runtime expectations

- Changesets typically run **at startup** (or when your runner bean executes), before the app serves traffic.
- Already-applied ids are skipped; new ids run in order.
- **Do not assume automatic rollback.** Design migrations to be forward-safe, or pair risky changes with a compensating migration and a deploy plan.
- Locking / distributed execution exists so multiple instances do not double-apply — know how your Mongock version handles locks in multi-replica deploys.

With that discipline, every environment applies the same ordered history on a successful deploy — which is the whole point.
