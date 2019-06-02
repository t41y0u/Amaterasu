const Command = require("../../util/Command.js");
const fetch = require("node-fetch");

class Dog extends Command {
    constructor(client) {
        super(client, {
            name: "dog",
            description: "Sends a random image of a dog.",
            category: "Image",
            usage: "dog"
        });
    }

    async run(message, args, level) {
        message.channel.startTyping();
        fetch("https://dog.ceo/api/breeds/image/random")
            .then(res => res.json())
            .then(data => message.channel.send({ file: data.message }))
            .catch(err => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            });
        message.channel.stopTyping(true);
    }
}

module.exports = Dog;