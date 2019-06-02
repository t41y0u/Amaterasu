const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class FoxGirl extends Command {
    constructor (client) {
        super(client, {
            name: "foxgirl",
            description: "Returns a cute foxgirl.",
            category: "Weeb",
            usage: "foxgirl",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            message.channel.startTyping();
            let foxgirl = await this.client.nekoslife.sfw.foxGirl();
            const embed = new RichEmbed().setColor(0x00FFFF).setImage(foxgirl.url);
            const msg = await message.channel.send({embed});
            msg.react("❤");
            message.channel.stopTyping(true);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = FoxGirl;
