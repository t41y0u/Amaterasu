const Command = require("../../util/Command.js");

class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            description: "Repeats your message.",
            category: "Fun",
            usage: "say [tts] <message>",
            aliases: ["repeat", "echo"]
        });
    }

    async run(message, args, level, settings) {
        try {
            const msg = args.join(" ");
            if (!msg) return this.client.embed("commonError", message, "Please provide something for me to repeat.");
            if (args[0].toLowerCase() === "tts" && !args[1]) return this.client.embed("commonError", message, "Please provide something for me repeat.");
            message.delete().catch(O_o=>{});
            message.channel.send(args[0].toLowerCase() === "tts" ? msg.slice(4) : msg, { tts: args[0].toLowerCase() === "tts" ? true : false });
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Say;