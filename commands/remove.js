const Command = require("../base/Command.js");

class Remove extends Command {
    constructor (client) {
        super(client, {
            name: "remove",
            description: "Remove a song from the queue by position in the queue.",
            category: "Music",
            usage: "remove <position>",
            guildOnly: true,
            aliases: ["none"]
        });
    }
}

module.exports = Remove;