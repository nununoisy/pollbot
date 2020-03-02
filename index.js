const Discord = require('discord.js');
const client = new Discord.Client();

let whitelistedChannels = [];

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

client.once('ready', ()=>{
    console.log("Ready!");
    client.user.setPresence({status: "online", game:{name: "pollmaster 3000"}})
});

const EmoteExtractor = /<a?:[0-9a-zA-Z_]+:([0-9]{18})>/g;
const UnicodeExtractor = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
/**
 * Get emote objects from a message
 * @param {Discord.Message} message - message to extract emotes from
 * @returns {String[]} emote IDs from message
 */
const getEmotesFromMessage = message => {
    let emotes = [];
    let copy1 = message.content;
    let copy2 = message.content;
    for (const match of copy1.matchAll(EmoteExtractor)) {
        console.log(`emote ${match}`);
        emotes.push(match[1]);
    }
    for (const match of copy2.matchAll(UnicodeExtractor)) {
        console.log(`unicode ${match}`);
        emotes.push(`${match}`);
    }
    console.log(emotes);
    return emotes;
}

/**
 * React to a message with emotes in order.
 * @param {Discord.Message} message 
 * @param {String[]} ids 
 */
const reactAll = async (message, ids) => {
    let errCount = 0
    for (const id of ids) {
        await message.react(id).catch(e=>{
            console.error(e);
            errCount++;
        });
    }
    if (errCount > 0) {
        let msg = await message.channel.send(`There ${errCount !== 1 ? "were" : "was"} ${errCount} emoji${errCount !== 1 ? "s" : ""} I couldn't react with.`);
        setTimeout(()=>msg.delete(), 5000);
    }
}

/**
 * Determines if a channel is whitelisted.
 * @param {Discord.Channel} channel 
 * @returns {Boolean}
 */
const isWhitelisted = channel => whitelistedChannels.some(cid=>cid===channel.id);

client.on('message', message=>{
    console.log(message);
    console.log(message.channel);
    let isAdmin = message.guild.member(message.author).hasPermission("MANAGE_ROLES");
    if (isAdmin && message.content === "??pollbot whitelistChannel") {
        if (isWhitelisted(message.channel)) {
            message.channel.send("Already whitelisted.");
        } else {
            whitelistedChannels.push(message.channel.id);
            message.channel.send("Added to whitelist.");
        }
    } else if (isAdmin && message.content === "??pollbot blacklistChannel") {
        if (isWhitelisted(message.channel)) {
            whitelistedChannels.remove(message.channel.id);
            message.channel.send("Removed from whitelist.");
        } else {
            message.channel.send("Already blacklisted.");
        }
    } else if (isWhitelisted(message.channel)) {
        let emoteIDs = getEmotesFromMessage(message);
        console.log(emoteIDs);
        if (emoteIDs.length > 0) reactAll(message, emoteIDs);
    }
})

client.login(process.env.BOTTOKEN);