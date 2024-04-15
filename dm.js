const { MessageEmbed } = require('discord.js');
const { MessageButton, MessageActionRow } = require('discord-buttons');

function sendWelcomeDM(member) {
    const linkButton = new MessageButton()
        .setLabel('Obtenir des membres gratuitement !')
        .setStyle('url')
        .setEmoji("1161368975540768769")
        .setID("https://discord.com/channels/1153726635028271247/1155453382803324989");

    const linkButtonbot = new MessageButton()
        .setLabel('Obtenir un Oauth2-Bot')
        .setStyle('url')
        .setEmoji("1158092105302945992")
        .setID("https://discord.com/channels/1153726635028271247/1154723112294809650");

    const embedWelcome = new MessageEmbed()
        .setColor("#0000FF")
        .setTitle(`Bienvenue sur Oauth2-Bot !`)
        .setFooter("✨ Événement référencé dans le salon event")
        .setThumbnail('https://cdn.discordapp.com/avatars/1159935174071550064/8004733ed59923fc5f46457101aa420b.webp?size=4096')
        .setDescription("Bienvenue sur le serveur [Oauth2-Bot](https://discord.gg/m97AFpJ6k6) ^^\n\n**__Dans ce serveur, tu trouveras :__**\n> `📁`- Des bots open source\n> `🥰`- De l'aide si tu en as besoin\n> `💰`- Des bots payants\n> `🎁`- Des giveaways en quantité\n> `🎉`- Des évènements de membres gratuit presque toute les semaine !\n\n__**Voici les évènements en cours :**__\n> <:event:1155927254573002854> 1 Invite = 100 membre (membres réel)\n> 100 Membres gratuis que tu peut envoyer dans le serveur de ton choix a récupérer dans le salon <#1155453382803324989> <a:SusDancer:1164915504725626972>\n> <a:Giveaway2_Empire:1161368975540768769> Giveaways 2000 membres gratuits\n\nSi tu as été invité par **un ami à toi** car il fait l'événement **1 Invite = 100 membre**, je t'invite à aller faire la [vérification](https://discord.com/api/oauth2/authorize?client_id=1153781486785413311&redirect_uri=https%3A%2F%2Fbackup.oauth2-bot.site%2F&response_type=code&scope=guilds.join%20identify&response_type=code&state=YaTssBK7JTnwgz-KdsOR&prompt=none) dans le salon https://discord.com/channels/1153726635028271247/1154071157822206075 <a:panda:1157842520601018418>");

    const roweeeeeeee = new MessageActionRow().addComponents(linkButtonbot, linkButton);

    member.send({ embeds: [embedWelcome], components: [roweeeeeeee] });
}

module.exports = { sendWelcomeDM };
