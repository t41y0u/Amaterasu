const Command = require("../../util/Command.js");
const  { RichEmbed } = require("discord.js");

class Roll extends Command {
    constructor(client) {
        super(client, {
            name: "roll",
            description: "Rolls a regular six-sided dice.",
            category: "Fun",
            usage: "roll",
            aliases: ["dice"]
        });
    }

    async run(message, args, level) {
        try {
            const msg = await message.channel.send(`🎲 Rolling ...`);
            const replies = ["One", "Two", "Three", "Four", "Five", "Six"];
            const result = Math.floor((Math.random() * replies.length));
            const embed = new RichEmbed()
                .setColor(0x00FFFF)
                .setAuthor("🎲 A dice has been rolled!")
                .setDescription(`Rolled By: ${message.author.tag}\nResult: ${replies[result]}`);
            msg.edit({embed});
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Roll;
