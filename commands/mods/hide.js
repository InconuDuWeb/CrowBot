const db = require('quick.db');
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');

module.exports = {
  name: 'hide',
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

          // Mise à jour des autorisations pour le rôle @everyone
          channel.updateOverwrite(everyoneRole, {
            VIEW_CHANNEL: false // Empêche le rôle @everyone de voir le salon
          }, `Salon masqué pour le rôle @everyone`);

          message.channel.send(`Le salon <#${channel.id}> est désormais masqué pour tout le monde.`);
        } catch (e) {
          console.error(e);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
