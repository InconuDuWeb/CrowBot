const axios = require('axios');         
const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = async (client, guild) => {

   console.log(`J'ai quitté le serveur ${guild.name} [${guild.memberCount}]`);
   const serverAvatar = guild.iconURL();
   const botAvatar = client.user.displayAvatarURL();

   client.config.owner.forEach(u => {
       const user = client.users.cache.get(u);
       if (user) {
           const embed = new MessageEmbed()
               .setColor("#0000FF")
               .setThumbnail(serverAvatar)
               .setTitle('Bot a quitté un Serveur <:coeur:1141601311100514344>')
               .setDescription(`Je viens de quitter ${guild.name} (${guild.memberCount} membres).\nPropriétaire : <@${guild.owner.id}>`);

           user.send(embed);
       }
   });

   let own = db.all().filter(data => data.ID.startsWith(`ownermd_${client.user.id}`)).sort((a, b) => b.data - a.data); 
   own.filter(x => client.users.cache.get(x.ID.split('_')[2])).map(async (m, i) => {
       const user = client.users.cache.get(m.ID.split('_')[2]);
       if (user) {
           const embed = new MessageEmbed()
               .setColor("#0000FF")
               .setThumbnail(serverAvatar)
               .setTitle('Bot a quitté un Serveur <:coeur:1141601311100514344>')
               .setDescription(`Je viens de quitter ${guild.name} (${guild.memberCount} membres).\nPropriétaire : <@${guild.owner.id}>`);

           user.send(embed);
       }
   });
};
