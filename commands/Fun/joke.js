const Command = require("../../util/Command.js");
const { RichEmbed } = require("discord.js");
const fetch = require("node-fetch");

class Joke extends Command {
    constructor(client) {
        super(client, {
            name: "joke",
            description: "Tells a general or programming-related joke.",
            category: "Fun",
            usage: "joke",
            aliases: ["humour", "humor"]
        });
    }

    async run(message, args, level, settings, texts) {
        const embed = new RichEmbed().setColor(0x00FFFF)
        fetch("https://official-joke-api.appspot.com/random_joke")
            .then(res => res.json())
            .then(data => {
                embed.setTitle(`${data.setup} ${data.punchline}`)
                message.channel.send({embed}).then(msg => msg.react('😂'));
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                return this.client.embed("APIError", message);
            });
    }
}

module.exports = Joke;
