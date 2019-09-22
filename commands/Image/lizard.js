const Command = require("../../util/Command.js");
const fetch = require("node-fetch");

class Lizard extends Command {
    constructor(client) {
        super(client, {
            name: "lizard",
            description: "Sends a random image of a lizard.",
            category: "Image",
            usage: "lizard"
        });
    }

    async run(message, args, level, settings, texts) {
        message.channel.startTyping();
        fetch("https://nekos.life/api/v2/img/lizard")
            .then(res => res.json())
            .then(data => message.channel.send({ file: data.url }))
            .catch(err => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            });
        message.channel.stopTyping(true);
    }
}

module.exports = Lizard;