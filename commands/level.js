const Command = require("../base/Command.js");

class Level extends Command {
    constructor (client) {
        super(client, {
            name: "level",
            description: "Displays your permission level for your location.",
            category: "Info",
            usage: "level",
            guildOnly: true,
            aliases: ["none"]
        });
    }

    async run (message, args, level) {
        const friendly = this.client.config.permLevels.find(l => l.level === level).name;
        message.reply(`Your permission level is: ${level} - ${friendly}`);
    }
}

module.exports = Level;
