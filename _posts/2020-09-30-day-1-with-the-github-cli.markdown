---
layout: post
title: Day 1 with the Github CLI 1.0
date: 2020-09-30 13:32:20 +0300
description: # Add post description (optional)
img: git.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [git, GitHub, CLI]
---
GitHub finally launch their CLI, versioned 1.0 after 7 months of having it in Beta. Done with `Cmd+Tab` / `Ctrl+tab` to move to the browser. Do it all at one place.

You can install the GitHub CLI on you laptop and can perform entire GitHub's workflow right from the terminal, starting from creating an issue, reviewing a PR, to merging a PR.

You can create aliases against any commands.
You can also use GitHub APIs to trigger Actions.

Visit this [link] (https://cli.github.com/) for the official documentation.

To install Github CLI, open the terminal and run:

`brew install gh` [Mac]

`sudo apt-add-repository https://cli.github.com/packages && sudo apt update && sudo apt install gh` [Linux]

`scoop bucket add github-gh https://github.com/cli/scoop-gh.git` [Windows]

![brew install gh](https://dev-to-uploads.s3.amazonaws.com/i/z1wq21q0yo7evpyq4zif.png)

![gh help](https://dev-to-uploads.s3.amazonaws.com/i/zy7e6sezp7u8rnojy6u1.png)

After the installation, we need to authenticate the CLI with our GitHub Account. For that, run `gh auth login` and proceed with the instructions that follow.

![gh auth login](https://dev-to-uploads.s3.amazonaws.com/i/eop95e9ycn3qw8lpmun9.png)

On a successful login, we now can perform all the workflows of GitHub, for which, previously, we had to open the browser, right from the terminal.

Let's look at some of them.

`gh repo clone <repo name>`

![gh repo clone](https://dev-to-uploads.s3.amazonaws.com/i/9fwa2iojsylsx41fop1y.png)

A `gh repo view` would show us the Readme for the repo, if any.

We can create an issue on a repo using `gh issue create` and entering the details that it asks for.

![gh issue create](https://dev-to-uploads.s3.amazonaws.com/i/qu01e78m7m6jdv6lsahp.png)

I created a new branch and made some changes, commited them and pushed it to the branch. To raise a PR, I previously had to go to GitHub.com on my browser and raise it from there. No more. All you need is: `gh pr create`

![gh pr create](https://dev-to-uploads.s3.amazonaws.com/i/l3qneg20bxti073oyfn9.png)

We can also perform PR reviews from the CLI. I haven't tried out reviewing a big PR on it to put my thoughts about it. But yes, we can. We can approve, leave comments, or request for changes right from the CLI.

![gh pr approve](https://dev-to-uploads.s3.amazonaws.com/i/oivdbcalve17u5o22ha6.png)

Also, have it merged.

![gh pr merge](https://dev-to-uploads.s3.amazonaws.com/i/c9thjrls6142q4mwe1p6.png)

This is just an overview, there are a whole lot of commands we need to play around and try out.

One of the best things: to create a new repo, we donot need to do a `git init`, Create Repo on GitHub.com, and `git remote add origin ...`. It is just a command on the CLI.

Happy Git!