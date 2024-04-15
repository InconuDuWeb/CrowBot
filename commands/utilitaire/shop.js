const Discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageMenuOption, MessageMenu } = require('discord-buttons');

module.exports = {
    name: 'menu',
    aliases: [],
    run: async (client, message, args, prefix, color) => {

        // Créez une option de menu "Bonjour"
        const menuOption = new MessageMenuOption()
            .setLabel("Bot D'autentification")
            .setEmoji("1164915391886270577")
            .setValue("hello_option")
            .setDefault();

        const interactiveMenu = new MessageMenu()
            .setID(message.id + 'MenuSelection')
            .setMaxValues(1)
            .setMinValues(1)
            .setPlaceholder('Faites un choix')
            .addOption(menuOption);

        const embed = new Discord.MessageEmbed()
            .setColor(color)
            .setTitle("Message de bienvenue")
            .setDescription("Cliquez sur une option du menu pour dire bonjour en mode éphémère.");

        message.channel.send({
            embed: embed,
            components: [
                {
                    type: 1,
                    components: [interactiveMenu]
                }
            ]
        }).then(async (m) => {

            // Répondez en mode éphémère lorsque l'option "Bonjour" est cliquée
            client.on('clickMenu', async (menu) => {
                if (menu.values[0] === "hello_option") {
                    const embedResponse = new Discord.MessageEmbed()
                    .setColor(color)
                    .setTitle("Service de Bot D'autentification <:0060_bot:1164915391886270577>")
                    .setThumbnail("https://cdn.discordapp.com/icons/1153726635028271247/a733cfdf4072921d7e5d3ca464b61309.webp")
                    .setDescription("**`🤖`[ BOTS ]**\n> <#1153804619026276402> \n> <#1153728175797436496> \n\n**`💰` [ PRICE]**\n> **1 mois <:1001619862533177456:1153804324019904594> 4€**\n> **3 mois <:1001619862533177456:1153804324019904594> 10€** \n> **6 mois <:1001619862533177456:1153804324019904594> 20€**\n\n**__Si vous souhaitez un bot Oauth2 allez contactez <@1149803900254298284> en <#1153734960927211583> __**")
                
                    menu.reply.send(embedResponse, true);
                }
            });
        });
    }
}
