---
layout: post
title:  Mongock, Mongo and Java
date: 2020-11-29 13:32:20 +0300
description: Database Migration to Mongo DB on Java using Mongock
img: mongock.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Java, Spring, Mongo, MongoDB, Mongock, SpringBoot]
---
Database Migration tools are essential with applications where you need to migrate data into a database, change a schema, update a record/document across all environments and where it is tedious to do it manually (_almost always?_). These can also help you with keeping a track of the changes made, just like version control.

With Java there are various libraries you can use for the purpose. There's [Liquibase](https://www.liquibase.org/), [Flyway](https://flywaydb.org/), [Mongock](https://github.com/cloudyrock/mongock) and maybe more.

When using MongoDB as the database for the application, I found that Mongock would be the best to go for.

[Mongobee](https://github.com/mongobee/mongobee) seems to be outdated and not being maintained anymore.

To use the same with Java, you would need the following dependencies (in addition to the Mongo Java Driver/Spring Mongo data that you'd use to set up the application anyways):
* [Mongock BOM](https://mvnrepository.com/artifact/com.github.cloudyrock.mongock/mongock-bom)
* [Mongock runner](https://mvnrepository.com/artifact/com.github.cloudyrock.mongock/mongock)
* [Mongock driver](https://mvnrepository.com/artifact/com.github.cloudyrock.mongock/mongock-spring-v5)
* [MongoDB driver sync](https://mvnrepository.com/artifact/org.mongodb/mongodb-driver-sync)

Make sure not to import Mongock Core along with the above dependencies, as it will lead you into having multiple versions of a library in your classpath. Read more on this [here](https://github.com/cloudyrock/mongock/issues/274)

On importing the above, all you need to do is:
* Annote the Application Class with `@EnableMongock`
* Specify the package(s) where you'd localte your `Changelog` classes on your `application.yml` or `application.properties` under `mongock.change-logs-scan-package`

With this, the application should be ready to be run, without an issue. If you face any, leave a comment or visit the [issues](https://github.com/cloudyrock/mongock/issues) section on Github, and you'd most likely find a solution for it.

To add a changelog, create a `changelog` class in the package mentioned in the properties file. Annotate the class with `@Changelog(order = "001...")`. The order defines the order in which the changelog classes will be executed in case there are multiple. The class should now contain the `changesets`. The changesets are nothing but Java methods. You can create collections, insert a document, or do whatever you'd want to that you can do via a Java method. The method would run at the Startup and the changes (if any) would get executed (if not already).

Example class:

```
@ChangeLog(order = "001")
public class Changelog {
    @ChangeSet(order = "001", id="001", author = "pradipta")
    public void dummyChangeSet() {
        System.out.println("Dummy changeset");
    }

    @ChangeSet(order = "002", id="create collection", author = "pradipta")
    public void createCollection(MongoDatabase db) {
        MongoCollection<Document> mycollection = db.getCollection("dummycollection");
        Document doc = new Document("k1", "v1").append("k2", "v2");
        mycollection.insertOne(doc);
    }

    @ChangeSet(order = "003", id = "insert document", author = "pradipta")
    public void insertDocument(MongockTemplate mongockTemplate) {
        User user = new User("Name", "Email", "Phone");
        //User is an entity with a collection already defined
        mongockTemplate.save(user);
    }
}
```

There is also another method where you write the builder yourself and not annotate the application with `@EnableMongock`. You'd want to do it if you want to have a control over the beans and configure things. Read the [documentation](https://www.mongock.io/quick-start) for more information.

With these, you can be sure to have the changes being executed onto the DB on a successful deployment to any environment.

Happy coding.
