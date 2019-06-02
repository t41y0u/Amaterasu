const Command = require("../../util/Command.js");
const fetch = require("node-fetch");

class Image extends Command {
    constructor(client) {
      super(client, {
        name: "image",
        description: "Returns a random image.",
        category: "Image",
        usage: "image [size (e.g. 1920x1080)]",
        aliases: ["randomimage", "random-image"]
      });
    }

    async run(message, args, level) {
        let size = args[0];
        if (!args[0]) size = "";
        message.channel.startTyping();
        fetch(`https://source.unsplash.com/random/${size}`)
            .then(res => message.channel.send({ files: [{ attachment: res.body, name: "image.jpg" }] })
            .catch(err => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            }));
        message.channel.stopTyping(true);
    }
}

module.exports = Image;
