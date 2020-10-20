---
layout: post
title:  Terminal Setup on MacOS 
date: 2020-05-18 13:32:20 +0300
description: The terminal on a Mac device sucks. Do this. # Add post description (optional)
img: zsh.png # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [ZSH, Mac, Termninal]
---
This is what the default terminal looks like on a Mac:

![Terminal on a Mac](https://github.com/pradipta/pradipta.github.io/raw/master/posts/zsh/images/terminal.png)

And this sucks. It looks bad, it is hard to read, and differentiate. And there are no fancy colors.

To boost it up and level up the terminal game we’re going to use use the following:

    iTerm2
    ZSH
    Oh My ZSH

Steps:

Install Homebrew. For that, run:

    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

You may need to install Command Line tool for X-Code before that.

    xcode-select --install

Download and install iTerm2 from here or run:

    brew cask install iterm2

Install ZSH and oh-my-zsh

    brew install zsh
    sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"

To run zsh shell, run:

    zsh

We’re also going set up Auto Suggestions and Syntax Highlighting to make the experience friendlier and easier to use. To do that we need to edit the .zshrc file (located at `~/.zshrc`). This is where most of our configuration is going to take place.

Install zsh-autosuggestions and zsh-syntax-highlighting:

    brew install zsh-syntax-highlighting
    brew install zsh-autosuggestions

You can set your ZSH theme by putting in this line into your `.zshrc` file. Make sure you import the `.zshrc` after any change for it to reflect.

    ZSH_THEME=robbyrussell

At this point your terminal/iTerm2 should look something like:

![iTerm2 with ZSH](https://github.com/pradipta/pradipta.github.io/raw/master/posts/zsh/images/zsh.png)

And this is much better. Notice the short git commands that I’ve used? Well, those are configurable too. Follow this [repository](https://github.com/pradipta/Terminal-Setup-for-Mac) for the complete guide and .zshrc file with all the configurations, aliases and functions.

Thanks for reading.