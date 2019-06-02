const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Baka extends Command {
    constructor (client) {
        super(client, {
            name: "baka",
            description: "Returns a baka.",
            category: "Weeb",
            usage: "baka",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            message.channel.startTyping();
            let baka = await this.client.nekoslife.sfw.baka();
            const embed = new RichEmbed().setColor(0x00FFFF).setImage(baka.url);
            message.channel.send({embed});
            message.channel.stopTyping(true);
        } catch (err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Baka;
