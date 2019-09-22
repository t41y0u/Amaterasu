const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const ror = require("@spyte-corp/discord.js-remove-on-reaction");

class Anal extends Command {
    constructor (client) {
        super(client, {
            name: "anal",
            description: "Returns an anal picture.",
            category: "NSFW",
            usage: "anal",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            const embed = new RichEmbed().setColor(0x00FFFF);
            if (!message.channel.nsfw) {
                embed.setAuthor("🔞 NSFW").setDescription("Cannot display NSFW content in a SFW channel.");
                return message.channel.send({embed});
            }
            message.channel.startTyping();
            const anal = await this.client.nekoslife.nsfw.anal();
            embed.setImage(anal.url);
            message.channel.send({embed}).then(msg => { 
                ror(message, msg, true);
                msg.react("🗑");
            });
            message.channel.stopTyping(true);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Anal;
