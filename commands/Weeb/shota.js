const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Shota extends Command {
    constructor (client) {
        super(client, {
            name: "shota",
            description: "Returns a ~~cute~~ shota.",
            category: "Weeb",
            usage: "shota",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        try {
            message.channel.startTyping();
            let shota = await this.client.lolislife.getSFWShota();
            const embed = new RichEmbed().setColor(0x00FFFF).setImage(shota.url);
            message.channel.send({embed});
            message.channel.stopTyping(true);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Shota;
