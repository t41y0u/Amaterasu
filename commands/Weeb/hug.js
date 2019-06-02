const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const request = require("request");

class Avatar extends Command {
    constructor (client) {
        super(client, {
            name: "hug",
            description: "Returns a hug.",
            category: "Weeb",
            usage: "hug <user>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            let member = message.mentions.members.first();
            request({url: 'https://nekos.life/api/hug', json: true}, (req, res, json) => {
                if (member) {
                    let embed = new RichEmbed()
                        .setColor(0x00FFFF)
                        .setTitle(`${message.author.tag} hugged ${member.user.tag}!`)
                        .setImage(json.url);
                    message.channel.send({embed});
                } else {
                    message.reply('you need to mention the user to hug!');
                }
            });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Avatar;