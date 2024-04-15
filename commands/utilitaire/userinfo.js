const Discord = require('discord.js');
const db = require('quick.db');
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');
const axios = require('axios');

module.exports = {
    name: 'userinfo',
    aliases: ['user', 'ui'],
    run: async (client, message, args, prefix, color) => {

        let perm = "";
        message.member.roles.cache.forEach(role => {
            if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true;
            if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true;
        });

        if(client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm || db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true ) { 
            let user = message.mentions.members.first();
            if (user) user = user.id;
            if (!user) user = args[0];
            if (!user) user = message.author.id;
            if (!message.guild.members.cache.has(user)) return message.channel.send(`Aucun membre trouvé pour \`${args[0]}\``);
            else user = message.guild.members.cache.get(user);

            let nm = "";
            client.guilds.cache.map(r => {
                const list = client.guilds.cache.get(r.id);
                list.members.cache.map(m => (m.user.id ==user.id ? nm++ : nm = nm));
            });

            const data = await axios.get(`https://discord.com/api/users/${user.id}`, {
                headers: {
                    Authorization: `Bot ${client.config.token}`
                }
            }).then(d => d.data);

            const avatarURL = user.user.displayAvatarURL({ dynamic: true });

            const roles = user.roles.cache.size > 1 ? user.roles.cache.filter(role => role.name !== '@everyone').map(role => `<@&${role.id}>`).join(', ') : 'everyone';

            const statusMap = {
                online: '<a:online:1223948999720042560> En ligne',
                idle: '🌙 Absent',
                dnd: '<a:off:1223948626397761576> Ne pas déranger',
                offline: '<:Offline:1223948319160795258> Hors ligne'
            };
            let botAvatar = client.user.displayAvatarURL();
            const UserInfo = new Discord.MessageEmbed()
    .setAuthor(user.user.username, avatarURL)
    .addField('➔ **Informations sur l\'utilisateur**', `> **• Nom d'utilisateur :** ${user.user.tag}\n> **• ID :** ${user.id}\n> **• Robot :** ${user.user.bot ? 'Oui' : 'Non'}\n> **• Création de compte :** <t:${Math.floor(user.user.createdTimestamp / 1000)}:D> (il y a ${Math.floor((Date.now() - user.user.createdTimestamp) / 86400000)} jour(s))\n> **• Statut :** ${statusMap[user.presence.status] || 'Inconnu'}`)
    .addField('➔ **Informations sur le membre**', `> **• A rejoint le serveur le :** <t:${Math.floor(user.joinedTimestamp / 1000)}:D> (il y a ${Math.floor((Date.now() - user.joinedTimestamp) / 86400000)} jour(s))\n> **• Boost le serveur :** ${user.premiumSince ? 'Oui' : 'Non'}\n> **• Surnom :** ${user.nickname ? user.nickname : 'Aucun'}\n> **• Rôles :** ${roles}`)
    .setColor(color)
    .setFooter(`${client.user.username}`, botAvatar) // Assurez-vous que botAvatar est défini ailleurs
   .setTimestamp()
    .setThumbnail(avatarURL);

            const avatarButton = new MessageButton()
                .setLabel('Photo de Profil')
                .setStyle('url')
                .setURL(avatarURL);

            const buttonRow = new MessageActionRow()
                .addComponents(avatarButton);

            if (data.banner) {
                let url = data.banner.startsWith("a_") ? ".gif?size=2048" : ".png?size=2048";
                url = `https://cdn.discordapp.com/banners/${user.id}/${data.banner}${url}`;
                UserInfo.setImage(url);

                const bannerButton = new MessageButton()
                    .setLabel('Bannière')
                    .setStyle('url')
                    .setURL(url);

                buttonRow.addComponents(bannerButton);
            }

            message.channel.send({ embed: UserInfo, component: buttonRow });
        }
    }
};
