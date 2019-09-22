const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js")

class ChannelID extends Command {
    constructor(client) {
        super(client, {
            name: "channelid",
            description: "Returns the ID of the current channel.",
            category: "Information",
            usage: "channelid",
            aliases: ["channel-id", "cid"]
        });
    }

    async run(message, args, level) {
        try {
            const embed = new RichEmbed().setColor(0x00FFFF).setTitle(`This channel (${message.channel}) has an ID of \`${message.channel.id}\`.`);
            message.channel.send({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = ChannelID;