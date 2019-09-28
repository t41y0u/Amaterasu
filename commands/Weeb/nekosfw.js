const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class NekoSFW extends Command {
    constructor (client) {
        super(client, {
            name: "nekosfw",
            description: "Returns a cute sfw neko. Nyann ~",
            category: "Weeb",
            usage: "nekosfw",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            message.channel.startTyping();
            let neko = await this.client.nekoslife.sfw.neko();
            const embed = new RichEmbed().setColor(0x00FFFF).setImage(neko.url);
            const msg = await message.channel.send({embed});
            msg.react("❤");
            message.channel.stopTyping(true);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = NekoSFW;
