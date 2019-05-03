const Command = require("../base/Command.js");

class ClearQueue extends Command {
    constructor (client) {
        super(client, {
            name: "clear",
            description: "Clears the entire queue.",
            category: "Music",
            usage: "clear",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        
    }
}

module.exports = ClearQueue;