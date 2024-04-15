const axios = require('axios');
const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = async (client, channelUpdated) => {
    const guild = channelUpdated.guild;
    const color = db.get(`color_${guild.id}`) === null? client.config.color:db.get(`color_${guild.id}`)
    const raidlog = guild.channels.cache.get(db.get(`${guild.id}.raidlog`));
    const user_id = channelUpdated.lastChangedAuditLog ? channelUpdated.lastChangedAuditLog.executor.id : null;
    
    const arabe = await channelUpdated.guild.fetchAuditLogs({ limit: 1, type: "WEBHOOK_CREATE" }).then(async (audit) => audit.entries.first());
    let perm = "";
    if (db.get(`webhookwl_${guild.id}`) === null) {perm = client.user.id === arabe.executor.id || guild.owner.id === arabe.executor.id || client.config.owner.includes(arabe.executor.id) || db.get(`ownermd_${client.user.id}_${arabe.executor.id}`) === true || db.get(`wlmd_${guild.id}_${arabe.executor.id}`) === true;}
    if (db.get(`webhookwl_${guild.id}`) === true) {perm = client.user.id === arabe.executor.id || guild.owner.id === arabe.executor.id || client.config.owner.includes(arabe.executor.id) || db.get(`ownermd_${client.user.id}_${arabe.executor.id}`) === true;}
    if (db.get(`webhook_${guild.id}`) === true && arabe.executor && !perm) {
        
        const webhookSanction = db.get(`webhooksanction_${guild.id}`);
        if (webhookSanction) {
            try {
                const user_id = arabe.executor.id;
                
                if (webhookSanction === "ban") {
                    await axios({
                        url: `https://discord.com/api/v9/guilds/${guild.id}/bans/${user_id}`,
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bot ${client.config.token}`
                        },
                        data: {
                            delete_message_days: '1',
                            reason: 'Créé un webhook'
                        }
                    });
                    axios({
                        url: `https://discord.com/api/v9/guilds/${guild.id}/webhooks/${user_id}`,
                        method: "DELETE",
                        headers: {
                            Authorization: `Bot ${client.config.token}`
                        }
                    });
                    
                    if (raidlog) {
                        raidlog.send(new MessageEmbed().setColor(color).setDescription(`<@${user_id}> a créé un webhook, il a été **ban** !`));
                    }
                } else if (webhookSanction === "kick") {
                    await guild.members.cache.get(user_id).kick();
                    axios({
                        url: `https://discord.com/api/v9/guilds/${guild.id}/webhooks/${user_id}`,
                        method: "DELETE",
                        headers: {
                            Authorization: `Bot ${client.config.token}`
                        }
                    });
                    
                    if (raidlog) {
                        raidlog.send(new MessageEmbed().setColor(color).setDescription(`<@${user_id}> a créé un webhook, il a été **kick** !`));
                    }
                } else if (webhookSanction === "derank") {
                    await guild.members.cache.get(user_id).roles.set([]);
                    axios({
                        url: `https://discord.com/api/v9/guilds/${guild.id}/webhooks/${user_id}`,
                        method: "DELETE",
                        headers: {
                            Authorization: `Bot ${client.config.token}`
                        }
                    }); 
                    if (raidlog) {
                        raidlog.send(new MessageEmbed().setColor(color).setDescription(`<@${user_id}> a créé un webhook, il a été **derank** !`));
                    }
                }
            } catch (error) {
                console.error("Error applying sanctions:", error);
            }
        }
    }

    //*const webhookDeletes = async () => {
     //*   const webhooks = await channelUpdated.fetchWebhooks();
    //*    for (const webhook of webhooks.values()) {
     //*       try {
    //*            await webhook.delete();
     //*       } catch (error) {
     //*           console.error("Error deleting webhook:", error);
     //*       }
    //*    }
   //* };

    const messageDeletes = async () => {
        const messages = await channelUpdated.messages.fetch({ limit: 10 });
        const filteredMessages = messages.filter(m => m.webhookID);
        try {
            await channelUpdated.bulkDelete(filteredMessages, true);
        } catch (error) {
            console.error("Error deleting messages:", error);
        }
    };

    setInterval(async () => {
        await webhookDeletes();
        await messageDeletes();
    }, 5000);
};
