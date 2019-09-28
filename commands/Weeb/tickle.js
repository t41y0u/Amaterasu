const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Tickle extends Command {
    constructor (client) {
        super(client, {
            name: "tickle",
            description: "Tickle an user or get tickled!",
            category: "Weeb",
            usage: "tickle [user]",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            let member = message.mentions.members.first();
            if (member) {
                await this.client.nekoslife.sfw.tickle().then(json => {
                    if (member === message.author) {
                        let embed = new RichEmbed()
                            .setColor(0x00FFFF)
                            .setTitle(`How can you tickle yourself? Let me tickle you instead!`)
                            .setImage(json.url);
                        return message.channel.send({embed});
                    } else if (member === this.client.user) {
                        let embed = new RichEmbed()
                            .setColor(0x00FFFF)
                            .setTitle(`Oh, you are tickling me? Well no sir!`)
                        return message.channel.send({embed});
                    }
                    let embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setTitle(`${message.author.tag} tickled ${member.user.tag}!`)
                        .setImage(json.url);
                    message.channel.send({embed});
                });
            } else {
                let embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setTitle(`${message.author.tag} got tickled!`)
                    .setImage(json.url);
                message.channel.send({embed});
            }
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Tickle;