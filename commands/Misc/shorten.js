const Command = require("../../util/Command.js");
const shortener = require("isgd");

class Shorten extends Command {
    constructor(client) {
        super(client, {
            name: "shorten",
            description: "Shortens the specified link.",
            category: "Misc",
            usage: "shorten <URL> [custom title]",
            aliases: ["isgd", "urlshortner", "shorten-url"]
        });
    }

    async run(message, args, level) {
        if (!args[0]) return this.client.embed("commonError", message, "Please provide a link to shorten.");
        if (!args[1]) {
            shortener.shorten(args[0], function(res) {
                if (res.startsWith("Error:")) return this.client.embed("commonError", message, "Invalid URL provided.");
                message.channel.send(`Your shortened link: **<${res}>**.`);
            });
        } else {
            shortener.custom(args[0], args[1], function(res) {
                if (res.startsWith("Error:")) {
                    this.client.logger.error(res.slice(7));
                    return this.client.embed("", message);
                }
                message.channel.send(`Your shortened link: **<${res}>**.`);
            });
        }
    }
}

module.exports = Shorten;
