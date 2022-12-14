const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const client = require('../..');

client.on('messageCreate', async(message) => {
    if(!message.guild.members.resolve(client.user).permissions.any("MANAGE_WEBHOOKS")){
        return;
    };
    
    if(message.channel.id !== "617360020459225138") return;
    if(!message.content.startsWith(':') && !message.content.endsWith(':')) return;
    let sorted = message.content.split(':').slice().join('');

    client.guilds.cache.forEach(async g => {
        let emote = g.emojis.cache.find(e => e.name.toLowerCase() == sorted.toLowerCase())

        if(!emote) return;

        // Fetch guild webhooks
        const hooks = await message.channel.fetchWebhooks();
        const webHook = hooks.find(i => i.owner.id == client.user.id);

        // Create a webhook and send the embed
        if(!webHook){
            message.channel.createWebhook(client.user.username, {
                avatar: "https://media.discordapp.net/attachments/959188995898740756/980536793634066442/crimson.png?width=427&height=427"
            })
            .then(async web => {
                await web.send({content: emote.toString(), username: message.author.username, avatarURL: message.author.displayAvatarURL({dynamic: true, size: 1024, format: 'png'})})
                .catch(err => {
                    return console.log(err.stack)
                })
            })
        }
        else {
            await webHook.send({content: emote.toString(), username: message.author.username, avatarURL: message.author.displayAvatarURL({dynamic: true, size: 1024, format: 'png'})})
            .catch(err => {
                return console.log(err.stack)
            })
        }

        message.delete().catch(err => {return console.log(err.stack)})
    })
});