---
featured: true
title: "One Repo, Many Machines: How I Keep My Developer Environment Coherent"
date: 2026-07-20 21:13:00 +0530
description: "One git repo across personal, work, and remote machines—file-level linking, OS and hostname exclusivity, and why that works better for me than GNU Stow."
tags: [Dotfiles, ZSH, Mac, Terminal, Git, Linux]
---

I work across a small constellation of machines: a personal Mac, a work Mac, Linux remotes, and short-lived remote environments that come and go with whatever project needs them. The shell, the editor plugins, the fonts, the git muscle memory—none of that should be reinvented per host. But the environments are not identical either. macOS is not Linux. Work tooling does not belong on a personal laptop. Sublime’s User package only exists on the Macs. A wallpaper has no business being linked onto a headless box.

For years the industry answer has been some mix of a git repo and GNU Stow. That combination gets you surprisingly far. It also, eventually, starts to fight you.

This is how I manage that tension today: one repository, package-oriented layout, file-level linking, and declarative exclusivity—so the same `git pull && link` path produces the right environment on every machine without branches, without per-host forks, and without hoping I remember which files belong where.

## The shape of the problem

A good developer environment has two conflicting properties.

**Consistency.** When I open a shell, the aliases I reach for should be there. History should be generous and shared across sessions. Git helpers should behave the same whether I am on a laptop or inside a remote. I should not be debugging my own muscle memory.

**Exclusivity.** Not everything should land everywhere. Platform paths differ (`/opt/homebrew/...` vs Linux package layouts). Work-only helpers—devpod jump hosts, internal CLIs, company AI wrappers—should not leak onto personal machines. GUI and OS resources (editor User packages, fonts, wallpapers) are meaningless or wrong on servers.

Most dotfile setups optimize for the first property and paper over the second with comments, shell `if` blocks, or separate branches. Comments rot. Shell conditionals grow into a second configuration language. Branches diverge and never quite merge cleanly.

I wanted exclusivity to be a property of the *link graph*, not a pile of runtime checks.

## Why Stow stopped being enough

GNU Stow is elegant: treat each package as a directory tree, symlink that tree into `$HOME`, keep the repo tidy. I used it. The friction that finally mattered was not philosophical—it was operational.

**Directory-level linking is a blunt instrument.** Stow wants to own a directory. Real systems do not. `~/.ssh/` accumulates host keys and agent state that should never be in a public or even private-but-shared repo. `~/.config/` is a meeting place for tools you do and do not track. Editor User directories fill with local state, package caches, and one-off snippets. When the manager links a whole directory, anything else that wants to live there becomes a conflict or a hostage.

**There is no first-class notion of “same target, different source.”** I want `~/.zshrc-platform` to resolve to `.zshrc.mac` on Darwin and `.zshrc.linux` on Linux, from one commit on `main`. Stow’s model is “mirror the path.” Remapping is possible with cleverness; it is not a feature.

**There is no declarative exclusivity.** Stow will happily link a Sublime package onto a Linux box that has no Sublime. You end up encoding “don’t do this on that machine” as tribal knowledge, or as a wrapper script that grows until it is a bad package manager.

**Adoption is a manual ritual.** The first time you decide an existing `~/.zshrc` should become managed, you move it by hand, hope the relative paths are right, and symlink back. That ritual is where people introduce silent mistakes.

I still think Stow’s *mental model*—packages as directories—is correct. What I needed was that model with file-level precision, remapping, conditions, and a safer path from “file that already exists” to “file under version control.”

## The model I actually use

The repository is boring on purpose:

```text
dotfiles/
├── dloom/
│   └── config.yaml      # how packages map onto machines
├── zsh/
│   ├── .zshrc
│   ├── .zshrc-common
│   ├── .zshrc.gitconfigs
│   ├── .zshrc.mac
│   ├── .zshrc.linux
│   └── .zshrc.uber
├── sublime/             # macOS-only editor User package
└── resources/           # macOS-only fonts / wallpapers
```

Each top-level directory is a **package**. Linking is file-level: directories are created as ordinary directories on the target; only files become symlinks. That single choice means `~/.config/` can hold managed files and unmanaged ones without drama. Applications remain free to write beside my links.

