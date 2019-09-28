const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const ror = require("@spyte-corp/discord.js-remove-on-reaction");

class Feet extends Command {
    constructor (client) {
        super(client, {
            name: "feet",
            description: "Returns a feet picture.",
            category: "NSFW",
            usage: "feet",
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
            const feet = await this.client.nekoslife.nsfw.feet();
            embed.setImage(feet.url);
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

module.exports = Feet;
