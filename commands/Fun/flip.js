const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

class Flip extends Command {
    constructor(client) {
        super(client, {
            name: "flip",
            description: "Flips/tosses a coin.",
            category: "Fun",
            usage: "flip",
            guildOnly: true,
            aliases: ["toss"]
        });
    }

    async run(message, args, level) {
        try {
            const coinFlip = () => (Math.floor(Math.random() * 2) == 0) ? "heads" : "tails";
            const flip = coinFlip();
            const embed = new RichEmbed().setAuthor(`This flip's result was **${flip}**!`, flip === "heads" ? `https://delet.js.org/imgstore/currency/USD/USDheads.png` : `https://delet.js.org/imgstore/currency/USD/USDtails.png`)
            return message.channel.send({ embed });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Flip;
