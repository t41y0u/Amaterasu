const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js")
const fetch = require("node-fetch");

class Quote extends Command {
    constructor (client) {
        super(client, {
            name: "quote",
            description: "Returns a random quote.",
            category: "Misc",
            usage: "quote",
            guildOnly: true
        });
    }

    async run (message, args, level) {
        try {
            fetch('https://quota.glitch.me/random')
                .then(response => response.json())
                .then(data => {
                    const embed = new RichEmbed().setColor(0x00FFFF).addField(`${data.quoteText}`, `- ${data.quoteAuthor} -`);
                    message.channel.send({embed});
                });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("APIError", message);
        }
    }
}

module.exports = Quote;
