const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const ror = require("@spyte-corp/discord.js-remove-on-reaction");

class LoliNSFW extends Command {
    constructor (client) {
        super(client, {
            name: "lolinsfw",
            description: "Returns a NSFW loli.",
            category: "Weeb",
            usage: "lolinsfw",
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
            const loli = await this.client.lolislife.getNSFWLoli();
            embed.setImage(loli.url);
            message.channel.send({embed}).then(msg => { 
                ror(message, msg, true);
                msg.react("🗑");
            });
            message.channel.stopTyping(true);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        };
    }
}

module.exports = LoliNSFW;
