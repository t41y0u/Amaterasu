const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Smug extends Command {
    constructor (client) {
        super(client, {
            name: "smug",
            description: "Returns a smug.",
            category: "Weeb",
            usage: "smug",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            message.channel.startTyping();
            let smug = await this.client.nekoslife.sfw.smug();
            const embed = new RichEmbed().setColor(0x00FFFF).setImage(smug.url);
            message.channel.send({embed});
            message.channel.stopTyping(true);
        } catch (err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Smug;
