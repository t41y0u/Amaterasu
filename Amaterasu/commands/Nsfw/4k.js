const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");
const ror = require("@spyte-corp/discord.js-remove-on-reaction");

class FourK extends Command {
    constructor (client) {
        super(client, {
            name: "4k",
            description: "Returns an 4k picture.",
            category: "NSFW",
            usage: "4k",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        const embed = new RichEmbed().setColor(0x00FFFF);
        if (!message.channel.nsfw) {
            embed.setAuthor("🔞 NSFW").setDescription("Cannot display NSFW content in a SFW channel.");
            return message.channel.send({embed});
        }
        message.channel.startTyping();
        fetch(`https://nekobot.xyz/api/image?type=4k`)
            .then(res => res.json())
            .then(data => {
                embed.setImage(data.message);
                message.channel.send({embed}).then(msg => { 
                    ror(message, msg, true);
                    msg.react("🗑");
                });
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            });
        message.channel.stopTyping(true);
    }
}

module.exports = FourK;