const Discord = require('discord.js')
const db = require('quick.db')
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');


module.exports = {
    name: 'blacklist',
    aliases: ["bl"],
    run: async (client, message, args, prefix, color) => {

            if(client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true) {

                if (args[0] === "add") {
                    let member = client.users.cache.get(message.author.id);
                        if(args[1]) {
                        member = client.users.cache.get(args[1]);
                    } else {
                        return message.channel.send(`Aucun membre trouvé pour \`${args[1]|| " "}\``)
            
                    }
                    if (message.mentions.members.first()) {
                        member = client.users.cache.get(message.mentions.members.first().id);
                    }
                    if (!member) return message.channel.send(`Aucun membre trouvé pour \`${args[1]|| " "}\``)
                           if (db.get(`blmd_${client.user.id}_${member.id}`) === true) { return message.channel.send(`${member.username} est déjà owner`)}
                           client.guilds.cache.forEach(g => {
                            if(g.members.cache.get(member.id)) {
                                g.members.cache.get(member.id).ban().then(() => {nmb+=1}).catch(err => {nmbe+=1})
                             
                            }
                        });
                           db.set(`blmd_${client.user.id}_${member.id}`, true)
            
                        message.channel.send(`${member.username} est maintenant dans la Blacklist`)
                    } else if(args[0] === "clear") {
                        let tt = await db.all().filter(data => data.ID.startsWith(`blmd_${client.user.id}`));
                        message.channel.send(`${tt.length === undefined||null ? 0:tt.length} ${tt.length > 1 ? "personnes ont été supprimées ":"personne a été supprimée"} de la blacklist`)
             
                   
                        let ttt = 0;
                        for(let i = 0; i < tt.length; i++) {
                          db.delete(tt[i].ID);
                          ttt++;
                        }   
                    }else if(args[0] === "remove") {
    
                        if(args[1]){
                            let member = client.users.cache.get(message.author.id);
                            if (args[1]) {
                                member = client.users.cache.get(args[1]);
                            } else {
                                return message.channel.send(`Aucun membre trouvé pour \`${args[1]|| " "}\``)
                    
                            }
                            if (message.mentions.members.first()) {
                                member = client.users.cache.get(message.mentions.members.first().id);
                            }
                            if (!member) return message.channel.send(`Aucun membre trouvé pour \`${args[1]|| " "}\``)
                            if (db.get(`blmd_${client.user.id}_${member.id}`) === null) { return message.channel.send(`${member.username} n'est pas blacklist`)}
                          db.delete(`blmd_${client.user.id}_${member.id}`)
                          message.channel.send(`${member.username} n'est plus blacklist`)
                        }                    
             } else if (args[0] === "list") {

            let money = db.all().filter(data => data.ID.startsWith(`blmd_${client.user.id}`)).sort((a, b) => b.data - a.data);

            const embed = new Discord.MessageEmbed()
                .setTitle('Blacklist')
                .setDescription(money)
                .setFooter(`Total: ${money.length} users • ${client.config.name}`)
                .setColor(color);

            message.channel.send(embed);
        }
    }
}}