---
title: "Build a Slackbot using Hubot"
date: 2020-06-14 13:32:20 +0300
updatedDate: 2026-07-19
description: "Generate a Hubot, write a custom script, and run it on Slack — plus when to choose something newer for greenfield bots."
img: hubot.jpg
tags: [Slack, Hubot, Bot, CoffeeScript, JavaScript]
---

Hubot is GitHub's open-source chat robot: Node.js, scriptable in CoffeeScript or JavaScript, with adapters for the shell, Slack, and others. It is a fast way to put automation in a channel — deploys, reminders, environment locks — without building a full Slack app from scratch.

**Caveat for greenfield work:** Hubot is legacy. For a new Slack integration, prefer Slack's current platform ([Bolt](https://slack.dev/bolt-js/tutorial/getting-started) and friends). This post is still useful if you are maintaining Hubot, learning the pattern, or cloning an existing bot like the one below.

You need Node.js and npm installed.

## Generate a Hubot

```bash
npm install -g yo generator-hubot
mkdir alfred && cd alfred
yo hubot
```

Run it in the shell adapter:

```bash
./bin/hubot
```

Try `alfred help` (replace `alfred` with the name you chose). Built-in scripts are mostly toys; the value is in scripts you write or install.

Community scripts often live on npm under `hubot-*`. Install one and list it in `external-scripts.json`.

## Write a custom script

Place CoffeeScript or JavaScript in `scripts/`, and export a function that receives `robot`.

Create `scripts/alfred.coffee`. Hubot indexes the header block for `help`:

```coffee
# Description:
#   Alfred Hubot
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot hello - Say hello
#
# Author:
#   pradipta.sarma

module.exports = (robot) ->
  robot.respond /hello/i, (res) ->
    res.reply "Hey #{res.envelope.user.name}, what's up?"
```

`robot.respond` matches messages addressed to the bot (`alfred hello`). `res` carries sender, room, and message metadata.

Reload or restart Hubot, then:

```text
alfred hello
# => Hey Shell, what's up?
```

On Slack, the username is the Slack user, not `Shell`.

From here you can add more `robot.respond` / `robot.hear` handlers, call HTTP APIs, write to Hubot's brain (Redis by default in many setups), or talk to an external database.

## Connect to Slack

In your workspace, add the Hubot app (or create an integration that yields a bot token — Slack's Hubot listing has moved over the years; follow current Slack docs for bot tokens if the classic Hubot app is gone). Set the token and start with the Slack adapter:

```bash
HUBOT_SLACK_TOKEN=xoxb-your-token ./bin/hubot --adapter slack
```

Invite the bot to a channel and try `alfred ping` — you should get `PONG` if the stock scripts are enabled.

## Why I built Alfred

At a previous company, "Winky" reserved dev and staging environments so two people did not deploy over each other. You could see who held an instance and coordinate. I wanted the same thing at my then-current workplace, so I built **Alfred** on Hubot and Slack. Credit for the inspiration: [Nemo](https://github.com/captn3m0).

The code for that bot is in [pradipta/alfred](https://github.com/pradipta/alfred).

If you are starting today and do not need Hubot compatibility, build on Slack Bolt. If you need to understand or extend a Hubot that already runs the floor, the generate → script → adapter path above is still the map.
