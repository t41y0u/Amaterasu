const Command = require("../base/Command.js");

class Spam extends Command {
    constructor (client) {
        super(client, {
            name: "spam",
            description: "Make the bot spam something for a number of time.",
            usage: "spam <number> <something>",
            guildOnly: true,
            aliases: ["none"],
            permLevel: "Server Owner"
        });
    }

    async run (message, args, level) {
        const num = Number(args[0]);
        if (num < 1 || num > 10) {
            message.delete().catch(O_o=>{});
            return message.reply("please provide a number between 1 and 10.");
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
    }
}

module.exports = Spam;