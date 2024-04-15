const db = require('quick.db');
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');

module.exports = {
  name: 'unhide',
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
          // Obtient le rôle @everyone
          const everyoneRole = message.guild.roles.everyone;

          // Mise à jour des autorisations pour le rôle @everyone pour rétablir la visibilité
          channel.updateOverwrite(everyoneRole, {
            VIEW_CHANNEL: true // Rétablit la possibilité de voir le salon pour le rôle @everyone
          }, `Salon rétabli pour le rôle @everyone`);

          message.channel.send(`Le salon <#${channel.id}> est désormais à nouveau visible pour tout le monde.`);
        } catch (e) {
          console.error(e);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
