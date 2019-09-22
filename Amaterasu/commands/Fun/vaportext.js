const Command = require("../../util/Command.js");

class Vaportext extends Command {
    constructor(client) {
      super(client, {
        name: "vaportext",
        description: "A E S T H E T I C",
        category: "Fun",
        usage: "vaportext <text>",
        aliases: ["vapor", "vapour", "vapourtext"]
      });
    }

    async run(message, args, level) {
        try {
            if (!args.length) return this.client.embed("commonError", message, "Please provide some text to make it ***A E S T H E T I C A L L Y   P L E A S I N G***."); 
            let msg = "";
            for (let i = 0; i < args.length; i++) {
                msg += args[i].toUpperCase().split("").join(" ") + "   ";
            }
            return message.channel.send(msg);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Vaportext;
