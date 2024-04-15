const Discord = require("discord.js");
const disbut = require("discord-buttons")
const db = require("quick.db")

module.exports = (client) => {
    console.log(`- Connecté ${client.user.username}`)

    client.user.setActivity("Oauth2-Bot.site", { type: "WATCHING" });

    client.guilds.cache.map(async guild => {
        await guild.members.fetch().catch(e => { })
    })
    
}
