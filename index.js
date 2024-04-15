const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');
const Discord = require('discord.js')
const client = new Discord.Client({
    fetchAllMembers: true,
     partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILD_VOICE_STATES'] ,
     intents: [
        Discord.Intents.FLAGS.DIRECT_MESSAGES,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_BANS,
        Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Discord.Intents.FLAGS.GUILD_INTEGRATIONS,
        Discord.Intents.FLAGS.GUILD_INVITES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Discord.Intents.FLAGS.GUILD_PRESENCES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES,
        Discord.Intents.FLAGS.GUILD_WEBHOOKS,
      ]
    })
const {readdirSync} = require("fs")
const db = require('quick.db')
const ms = require("ms")
const { MessageEmbed } = require('discord.js')
const {login } = require("./util/login.js");
login(client)

process.on("unhandledRejection", err => {
   if(err.message) return
  console.error("Uncaught Promise Error: ", err);
})
const loadCommands = (dir = "./commands/") => {
    readdirSync(dir).forEach(dirs => {
      const commands = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
  
      for (const file of commands) {
        const getFileName = require(`${dir}/${dirs}/${file}`);
        client.commands.set(getFileName.name, getFileName);
     console.log(`> Commande charger ${getFileName.name} [${dirs}]`)
  };
    });
  };
  const loadEvents = (dir = "./events/") => {
    readdirSync(dir).forEach(dirs => {
      const events = readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
  
      for (const event of events) {
        const evt = require(`${dir}/${dirs}/${event}`);
        const evtName = event.split(".")[0];
        client.on(evtName, evt.bind(null, client));
        console.log(`> Event charger ${evtName}`)
      };
    });
  };

loadEvents();
loadCommands();
const ticketModule = require('./events/gestion/send-ticket.js');
ticketModule(client);

client.on('message', (message) => {
  // Ne pas prendre en compte les messages du bot
  if (message.author.bot) return;

  // Vérifier si l'auteur du message est un owner (propriétaire)
  const isOwner = db.get(`ownermd_${client.user.id}_${message.author.id}`) === true;

  // Vérification des mots interdits dans le message
  motsInterdits = db.get('motsInterdits') || [];

  const hasInsulte = motsInterdits.some((mot) =>
    message.content.toLowerCase().includes(mot)
  );

  if (hasInsulte && !isOwner) {
    message.delete();

    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const dateFormatted = `${day}/${month}/${year} à ${hours}h${minutes} et ${seconds} secondes`;

    const embedsanction = new Discord.MessageEmbed()
      .setDescription(`Vous venez d'utiliser un mot interdit sur ce serveur. Merci de faire plus attention à votre vocabulaire !\n\n> Heure : **${dateFormatted}**\n> Membre : **${message.author}**\n> Mot Interdit : **${message.content}**\n> Sanction : **aucune**`)
      .setColor("#0000FF")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setFooter(`AutoMod : ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }));
    message.channel.send(embedsanction)
      .catch((err) => console.error('Erreur lors de la suppression du message:', err));
  }
});

client.on('guildMemberAdd', (member) => {
    if (member.guild.id === '1153726635028271247') {
const linkButton = new MessageButton()
        .setLabel('Obtenir des membres gratuitement !')
        .setStyle('url')
        .setEmoji("1182313754373926934")
        .setURL("https://discord.com/channels/1153726635028271247/1182272266751463488");

    const linkButtonbot = new MessageButton()
        .setLabel('Obtenir un Oauth2-Bot')
        .setStyle('url')
        .setEmoji("1182316509498982430")
        .setURL("https://discord.com/channels/1153726635028271247/1182273252740055140");

    const embedWelcome = new MessageEmbed()
        .setColor("#0000FF")
        .setTitle(`Bienvenue sur Oauth2-Bot !`)
        .setFooter("✨ Événement référencé dans le salon event")
        .setThumbnail('https://cdn.discordapp.com/avatars/1159935174071550064/8004733ed59923fc5f46457101aa420b.webp?size=4096')
        .setDescription("Bienvenue sur le serveur [Oauth2-Bot](https://discord.gg/m97AFpJ6k6) ^^\n\n**__Dans ce serveur, tu trouveras :__**\n> `📁`- Des bots open source\n> `🥰`- De l'aide si tu en as besoin\n> `💰`- Des bots payants\n> `🎁`- Des giveaways en quantité\n> `🎉`- Des évènements de membres gratuit presque toute les semaine !\n\n__**Voici les évènements en cours :**__\n> <a:event:1182313754373926934> 1 Invite = 100 membre (membres réel)\n> 100 Membres gratuis que tu peut envoyer dans le serveur de ton choix a récupérer dans le salon <#1182274663812964382> <a:SusDancer:1182282130609418260>\n> <a:Giveaway2_Empire:1182368516033216582> Giveaways 2000 membres gratuits\n\nSi tu as été invité par **un ami à toi** car il fait l'événement **1 Invite = 100 membre**, je t'invite à aller faire la [vérification](https://discord.com/api/oauth2/authorize?client_id=1178485972611112971&redirect_uri=https%3A%2F%2Fbackup.oauth2-bot.site%2F&response_type=code&scope=guilds.join%20identify&response_type=code&state=YaTssBK7JTnwgz-KdsOR&prompt=none) dans le salon https://discord.com/channels/1153726635028271247/1182272078557229076 <a:panda:1182316127154606172>");

    const roweeeeeeee = new MessageActionRow().addComponents(linkButtonbot, linkButton);

    member.send({ embed: embedWelcome, components: roweeeeeeee });
}
    });
