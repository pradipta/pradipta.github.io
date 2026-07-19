---
title: "Manage Multiple Git Accounts on a Computer"
date: 2021-06-08 13:32:20 +0300
updatedDate: 2026-07-19
description: "Use separate SSH keys, Host aliases, and conditional gitconfig so work and personal GitHub accounts coexist cleanly."
img: multiple-git.jpg
tags: [Git, GitHub, Mac, Terminal]
---

Work often means GitHub Enterprise (or a company GitHub org) on one account, and personal repos on another. One machine, two identities. The reliable pattern is: **separate SSH keys**, **SSH `Host` aliases**, and **git config that sets the right name/email per directory**.

Commands below assume macOS (or Linux with the same OpenSSH layout). Windows is the same idea via a different path to `.ssh`.

## 1. Generate separate SSH keys

```bash
cd ~/.ssh
ssh-keygen -t ed25519 -C "work@example.com" -f id_ed25519_work
ssh-keygen -t ed25519 -C "you@personal.example" -f id_ed25519_personal
```

Skip generation for any account that already has a key. Prefer Ed25519 unless a host still requires RSA.

Add each **public** key (`.pub`) to the matching GitHub / Enterprise account: [Adding a new SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

## 2. SSH config with Host aliases

Create or edit `~/.ssh/config`:

```text
# Work (GitHub Enterprise example)
Host github-work
  HostName github.mycompany.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  IdentitiesOnly yes

# Personal (github.com)
Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes
```

Important details:

- `Host` is an **alias you invent**. It is not the real hostname.
- `HostName` is what SSH actually connects to.
- `IdentitiesOnly yes` stops ssh-agent from offering the wrong key first.

### Clone and remote URLs must use the alias

Personal:

```bash
git clone git@github-personal:USERNAME/REPO.git
```

Work:

```bash
git clone git@github-work:ORG/REPO.git
```

A remote of `git@github.com:...` will **not** use the `github-personal` block. Rewrite existing remotes:

```bash
git remote set-url origin git@github-personal:USERNAME/REPO.git
```

## 3. Commit identity: name and email

SSH picks the account for push/pull. **Commit author** is separate — it comes from `user.name` / `user.email`. Wrong email on a work commit is a common footgun.

### Per-repo (fine for a few clones)

```bash
git config user.name "Your Name"
git config user.email "you@company.com"
```

### Conditional includes (better for many repos)

Keep work and personal trees in different parent directories, then in `~/.gitconfig`:

```ini
[user]
  name = Your Name
  email = you@personal.example

[includeIf "gitdir:~/work/"]
  path = ~/.gitconfig-work

[includeIf "gitdir:~/personal/"]
  path = ~/.gitconfig-personal
```

`~/.gitconfig-work`:

```ini
[user]
  email = you@company.com
```

`~/.gitconfig-personal`:

```ini
[user]
  email = you@personal.example
```

Any repo under `~/work/` picks up the work email automatically.

## Sanity checks

```bash
ssh -T git@github-personal
ssh -T git@github-work
git config --show-origin --get user.email
```

You should see the expected "Hi username!" greeting for each host, and the email that matches the directory you are in.
