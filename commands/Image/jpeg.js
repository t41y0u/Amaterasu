const Command = require("../../util/Command.js");
const fetch = require("node-fetch");

class JPEG extends Command {
    constructor(client) {
        super(client, {
            name: "jpeg",
            description: "Needs more JPEG.",
            category: "Image",
            usage: "jpeg <image url>",
            aliases: ["jpegify"]
        });
    }

    async run(message, args, level) {
        const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : null;
        if (!url || !url.startsWith("http")) return this.client.embed("commonError", message, "You must provide a valid image URL to JPEGify.");
        message.channel.startTyping();
        fetch(`https://nekobot.xyz/api/imagegen?type=jpeg&url=${url}`)
            .then(res => res.json())
            .then(data => {
                if (!data.success) return this.client.embed("commonError", message, "An error occurred. Please ensure the URL you're providing is an image URL.");
                message.channel.stopTyping(true);
                return message.channel.send({ file: data.message });
            })
            .catch(err => {
                this.client.logger.error(err.stack);
                message.channel.stopTyping(true);
                return this.client.embed("APIError", message);
            });
    }
}

module.exports = JPEG;
