const axios = require('axios');
const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = async (client, guild ,color) => {
   console.log(`J'ai rejoint le serveur ${guild.name} [${guild.memberCount}]`);
   if (db.get(`antijoinbot_${client.user.id}`) === null) {
       client.config.owner.forEach(u => {
           const user = client.users.cache.get(u);
           const serverAvatar = guild.iconURL();
           if (user) {
               const embed = new MessageEmbed()
                   .setColor("#0000FF")
                   .setThumbnail(serverAvatar)
                   .setTitle('Bot ajouté ! <a:M_SYnitro:1221545416823275671>')
                   .setDescription(`Le bot vient de rejoindre ${guild.name} (\`${guild.memberCount} membres\`).\nPropriétaire : <@${guild.owner.id}>`);
               user.send(embed);
           }
       });

       const own = db.all().filter(data => data.ID.startsWith(`ownermd_${client.user.id}`)).sort((a, b) => b.data - a.data);
       own.filter(x => client.users.cache.get(x.ID.split('_')[2])).map((m, i) => {
           const user = client.users.cache.get(m.ID.split('_')[2]);
           if (user) {
               const embed = new MessageEmbed()
                   .setColor("#0000FF")
                   .setThumbnail(serverAvatar)
                   .setTitle('Bot ajouté ! <a:M_SYnitro:1221545416823275671>')
                   .setDescription(`Le bot vient de rejoindre ${guild.name} (\`${guild.memberCount} membres\`).\nPropriétaire : <@${guild.owner.id}>`);
               user.send(embed);
           }
       });

   } else if (db.get(`antijoinbot_${client.user.id}`) === true) {
       const own = db.all().filter(data => data.ID.startsWith(`ownermd_${client.user.id}`)).sort((a, b) => b.data - a.data);
       client.config.owner.forEach(u => {
           const user = client.users.cache.get(u);
           if (user) {
               const embed = new MessageEmbed()
                   .setColor("#0000FF")
                   .setTitle("Tantative d'ajout <a:M_SYnitro:1221545416823275671>")
                   .setThumbnail(serverAvatar)
                   .setDescription(`Le bot avait rejoint ${guild.name} (\`${guild.memberCount} membres\`), mais a quitté car l'antijoin du bot est activé (\`botconfig\`).`);
               user.send(embed);
           }
       });

       own.filter(x => client.users.cache.get(x.ID.split('_')[2])).map((m, i) => {
           const user = client.users.cache.get(m.ID.split('_')[2]);
           if (user) {
               const embed = new MessageEmbed()
                   .setColor("#0000FF")
                   .setTitle("Tantative d'ajout <a:M_SYnitro:1221545416823275671>")
                   .setThumbnail(serverAvatar)
                   .setDescription(`Le bot avait rejoint ${guild.name} (\`${guild.memberCount} membres\`), mais a quitté car l'antijoin du bot est activé (\`botconfig\`).`);
               user.send(embed);
           }
       });

       return guild.leave();
   }
};
