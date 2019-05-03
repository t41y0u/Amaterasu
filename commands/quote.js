const Command = require("../base/Command.js");
const fetch = require("node-fetch");

class Quote extends Command {
    constructor (client) {
        super(client, {
            name: "quote",
            description: "Fetch a random quote.",
            usage: "quote",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        fetch('https://quota.glitch.me/random')
        .then(response => response.json())
        .then(data => {
            message.channel.send({
                embed: {
                    color: 0x00FFFF,
                    fields: [{
                        name: `${data.quoteText}`,
                        value: `- ${data.quoteAuthor} -`
                    }]
                }
            });
        });
    }
}

module.exports = Quote;
