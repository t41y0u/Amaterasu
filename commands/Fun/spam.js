const Command = require("../../util/Command.js");

class Spam extends Command {
    constructor (client) {
        super(client, {
            name: "spam",
            description: "Make the bot spam something for a number of time.",
            category: "Fun",
            usage: "spam <number> <something>",
            guildOnly: true,
            permLevel: "Server Owner"
        });
    }

    async run (message, args, level) {
        try {
            const num = Number(args[0]);
            if (num < 1 || num > 10) {
                return this.client.embed("commonError", message, "Please provide a number between 1 and 10.");
            }
            args.shift();
            const msg = args.join(" ");
            var cnt = 1;
            function sendSpamMessage() {
                message.channel.send(msg);
                if (cnt < num) {
                    cnt++;
                    sendSpamMessage();
                }
            }
            message.delete().catch(O_o=>{});
            sendSpamMessage();
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = Spam;