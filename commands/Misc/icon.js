const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");

class Icon extends Command {
    constructor(client) {
        super(client, {
            name: "icon",
            description: "Sends the current server's icon.",
            category: "Misc",
            usage: "icon",
            aliases: ["server-icon", "guild-icon"]
        });
    }

    async run(message, args, level) {
        try {
            if (!message.guild.available) return this.client.logger.info(`Guild "${message.guild.name}" (${message.guild.id}) is unavailable.`);
            const embed = new RichEmbed()
                .setTitle(`Server icon of ${message.guild.name}`)
                .setImage(message.guild.iconURL);
            message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Icon;