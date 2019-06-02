const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

class Message extends Command {
    constructor(client) {
        super(client, {
            name: "message",
            description: "Quotes the specified message (by ID).",
            category: "Misc",
            usage: "fetch <message ID>",
            guildOnly: true
        });
    }

    async run(message, args, level, settings, texts) {
        const id = args[0];
        if (!id) return this.client.embed("commonError", message, `You must provide a message ID.\nTo do so, you need to have developer mode turned on to obtain a message ID (Settings → Appearance → Developer Mode).\nThen, upon right-clicking a message, you'll be presented with an option called "Copy ID".`);
        message.channel.fetchMessage(id)
            .then(message => {
                const embed = new RichEmbed()
                    .setColor(0x00FFFF)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL)
                    .setDescription(message.content)
                    .setFooter(`#${message.channel.name}`)
                    .setTimestamp();
                message.channel.send({embed});
            })
            .catch(error => {
                if (error.code === 10008) return message.channel.send("Unknown message. Please ensure the message ID is from a message in this channnel.");
                this.client.logger.error(err.stack);
                return this.client.embed("", message);
            });
    }
}

module.exports = Message;
