---
title: "JJWT on Java 11+: ClassNotFoundException for DatatypeConverter"
date: 2020-11-13 13:32:20 +0300
updatedDate: 2026-07-19
description: "Old JJWT versions call javax.xml.bind.DatatypeConverter for Base64. On Java 11+ that class is gone — upgrade JJWT and use java.util.Base64."
img: jaxb.jpg
tags: [Java, JDK, JJWT, Spring, SpringBoot]
---

While wiring Spring Security on a Java 11 service, JWT validation blew up when parsing tokens signed with a Base64-encoded secret. The same JJWT version worked on our Java 8 services.

## What failed

```java
Jwts.parser()
    .setSigningKey(appProperties.getAuth().getTokenSecret())
    .parseClaimsJws(authToken);
```

The overload that takes a `String` treated the value as Base64 and decoded it roughly like this (JJWT 0.5):

```java
public JwtParser setSigningKey(String base64EncodedKeyBytes) {
    Assert.hasText(base64EncodedKeyBytes, "signing key cannot be null or empty.");
    this.keyBytes = TextCodec.BASE64.decode(base64EncodedKeyBytes);
    return this;
}
```

Stack trace:

```
java.lang.ClassNotFoundException: javax.xml.bind.DatatypeConverter
	at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:606)
	...
	at io.jsonwebtoken.impl.Base64Codec.decode(Base64Codec.java:26) ~[jjwt-0.5.jar:0.5]
	at io.jsonwebtoken.impl.DefaultJwtParser.setSigningKey(DefaultJwtParser.java:71) ~[jjwt-0.5.jar:0.5]
```

JJWT's Base64 helper called `javax.xml.bind.DatatypeConverter`. That class lived in the JDK through Java 8. From Java 9 it was modularized as Java EE API surface, and **Java 11 removed it from the JDK entirely**. Same library version, different runtime — different classpath.

This is not really a "Spring + JAXB" problem. It is an **old JJWT + modern JDK** problem.

## Preferred fix: upgrade JJWT

Move off `0.5`-era JJWT. Current JJWT uses `java.util.Base64` (or accepts keys/bytes without going through JAXB). Prefer passing a proper `Key` (or decoded bytes) instead of relying on a string overload that assumes Base64:

```java
byte[] keyBytes = Base64.getDecoder().decode(appProperties.getAuth().getTokenSecret());
SecretKey key = Keys.hmacShaKeyFor(keyBytes);

Jwts.parserBuilder()
    .setSigningKey(key)
    .build()
    .parseClaimsJws(authToken);
```

(Exact builder API depends on your JJWT major version — check the [JJWT docs](https://github.com/jwtk/jjwt) for the release you pin.)

Upgrading also gets you fixes and a maintained security surface. Pinning `0.5` forever is the wrong long-term answer.

## Fallback: restore JAXB on the classpath

If you cannot upgrade yet, you can put JAXB back on the runtime classpath so `DatatypeConverter` resolves again:

```xml
<dependency>
  <groupId>org.glassfish.jaxb</groupId>
  <artifactId>jaxb-runtime</artifactId>
  <version><!-- pin a current release --></version>
</dependency>
```

Or the API jar alone, depending on what the old codec needs:

```groovy
implementation 'javax.xml.bind:jaxb-api:<version>'
```

`--add-modules java.xml.bind` only helps on JDKs that still ship the module (Java 9/10). It is not a Java 11+ solution.

Treat this as a bridge, not the destination. You are papering over a dependency that still assumes a Java 8 JDK layout.

## Takeaway

When a library fails only after a JDK upgrade, check whether it reaches into removed EE APIs (`javax.xml.bind`, `javax.annotation`, and friends). Fix the library version and call sites first; re-adding EE jars is for locked dependency trees.
