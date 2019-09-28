const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Kiss extends Command {
    constructor (client) {
        super(client, {
            name: "kiss",
            description: "Kiss an user or get kissed!",
            category: "Weeb",
            usage: "kiss [user]",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            let member = message.mentions.members.first();
            if (member) {
                await this.client.nekoslife.sfw.kiss().then(json => {
                    if (member === message.author) {
                        let embed = new RichEmbed()
                            .setColor(0x00FFFF)
                            .setTitle(`Oh, you are kissing yourself? Well, let me kiss you instead!`)
                            .setImage(json.url);
                        return message.channel.send({embed});
                    } else if (member === this.client.user) {
                        let embed = new RichEmbed()
                            .setColor(0x00FFFF)
                            .setTitle(`Oh, you are kissing me? My lips are cold! 😳`)
                        return message.channel.send({embed});
                    }
                    let embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setTitle(`${message.author.tag} kissed ${member.user.tag}!`)
                        .setImage(json.url);
                    message.channel.send({embed});
                });
            } else {
                let embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setTitle(`${message.author.tag} got kissed!`)
                    .setImage(json.url);
                message.channel.send({embed});
            }
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Kiss;