---
layout: post
title:  Manage Multiple Git Accounts on a Computer 
date: 2021-06-08 13:32:20 +0300
description: Want to use a Git account for work and one for personal projects? Here's how.
img: multiple-git.jpg# Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Git, Github, Mac, Terminal]
---
I recently started working for a company that uses GitHub Enterprise for their Git solution. I set my work laptop and it's terminal to use that GitHub account and git credentials to manage git on my computer.
I also wanted to work on my personal projects which I have maintained on my GitHub account. The process to maintain multiple Git accounts on a single machine was straightforward but I wasn't aware of the how-tos.

I looked up upon it a little and got it to work. If you're looking for the same, here's how:

*(The commands and directories are according to a Mac computer. Things might change on a Linux or a Windows, but the job to be done remains the same, please look uiip for the right commands in that case.)*
<h3>1. Generate separate SSH Keys for both (or more?) accounts</h3>
head to your `.ssh` directory and generate sets of SSH keys for both the accounts. This can be ignored for the accounts which already have a pair generated. This was true for my case as I had already set up my work account.
To generate a pair of ssg keys, run `ssh-keygen -t rsa`
Follow the instructions that ask for a file location, name, etc. For the name, I prefer setting something like `id_rsa_work` and `id_rsa_personal` as it is easier to identify (in case I need to someday).

<h3>Manage ssh config file</h3>
There should be a file named `config` in the `.ssh` folder. If not, we need to create one by running `touch config`.
Edit the config and add the following lines into it:
```
#work account
Host github<-identifier>.com
   HostName <enterprice github host>
   User git
   IdentityFile ~/.ssh/id_rsa_work
   IdentitiesOnly yes

#personal account
Host github<-identifier>.com
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_rsa_personal
   IdentitiesOnly yes
```

Example config:
```
#pradipta-sarma account
Host github.com
   HostName xyz.github.com
   User git
   IdentityFile ~/.ssh/id_rsa_work
   IdentitiesOnly yes

#pradipta account
Host github-personal.com
   HostName github.com
   User git
   IdentityFile ~/.ssh/id_rsa_personal
   IdentitiesOnly yes
```
And save the file.

<h3>Register the SSH keys on the respective GitHub accounts</h3>
This step is to let GitHub identify our machine and authorize it, to avoid typing in the id and password everytime.
Follow the steps [here](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account) to add the keys to the respective accounts.

To avoid using the work account on a clone for a personal repo, you can change a clone from:
`git clone git@github.com:user/repo.git` to `git clone git@github-personal.com:user/repo.git`

With this, you're good to go. Let me know if there's an issue or if I have missed something.