The manager I use for this is [dloom](https://github.com/dloomorg/dloom)—a small Go CLI in the Stow family that links files instead of directories, and that treats conditions and remaps as config rather than convention. The important part is not the branding; it is the contract: **declare intent once, apply it the same way on every host.**

Day-to-day surface area is small:

```bash
# Preview what this machine would get
dloom -d link .

# Apply
dloom link .

# Bring an existing file under management
dloom adopt zsh ~/.zshrc

# Tear a package down (restores backups when present)
dloom unlink sublime
```

Dry-run is not a nicety. On a work laptop where Sublime’s User directory and system font paths are involved, I always want to see the graph before I write it.

## Layered shell config, not a monolith

The shell is where consistency matters most, so I keep it layered rather than monolithic.

`.zshrc` is a thin entrypoint. It sources a shared common file. Common owns the things that should be true everywhere: Oh My Zsh, history policy, PATH hygiene, fzf bindings, and then a small chain of further sources:

```zsh
source ~/.zshrc.gitconfigs
source ~/.zshrc-platform
source ~/.zshrc.uber
```

- **Common** — cross-machine defaults. History is large, shared across concurrent sessions, and space-prefixed commands are omitted so secrets do not linger in `HISTFILE`. That policy is as important on a remote as it is on a laptop.
- **Git helpers** — interactive `git add` / revert / unstage flows built around `fzf`. Muscle memory should not depend on which machine I SSH’d into.
- **Platform** — the OS-specific seam. Homebrew paths, macOS `open`-based editor helpers, JDK selectors on Darwin; a thinner Linux counterpart on remotes.
- **Work** — internal jump helpers, company AI wrappers, review-tooling aliases. Kept in the same repo so work machines stay one `pull` away from current practice.

The interesting bit is how **platform** is linked. In the repo I keep two files: `.zshrc.mac` and `.zshrc.linux`. On disk, both want to be `~/.zshrc-platform`. That remapping lives in config, not in a naming hack:

```yaml
link_overrides:
  zsh:
    file_overrides:
      ".zshrc.mac":
        target_name: ".zshrc-platform"
        conditions:
          os: ["darwin"]
      ".zshrc.linux":
        target_name: ".zshrc-platform"
        conditions:
          os: ["linux"]
```

Same target name. Different source. One branch. No `if [[ "$(uname)" == Darwin ]]` block that slowly absorbs the entire file.

## Exclusivity as a link-time concern

Runtime `if` statements still have a place—feature detection inside a script, optional tools—but *membership in the environment* belongs at link time. If a file should not exist on a machine, it should not be symlinked there.

Three patterns cover almost everything I need.

### 1. OS conditions on packages

Sublime Text’s User package and macOS resources are Darwin-only. Declaring that at the package level means a Linux remote simply never sees them:

```yaml
sublime:
  target_dir: "~/Library/Application Support/Sublime Text/Packages/User"
  conditions:
    os: ["darwin"]

resources:
  conditions:
    os: ["darwin"]
```

The Sublime package is not just preferences—it is small Python plugins and keymaps that I want versioned. Linking individual files into the User directory (instead of replacing the directory) is what makes that safe: Sublime and Package Control remain free to manage their own files beside mine.

### 2. Hostname conditions for work vs personal

OS gets you platform. Hostname gets you *role*. Work helpers, personal SSH configs, machine-specific secrets layouts—those are hostname-gated packages or file overrides:

```yaml
work:
  conditions:
    hostname:
      - work-macbook
      - work-linux

personal:
  conditions:
    hostname:
      - home-mac

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

The same remapping trick used for platform shell files applies here: two sources, one canonical target name, exclusivity decided before anything touches `$HOME`.

Conditions compose with simple rules—different condition *types* are AND-ed; values within a type are OR-ed—so “Linux **and** this hostname” or “tmux present **and** version ≥ 3” read as data, not as nested shell.

### 3. Executable and version conditions for optional tools

Not every machine has every tool. Linking a tmux 3.x config onto a host with an older binary, or a Waybar Hyprland layout onto a Sway box, is the kind of silent breakage that wastes an evening. Gating on `executable` and `executable_version` keeps those packages honest: if the tool is not there, the config is not either.

## Version control as the deployment mechanism

There is no separate “deploy” step beyond git and a link pass. The loop looks like this:

1. Change a file in the repo (or `dloom adopt <package> <path>` to pull an existing host file into the package tree).
2. `git diff` — review the actual config, not a rendered copy.
3. Commit on `main`. The commit message is the changelog of my environment.
4. Push.
5. On another machine: `git pull`, then `dloom -d link .` to confirm the plan, then `dloom link .`.

Because linking is idempotent and file-level, pulling new files into a package does not automatically explode onto disk until I re-link—which is deliberate. New files are a conscious apply, not a side effect of a directory symlink growing underneath me. When I want confidence on a fresh remote, dry-run is the diff between “repo state” and “what this host would receive.”

Backups matter more than people admit. Before a link replaces a real file, the previous content is preserved. Unlink can restore it. That turns “try this package on a work laptop” from a leap of faith into a reversible operation.

The config file itself is a package. Linking `dloom/config.yaml` into `~/.config/dloom/` means I can run the tool from any cwd and still get the same policy. The manager bootstraps its own configuration the same way it bootstraps everything else.

## What this feels like in practice

**New personal Mac.** Clone the repo, install the linker, `dloom link .`. I get the shell stack, Sublime User files, fonts, wallpaper links—Darwin packages included, Linux-only sources skipped.

**Work Mac.** Same commands. Hostname-gated work packages land; personal-only packages do not. Platform file still resolves to the macOS variant. Devpod helpers and internal aliases are present without me copying them from a wiki page.

**Linux remote / short-lived environment.** Same repo. Sublime and resources packages no-op on conditions. `.zshrc-platform` resolves to the Linux file. Common history and git helpers behave the way my hands expect. When the environment is disposable, I still want the first fifteen minutes to feel like *my* machine.

The win is not that any one of these steps is clever. The win is that the steps are the same, and the *differences* are encoded where they belong: in a small YAML policy next to the files, reviewed in the same pull requests as the configs themselves.

## Tradeoffs I accept

File-level linking means adding a file to a package is not enough—you re-run `link` to materialize it. I prefer that explicitness to directory symlinks that surprise me.

Conditions shift complexity from shell scripts into config. That is the right trade for me: config is reviewable, testable against hostname/OS/PATH, and fails closed (skip) instead of failing open (link something wrong).

I am not trying to replace Nix, Ansible, or a full system image. Those solve “reproduce a machine.” I am solving “reproduce *my* interaction surface across machines I do not fully control.” Different layer. Different tool.

## Closing

Dotfiles are infrastructure. Treat them like it: one source of truth, explicit apply, reversible changes, and policy for what may land where.

Stow taught a generation of us the package metaphor. The refinement that made the multi-machine story tenable for me was narrower links, remappable targets, and exclusivity decided at link time—so personal, work, macOS, and Linux can share a repository without sharing a fate.

If you maintain more than one development machine and your current setup relies on memory, branches, or a growing nest of `uname` checks, try encoding that policy next to the files. The environment should be something you pull and apply—not something you reconstruct.
