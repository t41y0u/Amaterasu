const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js")
const fetch = require("node-fetch");

class DadJoke extends Command {
    constructor(client) {
        super(client, {
            name: "dadjoke",
            description: "Sends a random dad joke.",
            category: "Fun",
            usage: "dadjoke",
            aliases: ["dad", "dadj", "badjoke"]
        });
    }

    async run(message, args, level) {
        const embed = new RichEmbed().setColor(0x00FFFF)
        const meta = { "Accept": "text/plain" };
        fetch("https://icanhazdadjoke.com/", { headers: meta })
            .then(res => res.text())
            .then(body => {
                embed.setTitle(body);
                message.channel.send({embed}).then(msg => msg.react('😂'));
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                return this.client.embed("APIError", message);
            });
    }
}

module.exports = DadJoke;
