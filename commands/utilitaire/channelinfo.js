const Discord = require('discord.js');
const db = require('quick.db');
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');
const axios = require('axios');

module.exports = {
    name: 'channelinfo',
    aliases: ['channel', 'ci'],
    description: 'channel <salon>',
    run: async (client, message, args, prefix, color) => {

        let perm = "";
        message.member.roles.cache.forEach(role => {
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true;
        });

        if(client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm || db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true ) { 

            if (!args[0]) {
                var channel = message.channel;
            } else {
                var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            }

            if (!channel) {
                return;
            }

            let channelType = "";
            if (channel.type === 'text') channelType = 'Salon texte';
            else if (channel.type === 'voice') channelType = 'Salon vocal';
            else if (channel.type === 'category') channelType = 'Catégorie';
            let botAvatar = client.user.displayAvatarURL();
            const channelInfoEmbed = new Discord.MessageEmbed()
                .setTitle(`➔ **Information du salon**`)
                .setFooter(`${client.user.username}`, botAvatar)
                .setTimestamp()
                .addField(`➔ **Information sur le salon ${channelType} ${channel.name}**`, `> • **Nom :** ${channel.name}\n> • **Identifiant :** ${channel.id}\n> • **Sujet :** ${channel.topic !== null ? channel.topic : 'Aucun'}\n> • **Type :** ${channel.type}\n> • **Utilisateurs :** ${channel.members ? channel.members.size : 0}\n> • **Création :** <t:${Math.floor(channel.createdAt.getTime() / 1000)}:d> (<t:${Math.floor(channel.createdAt.getTime() / 1000)}:f>)\n> • **Catégorie :** ${channel.parent ? channel.parent : 'Non Catégorisé'}`)
                .setColor(color);

            if (channel.type === 'text' || channel.type === 'news' || channel.type === 'store') {
                channelInfoEmbed.addField(`➔ **Informations avancées**`, `> • **Mode lent :** ${channel.rateLimitPerUser > 0 ? `Activé (${channel.rateLimitPerUser} secondes)` : 'Désactivé'}\n> • **NSFW :** ${channel.nsfw ? 'Oui' : 'Non'}`);
            }
            
            if (channel.type === 'voice') {
                channelInfoEmbed.addField(`➔ **Informations avancées**`, `> • **Débit binaire (bitrate) :** ${channel.bitrate / 1000}kbps\n> • **Membres connectés :** ${channel.members ? channel.members.size : 0}\n> • **Limite d'utilisateur :** ${channel.userLimit === 0 ? 'Aucune Limite' : channel.userLimit}`);
            }

            message.channel.send(channelInfoEmbed);
        }
    }
};
