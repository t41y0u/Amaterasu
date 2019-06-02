const Command = require("../../util/Command.js");

class MyLevel extends Command {
    constructor(client) {
        super(client, {
            name: "mylevel",
            description: "Displays your permission level for this guild.",
            category: "Misc",
            usage: "mylevel",
            aliases: ["myrank", "level", "permlevel"],
            guildOnly: true
        });
    }

    async run(message, args, level) {
        try {
            const friendly = this.client.config.permLevels.find(l => l.level === level).name;
            message.reply(`your permission level is: **${level}** (${friendly}).`);
        } catch(err) {
            this.client.logger.error(err.stack);
            return this.client.embed("", message);
        }
    }
}

module.exports = MyLevel;
