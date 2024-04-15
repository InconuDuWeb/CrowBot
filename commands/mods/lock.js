const Discord = require('discord.js');
const db = require('quick.db');
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');

module.exports = {
    name: 'lock',
    aliases: [],
    run: async (client, message, args, prefix, color) => {
        try {
            let perm = false;
            message.member.roles.cache.forEach(role => {
                if (db.get(`modsp_${message.guild.id}_${role.id}`) || db.get(`admin_${message.guild.id}_${role.id}`) || db.get(`ownerp_${message.guild.id}_${role.id}`)) {
                    perm = true;
                }
            });

            if (client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {
                let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

                try {
                    message.guild.roles.cache.forEach(role => {
                        channel.updateOverwrite(role, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        }, `Salon fermé pour le rôle ${role.name}`);
                    });

                    message.channel.send(`Les membres ne peuvent plus parler dans <#${channel.id}>`);
                } catch (e) {
                    console.error(e);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
};
