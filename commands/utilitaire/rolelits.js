const { MessageEmbed } = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');
const db = require('quick.db')

module.exports = {
  name: 'rolelist',
  run: async (client, message, args, prefix, color) => {
    let perm = "";
    message.member.roles.cache.forEach(role => {
      if (db.get(`modsp_${message.guild.id}_${role.id}`)) perm = true;
      if (db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true;
      if (db.get(`admin_${message.guild.id}_${role.id}`)) perm = true;
    });

    if (
      client.config.owner.includes(message.author.id) ||
      db.get(`ownermd_${client.user.id}_${message.author.id}`) === true ||
      perm ||
      db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true
    ) {
      const guild = message.guild;

      const roles = guild.roles.cache
        .filter(role => role.name !== '@everyone')
        .map(role => `<@&${role.id}> ${role.id} (${role.members.size} Membres)`);

      const wordsPerPage = 10; // Number of words to show per page
      const roleChunks = roles.reduce((acc, role) => {
        if (acc.length === 0 || acc[acc.length - 1].length >= wordsPerPage) {
          acc.push([]);
        }
        acc[acc.length - 1].push(role);
        return acc;
      }, []);

      if (!roleChunks || roleChunks.length === 0) {
        return message.channel.send("Il n'y a aucun rôle sur ce serveur.");
      }

      let currentPage = 0;

      const generateEmbed = (page) => {
        const chunk = roleChunks[page].join('\n');

        const embed = new MessageEmbed()
          .setColor(color)
          .setTitle(`Liste des rôles du serveur (${roles.length} rôles)`)
          .setDescription(chunk);

        embed.setFooter(`Page ${page + 1} sur ${roleChunks.length}`);

        return embed;
      };

      const sentMessage = await message.channel.send({ embed: generateEmbed(currentPage), component: createButtons(currentPage, roleChunks.length) });

      const filter = (button) => button.clicker.user.id === message.author.id;
      const collector = sentMessage.createButtonCollector(filter, { time: 120000 });

      collector.on('collect', async (button) => {
        await button.reply.defer();

        if (button.id === 'previous' && currentPage > 0) {
          currentPage--;
        } else if (button.id === 'next' && currentPage < roleChunks.length - 1) {
          currentPage++;
        }

        const updatedEmbed = generateEmbed(currentPage);
        const updatedButtons = createButtons(currentPage, roleChunks.length);

        // Edit the original message to update the embed content and buttons
        sentMessage.edit({ embed: updatedEmbed, component: updatedButtons });
      });

      collector.on('end', () => {
        sentMessage.edit({ components: [] }).catch(console.error);
      });
    }
  },
};

function createButtons(page, totalChunks) {
  const previousButton = new MessageButton()
    .setStyle('blurple')
    .setLabel('Précédent')
    .setID('previous')
    .setDisabled(page === 0);

  const nextButton = new MessageButton()
    .setStyle('blurple')
    .setLabel('Suivant')
    .setID('next')
    .setDisabled(page === totalChunks - 1);

  const row = new MessageActionRow()
    .addComponent(previousButton)
    .addComponent(nextButton);

  return row;
}
