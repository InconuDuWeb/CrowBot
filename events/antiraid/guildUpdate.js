const axios = require('axios');
const db = require("quick.db");
const { MessageEmbed } = require("discord.js");
const request = require("request");

module.exports = async (client, oldGuild, newGuild) => {
    try {
        const guild = oldGuild;
        const color = db.get(`color_${guild.id}`) || client.config.color;
        
        const response = await axios.get(`https://discord.com/api/v9/guilds/${guild.id}/audit-logs?limit=1&action_type=1`, {
            headers: {
                Authorization: `Bot ${client.config.token}`
            }
        });
        
        const raidlog = guild.channels.cache.get(db.get(`${guild.id}.raidlog`));
        
        if (response.data && response.data.audit_log_entries[0].user_id) {
            const userId = response.data.audit_log_entries[0].user_id;
            const isBotOwner = client.config.owner.includes(userId);
            const isGuildOwner = guild.owner.id === userId;
            const isWhiteListed = db.get(`ownermd_${client.user.id}_${userId}`) === true || db.get(`wlmd_${guild.id}_${userId}`) === true;
            const isAuthorized = isBotOwner || isGuildOwner || isWhiteListed;
            
            if (db.get(`update_${guild.id}`) === true && !isAuthorized) {
                if (db.get(`updatesanction_${guild.id}`) === "ban") {
                    try {
                        await axios({
                            url: `https://discord.com/api/v9/guilds/${guild.id}/bans/${userId}`,
                            method: 'PUT',
                            headers: {
                                Authorization: `Bot ${client.config.token}`
                            },
                            data: {
                                delete_message_days: 1,
                                reason: 'Antichannel'
                            }
                        });

                        update(oldGuild, newGuild);
                        if (raidlog) {
                            raidlog.send(new MessageEmbed().setColor(color).setDescription(`<@${userId}> a modifié le serveur, il a été **ban** !`));
                        }
                    } catch (error) {
                        update(oldGuild, newGuild);
                        if (raidlog) {
                            raidlog.send(new MessageEmbed().setColor(color).setDescription(`<@${userId}> a modifié le serveur, mais il n'a pas pu être **ban** !`));
                        }
                    }
                } else if (db.get(`updatesanction_${guild.id}`) === "kick") {
                    try {
                        const member = guild.members.cache.get(userId);
                        if (member) {
                            await member.kick();
                            update(oldGuild, newGuild);
                            if (raidlog) {
                                raidlog.send(new MessageEmbed().setColor(color).setDescription(`<@${userId}> a modifié le serveur, il a été **kick** !`));
                            }
                        }
                    } catch (error) {
                        update(oldGuild, newGuild);
                        if (raidlog) {
                            raidlog.send(new MessageEmbed().setColor(color).setDescription(`<@${userId}> a modifié le serveur, mais il n'a pas pu être **kick** !`));
                            }
                        }
                    } else if (db.get(`updatesanction_${guild.id}`) === "derank") {
                        try {
                            const member = guild.members.cache.get(userId);
                            if (member) {
                                await member.roles.set([]);
                                update(oldGuild, newGuild);
                                if (raidlog) {
                                    raidlog.send(new MessageEmbed().setColor(color).setDescription(`<@${userId}> a modifié le serveur, il a été **derank** !`));
                                }
                            }
                        } catch (error) {
                            update(oldGuild, newGuild);
                            if (raidlog) {
                                raidlog.send(new MessageEmbed().setColor(color).setDescription(`<@${userId}> a modifié le serveur, mais il n'a pas pu être **derank** !`));
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }

async function update(oldGuild, newGuild) {
        
    if (oldGuild.name === newGuild.name) {

    } else {
        await newGuild.setName(oldGuild.name)

    }
    if (oldGuild.iconURL({ dynamic: true }) === newGuild.iconURL({ dynamic: true })) {

    } else {
        await newGuild.setIcon(oldGuild.iconURL({ dynamic: true }))

    }
    if (oldGuild.bannerURL() === newGuild.bannerURL()
    ) {

    } else {
        await newGuild.setBanner(oldGuild.bannerURL())

    }
    if (oldGuild.position === newGuild.position
    ) {

    } else {
        await newGuild.setChannelPositions([{ channel: oldGuild.id, position: oldGuild.position }])

    }

    if (oldGuild.systemChannel === newGuild.systemChannel
    ) {

    } else {
        await newGuild.setSystemChannel(oldGuild.systemChannel)

    }
    if (oldGuild.systemChannelFlags === newGuild.systemChannelFlags
    ) {

    } else {
        await newGuild.setSystemChannelFlags(oldGuild.systemChannelFlags)


    }
    if (oldGuild.verificationLevel === newGuild.verificationLevel
    ) {

    } else {
        await newGuild.setVerificationLevel(oldGuild.verificationLevel)


    }
    if (oldGuild.widget === newGuild.widget
    ) {

    } else {
        await newGuild.setWidget(oldGuild.widget)


    }
    if (oldGuild.splashURL === newGuild.splashURL
    ) {

    } else {
        await newGuild.setSplash(oldGuild.splashURL)


    }
    if (oldGuild.rulesChannel === newGuild.rulesChannel
    ) {

    } else {
        await newGuild.setRulesChannel(oldGuild.rulesChannel)


    }
    if (oldGuild.publicUpdatesChannel === newGuild.publicUpdatesChannel
    ) {

    } else {
        await newGuild.setPublicUpdatesChannel(oldGuild.publicUpdatesChannel)


    }
    if (oldGuild.defaultMessageNotifications === newGuild.defaultMessageNotifications
    ) {

    } else {
        await newGuild.setDefaultMessageNotifications(oldGuild.defaultMessageNotifications)


    }
    if (oldGuild.afkChannel === newGuild.afkChannel
    ) {

    } else {
        await newGuild.setAFKChannel(oldGuild.afkChannel)


    }
    if (oldGuild.region === newGuild.region
    ) {

    } else {
        await newGuild.setRegion(oldGuild.region)


    }

    if (oldGuild.afkTimeout === newGuild.afkTimeout
    ) {

    } else {
        await newGuild.setAFKTimeout(oldGuild.afkTimeout)

    }
    if (oldGuild.vanityURLCode === newGuild.vanityURLCode
    ) {
        const settings = {
            url: `https://discord.com/api/v6/guilds/${oldGuild.id}/vanity-url`,
            body: {
                code: oldGuild.vanityURLCode
            },
            json: true,
            method: 'PATCH',
            headers: {
                "Authorization": `Bot ${client.config.token}`
            }
        };
        await request(settings, (err, res, body) => {
            if (err) {
                return;
            }
        });
    }
}

