const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'stats',
    run: async (client, message, args, prefix, color) => {
        const guild = message.guild;

        // Calcul du nombre de membres en ligne
        const onlineMembers = guild.members.cache.filter(member => member.presence.status !== 'offline');
        const onlineCount = onlineMembers.size;

        // Calcul du nombre de membres au total (compte les bots aussi)
        const totalCount = guild.memberCount;

        // Calcul du nombre de membres humains (exclut les bots)
        const humanMembers = guild.members.cache.filter(member => !member.user.bot);
        const humanCount = humanMembers.size;

        // Calcul du nombre de bots
        const botCount = totalCount - humanCount;

        // Calcul du nombre de membres en vocal
        const voiceChannels = guild.channels.cache.filter(channel => channel.type === 'voice');
        let voiceCount = 0;
        voiceChannels.forEach(channel => {
            voiceCount += channel.members.size;
        });

        // Récupère le nombre de boosts du serveur
        const boostCount = guild.premiumSubscriptionCount;
        const serverAvatarURL = guild.iconURL({ format: 'png', dynamic: true, size: 1024 });

        let botAvatar = client.user.displayAvatarURL();
        // Crée un nouvel embed pour afficher les statistiques
        const statsEmbed = new MessageEmbed()
            .setColor(color)
            .setTitle(`__**${guild.name}** 〃 **Statistiques**__`)
            .setDescription(`Membres: **${totalCount}** 🌍\nEn ligne: **${onlineCount}** <:ONLINE:1166871883963183154>\nEn vocal: **${voiceCount}** <:speaker:1166871952921731242>\nBoosts: **${boostCount}** <a:Booster:1166872016473825311>`)
            .setThumbnail(serverAvatarURL)
            .setFooter(`${client.user.username}`, botAvatar) // Assurez-vous que botAvatar est défini ailleurs
            .setTimestamp();

        // Envoie l'embed dans le salon
        message.channel.send(statsEmbed);
    }
};
