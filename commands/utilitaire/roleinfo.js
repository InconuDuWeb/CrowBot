const Discord = require('discord.js')
const db = require('quick.db')
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');
const axios = require('axios')

module.exports = {
    name: 'roleinfo',
    aliases: ['role'],
    description: 'role <rôle>',
    run: async (client, message, args, prefix, color) => {

        let perm = ""
        message.member.roles.cache.forEach(role => {
            if(db.get(`ownerp_${message.guild.id}_${role.id}`)) perm = true
            if(db.get(`admin_${message.guild.id}_${role.id}`)) perm = true
        })
        if(client.config.owner.includes(message.author.id) || db.get(`ownermd_${client.user.id}_${message.author.id}`) === true || perm || db.get(`channelpublic_${message.guild.id}_${message.channel.id}`) === true ) { 

            function roleperm(role) {
                if (role.permissions.has("ADMINISTRATOR")) {
                    return [`Administrateur`];
                } else {
                    return role.permissions.toArray().map(p => {
                        switch (p) {
                            case "CREATE_INSTANT_INVITE":
                                return "Créer des invitations";
                            case "KICK_MEMBERS":
                                return "Expulser des membres";
                            case "BAN_MEMBERS":
                                return "Bannir des membres";
                            case "MANAGE_CHANNELS":
                                return "Gérer les salons";
                            case "MANAGE_GUILD":
                                return "Gérer le serveur";
                            case "ADD_REACTIONS":
                                return "Ajouter des réactions";
                            case "VIEW_AUDIT_LOG":
                                return "Voir les logs d'audit";
                            case "PRIORITY_SPEAKER":
                                return "Haut-parleur prioritaire";
                            case "STREAM":
                                return "Partager un écran en direct";
                            case "VIEW_CHANNEL":
                                return "Voir le salon";
                            case "SEND_MESSAGES":
                                return "Envoyer des messages";
                            case "SEND_TTS_MESSAGES":
                                return "Envoyer des messages TTS";
                            case "MANAGE_MESSAGES":
                                return "Gérer les messages";
                            case "EMBED_LINKS":
                                return "Intégrer des liens";
                            case "ATTACH_FILES":
                                return "Joindre des fichiers";
                            case "READ_MESSAGE_HISTORY":
                                return "Lire l'historique des messages";
                            case "USE_EXTERNAL_EMOJIS":
                                return "Utiliser des émojis externes";
                            case "CONNECT":
                                return "Se connecter en vocal";
                            case "SPEAK":
                                return "Parler en vocal";
                            case "MUTE_MEMBERS":
                                return "Muter des membres";
                            case "DEAFEN_MEMBERS":
                                return "Rendre sourd des membres";
                            case "MOVE_MEMBERS":
                                return "Déplacer des membres";
                            case "USE_VAD":
                                return "Utiliser la détection de voix";
                            case "CHANGE_NICKNAME":
                                return "Changer de pseudonyme";
                            case "MANAGE_NICKNAMES":
                                return "Gérer les pseudonymes";
                            // Ajoutez les autres permissions ici
                            default:
                                return p.replace("_", " ");
                        }
                    });
                }
            }

            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

            if (!role) {
                return message.channel.send("Veuillez mentionner un rôle valide !");
            }
            let botAvatar = client.user.displayAvatarURL();
            const roleEmbed = new Discord.MessageEmbed()
                .setColor(color)
                .setTitle('Information du rôle')
                .setDescription(`➔ **Information sur le rôle**\n> **• Rôle :** ${role}\n> **• Nom :** ${role.name}\n> **• ID :** ${role.id}\n> **• Couleur :** ${role.hexColor === '#000000' ? 'Classique' : role.hexColor}\n> **• Visibilité :** ${role.hoist ? 'Oui' : 'Non'}\n> **• Utilisateurs :** ${role.members.size}\n> **• Mentionable :** ${role.mentionable ? 'Oui' : 'Non'}\n> **• Position :** ${role.position}/${message.guild.roles.cache.size}\n> **• Créé le :** <t:${Math.floor(role.createdAt.getTime() / 1000)}:d> (<t:${Math.floor(role.createdAt.getTime() / 1000)}:f>) | Il y a ${Math.floor((Date.now() - role.createdAt.getTime()) / 86400000)} jour(s)\n> **• Permissions :** ${roleperm(role).join("\n")}`)
                .setFooter(`${client.user.username}`, botAvatar)
                .setTimestamp();

            message.channel.send(roleEmbed);
        }
    }
};
