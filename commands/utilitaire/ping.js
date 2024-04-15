const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = {
    name: 'ping',
    aliases: ["speed"],

    run: async (client, message, args, prefix, color) => {
        if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true) {
            let embeeed = new Discord.MessageEmbed()
                .setDescription("Calcul en cours...")
                .setColor(color);

            let msg = await message.channel.send(embeeed);
            
            let latency = msg.createdAt - message.createdAt;
            
            let pingStatus = "";
            if (latency <= 70) {
                pingStatus = "<:7431theconnectionisexcellent:1140559321898422375> (Très bon)";
            } else if (latency <= 200) {
                pingStatus = "<:3657theconnectionisgood:1140559295386226688> (Moyen)";
            } else if (latency <= 500) {
                pingStatus = "<:4379zasieg:1140566387786530826> (Pas Ouf)";
            } else if (latency <= 10000) {
                pingStatus = "<:8920theconnectionisbad:1140559361043869827> (Aberrant)";
            }
            
            let latencyStatus = "";
            if (client.ws.ping <= 70) {
                latencyStatus = "<:7431theconnectionisexcellent:1140559321898422375> (Très bon)";
            } else if (client.ws.ping <= 200) {
                latencyStatus = "<:3657theconnectionisgood:1140559295386226688> (Moyen)";
            } else if (client.ws.ping <= 500) {
                latencyStatus = "<:4379zasieg:1140566387786530826> (Pas Ouf)";
            } else if (client.ws.ping <= 10000) {
                latencyStatus = "<:8920theconnectionisbad:1140559361043869827> (Aberrant)";
            }

            let botAvatar = client.user.displayAvatarURL();
            
            let embed = new Discord.MessageEmbed()
                .setTitle("**Latence et Ping :**")
                .setDescription(`Ping du Bot : ${latency}ms ${pingStatus}\nPing de l'API: ${client.ws.ping}ms - ${latencyStatus}`)
                .setFooter(`${client.user.username}`, botAvatar)
                .setTimestamp()
                .setColor(color);

            return msg.edit("", embed);
        }
    }
};