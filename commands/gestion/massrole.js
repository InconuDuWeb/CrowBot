const Discord = require('discord.js');
const db = require('quick.db');
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');

module.exports = {
  name: 'massrole',
  run: async (client, message, args, prefix, color) => {
    let perm = false;

    message.member.roles.cache.forEach(role => {
      if (db.get(`admin_${message.guild.id}_${role.id}`) || db.get(`ownerp_${message.guild.id}_${role.id}`)) {
        perm = true;
      }
    });

    if (
      client.config.owner.includes(message.author.id) ||
      db.get(`ownermd_${client.user.id}_${message.author.id}`) === true ||
      perm
    ) {
      if (!args[0]) {
        return message.channel.send(`Veuillez utiliser la commande comme ceci : \`${prefix}massiverole <@rôle>\``);
      }

      let role1 = message.mentions.roles.first()?.id;
      if (!role1) {
        role1 = args[0];
      }

      const role2 = message.guild.roles.cache.get(role1);
      if (!role2) {
        return message.channel.send("Rôle non valide spécifié.");
      }

      // Vérifier si le bot est au-dessus du rôle demandé
      if (role2.comparePositionTo(message.guild.me.roles.highest) >= 0) {
        return message.channel.send("Je ne peux pas attribuer ce rôle car il est égal ou supérieur à mon rôle le plus élevé.");
      }

      const memberCount = message.guild.memberCount;
      let botAvatar = client.user.displayAvatarURL();

      // Calculer le temps approximatif
      const averageProcessingTimePerMember = 1000; // Temps moyen en millisecondes
      const estimatedTotalTime = memberCount * averageProcessingTimePerMember;
      const estimatedTotalTimeInSeconds = Math.floor(estimatedTotalTime / 1000);

      // Convertir les secondes en minutes et heures
      const hours = Math.floor(estimatedTotalTimeInSeconds / 3600);
      const minutes = Math.floor((estimatedTotalTimeInSeconds % 3600) / 60);
      const seconds = estimatedTotalTimeInSeconds % 60;

      // Création de l'embed pour le message initial avec l'estimation du temps
      const embed = new Discord.MessageEmbed()
        .setColor(color)
        .setTitle("Attribution de rôle en masse")
        .setDescription(`Vous venez de lancer un \`massrole\` :\n > **Rôle :** ${role2} \n  > **Nombre de membres :** ${memberCount} \n > **Temps approximatif :** ${hours > 0 ? hours + (hours > 1 ? ' heures' : ' heure') : ''}${minutes > 0 ? (hours > 0 ? ', ' : '') + minutes + (minutes > 1 ? ' minutes' : ' minute') : ''}${seconds > 0 ? (hours > 0 || minutes > 0 ? ' et ' : '') + seconds + (seconds > 1 ? ' secondes' : ' seconde') : ''}.`)
        .setFooter(`${client.user.username}`, botAvatar) // Assurez-vous que botAvatar est défini ailleurs
        .setTimestamp();

      message.channel.send(embed); // Envoyer le message initial

      // Boucle pour ajouter le rôle à un membre toutes les secondes
      for (let i = 0; i < memberCount; i++) {
        const member = message.guild.members.cache.array()[i];

        setTimeout(() => {
          member.roles.add(role2).catch(e => {
            // Ignorer les erreurs
          });
        }, i * 1000); // Ajoute le rôle toutes les secondes (1000 millisecondes)
      }
    }
  },
};
