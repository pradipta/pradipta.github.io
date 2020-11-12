---
layout: post
title:  Manage Multiple JDK Versions on Your Computer 
date: 2020-11-12 13:32:20 +0300
description: How to handle multiple versions of JDK and switch between them as and when needed
img: java-versions.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Java, JDK, Java Versions, Java 8, Java 11, JVM]
---
Java now released a new version every 6 months, the latest as on the date of this post is the [JDK 15](https://openjdk.java.net/projects/jdk/15/), while the LTS are released at longer intervals.

You might be using a version of Java for work or your personal use, and may need to use another version of it for a different project. Or, if you're one who would want to try out the newest version as soon as it comes out and also have the stable version installed, this can help. Although, you can pick up a JAR from anytime in the past 25 years, and most likely it will run on the newest version of Java, it is good to have an LTS (or whatever your main version of need is) installed for your actual projects.

To change a version of Java, you need to change the `JAVA_HOME` environment variable. And it's a pain to do it every time.

I have two projects that I work on almost everyday. One runs on Java 8 while the other is on Java 11. Here's what I did to be able to switch between them when needed.

```
export JAVA8_HOME=$(/usr/libexec/java_home -v1.8)
export JAVA11_HOME=$(/usr/libexec/java_home -v11)

alias java8='export JAVA_HOME=$JAVA8_HOME'
alias java11='export JAVA_HOME=$JAVA11_HOME'

# To use Java 8
java8

# To use Java 11
java11
```

After doing so, I now have two aliases `java8` and `java11`, calling which, sets my `JAVA_HOME` to either `JAVA8_HOME` or `JAVA11_HOME`. Adding a new one is as easy as exporting a new home and creating an alias for it.

In case you're using zsh, you can write these into your `.zshrc` file using `echo` or pasting them into the file manually and doing a `source ~/.zshrc`. An awesome tutorial to set up ZSH is up [here](https://pradipta.github.io/terminal-setup-on-mac/) or [here](https://dev.to/pradipta/terminal-setup-on-macos-48l9)

There is another way of doing this using `jenv`. A post on that will be here soon.