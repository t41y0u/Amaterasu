const Command = require("../../util/Command.js");
const fetch = require("node-fetch");

class Cat extends Command {
    constructor(client) {
        super(client, {
            name: "cat",
            description: "Sends a random image of a cat.",
            category: "Image",
            usage: "cat"
        });
    }

    async run(message, args, level) {
        message.channel.startTyping();
        fetch("https://aws.random.cat/meow")
            .then(res => res.json())
            .then(data => message.channel.send({ file: data.file }))
            .catch(err => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            });
        message.channel.stopTyping(true);
    }
}

module.exports = Cat;