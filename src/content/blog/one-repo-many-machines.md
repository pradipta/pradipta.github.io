---
featured: true
title: "One Repo, Many Machines: How I Keep My Developer Environment Coherent"
date: 2026-07-20 21:13:00 +0530
description: "Managing one git repo across personal, work, and remote machines with file-level linking, declarative conditions, and why it works better for me than GNU Stow."
tags: [Dotfiles, ZSH, Mac, Terminal, Git, Linux]
---

I work across a small constellation of machines: a personal Mac, a work Mac, and various Linux remotes. The shell, editor plugins, and git muscle memory shouldn't be reinvented per host. But these environments aren't identical either. Work tooling doesn't belong on a personal laptop, and GUI assets have no business being linked onto a headless server.

For years, the standard answer was a mix of a git repo and GNU Stow. That combination gets you surprisingly far, but eventually, it starts to fight you.

Today, I manage that tension with a single repository, a package-oriented layout, and declarative exclusivity. The exact same `git pull && link` path produces the right environment on every machine without messy branches or per-host forks.

## The Friction with Stow

GNU Stow treats each package as a directory tree and symlinks it into `$HOME`. It’s an elegant model, but the operational friction eventually added up:

* **Directory-level linking is a blunt instrument:** Stow wants to own an entire directory. Real systems don't. A folder like `~/.config/` or `~/.ssh/` accumulates local state and unmanaged files. When a tool links the whole directory, everything else inside becomes a conflict.
* **No "same target, different source" mapping:** I want `~/.zshrc-platform` to resolve to `.zshrc.mac` on Darwin and `.zshrc.linux` on Linux, all from a single commit on `main`. Stow mirrors paths exactly; remapping isn't a native feature.
* **No declarative exclusivity:** Stow will happily link a Mac-specific editor config onto a Linux box. You end up writing heavy wrapper scripts to handle what should be simple environment rules.

I still think Stow’s mental model—packages as directories—is right. What I needed was that model with file-level precision and conditional remapping.

## The Model in Practice

The repository structure is straightforward:

```text
dotfiles/
├── dloom/
│   └── config.yaml      # How packages map onto machines
├── zsh/
│   ├── .zshrc
│   ├── .zshrc-common
│   ├── .zshrc.mac
│   ├── .zshrc.linux
└── sublime/             # macOS-only editor package

```

Each top-level directory is a **package**, but the linking happens at the file level. Directories are created as ordinary folders on the target, and only the files inside become symlinks. This means `~/.config/` can seamlessly hold both managed dotfiles and untracked local application state.

### Discovering and Contributing to dloom

My brother and I started [dloom](https://github.com/dloomorg/dloom)—a small Go CLI designed to fix these exact Stow limitations. After watching him use it, I realized it solved every issue I was running into with my multi-machine setup. I adopted it for my own dotfiles, and as I found edge cases across my work and personal setups, I started contributing to the project to help expand its conditional logic.

The day-to-day workflow is minimal:

```bash
# Preview the link graph for the current machine
dloom -d link .

# Apply the links
dloom link .

# Bring an existing local file under management
dloom adopt zsh ~/.zshrc

```

## Environment Exclusivity

Instead of clogging up shell configs with runtime `if/else` checks, environment rules belong at link time. If a file shouldn’t exist on a machine, it shouldn't be symlinked there in the first place.

Three patterns cover my entire setup in `config.yaml`:

### 1. OS Conditions

Mac-specific resources or editor setups are gated by platform. A Linux remote simply skips them entirely:

```yaml
sublime:
  target_dir: "~/Library/Application Support/Sublime Text/Packages/User"
  conditions:
    os: ["darwin"]

```

### 2. Hostname Specificity

OS constraints get you the right platform, but hostname filters get you the right *role*. Work-specific helpers or personal SSH configurations are split by machine name, allowing two different sources to target the exact same destination filename depending on where the script runs:

```yaml
ssh:
  file_overrides:
    "config.work":
      target_name: "config"
      conditions:
        hostname: ["work-macbook"]
    "config.personal":
      target_name: "config"
      conditions:
        hostname: ["home-mac"]

```

### 3. Tool Presence

Linking a complex configuration file for a tool that isn't even installed on a remote machine leads to silent breakages. Gating packages on `executable` presence keeps the environment clean.

## Layered Shell Config

Because shell consistency matters most, I keep my `.zshrc` thin. It handles core environment variables and then sources a small chain of files linked by `dloom`:

```zsh
source ~/.zshrc.gitconfigs
source ~/.zshrc-platform
source ~/.zshrc.work

```

In the repository, `.zshrc.mac` and `.zshrc.linux` exist side-by-side. On disk, they both point to `~/.zshrc-platform`. The configuration handles the mapping cleanly, eliminating a growing nest of `if [[ "$(uname)" == Darwin ]]` statements inside the actual shell scripts.

## The Deployment Loop

Git remains the deployment mechanism. The loop is lightweight:

1. Modify a file in the repo (or use `dloom adopt` to pull a local file in).
2. Review the clean file diffs, commit, and push to `main`.
3. On another machine: `git pull` followed by `dloom link .`.

Because file-level linking is idempotent, pulling new files down won't alter your active environment until you explicitly run the link command. If a conflict occurs, `dloom` backs up the existing file before overwriting it, making it easy to test changes safely.

## Conclusion

Dotfiles are infrastructure. Treating them that way means having a single source of truth, explicit execution, and clear rules for what goes where.

Shifting from directory-level mirrors to file-level precision with `dloom` made sharing a single repository across work and personal machines entirely painless. The differences are written as clean configuration data next to the files, leaving the actual configurations to do exactly what they were intended to do.