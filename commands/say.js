const Command = require("../base/Command.js");

class Say extends Command {
    constructor (client) {
        super(client, {
            name: "say",
            description: "Make the bot say something.",
            usage: "say <something>",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const msg = args.join(" ");
        message.delete().catch(O_o=>{}); 
        message.channel.send(msg);
    }
}

module.exports = Say;
