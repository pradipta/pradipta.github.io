---
title: "Manage Multiple JDK Versions on Your Computer"
date: 2020-11-12 13:32:20 +0300
updatedDate: 2026-07-19
description: "Switch between JDKs on macOS with java_home, shell aliases, and a PATH that actually follows JAVA_HOME."
img: java-versions.jpg
tags: [Java, JDK, Java Versions, JVM]
---

Java ships a new feature release every six months, with LTS versions on a slower cadence. Day-to-day work often means more than one JDK: an LTS for production services, another for a legacy module, sometimes a newer build to try language features.

On macOS, the supported way to locate installed JDKs is `/usr/libexec/java_home`. Pointing `JAVA_HOME` (and `PATH`) at the right one is enough for most workflows.

## The alias approach

I regularly switch between Java 8 and Java 11. This lives in `~/.zshrc`:

```bash
export JAVA8_HOME=$(/usr/libexec/java_home -v1.8)
export JAVA11_HOME=$(/usr/libexec/java_home -v11)

# Prefer JAVA_HOME's bin over whatever else is on PATH
export PATH="$JAVA_HOME/bin:$PATH"

alias java8='export JAVA_HOME=$JAVA8_HOME'
alias java11='export JAVA_HOME=$JAVA11_HOME'

# Default for new shells
java11
```

Then:

```bash
java8    # or java11
java -version
echo $JAVA_HOME
```

Adding another version is the same pattern: resolve a home with `java_home -v…`, export it, and alias a switcher.

Reload after editing `.zshrc`:

```bash
source ~/.zshrc
```

## Caveats worth knowing

- **Shell-local.** These aliases change the current shell (and children). A GUI app or another terminal tab will not see the switch until you run the alias there too.
- **`PATH` matters.** Setting `JAVA_HOME` alone does nothing if an older `java` earlier on `PATH` wins. Put `$JAVA_HOME/bin` first, as above.
- **Install first.** `java_home -v11` fails if that JDK is not installed. Install Temurin, Oracle, or whatever you use, then list what macOS sees:

```bash
/usr/libexec/java_home -V
```

## When aliases are not enough

If you juggle many JDKs, auto-switch per directory, or share the same workflow on Linux, use a dedicated manager such as [SDKMAN!](https://sdkman.io/) or [jenv](https://www.jenv.be/). For two or three versions on a Mac, `java_home` plus aliases stays the smallest reliable solution.
