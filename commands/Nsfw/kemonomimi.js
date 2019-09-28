const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const ror = require("@spyte-corp/discord.js-remove-on-reaction");

class Kemonomimi extends Command {
    constructor (client) {
        super(client, {
            name: "kemonomimi",
            description: "Returns a kemonomimi picture.",
            category: "NSFW",
            usage: "kemonomimi",
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
            const kemonomimi = await this.client.nekoslife.nsfw.kemonomimi();
            embed.setImage(kemonomimi.url);
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

module.exports = Kemonomimi;
