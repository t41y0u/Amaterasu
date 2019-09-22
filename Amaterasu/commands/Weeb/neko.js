const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Neko extends Command {
    constructor (client) {
        super(client, {
            name: "neko",
            description: "Returns a cute neko. Nyann ~",
            category: "Weeb",
            usage: "neko",
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

module.exports = Neko;
