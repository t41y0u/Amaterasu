const Command = require("../../util/Command.js");

class Reverse extends Command {
    constructor (client) {
        super(client, {
            name: "reverse",
            description: "Reverses a text.",
            category: "Fun",
            usage: "reverse <text>",
            guildOnly: true,
        });
    }

    async run (message, args, level) {
        try {
            if (!args[0]) return this.client.embed("commonError", message, "Please provide some text for me search from reverse.");
            const str = args.join(' ');
            let msg = await message.channel.send(str.split('').reverse().join(''));
            msg.react('🔁');
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Reverse;
