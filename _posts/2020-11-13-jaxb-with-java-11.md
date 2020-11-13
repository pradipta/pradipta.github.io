---
layout: post
title:  A Problem with JJWT With Java 11 (9+) 
date: 2020-11-13 13:32:20 +0300
description: How to handle multiple versions of JDK and switch between them as and when needed
img: jaxb.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Java, JDK, Java Versions, Java 8, Java 11, JVM]
---
I was implementing Spring Security for a service I am working on for work. The project is based on Java 11 and the Spring Boot Framework.
Usign the JWT token, I was supposed to extract user details and roles. The JWT is signed using a secret key with has been stored in properties encoded in base 64.
```Java
Jwts.parser().setSigningKey(appProperties.getAuth().getTokenSecret()).parseClaimsJws(authToken);
```
The above code is used to validate the JWT's authenticity.

The `setSigningKey(...)` method looks like:
```java
    public JwtParser setSigningKey(String base64EncodedKeyBytes) {
        Assert.hasText(base64EncodedKeyBytes, "signing key cannot be null or empty.");
        this.keyBytes = TextCodec.BASE64.decode(base64EncodedKeyBytes);
        return this;
    }
```

This method throws an error when it tries to decode the encoded key.
Logs:
```
java.lang.ClassNotFoundException: javax.xml.bind.DatatypeConverter
	at java.base/jdk.internal.loader.BuiltinClassLoader.loadClass(BuiltinClassLoader.java:606) ~[na:na]
	at java.base/jdk.internal.loader.ClassLoaders$AppClassLoader.loadClass(ClassLoaders.java:168) ~[na:na]
	at java.base/java.lang.ClassLoader.loadClass(ClassLoader.java:522) ~[na:na]
	at io.jsonwebtoken.impl.Base64Codec.decode(Base64Codec.java:26) ~[jjwt-0.5.jar:0.5]
	at io.jsonwebtoken.impl.DefaultJwtParser.setSigningKey(DefaultJwtParser.java:71) ~[jjwt-0.5.jar:0.5]
```

However, the same Library was being used on other projects I/my team had worked on written in Java 8. There, the decode method calls an api from `jaxb`, but I obserrved that on the Java 11 project, it wasn't the case. Even with exact same version of `jjwt`.

The problem lies with JJWT with Java 11 (or any after Java 8).

The `jaxb` APIs are considered to be Java EE APIs. The API is completely removed from the Java 11 SDK. With the introduction of modules since Java 9, the `java.se` module is available on the default classpath, and it doesn't include Java EE APIs.

To fix the same, you can pass `--add-modules java.xml.bind` as a command line argument.
A better fix is to add the `jaxb` API as a Maven/Gradle dependancy.

```maven
<!-- Runtime, com.sun.xml.bind module -->
<dependency>
    <groupId>org.glassfish.jaxb</groupId>
    <artifactId>jaxb-runtime</artifactId>
    <version>{version}</version>
</dependency>
```
```
compile group: 'javax.xml.bind', name: 'jaxb-api', version: '{version}'
```
This makes `jaxb` APIs available in the classpath and the above problem gets fixed.

Sources:
<li><a href="https://stackoverflow.com/questions/43574426/java-how-to-resolve-java-lang-noclassdeffounderror-javax-xml-bind-jaxbexceptio">Link 1 | StackOverflow</a></li>
<li><a href="https://www.programmersought.com/article/57492225148/">Link 2 | ProgrammerSought Blog</a></li>
<li><a href="https://github.com/jwtk/jjwt/issues/317">Link 3 | GitHub</a></li>
