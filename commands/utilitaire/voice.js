const Discord = require('discord.js')
const db = require('quick.db')
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');
module.exports = {
    name: 'voice',
    aliases: ["vc"],

    run: async (client, message, args, prefix, color) => {
        let perm = ""
        message.member.roles.cache.forEach(role => {
            if(db.get(`modsp_${message.guild.id}_${role.id}`)) perm = true
            if(db.get(`admin_${message.guild.id}_${role.id}`)) perm = true
        if(db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true
        })
        if(args[0] === "move") {
            let perm = ""
            message.member.roles.cache.forEach(role => {
                if(db.get(`admin_${message.guild.id}_${role.id}`)) perm = true
            if(db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true
            })
            if(client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {    
          if(args[1].toLowerCase() === "all") {
            let channel = message.guild.members.cache.filter(u => u.voice.channel)
            if (!channel) return message.channel.send("Aucun membres n'est en vocal");
            if (channel && message.member.voice.channel) {
               
                    message.channel.send(`Déplace toi dans le salon ou tu souhaite que je déplace toutes les personnes en vocal sur le serveur !`)
    
        let pp = false
        setTimeout(() => {
            if(pp) return  message.channel.send(`Tous les membres ont été déplacés `)

        }, 10000)
                    client.on("voiceStateUpdate", async (oldmem, newmem) => {
                        if (newmem.member.voice.channel && newmem.member.voice.channel.id !== channel.id) {
                            let newchannel = message.guild.channels.cache.get(newmem.member.voice.channel.id);
                            if (message.author.id === newmem.member.user.id) {
                                    channel.forEach(e => {

                                        e.voice.setChannel(newchannel, `Moveall par ${message.author.tag}`);
                                      
                                    }) 
                                    pp = true

                            }
                        }
                   
                })


            } else {
                return message.channel.send("Tes pas en vocal");
            }
            
          } else if(args[1] !== "all") {
            let channel = message.member.voice.channel
            if (!channel) return message.channel.send("tu n'est pas en vocal");
            if (!message.guild.me.voice.connection) {
               
                    message.channel.send(`Déplace toi dans le salon ou tu souhaite que je déplace toutes les personnes du salon!`)
    
        
                    client.on("voiceStateUpdate", async (oldmem, newmem) => {
                        if (newmem.member.voice.channel && newmem.member.voice.channel.id !== channel.id) {
                            let newchannel = message.guild.channels.cache.get(newmem.member.voice.channel.id);
                            if (message.author.id === newmem.member.user.id) {
                                    channel.members.forEach(e => {
                                        e.voice.setChannel(newchannel, `Moveall par ${message.author.tag}`);
                                      
                                    }) 
                                    message.channel.send(`Tous les membres ont été déplacés `)
    
                            }
                        }
                   
                })
            } else {
                return message.channel.send("tu n'est pas en vocal");
            }
           
        }
          }
        } else if(args[0] === "all") {
    
    var streamingCount = 0;
    var mutedCount = 0;
    var mutedMic = 0;
    var cameraCount =0;
    var connectedCount =0;

    const channels = message.guild.channels.cache.filter(c => c.type === 'voice');
    channels.forEach(c => {
        connectedCount += c.members.size;
        c.members.forEach(m => {
            if(m.voice.streaming) streamingCount++;
            if(m.voice.selfDeaf || m.voice.serverDeaf) mutedCount++;            
            if(m.voice.selfMute || m.voice.serverMute) mutedMic++;
            if(m.voice.selfVideo) cameraCount++;
        })
    })
    let botAvatar = client.user.displayAvatarURL();
    const voiceConnectedEmbed = new Discord.MessageEmbed()
    .setTitle(`Salons vocaux`)
    .setDescription(`<:vc:1203517769916616744> En vocal : ${connectedCount} 
<:VCIconMuted:1223921090858975232>  Muet : ${mutedMic}/${connectedCount}
<:VCIconDeafened:1223944997435342908>  Sourdine : ${mutedMic}/${connectedCount}
<:VCScreenshare:1223945193355743284>  Partage écran : ${streamingCount}/${connectedCount}
<:VCVideo:1223945350859985027>  Caméra : ${cameraCount}/${connectedCount}`)
    .setFooter(`${client.user.username}`, botAvatar)
    .setColor(color)
    .setTimestamp();

return message.channel.send(voiceConnectedEmbed);
} else if(!args[1]) {
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle(`Salons vocaux`)
            .setDescription(`Il y a actuellement **${message.guild.members.cache.filter(m => m.voice.channel).size} ${message.guild.members.cache.filter(m => m.voice.channel).size  > 1 ? 'personnes' : 'personne'}** en vocal sur le serveur. `)
            .setColor(color)
         
              message.channel.send( embed) 

    }  else if(!args[0] || args[0] === "info") {
        if(client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm) {    
if(args[1]  === "all" ) {

    var streamingCount = 0;
    var mutedCount = 0;
    var mutedMic = 0;
    var cameraCount =0;
    var connectedCount =0;

    const channels = message.guild.channels.cache.filter(c => c.type === 'voice');
    channels.forEach(c => {
        connectedCount += c.members.size;
        c.members.forEach(m => {
            if(m.voice.streaming) streamingCount++;
            if(m.voice.selfDeaf || m.voice.serverDeaf) mutedCount++;            
            if(m.voice.selfMute || m.voice.serverMute) mutedMic++;
            if(m.voice.selfVideo) cameraCount++;
        })
    })
    const voiceConnectedEmbed = new Discord.MessageEmbed()
    .setTitle(`Salons vocaux`)
    .setDescription(`<:speaker:1140579449243447346> En vocal : ${connectedCount}
<:mute:1140577634812690502> Muet : ${mutedMic}/${mutedCount}
<:mutecasque:1140579861019246622> Sourdine : ${mutedMic}/${mutedCount}
<:laptop:1140576986767556619> Partage écran : ${streamingCount}/${connectedCount}
<:camera_with_flash:1140575337097465956> Caméra : ${cameraCount}/${connectedCount}`)
    .setColor(color)
    .setTimestamp();

return message.channel.send(voiceConnectedEmbed);
} else if(!args[1]) {
            let embed = new Discord.MessageEmbed()
            .setTimestamp()
            .setTitle(`Salons vocaux`)
            .setDescription(`Il y a actuellement **${message.guild.members.cache.filter(m => m.voice.channel).size} ${message.guild.members.cache.filter(m => m.voice.channel).size  > 1 ? 'personnes' : 'personne'}** en vocal sur le serveur. `)
            .setColor(color)
         
              message.channel.send( embed) 
}
        
            
        }
  
    }  
      
        
    

    
    }
}