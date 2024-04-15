const Discord = require('discord.js');
const db = require('quick.db');
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');
const axios = require('axios');

module.exports = {
    name: 'serverinfo',
    aliases: ['si'],
    run: async (client, message, args, prefix, color) => {

        let perm = false;
        message.member.roles.cache.forEach(role => {
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true;
        });

        if(client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm || db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true ) { 
            const guild = client.guilds.cache.get(args[0]) || message.guild;
            const owner = guild.members.cache.get(guild.ownerID);
            let botAvatar = client.user.displayAvatarURL();
            const serverInfo = new Discord.MessageEmbed()
                .setTitle(`➔ **Informations sur le serveur**`)
                .setDescription(`> • **Nom :** ${guild.name}\n> • **Description :** ${guild.description || 'Aucune'}\n> • **ID :** ${guild.id}\n> • **Owner :** ${owner.user}\n> • **Créé le :** <t:${Math.floor(guild.createdAt.getTime() / 1000)}:d> (il y a ${Math.floor((Date.now() - guild.createdAt.getTime()) / 86400000)} jour(s))\n> • **URL :** ${guild.vanityURLCode ? `https://discord.gg/${guild.vanityURLCode}` : 'Aucun'}`)
                .setColor(color)
                .setFooter(`${client.user.username}`, botAvatar)
                .setTimestamp()
                .setThumbnail(guild.iconURL({ dynamic: true }));

            const onlineMembers = guild.members.cache.filter(m => ['online', 'dnd', 'streaming', 'idle'].includes(m.presence?.status)).size;
            const humans = guild.members.cache.filter(m => !m.user.bot).size;
            const bots = guild.members.cache.filter(m => m.user.bot).size;

            if (guild.memberCount > 0) {
                serverInfo.addField('➔ **Statistiques du serveur**', `> • **Utilisateurs :** ${guild.memberCount}\n> • **Humains :** ${humans}\n> • **Bots :** ${bots}`);
            }

            const textChannels = guild.channels.cache.filter(c => c.type === 'text').size;
            const voiceChannels = guild.channels.cache.filter(c => c.type === 'voice').size;
            const rolesCount = guild.roles.cache.size;
            const highestRole = guild.roles.highest;
            const emojisCount = guild.emojis.cache.size;

            if (textChannels > 0 || voiceChannels > 0 || rolesCount > 0 || emojisCount > 0) {
                serverInfo.addField('➔ **Détails**', `> • **Salons textuels :** ${textChannels}\n> • **Salons vocaux :** ${voiceChannels}\n> • **Rôles :** ${rolesCount}\n> • **Plus haut rôle :** ${highestRole}\n> • **Emojis :** ${emojisCount}`);
            }

            const boostsCount = guild.premiumSubscriptionCount;
            const boostersCount = guild.premiumTier === 'NONE' ? 0 : guild.premiumSubscriptionCount;
            const boostLevel = getBoostLevelTranslation(guild.premiumTier);
            const verificationLevel = getVerificationLevelTranslation(guild.verificationLevel);
            const systemChannel = guild.systemChannel || 'Aucun';
            const rulesChannel = guild.rulesChannel || 'Aucun';

            if (boostsCount > 0 || boostersCount > 0 || boostLevel || verificationLevel || systemChannel || rulesChannel !== 'Aucun') {
                serverInfo.addField('➔ **Autres**', `> • **Boosts :** ${boostsCount}\n> • **Boosters :** ${boostersCount}\n> • **Niveau de boost :** ${boostLevel}\n> • **Niveau de vérification :** ${verificationLevel}\n> • **Salon système :** ${systemChannel}\n> • **Salon règlement :** ${rulesChannel}`);
            }

            if (guild.banner) {
                let url = guild.banner.startsWith("a_") ? ".gif?size=2048" : ".png?size=2048";
                url = `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}${url}`;

                const bannerButton = new MessageButton()
                    .setLabel('Bannière du serveur')
                    .setStyle('url')
                    .setURL(url);

                const buttonRow = new MessageActionRow()
                    .addComponents(bannerButton);

                message.channel.send({ embed: serverInfo, component: buttonRow });
            } else {
                message.channel.send(serverInfo);
            }
        }
    }
};

function getBoostLevelTranslation(boostTier) {
    switch (boostTier) {
        case 'NONE':
            return 'Bas';
        case 'TIER_1':
            return 'Élevé';
        case 'TIER_2':
            return 'Très élevé';
        case 'TIER_3':
            return 'Ultra élevé';
        default:
            return 'Inconnu';
    }
}

function getVerificationLevelTranslation(verificationLevel) {
    switch (verificationLevel) {
        case 'NONE':
            return 'Aucune';
        case 'LOW':
            return 'Basse';
        case 'MEDIUM':
            return 'Moyenne';
        case 'HIGH':
            return 'Élevée';
        case 'VERY_HIGH':
            return 'Très élevée';
        default:
            return 'Inconnue';
    }
}
