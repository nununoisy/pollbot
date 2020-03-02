# pollbot

An extremely simple autoresponder for polling channels.

[Invite me to your server!](https://discordapp.com/oauth2/authorize?client_id=683851167796822040&scope=bot&permissions=329792)

## Get Started
1. Add the bot to your server with the link above.
2. Comment `??pollbot whitelistChannel` in the poll channel to allow it to work there. Note that you must have Manage Roles permissions to use this.
3. Comment `??pollbot blacklistChannel` to disable a previously enabled channel.

The bot cannot use external emotes unless it is in the server where those emotes are. You will be notified if an invalid emote is used.

## Self-Hosting Quickstart

You will need Node.js v12 or above.
Make sure to grab packages with `npm i`.
To start the bot, run `BOTTOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx node index.js`.
Replace the x-es with your bot's Discord token. You will need permissions integer 329792.