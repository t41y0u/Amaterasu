const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Cuddle extends Command {
    constructor (client) {
        super(client, {
            name: "cuddle",
            description: "Cuddle an user or get cuddled!",
            category: "Weeb",
            usage: "cuddle [user]",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            let member = message.mentions.members.first();
            if (member) {
                await this.client.nekoslife.sfw.cuddle().then(json => {
                    if (member === message.author) {
                        let embed = new RichEmbed()
                            .setColor(0x00FFFF)
                            .setTitle(`Oh, you are cuddling yourself? Let me cuddle you instead!`)
                            .setImage(json.url);
                        return message.channel.send({embed});
                    } else if (member === this.client.user) {
                        let embed = new RichEmbed()
                            .setColor(0x00FFFF)
                            .setTitle(`Oh, you are cuddling me? O... O... Ok!`)
                        return message.channel.send({embed});
                    }
                    let embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setTitle(`${message.author.tag} cuddled ${member.user.tag}!`)
                        .setImage(json.url);
                    message.channel.send({embed});
                });
            } else {
                let embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setTitle(`${message.author.tag} got cuddled!`)
                    .setImage(json.url);
                message.channel.send({embed});
            }
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Cuddle;