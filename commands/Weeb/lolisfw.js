const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class LoliSFW extends Command {
    constructor (client) {
        super(client, {
            name: "lolisfw",
            description: "Returns a SFW loli.",
            category: "Weeb",
            usage: "lolsfw",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            message.channel.startTyping();
            const loli = await this.client.lolislife.getSFWLoli();
            const embed = new RichEmbed().setColor(0x00FFFF).setImage(loli.url);
            const msg = await message.channel.send({embed});
            msg.react("❤");
            message.channel.stopTyping(true);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = LoliSFW;
