const Command = require("../../util/Command.js");

class LMGTFY extends Command {
    constructor(client) {
        super(client, {
            name: "lmgtfy",
            description: "Why don't you just... Google it?",
            category: "Fun",
            usage: "lmgtfy <query>",
            aliases: ["googleit"]
        });
    }

    async run(message, args, level, settings) {
        try {
            const textQuery = args.join(" ");
            const query = encodeURIComponent(args.join(" "));
            const url = `https://lmgtfy.com/?q=${query}`;
            if (!query) return this.client.embed("commonError", message, "Please provide a query for me search from google.");
            else message.channel.send(`[${textQuery}](${url})`);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = LMGTFY;