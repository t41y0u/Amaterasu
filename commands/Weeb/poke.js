const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Poke extends Command {
    constructor (client) {
        super(client, {
            name: "poke",
            description: "Poke an user or get poked!",
            category: "Weeb",
            usage: "poke [user]",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            let member = message.mentions.members.first();
            if (member) {
                await this.client.nekoslife.sfw.poke().then(json => {
                    if (member === message.author) {
                        let embed = new RichEmbed()
                            .setColor(0x00FFFF)
                            .setTitle(`Why are you poking yourself? Let me poke you instead!`)
                            .setImage(json.url);
                        return message.channel.send({embed});
                    } else if (member === this.client.user) {
                        let embed = new RichEmbed()
                            .setColor(0x00FFFF)
                            .setTitle(`Oh, you are poking me? Well no sir!`)
                        return message.channel.send({embed});
                    }
                    let embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setTitle(`${message.author.tag} poked ${member.user.tag}!`)
                        .setImage(json.url);
                    message.channel.send({embed});
                });
            } else {
                let embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setTitle(`${message.author.tag} got poked!`)
                    .setImage(json.url);
                message.channel.send({embed});
            }
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Poke;